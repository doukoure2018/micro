package io.digiservices.clients.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PlanPagosDto {

    private PlanPagosPKId planPagosPKId;
    private LocalDateTime fecCuota;
    private LocalDateTime FEC_REAL_CUOTA;
    private String DIA_PAGO;
    private String TIP_CUOTA;
    private LocalDateTime FEC_CANCELACION;
    private LocalDateTime FEC_ULT_PAGO_MORA;
    private LocalDateTime FEC_PRORROGA;
    private BigDecimal MON_CUOTA;
    private BigDecimal MON_PRINCIPAL;
    private BigDecimal MON_INT;
    private BigDecimal MON_COMISION;
    private BigDecimal SAL_PRINCIPAL;
    private BigDecimal SAL_INT;
    private BigDecimal SAL_COMISION;
    private BigDecimal SAL_CREDITO;
    private BigDecimal TAS_INT;
    private String NUM_RECIBO;
    private BigDecimal DIA_INT;
    private BigDecimal DIA_PENDIENTES_INT;
    private BigDecimal MON_POLIZA;
    private BigDecimal SAL_POLIZA;
    private String TIP_COMISION;
    private BigDecimal POR_COMISION;
    private BigDecimal DIA_PRINCIPAL;
    private BigDecimal DIA_PENDIENTES_PRINCIPAL;
    private BigDecimal DIA_COMISION;
    private BigDecimal DIA_PENDIENTES_COMISION;
    private String PER_CUOTA;
    private String PER_INT;
    private String PER_COMISION;
    private String indEstado;
    private BigDecimal MON_AHORRO;
}