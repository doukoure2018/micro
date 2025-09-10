import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TresoreriePrintService {
    /**
     * Imprime le tableau de prévision de trésorerie
     */
    imprimerTableauTresorerie(tresorerieForm: any, creditParams: any, demandeIndividuel?: any): void {
        const printWindow = window.open('', '_blank', 'width=1400,height=900');
        if (!printWindow) {
            console.error("Impossible d'ouvrir la fenêtre d'impression");
            return;
        }

        const htmlContent = this.genererHTMLTableau(tresorerieForm, creditParams, demandeIndividuel);

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
     * Génère le HTML complet pour l'impression
     */
    private genererHTMLTableau(tresorerieForm: any, creditParams: any, demandeIndividuel?: any): string {
        const styles = this.getTableauStyles();
        const content = this.genererContenuTableau(tresorerieForm, creditParams, demandeIndividuel);

        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Prévision de Trésorerie</title>
        <style>${styles}</style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `;
    }

    /**
     * Génère le contenu du tableau de trésorerie
     */
    private genererContenuTableau(tresorerieForm: any, creditParams: any, demandeIndividuel?: any): string {
        const dateImpression = new Date().toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const donneesMois = this.extraireDonneesMois(tresorerieForm);
        const totauxAnnuels = this.calculerTotauxAnnuels(donneesMois);

        return `
      <div class="print-container">
        <!-- En-tête -->
        <div class="header">
          <h1>PRÉVISION DE TRÉSORERIE</h1>
          <div class="header-info">
            <div class="header-left">
              ${
                  demandeIndividuel
                      ? `
                <p><strong>Demandeur:</strong> ${demandeIndividuel.prenom} ${demandeIndividuel.nom}</p>
                <p><strong>Demande N°:</strong> ${demandeIndividuel.id || 'N/A'}</p>
              `
                      : `
                <p><strong>Client:</strong> ${creditParams.clientNom || 'N/A'}</p>
              `
              }
              <p><strong>Montant du crédit:</strong> ${this.formatCurrency(creditParams.montantCredit)}</p>
            </div>
            <div class="header-right">
              <p><strong>Durée:</strong> ${creditParams.duree} mois</p>
              <p><strong>Taux:</strong> ${creditParams.tauxInteret}% annuel</p>
              <p><strong>Date d'impression:</strong> ${dateImpression}</p>
            </div>
          </div>
        </div>

        <!-- Tableau principal -->
        <div class="table-container">
          ${this.genererTableauPrincipal(donneesMois, totauxAnnuels)}
        </div>

        <!-- Analyses et indicateurs -->
        <div class="analysis-section">
          ${this.genererAnalyseFinanciere(donneesMois, totauxAnnuels, creditParams)}
        </div>

        <!-- Pied de page -->
        <div class="footer">
          <div class="footer-left">
            <p>Document généré automatiquement le ${dateImpression}</p>
          </div>
          <div class="footer-right">
            <p>Page 1/1</p>
          </div>
        </div>
      </div>
    `;
    }

    /**
     * Génère le tableau principal avec tous les mois
     */
    private genererTableauPrincipal(donneesMois: any[], totauxAnnuels: any): string {
        const moisLabels = ['Mois 0', 'Mois 1', 'Mois 2', 'Mois 3', 'Mois 4', 'Mois 5', 'Mois 6', 'Mois 7', 'Mois 8', 'Mois 9', 'Mois 10', 'Mois 11', 'Mois 12'];

        return `
      <table class="main-table">
        <thead>
          <tr>
            <th class="category-header">ÉLÉMENTS</th>
            ${moisLabels.map((label) => `<th class="month-header">${label}</th>`).join('')}
            <th class="total-header">TOTAL ANNUEL</th>
          </tr>
        </thead>
        <tbody>
          <!-- SOLDE DÉBUT -->
          <tr class="solde-row">
            <td class="category-cell"><strong>SOLDE DÉBUT</strong></td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.soldeDebut)}</td>`).join('')}
            <td class="total-cell">-</td>
          </tr>

          <!-- ENCAISSEMENTS -->
          <tr class="section-header">
            <td class="section-title" colspan="${moisLabels.length + 2}"><strong>ENCAISSEMENTS</strong></td>
          </tr>
          
          <tr>
            <td class="category-cell">Ventes</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.ventes)}</td>`).join('')}
            <td class="total-cell total-revenue">${this.formatNumber(totauxAnnuels.ventes)}</td>
          </tr>
          
          <tr>
            <td class="category-cell">Autres revenus</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.autresRevenus)}</td>`).join('')}
            <td class="total-cell total-revenue">${this.formatNumber(totauxAnnuels.autresRevenus)}</td>
          </tr>
          
          <tr>
            <td class="category-cell">Prêt reçu</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.pret)}</td>`).join('')}
            <td class="total-cell total-revenue">${this.formatNumber(totauxAnnuels.pret)}</td>
          </tr>
          
          <tr class="subtotal-row">
            <td class="category-cell"><strong>TOTAL ENCAISSEMENTS</strong></td>
            ${donneesMois.map((mois) => `<td class="amount-cell total-revenue"><strong>${this.formatNumber(mois.totalEncaissements)}</strong></td>`).join('')}
            <td class="total-cell total-revenue"><strong>${this.formatNumber(totauxAnnuels.totalEncaissements)}</strong></td>
          </tr>

          <!-- DÉCAISSEMENTS -->
          <tr class="section-header">
            <td class="section-title" colspan="${moisLabels.length + 2}"><strong>DÉCAISSEMENTS</strong></td>
          </tr>
          
          <tr>
            <td class="category-cell">Achat marchandises</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.achatmarchandises)}</td>`).join('')}
            <td class="total-cell total-expense">${this.formatNumber(totauxAnnuels.achatmarchandises)}</td>
          </tr>
          
          <tr>
            <td class="category-cell">Main d'œuvre</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.mainoeuvre)}</td>`).join('')}
            <td class="total-cell total-expense">${this.formatNumber(totauxAnnuels.mainoeuvre)}</td>
          </tr>
          
          <tr>
            <td class="category-cell">Investissement</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.investissement)}</td>`).join('')}
            <td class="total-cell total-expense">${this.formatNumber(totauxAnnuels.investissement)}</td>
          </tr>
          
          <tr>
            <td class="category-cell">Impôts et taxes</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.impotstaxes)}</td>`).join('')}
            <td class="total-cell total-expense">${this.formatNumber(totauxAnnuels.impotstaxes)}</td>
          </tr>
          
          <tr>
            <td class="category-cell">Loyers</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.loyer)}</td>`).join('')}
            <td class="total-cell total-expense">${this.formatNumber(totauxAnnuels.loyer)}</td>
          </tr>
          
          <tr>
            <td class="category-cell">Eau, Électricité, téléphone</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.utilities)}</td>`).join('')}
            <td class="total-cell total-expense">${this.formatNumber(totauxAnnuels.utilities)}</td>
          </tr>
          
          <tr>
            <td class="category-cell">Transport</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.transport)}</td>`).join('')}
            <td class="total-cell total-expense">${this.formatNumber(totauxAnnuels.transport)}</td>
          </tr>
          
          <tr>
            <td class="category-cell">Salaire personnel</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.salaires)}</td>`).join('')}
            <td class="total-cell total-expense">${this.formatNumber(totauxAnnuels.salaires)}</td>
          </tr>
          
          <tr>
            <td class="category-cell">Frais de téléphone</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.fraistelephone)}</td>`).join('')}
            <td class="total-cell total-expense">${this.formatNumber(totauxAnnuels.fraistelephone)}</td>
          </tr>
          
          <tr>
            <td class="category-cell">Charges financières</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.chargesfinancieres)}</td>`).join('')}
            <td class="total-cell total-expense">${this.formatNumber(totauxAnnuels.chargesfinancieres)}</td>
          </tr>
          
          <tr>
            <td class="category-cell">Entretien et réparation</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.entretien)}</td>`).join('')}
            <td class="total-cell total-expense">${this.formatNumber(totauxAnnuels.entretien)}</td>
          </tr>
          
          <tr>
            <td class="category-cell">Autres dépenses</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.autresdepenses)}</td>`).join('')}
            <td class="total-cell total-expense">${this.formatNumber(totauxAnnuels.autresdepenses)}</td>
          </tr>

          <!-- REMBOURSEMENTS -->
          <tr class="section-header">
            <td class="section-title" colspan="${moisLabels.length + 2}"><strong>REMBOURSEMENTS CRÉDIT</strong></td>
          </tr>
          
          <tr>
            <td class="category-cell">Intérêts à verser</td>
            ${donneesMois.map((mois) => `<td class="amount-cell remboursement">${this.formatNumber(mois.interetsAVerser)}</td>`).join('')}
            <td class="total-cell total-remboursement">${this.formatNumber(totauxAnnuels.interetsAVerser)}</td>
          </tr>
          
          <tr>
            <td class="category-cell">Remboursement capital</td>
            ${donneesMois.map((mois) => `<td class="amount-cell remboursement">${this.formatNumber(mois.remboursementCapital)}</td>`).join('')}
            <td class="total-cell total-remboursement">${this.formatNumber(totauxAnnuels.remboursementCapital)}</td>
          </tr>
          
          <tr class="subtotal-row">
            <td class="category-cell"><strong>TOTAL DÉCAISSEMENTS</strong></td>
            ${donneesMois.map((mois) => `<td class="amount-cell total-expense"><strong>${this.formatNumber(mois.totalDecaissements)}</strong></td>`).join('')}
            <td class="total-cell total-expense"><strong>${this.formatNumber(totauxAnnuels.totalDecaissements)}</strong></td>
          </tr>

          <!-- RÉSULTATS -->
          <tr class="section-header">
            <td class="section-title" colspan="${moisLabels.length + 2}"><strong>RÉSULTATS</strong></td>
          </tr>
          
          <tr>
            <td class="category-cell">Disponible en caisse</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.disponibleEnCaisse)}</td>`).join('')}
            <td class="total-cell">-</td>
          </tr>
          
          <tr class="result-row">
            <td class="category-cell"><strong>EXCÉDENT (DÉFICIT)</strong></td>
            ${donneesMois.map((mois) => `<td class="amount-cell ${mois.excedentDeficit >= 0 ? 'positive' : 'negative'}"><strong>${this.formatNumber(mois.excedentDeficit)}</strong></td>`).join('')}
            <td class="total-cell ${totauxAnnuels.excedentDeficit >= 0 ? 'positive' : 'negative'}"><strong>${this.formatNumber(totauxAnnuels.excedentDeficit)}</strong></td>
          </tr>
          
          <tr class="solde-row final-row">
            <td class="category-cell"><strong>SOLDE FIN</strong></td>
            ${donneesMois.map((mois) => `<td class="amount-cell ${mois.soldeFin >= 0 ? 'positive' : 'negative'}"><strong>${this.formatNumber(mois.soldeFin)}</strong></td>`).join('')}
            <td class="total-cell">-</td>
          </tr>
        </tbody>
      </table>
    `;
    }

    /**
     * Génère la section d'analyse financière
     */
    private genererAnalyseFinanciere(donneesMois: any[], totauxAnnuels: any, creditParams: any): string {
        const cashFlowMoyen = totauxAnnuels.excedentDeficit / 12;
        const remboursementMensuelMoyen = (totauxAnnuels.interetsAVerser + totauxAnnuels.remboursementCapital) / 12;
        const ratioRemboursement = totauxAnnuels.totalEncaissements > 0 ? ((totauxAnnuels.interetsAVerser + totauxAnnuels.remboursementCapital) / totauxAnnuels.totalEncaissements) * 100 : 0;

        // Identifier les mois déficitaires
        const moisDeficitaires = donneesMois.map((mois, index) => ({ mois: index, deficit: mois.excedentDeficit })).filter((item) => item.deficit < 0);

        return `
      <div class="analysis-grid">
        <div class="analysis-block">
          <h3>📊 INDICATEURS CLÉS</h3>
          <div class="indicators">
            <div class="indicator">
              <span class="indicator-label">Cash Flow annuel moyen:</span>
              <span class="indicator-value ${cashFlowMoyen >= 0 ? 'positive' : 'negative'}">${this.formatCurrency(cashFlowMoyen)}</span>
            </div>
            <div class="indicator">
              <span class="indicator-label">Remboursement mensuel moyen:</span>
              <span class="indicator-value">${this.formatCurrency(remboursementMensuelMoyen)}</span>
            </div>
            <div class="indicator">
              <span class="indicator-label">Ratio remboursement/revenus:</span>
              <span class="indicator-value ${ratioRemboursement <= 30 ? 'positive' : ratioRemboursement <= 50 ? 'warning' : 'negative'}">${ratioRemboursement.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div class="analysis-block">
          <h3>⚠️ POINTS D'ATTENTION</h3>
          <div class="alerts">
            ${
                moisDeficitaires.length > 0
                    ? `
              <div class="alert alert-danger">
                <strong>Mois déficitaires identifiés:</strong>
                ${moisDeficitaires.map((item) => `Mois ${item.mois} (${this.formatCurrency(item.deficit)})`).join(', ')}
              </div>
            `
                    : `
              <div class="alert alert-success">
                <strong>✓ Aucun déficit mensuel identifié</strong>
              </div>
            `
            }
            
            ${
                ratioRemboursement > 50
                    ? `
              <div class="alert alert-warning">
                <strong>Ratio de remboursement élevé (${ratioRemboursement.toFixed(1)}%)</strong> - Risque de tension de trésorerie
              </div>
            `
                    : ''
            }
            
            ${
                cashFlowMoyen < 0
                    ? `
              <div class="alert alert-danger">
                <strong>Cash Flow annuel négatif</strong> - Viabilité à long terme questionnée
              </div>
            `
                    : ''
            }
          </div>
        </div>

        <div class="analysis-block">
          <h3>💰 SYNTHÈSE FINANCIÈRE</h3>
          <div class="synthesis">
            <p><strong>Total revenus annuels:</strong> ${this.formatCurrency(totauxAnnuels.totalEncaissements)}</p>
            <p><strong>Total charges annuelles:</strong> ${this.formatCurrency(totauxAnnuels.totalDecaissements)}</p>
            <p><strong>Résultat net annuel:</strong> 
              <span class="${totauxAnnuels.excedentDeficit >= 0 ? 'positive' : 'negative'}">
                ${this.formatCurrency(totauxAnnuels.excedentDeficit)}
              </span>
            </p>
            <p><strong>Capacité de remboursement:</strong> 
              <span class="${cashFlowMoyen >= remboursementMensuelMoyen ? 'positive' : 'negative'}">
                ${cashFlowMoyen >= remboursementMensuelMoyen ? 'Suffisante' : 'Insuffisante'}
              </span>
            </p>
          </div>
        </div>
      </div>
    `;
    }

    /**
     * Extrait les données de tous les mois du formulaire
     */
    private extraireDonneesMois(tresorerieForm: any): any[] {
        const donneesMois = [];

        for (let mois = 0; mois <= 12; mois++) {
            const moisData = tresorerieForm.get(`mois${mois}`)?.getRawValue() || {};

            donneesMois.push({
                soldeDebut: moisData.soldeDebut || 0,
                ventes: moisData.ventes || 0,
                autresRevenus: moisData.autresRevenus || 0,
                pret: moisData.pret || 0,
                achatmarchandises: moisData.achatmarchandises || 0,
                mainoeuvre: moisData.mainoeuvre || 0,
                investissement: moisData.investissement || 0,
                impotstaxes: moisData.impotstaxes || 0,
                loyer: moisData.loyer || 0,
                utilities: moisData.utilities || 0,
                transport: moisData.transport || 0,
                salaires: moisData.salaires || 0,
                fraistelephone: moisData.fraistelephone || 0,
                chargesfinancieres: moisData.chargesfinancieres || 0,
                entretien: moisData.entretien || 0,
                autresdepenses: moisData.autresdepenses || 0,
                interetsAVerser: moisData.interetsAVerser || 0,
                remboursementCapital: moisData.remboursementCapital || 0,
                totalEncaissements: moisData.totalEncaissements || 0,
                totalDecaissements: moisData.totalDecaissements || 0,
                disponibleEnCaisse: moisData.disponibleEnCaisse || 0,
                excedentDeficit: moisData.excedentDeficit || 0,
                soldeFin: moisData.soldeFin || 0
            });
        }

        return donneesMois;
    }

    /**
     * Calcule les totaux annuels
     */
    private calculerTotauxAnnuels(donneesMois: any[]): any {
        const totaux: any = {};
        const champs = [
            'ventes',
            'autresRevenus',
            'pret',
            'achatmarchandises',
            'mainoeuvre',
            'investissement',
            'impotstaxes',
            'loyer',
            'utilities',
            'transport',
            'salaires',
            'fraistelephone',
            'chargesfinancieres',
            'entretien',
            'autresdepenses',
            'interetsAVerser',
            'remboursementCapital',
            'totalEncaissements',
            'totalDecaissements',
            'excedentDeficit'
        ];

        champs.forEach((champ) => {
            totaux[champ] = donneesMois.reduce((sum, mois) => sum + (mois[champ] || 0), 0);
        });

        return totaux;
    }

    /**
     * Formate un montant en devises
     */
    private formatCurrency(amount: number): string {
        if (amount === null || amount === undefined) return '0 GNF';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'GNF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    /**
     * Formate un nombre
     */
    private formatNumber(value: number): string {
        if (value === null || value === undefined || value === 0) return '-';
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }

    /**
     * Retourne les styles CSS pour l'impression
     */
    private getTableauStyles(): string {
        return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Arial', sans-serif;
        font-size: 10px;
        line-height: 1.3;
        color: #333;
        background: white;
      }

      .print-container {
        max-width: 297mm;
        margin: 0 auto;
        padding: 10mm;
      }

      .header {
        text-align: center;
        margin-bottom: 20px;
        border-bottom: 2px solid #333;
        padding-bottom: 15px;
      }

      .header h1 {
        font-size: 18px;
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 10px;
      }

      .header-info {
        display: flex;
        justify-content: space-between;
        font-size: 9px;
      }

      .header-left, .header-right {
        text-align: left;
      }

      .table-container {
        margin-bottom: 20px;
        overflow-x: auto;
      }

      .main-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 8px;
        table-layout: fixed;
      }

      .main-table th,
      .main-table td {
        border: 1px solid #333;
        padding: 3px 2px;
        text-align: center;
        vertical-align: middle;
      }

      .category-header {
        background: #2c3e50;
        color: white;
        font-weight: bold;
        width: 120px;
        font-size: 9px;
      }

      .month-header {
        background: #34495e;
        color: white;
        font-weight: bold;
        width: 60px;
        font-size: 8px;
        writing-mode: vertical-rl;
        text-orientation: mixed;
      }

      .total-header {
        background: #2c3e50;
        color: white;
        font-weight: bold;
        width: 80px;
        font-size: 9px;
      }

      .section-header td {
        background: #ecf0f1;
        font-weight: bold;
        color: #2c3e50;
        text-align: center;
        font-size: 9px;
      }

      .category-cell {
        background: #f8f9fa;
        text-align: left;
        padding-left: 5px;
        font-weight: 500;
        font-size: 8px;
      }

      .amount-cell {
        text-align: right;
        padding-right: 3px;
        font-size: 7px;
      }

      .total-cell {
        background: #ecf0f1;
        text-align: right;
        padding-right: 3px;
        font-weight: bold;
        font-size: 8px;
      }

      .total-revenue {
        background: #d5edda;
        color: #155724;
      }

      .total-expense {
        background: #f8d7da;
        color: #721c24;
      }

      .total-remboursement {
        background: #fff3cd;
        color: #856404;
      }

      .subtotal-row td {
        background: #e2e6ea;
        font-weight: bold;
        border-top: 2px solid #333;
      }

      .result-row td {
        background: #e7f3ff;
        font-weight: bold;
        border-top: 2px solid #333;
        font-size: 9px;
      }

      .solde-row td {
        background: #f0f8ff;
        font-weight: bold;
      }

      .final-row td {
        border-bottom: 3px solid #333;
        background: #e6f3ff;
      }

      .positive {
        color: #28a745;
        font-weight: bold;
      }

      .negative {
        color: #dc3545;
        font-weight: bold;
      }

      .warning {
        color: #ffc107;
        font-weight: bold;
      }

      .remboursement {
        background: #fff8e1;
      }

      .analysis-section {
        margin-top: 20px;
        page-break-inside: avoid;
      }

      .analysis-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 15px;
      }

      .analysis-block {
        border: 1px solid #dee2e6;
        border-radius: 6px;
        padding: 10px;
        background: #f8f9fa;
      }

      .analysis-block h3 {
        color: #2c3e50;
        font-size: 11px;
        margin-bottom: 8px;
        border-bottom: 1px solid #dee2e6;
        padding-bottom: 3px;
      }

      .indicators,
      .alerts,
      .synthesis {
        font-size: 9px;
      }

      .indicator {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
        padding: 3px 0;
      }

      .indicator-label {
        font-weight: 500;
      }

      .indicator-value {
        font-weight: bold;
      }

      .alert {
        padding: 6px;
        margin-bottom: 6px;
        border-radius: 3px;
        font-size: 8px;
      }

      .alert-success {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
      }

      .alert-warning {
        background: #fff3cd;
        color: #856404;
        border: 1px solid #ffeaa7;
      }

      .alert-danger {
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
      }

      .synthesis p {
        margin-bottom: 4px;
        display: flex;
        justify-content: space-between;
      }

      .footer {
        margin-top: 30px;
        padding-top: 10px;
        border-top: 1px solid #dee2e6;
        display: flex;
        justify-content: space-between;
        font-size: 8px;
        color: #6c757d;
      }

      @media print {
        body { margin: 0; }
        .print-container { padding: 5mm; }
        .analysis-section { page-break-inside: avoid; }
        .footer { page-break-inside: avoid; }
      }

      @page {
        margin: 8mm;
        size: A4 landscape;
      }
    `;
    }
}
