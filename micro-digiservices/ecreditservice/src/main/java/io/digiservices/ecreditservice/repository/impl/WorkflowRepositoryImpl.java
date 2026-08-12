package io.digiservices.ecreditservice.repository.impl;

import io.digiservices.ecreditservice.dto.AgentAgenceDto;
import io.digiservices.ecreditservice.dto.WorkflowDemandeDto;
import io.digiservices.ecreditservice.dto.WorkflowRejetRequest;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.WorkflowRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.util.List;

import static io.digiservices.ecreditservice.query.WorkflowQuery.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkflowRepositoryImpl implements WorkflowRepository {

    private final JdbcClient jdbcClient;

    // ==================== AC ====================

    @Override
    public int approuverAC(Long demandeId, String avis, String codUsuarios, Long userId) {
        try {
            return jdbcClient.sql(UPDATE_APPROUVER_AC)
                    .param("demandeId", demandeId)
                    .param("avis", avis)
                    .param("codUsuarios", codUsuarios)
                    .param("userId", userId)
                    .update();
        } catch (Exception e) {
            log.error("Erreur lors de l'approbation AC: {}", e.getMessage());
            throw new ApiException("Erreur lors de l'approbation: " + e.getMessage());
        }
    }

    // ==================== DA LISTS ====================

    @Override
    public List<WorkflowDemandeDto> getAValiderDA(Long agenceId) {
        try {
            return jdbcClient.sql(SELECT_A_VALIDER_DA)
                    .param("agenceId", agenceId)
                    .query(WorkflowDemandeDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des demandes à valider DA: {}", e.getMessage());
            throw new ApiException("Erreur lors de la récupération: " + e.getMessage());
        }
    }

    @Override
    public List<WorkflowDemandeDto> getEnCorrectionDRForDA(Long agenceId) {
        try {
            return jdbcClient.sql(SELECT_EN_CORRECTION_DR_FOR_DA)
                    .param("agenceId", agenceId)
                    .query(WorkflowDemandeDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des corrections DR: {}", e.getMessage());
            throw new ApiException("Erreur lors de la récupération: " + e.getMessage());
        }
    }

    // ==================== DA ACTIONS ====================

    @Override
    public int validerDA(Long demandeId, String avis, String validatedBy) {
        try {
            return jdbcClient.sql(UPDATE_VALIDER_DA)
                    .param("demandeId", demandeId)
                    .param("avis", avis)
                    .param("validatedBy", validatedBy)
                    .update();
        } catch (Exception e) {
            log.error("Erreur lors de la validation DA: {}", e.getMessage());
            throw new ApiException("Erreur lors de la validation: " + e.getMessage());
        }
    }

    @Override
    public int rejeterDA(Long demandeId, WorkflowRejetRequest request, String validatedBy) {
        try {
            String sectionsJson = request.getSectionsARevoir() != null
                    ? String.join(",", request.getSectionsARevoir())
                    : null;
            return jdbcClient.sql(UPDATE_REJETER_DA)
                    .param("demandeId", demandeId)
                    .param("motifRejet", request.getMotifRejet())
                    .param("sectionsARevoir", sectionsJson)
                    .param("instructions", request.getInstructions())
                    .param("validatedBy", validatedBy)
                    .update();
        } catch (Exception e) {
            log.error("Erreur lors du rejet DA: {}", e.getMessage());
            throw new ApiException("Erreur lors du rejet: " + e.getMessage());
        }
    }

    // ==================== RENVOI DA -> AGENT ====================

    @Override
    public int renvoyerAgent(Long demandeId, String motif, String renvoyePar) {
        try {
            return jdbcClient.sql(UPDATE_RENVOYER_AGENT)
                    .param("demandeId", demandeId)
                    .param("motif", motif)
                    .param("renvoyePar", renvoyePar)
                    .update();
        } catch (Exception e) {
            log.error("Erreur lors du renvoi à l'agent: {}", e.getMessage());
            throw new ApiException("Erreur lors du renvoi: " + e.getMessage());
        }
    }

    @Override
    public List<WorkflowDemandeDto> getRenvoyeesAC(String codUsuarios) {
        try {
            return jdbcClient.sql(SELECT_RENVOYEES_AC)
                    .param("codUsuarios", codUsuarios)
                    .query(WorkflowDemandeDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des renvois AC: {}", e.getMessage());
            throw new ApiException("Erreur lors de la récupération: " + e.getMessage());
        }
    }

    @Override
    public int resoumettreDA(Long demandeId, Long delegation, Long agence, Long pos) {
        try {
            return jdbcClient.sql(UPDATE_RESOUMETTRE_DA)
                    .param("demandeId", demandeId)
                    .param("delegation", delegation)
                    .param("agence", agence)
                    .param("pos", pos)
                    .update();
        } catch (Exception e) {
            log.error("Erreur lors de la resoumission DA: {}", e.getMessage());
            throw new ApiException("Erreur lors de la resoumission: " + e.getMessage());
        }
    }

    // ==================== AC LISTS ====================

    @Override
    public List<WorkflowDemandeDto> getEnCorrectionAC(Long agenceId, Long pointventeId, Long userId) {
        try {
            return jdbcClient.sql(SELECT_EN_CORRECTION_AC)
                    .param("agenceId", agenceId)
                    .param("pointventeId", pointventeId)
                    .param("userId", userId)
                    .query(WorkflowDemandeDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des corrections AC: {}", e.getMessage());
            throw new ApiException("Erreur lors de la récupération: " + e.getMessage());
        }
    }

    @Override
    public List<WorkflowDemandeDto> getEnCorrectionDRForAC(Long agenceId, Long pointventeId, Long userId) {
        try {
            return jdbcClient.sql(SELECT_EN_CORRECTION_DR_FOR_AC)
                    .param("agenceId", agenceId)
                    .param("pointventeId", pointventeId)
                    .param("userId", userId)
                    .query(WorkflowDemandeDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des corrections DR pour AC: {}", e.getMessage());
            throw new ApiException("Erreur lors de la récupération: " + e.getMessage());
        }
    }

    @Override
    public List<WorkflowDemandeDto> getEnCorrectionDEForAC(Long agenceId, Long pointventeId, Long userId) {
        try {
            return jdbcClient.sql(SELECT_EN_CORRECTION_DE_FOR_AC)
                    .param("agenceId", agenceId)
                    .param("pointventeId", pointventeId)
                    .param("userId", userId)
                    .query(WorkflowDemandeDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des corrections DE pour AC: {}", e.getMessage());
            throw new ApiException("Erreur lors de la récupération: " + e.getMessage());
        }
    }

    @Override
    public List<WorkflowDemandeDto> getEnAttenteDA(Long agenceId, Long pointventeId, Long userId) {
        try {
            return jdbcClient.sql(SELECT_EN_ATTENTE_DA)
                    .param("agenceId", agenceId)
                    .param("pointventeId", pointventeId)
                    .param("userId", userId)
                    .query(WorkflowDemandeDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des demandes en attente DA: {}", e.getMessage());
            throw new ApiException("Erreur lors de la récupération: " + e.getMessage());
        }
    }

    @Override
    public List<WorkflowDemandeDto> getSuiviValidationAC(Long agenceId, Long pointventeId, Long userId) {
        try {
            return jdbcClient.sql(SELECT_SUIVI_VALIDATION_AC)
                    .param("agenceId", agenceId)
                    .param("pointventeId", pointventeId)
                    .param("userId", userId)
                    .query(WorkflowDemandeDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération du suivi validation AC: {}", e.getMessage());
            throw new ApiException("Erreur lors de la récupération: " + e.getMessage());
        }
    }

    @Override
    public List<WorkflowDemandeDto> getAApprouverAC(Long agenceId, Long pointventeId, Long userId) {
        try {
            return jdbcClient.sql(SELECT_A_APPROUVER_AC)
                    .param("agenceId", agenceId)
                    .param("pointventeId", pointventeId)
                    .param("userId", userId)
                    .query(WorkflowDemandeDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des demandes à approuver AC: {}", e.getMessage());
            throw new ApiException("Erreur lors de la récupération: " + e.getMessage());
        }
    }

    // ==================== DA - DEMANDES AFFECTEES ====================

    @Override
    public List<WorkflowDemandeDto> getDemandesAffecteesDA(Long agenceId) {
        try {
            return jdbcClient.sql(SELECT_DEMANDES_AFFECTEES_DA)
                    .param("agenceId", agenceId)
                    .query(WorkflowDemandeDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des demandes affectées DA: {}", e.getMessage());
            throw new ApiException("Erreur lors de la récupération: " + e.getMessage());
        }
    }

    @Override
    public int annulerAffectation(Long demandeId) {
        try {
            return jdbcClient.sql(UPDATE_ANNULER_AFFECTATION)
                    .param("demandeId", demandeId)
                    .update();
        } catch (Exception e) {
            log.error("Erreur lors de l'annulation de l'affectation: {}", e.getMessage());
            throw new ApiException("Erreur lors de l'annulation: " + e.getMessage());
        }
    }

    // ==================== DR LISTS ====================

    @Override
    public List<WorkflowDemandeDto> getAValiderDR(Long delegationId) {
        try {
            return jdbcClient.sql(SELECT_A_VALIDER_DR)
                    .param("delegationId", delegationId)
                    .query(WorkflowDemandeDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des demandes à valider DR: {}", e.getMessage());
            throw new ApiException("Erreur lors de la récupération: " + e.getMessage());
        }
    }

    @Override
    public List<WorkflowDemandeDto> getEnCorrectionDEForDR(Long delegationId) {
        try {
            return jdbcClient.sql(SELECT_EN_CORRECTION_DE_FOR_DR)
                    .param("delegationId", delegationId)
                    .query(WorkflowDemandeDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des corrections DE: {}", e.getMessage());
            throw new ApiException("Erreur lors de la récupération: " + e.getMessage());
        }
    }

    // ==================== DR ACTIONS ====================

    @Override
    public int validerDR(Long demandeId, String avis, String validatedBy) {
        try {
            return jdbcClient.sql(UPDATE_VALIDER_DR)
                    .param("demandeId", demandeId)
                    .param("avis", avis)
                    .param("validatedBy", validatedBy)
                    .update();
        } catch (Exception e) {
            log.error("Erreur lors de la validation DR: {}", e.getMessage());
            throw new ApiException("Erreur lors de la validation: " + e.getMessage());
        }
    }

    @Override
    public int rejeterDR(Long demandeId, WorkflowRejetRequest request, String validatedBy) {
        try {
            String sectionsJson = request.getSectionsARevoir() != null
                    ? String.join(",", request.getSectionsARevoir())
                    : null;
            return jdbcClient.sql(UPDATE_REJETER_DR)
                    .param("demandeId", demandeId)
                    .param("motifRejet", request.getMotifRejet())
                    .param("sectionsARevoir", sectionsJson)
                    .param("instructions", request.getInstructions())
                    .param("validatedBy", validatedBy)
                    .update();
        } catch (Exception e) {
            log.error("Erreur lors du rejet DR: {}", e.getMessage());
            throw new ApiException("Erreur lors du rejet: " + e.getMessage());
        }
    }

    // ==================== DE LISTS ====================

    @Override
    public List<WorkflowDemandeDto> getAValiderDE() {
        try {
            return jdbcClient.sql(SELECT_A_VALIDER_DE)
                    .query(WorkflowDemandeDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des demandes à valider DE: {}", e.getMessage());
            throw new ApiException("Erreur lors de la récupération: " + e.getMessage());
        }
    }

    @Override
    public List<WorkflowDemandeDto> getSuiviGlobalDE() {
        try {
            return jdbcClient.sql(SELECT_SUIVI_GLOBAL_DE)
                    .query(WorkflowDemandeDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération du suivi global DE: {}", e.getMessage());
            throw new ApiException("Erreur lors de la récupération: " + e.getMessage());
        }
    }

    @Override
    public List<WorkflowDemandeDto> getSuiviGlobalReseau(Long delegationId, Long agenceId) {
        try {
            return jdbcClient.sql(SELECT_SUIVI_GLOBAL_RESEAU)
                    .param("delegationId", delegationId)
                    .param("agenceId", agenceId)
                    .query(WorkflowDemandeDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération du suivi réseau (delegation={}, agence={}): {}",
                    delegationId, agenceId, e.getMessage());
            throw new ApiException("Erreur lors de la récupération: " + e.getMessage());
        }
    }

    @Override
    public List<WorkflowDemandeDto> getValidesDE() {
        try {
            return jdbcClient.sql(SELECT_VALIDES_DE)
                    .query(WorkflowDemandeDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des demandes validées par DE: {}", e.getMessage());
            throw new ApiException("Erreur lors de la récupération: " + e.getMessage());
        }
    }

    @Override
    public List<WorkflowDemandeDto> getInspectionCreditsDR() {
        try {
            return jdbcClient.sql(SELECT_INSPECTION_CREDITS_DR)
                    .query(WorkflowDemandeDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération de l'inspection des crédits validés DR: {}", e.getMessage());
            throw new ApiException("Erreur lors de la récupération: " + e.getMessage());
        }
    }

    // ==================== DE ACTIONS ====================

    @Override
    public int validerDE(Long demandeId, String avis, String validatedBy) {
        try {
            return jdbcClient.sql(UPDATE_VALIDER_DE)
                    .param("demandeId", demandeId)
                    .param("avis", avis)
                    .param("validatedBy", validatedBy)
                    .update();
        } catch (Exception e) {
            log.error("Erreur lors de la validation DE: {}", e.getMessage());
            throw new ApiException("Erreur lors de la validation: " + e.getMessage());
        }
    }

    @Override
    public int rejeterDE(Long demandeId, WorkflowRejetRequest request, String validatedBy) {
        try {
            String sectionsJson = request.getSectionsARevoir() != null
                    ? String.join(",", request.getSectionsARevoir())
                    : null;
            return jdbcClient.sql(UPDATE_REJETER_DE)
                    .param("demandeId", demandeId)
                    .param("motifRejet", request.getMotifRejet())
                    .param("sectionsARevoir", sectionsJson)
                    .param("instructions", request.getInstructions())
                    .param("validatedBy", validatedBy)
                    .update();
        } catch (Exception e) {
            log.error("Erreur lors du rejet DE: {}", e.getMessage());
            throw new ApiException("Erreur lors du rejet: " + e.getMessage());
        }
    }

    // ==================== DG ====================

    @Override
    public List<WorkflowDemandeDto> getAValiderDG() {
        try {
            return jdbcClient.sql(SELECT_A_VALIDER_DG).query(WorkflowDemandeDto.class).list();
        } catch (Exception e) {
            log.error("Erreur récupération demandes à valider DG: {}", e.getMessage());
            throw new ApiException("Erreur lors de la récupération: " + e.getMessage());
        }
    }

    @Override
    public List<WorkflowDemandeDto> getRejetsDGAConfirmer() {
        try {
            return jdbcClient.sql(SELECT_REJETS_DG_A_CONFIRMER).query(WorkflowDemandeDto.class).list();
        } catch (Exception e) {
            log.error("Erreur récupération rejets DG à confirmer: {}", e.getMessage());
            throw new ApiException("Erreur lors de la récupération: " + e.getMessage());
        }
    }

    @Override
    public List<WorkflowDemandeDto> getValidesDG() {
        try {
            return jdbcClient.sql(SELECT_VALIDES_DG).query(WorkflowDemandeDto.class).list();
        } catch (Exception e) {
            log.error("Erreur récupération crédits validés DG: {}", e.getMessage());
            throw new ApiException("Erreur lors de la récupération: " + e.getMessage());
        }
    }

    @Override
    public int validerDG(Long demandeId, String avis, String validatedBy) {
        try {
            return jdbcClient.sql(UPDATE_VALIDER_DG)
                    .param("demandeId", demandeId)
                    .param("avis", avis)
                    .param("validatedBy", validatedBy)
                    .update();
        } catch (Exception e) {
            log.error("Erreur validation DG: {}", e.getMessage());
            throw new ApiException("Erreur lors de la validation: " + e.getMessage());
        }
    }

    @Override
    public int rejeterDG(Long demandeId, String motifRejet, String validatedBy) {
        try {
            return jdbcClient.sql(UPDATE_REJETER_DG)
                    .param("demandeId", demandeId)
                    .param("motifRejet", motifRejet)
                    .param("validatedBy", validatedBy)
                    .update();
        } catch (Exception e) {
            log.error("Erreur rejet DG: {}", e.getMessage());
            throw new ApiException("Erreur lors du rejet: " + e.getMessage());
        }
    }

    @Override
    public int confirmerRejetDG(Long demandeId, String instructions, String sectionsARevoir, String confirmedBy) {
        try {
            return jdbcClient.sql(UPDATE_CONFIRMER_REJET_DG)
                    .param("demandeId", demandeId)
                    .param("instructions", instructions)
                    .param("sectionsARevoir", sectionsARevoir)
                    .param("confirmedBy", confirmedBy)
                    .update();
        } catch (Exception e) {
            log.error("Erreur confirmation rejet DG: {}", e.getMessage());
            throw new ApiException("Erreur lors de la confirmation: " + e.getMessage());
        }
    }

    // ==================== ACCUEIL (reception des demandes) ====================

    @Override
    public int marquerReception(Long demandeId, Long userId, String codUsuarios) {
        try {
            return jdbcClient.sql(UPDATE_MARQUER_RECEPTION)
                    .param("demandeId", demandeId)
                    .param("userId", userId)
                    .param("codUsuarios", codUsuarios)
                    .update();
        } catch (Exception e) {
            log.error("Erreur lors du marquage reception: {}", e.getMessage());
            throw new ApiException("Erreur lors du marquage de la reception: " + e.getMessage());
        }
    }

    @Override
    public List<WorkflowDemandeDto> getAAffecterDA(Long agenceId) {
        try {
            return jdbcClient.sql(SELECT_A_AFFECTER_DA)
                    .param("agenceId", agenceId)
                    .query(WorkflowDemandeDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la recuperation des demandes a affecter DA: {}", e.getMessage());
            throw new ApiException("Erreur lors de la recuperation: " + e.getMessage());
        }
    }

    @Override
    public int affecterAC(Long demandeId, Long agentUserId, String affectePar) {
        try {
            return jdbcClient.sql(UPDATE_AFFECTER_AC)
                    .param("demandeId", demandeId)
                    .param("agentUserId", agentUserId)
                    .param("affectePar", affectePar)
                    .update();
        } catch (Exception e) {
            log.error("Erreur lors de l'affectation AC: {}", e.getMessage());
            throw new ApiException("Erreur lors de l'affectation: " + e.getMessage());
        }
    }

    @Override
    public int annulerAccueil(Long demandeId, String motif) {
        try {
            return jdbcClient.sql(UPDATE_ANNULER_ACCUEIL)
                    .param("demandeId", demandeId)
                    .param("motif", motif)
                    .update();
        } catch (Exception e) {
            log.error("Erreur lors de l'annulation accueil: {}", e.getMessage());
            throw new ApiException("Erreur lors de l'annulation: " + e.getMessage());
        }
    }

    @Override
    public List<WorkflowDemandeDto> getMesReceptions(Long userId) {
        try {
            return jdbcClient.sql(SELECT_MES_RECEPTIONS)
                    .param("userId", userId)
                    .query(WorkflowDemandeDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la recuperation des receptions: {}", e.getMessage());
            throw new ApiException("Erreur lors de la recuperation: " + e.getMessage());
        }
    }

    @Override
    public int rediligenterAccueil(Long demandeId, Long userId) {
        try {
            return jdbcClient.sql(UPDATE_REDILIGENTER_ACCUEIL)
                    .param("demandeId", demandeId)
                    .param("userId", userId)
                    .update();
        } catch (Exception e) {
            log.error("Erreur lors de la rediligence accueil: {}", e.getMessage());
            throw new ApiException("Erreur lors de la rediligence: " + e.getMessage());
        }
    }

    @Override
    public List<WorkflowDemandeDto> getMesAffectationsAC(Long userId) {
        try {
            return jdbcClient.sql(SELECT_MES_AFFECTATIONS_AC)
                    .param("userId", userId)
                    .query(WorkflowDemandeDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la recuperation des affectations AC: {}", e.getMessage());
            throw new ApiException("Erreur lors de la recuperation: " + e.getMessage());
        }
    }

    @Override
    public int prendreEnChargeAC(Long demandeId, Long userId) {
        try {
            return jdbcClient.sql(UPDATE_PRENDRE_EN_CHARGE_AC)
                    .param("demandeId", demandeId)
                    .param("userId", userId)
                    .update();
        } catch (Exception e) {
            log.error("Erreur lors de la prise en charge AC: {}", e.getMessage());
            throw new ApiException("Erreur lors de la prise en charge: " + e.getMessage());
        }
    }

    // ==================== DA - GESTION DES FONCTIONS D'AGENCE ====================

    @Override
    public List<AgentAgenceDto> getAgentsAgence(Long agenceId) {
        try {
            return jdbcClient.sql(SELECT_AGENTS_AGENCE)
                    .param("agenceId", agenceId)
                    .query(AgentAgenceDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la recuperation des agents de l'agence: {}", e.getMessage());
            throw new ApiException("Erreur lors de la recuperation: " + e.getMessage());
        }
    }

    @Override
    public int upsertAgentFonction(Long userId, String fonction, boolean actif, Long affectePar) {
        try {
            return jdbcClient.sql(UPSERT_AGENT_FONCTION)
                    .param("userId", userId)
                    .param("fonction", fonction)
                    .param("actif", actif)
                    .param("affectePar", affectePar)
                    .update();
        } catch (Exception e) {
            log.error("Erreur lors de la mise a jour de la fonction agent: {}", e.getMessage());
            throw new ApiException("Erreur lors de la mise a jour de la fonction: " + e.getMessage());
        }
    }

    @Override
    public Long getAgenceOfUser(Long userId) {
        try {
            return jdbcClient.sql(SELECT_AGENCE_OF_USER)
                    .param("userId", userId)
                    .query(Long.class)
                    .optional()
                    .orElse(null);
        } catch (Exception e) {
            log.error("Erreur lors de la recuperation de l'agence de l'utilisateur: {}", e.getMessage());
            throw new ApiException("Erreur lors de la recuperation: " + e.getMessage());
        }
    }

    @Override
    public List<String> getMesFonctions(Long userId) {
        try {
            return jdbcClient.sql(SELECT_MES_FONCTIONS)
                    .param("userId", userId)
                    .query(String.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la recuperation des fonctions: {}", e.getMessage());
            throw new ApiException("Erreur lors de la recuperation: " + e.getMessage());
        }
    }

    @Override
    public List<String> getRolesOfUser(Long userId) {
        try {
            return jdbcClient.sql(SELECT_ROLES_OF_USER)
                    .param("userId", userId)
                    .query(String.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la recuperation des roles: {}", e.getMessage());
            throw new ApiException("Erreur lors de la recuperation: " + e.getMessage());
        }
    }
}
