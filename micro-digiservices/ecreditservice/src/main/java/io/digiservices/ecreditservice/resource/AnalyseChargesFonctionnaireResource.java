package io.digiservices.ecreditservice.resource;

import io.digiservices.clients.UserClient;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.AnalyseChargesFonctionnaireDto;
import io.digiservices.ecreditservice.service.AnalyseChargesFonctionnaireService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/**
 * Analyse charges & quotité du crédit fonctionnaire — remplace le bilan/flux
 * commerçant pour la nature client Fonctionnaire.
 */
@RestController
@AllArgsConstructor
@RequestMapping("/ecredit/fonctionnaire")
@Slf4j
public class AnalyseChargesFonctionnaireResource {

    private final AnalyseChargesFonctionnaireService analyseChargesService;
    private final UserClient userClient;

    @GetMapping("/analyse-charges/{demandeId}")
    public ResponseEntity<Response> getAnalyseCharges(
            @PathVariable Long demandeId,
            HttpServletRequest httpRequest) {
        Map<String, Object> data = new HashMap<>();
        data.put("analyseCharges", analyseChargesService.getByDemandeId(demandeId).orElse(null));
        return ResponseEntity.ok(
                getResponse(httpRequest, data, "Analyse des charges récupérée", OK));
    }

    @PutMapping("/analyse-charges/{demandeId}")
    public ResponseEntity<Response> enregistrerAnalyseCharges(
            @PathVariable Long demandeId,
            @RequestBody AnalyseChargesFonctionnaireDto dto,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        String analysePar = user.getFirstName() + " " + user.getLastName();
        var result = analyseChargesService.enregistrer(demandeId, dto, analysePar);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("analyseCharges", result),
                        "Analyse des charges enregistrée", OK));
    }
}
