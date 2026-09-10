package io.digiservices.ecreditservice.drh.service.impl;

import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.drh.dto.PresenceDtos.*;
import io.digiservices.ecreditservice.drh.repository.DrhRepository;
import io.digiservices.ecreditservice.drh.repository.PresenceRepository;
import io.digiservices.ecreditservice.drh.service.DrhService;
import io.digiservices.ecreditservice.drh.service.PresenceService;
import io.digiservices.ecreditservice.exception.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

/**
 * Phase 4 du chantier Congés & Présences DRH : import du CSV badgeuse
 * (Date;User;Employee ID;First open door time;Last open door time;Working Time)
 * et rapprochement quotidien : personnel ACTIVE du fichier des salaires ×
 * pointages × congés/permissions validés. Statuts : PRESENT, RETARD,
 * DEPART_ANTICIPE, RETARD_ET_DEPART, ABSENT_JUSTIFIE, ABSENT_NON_JUSTIFIE.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PresenceServiceImpl implements PresenceService {

    private static final DateTimeFormatter DATE_FR = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    /** Export badgeuse « access attendance » : dates anglaises entre guillemets, ex. "Sep 01, 2026". */
    private static final DateTimeFormatter DATE_EN = DateTimeFormatter.ofPattern("MMM d, yyyy", Locale.ENGLISH);

    private final PresenceRepository presenceRepository;
    private final DrhRepository drhRepository;
    private final DrhService drhService;
    private final io.digiservices.ecreditservice.drh.service.MouvementService mouvementService;

    // ==================== Import ====================

    @Override
    @Transactional
    public ImportResultDto importerFichier(User drh, MultipartFile fichier) {
        exigerDrh(drh);
        if (fichier == null || fichier.isEmpty()) {
            throw new ValidationException("Choisissez un fichier CSV de la badgeuse");
        }
        int lues = 0, rapproches = 0, nonRapproches = 0, ignorees = 0;
        List<String> avertissements = new ArrayList<>();
        TreeSet<LocalDate> jours = new TreeSet<>();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(fichier.getInputStream(), StandardCharsets.UTF_8))) {
            String ligne;
            Character separateur = null;
            while ((ligne = reader.readLine()) != null) {
                ligne = ligne.strip();
                if (ligne.isEmpty()) continue;
                if (separateur == null) {
                    // L'export badgeuse existe en deux variantes : point-virgule ou virgule (avec dates entre guillemets)
                    separateur = ligne.contains(";") ? ';' : ',';
                }
                String[] c = decouperLigne(ligne, separateur);
                if (c.length < 5) { ignorees++; continue; }
                if (c[0].toLowerCase().startsWith("date")) continue; // en-tête
                lues++;
                try {
                    LocalDate jour = parseDate(c[0].strip());
                    String nomBrut = c[1].strip();
                    String employeeId = c[2].strip();
                    LocalTime entree = parseHeure(c[3].strip());
                    LocalTime sortie = parseHeure(c[4].strip());
                    if (entree == null && sortie == null) { ignorees++; continue; }
                    if (entree == null) entree = sortie;
                    if (sortie == null) sortie = entree;

                    boolean matriculeValide = !employeeId.isEmpty()
                            && employeeId.chars().allMatch(Character::isDigit)
                            && presenceRepository.matriculeConnu(employeeId);
                    if (matriculeValide) {
                        presenceRepository.upsertPointage(jour, employeeId, nomBrut, entree, sortie);
                        rapproches++;
                    } else {
                        presenceRepository.insererPointageNonRapproche(jour, nomBrut, entree, sortie);
                        nonRapproches++;
                    }
                    jours.add(jour);
                } catch (Exception e) {
                    ignorees++;
                    if (avertissements.size() < 10) {
                        avertissements.add("Ligne illisible : " + ligne.substring(0, Math.min(60, ligne.length())));
                    }
                }
            }
        } catch (Exception e) {
            throw new ValidationException("Lecture du fichier impossible : " + e.getMessage());
        }
        if (jours.isEmpty()) {
            throw new ValidationException("Aucun pointage exploitable dans ce fichier — formats acceptés : "
                    + "Date;User;Employee ID;… (dates JJ/MM/AAAA) ou l'export access-attendance "
                    + "Date,User,Employee ID,… (dates \"Sep 01, 2026\")");
        }

        int joursRapproches = rapprocherJours(jours);

        log.info("Import badgeuse : {} lignes, {} rapprochées, {} non rapprochées, {} ignorées, {} jours recalculés",
                lues, rapproches, nonRapproches, ignorees, joursRapproches);
        return ImportResultDto.builder()
                .lignesLues(lues)
                .pointagesRapproches(rapproches)
                .pointagesNonRapproches(nonRapproches)
                .lignesIgnorees(ignorees)
                .premierJour(jours.first())
                .dernierJour(jours.last())
                .joursRapproches(joursRapproches)
                .avertissements(avertissements)
                .build();
    }

    /** Découpe une ligne CSV en respectant les champs entre guillemets (ex. "Sep 01, 2026"). */
    private static String[] decouperLigne(String ligne, char separateur) {
        List<String> champs = new ArrayList<>();
        StringBuilder courant = new StringBuilder();
        boolean entreGuillemets = false;
        for (int i = 0; i < ligne.length(); i++) {
            char ch = ligne.charAt(i);
            if (ch == '"') {
                entreGuillemets = !entreGuillemets;
            } else if (ch == separateur && !entreGuillemets) {
                champs.add(courant.toString());
                courant.setLength(0);
            } else {
                courant.append(ch);
            }
        }
        champs.add(courant.toString());
        return champs.toArray(new String[0]);
    }

    private static LocalDate parseDate(String s) {
        String v = s.replace("\"", "").strip();
        if (v.contains("/")) return LocalDate.parse(v, DATE_FR);
        if (v.matches("[A-Za-z]{3,}\\.? .*")) {
            return LocalDate.parse(v.replace(".", ""), DATE_EN);
        }
        return LocalDate.parse(v.length() > 10 ? v.substring(0, 10) : v);
    }

    private static LocalTime parseHeure(String s) {
        if (s == null || s.isEmpty() || s.equals("-")) return null;
        return LocalTime.parse(s.length() == 5 ? s + ":00" : s);
    }

    // ==================== Rapprochement ====================

    /** Recalcule le statut de chaque agent du personnel pour chaque jour ouvré de la liste. */
    private int rapprocherJours(Set<LocalDate> jours) {
        LocalTime heureArrivee = LocalTime.parse(presenceRepository.parametreTexte("PRESENCE_HEURE_ARRIVEE", "08:00"));
        LocalTime heureSortie = LocalTime.parse(presenceRepository.parametreTexte("PRESENCE_HEURE_SORTIE", "16:30"));
        LocalTime heureSortieVendredi = LocalTime.parse(
                presenceRepository.parametreTexte("PRESENCE_HEURE_SORTIE_VENDREDI", "14:00"));
        int tolerance = Integer.parseInt(presenceRepository.parametreTexte("PRESENCE_TOLERANCE_MIN", "15"));
        List<Map<String, Object>> personnel = presenceRepository.personnelActif();

        LocalDate min = jours.stream().min(LocalDate::compareTo).orElseThrow();
        LocalDate max = jours.stream().max(LocalDate::compareTo).orElseThrow();
        Set<LocalDate> feries = new HashSet<>(drhRepository.joursFeries(min, max));

        int calcules = 0;
        for (LocalDate jour : jours) {
            if (jour.getDayOfWeek() == DayOfWeek.SUNDAY || feries.contains(jour)) {
                continue; // jour non ouvré : pas de contrôle de présence
            }
            // Purge du jour : ne garde que le personnel badgé contrôlé ci-dessous
            presenceRepository.supprimerPresencesJour(jour);
            LocalTime sortieDuJour = jour.getDayOfWeek() == DayOfWeek.FRIDAY ? heureSortieVendredi : heureSortie;
            Map<String, LocalTime[]> pointages = presenceRepository.pointagesDuJour(jour);
            for (Map<String, Object> agent : personnel) {
                String matricule = String.valueOf(agent.get("matricule"));
                String nom = (agent.get("prenom") + " " + agent.get("nom")).strip();
                Long userId = agent.get("user_id") == null ? null : ((Number) agent.get("user_id")).longValue();
                LocalTime[] p = pointages.get(matricule);

                if (p == null) {
                    String justification = null;
                    if (userId != null) {
                        if (presenceRepository.congeCouvreJour(userId, jour)) justification = "CONGE";
                        else if (presenceRepository.permissionCouvreJour(userId, jour)) justification = "PERMISSION";
                    }
                    presenceRepository.upsertPresenceJour(jour, matricule, nom, userId,
                            justification != null ? "ABSENT_JUSTIFIE" : "ABSENT_NON_JUSTIFIE",
                            0, 0, justification, null, null);
                } else {
                    long minutesRetard = Math.max(0,
                            Duration.between(heureArrivee, p[0]).toMinutes() - tolerance);
                    long minutesDepart = Math.max(0,
                            Duration.between(p[1], sortieDuJour).toMinutes() - tolerance);
                    String statut = minutesRetard > 0 && minutesDepart > 0 ? "RETARD_ET_DEPART"
                            : minutesRetard > 0 ? "RETARD"
                            : minutesDepart > 0 ? "DEPART_ANTICIPE"
                            : "PRESENT";
                    presenceRepository.upsertPresenceJour(jour, matricule, nom, userId, statut,
                            (int) minutesRetard, (int) minutesDepart, null, p[0], p[1]);
                }
            }
            calcules++;
        }
        return calcules;
    }

    // ==================== Consultation ====================

    @Override
    public List<PresenceJourDto> presences(User drh, LocalDate du, LocalDate au, String statut) {
        exigerDrh(drh);
        List<PresenceJourDto> presences = presenceRepository.presencesPeriode(du, au, statut);
        enrichirDepuisMouvements(presences, du, au);
        presences.forEach(p -> p.setEnCours(jourEnCours(p.getJour())));
        return presences;
    }

    /**
     * Jour courant tant que l'heure de sortie réglementaire n'est pas passée : les statuts
     * calculés par le rapprochement horaire sont provisoires (départs anticipés et absents
     * apparents tant que la journée n'est pas terminée).
     */
    private boolean jourEnCours(LocalDate jour) {
        ZonedDateTime maintenant = ZonedDateTime.now(ZoneId.of("Africa/Conakry"));
        if (jour == null || !jour.equals(maintenant.toLocalDate())) return false;
        LocalTime sortie = jour.getDayOfWeek() == DayOfWeek.FRIDAY
                ? LocalTime.parse(presenceRepository.parametreTexte("PRESENCE_HEURE_SORTIE_VENDREDI", "14:00"))
                : LocalTime.parse(presenceRepository.parametreTexte("PRESENCE_HEURE_SORTIE", "16:30"));
        return maintenant.toLocalTime().isBefore(sortie);
    }

    /** Ajoute le temps hors bureau / dépassement de pause reconstruit depuis le journal des mouvements. */
    private void enrichirDepuisMouvements(List<PresenceJourDto> presences, LocalDate du, LocalDate au) {
        if (presences.isEmpty()) return;
        var parAgent = mouvementService.reconstituerPeriode(du, au);
        for (PresenceJourDto p : presences) {
            var agent = parAgent.get(p.getMatricule());
            if (agent == null) continue;
            agent.getJours().stream()
                    .filter(j -> j.getJour().equals(p.getJour()))
                    .findFirst()
                    .ifPresent(j -> {
                        p.setNbSortiesTravail(j.getNbSortiesTravail());
                        p.setMinutesHorsBureau(j.getMinutesHorsBureau());
                        p.setMinutesDepassementPause(j.getMinutesDepassementPause());
                    });
        }
    }

    @Override
    public List<SyntheseJourDto> synthese(User drh, LocalDate du, LocalDate au) {
        exigerDrh(drh);
        List<SyntheseJourDto> synthese = presenceRepository.synthesePeriode(du, au);
        synthese.forEach(s -> s.setEnCours(jourEnCours(s.getJour())));
        return synthese;
    }

    @Override
    public List<PointageNonRapprocheDto> nonRapproches(User drh, LocalDate du, LocalDate au) {
        exigerDrh(drh);
        return presenceRepository.pointagesNonRapproches(du, au);
    }

    @Override
    @Transactional
    public int recalculer(User drh, LocalDate du, LocalDate au) {
        exigerDrh(drh);
        return recalculerInterne(du, au);
    }

    /** Usage interne (webhook UniFi / tâche planifiée) : sans contrôle d'habilitation. */
    @Override
    @Transactional
    public int recalculerInterne(LocalDate du, LocalDate au) {
        Set<LocalDate> jours = new TreeSet<>();
        for (LocalDate d = du; !d.isAfter(au); d = d.plusDays(1)) {
            jours.add(d);
        }
        return rapprocherJours(jours);
    }

    private void exigerDrh(User user) {
        if (!drhService.estHabiliteDrh(user)) {
            throw new ValidationException("Action réservée à la DRH");
        }
    }
}
