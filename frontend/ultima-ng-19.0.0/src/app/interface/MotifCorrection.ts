// Interface pour le motif
export interface MotifCorrection {
    id: number;
    userId: number;
    libele: string;
    codCliente: string;
    codAgence: string;
    statut: string;
    dateAnnulation: string;
    personnePhysiqueId: number;
    createdAt: string;
    updatedAt: string;
}
