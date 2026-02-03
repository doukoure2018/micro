import {
  Accordion,
  AccordionModule,
  AccordionTab
} from "./chunk-GWCBG6OL.js";
import {
  Message,
  MessageModule
} from "./chunk-CSEZIGTY.js";
import {
  ProgressBar,
  ProgressBarModule
} from "./chunk-WQ2EPPBK.js";
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
import {
  CardModule
} from "./chunk-H46GQ57A.js";
import "./chunk-JGOABXTK.js";
import "./chunk-HY2A3TN6.js";
import "./chunk-YEN5RMZS.js";
import "./chunk-XS7IVZ5T.js";
import "./chunk-CUABQE42.js";
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
  ActivatedRoute,
  Router
} from "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
import {
  takeUntilDestroyed
} from "./chunk-WRLBQDQK.js";
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
  Button,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import "./chunk-AP3OAIHW.js";
import {
  PrimeTemplate
} from "./chunk-NQNBRQ7H.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  ɵNgNoValidate
} from "./chunk-3HTR5OU7.js";
import {
  UserService
} from "./chunk-SQ5BRWVW.js";
import "./chunk-ZRELZ6R7.js";
import "./chunk-BMYIFZHZ.js";
import "./chunk-W3K3GK4Z.js";
import {
  CommonModule,
  NgClass
} from "./chunk-SQQPVFHK.js";
import {
  DestroyRef,
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
  ɵɵpureFunction0,
  ɵɵpureFunction2,
  ɵɵpureFunction4,
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
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-ZKKMBKIA.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/pages/dashboard/analyse-credit/analyse-credit.component.ts
var _c0 = () => ({ "min-width": "70rem" });
var _c1 = () => ({ "height": "8px" });
var _c2 = (a0, a1) => ({ "bg-green-50": a0, "bg-orange-50": a1 });
var _c3 = (a0, a1, a2, a3) => ({ "text-green-600": a0, "text-blue-600": a1, "text-orange-600": a2, "text-red-600": a3 });
var _forTrack0 = ($index, $item) => $item.numCredito;
function AnalyseCreditComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2)(1, "div", 15);
    \u0275\u0275element(2, "p-progressSpinner", 16);
    \u0275\u0275elementStart(3, "p", 17);
    \u0275\u0275text(4, "Recherche en cours...");
    \u0275\u0275elementEnd()()();
  }
}
function AnalyseCreditComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275element(1, "p-message", 18);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("text", ctx_r0.state().message);
  }
}
function AnalyseCreditComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275element(1, "p-message", 19);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("text", ctx_r0.state().error);
  }
}
function AnalyseCreditComponent_Conditional_21_Conditional_40_ng_template_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 50);
    \u0275\u0275text(2, "N\xB0 Cr\xE9dit");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th", 51);
    \u0275\u0275text(4, "Type");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th", 52);
    \u0275\u0275text(6, "Agence");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 53);
    \u0275\u0275text(8, "Montant");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th", 53);
    \u0275\u0275text(10, "Solde");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th", 52);
    \u0275\u0275text(12, "Taux");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th", 50);
    \u0275\u0275text(14, "Dur\xE9e");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th", 54);
    \u0275\u0275text(16, "Ouverture");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "th", 54);
    \u0275\u0275text(18, "\xC9ch\xE9ance");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "th", 50);
    \u0275\u0275text(20, "Statut");
    \u0275\u0275elementEnd()();
  }
}
function AnalyseCreditComponent_Conditional_21_Conditional_40_ng_template_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "div", 55);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td");
    \u0275\u0275element(5, "p-tag", 56);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td")(7, "span", 57);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "td")(10, "div", 58);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "td")(13, "div", 59);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "td")(16, "span", 57);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "td")(19, "span", 60);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "td")(22, "span", 60);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "td")(25, "span", 60);
    \u0275\u0275text(26);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "td");
    \u0275\u0275element(28, "p-tag", 61);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const credit_r3 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(credit_r3.numCredito);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r0.getCreditTypeLabel(credit_r3.tipCredito));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(credit_r3.codAgencia);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.formatCurrency(credit_r3.monCredito));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", credit_r3.monSaldo === 0 ? "text-green-600 font-semibold" : "text-orange-600 font-semibold");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.formatCurrency(credit_r3.monSaldo), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", credit_r3.tasaInteres, "%");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", credit_r3.plazoCredito, " jours");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.formatDate(credit_r3.fecApertura));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.formatDate(credit_r3.fecVencimiento));
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r0.getStatusLabel(credit_r3.indEstado))("severity", ctx_r0.getStatusSeverity(credit_r3.indEstado));
  }
}
function AnalyseCreditComponent_Conditional_21_Conditional_40_ng_template_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 62);
    \u0275\u0275element(2, "i", 63);
    \u0275\u0275elementStart(3, "div");
    \u0275\u0275text(4, "Aucun cr\xE9dit trouv\xE9 pour ce client.");
    \u0275\u0275elementEnd()()();
  }
}
function AnalyseCreditComponent_Conditional_21_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 2)(1, "div", 37)(2, "div", 38)(3, "h4", 39);
    \u0275\u0275element(4, "i", 40);
    \u0275\u0275text(5, " Historique D\xE9taill\xE9 des Cr\xE9dits ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 41);
    \u0275\u0275element(7, "p-tag", 42);
    \u0275\u0275elementStart(8, "p-button", 43);
    \u0275\u0275listener("onClick", function AnalyseCreditComponent_Conditional_21_Conditional_40_Template_p_button_onClick_8_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.exportCreditHistory());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p-button", 44);
    \u0275\u0275listener("onClick", function AnalyseCreditComponent_Conditional_21_Conditional_40_Template_p_button_onClick_9_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.printCreditHistory());
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 45)(11, "p-table", 46);
    \u0275\u0275template(12, AnalyseCreditComponent_Conditional_21_Conditional_40_ng_template_12_Template, 21, 0, "ng-template", 47)(13, AnalyseCreditComponent_Conditional_21_Conditional_40_ng_template_13_Template, 29, 12, "ng-template", 48)(14, AnalyseCreditComponent_Conditional_21_Conditional_40_ng_template_14_Template, 5, 0, "ng-template", 49);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(7);
    \u0275\u0275property("value", ctx_r0.state().histoCredits.creditos.length + " cr\xE9dit(s)");
    \u0275\u0275advance(4);
    \u0275\u0275property("value", ctx_r0.state().histoCredits.creditos)("tableStyle", \u0275\u0275pureFunction0(7, _c0))("paginator", true)("rows", 5)("responsive", true)("scrollable", true);
  }
}
function AnalyseCreditComponent_Conditional_21_Conditional_41_For_9_Conditional_0_Conditional_0_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 82)(1, "div", 83);
    \u0275\u0275element(2, "i", 84);
    \u0275\u0275elementStart(3, "div")(4, "div", 85);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 78);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 86);
    \u0275\u0275element(9, "p-tag", 87)(10, "p-tag", 61);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const planPagos_r4 = \u0275\u0275nextContext(2);
    const credit_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("Cr\xE9dit N\xB0 ", credit_r5.numCredito, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" ", ctx_r0.getCreditTypeLabel(credit_r5.tipCredito), " - ", ctx_r0.formatCurrency(credit_r5.monCredito), " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("value", planPagos_r4.length + " \xE9ch\xE9ances");
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r0.getStatusLabel(credit_r5.indEstado))("severity", ctx_r0.getStatusSeverity(credit_r5.indEstado));
  }
}
function AnalyseCreditComponent_Conditional_21_Conditional_41_For_9_Conditional_0_Conditional_0_ng_template_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 52);
    \u0275\u0275text(2, "N\xB0 \xC9ch\xE9ance");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th", 54);
    \u0275\u0275text(4, "Date \xC9ch\xE9ance");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th", 54);
    \u0275\u0275text(6, "Date Paiement");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 51);
    \u0275\u0275text(8, "Montant \xC9ch\xE9ance");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th", 51);
    \u0275\u0275text(10, "Capital");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th", 51);
    \u0275\u0275text(12, "Int\xE9r\xEAts");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th", 51);
    \u0275\u0275text(14, "Solde Restant");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th", 52);
    \u0275\u0275text(16, "Jours Int.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "th", 50);
    \u0275\u0275text(18, "Statut");
    \u0275\u0275elementEnd()();
  }
}
function AnalyseCreditComponent_Conditional_21_Conditional_41_For_9_Conditional_0_Conditional_0_ng_template_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 59)(1, "td")(2, "span", 88);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td")(5, "span", 60);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "td")(8, "span", 89);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "td")(11, "span", 90);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "td")(14, "span", 91);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "td")(17, "span", 92);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "td")(20, "span", 93);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "td")(23, "span", 78);
    \u0275\u0275text(24);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "td");
    \u0275\u0275element(26, "p-tag", 94);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const plan_r6 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(6);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(14, _c2, plan_r6.indEstado === "C", plan_r6.indEstado === "A"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", plan_r6.numCuota === 0 ? "text-blue-600" : "text-900");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", plan_r6.numCuota === 0 ? "Ouverture" : plan_r6.numCuota, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.formatDate(plan_r6.fecCuota));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", plan_r6.fecCancelacion ? "text-green-600 font-semibold" : "text-500");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", plan_r6.fecCancelacion ? ctx_r0.formatDate(plan_r6.fecCancelacion) : "-", " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.formatCurrency(plan_r6.monCuota));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.formatCurrency(plan_r6.monPrincipal));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.formatCurrency(plan_r6.monInt));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", plan_r6.salCredito === 0 ? "text-green-600" : "text-orange-600");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.formatCurrency(plan_r6.salCredito), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(plan_r6.diaInt);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r0.getStatusLabel(plan_r6.indEstado))("severity", ctx_r0.getStatusSeverity(plan_r6.indEstado));
  }
}
function AnalyseCreditComponent_Conditional_21_Conditional_41_For_9_Conditional_0_Conditional_0_ng_template_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 95);
    \u0275\u0275element(2, "i", 96);
    \u0275\u0275elementStart(3, "div");
    \u0275\u0275text(4, "Aucun plan de paiement trouv\xE9 pour ce cr\xE9dit.");
    \u0275\u0275elementEnd()()();
  }
}
function AnalyseCreditComponent_Conditional_21_Conditional_41_For_9_Conditional_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-accordionTab");
    \u0275\u0275template(1, AnalyseCreditComponent_Conditional_21_Conditional_41_For_9_Conditional_0_Conditional_0_ng_template_1_Template, 11, 6, "ng-template", 47);
    \u0275\u0275elementStart(2, "div", 66)(3, "div", 1)(4, "div", 30)(5, "div", 31)(6, "div", 67);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 33);
    \u0275\u0275text(9, "Montant initial");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 30)(11, "div", 31)(12, "div", 68);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div", 33);
    \u0275\u0275text(15, "Capital rembours\xE9");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(16, "div", 30)(17, "div", 31)(18, "div", 69);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "div", 33);
    \u0275\u0275text(21, "Int\xE9r\xEAts pay\xE9s");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "div", 30)(23, "div", 31)(24, "div", 70);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "div", 33);
    \u0275\u0275text(27, "Solde restant");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(28, "div", 71)(29, "div", 72)(30, "span", 73);
    \u0275\u0275text(31, "Progression du remboursement");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "span", 74);
    \u0275\u0275text(33);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(34, "p-progressBar", 75);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "div", 45)(36, "p-table", 76);
    \u0275\u0275template(37, AnalyseCreditComponent_Conditional_21_Conditional_41_For_9_Conditional_0_Conditional_0_ng_template_37_Template, 19, 0, "ng-template", 47)(38, AnalyseCreditComponent_Conditional_21_Conditional_41_For_9_Conditional_0_Conditional_0_ng_template_38_Template, 27, 17, "ng-template", 48)(39, AnalyseCreditComponent_Conditional_21_Conditional_41_For_9_Conditional_0_Conditional_0_ng_template_39_Template, 5, 0, "ng-template", 49);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(40, "div", 77)(41, "div", 1)(42, "div", 30)(43, "div", 78);
    \u0275\u0275text(44, "\xC9ch\xE9ances programm\xE9es");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "div", 55);
    \u0275\u0275text(46);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(47, "div", 30)(48, "div", 78);
    \u0275\u0275text(49, "\xC9ch\xE9ances pay\xE9es");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "div", 79);
    \u0275\u0275text(51);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(52, "div", 30)(53, "div", 78);
    \u0275\u0275text(54, "\xC9ch\xE9ances restantes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "div", 80);
    \u0275\u0275text(56);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(57, "div", 30)(58, "div", 78);
    \u0275\u0275text(59, "Taux d'int\xE9r\xEAt");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(60, "div", 81);
    \u0275\u0275text(61);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const planPagos_r4 = \u0275\u0275nextContext();
    const credit_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1("", ctx_r0.formatCurrency(credit_r5.monCredito), " ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r0.formatCurrency(credit_r5.monPagadoPrincipal));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r0.formatCurrency(credit_r5.monPagadoIntereses));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", ctx_r0.formatCurrency(credit_r5.monSaldo), " ");
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1(" ", ctx_r0.calculateProgress(credit_r5).toFixed(1), "% ");
    \u0275\u0275advance();
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(17, _c1));
    \u0275\u0275property("value", ctx_r0.calculateProgress(credit_r5));
    \u0275\u0275advance(2);
    \u0275\u0275property("value", planPagos_r4)("tableStyle", \u0275\u0275pureFunction0(18, _c0))("paginator", true)("rows", 12)("scrollable", true);
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(planPagos_r4.length);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.getPaidInstallments(planPagos_r4));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", ctx_r0.getRemainingInstallments(planPagos_r4), " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", credit_r5.tasaInteres, "%");
  }
}
function AnalyseCreditComponent_Conditional_21_Conditional_41_For_9_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, AnalyseCreditComponent_Conditional_21_Conditional_41_For_9_Conditional_0_Conditional_0_Template, 62, 19, "p-accordionTab");
  }
  if (rf & 2) {
    \u0275\u0275conditional(ctx.length > 0 ? 0 : -1);
  }
}
function AnalyseCreditComponent_Conditional_21_Conditional_41_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, AnalyseCreditComponent_Conditional_21_Conditional_41_For_9_Conditional_0_Template, 1, 1);
  }
  if (rf & 2) {
    let tmp_12_0;
    const credit_r5 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional((tmp_12_0 = ctx_r0.getPlanPagosByCredit(credit_r5.numCredito)) ? 0 : -1, tmp_12_0);
  }
}
function AnalyseCreditComponent_Conditional_21_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2)(1, "div", 37)(2, "div", 38)(3, "h4", 39);
    \u0275\u0275element(4, "i", 64);
    \u0275\u0275text(5, " Plans de Paiement par Cr\xE9dit ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(6, "p-tag", 42);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p-accordion", 65);
    \u0275\u0275repeaterCreate(8, AnalyseCreditComponent_Conditional_21_Conditional_41_For_9_Template, 1, 1, null, null, _forTrack0);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(6);
    \u0275\u0275property("value", ctx_r0.state().histoCredits.planPagos.length + " \xE9ch\xE9ances au total");
    \u0275\u0275advance();
    \u0275\u0275property("multiple", true);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.state().histoCredits.creditos);
  }
}
function AnalyseCreditComponent_Conditional_21_Conditional_42_Conditional_6_For_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 106);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const factor_r7 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("\u2022 ", factor_r7, "");
  }
}
function AnalyseCreditComponent_Conditional_21_Conditional_42_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 101)(2, "div", 31)(3, "div", 102);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 103);
    \u0275\u0275text(6, "Niveau de risque");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(7, "div", 101)(8, "div", 31)(9, "div", 104);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 103);
    \u0275\u0275text(12, "Score de confiance");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "div", 101)(14, "div")(15, "div", 105);
    \u0275\u0275text(16, "Facteurs d'\xE9valuation :");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(17, AnalyseCreditComponent_Conditional_21_Conditional_42_Conditional_6_For_18_Template, 2, 1, "div", 106, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const risk_r8 = ctx;
    \u0275\u0275advance(3);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction4(3, _c3, risk_r8.level === "FAIBLE", risk_r8.level === "MODERE", risk_r8.level === "ELEVE", risk_r8.level === "TRES_ELEVE"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", risk_r8.level, " ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", risk_r8.score, "%");
    \u0275\u0275advance(7);
    \u0275\u0275repeater(risk_r8.factors);
  }
}
function AnalyseCreditComponent_Conditional_21_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2)(1, "div", 97)(2, "div", 98);
    \u0275\u0275element(3, "i", 99);
    \u0275\u0275elementStart(4, "h4", 100);
    \u0275\u0275text(5, "\xC9valuation de Risque");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(6, AnalyseCreditComponent_Conditional_21_Conditional_42_Conditional_6_Template, 19, 8, "div", 1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(6);
    \u0275\u0275conditional((tmp_2_0 = ctx_r0.getRiskAssessment()) ? 6 : -1, tmp_2_0);
  }
}
function AnalyseCreditComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2)(1, "div", 20)(2, "div", 21)(3, "div")(4, "div", 22);
    \u0275\u0275element(5, "i", 23);
    \u0275\u0275elementStart(6, "h4", 24);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "p", 25);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 26)(11, "div", 27);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 28);
    \u0275\u0275text(14, "Cr\xE9dit(s) trouv\xE9(s)");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(15, "div", 29)(16, "div", 30)(17, "div", 31)(18, "div", 32);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "div", 33);
    \u0275\u0275text(21, "Total cr\xE9dits");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "div", 30)(23, "div", 31)(24, "div", 34);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "div", 33);
    \u0275\u0275text(27, "Total pay\xE9");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(28, "div", 30)(29, "div", 31)(30, "div", 35);
    \u0275\u0275text(31);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "div", 33);
    \u0275\u0275text(33, "Solde restant");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(34, "div", 30)(35, "div", 31)(36, "div", 36);
    \u0275\u0275text(37);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "div", 33);
    \u0275\u0275text(39, "Cr\xE9dits actifs");
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275template(40, AnalyseCreditComponent_Conditional_21_Conditional_40_Template, 15, 8, "div", 2)(41, AnalyseCreditComponent_Conditional_21_Conditional_41_Template, 10, 2, "div", 2)(42, AnalyseCreditComponent_Conditional_21_Conditional_42_Template, 7, 1, "div", 2);
  }
  if (rf & 2) {
    let tmp_10_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1("Client: ", ctx_r0.state().histoCredits.codCliente, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.state().histoCredits.mensaje);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.state().histoCredits.creditos.length || 0, " ");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1("", ctx_r0.formatCurrency(ctx_r0.getTotalCreditsAmount()), " ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", ctx_r0.formatCurrency(ctx_r0.getTotalPaidAmount()), " ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r0.formatCurrency(ctx_r0.getTotalRemainingAmount()));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r0.getActiveCreditsCount());
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r0.state().histoCredits.creditos && ctx_r0.state().histoCredits.creditos.length > 0 ? 40 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.state().histoCredits.planPagos && ctx_r0.state().histoCredits.planPagos.length > 0 ? 41 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.state().histoCredits && ((tmp_10_0 = ctx_r0.state().histoCredits) == null ? null : tmp_10_0.creditos) && ((tmp_10_0 = ctx_r0.state().histoCredits) == null ? null : tmp_10_0.creditos == null ? null : tmp_10_0.creditos.length) > 0 ? 42 : -1);
  }
}
function AnalyseCreditComponent_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2)(1, "div", 107);
    \u0275\u0275element(2, "i", 108);
    \u0275\u0275elementStart(3, "h3", 109);
    \u0275\u0275text(4, "Recherche d'Historique de Cr\xE9dit");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 110);
    \u0275\u0275text(6, " Saisissez un num\xE9ro de membre pour consulter l'historique de ses cr\xE9dits ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 111)(8, "h6", 112);
    \u0275\u0275text(9, "\u{1F4A1} Conseils de recherche :");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "ul", 113)(11, "li", 114);
    \u0275\u0275text(12, "\u2022 Utilisez le num\xE9ro complet du membre");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "li", 114);
    \u0275\u0275text(14, "\u2022 Exemple : 95100009222");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "li");
    \u0275\u0275text(16, "\u2022 V\xE9rifiez la saisie en cas d'erreur");
    \u0275\u0275elementEnd()()()()();
  }
}
var AnalyseCreditComponent = class _AnalyseCreditComponent {
  state = signal({
    histoCredits: null,
    demandeAnalyseCredits: [],
    loading: false,
    message: void 0,
    error: void 0,
    searching: false
  });
  // Search query binding
  searchQuery = "";
  // Injected services
  destroyRef = inject(DestroyRef);
  userService = inject(UserService);
  router = inject(Router);
  activatedRouter = inject(ActivatedRoute);
  ngOnInit() {
  }
  searchCredits() {
    if (!this.searchQuery || this.searchQuery.trim() === "") {
      this.state.update((state) => __spreadProps(__spreadValues({}, state), {
        message: "Veuillez saisir un num\xE9ro de membre",
        histoCredits: null
      }));
      return;
    }
    this.state.update((state) => __spreadProps(__spreadValues({}, state), {
      searching: true,
      message: void 0,
      error: void 0,
      histoCredits: null
    }));
    this.userService.getAllCreditos$(this.searchQuery).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        console.log("API Response:", response);
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          histoCredits: response.data?.histoCredits || null,
          searching: false,
          message: response.data?.histoCredits?.mensaje || response.message,
          error: void 0
        }));
      },
      error: (error) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          histoCredits: null,
          searching: false,
          message: void 0,
          error: error.message || "Erreur lors de la recherche"
        }));
      }
    });
  }
  // UTILITY METHODS FOR DISPLAY
  getStatusSeverity(status) {
    switch (status) {
      case "C":
        return "success";
      // Cancelled/Completed
      case "A":
        return "info";
      // Active
      case "I":
        return "warn";
      // Inactive
      case "V":
        return "danger";
      // Vencido (Expired)
      case "R":
        return "secondary";
      // Rejected/Refused
      case "P":
        return "secondary";
      // Pending
      default:
        return "secondary";
    }
  }
  getStatusLabel(status) {
    switch (status) {
      case "C":
        return "Sold\xE9";
      case "A":
        return "Actif";
      case "I":
        return "Inactif";
      case "V":
        return "\xC9chu";
      case "R":
        return "Rejet\xE9";
      case "P":
        return "En attente";
      default:
        return status;
    }
  }
  getCreditTypeLabel(tipCredito) {
    const types = {
      1: "CREDIT RURAL SOLIDAIRE",
      2: "CREDIT AGRICOLE SOLIDAIRE ORDINAIRE",
      3: "CREDIT COMMERCIALE SOLIDAIRE",
      4: "ASSOCIATION DE CAUTION MUTUELLE",
      5: "CREDIT STOCKAGE ET EMBOUCHE",
      6: "CREDIT MOYEN TERME",
      7: "CREDIT FONCTIONNAIRES EPARGNANTS",
      8: "CREDIT DEPANNAGE FONCTIONNAIRES ET RETRAITES",
      9: "CREDIT MOURABAHA",
      10: "CREDIT AGRICOLE SOLIDAIRE RENTE",
      11: "CREDIT COMMERCIAL PECHE",
      12: "CREDIT OIM",
      13: "CREDIT ELUS",
      14: "CREDIT ANAMIF",
      15: "CREDITS CT PERSONNEL CDS",
      16: "CREDITS CT PERSONNEL PRETS SOCIAUX",
      17: "CREDITS CT PERSONNEL PRETS VEHICULE",
      18: "CREDITS MT PERSONNEL CDS",
      19: "CREDITS MT PERSONNEL PRETS SOCIAUX",
      20: "CREDITS MT PERSONNEL PRETS VEHICULE",
      21: "CREDITS LT PERSONNE CDS",
      22: "CREDITS LT PERSONNEL PRETS SOCIAUX",
      23: "CREDITS LT PERSONNEL PRETS VEHICULE",
      24: "CREDIT WARRANTAGE",
      25: "CREDIT TONTINE",
      26: "CREDIT MOTEUR HORS BORD",
      27: "CREDIT PROJET VILLAGE DURABLE GUINEE",
      28: "CREDIT AVANCE SALAIRE FONCTIONAIRES VIRES",
      29: "CREDIT PR\xCATS SCOLAIRES",
      30: "CREDIT PRETS EQUIPEMENTS",
      31: "CREDIT PR\xCATS INVESTISSEMENTS FONCTIONNAIRE",
      32: "CREDIT BOEUF PDABAD",
      33: "MICROCREDIT KIOSQUE",
      34: "CREDIT EXPLOITATION AGRICOLE",
      35: "CREDIT INTRANTS ET TRANSFORMATION PRODUITS AGRICOLES",
      36: "CREDIT EQUIPEMENT AGRICOLE",
      37: "CREDIT AGRICOLE PRODUCTION ANANAS",
      38: "CREDIT EXTENSION AGRICOLE",
      39: "CREDIT MOTO BAJAJ",
      40: "CREDIT PERFORM WORLD",
      41: "CREDIT EQUIPEMENT PERFORM WORLD",
      42: "CREDIT PRODUCTION AGRICOLE",
      43: "CREDIT TRANSFORMATION COMMERCIALISATION PRODUITS",
      44: "CREDIT EQUIPEMENT AGRICOLE ET DE TRANSFORMATION PRODUITS",
      45: "PASSEPORT BRIQUETERIE",
      46: "PASSEPORT PDV CIMENT",
      47: "PASSEPORT SALARIE",
      100: "CREDITS REGULARISE OPS"
    };
    return types[tipCredito] || `Type ${tipCredito}`;
  }
  formatCurrency(amount) {
    if (!amount)
      return "0 GNF";
    return new Intl.NumberFormat("fr-GN", {
      style: "currency",
      currency: "GNF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
  formatDate(dateString) {
    if (!dateString)
      return "-";
    return new Date(dateString).toLocaleDateString("fr-FR");
  }
  calculateProgress(credit) {
    if (!credit.monCredito || credit.monCredito === 0)
      return 0;
    return credit.monPagadoPrincipal / credit.monCredito * 100;
  }
  // NAVIGATION METHODS
  viewDetailCredit(numberCredit) {
    this.router.navigate([`dashboards/credit/detail/${numberCredit}`]);
  }
  viewDetailDemandeCredit(demandeId, userId) {
    console.log("Demande ID:", demandeId);
    console.log("User ID:", userId);
    this.router.navigate([`dashboards/credit/${userId}/resume-credit/${demandeId}`]);
  }
  newAnalyseCredit(userId) {
    this.router.navigate([`dashboards/credit/${userId}/new-step`]);
  }
  viewPlanPago(numCredito) {
    setTimeout(() => {
      const element = document.querySelector(`[data-credit-plan="${numCredito}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        const planSection = document.querySelector(".payment-plans-section");
        if (planSection) {
          planSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }, 100);
  }
  clearSearch() {
    this.searchQuery = "";
    this.state.update((state) => __spreadProps(__spreadValues({}, state), {
      histoCredits: null,
      message: void 0,
      error: void 0
    }));
  }
  // ADDITIONAL UTILITY METHODS
  getTotalCreditsAmount() {
    const credits = this.state().histoCredits?.creditos || [];
    return credits.reduce((sum, credit) => sum + credit.monCredito, 0);
  }
  getTotalPaidAmount() {
    const credits = this.state().histoCredits?.creditos || [];
    return credits.reduce((sum, credit) => sum + credit.monPagadoPrincipal, 0);
  }
  getTotalRemainingAmount() {
    const credits = this.state().histoCredits?.creditos || [];
    return credits.reduce((sum, credit) => sum + credit.monSaldo, 0);
  }
  getActiveCreditsCount() {
    const credits = this.state().histoCredits?.creditos || [];
    return credits.filter((credit) => credit.indEstado === "A").length;
  }
  getCompletedCreditsCount() {
    const credits = this.state().histoCredits?.creditos || [];
    return credits.filter((credit) => credit.indEstado === "C").length;
  }
  // UPDATED RISK ASSESSMENT - Now uses data from API
  getRiskAssessment() {
    const evaluationRisque = this.state().histoCredits?.evaluationRisque;
    if (!evaluationRisque) {
      return null;
    }
    let displayLevel = evaluationRisque.niveauRisque;
    const factors = [];
    factors.push(evaluationRisque.historiqueRemboursement);
    if (evaluationRisque.echeancesAnalysees > 0) {
      const respectRate = evaluationRisque.echeancesRespectees / evaluationRisque.echeancesAnalysees * 100;
      if (respectRate < 50) {
        factors.push(`Seulement ${respectRate.toFixed(0)}% des \xE9ch\xE9ances respect\xE9es`);
      }
    }
    if (evaluationRisque.creditsAnalyses > 0) {
      factors.push(`Analyse bas\xE9e sur ${evaluationRisque.creditsAnalyses} cr\xE9dit(s)`);
    }
    return {
      level: displayLevel,
      score: evaluationRisque.scoreConfiance,
      factors
    };
  }
  // Get risk level color class
  getRiskLevelColorClass(level) {
    switch (level) {
      case "TR\xC8S FAIBLE":
        return "text-green-600";
      case "FAIBLE":
        return "text-blue-600";
      case "MOD\xC9R\xC9":
        return "text-orange-600";
      case "\xC9LEV\xC9":
        return "text-orange-600";
      case "TR\xC8S \xC9LEV\xC9":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  }
  // EXPORT FUNCTIONALITY
  exportCreditHistory() {
    const histoCredits = this.state().histoCredits;
    if (!histoCredits)
      return;
    const exportData = {
      client: histoCredits.codCliente,
      credits: histoCredits.creditos,
      planPagos: histoCredits.planPagos,
      resumenes: histoCredits.resumenes,
      evaluationRisque: histoCredits.evaluationRisque,
      exportDate: (/* @__PURE__ */ new Date()).toISOString()
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(dataBlob);
    link.download = `historique_credit_${histoCredits.codCliente}_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
  getPlanPagosByCredit(numCredito) {
    const planPagos = this.state().histoCredits?.planPagos || [];
    return planPagos.filter((plan) => plan.numCredito === numCredito && plan.numCuota !== 0);
  }
  // 2. Nouvelle méthode pour obtenir TOUS les plans incluant l'ouverture (pour l'affichage dans la table)
  getAllPlanPagosByCredit(numCredito) {
    const planPagos = this.state().histoCredits?.planPagos || [];
    return planPagos.filter((plan) => plan.numCredito === numCredito);
  }
  getPaidInstallments(planPagos) {
    return planPagos.filter((plan) => plan.indEstado === "C" && plan.numCuota !== 0).length;
  }
  getRemainingInstallments(planPagos) {
    return planPagos.filter((plan) => (plan.indEstado === "A" || plan.indEstado === "P") && plan.numCuota !== 0).length;
  }
  getCreditStatistics(numCredito) {
    const allPlanPagos = this.state().histoCredits?.planPagos || [];
    const planPagos = allPlanPagos.filter((plan) => plan.numCredito === numCredito && plan.numCuota !== 0);
    const credit = this.state().histoCredits?.creditos?.find((c) => c.numCredito === numCredito);
    return {
      totalEcheances: planPagos.length,
      echeancesPagees: planPagos.filter((plan) => plan.indEstado === "C").length,
      echeancesRestantes: planPagos.filter((plan) => plan.indEstado === "A" || plan.indEstado === "P").length,
      montantTotal: credit?.monCredito || 0,
      montantPaye: credit?.monPagadoPrincipal || 0,
      soldeRestant: credit?.monSaldo || 0
    };
  }
  hasOverdueInstallments(numCredito) {
    const allPlanPagos = this.state().histoCredits?.planPagos || [];
    const planPagos = allPlanPagos.filter((plan) => plan.numCredito === numCredito && plan.numCuota !== 0);
    const today = /* @__PURE__ */ new Date();
    return planPagos.some((plan) => {
      if (plan.indEstado === "C")
        return false;
      const dueDate = new Date(plan.fecCuota);
      return dueDate < today;
    });
  }
  getNextInstallment(numCredito) {
    const allPlanPagos = this.state().histoCredits?.planPagos || [];
    const planPagos = allPlanPagos.filter((plan) => plan.numCredito === numCredito && plan.numCuota !== 0);
    const today = /* @__PURE__ */ new Date();
    const futureInstallments = planPagos.filter((plan) => plan.indEstado === "A" && new Date(plan.fecCuota) >= today).sort((a, b) => new Date(a.fecCuota).getTime() - new Date(b.fecCuota).getTime());
    return futureInstallments.length > 0 ? futureInstallments[0] : null;
  }
  getTotalInterestForCredit(numCredito) {
    const allPlanPagos = this.state().histoCredits?.planPagos || [];
    const planPagos = allPlanPagos.filter((plan) => plan.numCredito === numCredito && plan.numCuota !== 0);
    return planPagos.reduce((total, plan) => total + (plan.monInt || 0), 0);
  }
  getTotalEcheancesWithoutOpening() {
    const planPagos = this.state().histoCredits?.planPagos || [];
    return planPagos.filter((plan) => plan.numCuota !== 0).length;
  }
  printCreditHistory() {
    window.print();
  }
  static \u0275fac = function AnalyseCreditComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AnalyseCreditComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AnalyseCreditComponent, selectors: [["app-analyse-credit"]], decls: 23, vars: 7, consts: [[1, "credit-history-component"], [1, "grid"], [1, "col-12"], [1, "search-section"], [1, "flex", "align-items-center", "mb-4"], [1, "pi", "pi-search", "text-white", "text-xl", "mr-2"], [1, "m-0", "search-title"], [1, "p-fluid"], [1, "col-12", "md:col-8"], ["iconPosition", "left"], ["styleClass", "pi pi-search"], ["type", "text", "pInputText", "", "name", "search", "placeholder", "Saisir le num\xE9ro de membre (ex: 95100009222)", 1, "w-full", 3, "ngModelChange", "keyup.enter", "ngModel"], [1, "col-12", "md:col-2"], ["label", "Rechercher", "icon", "pi pi-search", "styleClass", "w-full", 3, "onClick", "loading"], ["label", "Effacer", "icon", "pi pi-times", "styleClass", "w-full", "severity", "secondary", "outlined", "", 3, "onClick"], [1, "loading-container", "text-center"], ["strokeWidth", "3"], [1, "mt-3", "text-600"], ["severity", "info", 3, "text"], ["severity", "error", 3, "text"], [1, "card", "bg-green-50", "border-left-3", "border-green-500", "mb-4", "fade-in-up"], [1, "flex", "align-items-center", "justify-content-between"], [1, "flex", "align-items-center", "mb-2"], [1, "pi", "pi-user", "text-green-600", "text-xl", "mr-2"], [1, "m-0", "text-green-800"], [1, "text-600", "m-0"], [1, "text-right"], [1, "text-900", "font-bold", "text-3xl", "gradient-text"], [1, "text-600", "text-sm"], [1, "grid", "mt-4"], [1, "col-6", "md:col-3"], [1, "text-center"], [1, "text-green-600", "font-bold", "text-xl"], [1, "text-500", "text-sm"], [1, "text-blue-600", "font-bold", "text-xl"], [1, "text-orange-600", "font-bold", "text-xl"], [1, "text-purple-600", "font-bold", "text-xl"], [1, "card", "shadow-medium"], [1, "flex", "align-items-center", "justify-content-between", "mb-4"], [1, "m-0", "text-900"], [1, "pi", "pi-list", "mr-2", "text-blue-600"], [1, "flex", "gap-2"], ["severity", "info", 3, "value"], ["icon", "pi pi-download", "size", "small", "outlined", "", "pTooltip", "Exporter", 3, "onClick"], ["icon", "pi pi-print", "size", "small", "outlined", "", "pTooltip", "Imprimer", 3, "onClick"], [1, "custom-table"], ["styleClass", "p-datatable-sm", "scrollHeight", "600px", 3, "value", "tableStyle", "paginator", "rows", "responsive", "scrollable"], ["pTemplate", "header"], ["pTemplate", "body"], ["pTemplate", "emptymessage"], [2, "width", "100px"], [2, "width", "120px"], [2, "width", "80px"], [2, "width", "130px"], [2, "width", "110px"], [1, "font-bold", "text-blue-600"], ["severity", "secondary", 1, "text-xs", 3, "value"], [1, "font-medium"], [1, "text-900", "font-semibold"], [3, "ngClass"], [1, "text-sm"], [3, "value", "severity"], ["colspan", "11", 1, "text-center", "p-4"], [1, "pi", "pi-info-circle", "text-blue-500", "text-2xl", "mb-2"], [1, "pi", "pi-calendar", "text-blue-600", "mr-2"], [3, "multiple"], [1, "mb-4", "p-3", "bg-gray-50", "border-round"], [1, "text-green-600", "font-bold"], [1, "text-blue-600", "font-bold"], [1, "text-purple-600", "font-bold"], [1, "text-orange-600", "font-bold"], [1, "mt-3"], [1, "flex", "align-items-center", "justify-content-between", "mb-2"], [1, "text-600", "text-sm", "font-medium"], [1, "text-900", "text-sm", "font-semibold"], [3, "value"], ["styleClass", "p-datatable-sm", "scrollHeight", "400px", 3, "value", "tableStyle", "paginator", "rows", "scrollable"], [1, "mt-3", "p-3", "bg-blue-50", "border-round"], [1, "text-sm", "text-600"], [1, "font-bold", "text-green-600"], [1, "font-bold", "text-orange-600"], [1, "font-bold", "text-purple-600"], [1, "flex", "align-items-center", "justify-content-between", "w-full"], [1, "flex", "align-items-center"], [1, "pi", "pi-credit-card", "text-blue-600", "mr-3"], [1, "font-bold", "text-lg"], [1, "flex", "align-items-center", "gap-2"], ["severity", "info", 1, "mr-2", 3, "value"], [1, "font-semibold", 3, "ngClass"], [1, "text-sm", 3, "ngClass"], [1, "font-semibold"], [1, "text-blue-600", "font-medium"], [1, "text-purple-600", "font-medium"], [1, "font-medium", 3, "ngClass"], [1, "text-xs", 3, "value", "severity"], ["colspan", "9", 1, "text-center", "p-4"], [1, "pi", "pi-info-circle", "text-blue-500", "text-xl", "mb-2"], [1, "card", "border-left-3", "border-purple-500"], [1, "flex", "align-items-center", "mb-3"], [1, "pi", "pi-shield", "text-purple-600", "text-xl", "mr-2"], [1, "m-0", "text-purple-800"], [1, "col-12", "md:col-4"], [1, "text-2xl", "font-bold", "mb-2", 3, "ngClass"], [1, "text-600"], [1, "text-2xl", "font-bold", "mb-2", "text-900"], [1, "text-600", "text-sm", "font-semibold", "mb-2"], [1, "text-700", "text-sm", "mb-1"], [1, "empty-state"], [1, "pi", "pi-search", "empty-icon"], [1, "empty-title"], [1, "empty-description"], [1, "glass-effect", "border-round", "p-3", "text-left", "max-w-md", "mx-auto"], [1, "text-blue-800", "mb-2"], [1, "text-blue-700", "text-sm", "list-none", "p-0", "m-0"], [1, "mb-1"]], template: function AnalyseCreditComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4);
      \u0275\u0275element(5, "i", 5);
      \u0275\u0275elementStart(6, "h4", 6);
      \u0275\u0275text(7, "Recherche d'Historique de Cr\xE9dit");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "form", 7)(9, "div", 1)(10, "div", 8)(11, "p-iconField", 9);
      \u0275\u0275element(12, "p-inputIcon", 10);
      \u0275\u0275elementStart(13, "input", 11);
      \u0275\u0275twoWayListener("ngModelChange", function AnalyseCreditComponent_Template_input_ngModelChange_13_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.searchQuery, $event) || (ctx.searchQuery = $event);
        return $event;
      });
      \u0275\u0275listener("keyup.enter", function AnalyseCreditComponent_Template_input_keyup_enter_13_listener() {
        return ctx.searchCredits();
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(14, "div", 12)(15, "p-button", 13);
      \u0275\u0275listener("onClick", function AnalyseCreditComponent_Template_p_button_onClick_15_listener() {
        return ctx.searchCredits();
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(16, "div", 12)(17, "p-button", 14);
      \u0275\u0275listener("onClick", function AnalyseCreditComponent_Template_p_button_onClick_17_listener() {
        return ctx.clearSearch();
      });
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275template(18, AnalyseCreditComponent_Conditional_18_Template, 5, 0, "div", 2)(19, AnalyseCreditComponent_Conditional_19_Template, 2, 1, "div", 2)(20, AnalyseCreditComponent_Conditional_20_Template, 2, 1, "div", 2)(21, AnalyseCreditComponent_Conditional_21_Template, 43, 10)(22, AnalyseCreditComponent_Conditional_22_Template, 17, 0, "div", 2);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(13);
      \u0275\u0275twoWayProperty("ngModel", ctx.searchQuery);
      \u0275\u0275advance(2);
      \u0275\u0275property("loading", ctx.state().searching);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.state().searching ? 18 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.state().message && !ctx.state().searching ? 19 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.state().error && !ctx.state().searching ? 20 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.state().histoCredits && !ctx.state().searching ? 21 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.state().histoCredits && !ctx.state().searching && !ctx.state().message && !ctx.state().error ? 22 : -1);
    }
  }, dependencies: [CommonModule, NgClass, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, NgModel, NgForm, TableModule, Table, PrimeTemplate, CardModule, ButtonModule, Button, TagModule, Tag, ProgressBarModule, ProgressBar, AccordionModule, Accordion, AccordionTab, MessageModule, Message, ProgressSpinnerModule, ProgressSpinner, TooltipModule, Tooltip, DividerModule, InputTextModule, InputText, IconFieldModule, IconField, InputIconModule, InputIcon], styles: ['\n\n.credit-history-component[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  border-radius: 12px;\n  padding: 2rem;\n  color: white;\n  margin-bottom: 2rem;\n  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);\n}\n.credit-history-component[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%]   .search-title[_ngcontent-%COMP%] {\n  color: white;\n  font-weight: 600;\n  margin-bottom: 1rem;\n}\n.credit-history-component[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-inputtext) {\n  border-radius: 8px;\n  border: 1px solid rgba(255, 255, 255, 0.3);\n  background: rgba(255, 255, 255, 0.1);\n  color: white;\n  -webkit-backdrop-filter: blur(10px);\n  backdrop-filter: blur(10px);\n}\n.credit-history-component[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-inputtext)::placeholder {\n  color: rgba(255, 255, 255, 0.7);\n}\n.credit-history-component[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-inputtext):focus {\n  border-color: rgba(255, 255, 255, 0.6);\n  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3);\n}\n.credit-history-component[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-button) {\n  border-radius: 8px;\n}\n.credit-history-component[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-button).p-button-outlined {\n  border-color: rgba(255, 255, 255, 0.6);\n  color: white;\n}\n.credit-history-component[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-button).p-button-outlined:hover {\n  background: rgba(255, 255, 255, 0.1);\n  border-color: white;\n}\n.credit-history-component[_ngcontent-%COMP%]   .credit-card[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 12px;\n  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);\n  border: 1px solid #e2e8f0;\n  transition: all 0.3s ease;\n  overflow: hidden;\n  height: 100%;\n}\n.credit-history-component[_ngcontent-%COMP%]   .credit-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);\n}\n.credit-history-component[_ngcontent-%COMP%]   .credit-card[_ngcontent-%COMP%]   .credit-header[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #4f46e5 0%,\n      #7c3aed 100%);\n  color: white;\n  padding: 1.5rem;\n  position: relative;\n}\n.credit-history-component[_ngcontent-%COMP%]   .credit-card[_ngcontent-%COMP%]   .credit-header[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  height: 4px;\n  background:\n    linear-gradient(\n      90deg,\n      #06b6d4,\n      #3b82f6,\n      #8b5cf6);\n}\n.credit-history-component[_ngcontent-%COMP%]   .credit-card[_ngcontent-%COMP%]   .credit-body[_ngcontent-%COMP%] {\n  padding: 1.5rem;\n}\n.credit-history-component[_ngcontent-%COMP%]   .credit-card[_ngcontent-%COMP%]   .credit-number[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: white;\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n}\n.credit-history-component[_ngcontent-%COMP%]   .credit-card[_ngcontent-%COMP%]   .credit-amount[_ngcontent-%COMP%] {\n  font-size: 1.8rem;\n  font-weight: 800;\n  background:\n    linear-gradient(\n      135deg,\n      #059669,\n      #10b981);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  background-clip: text;\n}\n.credit-history-component[_ngcontent-%COMP%]   .summary-card[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 12px;\n  padding: 1.5rem;\n  border-left: 4px solid;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n  transition: all 0.3s ease;\n  height: 100%;\n}\n.credit-history-component[_ngcontent-%COMP%]   .summary-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n}\n.credit-history-component[_ngcontent-%COMP%]   .summary-card.success-card[_ngcontent-%COMP%] {\n  border-left-color: #10b981;\n  background:\n    linear-gradient(\n      135deg,\n      #ecfdf5 0%,\n      #d1fae5 100%);\n}\n.credit-history-component[_ngcontent-%COMP%]   .summary-card.warning-card[_ngcontent-%COMP%] {\n  border-left-color: #f59e0b;\n  background:\n    linear-gradient(\n      135deg,\n      #fffbeb 0%,\n      #fef3c7 100%);\n}\n.credit-history-component[_ngcontent-%COMP%]   .summary-card.info-card[_ngcontent-%COMP%] {\n  border-left-color: #3b82f6;\n  background:\n    linear-gradient(\n      135deg,\n      #eff6ff 0%,\n      #dbeafe 100%);\n}\n.credit-history-component[_ngcontent-%COMP%]   .summary-card.danger-card[_ngcontent-%COMP%] {\n  border-left-color: #ef4444;\n  background:\n    linear-gradient(\n      135deg,\n      #fef2f2 0%,\n      #fecaca 100%);\n}\n.credit-history-component[_ngcontent-%COMP%]   .summary-card[_ngcontent-%COMP%]   .summary-icon[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 1.5rem;\n  margin-bottom: 1rem;\n}\n.credit-history-component[_ngcontent-%COMP%]   .summary-card[_ngcontent-%COMP%]   .summary-value[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  font-weight: 700;\n  line-height: 1;\n  margin-bottom: 0.5rem;\n}\n.credit-history-component[_ngcontent-%COMP%]   .summary-card[_ngcontent-%COMP%]   .summary-label[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  color: #6b7280;\n  font-weight: 500;\n}\n.credit-history-component[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-tag).status-active {\n  background:\n    linear-gradient(\n      135deg,\n      #10b981,\n      #059669);\n  color: white;\n}\n.credit-history-component[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-tag).status-completed {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6,\n      #1d4ed8);\n  color: white;\n}\n.credit-history-component[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-tag).status-overdue {\n  background:\n    linear-gradient(\n      135deg,\n      #ef4444,\n      #dc2626);\n  color: white;\n}\n.credit-history-component[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-tag).status-pending {\n  background:\n    linear-gradient(\n      135deg,\n      #f59e0b,\n      #d97706);\n  color: white;\n}\n.credit-history-component[_ngcontent-%COMP%]   .custom-progress[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-progressbar) {\n  height: 8px;\n  border-radius: 8px;\n  background: #e5e7eb;\n  overflow: hidden;\n}\n.credit-history-component[_ngcontent-%COMP%]   .custom-progress[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-progressbar-value) {\n  background:\n    linear-gradient(\n      90deg,\n      #10b981 0%,\n      #059669 100%);\n  border-radius: 8px;\n  transition: all 0.3s ease;\n}\n.credit-history-component[_ngcontent-%COMP%]   .custom-progress.progress-warning[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-progressbar-value) {\n  background:\n    linear-gradient(\n      90deg,\n      #f59e0b 0%,\n      #d97706 100%);\n}\n.credit-history-component[_ngcontent-%COMP%]   .custom-progress.progress-danger[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-progressbar-value) {\n  background:\n    linear-gradient(\n      90deg,\n      #ef4444 0%,\n      #dc2626 100%);\n}\n.credit-history-component[_ngcontent-%COMP%]   .custom-table[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-datatable) {\n  border-radius: 12px;\n  overflow: hidden;\n  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);\n}\n.credit-history-component[_ngcontent-%COMP%]   .custom-table[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-datatable-header) {\n  background:\n    linear-gradient(\n      135deg,\n      #f8fafc 0%,\n      #e2e8f0 100%);\n  border-bottom: 2px solid #e2e8f0;\n  padding: 1rem;\n}\n.credit-history-component[_ngcontent-%COMP%]   .custom-table[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-datatable-thead > tr > th) {\n  background:\n    linear-gradient(\n      135deg,\n      #1e293b 0%,\n      #334155 100%);\n  color: white;\n  font-weight: 600;\n  padding: 1rem;\n  border: none;\n  font-size: 0.875rem;\n}\n.credit-history-component[_ngcontent-%COMP%]   .custom-table[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-datatable-tbody > tr) {\n  transition: all 0.2s ease;\n}\n.credit-history-component[_ngcontent-%COMP%]   .custom-table[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-datatable-tbody > tr):hover {\n  background:\n    linear-gradient(\n      135deg,\n      #f8fafc 0%,\n      #f1f5f9 100%);\n  transform: scale(1.005);\n}\n.credit-history-component[_ngcontent-%COMP%]   .custom-table[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-datatable-tbody > tr)    > td[_ngcontent-%COMP%] {\n  padding: 1rem;\n  border-bottom: 1px solid #e2e8f0;\n  vertical-align: middle;\n}\n.credit-history-component[_ngcontent-%COMP%]   .custom-table[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-paginator) {\n  background: #f8fafc;\n  border-top: 1px solid #e2e8f0;\n  padding: 1rem;\n}\n.credit-history-component[_ngcontent-%COMP%]   .loading-container[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #f8fafc 0%,\n      #e2e8f0 100%);\n  border-radius: 12px;\n  padding: 3rem;\n}\n.credit-history-component[_ngcontent-%COMP%]   .loading-container[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-progress-spinner) {\n  width: 60px;\n  height: 60px;\n}\n.credit-history-component[_ngcontent-%COMP%]   .empty-state[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #f8fafc 0%,\n      #e2e8f0 100%);\n  border-radius: 12px;\n  padding: 3rem;\n  text-align: center;\n}\n.credit-history-component[_ngcontent-%COMP%]   .empty-state[_ngcontent-%COMP%]   .empty-icon[_ngcontent-%COMP%] {\n  font-size: 4rem;\n  color: #9ca3af;\n  margin-bottom: 1rem;\n}\n.credit-history-component[_ngcontent-%COMP%]   .empty-state[_ngcontent-%COMP%]   .empty-title[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 600;\n  color: #374151;\n  margin-bottom: 0.5rem;\n}\n.credit-history-component[_ngcontent-%COMP%]   .empty-state[_ngcontent-%COMP%]   .empty-description[_ngcontent-%COMP%] {\n  color: #6b7280;\n  margin-bottom: 2rem;\n}\n.credit-history-component[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-accordion)   .p-accordion-header[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #f8fafc 0%,\n      #e2e8f0 100%);\n  border: 1px solid #e2e8f0;\n  border-radius: 8px;\n  padding: 1rem;\n}\n.credit-history-component[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-accordion)   .p-accordion-header[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #e2e8f0 0%,\n      #cbd5e1 100%);\n}\n.credit-history-component[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-accordion)   .p-accordion-content[_ngcontent-%COMP%] {\n  border: 1px solid #e2e8f0;\n  border-top: none;\n  padding: 0;\n}\n.credit-history-component[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-message) {\n  border-radius: 8px;\n  margin-bottom: 1rem;\n}\n.credit-history-component[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-message).p-message-info {\n  background:\n    linear-gradient(\n      135deg,\n      #dbeafe 0%,\n      #bfdbfe 100%);\n  border-left: 4px solid #3b82f6;\n}\n.credit-history-component[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-message).p-message-error {\n  background:\n    linear-gradient(\n      135deg,\n      #fecaca 0%,\n      #fca5a5 100%);\n  border-left: 4px solid #ef4444;\n}\n.credit-history-component[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-button) {\n  border-radius: 8px;\n  transition: all 0.3s ease;\n}\n.credit-history-component[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-button):hover {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n}\n.credit-history-component[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-button).p-button-rounded {\n  width: 32px;\n  height: 32px;\n}\n.credit-history-component[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-button).p-button-rounded.p-button-sm {\n  width: 28px;\n  height: 28px;\n}\n.credit-history-component[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-card) {\n  border-radius: 12px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n  border: 1px solid #e2e8f0;\n}\n.credit-history-component[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-card)   .p-card-body[_ngcontent-%COMP%] {\n  padding: 1.5rem;\n}\n.credit-history-component[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-card)   .p-card-content[_ngcontent-%COMP%] {\n  padding: 0;\n}\n.gradient-text[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  background-clip: text;\n}\n.glass-effect[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.25);\n  -webkit-backdrop-filter: blur(10px);\n  backdrop-filter: blur(10px);\n  border: 1px solid rgba(255, 255, 255, 0.18);\n}\n.shadow-soft[_ngcontent-%COMP%] {\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n}\n.shadow-medium[_ngcontent-%COMP%] {\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n}\n.shadow-strong[_ngcontent-%COMP%] {\n  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);\n}\n@keyframes _ngcontent-%COMP%_fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes _ngcontent-%COMP%_fadeInLeft {\n  from {\n    opacity: 0;\n    transform: translateX(-20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n@keyframes _ngcontent-%COMP%_pulse {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.5;\n  }\n}\n.fade-in-up[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_fadeInUp 0.6s ease-out;\n}\n.fade-in-left[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_fadeInLeft 0.6s ease-out;\n}\n.pulse[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_pulse 2s infinite;\n}\n@media (max-width: 1200px) {\n  .credit-history-component[_ngcontent-%COMP%]   .custom-table[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-datatable-thead > tr > th), \n   .credit-history-component[_ngcontent-%COMP%]   .custom-table[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-datatable-tbody > tr > td) {\n    padding: 0.75rem 0.5rem;\n    font-size: 0.825rem;\n  }\n}\n@media (max-width: 768px) {\n  .credit-history-component[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%] {\n    padding: 1.5rem;\n    margin-bottom: 1rem;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .credit-card[_ngcontent-%COMP%] {\n    margin-bottom: 1rem;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .credit-card[_ngcontent-%COMP%]   .credit-header[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .credit-card[_ngcontent-%COMP%]   .credit-body[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .credit-card[_ngcontent-%COMP%]   .credit-number[_ngcontent-%COMP%] {\n    font-size: 1.25rem;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .credit-card[_ngcontent-%COMP%]   .credit-amount[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .summary-card[_ngcontent-%COMP%] {\n    margin-bottom: 1rem;\n    padding: 1rem;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .summary-card[_ngcontent-%COMP%]   .summary-value[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .custom-table[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-datatable-thead > tr > th), \n   .credit-history-component[_ngcontent-%COMP%]   .custom-table[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-datatable-tbody > tr > td) {\n    padding: 0.5rem 0.25rem;\n    font-size: 0.75rem;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .custom-table[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-datatable) {\n    font-size: 0.875rem;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .empty-state[_ngcontent-%COMP%] {\n    padding: 2rem 1rem;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .empty-state[_ngcontent-%COMP%]   .empty-icon[_ngcontent-%COMP%] {\n    font-size: 3rem;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .empty-state[_ngcontent-%COMP%]   .empty-title[_ngcontent-%COMP%] {\n    font-size: 1.25rem;\n  }\n}\n@media (max-width: 576px) {\n  .credit-history-component[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%]   .search-title[_ngcontent-%COMP%] {\n    font-size: 1rem;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .custom-table[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-datatable) {\n    font-size: 0.75rem;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-button.p-button-rounded) {\n    width: 24px;\n    height: 24px;\n    font-size: 0.75rem;\n  }\n}\n@media print {\n  .credit-history-component[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%], \n   .credit-history-component[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-button), \n   .credit-history-component[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-paginator) {\n    display: none !important;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .credit-card[_ngcontent-%COMP%], \n   .credit-history-component[_ngcontent-%COMP%]   .summary-card[_ngcontent-%COMP%], \n   .credit-history-component[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-card) {\n    box-shadow: none;\n    border: 1px solid #e2e8f0;\n    break-inside: avoid;\n    page-break-inside: avoid;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .custom-table[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-datatable) {\n    box-shadow: none;\n    border: 1px solid #e2e8f0;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .custom-table[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-datatable-thead > tr > th) {\n    background: #f8fafc !important;\n    color: #1e293b !important;\n  }\n}\n@media (prefers-color-scheme: dark) {\n  .credit-history-component[_ngcontent-%COMP%]   .credit-card[_ngcontent-%COMP%], \n   .credit-history-component[_ngcontent-%COMP%]   .summary-card[_ngcontent-%COMP%], \n   .credit-history-component[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-card) {\n    background: #1f2937;\n    border-color: #374151;\n    color: #f9fafb;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .custom-table[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-datatable-tbody > tr:hover) {\n    background:\n      linear-gradient(\n        135deg,\n        #374151 0%,\n        #4b5563 100%);\n  }\n}\n.payment-plans-section[_ngcontent-%COMP%] {\n  scroll-margin-top: 20px;\n}\n.bg-green-50[_ngcontent-%COMP%] {\n  background-color: #f0f9ff;\n}\n.bg-orange-50[_ngcontent-%COMP%] {\n  background-color: #fff7ed;\n}\n.credit-history-component[_ngcontent-%COMP%] {\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-assessment-card[_ngcontent-%COMP%] {\n  transition: all 0.3s ease;\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-assessment-card.risk-very-low[_ngcontent-%COMP%] {\n  border-left-color: #10b981;\n  background:\n    linear-gradient(\n      135deg,\n      #f0fdf4 0%,\n      #dcfce7 100%);\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-assessment-card.risk-low[_ngcontent-%COMP%] {\n  border-left-color: #3b82f6;\n  background:\n    linear-gradient(\n      135deg,\n      #eff6ff 0%,\n      #dbeafe 100%);\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-assessment-card.risk-moderate[_ngcontent-%COMP%] {\n  border-left-color: #f59e0b;\n  background:\n    linear-gradient(\n      135deg,\n      #fffbeb 0%,\n      #fef3c7 100%);\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-assessment-card.risk-high[_ngcontent-%COMP%] {\n  border-left-color: #f97316;\n  background:\n    linear-gradient(\n      135deg,\n      #fff7ed 0%,\n      #fed7aa 100%);\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-assessment-card.risk-very-high[_ngcontent-%COMP%] {\n  border-left-color: #ef4444;\n  background:\n    linear-gradient(\n      135deg,\n      #fef2f2 0%,\n      #fecaca 100%);\n}\n.credit-history-component[_ngcontent-%COMP%]   .position-relative[_ngcontent-%COMP%] {\n  position: relative;\n}\n.credit-history-component[_ngcontent-%COMP%]   .position-absolute[_ngcontent-%COMP%] {\n  position: absolute;\n}\n.credit-history-component[_ngcontent-%COMP%]   .w-full[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.credit-history-component[_ngcontent-%COMP%]   .score-progress-container[_ngcontent-%COMP%] {\n  position: relative;\n}\n.credit-history-component[_ngcontent-%COMP%]   .score-progress-container[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-progressbar) {\n  height: 40px;\n  border-radius: 20px;\n  background: rgba(0, 0, 0, 0.1);\n  overflow: visible;\n}\n.credit-history-component[_ngcontent-%COMP%]   .score-progress-container[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-progressbar)   .p-progressbar-value[_ngcontent-%COMP%] {\n  border-radius: 20px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);\n}\n.credit-history-component[_ngcontent-%COMP%]   .score-progress-container[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-progressbar)   .p-progressbar-value[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.3) 0%,\n      rgba(255, 255, 255, 0) 100%);\n  border-radius: 20px;\n}\n.credit-history-component[_ngcontent-%COMP%]   .score-progress-container[_ngcontent-%COMP%]   .score-text[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  font-size: 1.25rem;\n  font-weight: 700;\n  color: white;\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n  z-index: 1;\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-factor-pill[_ngcontent-%COMP%] {\n  background: rgba(0, 0, 0, 0.05);\n  border-radius: 20px;\n  padding: 0.5rem 1rem;\n  font-size: 0.875rem;\n  margin-bottom: 0.5rem;\n  display: inline-block;\n  margin-right: 0.5rem;\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-factor-pill.factor-positive[_ngcontent-%COMP%] {\n  background: rgba(16, 185, 129, 0.1);\n  color: #059669;\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-factor-pill.factor-negative[_ngcontent-%COMP%] {\n  background: rgba(239, 68, 68, 0.1);\n  color: #dc2626;\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-factor-pill.factor-neutral[_ngcontent-%COMP%] {\n  background: rgba(107, 114, 128, 0.1);\n  color: #4b5563;\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-gauge[_ngcontent-%COMP%] {\n  width: 200px;\n  height: 100px;\n  margin: 0 auto;\n  position: relative;\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-gauge[_ngcontent-%COMP%]   .gauge-background[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  border-radius: 100px 100px 0 0;\n  background:\n    conic-gradient(\n      from 180deg at 50% 100%,\n      #10b981 0deg,\n      #3b82f6 72deg,\n      #f59e0b 144deg,\n      #f97316 216deg,\n      #ef4444 288deg,\n      #ef4444 360deg);\n  position: relative;\n  overflow: hidden;\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-gauge[_ngcontent-%COMP%]   .gauge-background[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  bottom: 0;\n  left: 10%;\n  right: 10%;\n  height: 80%;\n  background: white;\n  border-radius: 100px 100px 0 0;\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-gauge[_ngcontent-%COMP%]   .gauge-needle[_ngcontent-%COMP%] {\n  position: absolute;\n  bottom: 0;\n  left: 50%;\n  width: 4px;\n  height: 90px;\n  background: #1e293b;\n  transform-origin: bottom center;\n  transition: transform 0.5s ease;\n  border-radius: 2px 2px 0 0;\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-gauge[_ngcontent-%COMP%]   .gauge-needle[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  bottom: -10px;\n  left: 50%;\n  transform: translateX(-50%);\n  width: 20px;\n  height: 20px;\n  background: #1e293b;\n  border-radius: 50%;\n}\n@keyframes _ngcontent-%COMP%_riskPulse {\n  0%, 100% {\n    transform: scale(1);\n    opacity: 1;\n  }\n  50% {\n    transform: scale(1.05);\n    opacity: 0.8;\n  }\n}\n.risk-pulse[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_riskPulse 2s ease-in-out infinite;\n}\n@media (max-width: 768px) {\n  .credit-history-component[_ngcontent-%COMP%]   .score-progress-container[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-progressbar) {\n    height: 32px;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .score-progress-container[_ngcontent-%COMP%]   .score-text[_ngcontent-%COMP%] {\n    font-size: 1rem;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .risk-gauge[_ngcontent-%COMP%] {\n    transform: scale(0.8);\n  }\n}\n@media print {\n  .credit-history-component[_ngcontent-%COMP%]   .risk-assessment-card[_ngcontent-%COMP%] {\n    background: white !important;\n    border: 2px solid #e5e7eb;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .risk-assessment-card[_ngcontent-%COMP%]   *[_ngcontent-%COMP%] {\n    color: black !important;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .score-progress-container[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-progressbar) {\n    background: #e5e7eb !important;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .score-progress-container[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-progressbar)   .p-progressbar-value[_ngcontent-%COMP%] {\n    background: #6b7280 !important;\n    print-color-adjust: exact;\n    -webkit-print-color-adjust: exact;\n  }\n}\n.bg-green-100[_ngcontent-%COMP%] {\n  background-color: #dcfce7;\n}\n.bg-blue-100[_ngcontent-%COMP%] {\n  background-color: #dbeafe;\n}\n.bg-orange-100[_ngcontent-%COMP%] {\n  background-color: #fed7aa;\n}\n.bg-red-100[_ngcontent-%COMP%] {\n  background-color: #fee2e2;\n}\n.bg-purple-100[_ngcontent-%COMP%] {\n  background-color: #e9d5ff;\n}\n.text-green-600[_ngcontent-%COMP%] {\n  color: #059669;\n}\n.text-green-800[_ngcontent-%COMP%] {\n  color: #166534;\n}\n.text-blue-600[_ngcontent-%COMP%] {\n  color: #2563eb;\n}\n.text-orange-600[_ngcontent-%COMP%] {\n  color: #ea580c;\n}\n.text-orange-800[_ngcontent-%COMP%] {\n  color: #9a3412;\n}\n.text-red-600[_ngcontent-%COMP%] {\n  color: #dc2626;\n}\n.text-red-800[_ngcontent-%COMP%] {\n  color: #991b1b;\n}\n.text-purple-600[_ngcontent-%COMP%] {\n  color: #9333ea;\n}\n.credit-history-component[_ngcontent-%COMP%] {\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%] {\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .risk-level-indicator[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.5rem 1rem;\n  border-radius: 24px;\n  font-weight: 600;\n  transition: all 0.3s ease;\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .risk-level-indicator.level-very-low[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #10b981 0%,\n      #059669 100%);\n  color: white;\n  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .risk-level-indicator.level-low[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #2563eb 100%);\n  color: white;\n  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .risk-level-indicator.level-moderate[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #f59e0b 0%,\n      #d97706 100%);\n  color: white;\n  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .risk-level-indicator.level-high[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #f97316 0%,\n      #ea580c 100%);\n  color: white;\n  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .risk-level-indicator.level-very-high[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #ef4444 0%,\n      #dc2626 100%);\n  color: white;\n  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .risk-score-progress[_ngcontent-%COMP%] {\n  position: relative;\n  padding: 1rem;\n  background: rgba(0, 0, 0, 0.05);\n  border-radius: 16px;\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .risk-score-progress[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-progressbar) {\n  height: 48px !important;\n  border-radius: 24px;\n  background: rgba(0, 0, 0, 0.1);\n  overflow: visible;\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .risk-score-progress[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-progressbar)   .p-progressbar-value[_ngcontent-%COMP%] {\n  border-radius: 24px;\n  position: relative;\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .risk-score-progress[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-progressbar)   .p-progressbar-value[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  inset: 0;\n  background:\n    linear-gradient(\n      90deg,\n      rgba(255, 255, 255, 0) 0%,\n      rgba(255, 255, 255, 0.3) 50%,\n      rgba(255, 255, 255, 0) 100%);\n  animation: _ngcontent-%COMP%_shimmer 2s infinite;\n  border-radius: 24px;\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .risk-score-progress[_ngcontent-%COMP%]   .score-label[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: white;\n  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);\n  z-index: 2;\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .risk-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 12px;\n  padding: 1.5rem;\n  text-align: center;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);\n  transition: all 0.3s ease;\n  border: 2px solid transparent;\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .risk-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .risk-metrics[_ngcontent-%COMP%]   .metric-card.metric-positive[_ngcontent-%COMP%] {\n  border-color: #10b981;\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .risk-metrics[_ngcontent-%COMP%]   .metric-card.metric-positive[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%] {\n  color: #10b981;\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .risk-metrics[_ngcontent-%COMP%]   .metric-card.metric-negative[_ngcontent-%COMP%] {\n  border-color: #ef4444;\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .risk-metrics[_ngcontent-%COMP%]   .metric-card.metric-negative[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%] {\n  color: #ef4444;\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .risk-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%] {\n  font-size: 2.5rem;\n  margin-bottom: 0.75rem;\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .risk-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-value[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  font-weight: 700;\n  line-height: 1;\n  margin-bottom: 0.25rem;\n}\n.credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .risk-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-label[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  color: #6b7280;\n}\n@keyframes _ngcontent-%COMP%_shimmer {\n  0% {\n    transform: translateX(-100%);\n  }\n  100% {\n    transform: translateX(100%);\n  }\n}\n@keyframes _ngcontent-%COMP%_riskWarningPulse {\n  0%, 100% {\n    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);\n  }\n  50% {\n    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);\n  }\n}\n.high-risk-pulse[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_riskWarningPulse 2s infinite;\n}\n@media (max-width: 768px) {\n  .credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .risk-score-progress[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-progressbar) {\n    height: 36px !important;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .risk-score-progress[_ngcontent-%COMP%]   .score-label[_ngcontent-%COMP%] {\n    font-size: 1.25rem;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .risk-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .risk-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%] {\n    font-size: 2rem;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .risk-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-value[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n}\n@media (prefers-color-scheme: dark) {\n  .credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%] {\n    background: #1f2937;\n    color: #f9fafb;\n    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-label[_ngcontent-%COMP%] {\n    color: #9ca3af;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .risk-score-progress[_ngcontent-%COMP%] {\n    background: rgba(255, 255, 255, 0.05);\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .risk-score-progress[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-progressbar) {\n    background: rgba(255, 255, 255, 0.1);\n  }\n}\n@media print {\n  .credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%] {\n    page-break-inside: avoid;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .risk-level-indicator[_ngcontent-%COMP%] {\n    background: none !important;\n    border: 2px solid currentColor;\n    color: black !important;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .risk-score-progress[_ngcontent-%COMP%] {\n    background: #f3f4f6 !important;\n  }\n  .credit-history-component[_ngcontent-%COMP%]   .risk-assessment-enhanced[_ngcontent-%COMP%]   .risk-score-progress[_ngcontent-%COMP%]   .score-label[_ngcontent-%COMP%] {\n    color: black !important;\n    text-shadow: none !important;\n  }\n}\n/*# sourceMappingURL=analyse-credit.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AnalyseCreditComponent, { className: "AnalyseCreditComponent", filePath: "src/app/pages/dashboard/analyse-credit/analyse-credit.component.ts", lineNumber: 34 });
})();
export {
  AnalyseCreditComponent
};
//# sourceMappingURL=chunk-KZXLBJZA.js.map
