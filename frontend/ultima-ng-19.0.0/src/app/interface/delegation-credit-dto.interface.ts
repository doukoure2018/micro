import { DemandeIndividuel } from './demande-individuel.interface';

export interface DelegationCreditDto {
    delegationId: number;
    delegationLibele: string;
    totalDemandes: number;
    montantTotal: number;
    demandes: DemandeIndividuel[];
}
