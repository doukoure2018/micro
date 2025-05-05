package io.digiservices.ebanking.entity;

import io.digiservices.ebanking.paylaod.ComptePKId;
import com.fasterxml.jackson.annotation.JsonFormat;
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
@Table(name = "CC_CUENTA_EFECTIVO",schema = "CC")
public class Compte {

    @EmbeddedId
    private ComptePKId comptePKId;
    private String COD_AGENCIA;
    @Column(name = "COD_CATEGORIA",nullable = false)
    private String codCategoria;
    @Column(name = "COD_SISTEMA",nullable = false)
    private String codSystema;
    @Column(name = "COD_PRODUCTO",nullable = false)
    private String codProducto;
    @Column(name = "COD_CLIENTE",nullable = false)
    private String codClientes;
    private String COD_DIRECCION;
    private String IND_ESTADO;
    private String COD_ESTADO;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private LocalDateTime FEC_ESTADO;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private LocalDateTime FEC_APERTURA;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private LocalDateTime FEC_INI_SOBGRO;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private LocalDateTime FEC_ULT_ACT_INT;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private LocalDateTime FEC_ULT_CAP_INT;
    private String NOM_CHEQUERA;
    private String IND_TIP_CARGOS;
    private String IND_CTA_ALTERNA;
    private String IND_PAG_INTERES;
    @Column(precision = 18,scale = 2)
    private BigDecimal SAL_DISPONIBLE;
    @Column(precision = 18,scale = 2)
    private BigDecimal SAL_RESERVA;
    @Column(precision = 18,scale = 2)
    private BigDecimal SAL_TRANSITO;
    @Column(precision = 18,scale = 2)
    private BigDecimal SAL_CONSULTADO;
    @Column(precision = 18,scale = 2)
    private BigDecimal SAL_CONGELADO;
    @Column(precision = 18,scale = 2)
    private BigDecimal SAL_PROMEDIO;
    @Column(precision = 18,scale = 2)
    private BigDecimal SAL_ULT_CORTE;
    @Column(precision = 18,scale = 2)
    private BigDecimal MON_RESERVA_UTL;
    @Column(precision = 18,scale = 2)
    private BigDecimal MON_SOBGRO_AUT;
    @Column(precision = 18,scale = 2)
    private BigDecimal MON_SOB_NO_AUT;
    @Column(precision = 18,scale = 2)
    private BigDecimal MON_SOBGRO_DISP;
    @Column(precision = 18,scale = 2)
    private BigDecimal MON_TOTAL_CARGO;
    @Column(precision = 18,scale = 2)
    private BigDecimal INT_CAP_CONGELA;
    @Column(precision = 18,scale = 2)
    private BigDecimal INT_CAP_RESERVA;
    @Column(precision = 18,scale = 2)
    private BigDecimal INT_POR_PAGAR;
    @Column(precision = 18,scale = 2)
    private BigDecimal INT_SOBGRO_AUT;
    @Column(precision = 18,scale = 2)
    private BigDecimal INT_RESERVA_UTL;
    private String IND_SOBGRO;
    private String NUM_CTA_RELACIONADA;
    @Column(precision = 18,scale = 2)
    private BigDecimal INT_MES_ACTUAL;
    private String IND_CORRESPONDENCIA;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private LocalDateTime FEC_ULT_MOVIMIENTO;
    private String COD_MONEDA;
    private String OBS_ESTADO_CUENTA;
    @Column(precision = 18,scale = 2)
    private BigDecimal MON_MAX_SOBGRO_TEMP;
    private String COD_ASOCIACION;
    private String COD_GRUPO_SOL;
    private String COD_USUARIO;
    @Column(precision = 16,scale = 2)
    private BigDecimal INT_POR_PAGAR_MES;
    @Column(precision = 18,scale = 2)
    private BigDecimal SAL_MINIMO;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private LocalDateTime FEC_PROX_CAP_INT;

}
