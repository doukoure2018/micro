package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.service.DonneesSafService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/** « Donnees SAF au … » pour les ecrans qui lisent SAF (aiguillage, lot 2). */
@RestController
@RequestMapping("/ecredit/portefeuille/donnees-saf")
@RequiredArgsConstructor
public class DonneesSafResource {

    private final DonneesSafService donneesSaf;

    @GetMapping
    public ResponseEntity<Response> etat(HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request, Map.of("donneesSaf", donneesSaf.etat()), "Donnees SAF", OK));
    }
}
