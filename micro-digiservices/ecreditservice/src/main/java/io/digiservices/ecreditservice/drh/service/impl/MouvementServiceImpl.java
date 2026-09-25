package io.digiservices.ecreditservice.drh.service.impl;

import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.drh.dto.MouvementDtos.BadgeCorrespondanceDto;
import io.digiservices.ecreditservice.drh.dto.MouvementDtos.BadgeInconnuDto;
import io.digiservices.ecreditservice.drh.dto.MouvementDtos.ImportMouvementsResultDto;
import io.digiservices.ecreditservice.drh.dto.MouvementDtos.MouvementDto;
import io.digiservices.ecreditservice.drh.dto.MouvementDtos.MouvementJourDto;
import io.digiservices.ecreditservice.drh.dto.MouvementDtos.MouvementPersonneDto;
import io.digiservices.ecreditservice.drh.dto.MouvementDtos.DepartementStatsDto;
import io.digiservices.ecreditservice.drh.dto.MouvementDtos.LigneTableauBordDto;
import io.digiservices.ecreditservice.drh.dto.MouvementDtos.RecidiveRetardDto;
import io.digiservices.ecreditservice.drh.dto.MouvementDtos.SortieDto;
import io.digiservices.ecreditservice.drh.dto.MouvementDtos.SyntheseMouvementDto;
import io.digiservices.ecreditservice.drh.dto.MouvementDtos.TableauBordDto;
import io.digiservices.ecreditservice.drh.dto.PresenceDtos.PresenceJourDto;
import io.digiservices.ecreditservice.drh.dto.PresenceDtos.SyntheseJourDto;
import com.fasterxml.jackson.databind.JsonNode;
import io.digiservices.ecreditservice.drh.repository.DrhRepository;
import io.digiservices.ecreditservice.drh.repository.MouvementRepository;
import io.digiservices.ecreditservice.drh.repository.PresenceRepository;
import io.digiservices.ecreditservice.drh.service.DrhService;
import io.digiservices.ecreditservice.drh.service.MouvementService;
import io.digiservices.ecreditservice.exception.ValidationException;
import io.digiservices.ecreditservice.service.SmsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.time.DayOfWeek;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Gestion des mouvements — phase 1 : import du journal de la porte (export access-log :
 * Time,Event,Event Message,Actor User,…,Entry/Exit,Credential,Result) avec identification
 * du personnel par numéro de badge appris, sinon par nom normalisé, et journal consultable.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MouvementServiceImpl implements MouvementService {

    /** Horodatage de l'export : "Sep  7, 2026, 20:27:16" (espaces multiples possibles). */
    private static final DateTimeFormatter HORODATAGE_EN =
            DateTimeFormatter.ofPattern("MMM d, yyyy, HH:mm:ss", Locale.ENGLISH);
    private static final Pattern BADGE_PARENTHESES = Pattern.compile("\\((\\d+)\\)");
    /** Clé de nom en collision (homonymes) : jamais rapprochée automatiquement. */
    private static final String NOM_AMBIGU = "\0AMBIGU";
    /** Webhook (heure de livraison) et CSV (heure de l’événement) : même badgeage à quelques secondes près. */
    private static final int TOLERANCE_DOUBLON_SECONDES = 150;

    private final MouvementRepository mouvementRepository;
    private final PresenceRepository presenceRepository;
    private final DrhRepository drhRepository;
    private final DrhService drhService;
    private final SmsService smsService;
    private final io.digiservices.ecreditservice.service.SalaireService salaireService;

    // ==================== Import ====================

    @Override
    @Transactional
    public ImportMouvementsResultDto importerFichier(User drh, MultipartFile fichier) {
        exigerDrhEcriture(drh);
        if (fichier == null || fichier.isEmpty()) {
            throw new ValidationException("Choisissez un fichier CSV du journal de la porte (access-log)");
        }

        Map<String, String> nomsPersonnel = chargerNomsPersonnel();
        Map<String, String> badgesConnus = new HashMap<>();
        int lues = 0, identifies = 0, visiteurs = 0, nonIdentifies = 0, anomalies = 0,
                doublons = 0, ignorees = 0, badgesAppris = 0;
        List<String> avertissements = new ArrayList<>();
        Set<String> nomsInconnus = new HashSet<>();
        TreeSet<LocalDate> jours = new TreeSet<>();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(fichier.getInputStream(), StandardCharsets.UTF_8))) {
            String ligne;
            while ((ligne = reader.readLine()) != null) {
                ligne = ligne.replace("\uFEFF", "").strip();
                if (ligne.isEmpty()) continue;
                if (ligne.toLowerCase().startsWith("time,")) continue; // en-tête
                String[] c = decouperLigne(ligne);
                if (c.length < 11) { ignorees++; continue; }
                lues++;
                try {
                    if (!"access.door.unlock".equals(c[1].strip())) { ignorees++; continue; }
                    String sens = switch (c[8].strip().toLowerCase()) {
                        case "entry" -> "ENTRY";
                        case "exit" -> "EXIT";
                        default -> null;
                    };
                    if (sens == null) { ignorees++; continue; }

                    LocalDateTime quand = LocalDateTime.parse(
                            c[0].replace("\"", "").replaceAll("\\s+", " ").strip(), HORODATAGE_EN);
                    String nomBrut = c[3].strip();
                    String porte = c[5].strip();
                    String credential = c[9].strip();
                    String resultat = c[10].strip().isEmpty() ? "ACCESS" : c[10].strip();
                    String badgeNo = extraireBadge(credential);
                    boolean estVisiteur = normaliser(nomBrut).startsWith("VISITEUR");

                    String matricule = null;
                    if ("ACCESS".equals(resultat) && !estVisiteur) {
                        matricule = identifier(nomBrut, badgeNo, nomsPersonnel, badgesConnus);
                        if (matricule != null && badgeNo != null
                                && !badgesConnus.containsKey(badgeNo)) {
                            badgesAppris += mouvementRepository.apprendreBadge(badgeNo, matricule);
                            badgesConnus.put(badgeNo, matricule);
                        }
                    }

                    if (mouvementRepository.existeMouvementProche(quand.toLocalDate(), quand.toLocalTime(),
                            sens, resultat, nomBrut, matricule, TOLERANCE_DOUBLON_SECONDES)) {
                        doublons++;
                        continue;
                    }
                    int insere = mouvementRepository.insererMouvement(quand.toLocalDate(), quand.toLocalTime(),
                            sens, matricule, nomBrut, badgeNo, credential, resultat, estVisiteur, porte, null);
                    if (insere == 0) { doublons++; continue; }
                    jours.add(quand.toLocalDate());
                    if (!"ACCESS".equals(resultat)) anomalies++;
                    else if (estVisiteur) visiteurs++;
                    else if (matricule != null) identifies++;
                    else { nonIdentifies++; nomsInconnus.add(nomBrut); }
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
        if (jours.isEmpty() && doublons == 0) {
            throw new ValidationException("Aucun mouvement exploitable dans ce fichier — format attendu : "
                    + "export access-log (Time,Event,…,Entry/Exit,Credential,Result)");
        }
        nomsInconnus.stream().sorted().limit(10 - Math.min(avertissements.size(), 10))
                .forEach(n -> avertissements.add("Nom non reconnu dans le personnel : " + n));

        log.info("Import mouvements : {} lignes, {} identifiés, {} visiteurs, {} non identifiés, "
                        + "{} anomalies, {} doublons, {} badges appris",
                lues, identifies, visiteurs, nonIdentifies, anomalies, doublons, badgesAppris);
        return ImportMouvementsResultDto.builder()
                .lignesLues(lues)
                .personnelsIdentifies(identifies)
                .visiteurs(visiteurs)
                .nonIdentifies(nonIdentifies)
                .anomalies(anomalies)
                .doublonsIgnores(doublons)
                .lignesIgnorees(ignorees)
                .badgesAppris(badgesAppris)
                .premierJour(jours.isEmpty() ? null : jours.first())
                .dernierJour(jours.isEmpty() ? null : jours.last())
                .avertissements(avertissements)
                .build();
    }

    /** Badge d'abord (fiable une fois appris), sinon nom normalisé sans les homonymes. */
    private String identifier(String nomBrut, String badgeNo,
                              Map<String, String> nomsPersonnel, Map<String, String> badgesConnus) {
        if (badgeNo != null) {
            String matricule = badgesConnus.computeIfAbsent(badgeNo,
                    b -> mouvementRepository.matriculePourBadge(b).orElse(null));
            if (matricule != null) return matricule;
        }
        String matricule = nomsPersonnel.get(normaliser(nomBrut));
        if (matricule == null) {
            // La badgeuse écrit parfois les mots dans un autre ordre (« AISSATOU SAMB MANDELA »)
            matricule = nomsPersonnel.get(trierMots(normaliser(nomBrut)));
        }
        return NOM_AMBIGU.equals(matricule) ? null : matricule;
    }

    /** Clés « PRENOM NOM », « NOM PRENOM » et mots triés ; les homonymes sont neutralisés. */
    private Map<String, String> chargerNomsPersonnel() {
        Map<String, String> map = new HashMap<>();
        for (Map<String, Object> p : mouvementRepository.personnelActifNoms()) {
            String matricule = String.valueOf(p.get("matricule"));
            String nom = String.valueOf(p.get("nom")), prenom = String.valueOf(p.get("prenom"));
            for (String cle : new String[]{normaliser(prenom + " " + nom), normaliser(nom + " " + prenom),
                    trierMots(normaliser(prenom + " " + nom))}) {
                if (cle.isEmpty()) continue;
                String existant = map.get(cle);
                if (existant != null && !existant.equals(matricule)) map.put(cle, NOM_AMBIGU);
                else map.put(cle, matricule);
            }
        }
        return map;
    }

    private static String trierMots(String normalise) {
        return java.util.Arrays.stream(normalise.split(" ")).sorted()
                .collect(java.util.stream.Collectors.joining(" "));
    }

    /** « NFC 30cd196f(100037) » -> 100037 ; « FACE 7ED93F91 » -> 7ED93F91 ; « nfc » -> null. */
    private static String extraireBadge(String credential) {
        if (credential == null || credential.isBlank()) return null;
        Matcher m = BADGE_PARENTHESES.matcher(credential);
        if (m.find()) return m.group(1);
        String[] parts = credential.strip().split("\\s+");
        return parts.length >= 2 ? parts[parts.length - 1] : null;
    }

    /** Majuscules sans accents, espaces normalisés — pour comparer badgeuse et fichier du personnel. */
    private static String normaliser(String s) {
        if (s == null) return "";
        return Normalizer.normalize(s, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toUpperCase(Locale.ROOT)
                .replaceAll("[^A-Z0-9]+", " ")
                .strip();
    }

    /** Découpe une ligne CSV virgule en respectant les champs entre guillemets. */
    private static String[] decouperLigne(String ligne) {
        List<String> champs = new ArrayList<>();
        StringBuilder courant = new StringBuilder();
        boolean entreGuillemets = false;
        for (int i = 0; i < ligne.length(); i++) {
            char ch = ligne.charAt(i);
            if (ch == '"') {
                entreGuillemets = !entreGuillemets;
            } else if (ch == ',' && !entreGuillemets) {
                champs.add(courant.toString());
                courant.setLength(0);
            } else {
                courant.append(ch);
            }
        }
        champs.add(courant.toString());
        return champs.toArray(new String[0]);
    }

    // ==================== Consultation ====================

    @Override
    public List<MouvementDto> mouvements(User drh, LocalDate du, LocalDate au, String type) {
        exigerDrh(drh);
        return mouvementRepository.mouvementsPeriode(du, au, type);
    }

    // ==================== Intervalles sortie -> retour (phase 2) ====================

    private record Evt(LocalTime heure, boolean entree) {
    }

    @Override
    public List<SyntheseMouvementDto> synthese(User drh, LocalDate du, LocalDate au) {
        Set<String> perimetre = perimetreMatricules(drh);
        List<SyntheseMouvementDto> lignes = new ArrayList<>();
        for (MouvementPersonneDto agent : reconstituer(du, au, null).values()) {
            if (perimetre != null && !perimetre.contains(agent.getMatricule())) continue;
            int pauses = 0, sortiesTravail = 0, horsBureau = 0, depassement = 0, nonCloturees = 0;
            for (MouvementJourDto j : agent.getJours()) {
                sortiesTravail += j.getNbSortiesTravail();
                horsBureau += j.getMinutesHorsBureau();
                depassement += j.getMinutesDepassementPause();
                nonCloturees += j.getNonCloturees();
                pauses += (int) j.getSorties().stream()
                        .filter(s -> "PAUSE".equals(s.getClassement()) || "PAUSE_DEPASSEE".equals(s.getClassement()))
                        .count();
            }
            lignes.add(SyntheseMouvementDto.builder()
                    .matricule(agent.getMatricule())
                    .nom(agent.getNom())
                    .joursActifs(agent.getJours().size())
                    .nbPauses(pauses)
                    .nbSortiesTravail(sortiesTravail)
                    .minutesHorsBureau(horsBureau)
                    .minutesDepassementPause(depassement)
                    .nonCloturees(nonCloturees)
                    .build());
        }
        lignes.sort((a, b) -> Integer.compare(
                b.getMinutesDepassementPause() + b.getMinutesHorsBureau(),
                a.getMinutesDepassementPause() + a.getMinutesHorsBureau()));
        return lignes;
    }

    @Override
    public MouvementPersonneDto personne(User drh, String matricule, LocalDate du, LocalDate au) {
        Set<String> perimetre = perimetreMatricules(drh);
        if (perimetre != null && !perimetre.contains(matricule)) {
            throw new ValidationException("Ce salarié n'appartient pas à votre département");
        }
        MouvementPersonneDto agent = reconstituer(du, au, matricule).get(matricule);
        return agent != null ? agent
                : MouvementPersonneDto.builder().matricule(matricule).jours(List.of()).build();
    }

    @Override
    public List<MouvementPersonneDto> details(User drh, LocalDate du, LocalDate au) {
        Set<String> perimetre = perimetreMatricules(drh);
        List<MouvementPersonneDto> agents = new ArrayList<>();
        for (MouvementPersonneDto agent : reconstituer(du, au, null).values()) {
            if (perimetre != null && !perimetre.contains(agent.getMatricule())) continue;
            agents.add(agent);
        }
        agents.sort((a, b) -> a.getNom().compareToIgnoreCase(b.getNom()));
        return agents;
    }

    /**
     * Périmètre de consultation des mouvements : la DRH voit tout (null) ; un responsable
     * de département actif voit les matricules de son département ; sinon refus.
     */
    private Set<String> perimetreMatricules(User user) {
        if (drhService.aHabilitationLecture(user, DrhServiceImpl.F_MOUVEMENTS)) return null; // V154 : DRH, délégué, DGA
        var membre = drhRepository.membreActifDeUser(user.getUserId())
                .filter(m -> Boolean.TRUE.equals(m.getEstResponsable()))
                .orElseThrow(() -> new ValidationException(
                        "Action réservée à la DRH ou au responsable d'un département"));
        Set<String> matricules = new HashSet<>();
        for (var m : drhRepository.listeMembres(membre.getDepartementId())) {
            if (Boolean.TRUE.equals(m.getActif()) && m.getMatricule() != null && !m.getMatricule().isBlank()) {
                matricules.add(m.getMatricule());
            }
        }
        return matricules;
    }

    /** Regroupe les événements ACCESS identifiés par agent puis par jour et reconstruit les intervalles. */
    private Map<String, MouvementPersonneDto> reconstituer(LocalDate du, LocalDate au, String matricule) {
        LocalTime pauseDebut = LocalTime.parse(mouvementRepository.parametreTexte("MOUVEMENT_PAUSE_DEBUT", "13:00"));
        LocalTime pauseFin = LocalTime.parse(mouvementRepository.parametreTexte("MOUVEMENT_PAUSE_FIN", "14:30"));
        // V150 : la pause dure 1 h, prise n'importe où dans la fenêtre 13:00-14:30 (décalage 13:30-14:30 toléré)
        pauseDuree = Integer.parseInt(mouvementRepository.parametreTexte("MOUVEMENT_PAUSE_DUREE_MIN", "60"));
        // Hors des horaires de travail (avant le début, après la fin), les sorties ne comptent pas.
        // V150 : bornes alignées sur les marges de présence — avant 08:35 et après 16:25 (vendredi/samedi 13:55)
        int tolArrivee = Integer.parseInt(presenceRepository.parametreTexte("PRESENCE_TOLERANCE_ARRIVEE_MIN",
                presenceRepository.parametreTexte("PRESENCE_TOLERANCE_MIN", "5")));
        int tolDepart = Integer.parseInt(presenceRepository.parametreTexte("PRESENCE_TOLERANCE_DEPART_MIN",
                presenceRepository.parametreTexte("PRESENCE_TOLERANCE_MIN", "5")));
        LocalTime debutTravail = LocalTime.parse(presenceRepository.parametreTexte("PRESENCE_HEURE_ARRIVEE", "08:30")).plusMinutes(tolArrivee);
        LocalTime finTravail = LocalTime.parse(presenceRepository.parametreTexte("PRESENCE_HEURE_SORTIE", "16:30")).minusMinutes(tolDepart);
        LocalTime finVendredi = LocalTime.parse(presenceRepository.parametreTexte("PRESENCE_HEURE_SORTIE_VENDREDI", "14:00")).minusMinutes(tolDepart);
        LocalTime finSamedi = LocalTime.parse(presenceRepository.parametreTexte("PRESENCE_HEURE_SORTIE_SAMEDI", "14:00")).minusMinutes(tolDepart);
        LocalTime[] fins = {finTravail, finVendredi, finSamedi};

        Map<String, MouvementPersonneDto> agents = new LinkedHashMap<>();
        String matCourant = null;
        LocalDate jourCourant = null;
        List<Evt> evts = new ArrayList<>();
        for (Map<String, Object> r : mouvementRepository.mouvementsIdentifiesPeriode(du, au, matricule)) {
            String mat = String.valueOf(r.get("matricule"));
            LocalDate jour = ((java.sql.Date) r.get("jour")).toLocalDate();
            if (!mat.equals(matCourant) || !jour.equals(jourCourant)) {
                clore(agents, matCourant, jourCourant, evts, pauseDebut, pauseFin, debutTravail, fins);
                matCourant = mat;
                jourCourant = jour;
                evts = new ArrayList<>();
                agents.computeIfAbsent(mat, m -> MouvementPersonneDto.builder()
                        .matricule(m).nom(String.valueOf(r.get("nom"))).jours(new ArrayList<>()).build());
            }
            evts.add(new Evt(((java.sql.Time) r.get("heure")).toLocalTime(), "ENTRY".equals(r.get("sens"))));
        }
        clore(agents, matCourant, jourCourant, evts, pauseDebut, pauseFin, debutTravail, fins);
        return agents;
    }

    /** {@code fins} = {lundi-jeudi, vendredi, samedi} : fin de journée réglementaire selon le jour. */
    private void clore(Map<String, MouvementPersonneDto> agents, String matricule, LocalDate jour,
                       List<Evt> evts, LocalTime pauseDebut, LocalTime pauseFin,
                       LocalTime debutTravail, LocalTime[] fins) {
        if (matricule == null || evts.isEmpty()) return;
        LocalTime fin = PresenceServiceImpl.heureSortieDuJour(jour, fins[0], fins[1], fins[2]);
        agents.get(matricule).getJours().add(analyserJour(jour, evts, pauseDebut, pauseFin, debutTravail, fin));
    }

    private MouvementJourDto analyserJour(LocalDate jour, List<Evt> evts,
                                          LocalTime pauseDebut, LocalTime pauseFin,
                                          LocalTime debutTravail, LocalTime finTravail) {
        // Double badgeage même sens à moins de 2 minutes : on garde le premier
        List<Evt> nets = new ArrayList<>();
        for (Evt e : evts) {
            Evt dernier = nets.isEmpty() ? null : nets.get(nets.size() - 1);
            if (dernier != null && dernier.entree() == e.entree()
                    && Duration.between(dernier.heure(), e.heure()).toMinutes() < 2) continue;
            nets.add(e);
        }
        // Journée continue (pas de pause déjeuner) : vendredi (fin 13h00) et samedi (fin 14h00)
        boolean journeeContinue = jour.getDayOfWeek() == DayOfWeek.FRIDAY || jour.getDayOfWeek() == DayOfWeek.SATURDAY;
        List<SortieDto> sorties = new ArrayList<>();
        LocalTime premiereEntree = null, derniereSortie = null;
        // Premier badge = sortie : la personne est entrée sans badger, l'heure d'arrivée est inconnue.
        boolean entreeNonBadgee = !nets.isEmpty() && !nets.get(0).entree();
        // Dernier badge = entrée : le départ n'a pas (encore) été badgé ; la dernière sortie
        // connue n'est pas un départ mais une sortie intermédiaire déjà listée ci-dessous.
        boolean departNonBadge = !nets.isEmpty() && nets.get(nets.size() - 1).entree();
        for (int i = 0; i < nets.size(); i++) {
            Evt e = nets.get(i);
            if (e.entree()) {
                if (premiereEntree == null) premiereEntree = e.heure();
                continue;
            }
            derniereSortie = e.heure();
            Evt suivant = i + 1 < nets.size() ? nets.get(i + 1) : null;
            if (suivant == null) continue; // dernier badge du jour = départ final, pas une sortie intermédiaire
            if (!suivant.entree()) {
                // Sortie suivie d'une autre sortie : le retour n'a pas été badgé
                sorties.add(SortieDto.builder().heureSortie(e.heure())
                        .classement("NON_CLOTUREE").minutesComptees(0).build());
                continue;
            }
            sorties.add(classer(e.heure(), suivant.heure(), journeeContinue, pauseDebut, pauseFin, debutTravail, finTravail));
        }
        return MouvementJourDto.builder()
                .jour(jour)
                .premiereEntree(entreeNonBadgee ? null : premiereEntree)
                .derniereSortie(departNonBadge ? null : derniereSortie)
                .entreeNonBadgee(entreeNonBadgee)
                .departNonBadge(departNonBadge)
                .sorties(sorties)
                .nbSortiesTravail((int) sorties.stream().filter(s -> "SORTIE_TRAVAIL".equals(s.getClassement())).count())
                .minutesHorsBureau(sorties.stream().filter(s -> "SORTIE_TRAVAIL".equals(s.getClassement()))
                        .mapToInt(SortieDto::getMinutesComptees).sum())
                .minutesDepassementPause(sorties.stream().filter(s -> "PAUSE_DEPASSEE".equals(s.getClassement()))
                        .mapToInt(SortieDto::getMinutesComptees).sum())
                .nonCloturees((int) sorties.stream().filter(s -> "NON_CLOTUREE".equals(s.getClassement())).count())
                .build();
    }

    /** V150 : durée réglementaire de la pause (minutes), lue à chaque reconstitution. */
    private int pauseDuree = 60;

    /**
     * Un intervalle qui chevauche la fenêtre de pause 13:00-14:30 est une pause. V150 : la pause
     * dure au plus MOUVEMENT_PAUSE_DUREE_MIN (60 min), où que l'agent la place dans la fenêtre ;
     * comptent en dépassement les minutes hors fenêtre (avant 13:00, après 14:30) et les minutes
     * dans la fenêtre au-delà de la durée réglementaire. Hors pause : sortie en heures de travail.
     */
    private SortieDto classer(LocalTime sortie, LocalTime retour, boolean journeeContinue,
                              LocalTime pauseDebut, LocalTime pauseFin,
                              LocalTime debutTravail, LocalTime finTravail) {
        int duree = (int) Duration.between(sortie, retour).toMinutes();
        SortieDto.SortieDtoBuilder b = SortieDto.builder()
                .heureSortie(sortie).heureRetour(retour).dureeMinutes(duree);
        if (!journeeContinue && sortie.isBefore(pauseFin) && retour.isAfter(pauseDebut)) {
            int avant = (int) Math.max(0, Duration.between(sortie, pauseDebut).toMinutes());
            int apres = (int) Math.max(0, Duration.between(pauseFin, retour).toMinutes());
            int dansFenetre = duree - avant - apres;
            int excedent = Math.max(0, dansFenetre - pauseDuree);
            int depassement = avant + apres + excedent;
            return depassement == 0
                    ? b.classement("PAUSE").minutesComptees(0).build()
                    : b.classement("PAUSE_DEPASSEE").minutesComptees(depassement).build();
        }
        // Seules les minutes DANS les horaires de travail comptent :
        // [PRESENCE_HEURE_ARRIVEE, PRESENCE_HEURE_SORTIE(_VENDREDI)]
        if (!retour.isAfter(debutTravail)) {
            return b.classement("AVANT_TRAVAIL").minutesComptees(0).build();
        }
        if (!sortie.isBefore(finTravail)) {
            return b.classement("APRES_TRAVAIL").minutesComptees(0).build();
        }
        LocalTime debutCompte = sortie.isBefore(debutTravail) ? debutTravail : sortie;
        LocalTime finCompte = retour.isAfter(finTravail) ? finTravail : retour;
        return b.classement("SORTIE_TRAVAIL")
                .minutesComptees((int) Math.max(0, Duration.between(debutCompte, finCompte).toMinutes()))
                .build();
    }

    @Override
    public Map<String, MouvementPersonneDto> reconstituerPeriode(LocalDate du, LocalDate au) {
        return reconstituer(du, au, null);
    }

    // ==================== Connecteur UniFi Access ====================

    /** Matricule = employee_number s'il est valide, sinon rapprochement par nom normalisé. */
    @Override
    @Transactional
    public int importerUsersUnifi(List<Map<String, Object>> usersUnifi) {
        Map<String, String> nomsPersonnel = chargerNomsPersonnel();
        int identifies = 0;
        for (Map<String, Object> u : usersUnifi) {
            String id = texte(u.get("id"));
            if (id.isBlank()) continue;
            String nom = texte(u.get("full_name"));
            if (nom.isBlank()) nom = (texte(u.get("first_name")) + " " + texte(u.get("last_name"))).strip();
            String emp = texte(u.get("employee_number")).strip();
            String statut = texte(u.get("status"));
            String matricule = null;
            if (!emp.isEmpty() && emp.chars().allMatch(Character::isDigit)
                    && mouvementRepository.matriculeConnu(emp)) {
                matricule = emp;
            } else {
                String m = nomsPersonnel.get(normaliser(nom));
                if (m == null) m = nomsPersonnel.get(trierMots(normaliser(nom)));
                if (m != null && !NOM_AMBIGU.equals(m)) matricule = m;
            }
            mouvementRepository.upsertUnifiUser(id, matricule, nom, emp, statut);
            if (matricule != null) {
                identifies++;
                if (u.get("nfc_cards") instanceof List<?> cartes) {
                    for (Object c : cartes) {
                        if (c instanceof Map<?, ?> carte) {
                            String cardId = texte(carte.get("id"));
                            if (!cardId.isBlank()) mouvementRepository.apprendreBadge(cardId, matricule);
                        }
                    }
                }
            }
        }
        log.info("Référentiel UniFi importé : {} users, {} rattachés à un matricule", usersUnifi.size(), identifies);
        return identifies;
    }

    private static String texte(Object o) {
        return o == null ? "" : String.valueOf(o);
    }

    @Override
    @Transactional
    public boolean traiterEvenementWebhook(long epochSecondes, JsonNode evenement) {
        if (!"access.door.unlock".equals(evenement.path("event").asText())) {
            return false;
        }
        JsonNode data = evenement.path("data");
        JsonNode acteur = data.path("actor");
        String nomBrut = acteur.path("name").asText("").strip();
        if (nomBrut.isEmpty()) nomBrut = "INCONNU";
        String unifiId = acteur.path("id").asText("");
        boolean visiteur = "visitor".equalsIgnoreCase(acteur.path("type").asText(""))
                || normaliser(nomBrut).startsWith("VISITEUR");
        JsonNode objet = data.path("object");
        String resultat = objet.path("result").asText("").toUpperCase(Locale.ROOT).contains("GRANT")
                ? "ACCESS" : "BLOCKED";
        String badgeNo = objet.path("authentication_value").asText("").strip();
        if (badgeNo.isEmpty()) badgeNo = null;
        String credential = (objet.path("authentication_type").asText("") + " "
                + (badgeNo == null ? "" : badgeNo)).strip();
        String porte = data.path("location").path("name").asText(null);
        String lecteurId = objet.path("reader_id").asText("").strip();
        if (lecteurId.isEmpty()) lecteurId = data.path("device").path("id").asText("").strip();
        if (lecteurId.isEmpty()) lecteurId = null;
        String sens = detecterSens(data, lecteurId);
        ZonedDateTime quand = Instant.ofEpochSecond(epochSecondes).atZone(ZoneId.of("Africa/Conakry"));

        String matricule = null;
        if ("ACCESS".equals(resultat) && !visiteur) {
            if (!unifiId.isBlank()) {
                matricule = mouvementRepository.matriculePourUnifiId(unifiId).orElse(null);
            }
            if (matricule == null) {
                matricule = identifier(nomBrut, badgeNo, chargerNomsPersonnel(), new HashMap<>());
            }
            if (matricule != null && badgeNo != null) {
                mouvementRepository.apprendreBadge(badgeNo, matricule);
            }
        }
        if (mouvementRepository.existeMouvementProche(quand.toLocalDate(), quand.toLocalTime().withNano(0),
                sens, resultat, nomBrut, matricule, TOLERANCE_DOUBLON_SECONDES)) {
            return false;
        }
        int insere = mouvementRepository.insererMouvement(quand.toLocalDate(),
                quand.toLocalTime().withNano(0), sens, matricule, nomBrut, badgeNo,
                credential.isEmpty() ? null : credential, resultat, visiteur, porte, lecteurId);
        if (insere > 0 && matricule != null && "ACCESS".equals(resultat)) {
            // Alimente aussi le pointage présence (min entrée / max sortie consolidés par l'upsert)
            presenceRepository.upsertPointage(quand.toLocalDate(), matricule, nomBrut,
                    quand.toLocalTime().withNano(0), quand.toLocalTime().withNano(0));
        }
        if (insere > 0) {
            alerterHorsPlageSiBesoin(quand, nomBrut, matricule, porte);
        }
        if (sens.equals("INCONNU")) {
            log.info("Webhook UniFi : sens non détecté (lecteur='{}' device='{}' objet={})",
                    lecteurId, data.path("device").path("name").asText(""), objet.toString());
        }
        return insere > 0;
    }

    /**
     * Alerte sécurité temps réel : badgeage avant MOUVEMENT_PLAGE_DEBUT, après MOUVEMENT_PLAGE_FIN,
     * un dimanche ou un jour férié. Une alerte par personne et par jour (anti-doublon drh_alerte,
     * matricule inconnu regroupé sous la clé 0) ; SMS envoyé hors du fil du webhook (timeout 5 s côté UniFi).
     */
    private void alerterHorsPlageSiBesoin(ZonedDateTime quand, String nomBrut, String matricule, String porte) {
        try {
            LocalDate jour = quand.toLocalDate();
            LocalTime heure = quand.toLocalTime();
            LocalTime debut = LocalTime.parse(mouvementRepository.parametreTexte("MOUVEMENT_PLAGE_DEBUT", "06:30"));
            LocalTime fin = LocalTime.parse(mouvementRepository.parametreTexte("MOUVEMENT_PLAGE_FIN", "20:00"));
            boolean horsPlage = heure.isBefore(debut) || heure.isAfter(fin)
                    || jour.getDayOfWeek() == DayOfWeek.SUNDAY
                    || !drhRepository.joursFeries(jour, jour).isEmpty();
            if (!horsPlage) return;

            long cle = 0;
            if (matricule != null) {
                try {
                    cle = Long.parseLong(matricule);
                } catch (NumberFormatException ignored) {
                }
            }
            if (mouvementRepository.enregistrerAlerte("MOUVEMENT_HORS_PLAGE", cle,
                    jour.getYear() * 1000L + jour.getDayOfYear()) == 0) {
                return; // déjà signalé aujourd'hui pour cette personne
            }
            String message = "CRG SECURITE : badgeage hors plage le "
                    + jour.format(DateTimeFormatter.ofPattern("dd/MM")) + " a "
                    + heure.format(DateTimeFormatter.ofPattern("HH:mm")) + " - "
                    + (nomBrut == null || nomBrut.isBlank() ? "INCONNU" : nomBrut)
                    + (matricule != null ? " (mat. " + matricule + ")" : "")
                    + (porte != null ? " - " + porte : "");
            List<String> telephones = drhRepository.telephonesDrh();
            java.util.concurrent.CompletableFuture.runAsync(() -> {
                for (String tel : telephones) {
                    try {
                        smsService.send(tel, message);
                    } catch (Exception e) {
                        log.warn("Alerte hors plage non envoyée à {} : {}", tel, e.getMessage());
                    }
                }
            });
            log.info("Alerte hors plage : {}", message);
        } catch (Exception e) {
            log.warn("Contrôle hors plage en échec : {}", e.getMessage());
        }
    }

    /**
     * Sens du passage : d'abord les listes calibrées de lecteurs (MOUVEMENT_LECTEURS_ENTREE /
     * MOUVEMENT_LECTEURS_SORTIE, ids séparés par des virgules), sinon les mots-clés du lecteur.
     */
    private String detecterSens(JsonNode data, String lecteurId) {
        if (lecteurId != null) {
            if (contientLecteur("MOUVEMENT_LECTEURS_ENTREE", lecteurId)) return "ENTRY";
            if (contientLecteur("MOUVEMENT_LECTEURS_SORTIE", lecteurId)) return "EXIT";
        }
        String texte = (data.path("device").path("alias").asText("") + " "
                + data.path("device").path("name").asText("") + " "
                + data.path("location").path("name").asText("")).toLowerCase(Locale.ROOT);
        if (texte.contains("exit") || texte.contains("sortie")) return "EXIT";
        if (texte.contains("entry") || texte.contains("entree") || texte.contains("entrée")
                || texte.contains("entrance")) return "ENTRY";
        return "INCONNU";
    }

    private boolean contientLecteur(String cle, String lecteurId) {
        for (String id : mouvementRepository.parametreTexte(cle, "").split(",")) {
            if (!id.isBlank() && id.strip().equalsIgnoreCase(lecteurId)) return true;
        }
        return false;
    }

    // ==================== Alerte hebdomadaire ====================

    /** Semaine écoulée (lundi -> dimanche) : SMS aux porteurs du rôle DRH au-delà du seuil. */
    @Override
    public int alerterDepassementsSemaine() {
        int seuil = Integer.parseInt(
                mouvementRepository.parametreTexte("MOUVEMENT_ALERTE_SEUIL_MINUTES", "120"));
        LocalDate lundi = LocalDate.now().with(DayOfWeek.MONDAY).minusWeeks(1);
        LocalDate dimanche = lundi.plusDays(6);
        long reference = lundi.getYear() * 1000L + lundi.getDayOfYear();

        List<String> telephonesDrh = null;
        int alertes = 0;
        for (MouvementPersonneDto agent : reconstituer(lundi, dimanche, null).values()) {
            int total = agent.getJours().stream()
                    .mapToInt(j -> j.getMinutesHorsBureau() + j.getMinutesDepassementPause()).sum();
            if (total < seuil) continue;
            long matriculeKey;
            try {
                matriculeKey = Long.parseLong(agent.getMatricule());
            } catch (NumberFormatException e) {
                continue;
            }
            if (mouvementRepository.enregistrerAlerte("MOUVEMENT_SEMAINE", matriculeKey, reference) == 0) {
                continue; // déjà signalé pour cette semaine
            }
            if (telephonesDrh == null) telephonesDrh = drhRepository.telephonesDrh();
            String message = "CRG Mouvements : " + agent.getNom() + " (mat. " + agent.getMatricule()
                    + ") cumule " + total + " min hors bureau / dépassement de pause sur la semaine du "
                    + lundi + " au " + dimanche + " (seuil " + seuil + " min).";
            for (String tel : telephonesDrh) {
                try {
                    smsService.send(tel, message);
                } catch (Exception e) {
                    log.warn("Alerte mouvements non envoyée à {} : {}", tel, e.getMessage());
                }
            }
            alertes++;
        }
        if (alertes > 0) {
            log.info("Alerte mouvements semaine du {} : {} salarié(s) au-dessus du seuil de {} min",
                    lundi, alertes, seuil);
        }
        return alertes;
    }

    // ==================== Tableau de bord du jour ====================

    @Override
    public TableauBordDto tableauBord(User drh, LocalDate jour) {
        Set<String> perimetre = perimetreMatricules(drh);
        if (jour == null) jour = LocalDate.now();
        int seuil = Integer.parseInt(mouvementRepository.parametreTexte("MOUVEMENT_TOP_SEUIL_JOUR", "8"));

        // Noms propres du personnel + affectations
        Map<String, String> noms = new HashMap<>();
        for (Map<String, Object> p : mouvementRepository.personnelActifNoms()) {
            noms.put(String.valueOf(p.get("matricule")),
                    (p.get("prenom") + " " + p.get("nom")).strip());
        }
        Map<String, String> departements = mouvementRepository.departementsParMatricule();

        // Intervalles reconstruits du jour (sorties travail, pauses, non clôturées)
        Map<String, MouvementPersonneDto> reconstruits = reconstituer(jour, jour, null);

        int dansLesLocaux = 0, minutesHorsBureau = 0, agentsHorsBureau = 0, retoursNonBadges = 0;
        List<LigneTableauBordDto> lignes = new ArrayList<>();
        for (Map<String, Object> c : mouvementRepository.comptagesBadgeagesJour(jour)) {
            String matricule = String.valueOf(c.get("matricule"));
            if (perimetre != null && !perimetre.contains(matricule)) continue;
            String dernierSens = c.get("dernier_sens") == null ? "INCONNU" : String.valueOf(c.get("dernier_sens"));
            if ("ENTRY".equals(dernierSens)) dansLesLocaux++;
            MouvementJourDto jourAgent = null;
            MouvementPersonneDto agent = reconstruits.get(matricule);
            if (agent != null && !agent.getJours().isEmpty()) jourAgent = agent.getJours().get(0);
            int horsBureau = jourAgent == null ? 0 : jourAgent.getMinutesHorsBureau();
            if (horsBureau > 0) { minutesHorsBureau += horsBureau; agentsHorsBureau++; }
            if (jourAgent != null) retoursNonBadges += jourAgent.getNonCloturees();
            lignes.add(LigneTableauBordDto.builder()
                    .matricule(matricule)
                    .nom(noms.getOrDefault(matricule, matricule))
                    .departementCode(departements.get(matricule))
                    .badgeages(((Number) c.get("badgeages")).intValue())
                    .nbSortiesTravail(jourAgent == null ? 0 : jourAgent.getNbSortiesTravail())
                    .minutesHorsBureau(horsBureau)
                    .minutesDepassementPause(jourAgent == null ? 0 : jourAgent.getMinutesDepassementPause())
                    .dernierBadge(((java.sql.Time) c.get("derniere_heure")).toLocalTime())
                    .dernierSens(dernierSens)
                    .build());
        }

        // Présences du jour (si le rapprochement horaire a déjà tourné) + veille contrôlée
        long presents = 0, retards = 0, effectif = 0;
        int minutesRetard = 0;
        for (PresenceJourDto p : presenceRepository.presencesPeriode(jour, jour, null)) {
            if (perimetre != null && !perimetre.contains(p.getMatricule())) continue;
            effectif++;
            if ("PRESENT".equals(p.getStatut())) presents++;
            if ("RETARD".equals(p.getStatut()) || "RETARD_ET_DEPART".equals(p.getStatut())) {
                retards++;
                if (p.getMinutesRetard() != null) minutesRetard += p.getMinutesRetard();
            }
        }
        Long presentsVeille = null;
        List<SyntheseJourDto> avant = presenceRepository.synthesePeriode(jour.minusDays(7), jour.minusDays(1));
        if (!avant.isEmpty()) presentsVeille = avant.get(avant.size() - 1).getPresents();

        Map<String, Object> bloques = mouvementRepository.statsBloquesJour(jour);

        // ===== Phase 2 =====
        // Affluence à la demi-heure (48 créneaux) — le front colore différemment avant l'heure de début
        List<Integer> affluence = new ArrayList<>(48);
        for (int nb : mouvementRepository.affluenceParDemiHeure(jour)) affluence.add(nb);
        java.util.Map<String, int[]> parSens = mouvementRepository.affluenceParDemiHeureEtSens(jour);
        List<Integer> entrees = new ArrayList<>(48), sorties = new ArrayList<>(48), inconnus = new ArrayList<>(48);
        for (int nb : parSens.get("ENTRY")) entrees.add(nb);
        for (int nb : parSens.get("EXIT")) sorties.add(nb);
        for (int nb : parSens.get("INCONNU")) inconnus.add(nb);
        String heureDebutTravail = presenceRepository.parametreTexte("PRESENCE_HEURE_ARRIVEE", "08:30");

        LocalTime plageDebut = LocalTime.parse(mouvementRepository.parametreTexte("MOUVEMENT_PLAGE_DEBUT", "06:30"));
        LocalTime plageFin = LocalTime.parse(mouvementRepository.parametreTexte("MOUVEMENT_PLAGE_FIN", "20:00"));
        int horsPlage = mouvementRepository.nbHorsPlageJour(jour, plageDebut, plageFin);

        int seuilRecidive = Integer.parseInt(mouvementRepository.parametreTexte("RETARD_RECIDIVE_SEUIL", "3"));
        List<RecidiveRetardDto> recidives = new ArrayList<>();
        for (Map<String, Object> r : mouvementRepository.recidivesRetard(jour.minusDays(29), jour, seuilRecidive)) {
            if (perimetre != null && !perimetre.contains(String.valueOf(r.get("matricule")))) continue;
            recidives.add(RecidiveRetardDto.builder()
                    .matricule(String.valueOf(r.get("matricule")))
                    .nom(String.valueOf(r.get("nom")))
                    .nbRetards(((Number) r.get("nb")).intValue())
                    .minutesCumulees(((Number) r.get("minutes")).intValue())
                    .build());
        }

        // Mois en cours : présences par département + hors bureau reconstruit
        LocalDate debutMois = jour.withDayOfMonth(1);
        Map<String, Integer> horsBureauParDept = new HashMap<>();
        for (Map.Entry<String, MouvementPersonneDto> e : reconstituer(debutMois, jour, null).entrySet()) {
            String dept = departements.get(e.getKey());
            if (dept == null) continue;
            int minutes = e.getValue().getJours().stream().mapToInt(MouvementJourDto::getMinutesHorsBureau).sum();
            horsBureauParDept.merge(dept, minutes, Integer::sum);
        }
        // Responsable : ne voir que son propre département dans la vue mensuelle
        Set<String> codesAutorises = null;
        if (perimetre != null) {
            codesAutorises = new HashSet<>();
            for (String matricule : perimetre) {
                String code = departements.get(matricule);
                if (code != null) codesAutorises.add(code);
            }
        }
        List<DepartementStatsDto> statsDepts = new ArrayList<>();
        for (Map<String, Object> d : mouvementRepository.statsDepartementsPeriode(debutMois, jour)) {
            String code = String.valueOf(d.get("code"));
            if (codesAutorises != null && !codesAutorises.contains(code)) continue;
            statsDepts.add(DepartementStatsDto.builder()
                    .code(code)
                    .agents(((Number) d.get("agents")).intValue())
                    .controles(((Number) d.get("controles")).longValue())
                    .presents(((Number) d.get("presents")).longValue())
                    .retards(((Number) d.get("retards")).longValue())
                    .absentsNonJustifies(((Number) d.get("absents_nj")).longValue())
                    .minutesHorsBureau(horsBureauParDept.getOrDefault(code, 0))
                    .build());
        }

        return TableauBordDto.builder()
                .jour(jour)
                .presents(presents)
                .effectifControle(effectif)
                .presentsVeille(presentsVeille)
                .retards(retards)
                .minutesRetardCumulees(minutesRetard)
                .dansLesLocaux(dansLesLocaux)
                .minutesHorsBureau(minutesHorsBureau)
                .agentsHorsBureau(agentsHorsBureau)
                .retoursNonBadges(retoursNonBadges)
                .accesRefuses(((Number) bloques.get("total")).intValue())
                .accesRefusesMemeBadge(((Number) bloques.get("max_meme_badge")).intValue())
                .seuilBadgeages(seuil)
                .lignes(lignes)
                .affluenceParDemiHeure(affluence)
                .entreesParDemiHeure(entrees)
                .sortiesParDemiHeure(sorties)
                .sensInconnuParDemiHeure(inconnus)
                .heureDebutTravail(heureDebutTravail)
                .horsPlage(horsPlage)
                .recidivesRetard(recidives)
                .departements(statsDepts)
                .build();
    }

    /** Synthèse SMS quotidienne : agents au-dessus du seuil de badgeages, anti-doublon par jour. */
    @Override
    public int alerterMouvementsJour() {
        LocalDate jour = LocalDate.now();
        int seuil = Integer.parseInt(mouvementRepository.parametreTexte("MOUVEMENT_TOP_SEUIL_JOUR", "8"));
        long reference = jour.getYear() * 1000L + jour.getDayOfYear();

        Map<String, String> noms = new HashMap<>();
        for (Map<String, Object> p : mouvementRepository.personnelActifNoms()) {
            noms.put(String.valueOf(p.get("matricule")),
                    (p.get("prenom") + " " + p.get("nom")).strip());
        }
        Map<String, MouvementPersonneDto> reconstruits = reconstituer(jour, jour, null);

        List<String> depassements = new ArrayList<>();
        for (Map<String, Object> c : mouvementRepository.comptagesBadgeagesJour(jour)) {
            int badgeages = ((Number) c.get("badgeages")).intValue();
            if (badgeages <= seuil) continue;
            String matricule = String.valueOf(c.get("matricule"));
            long matriculeKey;
            try {
                matriculeKey = Long.parseLong(matricule);
            } catch (NumberFormatException e) {
                continue;
            }
            if (mouvementRepository.enregistrerAlerte("MOUVEMENT_JOUR", matriculeKey, reference) == 0) {
                continue; // déjà signalé aujourd'hui
            }
            MouvementPersonneDto agent = reconstruits.get(matricule);
            int horsBureau = (agent == null || agent.getJours().isEmpty())
                    ? 0 : agent.getJours().get(0).getMinutesHorsBureau();
            depassements.add(noms.getOrDefault(matricule, matricule) + " (" + badgeages + " badgeages"
                    + (horsBureau > 0 ? ", " + horsBureau + " min hors bureau" : "") + ")");
        }
        if (depassements.isEmpty()) return 0;

        String message = "CRG DRH - Mouvements du "
                + jour.format(DateTimeFormatter.ofPattern("dd/MM")) + " : "
                + depassements.size() + " salarié(s) > " + seuil + " badgeages : "
                + String.join(", ", depassements)
                + ". Detail : digi > Mouvements > Tableau de bord";
        for (String tel : drhRepository.telephonesDrh()) {
            try {
                smsService.send(tel, message);
            } catch (Exception e) {
                log.warn("Alerte mouvements jour non envoyée à {} : {}", tel, e.getMessage());
            }
        }
        log.info("Alerte mouvements du {} : {} salarié(s) au-dessus du seuil de {} badgeages",
                jour, depassements.size(), seuil);
        return depassements.size();
    }

    // ==================== Badges ====================

    @Override
    public List<BadgeCorrespondanceDto> correspondances(User drh) {
        exigerDrh(drh);
        return mouvementRepository.correspondances();
    }

    @Override
    public List<BadgeInconnuDto> badgesInconnus(User drh) {
        exigerDrh(drh);
        return mouvementRepository.badgesInconnus();
    }

    @Override
    @Transactional
    public Map<String, Object> creerPersonneEtAssocier(User drh, String badgeNo, String nom, String prenom) {
        exigerDrhEcriture(drh);
        if (badgeNo == null || badgeNo.isBlank()) {
            throw new ValidationException("Numéro de badge manquant");
        }
        if (nom == null || nom.isBlank() || prenom == null || prenom.isBlank()) {
            throw new ValidationException("Le nom et le prénom sont obligatoires");
        }
        if (mouvementRepository.matriculePourBadge(badgeNo.strip()).isPresent()) {
            throw new ValidationException("Ce badge est déjà rattaché à un matricule : utilisez « Associer » pour le modifier");
        }
        String matricule = String.valueOf(mouvementRepository.prochainMatriculeTechnique());
        var personnel = new io.digiservices.ecreditservice.dto.InfoPersonnelDto();
        personnel.setMatricule(matricule);
        personnel.setNom(nom.strip().toUpperCase(Locale.ROOT));
        personnel.setPrenom(prenom.strip());
        var cree = salaireService.addInfoPersonnel(personnel);
        if (cree.getId() != null) {
            salaireService.updateInfoPersonnelBadge(cree.getId(), true); // contrôlé par le rapprochement des présences
        }
        int reidentifies = associerBadge(drh, badgeNo, matricule);
        log.info("Personne créée depuis le badge {} : {} {} (matricule technique {}), {} mouvements ré-identifiés",
                badgeNo, personnel.getPrenom(), personnel.getNom(), matricule, reidentifies);
        Map<String, Object> resultat = new HashMap<>();
        resultat.put("matricule", matricule);
        resultat.put("id", cree.getId());
        resultat.put("mouvementsReidentifies", reidentifies);
        return resultat;
    }

    @Override
    @Transactional
    public int associerBadge(User drh, String badgeNo, String matricule) {
        exigerDrhEcriture(drh);
        if (badgeNo == null || badgeNo.isBlank()) {
            throw new ValidationException("Numéro de badge manquant");
        }
        if (matricule == null || matricule.isBlank() || !mouvementRepository.matriculeConnu(matricule.strip())) {
            throw new ValidationException("Matricule inconnu dans le fichier du personnel : " + matricule);
        }
        mouvementRepository.associerBadgeManuel(badgeNo.strip(), matricule.strip());
        int reidentifies = mouvementRepository.appliquerBadgeAuxMouvements(badgeNo.strip(), matricule.strip());
        log.info("Badge {} associé au matricule {} — {} mouvements ré-identifiés", badgeNo, matricule, reidentifies);
        return reidentifies;
    }

    /** V154 : lecture — profil DRH, délégué MOUVEMENTS ou DGA. */
    private void exigerDrh(User user) {
        if (!drhService.aHabilitationLecture(user, DrhServiceImpl.F_MOUVEMENTS)) {
            throw new ValidationException("Action réservée à la DRH");
        }
    }

    /** V154 : écriture (import, badges) — profil DRH ou délégué MOUVEMENTS, pas le DGA. */
    private void exigerDrhEcriture(User user) {
        if (!drhService.aHabilitation(user, DrhServiceImpl.F_MOUVEMENTS)) {
            throw new ValidationException("Action réservée à la DRH");
        }
    }
}
