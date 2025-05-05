export interface DemandeCredititCompleteDTO {
    // Données du promoteur
    nomPromoteur: string;
    prenomPromoteur: string;
    dateNaissancePromoteur: string; // format 'yyyy-MM-dd'
    numeroIdentitePromoteur: string;
    adressePromoteur: string;
    telephonePromoteur: string;
    emailPromoteur: string;

    // Données de l'entreprise
    nomEntreprise: string;
    formeJuridique: string;
    secteurActivite: string;
    dateCreationEntreprise: string; // format 'yyyy-MM-dd'
    numeroRegistre: string;
    adresseEntreprise: string;
    telephoneEntreprise: string;
    emailEntreprise: string;

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

    // Compte d'exploitation actuel
    dateDebutPeriodeActuel: string; // format 'yyyy-MM-dd'
    dateFinPeriodeActuel: string; // format 'yyyy-MM-dd'
    chiffreAffairesActuel: number;
    coutMarchandisesActuel: number;
    coutTransportProductionActuel: number;
    fraisTransportPersonnelActuel: number;
    fraisManutentionActuel: number;
    montantAideExterneActuel: number;
    fraisHebergementRestaurationActuel: number;
    impotsActuel: number;
    loyersActuel: number;

    // Compte d'exploitation prévisionnel
    dateDebutPeriodePrevisionnel: string; // format 'yyyy-MM-dd'
    dateFinPeriodePrevisionnel: string; // format 'yyyy-MM-dd'
    chiffreAffairesPrevisionnel: number;
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
}
