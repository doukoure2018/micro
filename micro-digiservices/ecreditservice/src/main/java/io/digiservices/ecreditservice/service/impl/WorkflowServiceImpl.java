package io.digiservices.ecreditservice.service.impl;

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
    public void approuverAC(Long demandeId, String avis, String codUsuarios) {
        log.info("Approbation AC par {} pour demande {}", codUsuarios, demandeId);
        int rows = workflowRepository.approuverAC(demandeId, avis, codUsuarios);
        if (rows == 0) {
            throw new ApiException("Demande non trouvée ou état invalide pour l'approbation AC");
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

    // ==================== AC LISTS ====================

    @Override
    public List<WorkflowDemandeDto> getEnCorrectionAC(Long agenceId, Long pointventeId) {
        return workflowRepository.getEnCorrectionAC(agenceId, pointventeId);
    }

    @Override
    public List<WorkflowDemandeDto> getEnCorrectionDRForAC(Long agenceId, Long pointventeId) {
        return workflowRepository.getEnCorrectionDRForAC(agenceId, pointventeId);
    }

    @Override
    public List<WorkflowDemandeDto> getEnAttenteDA(Long agenceId, Long pointventeId) {
        return workflowRepository.getEnAttenteDA(agenceId, pointventeId);
    }

    @Override
    public List<WorkflowDemandeDto> getSuiviValidationAC(Long agenceId, Long pointventeId) {
        return workflowRepository.getSuiviValidationAC(agenceId, pointventeId);
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

    private void validateRejetRequest(WorkflowRejetRequest request) {
        if (request.getMotifRejet() == null || request.getMotifRejet().isBlank()) {
            throw new ApiException("Le motif de rejet est obligatoire");
        }
        if (request.getSectionsARevoir() == null || request.getSectionsARevoir().isEmpty()) {
            throw new ApiException("Au moins une section à revoir doit être sélectionnée");
        }
    }
}
