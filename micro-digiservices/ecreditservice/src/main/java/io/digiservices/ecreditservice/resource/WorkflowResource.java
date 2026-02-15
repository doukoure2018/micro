package io.digiservices.ecreditservice.resource;

import io.digiservices.clients.UserClient;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.WorkflowApprovalRequest;
import io.digiservices.ecreditservice.dto.WorkflowRejetRequest;
import io.digiservices.ecreditservice.service.WorkflowService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

@RestController
@AllArgsConstructor
@RequestMapping("/ecredit/workflow")
@Slf4j
public class WorkflowResource {

    private final WorkflowService workflowService;
    private final UserClient userClient;

    // ==================== AC ====================

    @PutMapping("/{demandeId}/approuver-ac")
    public ResponseEntity<Response> approuverAC(
            @PathVariable Long demandeId,
            @RequestBody WorkflowApprovalRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        String codUsuarios = user.getFirstName() + " " + user.getLastName();
        workflowService.approuverAC(demandeId, request.getAvis(), codUsuarios);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("message", "Demande approuvée par AC"),
                        "Demande approuvée avec succès", OK));
    }

    // ==================== DA LISTS ====================

    @GetMapping("/a-valider-da")
    public ResponseEntity<Response> getAValiderDA(
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        var result = workflowService.getAValiderDA(user.getAgenceId());
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("workflowDemandes", result),
                        "Demandes à valider DA récupérées", OK));
    }

    @GetMapping("/en-correction-dr")
    public ResponseEntity<Response> getEnCorrectionDRForDA(
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        var result = workflowService.getEnCorrectionDRForDA(user.getAgenceId());
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("workflowDemandes", result),
                        "Demandes en correction DR récupérées", OK));
    }

    // ==================== DA ACTIONS ====================

    @PutMapping("/{demandeId}/valider-da")
    public ResponseEntity<Response> validerDA(
            @PathVariable Long demandeId,
            @RequestBody WorkflowApprovalRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        String validatedBy = user.getFirstName() + " " + user.getLastName();
        workflowService.validerDA(demandeId, request.getAvis(), validatedBy);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("message", "Demande validée par DA"),
                        "Demande validée DA avec succès", OK));
    }

    @PutMapping("/{demandeId}/rejeter-da")
    public ResponseEntity<Response> rejeterDA(
            @PathVariable Long demandeId,
            @RequestBody WorkflowRejetRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        String validatedBy = user.getFirstName() + " " + user.getLastName();
        workflowService.rejeterDA(demandeId, request, validatedBy);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("message", "Demande rejetée par DA"),
                        "Demande rejetée DA", OK));
    }

    // ==================== AC LISTS ====================

    @GetMapping("/en-correction")
    public ResponseEntity<Response> getEnCorrectionAC(
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        var result = workflowService.getEnCorrectionAC(user.getAgenceId(), user.getPointventeId());
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("workflowDemandes", result),
                        "Demandes en correction AC récupérées", OK));
    }

    @GetMapping("/en-attente-da")
    public ResponseEntity<Response> getEnAttenteDA(
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        var result = workflowService.getEnAttenteDA(user.getAgenceId(), user.getPointventeId());
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("workflowDemandes", result),
                        "Demandes en attente DA récupérées", OK));
    }

    @GetMapping("/en-correction-dr-ac")
    public ResponseEntity<Response> getEnCorrectionDRForAC(
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        var result = workflowService.getEnCorrectionDRForAC(user.getAgenceId(), user.getPointventeId());
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("workflowDemandes", result),
                        "Demandes en correction DR pour AC récupérées", OK));
    }

    @GetMapping("/suivi-validation")
    public ResponseEntity<Response> getSuiviValidationAC(
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        var result = workflowService.getSuiviValidationAC(user.getAgenceId(), user.getPointventeId());
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("workflowDemandes", result),
                        "Suivi validation récupéré", OK));
    }

    // ==================== DR LISTS ====================

    @GetMapping("/a-valider-dr")
    public ResponseEntity<Response> getAValiderDR(
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        var result = workflowService.getAValiderDR(user.getDelegationId());
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("workflowDemandes", result),
                        "Demandes à valider DR récupérées", OK));
    }

    @GetMapping("/en-correction-de")
    public ResponseEntity<Response> getEnCorrectionDEForDR(
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        var result = workflowService.getEnCorrectionDEForDR(user.getDelegationId());
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("workflowDemandes", result),
                        "Demandes en correction DE récupérées", OK));
    }

    // ==================== DR ACTIONS ====================

    @PutMapping("/{demandeId}/valider-dr")
    public ResponseEntity<Response> validerDR(
            @PathVariable Long demandeId,
            @RequestBody WorkflowApprovalRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        String validatedBy = user.getFirstName() + " " + user.getLastName();
        workflowService.validerDR(demandeId, request.getAvis(), validatedBy);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("message", "Demande validée par DR"),
                        "Demande validée DR avec succès", OK));
    }

    @PutMapping("/{demandeId}/rejeter-dr")
    public ResponseEntity<Response> rejeterDR(
            @PathVariable Long demandeId,
            @RequestBody WorkflowRejetRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        String validatedBy = user.getFirstName() + " " + user.getLastName();
        workflowService.rejeterDR(demandeId, request, validatedBy);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("message", "Demande rejetée par DR"),
                        "Demande rejetée DR", OK));
    }

    // ==================== DE LISTS ====================

    @GetMapping("/a-valider-de")
    public ResponseEntity<Response> getAValiderDE(
            HttpServletRequest httpRequest) {
        var result = workflowService.getAValiderDE();
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("workflowDemandes", result),
                        "Demandes à valider DE récupérées", OK));
    }

    // ==================== DE ACTIONS ====================

    @PutMapping("/{demandeId}/valider-de")
    public ResponseEntity<Response> validerDE(
            @PathVariable Long demandeId,
            @RequestBody WorkflowApprovalRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        String validatedBy = user.getFirstName() + " " + user.getLastName();
        workflowService.validerDE(demandeId, request.getAvis(), validatedBy);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("message", "Demande validée par DE"),
                        "Validation finale avec succès", OK));
    }

    @PutMapping("/{demandeId}/rejeter-de")
    public ResponseEntity<Response> rejeterDE(
            @PathVariable Long demandeId,
            @RequestBody WorkflowRejetRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        String validatedBy = user.getFirstName() + " " + user.getLastName();
        workflowService.rejeterDE(demandeId, request, validatedBy);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("message", "Demande rejetée par DE"),
                        "Demande rejetée DE", OK));
    }
}
