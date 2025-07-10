import { Personnecaution } from './personnecaution';

export interface DemandeUpdateRequest {
    // ID de la demande
    demandeCreditId: number;

    // Promoteur
    nomPromoteur: string;
    prenomPromoteur: string;
    dateNaissancePromoteur: string; // Format: yyyy-MM-dd
    numeroIdentitePromoteur: string;
    adressePromoteur?: string;
    telephonePromoteur?: string;
    emailPromoteur?: string;

    // Entreprise
    nomEntreprise: string;
    formeJuridique?: string;
    secteurActivite?: string;
    dateCreationEntreprise?: string; // Format: yyyy-MM-dd
    numeroRegistre?: string;
    adresseEntreprise?: string;
    telephoneEntreprise?: string;
    emailEntreprise?: string;

    // Bilan entreprise
    liquidites?: number;
    creancesClients?: number;
    valeurStocks?: number;
    valeurEquipements?: number;
    dettesFournisseurs?: number;
    emprunts?: number;
    capitalPropre?: number;

    // Bilan personnel
    epargnes?: number;
    valeurBiensDurables?: number;

    // Compte exploitation actuel
    dateDebutPeriodeActuel?: string; // Format: yyyy-MM-dd
    dateFinPeriodeActuel?: string; // Format: yyyy-MM-dd
    chiffreAffairesActuel?: number;
    coutMarchandisesActuel?: number;
    coutTransportProductionActuel?: number;
    fraisTransportPersonnelActuel?: number;
    fraisManutentionActuel?: number;
    montantAideExterneActuel?: number;
    fraisHebergementRestaurationActuel?: number;
    impotsActuel?: number;
    loyersActuel?: number;

    // Compte exploitation prévisionnel
    dateDebutPeriodePrevisionnel?: string; // Format: yyyy-MM-dd
    dateFinPeriodePrevisionnel?: string; // Format: yyyy-MM-dd
    chiffreAffairesPrevisionnel?: number;
    coutMarchandisesPrevisionnel?: number;
    coutTransportProductionPrevisionnel?: number;
    fraisTransportPersonnelPrevisionnel?: number;
    fraisManutentionPrevisionnel?: number;
    montantAideExternePrevisionnel?: number;
    fraisHebergementRestaurationPrevisionnel?: number;
    impotsPrevisionnel?: number;
    loyersPrevisionnel?: number;

    // Demande crédit
    montantDemande: number;
    dureeMois: number;
    objetFinancement: string;

    // Paramètres optionnels
    autresRevenusActuel?: number;
    autresRevenusPrevisionnel?: number;
    libeleGarantie?: string;
    montantGarantie?: number;

    // Cautions
    cautions?: Personnecaution[];

    // Localisation
    delegationId?: number;
    agenceId?: number;
    pointVenteId?: number;
    userId?: number;
}
