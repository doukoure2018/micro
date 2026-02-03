import {
  AppConfigurator
} from "./chunk-I3HEDYSS.js";
import "./chunk-EOOGB7IQ.js";
import "./chunk-BVB72Z3E.js";
import "./chunk-ZGNAW63S.js";
import {
  InputGroupAddon,
  InputGroupAddonModule
} from "./chunk-7A3QEVK3.js";
import {
  InputGroup,
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
  ProgressBarModule
} from "./chunk-WQ2EPPBK.js";
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
import "./chunk-AP3OAIHW.js";
import {
  MessageService
} from "./chunk-NQNBRQ7H.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MinLengthValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  RequiredValidator,
  ɵNgNoValidate
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
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-ZKKMBKIA.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/pages/auth/verifypassword/verifypassword.component.ts
var _c0 = () => ({ "width": "5rem", "height": "5rem" });
var _c1 = () => ["/auth/forgotpassword"];
var _c2 = () => ["/"];
var _c3 = () => ["/auth/home"];
function VerifypasswordComponent_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275element(1, "p-progress-spinner", 7);
    \u0275\u0275elementStart(2, "div", 8);
    \u0275\u0275element(3, "i", 9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 10)(5, "h2", 11);
    \u0275\u0275text(6, "Verifying account...");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 12);
    \u0275\u0275text(8, "Please wait while we validate your credentials");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(2, _c0));
  }
}
function VerifypasswordComponent_Conditional_1_Conditional_1_Conditional_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13)(1, "div")(2, "div", 14)(3, "p-message", 15);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 16);
    \u0275\u0275element(6, "a", 17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 16);
    \u0275\u0275element(8, "a", 18);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(3);
    \u0275\u0275property("closable", true);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.state().error);
    \u0275\u0275advance(2);
    \u0275\u0275property("href", ctx_r0.getLoginUrl(), \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(4, _c1));
  }
}
function VerifypasswordComponent_Conditional_1_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, VerifypasswordComponent_Conditional_1_Conditional_1_Conditional_0_Conditional_0_Template, 9, 5, "div", 13);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional(ctx_r0.state().error ? 0 : -1);
  }
}
function VerifypasswordComponent_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, VerifypasswordComponent_Conditional_1_Conditional_1_Conditional_0_Template, 1, 1);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(!ctx_r0.state().loading ? 0 : -1);
  }
}
function VerifypasswordComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, VerifypasswordComponent_Conditional_1_Conditional_0_Template, 9, 3)(1, VerifypasswordComponent_Conditional_1_Conditional_1_Template, 1, 1);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r0.state().loading ? 0 : 1);
  }
}
function VerifypasswordComponent_Conditional_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13)(1, "div")(2, "div", 14)(3, "p-message", 19);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 20)(6, "a", 21);
    \u0275\u0275text(7, "Forgot password?");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 16);
    \u0275\u0275element(9, "a", 22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 16);
    \u0275\u0275element(11, "a", 23);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275property("closable", true);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.state().message);
    \u0275\u0275advance(5);
    \u0275\u0275property("href", ctx_r0.getLoginUrl(), \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(4, _c2));
  }
}
function VerifypasswordComponent_Conditional_2_Conditional_1_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-message", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("closable", true);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.state().message);
  }
}
function VerifypasswordComponent_Conditional_2_Conditional_1_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-message", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("closable", true);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.state().error);
  }
}
function VerifypasswordComponent_Conditional_2_Conditional_1_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-message", 32);
    \u0275\u0275text(1, " Password is required ");
    \u0275\u0275elementEnd();
  }
}
function VerifypasswordComponent_Conditional_2_Conditional_1_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-message", 32);
    \u0275\u0275text(1, " This password is too short ");
    \u0275\u0275elementEnd();
  }
}
function VerifypasswordComponent_Conditional_2_Conditional_1_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-message", 32);
    \u0275\u0275text(1, " Confirm Password is required ");
    \u0275\u0275elementEnd();
  }
}
function VerifypasswordComponent_Conditional_2_Conditional_1_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-message", 32);
    \u0275\u0275text(1, " This password confirmation is too short ");
    \u0275\u0275elementEnd();
  }
}
function VerifypasswordComponent_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 13)(1, "div", 24)(2, "h1", 25);
    \u0275\u0275text(3, "RESET PASSWORD");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div")(5, "div", 14);
    \u0275\u0275template(6, VerifypasswordComponent_Conditional_2_Conditional_1_Conditional_6_Template, 2, 2, "p-message", 19)(7, VerifypasswordComponent_Conditional_2_Conditional_1_Conditional_7_Template, 2, 2, "p-message", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 20)(9, "a", 21);
    \u0275\u0275text(10, "Mot de passe Oubli\xE9?");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "form", 26, 0);
    \u0275\u0275listener("ngSubmit", function VerifypasswordComponent_Conditional_2_Conditional_1_Template_form_ngSubmit_11_listener() {
      \u0275\u0275restoreView(_r2);
      const form_r3 = \u0275\u0275reference(12);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.createNewPassword(form_r3));
    });
    \u0275\u0275elementStart(13, "div", 27)(14, "p-input-group");
    \u0275\u0275element(15, "input", 28)(16, "input", 29);
    \u0275\u0275elementStart(17, "p-inputgroup-addon");
    \u0275\u0275element(18, "i", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275element(19, "input", 31, 1);
    \u0275\u0275template(21, VerifypasswordComponent_Conditional_2_Conditional_1_Conditional_21_Template, 2, 0, "p-message", 32)(22, VerifypasswordComponent_Conditional_2_Conditional_1_Conditional_22_Template, 2, 0, "p-message", 32);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "p-input-group")(24, "p-inputgroup-addon");
    \u0275\u0275element(25, "i", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275element(26, "input", 33, 2);
    \u0275\u0275template(28, VerifypasswordComponent_Conditional_2_Conditional_1_Conditional_28_Template, 2, 0, "p-message", 32)(29, VerifypasswordComponent_Conditional_2_Conditional_1_Conditional_29_Template, 2, 0, "p-message", 32);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "div", 16);
    \u0275\u0275element(31, "button", 34);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(32, "div", 16);
    \u0275\u0275element(33, "a", 35);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const form_r3 = \u0275\u0275reference(12);
    const password_r4 = \u0275\u0275reference(20);
    const confirmPassword_r5 = \u0275\u0275reference(27);
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(ctx_r0.state().message ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.state().error ? 7 : -1);
    \u0275\u0275advance(8);
    \u0275\u0275property("ngModel", ctx_r0.state().userUuid);
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r0.state().token);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(password_r4.invalid && password_r4.touched && (password_r4.errors == null ? null : password_r4.errors["required"]) ? 21 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(password_r4.invalid && password_r4.touched && (password_r4.errors == null ? null : password_r4.errors["minlength"]) ? 22 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(confirmPassword_r5.invalid && confirmPassword_r5.touched && (confirmPassword_r5.errors == null ? null : confirmPassword_r5.errors["required"]) ? 28 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(confirmPassword_r5.invalid && confirmPassword_r5.touched && (confirmPassword_r5.errors == null ? null : confirmPassword_r5.errors["minlength"]) ? 29 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", form_r3.invalid || ctx_r0.state().loading);
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(10, _c3));
  }
}
function VerifypasswordComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, VerifypasswordComponent_Conditional_2_Conditional_0_Template, 12, 5, "div", 13)(1, VerifypasswordComponent_Conditional_2_Conditional_1_Template, 34, 11, "div", 13);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r0.state().success ? 0 : 1);
  }
}
var VerifypasswordComponent = class _VerifypasswordComponent {
  state = signal({
    mode: "verify",
    success: false,
    loading: false,
    message: void 0,
    error: void 0
  });
  // Add these properties (same as TopBar and VerifyAccount)
  authServer = environment.authServer;
  redirectUri = environment.redirectUri;
  // Note: Your component uses a different code challenge - consider making this consistent
  codeChallenge = "vesLhZA4cwKsKZAR7zvEJ9q3uI6dRM8nwna-IpuKkkk";
  destroyRef = inject(DestroyRef);
  userService = inject(UserService);
  messageService = inject(MessageService);
  activatedRouter = inject(ActivatedRoute);
  ngOnInit() {
    console.log("Verification in action");
    this.activatedRouter.queryParamMap.pipe(
      switchMap((params) => {
        const token = params.get("token");
        if (token) {
          this.state.set({ token, mode: "verify", loading: true, message: void 0, error: void 0, success: false });
          return this.userService.verifyPasswordToken$(token);
        } else {
          this.state.set({ mode: "verify", success: false, loading: false, message: void 0, error: "Invalide Link. Please try again" });
          return EMPTY;
        }
      }),
      //delay(5 * 3000),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(this.verifySubscriber);
  }
  closeMessage = () => this.state.update((state) => __spreadProps(__spreadValues({}, state), { message: void 0, error: void 0 }));
  // Add this method (same as TopBar and VerifyAccount)
  getLoginUrl() {
    return `${this.authServer}/oauth2/authorize?response_type=code&client_id=client&scope=openid&redirect_uri=${this.redirectUri}&code_challenge_method=S256&code_challenge=${this.codeChallenge}`;
  }
  createNewPassword = (form) => {
    console.log("form", form.value);
    this.userService.createNewPassword$(form.value).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { success: true, loading: false, message: response.message, error: void 0 }));
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: response.message
        });
      },
      error: (error) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { success: false, loading: false, message: void 0, error }));
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error
        });
      },
      complete: () => {
      }
    });
  };
  /**
   *  this will execute when the method verifyAccountToken$(token) has been executed
   */
  verifySubscriber = {
    next: (response) => {
      this.state.update((state) => __spreadProps(__spreadValues({}, state), { loading: false, mode: "reset", userUuid: response.data.user?.userUuid, message: `${response.message} for ${response.data.user?.email}`, error: void 0 }));
      this.messageService.add({
        severity: "success",
        summary: "Verification Account",
        detail: "Link has been verified"
      });
    },
    error: (error) => {
      this.state.set({ mode: "verify", loading: false, message: void 0, error });
      this.messageService.add({
        severity: "error",
        summary: "Verification Password",
        detail: error
      });
    },
    complete: () => {
    }
  };
  static \u0275fac = function VerifypasswordComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VerifypasswordComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VerifypasswordComponent, selectors: [["app-verifypassword"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 5, vars: 4, consts: [["form", "ngForm"], ["password", "ngModel"], ["confirmPassword", "ngModel"], [1, "flex", "flex-col", "items-center", "justify-center", "gap-6", "py-8"], [3, "position", "life"], ["simple", ""], [1, "relative"], ["ariaLabel", "Verifying account", "strokeWidth", "4", "animationDuration", ".5s", 1, "text-primary"], [1, "absolute", "inset-0", "flex", "items-center", "justify-center"], [1, "pi", "pi-lock", "text-lg", "text-primary"], [1, "text-center"], [1, "text-2xl", "font-semibold", "mb-2"], [1, "text-surface-600", "dark:text-surface-300"], [1, "bg-surface-0", "dark:bg-surface-900", "p-6", "shadow", "rounded", "w-full", "lg:w-6/12"], [1, "flex", "flex-col", "gap-4", "mb-4"], ["severity", "error", 3, "closable"], [1, "mt-4"], ["pButton", "", "pRipple", "", "label", "Se connecter", 1, "w-full", 3, "href"], ["pButton", "", "pRipple", "", "text", "", "label", "R\xE9initialiser le mot de passe", 1, "w-full", "text-primary-500", 3, "routerLink"], ["severity", "success", 3, "closable"], [1, "flex", "items-center", "justify-between", "mb-12"], [1, "font-medium", "no-underline", "ml-2", "text-primary", "text-right", "cursor-pointer"], ["pButton", "", "pRipple", "", "label", "Log in", 1, "w-full", 3, "href"], ["pButton", "", "pRipple", "", "text", "", "label", "Reset Password", 1, "w-full", "text-primary-500", 3, "routerLink"], [1, "mt-6"], [1, "m-0", "text-primary", "font-semibold", "text-4xl"], [3, "ngSubmit"], [1, "flex", "flex-col", "gap-4", "mt-12"], ["type", "hidden", "name", "userUuid", "id", "userUuid", "required", "", 3, "ngModel"], ["type", "hidden", "name", "token", "id", "token", "required", "", 3, "ngModel"], [1, "pi", "pi-key"], ["pInputText", "", "id", "password", "type", "password", "name", "password", "ngModel", "", "placeholder", "Password", "required", "", "minlength", "6"], ["severity", "error", "size", "small", "styleClass", "h-full w-full"], ["pInputText", "", "id", "confirmPassword", "type", "password", "name", "confirmPassword", "ngModel", "", "placeholder", "Confirmer le mot de passe", "required", "", "minlength", "6"], ["pButton", "", "type", "submit", "pRipple", "", "label", "Reset Password", 1, "w-full", 3, "disabled"], ["pButton", "", "pRipple", "", "text", "", "label", "Page d'accueil", 1, "w-full", "text-primary-500", 3, "routerLink"]], template: function VerifypasswordComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 3);
      \u0275\u0275template(1, VerifypasswordComponent_Conditional_1_Template, 2, 1)(2, VerifypasswordComponent_Conditional_2_Template, 2, 1);
      \u0275\u0275element(3, "p-toast", 4)(4, "app-configurator", 5);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.state().mode === "verify" ? 1 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.state().mode === "reset" ? 2 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("position", "top-right")("life", 3e3);
    }
  }, dependencies: [ButtonModule, ButtonDirective, RouterModule, RouterLink, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MinLengthValidator, NgModel, NgForm, AppConfigurator, ToastModule, Toast, MessageModule, Message, ProgressBarModule, ProgressSpinnerModule, ProgressSpinner, InputTextModule, InputText, InputGroupModule, InputGroup, InputGroupAddonModule, InputGroupAddon, InputNumberModule], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VerifypasswordComponent, { className: "VerifypasswordComponent", filePath: "src/app/pages/auth/verifypassword/verifypassword.component.ts", lineNumber: 29 });
})();
export {
  VerifypasswordComponent
};
//# sourceMappingURL=chunk-6RYCRYGU.js.map
