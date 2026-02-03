import {
  ConfirmDialog,
  ConfirmDialogModule
} from "./chunk-JQ4E7TJM.js";
import {
  Textarea,
  TextareaModule
} from "./chunk-RW4OSSQT.js";
import {
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
  Skeleton,
  SkeletonModule
} from "./chunk-ZUPKH4BQ.js";
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
import {
  Dropdown,
  DropdownModule
} from "./chunk-ZCIQCP6V.js";
import "./chunk-V6CKOH3G.js";
import "./chunk-DBPX6ILC.js";
import {
  IconFieldModule,
  InputIconModule
} from "./chunk-WIQZFAVH.js";
import "./chunk-CCBQFN2J.js";
import {
  ProgressSpinnerModule
} from "./chunk-Y2J5OGKB.js";
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
import {
  RippleModule
} from "./chunk-AP3OAIHW.js";
import {
  ConfirmationService,
  MessageService,
  PrimeTemplate
} from "./chunk-NQNBRQ7H.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  MinValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NumberValueAccessor,
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
  DatePipe,
  NgForOf,
  NgIf
} from "./chunk-SQQPVFHK.js";
import {
  computed,
  finalize,
  inject,
  signal,
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
  ɵɵpipeBind2,
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

// src/app/pages/dashboard/agent-credit/stock-cmd/stock-cmd.component.ts
var _c0 = () => ({ "margin-bottom": "2rem" });
var _c1 = () => ({ width: "50vw" });
var _c2 = () => ({ "960px": "75vw", "640px": "100vw" });
var _c3 = () => [1, 2, 3, 4, 5];
var _c4 = () => [5, 10, 20, 50];
var _c5 = () => ["numeroCommande", "service", "categorieLibele", "status"];
function StockCmdComponent_small_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 35);
    \u0275\u0275text(1, " Le service est obligatoire ");
    \u0275\u0275elementEnd();
  }
}
function StockCmdComponent_div_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 36)(1, "div", 5)(2, "label", 37);
    \u0275\u0275text(3, "D\xE9l\xE9gation");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "p-dropdown", 38);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("options", ctx_r0.delegations())("showClear", true);
  }
}
function StockCmdComponent_div_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 36)(1, "div", 5)(2, "label", 39);
    \u0275\u0275text(3, "Agence");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "p-dropdown", 40);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("options", ctx_r0.agences())("showClear", true);
  }
}
function StockCmdComponent_div_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 36)(1, "div", 5)(2, "label", 41);
    \u0275\u0275text(3, "Point de vente");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "p-dropdown", 42);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("options", ctx_r0.pointsVente())("showClear", true);
  }
}
function StockCmdComponent_small_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 35);
    \u0275\u0275text(1, " La cat\xE9gorie est obligatoire ");
    \u0275\u0275elementEnd();
  }
}
function StockCmdComponent_small_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 35);
    \u0275\u0275text(1, " La quantit\xE9 est obligatoire et doit \xEAtre sup\xE9rieure \xE0 0 ");
    \u0275\u0275elementEnd();
  }
}
function StockCmdComponent_div_57_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275element(1, "p-skeleton", 44);
    \u0275\u0275elementEnd();
  }
}
function StockCmdComponent_div_57_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0);
    \u0275\u0275template(1, StockCmdComponent_div_57_div_1_Template, 2, 0, "div", 43);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", \u0275\u0275pureFunction0(1, _c3));
  }
}
function StockCmdComponent_p_table_58_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 49);
    \u0275\u0275text(2, " N\xB0 Commande ");
    \u0275\u0275element(3, "p-sortIcon", 50);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "th", 51);
    \u0275\u0275text(5, " Date ");
    \u0275\u0275element(6, "p-sortIcon", 52);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 53);
    \u0275\u0275text(8, " Service ");
    \u0275\u0275element(9, "p-sortIcon", 54);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Cat\xE9gorie");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Organisation");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 55);
    \u0275\u0275text(15, " Statut ");
    \u0275\u0275element(16, "p-sortIcon", 56);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "th", 57);
    \u0275\u0275text(18, "Actions");
    \u0275\u0275elementEnd()();
  }
}
function StockCmdComponent_p_table_58_ng_template_2_div_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275element(1, "i", 68);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const stock_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", stock_r3.delegationLibele, " ");
  }
}
function StockCmdComponent_p_table_58_ng_template_2_div_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 69);
    \u0275\u0275element(1, "i", 70);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const stock_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", stock_r3.agenceLibele, " ");
  }
}
function StockCmdComponent_p_table_58_ng_template_2_div_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 71);
    \u0275\u0275element(1, "i", 72);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const stock_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", stock_r3.pointventeLibele, " ");
  }
}
function StockCmdComponent_p_table_58_ng_template_2_button_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 73);
    \u0275\u0275listener("click", function StockCmdComponent_p_table_58_ng_template_2_button_22_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const stock_r3 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.editStock(stock_r3));
    });
    \u0275\u0275elementEnd();
  }
}
function StockCmdComponent_p_table_58_ng_template_2_button_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 74);
    \u0275\u0275listener("click", function StockCmdComponent_p_table_58_ng_template_2_button_23_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const stock_r3 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.deleteStock(stock_r3));
    });
    \u0275\u0275elementEnd();
  }
}
function StockCmdComponent_p_table_58_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "span", 58);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td")(10, "span", 59);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "td")(13, "div", 60);
    \u0275\u0275template(14, StockCmdComponent_p_table_58_ng_template_2_div_14_Template, 3, 1, "div", 33)(15, StockCmdComponent_p_table_58_ng_template_2_div_15_Template, 3, 1, "div", 61)(16, StockCmdComponent_p_table_58_ng_template_2_div_16_Template, 3, 1, "div", 62);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "td");
    \u0275\u0275element(18, "p-tag", 63);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "td")(20, "div", 64)(21, "button", 65);
    \u0275\u0275listener("click", function StockCmdComponent_p_table_58_ng_template_2_Template_button_click_21_listener() {
      const stock_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.viewStock(stock_r3));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(22, StockCmdComponent_p_table_58_ng_template_2_button_22_Template, 1, 0, "button", 66)(23, StockCmdComponent_p_table_58_ng_template_2_button_23_Template, 1, 0, "button", 67);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const stock_r3 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(stock_r3.numeroCommande);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(6, 11, stock_r3.dateCreation, "dd/MM/yyyy HH:mm"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(stock_r3.service);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", stock_r3.categorieLibele || "Non d\xE9finie", " ");
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", stock_r3.delegationLibele);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", stock_r3.agenceLibele);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", stock_r3.pointventeLibele);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r0.getStatusLabel(stock_r3.status))("severity", ctx_r0.getStatusSeverity(stock_r3.status));
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", stock_r3.status === "ENCOURS");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", stock_r3.status === "ENCOURS");
  }
}
function StockCmdComponent_p_table_58_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 75);
    \u0275\u0275element(2, "i", 76);
    \u0275\u0275elementStart(3, "p", 77);
    \u0275\u0275text(4, "Aucun bon de commande trouv\xE9");
    \u0275\u0275elementEnd()()();
  }
}
function StockCmdComponent_p_table_58_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-table", 45);
    \u0275\u0275template(1, StockCmdComponent_p_table_58_ng_template_1_Template, 19, 0, "ng-template", 46)(2, StockCmdComponent_p_table_58_ng_template_2_Template, 24, 14, "ng-template", 47)(3, StockCmdComponent_p_table_58_ng_template_3_Template, 5, 0, "ng-template", 48);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("value", ctx_r0.filteredStocks())("paginator", true)("rows", ctx_r0.pageSize())("totalRecords", ctx_r0.totalRecords())("lazy", false)("rowsPerPageOptions", \u0275\u0275pureFunction0(8, _c4))("showCurrentPageReport", true)("globalFilterFields", \u0275\u0275pureFunction0(9, _c5));
  }
}
function StockCmdComponent_div_60_div_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "p", 78);
    \u0275\u0275text(2, "Date de traitement");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 58);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "date");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(5, 1, ctx_r0.selectedStock().dateTraitement, "dd/MM/yyyy HH:mm"));
  }
}
function StockCmdComponent_div_60_div_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "p", 78);
    \u0275\u0275text(2, "Observations");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 58);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.selectedStock().observations);
  }
}
function StockCmdComponent_div_60_div_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "p", 78);
    \u0275\u0275text(2, "Motif");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 81);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.selectedStock().motif);
  }
}
function StockCmdComponent_div_60_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "div", 0)(2, "div", 4)(3, "p", 78);
    \u0275\u0275text(4, "Num\xE9ro de commande");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 58);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 4)(8, "p", 78);
    \u0275\u0275text(9, "Statut");
    \u0275\u0275elementEnd();
    \u0275\u0275element(10, "p-tag", 63);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 4)(12, "p", 78);
    \u0275\u0275text(13, "Service demandeur");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "p", 58);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 4)(17, "p", 78);
    \u0275\u0275text(18, "Cat\xE9gorie");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "p", 58);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div", 4)(22, "p", 78);
    \u0275\u0275text(23, "Date de cr\xE9ation");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "p", 58);
    \u0275\u0275text(25);
    \u0275\u0275pipe(26, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(27, StockCmdComponent_div_60_div_27_Template, 6, 4, "div", 79);
    \u0275\u0275elementStart(28, "div", 1)(29, "p", 78);
    \u0275\u0275text(30, "Description");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "p", 58);
    \u0275\u0275text(32);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(33, StockCmdComponent_div_60_div_33_Template, 5, 1, "div", 80)(34, StockCmdComponent_div_60_div_34_Template, 5, 1, "div", 80);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r0.selectedStock().numeroCommande);
    \u0275\u0275advance(4);
    \u0275\u0275property("value", ctx_r0.getStatusLabel(ctx_r0.selectedStock().status))("severity", ctx_r0.getStatusSeverity(ctx_r0.selectedStock().status));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.selectedStock().service);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.selectedStock().categorieLibele || "Non d\xE9finie");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(26, 10, ctx_r0.selectedStock().dateCreation, "dd/MM/yyyy HH:mm"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r0.selectedStock().dateTraitement);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.selectedStock().detailBonCommande);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.selectedStock().observations);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.selectedStock().motif);
  }
}
function StockCmdComponent_ng_template_61_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 82);
    \u0275\u0275listener("click", function StockCmdComponent_ng_template_61_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.displayDialog.set(false));
    });
    \u0275\u0275elementEnd();
  }
}
var StockCmdComponent = class _StockCmdComponent {
  fb = inject(FormBuilder);
  userService = inject(UserService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  // Signals pour l'état
  state = signal({
    loading: false,
    submitting: false,
    message: void 0,
    error: void 0
  });
  // Données
  stocks = signal([]);
  listCategorieStock = signal([]);
  delegations = signal([]);
  agences = signal([]);
  pointsVente = signal([]);
  currentUser = signal(null);
  // Champs dynamiques basés sur la catégorie
  dynamicFields = signal([]);
  // Dialog
  displayDialog = signal(false);
  selectedStock = signal(null);
  // Pagination
  currentPage = signal(0);
  pageSize = signal(10);
  totalRecords = signal(0);
  // Recherche
  searchValue = signal("");
  // Formulaire
  stockForm;
  dynamicForm;
  // Computed values
  filteredStocks = computed(() => {
    const search = this.searchValue().toLowerCase();
    const allStocks = this.stocks();
    if (!search)
      return allStocks;
    return allStocks.filter((stock) => stock.numeroCommande?.toLowerCase().includes(search) || stock.service?.toLowerCase().includes(search) || stock.detailBonCommande?.toLowerCase().includes(search) || stock.categorieLibele?.toLowerCase().includes(search));
  });
  ngOnInit() {
    this.initializeForm();
    this.loadInitialData();
    this.getCurrentUser();
  }
  // Ajoutez cette propriété
  services = [
    { label: "Exploitation", value: "DE" },
    { label: "SIEGE", value: "SIEGE" }
  ];
  initializeForm() {
    this.stockForm = this.fb.group({
      service: ["", [Validators.required]],
      detailBonCommande: [""],
      delegationId: [null],
      agenceId: [{ value: null, disabled: true }],
      pointventeId: [{ value: null, disabled: true }],
      categorieId: [null, Validators.required],
      qte: [1, [Validators.required, Validators.min(1)]],
      observations: [""]
    });
    this.dynamicForm = this.fb.group({});
    this.stockForm.get("service")?.valueChanges.subscribe((service) => {
      if (service === "SIEGE") {
        this.stockForm.get("delegationId")?.reset();
        this.stockForm.get("agenceId")?.reset();
        this.stockForm.get("pointventeId")?.reset();
      } else if (service === "DE") {
        this.stockForm.get("delegationId")?.reset();
        this.stockForm.get("agenceId")?.reset();
        this.stockForm.get("pointventeId")?.reset();
      }
    });
    this.stockForm.get("delegationId")?.valueChanges.subscribe((delegationId) => {
      if (delegationId) {
        this.loadAgences(delegationId);
        this.stockForm.get("agenceId")?.enable();
        this.stockForm.get("agenceId")?.reset();
        this.stockForm.get("pointventeId")?.reset();
        this.stockForm.get("pointventeId")?.disable();
      }
    });
    this.stockForm.get("agenceId")?.valueChanges.subscribe((agenceId) => {
      if (agenceId) {
        this.loadPointsVente(agenceId);
        this.stockForm.get("pointventeId")?.enable();
        this.stockForm.get("pointventeId")?.reset();
      }
    });
  }
  // Méthode utilitaire pour extraire l'ID utilisateur
  getUserId(user) {
    if (!user)
      return null;
    const possibleIds = [user.user_id, user.userId, user.id, user.userUuid, user.uuid, user.USER_ID, user.ID];
    for (const id of possibleIds) {
      if (id !== void 0 && id !== null && id !== "") {
        return id;
      }
    }
    console.error("Aucun ID trouv\xE9 dans l'objet utilisateur:", user);
    return null;
  }
  getCurrentUser() {
    this.userService.getInstanceUser$().subscribe({
      next: (response) => {
        console.log("User response:", response);
        if (response.data.user) {
          this.currentUser.set(response.data.user);
          console.log("Current user set:", this.currentUser());
          this.loadUserStocks();
        }
      },
      error: (error) => {
        console.error("Erreur lors de la r\xE9cup\xE9ration du profil:", error);
        this.showError("Impossible de r\xE9cup\xE9rer les informations utilisateur");
      }
    });
  }
  loadInitialData() {
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: true }));
    this.userService.getCategoriesStock$().subscribe({
      next: (response) => {
        console.log("Categories response:", response);
        const categories = response.data.listCategorieStock || response.data;
        if (categories && Array.isArray(categories)) {
          this.listCategorieStock.set(categories);
          console.log("Categories loaded:", this.listCategorieStock());
        } else if (categories && !Array.isArray(categories)) {
          console.log("Categories structure:", categories);
          this.showError("Format de cat\xE9gories non reconnu");
        } else {
          console.warn("Aucune cat\xE9gorie trouv\xE9e dans la r\xE9ponse");
          this.listCategorieStock.set([]);
        }
      },
      error: (error) => {
        console.error("Erreur cat\xE9gories:", error);
        this.showError("Erreur lors du chargement des cat\xE9gories");
        this.listCategorieStock.set([]);
      }
    });
    this.userService.getAllDelegation$().subscribe({
      next: (response) => {
        console.log("Delegations response:", response);
        const delegations = response.data.delegations || response.data;
        if (delegations && Array.isArray(delegations)) {
          this.delegations.set(delegations);
          console.log("Delegations loaded:", this.delegations());
        } else {
          console.warn("Aucune d\xE9l\xE9gation trouv\xE9e dans la r\xE9ponse");
          this.delegations.set([]);
        }
      },
      error: (error) => {
        console.error("Erreur d\xE9l\xE9gations:", error);
        this.showError("Erreur lors du chargement des d\xE9l\xE9gations");
        this.delegations.set([]);
      },
      complete: () => {
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: false }));
      }
    });
  }
  loadAgences(delegationId) {
    this.userService.getAllAgenceByDelegationId$(delegationId).subscribe({
      next: (response) => {
        if (response?.data?.agences) {
          this.agences.set(response.data.agences);
          console.log(`\u2705 ${response.data.agences.length} agences loaded for delegation ${delegationId}`);
        } else {
          console.warn("Aucune agence trouv\xE9e");
          this.agences.set([]);
        }
      },
      error: (error) => {
        this.showError("Erreur lors du chargement des agences");
        this.agences.set([]);
      }
    });
  }
  loadPointsVente(agenceId) {
    this.userService.getAllPointventesByAgenceId$(agenceId).subscribe({
      next: (response) => {
        if (response?.data?.pointVentes) {
          this.pointsVente.set(response.data.pointVentes);
          console.log(`\u2705 ${response.data.pointVentes.length} points de vente loaded for agence ${agenceId}`);
        } else {
          console.warn("Aucun point de vente trouv\xE9");
          this.pointsVente.set([]);
        }
      },
      error: (error) => {
        this.showError("Erreur lors du chargement des points de vente");
        this.pointsVente.set([]);
      }
    });
  }
  loadUserStocks() {
    const user = this.currentUser();
    console.log("Loading stocks for user:", user);
    if (!user) {
      console.warn("Aucun utilisateur trouv\xE9, impossible de charger les stocks");
      return;
    }
    const userId = this.getUserId(user);
    if (!userId) {
      this.showError("Impossible de r\xE9cup\xE9rer l'ID utilisateur");
      return;
    }
    console.log("Using userId:", userId);
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: true }));
    this.userService.getStockByUser$(Number(userId)).subscribe({
      next: (response) => {
        console.log("Stocks response:", response);
        if (response.data.stocks) {
          this.stocks.set(response.data.stocks);
          this.totalRecords.set(response.data.stocks.length);
          this.showInfo(`${response.data.stocks.length} bon(s) de commande charg\xE9(s)`);
        } else {
          this.stocks.set([]);
          this.totalRecords.set(0);
        }
      },
      error: (error) => {
        console.error("Erreur lors du chargement des stocks:", error);
        this.showError("Erreur lors du chargement des stocks");
        this.stocks.set([]);
        this.totalRecords.set(0);
      },
      complete: () => {
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: false }));
      }
    });
  }
  onSubmit() {
    if (this.stockForm.invalid) {
      this.markFormGroupTouched(this.stockForm);
      this.showError("Veuillez remplir tous les champs obligatoires");
      return;
    }
    if (this.dynamicForm.invalid) {
      this.markFormGroupTouched(this.dynamicForm);
      this.showError("Veuillez remplir tous les champs dynamiques obligatoires");
      return;
    }
    const user = this.currentUser();
    if (!user) {
      this.showError("Utilisateur non connect\xE9");
      return;
    }
    const userId = this.getUserId(user);
    if (!userId) {
      this.showError("Impossible de r\xE9cup\xE9rer l'ID utilisateur");
      return;
    }
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { submitting: true }));
    const formValue = this.stockForm.value;
    const dynamicValues = this.dynamicForm.value;
    const detailsComplets = __spreadValues({
      detailStandard: formValue.detailBonCommande
    }, dynamicValues);
    const stockDto = {
      idUser: Number(userId),
      service: formValue.service,
      detailBonCommande: JSON.stringify(detailsComplets),
      delegationId: formValue.delegationId,
      agenceId: formValue.agenceId,
      pointventeId: formValue.pointventeId,
      categorieId: formValue.categorieId,
      qte: formValue.qte,
      // Add this line
      observations: formValue.observations
    };
    console.log("Submitting stock DTO:", stockDto);
    this.userService.createStock$(stockDto).pipe(finalize(() => this.state.update((s) => __spreadProps(__spreadValues({}, s), { submitting: false })))).subscribe({
      next: (response) => {
        console.log("Create stock response:", response);
        if (response.data.stock) {
          this.stocks.update((stocks) => [response.data.stock, ...stocks]);
          this.totalRecords.update((total) => total + 1);
          this.resetForm();
          this.showSuccess("Bon de commande cr\xE9\xE9 avec succ\xE8s");
        }
      },
      error: (error) => {
        console.error("Erreur cr\xE9ation stock:", error);
        this.showError(error || "Erreur lors de la cr\xE9ation du bon de commande");
      }
    });
  }
  resetForm() {
    this.stockForm.reset();
    this.dynamicForm.reset();
    this.dynamicFields.set([]);
    this.stockForm.get("agenceId")?.disable();
    this.stockForm.get("pointventeId")?.disable();
  }
  viewStock(stock) {
    this.selectedStock.set(stock);
    this.displayDialog.set(true);
  }
  editStock(stock) {
    console.log("\xC9diter le stock:", stock);
  }
  deleteStock(stock) {
    this.confirmationService.confirm({
      message: `\xCAtes-vous s\xFBr de vouloir supprimer le bon de commande ${stock.numeroCommande}?`,
      header: "Confirmation de suppression",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Oui",
      rejectLabel: "Non",
      accept: () => {
        this.showSuccess("Bon de commande supprim\xE9 avec succ\xE8s");
      }
    });
  }
  approveStock(stock) {
    const user = this.currentUser();
    if (!user) {
      this.showError("Utilisateur non connect\xE9");
      return;
    }
    const userId = this.getUserId(user);
    if (!userId) {
      this.showError("Impossible de r\xE9cup\xE9rer l'ID utilisateur");
      return;
    }
    this.confirmationService.confirm({
      message: `Approuver le bon de commande ${stock.numeroCommande}?`,
      header: "Confirmation d'approbation",
      icon: "pi pi-check",
      acceptLabel: "Approuver",
      rejectLabel: "Annuler",
      accept: () => {
        this.userService.approveStock$(stock.idCmd, Number(userId), "Approuv\xE9").subscribe({
          next: (response) => {
            this.showSuccess("Bon de commande approuv\xE9");
            this.loadUserStocks();
          },
          error: (error) => {
            this.showError("Erreur lors de l'approbation");
          }
        });
      }
    });
  }
  rejectStock(stock) {
    const user = this.currentUser();
    if (!user) {
      this.showError("Utilisateur non connect\xE9");
      return;
    }
    const userId = this.getUserId(user);
    if (!userId) {
      this.showError("Impossible de r\xE9cup\xE9rer l'ID utilisateur");
      return;
    }
    const motif = prompt("Motif du rejet:");
    if (motif) {
      this.userService.rejectStock$(stock.idCmd, Number(userId), motif).subscribe({
        next: (response) => {
          this.showSuccess("Bon de commande rejet\xE9");
          this.loadUserStocks();
        },
        error: (error) => {
          this.showError("Erreur lors du rejet");
        }
      });
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
        return "info";
    }
  }
  getStatusLabel(status) {
    switch (status) {
      case "ACCEPT":
        return "Accept\xE9";
      case "REJET":
        return "Rejet\xE9";
      case "ENCOURS":
        return "En cours";
      default:
        return status;
    }
  }
  onPageChange(event) {
    this.currentPage.set(event.page);
    this.pageSize.set(event.rows);
    this.loadUserStocks();
  }
  onSearch(event) {
    this.searchValue.set(event.target.value);
  }
  exportToExcel() {
    console.log("Export Excel");
  }
  markFormGroupTouched(formGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
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
  showInfo(message) {
    this.messageService.add({
      severity: "info",
      summary: "Information",
      detail: message,
      life: 3e3
    });
  }
  static \u0275fac = function StockCmdComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _StockCmdComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _StockCmdComponent, selectors: [["app-stock-cmd"]], features: [\u0275\u0275ProvidersFeature([MessageService, ConfirmationService])], decls: 62, vars: 26, consts: [[1, "grid"], [1, "col-12"], ["header", "Nouveau Bon de Commande"], [3, "ngSubmit", "formGroup"], [1, "col-12", "md:col-6"], [1, "field"], ["for", "service", 1, "block", "mb-2"], [1, "text-red-500"], ["id", "service", "formControlName", "service", "optionLabel", "label", "optionValue", "value", "placeholder", "S\xE9lectionner un service", "styleClass", "w-full", 3, "options", "showClear"], ["class", "p-error", 4, "ngIf"], ["class", "col-12 md:col-4", 4, "ngIf"], ["for", "categorie", 1, "block", "mb-2"], ["id", "categorie", "formControlName", "categorieId", "optionLabel", "libele", "optionValue", "id", "placeholder", "S\xE9lectionner une cat\xE9gorie", "styleClass", "w-full", 3, "options", "showClear"], ["for", "detail", 1, "block", "mb-2"], ["pTextarea", "", "id", "detail", "formControlName", "detailBonCommande", "rows", "3", "placeholder", "Description d\xE9taill\xE9e de la demande...", 1, "w-full"], ["for", "qte", 1, "block", "mb-2"], ["pInputText", "", "id", "qte", "type", "number", "formControlName", "qte", "placeholder", "Entrer la quantit\xE9", "min", "1", 1, "w-full"], ["for", "observations", 1, "block", "mb-2"], ["pTextarea", "", "id", "observations", "formControlName", "observations", "rows", "2", "placeholder", "Observations ou remarques additionnelles...", 1, "w-full"], [1, "flex", "justify-content-end", "gap-2"], ["pButton", "", "type", "button", "label", "R\xE9initialiser", "icon", "pi pi-refresh", 1, "p-button-secondary", 3, "click"], ["pButton", "", "type", "submit", "label", "Cr\xE9er le bon de commande", "icon", "pi pi-save", 3, "loading", "disabled"], ["header", "Mes Bons de Commande"], [1, "flex", "justify-content-between", "align-items-center", "mb-3"], [1, "flex", "gap-2"], [1, "p-input-icon-left"], [1, "pi", "pi-search"], ["pInputText", "", "type", "text", "placeholder", "Rechercher...", 1, "w-20rem", 3, "input"], ["pButton", "", "icon", "pi pi-refresh", "pTooltip", "Actualiser", "tooltipPosition", "top", 1, "p-button-rounded", "p-button-text", 3, "click"], ["pButton", "", "icon", "pi pi-file-excel", "pTooltip", "Exporter Excel", "tooltipPosition", "top", 1, "p-button-rounded", "p-button-success", "p-button-text", 3, "click"], ["class", "grid", 4, "ngIf"], ["currentPageReportTemplate", "Affichage de {first} \xE0 {last} sur {totalRecords} entr\xE9es", "responsiveLayout", "scroll", "styleClass", "p-datatable-striped", 3, "value", "paginator", "rows", "totalRecords", "lazy", "rowsPerPageOptions", "showCurrentPageReport", "globalFilterFields", 4, "ngIf"], ["header", "D\xE9tails du Bon de Commande", 3, "visibleChange", "visible", "modal", "breakpoints"], [4, "ngIf"], ["pTemplate", "footer"], [1, "p-error"], [1, "col-12", "md:col-4"], ["for", "delegation", 1, "block", "mb-2"], ["id", "delegation", "formControlName", "delegationId", "optionLabel", "libele", "optionValue", "id", "placeholder", "S\xE9lectionner une d\xE9l\xE9gation", "styleClass", "w-full", 3, "options", "showClear"], ["for", "agence", 1, "block", "mb-2"], ["id", "agence", "formControlName", "agenceId", "optionLabel", "libele", "optionValue", "id", "placeholder", "S\xE9lectionner une agence", "styleClass", "w-full", 3, "options", "showClear"], ["for", "pointvente", 1, "block", "mb-2"], ["id", "pointvente", "formControlName", "pointventeId", "optionLabel", "libele", "optionValue", "id", "placeholder", "S\xE9lectionner un point de vente", "styleClass", "w-full", 3, "options", "showClear"], ["class", "col-12", 4, "ngFor", "ngForOf"], ["height", "3rem", "styleClass", "mb-2"], ["currentPageReportTemplate", "Affichage de {first} \xE0 {last} sur {totalRecords} entr\xE9es", "responsiveLayout", "scroll", "styleClass", "p-datatable-striped", 3, "value", "paginator", "rows", "totalRecords", "lazy", "rowsPerPageOptions", "showCurrentPageReport", "globalFilterFields"], ["pTemplate", "header"], ["pTemplate", "body"], ["pTemplate", "emptymessage"], ["pSortableColumn", "numeroCommande"], ["field", "numeroCommande"], ["pSortableColumn", "dateCreation"], ["field", "dateCreation"], ["pSortableColumn", "service"], ["field", "service"], ["pSortableColumn", "status"], ["field", "status"], [2, "width", "10rem"], [1, "font-bold"], [1, "badge", "badge-info"], [1, "text-sm"], ["class", "text-500", 4, "ngIf"], ["class", "text-400", 4, "ngIf"], [3, "value", "severity"], [1, "flex", "gap-1"], ["pButton", "", "icon", "pi pi-eye", "pTooltip", "Voir d\xE9tails", "tooltipPosition", "top", 1, "p-button-rounded", "p-button-text", "p-button-sm", 3, "click"], ["pButton", "", "icon", "pi pi-pencil", "class", "p-button-rounded p-button-text p-button-warning p-button-sm", "pTooltip", "Modifier", "tooltipPosition", "top", 3, "click", 4, "ngIf"], ["pButton", "", "icon", "pi pi-trash", "class", "p-button-rounded p-button-text p-button-danger p-button-sm", "pTooltip", "Supprimer", "tooltipPosition", "top", 3, "click", 4, "ngIf"], [1, "pi", "pi-building", "mr-1"], [1, "text-500"], [1, "pi", "pi-home", "mr-1"], [1, "text-400"], [1, "pi", "pi-map-marker", "mr-1"], ["pButton", "", "icon", "pi pi-pencil", "pTooltip", "Modifier", "tooltipPosition", "top", 1, "p-button-rounded", "p-button-text", "p-button-warning", "p-button-sm", 3, "click"], ["pButton", "", "icon", "pi pi-trash", "pTooltip", "Supprimer", "tooltipPosition", "top", 1, "p-button-rounded", "p-button-text", "p-button-danger", "p-button-sm", 3, "click"], ["colspan", "7", 1, "text-center", "p-4"], [1, "pi", "pi-inbox", "text-4xl", "text-300"], [1, "mt-3", "text-600"], [1, "text-500", "mb-1"], ["class", "col-12 md:col-6", 4, "ngIf"], ["class", "col-12", 4, "ngIf"], [1, "font-bold", "text-red-500"], ["pButton", "", "label", "Fermer", "icon", "pi pi-times", 1, "p-button-text", 3, "click"]], template: function StockCmdComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
      \u0275\u0275element(2, "p-toast")(3, "p-confirmDialog");
      \u0275\u0275elementStart(4, "p-card", 2)(5, "form", 3);
      \u0275\u0275listener("ngSubmit", function StockCmdComponent_Template_form_ngSubmit_5_listener() {
        return ctx.onSubmit();
      });
      \u0275\u0275elementStart(6, "div", 0)(7, "div", 4)(8, "div", 5)(9, "label", 6);
      \u0275\u0275text(10, " Service ");
      \u0275\u0275elementStart(11, "span", 7);
      \u0275\u0275text(12, "*");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(13, "p-dropdown", 8);
      \u0275\u0275template(14, StockCmdComponent_small_14_Template, 2, 0, "small", 9);
      \u0275\u0275elementEnd()();
      \u0275\u0275template(15, StockCmdComponent_div_15_Template, 5, 2, "div", 10)(16, StockCmdComponent_div_16_Template, 5, 2, "div", 10)(17, StockCmdComponent_div_17_Template, 5, 2, "div", 10);
      \u0275\u0275elementStart(18, "div", 4)(19, "div", 5)(20, "label", 11);
      \u0275\u0275text(21, " Cat\xE9gorie ");
      \u0275\u0275elementStart(22, "span", 7);
      \u0275\u0275text(23, "*");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(24, "p-dropdown", 12);
      \u0275\u0275template(25, StockCmdComponent_small_25_Template, 2, 0, "small", 9);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(26, "div", 1)(27, "div", 5)(28, "label", 13);
      \u0275\u0275text(29, "Description g\xE9n\xE9rale");
      \u0275\u0275elementEnd();
      \u0275\u0275element(30, "textarea", 14);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(31, "div", 4)(32, "div", 5)(33, "label", 15);
      \u0275\u0275text(34, " Quantit\xE9 ");
      \u0275\u0275elementStart(35, "span", 7);
      \u0275\u0275text(36, "*");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(37, "input", 16);
      \u0275\u0275template(38, StockCmdComponent_small_38_Template, 2, 0, "small", 9);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(39, "div", 1)(40, "div", 5)(41, "label", 17);
      \u0275\u0275text(42, "Observations");
      \u0275\u0275elementEnd();
      \u0275\u0275element(43, "textarea", 18);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(44, "div", 1)(45, "div", 19)(46, "button", 20);
      \u0275\u0275listener("click", function StockCmdComponent_Template_button_click_46_listener() {
        return ctx.resetForm();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275element(47, "button", 21);
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(48, "p-card", 22)(49, "div", 23)(50, "div", 24)(51, "span", 25);
      \u0275\u0275element(52, "i", 26);
      \u0275\u0275elementStart(53, "input", 27);
      \u0275\u0275listener("input", function StockCmdComponent_Template_input_input_53_listener($event) {
        return ctx.onSearch($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(54, "div", 24)(55, "button", 28);
      \u0275\u0275listener("click", function StockCmdComponent_Template_button_click_55_listener() {
        return ctx.loadUserStocks();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(56, "button", 29);
      \u0275\u0275listener("click", function StockCmdComponent_Template_button_click_56_listener() {
        return ctx.exportToExcel();
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(57, StockCmdComponent_div_57_Template, 2, 2, "div", 30)(58, StockCmdComponent_p_table_58_Template, 4, 10, "p-table", 31);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(59, "p-dialog", 32);
      \u0275\u0275twoWayListener("visibleChange", function StockCmdComponent_Template_p_dialog_visibleChange_59_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.displayDialog, $event) || (ctx.displayDialog = $event);
        return $event;
      });
      \u0275\u0275template(60, StockCmdComponent_div_60_Template, 35, 13, "div", 33)(61, StockCmdComponent_ng_template_61_Template, 1, 0, "ng-template", 34);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      let tmp_4_0;
      let tmp_5_0;
      let tmp_6_0;
      let tmp_7_0;
      let tmp_10_0;
      let tmp_11_0;
      \u0275\u0275advance(4);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(23, _c0));
      \u0275\u0275advance();
      \u0275\u0275property("formGroup", ctx.stockForm);
      \u0275\u0275advance(8);
      \u0275\u0275property("options", ctx.services)("showClear", true);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ((tmp_4_0 = ctx.stockForm.get("service")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = ctx.stockForm.get("service")) == null ? null : tmp_4_0.touched));
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ((tmp_5_0 = ctx.stockForm.get("service")) == null ? null : tmp_5_0.value) === "DE");
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ((tmp_6_0 = ctx.stockForm.get("service")) == null ? null : tmp_6_0.value) === "DE");
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ((tmp_7_0 = ctx.stockForm.get("service")) == null ? null : tmp_7_0.value) === "DE");
      \u0275\u0275advance(7);
      \u0275\u0275property("options", ctx.listCategorieStock())("showClear", true);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ((tmp_10_0 = ctx.stockForm.get("categorieId")) == null ? null : tmp_10_0.invalid) && ((tmp_10_0 = ctx.stockForm.get("categorieId")) == null ? null : tmp_10_0.touched));
      \u0275\u0275advance(13);
      \u0275\u0275property("ngIf", ((tmp_11_0 = ctx.stockForm.get("qte")) == null ? null : tmp_11_0.invalid) && ((tmp_11_0 = ctx.stockForm.get("qte")) == null ? null : tmp_11_0.touched));
      \u0275\u0275advance(9);
      \u0275\u0275property("loading", ctx.state().submitting)("disabled", ctx.stockForm.invalid);
      \u0275\u0275advance(10);
      \u0275\u0275property("ngIf", ctx.state().loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.state().loading);
      \u0275\u0275advance();
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(24, _c1));
      \u0275\u0275twoWayProperty("visible", ctx.displayDialog);
      \u0275\u0275property("modal", true)("breakpoints", \u0275\u0275pureFunction0(25, _c2));
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.selectedStock());
    }
  }, dependencies: [
    CommonModule,
    NgForOf,
    NgIf,
    DatePipe,
    ButtonModule,
    ButtonDirective,
    PrimeTemplate,
    RippleModule,
    MessageModule,
    TableModule,
    Table,
    SortableColumn,
    SortIcon,
    IconFieldModule,
    InputIconModule,
    TagModule,
    Tag,
    CardModule,
    Card,
    InputTextModule,
    InputText,
    TextareaModule,
    Textarea,
    DropdownModule,
    Dropdown,
    FormsModule,
    \u0275NgNoValidate,
    DefaultValueAccessor,
    NumberValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    MinValidator,
    ReactiveFormsModule,
    FormGroupDirective,
    FormControlName,
    DialogModule,
    Dialog,
    ToastModule,
    Toast,
    ConfirmDialogModule,
    ConfirmDialog,
    DividerModule,
    ProgressSpinnerModule,
    SkeletonModule,
    Skeleton
  ], styles: ["\n\n[_nghost-%COMP%]     .p-card {\n  border-radius: 12px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);\n}\n[_nghost-%COMP%]     .p-card .p-card-header {\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  color: white;\n  border-radius: 12px 12px 0 0;\n  padding: 1.25rem;\n  font-weight: 600;\n  font-size: 1.1rem;\n}\n[_nghost-%COMP%]     .p-card .p-card-body {\n  padding: 1.5rem;\n}\n[_nghost-%COMP%]     .field {\n  margin-bottom: 1.5rem;\n}\n[_nghost-%COMP%]     .field label {\n  font-weight: 500;\n  color: #495057;\n  font-size: 0.95rem;\n}\n[_nghost-%COMP%]     .field label .text-red-500 {\n  color: #ef4444;\n  margin-left: 2px;\n}\n[_nghost-%COMP%]     .field .p-inputtext, \n[_nghost-%COMP%]     .field .p-inputtextarea, \n[_nghost-%COMP%]     .field .p-dropdown {\n  border-radius: 8px;\n  transition: all 0.3s ease;\n}\n[_nghost-%COMP%]     .field .p-inputtext:hover:not(:disabled), \n[_nghost-%COMP%]     .field .p-inputtextarea:hover:not(:disabled), \n[_nghost-%COMP%]     .field .p-dropdown:hover:not(:disabled) {\n  border-color: #667eea;\n}\n[_nghost-%COMP%]     .field .p-inputtext:focus, \n[_nghost-%COMP%]     .field .p-inputtextarea:focus, \n[_nghost-%COMP%]     .field .p-dropdown:focus {\n  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);\n  border-color: #667eea;\n}\n[_nghost-%COMP%]     .field .p-inputtext.ng-invalid.ng-touched, \n[_nghost-%COMP%]     .field .p-inputtextarea.ng-invalid.ng-touched, \n[_nghost-%COMP%]     .field .p-dropdown.ng-invalid.ng-touched {\n  border-color: #ef4444;\n}\n[_nghost-%COMP%]     .field .p-error {\n  color: #ef4444;\n  font-size: 0.875rem;\n  margin-top: 0.25rem;\n  display: block;\n}\n[_nghost-%COMP%]     .p-button {\n  border-radius: 8px;\n  font-weight: 500;\n  transition: all 0.3s ease;\n}\n[_nghost-%COMP%]     .p-button.p-button-rounded {\n  border-radius: 50%;\n}\n[_nghost-%COMP%]     .p-button:not(.p-button-text):not(.p-button-outlined) {\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n}\n[_nghost-%COMP%]     .p-button:not(.p-button-text):not(.p-button-outlined):hover {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);\n}\n[_nghost-%COMP%]     .p-datatable .p-datatable-header {\n  background: transparent;\n  border: none;\n  padding: 0 0 1rem 0;\n}\n[_nghost-%COMP%]     .p-datatable .p-datatable-thead > tr > th {\n  background: #f8f9fa;\n  color: #495057;\n  font-weight: 600;\n  border: none;\n  padding: 1rem;\n  font-size: 0.9rem;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n[_nghost-%COMP%]     .p-datatable .p-datatable-thead > tr > th:first-child {\n  border-radius: 8px 0 0 8px;\n}\n[_nghost-%COMP%]     .p-datatable .p-datatable-thead > tr > th:last-child {\n  border-radius: 0 8px 8px 0;\n}\n[_nghost-%COMP%]     .p-datatable .p-datatable-tbody > tr {\n  transition: all 0.3s ease;\n}\n[_nghost-%COMP%]     .p-datatable .p-datatable-tbody > tr > td {\n  padding: 1rem;\n  border: none;\n  border-bottom: 1px solid #e9ecef;\n  vertical-align: middle;\n}\n[_nghost-%COMP%]     .p-datatable .p-datatable-tbody > tr:hover {\n  background: #f8f9fa;\n  transform: scale(1.01);\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);\n}\n[_nghost-%COMP%]     .p-datatable .p-datatable-tbody > tr:last-child > td {\n  border-bottom: none;\n}\n[_nghost-%COMP%]     .p-datatable .p-datatable-emptymessage > td {\n  padding: 3rem;\n  text-align: center;\n  color: #6c757d;\n}\n[_nghost-%COMP%]     .p-tag {\n  border-radius: 12px;\n  padding: 0.25rem 0.75rem;\n  font-weight: 600;\n  font-size: 0.875rem;\n}\n[_nghost-%COMP%]     .p-tag.p-tag-success {\n  background: #10b981;\n  color: white;\n}\n[_nghost-%COMP%]     .p-tag.p-tag-warning {\n  background: #f59e0b;\n  color: white;\n}\n[_nghost-%COMP%]     .p-tag.p-tag-danger {\n  background: #ef4444;\n  color: white;\n}\n[_nghost-%COMP%]     .p-tag.p-tag-info {\n  background: #3b82f6;\n  color: white;\n}\n[_nghost-%COMP%]     .badge {\n  display: inline-block;\n  padding: 0.25rem 0.5rem;\n  border-radius: 6px;\n  font-size: 0.875rem;\n  font-weight: 500;\n}\n[_nghost-%COMP%]     .badge.badge-info {\n  background: #e0e7ff;\n  color: #4338ca;\n}\n[_nghost-%COMP%]     .p-divider {\n  margin: 2rem 0;\n}\n[_nghost-%COMP%]     .p-divider:before {\n  border-color: #e5e7eb;\n}\n[_nghost-%COMP%]     .p-divider .p-divider-content {\n  background: white;\n  color: #6b7280;\n  font-size: 0.95rem;\n}\n[_nghost-%COMP%]     .p-dialog {\n  border-radius: 12px;\n  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);\n}\n[_nghost-%COMP%]     .p-dialog .p-dialog-header {\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  color: white;\n  border-radius: 12px 12px 0 0;\n  padding: 1.5rem;\n}\n[_nghost-%COMP%]     .p-dialog .p-dialog-header .p-dialog-title {\n  font-weight: 600;\n  font-size: 1.25rem;\n}\n[_nghost-%COMP%]     .p-dialog .p-dialog-header .p-dialog-header-icon {\n  color: white;\n}\n[_nghost-%COMP%]     .p-dialog .p-dialog-header .p-dialog-header-icon:hover {\n  background: rgba(255, 255, 255, 0.1);\n}\n[_nghost-%COMP%]     .p-dialog .p-dialog-content {\n  padding: 2rem;\n}\n[_nghost-%COMP%]     .p-dialog .p-dialog-footer {\n  padding: 1rem 1.5rem;\n  background: #f8f9fa;\n  border-radius: 0 0 12px 12px;\n}\n[_nghost-%COMP%]     .p-toast .p-toast-message {\n  border-radius: 8px;\n  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);\n}\n[_nghost-%COMP%]     .p-toast .p-toast-message.p-toast-message-success {\n  background: #10b981;\n  border: none;\n  color: white;\n}\n[_nghost-%COMP%]     .p-toast .p-toast-message.p-toast-message-success .p-toast-icon-close {\n  color: white;\n}\n[_nghost-%COMP%]     .p-toast .p-toast-message.p-toast-message-error {\n  background: #ef4444;\n  border: none;\n  color: white;\n}\n[_nghost-%COMP%]     .p-toast .p-toast-message.p-toast-message-error .p-toast-icon-close {\n  color: white;\n}\n[_nghost-%COMP%]     .p-toast .p-toast-message.p-toast-message-info {\n  background: #3b82f6;\n  border: none;\n  color: white;\n}\n[_nghost-%COMP%]     .p-toast .p-toast-message.p-toast-message-info .p-toast-icon-close {\n  color: white;\n}\n[_nghost-%COMP%]     .p-skeleton {\n  border-radius: 8px;\n}\n[_nghost-%COMP%]     .p-confirm-dialog .p-dialog-header {\n  background: white;\n  color: #495057;\n}\n[_nghost-%COMP%]     .p-confirm-dialog .p-confirm-dialog-icon {\n  color: #f59e0b;\n}\n[_nghost-%COMP%]     .p-dropdown-panel {\n  border-radius: 8px;\n  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);\n}\n[_nghost-%COMP%]     .p-dropdown-panel .p-dropdown-items .p-dropdown-item {\n  transition: all 0.2s ease;\n}\n[_nghost-%COMP%]     .p-dropdown-panel .p-dropdown-items .p-dropdown-item:hover {\n  background: #f3f4f6;\n}\n[_nghost-%COMP%]     .p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight {\n  background: #667eea;\n  color: white;\n}\n@media screen and (max-width: 768px) {\n  [_nghost-%COMP%]     .p-card .p-card-header {\n    padding: 1rem;\n    font-size: 1rem;\n  }\n  [_nghost-%COMP%]     .p-card .p-card-body {\n    padding: 1rem;\n  }\n  [_nghost-%COMP%]     .p-datatable .p-datatable-thead > tr > th {\n    padding: 0.75rem 0.5rem;\n    font-size: 0.8rem;\n  }\n  [_nghost-%COMP%]     .p-datatable .p-datatable-tbody > tr > td {\n    padding: 0.75rem 0.5rem;\n    font-size: 0.9rem;\n  }\n  [_nghost-%COMP%]     .p-button:not(.p-button-rounded) {\n    padding: 0.5rem 1rem;\n    font-size: 0.9rem;\n  }\n}\n@keyframes _ngcontent-%COMP%_slideInRight {\n  from {\n    transform: translateX(100%);\n    opacity: 0;\n  }\n  to {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n.slide-in-right[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_slideInRight 0.3s ease-out;\n}\n.fade-in[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_fadeIn 0.3s ease-out;\n}\n.text-sm[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n}\n.text-xs[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n}\n.font-semibold[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.gap-1[_ngcontent-%COMP%] {\n  gap: 0.25rem;\n}\n.gap-2[_ngcontent-%COMP%] {\n  gap: 0.5rem;\n}\n.gap-3[_ngcontent-%COMP%] {\n  gap: 1rem;\n}\n.organization-info[_ngcontent-%COMP%]   .pi[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  opacity: 0.7;\n}\n.organization-info[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  line-height: 1.4;\n}\n.status-indicator[_ngcontent-%COMP%] {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  display: inline-block;\n  margin-right: 0.5rem;\n}\n.status-indicator.status-encours[_ngcontent-%COMP%] {\n  background: #f59e0b;\n  animation: _ngcontent-%COMP%_pulse 2s infinite;\n}\n.status-indicator.status-accept[_ngcontent-%COMP%] {\n  background: #10b981;\n}\n.status-indicator.status-rejet[_ngcontent-%COMP%] {\n  background: #ef4444;\n}\n@keyframes _ngcontent-%COMP%_pulse {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.5;\n  }\n}\n@media print {\n  [_nghost-%COMP%]     .p-button, \n   [_nghost-%COMP%]     .p-paginator, \n   [_nghost-%COMP%]     .p-input-icon-left, \n   [_nghost-%COMP%]     .p-dialog-header-icon {\n    display: none !important;\n  }\n  [_nghost-%COMP%]     .p-card {\n    box-shadow: none;\n    border: 1px solid #dee2e6;\n  }\n  [_nghost-%COMP%]     .p-datatable {\n    font-size: 12px;\n  }\n  [_nghost-%COMP%]     .p-datatable .p-datatable-thead > tr > th {\n    background: white;\n    color: black;\n    border: 1px solid #dee2e6;\n  }\n  [_nghost-%COMP%]     .p-datatable .p-datatable-tbody > tr > td {\n    border: 1px solid #dee2e6;\n  }\n}\n/*# sourceMappingURL=stock-cmd.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(StockCmdComponent, { className: "StockCmdComponent", filePath: "src/app/pages/dashboard/agent-credit/stock-cmd/stock-cmd.component.ts", lineNumber: 67 });
})();
export {
  StockCmdComponent
};
//# sourceMappingURL=chunk-67F4HXCH.js.map
