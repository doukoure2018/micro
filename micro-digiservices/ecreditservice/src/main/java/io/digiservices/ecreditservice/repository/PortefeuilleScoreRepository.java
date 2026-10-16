package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.PortefeuilleScoreDtos.ScoreAgentDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/** Acces a portefeuille_score_agent (V164) : un score par agent et par jour de calcul. */
@Repository
@RequiredArgsConstructor
@Slf4j
public class PortefeuilleScoreRepository {

    private final JdbcClient jdbcClient;

    private static final String SELECT_BASE = """
            SELECT s.*, TRIM(COALESCE(u.first_name, '') || ' ' || COALESCE(u.last_name, '')) AS agent_nom,
                   u.enabled AS agent_actif
            FROM portefeuille_score_agent s
            JOIN users u ON u.user_id = s.agent_user_id
            """;

    private static final String INSERT = """
            INSERT INTO portefeuille_score_agent (
                date_calcul, agent_user_id, cod_agencia, date_premiere_affectation, nb_credits, encours,
                nb_en_retard, montant_retard, nb_herites, par30, regularite, taux_retard, poids_retard, charge,
                tendance, pts_par30, pts_regularite, pts_taux_retard, pts_poids_retard, pts_charge, pts_tendance,
                points_disponibles, score, classe, motif_non_note, mediane_reseau)
            VALUES (:dateCalcul, :agentUserId, :codAgencia, :datePremiereAffectation, :nbCredits, :encours,
                :nbEnRetard, :montantRetard, :nbHerites, :par30, :regularite, :tauxRetard, :poidsRetard, :charge,
                :tendance, :ptsPar30, :ptsRegularite, :ptsTauxRetard, :ptsPoidsRetard, :ptsCharge, :ptsTendance,
                :pointsDisponibles, :score, :classe, :motifNonNote, :medianeReseau)
            ON CONFLICT (date_calcul, agent_user_id) DO UPDATE SET
                cod_agencia = EXCLUDED.cod_agencia, date_premiere_affectation = EXCLUDED.date_premiere_affectation,
                nb_credits = EXCLUDED.nb_credits, encours = EXCLUDED.encours, nb_en_retard = EXCLUDED.nb_en_retard,
                montant_retard = EXCLUDED.montant_retard, nb_herites = EXCLUDED.nb_herites, par30 = EXCLUDED.par30,
                regularite = EXCLUDED.regularite, taux_retard = EXCLUDED.taux_retard, poids_retard = EXCLUDED.poids_retard,
                charge = EXCLUDED.charge, tendance = EXCLUDED.tendance, pts_par30 = EXCLUDED.pts_par30,
                pts_regularite = EXCLUDED.pts_regularite, pts_taux_retard = EXCLUDED.pts_taux_retard,
                pts_poids_retard = EXCLUDED.pts_poids_retard, pts_charge = EXCLUDED.pts_charge,
                pts_tendance = EXCLUDED.pts_tendance, points_disponibles = EXCLUDED.points_disponibles,
                score = EXCLUDED.score, classe = EXCLUDED.classe, motif_non_note = EXCLUDED.motif_non_note,
                mediane_reseau = EXCLUDED.mediane_reseau, created_at = CURRENT_TIMESTAMP
            """;

    // Plus ancienne affectation encore active de chaque agent : l'anciennete du portefeuille.
    private static final String PREMIERES_AFFECTATIONS = """
            SELECT agent_user_id, MIN(date_affectation)::date AS premiere
            FROM portefeuille_affectation WHERE actif GROUP BY agent_user_id
            """;

    public void enregistrer(ScoreAgentDto s) {
        jdbcClient.sql(INSERT)
                .param("dateCalcul", Date.valueOf(s.getDateCalcul()))
                .param("agentUserId", s.getAgentUserId())
                .param("codAgencia", s.getCodAgencia())
                .param("datePremiereAffectation", s.getDatePremiereAffectation() == null ? null : Date.valueOf(s.getDatePremiereAffectation()))
                .param("nbCredits", s.getNbCredits()).param("encours", s.getEncours())
                .param("nbEnRetard", s.getNbEnRetard()).param("montantRetard", s.getMontantRetard())
                .param("nbHerites", s.getNbHerites())
                .param("par30", s.getPar30()).param("regularite", s.getRegularite())
                .param("tauxRetard", s.getTauxRetard()).param("poidsRetard", s.getPoidsRetard())
                .param("charge", s.getCharge()).param("tendance", s.getTendance())
                .param("ptsPar30", s.getPtsPar30()).param("ptsRegularite", s.getPtsRegularite())
                .param("ptsTauxRetard", s.getPtsTauxRetard()).param("ptsPoidsRetard", s.getPtsPoidsRetard())
                .param("ptsCharge", s.getPtsCharge()).param("ptsTendance", s.getPtsTendance())
                .param("pointsDisponibles", s.getPointsDisponibles())
                .param("score", s.getScore()).param("classe", s.getClasse())
                .param("motifNonNote", s.getMotifNonNote()).param("medianeReseau", s.getMedianeReseau())
                .update();
    }

    /** Agents notes a une date qui ne portent plus rien aujourd'hui : leurs lignes du jour sont retirees. */
    public int supprimerAbsents(LocalDate dateCalcul, Collection<Long> agentsPresents) {
        if (agentsPresents.isEmpty()) {
            return jdbcClient.sql("DELETE FROM portefeuille_score_agent WHERE date_calcul = :d")
                    .param("d", Date.valueOf(dateCalcul)).update();
        }
        return jdbcClient.sql("DELETE FROM portefeuille_score_agent WHERE date_calcul = :d AND agent_user_id NOT IN (:ids)")
                .param("d", Date.valueOf(dateCalcul)).param("ids", List.copyOf(agentsPresents)).update();
    }

    public Optional<LocalDate> derniereDate() {
        return jdbcClient.sql("SELECT MAX(date_calcul) AS d FROM portefeuille_score_agent")
                .query((rs, n) -> rs.getObject("d", LocalDate.class)).optional().filter(d -> d != null);
    }

    /** Les scores d'une date, sur les codes SAF donnes (null = tout le reseau). */
    public List<ScoreAgentDto> findParDate(LocalDate date, Collection<String> codes) {
        String sql = SELECT_BASE + " WHERE s.date_calcul = :d" + (codes == null ? "" : " AND s.cod_agencia IN (:codes)")
                + " ORDER BY CASE s.classe WHEN 'D' THEN 0 WHEN 'C' THEN 1 WHEN 'B' THEN 2 WHEN 'A' THEN 3 ELSE 4 END, s.score, agent_nom";
        var q = jdbcClient.sql(sql).param("d", Date.valueOf(date));
        if (codes != null) {
            if (codes.isEmpty()) return List.of();
            q = q.param("codes", List.copyOf(codes));
        }
        return q.query(MAPPER).list();
    }

    /** Les scores d'un agent, du plus recent au plus ancien, bornes en nombre. */
    public List<ScoreAgentDto> historique(Long agentUserId, int max) {
        return jdbcClient.sql(SELECT_BASE + " WHERE s.agent_user_id = :id ORDER BY s.date_calcul DESC LIMIT :max")
                .param("id", agentUserId).param("max", max).query(MAPPER).list();
    }

    public Map<Long, LocalDate> premieresAffectations() {
        Map<Long, LocalDate> m = new HashMap<>();
        jdbcClient.sql(PREMIERES_AFFECTATIONS)
                .query((rs, n) -> Map.entry(rs.getLong("agent_user_id"), rs.getObject("premiere", LocalDate.class)))
                .list().forEach(e -> m.put(e.getKey(), e.getValue()));
        return m;
    }

    private static final RowMapper<ScoreAgentDto> MAPPER = (rs, n) -> ScoreAgentDto.builder()
            .dateCalcul(rs.getObject("date_calcul", LocalDate.class))
            .agentUserId(rs.getLong("agent_user_id"))
            .agentNom(rs.getString("agent_nom"))
            .agentActif(rs.getObject("agent_actif", Boolean.class))
            .codAgencia(rs.getString("cod_agencia"))
            .datePremiereAffectation(rs.getObject("date_premiere_affectation", LocalDate.class))
            .nbCredits(rs.getInt("nb_credits"))
            .encours(rs.getBigDecimal("encours"))
            .nbEnRetard(rs.getInt("nb_en_retard"))
            .montantRetard(rs.getBigDecimal("montant_retard"))
            .nbHerites(rs.getInt("nb_herites"))
            .par30(rs.getBigDecimal("par30")).regularite(rs.getBigDecimal("regularite"))
            .tauxRetard(rs.getBigDecimal("taux_retard")).poidsRetard(rs.getBigDecimal("poids_retard"))
            .charge(rs.getBigDecimal("charge")).tendance(rs.getBigDecimal("tendance"))
            .ptsPar30(rs.getBigDecimal("pts_par30")).ptsRegularite(rs.getBigDecimal("pts_regularite"))
            .ptsTauxRetard(rs.getBigDecimal("pts_taux_retard")).ptsPoidsRetard(rs.getBigDecimal("pts_poids_retard"))
            .ptsCharge(rs.getBigDecimal("pts_charge")).ptsTendance(rs.getBigDecimal("pts_tendance"))
            .pointsDisponibles(rs.getInt("points_disponibles"))
            .score((Integer) rs.getObject("score"))
            .classe(rs.getString("classe"))
            .motifNonNote(rs.getString("motif_non_note"))
            .medianeReseau((Integer) rs.getObject("mediane_reseau"))
            .build();

    static BigDecimal nvl(BigDecimal v) {
        return v == null ? BigDecimal.ZERO : v;
    }
}
