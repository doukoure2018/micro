package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.PlanPagos;
import io.digiservices.ebanking.paylaod.PlanPagosPKId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface PlanPagosRepository extends JpaRepository<PlanPagos, PlanPagosPKId> {

    //@Query("SELECT planPagosPKId.COD_EMPRESA,planPagosPKId.codAgencia FROM PlanPagos WHERE planPagosPKId.numCredito=:numCredito")
    //List<PlanPagos> getAllCredit(@Param("numCredito") Long numCredito);

//    @Query("SELECT planPagosPKId.COD_EMPRESA,\n" +
//            "planPagosPKId.codAgencia,\n" +
//            "planPagosPKId.numCredito,\n" +
//            "planPagosPKId.NUM_CUOTA,\n" +
//            "PlanPagos.FEC_CUOTA,\n" +
//            "PlanPagos.DIA_PAGO,\n" +
//            "PlanPagos.TIP_CUOTA,\n" +
//            "PlanPagos.MON_CUOTA,\n" +
//            "PlanPagos.MON_PRINCIPAL,\n" +
//            "PlanPagos.MON_INT,\n" +
//            "PlanPagos.TAS_INT,\n" +
//            "PlanPagos.DIA_INT,\n" +
//            "PlanPagos.DIA_PRINCIPAL,\n" +
//            "PlanPagos.PER_CUOTA,\n" +
//            "PlanPagos.PER_INT,\n" +
//            "PlanPagos.SAL_CREDITO,\n" +
//            "Pr_credito.COD_EJECUTIVO\n" +
//            "FROM PlanPagos PlanPagos, Pr_credito Pr_credito\n" +
//            "WHERE (creditoPKId.COD_EMPRESA = planPagosPKId.COD_EMPRESA)\n" +
//            "AND\t(creditoPKId.codAgencia = planPagosPKId.codAgencia)\n" +
//            "AND\t(creditoPKId.numCredito = planPagosPKId.numCredito)\n" +
//            "AND\t(planPagosPKId.COD_EMPRESA = '00000')\n" +
//            "/*AND\t(planPagosPKId.numCredito IN (\t  SELECT\tPr_credito.numCredito\n" +
//            "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t    FROM\tPr_credito\n" +
//            "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t  WHERE\t(Pr_credito.COD_EMPRESA = COD_EMPRESA)\n" +
//            "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t  AND (Pr_credito.codAgencia LIKE COD_AGENCIA)\n" +
//            "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t  AND (Pr_credito.COD_CLIENTE LIKE COD_CLIENTE)\n" +
//            "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t  AND (Pr_credito.COD_MONEDA LIKE COD_MONEDA)\n" +
//            "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t  AND (Pr_credito.TIP_CREDITO >= as_TCreditoInicial)\n" +
//            "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t  AND (Pr_credito.TIP_CREDITO <= as_TCreditoFinal)\n" +
//            "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t  AND (Pr_credito.COD_EJECUTIVO LIKE as_Ejecutivo)\n" +
//            "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t  AND (Pr_credito.COD_ORIGEN LIKE as_Origen)\n" +
//            "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t  AND (Pr_credito.COD_ACTIVIDAD LIKEas_CodActividad)\n" +
//            "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t)\n" +
//            "\t\t\t)\n" +
//            "\t   */\n" +
//            "AND (creditoPKId.codAgencia LIKE :codAgencia)\n" +
//            "AND (Pr_credito.codCliente LIKE '%')\n" +
//            "AND (Pr_credito.COD_MONEDA LIKE '%')\n" +
//            "AND (Pr_credito.TIP_CREDITO >= 1)\n" +
//            "AND (Pr_credito.TIP_CREDITO <= 100)\n" +
//            "AND (Pr_credito.COD_EJECUTIVO LIKE '%')\n" +
//            "AND (Pr_credito.COD_ORIGEN LIKE '%')\n" +
//            "AND (Pr_credito.COD_ACTIVIDAD LIKE'%')\n" +
//            "AND (planPagosPKId.NUM_CUOTA <> 0)\n" +
//            "AND ( /*Pr_credito.IND_ESTADO LIKE as_Estado*/\n" +
//            "( Pr_credito.indEstado = '%' )\n" +
//            "OR\n" +
//            "( '%' = '%' AND (Pr_credito.indEstado='D' OR Pr_credito.indEstado='J' ) )) \n" +
//            "AND PlanPagos.FEC_CUOTA BETWEEN :start AND :end ")
    //List<Object[]> getAllTT1(@Param("codAgencia") String codAgencia,@Param("start") Date start,@Param("end") Date end);


    List<PlanPagos> findAllByPlanPagosPKIdNumCredito(Long numCredito);

    @Query("SELECT p FROM PlanPagos p WHERE p.planPagosPKId.numCredito = :numCredito AND p.indEstado = :indEstado AND p.planPagosPKId.numCuota <> 0 AND p.fecCuota <= :fecCuota")
    List<PlanPagos> findAllByPlanPagosPKIdNumCreditoAndIndEstadoAndPlanPagosPKIdNumCuotaNotAndFecCuotaLessThan(
            @Param("numCredito") Long numCredito,
            @Param("indEstado") String indEstado,
            @Param("fecCuota") LocalDateTime fecCuota);

    @Query("SELECT COUNT(*) FROM PlanPagos p WHERE p.indEstado = :indEstado AND p.planPagosPKId.numCuota <> 0 AND p.fecCuota <= :fecCuota")
    Long countAllByIndEstadoAndPlanPagosPKIdNumCuotaNotAndFecCuotaLessThan(String indEstado,LocalDateTime fecCuota);


    @Query("SELECT SUM(p.SAL_PRINCIPAL) FROM PlanPagos p WHERE p.indEstado = :indEstado AND p.planPagosPKId.numCuota <> 0 AND p.fecCuota <= :fecCuota")
    BigDecimal getSumRetards (String indEstado, LocalDateTime fecCuota);


    @Query("SELECT p FROM PlanPagos p " +
            "WHERE p.planPagosPKId.numCredito = :numCredito " +
            "AND p.indEstado = :indEstado " +
            "AND p.planPagosPKId.numCuota <> 0 " +
            "AND p.fecCuota <= :fecCuota " +
            "ORDER BY p.fecCuota DESC")
    List<PlanPagos> findLastPlanPago(
            @Param("numCredito") Long numCredito,
            @Param("indEstado") String indEstado,
            @Param("fecCuota") LocalDateTime fecCuota);

}
