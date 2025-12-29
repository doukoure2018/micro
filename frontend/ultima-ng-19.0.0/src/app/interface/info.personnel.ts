export interface InfoPersonnelDto {
    id?: number;
    matricule: string;
    nom: string;
    prenom: string;
    numeroCompte?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}
