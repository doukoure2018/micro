import {
  Textarea,
  TextareaModule
} from "./chunk-RW4OSSQT.js";
import {
  Message,
  MessageModule
} from "./chunk-CSEZIGTY.js";
import {
  Dialog,
  DialogModule
} from "./chunk-LPU4RT7P.js";
import "./chunk-WWXP2HWK.js";
import "./chunk-CXW3XKZ2.js";
import {
  Toast,
  ToastModule
} from "./chunk-6SRYYUT2.js";
import {
  MultiSelect,
  MultiSelectModule
} from "./chunk-T4LUJXIT.js";
import "./chunk-SN3HAAMO.js";
import "./chunk-4JIPYACT.js";
import "./chunk-6GA37Q7Z.js";
import {
  CardModule
} from "./chunk-H46GQ57A.js";
import {
  InputNumber,
  InputNumberModule
} from "./chunk-JGOABXTK.js";
import "./chunk-CUABQE42.js";
import {
  Dropdown,
  DropdownModule
} from "./chunk-ZCIQCP6V.js";
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
import {
  InputText,
  InputTextModule
} from "./chunk-FZELBHWZ.js";
import "./chunk-4IUQ6KTI.js";
import "./chunk-IVSL2HKS.js";
import "./chunk-E352KRZV.js";
import "./chunk-HHD4PK4J.js";
import {
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
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  RequiredValidator,
  ɵNgNoValidate
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
  ɵɵpureFunction2,
  ɵɵpureFunction6,
  ɵɵpureFunction7,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-ZKKMBKIA.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/pages/dashboard/agent-credit/view-detail-credit/form-place-credit/form-credit.component.ts
var _c0 = () => [];
var _c1 = () => ({ label: "Principal Niv\xE9l\xE9", value: "1" });
var _c2 = () => ({ label: "Niv\xE9l\xE9", value: "2" });
var _c3 = () => ({ label: "Multiperiode", value: "3" });
var _c4 = () => ({ label: "\xC0 l'\xE9ch\xE9ance", value: "4" });
var _c5 = () => ({ label: "Un Seul Paiement", value: "5" });
var _c6 = () => ({ label: "Plan Libre", value: "6" });
var _c7 = () => ({ label: "Versement Global", value: "7" });
var _c8 = (a0, a1, a2, a3, a4, a5, a6) => [a0, a1, a2, a3, a4, a5, a6];
var _c9 = () => ({ label: "Anticip\xE9", value: "A" });
var _c10 = () => ({ label: "\xC0 l'\xE9ch\xE9ance", value: "V" });
var _c11 = (a0, a1) => [a0, a1];
var _c12 = () => ({ label: "Horaire", value: "H" });
var _c13 = () => ({ label: "Fixe", value: "F" });
var _c14 = () => ({ label: "Variable", value: "V" });
var _c15 = () => ({ label: "Cr\xE9dit Personnel (10%)", value: "TCCRG" });
var _c16 = () => ({ label: "Cr\xE9dit Court Terme (36%)", value: "CTCT" });
var _c17 = () => ({ label: "Cr\xE9dit Moyen Terme (30%)", value: "CTMT" });
var _c18 = () => ({ label: "Cr\xE9dit Long Terme (24%)", value: "CTLT" });
var _c19 = () => ({ label: "Cr\xE9dit \xC9quipement (18%)", value: "TCEQ" });
var _c20 = () => ({ label: "Taux Z\xE9ro (0%)", value: "ZERO" });
var _c21 = (a0, a1, a2, a3, a4, a5) => [a0, a1, a2, a3, a4, a5];
var _c22 = () => ({ label: "P\xE9nalit\xE9s Standard (1%)", value: "PEN" });
var _c23 = () => ({ width: "450px" });
var _c24 = () => ({ width: "50px", height: "50px" });
function FormCreditComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4);
    \u0275\u0275element(1, "p-progressSpinner");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(2, _c24));
  }
}
function FormCreditComponent_Conditional_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 28);
  }
}
function FormCreditComponent_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 32);
  }
}
function FormCreditComponent_Conditional_68_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 40);
  }
}
function FormCreditComponent_Conditional_73_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 43);
  }
}
function FormCreditComponent_Conditional_81_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 46);
  }
}
function FormCreditComponent_Conditional_86_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 49);
  }
}
function FormCreditComponent_Conditional_91_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 52);
  }
}
function FormCreditComponent_Conditional_96_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 55);
  }
}
function FormCreditComponent_Conditional_104_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 59);
  }
}
function FormCreditComponent_Conditional_109_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 63);
  }
}
function FormCreditComponent_ng_template_153_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 92);
    \u0275\u0275listener("click", function FormCreditComponent_ng_template_153_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.onModalClose());
    });
    \u0275\u0275elementEnd();
  }
}
var FormCreditComponent = class _FormCreditComponent {
  userService = inject(UserService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  messageService = inject(MessageService);
  showSuccessModal = false;
  creditNumber = "";
  referenceCredit = "";
  state = signal({
    loading: false,
    submitting: false,
    message: void 0,
    error: void 0
  });
  ngOnInit() {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const referenceCredit = params["referenceCredit"];
      const numeroMembre = params["numeroMembre"];
      const userId = +params["userId"];
      if (referenceCredit && numeroMembre && userId) {
        this.referenceCredit = referenceCredit;
        this.loadDetailsCredits(referenceCredit, numeroMembre, userId);
      } else {
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Param\xE8tres manquants pour charger les d\xE9tails du cr\xE9dit",
          life: 5e3
        });
      }
    });
  }
  loadDetailsCredits(referenceCredit, numeroMembre, userId) {
    this.state.set(__spreadProps(__spreadValues({}, this.state()), { loading: true }));
    this.userService.startMiseEnPlaceCredit$(referenceCredit, numeroMembre, userId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.state.set(__spreadProps(__spreadValues({}, this.state()), {
          membre: response.data.membre,
          user: response.data.user,
          cumulCredit: response.data.cumulCredit,
          countCredit: response.data.countCredit,
          terms: response.data.terms,
          inversions: response.data.inversions,
          actividas: response.data.actividas,
          sousActividas: response.data.sousActividas,
          sousSousActividas: response.data.sousSousActividas,
          requisitos: response.data.requisitos,
          originFonds: response.data.originFonds,
          typeCredito: response.data.typeCredito,
          creditDto: response.data.creditDto,
          loading: false,
          message: response.message
        }));
      },
      error: (error) => {
        console.error("Error loading credit details:", error);
        this.state.set(__spreadProps(__spreadValues({}, this.state()), {
          error: "Erreur lors du chargement des d\xE9tails du cr\xE9dit",
          loading: false
        }));
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Impossible de charger les d\xE9tails du cr\xE9dit",
          life: 5e3
        });
      }
    });
  }
  onActividadChange(event) {
    const actividadId = event.value;
    if (actividadId) {
      const filteredSousActivites = this.state().sousActividas?.filter((sa) => sa.codActividad === actividadId) || [];
      this.state.set(__spreadProps(__spreadValues({}, this.state()), {
        selectedActividad: actividadId,
        selectedSousActivite: void 0,
        filteredSousActividas: filteredSousActivites,
        filteredSousSousActividas: []
      }));
    } else {
      this.state.set(__spreadProps(__spreadValues({}, this.state()), {
        selectedActividad: void 0,
        selectedSousActivite: void 0,
        filteredSousActividas: [],
        filteredSousSousActividas: []
      }));
    }
  }
  onSousActiviteChange(event) {
    const sousActiviteId = event.value;
    if (sousActiviteId && this.state().selectedActividad) {
      const filteredSousSousActivites = this.state().sousSousActividas?.filter((ssa) => ssa.codActividad === this.state().selectedActividad && ssa.codSousActivite === sousActiviteId) || [];
      this.state.set(__spreadProps(__spreadValues({}, this.state()), {
        selectedSousActivite: sousActiviteId,
        filteredSousSousActividas: filteredSousSousActivites
      }));
    } else {
      this.state.set(__spreadProps(__spreadValues({}, this.state()), {
        selectedSousActivite: void 0,
        filteredSousSousActividas: []
      }));
    }
  }
  onSubmit(form) {
    if (form.invalid) {
      Object.keys(form.controls).forEach((key) => {
        const control = form.controls[key];
        control.markAsTouched();
      });
      this.messageService.add({
        severity: "warn",
        summary: "Attention",
        detail: "Veuillez remplir tous les champs obligatoires",
        life: 5e3
      });
      return;
    }
    const formValue = form.value;
    const userCode = this.state().user?.username.toLocaleUpperCase() || "";
    const empresaCode = "00000";
    const agenciaCode = this.state().membre?.codAgencia || "";
    console.log("Using dynamic user code:", userCode.toUpperCase());
    console.log("Using empresa code:", empresaCode);
    console.log("Using dynamic agencia code:", agenciaCode);
    if (!userCode || !agenciaCode) {
      this.messageService.add({
        severity: "error",
        summary: "Erreur",
        detail: "Donn\xE9es utilisateur ou agence manquantes",
        life: 5e3
      });
      this.state.set(__spreadProps(__spreadValues({}, this.state()), { submitting: false }));
      return;
    }
    const creditRequest = {
      codAgencia: agenciaCode,
      // Agence dynamique du membre
      tipCredito: parseInt(String(this.state().typeCredito?.typeCreditPKId?.tip_CREDITO ?? "1")),
      codCliente: this.state().membre?.clientesPKId?.codCliente || "",
      monCredito: this.state().creditDto?.montantCredit || 0,
      cantCuotas: parseInt(formValue.cantCuotas) || 1,
      codUsuario: userCode,
      // Username dynamique
      codOrigen: formValue.codOrigen || "",
      codPlanInversion: formValue.codPlanInversion || "",
      codPlazo: formValue.codPlazo || "",
      codActividad: this.state().selectedActividad || formValue.codActividad || "",
      codSubactiv: this.state().selectedSousActivite || formValue.codSubactiv || "",
      codSubsubactividad: formValue.codSubsubactividad || "",
      codTasaInt: formValue.codTasaInt || "TCCRG",
      // Taux crédit personnel 10%
      codTasaMora: formValue.codTasaMora || "PEN",
      // Intérêts pénalités 1%
      tipModalidadCobro: formValue.tipModalidadCobro || "V",
      // V ou H autorisés
      tipInteres: formValue.tipInteres || "A",
      // A ou V autorisés
      tipCalendario: parseInt(formValue.tipCalendario) || 1,
      tipCuota: formValue.tipCuota || "1",
      plazoCredito: parseInt(formValue.plazoCredito) || 0,
      tipTasa: formValue.tipTasa || "F",
      // F ou V autorisés
      tasaInteres: parseFloat(formValue.tasaInteres) || 0,
      tasaMora: parseFloat(formValue.tasaMora) || 0,
      indLinea: formValue.indLinea || "",
      observaciones: formValue.observaciones || "",
      codEjecutivo: userCode,
      // Même utilisateur pour exécutif
      requisitos: (formValue.requisitos || []).map((id) => ({ codRequisito: id }))
    };
    this.state.set(__spreadProps(__spreadValues({}, this.state()), { submitting: true }));
    this.userService.miseEnPlaceCredit$(this.referenceCredit, creditRequest).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.state.set(__spreadProps(__spreadValues({}, this.state()), { submitting: false }));
        if (response.data && response.data.creditResponse && response.data.creditResponse.numCredito) {
          this.creditNumber = response.data.creditResponse.numCredito;
          this.showSuccessModal = true;
          this.messageService.add({
            severity: "success",
            summary: "Succ\xE8s",
            detail: `Cr\xE9dit cr\xE9\xE9 avec succ\xE8s. Num\xE9ro: ${this.creditNumber}`,
            life: 5e3
          });
        }
      },
      error: (error) => {
        this.state.set(__spreadProps(__spreadValues({}, this.state()), { submitting: false }));
        console.error("Error creating credit:", error);
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: error.error?.message || "Erreur lors de la cr\xE9ation du cr\xE9dit",
          life: 5e3
        });
      }
    });
  }
  onModalClose() {
    this.showSuccessModal = false;
    this.router.navigate(["/dashboards/home"]);
  }
  static \u0275fac = function FormCreditComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FormCreditComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FormCreditComponent, selectors: [["app-mise-en-place-credit"]], features: [\u0275\u0275ProvidersFeature([MessageService, ConfirmationService])], decls: 154, vars: 146, consts: [["creditForm", "ngForm"], [1, "card"], [1, "text-surface-900", "dark:text-surface-0", "text-xl", "font-bold", "mb-6", "block"], [1, "col-span-12", "lg:col-span-2"], [1, "flex", "justify-center", "mb-4"], [1, "col-span-12", "lg:col-span-10"], [3, "ngSubmit"], [1, "grid", "grid-cols-12", "gap-4"], [1, "col-span-12"], [1, "text-surface-900", "dark:text-surface-0", "text-lg", "font-semibold", "mb-4", "border-b", "pb-2"], [1, "mb-4", "col-span-12", "md:col-span-6"], ["for", "numeroCredit", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["pInputText", "", "name", "numeroCredit", "id", "numeroCredit", "type", "text", 1, "w-full", 3, "ngModel", "disabled"], ["for", "cumul", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["name", "cumul", "id", "cumul", "mode", "currency", "currency", "GNF", "styleClass", "w-full", 3, "ngModel", "disabled"], [1, "mb-4", "col-span-12", "md:col-span-4"], ["for", "codCliente", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["pInputText", "", "name", "codCliente", "id", "codCliente", "type", "text", 1, "w-full", 3, "ngModel", "disabled"], ["for", "nomClient", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["pInputText", "", "name", "nomClient", "id", "nomClient", "type", "text", 1, "w-full", 3, "ngModel", "disabled"], ["for", "adresse", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["pTextarea", "", "ngModel", "", "name", "adresse", "id", "adresse", "rows", "2", 1, "w-full", 3, "disabled"], ["for", "tipCredito", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["pInputText", "", "name", "tipCredito", "id", "tipCredito", "type", "text", 1, "w-full", 3, "ngModel", "disabled"], ["for", "monCredito", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["name", "monCredito", "id", "monCredito", "mode", "currency", "currency", "GNF", "styleClass", "w-full", 3, "ngModel", "disabled"], ["for", "cantCuotas", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["ngModel", "", "name", "cantCuotas", "id", "cantCuotas", "required", "", "styleClass", "w-full", 3, "showButtons", "min", "disabled"], ["severity", "error", "text", "La quantit\xE9 de paiements est obligatoire"], [1, "mb-4", "col-span-12", "md:col-span-8"], ["for", "codPlazo", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["ngModel", "", "name", "codPlazo", "id", "codPlazo", "optionLabel", "des_PLAZO", "optionValue", "id", "filterBy", "des_PLAZO", "placeholder", "S\xE9lectionner un terme", "required", "", "styleClass", "w-full", "appendTo", "body", 3, "options", "filter", "disabled"], ["severity", "error", "text", "Le terme est obligatoire"], [1, "col-span-12", "mt-6"], ["for", "codUsuario", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["pInputText", "", "name", "codUsuario", "id", "codUsuario", "type", "text", 1, "w-full", 3, "ngModel", "disabled"], ["for", "codAgencia", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["pInputText", "", "name", "codAgencia", "id", "codAgencia", "type", "text", 1, "w-full", 3, "ngModel", "disabled"], ["for", "codOrigen", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["ngModel", "", "name", "codOrigen", "id", "codOrigen", "optionLabel", "des_ORIGEN", "optionValue", "id", "filterBy", "des_ORIGEN", "placeholder", "S\xE9lectionner une origine", "required", "", "styleClass", "w-full", "appendTo", "body", 3, "options", "filter", "disabled"], ["severity", "error", "text", "L'origine de fonds est obligatoire"], ["for", "codPlanInversion", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["ngModel", "", "name", "codPlanInversion", "id", "codPlanInversion", "optionLabel", "nom_PLAN", "optionValue", "id", "filterBy", "nom_PLAN", "placeholder", "S\xE9lectionner un plan", "required", "", "styleClass", "w-full", "appendTo", "body", 3, "options", "filter", "disabled"], ["severity", "error", "text", "Le plan d'investissement est obligatoire"], ["for", "codActividad", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["ngModel", "", "name", "codActividad", "id", "codActividad", "optionLabel", "des_ACTIVIDAD", "optionValue", "id", "filterBy", "des_ACTIVIDAD", "placeholder", "S\xE9lectionner une activit\xE9", "required", "", "styleClass", "w-full", "appendTo", "body", 3, "onChange", "options", "filter", "disabled"], ["severity", "error", "text", "L'activit\xE9 est obligatoire"], ["for", "codSubactiv", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["ngModel", "", "name", "codSubactiv", "id", "codSubactiv", "optionLabel", "des_SUBACTIV", "optionValue", "id", "filterBy", "des_SUBACTIV", "placeholder", "S\xE9lectionner une sous-activit\xE9", "required", "", "styleClass", "w-full", "appendTo", "body", 3, "onChange", "options", "filter", "disabled"], ["severity", "error", "text", "La sous-activit\xE9 est obligatoire"], ["for", "codSubsubactividad", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["ngModel", "", "name", "codSubsubactividad", "id", "codSubsubactividad", "optionLabel", "des_SUBSUBACTIV", "optionValue", "id", "filterBy", "des_SUBSUBACTIV", "placeholder", "S\xE9lectionner une sous-sous-activit\xE9", "required", "", "styleClass", "w-full", "appendTo", "body", 3, "options", "filter", "disabled"], ["severity", "error", "text", "La sous-sous-activit\xE9 est obligatoire"], ["for", "observaciones", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["pTextarea", "", "ngModel", "", "name", "observaciones", "id", "observaciones", "rows", "3", "required", "", "placeholder", "Saisir vos observations", 1, "w-full", 3, "autoResize", "disabled"], ["severity", "error", "text", "L'observation est obligatoire"], [1, "mb-4", "col-span-12"], ["for", "requisitos", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["ngModel", "", "name", "requisitos", "id", "requisitos", "optionLabel", "des_REQUISITO", "optionValue", "id", "placeholder", "Choisir une ou plusieurs conditions", "required", "", "styleClass", "w-full", "appendTo", "body", 3, "options", "filter", "showClear", "disabled"], ["severity", "error", "text", "Au moins une condition doit \xEAtre s\xE9lectionn\xE9e"], [1, "mb-6", "col-span-12", "md:col-span-6"], ["for", "tipCuota", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["name", "tipCuota", "id", "tipCuota", "optionLabel", "label", "optionValue", "value", "filterBy", "label", "placeholder", "S\xE9lectionner un type", "required", "", "styleClass", "w-full", "appendTo", "body", 3, "ngModel", "options", "filter", "disabled"], ["severity", "error", "text", "Le type de versement est obligatoire"], ["for", "tipInteres", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["name", "tipInteres", "id", "tipInteres", "optionLabel", "label", "optionValue", "value", "placeholder", "S\xE9lectionner un type", "styleClass", "w-full", "appendTo", "body", 3, "ngModel", "options", "disabled"], ["for", "tipModalidadCobro", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["name", "tipModalidadCobro", "id", "tipModalidadCobro", "optionLabel", "label", "optionValue", "value", "placeholder", "S\xE9lectionner une modalit\xE9", "styleClass", "w-full", "appendTo", "body", 3, "ngModel", "options", "disabled"], ["for", "tipTasa", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["name", "tipTasa", "id", "tipTasa", "optionLabel", "label", "optionValue", "value", "placeholder", "S\xE9lectionner un type", "styleClass", "w-full", "appendTo", "body", 3, "ngModel", "options", "disabled"], ["for", "codTasaInt", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["name", "codTasaInt", "id", "codTasaInt", "optionLabel", "label", "optionValue", "value", "placeholder", "S\xE9lectionner un taux", "styleClass", "w-full", "appendTo", "body", 3, "ngModel", "options", "disabled"], ["for", "codTasaMora", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["name", "codTasaMora", "id", "codTasaMora", "optionLabel", "label", "optionValue", "value", "placeholder", "S\xE9lectionner un taux", "styleClass", "w-full", "appendTo", "body", 3, "ngModel", "options", "disabled"], ["type", "hidden", "ngModel", "", "name", "tipCalendario", 3, "value"], ["type", "hidden", "ngModel", "", "name", "tasaInteres", 3, "value"], ["type", "hidden", "ngModel", "", "name", "tasaMora", 3, "value"], ["type", "hidden", "ngModel", "", "name", "plazoCredito", 3, "value"], ["type", "hidden", "ngModel", "", "name", "codTasaInt", 3, "value"], ["type", "hidden", "ngModel", "", "name", "codTasaMora", 3, "value"], ["type", "hidden", "ngModel", "", "name", "indLinea", 3, "value"], ["type", "hidden", "ngModel", "", "name", "codEjecutivo", 3, "value"], [1, "flex", "gap-3"], ["pButton", "", "pRipple", "", "type", "submit", "label", "Valider la mise en place", "icon", "pi pi-check", 1, "w-auto", "mt-3", 3, "loading", "disabled"], ["pButton", "", "pRipple", "", "type", "button", "label", "Annuler", "icon", "pi pi-times", 1, "p-button-secondary", "w-auto", "mt-3", 3, "click", "disabled"], ["header", "Cr\xE9dit cr\xE9\xE9 avec succ\xE8s", 3, "visibleChange", "visible", "modal", "closable", "draggable", "resizable"], [1, "text-center"], [1, "pi", "pi-check-circle", 2, "font-size", "3rem", "color", "var(--green-500)"], [1, "mt-3"], [1, "mt-2"], [1, "text-muted"], ["pTemplate", "footer"], ["pButton", "", "type", "button", "label", "OK", "icon", "pi pi-check", 1, "p-button-primary", 3, "click"]], template: function FormCreditComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 1);
      \u0275\u0275element(1, "p-toast");
      \u0275\u0275elementStart(2, "span", 2);
      \u0275\u0275text(3, " Formulaire de mise en place de cr\xE9dit - ");
      \u0275\u0275elementStart(4, "strong");
      \u0275\u0275text(5);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 3);
      \u0275\u0275template(7, FormCreditComponent_Conditional_7_Template, 2, 3, "div", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "div", 5)(9, "form", 6, 0);
      \u0275\u0275listener("ngSubmit", function FormCreditComponent_Template_form_ngSubmit_9_listener() {
        \u0275\u0275restoreView(_r1);
        const creditForm_r2 = \u0275\u0275reference(10);
        return \u0275\u0275resetView(ctx.onSubmit(creditForm_r2));
      });
      \u0275\u0275elementStart(11, "div", 7)(12, "div", 8)(13, "h3", 9);
      \u0275\u0275text(14, " Mise en place du Cr\xE9dit ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(15, "div", 10)(16, "label", 11);
      \u0275\u0275text(17, " N\xB0 d'ordre de cr\xE9dit ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(18, "input", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "div", 10)(20, "label", 13);
      \u0275\u0275text(21, " Cumul des Cr\xE9dits Pr\xE9c\xE9dents ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(22, "p-inputNumber", 14);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "div", 15)(24, "label", 16);
      \u0275\u0275text(25, " Code Membre ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(26, "input", 17);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "div", 15)(28, "label", 18);
      \u0275\u0275text(29, " Nom Client ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(30, "input", 19);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(31, "div", 15)(32, "label", 20);
      \u0275\u0275text(33, " Adresse ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(34, "textarea", 21);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(35, "div", 10)(36, "label", 22);
      \u0275\u0275text(37, " Type de Cr\xE9dit ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(38, "input", 23);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(39, "div", 10)(40, "label", 24);
      \u0275\u0275text(41, " Montant Demand\xE9 ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(42, "p-inputNumber", 25);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(43, "div", 15)(44, "label", 26);
      \u0275\u0275text(45, " Quantit\xE9 Paiements ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(46, "p-inputNumber", 27);
      \u0275\u0275template(47, FormCreditComponent_Conditional_47_Template, 1, 0, "p-message", 28);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(48, "div", 29)(49, "label", 30);
      \u0275\u0275text(50, " Terme ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(51, "p-dropdown", 31);
      \u0275\u0275template(52, FormCreditComponent_Conditional_52_Template, 1, 0, "p-message", 32);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(53, "div", 33)(54, "h3", 9);
      \u0275\u0275text(55, " Origine des Fonds ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(56, "div", 10)(57, "label", 34);
      \u0275\u0275text(58, " Gestionnaire de Compte ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(59, "input", 35);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(60, "div", 10)(61, "label", 36);
      \u0275\u0275text(62, " Agence ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(63, "input", 37);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(64, "div", 10)(65, "label", 38);
      \u0275\u0275text(66, " Origine de Fonds ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(67, "p-dropdown", 39);
      \u0275\u0275template(68, FormCreditComponent_Conditional_68_Template, 1, 0, "p-message", 40);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(69, "div", 10)(70, "label", 41);
      \u0275\u0275text(71, " Plan d'investissement ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(72, "p-dropdown", 42);
      \u0275\u0275template(73, FormCreditComponent_Conditional_73_Template, 1, 0, "p-message", 43);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(74, "div", 33)(75, "h3", 9);
      \u0275\u0275text(76, " Activit\xE9 ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(77, "div", 10)(78, "label", 44);
      \u0275\u0275text(79, " Activit\xE9 ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(80, "p-dropdown", 45);
      \u0275\u0275listener("onChange", function FormCreditComponent_Template_p_dropdown_onChange_80_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onActividadChange($event));
      });
      \u0275\u0275elementEnd();
      \u0275\u0275template(81, FormCreditComponent_Conditional_81_Template, 1, 0, "p-message", 46);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(82, "div", 10)(83, "label", 47);
      \u0275\u0275text(84, " Sous Activit\xE9 ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(85, "p-dropdown", 48);
      \u0275\u0275listener("onChange", function FormCreditComponent_Template_p_dropdown_onChange_85_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onSousActiviteChange($event));
      });
      \u0275\u0275elementEnd();
      \u0275\u0275template(86, FormCreditComponent_Conditional_86_Template, 1, 0, "p-message", 49);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(87, "div", 10)(88, "label", 50);
      \u0275\u0275text(89, " Sous Sous Activit\xE9 ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(90, "p-dropdown", 51);
      \u0275\u0275template(91, FormCreditComponent_Conditional_91_Template, 1, 0, "p-message", 52);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(92, "div", 10)(93, "label", 53);
      \u0275\u0275text(94, " Observation ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(95, "textarea", 54);
      \u0275\u0275template(96, FormCreditComponent_Conditional_96_Template, 1, 0, "p-message", 55);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(97, "div", 33)(98, "h3", 9);
      \u0275\u0275text(99, " Conditions d'obtention de cr\xE9dit ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(100, "div", 56)(101, "label", 57);
      \u0275\u0275text(102, " Liste des conditions d'obtention ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(103, "p-multiSelect", 58);
      \u0275\u0275template(104, FormCreditComponent_Conditional_104_Template, 1, 0, "p-message", 59);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(105, "div", 60)(106, "label", 61);
      \u0275\u0275text(107, " Type de Versement ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(108, "p-dropdown", 62);
      \u0275\u0275template(109, FormCreditComponent_Conditional_109_Template, 1, 0, "p-message", 63);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(110, "div", 60)(111, "label", 64);
      \u0275\u0275text(112, " Type d'Int\xE9r\xEAt ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(113, "p-dropdown", 65);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(114, "div", 60)(115, "label", 66);
      \u0275\u0275text(116, " Modalit\xE9 de Recouvrement ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(117, "p-dropdown", 67);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(118, "div", 60)(119, "label", 68);
      \u0275\u0275text(120, " Type de Taux ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(121, "p-dropdown", 69);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(122, "div", 60)(123, "label", 70);
      \u0275\u0275text(124, " Taux d'Int\xE9r\xEAt ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(125, "p-dropdown", 71);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(126, "div", 60)(127, "label", 72);
      \u0275\u0275text(128, " Taux de P\xE9nalit\xE9 ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(129, "p-dropdown", 73);
      \u0275\u0275elementEnd();
      \u0275\u0275element(130, "input", 74)(131, "input", 75)(132, "input", 76)(133, "input", 77)(134, "input", 78)(135, "input", 79)(136, "input", 80)(137, "input", 81);
      \u0275\u0275elementStart(138, "div", 8)(139, "div", 82);
      \u0275\u0275element(140, "button", 83);
      \u0275\u0275elementStart(141, "button", 84);
      \u0275\u0275listener("click", function FormCreditComponent_Template_button_click_141_listener() {
        \u0275\u0275restoreView(_r1);
        const creditForm_r2 = \u0275\u0275reference(10);
        return \u0275\u0275resetView(creditForm_r2.resetForm());
      });
      \u0275\u0275elementEnd()()()()()()();
      \u0275\u0275elementStart(142, "p-dialog", 85);
      \u0275\u0275twoWayListener("visibleChange", function FormCreditComponent_Template_p_dialog_visibleChange_142_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.showSuccessModal, $event) || (ctx.showSuccessModal = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementStart(143, "div", 86);
      \u0275\u0275element(144, "i", 87);
      \u0275\u0275elementStart(145, "h4", 88);
      \u0275\u0275text(146, "Cr\xE9dit cr\xE9\xE9 avec succ\xE8s!");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(147, "p", 89)(148, "strong");
      \u0275\u0275text(149, "Num\xE9ro de cr\xE9dit:");
      \u0275\u0275elementEnd();
      \u0275\u0275text(150);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(151, "p", 90);
      \u0275\u0275text(152, " Le cr\xE9dit a \xE9t\xE9 mis en place et son statut a \xE9t\xE9 mis \xE0 jour. ");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(153, FormCreditComponent_ng_template_153_Template, 1, 0, "ng-template", 91);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_1_0;
      let tmp_7_0;
      let tmp_9_0;
      let tmp_12_0;
      let tmp_14_0;
      let tmp_24_0;
      let tmp_26_0;
      const creditForm_r2 = \u0275\u0275reference(10);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate((tmp_1_0 = ctx.state().membre) == null ? null : tmp_1_0.nom_CLIENTE);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.state().submitting || ctx.state().loading ? 7 : -1);
      \u0275\u0275advance(11);
      \u0275\u0275property("ngModel", ctx.state().countCredit)("disabled", true);
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", ctx.state().cumulCredit)("disabled", true);
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", (tmp_7_0 = ctx.state().membre) == null ? null : tmp_7_0.clientesPKId == null ? null : tmp_7_0.clientesPKId.codCliente)("disabled", true);
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", (tmp_9_0 = ctx.state().membre) == null ? null : tmp_9_0.nom_CLIENTE)("disabled", true);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", (tmp_12_0 = ctx.state().typeCredito) == null ? null : tmp_12_0.des_TIP_CREDITO)("disabled", true);
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", (tmp_14_0 = ctx.state().creditDto) == null ? null : tmp_14_0.montantCredit)("disabled", true);
      \u0275\u0275advance(4);
      \u0275\u0275property("showButtons", true)("min", 1)("disabled", ctx.state().submitting);
      \u0275\u0275advance();
      \u0275\u0275conditional(creditForm_r2.controls["cantCuotas"] && creditForm_r2.controls["cantCuotas"].invalid && creditForm_r2.controls["cantCuotas"].touched ? 47 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("options", ctx.state().terms || \u0275\u0275pureFunction0(90, _c0))("filter", true)("disabled", ctx.state().submitting);
      \u0275\u0275advance();
      \u0275\u0275conditional(creditForm_r2.controls["codPlazo"] && creditForm_r2.controls["codPlazo"].invalid && creditForm_r2.controls["codPlazo"].touched ? 52 : -1);
      \u0275\u0275advance(7);
      \u0275\u0275property("ngModel", (tmp_24_0 = ctx.state().user) == null ? null : tmp_24_0.username == null ? null : tmp_24_0.username.toUpperCase())("disabled", true);
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", (tmp_26_0 = ctx.state().membre) == null ? null : tmp_26_0.codAgencia)("disabled", true);
      \u0275\u0275advance(4);
      \u0275\u0275property("options", ctx.state().originFonds || \u0275\u0275pureFunction0(91, _c0))("filter", true)("disabled", ctx.state().submitting);
      \u0275\u0275advance();
      \u0275\u0275conditional(creditForm_r2.controls["codOrigen"] && creditForm_r2.controls["codOrigen"].invalid && creditForm_r2.controls["codOrigen"].touched ? 68 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("options", ctx.state().inversions || \u0275\u0275pureFunction0(92, _c0))("filter", true)("disabled", ctx.state().submitting);
      \u0275\u0275advance();
      \u0275\u0275conditional(creditForm_r2.controls["codPlanInversion"] && creditForm_r2.controls["codPlanInversion"].invalid && creditForm_r2.controls["codPlanInversion"].touched ? 73 : -1);
      \u0275\u0275advance(7);
      \u0275\u0275property("options", ctx.state().actividas || \u0275\u0275pureFunction0(93, _c0))("filter", true)("disabled", ctx.state().submitting);
      \u0275\u0275advance();
      \u0275\u0275conditional(creditForm_r2.controls["codActividad"] && creditForm_r2.controls["codActividad"].invalid && creditForm_r2.controls["codActividad"].touched ? 81 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("options", ctx.state().filteredSousActividas || \u0275\u0275pureFunction0(94, _c0))("filter", true)("disabled", ctx.state().submitting || !ctx.state().filteredSousActividas || ctx.state().filteredSousActividas.length === 0);
      \u0275\u0275advance();
      \u0275\u0275conditional(creditForm_r2.controls["codSubactiv"] && creditForm_r2.controls["codSubactiv"].invalid && creditForm_r2.controls["codSubactiv"].touched ? 86 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("options", ctx.state().filteredSousSousActividas || \u0275\u0275pureFunction0(95, _c0))("filter", true)("disabled", ctx.state().submitting || !ctx.state().filteredSousSousActividas || ctx.state().filteredSousSousActividas.length === 0);
      \u0275\u0275advance();
      \u0275\u0275conditional(creditForm_r2.controls["codSubsubactividad"] && creditForm_r2.controls["codSubsubactividad"].invalid && creditForm_r2.controls["codSubsubactividad"].touched ? 91 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("autoResize", true)("disabled", ctx.state().submitting);
      \u0275\u0275advance();
      \u0275\u0275conditional(creditForm_r2.controls["observaciones"] && creditForm_r2.controls["observaciones"].invalid && creditForm_r2.controls["observaciones"].touched ? 96 : -1);
      \u0275\u0275advance(7);
      \u0275\u0275property("options", ctx.state().requisitos || \u0275\u0275pureFunction0(96, _c0))("filter", true)("showClear", true)("disabled", ctx.state().submitting);
      \u0275\u0275advance();
      \u0275\u0275conditional(creditForm_r2.controls["requisitos"] && creditForm_r2.controls["requisitos"].invalid && creditForm_r2.controls["requisitos"].touched ? 104 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", "1")("options", \u0275\u0275pureFunction7(104, _c8, \u0275\u0275pureFunction0(97, _c1), \u0275\u0275pureFunction0(98, _c2), \u0275\u0275pureFunction0(99, _c3), \u0275\u0275pureFunction0(100, _c4), \u0275\u0275pureFunction0(101, _c5), \u0275\u0275pureFunction0(102, _c6), \u0275\u0275pureFunction0(103, _c7)))("filter", true)("disabled", ctx.state().submitting);
      \u0275\u0275advance();
      \u0275\u0275conditional(creditForm_r2.controls["tipCuota"] && creditForm_r2.controls["tipCuota"].invalid && creditForm_r2.controls["tipCuota"].touched ? 109 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", "A")("options", \u0275\u0275pureFunction2(114, _c11, \u0275\u0275pureFunction0(112, _c9), \u0275\u0275pureFunction0(113, _c10)))("disabled", ctx.state().submitting);
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", "V")("options", \u0275\u0275pureFunction2(119, _c11, \u0275\u0275pureFunction0(117, _c10), \u0275\u0275pureFunction0(118, _c12)))("disabled", ctx.state().submitting);
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", "F")("options", \u0275\u0275pureFunction2(124, _c11, \u0275\u0275pureFunction0(122, _c13), \u0275\u0275pureFunction0(123, _c14)))("disabled", ctx.state().submitting);
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", "TCCRG")("options", \u0275\u0275pureFunction6(133, _c21, \u0275\u0275pureFunction0(127, _c15), \u0275\u0275pureFunction0(128, _c16), \u0275\u0275pureFunction0(129, _c17), \u0275\u0275pureFunction0(130, _c18), \u0275\u0275pureFunction0(131, _c19), \u0275\u0275pureFunction0(132, _c20)))("disabled", ctx.state().submitting);
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", "PEN")("options", \u0275\u0275pureFunction2(142, _c11, \u0275\u0275pureFunction0(140, _c22), \u0275\u0275pureFunction0(141, _c20)))("disabled", ctx.state().submitting);
      \u0275\u0275advance();
      \u0275\u0275property("value", 1);
      \u0275\u0275advance();
      \u0275\u0275property("value", 0);
      \u0275\u0275advance();
      \u0275\u0275property("value", 0);
      \u0275\u0275advance();
      \u0275\u0275property("value", 0);
      \u0275\u0275advance(7);
      \u0275\u0275property("loading", ctx.state().submitting)("disabled", creditForm_r2 && creditForm_r2.invalid || ctx.state().submitting);
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance();
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(145, _c23));
      \u0275\u0275twoWayProperty("visible", ctx.showSuccessModal);
      \u0275\u0275property("modal", true)("closable", false)("draggable", false)("resizable", false);
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate1(" ", ctx.creditNumber, " ");
    }
  }, dependencies: [CommonModule, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, NgModel, NgForm, DialogModule, Dialog, PrimeTemplate, ButtonModule, ButtonDirective, InputTextModule, InputText, InputNumberModule, InputNumber, DropdownModule, Dropdown, TextareaModule, Textarea, MultiSelectModule, MultiSelect, CardModule, ProgressSpinnerModule, ProgressSpinner, MessageModule, Message, ToastModule, Toast], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FormCreditComponent, { className: "FormCreditComponent", filePath: "src/app/pages/dashboard/agent-credit/view-detail-credit/form-place-credit/form-credit.component.ts", lineNumber: 41 });
})();
export {
  FormCreditComponent
};
//# sourceMappingURL=chunk-PREUT56W.js.map
