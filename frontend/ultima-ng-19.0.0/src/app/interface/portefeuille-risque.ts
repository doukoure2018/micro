import { CreditSaf } from '@/interface/portefeuille-affectation';

/**
 * Une ligne de ventilation du portefeuille à risque : un produit, une famille, un agent, un
 * croisement agent × produit, ou un niveau de la hiérarchie (délégation, agence, point de service).
 */
export interface LigneRisque {
    cle: string;
    libelle: string;
    tipCredito?: number | null;
    famille?: string | null;
    libelleCourt?: string | null;
    produit?: string | null;
    agentUserId?: number | null;
    nonAffecte: boolean;
    disponible?: boolean | null;
    niveau?: 'DELEGATION' | 'AGENCE' | 'PS' | null;
    id?: number | null;
    code?: string | null;
    rattachement?: string | null;
    nbPointsService?: number | null;
    nbCredits: number;
    encours: number;
    nbEnRetard: number;
    impaye: number;
    encoursPar30: number;
    nbPar30: number;
    tauxPar30: number; // en pourcentage
    encoursPar60: number;
    nbPar60: number;
    tauxPar60: number;
    encoursPar90: number;
    nbPar90: number;
    tauxPar90: number;
    encoursPar120: number;
    nbPar120: number;
    tauxPar120: number;
    nbContentieuxDeclares: number;
    seuilPar30?: number | null; // seuil propre à la famille, sinon le seuil général
    seuilPar90?: number | null;
}

/** Un point de service lu en direct (lot 1). */
export interface PortefeuilleRisque {
    codAgencia: string;
    desAgencia: string;
    dateLecture: string;
    seuilPar30: number;
    seuilPar90: number;
    estAgent: boolean;
    peutParametrer: boolean;
    utilisateurId: number;
    total: LigneRisque;
    parProduit: LigneRisque[];
    parFamille: LigneRisque[];
    parAgent: LigneRisque[];
    croisement: LigneRisque[];
}

/** Un périmètre (lot 2) : produit en direct, agents par la photo du matin. */
export interface RisqueReseau {
    niveau: 'delegation' | 'agence' | 'ps';
    niveaux: string[];
    agenceId?: number | null;
    agence?: string | null;
    delegationId?: number | null;
    delegation?: string | null;
    nbPointsService: number;
    dateLecture: string;
    datePhoto?: string | null;
    photoEnCours: boolean;
    seuilPar30: number;
    seuilPar90: number;
    peutParametrer: boolean;
    peutPhotographier: boolean;
    total: LigneRisque;
    parNiveau: LigneRisque[];
    parProduit: LigneRisque[];
    parFamille: LigneRisque[];
    parAgent: LigneRisque[];
}

export interface CreditRisque {
    credit: CreditSaf;
    agentUserId?: number | null;
    agentNom?: string | null;
    contentieuxDeclare: boolean;
}

/** Un type de crédit SAF et la famille que la Direction de l'exploitation lui a donnée. */
export interface FamilleProduit {
    tipCredito: number;
    libelleSaf?: string | null;
    famille?: string | null;
    libelleCourt?: string | null;
    seuilPar30?: number | null;
    seuilPar90?: number | null;
    nbCredits: number;
    encours: number;
    modifiePar?: string | null;
    modifieLe?: string | null;
}

export const NON_AFFECTE = 'NON_AFFECTE';
export type TrancheRisque = '' | 'retard' | '30' | '60' | '90' | '120';

/** Familles proposées à la Direction de l'exploitation ; la saisie reste libre. */
export const FAMILLES_PROPOSEES = ['Agricole et campagne', 'Trésorerie et commerce', 'Équipement', 'Habitat', 'Consommation et salariés', 'Groupe et solidaire', 'Autres'];
