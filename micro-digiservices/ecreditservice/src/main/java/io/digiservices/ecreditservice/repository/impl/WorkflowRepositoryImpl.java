package io.digiservices.ecreditservice.repository.impl;

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
    public int approuverAC(Long demandeId, String avis, String codUsuarios) {
        try {
            return jdbcClient.sql(UPDATE_APPROUVER_AC)
                    .param("demandeId", demandeId)
                    .param("avis", avis)
                    .param("codUsuarios", codUsuarios)
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

    // ==================== AC LISTS ====================

    @Override
    public List<WorkflowDemandeDto> getEnCorrectionAC(Long agenceId, Long pointventeId) {
        try {
            return jdbcClient.sql(SELECT_EN_CORRECTION_AC)
                    .param("agenceId", agenceId)
                    .param("pointventeId", pointventeId)
                    .query(WorkflowDemandeDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des corrections AC: {}", e.getMessage());
            throw new ApiException("Erreur lors de la récupération: " + e.getMessage());
        }
    }

    @Override
    public List<WorkflowDemandeDto> getEnCorrectionDRForAC(Long agenceId, Long pointventeId) {
        try {
            return jdbcClient.sql(SELECT_EN_CORRECTION_DR_FOR_AC)
                    .param("agenceId", agenceId)
                    .param("pointventeId", pointventeId)
                    .query(WorkflowDemandeDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des corrections DR pour AC: {}", e.getMessage());
            throw new ApiException("Erreur lors de la récupération: " + e.getMessage());
        }
    }

    @Override
    public List<WorkflowDemandeDto> getEnAttenteDA(Long agenceId, Long pointventeId) {
        try {
            return jdbcClient.sql(SELECT_EN_ATTENTE_DA)
                    .param("agenceId", agenceId)
                    .param("pointventeId", pointventeId)
                    .query(WorkflowDemandeDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des demandes en attente DA: {}", e.getMessage());
            throw new ApiException("Erreur lors de la récupération: " + e.getMessage());
        }
    }

    @Override
    public List<WorkflowDemandeDto> getSuiviValidationAC(Long agenceId, Long pointventeId) {
        try {
            return jdbcClient.sql(SELECT_SUIVI_VALIDATION_AC)
                    .param("agenceId", agenceId)
                    .param("pointventeId", pointventeId)
                    .query(WorkflowDemandeDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération du suivi validation AC: {}", e.getMessage());
            throw new ApiException("Erreur lors de la récupération: " + e.getMessage());
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
}
