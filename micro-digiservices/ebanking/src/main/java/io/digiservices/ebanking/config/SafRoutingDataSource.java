package io.digiservices.ebanking.config;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

/**
 * DataSource principale d'ebanking : un aiguillage entre la production et la sauvegarde.
 * Les depots JPA et les JdbcTemplate continuent de l'utiliser sans rien savoir ; c'est elle
 * qui change de destination selon {@link SafRoutage} et {@link SafRoutageProperties}.
 */
public class SafRoutingDataSource extends AbstractRoutingDataSource {

    private final SafRoutageProperties proprietes;

    public SafRoutingDataSource(SafRoutageProperties proprietes) {
        this.proprietes = proprietes;
    }

    @Override
    protected Object determineCurrentLookupKey() {
        if (!proprietes.isActive()) {
            return SafRoutage.Cible.PRODUCTION;
        }
        SafRoutage.Cible cible = SafRoutage.courante();
        return cible == null ? SafRoutage.Cible.SAUVEGARDE : cible;
    }
}
