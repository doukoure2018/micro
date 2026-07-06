package io.digiservices.ecreditservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Requête d'actualisation des chaînes (réactivation) d'un décodeur Canal+.
 * numAbonne : 14 chiffres ; phoneNumber : sans indicatif pays (SMS de confirmation).
 * La normalisation (espaces, indicatif +224/00224) est faite côté service.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReactivationDecodeurRequest {

    @NotBlank(message = "Le numéro de décodeur est obligatoire")
    private String numAbonne;

    @NotBlank(message = "Le numéro de téléphone est obligatoire")
    private String phoneNumber;
}
