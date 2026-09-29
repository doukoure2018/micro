package io.digiservices.agriculteurservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Réponse de {@code GET /agriculteurs/farmers/{clientId}/comptes} : les comptes de crédit
 * et de remboursement du membre. Quand le membre n'en a aucun, la liste est vide et le
 * champ {@code message} porte « Compte non disponible » — ce n'est pas une erreur.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComptesMembreDto {

    private String codeMembre;
    private String nomMembre;
    private List<CompteDto> comptes;
    private String message;
}
