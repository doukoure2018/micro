package io.digiservices.ebanking.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.digiservices.ebanking.paylaod.PlanPagosPKId;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "PR_PLAN_PAGOS",schema = "PR")
public class PlanPagos {

    @EmbeddedId
    private PlanPagosPKId planPagosPKId;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    @Column(name = "FEC_CUOTA")
    private LocalDateTime fecCuota;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private LocalDateTime FEC_REAL_CUOTA;
    private String DIA_PAGO;
    private String TIP_CUOTA;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private LocalDateTime FEC_CANCELACION;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private LocalDateTime FEC_ULT_PAGO_MORA;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private LocalDateTime FEC_PRORROGA;
    @Column(precision = 18,scale = 2)
    private BigDecimal MON_CUOTA;
    @Column(precision = 18,scale = 2)
    private BigDecimal MON_PRINCIPAL;
    @Column(precision = 18,scale = 2)
    private BigDecimal MON_INT;
    @Column(precision = 18,scale = 2)
    private BigDecimal MON_COMISION;
    @Column(precision = 18,scale = 2)
    private BigDecimal SAL_PRINCIPAL;
    @Column(precision = 18,scale = 2)
    private BigDecimal SAL_INT;
    @Column(precision = 18,scale = 2)
    private BigDecimal SAL_COMISION;
    @Column(precision = 18,scale = 2)
    private BigDecimal SAL_CREDITO;
    @Column(precision = 18,scale = 2)
    private BigDecimal TAS_INT;
    private String NUM_RECIBO;
    @Column(precision = 18,scale = 2)
    private BigDecimal DIA_INT;
    @Column(precision = 18,scale = 2)
    private BigDecimal DIA_PENDIENTES_INT;
    @Column(precision = 18,scale = 2)
    private BigDecimal MON_POLIZA;
    @Column(precision = 18,scale = 2)
    private BigDecimal SAL_POLIZA;
    private String TIP_COMISION;
    @Column(precision = 18,scale = 2)
    private BigDecimal POR_COMISION;
    private Long DIA_PRINCIPAL;
    private Long DIA_PENDIENTES_PRINCIPAL;
    @Column(precision = 18,scale = 2)
    private BigDecimal DIA_COMISION;
    @Column(precision = 18,scale = 2)
    private BigDecimal DIA_PENDIENTES_COMISION;
    private String PER_CUOTA;
    private String PER_INT;
    private String PER_COMISION;
    @Column(name = "IND_ESTADO")
    private String indEstado;
    @Column(precision = 18,scale = 2)
    private BigDecimal MON_AHORRO;
}
