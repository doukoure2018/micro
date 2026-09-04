package io.digiservices.ebanking.repository;

import io.digiservices.clients.portefeuille.AgenceSafDto;
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
            WHERE cr.COD_AGENCIA = :codAgencia
              AND cr.IND_ESTADO NOT IN ('C', 'T', 'X')
              AND cr.MON_SALDO > 0
              AND (:recherche IS NULL
                   OR c.NOM_CLIENTE LIKE :recherche
                   OR cr.COD_CLIENTE LIKE :recherche
                   OR CAST(cr.NUM_CREDITO AS VARCHAR(20)) LIKE :recherche)
            """;

    // Les retards d'abord (plus ancien en tete), puis les credits sains par numero.
    private static final String SQL_FIND_CREDITS = "SELECT * FROM (" + CREDIT_BASE + """
            ) t
            WHERE (:seulementRetard = 0 OR t.DAT_PREM_IMP IS NOT NULL)
            ORDER BY CASE WHEN t.DAT_PREM_IMP IS NULL THEN 1 ELSE 0 END, t.DAT_PREM_IMP, t.NUM_CREDITO
            OFFSET :offset ROWS FETCH NEXT :size ROWS ONLY
            """;

    private static final String SQL_COUNT_CREDITS = "SELECT COUNT(*) FROM (" + CREDIT_BASE + """
            ) t
            WHERE (:seulementRetard = 0 OR t.DAT_PREM_IMP IS NOT NULL)
            """;

    private static final String SQL_INDICATEURS = "SELECT COUNT(*) AS NB, " + """
                   COALESCE(SUM(t.MON_SALDO), 0) AS ENCOURS,
                   SUM(CASE WHEN t.DAT_PREM_IMP IS NOT NULL THEN 1 ELSE 0 END) AS NB_RETARD,
                   COALESCE(SUM(COALESCE(t.MNT_CAP_IMP, 0) + COALESCE(t.MNT_INT_IMP, 0)), 0) AS IMPAYE,
                   COALESCE(SUM(CASE WHEN t.DAT_PREM_IMP <= :date30 THEN t.MON_SALDO ELSE 0 END), 0) AS ENCOURS_PAR30,
                   COALESCE(SUM(CASE WHEN t.DAT_PREM_IMP <= :date90 THEN t.MON_SALDO ELSE 0 END), 0) AS ENCOURS_PAR90
            FROM ("""
            + CREDIT_BASE + ") t";

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
                   c.NOM_CLIENTE, pp.FEC_CUOTA, pp.MON_CUOTA
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
                   COALESCE(t.CAP_IMP, 0) + COALESCE(t.INT_IMP, 0) AS MNT_IMP
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

    private static final String SQL_INDICATEURS_RESEAU = "SELECT cr.COD_AGENCIA, ag.DES_AGENCIA, COUNT(*) AS NB, " + """
                   COALESCE(SUM(cr.MON_SALDO), 0) AS ENCOURS,
                   SUM(CASE WHEN t.PREM_IMP IS NOT NULL THEN 1 ELSE 0 END) AS NB_RETARD,
                   COALESCE(SUM(COALESCE(t.CAP_IMP, 0) + COALESCE(t.INT_IMP, 0)), 0) AS IMPAYE,
                   COALESCE(SUM(CASE WHEN t.PREM_IMP <= :date30 THEN cr.MON_SALDO ELSE 0 END), 0) AS ENCOURS_PAR30,
                   COALESCE(SUM(CASE WHEN t.PREM_IMP <= :date90 THEN cr.MON_SALDO ELSE 0 END), 0) AS ENCOURS_PAR90
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

    /** Echeances non payees tombant exactement a J+joursAvant (credits actifs). */
    public List<io.digiservices.clients.portefeuille.EcheanceAvenirDto> findEcheancesAvenir(int joursAvant) {
        MapSqlParameterSource p = new MapSqlParameterSource()
                .addValue("dateCible", java.sql.Date.valueOf(LocalDate.now().plusDays(joursAvant)));
        return execute("portefeuille.echeancesAvenir", () -> primary.query(SQL_ECHEANCES_AVENIR, p,
                (rs, n) -> new io.digiservices.clients.portefeuille.EcheanceAvenirDto(
                        str(rs, "COD_AGENCIA"), str(rs, "DES_AGENCIA"), rs.getLong("NUM_CREDITO"),
                        str(rs, "COD_CLIENTE"), str(rs, "NOM_CLIENTE"),
                        dt(rs, "FEC_CUOTA"), rs.getBigDecimal("MON_CUOTA"))));
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
                        dt(rs, "PREM_IMP"), rs.getBigDecimal("MON_SALDO"), rs.getBigDecimal("MNT_IMP"))));
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
                        rs.getBigDecimal("ENCOURS_PAR30"), rs.getBigDecimal("ENCOURS_PAR90"))));
    }

    public List<AgenceSafDto> findAgences() {
        return execute("portefeuille.agences", () -> primary.query(SQL_AGENCES,
                (rs, n) -> new AgenceSafDto(str(rs, "COD_AGENCIA"), str(rs, "DES_AGENCIA"))));
    }

    public List<PortefeuilleCreditDto> findCredits(String codAgencia, boolean seulementRetard,
                                                   String recherche, int offset, int size) {
        MapSqlParameterSource p = paramsBase(codAgencia, recherche)
                .addValue("seulementRetard", seulementRetard ? 1 : 0)
                .addValue("offset", offset)
                .addValue("size", size);
        return execute("portefeuille.credits", () -> primary.query(SQL_FIND_CREDITS, p, CREDIT_MAPPER));
    }

    public long countCredits(String codAgencia, boolean seulementRetard, String recherche) {
        MapSqlParameterSource p = paramsBase(codAgencia, recherche)
                .addValue("seulementRetard", seulementRetard ? 1 : 0);
        Long total = execute("portefeuille.count", () -> primary.queryForObject(SQL_COUNT_CREDITS, p, Long.class));
        return total != null ? total : 0L;
    }

    public PortefeuilleIndicateursDto indicateurs(String codAgencia) {
        LocalDate aujourdhui = LocalDate.now();
        MapSqlParameterSource p = paramsBase(codAgencia, null)
                .addValue("date30", java.sql.Date.valueOf(aujourdhui.minusDays(30)))
                .addValue("date90", java.sql.Date.valueOf(aujourdhui.minusDays(90)));
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
        d.setJoursRetard(d.getDatPremiereImpayee() != null
                ? ChronoUnit.DAYS.between(d.getDatPremiereImpayee(), LocalDate.now()) : null);
        return d;
    };

    private <R> R execute(String op, Supplier<R> action) {
        long start = System.currentTimeMillis();
        try {
            R result = action.get();
            log.debug("[PORTEFEUILLE] {} OK en {} ms", op, System.currentTimeMillis() - start);
            return result;
        } catch (DataAccessResourceFailureException | QueryTimeoutException e) {
            log.error("[PORTEFEUILLE] {} : datasource primary indisponible - {}", op, e.getMessage());
            throw new TertiaryUnavailableException("Base SAF momentanement indisponible", e);
        } catch (DataAccessException e) {
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

    private static LocalDate dt(ResultSet rs, String col) throws SQLException {
        java.sql.Date d = rs.getDate(col);
        return d != null ? d.toLocalDate() : null;
    }
}
