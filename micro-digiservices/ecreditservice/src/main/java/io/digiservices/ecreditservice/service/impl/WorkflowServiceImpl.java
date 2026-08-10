package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.AgentAgenceDto;
import io.digiservices.ecreditservice.dto.WorkflowDemandeDto;
import io.digiservices.ecreditservice.dto.WorkflowRejetRequest;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.WorkflowRepository;
import io.digiservices.ecreditservice.service.WorkflowService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkflowServiceImpl implements WorkflowService {

    private final WorkflowRepository workflowRepository;

    // ==================== AC ====================

    @Override
    @Transactional
    public void approuverAC(Long demandeId, String avis, String codUsuarios, Long userId) {
        log.info("Approbation AC par {} pour demande {}", codUsuarios, demandeId);
        int rows = workflowRepository.approuverAC(demandeId, avis, codUsuarios, userId);
        if (rows == 0) {
            throw new ApiException("Demande non trouvée, état invalide ou dossier affecté à un autre agent");
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
    public List<WorkflowDemandeDto> getRenvoyeesAC(String codUsuarios) {
        return workflowRepository.getRenvoyeesAC(codUsuarios);
    }

    @Override
    @Transactional
    public void resoumettreDA(Long demandeId, Long delegation, Long agence, Long pos) {
        if (delegation == null || agence == null) {
            throw new ApiException("La délégation et l'agence de destination sont obligatoires");
        }
        log.info("Resoumission au DA pour demande {} (delegation={}, agence={}, pos={})", demandeId, delegation, agence, pos);
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
        return workflowRepository.getAgentsAgence(agenceId).stream()
                .filter(a -> "AGENT_CREDIT".equals(a.getRole()))
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
        if (!"ACCUEIL".equals(fonction) && !"CREDIT".equals(fonction)) {
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
}
