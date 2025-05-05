export interface DemandeCredit {
    demandeCreditId: number;
    entrepriseId: number;
    dateDemande: string;
    montantDemande: number;
    dureeMois: number;
    tauxInteret: number;
    objetFinancement: string;
    statut: string;
    dateEnregistrement: string;
    dateModification: string;
}
