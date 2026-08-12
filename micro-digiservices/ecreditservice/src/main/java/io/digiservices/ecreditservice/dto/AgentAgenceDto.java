package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Agent (credit ou accueil) d'une agence, avec l'etat de ses fonctions
 * ACCUEIL/CREDIT gerees par le DA (table agent_fonctions).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AgentAgenceDto {
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private String role;
    private Long pointventeId;
    private String pointventeLibele;
    private Boolean fonctionAccueil;
    private Boolean fonctionCredit;
}
