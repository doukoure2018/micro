package io.digiservices.agriculteurservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Point de vente du reseau Credit Rural (unite la plus fine du perimetre d'un agent).
 * {@code id} correspond a {@code users.pointvente_id} porte par le SSO.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PointDeVenteDto {

    private Long id;
    private String libelle;
    private String code;
    private Long agenceId;
    private Long delegationId;
}
