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
export type NatureClient = 'Demande de credit Pour Professionnels' | 'Demande de Credit Pour PME/PMI' | 'Demande credit Pour Particulier';

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
