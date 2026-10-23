/** « Données SAF au … » : état de l'aiguillage production / sauvegarde (GET /ecredit/portefeuille/donnees-saf). */
export interface DonneesSaf {
    sauvegardeActive: boolean;
    dateDonnees: string | null;
    dateDonneesTexte: string | null;
    mention: string;
    toutOk: boolean;
    dateSonde: string | null;
    enRestauration?: boolean;
    messageInfo?: string | null;
}
