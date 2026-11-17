/**
 * La page « Comptes hors agence » (V214, lot 2).
 *
 * Un compte dont l'agence n'est pas celle des trois premiers chiffres du numéro de membre a été
 * ouvert ailleurs, et l'usager SAF qui l'a ouvert est connu. Les compteurs portent sur la
 * totalité du stock, la liste sur ce que le filtre retient.
 */

export type SituationHorsAgence = 'AGENT_CHEZ_LUI' | 'AGENT_DU_CLIENT' | 'TROIS_AGENCES' | 'AGENT_SANS_AGENCE';

export interface LigneCompteHorsAgence {
    id: number;
    numCuenta: string;
    typeCompte: string | null;
    intitule: string | null;
    codCliente: string | null;
    nomCliente: string | null;
    agenceClient: string | null;
    agenceClientFiche: string | null;
    agenceCompte: string | null;
    desAgenceCompte: string | null;
    creePar: string | null;
    /** Le nom derrière le code SAF ; vide si le code ne correspond à aucun usager. */
    nomCreePar: string | null;
    /** null = inconnue (administrateur, siège). */
    agenceAgent: string | null;
    situation: SituationHorsAgence | string;
    situationLibelle: string | null;
    dateOuverture: string | null;
    /** Code SAF brut : A actif, autre = fermé, bloqué ou transféré. */
    etatCompte: string | null;
    etat: string | null;
    solde: number | null;
    verifieSafAt: string | null;
    verificationConclusion: string | null;
    verificationLibelle: string | null;
    fermetureMotif: string | null;
    detecteAt: string | null;
    dernierVuAt: string | null;
    situationChangeeAt: string | null;
    signaleAt: string | null;
    corrigeAt: string | null;
    etatALaCorrection: string | null;
    agenceALaCorrection: string | null;
    traitePar: string | null;
    traiteAt: string | null;
    commentaire: string | null;
    joursDepuisPriseEnCharge: number | null;
    aTraiter: boolean;
}

export interface CompteurHorsAgence {
    cle: string;
    libelle: string;
    nb: number;
    nbActifs: number;
    nbATraiter: number;
    solde: number | null;
}

export interface SituationComptesHorsAgence {
    nbOuverts: number;
    soldeOuvert: number | null;
    nbActifs: number;
    nbATraiter: number;
    nbPrisesEnCharge: number;
    nbCorrigesCeMois: number;
    nbDetectesAujourdhui: number;
    nbPrisesEnChargeAnciennes: number;
    parSituation: CompteurHorsAgence[];
    parAgenceAgent: CompteurHorsAgence[];
    parUsager: CompteurHorsAgence[];
    lignes: LigneCompteHorsAgence[];
    nbLignesFiltrees: number;
    tronquee: boolean;
    dernierPassage: string | null;
    message: string | null;
}

export interface FiltresComptesHorsAgence {
    situation: string | null;
    etat: string | null;
    agence: string | null;
    agenceAgent: string | null;
    creePar: string | null;
    recherche: string | null;
    inclureCorriges: boolean;
    tout: boolean;
}

/** Le compte tel que SAF le porte à l'instant. */
export interface CompteHorsAgenceSaf {
    numCuenta: string | null;
    typeCompte: string | null;
    intitule: string | null;
    codCliente: string | null;
    nomCliente: string | null;
    agenceClient: string | null;
    agenceClientFiche: string | null;
    agenceCompte: string | null;
    desAgenceCompte: string | null;
    creePar: string | null;
    nomCreePar: string | null;
    agenceAgent: string | null;
    dateOuverture: string | null;
    etatCompte: string | null;
    solde: number | null;
    situation: string | null;
}

export interface VerificationHorsAgence {
    id: number;
    conclusion: 'CORRIGE' | 'TRANSFERT' | 'TOUJOURS_HORS_AGENCE' | string;
    ferme: boolean;
    situation: string | null;
    etatCompte: string | null;
    agenceCompte: string | null;
    agenceClientFiche: string | null;
    explication: string | null;
}

/** Ce que SAF dit à l'instant d'un compte connu : la ligne du journal et le compte réel. */
export interface DossierCompteHorsAgence {
    ligne: LigneCompteHorsAgence;
    actuel: CompteHorsAgenceSaf | null;
    conclusion: string | null;
    explication: string | null;
    existeEncore: boolean;
}
