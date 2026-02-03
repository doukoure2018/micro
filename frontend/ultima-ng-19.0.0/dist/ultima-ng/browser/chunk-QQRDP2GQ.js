import {
  Router
} from "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
import {
  FormsModule
} from "./chunk-3HTR5OU7.js";
import {
  UserService
} from "./chunk-SQ5BRWVW.js";
import "./chunk-ZRELZ6R7.js";
import "./chunk-BMYIFZHZ.js";
import {
  CommonModule,
  NgClass
} from "./chunk-SQQPVFHK.js";
import {
  computed,
  inject,
  signal,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-ZKKMBKIA.js";
import {
  __async,
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/pages/dashboard/agent-credit/digital-verification/document-verification/document-verification.component.ts
var _forTrack0 = ($index, $item) => $item.value;
var _forTrack1 = ($index, $item) => $item.delegation.id;
var _forTrack2 = ($index, $item) => $item.id;
function DocumentVerificationComponent_For_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 15);
    \u0275\u0275listener("click", function DocumentVerificationComponent_For_17_Template_button_click_0_listener() {
      const option_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onStatutChange(option_r2.value));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classProp("active", ctx_r2.state().selectedStatut === option_r2.value);
    \u0275\u0275property("ngClass", "btn-outline-" + option_r2.color);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", option_r2.label, " ");
  }
}
function DocumentVerificationComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12)(1, "div", 16)(2, "span", 17);
    \u0275\u0275text(3, "Chargement...");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5, "Chargement des donn\xE9es...");
    \u0275\u0275elementEnd()();
  }
}
function DocumentVerificationComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13);
    \u0275\u0275element(1, "i", 18);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r2.state().error, " ");
  }
}
function DocumentVerificationComponent_Conditional_20_For_2_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 29);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const groupe_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", groupe_r5.stats.encours, " en cours ");
  }
}
function DocumentVerificationComponent_Conditional_20_For_2_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 30);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const groupe_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", groupe_r5.stats.valide, " valid\xE9(s) ");
  }
}
function DocumentVerificationComponent_Conditional_20_For_2_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 31);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const groupe_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", groupe_r5.stats.accepte, " accept\xE9(s) ");
  }
}
function DocumentVerificationComponent_Conditional_20_For_2_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 32);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const groupe_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", groupe_r5.stats.rejet, " rejet\xE9(s) ");
  }
}
function DocumentVerificationComponent_Conditional_20_For_2_Conditional_15_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35);
    \u0275\u0275element(1, "i", 37);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Aucune demande trouv\xE9e pour cette d\xE9l\xE9gation");
    \u0275\u0275elementEnd()();
  }
}
function DocumentVerificationComponent_Conditional_20_For_2_Conditional_15_Conditional_2_For_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td", 39);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 40);
    \u0275\u0275element(4, "i", 41);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td", 42);
    \u0275\u0275element(7, "i", 43);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 44)(14, "span", 45);
    \u0275\u0275element(15, "i", 46);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "td")(18, "span", 47);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "td", 48);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "td", 49)(23, "button", 50);
    \u0275\u0275listener("click", function DocumentVerificationComponent_Conditional_20_For_2_Conditional_15_Conditional_2_For_24_Template_button_click_23_listener($event) {
      const etat_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(5);
      ctx_r2.viewDetail(etat_r7.id);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275element(24, "i", 51);
    \u0275\u0275text(25, " D\xE9tails ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const etat_r7 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(5);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("#", etat_r7.id, "");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", etat_r7.userFullName, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", etat_r7.userPhone || "-", " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(etat_r7.agenceLibele || "-");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(etat_r7.pointVenteLibele || "-");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", etat_r7.documentCount, " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r2.getStatutClass(etat_r7.statut));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.getStatutLabel(etat_r7.statut), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.formatDate(etat_r7.createdAt));
  }
}
function DocumentVerificationComponent_Conditional_20_For_2_Conditional_15_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 36)(1, "table", 38)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "ID");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Utilisateur");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "T\xE9l\xE9phone");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Agence");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Point de Vente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Documents");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th");
    \u0275\u0275text(17, "Statut");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "th");
    \u0275\u0275text(19, "Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "th");
    \u0275\u0275text(21, "Actions");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "tbody");
    \u0275\u0275repeaterCreate(23, DocumentVerificationComponent_Conditional_20_For_2_Conditional_15_Conditional_2_For_24_Template, 26, 9, "tr", null, _forTrack2);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const groupe_r5 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance(23);
    \u0275\u0275repeater(groupe_r5.etats);
  }
}
function DocumentVerificationComponent_Conditional_20_For_2_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 34);
    \u0275\u0275template(1, DocumentVerificationComponent_Conditional_20_For_2_Conditional_15_Conditional_1_Template, 4, 0, "div", 35)(2, DocumentVerificationComponent_Conditional_20_For_2_Conditional_15_Conditional_2_Template, 25, 0, "div", 36);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const groupe_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275conditional(groupe_r5.etats.length === 0 ? 1 : 2);
  }
}
function DocumentVerificationComponent_Conditional_20_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 21)(1, "div", 22);
    \u0275\u0275listener("click", function DocumentVerificationComponent_Conditional_20_For_2_Template_div_click_1_listener() {
      const groupe_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.toggleDelegation(groupe_r5.delegation.id));
    });
    \u0275\u0275elementStart(2, "div", 23);
    \u0275\u0275element(3, "i", 24);
    \u0275\u0275elementStart(4, "h3", 25);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 26)(7, "span", 27);
    \u0275\u0275element(8, "i", 28);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275template(10, DocumentVerificationComponent_Conditional_20_For_2_Conditional_10_Template, 2, 1, "span", 29)(11, DocumentVerificationComponent_Conditional_20_For_2_Conditional_11_Template, 2, 1, "span", 30)(12, DocumentVerificationComponent_Conditional_20_For_2_Conditional_12_Template, 2, 1, "span", 31)(13, DocumentVerificationComponent_Conditional_20_For_2_Conditional_13_Template, 2, 1, "span", 32);
    \u0275\u0275elementEnd();
    \u0275\u0275element(14, "i", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275template(15, DocumentVerificationComponent_Conditional_20_For_2_Conditional_15_Template, 3, 1, "div", 34);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const groupe_r5 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("expanded", ctx_r2.isDelegationExpanded(groupe_r5.delegation.id));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(groupe_r5.delegation.libele);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", groupe_r5.stats.total, " demande(s) ");
    \u0275\u0275advance();
    \u0275\u0275conditional(groupe_r5.stats.encours > 0 ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(groupe_r5.stats.valide > 0 ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(groupe_r5.stats.accepte > 0 ? 12 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(groupe_r5.stats.rejet > 0 ? 13 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.isDelegationExpanded(groupe_r5.delegation.id) ? 15 : -1);
  }
}
function DocumentVerificationComponent_Conditional_20_ForEmpty_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275element(1, "i", 52);
    \u0275\u0275elementStart(2, "h3");
    \u0275\u0275text(3, "Aucune demande trouv\xE9e");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5, "Il n'y a pas de demande de documents \xE0 v\xE9rifier pour le moment.");
    \u0275\u0275elementEnd()();
  }
}
function DocumentVerificationComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14);
    \u0275\u0275repeaterCreate(1, DocumentVerificationComponent_Conditional_20_For_2_Template, 16, 9, "div", 19, _forTrack1, false, DocumentVerificationComponent_Conditional_20_ForEmpty_3_Template, 6, 0, "div", 20);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.filteredEtats());
  }
}
var DocumentVerificationComponent = class _DocumentVerificationComponent {
  userService = inject(UserService);
  router = inject(Router);
  state = signal({
    delegations: [],
    etatsParDelegation: /* @__PURE__ */ new Map(),
    statistics: [],
    selectedDelegation: null,
    selectedStatut: "ALL",
    loading: false,
    error: null,
    expandedDelegations: /* @__PURE__ */ new Set()
  });
  // Computed pour grouper les états par délégation
  etatsGroupes = computed(() => {
    const { delegations, etatsParDelegation, statistics } = this.state();
    return delegations.map((delegation) => {
      const etats = etatsParDelegation.get(delegation.id) || [];
      const stats = statistics.find((s) => s.delegationId === delegation.id);
      return {
        delegation,
        etats,
        stats: stats ? {
          total: stats.totalEtats,
          encours: stats.encoursCount,
          valide: stats.valideCount,
          accepte: stats.accepteCount,
          rejet: stats.rejetCount
        } : {
          total: etats.length,
          encours: etats.filter((e) => e.statut === "ENCOURS").length,
          valide: etats.filter((e) => e.statut === "VALIDE").length,
          accepte: etats.filter((e) => e.statut === "ACCEPTE").length,
          rejet: etats.filter((e) => e.statut === "REJET").length
        }
      };
    }).filter((g) => g.etats.length > 0 || g.stats.total > 0);
  });
  // Filtrer les états selon le statut sélectionné
  filteredEtats = computed(() => {
    const { selectedStatut } = this.state();
    const groupes = this.etatsGroupes();
    if (selectedStatut === "ALL") {
      return groupes;
    }
    return groupes.map((groupe) => __spreadProps(__spreadValues({}, groupe), {
      etats: groupe.etats.filter((e) => e.statut === selectedStatut)
    })).filter((g) => g.etats.length > 0);
  });
  statutOptions = [
    { value: "ALL", label: "Tous", color: "secondary" },
    { value: "ENCOURS", label: "En cours", color: "warning" },
    { value: "VALIDE", label: "Valid\xE9", color: "info" },
    { value: "ACCEPTE", label: "Accept\xE9", color: "success" },
    { value: "REJET", label: "Rejet\xE9", color: "danger" }
  ];
  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this.updateState({ loading: true, error: null });
    Promise.all([this.loadDelegations(), this.loadStatistics(), this.loadAllEtats()]).finally(() => {
      this.updateState({ loading: false });
    });
  }
  loadDelegations() {
    return __async(this, null, function* () {
      try {
        const response = yield this.userService.getAllDelegationsBackoffice$().toPromise();
        if (response?.data?.delegations) {
          this.updateState({ delegations: response.data.delegations });
        }
      } catch (error) {
        console.error("Erreur chargement d\xE9l\xE9gations:", error);
      }
    });
  }
  loadStatistics() {
    return __async(this, null, function* () {
      try {
        const response = yield this.userService.getStatsEtatsDocuments$().toPromise();
        if (response?.data?.statistics) {
          this.updateState({ statistics: response.data.statistics });
        }
      } catch (error) {
        console.error("Erreur chargement statistiques:", error);
      }
    });
  }
  loadAllEtats() {
    return __async(this, null, function* () {
      try {
        const response = yield this.userService.getAllEtatsDocuments$(0, 100).toPromise();
        if (response?.data?.etats) {
          const etatsParDelegation = /* @__PURE__ */ new Map();
          response.data.etats.forEach((etat) => {
            const delegationId = etat.delegationId || 0;
            if (!etatsParDelegation.has(delegationId)) {
              etatsParDelegation.set(delegationId, []);
            }
            etatsParDelegation.get(delegationId).push(etat);
          });
          this.updateState({ etatsParDelegation });
        }
      } catch (error) {
        console.error("Erreur chargement \xE9tats:", error);
        this.updateState({ error: "Erreur lors du chargement des donn\xE9es" });
      }
    });
  }
  loadEtatsByDelegation(delegationId) {
    return __async(this, null, function* () {
      try {
        const { selectedStatut } = this.state();
        const statut = selectedStatut !== "ALL" ? selectedStatut : void 0;
        const response = yield this.userService.getEtatsByDelegation$(delegationId, 0, 50, statut).toPromise();
        if (response?.data?.etats) {
          const { etatsParDelegation } = this.state();
          const newMap = new Map(etatsParDelegation);
          newMap.set(delegationId, response.data.etats);
          this.updateState({ etatsParDelegation: newMap });
        }
      } catch (error) {
        console.error("Erreur chargement \xE9tats d\xE9l\xE9gation:", error);
      }
    });
  }
  toggleDelegation(delegationId) {
    const { expandedDelegations } = this.state();
    const newSet = new Set(expandedDelegations);
    if (newSet.has(delegationId)) {
      newSet.delete(delegationId);
    } else {
      newSet.add(delegationId);
      this.loadEtatsByDelegation(delegationId);
    }
    this.updateState({ expandedDelegations: newSet });
  }
  isDelegationExpanded(delegationId) {
    return this.state().expandedDelegations.has(delegationId);
  }
  onStatutChange(statut) {
    this.updateState({ selectedStatut: statut });
    const { expandedDelegations } = this.state();
    expandedDelegations.forEach((delegationId) => {
      this.loadEtatsByDelegation(delegationId);
    });
  }
  viewDetail(etatId) {
    this.router.navigate(["/dashboards/document-verification/documents", etatId]);
  }
  getStatutClass(statut) {
    const classes = {
      ENCOURS: "badge-warning",
      VALIDE: "badge-info",
      ACCEPTE: "badge-success",
      REJET: "badge-danger"
    };
    return classes[statut] || "badge-secondary";
  }
  getStatutLabel(statut) {
    const labels = {
      ENCOURS: "En cours",
      VALIDE: "Valid\xE9",
      ACCEPTE: "Accept\xE9",
      REJET: "Rejet\xE9"
    };
    return labels[statut] || statut;
  }
  formatDate(dateString) {
    if (!dateString)
      return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  updateState(partial) {
    this.state.update((current) => __spreadValues(__spreadValues({}, current), partial));
  }
  refresh() {
    this.loadData();
  }
  static \u0275fac = function DocumentVerificationComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DocumentVerificationComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DocumentVerificationComponent, selectors: [["app-document-verification"]], features: [\u0275\u0275ProvidersFeature([UserService])], decls: 21, vars: 5, consts: [[1, "document-verification-container"], [1, "page-header"], [1, "header-content"], [1, "page-title"], [1, "fas", "fa-file-alt"], [1, "page-subtitle"], [1, "btn", "btn-primary", 3, "click"], [1, "fas", "fa-sync-alt"], [1, "filters-section"], [1, "filter-group"], [1, "btn-group"], [1, "btn", "btn-filter", 3, "active", "ngClass"], [1, "loading-overlay"], [1, "alert", "alert-danger"], [1, "delegations-list"], [1, "btn", "btn-filter", 3, "click", "ngClass"], ["role", "status", 1, "spinner-border", "text-primary"], [1, "visually-hidden"], [1, "fas", "fa-exclamation-triangle"], [1, "delegation-card", 3, "expanded"], [1, "empty-state-global"], [1, "delegation-card"], [1, "delegation-header", 3, "click"], [1, "delegation-info"], [1, "fas", "fa-building"], [1, "delegation-name"], [1, "delegation-stats"], [1, "stat-badge", "total"], [1, "fas", "fa-folder"], [1, "stat-badge", "warning"], [1, "stat-badge", "info"], [1, "stat-badge", "success"], [1, "stat-badge", "danger"], [1, "fas", "fa-chevron-down", "toggle-icon"], [1, "delegation-content"], [1, "empty-state"], [1, "etats-table-wrapper"], [1, "fas", "fa-inbox"], [1, "etats-table"], [1, "id-cell"], [1, "user-cell"], [1, "fas", "fa-user"], [1, "phone-cell"], [1, "fas", "fa-phone"], [1, "docs-cell"], [1, "docs-badge"], [1, "fas", "fa-file-image"], [1, "badge", 3, "ngClass"], [1, "date-cell"], [1, "actions-cell"], [1, "btn", "btn-sm", "btn-primary", 3, "click"], [1, "fas", "fa-eye"], [1, "fas", "fa-folder-open"]], template: function DocumentVerificationComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1", 3);
      \u0275\u0275element(4, "i", 4);
      \u0275\u0275text(5, " V\xE9rification des Documents ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "p", 5);
      \u0275\u0275text(7, "Gestion des demandes de carte pr\xE9pay\xE9e par d\xE9l\xE9gation");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "button", 6);
      \u0275\u0275listener("click", function DocumentVerificationComponent_Template_button_click_8_listener() {
        return ctx.refresh();
      });
      \u0275\u0275element(9, "i", 7);
      \u0275\u0275text(10, " Actualiser ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(11, "div", 8)(12, "div", 9)(13, "label");
      \u0275\u0275text(14, "Filtrer par statut :");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "div", 10);
      \u0275\u0275repeaterCreate(16, DocumentVerificationComponent_For_17_Template, 2, 4, "button", 11, _forTrack0);
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(18, DocumentVerificationComponent_Conditional_18_Template, 6, 0, "div", 12)(19, DocumentVerificationComponent_Conditional_19_Template, 3, 1, "div", 13)(20, DocumentVerificationComponent_Conditional_20_Template, 4, 1, "div", 14);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(9);
      \u0275\u0275classProp("fa-spin", ctx.state().loading);
      \u0275\u0275advance(7);
      \u0275\u0275repeater(ctx.statutOptions);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.state().loading ? 18 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.state().error ? 19 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.state().loading && !ctx.state().error ? 20 : -1);
    }
  }, dependencies: [CommonModule, NgClass, FormsModule], styles: ["\n\n.document-verification-container[_ngcontent-%COMP%] {\n  padding: 1.5rem;\n  max-width: 1400px;\n  margin: 0 auto;\n}\n.page-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 1.5rem;\n  padding-bottom: 1rem;\n  border-bottom: 2px solid #e9ecef;\n}\n.page-header[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%]   .page-title[_ngcontent-%COMP%] {\n  font-size: 1.75rem;\n  font-weight: 700;\n  color: #2c3e50;\n  margin: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n}\n.page-header[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%]   .page-title[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: #3498db;\n}\n.page-header[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%]   .page-subtitle[_ngcontent-%COMP%] {\n  color: #6c757d;\n  margin: 0.25rem 0 0;\n  font-size: 0.95rem;\n}\n.filters-section[_ngcontent-%COMP%] {\n  background: #fff;\n  padding: 1rem 1.5rem;\n  border-radius: 10px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);\n  margin-bottom: 1.5rem;\n}\n.filters-section[_ngcontent-%COMP%]   .filter-group[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n}\n.filters-section[_ngcontent-%COMP%]   .filter-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #495057;\n  white-space: nowrap;\n}\n.filters-section[_ngcontent-%COMP%]   .filter-group[_ngcontent-%COMP%]   .btn-group[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.5rem;\n  flex-wrap: wrap;\n}\n.filters-section[_ngcontent-%COMP%]   .filter-group[_ngcontent-%COMP%]   .btn-filter[_ngcontent-%COMP%] {\n  padding: 0.5rem 1rem;\n  border-radius: 20px;\n  font-size: 0.875rem;\n  transition: all 0.2s ease;\n}\n.filters-section[_ngcontent-%COMP%]   .filter-group[_ngcontent-%COMP%]   .btn-filter.active[_ngcontent-%COMP%] {\n  transform: scale(1.05);\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);\n}\n.loading-overlay[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 4rem;\n  color: #6c757d;\n}\n.loading-overlay[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n}\n.delegations-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.delegation-card[_ngcontent-%COMP%] {\n  background: #fff;\n  border-radius: 12px;\n  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);\n  overflow: hidden;\n  transition: all 0.3s ease;\n}\n.delegation-card[_ngcontent-%COMP%]:hover {\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);\n}\n.delegation-card.expanded[_ngcontent-%COMP%]   .toggle-icon[_ngcontent-%COMP%] {\n  transform: rotate(180deg);\n}\n.delegation-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 1.25rem 1.5rem;\n  cursor: pointer;\n  background:\n    linear-gradient(\n      135deg,\n      #f8f9fa 0%,\n      #fff 100%);\n  border-bottom: 1px solid transparent;\n  transition: all 0.2s ease;\n}\n.delegation-header[_ngcontent-%COMP%]:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #e9ecef 0%,\n      #f8f9fa 100%);\n}\n.delegation-header[_ngcontent-%COMP%]   .delegation-info[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n}\n.delegation-header[_ngcontent-%COMP%]   .delegation-info[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  color: #3498db;\n}\n.delegation-header[_ngcontent-%COMP%]   .delegation-info[_ngcontent-%COMP%]   .delegation-name[_ngcontent-%COMP%] {\n  font-size: 1.15rem;\n  font-weight: 600;\n  color: #2c3e50;\n  margin: 0;\n}\n.delegation-header[_ngcontent-%COMP%]   .delegation-stats[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.75rem;\n  flex-wrap: wrap;\n}\n.delegation-header[_ngcontent-%COMP%]   .delegation-stats[_ngcontent-%COMP%]   .stat-badge[_ngcontent-%COMP%] {\n  padding: 0.35rem 0.75rem;\n  border-radius: 20px;\n  font-size: 0.8rem;\n  font-weight: 500;\n  display: flex;\n  align-items: center;\n  gap: 0.35rem;\n}\n.delegation-header[_ngcontent-%COMP%]   .delegation-stats[_ngcontent-%COMP%]   .stat-badge.total[_ngcontent-%COMP%] {\n  background: #e9ecef;\n  color: #495057;\n}\n.delegation-header[_ngcontent-%COMP%]   .delegation-stats[_ngcontent-%COMP%]   .stat-badge.warning[_ngcontent-%COMP%] {\n  background: #fff3cd;\n  color: #856404;\n}\n.delegation-header[_ngcontent-%COMP%]   .delegation-stats[_ngcontent-%COMP%]   .stat-badge.info[_ngcontent-%COMP%] {\n  background: #cce5ff;\n  color: #004085;\n}\n.delegation-header[_ngcontent-%COMP%]   .delegation-stats[_ngcontent-%COMP%]   .stat-badge.success[_ngcontent-%COMP%] {\n  background: #d4edda;\n  color: #155724;\n}\n.delegation-header[_ngcontent-%COMP%]   .delegation-stats[_ngcontent-%COMP%]   .stat-badge.danger[_ngcontent-%COMP%] {\n  background: #f8d7da;\n  color: #721c24;\n}\n.delegation-header[_ngcontent-%COMP%]   .toggle-icon[_ngcontent-%COMP%] {\n  color: #6c757d;\n  transition: transform 0.3s ease;\n}\n.delegation-content[_ngcontent-%COMP%] {\n  padding: 1.5rem;\n  background: #fafbfc;\n  animation: _ngcontent-%COMP%_slideDown 0.3s ease;\n}\n@keyframes _ngcontent-%COMP%_slideDown {\n  from {\n    opacity: 0;\n    max-height: 0;\n  }\n  to {\n    opacity: 1;\n    max-height: 1000px;\n  }\n}\n.etats-table-wrapper[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n.etats-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  background: #fff;\n  border-radius: 8px;\n  overflow: hidden;\n  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);\n}\n.etats-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%] {\n  background: #f1f3f4;\n}\n.etats-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  padding: 0.875rem 1rem;\n  text-align: left;\n  font-weight: 600;\n  color: #495057;\n  font-size: 0.85rem;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  white-space: nowrap;\n}\n.etats-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n  border-bottom: 1px solid #e9ecef;\n  transition: background 0.2s ease;\n}\n.etats-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover {\n  background: #f8f9fa;\n}\n.etats-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:last-child {\n  border-bottom: none;\n}\n.etats-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 1rem;\n  vertical-align: middle;\n  font-size: 0.9rem;\n}\n.etats-table[_ngcontent-%COMP%]   .id-cell[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #3498db;\n}\n.etats-table[_ngcontent-%COMP%]   .user-cell[_ngcontent-%COMP%]   i[_ngcontent-%COMP%], \n.etats-table[_ngcontent-%COMP%]   .phone-cell[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: #6c757d;\n  margin-right: 0.5rem;\n}\n.etats-table[_ngcontent-%COMP%]   .docs-cell[_ngcontent-%COMP%]   .docs-badge[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n  padding: 0.25rem 0.75rem;\n  background: #e3f2fd;\n  color: #1976d2;\n  border-radius: 20px;\n  font-weight: 500;\n}\n.etats-table[_ngcontent-%COMP%]   .date-cell[_ngcontent-%COMP%] {\n  color: #6c757d;\n  font-size: 0.85rem;\n}\n.etats-table[_ngcontent-%COMP%]   .actions-cell[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n}\n.badge[_ngcontent-%COMP%] {\n  padding: 0.4rem 0.75rem;\n  border-radius: 20px;\n  font-size: 0.8rem;\n  font-weight: 500;\n}\n.badge.badge-warning[_ngcontent-%COMP%] {\n  background: #fff3cd;\n  color: #856404;\n}\n.badge.badge-info[_ngcontent-%COMP%] {\n  background: #cce5ff;\n  color: #004085;\n}\n.badge.badge-success[_ngcontent-%COMP%] {\n  background: #d4edda;\n  color: #155724;\n}\n.badge.badge-danger[_ngcontent-%COMP%] {\n  background: #f8d7da;\n  color: #721c24;\n}\n.empty-state[_ngcontent-%COMP%], \n.empty-state-global[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 3rem;\n  color: #6c757d;\n}\n.empty-state[_ngcontent-%COMP%]   i[_ngcontent-%COMP%], \n.empty-state-global[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  margin-bottom: 1rem;\n  opacity: 0.5;\n}\n.empty-state[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%], \n.empty-state-global[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0 0 0.5rem;\n  color: #495057;\n}\n.empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n.empty-state-global[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.empty-state-global[_ngcontent-%COMP%] {\n  background: #fff;\n  border-radius: 12px;\n  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);\n}\n@media (max-width: 768px) {\n  .page-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 1rem;\n  }\n  .filters-section[_ngcontent-%COMP%]   .filter-group[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .delegation-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 1rem;\n  }\n  .delegation-stats[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=document-verification.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DocumentVerificationComponent, { className: "DocumentVerificationComponent", filePath: "src/app/pages/dashboard/agent-credit/digital-verification/document-verification/document-verification.component.ts", lineNumber: 28 });
})();
export {
  DocumentVerificationComponent
};
//# sourceMappingURL=chunk-QQRDP2GQ.js.map
