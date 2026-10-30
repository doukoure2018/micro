/** Les journaux du service Audit (lot 2 de la proposition du 30/10/2026). Lecture seule. */

export interface PageAudit<T> {
    contenu: T[];
    page: number;
    taille: number;
    total: number;
    pages: number;
}

/** Un évènement du circuit d'un dossier ; le délai est compté depuis le précédent du même dossier. */
export interface Decision {
    historiqueId: number;
    demandeId: number | null;
    client: string | null;
    numeroMembre: string | null;
    montant: number | null;
    pointVente: string | null;
    agence: string | null;
    delegation: string | null;
    evenement: string;
    ancienEtat: string | null;
    nouvelEtat: string | null;
    ancienStatut: string | null;
    nouveauStatut: string | null;
    acteur: string | null;
    motif: string | null;
    dateEvenement: string;
    delaiHeures: number | null;
}

export interface CompteurAudit {
    cle: string;
    nombre: number;
    moyenneHeures: number | null;
}

export interface DecisionsSynthese {
    total: number;
    premier: string | null;
    dernier: string | null;
    parEvenement: CompteurAudit[];
    parEtatArrivee: CompteurAudit[];
    parActeur: CompteurAudit[];
    plusLents: CompteurAudit[];
}

/** Un dossier sorti du circuit ; `tracee` dit si la sortie porte un motif ET un auteur. */
export interface SortieDossier {
    demandeId: number;
    client: string | null;
    numeroMembre: string | null;
    montant: number | null;
    pointVente: string | null;
    agence: string | null;
    delegation: string | null;
    statutDemande: string | null;
    validationState: string | null;
    etatAvantAnnulation: string | null;
    motifCode: string | null;
    motif: string | null;
    demandeePar: string | null;
    dateDemande: string | null;
    decideePar: string | null;
    dateDecision: string | null;
    motifRefus: string | null;
    dateCreation: string | null;
    tracee: boolean;
}

export interface Annulations {
    nbAnnulees: number;
    nbEnAttente: number;
    nbSansMotif: number;
    montantSansMotif: number;
    annulees: SortieDossier[];
    enAttente: SortieDossier[];
    sansMotif: SortieDossier[];
}

export interface CorrectionNumero {
    id: number;
    demandeId: number | null;
    client: string | null;
    pointVente: string | null;
    agence: string | null;
    ancienNumero: string | null;
    nouveauNumero: string | null;
    nomSaf: string | null;
    agenceSaf: string | null;
    motif: string | null;
    parNom: string | null;
    parRole: string | null;
    dateCorrection: string;
}

export interface CompteAudit {
    userId: number;
    nom: string | null;
    email: string | null;
    telephone: string | null;
    role: string | null;
    service: string | null;
    departement: string | null;
    pointVente: string | null;
    agence: string | null;
    delegation: string | null;
    actif: boolean;
    derniereConnexion: string | null;
    joursSansConnexion: number | null;
    creeLe: string | null;
    emailVerifie: boolean;
    telephoneVerifie: boolean;
    contactsACorriger: boolean;
}

export interface TraceCompte {
    id: number;
    userId: number | null;
    compte: string | null;
    action: 'BLOQUER' | 'DEBLOQUER' | 'ACTIVER' | 'DESACTIVER';
    motif: string | null;
    parNom: string | null;
    dateAction: string;
}

export interface TraceHabilitation {
    id: number;
    action: 'ACCORDER' | 'RETIRER' | 'BASCULE' | 'RATTACHEMENT' | 'ACCUEIL';
    service: string | null;
    departement: string | null;
    rubriqueCode: string | null;
    rubriqueLibelle: string | null;
    valeurAvant: string | null;
    valeurApres: string | null;
    parNom: string | null;
    dateAction: string;
}

export interface MatriceLecture {
    departementId: number;
    service: string;
    code: string;
    libelle: string;
    toutVoir: boolean;
    nbComptes: number;
    rubriques: string[];
}

export interface ComptesAudit {
    nbComptes: number;
    nbActifs: number;
    nbBloques: number;
    nbJamaisConnectes: number;
    nbSansConnexionDepuis90Jours: number;
    parDepartementActif: boolean;
    comptes: CompteAudit[];
    journalComptes: TraceCompte[];
    journalHabilitations: TraceHabilitation[];
    matrice: MatriceLecture[];
}

/** Filtres du journal des décisions. */
export interface FiltresDecisions {
    dossier: number | null;
    acteur: string | null;
    evenement: string | null;
    etat: string | null;
    du: string | null;
    au: string | null;
}

// ==================== Journal unifié des actions sensibles (lot 3) ====================

/** Une action sensible, d'où qu'elle vienne : `origine` nomme la table qui la porte. */
export interface ActionSensible {
    quand: string;
    type: string;
    compte: string | null;
    objet: string | null;
    detail: string | null;
    origine: string;
}

export interface FiltresActions {
    type: string | null;
    compte: string | null;
    recherche: string | null;
    du: string | null;
    au: string | null;
}

// ==================== Délais et dérogations (lot 3) ====================

/** Un dossier validé par un niveau dont le plafond de délégation est inférieur au montant. */
export interface Derogation {
    demandeId: number;
    client: string | null;
    montant: number | null;
    niveau: string | null;
    plafond: number | null;
    depassement: number | null;
    valideur: string | null;
    dateValidation: string | null;
    pointVente: string | null;
    agence: string | null;
    delegation: string | null;
}

export interface DelaiEtape {
    etape: string;
    passages: number;
    moyenneHeures: number | null;
    maxHeures: number | null;
}

export interface DelaiAgence {
    agence: string;
    delegation: string | null;
    evenements: number;
    moyenneHeures: number | null;
}

export interface DossierDormant {
    demandeId: number;
    client: string | null;
    montant: number | null;
    etat: string | null;
    dernierEvenement: string | null;
    joursSansMouvement: number | null;
    pointVente: string | null;
    agence: string | null;
    delegation: string | null;
}

export interface Resoumission {
    demandeId: number;
    client: string | null;
    montant: number | null;
    nbCorrections: number;
    etats: string | null;
    etatActuel: string | null;
    derniereCorrection: string | null;
    pointVente: string | null;
    agence: string | null;
}

export interface DelaisDerogations {
    nbDerogations: number;
    montantDerogations: number | null;
    nbDormants: number;
    nbResoumis: number;
    derogations: Derogation[];
    parEtape: DelaiEtape[];
    parAgence: DelaiAgence[];
    dormants: DossierDormant[];
    resoumissions: Resoumission[];
    seuilDormantJours: number;
}
