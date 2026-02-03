import {
  AppConfigurator
} from "./chunk-I3HEDYSS.js";
import "./chunk-EOOGB7IQ.js";
import "./chunk-BVB72Z3E.js";
import {
  LayoutService
} from "./chunk-ZGNAW63S.js";
import "./chunk-HY2A3TN6.js";
import "./chunk-YEN5RMZS.js";
import {
  RouterLink,
  RouterModule
} from "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
import "./chunk-IVSL2HKS.js";
import "./chunk-E352KRZV.js";
import {
  ButtonDirective,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import {
  Ripple,
  RippleModule
} from "./chunk-AP3OAIHW.js";
import "./chunk-NQNBRQ7H.js";
import "./chunk-3HTR5OU7.js";
import "./chunk-BMYIFZHZ.js";
import "./chunk-W3K3GK4Z.js";
import "./chunk-SQQPVFHK.js";
import {
  inject,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵstyleMap,
  ɵɵtext
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// src/app/pages/auth/accessdenied.ts
var _c0 = () => ({ backgroundImage: "url(/images/pages/accessDenied-bg.jpg)" });
var _c1 = () => ["/"];
var AccessDenied = class _AccessDenied {
  layoutService = inject(LayoutService);
  static \u0275fac = function AccessDenied_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AccessDenied)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AccessDenied, selectors: [["app-access"]], decls: 12, vars: 5, consts: [[1, "min-h-screen", "flex", "flex-col", "bg-cover"], [1, "self-center", "mt-auto", "mb-auto"], [1, "text-center", "z-40", "rounded-lg", "border", "border-surface", "bg-white", "p-4", "shadow-md", "flex", "flex-col"], [1, "rounded-md", "mx-auto", "border", "border-surface", "bg-orange-500", "-mt-12", "px-4", "py-1"], [1, "m-0", "text-3xl", "font-semibold", "text-surface-0", "dark:text-surface-900"], [1, "bg-surface-200", "dark:bg-surface-600", "p-4", "mb-8", "shadow", "rounded-md", "mt-4", "px-12"], ["src", "/images/pages/accessDenied.png", "alt", "access"], [1, "text-muted-color", "pb-12"], ["pButton", "", "pRipple", "", "type", "button", "label", "GO BACK TO DASHBOARD", "text", "", 3, "routerLink"], ["simple", ""]], template: function AccessDenied_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "span", 4);
      \u0275\u0275text(5, "ACCESS DENIED");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 5);
      \u0275\u0275element(7, "img", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "div", 7);
      \u0275\u0275text(9, "You do not have the permissions.");
      \u0275\u0275elementEnd();
      \u0275\u0275element(10, "button", 8);
      \u0275\u0275elementEnd()()();
      \u0275\u0275element(11, "app-configurator", 9);
    }
    if (rf & 2) {
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(3, _c0));
      \u0275\u0275advance(10);
      \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(4, _c1));
    }
  }, dependencies: [ButtonModule, ButtonDirective, RouterModule, RouterLink, RippleModule, Ripple, AppConfigurator], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AccessDenied, { className: "AccessDenied", filePath: "src/app/pages/auth/accessdenied.ts", lineNumber: 28 });
})();
export {
  AccessDenied
};
//# sourceMappingURL=chunk-7TEQ5XTU.js.map
