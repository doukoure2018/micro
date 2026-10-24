package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.UsagePlateformeDtos.DelegationDto;
import io.digiservices.ecreditservice.dto.UsagePlateformeDtos.ExecutionDto;
import io.digiservices.ecreditservice.dto.UsagePlateformeDtos.RoleDto;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Barometre d'usage (V174, lot 1) : les sept familles d'indicateurs, lues sur une periode
 * [debut, fin[ et, s'il y a lieu, sur une seule delegation.
 *
 * <p>Regle commune : {@code :delegationId} vaut NULL pour le reseau entier, et chaque requete
 * porte la condition {@code (:delegationId IS NULL OR ... = :delegationId)}. Le rattachement
 * d'un compte se lit en cascade : point de service, puis agence, puis delegation directe —
 * c'est ainsi que les DA (rattaches a une agence) et les DR (a une delegation) sont comptes.</p>
 */
@Repository
@RequiredArgsConstructor
public class UsagePlateformeRepository {

    /**
     * Rattachement d'un utilisateur a sa delegation, par point de service, agence ou direct.
     * Les requetes portent les jetons {@code {JOINS}} et {@code {DELEG}} ; {@link #sql(String)}
     * les remplace. On evite ainsi de couper un bloc de texte par des concatenations, ou un
     * espace de fin de ligne perdu colle deux mots-cles SQL.
     */
    private static final String JOINS = """
            LEFT JOIN pointvente pv ON pv.id = u.pointvente_id
            LEFT JOIN agence a1 ON a1.id = pv.agence_id
            LEFT JOIN agence a2 ON a2.id = u.agence_id""";
    private static final String DELEG = "COALESCE(a1.delegation_id, a2.delegation_id, u.delegation_id)";

    private static String sql(String requete) {
        return requete.replace("{JOINS}", JOINS).replace("{DELEG}", DELEG);
    }

    private final JdbcClient jdbcClient;

    // ==================== 1. Adoption ====================

    /** Connexions et utilisateurs distincts, jour par jour. */
    public Map<LocalDate, int[]> connexionsParJour(LocalDateTime debut, LocalDateTime fin, Long delegationId) {
        Map<LocalDate, int[]> m = new LinkedHashMap<>();
        jdbcClient.sql(sql("""
                SELECT dv.created_at::date AS jour, count(*) AS connexions, count(DISTINCT dv.user_id) AS utilisateurs
                FROM devices dv JOIN users u ON u.user_id = dv.user_id
                {JOINS}
                WHERE dv.created_at >= :debut AND dv.created_at < :fin
                  AND (:delegationId IS NULL OR {DELEG} = :delegationId)
                GROUP BY 1 ORDER BY 1
                """))
                .param("debut", debut).param("fin", fin).param("delegationId", delegationId)
                .query((rs, n) -> m.put(rs.getDate("jour").toLocalDate(),
                        new int[]{rs.getInt("connexions"), rs.getInt("utilisateurs")}))
                .list();
        return m;
    }

    /** Totaux de la periode : connexions et utilisateurs distincts (un utilisateur compte une fois). */
    public int[] connexionsTotal(LocalDateTime debut, LocalDateTime fin, Long delegationId) {
        return jdbcClient.sql(sql("""
                SELECT count(*) AS connexions, count(DISTINCT dv.user_id) AS utilisateurs
                FROM devices dv JOIN users u ON u.user_id = dv.user_id
                {JOINS}
                WHERE dv.created_at >= :debut AND dv.created_at < :fin
                  AND (:delegationId IS NULL OR {DELEG} = :delegationId)
                """))
                .param("debut", debut).param("fin", fin).param("delegationId", delegationId)
                .query((rs, n) -> new int[]{rs.getInt("connexions"), rs.getInt("utilisateurs")})
                .single();
    }

    /** Comptes, actifs et connexions par role. */
    public List<RoleDto> parRole(LocalDateTime debut, LocalDateTime fin, Long delegationId) {
        return jdbcClient.sql(sql("""
                SELECT r.name AS role, count(DISTINCT u.user_id) AS comptes,
                       count(DISTINCT dv.user_id) AS actifs, count(dv.device_id) AS connexions
                FROM users u
                JOIN user_roles ur ON ur.user_id = u.user_id
                JOIN roles r ON r.role_id = ur.role_id
                {JOINS}
                LEFT JOIN devices dv ON dv.user_id = u.user_id AND dv.created_at >= :debut AND dv.created_at < :fin
                WHERE COALESCE(u.enabled, FALSE)
                  AND (:delegationId IS NULL OR {DELEG} = :delegationId)
                GROUP BY r.name ORDER BY count(DISTINCT u.user_id) DESC
                """))
                .param("debut", debut).param("fin", fin).param("delegationId", delegationId)
                .query((rs, n) -> RoleDto.builder().role(rs.getString("role"))
                        .comptes(rs.getInt("comptes")).actifs(rs.getInt("actifs"))
                        .connexions(rs.getInt("connexions")).build())
                .list();
    }

    /** Comptes actifs n'ayant jamais ouvert de session. */
    public int jamaisConnectes(Long delegationId) {
        return jdbcClient.sql(sql("""
                SELECT count(*) FROM users u
                {JOINS}
                WHERE COALESCE(u.enabled, FALSE) AND u.last_login IS NULL
                  AND (:delegationId IS NULL OR {DELEG} = :delegationId)
                """))
                .param("delegationId", delegationId).query(Integer.class).single();
    }

    // ==================== 2 et 3. Couverture et activite credit ====================

    /** Points de service ayant cree au moins un dossier, et total du perimetre. */
    public int[] couverture(LocalDateTime debut, LocalDateTime fin, Long delegationId) {
        return jdbcClient.sql(sql("""
                SELECT (SELECT count(DISTINCT di.pos) FROM demandeindividuel di
                         WHERE di.createdat >= :debut AND di.createdat < :fin
                           AND (:delegationId IS NULL OR di.delegation = :delegationId)) AS producteurs,
                       (SELECT count(*) FROM pointvente p LEFT JOIN agence a ON a.id = p.agence_id
                         WHERE (:delegationId IS NULL OR a.delegation_id = :delegationId)) AS total
                """))
                .param("debut", debut).param("fin", fin).param("delegationId", delegationId)
                .query((rs, n) -> new int[]{rs.getInt("producteurs"), rs.getInt("total")})
                .single();
    }

    /** Dossiers crees par jour, par nature. */
    public Map<LocalDate, int[]> dossiersParJour(LocalDateTime debut, LocalDateTime fin, Long delegationId) {
        Map<LocalDate, int[]> m = new LinkedHashMap<>();
        jdbcClient.sql(sql("""
                SELECT di.createdat::date AS jour, count(*) AS total,
                       count(dg.demande_groupe_id) AS groupe, count(df.demande_fonctionnaire_id) AS fonctionnaire
                FROM demandeindividuel di
                LEFT JOIN demande_groupe dg ON dg.demandeindividuel_id = di.demandeindividuel_id
                LEFT JOIN demande_fonctionnaire df ON df.demandeindividuel_id = di.demandeindividuel_id
                WHERE di.createdat >= :debut AND di.createdat < :fin
                  AND (:delegationId IS NULL OR di.delegation = :delegationId)
                GROUP BY 1 ORDER BY 1
                """))
                .param("debut", debut).param("fin", fin).param("delegationId", delegationId)
                .query((rs, n) -> m.put(rs.getDate("jour").toLocalDate(),
                        new int[]{rs.getInt("total"), rs.getInt("groupe"), rs.getInt("fonctionnaire")}))
                .list();
        return m;
    }

    /** Dossiers crees dans la periode : total, groupes, fonctionnaires. */
    public int[] dossiersCrees(LocalDateTime debut, LocalDateTime fin, Long delegationId) {
        return jdbcClient.sql(sql("""
                SELECT count(*) AS total, count(dg.demande_groupe_id) AS groupe,
                       count(df.demande_fonctionnaire_id) AS fonctionnaire
                FROM demandeindividuel di
                LEFT JOIN demande_groupe dg ON dg.demandeindividuel_id = di.demandeindividuel_id
                LEFT JOIN demande_fonctionnaire df ON df.demandeindividuel_id = di.demandeindividuel_id
                WHERE di.createdat >= :debut AND di.createdat < :fin
                  AND (:delegationId IS NULL OR di.delegation = :delegationId)
                """))
                .param("debut", debut).param("fin", fin).param("delegationId", delegationId)
                .query((rs, n) -> new int[]{rs.getInt("total"), rs.getInt("groupe"), rs.getInt("fonctionnaire")})
                .single();
    }

    /** Dossiers valides en derniere instance DANS la periode, et montant demande correspondant. */
    public Object[] validesDansLaPeriode(LocalDateTime debut, LocalDateTime fin, Long delegationId) {
        return jdbcClient.sql(sql("""
                SELECT count(DISTINCT h.demandeindividuel_id) AS dossiers,
                       COALESCE(sum(dc.montant_demande), 0) AS montant
                FROM demande_etat_historique h
                JOIN demandeindividuel di ON di.demandeindividuel_id = h.demandeindividuel_id
                LEFT JOIN dossiers_credit dc ON dc.demandeindividuel_id = h.demandeindividuel_id
                WHERE h.nouvel_etat = 'VALIDATED_FINAL'
                  AND h.date_evenement >= :debut AND h.date_evenement < :fin
                  AND (:delegationId IS NULL OR di.delegation = :delegationId)
                """))
                .param("debut", debut).param("fin", fin).param("delegationId", delegationId)
                .query((rs, n) -> new Object[]{rs.getInt("dossiers"), rs.getBigDecimal("montant")})
                .single();
    }

    // ==================== 4. Fluidite du circuit ====================

    /** Evenements, acteurs, rejets, annulations, reattributions, delais. */
    public Object[] circuit(LocalDateTime debut, LocalDateTime fin, Long delegationId) {
        return jdbcClient.sql(sql("""
                SELECT count(*) AS evenements, count(DISTINCT h.acteur) AS acteurs,
                       count(*) FILTER (WHERE h.nouveau_statut = 'REJET') AS rejets,
                       count(*) FILTER (WHERE COALESCE(h.nouveau_statut,'') ILIKE '%ANNUL%'
                                           OR COALESCE(h.nouvel_etat,'') ILIKE '%ANNUL%') AS annulations,
                       count(*) FILTER (WHERE h.evenement = 'REATTRIBUTION') AS reattributions
                FROM demande_etat_historique h
                JOIN demandeindividuel di ON di.demandeindividuel_id = h.demandeindividuel_id
                WHERE h.date_evenement >= :debut AND h.date_evenement < :fin
                  AND (:delegationId IS NULL OR di.delegation = :delegationId)
                """))
                .param("debut", debut).param("fin", fin).param("delegationId", delegationId)
                .query((rs, n) -> new Object[]{rs.getInt("evenements"), rs.getInt("acteurs"), rs.getInt("rejets"),
                        rs.getInt("annulations"), rs.getInt("reattributions")})
                .single();
    }

    /** Delai de la creation a la validation finale, pour les dossiers valides dans la periode. */
    public BigDecimal[] delais(LocalDateTime debut, LocalDateTime fin, Long delegationId) {
        return jdbcClient.sql(sql("""
                SELECT round(percentile_cont(0.5) WITHIN GROUP (
                           ORDER BY EXTRACT(EPOCH FROM (h.date_evenement - di.createdat)) / 86400)::numeric, 1) AS mediane,
                       round(avg(EXTRACT(EPOCH FROM (h.date_evenement - di.createdat)) / 86400)::numeric, 1) AS moyenne
                FROM demande_etat_historique h
                JOIN demandeindividuel di ON di.demandeindividuel_id = h.demandeindividuel_id
                WHERE h.nouvel_etat = 'VALIDATED_FINAL'
                  AND h.date_evenement >= :debut AND h.date_evenement < :fin
                  AND (:delegationId IS NULL OR di.delegation = :delegationId)
                """))
                .param("debut", debut).param("fin", fin).param("delegationId", delegationId)
                .query((rs, n) -> new BigDecimal[]{rs.getBigDecimal("mediane"), rs.getBigDecimal("moyenne")})
                .single();
    }

    // ==================== 5. Suivi du portefeuille ====================

    /** Affectations faites et closes dans la periode, etat au terme de la periode. */
    public int[] portefeuille(LocalDateTime debut, LocalDateTime fin, Long delegationId) {
        return jdbcClient.sql(sql("""
                SELECT count(*) FILTER (WHERE pa.date_affectation >= :debut AND pa.date_affectation < :fin) AS faites,
                       count(DISTINCT pa.affecte_par_user_id) FILTER (
                           WHERE pa.date_affectation >= :debut AND pa.date_affectation < :fin) AS da_ayant_affecte,
                       count(*) FILTER (WHERE pa.date_fin >= :debut AND pa.date_fin < :fin) AS closes,
                       count(*) FILTER (WHERE pa.actif) AS actives,
                       count(DISTINCT pa.agent_user_id) FILTER (WHERE pa.actif) AS agents
                FROM portefeuille_affectation pa
                JOIN pointvente p ON p.code = pa.cod_agencia
                LEFT JOIN agence a ON a.id = p.agence_id
                WHERE (:delegationId IS NULL OR a.delegation_id = :delegationId)
                """))
                .param("debut", debut).param("fin", fin).param("delegationId", delegationId)
                .query((rs, n) -> new int[]{rs.getInt("faites"), rs.getInt("da_ayant_affecte"), rs.getInt("closes"),
                        rs.getInt("actives"), rs.getInt("agents")})
                .single();
    }

    /** Agents notes par le calcul nocturne, jour par jour. */
    public Map<LocalDate, Integer> agentsNotesParJour(LocalDate debut, LocalDate fin, Long delegationId) {
        Map<LocalDate, Integer> m = new LinkedHashMap<>();
        jdbcClient.sql(sql("""
                SELECT s.date_calcul AS jour, count(DISTINCT s.agent_user_id) AS agents
                FROM portefeuille_score_agent s
                JOIN pointvente p ON p.code = s.cod_agencia
                LEFT JOIN agence a ON a.id = p.agence_id
                WHERE s.date_calcul >= :debut AND s.date_calcul < :fin
                  AND (:delegationId IS NULL OR a.delegation_id = :delegationId)
                GROUP BY 1 ORDER BY 1
                """))
                .param("debut", debut).param("fin", fin).param("delegationId", delegationId)
                .query((rs, n) -> m.put(rs.getDate("jour").toLocalDate(), rs.getInt("agents")))
                .list();
        return m;
    }

    // ==================== 6. Alertes du portefeuille ====================

    /** Envois d'alertes de la periode, par type. */
    public Map<String, Integer> alertesParType(LocalDateTime debut, LocalDateTime fin, Long delegationId) {
        Map<String, Integer> m = new LinkedHashMap<>();
        jdbcClient.sql(sql("""
                SELECT type, count(*) AS nb FROM alerte_envoi
                WHERE date_envoi >= :debut AND date_envoi < :fin
                  AND (:delegationId IS NULL OR delegation_id = :delegationId OR delegation_id IS NULL)
                GROUP BY 1
                """))
                .param("debut", debut).param("fin", fin).param("delegationId", delegationId)
                .query((rs, n) -> m.put(rs.getString("type"), rs.getInt("nb")))
                .list();
        return m;
    }

    /** Passages du planificateur dans la periode. */
    public List<ExecutionDto> executions(LocalDateTime debut, LocalDateTime fin) {
        return jdbcClient.sql(sql("""
                SELECT job, statut, tentative, nb_echeances, nb_impayes, nb_agents, nb_da, nb_dr, nb_de,
                       message, date_execution
                FROM alerte_execution
                WHERE date_execution >= :debut AND date_execution < :fin
                ORDER BY date_execution
                """))
                .param("debut", debut).param("fin", fin)
                .query((rs, n) -> ExecutionDto.builder()
                        .job(rs.getString("job")).statut(rs.getString("statut"))
                        .tentative(rs.getInt("tentative"))
                        .nbEcheances((Integer) rs.getObject("nb_echeances"))
                        .nbImpayes((Integer) rs.getObject("nb_impayes"))
                        .nbAgents((Integer) rs.getObject("nb_agents"))
                        .nbDa((Integer) rs.getObject("nb_da"))
                        .nbDr((Integer) rs.getObject("nb_dr"))
                        .nbDe((Integer) rs.getObject("nb_de"))
                        .message(rs.getString("message"))
                        .jour(rs.getTimestamp("date_execution").toLocalDateTime().toLocalDate())
                        .heure(String.format("%02d h %02d", rs.getTimestamp("date_execution").toLocalDateTime().getHour(),
                                rs.getTimestamp("date_execution").toLocalDateTime().getMinute()))
                        .build())
                .list();
    }

    // ==================== 7. Qualite des donnees ====================

    /** Fiches corrigees, corrections annulees, demandes de telephone, signalements. */
    public int[] qualite(LocalDateTime debut, LocalDateTime fin, Long delegationId) {
        return jdbcClient.sql(sql("""
                SELECT (SELECT count(DISTINCT mc.cod_cliente) FROM motif_correction mc
                         LEFT JOIN pointvente p ON p.code = mc.cod_agence
                         LEFT JOIN agence a ON a.id = p.agence_id
                         WHERE mc.created_at >= :debut AND mc.created_at < :fin
                           AND (:delegationId IS NULL OR a.delegation_id = :delegationId)) AS fiches,
                       (SELECT count(*) FROM motif_correction mc
                         LEFT JOIN pointvente p ON p.code = mc.cod_agence
                         LEFT JOIN agence a ON a.id = p.agence_id
                         WHERE mc.date_annulation >= :debut AND mc.date_annulation < :fin
                           AND (:delegationId IS NULL OR a.delegation_id = :delegationId)) AS annulees,
                       (SELECT count(*) FROM demande_changement_telephone t
                         WHERE t.created_at >= :debut AND t.created_at < :fin
                           AND (:delegationId IS NULL OR t.delegation_id = :delegationId)) AS telephones,
                       (SELECT count(*) FROM signalement_telephone s
                         WHERE s.signale_at >= :debut AND s.signale_at < :fin
                           AND (:delegationId IS NULL OR s.delegation_id = :delegationId)) AS signalements
                """))
                .param("debut", debut).param("fin", fin).param("delegationId", delegationId)
                .query((rs, n) -> new int[]{rs.getInt("fiches"), rs.getInt("annulees"),
                        rs.getInt("telephones"), rs.getInt("signalements")})
                .single();
    }

    // ==================== Par delegation ====================

    /** Une ligne par delegation : adoption, production, portefeuille. */
    public List<DelegationDto> parDelegation(LocalDateTime debut, LocalDateTime fin, Long delegationId) {
        return jdbcClient.sql(sql("""
                WITH comptes AS (
                    SELECT {DELEG} AS delegation_id,
                           count(DISTINCT u.user_id) AS comptes,
                           count(DISTINCT dv.user_id) AS actifs,
                           count(dv.device_id) AS connexions
                    FROM users u
                    {JOINS}
                    LEFT JOIN devices dv ON dv.user_id = u.user_id AND dv.created_at >= :debut AND dv.created_at < :fin
                    WHERE COALESCE(u.enabled, FALSE)
                    GROUP BY 1
                ), dossiers AS (
                    SELECT di.delegation AS delegation_id, count(*) AS crees,
                           count(DISTINCT di.pos) AS ps_producteurs
                    FROM demandeindividuel di
                    WHERE di.createdat >= :debut AND di.createdat < :fin
                    GROUP BY 1
                ), valides AS (
                    SELECT di.delegation AS delegation_id, count(DISTINCT h.demandeindividuel_id) AS valides
                    FROM demande_etat_historique h JOIN demandeindividuel di ON di.demandeindividuel_id = h.demandeindividuel_id
                    WHERE h.nouvel_etat = 'VALIDATED_FINAL' AND h.date_evenement >= :debut AND h.date_evenement < :fin
                    GROUP BY 1
                ), affect AS (
                    SELECT a.delegation_id, count(*) AS affectations
                    FROM portefeuille_affectation pa JOIN pointvente p ON p.code = pa.cod_agencia
                    JOIN agence a ON a.id = p.agence_id
                    WHERE pa.date_affectation >= :debut AND pa.date_affectation < :fin
                    GROUP BY 1
                ), ps AS (
                    SELECT a.delegation_id, count(*) AS ps_total
                    FROM pointvente p JOIN agence a ON a.id = p.agence_id GROUP BY 1
                )
                SELECT d.id, d.libele AS libelle,
                       COALESCE(c.comptes, 0) AS comptes, COALESCE(c.actifs, 0) AS actifs,
                       COALESCE(c.connexions, 0) AS connexions,
                       COALESCE(do.crees, 0) AS crees, COALESCE(v.valides, 0) AS valides,
                       COALESCE(do.ps_producteurs, 0) AS ps_producteurs, COALESCE(ps.ps_total, 0) AS ps_total,
                       COALESCE(af.affectations, 0) AS affectations
                FROM delegation d
                LEFT JOIN comptes c ON c.delegation_id = d.id
                LEFT JOIN dossiers do ON do.delegation_id = d.id
                LEFT JOIN valides v ON v.delegation_id = d.id
                LEFT JOIN affect af ON af.delegation_id = d.id
                LEFT JOIN ps ON ps.delegation_id = d.id
                WHERE (:delegationId IS NULL OR d.id = :delegationId)
                ORDER BY COALESCE(c.actifs, 0) DESC, d.libele
                """))
                .param("debut", debut).param("fin", fin).param("delegationId", delegationId)
                .query((rs, n) -> {
                    int comptes = rs.getInt("comptes"), actifs = rs.getInt("actifs");
                    return DelegationDto.builder().id(rs.getLong("id")).libelle(rs.getString("libelle"))
                            .comptes(comptes).actifs(actifs).connexions(rs.getInt("connexions"))
                            .dossiersCrees(rs.getInt("crees")).dossiersValides(rs.getInt("valides"))
                            .psProducteurs(rs.getInt("ps_producteurs")).psTotal(rs.getInt("ps_total"))
                            .affectations(rs.getInt("affectations"))
                            .partActifs(comptes == 0 ? 0 : Math.round(100f * actifs / comptes))
                            .build();
                })
                .list();
    }
}
