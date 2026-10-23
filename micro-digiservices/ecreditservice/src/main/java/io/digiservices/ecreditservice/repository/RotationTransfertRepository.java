package io.digiservices.ecreditservice.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/** Transfert de la charge d'un agent lors d'une rotation (V170) et journal pour le tableau de bord du DA. */
@Repository
@RequiredArgsConstructor
public class RotationTransfertRepository {

    private final JdbcClient jdbcClient;

    private static final String EN_COURS = """
            COALESCE(statut_demande, '') NOT IN ('REJET', 'REJECTED', 'ANNULE')
            AND COALESCE(validation_state, '') <> 'VALIDATED_FINAL'
            """;

    /** Ids des dossiers en cours portes par l'agent (comme agent de credit ou comme accueil en correction). */
    public List<Long> dossiersATransferer(Long agentUserId) {
        return jdbcClient.sql("SELECT demandeindividuel_id FROM demandeindividuel WHERE " + EN_COURS
                        + " AND (agent_credit_affecte = :id OR (saisie_par = :id AND validation_state = 'CORRECTION_ACCUEIL')) ORDER BY 1")
                .param("id", agentUserId).query(Long.class).list();
    }

    public void acteur(String acteur) {
        jdbcClient.sql("SELECT set_config('app.acteur', :acteur, true)").param("acteur", acteur).query(String.class).optional();
    }

    /** Les dossiers en cours changent d'agent de credit ; les saisies d'accueil en cours passent aussi au nouvel agent. */
    public int transfererDossiersCredit(Long de, Long vers, String affectePar) {
        return jdbcClient.sql("""
                UPDATE demandeindividuel
                   SET agent_credit_affecte = :vers, affecte_par_da = :par, date_affectation_ac = CURRENT_TIMESTAMP
                 WHERE agent_credit_affecte = :de AND """ + EN_COURS)
                .param("de", de).param("vers", vers).param("par", affectePar).update();
    }

    public int transfererSaisiesAccueil(Long de, Long vers, String nomVers) {
        return jdbcClient.sql("""
                UPDATE demandeindividuel
                   SET saisie_par = :vers, saisie_par_role = 'AGENT_CREDIT', cod_usuarios = :nom
                 WHERE saisie_par = :de AND """ + EN_COURS)
                .param("de", de).param("vers", vers).param("nom", nomVers).update();
    }

    public void journaliser(List<Long> ids, Long de, Long vers, String acteur, String motif) {
        for (Long id : ids) {
            jdbcClient.sql("""
                    INSERT INTO demande_etat_historique (demandeindividuel_id, evenement, ancien_etat, nouvel_etat,
                                                         ancien_statut, nouveau_statut, ancien_agent, nouvel_agent, acteur, motif)
                    SELECT demandeindividuel_id, 'REATTRIBUTION', validation_state, validation_state, statut_demande, statut_demande,
                           :de, :vers, :acteur, :motif
                    FROM demandeindividuel WHERE demandeindividuel_id = :id
                    """).param("id", id).param("de", de).param("vers", vers).param("acteur", acteur).param("motif", motif).update();
        }
    }

    /** Affectations de portefeuille actives de l'agent : fermees et rouvertes sur le nouvel agent, meme type. */
    public int transfererPortefeuille(Long de, Long vers, Long parUserId, String motif) {
        List<Map<String, Object>> actives = jdbcClient.sql("""
                SELECT id, cod_agencia, num_credito, cod_cliente, type_affectation
                FROM portefeuille_affectation WHERE actif AND agent_user_id = :de
                """).param("de", de).query().listOfRows();
        for (Map<String, Object> a : actives) {
            jdbcClient.sql("""
                    UPDATE portefeuille_affectation
                       SET actif = FALSE, date_fin = CURRENT_TIMESTAMP, fin_par_user_id = :par, motif_fin = :motif
                     WHERE id = :id
                    """).param("id", a.get("id")).param("par", parUserId).param("motif", motif).update();
            jdbcClient.sql("""
                    INSERT INTO portefeuille_affectation
                        (cod_agencia, num_credito, cod_cliente, agent_user_id, affecte_par_user_id, motif, type_affectation)
                    VALUES (:codAgencia, :numCredito, :codCliente, :vers, :par, :motif, :type)
                    """).param("codAgencia", a.get("cod_agencia")).param("numCredito", a.get("num_credito"))
                    .param("codCliente", a.get("cod_cliente")).param("vers", vers).param("par", parUserId)
                    .param("motif", motif).param("type", a.get("type_affectation")).update();
        }
        return actives.size();
    }

    public int transfererDesignations(Long de, Long vers, Long parUserId) {
        List<String> codes = jdbcClient.sql("SELECT cod_agencia FROM rapport_saisie_designation WHERE actif AND agent_user_id = :de")
                .param("de", de).query(String.class).list();
        for (String code : codes) {
            jdbcClient.sql("""
                    UPDATE rapport_saisie_designation SET actif = FALSE, date_fin = CURRENT_TIMESTAMP, fin_par_user_id = :par
                     WHERE actif AND agent_user_id = :de AND cod_agencia = :code
                    """).param("de", de).param("code", code).param("par", parUserId).update();
            jdbcClient.sql("""
                    INSERT INTO rapport_saisie_designation (cod_agencia, agent_user_id, designe_par_user_id)
                    SELECT :code, :vers, :par
                    WHERE NOT EXISTS (SELECT 1 FROM rapport_saisie_designation WHERE actif AND cod_agencia = :code AND agent_user_id = :vers)
                    """).param("code", code).param("vers", vers).param("par", parUserId).update();
        }
        return codes.size();
    }

    public Long enregistrer(Long de, Long vers, Long ancienPs, Long nouveauPs, Long agenceId, Long parUserId, String motif,
                            int nbCredit, int nbAccueil, int nbPortefeuille, int nbDesignations, List<Long> ids) {
        return jdbcClient.sql("""
                INSERT INTO rotation_transfert (agent_user_id, vers_agent_user_id, ancien_pointvente_id, nouveau_pointvente_id, agence_id,
                                                par_user_id, motif, nb_dossiers_credit, nb_dossiers_accueil, nb_portefeuille, nb_designations, dossiers_ids)
                VALUES (:de, :vers, :ancienPs, :nouveauPs, :agence, :par, :motif, :nbCredit, :nbAccueil, :nbPortefeuille, :nbDesignations, :ids)
                RETURNING id
                """).param("de", de).param("vers", vers).param("ancienPs", ancienPs).param("nouveauPs", nouveauPs)
                .param("agence", agenceId).param("par", parUserId).param("motif", motif)
                .param("nbCredit", nbCredit).param("nbAccueil", nbAccueil).param("nbPortefeuille", nbPortefeuille)
                .param("nbDesignations", nbDesignations)
                .param("ids", ids.stream().map(String::valueOf).collect(java.util.stream.Collectors.joining(",")))
                .query(Long.class).single();
    }

    private static final String SELECT_TRANSFERT = """
            SELECT t.id, t.date_transfert, t.motif, t.nb_dossiers_credit, t.nb_dossiers_accueil, t.nb_portefeuille, t.nb_designations,
                   t.dossiers_ids, t.acquitte, t.date_acquittement, t.agence_id,
                   TRIM(COALESCE(ua.first_name,'') || ' ' || COALESCE(ua.last_name,'')) AS agent,
                   TRIM(COALESCE(uv.first_name,'') || ' ' || COALESCE(uv.last_name,'')) AS vers,
                   TRIM(COALESCE(up.first_name,'') || ' ' || COALESCE(up.last_name,'')) AS par,
                   pa.libele AS ancien_point_vente, pn.libele AS nouveau_point_vente
            FROM rotation_transfert t
            JOIN users ua ON ua.user_id = t.agent_user_id
            JOIN users uv ON uv.user_id = t.vers_agent_user_id
            LEFT JOIN users up ON up.user_id = t.par_user_id
            LEFT JOIN pointvente pa ON pa.id = t.ancien_pointvente_id
            LEFT JOIN pointvente pn ON pn.id = t.nouveau_pointvente_id
            """;

    public List<Map<String, Object>> aAcquitter(Long agenceId) {
        return jdbcClient.sql(SELECT_TRANSFERT + " WHERE NOT t.acquitte AND t.agence_id = :agence ORDER BY t.date_transfert DESC")
                .param("agence", agenceId).query().listOfRows();
    }

    public Map<String, Object> transfert(Long id) {
        return jdbcClient.sql(SELECT_TRANSFERT + " WHERE t.id = :id").param("id", id).query().listOfRows().stream().findFirst().orElse(null);
    }

    public int acquitter(Long id, Long agenceId, Long parUserId) {
        return jdbcClient.sql("""
                UPDATE rotation_transfert SET acquitte = TRUE, acquitte_par_user_id = :par, date_acquittement = CURRENT_TIMESTAMP
                 WHERE id = :id AND agence_id = :agence AND NOT acquitte
                """).param("id", id).param("agence", agenceId).param("par", parUserId).update();
    }

    public List<Map<String, Object>> dossiers(List<Long> ids) {
        if (ids.isEmpty()) return List.of();
        return jdbcClient.sql("""
                SELECT d.demandeindividuel_id AS id, d.nom, d.prenom, d.numero_membre, d.validation_state AS etat, d.statut_demande AS statut,
                       d.montant_demande, pv.libele AS point_vente,
                       TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')) AS agent_actuel
                FROM demandeindividuel d
                LEFT JOIN pointvente pv ON pv.id = d.pos
                LEFT JOIN users u ON u.user_id = d.agent_credit_affecte
                WHERE d.demandeindividuel_id IN (:ids) ORDER BY d.demandeindividuel_id
                """).param("ids", ids).query().listOfRows();
    }

    public List<Map<String, Object>> daDeAgence(Long agenceId) {
        return jdbcClient.sql("""
                SELECT u.user_id, u.email, TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')) AS nom
                FROM users u JOIN user_roles ur ON ur.user_id = u.user_id JOIN roles r ON r.role_id = ur.role_id
                WHERE r.name = 'DA' AND u.agence_id = :agence AND COALESCE(u.enabled, TRUE) AND u.email IS NOT NULL AND u.email <> ''
                """).param("agence", agenceId).query().listOfRows();
    }
}
