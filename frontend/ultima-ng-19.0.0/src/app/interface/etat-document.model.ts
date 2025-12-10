// src/app/interface/etat-document.model.ts

export type StatutDocument = 'ENCOURS' | 'VALIDE' | 'ACCEPTE' | 'REJET';

export interface UserInfoDto {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    imageUrl: string;
}

export interface DelegationDto {
    id: number;
    libele: string;
}

export interface AgenceDto {
    id: number;
    libele: string;
    delegationId: number;
}

export interface PointVenteDto {
    id: number;
    libele: string;
    code: string;
    delegationId: number;
    agenceId: number;
}

export interface DocumentCartePrepaidDto {
    id: number;
    idEtatDoc: number;
    doc: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
}

export interface EtatDocumentByDelegationDto {
    id: number;
    statut: StatutDocument;
    createdAt: string;
    updatedAt: string;
    userId: number;
    userFullName: string;
    userPhone: string;
    delegationId: number;
    delegationLibele: string;
    agenceId: number;
    agenceLibele: string;
    pointVenteId: number;
    pointVenteLibele: string;
    documentCount: number;
}

export interface EtatDocumentDetailDto {
    id: number;
    statut: StatutDocument;
    createdAt: string;
    updatedAt: string;
    user: UserInfoDto;
    delegation: DelegationDto;
    agence: AgenceDto;
    pointVente: PointVenteDto;
    documents: DocumentCartePrepaidDto[];
    documentCount: number;
}

export interface DelegationStats {
    delegationId: number;
    delegationLibele: string;
    totalEtats: number;
    encoursCount: number;
    valideCount: number;
    accepteCount: number;
    rejetCount: number;
}

// Grouper les états par délégation
export interface EtatsParDelegation {
    delegation: DelegationDto;
    etats: EtatDocumentByDelegationDto[];
    stats: {
        total: number;
        encours: number;
        valide: number;
        accepte: number;
        rejet: number;
    };
}
