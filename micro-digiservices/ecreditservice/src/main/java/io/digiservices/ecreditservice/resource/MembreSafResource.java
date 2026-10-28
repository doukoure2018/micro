package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.service.CorrectionNumeroMembreService;
import io.digiservices.ecreditservice.service.MembreSafService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/** Verification d'un numero de membre dans SAF production, appelee par les formulaires a la sortie du champ. */
@RestController
@RequestMapping("/ecredit/membres")
@RequiredArgsConstructor
public class MembreSafResource {

    private final MembreSafService service;
    private final CorrectionNumeroMembreService correction;

    /** Les dossiers en cours dont le numero est inconnu de SAF, dans le perimetre du compte. */
    @GetMapping("/inconnus")
    public ResponseEntity<Response> inconnus(@NotNull Authentication authentication, HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("inconnus", service.inconnus(authentication.getName())), "Dossiers inconnus de SAF", OK));
    }

    @GetMapping("/{numero}/verification")
    public ResponseEntity<Response> verifier(@NotNull Authentication authentication,
                                             @PathVariable("numero") String numero,
                                             HttpServletRequest request) {
        var v = service.verifier(numero);
        return ResponseEntity.ok(getResponse(request, Map.of("verification", v), v.getMessage(), OK));
    }

    /** Qui peut corriger le numero de ce dossier, et sinon pourquoi (V185). */
    @GetMapping("/dossiers/{demandeId}/numero/droit")
    public ResponseEntity<Response> droitCorrection(@NotNull Authentication authentication,
                                                    @PathVariable("demandeId") Long demandeId,
                                                    HttpServletRequest request) {
        var droit = correction.droit(authentication.getName(), demandeId);
        return ResponseEntity.ok(getResponse(request, Map.of("droit", droit),
                droit.peutCorriger() ? "Correction possible" : droit.motifRefus(), OK));
    }

    /**
     * Corrige le numero de membre d'un dossier. Le nouveau numero est confronte a SAF avant
     * d'etre ecrit ; la reponse porte le client que SAF a renvoye, pour que l'agent verifie
     * qu'il s'agit bien de la bonne personne.
     */
    @PostMapping("/dossiers/{demandeId}/numero")
    public ResponseEntity<Response> corrigerNumero(@NotNull Authentication authentication,
                                                   @PathVariable("demandeId") Long demandeId,
                                                   @RequestBody Map<String, String> corps,
                                                   HttpServletRequest request) {
        var v = correction.corriger(authentication.getName(), demandeId,
                corps.get("numero"), corps.get("motif"));
        return ResponseEntity.ok(getResponse(request, Map.of("verification", v),
                "Numéro corrigé : " + v.getNomClient(), OK));
    }
}
