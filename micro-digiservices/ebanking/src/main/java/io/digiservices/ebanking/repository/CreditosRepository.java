package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.Creditos;
import io.digiservices.ebanking.paylaod.CreditoPKId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

public interface CreditosRepository extends JpaRepository<Creditos, CreditoPKId> {

    List<Creditos> findByCodUsuarios(String codUsuarios);
    List<Creditos> findAllByCodCliente(String codCliente);

    @Query(value = "SELECT * FROM PR.PR_CREDITOS WHERE NUM_CREDITO=:numCredito",
            nativeQuery = true)
    Creditos getCreditoParNumCredit(Long numCredito);

    //@Query("SELECT SUM(monCredito) FROM Pr_credito WHERE codCliente = :codCliente")
    //Long getSommeCreditoByClientes(@Param("codCliente") String codCliente);
    boolean existsByCodCliente(String codCliente);

    /*@Query("SELECT  planPagosPKId.COD_EMPRESA ,          \n" +
            "planPagosPKId.codAgencia ,           \n" +
            "planPagosPKId.numCredito ,           \n" +
            "planPagosPKId.NUM_CUOTA ,           \n" +
            "PlanPagos.FEC_CUOTA ,          \n" +
            "PlanPagos.FEC_REAL_CUOTA ,          \n" +
            "PlanPagos.DIA_PAGO ,           \n" +
            "PlanPagos.TIP_CUOTA ,          \n" +
            "PlanPagos.FEC_CANCELACION ,           \n" +
            "PlanPagos.FEC_ULT_PAGO_MORA ,           \n" +
            "PlanPagos.FEC_PRORROGA ,           \n" +
            "PlanPagos.MON_CUOTA ,           \n" +
            "PlanPagos.MON_PRINCIPAL ,           \n" +
            "PlanPagos.MON_INT ,           \n" +
            "PlanPagos.MON_COMISION ,           \n" +
            "PlanPagos.SAL_PRINCIPAL ,           \n" +
            "PlanPagos.SAL_COMISION ,           \n" +
            "PlanPagos.SAL_CREDITO ,           \n" +
            "PlanPagos.TAS_INT ,           \n" +
            "PlanPagos.NUM_RECIBO ,           \n" +
            "PlanPagos.DIA_INT ,           \n" +
            "PlanPagos.DIA_PENDIENTES_INT ,           \n" +
            "PlanPagos.MON_POLIZA ,           \n" +
            "PlanPagos.SAL_POLIZA ,        \n" +
            "PlanPagos.TIP_COMISION ,     \n" +
            "PlanPagos.POR_COMISION ,     \n" +
            "PlanPagos.DIA_PRINCIPAL ,      \n" +
            "PlanPagos.DIA_PENDIENTES_PRINCIPAL ,    \n" +
            "PlanPagos.DIA_COMISION ,          \n" +
            "PlanPagos.DIA_PENDIENTES_COMISION ,   \n" +
            "PlanPagos.PER_CUOTA ,           \n" +
            "PlanPagos.PER_INT ,          \n" +
            "PlanPagos.PER_COMISION ,         \n" +
            "PlanPagos.IND_ESTADO ,           \n" +
            "0.00 dias_mora,           \n" +
            "0.00 monto_mora,           \n" +
            "PlanPagos.SAL_INT ,           \n" +
            "' ' ind_cargo_mora,           \n" +
            "'  ' ind_cobrar_cuota_ext    \n" +
            "FROM PlanPagos PlanPagos      \n" +
            "WHERE ( planPagosPKId.COD_EMPRESA = '00000' ) and              \n" +
            "( planPagosPKId.codAgencia =:codAgencia ) and          \n" +
            "( PlanPagos.IND_ESTADO = 'A' ) and          \n" +
            "( planPagosPKId.NUM_CUOTA <> 0 )  ORDER BY planPagosPKId.NUM_CUOTA  DESC ")
    List<Object[]> getAllRetard(@Param("codAgencia") String codAgencia);
    */
    List<Creditos> findByCreditoPKIdCodAgenciaAndIndEstado(String codAgencia,String indEstado);

    List<Creditos> findAllByCodClienteAndIndEstado(String codCliente,String indEstado);

    boolean existsCreditosByCodClienteAndIndEstado(String codCliente,String indEstado);

    ///Creditos updateIndEstadoByNumCreditos(Long numCredit,String indEstado);


    @Query(value = "SELECT C.COD_EMPRESA, C.COD_AGENCIA, C.NUM_CREDITO, C.TIP_CREDITO, " +
            "C.COD_CLIENTE, C.MON_CREDITO, C.MON_SALDO, C.MON_DESEMBOLSADO, " +
            "C.MON_PAGADO_PRINCIPAL, C.MON_PAGADO_INTERESES, C.TASA_INTERES, " +
            "C.PLAZO_CREDITO, C.FEC_APERTURA, C.FEC_VENCIMIENTO, C.FEC_CANCELACION, " +
            "C.IND_ESTADO, C.CANT_CUOTAS, C.MON_CUOTA " +
            "FROM [PR].[PR_CREDITOS] C WHERE C.COD_CLIENTE = :codCliente " +
            "ORDER BY C.FEC_APERTURA DESC",
            nativeQuery = true)
    List<Map<String, Object>> obtenerCreditosPorCliente(@Param("codCliente") String codCliente);

    // 2. Obtener plan de pagos
    @Query(value = "SELECT PP.COD_EMPRESA, PP.COD_AGENCIA, PP.NUM_CREDITO, PP.NUM_CUOTA, " +
            "PP.FEC_CUOTA, PP.FEC_REAL_CUOTA, PP.TIP_CUOTA, PP.MON_CUOTA, " +
            "PP.MON_PRINCIPAL, PP.MON_INT, PP.MON_COMISION, PP.SAL_PRINCIPAL, " +
            "PP.SAL_INT, PP.SAL_CREDITO, PP.FEC_CANCELACION, PP.IND_ESTADO, " +
            "PP.TAS_INT, PP.DIA_INT, PP.DIA_PENDIENTES_INT, PP.PER_CUOTA " +
            "FROM [PR].[PR_PLAN_PAGOS] PP " +
            "INNER JOIN [PR].[PR_CREDITOS] C ON " +
            "PP.COD_EMPRESA = C.COD_EMPRESA AND " +
            "PP.COD_AGENCIA = C.COD_AGENCIA AND " +
            "PP.NUM_CREDITO = C.NUM_CREDITO " +
            "WHERE C.COD_CLIENTE = :codCliente " +
            "ORDER BY PP.NUM_CREDITO, PP.NUM_CUOTA",
            nativeQuery = true)
    List<Map<String, Object>> obtenerPlanPagosPorCliente(@Param("codCliente") String codCliente);

    // 3. Obtener los 3 últimos créditos para análisis de riesgo
    @Query(value = "SELECT TOP 3 COD_EMPRESA, COD_AGENCIA, NUM_CREDITO " +
            "FROM [PR].[PR_CREDITOS] " +
            "WHERE COD_CLIENTE = :codCliente " +
            "ORDER BY FEC_APERTURA DESC",
            nativeQuery = true)
    List<Map<String, Object>> obtenerUltimosTresCreditos(@Param("codCliente") String codCliente);



}
