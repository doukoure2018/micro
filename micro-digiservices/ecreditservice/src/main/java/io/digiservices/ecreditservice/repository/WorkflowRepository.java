package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.WorkflowDemandeDto;
import io.digiservices.ecreditservice.dto.WorkflowRejetRequest;

import java.util.List;

public interface WorkflowRepository {

    // AC
    int approuverAC(Long demandeId, String avis, String codUsuarios);

    // DA lists
    List<WorkflowDemandeDto> getAValiderDA(Long agenceId);
    List<WorkflowDemandeDto> getEnCorrectionDRForDA(Long agenceId);

    // DA actions
    int validerDA(Long demandeId, String avis, String validatedBy);
    int rejeterDA(Long demandeId, WorkflowRejetRequest request, String validatedBy);

    // AC lists
    List<WorkflowDemandeDto> getEnCorrectionAC(Long agenceId, Long pointventeId);
    List<WorkflowDemandeDto> getEnCorrectionDRForAC(Long agenceId, Long pointventeId);
    List<WorkflowDemandeDto> getEnAttenteDA(Long agenceId, Long pointventeId);
    List<WorkflowDemandeDto> getSuiviValidationAC(Long agenceId, Long pointventeId);

    // DR lists
    List<WorkflowDemandeDto> getAValiderDR(Long delegationId);
    List<WorkflowDemandeDto> getEnCorrectionDEForDR(Long delegationId);

    // DR actions
    int validerDR(Long demandeId, String avis, String validatedBy);
    int rejeterDR(Long demandeId, WorkflowRejetRequest request, String validatedBy);

    // DE lists
    List<WorkflowDemandeDto> getAValiderDE();

    // DE actions
    int validerDE(Long demandeId, String avis, String validatedBy);
    int rejeterDE(Long demandeId, WorkflowRejetRequest request, String validatedBy);
}
