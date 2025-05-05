export interface Promoteur {
    promoteurId?: number;
    nom: string;
    prenom: string;
    dateNaissance: Date;
    numeroIdentite: string;
    adresse: string;
    telephone: string;
    email: string;
    dateCreation?: Date;
    dateModification?: Date;
}
