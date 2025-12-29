export interface AvanceSalaireDto {
    id?: number;
    idUser?: number;
    idPersonnel?: number;
    matricule: string;
    netAmount: number;
    netAmountLimit?: number;
    statut?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;

    // Informations jointes du personnel
    nomPersonnel?: string;
    prenomPersonnel?: string;
    numeroCompte?: string;
}
