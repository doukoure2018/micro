package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.EtatDocumentDto;
import io.digiservices.ecreditservice.dto.UpdateEtatDocumentDto;
import io.digiservices.ecreditservice.enumeration.StatutDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EtatDocumentService {
    EtatDocumentDto createEtat(EtatDocumentDto dto);
    EtatDocumentDto updateEtatStatut(Long id, UpdateEtatDocumentDto dto);
    EtatDocumentDto getEtatById(Long id);
    Page<EtatDocumentDto> getAllEtatsByDate(Pageable pageable);
    Page<EtatDocumentDto> getEtatsByUserId(Long userId, Pageable pageable);

    // Nouvelles méthodes
    void updateStatut(Long id, StatutDocument statut);
    void updateStatutWithMotif(Long id, StatutDocument statut, String motif);
    EtatDocumentDto resetToEncours(Long id);
}