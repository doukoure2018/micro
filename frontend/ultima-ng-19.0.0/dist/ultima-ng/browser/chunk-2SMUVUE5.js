import {
  fr_default
} from "./chunk-DGHIY3K6.js";
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
import "./chunk-544F7IXR.js";
import "./chunk-YBM6FZLP.js";
import "./chunk-U4P2VV4G.js";
import "./chunk-CPYA4VSS.js";
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
  ActivatedRoute,
  Router
} from "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
import "./chunk-FZELBHWZ.js";
import {
  Tooltip,
  TooltipModule
} from "./chunk-4IUQ6KTI.js";
import "./chunk-IVSL2HKS.js";
import "./chunk-E352KRZV.js";
import "./chunk-HHD4PK4J.js";
import {
  ButtonDirective,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import "./chunk-AP3OAIHW.js";
import {
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
  DatePipe,
  NgClass,
  registerLocaleData
} from "./chunk-SQQPVFHK.js";
import {
  LOCALE_ID,
  computed,
  inject,
  signal,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind4,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction3,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-ZKKMBKIA.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/pages/dashboard/agent-credit/societariat/societariat-detail-ps/societariat-detail-ps.component.ts
var _c0 = () => ({ "min-width": "100%" });
var _c1 = () => [5, 10, 25, 50];
var _c2 = (a0, a1, a2) => ({ "status-attente": a0, "status-rejete": a1, "status-valide": a2 });
function SocietariatDetailPsComponent_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
function SocietariatDetailPsComponent_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15);
    \u0275\u0275text(1, "Chargement...");
    \u0275\u0275elementEnd();
  }
}
function SocietariatDetailPsComponent_Conditional_34_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th");
    \u0275\u0275text(2, "Code Client");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th");
    \u0275\u0275text(4, "Nom");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th");
    \u0275\u0275text(6, "Pr\xE9nom");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th");
    \u0275\u0275text(8, "T\xE9l\xE9phone");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th");
    \u0275\u0275text(10, "Statut");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th");
    \u0275\u0275text(12, "Agence");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th");
    \u0275\u0275text(14, "Cr\xE9\xE9 le");
    \u0275\u0275elementEnd()();
  }
}
function SocietariatDetailPsComponent_Conditional_34_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td")(10, "span", 20);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "td");
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "td");
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "date");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r2 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r2.codCliente);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r2.nomClient);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r2.prenomClient);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r2.telPrincipal);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction3(13, _c2, row_r2.correctionStatut === "EN_ATTENTE", row_r2.correctionStatut === "REJETE", row_r2.correctionStatut === "VALIDE"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r2.correctionStatut || "EN_ATTENTE");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r2.codeAgence);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind4(16, 8, row_r2.createdAt, "dd/MM/yyyy HH:mm", "", "fr-FR"));
  }
}
function SocietariatDetailPsComponent_Conditional_34_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 21);
    \u0275\u0275text(2, "Aucune correction trouv\xE9e pour ce point de service");
    \u0275\u0275elementEnd()();
  }
}
function SocietariatDetailPsComponent_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-table", 16);
    \u0275\u0275template(1, SocietariatDetailPsComponent_Conditional_34_ng_template_1_Template, 15, 0, "ng-template", 17)(2, SocietariatDetailPsComponent_Conditional_34_ng_template_2_Template, 17, 17, "ng-template", 18)(3, SocietariatDetailPsComponent_Conditional_34_ng_template_3_Template, 3, 0, "ng-template", 19);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("value", ctx_r0.items())("tableStyle", \u0275\u0275pureFunction0(6, _c0))("paginator", true)("rows", 10)("rowsPerPageOptions", \u0275\u0275pureFunction0(7, _c1))("showCurrentPageReport", true);
  }
}
registerLocaleData(fr_default);
var SocietariatDetailPsComponent = class _SocietariatDetailPsComponent {
  pointCode;
  pointLibele;
  userService = inject(UserService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  state = signal({
    loading: false,
    allItems: [],
    filteredItems: [],
    error: void 0,
    statut: null
  });
  isLoading = computed(() => this.state().loading);
  items = computed(() => this.state().filteredItems);
  allItems = computed(() => this.state().allItems);
  error = computed(() => this.state().error);
  statut = computed(() => this.state().statut);
  // Computed counts
  countAll = computed(() => this.allItems().length);
  countEnAttente = computed(() => this.allItems().filter((i) => i.correctionStatut === "EN_ATTENTE").length);
  countRejete = computed(() => this.allItems().filter((i) => i.correctionStatut === "REJETE").length);
  countValide = computed(() => this.allItems().filter((i) => i.correctionStatut === "VALIDE").length);
  ngOnChanges(changes) {
    if (changes["pointCode"] && this.pointCode) {
      this.load(null);
    }
  }
  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const code = params.get("code");
      const libele = params.get("libele");
      if (code) {
        this.pointCode = code;
        this.pointLibele = libele || this.pointLibele;
        this.load(null);
      }
    });
  }
  load(statut, forceReload = false) {
    if (!this.pointCode) {
      this.state.update((s) => __spreadProps(__spreadValues({}, s), { error: "Code point de service manquant" }));
      return;
    }
    if (!forceReload && this.allItems().length > 0) {
      this.applyFilter(statut);
      return;
    }
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: true, error: void 0, statut }));
    this.userService.getCorrectionsByPointVente$(this.pointCode, void 0).subscribe({
      next: (response) => {
        const allItems = (response.data?.corrections || []).map((item) => __spreadProps(__spreadValues({}, item), {
          createdAt: Array.isArray(item.createdAt) && item.createdAt.length >= 3 ? new Date(item.createdAt[0], (item.createdAt[1] || 1) - 1, item.createdAt[2] || 1, item.createdAt[3] || 0, item.createdAt[4] || 0, item.createdAt[5] || 0, item.createdAt[6] || 0).toISOString() : item.createdAt
        }));
        const filteredItems = statut ? allItems.filter((i) => i.correctionStatut === statut) : allItems;
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { allItems, filteredItems, loading: false, statut }));
      },
      error: (err) => {
        const message = err.error?.message || "Erreur lors du chargement des corrections.";
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: false, error: message }));
      }
    });
  }
  applyFilter(statut) {
    const allItems = this.allItems();
    const filteredItems = statut ? allItems.filter((i) => i.correctionStatut === statut) : allItems;
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { filteredItems, statut }));
  }
  filterAll() {
    this.applyFilter(null);
  }
  filterAttente() {
    this.applyFilter("EN_ATTENTE");
  }
  filterRejete() {
    this.applyFilter("REJETE");
  }
  filterValide() {
    this.applyFilter("VALIDE");
  }
  refresh() {
    this.load(this.statut() ?? null, true);
  }
  goBack() {
    this.router.navigate(["/dashboards"]);
  }
  static \u0275fac = function SocietariatDetailPsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SocietariatDetailPsComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SocietariatDetailPsComponent, selectors: [["app-societariat-detail-ps"]], inputs: { pointCode: "pointCode", pointLibele: "pointLibele" }, features: [\u0275\u0275ProvidersFeature([{ provide: LOCALE_ID, useValue: "fr-FR" }]), \u0275\u0275NgOnChangesFeature], decls: 35, vars: 16, consts: [[1, "panel"], [1, "panel-header"], [1, "header-left"], ["pButton", "", "type", "button", "icon", "pi pi-arrow-left", "pTooltip", "Retour aux statistiques", "tooltipPosition", "right", 1, "p-button-text", "p-button-rounded", "back-btn", 3, "click"], [1, "subtitle"], [1, "header-right"], ["pButton", "", "type", "button", "icon", "pi pi-refresh", "pTooltip", "Rafra\xEEchir", 1, "p-button-text", "p-button-rounded", 3, "click", "disabled"], [1, "stats-summary"], [1, "stat-card", "total", 3, "click"], [1, "stat-value"], [1, "stat-label"], [1, "stat-card", "en-attente", 3, "click"], [1, "stat-card", "rejete", 3, "click"], [1, "stat-card", "valide", 3, "click"], [1, "error"], [1, "loading"], ["currentPageReportTemplate", "Affichage {first} \xE0 {last} sur {totalRecords} entr\xE9es", 3, "value", "tableStyle", "paginator", "rows", "rowsPerPageOptions", "showCurrentPageReport"], ["pTemplate", "header"], ["pTemplate", "body"], ["pTemplate", "emptymessage"], [1, "status-badge", 3, "ngClass"], ["colspan", "7", 1, "empty"]], template: function SocietariatDetailPsComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "button", 3);
      \u0275\u0275listener("click", function SocietariatDetailPsComponent_Template_button_click_3_listener() {
        return ctx.goBack();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div")(5, "h4");
      \u0275\u0275text(6, "D\xE9tails des corrections");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "p", 4);
      \u0275\u0275text(8);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(9, "div", 5)(10, "button", 6);
      \u0275\u0275listener("click", function SocietariatDetailPsComponent_Template_button_click_10_listener() {
        return ctx.refresh();
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(11, "div", 7)(12, "div", 8);
      \u0275\u0275listener("click", function SocietariatDetailPsComponent_Template_div_click_12_listener() {
        return ctx.filterAll();
      });
      \u0275\u0275elementStart(13, "span", 9);
      \u0275\u0275text(14);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "span", 10);
      \u0275\u0275text(16, "Tous");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(17, "div", 11);
      \u0275\u0275listener("click", function SocietariatDetailPsComponent_Template_div_click_17_listener() {
        return ctx.filterAttente();
      });
      \u0275\u0275elementStart(18, "span", 9);
      \u0275\u0275text(19);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "span", 10);
      \u0275\u0275text(21, "En attente");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(22, "div", 12);
      \u0275\u0275listener("click", function SocietariatDetailPsComponent_Template_div_click_22_listener() {
        return ctx.filterRejete();
      });
      \u0275\u0275elementStart(23, "span", 9);
      \u0275\u0275text(24);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "span", 10);
      \u0275\u0275text(26, "Rejet\xE9es");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(27, "div", 13);
      \u0275\u0275listener("click", function SocietariatDetailPsComponent_Template_div_click_27_listener() {
        return ctx.filterValide();
      });
      \u0275\u0275elementStart(28, "span", 9);
      \u0275\u0275text(29);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "span", 10);
      \u0275\u0275text(31, "Valid\xE9es");
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(32, SocietariatDetailPsComponent_Conditional_32_Template, 2, 1, "div", 14)(33, SocietariatDetailPsComponent_Conditional_33_Template, 2, 0, "div", 15)(34, SocietariatDetailPsComponent_Conditional_34_Template, 4, 8, "p-table", 16);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate1("Point de service : ", ctx.pointLibele || ctx.pointCode || "Non renseign\xE9", "");
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", ctx.isLoading());
      \u0275\u0275advance(2);
      \u0275\u0275classProp("active", ctx.statut() === null);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.countAll());
      \u0275\u0275advance(3);
      \u0275\u0275classProp("active", ctx.statut() === "EN_ATTENTE");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.countEnAttente());
      \u0275\u0275advance(3);
      \u0275\u0275classProp("active", ctx.statut() === "REJETE");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.countRejete());
      \u0275\u0275advance(3);
      \u0275\u0275classProp("active", ctx.statut() === "VALIDE");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.countValide());
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.error() ? 32 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isLoading() ? 33 : 34);
    }
  }, dependencies: [CommonModule, NgClass, DatePipe, TableModule, Table, PrimeTemplate, ButtonModule, ButtonDirective, TooltipModule, Tooltip], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.panel[_ngcontent-%COMP%] {\n  border: 1px solid #e5e7eb;\n  border-radius: 8px;\n  padding: 1rem;\n  background: white;\n  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);\n}\n.panel-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n  margin-bottom: 1rem;\n}\n.panel-header[_ngcontent-%COMP%]   .header-left[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n}\n.panel-header[_ngcontent-%COMP%]   .header-left[_ngcontent-%COMP%]   .back-btn[_ngcontent-%COMP%] {\n  color: #6366f1;\n}\n.panel-header[_ngcontent-%COMP%]   .header-left[_ngcontent-%COMP%]   .back-btn[_ngcontent-%COMP%]:hover {\n  background: rgba(99, 102, 241, 0.1);\n}\n.panel-header[_ngcontent-%COMP%]   .header-right[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.panel-header[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin: 0;\n  font-weight: 700;\n}\n.panel-header[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n  margin: 0.25rem 0 0;\n  color: #6b7280;\n}\n.stats-summary[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 0.75rem;\n  margin-bottom: 1rem;\n}\n@media (max-width: 768px) {\n  .stats-summary[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n@media (max-width: 480px) {\n  .stats-summary[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.stat-card[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 1rem;\n  border-radius: 8px;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  border: 2px solid transparent;\n}\n.stat-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n}\n.stat-card.active[_ngcontent-%COMP%] {\n  border-color: currentColor;\n  transform: scale(1.02);\n}\n.stat-card[_ngcontent-%COMP%]   .stat-value[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 700;\n}\n.stat-card[_ngcontent-%COMP%]   .stat-label[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  margin-top: 0.25rem;\n}\n.stat-card.total[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #e0e7ff,\n      #c7d2fe);\n  color: #4338ca;\n}\n.stat-card.en-attente[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #fef3c7,\n      #fde68a);\n  color: #b45309;\n}\n.stat-card.rejete[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #fee2e2,\n      #fecaca);\n  color: #dc2626;\n}\n.stat-card.valide[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #d1fae5,\n      #a7f3d0);\n  color: #059669;\n}\n.status-badge[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 0.25rem 0.5rem;\n  border-radius: 4px;\n  font-size: 0.75rem;\n  font-weight: 600;\n  text-transform: uppercase;\n}\n.status-badge.status-attente[_ngcontent-%COMP%] {\n  background: #fef3c7;\n  color: #b45309;\n}\n.status-badge.status-rejete[_ngcontent-%COMP%] {\n  background: #fee2e2;\n  color: #dc2626;\n}\n.status-badge.status-valide[_ngcontent-%COMP%] {\n  background: #d1fae5;\n  color: #059669;\n}\n.empty[_ngcontent-%COMP%] {\n  text-align: center;\n  color: #6b7280;\n}\n.error[_ngcontent-%COMP%] {\n  padding: 0.5rem 0.75rem;\n  background: #fef2f2;\n  border: 1px solid #fecdd3;\n  border-radius: 6px;\n  color: #b91c1c;\n  margin-bottom: 0.75rem;\n}\n.loading[_ngcontent-%COMP%] {\n  padding: 1rem;\n  text-align: center;\n  color: #6b7280;\n}\n  .p-paginator {\n  padding: 0.75rem;\n  border-top: 1px solid #e5e7eb;\n}\n  .p-paginator .p-paginator-current {\n  color: #6b7280;\n  font-size: 0.875rem;\n}\n/*# sourceMappingURL=societariat-detail-ps.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SocietariatDetailPsComponent, { className: "SocietariatDetailPsComponent", filePath: "src/app/pages/dashboard/agent-credit/societariat/societariat-detail-ps/societariat-detail-ps.component.ts", lineNumber: 22 });
})();
export {
  SocietariatDetailPsComponent
};
//# sourceMappingURL=chunk-2SMUVUE5.js.map
