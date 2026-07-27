export interface ArreteCaisse {
    id: number;
    idUser: number;
    montant: number;
    statut: 'ENCOURS' | 'VALIDE';
    dateArreteCaisse: string | number[];
    dateRemonte: string | number[] | null;
    document: string | null;
    delegationId: number | null;
    agenceId: number | null;
    pointventeId: number | null;
    createdAt: string | number[];
    updatedAt: string | number[];

    // Joined fields
    nomUser: string | null;
    prenomUser: string | null;
    delegationNom: string | null;
    agenceNom: string | null;
    pointventeNom: string | null;
}

export interface ArreteCaisseStats {
    ENCOURS?: { count: number; total: number };
    VALIDE?: { count: number; total: number };
}

export type EtatPointVente = 'A_JOUR' | 'A_VALIDER' | 'EN_RETARD' | 'JAMAIS_REMONTE';

export interface SituationPointVente {
    pointventeId: number;
    pointventeNom: string | null;
    pointventeCode: string | null;
    agenceId: number | null;
    agenceNom: string | null;
    delegationId: number | null;
    delegationNom: string | null;

    // Dernier arrêté connu (null si jamais remonté)
    arreteId: number | null;
    montant: number | null;
    statut: 'ENCOURS' | 'VALIDE' | null;
    dateArreteCaisse: string | number[] | null;
    dateRemonte: string | number[] | null;
    document: string | null;
    nomUser: string | null;
    prenomUser: string | null;

    etat: EtatPointVente;
    joursRetard: number | null;
}
