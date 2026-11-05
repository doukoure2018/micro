package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.service.ScoreConfianceService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/**
 * Pilotage du score de confiance des membres (lots 2 et 3).
 *
 * <p>La consultation d'un membre reste sur {@code /ecredit/seachCreditos} : c'est l'ecran
 * d'analyse de credit, et il ne change pas d'adresse. Ici vivent la memoire du score, la
 * repartition par classe, les degradations et le test de calibrage — leur habilitation est
 * verifiee par le service a chaque appel.</p>
 */
@RestController
@RequestMapping("/ecredit/score-confiance")
@RequiredArgsConstructor
@Slf4j
public class ScoreConfianceResource {

    private final ScoreConfianceService service;

    /** Historique du score d'un membre : ce qui a ete vu, et quand. */
    @GetMapping("/historique/{numeroMembre}")
    public ResponseEntity<Response> historique(@NotNull Authentication authentication,
                                               @PathVariable String numeroMembre,
                                               @RequestParam(defaultValue = "24") int limite,
                                               HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("historique", service.historique(numeroMembre, limite)),
                "Historique du score de confiance", OK));
    }

    /** Repartition des classes par point de service et par agent, derniere photo mensuelle. */
    @GetMapping("/repartition")
    public ResponseEntity<Response> repartition(@NotNull Authentication authentication,
                                                @RequestParam(required = false)
                                                @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate mois,
                                                HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("repartition", service.repartition(authentication.getName(), mois)),
                "Répartition des classes de confiance", OK));
    }

    /** Membres passes dans une classe moins bonne d'un mois sur l'autre. */
    @GetMapping("/degradations")
    public ResponseEntity<Response> degradations(@NotNull Authentication authentication,
                                                 @RequestParam(required = false)
                                                 @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate mois,
                                                 HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("derive", service.degradations(authentication.getName(), mois)),
                "Dégradations de classe", OK));
    }

    /**
     * Relance la photo mensuelle a la main. Le mois est la cle : relancer remplace la photo du
     * mois, elle ne la double pas.
     */
    @PostMapping("/photo")
    public ResponseEntity<Response> photographier(@NotNull Authentication authentication,
                                                  @RequestParam(required = false)
                                                  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate mois,
                                                  HttpServletRequest request) {
        LocalDate cible = mois != null ? mois : LocalDate.now().withDayOfMonth(1);
        log.info("[SCORE] Photo mensuelle demandee par {} pour {}", authentication.getName(), cible);
        return ResponseEntity.ok(getResponse(request,
                Map.of("photo", service.photographierSurDemande(authentication.getName(), cible)),
                "Photo mensuelle du score de confiance", OK));
    }

    /**
     * Test de calibrage : le score tel qu'il aurait ete a une date passee, confronte au defaut
     * constate dans les douze mois suivants. C'est ce test qui autorise — ou non — a s'appuyer
     * sur les classes.
     */
    @PostMapping("/calibrer")
    public ResponseEntity<Response> calibrer(@NotNull Authentication authentication,
                                             @RequestParam
                                             @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                             @RequestParam(defaultValue = "300") int limite,
                                             HttpServletRequest request) {
        log.info("[SCORE] Calibrage demande par {} a la date {} sur {} membre(s) au plus",
                authentication.getName(), date, limite);
        return ResponseEntity.ok(getResponse(request,
                Map.of("calibrage", service.calibrer(authentication.getName(), date, limite)),
                "Test rétrospectif du score de confiance", OK));
    }
}
