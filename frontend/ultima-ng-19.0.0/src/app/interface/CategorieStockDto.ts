export interface CategorieStockDto {
    id: number;
    libele: string;
    description?: string;
    actif: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}
