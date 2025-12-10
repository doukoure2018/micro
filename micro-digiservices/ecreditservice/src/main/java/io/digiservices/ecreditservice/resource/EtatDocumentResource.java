package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.EtatDocumentDto;
import io.digiservices.ecreditservice.dto.UpdateEtatDocumentDto;
import io.digiservices.ecreditservice.enumeration.StatutDocument;
import io.digiservices.ecreditservice.service.EtatDocumentService;
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

import java.net.URI;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ecredit/etats-documents")
@Slf4j
public class EtatDocumentResource {

    private final EtatDocumentService etatDocumentService;

    @PostMapping
    public ResponseEntity<Response> createEtat(
            @Valid @RequestBody EtatDocumentDto dto,
            HttpServletRequest request) {
        log.info("Création d'un nouvel état de document");
        EtatDocumentDto created = etatDocumentService.createEtat(dto);
        return ResponseEntity.created(getUri(created.getId()))
                .body(getResponse(request, Map.of("etat", created), "État du document créé avec succès", CREATED));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Response> updateEtatStatut(
            @PathVariable(name = "id") Long id,
            @Valid @RequestBody UpdateEtatDocumentDto dto,
            HttpServletRequest request) {
        log.info("Mise à jour du statut de l'état du document ID: {}", id);
        EtatDocumentDto updated = etatDocumentService.updateEtatStatut(id, dto);
        return ResponseEntity.ok(getResponse(request, Map.of("etat", updated), "Statut mis à jour avec succès", OK));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response> getEtatById(
            @PathVariable(name = "id") Long id,
            HttpServletRequest request) {
        log.info("Récupération de l'état du document ID: {}", id);
        EtatDocumentDto etat = etatDocumentService.getEtatById(id);
        return ResponseEntity.ok(getResponse(request, Map.of("etat", etat), "État du document récupéré avec succès", OK));
    }

    @GetMapping
    public ResponseEntity<Response> getAllEtatsByDate(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            HttpServletRequest request) {
        log.info("Récupération de tous les états de documents - page: {}, size: {}", page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<EtatDocumentDto> etats = etatDocumentService.getAllEtatsByDate(pageable);
        return ResponseEntity.ok(getResponse(request, Map.of(
                "etats", etats.getContent(),
                "page", etats.getNumber(),
                "totalPages", etats.getTotalPages(),
                "totalElements", etats.getTotalElements()
        ), "États de documents récupérés avec succès", OK));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Response> getEtatsByUserId(
            @PathVariable(name = "userId") Long userId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            HttpServletRequest request) {
        log.info("Récupération des états de documents pour l'utilisateur: {}", userId);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<EtatDocumentDto> etats = etatDocumentService.getEtatsByUserId(userId, pageable);
        return ResponseEntity.ok(getResponse(request, Map.of(
                "etats", etats.getContent(),
                "page", etats.getNumber(),
                "totalPages", etats.getTotalPages(),
                "totalElements", etats.getTotalElements()
        ), "États de documents récupérés avec succès", OK));
    }

    /**
     * Remettre un état rejeté en cours (après modification des documents par l'utilisateur)
     */
    @PutMapping("/{id}/resoumettre")
    public ResponseEntity<Response> resoumettre(
            @PathVariable(name = "id") Long id,
            HttpServletRequest request) {
        log.info("PUT /etats-documents/{}/resoumettre", id);

        // Vérifier que l'état est bien REJET
        EtatDocumentDto etat = etatDocumentService.getEtatById(id);
        if (etat.getStatut() != StatutDocument.REJET) {
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of(),
                            "Seuls les états rejetés peuvent être re-soumis", BAD_REQUEST));
        }

        // Remettre en cours
        etatDocumentService.updateStatut(id, StatutDocument.ENCOURS);
        // Effacer le motif
        // Note: vous pouvez ajouter une méthode clearMotif si nécessaire

        EtatDocumentDto updatedEtat = etatDocumentService.getEtatById(id);

        return ResponseEntity.ok(getResponse(request, Map.of(
                "etat", updatedEtat
        ), "Demande re-soumise avec succès", OK));
    }

    private URI getUri(Long id) {
        return URI.create("/ecredit/etats-documents/" + id);
    }
}