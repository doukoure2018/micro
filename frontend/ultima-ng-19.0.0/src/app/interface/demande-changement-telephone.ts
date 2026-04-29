export type StatutChangementTelephone = 'EN_ATTENTE_DA' | 'APPROUVE' | 'REJETE' | 'REJETE_DEFINITIF' | 'VALIDE_SAF';

export interface DemandeChangementTelephone {
    id?: number;
    codCliente: string;
    nomClient?: string;
    prenomClient?: string;
    ancienTelephone: string;
    nouveauTelephone: string;
    raisonModification: string;
    dateModificationSouhaitee: string; // ISO date

    statut?: StatutChangementTelephone;
    nombreRejets?: number;
    motifRejetCourant?: string;

    demandeParUserId?: number;
    demandeParNom?: string;
    demandeAt?: string;

    approuveParUserId?: number;
    approuveParNom?: string;
    approuveAt?: string;

    rejeteParUserId?: number;
    rejeteParNom?: string;
    rejeteAt?: string;

    valideSafParUserId?: number;
    valideSafParNom?: string;
    valideSafAt?: string;
    safResultCode?: number;
    safResultMessage?: string;

    delegationId?: number;
    delegationLibele?: string;
    agenceId?: number;
    agenceLibele?: string;
    pointVenteId?: number;
    pointVenteLibele?: string;

    createdAt?: string;
    updatedAt?: string;
}

export interface CreateDemandeTelephoneRequest {
    codCliente: string;
    nomClient?: string;
    prenomClient?: string;
    ancienTelephone: string;
    nouveauTelephone: string;
    raisonModification: string;
    dateModificationSouhaitee: string;
}

export interface RejetTelephoneRequest {
    motif: string;
    definitif: boolean;
}

export interface ResoumissionTelephoneRequest {
    nouveauTelephone: string;
    raisonModification: string;
}

export interface HistoriqueChangementTelephone {
    id: number;
    demandeId: number;
    cycleNumero: number;
    action: string;
    motif?: string;
    ancienTelephoneCycle?: string;
    nouveauTelephoneCycle?: string;
    parUserId: number;
    parNom?: string;
    parRole?: string;
    at: string;
}

export interface InspectionFiltre {
    delegationId?: number;
    agenceId?: number;
    pointVenteId?: number;
    statut?: StatutChangementTelephone;
}
