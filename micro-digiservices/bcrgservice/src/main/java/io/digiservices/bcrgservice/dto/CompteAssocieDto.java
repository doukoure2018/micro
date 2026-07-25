package io.digiservices.bcrgservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Compte associe (balise CompteAssocie du modele BCRG).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompteAssocieDto {
    private String idInterneClt;   // COD_CLIENTE
    private String codAgce;        // agence du client
    private String numCpt;         // NUM_CUENTA
    private String typCpt;         // type de compte (a mapper - defaut null)
    private String statCpt;        // statut du compte (a mapper - defaut null)
}
