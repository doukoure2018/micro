package io.digiservices.ecreditservice.resource;

import io.digiservices.clients.UserClient;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.SmsOptoutDtos.SmsOptoutRequest;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.service.SmsOptoutService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/**
 * Desinscription SMS : poser une exclusion, la lever, chercher un numero.
 *
 * <p>Poser une exclusion est ouvert au meme cercle que les campagnes — celui qui recoit la
 * demande du client doit pouvoir l'enregistrer tout de suite. LEVER une exclusion est reserve
 * a l'administrateur : une exclusion doit etre plus facile a poser qu'a lever, sinon elle ne
 * protege personne.</p>
 */
@RestController
@RequestMapping("/ecredit/sms/optout")
@RequiredArgsConstructor
@Slf4j
public class SmsOptoutResource {

    private final SmsOptoutService service;
    private final UserClient userClient;

    /** Liste des exclusions actives, avec recherche par fragment de numero. */
    @GetMapping
    public ResponseEntity<Response> lister(@NotNull Authentication authentication,
                                           @RequestParam(required = false) String recherche,
                                           @RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "50") int size,
                                           HttpServletRequest request) {
        exigerDigital(authentication);
        return ResponseEntity.ok(getResponse(request, Map.of(
                        "exclusions", service.lister(recherche, page, size),
                        "syntheseOptout", service.synthese()),
                "Liste de désinscription", OK));
    }

    /** Etat et histoire d'un numero : exclu ou non, depuis quand, sur quelle demande. */
    @GetMapping("/{telephone}")
    public ResponseEntity<Response> rechercher(@NotNull Authentication authentication,
                                               @PathVariable String telephone,
                                               HttpServletRequest request) {
        exigerDigital(authentication);
        return ResponseEntity.ok(getResponse(request,
                Map.of("optout", service.rechercher(telephone)),
                "État du numéro", OK));
    }

    /** Pose une exclusion. Motif obligatoire. */
    @PostMapping
    public ResponseEntity<Response> exclure(@NotNull Authentication authentication,
                                            @RequestBody SmsOptoutRequest demande,
                                            HttpServletRequest request) {
        var user = exigerDigital(authentication);
        String par = user.getFirstName() + " " + user.getLastName();
        var etat = service.exclure(demande.telephone(), demande.origine(), demande.motif(), par);
        return ResponseEntity.ok(getResponse(request, Map.of("optout", etat),
                "Numéro retiré des campagnes", OK));
    }

    /**
     * Leve une exclusion. Reserve a l'administrateur, et le motif doit porter la demande du
     * client : on ne reinscrit personne par commodite.
     */
    @PostMapping("/lever")
    public ResponseEntity<Response> lever(@NotNull Authentication authentication,
                                          @RequestBody SmsOptoutRequest demande,
                                          HttpServletRequest request) {
        var user = userClient.getUserByUuid(authentication.getName());
        if (user == null || !"SUPER_ADMIN".equals(user.getRole())) {
            throw new ApiException("La levée d'une désinscription est réservée à l'administrateur");
        }
        service.lever(demande.telephone(), demande.motif(), user.getFirstName() + " " + user.getLastName());
        return ResponseEntity.ok(getResponse(request, Map.of("telephone", demande.telephone()),
                "Numéro réinscrit", OK));
    }

    /** Meme cercle que les repertoires et les campagnes : l'environnement digital. */
    private io.digiservices.clients.domain.User exigerDigital(Authentication authentication) {
        var user = userClient.getUserByUuid(authentication.getName());
        if (user == null) {
            throw new ApiException("Utilisateur non identifié");
        }
        boolean dsig = "MANAGER".equals(user.getRole()) && "DSIG".equalsIgnoreCase(user.getService());
        boolean superAdmin = "SUPER_ADMIN".equals(user.getRole());
        if (!dsig && !superAdmin) {
            throw new ApiException("Accès réservé à l'environnement digital (DSIG)");
        }
        return user;
    }
}
