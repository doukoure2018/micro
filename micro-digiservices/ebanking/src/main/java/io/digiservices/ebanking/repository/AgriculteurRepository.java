package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.exception.TertiaryUnavailableException;
import io.digiservices.ebanking.paylaod.AgriAgencyDto;
import io.digiservices.ebanking.paylaod.AgriCreditDto;
import io.digiservices.ebanking.paylaod.CooperativeDto;
import io.digiservices.ebanking.paylaod.CooperativeMemberDto;
import io.digiservices.ebanking.paylaod.FarmerDto;
import io.digiservices.ebanking.paylaod.FarmerLegalDto;
import io.digiservices.ebanking.paylaod.FarmerPhysicalDto;
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
import java.util.List;
import java.util.function.Supplier;

import static io.digiservices.ebanking.constant.AgriculturalFilter.AGRICULTURAL_FILTER_CREDIT;

/**
 * Acces lecture seule au perimetre agricole de SAF2000 (BDCRG PROD).
 *
 * <p><b>Regle absolue :</b> ce repository utilise UNIQUEMENT la datasource
 * {@code tertiaryJdbcTemplate} (BDCRG PROD). Aucune autre.</p>
 *
 * <p>Chaque appel SQL est protege : une indisponibilite de connexion / timeout
 * est convertie en {@link TertiaryUnavailableException} (-> HTTP 503), les autres
 * erreurs d'acces remontent telles quelles (-> HTTP 500).</p>
 */
@Repository
@Slf4j
public class AgriculteurRepository {

    private final NamedParameterJdbcTemplate tertiary;

    public AgriculteurRepository(@Qualifier("tertiaryJdbcTemplate") JdbcTemplate tertiaryJdbcTemplate) {
        // NamedParameterJdbcTemplate construit a partir du JdbcTemplate tertiary (BDCRG PROD)
        this.tertiary = new NamedParameterJdbcTemplate(tertiaryJdbcTemplate);
    }

    // ============================================================
    //  REQUETES SQL (inline, alias cr obligatoire sur PR_CREDITOS)
    // ============================================================

    private static final String SQL_FIND_AGENCIES = """
            SELECT ag.COD_EMPRESA, ag.COD_AGENCIA, ag.DES_AGENCIA
            FROM CF.CF_AGENCIAS ag
            WHERE ag.COD_EMPRESA = '00000'
            ORDER BY ag.COD_AGENCIA
            """;

    /** Prefixe commun (SELECT + FROM + jointures) pour les credits agricoles enrichis. */
    private static final String AGRI_CREDIT_SELECT = """
            SELECT cr.COD_EMPRESA, cr.COD_AGENCIA, cr.NUM_CREDITO, cr.COD_CLIENTE,
                   c.NOM_CLIENTE, c.IND_PERSONA,
                   cr.TIP_CREDITO, tc.DES_TIP_CREDITO, cr.COD_ACTIVIDAD,
                   cr.MON_CREDITO, cr.MON_SALDO, cr.FEC_APERTURA, cr.FEC_VENCIMIENTO,
                   cr.IND_ESTADO, cr.CANT_HECTAREAS,
                   cr.COD_PLAN_INVERSION, pinv.NOM_PLAN,
                   cr.COD_GRUPO_SOL, g_sol.DES_GRUPO AS DES_GRUPO_SOL,
                   cr.COD_ASOCIACION, g_aso.DES_GRUPO AS DES_ASOCIACION
            FROM PR.PR_CREDITOS cr
            INNER JOIN CL.CL_CLIENTES c
                ON cr.COD_EMPRESA = c.COD_EMPRESA AND cr.COD_CLIENTE = c.COD_CLIENTE
            LEFT JOIN PR.PR_TIPO_CREDITO tc
                ON cr.COD_EMPRESA = tc.COD_EMPRESA AND cr.TIP_CREDITO = tc.TIP_CREDITO
            LEFT JOIN PR.PR_PLAN_INVERSION pinv
                ON cr.COD_EMPRESA = pinv.COD_EMPRESA AND cr.COD_PLAN_INVERSION = pinv.COD_PLAN_INVERSION
            LEFT JOIN CL.CL_GRUPOS_ECONOMICOS g_sol
                ON cr.COD_EMPRESA = g_sol.COD_EMPRESA AND cr.COD_GRUPO_SOL = g_sol.COD_GRUPO
            LEFT JOIN CL.CL_GRUPOS_ECONOMICOS g_aso
                ON cr.COD_EMPRESA = g_aso.COD_EMPRESA AND cr.COD_ASOCIACION = g_aso.COD_GRUPO
            """;

    private static final String SQL_COUNT_PORTFOLIO = """
            SELECT COUNT(*)
            FROM PR.PR_CREDITOS cr
            WHERE cr.COD_AGENCIA = :codAgencia
              AND """ + AGRICULTURAL_FILTER_CREDIT;

    private static final String SQL_FIND_PORTFOLIO = AGRI_CREDIT_SELECT + """
            WHERE cr.COD_AGENCIA = :codAgencia
              AND """ + AGRICULTURAL_FILTER_CREDIT + """
            ORDER BY cr.FEC_APERTURA DESC, cr.NUM_CREDITO DESC
            OFFSET :offset ROWS FETCH NEXT :size ROWS ONLY
            """;

    private static final String SQL_FIND_CREDITS_BY_CLIENT = AGRI_CREDIT_SELECT + """
            WHERE cr.COD_CLIENTE = :codCliente
              AND """ + AGRICULTURAL_FILTER_CREDIT + """
            ORDER BY cr.FEC_APERTURA DESC, cr.NUM_CREDITO DESC
            """;

    private static final String SQL_FIND_CREDIT_DETAIL = AGRI_CREDIT_SELECT + """
            WHERE cr.NUM_CREDITO = :numCredito
              AND """ + AGRICULTURAL_FILTER_CREDIT;

    /** Prefixe commun pour les agriculteurs (client + details + activite + agence + agregats credits). */
    private static final String FARMER_SELECT = """
            SELECT c.COD_EMPRESA, c.COD_CLIENTE, c.NOM_CLIENTE, c.IND_PERSONA,
                   c.TEL_PRINCIPAL, c.FEC_INGRESO, c.COD_AGENCIA, ag.DES_AGENCIA,
                   pf.PRIMER_NOMBRE, pf.PRIMER_APELLIDO, pf.IND_SEXO,
                   pf.NACIONALIDAD, pf.LUGAR_NACIMIENTO, prof.DES_PROFESION,
                   pj.RAZON_SOCIAL, pj.NOM_COMERCIAL, pj.CLASE_SOCIEDAD,
                   act.DES_ACTIVIDAD, sec.DES_SECTOR,
                   cag.NB_CREDITS, cag.TOTAL_AMOUNT
            FROM CL.CL_CLIENTES c
            LEFT JOIN CL.CL_PERSONAS_FISICAS pf
                ON c.COD_EMPRESA = pf.COD_EMPRESA AND c.COD_CLIENTE = pf.COD_CLIENTE
            LEFT JOIN CL.CL_PERSONAS_JURIDICAS pj
                ON c.COD_EMPRESA = pj.COD_EMPRESA AND c.COD_CLIENTE = pj.COD_CLIENTE
            LEFT JOIN CL.CL_CAT_PROFESIONES prof
                ON pf.COD_EMPRESA = prof.COD_EMPRESA AND pf.COD_PROFESION = prof.COD_PROFESION
            LEFT JOIN CL.CL_ACTIVIDAD_ECONOMICA act
                ON COALESCE(pf.COD_EMPRESA, pj.COD_EMPRESA) = act.COD_EMPRESA
               AND COALESCE(pf.COD_ACTIVIDAD, pj.COD_ACTIVIDAD) = act.COD_ACTIVIDAD
            LEFT JOIN CL.CL_SECTOR_ECONOMICO sec
                ON COALESCE(pf.COD_EMPRESA, pj.COD_EMPRESA) = sec.COD_EMPRESA
               AND COALESCE(pf.COD_SECTOR, pj.COD_SECTOR) = sec.COD_SECTOR
            LEFT JOIN CF.CF_AGENCIAS ag
                ON c.COD_EMPRESA = ag.COD_EMPRESA AND c.COD_AGENCIA = ag.COD_AGENCIA
            INNER JOIN (
                SELECT cr.COD_EMPRESA, cr.COD_CLIENTE,
                       COUNT(*) AS NB_CREDITS, SUM(cr.MON_CREDITO) AS TOTAL_AMOUNT
                FROM PR.PR_CREDITOS cr
                WHERE """ + AGRICULTURAL_FILTER_CREDIT + """
                GROUP BY cr.COD_EMPRESA, cr.COD_CLIENTE
            ) cag ON c.COD_EMPRESA = cag.COD_EMPRESA AND c.COD_CLIENTE = cag.COD_CLIENTE
            """;

    private static final String SQL_COUNT_FARMERS = """
            SELECT COUNT(*) FROM (
                SELECT cr.COD_EMPRESA, cr.COD_CLIENTE
                FROM PR.PR_CREDITOS cr
                WHERE """ + AGRICULTURAL_FILTER_CREDIT + """
                GROUP BY cr.COD_EMPRESA, cr.COD_CLIENTE
            ) t
            """;

    private static final String SQL_FIND_FARMERS = FARMER_SELECT + """
            ORDER BY cag.TOTAL_AMOUNT DESC, c.COD_CLIENTE ASC
            OFFSET :offset ROWS FETCH NEXT :size ROWS ONLY
            """;

    private static final String SQL_FIND_FARMER_BY_ID = FARMER_SELECT + """
            WHERE c.COD_CLIENTE = :codCliente
            ORDER BY cag.TOTAL_AMOUNT DESC, c.COD_CLIENTE ASC
            """;

    /** Sous-requetes correlees d'agregats pour une cooperative. */
    private static final String COOP_AGGREGATES =
            "       COUNT(DISTINCT gxc.COD_CLIENTE) AS MEMBER_COUNT,\n" +
            "       (SELECT COUNT(*) FROM PR.PR_CREDITOS cr\n" +
            "          WHERE (cr.COD_GRUPO_SOL = g.COD_GRUPO OR cr.COD_ASOCIACION = g.COD_GRUPO)\n" +
            "            AND " + AGRICULTURAL_FILTER_CREDIT + " ) AS CREDIT_COUNT,\n" +
            "       (SELECT SUM(cr.MON_CREDITO) FROM PR.PR_CREDITOS cr\n" +
            "          WHERE (cr.COD_GRUPO_SOL = g.COD_GRUPO OR cr.COD_ASOCIACION = g.COD_GRUPO)\n" +
            "            AND " + AGRICULTURAL_FILTER_CREDIT + " ) AS TOTAL_AMOUNT\n";

    private static final String SQL_COUNT_COOPERATIVES = """
            SELECT COUNT(*)
            FROM CL.CL_GRUPOS_ECONOMICOS g
            WHERE EXISTS (
                SELECT 1 FROM PR.PR_CREDITOS cr
                WHERE (cr.COD_GRUPO_SOL = g.COD_GRUPO OR cr.COD_ASOCIACION = g.COD_GRUPO)
                  AND """ + AGRICULTURAL_FILTER_CREDIT + """
            )
            """;

    private static final String SQL_FIND_COOPERATIVES = """
            SELECT g.COD_GRUPO, g.DES_GRUPO, g.ACTIVIDAD_GRUPO,
            """ + COOP_AGGREGATES + """
            FROM CL.CL_GRUPOS_ECONOMICOS g
            LEFT JOIN CL.CL_GRUPOS_X_CLIENTE gxc
                ON g.COD_EMPRESA = gxc.COD_EMPRESA AND g.COD_GRUPO = gxc.COD_GRUPO
            WHERE EXISTS (
                SELECT 1 FROM PR.PR_CREDITOS cr
                WHERE (cr.COD_GRUPO_SOL = g.COD_GRUPO OR cr.COD_ASOCIACION = g.COD_GRUPO)
                  AND """ + AGRICULTURAL_FILTER_CREDIT + """
            )
            GROUP BY g.COD_GRUPO, g.DES_GRUPO, g.ACTIVIDAD_GRUPO
            ORDER BY MEMBER_COUNT DESC, g.COD_GRUPO ASC
            OFFSET :offset ROWS FETCH NEXT :size ROWS ONLY
            """;

    private static final String SQL_FIND_COOPERATIVE_BY_ID = """
            SELECT g.COD_GRUPO, g.DES_GRUPO, g.ACTIVIDAD_GRUPO,
            """ + COOP_AGGREGATES + """
            FROM CL.CL_GRUPOS_ECONOMICOS g
            LEFT JOIN CL.CL_GRUPOS_X_CLIENTE gxc
                ON g.COD_EMPRESA = gxc.COD_EMPRESA AND g.COD_GRUPO = gxc.COD_GRUPO
            WHERE g.COD_GRUPO = :codGrupo
            GROUP BY g.COD_GRUPO, g.DES_GRUPO, g.ACTIVIDAD_GRUPO
            """;

    private static final String SQL_COUNT_COOP_MEMBERS = """
            SELECT COUNT(*)
            FROM CL.CL_GRUPOS_X_CLIENTE gxc
            WHERE gxc.COD_GRUPO = :codGrupo
            """;

    private static final String SQL_FIND_COOP_MEMBERS = """
            SELECT gxc.COD_CLIENTE, c.NOM_CLIENTE, c.IND_PERSONA,
                   gxc.IND_GRADO, gxc.FEC_REGISTRO
            FROM CL.CL_GRUPOS_X_CLIENTE gxc
            INNER JOIN CL.CL_CLIENTES c
                ON gxc.COD_EMPRESA = c.COD_EMPRESA AND gxc.COD_CLIENTE = c.COD_CLIENTE
            WHERE gxc.COD_GRUPO = :codGrupo
            ORDER BY gxc.IND_GRADO, gxc.FEC_REGISTRO, gxc.COD_CLIENTE
            OFFSET :offset ROWS FETCH NEXT :size ROWS ONLY
            """;

    // ============================================================
    //  API publique du repository
    // ============================================================

    public List<AgriAgencyDto> findAllAgencies() {
        return execute("findAllAgencies",
                () -> tertiary.query(SQL_FIND_AGENCIES, new MapSqlParameterSource(), AGENCY_MAPPER));
    }

    public long countAgencyPortfolio(String codAgencia) {
        MapSqlParameterSource p = new MapSqlParameterSource("codAgencia", codAgencia);
        return execute("countAgencyPortfolio",
                () -> nullSafe(tertiary.queryForObject(SQL_COUNT_PORTFOLIO, p, Long.class)));
    }

    public List<AgriCreditDto> findAgencyPortfolio(String codAgencia, int offset, int size) {
        MapSqlParameterSource p = new MapSqlParameterSource()
                .addValue("codAgencia", codAgencia)
                .addValue("offset", offset)
                .addValue("size", size);
        return execute("findAgencyPortfolio",
                () -> tertiary.query(SQL_FIND_PORTFOLIO, p, CREDIT_MAPPER));
    }

    public long countFarmers() {
        return execute("countFarmers",
                () -> nullSafe(tertiary.queryForObject(SQL_COUNT_FARMERS, new MapSqlParameterSource(), Long.class)));
    }

    public List<FarmerDto> findFarmers(int offset, int size) {
        MapSqlParameterSource p = new MapSqlParameterSource()
                .addValue("offset", offset)
                .addValue("size", size);
        return execute("findFarmers",
                () -> tertiary.query(SQL_FIND_FARMERS, p, FARMER_MAPPER));
    }

    public FarmerDto findFarmerById(String codCliente) {
        MapSqlParameterSource p = new MapSqlParameterSource("codCliente", codCliente);
        return execute("findFarmerById",
                () -> first(tertiary.query(SQL_FIND_FARMER_BY_ID, p, FARMER_MAPPER)));
    }

    public List<AgriCreditDto> findAgriculturalCreditsByClient(String codCliente) {
        MapSqlParameterSource p = new MapSqlParameterSource("codCliente", codCliente);
        return execute("findAgriculturalCreditsByClient",
                () -> tertiary.query(SQL_FIND_CREDITS_BY_CLIENT, p, CREDIT_MAPPER));
    }

    public AgriCreditDto findCreditDetail(Long numCredito) {
        MapSqlParameterSource p = new MapSqlParameterSource("numCredito", numCredito);
        return execute("findCreditDetail",
                () -> first(tertiary.query(SQL_FIND_CREDIT_DETAIL, p, CREDIT_MAPPER)));
    }

    public long countCooperatives() {
        return execute("countCooperatives",
                () -> nullSafe(tertiary.queryForObject(SQL_COUNT_COOPERATIVES, new MapSqlParameterSource(), Long.class)));
    }

    public List<CooperativeDto> findCooperatives(int offset, int size) {
        MapSqlParameterSource p = new MapSqlParameterSource()
                .addValue("offset", offset)
                .addValue("size", size);
        return execute("findCooperatives",
                () -> tertiary.query(SQL_FIND_COOPERATIVES, p, COOPERATIVE_MAPPER));
    }

    public CooperativeDto findCooperativeById(String codGrupo) {
        MapSqlParameterSource p = new MapSqlParameterSource("codGrupo", codGrupo);
        return execute("findCooperativeById",
                () -> first(tertiary.query(SQL_FIND_COOPERATIVE_BY_ID, p, COOPERATIVE_MAPPER)));
    }

    public long countCooperativeMembers(String codGrupo) {
        MapSqlParameterSource p = new MapSqlParameterSource("codGrupo", codGrupo);
        return execute("countCooperativeMembers",
                () -> nullSafe(tertiary.queryForObject(SQL_COUNT_COOP_MEMBERS, p, Long.class)));
    }

    public List<CooperativeMemberDto> findCooperativeMembers(String codGrupo, int offset, int size) {
        MapSqlParameterSource p = new MapSqlParameterSource()
                .addValue("codGrupo", codGrupo)
                .addValue("offset", offset)
                .addValue("size", size);
        return execute("findCooperativeMembers",
                () -> tertiary.query(SQL_FIND_COOP_MEMBERS, p, MEMBER_MAPPER));
    }

    // ============================================================
    //  Protection tertiary + helpers
    // ============================================================

    /**
     * Execute un acces tertiary en convertissant une indisponibilite de connexion
     * / un timeout en {@link TertiaryUnavailableException}. Mesure la duree (DEBUG).
     */
    private <R> R execute(String op, Supplier<R> action) {
        long start = System.currentTimeMillis();
        try {
            R result = action.get();
            log.debug("[AGRI] {} OK en {} ms", op, System.currentTimeMillis() - start);
            return result;
        } catch (DataAccessResourceFailureException | QueryTimeoutException e) {
            log.error("[AGRI] {} : datasource tertiary (BDCRG) indisponible apres {} ms - {}",
                    op, System.currentTimeMillis() - start, e.getMessage());
            throw new TertiaryUnavailableException("Base SAF (BDCRG) momentanement indisponible", e);
        } catch (DataAccessException e) {
            log.error("[AGRI] {} : erreur d'acces aux donnees apres {} ms - {}",
                    op, System.currentTimeMillis() - start, e.getMessage());
            throw e;
        }
    }

    private static long nullSafe(Long value) {
        return value != null ? value : 0L;
    }

    private static <T> T first(List<T> list) {
        return (list == null || list.isEmpty()) ? null : list.get(0);
    }

    // ============================================================
    //  RowMappers
    // ============================================================

    private static final RowMapper<AgriAgencyDto> AGENCY_MAPPER = (rs, n) -> new AgriAgencyDto(
            str(rs, "COD_EMPRESA"),
            str(rs, "COD_AGENCIA"),
            str(rs, "DES_AGENCIA"));

    private static final RowMapper<AgriCreditDto> CREDIT_MAPPER = (rs, n) -> {
        AgriCreditDto dto = new AgriCreditDto();
        dto.setCodEmpresa(str(rs, "COD_EMPRESA"));
        dto.setCodAgencia(str(rs, "COD_AGENCIA"));
        dto.setNumCredito(lng(rs, "NUM_CREDITO"));
        dto.setCodCliente(str(rs, "COD_CLIENTE"));
        dto.setNomCliente(str(rs, "NOM_CLIENTE"));
        dto.setIndPersona(str(rs, "IND_PERSONA"));
        dto.setTipCredito(intg(rs, "TIP_CREDITO"));
        dto.setDesTipCredito(str(rs, "DES_TIP_CREDITO"));
        dto.setCodActividad(str(rs, "COD_ACTIVIDAD"));
        dto.setMonCredito(dec(rs, "MON_CREDITO"));
        dto.setMonSaldo(dec(rs, "MON_SALDO"));
        dto.setFecApertura(dt(rs, "FEC_APERTURA"));
        dto.setFecVencimiento(dt(rs, "FEC_VENCIMIENTO"));
        dto.setIndEstado(str(rs, "IND_ESTADO"));
        dto.setCantHectareas(dec(rs, "CANT_HECTAREAS"));
        dto.setCodPlanInversion(intg(rs, "COD_PLAN_INVERSION"));
        dto.setNomPlan(str(rs, "NOM_PLAN"));
        dto.setCodGrupoSol(str(rs, "COD_GRUPO_SOL"));
        dto.setDesGrupoSol(str(rs, "DES_GRUPO_SOL"));
        dto.setCodAsociacion(str(rs, "COD_ASOCIACION"));
        dto.setDesAsociacion(str(rs, "DES_ASOCIACION"));
        return dto;
    };

    private static final RowMapper<FarmerDto> FARMER_MAPPER = (rs, n) -> {
        FarmerDto dto = new FarmerDto();
        dto.setCodEmpresa(str(rs, "COD_EMPRESA"));
        dto.setCodCliente(str(rs, "COD_CLIENTE"));
        dto.setNomCliente(str(rs, "NOM_CLIENTE"));
        dto.setIndPersona(str(rs, "IND_PERSONA"));
        dto.setTelPrincipal(str(rs, "TEL_PRINCIPAL"));
        dto.setFecIngreso(dt(rs, "FEC_INGRESO"));
        dto.setCodAgencia(str(rs, "COD_AGENCIA"));
        dto.setDesAgencia(str(rs, "DES_AGENCIA"));
        dto.setDesActividad(str(rs, "DES_ACTIVIDAD"));
        dto.setDesSector(str(rs, "DES_SECTOR"));
        dto.setNbCredits(lng(rs, "NB_CREDITS"));
        dto.setTotalAmount(dec(rs, "TOTAL_AMOUNT"));

        String razonSocial = str(rs, "RAZON_SOCIAL");
        if (razonSocial != null) {
            dto.setLegalDetails(new FarmerLegalDto(
                    razonSocial, str(rs, "NOM_COMERCIAL"), str(rs, "CLASE_SOCIEDAD")));
        }
        String primerNombre = str(rs, "PRIMER_NOMBRE");
        if (primerNombre != null) {
            dto.setPhysicalDetails(new FarmerPhysicalDto(
                    primerNombre, str(rs, "PRIMER_APELLIDO"), str(rs, "IND_SEXO"),
                    str(rs, "NACIONALIDAD"), str(rs, "LUGAR_NACIMIENTO"), str(rs, "DES_PROFESION")));
        }
        return dto;
    };

    private static final RowMapper<CooperativeDto> COOPERATIVE_MAPPER = (rs, n) -> new CooperativeDto(
            str(rs, "COD_GRUPO"),
            str(rs, "DES_GRUPO"),
            str(rs, "ACTIVIDAD_GRUPO"),
            lng(rs, "MEMBER_COUNT"),
            lng(rs, "CREDIT_COUNT"),
            dec(rs, "TOTAL_AMOUNT"));

    private static final RowMapper<CooperativeMemberDto> MEMBER_MAPPER = (rs, n) -> {
        CooperativeMemberDto dto = new CooperativeMemberDto();
        dto.setCodCliente(str(rs, "COD_CLIENTE"));
        dto.setNomCliente(str(rs, "NOM_CLIENTE"));
        dto.setIndPersona(str(rs, "IND_PERSONA"));
        dto.setIndGrado(str(rs, "IND_GRADO"));
        dto.setFecRegistro(dt(rs, "FEC_REGISTRO"));
        return dto;
    };

    // --- extracteurs null-safe -----------------------------------

    private static String str(ResultSet rs, String col) throws SQLException {
        String v = rs.getString(col);
        return v != null ? v.trim() : null;
    }

    private static BigDecimal dec(ResultSet rs, String col) throws SQLException {
        return rs.getBigDecimal(col);
    }

    private static LocalDate dt(ResultSet rs, String col) throws SQLException {
        java.sql.Date d = rs.getDate(col);
        return d != null ? d.toLocalDate() : null;
    }

    private static Integer intg(ResultSet rs, String col) throws SQLException {
        Object o = rs.getObject(col);
        return (o instanceof Number num) ? num.intValue() : null;
    }

    private static long lng(ResultSet rs, String col) throws SQLException {
        return rs.getLong(col);
    }
}
