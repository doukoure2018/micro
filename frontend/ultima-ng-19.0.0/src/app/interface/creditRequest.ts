import { RequisitoRequest } from './requisitoRequest';

export class CreditRequest {
    codAgencia?: string;
    tipCredito?: number;
    codCliente?: string;
    monCredito?: number;
    cantCuotas?: number;
    codUsuario?: string;
    codOrigen?: string;
    codPlanInversion?: string;
    codPlazo?: string;
    codActividad?: string;
    codSubactiv?: string;
    codSubsubactividad?: string;
    codTasaInt?: string;
    codTasaMora?: string;
    tipModalidadCobro?: string;
    tipInteres?: string;
    tipCalendario?: number;
    tipCuota?: string;
    plazoCredito?: number;
    tipTasa?: string;
    tasaInteres?: number;
    tasaMora?: number;
    indLinea?: string;
    observaciones?: string;
    codEjecutivo?: string;
    requisitos?: RequisitoRequest[];
}
