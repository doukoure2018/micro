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
    /** V168 : section du bloc, périodicité (MENSUEL, TRIMESTRIEL, OUVERTURE), agrégat annuel, sous-groupe. */
    section: string | null;
    periodicite: 'MENSUEL' | 'TRIMESTRIEL' | 'OUVERTURE';
    agregatAnnuel: 'SOMME' | 'MOYENNE' | 'DERNIER' | 'AUCUN';
    groupe: string | null;
}

export type ModuleRapport = 'MENSUEL' | 'ACTIVITE';

export interface SectionRapport {
    code: string;
    libelle: string;
    ordre: number;
    orientation: 'MOIS_LIGNES' | 'MOIS_COLONNES' | 'TRIMESTRE' | 'INSTANTANE';
    periodicite: 'MENSUEL' | 'TRIMESTRIEL';
    libelleAnnuel: string | null;
    note: string | null;
}

/** Un exercice d'un point de service (ou le total d'une agence) : mois par mois, puis l'annuel. */
export interface AnnuelRapport {
    module: ModuleRapport;
    annee: number;
    codAgencia: string | null;
    libelle: string;
    agence: string | null;
    delegation: string | null;
    nbPointsService: number;
    parMois: Record<number, Record<string, number | null>>;
    annuel: Record<string, number | null>;
    etats: Record<number, string | null>;
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
    module: ModuleRapport;
    annee: number;
    mois: number;
    sections: SectionRapport[];
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
