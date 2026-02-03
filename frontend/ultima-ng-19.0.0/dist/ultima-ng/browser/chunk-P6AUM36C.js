import {
  SocietariatByAgenceComponent,
  SocietariatByPsComponent
} from "./chunk-J7AGU57C.js";
import {
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
import "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
import "./chunk-FZELBHWZ.js";
import "./chunk-4IUQ6KTI.js";
import "./chunk-IVSL2HKS.js";
import "./chunk-E352KRZV.js";
import "./chunk-HHD4PK4J.js";
import {
  ButtonDirective,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import "./chunk-AP3OAIHW.js";
import "./chunk-NQNBRQ7H.js";
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
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-ZKKMBKIA.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/pages/dashboard/admin/suivi-societariat/suivi-societariat.component.ts
function SuiviSocietariatComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 2);
    \u0275\u0275text(1, " Statistiques des corrections pour la d\xE9l\xE9gation de ");
    \u0275\u0275elementStart(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", (tmp_1_0 = ctx_r0.user()) == null ? null : tmp_1_0.firstName, " ", (tmp_1_0 = ctx_r0.user()) == null ? null : tmp_1_0.lastName, "");
  }
}
function SuiviSocietariatComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.userError(), " ");
  }
}
function SuiviSocietariatComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275element(1, "p-progressSpinner");
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Chargement des informations...");
    \u0275\u0275elementEnd()();
  }
}
function SuiviSocietariatComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6)(1, "div", 8)(2, "div", 9);
    \u0275\u0275element(3, "i", 10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 11)(5, "span", 12);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 13);
    \u0275\u0275text(8, "En attente");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 14)(10, "div", 9);
    \u0275\u0275element(11, "i", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 11)(13, "span", 12);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "span", 13);
    \u0275\u0275text(16, "Rejet\xE9es");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(17, "div", 16)(18, "div", 9);
    \u0275\u0275element(19, "i", 17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "div", 11)(21, "span", 12);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "span", 13);
    \u0275\u0275text(24, "Valid\xE9es");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(25, "div", 18)(26, "div", 9);
    \u0275\u0275element(27, "i", 19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "div", 11)(29, "span", 12);
    \u0275\u0275text(30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "span", 13);
    \u0275\u0275text(32, "Total");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r0.totalEnAttente());
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r0.totalRejete());
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r0.totalValide());
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r0.totalGlobal());
  }
}
function SuiviSocietariatComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 7)(1, "div", 20)(2, "app-societariat-by-agence", 21);
    \u0275\u0275listener("agenceSelected", function SuiviSocietariatComponent_Conditional_10_Template_app_societariat_by_agence_agenceSelected_2_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onSelectAgence($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(3, "div", 20);
    \u0275\u0275element(4, "app-societariat-by-ps", 22);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_5_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("delegationLibele", "Agences de ma d\xE9l\xE9gation")("stats", ctx_r0.agences())("loading", ctx_r0.loadingAgences())("error", ctx_r0.agenceError());
    \u0275\u0275advance(2);
    \u0275\u0275property("agenceLibele", (tmp_5_0 = ctx_r0.selectedAgence()) == null ? null : tmp_5_0.agenceLibele)("stats", ctx_r0.points())("loading", ctx_r0.loadingPoints())("error", ctx_r0.pointError());
  }
}
var SuiviSocietariatComponent = class _SuiviSocietariatComponent {
  userService = inject(UserService);
  state = signal({
    loadingUser: false,
    user: void 0,
    userError: void 0,
    loadingAgences: false,
    agences: [],
    agenceError: void 0,
    loadingPoints: false,
    points: [],
    pointError: void 0,
    selectedAgence: null
  });
  loadingUser = computed(() => this.state().loadingUser);
  user = computed(() => this.state().user);
  userError = computed(() => this.state().userError);
  agences = computed(() => this.state().agences);
  points = computed(() => this.state().points);
  loadingAgences = computed(() => this.state().loadingAgences);
  loadingPoints = computed(() => this.state().loadingPoints);
  selectedAgence = computed(() => this.state().selectedAgence);
  agenceError = computed(() => this.state().agenceError);
  pointError = computed(() => this.state().pointError);
  // Computed totals for the delegation
  totalEnAttente = computed(() => this.agences().reduce((sum, a) => sum + a.enAttente, 0));
  totalRejete = computed(() => this.agences().reduce((sum, a) => sum + a.rejete, 0));
  totalValide = computed(() => this.agences().reduce((sum, a) => sum + a.valide, 0));
  totalGlobal = computed(() => this.agences().reduce((sum, a) => sum + a.total, 0));
  ngOnInit() {
    this.loadUser();
  }
  loadUser() {
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { loadingUser: true, userError: void 0 }));
    this.userService.getInstanceUser$().subscribe({
      next: (response) => {
        const user = response.data?.user;
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { user, loadingUser: false }));
        if (user?.delegationId) {
          this.loadAgenceStats(user.delegationId);
        } else {
          this.state.update((s) => __spreadProps(__spreadValues({}, s), {
            userError: "Aucune d\xE9l\xE9gation associ\xE9e \xE0 votre compte."
          }));
        }
      },
      error: (err) => {
        const message = err.error?.message || "Erreur lors du chargement des informations utilisateur.";
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { loadingUser: false, userError: message }));
      }
    });
  }
  loadAgenceStats(delegationId) {
    this.state.update((s) => __spreadProps(__spreadValues({}, s), {
      loadingAgences: true,
      agenceError: void 0,
      agences: [],
      points: [],
      selectedAgence: null
    }));
    this.userService.getCorrectionStatsByAgence$(delegationId).subscribe({
      next: (response) => {
        const agences = response.data?.correctionAgenceStats || [];
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { agences, loadingAgences: false }));
      },
      error: (err) => {
        const message = err.error?.message || "Erreur lors du chargement des agences.";
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { loadingAgences: false, agenceError: message }));
      }
    });
  }
  onSelectAgence(row) {
    if (!row?.agenceId) {
      this.state.update((s) => __spreadProps(__spreadValues({}, s), {
        selectedAgence: row,
        points: [],
        pointError: "Identifiant agence manquant"
      }));
      return;
    }
    this.state.update((s) => __spreadProps(__spreadValues({}, s), {
      selectedAgence: row,
      points: [],
      pointError: void 0,
      loadingPoints: true
    }));
    this.userService.getCorrectionStatsByPointVente$(row.agenceId).subscribe({
      next: (response) => {
        const points = response.data?.correctionPointVenteStats || [];
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { points, loadingPoints: false }));
      },
      error: (err) => {
        const message = err.error?.message || "Erreur lors du chargement des points de vente.";
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { loadingPoints: false, pointError: message }));
      }
    });
  }
  refresh() {
    const user = this.user();
    if (user?.delegationId) {
      this.loadAgenceStats(user.delegationId);
    }
  }
  static \u0275fac = function SuiviSocietariatComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SuiviSocietariatComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SuiviSocietariatComponent, selectors: [["app-suivi-societariat"]], decls: 11, vars: 5, consts: [[1, "suivi-societariat-card"], [1, "header"], [1, "subtitle"], ["pButton", "", "type", "button", "icon", "pi pi-refresh", "label", "Rafra\xEEchir", 1, "p-button-outlined", 3, "click", "disabled"], [1, "error"], [1, "loading"], [1, "summary-grid"], [1, "grid", "mt-3"], [1, "summary-card", "en-attente-bg"], [1, "summary-icon"], [1, "pi", "pi-clock"], [1, "summary-content"], [1, "summary-value"], [1, "summary-label"], [1, "summary-card", "rejete-bg"], [1, "pi", "pi-times-circle"], [1, "summary-card", "valide-bg"], [1, "pi", "pi-check-circle"], [1, "summary-card", "total-bg"], [1, "pi", "pi-chart-bar"], [1, "col-12", "md:col-6"], [3, "agenceSelected", "delegationLibele", "stats", "loading", "error"], [3, "agenceLibele", "stats", "loading", "error"]], template: function SuiviSocietariatComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "p-card", 0)(1, "div", 1)(2, "div")(3, "h3");
      \u0275\u0275text(4, "Suivi Soci\xE9tariat - Ma D\xE9l\xE9gation");
      \u0275\u0275elementEnd();
      \u0275\u0275template(5, SuiviSocietariatComponent_Conditional_5_Template, 4, 2, "p", 2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "button", 3);
      \u0275\u0275listener("click", function SuiviSocietariatComponent_Template_button_click_6_listener() {
        return ctx.refresh();
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275template(7, SuiviSocietariatComponent_Conditional_7_Template, 2, 1, "div", 4)(8, SuiviSocietariatComponent_Conditional_8_Template, 4, 0, "div", 5)(9, SuiviSocietariatComponent_Conditional_9_Template, 33, 4, "div", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275template(10, SuiviSocietariatComponent_Conditional_10_Template, 5, 8, "div", 7);
    }
    if (rf & 2) {
      \u0275\u0275advance(5);
      \u0275\u0275conditional(ctx.user() ? 5 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.loadingUser() || ctx.loadingAgences());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.userError() ? 7 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loadingUser() ? 8 : ctx.user() ? 9 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.user() && !ctx.userError() ? 10 : -1);
    }
  }, dependencies: [CommonModule, CardModule, Card, TableModule, ProgressSpinnerModule, ProgressSpinner, ButtonModule, ButtonDirective, SocietariatByAgenceComponent, SocietariatByPsComponent], styles: ["\n\n.suivi-societariat-card[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.suivi-societariat-card[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  margin-bottom: 1.5rem;\n}\n.suivi-societariat-card[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  font-weight: 700;\n  color: #1f2937;\n}\n.suivi-societariat-card[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n  margin: 0.25rem 0 0;\n  color: #6b7280;\n  font-size: 0.95rem;\n}\n.suivi-societariat-card[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #374151;\n}\n.suivi-societariat-card[_ngcontent-%COMP%]   .loading[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 2rem 0;\n  gap: 1rem;\n}\n.suivi-societariat-card[_ngcontent-%COMP%]   .loading[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #6b7280;\n}\n.suivi-societariat-card[_ngcontent-%COMP%]   .error[_ngcontent-%COMP%] {\n  padding: 0.75rem 1rem;\n  margin-bottom: 1rem;\n  border-radius: 6px;\n  background: #fef2f2;\n  color: #b91c1c;\n  border: 1px solid #fecdd3;\n}\n.suivi-societariat-card[_ngcontent-%COMP%]   .summary-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 1rem;\n}\n@media (max-width: 992px) {\n  .suivi-societariat-card[_ngcontent-%COMP%]   .summary-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n@media (max-width: 576px) {\n  .suivi-societariat-card[_ngcontent-%COMP%]   .summary-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.suivi-societariat-card[_ngcontent-%COMP%]   .summary-card[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  padding: 1.25rem;\n  border-radius: 12px;\n  transition: transform 0.2s ease, box-shadow 0.2s ease;\n}\n.suivi-societariat-card[_ngcontent-%COMP%]   .summary-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n}\n.suivi-societariat-card[_ngcontent-%COMP%]   .summary-card[_ngcontent-%COMP%]   .summary-icon[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 48px;\n  height: 48px;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.3);\n}\n.suivi-societariat-card[_ngcontent-%COMP%]   .summary-card[_ngcontent-%COMP%]   .summary-icon[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  color: white;\n}\n.suivi-societariat-card[_ngcontent-%COMP%]   .summary-card[_ngcontent-%COMP%]   .summary-content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.suivi-societariat-card[_ngcontent-%COMP%]   .summary-card[_ngcontent-%COMP%]   .summary-content[_ngcontent-%COMP%]   .summary-value[_ngcontent-%COMP%] {\n  font-size: 1.75rem;\n  font-weight: 700;\n  color: white;\n}\n.suivi-societariat-card[_ngcontent-%COMP%]   .summary-card[_ngcontent-%COMP%]   .summary-content[_ngcontent-%COMP%]   .summary-label[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  color: rgba(255, 255, 255, 0.85);\n}\n.suivi-societariat-card[_ngcontent-%COMP%]   .summary-card.en-attente-bg[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #f59e0b,\n      #d97706);\n}\n.suivi-societariat-card[_ngcontent-%COMP%]   .summary-card.rejete-bg[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #ef4444,\n      #dc2626);\n}\n.suivi-societariat-card[_ngcontent-%COMP%]   .summary-card.valide-bg[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #22c55e,\n      #16a34a);\n}\n.suivi-societariat-card[_ngcontent-%COMP%]   .summary-card.total-bg[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #6366f1,\n      #4f46e5);\n}\n.mt-3[_ngcontent-%COMP%] {\n  margin-top: 1.5rem;\n}\n/*# sourceMappingURL=suivi-societariat.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SuiviSocietariatComponent, { className: "SuiviSocietariatComponent", filePath: "src/app/pages/dashboard/admin/suivi-societariat/suivi-societariat.component.ts", lineNumber: 21 });
})();
export {
  SuiviSocietariatComponent
};
//# sourceMappingURL=chunk-P6AUM36C.js.map
