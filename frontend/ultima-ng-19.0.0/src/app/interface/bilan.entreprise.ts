export interface BilanEntreprise {
    bilanEntrepriseId?: number;
    entrepriseId: number;
    date_bilan: Date;
    liquidites: number;
    creances_clients: number;
    valeur_stocks: number;
    valeur_equipements: number;
    dettes_fournisseurs: number;
    emprunts: number;
    capital_propre: number;
    estPrevisionnel: boolean;
    dateEnregistrement?: Date;
    dateModification?: Date;
    total_actif?: number;
    total_passif?: number;
}
