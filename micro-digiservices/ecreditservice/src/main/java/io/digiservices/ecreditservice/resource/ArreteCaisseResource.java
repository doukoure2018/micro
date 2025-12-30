package io.digiservices.ecreditservice.resource;


import io.digiservices.clients.UserClient;
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
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.*;

@RestController
@RequestMapping("/ecredit/arrete-caisse")
@RequiredArgsConstructor
@Slf4j
public class ArreteCaisseResource {

    private final ArreteCaisseService arreteCaisseService;
    private final UserClient userClient;

    // ==================== GET ====================

    @GetMapping
    public ResponseEntity<Response> getAll(HttpServletRequest request) {
        log.info("API: Récupération de tous les arrêtés de caisse");
        List<ArreteCaisseDto> arretes = arreteCaisseService.getAll();
        return ResponseEntity.ok(getResponse(request, Map.of(
                "arretes", arretes,
                "total", arretes.size()
        ), "Liste des arrêtés de caisse récupérée", OK));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response> getById(@PathVariable(name = "id") Long id, HttpServletRequest request) {
        log.info("API: Récupération arrêté ID: {}", id);
        return arreteCaisseService.getById(id)
                .map(arrete -> ResponseEntity.ok(getResponse(request, Map.of("arrete", arrete), "Arrêté récupéré", OK)))
                .orElse(ResponseEntity.status(NOT_FOUND)
                        .body(getResponse(request, null, "Arrêté non trouvé", NOT_FOUND)));
    }

    @GetMapping("/me")
    public ResponseEntity<Response> getMyArretes(Authentication authentication, HttpServletRequest request) {
        User user = userClient.getUserByUuid(authentication.getName());
        log.info("API: Récupération mes arrêtés - User: {}", user.getUserId());

        List<ArreteCaisseDto> arretes = arreteCaisseService.getByUserId(user.getUserId());
        Map<String, Map<String, Object>> stats = arreteCaisseService.getStatsByUser(user.getUserId());

        return ResponseEntity.ok(getResponse(request, Map.of(
                "arretes", arretes,
                "total", arretes.size(),
                "stats", stats
        ), "Mes arrêtés récupérés", OK));
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<Response> getByStatut(@PathVariable(name = "statut") String statut, HttpServletRequest request) {
        log.info("API: Récupération arrêtés par statut: {}", statut);
        List<ArreteCaisseDto> arretes = arreteCaisseService.getByStatut(statut);
        return ResponseEntity.ok(getResponse(request, Map.of(
                "arretes", arretes,
                "total", arretes.size()
        ), "Arrêtés par statut récupérés", OK));
    }

    @GetMapping("/delegation/{delegationId}")
    public ResponseEntity<Response> getByDelegation(@PathVariable(name = "delegationId") Long delegationId, HttpServletRequest request) {
        log.info("API: Récupération arrêtés par délégation: {}", delegationId);
        List<ArreteCaisseDto> arretes = arreteCaisseService.getByDelegationId(delegationId);
        return ResponseEntity.ok(getResponse(request, Map.of(
                "arretes", arretes,
                "total", arretes.size()
        ), "Arrêtés par délégation récupérés", OK));
    }

    @GetMapping("/agence/{agenceId}")
    public ResponseEntity<Response> getByAgence(@PathVariable(name = "agenceId") Long agenceId, HttpServletRequest request) {
        log.info("API: Récupération arrêtés par agence: {}", agenceId);
        List<ArreteCaisseDto> arretes = arreteCaisseService.getByAgenceId(agenceId);
        return ResponseEntity.ok(getResponse(request, Map.of(
                "arretes", arretes,
                "total", arretes.size()
        ), "Arrêtés par agence récupérés", OK));
    }

    @GetMapping("/period")
    public ResponseEntity<Response> getByPeriod(
            @RequestParam(name = "dateDebut") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(name = "dateFin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin,
            HttpServletRequest request) {
        log.info("API: Récupération arrêtés période: {} - {}", dateDebut, dateFin);
        List<ArreteCaisseDto> arretes = arreteCaisseService.getByPeriod(dateDebut, dateFin);
        return ResponseEntity.ok(getResponse(request, Map.of(
                "arretes", arretes,
                "total", arretes.size()
        ), "Arrêtés par période récupérés", OK));
    }

    // ==================== CREATE ====================

    /**
     * Créer un arrêté SANS document (statut = ENCOURS)
     * Mobile
     */
    @PostMapping
    public ResponseEntity<Response> create(
            @RequestParam(name = "montant") BigDecimal montant,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateArreteCaisse,
            Authentication authentication,
            HttpServletRequest request) {

        User user = userClient.getUserByUuid(authentication.getName());
        log.info("API: Création arrêté sans document - User: {}, Montant: {}", user.getUserId(), montant);

        ArreteCaisseDto arrete = arreteCaisseService.create(user, montant, dateArreteCaisse);

        return ResponseEntity.status(CREATED)
                .body(getResponse(request, Map.of("arrete", arrete), "Arrêté créé avec succès (statut: ENCOURS)", CREATED));
    }

    /**
     * Créer un arrêté AVEC document (statut = VALIDE)
     */
    @PostMapping(value = "/with-document", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Response> createWithDocument(
            @RequestParam(name = "montant") BigDecimal montant,
            @RequestParam(name = "dateArreteCaisse") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateArreteCaisse,
            @RequestParam("document") MultipartFile document,
            Authentication authentication,
            HttpServletRequest request) {

        User user = userClient.getUserByUuid(authentication.getName());
        log.info("API: Création arrêté avec document - User: {}, Montant: {}", user.getUserId(), montant);

        ArreteCaisseDto arrete = arreteCaisseService.createWithDocument(user, montant, dateArreteCaisse, document);

        return ResponseEntity.status(CREATED)
                .body(getResponse(request, Map.of("arrete", arrete), "Arrêté créé et validé avec document", CREATED));
    }

    // ==================== UPDATE ====================

    /**
     * Téléverser le document pour un arrêté existant (ENCOURS → VALIDE)
     */
    @PostMapping(value = "/{id}/upload-document", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Response> uploadDocument(
            @PathVariable(name = "id") Long id,
            @RequestParam("document") MultipartFile document,
            Authentication authentication,
            HttpServletRequest request) {

        User user = userClient.getUserByUuid(authentication.getName());
        log.info("API: Upload document pour arrêté {} - User: {}", id, user.getUserId());

        ArreteCaisseDto arrete = arreteCaisseService.uploadDocument(id, user, document);

        return ResponseEntity.ok(getResponse(request, Map.of("arrete", arrete),
                "Document téléversé - Arrêté validé", OK));
    }

    /**
     * Modifier un arrêté (uniquement si ENCOURS)
     */
    @PutMapping("/{id}")
    public ResponseEntity<Response> update(
            @PathVariable(name = "id") Long id,
            @RequestParam(name = "montant") BigDecimal montant,
            @RequestParam(name = "dateArreteCaisse") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateArreteCaisse,
            Authentication authentication,
            HttpServletRequest request) {

        User user = userClient.getUserByUuid(authentication.getName());
        log.info("API: Mise à jour arrêté {} - User: {}", id, user.getUserId());

        ArreteCaisseDto arrete = arreteCaisseService.update(id, user, montant, dateArreteCaisse);

        return ResponseEntity.ok(getResponse(request, Map.of("arrete", arrete), "Arrêté mis à jour", OK));
    }

    // ==================== DELETE ====================

    @DeleteMapping("/{id}")
    public ResponseEntity<Response> delete(
            @PathVariable(name = "id") Long id,
            Authentication authentication,
            HttpServletRequest request) {

        User user = userClient.getUserByUuid(authentication.getName());
        log.info("API: Suppression arrêté {} - User: {}", id, user.getUserId());

        int deleted = arreteCaisseService.delete(id, user.getUserId());

        if (deleted > 0) {
            return ResponseEntity.ok(getResponse(request, Map.of("deleted", true), "Arrêté supprimé", OK));
        } else {
            return ResponseEntity.status(NOT_FOUND)
                    .body(getResponse(request, Map.of("deleted", false), "Arrêté non trouvé ou non autorisé", NOT_FOUND));
        }
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Response> deleteAdmin(@PathVariable(name = "id") Long id, HttpServletRequest request) {
        log.info("API: Suppression admin arrêté {}", id);

        int deleted = arreteCaisseService.deleteAdmin(id);

        if (deleted > 0) {
            return ResponseEntity.ok(getResponse(request, Map.of("deleted", true), "Arrêté supprimé par admin", OK));
        } else {
            return ResponseEntity.status(NOT_FOUND)
                    .body(getResponse(request, Map.of("deleted", false), "Arrêté non trouvé", NOT_FOUND));
        }
    }

    // ==================== STATS ====================

    @GetMapping("/stats")
    public ResponseEntity<Response> getStats(HttpServletRequest request) {
        log.info("API: Statistiques globales");
        Map<String, Map<String, Object>> stats = arreteCaisseService.getStatsByStatut();
        return ResponseEntity.ok(getResponse(request, Map.of("stats", stats), "Statistiques récupérées", OK));
    }

    @GetMapping("/stats/me")
    public ResponseEntity<Response> getMyStats(Authentication authentication, HttpServletRequest request) {
        User user = userClient.getUserByUuid(authentication.getName());
        log.info("API: Mes statistiques - User: {}", user.getUserId());

        Map<String, Map<String, Object>> stats = arreteCaisseService.getStatsByUser(user.getUserId());
        return ResponseEntity.ok(getResponse(request, Map.of("stats", stats), "Mes statistiques récupérées", OK));
    }
}