package io.digiservices.ecreditservice.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
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

    /** Rattachement digi d'un point de service relie a SAF (un code peut porter deux PS). */
    public record PointVenteHierarchie(String code, String libelle, Long agenceId, String agence,
                                       Long delegationId, String delegation) {
    }

    private static final String SQL_HIERARCHIE = """
            SELECT pv.code, pv.libele, a.id AS agence_id, a.libele AS agence,
                   d.id AS delegation_id, d.libele AS delegation
            FROM pointvente pv
            LEFT JOIN agence a ON a.id = pv.agence_id
            LEFT JOIN delegation d ON d.id = pv.delegation_id
            WHERE pv.code IS NOT NULL
            """;

    /** Hierarchie PS → agence → delegation pour les codes donnes (tous les PS relies si la liste est vide). */
    public List<PointVenteHierarchie> hierarchie(Collection<String> codes) {
        String sql = SQL_HIERARCHIE + (codes == null || codes.isEmpty() ? "" : " AND pv.code IN (:codes)") + " ORDER BY pv.code, pv.id";
        var spec = jdbcClient.sql(sql);
        if (codes != null && !codes.isEmpty()) {
            spec = spec.param("codes", List.copyOf(codes));
        }
        return spec.query((rs, n) -> new PointVenteHierarchie(
                rs.getString("code"), rs.getString("libele"),
                (Long) rs.getObject("agence_id"), rs.getString("agence"),
                (Long) rs.getObject("delegation_id"), rs.getString("delegation"))).list();
    }

    private Set<String> codes(String sql, Long id) {
        if (id == null) return Set.of();
        return new HashSet<>(jdbcClient.sql(sql).param("id", id).query(String.class).list());
    }
}
