export interface Entreprise {
    entrepriseId?: number;
    promoteurId: number;
    nom: string;
    formeJuridique: string;
    secteurActivite: string;
    dateCreation: Date;
    numeroRegistre: string;
    adresse: string;
    telephone: string;
    email: string;
    dateEnregistrement?: Date;
    dateModification?: Date;
}
