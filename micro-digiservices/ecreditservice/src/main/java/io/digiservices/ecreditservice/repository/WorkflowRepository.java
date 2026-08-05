package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.AgentAgenceDto;
import io.digiservices.ecreditservice.dto.WorkflowDemandeDto;
import io.digiservices.ecreditservice.dto.WorkflowRejetRequest;

import java.util.List;

public interface WorkflowRepository {

    // AC
    int approuverAC(Long demandeId, String avis, String codUsuarios, Long userId);

    // DA lists
    List<WorkflowDemandeDto> getAValiderDA(Long agenceId);
    List<WorkflowDemandeDto> getEnCorrectionDRForDA(Long agenceId);

    // DA actions
    int validerDA(Long demandeId, String avis, String validatedBy);
    int rejeterDA(Long demandeId, WorkflowRejetRequest request, String validatedBy);

    // Renvoi DA -> agent (erreur de destination)
    int renvoyerAgent(Long demandeId, String motif, String renvoyePar);
    List<WorkflowDemandeDto> getRenvoyeesAC(String codUsuarios);
    int resoumettreDA(Long demandeId, Long delegation, Long agence, Long pos);

    // AC lists (filtrees par proprietaire : agent_credit_affecte = userId, ou legacy sans proprietaire)
    List<WorkflowDemandeDto> getEnCorrectionAC(Long agenceId, Long pointventeId, Long userId);
    List<WorkflowDemandeDto> getEnCorrectionDRForAC(Long agenceId, Long pointventeId, Long userId);
    List<WorkflowDemandeDto> getEnCorrectionDEForAC(Long agenceId, Long pointventeId, Long userId);
    List<WorkflowDemandeDto> getEnAttenteDA(Long agenceId, Long pointventeId, Long userId);
    List<WorkflowDemandeDto> getSuiviValidationAC(Long agenceId, Long pointventeId, Long userId);
    List<WorkflowDemandeDto> getAApprouverAC(Long agenceId, Long pointventeId, Long userId);

    // DR lists
    List<WorkflowDemandeDto> getAValiderDR(Long delegationId);
    List<WorkflowDemandeDto> getEnCorrectionDEForDR(Long delegationId);

    // DR actions
    int validerDR(Long demandeId, String avis, String validatedBy);
    int rejeterDR(Long demandeId, WorkflowRejetRequest request, String validatedBy);

    // DA - demandes affectees
    List<WorkflowDemandeDto> getDemandesAffecteesDA(Long agenceId);
    int annulerAffectation(Long demandeId);

    // DE lists
    List<WorkflowDemandeDto> getAValiderDE();
    List<WorkflowDemandeDto> getSuiviGlobalDE();
    List<WorkflowDemandeDto> getSuiviGlobalReseau(Long delegationId, Long agenceId);
    List<WorkflowDemandeDto> getValidesDE();

    // DI - inspection (credits valides par le DR, tout le reseau)
    List<WorkflowDemandeDto> getInspectionCreditsDR();

    // DE actions
    int validerDE(Long demandeId, String avis, String validatedBy);
    int rejeterDE(Long demandeId, WorkflowRejetRequest request, String validatedBy);

    // DG
    List<WorkflowDemandeDto> getAValiderDG();
    List<WorkflowDemandeDto> getRejetsDGAConfirmer();
    List<WorkflowDemandeDto> getValidesDG();
    int validerDG(Long demandeId, String avis, String validatedBy);
    int rejeterDG(Long demandeId, String motifRejet, String validatedBy);
    int confirmerRejetDG(Long demandeId, String instructions, String sectionsARevoir, String confirmedBy);

    // Accueil (reception des demandes, affectation directe a un agent de credit)
    int marquerReception(Long demandeId, Long userId, String codUsuarios, Long agentUserId, String affectePar);
    List<WorkflowDemandeDto> getAAffecterDA(Long agenceId);
    int affecterAC(Long demandeId, Long agentUserId, String affectePar);
    int annulerAccueil(Long demandeId, String motif);
    List<WorkflowDemandeDto> getMesReceptions(Long userId);
    int rediligenterAccueil(Long demandeId, Long userId);
    List<WorkflowDemandeDto> getMesAffectationsAC(Long userId);
    int prendreEnChargeAC(Long demandeId, Long userId);

    // DA - gestion des fonctions d'agence
    List<AgentAgenceDto> getAgentsAgence(Long agenceId);
    int upsertAgentFonction(Long userId, String fonction, boolean actif, Long affectePar);
    Long getAgenceOfUser(Long userId);
    List<String> getMesFonctions(Long userId);
    List<String> getRolesOfUser(Long userId);
}
