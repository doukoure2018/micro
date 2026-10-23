package io.digiservices.ecreditservice.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Ce qu'un agent porte en cours (rotation, lot 1) : dossiers de credit comme agent affecte et
 * comme agent d'accueil, affectations de portefeuille SAF, designations pour la saisie des
 * rapports. Lu avant une rotation, ou pour comprendre ce qu'un depart laisse derriere lui.
 */
@Repository
@RequiredArgsConstructor
public class AgentChargeRepository {

    private final JdbcClient jdbcClient;

    private static final String EN_COURS = """
            COALESCE(d.statut_demande, '') NOT IN ('REJET', 'REJECTED', 'ANNULE')
            AND COALESCE(d.validation_state, '') NOT IN ('VALIDATED_FINAL')
            """;

    public Map<String, Object> agent(Long userId) {
        return jdbcClient.sql("""
                SELECT u.user_id, TRIM(COALESCE(u.first_name, '') || ' ' || COALESCE(u.last_name, '')) AS nom,
                       u.pointvente_id, pv.libele AS point_vente, pv.code AS cod_agencia, u.agence_id, a.libele AS agence,
                       COALESCE(u.enabled, TRUE) AS actif
                FROM users u
                LEFT JOIN pointvente pv ON pv.id = u.pointvente_id
                LEFT JOIN agence a ON a.id = u.agence_id
                WHERE u.user_id = :id
                """).param("id", userId).query().listOfRows().stream().findFirst().orElse(null);
    }

    /** Dossiers en cours ou l'agent est l'agent de credit affecte, par etat. */
    public List<Map<String, Object>> dossiersCredit(Long userId) {
        return parEtat("agent_credit_affecte", userId);
    }

    /** Dossiers en cours que l'agent a saisis a l'accueil (il reste responsable des corrections accueil). */
    public List<Map<String, Object>> dossiersAccueil(Long userId) {
        return parEtat("saisie_par", userId);
    }

    private List<Map<String, Object>> parEtat(String colonne, Long userId) {
        List<Map<String, Object>> liste = new ArrayList<>();
        jdbcClient.sql("SELECT d.validation_state AS etat, COUNT(*) AS nb, "
                        + "COUNT(*) FILTER (WHERE d.pos IS DISTINCT FROM (SELECT pointvente_id FROM users WHERE user_id = :id)) AS hors_ps "
                        + "FROM demandeindividuel d WHERE d." + colonne + " = :id AND " + EN_COURS
                        + " GROUP BY d.validation_state ORDER BY nb DESC")
                .param("id", userId)
                .query((rs, n) -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("etat", rs.getString("etat"));
                    m.put("nb", rs.getLong("nb"));
                    m.put("horsPointService", rs.getLong("hors_ps"));
                    return liste.add(m);
                }).list();
        return liste;
    }

    /** Dossiers en cours de l'agent (credit ou accueil), pour la liste a reattribuer. */
    public List<Map<String, Object>> listeDossiers(Long userId) {
        return jdbcClient.sql("""
                SELECT d.demandeindividuel_id AS id, d.nom, d.prenom, d.numero_membre, d.validation_state AS etat,
                       d.montant_demande, pv.libele AS point_vente, d.pos,
                       (d.agent_credit_affecte = :id) AS comme_agent, (d.saisie_par = :id) AS comme_accueil,
                       d.createdat
                FROM demandeindividuel d
                LEFT JOIN pointvente pv ON pv.id = d.pos
                WHERE (d.agent_credit_affecte = :id OR d.saisie_par = :id) AND """ + EN_COURS + """
                ORDER BY d.createdat DESC
                """).param("id", userId).query().listOfRows();
    }

    /**
     * Dossiers en cours portes par un agent qui n'est plus la (lot 3) : agent de credit affecte
     * parti du point de service ou desactive, ou correction accueil dont l'agent d'accueil est
     * parti. Filtre par agence (DA) ou par delegation (DR).
     */
    public List<Map<String, Object>> dossiersOrphelins(Long agenceId, Long delegationId) {
        String perimetre = agenceId != null ? " AND d.agence = :agence " : delegationId != null ? " AND d.delegation = :delegation " : "";
        var spec = jdbcClient.sql("""
                SELECT d.demandeindividuel_id AS id, d.nom, d.prenom, d.numero_membre, d.montant_demande,
                       d.validation_state AS etat, d.createdat, d.pos, pv.libele AS point_vente, d.agence, a.libele AS agence_libelle,
                       d.agent_credit_affecte, TRIM(COALESCE(ua.first_name,'') || ' ' || COALESCE(ua.last_name,'')) AS agent,
                       pva.libele AS agent_point_vente, COALESCE(ua.enabled, TRUE) AS agent_actif,
                       d.saisie_par, TRIM(COALESCE(us.first_name,'') || ' ' || COALESCE(us.last_name,'')) AS accueil,
                       pvs.libele AS accueil_point_vente,
                       -- Pas d apostrophe doublee ici : le parseur de parametres nommes de Spring ne la comprend pas
                       -- et prend ensuite le « ? » d un libelle pour un parametre (bad SQL grammar, 23/10/2026).
                       CASE
                         WHEN d.validation_state = 'CORRECTION_ACCUEIL' AND us.user_id IS NOT NULL AND us.pointvente_id IS DISTINCT FROM d.pos
                              THEN 'Agent accueil mute a ' || COALESCE(pvs.libele, 'un autre PS') || ' : personne ne peut corriger'
                         WHEN ua.user_id IS NOT NULL AND NOT COALESCE(ua.enabled, TRUE) THEN 'Compte de l agent de credit desactive'
                         WHEN ua.user_id IS NOT NULL AND ua.pointvente_id IS DISTINCT FROM d.pos THEN 'Agent de credit mute a ' || COALESCE(pva.libele, 'un autre PS')
                         ELSE 'Agent de credit introuvable'
                       END AS raison
                FROM demandeindividuel d
                LEFT JOIN pointvente pv ON pv.id = d.pos
                LEFT JOIN agence a ON a.id = d.agence
                LEFT JOIN users ua ON ua.user_id = d.agent_credit_affecte
                LEFT JOIN pointvente pva ON pva.id = ua.pointvente_id
                LEFT JOIN users us ON us.user_id = d.saisie_par
                LEFT JOIN pointvente pvs ON pvs.id = us.pointvente_id
                WHERE """ + EN_COURS + perimetre + """
                  AND d.validation_state IN ('AFFECTEE', 'SELECTION', 'CORRECTION', 'CORRECTION_DR', 'CORRECTION_DE', 'RETOUR_AGENT', 'CORRECTION_ACCUEIL')
                  AND (
                        (d.agent_credit_affecte IS NOT NULL AND (ua.user_id IS NULL OR NOT COALESCE(ua.enabled, TRUE) OR ua.pointvente_id IS DISTINCT FROM d.pos))
                     OR (d.validation_state = 'CORRECTION_ACCUEIL' AND us.user_id IS NOT NULL AND us.pointvente_id IS DISTINCT FROM d.pos)
                  )
                ORDER BY a.libele, pv.libele, d.createdat
                """);
        if (agenceId != null) spec = spec.param("agence", agenceId);
        if (delegationId != null) spec = spec.param("delegation", delegationId);
        return spec.query().listOfRows();
    }

    public Map<String, Object> portefeuille(Long userId) {
        return jdbcClient.sql("""
                SELECT COUNT(*) AS nb, COUNT(DISTINCT cod_agencia) AS nb_ps,
                       COUNT(*) FILTER (WHERE type_affectation = 'CONTENTIEUX') AS nb_contentieux
                FROM portefeuille_affectation WHERE actif AND agent_user_id = :id
                """).param("id", userId).query().listOfRows().stream().findFirst().orElse(Map.of());
    }

    public List<String> designations(Long userId) {
        return jdbcClient.sql("SELECT cod_agencia FROM rapport_saisie_designation WHERE actif AND agent_user_id = :id")
                .param("id", userId).query(String.class).list();
    }
}
