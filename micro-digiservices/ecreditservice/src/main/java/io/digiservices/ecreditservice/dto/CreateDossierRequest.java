package io.digiservices.ecreditservice.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreateDossierRequest {
    @NotNull(message = "Client ID obligatoire")
    private Long clientId;

    @NotNull(message = "Montant obligatoire")
    @Positive(message = "Montant doit être positif")
    private BigDecimal montantDemande;

    @NotNull(message = "Durée obligatoire")
    @Positive(message = "Durée doit être positive")
    private Integer dureeMois;

    @NotNull(message = "Taux obligatoire")
    @Positive(message = "Taux doit être positif")
    private BigDecimal tauxInteret;

    private String motifCredit;
    private String garanties;
}