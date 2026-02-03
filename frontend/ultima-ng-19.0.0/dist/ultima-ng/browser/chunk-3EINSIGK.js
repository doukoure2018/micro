import {
  FieldsetModule
} from "./chunk-NFUGNMSZ.js";
import {
  SplitButton,
  SplitButtonModule
} from "./chunk-L4DY2TIW.js";
import "./chunk-GEHWKAXI.js";
import {
  ConfirmDialog
} from "./chunk-JQ4E7TJM.js";
import {
  TextareaModule
} from "./chunk-RW4OSSQT.js";
import {
  MessageModule
} from "./chunk-CSEZIGTY.js";
import {
  DialogModule
} from "./chunk-LPU4RT7P.js";
import "./chunk-WWXP2HWK.js";
import "./chunk-CXW3XKZ2.js";
import {
  Toast,
  ToastModule
} from "./chunk-6SRYYUT2.js";
import {
  ProgressBarModule
} from "./chunk-WQ2EPPBK.js";
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
import {
  InputNumber,
  InputNumberModule
} from "./chunk-JGOABXTK.js";
import "./chunk-HY2A3TN6.js";
import "./chunk-YEN5RMZS.js";
import "./chunk-XS7IVZ5T.js";
import "./chunk-CUABQE42.js";
import {
  DropdownModule
} from "./chunk-ZCIQCP6V.js";
import "./chunk-V6CKOH3G.js";
import "./chunk-DBPX6ILC.js";
import "./chunk-WIQZFAVH.js";
import "./chunk-CCBQFN2J.js";
import {
  ActivatedRoute,
  Router,
  RouterLink
} from "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
import {
  takeUntilDestroyed
} from "./chunk-WRLBQDQK.js";
import "./chunk-KHEKFKWA.js";
import {
  InputTextModule
} from "./chunk-FZELBHWZ.js";
import {
  Tooltip,
  TooltipModule
} from "./chunk-4IUQ6KTI.js";
import "./chunk-IVSL2HKS.js";
import "./chunk-E352KRZV.js";
import "./chunk-HHD4PK4J.js";
import {
  BadgeModule,
  Button,
  ButtonDirective,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import "./chunk-AP3OAIHW.js";
import {
  ConfirmationService,
  MessageService,
  PrimeTemplate
} from "./chunk-NQNBRQ7H.js";
import {
  FormBuilder,
  FormsModule,
  NgControlStatus,
  NgModel,
  ReactiveFormsModule,
  Validators
} from "./chunk-3HTR5OU7.js";
import {
  UserService
} from "./chunk-SQ5BRWVW.js";
import "./chunk-ZRELZ6R7.js";
import "./chunk-BMYIFZHZ.js";
import "./chunk-W3K3GK4Z.js";
import {
  CommonModule,
  DecimalPipe,
  NgClass,
  NgIf
} from "./chunk-SQQPVFHK.js";
import {
  BehaviorSubject,
  ChangeDetectorRef,
  DestroyRef,
  NgZone,
  computed,
  debounceTime,
  distinctUntilChanged,
  inject,
  map,
  signal,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵpureFunction2,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate5
} from "./chunk-ZKKMBKIA.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/interface/categorie-decaissement.ts
var CATEGORIES_DECAISSEMENT = [
  { code: "ACHAT_MARCHANDISES", libelle: "Achat marchandises", ordre: 1 },
  { code: "MAIN_OEUVRE", libelle: "Co\xFBt de main d'\u0153uvre", ordre: 2 },
  { code: "INVESTISSEMENT", libelle: "Investissement", ordre: 3 },
  { code: "IMPOTS_TAXES", libelle: "Imp\xF4ts et taxes", ordre: 4 },
  { code: "LOYER", libelle: "Loyers", ordre: 5 },
  { code: "UTILITIES", libelle: "Eau, \xC9lectricit\xE9, t\xE9l\xE9phone", ordre: 6 },
  { code: "TRANSPORT", libelle: "Transport", ordre: 7 },
  { code: "SALAIRES", libelle: "Salaire personnel", ordre: 8 },
  { code: "FRAIS_TELEPHONE", libelle: "Frais de t\xE9l\xE9phone", ordre: 9 },
  { code: "CHARGES_FINANCIERES", libelle: "Charges Financi\xE8res", ordre: 10 },
  { code: "ENTRETIEN", libelle: "Entretien et r\xE9paration", ordre: 11 },
  { code: "AUTRES_DEPENSES", libelle: "Autres d\xE9penses", ordre: 12 }
];

// src/app/service/tresorerie-state.service.ts
var TresorerieStateService = class _TresorerieStateService {
  previsions = /* @__PURE__ */ new Map();
  currentMonthSubject = new BehaviorSubject(0);
  previsionsChangedSubject = new BehaviorSubject(void 0);
  savedMonthsSubject = new BehaviorSubject(/* @__PURE__ */ new Set());
  // Observables publics
  currentMonth$ = this.currentMonthSubject.asObservable().pipe(distinctUntilChanged());
  previsions$ = this.previsionsChangedSubject.asObservable().pipe(map(() => this.previsions));
  savedMonths$ = this.savedMonthsSubject.asObservable();
  // Getters
  get currentMonth() {
    return this.currentMonthSubject.value;
  }
  get savedMonths() {
    return this.savedMonthsSubject.value;
  }
  // Navigation
  setCurrentMonth(month) {
    if (month >= 0 && month <= 12) {
      this.currentMonthSubject.next(month);
    }
  }
  // Gestion des prévisions
  getPrevision(month) {
    return this.previsions.get(month);
  }
  updatePrevision(month, data, saved = false, hasData = true) {
    const existingPrevision = this.previsions.get(month);
    this.previsions.set(month, {
      numeroMois: month,
      data: __spreadValues({}, data),
      // Clone pour éviter les mutations
      saved,
      dirty: !saved,
      hasData,
      lastUpdated: /* @__PURE__ */ new Date()
    });
    const savedMonths = new Set(this.savedMonthsSubject.value);
    if (saved) {
      savedMonths.add(month);
    } else if (!hasData) {
      savedMonths.delete(month);
    }
    this.savedMonthsSubject.next(savedMonths);
    this.previsionsChangedSubject.next(void 0);
  }
  markAsSaved(month) {
    const prevision = this.previsions.get(month);
    if (prevision) {
      this.previsions.set(month, __spreadProps(__spreadValues({}, prevision), {
        saved: true,
        dirty: false
      }));
      const savedMonths = new Set(this.savedMonthsSubject.value);
      savedMonths.add(month);
      this.savedMonthsSubject.next(savedMonths);
      this.previsionsChangedSubject.next(void 0);
    }
  }
  markAsDirty(month) {
    const prevision = this.previsions.get(month);
    if (prevision) {
      this.previsions.set(month, __spreadProps(__spreadValues({}, prevision), {
        dirty: true
      }));
      this.previsionsChangedSubject.next(void 0);
    }
  }
  // Utilitaires
  hasUnsavedChanges() {
    return Array.from(this.previsions.values()).some((p) => p.dirty);
  }
  getMonthsWithData() {
    return Array.from(this.previsions.entries()).filter(([_, prevision]) => prevision.hasData).map(([month, _]) => month);
  }
  getSavedMonths() {
    return Array.from(this.previsions.entries()).filter(([_, prevision]) => prevision.saved).map(([month, _]) => month);
  }
  getUnsavedMonths() {
    return Array.from(this.previsions.entries()).filter(([_, prevision]) => prevision.hasData && !prevision.saved).map(([month, _]) => month);
  }
  clearMonth(month) {
    this.previsions.delete(month);
    const savedMonths = new Set(this.savedMonthsSubject.value);
    savedMonths.delete(month);
    this.savedMonthsSubject.next(savedMonths);
    this.previsionsChangedSubject.next(void 0);
  }
  clearAll() {
    this.previsions.clear();
    this.savedMonthsSubject.next(/* @__PURE__ */ new Set());
    this.previsionsChangedSubject.next(void 0);
  }
  // Méthode pour charger toutes les prévisions d'un coup (après chargement depuis le backend)
  loadAllPrevisions(previsions) {
    this.previsions.clear();
    const savedMonths = /* @__PURE__ */ new Set();
    previsions.forEach((prevision) => {
      this.previsions.set(prevision.numeroMois, {
        numeroMois: prevision.numeroMois,
        data: prevision.data,
        saved: true,
        dirty: false,
        hasData: true,
        lastUpdated: /* @__PURE__ */ new Date()
      });
      savedMonths.add(prevision.numeroMois);
    });
    this.savedMonthsSubject.next(savedMonths);
    this.previsionsChangedSubject.next(void 0);
  }
  // Méthode pour obtenir toutes les prévisions pour sauvegarde
  getAllPrevisionsForSave() {
    return Array.from(this.previsions.entries()).filter(([_, prevision]) => prevision.hasData).map(([month, prevision]) => ({
      numeroMois: month,
      data: prevision.data
    }));
  }
  // Méthode pour vérifier si un mois a des données
  monthHasData(month) {
    const prevision = this.previsions.get(month);
    return prevision?.hasData || false;
  }
  // Méthode pour obtenir le statut d'un mois
  getMonthStatus(month) {
    const prevision = this.previsions.get(month);
    if (!prevision || !prevision.hasData) {
      return "empty";
    }
    if (prevision.saved) {
      return "saved";
    }
    return "filled";
  }
  static \u0275fac = function TresorerieStateService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TresorerieStateService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _TresorerieStateService, factory: _TresorerieStateService.\u0275fac, providedIn: "root" });
};

// src/app/service/TresoreriePrintService.ts
var TresoreriePrintService = class _TresoreriePrintService {
  /**
   * Imprime le tableau de prévision de trésorerie
   * @param tresorerieForm - Le formulaire de trésorerie
   * @param creditParams - Les paramètres du crédit (inclut la durée)
   * @param demandeIndividuel - Les informations du demandeur (optionnel)
   */
  imprimerTableauTresorerie(tresorerieForm, creditParams, demandeIndividuel) {
    const printWindow = window.open("", "_blank", "width=1400,height=900");
    if (!printWindow) {
      console.error("Impossible d'ouvrir la fen\xEAtre d'impression");
      return;
    }
    const nombreMois = demandeIndividuel?.dureeDemande || creditParams?.duree || 12;
    const htmlContent = this.genererHTMLTableau(tresorerieForm, creditParams, demandeIndividuel, nombreMois);
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
   * Génère le HTML complet pour l'impression
   */
  genererHTMLTableau(tresorerieForm, creditParams, demandeIndividuel, nombreMois) {
    const styles = this.getTableauStyles(nombreMois);
    const content = this.genererContenuTableau(tresorerieForm, creditParams, demandeIndividuel, nombreMois);
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Pr\xE9vision de Tr\xE9sorerie</title>
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
  genererContenuTableau(tresorerieForm, creditParams, demandeIndividuel, nombreMois) {
    const dateImpression = (/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    const donneesMois = this.extraireDonneesMois(tresorerieForm, nombreMois);
    const totauxAnnuels = this.calculerTotauxAnnuels(donneesMois);
    return `
      <div class="print-container">
        <!-- En-t\xEAte -->
        <div class="header">
          <h1>PR\xC9VISION DE TR\xC9SORERIE</h1>
          <div class="header-info">
            <div class="header-left">
              ${demandeIndividuel ? `
                <p><strong>Demandeur:</strong> ${demandeIndividuel.prenom} ${demandeIndividuel.nom}</p>
                <p><strong>Demande N\xB0:</strong> ${demandeIndividuel.id || "N/A"}</p>
              ` : `
                <p><strong>Client:</strong> ${creditParams.clientNom || "N/A"}</p>
              `}
              <p><strong>Montant du cr\xE9dit:</strong> ${this.formatCurrency(creditParams.montantCredit)}</p>
            </div>
            <div class="header-right">
              <p><strong>Dur\xE9e:</strong> ${nombreMois} mois</p>
              <p><strong>Taux:</strong> ${creditParams.tauxInteret}% annuel</p>
              <p><strong>Date d'impression:</strong> ${dateImpression}</p>
            </div>
          </div>
        </div>

        <!-- Tableau principal -->
        <div class="table-container">
          ${this.genererTableauPrincipal(donneesMois, totauxAnnuels, nombreMois)}
        </div>

        <!-- Analyses et indicateurs -->
        <div class="analysis-section">
          ${this.genererAnalyseFinanciere(donneesMois, totauxAnnuels, creditParams, nombreMois)}
        </div>

        <!-- Pied de page -->
        <div class="footer">
          <div class="footer-left">
            <p>Document g\xE9n\xE9r\xE9 automatiquement le ${dateImpression}</p>
          </div>
          <div class="footer-right">
            <p>Page 1/1</p>
          </div>
        </div>
      </div>
    `;
  }
  /**
   * Génère le tableau principal avec tous les mois (dynamique)
   */
  genererTableauPrincipal(donneesMois, totauxAnnuels, nombreMois) {
    const moisLabels = Array.from({ length: nombreMois + 1 }, (_, i) => i === 0 ? "M0" : `M${i}`);
    const nombreColonnes = nombreMois + 3;
    return `
      <table class="main-table">
        <thead>
          <tr>
            <th class="category-header">\xC9L\xC9MENTS</th>
            ${moisLabels.map((label, index) => `<th class="month-header ${index === 0 ? "month-start" : ""}">${label}</th>`).join("")}
            <th class="total-header">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          <!-- SOLDE D\xC9BUT -->
          <tr class="solde-row">
            <td class="category-cell"><strong>SOLDE D\xC9BUT</strong></td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.soldeDebut)}</td>`).join("")}
            <td class="total-cell">-</td>
          </tr>

          <!-- ENCAISSEMENTS -->
          <tr class="section-header">
            <td class="section-title" colspan="${nombreColonnes}"><strong>ENCAISSEMENTS</strong></td>
          </tr>
          
          <tr>
            <td class="category-cell">Ventes</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.ventes)}</td>`).join("")}
            <td class="total-cell total-revenue">${this.formatNumber(totauxAnnuels.ventes)}</td>
          </tr>
          
          <tr>
            <td class="category-cell">Autres revenus</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.autresRevenus)}</td>`).join("")}
            <td class="total-cell total-revenue">${this.formatNumber(totauxAnnuels.autresRevenus)}</td>
          </tr>
          
          <tr>
            <td class="category-cell">Pr\xEAt re\xE7u</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.pret)}</td>`).join("")}
            <td class="total-cell total-revenue">${this.formatNumber(totauxAnnuels.pret)}</td>
          </tr>
          
          <tr class="subtotal-row">
            <td class="category-cell"><strong>TOTAL ENCAISSEMENTS</strong></td>
            ${donneesMois.map((mois) => `<td class="amount-cell total-revenue"><strong>${this.formatNumber(mois.totalEncaissements)}</strong></td>`).join("")}
            <td class="total-cell total-revenue"><strong>${this.formatNumber(totauxAnnuels.totalEncaissements)}</strong></td>
          </tr>

          <!-- D\xC9CAISSEMENTS -->
          <tr class="section-header">
            <td class="section-title" colspan="${nombreColonnes}"><strong>D\xC9CAISSEMENTS</strong></td>
          </tr>
          
          <tr>
            <td class="category-cell">Achat marchandises</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.achatmarchandises)}</td>`).join("")}
            <td class="total-cell total-expense">${this.formatNumber(totauxAnnuels.achatmarchandises)}</td>
          </tr>
          
          <tr>
            <td class="category-cell">Main d'\u0153uvre</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.mainoeuvre)}</td>`).join("")}
            <td class="total-cell total-expense">${this.formatNumber(totauxAnnuels.mainoeuvre)}</td>
          </tr>
          
          <tr>
            <td class="category-cell">Investissement</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.investissement)}</td>`).join("")}
            <td class="total-cell total-expense">${this.formatNumber(totauxAnnuels.investissement)}</td>
          </tr>
          
          <tr>
            <td class="category-cell">Imp\xF4ts et taxes</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.impotstaxes)}</td>`).join("")}
            <td class="total-cell total-expense">${this.formatNumber(totauxAnnuels.impotstaxes)}</td>
          </tr>
          
          <tr>
            <td class="category-cell">Loyers</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.loyer)}</td>`).join("")}
            <td class="total-cell total-expense">${this.formatNumber(totauxAnnuels.loyer)}</td>
          </tr>
          
          <tr>
            <td class="category-cell">Eau, \xC9lectricit\xE9</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.utilities)}</td>`).join("")}
            <td class="total-cell total-expense">${this.formatNumber(totauxAnnuels.utilities)}</td>
          </tr>
          
          <tr>
            <td class="category-cell">Transport</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.transport)}</td>`).join("")}
            <td class="total-cell total-expense">${this.formatNumber(totauxAnnuels.transport)}</td>
          </tr>
          
          <tr>
            <td class="category-cell">Salaires</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.salaires)}</td>`).join("")}
            <td class="total-cell total-expense">${this.formatNumber(totauxAnnuels.salaires)}</td>
          </tr>
          
          <tr>
            <td class="category-cell">Frais t\xE9l\xE9phone</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.fraistelephone)}</td>`).join("")}
            <td class="total-cell total-expense">${this.formatNumber(totauxAnnuels.fraistelephone)}</td>
          </tr>
          
          <tr>
            <td class="category-cell">Charges financi\xE8res</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.chargesfinancieres)}</td>`).join("")}
            <td class="total-cell total-expense">${this.formatNumber(totauxAnnuels.chargesfinancieres)}</td>
          </tr>
          
          <tr>
            <td class="category-cell">Entretien</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.entretien)}</td>`).join("")}
            <td class="total-cell total-expense">${this.formatNumber(totauxAnnuels.entretien)}</td>
          </tr>
          
          <tr>
            <td class="category-cell">Autres d\xE9penses</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.autresdepenses)}</td>`).join("")}
            <td class="total-cell total-expense">${this.formatNumber(totauxAnnuels.autresdepenses)}</td>
          </tr>

          <!-- REMBOURSEMENTS -->
          <tr class="section-header">
            <td class="section-title" colspan="${nombreColonnes}"><strong>REMBOURSEMENTS CR\xC9DIT</strong></td>
          </tr>
          
          <tr>
            <td class="category-cell">Int\xE9r\xEAts \xE0 verser</td>
            ${donneesMois.map((mois) => `<td class="amount-cell remboursement">${this.formatNumber(mois.interetsAVerser)}</td>`).join("")}
            <td class="total-cell total-remboursement">${this.formatNumber(totauxAnnuels.interetsAVerser)}</td>
          </tr>
          
          <tr>
            <td class="category-cell">Remboursement capital</td>
            ${donneesMois.map((mois) => `<td class="amount-cell remboursement">${this.formatNumber(mois.remboursementCapital)}</td>`).join("")}
            <td class="total-cell total-remboursement">${this.formatNumber(totauxAnnuels.remboursementCapital)}</td>
          </tr>
          
          <tr class="subtotal-row">
            <td class="category-cell"><strong>TOTAL D\xC9CAISSEMENTS</strong></td>
            ${donneesMois.map((mois) => `<td class="amount-cell total-expense"><strong>${this.formatNumber(mois.totalDecaissements)}</strong></td>`).join("")}
            <td class="total-cell total-expense"><strong>${this.formatNumber(totauxAnnuels.totalDecaissements)}</strong></td>
          </tr>

          <!-- R\xC9SULTATS -->
          <tr class="section-header">
            <td class="section-title" colspan="${nombreColonnes}"><strong>R\xC9SULTATS</strong></td>
          </tr>
          
          <tr>
            <td class="category-cell">Disponible en caisse</td>
            ${donneesMois.map((mois) => `<td class="amount-cell">${this.formatNumber(mois.disponibleEnCaisse)}</td>`).join("")}
            <td class="total-cell">-</td>
          </tr>
          
          <tr class="result-row">
            <td class="category-cell"><strong>EXC\xC9DENT (D\xC9FICIT)</strong></td>
            ${donneesMois.map((mois) => `<td class="amount-cell ${mois.excedentDeficit >= 0 ? "positive" : "negative"}"><strong>${this.formatNumber(mois.excedentDeficit)}</strong></td>`).join("")}
            <td class="total-cell ${totauxAnnuels.excedentDeficit >= 0 ? "positive" : "negative"}"><strong>${this.formatNumber(totauxAnnuels.excedentDeficit)}</strong></td>
          </tr>
          
          <tr class="solde-row final-row">
            <td class="category-cell"><strong>SOLDE FIN</strong></td>
            ${donneesMois.map((mois) => `<td class="amount-cell ${mois.soldeFin >= 0 ? "positive" : "negative"}"><strong>${this.formatNumber(mois.soldeFin)}</strong></td>`).join("")}
            <td class="total-cell">-</td>
          </tr>
        </tbody>
      </table>
    `;
  }
  /**
   * Génère la section d'analyse financière (avec durée dynamique)
   */
  genererAnalyseFinanciere(donneesMois, totauxAnnuels, creditParams, nombreMois) {
    const cashFlowMoyen = totauxAnnuels.excedentDeficit / nombreMois;
    const remboursementMensuelMoyen = (totauxAnnuels.interetsAVerser + totauxAnnuels.remboursementCapital) / nombreMois;
    const ratioRemboursement = totauxAnnuels.totalEncaissements > 0 ? (totauxAnnuels.interetsAVerser + totauxAnnuels.remboursementCapital) / totauxAnnuels.totalEncaissements * 100 : 0;
    const moisDeficitaires = donneesMois.map((mois, index) => ({ mois: index, deficit: mois.excedentDeficit })).filter((item) => item.deficit < 0);
    const soldeFinal = donneesMois[donneesMois.length - 1]?.soldeFin || 0;
    return `
      <div class="analysis-grid">
        <div class="analysis-block">
          <h3>\u{1F4CA} INDICATEURS CL\xC9S (${nombreMois} mois)</h3>
          <div class="indicators">
            <div class="indicator">
              <span class="indicator-label">Cash Flow moyen mensuel:</span>
              <span class="indicator-value ${cashFlowMoyen >= 0 ? "positive" : "negative"}">${this.formatCurrency(cashFlowMoyen)}</span>
            </div>
            <div class="indicator">
              <span class="indicator-label">Remboursement mensuel moyen:</span>
              <span class="indicator-value">${this.formatCurrency(remboursementMensuelMoyen)}</span>
            </div>
            <div class="indicator">
              <span class="indicator-label">Ratio remboursement/revenus:</span>
              <span class="indicator-value ${ratioRemboursement <= 30 ? "positive" : ratioRemboursement <= 50 ? "warning" : "negative"}">${ratioRemboursement.toFixed(1)}%</span>
            </div>
            <div class="indicator">
              <span class="indicator-label">Solde final (Mois ${nombreMois}):</span>
              <span class="indicator-value ${soldeFinal >= 0 ? "positive" : "negative"}">${this.formatCurrency(soldeFinal)}</span>
            </div>
          </div>
        </div>

        <div class="analysis-block">
          <h3>\u26A0\uFE0F POINTS D'ATTENTION</h3>
          <div class="alerts">
            ${moisDeficitaires.length > 0 ? `
              <div class="alert alert-danger">
                <strong>Mois d\xE9ficitaires identifi\xE9s (${moisDeficitaires.length}/${nombreMois}):</strong>
                ${moisDeficitaires.map((item) => `M${item.mois} (${this.formatCurrency(item.deficit)})`).join(", ")}
              </div>
            ` : `
              <div class="alert alert-success">
                <strong>\u2713 Aucun d\xE9ficit mensuel identifi\xE9 sur les ${nombreMois} mois</strong>
              </div>
            `}
            
            ${ratioRemboursement > 50 ? `
              <div class="alert alert-warning">
                <strong>Ratio de remboursement \xE9lev\xE9 (${ratioRemboursement.toFixed(1)}%)</strong> - Risque de tension de tr\xE9sorerie
              </div>
            ` : ""}
            
            ${cashFlowMoyen < 0 ? `
              <div class="alert alert-danger">
                <strong>Cash Flow moyen n\xE9gatif</strong> - Viabilit\xE9 \xE0 long terme questionn\xE9e
              </div>
            ` : ""}

            ${soldeFinal < 0 ? `
              <div class="alert alert-danger">
                <strong>Solde final n\xE9gatif</strong> - Insuffisance de tr\xE9sorerie en fin de p\xE9riode
              </div>
            ` : ""}
          </div>
        </div>

        <div class="analysis-block">
          <h3>\u{1F4B0} SYNTH\xC8SE FINANCI\xC8RE (${nombreMois} mois)</h3>
          <div class="synthesis">
            <p><strong>Total revenus sur la p\xE9riode:</strong> ${this.formatCurrency(totauxAnnuels.totalEncaissements)}</p>
            <p><strong>Total charges sur la p\xE9riode:</strong> ${this.formatCurrency(totauxAnnuels.totalDecaissements)}</p>
            <p><strong>R\xE9sultat net sur la p\xE9riode:</strong> 
              <span class="${totauxAnnuels.excedentDeficit >= 0 ? "positive" : "negative"}">
                ${this.formatCurrency(totauxAnnuels.excedentDeficit)}
              </span>
            </p>
            <p><strong>Total remboursements:</strong> ${this.formatCurrency(totauxAnnuels.interetsAVerser + totauxAnnuels.remboursementCapital)}</p>
            <p><strong>Capacit\xE9 de remboursement:</strong> 
              <span class="${cashFlowMoyen >= remboursementMensuelMoyen ? "positive" : "negative"}">
                ${cashFlowMoyen >= remboursementMensuelMoyen ? "Suffisante" : "Insuffisante"}
              </span>
            </p>
          </div>
        </div>
      </div>
    `;
  }
  /**
   * Extrait les données de tous les mois du formulaire (dynamique)
   */
  extraireDonneesMois(tresorerieForm, nombreMois) {
    const donneesMois = [];
    for (let mois = 0; mois <= nombreMois; mois++) {
      const moisData = tresorerieForm.get(`mois${mois}`)?.getRawValue() || {};
      donneesMois.push({
        numeroMois: mois,
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
   * Calcule les totaux sur tous les mois
   */
  calculerTotauxAnnuels(donneesMois) {
    const totaux = {};
    const champs = [
      "ventes",
      "autresRevenus",
      "pret",
      "achatmarchandises",
      "mainoeuvre",
      "investissement",
      "impotstaxes",
      "loyer",
      "utilities",
      "transport",
      "salaires",
      "fraistelephone",
      "chargesfinancieres",
      "entretien",
      "autresdepenses",
      "interetsAVerser",
      "remboursementCapital",
      "totalEncaissements",
      "totalDecaissements",
      "excedentDeficit"
    ];
    champs.forEach((champ) => {
      totaux[champ] = donneesMois.reduce((sum, mois) => sum + (mois[champ] || 0), 0);
    });
    return totaux;
  }
  /**
   * Formate un montant en devises
   */
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
  /**
   * Formate un nombre
   */
  formatNumber(value) {
    if (value === null || value === void 0 || value === 0)
      return "-";
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }
  /**
   * Retourne les styles CSS pour l'impression (adaptés au nombre de mois)
   */
  getTableauStyles(nombreMois) {
    const isLongDuration = nombreMois > 12;
    const columnWidth = isLongDuration ? "40px" : "55px";
    const fontSize = isLongDuration ? "6px" : "7px";
    const headerFontSize = isLongDuration ? "6px" : "8px";
    const pageOrientation = nombreMois > 18 ? "A3 landscape" : "A4 landscape";
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
        max-width: ${nombreMois > 18 ? "420mm" : "297mm"};
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
        font-size: ${fontSize};
        table-layout: fixed;
      }

      .main-table th,
      .main-table td {
        border: 1px solid #333;
        padding: 2px 1px;
        text-align: center;
        vertical-align: middle;
      }

      .category-header {
        background: #2c3e50;
        color: white;
        font-weight: bold;
        width: ${isLongDuration ? "100px" : "120px"};
        font-size: 9px;
      }

      .month-header {
        background: #34495e;
        color: white;
        font-weight: bold;
        width: ${columnWidth};
        font-size: ${headerFontSize};
        ${isLongDuration ? "writing-mode: vertical-rl; text-orientation: mixed;" : ""}
      }

      .month-start {
        background: #1a5276;
      }

      .total-header {
        background: #2c3e50;
        color: white;
        font-weight: bold;
        width: ${isLongDuration ? "60px" : "80px"};
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
        font-size: ${isLongDuration ? "7px" : "8px"};
      }

      .amount-cell {
        text-align: right;
        padding-right: 2px;
        font-size: ${fontSize};
      }

      .total-cell {
        background: #ecf0f1;
        text-align: right;
        padding-right: 2px;
        font-weight: bold;
        font-size: ${isLongDuration ? "7px" : "8px"};
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
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
        size: ${pageOrientation};
      }
    `;
  }
  static \u0275fac = function TresoreriePrintService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TresoreriePrintService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _TresoreriePrintService, factory: _TresoreriePrintService.\u0275fac, providedIn: "root" });
};

// src/app/pages/dashboard/credit/individuel/attente/detail/analyse-flux-tresorerie/analyse-flux-tresorerie.component.ts
var _c0 = (a0, a1) => ({ "bg-green-50 border-green-200": a0, "bg-red-50 border-red-200": a1 });
var _c1 = (a0, a1) => ({ "text-green-600": a0, "text-red-600": a1 });
var _c2 = (a0) => ["/dashboards/credit/individuel/attente/detail", a0];
var _c3 = (a0, a1) => ({ "text-red-500": a0, "text-green-600": a1 });
var _c4 = () => ({ showDelay: 300 });
var _c5 = () => ({ showDelay: 300, hideDelay: 0 });
var _forTrack0 = ($index, $item) => $item.id;
function AnalyseFluxTresorerieComponent_p_card_3_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19)(1, "h2");
    \u0275\u0275element(2, "i", 20);
    \u0275\u0275text(3, " Informations du Demandeur ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "p-tag", 21);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275property("value", "Demande N\xB0" + ctx_r0.demandeIndividuelId);
  }
}
function AnalyseFluxTresorerieComponent_p_card_3_div_59_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th");
    \u0275\u0275text(2, "Type");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th");
    \u0275\u0275text(4, "Description");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th", 25);
    \u0275\u0275text(6, "Valeur garantie");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 26);
    \u0275\u0275text(8, "Couverture");
    \u0275\u0275elementEnd()();
  }
}
function AnalyseFluxTresorerieComponent_p_card_3_div_59_ng_template_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 25);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 26);
    \u0275\u0275element(8, "p-tag", 27);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const garantie_r2 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(garantie_r2.typeGarantie);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(garantie_r2.descriptionGarantie);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.formatMontant(garantie_r2.valeurGarantie));
    \u0275\u0275advance(2);
    \u0275\u0275property("value", (garantie_r2.valeurGarantie / ctx_r0.demandeIndividuel().montantDemande * 100).toFixed(0) + "%")("severity", garantie_r2.valeurGarantie >= ctx_r0.demandeIndividuel().montantDemande ? "success" : "warn");
  }
}
function AnalyseFluxTresorerieComponent_p_card_3_div_59_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14);
    \u0275\u0275element(1, "p-divider");
    \u0275\u0275elementStart(2, "h4", 5);
    \u0275\u0275element(3, "i", 22);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p-table", 23);
    \u0275\u0275template(6, AnalyseFluxTresorerieComponent_p_card_3_div_59_ng_template_6_Template, 9, 0, "ng-template", 3)(7, AnalyseFluxTresorerieComponent_p_card_3_div_59_ng_template_7_Template, 9, 5, "ng-template", 24);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" Garanties propos\xE9es (", ctx_r0.garanties().length, ") ");
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r0.garanties())("scrollable", true);
  }
}
function AnalyseFluxTresorerieComponent_p_card_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-card", 5);
    \u0275\u0275template(1, AnalyseFluxTresorerieComponent_p_card_3_ng_template_1_Template, 5, 1, "ng-template", 3);
    \u0275\u0275elementStart(2, "div", 6)(3, "div", 7)(4, "div", 8)(5, "label", 9);
    \u0275\u0275text(6, "Nom complet");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 10);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 7)(10, "div", 8)(11, "label", 9);
    \u0275\u0275text(12, "Date de naissance");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 11);
    \u0275\u0275text(14);
    \u0275\u0275elementStart(15, "span", 12);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(17, "div", 7)(18, "div", 8)(19, "label", 9);
    \u0275\u0275text(20, "T\xE9l\xE9phone");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "div", 11);
    \u0275\u0275element(22, "i", 13);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(24, "div", 14);
    \u0275\u0275element(25, "p-divider");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "div", 15)(27, "div", 8)(28, "label", 9);
    \u0275\u0275text(29, "Montant demand\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "div", 16);
    \u0275\u0275text(31);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(32, "div", 15)(33, "div", 8)(34, "label", 9);
    \u0275\u0275text(35, "Dur\xE9e du pr\xEAt");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "div", 11);
    \u0275\u0275text(37);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(38, "div", 15)(39, "div", 8)(40, "label", 9);
    \u0275\u0275text(41, "Taux d'int\xE9r\xEAt");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "div", 11);
    \u0275\u0275text(43);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(44, "div", 15)(45, "div", 8)(46, "label", 9);
    \u0275\u0275text(47, "\xC9ch\xE9ance mensuelle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(48, "div", 11);
    \u0275\u0275text(49);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(50, "div", 14);
    \u0275\u0275element(51, "p-divider");
    \u0275\u0275elementStart(52, "div", 8)(53, "label", 9);
    \u0275\u0275text(54, "Description de l'activit\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "div", 11);
    \u0275\u0275text(56);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "small", 17);
    \u0275\u0275text(58);
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(59, AnalyseFluxTresorerieComponent_p_card_3_div_59_Template, 8, 3, "div", 18);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate2(" ", ctx_r0.demandeIndividuel().prenom, " ", ctx_r0.demandeIndividuel().nom, " ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", ctx_r0.formatDateFromArray(ctx_r0.demandeIndividuel().dateNaissance), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" (", ctx_r0.calculateAge(ctx_r0.demandeIndividuel().dateNaissance), " ans) ");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1(" ", ctx_r0.demandeIndividuel().telephone, " ");
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1(" ", ctx_r0.formatMontant(ctx_r0.demandeIndividuel().montantDemande), " ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", ctx_r0.demandeIndividuel().dureeDemande, " mois ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", ctx_r0.demandeIndividuel().tauxInteret, "% annuel ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", ctx_r0.formatMontant(ctx_r0.mensualite().total), " ");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1(" ", ctx_r0.demandeIndividuel().descriptionActivite, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" Anciennet\xE9: ", ctx_r0.demandeIndividuel().nombreAnneeActivite, " ans | Lieu: ", ctx_r0.demandeIndividuel().adresseLieuActivite, " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.garanties().length > 0);
  }
}
function AnalyseFluxTresorerieComponent_div_5_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 31)(1, "div", 32)(2, "div", 33)(3, "div", 34)(4, "div", 35);
    \u0275\u0275element(5, "i", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div")(7, "div", 37);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 38);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "div", 39);
    \u0275\u0275element(12, "p-tag", 40);
    \u0275\u0275elementStart(13, "span", 9);
    \u0275\u0275text(14, " Mensualit\xE9: ");
    \u0275\u0275elementStart(15, "strong", 41);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1(" Dossier N\xB0", ctx_r0.creditParams().dossierId, " cr\xE9\xE9 ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate5(" ", ctx_r0.demandeIndividuel().prenom, " ", ctx_r0.demandeIndividuel().nom, " \u2022 ", ctx_r0.formatMontant(ctx_r0.creditParams().montantCredit), " \u2022 ", ctx_r0.creditParams().duree, " mois \xE0 ", ctx_r0.creditParams().tauxInteret, "% ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r0.formatMontant(ctx_r0.mensualite().total));
  }
}
function AnalyseFluxTresorerieComponent_div_5_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 42)(1, "div", 43)(2, "div", 33)(3, "div", 34)(4, "div", 44);
    \u0275\u0275element(5, "i", 45);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div")(7, "div", 46);
    \u0275\u0275text(8, " Dossier de cr\xE9dit \xE0 cr\xE9er ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 47);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "div", 48)(12, "div", 49)(13, "div", 50);
    \u0275\u0275text(14, "Mensualit\xE9 calcul\xE9e");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 51);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 50);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "p-button", 52);
    \u0275\u0275listener("onClick", function AnalyseFluxTresorerieComponent_div_5_div_2_Template_p_button_onClick_19_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.createDossierCredit());
    });
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate5(" ", ctx_r0.demandeIndividuel().prenom, " ", ctx_r0.demandeIndividuel().nom, " \u2022 ", ctx_r0.formatMontant(ctx_r0.creditParams().montantCredit), " \u2022 ", ctx_r0.creditParams().duree, " mois \xE0 ", ctx_r0.creditParams().tauxInteret, "% ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r0.formatMontant(ctx_r0.mensualite().total));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" (", ctx_r0.formatMontant(ctx_r0.mensualite().capital), " + ", ctx_r0.formatMontant(ctx_r0.mensualite().interet), ") ");
    \u0275\u0275advance();
    \u0275\u0275property("loading", ctx_r0.state().saving);
  }
}
function AnalyseFluxTresorerieComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 28);
    \u0275\u0275template(1, AnalyseFluxTresorerieComponent_div_5_div_1_Template, 17, 7, "div", 29)(2, AnalyseFluxTresorerieComponent_div_5_div_2_Template, 20, 9, "div", 30);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.creditParams().dossierId > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.creditParams().dossierId || ctx_r0.creditParams().dossierId === 0);
  }
}
function AnalyseFluxTresorerieComponent_ng_template_7_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-tag", 58);
  }
}
function AnalyseFluxTresorerieComponent_ng_template_7_p_tag_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-tag", 64);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("value", ctx_r0.getTableMonthsWithData() + "/" + (ctx_r0.nombreMois() + 1) + " mois");
  }
}
function AnalyseFluxTresorerieComponent_ng_template_7_p_tag_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-tag", 65);
  }
}
function AnalyseFluxTresorerieComponent_ng_template_7_p_tag_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-tag", 66);
  }
}
function AnalyseFluxTresorerieComponent_ng_template_7_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 62)(1, "p-button", 67);
    \u0275\u0275listener("onClick", function AnalyseFluxTresorerieComponent_ng_template_7_Conditional_12_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.imprimerTableauTresorerie());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(2, "p-splitButton", 68);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("model", ctx_r0.splitButtonOptions);
  }
}
function AnalyseFluxTresorerieComponent_ng_template_7_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-button", 63);
  }
  if (rf & 2) {
    \u0275\u0275property("disabled", true);
  }
}
function AnalyseFluxTresorerieComponent_ng_template_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 53)(1, "div", 54)(2, "div", 34)(3, "h2", 55);
    \u0275\u0275element(4, "i", 56);
    \u0275\u0275text(5, " Pr\xE9vision de Tr\xE9sorerie ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 57);
    \u0275\u0275template(7, AnalyseFluxTresorerieComponent_ng_template_7_Conditional_7_Template, 1, 0, "p-tag", 58)(8, AnalyseFluxTresorerieComponent_ng_template_7_p_tag_8_Template, 1, 1, "p-tag", 59)(9, AnalyseFluxTresorerieComponent_ng_template_7_p_tag_9_Template, 1, 0, "p-tag", 60)(10, AnalyseFluxTresorerieComponent_ng_template_7_p_tag_10_Template, 1, 0, "p-tag", 61);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 48);
    \u0275\u0275template(12, AnalyseFluxTresorerieComponent_ng_template_7_Conditional_12_Template, 3, 1, "div", 62)(13, AnalyseFluxTresorerieComponent_ng_template_7_Conditional_13_Template, 1, 1, "p-button", 63);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275conditional(!ctx_r0.hasDossierCredit() ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.getTableMonthsWithData() > 0 && ctx_r0.hasDossierCredit());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.tresorerieState.hasUnsavedChanges() && ctx_r0.hasDossierCredit());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.tresorerieState.hasUnsavedChanges() && ctx_r0.getTableMonthsWithData() > 0 && ctx_r0.hasDossierCredit());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.peutImprimer() && ctx_r0.hasDossierCredit() ? 12 : 13);
  }
}
function AnalyseFluxTresorerieComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 4)(1, "div", 69)(2, "div", 70);
    \u0275\u0275element(3, "i", 71);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h3", 72);
    \u0275\u0275text(5, " Dossier de cr\xE9dit requis ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 73);
    \u0275\u0275text(7, " Avant de pouvoir saisir les pr\xE9visions de tr\xE9sorerie, vous devez d'abord cr\xE9er le dossier de cr\xE9dit. Cette \xE9tape est obligatoire pour enregistrer vos donn\xE9es. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 74)(9, "p-button", 75);
    \u0275\u0275listener("onClick", function AnalyseFluxTresorerieComponent_Conditional_8_Template_p_button_onClick_9_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.createDossierCredit());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 76);
    \u0275\u0275element(11, "i", 77);
    \u0275\u0275text(12, " Montant: ");
    \u0275\u0275elementStart(13, "strong");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275text(15, " | Dur\xE9e: ");
    \u0275\u0275elementStart(16, "strong");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275text(18, " | Taux: ");
    \u0275\u0275elementStart(19, "strong");
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(9);
    \u0275\u0275property("loading", ctx_r0.state().saving);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.formatMontant(ctx_r0.creditParams().montantCredit));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", ctx_r0.creditParams().duree, " mois");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", ctx_r0.creditParams().tauxInteret, "%");
  }
}
function AnalyseFluxTresorerieComponent_Conditional_9_Conditional_0_For_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 111)(1, "span", 112);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const mois_r7 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("segment-empty", !ctx_r0.checkIfMoisHasData(ctx_r0.getMoisFormGroup(mois_r7).getRawValue()))("segment-filled", ctx_r0.checkIfMoisHasData(ctx_r0.getMoisFormGroup(mois_r7).getRawValue()) && !ctx_r0.moisSauvegardes().has(mois_r7))("segment-saved", ctx_r0.moisSauvegardes().has(mois_r7));
    \u0275\u0275property("pTooltip", "M" + mois_r7 + (ctx_r0.moisSauvegardes().has(mois_r7) ? " \u2713" : ""));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(mois_r7);
  }
}
function AnalyseFluxTresorerieComponent_Conditional_9_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 78)(1, "div", 98)(2, "div", 99)(3, "span", 100);
    \u0275\u0275element(4, "i", 101);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 102);
    \u0275\u0275text(7, " Solde final: ");
    \u0275\u0275elementStart(8, "strong");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 103);
    \u0275\u0275repeaterCreate(11, AnalyseFluxTresorerieComponent_Conditional_9_Conditional_0_For_12_Template, 3, 8, "div", 104, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 105)(14, "div", 106)(15, "span", 107);
    \u0275\u0275element(16, "span", 108);
    \u0275\u0275text(17, " Vide ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "span", 107);
    \u0275\u0275element(19, "span", 109);
    \u0275\u0275text(20, " Renseign\xE9 ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "span", 107);
    \u0275\u0275element(22, "span", 110);
    \u0275\u0275text(23, " Sauvegard\xE9 ");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2(" Progression: ", ctx_r0.getTableMonthsWithData(), "/", ctx_r0.nombreMois() + 1, " mois ");
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(4, _c3, ((tmp_3_0 = ctx_r0.getCellValue("soldeFin", ctx_r0.dernierMois())) !== null && tmp_3_0 !== void 0 ? tmp_3_0 : 0) < 0, ((tmp_3_0 = ctx_r0.getCellValue("soldeFin", ctx_r0.dernierMois())) !== null && tmp_3_0 !== void 0 ? tmp_3_0 : 0) >= 0));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.formatMontant((tmp_4_0 = ctx_r0.getCellValue("soldeFin", ctx_r0.dernierMois())) !== null && tmp_4_0 !== void 0 ? tmp_4_0 : 0));
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.moisColumns());
  }
}
function AnalyseFluxTresorerieComponent_Conditional_9_For_15_small_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 115);
    \u0275\u0275text(1, "D\xE9marrage");
    \u0275\u0275elementEnd();
  }
}
function AnalyseFluxTresorerieComponent_Conditional_9_For_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 113);
    \u0275\u0275text(1);
    \u0275\u0275template(2, AnalyseFluxTresorerieComponent_Conditional_9_For_15_small_2_Template, 2, 0, "small", 114);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const mois_r8 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("col-mois-0", mois_r8 === 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getTableMoisLabel(mois_r8), " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", mois_r8 === 0);
  }
}
function AnalyseFluxTresorerieComponent_Conditional_9_For_20_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 116)(1, "td", 122);
    \u0275\u0275element(2, "i", 123);
    \u0275\u0275text(3, " ENCAISSEMENTS ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275attribute("colspan", ctx_r0.moisColumns().length + 2);
  }
}
function AnalyseFluxTresorerieComponent_Conditional_9_For_20_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 116)(1, "td", 124);
    \u0275\u0275element(2, "i", 125);
    \u0275\u0275text(3, " D\xC9CAISSEMENTS ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275attribute("colspan", ctx_r0.moisColumns().length + 2);
  }
}
function AnalyseFluxTresorerieComponent_Conditional_9_For_20_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 116)(1, "td", 126);
    \u0275\u0275element(2, "i", 127);
    \u0275\u0275text(3, " R\xC9SULTATS ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275attribute("colspan", ctx_r0.moisColumns().length + 2);
  }
}
function AnalyseFluxTresorerieComponent_Conditional_9_For_20_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 116)(1, "td", 128);
    \u0275\u0275element(2, "i", 129);
    \u0275\u0275text(3, " REMBOURSEMENTS CR\xC9DIT ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275attribute("colspan", ctx_r0.moisColumns().length + 2);
  }
}
function AnalyseFluxTresorerieComponent_Conditional_9_For_20_For_10_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 135);
    \u0275\u0275listener("click", function AnalyseFluxTresorerieComponent_Conditional_9_For_20_For_10_Conditional_1_Conditional_2_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r12);
      const mois_r10 = \u0275\u0275nextContext(2).$implicit;
      const ligne_r11 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      ctx_r0.copyToFollowingMonths(ligne_r11.id, mois_r10);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const mois_r10 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("pTooltip", "Copier vers M" + (mois_r10 + 1) + " \xE0 M" + ctx_r0.nombreMois());
  }
}
function AnalyseFluxTresorerieComponent_Conditional_9_For_20_For_10_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 131)(1, "p-inputNumber", 133);
    \u0275\u0275listener("ngModelChange", function AnalyseFluxTresorerieComponent_Conditional_9_For_20_For_10_Conditional_1_Template_p_inputNumber_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r9);
      const mois_r10 = \u0275\u0275nextContext().$implicit;
      const ligne_r11 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.onTableCellChange(ligne_r11.id, mois_r10, $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(2, AnalyseFluxTresorerieComponent_Conditional_9_For_20_For_10_Conditional_1_Conditional_2_Template, 1, 1, "button", 134);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const mois_r10 = \u0275\u0275nextContext().$implicit;
    const ligne_r11 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r0.getCellValue(ligne_r11.id, mois_r10))("minFractionDigits", 0)("maxFractionDigits", 0)("useGrouping", true)("placeholder", "-");
    \u0275\u0275advance();
    \u0275\u0275conditional(mois_r10 < ctx_r0.nombreMois() && ctx_r0.getCellValue(ligne_r11.id, mois_r10) !== null && ctx_r0.getCellValue(ligne_r11.id, mois_r10) !== 0 ? 2 : -1);
  }
}
function AnalyseFluxTresorerieComponent_Conditional_9_For_20_For_10_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 132);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "number");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const mois_r10 = \u0275\u0275nextContext().$implicit;
    const ligne_r11 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(2, 1, ctx_r0.getCellValue(ligne_r11.id, mois_r10), "1.0-0"), " ");
  }
}
function AnalyseFluxTresorerieComponent_Conditional_9_For_20_For_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 130);
    \u0275\u0275template(1, AnalyseFluxTresorerieComponent_Conditional_9_For_20_For_10_Conditional_1_Template, 3, 6, "div", 131)(2, AnalyseFluxTresorerieComponent_Conditional_9_For_20_For_10_Conditional_2_Template, 3, 4, "span", 132);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_25_0;
    let tmp_26_0;
    const mois_r10 = ctx.$implicit;
    const ligne_r11 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("col-mois-0", mois_r10 === 0)("cell-editable", ctx_r0.isCellEditable(ligne_r11, mois_r10))("cell-readonly", !ctx_r0.isCellEditable(ligne_r11, mois_r10))("cell-negative", ((tmp_25_0 = ctx_r0.getCellValue(ligne_r11.id, mois_r10)) !== null && tmp_25_0 !== void 0 ? tmp_25_0 : 0) < 0)("cell-positive", ((tmp_26_0 = ctx_r0.getCellValue(ligne_r11.id, mois_r10)) !== null && tmp_26_0 !== void 0 ? tmp_26_0 : 0) > 0 && ligne_r11.type === "calcul");
    \u0275\u0275property("pTooltip", ctx_r0.getCellTooltip(ligne_r11, mois_r10))("tooltipOptions", \u0275\u0275pureFunction0(13, _c5));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.isCellEditable(ligne_r11, mois_r10) ? 1 : 2);
  }
}
function AnalyseFluxTresorerieComponent_Conditional_9_For_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, AnalyseFluxTresorerieComponent_Conditional_9_For_20_Conditional_0_Template, 4, 1, "tr", 116)(1, AnalyseFluxTresorerieComponent_Conditional_9_For_20_Conditional_1_Template, 4, 1, "tr", 116)(2, AnalyseFluxTresorerieComponent_Conditional_9_For_20_Conditional_2_Template, 4, 1, "tr", 116)(3, AnalyseFluxTresorerieComponent_Conditional_9_For_20_Conditional_3_Template, 4, 1, "tr", 116);
    \u0275\u0275elementStart(4, "tr")(5, "td", 85)(6, "div", 117)(7, "span", 118);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275repeaterCreate(9, AnalyseFluxTresorerieComponent_Conditional_9_For_20_For_10_Template, 3, 14, "td", 119, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementStart(11, "td", 120)(12, "span", 121);
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "number");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ligne_r11 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(ligne_r11.id === "ventes" ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ligne_r11.id === "achatmarchandises" ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ligne_r11.id === "disponibleEnCaisse" ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ligne_r11.id === "interetsAVerser" ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275classMap(ligne_r11.cssClass);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ligne_r11.libelle);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.moisColumns());
    \u0275\u0275advance(2);
    \u0275\u0275property("pTooltip", ctx_r0.getCumulTooltip(ligne_r11))("tooltipOptions", \u0275\u0275pureFunction0(13, _c4));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(14, 10, ctx_r0.getCumulForLigne(ligne_r11.id), "1.0-0"), " ");
  }
}
function AnalyseFluxTresorerieComponent_Conditional_9_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 92);
    \u0275\u0275text(1, " Commencez par saisir les donn\xE9es dans le tableau ");
    \u0275\u0275elementEnd();
  }
}
function AnalyseFluxTresorerieComponent_Conditional_9_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 92);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getTableMonthsWithData(), " mois renseign\xE9s - Modifications non sauvegard\xE9es ");
  }
}
function AnalyseFluxTresorerieComponent_Conditional_9_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 93);
    \u0275\u0275element(1, "i", 136);
    \u0275\u0275text(2, " Tous les changements sont sauvegard\xE9s ");
    \u0275\u0275elementEnd();
  }
}
function AnalyseFluxTresorerieComponent_Conditional_9_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 137);
    \u0275\u0275listener("onClick", function AnalyseFluxTresorerieComponent_Conditional_9_Conditional_31_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.imprimerTableauTresorerie());
    });
    \u0275\u0275elementEnd();
  }
}
function AnalyseFluxTresorerieComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275template(0, AnalyseFluxTresorerieComponent_Conditional_9_Conditional_0_Template, 24, 7, "div", 78);
    \u0275\u0275elementStart(1, "div", 79)(2, "div")(3, "span", 80);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div")(6, "span", 81);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 82)(9, "table", 83)(10, "thead")(11, "tr", 84)(12, "th", 85);
    \u0275\u0275text(13, "Libell\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(14, AnalyseFluxTresorerieComponent_Conditional_9_For_15_Template, 3, 4, "th", 86, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementStart(16, "th", 87);
    \u0275\u0275text(17, "Cumul");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "tbody");
    \u0275\u0275repeaterCreate(19, AnalyseFluxTresorerieComponent_Conditional_9_For_20_Template, 15, 14, null, null, _forTrack0);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "div", 88)(22, "div", 89)(23, "div", 90);
    \u0275\u0275element(24, "i", 91);
    \u0275\u0275elementStart(25, "span", 80);
    \u0275\u0275template(26, AnalyseFluxTresorerieComponent_Conditional_9_Conditional_26_Template, 2, 0, "span", 92)(27, AnalyseFluxTresorerieComponent_Conditional_9_Conditional_27_Template, 2, 1, "span", 92)(28, AnalyseFluxTresorerieComponent_Conditional_9_Conditional_28_Template, 3, 0, "span", 93);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "div", 94);
    \u0275\u0275element(30, "p-button", 95);
    \u0275\u0275template(31, AnalyseFluxTresorerieComponent_Conditional_9_Conditional_31_Template, 1, 0, "p-button", 96);
    \u0275\u0275elementStart(32, "p-button", 97);
    \u0275\u0275listener("onClick", function AnalyseFluxTresorerieComponent_Conditional_9_Template_p_button_onClick_32_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.savePrevisions());
    });
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r0.peutImprimer() ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(10, _c0, ((tmp_2_0 = ctx_r0.getCellValue("soldeFin", ctx_r0.dernierMois())) !== null && tmp_2_0 !== void 0 ? tmp_2_0 : 0) >= 0, ((tmp_2_0 = ctx_r0.getCellValue("soldeFin", ctx_r0.dernierMois())) !== null && tmp_2_0 !== void 0 ? tmp_2_0 : 0) < 0));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Solde final pr\xE9vu (Mois ", ctx_r0.dernierMois(), "):");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(13, _c1, ((tmp_4_0 = ctx_r0.getCellValue("soldeFin", ctx_r0.dernierMois())) !== null && tmp_4_0 !== void 0 ? tmp_4_0 : 0) >= 0, ((tmp_4_0 = ctx_r0.getCellValue("soldeFin", ctx_r0.dernierMois())) !== null && tmp_4_0 !== void 0 ? tmp_4_0 : 0) < 0));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.formatMontant((tmp_5_0 = ctx_r0.getCellValue("soldeFin", ctx_r0.dernierMois())) !== null && tmp_5_0 !== void 0 ? tmp_5_0 : 0), " ");
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r0.moisColumns());
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r0.lignesTableau);
    \u0275\u0275advance(7);
    \u0275\u0275conditional(ctx_r0.getTableMonthsWithData() === 0 ? 26 : ctx_r0.tresorerieState.hasUnsavedChanges() ? 27 : 28);
    \u0275\u0275advance(4);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(16, _c2, ctx_r0.demandeIndividuelId));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.peutImprimer() ? 31 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("loading", ctx_r0.state().saving)("disabled", !ctx_r0.canSaveTableau());
  }
}
var AnalyseFluxTresorerieComponent = class _AnalyseFluxTresorerieComponent {
  fb = inject(FormBuilder);
  userService = inject(UserService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  destroyRef = inject(DestroyRef);
  tresorerieState = inject(TresorerieStateService);
  tresoreriePrintService = inject(TresoreriePrintService);
  // Données de la demande individuelle
  demandeIndividuelId = null;
  demandeIndividuel = signal(null);
  garanties = signal([]);
  // État de chargement pour la demande
  loadingDemande = signal(false);
  // Formulaire principal
  tresorerieForm;
  creditParamsForm;
  newClientForm;
  // Dialog
  showNewClientDialog = false;
  savingClient = false;
  showHistoryDialog = false;
  ngZone = inject(NgZone);
  // État global
  state = signal({
    hasDossierCredit: false,
    loading: false,
    saving: false,
    viewMode: "saisie",
    error: null
  });
  // Structure du tableau
  lignesTableau = [
    // Solde début
    { id: "soldeDebut", categorie: "SOLDE_DEBUT", libelle: "Solde D\xE9but de p\xE9riode", type: "calcul", editable: false, cssClass: "row-solde-debut" },
    // Encaissements
    { id: "ventes", categorie: "VENTES", libelle: "Ventes", type: "encaissement", editable: true, cssClass: "row-encaissement" },
    { id: "autresRevenus", categorie: "AUTRES_REVENUS", libelle: "Autres revenus", type: "encaissement", editable: true, cssClass: "row-encaissement" },
    { id: "pret", categorie: "PRET", libelle: "Pr\xEAt re\xE7u", type: "encaissement", editable: true, cssClass: "row-encaissement row-pret" },
    // Total Encaissements
    { id: "totalEncaissements", categorie: "TOTAL_ENC", libelle: "Total Encaissements", type: "calcul", editable: false, cssClass: "row-total row-total-enc" },
    // Décaissements
    { id: "achatmarchandises", categorie: "ACHAT_MARCHANDISES", libelle: "Achat marchandises", type: "decaissement", editable: true, cssClass: "row-decaissement" },
    { id: "mainoeuvre", categorie: "MAIN_OEUVRE", libelle: "Main d'\u0153uvre", type: "decaissement", editable: true, cssClass: "row-decaissement" },
    { id: "investissement", categorie: "INVESTISSEMENT", libelle: "Investissement", type: "decaissement", editable: true, cssClass: "row-decaissement" },
    { id: "impotstaxes", categorie: "IMPOTS_TAXES", libelle: "Imp\xF4ts et taxes", type: "decaissement", editable: true, cssClass: "row-decaissement" },
    { id: "loyer", categorie: "LOYER", libelle: "Loyer", type: "decaissement", editable: true, cssClass: "row-decaissement" },
    { id: "utilities", categorie: "UTILITIES", libelle: "Eau, \xC9lectricit\xE9", type: "decaissement", editable: true, cssClass: "row-decaissement" },
    { id: "transport", categorie: "TRANSPORT", libelle: "Transport", type: "decaissement", editable: true, cssClass: "row-decaissement" },
    { id: "salaires", categorie: "SALAIRES", libelle: "Salaires", type: "decaissement", editable: true, cssClass: "row-decaissement" },
    { id: "fraistelephone", categorie: "FRAIS_TELEPHONE", libelle: "Frais t\xE9l\xE9phone", type: "decaissement", editable: true, cssClass: "row-decaissement" },
    { id: "chargesfinancieres", categorie: "CHARGES_FINANCIERES", libelle: "Charges financi\xE8res", type: "decaissement", editable: true, cssClass: "row-decaissement" },
    { id: "entretien", categorie: "ENTRETIEN", libelle: "Entretien", type: "decaissement", editable: true, cssClass: "row-decaissement" },
    { id: "autresdepenses", categorie: "AUTRES_DEPENSES", libelle: "Autres d\xE9penses", type: "decaissement", editable: true, cssClass: "row-decaissement" },
    // Total Décaissements
    { id: "totalDecaissements", categorie: "TOTAL_DEC", libelle: "Total D\xE9caissements", type: "calcul", editable: false, cssClass: "row-total row-total-dec" },
    // Disponible et Excédent
    { id: "disponibleEnCaisse", categorie: "DISPONIBLE", libelle: "Disponible en caisse", type: "calcul", editable: false, cssClass: "row-calcul" },
    { id: "excedentDeficit", categorie: "EXCEDENT", libelle: "Exc\xE9dent (D\xE9ficit)", type: "calcul", editable: false, cssClass: "row-calcul row-excedent" },
    // Remboursements
    { id: "interetsAVerser", categorie: "INTERETS", libelle: "Int\xE9r\xEAts \xE0 verser", type: "remboursement", editable: true, cssClass: "row-remboursement" },
    { id: "remboursementCapital", categorie: "CAPITAL", libelle: "Remboursement capital", type: "remboursement", editable: true, cssClass: "row-remboursement" },
    // Solde fin
    { id: "soldeFin", categorie: "SOLDE_FIN", libelle: "Solde Fin de p\xE9riode", type: "calcul", editable: false, cssClass: "row-solde-fin" }
  ];
  // Colonnes des mois (0 à 12)
  nombreMois = computed(() => {
    const demande = this.demandeIndividuel();
    return demande?.dureeDemande || 12;
  });
  // Colonnes dynamiques (M0 à M_duree)
  moisColumns = computed(() => {
    const duree = this.nombreMois();
    return Array.from({ length: duree + 1 }, (_, i) => i);
  });
  // Dernier mois (pour remplacer les références à "12")
  dernierMois = computed(() => this.nombreMois());
  // ========================================
  // MÉTHODES POUR LE MODE TABLEAU
  // ========================================
  /**
   * Obtenir la valeur d'une cellule depuis le formulaire
   */
  getCellValue(ligneId, mois) {
    const moisForm = this.getMoisFormGroup(mois);
    if (!moisForm)
      return null;
    return moisForm.get(ligneId)?.value;
  }
  /**
   * Définir la valeur d'une cellule dans le formulaire
   */
  setCellValue(ligneId, mois, value) {
    const moisForm = this.getMoisFormGroup(mois);
    if (!moisForm)
      return;
    moisForm.patchValue({ [ligneId]: value }, { emitEvent: false });
  }
  /**
   * Gérer le changement de valeur dans une cellule du tableau
   */
  onTableCellChange(ligneId, mois, value) {
    this.setCellValue(ligneId, mois, value);
    this.calculateMonth(mois);
    this.propagateSoldesToFollowingMonths(mois);
    const moisForm = this.getMoisFormGroup(mois);
    if (moisForm) {
      this.tresorerieState.updatePrevision(mois, moisForm.getRawValue(), false, true);
    }
    this.cdr.detectChanges();
  }
  /**
   * Propager les soldes de fin vers les mois suivants
   */
  propagateSoldesToFollowingMonths(fromMois) {
    const duree = this.nombreMois();
    for (let m = fromMois; m < duree; m++) {
      const currentMoisForm = this.getMoisFormGroup(m);
      const nextMoisForm = this.getMoisFormGroup(m + 1);
      if (currentMoisForm && nextMoisForm) {
        const soldeFin = currentMoisForm.get("soldeFin")?.value || 0;
        nextMoisForm.patchValue({ soldeDebut: soldeFin }, { emitEvent: false });
        this.calculateMonth(m + 1);
      }
    }
  }
  /**
   * Vérifier si une cellule est éditable
   */
  isCellEditable(ligne, mois) {
    if (ligne.id === "soldeDebut") {
      return mois === 0;
    }
    if (ligne.id === "ventes" && mois === 0) {
      return false;
    }
    if (ligne.type === "remboursement" && mois === 0) {
      return false;
    }
    return ligne.editable;
  }
  /**
   * Obtenir le label du mois pour le tableau
   */
  getTableMoisLabel(mois) {
    return mois === 0 ? "M0" : `M${mois}`;
  }
  /**
   * Calculer le cumul pour une ligne
   */
  getCumulForLigne(ligneId) {
    const duree = this.nombreMois();
    if (ligneId === "soldeDebut" || ligneId === "soldeFin" || ligneId === "disponibleEnCaisse" || ligneId === "excedentDeficit") {
      return this.getCellValue(ligneId, duree) || 0;
    }
    let total = 0;
    for (let mois = 0; mois <= duree; mois++) {
      total += this.getCellValue(ligneId, mois) || 0;
    }
    return total;
  }
  /**
   * Copier la valeur d'une cellule vers tous les mois suivants
   */
  /**
   * Copier la valeur d'une cellule vers tous les mois suivants
   */
  copyToFollowingMonths(ligneId, fromMois) {
    const value = this.getCellValue(ligneId, fromMois);
    const ligne = this.lignesTableau.find((l) => l.id === ligneId);
    const duree = this.nombreMois();
    if (!ligne)
      return;
    if (fromMois >= duree) {
      this.messageService.add({
        severity: "warn",
        summary: "Attention",
        detail: "Aucun mois suivant disponible pour la copie"
      });
      return;
    }
    let copiedCount = 0;
    for (let mois = fromMois + 1; mois <= duree; mois++) {
      if (this.isCellEditable(ligne, mois)) {
        this.setCellValue(ligneId, mois, value);
        copiedCount++;
      }
    }
    this.calculateAllMonths();
    this.messageService.add({
      severity: "info",
      summary: "Copi\xE9",
      detail: `Valeur "${this.formatMontant(value || 0)}" copi\xE9e de M${fromMois} vers M${fromMois + 1} \xE0 M${duree} (${copiedCount} mois)`
    });
  }
  /**
   * Copier la valeur vers une plage de mois spécifique
   */
  copyToMonthRange(ligneId, fromMois, toMois) {
    const value = this.getCellValue(ligneId, fromMois);
    const ligne = this.lignesTableau.find((l) => l.id === ligneId);
    const duree = this.nombreMois();
    if (!ligne)
      return;
    const maxMois = Math.min(toMois, duree);
    let copiedCount = 0;
    for (let mois = fromMois + 1; mois <= maxMois; mois++) {
      if (this.isCellEditable(ligne, mois)) {
        this.setCellValue(ligneId, mois, value);
        copiedCount++;
      }
    }
    this.calculateAllMonths();
    this.messageService.add({
      severity: "info",
      summary: "Copi\xE9",
      detail: `Valeur copi\xE9e vers ${copiedCount} mois (M${fromMois + 1} \xE0 M${maxMois})`
    });
  }
  /**
   * Réinitialiser tout le tableau
   */
  resetTableau() {
    this.confirmationService.confirm({
      message: "R\xE9initialiser toutes les donn\xE9es du tableau ?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        const duree = this.nombreMois();
        for (let mois = 0; mois <= duree; mois++) {
          this.resetMonthToDefaults(mois);
        }
        if (this.creditParams().montantCredit > 0) {
          this.setCellValue("pret", 0, this.creditParams().montantCredit);
        }
        this.calculateAllMonths();
        this.tresorerieState.clearAll();
        this.messageService.add({
          severity: "success",
          summary: "R\xE9initialis\xE9",
          detail: "Toutes les donn\xE9es ont \xE9t\xE9 effac\xE9es"
        });
      }
    });
  }
  /**
   * Compter les mois avec données dans le tableau
   */
  getTableMonthsWithData() {
    const duree = this.nombreMois();
    let count = 0;
    for (let mois = 0; mois <= duree; mois++) {
      if (this.checkIfMoisHasData(this.getMoisFormGroup(mois)?.getRawValue())) {
        count++;
      }
    }
    return count;
  }
  /**
   * Vérifier si on peut sauvegarder le tableau (version corrigée)
   */
  canSaveTableau() {
    const hasData = this.getTableMonthsWithData() > 0;
    const hasDossier = this.creditParams().dossierId > 0;
    const notSaving = !this.state().saving;
    return hasData && hasDossier && notSaving;
  }
  // Observable du mois courant
  currentMonth = signal(0);
  // Tracking des mois
  moisRenseignes = signal(/* @__PURE__ */ new Set());
  moisSauvegardes = signal(/* @__PURE__ */ new Set());
  // Listes et données
  clients = signal([]);
  dossiers = signal([]);
  selectedDossier = signal(null);
  hasExistingAnalysis = signal(false);
  // Mois de 0 à 12
  mois = Array.from({ length: 13 }, (_, i) => i);
  categoriesDecaissement = CATEGORIES_DECAISSEMENT;
  // État actuel du mois en édition
  // currentMonthData = signal<any>(null);
  // isEditMode = signal<boolean>(false);
  showDossiersHistory() {
    this.showHistoryDialog = true;
  }
  getStatutSeverity(statut) {
    if (statut === "Valid\xE9")
      return "success";
    if (statut === "En attente")
      return "info";
    if (statut === "Rejet\xE9")
      return "danger";
    return "secondary";
  }
  moisEnCoursModification = signal(null);
  // Types d'activité
  typesActivite = [
    { label: "Commerce", value: "COMMERCE" },
    { label: "Service", value: "SERVICE" },
    { label: "Production", value: "PRODUCTION" },
    { label: "Agriculture", value: "AGRICULTURE" },
    { label: "Artisanat", value: "ARTISANAT" },
    { label: "Autre", value: "AUTRE" }
  ];
  // Paramètres du crédit
  creditParams = signal({
    montantCredit: 0,
    tauxInteret: 0,
    duree: 12,
    clientId: 0,
    clientNom: "",
    dossierId: 0
  });
  // Computed pour vérifier si le dossier existe (permet de bloquer le tableau)
  hasDossierCredit = computed(() => this.creditParams().dossierId > 0);
  // SOLUTION 1: Ajouter un signal pour forcer le refresh du formulaire
  formRefreshTrigger = signal(0);
  // Calcul de la mensualité
  mensualite = computed(() => {
    const params = this.creditParams();
    if (!params.montantCredit || !params.duree || !params.tauxInteret) {
      return { capital: 0, interet: 0, total: 0 };
    }
    const tauxMensuel = params.tauxInteret / 100 / 12;
    const nombreMensualites = params.duree;
    const montant = params.montantCredit;
    if (tauxMensuel === 0) {
      const mensualite2 = montant / nombreMensualites;
      return { capital: mensualite2, interet: 0, total: mensualite2 };
    }
    const mensualite = montant * (tauxMensuel * Math.pow(1 + tauxMensuel, nombreMensualites)) / (Math.pow(1 + tauxMensuel, nombreMensualites) - 1);
    const interetMoyen = mensualite - montant / nombreMensualites;
    const capitalMoyen = montant / nombreMensualites;
    return {
      capital: capitalMoyen,
      interet: interetMoyen,
      total: mensualite
    };
  });
  constructor() {
    this.tresorerieState.currentMonth$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((month) => {
      this.currentMonth.set(month);
      this.loadMonthData(month);
    });
    this.tresorerieState.previsions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.updateTrackingSets();
    });
  }
  // Mise à jour des sets de tracking
  updateTrackingSets() {
    const monthsWithData = this.tresorerieState.getMonthsWithData();
    const savedMonths = this.tresorerieState.getSavedMonths();
    this.moisRenseignes.set(new Set(monthsWithData));
    this.moisSauvegardes.set(new Set(savedMonths));
  }
  ngOnInit() {
    this.initializeCreditParamsForm();
    this.initializeNewClientForm();
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.demandeIndividuelId = params["demandeindividuelId"] ? parseInt(params["demandeindividuelId"], 10) : null;
      if (this.demandeIndividuelId) {
        this.loadDemandeIndividuel();
      }
    });
    this.loadInitialParams();
  }
  loadDemandeIndividuel() {
    if (!this.demandeIndividuelId)
      return;
    this.loadingDemande.set(true);
    this.userService.getDemandeWithGaranties$(this.demandeIndividuelId).subscribe({
      next: (response) => {
        console.log("Response demandeIndividuel:", response);
        if (response.data?.demandeIndividuel) {
          const demande = response.data.demandeIndividuel;
          this.demandeIndividuel.set(demande);
          this.garanties.set(demande.garanties || []);
          this.initializeForm();
          this.setupCalculations();
          this.preFillCreditParams(demande);
          if (response.data.hasDossierCredit && response.data.dossierCredit) {
            console.log("Dossier de cr\xE9dit existant trouv\xE9:", response.data.dossierCredit);
            this.handleExistingDossierWithPrevisions(response.data.dossierCredit);
          } else if (response.data.hasDemandeCredit && response.data.demande_credit) {
            this.handleExistingDemandeCredit(response.data.demande_credit);
          }
        }
        this.loadingDemande.set(false);
      },
      error: (error) => {
        console.error("Erreur chargement demande:", error);
        this.loadingDemande.set(false);
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Impossible de charger la demande individuelle"
        });
      }
    });
  }
  handleExistingDemandeCredit(demandeCredit) {
    console.log("Handling existing demande credit:", demandeCredit);
    this.messageService.add({
      severity: "info",
      summary: "Demande de cr\xE9dit existante",
      detail: "Une demande de cr\xE9dit existe mais aucun dossier d'analyse n'a \xE9t\xE9 cr\xE9\xE9"
    });
  }
  handleExistingDossierWithPrevisions(dossierCredit) {
    console.log("Handling existing dossier with previsions:", dossierCredit);
    this.creditParams.update((params) => __spreadProps(__spreadValues({}, params), {
      dossierId: dossierCredit.id,
      montantCredit: dossierCredit.montantDemande || params.montantCredit,
      duree: dossierCredit.dureeMois || params.duree,
      tauxInteret: dossierCredit.tauxInteret || params.tauxInteret
    }));
    this.creditParamsForm.patchValue({
      montantCredit: dossierCredit.montantDemande,
      duree: dossierCredit.dureeMois,
      tauxInteret: dossierCredit.tauxInteret
    }, { emitEvent: false });
    this.messageService.add({
      severity: "info",
      summary: "Dossier existant",
      detail: `Dossier de cr\xE9dit N\xB0${dossierCredit.id} trouv\xE9 - Chargement des pr\xE9visions...`
    });
    this.loadPrevisionsForDossier(dossierCredit.id);
  }
  loadPrevisionsForDossier(dossierId) {
    console.log("Loading previsions for dossier:", dossierId);
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: true }));
    this.userService.getPrevisionsTresorerie$(dossierId).subscribe({
      next: (response) => {
        if (response.data?.previsions?.length > 0) {
          this.tresorerieState.clearAll();
          const previsions = response.data.previsions;
          previsions.forEach((prevision) => {
            this.loadPrevisionIntoForm(prevision);
          });
          setTimeout(() => {
            this.calculateAllMonths();
            this.cdr.detectChanges();
          }, 100);
          this.messageService.add({
            severity: "success",
            summary: "Pr\xE9visions charg\xE9es",
            detail: `${previsions.length} mois charg\xE9s`
          });
        }
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: false }));
      },
      error: (error) => {
        console.error("Erreur chargement pr\xE9visions:", error);
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: false }));
      }
    });
  }
  /**
   * Charger une prévision dans le formulaire (pour le mode tableau)
   */
  loadPrevisionIntoForm(prevision) {
    const moisNum = prevision.numeroMois;
    const moisForm = this.getMoisFormGroup(moisNum);
    if (!moisForm) {
      console.warn(`FormGroup pour mois ${moisNum} non trouv\xE9`);
      return;
    }
    const formData = this.extractPrevisionFormData(prevision);
    moisForm.patchValue(formData, { emitEvent: false });
    this.tresorerieState.updatePrevision(
      moisNum,
      formData,
      true,
      // saved
      true
      // hasData
    );
    this.moisSauvegardes.update((set) => {
      set.add(moisNum);
      return new Set(set);
    });
    this.moisRenseignes.update((set) => {
      set.add(moisNum);
      return new Set(set);
    });
    console.log(`Mois ${moisNum} charg\xE9:`, formData);
  }
  // Méthode pour charger les prévisions avec meilleure gestion d'état
  loadPrevisionData(prevision) {
    const moisNum = prevision.numeroMois;
    const moisForm = this.getMoisFormGroup(moisNum);
    if (!moisForm) {
      console.warn(`FormGroup pour mois ${moisNum} non trouv\xE9`);
      return;
    }
    const formData = this.extractPrevisionFormData(prevision);
    moisForm.patchValue(formData, { emitEvent: false });
    this.tresorerieState.updatePrevision(
      moisNum,
      formData,
      true,
      // saved
      true
      // hasData
    );
    this.cdr.detectChanges();
  }
  // Nouvelle méthode pour extraire les données
  extractPrevisionFormData(prevision) {
    const formData = {
      soldeDebut: prevision.soldeDebut || 0,
      totalEncaissements: prevision.totalEncaissements || 0,
      totalDecaissements: prevision.totalDecaissements || 0,
      disponibleEnCaisse: (prevision.soldeDebut || 0) + (prevision.totalEncaissements || 0),
      excedentDeficit: prevision.excedentDeficit || 0,
      soldeFin: prevision.soldeFin || 0,
      // Valeurs par défaut pour tous les champs
      ventes: 0,
      autresRevenus: 0,
      pret: 0,
      achatmarchandises: 0,
      mainoeuvre: 0,
      investissement: 0,
      impotstaxes: 0,
      loyer: 0,
      utilities: 0,
      transport: 0,
      salaires: 0,
      fraistelephone: 0,
      chargesfinancieres: 0,
      entretien: 0,
      autresdepenses: 0,
      interetsAVerser: 0,
      remboursementCapital: 0
    };
    if (prevision.lignesEncaissement?.length) {
      prevision.lignesEncaissement.forEach((ligne) => {
        const montant = ligne.montant || 0;
        switch (ligne.categorie) {
          case "VENTES":
            formData.ventes = montant;
            break;
          case "AUTRES_REVENUS":
            formData.autresRevenus = montant;
            break;
          case "PRET":
            formData.pret = montant;
            break;
        }
      });
    }
    if (prevision.lignesDecaissement?.length) {
      prevision.lignesDecaissement.forEach((ligne) => {
        const montant = ligne.montant || 0;
        switch (ligne.categorie) {
          case "ACHAT_MARCHANDISES":
            formData.achatmarchandises = montant;
            break;
          case "MAIN_OEUVRE":
            formData.mainoeuvre = montant;
            break;
          case "INVESTISSEMENT":
            formData.investissement = montant;
            break;
          case "IMPOTS_TAXES":
            formData.impotstaxes = montant;
            break;
          case "LOYER":
            formData.loyer = montant;
            break;
          case "UTILITIES":
            formData.utilities = montant;
            break;
          case "TRANSPORT":
            formData.transport = montant;
            break;
          case "SALAIRES":
            formData.salaires = montant;
            break;
          case "FRAIS_TELEPHONE":
            formData.fraistelephone = montant;
            break;
          case "CHARGES_FINANCIERES":
            formData.chargesfinancieres = montant;
            break;
          case "ENTRETIEN":
            formData.entretien = montant;
            break;
          case "AUTRES_DEPENSES":
            formData.autresdepenses = montant;
            break;
          case "INTERETS":
            formData.interetsAVerser = montant;
            break;
          case "CAPITAL":
            formData.remboursementCapital = montant;
            break;
        }
      });
    }
    return formData;
  }
  // Gérer un dossier existant
  handleExistingDossier(dossierCredit) {
    console.log("Handling existing dossier:", dossierCredit);
    this.creditParams.update((params) => __spreadProps(__spreadValues({}, params), {
      dossierId: dossierCredit.id
    }));
    this.messageService.add({
      severity: "info",
      summary: "Dossier existant",
      detail: `Dossier de cr\xE9dit N\xB0${dossierCredit.id} trouv\xE9 - Chargement des pr\xE9visions...`
    });
    this.loadExistingPrevisionsForDossier(dossierCredit.id);
  }
  // Nouvelle méthode pour charger les prévisions d'un dossier existant
  loadExistingPrevisionsForDossier(dossierId) {
    console.log("Loading previsions for dossier:", dossierId);
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: true }));
    this.userService.getPrevisionsTresorerie$(dossierId).subscribe({
      next: (response) => {
        console.log("Previsions loaded:", response);
        if (response.data?.previsions && response.data.previsions.length > 0) {
          const previsions = response.data.previsions;
          previsions.forEach((prevision) => {
            const moisNum = prevision.numeroMois;
            const moisForm = this.getMoisFormGroup(moisNum);
            if (moisForm) {
              moisForm.patchValue({
                soldeDebut: prevision.soldeDebut || 0,
                totalEncaissements: prevision.totalEncaissements || 0,
                totalDecaissements: prevision.totalDecaissements || 0,
                excedentDeficit: prevision.excedentDeficit || 0,
                soldeFin: prevision.soldeFin || 0
              });
              if (prevision.lignesEncaissement) {
                prevision.lignesEncaissement.forEach((ligne) => {
                  switch (ligne.categorie) {
                    case "VENTES":
                      moisForm.patchValue({ ventes: ligne.montant });
                      break;
                    case "AUTRES_REVENUS":
                      moisForm.patchValue({ autresRevenus: ligne.montant });
                      break;
                    case "PRET":
                      moisForm.patchValue({ pret: ligne.montant });
                      break;
                  }
                });
              }
              if (prevision.lignesDecaissement) {
                prevision.lignesDecaissement.forEach((ligne) => {
                  switch (ligne.categorie) {
                    case "ACHAT_MARCHANDISES":
                      moisForm.patchValue({ achatmarchandises: ligne.montant });
                      break;
                    case "MAIN_OEUVRE":
                      moisForm.patchValue({ mainoeuvre: ligne.montant });
                      break;
                    case "INVESTISSEMENT":
                      moisForm.patchValue({ investissement: ligne.montant });
                      break;
                    case "IMPOTS_TAXES":
                      moisForm.patchValue({ impotstaxes: ligne.montant });
                      break;
                    case "LOYER":
                      moisForm.patchValue({ loyer: ligne.montant });
                      break;
                    case "UTILITIES":
                      moisForm.patchValue({ utilities: ligne.montant });
                      break;
                    case "TRANSPORT":
                      moisForm.patchValue({ transport: ligne.montant });
                      break;
                    case "SALAIRES":
                      moisForm.patchValue({ salaires: ligne.montant });
                      break;
                    case "FRAIS_TELEPHONE":
                      moisForm.patchValue({ fraistelephone: ligne.montant });
                      break;
                    case "CHARGES_FINANCIERES":
                      moisForm.patchValue({ chargesfinancieres: ligne.montant });
                      break;
                    case "ENTRETIEN":
                      moisForm.patchValue({ entretien: ligne.montant });
                      break;
                    case "AUTRES_DEPENSES":
                      moisForm.patchValue({ autresdepenses: ligne.montant });
                      break;
                    case "INTERETS":
                      moisForm.patchValue({ interetsAVerser: ligne.montant });
                      break;
                    case "CAPITAL":
                      moisForm.patchValue({ remboursementCapital: ligne.montant });
                      break;
                  }
                });
              }
              this.moisSauvegardes.update((set) => {
                set.add(moisNum);
                return new Set(set);
              });
              this.moisRenseignes.update((set) => {
                set.add(moisNum);
                return new Set(set);
              });
            }
          });
          this.calculateAllMonths();
          this.messageService.add({
            severity: "success",
            summary: "Pr\xE9visions charg\xE9es",
            detail: `${previsions.length} mois de pr\xE9visions charg\xE9s avec succ\xE8s`
          });
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Aucune pr\xE9vision",
            detail: "Aucune pr\xE9vision trouv\xE9e pour ce dossier. Vous pouvez commencer la saisie."
          });
        }
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: false }));
      },
      error: (error) => {
        console.error("Erreur chargement pr\xE9visions:", error);
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: false }));
        if (error.status !== 404) {
          this.messageService.add({
            severity: "warn",
            summary: "Attention",
            detail: "Impossible de charger les pr\xE9visions existantes"
          });
        }
      }
    });
  }
  // Pré-remplir les paramètres du crédit avec les données de la demande
  preFillCreditParams(demande) {
    this.creditParamsForm.patchValue({
      montantCredit: demande.montantDemande || 0,
      duree: demande.dureeDemande || 12,
      tauxInteret: demande.tauxInteret || 3
    });
    this.creditParams.update((params) => __spreadProps(__spreadValues({}, params), {
      montantCredit: demande.montantDemande || 0,
      duree: demande.dureeDemande || 12,
      tauxInteret: demande.tauxInteret || 3,
      clientNom: `${demande.prenom} ${demande.nom}`
    }));
    setTimeout(() => {
      this.applyCalculations();
    }, 100);
  }
  // Initialiser le formulaire des paramètres du crédit
  initializeCreditParamsForm() {
    this.creditParamsForm = this.fb.group({
      clientId: [null, Validators.required],
      montantCredit: [null, [Validators.required, Validators.min(1e5)]],
      duree: [12, [Validators.required, Validators.min(1), Validators.max(60)]],
      tauxInteret: [3, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
    this.creditParamsForm.valueChanges.subscribe((values) => {
      if (this.creditParamsForm.valid) {
        const client = this.clients().find((c) => c.id === values.clientId);
        this.creditParams.update((params) => __spreadProps(__spreadValues(__spreadValues({}, params), values), {
          clientNom: client ? `${client.prenom} ${client.nom}` : ""
        }));
      }
    });
  }
  // Initialiser le formulaire nouveau client
  initializeNewClientForm() {
    this.newClientForm = this.fb.group({
      nom: ["", Validators.required],
      prenom: ["", Validators.required],
      telephone: [
        "",
        [
          Validators.required,
          Validators.pattern(/^[0-9]{9}$/)
          // 9 chiffres exactement
        ]
      ],
      email: ["", Validators.email],
      adresse: [""],
      typeActivite: [""],
      numeroIdentite: [""]
    });
  }
  trackByIndex(index) {
    return index;
  }
  // Charger les paramètres initiaux depuis la route
  loadInitialParams() {
    const queryParams = this.route.snapshot.queryParams;
    if (queryParams["clientId"]) {
      this.creditParamsForm.patchValue({
        clientId: +queryParams["clientId"],
        montantCredit: queryParams["montant"] ? +queryParams["montant"] : null,
        duree: queryParams["duree"] ? +queryParams["duree"] : 12,
        tauxInteret: queryParams["taux"] ? +queryParams["taux"] : 3
      });
    }
  }
  // Méthode loadClientDossiers avec debug
  loadClientDossiers(clientId) {
    console.log("Loading dossiers for client:", clientId);
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: true }));
    this.userService.getDossiersByClient$(clientId).subscribe({
      next: (response) => {
        console.log("Response getDossiersByClient:", response);
        if (response?.data?.dossiers && response.data.dossiers.length > 0) {
          const dossiers = response.data.dossiers;
          this.dossiers.set(dossiers);
          const latestDossier = dossiers[0];
          console.log("Latest dossier:", latestDossier);
          this.selectedDossier.set(latestDossier);
          this.hasExistingAnalysis.set(true);
          this.showAnalysisChoiceDialog(latestDossier);
        } else {
          console.log("Pas de dossier trouv\xE9");
          this.hasExistingAnalysis.set(false);
          this.dossiers.set([]);
          this.selectedDossier.set(null);
          this.messageService.add({
            severity: "info",
            summary: "Nouveau client",
            detail: "Aucune analyse existante pour ce client"
          });
        }
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: false }));
      },
      error: (error) => {
        console.error("Erreur chargement dossiers:", error);
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: false }));
        this.hasExistingAnalysis.set(false);
        this.dossiers.set([]);
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Impossible de charger les dossiers"
        });
      }
    });
  }
  // Méthode showAnalysisChoiceDialog corrigée
  showAnalysisChoiceDialog(dossier) {
    console.log("Showing dialog for dossier:", dossier);
    const dateFormatted = this.formatDateFromArray(dossier.dateDemande);
    this.confirmationService.confirm({
      message: `Ce client a d\xE9j\xE0 un dossier (N\xB0${dossier.id}) du ${dateFormatted}. 
                      Montant: ${this.formatMontant(dossier.montantDemande)} | 
                      Dur\xE9e: ${dossier.dureeMois} mois | 
                      Taux: ${dossier.tauxInteret}% |
                      Statut: ${dossier.statut}`,
      header: "Analyse existante trouv\xE9e",
      icon: "pi pi-info-circle",
      acceptLabel: "Charger l'analyse",
      rejectLabel: "Nouvelle analyse",
      accept: () => {
        console.log("Chargement de l'analyse existante");
        this.loadExistingAnalysis(dossier);
      },
      reject: () => {
        console.log("Cr\xE9ation d'une nouvelle analyse");
        this.startNewAnalysis();
      }
    });
  }
  // Méthode pour formater les dates depuis les arrays Java
  formatDateFromArray(dateArray) {
    if (!dateArray)
      return "";
    if (typeof dateArray === "string") {
      return new Date(dateArray).toLocaleDateString("fr-FR");
    }
    if (Array.isArray(dateArray) && dateArray.length >= 3) {
      const [year, month, day] = dateArray;
      return new Date(year, month - 1, day).toLocaleDateString("fr-FR");
    }
    return "";
  }
  calculateAge(dateArray) {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3)
      return 0;
    const [year, month, day] = dateArray;
    const birthDate = new Date(year, month - 1, day);
    const today = /* @__PURE__ */ new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birthDate.getDate()) {
      age--;
    }
    return age;
  }
  getTotalGaranties() {
    return this.garanties().reduce((sum, g) => sum + (g.valeurGarantie || 0), 0);
  }
  getCouvertureGaranties() {
    const total = this.getTotalGaranties();
    const montant = this.creditParams().montantCredit;
    if (!montant || montant === 0)
      return 0;
    return total / montant * 100;
  }
  // Méthodes utilitaires
  formatDate(date) {
    if (!date)
      return "";
    return new Date(date).toLocaleDateString("fr-FR");
  }
  formatMontant(montant) {
    if (!montant)
      return "0 GNF";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "GNF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(montant);
  }
  // Démarrer une nouvelle analyse
  startNewAnalysis() {
    console.log("Starting new analysis");
    const currentClientId = this.creditParams().clientId;
    const currentClientNom = this.creditParams().clientNom;
    this.creditParams.update((params) => __spreadProps(__spreadValues({}, params), {
      dossierId: 0,
      montantCredit: 0,
      duree: 12,
      tauxInteret: 0
    }));
    this.creditParamsForm.patchValue({
      montantCredit: 0,
      duree: 12,
      tauxInteret: 0
    });
    this.resetTresorerieForm();
    this.messageService.add({
      severity: "info",
      summary: "Nouvelle analyse",
      detail: "Vous pouvez cr\xE9er une nouvelle analyse pour ce client"
    });
  }
  // Réinitialiser le formulaire de trésorerie
  resetTresorerieForm() {
    const duree = this.nombreMois();
    for (let mois = 1; mois <= duree; mois++) {
      const moisForm = this.getMoisFormGroup(mois);
      if (moisForm) {
        moisForm.reset({
          soldeDebut: mois === 1 ? 0 : null,
          ventes: 0,
          autresRevenus: 0,
          pret: 0,
          achatmarchandises: 0,
          mainoeuvre: 0,
          investissement: 0,
          impotstaxes: 0,
          loyer: 0,
          utilities: 0,
          transport: 0,
          salaires: 0,
          fraistelephone: 0,
          chargesfinancieres: 0,
          entretien: 0,
          autresdepenses: 0,
          interetsAVerser: 0,
          remboursementCapital: 0,
          totalEncaissements: 0,
          totalDecaissements: 0,
          disponibleEnCaisse: 0,
          excedentDeficit: 0,
          soldeFin: 0
        });
      }
    }
  }
  // Réinitialiser complètement le formulaire
  resetAll() {
    this.confirmationService.confirm({
      message: "\xCAtes-vous s\xFBr de vouloir r\xE9initialiser toutes les donn\xE9es ?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.creditParams.set({
          clientId: 0,
          clientNom: "",
          montantCredit: 0,
          duree: 12,
          tauxInteret: 0,
          dossierId: 0
        });
        this.creditParamsForm.reset({
          clientId: 0,
          montantCredit: 0,
          duree: 12,
          tauxInteret: 0
        });
        this.resetTresorerieForm();
        this.hasExistingAnalysis.set(false);
        this.selectedDossier.set(null);
        this.messageService.add({
          severity: "success",
          summary: "R\xE9initialisation",
          detail: "Toutes les donn\xE9es ont \xE9t\xE9 r\xE9initialis\xE9es"
        });
      }
    });
  }
  // Charger une analyse existante
  loadExistingAnalysis(dossier) {
    console.log("Loading existing analysis:", dossier);
    this.creditParams.update((params) => __spreadProps(__spreadValues({}, params), {
      dossierId: dossier.id,
      montantCredit: dossier.montantDemande,
      duree: dossier.dureeMois,
      tauxInteret: dossier.tauxInteret,
      clientNom: dossier.clientNomComplet
    }));
    this.creditParamsForm.patchValue({
      clientId: dossier.clientId,
      montantCredit: dossier.montantDemande,
      duree: dossier.dureeMois,
      tauxInteret: dossier.tauxInteret
    });
    this.applyCalculations();
    this.loadPrevisions(dossier.id);
    this.messageService.add({
      severity: "success",
      summary: "Analyse charg\xE9e",
      detail: `Dossier N\xB0${dossier.id} charg\xE9 avec succ\xE8s`
    });
  }
  // Charger les prévisions d'un dossier
  loadPrevisions(dossierId) {
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: true }));
    this.userService.getPrevisionsTresorerie$(dossierId).subscribe({
      next: (response) => {
        if (response.data?.previsions) {
          this.populatePrevisionsForm(response.data.previsions);
          response.data.previsions.forEach((prevision) => {
            this.moisSauvegardes.update((set) => {
              set.add(prevision.numeroMois);
              return new Set(set);
            });
            this.moisRenseignes.update((set) => {
              set.add(prevision.numeroMois);
              return new Set(set);
            });
          });
          response.data.previsions.forEach((prevision) => {
            this.loadLignesPrevision(prevision);
          });
        }
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: false }));
      },
      error: (error) => {
        console.error("Erreur chargement pr\xE9visions:", error);
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: false }));
      }
    });
  }
  // Remplir le formulaire avec les prévisions
  populatePrevisionsForm(previsions) {
    previsions.forEach((prevision) => {
      const moisForm = this.getMoisFormGroup(prevision.numeroMois);
      if (moisForm) {
        moisForm.patchValue({
          soldeDebut: prevision.soldeDebut,
          totalEncaissements: prevision.totalEncaissements,
          totalDecaissements: prevision.totalDecaissements,
          excedentDeficit: prevision.excedentDeficit,
          soldeFin: prevision.soldeFin
        });
      }
    });
  }
  // Charger les lignes d'une prévision
  loadLignesPrevision(prevision) {
    const moisNum = prevision.numeroMois;
    if (prevision.id) {
      this.userService.getLignesEncaissement$(prevision.id).subscribe({
        next: (response) => {
          if (response.data?.encaissements) {
            this.populateLignesEncaissement(moisNum, response.data.encaissements);
          }
        },
        error: (error) => console.error("Erreur chargement encaissements:", error)
      });
      this.userService.getLignesDecaissement$(prevision.id).subscribe({
        next: (response) => {
          if (response.data?.decaissements) {
            this.populateLignesDecaissement(moisNum, response.data.decaissements);
          }
        },
        error: (error) => console.error("Erreur chargement d\xE9caissements:", error)
      });
    }
  }
  // Remplir les lignes de décaissement
  populateLignesDecaissement(moisNum, lignes) {
    const moisForm = this.getMoisFormGroup(moisNum);
    if (!moisForm)
      return;
    lignes.forEach((ligne) => {
      switch (ligne.categorie) {
        case "ACHAT_MARCHANDISES":
          moisForm.patchValue({ achatmarchandises: ligne.montant });
          break;
        case "MAIN_OEUVRE":
          moisForm.patchValue({ mainoeuvre: ligne.montant });
          break;
        case "INVESTISSEMENT":
          moisForm.patchValue({ investissement: ligne.montant });
          break;
        case "IMPOTS_TAXES":
          moisForm.patchValue({ impotstaxes: ligne.montant });
          break;
        case "LOYER":
          moisForm.patchValue({ loyer: ligne.montant });
          break;
        case "UTILITIES":
          moisForm.patchValue({ utilities: ligne.montant });
          break;
        case "TRANSPORT":
          moisForm.patchValue({ transport: ligne.montant });
          break;
        case "SALAIRES":
          moisForm.patchValue({ salaires: ligne.montant });
          break;
        case "FRAIS_TELEPHONE":
          moisForm.patchValue({ fraistelephone: ligne.montant });
          break;
        case "CHARGES_FINANCIERES":
          moisForm.patchValue({ chargesfinancieres: ligne.montant });
          break;
        case "ENTRETIEN":
          moisForm.patchValue({ entretien: ligne.montant });
          break;
        case "AUTRES_DEPENSES":
          moisForm.patchValue({ autresdepenses: ligne.montant });
          break;
      }
    });
  }
  // Remplir les lignes d'encaissement
  populateLignesEncaissement(moisNum, lignes) {
    const moisForm = this.getMoisFormGroup(moisNum);
    if (!moisForm)
      return;
    lignes.forEach((ligne) => {
      switch (ligne.categorie) {
        case "VENTES":
          moisForm.patchValue({ ventes: ligne.montant });
          break;
        case "AUTRES_REVENUS":
          moisForm.patchValue({ autresRevenus: ligne.montant });
          break;
        case "PRET":
          moisForm.patchValue({ pret: ligne.montant });
          break;
      }
    });
  }
  // Méthode pour appliquer les calculs après mise à jour des paramètres
  applyCalculations() {
    this.calculateAllMonths();
    this.messageService.add({
      severity: "success",
      summary: "Param\xE8tres appliqu\xE9s",
      detail: "Les param\xE8tres du cr\xE9dit ont \xE9t\xE9 mis \xE0 jour"
    });
  }
  // Mettre à jour les remboursements dans le formulaire
  updateRemboursementsInForm(capital, interet) {
    for (let mois = 1; mois <= 12; mois++) {
      const moisForm = this.getMoisFormGroup(mois);
      if (moisForm) {
        moisForm.patchValue({
          interetsAVerser: interet,
          remboursementCapital: capital
        }, { emitEvent: false });
      }
    }
  }
  // Sauvegarder nouveau client
  saveNewClient() {
    if (this.newClientForm.invalid)
      return;
    this.savingClient = true;
    const clientData = this.newClientForm.value;
    this.userService.createClient$(clientData).subscribe({
      next: (response) => {
        if (response.data?.client) {
          const newClient = __spreadProps(__spreadValues({}, response.data.client), {
            nomComplet: `${response.data.client.prenom} ${response.data.client.nom}`
          });
          this.clients.update((clients) => [...clients, newClient]);
          this.creditParamsForm.patchValue({
            clientId: newClient.id
          });
          this.showNewClientDialog = false;
          this.messageService.add({
            severity: "success",
            summary: "Succ\xE8s",
            detail: "Client cr\xE9\xE9 avec succ\xE8s"
          });
        }
        this.savingClient = false;
      },
      error: (error) => {
        this.savingClient = false;
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Impossible de cr\xE9er le client"
        });
      }
    });
  }
  // Réinitialiser les paramètres
  resetCreditParams() {
    this.creditParamsForm.reset({
      clientId: null,
      montantCredit: null,
      duree: 12,
      tauxInteret: 3
    });
    this.creditParams.set({
      montantCredit: 0,
      tauxInteret: 0,
      duree: 12,
      clientId: 0,
      clientNom: "",
      dossierId: 0
    });
    this.initializeForm();
  }
  // Appliquer les paramètres
  applyCreditParams() {
    if (this.creditParamsForm.invalid) {
      Object.keys(this.creditParamsForm.controls).forEach((key) => {
        const control = this.creditParamsForm.get(key);
        control?.markAsTouched();
      });
      this.messageService.add({
        severity: "warn",
        summary: "Formulaire invalide",
        detail: "Veuillez remplir tous les champs obligatoires"
      });
      return;
    }
    if (!this.creditParams().dossierId || this.creditParams().dossierId === 0) {
      this.createDossierCredit();
    } else {
      this.applyCalculations();
    }
  }
  // Créer uniquement le dossier
  createDossierCredit() {
    const params = this.creditParams();
    const demande = this.demandeIndividuel();
    const dossierData = {
      demandeindividuelId: this.demandeIndividuelId,
      clientId: params.clientId || null,
      montantDemande: params.montantCredit,
      dureeMois: params.duree,
      tauxInteret: params.tauxInteret,
      statut: "EN_COURS"
    };
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { saving: true }));
    this.userService.createDossierCredit$(dossierData).subscribe({
      next: (response) => {
        if (response.data?.dossier) {
          this.creditParams.update((params2) => __spreadProps(__spreadValues({}, params2), {
            dossierId: response.data.dossier.id
          }));
          this.messageService.add({
            severity: "success",
            summary: "Dossier cr\xE9\xE9",
            detail: `Dossier N\xB0${response.data.dossier.id} cr\xE9\xE9 avec succ\xE8s`
          });
          this.applyCalculations();
        }
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { saving: false }));
      },
      error: (error) => {
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { saving: false }));
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Impossible de cr\xE9er le dossier de cr\xE9dit"
        });
      }
    });
  }
  // Charger les paramètres depuis la route ou l'API
  loadCreditParams() {
    const queryParams = this.route.snapshot.queryParams;
    const routeParams = this.route.snapshot.params;
    const clientId = queryParams["clientId"] || routeParams["clientId"];
    const dossierId = queryParams["dossierId"] || routeParams["dossierId"];
    const montant = queryParams["montant"] || routeParams["montant"];
    const duree = queryParams["duree"] || routeParams["duree"];
    const taux = queryParams["taux"] || routeParams["taux"];
    const clientNom = queryParams["clientNom"] || routeParams["clientNom"];
    if (dossierId) {
      this.loadDossierFromAPI(+dossierId);
    } else if (clientId) {
      this.creditParams.set({
        clientId: +clientId,
        dossierId: dossierId ? +dossierId : 0,
        montantCredit: montant ? +montant : 0,
        duree: duree ? +duree : 12,
        tauxInteret: taux ? +taux : 0,
        clientNom: clientNom || ""
      });
      if (!clientNom && clientId) {
        this.loadClientInfo(+clientId);
      }
    } else {
      this.messageService.add({
        severity: "warn",
        summary: "Param\xE8tres manquants",
        detail: "Veuillez s\xE9lectionner un client et d\xE9finir les param\xE8tres du cr\xE9dit"
      });
      this.router.navigate(["/credit/nouveau"]);
    }
  }
  // Charger les informations du dossier depuis l'API
  loadDossierFromAPI(dossierId) {
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: true }));
    this.userService.getDossierCredit$(dossierId).subscribe({
      next: (response) => {
        if (response.data?.dossier) {
          const dossier = response.data.dossier;
          this.creditParams.set({
            clientId: dossier.clientId,
            clientNom: dossier.clientNomComplet || "",
            dossierId: dossier.id,
            montantCredit: dossier.montantDemande,
            duree: dossier.dureeMois,
            tauxInteret: dossier.tauxInteret
          });
          this.loadExistingPrevisions(dossierId);
        }
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: false }));
      },
      error: (error) => {
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: false }));
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Impossible de charger les informations du dossier"
        });
        console.error("Erreur chargement dossier:", error);
      }
    });
  }
  loadExistingPrevisions(dossierId) {
    this.userService.getPrevisionsTresorerie$(dossierId).subscribe({
      next: (response) => {
        if (response.data?.previsions || response.data?.previsionsTresorerie) {
          const previsions = response.data.previsions || response.data.previsionsTresorerie;
          this.populateForm(previsions);
        }
      },
      error: (error) => {
        console.error("Erreur chargement pr\xE9visions:", error);
      }
    });
  }
  // Charger les informations du client
  loadClientInfo(clientId) {
    this.userService.getClient$(clientId).subscribe({
      next: (response) => {
        if (response.data?.client) {
          this.creditParams.update((params) => __spreadProps(__spreadValues({}, params), {
            clientNom: `${response.data.client?.prenom} ${response.data.client?.nom}`
          }));
        }
      },
      error: (error) => {
        console.error("Erreur chargement client:", error);
      }
    });
  }
  // Améliorer initializeForm pour initialiser correctement chaque mois
  initializeForm() {
    const moisGroups = {};
    const duree = this.nombreMois();
    for (let mois = 0; mois <= duree; mois++) {
      moisGroups[`mois${mois}`] = this.fb.group({
        numeroMois: [mois],
        soldeDebut: [{ value: null, disabled: mois > 0 }],
        // Encaissements
        ventes: [{ value: null, disabled: mois === 0 }],
        autresRevenus: [null],
        pret: [null],
        // Décaissements
        achatmarchandises: [null],
        mainoeuvre: [null],
        investissement: [null],
        impotstaxes: [null],
        loyer: [null],
        utilities: [null],
        transport: [null],
        salaires: [null],
        fraistelephone: [null],
        chargesfinancieres: [null],
        entretien: [null],
        autresdepenses: [null],
        // Remboursements
        interetsAVerser: [null],
        remboursementCapital: [null],
        // Calculs (toujours disabled)
        totalEncaissements: [{ value: 0, disabled: true }],
        totalDecaissements: [{ value: 0, disabled: true }],
        disponibleEnCaisse: [{ value: 0, disabled: true }],
        excedentDeficit: [{ value: 0, disabled: true }],
        soldeFin: [{ value: 0, disabled: true }]
      });
    }
    this.tresorerieForm = this.fb.group(moisGroups);
    const mois0Form = this.getMoisFormGroup(0);
    if (mois0Form) {
      mois0Form.patchValue({ soldeDebut: 0 }, { emitEvent: false });
    }
    this.setupFormChangeListeners();
  }
  // Améliorer checkIfMoisHasData pour considérer null comme vide
  checkIfMoisHasData(values) {
    if (!values)
      return false;
    const fieldsToCheck = [
      "ventes",
      "autresRevenus",
      "pret",
      "achatmarchandises",
      "mainoeuvre",
      "investissement",
      "impotstaxes",
      "loyer",
      "utilities",
      "transport",
      "salaires",
      "fraistelephone",
      "chargesfinancieres",
      "entretien",
      "autresdepenses",
      "interetsAVerser",
      "remboursementCapital"
    ];
    return fieldsToCheck.some((field) => {
      const value = values[field];
      return value !== null && value !== void 0 && value !== "" && value !== 0;
    });
  }
  // Obtenir le FormGroup d'un mois
  getMoisFormGroup(mois) {
    return this.tresorerieForm?.get(`mois${mois}`);
  }
  // Mise à jour de la méthode calculateMonth pour gérer les valeurs null
  calculateMonth(mois) {
    const moisForm = this.getMoisFormGroup(mois);
    if (!moisForm)
      return;
    const values = moisForm.getRawValue();
    const safeValue = (val) => {
      if (val === null || val === void 0 || val === "")
        return 0;
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    };
    const totalEnc = safeValue(values.ventes) + safeValue(values.autresRevenus) + safeValue(values.pret);
    const totalDec = safeValue(values.achatmarchandises) + safeValue(values.mainoeuvre) + safeValue(values.investissement) + safeValue(values.impotstaxes) + safeValue(values.loyer) + safeValue(values.utilities) + safeValue(values.transport) + safeValue(values.salaires) + safeValue(values.fraistelephone) + safeValue(values.chargesfinancieres) + safeValue(values.entretien) + safeValue(values.autresdepenses);
    const disponible = safeValue(values.soldeDebut) + totalEnc;
    const excedent = disponible - totalDec;
    const soldeFin = excedent - safeValue(values.interetsAVerser) - safeValue(values.remboursementCapital);
    moisForm.patchValue({
      totalEncaissements: totalEnc,
      totalDecaissements: totalDec,
      disponibleEnCaisse: disponible,
      excedentDeficit: excedent,
      soldeFin
    }, { emitEvent: false, onlySelf: true });
    const duree = this.nombreMois();
    if (mois < duree) {
      const nextMoisForm = this.getMoisFormGroup(mois + 1);
      if (nextMoisForm) {
        nextMoisForm.patchValue({ soldeDebut: soldeFin }, { emitEvent: false });
      }
    }
    this.cdr.markForCheck();
  }
  // Méthode pour réinitialiser un mois manuellement (bouton Réinitialiser)
  resetMonth(mois) {
    this.confirmationService.confirm({
      message: `\xCAtes-vous s\xFBr de vouloir r\xE9initialiser les donn\xE9es du ${this.getMoisLabel(mois)} ?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.resetMonthToDefaults(mois);
        this.tresorerieState.clearMonth(mois);
        for (let m = mois + 1; m <= 12; m++) {
          this.calculateMonth(m);
        }
        this.messageService.add({
          severity: "success",
          summary: "R\xE9initialisation",
          detail: `${this.getMoisLabel(mois)} r\xE9initialis\xE9 avec succ\xE8s`
        });
        this.cdr.detectChanges();
      }
    });
  }
  // Obtenir un résumé
  getFormSummary() {
    const monthsWithData = this.tresorerieState.getMonthsWithData();
    const savedMonths = this.tresorerieState.getSavedMonths();
    const totalMois = this.nombreMois() + 1;
    return {
      totalMois,
      moisRenseignes: monthsWithData.length,
      moisSauvegardes: savedMonths.length,
      pourcentageComplete: Math.round(monthsWithData.length / totalMois * 100),
      pourcentageSauvegarde: Math.round(savedMonths.length / totalMois * 100),
      peutSauvegarder: this.canSave()
    };
  }
  // Calculer tous les mois
  calculateAllMonths() {
    const duree = this.nombreMois();
    for (let mois = 0; mois <= duree; mois++) {
      this.calculateMonth(mois);
    }
  }
  // Écouter les changements
  setupCalculations() {
    const duree = this.nombreMois();
    for (let mois = 0; mois <= duree; mois++) {
      const moisForm = this.getMoisFormGroup(mois);
      if (!moisForm)
        continue;
      const fieldsToWatch = [
        "ventes",
        "autresRevenus",
        "pret",
        "achatmarchandises",
        "mainoeuvre",
        "investissement",
        "impotstaxes",
        "loyer",
        "utilities",
        "transport",
        "salaires",
        "fraistelephone",
        "chargesfinancieres",
        "entretien",
        "autresdepenses",
        "interetsAVerser",
        "remboursementCapital"
      ];
      fieldsToWatch.forEach((field) => {
        const control = moisForm.get(field);
        if (control) {
          control.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            if (mois === this.currentMonth()) {
              this.calculateMonth(mois);
            }
          });
        }
      });
    }
  }
  // Nouvelle méthode pour mettre à jour le statut d'un mois
  updateMoisStatus(mois, hasData) {
    if (hasData) {
      this.moisRenseignes.update((set) => {
        set.add(mois);
        return new Set(set);
      });
    } else {
      this.moisRenseignes.update((set) => {
        set.delete(mois);
        return new Set(set);
      });
      this.moisSauvegardes.update((set) => {
        set.delete(mois);
        return new Set(set);
      });
    }
  }
  // Appliquer les remboursements suggérés
  applySuggestedRepayments() {
    const mensualite = this.mensualite();
    const duree = this.nombreMois();
    if (mensualite.total === 0) {
      this.messageService.add({
        severity: "warn",
        summary: "Attention",
        detail: "Veuillez d'abord d\xE9finir les param\xE8tres du cr\xE9dit"
      });
      return;
    }
    this.confirmationService.confirm({
      message: `Voulez-vous appliquer les remboursements sugg\xE9r\xE9s aux mois 1 \xE0 ${duree} ?`,
      header: "Appliquer les remboursements",
      icon: "pi pi-question-circle",
      accept: () => {
        for (let mois = 1; mois <= duree; mois++) {
          const moisForm = this.getMoisFormGroup(mois);
          if (moisForm) {
            moisForm.patchValue({
              interetsAVerser: mensualite.interet,
              remboursementCapital: mensualite.capital
            });
          }
        }
        this.calculateAllMonths();
        this.messageService.add({
          severity: "success",
          summary: "Succ\xE8s",
          detail: `Remboursements appliqu\xE9s aux mois 1 \xE0 ${duree}`
        });
      }
    });
  }
  // Charger les données du client
  loadClientData() {
    const clientId = this.route.snapshot.queryParams["clientId"];
    const dossierId = this.route.snapshot.queryParams["dossierId"];
    if (clientId) {
      this.creditParams.update((params) => __spreadProps(__spreadValues({}, params), {
        clientId: +clientId,
        dossierId: dossierId ? +dossierId : 0
      }));
      this.loadExistingData(dossierId);
    }
  }
  // Charger les données existantes
  loadExistingData(dossierId) {
    if (!dossierId)
      return;
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: true }));
    this.userService.getPrevisionsTresorerie$(dossierId).subscribe({
      next: (response) => {
        if (response.data?.previsionsTresorerie) {
          this.populateForm(response.data.previsionsTresorerie);
        }
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: false }));
      },
      error: (error) => {
        this.state.update((s) => __spreadProps(__spreadValues({}, s), {
          loading: false,
          error
        }));
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Impossible de charger les donn\xE9es"
        });
      }
    });
  }
  // Remplir le formulaire avec les données existantes
  populateForm(data) {
    console.log("Populating form with:", data);
  }
  // Sauvegarder les prévisions
  savePrevisions() {
    if (!this.creditParams().dossierId || this.creditParams().dossierId === 0) {
      this.createDossierAndSavePrevisions();
      return;
    }
    this.saveAllPrevisions();
  }
  // Sauvegarder toutes les prévisions
  saveAllPrevisions() {
    const dossierId = this.creditParams().dossierId;
    if (!dossierId || dossierId === 0) {
      this.messageService.add({
        severity: "error",
        summary: "Erreur",
        detail: "ID du dossier invalide"
      });
      return;
    }
    const allPrevisionsData = this.prepareAllPrevisionsData();
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { saving: true }));
    this.userService.savePrevisionsTresorerie$(dossierId, allPrevisionsData).subscribe({
      next: (response) => {
        allPrevisionsData.forEach((prevision) => {
          this.tresorerieState.markAsSaved(prevision.numeroMois);
        });
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { saving: false }));
        this.messageService.add({
          severity: "success",
          summary: "Succ\xE8s",
          detail: "Toutes les pr\xE9visions ont \xE9t\xE9 sauvegard\xE9es"
        });
      },
      error: (error) => {
        console.error("Erreur sauvegarde globale:", error);
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { saving: false }));
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: error.error?.message || "Impossible de sauvegarder les pr\xE9visions"
        });
      }
    });
  }
  validateDataBeforeSave(data) {
    let isValid = true;
    data.forEach((prevision, index) => {
      console.log(`Validation Mois ${prevision.numeroMois}:`);
      const interets = prevision.lignesDecaissement.find((l) => l.categorie === "INTERETS");
      const capital = prevision.lignesDecaissement.find((l) => l.categorie === "CAPITAL");
      if (interets) {
        console.log(`  - Int\xE9r\xEAts: ${interets.montant} GNF`);
      } else {
        console.log(`  - Int\xE9r\xEAts: non d\xE9finis`);
      }
      if (capital) {
        console.log(`  - Capital: ${capital.montant} GNF`);
      } else {
        console.log(`  - Capital: non d\xE9fini`);
      }
      const totalEnc = prevision.lignesEncaissement.reduce((sum, l) => sum + l.montant, 0);
      const totalDec = prevision.lignesDecaissement.reduce((sum, l) => sum + l.montant, 0);
      console.log(`  - Total encaissements calcul\xE9: ${totalEnc}`);
      console.log(`  - Total d\xE9caissements calcul\xE9: ${totalDec}`);
    });
    return isValid;
  }
  /**
   * Préparer toutes les données pour la sauvegarde (version corrigée)
   */
  prepareAllPrevisionsData() {
    const previsions = [];
    const duree = this.nombreMois();
    for (let mois = 0; mois <= duree; mois++) {
      const moisForm = this.getMoisFormGroup(mois);
      if (moisForm && this.checkIfMoisHasData(moisForm.getRawValue())) {
        const monthData = this.prepareMonthData(mois);
        previsions.push(monthData);
      }
    }
    return previsions;
  }
  // Sauvegarder uniquement les prévisions
  savePrevisionsOnly() {
    const dossierId = this.creditParams().dossierId;
    if (!dossierId || dossierId === 0) {
      this.messageService.add({
        severity: "error",
        summary: "Erreur",
        detail: "ID du dossier invalide"
      });
      return;
    }
    const previsionData = this.preparePrevisionData();
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { saving: true }));
    this.userService.savePrevisionsTresorerie$(dossierId, previsionData).subscribe({
      next: (response) => {
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { saving: false }));
        this.messageService.add({
          severity: "success",
          summary: "Succ\xE8s",
          detail: "Pr\xE9visions de tr\xE9sorerie sauvegard\xE9es"
        });
      },
      error: (error) => {
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { saving: false }));
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: error.error?.message || "Impossible de sauvegarder les pr\xE9visions"
        });
        console.error("Erreur sauvegarde pr\xE9visions:", error);
      }
    });
  }
  // Créer le dossier puis sauvegarder
  createDossierAndSavePrevisions() {
    const params = this.creditParams();
    if (!params.clientId || !params.montantCredit || !params.duree) {
      this.messageService.add({
        severity: "error",
        summary: "Param\xE8tres manquants",
        detail: "Veuillez remplir tous les param\xE8tres du cr\xE9dit"
      });
      return;
    }
    const dossierData = {
      clientId: params.clientId,
      montantDemande: params.montantCredit,
      dureeMois: params.duree,
      tauxInteret: params.tauxInteret || 0,
      statut: "EN_COURS"
    };
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { saving: true }));
    this.userService.createDossierCredit$(dossierData).subscribe({
      next: (response) => {
        if (response.data?.dossier) {
          const dossierId = response.data.dossier.id;
          this.creditParams.update((p) => __spreadProps(__spreadValues({}, p), { dossierId }));
          this.messageService.add({
            severity: "success",
            summary: "Dossier cr\xE9\xE9",
            detail: `Dossier N\xB0${dossierId} cr\xE9\xE9 avec succ\xE8s`
          });
          this.savePrevisionsOnly();
        } else {
          throw new Error("R\xE9ponse invalide lors de la cr\xE9ation du dossier");
        }
      },
      error: (error) => {
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { saving: false }));
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Impossible de cr\xE9er le dossier de cr\xE9dit"
        });
        console.error("Erreur cr\xE9ation dossier:", error);
      }
    });
  }
  // Préparer les données de prévision
  preparePrevisionData() {
    const formData = this.tresorerieForm.getRawValue();
    const previsions = [];
    for (let mois = 1; mois <= 12; mois++) {
      const moisData = formData[`mois${mois}`];
      const prevision = {
        numeroMois: mois,
        soldeDebut: moisData.soldeDebut || 0,
        lignesEncaissement: [
          { categorie: "VENTES", libelle: "Ventes", montant: moisData.ventes || 0 },
          { categorie: "AUTRES_REVENUS", libelle: "Autres revenus", montant: moisData.autresRevenus || 0 },
          { categorie: "PRET", libelle: "Pr\xEAt", montant: moisData.pret || 0 }
        ].filter((l) => l.montant > 0),
        lignesDecaissement: [
          { categorie: "ACHAT_MARCHANDISES", libelle: "Achat marchandises", montant: moisData.achatmarchandises || 0 },
          { categorie: "MAIN_OEUVRE", libelle: "Main d'\u0153uvre", montant: moisData.mainoeuvre || 0 },
          { categorie: "INVESTISSEMENT", libelle: "Investissement", montant: moisData.investissement || 0 },
          { categorie: "IMPOTS_TAXES", libelle: "Imp\xF4ts et taxes", montant: moisData.impotstaxes || 0 },
          { categorie: "LOYER", libelle: "Loyer", montant: moisData.loyer || 0 },
          { categorie: "UTILITIES", libelle: "Utilities", montant: moisData.utilities || 0 },
          { categorie: "TRANSPORT", libelle: "Transport", montant: moisData.transport || 0 },
          { categorie: "SALAIRES", libelle: "Salaires", montant: moisData.salaires || 0 },
          { categorie: "FRAIS_TELEPHONE", libelle: "Frais t\xE9l\xE9phone", montant: moisData.fraistelephone || 0 },
          { categorie: "CHARGES_FINANCIERES", libelle: "Charges financi\xE8res", montant: moisData.chargesfinancieres || 0 },
          { categorie: "ENTRETIEN", libelle: "Entretien", montant: moisData.entretien || 0 },
          { categorie: "AUTRES_DEPENSES", libelle: "Autres d\xE9penses", montant: moisData.autresdepenses || 0 }
        ].filter((l) => l.montant > 0),
        totalEncaissements: moisData.totalEncaissements || 0,
        totalDecaissements: moisData.totalDecaissements || 0,
        excedentDeficit: moisData.excedentDeficit || 0,
        soldeFin: moisData.soldeFin || 0
      };
      previsions.push(prevision);
    }
    return previsions;
  }
  // Nouvelle méthode pour gérer la transition
  performMonthTransition(targetMonth) {
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { currentMonth: targetMonth }));
    this.ngZone.run(() => {
      this.refreshMonthData(targetMonth);
      this.updateFieldsStateForMonth(targetMonth);
      setTimeout(() => {
        this.calculateMonth(targetMonth);
        this.cdr.detectChanges();
      }, 0);
    });
  }
  // Méthode améliorée pour rafraîchir les données d'un mois
  refreshMonthData(mois) {
    const moisForm = this.getMoisFormGroup(mois);
    if (!moisForm)
      return;
    if (this.moisSauvegardes().has(mois)) {
      const currentValues = moisForm.getRawValue();
      moisForm.patchValue(currentValues, { emitEvent: false });
    } else if (this.moisRenseignes().has(mois)) {
      const currentValues = moisForm.getRawValue();
      moisForm.patchValue(currentValues, { emitEvent: false });
    } else {
      this.initializeEmptyMonth(mois);
    }
    moisForm.updateValueAndValidity({ emitEvent: false });
  }
  // NOUVELLE méthode pour gérer l'état des champs selon le mois
  updateFieldsStateForMonth(mois) {
    const moisForm = this.getMoisFormGroup(mois);
    if (!moisForm)
      return;
    const soldeDebutControl = moisForm.get("soldeDebut");
    if (soldeDebutControl) {
      if (mois === 0) {
        soldeDebutControl.enable({ emitEvent: false });
      } else {
        soldeDebutControl.disable({ emitEvent: false });
      }
    }
    const ventesControl = moisForm.get("ventes");
    const autresRevenusControl = moisForm.get("autresRevenus");
    if (mois === 0) {
      ventesControl?.disable({ emitEvent: false });
      ventesControl?.setValue(null, { emitEvent: false });
    } else {
      ventesControl?.enable({ emitEvent: false });
    }
    ["totalEncaissements", "totalDecaissements", "disponibleEnCaisse", "excedentDeficit", "soldeFin"].forEach((field) => {
      moisForm.get(field)?.disable({ emitEvent: false });
    });
  }
  // NOUVELLE méthode pour réinitialiser un mois avec les bonnes valeurs par défaut
  resetMonthToDefaults(mois) {
    const moisForm = this.getMoisFormGroup(mois);
    if (!moisForm)
      return;
    let soldeDebut = 0;
    if (mois === 0) {
      soldeDebut = 0;
    } else if (mois > 0) {
      const prevMoisForm = this.getMoisFormGroup(mois - 1);
      if (prevMoisForm) {
        const prevSoldeFin = prevMoisForm.get("soldeFin")?.value;
        soldeDebut = prevSoldeFin || 0;
      }
    }
    const defaultValues = {
      numeroMois: mois,
      soldeDebut,
      ventes: null,
      autresRevenus: null,
      pret: mois === 0 && this.creditParams().montantCredit > 0 ? this.creditParams().montantCredit : null,
      achatmarchandises: null,
      mainoeuvre: null,
      investissement: null,
      impotstaxes: null,
      loyer: null,
      utilities: null,
      transport: null,
      salaires: null,
      fraistelephone: null,
      chargesfinancieres: null,
      entretien: null,
      autresdepenses: null,
      // NE PAS pré-remplir les remboursements - laisser NULL
      interetsAVerser: null,
      remboursementCapital: null,
      totalEncaissements: 0,
      totalDecaissements: 0,
      disponibleEnCaisse: 0,
      excedentDeficit: 0,
      soldeFin: 0
    };
    moisForm.reset(defaultValues, { emitEvent: false });
    moisForm.markAsPristine();
    moisForm.markAsUntouched();
    this.calculateMonth(mois);
    moisForm.updateValueAndValidity();
    this.cdr.detectChanges();
  }
  // Nouvelle méthode pour initialiser un mois vide
  initializeEmptyMonth(mois) {
    const moisForm = this.getMoisFormGroup(mois);
    if (!moisForm)
      return;
    let soldeDebut = 0;
    if (mois === 0) {
      soldeDebut = 0;
    } else if (mois > 0) {
      const prevMoisForm = this.getMoisFormGroup(mois - 1);
      if (prevMoisForm) {
        soldeDebut = prevMoisForm.get("soldeFin")?.value || 0;
      }
    }
    const defaultValues = {
      numeroMois: mois,
      soldeDebut,
      ventes: mois === 0 ? null : null,
      autresRevenus: mois === 0 ? null : null,
      pret: mois === 0 && this.creditParams().montantCredit > 0 ? this.creditParams().montantCredit : null,
      achatmarchandises: null,
      mainoeuvre: null,
      investissement: null,
      impotstaxes: null,
      loyer: null,
      utilities: null,
      transport: null,
      salaires: null,
      fraistelephone: null,
      chargesfinancieres: null,
      entretien: null,
      autresdepenses: null,
      interetsAVerser: mois > 0 && this.mensualite().interet > 0 ? this.mensualite().interet : null,
      remboursementCapital: mois > 0 && this.mensualite().capital > 0 ? this.mensualite().capital : null,
      totalEncaissements: 0,
      totalDecaissements: 0,
      disponibleEnCaisse: 0,
      excedentDeficit: 0,
      soldeFin: 0
    };
    moisForm.patchValue(defaultValues, { emitEvent: false });
    moisForm.markAsPristine();
    moisForm.markAsUntouched();
  }
  // SOLUTION 6: Nouvelle méthode pour rafraîchir le formulaire d'un mois
  refreshMonthForm(mois) {
    const moisForm = this.getMoisFormGroup(mois);
    if (!moisForm)
      return;
    const currentValues = moisForm.getRawValue();
    if (!this.moisRenseignes().has(mois) && !this.moisSauvegardes().has(mois)) {
      this.resetMonthFormValues(mois);
    } else {
      moisForm.patchValue(currentValues, { emitEvent: true });
    }
    moisForm.updateValueAndValidity();
    this.calculateMonth(mois);
  }
  // SOLUTION 7: Méthode pour réinitialiser les valeurs du formulaire
  resetMonthFormValues(mois) {
    const moisForm = this.getMoisFormGroup(mois);
    if (!moisForm)
      return;
    let soldeDebut = 0;
    if (mois === 0) {
      soldeDebut = 0;
    } else if (mois > 0) {
      const prevMoisForm = this.getMoisFormGroup(mois - 1);
      if (prevMoisForm) {
        soldeDebut = prevMoisForm.get("soldeFin")?.value || 0;
      }
    }
    const defaultValues = {
      numeroMois: mois,
      soldeDebut,
      ventes: 0,
      autresRevenus: 0,
      pret: mois === 0 ? this.creditParams().montantCredit : 0,
      achatmarchandises: 0,
      mainoeuvre: 0,
      investissement: 0,
      impotstaxes: 0,
      loyer: 0,
      utilities: 0,
      transport: 0,
      salaires: 0,
      fraistelephone: 0,
      chargesfinancieres: 0,
      entretien: 0,
      autresdepenses: 0,
      interetsAVerser: 0,
      remboursementCapital: 0,
      totalEncaissements: 0,
      totalDecaissements: 0,
      disponibleEnCaisse: 0,
      excedentDeficit: 0,
      soldeFin: 0
    };
    moisForm.reset(defaultValues);
    moisForm.updateValueAndValidity();
  }
  // Nouvelle méthode pour vérifier s'il y a des changements non sauvegardés
  hasUnsavedChanges(mois) {
    const moisForm = this.getMoisFormGroup(mois);
    if (!moisForm)
      return false;
    return moisForm.dirty && !this.moisSauvegardes().has(mois);
  }
  // Méthode améliorée pour procéder à la navigation
  proceedToMonth(mois) {
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { currentMonth: mois }));
    this.loadMonthData(mois);
    this.cdr.detectChanges();
  }
  // Nouvelle méthode pour charger les données d'un mois
  loadMonthData(mois) {
    const previsionState = this.tresorerieState.getPrevision(mois);
    const moisForm = this.getMoisFormGroup(mois);
    if (!moisForm)
      return;
    if (mois > 0) {
      const prevMoisForm = this.getMoisFormGroup(mois - 1);
      if (prevMoisForm) {
        const soldeFin = prevMoisForm.get("soldeFin")?.value || 0;
        moisForm.patchValue({ soldeDebut: soldeFin }, { emitEvent: false });
      }
    }
    if (previsionState && previsionState.hasData) {
      const dataToLoad = __spreadValues({}, previsionState.data);
      if (mois > 0) {
        delete dataToLoad.soldeDebut;
      }
      moisForm.patchValue(dataToLoad, { emitEvent: false });
      if (previsionState.saved) {
        moisForm.markAsPristine();
      } else {
        moisForm.markAsDirty();
      }
    } else {
      this.resetMonthToDefaults(mois);
    }
    this.calculateMonth(mois);
    this.updateFieldsStateForMonth(mois);
    this.cdr.detectChanges();
  }
  // Sauvegarder le mois actuel
  saveCurrentMonth() {
    const currentMonth = this.currentMonth();
    const moisForm = this.getMoisFormGroup(currentMonth);
    if (!moisForm || !this.creditParams().dossierId) {
      this.messageService.add({
        severity: "warn",
        summary: "Attention",
        detail: "Veuillez cr\xE9er un dossier avant de sauvegarder"
      });
      return;
    }
    if (!this.checkIfMoisHasData(moisForm.getRawValue())) {
      this.messageService.add({
        severity: "warn",
        summary: "Attention",
        detail: "Aucune donn\xE9e \xE0 sauvegarder pour ce mois"
      });
      return;
    }
    const monthData = this.prepareMonthData(currentMonth);
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { saving: true }));
    this.userService.savePrevisionsTresorerie$(this.creditParams().dossierId, [monthData]).subscribe({
      next: (response) => {
        this.tresorerieState.markAsSaved(currentMonth);
        moisForm.markAsPristine();
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { saving: false }));
        this.messageService.add({
          severity: "success",
          summary: "Succ\xE8s",
          detail: `Mois ${currentMonth} sauvegard\xE9 avec succ\xE8s`
        });
      },
      error: (error) => {
        console.error("Erreur sauvegarde:", error);
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { saving: false }));
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: error.error?.message || "Impossible de sauvegarder le mois"
        });
      }
    });
  }
  // Navigation entre les mois
  goToMonth(mois) {
    this.saveCurrentMonthState();
    this.calculateMonth(this.currentMonth());
    this.propagateSoldes();
    this.tresorerieState.setCurrentMonth(mois);
  }
  // Propager les soldes de fin vers les soldes de début des mois suivants
  propagateSoldes() {
    const duree = this.nombreMois();
    for (let m = 0; m < duree; m++) {
      const currentMoisForm = this.getMoisFormGroup(m);
      const nextMoisForm = this.getMoisFormGroup(m + 1);
      if (currentMoisForm && nextMoisForm) {
        const soldeFin = currentMoisForm.get("soldeFin")?.value || 0;
        nextMoisForm.patchValue({ soldeDebut: soldeFin }, { emitEvent: false });
      }
    }
  }
  saveCurrentMonthState() {
    const currentMonth = this.currentMonth();
    const currentForm = this.getMoisFormGroup(currentMonth);
    if (currentForm && this.checkIfMoisHasData(currentForm.getRawValue())) {
      this.tresorerieState.updatePrevision(currentMonth, currentForm.getRawValue(), this.moisSauvegardes().has(currentMonth), true);
    }
  }
  // Préparer les données d'un mois
  prepareMonthData(mois) {
    const moisData = this.getMoisFormGroup(mois).getRawValue();
    const safeNumber = (val) => {
      if (val === null || val === void 0 || val === "")
        return 0;
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    };
    const lignesEncaissement = [];
    if (safeNumber(moisData.ventes) > 0) {
      lignesEncaissement.push({
        categorie: "VENTES",
        libelle: "Ventes",
        montant: safeNumber(moisData.ventes)
      });
    }
    if (safeNumber(moisData.autresRevenus) > 0) {
      lignesEncaissement.push({
        categorie: "AUTRES_REVENUS",
        libelle: "Autres revenus",
        montant: safeNumber(moisData.autresRevenus)
      });
    }
    if (safeNumber(moisData.pret) > 0) {
      lignesEncaissement.push({
        categorie: "PRET",
        libelle: "Pr\xEAt",
        montant: safeNumber(moisData.pret)
      });
    }
    const lignesDecaissement = [];
    if (safeNumber(moisData.achatmarchandises) > 0) {
      lignesDecaissement.push({
        categorie: "ACHAT_MARCHANDISES",
        libelle: "Achat marchandises",
        montant: safeNumber(moisData.achatmarchandises)
      });
    }
    if (safeNumber(moisData.mainoeuvre) > 0) {
      lignesDecaissement.push({
        categorie: "MAIN_OEUVRE",
        libelle: "Main d'\u0153uvre",
        montant: safeNumber(moisData.mainoeuvre)
      });
    }
    if (safeNumber(moisData.investissement) > 0) {
      lignesDecaissement.push({
        categorie: "INVESTISSEMENT",
        libelle: "Investissement",
        montant: safeNumber(moisData.investissement)
      });
    }
    if (safeNumber(moisData.impotstaxes) > 0) {
      lignesDecaissement.push({
        categorie: "IMPOTS_TAXES",
        libelle: "Imp\xF4ts et taxes",
        montant: safeNumber(moisData.impotstaxes)
      });
    }
    if (safeNumber(moisData.loyer) > 0) {
      lignesDecaissement.push({
        categorie: "LOYER",
        libelle: "Loyer",
        montant: safeNumber(moisData.loyer)
      });
    }
    if (safeNumber(moisData.utilities) > 0) {
      lignesDecaissement.push({
        categorie: "UTILITIES",
        libelle: "Utilities",
        montant: safeNumber(moisData.utilities)
      });
    }
    if (safeNumber(moisData.transport) > 0) {
      lignesDecaissement.push({
        categorie: "TRANSPORT",
        libelle: "Transport",
        montant: safeNumber(moisData.transport)
      });
    }
    if (safeNumber(moisData.salaires) > 0) {
      lignesDecaissement.push({
        categorie: "SALAIRES",
        libelle: "Salaires",
        montant: safeNumber(moisData.salaires)
      });
    }
    if (safeNumber(moisData.fraistelephone) > 0) {
      lignesDecaissement.push({
        categorie: "FRAIS_TELEPHONE",
        libelle: "Frais t\xE9l\xE9phone",
        montant: safeNumber(moisData.fraistelephone)
      });
    }
    if (safeNumber(moisData.chargesfinancieres) > 0) {
      lignesDecaissement.push({
        categorie: "CHARGES_FINANCIERES",
        libelle: "Charges financi\xE8res",
        montant: safeNumber(moisData.chargesfinancieres)
      });
    }
    if (safeNumber(moisData.entretien) > 0) {
      lignesDecaissement.push({
        categorie: "ENTRETIEN",
        libelle: "Entretien",
        montant: safeNumber(moisData.entretien)
      });
    }
    if (safeNumber(moisData.autresdepenses) > 0) {
      lignesDecaissement.push({
        categorie: "AUTRES_DEPENSES",
        libelle: "Autres d\xE9penses",
        montant: safeNumber(moisData.autresdepenses)
      });
    }
    if (safeNumber(moisData.interetsAVerser) > 0) {
      lignesDecaissement.push({
        categorie: "INTERETS",
        libelle: "Int\xE9r\xEAts \xE0 verser",
        montant: safeNumber(moisData.interetsAVerser)
      });
    }
    if (safeNumber(moisData.remboursementCapital) > 0) {
      lignesDecaissement.push({
        categorie: "CAPITAL",
        libelle: "Remboursement capital",
        montant: safeNumber(moisData.remboursementCapital)
      });
    }
    return {
      numeroMois: mois,
      soldeDebut: safeNumber(moisData.soldeDebut),
      lignesEncaissement,
      lignesDecaissement,
      totalEncaissements: safeNumber(moisData.totalEncaissements),
      totalDecaissements: safeNumber(moisData.totalDecaissements),
      excedentDeficit: safeNumber(moisData.excedentDeficit),
      soldeFin: safeNumber(moisData.soldeFin)
    };
  }
  // Nouvelle méthode pour vider un formulaire de mois
  clearMoisForm(mois) {
    const moisForm = this.getMoisFormGroup(mois);
    if (!moisForm)
      return;
    let soldeDebut = null;
    if (mois === 0) {
      soldeDebut = 0;
    } else if (mois > 0) {
      const prevMoisForm = this.getMoisFormGroup(mois - 1);
      if (prevMoisForm) {
        soldeDebut = prevMoisForm.get("soldeFin")?.value || 0;
      }
    }
    const emptyValues = {
      numeroMois: mois,
      soldeDebut,
      ventes: null,
      autresRevenus: null,
      pret: null,
      achatmarchandises: null,
      mainoeuvre: null,
      investissement: null,
      impotstaxes: null,
      loyer: null,
      utilities: null,
      transport: null,
      salaires: null,
      fraistelephone: null,
      chargesfinancieres: null,
      entretien: null,
      autresdepenses: null,
      interetsAVerser: null,
      remboursementCapital: null,
      totalEncaissements: 0,
      totalDecaissements: 0,
      disponibleEnCaisse: 0,
      excedentDeficit: 0,
      soldeFin: 0
    };
    if (mois === 0 && this.creditParams().montantCredit > 0) {
      emptyValues.pret = this.creditParams().montantCredit;
    }
    moisForm.reset(emptyValues, { emitEvent: false });
    moisForm.updateValueAndValidity();
    setTimeout(() => {
      this.calculateMonth(mois);
    }, 0);
  }
  // SOLUTION 8: Améliorer setupFormChangeListeners
  setupFormChangeListeners() {
    const duree = this.nombreMois();
    for (let mois = 0; mois <= duree; mois++) {
      const moisForm = this.getMoisFormGroup(mois);
      if (!moisForm)
        continue;
      moisForm.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe((values) => {
        if (mois === this.currentMonth()) {
          const hasData = this.checkIfMoisHasData(values);
          if (hasData) {
            this.tresorerieState.updatePrevision(
              mois,
              values,
              false,
              // not saved yet
              true
              // has data
            );
          } else if (this.tresorerieState.getPrevision(mois)) {
            this.tresorerieState.clearMonth(mois);
          }
          this.calculateMonth(mois);
        }
      });
    }
  }
  // Vérifier si on peut sauvegarder
  canSave() {
    return this.moisRenseignes().size > 0 && this.creditParams().dossierId > 0 && !this.state().saving;
  }
  // Obtenir le statut d'un mois
  getMoisStatus(mois) {
    if (this.currentMonth() === mois) {
      return "current";
    }
    return this.tresorerieState.getMonthStatus(mois);
  }
  // Obtenir le label d'un mois
  getMoisLabel(mois) {
    return mois === 0 ? "Mois 0 (D\xE9marrage)" : `Mois ${mois}`;
  }
  // Basculer entre les vues
  toggleView() {
    this.state.update((s) => __spreadProps(__spreadValues({}, s), {
      viewMode: s.viewMode === "saisie" ? "vue-ensemble" : "saisie"
    }));
  }
  // Import Excel
  importExcel(event) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: true }));
      this.userService.importPrevisionsTresorerie$(this.creditParams().dossierId, formData).subscribe({
        next: (response) => {
          if (response.data) {
            this.populateForm(response.data);
            this.messageService.add({
              severity: "success",
              summary: "Succ\xE8s",
              detail: "Donn\xE9es import\xE9es avec succ\xE8s"
            });
          }
          this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: false }));
        },
        error: (error) => {
          this.state.update((s) => __spreadProps(__spreadValues({}, s), {
            loading: false,
            error
          }));
          this.messageService.add({
            severity: "error",
            summary: "Erreur",
            detail: "Erreur lors de l'import"
          });
        }
      });
    }
  }
  // Export Excel
  exportExcel() {
    this.userService.exportPrevisionsTresorerie$(this.creditParams().dossierId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `previsions_tresorerie_${this.creditParams().clientNom}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Impossible d'exporter les donn\xE9es"
        });
      }
    });
  }
  // Validation du formulaire
  validateAndProceed() {
    this.calculateAllMonths();
    const isValid = this.validateCoherence();
    if (isValid) {
      this.savePrevisions();
    } else {
      this.messageService.add({
        severity: "warn",
        summary: "Attention",
        detail: "Veuillez v\xE9rifier la coh\xE9rence des donn\xE9es"
      });
    }
  }
  // Valider la cohérence des données
  validateCoherence() {
    for (let mois = 1; mois <= 12; mois++) {
      if (this.tresorerieState.monthHasData(mois)) {
        const moisData = this.getMoisFormGroup(mois).getRawValue();
        const remboursementTotal = (moisData.interetsAVerser || 0) + (moisData.remboursementCapital || 0);
        if (moisData.excedentDeficit < remboursementTotal) {
          this.messageService.add({
            severity: "warn",
            summary: `Mois ${mois}`,
            detail: "L'exc\xE9dent ne couvre pas les remboursements"
          });
          return false;
        }
      }
    }
    return true;
  }
  // Obtenir le cumul total
  getCumuls() {
    let cumuls = {
      ventes: 0,
      autresRevenus: 0,
      pret: 0,
      totalEncaissements: 0,
      achatMarchandises: 0,
      totalDecaissements: 0,
      excedentDeficit: 0
    };
    for (let mois = 1; mois <= 12; mois++) {
      const moisData = this.getMoisFormGroup(mois).getRawValue();
      cumuls.ventes += moisData.ventes || 0;
      cumuls.autresRevenus += moisData.autresRevenus || 0;
      cumuls.pret += moisData.pret || 0;
      cumuls.totalEncaissements += moisData.totalEncaissements || 0;
      cumuls.achatMarchandises += moisData.achatMarchandises || 0;
      cumuls.totalDecaissements += moisData.totalDecaissements || 0;
      cumuls.excedentDeficit += moisData.excedentDeficit || 0;
    }
    return cumuls;
  }
  /**
   * Méthode pour imprimer le tableau de trésorerie
   */
  imprimerTableauTresorerie() {
    if (!this.tresorerieForm) {
      this.messageService.add({
        severity: "warn",
        summary: "Attention",
        detail: "Aucune donn\xE9e de tr\xE9sorerie disponible pour l'impression"
      });
      return;
    }
    const hasSomeData = this.getFormSummary().moisRenseignes > 0;
    if (!hasSomeData) {
      this.messageService.add({
        severity: "warn",
        summary: "Attention",
        detail: "Veuillez saisir au moins un mois de donn\xE9es avant d'imprimer"
      });
      return;
    }
    try {
      this.tresoreriePrintService.imprimerTableauTresorerie(this.tresorerieForm, this.creditParams(), this.demandeIndividuel());
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
   * Vérifie si l'impression est possible
   */
  peutImprimer() {
    return !!(this.tresorerieForm && this.getFormSummary().moisRenseignes > 0);
  }
  /**
   * Obtient un aperçu des données pour l'impression
   */
  getApercuImpression() {
    if (!this.peutImprimer())
      return "Aucune donn\xE9e disponible";
    const summary = this.getFormSummary();
    const creditParams = this.creditParams();
    const demandeur = this.demandeIndividuel();
    const nomClient = demandeur ? `${demandeur.prenom} ${demandeur.nom}` : creditParams.clientNom || "Client non d\xE9fini";
    const montant = this.formatMontant(creditParams.montantCredit);
    return `${nomClient} - ${montant} - ${summary.moisRenseignes} mois renseign\xE9s`;
  }
  /**
   * Prévisualisation avant impression
   */
  previsualiserTableauTresorerie() {
    if (!this.peutImprimer()) {
      this.messageService.add({
        severity: "warn",
        summary: "Attention",
        detail: "Aucune donn\xE9e disponible pour la pr\xE9visualisation"
      });
      return;
    }
    this.imprimerTableauTresorerie();
  }
  /**
   * Export en PDF (via impression navigateur)
   */
  exporterTableauPDF() {
    if (!this.peutImprimer()) {
      this.messageService.add({
        severity: "warn",
        summary: "Attention",
        detail: "Aucune donn\xE9e disponible pour l'export"
      });
      return;
    }
    this.messageService.add({
      severity: "info",
      summary: "Export PDF",
      detail: `Dans la fen\xEAtre d'impression, choisissez "Enregistrer au format PDF"`
    });
    setTimeout(() => {
      this.imprimerTableauTresorerie();
    }, 1e3);
  }
  /**
   * Validation avant impression
   */
  validerDonneesAvantImpression() {
    const summary = this.getFormSummary();
    if (summary.moisRenseignes === 0) {
      this.messageService.add({
        severity: "error",
        summary: "Donn\xE9es insuffisantes",
        detail: "Veuillez saisir au moins un mois de donn\xE9es"
      });
      return false;
    }
    if (!this.creditParams().montantCredit || this.creditParams().montantCredit === 0) {
      this.messageService.add({
        severity: "warn",
        summary: "Param\xE8tres incomplets",
        detail: "Le montant du cr\xE9dit n'est pas d\xE9fini"
      });
      return false;
    }
    return true;
  }
  /**
   * Impression avec options avancées
   */
  imprimerAvecOptions(options = {}) {
    if (!this.validerDonneesAvantImpression()) {
      return;
    }
    try {
      this.tresoreriePrintService.imprimerTableauTresorerie(this.tresorerieForm, this.creditParams(), this.demandeIndividuel());
      this.messageService.add({
        severity: "success",
        summary: "Impression",
        detail: "Document g\xE9n\xE9r\xE9 avec les options demand\xE9es"
      });
    } catch (error) {
      console.error("Erreur impression avec options:", error);
      this.messageService.add({
        severity: "error",
        summary: "Erreur",
        detail: "Impossible de g\xE9n\xE9rer le document avec ces options"
      });
    }
  }
  /**
   * Obtient un résumé des données pour affichage dans l'interface
   */
  getResumeImpressionPourAffichage() {
    if (!this.peutImprimer()) {
      return {
        status: "unavailable",
        message: "Donn\xE9es insuffisantes",
        details: "Veuillez saisir au moins un mois de pr\xE9visions"
      };
    }
    const summary = this.getFormSummary();
    const creditParams = this.creditParams();
    return {
      status: "ready",
      message: "Pr\xEAt pour impression",
      details: {
        moisRenseignes: summary.moisRenseignes,
        moisSauvegardes: summary.moisSauvegardes,
        client: this.demandeIndividuel() ? `${this.demandeIndividuel().prenom} ${this.demandeIndividuel().nom}` : creditParams.clientNom,
        montantCredit: this.formatMontant(creditParams.montantCredit),
        duree: `${creditParams.duree} mois`,
        tauxInteret: `${creditParams.tauxInteret}%`
      }
    };
  }
  splitButtonOptions = [
    {
      label: "Aper\xE7u avant impression",
      icon: "pi pi-eye",
      command: () => this.previsualiserTableauTresorerie()
    },
    {
      label: "Exporter en PDF",
      icon: "pi pi-file-pdf",
      command: () => this.exporterTableauPDF()
    },
    {
      separator: true
    },
    {
      label: "Imprimer avec en-t\xEAte",
      icon: "pi pi-id-card",
      command: () => this.imprimerAvecOptions({ inclureAnalyse: true })
    },
    {
      label: "Imprimer tableau seul",
      icon: "pi pi-table",
      command: () => this.imprimerTableauTresorerie()
    }
  ];
  // ========================================
  // MÉTHODES POUR LA VISUALISATION DES MOIS
  // ========================================
  /**
   * Obtient les statistiques d'un trimestre
   */
  getTrimestreStats(mois) {
    let filled = 0;
    let saved = 0;
    let empty = 0;
    mois.forEach((m) => {
      const status = this.getMoisStatus(m);
      if (status === "saved")
        saved++;
      else if (status === "filled")
        filled++;
      else
        empty++;
    });
    return { filled, saved, empty };
  }
  /**
   * Obtient le tooltip pour un mois
   */
  getMonthTooltip(mois) {
    const status = this.getMoisStatus(mois);
    const moisForm = this.getMoisFormGroup(mois);
    const soldeFin = moisForm?.get("soldeFin")?.value || 0;
    let tooltip = `Mois ${mois}`;
    if (status === "saved") {
      tooltip += " - \u2713 Sauvegard\xE9";
    } else if (status === "filled") {
      tooltip += " - \u26A0 Non sauvegard\xE9";
    } else {
      tooltip += " - \xC0 renseigner";
    }
    if (soldeFin !== 0) {
      tooltip += ` | Solde: ${this.formatMontant(soldeFin)}`;
    }
    return tooltip;
  }
  /**
   * Calcule le total annuel des encaissements
   */
  getTotalAnnuelEncaissements() {
    let total = 0;
    for (let m = 0; m <= 12; m++) {
      const moisForm = this.getMoisFormGroup(m);
      if (moisForm) {
        total += moisForm.get("totalEncaissements")?.value || 0;
      }
    }
    return total;
  }
  /**
   * Calcule le total annuel des décaissements
   */
  getTotalAnnuelDecaissements() {
    let total = 0;
    for (let m = 0; m <= 12; m++) {
      const moisForm = this.getMoisFormGroup(m);
      if (moisForm) {
        total += moisForm.get("totalDecaissements")?.value || 0;
      }
    }
    return total;
  }
  /**
   * Obtient le solde final du mois 12
   */
  getSoldeAnnuelFinal() {
    const duree = this.nombreMois();
    const dernierMoisForm = this.getMoisFormGroup(duree);
    return dernierMoisForm?.get("soldeFin")?.value || 0;
  }
  /**
   * Obtient la classe CSS pour le solde annuel
   */
  getSoldeAnnuelClass() {
    const solde = this.getSoldeAnnuelFinal();
    if (solde > 0)
      return "bg-green-50";
    if (solde < 0)
      return "bg-red-50";
    return "bg-gray-50";
  }
  /**
   * Navigue vers le premier mois vide
   */
  goToFirstEmptyMonth() {
    for (let m = 0; m <= 12; m++) {
      if (this.getMoisStatus(m) === "empty") {
        this.goToMonth(m);
        return;
      }
    }
  }
  /**
   * Vérifie s'il reste des mois vides
   */
  hasEmptyMonths() {
    for (let m = 0; m <= 12; m++) {
      if (this.getMoisStatus(m) === "empty") {
        return true;
      }
    }
    return false;
  }
  /**
   * Obtient le résumé de tous les mois pour l'affichage
   */
  getMoisResume() {
    const resume = [];
    const duree = this.nombreMois();
    for (let m = 0; m <= duree; m++) {
      const moisForm = this.getMoisFormGroup(m);
      resume.push({
        mois: m,
        status: this.getMoisStatus(m),
        soldeFin: moisForm?.get("soldeFin")?.value || 0
      });
    }
    return resume;
  }
  /**
   * Génère le contenu du tooltip pour une cellule
   */
  getCellTooltip(ligne, mois) {
    const value = this.getCellValue(ligne.id, mois);
    if (value === null || value === void 0) {
      return `${ligne.libelle} - M${mois}
Aucune valeur`;
    }
    const montantFormate = this.formatMontant(value);
    const status = this.getCellStatus(ligne.id, mois);
    let tooltip = `${ligne.libelle}
`;
    tooltip += `Mois ${mois}${mois === 0 ? " (D\xE9marrage)" : ""}
`;
    tooltip += `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`;
    tooltip += `\u{1F4B0} ${montantFormate}`;
    if (ligne.type === "calcul") {
      tooltip += `
\u{1F4CA} Calcul\xE9 automatiquement`;
    } else if (ligne.editable) {
      tooltip += `
\u270F\uFE0F Modifiable`;
      if (value !== 0 && mois < this.nombreMois()) {
        tooltip += `
\u27A1\uFE0F Clic droit pour copier`;
      }
    }
    if (value < 0) {
      tooltip += `
\u26A0\uFE0F Valeur n\xE9gative`;
    }
    return tooltip;
  }
  /**
   * Génère le tooltip pour la colonne cumul
   */
  getCumulTooltip(ligne) {
    const cumul = this.getCumulForLigne(ligne.id);
    const montantFormate = this.formatMontant(cumul);
    const duree = this.nombreMois();
    let tooltip = `${ligne.libelle}
`;
    tooltip += `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`;
    tooltip += `\u{1F4CA} Cumul M0 \xE0 M${duree}
`;
    tooltip += `\u{1F4B0} ${montantFormate}`;
    if (ligne.id === "soldeFin" || ligne.id === "soldeDebut") {
      tooltip = `${ligne.libelle}
`;
      tooltip += `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`;
      tooltip += `\u{1F4CA} Valeur au M${duree}
`;
      tooltip += `\u{1F4B0} ${montantFormate}`;
    }
    if (ligne.type !== "calcul" || ligne.id === "totalEncaissements" || ligne.id === "totalDecaissements") {
      const moyenne = cumul / (duree + 1);
      tooltip += `
\u{1F4C8} Moyenne: ${this.formatMontant(moyenne)}/mois`;
    }
    return tooltip;
  }
  /**
   * Obtient le statut d'une cellule pour le tooltip
   */
  getCellStatus(ligneId, mois) {
    if (this.moisSauvegardes().has(mois)) {
      return "saved";
    }
    if (this.moisRenseignes().has(mois)) {
      return "filled";
    }
    return "empty";
  }
  // Dans la classe du composant
  get isDurationLong() {
    return this.nombreMois() > 12 && this.nombreMois() <= 18;
  }
  get isDurationExtraLong() {
    return this.nombreMois() > 18;
  }
  static \u0275fac = function AnalyseFluxTresorerieComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AnalyseFluxTresorerieComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AnalyseFluxTresorerieComponent, selectors: [["app-analyse-flux-tresorerie"]], hostVars: 4, hostBindings: function AnalyseFluxTresorerieComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275classProp("duration-long", ctx.isDurationLong)("duration-extra-long", ctx.isDurationExtraLong);
    }
  }, features: [\u0275\u0275ProvidersFeature([MessageService, ConfirmationService])], decls: 10, vars: 3, consts: [[1, "analyse-flux-container"], ["class", "mb-3", 4, "ngIf"], ["class", "credit-status-section mb-4", 4, "ngIf"], ["pTemplate", "header"], [1, "dossier-required-overlay"], [1, "mb-3"], [1, "grid"], [1, "col-12", "md:col-6", "lg:col-4"], [1, "info-group"], [1, "text-sm", "text-gray-600"], [1, "font-semibold", "text-lg"], [1, "font-semibold"], [1, "text-sm", "text-gray-500", "ml-2"], [1, "pi", "pi-phone", "mr-1"], [1, "col-12"], [1, "col-12", "md:col-6", "lg:col-3"], [1, "font-semibold", "text-primary", "text-xl"], [1, "text-gray-500"], ["class", "col-12", 4, "ngIf"], [1, "flex", "justify-content-between", "align-items-center", "p-3"], [1, "pi", "pi-user", "mr-2"], ["severity", "info", 3, "value"], [1, "pi", "pi-shield", "mr-2"], ["styleClass", "p-datatable-sm", 3, "value", "scrollable"], ["pTemplate", "body"], [1, "text-right"], [1, "text-center"], [3, "value", "severity"], [1, "credit-status-section", "mb-4"], ["class", "dossier-existant", 4, "ngIf"], ["class", "dossier-a-creer", 4, "ngIf"], [1, "dossier-existant"], [1, "status-card", "bg-green-50", "border-round-lg", "border-1", "border-green-300", "p-3"], [1, "flex", "align-items-center", "justify-content-between", "flex-wrap", "gap-3"], [1, "flex", "align-items-center", "gap-3"], [1, "status-icon", "bg-green-500", "border-circle", "p-3"], [1, "pi", "pi-check-circle", "text-white", "text-2xl"], [1, "text-green-800", "font-bold", "text-lg"], [1, "text-green-600", "text-sm"], [1, "flex", "gap-2", "align-items-center"], ["severity", "success", "value", "Pr\xEAt pour saisie", "icon", "pi pi-check"], [1, "text-primary"], [1, "dossier-a-creer"], [1, "status-card", "bg-orange-50", "border-round-lg", "border-1", "border-orange-300", "p-3"], [1, "status-icon", "bg-orange-500", "border-circle", "p-3"], [1, "pi", "pi-exclamation-circle", "text-white", "text-2xl"], [1, "text-orange-800", "font-bold", "text-lg"], [1, "text-orange-600", "text-sm"], [1, "flex", "gap-2", "align-items-center", "flex-wrap"], [1, "mensualite-preview", "text-center", "px-3", "py-2", "bg-white", "border-round", "border-1", "border-orange-200"], [1, "text-xs", "text-gray-500"], [1, "font-bold", "text-primary", "text-lg"], ["label", "Cr\xE9er le dossier", "icon", "pi pi-plus-circle", "severity", "warn", "pTooltip", "Cr\xE9er le dossier pour pouvoir sauvegarder les pr\xE9visions", 3, "onClick", "loading"], [1, "card-header-tresorerie", "p-3"], [1, "flex", "justify-content-between", "align-items-center", "flex-wrap", "gap-2"], [1, "m-0", "flex", "align-items-center", "gap-2"], [1, "pi", "pi-table", "text-primary"], [1, "flex", "gap-2"], ["severity", "danger", "value", "Dossier requis", "icon", "pi pi-lock"], ["severity", "info", "icon", "pi pi-calendar", 3, "value", 4, "ngIf"], ["severity", "warn", "value", "Modifications", "icon", "pi pi-exclamation-triangle", 4, "ngIf"], ["severity", "success", "value", "Sauvegard\xE9", "icon", "pi pi-check", 4, "ngIf"], [1, "btn-group-print", "flex", "gap-1"], ["icon", "pi pi-print", "label", "Imprimer", "severity", "secondary", "size", "small", "pTooltip", "Cr\xE9ez d'abord le dossier pour imprimer", 3, "disabled"], ["severity", "info", "icon", "pi pi-calendar", 3, "value"], ["severity", "warn", "value", "Modifications", "icon", "pi pi-exclamation-triangle"], ["severity", "success", "value", "Sauvegard\xE9", "icon", "pi pi-check"], ["icon", "pi pi-print", "label", "Imprimer", "severity", "success", "size", "small", "pTooltip", "Imprimer le tableau", 3, "onClick"], ["icon", "pi pi-ellipsis-v", "size", "small", "severity", "success", "styleClass", "split-btn-only-icon", 3, "model"], [1, "overlay-content", "text-center", "p-5"], [1, "overlay-icon", "mb-4"], [1, "pi", "pi-lock", "text-6xl", "text-orange-500"], [1, "text-xl", "font-bold", "text-gray-800", "mb-2"], [1, "text-gray-600", "mb-4", "max-w-30rem", "mx-auto"], [1, "flex", "justify-content-center", "gap-3", "flex-wrap"], ["label", "Cr\xE9er le dossier maintenant", "icon", "pi pi-plus-circle", "severity", "warn", "size", "large", 3, "onClick", "loading"], [1, "mt-4", "text-sm", "text-gray-500"], [1, "pi", "pi-info-circle", "mr-1"], [1, "progress-banner", "mb-3"], [1, "solde-final-info", "mb-3", "p-3", "border-round", "flex", "justify-content-between", "align-items-center", 3, "ngClass"], [1, "text-sm"], [1, "font-bold", "text-2xl", 3, "ngClass"], [1, "tresorerie-table-wrapper"], [1, "tresorerie-table"], [1, "header-row"], [1, "col-libelle", "sticky-col"], [1, "col-mois", 3, "col-mois-0"], [1, "col-cumul"], [1, "actions-footer", "mt-4", "pt-4", "border-top-1", "surface-border"], [1, "flex", "justify-content-between", "align-items-center", "flex-wrap", "gap-3"], [1, "status-info", "flex", "align-items-center", "gap-2"], [1, "pi", "pi-info-circle", "text-primary"], [1, "text-orange-500"], [1, "text-green-600"], [1, "flex", "gap-2", "flex-wrap"], ["label", "Retour", "icon", "pi pi-arrow-left", "outlined", "", 3, "routerLink"], ["label", "Imprimer", "icon", "pi pi-print", "severity", "secondary"], ["label", "Sauvegarder", "icon", "pi pi-save", "severity", "success", 3, "onClick", "loading", "disabled"], [1, "p-3", "surface-100", "border-round-lg", "border-1", "surface-border"], [1, "flex", "align-items-center", "justify-content-between", "mb-2"], [1, "font-semibold", "text-gray-700"], [1, "pi", "pi-chart-line", "mr-2"], [3, "ngClass"], [1, "month-segments", "flex", "gap-1"], ["tooltipPosition", "top", 1, "month-segment", "flex-1", 3, "segment-empty", "segment-filled", "segment-saved", "pTooltip"], [1, "flex", "justify-content-between", "align-items-center", "mt-2"], [1, "flex", "gap-3", "text-xs"], [1, "flex", "align-items-center", "gap-1"], [1, "legend-dot", "bg-gray-300"], [1, "legend-dot", "bg-orange-400"], [1, "legend-dot", "bg-green-500"], ["tooltipPosition", "top", 1, "month-segment", "flex-1", 3, "pTooltip"], [1, "segment-label"], [1, "col-mois"], ["class", "block text-xs opacity-70", 4, "ngIf"], [1, "block", "text-xs", "opacity-70"], [1, "section-header-row"], [1, "flex", "align-items-center", "justify-content-between"], [1, "libelle-text"], ["tooltipPosition", "top", 1, "col-mois", 3, "col-mois-0", "cell-editable", "cell-readonly", "cell-negative", "cell-positive", "pTooltip", "tooltipOptions"], ["tooltipPosition", "top", 1, "col-cumul", 3, "pTooltip", "tooltipOptions"], [1, "cumul-value"], [1, "section-title", "section-encaissement"], [1, "pi", "pi-download", "mr-2"], [1, "section-title", "section-decaissement"], [1, "pi", "pi-upload", "mr-2"], [1, "section-title", "section-calcul"], [1, "pi", "pi-calculator", "mr-2"], [1, "section-title", "section-remboursement"], [1, "pi", "pi-money-bill", "mr-2"], ["tooltipPosition", "top", 1, "col-mois", 3, "pTooltip", "tooltipOptions"], [1, "cell-container"], [1, "cell-value-display"], ["mode", "decimal", "locale", "fr-FR", "inputStyleClass", "table-cell-input", 3, "ngModelChange", "ngModel", "minFractionDigits", "maxFractionDigits", "useGrouping", "placeholder"], ["pButton", "", "type", "button", "icon", "pi pi-arrow-right", "tooltipPosition", "top", 1, "copy-cell-btn", "p-button-text", "p-button-sm", "p-button-rounded", 3, "pTooltip"], ["pButton", "", "type", "button", "icon", "pi pi-arrow-right", "tooltipPosition", "top", 1, "copy-cell-btn", "p-button-text", "p-button-sm", "p-button-rounded", 3, "click", "pTooltip"], [1, "pi", "pi-check-circle", "mr-1"], ["label", "Imprimer", "icon", "pi pi-print", "severity", "secondary", 3, "onClick"]], template: function AnalyseFluxTresorerieComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "p-confirmDialog")(2, "p-toast");
      \u0275\u0275template(3, AnalyseFluxTresorerieComponent_p_card_3_Template, 60, 13, "p-card", 1);
      \u0275\u0275element(4, "p-divider");
      \u0275\u0275template(5, AnalyseFluxTresorerieComponent_div_5_Template, 3, 2, "div", 2);
      \u0275\u0275elementStart(6, "p-card");
      \u0275\u0275template(7, AnalyseFluxTresorerieComponent_ng_template_7_Template, 14, 5, "ng-template", 3)(8, AnalyseFluxTresorerieComponent_Conditional_8_Template, 21, 4, "div", 4)(9, AnalyseFluxTresorerieComponent_Conditional_9_Template, 33, 18);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275property("ngIf", ctx.demandeIndividuel());
      \u0275\u0275advance(2);
      \u0275\u0275property("ngIf", ctx.demandeIndividuel());
      \u0275\u0275advance(3);
      \u0275\u0275conditional(!ctx.hasDossierCredit() ? 8 : 9);
    }
  }, dependencies: [
    CommonModule,
    NgClass,
    NgIf,
    DecimalPipe,
    RouterLink,
    ButtonModule,
    ButtonDirective,
    Button,
    PrimeTemplate,
    TableModule,
    Table,
    InputNumberModule,
    InputNumber,
    CardModule,
    Card,
    ToastModule,
    Toast,
    DialogModule,
    DropdownModule,
    ReactiveFormsModule,
    NgControlStatus,
    FieldsetModule,
    DividerModule,
    Divider,
    InputTextModule,
    TextareaModule,
    TagModule,
    Tag,
    MessageModule,
    ConfirmDialog,
    ProgressBarModule,
    TooltipModule,
    Tooltip,
    BadgeModule,
    SplitButtonModule,
    SplitButton,
    FormsModule,
    NgModel
  ], styles: [`

.tresorerie-table-wrapper[_ngcontent-%COMP%] {
  overflow-x: auto;
  max-width: 100%;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.tresorerie-table[_ngcontent-%COMP%] {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  min-width: 1600px;
}
.tresorerie-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], 
.tresorerie-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {
  border: 1px solid #dee2e6;
  padding: 0.5rem;
  text-align: right;
  vertical-align: middle;
}
.tresorerie-table[_ngcontent-%COMP%]   .col-libelle[_ngcontent-%COMP%] {
  text-align: left;
  min-width: 200px;
  max-width: 250px;
  font-weight: 500;
  background: #f8f9fa;
}
.tresorerie-table[_ngcontent-%COMP%]   .col-libelle[_ngcontent-%COMP%]   .libelle-text[_ngcontent-%COMP%] {
  flex: 1;
}
.tresorerie-table[_ngcontent-%COMP%]   .col-libelle[_ngcontent-%COMP%]   .copy-btn[_ngcontent-%COMP%] {
  opacity: 0;
  transition: opacity 0.2s;
}
.tresorerie-table[_ngcontent-%COMP%]   .col-libelle[_ngcontent-%COMP%]:hover   .copy-btn[_ngcontent-%COMP%] {
  opacity: 1;
}
.tresorerie-table[_ngcontent-%COMP%]   .sticky-col[_ngcontent-%COMP%] {
  position: sticky;
  left: 0;
  z-index: 10;
}
.tresorerie-table[_ngcontent-%COMP%]   .col-mois[_ngcontent-%COMP%] {
  min-width: 115px;
  max-width: 140px;
  width: 115px;
}
.tresorerie-table[_ngcontent-%COMP%]   .col-mois-0[_ngcontent-%COMP%] {
  background: #fff3cd !important;
  border-left: 2px solid #ffc107;
}
.tresorerie-table[_ngcontent-%COMP%]   .col-cumul[_ngcontent-%COMP%] {
  min-width: 130px;
  width: 130px;
  background: #e9ecef;
  font-weight: bold;
  border-left: 2px solid #6c757d;
}
.tresorerie-table[_ngcontent-%COMP%]   .header-row[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {
  background:
    linear-gradient(
      135deg,
      #343a40 0%,
      #495057 100%);
  color: white;
  font-weight: 600;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 20;
  padding: 0.75rem 0.5rem;
}
.tresorerie-table[_ngcontent-%COMP%]   .header-row[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {
  font-weight: 400;
}
.tresorerie-table[_ngcontent-%COMP%]   .section-header-row[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {
  padding: 0.75rem 1rem;
  font-weight: bold;
  font-size: 0.9rem;
}
.tresorerie-table[_ngcontent-%COMP%]   .section-title.section-encaissement[_ngcontent-%COMP%] {
  background:
    linear-gradient(
      90deg,
      #d4edda 0%,
      #e8f5e9 100%);
  color: #155724;
}
.tresorerie-table[_ngcontent-%COMP%]   .section-title.section-decaissement[_ngcontent-%COMP%] {
  background:
    linear-gradient(
      90deg,
      #f8d7da 0%,
      #ffebee 100%);
  color: #721c24;
}
.tresorerie-table[_ngcontent-%COMP%]   .section-title.section-calcul[_ngcontent-%COMP%] {
  background:
    linear-gradient(
      90deg,
      #d1ecf1 0%,
      #e3f2fd 100%);
  color: #0c5460;
}
.tresorerie-table[_ngcontent-%COMP%]   .section-title.section-remboursement[_ngcontent-%COMP%] {
  background:
    linear-gradient(
      90deg,
      #fff3cd 0%,
      #fff8e1 100%);
  color: #856404;
}
.tresorerie-table[_ngcontent-%COMP%]   .row-solde-debut[_ngcontent-%COMP%] {
  background: #e3f2fd;
  font-weight: bold;
}
.tresorerie-table[_ngcontent-%COMP%]   .row-solde-debut[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {
  background: #e3f2fd;
}
.tresorerie-table[_ngcontent-%COMP%]   .row-encaissement[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:not(.col-libelle):not(.col-cumul) {
  background: #f1f8e9;
}
.tresorerie-table[_ngcontent-%COMP%]   .row-pret[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:not(.col-libelle):not(.col-cumul) {
  background: #c8e6c9;
}
.tresorerie-table[_ngcontent-%COMP%]   .row-total-enc[_ngcontent-%COMP%] {
  font-weight: bold;
}
.tresorerie-table[_ngcontent-%COMP%]   .row-total-enc[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {
  background: #a5d6a7 !important;
}
.tresorerie-table[_ngcontent-%COMP%]   .row-decaissement[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:not(.col-libelle):not(.col-cumul) {
  background: #ffebee;
}
.tresorerie-table[_ngcontent-%COMP%]   .row-total-dec[_ngcontent-%COMP%] {
  font-weight: bold;
}
.tresorerie-table[_ngcontent-%COMP%]   .row-total-dec[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {
  background: #ef9a9a !important;
}
.tresorerie-table[_ngcontent-%COMP%]   .row-calcul[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:not(.col-libelle):not(.col-cumul) {
  background: #f5f5f5;
}
.tresorerie-table[_ngcontent-%COMP%]   .row-excedent[_ngcontent-%COMP%] {
  font-weight: bold;
}
.tresorerie-table[_ngcontent-%COMP%]   .row-remboursement[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:not(.col-libelle):not(.col-cumul) {
  background: #fff3e0;
}
.tresorerie-table[_ngcontent-%COMP%]   .row-solde-fin[_ngcontent-%COMP%] {
  font-weight: bold;
  font-size: 1rem;
}
.tresorerie-table[_ngcontent-%COMP%]   .row-solde-fin[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {
  background: #bbdefb !important;
  border-top: 2px solid #2196f3;
}
.tresorerie-table[_ngcontent-%COMP%]   .cell-editable[_ngcontent-%COMP%] {
  background: white !important;
  cursor: text;
}
.tresorerie-table[_ngcontent-%COMP%]   .cell-editable[_ngcontent-%COMP%]:hover {
  background: #f0f7ff !important;
}
.tresorerie-table[_ngcontent-%COMP%]   .cell-editable[_ngcontent-%COMP%]:focus-within {
  outline: 2px solid #2196f3;
  outline-offset: -2px;
}
.tresorerie-table[_ngcontent-%COMP%]   .cell-readonly[_ngcontent-%COMP%] {
  cursor: default;
}
.tresorerie-table[_ngcontent-%COMP%]   .cell-negative[_ngcontent-%COMP%] {
  color: #dc3545 !important;
  font-weight: 600;
}
.tresorerie-table[_ngcontent-%COMP%]   .cell-positive[_ngcontent-%COMP%] {
  color: #28a745 !important;
}
.tresorerie-table[_ngcontent-%COMP%]   .cell-value-display[_ngcontent-%COMP%] {
  display: block;
  padding: 0.25rem;
  font-variant-numeric: tabular-nums;
}
.tresorerie-table[_ngcontent-%COMP%]   .cumul-value[_ngcontent-%COMP%] {
  font-weight: bold;
  color: #495057;
  font-variant-numeric: tabular-nums;
}
.cell-container[_ngcontent-%COMP%] {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  width: 100%;
  min-height: 32px;
}
.cell-container[_ngcontent-%COMP%]   p-inputNumber[_ngcontent-%COMP%] {
  flex: 1;
  min-width: 0;
}
.cell-container[_ngcontent-%COMP%]   p-inputNumber[_ngcontent-%COMP%]     .p-inputnumber {
  width: 100%;
}
.cell-container[_ngcontent-%COMP%]   p-inputNumber[_ngcontent-%COMP%]     .p-inputnumber-input, 
.cell-container[_ngcontent-%COMP%]   p-inputNumber[_ngcontent-%COMP%]     .table-cell-input {
  width: 100% !important;
  min-width: 75px;
  text-align: right !important;
  padding: 0.35rem 0.5rem !important;
  font-size: 0.85rem !important;
  border: 1px solid transparent !important;
  background: transparent !important;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-variant-numeric: tabular-nums;
}
.cell-container[_ngcontent-%COMP%]   p-inputNumber[_ngcontent-%COMP%]     .p-inputnumber-input:hover, 
.cell-container[_ngcontent-%COMP%]   p-inputNumber[_ngcontent-%COMP%]     .table-cell-input:hover {
  border-color: #90caf9 !important;
  background: white !important;
}
.cell-container[_ngcontent-%COMP%]   p-inputNumber[_ngcontent-%COMP%]     .p-inputnumber-input:focus, 
.cell-container[_ngcontent-%COMP%]   p-inputNumber[_ngcontent-%COMP%]     .table-cell-input:focus {
  border-color: #2196f3 !important;
  background: white !important;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2) !important;
  outline: none !important;
}
.cell-container[_ngcontent-%COMP%]   .copy-cell-btn[_ngcontent-%COMP%] {
  opacity: 0;
  transition: all 0.2s ease;
  padding: 0.2rem !important;
  width: 1.4rem !important;
  min-width: 1.4rem !important;
  height: 1.4rem !important;
  flex-shrink: 0;
  border-radius: 4px !important;
}
.cell-container[_ngcontent-%COMP%]   .copy-cell-btn[_ngcontent-%COMP%]   .pi[_ngcontent-%COMP%] {
  font-size: 0.65rem;
}
.cell-container[_ngcontent-%COMP%]   .copy-cell-btn[_ngcontent-%COMP%]:hover {
  background-color: #e3f2fd !important;
  color: #1976d2 !important;
  transform: scale(1.1);
}
.cell-container[_ngcontent-%COMP%]:hover   .copy-cell-btn[_ngcontent-%COMP%] {
  opacity: 1;
}
[_nghost-%COMP%]     .table-cell-input {
  width: 100% !important;
  text-align: right !important;
  padding: 0.35rem 0.5rem !important;
  font-size: 0.85rem !important;
  border: none !important;
  background: transparent !important;
}
[_nghost-%COMP%]     .table-cell-input:focus {
  outline: none !important;
  background: white !important;
}
[_nghost-%COMP%]     .p-inputnumber {
  width: 100%;
}
[_nghost-%COMP%]     .p-inputnumber-input {
  width: 100% !important;
  text-align: right !important;
  padding: 0.35rem 0.5rem !important;
  font-size: 0.85rem !important;
}
[_nghost-%COMP%]     .tresorerie-table .p-inputnumber-button-group {
  display: none;
}
.tableau-actions[_ngcontent-%COMP%] {
  border: 1px solid #dee2e6;
}
.solde-final-info[_ngcontent-%COMP%] {
  border: 2px solid;
  transition: all 0.3s ease;
}
@media (max-width: 1800px) {
  .tresorerie-table[_ngcontent-%COMP%] {
    min-width: 1400px;
  }
  .tresorerie-table[_ngcontent-%COMP%]   .col-mois[_ngcontent-%COMP%] {
    min-width: 105px;
    width: 105px;
  }
  .tresorerie-table[_ngcontent-%COMP%]   .col-cumul[_ngcontent-%COMP%] {
    min-width: 120px;
    width: 120px;
  }
}
@media (max-width: 1400px) {
  .tresorerie-table[_ngcontent-%COMP%] {
    font-size: 0.8rem;
    min-width: 1200px;
  }
  .tresorerie-table[_ngcontent-%COMP%]   .col-libelle[_ngcontent-%COMP%] {
    min-width: 170px;
  }
  .tresorerie-table[_ngcontent-%COMP%]   .col-mois[_ngcontent-%COMP%] {
    min-width: 95px;
    width: 95px;
  }
  .tresorerie-table[_ngcontent-%COMP%]   .col-cumul[_ngcontent-%COMP%] {
    min-width: 110px;
    width: 110px;
  }
  .tresorerie-table[_ngcontent-%COMP%]   .cell-container[_ngcontent-%COMP%]   p-inputNumber[_ngcontent-%COMP%]     .p-inputnumber-input {
    min-width: 65px;
    padding: 0.3rem 0.4rem !important;
    font-size: 0.8rem !important;
  }
  .tresorerie-table[_ngcontent-%COMP%]   .cell-container[_ngcontent-%COMP%]   .copy-cell-btn[_ngcontent-%COMP%] {
    width: 1.2rem !important;
    min-width: 1.2rem !important;
    height: 1.2rem !important;
  }
  .tresorerie-table[_ngcontent-%COMP%]   .cell-container[_ngcontent-%COMP%]   .copy-cell-btn[_ngcontent-%COMP%]   .pi[_ngcontent-%COMP%] {
    font-size: 0.6rem;
  }
}
@media (max-width: 768px) {
  .tresorerie-table[_ngcontent-%COMP%] {
    font-size: 0.75rem;
  }
  .tresorerie-table[_ngcontent-%COMP%]   .col-libelle[_ngcontent-%COMP%] {
    min-width: 150px;
  }
  .tresorerie-table[_ngcontent-%COMP%]   .col-mois[_ngcontent-%COMP%] {
    min-width: 80px;
    width: 80px;
  }
  .tresorerie-table[_ngcontent-%COMP%]   .col-cumul[_ngcontent-%COMP%] {
    min-width: 100px;
    width: 100px;
  }
  .tableau-actions[_ngcontent-%COMP%] {
    flex-direction: column;
  }
}
@media (hover: none) {
  .cell-container[_ngcontent-%COMP%]   .copy-cell-btn[_ngcontent-%COMP%] {
    opacity: 0.6;
  }
}
.duration-long[_nghost-%COMP%]   .tresorerie-table[_ngcontent-%COMP%]   .col-mois[_ngcontent-%COMP%], .duration-long   [_nghost-%COMP%]   .tresorerie-table[_ngcontent-%COMP%]   .col-mois[_ngcontent-%COMP%] {
  min-width: 90px;
  width: 90px;
}
.duration-long[_nghost-%COMP%]   .tresorerie-table[_ngcontent-%COMP%]   .cell-container[_ngcontent-%COMP%]   p-inputNumber[_ngcontent-%COMP%]     .p-inputnumber-input, .duration-long   [_nghost-%COMP%]   .tresorerie-table[_ngcontent-%COMP%]   .cell-container[_ngcontent-%COMP%]   p-inputNumber[_ngcontent-%COMP%]     .p-inputnumber-input {
  min-width: 60px;
  font-size: 0.78rem !important;
}
.duration-extra-long[_nghost-%COMP%]   .tresorerie-table[_ngcontent-%COMP%]   .col-mois[_ngcontent-%COMP%], .duration-extra-long   [_nghost-%COMP%]   .tresorerie-table[_ngcontent-%COMP%]   .col-mois[_ngcontent-%COMP%] {
  min-width: 80px;
  width: 80px;
}
.duration-extra-long[_nghost-%COMP%]   .tresorerie-table[_ngcontent-%COMP%]   .cell-container[_ngcontent-%COMP%]   p-inputNumber[_ngcontent-%COMP%]     .p-inputnumber-input, .duration-extra-long   [_nghost-%COMP%]   .tresorerie-table[_ngcontent-%COMP%]   .cell-container[_ngcontent-%COMP%]   p-inputNumber[_ngcontent-%COMP%]     .p-inputnumber-input {
  min-width: 52px;
  font-size: 0.72rem !important;
  padding: 0.25rem 0.3rem !important;
}
.duration-extra-long[_nghost-%COMP%]   .tresorerie-table[_ngcontent-%COMP%]   .cell-container[_ngcontent-%COMP%]   .copy-cell-btn[_ngcontent-%COMP%], .duration-extra-long   [_nghost-%COMP%]   .tresorerie-table[_ngcontent-%COMP%]   .cell-container[_ngcontent-%COMP%]   .copy-cell-btn[_ngcontent-%COMP%] {
  width: 1.1rem !important;
  min-width: 1.1rem !important;
  height: 1.1rem !important;
  padding: 0.15rem !important;
}
.duration-extra-long[_nghost-%COMP%]   .tresorerie-table[_ngcontent-%COMP%]   .cell-container[_ngcontent-%COMP%]   .copy-cell-btn[_ngcontent-%COMP%]   .pi[_ngcontent-%COMP%], .duration-extra-long   [_nghost-%COMP%]   .tresorerie-table[_ngcontent-%COMP%]   .cell-container[_ngcontent-%COMP%]   .copy-cell-btn[_ngcontent-%COMP%]   .pi[_ngcontent-%COMP%] {
  font-size: 0.55rem;
}
@keyframes _ngcontent-%COMP%_cellHighlight {
  0% {
    background-color: #fff3cd;
  }
  100% {
    background-color: inherit;
  }
}
.cell-changed[_ngcontent-%COMP%] {
  animation: _ngcontent-%COMP%_cellHighlight 0.5s ease;
}
@media print {
  .tableau-actions[_ngcontent-%COMP%], 
   .actions-footer[_ngcontent-%COMP%], 
   .copy-btn[_ngcontent-%COMP%], 
   .copy-cell-btn[_ngcontent-%COMP%] {
    display: none !important;
  }
  .tresorerie-table-wrapper[_ngcontent-%COMP%] {
    overflow: visible;
    box-shadow: none;
  }
  .tresorerie-table[_ngcontent-%COMP%] {
    font-size: 9pt;
  }
  .tresorerie-table[_ngcontent-%COMP%]   .sticky-col[_ngcontent-%COMP%] {
    position: static;
  }
  .tresorerie-table[_ngcontent-%COMP%]   .col-mois[_ngcontent-%COMP%] {
    min-width: 60px;
    width: auto;
  }
}
.credit-status-section[_ngcontent-%COMP%]   .status-card[_ngcontent-%COMP%] {
  transition: all 0.3s ease;
}
.credit-status-section[_ngcontent-%COMP%]   .status-card[_ngcontent-%COMP%]:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.credit-status-section[_ngcontent-%COMP%]   .status-icon[_ngcontent-%COMP%] {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.credit-status-section[_ngcontent-%COMP%]   .mensualite-preview[_ngcontent-%COMP%] {
  min-width: 140px;
}
.card-header-tresorerie[_ngcontent-%COMP%] {
  background:
    linear-gradient(
      135deg,
      #f8f9fa 0%,
      #ffffff 100%);
  border-bottom: 1px solid #e9ecef;
}
.btn-group-print[_ngcontent-%COMP%]   .p-button[_ngcontent-%COMP%] {
  border-radius: 6px 0 0 6px;
}
.btn-group-print[_ngcontent-%COMP%]   .p-splitbutton[_ngcontent-%COMP%]   .p-button[_ngcontent-%COMP%] {
  border-radius: 0 6px 6px 0;
  border-left: 1px solid rgba(255, 255, 255, 0.3);
}
[_nghost-%COMP%]     .split-btn-only-icon .p-splitbutton-defaultbutton {
  display: none;
}
[_nghost-%COMP%]     .split-btn-only-icon .p-splitbutton-menubutton {
  border-radius: 0 6px 6px 0 !important;
}
.print-ready-banner[_ngcontent-%COMP%]   .icon-container[_ngcontent-%COMP%] {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.p-tag[_ngcontent-%COMP%] {
  transition: transform 0.2s ease;
}
.p-tag[_ngcontent-%COMP%]:hover {
  transform: scale(1.05);
}
@media (max-width: 768px) {
  .credit-status-section[_ngcontent-%COMP%]   .status-card[_ngcontent-%COMP%]   .flex[_ngcontent-%COMP%] {
    flex-direction: column;
    text-align: center;
  }
  .credit-status-section[_ngcontent-%COMP%]   .status-card[_ngcontent-%COMP%]   .status-icon[_ngcontent-%COMP%] {
    margin: 0 auto;
  }
  .card-header-tresorerie[_ngcontent-%COMP%]   .flex[_ngcontent-%COMP%] {
    flex-direction: column;
    gap: 1rem;
  }
  .card-header-tresorerie[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {
    font-size: 1.2rem;
  }
  .print-ready-banner[_ngcontent-%COMP%]   .flex[_ngcontent-%COMP%] {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
}
.progress-banner[_ngcontent-%COMP%]   .p-progressbar[_ngcontent-%COMP%] {
  background: #e9ecef;
}
.progress-banner[_ngcontent-%COMP%]   .p-progressbar[_ngcontent-%COMP%]   .p-progressbar-value[_ngcontent-%COMP%] {
  background:
    linear-gradient(
      90deg,
      #3b82f6 0%,
      #10b981 100%);
  transition: width 0.5s ease;
}
.progress-banner.complete[_ngcontent-%COMP%]   .p-progressbar[_ngcontent-%COMP%]   .p-progressbar-value[_ngcontent-%COMP%] {
  background:
    linear-gradient(
      90deg,
      #10b981 0%,
      #059669 100%);
  animation: _ngcontent-%COMP%_pulse-success 2s infinite;
}
@keyframes _ngcontent-%COMP%_pulse-success {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
@media (max-width: 768px) {
  .progress-banner[_ngcontent-%COMP%]   .flex[_ngcontent-%COMP%] {
    flex-direction: column;
  }
  .progress-banner[_ngcontent-%COMP%]   .flex-grow-1[_ngcontent-%COMP%] {
    width: 100%;
    min-width: unset !important;
  }
}
.month-segments[_ngcontent-%COMP%] {
  height: 28px;
}
.month-segments[_ngcontent-%COMP%]   .month-segment[_ngcontent-%COMP%] {
  height: 100%;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  cursor: default;
}
.month-segments[_ngcontent-%COMP%]   .month-segment[_ngcontent-%COMP%]   .segment-label[_ngcontent-%COMP%] {
  font-size: 10px;
  font-weight: 600;
  color: white;
  opacity: 0.9;
}
.month-segments[_ngcontent-%COMP%]   .month-segment.segment-empty[_ngcontent-%COMP%] {
  background: #e5e7eb;
}
.month-segments[_ngcontent-%COMP%]   .month-segment.segment-empty[_ngcontent-%COMP%]   .segment-label[_ngcontent-%COMP%] {
  color: #9ca3af;
}
.month-segments[_ngcontent-%COMP%]   .month-segment.segment-filled[_ngcontent-%COMP%] {
  background:
    linear-gradient(
      135deg,
      #fb923c 0%,
      #f97316 100%);
}
.month-segments[_ngcontent-%COMP%]   .month-segment.segment-saved[_ngcontent-%COMP%] {
  background:
    linear-gradient(
      135deg,
      #22c55e 0%,
      #16a34a 100%);
}
.month-segments[_ngcontent-%COMP%]   .month-segment[_ngcontent-%COMP%]:hover {
  transform: scaleY(1.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}
.legend-dot[_ngcontent-%COMP%] {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  display: inline-block;
}
[_nghost-%COMP%]     .p-tooltip {
  max-width: 280px;
}
[_nghost-%COMP%]     .p-tooltip .p-tooltip-text {
  background:
    linear-gradient(
      135deg,
      #1e293b 0%,
      #334155 100%);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  line-height: 1.5;
  white-space: pre-line;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
[_nghost-%COMP%]     .p-tooltip .p-tooltip-arrow {
  border-top-color: #1e293b;
}
[_nghost-%COMP%]     .p-tooltip.p-tooltip-top .p-tooltip-arrow {
  border-top-color: #334155;
}
[_nghost-%COMP%]     .p-tooltip.p-tooltip-bottom .p-tooltip-arrow {
  border-bottom-color: #1e293b;
}
.cell-negative   [_nghost-%COMP%]     .p-tooltip .p-tooltip-text {
  background:
    linear-gradient(
      135deg,
      #7f1d1d 0%,
      #991b1b 100%);
  border-color: rgba(239, 68, 68, 0.3);
}
.cell-positive   [_nghost-%COMP%]     .p-tooltip .p-tooltip-text {
  background:
    linear-gradient(
      135deg,
      #14532d 0%,
      #166534 100%);
  border-color: rgba(34, 197, 94, 0.3);
}
.dossier-required-overlay[_ngcontent-%COMP%] {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background:
    linear-gradient(
      135deg,
      #fff7ed 0%,
      #ffedd5 50%,
      #fed7aa 100%);
  border-radius: 12px;
  border: 2px dashed #f97316;
  margin: 1rem 0;
  position: relative;
  overflow: hidden;
}
.dossier-required-overlay[_ngcontent-%COMP%]::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
}
.dossier-required-overlay[_ngcontent-%COMP%]   .overlay-content[_ngcontent-%COMP%] {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(249, 115, 22, 0.15);
  padding: 2.5rem;
  max-width: 500px;
  margin: 1rem;
}
.dossier-required-overlay[_ngcontent-%COMP%]   .overlay-icon[_ngcontent-%COMP%] {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  background:
    linear-gradient(
      135deg,
      #fff7ed 0%,
      #ffedd5 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #f97316;
  animation: _ngcontent-%COMP%_pulse-icon 2s ease-in-out infinite;
}
@keyframes _ngcontent-%COMP%_pulse-icon {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 15px rgba(249, 115, 22, 0);
  }
}
/*# sourceMappingURL=analyse-flux-tresorerie.component.css.map */`] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AnalyseFluxTresorerieComponent, { className: "AnalyseFluxTresorerieComponent", filePath: "src/app/pages/dashboard/credit/individuel/attente/detail/analyse-flux-tresorerie/analyse-flux-tresorerie.component.ts", lineNumber: 72 });
})();
export {
  AnalyseFluxTresorerieComponent
};
//# sourceMappingURL=chunk-3EINSIGK.js.map
