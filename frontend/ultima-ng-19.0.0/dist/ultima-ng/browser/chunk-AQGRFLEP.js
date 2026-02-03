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
  InputNumberModule
} from "./chunk-JGOABXTK.js";
import "./chunk-HY2A3TN6.js";
import "./chunk-YEN5RMZS.js";
import "./chunk-CUABQE42.js";
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
  Ripple
} from "./chunk-AP3OAIHW.js";
import {
  MessageService
} from "./chunk-NQNBRQ7H.js";
import {
  DefaultValueAccessor,
  EmailValidator,
  FormsModule,
  MinLengthValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  PatternValidator,
  RequiredValidator,
  ɵNgNoValidate
} from "./chunk-3HTR5OU7.js";
import {
  StorageService,
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
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// src/app/pages/auth/register/register.component.ts
var _c0 = () => ({ backgroundImage: "url(/images/pages/accessDenied-bg.jpg)" });
function RegisterComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15)(1, "p-message", 33);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.state().message);
  }
}
function RegisterComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15)(1, "p-message", 34);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.state().error, "");
  }
}
function RegisterComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-message", 20);
    \u0275\u0275text(1, " First name is required ");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-message", 20);
    \u0275\u0275text(1, " Last name is required ");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-message", 20);
    \u0275\u0275text(1, " Email is required ");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-message", 20);
    \u0275\u0275text(1, " Email format is invalid ");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-message", 25);
    \u0275\u0275text(1, " Username must be alphanumeric ");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-message", 25);
    \u0275\u0275text(1, " User name is required ");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-message", 25);
    \u0275\u0275text(1, " Password is required ");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-message", 25);
    \u0275\u0275text(1, " this password is too short ");
    \u0275\u0275elementEnd();
  }
}
var RegisterComponent = class _RegisterComponent {
  state = signal({
    loading: false,
    message: void 0,
    error: void 0
  });
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  storage = inject(StorageService);
  userService = inject(UserService);
  messageService = inject(MessageService);
  value1 = "";
  value2 = "";
  ngOnInit() {
    console.log(this.storage.getRedirectUrl());
    if (this.userService.isAuthenticated() && !this.userService.isTokenExpired()) {
      this.storage.getRedirectUrl() ? this.router.navigate([this.storage.getRedirectUrl()]) : this.router.navigate([["/dashboard"]]);
      return;
    }
  }
  closeMessage = () => this.state.set({ loading: false, message: void 0, error: void 0 });
  register = (form) => {
    this.state.set({ loading: true, message: void 0, error: void 0 });
    console.log("form", form.value);
    this.userService.register$(form.value).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
  displayToast = this.messageService.add({
    severity: "error",
    summary: "Error",
    detail: "this is an error message"
  });
  backToLogin() {
    this.router.navigate(["/auth/login"]);
  }
  static \u0275fac = function RegisterComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RegisterComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RegisterComponent, selectors: [["app-register"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 57, vars: 14, consts: [["form", "ngForm"], ["firstName", "ngModel"], ["lastName", "ngModel"], ["email", "ngModel"], ["username", "ngModel"], ["password", "ngModel"], [1, "h-screen", "flex", "w-full", "bg-surface-50", "dark:bg-surface-950"], [1, "flex", "flex-1", "flex-col", "bg-surface-50", "dark:bg-surface-950", "items-center", "justify-center"], [1, "w-11/12", "sm:w-[30rem]"], [1, "flex", "flex-col"], [1, "bg-primary", "rounded-full", "flex", "items-center", "justify-center", 2, "height", "56px", "width", "56px"], [1, "pi", "pi-users", "text-surface-0", "dark:text-surface-900", "!text-4xl"], [1, "mt-6"], [1, "m-0", "text-primary", "font-semibold", "text-4xl"], [1, "block", "text-surface-700", "dark:text-surface-100", "mt-2"], [1, "flex", "flex-col", "gap-4", "mb-4"], [1, "flex", "flex-col", "gap-4", "mt-6", 3, "ngSubmit"], [1, "flex", "flex-col", "gap-4", "mt-12"], [1, "pi", "pi-user"], ["pInputText", "", "name", "firstName", "ngModel", "", "placeholder", "First Name", "required", ""], ["severity", "error", "size", "small", "styleClass", "h-full w-full "], ["pInputText", "", "name", "lastName", "ngModel", "", "placeholder", "Last Name", "required", ""], [1, "pi", "pi-at"], ["pInputText", "", "name", "email", "ngModel", "", "placeholder", "Email", "required", "", "email", ""], ["pInputText", "", "name", "username", "ngModel", "", "placeholder", "Username", "required", "", "pattern", "^[a-zA-Z0-9]+$", "minlength", "4"], ["severity", "error", "size", "small", "styleClass", "h-full w-full"], [1, "pi", "pi-key"], ["pInputText", "", "id", "password", "type", "password", "name", "password", "ngModel", "", "placeholder", "Password", "required", "", "minlength", "6"], ["type", "submit", "pButton", "", "pRipple", "", "label", "Souscrire ", 1, "w-full", 3, "disabled"], ["href", "http://localhost:8080/oauth2/authorize?response_type=code&client_id=client&scope=openid&redirect_uri=http://localhost:4200&code_challenge_method=S256&code_challenge=vesLhZA4cwKsKZAR7zvEJ9q3uI6dRM8nwna-IpuKkkk", "pButton", "", "pRipple", "", "text", "", "label", "BACK TO LOGIN", 1, "w-full", "text-primary-500"], [1, "hidden", "lg:flex", "flex-1", "items-center", "justify-center", "bg-cover"], ["src", "/layout/images/logo/vector_logo.png", "alt", ""], ["simple", ""], ["severity", "success"], ["severity", "error"]], template: function RegisterComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 6)(1, "div", 7)(2, "div", 8)(3, "div", 9)(4, "div", 10);
      \u0275\u0275element(5, "i", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "div", 12)(7, "h1", 13);
      \u0275\u0275text(8, "Join us!");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "span", 14);
      \u0275\u0275text(10, "Please fill the fields to sign-up Ultima network");
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(11, RegisterComponent_Conditional_11_Template, 3, 1, "div", 15)(12, RegisterComponent_Conditional_12_Template, 3, 1, "div", 15);
      \u0275\u0275elementStart(13, "form", 16, 0);
      \u0275\u0275listener("ngSubmit", function RegisterComponent_Template_form_ngSubmit_13_listener() {
        \u0275\u0275restoreView(_r1);
        const form_r3 = \u0275\u0275reference(14);
        return \u0275\u0275resetView(ctx.register(form_r3));
      });
      \u0275\u0275elementStart(15, "div", 17)(16, "p-input-group")(17, "p-inputgroup-addon");
      \u0275\u0275element(18, "i", 18);
      \u0275\u0275elementEnd();
      \u0275\u0275element(19, "input", 19, 1);
      \u0275\u0275template(21, RegisterComponent_Conditional_21_Template, 2, 0, "p-message", 20);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "p-input-group")(23, "p-inputgroup-addon");
      \u0275\u0275element(24, "i", 18);
      \u0275\u0275elementEnd();
      \u0275\u0275element(25, "input", 21, 2);
      \u0275\u0275template(27, RegisterComponent_Conditional_27_Template, 2, 0, "p-message", 20);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "p-input-group")(29, "p-inputgroup-addon");
      \u0275\u0275element(30, "i", 22);
      \u0275\u0275elementEnd();
      \u0275\u0275element(31, "input", 23, 3);
      \u0275\u0275template(33, RegisterComponent_Conditional_33_Template, 2, 0, "p-message", 20)(34, RegisterComponent_Conditional_34_Template, 2, 0, "p-message", 20);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(35, "p-inputGroup")(36, "p-inputGroupAddon");
      \u0275\u0275element(37, "i", 18);
      \u0275\u0275elementEnd();
      \u0275\u0275element(38, "input", 24, 4);
      \u0275\u0275template(40, RegisterComponent_Conditional_40_Template, 2, 0, "p-message", 25)(41, RegisterComponent_Conditional_41_Template, 2, 0, "p-message", 25);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(42, "p-input-group")(43, "p-inputgroup-addon");
      \u0275\u0275element(44, "i", 26);
      \u0275\u0275elementEnd();
      \u0275\u0275element(45, "input", 27, 5);
      \u0275\u0275template(47, RegisterComponent_Conditional_47_Template, 2, 0, "p-message", 25)(48, RegisterComponent_Conditional_48_Template, 2, 0, "p-message", 25);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(49, "div");
      \u0275\u0275element(50, "button", 28);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(51, "div");
      \u0275\u0275element(52, "a", 29);
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(53, "div", 30);
      \u0275\u0275element(54, "img", 31);
      \u0275\u0275elementEnd()();
      \u0275\u0275element(55, "p-toast")(56, "app-configurator", 32);
    }
    if (rf & 2) {
      const form_r3 = \u0275\u0275reference(14);
      const firstName_r4 = \u0275\u0275reference(20);
      const lastName_r5 = \u0275\u0275reference(26);
      const email_r6 = \u0275\u0275reference(32);
      const username_r7 = \u0275\u0275reference(39);
      const password_r8 = \u0275\u0275reference(46);
      \u0275\u0275advance(11);
      \u0275\u0275conditional(ctx.state().message ? 11 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.state().error ? 12 : -1);
      \u0275\u0275advance(9);
      \u0275\u0275conditional(firstName_r4.invalid && firstName_r4.touched && firstName_r4.invalid ? 21 : -1);
      \u0275\u0275advance(6);
      \u0275\u0275conditional(lastName_r5.invalid && lastName_r5.touched && lastName_r5.invalid ? 27 : -1);
      \u0275\u0275advance(6);
      \u0275\u0275conditional(email_r6.invalid && email_r6.touched && email_r6.invalid && (email_r6.errors == null ? null : email_r6.errors["required"]) ? 33 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(email_r6.invalid && email_r6.touched && email_r6.invalid && (email_r6.errors == null ? null : email_r6.errors["email"]) ? 34 : -1);
      \u0275\u0275advance(6);
      \u0275\u0275conditional(username_r7.invalid && username_r7.touched && (username_r7.errors == null ? null : username_r7.errors["pattern"]) ? 40 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(username_r7.invalid && username_r7.touched && (username_r7.errors == null ? null : username_r7.errors["required"]) ? 41 : -1);
      \u0275\u0275advance(6);
      \u0275\u0275conditional(password_r8.invalid && password_r8.touched && (password_r8.errors == null ? null : password_r8.errors["required"]) ? 47 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(password_r8.invalid && password_r8.touched && (password_r8.errors == null ? null : password_r8.errors["minlength"]) ? 48 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", form_r3.invalid || ctx.state().loading);
      \u0275\u0275advance(3);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(13, _c0));
    }
  }, dependencies: [ButtonModule, ButtonDirective, RouterModule, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MinLengthValidator, PatternValidator, EmailValidator, NgModel, NgForm, InputText, Ripple, AppConfigurator, InputGroupModule, InputGroup, InputGroupAddonModule, InputGroupAddon, InputNumberModule, MessageModule, Message, ToastModule, Toast], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RegisterComponent, { className: "RegisterComponent", filePath: "src/app/pages/auth/register/register.component.ts", lineNumber: 25 });
})();
export {
  RegisterComponent
};
//# sourceMappingURL=chunk-AQGRFLEP.js.map
