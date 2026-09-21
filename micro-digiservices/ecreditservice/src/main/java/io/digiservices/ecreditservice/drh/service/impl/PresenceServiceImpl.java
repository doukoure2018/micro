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
        LocalTime heureArrivee = LocalTime.parse(presenceRepository.parametreTexte("PRESENCE_HEURE_ARRIVEE", "08:30"));
        LocalTime heureSortie = LocalTime.parse(presenceRepository.parametreTexte("PRESENCE_HEURE_SORTIE", "16:30"));
        LocalTime heureSortieVendredi = LocalTime.parse(
                presenceRepository.parametreTexte("PRESENCE_HEURE_SORTIE_VENDREDI", "14:00"));
        LocalTime heureSortieSamedi = LocalTime.parse(
                presenceRepository.parametreTexte("PRESENCE_HEURE_SORTIE_SAMEDI", "14:00"));
        // V150 : marges distinctes — retard à partir de 08:36 (5 min), départ anticipé avant 16:25 (5 min)
        int toleranceArrivee = toleranceArrivee();
        int toleranceDepart = toleranceDepart();
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
            LocalTime sortieDuJour = heureSortieDuJour(jour, heureSortie, heureSortieVendredi, heureSortieSamedi);
            Map<String, LocalTime[]> pointages = presenceRepository.pointagesDuJour(jour);
            Map<String, String[]> declarations = presenceRepository.declarationsCouvrantJour(jour);
            for (Map<String, Object> agent : personnel) {
                String matricule = String.valueOf(agent.get("matricule"));
                String nom = (agent.get("prenom") + " " + agent.get("nom")).strip();
                Long userId = agent.get("user_id") == null ? null : ((Number) agent.get("user_id")).longValue();
                LocalTime[] p = pointages.get(matricule);
                String[] declaration = declarations.get(matricule);
                String motifDeclare = declaration == null ? null : declaration[0];
                String observation = declaration == null ? null : libelleObservation(declaration[0], declaration[1]);

                if ("OUBLI_BADGE".equals(motifDeclare)) {
                    // Déclaré présent par la DRH : ni retard ni départ anticipé, les heures badgées
                    // (partielles ou absentes) sont conservées à titre indicatif
                    presenceRepository.upsertPresenceJour(jour, matricule, nom, userId, "PRESENT_DECLARE",
                            0, 0, null, observation, p == null ? null : p[0], p == null ? null : p[1]);
                } else if (p == null) {
                    String justification = motifDeclare; // MISSION / FORMATION / MALADIE / AUTRE
                    if (justification == null && userId != null) {
                        if (presenceRepository.congeCouvreJour(userId, jour)) justification = "CONGE";
                        else if (presenceRepository.permissionCouvreJour(userId, jour)) justification = "PERMISSION";
                    }
                    presenceRepository.upsertPresenceJour(jour, matricule, nom, userId,
                            justification != null ? "ABSENT_JUSTIFIE" : "ABSENT_NON_JUSTIFIE",
                            0, 0, justification, observation, null, null);
                } else {
                    long minutesRetard = Math.max(0,
                            Duration.between(heureArrivee, p[0]).toMinutes() - toleranceArrivee);
                    long minutesDepart = Math.max(0,
                            Duration.between(p[1], sortieDuJour).toMinutes() - toleranceDepart);
                    String statut = minutesRetard > 0 && minutesDepart > 0 ? "RETARD_ET_DEPART"
                            : minutesRetard > 0 ? "RETARD"
                            : minutesDepart > 0 ? "DEPART_ANTICIPE"
                            : "PRESENT";
                    presenceRepository.upsertPresenceJour(jour, matricule, nom, userId, statut,
                            (int) minutesRetard, (int) minutesDepart, null, observation, p[0], p[1]);
                }
            }
            calcules++;
        }
        return calcules;
    }

    /** V150 : tolérance d'arrivée (clé dédiée, repli sur l'ancienne clé unique). */
    private int toleranceArrivee() {
        return Integer.parseInt(presenceRepository.parametreTexte("PRESENCE_TOLERANCE_ARRIVEE_MIN",
                presenceRepository.parametreTexte("PRESENCE_TOLERANCE_MIN", "5")));
    }

    /** V150 : tolérance de départ (clé dédiée, repli sur l'ancienne clé unique). */
    private int toleranceDepart() {
        return Integer.parseInt(presenceRepository.parametreTexte("PRESENCE_TOLERANCE_DEPART_MIN",
                presenceRepository.parametreTexte("PRESENCE_TOLERANCE_MIN", "5")));
    }

    static final Map<String, String> LIBELLES_MOTIF = Map.of(
            "OUBLI_BADGE", "Oubli de badge",
            "MISSION", "Mission",
            "FORMATION", "Formation",
            "MALADIE", "Maladie",
            "AUTRE", "Autre");

    private static String libelleObservation(String motif, String commentaire) {
        String base = LIBELLES_MOTIF.getOrDefault(motif, motif);
        String texte = (commentaire == null || commentaire.isBlank()) ? base : base + " : " + commentaire.strip();
        return texte.length() > 300 ? texte.substring(0, 300) : texte;
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
        LocalTime sortie = heureSortieDuJour(jour,
                LocalTime.parse(presenceRepository.parametreTexte("PRESENCE_HEURE_SORTIE", "16:30")),
                LocalTime.parse(presenceRepository.parametreTexte("PRESENCE_HEURE_SORTIE_VENDREDI", "14:00")),
                LocalTime.parse(presenceRepository.parametreTexte("PRESENCE_HEURE_SORTIE_SAMEDI", "14:00")));
        return maintenant.toLocalTime().isBefore(sortie);
    }

    /** Fin de journée réglementaire : 16h30 du lundi au jeudi, 13h00 le vendredi, 14h00 le samedi (paramétrables). */
    static LocalTime heureSortieDuJour(LocalDate jour, LocalTime standard, LocalTime vendredi, LocalTime samedi) {
        return switch (jour.getDayOfWeek()) {
            case FRIDAY -> vendredi;
            case SATURDAY -> samedi;
            default -> standard;
        };
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

    /** V150 : moyennes par jour ouvré, semaine par semaine (lundi -> samedi), à partir de la synthèse quotidienne. */
    @Override
    public List<SyntheseSemaineDto> syntheseSemaine(User drh, LocalDate du, LocalDate au) {
        exigerDrh(drh);
        List<SyntheseJourDto> jours = presenceRepository.synthesePeriode(du, au);
        Map<LocalDate, List<SyntheseJourDto>> parSemaine = new java.util.TreeMap<>();
        for (SyntheseJourDto j : jours) {
            if (j.getTotal() == 0) continue;
            LocalDate lundi = j.getJour().with(java.time.temporal.TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
            parSemaine.computeIfAbsent(lundi, k -> new ArrayList<>()).add(j);
        }
        List<SyntheseSemaineDto> resultat = new ArrayList<>();
        java.time.format.DateTimeFormatter fmt = java.time.format.DateTimeFormatter.ofPattern("dd/MM");
        for (var e : parSemaine.entrySet()) {
            List<SyntheseJourDto> s = e.getValue();
            int n = s.size();
            long presentsTotal = s.stream().mapToLong(SyntheseJourDto::getPresentsTotal).sum();
            long effectif = s.stream().mapToLong(SyntheseJourDto::getTotal).sum();
            LocalDate samedi = e.getKey().plusDays(5);
            resultat.add(SyntheseSemaineDto.builder()
                    .semaine("Semaine du " + e.getKey().format(fmt) + " au " + samedi.format(fmt))
                    .du(e.getKey()).au(samedi)
                    .joursOuvres(n)
                    .presentsTotalMoyen(arrondi((double) presentsTotal / n))
                    .retardsMoyen(arrondi(s.stream().mapToLong(SyntheseJourDto::getRetards).sum() / (double) n))
                    .departsAnticipesMoyen(arrondi(s.stream().mapToLong(SyntheseJourDto::getDepartsAnticipes).sum() / (double) n))
                    .absentsJustifiesMoyen(arrondi(s.stream().mapToLong(SyntheseJourDto::getAbsentsJustifies).sum() / (double) n))
                    .absentsNonJustifiesMoyen(arrondi(s.stream().mapToLong(SyntheseJourDto::getAbsentsNonJustifies).sum() / (double) n))
                    .effectifMoyen(arrondi((double) effectif / n))
                    .tauxPresence(effectif == 0 ? 0 : arrondi(100.0 * presentsTotal / effectif))
                    .enCours(s.stream().anyMatch(j -> jourEnCours(j.getJour())))
                    .build());
        }
        return resultat;
    }

    private static double arrondi(double v) {
        return Math.round(v * 10.0) / 10.0;
    }

    // ==================== V150 : déclarations manuelles DRH ====================

    @Override
    @Transactional
    public DeclarationDto declarer(User drh, DeclarationRequest request) {
        exigerDrh(drh);
        if (request == null || request.getMatricule() == null || request.getMatricule().isBlank()) {
            throw new ValidationException("Le matricule est obligatoire");
        }
        if (!presenceRepository.matriculeConnu(request.getMatricule().strip())) {
            throw new ValidationException("Matricule inconnu dans le fichier du personnel : " + request.getMatricule());
        }
        if (request.getJourDebut() == null) {
            throw new ValidationException("La date de début est obligatoire");
        }
        if (request.getJourFin() == null) {
            request.setJourFin(request.getJourDebut());
        }
        if (request.getJourFin().isBefore(request.getJourDebut())) {
            throw new ValidationException("La date de fin doit être postérieure ou égale à la date de début");
        }
        if (java.time.temporal.ChronoUnit.DAYS.between(request.getJourDebut(), request.getJourFin()) > 60) {
            throw new ValidationException("Une déclaration couvre au plus 60 jours");
        }
        if (request.getMotif() == null || !LIBELLES_MOTIF.containsKey(request.getMotif())) {
            throw new ValidationException("Motif invalide (attendu : OUBLI_BADGE, MISSION, FORMATION, MALADIE, AUTRE)");
        }
        if (request.getCommentaire() != null && request.getCommentaire().length() > 300) {
            throw new ValidationException("Le commentaire ne peut pas dépasser 300 caractères");
        }
        request.setMatricule(request.getMatricule().strip());
        long id = presenceRepository.insererDeclaration(request, drh.getUserId(),
                (drh.getFirstName() + " " + drh.getLastName()).strip());
        // Le rapprochement tient compte de la déclaration dès maintenant (et à chaque recalcul horaire)
        recalculerInterne(request.getJourDebut(), request.getJourFin());
        log.info("Déclaration présence {} : {} {} du {} au {} par {}", id, request.getMotif(), request.getMatricule(),
                request.getJourDebut(), request.getJourFin(), drh.getUserId());
        return presenceRepository.declarationParId(id);
    }

    @Override
    public List<DeclarationDto> declarations(User drh, LocalDate du, LocalDate au, String matricule) {
        exigerDrh(drh);
        return presenceRepository.declarationsPeriode(du, au, matricule);
    }

    @Override
    @Transactional
    public void supprimerDeclaration(User drh, long declarationId) {
        exigerDrh(drh);
        DeclarationDto d = presenceRepository.declarationParId(declarationId);
        if (d == null || !d.isActif()) {
            throw new ValidationException("Déclaration introuvable ou déjà retirée");
        }
        presenceRepository.desactiverDeclaration(declarationId);
        recalculerInterne(d.getJourDebut(), d.getJourFin());
    }

    @Override
    public List<BadgeSansPointageDto> badgesSansPointage(User drh, int jours) {
        exigerDrh(drh);
        return presenceRepository.badgesSansPointage(LocalDate.now(ZoneId.of("Africa/Conakry")).minusDays(Math.max(1, jours)));
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
