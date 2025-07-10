export interface AnalyseCompleteData {
    demande: {
        userId: number;
        agenceId: number;
        dureeMois: number;
        dateDemande: string;
        delegationId: number;
        pointVenteId: number;
        statutDemande: string;
        montantDemande: number;
        demandeCreditId: number;
        objetFinancement: string;
    };
    cautions: string; // JSON string
    metadata: {
        dateAnalyse: string;
        versionAnalyse: string;
    };
    promoteur: {
        nom: string;
        email: string;
        prenom: string;
        adresse: string;
        telephone: string;
        promoteurId: number;
        dateNaissance: string;
        numeroIdentite: string;
    };
    entreprise: {
        nom: string;
        email: string;
        adresse: string;
        telephone: string;
        dateCreation: string;
        entrepriseId: number;
        formeJuridique: string;
        numeroRegistre: string;
        secteurActivite: string;
    };
    bilanPersonnel: {
        epargnes: number;
        libeleGarantie: string;
        montantGarantie: number;
        valeurBiensDurables: number;
    };
    bilanEntreprise: {
        emprunts: number;
        actifTotal: number;
        liquidites: number;
        passifTotal: number;
        valeurStocks: number;
        capitalPropre: number;
        creancesClients: number;
        valeurEquipements: number;
        dettesFournisseurs: number;
    };
    ratiosFinanciers: {
        croissanceCA: number;
        ratioLiquidite: number;
        ratioEndettement: number;
        ratioDependanceActuel: number;
        ratioDependancePrevisionnel: number;
    };
    compteExploitationActuel: {
        impots: number;
        loyers: number;
        benefice: number;
        autresRevenus: number;
        charesTotales: number;
        revenusTotaux: number;
        dateFinPeriode: string;
        chiffreAffaires: number;
        coutMarchandises: number;
        dateDebutPeriode: string;
        fraisManutention: number;
        montantAideExterne: number;
        coutTransportProduction: number;
        fraisTransportPersonnel: number;
        fraisHebergementRestauration: number;
    };
    compteExploitationPrevisionnel: {
        impots: number;
        loyers: number;
        benefice: number;
        autresRevenus: number;
        charesTotales: number;
        revenusTotaux: number;
        dateFinPeriode: string;
        chiffreAffaires: number;
        coutMarchandises: number;
        dateDebutPeriode: string;
        fraisManutention: number;
        montantAideExterne: number;
        coutTransportProduction: number;
        fraisTransportPersonnel: number;
        fraisHebergementRestauration: number;
    };
}
