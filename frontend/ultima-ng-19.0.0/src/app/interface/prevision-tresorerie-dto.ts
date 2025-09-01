// DTOs pour les prévisions de trésorerie

export interface ClientDto {
    id?: number;
    nom: string;
    prenom: string;
    adresse?: string;
    telephone?: string;
    email?: string;
    typeActivite?: string;
    numeroIdentite?: string;
    numeroRegistreCommerce?: string;
    secteurActivite?: string;
    anneesExperience?: number;
    actif?: boolean;
    dateCreation?: Date | string;
    dateDerniereModification?: Date | string;
}

export interface DossierCreditDto {
    id?: number;
    clientId: number;
    clientNomComplet?: string;
    montantDemande: number;
    dureeMois: number;
    tauxInteret: number;
    dateDemande?: Date | string;
    statut?: string;
    agentId?: string;
    dateCreation?: Date | string;
    dateDerniereModification?: Date | string;
    mensualite?: number;
    totalInterets?: number;
    montantTotalAPayer?: number;
}

export interface PrevisionTresorerieDto {
    id?: number;
    dossierId: number;
    numeroMois: number;
    soldeDebut: number;
    soldeFin: number;
    totalEncaissements: number;
    totalDecaissements: number;
    excedentDeficit: number;
    lignesEncaissement?: LigneEncaissementDto[];
    lignesDecaissement?: LigneDecaissementDto[];
    disponibleEnCaisse?: number;
    tauxCouverture?: number;
}

export interface LigneEncaissementDto {
    id?: number;
    previsionId?: number;
    categorie: string;
    libelle: string;
    montant: number;
    ordre?: number;
}

export interface LigneDecaissementDto {
    id?: number;
    previsionId?: number;
    categorie: string;
    libelle: string;
    montant: number;
    ordre?: number;
}

export interface AnalyseCreditDto {
    id?: number;
    dossierId: number;
    capaciteRemboursement: number;
    ratioEndettement: number;
    scoreCredit: number;
    recommandation: string;
    commentaires?: string;
    niveauRisque?: string;
    risquesIdentifies?: string;
    dateAnalyse?: Date | string;
    analysteId?: string;
    ratiosDetailles?: RatiosFinanciersDto;
    capaciteDetaille?: CapaciteRemboursementDto;
}

export interface RatiosFinanciersDto {
    ratioLiquiditeGenerale?: number;
    ratioLiquiditeImmediate?: number;
    ratioEndettement?: number;
    ratioCouvertureDette?: number;
    margeNette?: number;
    roiPrevisionnel?: number;
    rotationStock?: number;
    delaiRecouvrementMoyen?: number;
    fondsRoulement?: number;
    besoinFondsRoulement?: number;
    tresorerieNette?: number;
}

export interface CapaciteRemboursementDto {
    dossierId: number;
    excedentMoyenMensuel: number;
    mensualiteCredit: number;
    ratioCouverture: number;
    margeSecurity: number;
    analyseParMois?: PeriodeAnalyseDto[];
    capaciteSuffisante?: boolean;
    evaluation?: string;
    pointsAttention?: string[];
    recommandations?: string[];
}

export interface PeriodeAnalyseDto {
    mois: number;
    excedent: number;
    ratio: number;
    statut: string;
}

export interface RemboursementDto {
    id?: number;
    dossierId: number;
    numeroEcheance: number;
    montantCapital: number;
    montantInteret: number;
    montantTotal: number;
    dateEcheance: Date | string;
    datePaiement?: Date | string;
    statut: string;
    joursRetard?: number;
    penalites?: number;
}

export interface CategorieDto {
    id?: number;
    code: string;
    libelle: string;
    type?: string;
    ordreAffichage?: number;
    actif?: boolean;
}

export interface ImportResultDto {
    success: boolean;
    totalLignes: number;
    lignesImportees: number;
    lignesEnErreur: number;
    erreurs?: string[];
    erreursValidation?: ValidationErrorDto[];
}

export interface ValidationErrorDto {
    ligne: number;
    champ: string;
    valeur: string;
    message: string;
}

export interface DashboardStatsDto {
    totalClients: number;
    clientsActifs: number;
    nouveauxClientsMois: number;
    totalDossiers: number;
    dossiersEnCours: number;
    dossiersApprouves: number;
    dossiersRejetes: number;
    montantTotalDemande: number;
    montantTotalApprouve: number;
    montantTotalDecaisse: number;
    montantTotalRembourse: number;
    tauxApprobation: number;
    tauxDefaut: number;
    ratioRecouvrementMoyen: number;
    delaiMoyenTraitement: number;
    nombreAnalysesJour: number;
}

export interface StatsMensuelsDto {
    annee: number;
    mois: number;
    moisLibelle: string;
    nombreDossiers: number;
    nombreApprobations: number;
    nombreRejets: number;
    montantDemande: number;
    montantApprouve: number;
    montantDecaisse: number;
    tauxApprobation: number;
    ticketMoyen: number;
}

export interface TopClientDto {
    clientId: number;
    nomComplet: string;
    typeActivite?: string;
    nombreDossiers: number;
    montantTotal: number;
    montantRembourse: number;
    tauxRemboursement: number;
    categorieClient?: string;
    rang: number;
}
