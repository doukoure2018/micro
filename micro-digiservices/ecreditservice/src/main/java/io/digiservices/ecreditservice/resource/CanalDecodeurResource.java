package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.dto.ReactivationDecodeurRequest;
import io.digiservices.ecreditservice.service.CanalDecodeurService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Actualisation des chaînes d'un décodeur Canal+ (réactivation) — endpoint authentifié,
 * relais vers l'API partenaire. Gratuit, limité à 1 actualisation / 10 min / décodeur
 * (le 429 de Canal+ est relayé au frontend avec le temps restant).
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/ecredit/decodeur")
@Slf4j
public class CanalDecodeurResource {

    private final CanalDecodeurService canalDecodeurService;

    /**
     * ÉTAPE 1 (OBLIGATOIRE) : consultation du statut de l'abonnement du décodeur.
     * À appeler AVANT toute actualisation — le frontend n'autorise l'étape 2 que si
     * existe=true et statut=Active. Traitement temps réel côté Canal+ (~60 s).
     */
    @GetMapping(value = "/check", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> checkDecoder(Authentication authentication,
                                               @RequestParam("numAbonne") String numAbonneParam) {
        String numAbonne = normalizeDigits(numAbonneParam);
        if (!numAbonne.matches("\\d{14}")) {
            return badRequest("Le numéro de décodeur doit contenir exactement 14 chiffres");
        }
        log.info("Vérification décodeur {} demandée par {}", numAbonne,
                authentication != null ? authentication.getName() : "?");
        var result = canalDecodeurService.checkDecoder(numAbonne);
        return ResponseEntity.status(result.status())
                .contentType(MediaType.APPLICATION_JSON)
                .body(result.body());
    }

    @PostMapping(value = "/reactivation", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> reactivation(Authentication authentication,
                                               @Valid @RequestBody ReactivationDecodeurRequest request) {
        String numAbonne = normalizeDigits(request.getNumAbonne());
        String phone = normalizePhone(request.getPhoneNumber());

        if (!numAbonne.matches("\\d{14}")) {
            return badRequest("Le numéro de décodeur doit contenir exactement 14 chiffres");
        }
        if (!phone.matches("\\d{9}")) {
            return badRequest("Le numéro de téléphone doit contenir 9 chiffres, sans l'indicatif pays (ex: 621091895)");
        }

        log.info("Actualisation décodeur {} demandée par {}", numAbonne,
                authentication != null ? authentication.getName() : "?");

        var result = canalDecodeurService.reactivation(numAbonne, phone);
        return ResponseEntity.status(result.status())
                .contentType(MediaType.APPLICATION_JSON)
                .body(result.body());
    }

    /** Retire espaces, tirets et points. */
    private String normalizeDigits(String value) {
        return value == null ? "" : value.replaceAll("[\\s.\\-]", "");
    }

    /** Normalise le téléphone : retire l'indicatif Guinée s'il a été saisi (+224 / 00224 / 224). */
    private String normalizePhone(String value) {
        String digits = normalizeDigits(value).replace("+", "");
        if (digits.startsWith("00224")) {
            digits = digits.substring(5);
        } else if (digits.startsWith("224") && digits.length() == 12) {
            digits = digits.substring(3);
        }
        return digits;
    }

    private ResponseEntity<String> badRequest(String message) {
        return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body("{\"statusCode\":400,\"status\":\"BAD_REQUEST\",\"message\":\"" + message + "\"}");
    }
}
