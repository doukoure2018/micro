export interface DemandeIndividuel {
    demandeindividuel_id?: number;
    nom: string;
    prenom: string;
    telephone: string;
    age: number;
    numeroMembre: string;
    delegation: number;
    agence: number;
    pos: number;
    quartier: string;
    fonction: string;
    createdAt: Date;
    montant: number;
    activite: string;
    statutDemande: string;
    communeResidence: string;
    validationState: string;
    typeApport: string;
    statutSelection: string;
    currentActivite: string;
    raison: string;
    object: string;
    tipCredito: number;
    codUsuarios: string;
}
