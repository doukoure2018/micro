package io.digiservices.ecreditservice.drh.service.impl;

import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.drh.dto.DrhDtos.*;
import io.digiservices.ecreditservice.drh.repository.DrhRepository;
import io.digiservices.ecreditservice.drh.service.DrhService;
import io.digiservices.ecreditservice.exception.ValidationException;
import io.digiservices.ecreditservice.service.SmsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Phase 1 du chantier Congés & Présences DRH : organisation par départements et
 * prévisions annuelles de congés (circuit agent -> responsable -> DRH).
 * Jours ouvrables du congé = lundi à samedi hors dimanches et fériés (règle CRG du 2026-09-06).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DrhServiceImpl implements DrhService {

    public static final String ROLE_DRH = "DRH";
    public static final String ROLE_SUPER_ADMIN = "SUPER_ADMIN";

    // V154 : fonctions délégables
    public static final String F_VALIDATION_CONGES = "VALIDATION_CONGES";
    public static final String F_VALIDATION_PREVISIONS = "VALIDATION_PREVISIONS";
    public static final String F_PRESENCES = "PRESENCES";
    public static final String F_MOUVEMENTS = "MOUVEMENTS";
    public static final String F_ORGANISATION = "ORGANISATION";
    public static final String F_PERSONNEL = "PERSONNEL";
    public static final String F_AVANCES = "AVANCES";
    public static final String F_VALIDATION_FINALE = "VALIDATION_FINALE";
    private static final Set<String> FONCTIONS = Set.of(F_VALIDATION_CONGES, F_VALIDATION_PREVISIONS, F_PRESENCES,
            F_MOUVEMENTS, F_ORGANISATION, F_PERSONNEL, F_AVANCES, F_VALIDATION_FINALE);
    /** Ce que porte l'habilitation DGA en écriture (étape DRH des circuits) et en lecture. */
    private static final Set<String> DGA_ECRITURE = Set.of(F_VALIDATION_CONGES, F_VALIDATION_PREVISIONS, F_VALIDATION_FINALE);
    private static final Set<String> DGA_LECTURE = Set.of(F_PRESENCES, F_MOUVEMENTS);
    private static final String PARAM_DROIT_ANNUEL = "DROIT_CONGE_ANNUEL_JOURS";

    /** Statuts dans lesquels l'agent peut encore modifier sa prévision. */
    private static final Set<String> STATUTS_MODIFIABLES_AGENT =
            Set.of("BROUILLON", "REJETEE_RESP", "REJETEE_DRH");

    private final DrhRepository drhRepository;
    private final SmsService smsService;

    // ==================== Organisation ====================

    @Override
    public ContexteDrhDto contexteDe(User user) {
        var membre = drhRepository.membreActifDeUser(user.getUserId());
        List<String> fonctions = drhRepository.fonctionsDelegueesDe(user.getUserId());
        return ContexteDrhDto.builder()
                .estMembre(membre.isPresent())
                .estResponsable(membre.map(MembreDto::getEstResponsable).orElse(false))
                .estDrh(estDrh(user))
                .fonctions(fonctions)
                .estDga(fonctions.contains(F_VALIDATION_FINALE))
                .estDelegue(!fonctions.isEmpty())
                .departementId(membre.map(MembreDto::getDepartementId).orElse(null))
                .departementCode(membre.map(MembreDto::getDepartementCode).orElse(null))
                .departementLibelle(membre.map(m -> drhRepository.libelleDepartement(m.getDepartementId())).orElse(null))
                .droitAnnuelJours(drhRepository.parametreInt(PARAM_DROIT_ANNUEL, 30))
                .build();
    }

    @Override
    public List<DepartementDto> listeDepartements() {
        return drhRepository.listeDepartements();
    }

    @Override
    public Long creerDepartement(DepartementRequest request) {
        if (request.getCode() == null || request.getCode().isBlank()
                || request.getLibelle() == null || request.getLibelle().isBlank()) {
            throw new ValidationException("Le code et le libellé du département sont obligatoires");
        }
        return drhRepository.creerDepartement(request);
    }

    @Override
    public void modifierDepartement(Long departementId, DepartementRequest request) {
        drhRepository.modifierDepartement(departementId, request);
    }

    @Override
    public List<MembreDto> listeMembres(Long departementId) {
        return drhRepository.listeMembres(departementId);
    }

    @Override
    @Transactional
    public Long affecterMembre(AffectationRequest request) {
        if (request.getDepartementId() == null || request.getUserId() == null) {
            throw new ValidationException("Le département et l'utilisateur sont obligatoires");
        }
        // Le matricule saisi doit exister dans le fichier du personnel (référentiel des salaires),
        // sinon le rapprochement des présences (badgeuse) serait faux.
        if (request.getMatricule() != null && !request.getMatricule().isBlank()) {
            var personnel = drhRepository.personnelParMatricule(request.getMatricule().trim());
            if (personnel.isEmpty()) {
                throw new ValidationException("Matricule " + request.getMatricule().trim()
                        + " introuvable dans le fichier du personnel (salaires) — vérifiez la saisie ou faites-le ajouter au référentiel");
            }
        }
        return drhRepository.affecterMembre(request);
    }

    @Override
    public Map<String, Object> verifierMatricule(String matricule) {
        if (matricule == null || matricule.isBlank()) {
            return Map.of("existe", false);
        }
        return drhRepository.personnelParMatricule(matricule.trim())
                .<Map<String, Object>>map(p -> Map.of(
                        "existe", true,
                        "matricule", String.valueOf(p.get("matricule")),
                        "nom", String.valueOf(p.get("nom")),
                        "prenom", String.valueOf(p.get("prenom")),
                        "statut", String.valueOf(p.get("statut"))))
                .orElse(Map.of("existe", false));
    }

    @Override
    public List<Map<String, Object>> joursFeries(int exercice) {
        // java.sql.Date serialise en nombre par l'ObjectMapper custom du service : on renvoie la chaine ISO
        return drhRepository.joursFeriesExercice(exercice).stream()
                .<Map<String, Object>>map(r -> Map.of(
                        "jour", String.valueOf(r.get("jour")),
                        "libelle", String.valueOf(r.get("libelle"))))
                .toList();
    }

    @Override
    public void retirerMembre(Long membreId) {
        drhRepository.retirerMembre(membreId);
    }

    @Override
    public List<Map<String, Object>> usersNonAffectes() {
        return drhRepository.usersNonAffectes();
    }

    // ==================== Prévision — agent ====================

    @Override
    public PrevisionDto maPrevision(User user, int exercice) {
        return drhRepository.previsionDeUser(user.getUserId(), exercice).orElse(null);
    }

    @Override
    @Transactional
    public PrevisionDto enregistrerPrevision(User user, PrevisionRequest request) {
        int exercice = exigerExercice(request);
        MembreDto membre = drhRepository.membreActifDeUser(user.getUserId())
                .orElseThrow(() -> new ValidationException(
                        "Vous n'êtes affecté à aucun département — contactez la DRH pour votre affectation"));

        // Liste vide autorisee a l'enregistrement (suppression de la derniere tranche) ;
        // la soumission, elle, exige au moins une periode.
        boolean aucunePeriode = request.getPeriodes() == null || request.getPeriodes().isEmpty();
        List<PeriodeDto> periodes = aucunePeriode ? List.of() : controlerPeriodes(request, exercice);

        var existante = drhRepository.previsionDeUser(user.getUserId(), exercice);
        Long previsionId;
        if (existante.isPresent()) {
            PrevisionDto p = existante.get();
            if (!STATUTS_MODIFIABLES_AGENT.contains(p.getStatut())) {
                throw new ValidationException("La prévision est au statut " + p.getStatut()
                        + " : elle n'est plus modifiable");
            }
            previsionId = p.getPrevisionId();
            drhRepository.majCommentaire(previsionId, request.getCommentaire());
        } else {
            previsionId = drhRepository.creerPrevision(user.getUserId(), membre.getDepartementId(),
                    exercice, request.getCommentaire());
        }
        drhRepository.remplacerPeriodes(previsionId, periodes);
        return drhRepository.previsionById(previsionId).orElseThrow();
    }

    @Override
    @Transactional
    public PrevisionDto soumettre(User user, int exercice) {
        PrevisionDto p = drhRepository.previsionDeUser(user.getUserId(), exercice)
                .orElseThrow(() -> new ValidationException("Aucune prévision enregistrée pour " + exercice));
        if (!STATUTS_MODIFIABLES_AGENT.contains(p.getStatut())) {
            throw new ValidationException("La prévision est déjà au statut " + p.getStatut());
        }
        if (p.getPeriodes() == null || p.getPeriodes().isEmpty()) {
            throw new ValidationException("Ajoutez au moins une période avant de soumettre");
        }
        drhRepository.majStatut(p.getPrevisionId(), "SOUMISE", null, true, null, null);
        notifier(drhRepository.telephonesResponsables(p.getDepartementId()),
                "CRG Congés : " + p.getNomComplet() + " a soumis sa prévision de congés "
                        + exercice + " (" + p.getTotalJours() + " j). Merci de la traiter.");
        return drhRepository.previsionById(p.getPrevisionId()).orElseThrow();
    }

    // ==================== Prévision — responsable ====================

    @Override
    public List<PrevisionDto> previsionsDeMonDepartement(User responsable, int exercice) {
        if (estDga(responsable) && !drhRepository.estResponsableActif(responsable.getUserId())) {
            return drhRepository.previsionsDesResponsables(exercice); // V154 : file du DGA
        }
        MembreDto membre = exigerResponsable(responsable);
        return drhRepository.previsionsDuDepartement(membre.getDepartementId(), exercice);
    }

    @Override
    @Transactional
    public PrevisionDto accepter(User responsable, Long previsionId) {
        PrevisionDto p = exigerPrevisionDeSonDepartement(responsable, previsionId, "SOUMISE");
        drhRepository.majStatut(previsionId, "ACCEPTEE_RESP", null, false, responsable.getUserId(), null);
        notifier(drhRepository.telephonesDrh(),
                "CRG Congés : prévision " + p.getExercice() + " de " + p.getNomComplet()
                        + " acceptée par le responsable — en attente de validation DRH.");
        notifierUser(p.getUserId(), "CRG Congés : votre prévision " + p.getExercice()
                + " a été acceptée par votre responsable. Elle attend la validation DRH.");
        return drhRepository.previsionById(previsionId).orElseThrow();
    }

    @Override
    @Transactional
    public PrevisionDto rejeter(User responsable, Long previsionId, String motif) {
        if (motif == null || motif.isBlank()) {
            throw new ValidationException("Le motif du rejet est obligatoire");
        }
        PrevisionDto p = exigerPrevisionDeSonDepartement(responsable, previsionId, "SOUMISE");
        drhRepository.majStatut(previsionId, "REJETEE_RESP", motif, false, responsable.getUserId(), null);
        notifierUser(p.getUserId(), "CRG Congés : votre prévision " + p.getExercice()
                + " a été rejetée — " + motif + ". Réadaptez vos dates puis soumettez à nouveau.");
        return drhRepository.previsionById(previsionId).orElseThrow();
    }

    @Override
    @Transactional
    public PrevisionDto reajuster(User responsable, Long previsionId, PrevisionRequest request) {
        PrevisionDto p = exigerPrevisionDeSonDepartement(responsable, previsionId, "SOUMISE");
        List<PeriodeDto> periodes = controlerPeriodes(request, p.getExercice());
        drhRepository.remplacerPeriodes(previsionId, periodes);
        drhRepository.majCommentaire(previsionId, request.getCommentaire());
        drhRepository.majStatut(previsionId, "REAJUSTEE_RESP", null, false, responsable.getUserId(), null);
        notifierUser(p.getUserId(), "CRG Congés : votre prévision " + p.getExercice()
                + " a été réajustée par votre responsable après échange. Elle part en validation DRH.");
        notifier(drhRepository.telephonesDrh(),
                "CRG Congés : prévision " + p.getExercice() + " de " + p.getNomComplet()
                        + " réajustée par le responsable — en attente de validation DRH.");
        return drhRepository.previsionById(previsionId).orElseThrow();
    }

    // ==================== Prévision — DRH ====================

    @Override
    public List<PrevisionDto> previsionsAValider(User drh, int exercice) {
        exigerDrh(drh);
        return drhRepository.previsionsAValiderDrh(exercice);
    }

    @Override
    public List<PrevisionDto> previsionsToutes(User drh, int exercice, Long departementId) {
        exigerDrh(drh);
        return drhRepository.previsionsToutes(exercice, departementId);
    }

    @Override
    @Transactional
    public PrevisionDto validerDrh(User drh, Long previsionId) {
        exigerDrh(drh);
        PrevisionDto p = exigerStatut(previsionId, Set.of("ACCEPTEE_RESP", "REAJUSTEE_RESP"));
        drhRepository.majStatut(previsionId, "VALIDEE_DRH", null, false, null, drh.getUserId());
        notifierUser(p.getUserId(), "CRG Congés : votre prévision de congés " + p.getExercice()
                + " est validée par la DRH et inscrite au calendrier officiel.");
        return drhRepository.previsionById(previsionId).orElseThrow();
    }

    @Override
    @Transactional
    public PrevisionDto renvoyerDrh(User drh, Long previsionId, String motif) {
        exigerDrh(drh);
        if (motif == null || motif.isBlank()) {
            throw new ValidationException("Le motif du renvoi est obligatoire");
        }
        PrevisionDto p = exigerStatut(previsionId, Set.of("ACCEPTEE_RESP", "REAJUSTEE_RESP"));
        drhRepository.majStatut(previsionId, "REJETEE_DRH", motif, false, null, drh.getUserId());
        notifierUser(p.getUserId(), "CRG Congés : votre prévision " + p.getExercice()
                + " a été renvoyée par la DRH — " + motif + ".");
        notifier(drhRepository.telephonesResponsables(p.getDepartementId()),
                "CRG Congés : la prévision " + p.getExercice() + " de " + p.getNomComplet()
                        + " a été renvoyée par la DRH — " + motif + ".");
        return drhRepository.previsionById(previsionId).orElseThrow();
    }

    // ==================== Règles ====================

    /** Contrôle des périodes : bornes dans l'exercice, pas de chevauchement, total dans le droit annuel. */
    private List<PeriodeDto> controlerPeriodes(PrevisionRequest request, int exercice) {
        if (request.getPeriodes() == null || request.getPeriodes().isEmpty()) {
            throw new ValidationException("Ajoutez au moins une période de congé");
        }
        List<PeriodeRequest> tri = request.getPeriodes().stream()
                .peek(pr -> {
                    if (pr.getDateDebut() == null || pr.getDateFin() == null) {
                        throw new ValidationException("Chaque période doit avoir une date de début et de fin");
                    }
                    if (pr.getDateFin().isBefore(pr.getDateDebut())) {
                        throw new ValidationException("La date de fin doit être après la date de début");
                    }
                    if (pr.getDateDebut().getYear() != exercice || pr.getDateFin().getYear() != exercice) {
                        throw new ValidationException("Les périodes doivent être comprises dans l'exercice " + exercice);
                    }
                })
                .sorted((a, b) -> a.getDateDebut().compareTo(b.getDateDebut()))
                .toList();
        for (int i = 1; i < tri.size(); i++) {
            if (!tri.get(i).getDateDebut().isAfter(tri.get(i - 1).getDateFin())) {
                throw new ValidationException("Les périodes ne doivent pas se chevaucher");
            }
        }
        Set<LocalDate> feries = new HashSet<>(drhRepository.joursFeries(
                LocalDate.of(exercice, 1, 1), LocalDate.of(exercice, 12, 31)));
        List<PeriodeDto> periodes = tri.stream()
                .map(pr -> PeriodeDto.builder()
                        .dateDebut(pr.getDateDebut())
                        .dateFin(pr.getDateFin())
                        .nbJours(joursOuvrables(pr.getDateDebut(), pr.getDateFin(), feries))
                        .build())
                .toList();
        int total = periodes.stream().mapToInt(PeriodeDto::getNbJours).sum();
        if (total == 0) {
            throw new ValidationException("Les périodes choisies ne contiennent aucun jour ouvrable");
        }
        int droit = drhRepository.parametreInt(PARAM_DROIT_ANNUEL, 30);
        if (total > droit) {
            throw new ValidationException("Le total prévu (" + total
                    + " jours ouvrables) dépasse le droit annuel de " + droit + " jours");
        }
        return periodes;
    }

    /**
     * Jours ouvrables du congé = lundi à SAMEDI inclus, hors dimanches et jours fériés
     * (règle CRG confirmée le 2026-09-06 : le samedi fait partie du congé, pas le dimanche).
     */
    static int joursOuvrables(LocalDate debut, LocalDate fin, Set<LocalDate> feries) {
        int n = 0;
        for (LocalDate d = debut; !d.isAfter(fin); d = d.plusDays(1)) {
            if (d.getDayOfWeek() != DayOfWeek.SUNDAY && !feries.contains(d)) {
                n++;
            }
        }
        return n;
    }

    private static int exigerExercice(PrevisionRequest request) {
        if (request.getExercice() == null) {
            throw new ValidationException("L'exercice (année) est obligatoire");
        }
        return request.getExercice();
    }

    /** Habilitation DRH : rôle DRH ou SUPER_ADMIN, OU RESPONSABLE du département DRH
     *  (case Responsable cochée dans l'écran Organisation). Il cumule alors les deux
     *  casquettes : responsable de sa direction + validation finale DRH. */
    private boolean estDrh(User user) {
        return ROLE_DRH.equals(user.getRole()) || ROLE_SUPER_ADMIN.equals(user.getRole())
                || ("MANAGER".equals(user.getRole()) && "DRH".equalsIgnoreCase(user.getService()))
                || drhRepository.estMembreDepartementDrh(user.getUserId());
    }

    /** Profil « Administration DRH » complet (V154) : rôle DRH, SUPER_ADMIN, MANAGER du service DRH
     *  (transition) ou responsable du département DRH. */
    @Override
    public boolean estHabiliteDrh(User user) {
        return estDrh(user);
    }

    @Override
    public boolean aHabilitation(User user, String fonction) {
        if (estDrh(user)) return true;
        List<String> f = drhRepository.fonctionsDelegueesDe(user.getUserId());
        return f.contains(fonction) || (f.contains(F_VALIDATION_FINALE) && DGA_ECRITURE.contains(fonction));
    }

    @Override
    public boolean aHabilitationLecture(User user, String fonction) {
        if (aHabilitation(user, fonction)) return true;
        List<String> f = drhRepository.fonctionsDelegueesDe(user.getUserId());
        return f.contains(F_VALIDATION_FINALE) && DGA_LECTURE.contains(fonction);
    }

    @Override
    public boolean estDga(User user) {
        return drhRepository.fonctionsDelegueesDe(user.getUserId()).contains(F_VALIDATION_FINALE);
    }

    private void exigerAdminDrh(User user) {
        if (!estDrh(user)) {
            throw new ValidationException("Action réservée à l'administration DRH");
        }
    }

    // ===== V154 : délégations =====

    @Override
    public List<DelegationDto> listeDelegations(User admin, boolean activesSeulement) {
        exigerAdminDrh(admin);
        return drhRepository.listeDelegations(activesSeulement);
    }

    @Override
    @Transactional
    public DelegationDto creerDelegation(User admin, DelegationRequest r) {
        exigerAdminDrh(admin);
        if (r.getDelegueUserId() == null) {
            throw new ValidationException("Le salarié délégué est obligatoire");
        }
        if (r.getFonction() == null || !FONCTIONS.contains(r.getFonction())) {
            throw new ValidationException("Fonction inconnue : " + r.getFonction());
        }
        if (r.getDateFin() != null && r.getDateFin().isBefore(LocalDate.now())) {
            throw new ValidationException("La date de fin de délégation est déjà passée");
        }
        if (F_VALIDATION_FINALE.equals(r.getFonction())) {
            // DGA : une seule personne en poste (décision du 2026-09-25)
            drhRepository.dgaActif().ifPresent(id -> {
                throw new ValidationException("Un DGA est déjà habilité : révoquez-le avant d'en désigner un autre");
            });
        } else {
            // Délégation « dans son département » : le délégué doit être membre actif de la DRH
            MembreDto membre = drhRepository.membreActifDeUser(r.getDelegueUserId())
                    .orElseThrow(() -> new ValidationException("Ce salarié n'est affecté à aucun département : affectez-le d'abord à la DRH (Organisation)"));
            if (!"DRH".equalsIgnoreCase(membre.getDepartementCode())) {
                throw new ValidationException("Seul un salarié du département DRH peut recevoir cette délégation");
            }
        }
        List<String> existantes = drhRepository.fonctionsDelegueesDe(r.getDelegueUserId());
        if (existantes.contains(r.getFonction())) {
            throw new ValidationException("Ce salarié détient déjà cette délégation");
        }
        Long id = drhRepository.creerDelegation(r.getDelegueUserId(), r.getFonction(), admin.getUserId(),
                r.getDateFin(), r.getCommentaire() == null ? null : r.getCommentaire().trim());
        DelegationDto d = drhRepository.delegationById(id).orElseThrow();
        notifierUser(r.getDelegueUserId(), "CRG DRH : " + prenomNomAdmin(admin) + " vous délègue la fonction « "
                + libelleFonction(r.getFonction()) + " »" + (r.getDateFin() != null ? " jusqu'au " + r.getDateFin() : "")
                + ". Elle apparaît dans votre menu Administration DRH.");
        log.info("Délégation {} attribuée à {} par {}", r.getFonction(), d.getDelegueNom(), admin.getUserId());
        return d;
    }

    @Override
    @Transactional
    public void revoquerDelegation(User admin, Long delegationId) {
        exigerAdminDrh(admin);
        DelegationDto d = drhRepository.delegationById(delegationId)
                .orElseThrow(() -> new ValidationException("Délégation introuvable"));
        if (drhRepository.revoquerDelegation(delegationId, admin.getUserId()) == 0) {
            throw new ValidationException("Cette délégation est déjà révoquée");
        }
        notifierUser(d.getDelegueUserId(), "CRG DRH : votre délégation « " + libelleFonction(d.getFonction())
                + " » a été retirée par " + prenomNomAdmin(admin) + ".");
    }

    @Override
    public List<CandidatDelegationDto> candidatsDelegation(User admin, String fonction) {
        exigerAdminDrh(admin);
        List<CandidatDelegationDto> tous = drhRepository.candidatsDelegation();
        if (F_VALIDATION_FINALE.equals(fonction)) {
            return tous;
        }
        return tous.stream().filter(c -> "DRH".equalsIgnoreCase(c.getDepartementCode())).toList();
    }

    public static String libelleFonction(String f) {
        return switch (f == null ? "" : f) {
            case F_VALIDATION_CONGES -> "Validation des congés et permissions";
            case F_VALIDATION_PREVISIONS -> "Validation des prévisions";
            case F_PRESENCES -> "Gestion des présences";
            case F_MOUVEMENTS -> "Gestion des mouvements";
            case F_ORGANISATION -> "Organisation (départements)";
            case F_PERSONNEL -> "Gestion du personnel";
            case F_AVANCES -> "Validation des avances sur salaire";
            case F_VALIDATION_FINALE -> "Validation finale (DGA)";
            default -> f;
        };
    }

    private static String prenomNomAdmin(User user) {
        return user.getFirstName() + " " + user.getLastName();
    }

    // ===== V154 : lots =====

    @Override
    public List<ResultatLotDto> validerPrevisionsLot(User drh, List<Long> ids) {
        return traiterLot(ids, id -> validerDrh(drh, id).getNomComplet() + " : prévision validée");
    }

    @Override
    public List<ResultatLotDto> accepterPrevisionsLot(User responsable, List<Long> ids) {
        return traiterLot(ids, id -> accepter(responsable, id).getNomComplet() + " : prévision acceptée");
    }

    /** Chaque élément est traité séparément : un échec n'annule pas les autres. */
    public static List<ResultatLotDto> traiterLot(List<Long> ids, java.util.function.Function<Long, String> action) {
        List<ResultatLotDto> resultats = new java.util.ArrayList<>();
        if (ids == null || ids.isEmpty()) {
            throw new ValidationException("Aucune demande sélectionnée");
        }
        for (Long id : ids) {
            try {
                resultats.add(ResultatLotDto.builder().id(id).succes(true).message(action.apply(id)).build());
            } catch (ValidationException e) {
                resultats.add(ResultatLotDto.builder().id(id).succes(false).message(e.getMessage()).build());
            } catch (RuntimeException e) {
                resultats.add(ResultatLotDto.builder().id(id).succes(false).message("Erreur technique : " + e.getMessage()).build());
            }
        }
        return resultats;
    }

    private void exigerDrh(User user) {
        if (!aHabilitation(user, F_VALIDATION_PREVISIONS)) {
            throw new ValidationException("Action réservée à la DRH");
        }
    }

    private MembreDto exigerResponsable(User user) {
        MembreDto membre = drhRepository.membreActifDeUser(user.getUserId())
                .orElseThrow(() -> new ValidationException("Vous n'êtes affecté à aucun département"));
        if (!Boolean.TRUE.equals(membre.getEstResponsable())) {
            throw new ValidationException("Action réservée au responsable du département");
        }
        return membre;
    }

    private PrevisionDto exigerPrevisionDeSonDepartement(User responsable, Long previsionId, String statutAttendu) {
        PrevisionDto p = exigerStatut(previsionId, Set.of(statutAttendu));
        if (estDrh(responsable)) {
            return p; // la DRH peut agir sur tous les départements
        }
        if (estDga(responsable) && drhRepository.estResponsableActif(p.getUserId())) {
            return p; // V154 : le DGA traite l'étape responsable des demandes des responsables
        }
        MembreDto membre = exigerResponsable(responsable);
        if (!membre.getDepartementId().equals(p.getDepartementId())) {
            throw new ValidationException("Cette prévision n'appartient pas à votre département");
        }
        return p;
    }

    private PrevisionDto exigerStatut(Long previsionId, Set<String> statutsAttendus) {
        PrevisionDto p = drhRepository.previsionById(previsionId)
                .orElseThrow(() -> new ValidationException("Prévision introuvable"));
        if (!statutsAttendus.contains(p.getStatut())) {
            throw new ValidationException("La prévision est au statut " + p.getStatut()
                    + " — action impossible");
        }
        return p;
    }

    /** Notification SMS best-effort : un échec d'envoi ne doit jamais bloquer le workflow. */
    private void notifier(List<String> telephones, String message) {
        for (String phone : telephones) {
            try {
                smsService.send(phone, message);
            } catch (Exception e) {
                log.warn("Notification congés non envoyée à {} : {}", phone, e.getMessage());
            }
        }
    }

    private void notifierUser(Long userId, String message) {
        drhRepository.telephoneUser(userId).ifPresent(phone -> notifier(List.of(phone), message));
    }
}
