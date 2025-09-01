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
public class RatiosFinanciersDto {
    // Ratios de liquidité
    private BigDecimal ratioLiquiditeGenerale;
    private BigDecimal ratioLiquiditeImmediate;

    // Ratios d'endettement
    private BigDecimal ratioEndettement;
    private BigDecimal ratioCouvertureDette;

    // Ratios de rentabilité
    private BigDecimal margeNette;
    private BigDecimal roiPrevisionnel;

    // Ratios d'activité
    private BigDecimal rotationStock;
    private BigDecimal delaiRecouvrementMoyen;

    // Indicateurs de risque
    private BigDecimal fondsRoulement;
    private BigDecimal besoinFondsRoulement;
    private BigDecimal tresorerieNette;
}