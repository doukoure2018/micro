import {
  AppConfigurator
} from "./chunk-I3HEDYSS.js";
import "./chunk-EOOGB7IQ.js";
import "./chunk-BVB72Z3E.js";
import "./chunk-ZGNAW63S.js";
import {
  getFormData
} from "./chunk-4JF3UP6R.js";
import {
  InputGroupAddon
} from "./chunk-7A3QEVK3.js";
import {
  InputGroup
} from "./chunk-GEBY3FYZ.js";
import {
  Message,
  MessageModule
} from "./chunk-CSEZIGTY.js";
import {
  Toast,
  ToastModule
} from "./chunk-6SRYYUT2.js";
import "./chunk-HY2A3TN6.js";
import "./chunk-YEN5RMZS.js";
import {
  Router,
  RouterModule
} from "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
import {
  takeUntilDestroyed
} from "./chunk-WRLBQDQK.js";
import "./chunk-KHEKFKWA.js";
import {
  InputText
} from "./chunk-FZELBHWZ.js";
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
  MessageService
} from "./chunk-NQNBRQ7H.js";
import {
  DefaultValueAccessor,
  EmailValidator,
  FormsModule,
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
import "./chunk-ZRELZ6R7.js";
import "./chunk-BMYIFZHZ.js";
import "./chunk-W3K3GK4Z.js";
import "./chunk-SQQPVFHK.js";
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
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtext
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// src/app/pages/auth/forgotpassword/forgotpassword.component.ts
var _c0 = () => ({ backgroundImage: "url(/images/pages/login-bg.jpg)" });
function ForgotpasswordComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-message", 11);
    \u0275\u0275text(1, " Email is required ");
    \u0275\u0275elementEnd();
  }
}
function ForgotpasswordComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-message", 11);
    \u0275\u0275text(1, " Email format is invalid. ");
    \u0275\u0275elementEnd();
  }
}
var ForgotpasswordComponent = class _ForgotpasswordComponent {
  state = signal({
    loading: false,
    message: void 0,
    error: void 0
  });
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  userService = inject(UserService);
  messageService = inject(MessageService);
  ngOnInit() {
  }
  closeMessage = () => this.state.set({ loading: false, message: void 0, error: void 0 });
  resetPassword = (form) => {
    this.state.set({ loading: true, message: void 0, error: void 0 });
    console.log("form", form.value.email);
    this.userService.resetPassword$(getFormData(form.value, [])).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.state.set({ loading: false, message: response.message, error: void 0 });
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: response.message
        });
      },
      error: (error) => {
        this.state.set({ loading: false, message: void 0, error });
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error
        });
      },
      complete: () => form.reset()
    });
  };
  backToLogin() {
    this.router.navigate(["/auth/login"]);
  }
  static \u0275fac = function ForgotpasswordComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ForgotpasswordComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ForgotpasswordComponent, selectors: [["app-forgotpassword"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 24, vars: 6, consts: [["form", "ngForm"], ["email", "ngModel"], [1, "min-h-screen", "flex", "flex-col", "bg-cover"], [1, "self-center", "mt-auto", "mb-auto"], [1, "text-center", "z-50", "flex", "flex-col", "border", "rounded-md", "border-surface", "bg-surface-0", "dark:bg-surface-900", "p-12"], [1, "text-2xl", "font-semibold"], [1, "text-muted-color", "px-12"], [1, "flex", "flex-col", "gap-4", "mt-12"], [3, "ngSubmit"], [1, "pi", "pi-at"], ["pInputText", "", "name", "email", "ngModel", "", "placeholder", "Email", "required", "", "email", ""], ["severity", "error", "size", "small", "styleClass", "h-full w-full "], ["type", "submit", "pButton", "", "label", "Reset password", 1, "w-full", 3, "disabled"], ["href", "http://localhost:8080/oauth2/authorize?response_type=code&client_id=client&scope=openid&redirect_uri=http://localhost:4200&code_challenge_method=S256&code_challenge=vesLhZA4cwKsKZAR7zvEJ9q3uI6dRM8nwna-IpuKkkk", "pButton", "", "text", "", "label", "BACK TO LOGIN", 1, "w-full", "text-primary-500"], ["simple", ""]], template: function ForgotpasswordComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 2)(1, "div", 3)(2, "div", 4)(3, "span", 5);
      \u0275\u0275text(4, "Reinitialisation de mot de passe");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div", 6);
      \u0275\u0275text(6, "Saisissez votre addresse Email pour recevoir un email");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "div", 7)(8, "form", 8, 0);
      \u0275\u0275listener("ngSubmit", function ForgotpasswordComponent_Template_form_ngSubmit_8_listener() {
        \u0275\u0275restoreView(_r1);
        const form_r2 = \u0275\u0275reference(9);
        return \u0275\u0275resetView(ctx.resetPassword(form_r2));
      });
      \u0275\u0275elementStart(10, "p-input-group")(11, "p-inputgroup-addon");
      \u0275\u0275element(12, "i", 9);
      \u0275\u0275elementEnd();
      \u0275\u0275element(13, "input", 10, 1);
      \u0275\u0275template(15, ForgotpasswordComponent_Conditional_15_Template, 2, 0, "p-message", 11)(16, ForgotpasswordComponent_Conditional_16_Template, 2, 0, "p-message", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275element(17, "br");
      \u0275\u0275elementStart(18, "p-input-group");
      \u0275\u0275element(19, "button", 12);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(20, "p-input-group");
      \u0275\u0275element(21, "a", 13);
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275element(22, "p-toast")(23, "app-configurator", 14);
    }
    if (rf & 2) {
      const form_r2 = \u0275\u0275reference(9);
      const email_r3 = \u0275\u0275reference(14);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(5, _c0));
      \u0275\u0275advance(15);
      \u0275\u0275conditional(email_r3.invalid && email_r3.dirty && email_r3.touched && (email_r3.errors == null ? null : email_r3.errors["required"]) ? 15 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(email_r3.invalid && email_r3.dirty && email_r3.touched && (email_r3.errors == null ? null : email_r3.errors["email"]) ? 16 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275property("disabled", form_r2.invalid || ctx.state().loading);
    }
  }, dependencies: [InputText, ButtonModule, ButtonDirective, RippleModule, RouterModule, InputGroup, InputGroupAddon, AppConfigurator, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, EmailValidator, NgModel, NgForm, MessageModule, Message, ToastModule, Toast], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ForgotpasswordComponent, { className: "ForgotpasswordComponent", filePath: "src/app/pages/auth/forgotpassword/forgotpassword.component.ts", lineNumber: 23 });
})();
export {
  ForgotpasswordComponent
};
//# sourceMappingURL=chunk-JPSSGYNY.js.map
