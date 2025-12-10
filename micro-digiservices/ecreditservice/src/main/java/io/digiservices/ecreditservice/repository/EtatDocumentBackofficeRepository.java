package io.digiservices.ecreditservice.repository;

import io.digiservices.clients.domain.DelegationDto;
import io.digiservices.ecreditservice.dto.EtatDocumentByDelegationDto;
import io.digiservices.ecreditservice.dto.EtatDocumentDetailDto;
import io.digiservices.ecreditservice.enumeration.StatutDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface EtatDocumentBackofficeRepository {

    Page<EtatDocumentByDelegationDto> findAllByDelegation(Long delegationId, Pageable pageable);

    Page<EtatDocumentByDelegationDto> findAllByDelegationAndStatut(Long delegationId, StatutDocument statut, Pageable pageable);

    Page<EtatDocumentByDelegationDto> findAllWithDetails(Pageable pageable);

    Optional<EtatDocumentDetailDto> findDetailById(Long id);

    void updateStatut(Long id, StatutDocument statut);

    List<Map<String, Object>> getStatsByDelegation();

    List<DelegationDto> findAllDelegations();

    long countByDelegation(Long delegationId);

    long countByDelegationAndStatut(Long delegationId, StatutDocument statut);

    void updateStatutWithMotif(Long id, StatutDocument statut, String motif);  // ← AJOUTÉ

    void resetToEncours(Long id);
}