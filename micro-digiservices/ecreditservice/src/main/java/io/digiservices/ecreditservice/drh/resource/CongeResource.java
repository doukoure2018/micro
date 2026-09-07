package io.digiservices.ecreditservice.drh.resource;

import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.drh.dto.CongeDtos.*;
import io.digiservices.ecreditservice.drh.dto.DrhDtos.MotifRequest;
import io.digiservices.ecreditservice.drh.service.CongeService;
import io.digiservices.ecreditservice.exception.ValidationException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Year;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

/** Module DRH — phase 2 : demandes de congé (circuit agent -> responsable -> DRH). */
@RestController
@RequestMapping("/ecredit/drh/conges")
@AllArgsConstructor
@Slf4j
public class CongeResource {

    private final CongeService congeService;
    private final UserClient userClient;

    private User user(Authentication authentication) {
        return userClient.getUserByUuid(authentication.getName());
    }

    private static int exercice(Integer exercice) {
        return exercice != null ? exercice : Year.now().getValue();
    }

    // ==================== Agent ====================

    @GetMapping("/solde")
    public ResponseEntity<Response> monSolde(@RequestParam(required = false) Integer exercice,
                                             Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("solde", congeService.monSolde(user(auth), exercice(exercice))),
                "Mon solde de congés", OK));
    }

    @GetMapping("/moi")
    public ResponseEntity<Response> mesDemandes(@RequestParam(required = false) Integer exercice,
                                                Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("demandes", congeService.mesDemandes(user(auth), exercice(exercice))),
                "Mes demandes de congé", OK));
    }

    @PostMapping
    public ResponseEntity<Response> creer(@Valid @RequestBody DemandeCongeRequest body,
                                          Authentication auth, HttpServletRequest req) {
        DemandeCongeDto d = congeService.creerDemande(user(auth), body);
        return ResponseEntity.status(CREATED).body(getResponse(req,
                Map.of("demande", d), "Demande de congé soumise à votre responsable", CREATED));
    }

    // ==================== Responsable ====================

    @GetMapping("/departement")
    public ResponseEntity<Response> demandesDepartement(@RequestParam(required = false) Integer exercice,
                                                        Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("demandes", congeService.demandesDeMonDepartement(user(auth), exercice(exercice))),
                "Demandes de congé du département", OK));
    }

    @PostMapping("/{demandeId}/accepter")
    public ResponseEntity<Response> accepter(@PathVariable Long demandeId,
                                             Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("demande", congeService.accepter(user(auth), demandeId)),
                "Demande acceptée — transmise à la DRH", OK));
    }

    @PostMapping("/{demandeId}/rejeter")
    public ResponseEntity<Response> rejeter(@PathVariable Long demandeId,
                                            @RequestBody MotifRequest body,
                                            Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("demande", congeService.rejeter(user(auth), demandeId, body.getMotif())),
                "Demande rejetée", OK));
    }

    @PostMapping("/{demandeId}/interrompre")
    public ResponseEntity<Response> interrompre(@PathVariable Long demandeId,
                                                @Valid @RequestBody InterruptionRequest body,
                                                Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("demande", congeService.interrompre(user(auth), demandeId, body)),
                "Congé interrompu — jours non consommés recrédités", OK));
    }

    @PostMapping("/{demandeId}/annuler")
    public ResponseEntity<Response> annuler(@PathVariable Long demandeId,
                                            @RequestBody MotifRequest body,
                                            Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("demande", congeService.annuler(user(auth), demandeId, body.getMotif())),
                "Congé annulé — jours recrédités", OK));
    }

    // ==================== DRH ====================

    @GetMapping("/a-valider")
    public ResponseEntity<Response> aValider(@RequestParam(required = false) Integer exercice,
                                             Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("demandes", congeService.demandesAValider(user(auth), exercice(exercice))),
                "Demandes de congé en attente de validation DRH", OK));
    }

    @PostMapping("/{demandeId}/valider")
    public ResponseEntity<Response> valider(@PathVariable Long demandeId,
                                            Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("demande", congeService.validerDrh(user(auth), demandeId)),
                "Congé validé", OK));
    }

    @PostMapping("/{demandeId}/renvoyer")
    public ResponseEntity<Response> renvoyer(@PathVariable Long demandeId,
                                             @RequestBody MotifRequest body,
                                             Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("demande", congeService.renvoyerDrh(user(auth), demandeId, body.getMotif())),
                "Demande renvoyée", OK));
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<Response> handleValidation(ValidationException e, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(getResponse(req,
                Map.of("error", e.getMessage()), e.getMessage(), HttpStatus.BAD_REQUEST));
    }
}
