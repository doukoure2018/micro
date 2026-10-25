/**
 * État du jour de la plateforme (lot 3) : ce que le poste de supervision affiche au-dessus du
 * baromètre d'usage. Tout vient des journaux déjà écrits ; l'apport est de dire ce qui n'a PAS
 * tourné, ce que le journal seul ne pouvait pas montrer.
 */
export interface TravailDuJour {
    code: string;
    libelle: string;
    attendu: string;
    /** A_VENIR, FAIT, INCOMPLET, ECHEC, MANQUANT, PAS_ATTENDU */
    etat: string;
    quand: string | null;
    dureeMs: number | null;
    message: string | null;
    executions: number;
    echecs: number;
    passagesAttendus?: number;
    passagesFaits?: number;
    dernierConnu?: string | null;
}

export interface EnvoiDuJour {
    type: string;
    libelle: string;
    envois: number;
    destinataires: number;
    sujets: number;
    doublons: number;
    anormal: boolean;
    premier: string | null;
    dernier: string | null;
}

export interface EtatDuJour {
    jour: string;
    heure: string;
    travaux: TravailDuJour[];
    travauxManquants: number;
    travauxEnEchec: number;
    envois: EnvoiDuJour[];
    envoisDoublons: number;
    saf: {
        mention: string;
        joignable: boolean;
        enRestauration: boolean;
        sauvegardeActive: boolean;
        dateDonneesTexte: string;
    };
    anomalies: {
        creditsNegatifsOuverts: number;
        creditsNegatifsDuJour: number;
        contactsEnEchec: number;
        correctionsEnAttente: number;
        dossiersSansTitulaire: number;
    };
    credit: {
        enCours: number;
        enCorrection: number;
        enAttenteDa: number;
        annulationsDemandees: number;
        validesAujourdhui: number;
        creesAujourdhui: number;
    };
    connexions: number;
}
