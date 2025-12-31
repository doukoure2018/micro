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
