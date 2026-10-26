package io.digiservices.ecreditservice.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Lectures et marquages de la reprise des numeros de membre non verifies (V181).
 */
@Repository
@RequiredArgsConstructor
public class MembreSafRepriseRepository {

    // L'etat « VALIDATION » (vingt dossiers anciens) n'est pas dans la contrainte NOT VALID
    // chk_validation_state : toute mise a jour de ces lignes echoue, la reprise les ignore.
    private static final String EN_COURS =
            " COALESCE(d.statut_demande, '') NOT IN ('REJET', 'REJECTED', 'ANNULE')"
            + " AND COALESCE(d.validation_state, '') NOT IN ('VALIDATED_FINAL', 'VALIDATION') ";

    private final JdbcClient jdbcClient;

    /** Un dossier a confronter a SAF. */
    public record Dossier(Long id, String numeroMembre, String nom, String prenom, Long agenceId,
                          String agence, String pointVente, String etat, Long agentId,
                          java.time.LocalDateTime creeLe, boolean dejaSignale) {
    }

    /** Un membre de groupe a confronter a SAF. */
    public record Membre(Long membreId, Long demandeId, String numeroMembre, String nomPrenom) {
    }

    /** Un destinataire de signalement : le DA de l'agence, ou l'agent du dossier. */
    public record Contact(Long userId, String email, String nom, String role) {
    }

    /**
     * Les dossiers en cours non verifies, les plus anciens d'abord, par lots : le stock du
     * 26/10 compte pres de 2 800 dossiers et SAF n'a pas a les recevoir d'un coup.
     */
    public List<Dossier> aReverifier(int limite) {
        return jdbcClient.sql("""
                SELECT d.demandeindividuel_id, d.numero_membre, d.nom, d.prenom, d.agence, a.libele AS agence_libelle,
                       pv.libele AS point_vente, d.validation_state, d.agent_credit_affecte, d.createdat,
                       (d.membre_signale_at IS NOT NULL) AS deja_signale
                FROM demandeindividuel d
                LEFT JOIN agence a ON a.id = d.agence
                LEFT JOIN pointvente pv ON pv.id = d.pos
                WHERE d.membre_verifie_saf = FALSE AND NOT d.membre_inconnu_saf
                  AND""" + EN_COURS + """
                ORDER BY d.membre_reverifie_at NULLS FIRST, d.createdat
                LIMIT :limite
                """)
                .param("limite", limite)
                .query((rs, n) -> new Dossier(rs.getLong("demandeindividuel_id"), rs.getString("numero_membre"),
                        rs.getString("nom"), rs.getString("prenom"), (Long) rs.getObject("agence"),
                        rs.getString("agence_libelle"), rs.getString("point_vente"), rs.getString("validation_state"),
                        (Long) rs.getObject("agent_credit_affecte"),
                        rs.getObject("createdat", java.time.LocalDateTime.class), rs.getBoolean("deja_signale")))
                .list();
    }

    /** Les membres d'un dossier de groupe pas encore confirmes dans SAF. */
    public List<Membre> membresAReverifier(Long demandeId) {
        return jdbcClient.sql("""
                SELECT membre_groupe_id, demandeindividuel_id, numero_membre, nom_prenom
                FROM membre_groupe
                WHERE demandeindividuel_id = :id AND COALESCE(membre_verifie_saf, FALSE) = FALSE
                  AND NOT membre_inconnu_saf
                """)
                .param("id", demandeId)
                .query((rs, n) -> new Membre(rs.getLong("membre_groupe_id"), rs.getLong("demandeindividuel_id"),
                        rs.getString("numero_membre"), rs.getString("nom_prenom")))
                .list();
    }

    public void trouve(Long id, String nomSaf, String agenceSaf) {
        jdbcClient.sql("""
                UPDATE demandeindividuel
                SET membre_verifie_saf = TRUE, membre_inconnu_saf = FALSE, membre_nom_saf = :nom,
                    membre_agence_saf = :agence, membre_verifie_at = CURRENT_TIMESTAMP,
                    membre_reverifie_at = CURRENT_TIMESTAMP
                WHERE demandeindividuel_id = :id
                """)
                .param("nom", nomSaf).param("agence", agenceSaf).param("id", id).update();
    }

    public void inconnu(Long id) {
        jdbcClient.sql("""
                UPDATE demandeindividuel
                SET membre_inconnu_saf = TRUE, membre_reverifie_at = CURRENT_TIMESTAMP
                WHERE demandeindividuel_id = :id
                """)
                .param("id", id).update();
    }

    /** SAF n'a pas repondu : on note le passage, pour que le prochain lot prenne d'autres dossiers. */
    public void reporte(Long id) {
        jdbcClient.sql("UPDATE demandeindividuel SET membre_reverifie_at = CURRENT_TIMESTAMP WHERE demandeindividuel_id = :id")
                .param("id", id).update();
    }

    public void signale(Long id) {
        jdbcClient.sql("UPDATE demandeindividuel SET membre_signale_at = CURRENT_TIMESTAMP WHERE demandeindividuel_id = :id")
                .param("id", id).update();
    }

    public void membreTrouve(Long membreId, String nomSaf) {
        jdbcClient.sql("""
                UPDATE membre_groupe SET membre_verifie_saf = TRUE, membre_inconnu_saf = FALSE, membre_nom_saf = :nom
                WHERE membre_groupe_id = :id
                """)
                .param("nom", nomSaf).param("id", membreId).update();
    }

    public void membreInconnu(Long membreId) {
        jdbcClient.sql("UPDATE membre_groupe SET membre_inconnu_saf = TRUE WHERE membre_groupe_id = :id")
                .param("id", membreId).update();
    }

    /** Le directeur de l'agence du dossier, avec e-mail, compte actif. */
    public List<Contact> daDeLAgence(Long agenceId) {
        if (agenceId == null) {
            return List.of();
        }
        return jdbcClient.sql("""
                SELECT u.user_id, u.email, TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')) AS nom
                FROM users u
                JOIN user_roles ur ON ur.user_id = u.user_id
                JOIN roles r ON r.role_id = ur.role_id
                WHERE r.name = 'DA' AND u.agence_id = :agence
                  AND COALESCE(u.enabled, FALSE) AND u.email IS NOT NULL AND u.email <> ''
                """)
                .param("agence", agenceId)
                .query((rs, n) -> new Contact(rs.getLong("user_id"), rs.getString("email"), rs.getString("nom"), "DA"))
                .list();
    }

    /** L'agent de credit affecte au dossier, s'il a un e-mail et un compte actif. */
    public List<Contact> agentDuDossier(Long agentId) {
        if (agentId == null) {
            return List.of();
        }
        return jdbcClient.sql("""
                SELECT u.user_id, u.email, TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')) AS nom
                FROM users u
                WHERE u.user_id = :id AND COALESCE(u.enabled, FALSE) AND u.email IS NOT NULL AND u.email <> ''
                """)
                .param("id", agentId)
                .query((rs, n) -> new Contact(rs.getLong("user_id"), rs.getString("email"), rs.getString("nom"), "AGENT_CREDIT"))
                .list();
    }

    public int resteAReverifier() {
        Integer n = jdbcClient.sql("""
                SELECT count(*) FROM demandeindividuel d
                WHERE d.membre_verifie_saf = FALSE AND NOT d.membre_inconnu_saf AND""" + EN_COURS)
                .query(Integer.class).single();
        return n == null ? 0 : n;
    }
}
