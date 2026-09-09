package io.digiservices.ecreditservice.drh.resource;

import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.drh.service.MouvementService;
import io.digiservices.ecreditservice.exception.ValidationException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/** Module DRH — gestion des mouvements : journal des entrées/sorties de la porte. */
@RestController
@RequestMapping("/ecredit/drh/mouvements")
@AllArgsConstructor
@Slf4j
public class MouvementResource {

    private final MouvementService mouvementService;
    private final UserClient userClient;

    private User user(Authentication authentication) {
        return userClient.getUserByUuid(authentication.getName());
    }

    @PostMapping("/import")
    public ResponseEntity<Response> importer(@RequestParam("file") MultipartFile file,
                                             Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("resultat", mouvementService.importerFichier(user(auth), file)),
                "Journal des mouvements importé", OK));
    }

    @GetMapping
    public ResponseEntity<Response> mouvements(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate du,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate au,
            @RequestParam(required = false) String type,
            Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("mouvements", mouvementService.mouvements(user(auth), du, au, type)),
                "Mouvements de la période", OK));
    }

    @GetMapping("/synthese")
    public ResponseEntity<Response> synthese(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate du,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate au,
            Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("synthese", mouvementService.synthese(user(auth), du, au)),
                "Synthèse des mouvements par agent", OK));
    }

    @GetMapping("/personne/{matricule}")
    public ResponseEntity<Response> personne(
            @PathVariable String matricule,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate du,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate au,
            Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("agent", mouvementService.personne(user(auth), matricule, du, au)),
                "Mouvements de l'agent", OK));
    }

    @GetMapping("/badges")
    public ResponseEntity<Response> badges(Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("correspondances", mouvementService.correspondances(user(auth)),
                        "inconnus", mouvementService.badgesInconnus(user(auth))),
                "Correspondances badge - matricule", OK));
    }

    @PutMapping("/badges/{badgeNo}")
    public ResponseEntity<Response> associerBadge(@PathVariable String badgeNo,
                                                  @RequestParam String matricule,
                                                  Authentication auth, HttpServletRequest req) {
        int reidentifies = mouvementService.associerBadge(user(auth), badgeNo, matricule);
        return ResponseEntity.ok(getResponse(req,
                Map.of("mouvementsReidentifies", reidentifies),
                "Badge associé — " + reidentifies + " mouvement(s) ré-identifié(s)", OK));
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<Response> handleValidation(ValidationException e, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(getResponse(req,
                Map.of("error", e.getMessage()), e.getMessage(), HttpStatus.BAD_REQUEST));
    }
}
