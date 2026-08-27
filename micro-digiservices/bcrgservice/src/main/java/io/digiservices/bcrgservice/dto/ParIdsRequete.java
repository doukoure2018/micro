package io.digiservices.bcrgservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Corps des endpoints POST /par-ids (v1.7, demande BCRG) : la liste d'identifiants
 * passe dans le payload plutôt qu'en paramètre d'URL — évite les limites de longueur
 * d'URL sur les gros lots (1 à 200 identifiants).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParIdsRequete {
    private List<String> ids;
}
