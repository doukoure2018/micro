import {
  AppConfigurator
} from "./chunk-I3HEDYSS.js";
import "./chunk-EOOGB7IQ.js";
import "./chunk-BVB72Z3E.js";
import "./chunk-ZGNAW63S.js";
import {
  InputGroupAddonModule
} from "./chunk-7A3QEVK3.js";
import {
  InputGroupModule
} from "./chunk-GEBY3FYZ.js";
import {
  Message,
  MessageModule
} from "./chunk-CSEZIGTY.js";
import {
  Toast,
  ToastModule
} from "./chunk-6SRYYUT2.js";
import {
  InputNumberModule
} from "./chunk-JGOABXTK.js";
import "./chunk-HY2A3TN6.js";
import "./chunk-YEN5RMZS.js";
import "./chunk-CUABQE42.js";
import {
  ProgressSpinner,
  ProgressSpinnerModule
} from "./chunk-Y2J5OGKB.js";
import {
  ActivatedRoute,
  RouterLink,
  RouterModule
} from "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
import {
  takeUntilDestroyed
} from "./chunk-WRLBQDQK.js";
import "./chunk-KHEKFKWA.js";
import "./chunk-FZELBHWZ.js";
import "./chunk-IVSL2HKS.js";
import "./chunk-E352KRZV.js";
import "./chunk-HHD4PK4J.js";
import {
  ButtonDirective,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import "./chunk-AP3OAIHW.js";
import {
  MessageService
} from "./chunk-NQNBRQ7H.js";
import {
  FormsModule
} from "./chunk-3HTR5OU7.js";
import {
  UserService
} from "./chunk-SQ5BRWVW.js";
import {
  environment
} from "./chunk-ZRELZ6R7.js";
import "./chunk-BMYIFZHZ.js";
import "./chunk-W3K3GK4Z.js";
import "./chunk-SQQPVFHK.js";
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
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵsanitizeUrl,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// src/app/pages/auth/verifyaccount/verifyaccount.component.ts
var _c0 = () => ({ "width": "5rem", "height": "5rem" });
var _c1 = () => ["/"];
function VerifyaccountComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275element(1, "p-progress-spinner", 3);
    \u0275\u0275elementStart(2, "div", 4);
    \u0275\u0275element(3, "i", 5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 6)(5, "h2", 7);
    \u0275\u0275text(6, "Verifying account...");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 8);
    \u0275\u0275text(8, "Please wait while we validate your credentials");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(2, _c0));
  }
}
function VerifyaccountComponent_Conditional_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-message", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("@close", ctx_r0.closeMessage);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.state().message);
  }
}
function VerifyaccountComponent_Conditional_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-message", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("@close", ctx_r0.closeMessage);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.state().error);
  }
}
function VerifyaccountComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "div")(2, "div", 9);
    \u0275\u0275template(3, VerifyaccountComponent_Conditional_2_Conditional_3_Template, 2, 2, "p-message", 10)(4, VerifyaccountComponent_Conditional_2_Conditional_4_Template, 2, 2, "p-message", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 12)(6, "a", 13);
    \u0275\u0275text(7, "Forgot password?");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 14);
    \u0275\u0275element(9, "a", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 14);
    \u0275\u0275element(11, "a", 16);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(12, "p-toast")(13, "app-configurator", 17);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r0.state().message ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.state().error ? 4 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275property("href", ctx_r0.getLoginUrl(), \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(4, _c1));
  }
}
var VerifyaccountComponent = class _VerifyaccountComponent {
  state = signal({
    loading: false,
    message: void 0,
    error: void 0
  });
  // Add these properties (same as TopBar)
  authServer = environment.authServer;
  redirectUri = environment.redirectUri;
  codeChallenge = "HK02sitqCRpUlfLEX2xl4JGqaVQhNDsfTWH-oQzJHGw";
  destroyRef = inject(DestroyRef);
  userService = inject(UserService);
  messageService = inject(MessageService);
  activatedRouter = inject(ActivatedRoute);
  ngOnInit() {
    console.log("Verification in action");
    this.activatedRouter.queryParamMap.pipe(switchMap((params) => {
      const token = params.get("token");
      if (token) {
        this.state.set({ loading: true, message: void 0, error: void 0 });
        return this.userService.verifyAccountToken$(token);
      } else {
        this.state.set({ loading: false, message: void 0, error: "Invalide Link. Please try again" });
        return EMPTY;
      }
    }), takeUntilDestroyed(this.destroyRef)).subscribe(this.verifyAccount);
  }
  closeMessage = () => this.state.set({ loading: false, message: void 0, error: void 0 });
  // Add this method (same as TopBar)
  getLoginUrl() {
    return `${this.authServer}/oauth2/authorize?response_type=code&client_id=client&scope=openid&redirect_uri=${this.redirectUri}&code_challenge_method=S256&code_challenge=${this.codeChallenge}`;
  }
  /**
   *  this will execute when the method verifyAccountToken$(token) has been executed
   */
  verifyAccount = {
    next: (response) => {
      this.state.set({ loading: false, message: response.message, error: void 0 });
      this.messageService.add({
        severity: "success",
        summary: "Verification Account",
        detail: "Account has been verified"
      });
    },
    error: (error) => {
      this.state.set({ loading: false, message: void 0, error });
      this.messageService.add({
        severity: "error",
        summary: "Verification Account",
        detail: error
      });
    },
    complete: () => {
    }
  };
  static \u0275fac = function VerifyaccountComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VerifyaccountComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VerifyaccountComponent, selectors: [["app-verifyaccount"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 4, vars: 1, consts: [[1, "flex", "flex-col", "items-center", "justify-center", "gap-6", "py-8"], [1, "bg-surface-0", "dark:bg-surface-900", "p-6", "shadow", "rounded", "w-full", "lg:w-6/12"], [1, "relative"], ["ariaLabel", "Verifying account", "strokeWidth", "4", "animationDuration", ".5s", 1, "text-primary"], [1, "absolute", "inset-0", "flex", "items-center", "justify-center"], [1, "pi", "pi-lock", "text-lg", "text-primary"], [1, "text-center"], [1, "text-2xl", "font-semibold", "mb-2"], [1, "text-surface-600", "dark:text-surface-300"], [1, "flex", "flex-col", "gap-4", "mb-4"], ["severity", "success", "closable", "true"], ["severity", "error", "closable", "true"], [1, "flex", "items-center", "justify-between", "mb-12"], [1, "font-medium", "no-underline", "ml-2", "text-primary", "text-right", "cursor-pointer"], [1, "mt-4"], ["pButton", "", "pRipple", "", "label", "Log in", 1, "w-full", 3, "href"], ["pButton", "", "pRipple", "", "text", "", "label", "Page d'accueil", 1, "w-full", "text-primary-500", 3, "routerLink"], ["simple", ""]], template: function VerifyaccountComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275template(1, VerifyaccountComponent_Conditional_1_Template, 9, 3)(2, VerifyaccountComponent_Conditional_2_Template, 14, 5, "div", 1);
      \u0275\u0275element(3, "p-toast");
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.state().loading ? 1 : 2);
    }
  }, dependencies: [ButtonModule, ButtonDirective, RouterModule, RouterLink, FormsModule, AppConfigurator, InputGroupModule, InputGroupAddonModule, InputNumberModule, MessageModule, Message, ToastModule, Toast, ProgressSpinnerModule, ProgressSpinner], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VerifyaccountComponent, { className: "VerifyaccountComponent", filePath: "src/app/pages/auth/verifyaccount/verifyaccount.component.ts", lineNumber: 25 });
})();
export {
  VerifyaccountComponent
};
//# sourceMappingURL=chunk-IKF75Q46.js.map
