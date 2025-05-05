package io.digiservices.ebanking.paylaod;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductxDto {

    private ProductxPkId productxPkId;
    private String IND_CTA_ALTERNA;
    private String IND_PAG_INTERES;
    private String TIP_ASIGNA_TASA;
    private String TIP_CAPITALIZACION;
    private String CAR_MANEJO;
    private String CAR_SOBREGIRO;
    private String CAR_RESERVA;
    private Long LIM_CKS_GIRADOS;
    private Long MON_CK_ADICION;
    private String TAS_SOBREGIRO;
    private String TAS_RESERVA;
    private Long MON_MIN_APERTURA_CTA;
    private String COD_PRODUCTO_ASOC;
    private Long DIA_BASE_RESERVA;
    private Long DIA_BASE_SOBREGIRO;
    private String TAS_INTERES;
    private String IND_CHEQUERA;
    private String IND_MOD_APERTURA;
    private String CUENTA_CONTABLE;
    private String IND_RESERVA_A_PROM;
    private String IND_CAL_INTERES;
    private Long DIA_BASE_INTERES;
    private Long DIA_BASE_CALCULO;
    private String INACTIVACION_AUTOMATCA;
    private String IND_PROX_CAP_INT;
    @CreationTimestamp
    private LocalDateTime FEC_PROX_CAP_INT;
    private String IND_CAL_INT_CONG;
    private String IND_COB_IMP;
    private Long PORC_IMP;
    private String IND_MULT_CUE_X_CLI;
}

