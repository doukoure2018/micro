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

        // Vérifier que la commande n'a pas déjà été traitée
        if (existingStock.getStateValidation() != null &&
                !"EN_ATTENTE".equals(existingStock.getStateValidation())) {
            throw new ApiException(
                    String.format("Cette commande a déjà été traitée (état: %s)", existingStock.getStateValidation())
            );
        }

        // Effectuer la mise à jour
        stockRepository.updateStockStateValidation(stockStatut, idCmd);

        log.info("Bon de commande {} mis à jour avec succès. Nouveau state_validation: {}",
                idCmd, stockStatut.getStateValidation());
    }
}
