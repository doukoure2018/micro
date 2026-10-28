package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.exception.TertiaryUnavailableException;
import io.digiservices.clients.agri.AgriAgencyDto;
import io.digiservices.clients.agri.AgriCreditDto;
import io.digiservices.clients.agri.AgriSortieDto;
import io.digiservices.clients.agri.PhotoMensuelleDto;
import io.digiservices.clients.agri.CooperativeDto;
import io.digiservices.clients.agri.CooperativeMemberDto;
import io.digiservices.clients.agri.FarmerDto;
import io.digiservices.clients.agri.FarmerLegalDto;
import io.digiservices.clients.agri.FarmerPhysicalDto;
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
 * Acces lecture seule au perimetre agricole de SAF2000.
 *
 * <p><b>Regle absolue :</b> ce repository utilise UNIQUEMENT la datasource
 * {@code tertiaryJdbcTemplate}. Aucune autre.</p>
 *
 * <p><b>Cette datasource est pointee sur la SAUVEGARDE</b> (10.9.0.168, compte DIGI_LECTURE,
 * restauree chaque matin) depuis l'aiguillage du 21/10/2026, et non sur la production : la
 * mention « BDCRG PROD » qui figurait ici etait vraie avant cette date et ne l'est plus.
 * L'API partenaire sert donc des donnees de la veille — c'est ce que dit l'en-tete
 * {@code X-Donnees-SAF-Au} — et elle continue de repondre quand la production est fermee
 * (cloture du soir, compte desactive).</p>
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
        // NamedParameterJdbcTemplate construit a partir du JdbcTemplate tertiary (sauvegarde)
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
                   cr.TIP_CREDITO, tc.DES_TIP_CREDITO, cr.COD_ACTIVIDAD, cr.COD_SUBSUBACTIVIDAD,
                   cr.MON_CREDITO, cr.MON_SALDO, cr.FEC_APERTURA, cr.FEC_VENCIMIENTO,
                   cr.IND_ESTADO, cr.CANT_HECTAREAS,
                   cr.COD_PLAN_INVERSION, pinv.NOM_PLAN,
                   cr.COD_GRUPO_SOL, g_sol.DES_GRUPO AS DES_GRUPO_SOL,
                   cr.COD_ASOCIACION, g_aso.DES_GRUPO AS DES_ASOCIACION,
                   cr.COD_EJECUTIVO
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

    /**
     * Enrichissement d'une page de credits (KUMY, lot 1) : retards, prochaine echeance, echeances
     * du mois et gestionnaire. Les agregats sont calcules par OUTER APPLY sur les seules lignes de
     * la page, jamais sur l'echeancier entier : cinq cents lignes = cinq cents lectures indexees.
     * Memes regles que les alertes portefeuille et l'etat TT1 (PortefeuilleRepository) : une
     * echeance est impayee quand FEC_CANCELACION est nulle et sa date passee ; le regle du mois est
     * l'attendu moins le reste du.
     */
    private static final String ENRICHI_PREFIXE = """
            SELECT p.*, ug.NOM_USUARIO AS NOM_EJECUTIVO,
                   imp.PREM_IMP, imp.CAP_IMP, imp.INT_IMP,
                   pe.PROCH_ECH, pe.PROCH_MON,
                   m.ATTENDU_MOIS, m.RESTE_MOIS,
                   fi.DES_FILIERE
            FROM (
            """;

    /**
     * Libelle de la filiere (sous-sous-activite SAF). Le meme code se repete sous plusieurs
     * sous-activites avec le MEME libelle (AGRUME figure sous 201, 203 et 204) : une jointure
     * ordinaire multiplierait les lignes de la page. TOP 1 rend le libelle sans dupliquer.
     * PR_CREDITOS ne portant pas COD_SUBACTIV, le niveau intermediaire reste indeterminable et
     * n'est donc pas expose.
     */
    private static final String FILIERE_LIBELLE = """
            OUTER APPLY (
                SELECT TOP 1 ss.DES_SUBSUBACTIV AS DES_FILIERE
                FROM CL.CL_SUBSUBACT_ECONOMICA ss
                WHERE ss.COD_EMPRESA = p.COD_EMPRESA
                  AND ss.COD_ACTIVIDAD = p.COD_ACTIVIDAD
                  AND ss.COD_SUBSUBACTIV = p.COD_SUBSUBACTIVIDAD
            ) fi
            """;
    private static final String ENRICHI_SUFFIXE_DEBUT = """
            ) p
            LEFT JOIN SG.SG_USUARIOS ug
                   ON ug.COD_EMPRESA = p.COD_EMPRESA AND ug.COD_AGENCIA = p.COD_AGENCIA AND ug.COD_USUARIO = p.COD_EJECUTIVO
            OUTER APPLY (
                SELECT MIN(pp.FEC_CUOTA) AS PREM_IMP, SUM(pp.SAL_PRINCIPAL) AS CAP_IMP, SUM(pp.SAL_INT) AS INT_IMP
                FROM PR.PR_PLAN_PAGOS pp
                WHERE pp.COD_EMPRESA = p.COD_EMPRESA AND pp.COD_AGENCIA = p.COD_AGENCIA AND pp.NUM_CREDITO = p.NUM_CREDITO
                  AND pp.NUM_CUOTA <> 0 AND pp.FEC_CANCELACION IS NULL AND pp.FEC_CUOTA < :aujourdhui
            ) imp
            OUTER APPLY (
                SELECT TOP 1 pp.FEC_CUOTA AS PROCH_ECH, pp.MON_CUOTA AS PROCH_MON
                FROM PR.PR_PLAN_PAGOS pp
                WHERE pp.COD_EMPRESA = p.COD_EMPRESA AND pp.COD_AGENCIA = p.COD_AGENCIA AND pp.NUM_CREDITO = p.NUM_CREDITO
                  AND pp.NUM_CUOTA <> 0 AND pp.FEC_CANCELACION IS NULL AND pp.FEC_CUOTA >= :aujourdhui
                ORDER BY pp.FEC_CUOTA
            ) pe
            OUTER APPLY (
                SELECT SUM(pp.MON_CUOTA) AS ATTENDU_MOIS,
                       SUM(COALESCE(pp.SAL_PRINCIPAL,0) + COALESCE(pp.SAL_INT,0)) AS RESTE_MOIS
                FROM PR.PR_PLAN_PAGOS pp
                WHERE pp.COD_EMPRESA = p.COD_EMPRESA AND pp.COD_AGENCIA = p.COD_AGENCIA AND pp.NUM_CREDITO = p.NUM_CREDITO
                  AND pp.NUM_CUOTA <> 0 AND pp.FEC_CUOTA >= :debutMois AND pp.FEC_CUOTA < :finMois
            ) m
            """;

    private static final String ENRICHI_SUFFIXE_FIN = """
            ORDER BY p.FEC_APERTURA DESC, p.NUM_CREDITO DESC
            """;

    /**
     * Credits vivants : ni clos, ni transferes, ni annules, ni apures (I = radie ou passe en
     * perte, sorti du cycle : meme regle que CategorieCredit.APURE), et un solde a rembourser.
     */
    private static final String FILTRE_VIVANTS = " cr.IND_ESTADO NOT IN ('C','T','X','I') AND cr.MON_SALDO > 0 ";

    // Chaines bordees d'espaces et de retours a la ligne : un bloc de texte ne peut pas s'ouvrir
    // en milieu de ligne, et un fragment colle a un mot-cle a deja produit WHERECOALESCE(...
    private static final String FILTRES_NATIONAUX =
            " WHERE " + AGRICULTURAL_FILTER_CREDIT
            + "\n   AND (:tous = 1 OR " + FILTRE_VIVANTS + ")"
            + "\n   AND (:avecCodes = 0 OR cr.COD_AGENCIA IN (:codes)) \n";

    private static final String SQL_COUNT_PORTFOLIO_NATIONAL =
            "SELECT COUNT(*) FROM PR.PR_CREDITOS cr " + FILTRES_NATIONAUX;

    private static final String SQL_FIND_PORTFOLIO_NATIONAL = AGRI_CREDIT_SELECT + FILTRES_NATIONAUX
            + " ORDER BY cr.FEC_APERTURA DESC, cr.NUM_CREDITO DESC\n"
            + " OFFSET :offset ROWS FETCH NEXT :size ROWS ONLY\n";

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
        MapSqlParameterSource p = avecDates(new MapSqlParameterSource()
                .addValue("codAgencia", codAgencia)
                .addValue("offset", offset)
                .addValue("size", size));
        return execute("findAgencyPortfolio",
                () -> tertiary.query(enrichi(SQL_FIND_PORTFOLIO), p, CREDIT_MAPPER));
    }

    // ---- Portefeuille national (KUMY, lot 1) ----

    /**
     * Sorties du portefeuille (point 10) : les credits dont SAF date la cloture.
     *
     * <p><b>Perimetre assume :</b> SAF ne date QUE les cloturees (IND_ESTADO 'C'), et seulement
     * une partie — 56 151 datees contre 45 485 sans date au 28/10/2026. Les apures ('I', 5 694)
     * et les transferts ('T', 34) n'ont <b>jamais</b> de date de cloture. Une route bornee par
     * dates ne peut donc rendre que les cloturees datees : c'est exactement ce qu'il faut pour
     * « les sorties du mois », et ce que les autres etats ne permettent pas de produire. Les
     * apures restent visibles dans le portefeuille avec inclureClos=true.</p>
     */
    private static final String FILTRES_SORTIES =
            " WHERE " + AGRICULTURAL_FILTER_CREDIT
            + "\n   AND cr.FEC_CANCELACION IS NOT NULL"
            + "\n   AND cr.FEC_CANCELACION >= :debut AND cr.FEC_CANCELACION < :fin"
            + "\n   AND (:avecCodes = 0 OR cr.COD_AGENCIA IN (:codes)) \n";

    private static final String SQL_COUNT_SORTIES =
            "SELECT COUNT(*) FROM PR.PR_CREDITOS cr " + FILTRES_SORTIES;

    private static final String SORTIE_SELECT = """
            SELECT cr.COD_EMPRESA, cr.COD_AGENCIA, cr.NUM_CREDITO, cr.COD_CLIENTE,
                   c.NOM_CLIENTE, cr.TIP_CREDITO, tc.DES_TIP_CREDITO,
                   cr.COD_ACTIVIDAD, cr.COD_SUBSUBACTIVIDAD,
                   cr.MON_CREDITO, cr.MON_SALDO, cr.FEC_APERTURA, cr.FEC_VENCIMIENTO,
                   cr.FEC_CANCELACION, cr.IND_ESTADO, cr.COD_EJECUTIVO,
                   ug.NOM_USUARIO AS NOM_EJECUTIVO, fi.DES_FILIERE
            FROM PR.PR_CREDITOS cr
            INNER JOIN CL.CL_CLIENTES c
                ON cr.COD_EMPRESA = c.COD_EMPRESA AND cr.COD_CLIENTE = c.COD_CLIENTE
            LEFT JOIN PR.PR_TIPO_CREDITO tc
                ON cr.COD_EMPRESA = tc.COD_EMPRESA AND cr.TIP_CREDITO = tc.TIP_CREDITO
            LEFT JOIN SG.SG_USUARIOS ug
                ON ug.COD_EMPRESA = cr.COD_EMPRESA AND ug.COD_AGENCIA = cr.COD_AGENCIA
               AND ug.COD_USUARIO = cr.COD_EJECUTIVO
            OUTER APPLY (
                SELECT TOP 1 ss.DES_SUBSUBACTIV AS DES_FILIERE
                FROM CL.CL_SUBSUBACT_ECONOMICA ss
                WHERE ss.COD_EMPRESA = cr.COD_EMPRESA AND ss.COD_ACTIVIDAD = cr.COD_ACTIVIDAD
                  AND ss.COD_SUBSUBACTIV = cr.COD_SUBSUBACTIVIDAD
            ) fi
            """;

    private static final String SQL_FIND_SORTIES = SORTIE_SELECT + FILTRES_SORTIES
            + " ORDER BY cr.FEC_CANCELACION DESC, cr.NUM_CREDITO DESC\n"
            + " OFFSET :offset ROWS FETCH NEXT :size ROWS ONLY\n";

    /**
     * Referentiel des activites economiques (point 11) : activite, sous-activite, et
     * sous-sous-activite qui est la <b>filiere</b> (CEREALE RIZ, ARACHIDE, ELEVAGE BOVIN...).
     * Le meme code de filiere se repete sous plusieurs sous-activites avec le meme libelle ;
     * le dedoublonnage est fait a la mise en forme, pas ici, pour que l'arbre reste complet.
     */
    private static final String SQL_REFERENTIEL_ACTIVITES = """
            SELECT a.COD_ACTIVIDAD, a.DES_ACTIVIDAD,
                   sa.COD_SUBACTIV, sa.DES_SUBACTIV,
                   ss.COD_SUBSUBACTIV, ss.DES_SUBSUBACTIV
            FROM CL.CL_ACTIVIDAD_ECONOMICA a
            LEFT JOIN CL.CL_SUBACT_ECONOMICA sa
                ON sa.COD_EMPRESA = a.COD_EMPRESA AND sa.COD_ACTIVIDAD = a.COD_ACTIVIDAD
            LEFT JOIN CL.CL_SUBSUBACT_ECONOMICA ss
                ON ss.COD_EMPRESA = sa.COD_EMPRESA AND ss.COD_ACTIVIDAD = sa.COD_ACTIVIDAD
               AND ss.COD_SUBACTIV = sa.COD_SUBACTIV
            WHERE a.COD_EMPRESA = '00000'
            ORDER BY a.COD_ACTIVIDAD, sa.COD_SUBACTIV, ss.COD_SUBSUBACTIV
            """;

    // ==================== Photo mensuelle (KUMY, lot 3, point 6) ====================

    /**
     * Photo mensuelle du portefeuille agricole, par point de vente.
     *
     * <p>Une seule requete, parametree par la date d'observation {@code :fin} (exclusive) et le
     * debut du mois {@code :debut}. Elle sert les deux usages : la photo du mois en cours
     * (observation = demain, donc l'etat du jour) et la reconstitution d'un mois passe
     * (observation = premier jour du mois suivant).</p>
     *
     * <p><b>Ce qui se reconstitue et ce qui ne se reconstitue pas.</b> Les vivants, les retards,
     * la production et les sorties reposent sur des <i>dates reelles</i> (ouverture, echeance,
     * reglement, cloture) : ils sont exacts a toute date passee. L'encours, lui, n'existe dans
     * SAF que comme MON_SALDO <i>courant</i> : il n'est donc renseigne que pour la photo du jour.
     * Mesure du 28/10/2026 sur 5 181 credits vivants : le capital de l'echeancier donne 27,6 Md
     * contre 46,7 Md de MON_SALDO, soit -41 %, et seuls 2 842 credits ont un solde egal au
     * capital restant de leur echeancier. Approcher l'encours passe par l'echeancier aurait donc
     * publie un chiffre faux de quatre dixiemes.</p>
     */
    private static final String SQL_PHOTO_MENSUELLE = """
            WITH agri AS (
                SELECT cr.COD_EMPRESA, cr.COD_AGENCIA, cr.NUM_CREDITO, cr.MON_CREDITO, cr.MON_SALDO,
                       cr.FEC_APERTURA, cr.FEC_CANCELACION, cr.IND_ESTADO
                FROM PR.PR_CREDITOS cr
                WHERE """ + AGRICULTURAL_FILTER_CREDIT + """
            ),
            vivants AS (
                SELECT a.* FROM agri a
                WHERE a.FEC_APERTURA < :fin
                  AND ( a.FEC_CANCELACION >= :fin
                     OR (a.FEC_CANCELACION IS NULL AND a.IND_ESTADO NOT IN ('C','T','X','I')) )
            ),
            retard AS (
                SELECT v.COD_AGENCIA, v.NUM_CREDITO,
                       MIN(pp.FEC_CUOTA) AS PREM_IMP,
                       SUM(COALESCE(pp.MON_PRINCIPAL,0) + COALESCE(pp.MON_INT,0)) AS DU_IMPAYE
                FROM vivants v
                JOIN PR.PR_PLAN_PAGOS pp
                  ON pp.COD_EMPRESA = v.COD_EMPRESA AND pp.COD_AGENCIA = v.COD_AGENCIA
                 AND pp.NUM_CREDITO = v.NUM_CREDITO AND pp.NUM_CUOTA <> 0
                WHERE pp.FEC_CUOTA < :fin
                  AND (pp.FEC_CANCELACION IS NULL OR pp.FEC_CANCELACION >= :fin)
                GROUP BY v.COD_AGENCIA, v.NUM_CREDITO
            ),
            stock AS (
                SELECT v.COD_AGENCIA,
                       COUNT(*) AS NB_CREDITS,
                       SUM(v.MON_SALDO) AS ENCOURS,
                       SUM(CASE WHEN r.PREM_IMP <= :j30 THEN 1 ELSE 0 END) AS NB_PAR30,
                       SUM(CASE WHEN r.PREM_IMP <= :j30 THEN v.MON_SALDO ELSE 0 END) AS ENCOURS_PAR30,
                       SUM(CASE WHEN r.PREM_IMP <= :j90 THEN 1 ELSE 0 END) AS NB_PAR90,
                       SUM(CASE WHEN r.PREM_IMP <= :j90 THEN v.MON_SALDO ELSE 0 END) AS ENCOURS_PAR90,
                       SUM(COALESCE(r.DU_IMPAYE,0)) AS MONTANT_IMPAYE
                FROM vivants v
                LEFT JOIN retard r ON r.COD_AGENCIA = v.COD_AGENCIA AND r.NUM_CREDITO = v.NUM_CREDITO
                GROUP BY v.COD_AGENCIA
            ),
            flux AS (
                SELECT a.COD_AGENCIA,
                       SUM(CASE WHEN a.FEC_APERTURA >= :debut AND a.FEC_APERTURA < :fin THEN 1 ELSE 0 END) AS NB_PROD,
                       SUM(CASE WHEN a.FEC_APERTURA >= :debut AND a.FEC_APERTURA < :fin THEN a.MON_CREDITO ELSE 0 END) AS MON_PROD,
                       SUM(CASE WHEN a.FEC_CANCELACION >= :debut AND a.FEC_CANCELACION < :fin THEN 1 ELSE 0 END) AS NB_SORT,
                       SUM(CASE WHEN a.FEC_CANCELACION >= :debut AND a.FEC_CANCELACION < :fin THEN a.MON_CREDITO ELSE 0 END) AS MON_SORT,
                       SUM(CASE WHEN a.FEC_CANCELACION IS NULL AND a.IND_ESTADO IN ('C','T','I')
                                 AND a.FEC_APERTURA < :fin THEN 1 ELSE 0 END) AS NB_INDATABLES
                FROM agri a
                GROUP BY a.COD_AGENCIA
            )
            SELECT COALESCE(s.COD_AGENCIA, f.COD_AGENCIA) AS COD_AGENCIA,
                   s.NB_CREDITS, s.ENCOURS, s.NB_PAR30, s.ENCOURS_PAR30, s.NB_PAR90, s.ENCOURS_PAR90,
                   s.MONTANT_IMPAYE,
                   f.NB_PROD, f.MON_PROD, f.NB_SORT, f.MON_SORT, f.NB_INDATABLES
            FROM stock s
            FULL JOIN flux f ON f.COD_AGENCIA = s.COD_AGENCIA
            WHERE COALESCE(s.NB_CREDITS, 0) > 0 OR COALESCE(f.NB_PROD, 0) > 0 OR COALESCE(f.NB_SORT, 0) > 0
            ORDER BY COALESCE(s.COD_AGENCIA, f.COD_AGENCIA)
            """;

    /**
     * Photo d'un mois. {@code photoDuJour} vrai quand le mois demande est le mois courant :
     * l'observation est alors arretee a demain (donc l'etat du jour) et l'encours est renseigne ;
     * pour un mois passe, l'observation est le premier jour du mois suivant et l'encours reste nul.
     */
    public List<PhotoMensuelleDto> photoMensuelle(java.time.LocalDate mois, boolean photoDuJour) {
        java.time.LocalDate debut = mois.withDayOfMonth(1);
        java.time.LocalDate fin = photoDuJour
                ? java.time.LocalDate.now().plusDays(1)
                : debut.plusMonths(1);
        MapSqlParameterSource p = new MapSqlParameterSource()
                .addValue("debut", java.sql.Date.valueOf(debut))
                .addValue("fin", java.sql.Date.valueOf(fin))
                .addValue("j30", java.sql.Date.valueOf(fin.minusDays(30)))
                .addValue("j90", java.sql.Date.valueOf(fin.minusDays(90)));
        String source = photoDuJour ? "PHOTO" : "RECONSTITUTION";
        return execute("photoMensuelle", () -> tertiary.query(SQL_PHOTO_MENSUELLE, p, (rs, n) -> {
            PhotoMensuelleDto d = new PhotoMensuelleDto();
            d.setMois(debut);
            d.setCodAgencia(str(rs, "COD_AGENCIA"));
            d.setNbCredits(intg(rs, "NB_CREDITS"));
            // L'encours n'a de sens que pour la photo du jour : voir SQL_PHOTO_MENSUELLE.
            d.setEncours(photoDuJour ? dec(rs, "ENCOURS") : null);
            d.setNbPar30(intg(rs, "NB_PAR30"));
            d.setEncoursPar30(photoDuJour ? dec(rs, "ENCOURS_PAR30") : null);
            d.setNbPar90(intg(rs, "NB_PAR90"));
            d.setEncoursPar90(photoDuJour ? dec(rs, "ENCOURS_PAR90") : null);
            d.setMontantImpaye(dec(rs, "MONTANT_IMPAYE"));
            d.setNbProduction(intg(rs, "NB_PROD"));
            d.setMontantProduction(dec(rs, "MON_PROD"));
            d.setNbSorties(intg(rs, "NB_SORT"));
            d.setMontantSorties(dec(rs, "MON_SORT"));
            d.setNbClosSansDate(intg(rs, "NB_INDATABLES"));
            d.setSource(source);
            return d;
        }));
    }

    public long countSorties(java.util.Collection<String> codes, java.time.LocalDate debut, java.time.LocalDate fin) {
        return execute("countSorties",
                () -> nullSafe(tertiary.queryForObject(SQL_COUNT_SORTIES,
                        avecBornes(avecCodes(new MapSqlParameterSource(), codes), debut, fin), Long.class)));
    }

    public List<AgriSortieDto> findSorties(java.util.Collection<String> codes, java.time.LocalDate debut,
                                           java.time.LocalDate fin, int offset, int size) {
        MapSqlParameterSource p = avecBornes(avecCodes(new MapSqlParameterSource()
                .addValue("offset", offset).addValue("size", size), codes), debut, fin);
        return execute("findSorties", () -> tertiary.query(SQL_FIND_SORTIES, p, SORTIE_MAPPER));
    }

    /** Le referentiel a plat : une ligne par (activite, sous-activite, filiere). */
    public List<java.util.Map<String, Object>> findReferentielActivites() {
        return execute("findReferentielActivites",
                () -> tertiary.queryForList(SQL_REFERENTIEL_ACTIVITES, new MapSqlParameterSource()));
    }

    private static MapSqlParameterSource avecCodes(MapSqlParameterSource p, java.util.Collection<String> codes) {
        boolean presents = codes != null && !codes.isEmpty();
        return p.addValue("avecCodes", presents ? 1 : 0)
                .addValue("codes", presents ? List.copyOf(codes) : List.of("-"));
    }

    private static MapSqlParameterSource avecBornes(MapSqlParameterSource p, java.time.LocalDate debut,
                                                    java.time.LocalDate fin) {
        // Borne haute exclusive au lendemain : une date de cloture porte une heure, et
        // « jusqu'au 31 » doit inclure le 31 en entier.
        return p.addValue("debut", java.sql.Date.valueOf(debut))
                .addValue("fin", java.sql.Date.valueOf(fin.plusDays(1)));
    }

    private static final RowMapper<AgriSortieDto> SORTIE_MAPPER = (rs, n) -> {
        AgriSortieDto d = new AgriSortieDto();
        d.setCodAgencia(str(rs, "COD_AGENCIA"));
        d.setNumCredito(lng(rs, "NUM_CREDITO"));
        d.setCodCliente(str(rs, "COD_CLIENTE"));
        d.setNomCliente(str(rs, "NOM_CLIENTE"));
        d.setTipCredito(intg(rs, "TIP_CREDITO"));
        d.setDesTipCredito(str(rs, "DES_TIP_CREDITO"));
        d.setCodActividad(str(rs, "COD_ACTIVIDAD"));
        d.setCodFiliere(str(rs, "COD_SUBSUBACTIVIDAD"));
        d.setNomFiliere(str(rs, "DES_FILIERE"));
        d.setMonCredito(dec(rs, "MON_CREDITO"));
        d.setMonSaldo(dec(rs, "MON_SALDO"));
        d.setFecApertura(dt(rs, "FEC_APERTURA"));
        d.setFecVencimiento(dt(rs, "FEC_VENCIMIENTO"));
        d.setFecCancelacion(dt(rs, "FEC_CANCELACION"));
        d.setIndEstado(str(rs, "IND_ESTADO"));
        d.setCodEjecutivo(str(rs, "COD_EJECUTIVO"));
        d.setNomEjecutivo(str(rs, "NOM_EJECUTIVO"));
        return d;
    };

    public long countPortfolio(java.util.Collection<String> codes, boolean inclureClos) {
        return execute("countPortfolio",
                () -> nullSafe(tertiary.queryForObject(SQL_COUNT_PORTFOLIO_NATIONAL,
                        avecFiltres(new MapSqlParameterSource(), codes, inclureClos), Long.class)));
    }

    public List<AgriCreditDto> findPortfolio(java.util.Collection<String> codes, boolean inclureClos, int offset, int size) {
        MapSqlParameterSource p = avecDates(avecFiltres(new MapSqlParameterSource()
                .addValue("offset", offset)
                .addValue("size", size), codes, inclureClos));
        return execute("findPortfolio",
                () -> tertiary.query(enrichi(SQL_FIND_PORTFOLIO_NATIONAL), p, CREDIT_MAPPER));
    }

    /** Enveloppe une requete paginee de credits par les agregats d'echeancier. */
    private static String enrichi(String sqlPage) {
        // L'ORDER BY ... OFFSET/FETCH de la page doit rester dans la table derivee : SQL Server
        // l'accepte avec OFFSET. Le tri final est refait sur la page enveloppee.
        return ENRICHI_PREFIXE + sqlPage + ENRICHI_SUFFIXE_DEBUT + FILIERE_LIBELLE + ENRICHI_SUFFIXE_FIN;
    }

    private static MapSqlParameterSource avecDates(MapSqlParameterSource p) {
        java.time.LocalDate aujourdhui = java.time.LocalDate.now();
        return p.addValue("aujourdhui", java.sql.Date.valueOf(aujourdhui))
                .addValue("debutMois", java.sql.Date.valueOf(aujourdhui.withDayOfMonth(1)))
                .addValue("finMois", java.sql.Date.valueOf(aujourdhui.withDayOfMonth(1).plusMonths(1)));
    }

    /** Un parametre vide dans IN (...) est refuse par SQL Server : on passe par un indicateur. */
    private static MapSqlParameterSource avecFiltres(MapSqlParameterSource p, java.util.Collection<String> codes, boolean inclureClos) {
        boolean avecCodes = codes != null && !codes.isEmpty();
        return p.addValue("tous", inclureClos ? 1 : 0)
                .addValue("avecCodes", avecCodes ? 1 : 0)
                .addValue("codes", avecCodes ? java.util.List.copyOf(codes) : java.util.List.of("-"));
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
        dto.setCodFiliere(strSiPresent(rs, "COD_SUBSUBACTIVIDAD"));
        dto.setNomFiliere(strSiPresent(rs, "DES_FILIERE"));
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
        dto.setCodEjecutivo(strSiPresent(rs, "COD_EJECUTIVO"));
        if (colonnePresente(rs, "PREM_IMP")) {
            dto.setNomEjecutivo(str(rs, "NOM_EJECUTIVO"));
            java.time.LocalDate premiereImpayee = dt(rs, "PREM_IMP");
            dto.setJoursRetard(premiereImpayee == null ? 0
                    : (int) Math.max(0, java.time.temporal.ChronoUnit.DAYS.between(premiereImpayee, java.time.LocalDate.now())));
            java.math.BigDecimal cap = dec(rs, "CAP_IMP");
            java.math.BigDecimal interets = dec(rs, "INT_IMP");
            dto.setMontantImpaye((cap == null ? java.math.BigDecimal.ZERO : cap)
                    .add(interets == null ? java.math.BigDecimal.ZERO : interets));
            dto.setProchaineEcheanceDate(dt(rs, "PROCH_ECH"));
            dto.setProchaineEcheanceMontant(dec(rs, "PROCH_MON"));
            java.math.BigDecimal attendu = dec(rs, "ATTENDU_MOIS");
            java.math.BigDecimal reste = dec(rs, "RESTE_MOIS");
            dto.setMontantAttenduMois(attendu == null ? java.math.BigDecimal.ZERO : attendu);
            dto.setMontantPayeMois(attendu == null ? java.math.BigDecimal.ZERO
                    : attendu.subtract(reste == null ? java.math.BigDecimal.ZERO : reste).max(java.math.BigDecimal.ZERO));
        }
        return dto;
    };

    private static boolean colonnePresente(java.sql.ResultSet rs, String col) {
        try {
            rs.findColumn(col);
            return true;
        } catch (java.sql.SQLException e) {
            return false;
        }
    }

    private static String strSiPresent(java.sql.ResultSet rs, String col) throws java.sql.SQLException {
        return colonnePresente(rs, col) ? str(rs, col) : null;
    }

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

    // ==================== Comptes du membre (credit CC008 / remboursement CC014) ====================

    /**
     * Comptes d'un membre limites aux produits demandes. Le libelle de l'agence et celui du
     * produit sont joints depuis les referentiels SAF ; le nom du client sert d'en-tete de reponse.
     */
    private static final String SQL_COMPTES_MEMBRE = """
            SELECT c.NUM_CUENTA, c.COD_PRODUCTO, c.COD_AGENCIA, c.COD_MONEDA, c.IND_ESTADO,
                   c.FEC_APERTURA, c.FEC_ULT_MOVIMIENTO,
                   c.SAL_DISPONIBLE, c.SAL_RESERVA, c.SAL_CONGELADO,
                   ag.DES_AGENCIA, p.NOM_PRODUCTO, p.DES_PRODUCTO, cl.NOM_CLIENTE
            FROM CC.CC_CUENTA_EFECTIVO c
            LEFT JOIN CF.CF_AGENCIAS ag
                ON ag.COD_EMPRESA = c.COD_EMPRESA AND ag.COD_AGENCIA = c.COD_AGENCIA
            LEFT JOIN CF.CF_PRODUCTOS p
                ON p.COD_EMPRESA = c.COD_EMPRESA AND p.COD_SISTEMA = c.COD_SISTEMA
               AND p.COD_PRODUCTO = c.COD_PRODUCTO
            LEFT JOIN CL.CL_CLIENTES cl
                ON cl.COD_EMPRESA = c.COD_EMPRESA AND cl.COD_CLIENTE = c.COD_CLIENTE
            WHERE c.COD_EMPRESA = '00000'
              AND c.COD_CLIENTE = :codCliente
              AND c.COD_PRODUCTO IN (:produits)
            ORDER BY c.COD_PRODUCTO, c.NUM_CUENTA
            """;

    /**
     * Membres dont l'un des trois telephones de la fiche (principal, secondaire, autre) est le
     * numero donne, deja normalise par l'appelant (9 chiffres) ; CHAMP_TELEPHONE dit lequel. Les
     * colonnes ne sont pas indexees (seule la cle primaire l'est) : lecture complete de
     * CL_CLIENTES, 0,05 a 0,5 s mesures le 15 octobre 2026 — acceptable. La comparaison se fait
     * apres LTRIM/RTRIM : des numeros sont saisis avec des espaces.
     */
    private static final String SQL_CLIENTS_PAR_TELEPHONE = """
            SELECT c.COD_CLIENTE, c.NOM_CLIENTE, c.COD_AGENCIA, ag.DES_AGENCIA,
                   CASE WHEN LTRIM(RTRIM(c.TEL_PRINCIPAL)) = :telephone THEN 'principal'
                        WHEN LTRIM(RTRIM(c.TEL_SECUNDARIO)) = :telephone THEN 'secondaire'
                        ELSE 'autre' END AS CHAMP_TELEPHONE
            FROM CL.CL_CLIENTES c
            LEFT JOIN CF.CF_AGENCIAS ag
                ON ag.COD_EMPRESA = c.COD_EMPRESA AND ag.COD_AGENCIA = c.COD_AGENCIA
            WHERE c.COD_EMPRESA = '00000'
              AND (LTRIM(RTRIM(c.TEL_PRINCIPAL)) = :telephone
                   OR LTRIM(RTRIM(c.TEL_SECUNDARIO)) = :telephone
                   OR LTRIM(RTRIM(c.TEL_OTRO)) = :telephone)
            ORDER BY CASE WHEN LTRIM(RTRIM(c.TEL_PRINCIPAL)) = :telephone THEN 0 ELSE 1 END,
                     c.COD_AGENCIA, c.COD_CLIENTE
            """;

    /** Une ligne par membre portant ce numero sur l'un de ses trois telephones ; vide si aucun. */
    public List<java.util.Map<String, Object>> findClientsParTelephone(String telephone) {
        MapSqlParameterSource params = new MapSqlParameterSource().addValue("telephone", telephone);
        return execute("agri.clientsParTelephone", () -> tertiary.queryForList(SQL_CLIENTS_PAR_TELEPHONE, params));
    }

    /** Une ligne par compte ; la liste est vide si le membre n'a aucun de ces comptes. */
    public List<java.util.Map<String, Object>> findComptesMembre(String codCliente, List<String> produits) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("codCliente", codCliente)
                .addValue("produits", produits);
        return execute("agri.comptesMembre",
                () -> tertiary.queryForList(SQL_COMPTES_MEMBRE, params));
    }

    /**
     * Credits en cours de remboursement d'un membre : etat D (decaisse) ou J (judiciaire),
     * les seuls qui donnent lieu a un prelevement sur le compte de remboursement.
     */
    private static final String SQL_CREDITS_EN_COURS = """
            SELECT cr.NUM_CREDITO, cr.COD_AGENCIA, cr.TIP_CREDITO, tc.DES_TIP_CREDITO,
                   cr.MON_CREDITO, cr.MON_SALDO, cr.MON_CUOTA, cr.CANT_CUOTAS,
                   cr.FEC_APERTURA, cr.FEC_VENCIMIENTO, cr.IND_ESTADO, cr.ID_CUENTA,
                   (SELECT COUNT(*) FROM PR.PR_PLAN_PAGOS p2
                     WHERE p2.COD_EMPRESA = cr.COD_EMPRESA AND p2.COD_AGENCIA = cr.COD_AGENCIA
                       AND p2.NUM_CREDITO = cr.NUM_CREDITO AND p2.NUM_CUOTA <> 0
                       AND COALESCE(p2.SAL_PRINCIPAL, 0) + COALESCE(p2.SAL_INT, 0) > 0) AS NB_RESTANTES,
                   (SELECT COALESCE(SUM(COALESCE(p3.SAL_PRINCIPAL, 0) + COALESCE(p3.SAL_INT, 0)), 0)
                      FROM PR.PR_PLAN_PAGOS p3
                     WHERE p3.COD_EMPRESA = cr.COD_EMPRESA AND p3.COD_AGENCIA = cr.COD_AGENCIA
                       AND p3.NUM_CREDITO = cr.NUM_CREDITO AND p3.NUM_CUOTA <> 0) AS RESTE_TOTAL
            FROM PR.PR_CREDITOS cr
            LEFT JOIN PR.PR_TIPO_CREDITO tc
                ON tc.COD_EMPRESA = cr.COD_EMPRESA AND tc.TIP_CREDITO = cr.TIP_CREDITO
            WHERE cr.COD_EMPRESA = '00000'
              AND cr.COD_CLIENTE = :codCliente
              AND cr.IND_ESTADO IN ('D', 'J')
            ORDER BY cr.FEC_APERTURA DESC, cr.NUM_CREDITO DESC
            """;

    /**
     * Les {@code nbEcheances} premieres echeances restant a payer de chaque credit en cours,
     * les plus proches d'abord. Le rang est calcule par credit, pas globalement.
     */
    private static final String SQL_PROCHAINES_ECHEANCES = """
            SELECT x.NUM_CREDITO, x.NUM_CUOTA, x.FEC_CUOTA, x.MON_CUOTA, x.MON_INT,
                   x.SAL_PRINCIPAL, x.SAL_INT, x.RESTE
            FROM (
                SELECT pp.NUM_CREDITO, pp.NUM_CUOTA, pp.FEC_CUOTA, pp.MON_CUOTA,
                       COALESCE(pp.MON_INT, 0) AS MON_INT,
                       COALESCE(pp.SAL_PRINCIPAL, 0) AS SAL_PRINCIPAL,
                       COALESCE(pp.SAL_INT, 0) AS SAL_INT,
                       COALESCE(pp.SAL_PRINCIPAL, 0) + COALESCE(pp.SAL_INT, 0) AS RESTE,
                       ROW_NUMBER() OVER (PARTITION BY pp.NUM_CREDITO
                                          ORDER BY pp.FEC_CUOTA, pp.NUM_CUOTA) AS RANG
                FROM PR.PR_PLAN_PAGOS pp
                INNER JOIN PR.PR_CREDITOS cr
                    ON cr.COD_EMPRESA = pp.COD_EMPRESA AND cr.COD_AGENCIA = pp.COD_AGENCIA
                   AND cr.NUM_CREDITO = pp.NUM_CREDITO
                WHERE pp.COD_EMPRESA = '00000'
                  AND cr.COD_CLIENTE = :codCliente
                  AND cr.IND_ESTADO IN ('D', 'J')
                  AND pp.NUM_CUOTA <> 0
                  AND COALESCE(pp.SAL_PRINCIPAL, 0) + COALESCE(pp.SAL_INT, 0) > 0
            ) x
            WHERE x.RANG <= :nbEcheances
            ORDER BY x.NUM_CREDITO, x.FEC_CUOTA, x.NUM_CUOTA
            """;

    /** Credits en cours du membre (lignes brutes, assemblees par le service). */
    public List<java.util.Map<String, Object>> findCreditsEnCours(String codCliente) {
        MapSqlParameterSource params = new MapSqlParameterSource().addValue("codCliente", codCliente);
        return execute("agri.creditsEnCours", () -> tertiary.queryForList(SQL_CREDITS_EN_COURS, params));
    }

    /** Prochaines echeances restant a payer, tous credits en cours confondus. */
    public List<java.util.Map<String, Object>> findProchainesEcheances(String codCliente, int nbEcheances) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("codCliente", codCliente)
                .addValue("nbEcheances", nbEcheances);
        return execute("agri.prochainesEcheances", () -> tertiary.queryForList(SQL_PROCHAINES_ECHEANCES, params));
    }

    // ==================== Identite et contacts d'un membre ====================

    /**
     * Identite d'un membre : le nom complet et les telephones viennent de la fiche client,
     * le nom et le prenom separes de la fiche personne physique quand il y en a une.
     */
    private static final String SQL_IDENTITE_MEMBRE = """
            SELECT c.COD_CLIENTE, c.NOM_CLIENTE, c.IND_PERSONA, c.FEC_INGRESO,
                   c.TEL_PRINCIPAL, c.TEL_SECUNDARIO, c.TEL_OTRO,
                   c.COD_AGENCIA, ag.DES_AGENCIA,
                   pf.PRIMER_NOMBRE, pf.PRIMER_APELLIDO, pf.IND_SEXO, pf.NACIONALIDAD,
                   prof.DES_PROFESION, pj.RAZON_SOCIAL
            FROM CL.CL_CLIENTES c
            LEFT JOIN CL.CL_PERSONAS_FISICAS pf
                ON pf.COD_EMPRESA = c.COD_EMPRESA AND pf.COD_CLIENTE = c.COD_CLIENTE
            LEFT JOIN CL.CL_PERSONAS_JURIDICAS pj
                ON pj.COD_EMPRESA = c.COD_EMPRESA AND pj.COD_CLIENTE = c.COD_CLIENTE
            LEFT JOIN CL.CL_CAT_PROFESIONES prof
                ON prof.COD_EMPRESA = pf.COD_EMPRESA AND prof.COD_PROFESION = pf.COD_PROFESION
            LEFT JOIN CF.CF_AGENCIAS ag
                ON ag.COD_EMPRESA = c.COD_EMPRESA AND ag.COD_AGENCIA = c.COD_AGENCIA
            WHERE c.COD_EMPRESA = '00000' AND c.COD_CLIENTE = :codCliente
            """;

    /** Adresses declarees du membre. */
    private static final String SQL_ADRESSES_MEMBRE = """
            SELECT d.TIP_DIRECCION, d.DET_DIRECCION,
                   pr.DES_PROVINCIA, ca.DES_CANTON, di.DES_DISTRITO
            FROM CL.CL_DIR_CLIENTES d
            LEFT JOIN CF.CF_PROVINCIAS pr
                ON pr.COD_EMPRESA = d.COD_EMPRESA AND pr.COD_PAIS = d.COD_PAIS
               AND pr.COD_PROVINCIA = d.COD_PROVINCIA
            LEFT JOIN CF.CF_CANTONES ca
                ON ca.COD_EMPRESA = d.COD_EMPRESA AND ca.COD_PAIS = d.COD_PAIS
               AND ca.COD_PROVINCIA = d.COD_PROVINCIA AND ca.COD_CANTON = d.COD_CANTON
            LEFT JOIN CF.CF_DISTRITOS di
                ON di.COD_EMPRESA = d.COD_EMPRESA AND di.COD_PAIS = d.COD_PAIS
               AND di.COD_PROVINCIA = d.COD_PROVINCIA AND di.COD_CANTON = d.COD_CANTON
               AND di.COD_DISTRITO = d.COD_DISTRITO
            WHERE d.COD_EMPRESA = '00000' AND d.COD_CLIENTE = :codCliente
            ORDER BY d.TIP_DIRECCION
            """;

    /** Identite du membre, ou liste vide s'il est introuvable. */
    public List<java.util.Map<String, Object>> findIdentiteMembre(String codCliente) {
        MapSqlParameterSource params = new MapSqlParameterSource().addValue("codCliente", codCliente);
        return execute("agri.identiteMembre", () -> tertiary.queryForList(SQL_IDENTITE_MEMBRE, params));
    }

    /** Adresses du membre ; l'absence de referentiel geographique ne fait pas echouer l'appel. */
    public List<java.util.Map<String, Object>> findAdressesMembre(String codCliente) {
        MapSqlParameterSource params = new MapSqlParameterSource().addValue("codCliente", codCliente);
        try {
            return execute("agri.adressesMembre", () -> tertiary.queryForList(SQL_ADRESSES_MEMBRE, params));
        } catch (org.springframework.dao.DataAccessException e) {
            log.warn("[AGRI] adresses indisponibles pour {} : {}", codCliente, e.getMessage());
            return List.of();
        }
    }
}
