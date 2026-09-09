export interface InfoPersonnelDto {
    id?: number;
    matricule: string;
    nom: string;
    prenom: string;
    numeroCompte?: string;
    statut?: 'ACTIVE' | 'INACTIVE';
    badgeSiege?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}
