package io.digiservices.ebanking.entity;

import io.digiservices.ebanking.paylaod.TypeCreditPKId;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "PR_TIPO_CREDITO",schema = "PR")
public class TypeCredit {

    @EmbeddedId
    private TypeCreditPKId typeCreditPKId;
    private String COD_MONEDA;
    private String COD_ORIGEN;
    private String COD_TASA_INT;
    private String COD_TASA_MORA;
    private String TIP_CUOTA;
    private String DES_TIP_CREDITO;
    private String IND_LINEA;
    private String TIP_MODALIDAD_COBRO;
    private String TIP_INTERES;
    private Long TIP_CALENDARIO;
    private String TIP_LINEA;
    private String TIP_MANEJO;
    private String TIP_PLAZO;
    private Long PLAZO_MAX;
    private Long MON_MIN;
    private Long MON_MAX;
    private String TIP_TASA;
    private Long VAL_VARIACION_BASE;
    private Long TASA_INTERES;
    private Long VAL_VARIACION_MORA;
    private Long GRACIA_PRINCIPAL;
    private String TIP_MORA;
    private Long TASA_MORA;
    private Long GRACIA_MORA;
    private Long BASE_CAL_MORA;
    private Long DIA_ATRASO_CJ;
    private String IND_COBRO_INT;
    private Long MON_COMISION_NOR;
    private Long MON_COMISION_NOR_MIN;
    private Long MON_COMISION_NOR_MAX;
    private String IND_SOBRESCRIBE;
    private String IND_REVALORIZA;
    private String IND_GARANTIA;
    private String TIP_COMISION;
    private Long DIAS_VENCIDO;
    private String IND_SOBREGIRO;
    private Long POR_SOBREGIRO;
    private Long DIA_ATRASO_COBRO_ADM;
    private String IND_COBRA_COBRO_ADM;
    private String IND_COBRA_COMISION_ATRASADA;
    private String IND_COBRA_SALDO_NO_UTILIZADO;
    private String COD_NIVEL;
    private String COD_PRODUCTO;
    private String IND_COBRA_COMISION;
    private String IND_CALIF_MANUAL;
    private String COD_PRODUTO_CTA_AHORRO;
    private String IND_TASA_VAL_AGREGADO;
    private Long TASA_INT_VAL_AGREGADO;
    private String IND_CAPITALIZA_INT;
    private String PERIODO_CAPITALIZACION;
    private String COD_PRODUCTO_CTA_AHORRO;
    private String IND_CALC_MORA;
    private String IND_CANT_CUOTAS;
    private String IND_EXCLUSION_PAGO;
    private Long PER_EXCLUSION;
    private String IND_PAGO_CJ;
    private Long PORC_DEP_GARANTIA;
    private String IND_CAL_MORA_HAB;
    private Long TASA_EFECTIVA_MAX;
    private String TIP_MODALIDAD_COBRO_ESP;

}
