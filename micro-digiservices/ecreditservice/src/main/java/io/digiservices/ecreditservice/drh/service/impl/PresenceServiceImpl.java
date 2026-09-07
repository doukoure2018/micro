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
import java.time.format.DateTimeFormatter;
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

    private final PresenceRepository presenceRepository;
    private final DrhRepository drhRepository;
    private final DrhService drhService;

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
            while ((ligne = reader.readLine()) != null) {
                ligne = ligne.strip();
                if (ligne.isEmpty()) continue;
                String[] c = ligne.split(";", -1);
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
            throw new ValidationException("Aucun pointage exploitable dans ce fichier — vérifiez le format "
                    + "(Date;User;Employee ID;First open door time;Last open door time)");
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

    private static LocalDate parseDate(String s) {
        if (s.contains("/")) return LocalDate.parse(s, DATE_FR);
        return LocalDate.parse(s.length() > 10 ? s.substring(0, 10) : s);
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
                            Duration.between(p[1], heureSortie).toMinutes() - tolerance);
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
        return presenceRepository.presencesPeriode(du, au, statut);
    }

    @Override
    public List<SyntheseJourDto> synthese(User drh, LocalDate du, LocalDate au) {
        exigerDrh(drh);
        return presenceRepository.synthesePeriode(du, au);
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
