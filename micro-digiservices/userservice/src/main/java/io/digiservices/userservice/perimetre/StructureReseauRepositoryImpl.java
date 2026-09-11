package io.digiservices.userservice.perimetre;

import io.digiservices.userservice.perimetre.StructureReseau;
import io.digiservices.userservice.perimetre.StructureReseau.AgenceRow;
import io.digiservices.userservice.perimetre.StructureReseau.DelegationRow;
import io.digiservices.userservice.perimetre.StructureReseau.PointVenteRow;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.util.List;

@Repository
@RequiredArgsConstructor
@Slf4j
public class StructureReseauRepositoryImpl implements StructureReseauRepository {

    private static final Duration TTL = Duration.ofMinutes(5);

    private static final String SELECT_DELEGATIONS = "SELECT id, libele FROM delegation ORDER BY id";
    private static final String SELECT_AGENCES = "SELECT id, libele, delegation_id FROM agence ORDER BY libele, id";
    private static final String SELECT_POINTS_DE_SERVICE =
            "SELECT id, libele, code, agence_id, delegation_id FROM pointvente ORDER BY code, id";

    private final JdbcClient jdbcClient;

    private volatile StructureReseau cache;
    private volatile long cachedAtMillis;

    @Override
    public StructureReseau getStructure() {
        StructureReseau current = cache;
        if (current != null && System.currentTimeMillis() - cachedAtMillis < TTL.toMillis()) {
            return current;
        }
        StructureReseau fresh = load();
        cache = fresh;
        cachedAtMillis = System.currentTimeMillis();
        return fresh;
    }

    private StructureReseau load() {
        List<DelegationRow> delegations = jdbcClient.sql(SELECT_DELEGATIONS).query(DelegationRow.class).list();
        List<AgenceRow> agences = jdbcClient.sql(SELECT_AGENCES).query(AgenceRow.class).list();
        List<PointVenteRow> points = jdbcClient.sql(SELECT_POINTS_DE_SERVICE).query(PointVenteRow.class).list();
        log.info("Structure réseau chargée : {} délégations, {} agences, {} points de service",
                delegations.size(), agences.size(), points.size());
        return new StructureReseau(delegations, agences, points);
    }
}
