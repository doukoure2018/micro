package io.digiservices.ebanking.repository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

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
}
