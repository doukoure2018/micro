interface ElementModification {
    id: string;
    sectionType: string;
    champNom: string;
    champLibelle?: string;
    valeurActuelle?: number;
    valeurSuggeree: number;
    justification?: string;
    obligatoire: boolean;
    typeModification: 'CORRECTION' | 'AJUSTEMENT' | 'MISE_A_JOUR';
}
