import {
  Message,
  MessageModule
} from "./chunk-CSEZIGTY.js";
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
  CurrencyPipe,
  DatePipe,
  Location
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
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵpipeBind4,
  ɵɵproperty,
  ɵɵpropertyInterpolate,
  ɵɵpureFunction0,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-ZKKMBKIA.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/pages/dashboard/analyse-credit/detail-credit/detail-credit.component.ts
var _c0 = () => [10, 25, 50];
var _c1 = () => ({ "min-width": "50rem" });
function DetailCreditComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-progressSpinner");
  }
}
function DetailCreditComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 1);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275propertyInterpolate("text", ctx_r0.error());
  }
}
function DetailCreditComponent_Conditional_3_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "div", 15)(2, "div", 16)(3, "span", 17);
    \u0275\u0275text(4, "Credit #:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275text(7, " \xA0 ");
    \u0275\u0275elementStart(8, "div", 16)(9, "span", 17);
    \u0275\u0275text(10, "Code Agence:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275text(13, " \xA0 ");
    \u0275\u0275elementStart(14, "div", 16)(15, "span", 17);
    \u0275\u0275text(16, "Date:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span");
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275text(20, " \xA0 ");
    \u0275\u0275elementStart(21, "div", 16)(22, "span", 17);
    \u0275\u0275text(23, "Montant Credit:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "span");
    \u0275\u0275text(25);
    \u0275\u0275pipe(26, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275text(27, " \xA0 ");
    \u0275\u0275elementStart(28, "div", 18)(29, "span", 17);
    \u0275\u0275text(30, "Status:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "p-tag", 19);
    \u0275\u0275text(32);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const firstPlanPago_r2 = ctx;
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(firstPlanPago_r2.planPagosPKId.numCredito);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(firstPlanPago_r2.planPagosPKId.codAgencia);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(19, 6, firstPlanPago_r2.fecCuota, "yyyy-MM-dd"));
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind4(26, 9, firstPlanPago_r2.sal_CREDITO, "GNF", "symbol", "1.0-0"));
    \u0275\u0275advance(6);
    \u0275\u0275property("severity", firstPlanPago_r2.indEstado === "A" ? "success" : "warn");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", firstPlanPago_r2.indEstado === "A" ? "Active" : firstPlanPago_r2.indEstado, " ");
  }
}
function DetailCreditComponent_Conditional_3_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20)(1, "div")(2, "span", 21);
    \u0275\u0275text(3, "Payment Plan");
    \u0275\u0275elementEnd()()();
  }
}
function DetailCreditComponent_Conditional_3_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 22);
    \u0275\u0275text(2, " Payment # ");
    \u0275\u0275element(3, "p-sortIcon", 23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "th", 24);
    \u0275\u0275text(5, " Payment Date ");
    \u0275\u0275element(6, "p-sortIcon", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 26);
    \u0275\u0275text(8, " Principal ");
    \u0275\u0275element(9, "p-sortIcon", 27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 28);
    \u0275\u0275text(11, " Interest ");
    \u0275\u0275element(12, "p-sortIcon", 29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th", 30);
    \u0275\u0275text(14, " Commission ");
    \u0275\u0275element(15, "p-sortIcon", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 32);
    \u0275\u0275text(17, " Total Payment ");
    \u0275\u0275element(18, "p-sortIcon", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "th", 34);
    \u0275\u0275text(20, " Balance ");
    \u0275\u0275element(21, "p-sortIcon", 35);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "th", 36);
    \u0275\u0275text(23, " Status ");
    \u0275\u0275element(24, "p-sortIcon", 37);
    \u0275\u0275elementEnd()();
  }
}
function DetailCreditComponent_Conditional_3_ng_template_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "td");
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td");
    \u0275\u0275text(16);
    \u0275\u0275pipe(17, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "td");
    \u0275\u0275text(19);
    \u0275\u0275pipe(20, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "td");
    \u0275\u0275element(22, "p-tag", 38);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const planPago_r3 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(planPago_r3.planPagosPKId.numCuota);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(5, 9, planPago_r3.fecCuota, "yyyy-MM-dd"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind4(8, 12, planPago_r3.mon_PRINCIPAL, "GNF", "symbol", "1.0-0"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind4(11, 17, planPago_r3.mon_INT, "GNF", "symbol", "1.0-0"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind4(14, 22, planPago_r3.mon_COMISION, "GNF", "symbol", "1.0-0"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind4(17, 27, planPago_r3.mon_CUOTA, "GNF", "symbol", "1.0-0"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind4(20, 32, planPago_r3.sal_CREDITO, "GNF", "symbol", "1.0-0"));
    \u0275\u0275advance(3);
    \u0275\u0275property("severity", planPago_r3.indEstado === "A" ? "success" : planPago_r3.indEstado === "P" ? "info" : "warn")("value", planPago_r3.indEstado === "A" ? "Active" : planPago_r3.indEstado === "P" ? "Paid" : planPago_r3.indEstado);
  }
}
function DetailCreditComponent_Conditional_3_ng_template_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 39)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Total Payments: ", ctx_r0.getPlanPagosLength(), "");
  }
}
function DetailCreditComponent_Conditional_3_ng_template_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 40);
    \u0275\u0275text(2, "No payment plan records found.");
    \u0275\u0275elementEnd()();
  }
}
function DetailCreditComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2)(1, "h2");
    \u0275\u0275text(2, "Credit Payment Plan Details");
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, DetailCreditComponent_Conditional_3_Conditional_3_Template, 33, 14, "div", 8);
    \u0275\u0275elementStart(4, "p-table", 9);
    \u0275\u0275template(5, DetailCreditComponent_Conditional_3_ng_template_5_Template, 4, 0, "ng-template", 10)(6, DetailCreditComponent_Conditional_3_ng_template_6_Template, 25, 0, "ng-template", 11)(7, DetailCreditComponent_Conditional_3_ng_template_7_Template, 23, 37, "ng-template", 12)(8, DetailCreditComponent_Conditional_3_ng_template_8_Template, 3, 1, "ng-template", 13)(9, DetailCreditComponent_Conditional_3_ng_template_9_Template, 3, 0, "ng-template", 14);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275conditional((tmp_1_0 = ctx_r0.getFirstPlanPago()) ? 3 : -1, tmp_1_0);
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r0.planpagos())("paginator", true)("rows", 10)("showCurrentPageReport", true)("rowsPerPageOptions", \u0275\u0275pureFunction0(8, _c0))("scrollable", true)("tableStyle", \u0275\u0275pureFunction0(9, _c1));
  }
}
function DetailCreditComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 3);
  }
}
var DetailCreditComponent = class _DetailCreditComponent {
  state = signal({
    planpagos: [],
    loading: false,
    message: void 0,
    error: void 0
  });
  // Derived signals for easier template access
  loading = signal(false);
  planpagos = signal([]);
  // Always initialize as empty array
  error = signal(void 0);
  destroyRef = inject(DestroyRef);
  userService = inject(UserService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  location = inject(Location);
  ngOnInit() {
    this.activatedRoute.paramMap.pipe(switchMap((params) => {
      const numberCredit = params.get("numberCredit");
      if (numberCredit) {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          numberCredit,
          loading: true,
          message: void 0,
          error: void 0
        }));
        this.loading.set(true);
        this.error.set(void 0);
        return this.userService.getAllPlanPagosByCreditos$(numberCredit);
      } else {
        const errorMsg = "Credit number not provided in URL";
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          loading: false,
          message: void 0,
          error: errorMsg
        }));
        this.loading.set(false);
        this.error.set(errorMsg);
        return EMPTY;
      }
    }), takeUntilDestroyed(this.destroyRef)).subscribe(this.loadPlanPagosSubscriber);
  }
  loadPlanPagosSubscriber = {
    next: (response) => {
      console.log("Response from getAllPlanPagosByCreditos$", response);
      const planPagosData = response?.data?.planpagos || [];
      this.state.update((state) => __spreadProps(__spreadValues({}, state), {
        loading: false,
        planpagos: planPagosData,
        error: void 0
      }));
      this.loading.set(false);
      this.planpagos.set(Array.isArray(planPagosData) ? planPagosData : []);
      this.error.set(void 0);
    },
    error: (error) => {
      this.state.update((state) => __spreadProps(__spreadValues({}, state), {
        loading: false,
        message: void 0,
        error
      }));
      this.loading.set(false);
      this.planpagos.set([]);
      this.error.set(error);
    },
    complete: () => {
    }
  };
  // ADDED: Helper method to safely get planpagos length
  getPlanPagosLength() {
    const planpagos = this.planpagos();
    console.log("PlanPagos length:", planpagos.length);
    return Array.isArray(planpagos) ? planpagos.length : 0;
  }
  // ADDED: Helper method to safely get first planpago
  getFirstPlanPago() {
    const planpagos = this.planpagos();
    return Array.isArray(planpagos) && planpagos.length > 0 ? planpagos[0] : null;
  }
  retourListe() {
    this.location.back();
  }
  static \u0275fac = function DetailCreditComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DetailCreditComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DetailCreditComponent, selectors: [["app-detail-credit"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 9, vars: 3, consts: [[1, "credit-details-container"], ["severity", "error", 3, "text"], [1, "card"], ["severity", "info", "text", "No payment plan information available for this credit."], [1, "grid"], [1, "col-12"], [1, "flex", "justify-center", "gap-3", "p-4", "bg-gray-50", "border-round"], ["label", "Voir son historisque de cr\xE9dit", "icon", "pi pi-list", "outlined", "", 3, "onClick"], [1, "p-card", "p-3", "mb-4"], ["currentPageReportTemplate", "Showing {first} to {last} of {totalRecords} entries", "styleClass", "p-datatable-gridlines", 3, "value", "paginator", "rows", "showCurrentPageReport", "rowsPerPageOptions", "scrollable", "tableStyle"], ["pTemplate", "caption"], ["pTemplate", "header"], ["pTemplate", "body"], ["pTemplate", "summary"], ["pTemplate", "emptymessage"], [1, "flex", "align-items-center", "justify-content-between", "flex-wrap"], [1, "flex", "align-items-center", "mr-3", "mb-2"], [1, "font-bold", "mr-2"], [1, "flex", "align-items-center", "mb-2"], [3, "severity"], [1, "flex", "justify-content-between", "flex-wrap"], [1, "text-xl", "font-bold"], ["pSortableColumn", "planPagosPKId.numCuota", 2, "min-width", "8rem"], ["field", "planPagosPKId.numCuota"], ["pSortableColumn", "fecCuota", 2, "min-width", "10rem"], ["field", "fecCuota"], ["pSortableColumn", "sal_PRINCIPAL", 2, "min-width", "10rem"], ["field", "sal_PRINCIPAL"], ["pSortableColumn", "mon_INT", 2, "min-width", "10rem"], ["field", "mon_INT"], ["pSortableColumn", "mon_COMISION", 2, "min-width", "10rem"], ["field", "mon_COMISION"], ["pSortableColumn", "mon_CUOTA", 2, "min-width", "10rem"], ["field", "mon_CUOTA"], ["pSortableColumn", "sal_CREDITO", 2, "min-width", "10rem"], ["field", "sal_CREDITO"], ["pSortableColumn", "indEstado", 2, "min-width", "8rem"], ["field", "indEstado"], [3, "severity", "value"], [1, "flex", "justify-content-end"], ["colspan", "8", 1, "text-center", "p-4"]], template: function DetailCreditComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275template(1, DetailCreditComponent_Conditional_1_Template, 1, 0, "p-progressSpinner")(2, DetailCreditComponent_Conditional_2_Template, 1, 1, "p-message", 1)(3, DetailCreditComponent_Conditional_3_Template, 10, 10, "div", 2)(4, DetailCreditComponent_Conditional_4_Template, 1, 0, "p-message", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div", 4)(6, "div", 5)(7, "div", 6)(8, "p-button", 7);
      \u0275\u0275listener("onClick", function DetailCreditComponent_Template_p_button_onClick_8_listener() {
        return ctx.retourListe();
      });
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading() ? 1 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error() ? 2 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.loading() && !ctx.error() && ctx.getPlanPagosLength() > 0 ? 3 : !ctx.loading() && !ctx.error() ? 4 : -1);
    }
  }, dependencies: [CommonModule, CurrencyPipe, DatePipe, CardModule, PrimeTemplate, ButtonModule, Button, TagModule, Tag, MessageModule, Message, ProgressSpinnerModule, ProgressSpinner, TableModule, Table, SortableColumn, SortIcon], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DetailCreditComponent, { className: "DetailCreditComponent", filePath: "src/app/pages/dashboard/analyse-credit/detail-credit/detail-credit.component.ts", lineNumber: 26 });
})();
export {
  DetailCreditComponent
};
//# sourceMappingURL=chunk-RKHHDVIM.js.map
