import {
  PasswordModule
} from "./chunk-NBJHCGNS.js";
import "./chunk-UZIOTGW7.js";
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
  CheckboxModule
} from "./chunk-4JIPYACT.js";
import "./chunk-6GA37Q7Z.js";
import "./chunk-HY2A3TN6.js";
import "./chunk-YEN5RMZS.js";
import {
  RouterLink,
  RouterModule
} from "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
import {
  InputText,
  InputTextModule
} from "./chunk-FZELBHWZ.js";
import "./chunk-IVSL2HKS.js";
import "./chunk-E352KRZV.js";
import "./chunk-HHD4PK4J.js";
import {
  ButtonDirective,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import {
  Ripple,
  RippleModule
} from "./chunk-AP3OAIHW.js";
import "./chunk-NQNBRQ7H.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-3HTR5OU7.js";
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
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵstyleMap,
  ɵɵtext,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// src/app/pages/auth/login2.ts
var _c0 = () => ["/"];
var _c1 = () => ({ backgroundImage: "url(/images/pages/accessDenied-bg.jpg)" });
var Login2 = class _Login2 {
  password = "";
  email = "";
  static \u0275fac = function Login2_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Login2)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Login2, selectors: [["app-login-2"]], decls: 27, vars: 7, consts: [[1, "h-screen", "flex", "w-full", "bg-surface-50", "dark:bg-surface-950"], [1, "flex", "flex-1", "flex-col", "bg-surface-50", "dark:bg-surface-950", "items-center", "justify-center"], [1, "w-11/12", "sm:w-[30rem]"], [1, "flex", "flex-col"], [1, "bg-primary", "rounded-full", "flex", "items-center", "justify-center", 2, "height", "56px", "width", "56px"], [1, "pi", "pi-sign-in", "text-surface-0", "dark:text-surface-900", "!text-4xl"], [1, "mt-6"], [1, "m-0", "text-primary", "font-semibold", "text-4xl"], [1, "block", "text-surface-700", "dark:text-surface-100", "mt-2"], [1, "flex", "flex-col", "gap-4", "mt-12"], [1, "pi", "pi-user"], ["pInputText", "", "type", "text", "placeholder", "Email", 3, "ngModelChange", "ngModel"], [1, "pi", "pi-key"], ["pInputText", "", "type", "password", "placeholder", "Password", 3, "ngModelChange", "ngModel"], ["pButton", "", "pRipple", "", "label", "LOGIN", 1, "w-full", 3, "routerLink"], ["pButton", "", "pRipple", "", "text", "", "label", "FORGOT PASSWORD?", 1, "w-full", "text-primary-500"], [1, "hidden", "lg:flex", "flex-1", "items-center", "justify-center", "bg-cover"], ["src", "/layout/images/logo/vector_logo.png", "alt", ""], ["simple", ""]], template: function Login2_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4);
      \u0275\u0275element(5, "i", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "div", 6)(7, "h1", 7);
      \u0275\u0275text(8, "Welcome back!");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "span", 8);
      \u0275\u0275text(10, "Please fill the fields to sign-up Ultima network");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(11, "div", 9)(12, "p-input-group")(13, "p-inputgroup-addon");
      \u0275\u0275element(14, "i", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "input", 11);
      \u0275\u0275twoWayListener("ngModelChange", function Login2_Template_input_ngModelChange_15_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.email, $event) || (ctx.email = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(16, "p-input-group")(17, "p-inputgroup-addon");
      \u0275\u0275element(18, "i", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "input", 13);
      \u0275\u0275twoWayListener("ngModelChange", function Login2_Template_input_ngModelChange_19_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.password, $event) || (ctx.password = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(20, "div");
      \u0275\u0275element(21, "button", 14);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "div");
      \u0275\u0275element(23, "button", 15);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(24, "div", 16);
      \u0275\u0275element(25, "img", 17);
      \u0275\u0275elementEnd()();
      \u0275\u0275element(26, "app-configurator", 18);
    }
    if (rf & 2) {
      \u0275\u0275advance(15);
      \u0275\u0275twoWayProperty("ngModel", ctx.email);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.password);
      \u0275\u0275advance(2);
      \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(5, _c0));
      \u0275\u0275advance(3);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(6, _c1));
    }
  }, dependencies: [ButtonModule, ButtonDirective, CheckboxModule, InputTextModule, InputText, PasswordModule, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, RouterModule, RouterLink, RippleModule, Ripple, AppConfigurator, InputGroup, InputGroupAddon], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Login2, { className: "Login2", filePath: "src/app/pages/auth/login2.ts", lineNumber: 57 });
})();
export {
  Login2
};
//# sourceMappingURL=chunk-DEKA3CNY.js.map
