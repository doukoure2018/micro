package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.EtatDocumentByDelegationDto;
import io.digiservices.ecreditservice.dto.EtatDocumentDetailDto;
import io.digiservices.ecreditservice.dto.EtatDocumentDto;
import io.digiservices.ecreditservice.dto.RejetEtatRequest;
import io.digiservices.ecreditservice.enumeration.StatutDocument;
import io.digiservices.ecreditservice.service.EtatDocumentBackofficeService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ecredit/backoffice")
@Slf4j
public class EtatDocumentBackofficeResource {

    private final EtatDocumentBackofficeService backofficeService;

    @GetMapping("/delegations")
    public ResponseEntity<Response> getAllDelegations(HttpServletRequest request) {
        log.info("GET /backoffice/delegations");
        var delegations = backofficeService.getAllDelegations();
        return ResponseEntity.ok(getResponse(request, Map.of(
                "delegations", delegations,
                "count", delegations.size()
        ), "Délégations récupérées avec succès", OK));
    }

    @GetMapping("/etats")
    public ResponseEntity<Response> getAllEtats(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            HttpServletRequest request) {
        log.info("GET /backoffice/etats - page: {}, size: {}", page, size);

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<EtatDocumentByDelegationDto> etats = backofficeService.getAllEtats(pageable);

        return ResponseEntity.ok(getResponse(request, Map.of(
                "etats", etats.getContent(),
                "page", etats.getNumber(),
                "totalPages", etats.getTotalPages(),
                "totalElements", etats.getTotalElements()
        ), "États de documents récupérés avec succès", OK));
    }

    @GetMapping("/delegations/{delegationId}/etats")
    public ResponseEntity<Response> getEtatsByDelegation(
            @PathVariable(name = "delegationId") Long delegationId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "statut", required = false) String statut,
            HttpServletRequest request) {
        log.info("GET /backoffice/delegations/{}/etats - statut: {}", delegationId, statut);

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<EtatDocumentByDelegationDto> etats;

        if (statut != null && !statut.isEmpty()) {
            StatutDocument statutEnum = StatutDocument.valueOf(statut.toUpperCase());
            etats = backofficeService.getEtatsByDelegationAndStatut(delegationId, statutEnum, pageable);
        } else {
            etats = backofficeService.getEtatsByDelegation(delegationId, pageable);
        }

        return ResponseEntity.ok(getResponse(request, Map.of(
                "etats", etats.getContent(),
                "page", etats.getNumber(),
                "totalPages", etats.getTotalPages(),
                "totalElements", etats.getTotalElements()
        ), "États de documents récupérés avec succès", OK));
    }

    @GetMapping("/etats/{id}/detail")
    public ResponseEntity<Response> getEtatDetail(
            @PathVariable(name = "id") Long id,
            HttpServletRequest request) {
        log.info("GET /backoffice/etats/{}/detail", id);

        EtatDocumentDetailDto detail = backofficeService.getEtatDetail(id);

        return ResponseEntity.ok(getResponse(request, Map.of(
                "etat", detail
        ), "Détail de l'état récupéré avec succès", OK));
    }

    @PutMapping("/etats/{id}/valider")
    public ResponseEntity<Response> validerEtat(
            @PathVariable(name = "id") Long id,
            HttpServletRequest request) {
        log.info("PUT /backoffice/etats/{}/valider", id);

        EtatDocumentDto etat = backofficeService.validerEtat(id);

        return ResponseEntity.ok(getResponse(request, Map.of(
                "etat", etat
        ), "État validé avec succès", OK));
    }

    /**
     * Rejeter un état - Motif obligatoire
     */
    @PutMapping("/etats/{id}/rejeter")
    public ResponseEntity<Response> rejeterEtat(
            @PathVariable(name = "id") Long id,
            @Valid @RequestBody RejetEtatRequest rejetRequest,
            HttpServletRequest request) {
        log.info("PUT /backoffice/etats/{}/rejeter - motif: {}", id, rejetRequest.getMotif());

        EtatDocumentDto etat = backofficeService.rejeterEtat(id, rejetRequest.getMotif());

        return ResponseEntity.ok(getResponse(request, Map.of(
                "etat", etat
        ), "État rejeté avec succès", OK));
    }

    @PutMapping("/etats/{id}/accepter")
    public ResponseEntity<Response> accepterEtat(
            @PathVariable(name = "id") Long id,
            HttpServletRequest request) {
        log.info("PUT /backoffice/etats/{}/accepter", id);

        EtatDocumentDto etat = backofficeService.accepterEtat(id);

        return ResponseEntity.ok(getResponse(request, Map.of(
                "etat", etat
        ), "État accepté avec succès", OK));
    }

    @GetMapping("/stats")
    public ResponseEntity<Response> getStatsByDelegation(HttpServletRequest request) {
        log.info("GET /backoffice/stats");

        var stats = backofficeService.getStatsByDelegation();

        return ResponseEntity.ok(getResponse(request, Map.of(
                "statistics", stats
        ), "Statistiques récupérées avec succès", OK));
    }
}