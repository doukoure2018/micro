package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AnalyseRentabiliteDto {
    private Long rentabiliteId;
    private Long analyseId;
    private String typePeriode;

    // Revenue
    private BigDecimal chiffreAffaires;
    private BigDecimal coutAchatMarchandises;
    private BigDecimal margeBrute;

    // 13 Charges d'exploitation (sans amortissements)
    private BigDecimal salaires;
    private BigDecimal prelevementEntrepreneur;
    private BigDecimal loyers;
    private BigDecimal transport;
    private BigDecimal electriciteEauTelephone;
    private BigDecimal fournituresAutresBesoins;
    private BigDecimal entretienReparation;
    private BigDecimal carburantLubrifiants;
    private BigDecimal publicitePromotion;
    private BigDecimal impotsTaxes;
    private BigDecimal fraisBancairesInterets;
    private BigDecimal echeanceAutreCredit;
    private BigDecimal diversesCharges;

    private BigDecimal amortissementsProvisions;
    private BigDecimal autresRevenusHorsActivite;

    // CALCULATED FIELDS (from view v_rentabilite_complete)
    private BigDecimal totalChargesExploitation;
    private BigDecimal resultatExploitation;
    private BigDecimal cashFlow;
    private BigDecimal capaciteRemboursement;
}
