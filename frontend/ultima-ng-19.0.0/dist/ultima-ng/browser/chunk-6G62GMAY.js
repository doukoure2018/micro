import {
  getFormData
} from "./chunk-4JF3UP6R.js";
import {
  Topbar
} from "./chunk-GHORVA4J.js";
import {
  InputGroupAddon,
  InputGroupAddonModule
} from "./chunk-7A3QEVK3.js";
import {
  Menu,
  MenuModule
} from "./chunk-RKCUEC6H.js";
import {
  InputGroup,
  InputGroupModule
} from "./chunk-GEBY3FYZ.js";
import {
  Message,
  MessageModule
} from "./chunk-CSEZIGTY.js";
import {
  Dialog,
  DialogModule
} from "./chunk-LPU4RT7P.js";
import "./chunk-WWXP2HWK.js";
import "./chunk-CXW3XKZ2.js";
import "./chunk-CFS3J3Q2.js";
import {
  Toast,
  ToastModule
} from "./chunk-6SRYYUT2.js";
import {
  DropdownModule
} from "./chunk-ZCIQCP6V.js";
import "./chunk-V6CKOH3G.js";
import "./chunk-DBPX6ILC.js";
import {
  IconFieldModule,
  InputIconModule
} from "./chunk-WIQZFAVH.js";
import "./chunk-CCBQFN2J.js";
import {
  ProgressSpinner,
  ProgressSpinnerModule
} from "./chunk-Y2J5OGKB.js";
import {
  ActivatedRoute,
  Router,
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
  RequiredValidator,
  ɵNgNoValidate
} from "./chunk-3HTR5OU7.js";
import {
  Key,
  StorageService,
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
  delay,
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
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// src/app/pages/home/home.component.ts
var _c0 = () => ({ "width": "5rem", "height": "5rem" });
var _c1 = () => ({ "background": "white", "color": "#10b981", "border": "none", "border-radius": "1.5rem" });
var _c2 = () => ({ width: "500px" });
var _c3 = () => ({ "background-color": "#059669", "border-color": "#059669" });
function HomeComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "div", 9);
    \u0275\u0275element(2, "p-progress-spinner", 10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h2", 11);
    \u0275\u0275text(4, "V\xE9rification du compte ...");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 12);
    \u0275\u0275text(6, "Veuillez patienter pendant que nous v\xE9rifions vos identifiants. ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(2, _c0));
  }
}
function HomeComponent_Conditional_1_Conditional_93_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 53);
    \u0275\u0275element(1, "p-message", 71);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("text", ctx_r2.personnelState().message);
  }
}
function HomeComponent_Conditional_1_Conditional_94_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 53);
    \u0275\u0275element(1, "p-message", 72);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("text", ctx_r2.personnelState().error);
  }
}
function HomeComponent_Conditional_1_Conditional_102_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 57);
    \u0275\u0275text(1, "Le matricule est obligatoire");
    \u0275\u0275elementEnd();
  }
}
function HomeComponent_Conditional_1_Conditional_108_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 57);
    \u0275\u0275text(1, "Le pr\xE9nom est obligatoire");
    \u0275\u0275elementEnd();
  }
}
function HomeComponent_Conditional_1_Conditional_114_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 57);
    \u0275\u0275text(1, "Le nom est obligatoire");
    \u0275\u0275elementEnd();
  }
}
function HomeComponent_Conditional_1_Conditional_120_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 57);
    \u0275\u0275text(1, "L'email est obligatoire");
    \u0275\u0275elementEnd();
  }
}
function HomeComponent_Conditional_1_Conditional_121_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 57);
    \u0275\u0275text(1, "Format d'email invalide");
    \u0275\u0275elementEnd();
  }
}
function HomeComponent_Conditional_1_Conditional_132_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 57);
    \u0275\u0275text(1, "Le mot de passe est obligatoire");
    \u0275\u0275elementEnd();
  }
}
function HomeComponent_Conditional_1_Conditional_133_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 57);
    \u0275\u0275text(1, "Le mot de passe doit contenir au moins 6 caract\xE8res");
    \u0275\u0275elementEnd();
  }
}
function HomeComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 13);
    \u0275\u0275element(1, "topbar");
    \u0275\u0275elementStart(2, "div", 14)(3, "div", 15)(4, "div", 16)(5, "div", 17);
    \u0275\u0275element(6, "br")(7, "br")(8, "br");
    \u0275\u0275elementStart(9, "div", 18)(10, "div", 19)(11, "div", 20);
    \u0275\u0275element(12, "i", 21);
    \u0275\u0275elementStart(13, "h3", 22);
    \u0275\u0275text(14, "GESTION ECREDIT");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "p", 23);
    \u0275\u0275text(16, " Faire une nouvelle demande de Cr\xE9dit ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 24)(18, "p-button", 25);
    \u0275\u0275listener("click", function HomeComponent_Conditional_1_Template_p_button_click_18_listener($event) {
      \u0275\u0275restoreView(_r1);
      const demandesMenu_r2 = \u0275\u0275reference(20);
      return \u0275\u0275resetView(demandesMenu_r2.toggle($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(19, "p-menu", 26, 0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div", 27)(22, "div", 20);
    \u0275\u0275element(23, "i", 28);
    \u0275\u0275elementStart(24, "h3", 22)(25, "strong");
    \u0275\u0275text(26, "GESTION RECLAMATIONS");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(27, "p", 29);
    \u0275\u0275text(28, " Gestion des r\xE9clamations et incidents ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "button", 30);
    \u0275\u0275text(30, " Acceder ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div", 31);
    \u0275\u0275element(32, "i", 32);
    \u0275\u0275elementStart(33, "span");
    \u0275\u0275text(34, "En cours");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(35, "div", 33)(36, "div", 20);
    \u0275\u0275element(37, "i", 34);
    \u0275\u0275elementStart(38, "h3", 22)(39, "strong");
    \u0275\u0275text(40, "ESOCIETARIAT");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(41, "p", 35);
    \u0275\u0275text(42, " Gestion pour l'assainissement du soci\xE9tariat ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "button", 36);
    \u0275\u0275text(44, " Acceder ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "div", 31);
    \u0275\u0275element(46, "i", 32);
    \u0275\u0275elementStart(47, "span");
    \u0275\u0275text(48, "En cours");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(49, "div", 37)(50, "div", 20);
    \u0275\u0275element(51, "i", 38);
    \u0275\u0275elementStart(52, "h3", 22)(53, "strong");
    \u0275\u0275text(54, "GESTION ARRETE DE CAISSE");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(55, "p", 39);
    \u0275\u0275text(56, " Gestion pour la remont\xE9e des arr\xEAt\xE9s de caisse ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "button", 40);
    \u0275\u0275text(58, " Acceder ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(59, "div", 31);
    \u0275\u0275element(60, "i", 32);
    \u0275\u0275elementStart(61, "span");
    \u0275\u0275text(62, "En cours");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(63, "div", 41);
    \u0275\u0275listener("click", function HomeComponent_Conditional_1_Template_div_click_63_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.openPersonnelDialog());
    });
    \u0275\u0275elementStart(64, "div", 20);
    \u0275\u0275element(65, "i", 42);
    \u0275\u0275elementStart(66, "h3", 22)(67, "strong");
    \u0275\u0275text(68, "GESTION DU PERSONNEL");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(69, "p", 43);
    \u0275\u0275text(70, " Gestion avance salaire et des t\xE2cherons ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(71, "button", 44);
    \u0275\u0275text(72, " Souscrire ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(73, "div", 45);
    \u0275\u0275element(74, "i", 46);
    \u0275\u0275elementStart(75, "span");
    \u0275\u0275text(76, "Disponible");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(77, "div", 47)(78, "div", 20);
    \u0275\u0275element(79, "i", 48);
    \u0275\u0275elementStart(80, "h3", 22)(81, "strong");
    \u0275\u0275text(82, "DIGI-MAP");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(83, "p", 49);
    \u0275\u0275text(84, " G\xE9olocalisation de nos points de services ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(85, "button", 50);
    \u0275\u0275text(86, " Acceder ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(87, "div", 31);
    \u0275\u0275element(88, "i", 32);
    \u0275\u0275elementStart(89, "span");
    \u0275\u0275text(90, "En cours");
    \u0275\u0275elementEnd()()()()()()()()();
    \u0275\u0275elementStart(91, "p-dialog", 51);
    \u0275\u0275twoWayListener("visibleChange", function HomeComponent_Conditional_1_Template_p_dialog_visibleChange_91_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.showPersonnelDialog, $event) || (ctx_r2.showPersonnelDialog = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(92, "div", 52);
    \u0275\u0275template(93, HomeComponent_Conditional_1_Conditional_93_Template, 2, 1, "div", 53)(94, HomeComponent_Conditional_1_Conditional_94_Template, 2, 1, "div", 53);
    \u0275\u0275elementStart(95, "form", 54, 1);
    \u0275\u0275listener("ngSubmit", function HomeComponent_Conditional_1_Template_form_ngSubmit_95_listener() {
      \u0275\u0275restoreView(_r1);
      const personnelForm_r4 = \u0275\u0275reference(96);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.registerPersonnel(personnelForm_r4));
    });
    \u0275\u0275elementStart(97, "p-input-group")(98, "p-inputgroup-addon");
    \u0275\u0275element(99, "i", 55);
    \u0275\u0275elementEnd();
    \u0275\u0275element(100, "input", 56, 2);
    \u0275\u0275elementEnd();
    \u0275\u0275template(102, HomeComponent_Conditional_1_Conditional_102_Template, 2, 0, "small", 57);
    \u0275\u0275elementStart(103, "p-input-group")(104, "p-inputgroup-addon");
    \u0275\u0275element(105, "i", 58);
    \u0275\u0275elementEnd();
    \u0275\u0275element(106, "input", 59, 3);
    \u0275\u0275elementEnd();
    \u0275\u0275template(108, HomeComponent_Conditional_1_Conditional_108_Template, 2, 0, "small", 57);
    \u0275\u0275elementStart(109, "p-input-group")(110, "p-inputgroup-addon");
    \u0275\u0275element(111, "i", 58);
    \u0275\u0275elementEnd();
    \u0275\u0275element(112, "input", 60, 4);
    \u0275\u0275elementEnd();
    \u0275\u0275template(114, HomeComponent_Conditional_1_Conditional_114_Template, 2, 0, "small", 57);
    \u0275\u0275elementStart(115, "p-input-group")(116, "p-inputgroup-addon");
    \u0275\u0275element(117, "i", 61);
    \u0275\u0275elementEnd();
    \u0275\u0275element(118, "input", 62, 5);
    \u0275\u0275elementEnd();
    \u0275\u0275template(120, HomeComponent_Conditional_1_Conditional_120_Template, 2, 0, "small", 57)(121, HomeComponent_Conditional_1_Conditional_121_Template, 2, 0, "small", 57);
    \u0275\u0275elementStart(122, "p-input-group")(123, "p-inputgroup-addon");
    \u0275\u0275element(124, "i", 63);
    \u0275\u0275elementEnd();
    \u0275\u0275element(125, "input", 64, 6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(127, "p-input-group")(128, "p-inputgroup-addon");
    \u0275\u0275element(129, "i", 65);
    \u0275\u0275elementEnd();
    \u0275\u0275element(130, "input", 66, 7);
    \u0275\u0275elementEnd();
    \u0275\u0275template(132, HomeComponent_Conditional_1_Conditional_132_Template, 2, 0, "small", 57)(133, HomeComponent_Conditional_1_Conditional_133_Template, 2, 0, "small", 57);
    \u0275\u0275elementStart(134, "div", 67);
    \u0275\u0275element(135, "i", 32);
    \u0275\u0275elementStart(136, "span");
    \u0275\u0275text(137, "Le nom d'utilisateur sera g\xE9n\xE9r\xE9 automatiquement \xE0 partir de votre pr\xE9nom et nom.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(138, "div", 68)(139, "p-button", 69);
    \u0275\u0275listener("onClick", function HomeComponent_Conditional_1_Template_p_button_onClick_139_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.closePersonnelDialog());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(140, "p-button", 70);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275element(141, "p-toast");
  }
  if (rf & 2) {
    const personnelForm_r4 = \u0275\u0275reference(96);
    const matricule_r5 = \u0275\u0275reference(101);
    const firstName_r6 = \u0275\u0275reference(107);
    const lastName_r7 = \u0275\u0275reference(113);
    const email_r8 = \u0275\u0275reference(119);
    const password_r9 = \u0275\u0275reference(131);
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(18);
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(24, _c1));
    \u0275\u0275advance();
    \u0275\u0275property("model", ctx_r2.demandesItems)("popup", true);
    \u0275\u0275advance(72);
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(25, _c2));
    \u0275\u0275twoWayProperty("visible", ctx_r2.showPersonnelDialog);
    \u0275\u0275property("modal", true)("closable", true)("draggable", false);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.personnelState().message ? 93 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.personnelState().error ? 94 : -1);
    \u0275\u0275advance(8);
    \u0275\u0275conditional(matricule_r5.invalid && matricule_r5.touched ? 102 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(firstName_r6.invalid && firstName_r6.touched ? 108 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(lastName_r7.invalid && lastName_r7.touched ? 114 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(email_r8.invalid && email_r8.touched && (email_r8.errors == null ? null : email_r8.errors["required"]) ? 120 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(email_r8.invalid && email_r8.touched && (email_r8.errors == null ? null : email_r8.errors["email"]) ? 121 : -1);
    \u0275\u0275advance(11);
    \u0275\u0275conditional(password_r9.invalid && password_r9.touched && (password_r9.errors == null ? null : password_r9.errors["required"]) ? 132 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(password_r9.invalid && password_r9.touched && (password_r9.errors == null ? null : password_r9.errors["minlength"]) ? 133 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275property("outlined", true);
    \u0275\u0275advance();
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(26, _c3));
    \u0275\u0275property("loading", ctx_r2.personnelState().loading)("disabled", personnelForm_r4.invalid || ctx_r2.personnelState().loading);
  }
}
var HomeComponent = class _HomeComponent {
  loading = signal(true);
  isAuthenticatedAndRedirecting = signal(false);
  // Dialog Personnel
  showPersonnelDialog = signal(false);
  personnelState = signal({
    loading: false,
    message: void 0,
    error: void 0
  });
  destroyRef = inject(DestroyRef);
  router = inject(Router);
  storage = inject(StorageService);
  userService = inject(UserService);
  activatedRoute = inject(ActivatedRoute);
  messageService = inject(MessageService);
  redirectBaseUrl = environment.redirectUri;
  ngOnInit() {
    if (this.userService.isAuthenticated() && !this.userService.isTokenExpired()) {
      this.isAuthenticatedAndRedirecting.set(true);
      console.log("User is authenticated and redirecting...");
      const redirectUrl = this.storage.getRedirectUrl() || "/dashboards";
      this.router.navigate([redirectUrl]);
      return;
    }
    this.activatedRoute.queryParamMap.pipe(switchMap((params) => {
      const code = params.get("code");
      console.log("OAuth callback received with code:", code);
      if (code) {
        this.loading.set(true);
        return this.userService.validateCode$(this.formData(code));
      } else {
        this.loading.set(false);
        return EMPTY;
      }
    }), delay(1e3), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        console.log("Authentication successful:", response);
        this.saveToken(response);
        setTimeout(() => {
          this.isAuthenticatedAndRedirecting.set(true);
          const redirectUrl = this.storage.getRedirectUrl() || "/dashboards";
          this.router.navigate([redirectUrl]);
        }, 100);
      },
      error: (error) => {
        console.error("Authentication error:", error);
        this.loading.set(false);
        this.isAuthenticatedAndRedirecting.set(false);
        this.messageService.add({
          severity: "error",
          summary: "Authentication Failed",
          detail: typeof error === "string" ? error : "Please try again"
        });
      },
      complete: () => console.log("Authentication complete")
    });
  }
  formData = (code) => getFormData({
    code,
    client_id: "client",
    grant_type: "authorization_code",
    redirect_uri: this.redirectBaseUrl,
    code_verifier: "FyMQLDjN4mjiAY7O4fva2ZlxPZV9U_TU4GcdI5WSSufPBvH2ckvPWr3n3n-lWfwXSucLUSWimUqUc-_7Jmdk6ogzM2QDiSsMbY8UpBA1MEQbNteuXjWtW0psB1hPA_ED"
  });
  saveToken = (response) => {
    console.log("\u{1F4BE} Sauvegarde des tokens:");
    console.log("Access Token:", response.access_token?.substring(0, 50) + "...");
    console.log("Refresh Token:", response.refresh_token?.substring(0, 50) + "...");
    this.storage.set(Key.TOKEN, response.access_token);
    this.storage.set(Key.REFRESH_TOKEN, response.refresh_token || response.access_token);
    const savedToken = this.storage.get(Key.TOKEN);
    console.log("\u2705 Token sauvegard\xE9 et v\xE9rifi\xE9:", savedToken ? "Oui" : "Non");
  };
  // Ajoutez les autres méthodes si elles sont utilisées dans le template
  demandesItems = [
    {
      label: "Demande de Cr\xE9dit Individuel",
      icon: "pi pi-plus",
      command: () => this.navigateToNewDemande()
    },
    {
      label: "Demande de Cr\xE9dit Groupe",
      icon: "pi pi-list",
      command: () => this.navigateToMyDemandes()
    }
  ];
  navigateToNewDemande() {
    this.router.navigate(["/auth/credit/demandeInd"]);
  }
  navigateToMyDemandes() {
  }
  // ==================== GESTION DU PERSONNEL ====================
  openPersonnelDialog() {
    this.showPersonnelDialog.set(true);
    this.personnelState.set({ loading: false, message: void 0, error: void 0 });
  }
  closePersonnelDialog() {
    this.showPersonnelDialog.set(false);
    this.personnelState.set({ loading: false, message: void 0, error: void 0 });
  }
  registerPersonnel(form) {
    if (form.invalid) {
      this.messageService.add({
        severity: "warn",
        summary: "Attention",
        detail: "Veuillez remplir tous les champs obligatoires"
      });
      return;
    }
    this.personnelState.set({ loading: true, message: void 0, error: void 0 });
    const formData = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password,
      matricule: form.value.matricule,
      phone: form.value.phone
      // Le username sera généré automatiquement par le backend
      // Le service sera automatiquement défini à 'Personnel' par le backend
    };
    this.userService.register$(formData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.personnelState.set({ loading: false, message: response.message, error: void 0 });
        this.messageService.add({
          severity: "success",
          summary: "Succ\xE8s",
          detail: response.message || "Compte cr\xE9\xE9 avec succ\xE8s. V\xE9rifiez votre email pour activer votre compte."
        });
        setTimeout(() => {
          this.closePersonnelDialog();
          form.reset();
        }, 3e3);
      },
      error: (error) => {
        this.personnelState.set({ loading: false, message: void 0, error });
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: error || "Une erreur est survenue lors de la cr\xE9ation du compte"
        });
      }
    });
  }
  static \u0275fac = function HomeComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HomeComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _HomeComponent, selectors: [["app-home"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 2, vars: 1, consts: [["demandesMenu", ""], ["personnelForm", "ngForm"], ["matricule", "ngModel"], ["firstName", "ngModel"], ["lastName", "ngModel"], ["email", "ngModel"], ["phone", "ngModel"], ["password", "ngModel"], [1, "text-center"], [1, "relative"], ["ariaLabel", "Verifying account", "strokeWidth", "4", "animationDuration", ".5s", 1, "text-primary"], [1, "text-2xl", "font-semibold", "mb-2"], [1, "text-surface-600", "dark:text-surface-300"], [1, "bg-surface-50", "dark:bg-surface-950"], [1, "h-screen"], [1, "h-screen", "overflow-x-hidden", "overflow-y-auto", "absolute", "top-0", "left-0", "right-0", "bottom-0", 2, "perspective", "101px"], ["id", "parallaxBody", 1, "lg:top-0", "block", "absolute", "left-0", "right-0", "h-full", "z-20"], [1, "card"], [1, "grid", "grid-cols-12", "gap-6", "mb-8", "max-w-7xl", "mx-auto", "px-4"], [1, "col-span-12", "md:col-span-4", "bg-green-500", "rounded-2xl", "p-8", "text-white", "shadow-lg", "hover:shadow-xl", "transition-all", "duration-300", "hover:-translate-y-1", "cursor-pointer"], [1, "flex", "items-center", "mb-6"], [1, "pi", "pi-credit-card", "text-3xl", "mr-4"], [1, "text-xl", "font-bold"], [1, "text-green-100", "mb-6", "text-sm", "leading-relaxed"], [1, "flex", "gap-4"], ["label", "Demandes", "icon", "pi pi-chevron-down", "iconPos", "right", 1, "p-button-sm", 3, "click"], [3, "model", "popup"], [1, "col-span-12", "md:col-span-4", "bg-orange-500", "rounded-2xl", "p-8", "text-white", "shadow-lg", "hover:shadow-xl", "transition-all", "duration-300", "hover:-translate-y-1", "cursor-pointer"], [1, "pi", "pi-headphones", "text-3xl", "mr-4"], [1, "text-orange-100", "mb-6", "text-sm", "leading-relaxed"], [1, "bg-white", "text-orange-500", "px-6", "py-2", "rounded-full", "font-medium", "hover:bg-gray-100", "transition-colors"], [1, "mt-4", "flex", "items-center", "text-orange-200", "font-semibold"], [1, "pi", "pi-info-circle", "mr-2"], [1, "col-span-12", "md:col-span-4", "bg-cyan-600", "rounded-2xl", "p-8", "text-white", "shadow-lg", "hover:shadow-xl", "transition-all", "duration-300", "hover:-translate-y-1", "cursor-pointer"], [1, "pi", "pi-users", "text-3xl", "mr-4"], [1, "text-cyan-100", "mb-6", "text-sm", "leading-relaxed"], [1, "bg-gray-800", "text-white", "px-6", "py-2", "rounded-full", "font-medium", "hover:bg-gray-700", "transition-colors"], [1, "col-span-12", "md:col-span-4", "rounded-2xl", "p-8", "text-white", "shadow-lg", "hover:shadow-xl", "transition-all", "duration-300", "hover:-translate-y-1", "cursor-pointer", 2, "background-color", "#7c3aed"], [1, "pi", "pi-video", "text-3xl", "mr-4"], [1, "mb-6", "text-sm", "leading-relaxed", 2, "color", "#ddd6fe"], [1, "bg-white", "px-6", "py-2", "rounded-full", "font-medium", "hover:bg-gray-100", "transition-colors", 2, "color", "#7c3aed"], [1, "col-span-12", "md:col-span-4", "rounded-2xl", "p-8", "text-white", "shadow-lg", "hover:shadow-xl", "transition-all", "duration-300", "hover:-translate-y-1", "cursor-pointer", 2, "background-color", "#059669", 3, "click"], [1, "pi", "pi-user-plus", "text-3xl", "mr-4"], [1, "mb-6", "text-sm", "leading-relaxed", 2, "color", "#d1fae5"], [1, "bg-white", "px-6", "py-2", "rounded-full", "font-medium", "hover:bg-gray-100", "transition-colors", 2, "color", "#059669"], [1, "mt-4", "flex", "items-center", 2, "color", "#d1fae5"], [1, "pi", "pi-check-circle", "mr-2"], [1, "col-span-12", "md:col-span-4", "bg-gray-900", "rounded-2xl", "p-8", "text-white", "shadow-lg", "hover:shadow-xl", "transition-all", "duration-300", "hover:-translate-y-1", "cursor-pointer"], [1, "pi", "pi-bars", "text-3xl", "mr-4"], [1, "text-gray-300", "mb-6", "text-sm", "leading-relaxed"], [1, "bg-cyan-500", "text-white", "px-6", "py-2", "rounded-full", "font-medium", "hover:bg-cyan-400", "transition-colors"], ["header", "Inscription Personnel", "styleClass", "personnel-dialog", 3, "visibleChange", "visible", "modal", "closable", "draggable"], [1, "p-4"], [1, "mb-4"], [1, "flex", "flex-col", "gap-4", 3, "ngSubmit"], [1, "pi", "pi-id-card"], ["pInputText", "", "name", "matricule", "ngModel", "", "placeholder", "Matricule *", "required", ""], [1, "text-red-500"], [1, "pi", "pi-user"], ["pInputText", "", "name", "firstName", "ngModel", "", "placeholder", "Pr\xE9nom *", "required", ""], ["pInputText", "", "name", "lastName", "ngModel", "", "placeholder", "Nom *", "required", ""], [1, "pi", "pi-envelope"], ["pInputText", "", "name", "email", "ngModel", "", "placeholder", "Email *", "required", "", "email", "", "type", "email"], [1, "pi", "pi-phone"], ["pInputText", "", "name", "phone", "ngModel", "", "placeholder", "T\xE9l\xE9phone"], [1, "pi", "pi-lock"], ["pInputText", "", "name", "password", "ngModel", "", "type", "password", "placeholder", "Mot de passe *", "required", "", "minlength", "6"], [1, "bg-blue-50", "p-3", "rounded-lg", "text-sm", "text-blue-700"], [1, "flex", "justify-end", "gap-3", "mt-4"], ["label", "Annuler", "icon", "pi pi-times", "severity", "secondary", 3, "onClick", "outlined"], ["type", "submit", "label", "S'inscrire", "icon", "pi pi-check", 3, "loading", "disabled"], ["severity", "success", 3, "text"], ["severity", "error", 3, "text"]], template: function HomeComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, HomeComponent_Conditional_0_Template, 7, 3, "div", 8)(1, HomeComponent_Conditional_1_Template, 142, 27);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.loading() || ctx.isAuthenticatedAndRedirecting() ? 0 : 1);
    }
  }, dependencies: [ProgressSpinnerModule, ProgressSpinner, RouterModule, IconFieldModule, InputIconModule, InputTextModule, InputText, Topbar, DropdownModule, ButtonModule, Button, MenuModule, Menu, DialogModule, Dialog, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MinLengthValidator, EmailValidator, NgModel, NgForm, InputGroupModule, InputGroup, InputGroupAddonModule, InputGroupAddon, MessageModule, Message, ToastModule, Toast], styles: ["\n\n[_ngcontent-%COMP%]::placeholder {\n  color: #fff;\n}\n  .custom-dropdown .p-dropdown {\n  border-radius: 1.5rem !important;\n  border: none !important;\n}\n  .custom-dropdown .p-dropdown-label {\n  color: #10b981 !important;\n  font-weight: 500 !important;\n}\n  .p-menu {\n  border-radius: 0.75rem !important;\n  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;\n}\n  .personnel-dialog .p-dialog-header {\n  background:\n    linear-gradient(\n      135deg,\n      #059669 0%,\n      #047857 100%);\n  color: white;\n}\n  .personnel-dialog .p-dialog-title {\n  color: white;\n}\n  .personnel-dialog input::placeholder {\n  color: #6b7280 !important;\n  opacity: 1 !important;\n  font-weight: 500 !important;\n}\n  .personnel-dialog .p-inputtext::placeholder {\n  color: #6b7280 !important;\n  opacity: 1 !important;\n  font-weight: 500 !important;\n}\n  .personnel-dialog input {\n  border: 1px solid #d1d5db !important;\n}\n  .personnel-dialog input:focus {\n  border-color: #059669 !important;\n  box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;\n}\n/*# sourceMappingURL=home.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(HomeComponent, { className: "HomeComponent", filePath: "src/app/pages/home/home.component.ts", lineNumber: 90 });
})();
export {
  HomeComponent
};
//# sourceMappingURL=chunk-6G62GMAY.js.map
