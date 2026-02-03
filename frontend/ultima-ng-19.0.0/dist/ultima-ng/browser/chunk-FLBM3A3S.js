import {
  FluidModule
} from "./chunk-KPJXCGM6.js";
import {
  ImageModule
} from "./chunk-EUWFULGH.js";
import "./chunk-UZIOTGW7.js";
import {
  TextareaModule
} from "./chunk-RW4OSSQT.js";
import {
  Message,
  MessageModule
} from "./chunk-CSEZIGTY.js";
import "./chunk-CXW3XKZ2.js";
import {
  Toast,
  ToastModule
} from "./chunk-6SRYYUT2.js";
import {
  DividerModule
} from "./chunk-VDET62CU.js";
import {
  Calendar,
  CalendarModule
} from "./chunk-NLXNXYLN.js";
import {
  TableModule
} from "./chunk-REDVHUQC.js";
import "./chunk-YZRRSC3U.js";
import "./chunk-6K6X5UBT.js";
import "./chunk-7HJ4XJ7U.js";
import {
  SelectModule
} from "./chunk-UQSIOFSP.js";
import "./chunk-OCW7T434.js";
import "./chunk-4JIPYACT.js";
import "./chunk-6GA37Q7Z.js";
import "./chunk-544F7IXR.js";
import "./chunk-YBM6FZLP.js";
import "./chunk-U4P2VV4G.js";
import "./chunk-CPYA4VSS.js";
import {
  CardModule
} from "./chunk-H46GQ57A.js";
import {
  InputNumber,
  InputNumberModule
} from "./chunk-JGOABXTK.js";
import "./chunk-HY2A3TN6.js";
import "./chunk-YEN5RMZS.js";
import "./chunk-XS7IVZ5T.js";
import "./chunk-CUABQE42.js";
import {
  Dropdown,
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
  Router
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
  ConfirmationService,
  MessageService
} from "./chunk-NQNBRQ7H.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  ReactiveFormsModule,
  RequiredValidator,
  Validators,
  ɵNgNoValidate
} from "./chunk-3HTR5OU7.js";
import {
  UserService
} from "./chunk-SQ5BRWVW.js";
import "./chunk-ZRELZ6R7.js";
import "./chunk-BMYIFZHZ.js";
import "./chunk-W3K3GK4Z.js";
import {
  CommonModule
} from "./chunk-SQQPVFHK.js";
import {
  DestroyRef,
  EMPTY,
  inject,
  map,
  signal,
  switchMap,
  tap,
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
  ɵɵpropertyInterpolate,
  ɵɵpureFunction0,
  ɵɵpureFunction2,
  ɵɵpureFunction3,
  ɵɵpureFunction4,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext
} from "./chunk-ZKKMBKIA.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/pages/dashboard/agent-credit/fiche-signaletique/fiche-signaletique.component.ts
var _c0 = () => ({ label: "Regular", value: "REGULAR" });
var _c1 = () => ({ label: "Premium", value: "PREMIUM" });
var _c2 = () => ({ label: "VIP", value: "VIP" });
var _c3 = (a0, a1, a2) => [a0, a1, a2];
var _c4 = () => ({ label: "Male", value: "M" });
var _c5 = () => ({ label: "Female", value: "F" });
var _c6 = (a0, a1) => [a0, a1];
var _c7 = () => ({ label: "National ID", value: "NATIONAL_ID" });
var _c8 = () => ({ label: "Passport", value: "PASSPORT" });
var _c9 = () => ({ label: "Driver License", value: "DRIVER_LICENSE" });
var _c10 = () => ({ label: "Birth Certificate", value: "BIRTH_CERTIFICATE" });
var _c11 = (a0, a1, a2, a3) => [a0, a1, a2, a3];
var _c12 = () => ({ label: "Individual", value: "I" });
var _c13 = () => ({ label: "Company", value: "C" });
var _c14 = () => ({ label: "Owner", value: "P" });
var _c15 = () => ({ label: "Tenant", value: "L" });
var _c16 = () => ({ label: "Active", value: "ACTIVE" });
var _c17 = () => ({ label: "Inactive", value: "INACTIVE" });
var _c18 = () => ({ label: "Suspended", value: "SUSPENDED" });
function FicheSignaletiqueComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, "Edit Individuel");
  }
}
function FicheSignaletiqueComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, "New Individuel");
  }
}
function FicheSignaletiqueComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3);
    \u0275\u0275element(1, "p-progressSpinner");
    \u0275\u0275elementEnd();
  }
}
function FicheSignaletiqueComponent_Conditional_7_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 12);
    \u0275\u0275text(1, "Required");
    \u0275\u0275elementEnd();
  }
}
function FicheSignaletiqueComponent_Conditional_7_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 12);
    \u0275\u0275text(1, "Required");
    \u0275\u0275elementEnd();
  }
}
function FicheSignaletiqueComponent_Conditional_7_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 12);
    \u0275\u0275text(1, "Required");
    \u0275\u0275elementEnd();
  }
}
function FicheSignaletiqueComponent_Conditional_7_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 12);
    \u0275\u0275text(1, "Required");
    \u0275\u0275elementEnd();
  }
}
function FicheSignaletiqueComponent_Conditional_7_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 12);
    \u0275\u0275text(1, "Required");
    \u0275\u0275elementEnd();
  }
}
function FicheSignaletiqueComponent_Conditional_7_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 12);
    \u0275\u0275text(1, "Required");
    \u0275\u0275elementEnd();
  }
}
function FicheSignaletiqueComponent_Conditional_7_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 12);
    \u0275\u0275text(1, "Required");
    \u0275\u0275elementEnd();
  }
}
function FicheSignaletiqueComponent_Conditional_7_Conditional_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 12);
    \u0275\u0275text(1, "Required");
    \u0275\u0275elementEnd();
  }
}
function FicheSignaletiqueComponent_Conditional_7_Conditional_51_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 12);
    \u0275\u0275text(1, "Required");
    \u0275\u0275elementEnd();
  }
}
function FicheSignaletiqueComponent_Conditional_7_Conditional_56_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 12);
    \u0275\u0275text(1, "Required");
    \u0275\u0275elementEnd();
  }
}
function FicheSignaletiqueComponent_Conditional_7_Conditional_66_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 12);
    \u0275\u0275text(1, "Required");
    \u0275\u0275elementEnd();
  }
}
function FicheSignaletiqueComponent_Conditional_7_Conditional_71_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 12);
    \u0275\u0275text(1, "Invalid");
    \u0275\u0275elementEnd();
  }
}
function FicheSignaletiqueComponent_Conditional_7_Conditional_105_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 12);
    \u0275\u0275text(1, "Required");
    \u0275\u0275elementEnd();
  }
}
function FicheSignaletiqueComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 6);
    \u0275\u0275listener("ngSubmit", function FicheSignaletiqueComponent_Conditional_7_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSubmit());
    });
    \u0275\u0275elementStart(1, "div", 7)(2, "div", 8)(3, "div", 0)(4, "h3");
    \u0275\u0275text(5, "Personal Information");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 7)(7, "div", 9)(8, "label", 10);
    \u0275\u0275text(9, "Member Category*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(10, "p-dropdown", 11);
    \u0275\u0275template(11, FicheSignaletiqueComponent_Conditional_7_Conditional_11_Template, 2, 0, "small", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 9)(13, "label", 13);
    \u0275\u0275text(14, "Member Number*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(15, "input", 14);
    \u0275\u0275template(16, FicheSignaletiqueComponent_Conditional_7_Conditional_16_Template, 2, 0, "small", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 9)(18, "label", 15);
    \u0275\u0275text(19, "Gender*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(20, "p-dropdown", 16);
    \u0275\u0275template(21, FicheSignaletiqueComponent_Conditional_7_Conditional_21_Template, 2, 0, "small", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "div", 9)(23, "label", 17);
    \u0275\u0275text(24, "Last Name*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(25, "input", 18);
    \u0275\u0275template(26, FicheSignaletiqueComponent_Conditional_7_Conditional_26_Template, 2, 0, "small", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "div", 9)(28, "label", 19);
    \u0275\u0275text(29, "First Name*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(30, "input", 20);
    \u0275\u0275template(31, FicheSignaletiqueComponent_Conditional_7_Conditional_31_Template, 2, 0, "small", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "div", 9)(33, "label", 21);
    \u0275\u0275text(34, "Date of Birth*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(35, "p-calendar", 22);
    \u0275\u0275template(36, FicheSignaletiqueComponent_Conditional_7_Conditional_36_Template, 2, 0, "small", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "div", 23)(38, "label", 24);
    \u0275\u0275text(39, "Place of Birth*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(40, "input", 25);
    \u0275\u0275template(41, FicheSignaletiqueComponent_Conditional_7_Conditional_41_Template, 2, 0, "small", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "div", 23)(43, "label", 26);
    \u0275\u0275text(44, "Nationality*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(45, "input", 27);
    \u0275\u0275template(46, FicheSignaletiqueComponent_Conditional_7_Conditional_46_Template, 2, 0, "small", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "div", 9)(48, "label", 28);
    \u0275\u0275text(49, "ID Type*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(50, "p-dropdown", 29);
    \u0275\u0275template(51, FicheSignaletiqueComponent_Conditional_7_Conditional_51_Template, 2, 0, "small", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(52, "div", 9)(53, "label", 30);
    \u0275\u0275text(54, "ID Number*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(55, "input", 31);
    \u0275\u0275template(56, FicheSignaletiqueComponent_Conditional_7_Conditional_56_Template, 2, 0, "small", 12);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(57, "div", 8)(58, "div", 32)(59, "h3");
    \u0275\u0275text(60, "Contact Information");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(61, "div", 7)(62, "div", 9)(63, "label", 33);
    \u0275\u0275text(64, "Phone Number*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(65, "input", 34);
    \u0275\u0275template(66, FicheSignaletiqueComponent_Conditional_7_Conditional_66_Template, 2, 0, "small", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(67, "div", 9)(68, "label", 35);
    \u0275\u0275text(69, "Alternative Phone");
    \u0275\u0275elementEnd();
    \u0275\u0275element(70, "input", 36);
    \u0275\u0275template(71, FicheSignaletiqueComponent_Conditional_7_Conditional_71_Template, 2, 0, "small", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(72, "div", 9)(73, "label", 37);
    \u0275\u0275text(74, "City");
    \u0275\u0275elementEnd();
    \u0275\u0275element(75, "input", 38);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(76, "div", 9)(77, "label", 39);
    \u0275\u0275text(78, "Neighborhood");
    \u0275\u0275elementEnd();
    \u0275\u0275element(79, "input", 40);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(80, "div", 9)(81, "label", 41);
    \u0275\u0275text(82, "District");
    \u0275\u0275elementEnd();
    \u0275\u0275element(83, "input", 42);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(84, "div", 9)(85, "label", 43);
    \u0275\u0275text(86, "Sector");
    \u0275\u0275elementEnd();
    \u0275\u0275element(87, "input", 44);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(88, "div", 45)(89, "label", 46);
    \u0275\u0275text(90, "Address");
    \u0275\u0275elementEnd();
    \u0275\u0275element(91, "textarea", 47);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(92, "div", 9)(93, "label", 48);
    \u0275\u0275text(94, "Canton Code");
    \u0275\u0275elementEnd();
    \u0275\u0275element(95, "input", 49);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(96, "div", 8)(97, "div", 32)(98, "h3");
    \u0275\u0275text(99, "Professional & Family Information");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(100, "div", 7)(101, "div", 9)(102, "label", 50);
    \u0275\u0275text(103, "Profession*");
    \u0275\u0275elementEnd();
    \u0275\u0275element(104, "input", 51);
    \u0275\u0275template(105, FicheSignaletiqueComponent_Conditional_7_Conditional_105_Template, 2, 0, "small", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(106, "div", 9)(107, "label", 52);
    \u0275\u0275text(108, "Activity");
    \u0275\u0275elementEnd();
    \u0275\u0275element(109, "input", 53);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(110, "div", 9)(111, "label", 54);
    \u0275\u0275text(112, "Business Type");
    \u0275\u0275elementEnd();
    \u0275\u0275element(113, "p-dropdown", 55);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(114, "div", 9)(115, "label", 56);
    \u0275\u0275text(116, "Service Provider");
    \u0275\u0275elementEnd();
    \u0275\u0275element(117, "input", 57);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(118, "div", 9)(119, "label", 58);
    \u0275\u0275text(120, "Father's Name");
    \u0275\u0275elementEnd();
    \u0275\u0275element(121, "input", 59);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(122, "div", 9)(123, "label", 60);
    \u0275\u0275text(124, "Mother's Name");
    \u0275\u0275elementEnd();
    \u0275\u0275element(125, "input", 61);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(126, "div", 9)(127, "label", 62);
    \u0275\u0275text(128, "Spouse's Name");
    \u0275\u0275elementEnd();
    \u0275\u0275element(129, "input", 63);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(130, "div", 9)(131, "label", 64);
    \u0275\u0275text(132, "Relationship");
    \u0275\u0275elementEnd();
    \u0275\u0275element(133, "input", 65);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(134, "div", 9)(135, "label", 66);
    \u0275\u0275text(136, "Parent's Name");
    \u0275\u0275elementEnd();
    \u0275\u0275element(137, "input", 67);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(138, "div", 9)(139, "label", 68);
    \u0275\u0275text(140, "Number of Children");
    \u0275\u0275elementEnd();
    \u0275\u0275element(141, "p-inputNumber", 69);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(142, "div", 9)(143, "label", 70);
    \u0275\u0275text(144, "Number of Parents");
    \u0275\u0275elementEnd();
    \u0275\u0275element(145, "p-inputNumber", 71);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(146, "div", 9)(147, "label", 72);
    \u0275\u0275text(148, "Number of Others");
    \u0275\u0275elementEnd();
    \u0275\u0275element(149, "p-inputNumber", 73);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(150, "div", 8)(151, "div", 32)(152, "h3");
    \u0275\u0275text(153, "Housing Information");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(154, "div", 7)(155, "div", 23)(156, "label", 74);
    \u0275\u0275text(157, "Housing Type");
    \u0275\u0275elementEnd();
    \u0275\u0275element(158, "p-dropdown", 75);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(159, "div", 23)(160, "label", 76);
    \u0275\u0275text(161, "Number of Years");
    \u0275\u0275elementEnd();
    \u0275\u0275element(162, "p-inputNumber", 77);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(163, "div", 23)(164, "label", 78);
    \u0275\u0275text(165, "Years in Housing");
    \u0275\u0275elementEnd();
    \u0275\u0275element(166, "p-inputNumber", 79);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(167, "div", 8)(168, "div", 32)(169, "h3");
    \u0275\u0275text(170, "Membership Details");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(171, "div", 7)(172, "div", 23)(173, "label", 80);
    \u0275\u0275text(174, "Member Status");
    \u0275\u0275elementEnd();
    \u0275\u0275element(175, "p-dropdown", 81);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(176, "div", 23)(177, "label", 82);
    \u0275\u0275text(178, "Contribution Amount");
    \u0275\u0275elementEnd();
    \u0275\u0275element(179, "p-inputNumber", 83);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(180, "div", 23)(181, "label", 84);
    \u0275\u0275text(182, "Entrance Fee");
    \u0275\u0275elementEnd();
    \u0275\u0275element(183, "p-inputNumber", 85);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(184, "div", 86)(185, "p-button", 87);
    \u0275\u0275listener("click", function FicheSignaletiqueComponent_Conditional_7_Template_p_button_click_185_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cancelEdit());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(186, "p-button", 88);
    \u0275\u0275listener("click", function FicheSignaletiqueComponent_Conditional_7_Template_p_button_click_186_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.resetForm());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(187, "p-button", 89);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_4_0;
    let tmp_6_0;
    let tmp_9_0;
    let tmp_11_0;
    let tmp_13_0;
    let tmp_16_0;
    let tmp_18_0;
    let tmp_20_0;
    let tmp_23_0;
    let tmp_25_0;
    let tmp_27_0;
    let tmp_28_0;
    let tmp_30_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("formGroup", ctx_r1.updateForm);
    \u0275\u0275advance(10);
    \u0275\u0275property("options", \u0275\u0275pureFunction3(47, _c3, \u0275\u0275pureFunction0(44, _c0), \u0275\u0275pureFunction0(45, _c1), \u0275\u0275pureFunction0(46, _c2)))("required", true);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_4_0 = ctx_r1.updateForm.get("catMembre")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = ctx_r1.updateForm.get("catMembre")) == null ? null : tmp_4_0.touched) ? 11 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("required", true);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_6_0 = ctx_r1.updateForm.get("numeroMembre")) == null ? null : tmp_6_0.invalid) && ((tmp_6_0 = ctx_r1.updateForm.get("numeroMembre")) == null ? null : tmp_6_0.touched) ? 16 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("options", \u0275\u0275pureFunction2(53, _c6, \u0275\u0275pureFunction0(51, _c4), \u0275\u0275pureFunction0(52, _c5)))("required", true);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_9_0 = ctx_r1.updateForm.get("sexe")) == null ? null : tmp_9_0.invalid) && ((tmp_9_0 = ctx_r1.updateForm.get("sexe")) == null ? null : tmp_9_0.touched) ? 21 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("required", true);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_11_0 = ctx_r1.updateForm.get("nom")) == null ? null : tmp_11_0.invalid) && ((tmp_11_0 = ctx_r1.updateForm.get("nom")) == null ? null : tmp_11_0.touched) ? 26 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("required", true);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_13_0 = ctx_r1.updateForm.get("prenom")) == null ? null : tmp_13_0.invalid) && ((tmp_13_0 = ctx_r1.updateForm.get("prenom")) == null ? null : tmp_13_0.touched) ? 31 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("showIcon", true)("required", true);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_16_0 = ctx_r1.updateForm.get("dateNaissance")) == null ? null : tmp_16_0.invalid) && ((tmp_16_0 = ctx_r1.updateForm.get("dateNaissance")) == null ? null : tmp_16_0.touched) ? 36 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("required", true);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_18_0 = ctx_r1.updateForm.get("lieuxNaissance")) == null ? null : tmp_18_0.invalid) && ((tmp_18_0 = ctx_r1.updateForm.get("lieuxNaissance")) == null ? null : tmp_18_0.touched) ? 41 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("required", true);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_20_0 = ctx_r1.updateForm.get("nationalite")) == null ? null : tmp_20_0.invalid) && ((tmp_20_0 = ctx_r1.updateForm.get("nationalite")) == null ? null : tmp_20_0.touched) ? 46 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("options", \u0275\u0275pureFunction4(60, _c11, \u0275\u0275pureFunction0(56, _c7), \u0275\u0275pureFunction0(57, _c8), \u0275\u0275pureFunction0(58, _c9), \u0275\u0275pureFunction0(59, _c10)))("required", true);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_23_0 = ctx_r1.updateForm.get("typePiece")) == null ? null : tmp_23_0.invalid) && ((tmp_23_0 = ctx_r1.updateForm.get("typePiece")) == null ? null : tmp_23_0.touched) ? 51 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("required", true);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_25_0 = ctx_r1.updateForm.get("numeroPiece")) == null ? null : tmp_25_0.invalid) && ((tmp_25_0 = ctx_r1.updateForm.get("numeroPiece")) == null ? null : tmp_25_0.touched) ? 56 : -1);
    \u0275\u0275advance(9);
    \u0275\u0275property("required", true);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_27_0 = ctx_r1.updateForm.get("telephone")) == null ? null : tmp_27_0.invalid) && ((tmp_27_0 = ctx_r1.updateForm.get("telephone")) == null ? null : tmp_27_0.touched) ? 66 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(((tmp_28_0 = ctx_r1.updateForm.get("telephone2")) == null ? null : tmp_28_0.invalid) && ((tmp_28_0 = ctx_r1.updateForm.get("telephone2")) == null ? null : tmp_28_0.touched) ? 71 : -1);
    \u0275\u0275advance(33);
    \u0275\u0275property("required", true);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_30_0 = ctx_r1.updateForm.get("profession")) == null ? null : tmp_30_0.invalid) && ((tmp_30_0 = ctx_r1.updateForm.get("profession")) == null ? null : tmp_30_0.touched) ? 105 : -1);
    \u0275\u0275advance(8);
    \u0275\u0275property("options", \u0275\u0275pureFunction2(67, _c6, \u0275\u0275pureFunction0(65, _c12), \u0275\u0275pureFunction0(66, _c13)));
    \u0275\u0275advance(28);
    \u0275\u0275property("min", 0)("showButtons", true);
    \u0275\u0275advance(4);
    \u0275\u0275property("min", 0)("showButtons", true);
    \u0275\u0275advance(4);
    \u0275\u0275property("min", 0)("showButtons", true);
    \u0275\u0275advance(9);
    \u0275\u0275property("options", \u0275\u0275pureFunction2(72, _c6, \u0275\u0275pureFunction0(70, _c14), \u0275\u0275pureFunction0(71, _c15)));
    \u0275\u0275advance(4);
    \u0275\u0275property("min", 0)("showButtons", true);
    \u0275\u0275advance(4);
    \u0275\u0275property("min", 0)("showButtons", true);
    \u0275\u0275advance(9);
    \u0275\u0275property("options", \u0275\u0275pureFunction3(78, _c3, \u0275\u0275pureFunction0(75, _c16), \u0275\u0275pureFunction0(76, _c17), \u0275\u0275pureFunction0(77, _c18)));
    \u0275\u0275advance(12);
    \u0275\u0275property("loading", ctx_r1.state().loading);
  }
}
function FicheSignaletiqueComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 5);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275propertyInterpolate("text", ctx_r1.state().error);
  }
}
var FicheSignaletiqueComponent = class _FicheSignaletiqueComponent {
  state = signal({
    loading: false,
    message: void 0,
    error: void 0
  });
  updateForm;
  userService = inject(UserService);
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  activatedRouter = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  messageService = inject(MessageService);
  constructor() {
    this.updateForm = this.fb.group({
      catMembre: ["", Validators.required],
      numeroMembre: ["", Validators.required],
      nom: ["", [Validators.required, Validators.maxLength(25)]],
      prenom: ["", [Validators.required, Validators.maxLength(25)]],
      dateNaissance: [null, Validators.required],
      lieuxNaissance: ["", [Validators.required, Validators.maxLength(25)]],
      nationalite: ["", [Validators.required, Validators.maxLength(25)]],
      telephone: ["", [Validators.required, Validators.pattern(/^\+?[0-9]{8,15}$/)]],
      telephone2: ["", Validators.pattern(/^\+?[0-9]{8,15}$/)],
      typePiece: ["", Validators.required],
      numeroPiece: ["", Validators.required],
      sexe: ["", Validators.required],
      profession: ["", [Validators.required, Validators.maxLength(255)]],
      nomPere: ["", Validators.maxLength(25)],
      nomMere: ["", Validators.maxLength(25)],
      activite: ["", Validators.maxLength(255)],
      nbreEnfant: [0, Validators.min(0)],
      nbreParent: [0, Validators.min(0)],
      nbreAutre: [0, Validators.min(0)],
      quartier: ["", Validators.maxLength(255)],
      district: ["", Validators.maxLength(255)],
      secteur: ["", Validators.maxLength(255)],
      cotisation: [0, Validators.min(0)],
      droitEntree: [0, Validators.min(0)],
      typeHabitation: [""],
      nbreAnnee: [0, Validators.min(0)],
      statutIndividuel: [""],
      prestataire: [""],
      codCanton: [""],
      ville: ["", Validators.maxLength(255)],
      typeEntreprise: [""],
      lienParente: [""],
      nomParent: [""],
      conjoint: [""],
      nbreAnneeH: [0, Validators.min(0)],
      adresse: ["", Validators.maxLength(255)]
    });
  }
  ngOnInit() {
    this.activatedRouter.paramMap.pipe(switchMap((params) => {
      const numeroMembre = params.get("numeroMembre");
      if (numeroMembre) {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { loading: true, message: void 0, error: void 0 }));
        return this.userService.getInstanceUser$().pipe(
          // Map the response to extract the user
          map((response) => response.data?.user),
          // Now we have an IUser to work with
          tap((user) => {
            if (user) {
              this.state.update((state) => __spreadProps(__spreadValues({}, state), { user }));
              this.updateForm.get("numeroMembre")?.setValue(numeroMembre);
            } else {
              throw new Error("User data not found in response");
            }
          })
        );
      } else {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { loading: false, message: void 0, error: "Invalid numeroMembre" }));
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Invalid member number"
        });
        return EMPTY;
      }
    }), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { loading: false }));
      },
      error: (error) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { loading: false, error: error.message || "Failed to load user data" }));
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.message || "Failed to load user data"
        });
      }
    });
  }
  onSubmit() {
    if (this.updateForm.invalid) {
      this.markFormGroupTouched(this.updateForm);
      this.messageService.add({
        severity: "error",
        summary: "Validation Error",
        detail: "Please fill all required fields correctly"
      });
      return;
    }
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { loading: true, message: void 0, error: void 0 }));
    const formData = this.updateForm.value;
    const individuelData = __spreadProps(__spreadValues({}, formData), {
      // Ensure userId is set from the current user
      userId: this.state().user?.userId || 0,
      // Set created date
      createdAt: /* @__PURE__ */ new Date()
    });
    const numeroMembre = this.updateForm.get("numeroMembre")?.value;
    this.userService.addFicherSignaletique$(individuelData, numeroMembre).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        const individuel = response.data?.individuel;
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          loading: false,
          message: "Member created successfully",
          individuel
        }));
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Member created successfully"
        });
        setTimeout(() => {
          this.router.navigate(["/individuels"]);
        }, 1500);
      },
      error: (error) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          loading: false,
          error: error.message || "Failed to create member"
        }));
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.message || "Failed to create member"
        });
      }
    });
  }
  // Helper method to mark all form controls as touched
  markFormGroupTouched(formGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  // Reset form
  resetForm() {
    this.updateForm.reset();
    this.updateForm.patchValue({
      nbreEnfant: 0,
      nbreParent: 0,
      nbreAutre: 0,
      cotisation: 0,
      droitEntree: 0,
      nbreAnnee: 0,
      nbreAnneeH: 0
    });
  }
  // Cancel and go back
  cancelEdit() {
    this.router.navigate(["/individuels"]);
  }
  static \u0275fac = function FicheSignaletiqueComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FicheSignaletiqueComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FicheSignaletiqueComponent, selectors: [["app-fiche-signaletique"]], features: [\u0275\u0275ProvidersFeature([MessageService, ConfirmationService])], decls: 10, vars: 3, consts: [[1, "card"], [1, "card-header"], [1, "card-body"], [1, "flex", "justify-content-center"], [3, "formGroup"], ["severity", "error", "styleClass", "w-full mt-3", 3, "text"], [3, "ngSubmit", "formGroup"], [1, "grid"], [1, "col-12"], [1, "col-12", "md:col-2", "mb-3"], ["for", "catMembre"], ["id", "catMembre", "formControlName", "catMembre", "optionLabel", "label", "optionValue", "value", "placeholder", "Select Category", 3, "options", "required"], [1, "text-red-500"], ["for", "numeroMembre"], ["id", "numeroMembre", "type", "text", "pInputText", "", "formControlName", "numeroMembre", 3, "required"], ["for", "sexe"], ["id", "sexe", "formControlName", "sexe", "optionLabel", "label", "optionValue", "value", "placeholder", "Select Gender", 3, "options", "required"], ["for", "nom"], ["id", "nom", "type", "text", "pInputText", "", "formControlName", "nom", 3, "required"], ["for", "prenom"], ["id", "prenom", "type", "text", "pInputText", "", "formControlName", "prenom", 3, "required"], ["for", "dateNaissance"], ["id", "dateNaissance", "formControlName", "dateNaissance", "dateFormat", "dd/mm/yy", 3, "showIcon", "required"], [1, "col-12", "md:col-4", "mb-3"], ["for", "lieuxNaissance"], ["id", "lieuxNaissance", "type", "text", "pInputText", "", "formControlName", "lieuxNaissance", 3, "required"], ["for", "nationalite"], ["id", "nationalite", "type", "text", "pInputText", "", "formControlName", "nationalite", 3, "required"], ["for", "typePiece"], ["id", "typePiece", "formControlName", "typePiece", "optionLabel", "label", "optionValue", "value", "placeholder", "Select ID Type", 3, "options", "required"], ["for", "numeroPiece"], ["id", "numeroPiece", "type", "text", "pInputText", "", "formControlName", "numeroPiece", 3, "required"], [1, "card", "mt-3"], ["for", "telephone"], ["id", "telephone", "type", "tel", "pInputText", "", "formControlName", "telephone", 3, "required"], ["for", "telephone2"], ["id", "telephone2", "type", "tel", "pInputText", "", "formControlName", "telephone2"], ["for", "ville"], ["id", "ville", "type", "text", "pInputText", "", "formControlName", "ville"], ["for", "quartier"], ["id", "quartier", "type", "text", "pInputText", "", "formControlName", "quartier"], ["for", "district"], ["id", "district", "type", "text", "pInputText", "", "formControlName", "district"], ["for", "secteur"], ["id", "secteur", "type", "text", "pInputText", "", "formControlName", "secteur"], [1, "col-12", "md:col-10", "mb-3"], ["for", "adresse"], ["id", "adresse", "pInputTextarea", "", "formControlName", "adresse", "rows", "2"], ["for", "codCanton"], ["id", "codCanton", "type", "text", "pInputText", "", "formControlName", "codCanton"], ["for", "profession"], ["id", "profession", "type", "text", "pInputText", "", "formControlName", "profession", 3, "required"], ["for", "activite"], ["id", "activite", "type", "text", "pInputText", "", "formControlName", "activite"], ["for", "typeEntreprise"], ["id", "typeEntreprise", "formControlName", "typeEntreprise", "optionLabel", "label", "optionValue", "value", "placeholder", "Select Type", 3, "options"], ["for", "prestataire"], ["id", "prestataire", "type", "text", "pInputText", "", "formControlName", "prestataire"], ["for", "nomPere"], ["id", "nomPere", "type", "text", "pInputText", "", "formControlName", "nomPere"], ["for", "nomMere"], ["id", "nomMere", "type", "text", "pInputText", "", "formControlName", "nomMere"], ["for", "conjoint"], ["id", "conjoint", "type", "text", "pInputText", "", "formControlName", "conjoint"], ["for", "lienParente"], ["id", "lienParente", "type", "text", "pInputText", "", "formControlName", "lienParente"], ["for", "nomParent"], ["id", "nomParent", "type", "text", "pInputText", "", "formControlName", "nomParent"], ["for", "nbreEnfant"], ["id", "nbreEnfant", "formControlName", "nbreEnfant", 3, "min", "showButtons"], ["for", "nbreParent"], ["id", "nbreParent", "formControlName", "nbreParent", 3, "min", "showButtons"], ["for", "nbreAutre"], ["id", "nbreAutre", "formControlName", "nbreAutre", 3, "min", "showButtons"], ["for", "typeHabitation"], ["id", "typeHabitation", "formControlName", "typeHabitation", "optionLabel", "label", "optionValue", "value", "placeholder", "Select Housing Type", 3, "options"], ["for", "nbreAnnee"], ["id", "nbreAnnee", "formControlName", "nbreAnnee", 3, "min", "showButtons"], ["for", "nbreAnneeH"], ["id", "nbreAnneeH", "formControlName", "nbreAnneeH", 3, "min", "showButtons"], ["for", "statutIndividuel"], ["id", "statutIndividuel", "formControlName", "statutIndividuel", "optionLabel", "label", "optionValue", "value", "placeholder", "Select Status", 3, "options"], ["for", "cotisation"], ["id", "cotisation", "formControlName", "cotisation", "mode", "currency", "currency", "GNF", "locale", "fr-GN"], ["for", "droitEntree"], ["id", "droitEntree", "formControlName", "droitEntree", "mode", "currency", "currency", "GNF", "locale", "fr-GN"], [1, "col-12", "flex", "justify-content-end", "mt-4", "gap-2"], ["type", "button", "label", "Cancel", "severity", "secondary", 3, "click"], ["type", "button", "label", "Reset", "severity", "warn", 3, "click"], ["type", "submit", "label", "Save", 3, "loading"]], template: function FicheSignaletiqueComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h2");
      \u0275\u0275template(3, FicheSignaletiqueComponent_Conditional_3_Template, 1, 0)(4, FicheSignaletiqueComponent_Conditional_4_Template, 1, 0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "div", 2);
      \u0275\u0275template(6, FicheSignaletiqueComponent_Conditional_6_Template, 2, 0, "div", 3)(7, FicheSignaletiqueComponent_Conditional_7_Template, 188, 82, "form", 4)(8, FicheSignaletiqueComponent_Conditional_8_Template, 1, 1, "p-message", 5);
      \u0275\u0275elementEnd()();
      \u0275\u0275element(9, "p-toast");
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275advance(3);
      \u0275\u0275conditional(((tmp_0_0 = ctx.state().individuel) == null ? null : tmp_0_0.individuelId) ? 3 : 4);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.state().loading ? 6 : 7);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.state().error ? 8 : -1);
    }
  }, dependencies: [
    CommonModule,
    InputTextModule,
    InputText,
    FluidModule,
    ButtonModule,
    Button,
    SelectModule,
    FormsModule,
    \u0275NgNoValidate,
    DefaultValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    RequiredValidator,
    TextareaModule,
    TableModule,
    DividerModule,
    IconFieldModule,
    InputIconModule,
    ProgressSpinnerModule,
    ProgressSpinner,
    MessageModule,
    Message,
    DropdownModule,
    Dropdown,
    ReactiveFormsModule,
    FormGroupDirective,
    FormControlName,
    ToastModule,
    Toast,
    ImageModule,
    CardModule,
    InputNumberModule,
    InputNumber,
    CalendarModule,
    Calendar
  ], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FicheSignaletiqueComponent, { className: "FicheSignaletiqueComponent", filePath: "src/app/pages/dashboard/agent-credit/fiche-signaletique/fiche-signaletique.component.ts", lineNumber: 58 });
})();
export {
  FicheSignaletiqueComponent
};
//# sourceMappingURL=chunk-FLBM3A3S.js.map
