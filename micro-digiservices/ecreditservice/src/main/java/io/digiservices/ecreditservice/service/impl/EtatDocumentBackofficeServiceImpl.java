package io.digiservices.ecreditservice.service.impl;

import io.digiservices.clients.domain.DelegationDto;
import io.digiservices.ecreditservice.dto.EtatDocumentByDelegationDto;
import io.digiservices.ecreditservice.dto.EtatDocumentDetailDto;
import io.digiservices.ecreditservice.dto.EtatDocumentDto;
import io.digiservices.ecreditservice.enumeration.StatutDocument;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.EtatDocumentBackofficeRepository;
import io.digiservices.ecreditservice.repository.EtatDocumentRepository;
import io.digiservices.ecreditservice.service.EtatDocumentBackofficeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class EtatDocumentBackofficeServiceImpl implements EtatDocumentBackofficeService {

    private final EtatDocumentBackofficeRepository backofficeRepository;
    private final EtatDocumentRepository etatDocumentRepository;

    @Override
    public Page<EtatDocumentByDelegationDto> getEtatsByDelegation(Long delegationId, Pageable pageable) {
        log.info("Récupération des états pour la délégation: {}", delegationId);
        return backofficeRepository.findAllByDelegation(delegationId, pageable);
    }
    @Override
    public Page<EtatDocumentByDelegationDto> getEtatsByDelegationAndStatut(Long delegationId, StatutDocument statut, Pageable pageable) {
        log.info("Récupération des états pour la délégation: {} avec statut: {}", delegationId, statut);
        return backofficeRepository.findAllByDelegationAndStatut(delegationId, statut, pageable);
    }

    @Override
    public Page<EtatDocumentByDelegationDto> getAllEtats(Pageable pageable) {
        log.info("Récupération de tous les états de documents");
        return backofficeRepository.findAllWithDetails(pageable);
    }

    @Override
    public EtatDocumentDetailDto getEtatDetail(Long id) {
        log.info("Récupération du détail de l'état: {}", id);
        return backofficeRepository.findDetailById(id)
                .orElseThrow(() -> new ApiException("État du document non trouvé avec l'ID: " + id));
    }

    @Override
    public EtatDocumentDto validerEtat(Long id) {
        log.info("Validation de l'état: {}", id);

        EtatDocumentDto etat = etatDocumentRepository.findById(id)
                .orElseThrow(() -> new ApiException("État du document non trouvé avec l'ID: " + id));

        if (etat.getStatut() != StatutDocument.ENCOURS) {
            throw new ApiException("Seuls les états 'ENCOURS' peuvent être validés. Statut actuel: " + etat.getStatut());
        }

        backofficeRepository.updateStatut(id, StatutDocument.VALIDE);

        return etatDocumentRepository.findById(id)
                .orElseThrow(() -> new ApiException("Erreur lors de la mise à jour"));
    }

    @Override
    public EtatDocumentDto updateStatut(Long id, StatutDocument nouveauStatut) {
        log.info("Mise à jour du statut de l'état {} vers {}", id, nouveauStatut);

        // Vérifier que l'état existe
        EtatDocumentDto etat = etatDocumentRepository.findById(id)
                .orElseThrow(() -> new ApiException("État du document non trouvé avec l'ID: " + id));

        // Vérifier les transitions valides
        validateStatutTransition(etat.getStatut(), nouveauStatut);

        // Mettre à jour le statut
        backofficeRepository.updateStatut(id, nouveauStatut);

        // Retourner l'état mis à jour
        return etatDocumentRepository.findById(id)
                .orElseThrow(() -> new ApiException("Erreur lors de la mise à jour"));
    }

    @Override
    public EtatDocumentDto rejeterEtat(Long id, String motif) {
        log.info("Rejet de l'état: {} - Motif: {}", id, motif);

        if (motif == null || motif.trim().isEmpty()) {
            throw new ApiException("Le motif de rejet est obligatoire");
        }

        EtatDocumentDto etat = etatDocumentRepository.findById(id)
                .orElseThrow(() -> new ApiException("État du document non trouvé avec l'ID: " + id));

        if (etat.getStatut() != StatutDocument.ENCOURS && etat.getStatut() != StatutDocument.VALIDE) {
            throw new ApiException("Seuls les états 'ENCOURS' ou 'VALIDE' peuvent être rejetés");
        }

        backofficeRepository.updateStatutWithMotif(id, StatutDocument.REJET, motif.trim());

        return etatDocumentRepository.findById(id)
                .orElseThrow(() -> new ApiException("Erreur lors de la mise à jour"));
    }

    @Override
    public EtatDocumentDto accepterEtat(Long id) {
        log.info("Acceptation de l'état: {}", id);

        EtatDocumentDto etat = etatDocumentRepository.findById(id)
                .orElseThrow(() -> new ApiException("État du document non trouvé avec l'ID: " + id));

        if (etat.getStatut() != StatutDocument.VALIDE) {
            throw new ApiException("Seuls les états 'VALIDE' peuvent être acceptés. Statut actuel: " + etat.getStatut());
        }

        backofficeRepository.updateStatut(id, StatutDocument.ACCEPTE);

        return etatDocumentRepository.findById(id)
                .orElseThrow(() -> new ApiException("Erreur lors de la mise à jour"));
    }

    /**
     * Remettre un état rejeté en cours (pour re-soumission par l'utilisateur mobile)
     * Le motif est remis à NULL
     */
    @Override
    public EtatDocumentDto remettreEnCours(Long id) {
        log.info("Remise en cours de l'état: {}", id);

        EtatDocumentDto etat = etatDocumentRepository.findById(id)
                .orElseThrow(() -> new ApiException("État du document non trouvé avec l'ID: " + id));

        if (etat.getStatut() != StatutDocument.REJET) {
            throw new ApiException("Seuls les états 'REJET' peuvent être remis en cours. Statut actuel: " + etat.getStatut());
        }

        backofficeRepository.resetToEncours(id);

        return etatDocumentRepository.findById(id)
                .orElseThrow(() -> new ApiException("Erreur lors de la mise à jour"));
    }

    @Override
    public List<Map<String, Object>> getStatsByDelegation() {
        log.info("Récupération des statistiques par délégation");
        return backofficeRepository.getStatsByDelegation();
    }

    @Override
    public List<DelegationDto> getAllDelegations() {
        return backofficeRepository.findAllDelegations();
    }

    /**
     * Valider les transitions de statut
     */
    private void validateStatutTransition(StatutDocument statutActuel, StatutDocument nouveauStatut) {
        // Définir les transitions valides
        // ENCOURS -> VALIDE, REJET
        // VALIDE -> ACCEPTE, REJET
        // ACCEPTE -> (final)
        // REJET -> (final)

        if (statutActuel == StatutDocument.ACCEPTE || statutActuel == StatutDocument.REJET) {
            throw new ApiException("L'état '" + statutActuel + "' est final et ne peut pas être modifié");
        }

        if (statutActuel == StatutDocument.ENCOURS) {
            if (nouveauStatut != StatutDocument.VALIDE && nouveauStatut != StatutDocument.REJET) {
                throw new ApiException("Transition invalide: ENCOURS peut uniquement aller vers VALIDE ou REJET");
            }
        }

        if (statutActuel == StatutDocument.VALIDE) {
            if (nouveauStatut != StatutDocument.ACCEPTE && nouveauStatut != StatutDocument.REJET) {
                throw new ApiException("Transition invalide: VALIDE peut uniquement aller vers ACCEPTE ou REJET");
            }
        }
    }
}
