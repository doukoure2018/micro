import { Personnecaution } from './personnecaution';

export interface DemandeCreditCompleteDTO {
    // Données du promoteur
    nomPromoteur: string;
    prenomPromoteur: string;
    dateNaissancePromoteur: string; // Always format as 'yyyy-MM-dd'
    numeroIdentitePromoteur: string;
    adressePromoteur?: string;
    telephonePromoteur?: string;
    emailPromoteur?: string;

    // Données de l'entreprise
    nomEntreprise: string;
    formeJuridique?: string;
    secteurActivite?: string;
    dateCreationEntreprise: string; // Always format as 'yyyy-MM-dd'
    numeroRegistre?: string;
    adresseEntreprise?: string;
    telephoneEntreprise?: string;
    emailEntreprise?: string;

    // Bilan de l'entreprise
    liquidites: number;
    creancesClients: number;
    valeurStocks: number;
    valeurEquipements: number;
    dettesFournisseurs: number;
    emprunts: number;
    capitalPropre: number;

    // Bilan personnel
    epargnes: number;
    valeurBiensDurables: number;
    libeleGarantie?: string;
    montantGarantie: number;

    // Compte d'exploitation actuel - REQUIRED DATES
    dateDebutPeriodeActuel: string; // REQUIRED - format 'yyyy-MM-dd'
    dateFinPeriodeActuel: string; // REQUIRED - format 'yyyy-MM-dd'
    chiffreAffairesActuel: number;
    autresRevenusActuel: number;
    coutMarchandisesActuel: number;
    coutTransportProductionActuel: number;
    fraisTransportPersonnelActuel: number;
    fraisManutentionActuel: number;
    montantAideExterneActuel: number;
    fraisHebergementRestaurationActuel: number;
    impotsActuel: number;
    loyersActuel: number;

    // Compte d'exploitation prévisionnel - REQUIRED DATES
    dateDebutPeriodePrevisionnel: string; // REQUIRED - format 'yyyy-MM-dd'
    dateFinPeriodePrevisionnel: string; // REQUIRED - format 'yyyy-MM-dd'
    chiffreAffairesPrevisionnel: number;
    autresRevenusPrevisionnel: number;
    coutMarchandisesPrevisionnel: number;
    coutTransportProductionPrevisionnel: number;
    fraisTransportPersonnelPrevisionnel: number;
    fraisManutentionPrevisionnel: number;
    montantAideExternePrevisionnel: number;
    fraisHebergementRestaurationPrevisionnel: number;
    impotsPrevisionnel: number;
    loyersPrevisionnel: number;

    // Demande de crédit
    montantDemande: number;
    dureeMois: number;
    objetFinancement: string;

    // Personnecautions
    personnecautions?: Personnecaution[];

    // Location and user fields - ensure they're numbers
    delegationId?: number;
    agenceId?: number;
    pointVenteId?: number;
    userId: number; // This should NOT be optional
}
