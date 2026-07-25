package io.digiservices.ebanking.repository;

import io.digiservices.clients.reg.RegAdresseDto;
import io.digiservices.clients.reg.RegCompteDto;
import io.digiservices.clients.reg.RegEncoursDto;
import io.digiservices.clients.reg.RegEngagementDto;
import io.digiservices.clients.reg.RegPersonneMoraleDto;
import io.digiservices.clients.reg.RegPersonnePhysiqueDto;
import io.digiservices.clients.reg.RegPieceDto;
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
import java.util.List;
import java.util.function.Supplier;

/**
 * Acces lecture seule au perimetre reglementaire (declaration BCRG) de SAF2000.
 *
 * <p><b>Source de donnees :</b> datasource {@code primary} (BDCRG PROD, {@code 10.220.220.8}).
 * La declaration a la banque centrale porte sur les donnees de PRODUCTION (vrais clients,
 * vrais engagements). C'est aussi le reseau joignable par le VPN actuel (le dev/tertiary
 * {@code 10.110.15.2} ne l'est plus).</p>
 */
@Repository
@Slf4j
public class RegulatoryRepository {

    private final NamedParameterJdbcTemplate primary;

    public RegulatoryRepository(@Qualifier("jdbcTemplate") JdbcTemplate jdbcTemplate) {
        this.primary = new NamedParameterJdbcTemplate(jdbcTemplate);
    }

    // ============================================================
    //  Personnes physiques (CL_CLIENTES + CL_PERSONAS_FISICAS)
    // ============================================================

    private static final String PP_SELECT = """
            SELECT c.COD_EMPRESA, c.COD_CLIENTE, c.NOM_CLIENTE, c.IND_PERSONA,
                   c.IND_RELACION, c.TEL_PRINCIPAL, c.FEC_INGRESO,
                   c.COD_AGENCIA, ag.DES_AGENCIA,
                   pf.PRIMER_NOMBRE, pf.SEGUNDO_NOMBRE, pf.PRIMER_APELLIDO, pf.SEGUNDO_APELLIDO,
                   pf.IND_SEXO, pf.EST_CIVIL, pf.NACIONALIDAD, pf.LUGAR_NACIMIENTO,
                   pf.COD_PROFESION, prof.DES_PROFESION,
                   pf.COD_ACTIVIDAD, act.DES_ACTIVIDAD, pf.COD_SECTOR
            FROM CL.CL_CLIENTES c
            INNER JOIN CL.CL_PERSONAS_FISICAS pf
                ON c.COD_EMPRESA = pf.COD_EMPRESA AND c.COD_CLIENTE = pf.COD_CLIENTE
            LEFT JOIN CL.CL_CAT_PROFESIONES prof
                ON pf.COD_EMPRESA = prof.COD_EMPRESA AND pf.COD_PROFESION = prof.COD_PROFESION
            LEFT JOIN CL.CL_ACTIVIDAD_ECONOMICA act
                ON pf.COD_EMPRESA = act.COD_EMPRESA AND pf.COD_ACTIVIDAD = act.COD_ACTIVIDAD
            LEFT JOIN CF.CF_AGENCIAS ag
                ON c.COD_EMPRESA = ag.COD_EMPRESA AND c.COD_AGENCIA = ag.COD_AGENCIA
            WHERE c.IND_PERSONA = 'F'
            """;

    private static final String SQL_COUNT_PP =
            "SELECT COUNT(*) FROM CL.CL_CLIENTES c WHERE c.IND_PERSONA = 'F'";

    private static final String SQL_FIND_PP = PP_SELECT + """
            ORDER BY c.COD_CLIENTE
            OFFSET :offset ROWS FETCH NEXT :size ROWS ONLY
            """;

    private static final String SQL_FIND_PP_BY_ID = PP_SELECT + " AND c.COD_CLIENTE = :codCliente";

    // ============================================================
    //  Personnes morales (CL_CLIENTES + CL_PERSONAS_JURIDICAS)
    // ============================================================

    private static final String PM_SELECT = """
            SELECT c.COD_EMPRESA, c.COD_CLIENTE, c.NOM_CLIENTE, c.IND_PERSONA,
                   c.IND_RELACION, c.TEL_PRINCIPAL, c.FEC_INGRESO,
                   c.COD_AGENCIA, ag.DES_AGENCIA,
                   pj.RAZON_SOCIAL, pj.NOM_COMERCIAL, pj.CLASE_SOCIEDAD,
                   pj.COD_ACTIVIDAD, act.DES_ACTIVIDAD, pj.COD_SECTOR
            FROM CL.CL_CLIENTES c
            INNER JOIN CL.CL_PERSONAS_JURIDICAS pj
                ON c.COD_EMPRESA = pj.COD_EMPRESA AND c.COD_CLIENTE = pj.COD_CLIENTE
            LEFT JOIN CL.CL_ACTIVIDAD_ECONOMICA act
                ON pj.COD_EMPRESA = act.COD_EMPRESA AND pj.COD_ACTIVIDAD = act.COD_ACTIVIDAD
            LEFT JOIN CF.CF_AGENCIAS ag
                ON c.COD_EMPRESA = ag.COD_EMPRESA AND c.COD_AGENCIA = ag.COD_AGENCIA
            WHERE c.IND_PERSONA IN ('J', 'M')
            """;

    private static final String SQL_COUNT_PM =
            "SELECT COUNT(*) FROM CL.CL_CLIENTES c WHERE c.IND_PERSONA IN ('J', 'M')";

    private static final String SQL_FIND_PM = PM_SELECT + """
            ORDER BY c.COD_CLIENTE
            OFFSET :offset ROWS FETCH NEXT :size ROWS ONLY
            """;

    private static final String SQL_FIND_PM_BY_ID = PM_SELECT + " AND c.COD_CLIENTE = :codCliente";

    // ============================================================
    //  Sous-listes (comptes, pieces) par client
    // ============================================================

    private static final String SQL_FIND_COMPTES = """
            SELECT ct.NUM_CUENTA, ct.COD_MONEDA, ct.IND_DEFECTO
            FROM CL.CL_CTAS_CLIENTE ct
            WHERE ct.COD_CLIENTE = :codCliente
            """;

    private static final String SQL_FIND_PIECES = """
            SELECT id.COD_TIPO_ID, id.NUM_ID, id.FEC_VENCIM
            FROM CL.CL_ID_CLIENTES id
            WHERE id.COD_CLIENTE = :codCliente
            """;

    private static final String SQL_FIND_ADRESSES = """
            SELECT dc.TIP_DIRECCION, dc.DET_DIRECCION, dc.COD_PAIS,
                   dc.COD_PROVINCIA, dc.COD_CANTON, dc.COD_DISTRITO
            FROM CL.CL_DIR_CLIENTES dc
            WHERE dc.COD_CLIENTE = :codCliente
            """;

    // ============================================================
    //  Engagements (PR_CREDITOS)
    // ============================================================

    private static final String ENG_SELECT = """
            SELECT cr.COD_EMPRESA, cr.COD_AGENCIA, cr.NUM_CREDITO, cr.COD_CLIENTE,
                   c.NOM_CLIENTE, c.IND_PERSONA,
                   cr.TIP_CREDITO, cr.COD_MONEDA, cr.MON_CREDITO, cr.MON_SALDO, cr.MON_CUOTA,
                   cr.CANT_CUOTAS, cr.TASA_INTERES, cr.IND_ESTADO, cr.COD_ACTIVIDAD,
                   cr.FEC_CALIFICACION, cr.FEC_APERTURA, cr.FEC_PRIMER_DESEMBOLSO, cr.FEC_VENCIMIENTO
            FROM PR.PR_CREDITOS cr
            INNER JOIN CL.CL_CLIENTES c
                ON cr.COD_EMPRESA = c.COD_EMPRESA AND cr.COD_CLIENTE = c.COD_CLIENTE
            """;

    private static final String SQL_COUNT_ENG = "SELECT COUNT(*) FROM PR.PR_CREDITOS cr";

    private static final String SQL_FIND_ENG = ENG_SELECT + """
            ORDER BY cr.FEC_APERTURA DESC, cr.NUM_CREDITO DESC
            OFFSET :offset ROWS FETCH NEXT :size ROWS ONLY
            """;

    private static final String SQL_FIND_ENG_BY_ID = ENG_SELECT + " WHERE cr.NUM_CREDITO = :numCredito";

    // ============================================================
    //  Encours d'engagements (PR_CREDITOS + PR_PLAN_PAGOS) a une periode
    // ============================================================

    private static final String PP_AGG =
            "       (SELECT COUNT(*) FROM PR.PR_PLAN_PAGOS pp WHERE pp.COD_EMPRESA = cr.COD_EMPRESA\n" +
            "          AND pp.COD_AGENCIA = cr.COD_AGENCIA AND pp.NUM_CREDITO = cr.NUM_CREDITO\n" +
            "          AND pp.NUM_CUOTA <> 0 AND pp.FEC_CANCELACION IS NOT NULL) AS NB_PAYEES,\n" +
            "       (SELECT COUNT(*) FROM PR.PR_PLAN_PAGOS pp WHERE pp.COD_EMPRESA = cr.COD_EMPRESA\n" +
            "          AND pp.COD_AGENCIA = cr.COD_AGENCIA AND pp.NUM_CREDITO = cr.NUM_CREDITO\n" +
            "          AND pp.NUM_CUOTA <> 0 AND pp.FEC_CANCELACION IS NULL AND pp.FEC_CUOTA < :periodEnd) AS NB_IMPAYEES,\n" +
            "       (SELECT COUNT(*) FROM PR.PR_PLAN_PAGOS pp WHERE pp.COD_EMPRESA = cr.COD_EMPRESA\n" +
            "          AND pp.COD_AGENCIA = cr.COD_AGENCIA AND pp.NUM_CREDITO = cr.NUM_CREDITO\n" +
            "          AND pp.NUM_CUOTA <> 0 AND pp.FEC_CUOTA >= :periodEnd) AS NB_RESTANTES,\n" +
            "       (SELECT SUM(pp.SAL_PRINCIPAL) FROM PR.PR_PLAN_PAGOS pp WHERE pp.COD_EMPRESA = cr.COD_EMPRESA\n" +
            "          AND pp.COD_AGENCIA = cr.COD_AGENCIA AND pp.NUM_CREDITO = cr.NUM_CREDITO\n" +
            "          AND pp.NUM_CUOTA <> 0 AND pp.FEC_CANCELACION IS NULL AND pp.FEC_CUOTA < :periodEnd) AS MNT_CAP_IMP\n";

    private static final String SQL_COUNT_ENCOURS =
            "SELECT COUNT(*) FROM PR.PR_CREDITOS cr WHERE cr.MON_SALDO > 0";

    private static final String SQL_FIND_ENCOURS = """
            SELECT cr.COD_AGENCIA, cr.NUM_CREDITO, cr.COD_CLIENTE, c.NOM_CLIENTE, cr.COD_MONEDA,
                   cr.MON_CREDITO, cr.MON_SALDO, cr.MON_CUOTA, cr.CANT_CUOTAS, cr.IND_ESTADO, cr.FEC_VENCIMIENTO,
            """ + PP_AGG + """
            FROM PR.PR_CREDITOS cr
            INNER JOIN CL.CL_CLIENTES c
                ON cr.COD_EMPRESA = c.COD_EMPRESA AND cr.COD_CLIENTE = c.COD_CLIENTE
            WHERE cr.MON_SALDO > 0
            ORDER BY cr.NUM_CREDITO
            OFFSET :offset ROWS FETCH NEXT :size ROWS ONLY
            """;

    // ============================================================
    //  API publique du repository
    // ============================================================

    public long countPersonnesPhysiques() {
        return execute("countPersonnesPhysiques",
                () -> nullSafe(primary.queryForObject(SQL_COUNT_PP, new MapSqlParameterSource(), Long.class)));
    }

    public List<RegPersonnePhysiqueDto> findPersonnesPhysiques(int offset, int size) {
        MapSqlParameterSource p = new MapSqlParameterSource().addValue("offset", offset).addValue("size", size);
        return execute("findPersonnesPhysiques", () -> primary.query(SQL_FIND_PP, p, PP_MAPPER));
    }

    public RegPersonnePhysiqueDto findPersonnePhysiqueById(String codCliente) {
        MapSqlParameterSource p = new MapSqlParameterSource("codCliente", codCliente);
        RegPersonnePhysiqueDto dto = execute("findPersonnePhysiqueById",
                () -> first(primary.query(SQL_FIND_PP_BY_ID, p, PP_MAPPER)));
        if (dto != null) {
            dto.setComptes(findComptes(codCliente));
            dto.setPieces(findPieces(codCliente));
            dto.setAdresses(findAdresses(codCliente));
        }
        return dto;
    }

    public long countPersonnesMorales() {
        return execute("countPersonnesMorales",
                () -> nullSafe(primary.queryForObject(SQL_COUNT_PM, new MapSqlParameterSource(), Long.class)));
    }

    public List<RegPersonneMoraleDto> findPersonnesMorales(int offset, int size) {
        MapSqlParameterSource p = new MapSqlParameterSource().addValue("offset", offset).addValue("size", size);
        return execute("findPersonnesMorales", () -> primary.query(SQL_FIND_PM, p, PM_MAPPER));
    }

    public RegPersonneMoraleDto findPersonneMoraleById(String codCliente) {
        MapSqlParameterSource p = new MapSqlParameterSource("codCliente", codCliente);
        RegPersonneMoraleDto dto = execute("findPersonneMoraleById",
                () -> first(primary.query(SQL_FIND_PM_BY_ID, p, PM_MAPPER)));
        if (dto != null) {
            dto.setComptes(findComptes(codCliente));
            dto.setPieces(findPieces(codCliente));
            dto.setAdresses(findAdresses(codCliente));
        }
        return dto;
    }

    // ---- Engagements ----

    public long countEngagements() {
        return execute("countEngagements",
                () -> nullSafe(primary.queryForObject(SQL_COUNT_ENG, new MapSqlParameterSource(), Long.class)));
    }

    public List<RegEngagementDto> findEngagements(int offset, int size) {
        MapSqlParameterSource p = new MapSqlParameterSource().addValue("offset", offset).addValue("size", size);
        return execute("findEngagements", () -> primary.query(SQL_FIND_ENG, p, ENG_MAPPER));
    }

    public RegEngagementDto findEngagementById(Long numCredito) {
        MapSqlParameterSource p = new MapSqlParameterSource("numCredito", numCredito);
        return execute("findEngagementById", () -> first(primary.query(SQL_FIND_ENG_BY_ID, p, ENG_MAPPER)));
    }

    // ---- Encours (a une periode d'arrete) ----

    public long countEncours() {
        return execute("countEncours",
                () -> nullSafe(primary.queryForObject(SQL_COUNT_ENCOURS, new MapSqlParameterSource(), Long.class)));
    }

    public List<RegEncoursDto> findEncours(LocalDate periodEnd, int offset, int size) {
        MapSqlParameterSource p = new MapSqlParameterSource()
                .addValue("periodEnd", java.sql.Date.valueOf(periodEnd))
                .addValue("offset", offset)
                .addValue("size", size);
        return execute("findEncours", () -> primary.query(SQL_FIND_ENCOURS, p, ENCOURS_MAPPER));
    }

    private List<RegAdresseDto> findAdresses(String codCliente) {
        MapSqlParameterSource p = new MapSqlParameterSource("codCliente", codCliente);
        return execute("findAdresses", () -> primary.query(SQL_FIND_ADRESSES, p, ADRESSE_MAPPER));
    }

    private List<RegCompteDto> findComptes(String codCliente) {
        MapSqlParameterSource p = new MapSqlParameterSource("codCliente", codCliente);
        return execute("findComptes", () -> primary.query(SQL_FIND_COMPTES, p, COMPTE_MAPPER));
    }

    private List<RegPieceDto> findPieces(String codCliente) {
        MapSqlParameterSource p = new MapSqlParameterSource("codCliente", codCliente);
        return execute("findPieces", () -> primary.query(SQL_FIND_PIECES, p, PIECE_MAPPER));
    }

    // ============================================================
    //  Protection tertiary + helpers
    // ============================================================

    private <R> R execute(String op, Supplier<R> action) {
        long start = System.currentTimeMillis();
        try {
            R result = action.get();
            log.debug("[REG] {} OK en {} ms", op, System.currentTimeMillis() - start);
            return result;
        } catch (DataAccessResourceFailureException | QueryTimeoutException e) {
            log.error("[REG] {} : datasource primary (BDCRG PROD) indisponible - {}", op, e.getMessage());
            throw new TertiaryUnavailableException("Base SAF (BDCRG) momentanement indisponible", e);
        } catch (DataAccessException e) {
            log.error("[REG] {} : erreur d'acces aux donnees - {}", op, e.getMessage());
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

    private static final RowMapper<RegPersonnePhysiqueDto> PP_MAPPER = (rs, n) -> {
        RegPersonnePhysiqueDto dto = new RegPersonnePhysiqueDto();
        dto.setCodEmpresa(str(rs, "COD_EMPRESA"));
        dto.setCodCliente(str(rs, "COD_CLIENTE"));
        dto.setNomCliente(str(rs, "NOM_CLIENTE"));
        dto.setIndPersona(str(rs, "IND_PERSONA"));
        dto.setIndRelacion(str(rs, "IND_RELACION"));
        dto.setTelPrincipal(str(rs, "TEL_PRINCIPAL"));
        dto.setFecIngreso(dt(rs, "FEC_INGRESO"));
        dto.setCodAgencia(str(rs, "COD_AGENCIA"));
        dto.setDesAgencia(str(rs, "DES_AGENCIA"));
        dto.setPrimerNombre(str(rs, "PRIMER_NOMBRE"));
        dto.setSegundoNombre(str(rs, "SEGUNDO_NOMBRE"));
        dto.setPrimerApellido(str(rs, "PRIMER_APELLIDO"));
        dto.setSegundoApellido(str(rs, "SEGUNDO_APELLIDO"));
        dto.setIndSexo(str(rs, "IND_SEXO"));
        dto.setEstCivil(str(rs, "EST_CIVIL"));
        dto.setNacionalidad(str(rs, "NACIONALIDAD"));
        dto.setLugarNacimiento(str(rs, "LUGAR_NACIMIENTO"));
        dto.setCodProfesion(str(rs, "COD_PROFESION"));
        dto.setDesProfesion(str(rs, "DES_PROFESION"));
        dto.setCodActividad(str(rs, "COD_ACTIVIDAD"));
        dto.setDesActividad(str(rs, "DES_ACTIVIDAD"));
        dto.setCodSector(str(rs, "COD_SECTOR"));
        return dto;
    };

    private static final RowMapper<RegPersonneMoraleDto> PM_MAPPER = (rs, n) -> {
        RegPersonneMoraleDto dto = new RegPersonneMoraleDto();
        dto.setCodEmpresa(str(rs, "COD_EMPRESA"));
        dto.setCodCliente(str(rs, "COD_CLIENTE"));
        dto.setNomCliente(str(rs, "NOM_CLIENTE"));
        dto.setIndPersona(str(rs, "IND_PERSONA"));
        dto.setIndRelacion(str(rs, "IND_RELACION"));
        dto.setTelPrincipal(str(rs, "TEL_PRINCIPAL"));
        dto.setFecIngreso(dt(rs, "FEC_INGRESO"));
        dto.setCodAgencia(str(rs, "COD_AGENCIA"));
        dto.setDesAgencia(str(rs, "DES_AGENCIA"));
        dto.setRazonSocial(str(rs, "RAZON_SOCIAL"));
        dto.setNomComercial(str(rs, "NOM_COMERCIAL"));
        dto.setClaseSociedad(str(rs, "CLASE_SOCIEDAD"));
        dto.setCodActividad(str(rs, "COD_ACTIVIDAD"));
        dto.setDesActividad(str(rs, "DES_ACTIVIDAD"));
        dto.setCodSector(str(rs, "COD_SECTOR"));
        return dto;
    };

    private static final RowMapper<RegCompteDto> COMPTE_MAPPER = (rs, n) -> new RegCompteDto(
            null, str(rs, "NUM_CUENTA"), str(rs, "COD_MONEDA"), str(rs, "IND_DEFECTO"));

    private static final RowMapper<RegPieceDto> PIECE_MAPPER = (rs, n) -> new RegPieceDto(
            str(rs, "COD_TIPO_ID"), str(rs, "NUM_ID"), dt(rs, "FEC_VENCIM"));

    private static final RowMapper<RegAdresseDto> ADRESSE_MAPPER = (rs, n) -> new RegAdresseDto(
            str(rs, "TIP_DIRECCION"), str(rs, "DET_DIRECCION"), str(rs, "COD_PAIS"),
            str(rs, "COD_PROVINCIA"), str(rs, "COD_CANTON"), str(rs, "COD_DISTRITO"));

    private static final RowMapper<RegEngagementDto> ENG_MAPPER = (rs, n) -> {
        RegEngagementDto d = new RegEngagementDto();
        d.setCodEmpresa(str(rs, "COD_EMPRESA"));
        d.setCodAgencia(str(rs, "COD_AGENCIA"));
        d.setNumCredito(lng(rs, "NUM_CREDITO"));
        d.setCodCliente(str(rs, "COD_CLIENTE"));
        d.setNomCliente(str(rs, "NOM_CLIENTE"));
        d.setIndPersona(str(rs, "IND_PERSONA"));
        d.setTipCredito(lngObj(rs, "TIP_CREDITO"));
        d.setCodMoneda(str(rs, "COD_MONEDA"));
        d.setMonCredito(dec(rs, "MON_CREDITO"));
        d.setMonSaldo(dec(rs, "MON_SALDO"));
        d.setMonCuota(dec(rs, "MON_CUOTA"));
        d.setCantCuotas(lngObj(rs, "CANT_CUOTAS"));
        d.setTasaInteres(dec(rs, "TASA_INTERES"));
        d.setIndEstado(str(rs, "IND_ESTADO"));
        d.setCodActividad(str(rs, "COD_ACTIVIDAD"));
        d.setFecCalificacion(dt(rs, "FEC_CALIFICACION"));
        d.setFecApertura(dt(rs, "FEC_APERTURA"));
        d.setFecPrimerDesembolso(dt(rs, "FEC_PRIMER_DESEMBOLSO"));
        d.setFecVencimiento(dt(rs, "FEC_VENCIMIENTO"));
        return d;
    };

    private static final RowMapper<RegEncoursDto> ENCOURS_MAPPER = (rs, n) -> {
        RegEncoursDto d = new RegEncoursDto();
        d.setCodAgencia(str(rs, "COD_AGENCIA"));
        d.setNumCredito(lng(rs, "NUM_CREDITO"));
        d.setCodCliente(str(rs, "COD_CLIENTE"));
        d.setNomCliente(str(rs, "NOM_CLIENTE"));
        d.setCodMoneda(str(rs, "COD_MONEDA"));
        d.setMonCredito(dec(rs, "MON_CREDITO"));
        d.setMonSaldo(dec(rs, "MON_SALDO"));
        d.setMonCuota(dec(rs, "MON_CUOTA"));
        d.setCantCuotas(lngObj(rs, "CANT_CUOTAS"));
        d.setIndEstado(str(rs, "IND_ESTADO"));
        d.setFecVencimiento(dt(rs, "FEC_VENCIMIENTO"));
        d.setNbEchPayees(lng(rs, "NB_PAYEES"));
        d.setNbEchImpayees(lng(rs, "NB_IMPAYEES"));
        d.setNbEchRestantes(lng(rs, "NB_RESTANTES"));
        d.setMntCapImpaye(dec(rs, "MNT_CAP_IMP"));
        return d;
    };

    private static String str(ResultSet rs, String col) throws SQLException {
        String v = rs.getString(col);
        return v != null ? v.trim() : null;
    }

    private static LocalDate dt(ResultSet rs, String col) throws SQLException {
        java.sql.Date d = rs.getDate(col);
        return d != null ? d.toLocalDate() : null;
    }

    private static BigDecimal dec(ResultSet rs, String col) throws SQLException {
        return rs.getBigDecimal(col);
    }

    private static long lng(ResultSet rs, String col) throws SQLException {
        return rs.getLong(col);
    }

    private static Long lngObj(ResultSet rs, String col) throws SQLException {
        Object o = rs.getObject(col);
        return (o instanceof Number num) ? num.longValue() : null;
    }
}
