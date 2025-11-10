export interface CreateStockDto {
    idUser: number;
    service: string;
    detailBonCommande?: string;
    pointventeId?: number;
    agenceId?: number;
    delegationId?: number;
    categorieId?: number;
    observations?: string;
    qte?: number;
}
