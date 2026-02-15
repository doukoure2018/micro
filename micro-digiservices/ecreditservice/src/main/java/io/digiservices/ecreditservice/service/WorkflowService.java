package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.WorkflowDemandeDto;
import io.digiservices.ecreditservice.dto.WorkflowRejetRequest;

import java.util.List;

public interface WorkflowService {

    // AC
    void approuverAC(Long demandeId, String avis, String codUsuarios);

    // DA
    List<WorkflowDemandeDto> getAValiderDA(Long agenceId);
    List<WorkflowDemandeDto> getEnCorrectionDRForDA(Long agenceId);
    void validerDA(Long demandeId, String avis, String validatedBy);
    void rejeterDA(Long demandeId, WorkflowRejetRequest request, String validatedBy);

    // AC lists
    List<WorkflowDemandeDto> getEnCorrectionAC(Long agenceId, Long pointventeId);
    List<WorkflowDemandeDto> getEnCorrectionDRForAC(Long agenceId, Long pointventeId);
    List<WorkflowDemandeDto> getEnAttenteDA(Long agenceId, Long pointventeId);
    List<WorkflowDemandeDto> getSuiviValidationAC(Long agenceId, Long pointventeId);

    // DR
    List<WorkflowDemandeDto> getAValiderDR(Long delegationId);
    List<WorkflowDemandeDto> getEnCorrectionDEForDR(Long delegationId);
    void validerDR(Long demandeId, String avis, String validatedBy);
    void rejeterDR(Long demandeId, WorkflowRejetRequest request, String validatedBy);

    // DE
    List<WorkflowDemandeDto> getAValiderDE();
    void validerDE(Long demandeId, String avis, String validatedBy);
    void rejeterDE(Long demandeId, WorkflowRejetRequest request, String validatedBy);
}
