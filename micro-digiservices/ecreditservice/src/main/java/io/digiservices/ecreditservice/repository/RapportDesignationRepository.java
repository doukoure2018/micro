package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.RapportMensuelDtos.AgentDesigneDto;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/** Acces a rapport_saisie_designation (V169) : qui, parmi les agents de credit, saisit les rapports d'un PS. */
@Repository
@RequiredArgsConstructor
public class RapportDesignationRepository {

    private final JdbcClient jdbcClient;

    private static final String SELECT = """
            SELECT d.cod_agencia, d.agent_user_id,
                   TRIM(COALESCE(u.first_name, '') || ' ' || COALESCE(u.last_name, '')) AS nom, u.email,
                   d.date_designation,
                   TRIM(COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '')) AS designe_par
            FROM rapport_saisie_designation d
            JOIN users u ON u.user_id = d.agent_user_id
            LEFT JOIN users p ON p.user_id = d.designe_par_user_id
            WHERE d.actif
            """;

    /** cod_agencia -> agents designes, pour les points de service donnes. */
    public Map<String, List<AgentDesigneDto>> activesParCodes(Collection<String> codes) {
        Map<String, List<AgentDesigneDto>> m = new HashMap<>();
        if (codes.isEmpty()) return m;
        jdbcClient.sql(SELECT + " AND d.cod_agencia IN (:codes) ORDER BY nom")
                .param("codes", List.copyOf(codes))
                .query((rs, n) -> m.computeIfAbsent(rs.getString("cod_agencia"), k -> new java.util.ArrayList<>())
                        .add(new AgentDesigneDto(rs.getLong("agent_user_id"), rs.getString("nom"), rs.getString("email"),
                                rs.getObject("date_designation", java.time.OffsetDateTime.class), rs.getString("designe_par"))))
                .list();
        return m;
    }

    /** Points de service sur lesquels cet agent est designe. */
    public Set<String> codesDesignes(Long agentUserId) {
        return jdbcClient.sql("SELECT cod_agencia FROM rapport_saisie_designation WHERE actif AND agent_user_id = :id")
                .param("id", agentUserId).query(String.class).list().stream().collect(Collectors.toSet());
    }

    public boolean designer(String codAgencia, Long agentUserId, Long parUserId) {
        return jdbcClient.sql("""
                INSERT INTO rapport_saisie_designation (cod_agencia, agent_user_id, designe_par_user_id)
                SELECT :code, :agent, :par
                WHERE NOT EXISTS (SELECT 1 FROM rapport_saisie_designation WHERE actif AND cod_agencia = :code AND agent_user_id = :agent)
                """).param("code", codAgencia).param("agent", agentUserId).param("par", parUserId).update() > 0;
    }

    public boolean retirer(String codAgencia, Long agentUserId, Long parUserId) {
        return jdbcClient.sql("""
                UPDATE rapport_saisie_designation
                   SET actif = FALSE, date_fin = CURRENT_TIMESTAMP, fin_par_user_id = :par
                 WHERE actif AND cod_agencia = :code AND agent_user_id = :agent
                """).param("code", codAgencia).param("agent", agentUserId).param("par", parUserId).update() > 0;
    }
}
