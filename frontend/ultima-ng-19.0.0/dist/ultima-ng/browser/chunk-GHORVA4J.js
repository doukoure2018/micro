import {
  StyleClass,
  StyleClassModule
} from "./chunk-CFS3J3Q2.js";
import {
  RouterLink,
  RouterModule
} from "./chunk-BTKK64MU.js";
import {
  ButtonDirective,
  ButtonLabel,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import {
  Ripple,
  RippleModule
} from "./chunk-AP3OAIHW.js";
import {
  environment
} from "./chunk-ZRELZ6R7.js";
import {
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵsanitizeUrl,
  ɵɵtext
} from "./chunk-ZKKMBKIA.js";

// src/app/pages/landing/components/topbar.ts
var _c0 = () => ["/"];
var _c1 = () => ["/auth/forgotpassword"];
var Topbar = class _Topbar {
  authServer = environment.authServer;
  redirectUri = environment.redirectUri;
  // Fixed code challenge
  codeChallenge = "HK02sitqCRpUlfLEX2xl4JGqaVQhNDsfTWH-oQzJHGw";
  handleScroll(id) {
    const element = document.getElementById(id);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
      }, 200);
    }
  }
  getLoginUrl() {
    return `${this.authServer}/oauth2/authorize?response_type=code&client_id=client&scope=openid&redirect_uri=${this.redirectUri}&code_challenge_method=S256&code_challenge=${this.codeChallenge}`;
  }
  static \u0275fac = function Topbar_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Topbar)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Topbar, selectors: [["topbar"]], decls: 20, vars: 7, consts: [[1, "flex", "justify-between", "items-center", "z-30", "px-8", "bg-black/40", "top-0", "w-full", "fixed", 2, "height", "68px", "backdrop-filter", "blur(17px)"], [1, "cursor-pointer", 3, "routerLink"], ["src", "/layout/images/logo/digi-credit.png", "alt", "logo", 2, "width", "250px", "height", "auto"], ["pStyleClass", "@next", "enterFromClass", "hidden", "leaveToClass", "hidden", 1, "cursor-pointer", "block", "lg:hidden", "text-white", 3, "hideOnOutsideClick"], [1, "pi", "pi-bars", "!text-4xl"], ["id", "menu", 1, "items-center", "grow", "hidden", "lg:flex", "absolute", "lg:static", "w-full", "lg:px-0", "z-30", "shadow", "lg:shadow-none", "animate-fadein", "bg-surface-0", "lg:!bg-transparent", 2, "top", "68px", "right", "0%"], [1, "list-none", "p-4", "lg:p-0", "m-0", "ml-auto", "flex", "lg:items-center", "select-none", "flex-col", "lg:flex-row", "cursor-pointer"], ["pStyleClass", "#menu", "enterFromClass", "hidden", "leaveToClass", "hidden", 1, "flex", "m-0", "md:ml-8", "px-0", "py-4", "lg:!text-surface-0", "text-surface-900", "leading-normal"], ["pStyleClass", "#menu", "enterFromClass", "hidden", "leaveToClass", "hidden", 1, "flex", "m-0", "md:ml-8", "px-0", "py-4", "lg:!text-surface-0", "text-surface-900", "leading-normal", 3, "click", "routerLink"], ["pButton", "", "pRipple", "", 1, "!bg-surface-900", "!border-surface-900", "m-0", "mt-4", "md:mt-0", "md:ml-8", "rounded-md", "px-3", "py-2", 3, "href"], ["pButtonLabel", "", 1, "font-medium", "text-surface-0"]], template: function Topbar_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div")(2, "a", 1);
      \u0275\u0275element(3, "img", 2);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(4, "a", 3);
      \u0275\u0275element(5, "i", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "div", 5)(7, "ul", 6)(8, "li")(9, "a", 7)(10, "span");
      \u0275\u0275text(11, "HOME");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(12, "li")(13, "a", 8);
      \u0275\u0275listener("click", function Topbar_Template_a_click_13_listener() {
        return ctx.handleScroll("collaboration");
      });
      \u0275\u0275elementStart(14, "span");
      \u0275\u0275text(15, "Mot de passe Oubli\xE9");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(16, "li")(17, "a", 9)(18, "span", 10);
      \u0275\u0275text(19, "Login");
      \u0275\u0275elementEnd()()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(5, _c0));
      \u0275\u0275advance();
      \u0275\u0275attribute("draggable", false);
      \u0275\u0275advance();
      \u0275\u0275property("hideOnOutsideClick", true);
      \u0275\u0275advance(9);
      \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(6, _c1));
      \u0275\u0275advance(4);
      \u0275\u0275property("href", ctx.getLoginUrl(), \u0275\u0275sanitizeUrl);
    }
  }, dependencies: [RouterModule, RouterLink, StyleClassModule, StyleClass, ButtonModule, ButtonDirective, ButtonLabel, RippleModule, Ripple], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Topbar, { className: "Topbar", filePath: "src/app/pages/landing/components/topbar.ts", lineNumber: 54 });
})();

export {
  Topbar
};
//# sourceMappingURL=chunk-GHORVA4J.js.map
