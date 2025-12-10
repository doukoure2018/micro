package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.DocumentCartePrepaidDto;
import io.digiservices.ecreditservice.dto.DocumentCartePrepaidListDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.DocumentCartePrepaidRepository;
import io.digiservices.ecreditservice.repository.EtatDocumentRepository;
import io.digiservices.ecreditservice.service.DocumentCartePrepaidService;
import io.digiservices.ecreditservice.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentCartePrepaidServiceImpl implements DocumentCartePrepaidService {

    private final DocumentCartePrepaidRepository documentRepository;
    private final EtatDocumentRepository etatDocumentRepository;
    private final FileStorageService fileStorageService;

    public DocumentCartePrepaidDto createDocument(DocumentCartePrepaidDto dto) {
        // Vérifier que l'état existe
        if (!etatDocumentRepository.existsById(dto.getIdEtatDoc())) {
            throw new ApiException("État du document non trouvé avec l'ID: " + dto.getIdEtatDoc());
        }

        Long id = documentRepository.save(dto);
        return documentRepository.findById(id)
                .orElseThrow(() -> new ApiException("Erreur lors de la création du document"));
    }

    @Override
    public List<DocumentCartePrepaidDto> createDocuments(DocumentCartePrepaidListDto dtoList) {
        List<DocumentCartePrepaidDto> createdDocs = new ArrayList<>();

        for (DocumentCartePrepaidDto dto : dtoList.getDocuments()) {
            createdDocs.add(createDocument(dto));
        }

        return createdDocs;
    }

    @Override
    public void deleteDocument(Long id) {
        // Récupérer le document pour obtenir l'URL du fichier
        DocumentCartePrepaidDto document = documentRepository.findById(id)
                .orElseThrow(() -> new ApiException("Document non trouvé avec l'ID: " + id));

        // Supprimer le fichier physique
        String fileUrl = document.getDoc();
        if (fileUrl != null && !fileUrl.isEmpty()) {
            boolean fileDeleted = fileStorageService.deleteFile(fileUrl);
            if (fileDeleted) {
                log.info("Fichier physique supprimé: {}", fileUrl);
            } else {
                log.warn("Impossible de supprimer le fichier physique: {}", fileUrl);
                // On continue quand même la suppression en base
            }
        }
        // Supprimer l'entrée en base de données
        documentRepository.deleteById(id);
        log.info("Document supprimé de la base de données: {}", id);
    }

    @Override
    public DocumentCartePrepaidDto getDocumentById(Long id) {
        log.info("Recherche du document avec l'ID: {}", id);
        return documentRepository.findById(id)
                .orElseThrow(() -> new ApiException("Document non trouvé avec l'ID: " + id));
    }

    @Override
    public Page<DocumentCartePrepaidDto> getAllDocuments(Pageable pageable) {
        log.info("Récupération de tous les documents");
        return documentRepository.findAll(pageable);
    }

    @Override
    public Page<DocumentCartePrepaidDto> getDocumentsByUserId(Long userId, Pageable pageable) {
        log.info("Récupération des documents pour l'utilisateur: {}", userId);
        return documentRepository.findByUserId(userId, pageable);
    }

    @Override
    public Page<DocumentCartePrepaidDto> getDocumentsByEtatId(Long idEtatDoc, Pageable pageable) {
        log.info("Récupération des documents pour l'état: {}", idEtatDoc);
        return documentRepository.findByEtatId(idEtatDoc, pageable);
    }

    @Override
    public void deleteDocumentsByEtatId(Long idEtatDoc) {
        // Récupérer tous les documents de cet état
        Page<DocumentCartePrepaidDto> documents = documentRepository.findByEtatId(
                idEtatDoc,
                Pageable.unpaged()
        );

        // Supprimer chaque document
        for (DocumentCartePrepaidDto doc : documents.getContent()) {
            if (doc.getId() != null) {
                deleteDocument(doc.getId());
            }
        }

        log.info("Tous les documents de l'état {} ont été supprimés", idEtatDoc);
    }

    private void validateEtatDocument(Long idEtatDoc) {
        if (!etatDocumentRepository.existsById(idEtatDoc)) {
            throw new ApiException("État du document non trouvé avec l'ID: " + idEtatDoc);
        }
    }
}