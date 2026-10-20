/** Rapport « Indicateurs mensuels » (V167) : ce que renvoie /ecredit/rapports/mensuels. */

export type EtatRapport = 'BROUILLON' | 'SOUMIS' | 'VALIDE' | 'RENVOYE' | 'CONSOLIDE';

export interface RubriqueRapport {
    code: string;
    libelle: string;
    libelleCourt: string;
    ordre: number;
    nature: 'SAISIE' | 'CALCUL';
    format: 'MONTANT' | 'NOMBRE' | 'TAUX';
    formule: string | null;
    controleSaf: boolean;
    sourceSaf: string | null;
    aide: string | null;
}

export interface ValeurRapport {
    valeur: number | null;
    valeurSaf: number | null;
    dateLectureSaf: string | null;
    commentaire: string | null;
    ecart: boolean;
    ecartPct: number | null;
}

export interface LigneRapport {
    id: number;
    codAgencia: string;
    pointService: string;
    agenceId: number | null;
    agence: string | null;
    delegationId: number | null;
    delegation: string | null;
    annee: number;
    mois: number;
    etat: EtatRapport;
    commentaire: string | null;
    saisiPar: string | null;
    dateSaisie: string | null;
    soumisPar: string | null;
    dateSoumission: string | null;
    validePar: string | null;
    dateValidation: string | null;
    renvoyePar: string | null;
    dateRenvoi: string | null;
    motifRenvoi: string | null;
    consolidePar: string | null;
    dateConsolidation: string | null;
    valeurs: Record<string, ValeurRapport>;
    calcules: Record<string, number | null>;
    moisPrecedent: Record<string, number>;
    nbSaisies: number;
    nbManquantes: number;
    nbEcarts: number;
    complet: boolean;
    modifiable: boolean;
}

export interface AgregatRapport {
    niveau: string;
    id: number | null;
    libelle: string;
    parentId: number | null;
    nbPointsService: number;
    nbComplets: number;
    nbSoumis: number;
    nbValides: number;
    nbRenvoyes: number;
    nbConsolides: number;
    nbEcarts: number;
    valeurs: Record<string, number | null>;
    valeursSaf: Record<string, number>;
}

export interface RapportMensuel {
    annee: number;
    mois: number;
    niveau: 'PS' | 'AGENCE' | 'DELEGATION' | 'RESEAU';
    role: string;
    rubriques: RubriqueRapport[];
    lignes: LigneRapport[];
    agences: AgregatRapport[];
    delegations: AgregatRapport[];
    total: AgregatRapport | null;
    peutSaisir: boolean;
    peutValider: boolean;
    peutConsolider: boolean;
    seuilEcartPct: number;
    seuilEcartMontant: number;
    avertissementSaf: string | null;
}

export interface BrouillonRapport {
    valeurs?: Record<string, number | null>;
    commentaires?: Record<string, string | null>;
    commentaire?: string | null;
}

export const MOIS_LIBELLES = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
