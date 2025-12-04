package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.*;

import java.util.List;
import java.util.Map;

public interface StockService {

    StockResponseDto addStock(CreateStockDto stockDto);
    StockResponseDto updateStock(Long idCmd, UpdateStockDto stockDto);
    StockResponseDto updateStatus(Long idCmd, UpdateStatusDto statusDto);
    List<StockResponseDto> getAllStockEncours();
    List<StockResponseDto> getAllStock(int page, int size);
    StockResponseDto getStockById(Long idCmd);
    List<StockResponseDto> getStockByUser(Long userId);
    Map<String, Long> getStatistics();


    List<StockResponseDto> getAllStockEncoursByDelegation(Long delegationId);

    List<CategorieStockDto> listCategorieStock();


    void updateStockStatut(UpdateStatusDto stockStatut, Long idCmd);

    /**
     * Récupère la synthèse des bons de commande par délégation
     */
    List<SyntheseDelegationDto> listBonParDelegation();

    /**
     * Récupère la liste détaillée des bons de commande pour une délégation spécifique
     */
    List<BonCommandeDelegationDto> getBonsCommandeParDelegation(String delegation);

    /**
     * Récupère tous les bons de commande validés (toutes délégations)
     */
    List<BonCommandeDelegationDto> getTousBonsCommandeValides();
}
