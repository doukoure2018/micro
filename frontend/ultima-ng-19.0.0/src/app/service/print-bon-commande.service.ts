import { Injectable } from '@angular/core';
import { BonCommandeDelegationDto } from '@/interface/BonCommandeDelegationDto';

@Injectable({
    providedIn: 'root'
})
export class PrintBonCommandeService {
    /**
     * Imprime le rapport des bons de commande
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
     * Génère le HTML pour l'impression
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

    /**
     * Génère le contenu principal du rapport
     */
    private genererContenu(delegation: string, bonsCommande: BonCommandeDelegationDto[], options: PrintBonCommandeOptions): string {
        const dateImpression = new Date().toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const stats = this.calculerStatistiques(bonsCommande);

        return `
            <div class="print-container">
                <!-- En-tête -->
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


                <!-- Liste des commandes -->
                ${this.genererListeCommandes(bonsCommande)}

                <!-- Pied de page -->
                <div class="footer">
                    <p>Document généré automatiquement le ${dateImpression}</p>
                    ${options.includeSignature ? '<div class="signature-section"><p>Signature du responsable: ___________________</p></div>' : ''}
                </div>
            </div>
        `;
    }

    /**
     * Calcule les statistiques des commandes
     */
    private calculerStatistiques(bonsCommande: BonCommandeDelegationDto[]): any {
        const total = bonsCommande.length;
        const enCours = bonsCommande.filter((b) => b.status === 'ENCOURS').length;
        const termine = bonsCommande.filter((b) => b.status === 'TERMINE').length;
        const annule = bonsCommande.filter((b) => b.status === 'ANNULE').length;

        return {
            total,
            enCours,
            termine,
            annule,
            pourcentageEnCours: total > 0 ? Math.round((enCours / total) * 100) : 0,
            pourcentageTermine: total > 0 ? Math.round((termine / total) * 100) : 0,
            pourcentageAnnule: total > 0 ? Math.round((annule / total) * 100) : 0
        };
    }

    /**
     * Génère la liste des commandes
     */
    private genererListeCommandes(bonsCommande: BonCommandeDelegationDto[]): string {
        return `
            <div class="section">
                <h2>DÉTAILS DES COMMANDES (${bonsCommande.length})</h2>
                ${bonsCommande.map((bon, index) => this.genererDetailCommande(bon, index + 1)).join('')}
            </div>
        `;
    }

    /**
     * Génère le détail d'une commande
     */
    private genererDetailCommande(bon: BonCommandeDelegationDto, numero: number): string {
        const statusClass = this.getStatusClass(bon.status);
        const statusLabel = this.getStatusLabel(bon.status);
        const detail = this.parseDetailCommande(bon.detailBonCommande);

        return `
            <div class="commande-card">
                <!-- En-tête de la commande -->
                <div class="commande-header">
                    <div class="commande-number">
                        <span class="number-badge">${numero}</span>
                        <strong>Commande N° ${bon.numeroCommande}</strong>
                    </div>
                    <div class="commande-status ${statusClass}">${statusLabel}</div>
                </div>

                <!-- Corps de la commande -->
                <div class="commande-body">
                    <div class="commande-grid">
                        <!-- Colonne gauche -->
                        <div class="commande-col">
                            <div class="info-group">
                                <div class="info-label">🔧 Service</div>
                                <div class="info-value">${bon.service}</div>
                            </div>
                            <div class="info-group">
                                <div class="info-label">📝 Détails de la commande</div>
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
                            <div class="info-group">
                                <div class="info-label">✉️ Email</div>
                                <div class="info-value">${bon.emailUtilisateur}</div>
                            </div>
                        </div>

                        <!-- Colonne droite -->
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
                                <div class="info-label">👨‍💼 Traité par</div>
                                <div class="info-value">${bon.nomCompletTraitant}</div>
                            </div>
                            <div class="info-group">
                                <div class="info-label">⏱️ Durée de traitement</div>
                                <div class="info-value highlight">${bon.dureeTraitementFormatee}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Section dates -->
                    <div class="dates-section">
                        <div class="date-item">
                            <strong>📅 Date de création:</strong> ${this.formatDate(bon.dateCreation)}
                        </div>
                        <div class="date-item">
                            <strong>✓ Date de traitement:</strong> ${this.formatDate(bon.dateTraitement)}
                        </div>
                    </div>

                    <!-- Observations -->
                    ${
                        bon.observations
                            ? `
                        <div class="observations-section">
                            <strong>💬 Observations:</strong>
                            <p>${bon.observations}</p>
                        </div>
                    `
                            : ''
                    }
                </div>
            </div>
        `;
    }

    /**
     * Parse le détail JSON de la commande
     */
    private parseDetailCommande(detail: string): string {
        if (!detail) return 'N/A';
        try {
            const parsed = JSON.parse(detail);
            return parsed.detailStandard || detail;
        } catch {
            return detail;
        }
    }

    /**
     * Formate une date
     */
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

    /**
     * Obtient la classe CSS du statut
     */
    private getStatusClass(status: string): string {
        const statusMap: { [key: string]: string } = {
            ENCOURS: 'status-warning',
            TERMINE: 'status-success',
            ANNULE: 'status-danger',
            EN_ATTENTE: 'status-info',
            VALIDE: 'status-success'
        };
        return statusMap[status] || 'status-secondary';
    }

    /**
     * Obtient le label du statut
     */
    private getStatusLabel(status: string): string {
        const statusLabels: { [key: string]: string } = {
            ENCOURS: 'En cours',
            TERMINE: 'Terminé',
            ANNULE: 'Annulé',
            EN_ATTENTE: 'En attente',
            VALIDE: 'Validé'
        };
        return statusLabels[status] || status;
    }

    /**
     * Retourne les styles CSS pour l'impression
     */
    private getStyles(): string {
        return `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: 11px;
                line-height: 1.4;
                color: #333;
                background: white;
            }

            .print-container {
                max-width: 210mm;
                margin: 0 auto;
                padding: 15mm;
            }

            /* En-tête */
            .header {
                text-align: center;
                margin-bottom: 25px;
                border-bottom: 3px solid #2c3e50;
                padding-bottom: 15px;
            }

            .header h1 {
                font-size: 26px;
                font-weight: bold;
                color: #2c3e50;
                margin-bottom: 12px;
                letter-spacing: 1px;
            }

            .header-info {
                display: flex;
                justify-content: space-around;
                flex-wrap: wrap;
            }

            .header-info p {
                margin: 4px 10px;
                font-size: 11px;
            }

            /* Sections */
            .section {
                margin-bottom: 25px;
                page-break-inside: avoid;
            }

            .section h2 {
                background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
                color: white;
                padding: 10px 15px;
                font-size: 14px;
                margin-bottom: 15px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            /* Statistiques */
            .stats-section {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                border: 2px solid #dee2e6;
            }

            .stats-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 15px;
                margin-top: 15px;
            }

            .stat-item {
                text-align: center;
                padding: 15px;
                border-radius: 8px;
                border: 2px solid;
            }

            .stat-item.total {
                background: #e3f2fd;
                border-color: #2196F3;
            }

            .stat-item.warning {
                background: #fff3e0;
                border-color: #ff9800;
            }

            .stat-item.success {
                background: #e8f5e9;
                border-color: #4caf50;
            }

            .stat-item.danger {
                background: #ffebee;
                border-color: #f44336;
            }

            .stat-icon {
                font-size: 28px;
                margin-bottom: 8px;
            }

            .stat-label {
                font-size: 10px;
                color: #666;
                margin-bottom: 5px;
                font-weight: 600;
                text-transform: uppercase;
            }

            .stat-value {
                font-size: 28px;
                font-weight: bold;
                color: #2c3e50;
                margin-bottom: 3px;
            }

            .stat-percent {
                font-size: 12px;
                color: #666;
                font-weight: 600;
            }

            /* Cartes de commandes */
            .commande-card {
                background: white;
                border: 2px solid #dee2e6;
                border-radius: 8px;
                margin-bottom: 20px;
                page-break-inside: avoid;
                overflow: hidden;
            }

            .commande-header {
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                padding: 12px 15px;
                border-bottom: 2px solid #dee2e6;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .commande-number {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 13px;
                font-weight: bold;
                color: #2c3e50;
            }

            .number-badge {
                background: #2c3e50;
                color: white;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 12px;
            }

            .commande-status {
                padding: 5px 12px;
                border-radius: 20px;
                font-weight: bold;
                font-size: 11px;
                text-transform: uppercase;
            }

            .status-warning {
                background: #fff3cd;
                color: #856404;
                border: 1px solid #ffc107;
            }

            .status-success {
                background: #d4edda;
                color: #155724;
                border: 1px solid #28a745;
            }

            .status-danger {
                background: #f8d7da;
                color: #721c24;
                border: 1px solid #dc3545;
            }

            .status-info {
                background: #d1ecf1;
                color: #0c5460;
                border: 1px solid #17a2b8;
            }

            .status-secondary {
                background: #e2e3e5;
                color: #383d41;
                border: 1px solid #6c757d;
            }

            .commande-body {
                padding: 15px;
            }

            .commande-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 15px;
            }

            .commande-col {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .info-group {
                border-bottom: 1px solid #e9ecef;
                padding-bottom: 8px;
            }

            .info-label {
                font-size: 10px;
                color: #6c757d;
                font-weight: 600;
                margin-bottom: 3px;
                text-transform: uppercase;
            }

            .info-value {
                font-size: 11px;
                color: #2c3e50;
                font-weight: 500;
            }

            .info-value.highlight {
                color: #2196F3;
                font-weight: bold;
            }

            .dates-section {
                background: #f8f9fa;
                padding: 10px 15px;
                border-radius: 6px;
                margin-top: 15px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
            }

            .date-item {
                font-size: 10px;
            }

            .date-item strong {
                color: #2c3e50;
            }

            .observations-section {
                background: #fff3cd;
                padding: 10px 15px;
                border-radius: 6px;
                margin-top: 15px;
                border-left: 4px solid #ffc107;
            }

            .observations-section strong {
                display: block;
                margin-bottom: 5px;
                color: #856404;
                font-size: 11px;
            }

            .observations-section p {
                color: #333;
                font-size: 10px;
                line-height: 1.5;
            }

            /* Pied de page */
            .footer {
                margin-top: 30px;
                padding-top: 15px;
                border-top: 2px solid #dee2e6;
                text-align: center;
                font-size: 10px;
                color: #6c757d;
            }

            .signature-section {
                margin-top: 25px;
                text-align: right;
                font-size: 11px;
            }

            /* Impression */
            @media print {
                body {
                    margin: 0;
                }

                .print-container {
                    padding: 10mm;
                }

                .commande-card {
                    page-break-inside: avoid;
                }

                .section {
                    page-break-inside: avoid;
                }

                .footer {
                    page-break-inside: avoid;
                }
            }

            @page {
                margin: 15mm;
                size: A4;
            }
        `;
    }
}

export interface PrintBonCommandeOptions {
    includeSignature?: boolean;
    autoClose?: boolean;
    title?: string;
}
