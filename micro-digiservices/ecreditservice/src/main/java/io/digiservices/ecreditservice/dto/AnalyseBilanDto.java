package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AnalyseBilanDto {
    private Long bilanId;
    private Long analyseId;
    private String typePeriode;

    // ACTIF - Immobilisations (8 postes)
    private BigDecimal terrain;
    private BigDecimal batimentMagasin;
    private BigDecimal installationAgencement;
    private BigDecimal materielIndustriel;
    private BigDecimal mobilierBureau;
    private BigDecimal materielInformatique;
    private BigDecimal materielTransport;
    private BigDecimal autreImmobilisation;

    // ACTIF - Circulant
    private BigDecimal stocks;
    private BigDecimal creancesClients;
    private BigDecimal tresorerieCaisseBanque;

    // PASSIF - Capitaux propres (Situation nette)
    private BigDecimal capitauxPropre;

    // PASSIF - Dettes
    private BigDecimal empruntLongTerme;
    private BigDecimal empruntCourtTerme;
    private BigDecimal autresDettes;

    // Observations
    private String observationsActif;
    private String observationsPassif;

    // CALCULATED FIELDS (from view v_bilan_complet)
    private BigDecimal totalImmobilisations;
    private BigDecimal totalActif;
    private BigDecimal totalDettes;
    private BigDecimal capitauxPropres;
    private BigDecimal fondsRoulement;
    private BigDecimal besoinFondsRoulement;
}
