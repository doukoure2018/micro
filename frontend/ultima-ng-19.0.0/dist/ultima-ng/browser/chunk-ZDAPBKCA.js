import {
  InputSwitch,
  InputSwitchModule
} from "./chunk-5EDISLF5.js";
import {
  Avatar,
  AvatarModule
} from "./chunk-MCGUCMXD.js";
import {
  ProgressBarModule
} from "./chunk-WQ2EPPBK.js";
import {
  MultiSelectModule
} from "./chunk-T4LUJXIT.js";
import {
  Chip,
  ChipModule
} from "./chunk-SN3HAAMO.js";
import {
  Skeleton,
  SkeletonModule
} from "./chunk-ZUPKH4BQ.js";
import {
  Divider,
  DividerModule
} from "./chunk-VDET62CU.js";
import {
  Calendar,
  CalendarModule
} from "./chunk-NLXNXYLN.js";
import {
  SortIcon,
  SortableColumn,
  Table,
  TableModule
} from "./chunk-REDVHUQC.js";
import {
  Tag,
  TagModule
} from "./chunk-MYUKI7DG.js";
import {
  CardModule
} from "./chunk-H46GQ57A.js";
import {
  Dropdown,
  DropdownModule
} from "./chunk-ZCIQCP6V.js";
import {
  IconField,
  InputIcon
} from "./chunk-WIQZFAVH.js";
import {
  ProgressSpinnerModule
} from "./chunk-Y2J5OGKB.js";
import {
  Router
} from "./chunk-BTKK64MU.js";
import {
  takeUntilDestroyed
} from "./chunk-WRLBQDQK.js";
import {
  InputText,
  InputTextModule
} from "./chunk-FZELBHWZ.js";
import {
  Tooltip,
  TooltipModule
} from "./chunk-4IUQ6KTI.js";
import {
  BadgeModule,
  ButtonDirective,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import {
  ConfirmationService,
  MessageService,
  PrimeTemplate
} from "./chunk-NQNBRQ7H.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-3HTR5OU7.js";
import {
  UserService
} from "./chunk-SQ5BRWVW.js";
import {
  CommonModule,
  DatePipe
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
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuery
} from "./chunk-ZKKMBKIA.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/pages/dashboard/admin/admin.component.ts
var _c0 = ["dtUsers"];
var _c1 = ["dtAgents"];
var _c2 = () => [1, 2, 3];
var _c3 = () => [];
var _c4 = () => [5, 10, 20];
var _c5 = () => ["firstName", "lastName", "username", "email", "service"];
var _c6 = (a0) => ({ "background-color": a0, "color": "white" });
var _c7 = () => ({ "background-color": "#EEF2FF", "color": "#4F46E5" });
var _c8 = () => [1, 2, 3, 4, 5];
var _c9 = () => [10, 25, 50];
var _c10 = () => ["firstName", "lastName", "email", "role", "username"];
function AdminComponent_Conditional_54_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 43);
    \u0275\u0275element(1, "p-skeleton", 44);
    \u0275\u0275elementStart(2, "div", 45);
    \u0275\u0275element(3, "p-skeleton", 46)(4, "p-skeleton", 47);
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "p-skeleton", 48);
    \u0275\u0275elementEnd();
  }
}
function AdminComponent_Conditional_54_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35);
    \u0275\u0275repeaterCreate(1, AdminComponent_Conditional_54_For_2_Template, 6, 0, "div", 43, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275repeater(\u0275\u0275pureFunction0(0, _c2));
  }
}
function AdminComponent_Conditional_55_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 53)(1, "p-iconfield", 54);
    \u0275\u0275element(2, "p-inputicon", 55);
    \u0275\u0275elementStart(3, "input", 56);
    \u0275\u0275twoWayListener("ngModelChange", function AdminComponent_Conditional_55_ng_template_2_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.globalFilterAgents, $event) || (ctx_r1.globalFilterAgents = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("input", function AdminComponent_Conditional_55_ng_template_2_Template_input_input_3_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onGlobalFilterAgents($event));
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.globalFilterAgents);
  }
}
function AdminComponent_Conditional_55_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "th", 57)(2, "div", 58);
    \u0275\u0275text(3, " Agent ");
    \u0275\u0275element(4, "p-sortIcon", 59);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "th", 60)(6, "div", 58);
    \u0275\u0275text(7, " Username ");
    \u0275\u0275element(8, "p-sortIcon", 61);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "th", 62)(10, "div", 58);
    \u0275\u0275text(11, " Email ");
    \u0275\u0275element(12, "p-sortIcon", 63);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "th", 64);
    \u0275\u0275text(14, "Service");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th", 65);
    \u0275\u0275text(16, "Statut");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "th", 66);
    \u0275\u0275text(18, "Autorisation");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "tr")(20, "th")(21, "p-iconfield");
    \u0275\u0275element(22, "p-inputicon", 55);
    \u0275\u0275elementStart(23, "input", 67);
    \u0275\u0275listener("input", function AdminComponent_Conditional_55_ng_template_3_Template_input_input_23_listener($event) {
      \u0275\u0275restoreView(_r3);
      \u0275\u0275nextContext();
      const dtAgents_r4 = \u0275\u0275reference(1);
      return \u0275\u0275resetView(dtAgents_r4.filter($event.target.value, "firstName", "contains"));
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(24, "th")(25, "input", 68);
    \u0275\u0275listener("input", function AdminComponent_Conditional_55_ng_template_3_Template_input_input_25_listener($event) {
      \u0275\u0275restoreView(_r3);
      \u0275\u0275nextContext();
      const dtAgents_r4 = \u0275\u0275reference(1);
      return \u0275\u0275resetView(dtAgents_r4.filter($event.target.value, "username", "contains"));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "th")(27, "input", 69);
    \u0275\u0275listener("input", function AdminComponent_Conditional_55_ng_template_3_Template_input_input_27_listener($event) {
      \u0275\u0275restoreView(_r3);
      \u0275\u0275nextContext();
      const dtAgents_r4 = \u0275\u0275reference(1);
      return \u0275\u0275resetView(dtAgents_r4.filter($event.target.value, "email", "contains"));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "th")(29, "p-dropdown", 70);
    \u0275\u0275listener("onChange", function AdminComponent_Conditional_55_ng_template_3_Template_p_dropdown_onChange_29_listener($event) {
      \u0275\u0275restoreView(_r3);
      \u0275\u0275nextContext();
      const dtAgents_r4 = \u0275\u0275reference(1);
      return \u0275\u0275resetView(dtAgents_r4.filter($event.value, "service", "equals"));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "th")(31, "p-dropdown", 70);
    \u0275\u0275listener("onChange", function AdminComponent_Conditional_55_ng_template_3_Template_p_dropdown_onChange_31_listener($event) {
      \u0275\u0275restoreView(_r3);
      \u0275\u0275nextContext();
      const dtAgents_r4 = \u0275\u0275reference(1);
      return \u0275\u0275resetView(dtAgents_r4.filter($event.value, "enabled", "equals"));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(32, "th")(33, "p-dropdown", 70);
    \u0275\u0275listener("onChange", function AdminComponent_Conditional_55_ng_template_3_Template_p_dropdown_onChange_33_listener($event) {
      \u0275\u0275restoreView(_r3);
      \u0275\u0275nextContext();
      const dtAgents_r4 = \u0275\u0275reference(1);
      return \u0275\u0275resetView(dtAgents_r4.filter($event.value, "authorized", "equals"));
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(29);
    \u0275\u0275property("options", ctx_r1.serviceOptions)("showClear", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("options", ctx_r1.statusOptions)("showClear", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("options", ctx_r1.authorizationOptions)("showClear", true);
  }
}
function AdminComponent_Conditional_55_ng_template_4_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-tag", 79);
  }
  if (rf & 2) {
    \u0275\u0275property("rounded", true);
  }
}
function AdminComponent_Conditional_55_ng_template_4_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-tag", 80);
  }
  if (rf & 2) {
    \u0275\u0275property("rounded", true);
  }
}
function AdminComponent_Conditional_55_ng_template_4_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 82);
    \u0275\u0275element(1, "i", 83);
    \u0275\u0275elementStart(2, "span", 84);
    \u0275\u0275text(3, "Mise \xE0 jour...");
    \u0275\u0275elementEnd()();
  }
}
function AdminComponent_Conditional_55_ng_template_4_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-inputSwitch", 85);
    \u0275\u0275twoWayListener("ngModelChange", function AdminComponent_Conditional_55_ng_template_4_Conditional_23_Template_p_inputSwitch_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r5);
      const agent_r6 = \u0275\u0275nextContext().$implicit;
      \u0275\u0275twoWayBindingSet(agent_r6.authorized, $event) || (agent_r6.authorized = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("onChange", function AdminComponent_Conditional_55_ng_template_4_Conditional_23_Template_p_inputSwitch_onChange_0_listener() {
      \u0275\u0275restoreView(_r5);
      const agent_r6 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleAuthorization(agent_r6));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(1, "p-tag", 86);
  }
  if (rf & 2) {
    const agent_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275twoWayProperty("ngModel", agent_r6.authorized);
    \u0275\u0275property("pTooltip", agent_r6.authorized ? "Cliquer pour d\xE9sautoriser" : "Cliquer pour autoriser");
    \u0275\u0275advance();
    \u0275\u0275property("value", agent_r6.authorized ? "Autoris\xE9" : "Non autoris\xE9")("severity", agent_r6.authorized ? "success" : "danger")("rounded", true);
  }
}
function AdminComponent_Conditional_55_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 71)(1, "td")(2, "div", 27);
    \u0275\u0275element(3, "p-avatar", 72);
    \u0275\u0275elementStart(4, "div")(5, "span", 73);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 74);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(9, "td")(10, "span", 75);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "td")(13, "a", 76);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "td");
    \u0275\u0275element(16, "p-chip", 77);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td", 78);
    \u0275\u0275template(18, AdminComponent_Conditional_55_ng_template_4_Conditional_18_Template, 1, 1, "p-tag", 79)(19, AdminComponent_Conditional_55_ng_template_4_Conditional_19_Template, 1, 1, "p-tag", 80);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "td", 78)(21, "div", 81);
    \u0275\u0275template(22, AdminComponent_Conditional_55_ng_template_4_Conditional_22_Template, 4, 0, "div", 82)(23, AdminComponent_Conditional_55_ng_template_4_Conditional_23_Template, 2, 5);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const agent_r6 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275styleMap(\u0275\u0275pureFunction1(15, _c6, "#" + (agent_r6.userId * 123456).toString(16).slice(0, 6)));
    \u0275\u0275property("image", agent_r6.imageUrl || "")("label", !agent_r6.imageUrl ? ((agent_r6.firstName == null ? null : agent_r6.firstName.charAt(0)) || "") + ((agent_r6.lastName == null ? null : agent_r6.lastName.charAt(0)) || "") : void 0);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", agent_r6.firstName, " ", agent_r6.lastName, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("ID: ", agent_r6.userId, "");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(agent_r6.username);
    \u0275\u0275advance(2);
    \u0275\u0275property("href", "mailto:" + agent_r6.email, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", agent_r6.email, " ");
    \u0275\u0275advance(2);
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(17, _c7));
    \u0275\u0275property("label", agent_r6.service || "N/A");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(agent_r6.enabled ? 18 : 19);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r1.isUpdatingAuthorization(agent_r6.userId) ? 22 : 23);
  }
}
function AdminComponent_Conditional_55_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 87)(2, "div", 88);
    \u0275\u0275element(3, "i", 89);
    \u0275\u0275elementStart(4, "span", 90);
    \u0275\u0275text(5, "Aucun agent cr\xE9dit trouv\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 91);
    \u0275\u0275text(7, "Essayez de modifier vos crit\xE8res de recherche");
    \u0275\u0275elementEnd()()()();
  }
}
function AdminComponent_Conditional_55_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-table", 36, 0);
    \u0275\u0275template(2, AdminComponent_Conditional_55_ng_template_2_Template, 4, 1, "ng-template", 49)(3, AdminComponent_Conditional_55_ng_template_3_Template, 34, 6, "ng-template", 50)(4, AdminComponent_Conditional_55_ng_template_4_Template, 24, 18, "ng-template", 51)(5, AdminComponent_Conditional_55_ng_template_5_Template, 8, 0, "ng-template", 52);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("value", ctx_r1.state().agentCredits || \u0275\u0275pureFunction0(8, _c3))("paginator", true)("rows", 5)("rowsPerPageOptions", \u0275\u0275pureFunction0(9, _c4))("showCurrentPageReport", true)("globalFilterFields", \u0275\u0275pureFunction0(10, _c5))("filterDelay", 300)("rowHover", true);
  }
}
function AdminComponent_Conditional_56_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 37);
    \u0275\u0275element(1, "i", 92);
    \u0275\u0275elementStart(2, "span", 93);
    \u0275\u0275text(3, "Aucun agent cr\xE9dit enregistr\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 94);
    \u0275\u0275text(5, "Les agents cr\xE9dit appara\xEEtront ici une fois cr\xE9\xE9s");
    \u0275\u0275elementEnd()();
  }
}
function AdminComponent_Conditional_72_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 43);
    \u0275\u0275element(1, "p-skeleton", 95);
    \u0275\u0275elementStart(2, "div", 45);
    \u0275\u0275element(3, "p-skeleton", 96)(4, "p-skeleton", 97);
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "p-skeleton", 98)(6, "p-skeleton", 99);
    \u0275\u0275elementEnd();
  }
}
function AdminComponent_Conditional_72_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35);
    \u0275\u0275repeaterCreate(1, AdminComponent_Conditional_72_For_2_Template, 7, 0, "div", 43, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275repeater(\u0275\u0275pureFunction0(0, _c8));
  }
}
function AdminComponent_Conditional_73_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 53)(1, "p-iconfield", 54);
    \u0275\u0275element(2, "p-inputicon", 55);
    \u0275\u0275elementStart(3, "input", 100);
    \u0275\u0275twoWayListener("ngModelChange", function AdminComponent_Conditional_73_ng_template_2_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.globalFilterUsers, $event) || (ctx_r1.globalFilterUsers = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("input", function AdminComponent_Conditional_73_ng_template_2_Template_input_input_3_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onGlobalFilterUsers($event));
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.globalFilterUsers);
  }
}
function AdminComponent_Conditional_73_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "th", 101)(2, "div", 58);
    \u0275\u0275text(3, " ID ");
    \u0275\u0275element(4, "p-sortIcon", 102);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "th", 57)(6, "div", 58);
    \u0275\u0275text(7, " Utilisateur ");
    \u0275\u0275element(8, "p-sortIcon", 59);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "th", 103)(10, "div", 58);
    \u0275\u0275text(11, " Email ");
    \u0275\u0275element(12, "p-sortIcon", 63);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "th", 104)(14, "div", 58);
    \u0275\u0275text(15, " R\xF4le ");
    \u0275\u0275element(16, "p-sortIcon", 105);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "th", 106)(18, "div", 58);
    \u0275\u0275text(19, " Date cr\xE9ation ");
    \u0275\u0275element(20, "p-sortIcon", 107);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "th", 108)(22, "div", 58);
    \u0275\u0275text(23, " Derni\xE8re connexion ");
    \u0275\u0275element(24, "p-sortIcon", 109);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "th", 110);
    \u0275\u0275text(26, "Actions");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "tr")(28, "th")(29, "input", 111);
    \u0275\u0275listener("input", function AdminComponent_Conditional_73_ng_template_3_Template_input_input_29_listener($event) {
      \u0275\u0275restoreView(_r8);
      \u0275\u0275nextContext();
      const dtUsers_r9 = \u0275\u0275reference(1);
      return \u0275\u0275resetView(dtUsers_r9.filter($event.target.value, "userId", "contains"));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "th")(31, "p-iconfield");
    \u0275\u0275element(32, "p-inputicon", 55);
    \u0275\u0275elementStart(33, "input", 67);
    \u0275\u0275listener("input", function AdminComponent_Conditional_73_ng_template_3_Template_input_input_33_listener($event) {
      \u0275\u0275restoreView(_r8);
      \u0275\u0275nextContext();
      const dtUsers_r9 = \u0275\u0275reference(1);
      return \u0275\u0275resetView(dtUsers_r9.filter($event.target.value, "firstName", "contains"));
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(34, "th")(35, "input", 69);
    \u0275\u0275listener("input", function AdminComponent_Conditional_73_ng_template_3_Template_input_input_35_listener($event) {
      \u0275\u0275restoreView(_r8);
      \u0275\u0275nextContext();
      const dtUsers_r9 = \u0275\u0275reference(1);
      return \u0275\u0275resetView(dtUsers_r9.filter($event.target.value, "email", "contains"));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "th")(37, "p-dropdown", 112);
    \u0275\u0275listener("onChange", function AdminComponent_Conditional_73_ng_template_3_Template_p_dropdown_onChange_37_listener($event) {
      \u0275\u0275restoreView(_r8);
      \u0275\u0275nextContext();
      const dtUsers_r9 = \u0275\u0275reference(1);
      return \u0275\u0275resetView(dtUsers_r9.filter($event.value, "role", "equals"));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(38, "th")(39, "p-calendar", 113);
    \u0275\u0275listener("onSelect", function AdminComponent_Conditional_73_ng_template_3_Template_p_calendar_onSelect_39_listener($event) {
      \u0275\u0275restoreView(_r8);
      \u0275\u0275nextContext();
      const dtUsers_r9 = \u0275\u0275reference(1);
      return \u0275\u0275resetView(dtUsers_r9.filter($event, "createdAt", "dateIs"));
    })("onClear", function AdminComponent_Conditional_73_ng_template_3_Template_p_calendar_onClear_39_listener() {
      \u0275\u0275restoreView(_r8);
      \u0275\u0275nextContext();
      const dtUsers_r9 = \u0275\u0275reference(1);
      return \u0275\u0275resetView(dtUsers_r9.filter(null, "createdAt", "dateIs"));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(40, "th")(41, "p-calendar", 113);
    \u0275\u0275listener("onSelect", function AdminComponent_Conditional_73_ng_template_3_Template_p_calendar_onSelect_41_listener($event) {
      \u0275\u0275restoreView(_r8);
      \u0275\u0275nextContext();
      const dtUsers_r9 = \u0275\u0275reference(1);
      return \u0275\u0275resetView(dtUsers_r9.filter($event, "lastLogin", "dateIs"));
    })("onClear", function AdminComponent_Conditional_73_ng_template_3_Template_p_calendar_onClear_41_listener() {
      \u0275\u0275restoreView(_r8);
      \u0275\u0275nextContext();
      const dtUsers_r9 = \u0275\u0275reference(1);
      return \u0275\u0275resetView(dtUsers_r9.filter(null, "lastLogin", "dateIs"));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275element(42, "th");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(37);
    \u0275\u0275property("options", ctx_r1.roleOptions)("showClear", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("showClear", true)("showIcon", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("showClear", true)("showIcon", true);
  }
}
function AdminComponent_Conditional_73_ng_template_4_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 82);
    \u0275\u0275element(1, "i", 124);
    \u0275\u0275elementStart(2, "span", 117);
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 118);
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "date");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const user_r11 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(4, 2, user_r11.lastLogin, "dd/MM/yyyy"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(7, 5, user_r11.lastLogin, "HH:mm"));
  }
}
function AdminComponent_Conditional_73_ng_template_4_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 119);
    \u0275\u0275text(1, "Jamais connect\xE9");
    \u0275\u0275elementEnd();
  }
}
function AdminComponent_Conditional_73_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 71)(1, "td")(2, "span", 114);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td")(5, "div", 27);
    \u0275\u0275element(6, "p-avatar", 72);
    \u0275\u0275elementStart(7, "div")(8, "span", 73);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 115);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(12, "td")(13, "a", 76);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "td");
    \u0275\u0275element(16, "p-tag", 86);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td")(18, "div", 82);
    \u0275\u0275element(19, "i", 116);
    \u0275\u0275elementStart(20, "span", 117);
    \u0275\u0275text(21);
    \u0275\u0275pipe(22, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div", 118);
    \u0275\u0275text(24);
    \u0275\u0275pipe(25, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "td");
    \u0275\u0275template(27, AdminComponent_Conditional_73_ng_template_4_Conditional_27_Template, 8, 8)(28, AdminComponent_Conditional_73_ng_template_4_Conditional_28_Template, 2, 0, "span", 119);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "td")(30, "div", 120);
    \u0275\u0275element(31, "button", 121);
    \u0275\u0275elementStart(32, "button", 122);
    \u0275\u0275listener("click", function AdminComponent_Conditional_73_ng_template_4_Template_button_click_32_listener() {
      const user_r11 = \u0275\u0275restoreView(_r10).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.editUser(user_r11));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "button", 123);
    \u0275\u0275listener("click", function AdminComponent_Conditional_73_ng_template_4_Template_button_click_33_listener() {
      const user_r11 = \u0275\u0275restoreView(_r10).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.deleteUser(user_r11));
    });
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const user_r11 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(user_r11.userId);
    \u0275\u0275advance(3);
    \u0275\u0275styleMap(\u0275\u0275pureFunction1(22, _c6, "#" + (user_r11.userId * 654321).toString(16).slice(0, 6)));
    \u0275\u0275property("image", user_r11.imageUrl || "")("label", !user_r11.imageUrl ? ((user_r11.firstName == null ? null : user_r11.firstName.charAt(0)) || "") + ((user_r11.lastName == null ? null : user_r11.lastName.charAt(0)) || "") : void 0);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", user_r11.firstName, " ", user_r11.lastName, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("@", user_r11.username, "");
    \u0275\u0275advance(2);
    \u0275\u0275property("href", "mailto:" + user_r11.email, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", user_r11.email, " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r1.getRoleLabel(user_r11.role))("severity", ctx_r1.getRoleSeverity(user_r11.role))("rounded", true);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(22, 16, user_r11.createdAt, "dd/MM/yyyy"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(25, 19, user_r11.createdAt, "HH:mm"));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(user_r11.lastLogin ? 27 : 28);
  }
}
function AdminComponent_Conditional_73_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td", 125)(2, "div", 88);
    \u0275\u0275element(3, "i", 126);
    \u0275\u0275elementStart(4, "span", 90);
    \u0275\u0275text(5, "Aucun utilisateur trouv\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 91);
    \u0275\u0275text(7, "Essayez de modifier vos crit\xE8res de recherche");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 127);
    \u0275\u0275listener("click", function AdminComponent_Conditional_73_ng_template_5_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.navigateToCreateUser());
    });
    \u0275\u0275elementEnd()()()();
  }
}
function AdminComponent_Conditional_73_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-table", 42, 1);
    \u0275\u0275template(2, AdminComponent_Conditional_73_ng_template_2_Template, 4, 1, "ng-template", 49)(3, AdminComponent_Conditional_73_ng_template_3_Template, 43, 6, "ng-template", 50)(4, AdminComponent_Conditional_73_ng_template_4_Template, 34, 24, "ng-template", 51)(5, AdminComponent_Conditional_73_ng_template_5_Template, 9, 0, "ng-template", 52);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("value", ctx_r1.state().users || \u0275\u0275pureFunction0(8, _c3))("paginator", true)("rows", 10)("showCurrentPageReport", true)("rowsPerPageOptions", \u0275\u0275pureFunction0(9, _c9))("globalFilterFields", \u0275\u0275pureFunction0(10, _c10))("filterDelay", 300)("rowHover", true);
  }
}
var AdminComponent = class _AdminComponent {
  dtUsers;
  dtAgents;
  state = signal({
    loading: false,
    message: void 0,
    error: void 0,
    loadingAgentCredits: false,
    updatingAuthorization: null
  });
  // Options de filtrage
  roleOptions = [
    { label: "Super Admin", value: "SUPER_ADMIN" },
    { label: "Admin", value: "ADMIN" },
    { label: "Agent Cr\xE9dit", value: "AGENT_CREDIT" },
    { label: "Agent Caisse", value: "AGENT_CAISSE" },
    { label: "Utilisateur", value: "USER" }
  ];
  statusOptions = [
    { label: "Actif", value: "true" },
    { label: "Inactif", value: "false" }
  ];
  authorizationOptions = [
    { label: "Autoris\xE9", value: "true" },
    { label: "Non autoris\xE9", value: "false" }
  ];
  serviceOptions = [
    { label: "Cr\xE9dit", value: "CREDIT" },
    { label: "Caisse", value: "CAISSE" },
    { label: "Administration", value: "ADMIN" }
  ];
  // Variables pour les filtres globaux
  globalFilterUsers = "";
  globalFilterAgents = "";
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  userService = inject(UserService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  ngOnInit() {
    this.loadUsers();
    this.loadAgentCredits();
  }
  loadUsers() {
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { loading: true, message: void 0, error: void 0 }));
    this.userService.listUser$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          users: response.data.users,
          loading: false,
          message: response.message,
          error: void 0
        }));
      },
      error: (error) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          loading: false,
          message: void 0,
          error
        }));
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Impossible de charger les utilisateurs",
          life: 3e3
        });
      }
    });
  }
  // Filtre global pour le tableau des utilisateurs
  onGlobalFilterUsers(event) {
    const value = event.target.value;
    this.dtUsers?.filterGlobal(value, "contains");
  }
  // Filtre global pour le tableau des agents
  onGlobalFilterAgents(event) {
    const value = event.target.value;
    this.dtAgents?.filterGlobal(value, "contains");
  }
  // Effacer tous les filtres du tableau utilisateurs
  clearFiltersUsers() {
    this.dtUsers?.clear();
    this.globalFilterUsers = "";
  }
  // Effacer tous les filtres du tableau agents
  clearFiltersAgents() {
    this.dtAgents?.clear();
    this.globalFilterAgents = "";
  }
  navigateToCreateUser() {
    this.router.navigate(["/dashboards/createUser"]);
  }
  editUser(user) {
    this.router.navigate([`/dashboards/edit/${user.userId}`]);
  }
  deleteUser(user) {
    this.confirmationService.confirm({
      message: `\xCAtes-vous s\xFBr de vouloir supprimer l'utilisateur ${user.firstName} ${user.lastName}?`,
      header: "Confirmation de suppression",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Oui, supprimer",
      rejectLabel: "Annuler",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => {
        this.messageService.add({
          severity: "info",
          summary: "Info",
          detail: "Fonctionnalit\xE9 en cours de d\xE9veloppement",
          life: 3e3
        });
      }
    });
  }
  getRoleSeverity(role) {
    switch (role) {
      case "SUPER_ADMIN":
        return "danger";
      case "ADMIN":
        return "warn";
      case "AGENT_CREDIT":
        return "info";
      case "AGENT_CAISSE":
        return "success";
      case "USER":
        return "secondary";
      default:
        return "info";
    }
  }
  getRoleLabel(role) {
    const found = this.roleOptions.find((r) => r.value === role);
    return found ? found.label : role;
  }
  // ========================================
  // GESTION DES AUTORISATIONS AGENT CRÉDIT
  // ========================================
  loadAgentCredits() {
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { loadingAgentCredits: true }));
    this.userService.getUsersByRole$("AGENT_CREDIT").pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        console.log("Agents cr\xE9dit charg\xE9s:", response);
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          agentCredits: response.data?.users || [],
          loadingAgentCredits: false
        }));
      },
      error: (error) => {
        console.error("Erreur lors du chargement des agents cr\xE9dit:", error);
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          loadingAgentCredits: false
        }));
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Impossible de charger la liste des agents cr\xE9dit",
          life: 3e3
        });
      }
    });
  }
  toggleAuthorization(user) {
    const newAuthStatus = user.authorized ?? false;
    const previousStatus = !newAuthStatus;
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { updatingAuthorization: user.userId }));
    this.userService.updateUserAuthorization$(user.userId, newAuthStatus).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        console.log("Autorisation mise \xE0 jour:", response);
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          updatingAuthorization: null,
          agentCredits: state.agentCredits?.map((agent) => agent.userId === user.userId ? __spreadProps(__spreadValues({}, agent), { authorized: newAuthStatus }) : agent)
        }));
        this.messageService.add({
          severity: "success",
          summary: "Succ\xE8s",
          detail: newAuthStatus ? `${user.firstName} ${user.lastName} a \xE9t\xE9 autoris\xE9` : `${user.firstName} ${user.lastName} a \xE9t\xE9 d\xE9sautoris\xE9`,
          life: 3e3
        });
      },
      error: (error) => {
        console.error("Erreur lors de la mise \xE0 jour de l'autorisation:", error);
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          updatingAuthorization: null,
          agentCredits: state.agentCredits?.map((agent) => agent.userId === user.userId ? __spreadProps(__spreadValues({}, agent), { authorized: previousStatus }) : agent)
        }));
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Impossible de modifier l'autorisation",
          life: 3e3
        });
      }
    });
  }
  isUpdatingAuthorization(userId) {
    return this.state().updatingAuthorization === userId;
  }
  // Statistiques calculées
  get totalUsers() {
    return this.state().users?.length || 0;
  }
  get activeUsers() {
    return this.state().users?.filter((u) => u.enabled).length || 0;
  }
  get totalAgents() {
    return this.state().agentCredits?.length || 0;
  }
  get authorizedAgents() {
    return this.state().agentCredits?.filter((a) => a.authorized).length || 0;
  }
  static \u0275fac = function AdminComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminComponent, selectors: [["app-admin"]], viewQuery: function AdminComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
      \u0275\u0275viewQuery(_c1, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.dtUsers = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.dtAgents = _t.first);
    }
  }, features: [\u0275\u0275ProvidersFeature([ConfirmationService])], decls: 74, vars: 8, consts: [["dtAgents", ""], ["dtUsers", ""], [1, "flex", "flex-wrap", "gap-3", "mb-4"], [1, "flex-1", 2, "min-width", "200px"], [1, "card", "stat-card", "bg-blue-50", "border-left-3", "border-blue-500", "h-full", "m-0"], [1, "flex", "justify-content-between", "align-items-center"], [1, "text-blue-600", "font-medium", "text-sm"], [1, "text-3xl", "font-bold", "text-blue-700", "mt-1"], [1, "bg-blue-100", "p-3", "border-circle"], [1, "pi", "pi-users", "text-blue-600", "text-2xl"], [1, "card", "stat-card", "bg-green-50", "border-left-3", "border-green-500", "h-full", "m-0"], [1, "text-green-600", "font-medium", "text-sm"], [1, "text-3xl", "font-bold", "text-green-700", "mt-1"], [1, "bg-green-100", "p-3", "border-circle"], [1, "pi", "pi-check-circle", "text-green-600", "text-2xl"], [1, "card", "stat-card", "bg-purple-50", "border-left-3", "border-purple-500", "h-full", "m-0"], [1, "text-purple-600", "font-medium", "text-sm"], [1, "text-3xl", "font-bold", "text-purple-700", "mt-1"], [1, "bg-purple-100", "p-3", "border-circle"], [1, "pi", "pi-id-card", "text-purple-600", "text-2xl"], [1, "card", "stat-card", "bg-orange-50", "border-left-3", "border-orange-500", "h-full", "m-0"], [1, "text-orange-600", "font-medium", "text-sm"], [1, "text-3xl", "font-bold", "text-orange-700", "mt-1"], [1, "bg-orange-100", "p-3", "border-circle"], [1, "pi", "pi-shield", "text-orange-600", "text-2xl"], [1, "card", "mb-4"], [1, "flex", "flex-column", "md:flex-row", "align-items-start", "md:align-items-center", "justify-content-between", "mb-4", "gap-3"], [1, "flex", "align-items-center", "gap-3"], [1, "bg-primary-100", "p-3", "border-circle"], [1, "pi", "pi-shield", "text-2xl", "text-primary"], [1, "m-0", "text-xl", "font-semibold", "text-surface-900", "dark:text-surface-0"], [1, "text-500", "mt-1", "mb-0", "text-sm"], [1, "flex", "gap-2"], ["pButton", "", "icon", "pi pi-filter-slash", "label", "Effacer filtres", "pTooltip", "R\xE9initialiser tous les filtres", 1, "p-button-outlined", "p-button-secondary", "p-button-sm", 3, "click"], ["pButton", "", "icon", "pi pi-refresh", "label", "Actualiser", 1, "p-button-sm", 3, "click", "loading"], [1, "flex", "flex-column", "gap-3"], ["currentPageReportTemplate", "Affichage de {first} \xE0 {last} sur {totalRecords} agents", "styleClass", "p-datatable-sm", "dataKey", "userId", 3, "value", "paginator", "rows", "rowsPerPageOptions", "showCurrentPageReport", "globalFilterFields", "filterDelay", "rowHover"], [1, "flex", "flex-column", "align-items-center", "justify-content-center", "p-6", "surface-ground", "border-round"], [1, "card"], [1, "pi", "pi-users", "text-2xl", "text-blue-600"], ["pButton", "", "icon", "pi pi-refresh", "pTooltip", "Actualiser la liste", 1, "p-button-outlined", "p-button-sm", 3, "click", "loading"], ["pButton", "", "icon", "pi pi-user-plus", "label", "Nouvel utilisateur", 1, "p-button-sm", 3, "click"], ["responsiveLayout", "scroll", "currentPageReportTemplate", "Affichage de {first} \xE0 {last} sur {totalRecords} utilisateurs", "dataKey", "userId", "styleClass", "p-datatable-sm", 3, "value", "paginator", "rows", "showCurrentPageReport", "rowsPerPageOptions", "globalFilterFields", "filterDelay", "rowHover"], [1, "flex", "align-items-center", "gap-3", "p-3", "surface-ground", "border-round"], ["shape", "circle", "size", "3rem"], [1, "flex-1"], ["width", "60%", "height", "1rem", "styleClass", "mb-2"], ["width", "40%", "height", "0.8rem"], ["width", "6rem", "height", "2rem"], ["pTemplate", "caption"], ["pTemplate", "header"], ["pTemplate", "body"], ["pTemplate", "emptymessage"], [1, "flex", "flex-column", "md:flex-row", "gap-3", "justify-content-between"], [1, "w-full", "md:w-25rem"], [1, "pi", "pi-search"], ["pInputText", "", "type", "text", "placeholder", "Rechercher un agent...", 1, "w-full", 3, "ngModelChange", "input", "ngModel"], ["pSortableColumn", "firstName", 2, "min-width", "200px"], [1, "flex", "align-items-center"], ["field", "firstName"], ["pSortableColumn", "username", 2, "min-width", "120px"], ["field", "username"], ["pSortableColumn", "email", 2, "min-width", "200px"], ["field", "email"], [2, "min-width", "120px"], [1, "text-center", 2, "min-width", "100px"], [1, "text-center", 2, "min-width", "180px"], ["pInputText", "", "type", "text", "placeholder", "Filtrer par nom", 1, "w-full", "p-inputtext-sm", 3, "input"], ["pInputText", "", "type", "text", "placeholder", "Filtrer", 1, "w-full", "p-inputtext-sm", 3, "input"], ["pInputText", "", "type", "text", "placeholder", "Filtrer par email", 1, "w-full", "p-inputtext-sm", 3, "input"], ["placeholder", "Tous", "styleClass", "w-full p-inputtext-sm", 3, "onChange", "options", "showClear"], [1, "hover-row"], ["size", "large", "shape", "circle", 3, "image", "label"], [1, "font-semibold", "text-surface-900"], [1, "text-500", "text-sm"], [1, "font-mono", "text-sm"], [1, "text-primary", "no-underline", "hover:underline", 3, "href"], [3, "label"], [1, "text-center"], ["value", "Actif", "severity", "success", "icon", "pi pi-check", 3, "rounded"], ["value", "Inactif", "severity", "danger", "icon", "pi pi-times", 3, "rounded"], [1, "flex", "align-items-center", "justify-content-center", "gap-3"], [1, "flex", "align-items-center", "gap-2"], [1, "pi", "pi-spin", "pi-spinner", "text-primary", "text-xl"], [1, "text-sm", "text-500"], ["tooltipPosition", "top", 3, "ngModelChange", "onChange", "ngModel", "pTooltip"], [3, "value", "severity", "rounded"], ["colspan", "6"], [1, "flex", "flex-column", "align-items-center", "justify-content-center", "p-5"], [1, "pi", "pi-inbox", "text-5xl", "text-300", "mb-3"], [1, "text-lg", "font-medium", "text-500"], [1, "text-sm", "text-400", "mt-1"], [1, "pi", "pi-inbox", "text-6xl", "text-300", "mb-3"], [1, "text-xl", "font-medium", "text-500"], [1, "text-sm", "text-400", "mt-2"], ["shape", "circle", "size", "2.5rem"], ["width", "50%", "height", "1rem", "styleClass", "mb-2"], ["width", "30%", "height", "0.8rem"], ["width", "5rem", "height", "1.5rem"], ["width", "8rem", "height", "1rem"], ["pInputText", "", "type", "text", "placeholder", "Rechercher un utilisateur...", 1, "w-full", 3, "ngModelChange", "input", "ngModel"], ["pSortableColumn", "userId", 2, "width", "80px"], ["field", "userId"], ["pSortableColumn", "email", 2, "min-width", "220px"], ["pSortableColumn", "role", 2, "min-width", "140px"], ["field", "role"], ["pSortableColumn", "createdAt", 2, "min-width", "150px"], ["field", "createdAt"], ["pSortableColumn", "lastLogin", 2, "min-width", "150px"], ["field", "lastLogin"], [1, "text-center", 2, "width", "120px"], ["pInputText", "", "type", "text", "placeholder", "ID", 1, "w-full", "p-inputtext-sm", 2, "max-width", "60px", 3, "input"], ["placeholder", "Tous les r\xF4les", "styleClass", "w-full p-inputtext-sm", 3, "onChange", "options", "showClear"], ["dateFormat", "dd/mm/yy", "placeholder", "Filtrer par date", "styleClass", "w-full p-inputtext-sm", 3, "onSelect", "onClear", "showClear", "showIcon"], [1, "font-mono", "text-500", "text-sm"], [1, "text-500", "text-sm", "font-mono"], [1, "pi", "pi-calendar", "text-400"], [1, "text-sm"], [1, "text-xs", "text-400", "mt-1"], [1, "text-400", "text-sm", "font-italic"], [1, "flex", "gap-1", "justify-content-center"], ["pButton", "", "icon", "pi pi-eye", "pTooltip", "Voir les d\xE9tails", "tooltipPosition", "top", 1, "p-button-rounded", "p-button-text", "p-button-sm", "p-button-info"], ["pButton", "", "icon", "pi pi-pencil", "pTooltip", "Modifier", "tooltipPosition", "top", 1, "p-button-rounded", "p-button-text", "p-button-sm", "p-button-warning", 3, "click"], ["pButton", "", "icon", "pi pi-trash", "pTooltip", "Supprimer", "tooltipPosition", "top", 1, "p-button-rounded", "p-button-text", "p-button-sm", "p-button-danger", 3, "click"], [1, "pi", "pi-clock", "text-400"], ["colspan", "7"], [1, "pi", "pi-users", "text-5xl", "text-300", "mb-3"], ["pButton", "", "label", "Cr\xE9er un utilisateur", "icon", "pi pi-plus", 1, "p-button-outlined", "mt-3", 3, "click"]], template: function AdminComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 2)(1, "div", 3)(2, "div", 4)(3, "div", 5)(4, "div")(5, "span", 6);
      \u0275\u0275text(6, "Total Utilisateurs");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "div", 7);
      \u0275\u0275text(8);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(9, "div", 8);
      \u0275\u0275element(10, "i", 9);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(11, "div", 3)(12, "div", 10)(13, "div", 5)(14, "div")(15, "span", 11);
      \u0275\u0275text(16, "Utilisateurs Actifs");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "div", 12);
      \u0275\u0275text(18);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(19, "div", 13);
      \u0275\u0275element(20, "i", 14);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(21, "div", 3)(22, "div", 15)(23, "div", 5)(24, "div")(25, "span", 16);
      \u0275\u0275text(26, "Agents Cr\xE9dit");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "div", 17);
      \u0275\u0275text(28);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(29, "div", 18);
      \u0275\u0275element(30, "i", 19);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(31, "div", 3)(32, "div", 20)(33, "div", 5)(34, "div")(35, "span", 21);
      \u0275\u0275text(36, "Agents Autoris\xE9s");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "div", 22);
      \u0275\u0275text(38);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(39, "div", 23);
      \u0275\u0275element(40, "i", 24);
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(41, "div", 25)(42, "div", 26)(43, "div", 27)(44, "div", 28);
      \u0275\u0275element(45, "i", 29);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(46, "div")(47, "h2", 30);
      \u0275\u0275text(48, " Gestion des Autorisations ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(49, "p", 31);
      \u0275\u0275text(50, "G\xE9rer les droits d'acc\xE8s des agents cr\xE9dit");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(51, "div", 32)(52, "button", 33);
      \u0275\u0275listener("click", function AdminComponent_Template_button_click_52_listener() {
        return ctx.clearFiltersAgents();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(53, "button", 34);
      \u0275\u0275listener("click", function AdminComponent_Template_button_click_53_listener() {
        return ctx.loadAgentCredits();
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(54, AdminComponent_Conditional_54_Template, 3, 1, "div", 35)(55, AdminComponent_Conditional_55_Template, 6, 11, "p-table", 36)(56, AdminComponent_Conditional_56_Template, 6, 0, "div", 37);
      \u0275\u0275elementEnd();
      \u0275\u0275element(57, "p-divider");
      \u0275\u0275elementStart(58, "div", 38)(59, "div", 26)(60, "div", 27)(61, "div", 8);
      \u0275\u0275element(62, "i", 39);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(63, "div")(64, "h2", 30);
      \u0275\u0275text(65, " Gestion des Utilisateurs ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(66, "p", 31);
      \u0275\u0275text(67, "Liste compl\xE8te des utilisateurs du syst\xE8me");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(68, "div", 32)(69, "button", 33);
      \u0275\u0275listener("click", function AdminComponent_Template_button_click_69_listener() {
        return ctx.clearFiltersUsers();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(70, "button", 40);
      \u0275\u0275listener("click", function AdminComponent_Template_button_click_70_listener() {
        return ctx.loadUsers();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(71, "button", 41);
      \u0275\u0275listener("click", function AdminComponent_Template_button_click_71_listener() {
        return ctx.navigateToCreateUser();
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(72, AdminComponent_Conditional_72_Template, 3, 1, "div", 35)(73, AdminComponent_Conditional_73_Template, 6, 11, "p-table", 42);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate(ctx.totalUsers);
      \u0275\u0275advance(10);
      \u0275\u0275textInterpolate(ctx.activeUsers);
      \u0275\u0275advance(10);
      \u0275\u0275textInterpolate(ctx.totalAgents);
      \u0275\u0275advance(10);
      \u0275\u0275textInterpolate(ctx.authorizedAgents);
      \u0275\u0275advance(15);
      \u0275\u0275property("loading", ctx.state().loadingAgentCredits);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.state().loadingAgentCredits ? 54 : ctx.state().agentCredits && ctx.state().agentCredits.length > 0 ? 55 : 56);
      \u0275\u0275advance(16);
      \u0275\u0275property("loading", ctx.state().loading);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.state().loading ? 72 : 73);
    }
  }, dependencies: [
    CommonModule,
    DatePipe,
    TableModule,
    Table,
    PrimeTemplate,
    SortableColumn,
    SortIcon,
    InputTextModule,
    InputText,
    ProgressBarModule,
    ButtonModule,
    ButtonDirective,
    IconField,
    InputIcon,
    TagModule,
    Tag,
    FormsModule,
    DefaultValueAccessor,
    NgControlStatus,
    NgModel,
    InputSwitchModule,
    InputSwitch,
    TooltipModule,
    Tooltip,
    DividerModule,
    Divider,
    ProgressSpinnerModule,
    DropdownModule,
    Dropdown,
    MultiSelectModule,
    CalendarModule,
    Calendar,
    CardModule,
    BadgeModule,
    AvatarModule,
    Avatar,
    SkeletonModule,
    Skeleton,
    ChipModule,
    Chip
  ], styles: ["\n\n.stat-card[_ngcontent-%COMP%] {\n  transition: transform 0.2s ease, box-shadow 0.2s ease;\n}\n.stat-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n}\n.border-left-3[_ngcontent-%COMP%] {\n  border-left: 3px solid;\n}\n.hover-row[_ngcontent-%COMP%] {\n  transition: background-color 0.2s ease;\n}\n.hover-row[_ngcontent-%COMP%]:hover {\n  background-color: var(--surface-50) !important;\n}\n[_nghost-%COMP%]     .p-avatar {\n  font-weight: 600;\n  font-size: 0.875rem;\n}\n[_nghost-%COMP%]     .p-datatable .p-datatable-header {\n  background: transparent;\n  border: none;\n  padding: 1rem 0;\n}\n[_nghost-%COMP%]     .p-datatable .p-datatable-thead > tr > th {\n  background: var(--surface-50);\n  font-weight: 600;\n  color: var(--surface-700);\n  border-color: var(--surface-200);\n}\n[_nghost-%COMP%]     .p-datatable .p-datatable-thead > tr > th:first-child {\n  border-top-left-radius: 8px;\n}\n[_nghost-%COMP%]     .p-datatable .p-datatable-thead > tr > th:last-child {\n  border-top-right-radius: 8px;\n}\n[_nghost-%COMP%]     .p-datatable .p-datatable-tbody > tr:last-child > td {\n  border-bottom: none;\n}\n[_nghost-%COMP%]     .p-datatable .p-datatable-tbody > tr > td {\n  padding: 1rem;\n  vertical-align: middle;\n}\n[_nghost-%COMP%]     .p-datatable .p-datatable-thead > tr:nth-child(2) > th {\n  padding: 0.5rem;\n  background: var(--surface-0);\n  border-top: none;\n}\n[_nghost-%COMP%]     .p-inputtext-sm {\n  font-size: 0.875rem;\n  padding: 0.5rem 0.75rem;\n}\n[_nghost-%COMP%]     .p-dropdown.p-inputtext-sm .p-dropdown-label {\n  font-size: 0.875rem;\n  padding: 0.5rem 0.75rem;\n}\n[_nghost-%COMP%]     .p-calendar.p-inputtext-sm .p-inputtext {\n  font-size: 0.875rem;\n  padding: 0.5rem 0.75rem;\n}\n[_nghost-%COMP%]     .p-tag {\n  font-weight: 500;\n}\n[_nghost-%COMP%]     .p-tag.p-tag-rounded {\n  border-radius: 1rem;\n}\n[_nghost-%COMP%]     .p-chip {\n  font-size: 0.75rem;\n  font-weight: 500;\n}\n[_nghost-%COMP%]     .p-button-sm {\n  font-size: 0.875rem;\n}\n[_nghost-%COMP%]     .p-button-sm .p-button-icon {\n  font-size: 0.875rem;\n}\n[_nghost-%COMP%]     .p-progress-spinner {\n  width: 40px;\n  height: 40px;\n}\n[_nghost-%COMP%]     .p-inputswitch.p-inputswitch-checked .p-inputswitch-slider {\n  background: var(--green-500);\n}\n[_nghost-%COMP%]     .p-paginator {\n  padding: 1rem;\n  background: transparent;\n  border: none;\n}\n[_nghost-%COMP%]     .p-paginator .p-paginator-current {\n  color: var(--surface-500);\n  font-size: 0.875rem;\n}\n[_nghost-%COMP%]     .p-iconfield .p-inputicon {\n  color: var(--surface-400);\n}\n.section-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  margin-bottom: 1.5rem;\n}\n.section-header[_ngcontent-%COMP%]   .icon-wrapper[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.section-header[_ngcontent-%COMP%]   .icon-wrapper[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n}\n.section-header[_ngcontent-%COMP%]   .text-wrapper[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.25rem;\n  font-weight: 600;\n}\n.section-header[_ngcontent-%COMP%]   .text-wrapper[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.25rem 0 0;\n  font-size: 0.875rem;\n  color: var(--surface-500);\n}\n.empty-state[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 3rem;\n}\n.empty-state[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 4rem;\n  color: var(--surface-300);\n  margin-bottom: 1rem;\n}\n.empty-state[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-size: 1.125rem;\n  font-weight: 500;\n  color: var(--surface-600);\n  margin-bottom: 0.5rem;\n}\n.empty-state[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  color: var(--surface-400);\n}\n@media screen and (max-width: 768px) {\n  [_nghost-%COMP%]     .p-datatable .p-datatable-thead > tr > th, \n   [_nghost-%COMP%]     .p-datatable .p-datatable-tbody > tr > td {\n    padding: 0.75rem 0.5rem;\n  }\n  .stat-card[_ngcontent-%COMP%]   .text-3xl[_ngcontent-%COMP%] {\n    font-size: 1.5rem !important;\n  }\n}\n.dark[_nghost-%COMP%]   .stat-card[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .stat-card[_ngcontent-%COMP%]:hover {\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);\n}\n.dark[_nghost-%COMP%]   .hover-row[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .hover-row[_ngcontent-%COMP%]:hover {\n  background-color: var(--surface-800) !important;\n}\n@keyframes _ngcontent-%COMP%_shimmer {\n  0% {\n    background-position: -200% 0;\n  }\n  100% {\n    background-position: 200% 0;\n  }\n}\n[_nghost-%COMP%]     .p-skeleton {\n  animation: _ngcontent-%COMP%_shimmer 1.5s infinite;\n  background:\n    linear-gradient(\n      90deg,\n      var(--surface-200) 25%,\n      var(--surface-100) 50%,\n      var(--surface-200) 75%);\n  background-size: 200% 100%;\n}\n/*# sourceMappingURL=admin.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminComponent, { className: "AdminComponent", filePath: "src/app/pages/dashboard/admin/admin.component.ts", lineNumber: 64 });
})();

export {
  AdminComponent
};
//# sourceMappingURL=chunk-ZDAPBKCA.js.map
