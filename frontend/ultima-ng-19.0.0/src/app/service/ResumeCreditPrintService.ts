import { Injectable } from '@angular/core';

export interface ResumePrintOptions {
    includeEvaluation?: boolean;
    includeRatios?: boolean;
    includeRecommandations?: boolean;
    includeSignature?: boolean;
    title?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ResumeCreditPrintService {
    /**
     * Imprime le résumé de crédit organisé en 4 pages
     */
    imprimerResumeCredit(data: any, options: ResumePrintOptions = {}): void {
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (!printWindow) {
            console.error("Impossible d'ouvrir la fenêtre d'impression");
            return;
        }

        const html = this.genererHTMLComplet(data, options);

        printWindow.document.write(html);
        printWindow.document.close();

        // Attendre le chargement complet avant d'imprimer
        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.print();
            }, 500);
        };
    }

    /**
     * Génère le HTML complet pour l'impression
     */
    private genererHTMLComplet(data: any, options: ResumePrintOptions): string {
        return `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <title>${options.title || "Résumé d'Analyse de Crédit"}</title>
                ${this.genererStyles()}
            </head>
            <body>
                ${this.genererPage1InformationsGenerales(data)}
                ${this.genererPage2Exploitation(data)}
                ${this.genererPage3ResumeAnalyse(data)}
                ${this.genererPage4PersonnesCaution(data, options.includeSignature)}
            </body>
            </html>
        `;
    }

    /**
     * PAGE 1 : INFORMATIONS GÉNÉRALES
     */
    private genererPage1InformationsGenerales(data: any): string {
        const formatCurrency = (value: number) => {
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'GNF',
                minimumFractionDigits: 0
            }).format(value || 0);
        };

        return `
            <div class="page">
                <div class="header">
                    <h1>RÉSUMÉ D'ANALYSE DE CRÉDIT</h1>
                    <h2>PAGE 1 : INFORMATIONS GÉNÉRALES</h2>
                    <div class="date">Date : ${new Date().toLocaleDateString('fr-FR')}</div>
                </div>

                <!-- Informations de la demande -->
                <div class="section">
                    <h3>DEMANDE DE CRÉDIT</h3>
                    <table class="info-table">
                        <tr>
                            <td><strong>Montant demandé :</strong></td>
                            <td>${formatCurrency(data.montantDemande)}</td>
                            <td><strong>Date demande :</strong></td>
                            <td>${data.demandeCredit?.[0]?.value || '-'}</td>
                        </tr>
                        <tr>
                            <td><strong>Durée :</strong></td>
                            <td>${data.demandeCredit?.[2]?.value || '-'}</td>
                            <td><strong>Mensualité estimée :</strong></td>
                            <td>${data.demandeCredit?.[4]?.value || '-'}</td>
                        </tr>
                        <tr>
                            <td><strong>Objet du financement :</strong></td>
                            <td colspan="3">${data.demandeCredit?.[3]?.value || '-'}</td>
                        </tr>
                    </table>
                </div>

                <!-- Informations du promoteur -->
                <div class="section">
                    <h3>INFORMATIONS DU PROMOTEUR</h3>
                    <table class="info-table">
                        ${data.promoteur
                            ?.map((item: any, index: number) =>
                                index % 2 === 0
                                    ? `
                            <tr>
                                <td><strong>${item.label} :</strong></td>
                                <td>${item.value}</td>
                                ${
                                    data.promoteur[index + 1]
                                        ? `
                                    <td><strong>${data.promoteur[index + 1].label} :</strong></td>
                                    <td>${data.promoteur[index + 1].value}</td>
                                `
                                        : '<td></td><td></td>'
                                }
                            </tr>
                            `
                                    : ''
                            )
                            .join('')}
                    </table>
                </div>

                <!-- Informations de l'entreprise -->
                <div class="section">
                    <h3>INFORMATIONS DE L'ENTREPRISE</h3>
                    <table class="info-table">
                        ${data.entreprise
                            ?.map((item: any, index: number) =>
                                index % 2 === 0
                                    ? `
                            <tr>
                                <td><strong>${item.label} :</strong></td>
                                <td>${item.value}</td>
                                ${
                                    data.entreprise[index + 1]
                                        ? `
                                    <td><strong>${data.entreprise[index + 1].label} :</strong></td>
                                    <td>${data.entreprise[index + 1].value}</td>
                                `
                                        : '<td></td><td></td>'
                                }
                            </tr>
                            `
                                    : ''
                            )
                            .join('')}
                    </table>
                </div>

                <!-- Bilans financiers -->
                <div class="section">
                    <h3>BILANS FINANCIERS</h3>
                    <div class="bilan-container">
                        <div class="bilan-column">
                            <h4>Bilan Entreprise</h4>
                            <table class="small-table">
                                ${data.bilanEntreprise
                                    ?.slice(0, 7)
                                    .map(
                                        (item: any) => `
                                    <tr>
                                        <td>${item.label}</td>
                                        <td class="text-right">${item.value}</td>
                                    </tr>
                                `
                                    )
                                    .join('')}
                            </table>
                        </div>
                        <div class="bilan-column">
                            <h4>Patrimoine Personnel</h4>
                            <table class="small-table">
                                ${data.bilanPersonnel
                                    ?.map(
                                        (item: any) => `
                                    <tr ${item.isTotal ? 'class="total-row"' : ''}>
                                        <td>${item.label}</td>
                                        <td class="text-right">${item.value}</td>
                                    </tr>
                                `
                                    )
                                    .join('')}
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Informations administratives -->
                ${
                    data.informationsAdministratives
                        ? `
                <div class="section">
                    <h3>TRAÇABILITÉ ADMINISTRATIVE</h3>
                    <table class="info-table">
                        <tr>
                            <td><strong>Délégation :</strong></td>
                            <td>${data.informationsAdministratives.delegation || '-'}</td>
                            <td><strong>Agence :</strong></td>
                            <td>${data.informationsAdministratives.agence || '-'}</td>
                        </tr>
                        <tr>
                            <td><strong>Point de vente :</strong></td>
                            <td>${data.informationsAdministratives.pointVente || '-'}</td>
                            <td><strong>Agent traitant :</strong></td>
                            <td>${data.informationsAdministratives.utilisateurTraitant || '-'}</td>
                        </tr>
                    </table>
                </div>
                `
                        : ''
                }

                <div class="footer">
                    <p><strong>NB: L'emprunteur et l'agent de crédit doivent parapher toutes les pages.</strong></p>
                    <div class="paraphe-zone">
                        <div>Paraphe emprunteur : ________</div>
                        <div>Paraphe agent : ________</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * PAGE 2 : EXPLOITATION
     */
    private genererPage2Exploitation(data: any): string {
        return `
            <div class="page">
                <div class="header">
                    <h1>RÉSUMÉ D'ANALYSE DE CRÉDIT</h1>
                    <h2>PAGE 2 : EXPLOITATION</h2>
                    <div class="date">Date : ${new Date().toLocaleDateString('fr-FR')}</div>
                </div>

                <!-- Exploitation Actuelle -->
                <div class="section">
                    <h3>EXPLOITATION ACTUELLE</h3>
                    <table class="info-table">
                        ${data.exploitationActuelle
                            ?.map(
                                (item: any) => `
                            <tr ${item.isTotal ? 'class="total-row"' : ''} ${item.isRatio ? 'class="ratio-row"' : ''}>
                                <td><strong>${item.label} :</strong></td>
                                <td class="${item.isTotal || item.isRatio ? 'highlight' : ''}">
                                    ${item.value}
                                    ${item.severity ? this.getBadgeHTML(item.severity) : ''}
                                </td>
                            </tr>
                        `
                            )
                            .join('')}
                    </table>

                    <h4>Détail des Charges Actuelles</h4>
                    <table class="info-table">
                        ${data.chargesActuelles
                            ?.map(
                                (item: any) => `
                            <tr ${item.isTotal ? 'class="total-row"' : ''}>
                                <td><strong>${item.label} :</strong></td>
                                <td class="${item.isTotal ? 'highlight' : ''}">${item.value}</td>
                            </tr>
                        `
                            )
                            .join('')}
                    </table>
                </div>

                <!-- Exploitation Prévisionnelle -->
                <div class="section">
                    <h3>EXPLOITATION PRÉVISIONNELLE</h3>
                    <table class="info-table">
                        ${data.exploitationPrevisionnelle
                            ?.map(
                                (item: any) => `
                            <tr ${item.isTotal ? 'class="total-row"' : ''} ${item.isRatio ? 'class="ratio-row"' : ''}>
                                <td><strong>${item.label} :</strong></td>
                                <td class="${item.isTotal || item.isRatio ? 'highlight' : ''}">
                                    ${item.value}
                                    ${item.severity ? this.getBadgeHTML(item.severity) : ''}
                                </td>
                            </tr>
                        `
                            )
                            .join('')}
                    </table>

                    <h4>Détail des Charges Prévisionnelles</h4>
                    <table class="info-table">
                        ${data.chargesPrevisionnelles
                            ?.map(
                                (item: any) => `
                            <tr ${item.isTotal ? 'class="total-row"' : ''}>
                                <td><strong>${item.label} :</strong></td>
                                <td class="${item.isTotal ? 'highlight' : ''}">${item.value}</td>
                            </tr>
                        `
                            )
                            .join('')}
                    </table>
                </div>

                <!-- Comparaison Actuelle vs Prévisionnelle -->
                <div class="section">
                    <h3>ANALYSE COMPARATIVE</h3>
                    <div class="comparison-box">
                        <p><strong>Évolution du chiffre d'affaires :</strong> 
                            Analyse de la progression entre l'exploitation actuelle et prévisionnelle
                        </p>
                        <p><strong>Évolution des charges :</strong> 
                            Comparaison des charges totales entre les deux périodes
                        </p>
                        <p><strong>Amélioration des marges :</strong> 
                            Impact sur la rentabilité de l'entreprise
                        </p>
                    </div>
                </div>

                <div class="footer">
                    <p><strong>NB: L'emprunteur et l'agent de crédit doivent parapher toutes les pages.</strong></p>
                    <div class="paraphe-zone">
                        <div>Paraphe emprunteur : ________</div>
                        <div>Paraphe agent : ________</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * PAGE 3 : RÉSUMÉ D'ANALYSE DE CRÉDIT AVEC COMPARAISON
     */
    private genererPage3ResumeAnalyse(data: any): string {
        // Fonction helper pour déterminer si un ratio respecte le seuil
        const checkSeuil = (ratio: any): string => {
            const value = parseFloat(ratio.valeur);
            let respecteSeuil = false;

            switch (ratio.nom) {
                case 'R1 - Capacité de remboursement':
                    respecteSeuil = value >= 150;
                    break;
                case 'R2 - Ratio de solvabilité':
                    respecteSeuil = value >= 25;
                    break;
                case 'R3 - Ratio de liquidité':
                    respecteSeuil = value >= 100;
                    break;
                case "R4 - Ratio d'endettement":
                    respecteSeuil = value <= 70;
                    break;
                case 'R5 - Ratio de dépendance':
                    respecteSeuil = value <= 50;
                    break;
                case 'R6 - Ratio de couverture':
                    respecteSeuil = value >= 120;
                    break;
            }

            return respecteSeuil ? '✅' : '❌';
        };

        return `
            <div class="page">
                <div class="header">
                    <h1>RÉSUMÉ D'ANALYSE DE CRÉDIT</h1>
                    <h2>PAGE 3 : ANALYSE DES RATIOS ET ÉVALUATION</h2>
                    <div class="date">Date : ${new Date().toLocaleDateString('fr-FR')}</div>
                </div>

                <!-- Tableau comparatif des ratios -->
                <div class="section">
                    <h3>COMPARAISON AVEC LES SEUILS D'ÉVALUATION</h3>
                    <table class="ratio-comparison-table">
                        <thead>
                            <tr>
                                <th>Ratio</th>
                                <th>Formule</th>
                                <th>Seuil Acceptable</th>
                                <th>Valeur Calculée</th>
                                <th>Statut</th>
                                <th>Conforme</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${
                                data.ratios
                                    ? Object.values(data.ratios)
                                          .map((ratio: any) => {
                                              const seuilText = this.getSeuilText(ratio.nom);
                                              return `
                                <tr class="${ratio.statut.toLowerCase()}">
                                    <td><strong>${ratio.nom}</strong></td>
                                    <td class="formula">${ratio.formule}</td>
                                    <td class="seuil">${seuilText}</td>
                                    <td class="value"><strong>${ratio.valeur}%</strong></td>
                                    <td class="status ${ratio.statut.toLowerCase()}">${ratio.statut}</td>
                                    <td class="check">${checkSeuil(ratio)}</td>
                                </tr>
                                `;
                                          })
                                          .join('')
                                    : ''
                            }
                        </tbody>
                    </table>
                </div>

                <!-- Synthèse de l'évaluation -->
                <div class="section">
                    <h3>SYNTHÈSE DE L'ÉVALUATION</h3>
                    <div class="evaluation-summary">
                        <div class="eval-item">
                            <span class="label">Évaluation Globale :</span>
                            <span class="value ${data.evaluation?.toLowerCase()}">${data.evaluation || '-'}</span>
                        </div>
                        <div class="eval-item">
                            <span class="label">Score de Risque :</span>
                            <span class="value">${data.scoreRisque || 0}/100</span>
                        </div>
                        <div class="eval-item">
                            <span class="label">Seuils Respectés :</span>
                            <span class="value">${data.seuilsRespetes || 0}/6</span>
                        </div>
                        <div class="eval-item">
                            <span class="label">Taux de Conformité :</span>
                            <span class="value">${Math.round((data.seuilsRespetes / 6) * 100)}%</span>
                        </div>
                    </div>
                </div>

                <!-- Analyse de risque -->
                <div class="section">
                    <h3>ANALYSE DE RISQUE</h3>
                    <div class="risk-analysis">
                        <h4>Facteurs de risque identifiés :</h4>
                        <ul>
                            ${data.analyseRisque?.facteurs?.map((facteur: string) => `<li>${facteur}</li>`).join('') || '<li>Aucun facteur de risque majeur identifié</li>'}
                        </ul>
                    </div>
                </div>

                <!-- Décision recommandée -->
                <div class="section">
                    <h3>DÉCISION RECOMMANDÉE</h3>
                    <div class="decision-box ${data.decisionRecommandee?.decision?.toLowerCase()}">
                        <p><strong>Décision :</strong> ${data.decisionRecommandee?.decision?.replace(/_/g, ' ') || '-'}</p>
                        <p><strong>Justification :</strong> ${data.decisionRecommandee?.justification || '-'}</p>
                        ${
                            data.decisionRecommandee?.conditions
                                ? `
                            <h4>Conditions :</h4>
                            <ul>
                                ${data.decisionRecommandee.conditions.map((condition: string) => `<li>${condition}</li>`).join('')}
                            </ul>
                        `
                                : ''
                        }
                    </div>
                </div>

                <div class="footer">
                    <p><strong>NB: L'emprunteur et l'agent de crédit doivent parapher toutes les pages.</strong></p>
                    <div class="paraphe-zone">
                        <div>Paraphe emprunteur : ________</div>
                        <div>Paraphe agent : ________</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * PAGE 4 : PERSONNES CAUTION ET SIGNATURES
     */
    private genererPage4PersonnesCaution(data: any, includeSignature?: boolean): string {
        const hasPersonnesCaution = data.personnesCaution && data.personnesCaution.length > 0;

        return `
            <div class="page">
                <div class="header">
                    <h1>RÉSUMÉ D'ANALYSE DE CRÉDIT</h1>
                    <h2>PAGE 4 : PERSONNES CAUTION ET VALIDATION</h2>
                    <div class="date">Date : ${new Date().toLocaleDateString('fr-FR')}</div>
                </div>

                <!-- Personnes Caution -->
                <div class="section">
                    <h3>PERSONNES CAUTION (${data.personnesCaution?.length || 0})</h3>
                    
                    ${
                        !hasPersonnesCaution
                            ? `
                        <div class="warning-box">
                            <p><strong>⚠️ ATTENTION :</strong> Aucune personne caution n'a été renseignée pour cette demande de crédit.</p>
                            <p>Risque de garantie insuffisant - Il est recommandé d'exiger au moins une personne caution solvable.</p>
                        </div>
                    `
                            : `
                        ${data.personnesCaution
                            .map(
                                (personne: any, index: number) => `
                            <div class="caution-box">
                                <h4>Caution ${index + 1}</h4>
                                <table class="info-table">
                                    <tr>
                                        <td><strong>Nom :</strong></td>
                                        <td>${personne.nom || '-'}</td>
                                        <td><strong>Prénom :</strong></td>
                                        <td>${personne.prenom || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Téléphone :</strong></td>
                                        <td>${personne.telephone || '-'}</td>
                                        <td><strong>Âge :</strong></td>
                                        <td>${personne.age ? personne.age + ' ans' : '-'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Profession :</strong></td>
                                        <td>${personne.profession || '-'}</td>
                                        <td><strong>Activité :</strong></td>
                                        <td>${personne.activite || '-'}</td>
                                    </tr>
                                </table>
                            </div>
                        `
                            )
                            .join('')}

                        <!-- Analyse de la garantie -->
                        <div class="garantie-analysis">
                            <h4>Analyse de la Garantie Personnelle</h4>
                            <table class="info-table">
                                <tr>
                                    <td><strong>Niveau de garantie :</strong></td>
                                    <td>${data.analyseGarantie?.niveau || '-'}</td>
                                    <td><strong>Score :</strong></td>
                                    <td>${data.analyseGarantie?.score || 0}/100</td>
                                </tr>
                                <tr>
                                    <td colspan="4">
                                        <strong>Description :</strong> ${data.analyseGarantie?.description || '-'}
                                    </td>
                                </tr>
                            </table>
                        </div>
                    `
                    }
                </div>

                <!-- Validation finale -->
                <div class="section">
                    <h3>VALIDATION DU DOSSIER</h3>
                    <div class="validation-box">
                        <p>Je soussigné(e), certifie l'exactitude des informations fournies dans ce dossier de demande de crédit.</p>
                        <p>J'ai pris connaissance de l'analyse effectuée et des conditions proposées.</p>
                        <br>
                        <p>Fait à _________________, le _________________</p>
                    </div>
                </div>

                <!-- Zone de signatures -->
                <div class="signature-section">
                    <h3>SIGNATURES</h3>
                    <div class="signature-container">
                        <div class="signature-box">
                            <div class="signature-line"></div>
                            <p><strong>Nom et Prénom de l'emprunteur</strong></p>
                            <p>${data.promoteur?.[0]?.value || ''} ${data.promoteur?.[1]?.value || ''}</p>
                        </div>
                        <div class="signature-box">
                            <div class="signature-line"></div>
                            <p><strong>Nom de l'agent de crédit</strong></p>
                            <p>${data.informationsAdministratives?.utilisateurTraitant?.split(' - ')[0] || ''}</p>
                        </div>
                    </div>
                </div>

                <div class="footer">
                    <p><strong>NB: L'emprunteur et l'agent de crédit doivent parapher toutes les pages.</strong></p>
                    <div class="paraphe-zone">
                        <div>Paraphe emprunteur : ________</div>
                        <div>Paraphe agent : ________</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Helper: Obtenir le texte du seuil selon le ratio
     */
    private getSeuilText(nomRatio: string): string {
        switch (nomRatio) {
            case 'R1 - Capacité de remboursement':
                return '≥ 150%';
            case 'R2 - Ratio de solvabilité':
                return '≥ 25%';
            case 'R3 - Ratio de liquidité':
                return '≥ 100%';
            case "R4 - Ratio d'endettement":
                return '≤ 70%';
            case 'R5 - Ratio de dépendance':
                return '≤ 50%';
            case 'R6 - Ratio de couverture':
                return '≥ 120%';
            default:
                return '-';
        }
    }

    /**
     * Helper: Générer le HTML d'un badge de sévérité
     */
    private getBadgeHTML(severity: string): string {
        const colors = {
            success: '#22c55e',
            info: '#3b82f6',
            warn: '#f59e0b',
            danger: '#ef4444'
        };

        return `<span class="badge ${severity}" style="background-color: ${colors[severity as keyof typeof colors] || '#6b7280'}"></span>`;
    }

    /**
     * Styles CSS pour l'impression
     */
    private genererStyles(): string {
        return `
            <style>
                @page {
                    size: A4;
                    margin: 15mm;
                }

                @media print {
                    .page {
                        page-break-after: always;
                    }
                    
                    .page:last-child {
                        page-break-after: auto;
                    }
                }

                body {
                    font-family: 'Arial', 'Helvetica', sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }

                .page {
                    min-height: 100vh;
                    padding: 20px;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                }

                .header {
                    text-align: center;
                    border-bottom: 3px solid #2563eb;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }

                .header h1 {
                    color: #1e40af;
                    margin: 0 0 10px 0;
                    font-size: 24px;
                }

                .header h2 {
                    color: #3b82f6;
                    margin: 0 0 10px 0;
                    font-size: 18px;
                }

                .date {
                    color: #6b7280;
                    font-size: 14px;
                }

                .section {
                    margin-bottom: 30px;
                }

                .section h3 {
                    color: #1e40af;
                    border-bottom: 2px solid #e5e7eb;
                    padding-bottom: 8px;
                    margin-bottom: 15px;
                    font-size: 16px;
                }

                .section h4 {
                    color: #3b82f6;
                    margin: 15px 0 10px 0;
                    font-size: 14px;
                }

                .info-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 15px;
                }

                .info-table td {
                    padding: 8px;
                    border: 1px solid #e5e7eb;
                    font-size: 12px;
                }

                .info-table td:first-child {
                    background-color: #f9fafb;
                    width: 35%;
                }

                .total-row {
                    background-color: #eff6ff;
                    font-weight: bold;
                }

                .ratio-row {
                    background-color: #fef3c7;
                }

                .highlight {
                    font-weight: bold;
                    color: #1e40af;
                }

                .bilan-container {
                    display: flex;
                    gap: 20px;
                }

                .bilan-column {
                    flex: 1;
                }

                .small-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .small-table td {
                    padding: 5px;
                    border: 1px solid #e5e7eb;
                    font-size: 11px;
                }

                .text-right {
                    text-align: right;
                }

                /* Styles pour la page 3 - Tableau comparatif */
                .ratio-comparison-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 11px;
                }

                .ratio-comparison-table th {
                    background-color: #1e40af;
                    color: white;
                    padding: 10px;
                    text-align: left;
                    border: 1px solid #1e40af;
                }

                .ratio-comparison-table td {
                    padding: 8px;
                    border: 1px solid #e5e7eb;
                }

                .ratio-comparison-table .formula {
                    font-style: italic;
                    color: #6b7280;
                    font-size: 10px;
                }

                .ratio-comparison-table .seuil {
                    font-weight: bold;
                    color: #059669;
                }

                .ratio-comparison-table .value {
                    font-weight: bold;
                    color: #1e40af;
                }

                .ratio-comparison-table .status {
                    font-weight: bold;
                    text-align: center;
                }

                .ratio-comparison-table .status.excellent {
                    color: #059669;
                }

                .ratio-comparison-table .status.bon {
                    color: #3b82f6;
                }

                .ratio-comparison-table .status.acceptable {
                    color: #f59e0b;
                }

                .ratio-comparison-table .status.risque {
                    color: #ef4444;
                }

                .ratio-comparison-table .check {
                    text-align: center;
                    font-size: 16px;
                }

                .evaluation-summary {
                    background-color: #f0f9ff;
                    border: 2px solid #3b82f6;
                    border-radius: 8px;
                    padding: 15px;
                }

                .eval-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid #e5e7eb;
                }

                .eval-item:last-child {
                    border-bottom: none;
                }

                .eval-item .label {
                    font-weight: bold;
                    color: #374151;
                }

                .eval-item .value {
                    font-weight: bold;
                    color: #1e40af;
                }

                .eval-item .value.excellent {
                    color: #059669;
                }

                .eval-item .value.bon {
                    color: #3b82f6;
                }

                .eval-item .value.acceptable {
                    color: #f59e0b;
                }

                .eval-item .value.risque {
                    color: #ef4444;
                }

                .risk-analysis {
                    background-color: #fef3c7;
                    border-left: 4px solid #f59e0b;
                    padding: 15px;
                }

                .decision-box {
                    border: 2px solid #6b7280;
                    border-radius: 8px;
                    padding: 15px;
                    background-color: #f9fafb;
                }

                .decision-box.accorder {
                    border-color: #059669;
                    background-color: #f0fdf4;
                }

                .decision-box.accorder_avec_conditions {
                    border-color: #3b82f6;
                    background-color: #eff6ff;
                }

                .decision-box.etude_approfondie {
                    border-color: #f59e0b;
                    background-color: #fef3c7;
                }

                .decision-box.refuser {
                    border-color: #ef4444;
                    background-color: #fef2f2;
                }

                /* Styles pour la page 4 */
                .caution-box {
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 15px;
                    background-color: #f9fafb;
                }

                .warning-box {
                    background-color: #fef3c7;
                    border: 2px solid #f59e0b;
                    border-radius: 8px;
                    padding: 15px;
                    margin: 20px 0;
                }

                .garantie-analysis {
                    background-color: #f0f9ff;
                    border: 1px solid #3b82f6;
                    border-radius: 8px;
                    padding: 15px;
                    margin-top: 20px;
                }

                .validation-box {
                    background-color: #f9fafb;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                }

                .signature-section {
                    margin-top: auto;
                    padding-top: 40px;
                }

                .signature-container {
                    display: flex;
                    justify-content: space-around;
                    margin-top: 60px;
                }

                .signature-box {
                    text-align: center;
                    width: 250px;
                }

                .signature-line {
                    border-bottom: 2px solid #374151;
                    margin-bottom: 10px;
                    height: 50px;
                }

                .footer {
                    margin-top: auto;
                    padding-top: 30px;
                    border-top: 1px solid #e5e7eb;
                    text-align: center;
                    font-size: 12px;
                }

                .paraphe-zone {
                    display: flex;
                    justify-content: space-around;
                    margin-top: 20px;
                    font-size: 11px;
                }

                .badge {
                    display: inline-block;
                    padding: 2px 8px;
                    border-radius: 4px;
                    color: white;
                    font-size: 10px;
                    margin-left: 5px;
                }

                .comparison-box {
                    background-color: #f9fafb;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 15px;
                }

                /* Responsive pour impression */
                @media print {
                    body {
                        font-size: 11pt;
                    }

                    .no-print {
                        display: none;
                    }
                }
            </style>
        `;
    }
}
