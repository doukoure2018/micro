import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

export interface TransactionManquante {
    numTransaction: number;
    dateOperation: number[] | string;
    montant: number;
    typeOperation: string;
    codeClient: string;
    motifs: string;
    etatSaf: string;
    numCompte?: string;
    faitPar?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ExcelExportService {
    /**
     * Exporte les transactions manquantes vers un fichier Excel
     */
    exportTransactionsManquantesToExcel(transactions: TransactionManquante[], dateDebut: string, dateFin: string): void {
        if (!transactions || transactions.length === 0) {
            console.warn('Aucune transaction à exporter');
            return;
        }

        // Préparer les données pour l'export
        const dataForExport = this.prepareDataForExport(transactions);

        // Créer le workbook
        const wb = XLSX.utils.book_new();

        // Créer la feuille principale avec les transactions
        const ws = XLSX.utils.json_to_sheet(dataForExport);

        // Personnaliser la largeur des colonnes
        const colWidths = [
            { wch: 15 }, // Num Transaction
            { wch: 20 }, // Date/Heure
            { wch: 15 }, // Montant (GNF)
            { wch: 12 }, // Type
            { wch: 15 }, // Code Client
            { wch: 15 }, // Compte
            { wch: 30 }, // Motifs
            { wch: 15 }, // Opérateur
            { wch: 12 } // État
        ];
        ws['!cols'] = colWidths;

        // Ajouter la feuille au workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Transactions Manquantes');

        // Créer une feuille de résumé
        const summarySheet = this.createSummarySheet(transactions, dateDebut, dateFin);
        XLSX.utils.book_append_sheet(wb, summarySheet, 'Résumé');

        // Créer une feuille de statistiques
        const statsSheet = this.createStatisticsSheet(transactions);
        XLSX.utils.book_append_sheet(wb, statsSheet, 'Statistiques');

        // Générer le nom du fichier
        const fileName = `transactions_manquantes_${dateDebut}_${dateFin}.xlsx`;

        // Sauvegarder le fichier
        XLSX.writeFile(wb, fileName);
    }

    /**
     * Prépare les données pour l'export
     */
    private prepareDataForExport(transactions: TransactionManquante[]): any[] {
        return transactions.map((trans) => ({
            'Num Transaction': trans.numTransaction,
            'Date/Heure': this.formatDateTime(trans.dateOperation),
            'Montant (GNF)': trans.montant,
            Type: trans.typeOperation,
            'Code Client': trans.codeClient,
            Compte: trans.numCompte || '-',
            Motifs: trans.motifs || '-',
            Opérateur: trans.faitPar || '-',
            État: trans.etatSaf
        }));
    }

    /**
     * Crée une feuille de résumé
     */
    private createSummarySheet(transactions: TransactionManquante[], dateDebut: string, dateFin: string): XLSX.WorkSheet {
        const totalTransactions = transactions.length;
        const totalMontant = transactions.reduce((sum, t) => sum + t.montant, 0);
        const totalDepots = transactions.filter((t) => t.typeOperation === 'Depot').length;
        const totalRetraits = transactions.filter((t) => t.typeOperation === 'Retrait').length;
        const montantDepots = transactions.filter((t) => t.typeOperation === 'Depot').reduce((sum, t) => sum + t.montant, 0);
        const montantRetraits = transactions.filter((t) => t.typeOperation === 'Retrait').reduce((sum, t) => sum + t.montant, 0);

        const summaryData = [
            ['RAPPORT DE RAPPROCHEMENT - TRANSACTIONS MANQUANTES'],
            [''],
            ["Période d'analyse:", `Du ${dateDebut} au ${dateFin}`],
            ['Date de génération:', new Date().toLocaleString('fr-FR')],
            [''],
            ['RÉSUMÉ GÉNÉRAL'],
            ['Nombre total de transactions:', totalTransactions],
            ['Montant total:', `${this.formatMontant(totalMontant)} GNF`],
            [''],
            ['RÉPARTITION PAR TYPE'],
            ['Dépôts:', `${totalDepots} transactions`],
            ['Montant des dépôts:', `${this.formatMontant(montantDepots)} GNF`],
            ['Retraits:', `${totalRetraits} transactions`],
            ['Montant des retraits:', `${this.formatMontant(montantRetraits)} GNF`],
            [''],
            ['ANALYSE'],
            ['Écart identifié:', `${this.formatMontant(totalMontant)} GNF`],
            ['Action requise:', 'Vérification et synchronisation nécessaires']
        ];

        const ws = XLSX.utils.aoa_to_sheet(summaryData);

        // Personnaliser la largeur des colonnes
        ws['!cols'] = [{ wch: 30 }, { wch: 40 }];

        // Fusionner les cellules pour le titre
        ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];

        return ws;
    }

    /**
     * Crée une feuille de statistiques détaillées
     */
    private createStatisticsSheet(transactions: TransactionManquante[]): XLSX.WorkSheet {
        // Grouper par date
        const transactionsByDate = this.groupByDate(transactions);

        // Grouper par client
        const transactionsByClient = this.groupByClient(transactions);

        // Préparer les données statistiques
        const statsData: any[] = [['STATISTIQUES DÉTAILLÉES'], [''], ['PAR DATE']];

        // Ajouter les statistiques par date
        Object.entries(transactionsByDate).forEach(([date, trans]) => {
            const dayTotal = trans.reduce((sum, t) => sum + t.montant, 0);
            statsData.push([date, `${trans.length} transactions`, `${this.formatMontant(dayTotal)} GNF`]);
        });

        statsData.push(['']);
        statsData.push(['PAR CLIENT (Top 10)']);

        // Ajouter les statistiques par client (top 10)
        const topClients = Object.entries(transactionsByClient)
            .sort((a, b) => b[1].length - a[1].length)
            .slice(0, 10);

        topClients.forEach(([client, trans]) => {
            const clientTotal = trans.reduce((sum, t) => sum + t.montant, 0);
            statsData.push([client, `${trans.length} transactions`, `${this.formatMontant(clientTotal)} GNF`]);
        });

        // Ajouter une section pour les motifs récurrents
        statsData.push(['']);
        statsData.push(['MOTIFS RÉCURRENTS']);

        const motifsCounts = this.analyzeMotifs(transactions);
        Object.entries(motifsCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .forEach(([motif, count]) => {
                statsData.push([motif, `${count} occurrences`]);
            });

        const ws = XLSX.utils.aoa_to_sheet(statsData);

        // Personnaliser la largeur des colonnes
        ws['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 25 }];

        // Fusionner les cellules pour les titres
        ws['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
            { s: { r: 2, c: 0 }, e: { r: 2, c: 2 } }
        ];

        return ws;
    }

    /**
     * Groupe les transactions par date
     */
    private groupByDate(transactions: TransactionManquante[]): Record<string, TransactionManquante[]> {
        return transactions.reduce(
            (acc, trans) => {
                const date = this.formatDate(trans.dateOperation);
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(trans);
                return acc;
            },
            {} as Record<string, TransactionManquante[]>
        );
    }

    /**
     * Groupe les transactions par client
     */
    private groupByClient(transactions: TransactionManquante[]): Record<string, TransactionManquante[]> {
        return transactions.reduce(
            (acc, trans) => {
                const client = trans.codeClient || 'Non spécifié';
                if (!acc[client]) {
                    acc[client] = [];
                }
                acc[client].push(trans);
                return acc;
            },
            {} as Record<string, TransactionManquante[]>
        );
    }

    /**
     * Analyse les motifs récurrents
     */
    private analyzeMotifs(transactions: TransactionManquante[]): Record<string, number> {
        const motifsCounts: Record<string, number> = {};

        transactions.forEach((trans) => {
            if (trans.motifs) {
                // Nettoyer et normaliser le motif
                const motifClean = trans.motifs.toLowerCase().trim();

                // Identifier les mots-clés ou phrases courtes
                if (motifClean.length < 50) {
                    motifsCounts[motifClean] = (motifsCounts[motifClean] || 0) + 1;
                } else {
                    // Pour les motifs longs, extraire les premiers mots
                    const shortMotif = motifClean.substring(0, 30) + '...';
                    motifsCounts[shortMotif] = (motifsCounts[shortMotif] || 0) + 1;
                }
            }
        });

        return motifsCounts;
    }

    /**
     * Formate une date depuis un tableau ou une string
     */
    private formatDate(date: number[] | string): string {
        if (typeof date === 'string') return date;
        if (Array.isArray(date) && date.length >= 3) {
            return `${date[2].toString().padStart(2, '0')}/${date[1].toString().padStart(2, '0')}/${date[0]}`;
        }
        return '-';
    }

    /**
     * Formate une date et heure depuis un tableau ou une string
     */
    private formatDateTime(date: number[] | string): string {
        if (typeof date === 'string') return date;
        if (Array.isArray(date) && date.length >= 5) {
            return `${date[2].toString().padStart(2, '0')}/${date[1].toString().padStart(2, '0')}/${date[0]} ${date[3].toString().padStart(2, '0')}:${date[4].toString().padStart(2, '0')}`;
        }
        return '-';
    }

    /**
     * Formate un montant en GNF
     */
    private formatMontant(montant: number): string {
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(montant);
    }

    /**
     * Export avancé avec options personnalisées
     */
    exportWithOptions(
        transactions: TransactionManquante[],
        options: {
            includeResume?: boolean;
            includeStatistics?: boolean;
            includeCharts?: boolean;
            dateDebut: string;
            dateFin: string;
            fileName?: string;
        }
    ): void {
        if (!transactions || transactions.length === 0) {
            throw new Error('Aucune transaction à exporter');
        }

        const wb = XLSX.utils.book_new();

        // Toujours inclure la feuille principale
        const mainData = this.prepareDataForExport(transactions);
        const mainSheet = XLSX.utils.json_to_sheet(mainData);
        mainSheet['!cols'] = [{ wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 30 }, { wch: 15 }, { wch: 12 }];
        XLSX.utils.book_append_sheet(wb, mainSheet, 'Transactions');

        // Ajouter le résumé si demandé
        if (options.includeResume !== false) {
            const summarySheet = this.createSummarySheet(transactions, options.dateDebut, options.dateFin);
            XLSX.utils.book_append_sheet(wb, summarySheet, 'Résumé');
        }

        // Ajouter les statistiques si demandé
        if (options.includeStatistics !== false) {
            const statsSheet = this.createStatisticsSheet(transactions);
            XLSX.utils.book_append_sheet(wb, statsSheet, 'Statistiques');
        }

        // Générer le nom du fichier
        const fileName = options.fileName || `transactions_manquantes_${options.dateDebut}_${options.dateFin}.xlsx`;

        // Sauvegarder le fichier
        XLSX.writeFile(wb, fileName);
    }
}
