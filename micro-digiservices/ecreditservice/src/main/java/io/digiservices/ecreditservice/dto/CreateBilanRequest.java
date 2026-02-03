package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreateBilanRequest {
    @NotNull(message = "L'ID de l'analyse est obligatoire")
    private Long analyseId;

    @NotNull(message = "Le type de periode est obligatoire")
    private String typePeriode;

    // ACTIF - Immobilisations
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
}
