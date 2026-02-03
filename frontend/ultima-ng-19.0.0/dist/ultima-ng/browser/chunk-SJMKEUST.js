import {
  SplitButton,
  SplitButtonModule
} from "./chunk-L4DY2TIW.js";
import "./chunk-GEHWKAXI.js";
import {
  AccordionModule
} from "./chunk-GWCBG6OL.js";
import {
  PanelModule
} from "./chunk-WJXIL2JJ.js";
import {
  Toast,
  ToastModule
} from "./chunk-6SRYYUT2.js";
import {
  ProgressBar,
  ProgressBarModule
} from "./chunk-WQ2EPPBK.js";
import {
  SkeletonModule
} from "./chunk-ZUPKH4BQ.js";
import {
  Divider,
  DividerModule
} from "./chunk-VDET62CU.js";
import {
  Table,
  TableModule
} from "./chunk-REDVHUQC.js";
import "./chunk-YZRRSC3U.js";
import "./chunk-6K6X5UBT.js";
import "./chunk-7HJ4XJ7U.js";
import "./chunk-UQSIOFSP.js";
import "./chunk-OCW7T434.js";
import "./chunk-4JIPYACT.js";
import "./chunk-6GA37Q7Z.js";
import {
  Tag,
  TagModule
} from "./chunk-MYUKI7DG.js";
import "./chunk-544F7IXR.js";
import "./chunk-YBM6FZLP.js";
import "./chunk-U4P2VV4G.js";
import "./chunk-CPYA4VSS.js";
import {
  Card,
  CardModule
} from "./chunk-H46GQ57A.js";
import "./chunk-JGOABXTK.js";
import "./chunk-HY2A3TN6.js";
import "./chunk-YEN5RMZS.js";
import "./chunk-XS7IVZ5T.js";
import "./chunk-CUABQE42.js";
import "./chunk-V6CKOH3G.js";
import "./chunk-DBPX6ILC.js";
import "./chunk-WIQZFAVH.js";
import "./chunk-CCBQFN2J.js";
import {
  ProgressSpinner,
  ProgressSpinnerModule
} from "./chunk-Y2J5OGKB.js";
import {
  ActivatedRoute,
  Router
} from "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
import {
  takeUntilDestroyed
} from "./chunk-WRLBQDQK.js";
import "./chunk-KHEKFKWA.js";
import "./chunk-FZELBHWZ.js";
import {
  Tooltip,
  TooltipModule
} from "./chunk-4IUQ6KTI.js";
import "./chunk-IVSL2HKS.js";
import "./chunk-E352KRZV.js";
import "./chunk-HHD4PK4J.js";
import {
  Badge,
  BadgeModule,
  Button,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import "./chunk-AP3OAIHW.js";
import {
  MessageService,
  PrimeTemplate
} from "./chunk-NQNBRQ7H.js";
import "./chunk-3HTR5OU7.js";
import {
  UserService
} from "./chunk-SQ5BRWVW.js";
import "./chunk-ZRELZ6R7.js";
import "./chunk-BMYIFZHZ.js";
import "./chunk-W3K3GK4Z.js";
import {
  CommonModule,
  NgClass,
  NgIf
} from "./chunk-SQQPVFHK.js";
import {
  DestroyRef,
  inject,
  signal,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3
} from "./chunk-ZKKMBKIA.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/service/PrintService.ts
var PrintService = class _PrintService {
  /**
   * Imprime le bilan de crédit
   */
  imprimerBilan(data, options = {}) {
    const printWindow = window.open("", "_blank", "width=1200,height=800");
    if (!printWindow) {
      console.error("Impossible d'ouvrir la fen\xEAtre d'impression");
      return;
    }
    const htmlContent = this.genererHTML(data, options);
    printWindow.document.write(htmlContent);
    printWindow.document.close();
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
  genererHTML(data, options) {
    const styles = this.getStyles();
    const content = this.genererContenu(data, options);
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>R\xE9sum\xE9 d'Analyse de Cr\xE9dit</title>
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
  genererContenu(data, options) {
    const dateImpression = (/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    return `
      <div class="print-container">
        <!-- En-t\xEAte -->
        <div class="header">
          <div class="header-content">
            <h1>R\xC9SUM\xC9 D'ANALYSE DE CR\xC9DIT</h1>
            <div class="header-info">
              <p><strong>Date d'impression:</strong> ${dateImpression}</p>
              <p><strong>Montant demand\xE9:</strong> ${data.montantDemande}</p>
              <p><strong>\xC9valuation:</strong> <span class="evaluation ${data.evaluationGlobale.toLowerCase()}">${data.evaluationGlobale}</span></p>
            </div>
          </div>
        </div>

        <!-- \xC9valuation globale -->
        ${this.genererEvaluationGlobale(data)}

        <!-- Indicateurs cl\xE9s -->
        ${options.includeIndicateurs !== false ? this.genererIndicateursCles(data) : ""}

        <!-- Informations g\xE9n\xE9rales -->
        ${this.genererInformationsGenerales(data)}

        <!-- Bilan financier -->
        ${this.genererBilanFinancier(data)}

        <!-- Exploitation -->
        ${this.genererExploitation(data)}

        <!-- Demande de cr\xE9dit -->
        ${this.genererDemandeCredit(data)}

        <!-- Personnes caution -->
        ${this.genererPersonnesCaution(data)}

        <!-- Recommandations -->
        ${this.genererRecommandations(data)}

        <!-- Pied de page -->
        <div class="footer">
          <p>Document g\xE9n\xE9r\xE9 automatiquement le ${dateImpression}</p>
          ${options.includeSignature ? `<div class="signature-section"><p>Signature de l'analyste: ___________________</p></div>` : ""}
        </div>
      </div>
    `;
  }
  /**
   * Génère la section évaluation globale
   */
  genererEvaluationGlobale(data) {
    return `
      <div class="section evaluation-section">
        <h2>\xC9VALUATION GLOBALE</h2>
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
            <h3>Seuils Respect\xE9s</h3>
            <div class="seuils">${data.seuilsRespetes}/6</div>
          </div>
        </div>
      </div>
    `;
  }
  /**
   * Génère la section indicateurs clés
   */
  genererIndicateursCles(data) {
    return `
      <div class="section">
        <h2>INDICATEURS CL\xC9S</h2>
        <div class="indicateurs-grid">
          ${data.ratios.map((ratio) => `
            <div class="indicateur-item">
              <h4>${ratio.nom}</h4>
              <div class="ratio-value ${ratio.statut.toLowerCase()}">${ratio.valeur}%</div>
              <div class="ratio-status">${ratio.statut}</div>
              <div class="ratio-formula">${ratio.formule}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }
  /**
   * Génère les informations générales
   */
  genererInformationsGenerales(data) {
    return `
      <div class="section">
        <h2>INFORMATIONS G\xC9N\xC9RALES</h2>
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
  genererBilanFinancier(data) {
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
  genererExploitation(data) {
    return `
      <div class="section">
        <h2>EXPLOITATION</h2>
        <div class="exploitation-grid">
          <div class="exploitation-block">
            <h3>Exploitation Actuelle</h3>
            ${this.genererTableau(data.exploitationActuelle)}
            <h4>D\xE9tail des Charges</h4>
            ${this.genererTableau(data.chargesActuelles)}
          </div>
          <div class="exploitation-block">
            <h3>Exploitation Pr\xE9visionnelle</h3>
            ${this.genererTableau(data.exploitationPrevisionnelle)}
            <h4>D\xE9tail des Charges</h4>
            ${this.genererTableau(data.chargesPrevisionnelles)}
          </div>
        </div>
      </div>
    `;
  }
  /**
   * Génère la section demande de crédit
   */
  genererDemandeCredit(data) {
    return `
      <div class="section">
        <h2>DEMANDE DE CR\xC9DIT</h2>
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
  genererPersonnesCaution(data) {
    if (!data.personnesCaution || data.personnesCaution.length === 0) {
      return `
        <div class="section">
          <h2>PERSONNES CAUTION</h2>
          <div class="no-caution">
            <p>Aucune personne caution renseign\xE9e</p>
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
  genererRecommandations(data) {
    return `
      <div class="section">
        <h2>RECOMMANDATIONS ET ANALYSE</h2>
        <div class="recommandations-grid">
          <div class="recommandations-block">
            <h3>Recommandations</h3>
            <ul>
              ${data.recommandations.map((rec) => `<li>${rec}</li>`).join("")}
            </ul>
          </div>
          <div class="recommandations-block">
            <h3>Conseils d'Am\xE9lioration</h3>
            <ul>
              ${data.conseilsAmelioration.map((conseil) => `<li>${conseil}</li>`).join("")}
            </ul>
          </div>
        </div>
        <div class="decision-block">
          <h3>Recommandation de D\xE9cision</h3>
          <div class="decision-content">
            <p><strong>D\xE9cision:</strong> <span class="decision ${data.decisionRecommandee.decision.toLowerCase()}">${data.decisionRecommandee.decision.replace("_", " ")}</span></p>
            <p><strong>Justification:</strong> ${data.decisionRecommandee.justification}</p>
            ${data.decisionRecommandee.conditions ? `
              <p><strong>Conditions:</strong></p>
              <ul>
                ${data.decisionRecommandee.conditions.map((condition) => `<li>${condition}</li>`).join("")}
              </ul>
            ` : ""}
          </div>
        </div>
      </div>
    `;
  }
  /**
   * Génère un tableau HTML à partir de données
   */
  genererTableau(data) {
    if (!data || data.length === 0)
      return "<p>Aucune donn\xE9e disponible</p>";
    return `
      <table>
        <tbody>
          ${data.map((item) => `
            <tr ${item.isTotal ? 'class="total-row"' : ""}>
              <td class="label">${item.label}</td>
              <td class="value ${item.severity ? item.severity : ""}">${item.value}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }
  /**
   * Retourne les styles CSS pour l'impression
   */
  getStyles() {
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
  static \u0275fac = function PrintService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PrintService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PrintService, factory: _PrintService.\u0275fac, providedIn: "root" });
};

// src/app/service/ResumeCreditPrintService.ts
var ResumeCreditPrintService = class _ResumeCreditPrintService {
  /**
   * Imprime le résumé de crédit organisé en 4 pages
   */
  imprimerResumeCredit(data, options = {}) {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) {
      console.error("Impossible d'ouvrir la fen\xEAtre d'impression");
      return;
    }
    const html = this.genererHTMLComplet(data, options);
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  }
  /**
   * Génère le HTML complet pour l'impression
   */
  genererHTMLComplet(data, options) {
    return `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <title>${options.title || "R\xE9sum\xE9 d'Analyse de Cr\xE9dit"}</title>
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
  genererPage1InformationsGenerales(data) {
    const formatCurrency = (value) => {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "GNF",
        minimumFractionDigits: 0
      }).format(value || 0);
    };
    return `
            <div class="page">
                <div class="header">
                    <h1>R\xC9SUM\xC9 D'ANALYSE DE CR\xC9DIT</h1>
                    <h2>PAGE 1 : INFORMATIONS G\xC9N\xC9RALES</h2>
                    <div class="date">Date : ${(/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR")}</div>
                </div>

                <!-- Informations de la demande -->
                <div class="section">
                    <h3>DEMANDE DE CR\xC9DIT</h3>
                    <table class="info-table">
                        <tr>
                            <td><strong>Montant demand\xE9 :</strong></td>
                            <td>${formatCurrency(data.montantDemande)}</td>
                            <td><strong>Date demande :</strong></td>
                            <td>${data.demandeCredit?.[0]?.value || "-"}</td>
                        </tr>
                        <tr>
                            <td><strong>Dur\xE9e :</strong></td>
                            <td>${data.demandeCredit?.[2]?.value || "-"}</td>
                            <td><strong>Mensualit\xE9 estim\xE9e :</strong></td>
                            <td>${data.demandeCredit?.[4]?.value || "-"}</td>
                        </tr>
                        <tr>
                            <td><strong>Objet du financement :</strong></td>
                            <td colspan="3">${data.demandeCredit?.[3]?.value || "-"}</td>
                        </tr>
                    </table>
                </div>

                <!-- Informations du promoteur -->
                <div class="section">
                    <h3>INFORMATIONS DU PROMOTEUR</h3>
                    <table class="info-table">
                        ${data.promoteur?.map((item, index) => index % 2 === 0 ? `
                            <tr>
                                <td><strong>${item.label} :</strong></td>
                                <td>${item.value}</td>
                                ${data.promoteur[index + 1] ? `
                                    <td><strong>${data.promoteur[index + 1].label} :</strong></td>
                                    <td>${data.promoteur[index + 1].value}</td>
                                ` : "<td></td><td></td>"}
                            </tr>
                            ` : "").join("")}
                    </table>
                </div>

                <!-- Informations de l'entreprise -->
                <div class="section">
                    <h3>INFORMATIONS DE L'ENTREPRISE</h3>
                    <table class="info-table">
                        ${data.entreprise?.map((item, index) => index % 2 === 0 ? `
                            <tr>
                                <td><strong>${item.label} :</strong></td>
                                <td>${item.value}</td>
                                ${data.entreprise[index + 1] ? `
                                    <td><strong>${data.entreprise[index + 1].label} :</strong></td>
                                    <td>${data.entreprise[index + 1].value}</td>
                                ` : "<td></td><td></td>"}
                            </tr>
                            ` : "").join("")}
                    </table>
                </div>

                <!-- Bilans financiers -->
                <div class="section">
                    <h3>BILANS FINANCIERS</h3>
                    <div class="bilan-container">
                        <div class="bilan-column">
                            <h4>Bilan Entreprise</h4>
                            <table class="small-table">
                                ${data.bilanEntreprise?.slice(0, 7).map((item) => `
                                    <tr>
                                        <td>${item.label}</td>
                                        <td class="text-right">${item.value}</td>
                                    </tr>
                                `).join("")}
                            </table>
                        </div>
                        <div class="bilan-column">
                            <h4>Patrimoine Personnel</h4>
                            <table class="small-table">
                                ${data.bilanPersonnel?.map((item) => `
                                    <tr ${item.isTotal ? 'class="total-row"' : ""}>
                                        <td>${item.label}</td>
                                        <td class="text-right">${item.value}</td>
                                    </tr>
                                `).join("")}
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Informations administratives -->
                ${data.informationsAdministratives ? `
                <div class="section">
                    <h3>TRA\xC7ABILIT\xC9 ADMINISTRATIVE</h3>
                    <table class="info-table">
                        <tr>
                            <td><strong>D\xE9l\xE9gation :</strong></td>
                            <td>${data.informationsAdministratives.delegation || "-"}</td>
                            <td><strong>Agence :</strong></td>
                            <td>${data.informationsAdministratives.agence || "-"}</td>
                        </tr>
                        <tr>
                            <td><strong>Point de vente :</strong></td>
                            <td>${data.informationsAdministratives.pointVente || "-"}</td>
                            <td><strong>Agent traitant :</strong></td>
                            <td>${data.informationsAdministratives.utilisateurTraitant || "-"}</td>
                        </tr>
                    </table>
                </div>
                ` : ""}

                <div class="footer">
                    <p><strong>NB: L'emprunteur et l'agent de cr\xE9dit doivent parapher toutes les pages.</strong></p>
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
  genererPage2Exploitation(data) {
    return `
            <div class="page">
                <div class="header">
                    <h1>R\xC9SUM\xC9 D'ANALYSE DE CR\xC9DIT</h1>
                    <h2>PAGE 2 : EXPLOITATION</h2>
                    <div class="date">Date : ${(/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR")}</div>
                </div>

                <!-- Exploitation Actuelle -->
                <div class="section">
                    <h3>EXPLOITATION ACTUELLE</h3>
                    <table class="info-table">
                        ${data.exploitationActuelle?.map((item) => `
                            <tr ${item.isTotal ? 'class="total-row"' : ""} ${item.isRatio ? 'class="ratio-row"' : ""}>
                                <td><strong>${item.label} :</strong></td>
                                <td class="${item.isTotal || item.isRatio ? "highlight" : ""}">
                                    ${item.value}
                                    ${item.severity ? this.getBadgeHTML(item.severity) : ""}
                                </td>
                            </tr>
                        `).join("")}
                    </table>

                    <h4>D\xE9tail des Charges Actuelles</h4>
                    <table class="info-table">
                        ${data.chargesActuelles?.map((item) => `
                            <tr ${item.isTotal ? 'class="total-row"' : ""}>
                                <td><strong>${item.label} :</strong></td>
                                <td class="${item.isTotal ? "highlight" : ""}">${item.value}</td>
                            </tr>
                        `).join("")}
                    </table>
                </div>

                <!-- Exploitation Pr\xE9visionnelle -->
                <div class="section">
                    <h3>EXPLOITATION PR\xC9VISIONNELLE</h3>
                    <table class="info-table">
                        ${data.exploitationPrevisionnelle?.map((item) => `
                            <tr ${item.isTotal ? 'class="total-row"' : ""} ${item.isRatio ? 'class="ratio-row"' : ""}>
                                <td><strong>${item.label} :</strong></td>
                                <td class="${item.isTotal || item.isRatio ? "highlight" : ""}">
                                    ${item.value}
                                    ${item.severity ? this.getBadgeHTML(item.severity) : ""}
                                </td>
                            </tr>
                        `).join("")}
                    </table>

                    <h4>D\xE9tail des Charges Pr\xE9visionnelles</h4>
                    <table class="info-table">
                        ${data.chargesPrevisionnelles?.map((item) => `
                            <tr ${item.isTotal ? 'class="total-row"' : ""}>
                                <td><strong>${item.label} :</strong></td>
                                <td class="${item.isTotal ? "highlight" : ""}">${item.value}</td>
                            </tr>
                        `).join("")}
                    </table>
                </div>

                <!-- Comparaison Actuelle vs Pr\xE9visionnelle -->
                <div class="section">
                    <h3>ANALYSE COMPARATIVE</h3>
                    <div class="comparison-box">
                        <p><strong>\xC9volution du chiffre d'affaires :</strong> 
                            Analyse de la progression entre l'exploitation actuelle et pr\xE9visionnelle
                        </p>
                        <p><strong>\xC9volution des charges :</strong> 
                            Comparaison des charges totales entre les deux p\xE9riodes
                        </p>
                        <p><strong>Am\xE9lioration des marges :</strong> 
                            Impact sur la rentabilit\xE9 de l'entreprise
                        </p>
                    </div>
                </div>

                <div class="footer">
                    <p><strong>NB: L'emprunteur et l'agent de cr\xE9dit doivent parapher toutes les pages.</strong></p>
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
  genererPage3ResumeAnalyse(data) {
    const checkSeuil = (ratio) => {
      const value = parseFloat(ratio.valeur);
      let respecteSeuil = false;
      switch (ratio.nom) {
        case "R1 - Capacit\xE9 de remboursement":
          respecteSeuil = value >= 150;
          break;
        case "R2 - Ratio de solvabilit\xE9":
          respecteSeuil = value >= 25;
          break;
        case "R3 - Ratio de liquidit\xE9":
          respecteSeuil = value >= 100;
          break;
        case "R4 - Ratio d'endettement":
          respecteSeuil = value <= 70;
          break;
        case "R5 - Ratio de d\xE9pendance":
          respecteSeuil = value <= 50;
          break;
        case "R6 - Ratio de couverture":
          respecteSeuil = value >= 120;
          break;
      }
      return respecteSeuil ? "\u2705" : "\u274C";
    };
    return `
            <div class="page">
                <div class="header">
                    <h1>R\xC9SUM\xC9 D'ANALYSE DE CR\xC9DIT</h1>
                    <h2>PAGE 3 : ANALYSE DES RATIOS ET \xC9VALUATION</h2>
                    <div class="date">Date : ${(/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR")}</div>
                </div>

                <!-- Tableau comparatif des ratios -->
                <div class="section">
                    <h3>COMPARAISON AVEC LES SEUILS D'\xC9VALUATION</h3>
                    <table class="ratio-comparison-table">
                        <thead>
                            <tr>
                                <th>Ratio</th>
                                <th>Formule</th>
                                <th>Seuil Acceptable</th>
                                <th>Valeur Calcul\xE9e</th>
                                <th>Statut</th>
                                <th>Conforme</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.ratios ? Object.values(data.ratios).map((ratio) => {
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
    }).join("") : ""}
                        </tbody>
                    </table>
                </div>

                <!-- Synth\xE8se de l'\xE9valuation -->
                <div class="section">
                    <h3>SYNTH\xC8SE DE L'\xC9VALUATION</h3>
                    <div class="evaluation-summary">
                        <div class="eval-item">
                            <span class="label">\xC9valuation Globale :</span>
                            <span class="value ${data.evaluation?.toLowerCase()}">${data.evaluation || "-"}</span>
                        </div>
                        <div class="eval-item">
                            <span class="label">Score de Risque :</span>
                            <span class="value">${data.scoreRisque || 0}/100</span>
                        </div>
                        <div class="eval-item">
                            <span class="label">Seuils Respect\xE9s :</span>
                            <span class="value">${data.seuilsRespetes || 0}/6</span>
                        </div>
                        <div class="eval-item">
                            <span class="label">Taux de Conformit\xE9 :</span>
                            <span class="value">${Math.round(data.seuilsRespetes / 6 * 100)}%</span>
                        </div>
                    </div>
                </div>

                <!-- Analyse de risque -->
                <div class="section">
                    <h3>ANALYSE DE RISQUE</h3>
                    <div class="risk-analysis">
                        <h4>Facteurs de risque identifi\xE9s :</h4>
                        <ul>
                            ${data.analyseRisque?.facteurs?.map((facteur) => `<li>${facteur}</li>`).join("") || "<li>Aucun facteur de risque majeur identifi\xE9</li>"}
                        </ul>
                    </div>
                </div>

                <!-- D\xE9cision recommand\xE9e -->
                <div class="section">
                    <h3>D\xC9CISION RECOMMAND\xC9E</h3>
                    <div class="decision-box ${data.decisionRecommandee?.decision?.toLowerCase()}">
                        <p><strong>D\xE9cision :</strong> ${data.decisionRecommandee?.decision?.replace(/_/g, " ") || "-"}</p>
                        <p><strong>Justification :</strong> ${data.decisionRecommandee?.justification || "-"}</p>
                        ${data.decisionRecommandee?.conditions ? `
                            <h4>Conditions :</h4>
                            <ul>
                                ${data.decisionRecommandee.conditions.map((condition) => `<li>${condition}</li>`).join("")}
                            </ul>
                        ` : ""}
                    </div>
                </div>

                <div class="footer">
                    <p><strong>NB: L'emprunteur et l'agent de cr\xE9dit doivent parapher toutes les pages.</strong></p>
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
  genererPage4PersonnesCaution(data, includeSignature) {
    const hasPersonnesCaution = data.personnesCaution && data.personnesCaution.length > 0;
    return `
            <div class="page">
                <div class="header">
                    <h1>R\xC9SUM\xC9 D'ANALYSE DE CR\xC9DIT</h1>
                    <h2>PAGE 4 : PERSONNES CAUTION ET VALIDATION</h2>
                    <div class="date">Date : ${(/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR")}</div>
                </div>

                <!-- Personnes Caution -->
                <div class="section">
                    <h3>PERSONNES CAUTION (${data.personnesCaution?.length || 0})</h3>
                    
                    ${!hasPersonnesCaution ? `
                        <div class="warning-box">
                            <p><strong>\u26A0\uFE0F ATTENTION :</strong> Aucune personne caution n'a \xE9t\xE9 renseign\xE9e pour cette demande de cr\xE9dit.</p>
                            <p>Risque de garantie insuffisant - Il est recommand\xE9 d'exiger au moins une personne caution solvable.</p>
                        </div>
                    ` : `
                        ${data.personnesCaution.map((personne, index) => `
                            <div class="caution-box">
                                <h4>Caution ${index + 1}</h4>
                                <table class="info-table">
                                    <tr>
                                        <td><strong>Nom :</strong></td>
                                        <td>${personne.nom || "-"}</td>
                                        <td><strong>Pr\xE9nom :</strong></td>
                                        <td>${personne.prenom || "-"}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>T\xE9l\xE9phone :</strong></td>
                                        <td>${personne.telephone || "-"}</td>
                                        <td><strong>\xC2ge :</strong></td>
                                        <td>${personne.age ? personne.age + " ans" : "-"}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Profession :</strong></td>
                                        <td>${personne.profession || "-"}</td>
                                        <td><strong>Activit\xE9 :</strong></td>
                                        <td>${personne.activite || "-"}</td>
                                    </tr>
                                </table>
                            </div>
                        `).join("")}

                        <!-- Analyse de la garantie -->
                        <div class="garantie-analysis">
                            <h4>Analyse de la Garantie Personnelle</h4>
                            <table class="info-table">
                                <tr>
                                    <td><strong>Niveau de garantie :</strong></td>
                                    <td>${data.analyseGarantie?.niveau || "-"}</td>
                                    <td><strong>Score :</strong></td>
                                    <td>${data.analyseGarantie?.score || 0}/100</td>
                                </tr>
                                <tr>
                                    <td colspan="4">
                                        <strong>Description :</strong> ${data.analyseGarantie?.description || "-"}
                                    </td>
                                </tr>
                            </table>
                        </div>
                    `}
                </div>

                <!-- Validation finale -->
                <div class="section">
                    <h3>VALIDATION DU DOSSIER</h3>
                    <div class="validation-box">
                        <p>Je soussign\xE9(e), certifie l'exactitude des informations fournies dans ce dossier de demande de cr\xE9dit.</p>
                        <p>J'ai pris connaissance de l'analyse effectu\xE9e et des conditions propos\xE9es.</p>
                        <br>
                        <p>Fait \xE0 _________________, le _________________</p>
                    </div>
                </div>

                <!-- Zone de signatures -->
                <div class="signature-section">
                    <h3>SIGNATURES</h3>
                    <div class="signature-container">
                        <div class="signature-box">
                            <div class="signature-line"></div>
                            <p><strong>Nom et Pr\xE9nom de l'emprunteur</strong></p>
                            <p>${data.promoteur?.[0]?.value || ""} ${data.promoteur?.[1]?.value || ""}</p>
                        </div>
                        <div class="signature-box">
                            <div class="signature-line"></div>
                            <p><strong>Nom de l'agent de cr\xE9dit</strong></p>
                            <p>${data.informationsAdministratives?.utilisateurTraitant?.split(" - ")[0] || ""}</p>
                        </div>
                    </div>
                </div>

                <div class="footer">
                    <p><strong>NB: L'emprunteur et l'agent de cr\xE9dit doivent parapher toutes les pages.</strong></p>
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
  getSeuilText(nomRatio) {
    switch (nomRatio) {
      case "R1 - Capacit\xE9 de remboursement":
        return "\u2265 150%";
      case "R2 - Ratio de solvabilit\xE9":
        return "\u2265 25%";
      case "R3 - Ratio de liquidit\xE9":
        return "\u2265 100%";
      case "R4 - Ratio d'endettement":
        return "\u2264 70%";
      case "R5 - Ratio de d\xE9pendance":
        return "\u2264 50%";
      case "R6 - Ratio de couverture":
        return "\u2265 120%";
      default:
        return "-";
    }
  }
  /**
   * Helper: Générer le HTML d'un badge de sévérité
   */
  getBadgeHTML(severity) {
    const colors = {
      success: "#22c55e",
      info: "#3b82f6",
      warn: "#f59e0b",
      danger: "#ef4444"
    };
    return `<span class="badge ${severity}" style="background-color: ${colors[severity] || "#6b7280"}"></span>`;
  }
  /**
   * Styles CSS pour l'impression
   */
  genererStyles() {
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
  static \u0275fac = function ResumeCreditPrintService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ResumeCreditPrintService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ResumeCreditPrintService, factory: _ResumeCreditPrintService.\u0275fac, providedIn: "root" });
};

// src/app/pages/dashboard/analyse-credit/resume-credit/resume-credit.component.ts
var _c0 = () => ({ "background": "#28a745", "border-color": "#28a745" });
var _c1 = () => ({ "height": "8px" });
var _c2 = () => ({ "height": "12px" });
var _c3 = () => ({ "min-width": "100%" });
var _c4 = (a0) => ({ "border-top-2 border-teal-200 bg-teal-50": a0 });
var _c5 = (a0) => ({ "text-teal-700 font-bold": a0 });
var _c6 = (a0) => ({ "font-semibold": a0 });
var _c7 = (a0) => ({ "font-bold bg-blue-50": a0 });
var _c8 = (a0) => ({ "font-bold bg-green-50": a0 });
var _c9 = () => ({ "width": "20px", "height": "20px" });
var _c10 = () => ({ "width": "30px", "height": "30px" });
var _c11 = (a0) => ({ "bg-green-50": a0 });
var _forTrack0 = ($index, $item) => $item.label;
function ResumeCreditComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 6);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.getResumeImpression());
  }
}
function ResumeCreditComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8)(1, "p-button", 13);
    \u0275\u0275listener("onClick", function ResumeCreditComponent_Conditional_11_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.imprimerBilan());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p-splitButton", 14);
    \u0275\u0275listener("onClick", function ResumeCreditComponent_Conditional_11_Template_p_splitButton_onClick_2_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.previsualiserImpression());
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(3, _c0));
    \u0275\u0275advance();
    \u0275\u0275property("model", ctx_r0.printMenuModel);
  }
}
function ResumeCreditComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275element(1, "p-button", 15);
    \u0275\u0275elementEnd();
  }
}
function ResumeCreditComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 11)(1, "div", 2)(2, "div", 16)(3, "div", 17)(4, "div", 18);
    \u0275\u0275element(5, "i", 19);
    \u0275\u0275elementStart(6, "span", 20);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 21)(9, "p-button", 22);
    \u0275\u0275listener("onClick", function ResumeCreditComponent_Conditional_14_Template_p_button_onClick_9_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.previsualiserImpression());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p-button", 23);
    \u0275\u0275listener("onClick", function ResumeCreditComponent_Conditional_14_Template_p_button_onClick_10_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.imprimerBilan());
    });
    \u0275\u0275elementEnd()()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1(" Document pr\xEAt pour l'impression - ", ctx_r0.getResumeImpression(), " ");
  }
}
function ResumeCreditComponent_Conditional_15_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 47);
    \u0275\u0275element(1, "i", 48);
    \u0275\u0275elementStart(2, "h4", 49);
    \u0275\u0275text(3, "Recommandations et Analyse");
    \u0275\u0275elementEnd()();
  }
}
function ResumeCreditComponent_Conditional_15_For_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 28)(1, "div", 50);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const recommandation_r4 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(recommandation_r4);
  }
}
function ResumeCreditComponent_Conditional_15_For_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 38);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const facteur_r5 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("\u2022 ", facteur_r5, "");
  }
}
function ResumeCreditComponent_Conditional_15_For_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25)(1, "div", 51)(2, "small", 52);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const conseil_r6 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(conseil_r6);
  }
}
function ResumeCreditComponent_Conditional_15_Conditional_47_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 54);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const condition_r7 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("\u2022 ", condition_r7, "");
  }
}
function ResumeCreditComponent_Conditional_15_Conditional_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 46)(1, "small", 53);
    \u0275\u0275text(2, "Conditions recommand\xE9es :");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, ResumeCreditComponent_Conditional_15_Conditional_47_For_4_Template, 2, 1, "div", 54, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r0.getRecommandationDecision().conditions);
  }
}
function ResumeCreditComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12)(1, "div", 2)(2, "p-card");
    \u0275\u0275template(3, ResumeCreditComponent_Conditional_15_ng_template_3_Template, 4, 0, "ng-template", 24);
    \u0275\u0275elementStart(4, "div", 1)(5, "div", 25)(6, "h6", 26);
    \u0275\u0275text(7, "\u{1F4A1} Recommandations");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 27);
    \u0275\u0275repeaterCreate(9, ResumeCreditComponent_Conditional_15_For_10_Template, 3, 1, "div", 28, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 25)(12, "h6", 29);
    \u0275\u0275text(13, "\u26A0\uFE0F Analyse de Risque");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div", 30)(15, "div", 31)(16, "div", 32)(17, "span", 33);
    \u0275\u0275text(18, "Score de risque :");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span", 34);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(21, "p-progressBar", 35);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "div", 36)(23, "small", 37);
    \u0275\u0275text(24, "Facteurs identifi\xE9s :");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(25, ResumeCreditComponent_Conditional_15_For_26_Template, 2, 1, "div", 38, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275element(27, "p-divider");
    \u0275\u0275elementStart(28, "div", 39)(29, "h6", 40);
    \u0275\u0275text(30, "\u{1F3AF} Conseils d'Am\xE9lioration");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div", 1);
    \u0275\u0275repeaterCreate(32, ResumeCreditComponent_Conditional_15_For_33_Template, 4, 1, "div", 25, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(34, "p-divider");
    \u0275\u0275elementStart(35, "div", 39)(36, "h6", 41);
    \u0275\u0275text(37, "\u2696\uFE0F Recommandation de D\xE9cision");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "div", 42)(39, "div", 32)(40, "span", 43);
    \u0275\u0275text(41, "D\xE9cision recommand\xE9e :");
    \u0275\u0275elementEnd();
    \u0275\u0275element(42, "p-tag", 44);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "div", 45)(44, "strong");
    \u0275\u0275text(45, "Justification :");
    \u0275\u0275elementEnd();
    \u0275\u0275text(46);
    \u0275\u0275elementEnd();
    \u0275\u0275template(47, ResumeCreditComponent_Conditional_15_Conditional_47_Template, 5, 0, "div", 46);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(9);
    \u0275\u0275repeater(ctx_r0.getRecommandations());
    \u0275\u0275advance(10);
    \u0275\u0275classMap(ctx_r0.getCouleurEvaluationGlobale());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getScoreRisque(), "/100 ");
    \u0275\u0275advance();
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(13, _c1));
    \u0275\u0275classMap("progress-" + ctx_r0.getEvaluationGlobale().toLowerCase());
    \u0275\u0275property("value", ctx_r0.getScoreRisque());
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r0.getAnalyseRisque().facteurs);
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r0.getConseilsAmelioration());
    \u0275\u0275advance(6);
    \u0275\u0275property("ngClass", "bg-" + ctx_r0.getRecommandationDecision().decision.toLowerCase().replace("_", "-") + "-50");
    \u0275\u0275advance(4);
    \u0275\u0275property("value", ctx_r0.getRecommandationDecision().decision.replace("_", " "))("severity", ctx_r0.getDecisionSeverity());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r0.getRecommandationDecision().justification, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.getRecommandationDecision().conditions ? 47 : -1);
  }
}
function ResumeCreditComponent_Conditional_16_Template(rf, ctx) {
}
function ResumeCreditComponent_Conditional_17_ng_template_126_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 114);
    \u0275\u0275element(1, "i", 115);
    \u0275\u0275elementStart(2, "h4", 116);
    \u0275\u0275text(3, "Seuils d'\xC9valuation des Ratios");
    \u0275\u0275elementEnd()();
  }
}
function ResumeCreditComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12)(1, "div", 2)(2, "h3", 55);
    \u0275\u0275element(3, "i", 56);
    \u0275\u0275text(4, " Indicateurs Cl\xE9s avec Formules de Calcul ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 57)(6, "div", 58)(7, "div", 59)(8, "div", 60);
    \u0275\u0275element(9, "i", 61);
    \u0275\u0275elementStart(10, "div")(11, "h5", 62);
    \u0275\u0275text(12, "R1 - Capacit\xE9 de remboursement");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "small", 63);
    \u0275\u0275text(14, "(Cash Flow + Autres revenus) / (Traite revenus)");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(15, "div", 64);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 65)(18, "div", 66)(19, "strong");
    \u0275\u0275text(20, "Calcul :");
    \u0275\u0275elementEnd();
    \u0275\u0275text(21);
    \u0275\u0275elementEnd();
    \u0275\u0275element(22, "p-tag", 44);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(23, "div", 67);
    \u0275\u0275element(24, "div", 68);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "div", 57)(26, "div", 58)(27, "div", 59)(28, "div", 60);
    \u0275\u0275element(29, "i", 69);
    \u0275\u0275elementStart(30, "div")(31, "h5", 70);
    \u0275\u0275text(32, "R2 - Ratio de solvabilit\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "small", 71);
    \u0275\u0275text(34, "Capitaux propres / Total Actif");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(35, "div", 64);
    \u0275\u0275text(36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "div", 65)(38, "div", 66)(39, "strong");
    \u0275\u0275text(40, "Calcul :");
    \u0275\u0275elementEnd();
    \u0275\u0275text(41);
    \u0275\u0275elementEnd();
    \u0275\u0275element(42, "p-tag", 44);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(43, "div", 67);
    \u0275\u0275element(44, "div", 68);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "div", 57)(46, "div", 58)(47, "div", 59)(48, "div", 60);
    \u0275\u0275element(49, "i", 72);
    \u0275\u0275elementStart(50, "div")(51, "h5", 73);
    \u0275\u0275text(52, "R3 - Ratio de liquidit\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "small", 74);
    \u0275\u0275text(54, "Cr\xE9ances + Tr\xE9sorerie / Dettes court terme");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(55, "div", 64);
    \u0275\u0275text(56);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "div", 65)(58, "div", 66)(59, "strong");
    \u0275\u0275text(60, "Calcul :");
    \u0275\u0275elementEnd();
    \u0275\u0275text(61);
    \u0275\u0275elementEnd();
    \u0275\u0275element(62, "p-tag", 44);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(63, "div", 67);
    \u0275\u0275element(64, "div", 68);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(65, "div", 57)(66, "div", 58)(67, "div", 59)(68, "div", 60);
    \u0275\u0275element(69, "i", 75);
    \u0275\u0275elementStart(70, "div")(71, "h5", 76);
    \u0275\u0275text(72, "R4 - Ratio d'endettement");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(73, "small", 77);
    \u0275\u0275text(74, "(Dettes totales + Cr\xE9dit) / (Total Actif + Cr\xE9dit)");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(75, "div", 64);
    \u0275\u0275text(76);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(77, "div", 65)(78, "div", 66)(79, "strong");
    \u0275\u0275text(80, "Calcul :");
    \u0275\u0275elementEnd();
    \u0275\u0275text(81);
    \u0275\u0275elementEnd();
    \u0275\u0275element(82, "p-tag", 44);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(83, "div", 67);
    \u0275\u0275element(84, "div", 68);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(85, "div", 57)(86, "div", 58)(87, "div", 59)(88, "div", 60);
    \u0275\u0275element(89, "i", 78);
    \u0275\u0275elementStart(90, "div")(91, "h5", 79);
    \u0275\u0275text(92, "R5 - Ratio de d\xE9pendance");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(93, "small", 80);
    \u0275\u0275text(94, "Autres revenus / Revenus totaux");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(95, "div", 64);
    \u0275\u0275text(96);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(97, "div", 65)(98, "div", 66)(99, "strong");
    \u0275\u0275text(100, "Calcul :");
    \u0275\u0275elementEnd();
    \u0275\u0275text(101);
    \u0275\u0275elementEnd();
    \u0275\u0275element(102, "p-tag", 44);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(103, "div", 67);
    \u0275\u0275element(104, "div", 68);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(105, "div", 57)(106, "div", 58)(107, "div", 59)(108, "div", 60);
    \u0275\u0275element(109, "i", 81);
    \u0275\u0275elementStart(110, "div")(111, "h5", 82);
    \u0275\u0275text(112, "R6 - Ratio de couverture de la Garantie");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(113, "small", 83);
    \u0275\u0275text(114, "Valeur de la garantie / Cr\xE9dit");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(115, "div", 64);
    \u0275\u0275text(116);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(117, "div", 65)(118, "div", 66)(119, "strong");
    \u0275\u0275text(120, "Calcul :");
    \u0275\u0275elementEnd();
    \u0275\u0275text(121);
    \u0275\u0275elementEnd();
    \u0275\u0275element(122, "p-tag", 44);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(123, "div", 12)(124, "div", 2)(125, "p-card", 84);
    \u0275\u0275template(126, ResumeCreditComponent_Conditional_17_ng_template_126_Template, 4, 0, "ng-template", 24);
    \u0275\u0275elementStart(127, "div", 85)(128, "div", 1)(129, "div", 86)(130, "div", 87)(131, "h6", 88);
    \u0275\u0275text(132, "\u2705 Seuils Acceptables");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(133, "div", 89)(134, "ul", 90)(135, "li", 91)(136, "strong", 52);
    \u0275\u0275text(137, "R1 Capacit\xE9 :");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(138, "span", 92);
    \u0275\u0275text(139, "\u2265 150%");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(140, "li", 91)(141, "strong", 52);
    \u0275\u0275text(142, "R2 Solvabilit\xE9 :");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(143, "span", 92);
    \u0275\u0275text(144, "\u2265 25%");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(145, "li", 91)(146, "strong", 52);
    \u0275\u0275text(147, "R3 Liquidit\xE9 :");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(148, "span", 92);
    \u0275\u0275text(149, "\u2265 100%");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(150, "li", 91)(151, "strong", 52);
    \u0275\u0275text(152, "R4 Endettement :");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(153, "span", 92);
    \u0275\u0275text(154, "\u2264 70%");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(155, "li", 91)(156, "strong", 52);
    \u0275\u0275text(157, "R5 D\xE9pendance :");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(158, "span", 92);
    \u0275\u0275text(159, "\u2264 50%");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(160, "li", 91)(161, "strong", 52);
    \u0275\u0275text(162, "R6 Couverture :");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(163, "span", 92);
    \u0275\u0275text(164, "\u2265 120%");
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275elementStart(165, "div", 86)(166, "div", 93)(167, "h6", 94);
    \u0275\u0275text(168, "\u{1F4CA} \xC9valuation Globale");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(169, "div", 95)(170, "div", 96)(171, "div", 97);
    \u0275\u0275text(172);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(173, "div", 98);
    \u0275\u0275text(174);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(175, "div", 99)(176, "div", 100);
    \u0275\u0275text(177, "Taux de conformit\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275element(178, "p-progressBar", 35);
    \u0275\u0275elementStart(179, "div", 101);
    \u0275\u0275text(180);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(181, "div", 102);
    \u0275\u0275element(182, "i", 103);
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(183, "div", 104)(184, "div", 105)(185, "h6", 106);
    \u0275\u0275text(186, "\u{1F3AF} R\xE9sum\xE9 de l'Analyse");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(187, "div", 107)(188, "div", 108)(189, "div", 109);
    \u0275\u0275text(190);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(191, "small", 110);
    \u0275\u0275text(192, "Seuils OK");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(193, "div", 111);
    \u0275\u0275text(194, "\u2022");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(195, "div", 108)(196, "div", 112);
    \u0275\u0275text(197);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(198, "small", 110);
    \u0275\u0275text(199, "\xC0 am\xE9liorer");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(200, "div", 111);
    \u0275\u0275text(201, "\u2022");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(202, "div", 108)(203, "div", 113);
    \u0275\u0275text(204);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(205, "small", 110);
    \u0275\u0275text(206, "Score global");
    \u0275\u0275elementEnd()()()()()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(16);
    \u0275\u0275textInterpolate1(" ", ctx_r0.calculerR1Capacite(), "% ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate3(" (", ctx_r0.formatCurrency(ctx_r0.getCashFlow() + ctx_r0.getAutresRevenus()), " + ", ctx_r0.formatCurrency(ctx_r0.getAutresRevenus()), ") / ", ctx_r0.formatCurrency(ctx_r0.getTraiteRevenus()), " ");
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r0.getStatutR1())("severity", ctx_r0.getSeveriteR1());
    \u0275\u0275advance(14);
    \u0275\u0275textInterpolate1(" ", ctx_r0.calculerR2Solvabilite(), "% ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2(" ", ctx_r0.formatCurrency(ctx_r0.getCapitauxPropres()), " / ", ctx_r0.formatCurrency(ctx_r0.getTotalActif()), " ");
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r0.getStatutR2())("severity", ctx_r0.getSeveriteR2());
    \u0275\u0275advance(14);
    \u0275\u0275textInterpolate1(" ", ctx_r0.calculerR3Liquidite(), "% ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2(" ", ctx_r0.formatCurrency(ctx_r0.getCreancesEtTresorerie()), " / ", ctx_r0.formatCurrency(ctx_r0.getDettesCourtTerme()), " ");
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r0.getStatutR3())("severity", ctx_r0.getSeveriteR3());
    \u0275\u0275advance(14);
    \u0275\u0275textInterpolate1(" ", ctx_r0.calculerR4Endettement(), "% ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2(" ", ctx_r0.formatCurrency(ctx_r0.getDettesTotalesAvecCredit()), " / ", ctx_r0.formatCurrency(ctx_r0.getTotalActifAvecCredit()), " ");
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r0.getStatutR4())("severity", ctx_r0.getSeveriteR4());
    \u0275\u0275advance(14);
    \u0275\u0275textInterpolate1(" ", ctx_r0.calculerR5Dependance(), "% ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2(" ", ctx_r0.formatCurrency(ctx_r0.getAutresRevenus()), " / ", ctx_r0.formatCurrency(ctx_r0.getRevenusTorauxPrevisionnel()), " ");
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r0.getStatutR5())("severity", ctx_r0.getSeveriteR5());
    \u0275\u0275advance(14);
    \u0275\u0275textInterpolate1(" ", ctx_r0.calculerR6Couverture(), "% ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2(" ", ctx_r0.formatCurrency(ctx_r0.getValeurGarantie()), " / ", ctx_r0.formatCurrency(ctx_r0.getMontantCredit()), " ");
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r0.getStatutR6())("severity", ctx_r0.getSeveriteR6());
    \u0275\u0275advance(49);
    \u0275\u0275classMap(ctx_r0.getCouleurEvaluationGlobale());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getEvaluationGlobale(), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.getNbSeuilsRespetes(), "/6 seuils respect\xE9s ");
    \u0275\u0275advance(4);
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(49, _c2));
    \u0275\u0275classMap("progress-" + ctx_r0.getEvaluationGlobale().toLowerCase());
    \u0275\u0275property("value", ctx_r0.getNbSeuilsRespetes() / 6 * 100);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", (ctx_r0.getNbSeuilsRespetes() / 6 * 100).toFixed(0), "% des seuils respect\xE9s ");
    \u0275\u0275advance(2);
    \u0275\u0275classMap(ctx_r0.getIconeEvaluation());
    \u0275\u0275property("ngClass", ctx_r0.getCouleurEvaluationGlobale());
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r0.getNbSeuilsRespetes());
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1("", 6 - ctx_r0.getNbSeuilsRespetes(), " ");
    \u0275\u0275advance(6);
    \u0275\u0275classMap(ctx_r0.getCouleurEvaluationGlobale());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", (ctx_r0.getNbSeuilsRespetes() / 6 * 100).toFixed(0), "% ");
  }
}
function ResumeCreditComponent_Conditional_18_Template(rf, ctx) {
}
function ResumeCreditComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "div", 117);
    \u0275\u0275element(3, "p-progressSpinner");
    \u0275\u0275elementEnd()()();
  }
}
function ResumeCreditComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "p-card")(3, "div", 118);
    \u0275\u0275element(4, "i", 119);
    \u0275\u0275elementStart(5, "h3", 77);
    \u0275\u0275text(6, "Erreur lors du chargement");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 110);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p-button", 120);
    \u0275\u0275listener("onClick", function ResumeCreditComponent_Conditional_20_Template_p_button_onClick_9_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.chargerResumeCredit());
    });
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(((tmp_1_0 = ctx_r0.state().error) == null ? null : tmp_1_0.message) || "Une erreur est survenue");
  }
}
function ResumeCreditComponent_Conditional_21_Conditional_0_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 147)(1, "p-card", 148)(2, "div", 149)(3, "div", 150);
    \u0275\u0275element(4, "i", 151);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 152)(6, "p", 153);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 154);
    \u0275\u0275element(9, "p-tag", 155);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const indicateur_r10 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275property("ngClass", "bg-" + indicateur_r10.color + "-100");
    \u0275\u0275advance();
    \u0275\u0275classMap(indicateur_r10.icon);
    \u0275\u0275property("ngClass", "text-" + indicateur_r10.color + "-600 text-xl");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(indicateur_r10.label);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", indicateur_r10.value)("severity", indicateur_r10.severity);
  }
}
function ResumeCreditComponent_Conditional_21_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12)(1, "div", 2)(2, "h3", 55);
    \u0275\u0275text(3, "Indicateurs Cl\xE9s");
    \u0275\u0275elementEnd()();
    \u0275\u0275repeaterCreate(4, ResumeCreditComponent_Conditional_21_Conditional_0_For_5_Template, 10, 7, "div", 147, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r0.getIndicateursCles());
  }
}
function ResumeCreditComponent_Conditional_21_Conditional_1_Template(rf, ctx) {
}
function ResumeCreditComponent_Conditional_21_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 156);
    \u0275\u0275element(1, "i", 157);
    \u0275\u0275elementStart(2, "h4", 49);
    \u0275\u0275text(3, "Informations du Promoteur");
    \u0275\u0275elementEnd()();
  }
}
function ResumeCreditComponent_Conditional_21_ng_template_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 158);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r11 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r11.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r11.value);
  }
}
function ResumeCreditComponent_Conditional_21_ng_template_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 156);
    \u0275\u0275element(1, "i", 159);
    \u0275\u0275elementStart(2, "h4", 49);
    \u0275\u0275text(3, "Informations de l'Entreprise");
    \u0275\u0275elementEnd()();
  }
}
function ResumeCreditComponent_Conditional_21_ng_template_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 158);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r12 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r12.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r12.value);
  }
}
function ResumeCreditComponent_Conditional_21_ng_template_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 156);
    \u0275\u0275element(1, "i", 160);
    \u0275\u0275elementStart(2, "h4", 49);
    \u0275\u0275text(3, "Personnes Caution");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "p-badge", 155);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275property("value", ctx_r0.getNombrePersonnesCaution().toString())("severity", ctx_r0.getNombrePersonnesCaution() > 0 ? "success" : "warn");
  }
}
function ResumeCreditComponent_Conditional_21_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 118);
    \u0275\u0275element(1, "i", 161);
    \u0275\u0275elementStart(2, "h5", 162);
    \u0275\u0275text(3, "Aucune personne caution");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 163);
    \u0275\u0275text(5, " Aucune garantie personnelle n'a \xE9t\xE9 renseign\xE9e pour cette demande de cr\xE9dit. ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(6, "p-tag", 164);
    \u0275\u0275elementEnd();
  }
}
function ResumeCreditComponent_Conditional_21_Conditional_19_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 151)(1, "td", 167);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 151);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r13 = ctx.$implicit;
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(5, _c4, item_r13.label.includes("Caution") && item_r13.label.includes("Nom")));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(7, _c5, item_r13.label.includes("Caution") && item_r13.label.includes("Nom")));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", item_r13.label, " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(9, _c6, item_r13.label.includes("Caution") && item_r13.label.includes("Nom")));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", item_r13.value, " ");
  }
}
function ResumeCreditComponent_Conditional_21_Conditional_19_Conditional_7_For_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 180)(1, "small", 183);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const recommandation_r14 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("\u2022 ", recommandation_r14, "");
  }
}
function ResumeCreditComponent_Conditional_21_Conditional_19_Conditional_7_For_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 182);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const personne_r15 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("\u2022 ", personne_r15, "");
  }
}
function ResumeCreditComponent_Conditional_21_Conditional_19_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 124)(1, "div", 168)(2, "h5", 165);
    \u0275\u0275element(3, "i", 169);
    \u0275\u0275text(4, " Analyse de Garantie ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 170)(6, "div", 171)(7, "div", 32)(8, "span", 172);
    \u0275\u0275text(9, "Niveau :");
    \u0275\u0275elementEnd();
    \u0275\u0275element(10, "p-tag", 44);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 32)(12, "span", 172);
    \u0275\u0275text(13, "Score :");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span", 173);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(16, "p-progressBar", 174);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 175)(18, "small", 176);
    \u0275\u0275text(19, "Description :");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "p", 177);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div", 178)(23, "small", 179);
    \u0275\u0275text(24, "Recommandations :");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(25, ResumeCreditComponent_Conditional_21_Conditional_19_Conditional_7_For_26_Template, 3, 1, "div", 180, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "div", 181)(28, "small", 176);
    \u0275\u0275text(29, "Personnes identifi\xE9es :");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(30, ResumeCreditComponent_Conditional_21_Conditional_19_Conditional_7_For_31_Template, 2, 1, "div", 182, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(10);
    \u0275\u0275property("value", ctx_r0.getAnalyseGarantiePersonnelle().niveau)("severity", ctx_r0.getAnalyseGarantiePersonnelle().niveau === "EXCELLENT" ? "success" : ctx_r0.getAnalyseGarantiePersonnelle().niveau === "BON" ? "info" : ctx_r0.getAnalyseGarantiePersonnelle().niveau === "MOYEN" ? "warn" : "danger");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r0.getAnalyseGarantiePersonnelle().score, "/100 ");
    \u0275\u0275advance();
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(8, _c1));
    \u0275\u0275property("value", ctx_r0.getAnalyseGarantiePersonnelle().score)("ngClass", "progress-" + ctx_r0.getAnalyseGarantiePersonnelle().niveau.toLowerCase());
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r0.getAnalyseGarantiePersonnelle().description, " ");
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r0.getAnalyseGarantiePersonnelle().recommendations);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r0.getPersonnesCautionCompact());
  }
}
function ResumeCreditComponent_Conditional_21_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 123)(2, "h5", 165);
    \u0275\u0275element(3, "i", 166);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p-table", 121);
    \u0275\u0275template(6, ResumeCreditComponent_Conditional_21_Conditional_19_ng_template_6_Template, 5, 11, "ng-template", 122);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(7, ResumeCreditComponent_Conditional_21_Conditional_19_Conditional_7_Template, 32, 9, "div", 124);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_5_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" D\xE9tails des Personnes Caution (", ctx_r0.getNombrePersonnesCaution(), ") ");
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r0.getPersonnesCautionData())("tableStyle", \u0275\u0275pureFunction0(4, _c3));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_5_0 = ctx_r0.state().user) == null ? null : tmp_5_0.role) === "MANAGER" || ((tmp_5_0 = ctx_r0.state().user) == null ? null : tmp_5_0.role) === "DA" ? 7 : -1);
  }
}
function ResumeCreditComponent_Conditional_21_ng_template_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 156);
    \u0275\u0275element(1, "i", 184);
    \u0275\u0275elementStart(2, "h4", 49);
    \u0275\u0275text(3, "Bilan de l'Entreprise");
    \u0275\u0275elementEnd()();
  }
}
function ResumeCreditComponent_Conditional_21_ng_template_25_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-tag", 155);
  }
  if (rf & 2) {
    const item_r16 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("value", item_r16.value)("severity", item_r16.severity);
  }
}
function ResumeCreditComponent_Conditional_21_ng_template_25_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const item_r16 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" ", item_r16.value, " ");
  }
}
function ResumeCreditComponent_Conditional_21_ng_template_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 151)(1, "td", 158);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275template(4, ResumeCreditComponent_Conditional_21_ng_template_25_Conditional_4_Template, 1, 2, "p-tag", 155)(5, ResumeCreditComponent_Conditional_21_ng_template_25_Conditional_5_Template, 1, 1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r16 = ctx.$implicit;
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(3, _c7, item_r16.isTotal));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r16.label);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(item_r16.isRatio ? 4 : 5);
  }
}
function ResumeCreditComponent_Conditional_21_ng_template_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 156);
    \u0275\u0275element(1, "i", 185);
    \u0275\u0275elementStart(2, "h4", 49);
    \u0275\u0275text(3, "Patrimoine Personnel");
    \u0275\u0275elementEnd()();
  }
}
function ResumeCreditComponent_Conditional_21_ng_template_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 151)(1, "td", 158);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r17 = ctx.$implicit;
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(3, _c7, item_r17.isTotal));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r17.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r17.value);
  }
}
function ResumeCreditComponent_Conditional_21_ng_template_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 156);
    \u0275\u0275element(1, "i", 186);
    \u0275\u0275elementStart(2, "h4", 49);
    \u0275\u0275text(3, "Exploitation Actuelle");
    \u0275\u0275elementEnd()();
  }
}
function ResumeCreditComponent_Conditional_21_ng_template_36_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-tag", 155);
  }
  if (rf & 2) {
    const item_r18 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("value", item_r18.value)("severity", item_r18.severity);
  }
}
function ResumeCreditComponent_Conditional_21_ng_template_36_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const item_r18 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" ", item_r18.value, " ");
  }
}
function ResumeCreditComponent_Conditional_21_ng_template_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 151)(1, "td", 158);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275template(4, ResumeCreditComponent_Conditional_21_ng_template_36_Conditional_4_Template, 1, 2, "p-tag", 155)(5, ResumeCreditComponent_Conditional_21_ng_template_36_Conditional_5_Template, 1, 1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r18 = ctx.$implicit;
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(3, _c7, item_r18.isTotal));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r18.label);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(item_r18.isRatio ? 4 : 5);
  }
}
function ResumeCreditComponent_Conditional_21_ng_template_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 151)(1, "td", 158);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r19 = ctx.$implicit;
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(3, _c8, item_r19.isTotal));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r19.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r19.value);
  }
}
function ResumeCreditComponent_Conditional_21_ng_template_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 156);
    \u0275\u0275element(1, "i", 187);
    \u0275\u0275elementStart(2, "h4", 49);
    \u0275\u0275text(3, "Exploitation Pr\xE9visionnelle");
    \u0275\u0275elementEnd()();
  }
}
function ResumeCreditComponent_Conditional_21_ng_template_47_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-tag", 155);
  }
  if (rf & 2) {
    const item_r20 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("value", item_r20.value)("severity", item_r20.severity);
  }
}
function ResumeCreditComponent_Conditional_21_ng_template_47_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const item_r20 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" ", item_r20.value, " ");
  }
}
function ResumeCreditComponent_Conditional_21_ng_template_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 151)(1, "td", 158);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275template(4, ResumeCreditComponent_Conditional_21_ng_template_47_Conditional_4_Template, 1, 2, "p-tag", 155)(5, ResumeCreditComponent_Conditional_21_ng_template_47_Conditional_5_Template, 1, 1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r20 = ctx.$implicit;
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(3, _c7, item_r20.isTotal));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r20.label);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(item_r20.isRatio ? 4 : 5);
  }
}
function ResumeCreditComponent_Conditional_21_ng_template_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 151)(1, "td", 158);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r21 = ctx.$implicit;
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(3, _c8, item_r21.isTotal));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r21.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r21.value);
  }
}
function ResumeCreditComponent_Conditional_21_ng_template_56_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-progressSpinner", 190);
  }
  if (rf & 2) {
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(2, _c9));
  }
}
function ResumeCreditComponent_Conditional_21_ng_template_56_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 156);
    \u0275\u0275element(1, "i", 188);
    \u0275\u0275elementStart(2, "h4", 49);
    \u0275\u0275text(3, "D\xE9tails de la Demande de Cr\xE9dit");
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, ResumeCreditComponent_Conditional_21_ng_template_56_Conditional_4_Template, 1, 3, "p-progressSpinner", 189);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r0.isLoadingInfoAdmin() ? 4 : -1);
  }
}
function ResumeCreditComponent_Conditional_21_ng_template_63_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-tag", 155);
  }
  if (rf & 2) {
    const item_r22 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("value", item_r22.value)("severity", item_r22.severity);
  }
}
function ResumeCreditComponent_Conditional_21_ng_template_63_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-tag", 155);
  }
  if (rf & 2) {
    const item_r22 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("value", item_r22.value)("severity", ctx_r0.getStatutSeverity(item_r22.value));
  }
}
function ResumeCreditComponent_Conditional_21_ng_template_63_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const item_r22 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" ", item_r22.value, " ");
  }
}
function ResumeCreditComponent_Conditional_21_ng_template_63_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 158);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275template(4, ResumeCreditComponent_Conditional_21_ng_template_63_Conditional_4_Template, 1, 2, "p-tag", 155)(5, ResumeCreditComponent_Conditional_21_ng_template_63_Conditional_5_Template, 1, 2, "p-tag", 155)(6, ResumeCreditComponent_Conditional_21_ng_template_63_Conditional_6_Template, 1, 1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r22 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r22.label);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(item_r22.isRatio ? 4 : item_r22.isStatus ? 5 : 6);
  }
}
function ResumeCreditComponent_Conditional_21_Conditional_68_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 129);
  }
}
function ResumeCreditComponent_Conditional_21_Conditional_69_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 130);
  }
}
function ResumeCreditComponent_Conditional_21_Conditional_70_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 131);
  }
}
function ResumeCreditComponent_Conditional_21_Conditional_71_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 132);
    \u0275\u0275element(1, "p-progressSpinner", 190);
    \u0275\u0275elementStart(2, "p", 191);
    \u0275\u0275text(3, "Chargement des informations d\xE9taill\xE9es...");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(2, _c10));
  }
}
function ResumeCreditComponent_Conditional_21_Conditional_72_ng_template_1_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 193);
  }
}
function ResumeCreditComponent_Conditional_21_Conditional_72_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 151)(1, "td", 158);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 192);
    \u0275\u0275text(4);
    \u0275\u0275template(5, ResumeCreditComponent_Conditional_21_Conditional_72_ng_template_1_Conditional_5_Template, 1, 0, "i", 193);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r23 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(4, _c11, ctx_r0.hasInfoAdministrative()));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r23.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", item_r23.value, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.hasInfoAdministrative() && !item_r23.value.startsWith("ID:") ? 5 : -1);
  }
}
function ResumeCreditComponent_Conditional_21_Conditional_72_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-table", 121);
    \u0275\u0275template(1, ResumeCreditComponent_Conditional_21_Conditional_72_ng_template_1_Template, 6, 6, "ng-template", 122);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("value", ctx_r0.getDemandeCreditInfosComplementaires())("tableStyle", \u0275\u0275pureFunction0(2, _c3));
  }
}
function ResumeCreditComponent_Conditional_21_Conditional_73_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 133)(1, "small", 194);
    \u0275\u0275text(2, "Hi\xE9rarchie :");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 195);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.getResumeAdministratif());
  }
}
function ResumeCreditComponent_Conditional_21_Conditional_100_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2)(1, "small", 196);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" (Inclut bonus ", ctx_r0.getNombrePersonnesCaution(), " personne(s) caution: +", (ctx_r0.getNombrePersonnesCaution() * 10).toFixed(0), "%) ");
  }
}
function ResumeCreditComponent_Conditional_21_div_102_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 156);
    \u0275\u0275element(1, "i", 206);
    \u0275\u0275elementStart(2, "h4", 49);
    \u0275\u0275text(3, "Section Debug - ACTIV\xC9E");
    \u0275\u0275elementEnd()();
  }
}
function ResumeCreditComponent_Conditional_21_div_102_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p")(1, "strong");
    \u0275\u0275text(2, "IDs demande:");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(3, "small");
    \u0275\u0275text(4);
    \u0275\u0275element(5, "br");
    \u0275\u0275text(6);
    \u0275\u0275element(7, "br");
    \u0275\u0275text(8);
    \u0275\u0275element(9, "br");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    let tmp_6_0;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" - D\xE9l\xE9gation: ", (tmp_3_0 = ctx_r0.state().resumeCredit) == null ? null : tmp_3_0.demande_credit == null ? null : tmp_3_0.demande_credit.delegation_id, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" - Agence: ", (tmp_4_0 = ctx_r0.state().resumeCredit) == null ? null : tmp_4_0.demande_credit == null ? null : tmp_4_0.demande_credit.agence_id, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" - Point vente: ", (tmp_5_0 = ctx_r0.state().resumeCredit) == null ? null : tmp_5_0.demande_credit == null ? null : tmp_5_0.demande_credit.point_vente_id, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" - User: ", (tmp_6_0 = ctx_r0.state().resumeCredit) == null ? null : tmp_6_0.demande_credit == null ? null : tmp_6_0.demande_credit.user_id, " ");
  }
}
function ResumeCreditComponent_Conditional_21_div_102_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 204)(1, "h6", 207);
    \u0275\u0275text(2, "\u2705 Donn\xE9es Administratives Charg\xE9es");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 202)(4, "div", 208)(5, "strong");
    \u0275\u0275text(6, "D\xE9l\xE9gation:");
    \u0275\u0275elementEnd();
    \u0275\u0275element(7, "br");
    \u0275\u0275text(8);
    \u0275\u0275element(9, "br");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 208)(12, "strong");
    \u0275\u0275text(13, "Agence:");
    \u0275\u0275elementEnd();
    \u0275\u0275element(14, "br");
    \u0275\u0275text(15);
    \u0275\u0275element(16, "br");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "div", 208)(19, "strong");
    \u0275\u0275text(20, "Point de vente:");
    \u0275\u0275elementEnd();
    \u0275\u0275element(21, "br");
    \u0275\u0275text(22);
    \u0275\u0275element(23, "br");
    \u0275\u0275text(24);
    \u0275\u0275element(25, "br");
    \u0275\u0275text(26);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "div", 208)(28, "strong");
    \u0275\u0275text(29, "Utilisateur:");
    \u0275\u0275elementEnd();
    \u0275\u0275element(30, "br");
    \u0275\u0275text(31);
    \u0275\u0275element(32, "br");
    \u0275\u0275text(33);
    \u0275\u0275element(34, "br");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    let tmp_6_0;
    let tmp_7_0;
    let tmp_8_0;
    let tmp_9_0;
    let tmp_10_0;
    let tmp_11_0;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1(" ID: ", (tmp_3_0 = ctx_r0.state().infoAdministrative) == null ? null : tmp_3_0.delegationDto == null ? null : tmp_3_0.delegationDto.id, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Libell\xE9: ", (tmp_4_0 = ctx_r0.state().infoAdministrative) == null ? null : tmp_4_0.delegationDto == null ? null : tmp_4_0.delegationDto.libele, " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ID: ", (tmp_5_0 = ctx_r0.state().infoAdministrative) == null ? null : tmp_5_0.agenceDto == null ? null : tmp_5_0.agenceDto.id, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Libell\xE9: ", (tmp_6_0 = ctx_r0.state().infoAdministrative) == null ? null : tmp_6_0.agenceDto == null ? null : tmp_6_0.agenceDto.libele, " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ID: ", (tmp_7_0 = ctx_r0.state().infoAdministrative) == null ? null : tmp_7_0.pointVenteDto == null ? null : tmp_7_0.pointVenteDto.id, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Libell\xE9: ", (tmp_8_0 = ctx_r0.state().infoAdministrative) == null ? null : tmp_8_0.pointVenteDto == null ? null : tmp_8_0.pointVenteDto.libele, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Code: ", (tmp_9_0 = ctx_r0.state().infoAdministrative) == null ? null : tmp_9_0.pointVenteDto == null ? null : tmp_9_0.pointVenteDto.code, " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ID: ", (tmp_10_0 = ctx_r0.state().infoAdministrative) == null ? null : tmp_10_0.user == null ? null : tmp_10_0.user.userId, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" Nom: ", (tmp_11_0 = ctx_r0.state().infoAdministrative) == null ? null : tmp_11_0.user == null ? null : tmp_11_0.user.firstName, " ", (tmp_11_0 = ctx_r0.state().infoAdministrative) == null ? null : tmp_11_0.user == null ? null : tmp_11_0.user.lastName, "");
  }
}
function ResumeCreditComponent_Conditional_21_div_102_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 205)(1, "h6", 209);
    \u0275\u0275text(2, "\u26A0\uFE0F Aucune Donn\xE9e Administrative");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 210);
    \u0275\u0275text(4, ` Les informations administratives n'ont pas \xE9t\xE9 charg\xE9es ou ne sont pas disponibles. Cliquez sur "Debug Complet" pour analyser le probl\xE8me. `);
    \u0275\u0275elementEnd()();
  }
}
function ResumeCreditComponent_Conditional_21_div_102_Template(rf, ctx) {
  if (rf & 1) {
    const _r24 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 12)(1, "div", 2)(2, "p-card");
    \u0275\u0275template(3, ResumeCreditComponent_Conditional_21_div_102_ng_template_3_Template, 4, 0, "ng-template", 24);
    \u0275\u0275elementStart(4, "div", 197)(5, "p-button", 198);
    \u0275\u0275listener("onClick", function ResumeCreditComponent_Conditional_21_div_102_Template_p_button_onClick_5_listener() {
      \u0275\u0275restoreView(_r24);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.testerInfoAdministrative());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p-button", 199);
    \u0275\u0275listener("onClick", function ResumeCreditComponent_Conditional_21_div_102_Template_p_button_onClick_6_listener() {
      \u0275\u0275restoreView(_r24);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.chargerInfoAdministrative());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 200)(8, "h6", 201);
    \u0275\u0275text(9, "\u{1F4CA} \xC9tat Actuel en Temps R\xE9el");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 202)(11, "div", 203)(12, "p")(13, "strong");
    \u0275\u0275text(14, "Resume cr\xE9dit charg\xE9:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "span");
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "p")(18, "strong");
    \u0275\u0275text(19, "Loading principal:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "p")(22, "strong");
    \u0275\u0275text(23, "Loading admin:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(24);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "div", 203)(26, "p")(27, "strong");
    \u0275\u0275text(28, "Info admin disponible:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "span");
    \u0275\u0275text(30);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "p")(32, "strong");
    \u0275\u0275text(33, "Nb personnes caution:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "p")(36, "strong");
    \u0275\u0275text(37, "R\xE9sum\xE9 admin:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(38);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(39, "div", 203);
    \u0275\u0275template(40, ResumeCreditComponent_Conditional_21_div_102_Conditional_40_Template, 11, 4);
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(41, ResumeCreditComponent_Conditional_21_div_102_Conditional_41_Template, 35, 10, "div", 204)(42, ResumeCreditComponent_Conditional_21_div_102_Conditional_42_Template, 5, 0, "div", 205);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_11_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(6);
    \u0275\u0275property("disabled", ctx_r0.isLoadingInfoAdmin());
    \u0275\u0275advance(9);
    \u0275\u0275classMap(ctx_r0.state().resumeCredit ? "text-green-600" : "text-red-600");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.state().resumeCredit ? "OUI" : "NON", " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r0.state().loading ? "OUI" : "NON", "");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r0.state().loadingAdmin ? "OUI" : "NON", "");
    \u0275\u0275advance(5);
    \u0275\u0275classMap(ctx_r0.hasInfoAdministrative() ? "text-green-600" : "text-red-600");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.hasInfoAdministrative() ? "OUI" : "NON", " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r0.getNombrePersonnesCaution(), "");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r0.getResumeAdministratif(), "");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_11_0 = ctx_r0.state().resumeCredit) == null ? null : tmp_11_0.demande_credit) ? 40 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.hasInfoAdministrative() ? 41 : 42);
  }
}
function ResumeCreditComponent_Conditional_21_Conditional_107_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 145)(1, "p-button", 211);
    \u0275\u0275listener("onClick", function ResumeCreditComponent_Conditional_21_Conditional_107_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r25);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.previsualiserImpression());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p-button", 212);
    \u0275\u0275listener("onClick", function ResumeCreditComponent_Conditional_21_Conditional_107_Template_p_button_onClick_2_listener() {
      \u0275\u0275restoreView(_r25);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.imprimerBilan());
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(2, _c0));
  }
}
function ResumeCreditComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275template(0, ResumeCreditComponent_Conditional_21_Conditional_0_Template, 6, 0, "div", 12)(1, ResumeCreditComponent_Conditional_21_Conditional_1_Template, 0, 0);
    \u0275\u0275elementStart(2, "div", 12)(3, "div", 86)(4, "p-card");
    \u0275\u0275template(5, ResumeCreditComponent_Conditional_21_ng_template_5_Template, 4, 0, "ng-template", 24);
    \u0275\u0275elementStart(6, "p-table", 121);
    \u0275\u0275template(7, ResumeCreditComponent_Conditional_21_ng_template_7_Template, 5, 2, "ng-template", 122);
    \u0275\u0275elementEnd()()();
    \u0275\u0275element(8, "p-divider");
    \u0275\u0275elementStart(9, "div", 86)(10, "p-card");
    \u0275\u0275template(11, ResumeCreditComponent_Conditional_21_ng_template_11_Template, 4, 0, "ng-template", 24);
    \u0275\u0275elementStart(12, "p-table", 121);
    \u0275\u0275template(13, ResumeCreditComponent_Conditional_21_ng_template_13_Template, 5, 2, "ng-template", 122);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(14, "div", 12)(15, "div", 2)(16, "p-card");
    \u0275\u0275template(17, ResumeCreditComponent_Conditional_21_ng_template_17_Template, 5, 2, "ng-template", 24)(18, ResumeCreditComponent_Conditional_21_Conditional_18_Template, 7, 0, "div", 118)(19, ResumeCreditComponent_Conditional_21_Conditional_19_Template, 8, 5, "div", 1);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "div", 12)(21, "div", 123)(22, "p-card");
    \u0275\u0275template(23, ResumeCreditComponent_Conditional_21_ng_template_23_Template, 4, 0, "ng-template", 24);
    \u0275\u0275elementStart(24, "p-table", 121);
    \u0275\u0275template(25, ResumeCreditComponent_Conditional_21_ng_template_25_Template, 6, 5, "ng-template", 122);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(26, "div", 124)(27, "p-card");
    \u0275\u0275template(28, ResumeCreditComponent_Conditional_21_ng_template_28_Template, 4, 0, "ng-template", 24);
    \u0275\u0275elementStart(29, "p-table", 121);
    \u0275\u0275template(30, ResumeCreditComponent_Conditional_21_ng_template_30_Template, 5, 5, "ng-template", 122);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(31, "div", 12)(32, "div", 86)(33, "p-card");
    \u0275\u0275template(34, ResumeCreditComponent_Conditional_21_ng_template_34_Template, 4, 0, "ng-template", 24);
    \u0275\u0275elementStart(35, "p-table", 121);
    \u0275\u0275template(36, ResumeCreditComponent_Conditional_21_ng_template_36_Template, 6, 5, "ng-template", 122);
    \u0275\u0275elementEnd();
    \u0275\u0275element(37, "p-divider");
    \u0275\u0275elementStart(38, "h5", 125);
    \u0275\u0275text(39, "D\xE9tail des Charges");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "p-table", 121);
    \u0275\u0275template(41, ResumeCreditComponent_Conditional_21_ng_template_41_Template, 5, 5, "ng-template", 122);
    \u0275\u0275elementEnd()()();
    \u0275\u0275element(42, "p-divider");
    \u0275\u0275elementStart(43, "div", 86)(44, "p-card");
    \u0275\u0275template(45, ResumeCreditComponent_Conditional_21_ng_template_45_Template, 4, 0, "ng-template", 24);
    \u0275\u0275elementStart(46, "p-table", 121);
    \u0275\u0275template(47, ResumeCreditComponent_Conditional_21_ng_template_47_Template, 6, 5, "ng-template", 122);
    \u0275\u0275elementEnd();
    \u0275\u0275element(48, "p-divider");
    \u0275\u0275elementStart(49, "h5", 125);
    \u0275\u0275text(50, "D\xE9tail des Charges");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(51, "p-table", 121);
    \u0275\u0275template(52, ResumeCreditComponent_Conditional_21_ng_template_52_Template, 5, 5, "ng-template", 122);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(53, "div", 12)(54, "div", 2)(55, "p-card");
    \u0275\u0275template(56, ResumeCreditComponent_Conditional_21_ng_template_56_Template, 5, 1, "ng-template", 24);
    \u0275\u0275elementStart(57, "div", 1)(58, "div", 86)(59, "h5", 126);
    \u0275\u0275element(60, "i", 127);
    \u0275\u0275text(61, " Informations Principales ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(62, "p-table", 121);
    \u0275\u0275template(63, ResumeCreditComponent_Conditional_21_ng_template_63_Template, 7, 2, "ng-template", 122);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(64, "div", 86)(65, "h5", 26);
    \u0275\u0275element(66, "i", 128);
    \u0275\u0275text(67, " Informations Administratives ");
    \u0275\u0275template(68, ResumeCreditComponent_Conditional_21_Conditional_68_Template, 1, 0, "i", 129)(69, ResumeCreditComponent_Conditional_21_Conditional_69_Template, 1, 0, "i", 130)(70, ResumeCreditComponent_Conditional_21_Conditional_70_Template, 1, 0, "i", 131);
    \u0275\u0275elementEnd();
    \u0275\u0275template(71, ResumeCreditComponent_Conditional_21_Conditional_71_Template, 4, 3, "div", 132)(72, ResumeCreditComponent_Conditional_21_Conditional_72_Template, 2, 3, "p-table", 121)(73, ResumeCreditComponent_Conditional_21_Conditional_73_Template, 5, 1, "div", 133);
    \u0275\u0275elementStart(74, "div", 134)(75, "h6", 40);
    \u0275\u0275element(76, "i", 135);
    \u0275\u0275text(77, " R\xE9sum\xE9 Financier ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(78, "div", 136)(79, "div", 137)(80, "div", 138)(81, "span", 139);
    \u0275\u0275text(82, "Total Actif:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(83, "span", 140);
    \u0275\u0275text(84);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(85, "div", 138)(86, "span", 139);
    \u0275\u0275text(87, "Total Passif:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(88, "span", 140);
    \u0275\u0275text(89);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(90, "div", 138)(91, "span", 139);
    \u0275\u0275text(92, "Patrimoine Personnel:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(93, "span", 140);
    \u0275\u0275text(94);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(95, "div", 141)(96, "span", 139);
    \u0275\u0275text(97, "Garantie Totale:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(98, "span", 142);
    \u0275\u0275text(99);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(100, ResumeCreditComponent_Conditional_21_Conditional_100_Template, 3, 2, "div", 2);
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275element(101, "p-divider");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(102, ResumeCreditComponent_Conditional_21_div_102_Template, 43, 13, "div", 143);
    \u0275\u0275elementStart(103, "div", 1)(104, "div", 2)(105, "div", 144)(106, "p-button", 10);
    \u0275\u0275listener("onClick", function ResumeCreditComponent_Conditional_21_Template_p_button_onClick_106_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.retourListe());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(107, ResumeCreditComponent_Conditional_21_Conditional_107_Template, 3, 3, "div", 145);
    \u0275\u0275element(108, "div", 146);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(((tmp_1_0 = ctx_r0.state().user) == null ? null : tmp_1_0.role) === "MANAGER" ? 0 : 1);
    \u0275\u0275advance(6);
    \u0275\u0275property("value", ctx_r0.getPromoteurData())("tableStyle", \u0275\u0275pureFunction0(31, _c3));
    \u0275\u0275advance(6);
    \u0275\u0275property("value", ctx_r0.getEntrepriseData())("tableStyle", \u0275\u0275pureFunction0(32, _c3));
    \u0275\u0275advance(6);
    \u0275\u0275conditional(!ctx_r0.hasPersonnesCaution() ? 18 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.hasPersonnesCaution() ? 19 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275property("value", ctx_r0.getBilanEntrepriseData())("tableStyle", \u0275\u0275pureFunction0(33, _c3));
    \u0275\u0275advance(5);
    \u0275\u0275property("value", ctx_r0.getBilanPersonnelData())("tableStyle", \u0275\u0275pureFunction0(34, _c3));
    \u0275\u0275advance(6);
    \u0275\u0275property("value", ctx_r0.getExploitationActuelleData())("tableStyle", \u0275\u0275pureFunction0(35, _c3));
    \u0275\u0275advance(5);
    \u0275\u0275property("value", ctx_r0.getChargesData("actuelle"))("tableStyle", \u0275\u0275pureFunction0(36, _c3));
    \u0275\u0275advance(6);
    \u0275\u0275property("value", ctx_r0.getExploitationPrevisionnelleData())("tableStyle", \u0275\u0275pureFunction0(37, _c3));
    \u0275\u0275advance(5);
    \u0275\u0275property("value", ctx_r0.getChargesData("previsionnelle"))("tableStyle", \u0275\u0275pureFunction0(38, _c3));
    \u0275\u0275advance(11);
    \u0275\u0275property("value", ctx_r0.getDemandeCreditData().slice(0, 7))("tableStyle", \u0275\u0275pureFunction0(39, _c3));
    \u0275\u0275advance(6);
    \u0275\u0275conditional(ctx_r0.hasInfoAdministrative() ? 68 : ctx_r0.isLoadingInfoAdmin() ? 69 : 70);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r0.isLoadingInfoAdmin() ? 71 : 72);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.hasInfoAdministrative() ? 73 : -1);
    \u0275\u0275advance(11);
    \u0275\u0275textInterpolate(ctx_r0.formatCurrency(ctx_r0.calculerTotalActif()));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.formatCurrency(ctx_r0.calculerTotalPassif()));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.formatCurrency(ctx_r0.calculerPatrimoinePersonnel()));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.formatCurrency(ctx_r0.getValeurGarantie()));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.getNombrePersonnesCaution() > 0 ? 100 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", false);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r0.peutImprimer() ? 107 : -1);
  }
}
function ResumeCreditComponent_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r26 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "p-card")(3, "div", 213);
    \u0275\u0275element(4, "i", 214);
    \u0275\u0275elementStart(5, "h3", 110);
    \u0275\u0275text(6, "Aucune donn\xE9e disponible");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 215);
    \u0275\u0275text(8, "Le r\xE9sum\xE9 de cr\xE9dit n'est pas encore disponible.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p-button", 10);
    \u0275\u0275listener("onClick", function ResumeCreditComponent_Conditional_22_Template_p_button_onClick_9_listener() {
      \u0275\u0275restoreView(_r26);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.retourListe());
    });
    \u0275\u0275elementEnd()()()()();
  }
}
var ResumeCreditComponent = class _ResumeCreditComponent {
  state = signal({
    loading: false,
    message: void 0,
    loadingAdmin: false,
    error: void 0,
    searching: false
  });
  // Injection des services
  router = inject(Router);
  route = inject(ActivatedRoute);
  messageService = inject(MessageService);
  destroyRef = inject(DestroyRef);
  analyseCreditService = inject(UserService);
  printService = inject(PrintService);
  resumePrintService = inject(ResumeCreditPrintService);
  // Paramètres de route
  userId = null;
  demandeId = null;
  ngOnInit() {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.userId = +params["userId"];
      this.demandeId = +params["demandeId"];
      console.log("\u{1F50D} Param\xE8tres r\xE9cup\xE9r\xE9s - UserId:", this.userId, "DemandeId:", this.demandeId);
      if (this.demandeId && this.userId) {
        this.chargerResumeCredit();
      } else {
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Param\xE8tres de navigation manquants"
        });
      }
    });
  }
  // ========================================
  // MÉTHODES DE CHARGEMENT DES DONNÉES
  // ========================================
  chargerResumeCredit() {
    if (!this.demandeId)
      return;
    this.state.update((current) => __spreadProps(__spreadValues({}, current), {
      loading: true,
      error: void 0
    }));
    console.log("\u{1F680} Chargement du r\xE9sum\xE9 pour la demande:", this.demandeId);
    this.analyseCreditService.obtenirResumeCredit$(this.demandeId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        console.log("\u2705 R\xE9ponse re\xE7ue:", response);
        if (response.data?.resumeCredit) {
          this.state.update((current) => __spreadProps(__spreadValues({}, current), {
            resumeCredit: response.data.resumeCredit,
            user: response.data.user,
            loading: false,
            message: "R\xE9sum\xE9 charg\xE9 avec succ\xE8s"
          }));
          this.chargerInfoAdministrative();
          this.messageService.add({
            severity: "success",
            summary: "Succ\xE8s",
            detail: "R\xE9sum\xE9 de cr\xE9dit charg\xE9 avec succ\xE8s"
          });
        } else {
          this.gererErreur("Aucune donn\xE9e de r\xE9sum\xE9 trouv\xE9e");
        }
      },
      error: (error) => {
        this.gererErreur("Erreur lors du chargement du r\xE9sum\xE9", error);
      }
    });
  }
  // MÉTHODE CORRIGÉE : Charger les informations administratives
  chargerInfoAdministrative() {
    const demande = this.state().resumeCredit?.demande_credit;
    if (!demande || demande.delegation_id == null || demande.agence_id == null || demande.point_vente_id == null || demande.user_id == null) {
      console.warn("\u26A0\uFE0F Informations administratives incompl\xE8tes dans la demande");
      console.log("\u{1F50D} D\xE9tails des IDs:", {
        delegation_id: demande?.delegation_id,
        agence_id: demande?.agence_id,
        point_vente_id: demande?.point_vente_id,
        user_id: demande?.user_id
      });
      return;
    }
    this.state.update((current) => __spreadProps(__spreadValues({}, current), {
      loadingAdmin: true
    }));
    console.log("\u{1F3E2} Chargement des informations administratives...");
    console.log("\u{1F4CB} IDs utilis\xE9s:", {
      delegation_id: demande.delegation_id,
      agence_id: demande.agence_id,
      point_vente_id: demande.point_vente_id,
      user_id: demande.user_id
    });
    this.analyseCreditService.getInfoAdministrative$(demande.delegation_id, demande.agence_id, demande.point_vente_id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        console.log("\u2705 Informations administratives re\xE7ues:", response);
        if (response.data?.infoAdministrative) {
          this.state.update((current) => __spreadProps(__spreadValues({}, current), {
            infoAdministrative: response.data.infoAdministrative,
            loadingAdmin: false
          }));
          console.log("\u{1F4CB} Infos admin charg\xE9es:", response.data.infoAdministrative);
          this.messageService.add({
            severity: "success",
            summary: "Succ\xE8s",
            detail: "Informations administratives charg\xE9es"
          });
        } else {
          console.warn("\u26A0\uFE0F Aucune donn\xE9e administrative trouv\xE9e");
          this.state.update((current) => __spreadProps(__spreadValues({}, current), {
            loadingAdmin: false
          }));
          this.messageService.add({
            severity: "warn",
            summary: "Attention",
            detail: "Structure de donn\xE9es administrative non trouv\xE9e"
          });
        }
      },
      error: (error) => {
        console.error("\u274C Erreur lors du chargement des infos admin:", error);
        this.state.update((current) => __spreadProps(__spreadValues({}, current), {
          loadingAdmin: false
        }));
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: `Impossible de charger les d\xE9tails administratifs: ${error.message || "Erreur inconnue"}`
        });
      }
    });
  }
  gererErreur(message, error) {
    this.state.update((current) => __spreadProps(__spreadValues({}, current), {
      loading: false,
      error
    }));
    this.messageService.add({
      severity: "error",
      summary: "Erreur",
      detail: message
    });
    console.error("\u274C Erreur:", error);
  }
  // ========================================
  // MÉTHODES DE CALCUL AVEC AUTRES REVENUS
  // ========================================
  calculerTotalActif() {
    const bilan = this.state().resumeCredit?.bilan_entreprise;
    if (!bilan)
      return 0;
    const liquidites = bilan.liquidites || 0;
    const creancesClients = bilan.creances_clients || 0;
    const valeurStocks = bilan.valeur_stocks || 0;
    const valeurEquipements = bilan.valeur_equipements || 0;
    return liquidites + creancesClients + valeurStocks + valeurEquipements;
  }
  calculerTotalPassif() {
    const bilan = this.state().resumeCredit?.bilan_entreprise;
    if (!bilan)
      return 0;
    const dettesFournisseurs = bilan.dettes_fournisseurs || 0;
    const emprunts = bilan.emprunts || 0;
    const capitalPropre = bilan.capital_propre || 0;
    return dettesFournisseurs + emprunts + capitalPropre;
  }
  calculerRatioLiquidite() {
    const bilan = this.state().resumeCredit?.bilan_entreprise;
    if (!bilan)
      return 0;
    const liquidites = bilan.liquidites || 0;
    const creancesClients = bilan.creances_clients || 0;
    const dettesFournisseurs = bilan.dettes_fournisseurs || 0;
    const emprunts = bilan.emprunts || 0;
    const totalDettes = dettesFournisseurs + emprunts;
    return totalDettes > 0 ? (liquidites + creancesClients) / totalDettes : 0;
  }
  // NOUVELLES MÉTHODES POUR LES REVENUS TOTAUX
  calculerRevenusTotauxActuel() {
    const exploitation = this.state().resumeCredit?.exploitation_actuelle;
    if (!exploitation)
      return 0;
    const chiffreAffaires = exploitation.chiffre_affaires || 0;
    const autresRevenus = exploitation.autres_revenus || 0;
    return chiffreAffaires + autresRevenus;
  }
  calculerRevenusTotauxPrevisionnel() {
    const exploitation = this.state().resumeCredit?.exploitation_previsionnelle;
    if (!exploitation)
      return 0;
    const chiffreAffaires = exploitation.chiffre_affaires || 0;
    const autresRevenus = exploitation.autres_revenus || 0;
    return chiffreAffaires + autresRevenus;
  }
  // NOUVELLES MÉTHODES POUR LES RATIOS DE DÉPENDANCE
  calculerRatioDependanceActuel() {
    const exploitation = this.state().resumeCredit?.exploitation_actuelle;
    if (!exploitation)
      return 0;
    const revenus = this.calculerRevenusTotauxActuel();
    const autresRevenus = exploitation.autres_revenus || 0;
    return revenus > 0 ? autresRevenus / revenus : 0;
  }
  calculerRatioDependancePrevisionnel() {
    const exploitation = this.state().resumeCredit?.exploitation_previsionnelle;
    if (!exploitation)
      return 0;
    const revenus = this.calculerRevenusTotauxPrevisionnel();
    const autresRevenus = exploitation.autres_revenus || 0;
    return revenus > 0 ? autresRevenus / revenus : 0;
  }
  // MÉTHODES DE MARGE BRUTE MODIFIÉES POUR UTILISER REVENUS TOTAUX
  calculerMargeButeActuelle() {
    const exploitation = this.state().resumeCredit?.exploitation_actuelle;
    if (!exploitation)
      return 0;
    const revenus = this.calculerRevenusTotauxActuel();
    const coutMarchandises = exploitation.cout_marchandises || 0;
    return revenus > 0 ? (revenus - coutMarchandises) / revenus : 0;
  }
  calculerMargeButePrevisionnelle() {
    const exploitation = this.state().resumeCredit?.exploitation_previsionnelle;
    if (!exploitation)
      return 0;
    const revenus = this.calculerRevenusTotauxPrevisionnel();
    const coutMarchandises = exploitation.cout_marchandises || 0;
    return revenus > 0 ? (revenus - coutMarchandises) / revenus : 0;
  }
  calculerTotalChargesActuelles() {
    const exploitation = this.state().resumeCredit?.exploitation_actuelle;
    if (!exploitation)
      return 0;
    const coutTransportProduction = exploitation.cout_transport_production || 0;
    const fraisTransportPersonnel = exploitation.frais_transport_personnel || 0;
    const fraisManutention = exploitation.frais_manutention || 0;
    const montantAideExterne = exploitation.montant_aide_externe || 0;
    const fraisHebergementRestauration = exploitation.frais_hebergement_restauration || 0;
    const impots = exploitation.impots || 0;
    const loyers = exploitation.loyers || 0;
    return coutTransportProduction + fraisTransportPersonnel + fraisManutention + montantAideExterne + fraisHebergementRestauration + impots + loyers;
  }
  calculerTotalChargesPrevisionnelles() {
    const exploitation = this.state().resumeCredit?.exploitation_previsionnelle;
    if (!exploitation)
      return 0;
    const coutTransportProduction = exploitation.cout_transport_production || 0;
    const fraisTransportPersonnel = exploitation.frais_transport_personnel || 0;
    const fraisManutention = exploitation.frais_manutention || 0;
    const montantAideExterne = exploitation.montant_aide_externe || 0;
    const fraisHebergementRestauration = exploitation.frais_hebergement_restauration || 0;
    const impots = exploitation.impots || 0;
    const loyers = exploitation.loyers || 0;
    return coutTransportProduction + fraisTransportPersonnel + fraisManutention + montantAideExterne + fraisHebergementRestauration + impots + loyers;
  }
  calculerPatrimoinePersonnel() {
    const bilan = this.state().resumeCredit?.bilan_personnel;
    if (!bilan)
      return 0;
    return (bilan.epargnes || 0) + (bilan.valeur_biens_durables || 0);
  }
  calculerMensualite() {
    const demande = this.state().resumeCredit?.demande_credit;
    if (!demande)
      return 0;
    const montant = demande.montant_demande || 0;
    const duree = demande.duree_mois || 1;
    return montant / duree;
  }
  // RATIO CRÉDIT/CA MODIFIÉ POUR UTILISER REVENUS TOTAUX
  calculerRatioCreditCA() {
    const demande = this.state().resumeCredit?.demande_credit;
    if (!demande)
      return 0;
    const montantDemande = demande.montant_demande || 0;
    const revenus = this.calculerRevenusTotauxPrevisionnel();
    return revenus > 0 ? montantDemande / revenus : 0;
  }
  // ========================================
  // MÉTHODES DE SÉVÉRITÉ POUR LES COULEURS
  // ========================================
  getLiquiditySeverity(ratio) {
    if (ratio > 2)
      return "success";
    if (ratio > 1.2)
      return "info";
    if (ratio > 0.8)
      return "warn";
    return "danger";
  }
  getMarginSeverity(margin) {
    if (margin >= 0.4)
      return "success";
    if (margin >= 0.25)
      return "info";
    if (margin >= 0.15)
      return "warn";
    return "danger";
  }
  getRatioCreditCASeverity() {
    const ratio = this.calculerRatioCreditCA();
    if (ratio <= 0.5)
      return "success";
    if (ratio <= 1)
      return "info";
    if (ratio <= 1.5)
      return "warn";
    return "danger";
  }
  // NOUVELLE MÉTHODE POUR LA SÉVÉRITÉ DU RATIO DE DÉPENDANCE
  getRatioDependanceSeverity(ratio) {
    if (ratio < 0.1)
      return "success";
    if (ratio < 0.3)
      return "info";
    if (ratio < 0.5)
      return "warn";
    return "danger";
  }
  getStatutSeverity(statut) {
    switch (statut?.toUpperCase()) {
      case "EN_ATTENTE":
        return "warn";
      case "APPROUVE":
        return "success";
      case "REJETE":
        return "danger";
      case "EN_COURS":
        return "info";
      case "VALIDE":
        return "success";
      default:
        return "secondary";
    }
  }
  // ========================================
  // MÉTHODES UTILITAIRES
  // ========================================
  formatDateForDisplay(date) {
    if (!date)
      return "";
    let dateObj;
    if (typeof date === "string") {
      dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return date;
      }
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      return "";
    }
    return dateObj.toLocaleDateString("fr-FR");
  }
  formatCurrency(amount) {
    if (amount === null || amount === void 0)
      return "0 GNF";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "GNF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
  formatPercent(value) {
    return new Intl.NumberFormat("fr-FR", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 2
    }).format(value);
  }
  formatNumber(value) {
    return new Intl.NumberFormat("fr-FR").format(value);
  }
  // ========================================
  // MÉTHODES DE NAVIGATION
  // ========================================
  retourListe() {
    console.log("go back: ", this.state().resumeCredit?.demande_credit);
    this.router.navigate(["/dashboards/credit/individuel/attente/detail/", this.state().resumeCredit?.demande_credit?.demandeIndividuelId]);
  }
  viewCompleteAnalyse() {
    console.log(this.state().resumeCredit?.demande_credit_id);
    if (this.state().resumeCredit?.demande_credit_id) {
      this.router.navigate([`/dashboards/credit/update-analyse-credit/${this.state().resumeCredit?.demande_credit_id}`]);
    }
  }
  // credit/resume-credit/:demandeId
  // ========================================
  // MÉTHODES POUR LES DONNÉES DES TABLEAUX
  // ========================================
  getPromoteurData() {
    const promoteur = this.state().resumeCredit?.promoteur;
    if (!promoteur)
      return [];
    return [
      { label: "Nom", value: promoteur.nom || "-" },
      { label: "Pr\xE9nom", value: promoteur.prenom || "-" },
      { label: "Email", value: promoteur.email || "-" },
      { label: "T\xE9l\xE9phone", value: promoteur.telephone || "-" },
      { label: "Num\xE9ro d'identit\xE9", value: promoteur.numero_identite || "-" },
      { label: "Date de naissance", value: this.formatDateForDisplay(promoteur.date_naissance) || "-" },
      { label: "Adresse", value: promoteur.adresse || "-" }
    ];
  }
  getEntrepriseData() {
    const entreprise = this.state().resumeCredit?.entreprise;
    if (!entreprise)
      return [];
    return [
      { label: "Nom", value: entreprise.nom || "-" },
      { label: "Forme juridique", value: entreprise.forme_juridique || "-" },
      { label: "Secteur d'activit\xE9", value: entreprise.secteur_activite || "-" },
      { label: "Date de cr\xE9ation", value: this.formatDateForDisplay(entreprise.date_creation) || "-" },
      { label: "Num\xE9ro de registre", value: entreprise.numero_registre || "-" },
      { label: "Email", value: entreprise.email || "-" },
      { label: "T\xE9l\xE9phone", value: entreprise.telephone || "-" },
      { label: "Adresse", value: entreprise.adresse || "-" }
    ];
  }
  getBilanEntrepriseData() {
    const bilan = this.state().resumeCredit?.bilan_entreprise;
    if (!bilan)
      return [];
    return [
      { label: "Liquidit\xE9s", value: this.formatCurrency(bilan.liquidites || 0) },
      { label: "Cr\xE9ances clients", value: this.formatCurrency(bilan.creances_clients || 0) },
      { label: "Valeur stocks", value: this.formatCurrency(bilan.valeur_stocks || 0) },
      { label: "Valeur \xE9quipements", value: this.formatCurrency(bilan.valeur_equipements || 0) },
      { label: "Dettes fournisseurs", value: this.formatCurrency(bilan.dettes_fournisseurs || 0) },
      { label: "Emprunts", value: this.formatCurrency(bilan.emprunts || 0) },
      { label: "Capital propre", value: this.formatCurrency(bilan.capital_propre || 0) },
      { label: "Total actif", value: this.formatCurrency(this.calculerTotalActif()), isTotal: true },
      { label: "Total passif", value: this.formatCurrency(this.calculerTotalPassif()), isTotal: true },
      {
        label: "Ratio de liquidit\xE9",
        value: this.calculerRatioLiquidite().toFixed(2),
        severity: this.getLiquiditySeverity(this.calculerRatioLiquidite()),
        isRatio: true
      }
    ];
  }
  getBilanPersonnelData() {
    const bilan = this.state().resumeCredit?.bilan_personnel;
    if (!bilan)
      return [];
    return [
      { label: "\xC9pargnes", value: this.formatCurrency(bilan.epargnes || 0) },
      { label: "Biens durables", value: this.formatCurrency(bilan.valeur_biens_durables || 0) },
      { label: "Total patrimoine", value: this.formatCurrency(this.calculerPatrimoinePersonnel()), isTotal: true }
    ];
  }
  // MÉTHODES MODIFIÉES POUR INCLURE LES AUTRES REVENUS
  getExploitationActuelleData() {
    const exploitation = this.state().resumeCredit?.exploitation_actuelle;
    if (!exploitation)
      return [];
    return [
      { label: "P\xE9riode", value: `${this.formatDateForDisplay(exploitation.periode_debut)} - ${this.formatDateForDisplay(exploitation.periode_fin)}` },
      { label: "Chiffre d'affaires", value: this.formatCurrency(exploitation.chiffre_affaires || 0) },
      { label: "Autres revenus", value: this.formatCurrency(exploitation.autres_revenus || 0) },
      { label: "Revenus totaux", value: this.formatCurrency(this.calculerRevenusTotauxActuel()), isTotal: true },
      {
        label: "Ratio de d\xE9pendance",
        value: this.formatPercent(this.calculerRatioDependanceActuel()),
        severity: this.getRatioDependanceSeverity(this.calculerRatioDependanceActuel()),
        isRatio: true
      },
      { label: "Co\xFBt marchandises", value: this.formatCurrency(exploitation.cout_marchandises || 0) },
      {
        label: "Marge brute",
        value: this.formatPercent(this.calculerMargeButeActuelle()),
        severity: this.getMarginSeverity(this.calculerMargeButeActuelle()),
        isRatio: true
      },
      { label: "Total charges", value: this.formatCurrency(this.calculerTotalChargesActuelles()), isTotal: true }
    ];
  }
  getExploitationPrevisionnelleData() {
    const exploitation = this.state().resumeCredit?.exploitation_previsionnelle;
    if (!exploitation)
      return [];
    return [
      { label: "P\xE9riode", value: `${this.formatDateForDisplay(exploitation.periode_debut)} - ${this.formatDateForDisplay(exploitation.periode_fin)}` },
      { label: "Chiffre d'affaires", value: this.formatCurrency(exploitation.chiffre_affaires || 0) },
      { label: "Autres revenus", value: this.formatCurrency(exploitation.autres_revenus || 0) },
      { label: "Revenus totaux", value: this.formatCurrency(this.calculerRevenusTotauxPrevisionnel()), isTotal: true },
      {
        label: "Ratio de d\xE9pendance",
        value: this.formatPercent(this.calculerRatioDependancePrevisionnel()),
        severity: this.getRatioDependanceSeverity(this.calculerRatioDependancePrevisionnel()),
        isRatio: true
      },
      { label: "Co\xFBt marchandises", value: this.formatCurrency(exploitation.cout_marchandises || 0) },
      {
        label: "Marge brute",
        value: this.formatPercent(this.calculerMargeButePrevisionnelle()),
        severity: this.getMarginSeverity(this.calculerMargeButePrevisionnelle()),
        isRatio: true
      },
      { label: "Total charges", value: this.formatCurrency(this.calculerTotalChargesPrevisionnelles()), isTotal: true }
    ];
  }
  getChargesData(type) {
    const exploitation = type === "actuelle" ? this.state().resumeCredit?.exploitation_actuelle : this.state().resumeCredit?.exploitation_previsionnelle;
    if (!exploitation)
      return [];
    const total = type === "actuelle" ? this.calculerTotalChargesActuelles() : this.calculerTotalChargesPrevisionnelles();
    return [
      { label: "Transport production", value: this.formatCurrency(exploitation.cout_transport_production || 0) },
      { label: "Transport personnel", value: this.formatCurrency(exploitation.frais_transport_personnel || 0) },
      { label: "Manutention", value: this.formatCurrency(exploitation.frais_manutention || 0) },
      { label: "Aide externe", value: this.formatCurrency(exploitation.montant_aide_externe || 0) },
      { label: "H\xE9bergement/Restauration", value: this.formatCurrency(exploitation.frais_hebergement_restauration || 0) },
      { label: "Imp\xF4ts", value: this.formatCurrency(exploitation.impots || 0) },
      { label: "Loyers", value: this.formatCurrency(exploitation.loyers || 0) },
      { label: "Total charges", value: this.formatCurrency(total), isTotal: true }
    ];
  }
  /**
   * Méthode mise à jour avec les nouvelles colonnes
   */
  getDemandeCreditData() {
    const demande = this.state().resumeCredit?.demande_credit;
    if (!demande)
      return [];
    return [
      { label: "Date demande", value: this.formatDateForDisplay(demande.date_demande) || "-" },
      { label: "Montant demand\xE9", value: this.formatCurrency(demande.montant_demande || 0) },
      { label: "Dur\xE9e", value: `${demande.duree_mois || 0} mois` },
      { label: "Objet du financement", value: demande.objet_financement || "-" },
      { label: "Mensualit\xE9 estim\xE9e", value: this.formatCurrency(this.calculerMensualite()) },
      {
        label: "Ratio cr\xE9dit/Revenus totaux",
        value: this.formatPercent(this.calculerRatioCreditCA()),
        severity: this.getRatioCreditCASeverity(),
        isRatio: true
      },
      { label: "Statut", value: demande.statut || "-", isStatus: true },
      // NOUVELLES COLONNES
      { label: "ID D\xE9l\xE9gation", value: demande.delegation_id ? `${demande.delegation_id}` : "Non renseign\xE9" },
      { label: "ID Agence", value: demande.agence_id ? `${demande.agence_id}` : "Non renseign\xE9" },
      { label: "ID Point de vente", value: demande.point_vente_id ? `${demande.point_vente_id}` : "Non renseign\xE9" },
      { label: "ID Utilisateur", value: demande.user_id ? `${demande.user_id}` : "Non renseign\xE9" }
    ];
  }
  /**
   * Mise à jour des indicateurs clés pour inclure la garantie
   */
  getIndicateursCles() {
    const resume = this.state().resumeCredit;
    if (!resume)
      return [];
    return [
      {
        icon: "pi pi-chart-line",
        label: "Marge brute pr\xE9visionnelle",
        value: this.formatPercent(this.calculerMargeButePrevisionnelle()),
        severity: this.getMarginSeverity(this.calculerMargeButePrevisionnelle()),
        color: "blue"
      },
      {
        icon: "pi pi-money-bill",
        label: "Ratio de liquidit\xE9",
        value: this.calculerRatioLiquidite().toFixed(2),
        severity: this.getLiquiditySeverity(this.calculerRatioLiquidite()),
        color: "green"
      },
      {
        icon: "pi pi-percentage",
        label: "Ratio cr\xE9dit/Revenus totaux",
        value: this.formatPercent(this.calculerRatioCreditCA()),
        severity: this.getRatioCreditCASeverity(),
        color: "orange"
      },
      {
        icon: "pi pi-chart-pie",
        label: "Ratio de d\xE9pendance",
        value: this.formatPercent(this.calculerRatioDependancePrevisionnel()),
        severity: this.getRatioDependanceSeverity(this.calculerRatioDependancePrevisionnel()),
        color: "red"
      },
      // NOUVEL INDICATEUR : Garantie personnelle
      this.getIndicateurGarantie(),
      {
        icon: "pi pi-wallet",
        label: "Patrimoine personnel",
        value: this.formatCurrency(this.calculerPatrimoinePersonnel()),
        severity: "info",
        color: "purple"
      }
    ];
  }
  // ========================================
  // MÉTHODES DE CALCUL DES RATIOS AVEC FORMULES EXACTES
  // ========================================
  // R1 - CAPACITÉ DE REMBOURSEMENT
  // Formule: (Cash Flow + Autres revenus) / (Traite revenus)
  /**
   * Calcule R1 - Capacité de remboursement
   */
  calculerR1Capacite() {
    const cashFlow = this.getCashFlow();
    const autresRevenus = this.getAutresRevenus();
    const traiteRevenus = this.getTraiteRevenus();
    if (traiteRevenus === 0)
      return "0.0";
    const ratio = (cashFlow + autresRevenus) / traiteRevenus * 100;
    return ratio.toFixed(1);
  }
  getCashFlow() {
    const resumeCredit = this.state().resumeCredit;
    if (!resumeCredit)
      return 0;
    const revenus = this.calculerRevenusTotauxPrevisionnel();
    const charges = this.calculerTotalChargesPrevisionnelles();
    return Math.max(0, revenus - charges);
  }
  getAutresRevenus() {
    const resumeCredit = this.state().resumeCredit;
    return resumeCredit?.exploitation_previsionnelle?.autres_revenus || 0;
  }
  getTraiteRevenus() {
    return this.calculerMensualite();
  }
  getStatutR1() {
    const ratio = parseFloat(this.calculerR1Capacite());
    if (ratio >= 150)
      return "EXCELLENT";
    if (ratio >= 120)
      return "BON";
    if (ratio >= 100)
      return "ACCEPTABLE";
    return "RISQUE";
  }
  getSeveriteR1() {
    const ratio = parseFloat(this.calculerR1Capacite());
    if (ratio >= 150)
      return "success";
    if (ratio >= 120)
      return "info";
    if (ratio >= 100)
      return "warn";
    return "danger";
  }
  // R2 - RATIO DE SOLVABILITÉ
  // Formule: Capitaux propres / Total Actif
  /**
   * Calcule R2 - Ratio de solvabilité
   */
  calculerR2Solvabilite() {
    const capitauxPropres = this.getCapitauxPropres();
    const totalActif = this.getTotalActif();
    if (totalActif === 0)
      return "0.0";
    const ratio = capitauxPropres / totalActif * 100;
    return ratio.toFixed(1);
  }
  getCapitauxPropres() {
    const resumeCredit = this.state().resumeCredit;
    return resumeCredit?.bilan_entreprise?.capital_propre || 0;
  }
  getTotalActif() {
    return this.calculerTotalActif();
  }
  getStatutR2() {
    const ratio = parseFloat(this.calculerR2Solvabilite());
    if (ratio >= 25)
      return "EXCELLENT";
    if (ratio >= 15)
      return "BON";
    if (ratio >= 10)
      return "ACCEPTABLE";
    return "RISQUE";
  }
  getSeveriteR2() {
    const ratio = parseFloat(this.calculerR2Solvabilite());
    if (ratio >= 25)
      return "success";
    if (ratio >= 15)
      return "info";
    if (ratio >= 10)
      return "warn";
    return "danger";
  }
  // R3 - RATIO DE LIQUIDITÉ
  // Formule: (Créances + Trésorerie) / Dettes court terme
  /**
   * Calcule R3 - Ratio de liquidité
   */
  calculerR3Liquidite() {
    const creancesEtTresorerie = this.getCreancesEtTresorerie();
    const dettesCourtTerme = this.getDettesCourtTerme();
    if (dettesCourtTerme === 0)
      return "0.0";
    const ratio = creancesEtTresorerie / dettesCourtTerme * 100;
    return ratio.toFixed(1);
  }
  getCreancesEtTresorerie() {
    const resumeCredit = this.state().resumeCredit;
    const bilan = resumeCredit?.bilan_entreprise;
    const creances = bilan?.creances_clients || 0;
    const tresorerie = bilan?.liquidites || 0;
    return creances + tresorerie;
  }
  getDettesCourtTerme() {
    const resumeCredit = this.state().resumeCredit;
    const bilan = resumeCredit?.bilan_entreprise;
    const dettesFournisseurs = bilan?.dettes_fournisseurs || 0;
    return dettesFournisseurs || 1;
  }
  getStatutR3() {
    const ratio = parseFloat(this.calculerR3Liquidite());
    if (ratio >= 100)
      return "EXCELLENT";
    if (ratio >= 80)
      return "BON";
    if (ratio >= 60)
      return "ACCEPTABLE";
    return "RISQUE";
  }
  getSeveriteR3() {
    const ratio = parseFloat(this.calculerR3Liquidite());
    if (ratio >= 100)
      return "success";
    if (ratio >= 80)
      return "info";
    if (ratio >= 60)
      return "warn";
    return "danger";
  }
  // R4 - RATIO D'ENDETTEMENT
  // Formule: (Dettes totales + Crédit) / (Total Actif + Crédit)
  /**
   * Calcule R4 - Ratio d'endettement
   */
  calculerR4Endettement() {
    const dettesTotalesAvecCredit = this.getDettesTotalesAvecCredit();
    const totalActifAvecCredit = this.getTotalActifAvecCredit();
    if (totalActifAvecCredit === 0)
      return "0.0";
    const ratio = dettesTotalesAvecCredit / totalActifAvecCredit * 100;
    return ratio.toFixed(1);
  }
  getDettesTotalesAvecCredit() {
    const resumeCredit = this.state().resumeCredit;
    const bilan = resumeCredit?.bilan_entreprise;
    const dettesTotales = (bilan?.dettes_fournisseurs || 0) + (bilan?.emprunts || 0);
    const montantCredit = resumeCredit?.demande_credit?.montant_demande || 0;
    return dettesTotales + montantCredit;
  }
  getTotalActifAvecCredit() {
    const totalActif = this.calculerTotalActif();
    const resumeCredit = this.state().resumeCredit;
    const montantCredit = resumeCredit?.demande_credit?.montant_demande || 0;
    return totalActif + montantCredit;
  }
  getStatutR4() {
    const ratio = parseFloat(this.calculerR4Endettement());
    if (ratio <= 70)
      return "EXCELLENT";
    if (ratio <= 80)
      return "BON";
    if (ratio <= 90)
      return "ACCEPTABLE";
    return "RISQUE";
  }
  getSeveriteR4() {
    const ratio = parseFloat(this.calculerR4Endettement());
    if (ratio <= 70)
      return "success";
    if (ratio <= 80)
      return "info";
    if (ratio <= 90)
      return "warn";
    return "danger";
  }
  // R5 - RATIO DE DÉPENDANCE
  // Formule: Autres revenus / Revenus totaux
  /**
   * Calcule R5 - Ratio de dépendance
   */
  calculerR5Dependance() {
    const autresRevenus = this.getAutresRevenus();
    const revenusTorauxPrevisionnel = this.getRevenusTorauxPrevisionnel();
    if (revenusTorauxPrevisionnel === 0)
      return "0.0";
    const ratio = autresRevenus / revenusTorauxPrevisionnel * 100;
    return ratio.toFixed(1);
  }
  getRevenusTorauxPrevisionnel() {
    return this.calculerRevenusTotauxPrevisionnel();
  }
  getStatutR5() {
    const ratio = parseFloat(this.calculerR5Dependance());
    if (ratio <= 30)
      return "EXCELLENT";
    if (ratio <= 40)
      return "BON";
    if (ratio <= 50)
      return "ACCEPTABLE";
    return "RISQUE";
  }
  getSeveriteR5() {
    const ratio = parseFloat(this.calculerR5Dependance());
    if (ratio <= 30)
      return "success";
    if (ratio <= 40)
      return "info";
    if (ratio <= 50)
      return "warn";
    return "danger";
  }
  // R6 - RATIO DE COUVERTURE DE LA GARANTIE
  // Formule: Valeur de la garantie / Crédit
  /**
   * Calcule R6 - Ratio de couverture de la garantie
   */
  calculerR6Couverture() {
    const valeurGarantie = this.getValeurGarantie();
    const montantCredit = this.getMontantCredit();
    if (montantCredit === 0)
      return "0.0";
    const ratio = valeurGarantie / montantCredit * 100;
    return ratio.toFixed(1);
  }
  /**
   * Calcul amélioré de la valeur de garantie incluant les personnes caution
   */
  getValeurGarantie() {
    const resumeCredit = this.state().resumeCredit;
    const patrimoinePersonnel = this.calculerPatrimoinePersonnel();
    const totalActif = this.calculerTotalActif();
    let garantieBase = patrimoinePersonnel + totalActif * 0.5;
    const nbPersonnes = this.getNombrePersonnesCaution();
    const bonusPersonnesCaution = nbPersonnes * 0.1;
    const coefficientCaution = 1 + Math.min(bonusPersonnesCaution, 0.3);
    return garantieBase * coefficientCaution;
  }
  getMontantCredit() {
    const resumeCredit = this.state().resumeCredit;
    return resumeCredit?.demande_credit?.montant_demande || 0;
  }
  getStatutR6() {
    const ratio = parseFloat(this.calculerR6Couverture());
    if (ratio >= 120)
      return "EXCELLENT";
    if (ratio >= 100)
      return "BON";
    if (ratio >= 80)
      return "ACCEPTABLE";
    return "RISQUE";
  }
  getSeveriteR6() {
    const ratio = parseFloat(this.calculerR6Couverture());
    if (ratio >= 120)
      return "success";
    if (ratio >= 100)
      return "info";
    if (ratio >= 80)
      return "warn";
    return "danger";
  }
  // ========================================
  // MÉTHODES D'ÉVALUATION GLOBALE
  // ========================================
  /**
   * Évaluation globale basée sur tous les ratios
   */
  getEvaluationGlobale() {
    const statuts = [this.getStatutR1(), this.getStatutR2(), this.getStatutR3(), this.getStatutR4(), this.getStatutR5(), this.getStatutR6()];
    const nbExcellents = statuts.filter((s) => s === "EXCELLENT").length;
    const nbBons = statuts.filter((s) => s === "BON").length;
    const nbAcceptables = statuts.filter((s) => s === "ACCEPTABLE").length;
    if (nbExcellents >= 4)
      return "EXCELLENT";
    if (nbExcellents + nbBons >= 4)
      return "BON";
    if (nbExcellents + nbBons + nbAcceptables >= 4)
      return "ACCEPTABLE";
    return "RISQUE";
  }
  /**
   * Couleur de l'évaluation globale
   */
  getCouleurEvaluationGlobale() {
    const evaluation = this.getEvaluationGlobale();
    switch (evaluation) {
      case "EXCELLENT":
        return "text-green-600";
      case "BON":
        return "text-blue-600";
      case "ACCEPTABLE":
        return "text-orange-600";
      case "RISQUE":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  }
  /**
   * Nombre de seuils respectés
   */
  getNbSeuilsRespetes() {
    const statuts = [this.getStatutR1(), this.getStatutR2(), this.getStatutR3(), this.getStatutR4(), this.getStatutR5(), this.getStatutR6()];
    return statuts.filter((s) => s === "EXCELLENT" || s === "BON").length;
  }
  // ========================================
  // MÉTHODES D'ANALYSE DÉTAILLÉE
  // ========================================
  /**
   * Obtient un résumé détaillé de tous les ratios
   */
  getResumeRatios() {
    return {
      R1: {
        nom: "Capacit\xE9 de remboursement",
        valeur: this.calculerR1Capacite(),
        statut: this.getStatutR1(),
        formule: "(Cash Flow + Autres revenus) / Traite revenus"
      },
      R2: {
        nom: "Ratio de solvabilit\xE9",
        valeur: this.calculerR2Solvabilite(),
        statut: this.getStatutR2(),
        formule: "Capitaux propres / Total Actif"
      },
      R3: {
        nom: "Ratio de liquidit\xE9",
        valeur: this.calculerR3Liquidite(),
        statut: this.getStatutR3(),
        formule: "(Cr\xE9ances + Tr\xE9sorerie) / Dettes court terme"
      },
      R4: {
        nom: "Ratio d'endettement",
        valeur: this.calculerR4Endettement(),
        statut: this.getStatutR4(),
        formule: "(Dettes totales + Cr\xE9dit) / (Total Actif + Cr\xE9dit)"
      },
      R5: {
        nom: "Ratio de d\xE9pendance",
        valeur: this.calculerR5Dependance(),
        statut: this.getStatutR5(),
        formule: "Autres revenus / Revenus totaux"
      },
      R6: {
        nom: "Ratio de couverture",
        valeur: this.calculerR6Couverture(),
        statut: this.getStatutR6(),
        formule: "Valeur de la garantie / Cr\xE9dit"
      }
    };
  }
  /**
   * Export des données pour analyse externe
   */
  exporterAnalyse() {
    const resume = this.getResumeRatios();
    const evaluation = this.getEvaluationGlobale();
    const nbSeuils = this.getNbSeuilsRespetes();
    return {
      date_analyse: (/* @__PURE__ */ new Date()).toISOString(),
      evaluation_globale: evaluation,
      seuils_respectes: `${nbSeuils}/6`,
      ratios: resume,
      montant_demande: this.getMontantCredit(),
      recommandations: this.getRecommandations()
    };
  }
  // ========================================
  // MÉTHODE MANQUANTE : getRecommandations()
  // ========================================
  /**
   * Génère des recommandations basées sur l'analyse des ratios
   */
  getRecommandations() {
    const recommendations = [];
    const r1 = parseFloat(this.calculerR1Capacite());
    if (r1 < 150) {
      recommendations.push("\u2022 Am\xE9liorer la capacit\xE9 de remboursement (Cash Flow insuffisant)");
    }
    const r2 = parseFloat(this.calculerR2Solvabilite());
    if (r2 < 25) {
      recommendations.push("\u2022 Renforcer les capitaux propres de l'entreprise");
    }
    const r3 = parseFloat(this.calculerR3Liquidite());
    if (r3 < 100) {
      recommendations.push("\u2022 Am\xE9liorer la gestion de tr\xE9sorerie et cr\xE9ances");
    }
    const r4 = parseFloat(this.calculerR4Endettement());
    if (r4 > 70) {
      recommendations.push("\u2022 R\xE9duire le niveau d'endettement global");
    }
    const r5 = parseFloat(this.calculerR5Dependance());
    if (r5 > 50) {
      recommendations.push("\u2022 Diversifier les sources de revenus (trop de d\xE9pendance aux autres revenus)");
    }
    const r6 = parseFloat(this.calculerR6Couverture());
    if (r6 < 120) {
      recommendations.push("\u2022 Renforcer les garanties ou r\xE9duire le montant demand\xE9");
    }
    if (recommendations.length === 0) {
      recommendations.push("\u2705 Tous les indicateurs sont dans les normes acceptables");
      recommendations.push("\u2705 Le profil de risque est satisfaisant");
      recommendations.push("\u2705 La demande de cr\xE9dit peut \xEAtre consid\xE9r\xE9e favorablement");
    }
    return recommendations;
  }
  // ========================================
  // MÉTHODES UTILITAIRES SUPPLÉMENTAIRES
  // ========================================
  /**
   * Analyse de risque détaillée
   */
  getAnalyseRisque() {
    const evaluation = this.getEvaluationGlobale();
    const score = this.getScoreRisque();
    const facteurs = [];
    if (parseFloat(this.calculerR1Capacite()) < 150) {
      facteurs.push("Capacit\xE9 de remboursement insuffisante");
    }
    if (parseFloat(this.calculerR5Dependance()) > 50) {
      facteurs.push("Forte d\xE9pendance aux autres revenus");
    }
    if (parseFloat(this.calculerR4Endettement()) > 70) {
      facteurs.push("Niveau d'endettement \xE9lev\xE9");
    }
    if (parseFloat(this.calculerR3Liquidite()) < 100) {
      facteurs.push("Liquidit\xE9 insuffisante");
    }
    if (facteurs.length === 0) {
      facteurs.push("Aucun facteur de risque majeur identifi\xE9");
    }
    return {
      niveau: evaluation,
      score,
      facteurs
    };
  }
  /**
   * Score de risque (0-100, 100 = meilleur)
   */
  getScoreRisque() {
    const statuts = [this.getStatutR1(), this.getStatutR2(), this.getStatutR3(), this.getStatutR4(), this.getStatutR5(), this.getStatutR6()];
    let score = 0;
    statuts.forEach((statut) => {
      switch (statut) {
        case "EXCELLENT":
          score += 100;
          break;
        case "BON":
          score += 75;
          break;
        case "ACCEPTABLE":
          score += 50;
          break;
        case "RISQUE":
          score += 25;
          break;
      }
    });
    return Math.round(score / statuts.length);
  }
  /**
   * Obtient des conseils d'amélioration spécifiques
   */
  getConseilsAmelioration() {
    const conseils = [];
    const r1 = parseFloat(this.calculerR1Capacite());
    const r2 = parseFloat(this.calculerR2Solvabilite());
    const r3 = parseFloat(this.calculerR3Liquidite());
    const r4 = parseFloat(this.calculerR4Endettement());
    const r5 = parseFloat(this.calculerR5Dependance());
    const r6 = parseFloat(this.calculerR6Couverture());
    if (r1 < 150) {
      conseils.push("\u{1F4C8} Augmenter les revenus ou optimiser les charges pour am\xE9liorer le cash flow");
    }
    if (r2 < 25) {
      conseils.push("\u{1F4B0} Envisager un apport en capital ou r\xE9duire les distributions");
    }
    if (r3 < 100) {
      conseils.push("\u{1F4A7} Acc\xE9l\xE9rer le recouvrement des cr\xE9ances et optimiser la tr\xE9sorerie");
    }
    if (r4 > 70) {
      conseils.push("\u{1F4C9} Planifier un d\xE9sendettement progressif avant la nouvelle demande");
    }
    if (r5 > 50) {
      conseils.push("\u{1F3AF} D\xE9velopper le chiffre d'affaires principal pour r\xE9duire la d\xE9pendance");
    }
    if (r6 < 120) {
      conseils.push("\u{1F6E1}\uFE0F Constituer des garanties suppl\xE9mentaires ou r\xE9duire le montant");
    }
    return conseils;
  }
  /**
   * Évaluation finale avec recommandation de décision
   */
  getRecommandationDecision() {
    const evaluation = this.getEvaluationGlobale();
    const score = this.getScoreRisque();
    const nbSeuilsRespetes = this.getNbSeuilsRespetes();
    if (evaluation === "EXCELLENT" && nbSeuilsRespetes >= 5) {
      return {
        decision: "ACCORDER",
        justification: "Profil de risque excellent, tous les indicateurs sont favorables"
      };
    }
    if (evaluation === "BON" && nbSeuilsRespetes >= 4) {
      return {
        decision: "ACCORDER_AVEC_CONDITIONS",
        conditions: ["Suivi trimestriel des ratios financiers", "Maintien des garanties pendant toute la dur\xE9e"],
        justification: "Profil de risque acceptable avec quelques points d'attention"
      };
    }
    if (evaluation === "ACCEPTABLE" && nbSeuilsRespetes >= 3) {
      return {
        decision: "ETUDE_APPROFONDIE",
        conditions: ["Audit financier compl\xE9mentaire", "Plan d'am\xE9lioration des ratios d\xE9faillants", "Garanties renforc\xE9es"],
        justification: "Profil n\xE9cessitant une analyse approfondie avant d\xE9cision"
      };
    }
    return {
      decision: "REFUSER",
      justification: "Profil de risque trop \xE9lev\xE9, indicateurs financiers insuffisants"
    };
  }
  // ========================================
  // MÉTHODES UTILITAIRES POUR LE TEMPLATE
  // ========================================
  /**
   * Sévérité pour la décision recommandée
   */
  getDecisionSeverity() {
    const decision = this.getRecommandationDecision().decision;
    switch (decision) {
      case "ACCORDER":
        return "success";
      case "ACCORDER_AVEC_CONDITIONS":
        return "info";
      case "ETUDE_APPROFONDIE":
        return "warn";
      case "REFUSER":
        return "danger";
      default:
        return "secondary";
    }
  }
  /**
   * Test complet de l'analyse (pour debug)
   */
  testerAnalyseComplete() {
    console.log("=== ANALYSE COMPL\xC8TE DES RATIOS ===");
    console.log("\n1. RATIOS CALCUL\xC9S:");
    console.log("R1 - Capacit\xE9:", this.calculerR1Capacite() + "%", "(" + this.getStatutR1() + ")");
    console.log("R2 - Solvabilit\xE9:", this.calculerR2Solvabilite() + "%", "(" + this.getStatutR2() + ")");
    console.log("R3 - Liquidit\xE9:", this.calculerR3Liquidite() + "%", "(" + this.getStatutR3() + ")");
    console.log("R4 - Endettement:", this.calculerR4Endettement() + "%", "(" + this.getStatutR4() + ")");
    console.log("R5 - D\xE9pendance:", this.calculerR5Dependance() + "%", "(" + this.getStatutR5() + ")");
    console.log("R6 - Couverture:", this.calculerR6Couverture() + "%", "(" + this.getStatutR6() + ")");
    console.log("\n2. \xC9VALUATION GLOBALE:");
    console.log("Statut:", this.getEvaluationGlobale());
    console.log("Score de risque:", this.getScoreRisque() + "/100");
    console.log("Seuils respect\xE9s:", this.getNbSeuilsRespetes() + "/6");
    console.log("\n3. RECOMMANDATIONS:");
    this.getRecommandations().forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
    console.log("\n4. ANALYSE DE RISQUE:");
    const analyseRisque = this.getAnalyseRisque();
    console.log("Niveau:", analyseRisque.niveau);
    console.log("Facteurs de risque:", analyseRisque.facteurs);
    console.log("\n5. D\xC9CISION RECOMMAND\xC9E:");
    const decision = this.getRecommandationDecision();
    console.log("D\xE9cision:", decision.decision);
    console.log("Justification:", decision.justification);
    if (decision.conditions) {
      console.log("Conditions:", decision.conditions);
    }
    this.messageService.add({
      severity: "info",
      summary: "Test termin\xE9",
      detail: "V\xE9rifiez la console pour les r\xE9sultats d\xE9taill\xE9s"
    });
  }
  /**
   * Export de l'analyse complète incluant les personnes caution
   */
  exporterAnalyseComplete() {
    const infoAdmin = this.state().infoAdministrative;
    const analyseComplete = {
      // Informations générales
      date_analyse: (/* @__PURE__ */ new Date()).toISOString(),
      montant_demande: this.formatCurrency(this.getMontantCredit()),
      // Personnes caution (existant)
      personnes_caution: {
        nombre: this.getNombrePersonnesCaution(),
        liste: this.state().resumeCredit?.personnes_caution || [],
        analyse_garantie: this.getAnalyseGarantiePersonnelle()
      },
      // INFORMATIONS ADMINISTRATIVES CORRIGÉES
      informations_administratives: infoAdmin ? {
        delegation: {
          id: infoAdmin.delegationDto.id,
          libele: infoAdmin.delegationDto.libele
        },
        agence: {
          id: infoAdmin.agenceDto.id,
          libele: infoAdmin.agenceDto.libele,
          delegation_id: infoAdmin.agenceDto.delegation_id
        },
        point_vente: {
          id: infoAdmin.pointVenteDto.id,
          libele: infoAdmin.pointVenteDto.libele,
          code: infoAdmin.pointVenteDto.code,
          delegation_id: infoAdmin.pointVenteDto.delegation_id,
          agence_id: infoAdmin.pointVenteDto.agence_id
        },
        utilisateur_traitant: {
          userId: infoAdmin.user.userId,
          firstName: infoAdmin.user.firstName,
          lastName: infoAdmin.user.lastName,
          email: infoAdmin.user.email,
          username: infoAdmin.user.username,
          phone: infoAdmin.user.phone,
          role: infoAdmin.user.role,
          lastLogin: infoAdmin.user.lastLogin,
          enabled: infoAdmin.user.enabled
        },
        resume_hierarchique: this.getResumeAdministratif()
      } : {
        message: "Informations administratives non disponibles",
        fallback_ids: {
          delegation_id: this.state().resumeCredit?.demande_credit?.delegation_id,
          agence_id: this.state().resumeCredit?.demande_credit?.agence_id,
          point_vente_id: this.state().resumeCredit?.demande_credit?.point_vente_id,
          user_id: this.state().resumeCredit?.demande_credit?.user_id
        }
      },
      // Ratios détaillés (existant)
      ratios: this.getResumeRatios(),
      // Évaluation globale (existant)
      evaluation: {
        statut_global: this.getEvaluationGlobale(),
        score_risque: this.getScoreRisque(),
        seuils_respectes: this.getNbSeuilsRespetes() + "/6"
      },
      // Recommandations (existant)
      recommandations: this.getRecommandations(),
      conseils_amelioration: this.getConseilsAmelioration(),
      analyse_risque: this.getAnalyseRisque(),
      decision_recommandee: this.getRecommandationDecision()
    };
    console.log("=== EXPORT ANALYSE COMPL\xC8TE AVEC INFOS ADMINISTRATIVES CORRIG\xC9ES ===");
    console.log(JSON.stringify(analyseComplete, null, 2));
    this.messageService.add({
      severity: "success",
      summary: "Export termin\xE9",
      detail: "Analyse export\xE9e avec informations administratives compl\xE8tes"
    });
    this.telechargerAnalyseJSON(analyseComplete);
  }
  /**
   * Test des informations administratives
   */
  testerInfoAdministrative() {
    console.log("=== TEST INFORMATIONS ADMINISTRATIVES ===");
    const hasInfo = this.hasInfoAdministrative();
    const isLoading = this.isLoadingInfoAdmin();
    const tracabilite = this.getTracabiliteDetaillee();
    const resume = this.getResumeAdministratif();
    console.log("Donn\xE9es disponibles:", hasInfo);
    console.log("En cours de chargement:", isLoading);
    console.log("R\xE9sum\xE9:", resume);
    console.log("Tracabilit\xE9 d\xE9taill\xE9e:", tracabilite);
    if (hasInfo) {
      console.log("Informations compl\xE8tes:", this.state().infoAdministrative);
    }
    this.messageService.add({
      severity: "info",
      summary: "Test termin\xE9",
      detail: `Infos admin: ${hasInfo ? "Disponibles" : "Non disponibles"}`
    });
  }
  /**
   * Méthode de test incluant les nouvelles données
   */
  testerAnalyseCompleteAvecCautions() {
    console.log("=== ANALYSE COMPL\xC8TE AVEC PERSONNES CAUTION ===");
    console.log("\n1. PERSONNES CAUTION:");
    console.log("Nombre:", this.getNombrePersonnesCaution());
    console.log("Liste:", this.getPersonnesCautionCompact());
    const analyseGarantie = this.getAnalyseGarantiePersonnelle();
    console.log("Analyse garantie:", analyseGarantie);
    console.log("\n2. INFORMATIONS COMPL\xC9MENTAIRES DEMANDE:");
    const demande = this.state().resumeCredit?.demande_credit;
    console.log("D\xE9l\xE9gation ID:", demande?.delegation_id || "Non renseign\xE9");
    console.log("Agence ID:", demande?.agence_id || "Non renseign\xE9");
    console.log("Point de vente ID:", demande?.point_vente_id || "Non renseign\xE9");
    console.log("User ID:", demande?.user_id || "Non renseign\xE9");
    console.log("\n3. RATIOS AVEC GARANTIES AM\xC9LIOR\xC9ES:");
    console.log("R6 - Couverture (avec bonus cautions):", this.calculerR6Couverture() + "%", "(" + this.getStatutR6() + ")");
    console.log("Valeur garantie totale:", this.formatCurrency(this.getValeurGarantie()));
    console.log("Bonus personnes caution:", `${this.getNombrePersonnesCaution()} personne(s) = +${(this.getNombrePersonnesCaution() * 10).toFixed(0)}%`);
    console.log("\n4. \xC9VALUATION GLOBALE:");
    console.log("Statut:", this.getEvaluationGlobale());
    console.log("Score de risque:", this.getScoreRisque() + "/100");
    this.messageService.add({
      severity: "info",
      summary: "Test termin\xE9",
      detail: "Analyse avec personnes caution - Consultez la console"
    });
  }
  /**
   * Télécharge l'analyse en fichier JSON
   */
  telechargerAnalyseJSON(data) {
    const fileName = `analyse_credit_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(dataBlob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  }
  /**
   * Résumé rapide pour affichage
   */
  getResumePourAffichage() {
    const evaluation = this.getEvaluationGlobale();
    const score = this.getScoreRisque();
    const nbSeuils = this.getNbSeuilsRespetes();
    return `\xC9valuation: ${evaluation} (${score}/100) - ${nbSeuils}/6 seuils respect\xE9s`;
  }
  /**
   * Couleur pour le score de risque
   */
  getCouleurScore(score) {
    if (score >= 80)
      return "text-green-600";
    if (score >= 60)
      return "text-blue-600";
    if (score >= 40)
      return "text-orange-600";
    return "text-red-600";
  }
  /**
   * Icône selon l'évaluation
   */
  getIconeEvaluation() {
    const evaluation = this.getEvaluationGlobale();
    switch (evaluation) {
      case "EXCELLENT":
        return "pi pi-check-circle";
      case "BON":
        return "pi pi-thumbs-up";
      case "ACCEPTABLE":
        return "pi pi-exclamation-triangle";
      case "RISQUE":
        return "pi pi-times-circle";
      default:
        return "pi pi-question-circle";
    }
  }
  /**
   * Récupère les données des personnes caution pour affichage
   */
  getPersonnesCautionData() {
    const personnes = this.state().resumeCredit?.personnes_caution;
    if (!personnes || !Array.isArray(personnes) || personnes.length === 0) {
      return [{ label: "Aucune personne caution", value: "Pas de garantie personnelle enregistr\xE9e" }];
    }
    const data = [];
    personnes.forEach((personne, index) => {
      data.push({ label: `Caution ${index + 1} - Nom`, value: personne.nom || "-" }, { label: `Caution ${index + 1} - Pr\xE9nom`, value: personne.prenom || "-" }, { label: `Caution ${index + 1} - T\xE9l\xE9phone`, value: personne.telephone || "-" }, { label: `Caution ${index + 1} - Activit\xE9`, value: personne.activite || "-" }, { label: `Caution ${index + 1} - \xC2ge`, value: personne.age ? `${personne.age} ans` : "-" }, { label: `Caution ${index + 1} - Profession`, value: personne.profession || "-" });
      if (index < personnes.length - 1) {
        data.push({ label: "---", value: "---" });
      }
    });
    return data;
  }
  /**
   * Récupère le nombre de personnes caution
   */
  getNombrePersonnesCaution() {
    const personnes = this.state().resumeCredit?.personnes_caution;
    return personnes && Array.isArray(personnes) ? personnes.length : 0;
  }
  /**
   * Vérifie si des personnes caution existent
   */
  hasPersonnesCaution() {
    return this.getNombrePersonnesCaution() > 0;
  }
  /**
   * Récupère la liste des personnes caution pour affichage compact
   */
  getPersonnesCautionCompact() {
    const personnes = this.state().resumeCredit?.personnes_caution;
    if (!personnes || !Array.isArray(personnes))
      return [];
    return personnes.map((personne) => `${personne.prenom || ""} ${personne.nom || ""} - ${personne.profession || "N/A"}`);
  }
  /**
   * Analyse du profil de garantie basé sur les personnes caution
   */
  getAnalyseGarantiePersonnelle() {
    const nbPersonnes = this.getNombrePersonnesCaution();
    const personnes = this.state().resumeCredit?.personnes_caution || [];
    let score = 0;
    let niveau = "INSUFFISANT";
    let description = "";
    const recommendations = [];
    if (nbPersonnes === 0) {
      score = 20;
      niveau = "INSUFFISANT";
      description = "Aucune personne caution renseign\xE9e";
      recommendations.push("D\xE9signer au moins une personne caution solvable");
    } else if (nbPersonnes === 1) {
      score = 60;
      niveau = "MOYEN";
      description = "Une seule personne caution";
      recommendations.push("Envisager une seconde personne caution pour renforcer les garanties");
    } else if (nbPersonnes === 2) {
      score = 85;
      niveau = "BON";
      description = "Deux personnes caution - profil correct";
      recommendations.push("V\xE9rifier la solvabilit\xE9 des personnes caution");
    } else {
      score = 95;
      niveau = "EXCELLENT";
      description = "Plusieurs personnes caution - tr\xE8s bon profil de garantie";
    }
    const personnesSansActivite = personnes.filter((p) => !p.activite || !p.profession);
    if (personnesSansActivite.length > 0) {
      score -= 10;
      recommendations.push(`Compl\xE9ter les informations d'activit\xE9 pour ${personnesSansActivite.length} personne(s)`);
    }
    return { niveau, score, description, recommendations };
  }
  // ========================================
  // MÉTHODES UTILITAIRES POUR LES INDICATEURS
  // ========================================
  /**
   * Indicateur de garantie dans les indicateurs clés
   */
  getIndicateurGarantie() {
    const analyse = this.getAnalyseGarantiePersonnelle();
    let severity = "secondary";
    switch (analyse.niveau) {
      case "EXCELLENT":
        severity = "success";
        break;
      case "BON":
        severity = "info";
        break;
      case "MOYEN":
        severity = "warn";
        break;
      case "INSUFFISANT":
        severity = "danger";
        break;
    }
    return {
      icon: "pi pi-users",
      label: "Garantie personnelle",
      value: `${this.getNombrePersonnesCaution()} personne(s)`,
      severity,
      color: "teal"
    };
  }
  /**
   * MÉTHODE CORRIGÉE : Données complètes des informations administratives
   */
  getDemandeCreditInfosComplementaires() {
    const infoAdmin = this.state().infoAdministrative;
    const demande = this.state().resumeCredit?.demande_credit;
    if (!infoAdmin || !demande) {
      return [
        { label: "D\xE9l\xE9gation", value: demande?.delegation_id ? `ID: ${demande.delegation_id}` : "Non renseign\xE9e" },
        { label: "Agence", value: demande?.agence_id ? `ID: ${demande.agence_id}` : "Non renseign\xE9e" },
        { label: "Point de vente", value: demande?.point_vente_id ? `ID: ${demande.point_vente_id}` : "Non renseign\xE9" },
        { label: "Utilisateur", value: demande?.user_id ? `ID: ${demande.user_id}` : "Non renseign\xE9" }
      ];
    }
    return [
      {
        label: "D\xE9l\xE9gation",
        value: infoAdmin.delegationDto.libele
      },
      {
        label: "Agence",
        value: infoAdmin.agenceDto.libele
        // "libele" au lieu de "nom"
      },
      {
        label: "Point de vente",
        value: `${infoAdmin.pointVenteDto.libele} (${infoAdmin.pointVenteDto.code})`
        // "libele" et "code"
      },
      {
        label: "Utilisateur traitant",
        value: `${infoAdmin.user.firstName} ${infoAdmin.user.lastName} - ${infoAdmin.user.role}`
        // "firstName", "lastName", "role"
      }
    ];
  }
  /**
   * MÉTHODE CORRIGÉE : Données détaillées pour la traçabilité
   */
  getTracabiliteDetaillee() {
    const infoAdmin = this.state().infoAdministrative;
    const demande = this.state().resumeCredit?.demande_credit;
    if (!infoAdmin || !demande) {
      return {
        delegation: {
          id: demande?.delegation_id || "N/A",
          nom: "Information non disponible",
          details: "Chargement..."
        },
        agence: {
          id: demande?.agence_id || "N/A",
          nom: "Information non disponible",
          details: "Chargement..."
        },
        pointVente: {
          id: demande?.point_vente_id || "N/A",
          nom: "Information non disponible",
          details: "Chargement..."
        },
        user: {
          id: demande?.user_id || "N/A",
          nom: "Information non disponible",
          details: "Chargement..."
        }
      };
    }
    return {
      delegation: {
        id: infoAdmin.delegationDto.id,
        nom: infoAdmin.delegationDto.libele,
        // "libele" au lieu de "nom"
        details: `D\xE9l\xE9gation de ${infoAdmin.delegationDto.libele}`,
        code: `DEL-${infoAdmin.delegationDto.id}`
        // Généré car pas dans l'API
      },
      agence: {
        id: infoAdmin.agenceDto.id,
        nom: infoAdmin.agenceDto.libele,
        // "libele" au lieu de "nom"
        details: `Agence ${infoAdmin.agenceDto.libele}`,
        delegation_id: infoAdmin.agenceDto.delegation_id
      },
      pointVente: {
        id: infoAdmin.pointVenteDto.id,
        nom: infoAdmin.pointVenteDto.libele,
        // "libele" au lieu de "nom"
        code: infoAdmin.pointVenteDto.code,
        details: `Point de vente ${infoAdmin.pointVenteDto.libele} (Code: ${infoAdmin.pointVenteDto.code})`,
        agence_id: infoAdmin.pointVenteDto.agence_id,
        delegation_id: infoAdmin.pointVenteDto.delegation_id
      },
      user: {
        id: infoAdmin.user.userId,
        // "userId" au lieu de "user_id"
        nom: `${infoAdmin.user.firstName} ${infoAdmin.user.lastName}`,
        // "firstName" et "lastName"
        email: infoAdmin.user.email,
        details: infoAdmin.user.role || "R\xF4le non sp\xE9cifi\xE9",
        // "role" au lieu de "fonction"
        username: infoAdmin.user.username,
        phone: infoAdmin.user.phone || "Non renseign\xE9",
        lastLogin: infoAdmin.user.lastLogin || "Jamais connect\xE9",
        enabled: infoAdmin.user.enabled
      }
    };
  }
  /**
   * Vérifie si les informations administratives sont disponibles
   */
  hasInfoAdministrative() {
    return !!this.state().infoAdministrative;
  }
  /**
   * Vérifie si les informations administratives sont en cours de chargement
   */
  isLoadingInfoAdmin() {
    return this.state().loadingAdmin;
  }
  /**
   * MÉTHODE CORRIGÉE : Résumé administratif
   */
  getResumeAdministratif() {
    const info = this.state().infoAdministrative;
    if (!info)
      return "Informations en cours de chargement...";
    return `${info.delegationDto.libele} > ${info.agenceDto.libele} > ${info.pointVenteDto.libele} (${info.pointVenteDto.code})`;
  }
  /**
   * Prépare et lance l'impression du bilan de crédit
   */
  imprimerBilan(options = {}) {
    if (!this.state().resumeCredit) {
      this.messageService.add({
        severity: "warn",
        summary: "Attention",
        detail: "Aucune donn\xE9e disponible pour l'impression"
      });
      return;
    }
    try {
      const donneesImpression = this.preparerDonneesImpression();
      const optionsImpression = __spreadValues({
        includeIndicateurs: true,
        includeSignature: false,
        title: "R\xE9sum\xE9 d'Analyse de Cr\xE9dit"
      }, options);
      this.printService.imprimerBilan(donneesImpression, optionsImpression);
      this.messageService.add({
        severity: "success",
        summary: "Impression",
        detail: "Fen\xEAtre d'impression ouverte"
      });
    } catch (error) {
      console.error("Erreur lors de l'impression:", error);
      this.messageService.add({
        severity: "error",
        summary: "Erreur",
        detail: "Impossible de g\xE9n\xE9rer le document d'impression"
      });
    }
  }
  /**
   * Prépare toutes les données nécessaires pour l'impression
   */
  preparerDonneesImpression() {
    const resume = this.state().resumeCredit;
    const infoAdmin = this.state().infoAdministrative;
    return {
      // Informations générales
      dateImpression: (/* @__PURE__ */ new Date()).toISOString(),
      montantDemande: this.formatCurrency(this.getMontantCredit()),
      evaluationGlobale: this.getEvaluationGlobale(),
      scoreRisque: this.getScoreRisque(),
      seuilsRespetes: this.getNbSeuilsRespetes(),
      // Ratios détaillés pour les indicateurs
      ratios: [
        {
          nom: "R1 - Capacit\xE9 de remboursement",
          valeur: this.calculerR1Capacite(),
          statut: this.getStatutR1(),
          formule: "(Cash Flow + Autres revenus) / Traite revenus"
        },
        {
          nom: "R2 - Ratio de solvabilit\xE9",
          valeur: this.calculerR2Solvabilite(),
          statut: this.getStatutR2(),
          formule: "Capitaux propres / Total Actif"
        },
        {
          nom: "R3 - Ratio de liquidit\xE9",
          valeur: this.calculerR3Liquidite(),
          statut: this.getStatutR3(),
          formule: "(Cr\xE9ances + Tr\xE9sorerie) / Dettes court terme"
        },
        {
          nom: "R4 - Ratio d'endettement",
          valeur: this.calculerR4Endettement(),
          statut: this.getStatutR4(),
          formule: "(Dettes totales + Cr\xE9dit) / (Total Actif + Cr\xE9dit)"
        },
        {
          nom: "R5 - Ratio de d\xE9pendance",
          valeur: this.calculerR5Dependance(),
          statut: this.getStatutR5(),
          formule: "Autres revenus / Revenus totaux"
        },
        {
          nom: "R6 - Ratio de couverture",
          valeur: this.calculerR6Couverture(),
          statut: this.getStatutR6(),
          formule: "Valeur de la garantie / Cr\xE9dit"
        }
      ],
      // Informations détaillées
      promoteur: this.getPromoteurData(),
      entreprise: this.getEntrepriseData(),
      bilanEntreprise: this.getBilanEntrepriseData(),
      bilanPersonnel: this.getBilanPersonnelData(),
      exploitationActuelle: this.getExploitationActuelleData(),
      exploitationPrevisionnelle: this.getExploitationPrevisionnelleData(),
      chargesActuelles: this.getChargesData("actuelle"),
      chargesPrevisionnelles: this.getChargesData("previsionnelle"),
      demandeCredit: this.getDemandeCreditData().slice(0, 7),
      // Exclure les IDs techniques
      infoAdministratives: this.getDemandeCreditInfosComplementaires(),
      // Personnes caution
      personnesCaution: resume?.personnes_caution || [],
      personnesCautionData: this.getPersonnesCautionData(),
      analyseGarantie: this.getAnalyseGarantiePersonnelle(),
      // Analyse et recommandations
      recommandations: this.getRecommandations(),
      conseilsAmelioration: this.getConseilsAmelioration(),
      analyseRisque: this.getAnalyseRisque(),
      decisionRecommandee: this.getRecommandationDecision(),
      // Métadonnées
      utilisateur: this.state().user,
      informationsAdministratives: infoAdmin ? {
        delegation: infoAdmin.delegationDto.libele,
        agence: infoAdmin.agenceDto.libele,
        pointVente: `${infoAdmin.pointVenteDto.libele} (${infoAdmin.pointVenteDto.code})`,
        utilisateurTraitant: `${infoAdmin.user.firstName} ${infoAdmin.user.lastName} - ${infoAdmin.user.role}`
      } : null
    };
  }
  /**
   * Impression simplifiée (sans ratios détaillés)
   */
  imprimerSimple() {
    this.imprimerBilan({
      includeIndicateurs: false,
      includeSignature: false
    });
  }
  /**
   * Export PDF via impression (workaround)
   */
  exporterPDF() {
    this.messageService.add({
      severity: "info",
      summary: "Export PDF",
      detail: `Utilisez l'option "Enregistrer au format PDF" dans la fen\xEAtre d'impression`
    });
    this.imprimerBilan({
      includeSignature: false,
      includeIndicateurs: true
    });
  }
  /**
   * Génère le HTML pour la prévisualisation
   */
  genererHTMLPreview(data) {
    return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Pr\xE9visualisation - R\xE9sum\xE9 d'Analyse de Cr\xE9dit</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .preview-header { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
                    .preview-actions { text-align: center; margin-bottom: 20px; }
                    .print-btn { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 0 10px; }
                    .close-btn { background: #6c757d; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 0 10px; }
                    .content { border: 1px solid #dee2e6; padding: 20px; border-radius: 5px; }
                </style>
            </head>
            <body>
                <div class="preview-header">
                    <h2>Pr\xE9visualisation du R\xE9sum\xE9 d'Analyse de Cr\xE9dit</h2>
                    <p>V\xE9rifiez le contenu avant impression. Cette pr\xE9visualisation montre le document tel qu'il sera imprim\xE9.</p>
                </div>
                
                <div class="preview-actions">
                    <button class="print-btn" onclick="window.print()">Imprimer</button>
                    <button class="close-btn" onclick="window.close()">Fermer</button>
                </div>
                
                <div class="content">
                    <h1>R\xC9SUM\xC9 D'ANALYSE DE CR\xC9DIT</h1>
                    <p><strong>Montant demand\xE9:</strong> ${data.montantDemande}</p>
                    <p><strong>\xC9valuation:</strong> ${data.evaluationGlobale}</p>
                    <p><strong>Score de risque:</strong> ${data.scoreRisque}/100</p>
                    
                    <h2>PROMOTEUR</h2>
                    ${this.genererTableauPreview(data.promoteur)}
                    
                    <h2>ENTREPRISE</h2>
                    ${this.genererTableauPreview(data.entreprise)}
                    
                    <h2>RECOMMANDATIONS</h2>
                    <ul>
                        ${data.recommandations.map((rec) => `<li>${rec}</li>`).join("")}
                    </ul>
                    
                    <p style="margin-top: 30px; text-align: center; color: #6c757d; font-size: 12px;">
                        Document g\xE9n\xE9r\xE9 le ${(/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR")}
                    </p>
                </div>
            </body>
            </html>
        `;
  }
  /**
   * Génère un tableau HTML simple pour la prévisualisation
   */
  genererTableauPreview(data) {
    if (!data || data.length === 0)
      return "<p>Aucune donn\xE9e disponible</p>";
    return `
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                ${data.map((item) => `
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold; width: 40%;">${item.label}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${item.value}</td>
                    </tr>
                `).join("")}
            </table>
        `;
  }
  /**
   * Méthode utilitaire pour vérifier si l'impression est possible
   */
  peutImprimer() {
    return !!(this.state().resumeCredit && !this.state().loading);
  }
  /**
   * Obtient un résumé des données pour l'impression
   */
  getResumeImpression() {
    if (!this.peutImprimer())
      return "Aucune donn\xE9e disponible";
    const evaluation = this.getEvaluationGlobale();
    const montant = this.formatCurrency(this.getMontantCredit());
    const promoteur = this.state().resumeCredit?.promoteur;
    return `${promoteur?.prenom} ${promoteur?.nom} - ${montant} - ${evaluation}`;
  }
  printMenuModel = [
    {
      label: "Pr\xE9visualiser",
      icon: "pi pi-eye",
      command: () => this.previsualiserImpression()
    },
    {
      label: "Imprimer avec signature",
      icon: "pi pi-file-edit",
      command: () => this.imprimerAvecSignature()
    },
    {
      label: "Version simplifi\xE9e",
      icon: "pi pi-file",
      command: () => this.imprimerSimple()
    },
    {
      separator: true
    },
    {
      label: "Exporter en PDF",
      icon: "pi pi-file-pdf",
      command: () => this.exporterPDF()
    }
  ];
  /**
   * Prépare et lance l'impression du résumé de crédit
   */
  imprimerResumeCredit(options = {}) {
    if (!this.state().resumeCredit) {
      this.messageService.add({
        severity: "warn",
        summary: "Attention",
        detail: "Aucune donn\xE9e disponible pour l'impression"
      });
      return;
    }
    try {
      const donneesImpression = this.preparerDonneesImpressionResume();
      const optionsImpression = __spreadValues({
        includeEvaluation: true,
        includeRatios: this.state().user?.role === "MANAGER" || this.state().user?.role === "DA",
        includeRecommandations: true,
        includeSignature: false,
        title: "R\xE9sum\xE9 d'Analyse de Cr\xE9dit"
      }, options);
      this.resumePrintService.imprimerResumeCredit(donneesImpression, optionsImpression);
      this.messageService.add({
        severity: "success",
        summary: "Impression",
        detail: "Fen\xEAtre d'impression ouverte"
      });
    } catch (error) {
      console.error("Erreur lors de l'impression:", error);
      this.messageService.add({
        severity: "error",
        summary: "Erreur",
        detail: "Impossible de g\xE9n\xE9rer le document d'impression"
      });
    }
  }
  /**
   * Prépare toutes les données nécessaires pour l'impression du résumé
   */
  preparerDonneesImpressionResume() {
    const resume = this.state().resumeCredit;
    const infoAdmin = this.state().infoAdministrative;
    return {
      // Informations générales
      dateImpression: (/* @__PURE__ */ new Date()).toISOString(),
      montantDemande: this.getMontantCredit(),
      evaluation: this.getEvaluationGlobale(),
      scoreRisque: this.getScoreRisque(),
      seuilsRespetes: this.getNbSeuilsRespetes(),
      // Ratios détaillés (seulement si rôle approprié)
      ratios: this.state().user?.role === "MANAGER" || this.state().user?.role === "DA" ? {
        R1: {
          nom: "R1 - Capacit\xE9 de remboursement",
          valeur: this.calculerR1Capacite(),
          statut: this.getStatutR1(),
          formule: "(Cash Flow + Autres revenus) / Traite revenus"
        },
        R2: {
          nom: "R2 - Ratio de solvabilit\xE9",
          valeur: this.calculerR2Solvabilite(),
          statut: this.getStatutR2(),
          formule: "Capitaux propres / Total Actif"
        },
        R3: {
          nom: "R3 - Ratio de liquidit\xE9",
          valeur: this.calculerR3Liquidite(),
          statut: this.getStatutR3(),
          formule: "(Cr\xE9ances + Tr\xE9sorerie) / Dettes court terme"
        },
        R4: {
          nom: "R4 - Ratio d'endettement",
          valeur: this.calculerR4Endettement(),
          statut: this.getStatutR4(),
          formule: "(Dettes totales + Cr\xE9dit) / (Total Actif + Cr\xE9dit)"
        },
        R5: {
          nom: "R5 - Ratio de d\xE9pendance",
          valeur: this.calculerR5Dependance(),
          statut: this.getStatutR5(),
          formule: "Autres revenus / Revenus totaux"
        },
        R6: {
          nom: "R6 - Ratio de couverture",
          valeur: this.calculerR6Couverture(),
          statut: this.getStatutR6(),
          formule: "Valeur de la garantie / Cr\xE9dit"
        }
      } : null,
      // Informations détaillées
      promoteur: this.getPromoteurData(),
      entreprise: this.getEntrepriseData(),
      bilanEntreprise: this.getBilanEntrepriseData(),
      bilanPersonnel: this.getBilanPersonnelData(),
      exploitationActuelle: this.getExploitationActuelleData(),
      exploitationPrevisionnelle: this.getExploitationPrevisionnelleData(),
      chargesActuelles: this.getChargesData("actuelle"),
      chargesPrevisionnelles: this.getChargesData("previsionnelle"),
      demandeCredit: this.getDemandeCreditData().slice(0, 7),
      // Exclure les IDs techniques
      infoAdministratives: this.getDemandeCreditInfosComplementaires(),
      // Personnes caution
      personnesCaution: resume?.personnes_caution || [],
      personnesCautionData: this.getPersonnesCautionData(),
      analyseGarantie: this.getAnalyseGarantiePersonnelle(),
      // Analyse et recommandations
      recommandations: this.getRecommandations(),
      conseilsAmelioration: this.getConseilsAmelioration(),
      analyseRisque: this.getAnalyseRisque(),
      decisionRecommandee: this.getRecommandationDecision(),
      // Métadonnées
      utilisateur: this.state().user,
      informationsAdministratives: infoAdmin ? {
        delegation: infoAdmin.delegationDto?.libele,
        agence: infoAdmin.agenceDto?.libele,
        pointVente: `${infoAdmin.pointVenteDto?.libele} (${infoAdmin.pointVenteDto?.code})`,
        utilisateurTraitant: `${infoAdmin.user?.firstName} ${infoAdmin.user?.lastName} - ${infoAdmin.user?.role}`
      } : null
    };
  }
  /**
   * Impression avec signature (pour validation officielle)
   */
  imprimerAvecSignature() {
    this.imprimerResumeCredit({
      includeSignature: true,
      includeEvaluation: true,
      includeRatios: true,
      includeRecommandations: true
    });
  }
  /**
   * Impression simplifiée (sans ratios détaillés)
   */
  imprimerResumeSimple() {
    this.imprimerResumeCredit({
      includeEvaluation: true,
      includeRatios: false,
      includeRecommandations: true,
      includeSignature: false
    });
  }
  /**
   * Impression des ratios seulement (pour managers/DA)
   */
  imprimerRatiosDetailles() {
    if (this.state().user?.role !== "MANAGER" && this.state().user?.role !== "DA") {
      this.messageService.add({
        severity: "warn",
        summary: "Acc\xE8s restreint",
        detail: "Seuls les managers et DA peuvent imprimer les ratios d\xE9taill\xE9s"
      });
      return;
    }
    this.imprimerResumeCredit({
      includeEvaluation: true,
      includeRatios: true,
      includeRecommandations: false,
      includeSignature: false
    });
  }
  /**
   * Export PDF via impression (workaround)
   */
  exporterResumePDF() {
    this.messageService.add({
      severity: "info",
      summary: "Export PDF",
      detail: `Utilisez l'option "Enregistrer au format PDF" dans la fen\xEAtre d'impression`
    });
    setTimeout(() => {
      this.imprimerResumeCredit({
        includeSignature: false,
        includeEvaluation: true,
        includeRatios: true,
        includeRecommandations: true
      });
    }, 1e3);
  }
  /**
   * Prévisualisation avant impression
   */
  previsualiserImpression() {
    if (!this.state().resumeCredit) {
      this.messageService.add({
        severity: "warn",
        summary: "Attention",
        detail: "Aucune donn\xE9e disponible pour la pr\xE9visualisation"
      });
      return;
    }
    this.imprimerResumeCredit();
  }
  /**
   * Vérifie si l'impression est possible
   */
  peutImprimerResume() {
    return !!(this.state().resumeCredit && !this.state().loading);
  }
  /**
   * Obtient un résumé des données pour l'impression
   */
  getResumeImpressionPourAffichage() {
    if (!this.peutImprimerResume())
      return "Aucune donn\xE9e disponible";
    const evaluation = this.getEvaluationGlobale();
    const montant = this.formatCurrency(this.getMontantCredit());
    const promoteur = this.state().resumeCredit?.promoteur;
    return `${promoteur?.prenom} ${promoteur?.nom} - ${montant} - ${evaluation}`;
  }
  /**
   * Obtient le statut d'impression avec détails
   */
  getStatutImpression() {
    if (!this.state().resumeCredit) {
      return {
        disponible: false,
        message: "Aucune donn\xE9e de r\xE9sum\xE9 disponible"
      };
    }
    if (this.state().loading) {
      return {
        disponible: false,
        message: "Chargement en cours..."
      };
    }
    const resume = this.state().resumeCredit;
    const evaluation = this.getEvaluationGlobale();
    const scoreRisque = this.getScoreRisque();
    return {
      disponible: true,
      message: "Pr\xEAt pour impression",
      details: {
        promoteur: `${resume?.promoteur?.prenom} ${resume?.promoteur?.nom}`,
        entreprise: resume?.entreprise?.nom,
        montantDemande: this.formatCurrency(this.getMontantCredit()),
        evaluation,
        scoreRisque: `${scoreRisque}/100`,
        nbPersonnesCaution: this.getNombrePersonnesCaution(),
        hasInfoAdmin: this.hasInfoAdministrative(),
        canViewRatios: this.state().user?.role === "MANAGER" || this.state().user?.role === "DA"
      }
    };
  }
  /**
   * Impression avec options personnalisées via dialog
   */
  ouvrirDialogOptionsImpression() {
    if (!this.peutImprimerResume()) {
      this.messageService.add({
        severity: "warn",
        summary: "Attention",
        detail: "Aucune donn\xE9e disponible pour l'impression"
      });
      return;
    }
    this.messageService.add({
      severity: "info",
      summary: "Options d'impression",
      detail: "Fonctionnalit\xE9 \xE0 d\xE9velopper: dialog d'options d'impression"
    });
  }
  /**
   * Validation des données avant impression
   */
  validerDonneesAvantImpression() {
    if (!this.state().resumeCredit) {
      this.messageService.add({
        severity: "error",
        summary: "Donn\xE9es manquantes",
        detail: "Aucun r\xE9sum\xE9 de cr\xE9dit disponible"
      });
      return false;
    }
    if (!this.state().resumeCredit?.promoteur) {
      this.messageService.add({
        severity: "warn",
        summary: "Donn\xE9es incompl\xE8tes",
        detail: "Informations du promoteur manquantes"
      });
      return false;
    }
    if (!this.getMontantCredit() || this.getMontantCredit() === 0) {
      this.messageService.add({
        severity: "warn",
        summary: "Donn\xE9es incompl\xE8tes",
        detail: "Montant du cr\xE9dit non d\xE9fini"
      });
      return false;
    }
    return true;
  }
  /**
   * Impression avec validation complète
   */
  imprimerAvecValidation(options = {}) {
    if (!this.validerDonneesAvantImpression()) {
      return;
    }
    this.imprimerResumeCredit(options);
  }
  /**
   * Obtient les options d'impression disponibles selon le rôle
   */
  getOptionsImpressionDisponibles() {
    const baseOptions = [
      {
        label: "Impression standard",
        icon: "pi pi-print",
        command: () => this.imprimerResumeCredit()
      },
      {
        label: "Version simplifi\xE9e",
        icon: "pi pi-file",
        command: () => this.imprimerResumeSimple()
      },
      {
        separator: true
      },
      {
        label: "Exporter en PDF",
        icon: "pi pi-file-pdf",
        command: () => this.exporterResumePDF()
      }
    ];
    if (this.state().user?.role === "MANAGER" || this.state().user?.role === "DA") {
      baseOptions.splice(-2, 0, {
        label: "Avec signature",
        icon: "pi pi-file-edit",
        command: () => this.imprimerAvecSignature()
      });
      baseOptions.splice(-2, 0, {
        label: "Ratios d\xE9taill\xE9s",
        icon: "pi pi-chart-bar",
        command: () => this.imprimerRatiosDetailles()
      });
    }
    return baseOptions;
  }
  // ========================================
  // NOUVELLES MÉTHODES POUR VISUALISATION DURÉE
  // ========================================
  /**
   * Retourne la durée en mois du crédit
   */
  getDureeMois() {
    return this.state().resumeCredit?.demande_credit?.duree_mois || 0;
  }
  /**
   * Retourne la durée formatée en années et mois
   */
  getDureeEnAnneesResume() {
    const mois = this.getDureeMois();
    if (mois === 0)
      return "0 mois";
    if (mois < 12)
      return `${mois} mois`;
    const annees = Math.floor(mois / 12);
    const moisRestants = mois % 12;
    if (moisRestants === 0) {
      return annees === 1 ? "1 an" : `${annees} ans`;
    }
    return `${annees} an${annees > 1 ? "s" : ""} et ${moisRestants} mois`;
  }
  /**
   * Retourne la sévérité du tag selon la durée
   */
  getDureeSeverityResume() {
    const mois = this.getDureeMois();
    if (mois <= 12)
      return "success";
    if (mois <= 36)
      return "info";
    if (mois <= 60)
      return "warn";
    return "danger";
  }
  /**
   * Retourne la liste des années du crédit avec le nombre de mois par année
   */
  getAnneesCredit() {
    const totalMois = this.getDureeMois();
    if (totalMois === 0)
      return [];
    const annees = [];
    let moisRestants = totalMois;
    let numeroAnnee = 1;
    while (moisRestants > 0) {
      const moisCetteAnnee = Math.min(12, moisRestants);
      annees.push({
        numero: numeroAnnee,
        mois: moisCetteAnnee
      });
      moisRestants -= moisCetteAnnee;
      numeroAnnee++;
    }
    return annees;
  }
  /**
   * Retourne les mois d'une année donnée avec leur état
   */
  getMoisAnnee(numeroAnnee) {
    const nomsDesMois = ["Jan", "F\xE9v", "Mar", "Avr", "Mai", "Jun", "Jul", "Ao\xFB", "Sep", "Oct", "Nov", "D\xE9c"];
    const totalMois = this.getDureeMois();
    const moisDebutAnnee = (numeroAnnee - 1) * 12;
    return nomsDesMois.map((nom, index) => {
      const numeroGlobal = moisDebutAnnee + index + 1;
      return {
        index,
        nom,
        actif: numeroGlobal <= totalMois,
        numeroGlobal
      };
    });
  }
  /**
   * Retourne la classe CSS pour la couleur de l'année
   */
  getAnneeColorClass(numeroAnnee) {
    if (numeroAnnee === 1)
      return "text-green-700";
    if (numeroAnnee === 2)
      return "text-blue-700";
    return "text-orange-700";
  }
  /**
   * Retourne les segments de la barre de progression
   */
  getProgressSegments() {
    const annees = this.getAnneesCredit();
    const totalMois = this.getDureeMois();
    if (totalMois === 0)
      return [];
    return annees.map((annee) => ({
      annee: annee.numero,
      mois: annee.mois,
      pourcentage: annee.mois / totalMois * 100,
      couleur: annee.numero === 1 ? "green" : annee.numero === 2 ? "blue" : "orange"
    }));
  }
  /**
   * Retourne les données pour le tableau de calcul des mensualités
   */
  getCalculMensualiteData() {
    const montant = this.getMontantCredit();
    const duree = this.getDureeMois();
    const mensualite = this.calculerMensualite();
    const totalRemboursement = mensualite * duree;
    return [
      { label: "Montant emprunt\xE9", value: this.formatCurrency(montant) },
      { label: "Dur\xE9e du cr\xE9dit", value: `${duree} mois (${this.getDureeEnAnneesResume()})` },
      { label: "Mensualit\xE9", value: this.formatCurrency(mensualite) },
      { label: "Nombre de paiements", value: `${duree} mensualit\xE9s` },
      { label: "Total \xE0 rembourser", value: this.formatCurrency(totalRemboursement), isTotal: true }
    ];
  }
  static \u0275fac = function ResumeCreditComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ResumeCreditComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ResumeCreditComponent, selectors: [["app-resume-credit"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 24, vars: 9, consts: [[1, "container-fluid"], [1, "grid"], [1, "col-12"], [1, "flex", "flex-wrap", "gap-2", "items-center", "justify-between", "mb-4"], [1, "text-2xl", "font-bold", "text-900", "m-0"], [1, "text-600", "m-0", "mt-1"], [1, "text-500", "mt-1", "block"], [1, "flex", "gap-2", "flex-wrap"], [1, "print-buttons-group", "flex", "gap-2", "mr-3"], [1, "print-disabled-info", "mr-3"], ["label", "Retour", "icon", "pi pi-arrow-left", "outlined", "", 3, "onClick"], [1, "grid", "mb-3"], [1, "grid", "mb-4"], ["label", "Imprimer", "icon", "pi pi-print", "pTooltip", "Imprimer le r\xE9sum\xE9 complet", "tooltipPosition", "bottom", 3, "onClick"], ["label", "Options", "icon", "pi pi-download", "severity", "secondary", "size", "small", 3, "onClick", "model"], ["label", "Impression non disponible", "icon", "pi pi-print", "disabled", "", "severity", "secondary", "size", "small", "pTooltip", "Chargez d'abord les donn\xE9es pour pouvoir imprimer", "tooltipPosition", "bottom"], [1, "print-info-banner", "p-2", "bg-blue-50", "border-round", "border-1", "border-blue-200"], [1, "flex", "align-items-center", "justify-content-between", "text-sm"], [1, "flex", "align-items-center", "gap-2"], [1, "pi", "pi-info-circle", "text-blue-600"], [1, "text-blue-800"], [1, "flex", "gap-2"], ["label", "Aper\xE7u", "icon", "pi pi-eye", "size", "small", "outlined", "", 3, "onClick"], ["label", "Imprimer", "icon", "pi pi-print", "size", "small", 3, "onClick"], ["pTemplate", "header"], [1, "col-12", "md:col-6"], [1, "text-blue-700", "mb-3"], [1, "recommendation-list"], [1, "flex", "align-items-start", "mb-2"], [1, "text-orange-700", "mb-3"], [1, "risk-analysis"], [1, "mb-3"], [1, "flex", "justify-content-between", "align-items-center", "mb-2"], [1, "text-sm", "font-semibold"], [1, "text-lg", "font-bold"], [3, "value"], [1, "facteurs-risque"], [1, "text-600", "font-semibold", "mb-1", "block"], [1, "text-xs", "text-700", "mb-1"], [1, "mt-3"], [1, "text-green-700", "mb-3"], [1, "text-purple-700", "mb-3"], [1, "decision-recommendation", "p-3", "border-round", 3, "ngClass"], [1, "font-bold", "text-purple-800"], [1, "font-semibold", 3, "value", "severity"], [1, "text-sm", "text-700", "mb-3"], [1, "conditions"], [1, "flex", "align-items-center", "gap-2", "p-3"], [1, "pi", "pi-lightbulb", "text-yellow-600"], [1, "m-0"], [1, "text-sm", "text-700"], [1, "conseil-item", "p-2", "bg-green-50", "border-round", "mb-2"], [1, "text-green-800"], [1, "font-semibold", "text-purple-700", "block", "mb-1"], [1, "text-xs", "text-600", "mb-1"], [1, "text-xl", "font-semibold", "text-900", "mb-3"], [1, "pi", "pi-chart-bar", "mr-2", "text-blue-600"], [1, "col-12", "md:col-6", "lg:col-4"], [1, "indicator-card-simple"], [1, "indicator-header"], [1, "flex", "align-items-center", "mb-2"], [1, "pi", "pi-credit-card", "text-blue-600", "text-2xl", "mr-3"], [1, "m-0", "text-blue-800"], [1, "text-blue-600"], [1, "indicator-value", "text-3xl", "font-bold", "text-900", "mb-2"], [1, "indicator-details"], [1, "text-sm", "text-600", "mb-1"], [1, "col-12", "lg:col-12", "separator-container"], [1, "indicator-separator"], [1, "pi", "pi-shield", "text-green-600", "text-2xl", "mr-3"], [1, "m-0", "text-green-800"], [1, "text-green-600"], [1, "pi", "pi-chart-line", "text-orange-600", "text-2xl", "mr-3"], [1, "m-0", "text-orange-800"], [1, "text-orange-600"], [1, "pi", "pi-exclamation-triangle", "text-red-600", "text-2xl", "mr-3"], [1, "m-0", "text-red-800"], [1, "text-red-600"], [1, "pi", "pi-chart-pie", "text-purple-600", "text-2xl", "mr-3"], [1, "m-0", "text-purple-800"], [1, "text-purple-600"], [1, "pi", "pi-wallet", "text-indigo-600", "text-2xl", "mr-3"], [1, "m-0", "text-indigo-800"], [1, "text-indigo-600"], [1, "seuils-card-large"], [1, "seuils-content", "p-4"], [1, "col-12", "lg:col-6"], [1, "seuils-section", "text-center"], [1, "text-green-700", "mb-4", "text-xl", "font-bold"], [1, "seuils-list", "bg-green-50", "p-4", "border-round"], [1, "text-base", "text-700", "list-none", "p-0", "m-0"], [1, "mb-3", "p-2", "bg-white", "border-round", "shadow-1"], [1, "text-green-700", "font-semibold", "ml-2"], [1, "evaluation-section", "text-center"], [1, "text-blue-700", "mb-4", "text-xl", "font-bold"], [1, "evaluation-box", "p-5", "bg-blue-50", "border-round", "border-2", "border-blue-200"], [1, "evaluation-main", "mb-4"], [1, "text-5xl", "font-bold", "mb-2"], [1, "text-lg", "text-600", "font-medium"], [1, "progress-section", "mb-4"], [1, "text-sm", "text-600", "mb-2", "font-medium"], [1, "text-sm", "text-600", "mt-1", "font-medium"], [1, "status-indicator"], [1, "text-4xl", 3, "ngClass"], [1, "col-12", "mt-4"], [1, "recapitulatif-centre", "text-center", "p-4", "bg-gray-50", "border-round"], [1, "text-gray-700", "mb-3", "text-lg", "font-bold"], [1, "flex", "justify-content-center", "align-items-center", "gap-4", "flex-wrap"], [1, "metric-item"], [1, "text-2xl", "font-bold", "text-blue-600"], [1, "text-600"], [1, "metric-separator"], [1, "text-2xl", "font-bold", "text-orange-600"], [1, "text-2xl", "font-bold"], [1, "flex", "align-items-center", "justify-content-center", "gap-3", "p-4"], [1, "pi", "pi-info-circle", "text-blue-600", "text-3xl"], [1, "m-0", "text-2xl", "font-bold", "text-center"], [1, "flex", "justify-center", "items-center", "p-8"], [1, "text-center", "p-4"], [1, "pi", "pi-exclamation-triangle", "text-6xl", "text-red-500", "mb-3"], ["label", "R\xE9essayer", "icon", "pi pi-refresh", 3, "onClick"], ["styleClass", "p-datatable-sm", 3, "value", "tableStyle"], ["pTemplate", "body"], [1, "col-12", "lg:col-8"], [1, "col-12", "lg:col-4"], [1, "text-lg", "font-semibold", "mb-3"], [1, "text-red-700", "mb-3"], [1, "pi", "pi-info-circle", "mr-2"], [1, "pi", "pi-building", "mr-2"], ["title", "Donn\xE9es compl\xE8tes charg\xE9es", 1, "pi", "pi-check-circle", "text-green-500", "ml-2"], ["title", "Chargement en cours...", 1, "pi", "pi-spin", "pi-spinner", "text-blue-500", "ml-2"], ["title", "Donn\xE9es partielles", 1, "pi", "pi-exclamation-triangle", "text-orange-500", "ml-2"], [1, "loading-admin", "p-3", "bg-blue-50", "border-round", "text-center"], [1, "mt-3", "p-2", "bg-blue-50", "border-round", "border-1", "border-blue-200"], [1, "mt-4"], [1, "pi", "pi-chart-bar", "mr-2"], [1, "bg-green-50", "p-3", "border-round"], [1, "grid", "gap-2", "text-sm"], [1, "col-12", "flex", "justify-content-between", "align-items-center"], [1, "text-600", "font-medium"], [1, "font-bold", "text-green-800"], [1, "col-12", "flex", "justify-content-between", "align-items-center", "border-top-1", "border-green-200", "pt-2"], [1, "font-bold", "text-green-700"], ["class", "grid mb-4", 4, "ngIf"], [1, "flex", "justify-content-between", "align-items-center", "gap-3", "p-4", "bg-gray-50", "border-round"], [1, "print-actions-group", "flex", "gap-2"], [1, "additional-actions"], [1, "col-12", "md:col-6", "lg:col-3"], [1, "h-full"], [1, "flex", "items-center", "gap-3"], [1, "p-3", "rounded-full", 3, "ngClass"], [3, "ngClass"], [1, "flex-1"], [1, "text-600", "text-sm", "m-0"], [1, "text-900", "text-xl", "font-semibold", "m-0"], [3, "value", "severity"], [1, "flex", "items-center", "gap-2", "p-3"], [1, "pi", "pi-user", "text-blue-600"], [1, "font-semibold", "text-600"], [1, "pi", "pi-building", "text-green-600"], [1, "pi", "pi-users", "text-teal-600"], [1, "pi", "pi-exclamation-triangle", "text-4xl", "text-orange-500", "mb-3"], [1, "text-orange-600", "mb-2"], [1, "text-600", "mb-3"], ["value", "ATTENTION : Risque de garantie insuffisant", "severity", "warn"], [1, "text-teal-700", "mb-3"], [1, "pi", "pi-list", "mr-2"], [1, "font-semibold", "text-600", 3, "ngClass"], [1, "garantie-analysis-card"], [1, "pi", "pi-shield", "mr-2"], [1, "analysis-content", "p-3", "bg-teal-50", "border-round"], [1, "score-section", "mb-3"], [1, "text-sm", "font-semibold", "text-teal-800"], [1, "text-lg", "font-bold", "text-teal-700"], [3, "value", "ngClass"], [1, "description-section", "mb-3"], [1, "text-teal-700", "font-semibold", "block", "mb-1"], [1, "text-sm", "text-teal-800", "m-0"], [1, "recommendations-section"], [1, "text-teal-700", "font-semibold", "block", "mb-2"], [1, "recommendation-item", "mb-1", "p-2", "bg-white", "border-round", "shadow-1"], [1, "mt-3", "p-2", "bg-white", "border-round", "border-1", "border-teal-200"], [1, "text-xs", "text-teal-600", "mb-1"], [1, "text-teal-800"], [1, "pi", "pi-chart-bar", "text-orange-600"], [1, "pi", "pi-wallet", "text-purple-600"], [1, "pi", "pi-calendar", "text-blue-600"], [1, "pi", "pi-chart-line", "text-green-600"], [1, "pi", "pi-credit-card", "text-red-600"], ["strokeWidth", "4", 3, "style"], ["strokeWidth", "4"], [1, "text-sm", "text-blue-600", "mt-2", "mb-0"], [1, "text-700"], ["title", "Information compl\xE8te", 1, "pi", "pi-check", "text-green-500", "ml-1", "text-xs"], [1, "text-blue-700", "font-semibold", "block", "mb-1"], [1, "text-sm", "text-blue-800"], [1, "text-green-600", "italic"], [1, "flex", "flex-wrap", "gap-2", "mb-3"], ["label", "Tester Info Administrative", "icon", "pi pi-building", "outlined", "", 3, "onClick"], ["label", "Recharger Info Admin", "icon", "pi pi-refresh", "outlined", "", 3, "onClick", "disabled"], [1, "debug-status", "p-3", "bg-gray-100", "border-round", "mb-3"], [1, "text-gray-700", "mb-2"], [1, "grid", "text-sm"], [1, "col-12", "md:col-4"], [1, "debug-data", "p-3", "bg-green-50", "border-round"], [1, "debug-data", "p-3", "bg-orange-50", "border-round"], [1, "pi", "pi-bug", "text-red-600"], [1, "text-green-700", "mb-2"], [1, "col-12", "md:col-3"], [1, "text-orange-700", "mb-2"], [1, "text-sm", "text-orange-800", "m-0"], ["label", "Aper\xE7u avant impression", "icon", "pi pi-eye", "outlined", "", "size", "small", 3, "onClick"], ["label", "Imprimer le bilan", "icon", "pi pi-print", 3, "onClick"], [1, "text-center", "p-8"], [1, "pi", "pi-info-circle", "text-6xl", "text-blue-500", "mb-3"], [1, "text-500"]], template: function ResumeCreditComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div")(5, "h2", 4);
      \u0275\u0275text(6, "R\xE9sum\xE9 d'Analyse de Cr\xE9dit");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "p", 5);
      \u0275\u0275text(8, "Analyse compl\xE8te de la demande de cr\xE9dit");
      \u0275\u0275elementEnd();
      \u0275\u0275template(9, ResumeCreditComponent_Conditional_9_Template, 2, 1, "small", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "div", 7);
      \u0275\u0275template(11, ResumeCreditComponent_Conditional_11_Template, 3, 4, "div", 8)(12, ResumeCreditComponent_Conditional_12_Template, 2, 0, "div", 9);
      \u0275\u0275elementStart(13, "p-button", 10);
      \u0275\u0275listener("onClick", function ResumeCreditComponent_Template_p_button_onClick_13_listener() {
        return ctx.retourListe();
      });
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275template(14, ResumeCreditComponent_Conditional_14_Template, 11, 1, "div", 11)(15, ResumeCreditComponent_Conditional_15_Template, 48, 14, "div", 12)(16, ResumeCreditComponent_Conditional_16_Template, 0, 0)(17, ResumeCreditComponent_Conditional_17_Template, 207, 50)(18, ResumeCreditComponent_Conditional_18_Template, 0, 0)(19, ResumeCreditComponent_Conditional_19_Template, 4, 0, "div", 1)(20, ResumeCreditComponent_Conditional_20_Template, 10, 1, "div", 1)(21, ResumeCreditComponent_Conditional_21_Template, 109, 40)(22, ResumeCreditComponent_Conditional_22_Template, 10, 0, "div", 1);
      \u0275\u0275elementEnd();
      \u0275\u0275element(23, "p-toast");
    }
    if (rf & 2) {
      let tmp_3_0;
      let tmp_4_0;
      \u0275\u0275advance(9);
      \u0275\u0275conditional(ctx.peutImprimer() ? 9 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.peutImprimer() ? 11 : 12);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.peutImprimer() ? 14 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(((tmp_3_0 = ctx.state().user) == null ? null : tmp_3_0.role) === "MANAGER" || ((tmp_3_0 = ctx.state().user) == null ? null : tmp_3_0.role) === "DA" ? 15 : 16);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(((tmp_4_0 = ctx.state().user) == null ? null : tmp_4_0.role) === "MANAGER" || ((tmp_4_0 = ctx.state().user) == null ? null : tmp_4_0.role) === "DA" ? 17 : 18);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.state().loading ? 19 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.state().error && !ctx.state().loading ? 20 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.state().resumeCredit && !ctx.state().loading ? 21 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.state().resumeCredit && !ctx.state().loading && !ctx.state().error ? 22 : -1);
    }
  }, dependencies: [CommonModule, NgClass, NgIf, CardModule, Card, PrimeTemplate, PanelModule, TableModule, Table, TagModule, Tag, ButtonModule, Button, ProgressSpinnerModule, ProgressSpinner, ToastModule, Toast, BadgeModule, Badge, DividerModule, Divider, SkeletonModule, ProgressBarModule, ProgressBar, TooltipModule, Tooltip, AccordionModule, SplitButtonModule, SplitButton], styles: ['@charset "UTF-8";\n\n\n\n.recommendation-list[_ngcontent-%COMP%] {\n  max-height: 300px;\n  overflow-y: auto;\n}\n.risk-analysis[_ngcontent-%COMP%]   .p-progressbar[_ngcontent-%COMP%] {\n  border-radius: 10px;\n}\n.progress-excellent[_ngcontent-%COMP%]   .p-progressbar-value[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      90deg,\n      #27ae60,\n      #2ecc71);\n}\n.progress-bon[_ngcontent-%COMP%]   .p-progressbar-value[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      90deg,\n      #3498db,\n      #5dade2);\n}\n.progress-acceptable[_ngcontent-%COMP%]   .p-progressbar-value[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      90deg,\n      #f39c12,\n      #e67e22);\n}\n.progress-risque[_ngcontent-%COMP%]   .p-progressbar-value[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      90deg,\n      #e74c3c,\n      #ec7063);\n}\n.conseil-item[_ngcontent-%COMP%] {\n  transition: all 0.3s ease;\n}\n.conseil-item[_ngcontent-%COMP%]:hover {\n  transform: translateX(5px);\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n}\n.decision-recommendation[_ngcontent-%COMP%] {\n  border-left: 4px solid #8e44ad;\n}\n.bg-accorder-50[_ngcontent-%COMP%] {\n  background-color: rgba(39, 174, 96, 0.1);\n  border-left-color: #27ae60;\n}\n.bg-accorder-avec-conditions-50[_ngcontent-%COMP%] {\n  background-color: rgba(52, 152, 219, 0.1);\n  border-left-color: #3498db;\n}\n.bg-etude-approfondie-50[_ngcontent-%COMP%] {\n  background-color: rgba(243, 156, 18, 0.1);\n  border-left-color: #f39c12;\n}\n.bg-refuser-50[_ngcontent-%COMP%] {\n  background-color: rgba(231, 76, 60, 0.1);\n  border-left-color: #e74c3c;\n}\n.indicator-card-simple[_ngcontent-%COMP%] {\n  background: white;\n  border: 1px solid #e9ecef;\n  border-radius: 12px;\n  padding: 1.5rem;\n  height: 100%;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n  transition: all 0.3s ease;\n  position: relative;\n}\n.indicator-card-simple[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n}\n.indicator-header[_ngcontent-%COMP%]   h5[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  line-height: 1.2;\n}\n.indicator-header[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  font-style: italic;\n}\n.indicator-value[_ngcontent-%COMP%] {\n  color: #2c3e50;\n}\n.indicator-details[_ngcontent-%COMP%] {\n  border-top: 1px solid #e9ecef;\n  padding-top: 1rem;\n  margin-top: 1rem;\n}\n.separator-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin: 1rem 0;\n}\n.indicator-separator[_ngcontent-%COMP%] {\n  width: 80%;\n  height: 2px;\n  background:\n    linear-gradient(\n      90deg,\n      transparent 0%,\n      #3498db 20%,\n      #2ecc71 40%,\n      #f39c12 60%,\n      #e74c3c 80%,\n      transparent 100%);\n  border-radius: 2px;\n  position: relative;\n  opacity: 0.7;\n}\n.indicator-separator[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  width: 12px;\n  height: 12px;\n  background: #fff;\n  border: 2px solid #3498db;\n  border-radius: 50%;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n}\n.separator-with-text[_ngcontent-%COMP%] {\n  position: relative;\n  text-align: center;\n  margin: 1.5rem 0;\n}\n.separator-with-text[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: 50%;\n  left: 0;\n  right: 0;\n  height: 1px;\n  background:\n    linear-gradient(\n      90deg,\n      transparent,\n      #dee2e6,\n      transparent);\n}\n.separator-with-text[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  background: white;\n  padding: 0 1rem;\n  color: #6c757d;\n  font-size: 0.8rem;\n  font-weight: 500;\n}\n@media (max-width: 992px) {\n  .separator-container[_ngcontent-%COMP%] {\n    margin: 0.5rem 0;\n  }\n  .indicator-separator[_ngcontent-%COMP%] {\n    width: 60%;\n    height: 1px;\n  }\n  .indicator-separator[_ngcontent-%COMP%]::before {\n    width: 8px;\n    height: 8px;\n  }\n}\n@media (max-width: 768px) {\n  .indicator-card-simple[_ngcontent-%COMP%] {\n    padding: 1rem;\n    margin-bottom: 1.5rem;\n  }\n  .indicator-value[_ngcontent-%COMP%] {\n    font-size: 2rem !important;\n  }\n  .indicator-header[_ngcontent-%COMP%]   h5[_ngcontent-%COMP%] {\n    font-size: 0.9rem;\n  }\n  .indicator-header[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n    font-size: 0.7rem;\n  }\n  .separator-container[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n.dotted-separator[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 1px;\n  background:\n    repeating-linear-gradient(\n      90deg,\n      #3498db 0px,\n      #3498db 4px,\n      transparent 4px,\n      transparent 8px);\n}\n.shadow-separator[_ngcontent-%COMP%] {\n  width: 80%;\n  height: 1px;\n  background: #e9ecef;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);\n  border-radius: 1px;\n}\n.seuils-card-large[_ngcontent-%COMP%] {\n  max-width: 1200px;\n  margin: 0 auto;\n}\n.seuils-content[_ngcontent-%COMP%] {\n  padding: 2rem;\n}\n.seuils-section[_ngcontent-%COMP%], \n.evaluation-section[_ngcontent-%COMP%] {\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n}\n.seuils-list[_ngcontent-%COMP%] {\n  flex: 1;\n  border-left: 4px solid #27ae60;\n}\n.seuils-list[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  transition: all 0.3s ease;\n}\n.seuils-list[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:hover {\n  transform: translateX(5px);\n  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\n}\n.evaluation-box[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  min-height: 350px;\n}\n.evaluation-main[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.progress-section[_ngcontent-%COMP%] {\n  margin: 1.5rem 0;\n}\n.progress-excellent[_ngcontent-%COMP%]   .p-progressbar-value[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      90deg,\n      #27ae60,\n      #2ecc71);\n}\n.progress-bon[_ngcontent-%COMP%]   .p-progressbar-value[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      90deg,\n      #3498db,\n      #5dade2);\n}\n.progress-acceptable[_ngcontent-%COMP%]   .p-progressbar-value[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      90deg,\n      #f39c12,\n      #e67e22);\n}\n.progress-risque[_ngcontent-%COMP%]   .p-progressbar-value[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      90deg,\n      #e74c3c,\n      #ec7063);\n}\n.status-indicator[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n}\n.recapitulatif-centre[_ngcontent-%COMP%] {\n  border: 2px dashed #dee2e6;\n  background:\n    linear-gradient(\n      135deg,\n      #f8f9fa 0%,\n      #e9ecef 100%);\n}\n.metric-item[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 0.5rem;\n}\n.metric-separator[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  color: #dee2e6;\n  font-weight: bold;\n}\n@media (max-width: 992px) {\n  .seuils-content[_ngcontent-%COMP%] {\n    padding: 1.5rem;\n  }\n  .evaluation-box[_ngcontent-%COMP%] {\n    min-height: 300px;\n    margin-top: 2rem;\n  }\n  .text-5xl[_ngcontent-%COMP%] {\n    font-size: 3rem !important;\n  }\n}\n@media (max-width: 768px) {\n  .seuils-content[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .text-2xl[_ngcontent-%COMP%] {\n    font-size: 1.5rem !important;\n  }\n  .text-5xl[_ngcontent-%COMP%] {\n    font-size: 2.5rem !important;\n  }\n  .evaluation-box[_ngcontent-%COMP%] {\n    min-height: 250px;\n    padding: 1rem !important;\n  }\n  .metric-item[_ngcontent-%COMP%] {\n    margin: 0.5rem 0;\n  }\n  .metric-separator[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .flex-wrap[_ngcontent-%COMP%]   .metric-item[_ngcontent-%COMP%] {\n    flex: 1;\n    min-width: 80px;\n  }\n}\n.seuils-list[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%], \n.evaluation-box[_ngcontent-%COMP%], \n.metric-item[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_fadeInUp 0.6s ease forwards;\n}\n.seuils-list[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-child(1) {\n  animation-delay: 0.1s;\n}\n.seuils-list[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-child(2) {\n  animation-delay: 0.2s;\n}\n.seuils-list[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-child(3) {\n  animation-delay: 0.3s;\n}\n.seuils-list[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-child(4) {\n  animation-delay: 0.4s;\n}\n.seuils-list[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-child(5) {\n  animation-delay: 0.5s;\n}\n.seuils-list[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-child(6) {\n  animation-delay: 0.6s;\n}\n@keyframes _ngcontent-%COMP%_fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.loading-admin[_ngcontent-%COMP%] {\n  border-left: 4px solid var(--blue-500);\n  transition: all 0.3s ease;\n}\n.loading-admin[_ngcontent-%COMP%]:hover {\n  background: var(--blue-100) !important;\n}\n.stat-card[_ngcontent-%COMP%] {\n  transition: all 0.3s ease;\n  border: 1px solid transparent;\n  cursor: pointer;\n}\n.stat-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);\n  border-color: var(--primary-color);\n}\n.stat-card[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  transition: all 0.3s ease;\n}\n.stat-card[_ngcontent-%COMP%]:hover   i[_ngcontent-%COMP%] {\n  transform: scale(1.1);\n}\n.stat-card[_ngcontent-%COMP%]   .info-badge[_ngcontent-%COMP%] {\n  z-index: 10;\n}\n.stat-card[_ngcontent-%COMP%]   .info-badge[_ngcontent-%COMP%]   .pi-info-circle[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\n.stat-card[_ngcontent-%COMP%]   .info-badge[_ngcontent-%COMP%]   .pi-info-circle[_ngcontent-%COMP%]:hover {\n  transform: scale(1.2);\n  color: var(--primary-color) !important;\n}\n.details-card[_ngcontent-%COMP%] {\n  border-left: 3px solid transparent;\n  transition: all 0.3s ease;\n}\n.details-card[_ngcontent-%COMP%]:hover {\n  border-left-color: var(--primary-color);\n  transform: translateX(4px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n}\n.details-card[_ngcontent-%COMP%]   .detail-item[_ngcontent-%COMP%] {\n  padding: 0.25rem 0;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.05);\n}\n.details-card[_ngcontent-%COMP%]   .detail-item[_ngcontent-%COMP%]:last-child {\n  border-bottom: none;\n}\n.details-card[_ngcontent-%COMP%]   .detail-item[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  font-size: 0.875rem;\n}\n  .p-accordion .p-accordion-header {\n  background: var(--surface-100);\n  border: 1px solid var(--surface-border);\n  border-radius: 6px;\n  margin-bottom: 0.5rem;\n}\n  .p-accordion .p-accordion-header:hover {\n  background: var(--surface-200);\n}\n  .p-accordion .p-accordion-header .p-accordion-header-link {\n  padding: 0.75rem 1rem;\n  font-weight: 600;\n  color: var(--text-color);\n}\n  .p-accordion .p-accordion-header .p-accordion-header-link:focus {\n  box-shadow: 0 0 0 2px var(--primary-color-alpha);\n}\n  .p-accordion .p-accordion-content {\n  border: none;\n  background: transparent;\n  padding: 1rem 0;\n}\n.status-badge.available[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      45deg,\n      var(--green-100),\n      var(--green-200));\n  border: 1px solid var(--green-300);\n  color: var(--green-800);\n}\n.status-badge.loading[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      45deg,\n      var(--blue-100),\n      var(--blue-200));\n  border: 1px solid var(--blue-300);\n  color: var(--blue-800);\n}\n.status-badge.unavailable[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      45deg,\n      var(--orange-100),\n      var(--orange-200));\n  border: 1px solid var(--orange-300);\n  color: var(--orange-800);\n}\n.loading-shimmer[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      90deg,\n      #f0f0f0 25%,\n      #e0e0e0 50%,\n      #f0f0f0 75%);\n  background-size: 200% 100%;\n  animation: _ngcontent-%COMP%_shimmer 1.5s infinite;\n}\n@keyframes _ngcontent-%COMP%_shimmer {\n  0% {\n    background-position: -200% 0;\n  }\n  100% {\n    background-position: 200% 0;\n  }\n}\n  .p-tooltip .p-tooltip-text {\n  background: var(--surface-900);\n  color: var(--surface-0);\n  padding: 0.5rem 0.75rem;\n  border-radius: 6px;\n  font-size: 0.875rem;\n  max-width: 250px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n}\n  .p-tooltip .p-tooltip-arrow {\n  border-top-color: var(--surface-900);\n}\n.data-complete-indicator[_ngcontent-%COMP%] {\n  position: relative;\n}\n.data-complete-indicator[_ngcontent-%COMP%]::after {\n  content: "\\2713";\n  position: absolute;\n  top: -5px;\n  right: -5px;\n  background: var(--green-500);\n  color: white;\n  border-radius: 50%;\n  width: 16px;\n  height: 16px;\n  font-size: 10px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: bold;\n}\n.section-with-loading[_ngcontent-%COMP%] {\n  position: relative;\n}\n.section-with-loading.loading[_ngcontent-%COMP%] {\n  opacity: 0.7;\n  pointer-events: none;\n}\n.section-with-loading.loading[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(255, 255, 255, 0.8);\n  z-index: 10;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.data-missing-alert[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      45deg,\n      var(--yellow-50),\n      var(--yellow-100));\n  border-left: 4px solid var(--yellow-500);\n  padding: 0.75rem;\n  border-radius: 6px;\n  margin: 0.5rem 0;\n}\n.data-missing-alert[_ngcontent-%COMP%]   .alert-icon[_ngcontent-%COMP%] {\n  color: var(--yellow-600);\n  margin-right: 0.5rem;\n}\n.data-missing-alert[_ngcontent-%COMP%]   .alert-text[_ngcontent-%COMP%] {\n  color: var(--yellow-800);\n  font-size: 0.875rem;\n}\n.reload-button[_ngcontent-%COMP%]:hover {\n  transform: rotate(180deg);\n  transition: transform 0.3s ease;\n}\n.hierarchy-display[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      var(--blue-50),\n      var(--blue-100));\n  border: 1px solid var(--blue-200);\n  border-radius: 8px;\n  padding: 0.75rem;\n  position: relative;\n  overflow: hidden;\n}\n.hierarchy-display[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 4px;\n  height: 100%;\n  background:\n    linear-gradient(\n      180deg,\n      var(--blue-400),\n      var(--blue-600));\n}\n.hierarchy-display[_ngcontent-%COMP%]   .hierarchy-text[_ngcontent-%COMP%] {\n  margin-left: 0.5rem;\n  font-weight: 500;\n  color: var(--blue-800);\n}\n  .p-skeleton.custom-skeleton {\n  background:\n    linear-gradient(\n      90deg,\n      var(--surface-200) 25%,\n      var(--surface-100) 50%,\n      var(--surface-200) 75%);\n  background-size: 200% 100%;\n  animation: _ngcontent-%COMP%_skeleton-loading 1.5s infinite;\n}\n@keyframes _ngcontent-%COMP%_skeleton-loading {\n  0% {\n    background-position: -200% 0;\n  }\n  100% {\n    background-position: 200% 0;\n  }\n}\n@media (max-width: 768px) {\n  .stat-card[_ngcontent-%COMP%] {\n    margin-bottom: 1rem;\n  }\n  .stat-card[_ngcontent-%COMP%]:hover {\n    transform: none;\n  }\n  .details-card[_ngcontent-%COMP%] {\n    margin-bottom: 1rem;\n  }\n  .details-card[_ngcontent-%COMP%]   .detail-item[_ngcontent-%COMP%] {\n    padding: 0.5rem 0;\n  }\n  .details-card[_ngcontent-%COMP%]   .detail-item[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n    display: block;\n    margin-bottom: 0.25rem;\n  }\n  .hierarchy-display[_ngcontent-%COMP%] {\n    margin-bottom: 1rem;\n  }\n  .hierarchy-display[_ngcontent-%COMP%]   .hierarchy-text[_ngcontent-%COMP%] {\n    font-size: 0.875rem;\n    line-height: 1.4;\n  }\n}\n@media (max-width: 576px) {\n  .info-badge[_ngcontent-%COMP%] {\n    display: none;\n  }\n    .p-accordion .p-accordion-header .p-accordion-header-link {\n    padding: 0.5rem;\n    font-size: 0.875rem;\n  }\n  .details-card[_ngcontent-%COMP%] {\n    padding: 0.75rem !important;\n  }\n}\n.fade-in[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_fadeIn 0.5s ease-in;\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.success-indicator[_ngcontent-%COMP%] {\n  color: var(--green-600);\n  animation: _ngcontent-%COMP%_successPulse 0.5s ease-in;\n}\n.error-indicator[_ngcontent-%COMP%] {\n  color: var(--red-600);\n  animation: _ngcontent-%COMP%_errorShake 0.5s ease-in;\n}\n@keyframes _ngcontent-%COMP%_successPulse {\n  0% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(1.1);\n  }\n  100% {\n    transform: scale(1);\n  }\n}\n@keyframes _ngcontent-%COMP%_errorShake {\n  0%, 100% {\n    transform: translateX(0);\n  }\n  25% {\n    transform: translateX(-5px);\n  }\n  75% {\n    transform: translateX(5px);\n  }\n}\n.duration-visualization-card[_ngcontent-%COMP%] {\n  overflow: hidden;\n}\n.duration-visualization-card[_ngcontent-%COMP%]     .p-card-header {\n  background:\n    linear-gradient(\n      135deg,\n      var(--surface-ground) 0%,\n      var(--surface-100) 100%);\n  border-bottom: 1px solid var(--surface-border);\n}\n.duration-stat-card[_ngcontent-%COMP%] {\n  transition: all 0.3s ease;\n}\n.duration-stat-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);\n}\n.bg-gradient-primary[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      var(--primary-500) 0%,\n      var(--primary-700) 100%);\n}\n.bg-gradient-success[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      var(--green-500) 0%,\n      var(--green-700) 100%);\n}\n.bg-gradient-info[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      var(--blue-500) 0%,\n      var(--blue-700) 100%);\n}\n.duration-timeline-section[_ngcontent-%COMP%] {\n  border-left: 4px solid var(--primary-color);\n}\n.months-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(12, 1fr);\n  gap: 0.25rem;\n}\n.month-cell[_ngcontent-%COMP%] {\n  border: 1px solid transparent;\n  transition: all 0.2s ease;\n  min-height: 50px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n}\n.month-cell[_ngcontent-%COMP%]:hover {\n  transform: scale(1.05);\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n  z-index: 1;\n}\n.text-xxs[_ngcontent-%COMP%] {\n  font-size: 0.65rem;\n}\n.duration-progress-bar[_ngcontent-%COMP%] {\n  height: 24px;\n  background: var(--surface-200);\n  border-radius: 12px;\n  overflow: hidden;\n  position: relative;\n}\n.progress-track[_ngcontent-%COMP%] {\n  display: flex;\n  height: 100%;\n  width: 100%;\n}\n.progress-segment[_ngcontent-%COMP%] {\n  height: 100%;\n  transition: all 0.3s ease;\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.progress-segment[_ngcontent-%COMP%]:hover {\n  filter: brightness(1.1);\n}\n.progress-segment[_ngcontent-%COMP%]:first-child {\n  border-radius: 12px 0 0 12px;\n}\n.progress-segment[_ngcontent-%COMP%]:last-child {\n  border-radius: 0 12px 12px 0;\n}\n.progress-segment[_ngcontent-%COMP%]:only-child {\n  border-radius: 12px;\n}\n.repartition-item[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\n.repartition-item[_ngcontent-%COMP%]:hover {\n  transform: translateX(4px);\n  background: var(--surface-100) !important;\n}\n.repartition-dot[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n}\n.year-section[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_slideInUp 0.4s ease forwards;\n  opacity: 0;\n}\n.year-section[_ngcontent-%COMP%]:nth-child(1) {\n  animation-delay: 0.1s;\n}\n.year-section[_ngcontent-%COMP%]:nth-child(2) {\n  animation-delay: 0.2s;\n}\n.year-section[_ngcontent-%COMP%]:nth-child(3) {\n  animation-delay: 0.3s;\n}\n.year-section[_ngcontent-%COMP%]:nth-child(4) {\n  animation-delay: 0.4s;\n}\n.year-section[_ngcontent-%COMP%]:nth-child(5) {\n  animation-delay: 0.5s;\n}\n@keyframes _ngcontent-%COMP%_slideInUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@media (max-width: 992px) {\n  .months-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(6, 1fr);\n  }\n  .duration-stat-card[_ngcontent-%COMP%] {\n    margin-bottom: 1rem;\n  }\n  .duration-stat-card[_ngcontent-%COMP%]   .text-4xl[_ngcontent-%COMP%] {\n    font-size: 1.75rem !important;\n  }\n  .duration-legend-item[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n@media (max-width: 768px) {\n  .months-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(4, 1fr);\n  }\n  .month-cell[_ngcontent-%COMP%] {\n    min-height: 40px;\n    padding: 0.25rem !important;\n  }\n  .month-cell[_ngcontent-%COMP%]   .font-bold[_ngcontent-%COMP%] {\n    font-size: 0.7rem;\n  }\n  .month-cell[_ngcontent-%COMP%]   .text-xxs[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .duration-stat-card[_ngcontent-%COMP%] {\n    padding: 1rem !important;\n  }\n  .duration-stat-card[_ngcontent-%COMP%]   .text-4xl[_ngcontent-%COMP%] {\n    font-size: 1.5rem !important;\n  }\n  .duration-stat-card[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n    font-size: 1.5rem !important;\n  }\n  .duration-progress-bar[_ngcontent-%COMP%] {\n    height: 16px;\n  }\n}\n@media (max-width: 576px) {\n  .months-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(3, 1fr);\n  }\n  .year-section[_ngcontent-%COMP%] {\n    padding: 0.5rem !important;\n  }\n  .duration-stat-card[_ngcontent-%COMP%]   .text-4xl[_ngcontent-%COMP%] {\n    font-size: 1.25rem !important;\n  }\n}\n/*# sourceMappingURL=resume-credit.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ResumeCreditComponent, { className: "ResumeCreditComponent", filePath: "src/app/pages/dashboard/analyse-credit/resume-credit/resume-credit.component.ts", lineNumber: 56 });
})();
export {
  ResumeCreditComponent
};
//# sourceMappingURL=chunk-SJMKEUST.js.map
