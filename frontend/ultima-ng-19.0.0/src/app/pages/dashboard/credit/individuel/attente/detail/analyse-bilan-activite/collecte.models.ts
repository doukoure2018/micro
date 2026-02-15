export interface CollecteDonnees {
    collecteId?: number;
    demandeindividuelId?: number;
    dateEvaluation?: string;
    agentCollecteCod?: string;
    agentCollecteNom?: string;
    activiteDescription?: string;
    secteurActivite?: string;
    sousSecteurActivite?: string;
    sousSousSecteur?: string;
    statut?: string;
    pourcentageCompletion?: number;
    createdAt?: string;
    updatedAt?: string;
    conditionCredit?: ConditionCredit;
    chiffreAffaires?: ChiffreAffaires;
    margeBrute?: MargeBrute;
    actifPassif?: ActifPassif;
    chargeEntreprise?: ChargeEntreprise;
    chargePersonnelle?: ChargePersonnelle;
    autreRevenu?: AutreRevenu;
    bienPersonnel?: BienPersonnel;
    amortissements?: Amortissement[];
}

export interface ConditionCredit {
    conditionCreditId?: number;
    collecteId?: number;
    capaciteRemboursementDeclaree?: number;
}

export interface ChiffreAffaires {
    caId?: number;
    collecteId?: number;
    caHebdomadaireDeclare?: number;
    caMensuelDeclare?: number;
    cycleMensuelJson?: string;
    cycleHebdoJson?: string;
    caJourFort?: number;
    caJourMoyen?: number;
    caJourFaible?: number;
    caHebdoCalcule?: number;
    caMensuelCalcule?: number;
}

export interface MargeBrute {
    margeId?: number;
    collecteId?: number;
    connaitTauxMarge?: boolean;
    tauxMargeDeclare?: number;
    calculerTauxMarge?: boolean;
    frequenceVentes?: string;
    totalCaCalcule?: number;
    totalCoutCalcule?: number;
    tauxMargeCalcule?: number;
    produits?: Produit[];
}

export interface Produit {
    produitId?: number;
    collecteId?: number;
    ordre?: number;
    nomProduit?: string;
    prixVente?: number;
    coutAchat?: number;
    quantite?: number;
    chiffreAffaires?: number;
    coutTotal?: number;
    margeUnitaire?: number;
}

export interface ActifPassif {
    actifPassifId?: number;
    collecteId?: number;
    terrainExiste?: boolean;
    terrainValeur?: number;
    batimentExiste?: boolean;
    batimentPropriete?: boolean;
    installationExiste?: boolean;
    installationPropriete?: boolean;
    materielRoulantExiste?: boolean;
    materielRoulantPropriete?: boolean;
    mobilierExiste?: boolean;
    mobilierPropriete?: boolean;
    machineExiste?: boolean;
    machinePropriete?: boolean;
    cautionFinanciereExiste?: boolean;
    cautionFinanciereValeur?: number;
    pretEmployeExiste?: boolean;
    pretEmployeFondsActivite?: boolean;
    pretEmployeValeur?: number;
    stockExiste?: boolean;
    stockConnaitValeur?: boolean;
    stockValeurEstimee?: number;
    stockEvaluerDetail?: boolean;
    creditFournisseurExiste?: boolean;
    creditFournisseurPrevu?: boolean;
    creditFournisseurValeur?: number;
    creanceClientExiste?: boolean;
    creancePlus3Mois?: number;
    creanceMoins3Mois?: number;
    cashExiste?: boolean;
    cashValeur?: number;
    compteCrgExiste?: boolean;
    compteCrgValeur?: number;
    tontinierExiste?: boolean;
    tontinierValeur?: number;
    compteBanqueExiste?: boolean;
    compteBanqueValeur?: number;
    empruntImfExiste?: boolean;
    empruntImfValeur?: number;
    empruntBancaireLtExiste?: boolean;
    empruntBancaireLtValeur?: number;
    empruntBancaireCtExiste?: boolean;
    empruntBancaireCtValeur?: number;
    avanceClientExiste?: boolean;
    avanceClientValeur?: number;
    detteFournisseurExiste?: boolean;
    detteFournisseurValeur?: number;
    impotNonPayeExiste?: boolean;
    impotNonPayeValeur?: number;
    loyerNonPayeExiste?: boolean;
    loyerNonPayeValeur?: number;
    factureNonPayeeExiste?: boolean;
    factureNonPayeeValeur?: number;
    tontineDetteExiste?: boolean;
    tontineDetteValeur?: number;
    autreDetteExiste?: boolean;
    autreDetteValeur?: number;
    stockArticles?: StockArticle[];
}

export interface StockArticle {
    stockArticleId?: number;
    collecteId?: number;
    ordre?: number;
    nomArticle?: string;
    quantite?: number;
    coutUnitaire?: number;
    valeurStock?: number;
}

export interface ChargeEntreprise {
    chargeId?: number;
    collecteId?: number;
    loyerExiste?: boolean;
    loyerMontant?: number;
    salaireExiste?: boolean;
    salaireMontant?: number;
    fournitureExiste?: boolean;
    fournitureMontant?: number;
    publiciteExiste?: boolean;
    publiciteMontant?: number;
    telephoneExiste?: boolean;
    telephoneMontant?: number;
    electriciteExiste?: boolean;
    electriciteMontant?: number;
    eauExiste?: boolean;
    eauMontant?: number;
    transportAchatExiste?: boolean;
    transportAchatMontant?: number;
    transportVenteExiste?: boolean;
    transportVenteMontant?: number;
    transportDiversExiste?: boolean;
    transportDiversMontant?: number;
    entretienExiste?: boolean;
    entretienMontant?: number;
    carburantExiste?: boolean;
    carburantMontant?: number;
    assuranceExiste?: boolean;
    assuranceMontant?: number;
    fraisBancairesExiste?: boolean;
    fraisBancairesMontant?: number;
    interetsEmpruntsExiste?: boolean;
    interetsEmpruntsMontant?: number;
    impotsTaxesExiste?: boolean;
    impotsTaxesMontant?: number;
    honorairesExiste?: boolean;
    honorairesMontant?: number;
    provisionsExiste?: boolean;
    provisionsMontant?: number;
    echeanceAutreCreditExiste?: boolean;
    echeanceAutreCreditMontant?: number;
    autresChargesExiste?: boolean;
    autresChargesMontant?: number;
}

export interface ChargePersonnelle {
    chargePersoId?: number;
    collecteId?: number;
    salaireFixe?: boolean;
    salaireMontant?: number;
    alimentationMontant?: number;
    loyerResidenceMontant?: number;
    transportPriveMontant?: number;
    electriciteEauCommMontant?: number;
    habillementMontant?: number;
    fraisMedicauxMontant?: number;
    echeanceCreditPersoMontant?: number;
    scolariteMontant?: number;
    travauxConstructionMontant?: number;
    autresChargesPersoMontant?: number;
    depensesPreleveesActivite?: boolean;
}

export interface AutreRevenu {
    autreRevenuId?: number;
    collecteId?: number;
    salaireExterneExiste?: boolean;
    salaireExterneMontant?: number;
    loyersPercusExiste?: boolean;
    loyersPercusMontant?: number;
    activiteSecondaireExiste?: boolean;
    activiteSecondaireMontant?: number;
    autresRevenusExiste?: boolean;
    autresRevenusMontant?: number;
}

export interface BienPersonnel {
    bienPersoId?: number;
    collecteId?: number;
    terrainExiste?: boolean;
    terrainValeur?: number;
    maisonExiste?: boolean;
    maisonValeur?: number;
    vehiculeExiste?: boolean;
    vehiculeValeur?: number;
    motoExiste?: boolean;
    motoValeur?: number;
    autreBienExiste?: boolean;
    autreBienValeur?: number;
}

export interface Amortissement {
    amortissementId?: number;
    collecteId?: number;
    ordre?: number;
    natureImmobilisation?: string;
    typeImmobilisation?: string;
    dateAcquisition?: string;
    dureeAmortissementMois?: number;
    valeurAcquisition?: number;
    amortissementMensuel?: number;
    amortissementCumule?: number;
    valeurNetteComptable?: number;
    statutAmortissement?: string;
    valeurNetteAjustee?: number;
}

export const TYPES_IMMOBILISATION = [
    { label: 'Batiments et magasin', value: 'Batiments et magasin', dureeMois: 120 },
    { label: 'Installations et agencements', value: 'Installations et agencements', dureeMois: 60 },
    { label: 'Materiels industriels', value: 'Materiels industriels', dureeMois: 60 },
    { label: 'Mobilier de bureau', value: 'Mobilier de bureau', dureeMois: 60 },
    { label: 'Materiel informatique', value: 'Materiel informatique', dureeMois: 36 },
    { label: 'Materiel de transport', value: 'Materiel de transport', dureeMois: 36 },
    { label: 'Autres immobilisations', value: 'Autres immobilisations', dureeMois: 60 }
];
