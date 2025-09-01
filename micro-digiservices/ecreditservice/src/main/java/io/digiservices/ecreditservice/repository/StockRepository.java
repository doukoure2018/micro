package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface StockRepository {
    Long addStock(CreateStockDto stockDto, String numeroCommande);
    boolean updateStock(Long idCmd, UpdateStockDto stockDto);
    boolean updateStatus(Long idCmd, UpdateStatusDto statusDto);
    List<StockResponseDto> getAllStockEncours();
    List<StockResponseDto> getAllStock(int page, int size);
    Optional<StockResponseDto> getStockById(Long idCmd);
    List<StockResponseDto> getStockByUser(Long userId);
    String generateNumeroCommande();
    Map<String, Long> countByStatus();

    List<StockResponseDto> getAllStockEncoursByDelegation(Long delegationId);

    List<CategorieStockDto> listCategorieStock();

    void updateStockStateValidation(UpdateStatusDto stockStatut, Long idCmd);
}
