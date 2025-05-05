export interface BilanEntreprise {
    bilanEntrepriseId?: number;
    entrepriseId: number;
    dateBilan: Date;
    liquidites: number;
    creancesClients: number;
    valeurStocks: number;
    valeurEquipements: number;
    dettesFournisseurs: number;
    emprunts: number;
    capitalPropre: number;
    estPrevisionnel: boolean;
    dateEnregistrement?: Date;
    dateModification?: Date;
}
