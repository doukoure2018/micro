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

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<Response> handleValidation(ValidationException e, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(getResponse(req,
                Map.of("error", e.getMessage()), e.getMessage(), HttpStatus.BAD_REQUEST));
    }
}
