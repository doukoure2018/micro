package io.digiservices.ecreditservice.resource;

import io.digiservices.clients.UserClient;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.service.SmsRepertoireService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/**
 * Répertoires de diffusion SMS (produit × segment), chargés en amont par le
 * responsable digital. Accès réservé au service DSIG (MANAGER) et au SUPER_ADMIN.
 */
@RestController
@AllArgsConstructor
@RequestMapping("/ecredit/sms/repertoires")
@Slf4j
public class SmsRepertoireResource {

    private final SmsRepertoireService smsRepertoireService;
    private final UserClient userClient;

    @GetMapping
    public ResponseEntity<Response> getRepertoires(Authentication authentication, HttpServletRequest httpRequest) {
        requireDigital(authentication);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("repertoires", smsRepertoireService.getRepertoires()),
                        "Repertoires recuperes", OK));
    }

    /** Vide puis recharge le répertoire depuis le fichier (transactionnel). */
    @PostMapping("/{repertoireId}/recharger")
    public ResponseEntity<Response> recharger(
            @PathVariable Long repertoireId,
            @RequestParam("fichier") MultipartFile fichier,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = requireDigital(authentication);
        String chargePar = user.getFirstName() + " " + user.getLastName();
        var rapport = smsRepertoireService.recharger(repertoireId, fichier, chargePar);
        return ResponseEntity.ok(
                getResponse(httpRequest,
                        Map.of("rapport", rapport, "repertoire", smsRepertoireService.getRepertoire(repertoireId)),
                        "Repertoire recharge", OK));
    }

    /**
     * Les numeros du repertoire, page par page, avec recherche. L'endpoint existait deja et
     * aucun ecran ne l'appelait : le responsable digital chargeait dix mille numeros sans
     * pouvoir en verifier un seul, ni repondre a un client demandant pourquoi il a recu un
     * message.
     */
    @GetMapping("/{repertoireId}/numeros")
    public ResponseEntity<Response> getNumeros(
            @PathVariable Long repertoireId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "50") int size,
            @RequestParam(name = "recherche", required = false) String recherche,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        requireDigital(authentication);
        return ResponseEntity.ok(
                getResponse(httpRequest,
                        Map.of("numerosPage", smsRepertoireService.getNumeros(repertoireId, page, size, recherche)),
                        "Numeros recuperes", OK));
    }

    /** Historique des chargements : journalise depuis aout, affiche depuis le lot 0. */
    @GetMapping("/{repertoireId}/chargements")
    public ResponseEntity<Response> getChargements(
            @PathVariable Long repertoireId,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        requireDigital(authentication);
        return ResponseEntity.ok(
                getResponse(httpRequest,
                        Map.of("chargements", smsRepertoireService.getChargements(repertoireId)),
                        "Historique des chargements", OK));
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
}
