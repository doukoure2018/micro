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

// src/app/pages/dashboard/agent-credit/process-credit/process-credit.component.ts
var _c0 = () => ({ width: "450px" });
var _c1 = () => ({ width: "50px", height: "50px" });
function ProcessCreditComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3);
    \u0275\u0275element(1, "p-progressSpinner", 4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(2, _c1));
  }
}
function ProcessCreditComponent_div_4_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 126);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.state().error, " ");
  }
}
function ProcessCreditComponent_div_4_small_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 127);
    \u0275\u0275text(1, "Ce champ est requis");
    \u0275\u0275elementEnd();
  }
}
function ProcessCreditComponent_div_4_small_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 127);
    \u0275\u0275text(1, "Ce champ est requis");
    \u0275\u0275elementEnd();
  }
}
function ProcessCreditComponent_div_4_small_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 127);
    \u0275\u0275text(1, "Ce champ est requis et doit \xEAtre sup\xE9rieur \xE0 0");
    \u0275\u0275elementEnd();
  }
}
function ProcessCreditComponent_div_4_small_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 127);
    \u0275\u0275text(1, "La valeur doit \xEAtre sup\xE9rieure ou \xE9gale \xE0 0");
    \u0275\u0275elementEnd();
  }
}
function ProcessCreditComponent_div_4_small_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 127);
    \u0275\u0275text(1, "La valeur doit \xEAtre sup\xE9rieure ou \xE9gale \xE0 0");
    \u0275\u0275elementEnd();
  }
}
function ProcessCreditComponent_div_4_small_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 127);
    \u0275\u0275text(1, "Ce champ est requis");
    \u0275\u0275elementEnd();
  }
}
function ProcessCreditComponent_div_4_small_57_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 127);
    \u0275\u0275text(1, "Ce champ est requis");
    \u0275\u0275elementEnd();
  }
}
function ProcessCreditComponent_div_4_small_62_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 127);
    \u0275\u0275text(1, "Ce champ est requis");
    \u0275\u0275elementEnd();
  }
}
function ProcessCreditComponent_div_4_small_83_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 127);
    \u0275\u0275text(1, "Ce champ est requis et doit \xEAtre sup\xE9rieur \xE0 0");
    \u0275\u0275elementEnd();
  }
}
function ProcessCreditComponent_div_4_p_card_90_p_button_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 137);
    \u0275\u0275listener("click", function ProcessCreditComponent_div_4_p_card_90_p_button_19_Template_p_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const i_r4 = \u0275\u0275nextContext().index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.removeProduit(i_r4));
    });
    \u0275\u0275elementEnd();
  }
}
function ProcessCreditComponent_div_4_p_card_90_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-card", 84)(1, "div", 128)(2, "div", 129)(3, "label", 130);
    \u0275\u0275text(4, "Libell\xE9*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "input", 131);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 129)(7, "label", 130);
    \u0275\u0275text(8, "Prix unitaire*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(9, "p-inputNumber", 132);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 129)(11, "label", 130);
    \u0275\u0275text(12, "Quantit\xE9*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(13, "p-inputNumber", 133);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div", 129)(15, "label", 130);
    \u0275\u0275text(16, "Observation");
    \u0275\u0275elementEnd();
    \u0275\u0275element(17, "input", 134);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "div", 135);
    \u0275\u0275template(19, ProcessCreditComponent_div_4_p_card_90_p_button_19_Template, 1, 0, "p-button", 136);
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
function ProcessCreditComponent_div_4_p_card_99_p_button_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 137);
    \u0275\u0275listener("click", function ProcessCreditComponent_div_4_p_card_99_p_button_15_Template_p_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const i_r6 = \u0275\u0275nextContext().index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.removeCharge(i_r6));
    });
    \u0275\u0275elementEnd();
  }
}
function ProcessCreditComponent_div_4_p_card_99_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-card", 84)(1, "div", 128)(2, "div", 138)(3, "label", 130);
    \u0275\u0275text(4, "Libell\xE9*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "input", 131);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 138)(7, "label", 130);
    \u0275\u0275text(8, "Prix unitaire*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(9, "p-inputNumber", 132);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 138)(11, "label", 130);
    \u0275\u0275text(12, "Quantit\xE9*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(13, "p-inputNumber", 133);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div", 135);
    \u0275\u0275template(15, ProcessCreditComponent_div_4_p_card_99_p_button_15_Template, 1, 0, "p-button", 136);
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
function ProcessCreditComponent_div_4_small_115_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 127);
    \u0275\u0275text(1, "Ce champ est requis");
    \u0275\u0275elementEnd();
  }
}
function ProcessCreditComponent_div_4_small_120_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 127);
    \u0275\u0275text(1, "Ce champ est requis et doit \xEAtre sup\xE9rieur \xE0 0");
    \u0275\u0275elementEnd();
  }
}
function ProcessCreditComponent_div_4_p_card_137_p_button_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 137);
    \u0275\u0275listener("click", function ProcessCreditComponent_div_4_p_card_137_p_button_27_Template_p_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const i_r8 = \u0275\u0275nextContext().index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.removeCaution(i_r8));
    });
    \u0275\u0275elementEnd();
  }
}
function ProcessCreditComponent_div_4_p_card_137_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-card", 84)(1, "div", 128)(2, "div", 129)(3, "label", 130);
    \u0275\u0275text(4, "Nom*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "input", 139);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 129)(7, "label", 130);
    \u0275\u0275text(8, "Pr\xE9nom*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(9, "input", 140);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 129)(11, "label", 130);
    \u0275\u0275text(12, "T\xE9l\xE9phone*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(13, "input", 141);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div", 129)(15, "label", 130);
    \u0275\u0275text(16, "Activit\xE9*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(17, "input", 142);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "div", 129)(19, "label", 130);
    \u0275\u0275text(20, "\xC2ge*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(21, "p-inputNumber", 143);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "div", 129)(23, "label", 130);
    \u0275\u0275text(24, "Profession*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(25, "input", 144);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "div", 135);
    \u0275\u0275template(27, ProcessCreditComponent_div_4_p_card_137_p_button_27_Template, 1, 0, "p-button", 136);
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
function ProcessCreditComponent_div_4_ng_template_157_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 145);
    \u0275\u0275element(1, "i", 146);
    \u0275\u0275elementStart(2, "h3", 147);
    \u0275\u0275text(3, "Informations Principales");
    \u0275\u0275elementEnd()();
  }
}
function ProcessCreditComponent_div_4_ng_template_196_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 148);
    \u0275\u0275element(1, "i", 149);
    \u0275\u0275elementStart(2, "h3", 150);
    \u0275\u0275text(3, "Activit\xE9 & Exp\xE9rience");
    \u0275\u0275elementEnd()();
  }
}
function ProcessCreditComponent_div_4_ng_template_222_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 151)(1, "div", 81);
    \u0275\u0275element(2, "i", 152);
    \u0275\u0275elementStart(3, "h3", 153);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(5, "p-tag", 154);
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
function ProcessCreditComponent_div_4_div_223_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 156)(1, "div", 157)(2, "div", 158)(3, "h4", 159);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 160);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 161);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 78)(10, "div", 162);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 163);
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
    \u0275\u0275textInterpolate1(" ", ((tmp_7_0 = produit_r9.get("observation")) == null ? null : tmp_7_0.value) || "Aucuneobservation", " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind4(12, 6, ((tmp_8_0 = produit_r9.get("prixUnit")) == null ? null : tmp_8_0.value) * ((tmp_8_0 = produit_r9.get("qte")) == null ? null : tmp_8_0.value), "GNF", "symbol", "1.0-0"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", (tmp_9_0 = produit_r9.get("qte")) == null ? null : tmp_9_0.value, " \xD7 ", \u0275\u0275pipeBind4(15, 11, (tmp_9_0 = produit_r9.get("prixUnit")) == null ? null : tmp_9_0.value, "GNF", "symbol", "1.0-0"), " ");
  }
}
function ProcessCreditComponent_div_4_div_223_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 62);
    \u0275\u0275template(1, ProcessCreditComponent_div_4_div_223_div_1_Template, 16, 16, "div", 155);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.produits.controls);
  }
}
function ProcessCreditComponent_div_4_div_224_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 164);
    \u0275\u0275element(1, "i", 165);
    \u0275\u0275elementStart(2, "p", 166);
    \u0275\u0275text(3, "Aucun produit ajout\xE9");
    \u0275\u0275elementEnd()();
  }
}
function ProcessCreditComponent_div_4_ng_template_226_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 167)(1, "div", 81);
    \u0275\u0275element(2, "i", 168);
    \u0275\u0275elementStart(3, "h3", 169);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(5, "p-tag", 170);
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
function ProcessCreditComponent_div_4_div_227_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 156)(1, "div", 157)(2, "div", 158)(3, "h4", 159);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 160);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 78)(8, "div", 162);
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 163);
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
function ProcessCreditComponent_div_4_div_227_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 62);
    \u0275\u0275template(1, ProcessCreditComponent_div_4_div_227_div_1_Template, 14, 15, "div", 155);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.charges.controls);
  }
}
function ProcessCreditComponent_div_4_div_228_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 164);
    \u0275\u0275element(1, "i", 165);
    \u0275\u0275elementStart(2, "p", 166);
    \u0275\u0275text(3, "Aucune charge ajout\xE9e");
    \u0275\u0275elementEnd()();
  }
}
function ProcessCreditComponent_div_4_ng_template_230_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 171);
    \u0275\u0275element(1, "i", 172);
    \u0275\u0275elementStart(2, "h3", 173);
    \u0275\u0275text(3, "Garantie");
    \u0275\u0275elementEnd()();
  }
}
function ProcessCreditComponent_div_4_div_243_div_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 176)(1, "strong");
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
function ProcessCreditComponent_div_4_div_243_div_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 177)(1, "strong");
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
function ProcessCreditComponent_div_4_div_243_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 93)(1, "div", 99)(2, "div", 106);
    \u0275\u0275text(3, "Localisation");
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, ProcessCreditComponent_div_4_div_243_div_4_Template, 4, 1, "div", 174)(5, ProcessCreditComponent_div_4_div_243_div_5_Template, 4, 1, "div", 175);
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
function ProcessCreditComponent_div_4_ng_template_245_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 178);
    \u0275\u0275element(1, "i", 179);
    \u0275\u0275elementStart(2, "h3", 180);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Personnes Caution (", ctx_r1.cautions.length, ")");
  }
}
function ProcessCreditComponent_div_4_div_246_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 156)(1, "div", 157)(2, "div", 181);
    \u0275\u0275element(3, "p-avatar", 182);
    \u0275\u0275elementStart(4, "div")(5, "div", 101);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 163);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 183);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 183);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 184);
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
function ProcessCreditComponent_div_4_div_246_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 62);
    \u0275\u0275template(1, ProcessCreditComponent_div_4_div_246_div_1_Template, 15, 7, "div", 155);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.cautions.controls);
  }
}
function ProcessCreditComponent_div_4_div_247_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 164);
    \u0275\u0275element(1, "i", 165);
    \u0275\u0275elementStart(2, "p", 166);
    \u0275\u0275text(3, "Aucune caution ajout\xE9e");
    \u0275\u0275elementEnd()();
  }
}
function ProcessCreditComponent_div_4_ng_template_249_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 185);
    \u0275\u0275element(1, "i", 186);
    \u0275\u0275elementStart(2, "h3", 187);
    \u0275\u0275text(3, "Synth\xE8se Financi\xE8re");
    \u0275\u0275elementEnd()();
  }
}
function ProcessCreditComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 5);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, ProcessCreditComponent_div_4_div_3_Template, 2, 1, "div", 6);
    \u0275\u0275elementStart(4, "p-tabView", 7);
    \u0275\u0275twoWayListener("activeIndexChange", function ProcessCreditComponent_div_4_Template_p_tabView_activeIndexChange_4_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.state().activeIndex, $event) || (ctx_r1.state().activeIndex = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(5, "p-tabPanel", 8)(6, "form", 9)(7, "div", 10)(8, "label", 11);
    \u0275\u0275text(9, "Cumul Cr\xE9dit");
    \u0275\u0275elementEnd();
    \u0275\u0275element(10, "p-inputNumber", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 10)(12, "label", 13);
    \u0275\u0275text(13, "Nombre de Cr\xE9dit");
    \u0275\u0275elementEnd();
    \u0275\u0275element(14, "p-inputNumber", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 10)(16, "label", 15);
    \u0275\u0275text(17, "Num\xE9ro Membre*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(18, "input", 16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div", 10)(20, "label", 17);
    \u0275\u0275text(21, "R\xE9f\xE9rence du Cr\xE9dit*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(22, "input", 18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "div", 10)(24, "label", 19);
    \u0275\u0275text(25, "Moyen de Deplacement Personnel*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(26, "input", 20);
    \u0275\u0275template(27, ProcessCreditComponent_div_4_small_27_Template, 2, 0, "small", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "div", 10)(29, "label", 22);
    \u0275\u0275text(30, "Bien*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(31, "input", 23);
    \u0275\u0275template(32, ProcessCreditComponent_div_4_small_32_Template, 2, 0, "small", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "div", 10)(34, "label", 24);
    \u0275\u0275text(35, "Capital*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(36, "p-inputNumber", 25);
    \u0275\u0275template(37, ProcessCreditComponent_div_4_small_37_Template, 2, 0, "small", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "div", 10)(39, "label", 26);
    \u0275\u0275text(40, "Cr\xE9ance");
    \u0275\u0275elementEnd();
    \u0275\u0275element(41, "p-inputNumber", 27);
    \u0275\u0275template(42, ProcessCreditComponent_div_4_small_42_Template, 2, 0, "small", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "div", 10)(44, "label", 28);
    \u0275\u0275text(45, "Dette");
    \u0275\u0275elementEnd();
    \u0275\u0275element(46, "p-inputNumber", 29);
    \u0275\u0275template(47, ProcessCreditComponent_div_4_small_47_Template, 2, 0, "small", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(48, "div", 10)(49, "label", 30);
    \u0275\u0275text(50, "Statut d'Activit\xE9*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(51, "input", 31);
    \u0275\u0275template(52, ProcessCreditComponent_div_4_small_52_Template, 2, 0, "small", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "div", 10)(54, "label", 32);
    \u0275\u0275text(55, "Exp\xE9rience*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(56, "input", 33);
    \u0275\u0275template(57, ProcessCreditComponent_div_4_small_57_Template, 2, 0, "small", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "div", 10)(59, "label", 34);
    \u0275\u0275text(60, "Lieu d'Activit\xE9*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(61, "input", 35);
    \u0275\u0275template(62, ProcessCreditComponent_div_4_small_62_Template, 2, 0, "small", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(63, "div", 36)(64, "p-button", 37);
    \u0275\u0275listener("click", function ProcessCreditComponent_div_4_Template_p_button_click_64_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.nextStep());
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(65, "p-tabPanel", 38)(66, "form", 9)(67, "div", 10)(68, "label", 39);
    \u0275\u0275text(69, "Personne Employ\xE9e");
    \u0275\u0275elementEnd();
    \u0275\u0275element(70, "input", 40);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(71, "div", 10)(72, "label", 41);
    \u0275\u0275text(73, "Lien");
    \u0275\u0275elementEnd();
    \u0275\u0275element(74, "input", 42);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(75, "div", 10)(76, "label", 43);
    \u0275\u0275text(77, "Nombre");
    \u0275\u0275elementEnd();
    \u0275\u0275element(78, "input", 44);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(79, "div", 10)(80, "label", 45);
    \u0275\u0275text(81, "Fr\xE9quence*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(82, "p-inputNumber", 46);
    \u0275\u0275template(83, ProcessCreditComponent_div_4_small_83_Template, 2, 0, "small", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(84, "div", 47)(85, "p-button", 48);
    \u0275\u0275listener("click", function ProcessCreditComponent_div_4_Template_p_button_click_85_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.prevStep());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(86, "p-button", 37);
    \u0275\u0275listener("click", function ProcessCreditComponent_div_4_Template_p_button_click_86_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.nextStep());
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(87, "p-tabPanel", 49)(88, "form", 50)(89, "div", 51);
    \u0275\u0275template(90, ProcessCreditComponent_div_4_p_card_90_Template, 20, 14, "p-card", 52);
    \u0275\u0275elementStart(91, "div", 53)(92, "p-button", 54);
    \u0275\u0275listener("click", function ProcessCreditComponent_div_4_Template_p_button_click_92_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.addProduit());
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(93, "div", 55)(94, "p-button", 48);
    \u0275\u0275listener("click", function ProcessCreditComponent_div_4_Template_p_button_click_94_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.prevStep());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(95, "p-button", 37);
    \u0275\u0275listener("click", function ProcessCreditComponent_div_4_Template_p_button_click_95_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.nextStep());
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(96, "p-tabPanel", 56)(97, "form", 50)(98, "div", 57);
    \u0275\u0275template(99, ProcessCreditComponent_div_4_p_card_99_Template, 16, 12, "p-card", 52);
    \u0275\u0275elementStart(100, "div", 53)(101, "p-button", 58);
    \u0275\u0275listener("click", function ProcessCreditComponent_div_4_Template_p_button_click_101_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.addCharge());
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(102, "div", 55)(103, "p-button", 48);
    \u0275\u0275listener("click", function ProcessCreditComponent_div_4_Template_p_button_click_103_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.prevStep());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(104, "p-button", 37);
    \u0275\u0275listener("click", function ProcessCreditComponent_div_4_Template_p_button_click_104_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.nextStep());
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(105, "p-tabPanel", 59)(106, "form", 50)(107, "div", 60)(108, "h4", 61);
    \u0275\u0275text(109, "Informations sur la Garantie");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(110, "div", 62)(111, "div", 10)(112, "label", 63);
    \u0275\u0275text(113, "Libell\xE9 de Garantie*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(114, "input", 64);
    \u0275\u0275template(115, ProcessCreditComponent_div_4_small_115_Template, 2, 0, "small", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(116, "div", 10)(117, "label", 65);
    \u0275\u0275text(118, "Montant de Garantie*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(119, "p-inputNumber", 66);
    \u0275\u0275template(120, ProcessCreditComponent_div_4_small_120_Template, 2, 0, "small", 21);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(121, "div", 60)(122, "h4", 67);
    \u0275\u0275text(123, "Localisation");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(124, "div", 62)(125, "div", 10)(126, "label", 68);
    \u0275\u0275text(127, "IT Ass");
    \u0275\u0275elementEnd();
    \u0275\u0275element(128, "input", 69);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(129, "div", 10)(130, "label", 70);
    \u0275\u0275text(131, "IT PC");
    \u0275\u0275elementEnd();
    \u0275\u0275element(132, "input", 71);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(133, "div", 60)(134, "h4", 72);
    \u0275\u0275text(135, "Personnes Caution");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(136, "div", 73);
    \u0275\u0275template(137, ProcessCreditComponent_div_4_p_card_137_Template, 28, 16, "p-card", 52);
    \u0275\u0275elementStart(138, "div", 53)(139, "p-button", 74);
    \u0275\u0275listener("click", function ProcessCreditComponent_div_4_Template_p_button_click_139_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.addCaution());
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(140, "div", 55)(141, "p-button", 48);
    \u0275\u0275listener("click", function ProcessCreditComponent_div_4_Template_p_button_click_141_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.prevStep());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(142, "p-button", 37);
    \u0275\u0275listener("click", function ProcessCreditComponent_div_4_Template_p_button_click_142_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.nextStep());
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(143, "p-tabPanel", 75)(144, "div", 76)(145, "div", 77)(146, "div", 78)(147, "div")(148, "h2", 79);
    \u0275\u0275text(149, "\u{1F4CB} R\xE9sum\xE9 du Cr\xE9dit");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(150, "p", 80);
    \u0275\u0275text(151, "V\xE9rifiez toutes les informations avant validation");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(152, "div", 81);
    \u0275\u0275element(153, "i", 82);
    \u0275\u0275elementStart(154, "span", 83);
    \u0275\u0275text(155, "Pr\xEAt pour validation");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(156, "p-card", 84);
    \u0275\u0275template(157, ProcessCreditComponent_div_4_ng_template_157_Template, 4, 0, "ng-template", 85);
    \u0275\u0275elementStart(158, "div", 62)(159, "div", 86)(160, "div", 87)(161, "div", 88)(162, "span", 89);
    \u0275\u0275text(163, "NUM\xC9RO MEMBRE");
    \u0275\u0275elementEnd();
    \u0275\u0275element(164, "p-tag", 90);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(165, "span", 91);
    \u0275\u0275text(166);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(167, "div", 86)(168, "div", 87)(169, "div", 88)(170, "span", 89);
    \u0275\u0275text(171, "R\xC9F\xC9RENCE CR\xC9DIT");
    \u0275\u0275elementEnd();
    \u0275\u0275element(172, "i", 92);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(173, "span", 91);
    \u0275\u0275text(174);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(175, "div", 93)(176, "div", 94)(177, "div", 95);
    \u0275\u0275text(178);
    \u0275\u0275pipe(179, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(180, "div", 96);
    \u0275\u0275text(181, "Cumul Cr\xE9dit");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(182, "div", 93)(183, "div", 94)(184, "div", 97);
    \u0275\u0275text(185);
    \u0275\u0275pipe(186, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(187, "div", 96);
    \u0275\u0275text(188, "Capital Demand\xE9");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(189, "div", 93)(190, "div", 94)(191, "div", 98);
    \u0275\u0275text(192);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(193, "div", 96);
    \u0275\u0275text(194, "Nombre de Cr\xE9dits");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(195, "p-card", 84);
    \u0275\u0275template(196, ProcessCreditComponent_div_4_ng_template_196_Template, 4, 0, "ng-template", 85);
    \u0275\u0275elementStart(197, "div", 62)(198, "div", 86)(199, "div", 99)(200, "div", 100);
    \u0275\u0275text(201, "Statut d'Activit\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(202, "div", 101);
    \u0275\u0275text(203);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(204, "div", 86)(205, "div", 99)(206, "div", 100);
    \u0275\u0275text(207, "Exp\xE9rience");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(208, "div", 101);
    \u0275\u0275text(209);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(210, "div", 86)(211, "div", 99)(212, "div", 100);
    \u0275\u0275text(213, "Lieu d'Activit\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(214, "div", 101);
    \u0275\u0275text(215);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(216, "div", 86)(217, "div", 99)(218, "div", 100);
    \u0275\u0275text(219, "Fr\xE9quence");
    \u0275\u0275elementEnd();
    \u0275\u0275element(220, "p-tag", 102);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(221, "p-card", 84);
    \u0275\u0275template(222, ProcessCreditComponent_div_4_ng_template_222_Template, 7, 7, "ng-template", 85)(223, ProcessCreditComponent_div_4_div_223_Template, 2, 1, "div", 103)(224, ProcessCreditComponent_div_4_div_224_Template, 4, 0, "div", 104);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(225, "p-card", 84);
    \u0275\u0275template(226, ProcessCreditComponent_div_4_ng_template_226_Template, 7, 7, "ng-template", 85)(227, ProcessCreditComponent_div_4_div_227_Template, 2, 1, "div", 103)(228, ProcessCreditComponent_div_4_div_228_Template, 4, 0, "div", 104);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(229, "p-card", 84);
    \u0275\u0275template(230, ProcessCreditComponent_div_4_ng_template_230_Template, 4, 0, "ng-template", 85);
    \u0275\u0275elementStart(231, "div", 62)(232, "div", 105)(233, "div", 99)(234, "div", 106);
    \u0275\u0275text(235, "Type de Garantie");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(236, "div", 107);
    \u0275\u0275text(237);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(238, "div", 100);
    \u0275\u0275text(239, "Montant");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(240, "div", 108);
    \u0275\u0275text(241);
    \u0275\u0275pipe(242, "currency");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(243, ProcessCreditComponent_div_4_div_243_Template, 6, 2, "div", 109);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(244, "p-card", 84);
    \u0275\u0275template(245, ProcessCreditComponent_div_4_ng_template_245_Template, 4, 1, "ng-template", 85)(246, ProcessCreditComponent_div_4_div_246_Template, 2, 1, "div", 103)(247, ProcessCreditComponent_div_4_div_247_Template, 4, 0, "div", 104);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(248, "p-card", 84);
    \u0275\u0275template(249, ProcessCreditComponent_div_4_ng_template_249_Template, 4, 0, "ng-template", 85);
    \u0275\u0275elementStart(250, "div", 62)(251, "div", 110)(252, "div", 111)(253, "div", 112);
    \u0275\u0275text(254);
    \u0275\u0275pipe(255, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(256, "div", 113);
    \u0275\u0275text(257, "Total Produits");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(258, "div", 110)(259, "div", 114)(260, "div", 115);
    \u0275\u0275text(261);
    \u0275\u0275pipe(262, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(263, "div", 116);
    \u0275\u0275text(264, "Total Charges");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(265, "div", 110)(266, "div", 117)(267, "div", 118);
    \u0275\u0275text(268);
    \u0275\u0275pipe(269, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(270, "div", 119);
    \u0275\u0275text(271, "R\xE9sultat Net");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(272, "div", 110)(273, "div", 120)(274, "div", 121);
    \u0275\u0275text(275);
    \u0275\u0275pipe(276, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(277, "div", 122);
    \u0275\u0275text(278, "Garantie");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(279, "div", 123)(280, "p-button", 124);
    \u0275\u0275listener("click", function ProcessCreditComponent_div_4_Template_p_button_click_280_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.prevStep());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(281, "p-button", 125);
    \u0275\u0275listener("click", function ProcessCreditComponent_div_4_Template_p_button_click_281_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.processCreditInd());
    });
    \u0275\u0275elementEnd()()()()()();
  }
  if (rf & 2) {
    let tmp_9_0;
    let tmp_10_0;
    let tmp_13_0;
    let tmp_16_0;
    let tmp_19_0;
    let tmp_20_0;
    let tmp_21_0;
    let tmp_22_0;
    let tmp_26_0;
    let tmp_32_0;
    let tmp_35_0;
    let tmp_37_0;
    let tmp_38_0;
    let tmp_39_0;
    let tmp_40_0;
    let tmp_41_0;
    let tmp_42_0;
    let tmp_43_0;
    let tmp_44_0;
    let tmp_45_0;
    let tmp_46_0;
    let tmp_51_0;
    let tmp_52_0;
    let tmp_53_0;
    let tmp_59_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.state().message || "Traitement du cr\xE9dit", " ");
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
    \u0275\u0275property("ngIf", ((tmp_9_0 = ctx_r1.creditForm.get("moyenPerson")) == null ? null : tmp_9_0.invalid) && ((tmp_9_0 = ctx_r1.creditForm.get("moyenPerson")) == null ? null : tmp_9_0.touched));
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ((tmp_10_0 = ctx_r1.creditForm.get("bien")) == null ? null : tmp_10_0.invalid) && ((tmp_10_0 = ctx_r1.creditForm.get("bien")) == null ? null : tmp_10_0.touched));
    \u0275\u0275advance(4);
    \u0275\u0275property("minFractionDigits", 2)("maxFractionDigits", 2);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_13_0 = ctx_r1.creditForm.get("capital")) == null ? null : tmp_13_0.invalid) && ((tmp_13_0 = ctx_r1.creditForm.get("capital")) == null ? null : tmp_13_0.touched));
    \u0275\u0275advance(4);
    \u0275\u0275property("minFractionDigits", 2)("maxFractionDigits", 2);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_16_0 = ctx_r1.creditForm.get("creance")) == null ? null : tmp_16_0.invalid) && ((tmp_16_0 = ctx_r1.creditForm.get("creance")) == null ? null : tmp_16_0.touched));
    \u0275\u0275advance(4);
    \u0275\u0275property("minFractionDigits", 2)("maxFractionDigits", 2);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_19_0 = ctx_r1.creditForm.get("dette")) == null ? null : tmp_19_0.invalid) && ((tmp_19_0 = ctx_r1.creditForm.get("dette")) == null ? null : tmp_19_0.touched));
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ((tmp_20_0 = ctx_r1.creditForm.get("statutActivite")) == null ? null : tmp_20_0.invalid) && ((tmp_20_0 = ctx_r1.creditForm.get("statutActivite")) == null ? null : tmp_20_0.touched));
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ((tmp_21_0 = ctx_r1.creditForm.get("experience")) == null ? null : tmp_21_0.invalid) && ((tmp_21_0 = ctx_r1.creditForm.get("experience")) == null ? null : tmp_21_0.touched));
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ((tmp_22_0 = ctx_r1.creditForm.get("lieuxAct")) == null ? null : tmp_22_0.invalid) && ((tmp_22_0 = ctx_r1.creditForm.get("lieuxAct")) == null ? null : tmp_22_0.touched));
    \u0275\u0275advance(4);
    \u0275\u0275property("formGroup", ctx_r1.creditForm);
    \u0275\u0275advance(16);
    \u0275\u0275property("showButtons", true)("min", 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_26_0 = ctx_r1.creditForm.get("frequence")) == null ? null : tmp_26_0.invalid) && ((tmp_26_0 = ctx_r1.creditForm.get("frequence")) == null ? null : tmp_26_0.touched));
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
    \u0275\u0275property("ngIf", ((tmp_32_0 = ctx_r1.creditForm.get("garantieLibele")) == null ? null : tmp_32_0.invalid) && ((tmp_32_0 = ctx_r1.creditForm.get("garantieLibele")) == null ? null : tmp_32_0.touched));
    \u0275\u0275advance(4);
    \u0275\u0275property("minFractionDigits", 2)("maxFractionDigits", 2);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_35_0 = ctx_r1.creditForm.get("garantieMontant")) == null ? null : tmp_35_0.invalid) && ((tmp_35_0 = ctx_r1.creditForm.get("garantieMontant")) == null ? null : tmp_35_0.touched));
    \u0275\u0275advance(17);
    \u0275\u0275property("ngForOf", ctx_r1.cautions.controls);
    \u0275\u0275advance(27);
    \u0275\u0275property("value", (tmp_37_0 = ctx_r1.creditForm.get("numeroMembre")) == null ? null : tmp_37_0.value);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((tmp_38_0 = ctx_r1.creditForm.get("numeroMembre")) == null ? null : tmp_38_0.value);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate((tmp_39_0 = ctx_r1.creditForm.get("referenceCredit")) == null ? null : tmp_39_0.value);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind4(179, 61, (tmp_40_0 = ctx_r1.creditForm.get("cumulCredit")) == null ? null : tmp_40_0.value, "GNF", "symbol", "1.0-0"), " ");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind4(186, 66, (tmp_41_0 = ctx_r1.creditForm.get("capital")) == null ? null : tmp_41_0.value, "GNF", "symbol", "1.0-0"), " ");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1(" ", (tmp_42_0 = ctx_r1.creditForm.get("nbreCredit")) == null ? null : tmp_42_0.value, " ");
    \u0275\u0275advance(11);
    \u0275\u0275textInterpolate1("", (tmp_43_0 = ctx_r1.creditForm.get("statutActivite")) == null ? null : tmp_43_0.value, " ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate((tmp_44_0 = ctx_r1.creditForm.get("experience")) == null ? null : tmp_44_0.value);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate((tmp_45_0 = ctx_r1.creditForm.get("lieuxAct")) == null ? null : tmp_45_0.value);
    \u0275\u0275advance(5);
    \u0275\u0275property("value", ((tmp_46_0 = ctx_r1.creditForm.get("frequence")) == null ? null : tmp_46_0.value) + " fois");
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r1.produits.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.produits.length === 0);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r1.charges.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.charges.length === 0);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate((tmp_51_0 = ctx_r1.creditForm.get("garantieLibele")) == null ? null : tmp_51_0.value);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind4(242, 71, (tmp_52_0 = ctx_r1.creditForm.get("garantieMontant")) == null ? null : tmp_52_0.value, "GNF", "symbol", "1.0-0"), " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ((tmp_53_0 = ctx_r1.creditForm.get("itAss")) == null ? null : tmp_53_0.value) || ((tmp_53_0 = ctx_r1.creditForm.get("itPc")) == null ? null : tmp_53_0.value));
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r1.cautions.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.cautions.length === 0);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind4(255, 76, ctx_r1.calculateTotalProduits(), "GNF", "symbol", "1.0-0"), " ");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind4(262, 81, ctx_r1.calculateTotalCharges(), "GNF", "symbol", "1.0-0"), " ");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind4(269, 86, ctx_r1.calculateTotalProduits() - ctx_r1.calculateTotalCharges(), "GNF", "symbol", "1.0-0"), " ");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind4(276, 91, (tmp_59_0 = ctx_r1.creditForm.get("garantieMontant")) == null ? null : tmp_59_0.value, "GNF", "symbol", "1.0-0"), " ");
    \u0275\u0275advance(6);
    \u0275\u0275property("loading", ctx_r1.state().submitLoading)("disabled", !ctx_r1.isFormValid());
  }
}
var ProcessCreditComponent = class _ProcessCreditComponent {
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
      // Enlever Validators.required
      dette: [0, [Validators.min(0)]],
      // Enlever Validators.required
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
    this.loadInstanceCredit();
    this.addProduit();
    this.addCharge();
    this.addCaution();
  }
  loadInstanceCredit() {
    this.activatedRouter.paramMap.pipe(switchMap((params) => {
      const numeroMembre = params.get("numeroMembre");
      if (numeroMembre) {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { loading: true, message: void 0, error: void 0 }));
        return this.userService.getInstanceCredit$(numeroMembre);
      } else {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { loading: false, message: void 0, error: "Invalide NumeroMembre" }));
        return EMPTY;
      }
    }), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          creditDto: response.data.creditDto,
          referenceCredit: response.data.creditDto?.referenceCredit,
          cumulCredit: response.data.cumulCredit,
          countCredit: response.data.countCredit,
          loading: false,
          message: response.message,
          error: void 0
        }));
        this.populateForm(response.data.creditDto, response.data.cumulCredit, response.data.countCredit);
      },
      error: (error) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { loading: false, message: void 0, error }));
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: typeof error === "string" ? error : "Une erreur s'est produite lors du chargement des donn\xE9es"
        });
      }
    });
  }
  populateForm(creditDto, cumulCredit, countCredit) {
    if (!creditDto)
      return;
    this.creditForm.patchValue({
      numeroMembre: creditDto.codeMembre,
      referenceCredit: creditDto.referenceCredit,
      cumulCredit,
      nbreCredit: countCredit
      // Patch other available fields here
    });
  }
  // Méthode pour vérifier si le formulaire est valide (tous les champs obligatoires remplis)
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
  // Tab handling with activeTabChange
  onActiveIndexChange(event) {
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { activeIndex: event }));
  }
  // Navigation between steps
  nextStep() {
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { activeIndex: state.activeIndex + 1 }));
  }
  prevStep() {
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { activeIndex: state.activeIndex - 1 }));
  }
  processCreditInd() {
    if (!this.isFormValid()) {
      this.messageService.add({
        severity: "error",
        summary: "Erreur",
        detail: "Veuillez remplir tous les champs obligatoires."
      });
      return;
    }
    const formValue = this.creditForm.value;
    const referenceCredit = formValue.referenceCredit;
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
      // Convert form arrays to flat arrays for the backend
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
      message: "\xCAtes-vous s\xFBr de vouloir valider ce cr\xE9dit?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { submitLoading: true }));
        this.userService.processCreditInd$(referenceCredit, creditProcessParams, this.state().creditDto?.individuelId).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.state.update((state) => __spreadProps(__spreadValues({}, state), { submitLoading: false })))).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: "success",
              summary: "Succ\xE8s",
              detail: response.message || "Cr\xE9dit trait\xE9 avec succ\xE8s"
            });
            setTimeout(() => {
              this.router.navigate(["/dashboards/home"]);
            }, 1500);
          },
          error: (error) => {
            this.messageService.add({
              severity: "error",
              summary: "Erreur",
              detail: typeof error === "string" ? error : "Une erreur s'est produite lors du traitement du cr\xE9dit"
            });
          }
        });
      }
    });
  }
  // Calculate total for all products
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
  // Calculate total for all charges
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
  static \u0275fac = function ProcessCreditComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProcessCreditComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProcessCreditComponent, selectors: [["app-process-credit"]], features: [\u0275\u0275ProvidersFeature([MessageService, ConfirmationService])], decls: 5, vars: 5, consts: [[1, "surface-0", "p-4"], ["class", "flex justify-content-center align-items-center my-5", 4, "ngIf"], [4, "ngIf"], [1, "flex", "justify-content-center", "align-items-center", "my-5"], ["strokeWidth", "4"], [1, "text-3xl", "font-medium", "text-900", "mb-4"], ["class", "p-message p-message-error p-3 mb-4", 4, "ngIf"], [3, "activeIndexChange", "activeIndex"], ["header", "Informations g\xE9n\xE9rales"], [1, "grid", 3, "formGroup"], [1, "col-12", "md:col-6", "mb-4"], ["for", "cumulCredit", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "cumulCredit", "formControlName", "cumulCredit", "readonly", "", 1, "w-full", 3, "minFractionDigits", "maxFractionDigits"], ["for", "nbreCredit", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "nbreCredit", "formControlName", "nbreCredit", "readonly", "", 1, "w-full", 3, "showButtons", "min"], ["for", "numeroMembre", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "numeroMembre", "type", "text", "pInputText", "", "formControlName", "numeroMembre", "readonly", "", 1, "w-full"], ["for", "referenceCredit", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "referenceCredit", "type", "text", "pInputText", "", "formControlName", "referenceCredit", "readonly", "", 1, "w-full"], ["for", "moyenPerson", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "moyenPerson", "type", "text", "pInputText", "", "formControlName", "moyenPerson", 1, "w-full"], ["class", "p-error", 4, "ngIf"], ["for", "bien", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "bien", "type", "text", "pInputText", "", "formControlName", "bien", 1, "w-full"], ["for", "capital", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "capital", "formControlName", "capital", 1, "w-full", 3, "minFractionDigits", "maxFractionDigits"], ["for", "creance", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "creance", "formControlName", "creance", 1, "w-full", 3, "minFractionDigits", "maxFractionDigits"], ["for", "dette", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "dette", "formControlName", "dette", 1, "w-full", 3, "minFractionDigits", "maxFractionDigits"], ["for", "statutActivite", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "statutActivite", "type", "text", "pInputText", "", "formControlName", "statutActivite", 1, "w-full"], ["for", "experience", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "experience", "type", "text", "pInputText", "", "formControlName", "experience", 1, "w-full"], ["for", "lieuxAct", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "lieuxAct", "type", "text", "pInputText", "", "formControlName", "lieuxAct", 1, "w-full"], [1, "col-12", "mb-4", "text-right"], ["label", "Suivant", "icon", "pi pi-arrow-right", "iconPos", "right", 3, "click"], ["header", "Informations additionnelles"], ["for", "personEmp", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "personEmp", "type", "text", "pInputText", "", "formControlName", "personEmp", 1, "w-full"], ["for", "lien", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "lien", "type", "text", "pInputText", "", "formControlName", "lien", 1, "w-full"], ["for", "nombre", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "nombre", "type", "text", "pInputText", "", "formControlName", "nombre", 1, "w-full"], ["for", "frequence", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "frequence", "formControlName", "frequence", 1, "w-full", 3, "showButtons", "min"], [1, "col-12", "flex", "gap-3", "justify-content-center", "mt-4"], ["label", "Pr\xE9c\xE9dent", "icon", "pi pi-arrow-left", 3, "click"], ["header", "Produits"], [3, "formGroup"], ["formArrayName", "produits"], ["class", "mb-4", 4, "ngFor", "ngForOf"], [1, "mb-4", "text-right"], ["label", "Ajouter un produit", "icon", "pi pi-plus", 3, "click"], [1, "flex", "gap-3", "justify-content-center", "mt-4"], ["header", "Charges"], ["formArrayName", "charges"], ["label", "Ajouter une charge", "icon", "pi pi-plus", 3, "click"], ["header", "Garantie"], [1, "col-12"], [1, "text-lg", "font-medium", "mb-3"], [1, "grid"], ["for", "garantieLibele", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "garantieLibele", "type", "text", "pInputText", "", "formControlName", "garantieLibele", 1, "w-full"], ["for", "garantieMontant", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "garantieMontant", "formControlName", "garantieMontant", 1, "w-full", 3, "minFractionDigits", "maxFractionDigits"], [1, "text-lg", "font-medium", "mb-3", "mt-3"], ["for", "itAss", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "itAss", "type", "text", "pInputText", "", "formControlName", "itAss", 1, "w-full"], ["for", "itPc", 1, "block", "text-900", "font-medium", "mb-2"], ["id", "itPc", "type", "text", "pInputText", "", "formControlName", "itPc", 1, "w-full"], [1, "text-lg", "font-medium", "mb-3", "mt-4"], ["formArrayName", "cautions"], ["label", "Ajouter une caution", "icon", "pi pi-plus", 3, "click"], ["header", "R\xE9sum\xE9 et validation"], [1, "surface-0"], [1, "border-bottom-1", "surface-border", "p-4", "mb-4"], [1, "flex", "align-items-center", "justify-content-between"], [1, "text-2xl", "font-bold", "text-900", "m-0", "mb-2"], [1, "text-600", "m-0"], [1, "flex", "align-items-center", "gap-2"], [1, "pi", "pi-check-circle", "text-green-500", "text-2xl"], [1, "text-green-600", "font-medium"], [1, "mb-4"], ["pTemplate", "header"], [1, "col-12", "md:col-6"], [1, "bg-gray-50", "border-round", "p-3", "mb-3"], [1, "flex", "align-items-center", "justify-content-between", "mb-2"], [1, "text-500", "text-sm", "font-medium"], ["severity", "info", 3, "value"], [1, "text-900", "font-bold", "text-lg"], ["pTooltip", "Copier la r\xE9f\xE9rence", 1, "pi", "pi-copy", "text-400", "cursor-pointer"], [1, "col-12", "md:col-4"], [1, "text-center", "p-3", "border-1", "surface-border", "border-round"], [1, "text-blue-600", "font-bold", "text-2xl", "mb-2"], [1, "text-500", "text-sm"], [1, "text-green-600", "font-bold", "text-2xl", "mb-2"], [1, "text-orange-600", "font-bold", "text-2xl", "mb-2"], [1, "p-3"], [1, "text-500", "text-sm", "mb-1"], [1, "text-900", "font-semibold"], ["severity", "warn", 3, "value"], ["class", "grid", 4, "ngIf"], ["class", "text-center p-4", 4, "ngIf"], [1, "col-12", "md:col-8"], [1, "text-500", "text-sm", "mb-2"], [1, "text-900", "font-bold", "text-lg", "mb-3"], [1, "text-teal-600", "font-bold", "text-xl"], ["class", "col-12 md:col-4", 4, "ngIf"], [1, "col-12", "md:col-3"], [1, "text-center", "p-3", "bg-green-50", "border-round"], [1, "text-green-600", "font-bold", "text-xl", "mb-1"], [1, "text-green-700", "text-sm"], [1, "text-center", "p-3", "bg-red-50", "border-round"], [1, "text-red-600", "font-bold", "text-xl", "mb-1"], [1, "text-red-700", "text-sm"], [1, "text-center", "p-3", "bg-blue-50", "border-round"], [1, "text-blue-600", "font-bold", "text-xl", "mb-1"], [1, "text-blue-700", "text-sm"], [1, "text-center", "p-3", "bg-teal-50", "border-round"], [1, "text-teal-600", "font-bold", "text-xl", "mb-1"], [1, "text-teal-700", "text-sm"], [1, "flex", "gap-3", "justify-content-center", "pt-4", "border-top-1", "surface-border"], ["label", "Pr\xE9c\xE9dent", "icon", "pi pi-arrow-left", "severity", "secondary", "size", "large", 3, "click"], ["label", "Valider le Cr\xE9dit", "icon", "pi pi-check", "severity", "success", "size", "large", "styleClass", "px-5", 3, "click", "loading", "disabled"], [1, "p-message", "p-message-error", "p-3", "mb-4"], [1, "p-error"], [1, "grid", 3, "formGroupName"], [1, "col-12", "md:col-6", "mb-3"], [1, "block", "text-900", "font-medium", "mb-2", 3, "for"], ["type", "text", "pInputText", "", "formControlName", "libele", 1, "w-full", 3, "id"], ["formControlName", "prixUnit", 1, "w-full", 3, "id", "minFractionDigits", "maxFractionDigits"], ["formControlName", "qte", 1, "w-full", 3, "id", "showButtons", "min"], ["type", "text", "pInputText", "", "formControlName", "observation", 1, "w-full", 3, "id"], [1, "col-12", "text-right"], ["icon", "pi pi-trash", "severity", "danger", 3, "click", 4, "ngIf"], ["icon", "pi pi-trash", "severity", "danger", 3, "click"], [1, "col-12", "md:col-4", "mb-3"], ["type", "text", "pInputText", "", "formControlName", "nom", 1, "w-full", 3, "id"], ["type", "text", "pInputText", "", "formControlName", "prenom", 1, "w-full", 3, "id"], ["type", "text", "pInputText", "", "formControlName", "telephone", 1, "w-full", 3, "id"], ["type", "text", "pInputText", "", "formControlName", "activite", 1, "w-full", 3, "id"], ["formControlName", "age", 1, "w-full", 3, "id", "showButtons", "min"], ["type", "text", "pInputText", "", "formControlName", "profession", 1, "w-full", 3, "id"], [1, "flex", "align-items-center", "gap-2", "p-3", "bg-blue-50", "border-round-top"], [1, "pi", "pi-user", "text-blue-600"], [1, "text-lg", "font-semibold", "text-blue-900", "m-0"], [1, "flex", "align-items-center", "gap-2", "p-3", "bg-green-50", "border-round-top"], [1, "pi", "pi-briefcase", "text-green-600"], [1, "text-lg", "font-semibold", "text-green-900", "m-0"], [1, "flex", "align-items-center", "justify-content-between", "p-3", "bg-purple-50", "border-round-top"], [1, "pi", "pi-shopping-cart", "text-purple-600"], [1, "text-lg", "font-semibold", "text-purple-900", "m-0"], ["severity", "success", 3, "value"], ["class", "col-12 md:col-6 lg:col-4", 4, "ngFor", "ngForOf"], [1, "col-12", "md:col-6", "lg:col-4"], [1, "border-1", "surface-border", "border-round", "p-3", "h-full"], [1, "flex", "align-items-start", "justify-content-between", "mb-2"], [1, "text-900", "font-semibold", "m-0", "text-sm"], [1, "text-xs", "text-500"], [1, "text-600", "text-xs", "mb-2"], [1, "text-900", "font-bold"], [1, "text-500", "text-xs"], [1, "text-center", "p-4"], [1, "pi", "pi-info-circle", "text-400", "text-4xl", "mb-3"], [1, "text-500"], [1, "flex", "align-items-center", "justify-content-between", "p-3", "bg-red-50", "border-round-top"], [1, "pi", "pi-minus-circle", "text-red-600"], [1, "text-lg", "font-semibold", "text-red-900", "m-0"], ["severity", "danger", 3, "value"], [1, "flex", "align-items-center", "gap-2", "p-3", "bg-teal-50", "border-round-top"], [1, "pi", "pi-shield", "text-teal-600"], [1, "text-lg", "font-semibold", "text-teal-900", "m-0"], ["class", "text-900 text-sm mb-1", 4, "ngIf"], ["class", "text-900 text-sm", 4, "ngIf"], [1, "text-900", "text-sm", "mb-1"], [1, "text-900", "text-sm"], [1, "flex", "align-items-center", "gap-2", "p-3", "bg-indigo-50", "border-round-top"], [1, "pi", "pi-users", "text-indigo-600"], [1, "text-lg", "font-semibold", "text-indigo-900", "m-0"], [1, "flex", "align-items-center", "gap-3", "mb-3"], ["shape", "circle", "size", "large", "styleClass", "bg-indigo-100 text-indigo-900", 3, "label"], [1, "text-600", "text-sm", "mb-1"], [1, "text-primary", "font-medium", "text-sm"], [1, "flex", "align-items-center", "gap-2", "p-3", "bg-yellow-50", "border-round-top"], [1, "pi", "pi-calculator", "text-yellow-600"], [1, "text-lg", "font-semibold", "text-yellow-900", "m-0"]], template: function ProcessCreditComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "p-toast")(1, "p-confirmDialog");
      \u0275\u0275elementStart(2, "div", 0);
      \u0275\u0275template(3, ProcessCreditComponent_div_3_Template, 2, 3, "div", 1)(4, ProcessCreditComponent_div_4_Template, 282, 96, "div", 2);
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
  }, dependencies: [CommonModule, NgForOf, NgIf, CurrencyPipe, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, ReactiveFormsModule, FormGroupDirective, FormControlName, FormGroupName, FormArrayName, ButtonModule, Button, PrimeTemplate, InputTextModule, InputText, InputNumberModule, InputNumber, CardModule, Card, TabViewModule, TabView, TabPanel, ToastModule, Toast, ConfirmDialogModule, ConfirmDialog, ProgressSpinnerModule, ProgressSpinner, AvatarModule, Avatar, TagModule, Tag], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProcessCreditComponent, { className: "ProcessCreditComponent", filePath: "src/app/pages/dashboard/agent-credit/process-credit/process-credit.component.ts", lineNumber: 29 });
})();
export {
  ProcessCreditComponent
};
//# sourceMappingURL=chunk-SP66THA2.js.map
