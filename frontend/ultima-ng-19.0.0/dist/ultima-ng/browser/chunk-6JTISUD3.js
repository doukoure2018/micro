import {
  ConfirmDialog,
  ConfirmDialogModule
} from "./chunk-JQ4E7TJM.js";
import {
  Textarea,
  TextareaModule
} from "./chunk-RW4OSSQT.js";
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
import {
  Checkbox,
  CheckboxModule
} from "./chunk-4JIPYACT.js";
import "./chunk-6GA37Q7Z.js";
import {
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
import {
  InputNumber,
  InputNumberModule
} from "./chunk-JGOABXTK.js";
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
import "./chunk-KHEKFKWA.js";
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
  ConfirmationService,
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
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "./chunk-W3K3GK4Z.js";
import {
  CommonModule,
  NgClass,
  NgForOf,
  NgIf,
  UpperCasePipe
} from "./chunk-SQQPVFHK.js";
import {
  inject,
  signal,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵpureFunction2,
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

// src/app/pages/dashboard/admin/de/situation-stock/situation-stock.component.ts
var _c0 = () => ({ width: "500px" });
var _c1 = () => ["numeroCommande", "service", "delegationLibele", "categorieLibele"];
var _c2 = (a0, a1) => ({ "row-urgent": a0, "row-suggestion-done": a1 });
var _c3 = (a0) => ({ "ng-invalid": a0 });
function SituationStockComponent_div_5_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14)(1, "span", 15);
    \u0275\u0275text(2, "D\xE9l\xE9gation : ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 22);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "uppercase");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 1, (tmp_2_0 = ctx_r1.delegation()) == null ? null : tmp_2_0.libele));
  }
}
function SituationStockComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 13)(1, "div", 14)(2, "span", 15);
    \u0275\u0275text(3, "R\xF4le : ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 16);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 17)(7, "button", 18);
    \u0275\u0275listener("click", function SituationStockComponent_div_5_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.switchViewMode("all"));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 19);
    \u0275\u0275listener("click", function SituationStockComponent_div_5_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.switchViewMode("delegation"));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "button", 20);
    \u0275\u0275listener("click", function SituationStockComponent_div_5_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.refresh());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(10, SituationStockComponent_div_5_div_10_Template, 6, 3, "div", 21);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.user.role);
    \u0275\u0275advance(2);
    \u0275\u0275classMap(ctx_r1.viewMode() === "all" ? "p-button-primary" : "p-button-outlined");
    \u0275\u0275property("disabled", ctx_r1.loading());
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r1.viewMode() === "delegation" ? "p-button-primary" : "p-button-outlined");
    \u0275\u0275property("disabled", ctx_r1.loading());
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.loading());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.viewMode() === "delegation" && ctx_r1.delegation());
  }
}
function SituationStockComponent_span_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, " Affichage de ");
    \u0275\u0275elementStart(2, "strong");
    \u0275\u0275text(3, "tous les bons valid\xE9s par les DR");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " de toutes les d\xE9l\xE9gations. Vous pouvez sugg\xE9rer une modification de quantit\xE9 pour chaque bon. ");
    \u0275\u0275elementEnd();
  }
}
function SituationStockComponent_span_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, " Affichage des bons valid\xE9s par le DR pour ");
    \u0275\u0275elementStart(2, "strong");
    \u0275\u0275text(3, "votre d\xE9l\xE9gation uniquement");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, ". Vous pouvez sugg\xE9rer une modification de quantit\xE9 pour chaque bon. ");
    \u0275\u0275elementEnd();
  }
}
function SituationStockComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23);
    \u0275\u0275element(1, "p-progressSpinner");
    \u0275\u0275elementEnd();
  }
}
function SituationStockComponent_p_table_11_ng_template_1_th_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th");
    \u0275\u0275text(1, "D\xE9l\xE9gation");
    \u0275\u0275elementEnd();
  }
}
function SituationStockComponent_p_table_11_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr");
    \u0275\u0275element(1, "th", 28);
    \u0275\u0275elementStart(2, "th");
    \u0275\u0275text(3, "N\xB0 Commande");
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, SituationStockComponent_p_table_11_ng_template_1_th_4_Template, 2, 0, "th", 6);
    \u0275\u0275elementStart(5, "th");
    \u0275\u0275text(6, "Service");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th");
    \u0275\u0275text(8, "Cat\xE9gorie");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th");
    \u0275\u0275text(10, "Qt\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th");
    \u0275\u0275text(12, "Suggestion");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th");
    \u0275\u0275text(14, "Date Cr\xE9ation");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th");
    \u0275\u0275text(16, "Actions");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", ctx_r1.viewMode() === "all");
  }
}
function SituationStockComponent_p_table_11_ng_template_2_td_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td")(1, "span", 38);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const stock_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(stock_r4.delegationLibele || "-");
  }
}
function SituationStockComponent_p_table_11_ng_template_2_button_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 39);
    \u0275\u0275listener("click", function SituationStockComponent_p_table_11_ng_template_2_button_23_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const stock_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openValidationFinaleDialog(stock_r4));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const stock_r4 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r1.processingAction() || !ctx_r1.canValidateFinale(stock_r4));
  }
}
function SituationStockComponent_p_table_11_ng_template_2_tr_24_div_41_p_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const details_r7 = \u0275\u0275nextContext().ngIf;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(details_r7.detailStandard);
  }
}
function SituationStockComponent_p_table_11_ng_template_2_tr_24_div_41_div_2_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 63)(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const key_r8 = ctx.$implicit;
    const details_r7 = \u0275\u0275nextContext(2).ngIf;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", key_r8, ":");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", details_r7[key_r8], " ");
  }
}
function SituationStockComponent_p_table_11_ng_template_2_tr_24_div_41_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275template(1, SituationStockComponent_p_table_11_ng_template_2_tr_24_div_41_div_2_div_1_Template, 4, 2, "div", 62);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const details_r7 = \u0275\u0275nextContext().ngIf;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.Object.keys(details_r7));
  }
}
function SituationStockComponent_p_table_11_ng_template_2_tr_24_div_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275template(1, SituationStockComponent_p_table_11_ng_template_2_tr_24_div_41_p_1_Template, 2, 1, "p", 6)(2, SituationStockComponent_p_table_11_ng_template_2_tr_24_div_41_div_2_Template, 2, 1, "div", 6);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const details_r7 = ctx.ngIf;
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", details_r7.detailStandard);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !details_r7.detailStandard);
  }
}
function SituationStockComponent_p_table_11_ng_template_2_tr_24_tr_56_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 46);
    \u0275\u0275element(2, "i", 64);
    \u0275\u0275text(3, " Quantit\xE9 actuelle ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "td", 65);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const stock_r4 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(stock_r4.qteActuelle);
  }
}
function SituationStockComponent_p_table_11_ng_template_2_tr_24_tr_57_span_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 69);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const stock_r4 = \u0275\u0275nextContext(3).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" (", stock_r4.qteSuggeree - (stock_r4.qteActuelle || stock_r4.qte) > 0 ? "+" : "", "", stock_r4.qteSuggeree - (stock_r4.qteActuelle || stock_r4.qte), ") ");
  }
}
function SituationStockComponent_p_table_11_ng_template_2_tr_24_tr_57_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 46);
    \u0275\u0275element(2, "i", 66);
    \u0275\u0275text(3, " Quantit\xE9 sugg\xE9r\xE9e ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "td", 48)(5, "span", 67);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, SituationStockComponent_p_table_11_ng_template_2_tr_24_tr_57_span_7_Template, 2, 2, "span", 68);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const stock_r4 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275property("ngClass", ctx_r1.getSuggestionClass(stock_r4));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", stock_r4.qteSuggeree, " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", stock_r4.qteSuggeree !== (stock_r4.qteActuelle || stock_r4.qte));
  }
}
function SituationStockComponent_p_table_11_ng_template_2_tr_24_tr_58_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 46);
    \u0275\u0275element(2, "i", 70);
    \u0275\u0275text(3, " Motif modification ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "td", 71);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const stock_r4 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(stock_r4.motifQte);
  }
}
function SituationStockComponent_p_table_11_ng_template_2_tr_24_tr_59_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 46);
    \u0275\u0275element(2, "i", 47);
    \u0275\u0275text(3, " Sugg\xE9r\xE9 par ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "td", 48);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const stock_r4 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(stock_r4.suggereParFullName);
  }
}
function SituationStockComponent_p_table_11_ng_template_2_tr_24_tr_60_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 46);
    \u0275\u0275element(2, "i", 72);
    \u0275\u0275text(3, " Date suggestion ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "td", 48);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const stock_r4 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", ctx_r1.formatDate(stock_r4.dateSuggestion), " ");
  }
}
function SituationStockComponent_p_table_11_ng_template_2_tr_24_div_61_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 42)(2, "div", 43);
    \u0275\u0275element(3, "i", 73);
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5, "Observations");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 74)(7, "div", 75)(8, "div", 76);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const stock_r4 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(stock_r4.observations);
  }
}
function SituationStockComponent_p_table_11_ng_template_2_tr_24_span_68_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, " Cette commande valid\xE9e par le DR attend votre suggestion de quantit\xE9 ");
    \u0275\u0275elementEnd();
  }
}
function SituationStockComponent_p_table_11_ng_template_2_tr_24_span_69_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, " Suggestion d\xE9j\xE0 enregistr\xE9e - Vous pouvez la modifier si n\xE9cessaire ");
    \u0275\u0275elementEnd();
  }
}
function SituationStockComponent_p_table_11_ng_template_2_tr_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "div", 40)(3, "div", 0)(4, "div", 41)(5, "div", 42)(6, "div", 43);
    \u0275\u0275element(7, "i", 44);
    \u0275\u0275elementStart(8, "span");
    \u0275\u0275text(9, "Informations de la Commande");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "table", 45)(11, "tbody")(12, "tr")(13, "td", 46);
    \u0275\u0275element(14, "i", 47);
    \u0275\u0275text(15, " Demandeur ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "td", 48);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "tr")(19, "td", 46);
    \u0275\u0275element(20, "i", 49);
    \u0275\u0275text(21, " D\xE9l\xE9gation ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "td", 48);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "tr")(25, "td", 46);
    \u0275\u0275element(26, "i", 50);
    \u0275\u0275text(27, " Agence ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "td", 48);
    \u0275\u0275text(29);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "tr")(31, "td", 46);
    \u0275\u0275element(32, "i", 51);
    \u0275\u0275text(33, " Point de vente ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "td", 48);
    \u0275\u0275text(35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "tr")(37, "td", 46);
    \u0275\u0275element(38, "i", 52);
    \u0275\u0275text(39, " Description ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "td", 48);
    \u0275\u0275template(41, SituationStockComponent_p_table_11_ng_template_2_tr_24_div_41_Template, 3, 2, "div", 6);
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275elementStart(42, "div", 41)(43, "div", 42)(44, "div", 53);
    \u0275\u0275element(45, "i", 54);
    \u0275\u0275elementStart(46, "span");
    \u0275\u0275text(47, "Quantit\xE9s & Suggestion");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(48, "table", 45)(49, "tbody")(50, "tr")(51, "td", 46);
    \u0275\u0275element(52, "i", 55);
    \u0275\u0275text(53, " Quantit\xE9 command\xE9e ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "td", 56);
    \u0275\u0275text(55);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(56, SituationStockComponent_p_table_11_ng_template_2_tr_24_tr_56_Template, 6, 1, "tr", 6)(57, SituationStockComponent_p_table_11_ng_template_2_tr_24_tr_57_Template, 8, 3, "tr", 6)(58, SituationStockComponent_p_table_11_ng_template_2_tr_24_tr_58_Template, 6, 1, "tr", 6)(59, SituationStockComponent_p_table_11_ng_template_2_tr_24_tr_59_Template, 6, 1, "tr", 6)(60, SituationStockComponent_p_table_11_ng_template_2_tr_24_tr_60_Template, 6, 1, "tr", 6);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275template(61, SituationStockComponent_p_table_11_ng_template_2_tr_24_div_61_Template, 10, 1, "div", 57);
    \u0275\u0275elementStart(62, "div", 1)(63, "div", 58)(64, "div", 59)(65, "button", 60);
    \u0275\u0275listener("click", function SituationStockComponent_p_table_11_ng_template_2_tr_24_Template_button_click_65_listener() {
      \u0275\u0275restoreView(_r6);
      const stock_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openSuggestionDialog(stock_r4));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(66, "div", 61);
    \u0275\u0275element(67, "i", 44);
    \u0275\u0275template(68, SituationStockComponent_p_table_11_ng_template_2_tr_24_span_68_Template, 2, 0, "span", 6)(69, SituationStockComponent_p_table_11_ng_template_2_tr_24_span_69_Template, 2, 0, "span", 6);
    \u0275\u0275elementEnd()()()()()()();
  }
  if (rf & 2) {
    const stock_r4 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("@rowExpand", ctx_r1.isExpanded(stock_r4) ? "expanded" : "collapsed");
    \u0275\u0275advance();
    \u0275\u0275attribute("colspan", ctx_r1.viewMode() === "all" ? 10 : 9);
    \u0275\u0275advance(16);
    \u0275\u0275textInterpolate(stock_r4.userFullName || stock_r4.username);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(stock_r4.delegationLibele || "-");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(stock_r4.agenceLibele || "-");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(stock_r4.pointventeLibele || "-");
    \u0275\u0275advance(6);
    \u0275\u0275property("ngIf", ctx_r1.parseDetails(stock_r4.detailBonCommande));
    \u0275\u0275advance(14);
    \u0275\u0275textInterpolate1("", stock_r4.qte || 0, " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", stock_r4.qteActuelle);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.hasSuggestion(stock_r4));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", stock_r4.motifQte);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", stock_r4.suggereParFullName);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", stock_r4.dateSuggestion);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", stock_r4.observations);
    \u0275\u0275advance(4);
    \u0275\u0275property("label", ctx_r1.hasSuggestion(stock_r4) ? "Modifier la suggestion" : "Sugg\xE9rer une quantit\xE9")("icon", ctx_r1.hasSuggestion(stock_r4) ? "pi pi-pencil" : "pi pi-plus")("disabled", ctx_r1.processingAction() || !ctx_r1.canSuggestQuantity(stock_r4));
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", !ctx_r1.hasSuggestion(stock_r4));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.hasSuggestion(stock_r4));
  }
}
function SituationStockComponent_p_table_11_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 29)(1, "td")(2, "button", 30);
    \u0275\u0275listener("click", function SituationStockComponent_p_table_11_ng_template_2_Template_button_click_2_listener() {
      const stock_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleRow(stock_r4));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(3, "td", 31);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, SituationStockComponent_p_table_11_ng_template_2_td_5_Template, 3, 1, "td", 6);
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td")(9, "span", 32);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "td")(12, "span", 31);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "td")(15, "span", 33);
    \u0275\u0275element(16, "i", 34);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "td");
    \u0275\u0275text(19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "td")(21, "div", 35)(22, "button", 36);
    \u0275\u0275listener("click", function SituationStockComponent_p_table_11_ng_template_2_Template_button_click_22_listener() {
      const stock_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openSuggestionDialog(stock_r4));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(23, SituationStockComponent_p_table_11_ng_template_2_button_23_Template, 1, 1, "button", 37);
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(24, SituationStockComponent_p_table_11_ng_template_2_tr_24_Template, 70, 19, "tr", 6);
  }
  if (rf & 2) {
    const stock_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(19, _c2, ctx_r1.isUrgent(stock_r4), ctx_r1.hasSuggestion(stock_r4)));
    \u0275\u0275advance(2);
    \u0275\u0275property("pTooltip", ctx_r1.isExpanded(stock_r4) ? "Masquer les d\xE9tails" : "Afficher les d\xE9tails")("icon", ctx_r1.isExpanded(stock_r4) ? "pi pi-chevron-down" : "pi pi-chevron-right");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(stock_r4.numeroCommande);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.viewMode() === "all");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(stock_r4.service);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(stock_r4.categorieLibele || "-");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(stock_r4.qteActuelle || stock_r4.qte);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r1.getSuggestionClass(stock_r4));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r1.hasSuggestion(stock_r4) ? "pi-check-circle" : "pi-clock");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.getSuggestionLabel(stock_r4), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.formatDate(stock_r4.dateCreation));
    \u0275\u0275advance(3);
    \u0275\u0275classMap(ctx_r1.hasSuggestion(stock_r4) ? "p-button-outlined p-button-warning" : "p-button-warning");
    \u0275\u0275property("label", ctx_r1.hasSuggestion(stock_r4) ? "Modifier" : "Sugg\xE9rer")("icon", ctx_r1.hasSuggestion(stock_r4) ? "pi pi-pencil" : "pi pi-plus")("disabled", ctx_r1.processingAction() || !ctx_r1.canSuggestQuantity(stock_r4));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.hasSuggestion(stock_r4));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.isExpanded(stock_r4));
  }
}
function SituationStockComponent_p_table_11_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 77);
    \u0275\u0275element(2, "i", 78);
    \u0275\u0275elementStart(3, "p", 79);
    \u0275\u0275text(4, "Aucun bon de commande valid\xE9 \xE0 traiter");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "small", 15);
    \u0275\u0275text(6, "Les bons valid\xE9s par le DR appara\xEEtront ici");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275attribute("colspan", ctx_r1.viewMode() === "all" ? 10 : 9);
  }
}
function SituationStockComponent_p_table_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-table", 24);
    \u0275\u0275template(1, SituationStockComponent_p_table_11_ng_template_1_Template, 17, 1, "ng-template", 25)(2, SituationStockComponent_p_table_11_ng_template_2_Template, 25, 22, "ng-template", 26)(3, SituationStockComponent_p_table_11_ng_template_3_Template, 7, 1, "ng-template", 27);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("value", ctx_r1.stocks())("paginator", true)("rows", 10)("showCurrentPageReport", true)("globalFilterFields", \u0275\u0275pureFunction0(5, _c1));
  }
}
function SituationStockComponent_div_13_div_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 93)(1, "label", 94);
    \u0275\u0275text(2, "Quantit\xE9 sugg\xE9r\xE9e *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p-inputNumber", 95);
    \u0275\u0275twoWayListener("ngModelChange", function SituationStockComponent_div_13_div_27_Template_p_inputNumber_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.qteSuggeree, $event) || (ctx_r1.qteSuggeree = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.qteSuggeree);
    \u0275\u0275property("min", 1)("showButtons", true)("disabled", ctx_r1.processingAction());
  }
}
function SituationStockComponent_div_13_div_28_small_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 99);
    \u0275\u0275text(1, " Le motif est obligatoire lorsque la quantit\xE9 est modifi\xE9e ");
    \u0275\u0275elementEnd();
  }
}
function SituationStockComponent_div_13_div_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 93)(1, "label", 96);
    \u0275\u0275text(2, "Motif du changement de quantit\xE9 *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "textarea", 97);
    \u0275\u0275twoWayListener("ngModelChange", function SituationStockComponent_div_13_div_28_Template_textarea_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.motifQte, $event) || (ctx_r1.motifQte = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275text(4, "            ");
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, SituationStockComponent_div_13_div_28_small_5_Template, 2, 0, "small", 98);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.motifQte);
    \u0275\u0275property("disabled", ctx_r1.processingAction())("ngClass", \u0275\u0275pureFunction1(4, _c3, ctx_r1.isMotifRequired() && !ctx_r1.motifQte()));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.isMotifRequired() && !ctx_r1.motifQte());
  }
}
function SituationStockComponent_div_13_div_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 93)(1, "label", 100);
    \u0275\u0275text(2, "Motif (optionnel)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "textarea", 101);
    \u0275\u0275twoWayListener("ngModelChange", function SituationStockComponent_div_13_div_29_Template_textarea_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.motifQte, $event) || (ctx_r1.motifQte = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275text(4, "            ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.motifQte);
    \u0275\u0275property("disabled", ctx_r1.processingAction());
  }
}
function SituationStockComponent_div_13_div_35_p_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275element(1, "i", 105);
    \u0275\u0275text(2, " La quantit\xE9 ");
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " sera confirm\xE9e. ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.selectedStock().qteActuelle || ctx_r1.selectedStock().qte);
  }
}
function SituationStockComponent_div_13_div_35_p_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275element(1, "i", 106);
    \u0275\u0275text(2, " Quantit\xE9 : ");
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " \u2192 ");
    \u0275\u0275elementStart(6, "strong", 107);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 108);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.selectedStock().qteActuelle || ctx_r1.selectedStock().qte);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.qteSuggeree());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("(", ctx_r1.qteSuggeree() - (ctx_r1.selectedStock().qteActuelle || ctx_r1.selectedStock().qte) > 0 ? "+" : "", "", ctx_r1.qteSuggeree() - (ctx_r1.selectedStock().qteActuelle || ctx_r1.selectedStock().qte), " unit\xE9(s))");
  }
}
function SituationStockComponent_div_13_div_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 102)(1, "div", 103);
    \u0275\u0275element(2, "i", 44);
    \u0275\u0275text(3, " R\xE9sum\xE9 de la suggestion ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 104);
    \u0275\u0275template(5, SituationStockComponent_div_13_div_35_p_5_Template, 6, 1, "p", 6)(6, SituationStockComponent_div_13_div_35_p_6_Template, 10, 4, "p", 6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ctx_r1.garderQuantite());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.garderQuantite() && ctx_r1.qteSuggeree());
  }
}
function SituationStockComponent_div_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 80)(1, "div", 81)(2, "p", 82)(3, "strong");
    \u0275\u0275text(4, "Commande :");
    \u0275\u0275elementEnd();
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 82)(7, "strong");
    \u0275\u0275text(8, "Service :");
    \u0275\u0275elementEnd();
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 82)(11, "strong");
    \u0275\u0275text(12, "Demandeur :");
    \u0275\u0275elementEnd();
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "p", 82)(15, "strong");
    \u0275\u0275text(16, "Quantit\xE9 actuelle :");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span", 83);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "div", 84);
    \u0275\u0275element(20, "i", 5);
    \u0275\u0275elementStart(21, "span");
    \u0275\u0275text(22, ' Vous pouvez sugg\xE9rer une modification de la quantit\xE9 pour cette commande valid\xE9e par le DR. Si la quantit\xE9 convient, cochez "Garder la quantit\xE9 actuelle". ');
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div", 85)(24, "p-checkbox", 86);
    \u0275\u0275twoWayListener("ngModelChange", function SituationStockComponent_div_13_Template_p_checkbox_ngModelChange_24_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.garderQuantite, $event) || (ctx_r1.garderQuantite = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("onChange", function SituationStockComponent_div_13_Template_p_checkbox_onChange_24_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onGarderQuantiteChange());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "label", 87);
    \u0275\u0275text(26, "Garder la quantit\xE9 actuelle");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(27, SituationStockComponent_div_13_div_27_Template, 4, 4, "div", 88)(28, SituationStockComponent_div_13_div_28_Template, 6, 6, "div", 88)(29, SituationStockComponent_div_13_div_29_Template, 5, 2, "div", 88);
    \u0275\u0275elementStart(30, "div", 89)(31, "label", 90);
    \u0275\u0275text(32, "Observations compl\xE9mentaires (optionnel)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "textarea", 91);
    \u0275\u0275twoWayListener("ngModelChange", function SituationStockComponent_div_13_Template_textarea_ngModelChange_33_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.suggestionObservations, $event) || (ctx_r1.suggestionObservations = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275text(34, "            ");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(35, SituationStockComponent_div_13_div_35_Template, 7, 2, "div", 92);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r1.selectedStock().numeroCommande, " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.selectedStock().service, " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.selectedStock().userFullName || ctx_r1.selectedStock().username, " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.selectedStock().qteActuelle || ctx_r1.selectedStock().qte);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.garderQuantite);
    \u0275\u0275property("binary", true)("disabled", ctx_r1.processingAction());
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", !ctx_r1.garderQuantite());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.isMotifRequired());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.garderQuantite());
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.suggestionObservations);
    \u0275\u0275property("disabled", ctx_r1.processingAction());
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.qteSuggeree() || ctx_r1.garderQuantite());
  }
}
function SituationStockComponent_ng_template_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 109);
    \u0275\u0275listener("click", function SituationStockComponent_ng_template_14_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeSuggestionDialog());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "button", 110);
    \u0275\u0275listener("click", function SituationStockComponent_ng_template_14_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.submitSuggestion());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r1.processingAction());
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r1.garderQuantite() ? "p-button-success" : "p-button-warning");
    \u0275\u0275property("label", ctx_r1.garderQuantite() ? "Confirmer la quantit\xE9" : "Enregistrer la suggestion")("icon", ctx_r1.garderQuantite() ? "pi pi-check" : "pi pi-save")("disabled", ctx_r1.processingAction() || !ctx_r1.garderQuantite() && !ctx_r1.qteSuggeree() || ctx_r1.isMotifRequired() && !ctx_r1.motifQte())("loading", ctx_r1.processingAction());
  }
}
function SituationStockComponent_div_16_div_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 113)(1, "span");
    \u0275\u0275text(2, "Quantit\xE9 sugg\xE9r\xE9e :");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "strong", 120);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.selectedStock().qteSuggeree);
  }
}
function SituationStockComponent_div_16_div_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 121)(1, "span");
    \u0275\u0275text(2, "Motif :");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 122);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.selectedStock().motifQte);
  }
}
function SituationStockComponent_div_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 80)(1, "div", 81)(2, "p", 82)(3, "strong");
    \u0275\u0275text(4, "Commande :");
    \u0275\u0275elementEnd();
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 82)(7, "strong");
    \u0275\u0275text(8, "Service :");
    \u0275\u0275elementEnd();
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 82)(11, "strong");
    \u0275\u0275text(12, "Demandeur :");
    \u0275\u0275elementEnd();
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "p", 82)(15, "strong");
    \u0275\u0275text(16, "D\xE9l\xE9gation :");
    \u0275\u0275elementEnd();
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div", 111)(19, "div", 103);
    \u0275\u0275element(20, "i", 112);
    \u0275\u0275text(21, " R\xE9capitulatif des quantit\xE9s ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "div", 104)(23, "div", 113)(24, "span");
    \u0275\u0275text(25, "Quantit\xE9 demand\xE9e :");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "strong");
    \u0275\u0275text(27);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "div", 113)(29, "span");
    \u0275\u0275text(30, "Quantit\xE9 actuelle :");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "strong");
    \u0275\u0275text(32);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(33, SituationStockComponent_div_16_div_33_Template, 5, 1, "div", 114)(34, SituationStockComponent_div_16_div_34_Template, 5, 1, "div", 115);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "div", 116);
    \u0275\u0275element(36, "i", 117);
    \u0275\u0275elementStart(37, "span");
    \u0275\u0275text(38, " En validant, ce bon de commande sera ");
    \u0275\u0275elementStart(39, "strong");
    \u0275\u0275text(40, "envoy\xE9 \xE0 la logistique");
    \u0275\u0275elementEnd();
    \u0275\u0275text(41, " pour traitement. Cette action est d\xE9finitive. ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(42, "div", 89)(43, "label", 118);
    \u0275\u0275text(44, "Observations (optionnel)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "textarea", 119);
    \u0275\u0275twoWayListener("ngModelChange", function SituationStockComponent_div_16_Template_textarea_ngModelChange_45_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.validationObservations, $event) || (ctx_r1.validationObservations = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275text(46, "            ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r1.selectedStock().numeroCommande, " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.selectedStock().service, " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.selectedStock().userFullName || ctx_r1.selectedStock().username, " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.selectedStock().delegationLibele, " ");
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(ctx_r1.selectedStock().qte);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.selectedStock().qteActuelle || ctx_r1.selectedStock().qte);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.selectedStock().qteSuggeree !== null);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.selectedStock().motifQte);
    \u0275\u0275advance(11);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.validationObservations);
    \u0275\u0275property("disabled", ctx_r1.processingAction());
  }
}
function SituationStockComponent_ng_template_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 109);
    \u0275\u0275listener("click", function SituationStockComponent_ng_template_17_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeValidationFinaleDialog());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "button", 123);
    \u0275\u0275listener("click", function SituationStockComponent_ng_template_17_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.submitValidationFinale());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r1.processingAction());
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.processingAction())("loading", ctx_r1.processingAction());
  }
}
var SituationStockComponent = class _SituationStockComponent {
  user;
  Object = Object;
  userService = inject(UserService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  // Signals principaux
  stocks = signal([]);
  delegation = signal(null);
  loading = signal(false);
  delegationId = signal(null);
  expandedRows = signal({});
  // Mode d'affichage: 'delegation' (uniquement ma délégation) ou 'all' (toutes les délégations)
  viewMode = signal("all");
  // Signals pour le dialogue de suggestion
  showSuggestionDialog = signal(false);
  selectedStock = signal(null);
  qteSuggeree = signal(null);
  motifQte = signal("");
  suggestionObservations = signal("");
  garderQuantite = signal(false);
  processingAction = signal(false);
  // Signals pour la validation finale
  showValidationFinaleDialog = signal(false);
  validationObservations = signal("");
  ngOnInit() {
    if (this.user?.delegationId) {
      this.delegationId.set(this.user.delegationId);
    }
    this.loadAllStockValides();
  }
  /**
   * Charger TOUS les bons validés par le DR (toutes délégations)
   */
  loadAllStockValides() {
    this.loading.set(true);
    this.viewMode.set("all");
    this.userService.getAllStockValidesPourDE$().subscribe({
      next: (response) => {
        console.log("Tous les stocks valid\xE9s:", response);
        if (response?.data?.stocks) {
          this.stocks.set(response.data.stocks);
          this.showSuccess(`${response.data.stocks.length} bon(s) valid\xE9(s) de toutes les d\xE9l\xE9gations`);
        } else {
          this.stocks.set([]);
        }
      },
      error: (error) => {
        console.error("Erreur:", error);
        this.showError("Erreur lors du chargement des bons valid\xE9s");
        this.stocks.set([]);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }
  /**
   * Charger les bons validés par le DR pour une délégation spécifique
   */
  loadStockValidesPourDE() {
    const delId = this.delegationId();
    if (!delId) {
      this.showWarning("Aucune d\xE9l\xE9gation associ\xE9e");
      return;
    }
    this.loading.set(true);
    this.viewMode.set("delegation");
    this.userService.getStockValidesPourDE$(delId).subscribe({
      next: (response) => {
        console.log("Stocks valid\xE9s pour ma d\xE9l\xE9gation:", response);
        if (response?.data?.stocks) {
          this.stocks.set(response.data.stocks);
          this.delegation.set(response.data.delegation);
          this.showSuccess(`${response.data.stocks.length} bon(s) valid\xE9(s) pour ma d\xE9l\xE9gation`);
        } else {
          this.stocks.set([]);
        }
      },
      error: (error) => {
        console.error("Erreur:", error);
        this.showError("Erreur lors du chargement des bons valid\xE9s");
        this.stocks.set([]);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }
  /**
   * Changer le mode d'affichage
   */
  switchViewMode(mode) {
    if (mode === "all") {
      this.loadAllStockValides();
    } else {
      this.loadStockValidesPourDE();
    }
  }
  /**
   * Rafraîchir les données selon le mode actuel
   */
  refresh() {
    if (this.viewMode() === "all") {
      this.loadAllStockValides();
    } else {
      this.loadStockValidesPourDE();
    }
  }
  // ==================== GESTION DES LIGNES EXPANSIBLES ====================
  toggleRow(stock) {
    const currentExpanded = this.expandedRows();
    const stockId = stock.idCmd.toString();
    this.expandedRows.set(__spreadProps(__spreadValues({}, currentExpanded), {
      [stockId]: !currentExpanded[stockId]
    }));
  }
  isExpanded(stock) {
    return this.expandedRows()[stock.idCmd.toString()] || false;
  }
  // ==================== UTILITAIRES D'AFFICHAGE ====================
  parseDetails(detailJson) {
    try {
      if (!detailJson)
        return null;
      return JSON.parse(detailJson);
    } catch (e) {
      return { detailStandard: detailJson };
    }
  }
  getStatusSeverity(status) {
    switch (status) {
      case "ACCEPT":
        return "success";
      case "REJET":
        return "danger";
      case "ENCOURS":
        return "warn";
      default:
        return "warn";
    }
  }
  getValidationSeverity(validation) {
    switch (validation) {
      case "VALIDE":
      case "ACCEPTE":
        return "success";
      case "REFUSE":
        return "danger";
      case "EN_ATTENTE":
      default:
        return "warn";
    }
  }
  getStateValidationLabel(stateValidation) {
    const labels = {
      VALIDE: "Valid\xE9 par DR",
      ACCEPTE: "Accept\xE9",
      REFUSE: "Refus\xE9",
      EN_ATTENTE: "En attente"
    };
    return labels[stateValidation] || stateValidation;
  }
  formatDate(date) {
    if (!date)
      return "-";
    if (Array.isArray(date)) {
      const [year, month, day, hour = 0, minute = 0] = date;
      return new Date(year, month - 1, day, hour, minute).toLocaleString("fr-FR");
    }
    return new Date(date).toLocaleString("fr-FR");
  }
  isUrgent(stock) {
    return stock && stock.urgent === true;
  }
  // ==================== SUGGESTION DE QUANTITÉ ====================
  /**
   * Ouvrir le dialogue de suggestion de quantité
   */
  openSuggestionDialog(stock) {
    this.selectedStock.set(stock);
    const qteActuelle = stock.qteActuelle || stock.qte;
    this.qteSuggeree.set(stock.qteSuggeree || qteActuelle);
    this.motifQte.set(stock.motifQte || "");
    this.suggestionObservations.set("");
    this.garderQuantite.set(false);
    this.showSuggestionDialog.set(true);
  }
  /**
   * Vérifier si le motif est obligatoire
   * Le motif est obligatoire si la quantité suggérée est différente de la quantité actuelle
   */
  isMotifRequired() {
    const stock = this.selectedStock();
    if (!stock || this.garderQuantite())
      return false;
    const qteActuelle = stock.qteActuelle || stock.qte;
    return this.qteSuggeree() !== qteActuelle;
  }
  /**
   * Soumettre la suggestion de quantité
   */
  submitSuggestion() {
    const stock = this.selectedStock();
    if (!stock)
      return;
    if (this.isMotifRequired() && (!this.motifQte() || this.motifQte().trim().length === 0)) {
      this.showWarning("Le motif est obligatoire lorsque la quantit\xE9 est modifi\xE9e");
      return;
    }
    const qteActuelle = stock.qteActuelle || stock.qte;
    const qteSuggereeFinal = this.garderQuantite() ? qteActuelle : this.qteSuggeree();
    this.confirmationService.confirm({
      message: this.garderQuantite() ? `Confirmer la quantit\xE9 actuelle (${qteActuelle}) pour la commande ${stock.numeroCommande} ?` : `Sugg\xE9rer une quantit\xE9 de ${qteSuggereeFinal} pour la commande ${stock.numeroCommande} ?`,
      header: "Confirmation",
      icon: "pi pi-question-circle",
      acceptLabel: "Confirmer",
      rejectLabel: "Annuler",
      acceptButtonStyleClass: "p-button-primary",
      accept: () => {
        this.performSuggestion(stock);
      }
    });
  }
  /**
   * Effectuer la suggestion de quantité
   */
  performSuggestion(stock) {
    this.processingAction.set(true);
    const qteActuelle = stock.qteActuelle || stock.qte;
    const suggestionDto = {
      qteSuggeree: this.garderQuantite() ? qteActuelle : this.qteSuggeree(),
      motifQte: this.motifQte() || void 0,
      observations: this.suggestionObservations() || void 0,
      garderQuantite: this.garderQuantite()
    };
    this.userService.suggererQuantite$(stock.idCmd, suggestionDto).subscribe({
      next: (response) => {
        const message = this.garderQuantite() ? `Quantit\xE9 confirm\xE9e pour la commande ${stock.numeroCommande}` : `Suggestion de quantit\xE9 enregistr\xE9e pour la commande ${stock.numeroCommande}`;
        this.showSuccess(message);
        this.closeSuggestionDialog();
        this.refresh();
      },
      error: (error) => {
        console.error("Erreur suggestion:", error);
        this.showError(error.error?.message || "Erreur lors de l'enregistrement de la suggestion");
      },
      complete: () => {
        this.processingAction.set(false);
      }
    });
  }
  /**
   * Fermer le dialogue de suggestion
   */
  closeSuggestionDialog() {
    this.showSuggestionDialog.set(false);
    this.selectedStock.set(null);
    this.qteSuggeree.set(null);
    this.motifQte.set("");
    this.suggestionObservations.set("");
    this.garderQuantite.set(false);
  }
  /**
   * Vérifier si le bouton de suggestion doit être affiché
   * Seulement pour les bons validés par le DR
   */
  canSuggestQuantity(stock) {
    return stock.status === "ENCOURS" && stock.stateValidation === "VALIDE";
  }
  /**
   * Vérifier si une suggestion a déjà été faite
   */
  hasSuggestion(stock) {
    return stock.qteSuggeree !== null && stock.qteSuggeree !== void 0;
  }
  /**
   * Obtenir le libellé de la suggestion
   */
  getSuggestionLabel(stock) {
    if (!this.hasSuggestion(stock)) {
      return "Aucune suggestion";
    }
    const qteActuelle = stock.qteActuelle || stock.qte;
    if (stock.qteSuggeree === qteActuelle) {
      return "Quantit\xE9 confirm\xE9e";
    }
    return `Sugg\xE9r\xE9: ${stock.qteSuggeree} (\xE9tait: ${qteActuelle})`;
  }
  /**
   * Obtenir la classe CSS pour la suggestion
   */
  getSuggestionClass(stock) {
    if (!this.hasSuggestion(stock)) {
      return "suggestion-pending";
    }
    const qteActuelle = stock.qteActuelle || stock.qte;
    if (stock.qteSuggeree === qteActuelle) {
      return "suggestion-confirmed";
    }
    return "suggestion-modified";
  }
  /**
   * Handler pour le changement de "garder quantité"
   */
  onGarderQuantiteChange() {
    if (this.garderQuantite()) {
      const stock = this.selectedStock();
      if (stock) {
        this.qteSuggeree.set(stock.qteActuelle || stock.qte);
      }
    }
  }
  // ==================== VALIDATION FINALE DE ====================
  /**
   * Vérifier si le bouton de validation finale doit être affiché
   * La validation finale est possible si une suggestion a été faite
   */
  canValidateFinale(stock) {
    return stock.status === "ENCOURS" && stock.stateValidation === "VALIDE" && this.hasSuggestion(stock);
  }
  /**
   * Ouvrir le dialogue de validation finale
   */
  openValidationFinaleDialog(stock) {
    this.selectedStock.set(stock);
    this.validationObservations.set("");
    this.showValidationFinaleDialog.set(true);
  }
  /**
   * Fermer le dialogue de validation finale
   */
  closeValidationFinaleDialog() {
    this.showValidationFinaleDialog.set(false);
    this.selectedStock.set(null);
    this.validationObservations.set("");
  }
  /**
   * Soumettre la validation finale
   */
  submitValidationFinale() {
    const stock = this.selectedStock();
    if (!stock)
      return;
    this.confirmationService.confirm({
      message: `\xCAtes-vous s\xFBr de vouloir valider d\xE9finitivement la commande ${stock.numeroCommande} ?
Cette action rendra le bon disponible pour la logistique.`,
      header: "Confirmation de validation finale",
      icon: "pi pi-check-circle",
      acceptLabel: "Valider",
      rejectLabel: "Annuler",
      acceptButtonStyleClass: "p-button-success",
      accept: () => {
        this.performValidationFinale(stock);
      }
    });
  }
  /**
   * Effectuer la validation finale
   */
  performValidationFinale(stock) {
    this.processingAction.set(true);
    this.userService.validationFinaleDE$(stock.idCmd, this.validationObservations() || void 0).subscribe({
      next: (response) => {
        this.showSuccess(`Commande ${stock.numeroCommande} valid\xE9e et envoy\xE9e \xE0 la logistique`);
        this.closeValidationFinaleDialog();
        this.refresh();
      },
      error: (error) => {
        console.error("Erreur validation finale:", error);
        this.showError(error.error?.message || "Erreur lors de la validation finale");
      },
      complete: () => {
        this.processingAction.set(false);
      }
    });
  }
  // ==================== MESSAGES ====================
  showSuccess(message) {
    this.messageService.add({
      severity: "success",
      summary: "Succ\xE8s",
      detail: message,
      life: 3e3
    });
  }
  showError(message) {
    this.messageService.add({
      severity: "error",
      summary: "Erreur",
      detail: message,
      life: 5e3
    });
  }
  showWarning(message) {
    this.messageService.add({
      severity: "warn",
      summary: "Attention",
      detail: message,
      life: 4e3
    });
  }
  showInfo(message) {
    this.messageService.add({
      severity: "info",
      summary: "Information",
      detail: message,
      life: 3e3
    });
  }
  static \u0275fac = function SituationStockComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SituationStockComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SituationStockComponent, selectors: [["app-situation-stock"]], inputs: { user: "user" }, features: [\u0275\u0275ProvidersFeature([MessageService, ConfirmationService])], decls: 18, vars: 23, consts: [[1, "grid"], [1, "col-12"], ["header", "Bons de Commande Valid\xE9s - Espace DE"], ["class", "mb-3 flex align-items-center flex-wrap gap-3", 4, "ngIf"], [1, "info-banner", "mb-3"], [1, "pi", "pi-info-circle", "mr-2"], [4, "ngIf"], ["class", "flex justify-content-center p-4", 4, "ngIf"], ["currentPageReportTemplate", "Affichage de {first} \xE0 {last} sur {totalRecords} entr\xE9es", "responsiveLayout", "scroll", "dataKey", "idCmd", 3, "value", "paginator", "rows", "showCurrentPageReport", "globalFilterFields", 4, "ngIf"], ["header", "Suggestion de quantit\xE9", 3, "visibleChange", "visible", "modal", "draggable", "resizable", "closable"], ["class", "dialog-content", 4, "ngIf"], ["pTemplate", "footer"], ["header", "Validation finale - Envoyer \xE0 la logistique", 3, "visibleChange", "visible", "modal", "draggable", "resizable", "closable"], [1, "mb-3", "flex", "align-items-center", "flex-wrap", "gap-3"], [1, "flex", "align-items-center"], [1, "text-500"], [1, "font-bold", "badge", "badge-de", "ml-2"], [1, "view-mode-buttons"], ["pButton", "", "type", "button", "label", "Toutes les d\xE9l\xE9gations", "icon", "pi pi-globe", 1, "mr-2", 3, "click", "disabled"], ["pButton", "", "type", "button", "label", "Ma d\xE9l\xE9gation", "icon", "pi pi-home", 3, "click", "disabled"], ["pButton", "", "type", "button", "icon", "pi pi-refresh", "pTooltip", "Rafra\xEEchir les donn\xE9es", 1, "p-button-text", "p-button-rounded", 3, "click", "disabled"], ["class", "flex align-items-center", 4, "ngIf"], [1, "font-bold", "ml-2"], [1, "flex", "justify-content-center", "p-4"], ["currentPageReportTemplate", "Affichage de {first} \xE0 {last} sur {totalRecords} entr\xE9es", "responsiveLayout", "scroll", "dataKey", "idCmd", 3, "value", "paginator", "rows", "showCurrentPageReport", "globalFilterFields"], ["pTemplate", "header"], ["pTemplate", "body"], ["pTemplate", "emptymessage"], [2, "width", "3rem"], [3, "ngClass"], ["type", "button", "pButton", "", 1, "p-button-text", "p-button-rounded", "p-button-plain", 3, "click", "pTooltip", "icon"], [1, "font-bold"], [1, "badge", "badge-info"], [1, "suggestion-badge", 3, "ngClass"], [1, "pi", "mr-1", 3, "ngClass"], [1, "flex", "gap-2"], ["pButton", "", "type", "button", "pTooltip", "Sugg\xE9rer une modification de quantit\xE9", 3, "click", "label", "icon", "disabled"], ["pButton", "", "type", "button", "label", "Valider", "icon", "pi pi-check", "class", "p-button-success", "pTooltip", "Validation finale - envoyer \xE0 la logistique", 3, "disabled", "click", 4, "ngIf"], [1, "badge", "badge-delegation"], ["pButton", "", "type", "button", "label", "Valider", "icon", "pi pi-check", "pTooltip", "Validation finale - envoyer \xE0 la logistique", 1, "p-button-success", 3, "click", "disabled"], [1, "detail-container"], [1, "col-12", "md:col-6"], [1, "detail-card"], [1, "detail-header"], [1, "pi", "pi-info-circle"], [1, "detail-table"], [1, "label-cell"], [1, "pi", "pi-user", "mini-icon"], [1, "value-cell"], [1, "pi", "pi-map-marker", "mini-icon"], [1, "pi", "pi-home", "mini-icon"], [1, "pi", "pi-shopping-cart", "mini-icon"], [1, "pi", "pi-file-text", "mini-icon"], [1, "detail-header", "detail-header-warning"], [1, "pi", "pi-sort-numeric-up"], [1, "pi", "pi-box", "mini-icon"], [1, "value-cell", "font-bold", "text-lg"], ["class", "col-12", 4, "ngIf"], [1, "action-buttons-container"], [1, "action-buttons"], ["pButton", "", "type", "button", "pTooltip", "Sugg\xE9rer une modification de quantit\xE9", 1, "p-button-warning", "p-button-raised", "p-button-lg", 3, "click", "label", "icon", "disabled"], [1, "action-info", "mt-2"], ["class", "mb-1", 4, "ngFor", "ngForOf"], [1, "mb-1"], [1, "pi", "pi-check-circle", "mini-icon"], [1, "value-cell", "font-bold", "text-primary", "text-lg"], [1, "pi", "pi-pencil", "mini-icon"], [1, "font-bold", "text-lg", 3, "ngClass"], ["class", "text-orange-500 ml-2", 4, "ngIf"], [1, "text-orange-500", "ml-2"], [1, "pi", "pi-comment", "mini-icon"], [1, "value-cell", "motif-qte-text"], [1, "pi", "pi-calendar", "mini-icon"], [1, "pi", "pi-comments"], [1, "observations-content"], [1, "observation-box"], [1, "observation-text"], [1, "text-center", "p-4"], [1, "pi", "pi-inbox", "text-4xl", "text-300"], [1, "mt-3"], [1, "dialog-content"], [1, "info-section", "mb-3"], [1, "mb-2"], [1, "font-bold", "text-primary", "text-xl"], [1, "alert", "alert-info", "mb-3"], [1, "field-checkbox", "mb-3"], ["inputId", "garderQte", 3, "ngModelChange", "onChange", "ngModel", "binary", "disabled"], ["for", "garderQte", 1, "ml-2", "cursor-pointer"], ["class", "field mb-3", 4, "ngIf"], [1, "field"], ["for", "suggestion-observations"], ["pTextarea", "", "id", "suggestion-observations", "rows", "2", "placeholder", "Observations suppl\xE9mentaires...", 1, "w-full", 3, "ngModelChange", "ngModel", "disabled"], ["class", "suggestion-summary mt-3", 4, "ngIf"], [1, "field", "mb-3"], ["for", "qte-suggeree", 1, "required"], ["inputId", "qte-suggeree", "buttonLayout", "horizontal", "incrementButtonIcon", "pi pi-plus", "decrementButtonIcon", "pi pi-minus", 1, "w-full", 3, "ngModelChange", "ngModel", "min", "showButtons", "disabled"], ["for", "motif-qte", 1, "required"], ["pTextarea", "", "id", "motif-qte", "rows", "3", "placeholder", "Expliquez pourquoi vous sugg\xE9rez cette modification de quantit\xE9...", 1, "w-full", 3, "ngModelChange", "ngModel", "disabled", "ngClass"], ["class", "p-error", 4, "ngIf"], [1, "p-error"], ["for", "motif-qte-opt"], ["pTextarea", "", "id", "motif-qte-opt", "rows", "2", "placeholder", "Observations sur la quantit\xE9 (optionnel)...", 1, "w-full", 3, "ngModelChange", "ngModel", "disabled"], [1, "suggestion-summary", "mt-3"], [1, "summary-header"], [1, "summary-content"], [1, "pi", "pi-check", "text-green-500", "mr-2"], [1, "pi", "pi-arrow-right", "text-orange-500", "mr-2"], [1, "text-orange-500"], [1, "ml-2"], ["pButton", "", "label", "Annuler", "icon", "pi pi-times", 1, "p-button-text", 3, "click", "disabled"], ["pButton", "", 3, "click", "label", "icon", "disabled", "loading"], [1, "validation-summary", "mb-3"], [1, "pi", "pi-box"], [1, "flex", "justify-content-between", "mb-2"], ["class", "flex justify-content-between mb-2", 4, "ngIf"], ["class", "flex justify-content-between", 4, "ngIf"], [1, "alert", "alert-success", "mb-3"], [1, "pi", "pi-check-circle", "mr-2"], ["for", "validation-observations"], ["pTextarea", "", "id", "validation-observations", "rows", "2", "placeholder", "Ajoutez des observations si n\xE9cessaire...", 1, "w-full", 3, "ngModelChange", "ngModel", "disabled"], [1, "text-primary"], [1, "flex", "justify-content-between"], [1, "text-orange-500", "font-italic"], ["pButton", "", "label", "Valider et envoyer", "icon", "pi pi-send", 1, "p-button-success", 3, "click", "disabled", "loading"]], template: function SituationStockComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
      \u0275\u0275element(2, "p-toast")(3, "p-confirmDialog");
      \u0275\u0275elementStart(4, "p-card", 2);
      \u0275\u0275template(5, SituationStockComponent_div_5_Template, 11, 9, "div", 3);
      \u0275\u0275elementStart(6, "div", 4);
      \u0275\u0275element(7, "i", 5);
      \u0275\u0275template(8, SituationStockComponent_span_8_Template, 5, 0, "span", 6)(9, SituationStockComponent_span_9_Template, 5, 0, "span", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275template(10, SituationStockComponent_div_10_Template, 2, 0, "div", 7)(11, SituationStockComponent_p_table_11_Template, 4, 6, "p-table", 8);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(12, "p-dialog", 9);
      \u0275\u0275twoWayListener("visibleChange", function SituationStockComponent_Template_p_dialog_visibleChange_12_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.showSuggestionDialog, $event) || (ctx.showSuggestionDialog = $event);
        return $event;
      });
      \u0275\u0275template(13, SituationStockComponent_div_13_Template, 36, 13, "div", 10)(14, SituationStockComponent_ng_template_14_Template, 2, 7, "ng-template", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "p-dialog", 12);
      \u0275\u0275twoWayListener("visibleChange", function SituationStockComponent_Template_p_dialog_visibleChange_15_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.showValidationFinaleDialog, $event) || (ctx.showValidationFinaleDialog = $event);
        return $event;
      });
      \u0275\u0275template(16, SituationStockComponent_div_16_Template, 47, 10, "div", 10)(17, SituationStockComponent_ng_template_17_Template, 2, 3, "ng-template", 11);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(5);
      \u0275\u0275property("ngIf", ctx.user);
      \u0275\u0275advance(3);
      \u0275\u0275property("ngIf", ctx.viewMode() === "all");
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.viewMode() === "delegation");
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.loading());
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading());
      \u0275\u0275advance();
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(21, _c0));
      \u0275\u0275twoWayProperty("visible", ctx.showSuggestionDialog);
      \u0275\u0275property("modal", true)("draggable", false)("resizable", false)("closable", !ctx.processingAction());
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.selectedStock());
      \u0275\u0275advance(2);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(22, _c0));
      \u0275\u0275twoWayProperty("visible", ctx.showValidationFinaleDialog);
      \u0275\u0275property("modal", true)("draggable", false)("resizable", false)("closable", !ctx.processingAction());
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.selectedStock());
    }
  }, dependencies: [CommonModule, NgClass, NgForOf, NgIf, UpperCasePipe, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, TableModule, Table, PrimeTemplate, TagModule, ButtonModule, ButtonDirective, CardModule, Card, ToastModule, Toast, ProgressSpinnerModule, ProgressSpinner, DividerModule, TooltipModule, Tooltip, DialogModule, Dialog, ConfirmDialogModule, ConfirmDialog, TextareaModule, Textarea, InputNumberModule, InputNumber, CheckboxModule, Checkbox], styles: ['\n\n.badge-de[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #f59e0b 0%,\n      #d97706 100%);\n  color: white;\n  padding: 0.25rem 0.75rem;\n  border-radius: 20px;\n  font-weight: 600;\n}\n.badge-delegation[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  color: white;\n  padding: 0.25rem 0.75rem;\n  border-radius: 20px;\n  font-size: 0.8rem;\n  font-weight: 500;\n  text-transform: uppercase;\n  letter-spacing: 0.3px;\n}\n.view-mode-buttons[_ngcontent-%COMP%] {\n  display: inline-flex;\n  gap: 0.5rem;\n}\n.view-mode-buttons[_ngcontent-%COMP%]   .p-button[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\n.view-mode-buttons[_ngcontent-%COMP%]   .p-button.p-button-primary[_ngcontent-%COMP%] {\n  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);\n}\n.info-banner[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #e0f2fe 0%,\n      #bae6fd 100%);\n  border-left: 4px solid #0ea5e9;\n  padding: 1rem;\n  border-radius: 6px;\n  color: #0369a1;\n  display: flex;\n  align-items: center;\n}\n.row-suggestion-done[_ngcontent-%COMP%] {\n  background-color: #f0fdf4 !important;\n}\n.row-urgent[_ngcontent-%COMP%] {\n  background-color: #fef2f2 !important;\n}\n.suggestion-badge[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  padding: 0.25rem 0.5rem;\n  border-radius: 4px;\n  font-size: 0.8rem;\n}\n.suggestion-badge.suggestion-pending[_ngcontent-%COMP%] {\n  background: #f3f4f6;\n  color: #6b7280;\n}\n.suggestion-badge.suggestion-confirmed[_ngcontent-%COMP%] {\n  background: #dcfce7;\n  color: #15803d;\n  font-weight: 600;\n}\n.suggestion-badge.suggestion-modified[_ngcontent-%COMP%] {\n  background: #fef3c7;\n  color: #b45309;\n  font-weight: 600;\n}\n[_nghost-%COMP%]     .detail-container {\n  padding: 1.5rem;\n  background:\n    linear-gradient(\n      135deg,\n      #fffbeb 0%,\n      #fef3c7 100%);\n  border-radius: 12px;\n  animation: _ngcontent-%COMP%_slideDown 0.3s ease-out;\n}\n[_nghost-%COMP%]     .detail-card {\n  background: white;\n  border-radius: 10px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);\n  overflow: hidden;\n  margin-bottom: 1rem;\n  transition: transform 0.2s ease, box-shadow 0.2s ease;\n}\n[_nghost-%COMP%]     .detail-card:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);\n}\n[_nghost-%COMP%]     .detail-header {\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  color: white;\n  padding: 0.75rem 1rem;\n  font-weight: 600;\n  font-size: 0.95rem;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n[_nghost-%COMP%]     .detail-header i {\n  font-size: 1.1rem;\n}\n[_nghost-%COMP%]     .detail-header.detail-header-warning {\n  background:\n    linear-gradient(\n      135deg,\n      #f59e0b 0%,\n      #d97706 100%);\n}\n[_nghost-%COMP%]     .detail-table {\n  width: 100%;\n  border-collapse: collapse;\n}\n[_nghost-%COMP%]     .detail-table tbody tr {\n  border-bottom: 1px solid #f0f0f0;\n  transition: background-color 0.2s ease;\n}\n[_nghost-%COMP%]     .detail-table tbody tr:last-child {\n  border-bottom: none;\n}\n[_nghost-%COMP%]     .detail-table tbody tr:hover {\n  background-color: #f8f9fc;\n}\n[_nghost-%COMP%]     .detail-table .label-cell {\n  padding: 0.75rem 1rem;\n  color: #6b7280;\n  font-size: 0.875rem;\n  font-weight: 500;\n  width: 45%;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n[_nghost-%COMP%]     .detail-table .label-cell .mini-icon {\n  color: #9ca3af;\n  font-size: 0.875rem;\n}\n[_nghost-%COMP%]     .detail-table .value-cell {\n  padding: 0.75rem 1rem;\n  color: #1f2937;\n  font-size: 0.9rem;\n  font-weight: 600;\n}\n[_nghost-%COMP%]     .observations-content {\n  padding: 1rem;\n}\n[_nghost-%COMP%]     .observations-content .observation-box {\n  background: #f9fafb;\n  border-left: 4px solid #667eea;\n  padding: 1rem;\n  border-radius: 6px;\n}\n[_nghost-%COMP%]     .observations-content .observation-box .observation-text {\n  margin: 0;\n  color: #374151;\n  line-height: 1.6;\n  font-size: 0.95rem;\n}\n[_nghost-%COMP%]     .action-buttons-container {\n  background: white;\n  border-radius: 10px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);\n  padding: 1.5rem;\n  position: relative;\n  overflow: hidden;\n  text-align: center;\n}\n[_nghost-%COMP%]     .action-buttons-container::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 3px;\n  background:\n    linear-gradient(\n      90deg,\n      #f59e0b,\n      #d97706);\n}\n[_nghost-%COMP%]     .action-buttons-container .action-buttons {\n  display: flex;\n  gap: 1rem;\n  justify-content: center;\n  align-items: center;\n}\n[_nghost-%COMP%]     .action-buttons-container .action-info {\n  color: #6b7280;\n  font-size: 0.875rem;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n}\n[_nghost-%COMP%]     .action-buttons-container .action-info i {\n  color: #9ca3af;\n}\n.suggestion-pending[_ngcontent-%COMP%] {\n  color: #6b7280;\n}\n.suggestion-confirmed[_ngcontent-%COMP%] {\n  color: #15803d;\n  font-weight: 600;\n}\n.suggestion-modified[_ngcontent-%COMP%] {\n  color: #b45309;\n  font-weight: 600;\n}\n.motif-qte-text[_ngcontent-%COMP%] {\n  font-style: italic;\n  color: #b45309;\n}\n.dialog-content[_ngcontent-%COMP%] {\n  padding: 0.5rem 0;\n}\n.info-section[_ngcontent-%COMP%] {\n  background: #f8f9fa;\n  padding: 1rem;\n  border-radius: 6px;\n}\n.alert[_ngcontent-%COMP%] {\n  padding: 0.75rem;\n  border-radius: 6px;\n  display: flex;\n  align-items: flex-start;\n}\n.alert-info[_ngcontent-%COMP%] {\n  background: #e0f2fe;\n  color: #0369a1;\n}\n.required[_ngcontent-%COMP%]::after {\n  content: " *";\n  color: #ef4444;\n}\n.field[_ngcontent-%COMP%] {\n  margin-bottom: 1rem;\n}\n.field[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  margin-bottom: 0.5rem;\n  font-weight: 600;\n  color: #374151;\n}\n.field-checkbox[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n}\n.field-checkbox[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  cursor: pointer;\n  font-weight: 500;\n}\n.suggestion-summary[_ngcontent-%COMP%] {\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n  border-radius: 8px;\n  overflow: hidden;\n}\n.suggestion-summary[_ngcontent-%COMP%]   .summary-header[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #f59e0b 0%,\n      #d97706 100%);\n  color: white;\n  padding: 0.5rem 1rem;\n  font-weight: 600;\n  font-size: 0.875rem;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.suggestion-summary[_ngcontent-%COMP%]   .summary-content[_ngcontent-%COMP%] {\n  padding: 1rem;\n}\n.suggestion-summary[_ngcontent-%COMP%]   .summary-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  display: flex;\n  align-items: center;\n}\n[_nghost-%COMP%]     .p-inputnumber {\n  width: 100%;\n}\n[_nghost-%COMP%]     .p-inputnumber .p-inputnumber-input {\n  text-align: center;\n  font-weight: 600;\n  font-size: 1.25rem;\n}\n@keyframes _ngcontent-%COMP%_slideDown {\n  from {\n    opacity: 0;\n    transform: translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.badge-info[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #e0e7ff 0%,\n      #c7d2fe 100%);\n  color: #4338ca;\n  padding: 0.25rem 0.75rem;\n  border-radius: 20px;\n  font-size: 0.8rem;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.validation-summary[_ngcontent-%COMP%] {\n  background: #f0fdf4;\n  border: 1px solid #bbf7d0;\n  border-radius: 8px;\n  overflow: hidden;\n}\n.validation-summary[_ngcontent-%COMP%]   .summary-header[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #22c55e 0%,\n      #16a34a 100%);\n  color: white;\n  padding: 0.5rem 1rem;\n  font-weight: 600;\n  font-size: 0.875rem;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.validation-summary[_ngcontent-%COMP%]   .summary-content[_ngcontent-%COMP%] {\n  padding: 1rem;\n}\n.alert-success[_ngcontent-%COMP%] {\n  background: #dcfce7;\n  color: #166534;\n  border-left: 4px solid #22c55e;\n}\n/*# sourceMappingURL=situation-stock.component.css.map */'], data: { animation: [trigger("rowExpand", [state("collapsed", style({ height: "0px", minHeight: "0", display: "none" })), state("expanded", style({ height: "*" })), transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)"))])] } });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SituationStockComponent, { className: "SituationStockComponent", filePath: "src/app/pages/dashboard/admin/de/situation-stock/situation-stock.component.ts", lineNumber: 42 });
})();
export {
  SituationStockComponent
};
//# sourceMappingURL=chunk-6JTISUD3.js.map
