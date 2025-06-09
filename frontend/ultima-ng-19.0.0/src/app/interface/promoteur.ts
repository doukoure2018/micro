export interface Promoteur {
    promoteurId?: number;
    nom: string;
    prenom: string;
    date_naissance: Date;
    numero_identite: string;
    adresse: string;
    telephone: string;
    email: string;
    dateCreation?: Date;
    dateModification?: Date;
}
