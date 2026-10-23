package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.service.RotationTransfertService;
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

/** Rotation guidee (V170) : transfert de charge avant rotation, et messages du DA a acquitter. */
@RestController
@RequestMapping("/ecredit/agents")
@RequiredArgsConstructor
public class RotationTransfertResource {

    private final RotationTransfertService service;

    /** Transfere toute la charge de l'agent {id} a versAgentUserId (meme point de service) ; motif libre. */
    @PostMapping("/{id}/transferer")
    public ResponseEntity<Response> transferer(@NotNull Authentication authentication, @PathVariable("id") Long id,
                                               @RequestBody Map<String, Object> body, HttpServletRequest request) {
        Long vers = body.get("versAgentUserId") == null ? null : Long.valueOf(String.valueOf(body.get("versAgentUserId")));
        if (vers == null) {
            throw new io.digiservices.ecreditservice.exception.ApiException("Choisissez l'agent qui recoit la charge");
        }
        Long nouveauPs = body.get("nouveauPointVenteId") == null ? null : Long.valueOf(String.valueOf(body.get("nouveauPointVenteId")));
        String motif = body.get("motif") == null ? null : String.valueOf(body.get("motif"));
        Map<String, Object> r = service.transferer(authentication.getName(), id, vers, motif, nouveauPs);
        return ResponseEntity.ok(getResponse(request, Map.of("transfert", r),
                r.get("nbDossiersCredit") + " dossier(s) de credit, " + r.get("nbDossiersAccueil") + " saisie(s) d'accueil, "
                        + r.get("nbPortefeuille") + " credit(s) SAF et " + r.get("nbDesignations") + " designation(s) transferes", OK));
    }

    @GetMapping("/transferts/a-acquitter")
    public ResponseEntity<Response> aAcquitter(@NotNull Authentication authentication, HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request, Map.of("transferts", service.aAcquitter(authentication.getName())), "Transferts", OK));
    }

    @GetMapping("/transferts/{id}/dossiers")
    public ResponseEntity<Response> dossiers(@NotNull Authentication authentication, @PathVariable("id") Long id, HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request, Map.of("dossiers", service.dossiers(authentication.getName(), id)), "Dossiers transferes", OK));
    }

    @PostMapping("/transferts/{id}/acquitter")
    public ResponseEntity<Response> acquitter(@NotNull Authentication authentication, @PathVariable("id") Long id, HttpServletRequest request) {
        service.acquitter(authentication.getName(), id);
        return ResponseEntity.ok(getResponse(request, Map.of("acquitte", true), "Message acquitte", OK));
    }
}
