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
    parEtat: EtatCreditNegatif[];
    lignes: LigneCreditNegatif[];
    dernierPassage: string | null;
    message: string | null;
}
