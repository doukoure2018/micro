package io.digiservices.agriculteurservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Details d'un agriculteur personne morale (contrat public AgriPilot).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgriculteurMoraleDto {

    private String raisonSociale;
    private String nomCommercial;
    private String formeJuridique;
}
