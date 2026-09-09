package io.digiservices.ecreditservice.drh.resource;

import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.drh.service.PresenceService;
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

/** Module DRH — phase 4 : présences badgeuse (import, rapprochement, synthèse). */
@RestController
@RequestMapping("/ecredit/drh/presences")
@AllArgsConstructor
@Slf4j
public class PresenceResource {

    private final PresenceService presenceService;
    private final UserClient userClient;

    private User user(Authentication authentication) {
        return userClient.getUserByUuid(authentication.getName());
    }

    @PostMapping("/import")
    public ResponseEntity<Response> importer(@RequestParam("file") MultipartFile file,
                                             Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("resultat", presenceService.importerFichier(user(auth), file)),
                "Fichier badgeuse importé et rapproché", OK));
    }

    @GetMapping
    public ResponseEntity<Response> presences(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate du,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate au,
            @RequestParam(required = false) String statut,
            Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("presences", presenceService.presences(user(auth), du, au, statut)),
                "Présences de la période", OK));
    }

    @GetMapping("/synthese")
    public ResponseEntity<Response> synthese(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate du,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate au,
            Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("synthese", presenceService.synthese(user(auth), du, au)),
                "Synthèse des présences", OK));
    }

    @GetMapping("/non-rapproches")
    public ResponseEntity<Response> nonRapproches(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate du,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate au,
            Authentication auth, HttpServletRequest req) {
        return ResponseEntity.ok(getResponse(req,
                Map.of("pointages", presenceService.nonRapproches(user(auth), du, au)),
                "Pointages non rapprochés (visiteurs, matricules inconnus)", OK));
    }

    @PostMapping("/recalculer")
    public ResponseEntity<Response> recalculer(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate du,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate au,
            Authentication auth, HttpServletRequest req) {
        int jours = presenceService.recalculer(user(auth), du, au);
        return ResponseEntity.ok(getResponse(req,
                Map.of("joursRecalcules", jours),
                "Rapprochement recalculé sur " + jours + " jour(s) ouvré(s)", OK));
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<Response> handleValidation(ValidationException e, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(getResponse(req,
                Map.of("error", e.getMessage()), e.getMessage(), HttpStatus.BAD_REQUEST));
    }
}
