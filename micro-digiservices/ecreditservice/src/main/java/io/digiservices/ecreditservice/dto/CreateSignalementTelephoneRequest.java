package io.digiservices.ecreditservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Signalement depuis une ligne de l'etat TT1. Le signaleur ne saisit AUCUN numero
 * (arbitrage DSIG du 2026-09-27) : il decrit le probleme, l'agent de credit corrige.
 */
@Data
public class CreateSignalementTelephoneRequest {

    @NotBlank(message = "Le code client est obligatoire")
    @Size(max = 50)
    private String codCliente;

    @Size(max = 200)
    private String nomClient;

    private Long numCredito;

    @NotBlank(message = "Le code agence SAF est obligatoire")
    @Size(max = 20)
    private String codAgencia;

    @NotBlank(message = "Le motif est obligatoire")
    @Pattern(regexp = "INJOIGNABLE|ERRONE|ABSENT|CHANGE|AUTRE",
            message = "Motif invalide (INJOIGNABLE, ERRONE, ABSENT, CHANGE ou AUTRE)")
    private String motif;

    @Size(max = 2000)
    private String commentaire;
}
