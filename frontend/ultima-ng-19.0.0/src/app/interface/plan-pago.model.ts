export interface PlanPagoDTO {
    codEmpresa: string;
    codAgencia: string;
    numCredito: number;
    numCuota: number;
    fecCuota: Date | string;
    fecRealCuota?: Date | string;
    tipCuota: string;
    monCuota: number;
    monPrincipal: number;
    monInt: number;
    monComision: number;
    salPrincipal: number;
    salInt: number;
    salCredito: number;
    fecCancelacion?: Date | string;
    indEstado: string;
    tasInt: number;
    diaInt: number;
    diaPendientesInt: number;
    perCuota: string;
}
