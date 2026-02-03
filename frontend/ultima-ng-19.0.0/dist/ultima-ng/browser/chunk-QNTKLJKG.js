import {
  Panel,
  PanelModule
} from "./chunk-WJXIL2JJ.js";
import {
  TabPanel,
  TabView,
  TabViewModule
} from "./chunk-I3MJ27E7.js";
import {
  Message,
  MessageModule
} from "./chunk-CSEZIGTY.js";
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
  SortIcon,
  SortableColumn,
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
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-ZKKMBKIA.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/pages/dashboard/agent-credit/view-detail-credit/view-detail-credit.component.ts
function ViewDetailCreditComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "p-card", 3)(2, "div", 4);
    \u0275\u0275element(3, "p-progressSpinner", 5);
    \u0275\u0275elementStart(4, "span", 6);
    \u0275\u0275text(5, "Chargement des d\xE9tails du cr\xE9dit...");
    \u0275\u0275elementEnd()()()();
  }
}
function ViewDetailCreditComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 2);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("text", ctx_r0.state().error)("closable", false);
  }
}
function ViewDetailCreditComponent_Conditional_4_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 53)(1, "div", 54)(2, "div")(3, "h1", 55);
    \u0275\u0275element(4, "i", 56);
    \u0275\u0275text(5, " D\xE9tails du Cr\xE9dit ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 57);
    \u0275\u0275text(7, "Analyse compl\xE8te de la demande de cr\xE9dit");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "p-chip", 58);
    \u0275\u0275element(9, "i", 59);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(8);
    \u0275\u0275property("label", "Ref: " + (((tmp_2_0 = ctx_r0.state().instanceCreditInd) == null ? null : tmp_2_0.referenceCredit) || "N/A"));
  }
}
function ViewDetailCreditComponent_Conditional_4_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 60);
    \u0275\u0275element(1, "i", 61);
    \u0275\u0275elementStart(2, "span", 62);
    \u0275\u0275text(3, "Appr\xE9ciation");
    \u0275\u0275elementEnd()();
  }
}
function ViewDetailCreditComponent_Conditional_4_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 10);
  }
  if (rf & 2) {
    \u0275\u0275property("closable", false);
  }
}
function ViewDetailCreditComponent_Conditional_4_Conditional_5_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 74);
    \u0275\u0275element(1, "i", 75);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "Montants");
    \u0275\u0275elementEnd()();
  }
}
function ViewDetailCreditComponent_Conditional_4_Conditional_5_ng_template_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 74);
    \u0275\u0275element(1, "i", 76);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "Statut & Date");
    \u0275\u0275elementEnd()();
  }
}
function ViewDetailCreditComponent_Conditional_4_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11)(1, "div", 16)(2, "div", 63)(3, "p-card", 64);
    \u0275\u0275template(4, ViewDetailCreditComponent_Conditional_4_Conditional_5_ng_template_4_Template, 4, 0, "ng-template", 8);
    \u0275\u0275elementStart(5, "div", 18)(6, "label");
    \u0275\u0275text(7, "Montant Demand\xE9:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 42);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 18)(11, "label");
    \u0275\u0275text(12, "Montant Sugg\xE9r\xE9 par le DA:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span", 42);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(15, "div", 63)(16, "p-card", 64);
    \u0275\u0275template(17, ViewDetailCreditComponent_Conditional_4_Conditional_5_ng_template_17_Template, 4, 0, "ng-template", 8);
    \u0275\u0275elementStart(18, "div", 18)(19, "label");
    \u0275\u0275text(20, "Statut:");
    \u0275\u0275elementEnd();
    \u0275\u0275element(21, "p-chip", 65);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "div", 18)(23, "label");
    \u0275\u0275text(24, "Date Cr\xE9ation:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "span", 19);
    \u0275\u0275text(26);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(27, "div", 66)(28, "div", 67)(29, "div", 68)(30, "div", 69)(31, "div", 70);
    \u0275\u0275element(32, "i", 71);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "span", 72);
    \u0275\u0275text(34, "MOTIF DE LA D\xC9CISION");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "div", 73);
    \u0275\u0275text(36);
    \u0275\u0275elementEnd()()()()()();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    let tmp_6_0;
    let tmp_7_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(ctx_r0.getFormattedAmount((tmp_2_0 = ctx_r0.state().appreciation) == null ? null : tmp_2_0.montantDemande));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.getFormattedAmount((tmp_3_0 = ctx_r0.state().appreciation) == null ? null : tmp_3_0.montantSuggere));
    \u0275\u0275advance(7);
    \u0275\u0275property("label", ((tmp_4_0 = ctx_r0.state().appreciation) == null ? null : tmp_4_0.status) || "N/A")("styleClass", ctx_r0.getStatusChipClass((tmp_5_0 = ctx_r0.state().appreciation) == null ? null : tmp_5_0.status));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.getFormattedDate((tmp_6_0 = ctx_r0.state().appreciation) == null ? null : tmp_6_0.createdAt));
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate1(" ", ((tmp_7_0 = ctx_r0.state().appreciation) == null ? null : tmp_7_0.motif) || "Aucun motif fourni", " ");
  }
}
function ViewDetailCreditComponent_Conditional_4_ng_template_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 60);
    \u0275\u0275element(1, "i", 77);
    \u0275\u0275elementStart(2, "span", 62);
    \u0275\u0275text(3, "Informations du Profil");
    \u0275\u0275elementEnd()();
  }
}
function ViewDetailCreditComponent_Conditional_4_ng_template_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 78);
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2, "Client");
    \u0275\u0275elementEnd();
  }
}
function ViewDetailCreditComponent_Conditional_4_ng_template_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 79);
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2, "Cr\xE9dit");
    \u0275\u0275elementEnd();
  }
}
function ViewDetailCreditComponent_Conditional_4_ng_template_109_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 80);
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2, "Note");
    \u0275\u0275elementEnd();
  }
}
function ViewDetailCreditComponent_Conditional_4_Conditional_110_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-card", 28)(1, "div", 81)(2, "div", 82)(3, "div", 83)(4, "div", 84);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 85);
    \u0275\u0275text(7, "Score");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 82)(9, "div", 18)(10, "label");
    \u0275\u0275text(11, "Date:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span", 19);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(14, "div", 86)(15, "div", 87)(16, "div", 88)(17, "div", 89);
    \u0275\u0275element(18, "i", 90);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span", 91);
    \u0275\u0275text(20, "COMMENTAIRES DU PROFIL");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div", 92);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(((tmp_2_0 = ctx_r0.state().noteProfile) == null ? null : tmp_2_0.note) || "N/A");
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r0.getFormattedDate((tmp_3_0 = ctx_r0.state().noteProfile) == null ? null : tmp_3_0.createdAt));
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate1(" ", ((tmp_4_0 = ctx_r0.state().noteProfile) == null ? null : tmp_4_0.motif) || "Aucun commentaire", " ");
  }
}
function ViewDetailCreditComponent_Conditional_4_Conditional_111_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 29);
  }
  if (rf & 2) {
    \u0275\u0275property("closable", false);
  }
}
function ViewDetailCreditComponent_Conditional_4_ng_template_113_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 60);
    \u0275\u0275element(1, "i", 93);
    \u0275\u0275elementStart(2, "span", 62);
    \u0275\u0275text(3, "Analyse Financi\xE8re");
    \u0275\u0275elementEnd()();
  }
}
function ViewDetailCreditComponent_Conditional_4_ng_template_116_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 94);
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2, "Produits");
    \u0275\u0275elementEnd();
  }
}
function ViewDetailCreditComponent_Conditional_4_Conditional_117_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 32);
  }
  if (rf & 2) {
    \u0275\u0275property("closable", false);
  }
}
function ViewDetailCreditComponent_Conditional_4_Conditional_118_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 97);
    \u0275\u0275text(2, " Produit ");
    \u0275\u0275element(3, "p-sortIcon", 98);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "th", 99);
    \u0275\u0275text(5, " Prix Unitaire ");
    \u0275\u0275element(6, "p-sortIcon", 100);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 101);
    \u0275\u0275text(8, " Quantit\xE9 ");
    \u0275\u0275element(9, "p-sortIcon", 102);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Montant");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 103);
    \u0275\u0275text(13, " Date ");
    \u0275\u0275element(14, "p-sortIcon", 104);
    \u0275\u0275elementEnd()();
  }
}
function ViewDetailCreditComponent_Conditional_4_Conditional_118_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 105);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 106);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 107);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 106);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const product_r3 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(product_r3.libele);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.getFormattedAmount(product_r3.prix_unit));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(product_r3.qte);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.getFormattedAmount(product_r3.prix_unit * product_r3.qte));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.getFormattedDate(product_r3.created_at));
  }
}
function ViewDetailCreditComponent_Conditional_4_Conditional_118_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 108)(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Total: ", ctx_r0.getFormattedAmount(ctx_r0.getTotalProductAmount()), "");
  }
}
function ViewDetailCreditComponent_Conditional_4_Conditional_118_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-table", 33);
    \u0275\u0275template(1, ViewDetailCreditComponent_Conditional_4_Conditional_118_ng_template_1_Template, 15, 0, "ng-template", 8)(2, ViewDetailCreditComponent_Conditional_4_Conditional_118_ng_template_2_Template, 11, 5, "ng-template", 95)(3, ViewDetailCreditComponent_Conditional_4_Conditional_118_ng_template_3_Template, 3, 1, "ng-template", 96);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("value", ctx_r0.state().products)("paginator", true)("rows", 5)("showCurrentPageReport", true);
  }
}
function ViewDetailCreditComponent_Conditional_4_ng_template_120_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 109);
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2, "Charges");
    \u0275\u0275elementEnd();
  }
}
function ViewDetailCreditComponent_Conditional_4_Conditional_121_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 35);
  }
  if (rf & 2) {
    \u0275\u0275property("closable", false);
  }
}
function ViewDetailCreditComponent_Conditional_4_Conditional_122_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 97);
    \u0275\u0275text(2, " Description ");
    \u0275\u0275element(3, "p-sortIcon", 98);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "th", 99);
    \u0275\u0275text(5, " Montant ");
    \u0275\u0275element(6, "p-sortIcon", 100);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 110);
    \u0275\u0275text(8, " Date ");
    \u0275\u0275element(9, "p-sortIcon", 111);
    \u0275\u0275elementEnd()();
  }
}
function ViewDetailCreditComponent_Conditional_4_Conditional_122_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 105);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 106);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const charge_r4 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(charge_r4.libele);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.getFormattedAmount(charge_r4.prix_unit));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.getFormattedDate(charge_r4.create_at));
  }
}
function ViewDetailCreditComponent_Conditional_4_Conditional_122_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 108)(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Total: ", ctx_r0.getFormattedAmount(ctx_r0.getTotalCharges()), "");
  }
}
function ViewDetailCreditComponent_Conditional_4_Conditional_122_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-table", 36);
    \u0275\u0275template(1, ViewDetailCreditComponent_Conditional_4_Conditional_122_ng_template_1_Template, 10, 0, "ng-template", 8)(2, ViewDetailCreditComponent_Conditional_4_Conditional_122_ng_template_2_Template, 7, 3, "ng-template", 95)(3, ViewDetailCreditComponent_Conditional_4_Conditional_122_ng_template_3_Template, 3, 1, "ng-template", 96);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("value", ctx_r0.state().charges)("paginator", true)("rows", 5)("showCurrentPageReport", true);
  }
}
function ViewDetailCreditComponent_Conditional_4_ng_template_124_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 112);
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2, "Note");
    \u0275\u0275elementEnd();
  }
}
function ViewDetailCreditComponent_Conditional_4_Conditional_125_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-card", 28)(1, "div", 81)(2, "div", 82)(3, "div", 83)(4, "div", 84);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 85);
    \u0275\u0275text(7, "Score");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 82)(9, "div", 18)(10, "label");
    \u0275\u0275text(11, "Date:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span", 19);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(14, "div", 86)(15, "div", 87)(16, "div", 88)(17, "div", 89);
    \u0275\u0275element(18, "i", 113);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span", 91);
    \u0275\u0275text(20, "ANALYSE D\xC9TAILL\xC9E");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div", 92);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(((tmp_2_0 = ctx_r0.state().noteAnalyse) == null ? null : tmp_2_0.note) || "N/A");
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r0.getFormattedDate((tmp_3_0 = ctx_r0.state().noteAnalyse) == null ? null : tmp_3_0.createdAt));
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate1(" ", ((tmp_4_0 = ctx_r0.state().noteAnalyse) == null ? null : tmp_4_0.motif) || "Aucun commentaire", " ");
  }
}
function ViewDetailCreditComponent_Conditional_4_Conditional_126_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 38);
  }
  if (rf & 2) {
    \u0275\u0275property("closable", false);
  }
}
function ViewDetailCreditComponent_Conditional_4_ng_template_128_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 60);
    \u0275\u0275element(1, "i", 114);
    \u0275\u0275elementStart(2, "span", 62);
    \u0275\u0275text(3, "Garanties");
    \u0275\u0275elementEnd()();
  }
}
function ViewDetailCreditComponent_Conditional_4_ng_template_131_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 115);
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2, "Mat\xE9rielle");
    \u0275\u0275elementEnd();
  }
}
function ViewDetailCreditComponent_Conditional_4_ng_template_153_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 116);
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2, "Caution");
    \u0275\u0275elementEnd();
  }
}
function ViewDetailCreditComponent_Conditional_4_Conditional_154_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 44);
  }
  if (rf & 2) {
    \u0275\u0275property("closable", false);
  }
}
function ViewDetailCreditComponent_Conditional_4_Conditional_155_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 117);
    \u0275\u0275text(2, " Nom ");
    \u0275\u0275element(3, "p-sortIcon", 118);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "th", 119);
    \u0275\u0275text(5, " Pr\xE9nom ");
    \u0275\u0275element(6, "p-sortIcon", 120);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th");
    \u0275\u0275text(8, "T\xE9l\xE9phone");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th", 121);
    \u0275\u0275text(10, " \xC2ge ");
    \u0275\u0275element(11, "p-sortIcon", 122);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Activit\xE9");
    \u0275\u0275elementEnd()();
  }
}
function ViewDetailCreditComponent_Conditional_4_Conditional_155_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 105);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 107);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const garantie_r5 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(garantie_r5.nom);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(garantie_r5.prenom);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(garantie_r5.telephone);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(garantie_r5.age);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(garantie_r5.activite);
  }
}
function ViewDetailCreditComponent_Conditional_4_Conditional_155_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-table", 45);
    \u0275\u0275template(1, ViewDetailCreditComponent_Conditional_4_Conditional_155_ng_template_1_Template, 14, 0, "ng-template", 8)(2, ViewDetailCreditComponent_Conditional_4_Conditional_155_ng_template_2_Template, 11, 5, "ng-template", 95);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("value", ctx_r0.state().garantieCaution)("paginator", true)("rows", 5)("showCurrentPageReport", true);
  }
}
function ViewDetailCreditComponent_Conditional_4_ng_template_157_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 80);
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2, "Note");
    \u0275\u0275elementEnd();
  }
}
function ViewDetailCreditComponent_Conditional_4_Conditional_158_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-card", 28)(1, "div", 81)(2, "div", 82)(3, "div", 83)(4, "div", 84);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 85);
    \u0275\u0275text(7, "Score");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 82)(9, "div", 18)(10, "label");
    \u0275\u0275text(11, "Date:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span", 19);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(14, "div", 86)(15, "div", 87)(16, "div", 88)(17, "div", 89);
    \u0275\u0275element(18, "i", 123);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span", 91);
    \u0275\u0275text(20, "\xC9VALUATION DE LA GARANTIE");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div", 92);
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(((tmp_2_0 = ctx_r0.state().noteGarantie) == null ? null : tmp_2_0.note) || "N/A");
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r0.getFormattedDate((tmp_3_0 = ctx_r0.state().noteGarantie) == null ? null : tmp_3_0.createdAt));
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate1(" ", ((tmp_4_0 = ctx_r0.state().noteGarantie) == null ? null : tmp_4_0.motif) || "Aucun commentaire", " ");
  }
}
function ViewDetailCreditComponent_Conditional_4_Conditional_159_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 47);
  }
  if (rf & 2) {
    \u0275\u0275property("closable", false);
  }
}
function ViewDetailCreditComponent_Conditional_4_Conditional_163_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 124);
    \u0275\u0275listener("onClick", function ViewDetailCreditComponent_Conditional_4_Conditional_163_Template_p_button_onClick_0_listener() {
      let tmp_3_0;
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.updateCredit((tmp_3_0 = ctx_r0.state().instanceCreditInd) == null ? null : tmp_3_0.referenceCredit));
    });
    \u0275\u0275elementEnd();
  }
}
function ViewDetailCreditComponent_Conditional_4_Conditional_164_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 125);
    \u0275\u0275listener("onClick", function ViewDetailCreditComponent_Conditional_4_Conditional_164_Template_p_button_onClick_0_listener() {
      let tmp_3_0;
      \u0275\u0275restoreView(_r7);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.startInsertingCredit((tmp_3_0 = ctx_r0.state().instanceCreditInd) == null ? null : tmp_3_0.referenceCredit, (tmp_3_0 = ctx_r0.state().membre) == null ? null : tmp_3_0.clientesPKId == null ? null : tmp_3_0.clientesPKId.codCliente, (tmp_3_0 = ctx_r0.state().user) == null ? null : tmp_3_0.userId));
    });
    \u0275\u0275elementEnd();
  }
}
function ViewDetailCreditComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-card", 7);
    \u0275\u0275template(1, ViewDetailCreditComponent_Conditional_4_ng_template_1_Template, 10, 1, "ng-template", 8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p-panel", 9);
    \u0275\u0275template(3, ViewDetailCreditComponent_Conditional_4_ng_template_3_Template, 4, 0, "ng-template", 8)(4, ViewDetailCreditComponent_Conditional_4_Conditional_4_Template, 1, 1, "p-message", 10)(5, ViewDetailCreditComponent_Conditional_4_Conditional_5_Template, 37, 6, "div", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p-panel", 12);
    \u0275\u0275template(7, ViewDetailCreditComponent_Conditional_4_ng_template_7_Template, 4, 0, "ng-template", 8);
    \u0275\u0275elementStart(8, "p-tabView", 13)(9, "p-tabPanel", 14);
    \u0275\u0275template(10, ViewDetailCreditComponent_Conditional_4_ng_template_10_Template, 3, 0, "ng-template", 8);
    \u0275\u0275elementStart(11, "p-card", 15)(12, "div", 16)(13, "div", 17)(14, "div", 18)(15, "label");
    \u0275\u0275text(16, "Nom Complet:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span", 19);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "div", 17)(20, "div", 18)(21, "label");
    \u0275\u0275text(22, "N\xB0 Membre:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "span", 19);
    \u0275\u0275text(24);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(25, "div", 17)(26, "div", 18)(27, "label");
    \u0275\u0275text(28, "T\xE9l\xE9phone:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "span", 19);
    \u0275\u0275text(30);
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275elementStart(31, "p-tabPanel", 20);
    \u0275\u0275template(32, ViewDetailCreditComponent_Conditional_4_ng_template_32_Template, 3, 0, "ng-template", 8);
    \u0275\u0275elementStart(33, "p-card", 21)(34, "div", 22)(35, "table", 23)(36, "thead")(37, "tr")(38, "th");
    \u0275\u0275text(39, "Attribut");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "th");
    \u0275\u0275text(41, "Valeur");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "th");
    \u0275\u0275text(43, "Attribut");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "th");
    \u0275\u0275text(45, "Valeur");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(46, "tbody")(47, "tr")(48, "td", 24);
    \u0275\u0275text(49, "Capital");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "td", 25);
    \u0275\u0275text(51);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(52, "td", 24);
    \u0275\u0275text(53, "Cr\xE9ance");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "td", 25);
    \u0275\u0275text(55);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(56, "tr")(57, "td", 24);
    \u0275\u0275text(58, "Dette");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(59, "td", 25);
    \u0275\u0275text(60);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(61, "td", 24);
    \u0275\u0275text(62, "Cumul Cr\xE9dit");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(63, "td", 25);
    \u0275\u0275text(64);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(65, "tr")(66, "td", 24);
    \u0275\u0275text(67, "Moyen Personne");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(68, "td", 26);
    \u0275\u0275text(69);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(70, "td", 24);
    \u0275\u0275text(71, "Bien");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(72, "td", 26);
    \u0275\u0275text(73);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(74, "tr")(75, "td", 24);
    \u0275\u0275text(76, "Statut Activit\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(77, "td", 26);
    \u0275\u0275text(78);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(79, "td", 24);
    \u0275\u0275text(80, "Exp\xE9rience");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(81, "td", 26);
    \u0275\u0275text(82);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(83, "tr")(84, "td", 24);
    \u0275\u0275text(85, "Lieux Activit\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(86, "td", 26);
    \u0275\u0275text(87);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(88, "td", 24);
    \u0275\u0275text(89, "Nombre");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(90, "td", 26);
    \u0275\u0275text(91);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(92, "tr")(93, "td", 24);
    \u0275\u0275text(94, "Nombre Cr\xE9dit");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(95, "td", 26);
    \u0275\u0275text(96);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(97, "td", 24);
    \u0275\u0275text(98, "Fr\xE9quence");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(99, "td", 26);
    \u0275\u0275text(100);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(101, "tr")(102, "td", 24);
    \u0275\u0275text(103, "Date Fr\xE9quence");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(104, "td", 26);
    \u0275\u0275text(105);
    \u0275\u0275elementEnd();
    \u0275\u0275element(106, "td", 24)(107, "td", 26);
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275elementStart(108, "p-tabPanel", 27);
    \u0275\u0275template(109, ViewDetailCreditComponent_Conditional_4_ng_template_109_Template, 3, 0, "ng-template", 8)(110, ViewDetailCreditComponent_Conditional_4_Conditional_110_Template, 23, 3, "p-card", 28)(111, ViewDetailCreditComponent_Conditional_4_Conditional_111_Template, 1, 1, "p-message", 29);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(112, "p-panel", 30);
    \u0275\u0275template(113, ViewDetailCreditComponent_Conditional_4_ng_template_113_Template, 4, 0, "ng-template", 8);
    \u0275\u0275elementStart(114, "p-tabView", 13)(115, "p-tabPanel", 31);
    \u0275\u0275template(116, ViewDetailCreditComponent_Conditional_4_ng_template_116_Template, 3, 0, "ng-template", 8)(117, ViewDetailCreditComponent_Conditional_4_Conditional_117_Template, 1, 1, "p-message", 32)(118, ViewDetailCreditComponent_Conditional_4_Conditional_118_Template, 4, 4, "p-table", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(119, "p-tabPanel", 34);
    \u0275\u0275template(120, ViewDetailCreditComponent_Conditional_4_ng_template_120_Template, 3, 0, "ng-template", 8)(121, ViewDetailCreditComponent_Conditional_4_Conditional_121_Template, 1, 1, "p-message", 35)(122, ViewDetailCreditComponent_Conditional_4_Conditional_122_Template, 4, 4, "p-table", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(123, "p-tabPanel", 37);
    \u0275\u0275template(124, ViewDetailCreditComponent_Conditional_4_ng_template_124_Template, 3, 0, "ng-template", 8)(125, ViewDetailCreditComponent_Conditional_4_Conditional_125_Template, 23, 3, "p-card", 28)(126, ViewDetailCreditComponent_Conditional_4_Conditional_126_Template, 1, 1, "p-message", 38);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(127, "p-panel", 39);
    \u0275\u0275template(128, ViewDetailCreditComponent_Conditional_4_ng_template_128_Template, 4, 0, "ng-template", 8);
    \u0275\u0275elementStart(129, "p-tabView", 13)(130, "p-tabPanel", 40);
    \u0275\u0275template(131, ViewDetailCreditComponent_Conditional_4_ng_template_131_Template, 3, 0, "ng-template", 8);
    \u0275\u0275elementStart(132, "p-card", 41)(133, "div", 16)(134, "div", 17)(135, "div", 18)(136, "label");
    \u0275\u0275text(137, "Libell\xE9:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(138, "span", 19);
    \u0275\u0275text(139);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(140, "div", 17)(141, "div", 18)(142, "label");
    \u0275\u0275text(143, "Montant:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(144, "span", 42);
    \u0275\u0275text(145);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(146, "div", 17)(147, "div", 18)(148, "label");
    \u0275\u0275text(149, "Date Cr\xE9ation:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(150, "span", 19);
    \u0275\u0275text(151);
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275elementStart(152, "p-tabPanel", 43);
    \u0275\u0275template(153, ViewDetailCreditComponent_Conditional_4_ng_template_153_Template, 3, 0, "ng-template", 8)(154, ViewDetailCreditComponent_Conditional_4_Conditional_154_Template, 1, 1, "p-message", 44)(155, ViewDetailCreditComponent_Conditional_4_Conditional_155_Template, 3, 4, "p-table", 45);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(156, "p-tabPanel", 46);
    \u0275\u0275template(157, ViewDetailCreditComponent_Conditional_4_ng_template_157_Template, 3, 0, "ng-template", 8)(158, ViewDetailCreditComponent_Conditional_4_Conditional_158_Template, 23, 3, "p-card", 28)(159, ViewDetailCreditComponent_Conditional_4_Conditional_159_Template, 1, 1, "p-message", 47);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(160, "p-card", 48)(161, "div", 49)(162, "p-button", 50);
    \u0275\u0275listener("onClick", function ViewDetailCreditComponent_Conditional_4_Template_p_button_onClick_162_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.router.navigate(["/dashboards/home"]));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(163, ViewDetailCreditComponent_Conditional_4_Conditional_163_Template, 1, 0, "p-button", 51)(164, ViewDetailCreditComponent_Conditional_4_Conditional_164_Template, 1, 0, "p-button", 52);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_4_0;
    let tmp_5_0;
    let tmp_6_0;
    let tmp_7_0;
    let tmp_8_0;
    let tmp_9_0;
    let tmp_10_0;
    let tmp_11_0;
    let tmp_12_0;
    let tmp_13_0;
    let tmp_14_0;
    let tmp_15_0;
    let tmp_16_0;
    let tmp_17_0;
    let tmp_18_0;
    let tmp_19_0;
    let tmp_22_0;
    let tmp_23_0;
    let tmp_26_0;
    let tmp_27_0;
    let tmp_28_0;
    let tmp_29_0;
    let tmp_32_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("toggleable", true);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r0.state().appreciation ? 4 : 5);
    \u0275\u0275advance(2);
    \u0275\u0275property("toggleable", true);
    \u0275\u0275advance(12);
    \u0275\u0275textInterpolate(((tmp_4_0 = ctx_r0.state().membre) == null ? null : tmp_4_0.nom_CLIENTE) || "N/A");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(((tmp_5_0 = ctx_r0.state().membre) == null ? null : tmp_5_0.clientesPKId == null ? null : tmp_5_0.clientesPKId.codCliente) || "N/A");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(((tmp_6_0 = ctx_r0.state().membre) == null ? null : tmp_6_0.tel_PRINCIPAL) || "N/A");
    \u0275\u0275advance(21);
    \u0275\u0275textInterpolate1("", ctx_r0.getFormattedAmount((tmp_7_0 = ctx_r0.state().instanceCreditInd) == null ? null : tmp_7_0.capital), " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", ctx_r0.getFormattedAmount((tmp_8_0 = ctx_r0.state().instanceCreditInd) == null ? null : tmp_8_0.creance), " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", ctx_r0.getFormattedAmount((tmp_9_0 = ctx_r0.state().instanceCreditInd) == null ? null : tmp_9_0.dette), " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.getFormattedAmount((tmp_10_0 = ctx_r0.state().instanceCreditInd) == null ? null : tmp_10_0.cumulCredit));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(((tmp_11_0 = ctx_r0.state().instanceCreditInd) == null ? null : tmp_11_0.moyenPerson) || "N/A");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(((tmp_12_0 = ctx_r0.state().instanceCreditInd) == null ? null : tmp_12_0.bien) || "N/A");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(((tmp_13_0 = ctx_r0.state().instanceCreditInd) == null ? null : tmp_13_0.statutActivite) || "N/A");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(((tmp_14_0 = ctx_r0.state().instanceCreditInd) == null ? null : tmp_14_0.experience) || "N/A");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(((tmp_15_0 = ctx_r0.state().instanceCreditInd) == null ? null : tmp_15_0.lieuxAct) || "N/A");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(((tmp_16_0 = ctx_r0.state().instanceCreditInd) == null ? null : tmp_16_0.nombre) || "N/A");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(((tmp_17_0 = ctx_r0.state().instanceCreditInd) == null ? null : tmp_17_0.nbreCredit) || "N/A");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(((tmp_18_0 = ctx_r0.state().instanceCreditInd) == null ? null : tmp_18_0.frequence) || "N/A");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.getFormattedDate((tmp_19_0 = ctx_r0.state().instanceCreditInd) == null ? null : tmp_19_0.frequenceCreatedAt));
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r0.state().noteProfile ? 110 : 111);
    \u0275\u0275advance(2);
    \u0275\u0275property("toggleable", true);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(!((tmp_22_0 = ctx_r0.state().products) == null ? null : tmp_22_0.length) ? 117 : 118);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(!((tmp_23_0 = ctx_r0.state().charges) == null ? null : tmp_23_0.length) ? 121 : 122);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r0.state().noteAnalyse ? 125 : 126);
    \u0275\u0275advance(2);
    \u0275\u0275property("toggleable", true);
    \u0275\u0275advance(12);
    \u0275\u0275textInterpolate(((tmp_26_0 = ctx_r0.state().instanceCreditInd) == null ? null : tmp_26_0.garantieLibele) || "N/A");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r0.getFormattedAmount((tmp_27_0 = ctx_r0.state().instanceCreditInd) == null ? null : tmp_27_0.garantieMontant));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r0.getFormattedDate((tmp_28_0 = ctx_r0.state().instanceCreditInd) == null ? null : tmp_28_0.garantieCreatedAt));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(!((tmp_29_0 = ctx_r0.state().garantieCaution) == null ? null : tmp_29_0.length) ? 154 : 155);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r0.state().noteGarantie ? 158 : 159);
    \u0275\u0275advance(4);
    \u0275\u0275property("outlined", true);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_32_0 = ctx_r0.state().appreciation) == null ? null : tmp_32_0.status) === "REJECTED" ? 163 : 164);
  }
}
var ViewDetailCreditComponent = class _ViewDetailCreditComponent {
  userService = inject(UserService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  messageService = inject(MessageService);
  state = signal({
    loading: false,
    message: void 0,
    error: void 0
  });
  ngOnInit() {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const referenceCredit = params["referenceCredit"];
      const numeroMembre = params["numeroMembre"];
      if (referenceCredit && numeroMembre) {
        this.loadCreditDetails(referenceCredit, numeroMembre);
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
  loadCreditDetails(referenceCredit, numeroMembre) {
    this.state.set(__spreadProps(__spreadValues({}, this.state()), { loading: true }));
    this.userService.detailCreditInd$(referenceCredit, numeroMembre).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.state.set(__spreadProps(__spreadValues({}, this.state()), {
          instanceCreditInd: response.data.instanceCreditInd,
          appreciation: response.data.appreciation,
          membre: response.data.membre,
          charges: response.data.charges,
          products: response.data.products,
          garantieCaution: response.data.garantieCaution,
          noteProfile: response.data.noteProfile,
          noteAnalyse: response.data.noteAnalyse,
          noteGarantie: response.data.noteGarantie,
          user: response.data.user,
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
  getFormattedDate(date) {
    if (!date)
      return "N/A";
    return new Date(date).toLocaleDateString("fr-FR");
  }
  getFormattedAmount(amount) {
    if (amount === void 0 || amount === null)
      return "N/A";
    return new Intl.NumberFormat("fr-GN", { style: "currency", currency: "GNF" }).format(amount);
  }
  getTotalProductAmount() {
    return this.state().products?.reduce((sum, p) => sum + (p.prix_unit || 0), 0) || 0;
  }
  // Add this method to calculate the total charges
  getTotalCharges() {
    return this.state().charges?.reduce((sum, c) => sum + (c.prix_unit || 0), 0) || 0;
  }
  startInsertingCredit(referenceCredit, numeroMembre, userId) {
    console.log(referenceCredit, numeroMembre, userId);
    this.router.navigate(["/dashboards/agent-credit/detail-credit-ind/form-credit/", referenceCredit, numeroMembre, userId]);
  }
  updateCredit(referenceCredit) {
    this.router.navigate(["/dashboards/agent-credit/process-update-credit/", referenceCredit]);
  }
  /**
   * Retourne la classe CSS pour les chips de statut
   */
  getStatusChipClass(status) {
    if (!status)
      return "";
    const baseClass = "status-chip ";
    switch (status.toUpperCase()) {
      case "ACCEPTED":
      case "ACCEPT\xC9":
      case "VALID\xC9":
        return baseClass + "status-accepted";
      case "REJECTED":
      case "REJET\xC9":
      case "REFUS\xC9":
        return baseClass + "status-rejected";
      case "PENDING":
      case "EN_ATTENTE":
      case "EN ATTENTE":
        return baseClass + "status-pending";
      default:
        return baseClass + "status-default";
    }
  }
  static \u0275fac = function ViewDetailCreditComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ViewDetailCreditComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ViewDetailCreditComponent, selectors: [["app-view-detail-credit"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 5, vars: 1, consts: [[1, "credit-details-container"], [1, "loading-container"], ["severity", "error", "styleClass", "w-full mb-4 error-message", 3, "text", "closable"], ["styleClass", "loading-card"], [1, "flex", "justify-content-center", "align-items-center", 2, "height", "200px"], ["strokeWidth", "4", "animationDuration", "1s"], [1, "ml-3", "text-xl", "font-semibold"], ["styleClass", "header-card mb-4"], ["pTemplate", "header"], ["header", "\u{1F4AC} Appr\xE9ciation", "styleClass", "appreciation-panel mb-4", 3, "toggleable"], ["severity", "info", "text", "Aucune appr\xE9ciation disponible", 3, "closable"], [1, "appreciation-content"], ["header", "\u{1F464} Informations du Profil", "styleClass", "profile-panel mb-4", 3, "toggleable"], ["styleClass", "custom-tabview"], ["header", "Informations Client"], ["styleClass", "client-info-card"], [1, "grid"], [1, "col-12", "md:col-4"], [1, "field-group"], [1, "text-value"], ["header", "Informations Cr\xE9dit"], ["styleClass", "credit-info-card"], [1, "simple-table-container"], [1, "simple-credit-table", "w-full"], [1, "attr-cell"], [1, "money-cell"], [1, "text-cell"], ["header", "Note du Profil"], ["styleClass", "note-card"], ["severity", "info", "text", "Aucune note de profil disponible", 3, "closable"], ["header", "\u{1F4CA} Analyse Financi\xE8re", "styleClass", "analysis-panel mb-4", 3, "toggleable"], ["header", "Produits"], ["severity", "warn", "text", "Aucun produit trouv\xE9", 3, "closable"], ["styleClass", "product-table modern-table", "currentPageReportTemplate", "Affichage de {first} \xE0 {last} sur {totalRecords} produits", 3, "value", "paginator", "rows", "showCurrentPageReport"], ["header", "Charges"], ["severity", "warn", "text", "Aucune charge trouv\xE9e", 3, "closable"], ["styleClass", "charges-table modern-table", "currentPageReportTemplate", "Affichage de {first} \xE0 {last} sur {totalRecords} charges", 3, "value", "paginator", "rows", "showCurrentPageReport"], ["header", "Note d'Analyse"], ["severity", "info", "text", "Aucune note d'analyse disponible", 3, "closable"], ["header", "\u{1F6E1}\uFE0F Garanties", "styleClass", "guarantee-panel mb-4", 3, "toggleable"], ["header", "Garantie Mat\xE9rielle"], ["styleClass", "guarantee-card"], [1, "amount-value"], ["header", "Garantie Personnes Caution"], ["severity", "warn", "text", "Aucune garantie personne caution trouv\xE9e", 3, "closable"], ["styleClass", "guarantee-table modern-table", "currentPageReportTemplate", "Affichage de {first} \xE0 {last} sur {totalRecords} garanties", 3, "value", "paginator", "rows", "showCurrentPageReport"], ["header", "Note de Garantie"], ["severity", "info", "text", "Aucune note de garantie disponible", 3, "closable"], ["styleClass", "action-card"], [1, "action-buttons"], ["label", "Retour", "icon", "pi pi-arrow-left", "severity", "secondary", "styleClass", "action-btn-secondary", 3, "onClick", "outlined"], ["label", "Prendre en compte les Suggestions du DA", "icon", "pi pi-money-bill", "severity", "danger", "styleClass", "action-btn-danger"], ["label", "Mise en place de Cr\xE9dit dans SAF", "icon", "pi pi-database", "severity", "primary", "styleClass", "action-btn-primary"], [1, "header-content"], [1, "flex", "justify-content-between", "align-items-center", "p-4"], [1, "header-title", "m-0"], [1, "pi", "pi-file-edit", "mr-3"], [1, "header-subtitle", "mt-2", "mb-0"], ["styleClass", "reference-chip", 3, "label"], [1, "pi", "pi-hashtag", "mr-2"], [1, "flex", "align-items-center"], [1, "pi", "pi-thumbs-up", "text-2xl", "mr-3", "text-primary"], [1, "text-xl", "font-bold"], [1, "col-12", "md:col-6"], ["styleClass", "info-card h-full"], [3, "label", "styleClass"], [1, "col-12"], [1, "motif-section-wrapper"], [1, "motif-container"], [1, "motif-header"], [1, "motif-icon-wrapper"], [1, "pi", "pi-comment"], [1, "motif-title"], [1, "motif-content"], [1, "card-header"], [1, "pi", "pi-money-bill"], [1, "pi", "pi-info-circle"], [1, "pi", "pi-user", "text-2xl", "mr-3", "text-primary"], [1, "pi", "pi-user", "mr-2"], [1, "pi", "pi-credit-card", "mr-2"], [1, "pi", "pi-star", "mr-2"], [1, "grid", "align-items-center", "mb-4"], [1, "col-12", "md:col-3"], [1, "score-display"], [1, "score-value"], [1, "score-label"], [1, "comment-section-wrapper"], [1, "comment-container"], [1, "comment-header"], [1, "comment-icon-wrapper"], [1, "pi", "pi-file-edit"], [1, "comment-title"], [1, "comment-content"], [1, "pi", "pi-chart-line", "text-2xl", "mr-3", "text-primary"], [1, "pi", "pi-box", "mr-2"], ["pTemplate", "body"], ["pTemplate", "summary"], ["pSortableColumn", "libele"], ["field", "libele"], ["pSortableColumn", "prixUnit"], ["field", "prixUnit"], ["pSortableColumn", "qte"], ["field", "qte"], ["pSortableColumn", "createdAt"], ["field", "createdAt"], [1, "font-medium"], [1, "amount-cell"], [1, "text-center"], [1, "table-summary"], [1, "pi", "pi-receipt", "mr-2"], ["pSortableColumn", "createAt"], ["field", "createAt"], [1, "pi", "pi-clipboard", "mr-2"], [1, "pi", "pi-chart-bar"], [1, "pi", "pi-shield", "text-2xl", "mr-3", "text-primary"], [1, "pi", "pi-home", "mr-2"], [1, "pi", "pi-users", "mr-2"], ["pSortableColumn", "nom"], ["field", "nom"], ["pSortableColumn", "prenom"], ["field", "prenom"], ["pSortableColumn", "age"], ["field", "age"], [1, "pi", "pi-shield"], ["label", "Prendre en compte les Suggestions du DA", "icon", "pi pi-money-bill", "severity", "danger", "styleClass", "action-btn-danger", 3, "onClick"], ["label", "Mise en place de Cr\xE9dit dans SAF", "icon", "pi pi-database", "severity", "primary", "styleClass", "action-btn-primary", 3, "onClick"]], template: function ViewDetailCreditComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "p-toast");
      \u0275\u0275template(2, ViewDetailCreditComponent_Conditional_2_Template, 6, 0, "div", 1)(3, ViewDetailCreditComponent_Conditional_3_Template, 1, 2, "p-message", 2)(4, ViewDetailCreditComponent_Conditional_4_Template, 165, 32);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.state().loading ? 2 : ctx.state().error ? 3 : 4);
    }
  }, dependencies: [CommonModule, CardModule, Card, PrimeTemplate, DividerModule, ButtonModule, Button, PanelModule, Panel, ToastModule, Toast, ChipModule, Chip, MessageModule, Message, ProgressSpinnerModule, ProgressSpinner, TableModule, Table, SortableColumn, SortIcon, TabViewModule, TabView, TabPanel], styles: ['@charset "UTF-8";\n\n\n\n.credit-details-container[_ngcontent-%COMP%] {\n  max-width: 1400px;\n  margin: 0 auto;\n  padding: 1rem;\n  background: #f8fafc;\n  min-height: 100vh;\n}\n.credit-details-container[_ngcontent-%COMP%]   .header-card[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  border: none;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);\n}\n.credit-details-container[_ngcontent-%COMP%]   .header-card[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%] {\n  color: white;\n}\n.credit-details-container[_ngcontent-%COMP%]   .header-card[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%]   .header-title[_ngcontent-%COMP%] {\n  font-size: 2.5rem;\n  font-weight: 700;\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n}\n.credit-details-container[_ngcontent-%COMP%]   .header-card[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%]   .header-subtitle[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  opacity: 0.9;\n  font-weight: 300;\n}\n.credit-details-container[_ngcontent-%COMP%]   .header-card[_ngcontent-%COMP%]   .reference-chip[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.2) !important;\n  color: white !important;\n  border: 1px solid rgba(255, 255, 255, 0.3) !important;\n  -webkit-backdrop-filter: blur(10px);\n  backdrop-filter: blur(10px);\n  font-weight: 600 !important;\n  font-size: 1.1rem !important;\n  padding: 0.75rem 1.5rem !important;\n}\n.credit-details-container[_ngcontent-%COMP%]   .loading-container[_ngcontent-%COMP%] {\n  margin: 2rem 0;\n}\n.credit-details-container[_ngcontent-%COMP%]   .loading-container[_ngcontent-%COMP%]   .loading-card[_ngcontent-%COMP%] {\n  text-align: center;\n  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);\n}\n.credit-details-container[_ngcontent-%COMP%]   .error-message[_ngcontent-%COMP%] {\n  border-left: 4px solid #dc2626 !important;\n  background: #fee2e2 !important;\n  color: #7f1d1d !important;\n  font-weight: 600 !important;\n}\n.credit-details-container[_ngcontent-%COMP%]   .appreciation-panel[_ngcontent-%COMP%], \n.credit-details-container[_ngcontent-%COMP%]   .profile-panel[_ngcontent-%COMP%], \n.credit-details-container[_ngcontent-%COMP%]   .analysis-panel[_ngcontent-%COMP%], \n.credit-details-container[_ngcontent-%COMP%]   .guarantee-panel[_ngcontent-%COMP%] {\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);\n  border: 1px solid #e2e8f0;\n  border-radius: 12px;\n}\n.credit-details-container[_ngcontent-%COMP%]   .appreciation-panel[_ngcontent-%COMP%]     .p-panel-header, \n.credit-details-container[_ngcontent-%COMP%]   .profile-panel[_ngcontent-%COMP%]     .p-panel-header, \n.credit-details-container[_ngcontent-%COMP%]   .analysis-panel[_ngcontent-%COMP%]     .p-panel-header, \n.credit-details-container[_ngcontent-%COMP%]   .guarantee-panel[_ngcontent-%COMP%]     .p-panel-header {\n  background:\n    linear-gradient(\n      135deg,\n      #f8fafc 0%,\n      #e2e8f0 100%);\n  border-bottom: 3px solid #3b82f6;\n  border-radius: 12px 12px 0 0;\n  padding: 1.5rem;\n}\n.credit-details-container[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%], \n.credit-details-container[_ngcontent-%COMP%]   .client-info-card[_ngcontent-%COMP%], \n.credit-details-container[_ngcontent-%COMP%]   .credit-info-card[_ngcontent-%COMP%], \n.credit-details-container[_ngcontent-%COMP%]   .note-card[_ngcontent-%COMP%], \n.credit-details-container[_ngcontent-%COMP%]   .guarantee-card[_ngcontent-%COMP%], \n.credit-details-container[_ngcontent-%COMP%]   .action-card[_ngcontent-%COMP%] {\n  border: 1px solid #e2e8f0;\n  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);\n  border-radius: 12px;\n  transition: all 0.3s ease;\n}\n.credit-details-container[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%]:hover, \n.credit-details-container[_ngcontent-%COMP%]   .client-info-card[_ngcontent-%COMP%]:hover, \n.credit-details-container[_ngcontent-%COMP%]   .credit-info-card[_ngcontent-%COMP%]:hover, \n.credit-details-container[_ngcontent-%COMP%]   .note-card[_ngcontent-%COMP%]:hover, \n.credit-details-container[_ngcontent-%COMP%]   .guarantee-card[_ngcontent-%COMP%]:hover, \n.credit-details-container[_ngcontent-%COMP%]   .action-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);\n}\n.credit-details-container[_ngcontent-%COMP%]   .card-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  font-weight: 600;\n  color: #374151;\n  padding: 1rem 0;\n  border-bottom: 2px solid #e5e7eb;\n  margin-bottom: 1.5rem;\n}\n.credit-details-container[_ngcontent-%COMP%]   .card-header[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: #3b82f6;\n  font-size: 1.25rem;\n}\n.credit-details-container[_ngcontent-%COMP%]   .field-group[_ngcontent-%COMP%] {\n  margin-bottom: 1.5rem;\n}\n.credit-details-container[_ngcontent-%COMP%]   .field-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  font-weight: 600;\n  color: #6b7280;\n  font-size: 0.875rem;\n  margin-bottom: 0.5rem;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.credit-details-container[_ngcontent-%COMP%]   .text-value[_ngcontent-%COMP%] {\n  color: #111827;\n  font-weight: 500;\n  font-size: 1rem;\n}\n.credit-details-container[_ngcontent-%COMP%]   .amount-value[_ngcontent-%COMP%] {\n  color: #059669;\n  font-weight: 700;\n  font-size: 1.125rem;\n}\n.credit-details-container[_ngcontent-%COMP%]   .motif-section-wrapper[_ngcontent-%COMP%] {\n  margin: 1.5rem 0;\n}\n.credit-details-container[_ngcontent-%COMP%]   .motif-section-wrapper[_ngcontent-%COMP%]   .motif-container[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #fef3c7 0%,\n      #fde68a 100%);\n  border: 3px solid #f59e0b;\n  border-radius: 16px;\n  padding: 1.5rem;\n  position: relative;\n  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.25);\n  transform: scale(1.01);\n  animation: _ngcontent-%COMP%_motif-pulse 3s ease-in-out infinite alternate;\n}\n.credit-details-container[_ngcontent-%COMP%]   .motif-section-wrapper[_ngcontent-%COMP%]   .motif-container[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: -12px;\n  left: 25px;\n  width: 40px;\n  height: 40px;\n  background:\n    linear-gradient(\n      135deg,\n      #f59e0b 0%,\n      #d97706 100%);\n  border-radius: 50%;\n  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);\n  z-index: 1;\n}\n.credit-details-container[_ngcontent-%COMP%]   .motif-section-wrapper[_ngcontent-%COMP%]   .motif-container[_ngcontent-%COMP%]   .motif-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  margin-bottom: 1rem;\n  padding-bottom: 0.75rem;\n  border-bottom: 2px solid #f59e0b;\n  position: relative;\n  z-index: 2;\n}\n.credit-details-container[_ngcontent-%COMP%]   .motif-section-wrapper[_ngcontent-%COMP%]   .motif-container[_ngcontent-%COMP%]   .motif-header[_ngcontent-%COMP%]   .motif-icon-wrapper[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -35px;\n  left: -10px;\n  width: 40px;\n  height: 40px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.credit-details-container[_ngcontent-%COMP%]   .motif-section-wrapper[_ngcontent-%COMP%]   .motif-container[_ngcontent-%COMP%]   .motif-header[_ngcontent-%COMP%]   .motif-icon-wrapper[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: white;\n  font-size: 1.2rem;\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n}\n.credit-details-container[_ngcontent-%COMP%]   .motif-section-wrapper[_ngcontent-%COMP%]   .motif-container[_ngcontent-%COMP%]   .motif-header[_ngcontent-%COMP%]   .motif-title[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  font-weight: 700;\n  color: #92400e;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);\n  letter-spacing: 0.5px;\n  text-transform: uppercase;\n  margin-left: 2.5rem;\n}\n.credit-details-container[_ngcontent-%COMP%]   .motif-section-wrapper[_ngcontent-%COMP%]   .motif-container[_ngcontent-%COMP%]   .motif-content[_ngcontent-%COMP%] {\n  font-weight: 600;\n  font-size: 1rem;\n  color: #92400e;\n  line-height: 1.6;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);\n  background: rgba(255, 255, 255, 0.6);\n  padding: 1.25rem;\n  border-radius: 12px;\n  border: 2px solid rgba(245, 158, 11, 0.3);\n  box-shadow: inset 0 2px 8px rgba(245, 158, 11, 0.1);\n}\n.credit-details-container[_ngcontent-%COMP%]   .comment-section-wrapper[_ngcontent-%COMP%] {\n  margin: 1.5rem 0;\n}\n.credit-details-container[_ngcontent-%COMP%]   .comment-section-wrapper[_ngcontent-%COMP%]   .comment-container[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #dbeafe 0%,\n      #bfdbfe 100%);\n  border: 3px solid #3b82f6;\n  border-radius: 16px;\n  padding: 1.5rem;\n  position: relative;\n  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.25);\n  transform: scale(1.01);\n  animation: _ngcontent-%COMP%_comment-pulse 3s ease-in-out infinite alternate;\n}\n.credit-details-container[_ngcontent-%COMP%]   .comment-section-wrapper[_ngcontent-%COMP%]   .comment-container[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: -12px;\n  left: 25px;\n  width: 40px;\n  height: 40px;\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #1d4ed8 100%);\n  border-radius: 50%;\n  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);\n  z-index: 1;\n}\n.credit-details-container[_ngcontent-%COMP%]   .comment-section-wrapper[_ngcontent-%COMP%]   .comment-container[_ngcontent-%COMP%]   .comment-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  margin-bottom: 1rem;\n  padding-bottom: 0.75rem;\n  border-bottom: 2px solid #3b82f6;\n  position: relative;\n  z-index: 2;\n}\n.credit-details-container[_ngcontent-%COMP%]   .comment-section-wrapper[_ngcontent-%COMP%]   .comment-container[_ngcontent-%COMP%]   .comment-header[_ngcontent-%COMP%]   .comment-icon-wrapper[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -35px;\n  left: -10px;\n  width: 40px;\n  height: 40px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.credit-details-container[_ngcontent-%COMP%]   .comment-section-wrapper[_ngcontent-%COMP%]   .comment-container[_ngcontent-%COMP%]   .comment-header[_ngcontent-%COMP%]   .comment-icon-wrapper[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: white;\n  font-size: 1.2rem;\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n}\n.credit-details-container[_ngcontent-%COMP%]   .comment-section-wrapper[_ngcontent-%COMP%]   .comment-container[_ngcontent-%COMP%]   .comment-header[_ngcontent-%COMP%]   .comment-title[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  font-weight: 700;\n  color: #1e40af;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);\n  letter-spacing: 0.5px;\n  text-transform: uppercase;\n  margin-left: 2.5rem;\n}\n.credit-details-container[_ngcontent-%COMP%]   .comment-section-wrapper[_ngcontent-%COMP%]   .comment-container[_ngcontent-%COMP%]   .comment-content[_ngcontent-%COMP%] {\n  font-weight: 600;\n  font-size: 1rem;\n  color: #1e40af;\n  line-height: 1.6;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);\n  background: rgba(255, 255, 255, 0.6);\n  padding: 1.25rem;\n  border-radius: 12px;\n  border: 2px solid rgba(59, 130, 246, 0.3);\n  box-shadow: inset 0 2px 8px rgba(59, 130, 246, 0.1);\n}\n.credit-details-container[_ngcontent-%COMP%]   .score-display[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #1d4ed8 100%);\n  color: white;\n  padding: 2rem;\n  border-radius: 20px;\n  text-align: center;\n  box-shadow: 0 12px 32px rgba(59, 130, 246, 0.4);\n  transform: scale(1.05);\n  transition: all 0.3s ease;\n}\n.credit-details-container[_ngcontent-%COMP%]   .score-display[_ngcontent-%COMP%]:hover {\n  transform: scale(1.08);\n  box-shadow: 0 16px 40px rgba(59, 130, 246, 0.5);\n}\n.credit-details-container[_ngcontent-%COMP%]   .score-display[_ngcontent-%COMP%]   .score-value[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  font-weight: 800;\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n  margin-bottom: 0.5rem;\n  line-height: 1;\n}\n.credit-details-container[_ngcontent-%COMP%]   .score-display[_ngcontent-%COMP%]   .score-label[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  font-weight: 600;\n  opacity: 0.9;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n}\n.credit-details-container[_ngcontent-%COMP%]   .status-chip[_ngcontent-%COMP%] {\n  font-weight: 600 !important;\n  text-transform: uppercase !important;\n  letter-spacing: 0.5px !important;\n  padding: 0.5rem 1rem !important;\n  border-radius: 20px !important;\n}\n.credit-details-container[_ngcontent-%COMP%]   .status-chip.status-accepted[_ngcontent-%COMP%] {\n  background: #dcfce7 !important;\n  color: #166534 !important;\n  border: 2px solid #16a34a !important;\n}\n.credit-details-container[_ngcontent-%COMP%]   .status-chip.status-rejected[_ngcontent-%COMP%] {\n  background: #fee2e2 !important;\n  color: #dc2626 !important;\n  border: 2px solid #dc2626 !important;\n}\n.credit-details-container[_ngcontent-%COMP%]   .status-chip.status-pending[_ngcontent-%COMP%] {\n  background: #dbeafe !important;\n  color: #1d4ed8 !important;\n  border: 2px solid #3b82f6 !important;\n}\n.credit-details-container[_ngcontent-%COMP%]   .status-chip.status-default[_ngcontent-%COMP%] {\n  background: #f3f4f6 !important;\n  color: #374151 !important;\n  border: 2px solid #d1d5db !important;\n}\n.credit-details-container[_ngcontent-%COMP%]   .modern-table[_ngcontent-%COMP%] {\n  border-radius: 12px;\n  overflow: hidden;\n  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);\n}\n.credit-details-container[_ngcontent-%COMP%]   .modern-table[_ngcontent-%COMP%]     .p-datatable-thead > tr > th {\n  background:\n    linear-gradient(\n      135deg,\n      #374151 0%,\n      #1f2937 100%);\n  color: white;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  padding: 1rem;\n  border: none;\n}\n.credit-details-container[_ngcontent-%COMP%]   .modern-table[_ngcontent-%COMP%]     .p-datatable-tbody > tr {\n  transition: all 0.2s ease;\n}\n.credit-details-container[_ngcontent-%COMP%]   .modern-table[_ngcontent-%COMP%]     .p-datatable-tbody > tr:hover {\n  background: #f0f9ff;\n  transform: translateY(-1px);\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n}\n.credit-details-container[_ngcontent-%COMP%]   .modern-table[_ngcontent-%COMP%]     .p-datatable-tbody > tr > td {\n  padding: 1rem;\n  border-bottom: 1px solid #e5e7eb;\n}\n.credit-details-container[_ngcontent-%COMP%]   .modern-table[_ngcontent-%COMP%]     .p-datatable-tbody > tr > td.amount-cell {\n  color: #059669;\n  font-weight: 700;\n  font-size: 1.1rem;\n}\n.credit-details-container[_ngcontent-%COMP%]   .modern-table[_ngcontent-%COMP%]     .p-paginator {\n  background: #f9fafb;\n  border-top: 1px solid #e5e7eb;\n  padding: 1rem;\n}\n.credit-details-container[_ngcontent-%COMP%]   .modern-table[_ngcontent-%COMP%]   .table-summary[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #f3f4f6 0%,\n      #e5e7eb 100%);\n  padding: 1rem;\n  text-align: right;\n  font-size: 1.1rem;\n  border-top: 2px solid #d1d5db;\n  margin-top: 1rem;\n}\n.credit-details-container[_ngcontent-%COMP%]   .credit-info-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  margin-bottom: 1rem;\n  background: white;\n  border-radius: 12px;\n  overflow: hidden;\n  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);\n}\n.credit-details-container[_ngcontent-%COMP%]   .credit-info-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:first-child   .table-section-header[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #1d4ed8 100%);\n  color: white;\n  font-size: 1.125rem;\n  font-weight: 700;\n  padding: 1.25rem;\n  text-align: center;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n  border: none;\n}\n.credit-details-container[_ngcontent-%COMP%]   .credit-info-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:first-child   .table-section-header[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  margin-right: 0.5rem;\n  font-size: 1.25rem;\n}\n.credit-details-container[_ngcontent-%COMP%]   .credit-info-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:nth-child(2)   th[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #374151 0%,\n      #1f2937 100%);\n  color: white;\n  font-weight: 600;\n  padding: 0.875rem;\n  text-align: center;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  font-size: 0.875rem;\n  border: none;\n  width: 25%;\n}\n.credit-details-container[_ngcontent-%COMP%]   .credit-info-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n  border-bottom: 1px solid #e5e7eb;\n}\n.credit-details-container[_ngcontent-%COMP%]   .credit-info-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #f0f9ff 0%,\n      #e0f2fe 100%);\n  transform: translateY(-1px);\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n}\n.credit-details-container[_ngcontent-%COMP%]   .credit-info-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:last-child {\n  border-bottom: none;\n}\n.credit-details-container[_ngcontent-%COMP%]   .credit-info-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 1rem;\n  vertical-align: middle;\n  border-right: 1px solid #f1f5f9;\n}\n.credit-details-container[_ngcontent-%COMP%]   .credit-info-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:last-child {\n  border-right: none;\n}\n.credit-details-container[_ngcontent-%COMP%]   .credit-info-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   td.attribute-cell[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #f8fafc 0%,\n      #f1f5f9 100%);\n  font-weight: 600;\n  color: #475569;\n  font-size: 0.875rem;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  width: 25%;\n  border-right: 2px solid #e2e8f0;\n}\n.credit-details-container[_ngcontent-%COMP%]   .credit-info-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   td.amount-cell[_ngcontent-%COMP%] {\n  color: #059669;\n  font-weight: 700;\n  font-size: 1.125rem;\n  text-align: right;\n  background:\n    linear-gradient(\n      135deg,\n      #f0fdf4 0%,\n      #dcfce7 100%);\n  width: 25%;\n}\n.credit-details-container[_ngcontent-%COMP%]   .credit-info-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   td.value-cell[_ngcontent-%COMP%] {\n  color: #1e293b;\n  font-weight: 500;\n  font-size: 1rem;\n  width: 25%;\n}\n.credit-details-container[_ngcontent-%COMP%]   .credit-info-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:empty {\n  background: #f9fafb;\n  position: relative;\n}\n.credit-details-container[_ngcontent-%COMP%]   .credit-info-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:empty::after {\n  content: "\\2014";\n  color: #9ca3af;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  font-size: 1.2rem;\n}\n@media (max-width: 768px) {\n  .credit-details-container[_ngcontent-%COMP%]   .credit-info-table[_ngcontent-%COMP%] {\n    font-size: 0.875rem;\n  }\n  .credit-details-container[_ngcontent-%COMP%]   .credit-info-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   .table-section-header[_ngcontent-%COMP%] {\n    font-size: 1rem;\n    padding: 1rem;\n  }\n  .credit-details-container[_ngcontent-%COMP%]   .credit-info-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n    padding: 0.75rem 0.5rem;\n  }\n  .credit-details-container[_ngcontent-%COMP%]   .credit-info-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   td.attribute-cell[_ngcontent-%COMP%] {\n    font-size: 0.75rem;\n  }\n  .credit-details-container[_ngcontent-%COMP%]   .credit-info-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   td.amount-cell[_ngcontent-%COMP%] {\n    font-size: 1rem;\n  }\n  .credit-details-container[_ngcontent-%COMP%]   .credit-info-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   td.value-cell[_ngcontent-%COMP%] {\n    font-size: 0.875rem;\n  }\n}\n.credit-details-container[_ngcontent-%COMP%]   .custom-tabview[_ngcontent-%COMP%]     .p-tabview-nav {\n  background: #f9fafb;\n  border-radius: 8px 8px 0 0;\n}\n.credit-details-container[_ngcontent-%COMP%]   .custom-tabview[_ngcontent-%COMP%]     .p-tabview-nav li .p-tabview-nav-link {\n  border-radius: 8px 8px 0 0;\n  font-weight: 600;\n  padding: 1rem 1.5rem;\n  transition: all 0.2s ease;\n}\n.credit-details-container[_ngcontent-%COMP%]   .custom-tabview[_ngcontent-%COMP%]     .p-tabview-nav li .p-tabview-nav-link:hover {\n  background: #f3f4f6;\n}\n.credit-details-container[_ngcontent-%COMP%]   .custom-tabview[_ngcontent-%COMP%]     .p-tabview-nav li.p-highlight .p-tabview-nav-link {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #1d4ed8 100%);\n  color: white;\n  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);\n}\n.credit-details-container[_ngcontent-%COMP%]   .custom-tabview[_ngcontent-%COMP%]     .p-tabview-panels {\n  padding: 1.5rem;\n  background: white;\n  border-radius: 0 0 8px 8px;\n}\n.credit-details-container[_ngcontent-%COMP%]   .action-buttons[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 1rem;\n  flex-wrap: wrap;\n  padding: 1.5rem;\n}\n.credit-details-container[_ngcontent-%COMP%]   .action-buttons[_ngcontent-%COMP%]   .action-btn-secondary[_ngcontent-%COMP%]     .p-button {\n  border: 2px solid #d1d5db;\n  color: #374151;\n  background: white;\n  font-weight: 600;\n  padding: 0.75rem 1.5rem;\n  transition: all 0.2s ease;\n}\n.credit-details-container[_ngcontent-%COMP%]   .action-buttons[_ngcontent-%COMP%]   .action-btn-secondary[_ngcontent-%COMP%]     .p-button:hover {\n  background: #f3f4f6;\n  border-color: #9ca3af;\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n}\n.credit-details-container[_ngcontent-%COMP%]   .action-buttons[_ngcontent-%COMP%]   .action-btn-primary[_ngcontent-%COMP%]     .p-button {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #1d4ed8 100%);\n  border: 2px solid transparent;\n  font-weight: 600;\n  padding: 0.75rem 1.5rem;\n  transition: all 0.2s ease;\n}\n.credit-details-container[_ngcontent-%COMP%]   .action-buttons[_ngcontent-%COMP%]   .action-btn-primary[_ngcontent-%COMP%]     .p-button:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);\n}\n@keyframes _ngcontent-%COMP%_motif-pulse {\n  0% {\n    box-shadow: 0 8px 24px rgba(245, 158, 11, 0.25);\n  }\n  100% {\n    box-shadow: 0 10px 28px rgba(245, 158, 11, 0.35);\n  }\n}\n@keyframes _ngcontent-%COMP%_comment-pulse {\n  0% {\n    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.25);\n  }\n  100% {\n    box-shadow: 0 10px 28px rgba(59, 130, 246, 0.35);\n  }\n}\n@media (max-width: 768px) {\n  .credit-details-container[_ngcontent-%COMP%] {\n    padding: 0.5rem;\n  }\n  .credit-details-container[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%]   .header-title[_ngcontent-%COMP%] {\n    font-size: 1.8rem;\n  }\n  .credit-details-container[_ngcontent-%COMP%]   .motif-container[_ngcontent-%COMP%], \n   .credit-details-container[_ngcontent-%COMP%]   .comment-container[_ngcontent-%COMP%] {\n    padding: 1rem;\n    margin: 1rem 0;\n    transform: scale(1);\n  }\n  .credit-details-container[_ngcontent-%COMP%]   .motif-container[_ngcontent-%COMP%]   .motif-content[_ngcontent-%COMP%], \n   .credit-details-container[_ngcontent-%COMP%]   .motif-container[_ngcontent-%COMP%]   .comment-content[_ngcontent-%COMP%], \n   .credit-details-container[_ngcontent-%COMP%]   .comment-container[_ngcontent-%COMP%]   .motif-content[_ngcontent-%COMP%], \n   .credit-details-container[_ngcontent-%COMP%]   .comment-container[_ngcontent-%COMP%]   .comment-content[_ngcontent-%COMP%] {\n    font-size: 0.9rem;\n    padding: 1rem;\n  }\n  .credit-details-container[_ngcontent-%COMP%]   .motif-container[_ngcontent-%COMP%]   .motif-title[_ngcontent-%COMP%], \n   .credit-details-container[_ngcontent-%COMP%]   .motif-container[_ngcontent-%COMP%]   .comment-title[_ngcontent-%COMP%], \n   .credit-details-container[_ngcontent-%COMP%]   .comment-container[_ngcontent-%COMP%]   .motif-title[_ngcontent-%COMP%], \n   .credit-details-container[_ngcontent-%COMP%]   .comment-container[_ngcontent-%COMP%]   .comment-title[_ngcontent-%COMP%] {\n    font-size: 1rem;\n    margin-left: 2rem;\n  }\n  .credit-details-container[_ngcontent-%COMP%]   .motif-container[_ngcontent-%COMP%]::before, \n   .credit-details-container[_ngcontent-%COMP%]   .comment-container[_ngcontent-%COMP%]::before {\n    width: 35px;\n    height: 35px;\n    top: -10px;\n    left: 20px;\n  }\n  .credit-details-container[_ngcontent-%COMP%]   .motif-container[_ngcontent-%COMP%]   .motif-icon-wrapper[_ngcontent-%COMP%], \n   .credit-details-container[_ngcontent-%COMP%]   .motif-container[_ngcontent-%COMP%]   .comment-icon-wrapper[_ngcontent-%COMP%], \n   .credit-details-container[_ngcontent-%COMP%]   .comment-container[_ngcontent-%COMP%]   .motif-icon-wrapper[_ngcontent-%COMP%], \n   .credit-details-container[_ngcontent-%COMP%]   .comment-container[_ngcontent-%COMP%]   .comment-icon-wrapper[_ngcontent-%COMP%] {\n    width: 35px;\n    height: 35px;\n    top: -30px;\n  }\n  .credit-details-container[_ngcontent-%COMP%]   .motif-container[_ngcontent-%COMP%]   .motif-icon-wrapper[_ngcontent-%COMP%]   i[_ngcontent-%COMP%], \n   .credit-details-container[_ngcontent-%COMP%]   .motif-container[_ngcontent-%COMP%]   .comment-icon-wrapper[_ngcontent-%COMP%]   i[_ngcontent-%COMP%], \n   .credit-details-container[_ngcontent-%COMP%]   .comment-container[_ngcontent-%COMP%]   .motif-icon-wrapper[_ngcontent-%COMP%]   i[_ngcontent-%COMP%], \n   .credit-details-container[_ngcontent-%COMP%]   .comment-container[_ngcontent-%COMP%]   .comment-icon-wrapper[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n    font-size: 1rem;\n  }\n  .credit-details-container[_ngcontent-%COMP%]   .score-display[_ngcontent-%COMP%] {\n    padding: 1.5rem;\n    transform: scale(1);\n  }\n  .credit-details-container[_ngcontent-%COMP%]   .score-display[_ngcontent-%COMP%]   .score-value[_ngcontent-%COMP%] {\n    font-size: 2.5rem;\n  }\n  .credit-details-container[_ngcontent-%COMP%]   .action-buttons[_ngcontent-%COMP%] {\n    flex-direction: column;\n  }\n  .credit-details-container[_ngcontent-%COMP%]   .simple-credit-table[_ngcontent-%COMP%] {\n    font-size: 0.75rem;\n  }\n  .credit-details-container[_ngcontent-%COMP%]   .simple-credit-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n    padding: 0.5rem;\n    font-size: 0.75rem;\n  }\n  .credit-details-container[_ngcontent-%COMP%]   .simple-credit-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n    padding: 0.4rem 0.5rem;\n  }\n  .credit-details-container[_ngcontent-%COMP%]   .simple-credit-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   td.attr-cell[_ngcontent-%COMP%] {\n    font-size: 0.7rem;\n  }\n  .credit-details-container[_ngcontent-%COMP%]   .simple-credit-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   td.money-cell[_ngcontent-%COMP%], \n   .credit-details-container[_ngcontent-%COMP%]   .simple-credit-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   td.text-cell[_ngcontent-%COMP%] {\n    font-size: 0.75rem;\n  }\n}\n@media print {\n  .credit-details-container[_ngcontent-%COMP%]   .motif-container[_ngcontent-%COMP%], \n   .credit-details-container[_ngcontent-%COMP%]   .comment-container[_ngcontent-%COMP%] {\n    background: #f9f9f9 !important;\n    border: 2px solid #333 !important;\n    box-shadow: none !important;\n    transform: none !important;\n    animation: none !important;\n  }\n  .credit-details-container[_ngcontent-%COMP%]   .motif-container[_ngcontent-%COMP%]   .motif-content[_ngcontent-%COMP%], \n   .credit-details-container[_ngcontent-%COMP%]   .motif-container[_ngcontent-%COMP%]   .comment-content[_ngcontent-%COMP%], \n   .credit-details-container[_ngcontent-%COMP%]   .comment-container[_ngcontent-%COMP%]   .motif-content[_ngcontent-%COMP%], \n   .credit-details-container[_ngcontent-%COMP%]   .comment-container[_ngcontent-%COMP%]   .comment-content[_ngcontent-%COMP%] {\n    color: #000 !important;\n    background: white !important;\n  }\n  .credit-details-container[_ngcontent-%COMP%]   .action-buttons[_ngcontent-%COMP%] {\n    display: none !important;\n  }\n}\n/*# sourceMappingURL=view-detail-credit.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ViewDetailCreditComponent, { className: "ViewDetailCreditComponent", filePath: "src/app/pages/dashboard/agent-credit/view-detail-credit/view-detail-credit.component.ts", lineNumber: 35 });
})();
export {
  ViewDetailCreditComponent
};
//# sourceMappingURL=chunk-QNTKLJKG.js.map
