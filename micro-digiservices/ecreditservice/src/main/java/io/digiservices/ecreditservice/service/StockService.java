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

    /**
     * Met à jour la suggestion de quantité pour un bon de commande validé par le DR
     * Utilisé par le DE pour proposer une modification de quantité
     * 
     * @param idCmd ID du bon de commande
     * @param suggestionDto DTO contenant les informations de suggestion
     * @return Le bon de commande mis à jour
     */
    StockResponseDto updateSuggestionQuantite(Long idCmd, SuggestionQuantiteDto suggestionDto);

    /**
     * Récupère les bons de commande validés par le DR pour une délégation
     * Ces bons sont disponibles pour le DE pour modifier la quantité suggérée
     * Les bons rejetés ne sont pas retournés
     * 
     * @param delegationId ID de la délégation
     * @return Liste des bons validés disponibles pour suggestion
     */
    List<StockResponseDto> getStockValidesPourDE(Long delegationId);

    /**
     * Récupère tous les bons de commande validés par le DR (toutes délégations)
     * Pour la vue admin/DE global
     * 
     * @return Liste de tous les bons validés
     */
    List<StockResponseDto> getAllStockValidesPourDE();

    /**
     * Validation finale par le DE
     * Passe le state_validation de 'VALIDE' à 'ACCEPTE'
     * Le bon devient ensuite visible pour la logistique
     * 
     * @param idCmd ID du bon de commande
     * @param traitePar ID de l'utilisateur DE qui valide
     * @param observations Observations optionnelles
     * @return Le bon de commande mis à jour
     */
    StockResponseDto validationFinaleDE(Long idCmd, Long traitePar, String observations);

    /**
     * Récupère tous les bons acceptés par le DE pour la logistique
     * Ces bons ont state_validation = 'ACCEPTE' et sont prêts pour traitement
     * 
     * @return Liste des bons acceptés
     */
    List<StockResponseDto> getStockAcceptesPourLogistique();

    /**
     * Récupère les bons acceptés par le DE pour une délégation spécifique
     * 
     * @param delegationId ID de la délégation
     * @return Liste des bons acceptés pour cette délégation
     */
    List<StockResponseDto> getStockAcceptesParDelegation(Long delegationId);

    /**
     * Validation finale par la logistique
     * Change le status de 'ENCOURS' à 'ACCEPT'
     * Le bon disparaît ensuite de la vue logistique
     * 
     * @param idCmd ID du bon de commande
     * @param traitePar ID de l'utilisateur logistique qui traite
     * @param observations Observations optionnelles
     * @return Le bon de commande mis à jour
     */
    StockResponseDto validationLogistique(Long idCmd, Long traitePar, String observations);
}
