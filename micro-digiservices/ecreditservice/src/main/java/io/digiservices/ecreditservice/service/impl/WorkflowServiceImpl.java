package io.digiservices.ecreditservice.service.impl;

import io.digiservices.clients.EbankingPortefeuilleClient;
import io.digiservices.clients.domain.User;
import io.digiservices.clients.portefeuille.CreditMembreSafDto;
import io.digiservices.ecreditservice.dossier.AnnulationDossier;
import io.digiservices.ecreditservice.dto.AgentAgenceDto;
import io.digiservices.ecreditservice.service.AnnulationDossierNotifier;
import io.digiservices.ecreditservice.dto.WorkflowDemandeDto;
import io.digiservices.ecreditservice.dto.WorkflowRejetRequest;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.WorkflowRepository;
import io.digiservices.ecreditservice.service.AnalyseChargesFonctionnaireService;
import io.digiservices.ecreditservice.service.WorkflowService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkflowServiceImpl implements WorkflowService {

    /** Seuil du bilan obligatoire (V107, aligne sur DetailComponent.SEUIL_BILAN_GNF cote front). */
    private static final java.math.BigDecimal SEUIL_BILAN_GNF = new java.math.BigDecimal("50000000");

    private final WorkflowRepository workflowRepository;
    private final EbankingPortefeuilleClient portefeuilleClient;
    private final AnnulationDossierNotifier notifier;
    private final AnalyseChargesFonctionnaireService analyseChargesFonctionnaireService;
    private final io.digiservices.ecreditservice.service.AnalyseCreditAgricoleService analyseCreditAgricoleService;

    // ==================== AC ====================

    @Override
    @Transactional
    public void approuverAC(Long demandeId, String avis, String codUsuarios, Long userId) {
        log.info("Approbation AC par {} pour demande {}", codUsuarios, demandeId);
        // Crédit fonctionnaire : blocage si l'analyse charges & quotité n'est pas finançable
        analyseChargesFonctionnaireService.verifierFinancableSiFonctionnaire(demandeId);
        analyseCreditAgricoleService.verifierFinancableSiGroupeAgricole(demandeId);
        verifierBilanSoumisSiRequis(demandeId);
        int rows = workflowRepository.approuverAC(demandeId, avis, codUsuarios, userId);
        if (rows == 0) {
            throw new ApiException("Demande non trouvée, état invalide ou dossier affecté à un autre agent");
        }
    }

    /**
     * Garde-fou 2026-09-23 (dossier 1389, 6 dossiers bloqués en prod) : un dossier individuel
     * >= 50 M hors fonctionnaire et hors groupe ne peut pas être approuvé (ni renvoyé au DA)
     * tant que l'analyse financière n'est pas SOUMISE ou VALIDEE. Sinon le DA reçoit un dossier
     * qu'il ne peut ni valider ni rejeter. Les natures fonctionnaire / groupe ont leurs propres
     * analyses (charges & quotité, analyse agricole), contrôlées par ailleurs.
     */
    private void verifierBilanSoumisSiRequis(Long demandeId) {
        var ctx = workflowRepository.getControleBilanAC(demandeId);
        if (ctx == null) {
            return;
        }
        Object montantObj = ctx.get("montantDemande");
        java.math.BigDecimal montant = montantObj == null ? java.math.BigDecimal.ZERO : new java.math.BigDecimal(montantObj.toString());
        String nature = ctx.get("natureClient") == null ? "" : ctx.get("natureClient").toString();
        if (montant.compareTo(SEUIL_BILAN_GNF) < 0
                || io.digiservices.ecreditservice.validation.CreditFonctionnaireValidator.NATURE_FONCTIONNAIRE.equals(nature)
                || io.digiservices.ecreditservice.validation.CreditGroupeValidator.NATURE_GROUPE.equals(nature)) {
            return;
        }
        String statut = ctx.get("statutAnalyse") == null ? null : ctx.get("statutAnalyse").toString();
        if (!"SOUMISE".equals(statut) && !"VALIDEE".equals(statut)) {
            String etat = statut == null ? "non renseignée" : "en " + statut.toLowerCase();
            throw new ApiException(
                    "Approbation impossible : l'analyse financière (bilan, flux de trésorerie) est obligatoire "
                            + "pour un montant supérieur ou égal à 50 000 000 GNF et elle est " + etat
                            + ". Renseignez et soumettez l'analyse avant d'approuver la demande.");
        }
    }

    /**
     * Resoumission par l'agent d'un dossier corrigé après rejet DR/DE : retour dans la
     * file du niveau qui a rejeté, sans échelle de délégation ni écrasement des
     * avis/signatures DA/DR (contrairement à un appel valider-da/valider-dr).
     */
    @Override
    @Transactional
    public void resoumettreCorrection(Long demandeId) {
        log.info("Resoumission après correction DR/DE (ou rejet DG confirmé par le DE) pour demande {}", demandeId);
        // Crédit fonctionnaire : la quotité doit rester finançable après la correction
        analyseChargesFonctionnaireService.verifierFinancableSiFonctionnaire(demandeId);
        analyseCreditAgricoleService.verifierFinancableSiGroupeAgricole(demandeId);
        int rows = workflowRepository.resoumettreCorrection(demandeId);
        if (rows == 0) {
            throw new ApiException("Demande non trouvée ou état invalide pour la resoumission (attendu : CORRECTION_DR ou CORRECTION_DE)");
        }
    }

    // ==================== DA ====================

    @Override
    public List<WorkflowDemandeDto> getAValiderDA(Long agenceId) {
        return workflowRepository.getAValiderDA(agenceId);
    }

    @Override
    public List<WorkflowDemandeDto> getEnCorrectionDRForDA(Long agenceId) {
        return workflowRepository.getEnCorrectionDRForDA(agenceId);
    }

    @Override
    @Transactional
    public void validerDA(Long demandeId, String avis, String validatedBy) {
        log.info("Validation DA par {} pour demande {}", validatedBy, demandeId);
        // Crédit fonctionnaire : re-contrôle de la quotité à la validation DA
        analyseChargesFonctionnaireService.verifierFinancableSiFonctionnaire(demandeId);
        analyseCreditAgricoleService.verifierFinancableSiGroupeAgricole(demandeId);
        int rows = workflowRepository.validerDA(demandeId, avis, validatedBy);
        if (rows == 0) {
            throw new ApiException("Demande non trouvée ou état invalide pour la validation DA");
        }
    }

    @Override
    @Transactional
    public void rejeterDA(Long demandeId, WorkflowRejetRequest request, String validatedBy) {
        validateRejetRequest(request);
        log.info("Rejet DA par {} pour demande {}: {}", validatedBy, demandeId, request.getMotifRejet());
        int rows = workflowRepository.rejeterDA(demandeId, request, validatedBy);
        if (rows == 0) {
            throw new ApiException("Demande non trouvée ou état invalide pour le rejet DA");
        }
    }

    // ==================== RENVOI DA -> AGENT ====================

    @Override
    @Transactional
    public void renvoyerAgent(Long demandeId, String motif, String renvoyePar) {
        if (motif == null || motif.isBlank()) {
            throw new ApiException("Le motif du renvoi est obligatoire");
        }
        log.info("Renvoi à l'agent par {} pour demande {}: {}", renvoyePar, demandeId, motif);
        int rows = workflowRepository.renvoyerAgent(demandeId, motif, renvoyePar);
        if (rows == 0) {
            throw new ApiException("Demande non trouvée ou état invalide pour le renvoi à l'agent");
        }
    }

    @Override
    public List<WorkflowDemandeDto> getRenvoyeesAC(String codUsuarios, String username, Long userId) {
        return workflowRepository.getRenvoyeesAC(codUsuarios, username, userId);
    }

    @Override
    @Transactional
    public void resoumettreDA(Long demandeId, Long delegation, Long agence, Long pos) {
        if (delegation == null || agence == null) {
            throw new ApiException("La délégation et l'agence de destination sont obligatoires");
        }
        log.info("Resoumission au DA pour demande {} (delegation={}, agence={}, pos={})", demandeId, delegation, agence, pos);
        verifierBilanSoumisSiRequis(demandeId);
        int rows = workflowRepository.resoumettreDA(demandeId, delegation, agence, pos);
        if (rows == 0) {
            throw new ApiException("Demande non trouvée ou état invalide pour la resoumission");
        }
    }

    // ==================== AC LISTS ====================

    @Override
    public List<WorkflowDemandeDto> getEnCorrectionAC(Long agenceId, Long pointventeId, Long userId) {
        return workflowRepository.getEnCorrectionAC(agenceId, pointventeId, userId);
    }

    @Override
    public List<WorkflowDemandeDto> getEnCorrectionDRForAC(Long agenceId, Long pointventeId, Long userId) {
        return workflowRepository.getEnCorrectionDRForAC(agenceId, pointventeId, userId);
    }

    @Override
    public List<WorkflowDemandeDto> getEnCorrectionDEForAC(Long agenceId, Long pointventeId, Long userId) {
        return workflowRepository.getEnCorrectionDEForAC(agenceId, pointventeId, userId);
    }

    @Override
    public List<WorkflowDemandeDto> getEnAttenteDA(Long agenceId, Long pointventeId, Long userId) {
        return workflowRepository.getEnAttenteDA(agenceId, pointventeId, userId);
    }

    @Override
    public List<WorkflowDemandeDto> getSuiviValidationAC(Long agenceId, Long pointventeId, Long userId) {
        return workflowRepository.getSuiviValidationAC(agenceId, pointventeId, userId);
    }

    @Override
    public List<WorkflowDemandeDto> getAApprouverAC(Long agenceId, Long pointventeId, Long userId) {
        return workflowRepository.getAApprouverAC(agenceId, pointventeId, userId);
    }

    // ==================== DA - DEMANDES AFFECTEES ====================

    @Override
    public List<WorkflowDemandeDto> getDemandesAffecteesDA(Long agenceId) {
        return workflowRepository.getDemandesAffecteesDA(agenceId);
    }

    @Override
    @Transactional
    public void annulerAffectation(Long demandeId) {
        log.info("Annulation de l'affectation pour demande {}", demandeId);
        int rows = workflowRepository.annulerAffectation(demandeId);
        if (rows == 0) {
            throw new ApiException("Demande non trouvée ou état invalide pour l'annulation de l'affectation");
        }
    }

    // ==================== DR ====================

    @Override
    public List<WorkflowDemandeDto> getAValiderDR(Long delegationId) {
        return workflowRepository.getAValiderDR(delegationId);
    }

    @Override
    public List<WorkflowDemandeDto> getEnCorrectionDEForDR(Long delegationId) {
        return workflowRepository.getEnCorrectionDEForDR(delegationId);
    }

    @Override
    @Transactional
    public void validerDR(Long demandeId, String avis, String validatedBy) {
        log.info("Validation DR par {} pour demande {}", validatedBy, demandeId);
        int rows = workflowRepository.validerDR(demandeId, avis, validatedBy);
        if (rows == 0) {
            throw new ApiException("Demande non trouvée ou état invalide pour la validation DR");
        }
    }

    @Override
    @Transactional
    public void rejeterDR(Long demandeId, WorkflowRejetRequest request, String validatedBy) {
        validateRejetRequest(request);
        log.info("Rejet DR par {} pour demande {}: {}", validatedBy, demandeId, request.getMotifRejet());
        int rows = workflowRepository.rejeterDR(demandeId, request, validatedBy);
        if (rows == 0) {
            throw new ApiException("Demande non trouvée ou état invalide pour le rejet DR");
        }
    }

    // ==================== DE ====================

    @Override
    public List<WorkflowDemandeDto> getAValiderDE() {
        return workflowRepository.getAValiderDE();
    }

    @Override
    public List<WorkflowDemandeDto> getSuiviGlobalDE() {
        return workflowRepository.getSuiviGlobalDE();
    }

    @Override
    public List<WorkflowDemandeDto> getSuiviGlobalReseau(Long delegationId, Long agenceId) {
        return workflowRepository.getSuiviGlobalReseau(delegationId, agenceId);
    }

    @Override
    public List<WorkflowDemandeDto> getValidesDE() {
        return workflowRepository.getValidesDE();
    }

    @Override
    public List<WorkflowDemandeDto> getInspectionCreditsDR() {
        return workflowRepository.getInspectionCreditsDR();
    }

    @Override
    @Transactional
    public void validerDE(Long demandeId, String avis, String validatedBy) {
        log.info("Validation DE par {} pour demande {}", validatedBy, demandeId);
        int rows = workflowRepository.validerDE(demandeId, avis, validatedBy);
        if (rows == 0) {
            throw new ApiException("Demande non trouvée ou état invalide pour la validation DE");
        }
    }

    @Override
    @Transactional
    public void rejeterDE(Long demandeId, WorkflowRejetRequest request, String validatedBy) {
        validateRejetRequest(request);
        log.info("Rejet DE par {} pour demande {}: {}", validatedBy, demandeId, request.getMotifRejet());
        int rows = workflowRepository.rejeterDE(demandeId, request, validatedBy);
        if (rows == 0) {
            throw new ApiException("Demande non trouvée ou état invalide pour le rejet DE");
        }
    }

    // ==================== DG ====================

    @Override
    public List<WorkflowDemandeDto> getAValiderDG() {
        return workflowRepository.getAValiderDG();
    }

    @Override
    public List<WorkflowDemandeDto> getRejetsDGAConfirmer() {
        return workflowRepository.getRejetsDGAConfirmer();
    }

    @Override
    public List<WorkflowDemandeDto> getValidesDG() {
        return workflowRepository.getValidesDG();
    }

    @Override
    @Transactional
    public void validerDG(Long demandeId, String avis, String validatedBy) {
        log.info("Visa favorable DG par {} pour demande {}", validatedBy, demandeId);
        int rows = workflowRepository.validerDG(demandeId, avis, validatedBy);
        if (rows == 0) {
            throw new ApiException("Demande non trouvée ou état invalide pour la validation DG");
        }
    }

    @Override
    @Transactional
    public void rejeterDG(Long demandeId, String motifRejet, String validatedBy) {
        if (motifRejet == null || motifRejet.isBlank()) {
            throw new ApiException("Les remarques (motif) du rejet DG sont obligatoires");
        }
        log.info("Rejet DG par {} pour demande {}", validatedBy, demandeId);
        int rows = workflowRepository.rejeterDG(demandeId, motifRejet, validatedBy);
        if (rows == 0) {
            throw new ApiException("Demande non trouvée ou état invalide pour le rejet DG");
        }
    }

    @Override
    @Transactional
    public void confirmerRejetDG(Long demandeId, String instructions, java.util.List<String> sectionsARevoir, String confirmedBy) {
        log.info("Confirmation du rejet DG par le DE {} pour demande {}", confirmedBy, demandeId);
        if (sectionsARevoir == null || sectionsARevoir.isEmpty()) {
            throw new ApiException("Veuillez cocher au moins une section à revoir pour guider la correction");
        }
        String sectionsJoined = String.join(",", sectionsARevoir);
        int rows = workflowRepository.confirmerRejetDG(demandeId, instructions, sectionsJoined, confirmedBy);
        if (rows == 0) {
            throw new ApiException("Demande non trouvée ou état invalide pour la confirmation du rejet DG");
        }
    }

    // ==================== ACCUEIL (reception des demandes) ====================

    @Override
    @Transactional
    public void marquerReception(Long demandeId, Long userId, String codUsuarios) {
        log.info("Reception demande {} par l'accueil {} — en attente d'affectation par le DA", demandeId, codUsuarios);
        int rows = workflowRepository.marquerReception(demandeId, userId, codUsuarios);
        if (rows == 0) {
            throw new ApiException("Demande non trouvee ou etat invalide pour la reception");
        }
    }

    /**
     * Agents de credit eligibles a une affectation : role AGENT_CREDIT.
     * Le cumul accueil + credit est autorise (points de service mono-agent) :
     * un agent avec la fonction ACCUEIL active saisit ET analyse. Le garde-fou
     * est le DA, qui affecte chaque demande en voyant qui l'a saisie.
     */
    @Override
    public java.util.List<AgentAgenceDto> getAgentsCreditEligibles(Long agenceId) {
        // 2026-09-24 : les comptes bloques (desactives ou verrouilles) ne sont plus proposes a l'affectation
        return workflowRepository.getAgentsAgence(agenceId).stream()
                .filter(a -> "AGENT_CREDIT".equals(a.getRole()))
                .filter(a -> !Boolean.FALSE.equals(a.getCompteActif()))
                .toList();
    }

    /** Perimetre agence + role : seul un agent de credit de l'agence peut recevoir une affectation. */
    private void verifierEligibiliteAgent(Long agentUserId, Long agenceId) {
        Long agenceAgent = workflowRepository.getAgenceOfUser(agentUserId);
        if (agenceAgent == null || !agenceAgent.equals(agenceId)) {
            throw new ApiException("L'agent selectionne n'appartient pas a votre agence");
        }
        if (!workflowRepository.getRolesOfUser(agentUserId).contains("AGENT_CREDIT")) {
            throw new ApiException("Seul un agent de credit peut recevoir une affectation");
        }
        if (!workflowRepository.isCompteActif(agentUserId)) {
            throw new ApiException("Le compte de cet agent est bloqué : il ne peut pas recevoir d'affectation");
        }
    }

    @Override
    public java.util.List<WorkflowDemandeDto> getAAffecterDA(Long agenceId) {
        return workflowRepository.getAAffecterDA(agenceId);
    }

    @Override
    @Transactional
    public void affecterAC(Long demandeId, Long agentUserId, String affectePar, Long agenceIdDA) {
        verifierEligibiliteAgent(agentUserId, agenceIdDA);
        log.info("Affectation/reorientation de la demande {} vers l'agent {} par {}", demandeId, agentUserId, affectePar);
        int rows = workflowRepository.affecterAC(demandeId, agentUserId, affectePar);
        if (rows == 0) {
            throw new ApiException("Demande non trouvee ou etat invalide pour la reorientation");
        }
    }

    @Override
    @Transactional
    public void reattribuer(Long demandeId, Long agentUserId, String affectePar, Long agenceIdDA, String motif) {
        if (motif == null || motif.isBlank() || motif.trim().length() < 5) {
            throw new ApiException("Indiquez le motif de la reattribution (rotation, absence, depart...)");
        }
        verifierEligibiliteAgent(agentUserId, agenceIdDA);
        java.util.Map<String, Object> infos = workflowRepository.infosReattribution(demandeId, agentUserId);
        if (infos == null) {
            throw new ApiException("Demande non trouvee");
        }
        Long agenceDossier = infos.get("agence") == null ? null : ((Number) infos.get("agence")).longValue();
        if (agenceDossier == null || !agenceDossier.equals(agenceIdDA)) {
            throw new ApiException("Ce dossier n'appartient pas a votre agence");
        }
        Long pos = infos.get("pos") == null ? null : ((Number) infos.get("pos")).longValue();
        Long psAgent = infos.get("agent_pointvente_id") == null ? null : ((Number) infos.get("agent_pointvente_id")).longValue();
        if (pos != null && !pos.equals(psAgent)) {
            throw new ApiException("Un dossier se reattribue a un agent de credit du meme point de service");
        }
        Long ancienAgent = infos.get("agent_credit_affecte") == null ? null : ((Number) infos.get("agent_credit_affecte")).longValue();
        if (agentUserId.equals(ancienAgent) && !"CORRECTION_ACCUEIL".equals(infos.get("validation_state"))) {
            throw new ApiException("Ce dossier est deja chez cet agent");
        }
        String nomAgent = String.valueOf(infos.get("agent_nom"));
        log.info("[REATTRIBUTION] demande {} : agent {} -> {} par {} ({})", demandeId, ancienAgent, agentUserId, affectePar, motif);
        int rows = workflowRepository.reattribuer(demandeId, agentUserId, ancienAgent, affectePar, nomAgent, motif.trim());
        if (rows == 0) {
            throw new ApiException("Ce dossier n'est pas dans un etat qui permet la reattribution (il attend une validation ou est clos)");
        }
    }

    @Override
    @Transactional
    public void annulerAccueil(Long demandeId, String motif) {
        if (motif == null || motif.isBlank()) {
            throw new ApiException("Le motif de l'annulation est obligatoire");
        }
        log.info("Annulation (retour accueil) de la demande {}", demandeId);
        int rows = workflowRepository.annulerAccueil(demandeId, motif);
        if (rows == 0) {
            throw new ApiException("Demande non trouvee ou etat invalide pour l'annulation");
        }
    }

    @Override
    public java.util.List<WorkflowDemandeDto> getMesReceptions(Long userId) {
        return workflowRepository.getMesReceptions(userId);
    }

    @Override
    @Transactional
    public void rediligenterAccueil(Long demandeId, Long userId) {
        log.info("Rediligence de la demande {} par l'agent d'accueil {}", demandeId, userId);
        int rows = workflowRepository.rediligenterAccueil(demandeId, userId);
        if (rows == 0) {
            throw new ApiException("Demande non trouvee, etat invalide ou demande saisie par un autre agent");
        }
    }

    @Override
    public java.util.List<WorkflowDemandeDto> getMesAffectationsAC(Long userId) {
        return workflowRepository.getMesAffectationsAC(userId);
    }

    @Override
    @Transactional
    public void prendreEnChargeAC(Long demandeId, Long userId) {
        // Cumul accueil + credit autorise : la fonction ACCUEIL active ne bloque plus
        // l'instruction (points de service mono-agent). Le DA reste le garde-fou a l'affectation.
        log.info("Prise en charge de la demande {} par l'agent de credit {}", demandeId, userId);
        int rows = workflowRepository.prendreEnChargeAC(demandeId, userId);
        if (rows == 0) {
            throw new ApiException("Demande non trouvee, etat invalide ou demande affectee a un autre agent");
        }
    }

    // ==================== DA - GESTION DES FONCTIONS D'AGENCE ====================

    @Override
    public java.util.List<AgentAgenceDto> getAgentsAgence(Long agenceId) {
        return workflowRepository.getAgentsAgence(agenceId);
    }

    @Override
    @Transactional
    public void setAgentFonction(Long userId, String fonction, boolean actif, Long affectePar, Long agenceIdDA) {
        if (!"ACCUEIL".equals(fonction) && !"CREDIT".equals(fonction) && !"CONTENTIEUX".equals(fonction)) {
            throw new ApiException("Fonction invalide : " + fonction);
        }
        Long agenceAgent = workflowRepository.getAgenceOfUser(userId);
        if (agenceAgent == null || !agenceAgent.equals(agenceIdDA)) {
            throw new ApiException("Cet agent n'appartient pas a votre agence");
        }
        log.info("Fonction {} -> {} pour l'agent {} (par {})", fonction, actif, userId, affectePar);
        workflowRepository.upsertAgentFonction(userId, fonction, actif, affectePar);
    }

    @Override
    public java.util.List<String> getMesFonctions(Long userId) {
        return workflowRepository.getMesFonctions(userId);
    }

    private void validateRejetRequest(WorkflowRejetRequest request) {
        if (request.getMotifRejet() == null || request.getMotifRejet().isBlank()) {
            throw new ApiException("Le motif de rejet est obligatoire");
        }
        if (request.getSectionsARevoir() == null || request.getSectionsARevoir().isEmpty()) {
            throw new ApiException("Au moins une section à revoir doit être sélectionnée");
        }
    }

    // ===== Annulation du dossier (V163, puis V216 DSIG 2026-11-19 : a toute etape, par tout role) =====

    /** Un commentaire plus court n'explique rien : meme exigence que les autres motifs du circuit. */
    private static final int LONGUEUR_MINIMALE_MOTIF = 10;

    private static AnnulationDossier.Acteur acteur(User u) {
        String nom = ((u.getFirstName() == null ? "" : u.getFirstName()) + " "
                + (u.getLastName() == null ? "" : u.getLastName())).trim();
        return new AnnulationDossier.Acteur(u.getRole(), u.getService(), u.getUserId(), u.getUsername(), nom,
                u.getAgenceId(), u.getDelegationId());
    }

    private static String nomAffichable(User u) {
        return acteur(u).nomComplet();
    }

    private static AnnulationDossier.Dossier dossier(WorkflowDemandeDto d, boolean creditSafMisEnPlace) {
        return new AnnulationDossier.Dossier(d.getDemandeIndividuelId(), d.getValidationState(), d.getStatutDemande(),
                d.getAgence(), d.getDelegation(), d.getAgentCreditAffecte(), d.getCodUsuarios(), d.getSaisiePar(),
                creditSafMisEnPlace);
    }

    private WorkflowDemandeDto lire(Long demandeId) {
        WorkflowDemandeDto d = workflowRepository.lireDossierPourAnnulation(demandeId);
        if (d == null) throw new ApiException("Dossier " + demandeId + " introuvable");
        return d;
    }

    /**
     * La garde SAF : un dossier approuve au niveau final n'est annulable ici que si aucun credit
     * n'a ete ouvert pour le membre depuis la validation. Retourne vrai si un credit existe ; leve
     * une erreur explicite si SAF ne repond pas (jamais d'annulation a l'aveugle) ou si le numero
     * de membre manque (rien a verifier, donc rien a accorder).
     */
    private boolean creditSafMisEnPlace(WorkflowDemandeDto d) {
        if (!AnnulationDossier.VALIDATED_FINAL.equals(d.getValidationState())) return false;
        String membre = d.getNumeroMembre() == null ? "" : d.getNumeroMembre().trim();
        if (membre.isEmpty()) {
            throw new ApiException("Ce dossier approuvé n'a pas de numéro de membre : impossible de vérifier dans SAF "
                    + "qu'aucun crédit n'est mis en place, donc impossible de l'annuler ici");
        }
        List<CreditMembreSafDto> credits;
        try {
            credits = portefeuilleClient.getCreditsDesMembres(List.of(membre));
        } catch (Exception e) {
            log.warn("[ANNULATION] SAF injoignable pour le membre {} : {}", membre, e.getMessage());
            throw new ApiException("SAF ne répond pas : impossible de vérifier que le crédit n'est pas déjà mis en place. "
                    + "Réessayez plus tard, l'annulation n'est jamais accordée à l'aveugle");
        }
        LocalDate depuis = d.getDateValidationFinale() == null ? null : d.getDateValidationFinale().toLocalDate();
        return credits != null && credits.stream().anyMatch(c -> c.getFecApertura() != null
                && (depuis == null || !c.getFecApertura().isBefore(depuis)));
    }

    @Override
    public Map<String, Object> droitAnnulation(Long demandeId, User user) {
        WorkflowDemandeDto d = workflowRepository.lireDossierPourAnnulation(demandeId);
        Map<String, Object> droit = new LinkedHashMap<>();
        if (d == null) {
            droit.put("mode", "REFUS");
            droit.put("raison", "Dossier introuvable");
            droit.put("peutReouvrir", false);
            return droit;
        }
        AnnulationDossier.Acteur a = acteur(user);
        AnnulationDossier.Decision decision;
        try {
            decision = AnnulationDossier.decider(a, dossier(d, creditSafMisEnPlace(d)));
        } catch (ApiException e) {
            decision = new AnnulationDossier.Decision(AnnulationDossier.Mode.REFUS,
                    AnnulationDossier.tenantDe(d.getValidationState()), e.getMessage());
        }
        droit.put("mode", decision.mode().name());
        droit.put("etape", d.getValidationState());
        droit.put("tenant", decision.tenant());
        droit.put("libelleTenant", AnnulationDossier.libelleTenant(decision.tenant()));
        droit.put("raison", decision.raison());
        droit.put("libelleBouton", decision.mode() == AnnulationDossier.Mode.DIRECTE
                ? "Annuler le dossier" : "Demander l'annulation");
        // Reouverture : dossier annule, dans le delai, par le tenant de l'etape ou il s'est arrete.
        boolean annule = "ANNULE".equals(d.getStatutDemande());
        boolean dansLeDelai = d.getDateDecisionAnnulation() != null
                && d.getDateDecisionAnnulation().isAfter(LocalDateTime.now().minusDays(AnnulationDossier.JOURS_REOUVERTURE));
        boolean tenantDeLEtape = AnnulationDossier.peutDecider(a, AnnulationDossier.tenantDe(d.getValidationState()),
                dossier(d, false));
        droit.put("peutReouvrir", annule && dansLeDelai && tenantDeLEtape);
        droit.put("joursReouverture", AnnulationDossier.JOURS_REOUVERTURE);
        if (annule && !dansLeDelai) {
            droit.put("raisonReouverture", "Le délai de réouverture de " + AnnulationDossier.JOURS_REOUVERTURE + " jours est passé");
        } else if (annule && !tenantDeLEtape) {
            droit.put("raisonReouverture", "Seul " + AnnulationDossier.libelleTenant(
                    AnnulationDossier.tenantDe(d.getValidationState())) + " peut rouvrir ce dossier");
        }
        // La trace de l'annulation, pour les bandeaux de la page : la lecture du détail
        // (GET /ecredit/detail) ne porte pas ces colonnes, c'est ici que la page les prend.
        Map<String, Object> trace = new LinkedHashMap<>();
        trace.put("enAttente", AnnulationDossier.ETAPE_DEMANDE.equals(d.getValidationState()));
        trace.put("annule", annule);
        trace.put("etatAvantAnnulation", d.getEtatAvantAnnulation());
        trace.put("tenantDecision", AnnulationDossier.tenantDe(d.getEtatAvantAnnulation()));
        trace.put("libelleTenantDecision", AnnulationDossier.libelleTenant(AnnulationDossier.tenantDe(d.getEtatAvantAnnulation())));
        trace.put("motifCode", d.getAnnulationMotifCode());
        trace.put("motif", d.getAnnulationMotif());
        trace.put("demandeePar", d.getAnnulationDemandeePar());
        trace.put("dateDemande", d.getDateDemandeAnnulation());
        trace.put("decideePar", d.getAnnulationDecideePar());
        trace.put("dateDecision", d.getDateDecisionAnnulation());
        trace.put("motifRefus", d.getAnnulationMotifRefus());
        trace.put("modeAnnulation", d.getAnnulationMode());
        trace.put("role", d.getAnnulationRole());
        trace.put("dateReouverture", d.getDateReouverture());
        trace.put("reouverturePar", d.getReouverturePar());
        droit.put("annulation", trace);
        return droit;
    }

    @Override
    @Transactional
    public AnnulationDossier.Decision annulerDossier(Long demandeId, String motifCode, String motif, User user) {
        if (motifCode == null || !AnnulationDossier.MOTIFS.contains(motifCode)) {
            throw new ApiException("Le motif d'annulation est obligatoire et doit être choisi dans la liste");
        }
        if (motif == null || motif.strip().length() < LONGUEUR_MINIMALE_MOTIF) {
            throw new ApiException("Expliquez l'annulation en " + LONGUEUR_MINIMALE_MOTIF + " caractères au moins");
        }
        WorkflowDemandeDto d = lire(demandeId);
        AnnulationDossier.Acteur a = acteur(user);
        AnnulationDossier.Decision decision = AnnulationDossier.decider(a, dossier(d, creditSafMisEnPlace(d)));
        if (!decision.permise()) {
            throw new ApiException(decision.raison());
        }
        String etape = d.getValidationState() == null || d.getValidationState().isBlank() ? "NOUVEAU" : d.getValidationState();
        String par = nomAffichable(user);
        String texte = motif.strip();
        if (decision.mode() == AnnulationDossier.Mode.DIRECTE) {
            String role = a.roleNormalise();
            log.info("Annulation directe du dossier {} par {} ({}) : {} — {}", demandeId, par, role, motifCode, texte);
            int rows = workflowRepository.annulerDirectement(demandeId, etape, role, motifCode, texte, par, user.getUserId());
            if (rows == 0) {
                throw new ApiException("Le dossier a changé d'étape entre-temps : rouvrez-le et recommencez");
            }
            notifier.annulationDirecte(d, par, role, texte);
        } else {
            log.info("Demande d'annulation du dossier {} par {} ({}) : {} — {}", demandeId, par, a.roleNormalise(), motifCode, texte);
            int rows = workflowRepository.demanderAnnulation(demandeId, etape, motifCode, texte, par, user.getUserId());
            if (rows == 0) {
                throw new ApiException("Le dossier a changé d'étape entre-temps : rouvrez-le et recommencez");
            }
            notifier.demande(d, decision.tenant(), par, texte);
        }
        return decision;
    }

    /** Le tenant de l'etape memorisee, ou la DSIG ; sinon, erreur qui nomme le decideur attendu. */
    private String controlerDecideur(WorkflowDemandeDto d, User user) {
        if (!AnnulationDossier.ETAPE_DEMANDE.equals(d.getValidationState())) {
            throw new ApiException("Aucune annulation n'est en attente sur ce dossier");
        }
        String tenant = AnnulationDossier.tenantDe(d.getEtatAvantAnnulation());
        AnnulationDossier.Acteur a = acteur(user);
        if (!AnnulationDossier.peutDecider(a, tenant, dossier(d, false))) {
            throw new ApiException("Seul " + AnnulationDossier.libelleTenant(tenant)
                    + " peut décider de cette annulation (dossier arrêté à l'étape "
                    + d.getEtatAvantAnnulation() + ")");
        }
        return a.roleNormalise();
    }

    @Override
    @Transactional
    public void validerAnnulation(Long demandeId, User user) {
        WorkflowDemandeDto d = lire(demandeId);
        String role = controlerDecideur(d, user);
        String par = nomAffichable(user);
        log.info("Validation de l'annulation du dossier {} par {} ({})", demandeId, par, role);
        int rows = workflowRepository.validerAnnulation(demandeId, role, par);
        if (rows == 0) {
            throw new ApiException("Aucune annulation n'est en attente sur ce dossier");
        }
        notifier.decision(d, true, par, null);
    }

    @Override
    @Transactional
    public void refuserAnnulation(Long demandeId, String motifRefus, User user) {
        if (motifRefus == null || motifRefus.strip().length() < LONGUEUR_MINIMALE_MOTIF) {
            throw new ApiException("Le motif du refus est obligatoire, en "
                    + LONGUEUR_MINIMALE_MOTIF + " caractères au moins");
        }
        WorkflowDemandeDto d = lire(demandeId);
        String role = controlerDecideur(d, user);
        String par = nomAffichable(user);
        log.info("Refus de l'annulation du dossier {} par {} ({}) : {}", demandeId, par, role, motifRefus);
        int rows = workflowRepository.refuserAnnulation(demandeId, role, motifRefus.strip(), par);
        if (rows == 0) {
            throw new ApiException("Aucune annulation n'est en attente sur ce dossier");
        }
        notifier.decision(d, false, par, motifRefus.strip());
    }

    @Override
    @Transactional
    public void reouvrirDossier(Long demandeId, String motif, User user) {
        if (motif == null || motif.strip().length() < LONGUEUR_MINIMALE_MOTIF) {
            throw new ApiException("Le motif de la réouverture est obligatoire, en "
                    + LONGUEUR_MINIMALE_MOTIF + " caractères au moins");
        }
        WorkflowDemandeDto d = lire(demandeId);
        if (!"ANNULE".equals(d.getStatutDemande())) {
            throw new ApiException("Ce dossier n'est pas annulé");
        }
        String tenant = AnnulationDossier.tenantDe(d.getValidationState());
        if (!AnnulationDossier.peutDecider(acteur(user), tenant, dossier(d, false))) {
            throw new ApiException("Seul " + AnnulationDossier.libelleTenant(tenant) + " peut rouvrir ce dossier");
        }
        String par = nomAffichable(user);
        log.info("Réouverture du dossier {} par {} : {}", demandeId, par, motif);
        int rows = workflowRepository.reouvrirDossier(demandeId, par, motif.strip(), AnnulationDossier.JOURS_REOUVERTURE);
        if (rows == 0) {
            throw new ApiException("La réouverture n'est possible que dans les "
                    + AnnulationDossier.JOURS_REOUVERTURE + " jours qui suivent l'annulation");
        }
        notifier.reouverture(d, par, motif.strip());
    }

    @Override
    public List<WorkflowDemandeDto> getAnnulationsADecider(User user) {
        AnnulationDossier.Acteur a = acteur(user);
        String role = a.roleNormalise();
        if (role == null) return List.of();
        return switch (role) {
            case AnnulationDossier.DA -> user.getAgenceId() == null ? List.of()
                    : workflowRepository.getAnnulationsADecider(AnnulationDossier.DA, user.getAgenceId(), null);
            case AnnulationDossier.DR -> user.getDelegationId() == null ? List.of()
                    : workflowRepository.getAnnulationsADecider(AnnulationDossier.DR, null, user.getDelegationId());
            case AnnulationDossier.DE -> workflowRepository.getAnnulationsADecider(AnnulationDossier.DE, null, null);
            case AnnulationDossier.DG -> workflowRepository.getAnnulationsADecider(AnnulationDossier.DG, null, null);
            case AnnulationDossier.DSIG -> {
                List<WorkflowDemandeDto> toutes = new ArrayList<>();
                for (String t : List.of(AnnulationDossier.DA, AnnulationDossier.DR, AnnulationDossier.DE, AnnulationDossier.DG)) {
                    toutes.addAll(workflowRepository.getAnnulationsADecider(t, null, null));
                }
                yield toutes;
            }
            default -> List.of();
        };
    }

    @Override
    public List<WorkflowDemandeDto> getAnnulationsAC(Long userId, String codUsuarios, String username) {
        return workflowRepository.getAnnulationsAC(userId, codUsuarios, username);
    }
}
