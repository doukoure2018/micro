package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.service.MonTableauService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/**
 * Le volet lateral, pour l'utilisateur connecte.
 *
 * <p>Aucun parametre : le volet ne montre que ce qui concerne celui qui le demande, et c'est le
 * jeton qui le dit. Une ressource qui accepterait un identifiant d'utilisateur permettrait de
 * lire le tableau de bord d'un collegue.</p>
 *
 * <p>Appele a chaque ouverture du volet : tout vient de Postgres, rien de SAF.</p>
 */
@RestController
@RequestMapping("/ecredit/mon-tableau")
@RequiredArgsConstructor
public class MonTableauResource {

    private final MonTableauService service;

    @GetMapping
    public ResponseEntity<Response> tableau(@NotNull Authentication authentication,
                                            HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("tableau", service.tableau(authentication.getName())),
                "Mon tableau", OK));
    }
}
