package io.digiservices.ebanking.paylaod;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CompteDto {

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

    private LocalDateTime FEC_ESTADO;

    private LocalDateTime FEC_APERTURA;

    private LocalDateTime FEC_INI_SOBGRO;

    private LocalDateTime FEC_ULT_ACT_INT;

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
    private LocalDateTime FEC_PROX_CAP_INT;

}
