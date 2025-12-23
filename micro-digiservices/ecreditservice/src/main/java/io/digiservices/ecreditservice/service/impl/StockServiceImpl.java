package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.*;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.StockRepository;
import io.digiservices.ecreditservice.service.StockService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.common.errors.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class StockServiceImpl implements StockService {

    private final StockRepository stockRepository;

    @Override
    @Transactional
    public StockResponseDto addStock(CreateStockDto stockDto) {
        log.info("Création d'un nouveau bon de commande pour l'utilisateur: {}", stockDto.getIdUser());

        // Générer le numéro de commande
        String numeroCommande = stockRepository.generateNumeroCommande();

        // Créer le bon de commande
        Long idCmd = stockRepository.addStock(stockDto, numeroCommande);

        if (idCmd == null) {
            throw new RuntimeException("Impossible de créer le bon de commande");
        }

        // Récupérer et retourner le bon créé
        return stockRepository.getStockById(idCmd)
                .orElseThrow(() -> new RuntimeException("Bon de commande créé mais introuvable"));
    }

    @Override
    @Transactional
    public StockResponseDto updateStock(Long idCmd, UpdateStockDto stockDto) {
        log.info("Mise à jour du bon de commande: {}", idCmd);

        // Vérifier que le bon existe
        StockResponseDto existingStock = stockRepository.getStockById(idCmd)
                .orElseThrow(() -> new RuntimeException("Bon de commande introuvable: " + idCmd));

        // Vérifier que le statut permet la modification
        if (!"ENCOURS".equals(existingStock.getStatus())) {
            throw new RuntimeException("Impossible de modifier un bon avec le statut: " + existingStock.getStatus());
        }

        // Effectuer la mise à jour
        boolean updated = stockRepository.updateStock(idCmd, stockDto);

        if (!updated) {
            throw new RuntimeException("Échec de la mise à jour du bon de commande");
        }

        // Retourner le bon mis à jour
        return stockRepository.getStockById(idCmd)
                .orElseThrow(() -> new RuntimeException("Bon de commande mis à jour mais introuvable"));
    }

    @Override
    @Transactional
    public StockResponseDto updateStatus(Long idCmd, UpdateStatusDto statusDto) {
        log.info("Changement de statut du bon {}: {}", idCmd, statusDto.getStatus());

        // Validation du statut
        if (!Arrays.asList("ENCOURS", "REJET", "ACCEPT").contains(statusDto.getStatus())) {
            throw new IllegalArgumentException("Statut invalide: " + statusDto.getStatus());
        }

        // Vérifier que le bon existe
        StockResponseDto existingStock = stockRepository.getStockById(idCmd)
                .orElseThrow(() -> new RuntimeException("Bon de commande introuvable: " + idCmd));

        // Règles métier pour le changement de statut
        if ("REJET".equals(statusDto.getStatus()) && statusDto.getMotif() == null) {
            throw new IllegalArgumentException("Un motif est obligatoire pour rejeter un bon de commande");
        }

        // Effectuer la mise à jour
        boolean updated = stockRepository.updateStatus(idCmd, statusDto);

        if (!updated) {
            throw new RuntimeException("Échec du changement de statut");
        }

        // Retourner le bon mis à jour
        return stockRepository.getStockById(idCmd)
                .orElseThrow(() -> new RuntimeException("Bon de commande mis à jour mais introuvable"));
    }

    @Override
    public List<StockResponseDto> getAllStockEncours() {
        log.info("Récupération de tous les bons de commande en cours");
        return stockRepository.getAllStockEncours();
    }

    @Override
    public List<StockResponseDto> getAllStock(int page, int size) {
        log.info("Récupération des bons de commande - page: {}, taille: {}", page, size);

        if (page < 0 || size <= 0) {
            throw new IllegalArgumentException("Paramètres de pagination invalides");
        }

        return stockRepository.getAllStock(page, size);
    }

    @Override
    public StockResponseDto getStockById(Long idCmd) {
        log.info("Récupération du bon de commande: {}", idCmd);
        return stockRepository.getStockById(idCmd)
                .orElseThrow(() -> new RuntimeException("Bon de commande introuvable: " + idCmd));
    }

    @Override
    public List<StockResponseDto> getStockByUser(Long userId) {
        log.info("Récupération des bons de commande de l'utilisateur: {}", userId);
        return stockRepository.getStockByUser(userId);
    }

    @Override
    public Map<String, Long> getStatistics() {
        log.info("Récupération des statistiques");
        return stockRepository.countByStatus();
    }

    @Override
    public List<StockResponseDto> getAllStockEncoursByDelegation(Long delegationId) {
        log.info("Récupération de tous les bons de commande en cours par delegation");
        return stockRepository.getAllStockEncoursByDelegation(delegationId);
    }

    @Override
    public List<CategorieStockDto> listCategorieStock() {
        return stockRepository.listCategorieStock();
    }

    @Override
    @Transactional
    public void updateStockStatut(UpdateStatusDto stockStatut, Long idCmd) {
        log.info("Mise à jour du statut bon de commande: {}", idCmd);

        // Vérifier que le bon existe
        StockResponseDto existingStock = stockRepository.getStockById(idCmd)
                .orElseThrow(() -> new ResourceNotFoundException("Bon de commande introuvable: " + idCmd));

        // Vérifier que le statut permet la modification
        if (!"ENCOURS".equals(existingStock.getStatus())) {
            throw new ApiException(
                    String.format("Impossible de modifier un bon avec le statut: %s", existingStock.getStatus())
            );
        }

        // Vérifier que la commande n'a pas déjà été traitée (états finaux)
        // On refuse seulement si state_validation est VALIDE, ACCEPTE ou REFUSE
        String currentValidation = existingStock.getStateValidation();
        if (currentValidation != null && 
                ("VALIDE".equals(currentValidation) || 
                 "ACCEPTE".equals(currentValidation) || 
                 "REFUSE".equals(currentValidation))) {
            throw new ApiException(
                    String.format("Cette commande a déjà été traitée (état: %s)", currentValidation)
            );
        }

        // Effectuer la mise à jour
        stockRepository.updateStockStateValidation(stockStatut, idCmd);

        log.info("Bon de commande {} mis à jour avec succès. Nouveau state_validation: {}",
                idCmd, stockStatut.getStateValidation());
    }

    @Override
    public List<SyntheseDelegationDto> listBonParDelegation() {
        log.info("Service: Récupération de la synthèse par délégation");
        return stockRepository.listBonParDelegation();
    }

    @Override
    public List<BonCommandeDelegationDto> getBonsCommandeParDelegation(String delegation) {
        log.info("Service: Récupération des bons de commande pour la délégation: {}", delegation);
        return stockRepository.getBonsCommandeParDelegation(delegation);
    }

    @Override
    public List<BonCommandeDelegationDto> getTousBonsCommandeValides() {
        log.info("Service: Récupération de tous les bons de commande validés");
        return stockRepository.getTousBonsCommandeValides();
    }

    @Override
    @Transactional
    public StockResponseDto updateSuggestionQuantite(Long idCmd, SuggestionQuantiteDto suggestionDto) {
        log.info("Mise à jour de la suggestion de quantité pour le bon {}: qté suggérée = {}", 
                idCmd, suggestionDto.getQteSuggeree());

        // Vérifier que le bon existe
        StockResponseDto existingStock = stockRepository.getStockById(idCmd)
                .orElseThrow(() -> new ResourceNotFoundException("Bon de commande introuvable: " + idCmd));

        // Vérifier que le statut est ENCOURS
        if (!"ENCOURS".equals(existingStock.getStatus())) {
            throw new ApiException(
                    String.format("Impossible de suggérer une quantité pour un bon avec le statut: %s", 
                            existingStock.getStatus())
            );
        }

        // Vérifier que le bon est validé par le DR (state_validation = VALIDE)
        if (!"VALIDE".equals(existingStock.getStateValidation())) {
            throw new ApiException(
                    String.format("Seuls les bons validés par le DR peuvent recevoir une suggestion de quantité. État actuel: %s", 
                            existingStock.getStateValidation())
            );
        }

        // Déterminer la quantité actuelle (utiliser qte_actuelle si défini, sinon qte)
        Integer qteActuelle = existingStock.getQteActuelle() != null ? 
                existingStock.getQteActuelle() : existingStock.getQte();

        // Vérifier si le motif est requis
        boolean isQuantityDifferent = suggestionDto.getQteSuggeree() != null && 
                !suggestionDto.getQteSuggeree().equals(qteActuelle);

        // Si la quantité suggérée est différente et le flag garderQuantite n'est pas true, le motif est obligatoire
        if (isQuantityDifferent && 
                (suggestionDto.getGarderQuantite() == null || !suggestionDto.getGarderQuantite())) {
            if (suggestionDto.getMotifQte() == null || suggestionDto.getMotifQte().trim().isEmpty()) {
                throw new ApiException(
                        "Un motif est obligatoire lorsque la quantité suggérée est différente de la quantité actuelle"
                );
            }
        }

        // Si garderQuantite est true, la quantité suggérée devient égale à la quantité actuelle
        if (suggestionDto.getGarderQuantite() != null && suggestionDto.getGarderQuantite()) {
            suggestionDto.setQteSuggeree(qteActuelle);
            log.info("Conservation de la quantité actuelle: {}", qteActuelle);
        }

        // Effectuer la mise à jour
        boolean updated = stockRepository.updateSuggestionQuantite(idCmd, suggestionDto);

        if (!updated) {
            throw new RuntimeException("Échec de la mise à jour de la suggestion de quantité");
        }

        log.info("Suggestion de quantité mise à jour avec succès pour le bon {}. Quantité suggérée: {}", 
                idCmd, suggestionDto.getQteSuggeree());

        // Retourner le bon mis à jour
        return stockRepository.getStockById(idCmd)
                .orElseThrow(() -> new RuntimeException("Bon de commande mis à jour mais introuvable"));
    }

    @Override
    public List<StockResponseDto> getStockValidesPourDE(Long delegationId) {
        log.info("Service: Récupération des bons validés pour DE, délégation: {}", delegationId);
        return stockRepository.getStockValidesPourDE(delegationId);
    }

    @Override
    public List<StockResponseDto> getAllStockValidesPourDE() {
        log.info("Service: Récupération de tous les bons validés pour DE");
        return stockRepository.getAllStockValidesPourDE();
    }

    @Override
    @Transactional
    public StockResponseDto validationFinaleDE(Long idCmd, Long traitePar, String observations) {
        log.info("Validation finale DE pour le bon de commande: {} par l'utilisateur: {}", idCmd, traitePar);

        // Vérifier que le bon existe
        StockResponseDto existingStock = stockRepository.getStockById(idCmd)
                .orElseThrow(() -> new ResourceNotFoundException("Bon de commande introuvable: " + idCmd));

        // Vérifier que le statut est ENCOURS
        if (!"ENCOURS".equals(existingStock.getStatus())) {
            throw new ApiException(
                    String.format("Impossible de valider un bon avec le statut: %s", existingStock.getStatus())
            );
        }

        // Vérifier que le bon a été validé par le DR (state_validation = VALIDE)
        if (!"VALIDE".equals(existingStock.getStateValidation())) {
            throw new ApiException(
                    String.format("Seuls les bons validés par le DR peuvent être acceptés par le DE. État actuel: %s", 
                            existingStock.getStateValidation())
            );
        }

        // Effectuer la validation finale
        boolean updated = stockRepository.validationFinaleDE(idCmd, traitePar, observations);

        if (!updated) {
            throw new RuntimeException("Échec de la validation finale par le DE");
        }

        log.info("Bon de commande {} accepté par le DE avec succès", idCmd);

        // Retourner le bon mis à jour
        return stockRepository.getStockById(idCmd)
                .orElseThrow(() -> new RuntimeException("Bon de commande mis à jour mais introuvable"));
    }

    @Override
    public List<StockResponseDto> getStockAcceptesPourLogistique() {
        log.info("Service: Récupération des bons acceptés pour la logistique");
        return stockRepository.getStockAcceptesPourLogistique();
    }

    @Override
    public List<StockResponseDto> getStockAcceptesParDelegation(Long delegationId) {
        log.info("Service: Récupération des bons acceptés pour la délégation: {}", delegationId);
        return stockRepository.getStockAcceptesParDelegation(delegationId);
    }

    @Override
    @Transactional
    public StockResponseDto validationLogistique(Long idCmd, Long traitePar, String observations) {
        log.info("Validation logistique pour le bon de commande: {} par l'utilisateur: {}", idCmd, traitePar);

        // Vérifier que le bon existe
        StockResponseDto existingStock = stockRepository.getStockById(idCmd)
                .orElseThrow(() -> new ResourceNotFoundException("Bon de commande introuvable: " + idCmd));

        // Vérifier que le statut est ENCOURS
        if (!"ENCOURS".equals(existingStock.getStatus())) {
            throw new ApiException(
                    String.format("Impossible de traiter un bon avec le statut: %s", existingStock.getStatus())
            );
        }

        // Vérifier que le bon a été accepté par le DE (state_validation = ACCEPTE)
        if (!"ACCEPTE".equals(existingStock.getStateValidation())) {
            throw new ApiException(
                    String.format("Seuls les bons acceptés par le DE peuvent être traités par la logistique. État actuel: %s", 
                            existingStock.getStateValidation())
            );
        }

        // Effectuer la validation logistique
        boolean updated = stockRepository.validationLogistique(idCmd, traitePar, observations);

        if (!updated) {
            throw new RuntimeException("Échec de la validation par la logistique");
        }

        log.info("Bon de commande {} traité par la logistique avec succès (status: ACCEPT)", idCmd);

        // Retourner le bon mis à jour
        return stockRepository.getStockById(idCmd)
                .orElseThrow(() -> new RuntimeException("Bon de commande mis à jour mais introuvable"));
    }
}
