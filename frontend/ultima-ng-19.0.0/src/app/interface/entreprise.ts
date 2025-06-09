export interface Entreprise {
    entrepriseId?: number;
    promoteurId: number;
    nom: string;
    forme_juridique: string;
    secteur_activite: string;
    date_creation: Date;
    numero_registre: string;
    adresse: string;
    telephone: string;
    email: string;
    dateEnregistrement?: Date;
    dateModification?: Date;
}
