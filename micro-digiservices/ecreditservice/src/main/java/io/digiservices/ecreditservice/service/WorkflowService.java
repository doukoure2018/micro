package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.AgentAgenceDto;
import io.digiservices.ecreditservice.dto.WorkflowDemandeDto;
import io.digiservices.ecreditservice.dto.WorkflowRejetRequest;

import java.util.List;

public interface WorkflowService {

    // AC
    void approuverAC(Long demandeId, String avis, String codUsuarios, Long userId);

    void resoumettreCorrection(Long demandeId);

    // DA
    List<WorkflowDemandeDto> getAValiderDA(Long agenceId);
    List<WorkflowDemandeDto> getEnCorrectionDRForDA(Long agenceId);
    void validerDA(Long demandeId, String avis, String validatedBy);
    void rejeterDA(Long demandeId, WorkflowRejetRequest request, String validatedBy);

    // Renvoi DA -> agent (erreur de destination)
    void renvoyerAgent(Long demandeId, String motif, String renvoyePar);
    List<WorkflowDemandeDto> getRenvoyeesAC(String codUsuarios);
    void resoumettreDA(Long demandeId, Long delegation, Long agence, Long pos);

    // AC lists (filtrees par proprietaire du dossier)
    List<WorkflowDemandeDto> getEnCorrectionAC(Long agenceId, Long pointventeId, Long userId);
    List<WorkflowDemandeDto> getEnCorrectionDRForAC(Long agenceId, Long pointventeId, Long userId);
    List<WorkflowDemandeDto> getEnCorrectionDEForAC(Long agenceId, Long pointventeId, Long userId);
    List<WorkflowDemandeDto> getEnAttenteDA(Long agenceId, Long pointventeId, Long userId);
    List<WorkflowDemandeDto> getSuiviValidationAC(Long agenceId, Long pointventeId, Long userId);
    List<WorkflowDemandeDto> getAApprouverAC(Long agenceId, Long pointventeId, Long userId);

    // DA - demandes affectees
    List<WorkflowDemandeDto> getDemandesAffecteesDA(Long agenceId);
    void annulerAffectation(Long demandeId);

    // DR
    List<WorkflowDemandeDto> getAValiderDR(Long delegationId);
    List<WorkflowDemandeDto> getEnCorrectionDEForDR(Long delegationId);
    void validerDR(Long demandeId, String avis, String validatedBy);
    void rejeterDR(Long demandeId, WorkflowRejetRequest request, String validatedBy);

    // DE
    List<WorkflowDemandeDto> getAValiderDE();
    List<WorkflowDemandeDto> getSuiviGlobalDE();

    // DA / DR - suivi des credits de leur reseau (agence / delegation)
    List<WorkflowDemandeDto> getSuiviGlobalReseau(Long delegationId, Long agenceId);
    List<WorkflowDemandeDto> getValidesDE();

    // DI - inspection (credits valides par le DR, tout le reseau)
    List<WorkflowDemandeDto> getInspectionCreditsDR();
    void validerDE(Long demandeId, String avis, String validatedBy);
    void rejeterDE(Long demandeId, WorkflowRejetRequest request, String validatedBy);

    // DG
    List<WorkflowDemandeDto> getAValiderDG();
    List<WorkflowDemandeDto> getRejetsDGAConfirmer();
    List<WorkflowDemandeDto> getValidesDG();
    void validerDG(Long demandeId, String avis, String validatedBy);
    void rejeterDG(Long demandeId, String motifRejet, String validatedBy);
    void confirmerRejetDG(Long demandeId, String instructions, java.util.List<String> sectionsARevoir, String confirmedBy);

    // Accueil (reception des demandes, affectation directe a un agent de credit)
    void marquerReception(Long demandeId, Long userId, String codUsuarios);
    List<AgentAgenceDto> getAgentsCreditEligibles(Long agenceId);
    List<WorkflowDemandeDto> getAAffecterDA(Long agenceId);
    void affecterAC(Long demandeId, Long agentUserId, String affectePar, Long agenceIdDA);
    void annulerAccueil(Long demandeId, String motif);
    List<WorkflowDemandeDto> getMesReceptions(Long userId);
    void rediligenterAccueil(Long demandeId, Long userId);
    List<WorkflowDemandeDto> getMesAffectationsAC(Long userId);
    void prendreEnChargeAC(Long demandeId, Long userId);

    // DA - gestion des fonctions d'agence
    List<AgentAgenceDto> getAgentsAgence(Long agenceId);
    void setAgentFonction(Long userId, String fonction, boolean actif, Long affectePar, Long agenceIdDA);
    List<String> getMesFonctions(Long userId);
}
