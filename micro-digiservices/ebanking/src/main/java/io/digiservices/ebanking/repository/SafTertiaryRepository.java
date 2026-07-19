package io.digiservices.ebanking.repository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Lectures SAF pour la synthese DG, executees sur la datasource TERTIARY
 * (base 10.110.15.2 en configuration actuelle) afin de NE PAS solliciter la
 * base de production. Requetes en lecture seule, robustes a l'indisponibilite
 * (les exceptions remontent et sont traitees gracieusement cote appelant).
 */
@Slf4j
@Repository
public class SafTertiaryRepository {

    private final JdbcTemplate tertiaryJdbcTemplate;

    public SafTertiaryRepository(@Qualifier("tertiaryJdbcTemplate") JdbcTemplate tertiaryJdbcTemplate) {
        this.tertiaryJdbcTemplate = tertiaryJdbcTemplate;
    }

    /** Credits du client (memes colonnes que CreditosRepository.obtenerCreditosPorCliente). */
    public List<Map<String, Object>> obtenerCreditosPorCliente(String codCliente) {
        return tertiaryJdbcTemplate.queryForList(
                "SELECT C.COD_EMPRESA, C.COD_AGENCIA, C.NUM_CREDITO, C.TIP_CREDITO, " +
                "C.COD_CLIENTE, C.MON_CREDITO, C.MON_SALDO, C.MON_DESEMBOLSADO, " +
                "C.MON_PAGADO_PRINCIPAL, C.MON_PAGADO_INTERESES, C.TASA_INTERES, " +
                "C.PLAZO_CREDITO, C.FEC_APERTURA, C.FEC_VENCIMIENTO, C.FEC_CANCELACION, " +
                "C.IND_ESTADO, C.CANT_CUOTAS, C.MON_CUOTA " +
                "FROM [PR].[PR_CREDITOS] C WHERE C.COD_CLIENTE = ? " +
                "ORDER BY C.FEC_APERTURA DESC",
                codCliente);
    }

    /** Plan de paiements du client (memes colonnes que CreditosRepository.obtenerPlanPagosPorCliente). */
    public List<Map<String, Object>> obtenerPlanPagosPorCliente(String codCliente) {
        return tertiaryJdbcTemplate.queryForList(
                "SELECT PP.COD_EMPRESA, PP.COD_AGENCIA, PP.NUM_CREDITO, PP.NUM_CUOTA, " +
                "PP.FEC_CUOTA, PP.FEC_REAL_CUOTA, PP.TIP_CUOTA, PP.MON_CUOTA, " +
                "PP.MON_PRINCIPAL, PP.MON_INT, PP.MON_COMISION, PP.SAL_PRINCIPAL, " +
                "PP.SAL_INT, PP.SAL_CREDITO, PP.FEC_CANCELACION, PP.IND_ESTADO, " +
                "PP.TAS_INT, PP.DIA_INT, PP.DIA_PENDIENTES_INT, PP.PER_CUOTA " +
                "FROM [PR].[PR_PLAN_PAGOS] PP " +
                "INNER JOIN [PR].[PR_CREDITOS] C ON " +
                "PP.COD_EMPRESA = C.COD_EMPRESA AND " +
                "PP.COD_AGENCIA = C.COD_AGENCIA AND " +
                "PP.NUM_CREDITO = C.NUM_CREDITO " +
                "WHERE C.COD_CLIENTE = ? " +
                "ORDER BY PP.NUM_CREDITO, PP.NUM_CUOTA",
                codCliente);
    }

    /**
     * Anciennete : date d'adhesion (FEC_INGRESO) du client, requete legere et rapide
     * (contrairement a AgriculteurRepository.findFarmerById qui fait une grosse jointure).
     * Pas de filtre agricole : fonctionne pour tout client.
     */
    public List<Map<String, Object>> obtenerAdhesion(String codCliente) {
        return tertiaryJdbcTemplate.queryForList(
                "SELECT TOP 1 FEC_INGRESO AS fecIngreso, NOM_CLIENTE AS nomCliente, COD_CLIENTE AS codCliente " +
                "FROM CL.CL_CLIENTES WHERE COD_CLIENTE = ?",
                codCliente);
    }

    /** Comptes d'epargne du client (soldes) depuis CC.CC_CUENTA_EFECTIVO. */
    public List<Map<String, Object>> obtenerComptesByClient(String codCliente) {
        return tertiaryJdbcTemplate.queryForList(
                "SELECT NUM_CUENTA, COD_PRODUCTO AS codProducto, COD_MONEDA, IND_ESTADO, " +
                "SAL_DISPONIBLE, SAL_PROMEDIO, SAL_CONGELADO, SAL_RESERVA, FEC_APERTURA " +
                "FROM CC.CC_CUENTA_EFECTIVO WHERE COD_CLIENTE = ?",
                codCliente);
    }

    // Un mouvement est un RETRAIT si son libelle contient RETRAIT/RETIRO, sinon DEPOT.
    private static final String COND_RETRAIT =
            "(UPPER(m.DES_MOVIMIENTO) LIKE '%RETRAIT%' OR UPPER(m.DES_MOVIMIENTO) LIKE '%RETIRO%')";

    /**
     * Resume mensuel des mouvements (depots/retraits) par compte du client, depuis
     * CC.CC_MOVIMTO_MENSUAL (jamais purgee), a partir de la date de coupure (6 mois glissants).
     * Retourne : numCuenta, mois (YYYYMM), totalDepots, totalRetraits, nbOperations.
     */
    public List<Map<String, Object>> obtenerMouvementsResume(String codCliente, LocalDate depuis) {
        return tertiaryJdbcTemplate.queryForList(
                "SELECT m.NUM_CUENTA AS numCuenta, " +
                "       CONVERT(char(6), m.FEC_MOVIMIENTO, 112) AS mois, " +
                "       SUM(CASE WHEN " + COND_RETRAIT + " THEN 0 ELSE m.MON_MOVIMIENTO END) AS totalDepots, " +
                "       SUM(CASE WHEN " + COND_RETRAIT + " THEN m.MON_MOVIMIENTO ELSE 0 END) AS totalRetraits, " +
                "       COUNT(*) AS nbOperations " +
                "FROM CC.CC_MOVIMTO_MENSUAL m " +
                "INNER JOIN CC.CC_CUENTA_EFECTIVO c " +
                "  ON c.COD_EMPRESA = m.COD_EMPRESA AND c.NUM_CUENTA = m.NUM_CUENTA " +
                "WHERE c.COD_CLIENTE = ? AND m.FEC_MOVIMIENTO >= ? " +
                "GROUP BY m.NUM_CUENTA, CONVERT(char(6), m.FEC_MOVIMIENTO, 112) " +
                "ORDER BY m.NUM_CUENTA, mois",
                codCliente, depuis);
    }

    /**
     * Detail des mouvements d'UN compte depuis CC.CC_MOVIMTO_MENSUAL (6 mois glissants).
     */
    public List<Map<String, Object>> obtenerMouvementsCompte(String numCuenta, LocalDate depuis) {
        return tertiaryJdbcTemplate.queryForList(
                "SELECT m.NUM_MOVIMIENTO AS numMovimiento, " +
                "       m.FEC_MOVIMIENTO AS fecMovimiento, " +
                "       m.TIP_TRANSACCION AS tipTransaccion, " +
                "       m.MON_MOVIMIENTO AS monMovimiento, " +
                "       m.DES_MOVIMIENTO AS desMovimiento, " +
                "       m.NUM_DOCUMENTO AS numDocumento, " +
                "       m.DES_REFERENCIA AS desReferencia, " +
                "       m.COD_USUARIO AS codUsuario, " +
                "       CASE WHEN " + COND_RETRAIT + " THEN 'RETRAIT' ELSE 'DEPOT' END AS sens " +
                "FROM CC.CC_MOVIMTO_MENSUAL m " +
                "WHERE m.NUM_CUENTA = ? AND m.FEC_MOVIMIENTO >= ? " +
                "ORDER BY m.FEC_MOVIMIENTO DESC",
                numCuenta, depuis);
    }
}
