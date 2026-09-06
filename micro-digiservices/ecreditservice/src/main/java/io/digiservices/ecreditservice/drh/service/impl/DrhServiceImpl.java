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
 * Jours ouvrables = lundi à vendredi hors jours fériés (samedi NON ouvrable — arbitrage du 2026-09-06).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DrhServiceImpl implements DrhService {

    public static final String ROLE_DRH = "DRH";
    public static final String ROLE_SUPER_ADMIN = "SUPER_ADMIN";
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
        return ContexteDrhDto.builder()
                .estMembre(membre.isPresent())
                .estResponsable(membre.map(MembreDto::getEstResponsable).orElse(false))
                .estDrh(estDrh(user))
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
        return drhRepository.affecterMembre(request);
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

        List<PeriodeDto> periodes = controlerPeriodes(request, exercice);

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

    /** Jours ouvrables = lundi..vendredi hors jours fériés. Le samedi n'est pas ouvrable. */
    static int joursOuvrables(LocalDate debut, LocalDate fin, Set<LocalDate> feries) {
        int n = 0;
        for (LocalDate d = debut; !d.isAfter(fin); d = d.plusDays(1)) {
            DayOfWeek dow = d.getDayOfWeek();
            if (dow != DayOfWeek.SATURDAY && dow != DayOfWeek.SUNDAY && !feries.contains(d)) {
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

    private boolean estDrh(User user) {
        return ROLE_DRH.equals(user.getRole()) || ROLE_SUPER_ADMIN.equals(user.getRole());
    }

    private void exigerDrh(User user) {
        if (!estDrh(user)) {
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
