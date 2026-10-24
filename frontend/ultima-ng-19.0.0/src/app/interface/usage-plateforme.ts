/** Baromètre d'usage de digi (V174, lot 1) : ce que la plateforme compte d'elle-même sur une semaine. */

export interface JourUsage {
    jour: string;
    libelle: string;
    connexions: number;
    utilisateurs: number;
    dossiersIndividuels: number;
    dossiersGroupe: number;
    dossiersFonctionnaire: number;
    agentsNotes: number;
}

export interface RoleUsage {
    role: string;
    libelle: string;
    comptes: number;
    actifs: number;
    connexions: number;
}

export interface DelegationUsage {
    id: number;
    libelle: string;
    comptes: number;
    actifs: number;
    connexions: number;
    dossiersCrees: number;
    dossiersValides: number;
    psProducteurs: number;
    psTotal: number;
    affectations: number;
    partActifs: number;
}

export interface ExecutionAlerte {
    job: string;
    jour: string;
    heure: string;
    statut: string;
    tentative: number;
    nbEcheances: number | null;
    nbImpayes: number | null;
    nbAgents: number | null;
    nbDa: number | null;
    nbDr: number | null;
    nbDe: number | null;
    message: string | null;
}

export interface ResumeSemaine {
    debut: string;
    fin: string;
    connexions: number;
    utilisateursActifs: number;
    agentsActifs: number;
    dossiersCrees: number;
    dossiersValides: number;
    psProducteurs: number;
    affectations: number;
    alertesEnvoyees: number;
}

export interface UsageSemaine {
    debut: string;
    fin: string;
    libellePeriode: string;
    perimetre: string;
    toutReseau: boolean;
    montants: boolean;

    comptesActifs: number;
    utilisateursActifs: number;
    connexions: number;
    jamaisConnectes: number;
    agentsComptes: number;
    agentsActifs: number;
    roles: RoleUsage[];

    psProducteurs: number;
    psTotal: number;

    dossiersCrees: number;
    dossiersGroupe: number;
    dossiersFonctionnaire: number;
    dossiersValides: number;
    montantValide: number | null;

    evenements: number;
    acteurs: number;
    rejets: number;
    annulations: number;
    reattributions: number;
    delaiMedianJours: number | null;
    delaiMoyenJours: number | null;

    affectations: number;
    daAyantAffecte: number;
    affectationsCloses: number;
    affectationsActives: number;
    agentsPorteurs: number;
    agentsNotes: number;

    alertesAgents: number;
    alertesDa: number;
    alertesDr: number;
    alertesDe: number;
    alertesTechniques: number;
    alertesEnvoyees: number;
    joursAvecDigest: number;
    executions: ExecutionAlerte[];

    fichesCorrigees: number;
    correctionsAnnulees: number;
    telephonesDemandes: number;
    signalements: number;

    jours: JourUsage[];
    delegations: DelegationUsage[];
    precedente: ResumeSemaine | null;
    avertissement: string | null;
}
