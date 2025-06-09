export interface CreditoDTO {
    codEmpresa: string;
    codAgencia: string;
    numCredito: number;
    tipCredito: number;
    codCliente: string;
    monCredito: number;
    monSaldo: number;
    monDesembolsado: number;
    monPagadoPrincipal: number;
    monPagadoIntereses: number;
    tasaInteres: number;
    plazoCredito: number;
    fecApertura: Date | string;
    fecVencimiento: Date | string;
    fecCancelacion?: Date | string;
    indEstado: string;
    cantCuotas: number;
    monCuota: number;
}
