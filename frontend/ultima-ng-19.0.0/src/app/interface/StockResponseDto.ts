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
    qte?: number;
}
