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

    public record Destinataire(String email, String nom, List<String> codesSaf) {
    }

    private final JdbcClient jdbcClient;

    /** Agents de credit avec e-mail : chacun porte le code SAF de SON point de service. */
    public List<Destinataire> agentsCredit() {
        return jdbcClient.sql("""
                SELECT u.email, TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')) AS nom, p.code
                FROM users u
                JOIN user_roles ur ON ur.user_id = u.user_id
                JOIN roles r ON r.role_id = ur.role_id
                JOIN pointvente p ON p.id = u.pointvente_id
                WHERE r.name = 'AGENT_CREDIT' AND u.email IS NOT NULL AND u.email <> ''
                  AND p.code IS NOT NULL
                """)
                .query((rs, n) -> new Destinataire(rs.getString("email"), rs.getString("nom"),
                        List.of(rs.getString("code"))))
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

    /** DA avec e-mail : chacun porte les codes SAF des points de service de son agence. */
    public List<Destinataire> das() {
        return jdbcClient.sql("""
                SELECT u.email, TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')) AS nom,
                       STRING_AGG(DISTINCT p.code, ',') AS codes
                FROM users u
                JOIN user_roles ur ON ur.user_id = u.user_id
                JOIN roles r ON r.role_id = ur.role_id
                JOIN pointvente p ON p.agence_id = u.agence_id
                WHERE r.name = 'DA' AND u.email IS NOT NULL AND u.email <> '' AND p.code IS NOT NULL
                GROUP BY u.user_id, u.email, u.first_name, u.last_name
                """)
                .query((rs, n) -> new Destinataire(rs.getString("email"), rs.getString("nom"),
                        List.of(rs.getString("codes").split(","))))
                .list();
    }

    /** DR avec e-mail : chacun porte les codes SAF des points de service de sa delegation. */
    public List<Destinataire> drs() {
        return jdbcClient.sql("""
                SELECT u.email, TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')) AS nom,
                       STRING_AGG(DISTINCT p.code, ',') AS codes
                FROM users u
                JOIN user_roles ur ON ur.user_id = u.user_id
                JOIN roles r ON r.role_id = ur.role_id
                JOIN pointvente p ON p.delegation_id = u.delegation_id
                WHERE r.name = 'DR' AND u.email IS NOT NULL AND u.email <> '' AND p.code IS NOT NULL
                GROUP BY u.user_id, u.email, u.first_name, u.last_name
                """)
                .query((rs, n) -> new Destinataire(rs.getString("email"), rs.getString("nom"),
                        List.of(rs.getString("codes").split(","))))
                .list();
    }
}
