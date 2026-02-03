import {
  TabPanel,
  TabView,
  TabViewModule
} from "./chunk-I3MJ27E7.js";
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
  Avatar,
  AvatarModule
} from "./chunk-MCGUCMXD.js";
import {
  Tag,
  TagModule
} from "./chunk-MYUKI7DG.js";
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
import "./chunk-CUABQE42.js";
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
  Button,
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
  FormArrayName,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  FormGroupName,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  ReactiveFormsModule,
  Validators,
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
  CurrencyPipe,
  NgForOf,
  NgIf
} from "./chunk-SQQPVFHK.js";
import {
  DestroyRef,
  EMPTY,
  finalize,
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
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind4,
  ɵɵproperty,
  ɵɵpureFunction0,
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

// src/app/pages/dashboard/agent-credit/process-update-credit/process-update-credit.component.ts
var _c0 = () => ({ width: "450px" });
var _c1 = () => ({ width: "50px", height: "50px" });
function ProcessUpdateCreditComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3);
    \u0275\u0275element(1, "p-progressSpinner", 4);
    \u0275\u0275elementStart(2, "span", 5);
    \u0275\u0275text(3, "Chargement des donn\xE9es du cr\xE9dit...");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(2, _c1));
  }
}
function ProcessUpdateCreditComponent_div_4_span_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 129);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" R\xE9f\xE9rence: ", ctx_r1.state().referenceCredit, " ");
  }
}
function ProcessUpdateCreditComponent_div_4_div_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 130);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.state().error, " ");
  }
}
function ProcessUpdateCreditComponent_div_4_small_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 131);
    \u0275\u0275text(1, "Ce champ est requis");
    \u0275\u0275elementEnd();
  }
}
function ProcessUpdateCreditComponent_div_4_small_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 131);
    \u0275\u0275text(1, "Ce champ est requis");
    \u0275\u0275elementEnd();
  }
}
function ProcessUpdateCreditComponent_div_4_small_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 131);
    \u0275\u0275text(1, "Ce champ est requis et doit \xEAtre sup\xE9rieur \xE0 0");
    \u0275\u0275elementEnd();
  }
}
function ProcessUpdateCreditComponent_div_4_small_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 131);
    \u0275\u0275text(1, "La valeur doit \xEAtre sup\xE9rieure ou \xE9gale \xE0 0");
    \u0275\u0275elementEnd();
  }
}
function ProcessUpdateCreditComponent_div_4_small_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 131);
    \u0275\u0275text(1, "La valeur doit \xEAtre sup\xE9rieure ou \xE9gale \xE0 0");
    \u0275\u0275elementEnd();
  }
}
function ProcessUpdateCreditComponent_div_4_small_54_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 131);
    \u0275\u0275text(1, "Ce champ est requis");
    \u0275\u0275elementEnd();
  }
}
function ProcessUpdateCreditComponent_div_4_small_59_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 131);
    \u0275\u0275text(1, "Ce champ est requis");
    \u0275\u0275elementEnd();
  }
}
function ProcessUpdateCreditComponent_div_4_small_64_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 131);
    \u0275\u0275text(1, "Ce champ est requis");
    \u0275\u0275elementEnd();
  }
}
function ProcessUpdateCreditComponent_div_4_small_85_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 131);
    \u0275\u0275text(1, "Ce champ est requis et doit \xEAtre sup\xE9rieur \xE0 0");
    \u0275\u0275elementEnd();
  }
}
function ProcessUpdateCreditComponent_div_4_p_card_92_p_button_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 141);
    \u0275\u0275listener("click", function ProcessUpdateCreditComponent_div_4_p_card_92_p_button_19_Template_p_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const i_r4 = \u0275\u0275nextContext().index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.removeProduit(i_r4));
    });
    \u0275\u0275elementEnd();
  }
}
function ProcessUpdateCreditComponent_div_4_p_card_92_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-card", 87)(1, "div", 132)(2, "div", 133)(3, "label", 134);
    \u0275\u0275text(4, "Libell\xE9*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "input", 135);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 133)(7, "label", 134);
    \u0275\u0275text(8, "Prix unitaire*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(9, "p-inputNumber", 136);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 133)(11, "label", 134);
    \u0275\u0275text(12, "Quantit\xE9*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(13, "p-inputNumber", 137);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div", 133)(15, "label", 134);
    \u0275\u0275text(16, "Observation");
    \u0275\u0275elementEnd();
    \u0275\u0275element(17, "input", 138);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "div", 139);
    \u0275\u0275template(19, ProcessUpdateCreditComponent_div_4_p_card_92_p_button_19_Template, 1, 0, "p-button", 140);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const i_r4 = ctx.index;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("formGroupName", i_r4);
    \u0275\u0275advance(2);
    \u0275\u0275property("for", "produit-libele-" + i_r4);
    \u0275\u0275advance(2);
    \u0275\u0275property("id", "produit-libele-" + i_r4);
    \u0275\u0275advance(2);
    \u0275\u0275property("for", "produit-prix-" + i_r4);
    \u0275\u0275advance(2);
    \u0275\u0275property("id", "produit-prix-" + i_r4)("minFractionDigits", 2)("maxFractionDigits", 2);
    \u0275\u0275advance(2);
    \u0275\u0275property("for", "produit-qte-" + i_r4);
    \u0275\u0275advance(2);
    \u0275\u0275property("id", "produit-qte-" + i_r4)("showButtons", true)("min", 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("for", "produit-obs-" + i_r4);
    \u0275\u0275advance(2);
    \u0275\u0275property("id", "produit-obs-" + i_r4);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.produits.length > 1);
  }
}
function ProcessUpdateCreditComponent_div_4_p_card_101_p_button_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 141);
    \u0275\u0275listener("click", function ProcessUpdateCreditComponent_div_4_p_card_101_p_button_15_Template_p_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const i_r6 = \u0275\u0275nextContext().index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.removeCharge(i_r6));
    });
    \u0275\u0275elementEnd();
  }
}
function ProcessUpdateCreditComponent_div_4_p_card_101_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-card", 87)(1, "div", 132)(2, "div", 142)(3, "label", 134);
    \u0275\u0275text(4, "Libell\xE9*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "input", 135);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 142)(7, "label", 134);
    \u0275\u0275text(8, "Prix unitaire*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(9, "p-inputNumber", 136);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 142)(11, "label", 134);
    \u0275\u0275text(12, "Quantit\xE9*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(13, "p-inputNumber", 137);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div", 139);
    \u0275\u0275template(15, ProcessUpdateCreditComponent_div_4_p_card_101_p_button_15_Template, 1, 0, "p-button", 140);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const i_r6 = ctx.index;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("formGroupName", i_r6);
    \u0275\u0275advance(2);
    \u0275\u0275property("for", "charge-libele-" + i_r6);
    \u0275\u0275advance(2);
    \u0275\u0275property("id", "charge-libele-" + i_r6);
    \u0275\u0275advance(2);
    \u0275\u0275property("for", "charge-prix-" + i_r6);
    \u0275\u0275advance(2);
    \u0275\u0275property("id", "charge-prix-" + i_r6)("minFractionDigits", 2)("maxFractionDigits", 2);
    \u0275\u0275advance(2);
    \u0275\u0275property("for", "charge-qte-" + i_r6);
    \u0275\u0275advance(2);
    \u0275\u0275property("id", "charge-qte-" + i_r6)("showButtons", true)("min", 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.charges.length > 1);
  }
}
function ProcessUpdateCreditComponent_div_4_small_117_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 131);
    \u0275\u0275text(1, "Ce champ est requis");
    \u0275\u0275elementEnd();
  }
}
function ProcessUpdateCreditComponent_div_4_small_122_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 131);
    \u0275\u0275text(1, "Ce champ est requis et doit \xEAtre sup\xE9rieur \xE0 0");
    \u0275\u0275elementEnd();
  }
}
function ProcessUpdateCreditComponent_div_4_p_card_139_p_button_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 141);
    \u0275\u0275listener("click", function ProcessUpdateCreditComponent_div_4_p_card_139_p_button_27_Template_p_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const i_r8 = \u0275\u0275nextContext().index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.removeCaution(i_r8));
    });
    \u0275\u0275elementEnd();
  }
}
function ProcessUpdateCreditComponent_div_4_p_card_139_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-card", 87)(1, "div", 132)(2, "div", 133)(3, "label", 134);
    \u0275\u0275text(4, "Nom*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "input", 143);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 133)(7, "label", 134);
    \u0275\u0275text(8, "Pr\xE9nom*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(9, "input", 144);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 133)(11, "label", 134);
    \u0275\u0275text(12, "T\xE9l\xE9phone*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(13, "input", 145);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div", 133)(15, "label", 134);
    \u0275\u0275text(16, "Activit\xE9*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(17, "input", 146);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "div", 133)(19, "label", 134);
    \u0275\u0275text(20, "\xC2ge*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(21, "p-inputNumber", 147);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "div", 133)(23, "label", 134);
    \u0275\u0275text(24, "Profession*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(25, "input", 148);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "div", 139);
    \u0275\u0275template(27, ProcessUpdateCreditComponent_div_4_p_card_139_p_button_27_Template, 1, 0, "p-button", 140);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const i_r8 = ctx.index;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("formGroupName", i_r8);
    \u0275\u0275advance(2);
    \u0275\u0275property("for", "caution-nom-" + i_r8);
    \u0275\u0275advance(2);
    \u0275\u0275property("id", "caution-nom-" + i_r8);
    \u0275\u0275advance(2);
    \u0275\u0275property("for", "caution-prenom-" + i_r8);
    \u0275\u0275advance(2);
    \u0275\u0275property("id", "caution-prenom-" + i_r8);
    \u0275\u0275advance(2);
    \u0275\u0275property("for", "caution-telephone-" + i_r8);
    \u0275\u0275advance(2);
    \u0275\u0275property("id", "caution-telephone-" + i_r8);
    \u0275\u0275advance(2);
    \u0275\u0275property("for", "caution-activite-" + i_r8);
    \u0275\u0275advance(2);
    \u0275\u0275property("id", "caution-activite-" + i_r8);
    \u0275\u0275advance(2);
    \u0275\u0275property("for", "caution-age-" + i_r8);
    \u0275\u0275advance(2);
    \u0275\u0275property("id", "caution-age-" + i_r8)("showButtons", true)("min", 18);
    \u0275\u0275advance(2);
    \u0275\u0275property("for", "caution-profession-" + i_r8);
    \u0275\u0275advance(2);
    \u0275\u0275property("id", "caution-profession-" + i_r8);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.cautions.length > 1);
  }
}
function ProcessUpdateCreditComponent_div_4_ng_template_159_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 149);
    \u0275\u0275element(1, "i", 150);
    \u0275\u0275elementStart(2, "h3", 151);
    \u0275\u0275text(3, "Informations Principales");
    \u0275\u0275elementEnd()();
  }
}
function ProcessUpdateCreditComponent_div_4_ng_template_198_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 152);
    \u0275\u0275element(1, "i", 153);
    \u0275\u0275elementStart(2, "h3", 154);
    \u0275\u0275text(3, "Activit\xE9 & Exp\xE9rience");
    \u0275\u0275elementEnd()();
  }
}
function ProcessUpdateCreditComponent_div_4_ng_template_224_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 155)(1, "div", 84);
    \u0275\u0275element(2, "i", 156);
    \u0275\u0275elementStart(3, "h3", 157);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(5, "p-tag", 158);
    \u0275\u0275pipe(6, "currency");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Produits (", ctx_r1.produits.length, ")");
    \u0275\u0275advance();
    \u0275\u0275property("value", (tmp_3_0 = \u0275\u0275pipeBind4(6, 2, ctx_r1.calculateTotalProduits(), "GNF", "symbol", "1.0-0")) !== null && tmp_3_0 !== void 0 ? tmp_3_0 : "");
  }
}
function ProcessUpdateCreditComponent_div_4_div_225_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 160)(1, "div", 161)(2, "div", 162)(3, "h4", 163);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 164);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 165);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 81)(10, "div", 166);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 167);
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "currency");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_5_0;
    let tmp_7_0;
    let tmp_8_0;
    let tmp_9_0;
    const produit_r9 = ctx.$implicit;
    const i_r10 = ctx.index;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate((tmp_5_0 = produit_r9.get("libele")) == null ? null : tmp_5_0.value);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("#", i_r10 + 1, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ((tmp_7_0 = produit_r9.get("observation")) == null ? null : tmp_7_0.value) || "Aucune observation", " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind4(12, 6, ((tmp_8_0 = produit_r9.get("prixUnit")) == null ? null : tmp_8_0.value) * ((tmp_8_0 = produit_r9.get("qte")) == null ? null : tmp_8_0.value), "GNF", "symbol", "1.0-0"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", (tmp_9_0 = produit_r9.get("qte")) == null ? null : tmp_9_0.value, " \xD7 ", \u0275\u0275pipeBind4(15, 11, (tmp_9_0 = produit_r9.get("prixUnit")) == null ? null : tmp_9_0.value, "GNF", "symbol", "1.0-0"), " ");
  }
}
function ProcessUpdateCreditComponent_div_4_div_225_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 65);
    \u0275\u0275template(1, ProcessUpdateCreditComponent_div_4_div_225_div_1_Template, 16, 16, "div", 159);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.produits.controls);
  }
}
function ProcessUpdateCreditComponent_div_4_div_226_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 168);
    \u0275\u0275element(1, "i", 169);
    \u0275\u0275elementStart(2, "p", 170);
    \u0275\u0275text(3, "Aucun produit ajout\xE9");
    \u0275\u0275elementEnd()();
  }
}
function ProcessUpdateCreditComponent_div_4_ng_template_228_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 171)(1, "div", 84);
    \u0275\u0275element(2, "i", 172);
    \u0275\u0275elementStart(3, "h3", 173);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(5, "p-tag", 174);
    \u0275\u0275pipe(6, "currency");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Charges (", ctx_r1.charges.length, ") ");
    \u0275\u0275advance();
    \u0275\u0275property("value", (tmp_3_0 = \u0275\u0275pipeBind4(6, 2, ctx_r1.calculateTotalCharges(), "GNF", "symbol", "1.0-0")) !== null && tmp_3_0 !== void 0 ? tmp_3_0 : "");
  }
}
function ProcessUpdateCreditComponent_div_4_div_229_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 160)(1, "div", 161)(2, "div", 162)(3, "h4", 163);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 164);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 81)(8, "div", 166);
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 167);
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "currency");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_5_0;
    let tmp_7_0;
    let tmp_8_0;
    const charge_r11 = ctx.$implicit;
    const i_r12 = ctx.index;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", (tmp_5_0 = charge_r11.get("libele")) == null ? null : tmp_5_0.value, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("#", i_r12 + 1, "");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind4(10, 5, ((tmp_7_0 = charge_r11.get("prixUnit")) == null ? null : tmp_7_0.value) * ((tmp_7_0 = charge_r11.get("qte")) == null ? null : tmp_7_0.value), "GNF", "symbol", "1.0-0"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", (tmp_8_0 = charge_r11.get("qte")) == null ? null : tmp_8_0.value, " \xD7 ", \u0275\u0275pipeBind4(13, 10, (tmp_8_0 = charge_r11.get("prixUnit")) == null ? null : tmp_8_0.value, "GNF", "symbol", "1.0-0"), " ");
  }
}
function ProcessUpdateCreditComponent_div_4_div_229_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 65);
    \u0275\u0275template(1, ProcessUpdateCreditComponent_div_4_div_229_div_1_Template, 14, 15, "div", 159);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.charges.controls);
  }
}
function ProcessUpdateCreditComponent_div_4_div_230_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 168);
    \u0275\u0275element(1, "i", 169);
    \u0275\u0275elementStart(2, "p", 170);
    \u0275\u0275text(3, "Aucune charge ajout\xE9e");
    \u0275\u0275elementEnd()();
  }
}
function ProcessUpdateCreditComponent_div_4_ng_template_232_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 175);
    \u0275\u0275element(1, "i", 176);
    \u0275\u0275elementStart(2, "h3", 177);
    \u0275\u0275text(3, "Garantie");
    \u0275\u0275elementEnd()();
  }
}
function ProcessUpdateCreditComponent_div_4_div_245_div_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 180)(1, "strong");
    \u0275\u0275text(2, "IT Ass:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", (tmp_3_0 = ctx_r1.creditForm.get("itAss")) == null ? null : tmp_3_0.value, " ");
  }
}
function ProcessUpdateCreditComponent_div_4_div_245_div_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 181)(1, "strong");
    \u0275\u0275text(2, "IT PC:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", (tmp_3_0 = ctx_r1.creditForm.get("itPc")) == null ? null : tmp_3_0.value, " ");
  }
}
function ProcessUpdateCreditComponent_div_4_div_245_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 96)(1, "div", 102)(2, "div", 109);
    \u0275\u0275text(3, "Localisation");
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, ProcessUpdateCreditComponent_div_4_div_245_div_4_Template, 4, 1, "div", 178)(5, ProcessUpdateCreditComponent_div_4_div_245_div_5_Template, 4, 1, "div", 179);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", (tmp_2_0 = ctx_r1.creditForm.get("itAss")) == null ? null : tmp_2_0.value);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_3_0 = ctx_r1.creditForm.get("itPc")) == null ? null : tmp_3_0.value);
  }
}
function ProcessUpdateCreditComponent_div_4_ng_template_247_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 182);
    \u0275\u0275element(1, "i", 183);
    \u0275\u0275elementStart(2, "h3", 184);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Personnes Caution (", ctx_r1.cautions.length, ")");
  }
}
function ProcessUpdateCreditComponent_div_4_div_248_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 160)(1, "div", 161)(2, "div", 185);
    \u0275\u0275element(3, "p-avatar", 186);
    \u0275\u0275elementStart(4, "div")(5, "div", 104);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 167);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 187);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 187);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 188);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_5_0;
    let tmp_6_0;
    let tmp_7_0;
    let tmp_8_0;
    let tmp_9_0;
    let tmp_10_0;
    const caution_r13 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275property("label", (((tmp_5_0 = caution_r13.get("prenom")) == null ? null : tmp_5_0.value) || "?").charAt(0) + (((tmp_5_0 = caution_r13.get("nom")) == null ? null : tmp_5_0.value) || "?").charAt(0));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", (tmp_6_0 = caution_r13.get("prenom")) == null ? null : tmp_6_0.value, " ", (tmp_6_0 = caution_r13.get("nom")) == null ? null : tmp_6_0.value, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", (tmp_7_0 = caution_r13.get("age")) == null ? null : tmp_7_0.value, " ans");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((tmp_8_0 = caution_r13.get("profession")) == null ? null : tmp_8_0.value);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((tmp_9_0 = caution_r13.get("activite")) == null ? null : tmp_9_0.value);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", (tmp_10_0 = caution_r13.get("telephone")) == null ? null : tmp_10_0.value, " ");
  }
}
function ProcessUpdateCreditComponent_div_4_div_248_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 65);
    \u0275\u0275template(1, ProcessUpdateCreditComponent_div_4_div_248_div_1_Template, 15, 7, "div", 159);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.cautions.controls);
  }
}
function ProcessUpdateCreditComponent_div_4_div_249_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 168);
    \u0275\u0275element(1, "i", 169);
    \u0275\u0275elementStart(2, "p", 170);
    \u0275\u0275text(3, "Aucune caution ajout\xE9e");
    \u0275\u0275elementEnd()();
  }
}
function ProcessUpdateCreditComponent_div_4_ng_template_251_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 189);
    \u0275\u0275element(1, "i", 190);
    \u0275\u0275elementStart(2, "h3", 191);
    \u0275\u0275text(3, "Synth\xE8se Financi\xE8re");
    \u0275\u0275elementEnd()();
  }
}
function ProcessUpdateCreditComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 6);
    \u0275\u0275element(2, "i", 7);
    \u0275\u0275text(3);
    \u0275\u0275template(4, ProcessUpdateCreditComponent_div_4_span_4_Template, 2, 1, "span", 8);
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, ProcessUpdateCreditComponent_div_4_div_5_Template, 2, 1, "div", 9);
    \u0275\u0275elementStart(6, "p-tabView", 10);
    \u0275\u0275twoWayListener("activeIndexChange", function ProcessUpdateCreditComponent_div_4_Template_p_tabView_activeIndexChange_6_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.state().activeIndex, $event) || (ctx_r1.state().activeIndex = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(7, "p-tabPanel", 11)(8, "form", 12)(9, "div", 13)(10, "label", 14);
    \u0275\u0275text(11, "Cumul Cr\xE9dit");
    \u0275\u0275elementEnd();
    \u0275\u0275element(12, "p-inputNumber", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 13)(14, "label", 16);
    \u0275\u0275text(15, "Nombre de Cr\xE9dit");
    \u0275\u0275elementEnd();
    \u0275\u0275element(16, "p-inputNumber", 17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 13)(18, "label", 18);
    \u0275\u0275text(19, "Num\xE9ro Membre*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(20, "input", 19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "div", 13)(22, "label", 20);
    \u0275\u0275text(23, "R\xE9f\xE9rence du Cr\xE9dit*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(24, "input", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "div", 13)(26, "label", 22);
    \u0275\u0275text(27, "Moyen de Deplacement Personnel*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(28, "input", 23);
    \u0275\u0275template(29, ProcessUpdateCreditComponent_div_4_small_29_Template, 2, 0, "small", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "div", 13)(31, "label", 25);
    \u0275\u0275text(32, "Bien*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(33, "input", 26);
    \u0275\u0275template(34, ProcessUpdateCreditComponent_div_4_small_34_Template, 2, 0, "small", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "div", 13)(36, "label", 27);
    \u0275\u0275text(37, "Capital*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(38, "p-inputNumber", 28);
    \u0275\u0275template(39, ProcessUpdateCreditComponent_div_4_small_39_Template, 2, 0, "small", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "div", 13)(41, "label", 29);
    \u0275\u0275text(42, "Cr\xE9ance");
    \u0275\u0275elementEnd();
    \u0275\u0275element(43, "p-inputNumber", 30);
    \u0275\u0275template(44, ProcessUpdateCreditComponent_div_4_small_44_Template, 2, 0, "small", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "div", 13)(46, "label", 31);
    \u0275\u0275text(47, "Dette");
    \u0275\u0275elementEnd();
    \u0275\u0275element(48, "p-inputNumber", 32);
    \u0275\u0275template(49, ProcessUpdateCreditComponent_div_4_small_49_Template, 2, 0, "small", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "div", 13)(51, "label", 33);
    \u0275\u0275text(52, "Statut d'Activit\xE9*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(53, "input", 34);
    \u0275\u0275template(54, ProcessUpdateCreditComponent_div_4_small_54_Template, 2, 0, "small", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "div", 13)(56, "label", 35);
    \u0275\u0275text(57, "Exp\xE9rience*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(58, "input", 36);
    \u0275\u0275template(59, ProcessUpdateCreditComponent_div_4_small_59_Template, 2, 0, "small", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(60, "div", 13)(61, "label", 37);
    \u0275\u0275text(62, "Lieu d'Activit\xE9*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(63, "input", 38);
    \u0275\u0275template(64, ProcessUpdateCreditComponent_div_4_small_64_Template, 2, 0, "small", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(65, "div", 39)(66, "p-button", 40);
    \u0275\u0275listener("click", function ProcessUpdateCreditComponent_div_4_Template_p_button_click_66_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.nextStep());
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(67, "p-tabPanel", 41)(68, "form", 12)(69, "div", 13)(70, "label", 42);
    \u0275\u0275text(71, "Personne Employ\xE9e");
    \u0275\u0275elementEnd();
    \u0275\u0275element(72, "input", 43);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(73, "div", 13)(74, "label", 44);
    \u0275\u0275text(75, "Lien");
    \u0275\u0275elementEnd();
    \u0275\u0275element(76, "input", 45);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(77, "div", 13)(78, "label", 46);
    \u0275\u0275text(79, "Nombre");
    \u0275\u0275elementEnd();
    \u0275\u0275element(80, "input", 47);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(81, "div", 13)(82, "label", 48);
    \u0275\u0275text(83, "Fr\xE9quence*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(84, "p-inputNumber", 49);
    \u0275\u0275template(85, ProcessUpdateCreditComponent_div_4_small_85_Template, 2, 0, "small", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(86, "div", 50)(87, "p-button", 51);
    \u0275\u0275listener("click", function ProcessUpdateCreditComponent_div_4_Template_p_button_click_87_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.prevStep());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(88, "p-button", 40);
    \u0275\u0275listener("click", function ProcessUpdateCreditComponent_div_4_Template_p_button_click_88_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.nextStep());
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(89, "p-tabPanel", 52)(90, "form", 53)(91, "div", 54);
    \u0275\u0275template(92, ProcessUpdateCreditComponent_div_4_p_card_92_Template, 20, 14, "p-card", 55);
    \u0275\u0275elementStart(93, "div", 56)(94, "p-button", 57);
    \u0275\u0275listener("click", function ProcessUpdateCreditComponent_div_4_Template_p_button_click_94_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.addProduit());
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(95, "div", 58)(96, "p-button", 51);
    \u0275\u0275listener("click", function ProcessUpdateCreditComponent_div_4_Template_p_button_click_96_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.prevStep());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(97, "p-button", 40);
    \u0275\u0275listener("click", function ProcessUpdateCreditComponent_div_4_Template_p_button_click_97_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.nextStep());
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(98, "p-tabPanel", 59)(99, "form", 53)(100, "div", 60);
    \u0275\u0275template(101, ProcessUpdateCreditComponent_div_4_p_card_101_Template, 16, 12, "p-card", 55);
    \u0275\u0275elementStart(102, "div", 56)(103, "p-button", 61);
    \u0275\u0275listener("click", function ProcessUpdateCreditComponent_div_4_Template_p_button_click_103_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.addCharge());
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(104, "div", 58)(105, "p-button", 51);
    \u0275\u0275listener("click", function ProcessUpdateCreditComponent_div_4_Template_p_button_click_105_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.prevStep());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(106, "p-button", 40);
    \u0275\u0275listener("click", function ProcessUpdateCreditComponent_div_4_Template_p_button_click_106_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.nextStep());
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(107, "p-tabPanel", 62)(108, "form", 53)(109, "div", 63)(110, "h4", 64);
    \u0275\u0275text(111, "Informations sur la Garantie");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(112, "div", 65)(113, "div", 13)(114, "label", 66);
    \u0275\u0275text(115, "Libell\xE9 de Garantie*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(116, "input", 67);
    \u0275\u0275template(117, ProcessUpdateCreditComponent_div_4_small_117_Template, 2, 0, "small", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(118, "div", 13)(119, "label", 68);
    \u0275\u0275text(120, "Montant de Garantie*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(121, "p-inputNumber", 69);
    \u0275\u0275template(122, ProcessUpdateCreditComponent_div_4_small_122_Template, 2, 0, "small", 24);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(123, "div", 63)(124, "h4", 70);
    \u0275\u0275text(125, "Localisation");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(126, "div", 65)(127, "div", 13)(128, "label", 71);
    \u0275\u0275text(129, "IT Ass");
    \u0275\u0275elementEnd();
    \u0275\u0275element(130, "input", 72);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(131, "div", 13)(132, "label", 73);
    \u0275\u0275text(133, "IT PC");
    \u0275\u0275elementEnd();
    \u0275\u0275element(134, "input", 74);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(135, "div", 63)(136, "h4", 75);
    \u0275\u0275text(137, "Personnes Caution");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(138, "div", 76);
    \u0275\u0275template(139, ProcessUpdateCreditComponent_div_4_p_card_139_Template, 28, 16, "p-card", 55);
    \u0275\u0275elementStart(140, "div", 56)(141, "p-button", 77);
    \u0275\u0275listener("click", function ProcessUpdateCreditComponent_div_4_Template_p_button_click_141_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.addCaution());
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(142, "div", 58)(143, "p-button", 51);
    \u0275\u0275listener("click", function ProcessUpdateCreditComponent_div_4_Template_p_button_click_143_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.prevStep());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(144, "p-button", 40);
    \u0275\u0275listener("click", function ProcessUpdateCreditComponent_div_4_Template_p_button_click_144_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.nextStep());
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(145, "p-tabPanel", 78)(146, "div", 79)(147, "div", 80)(148, "div", 81)(149, "div")(150, "h2", 82);
    \u0275\u0275text(151, "\u{1F4DD} R\xE9sum\xE9 des Modifications");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(152, "p", 83);
    \u0275\u0275text(153, "V\xE9rifiez toutes les informations avant mise \xE0 jour");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(154, "div", 84);
    \u0275\u0275element(155, "i", 85);
    \u0275\u0275elementStart(156, "span", 86);
    \u0275\u0275text(157, "Pr\xEAt pour mise \xE0 jour");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(158, "p-card", 87);
    \u0275\u0275template(159, ProcessUpdateCreditComponent_div_4_ng_template_159_Template, 4, 0, "ng-template", 88);
    \u0275\u0275elementStart(160, "div", 65)(161, "div", 89)(162, "div", 90)(163, "div", 91)(164, "span", 92);
    \u0275\u0275text(165, "NUM\xC9RO MEMBRE");
    \u0275\u0275elementEnd();
    \u0275\u0275element(166, "p-tag", 93);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(167, "span", 94);
    \u0275\u0275text(168);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(169, "div", 89)(170, "div", 90)(171, "div", 91)(172, "span", 92);
    \u0275\u0275text(173, "R\xC9F\xC9RENCE CR\xC9DIT");
    \u0275\u0275elementEnd();
    \u0275\u0275element(174, "i", 95);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(175, "span", 94);
    \u0275\u0275text(176);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(177, "div", 96)(178, "div", 97)(179, "div", 98);
    \u0275\u0275text(180);
    \u0275\u0275pipe(181, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(182, "div", 99);
    \u0275\u0275text(183, "Cumul Cr\xE9dit");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(184, "div", 96)(185, "div", 97)(186, "div", 100);
    \u0275\u0275text(187);
    \u0275\u0275pipe(188, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(189, "div", 99);
    \u0275\u0275text(190, "Capital Demand\xE9");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(191, "div", 96)(192, "div", 97)(193, "div", 101);
    \u0275\u0275text(194);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(195, "div", 99);
    \u0275\u0275text(196, "Nombre de Cr\xE9dits");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(197, "p-card", 87);
    \u0275\u0275template(198, ProcessUpdateCreditComponent_div_4_ng_template_198_Template, 4, 0, "ng-template", 88);
    \u0275\u0275elementStart(199, "div", 65)(200, "div", 89)(201, "div", 102)(202, "div", 103);
    \u0275\u0275text(203, "Statut d'Activit\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(204, "div", 104);
    \u0275\u0275text(205);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(206, "div", 89)(207, "div", 102)(208, "div", 103);
    \u0275\u0275text(209, "Exp\xE9rience");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(210, "div", 104);
    \u0275\u0275text(211);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(212, "div", 89)(213, "div", 102)(214, "div", 103);
    \u0275\u0275text(215, "Lieu d'Activit\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(216, "div", 104);
    \u0275\u0275text(217);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(218, "div", 89)(219, "div", 102)(220, "div", 103);
    \u0275\u0275text(221, "Fr\xE9quence");
    \u0275\u0275elementEnd();
    \u0275\u0275element(222, "p-tag", 105);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(223, "p-card", 87);
    \u0275\u0275template(224, ProcessUpdateCreditComponent_div_4_ng_template_224_Template, 7, 7, "ng-template", 88)(225, ProcessUpdateCreditComponent_div_4_div_225_Template, 2, 1, "div", 106)(226, ProcessUpdateCreditComponent_div_4_div_226_Template, 4, 0, "div", 107);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(227, "p-card", 87);
    \u0275\u0275template(228, ProcessUpdateCreditComponent_div_4_ng_template_228_Template, 7, 7, "ng-template", 88)(229, ProcessUpdateCreditComponent_div_4_div_229_Template, 2, 1, "div", 106)(230, ProcessUpdateCreditComponent_div_4_div_230_Template, 4, 0, "div", 107);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(231, "p-card", 87);
    \u0275\u0275template(232, ProcessUpdateCreditComponent_div_4_ng_template_232_Template, 4, 0, "ng-template", 88);
    \u0275\u0275elementStart(233, "div", 65)(234, "div", 108)(235, "div", 102)(236, "div", 109);
    \u0275\u0275text(237, "Type de Garantie");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(238, "div", 110);
    \u0275\u0275text(239);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(240, "div", 103);
    \u0275\u0275text(241, "Montant");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(242, "div", 111);
    \u0275\u0275text(243);
    \u0275\u0275pipe(244, "currency");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(245, ProcessUpdateCreditComponent_div_4_div_245_Template, 6, 2, "div", 112);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(246, "p-card", 87);
    \u0275\u0275template(247, ProcessUpdateCreditComponent_div_4_ng_template_247_Template, 4, 1, "ng-template", 88)(248, ProcessUpdateCreditComponent_div_4_div_248_Template, 2, 1, "div", 106)(249, ProcessUpdateCreditComponent_div_4_div_249_Template, 4, 0, "div", 107);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(250, "p-card", 87);
    \u0275\u0275template(251, ProcessUpdateCreditComponent_div_4_ng_template_251_Template, 4, 0, "ng-template", 88);
    \u0275\u0275elementStart(252, "div", 65)(253, "div", 113)(254, "div", 114)(255, "div", 115);
    \u0275\u0275text(256);
    \u0275\u0275pipe(257, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(258, "div", 116);
    \u0275\u0275text(259, "Total Produits");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(260, "div", 113)(261, "div", 117)(262, "div", 118);
    \u0275\u0275text(263);
    \u0275\u0275pipe(264, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(265, "div", 119);
    \u0275\u0275text(266, "Total Charges");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(267, "div", 113)(268, "div", 120)(269, "div", 121);
    \u0275\u0275text(270);
    \u0275\u0275pipe(271, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(272, "div", 122);
    \u0275\u0275text(273, "R\xE9sultat Net");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(274, "div", 113)(275, "div", 123)(276, "div", 124);
    \u0275\u0275text(277);
    \u0275\u0275pipe(278, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(279, "div", 125);
    \u0275\u0275text(280, "Garantie");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(281, "div", 126)(282, "p-button", 127);
    \u0275\u0275listener("click", function ProcessUpdateCreditComponent_div_4_Template_p_button_click_282_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.prevStep());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(283, "p-button", 128);
    \u0275\u0275listener("click", function ProcessUpdateCreditComponent_div_4_Template_p_button_click_283_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.updateCreditData());
    });
    \u0275\u0275elementEnd()()()()()();
  }
  if (rf & 2) {
    let tmp_10_0;
    let tmp_11_0;
    let tmp_14_0;
    let tmp_17_0;
    let tmp_20_0;
    let tmp_21_0;
    let tmp_22_0;
    let tmp_23_0;
    let tmp_27_0;
    let tmp_33_0;
    let tmp_36_0;
    let tmp_38_0;
    let tmp_39_0;
    let tmp_40_0;
    let tmp_41_0;
    let tmp_42_0;
    let tmp_43_0;
    let tmp_44_0;
    let tmp_45_0;
    let tmp_46_0;
    let tmp_47_0;
    let tmp_52_0;
    let tmp_53_0;
    let tmp_54_0;
    let tmp_60_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.state().message || "Mise \xE0 jour du cr\xE9dit", " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.state().referenceCredit);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.state().error);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("activeIndex", ctx_r1.state().activeIndex);
    \u0275\u0275advance(2);
    \u0275\u0275property("formGroup", ctx_r1.creditForm);
    \u0275\u0275advance(4);
    \u0275\u0275property("minFractionDigits", 2)("maxFractionDigits", 2);
    \u0275\u0275advance(4);
    \u0275\u0275property("showButtons", false)("min", 0);
    \u0275\u0275advance(13);
    \u0275\u0275property("ngIf", ((tmp_10_0 = ctx_r1.creditForm.get("moyenPerson")) == null ? null : tmp_10_0.invalid) && ((tmp_10_0 = ctx_r1.creditForm.get("moyenPerson")) == null ? null : tmp_10_0.touched));
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ((tmp_11_0 = ctx_r1.creditForm.get("bien")) == null ? null : tmp_11_0.invalid) && ((tmp_11_0 = ctx_r1.creditForm.get("bien")) == null ? null : tmp_11_0.touched));
    \u0275\u0275advance(4);
    \u0275\u0275property("minFractionDigits", 2)("maxFractionDigits", 2);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_14_0 = ctx_r1.creditForm.get("capital")) == null ? null : tmp_14_0.invalid) && ((tmp_14_0 = ctx_r1.creditForm.get("capital")) == null ? null : tmp_14_0.touched));
    \u0275\u0275advance(4);
    \u0275\u0275property("minFractionDigits", 2)("maxFractionDigits", 2);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_17_0 = ctx_r1.creditForm.get("creance")) == null ? null : tmp_17_0.invalid) && ((tmp_17_0 = ctx_r1.creditForm.get("creance")) == null ? null : tmp_17_0.touched));
    \u0275\u0275advance(4);
    \u0275\u0275property("minFractionDigits", 2)("maxFractionDigits", 2);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_20_0 = ctx_r1.creditForm.get("dette")) == null ? null : tmp_20_0.invalid) && ((tmp_20_0 = ctx_r1.creditForm.get("dette")) == null ? null : tmp_20_0.touched));
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ((tmp_21_0 = ctx_r1.creditForm.get("statutActivite")) == null ? null : tmp_21_0.invalid) && ((tmp_21_0 = ctx_r1.creditForm.get("statutActivite")) == null ? null : tmp_21_0.touched));
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ((tmp_22_0 = ctx_r1.creditForm.get("experience")) == null ? null : tmp_22_0.invalid) && ((tmp_22_0 = ctx_r1.creditForm.get("experience")) == null ? null : tmp_22_0.touched));
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ((tmp_23_0 = ctx_r1.creditForm.get("lieuxAct")) == null ? null : tmp_23_0.invalid) && ((tmp_23_0 = ctx_r1.creditForm.get("lieuxAct")) == null ? null : tmp_23_0.touched));
    \u0275\u0275advance(4);
    \u0275\u0275property("formGroup", ctx_r1.creditForm);
    \u0275\u0275advance(16);
    \u0275\u0275property("showButtons", true)("min", 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_27_0 = ctx_r1.creditForm.get("frequence")) == null ? null : tmp_27_0.invalid) && ((tmp_27_0 = ctx_r1.creditForm.get("frequence")) == null ? null : tmp_27_0.touched));
    \u0275\u0275advance(5);
    \u0275\u0275property("formGroup", ctx_r1.creditForm);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r1.produits.controls);
    \u0275\u0275advance(7);
    \u0275\u0275property("formGroup", ctx_r1.creditForm);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r1.charges.controls);
    \u0275\u0275advance(7);
    \u0275\u0275property("formGroup", ctx_r1.creditForm);
    \u0275\u0275advance(9);
    \u0275\u0275property("ngIf", ((tmp_33_0 = ctx_r1.creditForm.get("garantieLibele")) == null ? null : tmp_33_0.invalid) && ((tmp_33_0 = ctx_r1.creditForm.get("garantieLibele")) == null ? null : tmp_33_0.touched));
    \u0275\u0275advance(4);
    \u0275\u0275property("minFractionDigits", 2)("maxFractionDigits", 2);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_36_0 = ctx_r1.creditForm.get("garantieMontant")) == null ? null : tmp_36_0.invalid) && ((tmp_36_0 = ctx_r1.creditForm.get("garantieMontant")) == null ? null : tmp_36_0.touched));
    \u0275\u0275advance(17);
    \u0275\u0275property("ngForOf", ctx_r1.cautions.controls);
    \u0275\u0275advance(27);
    \u0275\u0275property("value", (tmp_38_0 = ctx_r1.creditForm.get("numeroMembre")) == null ? null : tmp_38_0.value);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((tmp_39_0 = ctx_r1.creditForm.get("numeroMembre")) == null ? null : tmp_39_0.value);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate((tmp_40_0 = ctx_r1.creditForm.get("referenceCredit")) == null ? null : tmp_40_0.value);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind4(181, 62, (tmp_41_0 = ctx_r1.creditForm.get("cumulCredit")) == null ? null : tmp_41_0.value, "GNF", "symbol", "1.0-0"), " ");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind4(188, 67, (tmp_42_0 = ctx_r1.creditForm.get("capital")) == null ? null : tmp_42_0.value, "GNF", "symbol", "1.0-0"), " ");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1(" ", (tmp_43_0 = ctx_r1.creditForm.get("nbreCredit")) == null ? null : tmp_43_0.value, " ");
    \u0275\u0275advance(11);
    \u0275\u0275textInterpolate1("", (tmp_44_0 = ctx_r1.creditForm.get("statutActivite")) == null ? null : tmp_44_0.value, " ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate((tmp_45_0 = ctx_r1.creditForm.get("experience")) == null ? null : tmp_45_0.value);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate((tmp_46_0 = ctx_r1.creditForm.get("lieuxAct")) == null ? null : tmp_46_0.value);
    \u0275\u0275advance(5);
    \u0275\u0275property("value", ((tmp_47_0 = ctx_r1.creditForm.get("frequence")) == null ? null : tmp_47_0.value) + " fois");
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r1.produits.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.produits.length === 0);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r1.charges.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.charges.length === 0);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate((tmp_52_0 = ctx_r1.creditForm.get("garantieLibele")) == null ? null : tmp_52_0.value);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind4(244, 72, (tmp_53_0 = ctx_r1.creditForm.get("garantieMontant")) == null ? null : tmp_53_0.value, "GNF", "symbol", "1.0-0"), " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ((tmp_54_0 = ctx_r1.creditForm.get("itAss")) == null ? null : tmp_54_0.value) || ((tmp_54_0 = ctx_r1.creditForm.get("itPc")) == null ? null : tmp_54_0.value));
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r1.cautions.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.cautions.length === 0);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind4(257, 77, ctx_r1.calculateTotalProduits(), "GNF", "symbol", "1.0-0"), " ");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind4(264, 82, ctx_r1.calculateTotalCharges(), "GNF", "symbol", "1.0-0"), " ");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind4(271, 87, ctx_r1.calculateTotalProduits() - ctx_r1.calculateTotalCharges(), "GNF", "symbol", "1.0-0"), " ");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind4(278, 92, (tmp_60_0 = ctx_r1.creditForm.get("garantieMontant")) == null ? null : tmp_60_0.value, "GNF", "symbol", "1.0-0"), " ");
    \u0275\u0275advance(6);
    \u0275\u0275property("loading", ctx_r1.state().submitLoading)("disabled", !ctx_r1.isFormValid());
  }
}
var ProcessUpdateCreditComponent = class _ProcessUpdateCreditComponent {
  state = signal({
    loading: false,
    message: void 0,
    error: void 0,
    activeIndex: 0,
    submitLoading: false
  });
  // Forms
  creditForm;
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  activatedRouter = inject(ActivatedRoute);
  userService = inject(UserService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  fb = inject(FormBuilder);
  constructor() {
    this.creditForm = this.fb.group({
      numeroMembre: ["", Validators.required],
      referenceCredit: ["", Validators.required],
      cumulCredit: [0, [Validators.min(0)]],
      nbreCredit: [0, [Validators.min(0)]],
      moyenPerson: ["", Validators.required],
      bien: ["", Validators.required],
      capital: [0, [Validators.required, Validators.min(0)]],
      creance: [0, [Validators.min(0)]],
      dette: [0, [Validators.min(0)]],
      statutActivite: ["", Validators.required],
      experience: ["", Validators.required],
      lieuxAct: ["", Validators.required],
      personEmp: [""],
      lien: [""],
      nombre: [""],
      frequence: [0, [Validators.required, Validators.min(0)]],
      garantieLibele: ["", Validators.required],
      garantieMontant: [0, [Validators.required, Validators.min(0)]],
      itAss: [""],
      itPc: [""],
      produits: this.fb.array([]),
      charges: this.fb.array([]),
      cautions: this.fb.array([])
    });
  }
  ngOnInit() {
    this.loadCreditData();
  }
  loadCreditData() {
    this.activatedRouter.paramMap.pipe(switchMap((params) => {
      const referenceCredit = params.get("referenceCredit");
      if (referenceCredit) {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          loading: true,
          message: void 0,
          error: void 0,
          referenceCredit
        }));
        return this.userService.getCreditDataDetailed$(referenceCredit);
      } else {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          loading: false,
          message: void 0,
          error: "R\xE9f\xE9rence de cr\xE9dit invalide"
        }));
        return EMPTY;
      }
    }), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          creditDto: response.data.creditDto,
          creditData: response.data.creditData,
          produits: response.data.products,
          charges: response.data.charges,
          cautions: response.data.cautions,
          loading: false,
          message: response.message,
          error: void 0
        }));
        this.populateForm();
      },
      error: (error) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          loading: false,
          message: void 0,
          error
        }));
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: typeof error === "string" ? error : "Une erreur s'est produite lors du chargement des donn\xE9es"
        });
      }
    });
  }
  populateForm() {
    const { creditDto, creditData, produits, charges, cautions } = this.state();
    if (!creditData)
      return;
    this.creditForm.patchValue({
      numeroMembre: creditDto?.codeMembre || "",
      referenceCredit: creditData.referenceCredit || "",
      cumulCredit: creditData.cumulCredit || 0,
      nbreCredit: creditData.nbreCredit || 0,
      moyenPerson: creditData.moyenPerson || "",
      bien: creditData.bien || "",
      capital: creditData.capital || 0,
      creance: creditData.creance || 0,
      dette: creditData.dette || 0,
      statutActivite: creditData.statutActivite || "",
      experience: creditData.experience || "",
      lieuxAct: creditData.lieuxAct || "",
      personEmp: creditData.personEmp || "",
      lien: creditData.lien || "",
      nombre: creditData.nombre || "",
      frequence: creditData.frequenceValue || 0,
      garantieLibele: creditData.garantieLibele || "",
      garantieMontant: creditData.garantieMontant || 0,
      itAss: creditData.itAss || "",
      itPc: creditData.itPc || ""
    });
    if (creditData.individuelId) {
      this.state.update((state) => __spreadProps(__spreadValues({}, state), { individuelId: creditData.individuelId }));
    }
    this.populateProductsArray(produits || []);
    this.populateChargesArray(charges || []);
    this.populateCautionsArray(cautions || []);
  }
  populateProductsArray(produits) {
    const produitsArray = this.creditForm.get("produits");
    produitsArray.clear();
    if (produits.length === 0) {
      this.addProduit();
    } else {
      produits.forEach((produit) => {
        const produitGroup = this.fb.group({
          libele: [produit.libele || "", Validators.required],
          prixUnit: [produit.prix_unit || 0, [Validators.required, Validators.min(0)]],
          qte: [produit.qte || 0, [Validators.required, Validators.min(1)]],
          observation: [produit.observation || ""]
        });
        produitsArray.push(produitGroup);
      });
    }
  }
  populateChargesArray(charges) {
    const chargesArray = this.creditForm.get("charges");
    chargesArray.clear();
    if (charges.length === 0) {
      this.addCharge();
    } else {
      charges.forEach((charge) => {
        const chargeGroup = this.fb.group({
          libele: [charge.libele || "", Validators.required],
          prixUnit: [charge.prix_unit || 0, [Validators.required, Validators.min(0)]],
          qte: [charge.qte || 0, [Validators.required, Validators.min(1)]]
        });
        chargesArray.push(chargeGroup);
      });
    }
  }
  populateCautionsArray(cautions) {
    const cautionsArray = this.creditForm.get("cautions");
    cautionsArray.clear();
    if (cautions.length === 0) {
      this.addCaution();
    } else {
      cautions.forEach((caution) => {
        const cautionGroup = this.fb.group({
          nom: [caution.nom || "", Validators.required],
          prenom: [caution.prenom || "", Validators.required],
          telephone: [caution.telephone || "", Validators.required],
          activite: [caution.activite || "", Validators.required],
          age: [caution.age || 0, [Validators.required, Validators.min(18)]],
          profession: [caution.profession || "", Validators.required]
        });
        cautionsArray.push(cautionGroup);
      });
    }
  }
  // Méthodes identiques au composant d'insertion
  isFormValid() {
    if (this.creditForm.invalid) {
      return false;
    }
    for (let produit of this.produits.controls) {
      if (produit.get("libele")?.invalid || produit.get("prixUnit")?.invalid || produit.get("qte")?.invalid) {
        return false;
      }
    }
    for (let charge of this.charges.controls) {
      if (charge.get("libele")?.invalid || charge.get("prixUnit")?.invalid || charge.get("qte")?.invalid) {
        return false;
      }
    }
    for (let caution of this.cautions.controls) {
      if (caution.get("nom")?.invalid || caution.get("prenom")?.invalid || caution.get("telephone")?.invalid || caution.get("activite")?.invalid || caution.get("age")?.invalid || caution.get("profession")?.invalid) {
        return false;
      }
    }
    return true;
  }
  // Form array accessors
  get produits() {
    return this.creditForm.get("produits");
  }
  get charges() {
    return this.creditForm.get("charges");
  }
  get cautions() {
    return this.creditForm.get("cautions");
  }
  // Add new form groups
  addProduit() {
    const produitGroup = this.fb.group({
      libele: ["", Validators.required],
      prixUnit: [0, [Validators.required, Validators.min(0)]],
      qte: [0, [Validators.required, Validators.min(1)]],
      observation: [""]
    });
    this.produits.push(produitGroup);
  }
  addCharge() {
    const chargeGroup = this.fb.group({
      libele: ["", Validators.required],
      prixUnit: [0, [Validators.required, Validators.min(0)]],
      qte: [0, [Validators.required, Validators.min(1)]]
    });
    this.charges.push(chargeGroup);
  }
  addCaution() {
    const cautionGroup = this.fb.group({
      nom: ["", Validators.required],
      prenom: ["", Validators.required],
      telephone: ["", Validators.required],
      activite: ["", Validators.required],
      age: [0, [Validators.required, Validators.min(18)]],
      profession: ["", Validators.required]
    });
    this.cautions.push(cautionGroup);
  }
  // Remove form groups
  removeProduit(index) {
    this.produits.removeAt(index);
  }
  removeCharge(index) {
    this.charges.removeAt(index);
  }
  removeCaution(index) {
    this.cautions.removeAt(index);
  }
  // Tab handling
  onActiveIndexChange(event) {
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { activeIndex: event }));
  }
  nextStep() {
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { activeIndex: state.activeIndex + 1 }));
  }
  prevStep() {
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { activeIndex: state.activeIndex - 1 }));
  }
  // Méthode de mise à jour du crédit
  updateCreditData() {
    if (!this.isFormValid()) {
      this.messageService.add({
        severity: "error",
        summary: "Erreur",
        detail: "Veuillez remplir tous les champs obligatoires."
      });
      return;
    }
    const formValue = this.creditForm.value;
    const referenceCredit = this.state().referenceCredit;
    const individuelId = this.state().individuelId || 1;
    const creditProcessParams = {
      numeroMembre: formValue.numeroMembre,
      referenceCredit: formValue.referenceCredit,
      moyenPerson: formValue.moyenPerson,
      bien: formValue.bien,
      capital: formValue.capital,
      creance: formValue.creance,
      dette: formValue.dette,
      statutActivite: formValue.statutActivite,
      experience: formValue.experience,
      lieuxAct: formValue.lieuxAct,
      personEmp: formValue.personEmp,
      lien: formValue.lien,
      nombre: formValue.nombre,
      cumulCredit: formValue.cumulCredit,
      nbreCredit: formValue.nbreCredit,
      frequence: formValue.frequence,
      garantieLibele: formValue.garantieLibele,
      garantieMontant: formValue.garantieMontant,
      itAss: formValue.itAss,
      itPc: formValue.itPc,
      // Convertir les FormArrays en arrays plats pour le backend
      produitsLibele: formValue.produits.map((p) => p.libele),
      produitsPrixUnit: formValue.produits.map((p) => p.prixUnit),
      produitsQte: formValue.produits.map((p) => p.qte),
      produitsObservation: formValue.produits.map((p) => p.observation),
      chargesLibele: formValue.charges.map((c) => c.libele),
      chargesPrixUnit: formValue.charges.map((c) => c.prixUnit),
      chargesQte: formValue.charges.map((c) => c.qte),
      cautionsNom: formValue.cautions.map((c) => c.nom),
      cautionsPrenom: formValue.cautions.map((c) => c.prenom),
      cautionsTelephone: formValue.cautions.map((c) => c.telephone),
      cautionsActivite: formValue.cautions.map((c) => c.activite),
      cautionsAge: formValue.cautions.map((c) => c.age),
      cautionsProfession: formValue.cautions.map((c) => c.profession)
    };
    this.confirmationService.confirm({
      message: "\xCAtes-vous s\xFBr de vouloir mettre \xE0 jour ce cr\xE9dit?",
      header: "Confirmation de mise \xE0 jour",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { submitLoading: true }));
        this.userService.updateCreditDataPartial$(referenceCredit, individuelId, creditProcessParams).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.state.update((state) => __spreadProps(__spreadValues({}, state), { submitLoading: false })))).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: "success",
              summary: "Succ\xE8s",
              detail: response.message || "Cr\xE9dit mis \xE0 jour avec succ\xE8s"
            });
            setTimeout(() => {
              this.router.navigate(["/dashboards/home"]);
            }, 1500);
          },
          error: (error) => {
            this.messageService.add({
              severity: "error",
              summary: "Erreur",
              detail: typeof error === "string" ? error : "Une erreur s'est produite lors de la mise \xE0 jour du cr\xE9dit"
            });
          }
        });
      }
    });
  }
  // Calculate totals
  calculateTotalProduits() {
    let total = 0;
    if (this.produits && this.produits.length) {
      this.produits.controls.forEach((control) => {
        const prix = control.get("prixUnit")?.value || 0;
        const qte = control.get("qte")?.value || 0;
        total += prix * qte;
      });
    }
    return total;
  }
  calculateTotalCharges() {
    let total = 0;
    if (this.charges && this.charges.length) {
      this.charges.controls.forEach((control) => {
        const prix = control.get("prixUnit")?.value || 0;
        const qte = control.get("qte")?.value || 0;
        total += prix * qte;
      });
    }
    return total;
  }
  static \u0275fac = function ProcessUpdateCreditComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProcessUpdateCreditComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProcessUpdateCreditComponent, selectors: [["app-process-update-credit"]], features: [\u0275\u0275ProvidersFeature([MessageService, ConfirmationService])], decls: 5, vars: 5, consts: [[1, "surface-0", "p-4"], ["class", "flex justify-content-center align-items-center my-5", 4, "ngIf"], [4, "ngIf"], [1, "flex", "justify-content-center", "align-items-center", "my-5"], ["strokeWidth", "4"], [1, "ml-3", "text-600"], [1, "text-3xl", "font-medium", "text-900", "mb-4"], [1, "pi", "pi-pencil", "mr-2", "text-primary"], ["class", "text-lg text-500 block mt-1", 4, "ngIf"], ["class", "p-message p-message-error p-3 mb-4", 4, "ngIf"], [3, "activeIndexChange", "activeIndex"], ["header", "Informations g\xE9n\xE9rales"], [1, "grid", 3, "formGroup"], [1, "col-12", "md:col-6", "mb-4"], ["for", "cumulCredit", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "cumulCredit", "formControlName", "cumulCredit", "readonly", "", 1, "w-full", 3, "minFractionDigits", "maxFractionDigits"], ["for", "nbreCredit", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "nbreCredit", "formControlName", "nbreCredit", "readonly", "", 1, "w-full", 3, "showButtons", "min"], ["for", "numeroMembre", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "numeroMembre", "type", "text", "pInputText", "", "formControlName", "numeroMembre", "readonly", "", 1, "w-full"], ["for", "referenceCredit", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "referenceCredit", "type", "text", "pInputText", "", "formControlName", "referenceCredit", "readonly", "", 1, "w-full"], ["for", "moyenPerson", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "moyenPerson", "type", "text", "pInputText", "", "formControlName", "moyenPerson", 1, "w-full"], ["class", "p-error", 4, "ngIf"], ["for", "bien", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "bien", "type", "text", "pInputText", "", "formControlName", "bien", 1, "w-full"], ["for", "capital", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "capital", "formControlName", "capital", 1, "w-full", 3, "minFractionDigits", "maxFractionDigits"], ["for", "creance", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "creance", "formControlName", "creance", 1, "w-full", 3, "minFractionDigits", "maxFractionDigits"], ["for", "dette", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "dette", "formControlName", "dette", 1, "w-full", 3, "minFractionDigits", "maxFractionDigits"], ["for", "statutActivite", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "statutActivite", "type", "text", "pInputText", "", "formControlName", "statutActivite", 1, "w-full"], ["for", "experience", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "experience", "type", "text", "pInputText", "", "formControlName", "experience", 1, "w-full"], ["for", "lieuxAct", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "lieuxAct", "type", "text", "pInputText", "", "formControlName", "lieuxAct", 1, "w-full"], [1, "col-12", "mb-4", "text-right"], ["label", "Suivant", "icon", "pi pi-arrow-right", "iconPos", "right", 3, "click"], ["header", "Informations additionnelles"], ["for", "personEmp", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "personEmp", "type", "text", "pInputText", "", "formControlName", "personEmp", 1, "w-full"], ["for", "lien", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "lien", "type", "text", "pInputText", "", "formControlName", "lien", 1, "w-full"], ["for", "nombre", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "nombre", "type", "text", "pInputText", "", "formControlName", "nombre", 1, "w-full"], ["for", "frequence", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "frequence", "formControlName", "frequence", 1, "w-full", 3, "showButtons", "min"], [1, "col-12", "flex", "gap-3", "justify-content-center", "mt-4"], ["label", "Pr\xE9c\xE9dent", "icon", "pi pi-arrow-left", 3, "click"], ["header", "Produits"], [3, "formGroup"], ["formArrayName", "produits"], ["class", "mb-4", 4, "ngFor", "ngForOf"], [1, "mb-4", "text-right"], ["label", "Ajouter un produit", "icon", "pi pi-plus", 3, "click"], [1, "flex", "gap-3", "justify-content-center", "mt-4"], ["header", "Charges"], ["formArrayName", "charges"], ["label", "Ajouter une charge", "icon", "pi pi-plus", 3, "click"], ["header", "Garantie"], [1, "col-12"], [1, "text-lg", "font-medium", "mb-3"], [1, "grid"], ["for", "garantieLibele", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "garantieLibele", "type", "text", "pInputText", "", "formControlName", "garantieLibele", 1, "w-full"], ["for", "garantieMontant", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "garantieMontant", "formControlName", "garantieMontant", 1, "w-full", 3, "minFractionDigits", "maxFractionDigits"], [1, "text-lg", "font-medium", "mb-3", "mt-3"], ["for", "itAss", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "itAss", "type", "text", "pInputText", "", "formControlName", "itAss", 1, "w-full"], ["for", "itPc", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "itPc", "type", "text", "pInputText", "", "formControlName", "itPc", 1, "w-full"], [1, "text-lg", "font-medium", "mb-3", "mt-4"], ["formArrayName", "cautions"], ["label", "Ajouter une caution", "icon", "pi pi-plus", 3, "click"], ["header", "R\xE9sum\xE9 et validation"], [1, "surface-0"], [1, "border-bottom-1", "surface-border", "p-4", "mb-4"], [1, "flex", "align-items-center", "justify-content-between"], [1, "text-2xl", "font-bold", "text-900", "m-0", "mb-2"], [1, "text-600", "m-0"], [1, "flex", "align-items-center", "gap-2"], [1, "pi", "pi-check-circle", "text-orange-500", "text-2xl"], [1, "text-orange-600", "font-medium"], [1, "mb-4"], ["pTemplate", "header"], [1, "col-12", "md:col-6"], [1, "bg-gray-50", "border-round", "p-3", "mb-3"], [1, "flex", "align-items-center", "justify-content-between", "mb-2"], [1, "text-500", "text-sm", "font-medium"], ["severity", "info", 3, "value"], [1, "text-900", "font-bold", "text-lg"], ["pTooltip", "Copier la r\xE9f\xE9rence", 1, "pi", "pi-copy", "text-400", "cursor-pointer"], [1, "col-12", "md:col-4"], [1, "text-center", "p-3", "border-1", "surface-border", "border-round"], [1, "text-blue-600", "font-bold", "text-2xl", "mb-2"], [1, "text-500", "text-sm"], [1, "text-green-600", "font-bold", "text-2xl", "mb-2"], [1, "text-orange-600", "font-bold", "text-2xl", "mb-2"], [1, "p-3"], [1, "text-500", "text-sm", "mb-1"], [1, "text-900", "font-semibold"], ["severity", "warn", 3, "value"], ["class", "grid", 4, "ngIf"], ["class", "text-center p-4", 4, "ngIf"], [1, "col-12", "md:col-8"], [1, "text-500", "text-sm", "mb-2"], [1, "text-900", "font-bold", "text-lg", "mb-3"], [1, "text-teal-600", "font-bold", "text-xl"], ["class", "col-12 md:col-4", 4, "ngIf"], [1, "col-12", "md:col-3"], [1, "text-center", "p-3", "bg-green-50", "border-round"], [1, "text-green-600", "font-bold", "text-xl", "mb-1"], [1, "text-green-700", "text-sm"], [1, "text-center", "p-3", "bg-red-50", "border-round"], [1, "text-red-600", "font-bold", "text-xl", "mb-1"], [1, "text-red-700", "text-sm"], [1, "text-center", "p-3", "bg-blue-50", "border-round"], [1, "text-blue-600", "font-bold", "text-xl", "mb-1"], [1, "text-blue-700", "text-sm"], [1, "text-center", "p-3", "bg-teal-50", "border-round"], [1, "text-teal-600", "font-bold", "text-xl", "mb-1"], [1, "text-teal-700", "text-sm"], [1, "flex", "gap-3", "justify-content-center", "pt-4", "border-top-1", "surface-border"], ["label", "Pr\xE9c\xE9dent", "icon", "pi pi-arrow-left", "severity", "secondary", "size", "large", 3, "click"], ["label", "Mettre \xE0 Jour le Cr\xE9dit", "icon", "pi pi-save", "severity", "warn", "size", "large", "styleClass", "px-5", 3, "click", "loading", "disabled"], [1, "text-lg", "text-500", "block", "mt-1"], [1, "p-message", "p-message-error", "p-3", "mb-4"], [1, "p-error"], [1, "grid", 3, "formGroupName"], [1, "col-12", "md:col-6", "mb-3"], [1, "block", "text-900", "font-medium", "mb-2", 3, "for"], ["type", "text", "pInputText", "", "formControlName", "libele", 1, "w-full", 3, "id"], ["formControlName", "prixUnit", 1, "w-full", 3, "id", "minFractionDigits", "maxFractionDigits"], ["formControlName", "qte", 1, "w-full", 3, "id", "showButtons", "min"], ["type", "text", "pInputText", "", "formControlName", "observation", 1, "w-full", 3, "id"], [1, "col-12", "text-right"], ["icon", "pi pi-trash", "severity", "danger", 3, "click", 4, "ngIf"], ["icon", "pi pi-trash", "severity", "danger", 3, "click"], [1, "col-12", "md:col-4", "mb-3"], ["type", "text", "pInputText", "", "formControlName", "nom", 1, "w-full", 3, "id"], ["type", "text", "pInputText", "", "formControlName", "prenom", 1, "w-full", 3, "id"], ["type", "text", "pInputText", "", "formControlName", "telephone", 1, "w-full", 3, "id"], ["type", "text", "pInputText", "", "formControlName", "activite", 1, "w-full", 3, "id"], ["formControlName", "age", 1, "w-full", 3, "id", "showButtons", "min"], ["type", "text", "pInputText", "", "formControlName", "profession", 1, "w-full", 3, "id"], [1, "flex", "align-items-center", "gap-2", "p-3", "bg-blue-50", "border-round-top"], [1, "pi", "pi-user", "text-blue-600"], [1, "text-lg", "font-semibold", "text-blue-900", "m-0"], [1, "flex", "align-items-center", "gap-2", "p-3", "bg-green-50", "border-round-top"], [1, "pi", "pi-briefcase", "text-green-600"], [1, "text-lg", "font-semibold", "text-green-900", "m-0"], [1, "flex", "align-items-center", "justify-content-between", "p-3", "bg-purple-50", "border-round-top"], [1, "pi", "pi-shopping-cart", "text-purple-600"], [1, "text-lg", "font-semibold", "text-purple-900", "m-0"], ["severity", "success", 3, "value"], ["class", "col-12 md:col-6 lg:col-4", 4, "ngFor", "ngForOf"], [1, "col-12", "md:col-6", "lg:col-4"], [1, "border-1", "surface-border", "border-round", "p-3", "h-full"], [1, "flex", "align-items-start", "justify-content-between", "mb-2"], [1, "text-900", "font-semibold", "m-0", "text-sm"], [1, "text-xs", "text-500"], [1, "text-600", "text-xs", "mb-2"], [1, "text-900", "font-bold"], [1, "text-500", "text-xs"], [1, "text-center", "p-4"], [1, "pi", "pi-info-circle", "text-400", "text-4xl", "mb-3"], [1, "text-500"], [1, "flex", "align-items-center", "justify-content-between", "p-3", "bg-red-50", "border-round-top"], [1, "pi", "pi-minus-circle", "text-red-600"], [1, "text-lg", "font-semibold", "text-red-900", "m-0"], ["severity", "danger", 3, "value"], [1, "flex", "align-items-center", "gap-2", "p-3", "bg-teal-50", "border-round-top"], [1, "pi", "pi-shield", "text-teal-600"], [1, "text-lg", "font-semibold", "text-teal-900", "m-0"], ["class", "text-900 text-sm mb-1", 4, "ngIf"], ["class", "text-900 text-sm", 4, "ngIf"], [1, "text-900", "text-sm", "mb-1"], [1, "text-900", "text-sm"], [1, "flex", "align-items-center", "gap-2", "p-3", "bg-indigo-50", "border-round-top"], [1, "pi", "pi-users", "text-indigo-600"], [1, "text-lg", "font-semibold", "text-indigo-900", "m-0"], [1, "flex", "align-items-center", "gap-3", "mb-3"], ["shape", "circle", "size", "large", "styleClass", "bg-indigo-100 text-indigo-900", 3, "label"], [1, "text-600", "text-sm", "mb-1"], [1, "text-primary", "font-medium", "text-sm"], [1, "flex", "align-items-center", "gap-2", "p-3", "bg-yellow-50", "border-round-top"], [1, "pi", "pi-calculator", "text-yellow-600"], [1, "text-lg", "font-semibold", "text-yellow-900", "m-0"]], template: function ProcessUpdateCreditComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "p-toast")(1, "p-confirmDialog");
      \u0275\u0275elementStart(2, "div", 0);
      \u0275\u0275template(3, ProcessUpdateCreditComponent_div_3_Template, 4, 3, "div", 1)(4, ProcessUpdateCreditComponent_div_4_Template, 284, 97, "div", 2);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(4, _c0));
      \u0275\u0275advance(2);
      \u0275\u0275property("ngIf", ctx.state().loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.state().loading);
    }
  }, dependencies: [CommonModule, NgForOf, NgIf, CurrencyPipe, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, ReactiveFormsModule, FormGroupDirective, FormControlName, FormGroupName, FormArrayName, ButtonModule, Button, PrimeTemplate, InputTextModule, InputText, InputNumberModule, InputNumber, CardModule, Card, TabViewModule, TabView, TabPanel, ToastModule, Toast, ConfirmDialogModule, ConfirmDialog, ProgressSpinnerModule, ProgressSpinner, AvatarModule, Avatar, TagModule, Tag], styles: ['\n\n.process-update-credit[_ngcontent-%COMP%]   .loading-indicator[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 200px;\n}\n.process-update-credit[_ngcontent-%COMP%]   .loading-indicator[_ngcontent-%COMP%]   .loading-text[_ngcontent-%COMP%] {\n  margin-left: 1rem;\n  color: var(--text-color-secondary);\n  font-weight: 500;\n}\n.process-update-credit[_ngcontent-%COMP%]   .credit-header[_ngcontent-%COMP%]   .reference-display[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  color: var(--text-color-secondary);\n  margin-top: 0.25rem;\n  font-weight: normal;\n}\n.process-update-credit[_ngcontent-%COMP%]   .form-section[_ngcontent-%COMP%]   .form-grid[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%] {\n  margin-bottom: 1.5rem;\n}\n.process-update-credit[_ngcontent-%COMP%]   .form-section[_ngcontent-%COMP%]   .form-grid[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  margin-bottom: 0.5rem;\n  font-weight: 600;\n  color: var(--text-color);\n}\n.process-update-credit[_ngcontent-%COMP%]   .form-section[_ngcontent-%COMP%]   .form-grid[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%]   label.required[_ngcontent-%COMP%]::after {\n  content: " *";\n  color: var(--red-500);\n}\n.process-update-credit[_ngcontent-%COMP%]   .form-section[_ngcontent-%COMP%]   .form-grid[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%]   .field-error[_ngcontent-%COMP%] {\n  color: var(--red-500);\n  font-size: 0.75rem;\n  margin-top: 0.25rem;\n}\n.process-update-credit[_ngcontent-%COMP%]   .summary-section[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%] {\n  background: var(--surface-50);\n  border-radius: 6px;\n  padding: 1rem;\n  margin-bottom: 1rem;\n}\n.process-update-credit[_ngcontent-%COMP%]   .summary-section[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%]   .info-label[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  font-weight: 600;\n  text-transform: uppercase;\n  color: var(--text-color-secondary);\n  margin-bottom: 0.5rem;\n}\n.process-update-credit[_ngcontent-%COMP%]   .summary-section[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%]   .info-value[_ngcontent-%COMP%] {\n  font-size: 1.125rem;\n  font-weight: 700;\n  color: var(--text-color);\n}\n.process-update-credit[_ngcontent-%COMP%]   .summary-section[_ngcontent-%COMP%]   .financial-summary[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 1rem;\n  border-radius: 6px;\n  border: 1px solid var(--surface-border);\n}\n.process-update-credit[_ngcontent-%COMP%]   .summary-section[_ngcontent-%COMP%]   .financial-summary[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-value[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  font-weight: 700;\n  margin-bottom: 0.25rem;\n}\n.process-update-credit[_ngcontent-%COMP%]   .summary-section[_ngcontent-%COMP%]   .financial-summary[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-label[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  font-weight: 500;\n}\n.process-update-credit[_ngcontent-%COMP%]   .summary-section[_ngcontent-%COMP%]   .financial-summary[_ngcontent-%COMP%]   .metric-card.positive[_ngcontent-%COMP%] {\n  background: var(--green-50);\n}\n.process-update-credit[_ngcontent-%COMP%]   .summary-section[_ngcontent-%COMP%]   .financial-summary[_ngcontent-%COMP%]   .metric-card.positive[_ngcontent-%COMP%]   .metric-value[_ngcontent-%COMP%] {\n  color: var(--green-600);\n}\n.process-update-credit[_ngcontent-%COMP%]   .summary-section[_ngcontent-%COMP%]   .financial-summary[_ngcontent-%COMP%]   .metric-card.positive[_ngcontent-%COMP%]   .metric-label[_ngcontent-%COMP%] {\n  color: var(--green-700);\n}\n.process-update-credit[_ngcontent-%COMP%]   .summary-section[_ngcontent-%COMP%]   .financial-summary[_ngcontent-%COMP%]   .metric-card.negative[_ngcontent-%COMP%] {\n  background: var(--red-50);\n}\n.process-update-credit[_ngcontent-%COMP%]   .summary-section[_ngcontent-%COMP%]   .financial-summary[_ngcontent-%COMP%]   .metric-card.negative[_ngcontent-%COMP%]   .metric-value[_ngcontent-%COMP%] {\n  color: var(--red-600);\n}\n.process-update-credit[_ngcontent-%COMP%]   .summary-section[_ngcontent-%COMP%]   .financial-summary[_ngcontent-%COMP%]   .metric-card.negative[_ngcontent-%COMP%]   .metric-label[_ngcontent-%COMP%] {\n  color: var(--red-700);\n}\n.process-update-credit[_ngcontent-%COMP%]   .summary-section[_ngcontent-%COMP%]   .financial-summary[_ngcontent-%COMP%]   .metric-card.neutral[_ngcontent-%COMP%] {\n  background: var(--blue-50);\n}\n.process-update-credit[_ngcontent-%COMP%]   .summary-section[_ngcontent-%COMP%]   .financial-summary[_ngcontent-%COMP%]   .metric-card.neutral[_ngcontent-%COMP%]   .metric-value[_ngcontent-%COMP%] {\n  color: var(--blue-600);\n}\n.process-update-credit[_ngcontent-%COMP%]   .summary-section[_ngcontent-%COMP%]   .financial-summary[_ngcontent-%COMP%]   .metric-card.neutral[_ngcontent-%COMP%]   .metric-label[_ngcontent-%COMP%] {\n  color: var(--blue-700);\n}\n.process-update-credit[_ngcontent-%COMP%]   .summary-section[_ngcontent-%COMP%]   .financial-summary[_ngcontent-%COMP%]   .metric-card.warning[_ngcontent-%COMP%] {\n  background: var(--yellow-50);\n}\n.process-update-credit[_ngcontent-%COMP%]   .summary-section[_ngcontent-%COMP%]   .financial-summary[_ngcontent-%COMP%]   .metric-card.warning[_ngcontent-%COMP%]   .metric-value[_ngcontent-%COMP%] {\n  color: var(--yellow-600);\n}\n.process-update-credit[_ngcontent-%COMP%]   .summary-section[_ngcontent-%COMP%]   .financial-summary[_ngcontent-%COMP%]   .metric-card.warning[_ngcontent-%COMP%]   .metric-label[_ngcontent-%COMP%] {\n  color: var(--yellow-700);\n}\n.process-update-credit[_ngcontent-%COMP%]   .item-cards[_ngcontent-%COMP%]   .item-card[_ngcontent-%COMP%] {\n  border: 1px solid var(--surface-border);\n  border-radius: 6px;\n  padding: 1rem;\n  height: 100%;\n}\n.process-update-credit[_ngcontent-%COMP%]   .item-cards[_ngcontent-%COMP%]   .item-card[_ngcontent-%COMP%]   .item-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  margin-bottom: 0.5rem;\n}\n.process-update-credit[_ngcontent-%COMP%]   .item-cards[_ngcontent-%COMP%]   .item-card[_ngcontent-%COMP%]   .item-header[_ngcontent-%COMP%]   .item-title[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: var(--text-color);\n  margin: 0;\n  font-size: 0.875rem;\n}\n.process-update-credit[_ngcontent-%COMP%]   .item-cards[_ngcontent-%COMP%]   .item-card[_ngcontent-%COMP%]   .item-header[_ngcontent-%COMP%]   .item-index[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: var(--text-color-secondary);\n}\n.process-update-credit[_ngcontent-%COMP%]   .item-cards[_ngcontent-%COMP%]   .item-card[_ngcontent-%COMP%]   .item-description[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: var(--text-color-secondary);\n  margin-bottom: 0.5rem;\n}\n.process-update-credit[_ngcontent-%COMP%]   .item-cards[_ngcontent-%COMP%]   .item-card[_ngcontent-%COMP%]   .item-footer[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n.process-update-credit[_ngcontent-%COMP%]   .item-cards[_ngcontent-%COMP%]   .item-card[_ngcontent-%COMP%]   .item-footer[_ngcontent-%COMP%]   .item-total[_ngcontent-%COMP%] {\n  font-weight: 700;\n  color: var(--text-color);\n}\n.process-update-credit[_ngcontent-%COMP%]   .item-cards[_ngcontent-%COMP%]   .item-card[_ngcontent-%COMP%]   .item-footer[_ngcontent-%COMP%]   .item-details[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: var(--text-color-secondary);\n}\n.process-update-credit[_ngcontent-%COMP%]   .person-cards[_ngcontent-%COMP%]   .person-card[_ngcontent-%COMP%] {\n  border: 1px solid var(--surface-border);\n  border-radius: 6px;\n  padding: 1rem;\n  height: 100%;\n}\n.process-update-credit[_ngcontent-%COMP%]   .person-cards[_ngcontent-%COMP%]   .person-card[_ngcontent-%COMP%]   .person-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  margin-bottom: 0.75rem;\n}\n.process-update-credit[_ngcontent-%COMP%]   .person-cards[_ngcontent-%COMP%]   .person-card[_ngcontent-%COMP%]   .person-header[_ngcontent-%COMP%]   .person-name[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: var(--text-color);\n}\n.process-update-credit[_ngcontent-%COMP%]   .person-cards[_ngcontent-%COMP%]   .person-card[_ngcontent-%COMP%]   .person-header[_ngcontent-%COMP%]   .person-age[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: var(--text-color-secondary);\n}\n.process-update-credit[_ngcontent-%COMP%]   .person-cards[_ngcontent-%COMP%]   .person-card[_ngcontent-%COMP%]   .person-details[_ngcontent-%COMP%]   .person-profession[_ngcontent-%COMP%], \n.process-update-credit[_ngcontent-%COMP%]   .person-cards[_ngcontent-%COMP%]   .person-card[_ngcontent-%COMP%]   .person-details[_ngcontent-%COMP%]   .person-activity[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  color: var(--text-color-secondary);\n  margin-bottom: 0.25rem;\n}\n.process-update-credit[_ngcontent-%COMP%]   .person-cards[_ngcontent-%COMP%]   .person-card[_ngcontent-%COMP%]   .person-details[_ngcontent-%COMP%]   .person-phone[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: var(--primary-color);\n}\n.process-update-credit[_ngcontent-%COMP%]   .action-buttons[_ngcontent-%COMP%] {\n  border-top: 1px solid var(--surface-border);\n  padding-top: 1.5rem;\n  display: flex;\n  gap: 1rem;\n  justify-content: center;\n}\n.process-update-credit[_ngcontent-%COMP%]   .action-buttons[_ngcontent-%COMP%]   .btn-update[_ngcontent-%COMP%] {\n  padding-left: 2rem;\n  padding-right: 2rem;\n}\n.process-update-credit[_ngcontent-%COMP%]   .tab-navigation[_ngcontent-%COMP%]   .tab-buttons[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.75rem;\n  justify-content: center;\n  margin-top: 1.5rem;\n}\n@media (max-width: 768px) {\n  .process-update-credit[_ngcontent-%COMP%]   .form-section[_ngcontent-%COMP%]   .form-grid[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%] {\n    margin-bottom: 1rem;\n  }\n  .process-update-credit[_ngcontent-%COMP%]   .summary-section[_ngcontent-%COMP%]   .financial-summary[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%] {\n    margin-bottom: 1rem;\n  }\n  .process-update-credit[_ngcontent-%COMP%]   .action-buttons[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: stretch;\n  }\n  .process-update-credit[_ngcontent-%COMP%]   .action-buttons[_ngcontent-%COMP%]   .btn-update[_ngcontent-%COMP%] {\n    padding-left: 1rem;\n    padding-right: 1rem;\n  }\n}\n.fade-in[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_fadeIn 0.3s ease-in;\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.ng-invalid.ng-touched[_ngcontent-%COMP%] {\n  border-color: var(--red-500) !important;\n  box-shadow: 0 0 0 0.2rem rgba(239, 68, 68, 0.25) !important;\n}\n.ng-valid.ng-touched[_ngcontent-%COMP%] {\n  border-color: var(--green-500) !important;\n  box-shadow: 0 0 0 0.2rem rgba(34, 197, 94, 0.25) !important;\n}\n.p-error[_ngcontent-%COMP%] {\n  color: var(--red-500);\n  font-size: 0.75rem;\n  margin-top: 0.25rem;\n  display: block;\n}\n.p-card[_ngcontent-%COMP%] {\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n  border: 1px solid var(--surface-border);\n}\n.p-card[_ngcontent-%COMP%]:hover {\n  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);\n  transition: box-shadow 0.2s ease;\n}\n/*# sourceMappingURL=process-update-credit.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProcessUpdateCreditComponent, { className: "ProcessUpdateCreditComponent", filePath: "src/app/pages/dashboard/agent-credit/process-update-credit/process-update-credit.component.ts", lineNumber: 30 });
})();
export {
  ProcessUpdateCreditComponent
};
//# sourceMappingURL=chunk-WKI6D5FS.js.map
