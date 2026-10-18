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
    /** CREDIT (agent de crédit) ou CONTENTIEUX (agent de recouvrement de l'agence) */
    typeAffectation?: 'CREDIT' | 'CONTENTIEUX';
}

/** Catégorie de gestion dérivée de IND_ESTADO (règle DSIG du 07/10/2026). */
export type CategorieCredit = 'EN_COURS' | 'CONTENTIEUX' | 'APURE';

export interface CreditAffecte {
    credit: CreditSaf;
    affectation?: Affectation | null;
    aReaffecter: boolean;
    motifReaffectation?: string;
    categorie: CategorieCredit;
    categorieLibelle: string; // « En cours », « Contentieux », « Apuré »
    affectable: boolean; // seuls les crédits en cours peuvent être confiés à un agent
    /** Dossier au contentieux : confiable à un agent portant la fonction contentieux */
    affectableContentieux: boolean;
    /** Le DA peut encore le passer au contentieux (ni déjà contentieux, ni apuré) */
    declarableContentieux: boolean;
    /** Passage au contentieux déclaré dans digi, null sinon */
    contentieux?: ContentieuxDeclare | null;
    /** Agent de recouvrement qui en répond, null sinon */
    affectationContentieux?: Affectation | null;
}

/** Passage au contentieux déclaré par le DA dans digi (V166) : SAF n'est pas modifié. */
export interface ContentieuxDeclare {
    id: number;
    codAgencia: string;
    numCredito: number;
    codCliente?: string;
    declareParUserId: number;
    declareParNom?: string;
    dateDeclaration: string;
    motif?: string;
}

export interface AgentPortefeuille {
    userId: number;
    nom: string;
    email?: string;
    disponible: boolean;
    nbCredits: number;
    encours: number;
    nbEnRetard: number;
    /** Capital + intérêts impayés de ses crédits en retard */
    montantRetard: number;
}

/** nbCredits, encours et les compteurs d'affectation ne portent que sur les crédits EN COURS. */
export interface IndicateursAffectation {
    nbCredits: number;
    encours: number;
    nbAffectes: number;
    nbNonAffectes: number;
    encoursNonAffecte: number;
    nbAReaffecter: number;
    nbApures: number;
    encoursApure: number;
    nbContentieux: number;
    encoursContentieux: number;
    nbContentieuxAffectes: number;
    nbContentieuxNonAffectes: number;
    nbContentieuxDeclares: number;
    encoursContentieuxDeclare: number;
}

export interface PortefeuilleAffectation {
    codAgencia: string;
    desAgencia?: string;
    peutAffecter: boolean;
    utilisateurId: number;
    role: string;
    indicateurs: IndicateursAffectation;
    agents: AgentPortefeuille[];
    /** Agents de l'agence portant la fonction contentieux, avec leur charge */
    agentsContentieux: AgentPortefeuille[];
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
    nbApures: number;
    encoursApure: number;
    nbContentieux: number;
    encoursContentieux: number;
}

/** Une ligne de la liste du contentieux (V166). */
export interface ContentieuxLigne {
    codAgencia: string;
    pointVente?: string;
    agence?: string;
    numCredito: number;
    codCliente: string;
    nomCliente?: string;
    /** Premier numéro renseigné, conservé pour compatibilité ; préférer les trois numéros SAF. */
    telephone?: string;
    telPrincipal?: string;
    telSecundario?: string;
    telOtro?: string;
    typeCredit?: string;
    encours: number;
    joursRetard?: number;
    montantRetard: number;
    /** SAF (passé au judiciaire par la banque) ou AGENCE (déclaré par le DA) */
    origine: 'SAF' | 'AGENCE';
    dateDeclaration?: string;
    declareParNom?: string;
    motif?: string;
    agentRecouvrementId?: number;
    agentRecouvrementNom?: string;
    agentCreditNom?: string;
}

export interface ContentieuxListe {
    lignes: ContentieuxLigne[];
    agents: AgentPortefeuille[];
    peutAffecter: boolean;
}

export interface AffectationRequest {
    codAgencia: string;
    numCreditos: number[];
    agentUserId: number;
    motif?: string;
    typeAffectation?: 'CREDIT' | 'CONTENTIEUX';
}

export interface DesaffectationRequest {
    codAgencia: string;
    numCreditos: number[];
    motif?: string;
    typeAffectation?: 'CREDIT' | 'CONTENTIEUX';
}
