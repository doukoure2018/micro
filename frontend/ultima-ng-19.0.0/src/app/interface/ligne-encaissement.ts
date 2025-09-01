export interface LigneEncaissement {
    categorie: 'VENTES' | 'AUTRES_REVENUS' | 'PRET';
    libelle: string;
    montant: number;
}
