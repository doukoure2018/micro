package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.service.PortefeuilleScoreService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/**
 * Appreciation des agents de credit a partir de leur portefeuille (V164, lot 1).
 * Le perimetre (DE, DG, SUPER_ADMIN : reseau ; DR : delegation) est verifie par le service.
 */
@RestController
@RequestMapping("/ecredit/portefeuille/scores")
@RequiredArgsConstructor
@Slf4j
public class PortefeuilleScoreResource {

    private final PortefeuilleScoreService service;

    /** Dernier calcul : synthese par delegation et un score par agent du perimetre. */
    @GetMapping
    public ResponseEntity<Response> lire(@NotNull Authentication authentication, HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request, Map.of("scores", service.lire(authentication.getName())),
                "Appreciation des agents de credit", OK));
    }

    /** Fiche d'un agent : decomposition du score, historique, credits en retard. */
    @GetMapping("/{agentUserId}")
    public ResponseEntity<Response> fiche(@NotNull Authentication authentication,
                                          @PathVariable("agentUserId") Long agentUserId,
                                          HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request, Map.of("fiche", service.fiche(authentication.getName(), agentUserId)),
                "Fiche de l'agent", OK));
    }

    /** Recalcul immediat sur tout le reseau (DE, SUPER_ADMIN) : premier calcul, calibrage. */
    @PostMapping("/recalculer")
    public ResponseEntity<Response> recalculer(@NotNull Authentication authentication, HttpServletRequest request) {
        int n = service.recalculer(authentication.getName());
        return ResponseEntity.ok(getResponse(request, Map.of("nbAgents", n), n + " agent(s) note(s)", OK));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exporter(@NotNull Authentication authentication) {
        byte[] contenu = service.exporter(authentication.getName());
        String nom = "appreciation_agents_" + java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.BASIC_ISO_DATE) + ".xlsx";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", nom);
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        headers.setContentLength(contenu.length);
        log.info("[SCORE] Export Excel {} : {} octets", nom, contenu.length);
        return ResponseEntity.ok().headers(headers).body(contenu);
    }
}
