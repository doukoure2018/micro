/** Crédits à solde négatif dans SAF (V177) : page réservée au service DSIG. */

export interface LigneCreditNegatif {
    id: number;
    codAgencia: string;
    desAgencia: string;
    numCredito: number;
    codCliente: string;
    nomCliente: string;
    tipCredito: number | null;
    monCredito: number | null;
    monSaldo: number;
    pireSolde: number;
    fecApertura: string | null;
    indEstado: string | null;
    etat: string;
    codEjecutivo: string | null;
    detecteAt: string | null;
    signaleAt: string | null;
    corrigeAt: string | null;
    traitePar: string | null;
    traiteAt: string | null;
    commentaire: string | null;
    /** Preuve de la correction (V183). */
    verifieSafAt: string | null;
    soldeApres: number | null;
    etatApres: string | null;
    etatApresLibelle: string | null;
    corrigeMode: 'AUTO' | 'MANUEL' | null;
    corrigePar: string | null;
    /**
     * Solde corrigé (V193) : figé au moment de la régularisation, il ne bouge PLUS jamais.
     * `soldeApres`, lui, suit le dernier état lu dans SAF et change à chaque vérification.
     */
    soldeCorrige: number | null;
    soldeCorrigeAt: string | null;
    soldeCorrigeSource: 'SAF' | 'REPRISE' | null;
    /** soldeCorrige − pireSolde : le montant que la régularisation a porté. */
    ecartRegularise: number | null;
    conclusion: 'CORRIGE' | 'CLOS_SAF' | 'TOUJOURS_NEGATIF' | 'ARRONDI' | null;
    conclusionLibelle: string | null;
    joursDepuisPriseEnCharge: number | null;
}

export interface EtatCreditNegatif {
    code: string | null;
    libelle: string;
    nb: number;
    montant: number;
}

export interface SituationCreditsNegatifs {
    nbOuverts: number;
    montantOuvert: number;
    nbNonTraites: number;
    nbCorrigesCeMois: number;
    nbDetectesAujourdhui: number;
    /** Pris en charge depuis plus de sept jours et toujours négatifs. */
    nbPrisEnChargeAnciens: number;
    nbArrondis: number;
    parEtat: EtatCreditNegatif[];
    lignes: LigneCreditNegatif[];
    dernierPassage: string | null;
    message: string | null;
}

/** Le dossier SAF d'un crédit : les cinq tables du script d'extraction de la DSIG. */
export interface DossierCredit {
    codAgencia: string;
    numCredito: number;
    codCliente: string | null;
    idCuenta: string | null;
    fecApertura: string | null;
    dateLecture: string;
    trouve: boolean;
    fiche: Record<string, any> | null;
    echeancier: Record<string, any>[] | null;
    mouvements: Record<string, any>[] | null;
    mouvementsCompte: Record<string, any>[] | null;
    ecritures: Record<string, any>[] | null;
    echeancierComplet: boolean;
    mouvementsComplets: boolean;
    mouvementsCompteComplets: boolean;
    ecrituresCompletes: boolean;
    millisecondes: Record<string, number> | null;
}
