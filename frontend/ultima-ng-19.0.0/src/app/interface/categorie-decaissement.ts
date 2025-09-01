export interface CategorieDecaissement {
    code: string;
    libelle: string;
    ordre: number;
}

// Catégories prédéfinies
export const CATEGORIES_DECAISSEMENT: CategorieDecaissement[] = [
    { code: 'ACHAT_MARCHANDISES', libelle: 'Achat marchandises', ordre: 1 },
    { code: 'MAIN_OEUVRE', libelle: "Coût de main d'œuvre", ordre: 2 },
    { code: 'INVESTISSEMENT', libelle: 'Investissement', ordre: 3 },
    { code: 'IMPOTS_TAXES', libelle: 'Impôts et taxes', ordre: 4 },
    { code: 'LOYER', libelle: 'Loyers', ordre: 5 },
    { code: 'UTILITIES', libelle: 'Eau, Électricité, téléphone', ordre: 6 },
    { code: 'TRANSPORT', libelle: 'Transport', ordre: 7 },
    { code: 'SALAIRES', libelle: 'Salaire personnel', ordre: 8 },
    { code: 'FRAIS_TELEPHONE', libelle: 'Frais de téléphone', ordre: 9 },
    { code: 'CHARGES_FINANCIERES', libelle: 'Charges Financières', ordre: 10 },
    { code: 'ENTRETIEN', libelle: 'Entretien et réparation', ordre: 11 },
    { code: 'AUTRES_DEPENSES', libelle: 'Autres dépenses', ordre: 12 }
];
