package io.digiservices.ecreditservice.resource;

import io.digiservices.clients.UserClient;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.RejetDARequest;
import io.digiservices.ecreditservice.service.ValidationDAService;
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
@RequestMapping("/ecredit/bilan_finance/validation-da")
@Slf4j
public class ValidationDAResource {

    private final ValidationDAService validationDAService;
    private final UserClient userClient;

    @PostMapping("/{demandeId}/bilan/valider")
    public ResponseEntity<Response> validerBilan(
            @PathVariable Long demandeId,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        String nomDA = user.getFirstName() + " " + user.getLastName();
        var result = validationDAService.validerBilan(demandeId, user.getUserId(), nomDA);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("validationDA", result),
                        "Bilan d'activité validé avec succès", OK));
    }

    @PostMapping("/{demandeId}/bilan/rejeter")
    public ResponseEntity<Response> rejeterBilan(
            @PathVariable Long demandeId,
            @RequestBody RejetDARequest request,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        String nomDA = user.getFirstName() + " " + user.getLastName();
        var result = validationDAService.rejeterBilan(demandeId, request, user.getUserId(), nomDA);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("validationDA", result),
                        "Bilan d'activité rejeté", OK));
    }

    @PostMapping("/{demandeId}/flux/valider")
    public ResponseEntity<Response> validerFlux(
            @PathVariable Long demandeId,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        String nomDA = user.getFirstName() + " " + user.getLastName();
        var result = validationDAService.validerFlux(demandeId, user.getUserId(), nomDA);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("validationDA", result),
                        "Flux de trésorerie validé avec succès", OK));
    }

    @PostMapping("/{demandeId}/flux/rejeter")
    public ResponseEntity<Response> rejeterFlux(
            @PathVariable Long demandeId,
            @RequestBody RejetDARequest request,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        String nomDA = user.getFirstName() + " " + user.getLastName();
        var result = validationDAService.rejeterFlux(demandeId, request, user.getUserId(), nomDA);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("validationDA", result),
                        "Flux de trésorerie rejeté", OK));
    }

    @GetMapping("/{demandeId}/statut")
    public ResponseEntity<Response> getStatut(
            @PathVariable Long demandeId,
            HttpServletRequest httpRequest) {
        var result = validationDAService.getStatut(demandeId);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("validationsDA", result),
                        "Statuts de validation récupérés", OK));
    }

    @GetMapping("/rejets")
    public ResponseEntity<Response> getDemandesRejetees(
            HttpServletRequest httpRequest) {
        var result = validationDAService.getDemandesRejetees();
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("demandesRejetees", result),
                        "Demandes rejetées récupérées", OK));
    }

    @GetMapping("/validees-ids")
    public ResponseEntity<Response> getDemandesValideesIds(
            HttpServletRequest httpRequest) {
        var result = validationDAService.getDemandesValideesIds();
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("demandesValideesIds", result),
                        "IDs des demandes validées récupérés", OK));
    }
}
