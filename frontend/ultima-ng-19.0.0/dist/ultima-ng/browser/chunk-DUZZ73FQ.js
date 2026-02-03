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
import "./chunk-FZELBHWZ.js";
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
  NgClass
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
  ɵɵpureFunction1,
  ɵɵpureFunction2,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-ZKKMBKIA.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/pages/dashboard/credit/individuel/attente/detail/resume-analyse-financiere/resume-analyse-financiere.component.ts
var _c0 = () => ({ "min-width": "100%" });
var _c1 = (a0) => ({ "bg-green-100 font-bold": a0 });
var _c2 = (a0) => ({ "text-green-700 font-bold": a0 });
var _c3 = (a0, a1) => ({ "bg-gray-100": a0, "bg-red-100": a1 });
var _c4 = (a0, a1) => ({ "text-800 font-bold": a0, "text-red-700 font-bold": a1 });
var _c5 = (a0) => ({ "text-red-700 font-bold": a0 });
var _c6 = (a0) => ({ "bg-teal-100 font-bold": a0 });
var _c7 = (a0) => ({ "text-teal-700 font-bold": a0 });
var _c8 = (a0) => ({ "bg-orange-100 font-bold": a0 });
var _c9 = (a0) => ({ "text-orange-700 font-bold": a0 });
var _c10 = (a0) => ({ "bg-indigo-100 font-bold": a0 });
var _c11 = (a0) => ({ "text-indigo-700 font-bold": a0 });
var _c12 = (a0) => ({ "bg-cyan-100 font-bold": a0 });
var _c13 = (a0) => ({ "text-cyan-700 font-bold": a0 });
var _forTrack0 = ($index, $item) => $item.label;
function ResumeAnalyseFinanciereComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275element(1, "p-progressSpinner");
    \u0275\u0275elementEnd();
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-card")(1, "div", 6);
    \u0275\u0275element(2, "i", 7);
    \u0275\u0275elementStart(3, "h3", 8);
    \u0275\u0275text(4, "Erreur lors du chargement");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 9);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p-button", 10);
    \u0275\u0275listener("onClick", function ResumeAnalyseFinanciereComponent_Conditional_9_Template_p_button_onClick_7_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.chargerSynthese());
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.state().error);
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30);
    \u0275\u0275element(1, "i", 31);
    \u0275\u0275elementStart(2, "h4", 32);
    \u0275\u0275text(3, "Demande de Cr\xE9dit");
    \u0275\u0275elementEnd()();
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 33);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 34);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r4 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r4.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r4.value);
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35);
    \u0275\u0275element(1, "i", 36);
    \u0275\u0275elementStart(2, "h4", 37);
    \u0275\u0275text(3, "Param\xE8tres d'Analyse");
    \u0275\u0275elementEnd()();
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 33);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 34);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r5 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r5.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r5.value);
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 38);
    \u0275\u0275element(1, "i", 39);
    \u0275\u0275elementStart(2, "h4", 40);
    \u0275\u0275text(3, "ACTIF");
    \u0275\u0275elementEnd()();
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 41);
    \u0275\u0275text(2, "\xC9l\xE9ments");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th", 42);
    \u0275\u0275text(4, "\xC9valuation actuelle (N)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th", 42);
    \u0275\u0275text(6, "\xC9valuation pr\xE9c\xE9dente (N-1)");
    \u0275\u0275elementEnd()();
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 43)(1, "td", 43);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 44);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 44);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r6 = ctx.$implicit;
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(7, _c1, item_r6.isTotal));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(9, _c2, item_r6.isTotal));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r6.label);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(11, _c2, item_r6.isTotal));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r6.valueN);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(13, _c2, item_r6.isTotal));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r6.valueN1);
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 41);
    \u0275\u0275text(2, "\xC9l\xE9ments");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th", 42);
    \u0275\u0275text(4, "\xC9valuation actuelle (N)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th", 42);
    \u0275\u0275text(6, "\xC9valuation pr\xE9c\xE9dente (N-1)");
    \u0275\u0275elementEnd()();
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 43)(1, "td", 43);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 44);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 44);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r7 = ctx.$implicit;
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(7, _c1, item_r7.isTotal));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(9, _c2, item_r7.isTotal));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r7.label);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(11, _c2, item_r7.isTotal));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r7.valueN);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(13, _c2, item_r7.isTotal));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r7.valueN1);
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 45)(1, "td", 46);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 47);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 47);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r8 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r8.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r8.valueN);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r8.valueN1);
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 48);
    \u0275\u0275element(1, "i", 49);
    \u0275\u0275elementStart(2, "h4", 50);
    \u0275\u0275text(3, "PASSIF");
    \u0275\u0275elementEnd()();
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 41);
    \u0275\u0275text(2, "\xC9l\xE9ments");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th", 42);
    \u0275\u0275text(4, "\xC9valuation actuelle (N)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th", 42);
    \u0275\u0275text(6, "\xC9valuation pr\xE9c\xE9dente (N-1)");
    \u0275\u0275elementEnd()();
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 43)(1, "td", 43);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 44);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 44);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r9 = ctx.$implicit;
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(7, _c3, item_r9.isHeader, item_r9.isTotal));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(10, _c4, item_r9.isHeader, item_r9.isTotal));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r9.label);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(13, _c5, item_r9.isTotal));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r9.valueN);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(15, _c5, item_r9.isTotal));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r9.valueN1);
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30);
    \u0275\u0275element(1, "i", 51);
    \u0275\u0275elementStart(2, "h4", 32);
    \u0275\u0275text(3, "Indicateurs Financiers");
    \u0275\u0275elementEnd()();
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 41);
    \u0275\u0275text(2, "Indicateur");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th", 42);
    \u0275\u0275text(4, "P\xE9riode N");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th", 42);
    \u0275\u0275text(6, "P\xE9riode N-1");
    \u0275\u0275elementEnd()();
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 52);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 53);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 53);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r10 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r10.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r10.valueN);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r10.valueN1);
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 54);
    \u0275\u0275element(1, "i", 55);
    \u0275\u0275elementStart(2, "h4", 56);
    \u0275\u0275text(3, "Produits");
    \u0275\u0275elementEnd()();
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_51_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 57);
    \u0275\u0275text(2, "\xC9l\xE9ments");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th", 42);
    \u0275\u0275text(4, "Montant (N)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th", 42);
    \u0275\u0275text(6, "Montant (N-1)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 42);
    \u0275\u0275text(8, "Montant (N+1)");
    \u0275\u0275elementEnd()();
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 43)(1, "td", 43);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 44);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 44);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 44);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r11 = ctx.$implicit;
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(9, _c6, item_r11.isTotal));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(11, _c7, item_r11.isTotal));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r11.label);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(13, _c7, item_r11.isTotal));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r11.valueN);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(15, _c7, item_r11.isTotal));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r11.valueN1);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(17, _c7, item_r11.isTotal));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r11.valueNplus1);
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_55_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 58);
    \u0275\u0275element(1, "i", 59);
    \u0275\u0275elementStart(2, "h4", 60);
    \u0275\u0275text(3, "Charges d'Exploitation");
    \u0275\u0275elementEnd()();
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_57_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 57);
    \u0275\u0275text(2, "\xC9l\xE9ments");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th", 42);
    \u0275\u0275text(4, "Montant (N)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th", 42);
    \u0275\u0275text(6, "Montant (N-1)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 42);
    \u0275\u0275text(8, "Montant (N+1)");
    \u0275\u0275elementEnd()();
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_58_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 43)(1, "td", 43);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 44);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 44);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 44);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r12 = ctx.$implicit;
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(9, _c8, item_r12.isTotal));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(11, _c9, item_r12.isTotal));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r12.label);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(13, _c9, item_r12.isTotal));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r12.valueN);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(15, _c9, item_r12.isTotal));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r12.valueN1);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(17, _c9, item_r12.isTotal));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r12.valueNplus1);
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_61_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 61);
    \u0275\u0275element(1, "i", 62);
    \u0275\u0275elementStart(2, "h4", 63);
    \u0275\u0275text(3, "R\xE9sultats");
    \u0275\u0275elementEnd()();
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_63_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 57);
    \u0275\u0275text(2, "\xC9l\xE9ments");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th", 42);
    \u0275\u0275text(4, "Montant (N)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th", 42);
    \u0275\u0275text(6, "Montant (N-1)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 42);
    \u0275\u0275text(8, "Montant (N+1)");
    \u0275\u0275elementEnd()();
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_64_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 43)(1, "td", 43);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 44);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 44);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 44);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r13 = ctx.$implicit;
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(9, _c10, item_r13.isTotal));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(11, _c11, item_r13.isTotal));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r13.label);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(13, _c11, item_r13.isTotal));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r13.valueN);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(15, _c11, item_r13.isTotal));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r13.valueN1);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(17, _c11, item_r13.isTotal));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r13.valueNplus1);
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_71_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 64);
    \u0275\u0275element(1, "i", 65);
    \u0275\u0275elementStart(2, "h4", 66);
    \u0275\u0275text(3, "Besoin en Investissement");
    \u0275\u0275elementEnd()();
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_73_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 41);
    \u0275\u0275text(2, "\xC9l\xE9ments");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th", 42);
    \u0275\u0275text(4, "Montant");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th", 42);
    \u0275\u0275text(6, "Ajustement");
    \u0275\u0275elementEnd()();
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_74_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 43)(1, "td", 43);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 44);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 44);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r14 = ctx.$implicit;
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(7, _c12, item_r14.isTotal));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(9, _c13, item_r14.isTotal));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r14.label);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(11, _c13, item_r14.isTotal));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r14.montant);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(13, _c13, item_r14.isTotal));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r14.ajustement);
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_77_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 64);
    \u0275\u0275element(1, "i", 67);
    \u0275\u0275elementStart(2, "h4", 66);
    \u0275\u0275text(3, "Besoin en Exploitation");
    \u0275\u0275elementEnd()();
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_79_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 41);
    \u0275\u0275text(2, "\xC9l\xE9ments");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th", 42);
    \u0275\u0275text(4, "Montant");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th", 42);
    \u0275\u0275text(6, "Ajustement");
    \u0275\u0275elementEnd()();
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_80_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 43)(1, "td", 43);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 44);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 44);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r15 = ctx.$implicit;
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(7, _c12, item_r15.isTotal));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(9, _c13, item_r15.isTotal));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r15.label);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(11, _c13, item_r15.isTotal));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r15.montant);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(13, _c13, item_r15.isTotal));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r15.ajustement);
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_Conditional_81_ng_template_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35);
    \u0275\u0275element(1, "i", 72);
    \u0275\u0275elementStart(2, "h4", 37);
    \u0275\u0275text(3, "Ratios Financiers");
    \u0275\u0275elementEnd()();
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_Conditional_81_For_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 71)(1, "div", 73)(2, "div", 74);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 75);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ratio_r16 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ratio_r16.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ratio_r16.value);
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_Conditional_81_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16)(1, "h3", 68);
    \u0275\u0275element(2, "i", 69);
    \u0275\u0275text(3, " 4. RATIOS CALCUL\xC9S ");
    \u0275\u0275element(4, "p-tag", 70);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 16)(6, "p-card");
    \u0275\u0275template(7, ResumeAnalyseFinanciereComponent_Conditional_10_Conditional_81_ng_template_7_Template, 4, 0, "ng-template", 13);
    \u0275\u0275elementStart(8, "div", 11);
    \u0275\u0275repeaterCreate(9, ResumeAnalyseFinanciereComponent_Conditional_10_Conditional_81_For_10_Template, 6, 2, "div", 71, _forTrack0);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(9);
    \u0275\u0275repeater(ctx_r1.getRatiosData());
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_Conditional_82_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 27)(1, "div", 76)(2, "div", 77);
    \u0275\u0275element(3, "i", 78);
    \u0275\u0275elementStart(4, "div")(5, "div", 79);
    \u0275\u0275text(6, "Information");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 80);
    \u0275\u0275text(8, " Les ratios financiers seront calcul\xE9s et visibles par le comit\xE9 de cr\xE9dit apr\xE8s validation de votre saisie. ");
    \u0275\u0275elementEnd()()()()();
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 11)(1, "div", 12)(2, "p-card");
    \u0275\u0275template(3, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_3_Template, 4, 0, "ng-template", 13);
    \u0275\u0275elementStart(4, "p-table", 14);
    \u0275\u0275template(5, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_5_Template, 5, 2, "ng-template", 15);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(6, "div", 12)(7, "p-card");
    \u0275\u0275template(8, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_8_Template, 4, 0, "ng-template", 13);
    \u0275\u0275elementStart(9, "p-table", 14);
    \u0275\u0275template(10, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_10_Template, 5, 2, "ng-template", 15);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "div", 16)(12, "h3", 17);
    \u0275\u0275element(13, "i", 18);
    \u0275\u0275text(14, " 1. BILAN ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div", 16)(16, "p-card");
    \u0275\u0275template(17, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_17_Template, 4, 0, "ng-template", 13);
    \u0275\u0275elementStart(18, "h5", 19);
    \u0275\u0275text(19, "Actif Immobilis\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "p-table", 20);
    \u0275\u0275template(21, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_21_Template, 7, 0, "ng-template", 13)(22, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_22_Template, 7, 15, "ng-template", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "h5", 21);
    \u0275\u0275text(24, "Actif Circulant");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "p-table", 20);
    \u0275\u0275template(26, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_26_Template, 7, 0, "ng-template", 13)(27, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_27_Template, 7, 15, "ng-template", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "div", 22)(29, "p-table", 14);
    \u0275\u0275template(30, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_30_Template, 7, 3, "ng-template", 15);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(31, "div", 16)(32, "p-card");
    \u0275\u0275template(33, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_33_Template, 4, 0, "ng-template", 13);
    \u0275\u0275elementStart(34, "p-table", 20);
    \u0275\u0275template(35, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_35_Template, 7, 0, "ng-template", 13)(36, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_36_Template, 7, 17, "ng-template", 15);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(37, "div", 16)(38, "p-card");
    \u0275\u0275template(39, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_39_Template, 4, 0, "ng-template", 13);
    \u0275\u0275elementStart(40, "p-table", 20);
    \u0275\u0275template(41, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_41_Template, 7, 0, "ng-template", 13)(42, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_42_Template, 7, 3, "ng-template", 15);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(43, "div", 16)(44, "h3", 23);
    \u0275\u0275element(45, "i", 24);
    \u0275\u0275text(46, " 2. RENTABILIT\xC9 DE L'ACTIVIT\xC9 ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(47, "div", 16)(48, "p-card");
    \u0275\u0275template(49, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_49_Template, 4, 0, "ng-template", 13);
    \u0275\u0275elementStart(50, "p-table", 20);
    \u0275\u0275template(51, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_51_Template, 9, 0, "ng-template", 13)(52, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_52_Template, 9, 19, "ng-template", 15);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(53, "div", 16)(54, "p-card");
    \u0275\u0275template(55, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_55_Template, 4, 0, "ng-template", 13);
    \u0275\u0275elementStart(56, "p-table", 20);
    \u0275\u0275template(57, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_57_Template, 9, 0, "ng-template", 13)(58, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_58_Template, 9, 19, "ng-template", 15);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(59, "div", 16)(60, "p-card");
    \u0275\u0275template(61, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_61_Template, 4, 0, "ng-template", 13);
    \u0275\u0275elementStart(62, "p-table", 20);
    \u0275\u0275template(63, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_63_Template, 9, 0, "ng-template", 13)(64, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_64_Template, 9, 19, "ng-template", 15);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(65, "div", 16)(66, "h3", 25);
    \u0275\u0275element(67, "i", 26);
    \u0275\u0275text(68, " 3. \xC9VALUATION DU BESOIN R\xC9EL EN CR\xC9DIT ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(69, "div", 12)(70, "p-card");
    \u0275\u0275template(71, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_71_Template, 4, 0, "ng-template", 13);
    \u0275\u0275elementStart(72, "p-table", 20);
    \u0275\u0275template(73, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_73_Template, 7, 0, "ng-template", 13)(74, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_74_Template, 7, 15, "ng-template", 15);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(75, "div", 12)(76, "p-card");
    \u0275\u0275template(77, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_77_Template, 4, 0, "ng-template", 13);
    \u0275\u0275elementStart(78, "p-table", 20);
    \u0275\u0275template(79, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_79_Template, 7, 0, "ng-template", 13)(80, ResumeAnalyseFinanciereComponent_Conditional_10_ng_template_80_Template, 7, 15, "ng-template", 15);
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(81, ResumeAnalyseFinanciereComponent_Conditional_10_Conditional_81_Template, 11, 0)(82, ResumeAnalyseFinanciereComponent_Conditional_10_Conditional_82_Template, 9, 0, "div", 27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(83, "div", 28)(84, "p-button", 29);
    \u0275\u0275listener("onClick", function ResumeAnalyseFinanciereComponent_Conditional_10_Template_p_button_onClick_84_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.retour());
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("value", ctx_r1.getDemandeData())("tableStyle", \u0275\u0275pureFunction0(26, _c0));
    \u0275\u0275advance(5);
    \u0275\u0275property("value", ctx_r1.getAnalyseData())("tableStyle", \u0275\u0275pureFunction0(27, _c0));
    \u0275\u0275advance(11);
    \u0275\u0275property("value", ctx_r1.getBilanActifImmobiliseData())("tableStyle", \u0275\u0275pureFunction0(28, _c0));
    \u0275\u0275advance(5);
    \u0275\u0275property("value", ctx_r1.getBilanActifCirculantData())("tableStyle", \u0275\u0275pureFunction0(29, _c0));
    \u0275\u0275advance(4);
    \u0275\u0275property("value", ctx_r1.getBilanTotalActifData())("tableStyle", \u0275\u0275pureFunction0(30, _c0));
    \u0275\u0275advance(5);
    \u0275\u0275property("value", ctx_r1.getBilanPassifData())("tableStyle", \u0275\u0275pureFunction0(31, _c0));
    \u0275\u0275advance(6);
    \u0275\u0275property("value", ctx_r1.getBilanIndicateursData())("tableStyle", \u0275\u0275pureFunction0(32, _c0));
    \u0275\u0275advance(10);
    \u0275\u0275property("value", ctx_r1.getRentabiliteProduitsData())("tableStyle", \u0275\u0275pureFunction0(33, _c0));
    \u0275\u0275advance(6);
    \u0275\u0275property("value", ctx_r1.getRentabiliteChargesData())("tableStyle", \u0275\u0275pureFunction0(34, _c0));
    \u0275\u0275advance(6);
    \u0275\u0275property("value", ctx_r1.getRentabiliteResultatsData())("tableStyle", \u0275\u0275pureFunction0(35, _c0));
    \u0275\u0275advance(10);
    \u0275\u0275property("value", ctx_r1.getBesoinInvestissementData())("tableStyle", \u0275\u0275pureFunction0(36, _c0));
    \u0275\u0275advance(6);
    \u0275\u0275property("value", ctx_r1.getBesoinExploitationData())("tableStyle", \u0275\u0275pureFunction0(37, _c0));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.canViewRatios() ? 81 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isAgentCredit() ? 82 : -1);
  }
}
function ResumeAnalyseFinanciereComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-card")(1, "div", 81);
    \u0275\u0275element(2, "i", 82);
    \u0275\u0275elementStart(3, "h3", 9);
    \u0275\u0275text(4, "Aucune donn\xE9e disponible");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 83);
    \u0275\u0275text(6, "L'analyse financi\xE8re n'a pas encore \xE9t\xE9 effectu\xE9e pour cette demande.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p-button", 4);
    \u0275\u0275listener("onClick", function ResumeAnalyseFinanciereComponent_Conditional_11_Template_p_button_onClick_7_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.retour());
    });
    \u0275\u0275elementEnd()()();
  }
}
var ResumeAnalyseFinanciereComponent = class _ResumeAnalyseFinanciereComponent {
  state = signal({
    loading: false,
    error: null
  });
  router = inject(Router);
  route = inject(ActivatedRoute);
  messageService = inject(MessageService);
  destroyRef = inject(DestroyRef);
  userService = inject(UserService);
  demandeId = null;
  ngOnInit() {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.demandeId = +params["demandeId"];
      if (this.demandeId) {
        this.chargerSynthese();
      } else {
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "ID de demande manquant"
        });
      }
    });
  }
  chargerSynthese() {
    if (!this.demandeId)
      return;
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: true, error: null }));
    this.userService.getSyntheseAnalyseFinanciere$(this.demandeId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        const responseData = response.data;
        if (responseData?.synthese) {
          this.state.update((s) => __spreadProps(__spreadValues({}, s), {
            synthese: responseData.synthese,
            user: responseData.user,
            loading: false
          }));
        } else {
          this.state.update((s) => __spreadProps(__spreadValues({}, s), {
            loading: false,
            error: "Aucune synth\xE8se trouv\xE9e"
          }));
        }
      },
      error: (error) => {
        this.state.update((s) => __spreadProps(__spreadValues({}, s), {
          loading: false,
          error: error.message || "Erreur lors du chargement"
        }));
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Impossible de charger la synth\xE8se"
        });
      }
    });
  }
  // ========================================
  // Méthodes pour le rôle utilisateur
  // ========================================
  isAgentCredit() {
    return this.state().user?.role === "AGENT_CREDIT";
  }
  canViewRatios() {
    const role = this.state().user?.role;
    return role === "MANAGER" || role === "DA" || role === "DR" || role === "RA";
  }
  // ========================================
  // Méthodes de formatage
  // ========================================
  formatCurrency(amount) {
    if (amount === null || amount === void 0)
      return "0 GNF";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "GNF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
  formatPercent(value) {
    if (value === null || value === void 0)
      return "0%";
    return `${(value * 100).toFixed(1)}%`;
  }
  // ========================================
  // Données pour les tableaux
  // ========================================
  getDemandeData() {
    const s = this.state().synthese;
    if (!s)
      return [];
    return [
      { label: "Objet du cr\xE9dit", value: s.objectCredit || "-" },
      { label: "Montant sollicit\xE9", value: this.formatCurrency(s.montantDemande) },
      { label: "Dur\xE9e sollicit\xE9e", value: `${s.dureeDemande || 0} mois` },
      { label: "Nombre d'\xE9ch\xE9ances", value: `${s.nombreEcheance || 0}` },
      { label: "\xC9ch\xE9ance mensuelle", value: this.formatCurrency(s.echeance) },
      { label: "P\xE9riodicit\xE9", value: s.periodiciteRemboursement || "-" }
    ];
  }
  getAnalyseData() {
    const s = this.state().synthese;
    if (!s)
      return [];
    return [
      { label: "Date d'\xE9valuation", value: s.dateEvaluation || "-" },
      { label: "Cycle d'affaires", value: s.cycleAffaires || "-" },
      { label: "Facteur de cycle", value: `${s.facteurCycle || 0}` },
      { label: "Type CDR", value: s.typeCdr || "-" },
      { label: "Valeur Garantie", value: this.formatCurrency(s.valeurGarantie) }
    ];
  }
  // ══════════════════════════════════════════════════════════════════════════
  // BILAN - Données multi-colonnes (N et N-1)
  // ══════════════════════════════════════════════════════════════════════════
  getBilanActifImmobiliseData() {
    const s = this.state().synthese;
    if (!s)
      return [];
    return [
      { label: "Terrain", valueN: this.formatCurrency(s.terrainN), valueN1: this.formatCurrency(s.terrainN1) },
      { label: "B\xE2timent / Magasin", valueN: this.formatCurrency(s.batimentMagasinN), valueN1: this.formatCurrency(s.batimentMagasinN1) },
      { label: "Installation / Agencement", valueN: this.formatCurrency(s.installationAgencementN), valueN1: this.formatCurrency(s.installationAgencementN1) },
      { label: "Mat\xE9riel Industriel", valueN: this.formatCurrency(s.materielIndustrielN), valueN1: this.formatCurrency(s.materielIndustrielN1) },
      { label: "Mobilier de Bureau", valueN: this.formatCurrency(s.mobilierBureauN), valueN1: this.formatCurrency(s.mobilierBureauN1) },
      { label: "Mat\xE9riel Informatique", valueN: this.formatCurrency(s.materielInformatiqueN), valueN1: this.formatCurrency(s.materielInformatiqueN1) },
      { label: "Mat\xE9riel de Transport", valueN: this.formatCurrency(s.materielTransportN), valueN1: this.formatCurrency(s.materielTransportN1) },
      { label: "Autres Immobilisations", valueN: this.formatCurrency(s.autreImmobilisationN), valueN1: this.formatCurrency(s.autreImmobilisationN1) },
      { label: "TOTAL IMMOBILISATIONS", valueN: this.formatCurrency(s.totalImmobilisationsN), valueN1: this.formatCurrency(s.totalImmobilisationsN1), isTotal: true }
    ];
  }
  getBilanActifCirculantData() {
    const s = this.state().synthese;
    if (!s)
      return [];
    const totalCirculantN = (s.stocksN || 0) + (s.creancesClientsN || 0) + (s.tresorerieCaisseBanqueN || 0);
    const totalCirculantN1 = (s.stocksN1 || 0) + (s.creancesClientsN1 || 0) + (s.tresorerieCaisseBanqueN1 || 0);
    return [
      { label: "Stocks", valueN: this.formatCurrency(s.stocksN), valueN1: this.formatCurrency(s.stocksN1) },
      { label: "Cr\xE9ances Clients", valueN: this.formatCurrency(s.creancesClientsN), valueN1: this.formatCurrency(s.creancesClientsN1) },
      { label: "Tr\xE9sorerie (Caisse / Banque)", valueN: this.formatCurrency(s.tresorerieCaisseBanqueN), valueN1: this.formatCurrency(s.tresorerieCaisseBanqueN1) },
      { label: "TOTAL ACTIF CIRCULANT", valueN: this.formatCurrency(totalCirculantN), valueN1: this.formatCurrency(totalCirculantN1), isTotal: true }
    ];
  }
  getBilanTotalActifData() {
    const s = this.state().synthese;
    if (!s)
      return [];
    return [
      { label: "TOTAL ACTIF", valueN: this.formatCurrency(s.totalActifN), valueN1: this.formatCurrency(s.totalActifN1), isTotal: true }
    ];
  }
  getBilanPassifData() {
    const s = this.state().synthese;
    if (!s)
      return [];
    return [
      { label: "CAPITAUX PROPRES", valueN: this.formatCurrency(s.capitauxPropresN), valueN1: this.formatCurrency(s.capitauxPropresN1), isTotal: true },
      { label: "DETTES", valueN: "", valueN1: "", isHeader: true },
      { label: "Emprunts Long Terme", valueN: this.formatCurrency(s.empruntLongTermeN), valueN1: this.formatCurrency(s.empruntLongTermeN1) },
      { label: "Emprunts Court Terme", valueN: this.formatCurrency(s.empruntCourtTermeN), valueN1: this.formatCurrency(s.empruntCourtTermeN1) },
      { label: "Autres Dettes", valueN: this.formatCurrency(s.autresDettesN), valueN1: this.formatCurrency(s.autresDettesN1) },
      { label: "TOTAL DETTES", valueN: this.formatCurrency(s.totalDettesN), valueN1: this.formatCurrency(s.totalDettesN1), isTotal: true },
      { label: "TOTAL PASSIF", valueN: this.formatCurrency(s.totalActifN), valueN1: this.formatCurrency(s.totalActifN1), isTotal: true }
    ];
  }
  getBilanIndicateursData() {
    const s = this.state().synthese;
    if (!s)
      return [];
    return [
      { label: "Fonds de Roulement", valueN: this.formatCurrency(s.fondsRoulementN), valueN1: this.formatCurrency(s.fondsRoulementN1) },
      { label: "Besoin en Fonds de Roulement", valueN: this.formatCurrency(s.besoinFondsRoulementN), valueN1: this.formatCurrency(s.besoinFondsRoulementN1) }
    ];
  }
  // ══════════════════════════════════════════════════════════════════════════
  // RENTABILITÉ - Données multi-colonnes (N, N-1, N+1)
  // ══════════════════════════════════════════════════════════════════════════
  getRentabiliteProduitsData() {
    const s = this.state().synthese;
    if (!s)
      return [];
    return [
      {
        label: "Chiffre d'Affaires",
        valueN: this.formatCurrency(s.chiffreAffairesN),
        valueN1: this.formatCurrency(s.chiffreAffairesN1),
        valueNplus1: this.formatCurrency(s.chiffreAffairesNplus1)
      },
      {
        label: "Co\xFBt d'Achat des Marchandises",
        valueN: this.formatCurrency(s.coutAchatMarchandisesN),
        valueN1: this.formatCurrency(s.coutAchatMarchandisesN1),
        valueNplus1: this.formatCurrency(s.coutAchatMarchandisesNplus1)
      },
      {
        label: "MARGE BRUTE",
        valueN: this.formatCurrency(s.margeBruteN),
        valueN1: this.formatCurrency(s.margeBruteN1),
        valueNplus1: this.formatCurrency(s.margeBruteNplus1),
        isTotal: true
      }
    ];
  }
  getRentabiliteChargesData() {
    const s = this.state().synthese;
    if (!s)
      return [];
    return [
      { label: "Salaires", valueN: this.formatCurrency(s.salairesN), valueN1: this.formatCurrency(s.salairesN1), valueNplus1: this.formatCurrency(s.salairesNplus1) },
      { label: "Pr\xE9l\xE8vement Entrepreneur", valueN: this.formatCurrency(s.prelevementEntrepreneurN), valueN1: this.formatCurrency(s.prelevementEntrepreneurN1), valueNplus1: this.formatCurrency(s.prelevementEntrepreneurNplus1) },
      { label: "Loyers", valueN: this.formatCurrency(s.loyersN), valueN1: this.formatCurrency(s.loyersN1), valueNplus1: this.formatCurrency(s.loyersNplus1) },
      { label: "Transport", valueN: this.formatCurrency(s.transportN), valueN1: this.formatCurrency(s.transportN1), valueNplus1: this.formatCurrency(s.transportNplus1) },
      { label: "\xC9lectricit\xE9 / Eau / T\xE9l\xE9phone", valueN: this.formatCurrency(s.electriciteEauTelephoneN), valueN1: this.formatCurrency(s.electriciteEauTelephoneN1), valueNplus1: this.formatCurrency(s.electriciteEauTelephoneNplus1) },
      { label: "Fournitures et Autres Besoins", valueN: this.formatCurrency(s.fournituresAutresBesoinsN), valueN1: this.formatCurrency(s.fournituresAutresBesoinsN1), valueNplus1: this.formatCurrency(s.fournituresAutresBesoinsNplus1) },
      { label: "Entretien / R\xE9paration", valueN: this.formatCurrency(s.entretienReparationN), valueN1: this.formatCurrency(s.entretienReparationN1), valueNplus1: this.formatCurrency(s.entretienReparationNplus1) },
      { label: "Carburant / Lubrifiants", valueN: this.formatCurrency(s.carburantLubrifiantsN), valueN1: this.formatCurrency(s.carburantLubrifiantsN1), valueNplus1: this.formatCurrency(s.carburantLubrifiantsNplus1) },
      { label: "Publicit\xE9 / Promotion", valueN: this.formatCurrency(s.publicitePromotionN), valueN1: this.formatCurrency(s.publicitePromotionN1), valueNplus1: this.formatCurrency(s.publicitePromotionNplus1) },
      { label: "Imp\xF4ts et Taxes", valueN: this.formatCurrency(s.impotsTaxesN), valueN1: this.formatCurrency(s.impotsTaxesN1), valueNplus1: this.formatCurrency(s.impotsTaxesNplus1) },
      { label: "Frais Bancaires / Int\xE9r\xEAts", valueN: this.formatCurrency(s.fraisBancairesInteretsN), valueN1: this.formatCurrency(s.fraisBancairesInteretsN1), valueNplus1: this.formatCurrency(s.fraisBancairesInteretsNplus1) },
      { label: "\xC9ch\xE9ance Autre Cr\xE9dit", valueN: this.formatCurrency(s.echeanceAutreCreditN), valueN1: this.formatCurrency(s.echeanceAutreCreditN1), valueNplus1: this.formatCurrency(s.echeanceAutreCreditNplus1) },
      { label: "Diverses Charges", valueN: this.formatCurrency(s.diversesChargesN), valueN1: this.formatCurrency(s.diversesChargesN1), valueNplus1: this.formatCurrency(s.diversesChargesNplus1) },
      { label: "TOTAL CHARGES", valueN: this.formatCurrency(s.totalChargesExploitationN), valueN1: this.formatCurrency(s.totalChargesExploitationN1), valueNplus1: this.formatCurrency(s.totalChargesExploitationNplus1), isTotal: true }
    ];
  }
  getRentabiliteResultatsData() {
    const s = this.state().synthese;
    if (!s)
      return [];
    return [
      { label: "Amortissements / Provisions", valueN: this.formatCurrency(s.amortissementsProvisionsN), valueN1: this.formatCurrency(s.amortissementsProvisionsN1), valueNplus1: this.formatCurrency(s.amortissementsProvisionsNplus1) },
      { label: "R\xE9sultat d'Exploitation", valueN: this.formatCurrency(s.resultatExploitationN), valueN1: this.formatCurrency(s.resultatExploitationN1), valueNplus1: this.formatCurrency(s.resultatExploitationNplus1), isTotal: true },
      { label: "Autres Revenus Hors Activit\xE9", valueN: this.formatCurrency(s.autresRevenusHorsActiviteN), valueN1: this.formatCurrency(s.autresRevenusHorsActiviteN1), valueNplus1: this.formatCurrency(s.autresRevenusHorsActiviteNplus1) },
      { label: "CASH FLOW", valueN: this.formatCurrency(s.cashFlowN), valueN1: this.formatCurrency(s.cashFlowN1), valueNplus1: this.formatCurrency(s.cashFlowNplus1), isTotal: true },
      { label: "CAPACIT\xC9 DE REMBOURSEMENT", valueN: this.formatCurrency(s.capaciteRemboursementN), valueN1: this.formatCurrency(s.capaciteRemboursementN1), valueNplus1: this.formatCurrency(s.capaciteRemboursementNplus1), isTotal: true }
    ];
  }
  // ══════════════════════════════════════════════════════════════════════════
  // BESOIN EN CRÉDIT - Données avec Montant et Ajustement
  // ══════════════════════════════════════════════════════════════════════════
  getBesoinInvestissementData() {
    const s = this.state().synthese;
    if (!s)
      return [];
    return [
      { label: "Co\xFBt \xC9quipement", montant: this.formatCurrency(s.coutEquipement), ajustement: this.formatCurrency(s.ajustCoutEquipement) },
      { label: "D\xE9penses Rattach\xE9es", montant: this.formatCurrency(s.depensesRattachees), ajustement: this.formatCurrency(s.ajustDepensesRattachees) },
      { label: "Apport Personnel", montant: this.formatCurrency(s.apportPersonnel), ajustement: this.formatCurrency(s.ajustApportPersonnel) },
      { label: "BESOIN R\xC9EL INVESTISSEMENT", montant: this.formatCurrency(s.besoinReelInvestissement), ajustement: "-", isTotal: true }
    ];
  }
  getBesoinExploitationData() {
    const s = this.state().synthese;
    if (!s)
      return [];
    return [
      { label: "Co\xFBt Achat Cycle", montant: this.formatCurrency(s.coutAchatCycle), ajustement: this.formatCurrency(s.ajustCoutAchatCycle) },
      { label: "Nombre de Cycles \xE0 Financer", montant: `${s.nbreCycleFinancer || 0}`, ajustement: "-" },
      { label: "Tr\xE9sorerie Disponible", montant: this.formatCurrency(s.tresorerieDisponible), ajustement: this.formatCurrency(s.ajustTresorerieDispo) },
      { label: "Stock Actuel", montant: this.formatCurrency(s.stockActuel), ajustement: this.formatCurrency(s.ajustStockActuel) },
      { label: "Comptes \xE0 Recevoir", montant: this.formatCurrency(s.comptesRecevoir), ajustement: this.formatCurrency(s.ajustComptesRecevoir) },
      { label: "Dettes Fournisseurs", montant: this.formatCurrency(s.dettesFournisseurs), ajustement: this.formatCurrency(s.ajustDettesFournisseurs) },
      { label: "Cr\xE9dit Fournisseur", montant: this.formatCurrency(s.creditFournisseur), ajustement: this.formatCurrency(s.ajustCreditFournisseur) },
      { label: "BESOIN R\xC9EL EXPLOITATION", montant: this.formatCurrency(s.besoinReelExploitation), ajustement: "-", isTotal: true }
    ];
  }
  // ══════════════════════════════════════════════════════════════════════════
  // RATIOS
  // ══════════════════════════════════════════════════════════════════════════
  getRatiosData() {
    const s = this.state().synthese;
    if (!s)
      return [];
    return [
      { label: "R1 - Capacit\xE9 Remboursement (Sollicit\xE9)", value: this.formatPercent(s.calcR1Sollicite) },
      { label: "R1 - Capacit\xE9 Remboursement (Propos\xE9)", value: this.formatPercent(s.calcR1Propose) },
      { label: "R2 - Solvabilit\xE9", value: this.formatPercent(s.calcR2) },
      { label: "R3 - Liquidit\xE9", value: this.formatPercent(s.calcR3) },
      { label: "R4 - Endettement (Sollicit\xE9)", value: this.formatPercent(s.calcR4Sollicite) },
      { label: "R4 - Endettement (Propos\xE9)", value: this.formatPercent(s.calcR4Propose) },
      { label: "R5 - D\xE9pendance", value: this.formatPercent(s.calcR5) },
      { label: "R6 - Couverture Garantie (Sollicit\xE9)", value: this.formatPercent(s.calcR6Sollicite) },
      { label: "R6 - Couverture Garantie (Propos\xE9)", value: this.formatPercent(s.calcR6Propose) }
    ];
  }
  // ========================================
  // Navigation
  // ========================================
  retour() {
    this.router.navigate(["/dashboards/credit/individuel/attente/detail/", this.demandeId]);
  }
  static \u0275fac = function ResumeAnalyseFinanciereComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ResumeAnalyseFinanciereComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ResumeAnalyseFinanciereComponent, selectors: [["app-resume-analyse-financiere"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 13, vars: 4, consts: [[1, "container-fluid", "p-4"], [1, "flex", "flex-wrap", "gap-2", "items-center", "justify-between", "mb-4"], [1, "text-2xl", "font-bold", "text-900", "m-0"], [1, "text-600", "m-0", "mt-1"], ["label", "Retour", "icon", "pi pi-arrow-left", "outlined", "", 3, "onClick"], [1, "flex", "justify-center", "items-center", "p-8"], [1, "text-center", "p-4"], [1, "pi", "pi-exclamation-triangle", "text-6xl", "text-red-500", "mb-3"], [1, "text-red-600"], [1, "text-600"], ["label", "R\xE9essayer", "icon", "pi pi-refresh", 3, "onClick"], [1, "grid"], [1, "col-12", "lg:col-6"], ["pTemplate", "header"], ["styleClass", "p-datatable-sm", 3, "value", "tableStyle"], ["pTemplate", "body"], [1, "col-12"], [1, "text-xl", "font-bold", "text-green-700", "mb-3", "mt-3"], [1, "pi", "pi-chart-bar", "mr-2"], [1, "text-green-700", "mb-2", "mt-0"], ["styleClass", "p-datatable-sm p-datatable-striped", 3, "value", "tableStyle"], [1, "text-green-700", "mb-2", "mt-4"], [1, "mt-3"], [1, "text-xl", "font-bold", "text-orange-700", "mb-3", "mt-4"], [1, "pi", "pi-chart-line", "mr-2"], [1, "text-xl", "font-bold", "text-cyan-700", "mb-3", "mt-4"], [1, "pi", "pi-money-bill", "mr-2"], [1, "col-12", "mt-3"], [1, "flex", "justify-content-center", "mt-4"], ["label", "Retour \xE0 la demande", "icon", "pi pi-arrow-left", 3, "onClick"], [1, "flex", "items-center", "gap-2", "p-3", "bg-blue-50"], [1, "pi", "pi-file", "text-blue-600", "text-xl"], [1, "m-0", "text-blue-800"], [1, "font-semibold", "text-600", "w-6"], [1, "text-900"], [1, "flex", "items-center", "gap-2", "p-3", "bg-purple-50"], [1, "pi", "pi-cog", "text-purple-600", "text-xl"], [1, "m-0", "text-purple-800"], [1, "flex", "items-center", "gap-2", "p-3", "bg-green-50"], [1, "pi", "pi-building", "text-green-600", "text-xl"], [1, "m-0", "text-green-800"], [1, "w-5"], [1, "text-right"], [3, "ngClass"], [1, "text-right", 3, "ngClass"], [1, "bg-green-200"], [1, "w-5", "font-bold", "text-green-800", "text-lg"], [1, "text-right", "font-bold", "text-green-800", "text-lg"], [1, "flex", "items-center", "gap-2", "p-3", "bg-red-50"], [1, "pi", "pi-wallet", "text-red-600", "text-xl"], [1, "m-0", "text-red-800"], [1, "pi", "pi-chart-line", "text-blue-600", "text-xl"], [1, "font-semibold", "text-600"], [1, "text-right", "text-900"], [1, "flex", "items-center", "gap-2", "p-3", "bg-teal-50"], [1, "pi", "pi-dollar", "text-teal-600", "text-xl"], [1, "m-0", "text-teal-800"], [1, "w-4"], [1, "flex", "items-center", "gap-2", "p-3", "bg-orange-50"], [1, "pi", "pi-minus-circle", "text-orange-600", "text-xl"], [1, "m-0", "text-orange-800"], [1, "flex", "items-center", "gap-2", "p-3", "bg-indigo-50"], [1, "pi", "pi-calculator", "text-indigo-600", "text-xl"], [1, "m-0", "text-indigo-800"], [1, "flex", "items-center", "gap-2", "p-3", "bg-cyan-50"], [1, "pi", "pi-briefcase", "text-cyan-600", "text-xl"], [1, "m-0", "text-cyan-800"], [1, "pi", "pi-shopping-cart", "text-cyan-600", "text-xl"], [1, "text-xl", "font-bold", "text-purple-700", "mb-3", "mt-4"], [1, "pi", "pi-percentage", "mr-2"], ["value", "Visible uniquement pour le comit\xE9", "severity", "info", 1, "ml-2"], [1, "col-12", "md:col-6", "lg:col-4"], [1, "pi", "pi-calculator", "text-purple-600", "text-xl"], [1, "p-3", "bg-purple-50", "border-round", "mb-2", "border-1", "border-purple-200"], [1, "text-sm", "text-purple-600", "mb-1"], [1, "text-2xl", "font-bold", "text-purple-800"], [1, "p-4", "bg-blue-50", "border-round", "border-1", "border-blue-200"], [1, "flex", "items-center", "gap-2"], [1, "pi", "pi-info-circle", "text-blue-600", "text-xl"], [1, "font-semibold", "text-blue-800"], [1, "text-sm", "text-blue-700"], [1, "text-center", "p-8"], [1, "pi", "pi-info-circle", "text-6xl", "text-blue-500", "mb-3"], [1, "text-500"]], template: function ResumeAnalyseFinanciereComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div")(3, "h2", 2);
      \u0275\u0275text(4, "R\xE9sum\xE9 de l'Analyse Financi\xE8re");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p", 3);
      \u0275\u0275text(6, "Bilan d'activit\xE9 saisi par l'agent de cr\xE9dit");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "p-button", 4);
      \u0275\u0275listener("onClick", function ResumeAnalyseFinanciereComponent_Template_p_button_onClick_7_listener() {
        return ctx.retour();
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275template(8, ResumeAnalyseFinanciereComponent_Conditional_8_Template, 2, 0, "div", 5)(9, ResumeAnalyseFinanciereComponent_Conditional_9_Template, 8, 1, "p-card")(10, ResumeAnalyseFinanciereComponent_Conditional_10_Template, 85, 38)(11, ResumeAnalyseFinanciereComponent_Conditional_11_Template, 8, 0, "p-card");
      \u0275\u0275elementEnd();
      \u0275\u0275element(12, "p-toast");
    }
    if (rf & 2) {
      \u0275\u0275advance(8);
      \u0275\u0275conditional(ctx.state().loading ? 8 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.state().error && !ctx.state().loading ? 9 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.state().synthese && !ctx.state().loading ? 10 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.state().synthese && !ctx.state().loading && !ctx.state().error ? 11 : -1);
    }
  }, dependencies: [CommonModule, NgClass, CardModule, Card, PrimeTemplate, TableModule, Table, TagModule, Tag, ButtonModule, Button, ProgressSpinnerModule, ProgressSpinner, ToastModule, Toast, DividerModule], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.container-fluid[_ngcontent-%COMP%] {\n  max-width: 1400px;\n  margin: 0 auto;\n}\n[_nghost-%COMP%]     .p-card {\n  margin-bottom: 1rem;\n}\n[_nghost-%COMP%]     .p-card .p-card-header {\n  padding: 0;\n}\n[_nghost-%COMP%]     .p-card .p-card-body {\n  padding: 1rem;\n}\n[_nghost-%COMP%]     .p-datatable .p-datatable-thead > tr > th {\n  background: var(--surface-100);\n  font-weight: 600;\n}\n[_nghost-%COMP%]     .p-datatable .p-datatable-tbody > tr > td {\n  padding: 0.75rem 1rem;\n}\n/*# sourceMappingURL=resume-analyse-financiere.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ResumeAnalyseFinanciereComponent, { className: "ResumeAnalyseFinanciereComponent", filePath: "src/app/pages/dashboard/credit/individuel/attente/detail/resume-analyse-financiere/resume-analyse-financiere.component.ts", lineNumber: 259 });
})();
export {
  ResumeAnalyseFinanciereComponent
};
//# sourceMappingURL=chunk-DUZZ73FQ.js.map
