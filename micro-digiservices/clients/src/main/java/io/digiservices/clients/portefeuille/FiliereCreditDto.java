package io.digiservices.clients.portefeuille;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * La filiere agricole d'un credit : le troisieme niveau du referentiel d'activites de SAF
 * (CL_SUBSUBACT_ECONOMICA), seul niveau qui nomme vraiment une filiere — cereale riz, arachide,
 * maraichage, elevage bovin.
 *
 * <p>Lue a part et non ajoutee a la requete des credits : cette derniere sert tous les ecrans du
 * portefeuille, et c'est elle qui a porte pendant deux mois la faute du 04/09. Une requete
 * separee ne coute que la ou la filiere est demandee.</p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FiliereCreditDto {
    private Long numCredito;
    private String codFiliere;
    private String desFiliere;
}
