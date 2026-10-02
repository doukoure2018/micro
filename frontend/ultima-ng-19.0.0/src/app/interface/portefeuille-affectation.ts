/** Affectation des crédits SAF aux agents de crédit (V159). SAF fournit les encours, digi porte qui en répond. */

/** Crédit SAF tel que renvoyé par le portefeuille (contrat ebanking). */
export interface CreditSaf {
    codAgencia: string;
    desAgencia?: string;
    numCredito: number;
    codCliente: string;
    nomCliente?: string;
    tipCredito?: number;
    desTipCredito?: string;
    indEstado?: string;
    telPrincipal?: string;
    telSecundario?: string;
    telOtro?: string;
    monCredito?: number;
    monSaldo?: number;
    monCuota?: number;
    cantCuotas?: number;
    fecApertura?: string;
    fecVencimiento?: string;
    prochaineEcheance?: string;
    datPremiereImpayee?: string;
    mntCapImpaye?: number;
    mntIntImpaye?: number;
    nbEchPayees?: number;
    nbEchImpayees?: number;
    nbEchRestantes?: number;
    joursRetard?: number;
    usagerMiseEnPlace?: string;
    codGestionnaireSaf?: string;
    nomGestionnaireSaf?: string;
    statutGestionnaireSaf?: string; // A actif, I inactif
}

export interface Affectation {
    id: number;
    codAgencia: string;
    numCredito: number;
    codCliente?: string;
    agentUserId: number;
    agentNom?: string;
    agentActif?: boolean;
    agentCodAgencia?: string;
    affecteParUserId?: number;
    affecteParNom?: string;
    dateAffectation: string;
    dateFin?: string;
    finParUserId?: number;
    finParNom?: string;
    motif?: string;
    motifFin?: string;
    actif: boolean;
}

export interface CreditAffecte {
    credit: CreditSaf;
    affectation?: Affectation | null;
    aReaffecter: boolean;
    motifReaffectation?: string;
}

export interface AgentPortefeuille {
    userId: number;
    nom: string;
    email?: string;
    disponible: boolean;
    nbCredits: number;
    encours: number;
    nbEnRetard: number;
}

export interface IndicateursAffectation {
    nbCredits: number;
    encours: number;
    nbAffectes: number;
    nbNonAffectes: number;
    encoursNonAffecte: number;
    nbAReaffecter: number;
}

export interface PortefeuilleAffectation {
    codAgencia: string;
    desAgencia?: string;
    peutAffecter: boolean;
    utilisateurId: number;
    role: string;
    indicateurs: IndicateursAffectation;
    agents: AgentPortefeuille[];
    credits: CreditAffecte[];
}

/** Une ligne de la synthèse par point de service (DA, DR, DE, DG). */
export interface SynthesePointService {
    codAgencia: string;
    pointVente?: string;
    agenceId?: number;
    agence?: string;
    delegationId?: number;
    delegation?: string;
    nbCredits: number;
    encours: number;
    nbEnRetard: number;
    encoursPar30: number;
    encoursPar90: number;
    nbAffectes: number;
    nbNonAffectes: number;
    nbAReaffecter: number;
    nbAgents: number;
    tauxAffectation: number;
}

export interface AffectationRequest {
    codAgencia: string;
    numCreditos: number[];
    agentUserId: number;
    motif?: string;
}

export interface DesaffectationRequest {
    codAgencia: string;
    numCreditos: number[];
    motif?: string;
}
