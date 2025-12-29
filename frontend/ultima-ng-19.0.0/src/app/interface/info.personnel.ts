export interface InfoPersonnelDto {
    id?: number;
    matricule: string;
    nom: string;
    prenom: string;
    numeroCompte?: string;
    statut?: 'ACTIVE' | 'INACTIVE';
    createdAt?: Date | string;
    updatedAt?: Date | string;
}
