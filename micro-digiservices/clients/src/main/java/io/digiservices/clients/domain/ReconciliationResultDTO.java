package io.digiservices.clients.domain;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReconciliationResultDTO {

    // Identifiants
    private String codeAgence;
    private Long serialCaisse;

    // Période (au lieu d'une seule date)
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Integer nombreJours;

    // Pour compatibilité
    @Deprecated
    private LocalDate date;

    // Totaux par type d'opération - Middleware
    private Integer totalDepotsMiddleware = 0;
    private Integer totalRetraitsMiddleware = 0;
    private BigDecimal montantTotalDepotsMiddleware = BigDecimal.ZERO;
    private BigDecimal montantTotalRetraitsMiddleware = BigDecimal.ZERO;

    // Totaux par type d'opération - Production
    private Integer totalDepotsProduction = 0;
    private Integer totalRetraitsProduction = 0;
    private BigDecimal montantTotalDepotsProduction = BigDecimal.ZERO;
    private BigDecimal montantTotalRetraitsProduction = BigDecimal.ZERO;

    // Listes détaillées par type
    private List<TransactionSafDTO> depositsMiddleware = new ArrayList<>();
    private List<TransactionSafDTO> withdrawalsMiddleware = new ArrayList<>();
    private List<Map<String, Object>> depositsProduction = new ArrayList<>();
    private List<Map<String, Object>> withdrawalsProduction = new ArrayList<>();

    // Totaux caisse (opérations réserve)
    private Integer totalOperationsReserve = 0;
    private BigDecimal montantTotalReserve = BigDecimal.ZERO;
    private List<OperationReserveDTO> operationsReserve = new ArrayList<>();

    // Champs existants conservés...
    private Integer totalMiddleware = 0;
    private Integer totalProduction = 0;
    private Integer transactionsCorrespondantes = 0;
    private List<TransactionSafDTO> transactionsManquantes = new ArrayList<>();
    private List<TransactionSafDTO> transactionsEnErreur = new ArrayList<>();
    private List<DailySummaryDTO> dailySummaries = new ArrayList<>();
    private BigDecimal montantTotalMiddleware = BigDecimal.ZERO;
    private BigDecimal montantTotalProduction = BigDecimal.ZERO;
    private BigDecimal montantEcart = BigDecimal.ZERO;
    private String statut;
    private String messageErreur;
    private String details;
    private LocalDateTime dateRapprochement = LocalDateTime.now();
    private String executePar;

    // Détail des opérations réserve
    private List<OperationReserveDTO> depositsReserve = new ArrayList<>();
    private List<OperationReserveDTO> withdrawalsReserve = new ArrayList<>();
    private Integer totalDepotsReserve = 0;
    private Integer totalRetraitsReserve = 0;
    private BigDecimal montantTotalDepotsReserve = BigDecimal.ZERO;
    private BigDecimal montantTotalRetraitsReserve = BigDecimal.ZERO;

    public static ReconciliationResultDTO error(String message) {
        ReconciliationResultDTO dto = new ReconciliationResultDTO();
        dto.setStatut("ERREUR");
        dto.setMessageErreur(message);
        return dto;
    }
}