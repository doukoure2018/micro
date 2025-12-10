package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.EtatDocumentDto;
import io.digiservices.ecreditservice.enumeration.StatutDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

public interface EtatDocumentRepository {
    Long save(EtatDocumentDto etatDocumentDto);
    void updateStatut(Long id, StatutDocument statut);
    Optional<EtatDocumentDto> findById(Long id);
    Page<EtatDocumentDto> findAllByDate(Pageable pageable);
    Page<EtatDocumentDto> findByUserId(Long userId, Pageable pageable);
    long count();
    long countByUserId(Long userId);
    boolean existsById(Long id);

    void updateStatutWithMotif(Long id, StatutDocument statut, String motif);  // ← AJOUTÉ
    void resetToEncours(Long id);  // ← AJOUTÉ
}