import {
  Password,
  PasswordModule
} from "./chunk-NBJHCGNS.js";
import {
  FileUploadModule
} from "./chunk-ZNXRKGHP.js";
import "./chunk-UZIOTGW7.js";
import {
  Textarea,
  TextareaModule
} from "./chunk-RW4OSSQT.js";
import {
  InputGroupModule
} from "./chunk-GEBY3FYZ.js";
import {
  Message,
  MessageModule
} from "./chunk-CSEZIGTY.js";
import "./chunk-WQ2EPPBK.js";
import "./chunk-OCW7T434.js";
import {
  Dropdown,
  DropdownModule
} from "./chunk-ZCIQCP6V.js";
import "./chunk-V6CKOH3G.js";
import "./chunk-DBPX6ILC.js";
import "./chunk-WIQZFAVH.js";
import "./chunk-CCBQFN2J.js";
import {
  ProgressSpinner,
  ProgressSpinnerModule
} from "./chunk-Y2J5OGKB.js";
import {
  Router
} from "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
import {
  takeUntilDestroyed
} from "./chunk-WRLBQDQK.js";
import {
  InputText
} from "./chunk-FZELBHWZ.js";
import "./chunk-4IUQ6KTI.js";
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
import {
  MessageService,
  PrimeTemplate
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
import {
  CommonModule,
  NgClass,
  NgIf
} from "./chunk-SQQPVFHK.js";
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
  ɵɵpureFunction1,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-ZKKMBKIA.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/pages/dashboard/admin/create-user/create-user.component.ts
var _c0 = () => [];
var _c1 = () => ({ width: "50px", height: "50px" });
var _c2 = (a0) => ({ "md:col-span-6": a0 });
function CreateUserComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275element(1, "p-progressSpinner");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(2, _c1));
  }
}
function CreateUserComponent_ng_template_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const role_r3 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(role_r3 == null ? null : role_r3.name);
  }
}
function CreateUserComponent_ng_template_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 43);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const role_r4 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(role_r4.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("(ID: ", role_r4.role_id, ")");
  }
}
function CreateUserComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 14);
  }
}
function CreateUserComponent_ng_template_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const service_r5 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(service_r5 == null ? null : service_r5.label);
  }
}
function CreateUserComponent_ng_template_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 43);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const service_r6 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(service_r6.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("(", service_r6.value, ")");
  }
}
function CreateUserComponent_Conditional_25_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const delegation_r9 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(delegation_r9 == null ? null : delegation_r9.libele);
  }
}
function CreateUserComponent_Conditional_25_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 43);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const delegation_r10 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(delegation_r10.libele);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("(ID: ", delegation_r10.id, ")");
  }
}
function CreateUserComponent_Conditional_25_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 47);
  }
}
function CreateUserComponent_Conditional_25_Conditional_7_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const agence_r12 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(agence_r12 == null ? null : agence_r12.libele);
  }
}
function CreateUserComponent_Conditional_25_Conditional_7_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 43);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const agence_r13 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(agence_r13.libele);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("(ID: ", agence_r13.id, ")");
  }
}
function CreateUserComponent_Conditional_25_Conditional_7_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 50);
  }
}
function CreateUserComponent_Conditional_25_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 9)(1, "label", 48);
    \u0275\u0275text(2, " Agence * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p-dropdown", 49);
    \u0275\u0275twoWayListener("ngModelChange", function CreateUserComponent_Conditional_25_Conditional_7_Template_p_dropdown_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r7 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r7.selectedAgence, $event) || (ctx_r7.selectedAgence = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("onChange", function CreateUserComponent_Conditional_25_Conditional_7_Template_p_dropdown_onChange_3_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r7 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r7.onAgenceChange($event.value));
    });
    \u0275\u0275template(4, CreateUserComponent_Conditional_25_Conditional_7_ng_template_4_Template, 3, 1, "ng-template", 12)(5, CreateUserComponent_Conditional_25_Conditional_7_ng_template_5_Template, 5, 2, "ng-template", 13);
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, CreateUserComponent_Conditional_25_Conditional_7_Conditional_6_Template, 1, 0, "p-message", 50);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r7 = \u0275\u0275nextContext(2);
    const userForm_r2 = \u0275\u0275reference(10);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r7.selectedAgence);
    \u0275\u0275property("options", ctx_r7.state().agences || \u0275\u0275pureFunction0(7, _c0))("filter", true)("showClear", true)("disabled", ctx_r7.state().submitting || ctx_r7.state().loadingAgences || !ctx_r7.state().selectedDelegationId)("loading", ctx_r7.state().loadingAgences);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(userForm_r2.controls && userForm_r2.controls["agence"] && userForm_r2.controls["agence"].invalid && userForm_r2.controls["agence"].touched ? 6 : -1);
  }
}
function CreateUserComponent_Conditional_25_Conditional_8_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 52);
    \u0275\u0275text(1, "(Requis pour AGENT_CORRECTEUR)");
    \u0275\u0275elementEnd();
  }
}
function CreateUserComponent_Conditional_25_Conditional_8_ng_template_5_span_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 43);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const pointVente_r15 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("(", pointVente_r15.code, ")");
  }
}
function CreateUserComponent_Conditional_25_Conditional_8_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, CreateUserComponent_Conditional_25_Conditional_8_ng_template_5_span_3_Template, 2, 1, "span", 55);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const pointVente_r15 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(pointVente_r15 == null ? null : pointVente_r15.libele);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", pointVente_r15 == null ? null : pointVente_r15.code);
  }
}
function CreateUserComponent_Conditional_25_Conditional_8_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 43);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const pointVente_r16 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(pointVente_r16.libele);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("(", pointVente_r16.code, " - ID: ", pointVente_r16.id, ")");
  }
}
function CreateUserComponent_Conditional_25_Conditional_8_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 54);
  }
}
function CreateUserComponent_Conditional_25_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 17)(1, "label", 51);
    \u0275\u0275text(2, " Point de Vente * ");
    \u0275\u0275template(3, CreateUserComponent_Conditional_25_Conditional_8_Conditional_3_Template, 2, 0, "span", 52);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p-dropdown", 53);
    \u0275\u0275twoWayListener("ngModelChange", function CreateUserComponent_Conditional_25_Conditional_8_Template_p_dropdown_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r7 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r7.selectedPointVente, $event) || (ctx_r7.selectedPointVente = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("onChange", function CreateUserComponent_Conditional_25_Conditional_8_Template_p_dropdown_onChange_4_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r7 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r7.onPointVenteChange($event.value));
    });
    \u0275\u0275template(5, CreateUserComponent_Conditional_25_Conditional_8_ng_template_5_Template, 4, 2, "ng-template", 12)(6, CreateUserComponent_Conditional_25_Conditional_8_ng_template_6_Template, 5, 3, "ng-template", 13);
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, CreateUserComponent_Conditional_25_Conditional_8_Conditional_7_Template, 1, 0, "p-message", 54);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r7 = \u0275\u0275nextContext(2);
    const userForm_r2 = \u0275\u0275reference(10);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(((tmp_3_0 = ctx_r7.state().selectedRole) == null ? null : tmp_3_0.name) === "AGENT_CORRECTEUR" ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r7.selectedPointVente);
    \u0275\u0275property("options", ctx_r7.state().pointVentes || \u0275\u0275pureFunction0(8, _c0))("filter", true)("showClear", true)("disabled", ctx_r7.state().submitting || ctx_r7.state().loadingPointVentes || !ctx_r7.state().selectedAgenceId)("loading", ctx_r7.state().loadingPointVentes);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(userForm_r2.controls && userForm_r2.controls["pointVente"] && userForm_r2.controls["pointVente"].invalid && userForm_r2.controls["pointVente"].touched ? 7 : -1);
  }
}
function CreateUserComponent_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 44)(1, "label", 45);
    \u0275\u0275text(2, " D\xE9l\xE9gation * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p-dropdown", 46);
    \u0275\u0275twoWayListener("ngModelChange", function CreateUserComponent_Conditional_25_Template_p_dropdown_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r7 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r7.selectedDelegation, $event) || (ctx_r7.selectedDelegation = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("onChange", function CreateUserComponent_Conditional_25_Template_p_dropdown_onChange_3_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r7 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r7.onDelegationChange($event.value));
    });
    \u0275\u0275template(4, CreateUserComponent_Conditional_25_ng_template_4_Template, 3, 1, "ng-template", 12)(5, CreateUserComponent_Conditional_25_ng_template_5_Template, 5, 2, "ng-template", 13);
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, CreateUserComponent_Conditional_25_Conditional_6_Template, 1, 0, "p-message", 47);
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, CreateUserComponent_Conditional_25_Conditional_7_Template, 7, 8, "div", 9)(8, CreateUserComponent_Conditional_25_Conditional_8_Template, 8, 9, "div", 17);
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_10_0;
    let tmp_11_0;
    const ctx_r7 = \u0275\u0275nextContext();
    const userForm_r2 = \u0275\u0275reference(10);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(10, _c2, ctx_r7.shouldShowAgenceField((tmp_2_0 = ctx_r7.state().selectedRole) == null ? null : tmp_2_0.name)));
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r7.selectedDelegation);
    \u0275\u0275property("options", ctx_r7.state().delegations || \u0275\u0275pureFunction0(12, _c0))("filter", true)("showClear", true)("disabled", ctx_r7.state().submitting || ctx_r7.state().loadingDelegations)("loading", ctx_r7.state().loadingDelegations);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(userForm_r2.controls && userForm_r2.controls["delegation"] && userForm_r2.controls["delegation"].invalid && userForm_r2.controls["delegation"].touched ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r7.shouldShowAgenceField((tmp_10_0 = ctx_r7.state().selectedRole) == null ? null : tmp_10_0.name) ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r7.shouldShowPointVenteField((tmp_11_0 = ctx_r7.state().selectedRole) == null ? null : tmp_11_0.name) ? 8 : -1);
  }
}
function CreateUserComponent_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 20);
  }
}
function CreateUserComponent_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 23);
  }
}
function CreateUserComponent_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 26);
  }
}
function CreateUserComponent_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 29);
  }
}
function CreateUserComponent_Conditional_54_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 34);
  }
}
function CreateUserComponent_Conditional_63_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 41)(1, "p")(2, "strong");
    \u0275\u0275text(3, "Role s\xE9lectionn\xE9:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p")(6, "strong");
    \u0275\u0275text(7, "Service:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p")(10, "strong");
    \u0275\u0275text(11, "D\xE9l\xE9gation ID:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "p")(14, "strong");
    \u0275\u0275text(15, "Agence ID:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "p")(18, "strong");
    \u0275\u0275text(19, "Point Vente ID:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r7 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", (tmp_2_0 = ctx_r7.state().selectedRole) == null ? null : tmp_2_0.name, "");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r7.state().selectedServiceValue || "Non s\xE9lectionn\xE9", "");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r7.state().selectedDelegationId || "Non s\xE9lectionn\xE9", " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r7.state().selectedAgenceId || "Non s\xE9lectionn\xE9", "");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r7.state().selectedPointVenteId || "Non s\xE9lectionn\xE9", " ");
  }
}
var CreateUserComponent = class _CreateUserComponent {
  selectedDelegation = null;
  selectedAgence = null;
  selectedPointVente = null;
  selectedService = null;
  // Service options
  services = [
    { label: "Direction Syst\xE8me Information", value: "DSIG" },
    { label: "Direction Exploitation", value: "DE" },
    { label: "Direction Inspection", value: "DI" },
    { label: "Direction Financi\xE8re", value: "DF" },
    { label: "Direction Commerciale", value: "DC" },
    { label: "Direction Resource Humaine", value: "DRH" },
    { label: "Logistique", value: "Logistique" },
    { label: "Contr\xF4le", value: "Contr\xF4le" },
    { label: "Audit", value: "Audit" },
    { label: "Partenariat", value: "Partenariat" },
    { label: "Societariat", value: "Societariat" }
  ];
  state = signal({
    loading: false,
    submitting: false,
    loadingDelegations: false,
    loadingAgences: false,
    loadingPointVentes: false,
    message: void 0,
    error: void 0,
    selectedServiceValue: void 0
  });
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  userService = inject(UserService);
  messageService = inject(MessageService);
  ngOnInit() {
    this.loadRolesUsers();
  }
  loadRolesUsers() {
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { loading: true, message: void 0, error: void 0 }));
    this.userService.listRoles$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          loading: false,
          roles: response.data.roles,
          message: void 0,
          error: void 0
        }));
      },
      error: (error) => {
        console.error("Error loading roles:", error);
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          loading: false,
          roles: void 0,
          message: void 0,
          error
        }));
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load roles",
          life: 3e3
        });
      }
    });
  }
  // Handle service selection
  onServiceChange(service) {
    this.state.update((state) => __spreadProps(__spreadValues({}, state), {
      selectedServiceValue: service?.value
    }));
  }
  // Handle role selection change
  onRoleChange(selectedRole) {
    this.state.update((state) => __spreadProps(__spreadValues({}, state), {
      selectedRole,
      delegations: void 0,
      agences: void 0,
      pointVentes: void 0,
      selectedDelegationId: void 0,
      selectedAgenceId: void 0,
      selectedPointVenteId: void 0
    }));
    this.selectedDelegation = null;
    this.selectedAgence = null;
    this.selectedPointVente = null;
    if (this.shouldShowLocationFields(selectedRole.name)) {
      this.loadDelegations();
    }
  }
  /**
   * Validate email format - Version très flexible
   * Accepte tous les formats d'email valides incluant:
   * - Emails simples: nom@domain.com
   * - Emails avec points multiples: nom.prenom.service@domain.com
   * - Emails avec plusieurs niveaux: salifou.doukoure.manager.ra@creditruralgn.com
   * - Emails avec sous-domaines: nom@mail.domain.co.gn
   * - Emails avec caractères spéciaux autorisés: nom+tag@domain.com
   */
  validateEmail(email) {
    if (!email)
      return false;
    email = email.trim();
    const flexiblePattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const permissivePattern = /^.+@.+\..+$/;
    const professionalPattern = /^[a-zA-Z0-9]([a-zA-Z0-9._+-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
    return permissivePattern.test(email);
  }
  /**
   * Alternative: Validation email basique
   * Vérifie seulement la structure minimale d'un email
   */
  validateEmailBasic(email) {
    if (!email)
      return false;
    email = email.trim();
    const atCount = (email.match(/@/g) || []).length;
    if (atCount !== 1)
      return false;
    if (email.startsWith("@") || email.endsWith("@"))
      return false;
    const [localPart, domainPart] = email.split("@");
    if (!localPart || !domainPart)
      return false;
    if (!domainPart.includes("."))
      return false;
    if (domainPart.startsWith(".") || domainPart.endsWith("."))
      return false;
    const lastDotIndex = domainPart.lastIndexOf(".");
    const extension = domainPart.substring(lastDotIndex + 1);
    if (extension.length < 2)
      return false;
    return true;
  }
  // Check if form can be submitted
  canSubmitForm() {
    return true;
  }
  // Check if role requires location fields
  shouldShowLocationFields(roleName) {
    return roleName === "AGENT_CREDIT" || roleName === "CAISSE" || roleName === "AGENT_CORRECTEUR" || roleName === "DA" || roleName === "DR" || roleName === "RA";
  }
  // Check if role requires agence field
  shouldShowAgenceField(roleName) {
    return roleName === "AGENT_CREDIT" || roleName === "CAISSE" || roleName === "AGENT_CORRECTEUR" || roleName === "DA" || roleName === "RA";
  }
  // Check if role requires point vente field
  shouldShowPointVenteField(roleName) {
    return roleName === "AGENT_CREDIT" || roleName === "CAISSE" || roleName === "AGENT_CORRECTEUR";
  }
  // Load delegations
  loadDelegations() {
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { loadingDelegations: true }));
    this.userService.getAllDelegation$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          delegations: response.data?.delegations || response.data,
          loadingDelegations: false
        }));
      },
      error: (error) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { loadingDelegations: false }));
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load delegations"
        });
      }
    });
  }
  // Handle delegation selection
  onDelegationChange(delegation) {
    if (!delegation) {
      this.state.update((state) => __spreadProps(__spreadValues({}, state), {
        selectedDelegationId: void 0,
        agences: void 0,
        pointVentes: void 0,
        selectedAgenceId: void 0,
        selectedPointVenteId: void 0
      }));
      this.selectedAgence = null;
      this.selectedPointVente = null;
      return;
    }
    const delegationId = delegation.id;
    this.state.update((state) => __spreadProps(__spreadValues({}, state), {
      selectedDelegationId: delegationId,
      agences: void 0,
      pointVentes: void 0,
      selectedAgenceId: void 0,
      selectedPointVenteId: void 0
    }));
    this.selectedAgence = null;
    this.selectedPointVente = null;
    console.log("Selected Delegation:", delegation);
    console.log("Delegation ID:", delegationId);
    if (this.state().selectedRole && this.shouldShowAgenceField(this.state().selectedRole?.name)) {
      this.loadAgencesByDelegation(delegationId);
    }
  }
  // Load agences by delegation
  loadAgencesByDelegation(delegationId) {
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { loadingAgences: true }));
    this.userService.getAllAgenceByDelegationId$(delegationId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          agences: response.data?.agences || response.data,
          loadingAgences: false
        }));
      },
      error: (error) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { loadingAgences: false }));
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load agences"
        });
      }
    });
  }
  // Handle agence selection
  onAgenceChange(agence) {
    if (!agence) {
      this.state.update((state) => __spreadProps(__spreadValues({}, state), {
        selectedAgenceId: void 0,
        pointVentes: void 0,
        selectedPointVenteId: void 0
      }));
      this.selectedPointVente = null;
      return;
    }
    const agenceId = agence.id;
    this.state.update((state) => __spreadProps(__spreadValues({}, state), {
      selectedAgenceId: agenceId,
      pointVentes: void 0,
      selectedPointVenteId: void 0
    }));
    this.selectedPointVente = null;
    console.log("Selected Agence:", agence);
    console.log("Agence ID:", agenceId);
    if (this.state().selectedRole && this.shouldShowPointVenteField(this.state().selectedRole?.name)) {
      this.loadPointVentesByAgence(agenceId);
    }
  }
  // Handle point vente selection
  onPointVenteChange(pointVente) {
    if (!pointVente) {
      this.state.update((state) => __spreadProps(__spreadValues({}, state), {
        selectedPointVenteId: void 0
      }));
      return;
    }
    const pointVenteId = pointVente.id;
    this.state.update((state) => __spreadProps(__spreadValues({}, state), {
      selectedPointVenteId: pointVenteId
    }));
    console.log("Selected Point Vente:", pointVente);
    console.log("Point Vente ID:", pointVenteId);
  }
  // Load point ventes by agence
  loadPointVentesByAgence(agenceId) {
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { loadingPointVentes: true }));
    this.userService.getAllPointventesByAgenceId$(agenceId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          pointVentes: response.data?.pointVentes || response.data,
          loadingPointVentes: false
        }));
      },
      error: (error) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { loadingPointVentes: false }));
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load point ventes"
        });
      }
    });
  }
  createAccout(form) {
    if (form.invalid) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please fill all required fields correctly",
        life: 3e3
      });
      return;
    }
    if (form.value.email && !this.validateEmail(form.value.email)) {
      this.messageService.add({
        severity: "error",
        summary: "Email invalide",
        detail: "Veuillez entrer une adresse email valide (ex: nom.prenom@domain.com)",
        life: 5e3
      });
      return;
    }
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { submitting: true }));
    const selectedRole = form.value.role;
    if (!selectedRole) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please select a valid role",
        life: 3e3
      });
      this.state.update((state) => __spreadProps(__spreadValues({}, state), { submitting: false }));
      return;
    }
    const delegationId = this.state().selectedDelegationId || this.selectedDelegation?.id || null;
    const agenceId = this.state().selectedAgenceId || this.selectedAgence?.id || null;
    const pointventeId = this.state().selectedPointVenteId || this.selectedPointVente?.id || null;
    const serviceValue = this.state().selectedServiceValue || this.selectedService?.value || null;
    console.log("Creating user with location IDs:", {
      delegationId,
      agenceId,
      pointventeId,
      service: serviceValue,
      role: selectedRole.name
    });
    const roleName = selectedRole.name;
    if (this.shouldShowLocationFields(roleName)) {
      if (!delegationId) {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "D\xE9l\xE9gation is required for this role",
          life: 3e3
        });
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { submitting: false }));
        return;
      }
      if (this.shouldShowAgenceField(roleName) && !agenceId) {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Agence is required for this role",
          life: 3e3
        });
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { submitting: false }));
        return;
      }
      if (this.shouldShowPointVenteField(roleName) && !pointventeId) {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Point de vente is required for this role",
          life: 3e3
        });
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { submitting: false }));
        return;
      }
    }
    const userData = {
      username: form.value.username,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email?.trim(),
      // Trim l'email avant envoi
      phone: form.value.phone,
      password: form.value.password,
      bio: form.value.bio,
      service: serviceValue,
      roleName: selectedRole.name,
      roleId: selectedRole.role_id,
      delegationId,
      agenceId,
      pointventeId
    };
    console.log("Final user data to submit:", userData);
    this.userService.createAccount$(userData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "User account created successfully",
          life: 3e3
        });
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { submitting: false }));
        form.resetForm();
        this.selectedDelegation = null;
        this.selectedAgence = null;
        this.selectedPointVente = null;
        this.selectedService = null;
        this.router.navigate(["/dashboards"]);
      },
      error: (error) => {
        console.error("Error creating user:", error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.message || "Failed to create user account",
          life: 3e3
        });
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { submitting: false }));
      }
    });
  }
  static \u0275fac = function CreateUserComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CreateUserComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CreateUserComponent, selectors: [["app-create-user"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 64, vars: 31, consts: [["userForm", "ngForm"], [1, "card"], [1, "text-surface-900", "dark:text-surface-0", "text-xl", "font-bold", "mb-6", "block"], [1, "grid", "grid-cols-12", "gap-4"], [1, "col-span-12", "lg:col-span-2"], [1, "text-surface-900", "dark:text-surface-0", "font-medium", "text-xl", "mb-4"], [1, "flex", "justify-center", "mb-4"], [1, "col-span-12", "lg:col-span-10"], [3, "ngSubmit"], [1, "mb-6", "col-span-12", "md:col-span-6"], ["for", "role", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["ngModel", "", "name", "role", "optionLabel", "name", "filterBy", "name", "required", "", "placeholder", "Selectionner un role", "styleClass", "w-full", "dataKey", "role_id", "appendTo", "body", 3, "onChange", "options", "filter", "showClear", "disabled"], ["pTemplate", "selectedItem"], ["pTemplate", "item"], ["severity", "error", "text", "Role is required"], ["for", "service", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["name", "service", "optionLabel", "label", "filterBy", "label", "placeholder", "S\xE9lectionner un service", "styleClass", "w-full", "dataKey", "value", "appendTo", "body", 3, "ngModelChange", "onChange", "ngModel", "options", "filter", "showClear", "disabled"], [1, "mb-6", "col-span-12"], ["for", "username", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["pInputText", "", "ngModel", "", "name", "username", "id", "username", "type", "text", "required", "", "placeholder", "Entrez le nom d'utilisateur", 1, "w-full", 3, "disabled"], ["severity", "error", "text", "Username is required", "styleClass", "mt-2 w-full"], ["for", "firstName", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["pInputText", "", "ngModel", "", "name", "firstName", "id", "firstName", "type", "text", "required", "", 1, "w-full", 3, "disabled"], ["severity", "error", "text", "First name is required"], ["for", "lastName", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["pInputText", "", "ngModel", "", "name", "lastName", "id", "lastName", "type", "text", "required", "", 1, "w-full", 3, "disabled"], ["severity", "error", "text", "Last name is required"], ["for", "email", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["pInputText", "", "ngModel", "", "name", "email", "id", "email", "type", "email", "required", "", "email", "", 1, "w-full", 3, "disabled"], ["severity", "error", "text", "Valid email is required"], ["for", "phone", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["pInputText", "", "ngModel", "", "name", "phone", "id", "phone", "type", "text", 1, "w-full", 3, "disabled"], ["for", "password", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["ngModel", "", "name", "password", "id", "password", "required", "", "styleClass", "w-full", 3, "toggleMask", "disabled"], ["severity", "error", "text", "Password is required"], ["for", "bio", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["pTextarea", "", "ngModel", "", "name", "bio", "id", "bio", "rows", "5", 1, "w-full", 3, "autoResize", "disabled"], [1, "col-span-12"], [1, "flex", "gap-3"], ["pButton", "", "pRipple", "", "type", "submit", "label", "Enregister", "icon", "pi pi-save", 1, "w-auto", "mt-3", 3, "loading", "disabled"], ["pButton", "", "pRipple", "", "type", "button", "label", "Annuler", "icon", "pi pi-times", 1, "p-button-secondary", "w-auto", "mt-3", 3, "click", "disabled"], [1, "mt-4", "p-3", "bg-gray-100", "dark:bg-gray-800", "rounded", "text-xs"], [1, "flex", "items-center"], [1, "ml-2", "text-xs", "text-gray-500"], [1, "mb-6", "col-span-12", 3, "ngClass"], ["for", "delegation", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["name", "delegation", "optionLabel", "libele", "filterBy", "libele", "required", "", "placeholder", "S\xE9lectionner une d\xE9l\xE9gation", "styleClass", "w-full", "dataKey", "id", "appendTo", "body", 3, "ngModelChange", "onChange", "ngModel", "options", "filter", "showClear", "disabled", "loading"], ["severity", "error", "text", "D\xE9l\xE9gation is required"], ["for", "agence", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["name", "agence", "optionLabel", "libele", "filterBy", "libele", "required", "", "placeholder", "S\xE9lectionner une agence", "styleClass", "w-full", "dataKey", "id", "appendTo", "body", 3, "ngModelChange", "onChange", "ngModel", "options", "filter", "showClear", "disabled", "loading"], ["severity", "error", "text", "Agence is required"], ["for", "pointVente", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], [1, "text-blue-500", "text-sm"], ["name", "pointVente", "optionLabel", "libele", "filterBy", "libele", "required", "", "placeholder", "S\xE9lectionner un point de vente", "styleClass", "w-full", "dataKey", "id", "appendTo", "body", 3, "ngModelChange", "onChange", "ngModel", "options", "filter", "showClear", "disabled", "loading"], ["severity", "error", "text", "Point de vente is required"], ["class", "ml-2 text-xs text-gray-500", 4, "ngIf"]], template: function CreateUserComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 1)(1, "span", 2);
      \u0275\u0275text(2, " Formulaire de Cr\xE9ation de Compte ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "div", 3)(4, "div", 4)(5, "div", 5);
      \u0275\u0275text(6, "Profil Utilisateur");
      \u0275\u0275elementEnd();
      \u0275\u0275template(7, CreateUserComponent_Conditional_7_Template, 2, 3, "div", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "div", 7)(9, "form", 8, 0);
      \u0275\u0275listener("ngSubmit", function CreateUserComponent_Template_form_ngSubmit_9_listener() {
        \u0275\u0275restoreView(_r1);
        const userForm_r2 = \u0275\u0275reference(10);
        return \u0275\u0275resetView(ctx.createAccout(userForm_r2));
      });
      \u0275\u0275elementStart(11, "div", 3)(12, "div", 9)(13, "label", 10);
      \u0275\u0275text(14, " Roles * ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "p-dropdown", 11);
      \u0275\u0275listener("onChange", function CreateUserComponent_Template_p_dropdown_onChange_15_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onRoleChange($event.value));
      });
      \u0275\u0275template(16, CreateUserComponent_ng_template_16_Template, 3, 1, "ng-template", 12)(17, CreateUserComponent_ng_template_17_Template, 5, 2, "ng-template", 13);
      \u0275\u0275elementEnd();
      \u0275\u0275template(18, CreateUserComponent_Conditional_18_Template, 1, 0, "p-message", 14);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "div", 9)(20, "label", 15);
      \u0275\u0275text(21, " Service ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "p-dropdown", 16);
      \u0275\u0275twoWayListener("ngModelChange", function CreateUserComponent_Template_p_dropdown_ngModelChange_22_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.selectedService, $event) || (ctx.selectedService = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275listener("onChange", function CreateUserComponent_Template_p_dropdown_onChange_22_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onServiceChange($event.value));
      });
      \u0275\u0275template(23, CreateUserComponent_ng_template_23_Template, 3, 1, "ng-template", 12)(24, CreateUserComponent_ng_template_24_Template, 5, 2, "ng-template", 13);
      \u0275\u0275elementEnd()();
      \u0275\u0275template(25, CreateUserComponent_Conditional_25_Template, 9, 13);
      \u0275\u0275elementStart(26, "div", 17)(27, "label", 18);
      \u0275\u0275text(28, " Nom d'utilisateur * ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(29, "input", 19);
      \u0275\u0275template(30, CreateUserComponent_Conditional_30_Template, 1, 0, "p-message", 20);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(31, "div", 9)(32, "label", 21);
      \u0275\u0275text(33, " Nom * ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(34, "input", 22);
      \u0275\u0275template(35, CreateUserComponent_Conditional_35_Template, 1, 0, "p-message", 23);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "div", 9)(37, "label", 24);
      \u0275\u0275text(38, " Prenom * ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(39, "input", 25);
      \u0275\u0275template(40, CreateUserComponent_Conditional_40_Template, 1, 0, "p-message", 26);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "div", 9)(42, "label", 27);
      \u0275\u0275text(43, " Email * ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(44, "input", 28);
      \u0275\u0275template(45, CreateUserComponent_Conditional_45_Template, 1, 0, "p-message", 29);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(46, "div", 9)(47, "label", 30);
      \u0275\u0275text(48, " Contact ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(49, "input", 31);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(50, "div", 9)(51, "label", 32);
      \u0275\u0275text(52, " Mot de passe * ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(53, "p-password", 33);
      \u0275\u0275template(54, CreateUserComponent_Conditional_54_Template, 1, 0, "p-message", 34);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(55, "div", 17)(56, "label", 35);
      \u0275\u0275text(57, " Bio ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(58, "textarea", 36);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(59, "div", 37)(60, "div", 38);
      \u0275\u0275element(61, "button", 39);
      \u0275\u0275elementStart(62, "button", 40);
      \u0275\u0275listener("click", function CreateUserComponent_Template_button_click_62_listener() {
        \u0275\u0275restoreView(_r1);
        const userForm_r2 = \u0275\u0275reference(10);
        userForm_r2.resetForm();
        return \u0275\u0275resetView(ctx.selectedService = null);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275template(63, CreateUserComponent_Conditional_63_Template, 21, 5, "div", 41);
      \u0275\u0275elementEnd()()()()()();
    }
    if (rf & 2) {
      let tmp_12_0;
      const userForm_r2 = \u0275\u0275reference(10);
      \u0275\u0275advance(7);
      \u0275\u0275conditional(ctx.state().submitting ? 7 : -1);
      \u0275\u0275advance(8);
      \u0275\u0275property("options", ctx.state().roles || \u0275\u0275pureFunction0(30, _c0))("filter", true)("showClear", true)("disabled", ctx.state().submitting || ctx.state().loading);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(userForm_r2.controls && userForm_r2.controls["role"] && userForm_r2.controls["role"].invalid && userForm_r2.controls["role"].touched ? 18 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.selectedService);
      \u0275\u0275property("options", ctx.services)("filter", true)("showClear", true)("disabled", ctx.state().submitting);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.state().selectedRole && ctx.shouldShowLocationFields((tmp_12_0 = ctx.state().selectedRole) == null ? null : tmp_12_0.name) ? 25 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance();
      \u0275\u0275conditional(userForm_r2.controls["username"] && userForm_r2.controls["username"].invalid && userForm_r2.controls["username"].touched ? 30 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance();
      \u0275\u0275conditional(userForm_r2.controls && userForm_r2.controls["firstName"] && userForm_r2.controls["firstName"].invalid && userForm_r2.controls["firstName"].touched ? 35 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance();
      \u0275\u0275conditional(userForm_r2.controls && userForm_r2.controls["lastName"] && userForm_r2.controls["lastName"].invalid && userForm_r2.controls["lastName"].touched ? 40 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance();
      \u0275\u0275conditional(userForm_r2.controls && userForm_r2.controls["email"] && userForm_r2.controls["email"].invalid && userForm_r2.controls["email"].touched ? 45 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance(4);
      \u0275\u0275property("toggleMask", true)("disabled", ctx.state().submitting);
      \u0275\u0275advance();
      \u0275\u0275conditional(userForm_r2.controls && userForm_r2.controls["password"] && userForm_r2.controls["password"].invalid && userForm_r2.controls["password"].touched ? 54 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("autoResize", true)("disabled", ctx.state().submitting);
      \u0275\u0275advance(3);
      \u0275\u0275property("loading", ctx.state().submitting)("disabled", userForm_r2 && userForm_r2.invalid || ctx.state().submitting);
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.state().selectedRole ? 63 : -1);
    }
  }, dependencies: [CommonModule, NgClass, NgIf, InputText, TextareaModule, Textarea, FileUploadModule, PrimeTemplate, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, EmailValidator, NgModel, NgForm, ButtonModule, ButtonDirective, InputGroupModule, RippleModule, Ripple, MessageModule, Message, ProgressSpinnerModule, ProgressSpinner, PasswordModule, Password, DropdownModule, Dropdown], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CreateUserComponent, { className: "CreateUserComponent", filePath: "src/app/pages/dashboard/admin/create-user/create-user.component.ts", lineNumber: 36 });
})();
export {
  CreateUserComponent
};
//# sourceMappingURL=chunk-MEQRLU3Q.js.map
