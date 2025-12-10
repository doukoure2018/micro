package io.digiservices.ecreditservice.service;

import io.digiservices.clients.domain.DelegationDto;
import io.digiservices.ecreditservice.dto.EtatDocumentByDelegationDto;
import io.digiservices.ecreditservice.dto.EtatDocumentDetailDto;
import io.digiservices.ecreditservice.dto.EtatDocumentDto;
import io.digiservices.ecreditservice.enumeration.StatutDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface EtatDocumentBackofficeService {

    Page<EtatDocumentByDelegationDto> getEtatsByDelegation(Long delegationId, Pageable pageable);

    Page<EtatDocumentByDelegationDto> getEtatsByDelegationAndStatut(
            Long delegationId,
            StatutDocument statut,
            Pageable pageable);

    Page<EtatDocumentByDelegationDto> getAllEtats(Pageable pageable);

    EtatDocumentDetailDto getEtatDetail(Long id);

    EtatDocumentDto validerEtat(Long id);

    EtatDocumentDto updateStatut(Long id, StatutDocument nouveauStatut);

    EtatDocumentDto rejeterEtat(Long id, String motif);

    EtatDocumentDto accepterEtat(Long id);

    List<Map<String, Object>> getStatsByDelegation();

    List<DelegationDto> getAllDelegations();

    EtatDocumentDto remettreEnCours(Long id);

}
