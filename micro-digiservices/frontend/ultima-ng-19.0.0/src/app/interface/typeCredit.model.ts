import { TypeCreditPKId } from './typeCreditPKId.model';

// TypeCreditDto.interface.ts
export interface TypeCreditDto {
    typeCreditPKId: TypeCreditPKId;
    cod_MONEDA: string;
    cod_ORIGEN: string;
    cod_TASA_INT: string;
    cod_TASA_MORA: string;
    tip_CUOTA: string;
    des_TIP_CREDITO: string;
    ind_LINEA: string;
    tip_MODALIDAD_COBRO: string;
    tip_INTERES: string;
    tip_CALENDARIO: number;
    tip_LINEA: string | null;
    tip_MANEJO: string | null;
    tip_PLAZO: string;
    plazo_MAX: number;
    mon_MIN: number;
    mon_MAX: number;
    tip_TASA: string;
    val_VARIACION_BASE: number;
    tasa_INTERES: number;
    val_VARIACION_MORA: number;
    gracia_PRINCIPAL: string | null;
    tip_MORA: string;
    tasa_MORA: number;
    gracia_MORA: number;
    base_CAL_MORA: number;
    dia_ATRASO_CJ: number;
    ind_COBRO_INT: string;
    mon_COMISION_NOR: number;
    mon_COMISION_NOR_MIN: number;
    mon_COMISION_NOR_MAX: number;
    ind_SOBRESCRIBE: string;
    ind_REVALORIZA: string;
    ind_GARANTIA: string;
    tip_COMISION: string;
    dias_VENCIDO: number;
    ind_SOBREGIRO: string;
    por_SOBREGIRO: number;
    dia_ATRASO_COBRO_ADM: number | null;
    ind_COBRA_COBRO_ADM: string;
    ind_COBRA_COMISION_ATRASADA: string;
    ind_COBRA_SALDO_NO_UTILIZADO: string;
    cod_NIVEL: string;
    cod_PRODUCTO: string;
    ind_COBRA_COMISION: string;
    ind_CALIF_MANUAL: string;
    cod_PRODUTO_CTA_AHORRO: string;
    ind_TASA_VAL_AGREGADO: string;
    tasa_INT_VAL_AGREGADO: string | null;
    ind_CAPITALIZA_INT: string;
    periodo_CAPITALIZACION: string;
    cod_PRODUCTO_CTA_AHORRO: string;
    ind_CALC_MORA: string;
    ind_CANT_CUOTAS: string;
    ind_EXCLUSION_PAGO: string;
    per_EXCLUSION: string | null;
    ind_PAGO_CJ: string;
    porc_DEP_GARANTIA: number;
    ind_CAL_MORA_HAB: string;
    tasa_EFECTIVA_MAX: number;
    tip_MODALIDAD_COBRO_ESP: string;
}
