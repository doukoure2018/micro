package io.digiservices.ecreditservice.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Destinataires des alertes du portefeuille credits SAF, resolus depuis le
 * rattachement digi (pointvente.code = COD_AGENCIA SAF) :
 * agents de credit par point de service, DA par agence, DR par delegation.
 */
@Repository
@RequiredArgsConstructor
public class AlerteDestinatairesRepository {

    /**
     * Destinataire d'une alerte. {@code userId} et {@code delegationId} ne servent pas a l'envoi
     * mais au journal des alertes (V175) : ils permettent au barometre d'usage de compter les
     * envois par role et par delegation.
     */
    public record Destinataire(String email, String nom, List<String> codesSaf, Long userId, Long delegationId) {
        public Destinataire(String email, String nom, List<String> codesSaf) {
            this(email, nom, codesSaf, null, null);
        }
    }

    private final JdbcClient jdbcClient;

    /** Agents de credit avec e-mail : chacun porte le code SAF de SON point de service. */
    public List<Destinataire> agentsCredit() {
        return jdbcClient.sql("""
                SELECT u.user_id, u.email, TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')) AS nom,
                       p.code, a.delegation_id
                FROM users u
                JOIN user_roles ur ON ur.user_id = u.user_id
                JOIN roles r ON r.role_id = ur.role_id
                JOIN pointvente p ON p.id = u.pointvente_id
                LEFT JOIN agence a ON a.id = p.agence_id
                WHERE r.name = 'AGENT_CREDIT' AND u.email IS NOT NULL AND u.email <> ''
                  AND p.code IS NOT NULL
                """)
                .query((rs, n) -> new Destinataire(rs.getString("email"), rs.getString("nom"),
                        List.of(rs.getString("code")), rs.getLong("user_id"), (Long) rs.getObject("delegation_id")))
                .list();
    }

    /** Destinataire d'un signalement : e-mail, nom, telephone (SMS optionnel) et role. */
    public record DestinatairePointService(Long userId, String email, String nom, String phone, String role) {
    }

    /**
     * Agents de credit d'un point de service (par code SAF) et DA de l'agence en copie :
     * destinataires d'un signalement de numero de telephone (V156).
     */
    public List<DestinatairePointService> agentsEtDaDuPointService(String codAgencia) {
        return jdbcClient.sql("""
                SELECT u.user_id, u.email, u.phone, r.name AS role,
                       TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')) AS nom
                FROM users u
                JOIN user_roles ur ON ur.user_id = u.user_id
                JOIN roles r ON r.role_id = ur.role_id
                WHERE u.email IS NOT NULL AND u.email <> ''
                  AND (
                        (r.name = 'AGENT_CREDIT' AND u.pointvente_id IN (
                            SELECT id FROM pointvente WHERE code = :code))
                     OR (r.name = 'DA' AND u.agence_id IN (
                            SELECT agence_id FROM pointvente WHERE code = :code))
                  )
                ORDER BY CASE r.name WHEN 'AGENT_CREDIT' THEN 0 ELSE 1 END, u.user_id
                """)
                .param("code", codAgencia)
                .query((rs, n) -> new DestinatairePointService(rs.getLong("user_id"), rs.getString("email"),
                        rs.getString("nom"), rs.getString("phone"), rs.getString("role")))
                .list();
    }

    /** Administrateurs (SUPER_ADMIN) avec e-mail : destinataires des alertes techniques. */
    public List<Destinataire> superAdmins() {
        return jdbcClient.sql("""
                SELECT DISTINCT u.email, TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')) AS nom
                FROM users u
                JOIN user_roles ur ON ur.user_id = u.user_id
                JOIN roles r ON r.role_id = ur.role_id
                WHERE r.name = 'SUPER_ADMIN' AND u.enabled AND u.email IS NOT NULL AND u.email <> ''
                """)
                .query((rs, n) -> new Destinataire(rs.getString("email"), rs.getString("nom"), List.of()))
                .list();
    }

    /**
     * Direction generale, Direction de l'exploitation et DSIG : destinataires du rapport
     * hebdomadaire d'usage (V176, lot 3). La DE et la DSIG sont des MANAGER avec un service.
     */
    public List<Destinataire> directions() {
        return jdbcClient.sql("""
                SELECT DISTINCT u.user_id, u.email,
                       TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')) AS nom
                FROM users u
                JOIN user_roles ur ON ur.user_id = u.user_id
                JOIN roles r ON r.role_id = ur.role_id
                WHERE COALESCE(u.enabled, FALSE) AND u.email IS NOT NULL AND u.email <> ''
                  AND (r.name = 'DG'
                       OR (r.name = 'MANAGER' AND UPPER(COALESCE(u.service, '')) IN ('DE', 'DSIG')))
                """)
                .query((rs, n) -> new Destinataire(rs.getString("email"), rs.getString("nom"),
                        List.of(), rs.getLong("user_id"), null))
                .list();
    }

    /** DA avec e-mail : chacun porte les codes SAF des points de service de son agence. */
    public List<Destinataire> das() {
        return jdbcClient.sql("""
                SELECT u.user_id, u.email, TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')) AS nom,
                       STRING_AGG(DISTINCT p.code, ',') AS codes, MIN(a.delegation_id) AS delegation_id
                FROM users u
                JOIN user_roles ur ON ur.user_id = u.user_id
                JOIN roles r ON r.role_id = ur.role_id
                JOIN pointvente p ON p.agence_id = u.agence_id
                LEFT JOIN agence a ON a.id = u.agence_id
                WHERE r.name = 'DA' AND u.email IS NOT NULL AND u.email <> '' AND p.code IS NOT NULL
                GROUP BY u.user_id, u.email, u.first_name, u.last_name
                """)
                .query((rs, n) -> new Destinataire(rs.getString("email"), rs.getString("nom"),
                        List.of(rs.getString("codes").split(",")), rs.getLong("user_id"), (Long) rs.getObject("delegation_id")))
                .list();
    }

    /** DR avec e-mail : chacun porte les codes SAF des points de service de sa delegation. */
    public List<Destinataire> drs() {
        return jdbcClient.sql("""
                SELECT u.user_id, u.email, TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')) AS nom,
                       STRING_AGG(DISTINCT p.code, ',') AS codes, u.delegation_id
                FROM users u
                JOIN user_roles ur ON ur.user_id = u.user_id
                JOIN roles r ON r.role_id = ur.role_id
                JOIN pointvente p ON p.delegation_id = u.delegation_id
                WHERE r.name = 'DR' AND u.email IS NOT NULL AND u.email <> '' AND p.code IS NOT NULL
                GROUP BY u.user_id, u.email, u.first_name, u.last_name, u.delegation_id
                """)
                .query((rs, n) -> new Destinataire(rs.getString("email"), rs.getString("nom"),
                        List.of(rs.getString("codes").split(",")), rs.getLong("user_id"), (Long) rs.getObject("delegation_id")))
                .list();
    }
}
