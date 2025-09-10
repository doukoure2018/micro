export interface GarantiePropose {
    garantieProposeId?: number;
    demandeIndividuelId?: number;
    typeGarantie?: 'Caution Solidaire' | 'Garantie Financiere' | 'Garantie Materielle' | 'Autre Garantie';
    descriptionGarantie: string;
    valeurGarantie: number;
    valeurEmprunte?: number; // Calculé automatiquement à 75% de valeurGarantie
    createdAt?: Date;
    updatedAt?: Date;
}

export interface DemandeIndividuel {
    demandeIndividuelId?: number;

    // Informations de base (conservées de l'ancienne structure)
    nom: string;
    prenom: string;
    telephone: string;
    age?: number; // Rendu optionnel car on a dateNaissance maintenant
    numeroMembre: string;
    delegation: number;
    agence: number;
    pos: number;

    natureClient?: string;
    nomPersonneMorale?: string; // Nouveau champ pour le nom de la personne morale si applicable
    // Nouveaux champs - Informations personnelles
    typePiece: "Carte nationale d'identite" | "Carte d'identite Biometrique" | "Possession d'état" | "Carte d'identite personnelle" | 'Passeport';
    numId: string;
    dateNaissance: Date | string;
    lieuxNaissance: string;
    genre: 'Masculin' | 'Feminin';
    situationMatrimoniale: 'Celebataire' | 'Marie' | 'Fiance' | 'Divorce' | 'Veuf';
    nombrePersonneEnCharge: number;
    nombrePersonneScolarise: number;
    addresseDomicileContact: string;
    typePropriete: string;
    nombreAnneeHabitation: number;

    // Nouveaux champs - Activité
    typeActivite: string;
    sousActivite: string;
    sousSousActivite?: string; // Optionnel
    descriptionActivite: string;
    nombreAnneeActivite: number;
    adresseLieuActivite: string;
    autreActivite?: string; // Optionnel
    lieuActivite?: string; // Optionnel
    currentActivite: string; // Conservé de l'ancienne structure

    // Nouveaux champs - Modalités de crédit
    montantDemande: number; // Remplace 'montant'
    dureeDemande: number;
    periodiciteRemboursement: 'Mensuelle' | 'Bimestrielle' | 'Trimestrielle' | 'Quatrimestrielle' | 'Semestrielle' | 'Annuelle';
    tauxInteret: number;
    periodeDiffere?: number; // Optionnel
    nombreEcheance: number;
    echeance?: number;
    objectCredit: 'Fond de roulement' | 'Investissement' | 'Invest+Fond de Roulement' | 'Bon de Commande';
    detailObjectCredit: string;
    statutCredit: 'Nouveau' | 'Renouvellement';
    rangCredit?: number; // Optionnel

    // Champs système
    tipCredito: number;
    codUsuarios?: string; // Rendu optionnel
    statutDemande: string;
    validationState: string;
    statutSelection?: string; // Optionnel
    createdAt?: Date | string;

    // Garanties associées
    garanties?: GarantiePropose[];

    // Champs supprimés de l'ancienne structure mais qu'on peut garder pour compatibilité
    // (à supprimer progressivement)
    quartier?: string; // SUPPRIMÉ - mais gardé en optionnel pour migration
    fonction?: string; // SUPPRIMÉ - mais gardé en optionnel pour migration
    montant?: number; // SUPPRIMÉ - remplacé par montantDemande
    activite?: string; // SUPPRIMÉ - remplacé par typeActivite
    communeResidence?: string; // SUPPRIMÉ - mais gardé en optionnel pour migration
    typeApport?: string; // SUPPRIMÉ - mais gardé en optionnel pour migration
    raison?: string; // SUPPRIMÉ - mais gardé en optionnel pour migration
    object?: string; // SUPPRIMÉ - remplacé par objectCredit et detailObjectCredit
}

/**
 * Interface pour la réponse de création de demande
 */
export interface DemandeResponse {
    demandeId: number;
    message: string;
    success: boolean;
}

/**
 * Interface pour les statistiques de demandes
 */
export interface DemandeStatistics {
    totalDemandes: number;
    demandesEnAttente: number;
    demandesApprouvees: number;
    demandesRejetees: number;
    montantTotalDemande: number;
    montantTotalGaranties: number;
    repartitionParTypeCredit: Record<string, number>;
    repartitionParTypeGarantie: Record<string, number>;
}

/**
 * Interface pour les critères de recherche
 */
export interface DemandeCriteria {
    numeroMembre?: string;
    nom?: string;
    prenom?: string;
    telephone?: string;
    delegation?: number;
    agence?: number;
    pos?: number;
    statutDemande?: string;
    validationState?: string;
    typeActivite?: string;
    montantMin?: number;
    montantMax?: number;
    dateDebut?: Date | string;
    dateFin?: Date | string;
    typeGarantie?: string;
    statutCredit?: 'Nouveau' | 'Renouvellement';
}

/**
 * Interface pour l'historique d'une demande
 */
export interface DemandeHistorique {
    historiqueId: number;
    demandeIndividuelId: number;
    action: string;
    ancienneValeur?: string;
    nouvelleValeur?: string;
    utilisateur: string;
    dateAction: Date;
    commentaire?: string;
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
    EN_REVISION = 'EN_REVISION',
    APPROUVE = 'APPROUVE',
    REJETE = 'REJETE',
    EN_ATTENTE_DOCUMENTS = 'EN_ATTENTE_DOCUMENTS'
}
