package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SoumissionResultDto {

    private Boolean succes;
    private Long analyseId;
    private Long demandeindividuelId;
    private String statut;
    private LocalDateTime dateSoumission;

    // Validation
    private Integer nombreErreurs;
    private List<String> erreurs;

    // Ratios calculés (sollicité)
    private BigDecimal r1Sollicite;
    private BigDecimal r2Sollicite;
    private BigDecimal r3Sollicite;
    private BigDecimal r4Sollicite;
    private BigDecimal r5Sollicite;
    private BigDecimal r6Sollicite;
    private Boolean conformiteSollicite;

    // Ratios calculés (proposé)
    private BigDecimal r1Propose;
    private BigDecimal r2Propose;
    private BigDecimal r3Propose;
    private BigDecimal r4Propose;
    private BigDecimal r5Propose;
    private BigDecimal r6Propose;
    private Boolean conformitePropose;

    // Agrégats clés
    private BigDecimal totalActif;
    private BigDecimal capitauxPropres;
    private BigDecimal cashFlow;
    private BigDecimal capaciteRemboursement;
    private BigDecimal besoinReelInvestissement;
    private BigDecimal besoinReelExploitation;
}
