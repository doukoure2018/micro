package io.digiservices.ecreditservice.drh.resource;

import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.drh.dto.DrhDtos.MotifRequest;
import io.digiservices.ecreditservice.drh.dto.PermissionDtos.*;
import io.digiservices.ecreditservice.drh.service.PermissionService;
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

/** Module DRH — phase 3 : permission sociale (sans prévision, même circuit que le congé). */
@RestController
@RequestMapping("/ecredit/drh/permissions")
@AllArgsConstructor
@Slf4j
public class PermissionResource {

    private final PermissionService permissionService;
    private final UserClient userClient;

    private User user(Authentication authentication) {
        return userClient.getUserByUuid(authentication.getName());
    }

    private static int exercice(Integer exercice) {
        return exercice != null ? exercice : Year.now().getValue();
    }

    @GetMapping("/quota")
    public ResponseEntity<Response> monQuota(@RequestParam(required = false) Integer exercice,
                                             Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("quota", permissionService.monQuota(user(auth), exercice(exercice))),
                "Mon quota de permissions", OK));
    }

    @GetMapping("/moi")
    public ResponseEntity<Response> mesPermissions(@RequestParam(required = false) Integer exercice,
                                                   Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("permissions", permissionService.mesPermissions(user(auth), exercice(exercice))),
                "Mes permissions sociales", OK));
    }

    @PostMapping
    public ResponseEntity<Response> creer(@Valid @RequestBody PermissionRequest body,
                                          Authentication auth, HttpServletRequest req) {
        PermissionDto p = permissionService.creerPermission(user(auth), body);
        return ResponseEntity.status(CREATED).body(getResponse(req,
                Map.of("permission", p), "Permission sociale soumise à votre responsable", CREATED));
    }

    @PostMapping("/{permissionId}/annuler")
    public ResponseEntity<Response> annuler(@PathVariable Long permissionId,
                                            @RequestBody MotifRequest body,
                                            Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("permission", permissionService.annuler(user(auth), permissionId, body.getMotif())),
                "Permission annulée", OK));
    }

    @GetMapping("/departement")
    public ResponseEntity<Response> permissionsDepartement(@RequestParam(required = false) Integer exercice,
                                                           Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("permissions", permissionService.permissionsDeMonDepartement(user(auth), exercice(exercice))),
                "Permissions du département", OK));
    }

    @PostMapping("/{permissionId}/accepter")
    public ResponseEntity<Response> accepter(@PathVariable Long permissionId,
                                             Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("permission", permissionService.accepter(user(auth), permissionId)),
                "Permission acceptée — transmise à la DRH", OK));
    }

    @PostMapping("/{permissionId}/rejeter")
    public ResponseEntity<Response> rejeter(@PathVariable Long permissionId,
                                            @RequestBody MotifRequest body,
                                            Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("permission", permissionService.rejeter(user(auth), permissionId, body.getMotif())),
                "Permission rejetée", OK));
    }

    @GetMapping("/a-valider")
    public ResponseEntity<Response> aValider(@RequestParam(required = false) Integer exercice,
                                             Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("permissions", permissionService.permissionsAValider(user(auth), exercice(exercice))),
                "Permissions en attente de validation DRH", OK));
    }

    @PostMapping("/{permissionId}/valider")
    public ResponseEntity<Response> valider(@PathVariable Long permissionId,
                                            Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("permission", permissionService.validerDrh(user(auth), permissionId)),
                "Permission validée", OK));
    }

    @PostMapping("/{permissionId}/renvoyer")
    public ResponseEntity<Response> renvoyer(@PathVariable Long permissionId,
                                             @RequestBody MotifRequest body,
                                             Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("permission", permissionService.renvoyerDrh(user(auth), permissionId, body.getMotif())),
                "Permission renvoyée", OK));
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<Response> handleValidation(ValidationException e, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(getResponse(req,
                Map.of("error", e.getMessage()), e.getMessage(), HttpStatus.BAD_REQUEST));
    }
}
