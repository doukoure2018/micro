/** « Données SAF au … » : état de l'aiguillage production / sauvegarde (GET /ecredit/portefeuille/donnees-saf). */
export interface DonneesSaf {
    sauvegardeActive: boolean;
    dateDonnees: string | null;
    dateDonneesTexte: string | null;
    mention: string;
    toutOk: boolean;
    dateSonde: string | null;
    enRestauration?: boolean;
    /** Clôture SAF du soir : la production n'accepte plus de lecture en direct, les écrans lisent la sauvegarde. */
    enCloture?: boolean;
    messageInfo?: string | null;
}
