package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.DocumentCartePrepaidDto;
import io.digiservices.ecreditservice.dto.DocumentCartePrepaidListDto;
import io.digiservices.ecreditservice.service.DocumentCartePrepaidService;
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
import java.util.List;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ecredit/documents-carte-prepaid")
@Slf4j
public class DocumentCartePrepaidResource {

    private final DocumentCartePrepaidService documentService;

    @PostMapping
    public ResponseEntity<Response> createDocument(
            @Valid @RequestBody DocumentCartePrepaidDto dto,
            HttpServletRequest request) {
        log.info("Création d'un nouveau document");
        DocumentCartePrepaidDto created = documentService.createDocument(dto);
        return ResponseEntity.created(getUri(created.getId()))
                .body(getResponse(request, Map.of("document", created), "Document créé avec succès", CREATED));
    }

    @PostMapping("/batch")
    public ResponseEntity<Response> createDocuments(
            @Valid @RequestBody DocumentCartePrepaidListDto dtoList,
            HttpServletRequest request) {
        log.info("Création de plusieurs documents");
        List<DocumentCartePrepaidDto> created = documentService.createDocuments(dtoList);
        return ResponseEntity.created(URI.create("/ecredit/documents-carte-prepaid"))
                .body(getResponse(request, Map.of("documents", created, "count", created.size()),
                        "Documents créés avec succès", CREATED));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Response> deleteDocument(
            @PathVariable(name = "id") Long id,
            HttpServletRequest request) {
        log.info("Suppression du document ID: {}", id);
        documentService.deleteDocument(id);
        return ResponseEntity.ok(getResponse(request, Map.of(), "Document supprimé avec succès", OK));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response> getDocumentById(
            @PathVariable(name = "id") Long id,
            HttpServletRequest request) {
        log.info("Récupération du document ID: {}", id);
        DocumentCartePrepaidDto document = documentService.getDocumentById(id);
        return ResponseEntity.ok(getResponse(request, Map.of("document", document), "Document récupéré avec succès", OK));
    }

    @GetMapping
    public ResponseEntity<Response> getAllDocuments(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            HttpServletRequest request) {
        log.info("Récupération de tous les documents - page: {}, size: {}", page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<DocumentCartePrepaidDto> documents = documentService.getAllDocuments(pageable);
        return ResponseEntity.ok(getResponse(request, Map.of(
                "documents", documents.getContent(),
                "page", documents.getNumber(),
                "totalPages", documents.getTotalPages(),
                "totalElements", documents.getTotalElements()
        ), "Documents récupérés avec succès", OK));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Response> getDocumentsByUserId(
            @PathVariable(name = "userId") Long userId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            HttpServletRequest request) {
        log.info("Récupération des documents pour l'utilisateur: {}", userId);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<DocumentCartePrepaidDto> documents = documentService.getDocumentsByUserId(userId, pageable);
        return ResponseEntity.ok(getResponse(request, Map.of(
                "documents", documents.getContent(),
                "page", documents.getNumber(),
                "totalPages", documents.getTotalPages(),
                "totalElements", documents.getTotalElements()
        ), "Documents récupérés avec succès", OK));
    }

    @GetMapping("/etat/{idEtatDoc}")
    public ResponseEntity<Response> getDocumentsByEtatId(
            @PathVariable(name = "idEtatDoc") Long idEtatDoc,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            HttpServletRequest request) {
        log.info("Récupération des documents pour l'état: {}", idEtatDoc);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<DocumentCartePrepaidDto> documents = documentService.getDocumentsByEtatId(idEtatDoc, pageable);
        return ResponseEntity.ok(getResponse(request, Map.of(
                "documents", documents.getContent(),
                "page", documents.getNumber(),
                "totalPages", documents.getTotalPages(),
                "totalElements", documents.getTotalElements()
        ), "Documents récupérés avec succès", OK));
    }

    private URI getUri(Long id) {
        return URI.create("/ecredit/documents-carte-prepaid/" + id);
    }
}