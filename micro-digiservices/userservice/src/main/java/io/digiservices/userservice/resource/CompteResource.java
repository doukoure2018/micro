package io.digiservices.userservice.resource;

import io.digiservices.userservice.domain.Response;
import io.digiservices.userservice.service.CompteBlocageService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

import static io.digiservices.userservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/** Blocage definitif des comptes (V182), reserve au SUPER_ADMIN. */
@RestController
@RequestMapping("/user/comptes")
@RequiredArgsConstructor
public class CompteResource {

    private final CompteBlocageService service;

    /** Corps : {"bloquer": true|false, "motif": "..."} ; le motif est obligatoire pour bloquer. */
    @PreAuthorize("hasAuthority('SUPER_ADMIN')")
    @PutMapping("/{userId}/blocage")
    public ResponseEntity<Response> blocage(@NotNull Authentication authentication,
                                            @PathVariable("userId") Long userId,
                                            @RequestBody Map<String, Object> corps,
                                            HttpServletRequest request) {
        boolean bloquer = !Boolean.FALSE.equals(corps.get("bloquer"));
        String motif = corps.get("motif") == null ? null : String.valueOf(corps.get("motif"));
        var user = bloquer ? service.bloquer(authentication.getName(), userId, motif)
                : service.debloquer(authentication.getName(), userId, motif);
        return ResponseEntity.ok(getResponse(request, Map.of("user", user),
                bloquer ? "Compte bloqué" : "Compte débloqué", OK));
    }

    @PreAuthorize("hasAuthority('SUPER_ADMIN')")
    @GetMapping("/{userId}/journal")
    public ResponseEntity<Response> journal(@NotNull Authentication authentication,
                                            @PathVariable("userId") Long userId,
                                            HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("journal", service.journal(authentication.getName(), userId)), "Journal du compte", OK));
    }

    /**
     * Pour la passerelle, qui la relit toutes les trente secondes : les identifiants des comptes
     * bloques, sans aucun autre renseignement. Ouvert sans jeton cote service, mais hors de la
     * liste publique de la passerelle : il n'est joignable que depuis le reseau interne.
     */
    @GetMapping("/bloques")
    public List<String> bloques() {
        return service.uuidsBloques();
    }
}
