package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    // Statistiques clients
    private Long totalClients;
    private Long clientsActifs;
    private Long nouveauxClientsMois;

    // Statistiques dossiers
    private Long totalDossiers;
    private Long dossiersEnCours;
    private Long dossiersApprouves;
    private Long dossiersRejetes;

    // Statistiques financières
    private BigDecimal montantTotalDemande;
    private BigDecimal montantTotalApprouve;
    private BigDecimal montantTotalDecaisse;
    private BigDecimal montantTotalRembourse;

    // Taux et ratios
    private BigDecimal tauxApprobation;
    private BigDecimal tauxDefaut;
    private BigDecimal ratioRecouvrementMoyen;

    // Performance
    private BigDecimal delaiMoyenTraitement;
    private Integer nombreAnalysesJour;
}