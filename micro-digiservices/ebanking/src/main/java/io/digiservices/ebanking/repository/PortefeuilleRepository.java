package io.digiservices.ebanking.repository;

import io.digiservices.clients.portefeuille.AgenceSafDto;
import io.digiservices.clients.portefeuille.EcheancePeriodeDto;
import io.digiservices.clients.portefeuille.EcheancesIndicateursDto;
import io.digiservices.clients.portefeuille.PortefeuilleCreditDto;
import io.digiservices.clients.portefeuille.PortefeuilleEcheanceDto;
import io.digiservices.clients.portefeuille.PortefeuilleIndicateursDto;
import io.digiservices.ebanking.exception.TertiaryUnavailableException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.dao.QueryTimeoutException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.function.Supplier;

/**
 * Suivi du portefeuille credits SAF (phase 1) : lecture seule de PR.PR_CREDITOS et
 * PR.PR_PLAN_PAGOS sur la datasource primary (BDCRG PROD), calculs a la date du jour.
 * Meme moteur de derivations que le module Encours BCRG (RegulatoryRepository).
 */
@Repository
@Slf4j
public class PortefeuilleRepository {

    private final NamedParameterJdbcTemplate primary;

    public PortefeuilleRepository(@Qualifier("jdbcTemplate") JdbcTemplate jdbcTemplate) {
        this.primary = new NamedParameterJdbcTemplate(jdbcTemplate);
    }

    private static final String SQL_AGENCES = """
            SELECT ag.COD_AGENCIA, ag.DES_AGENCIA
            FROM CF.CF_AGENCIAS ag
            WHERE ag.COD_EMPRESA = '00000'
            ORDER BY ag.DES_AGENCIA
            """;

    // Base par credit actif de l'agence : credits non clotures a solde > 0,
    // avec les derivations du plan de paiement a la date du jour.
    private static final String CREDIT_BASE = """
            SELECT cr.COD_AGENCIA, ag.DES_AGENCIA, cr.NUM_CREDITO, cr.COD_CLIENTE,
                   c.NOM_CLIENTE, cr.TIP_CREDITO, tc.DES_TIP_CREDITO, cr.IND_ESTADO,
                   c.TEL_PRINCIPAL, c.TEL_SECUNDARIO, c.TEL_OTRO,
                   cr.COD_USUARIO, cr.COD_EJECUTIVO,
                   ug.NOM_USUARIO AS NOM_GESTIONNAIRE, ug.IND_ACTIVO AS ACT_GESTIONNAIRE,
                   cr.MON_CREDITO, cr.MON_SALDO, cr.MON_CUOTA, cr.CANT_CUOTAS,
                   cr.FEC_APERTURA, cr.FEC_VENCIMIENTO,
                   (SELECT MIN(pp.FEC_CUOTA) FROM PR.PR_PLAN_PAGOS pp
                     WHERE pp.COD_EMPRESA = cr.COD_EMPRESA AND pp.COD_AGENCIA = cr.COD_AGENCIA
                       AND pp.NUM_CREDITO = cr.NUM_CREDITO AND pp.NUM_CUOTA <> 0
                       AND pp.FEC_CANCELACION IS NULL AND pp.FEC_CUOTA >= :aujourdhui) AS PROCH_ECH,
                   (SELECT MIN(pp.FEC_CUOTA) FROM PR.PR_PLAN_PAGOS pp
                     WHERE pp.COD_EMPRESA = cr.COD_EMPRESA AND pp.COD_AGENCIA = cr.COD_AGENCIA
                       AND pp.NUM_CREDITO = cr.NUM_CREDITO AND pp.NUM_CUOTA <> 0
                       AND pp.FEC_CANCELACION IS NULL AND pp.FEC_CUOTA < :aujourdhui) AS DAT_PREM_IMP,
                   (SELECT SUM(pp.SAL_PRINCIPAL) FROM PR.PR_PLAN_PAGOS pp
                     WHERE pp.COD_EMPRESA = cr.COD_EMPRESA AND pp.COD_AGENCIA = cr.COD_AGENCIA
                       AND pp.NUM_CREDITO = cr.NUM_CREDITO AND pp.NUM_CUOTA <> 0
                       AND pp.FEC_CANCELACION IS NULL AND pp.FEC_CUOTA < :aujourdhui) AS MNT_CAP_IMP,
                   (SELECT SUM(pp.SAL_INT) FROM PR.PR_PLAN_PAGOS pp
                     WHERE pp.COD_EMPRESA = cr.COD_EMPRESA AND pp.COD_AGENCIA = cr.COD_AGENCIA
                       AND pp.NUM_CREDITO = cr.NUM_CREDITO AND pp.NUM_CUOTA <> 0
                       AND pp.FEC_CANCELACION IS NULL AND pp.FEC_CUOTA < :aujourdhui) AS MNT_INT_IMP,
                   (SELECT COUNT(*) FROM PR.PR_PLAN_PAGOS pp
                     WHERE pp.COD_EMPRESA = cr.COD_EMPRESA AND pp.COD_AGENCIA = cr.COD_AGENCIA
                       AND pp.NUM_CREDITO = cr.NUM_CREDITO AND pp.NUM_CUOTA <> 0
                       AND pp.FEC_CANCELACION IS NOT NULL) AS NB_PAYEES,
                   (SELECT COUNT(*) FROM PR.PR_PLAN_PAGOS pp
                     WHERE pp.COD_EMPRESA = cr.COD_EMPRESA AND pp.COD_AGENCIA = cr.COD_AGENCIA
                       AND pp.NUM_CREDITO = cr.NUM_CREDITO AND pp.NUM_CUOTA <> 0
                       AND pp.FEC_CANCELACION IS NULL AND pp.FEC_CUOTA < :aujourdhui) AS NB_IMPAYEES,
                   (SELECT COUNT(*) FROM PR.PR_PLAN_PAGOS pp
                     WHERE pp.COD_EMPRESA = cr.COD_EMPRESA AND pp.COD_AGENCIA = cr.COD_AGENCIA
                       AND pp.NUM_CREDITO = cr.NUM_CREDITO AND pp.NUM_CUOTA <> 0
                       AND pp.FEC_CUOTA >= :aujourdhui) AS NB_RESTANTES
            FROM PR.PR_CREDITOS cr
            INNER JOIN CL.CL_CLIENTES c
                ON cr.COD_EMPRESA = c.COD_EMPRESA AND cr.COD_CLIENTE = c.COD_CLIENTE
            LEFT JOIN PR.PR_TIPO_CREDITO tc
                ON cr.COD_EMPRESA = tc.COD_EMPRESA AND cr.TIP_CREDITO = tc.TIP_CREDITO
            LEFT JOIN CF.CF_AGENCIAS ag
                ON cr.COD_EMPRESA = ag.COD_EMPRESA AND cr.COD_AGENCIA = ag.COD_AGENCIA
            LEFT JOIN SG.SG_USUARIOS ug
                ON ug.COD_EMPRESA = cr.COD_EMPRESA AND ug.COD_AGENCIA = cr.COD_AGENCIA
               AND ug.COD_USUARIO = cr.COD_EJECUTIVO
            WHERE cr.COD_AGENCIA = :codAgencia
              AND cr.IND_ESTADO NOT IN ('C', 'T', 'X')
              AND cr.MON_SALDO > 0
              AND (:recherche IS NULL
                   OR c.NOM_CLIENTE LIKE :recherche
                   OR cr.COD_CLIENTE LIKE :recherche
                   OR CAST(cr.NUM_CREDITO AS VARCHAR(20)) LIKE :recherche)
            """;

    // Les retards d'abord (plus ancien en tete), puis les credits sains par numero.
    // Tranche de retard (PAR 30/60/90/120/+120) : bornes traduites en dates sur la
    // plus ancienne echeance impayee (jours >= min <=> DAT_PREM_IMP <= aujourdhui - min).
    private static final String FILTRE_RETARD = """
            WHERE (:seulementRetard = 0 OR t.DAT_PREM_IMP IS NOT NULL)
              AND (:dateRetardMax IS NULL OR (t.DAT_PREM_IMP IS NOT NULL AND t.DAT_PREM_IMP <= :dateRetardMax))
              AND (:dateRetardMin IS NULL OR (t.DAT_PREM_IMP IS NOT NULL AND t.DAT_PREM_IMP >= :dateRetardMin))
            """;

    private static final String SQL_FIND_CREDITS = "SELECT * FROM (" + CREDIT_BASE + """
            ) t
            """ + FILTRE_RETARD + """
            ORDER BY CASE WHEN t.DAT_PREM_IMP IS NULL THEN 1 ELSE 0 END, t.DAT_PREM_IMP, t.NUM_CREDITO
            OFFSET :offset ROWS FETCH NEXT :size ROWS ONLY
            """;

    // Tous les credits vivants du point de service, sans filtre ni pagination : sert a
    // l'affectation aux agents (V159), qui rapproche la liste SAF des affectations digi.
    private static final String SQL_TOUS_CREDITS = "SELECT * FROM (" + CREDIT_BASE + """
            ) t
            ORDER BY CASE WHEN t.DAT_PREM_IMP IS NULL THEN 1 ELSE 0 END, t.DAT_PREM_IMP, t.NUM_CREDITO
            """;

    private static final String SQL_COUNT_CREDITS = "SELECT COUNT(*) FROM (" + CREDIT_BASE + """
            ) t
            """ + FILTRE_RETARD;

    private static final String SQL_INDICATEURS = "SELECT COUNT(*) AS NB, " + """
                   COALESCE(SUM(t.MON_SALDO), 0) AS ENCOURS,
                   SUM(CASE WHEN t.DAT_PREM_IMP IS NOT NULL THEN 1 ELSE 0 END) AS NB_RETARD,
                   COALESCE(SUM(COALESCE(t.MNT_CAP_IMP, 0) + COALESCE(t.MNT_INT_IMP, 0)), 0) AS IMPAYE,
                   COALESCE(SUM(CASE WHEN t.DAT_PREM_IMP <= :date30 THEN t.MON_SALDO ELSE 0 END), 0) AS ENCOURS_PAR30,
                   COALESCE(SUM(CASE WHEN t.DAT_PREM_IMP <= :date90 THEN t.MON_SALDO ELSE 0 END), 0) AS ENCOURS_PAR90
            FROM ("""
            // Le saut de ligne n'est pas decoratif : FILTRE_RETARD commence par WHERE, et sans
            // separateur la requete sortait « ) tWHERE (...) ». SQL Server lisait alors un alias
            // nomme « tWHERE » et refusait la suite — les indicateurs du portefeuille repondaient
            // 500 depuis le 04/09/2026. Les deux autres requetes qui reutilisent ce filtre passent
            // par un bloc de texte qui garde son saut de ligne, et n'ont jamais eu le probleme.
            + CREDIT_BASE + ") t\n" + FILTRE_RETARD;

    private static final String SQL_ECHEANCIER = """
            SELECT pp.NUM_CUOTA, pp.FEC_CUOTA, pp.MON_CUOTA, pp.MON_INT,
                   pp.SAL_PRINCIPAL, pp.SAL_INT, pp.FEC_CANCELACION
            FROM PR.PR_PLAN_PAGOS pp
            WHERE pp.COD_AGENCIA = :codAgencia AND pp.NUM_CREDITO = :numCredito
              AND pp.NUM_CUOTA <> 0
            ORDER BY pp.NUM_CUOTA
            """;

    // ==================== Alertes (phase 3) : balayages reseau ====================

    // Sous-requete commune : par credit, plus ancienne echeance echue impayee + montants impayes
    private static final String IMPAYES_PAR_CREDIT = """
            (SELECT pp.COD_EMPRESA, pp.COD_AGENCIA, pp.NUM_CREDITO,
                    MIN(pp.FEC_CUOTA) AS PREM_IMP,
                    SUM(pp.SAL_PRINCIPAL) AS CAP_IMP, SUM(pp.SAL_INT) AS INT_IMP
             FROM PR.PR_PLAN_PAGOS pp
             WHERE pp.NUM_CUOTA <> 0 AND pp.FEC_CANCELACION IS NULL AND pp.FEC_CUOTA < :aujourdhui
             GROUP BY pp.COD_EMPRESA, pp.COD_AGENCIA, pp.NUM_CREDITO) t
            """;

    private static final String SQL_ECHEANCES_AVENIR = """
            SELECT cr.COD_AGENCIA, ag.DES_AGENCIA, cr.NUM_CREDITO, cr.COD_CLIENTE,
                   c.NOM_CLIENTE, pp.FEC_CUOTA, pp.MON_CUOTA,
                   c.TEL_PRINCIPAL, c.TEL_SECUNDARIO, c.TEL_OTRO
            FROM PR.PR_PLAN_PAGOS pp
            INNER JOIN PR.PR_CREDITOS cr
                ON pp.COD_EMPRESA = cr.COD_EMPRESA AND pp.COD_AGENCIA = cr.COD_AGENCIA
               AND pp.NUM_CREDITO = cr.NUM_CREDITO
            INNER JOIN CL.CL_CLIENTES c
                ON cr.COD_EMPRESA = c.COD_EMPRESA AND cr.COD_CLIENTE = c.COD_CLIENTE
            LEFT JOIN CF.CF_AGENCIAS ag
                ON cr.COD_EMPRESA = ag.COD_EMPRESA AND cr.COD_AGENCIA = ag.COD_AGENCIA
            WHERE pp.NUM_CUOTA <> 0 AND pp.FEC_CANCELACION IS NULL AND pp.FEC_CUOTA = :dateCible
              AND cr.IND_ESTADO NOT IN ('C', 'T', 'X') AND cr.MON_SALDO > 0
            ORDER BY cr.COD_AGENCIA, c.NOM_CLIENTE
            """;

    private static final String SQL_NOUVEAUX_IMPAYES = "SELECT cr.COD_AGENCIA, ag.DES_AGENCIA, " + """
                   cr.NUM_CREDITO, cr.COD_CLIENTE, c.NOM_CLIENTE, t.PREM_IMP, cr.MON_SALDO,
                   COALESCE(t.CAP_IMP, 0) + COALESCE(t.INT_IMP, 0) AS MNT_IMP,
                   c.TEL_PRINCIPAL, c.TEL_SECUNDARIO, c.TEL_OTRO
            FROM """ + IMPAYES_PAR_CREDIT + """
            INNER JOIN PR.PR_CREDITOS cr
                ON t.COD_EMPRESA = cr.COD_EMPRESA AND t.COD_AGENCIA = cr.COD_AGENCIA
               AND t.NUM_CREDITO = cr.NUM_CREDITO
            INNER JOIN CL.CL_CLIENTES c
                ON cr.COD_EMPRESA = c.COD_EMPRESA AND cr.COD_CLIENTE = c.COD_CLIENTE
            LEFT JOIN CF.CF_AGENCIAS ag
                ON cr.COD_EMPRESA = ag.COD_EMPRESA AND cr.COD_AGENCIA = ag.COD_AGENCIA
            WHERE t.PREM_IMP >= :depuis
              AND cr.IND_ESTADO NOT IN ('C', 'T', 'X') AND cr.MON_SALDO > 0
            ORDER BY cr.COD_AGENCIA, t.PREM_IMP
            """;

    // Predicats de categorie, derives UNE seule fois de CategorieCredit pour que la regle
    // appliquee ligne a ligne par ecreditservice et celle agregee ici ne puissent pas diverger.
    private static final String EST_EN_COURS = "(cr.IND_ESTADO IS NULL OR cr.IND_ESTADO NOT IN ("
            + io.digiservices.clients.portefeuille.CategorieCredit.codesNonAffectablesSql() + "))";
    private static final String EST_CONTENTIEUX = "cr.IND_ESTADO IN ("
            + io.digiservices.clients.portefeuille.CategorieCredit.CONTENTIEUX.codesSql() + ")";
    private static final String EST_APURE = "cr.IND_ESTADO IN ("
            + io.digiservices.clients.portefeuille.CategorieCredit.APURE.codesSql() + ")";

    /**
     * Synthese reseau par agence. Depuis le 2026-10-07 les indicateurs de charge ne portent que
     * sur les credits EN COURS, seuls affectables a un agent ; les credits au contentieux et les
     * credits apures sont denombres a part. Melanger les trois faussait le taux d'affectation
     * d'environ un tiers et pouvait afficher un encours PAR90 superieur a l'encours lui-meme.
     */
    private static final String SQL_INDICATEURS_RESEAU = "SELECT cr.COD_AGENCIA, ag.DES_AGENCIA, "
            + "SUM(CASE WHEN " + EST_EN_COURS + " THEN 1 ELSE 0 END) AS NB, "
            + "COALESCE(SUM(CASE WHEN " + EST_EN_COURS + " THEN cr.MON_SALDO ELSE 0 END), 0) AS ENCOURS, "
            + "SUM(CASE WHEN " + EST_EN_COURS + " AND t.PREM_IMP IS NOT NULL THEN 1 ELSE 0 END) AS NB_RETARD, "
            + "COALESCE(SUM(CASE WHEN " + EST_EN_COURS + " THEN COALESCE(t.CAP_IMP, 0) + COALESCE(t.INT_IMP, 0) ELSE 0 END), 0) AS IMPAYE, "
            + "SUM(CASE WHEN " + EST_CONTENTIEUX + " THEN 1 ELSE 0 END) AS NB_CONTENTIEUX, "
            + "COALESCE(SUM(CASE WHEN " + EST_CONTENTIEUX + " THEN cr.MON_SALDO ELSE 0 END), 0) AS ENCOURS_CONTENTIEUX, "
            + "SUM(CASE WHEN " + EST_APURE + " THEN 1 ELSE 0 END) AS NB_APURE, "
            + "COALESCE(SUM(CASE WHEN " + EST_APURE + " THEN cr.MON_SALDO ELSE 0 END), 0) AS ENCOURS_APURE, "
            + "COALESCE(SUM(CASE WHEN t.PREM_IMP <= :date30 AND " + EST_EN_COURS
            + " THEN cr.MON_SALDO ELSE 0 END), 0) AS ENCOURS_PAR30, "
            + "COALESCE(SUM(CASE WHEN t.PREM_IMP <= :date90 AND " + EST_EN_COURS
            + " THEN cr.MON_SALDO ELSE 0 END), 0) AS ENCOURS_PAR90 " + """
            FROM PR.PR_CREDITOS cr
            LEFT JOIN """ + IMPAYES_PAR_CREDIT + """
                ON t.COD_EMPRESA = cr.COD_EMPRESA AND t.COD_AGENCIA = cr.COD_AGENCIA
               AND t.NUM_CREDITO = cr.NUM_CREDITO
            LEFT JOIN CF.CF_AGENCIAS ag
                ON cr.COD_EMPRESA = ag.COD_EMPRESA AND cr.COD_AGENCIA = ag.COD_AGENCIA
            WHERE cr.IND_ESTADO NOT IN ('C', 'T', 'X') AND cr.MON_SALDO > 0
            GROUP BY cr.COD_AGENCIA, ag.DES_AGENCIA
            ORDER BY cr.COD_AGENCIA
            """;

    /**
     * Synthese reseau par agence ET par type de credit, credits EN COURS seulement (portefeuille
     * a risque, lot 2). Une seule requete pour les 185 points de service, comme la synthese PAR ;
     * la ventilation par agence, delegation et famille se fait ensuite cote digi.
     */
    private static final String SQL_INDICATEURS_RESEAU_PRODUIT = "SELECT cr.COD_AGENCIA, ag.DES_AGENCIA, "
            + "cr.TIP_CREDITO, MAX(tc.DES_TIP_CREDITO) AS DES_TIP_CREDITO, "
            + "COUNT(*) AS NB, "
            + "COALESCE(SUM(cr.MON_SALDO), 0) AS ENCOURS, "
            + "SUM(CASE WHEN t.PREM_IMP IS NOT NULL THEN 1 ELSE 0 END) AS NB_RETARD, "
            + "COALESCE(SUM(COALESCE(t.CAP_IMP, 0) + COALESCE(t.INT_IMP, 0)), 0) AS IMPAYE, "
            + "COALESCE(SUM(CASE WHEN t.PREM_IMP <= :date30 THEN cr.MON_SALDO ELSE 0 END), 0) AS ENCOURS_PAR30, "
            + "SUM(CASE WHEN t.PREM_IMP <= :date30 THEN 1 ELSE 0 END) AS NB_PAR30, "
            + "COALESCE(SUM(CASE WHEN t.PREM_IMP <= :date90 THEN cr.MON_SALDO ELSE 0 END), 0) AS ENCOURS_PAR90, "
            + "SUM(CASE WHEN t.PREM_IMP <= :date90 THEN 1 ELSE 0 END) AS NB_PAR90, "
            + "COALESCE(SUM(CASE WHEN t.PREM_IMP <= :date60 THEN cr.MON_SALDO ELSE 0 END), 0) AS ENCOURS_PAR60, "
            + "SUM(CASE WHEN t.PREM_IMP <= :date60 THEN 1 ELSE 0 END) AS NB_PAR60, "
            + "COALESCE(SUM(CASE WHEN t.PREM_IMP <= :date120 THEN cr.MON_SALDO ELSE 0 END), 0) AS ENCOURS_PAR120, "
            + "SUM(CASE WHEN t.PREM_IMP <= :date120 THEN 1 ELSE 0 END) AS NB_PAR120 " + """
            FROM PR.PR_CREDITOS cr
            LEFT JOIN """ + IMPAYES_PAR_CREDIT + """
                ON t.COD_EMPRESA = cr.COD_EMPRESA AND t.COD_AGENCIA = cr.COD_AGENCIA
               AND t.NUM_CREDITO = cr.NUM_CREDITO
            LEFT JOIN PR.PR_TIPO_CREDITO tc
                ON cr.COD_EMPRESA = tc.COD_EMPRESA AND cr.TIP_CREDITO = tc.TIP_CREDITO
            LEFT JOIN CF.CF_AGENCIAS ag
                ON cr.COD_EMPRESA = ag.COD_EMPRESA AND cr.COD_AGENCIA = ag.COD_AGENCIA
            WHERE cr.IND_ESTADO NOT IN ('C', 'T', 'X') AND cr.MON_SALDO > 0
              AND """ + EST_EN_COURS + """
            GROUP BY cr.COD_AGENCIA, ag.DES_AGENCIA, cr.TIP_CREDITO
            ORDER BY cr.COD_AGENCIA, cr.TIP_CREDITO
            """;

    /**
     * Controles SAF du rapport mensuel des indicateurs (V167) : par point de service, l'encours,
     * les impayes et le capital en retard a la date de lecture, et les octrois du mois demande.
     * Une seule requete pour tout le reseau, comme la synthese PAR.
     */
    private static final String SQL_CONTROLES_MENSUELS = "SELECT cr.COD_AGENCIA, "
            + "COALESCE(SUM(CASE WHEN " + EST_EN_COURS + " AND cr.MON_SALDO > 0 THEN cr.MON_SALDO ELSE 0 END), 0) AS ENCOURS, "
            + "COALESCE(SUM(CASE WHEN " + EST_EN_COURS + " AND cr.MON_SALDO > 0 "
            + "THEN COALESCE(t.CAP_IMP, 0) + COALESCE(t.INT_IMP, 0) ELSE 0 END), 0) AS RETARDS, "
            + "COALESCE(SUM(CASE WHEN " + EST_EN_COURS + " AND cr.MON_SALDO > 0 AND t.PREM_IMP IS NOT NULL "
            + "THEN cr.MON_SALDO ELSE 0 END), 0) AS CAPITAL_RETARD, "
            + "SUM(CASE WHEN cr.FEC_APERTURA >= :debut AND cr.FEC_APERTURA < :fin THEN 1 ELSE 0 END) AS NB_OCTROIS, "
            + "COALESCE(SUM(CASE WHEN cr.FEC_APERTURA >= :debut AND cr.FEC_APERTURA < :fin "
            + "THEN cr.MON_CREDITO ELSE 0 END), 0) AS OCTROIS " + """
            FROM PR.PR_CREDITOS cr
            LEFT JOIN """ + IMPAYES_PAR_CREDIT + """
                ON t.COD_EMPRESA = cr.COD_EMPRESA AND t.COD_AGENCIA = cr.COD_AGENCIA
               AND t.NUM_CREDITO = cr.NUM_CREDITO
            WHERE cr.IND_ESTADO IS NULL OR cr.IND_ESTADO <> 'X'
            GROUP BY cr.COD_AGENCIA
            ORDER BY cr.COD_AGENCIA
            """;

    /** Controles du rapport mensuel pour tout le reseau (V167). */
    public List<io.digiservices.clients.portefeuille.ControleMensuelDto> controlesMensuels(int annee, int mois) {
        LocalDate aujourdhui = LocalDate.now();
        LocalDate debut = LocalDate.of(annee, mois, 1);
        MapSqlParameterSource p = new MapSqlParameterSource()
                .addValue("aujourdhui", java.sql.Date.valueOf(aujourdhui))
                .addValue("debut", java.sql.Date.valueOf(debut))
                .addValue("fin", java.sql.Date.valueOf(debut.plusMonths(1)));
        return execute("portefeuille.controlesMensuels", () -> primary.query(SQL_CONTROLES_MENSUELS, p,
                (rs, n) -> new io.digiservices.clients.portefeuille.ControleMensuelDto(
                        str(rs, "COD_AGENCIA"), rs.getBigDecimal("ENCOURS"), rs.getBigDecimal("RETARDS"),
                        rs.getBigDecimal("CAPITAL_RETARD"), rs.getLong("NB_OCTROIS"), rs.getBigDecimal("OCTROIS"),
                        aujourdhui)));
    }

    private static final String SQL_CREDITS_NEGATIFS = """
            SELECT cr.COD_AGENCIA, ag.DES_AGENCIA, cr.NUM_CREDITO, cr.COD_CLIENTE, c.NOM_CLIENTE,
                   cr.TIP_CREDITO, cr.MON_CREDITO, cr.MON_SALDO, cr.FEC_APERTURA, cr.FEC_VENCIMIENTO,
                   cr.IND_ESTADO, cr.COD_EJECUTIVO
            FROM PR.PR_CREDITOS cr
            LEFT JOIN CL.CL_CLIENTES c
                ON c.COD_EMPRESA = cr.COD_EMPRESA AND c.COD_CLIENTE = cr.COD_CLIENTE
            LEFT JOIN CF.CF_AGENCIAS ag
                ON ag.COD_EMPRESA = cr.COD_EMPRESA AND ag.COD_AGENCIA = cr.COD_AGENCIA
            WHERE cr.MON_SALDO < 0
            ORDER BY cr.MON_SALDO ASC
            """;

    /**
     * Credits a solde negatif, lus dans la base de PRODUCTION (V177). La cible est forcee ici
     * plutot que confiee a la liste des chemins : la surveillance tourne sans requete HTTP, et
     * une lecture de la sauvegarde ne verrait pas l'imputation de ce matin.
     */
    public List<io.digiservices.clients.portefeuille.CreditNegatifDto> findCreditsNegatifs() {
        io.digiservices.ebanking.config.SafRoutage.Cible avant =
                io.digiservices.ebanking.config.SafRoutage.courante();
        io.digiservices.ebanking.config.SafRoutage.forcer(
                io.digiservices.ebanking.config.SafRoutage.Cible.PRODUCTION);
        try {
            return execute("portefeuille.creditsNegatifs", () -> primary.query(SQL_CREDITS_NEGATIFS,
                    new MapSqlParameterSource(),
                    (rs, n) -> new io.digiservices.clients.portefeuille.CreditNegatifDto(
                            str(rs, "COD_AGENCIA"), str(rs, "DES_AGENCIA"), rs.getLong("NUM_CREDITO"),
                            str(rs, "COD_CLIENTE"), str(rs, "NOM_CLIENTE"),
                            entier(rs, "TIP_CREDITO"),
                            rs.getBigDecimal("MON_CREDITO"), rs.getBigDecimal("MON_SALDO"),
                            dt(rs, "FEC_APERTURA"), dt(rs, "FEC_VENCIMIENTO"),
                            str(rs, "IND_ESTADO"), str(rs, "COD_EJECUTIVO"))));
        } finally {
            if (avant == null) {
                io.digiservices.ebanking.config.SafRoutage.effacer();
            } else {
                io.digiservices.ebanking.config.SafRoutage.forcer(avant);
            }
        }
    }

    private static final String SQL_MEMBRE = """
            SELECT c.COD_CLIENTE, c.NOM_CLIENTE, c.COD_AGENCIA, a.DES_AGENCIA,
                   c.IND_PERSONA, c.CAT_CLIENTE, c.FEC_INGRESO, c.TEL_PRINCIPAL
            FROM CL.CL_CLIENTES c
            LEFT JOIN CF.CF_AGENCIAS a ON a.COD_AGENCIA = c.COD_AGENCIA AND a.COD_EMPRESA = c.COD_EMPRESA
            WHERE c.COD_CLIENTE = :codCliente
            """;

    /**
     * Un client par son numero de membre, lu dans la base de PRODUCTION et non dans la
     * sauvegarde : un client ouvert ce matin n'existe que la. Vide si le numero est inconnu.
     */
    public java.util.Optional<io.digiservices.clients.portefeuille.MembreSafDto> findMembre(String codCliente) {
        io.digiservices.ebanking.config.SafRoutage.Cible avant =
                io.digiservices.ebanking.config.SafRoutage.courante();
        io.digiservices.ebanking.config.SafRoutage.forcer(
                io.digiservices.ebanking.config.SafRoutage.Cible.PRODUCTION);
        try {
            List<io.digiservices.clients.portefeuille.MembreSafDto> lignes = execute("portefeuille.membre",
                    () -> primary.query(SQL_MEMBRE,
                            new MapSqlParameterSource("codCliente", codCliente),
                            (rs, n) -> new io.digiservices.clients.portefeuille.MembreSafDto(
                                    str(rs, "COD_CLIENTE"), str(rs, "NOM_CLIENTE"),
                                    str(rs, "COD_AGENCIA"), str(rs, "DES_AGENCIA"),
                                    str(rs, "IND_PERSONA"), str(rs, "CAT_CLIENTE"),
                                    dt(rs, "FEC_INGRESO"), str(rs, "TEL_PRINCIPAL"))));
            return lignes.isEmpty() ? java.util.Optional.empty() : java.util.Optional.of(lignes.get(0));
        } finally {
            if (avant == null) {
                io.digiservices.ebanking.config.SafRoutage.effacer();
            } else {
                io.digiservices.ebanking.config.SafRoutage.forcer(avant);
            }
        }
    }

    /**
     * L'etat d'un credit a l'instant, dans la base de PRODUCTION : la preuve qu'un credit negatif
     * pris en charge a bien ete regularise, ou qu'il ne l'est pas encore.
     */
    public java.util.Optional<io.digiservices.clients.portefeuille.CreditEtatDto> findEtatCredit(String codAgencia, Long numCredito) {
        io.digiservices.ebanking.config.SafRoutage.Cible avant =
                io.digiservices.ebanking.config.SafRoutage.courante();
        io.digiservices.ebanking.config.SafRoutage.forcer(
                io.digiservices.ebanking.config.SafRoutage.Cible.PRODUCTION);
        try {
            List<io.digiservices.clients.portefeuille.CreditEtatDto> lignes = execute("portefeuille.etatCredit",
                    () -> primary.query("""
                            SELECT COD_AGENCIA, NUM_CREDITO, MON_SALDO, IND_ESTADO
                            FROM PR.PR_CREDITOS
                            WHERE COD_AGENCIA = :codAgencia AND NUM_CREDITO = :numCredito
                            """,
                            new MapSqlParameterSource("codAgencia", codAgencia).addValue("numCredito", numCredito),
                            (rs, n) -> new io.digiservices.clients.portefeuille.CreditEtatDto(
                                    str(rs, "COD_AGENCIA"), rs.getLong("NUM_CREDITO"),
                                    rs.getBigDecimal("MON_SALDO"), str(rs, "IND_ESTADO"))));
            return lignes.isEmpty() ? java.util.Optional.empty() : java.util.Optional.of(lignes.get(0));
        } finally {
            if (avant == null) {
                io.digiservices.ebanking.config.SafRoutage.effacer();
            } else {
                io.digiservices.ebanking.config.SafRoutage.forcer(avant);
            }
        }
    }

    /** Echeances non payees tombant exactement a J+joursAvant (credits actifs). */
    public List<io.digiservices.clients.portefeuille.EcheanceAvenirDto> findEcheancesAvenir(int joursAvant) {
        MapSqlParameterSource p = new MapSqlParameterSource()
                .addValue("dateCible", java.sql.Date.valueOf(LocalDate.now().plusDays(joursAvant)));
        return execute("portefeuille.echeancesAvenir", () -> primary.query(SQL_ECHEANCES_AVENIR, p,
                (rs, n) -> new io.digiservices.clients.portefeuille.EcheanceAvenirDto(
                        str(rs, "COD_AGENCIA"), str(rs, "DES_AGENCIA"), rs.getLong("NUM_CREDITO"),
                        str(rs, "COD_CLIENTE"), str(rs, "NOM_CLIENTE"),
                        dt(rs, "FEC_CUOTA"), rs.getBigDecimal("MON_CUOTA"),
                        tel(rs, "TEL_PRINCIPAL"), tel(rs, "TEL_SECUNDARIO"), tel(rs, "TEL_OTRO"))));
    }

    /** Credits dont la premiere echeance impayee est tombee dans les depuisJours derniers jours. */
    public List<io.digiservices.clients.portefeuille.NouvelImpayeDto> findNouveauxImpayes(int depuisJours) {
        LocalDate aujourdhui = LocalDate.now();
        MapSqlParameterSource p = new MapSqlParameterSource()
                .addValue("aujourdhui", java.sql.Date.valueOf(aujourdhui))
                .addValue("depuis", java.sql.Date.valueOf(aujourdhui.minusDays(depuisJours)));
        return execute("portefeuille.nouveauxImpayes", () -> primary.query(SQL_NOUVEAUX_IMPAYES, p,
                (rs, n) -> new io.digiservices.clients.portefeuille.NouvelImpayeDto(
                        str(rs, "COD_AGENCIA"), str(rs, "DES_AGENCIA"), rs.getLong("NUM_CREDITO"),
                        str(rs, "COD_CLIENTE"), str(rs, "NOM_CLIENTE"),
                        dt(rs, "PREM_IMP"), rs.getBigDecimal("MON_SALDO"), rs.getBigDecimal("MNT_IMP"),
                        tel(rs, "TEL_PRINCIPAL"), tel(rs, "TEL_SECUNDARIO"), tel(rs, "TEL_OTRO"))));
    }

    /** Indicateurs de tout le reseau, agreges par agence SAF (une seule requete). */
    public List<io.digiservices.clients.portefeuille.IndicateursAgenceDto> indicateursReseau() {
        LocalDate aujourdhui = LocalDate.now();
        MapSqlParameterSource p = new MapSqlParameterSource()
                .addValue("aujourdhui", java.sql.Date.valueOf(aujourdhui))
                .addValue("date30", java.sql.Date.valueOf(aujourdhui.minusDays(30)))
                .addValue("date90", java.sql.Date.valueOf(aujourdhui.minusDays(90)));
        return execute("portefeuille.indicateursReseau", () -> primary.query(SQL_INDICATEURS_RESEAU, p,
                (rs, n) -> new io.digiservices.clients.portefeuille.IndicateursAgenceDto(
                        str(rs, "COD_AGENCIA"), str(rs, "DES_AGENCIA"), rs.getLong("NB"),
                        rs.getBigDecimal("ENCOURS"), rs.getLong("NB_RETARD"), rs.getBigDecimal("IMPAYE"),
                        rs.getBigDecimal("ENCOURS_PAR30"), rs.getBigDecimal("ENCOURS_PAR90"),
                        rs.getLong("NB_CONTENTIEUX"), rs.getBigDecimal("ENCOURS_CONTENTIEUX"),
                        rs.getLong("NB_APURE"), rs.getBigDecimal("ENCOURS_APURE"))));
    }

    /** Indicateurs de tout le reseau par agence SAF et par type de credit, credits en cours (une requete). */
    public List<io.digiservices.clients.portefeuille.IndicateursProduitAgenceDto> indicateursReseauParProduit() {
        LocalDate aujourdhui = LocalDate.now();
        MapSqlParameterSource p = new MapSqlParameterSource()
                .addValue("aujourdhui", java.sql.Date.valueOf(aujourdhui))
                .addValue("date30", java.sql.Date.valueOf(aujourdhui.minusDays(30)))
                .addValue("date90", java.sql.Date.valueOf(aujourdhui.minusDays(90)))
                .addValue("date60", java.sql.Date.valueOf(aujourdhui.minusDays(60)))
                .addValue("date120", java.sql.Date.valueOf(aujourdhui.minusDays(120)));
        return execute("portefeuille.indicateursReseauParProduit", () -> primary.query(SQL_INDICATEURS_RESEAU_PRODUIT, p,
                (rs, n) -> new io.digiservices.clients.portefeuille.IndicateursProduitAgenceDto(
                        str(rs, "COD_AGENCIA"), str(rs, "DES_AGENCIA"),
                        rs.getObject("TIP_CREDITO") == null ? null : ((Number) rs.getObject("TIP_CREDITO")).longValue(),
                        str(rs, "DES_TIP_CREDITO"), rs.getLong("NB"),
                        rs.getBigDecimal("ENCOURS"), rs.getLong("NB_RETARD"), rs.getBigDecimal("IMPAYE"),
                        rs.getBigDecimal("ENCOURS_PAR30"), rs.getLong("NB_PAR30"),
                        rs.getBigDecimal("ENCOURS_PAR90"), rs.getLong("NB_PAR90"),
                        rs.getBigDecimal("ENCOURS_PAR60"), rs.getLong("NB_PAR60"),
                        rs.getBigDecimal("ENCOURS_PAR120"), rs.getLong("NB_PAR120"))));
    }

    public List<AgenceSafDto> findAgences() {
        return execute("portefeuille.agences", () -> primary.query(SQL_AGENCES,
                (rs, n) -> new AgenceSafDto(str(rs, "COD_AGENCIA"), str(rs, "DES_AGENCIA"))));
    }

    public List<PortefeuilleCreditDto> findCredits(String codAgencia, boolean seulementRetard,
                                                   Integer retardMin, Integer retardMax,
                                                   String recherche, int offset, int size) {
        MapSqlParameterSource p = paramsBase(codAgencia, recherche)
                .addValue("seulementRetard", seulementRetard ? 1 : 0)
                .addValue("offset", offset)
                .addValue("size", size);
        ajouterBornesRetard(p, retardMin, retardMax);
        return execute("portefeuille.credits", () -> primary.query(SQL_FIND_CREDITS, p, CREDIT_MAPPER));
    }

    /** Tous les credits vivants d'un point de service (une seule requete, pas de pagination). */
    public List<PortefeuilleCreditDto> findTousCredits(String codAgencia) {
        MapSqlParameterSource p = paramsBase(codAgencia, null);
        return execute("portefeuille.creditsComplets", () -> primary.query(SQL_TOUS_CREDITS, p, CREDIT_MAPPER));
    }

    public long countCredits(String codAgencia, boolean seulementRetard,
                             Integer retardMin, Integer retardMax, String recherche) {
        MapSqlParameterSource p = paramsBase(codAgencia, recherche)
                .addValue("seulementRetard", seulementRetard ? 1 : 0);
        ajouterBornesRetard(p, retardMin, retardMax);
        Long total = execute("portefeuille.count", () -> primary.queryForObject(SQL_COUNT_CREDITS, p, Long.class));
        return total != null ? total : 0L;
    }

    /** jours de retard >= min => DAT_PREM_IMP <= aujourd'hui - min ; <= max => >= aujourd'hui - max. */
    private static void ajouterBornesRetard(MapSqlParameterSource p, Integer retardMin, Integer retardMax) {
        LocalDate aujourdhui = LocalDate.now();
        p.addValue("dateRetardMax",
                retardMin != null ? java.sql.Date.valueOf(aujourdhui.minusDays(retardMin)) : null,
                java.sql.Types.DATE);
        p.addValue("dateRetardMin",
                retardMax != null ? java.sql.Date.valueOf(aujourdhui.minusDays(retardMax)) : null,
                java.sql.Types.DATE);
    }

    public PortefeuilleIndicateursDto indicateurs(String codAgencia, boolean seulementRetard,
                                                  Integer retardMin, Integer retardMax, String recherche) {
        LocalDate aujourdhui = LocalDate.now();
        MapSqlParameterSource p = paramsBase(codAgencia, recherche)
                .addValue("seulementRetard", seulementRetard ? 1 : 0)
                .addValue("date30", java.sql.Date.valueOf(aujourdhui.minusDays(30)))
                .addValue("date90", java.sql.Date.valueOf(aujourdhui.minusDays(90)));
        ajouterBornesRetard(p, retardMin, retardMax);
        return execute("portefeuille.indicateurs", () -> primary.queryForObject(SQL_INDICATEURS, p,
                (rs, n) -> new PortefeuilleIndicateursDto(
                        rs.getLong("NB"),
                        rs.getBigDecimal("ENCOURS"),
                        rs.getLong("NB_RETARD"),
                        rs.getBigDecimal("IMPAYE"),
                        rs.getBigDecimal("ENCOURS_PAR30"),
                        rs.getBigDecimal("ENCOURS_PAR90"))));
    }

    public List<PortefeuilleEcheanceDto> findEcheancier(String codAgencia, Long numCredito) {
        MapSqlParameterSource p = new MapSqlParameterSource()
                .addValue("codAgencia", codAgencia)
                .addValue("numCredito", numCredito);
        return execute("portefeuille.echeancier", () -> primary.query(SQL_ECHEANCIER, p,
                (rs, n) -> new PortefeuilleEcheanceDto(
                        rs.getLong("NUM_CUOTA"),
                        dt(rs, "FEC_CUOTA"),
                        rs.getBigDecimal("MON_CUOTA"),
                        rs.getBigDecimal("MON_INT"),
                        rs.getBigDecimal("SAL_PRINCIPAL"),
                        rs.getBigDecimal("SAL_INT"),
                        dt(rs, "FEC_CANCELACION"))));
    }

    private static MapSqlParameterSource paramsBase(String codAgencia, String recherche) {
        String filtre = (recherche == null || recherche.isBlank()) ? null : "%" + recherche.trim() + "%";
        return new MapSqlParameterSource()
                .addValue("codAgencia", codAgencia)
                // type explicite : SQL Server ne sait pas deduire le type d'un NULL non type
                .addValue("recherche", filtre, java.sql.Types.VARCHAR)
                .addValue("aujourdhui", java.sql.Date.valueOf(LocalDate.now()));
    }

    private static final RowMapper<PortefeuilleCreditDto> CREDIT_MAPPER = (rs, n) -> {
        PortefeuilleCreditDto d = new PortefeuilleCreditDto();
        d.setCodAgencia(str(rs, "COD_AGENCIA"));
        d.setDesAgencia(str(rs, "DES_AGENCIA"));
        d.setNumCredito(rs.getLong("NUM_CREDITO"));
        d.setCodCliente(str(rs, "COD_CLIENTE"));
        d.setNomCliente(str(rs, "NOM_CLIENTE"));
        Object tip = rs.getObject("TIP_CREDITO");
        d.setTipCredito(tip instanceof Number num ? num.longValue() : null);
        d.setDesTipCredito(str(rs, "DES_TIP_CREDITO"));
        d.setIndEstado(str(rs, "IND_ESTADO"));
        d.setTelPrincipal(tel(rs, "TEL_PRINCIPAL"));
        d.setTelSecundario(tel(rs, "TEL_SECUNDARIO"));
        d.setTelOtro(tel(rs, "TEL_OTRO"));
        d.setMonCredito(rs.getBigDecimal("MON_CREDITO"));
        d.setMonSaldo(rs.getBigDecimal("MON_SALDO"));
        d.setMonCuota(rs.getBigDecimal("MON_CUOTA"));
        Object cuotas = rs.getObject("CANT_CUOTAS");
        d.setCantCuotas(cuotas instanceof Number num ? num.longValue() : null);
        d.setFecApertura(dt(rs, "FEC_APERTURA"));
        d.setFecVencimiento(dt(rs, "FEC_VENCIMIENTO"));
        d.setProchaineEcheance(dt(rs, "PROCH_ECH"));
        d.setDatPremiereImpayee(dt(rs, "DAT_PREM_IMP"));
        d.setMntCapImpaye(nvl(rs.getBigDecimal("MNT_CAP_IMP")));
        d.setMntIntImpaye(nvl(rs.getBigDecimal("MNT_INT_IMP")));
        d.setNbEchPayees(rs.getLong("NB_PAYEES"));
        d.setNbEchImpayees(rs.getLong("NB_IMPAYEES"));
        d.setNbEchRestantes(rs.getLong("NB_RESTANTES"));
        d.setUsagerMiseEnPlace(str(rs, "COD_USUARIO"));
        d.setCodGestionnaireSaf(str(rs, "COD_EJECUTIVO"));
        d.setNomGestionnaireSaf(str(rs, "NOM_GESTIONNAIRE"));
        d.setStatutGestionnaireSaf(str(rs, "ACT_GESTIONNAIRE"));
        d.setJoursRetard(d.getDatPremiereImpayee() != null
                ? ChronoUnit.DAYS.between(d.getDatPremiereImpayee(), LocalDate.now()) : null);
        return d;
    };

    // ==================== TT1 (lot 1) : echeances de la periode ====================

    /**
     * Base de l'etat TT1 : une ligne par echeance du plan de paiement tombant dans la
     * periode, sur une liste de codes agence SAF (= points de service digi). Regle reprise
     * de l'ancien point d'entree TT1 jamais active : ligne 0 (deboursement) exclue, credits
     * en etat D (en cours) ou J (contentieux). La part capital est derivee (montant - interets)
     * pour ne dependre que de colonnes deja utilisees en production.
     */
    private static final String ECHEANCES_BASE = """
            FROM PR.PR_PLAN_PAGOS pp
            INNER JOIN PR.PR_CREDITOS cr
                ON pp.COD_EMPRESA = cr.COD_EMPRESA AND pp.COD_AGENCIA = cr.COD_AGENCIA
               AND pp.NUM_CREDITO = cr.NUM_CREDITO
            INNER JOIN CL.CL_CLIENTES c
                ON cr.COD_EMPRESA = c.COD_EMPRESA AND cr.COD_CLIENTE = c.COD_CLIENTE
            LEFT JOIN PR.PR_TIPO_CREDITO tc
                ON cr.COD_EMPRESA = tc.COD_EMPRESA AND cr.TIP_CREDITO = tc.TIP_CREDITO
            LEFT JOIN CF.CF_AGENCIAS ag
                ON cr.COD_EMPRESA = ag.COD_EMPRESA AND cr.COD_AGENCIA = ag.COD_AGENCIA
            WHERE pp.COD_EMPRESA = '00000'
              AND pp.COD_AGENCIA IN (:codes)
              AND pp.NUM_CUOTA <> 0
              AND pp.FEC_CUOTA BETWEEN :du AND :au
              AND cr.IND_ESTADO IN ('D', 'J')
              AND (:recherche IS NULL
                   OR c.NOM_CLIENTE LIKE :recherche
                   OR cr.COD_CLIENTE LIKE :recherche
                   OR CAST(cr.NUM_CREDITO AS VARCHAR(20)) LIKE :recherche)
              AND (:etat = 'toutes'
                   OR (:etat = 'reglees'  AND (COALESCE(pp.SAL_PRINCIPAL, 0) + COALESCE(pp.SAL_INT, 0)) <= 0)
                   OR (:etat = 'aechoir'  AND (COALESCE(pp.SAL_PRINCIPAL, 0) + COALESCE(pp.SAL_INT, 0)) > 0 AND pp.FEC_CUOTA >= :aujourdhui)
                   OR (:etat = 'impayees' AND (COALESCE(pp.SAL_PRINCIPAL, 0) + COALESCE(pp.SAL_INT, 0)) > 0 AND pp.FEC_CUOTA < :aujourdhui))
            """;

    private static final String SQL_ECHEANCES_PERIODE = """
            SELECT cr.COD_AGENCIA, ag.DES_AGENCIA, cr.NUM_CREDITO, cr.COD_CLIENTE, c.NOM_CLIENTE,
                   tc.DES_TIP_CREDITO, cr.IND_ESTADO,
                   c.TEL_PRINCIPAL, c.TEL_SECUNDARIO, c.TEL_OTRO,
                   pp.NUM_CUOTA, pp.FEC_CUOTA, pp.MON_CUOTA, COALESCE(pp.MON_INT, 0) AS MON_INT,
                   COALESCE(pp.SAL_PRINCIPAL, 0) AS SAL_PRINCIPAL, COALESCE(pp.SAL_INT, 0) AS SAL_INT,
                   pp.FEC_CANCELACION
            """ + ECHEANCES_BASE + """
            ORDER BY pp.FEC_CUOTA, c.NOM_CLIENTE, cr.NUM_CREDITO, pp.NUM_CUOTA
            OFFSET :offset ROWS FETCH NEXT :size ROWS ONLY
            """;

    private static final String SQL_COUNT_ECHEANCES_PERIODE = "SELECT COUNT(*) " + ECHEANCES_BASE;

    /** Colonnes d'agregation communes aux indicateurs globaux et a la synthese par agence. */
    private static final String AGREGATS_ECHEANCES = """
                   COUNT(*) AS NB,
                   COUNT(DISTINCT cr.NUM_CREDITO) AS NB_CREDITS,
                   COUNT(DISTINCT cr.COD_CLIENTE) AS NB_CLIENTS,
                   COALESCE(SUM(pp.MON_CUOTA), 0) AS ATTENDU,
                   COALESCE(SUM(COALESCE(pp.MON_INT, 0)), 0) AS INTERETS,
                   COALESCE(SUM(COALESCE(pp.SAL_PRINCIPAL, 0) + COALESCE(pp.SAL_INT, 0)), 0) AS RESTE,
                   SUM(CASE WHEN (COALESCE(pp.SAL_PRINCIPAL, 0) + COALESCE(pp.SAL_INT, 0)) <= 0 THEN 1 ELSE 0 END) AS NB_REGLEES,
                   SUM(CASE WHEN (COALESCE(pp.SAL_PRINCIPAL, 0) + COALESCE(pp.SAL_INT, 0)) > 0 AND pp.FEC_CUOTA >= :aujourdhui THEN 1 ELSE 0 END) AS NB_A_ECHOIR,
                   SUM(CASE WHEN (COALESCE(pp.SAL_PRINCIPAL, 0) + COALESCE(pp.SAL_INT, 0)) > 0 AND pp.FEC_CUOTA < :aujourdhui THEN 1 ELSE 0 END) AS NB_IMPAYEES
            """;

    /** Synthese TT1 (lot 2) : une ligne d'agregats par code agence SAF du perimetre. */
    private static final String SQL_SYNTHESE_ECHEANCES_PAR_AGENCE = """
            SELECT pp.COD_AGENCIA, MAX(ag.DES_AGENCIA) AS DES_AGENCIA,
            """ + AGREGATS_ECHEANCES + ECHEANCES_BASE + """
            GROUP BY pp.COD_AGENCIA
            ORDER BY pp.COD_AGENCIA
            """;

    private static final String SQL_INDICATEURS_ECHEANCES = """
            SELECT COUNT(*) AS NB,
                   COUNT(DISTINCT cr.NUM_CREDITO) AS NB_CREDITS,
                   COUNT(DISTINCT cr.COD_CLIENTE) AS NB_CLIENTS,
                   COALESCE(SUM(pp.MON_CUOTA), 0) AS ATTENDU,
                   COALESCE(SUM(COALESCE(pp.MON_INT, 0)), 0) AS INTERETS,
                   COALESCE(SUM(COALESCE(pp.SAL_PRINCIPAL, 0) + COALESCE(pp.SAL_INT, 0)), 0) AS RESTE,
                   SUM(CASE WHEN (COALESCE(pp.SAL_PRINCIPAL, 0) + COALESCE(pp.SAL_INT, 0)) <= 0 THEN 1 ELSE 0 END) AS NB_REGLEES,
                   SUM(CASE WHEN (COALESCE(pp.SAL_PRINCIPAL, 0) + COALESCE(pp.SAL_INT, 0)) > 0 AND pp.FEC_CUOTA >= :aujourdhui THEN 1 ELSE 0 END) AS NB_A_ECHOIR,
                   SUM(CASE WHEN (COALESCE(pp.SAL_PRINCIPAL, 0) + COALESCE(pp.SAL_INT, 0)) > 0 AND pp.FEC_CUOTA < :aujourdhui THEN 1 ELSE 0 END) AS NB_IMPAYEES
            """ + ECHEANCES_BASE;

    private static MapSqlParameterSource paramsEcheances(List<String> codes, LocalDate du, LocalDate au,
                                                         String etat, String recherche) {
        String filtre = (recherche == null || recherche.isBlank()) ? null : "%" + recherche.trim() + "%";
        return new MapSqlParameterSource()
                .addValue("codes", codes)
                .addValue("du", java.sql.Date.valueOf(du))
                .addValue("au", java.sql.Date.valueOf(au))
                .addValue("etat", etat == null || etat.isBlank() ? "toutes" : etat.trim().toLowerCase())
                .addValue("recherche", filtre, java.sql.Types.VARCHAR)
                .addValue("aujourdhui", java.sql.Date.valueOf(LocalDate.now()));
    }

    public List<EcheancePeriodeDto> findEcheancesPeriode(List<String> codes, LocalDate du, LocalDate au,
                                                          String etat, String recherche, int offset, int size) {
        MapSqlParameterSource p = paramsEcheances(codes, du, au, etat, recherche)
                .addValue("offset", offset).addValue("size", size);
        return execute("portefeuille.echeancesPeriode", () -> primary.query(SQL_ECHEANCES_PERIODE, p, ECHEANCE_PERIODE_MAPPER));
    }

    public long countEcheancesPeriode(List<String> codes, LocalDate du, LocalDate au, String etat, String recherche) {
        MapSqlParameterSource p = paramsEcheances(codes, du, au, etat, recherche);
        Long total = execute("portefeuille.echeancesPeriode.count",
                () -> primary.queryForObject(SQL_COUNT_ECHEANCES_PERIODE, p, Long.class));
        return total != null ? total : 0L;
    }

    public EcheancesIndicateursDto indicateursEcheancesPeriode(List<String> codes, LocalDate du, LocalDate au,
                                                               String etat, String recherche) {
        MapSqlParameterSource p = paramsEcheances(codes, du, au, etat, recherche);
        return execute("portefeuille.echeancesPeriode.indicateurs",
                () -> primary.queryForObject(SQL_INDICATEURS_ECHEANCES, p, (rs, n) -> indicateursDepuis(rs)));
    }

    /** Synthese TT1 (lot 2) : agregats par code agence SAF, niveau PS. */
    public List<io.digiservices.clients.portefeuille.EcheancesSyntheseDto> syntheseEcheancesParAgence(
            List<String> codes, LocalDate du, LocalDate au, String etat, String recherche) {
        MapSqlParameterSource p = paramsEcheances(codes, du, au, etat, recherche);
        return execute("portefeuille.echeancesPeriode.synthese",
                () -> primary.query(SQL_SYNTHESE_ECHEANCES_PAR_AGENCE, p, (rs, n) ->
                        new io.digiservices.clients.portefeuille.EcheancesSyntheseDto(
                                "PS", null, str(rs, "COD_AGENCIA"), str(rs, "DES_AGENCIA"), null, 1, indicateursDepuis(rs))));
    }

    private static EcheancesIndicateursDto indicateursDepuis(java.sql.ResultSet rs) throws java.sql.SQLException {
        BigDecimal attendu = nvl(rs.getBigDecimal("ATTENDU"));
        BigDecimal interets = nvl(rs.getBigDecimal("INTERETS"));
        BigDecimal reste = nvl(rs.getBigDecimal("RESTE"));
        BigDecimal regle = attendu.subtract(reste).max(BigDecimal.ZERO);
        BigDecimal taux = attendu.signum() > 0
                ? regle.multiply(BigDecimal.valueOf(100)).divide(attendu, 1, java.math.RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
        return new EcheancesIndicateursDto(
                rs.getLong("NB"), rs.getLong("NB_CREDITS"), rs.getLong("NB_CLIENTS"),
                attendu, attendu.subtract(interets), interets, regle, reste,
                rs.getLong("NB_REGLEES"), rs.getLong("NB_A_ECHOIR"), rs.getLong("NB_IMPAYEES"), taux);
    }

    private static final RowMapper<EcheancePeriodeDto> ECHEANCE_PERIODE_MAPPER = (rs, n) -> {
        EcheancePeriodeDto d = new EcheancePeriodeDto();
        d.setCodAgencia(str(rs, "COD_AGENCIA"));
        d.setDesAgencia(str(rs, "DES_AGENCIA"));
        d.setNumCredito(rs.getLong("NUM_CREDITO"));
        d.setCodCliente(str(rs, "COD_CLIENTE"));
        d.setNomCliente(str(rs, "NOM_CLIENTE"));
        d.setDesTipCredito(str(rs, "DES_TIP_CREDITO"));
        d.setIndEstado(str(rs, "IND_ESTADO"));
        d.setTelPrincipal(tel(rs, "TEL_PRINCIPAL"));
        d.setTelSecundario(tel(rs, "TEL_SECUNDARIO"));
        d.setTelOtro(tel(rs, "TEL_OTRO"));
        d.setNumCuota(rs.getLong("NUM_CUOTA"));
        d.setFecCuota(dt(rs, "FEC_CUOTA"));
        BigDecimal montant = nvl(rs.getBigDecimal("MON_CUOTA"));
        BigDecimal interets = nvl(rs.getBigDecimal("MON_INT"));
        BigDecimal salP = nvl(rs.getBigDecimal("SAL_PRINCIPAL"));
        BigDecimal salI = nvl(rs.getBigDecimal("SAL_INT"));
        BigDecimal reste = salP.add(salI);
        d.setMonCuota(montant);
        d.setMonInt(interets);
        d.setMonPrincipal(montant.subtract(interets));
        d.setSalPrincipal(salP);
        d.setSalInt(salI);
        d.setResteAPayer(reste);
        d.setFecCancelacion(dt(rs, "FEC_CANCELACION"));
        LocalDate aujourdhui = LocalDate.now();
        if (reste.signum() <= 0) {
            d.setEtat("REGLEE");
            d.setPartielle(false);
        } else {
            boolean echue = d.getFecCuota() != null && d.getFecCuota().isBefore(aujourdhui);
            d.setEtat(echue ? "IMPAYEE" : "A_ECHOIR");
            d.setPartielle(reste.compareTo(montant) < 0);
            d.setJoursRetard(echue ? ChronoUnit.DAYS.between(d.getFecCuota(), aujourdhui) : null);
        }
        return d;
    };


    // ==================== Dossier d'un credit (DSIG, 29/10/2026) ====================

    /**
     * Les cinq tables du script d'extraction de la DSIG, pour UN credit, lues dans la PRODUCTION.
     *
     * <p>Les trois premieres passent par la cle du credit, donc par un index. Les deux dernieres
     * reprennent les liens du script, qui sont des recherches dans du texte libre et n'utilisent
     * aucun index : elles sont bornees par l'entreprise, le point de service, la date d'ouverture
     * du credit (aucune ecriture anterieure ne peut le concerner) et un plafond de lignes.</p>
     */
    private static final String SQL_DOSSIER_FICHE = """
            SELECT * FROM PR.PR_CREDITOS
             WHERE COD_AGENCIA = :codAgencia AND NUM_CREDITO = :numCredito
            """;

    private static final String SQL_DOSSIER_ECHEANCIER = """
            SELECT TOP (:max) * FROM PR.PR_PLAN_PAGOS
             WHERE COD_EMPRESA = :codEmpresa AND COD_AGENCIA = :codAgencia AND NUM_CREDITO = :numCredito
             ORDER BY NUM_CUOTA
            """;

    private static final String SQL_DOSSIER_MOUVEMENTS = """
            SELECT TOP (:max) * FROM PR.PR_MOVIMIENTOS
             WHERE COD_EMPRESA = :codEmpresa AND COD_AGENCIA = :codAgencia AND NUM_CREDITO = :numCredito
             ORDER BY FEC_MOVIMIENTO, NUM_MOVIMIENTO
            """;

    // Lien du script : le compte du credit, OU son numero cite dans le libelle du mouvement.
    private static final String SQL_DOSSIER_COMPTE = """
            SELECT TOP (:max) * FROM CC.CC_MOVIMTO_MENSUAL
             WHERE COD_EMPRESA = :codEmpresa AND COD_AGENCIA = :codAgencia
               AND (:depuis IS NULL OR FEC_MOVIMIENTO >= :depuis)
               AND ((:idCuenta IS NOT NULL
                     AND CONVERT(VARCHAR(100), NUM_CUENTA) COLLATE DATABASE_DEFAULT
                       = CONVERT(VARCHAR(100), :idCuenta) COLLATE DATABASE_DEFAULT)
                 OR CHARINDEX(CONVERT(VARCHAR(30), :numTexte) COLLATE DATABASE_DEFAULT,
                              ISNULL(CONVERT(VARCHAR(MAX), DES_MOVIMIENTO), '') COLLATE DATABASE_DEFAULT) > 0)
             ORDER BY FEC_MOVIMIENTO, NUM_MOVIMIENTO
            """;

    // Lien du script : le numero du credit cite dans la reference de l'ecriture.
    private static final String SQL_DOSSIER_ECRITURES = """
            SELECT TOP (:max) * FROM CG.CG_ASTO_DETALLE
             WHERE COD_EMPRESA = :codEmpresa AND COD_AGENCIA = :codAgencia
               AND (:depuis IS NULL OR FEC_MOVIMIENTO >= :depuis)
               AND CHARINDEX(CONVERT(VARCHAR(30), :numTexte) COLLATE DATABASE_DEFAULT,
                             ISNULL(CONVERT(VARCHAR(MAX), REFERENCIA), '') COLLATE DATABASE_DEFAULT) > 0
             ORDER BY FEC_MOVIMIENTO, NUM_ASIENTO, NUM_LINEA
            """;

    public io.digiservices.clients.portefeuille.DossierCreditDto dossierCredit(String codAgencia, Long numCredito, int max) {
        io.digiservices.ebanking.config.SafRoutage.Cible avant =
                io.digiservices.ebanking.config.SafRoutage.courante();
        io.digiservices.ebanking.config.SafRoutage.forcer(
                io.digiservices.ebanking.config.SafRoutage.Cible.PRODUCTION);
        try {
            java.util.Map<String, Long> millis = new java.util.LinkedHashMap<>();
            MapSqlParameterSource cle = new MapSqlParameterSource()
                    .addValue("codAgencia", codAgencia).addValue("numCredito", numCredito);
            List<java.util.Map<String, Object>> fiches = chrono(millis, "fiche",
                    () -> execute("portefeuille.dossier.fiche", () -> primary.query(SQL_DOSSIER_FICHE, cle, LIGNE_BRUTE)));
            if (fiches.isEmpty()) {
                log.info("[DOSSIER] credit {}/{} introuvable dans SAF", codAgencia, numCredito);
                return io.digiservices.clients.portefeuille.DossierCreditDto.builder()
                        .codAgencia(codAgencia).numCredito(numCredito).dateLecture(LocalDate.now())
                        .trouve(false).millisecondes(millis).build();
            }
            java.util.Map<String, Object> fiche = fiches.get(0);
            Object empresa = fiche.get("COD_EMPRESA");
            Object idCuenta = fiche.get("ID_CUENTA");
            Object ouverture = fiche.get("FEC_APERTURA");
            LocalDate fecApertura = ouverture instanceof LocalDate d ? d : null;

            MapSqlParameterSource p = new MapSqlParameterSource()
                    .addValue("codEmpresa", empresa).addValue("codAgencia", codAgencia)
                    .addValue("numCredito", numCredito).addValue("max", max);
            MapSqlParameterSource q = new MapSqlParameterSource()
                    .addValue("codEmpresa", empresa).addValue("codAgencia", codAgencia)
                    .addValue("max", max)
                    .addValue("numTexte", String.valueOf(numCredito))
                    .addValue("idCuenta", idCuenta == null ? null : String.valueOf(idCuenta))
                    .addValue("depuis", fecApertura == null ? null : java.sql.Date.valueOf(fecApertura));

            List<java.util.Map<String, Object>> echeancier = chrono(millis, "echeancier",
                    () -> execute("portefeuille.dossier.echeancier", () -> primary.query(SQL_DOSSIER_ECHEANCIER, p, LIGNE_BRUTE)));
            List<java.util.Map<String, Object>> mouvements = chrono(millis, "mouvements",
                    () -> execute("portefeuille.dossier.mouvements", () -> primary.query(SQL_DOSSIER_MOUVEMENTS, p, LIGNE_BRUTE)));
            List<java.util.Map<String, Object>> compte = chrono(millis, "compte",
                    () -> execute("portefeuille.dossier.compte", () -> primary.query(SQL_DOSSIER_COMPTE, q, LIGNE_BRUTE)));
            List<java.util.Map<String, Object>> ecritures = chrono(millis, "ecritures",
                    () -> execute("portefeuille.dossier.ecritures", () -> primary.query(SQL_DOSSIER_ECRITURES, q, LIGNE_BRUTE)));

            log.info("[DOSSIER] credit {}/{} : {} echeances, {} mouvements, {} lignes de compte, {} ecritures — {} ms",
                    codAgencia, numCredito, echeancier.size(), mouvements.size(), compte.size(), ecritures.size(),
                    millis.values().stream().mapToLong(Long::longValue).sum());

            return io.digiservices.clients.portefeuille.DossierCreditDto.builder()
                    .codAgencia(codAgencia).numCredito(numCredito)
                    .codCliente(texte(fiche.get("COD_CLIENTE"))).desAgencia(null)
                    .idCuenta(texte(idCuenta)).fecApertura(fecApertura).dateLecture(LocalDate.now())
                    .trouve(true).fiche(fiche)
                    .echeancier(echeancier).mouvements(mouvements)
                    .mouvementsCompte(compte).ecritures(ecritures)
                    .echeancierComplet(echeancier.size() < max).mouvementsComplets(mouvements.size() < max)
                    .mouvementsCompteComplets(compte.size() < max).ecrituresCompletes(ecritures.size() < max)
                    .millisecondes(millis)
                    .build();
        } finally {
            if (avant == null) {
                io.digiservices.ebanking.config.SafRoutage.effacer();
            } else {
                io.digiservices.ebanking.config.SafRoutage.forcer(avant);
            }
        }
    }

    /**
     * Une ligne SAF telle quelle : colonne par colonne, dans l'ordre de la table. Les dates et
     * horodatages sont convertis en types Java datables, pour que la serialisation les rende en
     * ISO et non en nombre de secondes.
     */
    private static final RowMapper<java.util.Map<String, Object>> LIGNE_BRUTE = (rs, n) -> {
        java.sql.ResultSetMetaData meta = rs.getMetaData();
        java.util.Map<String, Object> ligne = new java.util.LinkedHashMap<>(meta.getColumnCount() * 2);
        for (int i = 1; i <= meta.getColumnCount(); i++) {
            Object v = rs.getObject(i);
            if (v instanceof java.sql.Timestamp t) {
                v = t.toLocalDateTime();
            } else if (v instanceof java.sql.Date d) {
                v = d.toLocalDate();
            } else if (v instanceof byte[]) {
                v = null;   // colonnes binaires : sans interet ici, et illisibles a l'ecran
            } else if (v instanceof String texte) {
                v = texte.trim();
            }
            ligne.put(meta.getColumnLabel(i), v);
        }
        return ligne;
    };

    private static <R> R chrono(java.util.Map<String, Long> millis, String nom, Supplier<R> action) {
        long debut = System.currentTimeMillis();
        try {
            return action.get();
        } finally {
            millis.put(nom, System.currentTimeMillis() - debut);
        }
    }

    private static String texte(Object v) {
        return v == null ? null : String.valueOf(v).trim();
    }

    private <R> R execute(String op, Supplier<R> action) {
        long start = System.currentTimeMillis();
        try {
            R result = action.get();
            log.debug("[PORTEFEUILLE] {} OK en {} ms", op, System.currentTimeMillis() - start);
            return result;
        } catch (DataAccessResourceFailureException | QueryTimeoutException e) {
            if (TertiaryUnavailableException.estEnRestauration(e)) {
                log.warn("[PORTEFEUILLE] {} : sauvegarde SAF en cours de restauration", op);
                throw new TertiaryUnavailableException(TertiaryUnavailableException.MESSAGE_RESTAURATION, e);
            }
            log.error("[PORTEFEUILLE] {} : datasource primary indisponible - {}", op, e.getMessage());
            throw new TertiaryUnavailableException("Base SAF momentanement indisponible", e);
        } catch (DataAccessException e) {
            if (TertiaryUnavailableException.estEnRestauration(e)) {
                log.warn("[PORTEFEUILLE] {} : sauvegarde SAF en cours de restauration", op);
                throw new TertiaryUnavailableException(TertiaryUnavailableException.MESSAGE_RESTAURATION, e);
            }
            log.error("[PORTEFEUILLE] {} : erreur d'acces aux donnees - {}", op, e.getMessage());
            throw e;
        }
    }

    private static BigDecimal nvl(BigDecimal v) {
        return v != null ? v : BigDecimal.ZERO;
    }

    private static String str(ResultSet rs, String col) throws SQLException {
        String v = rs.getString(col);
        return v != null ? v.trim() : null;
    }

    /** Numero de telephone SAF : espaces retires, chaine vide ramenee a null. Aucune autre transformation. */
    /**
     * Entier d'une colonne SAF. {@code getObject} rend ici un BigDecimal, car le type SQL Server
     * est numerique et non int : le transtypage direct echouait (« BigDecimal cannot be cast to
     * Integer », surveillance des credits negatifs du 25/10/2026).
     */
    private static Integer entier(ResultSet rs, String col) throws SQLException {
        Object v = rs.getObject(col);
        if (v == null) {
            return null;
        }
        return v instanceof Number nombre ? nombre.intValue() : Integer.valueOf(v.toString().trim());
    }

    private static String tel(ResultSet rs, String col) throws SQLException {
        String v = rs.getString(col);
        if (v == null) return null;
        String t = v.replace("\u00a0", " ").trim();
        return t.isEmpty() ? null : t;
    }

    private static LocalDate dt(ResultSet rs, String col) throws SQLException {
        java.sql.Date d = rs.getDate(col);
        return d != null ? d.toLocalDate() : null;
    }
}
