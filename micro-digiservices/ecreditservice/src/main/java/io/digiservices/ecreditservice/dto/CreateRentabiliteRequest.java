package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreateRentabiliteRequest {
    @NotNull(message = "L'ID de l'analyse est obligatoire")
    private Long analyseId;

    @NotNull(message = "Le type de periode est obligatoire")
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
}
