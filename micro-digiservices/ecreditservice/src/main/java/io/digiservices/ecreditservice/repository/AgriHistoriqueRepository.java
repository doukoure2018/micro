package io.digiservices.ecreditservice.repository;

import io.digiservices.clients.agri.PhotoMensuelleDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Historique mensuel du portefeuille agricole (V186, point 6 du tableau de bord DE) et objectifs
 * de la Direction de l'exploitation (point 7).
 *
 * <p>Les lignes sont calculees par ebanking depuis SAF et seulement <b>rangees</b> ici : digi
 * conserve la serie, SAF ne la garde pas. Une photo du mois en cours est reecrite chaque matin
 * (le mois n'est fige qu'une fois passe), d'ou l'ecriture en upsert sur (mois, code_agence).</p>
 */
@Repository
@RequiredArgsConstructor
@Slf4j
public class AgriHistoriqueRepository {

    private final NamedParameterJdbcTemplate jdbc;

    private static final String UPSERT = """
            INSERT INTO agri_photo_mensuelle (
                mois, code_agence, nb_credits, encours, nb_par30, encours_par30, nb_par90,
                encours_par90, montant_impaye, nb_production, montant_production, nb_sorties,
                montant_sorties, nb_clos_sans_date, source, calcule_at)
            VALUES (:mois, :codeAgence, :nbCredits, :encours, :nbPar30, :encoursPar30, :nbPar90,
                :encoursPar90, :montantImpaye, :nbProduction, :montantProduction, :nbSorties,
                :montantSorties, :nbClosSansDate, :source, CURRENT_TIMESTAMP)
            ON CONFLICT (mois, code_agence) DO UPDATE SET
                nb_credits = EXCLUDED.nb_credits,
                encours = EXCLUDED.encours,
                nb_par30 = EXCLUDED.nb_par30,
                encours_par30 = EXCLUDED.encours_par30,
                nb_par90 = EXCLUDED.nb_par90,
                encours_par90 = EXCLUDED.encours_par90,
                montant_impaye = EXCLUDED.montant_impaye,
                nb_production = EXCLUDED.nb_production,
                montant_production = EXCLUDED.montant_production,
                nb_sorties = EXCLUDED.nb_sorties,
                montant_sorties = EXCLUDED.montant_sorties,
                nb_clos_sans_date = EXCLUDED.nb_clos_sans_date,
                source = EXCLUDED.source,
                calcule_at = CURRENT_TIMESTAMP
            """;

    /**
     * Range une photo. Une RECONSTITUTION n'ecrase jamais une PHOTO : le mois ou la plateforme a
     * observe l'encours reel fait foi, et une reprise lancee plus tard ne doit pas l'effacer.
     */
    public int enregistrer(List<PhotoMensuelleDto> lignes) {
        if (lignes == null || lignes.isEmpty()) {
            return 0;
        }
        List<MapSqlParameterSource> lots = new ArrayList<>();
        for (PhotoMensuelleDto d : lignes) {
            if (d.getCodAgencia() == null || d.getCodAgencia().isBlank()) {
                continue;
            }
            lots.add(new MapSqlParameterSource()
                    .addValue("mois", java.sql.Date.valueOf(d.getMois()))
                    .addValue("codeAgence", d.getCodAgencia().trim())
                    .addValue("nbCredits", d.getNbCredits())
                    .addValue("encours", d.getEncours())
                    .addValue("nbPar30", d.getNbPar30())
                    .addValue("encoursPar30", d.getEncoursPar30())
                    .addValue("nbPar90", d.getNbPar90())
                    .addValue("encoursPar90", d.getEncoursPar90())
                    .addValue("montantImpaye", d.getMontantImpaye())
                    .addValue("nbProduction", d.getNbProduction())
                    .addValue("montantProduction", d.getMontantProduction())
                    .addValue("nbSorties", d.getNbSorties())
                    .addValue("montantSorties", d.getMontantSorties())
                    .addValue("nbClosSansDate", d.getNbClosSansDate())
                    .addValue("source", d.getSource()));
        }
        if (lots.isEmpty()) {
            return 0;
        }
        String sql = "RECONSTITUTION".equals(lignes.get(0).getSource())
                ? UPSERT + " WHERE agri_photo_mensuelle.source <> 'PHOTO'"
                : UPSERT;
        int[] n = jdbc.batchUpdate(sql, lots.toArray(MapSqlParameterSource[]::new));
        int total = 0;
        for (int x : n) {
            total += Math.max(x, 0);
        }
        return total;
    }

    /** Les mois deja presents, pour qu'une reprise ne recalcule pas ce qui est deja range. */
    public List<LocalDate> moisConnus() {
        return jdbc.query("SELECT DISTINCT mois FROM agri_photo_mensuelle ORDER BY mois",
                new MapSqlParameterSource(), (rs, n) -> rs.getDate("mois").toLocalDate());
    }

    private static final String SELECT_SERIE = """
            SELECT p.mois, p.code_agence, pv.libele AS libelle_agence, pv.delegation_id,
                   p.nb_credits, p.encours, p.nb_par30, p.encours_par30, p.nb_par90, p.encours_par90,
                   p.montant_impaye, p.nb_production, p.montant_production, p.nb_sorties,
                   p.montant_sorties, p.nb_clos_sans_date, p.source
            FROM agri_photo_mensuelle p
            LEFT JOIN pointvente pv ON pv.code = p.code_agence
            WHERE p.mois >= :debut AND p.mois <= :fin
              AND (CAST(:codeAgence AS VARCHAR) IS NULL OR p.code_agence = CAST(:codeAgence AS VARCHAR))
              AND (CAST(:delegationId AS BIGINT) IS NULL OR pv.delegation_id = CAST(:delegationId AS BIGINT))
            ORDER BY p.mois, p.code_agence
            """;

    public List<io.digiservices.clients.agri.HistoriqueMensuelDto> serie(
            LocalDate debut, LocalDate fin, String codeAgence, Long delegationId) {
        MapSqlParameterSource p = new MapSqlParameterSource()
                .addValue("debut", java.sql.Date.valueOf(debut.withDayOfMonth(1)))
                .addValue("fin", java.sql.Date.valueOf(fin.withDayOfMonth(1)))
                .addValue("codeAgence", codeAgence == null || codeAgence.isBlank() ? null : codeAgence.trim())
                .addValue("delegationId", delegationId);
        return jdbc.query(SELECT_SERIE, p, this::versHistorique);
    }

    private io.digiservices.clients.agri.HistoriqueMensuelDto versHistorique(ResultSet rs, int n) throws SQLException {
        var d = new io.digiservices.clients.agri.HistoriqueMensuelDto();
        d.setMois(rs.getDate("mois").toLocalDate());
        d.setCodeAgence(rs.getString("code_agence"));
        d.setLibelleAgence(rs.getString("libelle_agence"));
        Object del = rs.getObject("delegation_id");
        d.setDelegationId(del == null ? null : ((Number) del).longValue());
        d.setNbCredits(entier(rs.getObject("nb_credits")));
        d.setEncours(rs.getBigDecimal("encours"));
        d.setNbPar30(entier(rs.getObject("nb_par30")));
        d.setEncoursPar30(rs.getBigDecimal("encours_par30"));
        d.setNbPar90(entier(rs.getObject("nb_par90")));
        d.setEncoursPar90(rs.getBigDecimal("encours_par90"));
        d.setMontantImpaye(rs.getBigDecimal("montant_impaye"));
        d.setNbProduction(entier(rs.getObject("nb_production")));
        d.setMontantProduction(rs.getBigDecimal("montant_production"));
        d.setNbSorties(entier(rs.getObject("nb_sorties")));
        d.setMontantSorties(rs.getBigDecimal("montant_sorties"));
        d.setNbClosSansDate(entier(rs.getObject("nb_clos_sans_date")));
        d.setSource(rs.getString("source"));
        return d;
    }

    // ==================== Objectifs (point 7) ====================

    private static final String SELECT_OBJECTIFS = """
            SELECT o.annee, o.mois, o.code_agence, pv.libele AS libelle_agence,
                   COALESCE(o.delegation_id, pv.delegation_id) AS delegation_id,
                   o.indicateur, o.valeur
            FROM agri_objectif o
            LEFT JOIN pointvente pv ON pv.code = o.code_agence
            WHERE o.annee = :annee
              AND (CAST(:codeAgence AS VARCHAR) IS NULL OR o.code_agence = CAST(:codeAgence AS VARCHAR))
              AND (CAST(:delegationId AS BIGINT) IS NULL
                   OR COALESCE(o.delegation_id, pv.delegation_id) = CAST(:delegationId AS BIGINT))
            ORDER BY o.annee, COALESCE(o.mois, 0), o.code_agence, o.indicateur
            """;

    public List<io.digiservices.clients.agri.ObjectifDto> objectifs(int annee, String codeAgence, Long delegationId) {
        MapSqlParameterSource p = new MapSqlParameterSource()
                .addValue("annee", annee)
                .addValue("codeAgence", codeAgence == null || codeAgence.isBlank() ? null : codeAgence.trim())
                .addValue("delegationId", delegationId);
        return jdbc.query(SELECT_OBJECTIFS, p, (rs, n) -> {
            var o = new io.digiservices.clients.agri.ObjectifDto();
            o.setAnnee(rs.getInt("annee"));
            o.setMois(entier(rs.getObject("mois")) == null ? null : entier(rs.getObject("mois")).intValue());
            o.setCodeAgence(rs.getString("code_agence"));
            o.setLibelleAgence(rs.getString("libelle_agence"));
            Object del = rs.getObject("delegation_id");
            o.setDelegationId(del == null ? null : ((Number) del).longValue());
            o.setIndicateur(rs.getString("indicateur"));
            o.setValeur(rs.getBigDecimal("valeur"));
            return o;
        });
    }

    /** Jamais de transtypage direct : un INTEGER de Postgres ne se cast pas en Long. */
    private static Long entier(Object v) {
        return v == null ? null : ((Number) v).longValue();
    }
}
