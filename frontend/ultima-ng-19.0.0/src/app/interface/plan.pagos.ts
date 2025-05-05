import { PlanPagosPK } from './plan.pagos.pkid';

export interface PlanPagos {
    planPagosPKId: PlanPagosPK;
    fecCuota: Date;
    indEstado: string;
    per_INT: string;
    fec_CANCELACION: Date | null;
    per_COMISION: string;
    per_CUOTA: string;
    fec_PRORROGA: Date | null;
    tip_COMISION: string;
    fec_ULT_PAGO_MORA: Date | null;
    sal_INT: number;
    dia_INT: number;
    tas_INT: number;
    mon_INT: number;
    dia_PENDIENTES_PRINCIPAL: number;
    dia_PENDIENTES_COMISION: number | null;
    dia_PENDIENTES_INT: number;
    num_RECIBO: string;
    sal_POLIZA: number | null;
    por_COMISION: number | null;
    sal_COMISION: number;
    sal_CREDITO: number;
    sal_PRINCIPAL: number;
    dia_COMISION: number | null;
    mon_COMISION: number;
    fec_REAL_CUOTA: Date;
    mon_PRINCIPAL: number;
    dia_PRINCIPAL: number;
    mon_POLIZA: number | null;
    mon_AHORRO: number;
    tip_CUOTA: string;
    dia_PAGO: string;
    mon_CUOTA: number;
}
