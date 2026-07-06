package io.digiservices.ecreditservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Requête d'actualisation des chaînes (réactivation) d'un décodeur Canal+.
 * numAbonne : 14 chiffres. phoneNumber : FACULTATIF — le parcours agent ne le
 * demande plus ; à défaut, le backend envoie un numéro de service par défaut
 * (canal.api.default-phone) pour le SMS de confirmation.
 * La normalisation (espaces, indicatif +224/00224) est faite côté contrôleur.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReactivationDecodeurRequest {

    @NotBlank(message = "Le numéro de décodeur est obligatoire")
    private String numAbonne;

    private String phoneNumber;
}
