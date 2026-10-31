/**
 * La page « Comptes mal adossés » (V196, lot 2).
 *
 * Le compte de remboursement d'un crédit SAF doit être un compte courant (014) ou d'épargne
 * (011) du client lui-même, et actif : c'est de lui que SAF prélève l'échéance. Les compteurs
 * portent sur la totalité du stock, la liste sur ce que le filtre retient.
 */

export type FamilleAnomalie = 'PAS_DE_COMPTE' | 'COMPTE_INEXISTANT' | 'COMPTE_AUTRE_CLIENT' | 'COMPTE_NON_ACTIF' | 'TYPE_NON_AUTORISE';

export interface LigneCompteMalAdosse {
    id: number;
    codAgencia: string | null;
    desAgencia: string | null;
    numCredito: number;
    codCliente: string | null;
    nomCliente: string | null;
    tipCredito: number | null;
    monCredito: number | null;
    monSaldo: number | null;
    fecApertura: string | null;
    fecVencimiento: string | null;
    indEstado: string | null;
    etat: string | null;
    idCuenta: string | null;
    typeCompte: string | null;
    famille: FamilleAnomalie | string;
    familleLibelle: string | null;
    compteClient: string | null;
    compteAgencia: string | null;
    compteEtat: string | null;
    compteSolde: number | null;
    saisiPar: string | null;
    dateSaisie: string | null;
    agentCredit: string | null;
    detecteAt: string | null;
    dernierVuAt: string | null;
    familleChangeeAt: string | null;
    signaleAt: string | null;
    corrigeAt: string | null;
    compteALaCorrection: string | null;
    familleALaCorrection: string | null;
    traitePar: string | null;
    traiteAt: string | null;
    commentaire: string | null;
    joursDepuisPriseEnCharge: number | null;
    aTraiter: boolean;
}

export interface CompteurAnomalie {
    cle: string;
    libelle: string;
    nb: number;
    nbVivants: number;
    nbATraiter: number;
    encours: number | null;
}

export interface SituationComptesMalAdosses {
    nbOuvertes: number;
    encoursOuvert: number | null;
    nbVivantes: number;
    nbATraiter: number;
    nbPrisesEnCharge: number;
    nbCorrigeesCeMois: number;
    nbDetecteesAujourdhui: number;
    nbPrisesEnChargeAnciennes: number;
    parFamille: CompteurAnomalie[];
    parAgence: CompteurAnomalie[];
    parUsager: CompteurAnomalie[];
    lignes: LigneCompteMalAdosse[];
    nbLignesFiltrees: number;
    tronquee: boolean;
    dernierPassage: string | null;
    message: string | null;
}

export interface FiltresComptesMalAdosses {
    famille: string | null;
    etat: string | null;
    agence: string | null;
    saisiPar: string | null;
    recherche: string | null;
    inclureCorriges: boolean;
    tout: boolean;
}
