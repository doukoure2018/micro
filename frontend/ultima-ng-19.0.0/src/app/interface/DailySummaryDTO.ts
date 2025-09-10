export interface DailySummaryDTO {
    date: number[] | string; // [year, month, day] ou ISO string
    nombreMiddleware: number;
    nombreProduction: number;
    montantMiddleware: number;
    montantProduction: number;
    ecart: number;
    statut: 'OK' | 'ECART';
}
