package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.service.MembreSafService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/** Verification d'un numero de membre dans SAF production, appelee par les formulaires a la sortie du champ. */
@RestController
@RequestMapping("/ecredit/membres")
@RequiredArgsConstructor
public class MembreSafResource {

    private final MembreSafService service;

    @GetMapping("/{numero}/verification")
    public ResponseEntity<Response> verifier(@NotNull Authentication authentication,
                                             @PathVariable("numero") String numero,
                                             HttpServletRequest request) {
        var v = service.verifier(numero);
        return ResponseEntity.ok(getResponse(request, Map.of("verification", v), v.getMessage(), OK));
    }
}
