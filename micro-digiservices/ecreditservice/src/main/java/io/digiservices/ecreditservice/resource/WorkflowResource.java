package io.digiservices.ecreditservice.resource;

import io.digiservices.clients.UserClient;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.WorkflowApprovalRequest;
import io.digiservices.ecreditservice.exception.ApiException;
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
        workflowService.approuverAC(demandeId, request.getAvis(), codUsuarios, user.getUserId());
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("message", "Demande approuvée par AC"),
                        "Demande approuvée avec succès", OK));
    }

    /** Resoumission par l'agent d'un dossier corrigé après rejet DR/DE (retour au niveau qui a rejeté). */
    @PutMapping("/{demandeId}/resoumettre-correction")
    public ResponseEntity<Response> resoumettreCorrection(
            @PathVariable Long demandeId,
            HttpServletRequest httpRequest) {
        workflowService.resoumettreCorrection(demandeId);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("message", "Corrections resoumises"),
                        "Corrections resoumises avec succès", OK));
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

    // ==================== RENVOI DA -> AGENT (erreur de destination) ====================

    @PutMapping("/{demandeId}/renvoyer-agent")
    public ResponseEntity<Response> renvoyerAgent(
            @PathVariable Long demandeId,
            @RequestBody Map<String, Object> body,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        String renvoyePar = user.getFirstName() + " " + user.getLastName();
        String motif = body.get("motif") != null ? String.valueOf(body.get("motif")) : null;
        workflowService.renvoyerAgent(demandeId, motif, renvoyePar);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("message", "Demande renvoyée à l'agent"), "Demande renvoyée", OK));
    }

    @GetMapping("/renvoyees-ac")
    public ResponseEntity<Response> getRenvoyeesAC(Authentication authentication, HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        String codUsuarios = user.getFirstName() + " " + user.getLastName();
        var result = workflowService.getRenvoyeesAC(codUsuarios);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("workflowDemandes", result), "Demandes renvoyées récupérées", OK));
    }

    @PutMapping("/{demandeId}/resoumettre-da")
    public ResponseEntity<Response> resoumettreDA(
            @PathVariable Long demandeId,
            @RequestBody Map<String, Object> body,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        Long delegation = toLong(body.get("delegationId"));
        Long agence = toLong(body.get("agenceId"));
        Long pos = toLong(body.get("posId"));
        workflowService.resoumettreDA(demandeId, delegation, agence, pos);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("message", "Demande renvoyée au DA"), "Demande resoumise", OK));
    }

    private Long toLong(Object o) {
        if (o == null) return null;
        if (o instanceof Number n) return n.longValue();
        try {
            return Long.valueOf(String.valueOf(o).trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    // ==================== AC LISTS ====================

    @GetMapping("/en-correction")
    public ResponseEntity<Response> getEnCorrectionAC(
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        var result = workflowService.getEnCorrectionAC(user.getAgenceId(), user.getPointventeId(), user.getUserId());
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("workflowDemandes", result),
                        "Demandes en correction AC récupérées", OK));
    }

    @GetMapping("/en-attente-da")
    public ResponseEntity<Response> getEnAttenteDA(
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        var result = workflowService.getEnAttenteDA(user.getAgenceId(), user.getPointventeId(), user.getUserId());
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("workflowDemandes", result),
                        "Demandes en attente DA récupérées", OK));
    }

    @GetMapping("/en-correction-dr-ac")
    public ResponseEntity<Response> getEnCorrectionDRForAC(
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        var result = workflowService.getEnCorrectionDRForAC(user.getAgenceId(), user.getPointventeId(), user.getUserId());
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("workflowDemandes", result),
                        "Demandes en correction DR pour AC récupérées", OK));
    }

    @GetMapping("/en-correction-de-ac")
    public ResponseEntity<Response> getEnCorrectionDEForAC(
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        var result = workflowService.getEnCorrectionDEForAC(user.getAgenceId(), user.getPointventeId(), user.getUserId());
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("workflowDemandes", result),
                        "Demandes en correction DE pour AC récupérées", OK));
    }

    @GetMapping("/suivi-validation")
    public ResponseEntity<Response> getSuiviValidationAC(
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        var result = workflowService.getSuiviValidationAC(user.getAgenceId(), user.getPointventeId(), user.getUserId());
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("workflowDemandes", result),
                        "Suivi validation récupéré", OK));
    }

    @GetMapping("/a-approuver-ac")
    public ResponseEntity<Response> getAApprouverAC(
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        var result = workflowService.getAApprouverAC(user.getAgenceId(), user.getPointventeId(), user.getUserId());
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("workflowDemandes", result),
                        "Demandes à approuver récupérées", OK));
    }

    // ==================== DA - DEMANDES AFFECTEES ====================

    @GetMapping("/demandes-affectees-da")
    public ResponseEntity<Response> getDemandesAffecteesDA(
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        var result = workflowService.getDemandesAffecteesDA(user.getAgenceId());
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("workflowDemandes", result),
                        "Demandes affectées DA récupérées", OK));
    }

    @PutMapping("/{demandeId}/annuler-affectation")
    public ResponseEntity<Response> annulerAffectation(
            @PathVariable Long demandeId,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        workflowService.annulerAffectation(demandeId);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("message", "Affectation annulée"),
                        "Affectation annulée avec succès", OK));
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

    @GetMapping("/suivi-global-de")
    public ResponseEntity<Response> getSuiviGlobalDE(
            HttpServletRequest httpRequest) {
        var result = workflowService.getSuiviGlobalDE();
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("workflowDemandes", result),
                        "Suivi global DE récupéré", OK));
    }

    // ==================== DA / DR - SUIVI DES CREDITS DE MON RESEAU ====================

    /**
     * Suivi en lecture seule des credits du reseau de l'appelant : un DA voit son agence,
     * un DR voit sa delegation. Le perimetre est deduit du compte connecte (jamais fourni
     * par le client) — tout autre role est refuse.
     */
    @GetMapping("/suivi-global-reseau")
    public ResponseEntity<Response> getSuiviGlobalReseau(
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        Long delegationId = null;
        Long agenceId = null;
        if ("DA".equals(user.getRole()) && user.getAgenceId() != null) {
            agenceId = user.getAgenceId();
        } else if ("DR".equals(user.getRole()) && user.getDelegationId() != null) {
            delegationId = user.getDelegationId();
        } else {
            throw new ApiException("Accès réservé aux DA et DR rattachés à une agence ou une délégation");
        }
        var result = workflowService.getSuiviGlobalReseau(delegationId, agenceId);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("workflowDemandes", result),
                        "Suivi des crédits du réseau récupéré", OK));
    }

    @GetMapping("/valides-de")
    public ResponseEntity<Response> getValidesDE(
            HttpServletRequest httpRequest) {
        var result = workflowService.getValidesDE();
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("workflowDemandes", result),
                        "Demandes validées par DE récupérées", OK));
    }

    // ==================== DI - INSPECTION ====================

    @GetMapping("/inspection-credits-dr")
    public ResponseEntity<Response> getInspectionCreditsDR(
            HttpServletRequest httpRequest) {
        var result = workflowService.getInspectionCreditsDR();
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("workflowDemandes", result),
                        "Inspection des crédits validés DR récupérée", OK));
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

    // ==================== DG (Directeur General) ====================

    @GetMapping("/a-valider-dg")
    public ResponseEntity<Response> getAValiderDG(HttpServletRequest httpRequest) {
        var result = workflowService.getAValiderDG();
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("workflowDemandes", result),
                        "Demandes à valider DG récupérées", OK));
    }

    @GetMapping("/valides-dg")
    public ResponseEntity<Response> getValidesDG(HttpServletRequest httpRequest) {
        var result = workflowService.getValidesDG();
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("workflowDemandes", result),
                        "Credits vises par DG recuperes", OK));
    }

    @PutMapping("/{demandeId}/valider-dg")
    public ResponseEntity<Response> validerDG(
            @PathVariable Long demandeId,
            @RequestBody WorkflowApprovalRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        String validatedBy = user.getFirstName() + " " + user.getLastName();
        workflowService.validerDG(demandeId, request.getAvis(), validatedBy);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("message", "Demande validee par DG"),
                        "Visa favorable DG enregistre", OK));
    }

    @PutMapping("/{demandeId}/rejeter-dg")
    public ResponseEntity<Response> rejeterDG(
            @PathVariable Long demandeId,
            @RequestBody WorkflowRejetRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        String validatedBy = user.getFirstName() + " " + user.getLastName();
        workflowService.rejeterDG(demandeId, request.getMotifRejet(), validatedBy);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("message", "Demande rejetee par DG"),
                        "Rejet DG enregistre (en attente de confirmation DE)", OK));
    }

    // ==================== DE - Confirmation du rejet DG ====================

    @GetMapping("/rejets-dg-a-confirmer")
    public ResponseEntity<Response> getRejetsDGAConfirmer(HttpServletRequest httpRequest) {
        var result = workflowService.getRejetsDGAConfirmer();
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("workflowDemandes", result),
                        "Rejets DG a confirmer recuperes", OK));
    }

    @PutMapping("/{demandeId}/confirmer-rejet-dg")
    public ResponseEntity<Response> confirmerRejetDG(
            @PathVariable Long demandeId,
            @RequestBody(required = false) WorkflowRejetRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        String confirmedBy = user.getFirstName() + " " + user.getLastName();
        String instructions = request != null ? request.getInstructions() : null;
        java.util.List<String> sectionsARevoir = request != null ? request.getSectionsARevoir() : null;
        workflowService.confirmerRejetDG(demandeId, instructions, sectionsARevoir, confirmedBy);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("message", "Rejet DG confirme"),
                        "Rejet confirme, demande renvoyee en correction", OK));
    }

    // ==================== ACCUEIL (reception des demandes) ====================

    /**
     * L'accueil marque sa saisie comme receptionnee : la demande part en file
     * EN_ATTENTE_DA et c'est le DA qui l'affecte a un agent de credit.
     */
    @PutMapping("/{demandeId}/marquer-reception")
    public ResponseEntity<Response> marquerReception(
            @PathVariable Long demandeId,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        requireFonctionAccueil(user);
        String codUsuarios = user.getFirstName() + " " + user.getLastName();
        workflowService.marquerReception(demandeId, user.getUserId(), codUsuarios);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("message", "Demande receptionnee"),
                        "Demande transmise au DA pour affectation", OK));
    }

    /** Agents de credit eligibles a une affectation (DA) : role AGENT_CREDIT, cumul accueil + credit autorise. */
    @GetMapping("/agents-credit-eligibles")
    public ResponseEntity<Response> getAgentsCreditEligibles(Authentication authentication, HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        if (user.getAgenceId() == null) {
            throw new ApiException("Compte non rattache a une agence");
        }
        var result = workflowService.getAgentsCreditEligibles(user.getAgenceId());
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("agents", result), "Agents eligibles recuperes", OK));
    }

    @GetMapping("/mes-receptions")
    public ResponseEntity<Response> getMesReceptions(Authentication authentication, HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        requireFonctionAccueil(user);
        var result = workflowService.getMesReceptions(user.getUserId());
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("workflowDemandes", result), "Receptions recuperees", OK));
    }

    @PutMapping("/{demandeId}/rediligenter-accueil")
    public ResponseEntity<Response> rediligenterAccueil(
            @PathVariable Long demandeId,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        requireFonctionAccueil(user);
        workflowService.rediligenterAccueil(demandeId, user.getUserId());
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("message", "Demande rediligentee"),
                        "Demande renvoyee au Directeur d'Agence", OK));
    }

    // ==================== DA - RECEPTION / AFFECTATION ====================

    @GetMapping("/a-affecter-da")
    public ResponseEntity<Response> getAAffecterDA(Authentication authentication, HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        requireDA(user);
        var result = workflowService.getAAffecterDA(user.getAgenceId());
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("workflowDemandes", result),
                        "Demandes a affecter recuperees", OK));
    }

    @PutMapping("/{demandeId}/affecter-ac")
    public ResponseEntity<Response> affecterAC(
            @PathVariable Long demandeId,
            @RequestBody Map<String, Object> body,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        requireDA(user);
        Long agentUserId = toLong(body.get("agentUserId"));
        if (agentUserId == null) {
            throw new ApiException("L'agent de credit destinataire est obligatoire");
        }
        String affectePar = user.getFirstName() + " " + user.getLastName();
        workflowService.affecterAC(demandeId, agentUserId, affectePar, user.getAgenceId());
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("message", "Demande affectee"),
                        "Demande affectee a l'agent de credit", OK));
    }

    @PutMapping("/{demandeId}/annuler-accueil")
    public ResponseEntity<Response> annulerAccueil(
            @PathVariable Long demandeId,
            @RequestBody Map<String, Object> body,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        requireDA(user);
        String motif = body.get("motif") != null ? String.valueOf(body.get("motif")) : null;
        workflowService.annulerAccueil(demandeId, motif);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("message", "Demande annulee"),
                        "Demande renvoyee a l'agent d'accueil pour correction", OK));
    }

    // ==================== AC - DEMANDES AFFECTEES PAR LE DA ====================

    @GetMapping("/mes-affectations-ac")
    public ResponseEntity<Response> getMesAffectationsAC(Authentication authentication, HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        var result = workflowService.getMesAffectationsAC(user.getUserId());
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("workflowDemandes", result),
                        "Demandes affectees recuperees", OK));
    }

    @PutMapping("/{demandeId}/prendre-en-charge-ac")
    public ResponseEntity<Response> prendreEnChargeAC(
            @PathVariable Long demandeId,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        workflowService.prendreEnChargeAC(demandeId, user.getUserId());
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("message", "Demande prise en charge"),
                        "Demande prise en charge (selection)", OK));
    }

    // ==================== DA - GESTION DES FONCTIONS D'AGENCE ====================

    @GetMapping("/agents-agence")
    public ResponseEntity<Response> getAgentsAgence(Authentication authentication, HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        requireDA(user);
        var result = workflowService.getAgentsAgence(user.getAgenceId());
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("agents", result), "Agents de l'agence recuperes", OK));
    }

    @PutMapping("/agents/{userId}/fonction")
    public ResponseEntity<Response> setAgentFonction(
            @PathVariable("userId") Long agentUserId,
            @RequestBody Map<String, Object> body,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        requireDA(user);
        String fonction = body.get("fonction") != null ? String.valueOf(body.get("fonction")) : null;
        boolean actif = Boolean.parseBoolean(String.valueOf(body.get("actif")));
        workflowService.setAgentFonction(agentUserId, fonction, actif, user.getUserId(), user.getAgenceId());
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("message", "Fonction mise a jour"),
                        "Fonction " + fonction + (actif ? " activee" : " desactivee"), OK));
    }

    /** Fonctions actives de l'utilisateur connecte (pilote l'affichage du menu cote frontend). */
    @GetMapping("/mes-fonctions")
    public ResponseEntity<Response> getMesFonctions(Authentication authentication, HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        var result = workflowService.getMesFonctions(user.getUserId());
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("fonctions", result), "Fonctions recuperees", OK));
    }

    private void requireDA(io.digiservices.clients.domain.User user) {
        if (!"DA".equals(user.getRole()) || user.getAgenceId() == null) {
            throw new ApiException("Acces reserve au Directeur d'Agence");
        }
    }

    /** Accueil = role AGENT_ACCUEIL, ou AGENT_CREDIT avec fonction ACCUEIL activee par le DA. */
    private void requireFonctionAccueil(io.digiservices.clients.domain.User user) {
        if ("AGENT_ACCUEIL".equals(user.getRole())) {
            return;
        }
        if ("AGENT_CREDIT".equals(user.getRole())
                && workflowService.getMesFonctions(user.getUserId()).contains("ACCUEIL")) {
            return;
        }
        throw new ApiException("Acces reserve aux agents d'accueil");
    }
}
