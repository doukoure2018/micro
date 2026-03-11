package io.digiservices.ecreditservice.resource;

import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.AgenceDto;
import io.digiservices.clients.domain.DelegationDto;
import io.digiservices.clients.domain.PointVenteDto;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.ArreteCaisseDto;
import io.digiservices.ecreditservice.service.ArreteCaisseService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.*;

/**
 * Endpoints publics (sans authentification) pour :
 * - Power BI
 * - Formulaire web de remontee d'arrete de caisse par les agents
 */
@RestController
@RequestMapping("/ecredit/public/arrete-caisse")
@RequiredArgsConstructor
@Slf4j
public class PublicArreteCaisseResource {

    private final ArreteCaisseService arreteCaisseService;
    private final UserClient userClient;

    // ==================== POWER BI ====================

    @GetMapping("/latest")
    public ResponseEntity<Response> getLatestByPointvente(HttpServletRequest request) {
        log.info("API PUBLIC: Recuperation derniers arretes par point de vente (Power BI)");
        List<ArreteCaisseDto> arretes = arreteCaisseService.findLatestByPointvente();
        return ResponseEntity.ok(getResponse(request, Map.of(
                "arretes", arretes,
                "total", arretes.size()
        ), "Derniers arretes recuperes", OK));
    }

    // ==================== LOOKUPS POUR LE FORMULAIRE ====================

    @GetMapping("/delegations")
    public ResponseEntity<Response> getAllDelegations(HttpServletRequest request) {
        log.info("API PUBLIC: Liste des delegations");
        List<DelegationDto> delegations = userClient.getAllDelegationOffLine();
        return ResponseEntity.ok(getResponse(request, Map.of(
                "delegations", delegations
        ), "Delegations recuperees", OK));
    }

    @GetMapping("/agences/{delegationId}")
    public ResponseEntity<Response> getAgencesByDelegation(
            @PathVariable(name = "delegationId") Long delegationId,
            HttpServletRequest request) {
        log.info("API PUBLIC: Agences pour delegation {}", delegationId);
        List<AgenceDto> allAgences = userClient.allAgenceOfLine();
        List<AgenceDto> filtered = allAgences.stream()
                .filter(a -> delegationId.equals(a.getDelegation_id()))
                .toList();
        return ResponseEntity.ok(getResponse(request, Map.of(
                "agences", filtered
        ), "Agences recuperees", OK));
    }

    @GetMapping("/pointventes/{agenceId}")
    public ResponseEntity<Response> getPointVentesByAgence(
            @PathVariable(name = "agenceId") Long agenceId,
            HttpServletRequest request) {
        log.info("API PUBLIC: Points de vente pour agence {}", agenceId);
        List<PointVenteDto> pointVentes = userClient.getAllPointVentes(agenceId);
        return ResponseEntity.ok(getResponse(request, Map.of(
                "pointVentes", pointVentes
        ), "Points de vente recuperes", OK));
    }

    // ==================== RECHERCHE UTILISATEUR ====================

    @GetMapping("/find-user")
    public ResponseEntity<Response> findUserByUsername(
            @RequestParam(name = "username") String username,
            HttpServletRequest request) {
        log.info("API PUBLIC: Recherche utilisateur par username: {}", username);
        try {
            User user = userClient.getUserById(Long.parseLong(username));
            return ResponseEntity.ok(getResponse(request, Map.of(
                    "userId", user.getUserId(),
                    "fullName", user.getFirstName() + " " + user.getLastName(),
                    "delegationId", user.getDelegationId() != null ? user.getDelegationId() : 0,
                    "agenceId", user.getAgenceId() != null ? user.getAgenceId() : 0,
                    "pointventeId", user.getPointventeId() != null ? user.getPointventeId() : 0
            ), "Utilisateur trouve", OK));
        } catch (Exception e) {
            log.error("Utilisateur non trouve: {}", username);
            return ResponseEntity.status(NOT_FOUND)
                    .body(getResponse(request, null, "Utilisateur non trouve", NOT_FOUND));
        }
    }

    // ==================== ARRETES EN COURS (pour reprise) ====================

    @GetMapping("/encours/{userId}")
    public ResponseEntity<Response> getArretesEncours(
            @PathVariable(name = "userId") Long userId,
            HttpServletRequest request) {
        log.info("API PUBLIC: Arretes ENCOURS pour user {}", userId);
        List<ArreteCaisseDto> arretes = arreteCaisseService.getByUserId(userId).stream()
                .filter(a -> "ENCOURS".equals(a.getStatut()))
                .toList();
        return ResponseEntity.ok(getResponse(request, Map.of(
                "arretes", arretes,
                "total", arretes.size()
        ), "Arretes en cours recuperes", OK));
    }

    // ==================== CREATION ====================

    /**
     * Creer un arrete SANS document (statut = ENCOURS)
     */
    @PostMapping
    public ResponseEntity<Response> createPublic(
            @RequestParam(name = "userId", required = false) Long userId,
            @RequestParam(name = "montant") BigDecimal montant,
            @RequestParam(name = "dateArreteCaisse") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateArreteCaisse,
            @RequestParam(name = "delegationId") Long delegationId,
            @RequestParam(name = "agenceId") Long agenceId,
            @RequestParam(name = "pointventeId") Long pointventeId,
            HttpServletRequest request) {

        log.info("API PUBLIC: Creation arrete sans document - User: {}, Montant: {}", userId, montant);

        try {
            User user;
            if (userId != null) {
                user = userClient.getUserById(userId);
            } else {
                user = new User();
            }
            // Surcharger la localisation avec les valeurs du formulaire
            user.setDelegationId(delegationId);
            user.setAgenceId(agenceId);
            user.setPointventeId(pointventeId);

            ArreteCaisseDto arrete = arreteCaisseService.create(user, montant, dateArreteCaisse);

            return ResponseEntity.status(CREATED)
                    .body(getResponse(request, Map.of("arrete", arrete),
                            "Arrete cree avec succes (statut: ENCOURS)", CREATED));
        } catch (Exception e) {
            log.error("Erreur creation arrete public: {}", e.getMessage());
            return ResponseEntity.status(BAD_REQUEST)
                    .body(getResponse(request, null, e.getMessage(), BAD_REQUEST));
        }
    }

    /**
     * Creer un arrete AVEC document (statut = VALIDE)
     */
    @PostMapping(value = "/with-document", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Response> createWithDocumentPublic(
            @RequestParam(name = "userId", required = false) Long userId,
            @RequestParam(name = "montant") BigDecimal montant,
            @RequestParam(name = "dateArreteCaisse") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateArreteCaisse,
            @RequestParam(name = "delegationId") Long delegationId,
            @RequestParam(name = "agenceId") Long agenceId,
            @RequestParam(name = "pointventeId") Long pointventeId,
            @RequestParam("document") MultipartFile document,
            HttpServletRequest request) {

        log.info("API PUBLIC: Creation arrete avec document - User: {}, Montant: {}", userId, montant);

        try {
            User user;
            if (userId != null) {
                user = userClient.getUserById(userId);
            } else {
                user = new User();
            }
            user.setDelegationId(delegationId);
            user.setAgenceId(agenceId);
            user.setPointventeId(pointventeId);

            ArreteCaisseDto arrete = arreteCaisseService.createWithDocument(user, montant, dateArreteCaisse, document);

            return ResponseEntity.status(CREATED)
                    .body(getResponse(request, Map.of("arrete", arrete),
                            "Arrete cree et valide avec document", CREATED));
        } catch (Exception e) {
            log.error("Erreur creation arrete public avec document: {}", e.getMessage());
            return ResponseEntity.status(BAD_REQUEST)
                    .body(getResponse(request, null, e.getMessage(), BAD_REQUEST));
        }
    }

    /**
     * Upload document pour un arrete existant ENCOURS
     */
    @PostMapping(value = "/{id}/upload-document", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Response> uploadDocumentPublic(
            @PathVariable(name = "id") Long id,
            @RequestParam(name = "userId") Long userId,
            @RequestParam("document") MultipartFile document,
            HttpServletRequest request) {

        log.info("API PUBLIC: Upload document pour arrete {} - User: {}", id, userId);

        try {
            User user = userClient.getUserById(userId);
            ArreteCaisseDto arrete = arreteCaisseService.uploadDocument(id, user, document);

            return ResponseEntity.ok(getResponse(request, Map.of("arrete", arrete),
                    "Document televerse - Arrete valide", OK));
        } catch (Exception e) {
            log.error("Erreur upload document public: {}", e.getMessage());
            return ResponseEntity.status(BAD_REQUEST)
                    .body(getResponse(request, null, e.getMessage(), BAD_REQUEST));
        }
    }
}
