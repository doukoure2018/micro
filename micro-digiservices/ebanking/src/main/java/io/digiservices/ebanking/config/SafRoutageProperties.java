package io.digiservices.ebanking.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Regle d'aiguillage entre la base SAF de production et sa sauvegarde (DSIG, 21/10/2026) :
 * la production n'est sollicitee que par ce qui ecrit dans SAF ou doit voir l'instant present ;
 * tout le reste lit la sauvegarde de la veille.
 *
 * <pre>
 * saf.sauvegarde.active            : false = tout va en production (retour arriere en une variable)
 * saf.sauvegarde.chemins-production : prefixes de chemin dont les LECTURES vont aussi en production
 * </pre>
 * Les requetes qui ne sont pas des lectures (POST, PUT, DELETE, PATCH) vont toujours en production.
 */
@Component
@ConfigurationProperties(prefix = "saf.sauvegarde")
@Data
public class SafRoutageProperties {

    private boolean active = false;

    private List<String> cheminsProduction = new ArrayList<>(List.of(
            "/ebanking/fiche-signaletique",
            "/ebanking/telephone",
            "/ebanking/reconciliation",
            "/ebanking/reconciliationcompte"));
}
