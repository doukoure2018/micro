import { CreditoDTO } from './credito.histo.model';
import { PlanPagoDTO } from './plan-pago.model';
import { ResumenPlanPagoDTO } from './resumen-plan-pago.model';

export interface CreditosClienteResponseDTO {
    codCliente: string;
    creditos: CreditoDTO[];
    planPagos: PlanPagoDTO[];
    resumenes: ResumenPlanPagoDTO[];
    mensaje: string;
}
