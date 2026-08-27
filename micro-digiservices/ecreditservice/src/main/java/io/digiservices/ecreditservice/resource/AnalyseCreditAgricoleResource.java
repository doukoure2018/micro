package io.digiservices.ecreditservice.resource;

import io.digiservices.clients.UserClient;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.AnalyseCreditAgricoleDto;
import io.digiservices.ecreditservice.exception.ValidationException;
import io.digiservices.ecreditservice.service.AnalyseCreditAgricoleService;
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
 * Analyse du crédit agricole solidaire (groupes CAS / CAS-R) — remplace le
 * bilan/flux commerçant pour ces types de groupe.
 */
@RestController
@AllArgsConstructor
@RequestMapping("/ecredit/groupe")
@Slf4j
public class AnalyseCreditAgricoleResource {

    private final AnalyseCreditAgricoleService analyseAgricoleService;
    private final UserClient userClient;

    @GetMapping("/analyse-agricole/{demandeId}")
    public ResponseEntity<Response> getAnalyseAgricole(
            @PathVariable Long demandeId,
            HttpServletRequest httpRequest) {
        Map<String, Object> data = new HashMap<>();
        data.put("analyseAgricole", analyseAgricoleService.getByDemandeId(demandeId).orElse(null));
        return ResponseEntity.ok(
                getResponse(httpRequest, data, "Analyse agricole récupérée", OK));
    }

    @PutMapping("/analyse-agricole/{demandeId}")
    public ResponseEntity<Response> enregistrerAnalyseAgricole(
            @PathVariable Long demandeId,
            @RequestBody AnalyseCreditAgricoleDto dto,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        if (!"AGENT_CREDIT".equals(user.getRole())) {
            throw new ValidationException("Seul l'agent de crédit peut enregistrer l'analyse agricole");
        }
        String analysePar = user.getFirstName() + " " + user.getLastName();
        var result = analyseAgricoleService.enregistrer(demandeId, dto, analysePar);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("analyseAgricole", result),
                        "Analyse agricole enregistrée", OK));
    }
}
