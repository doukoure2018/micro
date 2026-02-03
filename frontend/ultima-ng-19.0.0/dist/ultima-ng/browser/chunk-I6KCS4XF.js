import {
  AppConfigurator
} from "./chunk-I3HEDYSS.js";
import "./chunk-EOOGB7IQ.js";
import "./chunk-BVB72Z3E.js";
import "./chunk-ZGNAW63S.js";
import {
  InputGroupAddon
} from "./chunk-7A3QEVK3.js";
import {
  InputGroup
} from "./chunk-GEBY3FYZ.js";
import {
  Avatar
} from "./chunk-MCGUCMXD.js";
import "./chunk-HY2A3TN6.js";
import "./chunk-YEN5RMZS.js";
import {
  RouterModule
} from "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
import {
  InputText
} from "./chunk-FZELBHWZ.js";
import "./chunk-IVSL2HKS.js";
import "./chunk-E352KRZV.js";
import {
  ButtonDirective,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import {
  Ripple
} from "./chunk-AP3OAIHW.js";
import "./chunk-NQNBRQ7H.js";
import "./chunk-3HTR5OU7.js";
import "./chunk-BMYIFZHZ.js";
import "./chunk-W3K3GK4Z.js";
import "./chunk-SQQPVFHK.js";
import {
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵpureFunction0,
  ɵɵstyleMap,
  ɵɵtext
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// src/app/pages/auth/lockscreen.ts
var _c0 = () => ({ backgroundImage: "url(/images/pages/accessDenied-bg.jpg)" });
var LockScreen = class _LockScreen {
  static \u0275fac = function LockScreen_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LockScreen)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LockScreen, selectors: [["app-lockscreen"]], decls: 32, vars: 3, consts: [[1, "h-screen", "flex", "w-full", "bg-surface-50", "dark:bg-surface-950"], [1, "flex", "flex-1", "flex-col", "bg-surface-50", "dark:bg-surface-950", "items-center", "justify-center"], [1, "w-11/12", "sm:w-[30rem]"], [1, "flex", "flex-col"], [1, "bg-primary", "rounded-full", "flex", "items-center", "justify-center", 2, "height", "56px", "width", "56px"], [1, "pi", "pi-lock", "text-surface-0", "dark:text-surface-900", "!text-4xl"], [1, "mt-6"], [1, "m-0", "text-primary", "font-semibold", "text-4xl"], [1, "block", "text-surface-700", "dark:text-surface-100", "mt-2"], [1, "flex", "flex-col", "gap-4", "mt-12"], [1, "flex", "justify-between", "items-center"], [1, "flex", "gap-4", "items-center"], ["image", "/images/avatar/annafali.png", "shape", "circle", "size", "large"], [1, "flex", "flex-col", "gap-1"], [1, "text-color", "font-semibold", "text-lg"], [1, "text-muted-color", "text-sm"], ["pButton", "", "pRipple", "", "text", "", "icon", "pi pi-sign-out", "label", "Log out", 1, "text-primary-500"], [1, "pi", "pi-key"], ["pInputText", "", "id", "password2", "type", "password", "placeholder", "Password"], ["pButton", "", "pRipple", "", "label", "UNLOCK", 1, "w-full"], ["pButton", "", "pRipple", "", "text", "", "label", "SWITCH ACCOUNT", 1, "w-full", "text-primary-500"], [1, "hidden", "lg:flex", "flex-1", "items-center", "justify-center", "bg-cover"], ["src", "/layout/images/logo/vector_logo.png", "alt", ""], ["simple", ""]], template: function LockScreen_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4);
      \u0275\u0275element(5, "i", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "div", 6)(7, "span", 7);
      \u0275\u0275text(8, "Lock Screen");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "span", 8);
      \u0275\u0275text(10, "Enter your password");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(11, "div", 9)(12, "div", 10)(13, "div", 11);
      \u0275\u0275element(14, "p-avatar", 12);
      \u0275\u0275elementStart(15, "div", 13)(16, "span", 14);
      \u0275\u0275text(17, "Amy Elsner");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "span", 15);
      \u0275\u0275text(19, "UX Designer");
      \u0275\u0275elementEnd()()();
      \u0275\u0275element(20, "button", 16);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "p-input-group")(22, "p-inputgroup-addon");
      \u0275\u0275element(23, "i", 17);
      \u0275\u0275elementEnd();
      \u0275\u0275element(24, "input", 18);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "p-input-group");
      \u0275\u0275element(26, "button", 19);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "p-input-group");
      \u0275\u0275element(28, "button", 20);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(29, "div", 21);
      \u0275\u0275element(30, "img", 22);
      \u0275\u0275elementEnd()();
      \u0275\u0275element(31, "app-configurator", 23);
    }
    if (rf & 2) {
      \u0275\u0275advance(29);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(2, _c0));
    }
  }, dependencies: [ButtonModule, ButtonDirective, Ripple, RouterModule, AppConfigurator, Avatar, InputGroup, InputGroupAddon, InputText], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LockScreen, { className: "LockScreen", filePath: "src/app/pages/auth/lockscreen.ts", lineNumber: 60 });
})();
export {
  LockScreen
};
//# sourceMappingURL=chunk-I6KCS4XF.js.map
