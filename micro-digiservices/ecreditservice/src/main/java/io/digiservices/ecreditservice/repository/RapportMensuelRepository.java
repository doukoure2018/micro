package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.RapportMensuelDtos.LigneDto;
import io.digiservices.ecreditservice.dto.RapportMensuelDtos.RubriqueDto;
import io.digiservices.ecreditservice.dto.RapportMensuelDtos.ValeurDto;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Acces aux tables du rapport « Indicateurs mensuels » (V167). */
@Repository
@RequiredArgsConstructor
public class RapportMensuelRepository {

    private final JdbcClient jdbcClient;

    // ==================== Referentiel et parametres ====================

    public List<RubriqueDto> rubriques(String module) {
        return jdbcClient.sql("""
                SELECT code, libelle, libelle_court, ordre, nature, format, formule, controle_saf, source_saf, aide
                FROM rapport_rubrique WHERE module = :module AND actif ORDER BY ordre
                """).param("module", module)
                .query((rs, n) -> new RubriqueDto(rs.getString("code"), rs.getString("libelle"),
                        rs.getString("libelle_court"), rs.getInt("ordre"), rs.getString("nature"),
                        rs.getString("format"), rs.getString("formule"), rs.getBoolean("controle_saf"),
                        rs.getString("source_saf"), rs.getString("aide")))
                .list();
    }

    public Map<String, String> parametres() {
        Map<String, String> m = new HashMap<>();
        jdbcClient.sql("SELECT cle, valeur FROM rapport_parametre")
                .query((rs, n) -> m.put(rs.getString("cle"), rs.getString("valeur"))).list();
        return m;
    }

    // ==================== Rapports ====================

    private static final String SELECT_LIGNE = """
            SELECT r.id, r.cod_agencia, r.annee, r.mois, r.etat, r.commentaire,
                   r.date_saisie, r.date_soumission, r.date_validation, r.date_renvoi, r.motif_renvoi, r.date_consolidation,
                   TRIM(COALESCE(us.first_name, '') || ' ' || COALESCE(us.last_name, '')) AS saisi_par,
                   TRIM(COALESCE(uo.first_name, '') || ' ' || COALESCE(uo.last_name, '')) AS soumis_par,
                   TRIM(COALESCE(uv.first_name, '') || ' ' || COALESCE(uv.last_name, '')) AS valide_par,
                   TRIM(COALESCE(ur.first_name, '') || ' ' || COALESCE(ur.last_name, '')) AS renvoye_par,
                   TRIM(COALESCE(uc.first_name, '') || ' ' || COALESCE(uc.last_name, '')) AS consolide_par
            FROM rapport_mensuel r
            LEFT JOIN users us ON us.user_id = r.saisi_par_user_id
            LEFT JOIN users uo ON uo.user_id = r.soumis_par_user_id
            LEFT JOIN users uv ON uv.user_id = r.valide_par_user_id
            LEFT JOIN users ur ON ur.user_id = r.renvoye_par_user_id
            LEFT JOIN users uc ON uc.user_id = r.consolide_par_user_id
            """;

    private static final RowMapper<LigneDto> LIGNE_MAPPER = (rs, n) -> LigneDto.builder()
            .id(rs.getLong("id")).codAgencia(rs.getString("cod_agencia"))
            .annee(rs.getInt("annee")).mois(rs.getInt("mois")).etat(rs.getString("etat"))
            .commentaire(rs.getString("commentaire"))
            .saisiPar(vide(rs.getString("saisi_par"))).dateSaisie(odt(rs, "date_saisie"))
            .soumisPar(vide(rs.getString("soumis_par"))).dateSoumission(odt(rs, "date_soumission"))
            .validePar(vide(rs.getString("valide_par"))).dateValidation(odt(rs, "date_validation"))
            .renvoyePar(vide(rs.getString("renvoye_par"))).dateRenvoi(odt(rs, "date_renvoi"))
            .motifRenvoi(rs.getString("motif_renvoi"))
            .consolidePar(vide(rs.getString("consolide_par"))).dateConsolidation(odt(rs, "date_consolidation"))
            .build();

    /** Cree les rapports du mois qui n'existent pas encore pour ces points de service ; retourne le nombre crees. */
    public int creerSiAbsents(Collection<String> codes, int annee, int mois, Long userId) {
        int crees = 0;
        for (String code : codes) {
            crees += jdbcClient.sql("""
                    INSERT INTO rapport_mensuel (cod_agencia, annee, mois, cree_par_user_id)
                    VALUES (:code, :annee, :mois, :userId)
                    ON CONFLICT (cod_agencia, annee, mois) DO NOTHING
                    """).param("code", code).param("annee", annee).param("mois", mois).param("userId", userId).update();
        }
        return crees;
    }

    public List<LigneDto> rapports(int annee, int mois, Collection<String> codes) {
        if (codes.isEmpty()) return List.of();
        return jdbcClient.sql(SELECT_LIGNE + " WHERE r.annee = :annee AND r.mois = :mois AND r.cod_agencia IN (:codes) ORDER BY r.cod_agencia")
                .param("annee", annee).param("mois", mois).param("codes", List.copyOf(codes))
                .query(LIGNE_MAPPER).list();
    }

    public LigneDto rapport(Long id) {
        return jdbcClient.sql(SELECT_LIGNE + " WHERE r.id = :id").param("id", id)
                .query(LIGNE_MAPPER).optional().orElse(null);
    }

    public List<LigneDto> rapportsParIds(Collection<Long> ids) {
        if (ids.isEmpty()) return List.of();
        return jdbcClient.sql(SELECT_LIGNE + " WHERE r.id IN (:ids) ORDER BY r.cod_agencia")
                .param("ids", List.copyOf(ids)).query(LIGNE_MAPPER).list();
    }

    // ==================== Valeurs ====================

    /** rapport_id -> (code -> valeur) pour les rapports donnes. */
    public Map<Long, Map<String, ValeurDto>> valeurs(Collection<Long> ids) {
        Map<Long, Map<String, ValeurDto>> m = new HashMap<>();
        if (ids.isEmpty()) return m;
        jdbcClient.sql("""
                SELECT rapport_id, code, valeur, valeur_saf, date_lecture_saf, commentaire
                FROM rapport_mensuel_valeur WHERE rapport_id IN (:ids)
                """).param("ids", List.copyOf(ids))
                .query((rs, n) -> m.computeIfAbsent(rs.getLong("rapport_id"), k -> new LinkedHashMap<>())
                        .put(rs.getString("code"), ValeurDto.builder()
                                .valeur(rs.getBigDecimal("valeur")).valeurSaf(rs.getBigDecimal("valeur_saf"))
                                .dateLectureSaf(odt(rs, "date_lecture_saf")).commentaire(rs.getString("commentaire"))
                                .build()))
                .list();
        return m;
    }

    /** cod_agencia -> (code -> valeur declaree) pour un mois : sert a la comparaison avec le mois precedent. */
    public Map<String, Map<String, BigDecimal>> valeursDeclarees(int annee, int mois, Collection<String> codes) {
        Map<String, Map<String, BigDecimal>> m = new HashMap<>();
        if (codes.isEmpty()) return m;
        jdbcClient.sql("""
                SELECT r.cod_agencia, v.code, v.valeur
                FROM rapport_mensuel r JOIN rapport_mensuel_valeur v ON v.rapport_id = r.id
                WHERE r.annee = :annee AND r.mois = :mois AND r.cod_agencia IN (:codes) AND v.valeur IS NOT NULL
                """).param("annee", annee).param("mois", mois).param("codes", List.copyOf(codes))
                .query((rs, n) -> m.computeIfAbsent(rs.getString("cod_agencia"), k -> new HashMap<>())
                        .put(rs.getString("code"), rs.getBigDecimal("valeur")))
                .list();
        return m;
    }

    public void enregistrerValeur(Long rapportId, String code, BigDecimal valeur, boolean toucherCommentaire, String commentaire) {
        jdbcClient.sql("""
                INSERT INTO rapport_mensuel_valeur (rapport_id, code, valeur, commentaire)
                VALUES (:id, :code, :valeur, :commentaire)
                ON CONFLICT (rapport_id, code) DO UPDATE
                   SET valeur = EXCLUDED.valeur,
                       commentaire = CASE WHEN :toucher THEN EXCLUDED.commentaire ELSE rapport_mensuel_valeur.commentaire END
                """).param("id", rapportId).param("code", code).param("valeur", valeur)
                .param("commentaire", commentaire).param("toucher", toucherCommentaire).update();
    }

    public void enregistrerCommentaire(Long rapportId, String code, String commentaire) {
        jdbcClient.sql("""
                INSERT INTO rapport_mensuel_valeur (rapport_id, code, commentaire) VALUES (:id, :code, :commentaire)
                ON CONFLICT (rapport_id, code) DO UPDATE SET commentaire = EXCLUDED.commentaire
                """).param("id", rapportId).param("code", code).param("commentaire", commentaire).update();
    }

    public void enregistrerControleSaf(Long rapportId, String code, BigDecimal valeurSaf) {
        jdbcClient.sql("""
                INSERT INTO rapport_mensuel_valeur (rapport_id, code, valeur_saf, date_lecture_saf)
                VALUES (:id, :code, :saf, CURRENT_TIMESTAMP)
                ON CONFLICT (rapport_id, code) DO UPDATE
                   SET valeur_saf = EXCLUDED.valeur_saf, date_lecture_saf = CURRENT_TIMESTAMP
                """).param("id", rapportId).param("code", code).param("saf", valeurSaf).update();
    }

    public void marquerSaisie(Long rapportId, Long userId, boolean toucherCommentaire, String commentaire) {
        jdbcClient.sql("""
                UPDATE rapport_mensuel
                   SET saisi_par_user_id = :userId, date_saisie = CURRENT_TIMESTAMP,
                       commentaire = CASE WHEN :toucher THEN :commentaire ELSE commentaire END
                 WHERE id = :id
                """).param("id", rapportId).param("userId", userId)
                .param("toucher", toucherCommentaire).param("commentaire", commentaire).update();
    }

    // ==================== Etats ====================

    /** Change l'etat, renseigne les colonnes de l'etape et journalise. */
    public void changerEtat(LigneDto rapport, String nouvelEtat, Long userId, String motif) {
        String colonnes = switch (nouvelEtat) {
            case "SOUMIS" -> "soumis_par_user_id = :userId, date_soumission = CURRENT_TIMESTAMP, motif_renvoi = NULL";
            case "VALIDE" -> "valide_par_user_id = :userId, date_validation = CURRENT_TIMESTAMP";
            case "RENVOYE" -> "renvoye_par_user_id = :userId, date_renvoi = CURRENT_TIMESTAMP, motif_renvoi = :motif, "
                    + "valide_par_user_id = NULL, date_validation = NULL";
            case "CONSOLIDE" -> "consolide_par_user_id = :userId, date_consolidation = CURRENT_TIMESTAMP";
            default -> throw new IllegalArgumentException("Etat inconnu : " + nouvelEtat);
        };
        jdbcClient.sql("UPDATE rapport_mensuel SET etat = :etat, " + colonnes + " WHERE id = :id")
                .param("etat", nouvelEtat).param("userId", userId).param("motif", motif).param("id", rapport.getId()).update();
        jdbcClient.sql("""
                INSERT INTO rapport_mensuel_historique (rapport_id, ancien_etat, nouvel_etat, acteur_user_id, motif)
                VALUES (:id, :ancien, :nouveau, :userId, :motif)
                """).param("id", rapport.getId()).param("ancien", rapport.getEtat()).param("nouveau", nouvelEtat)
                .param("userId", userId).param("motif", motif).update();
    }

    private static OffsetDateTime odt(ResultSet rs, String col) throws SQLException {
        return rs.getObject(col, OffsetDateTime.class);
    }

    private static String vide(String s) {
        return s == null || s.isBlank() ? null : s;
    }
}
