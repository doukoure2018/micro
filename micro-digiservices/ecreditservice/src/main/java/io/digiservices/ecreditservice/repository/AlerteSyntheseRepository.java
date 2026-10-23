package io.digiservices.ecreditservice.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** Donnees digi qui enrichissent les syntheses d'alertes du DA et du DR (affectations, scores, DA par agence). */
@Repository
@RequiredArgsConstructor
public class AlerteSyntheseRepository {

    private final JdbcClient jdbcClient;

    public record Agent(Long userId, String nom) {
    }

    /** « codAgencia-numCredito » -> agent de credit affecte (affectation CREDIT active). */
    public Map<String, Agent> agentsParCredit(Collection<String> codes) {
        Map<String, Agent> m = new HashMap<>();
        if (codes.isEmpty()) return m;
        jdbcClient.sql("""
                SELECT a.cod_agencia, a.num_credito, a.agent_user_id,
                       TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')) AS nom
                FROM portefeuille_affectation a JOIN users u ON u.user_id = a.agent_user_id
                WHERE a.actif AND a.type_affectation = 'CREDIT' AND a.cod_agencia IN (:codes)
                """).param("codes", List.copyOf(codes))
                .query((rs, n) -> m.put(rs.getString("cod_agencia") + "-" + rs.getLong("num_credito"),
                        new Agent(rs.getLong("agent_user_id"), rs.getString("nom"))))
                .list();
        return m;
    }

    public record Charge(long nbCredits, long nbEnRetard) {
    }

    /** Dernier score connu par agent : credits portes et credits en retard (calcul nocturne V164). */
    public Map<Long, Charge> chargeParAgent(Collection<String> codes) {
        Map<Long, Charge> m = new HashMap<>();
        if (codes.isEmpty()) return m;
        jdbcClient.sql("""
                SELECT s.agent_user_id, s.nb_credits, s.nb_en_retard
                FROM portefeuille_score_agent s
                WHERE s.cod_agencia IN (:codes)
                  AND s.date_calcul = (SELECT MAX(date_calcul) FROM portefeuille_score_agent)
                """).param("codes", List.copyOf(codes))
                .query((rs, n) -> m.merge(rs.getLong("agent_user_id"),
                        new Charge(rs.getLong("nb_credits"), rs.getLong("nb_en_retard")),
                        (a, b) -> new Charge(a.nbCredits() + b.nbCredits(), a.nbEnRetard() + b.nbEnRetard())))
                .list();
        return m;
    }

    /** agence_id -> nom du DA (le premier actif avec e-mail). */
    public Map<Long, String> daParAgence() {
        Map<Long, String> m = new HashMap<>();
        jdbcClient.sql("""
                SELECT u.agence_id, TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')) AS nom
                FROM users u JOIN user_roles ur ON ur.user_id = u.user_id JOIN roles r ON r.role_id = ur.role_id
                WHERE r.name = 'DA' AND u.agence_id IS NOT NULL AND COALESCE(u.enabled, TRUE)
                ORDER BY u.user_id
                """).query((rs, n) -> m.putIfAbsent(rs.getLong("agence_id"), rs.getString("nom"))).list();
        return m;
    }

    public record DestinataireDe(String email, String nom) {
    }

    /** Direction de l'Exploitation : MANAGER du service DE avec e-mail (copie du lundi). */
    public List<DestinataireDe> managersDe() {
        return jdbcClient.sql("""
                SELECT u.email, TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')) AS nom
                FROM users u JOIN user_roles ur ON ur.user_id = u.user_id JOIN roles r ON r.role_id = ur.role_id
                WHERE r.name = 'MANAGER' AND UPPER(COALESCE(u.service, '')) = 'DE'
                  AND u.email IS NOT NULL AND u.email <> '' AND COALESCE(u.enabled, TRUE)
                """).query((rs, n) -> new DestinataireDe(rs.getString("email"), rs.getString("nom"))).list();
    }
}
