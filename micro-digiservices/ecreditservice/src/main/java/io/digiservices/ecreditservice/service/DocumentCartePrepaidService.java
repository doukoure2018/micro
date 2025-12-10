package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.DocumentCartePrepaidDto;
import io.digiservices.ecreditservice.dto.DocumentCartePrepaidListDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface DocumentCartePrepaidService {
    DocumentCartePrepaidDto createDocument(DocumentCartePrepaidDto dto);
    List<DocumentCartePrepaidDto> createDocuments(DocumentCartePrepaidListDto dtoList);
    void deleteDocument(Long id);
    DocumentCartePrepaidDto getDocumentById(Long id);
    Page<DocumentCartePrepaidDto> getAllDocuments(Pageable pageable);
    Page<DocumentCartePrepaidDto> getDocumentsByUserId(Long userId, Pageable pageable);
    Page<DocumentCartePrepaidDto> getDocumentsByEtatId(Long idEtatDoc, Pageable pageable);

    void deleteDocumentsByEtatId(Long idEtatDoc);
}