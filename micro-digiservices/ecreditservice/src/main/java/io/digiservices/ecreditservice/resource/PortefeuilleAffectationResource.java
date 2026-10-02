package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.AffectationRequest;
import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.DesaffectationRequest;
import io.digiservices.ecreditservice.service.PortefeuilleAffectationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/**
 * Affectation des credits SAF aux agents de credit (V159).
 * Le perimetre et le droit d'affecter sont verifies par le service a chaque appel.
 */
@RestController
@RequestMapping("/ecredit/portefeuille/affectations")
@RequiredArgsConstructor
@Slf4j
public class PortefeuilleAffectationResource {

    private final PortefeuilleAffectationService service;

    /** Credits vivants du point de service, chacun avec son agent digi, plus agents et indicateurs. */
    @GetMapping
    public ResponseEntity<Response> charger(@NotNull Authentication authentication,
                                            @RequestParam(name = "codAgencia") String codAgencia,
                                            HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("portefeuille", service.charger(authentication.getName(), codAgencia)),
                "Portefeuille du point de service", OK));
    }

    /** Confie une liste de credits a un agent du point de service (DA). */
    @PostMapping
    public ResponseEntity<Response> affecter(@NotNull Authentication authentication,
                                             @Valid @RequestBody AffectationRequest body,
                                             HttpServletRequest request) {
        int n = service.affecter(authentication.getName(), body);
        return ResponseEntity.ok(getResponse(request, Map.of("nbAffectes", n),
                n == 0 ? "Aucun changement : ces credits etaient deja chez cet agent"
                       : n + " credit(s) affecte(s)", OK));
    }

    /** Retire les credits a leur agent sans les confier a un autre (DA). */
    @PostMapping("/desaffecter")
    public ResponseEntity<Response> desaffecter(@NotNull Authentication authentication,
                                                @Valid @RequestBody DesaffectationRequest body,
                                                HttpServletRequest request) {
        int n = service.desaffecter(authentication.getName(), body);
        return ResponseEntity.ok(getResponse(request, Map.of("nbDesaffectes", n),
                n + " credit(s) desaffecte(s)", OK));
    }

    /** Historique des responsables d'un credit, du plus recent au plus ancien. */
    @GetMapping("/{codAgencia}/{numCredito}/historique")
    public ResponseEntity<Response> historique(@NotNull Authentication authentication,
                                               @PathVariable("codAgencia") String codAgencia,
                                               @PathVariable("numCredito") Long numCredito,
                                               HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("historique", service.historique(authentication.getName(), codAgencia, numCredito)),
                "Historique des affectations du credit", OK));
    }
}
