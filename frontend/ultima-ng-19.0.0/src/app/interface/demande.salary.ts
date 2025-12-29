export interface DemandeSalaryDto {
    id?: number;
    idUser?: number;
    matricule: string;
    amount: number;
    numeroCompte?: string;
    statut?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;

    // Informations jointes du personnel
    nomPersonnel?: string;
    prenomPersonnel?: string;

    // Informations de l'avance salaire pour validation
    netAmount?: number;
    netAmountLimit?: number;
}

// Statuts possibles
export type DemandeSalaryStatut = 'ENCOURS' | 'ANNULLER' | 'REJET' | 'VALIDER' | 'CONFIRMER';
