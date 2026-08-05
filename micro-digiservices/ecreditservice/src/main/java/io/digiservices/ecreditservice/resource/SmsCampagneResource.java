package io.digiservices.ecreditservice.resource;

import io.digiservices.clients.UserClient;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.service.SmsCampagneService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/**
 * Campagnes SMS de masse (environnement digital).
 * Accès réservé au service DSIG (MANAGER) et au SUPER_ADMIN.
 */
@RestController
@AllArgsConstructor
@RequestMapping("/ecredit/sms/campagnes")
@Slf4j
public class SmsCampagneResource {

    private final SmsCampagneService smsCampagneService;
    private final UserClient userClient;

    @PostMapping
    public ResponseEntity<Response> creerCampagne(
            @RequestBody Map<String, Object> body,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = requireDigital(authentication);
        String nom = str(body.get("nom"));
        String message = str(body.get("message"));
        String creePar = user.getFirstName() + " " + user.getLastName();
        var campagne = smsCampagneService.creerCampagne(nom, message, creePar);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("campagne", campagne), "Campagne creee", OK));
    }

    /** Charge la campagne (brouillon) depuis un répertoire pré-chargé : snapshot des numéros. */
    @PutMapping("/{campagneId}/charger-repertoire/{repertoireId}")
    public ResponseEntity<Response> chargerRepertoire(
            @PathVariable Long campagneId,
            @PathVariable Long repertoireId,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        requireDigital(authentication);
        var campagne = smsCampagneService.chargerDepuisRepertoire(campagneId, repertoireId);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("campagne", campagne),
                        "Repertoire charge dans la campagne", OK));
    }

    @GetMapping
    public ResponseEntity<Response> getCampagnes(Authentication authentication, HttpServletRequest httpRequest) {
        requireDigital(authentication);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("campagnes", smsCampagneService.getCampagnes()),
                        "Campagnes recuperees", OK));
    }

    /** Statistiques temps réel d'une campagne (compteurs par statut). */
    @GetMapping("/{campagneId}/stats")
    public ResponseEntity<Response> getStats(
            @PathVariable Long campagneId,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        requireDigital(authentication);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("campagne", smsCampagneService.getCampagne(campagneId)),
                        "Statistiques recuperees", OK));
    }

    @GetMapping("/{campagneId}/destinataires")
    public ResponseEntity<Response> getDestinataires(
            @PathVariable Long campagneId,
            @RequestParam(name = "statut", required = false) String statut,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "50") int size,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        requireDigital(authentication);
        var destinataires = smsCampagneService.getDestinataires(campagneId, statut, page, size);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("destinataires", destinataires),
                        "Destinataires recuperes", OK));
    }

    @PutMapping("/{campagneId}/lancer")
    public ResponseEntity<Response> lancer(
            @PathVariable Long campagneId,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        requireDigital(authentication);
        smsCampagneService.lancer(campagneId);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("message", "Campagne lancee"),
                        "Campagne lancee : les envois demarrent", OK));
    }

    @PutMapping("/{campagneId}/pause")
    public ResponseEntity<Response> pause(
            @PathVariable Long campagneId,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        requireDigital(authentication);
        smsCampagneService.pause(campagneId);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("message", "Campagne en pause"), "Campagne mise en pause", OK));
    }

    @PutMapping("/{campagneId}/reprendre")
    public ResponseEntity<Response> reprendre(
            @PathVariable Long campagneId,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        requireDigital(authentication);
        smsCampagneService.lancer(campagneId);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("message", "Campagne reprise"), "Campagne reprise", OK));
    }

    @PutMapping("/{campagneId}/annuler")
    public ResponseEntity<Response> annuler(
            @PathVariable Long campagneId,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        requireDigital(authentication);
        smsCampagneService.annuler(campagneId);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("message", "Campagne annulee"), "Campagne annulee", OK));
    }

    private io.digiservices.clients.domain.User requireDigital(Authentication authentication) {
        var user = userClient.getUserByUuid(authentication.getName());
        boolean dsig = "MANAGER".equals(user.getRole()) && "DSIG".equalsIgnoreCase(user.getService());
        boolean superAdmin = "SUPER_ADMIN".equals(user.getRole());
        if (!dsig && !superAdmin) {
            throw new ApiException("Acces reserve a l'environnement digital (DSIG)");
        }
        return user;
    }

    private String str(Object o) {
        return o != null ? String.valueOf(o) : null;
    }
}
