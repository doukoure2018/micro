/** Signalement d'un numéro de téléphone client par un DA, DR ou DE (V156). */
export type StatutSignalementTelephone = 'NOUVEAU' | 'PRIS_EN_CHARGE' | 'TRAITE' | 'CLASSE';

export type MotifSignalementTelephone = 'INJOIGNABLE' | 'ERRONE' | 'ABSENT' | 'CHANGE' | 'AUTRE';

export interface SignalementTelephone {
    id: number;
    codCliente: string;
    nomClient?: string;
    numCredito?: number;

    codAgencia: string;
    pointVenteId?: number;
    pointVente?: string;
    agenceId?: number;
    delegationId?: number;

    telPrincipalConstate?: string;
    telSecundarioConstate?: string;
    telOtroConstate?: string;

    motif: MotifSignalementTelephone;
    commentaire?: string;
    statut: StatutSignalementTelephone;

    signaleParUserId?: number;
    signalePar?: string;
    signaleParRole?: string;
    signaleAt?: string;

    prisParUserId?: number;
    prisPar?: string;
    prisAt?: string;
    demandeId?: number;
    demandeStatut?: string;

    traiteAt?: string;
    classeAt?: string;
    motifClassement?: string;
    vuAt?: string;
}

export interface CreateSignalementTelephoneRequest {
    codCliente: string;
    nomClient?: string;
    numCredito?: number;
    codAgencia: string;
    motif: MotifSignalementTelephone;
    commentaire?: string;
}

/** Ce que le serveur autorise à l'utilisateur, avec les signalements déjà ouverts de son périmètre. */
export interface CapacitesSignalement {
    peutSignaler: boolean;
    estAgent: boolean;
    niveau: string;
    ouverts: { [codCliente: string]: SignalementTelephone };
}

export const MOTIFS_SIGNALEMENT: { label: string; value: MotifSignalementTelephone }[] = [
    { label: 'Numéro injoignable', value: 'INJOIGNABLE' },
    { label: 'Numéro erroné', value: 'ERRONE' },
    { label: 'Aucun numéro', value: 'ABSENT' },
    { label: 'Le client a changé de numéro', value: 'CHANGE' },
    { label: 'Autre', value: 'AUTRE' }
];

export function libelleMotifSignalement(motif?: string): string {
    return MOTIFS_SIGNALEMENT.find((m) => m.value === motif)?.label || 'Autre';
}

export function libelleStatutSignalement(statut?: string): string {
    switch (statut) {
        case 'NOUVEAU':
            return 'À traiter';
        case 'PRIS_EN_CHARGE':
            return 'Pris en charge';
        case 'TRAITE':
            return 'Traité';
        case 'CLASSE':
            return 'Classé sans suite';
        default:
            return '—';
    }
}

export function severiteStatutSignalement(statut?: string): 'danger' | 'warn' | 'success' | 'secondary' {
    switch (statut) {
        case 'NOUVEAU':
            return 'danger';
        case 'PRIS_EN_CHARGE':
            return 'warn';
        case 'TRAITE':
            return 'success';
        default:
            return 'secondary';
    }
}
