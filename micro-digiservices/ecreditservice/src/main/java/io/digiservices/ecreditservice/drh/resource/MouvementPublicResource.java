package io.digiservices.ecreditservice.drh.resource;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.digiservices.ecreditservice.drh.repository.MouvementRepository;
import io.digiservices.ecreditservice.drh.service.MouvementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;

/**
 * Connecteur UniFi Access — endpoints publics (chemin /ecredit/public/** en permitAll) :
 * - /webhook : la centrale de la porte pousse chaque badgeage (signature HMAC-SHA256
 *   « Signature: t=...,v1=... » calculée sur t + "." + corps avec le secret remis à
 *   l'enregistrement, stocké dans drh_parametre MOUVEMENT_WEBHOOK_SECRET) ;
 * - /unifi-users : le script du siège pousse le référentiel des users UniFi
 *   (employee_number = matricule), protégé par le même secret en en-tête.
 */
@RestController
@RequestMapping("/ecredit/public/drh/mouvements")
@RequiredArgsConstructor
@Slf4j
public class MouvementPublicResource {

    private final MouvementService mouvementService;
    private final MouvementRepository mouvementRepository;
    private final ObjectMapper objectMapper;

    @PostMapping("/webhook")
    public ResponseEntity<String> webhook(@RequestHeader(value = "Signature", required = false) String signature,
                                          @RequestBody byte[] corps) {
        String secret = mouvementRepository.parametreTexte("MOUVEMENT_WEBHOOK_SECRET", "");
        Long horodatage = verifierSignature(signature, corps, secret);
        if (horodatage == null) {
            log.warn("Webhook UniFi rejeté : signature absente/invalide ou secret non configuré");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("invalid signature");
        }
        try {
            mouvementService.traiterEvenementWebhook(horodatage, objectMapper.readTree(corps));
        } catch (Exception e) {
            // Toujours répondre 200 vite (timeout 5 s côté UniFi) — l'échec est journalisé
            log.error("Webhook UniFi : traitement en échec : {}", e.getMessage());
        }
        return ResponseEntity.ok("OK");
    }

    @PostMapping("/unifi-users")
    public ResponseEntity<String> unifiUsers(@RequestHeader(value = "X-Sync-Secret", required = false) String secretRecu,
                                             @RequestBody List<Map<String, Object>> users) {
        String secret = mouvementRepository.parametreTexte("MOUVEMENT_WEBHOOK_SECRET", "");
        if (secretInvalide(secret) || secretRecu == null || !MessageDigest.isEqual(
                secret.getBytes(StandardCharsets.UTF_8), secretRecu.getBytes(StandardCharsets.UTF_8))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("invalid secret");
        }
        int identifies = mouvementService.importerUsersUnifi(users);
        return ResponseEntity.ok("users=" + users.size() + " identifies=" + identifies);
    }

    private static boolean secretInvalide(String secret) {
        return secret == null || secret.isBlank() || "A_DEFINIR".equals(secret);
    }

    /** @return l'horodatage « t » si la signature est valide, sinon null. */
    private static Long verifierSignature(String enTete, byte[] corps, String secret) {
        if (enTete == null || secretInvalide(secret)) return null;
        Long t = null;
        String v1 = null;
        for (String paire : enTete.split(",")) {
            String[] kv = paire.strip().split("=", 2);
            if (kv.length != 2) continue;
            if ("t".equals(kv[0])) {
                try {
                    t = Long.parseLong(kv[1]);
                } catch (NumberFormatException ignored) {
                }
            } else if ("v1".equals(kv[0])) {
                v1 = kv[1];
            }
        }
        if (t == null || v1 == null) return null;
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            mac.update((t + ".").getBytes(StandardCharsets.UTF_8));
            byte[] attendu = mac.doFinal(corps);
            return MessageDigest.isEqual(attendu, HexFormat.of().parseHex(v1)) ? t : null;
        } catch (Exception e) {
            return null;
        }
    }
}
