package io.digiservices.agriculteurservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Delegation (equivalent "region" cote AgriScore) du reseau Credit Rural.
 * Racine de la hierarchie : delegation -> agence -> point de vente.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DelegationDto {

    private Long id;
    private String libelle;
}
