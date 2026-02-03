import {
  TypeCreditService
} from "./chunk-YHWPLZ6H.js";
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
  Chip,
  ChipModule
} from "./chunk-SN3HAAMO.js";
import {
  ActivatedRoute,
  Router
} from "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
import {
  takeUntilDestroyed
} from "./chunk-WRLBQDQK.js";
import "./chunk-KHEKFKWA.js";
import "./chunk-IVSL2HKS.js";
import "./chunk-E352KRZV.js";
import "./chunk-HHD4PK4J.js";
import {
  Button,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import "./chunk-AP3OAIHW.js";
import {
  ConfirmationService,
  MessageService
} from "./chunk-NQNBRQ7H.js";
import {
  UserService
} from "./chunk-SQ5BRWVW.js";
import "./chunk-ZRELZ6R7.js";
import "./chunk-BMYIFZHZ.js";
import "./chunk-W3K3GK4Z.js";
import {
  CommonModule,
  NgIf
} from "./chunk-SQQPVFHK.js";
import {
  DestroyRef,
  EMPTY,
  inject,
  signal,
  switchMap,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-ZKKMBKIA.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/pages/dashboard/agent-credit/start-credit/start-credit.component.ts
var _c0 = () => ({ width: "450px" });
function StartCreditComponent_div_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24)(1, "div", 25)(2, "div", 10);
    \u0275\u0275element(3, "i", 26);
    \u0275\u0275elementStart(4, "span", 27);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" Attention : Type de cr\xE9dit non reconnu (", (tmp_1_0 = ctx_r0.state().demandeIndividuel) == null ? null : tmp_1_0.tipCredito, ") ");
  }
}
function StartCreditComponent_i_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 28);
  }
}
function StartCreditComponent_p_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275element(1, "i", 29);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Montant ", (((tmp_1_0 = ctx_r0.state().demandeIndividuel) == null ? null : tmp_1_0.montantDemande) || 0) <= 25e6 ? "\xE9ligible pour traitement standard" : "n\xE9cessitant un traitement sp\xE9cialis\xE9", " ");
  }
}
var StartCreditComponent = class _StartCreditComponent {
  state = signal({
    loading: false,
    message: void 0,
    error: void 0
  });
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  activatedRouter = inject(ActivatedRoute);
  userService = inject(UserService);
  typeCreditService = inject(TypeCreditService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  ngOnInit() {
    this.loadLastDemandeInd();
  }
  loadLastDemandeInd() {
    this.activatedRouter.paramMap.pipe(switchMap((params) => {
      const numeroMembre = params.get("numeroMembre");
      if (numeroMembre) {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { loading: true, message: void 0, error: void 0 }));
        return this.userService.getLastDemandeInd$(numeroMembre);
      } else {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { loading: false, message: void 0, error: "Invalide NumeroMembre" }));
        return EMPTY;
      }
    }), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          demandeIndividuel: response.data.demandeIndividuel,
          user: response.data.user,
          loading: false,
          message: response.message,
          error: void 0
        }));
      },
      error: (error) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { loading: false, message: void 0, error }));
      }
    });
  }
  /**
   * Formate le montant en devise guinéenne (GNF)
   * @param montant - Le montant à formater
   * @returns Le montant formaté avec la devise GNF
   */
  formatMontantGNF(montant) {
    if (!montant)
      return "0 GNF";
    return new Intl.NumberFormat("fr-GN", {
      style: "currency",
      currency: "GNF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(montant);
  }
  /**
   * Retourne la description du type de crédit en utilisant le service
   * @param tipCredito - L'ID du type de crédit
   * @returns La description du type de crédit
   */
  getCreditTypeDescription(tipCredito) {
    return this.typeCreditService.getCreditTypeDescription(tipCredito);
  }
  /**
   * Vérifie si le type de crédit existe
   * @param tipCredito - L'ID du type de crédit
   * @returns true si le type existe
   */
  isCreditTypeValid(tipCredito) {
    return tipCredito ? this.typeCreditService.creditTypeExists(tipCredito) : false;
  }
  /**
   * Retourne la couleur du chip selon le type de crédit
   * @param tipCredito - L'ID du type de crédit
   * @returns La classe CSS pour colorer le chip
   */
  getCreditTypeChipStyle(tipCredito) {
    if (!tipCredito)
      return "bg-gray-100 text-gray-800";
    if (tipCredito <= 5)
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (tipCredito <= 14)
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    if (tipCredito <= 23)
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    if (tipCredito <= 47)
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  }
  startNewCredit(numeroMembre) {
    this.confirmationService.confirm({
      message: "\xCAtes-vous s\xFBr de vouloir continuer pour la mise en place du nouveau cr\xE9dit?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { loading: true }));
        this.userService.startCredit$(numeroMembre).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: "success",
              summary: "Succ\xE8s",
              detail: response.message
            });
            this.state.update((state) => __spreadProps(__spreadValues({}, state), { loading: false }));
            if (response.data && response.data.demandeIndividuel) {
              const montant = response.data.demandeIndividuel.montantDemande || 0;
              if (montant <= 25e6) {
                this.router.navigate(["/dashboards/agent-credit/process-credit", numeroMembre]);
              } else {
                this.router.navigate(["/dashboards/agent-credit/process-big-credit", numeroMembre]);
              }
            } else {
              const montant = this.state().demandeIndividuel?.montantDemande || 0;
              if (montant <= 25e6) {
                this.router.navigate(["/dashboards/agent-credit/process-credit", numeroMembre]);
              } else {
                this.router.navigate(["/dashboards/agent-credit/process-big-credit", numeroMembre]);
              }
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: "error",
              summary: "Erreur",
              detail: error
            });
            this.state.update((state) => __spreadProps(__spreadValues({}, state), { loading: false, error }));
          }
        });
      }
    });
  }
  static \u0275fac = function StartCreditComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _StartCreditComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _StartCreditComponent, selectors: [["app-start-credit"]], features: [\u0275\u0275ProvidersFeature([MessageService, ConfirmationService])], decls: 49, vars: 15, consts: [[1, "bg-surface-0", "dark:bg-surface-950", "px-6", "py-20", "md:px-12", "lg:px-20"], [1, "bg-surface-0", "dark:bg-surface-950"], [1, "font-medium", "text-3xl", "text-surface-900", "dark:text-surface-0", "mb-4"], [1, "bg-white", "dark:bg-surface-800", "shadow-lg", "rounded-lg", "overflow-hidden"], [1, "bg-surface-50", "dark:bg-surface-700", "px-6", "py-4"], [1, "flex", "items-center", "font-semibold", "text-surface-700", "dark:text-surface-200", "text-sm", "uppercase", "tracking-wide"], [1, "w-6/12", "md:w-2/12"], [1, "px-6", "py-4"], [1, "flex", "items-center", "text-surface-600", "dark:text-surface-300"], [1, "w-6/12", "md:w-2/12", "font-medium"], [1, "flex", "items-center"], [1, "pi", "pi-user", "mr-2", "text-surface-400"], [1, "pi", "pi-phone", "mr-2", "text-surface-400"], [1, "pi", "pi-id-card", "mr-2", "text-surface-400"], [1, "pi", "pi-dollar", "mr-2", "text-green-500"], [1, "font-bold", "text-lg", "text-green-600", "dark:text-green-400"], [1, "pi", "pi-bookmark", "mr-2", "text-surface-400"], [3, "label", "styleClass"], ["class", "px-6 pb-4", 4, "ngIf"], [1, "text-surface-700", "dark:text-surface-100", "text-center"], ["label", "Commencer la mise en place de Cr\xE9dit", "icon", "pi pi-play", "raised", "", "rounded", "", 1, "font-bold", "px-8", "py-4", "whitespace-nowrap", 3, "click", "disabled"], ["class", "pi pi-spin pi-spinner mr-2", 4, "ngIf"], [1, "mt-4", "text-surface-500", "dark:text-surface-400", "text-sm"], [4, "ngIf"], [1, "px-6", "pb-4"], [1, "bg-orange-50", "dark:bg-orange-900", "border", "border-orange-200", "dark:border-orange-700", "rounded-lg", "p-3"], [1, "pi", "pi-exclamation-triangle", "text-orange-500", "mr-2"], [1, "text-orange-700", "dark:text-orange-200", "text-sm"], [1, "pi", "pi-spin", "pi-spinner", "mr-2"], [1, "pi", "pi-info-circle", "mr-1"]], template: function StartCreditComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "p-toast")(1, "p-confirmDialog");
      \u0275\u0275elementStart(2, "div", 0)(3, "div", 1)(4, "div", 2);
      \u0275\u0275text(5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "div", 3)(7, "div", 4)(8, "div", 5)(9, "div", 6);
      \u0275\u0275text(10, "Nom & Pr\xE9nom");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "div", 6);
      \u0275\u0275text(12, "T\xE9l\xE9phone");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 6);
      \u0275\u0275text(14, "N\xB0 Membre");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "div", 6);
      \u0275\u0275text(16, "Montant");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "div", 6);
      \u0275\u0275text(18, "Type de Cr\xE9dit");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(19, "div", 7)(20, "div", 8)(21, "div", 9)(22, "div", 10);
      \u0275\u0275element(23, "i", 11);
      \u0275\u0275text(24);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(25, "div", 9)(26, "div", 10);
      \u0275\u0275element(27, "i", 12);
      \u0275\u0275text(28);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(29, "div", 9)(30, "div", 10);
      \u0275\u0275element(31, "i", 13);
      \u0275\u0275text(32);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(33, "div", 9)(34, "div", 10);
      \u0275\u0275element(35, "i", 14);
      \u0275\u0275elementStart(36, "span", 15);
      \u0275\u0275text(37);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(38, "div", 9)(39, "div", 10);
      \u0275\u0275element(40, "i", 16)(41, "p-chip", 17);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275template(42, StartCreditComponent_div_42_Template, 6, 1, "div", 18);
      \u0275\u0275elementEnd()();
      \u0275\u0275element(43, "br");
      \u0275\u0275elementStart(44, "div", 19)(45, "p-button", 20);
      \u0275\u0275listener("click", function StartCreditComponent_Template_p_button_click_45_listener() {
        let tmp_0_0;
        return ctx.startNewCredit((tmp_0_0 = ctx.state().demandeIndividuel) == null ? null : tmp_0_0.numeroMembre);
      });
      \u0275\u0275template(46, StartCreditComponent_i_46_Template, 1, 0, "i", 21);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "div", 22);
      \u0275\u0275template(48, StartCreditComponent_p_48_Template, 3, 1, "p", 23);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      let tmp_2_0;
      let tmp_3_0;
      let tmp_4_0;
      let tmp_5_0;
      let tmp_6_0;
      let tmp_7_0;
      let tmp_8_0;
      let tmp_9_0;
      let tmp_11_0;
      \u0275\u0275advance();
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(14, _c0));
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate1(" ", ctx.state().message, " ");
      \u0275\u0275advance(19);
      \u0275\u0275textInterpolate2(" ", (tmp_2_0 = ctx.state().demandeIndividuel) == null ? null : tmp_2_0.nom, " ", (tmp_2_0 = ctx.state().demandeIndividuel) == null ? null : tmp_2_0.prenom, " ");
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate1(" ", (tmp_3_0 = ctx.state().demandeIndividuel) == null ? null : tmp_3_0.telephone, " ");
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate1(" ", (tmp_4_0 = ctx.state().demandeIndividuel) == null ? null : tmp_4_0.numeroMembre, " ");
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate1(" ", ctx.formatMontantGNF((tmp_5_0 = ctx.state().demandeIndividuel) == null ? null : tmp_5_0.montantDemande), " ");
      \u0275\u0275advance(4);
      \u0275\u0275property("label", ctx.getCreditTypeDescription((tmp_6_0 = ctx.state().demandeIndividuel) == null ? null : tmp_6_0.tipCredito))("styleClass", "text-xs font-semibold px-3 py-1 rounded-full " + ctx.getCreditTypeChipStyle((tmp_7_0 = ctx.state().demandeIndividuel) == null ? null : tmp_7_0.tipCredito));
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.isCreditTypeValid((tmp_8_0 = ctx.state().demandeIndividuel) == null ? null : tmp_8_0.tipCredito));
      \u0275\u0275advance(3);
      \u0275\u0275property("disabled", ctx.state().loading || !((tmp_9_0 = ctx.state().demandeIndividuel) == null ? null : tmp_9_0.numeroMembre));
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.state().loading);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngIf", (tmp_11_0 = ctx.state().demandeIndividuel) == null ? null : tmp_11_0.montantDemande);
    }
  }, dependencies: [CommonModule, NgIf, ButtonModule, Button, ChipModule, Chip, ConfirmDialogModule, ConfirmDialog, ToastModule, Toast], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(StartCreditComponent, { className: "StartCreditComponent", filePath: "src/app/pages/dashboard/agent-credit/start-credit/start-credit.component.ts", lineNumber: 23 });
})();
export {
  StartCreditComponent
};
//# sourceMappingURL=chunk-RPOFAKI2.js.map
