package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.service.DirectionSyntheseService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/**
 * La synthese hebdomadaire de direction (V198, lot 1).
 *
 * <p>Le courriel part tout seul le lundi a 08 h 50 GMT. Ces trois points d'entree servent a le
 * relire avant qu'il parte, a se l'envoyer a soi pour verifier sa presentation, et a consulter
 * les semaines passees. Tous exigent la rubrique {@code SYNTHESE_DIRECTION}.</p>
 */
@RestController
@RequestMapping("/ecredit/synthese-direction")
@RequiredArgsConstructor
@Slf4j
public class DirectionSyntheseResource {

    private final DirectionSyntheseService service;

    /** La synthese telle qu'elle partira, sans l'envoyer. */
    @GetMapping
    public ResponseEntity<Response> apercu(@NotNull Authentication authentication,
                                           @RequestParam(name = "reference", required = false)
                                           @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate reference,
                                           HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("synthese", service.apercu(authentication.getName(), reference)),
                "Synthese hebdomadaire de direction", OK));
    }

    /**
     * Un envoi d'essai, a son seul auteur. On ne decouvre pas une maladresse de presentation
     * dans la boite du Directeur General.
     */
    @PostMapping("/essai")
    public ResponseEntity<Response> essai(@NotNull Authentication authentication,
                                          HttpServletRequest request) {
        String message = service.essai(authentication.getName());
        return ResponseEntity.ok(getResponse(request, Map.of(), message, OK));
    }

    /** Les dernieres semaines envoyees, pour relire ce qui a ete annonce. */
    @GetMapping("/historique")
    public ResponseEntity<Response> historique(@NotNull Authentication authentication,
                                               @RequestParam(name = "limite", defaultValue = "12") int limite,
                                               HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("semaines", service.historique(authentication.getName(), limite)),
                "Syntheses hebdomadaires envoyees", OK));
    }
}
