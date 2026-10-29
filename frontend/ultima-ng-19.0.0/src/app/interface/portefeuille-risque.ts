import { CreditSaf } from '@/interface/portefeuille-affectation';

/** Une ligne de ventilation du portefeuille à risque : un produit, un agent, ou les deux. */
export interface LigneRisque {
    cle: string;
    libelle: string;
    tipCredito?: number | null;
    agentUserId?: number | null;
    nonAffecte: boolean;
    disponible?: boolean | null;
    nbCredits: number;
    encours: number;
    nbEnRetard: number;
    impaye: number;
    encoursPar30: number;
    nbPar30: number;
    tauxPar30: number; // en pourcentage
    encoursPar90: number;
    nbPar90: number;
    tauxPar90: number;
    nbContentieuxDeclares: number;
}

export interface PortefeuilleRisque {
    codAgencia: string;
    desAgencia: string;
    dateLecture: string;
    seuilPar30: number;
    seuilPar90: number;
    estAgent: boolean;
    utilisateurId: number;
    total: LigneRisque;
    parProduit: LigneRisque[];
    parAgent: LigneRisque[];
    croisement: LigneRisque[];
}

export interface CreditRisque {
    credit: CreditSaf;
    agentUserId?: number | null;
    agentNom?: string | null;
    contentieuxDeclare: boolean;
}

export const NON_AFFECTE = 'NON_AFFECTE';
export type TrancheRisque = '' | 'retard' | '30' | '90';
