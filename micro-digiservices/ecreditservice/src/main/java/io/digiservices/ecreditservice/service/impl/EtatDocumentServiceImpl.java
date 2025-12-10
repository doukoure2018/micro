package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.EtatDocumentDto;
import io.digiservices.ecreditservice.dto.UpdateEtatDocumentDto;
import io.digiservices.ecreditservice.enumeration.StatutDocument;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.EtatDocumentRepository;
import io.digiservices.ecreditservice.service.EtatDocumentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EtatDocumentServiceImpl implements EtatDocumentService {

    private final EtatDocumentRepository etatDocumentRepository;

    @Override
    public EtatDocumentDto createEtat(EtatDocumentDto dto) {
        log.info("Création d'un nouvel état de document pour l'utilisateur: {}", dto.getUserId());
        if (dto.getStatut() == null) {
            dto.setStatut(StatutDocument.ENCOURS);
        }
        Long id = etatDocumentRepository.save(dto);
        return etatDocumentRepository.findById(id)
                .orElseThrow(() -> new ApiException("Erreur lors de la création de l'état du document"));
    }

    @Override
    public EtatDocumentDto updateEtatStatut(Long id, UpdateEtatDocumentDto dto) {
        log.info("Mise à jour du statut de l'état du document ID: {} vers {}", id, dto.getStatut());
        if (!etatDocumentRepository.existsById(id)) {
            throw new ApiException("État du document non trouvé avec l'ID: " + id);
        }
        etatDocumentRepository.updateStatut(id, dto.getStatut());
        return etatDocumentRepository.findById(id)
                .orElseThrow(() -> new ApiException("Erreur lors de la mise à jour de l'état du document"));
    }

    @Override
    public EtatDocumentDto getEtatById(Long id) {
        log.info("Recherche de l'état du document avec l'ID: {}", id);
        return etatDocumentRepository.findById(id)
                .orElseThrow(() -> new ApiException("État du document non trouvé avec l'ID: " + id));
    }

    @Override
    public Page<EtatDocumentDto> getAllEtatsByDate(Pageable pageable) {
        log.info("Récupération de tous les états de documents triés par date");
        return etatDocumentRepository.findAllByDate(pageable);
    }

    @Override
    public Page<EtatDocumentDto> getEtatsByUserId(Long userId, Pageable pageable) {
        log.info("Récupération des états de documents pour l'utilisateur: {}", userId);
        return etatDocumentRepository.findByUserId(userId, pageable);
    }

    @Override
    public void updateStatut(Long id, StatutDocument statut) {
        log.info("Mise à jour du statut de l'état {} vers {}", id, statut);
        if (!etatDocumentRepository.existsById(id)) {
            throw new ApiException("État du document non trouvé avec l'ID: " + id);
        }
        etatDocumentRepository.updateStatut(id, statut);
    }

    @Override
    public void updateStatutWithMotif(Long id, StatutDocument statut, String motif) {
        log.info("Mise à jour du statut de l'état {} vers {} avec motif: {}", id, statut, motif);
        if (!etatDocumentRepository.existsById(id)) {
            throw new ApiException("État du document non trouvé avec l'ID: " + id);
        }
        etatDocumentRepository.updateStatutWithMotif(id, statut, motif);
    }

    @Override
    public EtatDocumentDto resetToEncours(Long id) {
        log.info("Remise en cours de l'état: {}", id);

        EtatDocumentDto etat = getEtatById(id);
        if (etat.getStatut() != StatutDocument.REJET) {
            throw new ApiException("Seuls les états 'REJET' peuvent être remis en cours. Statut actuel: " + etat.getStatut());
        }

        etatDocumentRepository.resetToEncours(id);

        return getEtatById(id);
    }
}