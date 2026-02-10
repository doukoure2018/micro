package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ChargePersonnelleDto {
    private Long chargePersoId;
    private Long collecteId;

    private Boolean salaireFixe;
    private BigDecimal salaireMontant;

    // Detail if salaireFixe = false
    private BigDecimal alimentationMontant;
    private BigDecimal loyerResidenceMontant;
    private BigDecimal transportPriveMontant;
    private BigDecimal electriciteEauCommMontant;
    private BigDecimal habillementMontant;
    private BigDecimal fraisMedicauxMontant;
    private BigDecimal echeanceCreditPersoMontant;
    private BigDecimal scolariteMontant;
    private BigDecimal travauxConstructionMontant;
    private BigDecimal autresChargesPersoMontant;

    private Boolean depensesPreleveesActivite;
}
