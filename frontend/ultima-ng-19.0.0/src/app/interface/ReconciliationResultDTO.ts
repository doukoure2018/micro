// ReconciliationResultDTO.ts
import { DailySummaryDTO } from './DailySummaryDTO';
import { OperationReserveDTO } from './OperationReserveDTO';
import { TransactionSafDTO } from './TransactionSafDTO';

export interface ReconciliationResultDTO {
    // Identifiants
    codeAgence: string;
    serialCaisse: number | null;

    // Période
    dateDebut: number[] | string;
    dateFin: number[] | string;
    nombreJours: number;
    date: number[] | string | null;

    // Statistiques Middleware - Clients
    totalDepotsMiddleware: number;
    totalRetraitsMiddleware: number;
    montantTotalDepotsMiddleware: number;
    montantTotalRetraitsMiddleware: number;
    depositsMiddleware: TransactionSafDTO[];
    withdrawalsMiddleware: TransactionSafDTO[];

    // Statistiques Production
    totalDepotsProduction: number;
    totalRetraitsProduction: number;
    montantTotalDepotsProduction: number;
    montantTotalRetraitsProduction: number;
    depositsProduction: any[];
    withdrawalsProduction: any[];

    // Opérations Réserve
    operationsReserve: OperationReserveDTO[];
    depositsReserve: OperationReserveDTO[];
    withdrawalsReserve: OperationReserveDTO[];
    totalOperationsReserve: number;
    totalDepotsReserve: number;
    totalRetraitsReserve: number;
    montantTotalReserve: number;
    montantTotalDepotsReserve: number;
    montantTotalRetraitsReserve: number;

    // Totaux généraux
    totalMiddleware: number;
    totalProduction: number;
    transactionsCorrespondantes: number;

    // Écarts
    transactionsManquantes: TransactionSafDTO[];
    transactionsEnErreur: TransactionSafDTO[];

    // Résumé
    dailySummaries: DailySummaryDTO[];
    montantTotalMiddleware: number;
    montantTotalProduction: number;
    montantEcart: number;

    // Statut
    statut: 'SYNCHRONISE' | 'ECART_DETECTE' | 'ERREUR';
    messageErreur: string | null;
    details: string | null;

    // Métadonnées
    dateRapprochement: number[] | string;
    executePar: string | null;
}
