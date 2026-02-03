import {
  Table,
  TableModule
} from "./chunk-REDVHUQC.js";
import {
  RouterLink,
  RouterModule
} from "./chunk-BTKK64MU.js";
import {
  ButtonDirective,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import {
  PrimeTemplate
} from "./chunk-NQNBRQ7H.js";
import {
  CommonModule
} from "./chunk-SQQPVFHK.js";
import {
  EventEmitter,
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
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-ZKKMBKIA.js";

// src/app/pages/dashboard/agent-credit/societariat/societariat-by-agence/societariat-by-agence.component.ts
var _c0 = () => ({ "min-width": "100%" });
function SocietariatByAgenceComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.error);
  }
}
function SocietariatByAgenceComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4);
    \u0275\u0275text(1, "Chargement...");
    \u0275\u0275elementEnd();
  }
}
function SocietariatByAgenceComponent_Conditional_9_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 9);
    \u0275\u0275text(2, "Agence");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th", 10);
    \u0275\u0275text(4, "Code");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th", 11);
    \u0275\u0275text(6, "En attente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 11);
    \u0275\u0275text(8, "Rejet\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th", 11);
    \u0275\u0275text(10, "Valid\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th", 11);
    \u0275\u0275text(12, "Total");
    \u0275\u0275elementEnd()();
  }
}
function SocietariatByAgenceComponent_Conditional_9_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 12);
    \u0275\u0275listener("click", function SocietariatByAgenceComponent_Conditional_9_ng_template_2_Template_tr_click_0_listener() {
      const row_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.onSelect(row_r3));
    });
    \u0275\u0275elementStart(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 13);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 14);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 15);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 16);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td", 17);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r3 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r3.agenceLibele || "Non renseign\xE9e");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r3.agenceCode || "-");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r3.enAttente);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r3.rejete);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r3.valide);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r3.total);
  }
}
function SocietariatByAgenceComponent_Conditional_9_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 18);
    \u0275\u0275text(2, "Aucune agence trouv\xE9e");
    \u0275\u0275elementEnd()();
  }
}
function SocietariatByAgenceComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-table", 5);
    \u0275\u0275template(1, SocietariatByAgenceComponent_Conditional_9_ng_template_1_Template, 13, 0, "ng-template", 6)(2, SocietariatByAgenceComponent_Conditional_9_ng_template_2_Template, 13, 6, "ng-template", 7)(3, SocietariatByAgenceComponent_Conditional_9_ng_template_3_Template, 3, 0, "ng-template", 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("value", ctx_r0.stats)("tableStyle", \u0275\u0275pureFunction0(2, _c0));
  }
}
var SocietariatByAgenceComponent = class _SocietariatByAgenceComponent {
  delegationLibele;
  stats = [];
  loading = false;
  error;
  agenceSelected = new EventEmitter();
  onSelect(row) {
    this.agenceSelected.emit(row);
  }
  static \u0275fac = function SocietariatByAgenceComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SocietariatByAgenceComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SocietariatByAgenceComponent, selectors: [["app-societariat-by-agence"]], inputs: { delegationLibele: "delegationLibele", stats: "stats", loading: "loading", error: "error" }, outputs: { agenceSelected: "agenceSelected" }, decls: 10, vars: 3, consts: [[1, "panel"], [1, "panel-header"], [1, "subtitle"], [1, "error"], [1, "loading"], ["styleClass", "stats-table", 3, "value", "tableStyle"], ["pTemplate", "header"], ["pTemplate", "body"], ["pTemplate", "emptymessage"], [2, "width", "30%"], [2, "width", "10%", "text-align", "center"], [2, "width", "15%", "text-align", "center"], [1, "clickable", 3, "click"], [2, "text-align", "center"], [1, "number", "en-attente", 2, "text-align", "center"], [1, "number", "rejete", 2, "text-align", "center"], [1, "number", "valide", 2, "text-align", "center"], [1, "number", "total", 2, "text-align", "center"], ["colspan", "6", 1, "empty"]], template: function SocietariatByAgenceComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div")(3, "h4");
      \u0275\u0275text(4, "Agences");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p", 2);
      \u0275\u0275text(6);
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(7, SocietariatByAgenceComponent_Conditional_7_Template, 2, 1, "div", 3)(8, SocietariatByAgenceComponent_Conditional_8_Template, 2, 0, "div", 4)(9, SocietariatByAgenceComponent_Conditional_9_Template, 4, 3, "p-table", 5);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate1("D\xE9l\xE9gation : ", ctx.delegationLibele || "Non renseign\xE9e", "");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error ? 7 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading ? 8 : 9);
    }
  }, dependencies: [CommonModule, TableModule, Table, PrimeTemplate], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.panel[_ngcontent-%COMP%] {\n  border: 1px solid #e5e7eb;\n  border-radius: 8px;\n  padding: 1rem;\n  background: white;\n  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);\n}\n.panel-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 1rem;\n}\n.panel-header[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin: 0;\n  font-weight: 700;\n}\n.panel-header[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n  margin: 0.25rem 0 0;\n  color: #6b7280;\n}\n.clickable[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n.clickable[_ngcontent-%COMP%]:hover {\n  background: #f9fafb;\n}\n.number[_ngcontent-%COMP%] {\n  text-align: center;\n  font-weight: 700;\n}\n  .stats-table .p-datatable-thead > tr > th {\n  background: #f8fafc;\n  border-bottom: 2px solid #e2e8f0;\n  padding: 0.75rem;\n  font-weight: 600;\n  color: #475569;\n  font-size: 0.875rem;\n}\n  .stats-table .p-datatable-tbody > tr > td {\n  padding: 0.625rem 0.75rem;\n  border-bottom: 1px solid #f1f5f9;\n  font-size: 0.875rem;\n}\n  .stats-table .p-datatable-tbody > tr:hover {\n  background: #f8fafc;\n}\n.en-attente[_ngcontent-%COMP%] {\n  color: #d97706;\n}\n.rejete[_ngcontent-%COMP%] {\n  color: #dc2626;\n}\n.valide[_ngcontent-%COMP%] {\n  color: #15803d;\n}\n.total[_ngcontent-%COMP%] {\n  color: #111827;\n}\n.empty[_ngcontent-%COMP%] {\n  text-align: center;\n  color: #6b7280;\n}\n.error[_ngcontent-%COMP%] {\n  padding: 0.5rem 0.75rem;\n  background: #fef2f2;\n  border: 1px solid #fecdd3;\n  border-radius: 6px;\n  color: #b91c1c;\n  margin-bottom: 0.75rem;\n}\n.loading[_ngcontent-%COMP%] {\n  padding: 1rem;\n  text-align: center;\n  color: #6b7280;\n}\n/*# sourceMappingURL=societariat-by-agence.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SocietariatByAgenceComponent, { className: "SocietariatByAgenceComponent", filePath: "src/app/pages/dashboard/agent-credit/societariat/societariat-by-agence/societariat-by-agence.component.ts", lineNumber: 12 });
})();

// src/app/pages/dashboard/agent-credit/societariat/societariat-by-ps/societariat-by-ps.component.ts
var _c02 = () => ({ "min-width": "100%" });
var _c1 = () => ["/dashboards/agent-credit/societariat/detail-ps"];
var _c2 = (a0, a1) => ({ code: a0, libele: a1 });
function SocietariatByPsComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.error);
  }
}
function SocietariatByPsComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4);
    \u0275\u0275text(1, "Chargement...");
    \u0275\u0275elementEnd();
  }
}
function SocietariatByPsComponent_Conditional_9_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 9);
    \u0275\u0275text(2, "Point de vente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th", 10);
    \u0275\u0275text(4, "Code");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th", 11);
    \u0275\u0275text(6, "En attente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 11);
    \u0275\u0275text(8, "Rejet\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th", 11);
    \u0275\u0275text(10, "Valid\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th", 11);
    \u0275\u0275text(12, "Total");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th", 11);
    \u0275\u0275text(14, "D\xE9tails");
    \u0275\u0275elementEnd()();
  }
}
function SocietariatByPsComponent_Conditional_9_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 12);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 13);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 14);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 15);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td", 16);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 12);
    \u0275\u0275element(14, "button", 17);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r2 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r2.pointVenteLibele || "Non renseign\xE9");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r2.pointVenteCode || "-");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r2.enAttente);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r2.rejete);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r2.valide);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r2.total);
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(8, _c1))("queryParams", \u0275\u0275pureFunction2(9, _c2, row_r2.pointVenteCode, row_r2.pointVenteLibele));
  }
}
function SocietariatByPsComponent_Conditional_9_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 18);
    \u0275\u0275text(2, "Aucun point de vente trouv\xE9");
    \u0275\u0275elementEnd()();
  }
}
function SocietariatByPsComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-table", 5);
    \u0275\u0275template(1, SocietariatByPsComponent_Conditional_9_ng_template_1_Template, 15, 0, "ng-template", 6)(2, SocietariatByPsComponent_Conditional_9_ng_template_2_Template, 15, 12, "ng-template", 7)(3, SocietariatByPsComponent_Conditional_9_ng_template_3_Template, 3, 0, "ng-template", 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("value", ctx_r0.stats)("tableStyle", \u0275\u0275pureFunction0(2, _c02));
  }
}
var SocietariatByPsComponent = class _SocietariatByPsComponent {
  agenceLibele;
  stats = [];
  loading = false;
  error;
  static \u0275fac = function SocietariatByPsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SocietariatByPsComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SocietariatByPsComponent, selectors: [["app-societariat-by-ps"]], inputs: { agenceLibele: "agenceLibele", stats: "stats", loading: "loading", error: "error" }, decls: 10, vars: 3, consts: [[1, "panel"], [1, "panel-header"], [1, "subtitle"], [1, "error"], [1, "loading"], ["styleClass", "stats-table", 3, "value", "tableStyle"], ["pTemplate", "header"], ["pTemplate", "body"], ["pTemplate", "emptymessage"], [2, "width", "25%"], [2, "width", "10%", "text-align", "center"], [2, "width", "13%", "text-align", "center"], [2, "text-align", "center"], [1, "number", "en-attente", 2, "text-align", "center"], [1, "number", "rejete", 2, "text-align", "center"], [1, "number", "valide", 2, "text-align", "center"], [1, "number", "total", 2, "text-align", "center"], ["pButton", "", "type", "button", "label", "Voir", 1, "p-button-text", "p-0", 3, "routerLink", "queryParams"], ["colspan", "7", 1, "empty"]], template: function SocietariatByPsComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div")(3, "h4");
      \u0275\u0275text(4, "Points de service");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p", 2);
      \u0275\u0275text(6);
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(7, SocietariatByPsComponent_Conditional_7_Template, 2, 1, "div", 3)(8, SocietariatByPsComponent_Conditional_8_Template, 2, 0, "div", 4)(9, SocietariatByPsComponent_Conditional_9_Template, 4, 3, "p-table", 5);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate1("Point de Service : ", ctx.agenceLibele || "Non renseign\xE9e", "");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.error ? 7 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading ? 8 : 9);
    }
  }, dependencies: [CommonModule, TableModule, Table, PrimeTemplate, RouterModule, RouterLink, ButtonModule, ButtonDirective], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.panel[_ngcontent-%COMP%] {\n  border: 1px solid #e5e7eb;\n  border-radius: 8px;\n  padding: 1rem;\n  background: white;\n  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);\n}\n.panel-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 1rem;\n}\n.panel-header[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin: 0;\n  font-weight: 700;\n}\n.panel-header[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n  margin: 0.25rem 0 0;\n  color: #6b7280;\n}\n.number[_ngcontent-%COMP%] {\n  text-align: center;\n  font-weight: 700;\n}\n  .stats-table .p-datatable-thead > tr > th {\n  background: #f8fafc;\n  border-bottom: 2px solid #e2e8f0;\n  padding: 0.75rem;\n  font-weight: 600;\n  color: #475569;\n  font-size: 0.875rem;\n}\n  .stats-table .p-datatable-tbody > tr > td {\n  padding: 0.625rem 0.75rem;\n  border-bottom: 1px solid #f1f5f9;\n  font-size: 0.875rem;\n}\n  .stats-table .p-datatable-tbody > tr:hover {\n  background: #f8fafc;\n}\n.en-attente[_ngcontent-%COMP%] {\n  color: #d97706;\n}\n.rejete[_ngcontent-%COMP%] {\n  color: #dc2626;\n}\n.valide[_ngcontent-%COMP%] {\n  color: #15803d;\n}\n.total[_ngcontent-%COMP%] {\n  color: #111827;\n}\n.empty[_ngcontent-%COMP%] {\n  text-align: center;\n  color: #6b7280;\n}\n.error[_ngcontent-%COMP%] {\n  padding: 0.5rem 0.75rem;\n  background: #fef2f2;\n  border: 1px solid #fecdd3;\n  border-radius: 6px;\n  color: #b91c1c;\n  margin-bottom: 0.75rem;\n}\n.loading[_ngcontent-%COMP%] {\n  padding: 1rem;\n  text-align: center;\n  color: #6b7280;\n}\n/*# sourceMappingURL=societariat-by-ps.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SocietariatByPsComponent, { className: "SocietariatByPsComponent", filePath: "src/app/pages/dashboard/agent-credit/societariat/societariat-by-ps/societariat-by-ps.component.ts", lineNumber: 14 });
})();

export {
  SocietariatByAgenceComponent,
  SocietariatByPsComponent
};
//# sourceMappingURL=chunk-J7AGU57C.js.map
