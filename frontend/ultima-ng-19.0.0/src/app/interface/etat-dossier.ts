/**
 * Référentiel des états d'un dossier de crédit individuel (V148, 2026-09-18).
 *
 * `validation_state` (15 valeurs de la contrainte V119) + `statut_demande` (EN_ATTENTE / REJET / REJECTED).
 * Deux périmètres servis par le backend (GET /ecredit/all-with-garanties?scope=) :
 *  - EN_COURS : ni rejeté, ni validé au niveau final -> page « Dossiers en cours »
 *  - CLOTURES : VALIDATED_FINAL ou rejeté            -> page « Dossiers clôturés » (DA / AGENT_CREDIT)
 */
export type ScopeDossiers = 'EN_COURS' | 'CLOTURES';

export type SeveriteTag = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined;

/** Étape du circuit à laquelle se trouve un dossier en cours (regroupe les validation_state). */
export type EtapeDossier = 'RECEPTION' | 'ANALYSE' | 'CORRECTION' | 'APPROBATION';

const ETAPES: Record<string, EtapeDossier> = {
    // Accueil / affectation par le DA
    EN_ATTENTE_DA: 'RECEPTION',
    NOUVEAU: 'RECEPTION',
    // Chez l'agent de crédit
    AFFECTEE: 'ANALYSE',
    SELECTION: 'ANALYSE',
    // Renvoyé pour correction (au saisissant par le DA, ou à l'agent par la hiérarchie)
    CORRECTION_ACCUEIL: 'CORRECTION',
    CORRECTION: 'CORRECTION',
    CORRECTION_DR: 'CORRECTION',
    CORRECTION_DE: 'CORRECTION',
    RETOUR_AGENT: 'CORRECTION',
    REJETE_DG: 'CORRECTION',
    // Circuit hiérarchique DA -> DR -> DE -> DG
    APPROVED: 'APPROBATION',
    VALIDATED_DA: 'APPROBATION',
    VALIDATED_DR: 'APPROBATION',
    PENDING_DG: 'APPROBATION',
    // Historique
    VALIDATION: 'ANALYSE'
};

const LIBELLES: Record<string, string> = {
    EN_ATTENTE_DA: 'Reçue, à affecter par le DA',
    CORRECTION_ACCUEIL: 'À corriger (renvoi du DA au saisissant)',
    NOUVEAU: 'Nouvelle demande',
    AFFECTEE: 'Affectée à un agent',
    SELECTION: "En analyse par l'agent",
    VALIDATION: "En analyse par l'agent",
    CORRECTION: 'À corriger (retour DA)',
    CORRECTION_DR: 'À corriger (retour DR)',
    CORRECTION_DE: 'À corriger (retour DE)',
    RETOUR_AGENT: "Renvoyée à l'agent",
    REJETE_DG: 'Rejet DG, confirmation DE',
    APPROVED: "Approuvée par l'agent, chez le DA",
    VALIDATED_DA: 'Validée DA, chez le DR',
    VALIDATED_DR: 'Validée DR, chez le DE',
    PENDING_DG: 'Validée DE, visa DG',
    VALIDATED_FINAL: 'Approuvée (niveau final)'
};

const SEVERITES: Record<string, SeveriteTag> = {
    EN_ATTENTE_DA: 'secondary',
    CORRECTION_ACCUEIL: 'danger',
    NOUVEAU: 'secondary',
    AFFECTEE: 'info',
    SELECTION: 'info',
    VALIDATION: 'info',
    CORRECTION: 'danger',
    CORRECTION_DR: 'danger',
    CORRECTION_DE: 'danger',
    RETOUR_AGENT: 'danger',
    REJETE_DG: 'danger',
    APPROVED: 'warn',
    VALIDATED_DA: 'warn',
    VALIDATED_DR: 'warn',
    PENDING_DG: 'warn',
    VALIDATED_FINAL: 'success'
};

export function estRejete(d: { statutDemande?: string | null }): boolean {
    return d.statutDemande === 'REJET' || d.statutDemande === 'REJECTED';
}

export function estApprouveFinal(d: { validationState?: string | null }): boolean {
    return d.validationState === 'VALIDATED_FINAL';
}

export function estCloture(d: { statutDemande?: string | null; validationState?: string | null }): boolean {
    return estRejete(d) || estApprouveFinal(d);
}

export function etapeDossier(d: { statutDemande?: string | null; validationState?: string | null }): EtapeDossier | 'APPROUVE' | 'REJETE' {
    if (estRejete(d)) return 'REJETE';
    if (estApprouveFinal(d)) return 'APPROUVE';
    return ETAPES[d.validationState || 'NOUVEAU'] || 'RECEPTION';
}

export function libelleEtat(d: { statutDemande?: string | null; validationState?: string | null; motifRejetDg?: string | null; motifRejetDe?: string | null }): string {
    if (estRejete(d)) return 'Rejetée';
    // Rejet DG confirmé par le DE (2026-09-23) : CORRECTION_DE sans motif DE propre
    if (d.validationState === 'CORRECTION_DE' && d.motifRejetDg && !d.motifRejetDe) return 'À corriger (rejet DG confirmé par le DE)';
    return LIBELLES[d.validationState || 'NOUVEAU'] || d.validationState || 'Nouvelle demande';
}

export function severiteEtat(d: { statutDemande?: string | null; validationState?: string | null }): SeveriteTag {
    if (estRejete(d)) return 'danger';
    return SEVERITES[d.validationState || 'NOUVEAU'] || 'info';
}

/** Carte de filtre affichée en tête de liste. */
export interface CarteFiltre {
    cle: string;
    libelle: string;
    description: string;
    icone: string;
    couleur: string; // variable CSS PrimeNG, ex. 'blue'
    predicat: (d: { statutDemande?: string | null; validationState?: string | null }) => boolean;
}

export const CARTES_EN_COURS: CarteFiltre[] = [
    { cle: 'ALL', libelle: 'Toutes en cours', description: 'Dossiers en traitement', icone: 'pi-list', couleur: 'primary', predicat: () => true },
    { cle: 'RECEPTION', libelle: 'À affecter', description: 'Reçues, en attente du DA', icone: 'pi-inbox', couleur: 'gray', predicat: (d) => etapeDossier(d) === 'RECEPTION' },
    { cle: 'ANALYSE', libelle: "En analyse", description: "Chez l'agent de crédit", icone: 'pi-user-edit', couleur: 'blue', predicat: (d) => etapeDossier(d) === 'ANALYSE' },
    { cle: 'CORRECTION', libelle: 'À corriger', description: 'Renvoyées pour correction', icone: 'pi-undo', couleur: 'red', predicat: (d) => etapeDossier(d) === 'CORRECTION' },
    { cle: 'APPROBATION', libelle: 'En approbation', description: 'DA → DR → DE → DG', icone: 'pi-sitemap', couleur: 'orange', predicat: (d) => etapeDossier(d) === 'APPROBATION' }
];

export const CARTES_CLOTURES: CarteFiltre[] = [
    { cle: 'ALL', libelle: 'Toutes clôturées', description: 'Approuvées et rejetées', icone: 'pi-list', couleur: 'primary', predicat: () => true },
    { cle: 'APPROUVE', libelle: 'Approuvées', description: 'Niveau final atteint', icone: 'pi-verified', couleur: 'green', predicat: (d) => etapeDossier(d) === 'APPROUVE' },
    { cle: 'REJETE', libelle: 'Rejetées', description: 'Refus définitif', icone: 'pi-times-circle', couleur: 'red', predicat: (d) => etapeDossier(d) === 'REJETE' }
];
