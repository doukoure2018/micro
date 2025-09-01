export interface DossierCreditRequest {
    id?: number;
    clientId?: number;
    demandeindividuelId?: number;
    clientNomComplet?: string;
    montantDemande?: number;
    dureeMois?: number;
    tauxInteret?: number;
    dateDemande?: Date | string;
    statut?: string;
    agentId?: string;
    dateCreation?: Date | string;
    dateDerniereModification?: Date | string;

    // Données calculées
    mensualite?: number;
    totalInterets?: number;
    montantTotalAPayer?: number;
}
