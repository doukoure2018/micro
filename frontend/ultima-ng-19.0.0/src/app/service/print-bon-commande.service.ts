import { Injectable } from '@angular/core';
import { BonCommandeDelegationDto } from '@/interface/BonCommandeDelegationDto';
import { StockResponseDto } from '@/interface/StockResponseDto';

@Injectable({
    providedIn: 'root'
})
export class PrintBonCommandeService {
    /**
     * Imprime le rapport des bons de commande (version legacy)
     */
    imprimerRapport(delegation: string, bonsCommande: BonCommandeDelegationDto[], options: PrintBonCommandeOptions = {}): void {
        const printWindow = window.open('', '_blank', 'width=1200,height=800');
        if (!printWindow) {
            console.error("Impossible d'ouvrir la fenêtre d'impression");
            return;
        }

        const htmlContent = this.genererHTML(delegation, bonsCommande, options);

        printWindow.document.write(htmlContent);
        printWindow.document.close();

        // Attendre que le contenu soit chargé avant d'imprimer
        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.print();
                if (options.autoClose !== false) {
                    printWindow.close();
                }
            }, 500);
        };
    }

    /**
     * Imprime le rapport des bons acceptés pour la logistique
     */
    imprimerRapportLogistique(stocks: StockResponseDto[], options: PrintLogistiqueOptions = {}): void {
        const printWindow = window.open('', '_blank', 'width=1200,height=800');
        if (!printWindow) {
            console.error("Impossible d'ouvrir la fenêtre d'impression");
            return;
        }

        const htmlContent = this.genererHTMLLogistique(stocks, options);

        printWindow.document.write(htmlContent);
        printWindow.document.close();

        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.print();
                if (options.autoClose !== false) {
                    printWindow.close();
                }
            }, 500);
        };
    }

    /**
     * Génère le HTML pour le rapport logistique
     */
    private genererHTMLLogistique(stocks: StockResponseDto[], options: PrintLogistiqueOptions): string {
        const styles = this.getLogistiqueStyles();
        const content = this.genererContenuLogistique(stocks, options);

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Rapport Logistique - Bons de Commande Acceptés</title>
                <style>${styles}</style>
            </head>
            <body>
                ${content}
            </body>
            </html>
        `;
    }

    /**
     * Génère le contenu principal du rapport logistique
     */
    private genererContenuLogistique(stocks: StockResponseDto[], options: PrintLogistiqueOptions): string {
        const dateImpression = new Date().toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const stats = this.calculerStatistiquesLogistique(stocks);
        const parDelegation = this.grouperParDelegation(stocks);

        return `
            <div class="print-container">
                <!-- En-tête -->
                <div class="header">
                    <div class="logo-section">
                        <div class="company-name">${options.companyName || 'ENTREPRISE'}</div>
                    </div>
                    <div class="header-content">
                        <h1>📦 RAPPORT LOGISTIQUE</h1>
                        <h2>Bons de Commande Acceptés par le DE</h2>
                        <div class="header-meta">
                            <span class="meta-item">📅 ${dateImpression}</span>
                            <span class="meta-item">📋 ${stocks.length} commande(s)</span>
                            <span class="meta-item">📊 ${stats.totalQuantite} unité(s)</span>
                        </div>
                    </div>
                </div>

                <!-- Statistiques globales -->
                <div class="section stats-section">
                    <h3>📊 SYNTHÈSE GLOBALE</h3>
                    <div class="stats-grid">
                        <div class="stat-card stat-primary">
                            <div class="stat-icon">📋</div>
                            <div class="stat-info">
                                <div class="stat-value">${stats.totalCommandes}</div>
                                <div class="stat-label">Commandes</div>
                            </div>
                        </div>
                        <div class="stat-card stat-success">
                            <div class="stat-icon">📦</div>
                            <div class="stat-info">
                                <div class="stat-value">${stats.totalQuantite}</div>
                                <div class="stat-label">Unités totales</div>
                            </div>
                        </div>
                        <div class="stat-card stat-warning">
                            <div class="stat-icon">🔄</div>
                            <div class="stat-info">
                                <div class="stat-value">${stats.commandesModifiees}</div>
                                <div class="stat-label">Qté modifiées</div>
                            </div>
                        </div>
                        <div class="stat-card stat-info">
                            <div class="stat-icon">🏢</div>
                            <div class="stat-info">
                                <div class="stat-value">${stats.nombreDelegations}</div>
                                <div class="stat-label">Délégations</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Synthèse par délégation -->
                <div class="section">
                    <h3>🏢 SYNTHÈSE PAR DÉLÉGATION</h3>
                    <table class="summary-table">
                        <thead>
                            <tr>
                                <th style="width: 5%">#</th>
                                <th style="width: 35%">Délégation</th>
                                <th style="width: 20%" class="text-center">Nb Commandes</th>
                                <th style="width: 20%" class="text-center">Qté Demandée</th>
                                <th style="width: 20%" class="text-center">Qté Validée</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${parDelegation
                                .map(
                                    (d, i) => `
                                <tr>
                                    <td class="text-center">${i + 1}</td>
                                    <td><strong>${d.delegation}</strong></td>
                                    <td class="text-center"><span class="badge badge-primary">${d.count}</span></td>
                                    <td class="text-center">${d.qteDemandee}</td>
                                    <td class="text-center"><strong class="text-success">${d.qteValidee}</strong></td>
                                </tr>
                            `
                                )
                                .join('')}
                        </tbody>
                        <tfoot>
                            <tr class="total-row">
                                <td colspan="2"><strong>TOTAL</strong></td>
                                <td class="text-center"><strong>${stats.totalCommandes}</strong></td>
                                <td class="text-center"><strong>${stats.totalQteDemandee}</strong></td>
                                <td class="text-center"><strong class="text-success">${stats.totalQuantite}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <!-- Détail par commande (optionnel) -->
                ${options.includeDetails ? this.genererDetailsCommandes(stocks) : ''}

                <!-- Pied de page -->
                <div class="footer">
                    <div class="footer-content">
                        <p>Document généré automatiquement le ${dateImpression}</p>
                        <p class="text-small">Rapport logistique - Bons de commande acceptés par le Directeur d'Exploitation</p>
                    </div>
                    ${
                        options.includeSignature
                            ? `
                        <div class="signature-section">
                            <div class="signature-box">
                                <p>Responsable Logistique</p>
                                <div class="signature-line"></div>
                                <p class="signature-date">Date: _______________</p>
                            </div>
                            <div class="signature-box">
                                <p>Validation</p>
                                <div class="signature-line"></div>
                                <p class="signature-date">Date: _______________</p>
                            </div>
                        </div>
                    `
                            : ''
                    }
                </div>
            </div>
        `;
    }

    /**
     * Rendu de la quantité avec indication visuelle
     */
    private renderQuantite(stock: StockResponseDto): string {
        const qteValidee = stock.qteSuggeree || stock.qte;
        if (stock.qteSuggeree && stock.qteSuggeree !== stock.qte) {
            const diff = stock.qteSuggeree - (stock.qte || 0);
            const diffClass = diff > 0 ? 'text-success' : 'text-danger';
            const diffSign = diff > 0 ? '+' : '';
            return `<strong class="text-warning">${qteValidee}</strong> <small class="${diffClass}">(${diffSign}${diff})</small>`;
        }
        return `<strong>${qteValidee}</strong>`;
    }

    /**
     * Génère les détails complets de chaque commande
     */
    private genererDetailsCommandes(stocks: StockResponseDto[]): string {
        return `
            <div class="section">
                <h3>📄 FICHES DÉTAILLÉES</h3>
                ${stocks.map((stock, index) => this.genererFicheCommande(stock, index + 1)).join('')}
            </div>
        `;
    }

    /**
     * Génère la fiche détaillée d'une commande
     */
    private genererFicheCommande(stock: StockResponseDto, numero: number): string {
        const detail = this.parseDetailCommande(stock.detailBonCommande || '');
        const hasModification = stock.qteSuggeree && stock.qteSuggeree !== stock.qte;

        return `
            <div class="fiche-commande">
                <div class="fiche-header">
                    <div class="fiche-numero">
                        <span class="numero-badge">${numero}</span>
                        <strong>Commande N° ${stock.numeroCommande}</strong>
                    </div>
                    <div class="fiche-status status-accepted">✓ Accepté</div>
                </div>
                <div class="fiche-body">
                    <div class="fiche-grid">
                        <div class="fiche-col">
                            <div class="fiche-field">
                                <label>Service</label>
                                <span>${stock.service}</span>
                            </div>
                            <div class="fiche-field">
                                <label>Détails</label>
                                <span>${detail}</span>
                            </div>
                            <div class="fiche-field">
                                <label>Demandeur</label>
                                <span>${stock.userFullName || stock.username}</span>
                            </div>
                        </div>
                        <div class="fiche-col">
                            <div class="fiche-field">
                                <label>Délégation</label>
                                <span>${stock.delegationLibele || '-'}</span>
                            </div>
                            <div class="fiche-field">
                                <label>Agence</label>
                                <span>${stock.agenceLibele || '-'}</span>
                            </div>
                            <div class="fiche-field">
                                <label>Point de vente</label>
                                <span>${stock.pointventeLibele || '-'}</span>
                            </div>
                        </div>
                    </div>
                    <div class="fiche-quantites ${hasModification ? 'modified' : ''}">
                        <div class="qte-box">
                            <label>Qté demandée</label>
                            <span class="qte-value">${stock.qte}</span>
                        </div>
                        <div class="qte-arrow">→</div>
                        <div class="qte-box qte-finale">
                            <label>Qté validée</label>
                            <span class="qte-value">${stock.qteSuggeree || stock.qte}</span>
                        </div>
                        ${
                            hasModification && stock.motifQte
                                ? `
                            <div class="qte-motif">
                                <label>Motif</label>
                                <span>${stock.motifQte}</span>
                            </div>
                        `
                                : ''
                        }
                    </div>
                    <div class="fiche-dates">
                        <span>📅 Création: ${this.formatDateLogistique(stock.dateCreation)}</span>
                        <span>✓ Acceptation: ${this.formatDateLogistique(stock.dateTraitement)}</span>
                    </div>
                    ${
                        stock.observations
                            ? `
                        <div class="fiche-observations">
                            <label>Observations</label>
                            <p>${stock.observations}</p>
                        </div>
                    `
                            : ''
                    }
                </div>
            </div>
        `;
    }

    /**
     * Calcule les statistiques pour la logistique
     */
    private calculerStatistiquesLogistique(stocks: StockResponseDto[]): LogistiqueStats {
        const totalCommandes = stocks.length;
        const totalQuantite = stocks.reduce((sum, s) => sum + (s.qteSuggeree || s.qte || 0), 0);
        const totalQteDemandee = stocks.reduce((sum, s) => sum + (s.qte || 0), 0);
        const commandesModifiees = stocks.filter((s) => s.qteSuggeree && s.qteSuggeree !== s.qte).length;
        const delegations = new Set(stocks.map((s) => s.delegationLibele).filter(Boolean));

        return {
            totalCommandes,
            totalQuantite,
            totalQteDemandee,
            commandesModifiees,
            nombreDelegations: delegations.size
        };
    }

    /**
     * Groupe les stocks par délégation avec statistiques
     */
    private grouperParDelegation(stocks: StockResponseDto[]): DelegationGroup[] {
        const map = new Map<string, { count: number; qteDemandee: number; qteValidee: number }>();

        stocks.forEach((stock) => {
            const delegation = stock.delegationLibele || 'Non spécifiée';
            const existing = map.get(delegation) || { count: 0, qteDemandee: 0, qteValidee: 0 };
            map.set(delegation, {
                count: existing.count + 1,
                qteDemandee: existing.qteDemandee + (stock.qte || 0),
                qteValidee: existing.qteValidee + (stock.qteSuggeree || stock.qte || 0)
            });
        });

        return Array.from(map.entries())
            .map(([delegation, data]) => ({
                delegation,
                count: data.count,
                qteDemandee: data.qteDemandee,
                qteValidee: data.qteValidee
            }))
            .sort((a, b) => b.count - a.count);
    }

    /**
     * Formate une date pour la logistique
     */
    private formatDateLogistique(date: any): string {
        if (!date) return '-';

        let dateObj: Date;

        if (Array.isArray(date)) {
            dateObj = new Date(date[0], date[1] - 1, date[2], date[3] || 0, date[4] || 0);
        } else if (typeof date === 'string') {
            dateObj = new Date(date);
        } else {
            return '-';
        }

        return dateObj.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Styles CSS pour le rapport logistique
     */
    private getLogistiqueStyles(): string {
        return `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: 10px;
                line-height: 1.4;
                color: #1f2937;
                background: white;
            }

            .print-container {
                max-width: 210mm;
                margin: 0 auto;
                padding: 10mm;
            }

            /* En-tête */
            .header {
                background: linear-gradient(135deg, #059669 0%, #047857 100%);
                color: white;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 12px;
                text-align: center;
            }

            .company-name {
                font-size: 12px;
                font-weight: bold;
                letter-spacing: 2px;
                margin-bottom: 5px;
                opacity: 0.9;
            }

            .header h1 {
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 3px;
            }

            .header h2 {
                font-size: 12px;
                font-weight: normal;
                opacity: 0.9;
                margin-bottom: 10px;
            }

            .header-meta {
                display: flex;
                justify-content: center;
                gap: 20px;
                flex-wrap: wrap;
            }

            .meta-item {
                background: rgba(255, 255, 255, 0.2);
                padding: 5px 12px;
                border-radius: 15px;
                font-size: 11px;
            }

            /* Sections */
            .section {
                margin-bottom: 10px;
            }

            .section h3 {
                background: #f3f4f6;
                color: #374151;
                padding: 8px 12px;
                font-size: 12px;
                font-weight: bold;
                border-left: 4px solid #059669;
                margin-bottom: 10px;
            }

            /* Statistiques */
            .stats-section {
                background: #f8fafc;
                padding: 10px;
                border-radius: 10px;
                border: 1px solid #e5e7eb;
            }

            .stats-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
            }

            .stat-card {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 10px;
                border-radius: 8px;
                background: white;
                border: 2px solid;
            }

            .stat-card.stat-primary {
                border-color: #3b82f6;
                background: #eff6ff;
            }

            .stat-card.stat-success {
                border-color: #22c55e;
                background: #f0fdf4;
            }

            .stat-card.stat-warning {
                border-color: #f59e0b;
                background: #fffbeb;
            }

            .stat-card.stat-info {
                border-color: #06b6d4;
                background: #ecfeff;
            }

            .stat-icon {
                font-size: 18px;
            }

            .stat-info .stat-value {
                font-size: 18px;
                font-weight: bold;
                color: #1f2937;
            }

            .stat-info .stat-label {
                font-size: 10px;
                color: #6b7280;
                text-transform: uppercase;
            }

            /* Tableaux */
            .summary-table, .detail-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 10px;
            }

            .summary-table th, .detail-table th {
                background: #374151;
                color: white;
                padding: 10px 8px;
                text-align: left;
                font-weight: 600;
                font-size: 9px;
                text-transform: uppercase;
            }

            .summary-table td, .detail-table td {
                padding: 8px;
                border-bottom: 1px solid #e5e7eb;
                vertical-align: middle;
            }

            .summary-table tbody tr:hover, .detail-table tbody tr:hover {
                background: #f9fafb;
            }

            .summary-table tfoot .total-row {
                background: #f3f4f6;
                font-weight: bold;
            }

            .summary-table tfoot .total-row td {
                border-top: 2px solid #374151;
                padding: 12px 8px;
            }

            .detail-table .row-modified {
                background: #fefce8;
            }

            .text-center {
                text-align: center;
            }

            .text-right {
                text-align: right;
            }

            .text-small {
                font-size: 9px;
            }

            .text-muted {
                color: #9ca3af;
            }

            .text-success {
                color: #16a34a;
            }

            .text-warning {
                color: #d97706;
            }

            .text-danger {
                color: #dc2626;
            }

            .badge {
                display: inline-block;
                padding: 3px 8px;
                border-radius: 10px;
                font-size: 10px;
                font-weight: bold;
            }

            .badge-primary {
                background: #dbeafe;
                color: #1d4ed8;
            }

            /* Fiches détaillées */
            .fiche-commande {
                border: 1px solid #e5e7eb;
                border-radius: 6px;
                margin-bottom: 10px;
                page-break-inside: avoid;
                overflow: hidden;
            }

            .fiche-header {
                background: #f3f4f6;
                padding: 8px 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #e5e7eb;
            }

            .fiche-numero {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 12px;
            }

            .numero-badge {
                background: #374151;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                font-weight: bold;
            }

            .fiche-status {
                padding: 4px 10px;
                border-radius: 15px;
                font-size: 10px;
                font-weight: bold;
            }

            .status-accepted {
                background: #dcfce7;
                color: #166534;
            }

            .fiche-body {
                padding: 10px;
            }

            .fiche-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-bottom: 10px;
            }

            .fiche-field {
                margin-bottom: 5px;
            }

            .fiche-field label {
                display: block;
                font-size: 9px;
                color: #6b7280;
                text-transform: uppercase;
                margin-bottom: 2px;
            }

            .fiche-field span {
                font-size: 11px;
                color: #1f2937;
            }

            .fiche-quantites {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px;
                background: #f9fafb;
                border-radius: 6px;
                margin-bottom: 8px;
            }

            .fiche-quantites.modified {
                background: #fefce8;
                border: 1px solid #fcd34d;
            }

            .qte-box {
                text-align: center;
            }

            .qte-box label {
                display: block;
                font-size: 9px;
                color: #6b7280;
                margin-bottom: 4px;
            }

            .qte-value {
                font-size: 18px;
                font-weight: bold;
                color: #374151;
            }

            .qte-finale .qte-value {
                color: #059669;
            }

            .qte-arrow {
                font-size: 18px;
                color: #9ca3af;
            }

            .qte-motif {
                flex: 1;
                padding-left: 15px;
                border-left: 2px solid #fcd34d;
            }

            .qte-motif label {
                display: block;
                font-size: 9px;
                color: #6b7280;
                margin-bottom: 2px;
            }

            .qte-motif span {
                font-size: 10px;
                color: #92400e;
                font-style: italic;
            }

            .fiche-dates {
                display: flex;
                gap: 15px;
                font-size: 9px;
                color: #6b7280;
                margin-bottom: 6px;
            }

            .fiche-observations {
                background: #fef3c7;
                padding: 10px;
                border-radius: 6px;
                border-left: 3px solid #f59e0b;
            }

            .fiche-observations label {
                display: block;
                font-size: 9px;
                color: #92400e;
                font-weight: bold;
                margin-bottom: 4px;
            }

            .fiche-observations p {
                font-size: 10px;
                color: #78350f;
                margin: 0;
            }

            /* Pied de page */
            .footer {
                margin-top: 15px;
                padding-top: 10px;
                border-top: 2px solid #e5e7eb;
            }

            .footer-content {
                text-align: center;
                color: #6b7280;
                margin-bottom: 10px;
            }

            .signature-section {
                display: flex;
                justify-content: space-around;
                margin-top: 30px;
            }

            .signature-box {
                text-align: center;
                min-width: 200px;
            }

            .signature-box p {
                font-weight: bold;
                margin-bottom: 40px;
            }

            .signature-line {
                border-bottom: 1px solid #374151;
                margin-bottom: 10px;
            }

            .signature-date {
                font-size: 10px;
                color: #6b7280;
            }

            /* Utilitaires */
            .page-break-before {
                page-break-before: always;
            }

            /* Impression */
            @media print {
                body {
                    margin: 0;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }

                .print-container {
                    padding: 5mm;
                }

                .fiche-commande, .section {
                    page-break-inside: avoid;
                }

                .header {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
            }

            @page {
                margin: 10mm;
                size: A4;
            }
        `;
    }

    // ============ MÉTHODES LEGACY (conservées pour compatibilité) ============

    /**
     * Génère le HTML pour l'impression (legacy)
     */
    private genererHTML(delegation: string, bonsCommande: BonCommandeDelegationDto[], options: PrintBonCommandeOptions): string {
        const styles = this.getStyles();
        const content = this.genererContenu(delegation, bonsCommande, options);

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Rapport des Bons de Commande - ${delegation}</title>
                <style>${styles}</style>
            </head>
            <body>
                ${content}
            </body>
            </html>
        `;
    }

    private genererContenu(delegation: string, bonsCommande: BonCommandeDelegationDto[], options: PrintBonCommandeOptions): string {
        const dateImpression = new Date().toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <div class="print-container">
                <div class="header">
                    <div class="header-content">
                        <h1>RAPPORT DES BONS DE COMMANDE</h1>
                        <div class="header-info">
                            <p><strong>Délégation:</strong> ${delegation}</p>
                            <p><strong>Date d'impression:</strong> ${dateImpression}</p>
                            <p><strong>Nombre de commandes:</strong> ${bonsCommande.length}</p>
                        </div>
                    </div>
                </div>
                ${this.genererListeCommandes(bonsCommande)}
                <div class="footer">
                    <p>Document généré automatiquement le ${dateImpression}</p>
                    ${options.includeSignature ? '<div class="signature-section"><p>Signature du responsable: ___________________</p></div>' : ''}
                </div>
            </div>
        `;
    }

    private genererListeCommandes(bonsCommande: BonCommandeDelegationDto[]): string {
        return `
            <div class="section">
                <h2>DÉTAILS DES COMMANDES (${bonsCommande.length})</h2>
                ${bonsCommande.map((bon, index) => this.genererDetailCommande(bon, index + 1)).join('')}
            </div>
        `;
    }

    private genererDetailCommande(bon: BonCommandeDelegationDto, numero: number): string {
        const statusClass = this.getStatusClass(bon.status);
        const statusLabel = this.getStatusLabel(bon.status);
        const detail = this.parseDetailCommande(bon.detailBonCommande);

        return `
            <div class="commande-card">
                <div class="commande-header">
                    <div class="commande-number">
                        <span class="number-badge">${numero}</span>
                        <strong>Commande N° ${bon.numeroCommande}</strong>
                    </div>
                    <div class="commande-status ${statusClass}">${statusLabel}</div>
                </div>
                <div class="commande-body">
                    <div class="commande-grid">
                        <div class="commande-col">
                            <div class="info-group">
                                <div class="info-label">🔧 Service</div>
                                <div class="info-value">${bon.service}</div>
                            </div>
                            <div class="info-group">
                                <div class="info-label">📝 Détails</div>
                                <div class="info-value">${detail}</div>
                            </div>
                            <div class="info-group">
                                <div class="info-label">👤 Utilisateur</div>
                                <div class="info-value">${bon.nomCompletUtilisateur}</div>
                            </div>
                            <div class="info-group">
                                <div class="info-label">📞 Contact</div>
                                <div class="info-value">${bon.contactUtilisateur || 'N/A'}</div>
                            </div>
                        </div>
                        <div class="commande-col">
                            <div class="info-group">
                                <div class="info-label">📍 Délégation</div>
                                <div class="info-value">${bon.delegation}</div>
                            </div>
                            <div class="info-group">
                                <div class="info-label">🏢 Agence</div>
                                <div class="info-value">${bon.agence}</div>
                            </div>
                            <div class="info-group">
                                <div class="info-label">🏪 Point de Vente</div>
                                <div class="info-value">${bon.pointVente} (${bon.codePointVente})</div>
                            </div>
                            <div class="info-group">
                                <div class="info-label">⏱️ Durée traitement</div>
                                <div class="info-value highlight">${bon.dureeTraitementFormatee}</div>
                            </div>
                        </div>
                    </div>
                    <div class="dates-section">
                        <div class="date-item"><strong>📅 Création:</strong> ${this.formatDate(bon.dateCreation)}</div>
                        <div class="date-item"><strong>✓ Traitement:</strong> ${this.formatDate(bon.dateTraitement)}</div>
                    </div>
                    ${bon.observations ? `<div class="observations-section"><strong>💬 Observations:</strong><p>${bon.observations}</p></div>` : ''}
                </div>
            </div>
        `;
    }

    private parseDetailCommande(detail: string): string {
        if (!detail) return 'N/A';
        try {
            const parsed = JSON.parse(detail);
            return parsed.detailStandard || detail;
        } catch {
            return detail;
        }
    }

    private formatDate(date: string | number[]): string {
        if (!date) return 'N/A';
        let dateObj: Date;
        if (Array.isArray(date)) {
            dateObj = new Date(date[0], date[1] - 1, date[2], date[3] || 0, date[4] || 0, date[5] || 0);
        } else if (typeof date === 'string') {
            dateObj = new Date(date);
        } else {
            return 'N/A';
        }
        return dateObj.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    private getStatusClass(status: string): string {
        const statusMap: { [key: string]: string } = {
            ENCOURS: 'status-warning',
            TERMINE: 'status-success',
            ANNULE: 'status-danger',
            EN_ATTENTE: 'status-info',
            VALIDE: 'status-success',
            ACCEPTE: 'status-success'
        };
        return statusMap[status] || 'status-secondary';
    }

    private getStatusLabel(status: string): string {
        const statusLabels: { [key: string]: string } = {
            ENCOURS: 'En cours',
            TERMINE: 'Terminé',
            ANNULE: 'Annulé',
            EN_ATTENTE: 'En attente',
            VALIDE: 'Validé',
            ACCEPTE: 'Accepté'
        };
        return statusLabels[status] || status;
    }

    private getStyles(): string {
        return `
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 11px; line-height: 1.4; color: #333; background: white; }
            .print-container { max-width: 210mm; margin: 0 auto; padding: 15mm; }
            .header { text-align: center; margin-bottom: 25px; border-bottom: 3px solid #2c3e50; padding-bottom: 15px; }
            .header h1 { font-size: 26px; font-weight: bold; color: #2c3e50; margin-bottom: 12px; }
            .header-info { display: flex; justify-content: space-around; flex-wrap: wrap; }
            .header-info p { margin: 4px 10px; font-size: 11px; }
            .section { margin-bottom: 25px; page-break-inside: avoid; }
            .section h2 { background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); color: white; padding: 10px 15px; font-size: 14px; margin-bottom: 15px; font-weight: bold; }
            .commande-card { background: white; border: 2px solid #dee2e6; border-radius: 8px; margin-bottom: 20px; page-break-inside: avoid; overflow: hidden; }
            .commande-header { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 12px 15px; border-bottom: 2px solid #dee2e6; display: flex; justify-content: space-between; align-items: center; }
            .commande-number { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: bold; color: #2c3e50; }
            .number-badge { background: #2c3e50; color: white; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; }
            .commande-status { padding: 5px 12px; border-radius: 20px; font-weight: bold; font-size: 11px; text-transform: uppercase; }
            .status-warning { background: #fff3cd; color: #856404; border: 1px solid #ffc107; }
            .status-success { background: #d4edda; color: #155724; border: 1px solid #28a745; }
            .status-danger { background: #f8d7da; color: #721c24; border: 1px solid #dc3545; }
            .status-info { background: #d1ecf1; color: #0c5460; border: 1px solid #17a2b8; }
            .status-secondary { background: #e2e3e5; color: #383d41; border: 1px solid #6c757d; }
            .commande-body { padding: 15px; }
            .commande-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px; }
            .commande-col { display: flex; flex-direction: column; gap: 10px; }
            .info-group { border-bottom: 1px solid #e9ecef; padding-bottom: 8px; }
            .info-label { font-size: 10px; color: #6c757d; font-weight: 600; margin-bottom: 3px; text-transform: uppercase; }
            .info-value { font-size: 11px; color: #2c3e50; font-weight: 500; }
            .info-value.highlight { color: #2196F3; font-weight: bold; }
            .dates-section { background: #f8f9fa; padding: 10px 15px; border-radius: 6px; margin-top: 15px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .date-item { font-size: 10px; }
            .date-item strong { color: #2c3e50; }
            .observations-section { background: #fff3cd; padding: 10px 15px; border-radius: 6px; margin-top: 15px; border-left: 4px solid #ffc107; }
            .observations-section strong { display: block; margin-bottom: 5px; color: #856404; font-size: 11px; }
            .observations-section p { color: #333; font-size: 10px; line-height: 1.5; }
            .footer { margin-top: 30px; padding-top: 15px; border-top: 2px solid #dee2e6; text-align: center; font-size: 10px; color: #6c757d; }
            .signature-section { margin-top: 25px; text-align: right; font-size: 11px; }
            @media print { body { margin: 0; } .print-container { padding: 10mm; } .commande-card { page-break-inside: avoid; } .section { page-break-inside: avoid; } .footer { page-break-inside: avoid; } }
            @page { margin: 15mm; size: A4; }
        `;
    }
}

// Interfaces
export interface PrintBonCommandeOptions {
    includeSignature?: boolean;
    autoClose?: boolean;
    title?: string;
}

export interface PrintLogistiqueOptions {
    includeSignature?: boolean;
    includeDetails?: boolean;
    autoClose?: boolean;
    companyName?: string;
}

interface LogistiqueStats {
    totalCommandes: number;
    totalQuantite: number;
    totalQteDemandee: number;
    commandesModifiees: number;
    nombreDelegations: number;
}

interface DelegationGroup {
    delegation: string;
    count: number;
    qteDemandee: number;
    qteValidee: number;
}
