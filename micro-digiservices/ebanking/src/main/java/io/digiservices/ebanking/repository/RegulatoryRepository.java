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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

    // v1.6 : Mobile obligatoire cote BCRG -> repli sur les telephones secondaires SAF
    private static final String TEL_COALESCE =
            "COALESCE(NULLIF(LTRIM(RTRIM(c.TEL_PRINCIPAL)), ''), " +
            "NULLIF(LTRIM(RTRIM(c.TEL_SECUNDARIO)), ''), " +
            "NULLIF(LTRIM(RTRIM(c.TEL_OTRO)), '')) AS TEL_PRINCIPAL";

    private static final String PP_SELECT = """
            SELECT c.COD_EMPRESA, c.COD_CLIENTE, c.NOM_CLIENTE, c.IND_PERSONA,
                   c.IND_RELACION, """ + TEL_COALESCE + """
            , c.FEC_INGRESO,
                   c.COD_AGENCIA, ag.DES_AGENCIA,
                   pf.PRIMER_NOMBRE, pf.SEGUNDO_NOMBRE, pf.PRIMER_APELLIDO, pf.SEGUNDO_APELLIDO,
                   pf.IND_SEXO, pf.EST_CIVIL, pf.NACIONALIDAD, pf.LUGAR_NACIMIENTO,
                   pf.COD_PROFESION, prof.DES_PROFESION,
                   pf.COD_ACTIVIDAD, act.DES_ACTIVIDAD, pf.COD_SECTOR,
                   pf.NUM_HIJOS, pf.TENENCIA_VIVIENDA, pf.NOM_CONYUGUE,
                   da.FECH_NACIMIENTO, da.SALARIO, da.CANT_DEPENDIENTES,
                   da.LUGAR_TRABAJO, da.PUESTO
            FROM CL.CL_CLIENTES c
            INNER JOIN CL.CL_PERSONAS_FISICAS pf
                ON c.COD_EMPRESA = pf.COD_EMPRESA AND c.COD_CLIENTE = pf.COD_CLIENTE
            LEFT JOIN CL.CL_DATOS_ASOCIADO da
                ON c.COD_EMPRESA = da.COD_EMPRESA AND c.COD_CLIENTE = da.COD_CLIENTE
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

    // Lot keyset (extraction filtree "restantes" cote bcrgservice) : base sans sous-listes
    private static final String SQL_FIND_PP_LOT = PP_SELECT + """
             AND c.COD_CLIENTE > :afterId
            ORDER BY c.COD_CLIENTE
            OFFSET 0 ROWS FETCH NEXT :limit ROWS ONLY
            """;

    private static final String SQL_FIND_PP_BY_IDS = PP_SELECT + " AND c.COD_CLIENTE IN (:ids) ORDER BY c.COD_CLIENTE";

    // ============================================================
    //  Personnes morales (CL_CLIENTES + CL_PERSONAS_JURIDICAS)
    // ============================================================

    private static final String PM_SELECT = """
            SELECT c.COD_EMPRESA, c.COD_CLIENTE, c.NOM_CLIENTE, c.IND_PERSONA,
                   c.IND_RELACION, """ + TEL_COALESCE + """
            , c.FEC_INGRESO,
                   c.COD_AGENCIA, ag.DES_AGENCIA,
                   pj.RAZON_SOCIAL, pj.NOM_COMERCIAL, pj.CLASE_SOCIEDAD, cs.DES_SOCIEDAD,
                   pj.COD_ACTIVIDAD, act.DES_ACTIVIDAD, pj.COD_SECTOR
            FROM CL.CL_CLIENTES c
            INNER JOIN CL.CL_PERSONAS_JURIDICAS pj
                ON c.COD_EMPRESA = pj.COD_EMPRESA AND c.COD_CLIENTE = pj.COD_CLIENTE
            LEFT JOIN CL.CL_CLASES_SOCIEDAD cs
                ON pj.COD_EMPRESA = cs.COD_EMPRESA AND pj.CLASE_SOCIEDAD = cs.CLASE_SOCIEDAD
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

    private static final String SQL_FIND_PM_LOT = PM_SELECT + """
             AND c.COD_CLIENTE > :afterId
            ORDER BY c.COD_CLIENTE
            OFFSET 0 ROWS FETCH NEXT :limit ROWS ONLY
            """;

    private static final String SQL_FIND_PM_BY_IDS = PM_SELECT + " AND c.COD_CLIENTE IN (:ids) ORDER BY c.COD_CLIENTE";

    // ============================================================
    //  Sous-listes (comptes, pieces) par client
    // ============================================================

    private static final String SQL_FIND_COMPTES = """
            SELECT ce.NUM_CUENTA, ce.COD_MONEDA, ce.COD_PRODUCTO, ce.IND_ESTADO
            FROM CC.CC_CUENTA_EFECTIVO ce
            WHERE ce.COD_CLIENTE = :codCliente
            """;

    private static final String SQL_FIND_PIECES = """
            SELECT id.COD_TIPO_ID, ti.DES_TIPO_ID, id.NUM_ID, id.FEC_VENCIM
            FROM CL.CL_ID_CLIENTES id
            LEFT JOIN CL.CL_TIPOS_ID ti
                ON id.COD_EMPRESA = ti.COD_EMPRESA AND id.COD_TIPO_ID = ti.COD_TIPO_ID
            WHERE id.COD_CLIENTE = :codCliente
            """;

    // PM V2 : jointure des referentiels geographiques PA.PA_* pour les libelles
    // (VilleSiegeSocial / CommuneAdresse) — les codes seuls etaient inexploitables
    private static final String ADRESSE_GEO_JOINS = """
            LEFT JOIN PA.PA_PROVINCIAS pr
                ON pr.COD_PAIS = dc.COD_PAIS AND pr.COD_PROVINCIA = dc.COD_PROVINCIA
            LEFT JOIN PA.PA_CANTONES ca
                ON ca.COD_PAIS = dc.COD_PAIS AND ca.COD_PROVINCIA = dc.COD_PROVINCIA
                AND ca.COD_CANTON = dc.COD_CANTON
            LEFT JOIN PA.PA_DISTRITOS di
                ON di.COD_PAIS = dc.COD_PAIS AND di.COD_PROVINCIA = dc.COD_PROVINCIA
                AND di.COD_CANTON = dc.COD_CANTON AND di.COD_DISTRITO = dc.COD_DISTRITO
            """;

    private static final String SQL_FIND_ADRESSES = """
            SELECT dc.TIP_DIRECCION, dc.DET_DIRECCION, dc.COD_PAIS,
                   dc.COD_PROVINCIA, dc.COD_CANTON, dc.COD_DISTRITO,
                   dc.COD_POSTAL, dc.APDO_POSTAL,
                   pr.DES_PROVINCIA, ca.DES_CANTON, di.DES_DISTRITO
            FROM CL.CL_DIR_CLIENTES dc
            """ + ADRESSE_GEO_JOINS + """
            WHERE dc.COD_CLIENTE = :codCliente
            """;

    // Variantes groupees (enrichissement d'une page entiere en 3 requetes, pas de N+1)

    private static final String SQL_FIND_COMPTES_BULK = """
            SELECT ce.COD_CLIENTE, ce.NUM_CUENTA, ce.COD_MONEDA, ce.COD_PRODUCTO, ce.IND_ESTADO
            FROM CC.CC_CUENTA_EFECTIVO ce
            WHERE ce.COD_CLIENTE IN (:codClientes)
            """;

    private static final String SQL_FIND_PIECES_BULK = """
            SELECT id.COD_CLIENTE, id.COD_TIPO_ID, ti.DES_TIPO_ID, id.NUM_ID, id.FEC_VENCIM
            FROM CL.CL_ID_CLIENTES id
            LEFT JOIN CL.CL_TIPOS_ID ti
                ON id.COD_EMPRESA = ti.COD_EMPRESA AND id.COD_TIPO_ID = ti.COD_TIPO_ID
            WHERE id.COD_CLIENTE IN (:codClientes)
            """;

    private static final String SQL_FIND_ADRESSES_BULK = """
            SELECT dc.COD_CLIENTE, dc.TIP_DIRECCION, dc.DET_DIRECCION, dc.COD_PAIS,
                   dc.COD_PROVINCIA, dc.COD_CANTON, dc.COD_DISTRITO,
                   dc.COD_POSTAL, dc.APDO_POSTAL,
                   pr.DES_PROVINCIA, ca.DES_CANTON, di.DES_DISTRITO
            FROM CL.CL_DIR_CLIENTES dc
            """ + ADRESSE_GEO_JOINS + """
            WHERE dc.COD_CLIENTE IN (:codClientes)
            """;

    // ============================================================
    //  Engagements (PR_CREDITOS)
    // ============================================================

    // v1.3 : montant decaisse, date de solde et derivations du plan de paiement
    // (premiere echeance, total des interets prevus) pour le contrat M2 BCRG.
    // v1.6 : ecart moyen entre echeances (PeriodRemb) ; les credits jamais decaisses
    // (FEC_PRIMER_DESEMBOLSO null, pas de date de mise en place) sont exclus de M2 —
    // 22 rejets dateMEP le 2026-08-20 ; un engagement non mis en place n'est pas declarable.
    private static final String ENG_SELECT = """
            SELECT cr.COD_EMPRESA, cr.COD_AGENCIA, ag.DES_AGENCIA, cr.NUM_CREDITO, cr.COD_CLIENTE,
                   c.NOM_CLIENTE, c.IND_PERSONA,
                   cr.TIP_CREDITO, tc.DES_TIP_CREDITO, cr.COD_MONEDA, cr.MON_CREDITO, cr.MON_SALDO, cr.MON_CUOTA,
                   cr.CANT_CUOTAS, cr.TASA_INTERES, cr.IND_ESTADO, cr.COD_ACTIVIDAD,
                   cr.FEC_CALIFICACION, cr.FEC_APERTURA, cr.FEC_PRIMER_DESEMBOLSO, cr.FEC_VENCIMIENTO,
                   cr.MON_DESEMBOLSADO, cr.FEC_CANCELACION,
                   (SELECT MIN(pp.FEC_CUOTA) FROM PR.PR_PLAN_PAGOS pp
                     WHERE pp.COD_EMPRESA = cr.COD_EMPRESA AND pp.COD_AGENCIA = cr.COD_AGENCIA
                       AND pp.NUM_CREDITO = cr.NUM_CREDITO AND pp.NUM_CUOTA <> 0) AS FEC_PREM_ECH,
                   (SELECT SUM(pp.MON_INT) FROM PR.PR_PLAN_PAGOS pp
                     WHERE pp.COD_EMPRESA = cr.COD_EMPRESA AND pp.COD_AGENCIA = cr.COD_AGENCIA
                       AND pp.NUM_CREDITO = cr.NUM_CREDITO AND pp.NUM_CUOTA <> 0) AS MNT_INT_TOTAL,
                   (SELECT DATEDIFF(day, MIN(pp.FEC_CUOTA), MAX(pp.FEC_CUOTA)) / NULLIF(COUNT(*) - 1, 0)
                     FROM PR.PR_PLAN_PAGOS pp
                     WHERE pp.COD_EMPRESA = cr.COD_EMPRESA AND pp.COD_AGENCIA = cr.COD_AGENCIA
                       AND pp.NUM_CREDITO = cr.NUM_CREDITO AND pp.NUM_CUOTA <> 0) AS JOURS_ENTRE_ECH,
                   (SELECT COUNT(*) FROM PR.PR_PLAN_PAGOS pp
                     WHERE pp.COD_EMPRESA = cr.COD_EMPRESA AND pp.COD_AGENCIA = cr.COD_AGENCIA
                       AND pp.NUM_CREDITO = cr.NUM_CREDITO AND pp.NUM_CUOTA <> 0) AS NB_ECH_PLAN
            FROM PR.PR_CREDITOS cr
            INNER JOIN CL.CL_CLIENTES c
                ON cr.COD_EMPRESA = c.COD_EMPRESA AND cr.COD_CLIENTE = c.COD_CLIENTE
            LEFT JOIN PR.PR_TIPO_CREDITO tc
                ON cr.COD_EMPRESA = tc.COD_EMPRESA AND cr.TIP_CREDITO = tc.TIP_CREDITO
            LEFT JOIN CF.CF_AGENCIAS ag
                ON cr.COD_EMPRESA = ag.COD_EMPRESA AND cr.COD_AGENCIA = ag.COD_AGENCIA
            WHERE cr.FEC_PRIMER_DESEMBOLSO IS NOT NULL
            """;

    private static final String SQL_COUNT_ENG =
            "SELECT COUNT(*) FROM PR.PR_CREDITOS cr WHERE cr.FEC_PRIMER_DESEMBOLSO IS NOT NULL";

    private static final String SQL_FIND_ENG = ENG_SELECT + """
            ORDER BY cr.FEC_APERTURA DESC, cr.NUM_CREDITO DESC
            OFFSET :offset ROWS FETCH NEXT :size ROWS ONLY
            """;

    // v1.6 : la cle SAF d'un credit est (COD_EMPRESA, COD_AGENCIA, NUM_CREDITO) —
    // NUM_CREDITO seul n'est pas unique inter-agences ; detail et keyset composites.
    private static final String SQL_FIND_ENG_BY_ID = ENG_SELECT +
            " AND cr.COD_AGENCIA = :codAgencia AND cr.NUM_CREDITO = :numCredito";

    private static final String SQL_FIND_ENG_LOT = ENG_SELECT + """
             AND (cr.COD_AGENCIA > :afterAgence
                  OR (cr.COD_AGENCIA = :afterAgence AND cr.NUM_CREDITO > :afterId))
            ORDER BY cr.COD_AGENCIA, cr.NUM_CREDITO
            OFFSET 0 ROWS FETCH NEXT :limit ROWS ONLY
            """;

    // v1.11 : engagements d'un lot de beneficiaires (extraction "restantes" inversee :
    // on part des personnes declarees au lieu de balayer PR_CREDITOS entier — le
    // parcours complet provoquait des 504 au-dela des pages eligibles)
    private static final String SQL_FIND_ENG_PAR_BENEFICIAIRES = ENG_SELECT + """
             AND cr.COD_CLIENTE IN (:codClientes)
            ORDER BY cr.COD_CLIENTE, cr.COD_AGENCIA, cr.NUM_CREDITO
            """;

    // ============================================================
    //  Encours d'engagements (PR_CREDITOS + PR_PLAN_PAGOS) a une periode
    // ============================================================

    // v1.3 : derivations d'arrete supplementaires pour le contrat M4 BCRG
    private static final String ENCOURS_AGG_V13 =
            "       (SELECT MAX(pp.FEC_CUOTA) FROM PR.PR_PLAN_PAGOS pp WHERE pp.COD_EMPRESA = cr.COD_EMPRESA\n" +
            "          AND pp.COD_AGENCIA = cr.COD_AGENCIA AND pp.NUM_CREDITO = cr.NUM_CREDITO\n" +
            "          AND pp.NUM_CUOTA <> 0 AND pp.FEC_CUOTA < :periodEnd) AS DAT_DERN_ECH,\n" +
            "       (SELECT TOP 1 pp.MON_CUOTA FROM PR.PR_PLAN_PAGOS pp WHERE pp.COD_EMPRESA = cr.COD_EMPRESA\n" +
            "          AND pp.COD_AGENCIA = cr.COD_AGENCIA AND pp.NUM_CREDITO = cr.NUM_CREDITO\n" +
            "          AND pp.NUM_CUOTA <> 0 AND pp.FEC_CUOTA < :periodEnd ORDER BY pp.FEC_CUOTA DESC) AS MNT_DERN_ECH,\n" +
            "       (SELECT MAX(pp.FEC_CANCELACION) FROM PR.PR_PLAN_PAGOS pp WHERE pp.COD_EMPRESA = cr.COD_EMPRESA\n" +
            "          AND pp.COD_AGENCIA = cr.COD_AGENCIA AND pp.NUM_CREDITO = cr.NUM_CREDITO\n" +
            "          AND pp.NUM_CUOTA <> 0 AND pp.FEC_CANCELACION IS NOT NULL AND pp.FEC_CANCELACION < :periodEnd) AS DAT_DERN_PAI,\n" +
            "       (SELECT TOP 1 pp.MON_CUOTA FROM PR.PR_PLAN_PAGOS pp WHERE pp.COD_EMPRESA = cr.COD_EMPRESA\n" +
            "          AND pp.COD_AGENCIA = cr.COD_AGENCIA AND pp.NUM_CREDITO = cr.NUM_CREDITO\n" +
            "          AND pp.NUM_CUOTA <> 0 AND pp.FEC_CANCELACION IS NOT NULL AND pp.FEC_CANCELACION < :periodEnd\n" +
            "          ORDER BY pp.FEC_CANCELACION DESC) AS MNT_DERN_PAI,\n" +
            "       (SELECT SUM(pp.SAL_INT) FROM PR.PR_PLAN_PAGOS pp WHERE pp.COD_EMPRESA = cr.COD_EMPRESA\n" +
            "          AND pp.COD_AGENCIA = cr.COD_AGENCIA AND pp.NUM_CREDITO = cr.NUM_CREDITO\n" +
            "          AND pp.NUM_CUOTA <> 0 AND pp.FEC_CANCELACION IS NULL AND pp.FEC_CUOTA < :periodEnd) AS MNT_INT_IMP,\n" +
            "       (SELECT MIN(pp.FEC_CUOTA) FROM PR.PR_PLAN_PAGOS pp WHERE pp.COD_EMPRESA = cr.COD_EMPRESA\n" +
            "          AND pp.COD_AGENCIA = cr.COD_AGENCIA AND pp.NUM_CREDITO = cr.NUM_CREDITO\n" +
            "          AND pp.NUM_CUOTA <> 0 AND pp.FEC_CANCELACION IS NULL AND pp.FEC_CUOTA < :periodEnd) AS DAT_PREM_IMP,\n";

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

    // v1.3 : un encours ne peut pas porter sur un engagement cloture (regle BCRG) ;
    // il couvre les credits a solde > 0 OU a montant non entierement decaisse (hors bilan).
    private static final String ENCOURS_WHERE = """
            WHERE cr.IND_ESTADO NOT IN ('C', 'T', 'X')
              AND (cr.MON_SALDO > 0 OR COALESCE(cr.MON_CREDITO, 0) > COALESCE(cr.MON_DESEMBOLSADO, 0))
            """;

    private static final String SQL_COUNT_ENCOURS =
            "SELECT COUNT(*) FROM PR.PR_CREDITOS cr " + ENCOURS_WHERE;

    // v1.12 : meme projection que SQL_FIND_ENCOURS mais sur une liste de credits cible
    private static final String SQL_FIND_ENCOURS_PAR_CREDITS = """
            SELECT cr.COD_AGENCIA, cr.NUM_CREDITO, cr.COD_CLIENTE, c.NOM_CLIENTE, cr.COD_MONEDA,
                   cr.MON_CREDITO, cr.MON_SALDO, cr.MON_CUOTA, cr.CANT_CUOTAS, cr.IND_ESTADO, cr.FEC_VENCIMIENTO,
                   cr.MON_DESEMBOLSADO,
            """ + ENCOURS_AGG_V13 + PP_AGG + """
            FROM PR.PR_CREDITOS cr
            INNER JOIN CL.CL_CLIENTES c
                ON cr.COD_EMPRESA = c.COD_EMPRESA AND cr.COD_CLIENTE = c.COD_CLIENTE
            """ + ENCOURS_WHERE + """
              AND cr.NUM_CREDITO IN (:credits)
            ORDER BY cr.NUM_CREDITO
            """;

    private static final String SQL_FIND_ENCOURS = """
            SELECT cr.COD_AGENCIA, cr.NUM_CREDITO, cr.COD_CLIENTE, c.NOM_CLIENTE, cr.COD_MONEDA,
                   cr.MON_CREDITO, cr.MON_SALDO, cr.MON_CUOTA, cr.CANT_CUOTAS, cr.IND_ESTADO, cr.FEC_VENCIMIENTO,
                   cr.MON_DESEMBOLSADO,
            """ + ENCOURS_AGG_V13 + PP_AGG + """
            FROM PR.PR_CREDITOS cr
            INNER JOIN CL.CL_CLIENTES c
                ON cr.COD_EMPRESA = c.COD_EMPRESA AND cr.COD_CLIENTE = c.COD_CLIENTE
            """ + ENCOURS_WHERE + """
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
        List<RegPersonnePhysiqueDto> content =
                execute("findPersonnesPhysiques", () -> primary.query(SQL_FIND_PP, p, PP_MAPPER));
        List<String> ids = content.stream().map(RegPersonnePhysiqueDto::getCodCliente).toList();
        Map<String, List<RegCompteDto>> comptes = findComptesByClients(ids);
        Map<String, List<RegPieceDto>> pieces = findPiecesByClients(ids);
        Map<String, List<RegAdresseDto>> adresses = findAdressesByClients(ids);
        content.forEach(d -> {
            d.setComptes(comptes.getOrDefault(d.getCodCliente(), List.of()));
            d.setPieces(pieces.getOrDefault(d.getCodCliente(), List.of()));
            d.setAdresses(adresses.getOrDefault(d.getCodCliente(), List.of()));
        });
        return content;
    }

    /** Lot keyset (base sans sous-listes) pour l'extraction filtree "restantes". */
    public List<RegPersonnePhysiqueDto> findPersonnesPhysiquesLot(String afterId, int limit) {
        MapSqlParameterSource p = new MapSqlParameterSource()
                .addValue("afterId", afterId == null ? "" : afterId)
                .addValue("limit", limit);
        return execute("findPersonnesPhysiquesLot", () -> primary.query(SQL_FIND_PP_LOT, p, PP_MAPPER));
    }

    /** Detail enrichi (comptes, pieces, adresses) d'un ensemble de clients PP. */
    public List<RegPersonnePhysiqueDto> findPersonnesPhysiquesByIds(List<String> ids) {
        if (ids == null || ids.isEmpty()) return List.of();
        MapSqlParameterSource p = new MapSqlParameterSource("ids", ids);
        List<RegPersonnePhysiqueDto> content =
                execute("findPersonnesPhysiquesByIds", () -> primary.query(SQL_FIND_PP_BY_IDS, p, PP_MAPPER));
        enrichirPP(content);
        return content;
    }

    private void enrichirPP(List<RegPersonnePhysiqueDto> content) {
        List<String> ids = content.stream().map(RegPersonnePhysiqueDto::getCodCliente).toList();
        if (ids.isEmpty()) return;
        Map<String, List<RegCompteDto>> comptes = findComptesByClients(ids);
        Map<String, List<RegPieceDto>> pieces = findPiecesByClients(ids);
        Map<String, List<RegAdresseDto>> adresses = findAdressesByClients(ids);
        content.forEach(d -> {
            d.setComptes(comptes.getOrDefault(d.getCodCliente(), List.of()));
            d.setPieces(pieces.getOrDefault(d.getCodCliente(), List.of()));
            d.setAdresses(adresses.getOrDefault(d.getCodCliente(), List.of()));
        });
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
        List<RegPersonneMoraleDto> content =
                execute("findPersonnesMorales", () -> primary.query(SQL_FIND_PM, p, PM_MAPPER));
        List<String> ids = content.stream().map(RegPersonneMoraleDto::getCodCliente).toList();
        Map<String, List<RegCompteDto>> comptes = findComptesByClients(ids);
        Map<String, List<RegPieceDto>> pieces = findPiecesByClients(ids);
        Map<String, List<RegAdresseDto>> adresses = findAdressesByClients(ids);
        content.forEach(d -> {
            d.setComptes(comptes.getOrDefault(d.getCodCliente(), List.of()));
            d.setPieces(pieces.getOrDefault(d.getCodCliente(), List.of()));
            d.setAdresses(adresses.getOrDefault(d.getCodCliente(), List.of()));
        });
        return content;
    }

    /** Lot keyset (base sans sous-listes) pour l'extraction filtree "restantes". */
    public List<RegPersonneMoraleDto> findPersonnesMoralesLot(String afterId, int limit) {
        MapSqlParameterSource p = new MapSqlParameterSource()
                .addValue("afterId", afterId == null ? "" : afterId)
                .addValue("limit", limit);
        return execute("findPersonnesMoralesLot", () -> primary.query(SQL_FIND_PM_LOT, p, PM_MAPPER));
    }

    /** Detail enrichi (comptes, pieces, adresses) d'un ensemble de clients PM. */
    public List<RegPersonneMoraleDto> findPersonnesMoralesByIds(List<String> ids) {
        if (ids == null || ids.isEmpty()) return List.of();
        MapSqlParameterSource p = new MapSqlParameterSource("ids", ids);
        List<RegPersonneMoraleDto> content =
                execute("findPersonnesMoralesByIds", () -> primary.query(SQL_FIND_PM_BY_IDS, p, PM_MAPPER));
        List<String> foundIds = content.stream().map(RegPersonneMoraleDto::getCodCliente).toList();
        if (!foundIds.isEmpty()) {
            Map<String, List<RegCompteDto>> comptes = findComptesByClients(foundIds);
            Map<String, List<RegPieceDto>> pieces = findPiecesByClients(foundIds);
            Map<String, List<RegAdresseDto>> adresses = findAdressesByClients(foundIds);
            content.forEach(d -> {
                d.setComptes(comptes.getOrDefault(d.getCodCliente(), List.of()));
                d.setPieces(pieces.getOrDefault(d.getCodCliente(), List.of()));
                d.setAdresses(adresses.getOrDefault(d.getCodCliente(), List.of()));
            });
        }
        return content;
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

    /** Lot keyset pour l'extraction filtree "restantes" — curseur composite (agence, numero). */
    public List<RegEngagementDto> findEngagementsLot(String afterAgence, Long afterId, int limit) {
        MapSqlParameterSource p = new MapSqlParameterSource()
                .addValue("afterAgence", afterAgence == null ? "" : afterAgence)
                .addValue("afterId", afterId == null ? 0L : afterId)
                .addValue("limit", limit);
        return execute("findEngagementsLot", () -> primary.query(SQL_FIND_ENG_LOT, p, ENG_MAPPER));
    }

    /** Engagements d'un lot de clients beneficiaires (v1.11, ordre stable par client). */
    public List<RegEngagementDto> findEngagementsParBeneficiaires(List<String> codClientes) {
        if (codClientes == null || codClientes.isEmpty()) return List.of();
        MapSqlParameterSource p = new MapSqlParameterSource("codClientes", codClientes);
        return execute("findEngagementsParBeneficiaires",
                () -> primary.query(SQL_FIND_ENG_PAR_BENEFICIAIRES, p, ENG_MAPPER));
    }

    public RegEngagementDto findEngagementById(String codAgencia, Long numCredito) {
        MapSqlParameterSource p = new MapSqlParameterSource()
                .addValue("codAgencia", codAgencia)
                .addValue("numCredito", numCredito);
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

    /**
     * v1.12 : encours d'un ensemble cible de credits (pagination sur le sous-ensemble
     * declare cote bcrgservice). Le filtre composite agence+credit est refait cote
     * appelant : ici on selectionne par NUM_CREDITO (surensemble en cas de doublon
     * inter-agences), regles d'eligibilite ENCOURS_WHERE inchangees.
     */
    public List<RegEncoursDto> findEncoursByCredits(LocalDate periodEnd, List<Long> credits) {
        if (credits == null || credits.isEmpty()) return List.of();
        MapSqlParameterSource p = new MapSqlParameterSource()
                .addValue("periodEnd", java.sql.Date.valueOf(periodEnd))
                .addValue("credits", credits);
        return execute("findEncoursByCredits",
                () -> primary.query(SQL_FIND_ENCOURS_PAR_CREDITS, p, ENCOURS_MAPPER));
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

    private Map<String, List<RegCompteDto>> findComptesByClients(List<String> codClientes) {
        if (codClientes.isEmpty()) return Map.of();
        MapSqlParameterSource p = new MapSqlParameterSource("codClientes", codClientes);
        return execute("findComptesByClients", () -> {
            Map<String, List<RegCompteDto>> map = new HashMap<>();
            primary.query(SQL_FIND_COMPTES_BULK, p, rs -> {
                map.computeIfAbsent(str(rs, "COD_CLIENTE"), k -> new ArrayList<>())
                        .add(new RegCompteDto(str(rs, "NUM_CUENTA"), str(rs, "COD_MONEDA"),
                                str(rs, "COD_PRODUCTO"), str(rs, "IND_ESTADO")));
            });
            return map;
        });
    }

    private Map<String, List<RegPieceDto>> findPiecesByClients(List<String> codClientes) {
        if (codClientes.isEmpty()) return Map.of();
        MapSqlParameterSource p = new MapSqlParameterSource("codClientes", codClientes);
        return execute("findPiecesByClients", () -> {
            Map<String, List<RegPieceDto>> map = new HashMap<>();
            primary.query(SQL_FIND_PIECES_BULK, p, rs -> {
                map.computeIfAbsent(str(rs, "COD_CLIENTE"), k -> new ArrayList<>())
                        .add(new RegPieceDto(str(rs, "COD_TIPO_ID"), str(rs, "DES_TIPO_ID"),
                                str(rs, "NUM_ID"), dt(rs, "FEC_VENCIM")));
            });
            return map;
        });
    }

    private Map<String, List<RegAdresseDto>> findAdressesByClients(List<String> codClientes) {
        if (codClientes.isEmpty()) return Map.of();
        MapSqlParameterSource p = new MapSqlParameterSource("codClientes", codClientes);
        return execute("findAdressesByClients", () -> {
            Map<String, List<RegAdresseDto>> map = new HashMap<>();
            primary.query(SQL_FIND_ADRESSES_BULK, p, rs -> {
                map.computeIfAbsent(str(rs, "COD_CLIENTE"), k -> new ArrayList<>())
                        .add(new RegAdresseDto(str(rs, "TIP_DIRECCION"), str(rs, "DET_DIRECCION"),
                                str(rs, "COD_PAIS"), str(rs, "COD_PROVINCIA"),
                                str(rs, "COD_CANTON"), str(rs, "COD_DISTRITO"),
                                str(rs, "COD_POSTAL"), str(rs, "APDO_POSTAL"),
                                str(rs, "DES_PROVINCIA"), str(rs, "DES_CANTON"), str(rs, "DES_DISTRITO")));
            });
            return map;
        });
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
        dto.setNumHijos(intObj(rs, "NUM_HIJOS"));
        dto.setTenenciaVivienda(str(rs, "TENENCIA_VIVIENDA"));
        dto.setNomConyugue(str(rs, "NOM_CONYUGUE"));
        dto.setFechNacimiento(dt(rs, "FECH_NACIMIENTO"));
        dto.setSalario(dec(rs, "SALARIO"));
        dto.setCantDependientes(intObj(rs, "CANT_DEPENDIENTES"));
        dto.setLugarTrabajo(str(rs, "LUGAR_TRABAJO"));
        dto.setPuesto(str(rs, "PUESTO"));
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
        dto.setDesSociedad(str(rs, "DES_SOCIEDAD"));
        dto.setCodActividad(str(rs, "COD_ACTIVIDAD"));
        dto.setDesActividad(str(rs, "DES_ACTIVIDAD"));
        dto.setCodSector(str(rs, "COD_SECTOR"));
        return dto;
    };

    private static final RowMapper<RegCompteDto> COMPTE_MAPPER = (rs, n) -> new RegCompteDto(
            str(rs, "NUM_CUENTA"), str(rs, "COD_MONEDA"), str(rs, "COD_PRODUCTO"), str(rs, "IND_ESTADO"));

    private static final RowMapper<RegPieceDto> PIECE_MAPPER = (rs, n) -> new RegPieceDto(
            str(rs, "COD_TIPO_ID"), str(rs, "DES_TIPO_ID"), str(rs, "NUM_ID"), dt(rs, "FEC_VENCIM"));

    private static final RowMapper<RegAdresseDto> ADRESSE_MAPPER = (rs, n) -> new RegAdresseDto(
            str(rs, "TIP_DIRECCION"), str(rs, "DET_DIRECCION"), str(rs, "COD_PAIS"),
            str(rs, "COD_PROVINCIA"), str(rs, "COD_CANTON"), str(rs, "COD_DISTRITO"),
            str(rs, "COD_POSTAL"), str(rs, "APDO_POSTAL"),
            str(rs, "DES_PROVINCIA"), str(rs, "DES_CANTON"), str(rs, "DES_DISTRITO"));

    private static final RowMapper<RegEngagementDto> ENG_MAPPER = (rs, n) -> {
        RegEngagementDto d = new RegEngagementDto();
        d.setCodEmpresa(str(rs, "COD_EMPRESA"));
        d.setCodAgencia(str(rs, "COD_AGENCIA"));
        d.setDesAgencia(str(rs, "DES_AGENCIA"));
        d.setNumCredito(lng(rs, "NUM_CREDITO"));
        d.setCodCliente(str(rs, "COD_CLIENTE"));
        d.setNomCliente(str(rs, "NOM_CLIENTE"));
        d.setIndPersona(str(rs, "IND_PERSONA"));
        d.setTipCredito(lngObj(rs, "TIP_CREDITO"));
        d.setDesTipCredito(str(rs, "DES_TIP_CREDITO"));
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
        d.setMonDesembolsado(dec(rs, "MON_DESEMBOLSADO"));
        d.setFecCancelacionCredito(dt(rs, "FEC_CANCELACION"));
        d.setFecPremiereEcheance(dt(rs, "FEC_PREM_ECH"));
        d.setMntInteretsTotal(dec(rs, "MNT_INT_TOTAL"));
        d.setJoursEntreEcheances(intObj(rs, "JOURS_ENTRE_ECH"));
        d.setNbEchPlan(intObj(rs, "NB_ECH_PLAN"));
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
        d.setMonDesembolsado(dec(rs, "MON_DESEMBOLSADO"));
        d.setDatDerniereEcheance(dt(rs, "DAT_DERN_ECH"));
        d.setMntDerniereEcheance(dec(rs, "MNT_DERN_ECH"));
        d.setDatDernierPaiement(dt(rs, "DAT_DERN_PAI"));
        d.setMntDernierPaiement(dec(rs, "MNT_DERN_PAI"));
        d.setMntInteretsImpayes(dec(rs, "MNT_INT_IMP"));
        d.setFecPlusAncienneImpayee(dt(rs, "DAT_PREM_IMP"));
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

    private static Integer intObj(ResultSet rs, String col) throws SQLException {
        Object o = rs.getObject(col);
        return (o instanceof Number num) ? num.intValue() : null;
    }
}
