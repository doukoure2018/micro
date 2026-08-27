/**
 * Interface pour les garanties proposées
 */
export interface GarantiePropose {
    garantieProposeId?: number;
    demandeIndividuelId?: number;
    typeGarantie?: 'Caution Solidaire' | 'Garantie Financiere' | 'Garantie Materielle' | 'Autre Garantie';
    descriptionGarantie: string;
    valeurGarantie: number;
    valeurEmprunte?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Type pour la nature du client
 */
export type NatureClient = 'Demande de credit Pour Professionnels' | 'Demande de Credit Pour PME/PMI' | 'Demande credit Pour Particulier' | 'Demande de credit Pour Fonctionnaire' | 'Demande de credit Pour Groupe Solidaire';

/** Nature client du crédit groupe solidaire (valeur exacte partagée avec le backend). */
export const NATURE_CREDIT_GROUPE: NatureClient = 'Demande de credit Pour Groupe Solidaire';

/**
 * Types de groupe solidaire : le type pilote le type de crédit SAF (tip_credito)
 * et le taux proposé par défaut (modifiable à la saisie — décision du 2026-08-27).
 */
export interface TypeGroupe {
    code: string;
    libelle: string;
    tipCredito: number;
    tauxDefaut: number;
}

export const TYPES_GROUPE_OPTIONS: TypeGroupe[] = [
    { code: 'CAS', libelle: 'CAS — Crédit Agricole Solidaire', tipCredito: 2, tauxDefaut: 3 },
    { code: 'CAS_R', libelle: 'CAS-R — Crédit Agricole Solidaire Rente', tipCredito: 10, tauxDefaut: 3 },
    { code: 'CCS', libelle: 'CCS — Crédit Commercial Solidaire', tipCredito: 3, tauxDefaut: 3 },
    { code: 'CRS', libelle: 'CRS — Crédit Rural Solidaire', tipCredito: 1, tauxDefaut: 3 },
    { code: 'CFE', libelle: 'CFE — Crédit Fonctionnaire Épargne', tipCredito: 7, tauxDefaut: 3 },
    { code: 'MCK', libelle: 'MCK — Micro-Crédit Kiosque', tipCredito: 33, tauxDefaut: 3 },
    { code: 'ACM', libelle: 'ACM — Association Caution Mutuelle', tipCredito: 4, tauxDefaut: 3 }
];

/** Extension groupe solidaire d'une demande individuelle (V124). */
export interface DemandeGroupe {
    demandeGroupeId?: number;
    demandeindividuelId?: number;
    typeGroupe: string;
    nomGroupe: string;
    dateAdhesion?: Date | string | null;
    districtQuartier?: string;
    secteur?: string;
    mandataire1: string;
    contactMandataire1: string;
    mandataire2?: string;
    contactMandataire2?: string;
    nombreMembres: number;
    numeroDemande?: string;
}

/** Membre d'une demande groupe. Champs PE réservés au type CFE. */
export interface MembreGroupe {
    membreGroupeId?: number;
    demandeindividuelId?: number;
    numeroMembre: string;
    nomPrenom: string;
    montantPercevoir: number;
    montantSollicite?: number;
    montantBasePe?: number;
    versementMensuelPe?: number;
    /** État de la vérification asynchrone au SAF (front uniquement) */
    verification?: 'en_cours' | 'trouve' | 'introuvable';
}

export function demandeGroupeVide(): DemandeGroupe {
    return {
        typeGroupe: '',
        nomGroupe: '',
        dateAdhesion: null,
        districtQuartier: '',
        secteur: '',
        mandataire1: '',
        contactMandataire1: '',
        mandataire2: '',
        contactMandataire2: '',
        nombreMembres: 0
    };
}

export function membreGroupeVide(): MembreGroupe {
    return { numeroMembre: '', nomPrenom: '', montantPercevoir: 0 };
}

/** Types de groupe soumis à l'analyse agricole (V125). */
export const TYPES_GROUPE_AGRICOLES = ['CAS', 'CAS_R'];

/** Analyse du crédit agricole solidaire (groupes CAS / CAS-R, V125). */
export interface AnalyseCreditAgricole {
    analyseAgricoleId?: number;
    demandeindividuelId?: number;
    fraisLabour: number;
    fraisCloture: number;
    achatIntrant: number;
    achatPhytosanitaire: number;
    achatOutillage: number;
    fraisEntretien: number;
    fraisSemis: number;
    fraisRecolte: number;
    transport: number;
    stockage: number;
    fraisConservation: number;
    chargesFamiliales: number;
    quantiteRecolte: number;
    prixVenteUnitaire: number;
    autresProduits: number;
    // Calculés côté backend (lecture seule)
    totalCharges?: number;
    totalProduits?: number;
    totalEcheances?: number;
    margeNette?: number;
    verdict?: 'FINANCABLE' | 'NON_FINANCABLE' | string;
    analysePar?: string;
}

export function analyseCreditAgricoleVide(): AnalyseCreditAgricole {
    return {
        fraisLabour: 0,
        fraisCloture: 0,
        achatIntrant: 0,
        achatPhytosanitaire: 0,
        achatOutillage: 0,
        fraisEntretien: 0,
        fraisSemis: 0,
        fraisRecolte: 0,
        transport: 0,
        stockage: 0,
        fraisConservation: 0,
        chargesFamiliales: 0,
        quantiteRecolte: 0,
        prixVenteUnitaire: 0,
        autresProduits: 0
    };
}

/**
 * Taux de quotité cessible du crédit fonctionnaire (fixe) :
 * l'échéance mensuelle ne doit jamais dépasser 35 % du salaire net.
 */
export const TAUX_QUOTITE_FONCTIONNAIRE = 0.35;

/** Nature client du crédit fonctionnaire (valeur exacte partagée avec le backend). */
export const NATURE_CREDIT_FONCTIONNAIRE: NatureClient = 'Demande de credit Pour Fonctionnaire';

/**
 * Quotité cessible affichée/contrôlée côté frontend : 35 % du salaire net, tronquée
 * au GNF entier (Math.floor sur salaire x 35 / 100, entier-exact en flottant).
 * Toujours <= au plafond backend (CreditFonctionnaireValidator, 2 décimales HALF_UP),
 * pour que le formulaire n'autorise jamais une échéance que le backend rejetterait.
 */
export function quotiteCessibleFonctionnaire(salaireNetMensuel: number | null | undefined): number {
    return Math.floor(((salaireNetMensuel || 0) * 35) / 100);
}

/** Options de type de contrat du formulaire fonctionnaire (saisie et correction). */
export const TYPE_CONTRAT_OPTIONS_FONCTIONNAIRE: { label: string; value: string }[] = [
    { label: 'Titulaire', value: 'Titulaire' },
    { label: 'Contractuel', value: 'Contractuel' },
    { label: 'Retraité', value: 'Retraite' }
];

/** Extension fonctionnaire vierge, partagée entre saisie initiale et correction. */
export function demandeFonctionnaireVide(): DemandeFonctionnaire {
    return {
        serviceEmployeur: '',
        departementMinistere: '',
        ancienneteAnnees: undefined,
        typeContrat: '',
        matricule: '',
        salaireNetMensuel: 0,
        autresRevenus: 0,
        nombreEpouses: 0,
        domiciliationSalaire: false
    };
}

/**
 * Extension fonctionnaire d'une demande individuelle (V120).
 */
export interface DemandeFonctionnaire {
    demandeFonctionnaireId?: number;
    demandeindividuelId?: number;
    serviceEmployeur: string;
    departementMinistere: string;
    ancienneteAnnees?: number;
    typeContrat: string;
    matricule?: string;
    salaireNetMensuel: number;
    autresRevenus?: number;
    nombreEpouses?: number;
    domiciliationSalaire: boolean;
    quotiteCessible?: number; // calculée côté backend (lecture seule)
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

/**
 * Analyse charges & quotité du crédit fonctionnaire (V120) — grille saisie par l'AC,
 * résultats (quotité, capacité, verdict) recalculés côté backend.
 */
export interface AnalyseChargesFonctionnaire {
    analyseChargesId?: number;
    demandeindividuelId?: number;
    chargeLoyer: number;
    chargeTransport: number;
    chargeNourriture: number;
    chargeVignette: number;
    chargeAssurance: number;
    chargeElectricite: number;
    chargeEau: number;
    chargeAssuranceMaladie: number;
    chargeScolarite: number;
    chargeCasSociaux: number;
    chargeAbonnementImage: number;
    chargeServiceSalubrite: number;
    salaireNetRetenu?: number;
    autresRevenusRetenus?: number;
    totalCharges?: number;
    quotiteCessible?: number;
    capaciteResiduelle?: number;
    verdict?: 'FINANCABLE' | 'NON_FINANCABLE';
    avisAgent?: string;
    analysePar?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

/**
 * Pièce jointe d'une demande (V121). Types crédit fonctionnaire :
 * BULLETIN_SALAIRE, ATTESTATION_SERVICE, AUTRE.
 */
export interface PieceJointeDemande {
    pieceJointeId?: number;
    demandeindividuelId?: number;
    typePiece: 'BULLETIN_SALAIRE' | 'ATTESTATION_SERVICE' | 'AUTRE';
    nomFichier?: string;
    urlFichier?: string;
    ajoutePar?: string;
    createdAt?: Date | string;
}

/**
 * Interface principale pour une demande individuelle
 * Version V80 avec email et sigle
 */
export interface DemandeIndividuel {
    demandeIndividuelId?: number;

    // ==================== INFORMATIONS DE BASE ====================
    nom: string;
    prenom: string;
    sernom?: string;
    telephone: string;
    email?: string; // NOUVEAU V80
    numeroMembre: string;
    age?: number;

    // ==================== LOCALISATION ADMINISTRATIVE ====================
    delegation: number;
    agence: number;
    pos: number;
    prefecture?: string;
    sousPrefecture?: string;

    // ==================== NATURE DU CLIENT ====================
    natureClient?: NatureClient;
    nomPersonneMorale?: string;
    sigle?: string; // NOUVEAU V80: Sigle de l'entreprise (pour PME/PMI)
    demandeFonctionnaire?: DemandeFonctionnaire; // NOUVEAU V120: obligatoire si nature Fonctionnaire
    demandeGroupe?: DemandeGroupe; // V124: obligatoire si nature Groupe Solidaire
    membresGroupe?: MembreGroupe[]; // V124: membres du groupe (somme des parts = montant demandé)

    // ==================== INFORMATIONS PERSONNELLES ====================
    typePiece: "Carte nationale d'identite" | "Carte d'identite Biometrique" | "Possession d'état" | "Carte d'identite personnelle" | 'Passeport';
    numId: string;
    dateNaissance: Date | string;
    lieuxNaissance: string;
    genre: 'Masculin' | 'Feminin';
    situationMatrimoniale: 'Celebataire' | 'Marie' | 'Fiance' | 'Divorce' | 'Veuf';
    nombrePersonneEnCharge: number;
    nombrePersonneScolarise: number;
    nomPere?: string;
    nomMere?: string;
    nomConjoint?: string;
    addresseDomicileContact: string;
    typePropriete: string;
    nombreAnneeHabitation: number;

    // ==================== ACTIVITÉ ====================
    categorie?: string;
    typeActivite: string;
    sousActivite: string;
    sousSousActivite?: string;
    descriptionActivite: string;
    nombreAnneeActivite: number;
    adresseLieuActivite: string;
    autreActivite?: string;
    lieuActivite?: string;
    natureActivite?: string;
    currentActivite: string;

    // ==================== CHAMPS PARTICULIER ====================
    profession?: string; // Profession (pour Particulier uniquement)
    secteurActivite?: string; // Secteur d'activité (pour Particulier uniquement)

    // ==================== MODALITÉS DE CRÉDIT ====================
    montantDemande: number;
    montant?: number;
    dureeDemande: number;
    periodiciteRemboursement: PeriodiciteRemboursement;
    tauxInteret: number;
    periodeDiffere?: number;
    nombreEcheance: number;
    echeance?: number;
    objectCredit: ObjectCredit;
    detailObjectCredit: string;
    statutCredit: 'Nouveau' | 'Renouvellement';
    rangCredit?: number;

    // ==================== CHAMPS SYSTÈME ====================
    tipCredito: number;
    codUsuarios?: string;
    statutDemande: string;
    validationState: string;
    statutSelection?: string;
    /** Verrou d'affectation : agent de crédit propriétaire du dossier (+ nom affichable) */
    agentCreditAffecte?: number;
    agentAffecteNom?: string;
    createdAt?: Date | string;

    // ==================== GARANTIES ====================
    garanties?: GarantiePropose[];

    // ==================== CHAMPS POUR AFFICHAGE ====================
    delegationLibele?: string;
    agenceLibele?: string;
    pointVenteLibele?: string;

    // ==================== WORKFLOW HIERARCHIQUE ====================
    // AC
    avisAgentCredit?: string;
    // DA
    avisDa?: string;
    motifRejetDa?: string;
    sectionsARevoirDa?: string;
    instructionsAc?: string;
    dateValidationDa?: string | Date;
    validatedByDa?: string;
    // DR
    avisDr?: string;
    motifRejetDr?: string;
    sectionsARevoirDr?: string;
    instructionsDa?: string;
    dateValidationDr?: string | Date;
    validatedByDr?: string;
    // DE
    avisDe?: string;
    motifRejetDe?: string;
    sectionsARevoirDe?: string;
    instructionsDr?: string;
    dateValidationDe?: string | Date;
    validatedByDe?: string;

    // ==================== CHAMPS SUPPLÉMENTAIRES FORMULAIRE ====================
    dateAdhesion?: Date | null;
    titreDirecteur?: string; // Pour PME/PMI
    numeroDemande?: string;
    numeroCredit?: string;
    prefectureActivite?: string;
    sousPrefectureActivite?: string;
}

/**
 * Type pour les périodicités de remboursement
 */
export type PeriodiciteRemboursement = 'Mensuelle' | 'Bimestrielle' | 'Trimestrielle' | 'Quatrimestrielle' | 'Semestrielle' | 'Annuelle';

/**
 * Type pour les types de garantie
 */
export type TypeGarantie = 'Caution Solidaire' | 'Garantie Financiere' | 'Garantie Materielle' | 'Autre Garantie';

/**
 * Type pour les objets de crédit
 */
export type ObjectCredit = 'Fond de roulement' | 'Investissement' | 'Invest+Fond de Roulement' | 'Bon de Commande';

/**
 * Options pour le dropdown de nature client
 */
export const NATURE_CLIENT_OPTIONS = [
    {
        label: 'Particulier',
        value: 'Demande credit Pour Particulier',
        icon: 'pi pi-user',
        description: 'Pour les particuliers souhaitant un crédit personnel'
    },
    {
        label: 'PME/PMI',
        value: 'Demande de Credit Pour PME/PMI',
        icon: 'pi pi-building',
        description: 'Pour les petites et moyennes entreprises'
    },
    {
        label: 'Professionnels',
        value: 'Demande de credit Pour Professionnels',
        icon: 'pi pi-briefcase',
        description: 'Pour les professionnels et artisans'
    },
    {
        label: 'Fonctionnaire',
        value: 'Demande de credit Pour Fonctionnaire',
        icon: 'pi pi-id-card',
        description: 'Pour les fonctionnaires et salariés (crédit sur salaire)'
    }
] as const;

/**
 * Options pour les types de garantie
 */
export const TYPE_GARANTIE_OPTIONS = [
    { label: 'Garantie Financière', value: 'Garantie Financiere' },
    { label: 'Garantie Matérielle', value: 'Garantie Materielle' },
    { label: 'Caution Solidaire', value: 'Caution Solidaire' },
    { label: 'Autre Garantie', value: 'Autre Garantie' }
] as const;

/**
 * Options pour le genre
 */
export const GENRE_OPTIONS = [
    { label: 'Masculin', value: 'Masculin' },
    { label: 'Féminin', value: 'Feminin' }
] as const;

/**
 * Enum pour les statuts de demande
 */
export enum StatutDemande {
    EN_ATTENTE = 'EN_ATTENTE',
    APPROUVEE = 'APPROUVEE',
    REJETEE = 'REJETEE',
    EN_COURS = 'EN_COURS',
    TERMINEE = 'TERMINEE',
    ANNULEE = 'ANNULEE'
}

/**
 * Enum pour les états de validation
 */
export enum ValidationState {
    NOUVEAU = 'NOUVEAU',
    SELECTION = 'SELECTION',
    APPROVED = 'APPROVED',
    CORRECTION = 'CORRECTION',
    VALIDATED_DA = 'VALIDATED_DA',
    CORRECTION_DR = 'CORRECTION_DR',
    VALIDATED_DR = 'VALIDATED_DR',
    CORRECTION_DE = 'CORRECTION_DE',
    VALIDATED_FINAL = 'VALIDATED_FINAL'
}
