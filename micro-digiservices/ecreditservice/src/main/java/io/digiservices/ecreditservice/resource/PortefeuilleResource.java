package io.digiservices.ecreditservice.resource;

import io.digiservices.clients.EbankingPortefeuilleClient;
import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.exception.ApiException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Set;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/**
 * Suivi du portefeuille credits SAF (phase 1) : vue lecture seule des credits mis en
 * place dans SAF2000, par agence SAF, avec indicateurs (encours, PAR 30/90, impayes)
 * et echeancier detaille. Donnees servies par ebanking (/ebanking/portefeuille/**).
 *
 * <p>Acces : agents de credit et niveaux de direction (DA, DR, DG, MANAGER du service DE).
 * Phase 1 : le perimetre (agence SAF) est choisi a l'ecran ; le verrouillage
 * agence digi <-> agence SAF viendra avec la table de correspondance (phase 2).</p>
 */
@RestController
@RequestMapping("/ecredit/portefeuille")
@AllArgsConstructor
@Slf4j
public class PortefeuilleResource {

    private static final Set<String> ROLES_AUTORISES = Set.of("AGENT_CREDIT", "DA", "DR", "DG", "SUPER_ADMIN");

    private final EbankingPortefeuilleClient portefeuilleClient;
    private final UserClient userClient;

    @GetMapping("/agences")
    public ResponseEntity<Response> getAgences(@NotNull Authentication authentication, HttpServletRequest request) {
        requireNiveauDirection(authentication);
        return ResponseEntity.ok(getResponse(request,
                Map.of("agences", portefeuilleClient.getAgences()),
                "Agences SAF", OK));
    }

    @GetMapping("/credits")
    public ResponseEntity<Response> getCredits(
            @NotNull Authentication authentication,
            @RequestParam(name = "codAgencia") String codAgencia,
            @RequestParam(name = "statut", defaultValue = "actifs") String statut,
            @RequestParam(name = "recherche", required = false) String recherche,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size,
            HttpServletRequest request) {
        requireNiveauDirection(authentication);
        return ResponseEntity.ok(getResponse(request,
                Map.of("credits", portefeuilleClient.getCredits(codAgencia, statut, recherche, page, size)),
                "Portefeuille credits SAF", OK));
    }

    @GetMapping("/indicateurs")
    public ResponseEntity<Response> getIndicateurs(
            @NotNull Authentication authentication,
            @RequestParam(name = "codAgencia") String codAgencia,
            HttpServletRequest request) {
        requireNiveauDirection(authentication);
        return ResponseEntity.ok(getResponse(request,
                Map.of("indicateurs", portefeuilleClient.getIndicateurs(codAgencia)),
                "Indicateurs du portefeuille", OK));
    }

    @GetMapping("/credits/{codAgencia}/{numCredito}/echeancier")
    public ResponseEntity<Response> getEcheancier(
            @NotNull Authentication authentication,
            @PathVariable("codAgencia") String codAgencia,
            @PathVariable("numCredito") Long numCredito,
            HttpServletRequest request) {
        requireNiveauDirection(authentication);
        return ResponseEntity.ok(getResponse(request,
                Map.of("echeancier", portefeuilleClient.getEcheancier(codAgencia, numCredito)),
                "Echeancier du credit", OK));
    }

    /** AGENT_CREDIT, DA, DR, DG, SUPER_ADMIN, ou MANAGER du service DE. */
    private void requireNiveauDirection(Authentication authentication) {
        User user = userClient.getUserByUuid(authentication.getName());
        if (user == null) {
            throw new ApiException("Utilisateur non identifie");
        }
        if (ROLES_AUTORISES.contains(user.getRole())) {
            return;
        }
        if ("MANAGER".equals(user.getRole()) && "DE".equalsIgnoreCase(user.getService())) {
            return;
        }
        throw new ApiException("Acces reserve aux agents de credit et niveaux de direction");
    }
}
