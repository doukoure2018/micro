package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.service.HabilitationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/**
 * Le porte-cles d'habilitations (V178). Le menu et les gardes de route l'interrogent une fois
 * par session ; chaque point d'entree soumis a habilitation reverifie de son cote.
 */
@RestController
@RequestMapping("/ecredit/habilitations")
@RequiredArgsConstructor
public class HabilitationResource {

    private final HabilitationService habilitationService;

    /** Ce que le compte connecte a le droit d'ouvrir. */
    @GetMapping("/moi")
    public ResponseEntity<Response> moi(@NotNull Authentication authentication, HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("habilitations", habilitationService.porteCles(authentication.getName())),
                "Habilitations", OK));
    }

    // ==================== Lot 2 : l'ecran de reglage ====================

    /** La matrice complete : departements, rubriques, cases, comptes rattaches et journal. */
    @GetMapping("/matrice")
    public ResponseEntity<Response> matrice(@NotNull Authentication authentication,
                                            @RequestParam(value = "service", required = false) String service,
                                            HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("matrice", habilitationService.matrice(authentication.getName(), service)),
                "Matrice des habilitations", OK));
    }

    /** Coche ou decoche une rubrique pour un departement. */
    @PutMapping("/matrice")
    public ResponseEntity<Response> regler(@NotNull Authentication authentication,
                                           @RequestBody Map<String, Object> corps,
                                           HttpServletRequest request) {
        Long departementId = corps.get("departementId") == null ? null
                : Long.valueOf(String.valueOf(corps.get("departementId")));
        String rubrique = (String) corps.get("rubrique");
        boolean accorde = Boolean.TRUE.equals(corps.get("accorde"));
        String message = habilitationService.regler(authentication.getName(), departementId, rubrique, accorde);
        return ResponseEntity.ok(getResponse(request,
                Map.of("departementId", departementId == null ? 0L : departementId,
                        "rubrique", rubrique == null ? "" : rubrique, "accorde", accorde),
                message, OK));
    }

    /** Ouvre ou referme l'habilitation par departement. */
    @PutMapping("/bascule")
    public ResponseEntity<Response> basculer(@NotNull Authentication authentication,
                                             @RequestParam("actif") boolean actif,
                                             HttpServletRequest request) {
        String message = habilitationService.basculer(authentication.getName(), actif);
        return ResponseEntity.ok(getResponse(request, Map.of("actif", actif), message, OK));
    }

    /** Le departement deja enregistre pour un compte, pour pre-remplir sa fiche. */
    @GetMapping("/comptes/{userId}/departement")
    public ResponseEntity<Response> departementDuCompte(@NotNull Authentication authentication,
                                                        @PathVariable("userId") Long userId,
                                                        HttpServletRequest request) {
        var departement = habilitationService.departementDuCompte(userId);
        return ResponseEntity.ok(getResponse(request,
                departement == null ? Map.of() : Map.of("departement", departement),
                "Departement du compte", OK));
    }

    /**
     * Rattache un compte a un departement. Reserve a l'administrateur, verifie dans le service.
     * Sans parametre {@code departementId}, le rattachement est retire.
     */
    @PutMapping("/comptes/{userId}/departement")
    public ResponseEntity<Response> affecter(@NotNull Authentication authentication,
                                             @PathVariable("userId") Long userId,
                                             @RequestParam(value = "departementId", required = false) Long departementId,
                                             HttpServletRequest request) {
        String message = habilitationService.affecter(authentication.getName(), userId, departementId);
        return ResponseEntity.ok(getResponse(request,
                Map.of("userId", userId, "departementId", departementId == null ? 0L : departementId),
                message, OK));
    }

    /**
     * Les departements proposes pour un service, a la creation et a la modification d'un compte.
     * Sans parametre, la liste complete. Lecture seule et sans secret.
     */
    @GetMapping("/departements")
    public ResponseEntity<Response> departements(@NotNull Authentication authentication,
                                                 @RequestParam(value = "service", required = false) String service,
                                                 HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("departements", habilitationService.departements(service)),
                "Departements", OK));
    }
}
