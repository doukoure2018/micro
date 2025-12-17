export interface StockResponseDto {
    idCmd: number;
    numeroCommande: string;
    idUser: number;
    service: string;
    detailBonCommande: string;
    dateCreation: Date | string;
    pointventeId?: number;
    pointventeLibele?: string;
    agenceId?: number;
    agenceLibele?: string;
    delegationId?: number;
    delegationLibele?: string;
    categorieId?: number;
    categorieLibele?: string;
    status: string;
    motif?: string;
    traitePar?: number;
    observations?: string;
    dateTraitement?: Date | string;
    username?: string;
    userFullName?: string;
    stateValidation?: string;
    qte?: number;
    
    // Nouveaux champs pour la suggestion de quantité
    qteActuelle?: number;
    qteSuggeree?: number;
    motifQte?: string;
    suggerePar?: number;
    suggereParFullName?: string;
    dateSuggestion?: Date | string;
}

/**
 * DTO pour la suggestion de modification de quantité par le DE
 */
export interface SuggestionQuantiteDto {
    qteSuggeree: number;
    motifQte?: string;
    observations?: string;
    garderQuantite?: boolean;
}
