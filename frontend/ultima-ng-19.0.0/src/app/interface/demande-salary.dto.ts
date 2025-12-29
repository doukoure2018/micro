export interface DemandeSalaryDto {
    id?: number;
    idUser: number;
    matricule: string;
    amount: number;
    numeroCompte?: string;
    statut: 'ENCOURS' | 'ANNULLER' | 'REJET' | 'VALIDER' | 'CONFIRMER';
    createdAt?: any;
    updatedAt?: any;

    // Informations jointes
    nomPersonnel?: string;
    prenomPersonnel?: string;
}

export interface CreateDemandeSalaryRequest {
    matricule: string;
    amount: number;
    numeroCompte?: string;
}
