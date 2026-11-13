package io.digiservices.ecreditservice.mobile.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.mobile.dto.MobileDtos.LotRecu;
import io.digiservices.ecreditservice.mobile.service.MobileService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/**
 * Les points d'entrée de l'application mobile des agents de crédit (lot 1 : recouvrement).
 *
 * <p>Un seul préfixe, {@code /ecredit/mobile}, pour que la passerelle et les journaux
 * distinguent d'un coup d'œil ce qui vient d'un téléphone. Aucun identifiant d'agent n'est
 * accepté en paramètre : le compte est celui du jeton, et le service en déduit le périmètre.</p>
 *
 * <p>Les réponses gardent l'enveloppe commune de la plateforme : l'application lit la même
 * forme que les écrans web, et une erreur se présente partout de la même façon.</p>
 */
@RestController
@RequestMapping("/ecredit/mobile")
@RequiredArgsConstructor
public class MobileResource {

    private final MobileService service;

    /** Le profil affiché en tête de l'application, et gardé hors ligne. */
    @GetMapping("/moi")
    public ResponseEntity<Response> moi(@NotNull Authentication authentication,
                                        HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("profil", service.profil(authentication.getName())),
                "Profil de l'agent", OK));
    }

    /** Les crédits affectés à l'agent, avec leur situation SAF et le suivi de digi. */
    @GetMapping("/portefeuille")
    public ResponseEntity<Response> portefeuille(@NotNull Authentication authentication,
                                                 HttpServletRequest request) {
        var credits = service.portefeuille(authentication.getName());
        return ResponseEntity.ok(getResponse(request,
                Map.of("credits", credits, "nombre", credits.size()),
                "Portefeuille de l'agent", OK));
    }

    /**
     * Les listes fermées, servies par différence : le téléphone envoie la date de sa dernière
     * synchronisation et ne reçoit que ce qui a changé depuis.
     */
    @GetMapping("/referentiels")
    public ResponseEntity<Response> referentiels(
            @NotNull Authentication authentication,
            @RequestParam(name = "depuis", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime depuis,
            HttpServletRequest request) {
        var entrees = service.referentiels(authentication.getName(), depuis);
        return ResponseEntity.ok(getResponse(request,
                Map.of("referentiels", entrees, "nombre", entrees.size()),
                "Listes de reference", OK));
    }

    /** Les visites déjà enregistrées sur un crédit, telles que la fiche les montre. */
    @GetMapping("/credits/{codAgencia}/{numCredito}/visites")
    public ResponseEntity<Response> visites(@NotNull Authentication authentication,
                                            @PathVariable String codAgencia,
                                            @PathVariable Long numCredito,
                                            HttpServletRequest request) {
        var visites = service.visitesDuCredit(authentication.getName(), codAgencia, numCredito);
        return ResponseEntity.ok(getResponse(request, Map.of("visites", visites),
                "Visites du credit", OK));
    }

    /**
     * Reçoit un lot de saisies faites hors ligne.
     *
     * <p>Rejouable : une saisie déjà reçue revient « doublon » et n'est pas écrite deux fois.
     * La réponse donne le sort de chaque saisie, pour que le téléphone vide sa file sans
     * deviner.</p>
     */
    @PostMapping("/sync")
    public ResponseEntity<Response> synchroniser(@NotNull Authentication authentication,
                                                 @RequestBody LotRecu lot,
                                                 HttpServletRequest request) {
        var traite = service.synchroniser(authentication.getName(), lot);
        return ResponseEntity.ok(getResponse(request, Map.of("lot", traite),
                traite.acceptees() + " saisie(s) transmise(s), " + traite.refusees() + " refusee(s)",
                OK));
    }

    /** Déclare le téléphone, ou le réveille : c'est lui qui recevra les notifications. */
    @PostMapping("/appareils")
    public ResponseEntity<Response> declarerAppareil(
            @NotNull Authentication authentication,
            @RequestParam(name = "jeton") String jeton,
            @RequestParam(name = "plateforme") String plateforme,
            @RequestParam(name = "modele", required = false) String modele,
            @RequestParam(name = "version", required = false) String version,
            HttpServletRequest request) {
        Long id = service.declarerAppareil(authentication.getName(), jeton, plateforme, modele, version);
        return ResponseEntity.ok(getResponse(request, Map.of("appareilId", id),
                "Appareil declare", OK));
    }

    /** À la déconnexion : ce téléphone ne reçoit plus rien. */
    @DeleteMapping("/appareils")
    public ResponseEntity<Response> retirerAppareil(@NotNull Authentication authentication,
                                                    @RequestParam(name = "jeton") String jeton,
                                                    HttpServletRequest request) {
        service.retirerAppareil(authentication.getName(), jeton);
        return ResponseEntity.ok(getResponse(request, Map.of(), "Appareil retire", OK));
    }
}
