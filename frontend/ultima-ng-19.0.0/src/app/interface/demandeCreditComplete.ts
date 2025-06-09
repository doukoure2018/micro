export interface DemandeCreditCompleteDTO {
    // Données du promoteur
    nomPromoteur: string;
    prenomPromoteur: string;
    dateNaissancePromoteur: string; // format 'yyyy-MM-dd'
    numeroIdentitePromoteur: string;
    adressePromoteur?: string; // Optionnel
    telephonePromoteur?: string; // Optionnel
    emailPromoteur?: string; // Optionnel

    // Données de l'entreprise
    nomEntreprise: string;
    formeJuridique?: string; // Optionnel
    secteurActivite?: string; // Optionnel
    dateCreationEntreprise?: string; // format 'yyyy-MM-dd', optionnel
    numeroRegistre?: string; // Optionnel
    adresseEntreprise?: string; // Optionnel
    telephoneEntreprise?: string; // Optionnel
    emailEntreprise?: string; // Optionnel

    // Bilan de l'entreprise
    liquidites?: number; // Optionnel, défaut 0
    creancesClients?: number; // Optionnel, défaut 0
    valeurStocks?: number; // Optionnel, défaut 0
    valeurEquipements?: number; // Optionnel, défaut 0
    dettesFournisseurs?: number; // Optionnel, défaut 0
    emprunts?: number; // Optionnel, défaut 0
    capitalPropre?: number; // Optionnel, défaut 0

    // Bilan personnel
    epargnes?: number; // Optionnel, défaut 0
    valeurBiensDurables?: number; // Optionnel, défaut 0

    // Compte d'exploitation actuel
    dateDebutPeriodeActuel?: string;
    dateFinPeriodeActuel?: string;
    autresRevenusActuel?: number;
    chiffreAffairesActuel?: number;
    coutMarchandisesActuel?: number; // Optionnel, défaut 0
    coutTransportProductionActuel?: number; // Optionnel, défaut 0
    fraisTransportPersonnelActuel?: number; // Optionnel, défaut 0
    fraisManutentionActuel?: number; // Optionnel, défaut 0
    montantAideExterneActuel?: number; // Optionnel, défaut 0
    fraisHebergementRestaurationActuel?: number; // Optionnel, défaut 0
    impotsActuel?: number; // Optionnel, défaut 0
    loyersActuel?: number; // Optionnel, défaut 0

    // Compte d'exploitation prévisionnel
    dateDebutPeriodePrevisionnel?: string; // format 'yyyy-MM-dd', optionnel
    dateFinPeriodePrevisionnel?: string; // format 'yyyy-MM-dd', optionnel
    chiffreAffairesPrevisionnel?: number; // Optionnel, défaut 0
    autresRevenusPrevisionnel?: number; // Optionnel, défaut 0
    coutMarchandisesPrevisionnel?: number; // Optionnel, défaut 0
    coutTransportProductionPrevisionnel?: number; // Optionnel, défaut 0
    fraisTransportPersonnelPrevisionnel?: number; // Optionnel, défaut 0
    fraisManutentionPrevisionnel?: number; // Optionnel, défaut 0
    montantAideExternePrevisionnel?: number; // Optionnel, défaut 0
    fraisHebergementRestaurationPrevisionnel?: number; // Optionnel, défaut 0
    impotsPrevisionnel?: number; // Optionnel, défaut 0
    loyersPrevisionnel?: number; // Optionnel, défaut 0

    // Demande de crédit (champs obligatoires)
    montantDemande: number;
    dureeMois: number;
    objetFinancement?: string; // Optionnel
}
