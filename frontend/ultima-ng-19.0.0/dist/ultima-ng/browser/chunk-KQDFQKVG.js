import {
  FluidModule
} from "./chunk-KPJXCGM6.js";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionModule,
  AccordionPanel
} from "./chunk-GWCBG6OL.js";
import {
  TextareaModule
} from "./chunk-RW4OSSQT.js";
import {
  Message,
  MessageModule
} from "./chunk-CSEZIGTY.js";
import {
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
import "./chunk-JGOABXTK.js";
import "./chunk-HY2A3TN6.js";
import "./chunk-YEN5RMZS.js";
import "./chunk-XS7IVZ5T.js";
import "./chunk-CUABQE42.js";
import "./chunk-V6CKOH3G.js";
import "./chunk-DBPX6ILC.js";
import {
  IconFieldModule,
  InputIconModule
} from "./chunk-WIQZFAVH.js";
import "./chunk-CCBQFN2J.js";
import {
  ProgressSpinner
} from "./chunk-Y2J5OGKB.js";
import {
  Router,
  RouterLink
} from "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
import {
  takeUntilDestroyed
} from "./chunk-WRLBQDQK.js";
import {
  InputTextModule
} from "./chunk-FZELBHWZ.js";
import "./chunk-4IUQ6KTI.js";
import "./chunk-IVSL2HKS.js";
import "./chunk-E352KRZV.js";
import "./chunk-HHD4PK4J.js";
import {
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
  CurrencyPipe,
  DatePipe
} from "./chunk-SQQPVFHK.js";
import {
  DestroyRef,
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
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate2
} from "./chunk-ZKKMBKIA.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/pages/dashboard/agent-credit/credit-selection/credit-selection.component.ts
var _c0 = () => [];
var _c1 = () => [10, 25, 50];
var _c2 = () => ["nom", "prenom", "numeroMembre", "activite"];
var _c3 = (a0) => ["/dashboards/credit/individuel/attente/detail", a0];
function CreditSelectionComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4);
    \u0275\u0275element(1, "p-progressSpinner");
    \u0275\u0275elementEnd();
  }
}
function CreditSelectionComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 5);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("text", ctx_r0.state().error);
  }
}
function CreditSelectionComponent_Conditional_9_For_2_ng_template_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th");
    \u0275\u0275text(2, "R\xE9ference");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th");
    \u0275\u0275text(4, "Client");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th");
    \u0275\u0275text(6, "Num\xE9ro Membre");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th");
    \u0275\u0275text(8, "Montant");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th");
    \u0275\u0275text(10, "Activit\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th");
    \u0275\u0275text(12, "Statut");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th");
    \u0275\u0275text(14, "Heure");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th");
    \u0275\u0275text(16, "Actions");
    \u0275\u0275elementEnd()();
  }
}
function CreditSelectionComponent_Conditional_9_For_2_ng_template_12_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 19);
    \u0275\u0275text(1, "En cours de validation");
    \u0275\u0275elementEnd();
    \u0275\u0275element(2, "p-button", 18);
  }
  if (rf & 2) {
    const demande_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(1, _c3, demande_r2.demandeIndividuelId));
  }
}
function CreditSelectionComponent_Conditional_9_For_2_ng_template_12_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-button", 18);
  }
  if (rf & 2) {
    const demande_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(1, _c3, demande_r2.demandeIndividuelId));
  }
}
function CreditSelectionComponent_Conditional_9_For_2_ng_template_12_Template(rf, ctx) {
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
    \u0275\u0275pipe(9, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td");
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "td");
    \u0275\u0275element(13, "p-tag", 17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "td");
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td");
    \u0275\u0275template(18, CreditSelectionComponent_Conditional_9_For_2_ng_template_12_Conditional_18_Template, 3, 3)(19, CreditSelectionComponent_Conditional_9_For_2_ng_template_12_Conditional_19_Template, 1, 3, "p-button", 18);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const demande_r2 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(demande_r2.demandeIndividuelId);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", demande_r2.prenom, " ", demande_r2.nom, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(demande_r2.numeroMembre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(9, 10, demande_r2.montantDemande, "GNF "));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(demande_r2.descriptionActivite);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r0.getStatusLabel(demande_r2.statutDemande, demande_r2.validationState))("severity", ctx_r0.getStatusSeverity(demande_r2.statutDemande, demande_r2.validationState));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(16, 13, demande_r2.createdAt, "short"));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(demande_r2.statutDemande === "EN_ATTENTE" && demande_r2.validationState === "APPROVED" ? 18 : 19);
  }
}
function CreditSelectionComponent_Conditional_9_For_2_ng_template_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 20);
    \u0275\u0275text(2, " Aucune demande trouv\xE9e pour cette date ");
    \u0275\u0275elementEnd()();
  }
}
function CreditSelectionComponent_Conditional_9_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-accordion-panel")(1, "p-accordion-header")(2, "div", 7)(3, "div", 8);
    \u0275\u0275element(4, "i", 9);
    \u0275\u0275elementStart(5, "span", 10);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(7, "p-tag", 11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "p-accordion-content")(9, "div", 12)(10, "p-table", 13);
    \u0275\u0275template(11, CreditSelectionComponent_Conditional_9_For_2_ng_template_11_Template, 17, 0, "ng-template", 14)(12, CreditSelectionComponent_Conditional_9_For_2_ng_template_12_Template, 20, 16, "ng-template", 15)(13, CreditSelectionComponent_Conditional_9_For_2_ng_template_13_Template, 3, 0, "ng-template", 16);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_12_0;
    let tmp_14_0;
    const dateKey_r3 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r0.formatDateHeader(dateKey_r3));
    \u0275\u0275advance();
    \u0275\u0275property("value", ((tmp_12_0 = ctx_r0.state().groupedDemandes.get(dateKey_r3)) == null ? null : tmp_12_0.length) + " demande(s)");
    \u0275\u0275advance(3);
    \u0275\u0275property("value", ctx_r0.state().groupedDemandes.get(dateKey_r3) || \u0275\u0275pureFunction0(7, _c0))("paginator", (((tmp_14_0 = ctx_r0.state().groupedDemandes.get(dateKey_r3)) == null ? null : tmp_14_0.length) || 0) > 10)("rows", 10)("rowsPerPageOptions", \u0275\u0275pureFunction0(8, _c1))("globalFilterFields", \u0275\u0275pureFunction0(9, _c2));
  }
}
function CreditSelectionComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-accordion");
    \u0275\u0275repeaterCreate(1, CreditSelectionComponent_Conditional_9_For_2_Template, 14, 10, "p-accordion-panel", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.state().dateKeys);
  }
}
function CreditSelectionComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 6);
  }
}
var CreditSelectionComponent = class _CreditSelectionComponent {
  state = signal({
    loading: false,
    message: void 0,
    error: void 0,
    statusOptions: [],
    groupedDemandes: /* @__PURE__ */ new Map(),
    dateKeys: []
  });
  userService = inject(UserService);
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  messageService = inject(MessageService);
  ngOnInit() {
    this.loadDemandeSelection();
  }
  loadDemandeSelection() {
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { loading: true, error: void 0 }));
    this.userService.getAllDemandeCreditByDate$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        const demandes = response.data.demandeAttentes || [];
        const groupedMap = this.groupDemandesByDate(demandes);
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          demandeAttentes: demandes,
          groupedDemandes: groupedMap,
          dateKeys: Array.from(groupedMap.keys()).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()),
          loading: false,
          message: response.message,
          error: void 0
        }));
      },
      error: (error) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          loading: false,
          message: void 0,
          error
        }));
      }
    });
  }
  groupDemandesByDate(demandes) {
    const groupedMap = /* @__PURE__ */ new Map();
    for (const demande of demandes) {
      const date = new Date(demande.createdAt);
      const dateString = date.toISOString().split("T")[0];
      if (!groupedMap.has(dateString)) {
        groupedMap.set(dateString, []);
      }
      groupedMap.get(dateString).push(demande);
    }
    return groupedMap;
  }
  getStatusLabel(statutDemande, validationState) {
    if (statutDemande === "EN_ATTENTE" && validationState === "NOUVEAU") {
      return "NOUVELLE DEMANDE";
    } else if (statutDemande === "EN_ATTENTE" && validationState === "SELECTION") {
      return "SELECTION";
    } else if (statutDemande === "EN_ATTENTE" && validationState === "APPROVED") {
      return "EN COURS DE VALIDATION PAR DA";
    }
    return statutDemande;
  }
  getStatusSeverity(statutDemande, validationState) {
    if (statutDemande === "EN_ATTENTE" && validationState === "APPROVED")
      return "danger";
    if (statutDemande === "EN_ATTENTE")
      return "info";
    if (statutDemande === "REJECTED")
      return "danger";
    return void 0;
  }
  formatDateHeader(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
  }
  // Optional: Add refresh method for manual refresh
  refreshData() {
    this.loadDemandeSelection();
  }
  static \u0275fac = function CreditSelectionComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CreditSelectionComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CreditSelectionComponent, selectors: [["app-credit-selection"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 11, vars: 3, consts: [[1, "card"], [1, "flex", "flex-col", "text-center", "md:text-left"], [1, "text-surface-900", "dark:text-surface-0", "text-2xl", "mb-2"], [1, "text-surface-600", "dark:text-surface-200", "text-lg"], [1, "flex", "justify-center", "my-4"], ["severity", "error", "styleClass", "w-full mb-4", 3, "text"], ["severity", "info", "text", "Aucune demande en s\xE9lection trouv\xE9e"], [1, "flex", "justify-between", "items-center", "w-full"], [1, "flex", "items-center", "gap-2"], [1, "pi", "pi-calendar"], [1, "font-semibold"], ["severity", "info", 3, "value"], [1, "p-4"], ["dataKey", "demandeindividuel_id", "responsiveLayout", "scroll", 3, "value", "paginator", "rows", "rowsPerPageOptions", "globalFilterFields"], ["pTemplate", "header"], ["pTemplate", "body"], ["pTemplate", "emptymessage"], [3, "value", "severity"], ["icon", "pi pi-eye", "severity", "help", "rounded", "", "pTooltip", "G\xE9rer la s\xE9lection", 3, "routerLink"], [1, "text-muted"], ["colspan", "7", 1, "text-center"]], template: function CreditSelectionComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "span", 2);
      \u0275\u0275text(3, "Liste des demandes de credits pour la selection ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "span", 3)(5, "p-message");
      \u0275\u0275text(6, "Vous pouvez maintenant cliquer sur l'icon du bouton TELEVERSERVER LA FICHE DE SELECTION pour remonter le document");
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(7, CreditSelectionComponent_Conditional_7_Template, 2, 0, "div", 4)(8, CreditSelectionComponent_Conditional_8_Template, 1, 1, "p-message", 5)(9, CreditSelectionComponent_Conditional_9_Template, 3, 0, "p-accordion")(10, CreditSelectionComponent_Conditional_10_Template, 1, 0, "p-message", 6);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(7);
      \u0275\u0275conditional(ctx.state().loading ? 7 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.state().error ? 8 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.state().dateKeys && ctx.state().dateKeys.length > 0 ? 9 : 10);
    }
  }, dependencies: [CommonModule, CurrencyPipe, DatePipe, FluidModule, InputTextModule, ButtonModule, Button, PrimeTemplate, TextareaModule, TableModule, Table, DividerModule, MessageModule, Message, IconFieldModule, InputIconModule, TagModule, Tag, ProgressSpinner, AccordionModule, Accordion, AccordionPanel, AccordionHeader, AccordionContent, RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CreditSelectionComponent, { className: "CreditSelectionComponent", filePath: "src/app/pages/dashboard/agent-credit/credit-selection/credit-selection.component.ts", lineNumber: 28 });
})();
export {
  CreditSelectionComponent
};
//# sourceMappingURL=chunk-KQDFQKVG.js.map
