import {
  Panel,
  PanelModule
} from "./chunk-WJXIL2JJ.js";
import {
  TabViewModule
} from "./chunk-I3MJ27E7.js";
import {
  Messages,
  MessagesModule
} from "./chunk-MWCM7PKA.js";
import {
  ReferenceData
} from "./chunk-BZOKRWHY.js";
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
  Chip,
  ChipModule
} from "./chunk-SN3HAAMO.js";
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
import "./chunk-W3K3GK4Z.js";
import {
  CommonModule,
  NgForOf,
  NgIf
} from "./chunk-SQQPVFHK.js";
import {
  DestroyRef,
  computed,
  inject,
  signal,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
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

// src/app/pages/dashboard/agent-credit/correction-en-attente/update-correction-personne-physique/update-correction-personne-physique.component.ts
var _c0 = () => ({ width: "500px" });
var _c1 = () => ({ "width": "100%" });
var _c2 = () => [10, 25, 50];
function UpdateCorrectionPersonnePhysiqueComponent_p_tag_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-tag", 36);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("value", ctx_r0.getCorrectionStatusLabel())("severity", ctx_r0.getCorrectionStatusSeverity());
  }
}
function UpdateCorrectionPersonnePhysiqueComponent_ng_container_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275text(1, " \xA0 ");
    \u0275\u0275elementStart(2, "button", 37);
    \u0275\u0275listener("click", function UpdateCorrectionPersonnePhysiqueComponent_ng_container_13_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.rejetCorrection());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " \xA0 ");
    \u0275\u0275elementStart(4, "button", 38);
    \u0275\u0275listener("click", function UpdateCorrectionPersonnePhysiqueComponent_ng_container_13_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.validateCorrection());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.isLoading() || !ctx_r0.state().correctionApres);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.isLoading() || !ctx_r0.state().correctionApres);
  }
}
function UpdateCorrectionPersonnePhysiqueComponent_div_14_ng_template_2_p_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 46);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" Date de rejet: ", ctx_r0.state().correctionApres.updatedAt, " ");
  }
}
function UpdateCorrectionPersonnePhysiqueComponent_div_14_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42);
    \u0275\u0275element(1, "i", 43);
    \u0275\u0275elementStart(2, "div")(3, "strong");
    \u0275\u0275text(4, "Correction Rejet\xE9e");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 44);
    \u0275\u0275text(6, "Cette correction a \xE9t\xE9 rejet\xE9e et ne peut plus \xEAtre modifi\xE9e.");
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, UpdateCorrectionPersonnePhysiqueComponent_div_14_ng_template_2_p_7_Template, 2, 1, "p", 45);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(7);
    \u0275\u0275property("ngIf", (tmp_2_0 = ctx_r0.state().correctionApres) == null ? null : tmp_2_0.updatedAt);
  }
}
function UpdateCorrectionPersonnePhysiqueComponent_div_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 39)(1, "p-messages", 40);
    \u0275\u0275template(2, UpdateCorrectionPersonnePhysiqueComponent_div_14_ng_template_2_Template, 8, 1, "ng-template", 41);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("closable", false);
  }
}
function UpdateCorrectionPersonnePhysiqueComponent_div_15_ng_template_2_p_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 46);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" Date de validation: ", ctx_r0.state().correctionApres.updatedAt, " ");
  }
}
function UpdateCorrectionPersonnePhysiqueComponent_div_15_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42);
    \u0275\u0275element(1, "i", 49);
    \u0275\u0275elementStart(2, "div")(3, "strong");
    \u0275\u0275text(4, "Correction Valid\xE9e");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 44);
    \u0275\u0275text(6, "Cette correction a \xE9t\xE9 valid\xE9e et appliqu\xE9e dans le syst\xE8me SAF.");
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, UpdateCorrectionPersonnePhysiqueComponent_div_15_ng_template_2_p_7_Template, 2, 1, "p", 45);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(7);
    \u0275\u0275property("ngIf", (tmp_2_0 = ctx_r0.state().correctionApres) == null ? null : tmp_2_0.updatedAt);
  }
}
function UpdateCorrectionPersonnePhysiqueComponent_div_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 47)(1, "p-messages", 48);
    \u0275\u0275template(2, UpdateCorrectionPersonnePhysiqueComponent_div_15_ng_template_2_Template, 8, 1, "ng-template", 41);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("closable", false);
  }
}
function UpdateCorrectionPersonnePhysiqueComponent_ng_template_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-chip", 50);
  }
}
function UpdateCorrectionPersonnePhysiqueComponent_div_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 51);
    \u0275\u0275element(1, "p-progressSpinner", 52);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Chargement des donn\xE9es SAF...");
    \u0275\u0275elementEnd()();
  }
}
function UpdateCorrectionPersonnePhysiqueComponent_div_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 53);
    \u0275\u0275element(1, "i", 54);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 55);
    \u0275\u0275listener("click", function UpdateCorrectionPersonnePhysiqueComponent_div_22_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.loadCorrectionAvant(ctx_r0.state().codCliente));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.state().errorAvant);
  }
}
function UpdateCorrectionPersonnePhysiqueComponent_div_23_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 59)(1, "label");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 60);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r4 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r4.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.getFormattedDisplayValue(item_r4.avant, item_r4.field, "avant"));
  }
}
function UpdateCorrectionPersonnePhysiqueComponent_div_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 56)(1, "div", 57);
    \u0275\u0275template(2, UpdateCorrectionPersonnePhysiqueComponent_div_23_div_2_Template, 5, 2, "div", 58);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r0.state().comparisons);
  }
}
function UpdateCorrectionPersonnePhysiqueComponent_div_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 61);
    \u0275\u0275element(1, "i", 62);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Aucune donn\xE9e disponible");
    \u0275\u0275elementEnd()();
  }
}
function UpdateCorrectionPersonnePhysiqueComponent_ng_template_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-chip", 63);
  }
}
function UpdateCorrectionPersonnePhysiqueComponent_div_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 51);
    \u0275\u0275element(1, "p-progressSpinner", 52);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Chargement des donn\xE9es PostgreSQL...");
    \u0275\u0275elementEnd()();
  }
}
function UpdateCorrectionPersonnePhysiqueComponent_div_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 53);
    \u0275\u0275element(1, "i", 54);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 55);
    \u0275\u0275listener("click", function UpdateCorrectionPersonnePhysiqueComponent_div_29_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.loadCorrectionApres(ctx_r0.state().codCliente));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.state().errorApres);
  }
}
function UpdateCorrectionPersonnePhysiqueComponent_div_30_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 59)(1, "label");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 60);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r6 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r6.label);
    \u0275\u0275advance();
    \u0275\u0275classProp("highlight-difference", item_r6.isDifferent);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getFormattedDisplayValue(item_r6.apres, item_r6.field, "apres"), " ");
  }
}
function UpdateCorrectionPersonnePhysiqueComponent_div_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 56)(1, "div", 57);
    \u0275\u0275template(2, UpdateCorrectionPersonnePhysiqueComponent_div_30_div_2_Template, 5, 4, "div", 58);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r0.state().comparisons);
  }
}
function UpdateCorrectionPersonnePhysiqueComponent_div_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 61);
    \u0275\u0275element(1, "i", 62);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Pas encore corrig\xE9");
    \u0275\u0275elementEnd()();
  }
}
function UpdateCorrectionPersonnePhysiqueComponent_p_card_32_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 70)(1, "h3");
    \u0275\u0275element(2, "i", 71);
    \u0275\u0275text(3, " Tableau de Comparaison ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "p-chip", 72);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275property("label", ctx_r0.differenceCount() + " diff\xE9rence(s) trouv\xE9e(s)")("styleClass", ctx_r0.differenceCount() > 0 ? "custom-chip-warning" : "custom-chip-success");
  }
}
function UpdateCorrectionPersonnePhysiqueComponent_p_card_32_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 73);
    \u0275\u0275text(2, "Champ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th", 74);
    \u0275\u0275text(4, "Avant (SAF)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th", 74);
    \u0275\u0275text(6, "Apr\xE8s (PostgreSQL)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 75);
    \u0275\u0275text(8, "\xC9tat");
    \u0275\u0275elementEnd()();
  }
}
function UpdateCorrectionPersonnePhysiqueComponent_p_card_32_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td")(5, "span", 76);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "td")(8, "span", 76);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "td");
    \u0275\u0275element(11, "p-tag", 77);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const comparison_r7 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("row-different", comparison_r7.isDifferent);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(comparison_r7.label);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.getFormattedDisplayValue(comparison_r7.avant, comparison_r7.field, "avant"), " ");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("text-warning", comparison_r7.isDifferent);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getFormattedDisplayValue(comparison_r7.apres, comparison_r7.field, "apres"), " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("value", comparison_r7.isDifferent ? "Diff\xE9rent" : "Identique")("severity", ctx_r0.getDifferenceSeverity(comparison_r7.isDifferent));
  }
}
function UpdateCorrectionPersonnePhysiqueComponent_p_card_32_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 78);
    \u0275\u0275text(2, " Aucune donn\xE9e \xE0 comparer ");
    \u0275\u0275elementEnd()();
  }
}
function UpdateCorrectionPersonnePhysiqueComponent_p_card_32_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 79)(1, "span", 80);
    \u0275\u0275element(2, "i", 81);
    \u0275\u0275text(3, " Identiques: ");
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "span", 80);
    \u0275\u0275element(7, "i", 82);
    \u0275\u0275text(8, " Diff\xE9rents: ");
    \u0275\u0275elementStart(9, "strong");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.getIdentiquesCount());
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.differenceCount());
  }
}
function UpdateCorrectionPersonnePhysiqueComponent_p_card_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-card", 64);
    \u0275\u0275template(1, UpdateCorrectionPersonnePhysiqueComponent_p_card_32_ng_template_1_Template, 5, 2, "ng-template", 65);
    \u0275\u0275elementStart(2, "p-table", 66);
    \u0275\u0275template(3, UpdateCorrectionPersonnePhysiqueComponent_p_card_32_ng_template_3_Template, 9, 0, "ng-template", 65)(4, UpdateCorrectionPersonnePhysiqueComponent_p_card_32_ng_template_4_Template, 12, 9, "ng-template", 67)(5, UpdateCorrectionPersonnePhysiqueComponent_p_card_32_ng_template_5_Template, 3, 0, "ng-template", 68)(6, UpdateCorrectionPersonnePhysiqueComponent_p_card_32_ng_template_6_Template, 11, 2, "ng-template", 69);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r0.state().comparisons)("paginator", true)("rows", 10)("rowsPerPageOptions", \u0275\u0275pureFunction0(4, _c2));
  }
}
function UpdateCorrectionPersonnePhysiqueComponent_small_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 83);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.state().rejectionMotif.length, " caract\xE8re(s) ");
  }
}
function UpdateCorrectionPersonnePhysiqueComponent_ng_template_51_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 84);
    \u0275\u0275listener("click", function UpdateCorrectionPersonnePhysiqueComponent_ng_template_51_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeRejectionDialog());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "button", 85);
    \u0275\u0275listener("click", function UpdateCorrectionPersonnePhysiqueComponent_ng_template_51_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.submitRejection());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r0.state().submittingRejection);
    \u0275\u0275advance();
    \u0275\u0275property("loading", ctx_r0.state().submittingRejection)("disabled", !ctx_r0.state().rejectionMotif || ctx_r0.state().rejectionMotif.length < 10);
  }
}
var UpdateCorrectionPersonnePhysiqueComponent = class _UpdateCorrectionPersonnePhysiqueComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  userService = inject(UserService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  destroyRef = inject(DestroyRef);
  state = signal({
    codCliente: "",
    correctionAvant: null,
    correctionApres: null,
    loadingAvant: false,
    loadingApres: false,
    errorAvant: null,
    errorApres: null,
    activeTab: 0,
    comparisons: [],
    showRejectionDialog: false,
    rejectionMotif: "",
    submittingRejection: false
  });
  // Computed properties
  isLoading = computed(() => this.state().loadingAvant || this.state().loadingApres);
  hasData = computed(() => this.state().correctionAvant || this.state().correctionApres);
  hasBothData = computed(() => this.state().correctionAvant && this.state().correctionApres);
  differenceCount = computed(() => this.state().comparisons.filter((c) => c.isDifferent).length);
  // New computed properties for rejection status
  isRejected = computed(() => this.state().correctionApres?.correctionStatut === "REJETE");
  isValidated = computed(() => this.state().correctionApres?.correctionStatut === "VALIDE");
  canPerformActions = computed(() => {
    const status = this.state().correctionApres?.correctionStatut;
    return status !== "REJETE" && status !== "VALIDE";
  });
  messages = [];
  ngOnInit() {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const codCliente = params["codCliente"];
      if (codCliente) {
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { codCliente }));
        this.loadData(codCliente);
      } else {
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Code client non fourni"
        });
        this.router.navigate(["/dashboards/correction-en-attente"]);
      }
    });
  }
  // You can also add a method to get the status label
  getCorrectionStatusLabel() {
    const status = this.state().correctionApres?.correctionStatut;
    switch (status) {
      case "REJETE":
        return "Rejet\xE9e";
      case "VALIDE":
        return "Valid\xE9e";
      case "EN_COURS":
        return "En cours";
      case "EN_ATTENTE":
        return "En attente";
      default:
        return status || "Non d\xE9fini";
    }
  }
  // And a method to get the status severity for p-tag
  getCorrectionStatusSeverity() {
    const statut = this.state().correctionApres?.correctionStatut;
    if (statut === "VALIDATED") {
      return "success";
    }
    if (statut === "REJECTED") {
      return "danger";
    }
    if (statut === "PENDING") {
      return "warn";
    }
    return "info";
  }
  /**
   * Load data from both sources
   */
  loadData(codCliente) {
    this.loadCorrectionAvant(codCliente);
    this.loadCorrectionApres(codCliente);
  }
  /**
   * Load data from SAF SQL Server (Correction AVANT)
   */
  loadCorrectionAvant(codCliente) {
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { loadingAvant: true, errorAvant: null }));
    this.userService.getFicheSignaletique$(codCliente).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        if (response.data && response.data.data) {
          const safData = response.data.data;
          const processedData = {
            codCliente: safData.codCliente,
            nomCliente: safData.nomCliente,
            nomClient: safData.primerApellido,
            prenomClient: safData.primerNombre,
            numId: safData.numId,
            typePiece: safData.codTipoId,
            telPrincipal: safData.telPrincipal,
            telOtro: safData.telOtro,
            fecVencim: safData.fecVencim,
            fechNacimiento: safData.fechNacimiento,
            lieuxNaiss: safData.lugarNacimiento,
            nationalite: safData.nacionalidad,
            pays: safData.codPais,
            indSexo: safData.indSexo,
            estCivil: safData.estCivil,
            conjoint: safData.nomConyugue || safData.codCteConyugue,
            nbrEnfant: safData.numHijos,
            detDireccion: safData.detDireccion,
            codProvincia: safData.codProvincia,
            district: safData.codDistrito,
            codeAgence: safData.codAgencia,
            nomBeneficiario: safData.nomBeneficiario,
            relacBeneficiario: safData.relacBeneficiario,
            codActividad: safData.codActividad,
            codProfesion: safData.codProfesion,
            codSector: safData.codSector,
            typeEntre: safData.tenenciaPuesto,
            typeHabit: safData.tenenciaVivienda,
            nbrAnnee: safData.antiguedadResidencia,
            nbrAnnee2: safData.antiguedadPuesto,
            statutClt: safData.indEstado,
            provServDestino: safData.provServDestino,
            metadata: response.data
          };
          this.state.update((s) => __spreadProps(__spreadValues({}, s), {
            correctionAvant: processedData,
            loadingAvant: false
          }));
          this.compareData();
          this.messageService.add({
            severity: "success",
            summary: "Succ\xE8s",
            detail: "Donn\xE9es SAF charg\xE9es (Correction AVANT)"
          });
        } else {
          this.state.update((s) => __spreadProps(__spreadValues({}, s), {
            errorAvant: "Aucune donn\xE9e trouv\xE9e",
            loadingAvant: false
          }));
        }
      },
      error: (error) => {
        this.state.update((s) => __spreadProps(__spreadValues({}, s), {
          errorAvant: error.message || "Erreur lors du chargement",
          loadingAvant: false
        }));
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Impossible de charger les donn\xE9es SAF"
        });
      }
    });
  }
  /**
   * Load data from PostgreSQL (Correction APRES)
   */
  loadCorrectionApres(codCliente) {
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { loadingApres: true, errorApres: null }));
    this.userService.getPersonnePhysique$(codCliente).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        if (response.data?.personnePhysique) {
          const personnePhysique = response.data.personnePhysique;
          if (personnePhysique) {
            this.processDateFields(personnePhysique);
          }
          this.state.update((s) => __spreadProps(__spreadValues({}, s), {
            correctionApres: personnePhysique,
            loadingApres: false
          }));
          this.compareData();
          this.messageService.add({
            severity: "success",
            summary: "Succ\xE8s",
            detail: "Donn\xE9es PostgreSQL charg\xE9es (Correction APRES)"
          });
        } else {
          this.state.update((s) => __spreadProps(__spreadValues({}, s), {
            errorApres: "Aucune donn\xE9e trouv\xE9e dans PostgreSQL",
            loadingApres: false
          }));
          this.messages = [{ severity: "info", summary: "Information", detail: "Cette personne n'a pas encore \xE9t\xE9 corrig\xE9e" }];
        }
      },
      error: (error) => {
        this.state.update((s) => __spreadProps(__spreadValues({}, s), {
          errorApres: error.message || "Erreur lors du chargement",
          loadingApres: false
        }));
        this.messageService.add({
          severity: "warn",
          summary: "Attention",
          detail: "Donn\xE9es non disponibles dans PostgreSQL"
        });
      }
    });
  }
  /**
   * Process date fields from arrays to strings
   */
  processDateFields(data) {
    if (data.fecVencim && Array.isArray(data.fecVencim)) {
      data.fecVencim = this.arrayToDateString(data.fecVencim);
    }
    if (data.fechNacimiento && Array.isArray(data.fechNacimiento)) {
      data.fechNacimiento = this.arrayToDateString(data.fechNacimiento);
    }
    if (data.createdAt && Array.isArray(data.createdAt)) {
      data.createdAt = this.arrayToDateTimeString(data.createdAt);
    }
    if (data.updatedAt && Array.isArray(data.updatedAt)) {
      data.updatedAt = this.arrayToDateTimeString(data.updatedAt);
    }
  }
  arrayToDateString(dateArray) {
    if (!dateArray || dateArray.length < 3)
      return "";
    const [year, month, day] = dateArray;
    return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
  }
  arrayToDateTimeString(dateArray) {
    if (!dateArray || dateArray.length < 6)
      return "";
    const [year, month, day, hour, minute] = dateArray;
    return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  }
  /**
   * Compare data between AVANT and APRES
   */
  compareData() {
    if (!this.hasBothData())
      return;
    const avant = this.state().correctionAvant;
    const apres = this.state().correctionApres;
    const fieldsToCompare = [
      { field: "codCliente", label: "Code Client" },
      { field: "nomCliente", label: "Nom Complet" },
      { field: "nomClient", label: "Nom" },
      { field: "prenomClient", label: "Pr\xE9nom" },
      { field: "numId", label: "Num\xE9ro ID" },
      { field: "typePiece", label: "Type de Pi\xE8ce" },
      { field: "telPrincipal", label: "T\xE9l\xE9phone Principal" },
      { field: "telOtro", label: "Autre T\xE9l\xE9phone" },
      { field: "fecVencim", label: "Date d'Expiration" },
      { field: "fechNacimiento", label: "Date de Naissance" },
      { field: "lieuxNaiss", label: "Lieu de Naissance" },
      { field: "nationalite", label: "Nationalit\xE9" },
      { field: "pays", label: "Pays" },
      { field: "indSexo", label: "Sexe" },
      { field: "estCivil", label: "\xC9tat Civil" },
      { field: "conjoint", label: "Conjoint" },
      { field: "nbrEnfant", label: "Nombre d'Enfants" },
      { field: "detDireccion", label: "Adresse" },
      { field: "codProvincia", label: "Province" },
      { field: "district", label: "District" },
      { field: "codeAgence", label: "Code Agence" },
      { field: "codActividad", label: "Code Activit\xE9" },
      { field: "codProfesion", label: "Code Profession" },
      { field: "codSector", label: "Code Secteur" },
      { field: "nomBeneficiario", label: "B\xE9n\xE9ficiaire" },
      { field: "relacBeneficiario", label: "Relation B\xE9n\xE9ficiaire" },
      { field: "typeEntre", label: "Type Entreprise" },
      { field: "typeHabit", label: "Type Habitation" },
      { field: "nbrAnnee", label: "Anciennet\xE9 R\xE9sidence" },
      { field: "nbrAnnee2", label: "Anciennet\xE9 Poste" },
      { field: "statutClt", label: "Statut Client" },
      { field: "provServDestino", label: "Service Destination" }
    ];
    const comparisons = fieldsToCompare.map((item) => {
      const avantValue = this.getNestedValue(avant, item.field);
      const apresValue = this.getNestedValue(apres, item.field);
      return {
        field: item.field,
        label: item.label,
        avant: avantValue,
        apres: apresValue,
        isDifferent: this.areValuesDifferent(avantValue, apresValue)
      };
    });
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { comparisons }));
  }
  /**
   * Get nested value from object
   */
  getNestedValue(obj, path) {
    if (!obj)
      return null;
    const keys = path.split(".");
    let value = obj;
    for (const key of keys) {
      value = value?.[key];
      if (value === void 0)
        return null;
    }
    return value;
  }
  /**
   * Check if two values are different
   */
  areValuesDifferent(val1, val2) {
    if (val1 == null && val2 == null)
      return false;
    if (val1 == null || val2 == null)
      return true;
    const str1 = String(val1).trim();
    const str2 = String(val2).trim();
    return str1 !== str2;
  }
  /**
   * Navigate back to list
   */
  goBack() {
    this.router.navigate(["/dashboards/correction-en-attente"]);
  }
  /**
   * Reload all data
   */
  refresh() {
    const codCliente = this.state().codCliente;
    if (codCliente) {
      this.loadData(codCliente);
    }
  }
  /**
   * Get label for a reference code
   */
  getReferenceLabel(code, type, provinceCode) {
    if (!code)
      return "-";
    let item;
    switch (type) {
      case "sector":
        item = ReferenceData.SECTORS.find((s) => s.code === code);
        return item ? item.label : code;
      case "activity":
        item = ReferenceData.ACTIVITIES.find((a) => a.code === code);
        return item ? item.label : code;
      case "profession":
        item = ReferenceData.PROFESSIONS.find((p) => p.code === code);
        return item ? item.label : code;
      case "idType":
        item = ReferenceData.ID_TYPES.find((i) => i.code === code);
        return item ? item.label : code;
      case "province":
        item = ReferenceData.PROVINCES.find((p) => p.code === code);
        return item ? item.label : code;
      case "district":
        if (provinceCode) {
          const districts = ReferenceData.getDistrictsByProvince(provinceCode);
          item = districts.find((d) => d.code === code);
          return item ? item.label : code;
        }
        return code;
      default:
        return code;
    }
  }
  /**
   * Get formatted value for display
   */
  getDisplayValue(value) {
    if (value == null || value === "")
      return "-";
    if (typeof value === "boolean")
      return value ? "Oui" : "Non";
    return String(value);
  }
  /**
   * Get formatted display value with label lookup for specific fields
   */
  getFormattedDisplayValue(value, field, dataSource) {
    if (value == null || value === "")
      return "-";
    switch (field) {
      case "typePiece":
        return this.getReferenceLabel(value, "idType");
      case "codProvincia":
        return this.getReferenceLabel(value, "province");
      case "district":
        const provinceCode = dataSource === "avant" ? this.state().correctionAvant?.codProvincia : this.state().correctionApres?.codProvincia;
        return this.getReferenceLabel(value, "district", provinceCode);
      case "codActividad":
        return this.getReferenceLabel(value, "activity");
      case "codProfesion":
        return this.getReferenceLabel(value, "profession");
      case "codSector":
        return this.getReferenceLabel(value, "sector");
      case "indSexo":
        return value === "M" ? "Masculin" : value === "F" ? "F\xE9minin" : value;
      case "estCivil":
        return this.getEtatCivilLabel(value);
      case "statutClt":
        return this.getStatutLabel(value);
      case "typeEntre":
      case "typeHabit":
        return this.getTypeHabitationLabel(value);
      default:
        return this.getDisplayValue(value);
    }
  }
  /**
   * Get état civil label
   */
  getEtatCivilLabel(code) {
    const labels = {
      S: "C\xE9libataire",
      M: "Mari\xE9(e)",
      D: "Divorc\xE9(e)",
      V: "Veuf/Veuve",
      C: "Concubinage",
      O: "Autre"
    };
    return labels[code] || code;
  }
  /**
   * Get statut label
   */
  getStatutLabel(code) {
    const labels = {
      A: "Actif",
      S: "Suspendu",
      V: "Valid\xE9",
      R: "Rejet\xE9",
      I: "Inactif"
    };
    return labels[code] || code;
  }
  /**
   * Get type habitation label
   */
  getTypeHabitationLabel(code) {
    const labels = {
      PO: "Propri\xE9taire",
      AL: "Locataire",
      PR: "Propri\xE9taire",
      LO: "Locataire",
      HG: "H\xE9berg\xE9",
      AU: "Autre"
    };
    return labels[code] || code;
  }
  /**
   * Get severity for difference tag
   */
  getDifferenceSeverity(isDifferent) {
    return isDifferent ? "warn" : "success";
  }
  /**
   * Open rejection dialog
   */
  rejetCorrection() {
    this.state.update((s) => __spreadProps(__spreadValues({}, s), {
      rejectionMotif: "",
      showRejectionDialog: true
    }));
  }
  /**
   * Close rejection dialog
   */
  closeRejectionDialog() {
    this.state.update((s) => __spreadProps(__spreadValues({}, s), {
      showRejectionDialog: false,
      rejectionMotif: ""
    }));
  }
  /**
   * Submit rejection with motif
   */
  /**
   * Submit rejection with motif
   */
  submitRejection() {
    const motif = this.state().rejectionMotif.trim();
    if (!motif) {
      this.messageService.add({
        severity: "warn",
        summary: "Validation",
        detail: "Le motif de rejet est obligatoire"
      });
      return;
    }
    if (motif.length < 10) {
      this.messageService.add({
        severity: "warn",
        summary: "Validation",
        detail: "Le motif doit contenir au moins 10 caract\xE8res"
      });
      return;
    }
    const userId = this.state().correctionApres?.idUser;
    if (!userId) {
      this.messageService.add({
        severity: "error",
        summary: "Erreur",
        detail: "ID utilisateur non trouv\xE9 dans les donn\xE9es de correction"
      });
      return;
    }
    const rejectionData = {
      userId,
      libele: motif,
      codCliente: this.state().codCliente,
      codAgence: this.state().correctionApres?.codeAgence || this.state().correctionAvant?.codeAgence,
      statut: "REJETE",
      personnePhysiqueId: this.state().correctionApres?.id || null
    };
    console.log("Rejection data prepared:", rejectionData);
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { submittingRejection: true }));
    this.userService.rejetCorrection$(rejectionData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.state.update((s) => __spreadProps(__spreadValues({}, s), {
          submittingRejection: false,
          showRejectionDialog: false,
          rejectionMotif: ""
        }));
        if (response.code === 200) {
          this.messageService.add({
            severity: "success",
            summary: "Succ\xE8s",
            detail: "La correction a \xE9t\xE9 rejet\xE9e avec succ\xE8s"
          });
          if (this.state().correctionApres) {
            this.state.update((s) => __spreadProps(__spreadValues({}, s), {
              correctionApres: __spreadProps(__spreadValues({}, s.correctionApres), {
                correctionStatut: "REJETE"
              })
            }));
          }
          setTimeout(() => {
            this.router.navigate(["/dashboards/correction-en-attente"]);
          }, 2e3);
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Erreur",
            detail: response.message || "Erreur lors du rejet"
          });
        }
      },
      error: (error) => {
        this.state.update((s) => __spreadProps(__spreadValues({}, s), {
          submittingRejection: false
        }));
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Erreur lors du rejet: " + (error.message || error)
        });
        console.error("Erreur de rejet:", error);
      }
    });
  }
  /**
   * Validate correction - Updates SAF SQL Server from PostgreSQL data
   */
  validateCorrection() {
    if (!this.state().correctionApres) {
      this.messageService.add({
        severity: "warn",
        summary: "Attention",
        detail: "Aucune correction disponible \xE0 valider"
      });
      return;
    }
    const differences = this.state().comparisons.filter((c) => c.isDifferent);
    const differencesList = differences.map((d) => `\u2022 ${d.label}: "${this.getFormattedDisplayValue(d.avant, d.field, "avant")}" \u2192 "${this.getFormattedDisplayValue(d.apres, d.field, "apres")}"`).join("<br>");
    this.confirmationService.confirm({
      message: `\xCAtes-vous s\xFBr de vouloir valider cette correction et mettre \xE0 jour la base SAF?<br><br>
                     <strong>Code Client:</strong> ${this.state().codCliente}<br><br>
                     <strong>${differences.length} modification(s) seront appliqu\xE9es:</strong><br>
                     ${differencesList}`,
      header: "Confirmation de validation",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Oui, valider",
      rejectLabel: "Annuler",
      acceptButtonStyleClass: "p-button-success",
      rejectButtonStyleClass: "p-button-secondary",
      accept: () => {
        this.performValidation();
      },
      reject: () => {
        this.messageService.add({
          severity: "info",
          summary: "Annul\xE9",
          detail: "Validation annul\xE9e"
        });
      }
    });
  }
  /**
   * Perform the actual validation after confirmation
   */
  performValidation() {
    const updateData = this.prepareUpdateData();
    if (!updateData) {
      this.messageService.add({
        severity: "error",
        summary: "Erreur",
        detail: "Impossible de pr\xE9parer les donn\xE9es pour la mise \xE0 jour"
      });
      return;
    }
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { loadingAvant: true }));
    this.userService.updateFicheSignaletique$(updateData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { loadingAvant: false }));
        if (response.code === 200 || response.data && response.code === 0) {
          this.messageService.add({
            severity: "success",
            summary: "Succ\xE8s",
            detail: "La fiche signal\xE9tique a \xE9t\xE9 mise \xE0 jour avec succ\xE8s dans SAF"
          });
          this.updateCorrectionStatus();
          setTimeout(() => {
            this.loadData(this.state().codCliente);
          }, 1500);
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Erreur",
            detail: response.message || "\xC9chec de la mise \xE0 jour"
          });
        }
      },
      error: (error) => {
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { loadingAvant: false }));
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Erreur lors de la mise \xE0 jour: " + (error.message || error)
        });
        console.error("Erreur de validation:", error);
      }
    });
  }
  /**
   * Prepare update data from PostgreSQL data
   */
  prepareUpdateData() {
    const apresData = this.state().correctionApres;
    if (!apresData)
      return null;
    const formatDate = (dateStr) => {
      if (!dateStr)
        return "";
      const parts = dateStr.split("/");
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
      }
      return dateStr;
    };
    return {
      telPrincipal: apresData.telPrincipal || "",
      codCliente: apresData.codCliente || this.state().codCliente,
      telOtro: apresData.telOtro || "",
      nomCliente: apresData.nomCliente || "",
      nomClient: apresData.nomClient || "",
      prenomClient: apresData.prenomClient || "",
      fecVencim: formatDate(apresData.fecVencim),
      fechNacimiento: formatDate(apresData.fechNacimiento),
      lieuxNaiss: apresData.lieuxNaiss || "",
      nationalite: apresData.nationalite || "",
      numId: apresData.numId || "",
      nomBeneficiario: apresData.nomBeneficiario || "",
      relacBeneficiario: apresData.relacBeneficiario || "",
      detDireccion: apresData.detDireccion || "",
      codProvincia: apresData.codProvincia || "",
      codActividad: apresData.codActividad || "",
      codProfesion: apresData.codProfesion || "",
      codSector: apresData.codSector || "",
      indSexo: apresData.indSexo || "",
      estCivil: apresData.estCivil || "",
      typeHabit: apresData.typeHabit || "",
      nbrAnnee: parseInt(apresData.nbrAnnee) || 0,
      typeEntre: apresData.typeEntre || "",
      nbrAnnee2: parseInt(apresData.nbrAnnee2) || 0,
      nbrEnfant: parseInt(apresData.nbrEnfant) || 0,
      district: apresData.district || "",
      agence: apresData.agence || "",
      pays: apresData.pays || "GN",
      typePiece: apresData.typePiece || "",
      idUser: apresData.idUser || null,
      statutClt: apresData.statutClt || "A",
      idManagerAgent: apresData.idManagerAgent || null,
      dateAttente: apresData.dateAttente ? formatDate(apresData.dateAttente) : null,
      nature: apresData.nature || "PP",
      codeAgence: apresData.codeAgence || "",
      provServDestino: apresData.provServDestino || "",
      conjoint: apresData.conjoint || ""
    };
  }
  /**
   * Update correction status in PostgreSQL (optional)
   */
  updateCorrectionStatus() {
    console.log("Mise \xE0 jour du statut de correction dans PostgreSQL");
  }
  getIdentiquesCount() {
    return this.state().comparisons.filter((c) => !c.isDifferent).length;
  }
  static \u0275fac = function UpdateCorrectionPersonnePhysiqueComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UpdateCorrectionPersonnePhysiqueComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _UpdateCorrectionPersonnePhysiqueComponent, selectors: [["app-update-correction-personne-physique"]], features: [\u0275\u0275ProvidersFeature([MessageService, ConfirmationService])], decls: 52, vars: 33, consts: [[1, "correction-detail-container"], ["styleClass", "header-card"], [1, "header-content"], [1, "title-section"], ["pButton", "", "icon", "pi pi-arrow-left", "pTooltip", "Retour \xE0 la liste", 1, "p-button-text", "p-button-secondary", 3, "click"], [1, "pi", "pi-user-edit"], ["class", "ml-2", 3, "value", "severity", 4, "ngIf"], [1, "action-buttons"], ["pButton", "", "icon", "pi pi-refresh", "label", "Actualiser", 1, "p-button-outlined", 3, "click", "loading"], [4, "ngIf"], ["class", "status-message rejection-status-message", 4, "ngIf"], ["class", "status-message validation-status-message", 4, "ngIf"], [3, "valueChange", "value", "enableService", "closable"], [1, "content-grid"], ["header", "CORRECTION AVANT (SAF SQL Server)", 3, "toggleable"], ["pTemplate", "icons"], [1, "panel-content"], ["class", "loading-state", 4, "ngIf"], ["class", "error-state", 4, "ngIf"], ["class", "data-display", 4, "ngIf"], ["class", "no-data", 4, "ngIf"], ["header", "CORRECTION APRES (PostgreSQL)", 3, "toggleable"], ["styleClass", "comparison-card", 4, "ngIf"], ["header", "Rejeter la Correction", 3, "visibleChange", "visible", "modal", "closable", "closeOnEscape"], [1, "rejection-dialog-content"], [1, "field"], ["for", "motif", 1, "required"], [1, "text-danger"], [1, "text-muted", "d-block", "mb-2"], ["id", "motif", "pTextarea", "", "rows", "5", "placeholder", "Entrez le motif de rejet...", 1, "w-full", 3, "ngModelChange", "ngModel", "disabled"], ["class", "text-muted", 4, "ngIf"], [1, "mt-3", "p-2", "bg-warning-light", "border-round"], [1, "pi", "pi-exclamation-triangle", "text-warning", "mr-2"], [1, "text-warning", "font-semibold"], [1, "text-sm"], ["pTemplate", "footer"], [1, "ml-2", 3, "value", "severity"], ["pButton", "", "icon", "pi pi-ban", "label", "Rejeter la Correction", 1, "p-button-danger", 3, "click", "disabled"], ["pButton", "", "icon", "pi pi-check", "label", "Valider", 1, "p-button-success", 3, "click", "disabled"], [1, "status-message", "rejection-status-message"], ["severity", "warn", 3, "closable"], ["pTemplate", ""], [1, "flex", "align-items-center"], [1, "pi", "pi-ban", "mr-2"], [1, "mt-1", "mb-0"], ["class", "mt-1 mb-0 text-sm", 4, "ngIf"], [1, "mt-1", "mb-0", "text-sm"], [1, "status-message", "validation-status-message"], ["severity", "success", 3, "closable"], [1, "pi", "pi-check-circle", "mr-2"], ["label", "Source: SAF", "styleClass", "custom-chip-info"], [1, "loading-state"], ["styleClass", "w-4rem h-4rem", "strokeWidth", "3"], [1, "error-state"], [1, "pi", "pi-exclamation-triangle"], ["pButton", "", "label", "R\xE9essayer", "icon", "pi pi-refresh", 1, "p-button-sm", 3, "click"], [1, "data-display"], [1, "info-grid"], ["class", "info-item", 4, "ngFor", "ngForOf"], [1, "info-item"], [1, "value"], [1, "no-data"], [1, "pi", "pi-inbox"], ["label", "Source: PostgreSQL", "styleClass", "custom-chip-success"], ["styleClass", "comparison-card"], ["pTemplate", "header"], ["styleClass", "p-datatable-striped", 3, "value", "paginator", "rows", "rowsPerPageOptions"], ["pTemplate", "body"], ["pTemplate", "emptymessage"], ["pTemplate", "summary"], [1, "comparison-header"], [1, "pi", "pi-chart-line"], [3, "label", "styleClass"], [2, "width", "25%"], [2, "width", "30%"], [2, "width", "15%"], [1, "value-display"], [3, "value", "severity"], ["colspan", "4", 1, "text-center"], [1, "comparison-summary"], [1, "summary-item"], [1, "pi", "pi-check-circle", "text-success"], [1, "pi", "pi-exclamation-circle", "text-warning"], [1, "text-muted"], ["pButton", "", "type", "button", "label", "Annuler", "icon", "pi pi-times", 1, "p-button-text", 3, "click", "disabled"], ["pButton", "", "type", "button", "label", "Confirmer le Rejet", "icon", "pi pi-ban", 1, "p-button-danger", 3, "click", "loading", "disabled"]], template: function UpdateCorrectionPersonnePhysiqueComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "p-toast")(2, "p-confirmDialog");
      \u0275\u0275elementStart(3, "p-card", 1)(4, "div", 2)(5, "div", 3)(6, "button", 4);
      \u0275\u0275listener("click", function UpdateCorrectionPersonnePhysiqueComponent_Template_button_click_6_listener() {
        return ctx.goBack();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "h2");
      \u0275\u0275element(8, "i", 5);
      \u0275\u0275text(9);
      \u0275\u0275template(10, UpdateCorrectionPersonnePhysiqueComponent_p_tag_10_Template, 1, 2, "p-tag", 6);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(11, "div", 7)(12, "button", 8);
      \u0275\u0275listener("click", function UpdateCorrectionPersonnePhysiqueComponent_Template_button_click_12_listener() {
        return ctx.refresh();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275template(13, UpdateCorrectionPersonnePhysiqueComponent_ng_container_13_Template, 5, 2, "ng-container", 9);
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(14, UpdateCorrectionPersonnePhysiqueComponent_div_14_Template, 3, 1, "div", 10)(15, UpdateCorrectionPersonnePhysiqueComponent_div_15_Template, 3, 1, "div", 11);
      \u0275\u0275elementStart(16, "p-messages", 12);
      \u0275\u0275twoWayListener("valueChange", function UpdateCorrectionPersonnePhysiqueComponent_Template_p_messages_valueChange_16_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.messages, $event) || (ctx.messages = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "div", 13)(18, "p-panel", 14);
      \u0275\u0275template(19, UpdateCorrectionPersonnePhysiqueComponent_ng_template_19_Template, 1, 0, "ng-template", 15);
      \u0275\u0275elementStart(20, "div", 16);
      \u0275\u0275template(21, UpdateCorrectionPersonnePhysiqueComponent_div_21_Template, 4, 0, "div", 17)(22, UpdateCorrectionPersonnePhysiqueComponent_div_22_Template, 5, 1, "div", 18)(23, UpdateCorrectionPersonnePhysiqueComponent_div_23_Template, 3, 1, "div", 19)(24, UpdateCorrectionPersonnePhysiqueComponent_div_24_Template, 4, 0, "div", 20);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(25, "p-panel", 21);
      \u0275\u0275template(26, UpdateCorrectionPersonnePhysiqueComponent_ng_template_26_Template, 1, 0, "ng-template", 15);
      \u0275\u0275elementStart(27, "div", 16);
      \u0275\u0275template(28, UpdateCorrectionPersonnePhysiqueComponent_div_28_Template, 4, 0, "div", 17)(29, UpdateCorrectionPersonnePhysiqueComponent_div_29_Template, 5, 1, "div", 18)(30, UpdateCorrectionPersonnePhysiqueComponent_div_30_Template, 3, 1, "div", 19)(31, UpdateCorrectionPersonnePhysiqueComponent_div_31_Template, 4, 0, "div", 20);
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(32, UpdateCorrectionPersonnePhysiqueComponent_p_card_32_Template, 7, 5, "p-card", 22);
      \u0275\u0275elementStart(33, "p-dialog", 23);
      \u0275\u0275twoWayListener("visibleChange", function UpdateCorrectionPersonnePhysiqueComponent_Template_p_dialog_visibleChange_33_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.state().showRejectionDialog, $event) || (ctx.state().showRejectionDialog = $event);
        return $event;
      });
      \u0275\u0275elementStart(34, "div", 24)(35, "div", 25)(36, "label", 26);
      \u0275\u0275text(37, " Motif de rejet ");
      \u0275\u0275elementStart(38, "span", 27);
      \u0275\u0275text(39, "*");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(40, "small", 28);
      \u0275\u0275text(41, " Veuillez expliquer la raison du rejet de cette correction (minimum 10 caract\xE8res) ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(42, "textarea", 29);
      \u0275\u0275twoWayListener("ngModelChange", function UpdateCorrectionPersonnePhysiqueComponent_Template_textarea_ngModelChange_42_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.state().rejectionMotif, $event) || (ctx.state().rejectionMotif = $event);
        return $event;
      });
      \u0275\u0275text(43, "                ");
      \u0275\u0275elementEnd();
      \u0275\u0275template(44, UpdateCorrectionPersonnePhysiqueComponent_small_44_Template, 2, 1, "small", 30);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(45, "div", 31);
      \u0275\u0275element(46, "i", 32);
      \u0275\u0275elementStart(47, "span", 33);
      \u0275\u0275text(48, "Attention:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(49, "span", 34);
      \u0275\u0275text(50, " Cette action est irr\xE9versible. La correction sera marqu\xE9e comme rejet\xE9e.");
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(51, UpdateCorrectionPersonnePhysiqueComponent_ng_template_51_Template, 2, 3, "ng-template", 35);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      let tmp_1_0;
      \u0275\u0275advance(9);
      \u0275\u0275textInterpolate1(" D\xE9tails Correction - ", ctx.state().codCliente, " ");
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", (tmp_1_0 = ctx.state().correctionApres) == null ? null : tmp_1_0.correctionStatut);
      \u0275\u0275advance(2);
      \u0275\u0275property("loading", ctx.isLoading());
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.canPerformActions());
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.isRejected());
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.isValidated());
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("value", ctx.messages);
      \u0275\u0275property("enableService", false)("closable", true);
      \u0275\u0275advance(2);
      \u0275\u0275property("toggleable", true);
      \u0275\u0275advance(3);
      \u0275\u0275property("ngIf", ctx.state().loadingAvant);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.state().errorAvant && !ctx.state().loadingAvant);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.state().correctionAvant && !ctx.state().loadingAvant);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.state().correctionAvant && !ctx.state().loadingAvant && !ctx.state().errorAvant);
      \u0275\u0275advance();
      \u0275\u0275property("toggleable", true);
      \u0275\u0275advance(3);
      \u0275\u0275property("ngIf", ctx.state().loadingApres);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.state().errorApres && !ctx.state().loadingApres);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.state().correctionApres && !ctx.state().loadingApres);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.state().correctionApres && !ctx.state().loadingApres && !ctx.state().errorApres);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.hasBothData());
      \u0275\u0275advance();
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(31, _c0));
      \u0275\u0275twoWayProperty("visible", ctx.state().showRejectionDialog);
      \u0275\u0275property("modal", true)("closable", !ctx.state().submittingRejection)("closeOnEscape", !ctx.state().submittingRejection);
      \u0275\u0275advance(9);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(32, _c1));
      \u0275\u0275twoWayProperty("ngModel", ctx.state().rejectionMotif);
      \u0275\u0275property("disabled", ctx.state().submittingRejection);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngIf", ctx.state().rejectionMotif);
    }
  }, dependencies: [
    CommonModule,
    NgForOf,
    NgIf,
    FormsModule,
    DefaultValueAccessor,
    NgControlStatus,
    NgModel,
    CardModule,
    Card,
    PrimeTemplate,
    ButtonModule,
    ButtonDirective,
    ProgressSpinnerModule,
    ProgressSpinner,
    ToastModule,
    Toast,
    DividerModule,
    TabViewModule,
    TableModule,
    Table,
    TagModule,
    Tag,
    PanelModule,
    Panel,
    MessagesModule,
    Messages,
    ChipModule,
    Chip,
    TooltipModule,
    Tooltip,
    ConfirmDialogModule,
    ConfirmDialog,
    DialogModule,
    Dialog,
    InputTextModule,
    TextareaModule,
    Textarea
  ], styles: ["\n\n.correction-detail-container[_ngcontent-%COMP%] {\n  padding: 1.5rem;\n}\n.correction-detail-container[_ngcontent-%COMP%]   .header-card[_ngcontent-%COMP%] {\n  margin-bottom: 1.5rem;\n}\n.correction-detail-container[_ngcontent-%COMP%]   .header-card[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 1rem;\n}\n.correction-detail-container[_ngcontent-%COMP%]   .header-card[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%]   .title-section[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n}\n.correction-detail-container[_ngcontent-%COMP%]   .header-card[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%]   .title-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.5rem;\n  font-weight: 600;\n  color: var(--text-color);\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.correction-detail-container[_ngcontent-%COMP%]   .header-card[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%]   .title-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--primary-color);\n  font-size: 1.3rem;\n}\n.correction-detail-container[_ngcontent-%COMP%]   .header-card[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%]   .action-buttons[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.75rem;\n  flex-wrap: wrap;\n}\n.correction-detail-container[_ngcontent-%COMP%]   .content-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1.5rem;\n  margin-bottom: 1.5rem;\n}\n@media (max-width: 1024px) {\n  .correction-detail-container[_ngcontent-%COMP%]   .content-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.correction-detail-container[_ngcontent-%COMP%]   .content-grid[_ngcontent-%COMP%]   .panel-content[_ngcontent-%COMP%] {\n  padding: 1rem;\n  min-height: 300px;\n}\n.correction-detail-container[_ngcontent-%COMP%]   .content-grid[_ngcontent-%COMP%]   .panel-content[_ngcontent-%COMP%]   .loading-state[_ngcontent-%COMP%], \n.correction-detail-container[_ngcontent-%COMP%]   .content-grid[_ngcontent-%COMP%]   .panel-content[_ngcontent-%COMP%]   .error-state[_ngcontent-%COMP%], \n.correction-detail-container[_ngcontent-%COMP%]   .content-grid[_ngcontent-%COMP%]   .panel-content[_ngcontent-%COMP%]   .no-data[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  min-height: 250px;\n  gap: 1rem;\n}\n.correction-detail-container[_ngcontent-%COMP%]   .content-grid[_ngcontent-%COMP%]   .panel-content[_ngcontent-%COMP%]   .loading-state[_ngcontent-%COMP%]   i[_ngcontent-%COMP%], \n.correction-detail-container[_ngcontent-%COMP%]   .content-grid[_ngcontent-%COMP%]   .panel-content[_ngcontent-%COMP%]   .error-state[_ngcontent-%COMP%]   i[_ngcontent-%COMP%], \n.correction-detail-container[_ngcontent-%COMP%]   .content-grid[_ngcontent-%COMP%]   .panel-content[_ngcontent-%COMP%]   .no-data[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  color: var(--text-color-secondary);\n}\n.correction-detail-container[_ngcontent-%COMP%]   .content-grid[_ngcontent-%COMP%]   .panel-content[_ngcontent-%COMP%]   .loading-state[_ngcontent-%COMP%]   i.pi-exclamation-triangle[_ngcontent-%COMP%], \n.correction-detail-container[_ngcontent-%COMP%]   .content-grid[_ngcontent-%COMP%]   .panel-content[_ngcontent-%COMP%]   .error-state[_ngcontent-%COMP%]   i.pi-exclamation-triangle[_ngcontent-%COMP%], \n.correction-detail-container[_ngcontent-%COMP%]   .content-grid[_ngcontent-%COMP%]   .panel-content[_ngcontent-%COMP%]   .no-data[_ngcontent-%COMP%]   i.pi-exclamation-triangle[_ngcontent-%COMP%] {\n  color: var(--orange-500);\n}\n.correction-detail-container[_ngcontent-%COMP%]   .content-grid[_ngcontent-%COMP%]   .panel-content[_ngcontent-%COMP%]   .loading-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n.correction-detail-container[_ngcontent-%COMP%]   .content-grid[_ngcontent-%COMP%]   .panel-content[_ngcontent-%COMP%]   .error-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n.correction-detail-container[_ngcontent-%COMP%]   .content-grid[_ngcontent-%COMP%]   .panel-content[_ngcontent-%COMP%]   .no-data[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  margin: 0;\n  font-size: 1rem;\n}\n.correction-detail-container[_ngcontent-%COMP%]   .content-grid[_ngcontent-%COMP%]   .panel-content[_ngcontent-%COMP%]   .data-display[_ngcontent-%COMP%]   .info-grid[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n}\n.correction-detail-container[_ngcontent-%COMP%]   .content-grid[_ngcontent-%COMP%]   .panel-content[_ngcontent-%COMP%]   .data-display[_ngcontent-%COMP%]   .info-grid[_ngcontent-%COMP%]   .info-item[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 140px 1fr;\n  gap: 1rem;\n  padding: 0.5rem;\n  border-bottom: 1px solid var(--surface-border);\n}\n.correction-detail-container[_ngcontent-%COMP%]   .content-grid[_ngcontent-%COMP%]   .panel-content[_ngcontent-%COMP%]   .data-display[_ngcontent-%COMP%]   .info-grid[_ngcontent-%COMP%]   .info-item[_ngcontent-%COMP%]:last-child {\n  border-bottom: none;\n}\n.correction-detail-container[_ngcontent-%COMP%]   .content-grid[_ngcontent-%COMP%]   .panel-content[_ngcontent-%COMP%]   .data-display[_ngcontent-%COMP%]   .info-grid[_ngcontent-%COMP%]   .info-item[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: var(--text-color-secondary);\n  font-size: 0.875rem;\n}\n.correction-detail-container[_ngcontent-%COMP%]   .content-grid[_ngcontent-%COMP%]   .panel-content[_ngcontent-%COMP%]   .data-display[_ngcontent-%COMP%]   .info-grid[_ngcontent-%COMP%]   .info-item[_ngcontent-%COMP%]   .value[_ngcontent-%COMP%] {\n  color: var(--text-color);\n  word-break: break-word;\n}\n.correction-detail-container[_ngcontent-%COMP%]   .content-grid[_ngcontent-%COMP%]   .panel-content[_ngcontent-%COMP%]   .data-display[_ngcontent-%COMP%]   .info-grid[_ngcontent-%COMP%]   .info-item[_ngcontent-%COMP%]   .value.highlight-difference[_ngcontent-%COMP%] {\n  color: var(--orange-600);\n  font-weight: 600;\n}\n.correction-detail-container[_ngcontent-%COMP%]   .comparison-card[_ngcontent-%COMP%]     .p-card-header {\n  padding: 1rem 1.5rem;\n  border-bottom: 1px solid var(--surface-border);\n}\n.correction-detail-container[_ngcontent-%COMP%]   .comparison-card[_ngcontent-%COMP%]   .comparison-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.correction-detail-container[_ngcontent-%COMP%]   .comparison-card[_ngcontent-%COMP%]   .comparison-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.25rem;\n  font-weight: 600;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.correction-detail-container[_ngcontent-%COMP%]   .comparison-card[_ngcontent-%COMP%]   .comparison-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--primary-color);\n}\n.correction-detail-container[_ngcontent-%COMP%]   .comparison-card[_ngcontent-%COMP%]   .row-different[_ngcontent-%COMP%] {\n  background-color: var(--orange-50) !important;\n}\n@media (prefers-color-scheme: dark) {\n  .correction-detail-container[_ngcontent-%COMP%]   .comparison-card[_ngcontent-%COMP%]   .row-different[_ngcontent-%COMP%] {\n    background-color: rgba(251, 146, 60, 0.1) !important;\n  }\n}\n.correction-detail-container[_ngcontent-%COMP%]   .comparison-card[_ngcontent-%COMP%]   .value-display[_ngcontent-%COMP%] {\n  font-size: 0.95rem;\n}\n.correction-detail-container[_ngcontent-%COMP%]   .comparison-card[_ngcontent-%COMP%]   .value-display.text-warning[_ngcontent-%COMP%] {\n  color: var(--orange-600);\n  font-weight: 600;\n}\n.correction-detail-container[_ngcontent-%COMP%]   .comparison-card[_ngcontent-%COMP%]   .comparison-summary[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 2rem;\n  padding: 1rem 0;\n}\n.correction-detail-container[_ngcontent-%COMP%]   .comparison-card[_ngcontent-%COMP%]   .comparison-summary[_ngcontent-%COMP%]   .summary-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  color: var(--text-color-secondary);\n}\n.correction-detail-container[_ngcontent-%COMP%]   .comparison-card[_ngcontent-%COMP%]   .comparison-summary[_ngcontent-%COMP%]   .summary-item[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 1rem;\n}\n.correction-detail-container[_ngcontent-%COMP%]   .comparison-card[_ngcontent-%COMP%]   .comparison-summary[_ngcontent-%COMP%]   .summary-item[_ngcontent-%COMP%]   i.text-success[_ngcontent-%COMP%] {\n  color: var(--green-500);\n}\n.correction-detail-container[_ngcontent-%COMP%]   .comparison-card[_ngcontent-%COMP%]   .comparison-summary[_ngcontent-%COMP%]   .summary-item[_ngcontent-%COMP%]   i.text-warning[_ngcontent-%COMP%] {\n  color: var(--orange-500);\n}\n.correction-detail-container[_ngcontent-%COMP%]   .comparison-card[_ngcontent-%COMP%]   .comparison-summary[_ngcontent-%COMP%]   .summary-item[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--text-color);\n  font-weight: 600;\n}\n.correction-detail-container[_ngcontent-%COMP%]     .custom-chip-info {\n  background-color: var(--blue-100);\n  color: var(--blue-700);\n}\n.correction-detail-container[_ngcontent-%COMP%]     .custom-chip-info .p-chip-text {\n  font-weight: 600;\n  font-size: 0.875rem;\n}\n.correction-detail-container[_ngcontent-%COMP%]     .custom-chip-success {\n  background-color: var(--green-100);\n  color: var(--green-700);\n}\n.correction-detail-container[_ngcontent-%COMP%]     .custom-chip-success .p-chip-text {\n  font-weight: 600;\n  font-size: 0.875rem;\n}\n.correction-detail-container[_ngcontent-%COMP%]     .custom-chip-warning {\n  background-color: var(--orange-100);\n  color: var(--orange-700);\n}\n.correction-detail-container[_ngcontent-%COMP%]     .custom-chip-warning .p-chip-text {\n  font-weight: 600;\n  font-size: 0.875rem;\n}\n@media (prefers-color-scheme: dark) {\n  .correction-detail-container[_ngcontent-%COMP%]     .custom-chip-info {\n    background-color: rgba(59, 130, 246, 0.2);\n    color: var(--blue-300);\n  }\n  .correction-detail-container[_ngcontent-%COMP%]     .custom-chip-success {\n    background-color: rgba(34, 197, 94, 0.2);\n    color: var(--green-300);\n  }\n  .correction-detail-container[_ngcontent-%COMP%]     .custom-chip-warning {\n    background-color: rgba(251, 146, 60, 0.2);\n    color: var(--orange-300);\n  }\n}\n@media (max-width: 768px) {\n  .correction-detail-container[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .correction-detail-container[_ngcontent-%COMP%]   .header-card[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%]   .title-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n    font-size: 1.2rem;\n  }\n  .correction-detail-container[_ngcontent-%COMP%]   .header-card[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%]   .action-buttons[_ngcontent-%COMP%] {\n    width: 100%;\n    justify-content: stretch;\n  }\n  .correction-detail-container[_ngcontent-%COMP%]   .header-card[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%]   .action-buttons[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n    flex: 1;\n  }\n  .correction-detail-container[_ngcontent-%COMP%]   .content-grid[_ngcontent-%COMP%] {\n    gap: 1rem;\n  }\n  .correction-detail-container[_ngcontent-%COMP%]   .content-grid[_ngcontent-%COMP%]   .panel-content[_ngcontent-%COMP%]   .data-display[_ngcontent-%COMP%]   .info-grid[_ngcontent-%COMP%]   .info-item[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .correction-detail-container[_ngcontent-%COMP%]   .content-grid[_ngcontent-%COMP%]   .panel-content[_ngcontent-%COMP%]   .data-display[_ngcontent-%COMP%]   .info-grid[_ngcontent-%COMP%]   .info-item[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n    margin-bottom: 0.25rem;\n  }\n  .correction-detail-container[_ngcontent-%COMP%]   .comparison-card[_ngcontent-%COMP%]   .comparison-summary[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 0.5rem;\n  }\n}\n@media print {\n  .correction-detail-container[_ngcontent-%COMP%]   .action-buttons[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .correction-detail-container[_ngcontent-%COMP%]   .content-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .correction-detail-container[_ngcontent-%COMP%]   .content-grid[_ngcontent-%COMP%]     .p-panel-icons {\n    display: none;\n  }\n}\n.rejection-status-message[_ngcontent-%COMP%] {\n  margin: 1rem 0;\n}\n.rejection-status-message[_ngcontent-%COMP%]     .p-messages {\n  margin: 0;\n}\n.rejection-status-message[_ngcontent-%COMP%]     .p-messages .p-message {\n  background: rgba(251, 191, 36, 0.1);\n  border: 1px solid rgba(251, 191, 36, 0.3);\n  color: var(--text-color);\n}\n.rejection-status-message[_ngcontent-%COMP%]     .p-messages .p-message .p-message-wrapper {\n  padding: 1rem 1.25rem;\n}\n.rejection-status-message[_ngcontent-%COMP%]     .p-messages .p-message .p-message-wrapper .flex {\n  display: flex;\n}\n.rejection-status-message[_ngcontent-%COMP%]     .p-messages .p-message .p-message-wrapper .flex i {\n  color: var(--orange-600);\n  font-size: 1.5rem;\n  margin-right: 1rem;\n}\n.rejection-status-message[_ngcontent-%COMP%]     .p-messages .p-message .p-message-wrapper .flex strong {\n  display: block;\n  font-size: 1.1rem;\n  margin-bottom: 0.25rem;\n}\n.rejection-status-message[_ngcontent-%COMP%]     .p-messages .p-message .p-message-wrapper .flex p {\n  color: var(--text-color-secondary);\n  font-size: 0.95rem;\n}\n.comparison-card.rejected[_ngcontent-%COMP%]     .p-card {\n  border: 2px solid var(--orange-400);\n}\n.comparison-card.rejected[_ngcontent-%COMP%]     .p-card .p-card-header {\n  background-color: rgba(251, 191, 36, 0.05);\n}\n/*# sourceMappingURL=update-correction-personne-physique.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(UpdateCorrectionPersonnePhysiqueComponent, { className: "UpdateCorrectionPersonnePhysiqueComponent", filePath: "src/app/pages/dashboard/agent-credit/correction-en-attente/update-correction-personne-physique/update-correction-personne-physique.component.ts", lineNumber: 85 });
})();
export {
  UpdateCorrectionPersonnePhysiqueComponent
};
//# sourceMappingURL=chunk-PI5LUYX3.js.map
