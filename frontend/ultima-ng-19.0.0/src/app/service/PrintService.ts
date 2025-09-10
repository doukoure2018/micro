import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PrintService {
    /**
     * Imprime le bilan de crédit
     */
    imprimerBilan(data: any, options: PrintOptions = {}): void {
        const printWindow = window.open('', '_blank', 'width=1200,height=800');
        if (!printWindow) {
            console.error("Impossible d'ouvrir la fenêtre d'impression");
            return;
        }

        const htmlContent = this.genererHTML(data, options);

        printWindow.document.write(htmlContent);
        printWindow.document.close();

        // Attendre que le contenu soit chargé avant d'imprimer
        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);
        };
    }

    /**
     * Génère le HTML pour l'impression
     */
    private genererHTML(data: any, options: PrintOptions): string {
        const styles = this.getStyles();
        const content = this.genererContenu(data, options);

        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Résumé d'Analyse de Crédit</title>
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
    private genererContenu(data: any, options: PrintOptions): string {
        const dateImpression = new Date().toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
      <div class="print-container">
        <!-- En-tête -->
        <div class="header">
          <div class="header-content">
            <h1>RÉSUMÉ D'ANALYSE DE CRÉDIT</h1>
            <div class="header-info">
              <p><strong>Date d'impression:</strong> ${dateImpression}</p>
              <p><strong>Montant demandé:</strong> ${data.montantDemande}</p>
              <p><strong>Évaluation:</strong> <span class="evaluation ${data.evaluationGlobale.toLowerCase()}">${data.evaluationGlobale}</span></p>
            </div>
          </div>
        </div>

        <!-- Évaluation globale -->
        ${this.genererEvaluationGlobale(data)}

        <!-- Indicateurs clés -->
        ${options.includeIndicateurs !== false ? this.genererIndicateursCles(data) : ''}

        <!-- Informations générales -->
        ${this.genererInformationsGenerales(data)}

        <!-- Bilan financier -->
        ${this.genererBilanFinancier(data)}

        <!-- Exploitation -->
        ${this.genererExploitation(data)}

        <!-- Demande de crédit -->
        ${this.genererDemandeCredit(data)}

        <!-- Personnes caution -->
        ${this.genererPersonnesCaution(data)}

        <!-- Recommandations -->
        ${this.genererRecommandations(data)}

        <!-- Pied de page -->
        <div class="footer">
          <p>Document généré automatiquement le ${dateImpression}</p>
          ${options.includeSignature ? '<div class="signature-section"><p>Signature de l\'analyste: ___________________</p></div>' : ''}
        </div>
      </div>
    `;
    }

    /**
     * Génère la section évaluation globale
     */
    private genererEvaluationGlobale(data: any): string {
        return `
      <div class="section evaluation-section">
        <h2>ÉVALUATION GLOBALE</h2>
        <div class="evaluation-grid">
          <div class="evaluation-item">
            <h3>Statut Global</h3>
            <div class="evaluation-badge ${data.evaluationGlobale.toLowerCase()}">${data.evaluationGlobale}</div>
          </div>
          <div class="evaluation-item">
            <h3>Score de Risque</h3>
            <div class="score">${data.scoreRisque}/100</div>
          </div>
          <div class="evaluation-item">
            <h3>Seuils Respectés</h3>
            <div class="seuils">${data.seuilsRespetes}/6</div>
          </div>
        </div>
      </div>
    `;
    }

    /**
     * Génère la section indicateurs clés
     */
    private genererIndicateursCles(data: any): string {
        return `
      <div class="section">
        <h2>INDICATEURS CLÉS</h2>
        <div class="indicateurs-grid">
          ${data.ratios
              .map(
                  (ratio: any) => `
            <div class="indicateur-item">
              <h4>${ratio.nom}</h4>
              <div class="ratio-value ${ratio.statut.toLowerCase()}">${ratio.valeur}%</div>
              <div class="ratio-status">${ratio.statut}</div>
              <div class="ratio-formula">${ratio.formule}</div>
            </div>
          `
              )
              .join('')}
        </div>
      </div>
    `;
    }

    /**
     * Génère les informations générales
     */
    private genererInformationsGenerales(data: any): string {
        return `
      <div class="section">
        <h2>INFORMATIONS GÉNÉRALES</h2>
        <div class="info-grid">
          <div class="info-block">
            <h3>Promoteur</h3>
            ${this.genererTableau(data.promoteur)}
          </div>
          <div class="info-block">
            <h3>Entreprise</h3>
            ${this.genererTableau(data.entreprise)}
          </div>
        </div>
      </div>
    `;
    }

    /**
     * Génère le bilan financier
     */
    private genererBilanFinancier(data: any): string {
        return `
      <div class="section">
        <h2>BILAN FINANCIER</h2>
        <div class="bilan-grid">
          <div class="bilan-block">
            <h3>Bilan Entreprise</h3>
            ${this.genererTableau(data.bilanEntreprise)}
          </div>
          <div class="bilan-block">
            <h3>Patrimoine Personnel</h3>
            ${this.genererTableau(data.bilanPersonnel)}
          </div>
        </div>
      </div>
    `;
    }

    /**
     * Génère la section exploitation
     */
    private genererExploitation(data: any): string {
        return `
      <div class="section">
        <h2>EXPLOITATION</h2>
        <div class="exploitation-grid">
          <div class="exploitation-block">
            <h3>Exploitation Actuelle</h3>
            ${this.genererTableau(data.exploitationActuelle)}
            <h4>Détail des Charges</h4>
            ${this.genererTableau(data.chargesActuelles)}
          </div>
          <div class="exploitation-block">
            <h3>Exploitation Prévisionnelle</h3>
            ${this.genererTableau(data.exploitationPrevisionnelle)}
            <h4>Détail des Charges</h4>
            ${this.genererTableau(data.chargesPrevisionnelles)}
          </div>
        </div>
      </div>
    `;
    }

    /**
     * Génère la section demande de crédit
     */
    private genererDemandeCredit(data: any): string {
        return `
      <div class="section">
        <h2>DEMANDE DE CRÉDIT</h2>
        <div class="demande-grid">
          <div class="demande-block">
            <h3>Informations Principales</h3>
            ${this.genererTableau(data.demandeCredit)}
          </div>
          <div class="demande-block">
            <h3>Informations Administratives</h3>
            ${this.genererTableau(data.infoAdministratives)}
          </div>
        </div>
      </div>
    `;
    }

    /**
     * Génère la section personnes caution
     */
    private genererPersonnesCaution(data: any): string {
        if (!data.personnesCaution || data.personnesCaution.length === 0) {
            return `
        <div class="section">
          <h2>PERSONNES CAUTION</h2>
          <div class="no-caution">
            <p>Aucune personne caution renseignée</p>
          </div>
        </div>
      `;
        }

        return `
      <div class="section">
        <h2>PERSONNES CAUTION (${data.personnesCaution.length})</h2>
        <div class="caution-content">
          ${this.genererTableau(data.personnesCautionData)}
          <div class="caution-analysis">
            <h3>Analyse de Garantie</h3>
            <p><strong>Niveau:</strong> ${data.analyseGarantie.niveau}</p>
            <p><strong>Score:</strong> ${data.analyseGarantie.score}/100</p>
            <p><strong>Description:</strong> ${data.analyseGarantie.description}</p>
          </div>
        </div>
      </div>
    `;
    }

    /**
     * Génère la section recommandations
     */
    private genererRecommandations(data: any): string {
        return `
      <div class="section">
        <h2>RECOMMANDATIONS ET ANALYSE</h2>
        <div class="recommandations-grid">
          <div class="recommandations-block">
            <h3>Recommandations</h3>
            <ul>
              ${data.recommandations.map((rec: string) => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
          <div class="recommandations-block">
            <h3>Conseils d'Amélioration</h3>
            <ul>
              ${data.conseilsAmelioration.map((conseil: string) => `<li>${conseil}</li>`).join('')}
            </ul>
          </div>
        </div>
        <div class="decision-block">
          <h3>Recommandation de Décision</h3>
          <div class="decision-content">
            <p><strong>Décision:</strong> <span class="decision ${data.decisionRecommandee.decision.toLowerCase()}">${data.decisionRecommandee.decision.replace('_', ' ')}</span></p>
            <p><strong>Justification:</strong> ${data.decisionRecommandee.justification}</p>
            ${
                data.decisionRecommandee.conditions
                    ? `
              <p><strong>Conditions:</strong></p>
              <ul>
                ${data.decisionRecommandee.conditions.map((condition: string) => `<li>${condition}</li>`).join('')}
              </ul>
            `
                    : ''
            }
          </div>
        </div>
      </div>
    `;
    }

    /**
     * Génère un tableau HTML à partir de données
     */
    private genererTableau(data: any[]): string {
        if (!data || data.length === 0) return '<p>Aucune donnée disponible</p>';

        return `
      <table>
        <tbody>
          ${data
              .map(
                  (item) => `
            <tr ${item.isTotal ? 'class="total-row"' : ''}>
              <td class="label">${item.label}</td>
              <td class="value ${item.severity ? item.severity : ''}">${item.value}</td>
            </tr>
          `
              )
              .join('')}
        </tbody>
      </table>
    `;
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
        font-family: 'Arial', sans-serif;
        font-size: 12px;
        line-height: 1.4;
        color: #333;
        background: white;
      }

      .print-container {
        max-width: 210mm;
        margin: 0 auto;
        padding: 15mm;
      }

      .header {
        text-align: center;
        margin-bottom: 30px;
        border-bottom: 2px solid #333;
        padding-bottom: 20px;
      }

      .header h1 {
        font-size: 24px;
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 15px;
      }

      .header-info {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
      }

      .header-info p {
        margin: 5px 0;
        font-size: 11px;
      }

      .evaluation {
        padding: 3px 8px;
        border-radius: 4px;
        font-weight: bold;
      }

      .evaluation.excellent { background: #d4edda; color: #155724; }
      .evaluation.bon { background: #cce5ff; color: #004085; }
      .evaluation.acceptable { background: #fff3cd; color: #856404; }
      .evaluation.risque { background: #f8d7da; color: #721c24; }

      .section {
        margin-bottom: 25px;
        page-break-inside: avoid;
      }

      .section h2 {
        background: #34495e;
        color: white;
        padding: 8px 12px;
        font-size: 14px;
        margin-bottom: 15px;
        font-weight: bold;
        text-transform: uppercase;
      }

      .section h3 {
        color: #2c3e50;
        font-size: 12px;
        margin-bottom: 8px;
        font-weight: bold;
        border-bottom: 1px solid #bdc3c7;
        padding-bottom: 3px;
      }

      .section h4 {
        color: #34495e;
        font-size: 11px;
        margin: 10px 0 5px 0;
        font-weight: bold;
      }

      .evaluation-section {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        border: 1px solid #dee2e6;
      }

      .evaluation-grid,
      .indicateurs-grid,
      .info-grid,
      .bilan-grid,
      .exploitation-grid,
      .demande-grid,
      .recommandations-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
      }

      .evaluation-item,
      .indicateur-item {
        flex: 1;
        min-width: 150px;
        text-align: center;
        padding: 10px;
        border: 1px solid #dee2e6;
        border-radius: 6px;
      }

      .evaluation-badge,
      .ratio-value {
        font-size: 16px;
        font-weight: bold;
        padding: 5px 10px;
        border-radius: 4px;
        margin: 5px 0;
        display: inline-block;
      }

      .score,
      .seuils {
        font-size: 18px;
        font-weight: bold;
        color: #2c3e50;
      }

      .ratio-status {
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 3px;
        margin-top: 5px;
      }

      .ratio-formula {
        font-size: 9px;
        color: #6c757d;
        font-style: italic;
        margin-top: 5px;
      }

      .info-block,
      .bilan-block,
      .exploitation-block,
      .demande-block,
      .recommandations-block {
        flex: 1;
        min-width: 250px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 15px;
        font-size: 10px;
      }

      table td {
        padding: 4px 8px;
        border: 1px solid #dee2e6;
        vertical-align: top;
      }

      table td.label {
        background: #f8f9fa;
        font-weight: bold;
        width: 40%;
      }

      table td.value {
        width: 60%;
      }

      .total-row {
        background: #e3f2fd !important;
        font-weight: bold;
      }

      .success { color: #28a745; font-weight: bold; }
      .info { color: #007bff; font-weight: bold; }
      .warn { color: #ffc107; font-weight: bold; }
      .danger { color: #dc3545; font-weight: bold; }

      .no-caution {
        text-align: center;
        padding: 20px;
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        border-radius: 6px;
      }

      .caution-content {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 15px;
      }

      .caution-analysis {
        background: #f0f8ff;
        padding: 10px;
        border-radius: 6px;
        border: 1px solid #b3d9ff;
      }

      .decision-block {
        margin-top: 15px;
        padding: 15px;
        background: #f5f5f5;
        border-radius: 6px;
        border: 1px solid #ddd;
      }

      .decision-content .decision {
        padding: 3px 8px;
        border-radius: 4px;
        font-weight: bold;
      }

      .decision.accorder { background: #d4edda; color: #155724; }
      .decision.accorder_avec_conditions { background: #cce5ff; color: #004085; }
      .decision.etude_approfondie { background: #fff3cd; color: #856404; }
      .decision.refuser { background: #f8d7da; color: #721c24; }

      ul {
        margin: 8px 0;
        padding-left: 15px;
      }

      ul li {
        margin-bottom: 3px;
        font-size: 10px;
      }

      .footer {
        margin-top: 30px;
        padding-top: 15px;
        border-top: 1px solid #dee2e6;
        text-align: center;
        font-size: 10px;
        color: #6c757d;
      }

      .signature-section {
        margin-top: 20px;
        text-align: right;
      }

      @media print {
        body { margin: 0; }
        .print-container { padding: 10mm; }
        .section { page-break-inside: avoid; }
        .footer { page-break-inside: avoid; }
      }

      @page {
        margin: 15mm;
        size: A4;
      }
    `;
    }
}

export interface PrintOptions {
    includeIndicateurs?: boolean;
    includeSignature?: boolean;
    title?: string;
    watermark?: string;
}
