package io.digiservices.ecreditservice.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.HashSet;
import java.util.Set;

/**
 * Perimetre du portefeuille credits SAF : codes d'agences SAF autorises pour un
 * utilisateur selon son rattachement digi. Source : pointvente.code, qui EST le
 * COD_AGENCIA SAF du point de service (verifie sur les 188 PS, y compris les
 * nouvelles agences — deux PS peuvent partager un code, ex. Dinguiraye/Mbonet).
 */
@Repository
@RequiredArgsConstructor
public class PortefeuillePerimetreRepository {

    private final JdbcClient jdbcClient;

    /** Code SAF du point de service de l'agent (vide si PS non relie). */
    public Set<String> codesParPointVente(Long pointventeId) {
        return codes("SELECT code FROM pointvente WHERE id = :id AND code IS NOT NULL", pointventeId);
    }

    /** Codes SAF des points de service de l'agence du DA. */
    public Set<String> codesParAgence(Long agenceId) {
        return codes("SELECT code FROM pointvente WHERE agence_id = :id AND code IS NOT NULL", agenceId);
    }

    /** Codes SAF des points de service de la delegation du DR. */
    public Set<String> codesParDelegation(Long delegationId) {
        return codes("SELECT code FROM pointvente WHERE delegation_id = :id AND code IS NOT NULL", delegationId);
    }

    private Set<String> codes(String sql, Long id) {
        if (id == null) return Set.of();
        return new HashSet<>(jdbcClient.sql(sql).param("id", id).query(String.class).list());
    }
}
