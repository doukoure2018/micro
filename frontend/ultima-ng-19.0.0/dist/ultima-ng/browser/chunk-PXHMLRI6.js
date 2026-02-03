import {
  Message,
  MessageModule
} from "./chunk-CSEZIGTY.js";
import {
  Toast,
  ToastModule
} from "./chunk-6SRYYUT2.js";
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
import {
  SelectButton,
  SelectButtonModule
} from "./chunk-YEN5RMZS.js";
import "./chunk-XS7IVZ5T.js";
import "./chunk-CUABQE42.js";
import {
  Dropdown,
  DropdownModule
} from "./chunk-ZCIQCP6V.js";
import "./chunk-V6CKOH3G.js";
import "./chunk-DBPX6ILC.js";
import {
  IconField,
  IconFieldModule,
  InputIcon,
  InputIconModule
} from "./chunk-WIQZFAVH.js";
import "./chunk-CCBQFN2J.js";
import {
  ProgressSpinner,
  ProgressSpinnerModule
} from "./chunk-Y2J5OGKB.js";
import {
  takeUntilDestroyed
} from "./chunk-WRLBQDQK.js";
import "./chunk-KHEKFKWA.js";
import {
  InputText,
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
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-3HTR5OU7.js";
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
  DestroyRef,
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
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-ZKKMBKIA.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/pages/dashboard/admin/de/suivi-arrete-caisse/suivi-arrete-caisse.component.ts
var _c0 = () => [10, 25, 50, 100];
var _c1 = () => ["delegationNom", "agenceNom", "pointventeNom"];
var _c2 = () => ({ "min-width": "80rem" });
function SuiviArreteCaisseComponent_ng_template_47_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 42)(1, "h3");
    \u0275\u0275element(2, "i", 43);
    \u0275\u0275text(3, "Filtres");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p-selectButton", 44);
    \u0275\u0275listener("onChange", function SuiviArreteCaisseComponent_ng_template_47_Template_p_selectButton_onChange_4_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onViewModeChange($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("options", ctx_r1.viewModeOptions)("ngModel", ctx_r1.state().viewMode);
  }
}
function SuiviArreteCaisseComponent_Conditional_84_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 39);
    \u0275\u0275element(1, "p-progressSpinner", 45);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Chargement des donn\xE9es...");
    \u0275\u0275elementEnd()();
  }
}
function SuiviArreteCaisseComponent_Conditional_85_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 40);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("text", ctx_r1.state().error);
  }
}
function SuiviArreteCaisseComponent_Conditional_86_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 49);
    \u0275\u0275text(2, " ID ");
    \u0275\u0275element(3, "p-sortIcon", 50);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "th", 51);
    \u0275\u0275text(5, " D\xE9l\xE9gation ");
    \u0275\u0275element(6, "p-sortIcon", 52);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 53);
    \u0275\u0275text(8, " Agence ");
    \u0275\u0275element(9, "p-sortIcon", 54);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 55);
    \u0275\u0275text(11, " Point de vente ");
    \u0275\u0275element(12, "p-sortIcon", 56);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th", 57);
    \u0275\u0275text(14, " Montant ");
    \u0275\u0275element(15, "p-sortIcon", 58);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 59);
    \u0275\u0275text(17, " Date Arr\xEAt\xE9 ");
    \u0275\u0275element(18, "p-sortIcon", 60);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "th", 61);
    \u0275\u0275text(20, " Date Remont\xE9e ");
    \u0275\u0275element(21, "p-sortIcon", 62);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "th", 63);
    \u0275\u0275text(23, " Statut ");
    \u0275\u0275element(24, "p-sortIcon", 64);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "th", 65);
    \u0275\u0275text(26, "Document");
    \u0275\u0275elementEnd()();
  }
}
function SuiviArreteCaisseComponent_Conditional_86_ng_template_3_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const arrete_r3 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatDateTime(arrete_r3.dateRemonte), " ");
  }
}
function SuiviArreteCaisseComponent_Conditional_86_ng_template_3_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 68);
    \u0275\u0275text(1, "-");
    \u0275\u0275elementEnd();
  }
}
function SuiviArreteCaisseComponent_Conditional_86_ng_template_3_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 71);
    \u0275\u0275listener("onClick", function SuiviArreteCaisseComponent_Conditional_86_ng_template_3_Conditional_20_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r4);
      const arrete_r3 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openDocument(arrete_r3.document));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("text", true);
  }
}
function SuiviArreteCaisseComponent_Conditional_86_ng_template_3_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 68);
    \u0275\u0275element(1, "i", 72);
    \u0275\u0275text(2, " Non disponible ");
    \u0275\u0275elementEnd();
  }
}
function SuiviArreteCaisseComponent_Conditional_86_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "span", 66);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td", 67);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "td");
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "td");
    \u0275\u0275template(15, SuiviArreteCaisseComponent_Conditional_86_ng_template_3_Conditional_15_Template, 1, 1)(16, SuiviArreteCaisseComponent_Conditional_86_ng_template_3_Conditional_16_Template, 2, 0, "span", 68);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td");
    \u0275\u0275element(18, "p-tag", 69);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "td");
    \u0275\u0275template(20, SuiviArreteCaisseComponent_Conditional_86_ng_template_3_Conditional_20_Template, 1, 1, "p-button", 70)(21, SuiviArreteCaisseComponent_Conditional_86_ng_template_3_Conditional_21_Template, 3, 0, "span", 68);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const arrete_r3 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("#", arrete_r3.id, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(arrete_r3.delegationNom || "-");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(arrete_r3.agenceNom || "-");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(arrete_r3.pointventeNom || "-");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatMontant(arrete_r3.montant), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.formatDate(arrete_r3.dateArreteCaisse));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(arrete_r3.dateRemonte ? 15 : 16);
    \u0275\u0275advance(3);
    \u0275\u0275property("value", ctx_r1.getStatusLabel(arrete_r3.statut))("severity", ctx_r1.getStatusSeverity(arrete_r3.statut));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(arrete_r3.statut === "VALIDE" && arrete_r3.document ? 20 : 21);
  }
}
function SuiviArreteCaisseComponent_Conditional_86_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 73)(2, "div", 74);
    \u0275\u0275element(3, "i", 75);
    \u0275\u0275elementStart(4, "p", 76);
    \u0275\u0275text(5, "Aucun arr\xEAt\xE9 trouv\xE9");
    \u0275\u0275elementEnd()()()();
  }
}
function SuiviArreteCaisseComponent_Conditional_86_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-card", 41)(1, "p-table", 46);
    \u0275\u0275template(2, SuiviArreteCaisseComponent_Conditional_86_ng_template_2_Template, 27, 0, "ng-template", 24)(3, SuiviArreteCaisseComponent_Conditional_86_ng_template_3_Template, 22, 10, "ng-template", 47)(4, SuiviArreteCaisseComponent_Conditional_86_ng_template_4_Template, 6, 0, "ng-template", 48);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r1.filteredArretes())("paginator", true)("rows", 10)("rowsPerPageOptions", \u0275\u0275pureFunction0(9, _c0))("showCurrentPageReport", true)("globalFilterFields", \u0275\u0275pureFunction0(10, _c1))("tableStyle", \u0275\u0275pureFunction0(11, _c2))("rowHover", true)("scrollable", true);
  }
}
var SuiviArreteCaisseComponent = class _SuiviArreteCaisseComponent {
  // Services
  userService = inject(UserService);
  destroyRef = inject(DestroyRef);
  messageService = inject(MessageService);
  // State principal
  state = signal({
    arretes: [],
    loading: false,
    message: void 0,
    error: void 0,
    viewMode: "all"
  });
  // State des filtres
  filters = signal({
    delegation: "",
    agence: "",
    pointvente: "",
    statut: "",
    dateDebut: "",
    dateFin: "",
    globalFilter: ""
  });
  // Options pour les dropdowns
  viewModeOptions = [
    { label: "Tous les arr\xEAt\xE9s", value: "all" },
    { label: "Derniers par point de vente", value: "latest" }
  ];
  statutOptions = [
    { label: "Tous", value: "" },
    { label: "En cours", value: "ENCOURS" },
    { label: "Valid\xE9", value: "VALIDE" }
  ];
  // Computed: Liste des délégations uniques
  delegations = computed(() => {
    const arretes = this.state().arretes;
    const unique = [...new Set(arretes.map((a) => a.delegationNom).filter((d) => d !== null))];
    return [{ label: "Toutes", value: "" }, ...unique.sort().map((d) => ({ label: d, value: d }))];
  });
  // Computed: Liste des agences uniques
  agences = computed(() => {
    const arretes = this.state().arretes;
    const unique = [...new Set(arretes.map((a) => a.agenceNom).filter((a) => a !== null))];
    return [{ label: "Toutes", value: "" }, ...unique.sort().map((a) => ({ label: a, value: a }))];
  });
  // Computed: Liste des points de vente uniques
  pointventes = computed(() => {
    const arretes = this.state().arretes;
    const unique = [...new Set(arretes.map((a) => a.pointventeNom).filter((p) => p !== null))];
    return [{ label: "Tous", value: "" }, ...unique.sort().map((p) => ({ label: p, value: p }))];
  });
  // Computed: Arrêtés filtrés
  filteredArretes = computed(() => {
    const arretes = this.state().arretes;
    const f = this.filters();
    return arretes.filter((arrete) => {
      if (f.delegation && arrete.delegationNom !== f.delegation)
        return false;
      if (f.agence && arrete.agenceNom !== f.agence)
        return false;
      if (f.pointvente && arrete.pointventeNom !== f.pointvente)
        return false;
      if (f.statut && arrete.statut !== f.statut)
        return false;
      if (f.dateDebut) {
        const dateDebut = new Date(f.dateDebut);
        const dateArrete = this.userService.parseDate(arrete.dateArreteCaisse);
        if (dateArrete && dateArrete < dateDebut)
          return false;
      }
      if (f.dateFin) {
        const dateFin = new Date(f.dateFin);
        const dateArrete = this.userService.parseDate(arrete.dateArreteCaisse);
        if (dateArrete && dateArrete > dateFin)
          return false;
      }
      if (f.globalFilter) {
        const search = f.globalFilter.toLowerCase();
        const matchDelegation = arrete.delegationNom?.toLowerCase().includes(search);
        const matchAgence = arrete.agenceNom?.toLowerCase().includes(search);
        const matchPointvente = arrete.pointventeNom?.toLowerCase().includes(search);
        const matchMontant = arrete.montant.toString().includes(search);
        if (!matchDelegation && !matchAgence && !matchPointvente && !matchMontant)
          return false;
      }
      return true;
    });
  });
  // Computed: Statistiques
  stats = computed(() => {
    const arretes = this.state().arretes;
    const encours = arretes.filter((a) => a.statut === "ENCOURS");
    const valide = arretes.filter((a) => a.statut === "VALIDE");
    return {
      totalEncours: encours.length,
      montantEncours: encours.reduce((sum, a) => sum + a.montant, 0),
      totalValide: valide.length,
      montantValide: valide.reduce((sum, a) => sum + a.montant, 0),
      total: arretes.length,
      montantTotal: arretes.reduce((sum, a) => sum + a.montant, 0)
    };
  });
  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: true, error: void 0 }));
    const observable = this.state().viewMode === "latest" ? this.userService.getLatestArretesByPointvente$() : this.userService.getAllArretesForSuivi$();
    observable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        const arretes = response.data.arretes || [];
        this.state.update((s) => __spreadProps(__spreadValues({}, s), {
          arretes,
          loading: false,
          message: response.message,
          error: void 0
        }));
        this.messageService.add({
          severity: "success",
          summary: "Succ\xE8s",
          detail: `${arretes.length} arr\xEAt\xE9(s) charg\xE9(s)`,
          life: 3e3
        });
      },
      error: (error) => {
        console.error("Erreur chargement arr\xEAt\xE9s:", error);
        this.state.update((s) => __spreadProps(__spreadValues({}, s), {
          loading: false,
          error: "Erreur lors du chargement des donn\xE9es"
        }));
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Impossible de charger les donn\xE9es",
          life: 5e3
        });
      }
    });
  }
  onViewModeChange(event) {
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { viewMode: event.value }));
    this.loadData();
  }
  updateFilter(key, value) {
    this.filters.update((f) => __spreadProps(__spreadValues({}, f), { [key]: value }));
  }
  resetFilters() {
    this.filters.set({
      delegation: "",
      agence: "",
      pointvente: "",
      statut: "",
      dateDebut: "",
      dateFin: "",
      globalFilter: ""
    });
  }
  refresh() {
    this.loadData();
  }
  openDocument(url) {
    window.open(url, "_blank");
  }
  formatDate(date) {
    return this.userService.formatDate(date);
  }
  formatDateTime(date) {
    return this.userService.formatDateTime(date);
  }
  formatMontant(montant) {
    return this.userService.formatMontant(montant);
  }
  getStatusSeverity(statut) {
    return statut === "VALIDE" ? "success" : "warn";
  }
  getStatusLabel(statut) {
    return statut === "VALIDE" ? "Valid\xE9" : "En cours";
  }
  exportToExcel() {
    this.messageService.add({
      severity: "info",
      summary: "Export",
      detail: "Fonctionnalit\xE9 en cours de d\xE9veloppement",
      life: 3e3
    });
  }
  trackByArrete(index, arrete) {
    return arrete.id;
  }
  static \u0275fac = function SuiviArreteCaisseComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SuiviArreteCaisseComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SuiviArreteCaisseComponent, selectors: [["app-suivi-arrete-caisse"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 87, vars: 28, consts: [[1, "suivi-arrete-caisse"], [1, "page-header"], [1, "header-content"], [1, "pi", "pi-file-check", "mr-2"], [1, "subtitle"], [1, "header-actions"], ["icon", "pi pi-refresh", "label", "Actualiser", "pTooltip", "Recharger les donn\xE9es", 3, "onClick", "outlined", "loading"], ["icon", "pi pi-file-excel", "label", "Exporter", "severity", "success", 3, "onClick"], [1, "stats-grid"], ["styleClass", "stat-card stat-warning"], [1, "stat-content"], [1, "stat-icon", "warning"], [1, "pi", "pi-clock"], [1, "stat-info"], [1, "stat-value"], [1, "stat-label"], [1, "stat-amount"], ["styleClass", "stat-card stat-success"], [1, "stat-icon", "success"], [1, "pi", "pi-check-circle"], ["styleClass", "stat-card stat-primary"], [1, "stat-icon", "primary"], [1, "pi", "pi-list"], ["styleClass", "filters-card"], ["pTemplate", "header"], [1, "filters-grid"], [1, "filter-item", "filter-search"], ["iconPosition", "left"], ["styleClass", "pi pi-search"], ["type", "text", "pInputText", "", "placeholder", "Rechercher...", 3, "ngModelChange", "ngModel"], [1, "filter-item"], ["optionLabel", "label", "optionValue", "value", "placeholder", "Toutes", "styleClass", "w-full", 3, "ngModelChange", "options", "ngModel", "showClear"], ["optionLabel", "label", "optionValue", "value", "placeholder", "Tous", "styleClass", "w-full", 3, "ngModelChange", "options", "ngModel", "showClear"], ["optionLabel", "label", "optionValue", "value", "placeholder", "Tous", "styleClass", "w-full", 3, "ngModelChange", "options", "ngModel"], ["type", "date", "pInputText", "", 1, "p-inputtext", "w-full", 3, "ngModelChange", "ngModel"], [1, "filters-footer"], ["icon", "pi pi-times", "label", "R\xE9initialiser", "severity", "secondary", 3, "onClick", "outlined"], [1, "results-count"], ["severity", "info", 3, "value"], [1, "loading-container"], ["severity", "error", "styleClass", "w-full mb-4", 3, "text"], ["styleClass", "table-card"], [1, "filters-header"], [1, "pi", "pi-filter", "mr-2"], ["optionLabel", "label", "optionValue", "value", 3, "onChange", "options", "ngModel"], ["strokeWidth", "4", "animationDuration", ".5s"], ["currentPageReportTemplate", "Affichage {first} - {last} sur {totalRecords} arr\xEAt\xE9s", "styleClass", "p-datatable-sm p-datatable-striped", "scrollHeight", "500px", 3, "value", "paginator", "rows", "rowsPerPageOptions", "showCurrentPageReport", "globalFilterFields", "tableStyle", "rowHover", "scrollable"], ["pTemplate", "body"], ["pTemplate", "emptymessage"], ["pSortableColumn", "id", 2, "width", "80px"], ["field", "id"], ["pSortableColumn", "delegationNom"], ["field", "delegationNom"], ["pSortableColumn", "agenceNom"], ["field", "agenceNom"], ["pSortableColumn", "pointventeNom"], ["field", "pointventeNom"], ["pSortableColumn", "montant", 1, "text-right"], ["field", "montant"], ["pSortableColumn", "dateArreteCaisse"], ["field", "dateArreteCaisse"], ["pSortableColumn", "dateRemonte"], ["field", "dateRemonte"], ["pSortableColumn", "statut", 2, "width", "120px"], ["field", "statut"], [2, "width", "120px"], [1, "id-badge"], [1, "text-right", "font-semibold"], [1, "text-muted"], [3, "value", "severity"], ["icon", "pi pi-external-link", "label", "Voir", "size", "small", "pTooltip", "Ouvrir le document", 3, "text"], ["icon", "pi pi-external-link", "label", "Voir", "size", "small", "pTooltip", "Ouvrir le document", 3, "onClick", "text"], [1, "pi", "pi-clock", "mr-1"], ["colspan", "9", 1, "text-center", "p-6"], [1, "empty-state"], [1, "pi", "pi-inbox", 2, "font-size", "3rem", "color", "var(--text-color-secondary)"], [1, "mt-3", "mb-0"]], template: function SuiviArreteCaisseComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "p-toast");
      \u0275\u0275elementStart(1, "div", 0)(2, "div", 1)(3, "div", 2)(4, "h1");
      \u0275\u0275element(5, "i", 3);
      \u0275\u0275text(6, " Suivi des Arr\xEAt\xE9s de Caisse ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "p", 4);
      \u0275\u0275text(8, "Visualisation des arr\xEAt\xE9s de tous les points de vente");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(9, "div", 5)(10, "p-button", 6);
      \u0275\u0275listener("onClick", function SuiviArreteCaisseComponent_Template_p_button_onClick_10_listener() {
        return ctx.refresh();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "p-button", 7);
      \u0275\u0275listener("onClick", function SuiviArreteCaisseComponent_Template_p_button_onClick_11_listener() {
        return ctx.exportToExcel();
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(12, "div", 8)(13, "p-card", 9)(14, "div", 10)(15, "div", 11);
      \u0275\u0275element(16, "i", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "div", 13)(18, "span", 14);
      \u0275\u0275text(19);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "span", 15);
      \u0275\u0275text(21, "En cours");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "span", 16);
      \u0275\u0275text(23);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(24, "p-card", 17)(25, "div", 10)(26, "div", 18);
      \u0275\u0275element(27, "i", 19);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "div", 13)(29, "span", 14);
      \u0275\u0275text(30);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(31, "span", 15);
      \u0275\u0275text(32, "Valid\xE9s");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "span", 16);
      \u0275\u0275text(34);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(35, "p-card", 20)(36, "div", 10)(37, "div", 21);
      \u0275\u0275element(38, "i", 22);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(39, "div", 13)(40, "span", 14);
      \u0275\u0275text(41);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(42, "span", 15);
      \u0275\u0275text(43, "Total");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(44, "span", 16);
      \u0275\u0275text(45);
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(46, "p-card", 23);
      \u0275\u0275template(47, SuiviArreteCaisseComponent_ng_template_47_Template, 5, 2, "ng-template", 24);
      \u0275\u0275elementStart(48, "div", 25)(49, "div", 26)(50, "label");
      \u0275\u0275text(51, "Recherche");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(52, "p-iconField", 27);
      \u0275\u0275element(53, "p-inputIcon", 28);
      \u0275\u0275elementStart(54, "input", 29);
      \u0275\u0275listener("ngModelChange", function SuiviArreteCaisseComponent_Template_input_ngModelChange_54_listener($event) {
        return ctx.updateFilter("globalFilter", $event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(55, "div", 30)(56, "label");
      \u0275\u0275text(57, "D\xE9l\xE9gation");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(58, "p-dropdown", 31);
      \u0275\u0275listener("ngModelChange", function SuiviArreteCaisseComponent_Template_p_dropdown_ngModelChange_58_listener($event) {
        return ctx.updateFilter("delegation", $event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(59, "div", 30)(60, "label");
      \u0275\u0275text(61, "Agence");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(62, "p-dropdown", 31);
      \u0275\u0275listener("ngModelChange", function SuiviArreteCaisseComponent_Template_p_dropdown_ngModelChange_62_listener($event) {
        return ctx.updateFilter("agence", $event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(63, "div", 30)(64, "label");
      \u0275\u0275text(65, "Point de vente");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(66, "p-dropdown", 32);
      \u0275\u0275listener("ngModelChange", function SuiviArreteCaisseComponent_Template_p_dropdown_ngModelChange_66_listener($event) {
        return ctx.updateFilter("pointvente", $event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(67, "div", 30)(68, "label");
      \u0275\u0275text(69, "Statut");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(70, "p-dropdown", 33);
      \u0275\u0275listener("ngModelChange", function SuiviArreteCaisseComponent_Template_p_dropdown_ngModelChange_70_listener($event) {
        return ctx.updateFilter("statut", $event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(71, "div", 30)(72, "label");
      \u0275\u0275text(73, "Date d\xE9but");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(74, "input", 34);
      \u0275\u0275listener("ngModelChange", function SuiviArreteCaisseComponent_Template_input_ngModelChange_74_listener($event) {
        return ctx.updateFilter("dateDebut", $event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(75, "div", 30)(76, "label");
      \u0275\u0275text(77, "Date fin");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(78, "input", 34);
      \u0275\u0275listener("ngModelChange", function SuiviArreteCaisseComponent_Template_input_ngModelChange_78_listener($event) {
        return ctx.updateFilter("dateFin", $event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(79, "div", 35)(80, "p-button", 36);
      \u0275\u0275listener("onClick", function SuiviArreteCaisseComponent_Template_p_button_onClick_80_listener() {
        return ctx.resetFilters();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(81, "span", 37);
      \u0275\u0275element(82, "p-badge", 38);
      \u0275\u0275text(83);
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(84, SuiviArreteCaisseComponent_Conditional_84_Template, 4, 0, "div", 39)(85, SuiviArreteCaisseComponent_Conditional_85_Template, 1, 1, "p-message", 40)(86, SuiviArreteCaisseComponent_Conditional_86_Template, 5, 12, "p-card", 41);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(10);
      \u0275\u0275property("outlined", true)("loading", ctx.state().loading);
      \u0275\u0275advance(9);
      \u0275\u0275textInterpolate(ctx.stats().totalEncours);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.formatMontant(ctx.stats().montantEncours));
      \u0275\u0275advance(7);
      \u0275\u0275textInterpolate(ctx.stats().totalValide);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.formatMontant(ctx.stats().montantValide));
      \u0275\u0275advance(7);
      \u0275\u0275textInterpolate(ctx.stats().total);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.formatMontant(ctx.stats().montantTotal));
      \u0275\u0275advance(9);
      \u0275\u0275property("ngModel", ctx.filters().globalFilter);
      \u0275\u0275advance(4);
      \u0275\u0275property("options", ctx.delegations())("ngModel", ctx.filters().delegation)("showClear", true);
      \u0275\u0275advance(4);
      \u0275\u0275property("options", ctx.agences())("ngModel", ctx.filters().agence)("showClear", true);
      \u0275\u0275advance(4);
      \u0275\u0275property("options", ctx.pointventes())("ngModel", ctx.filters().pointvente)("showClear", true);
      \u0275\u0275advance(4);
      \u0275\u0275property("options", ctx.statutOptions)("ngModel", ctx.filters().statut);
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", ctx.filters().dateDebut);
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", ctx.filters().dateFin);
      \u0275\u0275advance(2);
      \u0275\u0275property("outlined", true);
      \u0275\u0275advance(2);
      \u0275\u0275property("value", ctx.filteredArretes().length.toString());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" r\xE9sultat(s) sur ", ctx.state().arretes.length, " ");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.state().loading ? 84 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.state().error ? 85 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.state().loading && !ctx.state().error ? 86 : -1);
    }
  }, dependencies: [
    CommonModule,
    FormsModule,
    DefaultValueAccessor,
    NgControlStatus,
    NgModel,
    TableModule,
    Table,
    PrimeTemplate,
    SortableColumn,
    SortIcon,
    TagModule,
    Tag,
    ButtonModule,
    Button,
    ProgressSpinnerModule,
    ProgressSpinner,
    MessageModule,
    Message,
    CardModule,
    Card,
    BadgeModule,
    Badge,
    IconFieldModule,
    IconField,
    InputIconModule,
    InputIcon,
    InputTextModule,
    InputText,
    TooltipModule,
    Tooltip,
    DropdownModule,
    Dropdown,
    SelectButtonModule,
    SelectButton,
    ToastModule,
    Toast
  ], styles: ["\n\n.suivi-arrete-caisse[_ngcontent-%COMP%] {\n  padding: 1.5rem;\n}\n.page-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  margin-bottom: 1.5rem;\n  flex-wrap: wrap;\n  gap: 1rem;\n}\n.page-header[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 600;\n  color: var(--text-color);\n  margin: 0;\n  display: flex;\n  align-items: center;\n}\n.page-header[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  margin: 0.25rem 0 0 0;\n  font-size: 0.875rem;\n}\n.page-header[_ngcontent-%COMP%]   .header-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.75rem;\n}\n.stats-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 1rem;\n  margin-bottom: 1.5rem;\n}\n[_nghost-%COMP%]     .stat-card .p-card-body {\n  padding: 1rem;\n}\n.stat-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n}\n.stat-content[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] {\n  width: 56px;\n  height: 56px;\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 1.5rem;\n}\n.stat-content[_ngcontent-%COMP%]   .stat-icon.warning[_ngcontent-%COMP%] {\n  background-color: rgba(245, 158, 11, 0.15);\n  color: #f59e0b;\n}\n.stat-content[_ngcontent-%COMP%]   .stat-icon.success[_ngcontent-%COMP%] {\n  background-color: rgba(34, 197, 94, 0.15);\n  color: #22c55e;\n}\n.stat-content[_ngcontent-%COMP%]   .stat-icon.primary[_ngcontent-%COMP%] {\n  background-color: rgba(59, 130, 246, 0.15);\n  color: #3b82f6;\n}\n.stat-content[_ngcontent-%COMP%]   .stat-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.stat-content[_ngcontent-%COMP%]   .stat-info[_ngcontent-%COMP%]   .stat-value[_ngcontent-%COMP%] {\n  font-size: 1.75rem;\n  font-weight: 700;\n  color: var(--text-color);\n  line-height: 1.2;\n}\n.stat-content[_ngcontent-%COMP%]   .stat-info[_ngcontent-%COMP%]   .stat-label[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  color: var(--text-color-secondary);\n}\n.stat-content[_ngcontent-%COMP%]   .stat-info[_ngcontent-%COMP%]   .stat-amount[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: var(--primary-color);\n  font-weight: 500;\n  margin-top: 0.25rem;\n}\n[_nghost-%COMP%]     .filters-card {\n  margin-bottom: 1.5rem;\n}\n[_nghost-%COMP%]     .filters-card .p-card-header {\n  padding: 1rem 1.25rem;\n  border-bottom: 1px solid var(--surface-border);\n}\n[_nghost-%COMP%]     .filters-card .p-card-body {\n  padding: 1.25rem;\n}\n.filters-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 1rem;\n}\n.filters-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  font-weight: 600;\n  margin: 0;\n  display: flex;\n  align-items: center;\n}\n.filters-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 1rem;\n  margin-bottom: 1rem;\n}\n.filters-grid[_ngcontent-%COMP%]   .filter-item[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n.filters-grid[_ngcontent-%COMP%]   .filter-item[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: var(--text-color-secondary);\n}\n.filters-grid[_ngcontent-%COMP%]   .filter-item.filter-search[_ngcontent-%COMP%] {\n  grid-column: span 2;\n}\n@media (max-width: 768px) {\n  .filters-grid[_ngcontent-%COMP%]   .filter-item.filter-search[_ngcontent-%COMP%] {\n    grid-column: span 1;\n  }\n}\n.filters-footer[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding-top: 1rem;\n  border-top: 1px solid var(--surface-border);\n  flex-wrap: wrap;\n  gap: 1rem;\n}\n.filters-footer[_ngcontent-%COMP%]   .results-count[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-size: 0.875rem;\n  color: var(--text-color-secondary);\n}\n.loading-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 4rem 2rem;\n  background: var(--surface-card);\n  border-radius: var(--border-radius);\n}\n.loading-container[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 1rem 0 0;\n  color: var(--text-color-secondary);\n}\n[_nghost-%COMP%]     .table-card .p-card-body {\n  padding: 0;\n}\n.id-badge[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: var(--primary-color);\n}\n.text-right[_ngcontent-%COMP%] {\n  text-align: right;\n}\n.font-semibold[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.text-muted[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  font-size: 0.875rem;\n}\n.empty-state[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 2rem;\n}\n.empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n}\n@media (max-width: 768px) {\n  .page-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .filters-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .stats-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=suivi-arrete-caisse.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SuiviArreteCaisseComponent, { className: "SuiviArreteCaisseComponent", filePath: "src/app/pages/dashboard/admin/de/suivi-arrete-caisse/suivi-arrete-caisse.component.ts", lineNumber: 67 });
})();
export {
  SuiviArreteCaisseComponent
};
//# sourceMappingURL=chunk-PXHMLRI6.js.map
