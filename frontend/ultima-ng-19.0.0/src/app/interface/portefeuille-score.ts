/** Appréciation des agents de crédit à partir de leur portefeuille (V164, lot 1). */

export type ClasseScore = 'A' | 'B' | 'C' | 'D' | 'NN';

export interface ScoreAgent {
    dateCalcul: string;
    agentUserId: number;
    agentNom: string;
    agentActif?: boolean;
    codAgencia: string;
    pointVente?: string;
    agenceId?: number;
    agence?: string;
    delegationId?: number;
    delegation?: string;
    datePremiereAffectation?: string;
    nbCredits: number;
    encours: number;
    nbEnRetard: number;
    montantRetard: number;
    nbHerites: number;
    par30?: number;
    regularite?: number;
    tauxRetard?: number;
    poidsRetard?: number;
    charge?: number;
    tendance?: number;
    ptsPar30?: number;
    ptsRegularite?: number;
    ptsTauxRetard?: number;
    ptsPoidsRetard?: number;
    ptsCharge?: number;
    ptsTendance?: number;
    pointsDisponibles: number;
    score?: number;
    classe: ClasseScore;
    motifNonNote?: string;
    medianeReseau?: number;
}

export interface SyntheseScore {
    delegationId?: number;
    delegation: string;
    nbAgents: number;
    nbNotes: number;
    nbA: number;
    nbB: number;
    nbC: number;
    nbD: number;
    nbNonNotes: number;
    scoreMoyen?: number;
    par30Moyen?: number;
}

export interface BornesScore {
    par30Mauvais: number;
    regulariteMauvais: number;
    tauxRetardMauvais: number;
    poidsRetardMauvais: number;
    minCredits: number;
    minJoursAffectation: number;
    joursFranchiseHerite: number;
}

export interface Scores {
    dateCalcul?: string;
    peutRecalculer: boolean;
    recalculEnCours?: boolean;
    recalculDepuis?: string | null;
    dernierRecalcul?: string | null;
    reseau: SyntheseScore;
    delegations: SyntheseScore[];
    agents: ScoreAgent[];
    bornes: BornesScore;
}

export interface CreditRetard {
    codAgencia: string;
    numCredito: number;
    codCliente: string;
    nomCliente?: string;
    telephone?: string;
    typeCredit?: string;
    encours: number;
    joursRetard?: number;
    datePremiereImpayee?: string;
    montantRetard: number;
    herite: boolean;
}

export interface FicheAgent {
    score: ScoreAgent;
    scoreMoyenPointService?: number;
    historique: ScoreAgent[];
    creditsEnRetard: CreditRetard[];
}
