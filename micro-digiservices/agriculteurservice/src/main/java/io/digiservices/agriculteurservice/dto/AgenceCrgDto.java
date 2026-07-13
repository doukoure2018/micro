package io.digiservices.agriculteurservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Agence du reseau organisationnel Credit Rural (referentiel d'habilitation des agents),
 * distincte de l'agence SAF bancaire ({@link AgenceDto}). {@code id} correspond a
 * {@code users.agence_id} porte par le SSO.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgenceCrgDto {

    private Long id;
    private String libelle;
    private Long delegationId;
}
