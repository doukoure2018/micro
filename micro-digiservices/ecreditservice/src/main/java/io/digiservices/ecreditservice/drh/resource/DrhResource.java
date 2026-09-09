package io.digiservices.ecreditservice.drh.resource;

import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.drh.dto.DrhDtos.*;
import io.digiservices.ecreditservice.drh.service.DrhService;
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

/**
 * Module DRH — phase 1 : organisation par départements + prévisions de congés.
 * Les contrôles de rôle (DRH, responsable, membre) sont portés par DrhServiceImpl.
 */
@RestController
@RequestMapping("/ecredit/drh")
@AllArgsConstructor
@Slf4j
public class DrhResource {

    private final DrhService drhService;
    private final UserClient userClient;

    private User user(Authentication authentication) {
        return userClient.getUserByUuid(authentication.getName());
    }

    private static int exercice(Integer exercice) {
        return exercice != null ? exercice : Year.now().getValue();
    }

    // ==================== Contexte & organisation ====================

    @GetMapping("/contexte")
    public ResponseEntity<Response> contexte(Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("contexte", drhService.contexteDe(user(auth))),
                "Contexte DRH", OK));
    }

    @GetMapping("/departements")
    public ResponseEntity<Response> departements(HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("departements", drhService.listeDepartements()),
                "Liste des départements", OK));
    }

    @PostMapping("/departements")
    public ResponseEntity<Response> creerDepartement(@Valid @RequestBody DepartementRequest body,
                                                     Authentication auth, HttpServletRequest req) {
        exigerDrh(auth);
        Long id = drhService.creerDepartement(body);
        return ResponseEntity.status(CREATED).body(getResponse(req,
                Map.of("departementId", id), "Département créé", CREATED));
    }

    @PutMapping("/departements/{departementId}")
    public ResponseEntity<Response> modifierDepartement(@PathVariable Long departementId,
                                                        @Valid @RequestBody DepartementRequest body,
                                                        Authentication auth, HttpServletRequest req) {
        exigerDrh(auth);
        drhService.modifierDepartement(departementId, body);
        return ResponseEntity.ok(getResponse(req, Map.of("departementId", departementId),
                "Département modifié", OK));
    }

    @GetMapping("/departements/{departementId}/membres")
    public ResponseEntity<Response> membres(@PathVariable Long departementId, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("membres", drhService.listeMembres(departementId)),
                "Membres du département", OK));
    }

    @PostMapping("/membres")
    public ResponseEntity<Response> affecter(@Valid @RequestBody AffectationRequest body,
                                             Authentication auth, HttpServletRequest req) {
        exigerDrh(auth);
        Long membreId = drhService.affecterMembre(body);
        return ResponseEntity.status(CREATED).body(getResponse(req,
                Map.of("membreId", membreId), "Agent affecté au département", CREATED));
    }

    @DeleteMapping("/membres/{membreId}")
    public ResponseEntity<Response> retirer(@PathVariable Long membreId,
                                            Authentication auth, HttpServletRequest req) {
        exigerDrh(auth);
        drhService.retirerMembre(membreId);
        return ResponseEntity.ok(getResponse(req, Map.of("membreId", membreId),
                "Agent retiré du département", OK));
    }

    @GetMapping("/jours-feries")
    public ResponseEntity<Response> joursFeries(@RequestParam(required = false) Integer exercice,
                                                HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("joursFeries", drhService.joursFeries(exercice(exercice))),
                "Jours fériés de l'exercice", OK));
    }

    @GetMapping("/personnel/{matricule}")
    public ResponseEntity<Response> verifierMatricule(@PathVariable String matricule,
                                                      HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("personnel", drhService.verifierMatricule(matricule)),
                "Vérification du matricule", OK));
    }

    @GetMapping("/users-non-affectes")
    public ResponseEntity<Response> usersNonAffectes(Authentication auth, HttpServletRequest req) {
        exigerDrh(auth);
        return ResponseEntity.ok(getResponse(req,
                Map.of("users", drhService.usersNonAffectes()),
                "Utilisateurs sans département", OK));
    }

    // ==================== Prévision — agent ====================

    @GetMapping("/previsions/moi")
    public ResponseEntity<Response> maPrevision(@RequestParam(required = false) Integer exercice,
                                                Authentication auth, HttpServletRequest req) {
        PrevisionDto p = drhService.maPrevision(user(auth), exercice(exercice));
        return ResponseEntity.ok(getResponse(req,
                p == null ? Map.of() : Map.of("prevision", p),
                "Ma prévision", OK));
    }

    @PostMapping("/previsions")
    public ResponseEntity<Response> enregistrer(@Valid @RequestBody PrevisionRequest body,
                                                Authentication auth, HttpServletRequest req) {
        PrevisionDto p = drhService.enregistrerPrevision(user(auth), body);
        return ResponseEntity.ok(getResponse(req, Map.of("prevision", p),
                "Prévision enregistrée", OK));
    }

    @PostMapping("/previsions/soumettre")
    public ResponseEntity<Response> soumettre(@RequestParam(required = false) Integer exercice,
                                              Authentication auth, HttpServletRequest req) {
        PrevisionDto p = drhService.soumettre(user(auth), exercice(exercice));
        return ResponseEntity.ok(getResponse(req, Map.of("prevision", p),
                "Prévision soumise à votre responsable", OK));
    }

    // ==================== Prévision — responsable ====================

    @GetMapping("/previsions/departement")
    public ResponseEntity<Response> previsionsDepartement(@RequestParam(required = false) Integer exercice,
                                                          Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("previsions", drhService.previsionsDeMonDepartement(user(auth), exercice(exercice))),
                "Prévisions du département", OK));
    }

    @PostMapping("/previsions/{previsionId}/accepter")
    public ResponseEntity<Response> accepter(@PathVariable Long previsionId,
                                             Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("prevision", drhService.accepter(user(auth), previsionId)),
                "Prévision acceptée — transmise à la DRH", OK));
    }

    @PostMapping("/previsions/{previsionId}/rejeter")
    public ResponseEntity<Response> rejeter(@PathVariable Long previsionId,
                                            @RequestBody MotifRequest body,
                                            Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("prevision", drhService.rejeter(user(auth), previsionId, body.getMotif())),
                "Prévision rejetée", OK));
    }

    @PutMapping("/previsions/{previsionId}/reajuster")
    public ResponseEntity<Response> reajuster(@PathVariable Long previsionId,
                                              @Valid @RequestBody PrevisionRequest body,
                                              Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("prevision", drhService.reajuster(user(auth), previsionId, body)),
                "Prévision réajustée — transmise à la DRH", OK));
    }

    // ==================== Prévision — DRH ====================

    @GetMapping("/previsions/a-valider")
    public ResponseEntity<Response> aValider(@RequestParam(required = false) Integer exercice,
                                             Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("previsions", drhService.previsionsAValider(user(auth), exercice(exercice))),
                "Prévisions en attente de validation DRH", OK));
    }

    @GetMapping("/previsions/toutes")
    public ResponseEntity<Response> previsionsToutes(@RequestParam(required = false) Integer exercice,
                                                     @RequestParam(required = false) Long departementId,
                                                     Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("previsions", drhService.previsionsToutes(user(auth), exercice(exercice), departementId)),
                "Calendrier des prévisions du personnel", OK));
    }

    @PostMapping("/previsions/{previsionId}/valider")
    public ResponseEntity<Response> valider(@PathVariable Long previsionId,
                                            Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("prevision", drhService.validerDrh(user(auth), previsionId)),
                "Prévision validée — inscrite au calendrier", OK));
    }

    @PostMapping("/previsions/{previsionId}/renvoyer")
    public ResponseEntity<Response> renvoyer(@PathVariable Long previsionId,
                                             @RequestBody MotifRequest body,
                                             Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("prevision", drhService.renvoyerDrh(user(auth), previsionId, body.getMotif())),
                "Prévision renvoyée", OK));
    }

    // ==================== Gestion d'erreurs locale ====================

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<Response> handleValidation(ValidationException e, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(getResponse(req,
                Map.of("error", e.getMessage()), e.getMessage(), HttpStatus.BAD_REQUEST));
    }

    private void exigerDrh(Authentication auth) {
        if (!drhService.estHabiliteDrh(user(auth))) {
            throw new ValidationException("Action réservée à la DRH");
        }
    }
}
