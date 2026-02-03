import {
  JavaDatePipe
} from "./chunk-O2RK2BKY.js";
import {
  ConfirmDialog,
  ConfirmDialogModule
} from "./chunk-JQ4E7TJM.js";
import "./chunk-LPU4RT7P.js";
import "./chunk-WWXP2HWK.js";
import "./chunk-CXW3XKZ2.js";
import {
  Toast,
  ToastModule
} from "./chunk-6SRYYUT2.js";
import {
  DividerModule
} from "./chunk-VDET62CU.js";
import {
  SortIcon,
  SortableColumn,
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
  ProgressSpinnerModule
} from "./chunk-Y2J5OGKB.js";
import {
  Router
} from "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
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
  BadgeModule,
  Button,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import "./chunk-AP3OAIHW.js";
import {
  ConfirmationService,
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
  CommonModule
} from "./chunk-SQQPVFHK.js";
import {
  computed,
  inject,
  signal,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵdefineComponent,
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
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// src/app/pages/dashboard/admin/demande-avance-salaire/mes-demandes-salaire/mes-demandes-salaire.component.ts
var _c0 = () => [5, 10, 25, 50];
var _c1 = () => ({ "min-width": "50rem" });
function MesDemandesSalaireComponent_ng_template_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 30);
    \u0275\u0275text(2, " ID ");
    \u0275\u0275element(3, "p-sortIcon", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "th", 32);
    \u0275\u0275text(5, " Matricule ");
    \u0275\u0275element(6, "p-sortIcon", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 34);
    \u0275\u0275text(8, " Montant ");
    \u0275\u0275element(9, "p-sortIcon", 35);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "N\xB0 Compte");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 36);
    \u0275\u0275text(13, " Statut ");
    \u0275\u0275element(14, "p-sortIcon", 37);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th", 38);
    \u0275\u0275text(16, " Date ");
    \u0275\u0275element(17, "p-sortIcon", 39);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "th", 40);
    \u0275\u0275text(19, "Actions");
    \u0275\u0275elementEnd()();
  }
}
function MesDemandesSalaireComponent_ng_template_40_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 45);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const demande_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(demande_r1.numeroCompte);
  }
}
function MesDemandesSalaireComponent_ng_template_40_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 46);
    \u0275\u0275text(1, "-");
    \u0275\u0275elementEnd();
  }
}
function MesDemandesSalaireComponent_ng_template_40_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 50);
    \u0275\u0275listener("onClick", function MesDemandesSalaireComponent_ng_template_40_Conditional_19_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r2);
      const demande_r1 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.confirmAnnuler(demande_r1));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const demande_r1 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("text", true)("rounded", true)("loading", ctx_r2.cancellingId() === demande_r1.id);
  }
}
function MesDemandesSalaireComponent_ng_template_40_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 49);
    \u0275\u0275text(1, "-");
    \u0275\u0275elementEnd();
  }
}
function MesDemandesSalaireComponent_ng_template_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "span", 41);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td")(5, "span", 42);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "td", 43)(8, "span", 44);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "td");
    \u0275\u0275template(11, MesDemandesSalaireComponent_ng_template_40_Conditional_11_Template, 2, 1, "span", 45)(12, MesDemandesSalaireComponent_ng_template_40_Conditional_12_Template, 2, 0, "span", 46);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td");
    \u0275\u0275element(14, "p-tag", 47);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td");
    \u0275\u0275text(16);
    \u0275\u0275pipe(17, "javaDate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "td");
    \u0275\u0275template(19, MesDemandesSalaireComponent_ng_template_40_Conditional_19_Template, 1, 3, "p-button", 48)(20, MesDemandesSalaireComponent_ng_template_40_Conditional_20_Template, 2, 0, "span", 49);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const demande_r1 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("#", demande_r1.id, "");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(demande_r1.matricule);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r2.formatMontant(demande_r1.amount));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(demande_r1.numeroCompte ? 11 : 12);
    \u0275\u0275advance(3);
    \u0275\u0275property("value", ctx_r2.getStatutLabel(demande_r1.statut))("severity", ctx_r2.getStatutSeverity(demande_r1.statut));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(17, 8, demande_r1.createdAt, "dd/MM/yyyy HH:mm"));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r2.canCancel(demande_r1) ? 19 : 20);
  }
}
function MesDemandesSalaireComponent_ng_template_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 51)(2, "div", 52);
    \u0275\u0275element(3, "i", 53);
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5, "Aucune demande trouv\xE9e");
    \u0275\u0275elementEnd();
    \u0275\u0275element(6, "p-button", 54);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(6);
    \u0275\u0275property("link", true);
  }
}
var MesDemandesSalaireComponent = class _MesDemandesSalaireComponent {
  salaireService = inject(UserService);
  router = inject(Router);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  // ==================== SIGNALS ====================
  isLoading = signal(false);
  demandes = signal([]);
  cancellingId = signal(null);
  // ==================== COMPUTED ====================
  // Demandes par statut
  demandesEncours = computed(() => this.demandes().filter((d) => d.statut === "ENCOURS"));
  demandesValidees = computed(() => this.demandes().filter((d) => d.statut === "VALIDER"));
  demandesConfirmees = computed(() => this.demandes().filter((d) => d.statut === "CONFIRMER"));
  demandesRejetees = computed(() => this.demandes().filter((d) => d.statut === "REJET"));
  demandesAnnulees = computed(() => this.demandes().filter((d) => d.statut === "ANNULLER"));
  // Total des demandes actives
  totalActif = computed(() => {
    return this.demandes().filter((d) => ["ENCOURS", "VALIDER", "CONFIRMER"].includes(d.statut)).reduce((sum, d) => sum + (d.amount || 0), 0);
  });
  // Compteurs
  countTotal = computed(() => this.demandes().length);
  countActives = computed(() => this.demandes().filter((d) => ["ENCOURS", "VALIDER", "CONFIRMER"].includes(d.statut)).length);
  // ==================== LIFECYCLE ====================
  ngOnInit() {
    this.loadDemandes();
  }
  // ==================== MÉTHODES ====================
  loadDemandes() {
    this.isLoading.set(true);
    this.salaireService.getMyDemandeSalary().subscribe({
      next: (response) => {
        if (response.data?.demandes) {
          this.demandes.set(response.data.demandes);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error("Erreur chargement demandes:", error);
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Impossible de charger vos demandes"
        });
        this.isLoading.set(false);
      }
    });
  }
  /**
   * Confirmer l'annulation d'une demande
   */
  confirmAnnuler(demande) {
    this.confirmationService.confirm({
      message: `\xCAtes-vous s\xFBr de vouloir annuler cette demande de ${this.formatMontant(demande.amount)} ?`,
      header: "Confirmation d'annulation",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Oui, annuler",
      rejectLabel: "Non",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => {
        this.annulerDemande(demande.id);
      }
    });
  }
  /**
   * Annuler une demande
   */
  annulerDemande(id) {
    this.cancellingId.set(id);
    this.salaireService.annulerDemandeSalary(id).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: "success",
          summary: "Succ\xE8s",
          detail: "Demande annul\xE9e avec succ\xE8s"
        });
        this.loadDemandes();
        this.cancellingId.set(null);
      },
      error: (error) => {
        console.error("Erreur annulation:", error);
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: error.error?.message || "Impossible d'annuler la demande"
        });
        this.cancellingId.set(null);
      }
    });
  }
  /**
   * Peut annuler une demande
   */
  canCancel(demande) {
    return demande.statut === "ENCOURS";
  }
  /**
   * Formater un montant en GNF
   */
  formatMontant(montant) {
    if (montant === void 0 || montant === null)
      return "-";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "GNF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(montant);
  }
  /**
   * Obtenir le severity du tag selon le statut
   */
  getStatutSeverity(statut) {
    switch (statut?.toUpperCase()) {
      case "ENCOURS":
        return "info";
      case "VALIDER":
        return "success";
      case "CONFIRMER":
        return "success";
      case "REJET":
        return "danger";
      case "ANNULLER":
        return "secondary";
      default:
        return "info";
    }
  }
  /**
   * Obtenir le libellé du statut
   */
  getStatutLabel(statut) {
    switch (statut?.toUpperCase()) {
      case "ENCOURS":
        return "En cours";
      case "VALIDER":
        return "Valid\xE9e";
      case "CONFIRMER":
        return "Confirm\xE9e";
      case "REJET":
        return "Rejet\xE9e";
      case "ANNULLER":
        return "Annul\xE9e";
      default:
        return statut;
    }
  }
  nouvelleDemande() {
    this.router.navigate(["/dashboards/demande-avance-salaire"]);
  }
  static \u0275fac = function MesDemandesSalaireComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MesDemandesSalaireComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MesDemandesSalaireComponent, selectors: [["app-mes-demandes-salaire"]], features: [\u0275\u0275ProvidersFeature([MessageService, ConfirmationService])], decls: 66, vars: 16, consts: [[1, "mes-demandes-container"], [1, "header-section"], [1, "pi", "pi-list"], [1, "subtitle"], [1, "stats-section"], [1, "stat-card"], [1, "stat-icon"], [1, "pi", "pi-file"], [1, "stat-info"], [1, "stat-value"], [1, "stat-label"], [1, "stat-card", "active"], [1, "pi", "pi-clock"], [1, "stat-card", "amount"], [1, "pi", "pi-wallet"], [1, "actions-bar"], ["icon", "pi pi-refresh", "label", "Actualiser", 3, "onClick", "text", "loading"], ["icon", "pi pi-plus", "label", "Nouvelle demande", 3, "onClick"], ["styleClass", "p-datatable-striped p-datatable-gridlines", "currentPageReportTemplate", "Affichage {first} \xE0 {last} sur {totalRecords} demandes", 3, "value", "paginator", "rows", "rowsPerPageOptions", "loading", "tableStyle", "showCurrentPageReport", "sortField", "sortOrder"], ["pTemplate", "header"], ["pTemplate", "body"], ["pTemplate", "emptymessage"], [1, "legend-section"], [1, "legend-items"], [1, "legend-item"], ["value", "En cours", "severity", "info"], ["value", "Valid\xE9e", "severity", "success"], ["value", "Confirm\xE9e", "severity", "success"], ["value", "Rejet\xE9e", "severity", "danger"], ["value", "Annul\xE9e", "severity", "secondary"], ["pSortableColumn", "id", 2, "width", "80px"], ["field", "id"], ["pSortableColumn", "matricule", 2, "width", "100px"], ["field", "matricule"], ["pSortableColumn", "amount"], ["field", "amount"], ["pSortableColumn", "statut", 2, "width", "120px"], ["field", "statut"], ["pSortableColumn", "createdAt", 2, "width", "150px"], ["field", "createdAt"], [2, "width", "100px"], [1, "id-badge"], [1, "matricule-badge"], [1, "text-right"], [1, "montant"], [1, "numero-compte"], [1, "no-data"], [3, "value", "severity"], ["icon", "pi pi-times", "severity", "danger", "pTooltip", "Annuler cette demande", 3, "text", "rounded", "loading"], [1, "no-action"], ["icon", "pi pi-times", "severity", "danger", "pTooltip", "Annuler cette demande", 3, "onClick", "text", "rounded", "loading"], ["colspan", "7", 1, "empty-message"], [1, "empty-content"], [1, "pi", "pi-inbox"], ["label", "Faire une demande", "icon", "pi pi-plus", "routerLink", "/dashboard/demande-avance-salaire", 3, "link"]], template: function MesDemandesSalaireComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "p-toast")(1, "p-confirmDialog");
      \u0275\u0275elementStart(2, "div", 0)(3, "div", 1)(4, "h2");
      \u0275\u0275element(5, "i", 2);
      \u0275\u0275text(6, " Mes demandes d'avance sur salaire");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "p", 3);
      \u0275\u0275text(8, "Consultez et g\xE9rez vos demandes d'avance");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(9, "div", 4)(10, "div", 5)(11, "div", 6);
      \u0275\u0275element(12, "i", 7);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 8)(14, "span", 9);
      \u0275\u0275text(15);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "span", 10);
      \u0275\u0275text(17, "Total demandes");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(18, "div", 11)(19, "div", 6);
      \u0275\u0275element(20, "i", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "div", 8)(22, "span", 9);
      \u0275\u0275text(23);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "span", 10);
      \u0275\u0275text(25, "Demandes actives");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(26, "div", 13)(27, "div", 6);
      \u0275\u0275element(28, "i", 14);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(29, "div", 8)(30, "span", 9);
      \u0275\u0275text(31);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "span", 10);
      \u0275\u0275text(33, "Montant total actif");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(34, "div", 15)(35, "p-button", 16);
      \u0275\u0275listener("onClick", function MesDemandesSalaireComponent_Template_p_button_onClick_35_listener() {
        return ctx.loadDemandes();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "p-button", 17);
      \u0275\u0275listener("onClick", function MesDemandesSalaireComponent_Template_p_button_onClick_36_listener() {
        return ctx.nouvelleDemande();
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(37, "p-card")(38, "p-table", 18);
      \u0275\u0275template(39, MesDemandesSalaireComponent_ng_template_39_Template, 20, 0, "ng-template", 19)(40, MesDemandesSalaireComponent_ng_template_40_Template, 21, 11, "ng-template", 20)(41, MesDemandesSalaireComponent_ng_template_41_Template, 7, 1, "ng-template", 21);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(42, "div", 22)(43, "h4");
      \u0275\u0275text(44, "L\xE9gende des statuts");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(45, "div", 23)(46, "div", 24);
      \u0275\u0275element(47, "p-tag", 25);
      \u0275\u0275elementStart(48, "span");
      \u0275\u0275text(49, "Demande en attente de validation");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(50, "div", 24);
      \u0275\u0275element(51, "p-tag", 26);
      \u0275\u0275elementStart(52, "span");
      \u0275\u0275text(53, "Demande valid\xE9e par le responsable");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(54, "div", 24);
      \u0275\u0275element(55, "p-tag", 27);
      \u0275\u0275elementStart(56, "span");
      \u0275\u0275text(57, "Demande confirm\xE9e et en traitement");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(58, "div", 24);
      \u0275\u0275element(59, "p-tag", 28);
      \u0275\u0275elementStart(60, "span");
      \u0275\u0275text(61, "Demande rejet\xE9e");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(62, "div", 24);
      \u0275\u0275element(63, "p-tag", 29);
      \u0275\u0275elementStart(64, "span");
      \u0275\u0275text(65, "Demande annul\xE9e par vous");
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(15);
      \u0275\u0275textInterpolate(ctx.countTotal());
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate(ctx.countActives());
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate(ctx.formatMontant(ctx.totalActif()));
      \u0275\u0275advance(4);
      \u0275\u0275property("text", true)("loading", ctx.isLoading());
      \u0275\u0275advance(3);
      \u0275\u0275property("value", ctx.demandes())("paginator", true)("rows", 10)("rowsPerPageOptions", \u0275\u0275pureFunction0(14, _c0))("loading", ctx.isLoading())("tableStyle", \u0275\u0275pureFunction0(15, _c1))("showCurrentPageReport", true)("sortField", "createdAt")("sortOrder", -1);
    }
  }, dependencies: [CommonModule, JavaDatePipe, TableModule, Table, PrimeTemplate, SortableColumn, SortIcon, CardModule, Card, ButtonModule, Button, TagModule, Tag, ToastModule, Toast, ConfirmDialogModule, ConfirmDialog, TooltipModule, Tooltip, BadgeModule, ProgressSpinnerModule, DividerModule], styles: ["\n\n.mes-demandes-container[_ngcontent-%COMP%] {\n  padding: 1.5rem;\n}\n.header-section[_ngcontent-%COMP%] {\n  margin-bottom: 2rem;\n}\n.header-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  color: var(--primary-color);\n  margin-bottom: 0.5rem;\n}\n.header-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  margin-right: 0.5rem;\n}\n.header-section[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n}\n.stats-section[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 1rem;\n  margin-bottom: 1.5rem;\n}\n.stats-section[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 8px;\n  padding: 1.5rem;\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);\n  border-left: 4px solid var(--surface-400);\n}\n.stats-section[_ngcontent-%COMP%]   .stat-card.active[_ngcontent-%COMP%] {\n  border-left-color: var(--blue-500);\n}\n.stats-section[_ngcontent-%COMP%]   .stat-card.active[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] {\n  background: var(--blue-100);\n  color: var(--blue-600);\n}\n.stats-section[_ngcontent-%COMP%]   .stat-card.amount[_ngcontent-%COMP%] {\n  border-left-color: var(--green-500);\n}\n.stats-section[_ngcontent-%COMP%]   .stat-card.amount[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] {\n  background: var(--green-100);\n  color: var(--green-600);\n}\n.stats-section[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  border-radius: 50%;\n  background: var(--surface-100);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.stats-section[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n}\n.stats-section[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]   .stat-info[_ngcontent-%COMP%]   .stat-value[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: var(--text-color);\n}\n.stats-section[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]   .stat-info[_ngcontent-%COMP%]   .stat-label[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  color: var(--text-color-secondary);\n}\n.actions-bar[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 1rem;\n}\n.id-badge[_ngcontent-%COMP%] {\n  background: var(--surface-200);\n  padding: 0.25rem 0.5rem;\n  border-radius: 4px;\n  font-family: monospace;\n  font-size: 0.85rem;\n}\n.matricule-badge[_ngcontent-%COMP%] {\n  background: var(--primary-100);\n  color: var(--primary-700);\n  padding: 0.25rem 0.75rem;\n  border-radius: 4px;\n  font-weight: 600;\n}\n.montant[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: var(--text-color);\n}\n.numero-compte[_ngcontent-%COMP%] {\n  font-family: monospace;\n  background: var(--surface-100);\n  padding: 0.25rem 0.5rem;\n  border-radius: 4px;\n}\n.no-data[_ngcontent-%COMP%], \n.no-action[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n}\n.empty-message[_ngcontent-%COMP%]   .empty-content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 3rem;\n}\n.empty-message[_ngcontent-%COMP%]   .empty-content[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  color: var(--surface-400);\n  margin-bottom: 1rem;\n}\n.empty-message[_ngcontent-%COMP%]   .empty-content[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  margin-bottom: 1rem;\n}\n.legend-section[_ngcontent-%COMP%] {\n  margin-top: 2rem;\n  padding: 1.5rem;\n  background: var(--surface-50);\n  border-radius: 8px;\n}\n.legend-section[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin: 0 0 1rem 0;\n  color: var(--text-color);\n}\n.legend-section[_ngcontent-%COMP%]   .legend-items[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1.5rem;\n}\n.legend-section[_ngcontent-%COMP%]   .legend-items[_ngcontent-%COMP%]   .legend-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.legend-section[_ngcontent-%COMP%]   .legend-items[_ngcontent-%COMP%]   .legend-item[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  color: var(--text-color-secondary);\n}\n@media (max-width: 768px) {\n  .stats-section[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .actions-bar[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 1rem;\n    align-items: stretch;\n  }\n  .legend-section[_ngcontent-%COMP%]   .legend-items[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 0.75rem;\n  }\n}\n/*# sourceMappingURL=mes-demandes-salaire.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MesDemandesSalaireComponent, { className: "MesDemandesSalaireComponent", filePath: "src/app/pages/dashboard/admin/demande-avance-salaire/mes-demandes-salaire/mes-demandes-salaire.component.ts", lineNumber: 29 });
})();
export {
  MesDemandesSalaireComponent
};
//# sourceMappingURL=chunk-5UWLYTPX.js.map
