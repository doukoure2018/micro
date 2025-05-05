package io.digiservices.ebanking.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.digiservices.ebanking.paylaod.CreditoPKId;
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
@Table(name = "PR_CREDITOS",schema ="PR" )
public class Creditos {

    @EmbeddedId
    private CreditoPKId creditoPKId;
    private Long TIP_CREDITO;
    private String COD_ORIGEN;
    private String COD_PLAN_INVERSION;
    private Long COD_PLAZO;
    private String COD_MONEDA;
    @Column(name = "COD_CLIENTE",nullable = false)
    private String codCliente;
    private String COD_TASA_INT;
    @Column(name = "COD_USUARIO",nullable = false)
    private String codUsuarios;
    private String COD_ACTIVIDAD;
    private String COD_SUBACTIV;
    private String COD_REFERENTE;
    private String COD_TASA_MORA;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime FEC_CALIFICACION;
    @Column(name = "MON_CREDITO",precision =16,scale = 2)
    private BigDecimal monCredito ;
    @Column(precision =16,scale = 2)
    private BigDecimal MON_SALDO;
    private String IND_LINEA;
    private String TIP_LINEA;
    private String TIP_MANEJO;
    private String TIP_MODALIDAD_COBRO;
    private String TIP_INTERES;
    private Long TIP_CALENDARIO;
    private String TIP_CUOTA;
    @Column(precision =16,scale = 2)
    private BigDecimal MON_COMISION_NORMAL;
    @Column(precision =16,scale = 2)
    private BigDecimal MON_CUOTA;
    private Long MON_DESEMBOLSADO;
    private Long MON_PAGADO_PRINCIPAL;
    private Long MON_PAGADO_INTERESES;
    private Long MON_INT_ACUMULADO;
    private Long MON_REVALORIZACION;
    private Long MON_INT_SUSPENSO;
    private Long PLAZO_CREDITO;
    private String ID_EXTERNO;
    private Long NUM_LINEA;
    private String TIP_TASA;
    private Long VAL_VARIACION_BASE;
    private Long TASA_INTERES;
    private Long VAL_VARIACION_MORA;
    private Long TASA_MORA;
    private Long GRACIA_PRINCIPAL;
    private Long GRACIA_MORA;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime FEC_APERTURA;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime FEC_VENCIMIENTO;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime FEC_CANCELACION;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime FEC_ULT_REVISION;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime FEC_ULT_PAGO_PRINCIPAL;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime FEC_ULT_PAGO_INTERESES;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime FEC_PRIMER_DESEMBOLSO;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime FEC_ULT_DESEMBOLSO;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime FEC_PROX_COMISION;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime FEC_ULT_PAGO_MORA;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime FEC_RECONOC_INT;
    private String TIP_DESEMBOLSO;
    private String NUM_DESTINO;
    private String IND_CONTINUA_COBRO_INT;
    private String DIA_PAGO;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime FEC_ADICION;
    private String TIP_COMISION;
    private String TIP_MORA;
    private String IND_SOBREGIRO;
    private Long POR_SOBREGIRO;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime FEC_PRORROGA;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime FEC_ULT_PAGO_COMISION;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime FEC_PROX_REVISION;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime FEC_ULT_REVISION_MORA;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime FEC_INI_PAGO_PRINC;
    private String IND_COB_CARGOS;
    private String IND_COB_POLIZA;
    private String IND_COB_CUOTA;
    private String IND_COB_COMISION;
    private String TIP_REVISION;
    private Long MON_INT_MORA_ACUMULA;
    private Long MON_INT_MORA_SUSPENSO;
    private Long TIP_REG_COBRO;
    private String COD_SUBSUBACTIVIDAD;
    @Column(name = "IND_ESTADO")
    private String indEstado;
    private String OBSERVACIONES;
    private String PER_INT;
    private String PER_MORA;
    private String PER_COMISION;
    private String PER_CUOTA;
    private String PER_REV_TASA;
    private String COD_EJECUTIVO;
    private String IND_BLOQUEO;
    private String IND_FORMA_PAGO;
    @Column(name = "ID_CUENTA")
    private String idCuenta;
    private String COD_OFICIAL;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime FEC_ING_COBRO;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime FEC_SAL_COBRO;
    private Long MON_INT_ANTICIPADOS;
    private Long MON_INT_ANTES_CJ;
    private String COD_DIRECCION;
    private String IND_CALIF_MANUAL;
    private String COD_CALIFICACION;
    private Long CANT_HECTAREAS;
    private String COD_ASOCIACION;
    private String COD_GRUPO_SOL;
    private String COD_FINANCIADOR;
    private Long NUM_CICLO;
    private String COD_ZONA;
    private String IND_TASA_VAL_AGREGADO;
    private Long TASA_INT_VAL_AGREGADO;
    private String IND_CAPITALIZA_INT;
    private String PERIODO_CAPITALIZACION;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime FEC_INICIO_PLAN;
    private String IND_COBRA_INT_INICIAL;
    private Long MON_SUSPEN_INTERESES;
    private Long MON_SUSPEN_PRINCIPAL;
    private String IND_CALC_MORA;
    private Long MON_PRINCIPAL_CUOTA;
    private Long MON_INT_CUOTA;
    @Column(name = "CANT_CUOTAS",nullable = false)
    private Long CANT_CUOTAS;
    private Long PLAZO_ADICIONAL;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime FEC_RENOVACION;
    private Long MON_PROVISION;
    private String IND_EXCLUSION_PAGO;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime FEC_PROVISION;
    private String COD_USUARIO_PROVISION;
    private String COD_ESTADO_CONTABLE;
    private Long TASA_EFECTIVA;
    private String TIP_MODALIDAD_COBRO_ESP;

}
