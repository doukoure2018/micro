interface DemandeModificationDto {
    demandeCreditId: number;
    managerUserId: number;
    agentUserId: number;
    motif: string;
    justification?: string;
    priorite: 'URGENTE' | 'HAUTE' | 'NORMALE' | 'BASSE';
    dateLimite?: string;
    commentaireManager?: string;
    elements: ElementModification[];
}
