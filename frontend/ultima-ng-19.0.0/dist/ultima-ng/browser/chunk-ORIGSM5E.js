import {
  ReferenceData
} from "./chunk-BZOKRWHY.js";
import {
  TextareaModule
} from "./chunk-RW4OSSQT.js";
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
  Tag,
  TagModule
} from "./chunk-MYUKI7DG.js";
import "./chunk-544F7IXR.js";
import "./chunk-YBM6FZLP.js";
import "./chunk-U4P2VV4G.js";
import "./chunk-CPYA4VSS.js";
import {
  Card,
  CardModule
} from "./chunk-H46GQ57A.js";
import {
  InputNumber,
  InputNumberModule
} from "./chunk-JGOABXTK.js";
import "./chunk-CUABQE42.js";
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
  MessageService
} from "./chunk-NQNBRQ7H.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  MaxLengthValidator,
  NgControlStatus,
  NgControlStatusGroup,
  ReactiveFormsModule,
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
  CommonModule,
  NgIf
} from "./chunk-SQQPVFHK.js";
import {
  DestroyRef,
  computed,
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
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-ZKKMBKIA.js";
import {
  __objRest,
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/pages/dashboard/agent-credit/update-correction-rejet/update-correction-rejet.component.ts
function UpdateCorrectionRejetComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 5);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" Agent Correcteur: ", (tmp_1_0 = ctx_r0.state().user) == null ? null : tmp_1_0.firstName, " ", (tmp_1_0 = ctx_r0.state().user) == null ? null : tmp_1_0.lastName, " ");
  }
}
function UpdateCorrectionRejetComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-card", 7)(1, "div", 10)(2, "div", 11);
    \u0275\u0275element(3, "i", 12);
    \u0275\u0275elementStart(4, "div", 13)(5, "h3", 14);
    \u0275\u0275element(6, "i", 15);
    \u0275\u0275text(7, " Motif du Rejet ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 16)(9, "p", 17);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 18)(12, "div", 19)(13, "div", 20)(14, "label");
    \u0275\u0275text(15, "Code Agence");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span", 21);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "div", 19)(19, "div", 20)(20, "label");
    \u0275\u0275text(21, "Date d'annulation");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "span", 21);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(24, "div", 19)(25, "div", 20)(26, "label");
    \u0275\u0275text(27, "Statut");
    \u0275\u0275elementEnd();
    \u0275\u0275element(28, "p-tag", 22);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "div", 19)(30, "div", 20)(31, "label");
    \u0275\u0275text(32, "ID de la correction");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "span", 21);
    \u0275\u0275text(34);
    \u0275\u0275elementEnd()()()()()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate1(" ", ctx_r0.motifData().libele, " ");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r0.motifData().codAgence);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r0.formatDisplayDate(ctx_r0.motifData().dateAnnulation));
    \u0275\u0275advance(5);
    \u0275\u0275property("value", ctx_r0.getCorrectionStatusLabel(ctx_r0.motifData().statut))("severity", ctx_r0.getCorrectionStatusSeverity(ctx_r0.motifData().statut));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("#", ctx_r0.motifData().id, "");
  }
}
function UpdateCorrectionRejetComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275element(1, "p-progressSpinner");
    \u0275\u0275elementEnd();
  }
}
function UpdateCorrectionRejetComponent_Conditional_13_small_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 96);
    \u0275\u0275text(1, " Code client requis ");
    \u0275\u0275elementEnd();
  }
}
function UpdateCorrectionRejetComponent_Conditional_13_small_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 96);
    \u0275\u0275text(1, " Type de pi\xE8ce requis ");
    \u0275\u0275elementEnd();
  }
}
function UpdateCorrectionRejetComponent_Conditional_13_small_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 96);
    \u0275\u0275text(1, " Num\xE9ro de pi\xE8ce requis ");
    \u0275\u0275elementEnd();
  }
}
function UpdateCorrectionRejetComponent_Conditional_13_small_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 96);
    \u0275\u0275text(1, " Nom requis ");
    \u0275\u0275elementEnd();
  }
}
function UpdateCorrectionRejetComponent_Conditional_13_small_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 96);
    \u0275\u0275text(1, " Pr\xE9nom requis ");
    \u0275\u0275elementEnd();
  }
}
function UpdateCorrectionRejetComponent_Conditional_13_small_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 96);
    \u0275\u0275text(1, " Nom complet requis ");
    \u0275\u0275elementEnd();
  }
}
function UpdateCorrectionRejetComponent_Conditional_13_small_53_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 96);
    \u0275\u0275text(1, " Sexe requis ");
    \u0275\u0275elementEnd();
  }
}
function UpdateCorrectionRejetComponent_Conditional_13_small_62_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 96);
    \u0275\u0275text(1, " Date de naissance requise ");
    \u0275\u0275elementEnd();
  }
}
function UpdateCorrectionRejetComponent_Conditional_13_small_72_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 96);
    \u0275\u0275text(1, " Lieu de naissance requis ");
    \u0275\u0275elementEnd();
  }
}
function UpdateCorrectionRejetComponent_Conditional_13_small_77_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 96);
    \u0275\u0275text(1, " Nationalit\xE9 requise ");
    \u0275\u0275elementEnd();
  }
}
function UpdateCorrectionRejetComponent_Conditional_13_small_82_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 97);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", (ctx_r0.f["conjoint"].value == null ? null : ctx_r0.f["conjoint"].value.length) || 0, "/15 caract\xE8res ");
  }
}
function UpdateCorrectionRejetComponent_Conditional_13_small_83_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 96);
    \u0275\u0275text(1, " Maximum 15 caract\xE8res autoris\xE9s ");
    \u0275\u0275elementEnd();
  }
}
function UpdateCorrectionRejetComponent_Conditional_13_small_94_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 96);
    \u0275\u0275text(1, " T\xE9l\xE9phone requis ");
    \u0275\u0275elementEnd();
  }
}
function UpdateCorrectionRejetComponent_Conditional_13_small_95_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 96);
    \u0275\u0275text(1, " Format invalide (9-10 chiffres) ");
    \u0275\u0275elementEnd();
  }
}
function UpdateCorrectionRejetComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 23);
    \u0275\u0275listener("ngSubmit", function UpdateCorrectionRejetComponent_Conditional_13_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onSubmit());
    });
    \u0275\u0275elementStart(1, "div", 24)(2, "div", 25)(3, "h5", 3);
    \u0275\u0275text(4, "Identification");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 26)(6, "div", 18)(7, "div", 27)(8, "label", 28);
    \u0275\u0275text(9, "Code Client *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(10, "input", 29);
    \u0275\u0275template(11, UpdateCorrectionRejetComponent_Conditional_13_small_11_Template, 2, 0, "small", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 27)(13, "label", 31);
    \u0275\u0275text(14, "Type de Pi\xE8ce *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(15, "p-dropdown", 32);
    \u0275\u0275template(16, UpdateCorrectionRejetComponent_Conditional_13_small_16_Template, 2, 0, "small", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 27)(18, "label", 33);
    \u0275\u0275text(19, "Num\xE9ro Pi\xE8ce *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(20, "input", 34);
    \u0275\u0275template(21, UpdateCorrectionRejetComponent_Conditional_13_small_21_Template, 2, 0, "small", 30);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div", 35)(23, "div", 27)(24, "label", 36);
    \u0275\u0275text(25, "Date Expiration Pi\xE8ce");
    \u0275\u0275elementEnd();
    \u0275\u0275element(26, "p-calendar", 37);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(27, "div", 24)(28, "div", 25)(29, "h5", 3);
    \u0275\u0275text(30, "Informations Personnelles");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "div", 26)(32, "div", 18)(33, "div", 27)(34, "label", 38);
    \u0275\u0275text(35, "Nom *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(36, "input", 39);
    \u0275\u0275template(37, UpdateCorrectionRejetComponent_Conditional_13_small_37_Template, 2, 0, "small", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "div", 27)(39, "label", 40);
    \u0275\u0275text(40, "Pr\xE9nom *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(41, "input", 41);
    \u0275\u0275template(42, UpdateCorrectionRejetComponent_Conditional_13_small_42_Template, 2, 0, "small", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "div", 27)(44, "label", 42);
    \u0275\u0275text(45, "Nom Complet *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(46, "input", 43);
    \u0275\u0275template(47, UpdateCorrectionRejetComponent_Conditional_13_small_47_Template, 2, 0, "small", 30);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(48, "div", 35)(49, "div", 44)(50, "label", 45);
    \u0275\u0275text(51, "Sexe *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(52, "p-dropdown", 46);
    \u0275\u0275template(53, UpdateCorrectionRejetComponent_Conditional_13_small_53_Template, 2, 0, "small", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "div", 44)(55, "label", 47);
    \u0275\u0275text(56, "\xC9tat Civil");
    \u0275\u0275elementEnd();
    \u0275\u0275element(57, "p-dropdown", 48);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "div", 44)(59, "label", 49);
    \u0275\u0275text(60, "Date Naissance *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(61, "p-calendar", 50);
    \u0275\u0275template(62, UpdateCorrectionRejetComponent_Conditional_13_small_62_Template, 2, 0, "small", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(63, "div", 44)(64, "label", 51);
    \u0275\u0275text(65, "Nombre d'Enfants");
    \u0275\u0275elementEnd();
    \u0275\u0275element(66, "p-inputNumber", 52);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(67, "div", 35)(68, "div", 27)(69, "label", 53);
    \u0275\u0275text(70, "Lieu de Naissance *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(71, "input", 54);
    \u0275\u0275template(72, UpdateCorrectionRejetComponent_Conditional_13_small_72_Template, 2, 0, "small", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(73, "div", 27)(74, "label", 55);
    \u0275\u0275text(75, "Nationalit\xE9 *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(76, "input", 56);
    \u0275\u0275template(77, UpdateCorrectionRejetComponent_Conditional_13_small_77_Template, 2, 0, "small", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(78, "div", 27)(79, "label", 57);
    \u0275\u0275text(80, "Conjoint");
    \u0275\u0275elementEnd();
    \u0275\u0275element(81, "input", 58);
    \u0275\u0275template(82, UpdateCorrectionRejetComponent_Conditional_13_small_82_Template, 2, 1, "small", 59)(83, UpdateCorrectionRejetComponent_Conditional_13_small_83_Template, 2, 0, "small", 30);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(84, "div", 24)(85, "div", 25)(86, "h5", 3);
    \u0275\u0275text(87, "Contact");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(88, "div", 26)(89, "div", 18)(90, "div", 19)(91, "label", 60);
    \u0275\u0275text(92, "T\xE9l\xE9phone Principal *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(93, "input", 61);
    \u0275\u0275template(94, UpdateCorrectionRejetComponent_Conditional_13_small_94_Template, 2, 0, "small", 30)(95, UpdateCorrectionRejetComponent_Conditional_13_small_95_Template, 2, 0, "small", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(96, "div", 19)(97, "label", 62);
    \u0275\u0275text(98, "Autre T\xE9l\xE9phone");
    \u0275\u0275elementEnd();
    \u0275\u0275element(99, "input", 63);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(100, "div", 24)(101, "div", 25)(102, "h5", 3);
    \u0275\u0275text(103, "Adresse");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(104, "div", 26)(105, "div", 18)(106, "div", 44)(107, "label", 64);
    \u0275\u0275text(108, "Pays *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(109, "input", 65);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(110, "div", 44)(111, "label", 66);
    \u0275\u0275text(112, "Province");
    \u0275\u0275elementEnd();
    \u0275\u0275element(113, "p-dropdown", 67);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(114, "div", 44)(115, "label", 68);
    \u0275\u0275text(116, "District");
    \u0275\u0275elementEnd();
    \u0275\u0275element(117, "p-dropdown", 69);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(118, "div", 44)(119, "label", 70);
    \u0275\u0275text(120, "Code Agence");
    \u0275\u0275elementEnd();
    \u0275\u0275element(121, "input", 71);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(122, "div", 35)(123, "div", 72)(124, "label", 73);
    \u0275\u0275text(125, "Adresse Compl\xE8te");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(126, "textarea", 74);
    \u0275\u0275text(127, "                        ");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(128, "div", 24)(129, "div", 25)(130, "h5", 3);
    \u0275\u0275text(131, "Profession");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(132, "div", 26)(133, "div", 18)(134, "div", 44)(135, "label", 75);
    \u0275\u0275text(136, "Secteur");
    \u0275\u0275elementEnd();
    \u0275\u0275element(137, "p-dropdown", 76);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(138, "div", 44)(139, "label", 77);
    \u0275\u0275text(140, "Activit\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275element(141, "p-dropdown", 78);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(142, "div", 44)(143, "label", 79);
    \u0275\u0275text(144, "Profession");
    \u0275\u0275elementEnd();
    \u0275\u0275element(145, "p-dropdown", 80);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(146, "div", 44)(147, "label", 81);
    \u0275\u0275text(148, "Type Entreprise");
    \u0275\u0275elementEnd();
    \u0275\u0275element(149, "p-dropdown", 82);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(150, "div", 35)(151, "div", 19)(152, "label", 83);
    \u0275\u0275text(153, "Ann\xE9es d'Exp\xE9rience");
    \u0275\u0275elementEnd();
    \u0275\u0275element(154, "p-inputNumber", 84);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(155, "div", 24)(156, "div", 25)(157, "h5", 3);
    \u0275\u0275text(158, "Logement");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(159, "div", 26)(160, "div", 18)(161, "div", 19)(162, "label", 85);
    \u0275\u0275text(163, "Type d'Habitation");
    \u0275\u0275elementEnd();
    \u0275\u0275element(164, "p-dropdown", 86);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(165, "div", 19)(166, "label", 87);
    \u0275\u0275text(167, "Ann\xE9es de R\xE9sidence");
    \u0275\u0275elementEnd();
    \u0275\u0275element(168, "p-inputNumber", 88);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(169, "div", 24)(170, "div", 25)(171, "h5", 3);
    \u0275\u0275text(172, "B\xE9n\xE9ficiaire");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(173, "div", 26)(174, "div", 18)(175, "div", 19)(176, "label", 89);
    \u0275\u0275text(177, "Nom du B\xE9n\xE9ficiaire");
    \u0275\u0275elementEnd();
    \u0275\u0275element(178, "input", 90);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(179, "div", 19)(180, "label", 91);
    \u0275\u0275text(181, "Relation avec B\xE9n\xE9ficiaire");
    \u0275\u0275elementEnd();
    \u0275\u0275element(182, "input", 92);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(183, "div", 93)(184, "p-button", 94);
    \u0275\u0275listener("click", function UpdateCorrectionRejetComponent_Conditional_13_Template_p_button_click_184_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.cancel());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(185, "p-button", 95);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("formGroup", ctx_r0.personneForm);
    \u0275\u0275advance(10);
    \u0275\u0275property("readonly", true);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.f["codCliente"].touched && (ctx_r0.f["codCliente"].errors == null ? null : ctx_r0.f["codCliente"].errors["required"]));
    \u0275\u0275advance(4);
    \u0275\u0275property("options", ctx_r0.typePieceOptions)("filter", true);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.f["typePiece"].touched && (ctx_r0.f["typePiece"].errors == null ? null : ctx_r0.f["typePiece"].errors["required"]));
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ctx_r0.f["numId"].touched && (ctx_r0.f["numId"].errors == null ? null : ctx_r0.f["numId"].errors["required"]));
    \u0275\u0275advance(5);
    \u0275\u0275property("showIcon", true);
    \u0275\u0275advance(11);
    \u0275\u0275property("ngIf", ctx_r0.f["nomClient"].touched && (ctx_r0.f["nomClient"].errors == null ? null : ctx_r0.f["nomClient"].errors["required"]));
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ctx_r0.f["prenomClient"].touched && (ctx_r0.f["prenomClient"].errors == null ? null : ctx_r0.f["prenomClient"].errors["required"]));
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ctx_r0.f["nomCliente"].touched && (ctx_r0.f["nomCliente"].errors == null ? null : ctx_r0.f["nomCliente"].errors["required"]));
    \u0275\u0275advance(5);
    \u0275\u0275property("options", ctx_r0.sexeOptions);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.f["indSexo"].touched && (ctx_r0.f["indSexo"].errors == null ? null : ctx_r0.f["indSexo"].errors["required"]));
    \u0275\u0275advance(4);
    \u0275\u0275property("options", ctx_r0.etatCivilOptions);
    \u0275\u0275advance(4);
    \u0275\u0275property("showIcon", true)("yearNavigator", true)("yearRange", "1920:2020");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.f["fechNacimiento"].touched && (ctx_r0.f["fechNacimiento"].errors == null ? null : ctx_r0.f["fechNacimiento"].errors["required"]));
    \u0275\u0275advance(4);
    \u0275\u0275property("showButtons", true)("min", 0)("max", 99);
    \u0275\u0275advance(6);
    \u0275\u0275property("ngIf", ctx_r0.f["lieuxNaiss"].touched && (ctx_r0.f["lieuxNaiss"].errors == null ? null : ctx_r0.f["lieuxNaiss"].errors["required"]));
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ctx_r0.f["nationalite"].touched && (ctx_r0.f["nationalite"].errors == null ? null : ctx_r0.f["nationalite"].errors["required"]));
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", !ctx_r0.f["conjoint"].errors);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.f["conjoint"].touched && (ctx_r0.f["conjoint"].errors == null ? null : ctx_r0.f["conjoint"].errors["maxlength"]));
    \u0275\u0275advance(11);
    \u0275\u0275property("ngIf", ctx_r0.f["telPrincipal"].touched && (ctx_r0.f["telPrincipal"].errors == null ? null : ctx_r0.f["telPrincipal"].errors["required"]));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.f["telPrincipal"].touched && (ctx_r0.f["telPrincipal"].errors == null ? null : ctx_r0.f["telPrincipal"].errors["pattern"]));
    \u0275\u0275advance(14);
    \u0275\u0275property("readonly", true);
    \u0275\u0275advance(4);
    \u0275\u0275property("options", ctx_r0.provinceOptions)("filter", true);
    \u0275\u0275advance(4);
    \u0275\u0275property("options", ctx_r0.districtOptions)("disabled", !ctx_r0.districtOptions.length)("filter", true);
    \u0275\u0275advance(20);
    \u0275\u0275property("options", ctx_r0.sectorOptions);
    \u0275\u0275advance(4);
    \u0275\u0275property("options", ctx_r0.activityOptions)("filter", true);
    \u0275\u0275advance(4);
    \u0275\u0275property("options", ctx_r0.professionOptions)("filter", true);
    \u0275\u0275advance(4);
    \u0275\u0275property("options", ctx_r0.typeEntreOptions);
    \u0275\u0275advance(5);
    \u0275\u0275property("showButtons", true)("min", 0)("max", 99);
    \u0275\u0275advance(10);
    \u0275\u0275property("options", ctx_r0.typeHabitOptions);
    \u0275\u0275advance(4);
    \u0275\u0275property("showButtons", true)("min", 0)("max", 99);
    \u0275\u0275advance(16);
    \u0275\u0275property("disabled", ctx_r0.isUpdating());
    \u0275\u0275advance();
    \u0275\u0275property("loading", ctx_r0.isUpdating())("disabled", ctx_r0.personneForm.invalid || ctx_r0.isUpdating());
  }
}
var UpdateCorrectionRejetComponent = class _UpdateCorrectionRejetComponent {
  state = signal({
    loading: false,
    updating: false,
    message: void 0,
    error: void 0
  });
  // Computed signals
  isLoading = computed(() => this.state().loading);
  isUpdating = computed(() => this.state().updating);
  hasError = computed(() => !!this.state().error);
  personneData = computed(() => this.state().personnePhysique);
  motifData = computed(() => this.state().motif);
  // Form
  personneForm;
  // Options for dropdowns
  sexeOptions = [
    { label: "Masculin", value: "M" },
    { label: "F\xE9minin", value: "F" }
  ];
  etatCivilOptions = [
    { label: "C\xE9libataire", value: "S" },
    { label: "Mari\xE9(e)", value: "C" },
    { label: "Autre", value: "O" }
  ];
  typeHabitOptions = [
    { label: "Propri\xE9taire", value: "PO" },
    { label: "Locataire", value: "AL" }
  ];
  typeEntreOptions = [
    { label: "Propri\xE9taire", value: "PO" },
    { label: "Locataire", value: "AL" }
  ];
  typePieceOptions = ReferenceData.ID_TYPES.map((item) => ({
    label: item.label,
    value: item.code
  }));
  provinceOptions = ReferenceData.PROVINCES.map((item) => ({
    label: item.label,
    value: item.code
  }));
  sectorOptions = ReferenceData.SECTORS.map((item) => ({
    label: item.label,
    value: item.code
  }));
  activityOptions = ReferenceData.ACTIVITIES.map((item) => ({
    label: item.label,
    value: item.code
  }));
  professionOptions = ReferenceData.PROFESSIONS.map((item) => ({
    label: item.label,
    value: item.code
  }));
  cantonOptions = [];
  districtOptions = [];
  // Services
  userService = inject(UserService);
  destroyRef = inject(DestroyRef);
  messageService = inject(MessageService);
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  ngOnInit() {
    this.initializeForm();
    this.personneForm.get("codProvincia")?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((provinceCode) => {
      if (provinceCode) {
        this.loadCantons(provinceCode);
        this.personneForm.patchValue({
          codCanton: "",
          district: ""
        });
      } else {
        this.cantonOptions = [];
        this.districtOptions = [];
      }
    });
    this.personneForm.get("codCanton")?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((cantonCode) => {
      const provinceCode = this.personneForm.get("codProvincia")?.value;
      if (provinceCode && cantonCode) {
        this.loadDistricts(provinceCode, cantonCode);
      } else {
        this.districtOptions = [];
      }
    });
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      if (params["codCliente"]) {
        const codCliente = params["codCliente"];
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { codCliente }));
        this.loadUser();
        this.loadPersonnePhysique(codCliente);
      }
    });
  }
  initializeForm() {
    this.personneForm = this.fb.group({
      // Identification
      codCliente: ["", [Validators.required, Validators.pattern(/^\d{9,11}$/)]],
      numId: ["", Validators.required],
      typePiece: ["", Validators.required],
      // Informations personnelles
      nomCliente: ["", Validators.required],
      nomClient: ["", Validators.required],
      prenomClient: ["", Validators.required],
      // Contacts
      telPrincipal: ["", [Validators.required, Validators.pattern(/^\d{9,10}$/)]],
      telOtro: [""],
      // Dates
      fecVencim: [null],
      fechNacimiento: [null, Validators.required],
      dateAttente: [null],
      // Lieu et nationalité
      lieuxNaiss: ["", Validators.required],
      nationalite: ["Guin\xE9enne", Validators.required],
      pays: ["GN", Validators.required],
      // Bénéficiaire
      nomBeneficiario: [""],
      relacBeneficiario: [""],
      // Adresse
      detDireccion: [""],
      codProvincia: [""],
      codCanton: [""],
      // AJOUTÉ
      district: [""],
      agence: [""],
      codeAgence: [""],
      // Professionnel
      codActividad: [""],
      codProfesion: [""],
      codSector: [""],
      typeEntre: [""],
      nbrAnnee2: [null],
      // Personnel et familial
      indSexo: ["", Validators.required],
      estCivil: [""],
      conjoint: ["", [Validators.maxLength(15)]],
      nbrEnfant: [0],
      // Logement
      typeHabit: [""],
      nbrAnnee: [null],
      // Administratif
      statutClt: ["A"],
      nature: ["PP"],
      provServDestino: [""]
    });
  }
  loadUser() {
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: true }));
    this.userService.getInstanceUser$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.state.update((s) => __spreadProps(__spreadValues({}, s), {
          user: response.data.user,
          loading: false
        }));
      },
      error: (error) => {
        this.state.update((s) => __spreadProps(__spreadValues({}, s), {
          error,
          loading: false
        }));
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Impossible de charger les informations utilisateur",
          life: 5e3
        });
      }
    });
  }
  loadPersonnePhysique(codCliente) {
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: true }));
    this.userService.getPersonnePhysique$(codCliente).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        if (response?.data?.personnePhysique) {
          const personneData = response.data.personnePhysique;
          const motifData = response.data.motif;
          this.state.update((s) => __spreadProps(__spreadValues({}, s), {
            personnePhysique: personneData,
            motif: motifData,
            // NOUVEAU
            loading: false
          }));
          this.populateFormFromPersonne(personneData);
          this.messageService.add({
            severity: "success",
            summary: "Succ\xE8s",
            detail: "Donn\xE9es charg\xE9es avec succ\xE8s",
            life: 3e3
          });
        }
      },
      error: (error) => {
        this.state.update((s) => __spreadProps(__spreadValues({}, s), {
          error,
          loading: false
        }));
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Impossible de charger les donn\xE9es du client",
          life: 5e3
        });
      }
    });
  }
  isPopulatingFromPersonne = false;
  loadCantons(provinceCode) {
    const cantons = ReferenceData.getCantonsByProvince(provinceCode);
    this.cantonOptions = cantons.map((item) => ({
      label: item.label,
      value: item.code
    }));
  }
  loadDistricts(provinceCode, cantonCode) {
    this.districtOptions = ReferenceData.getDistrictsByProvince(provinceCode, cantonCode).map((item) => ({
      label: item.label,
      value: item.codDistrito
    }));
    const currentDistrict = this.personneForm.get("district")?.value;
    if (currentDistrict && !this.districtOptions.find((d) => d.value === currentDistrict)) {
      this.personneForm.patchValue({ district: "" });
    }
  }
  populateFormFromPersonne(personneData) {
    this.isPopulatingFromPersonne = true;
    const formData = {
      // Identification
      codCliente: personneData.codCliente || "",
      numId: personneData.numId || "",
      typePiece: personneData.typePiece || "",
      fecVencim: this.parseDate(personneData.fecVencim),
      // Personal info
      nomCliente: personneData.nomCliente || "",
      nomClient: personneData.nomClient || "",
      prenomClient: personneData.prenomClient || "",
      // Contact
      telPrincipal: personneData.telPrincipal || "",
      telOtro: personneData.telOtro || "",
      // Birth/Location
      fechNacimiento: this.parseDate(personneData.fechNacimiento),
      lieuxNaiss: personneData.lieuxNaiss || "",
      nationalite: personneData.nationalite || "Guin\xE9enne",
      pays: personneData.pays || "GN",
      // Beneficiary
      nomBeneficiario: personneData.nomBeneficiario || "",
      relacBeneficiario: personneData.relacBeneficiario || "",
      // Address
      detDireccion: personneData.detDireccion || "",
      codProvincia: personneData.codProvincia || "",
      codCanton: personneData.codCanton || "",
      // AJOUTÉ
      district: personneData.district || "",
      agence: personneData.agence || "",
      codeAgence: personneData.codeAgence || "",
      // Professional
      codActividad: personneData.codActividad || "",
      codProfesion: personneData.codProfesion || "",
      codSector: personneData.codSector || "",
      typeEntre: personneData.typeEntre || "",
      nbrAnnee2: personneData.nbrAnnee2 || null,
      // Personal/Family
      indSexo: personneData.indSexo || "",
      estCivil: personneData.estCivil || "",
      conjoint: personneData.conjoint || "",
      nbrEnfant: personneData.nbrEnfant || 0,
      // Housing
      typeHabit: personneData.typeHabit || "",
      nbrAnnee: personneData.nbrAnnee || null,
      // Admin
      statutClt: personneData.statutClt || "A",
      nature: personneData.nature || "PP",
      provServDestino: personneData.provServDestino || ""
    };
    if (formData.codProvincia) {
      this.loadCantons(formData.codProvincia);
      const _a = formData, { codCanton, district } = _a, formDataWithoutCantonDistrict = __objRest(_a, ["codCanton", "district"]);
      this.personneForm.patchValue(formDataWithoutCantonDistrict);
      if (codCanton) {
        setTimeout(() => {
          this.personneForm.patchValue({ codCanton });
          this.loadDistricts(formData.codProvincia, codCanton);
          if (district) {
            setTimeout(() => {
              this.personneForm.patchValue({ district });
              this.isPopulatingFromPersonne = false;
            }, 100);
          } else {
            this.isPopulatingFromPersonne = false;
          }
        }, 100);
      } else {
        this.isPopulatingFromPersonne = false;
      }
    } else {
      this.personneForm.patchValue(formData);
      this.isPopulatingFromPersonne = false;
    }
  }
  // Convertir le format de date du backend [year, month, day] en objet Date
  parseDate(dateValue) {
    if (!dateValue) {
      return null;
    }
    if (dateValue instanceof Date) {
      return dateValue;
    }
    if (typeof dateValue === "string") {
      return new Date(dateValue);
    }
    if (Array.isArray(dateValue) && dateValue.length >= 3) {
      return new Date(dateValue[0], dateValue[1] - 1, dateValue[2]);
    }
    return null;
  }
  onSubmit() {
    if (this.personneForm.invalid) {
      this.personneForm.markAllAsTouched();
      this.messageService.add({
        severity: "warn",
        summary: "Validation",
        detail: "Veuillez remplir tous les champs obligatoires",
        life: 3e3
      });
      return;
    }
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { updating: true }));
    const formValue = this.personneForm.value;
    const personnePhysique = __spreadProps(__spreadValues({}, formValue), {
      fecVencim: this.formatDate(formValue.fecVencim),
      fechNacimiento: this.formatDate(formValue.fechNacimiento),
      dateAttente: this.formatDate(formValue.dateAttente),
      correctionStatut: "EN_ATTENTE"
    });
    this.userService.updatePersonnePhysique$(personnePhysique).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { updating: false }));
        this.messageService.add({
          severity: "success",
          summary: "Succ\xE8s",
          detail: "Correction mise \xE0 jour avec succ\xE8s et resoumise pour validation",
          life: 3e3
        });
        setTimeout(() => {
          this.router.navigate(["/dashboards"]);
        }, 2e3);
      },
      error: (error) => {
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { updating: false }));
        const errorMessage = error.error?.message || "Erreur lors de la mise \xE0 jour";
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: errorMessage,
          life: 5e3
        });
      }
    });
  }
  formatDate(date) {
    if (!date)
      return void 0;
    if (date instanceof Date) {
      return date.toISOString().split("T")[0];
    }
    return date;
  }
  cancel() {
    this.router.navigate(["/dashboards"]);
  }
  get f() {
    return this.personneForm.controls;
  }
  getCorrectionStatusLabel(status) {
    switch (status) {
      case "REJETE":
        return "Rejet\xE9e";
      case "EN_ATTENTE":
        return "En attente";
      case "VALIDE":
        return "Valid\xE9e";
      default:
        return status;
    }
  }
  getCorrectionStatusSeverity(status) {
    switch (status) {
      case "VALIDE":
        return "success";
      case "REJETE":
        return "danger";
      case "EN_ATTENTE":
        return "info";
      default:
        return "secondary";
    }
  }
  // NOUVEAU: Formater la date pour l'affichage
  formatDisplayDate(dateString) {
    if (!dateString)
      return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  static \u0275fac = function UpdateCorrectionRejetComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UpdateCorrectionRejetComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _UpdateCorrectionRejetComponent, selectors: [["app-update-correction-rejet"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 14, vars: 4, consts: [[1, "update-correction-container"], ["styleClass", "mb-3"], [1, "flex", "justify-content-between", "align-items-center"], [1, "m-0"], [1, "pi", "pi-pencil"], [1, "text-500", "mt-2"], ["label", "Retour \xE0 la liste", "icon", "pi pi-arrow-left", "severity", "secondary", 3, "click"], ["styleClass", "mb-3 motif-rejet-card"], [1, "flex", "justify-content-center", "my-4"], [3, "formGroup"], [1, "motif-container"], [1, "flex", "align-items-start", "gap-3"], [1, "pi", "pi-exclamation-triangle", "text-orange-500", 2, "font-size", "2rem"], [1, "flex-1"], [1, "m-0", "mb-2", "text-orange-800"], [1, "pi", "pi-info-circle", "mr-2"], [1, "motif-content"], [1, "text-lg", "font-semibold", "text-700", "mb-3"], [1, "grid"], [1, "col-12", "md:col-6"], [1, "field-group"], [1, "font-bold"], [3, "value", "severity"], [3, "ngSubmit", "formGroup"], [1, "card", "mb-3"], [1, "card-header"], [1, "card-body"], [1, "col-12", "md:col-4"], ["for", "codCliente"], ["id", "codCliente", "type", "text", "pInputText", "", "formControlName", "codCliente", 1, "w-full", 3, "readonly"], ["class", "p-error", 4, "ngIf"], ["for", "typePiece"], ["id", "typePiece", "formControlName", "typePiece", "placeholder", "S\xE9lectionner", "filterPlaceholder", "Rechercher...", "styleClass", "w-full", 3, "options", "filter"], ["for", "numId"], ["id", "numId", "type", "text", "pInputText", "", "formControlName", "numId", 1, "w-full"], [1, "grid", "mt-3"], ["for", "fecVencim"], ["id", "fecVencim", "formControlName", "fecVencim", "dateFormat", "dd/mm/yy", "styleClass", "w-full", 3, "showIcon"], ["for", "nomClient"], ["id", "nomClient", "type", "text", "pInputText", "", "formControlName", "nomClient", 1, "w-full"], ["for", "prenomClient"], ["id", "prenomClient", "type", "text", "pInputText", "", "formControlName", "prenomClient", 1, "w-full"], ["for", "nomCliente"], ["id", "nomCliente", "type", "text", "pInputText", "", "formControlName", "nomCliente", 1, "w-full"], [1, "col-12", "md:col-3"], ["for", "indSexo"], ["id", "indSexo", "formControlName", "indSexo", "placeholder", "S\xE9lectionner", "styleClass", "w-full", 3, "options"], ["for", "estCivil"], ["id", "estCivil", "formControlName", "estCivil", "placeholder", "S\xE9lectionner", "styleClass", "w-full", 3, "options"], ["for", "fechNacimiento"], ["id", "fechNacimiento", "formControlName", "fechNacimiento", "dateFormat", "dd/mm/yy", "styleClass", "w-full", 3, "showIcon", "yearNavigator", "yearRange"], ["for", "nbrEnfant"], ["id", "nbrEnfant", "formControlName", "nbrEnfant", "styleClass", "w-full", 3, "showButtons", "min", "max"], ["for", "lieuxNaiss"], ["id", "lieuxNaiss", "type", "text", "pInputText", "", "formControlName", "lieuxNaiss", 1, "w-full"], ["for", "nationalite"], ["id", "nationalite", "type", "text", "pInputText", "", "formControlName", "nationalite", 1, "w-full"], ["for", "conjoint"], ["id", "conjoint", "type", "text", "pInputText", "", "formControlName", "conjoint", "maxlength", "15", 1, "w-full"], ["class", "text-muted", 4, "ngIf"], ["for", "telPrincipal"], ["id", "telPrincipal", "type", "text", "pInputText", "", "formControlName", "telPrincipal", 1, "w-full"], ["for", "telOtro"], ["id", "telOtro", "type", "text", "pInputText", "", "formControlName", "telOtro", 1, "w-full"], ["for", "pays"], ["id", "pays", "type", "text", "pInputText", "", "formControlName", "pays", 1, "w-full", 3, "readonly"], ["for", "codProvincia"], ["id", "codProvincia", "formControlName", "codProvincia", "placeholder", "S\xE9lectionner", "filterPlaceholder", "Rechercher...", "styleClass", "w-full", 3, "options", "filter"], ["for", "district"], ["id", "district", "formControlName", "district", "placeholder", "S\xE9lectionner d'abord une province", "filterPlaceholder", "Rechercher...", "styleClass", "w-full", 3, "options", "disabled", "filter"], ["for", "codeAgence"], ["id", "codeAgence", "type", "text", "pInputText", "", "formControlName", "codeAgence", 1, "w-full"], [1, "col-12"], ["for", "detDireccion"], ["id", "detDireccion", "pInputTextarea", "", "formControlName", "detDireccion", "rows", "3", 1, "w-full"], ["for", "codSector"], ["id", "codSector", "formControlName", "codSector", "placeholder", "S\xE9lectionner", "styleClass", "w-full", 3, "options"], ["for", "codActividad"], ["id", "codActividad", "formControlName", "codActividad", "placeholder", "S\xE9lectionner", "filterPlaceholder", "Rechercher...", "styleClass", "w-full", 3, "options", "filter"], ["for", "codProfesion"], ["id", "codProfesion", "formControlName", "codProfesion", "placeholder", "S\xE9lectionner", "filterPlaceholder", "Rechercher...", "styleClass", "w-full", 3, "options", "filter"], ["for", "typeEntre"], ["id", "typeEntre", "formControlName", "typeEntre", "placeholder", "S\xE9lectionner", "styleClass", "w-full", 3, "options"], ["for", "nbrAnnee2"], ["id", "nbrAnnee2", "formControlName", "nbrAnnee2", "styleClass", "w-full", 3, "showButtons", "min", "max"], ["for", "typeHabit"], ["id", "typeHabit", "formControlName", "typeHabit", "placeholder", "S\xE9lectionner", "styleClass", "w-full", 3, "options"], ["for", "nbrAnnee"], ["id", "nbrAnnee", "formControlName", "nbrAnnee", "styleClass", "w-full", 3, "showButtons", "min", "max"], ["for", "nomBeneficiario"], ["id", "nomBeneficiario", "type", "text", "pInputText", "", "formControlName", "nomBeneficiario", 1, "w-full"], ["for", "relacBeneficiario"], ["id", "relacBeneficiario", "type", "text", "pInputText", "", "formControlName", "relacBeneficiario", 1, "w-full"], [1, "flex", "justify-content-end", "gap-2", "mt-4"], ["label", "Annuler", "severity", "secondary", 3, "click", "disabled"], ["label", "Mettre \xE0 jour et soumettre", "type", "submit", 3, "loading", "disabled"], [1, "p-error"], [1, "text-muted"]], template: function UpdateCorrectionRejetComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "p-toast");
      \u0275\u0275elementStart(2, "p-card", 1)(3, "div", 2)(4, "div")(5, "h2", 3);
      \u0275\u0275element(6, "i", 4);
      \u0275\u0275text(7, " Mise \xE0 jour de Correction Rejet\xE9e ");
      \u0275\u0275elementEnd();
      \u0275\u0275template(8, UpdateCorrectionRejetComponent_Conditional_8_Template, 2, 2, "p", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "div")(10, "p-button", 6);
      \u0275\u0275listener("click", function UpdateCorrectionRejetComponent_Template_p_button_click_10_listener() {
        return ctx.cancel();
      });
      \u0275\u0275elementEnd()()()();
      \u0275\u0275template(11, UpdateCorrectionRejetComponent_Conditional_11_Template, 35, 6, "p-card", 7)(12, UpdateCorrectionRejetComponent_Conditional_12_Template, 2, 0, "div", 8)(13, UpdateCorrectionRejetComponent_Conditional_13_Template, 186, 49, "form", 9);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(8);
      \u0275\u0275conditional(ctx.state().user ? 8 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.motifData() && !ctx.isLoading() ? 11 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isLoading() ? 12 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.isLoading() ? 13 : -1);
    }
  }, dependencies: [CommonModule, NgIf, ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, MaxLengthValidator, FormGroupDirective, FormControlName, ButtonModule, Button, InputTextModule, InputText, TextareaModule, CardModule, Card, ToastModule, Toast, ProgressSpinnerModule, ProgressSpinner, DividerModule, TagModule, Tag, CalendarModule, Calendar, DropdownModule, Dropdown, InputNumberModule, InputNumber], styles: ["\n\n.update-correction-container[_ngcontent-%COMP%] {\n  padding: 1rem;\n  min-height: 100vh;\n  background: #f8f9fa;\n}\n.update-correction-container[_ngcontent-%COMP%]     .p-card {\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n}\n.update-correction-container[_ngcontent-%COMP%]     .p-card .p-card-body {\n  padding: 1.5rem;\n}\n.update-correction-container[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  color: #2c3e50;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.update-correction-container[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: #667eea;\n}\n.update-correction-container[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: #495057;\n  font-size: 1.25rem;\n  font-weight: 600;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.update-correction-container[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n}\n.update-correction-container[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  color: #667eea;\n  font-size: 1.1rem;\n  font-weight: 600;\n  margin-bottom: 1rem;\n}\n.update-correction-container[_ngcontent-%COMP%]   .correction-data-card[_ngcontent-%COMP%] {\n  border-left: 4px solid #f59e0b;\n}\n.update-correction-container[_ngcontent-%COMP%]   .correction-data-card[_ngcontent-%COMP%]     .p-card-body {\n  background:\n    linear-gradient(\n      to right,\n      rgba(251, 191, 36, 0.05),\n      transparent);\n}\n.update-correction-container[_ngcontent-%COMP%]   .motif-rejet-card[_ngcontent-%COMP%] {\n  border-left: 4px solid #f97316 !important;\n  background:\n    linear-gradient(\n      to right,\n      rgba(249, 115, 22, 0.05),\n      transparent) !important;\n}\n.update-correction-container[_ngcontent-%COMP%]   .motif-rejet-card[_ngcontent-%COMP%]     .p-card-body {\n  padding: 1.5rem;\n}\n.update-correction-container[_ngcontent-%COMP%]   .motif-rejet-card[_ngcontent-%COMP%]   .motif-container[_ngcontent-%COMP%]   .text-orange-500[_ngcontent-%COMP%] {\n  color: #f97316;\n}\n.update-correction-container[_ngcontent-%COMP%]   .motif-rejet-card[_ngcontent-%COMP%]   .motif-container[_ngcontent-%COMP%]   .text-orange-800[_ngcontent-%COMP%] {\n  color: #9a3412;\n}\n.update-correction-container[_ngcontent-%COMP%]   .motif-rejet-card[_ngcontent-%COMP%]   .motif-container[_ngcontent-%COMP%]   .motif-content[_ngcontent-%COMP%] {\n  background: white;\n  padding: 1.25rem;\n  border-radius: 8px;\n  border: 1px solid #fed7aa;\n}\n.update-correction-container[_ngcontent-%COMP%]   .motif-rejet-card[_ngcontent-%COMP%]   .motif-container[_ngcontent-%COMP%]   .motif-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #1f2937;\n  line-height: 1.6;\n}\n.update-correction-container[_ngcontent-%COMP%]   .motif-rejet-card[_ngcontent-%COMP%]   .motif-container[_ngcontent-%COMP%]   .field-group[_ngcontent-%COMP%] {\n  margin-bottom: 0.5rem;\n}\n.update-correction-container[_ngcontent-%COMP%]   .motif-rejet-card[_ngcontent-%COMP%]   .motif-container[_ngcontent-%COMP%]   .field-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.875rem;\n  color: #6b7280;\n  margin-bottom: 0.25rem;\n  font-weight: 500;\n}\n.update-correction-container[_ngcontent-%COMP%]   .motif-rejet-card[_ngcontent-%COMP%]   .motif-container[_ngcontent-%COMP%]   .field-group[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: block;\n  color: #111827;\n  font-size: 0.95rem;\n}\n.update-correction-container[_ngcontent-%COMP%]   .field-group[_ngcontent-%COMP%] {\n  margin-bottom: 1rem;\n}\n.update-correction-container[_ngcontent-%COMP%]   .field-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  font-weight: 500;\n  color: #6c757d;\n  font-size: 0.875rem;\n  margin-bottom: 0.25rem;\n}\n.update-correction-container[_ngcontent-%COMP%]   .field-group[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: block;\n  color: #212529;\n  font-size: 1rem;\n}\n.update-correction-container[_ngcontent-%COMP%]   .field-group[_ngcontent-%COMP%]   span.font-bold[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.update-correction-container[_ngcontent-%COMP%]   .section[_ngcontent-%COMP%] {\n  padding: 1rem 0;\n}\n.update-correction-container[_ngcontent-%COMP%]   .section[_ngcontent-%COMP%]:not(:last-child) {\n  border-bottom: 1px solid #e9ecef;\n}\n.update-correction-container[_ngcontent-%COMP%]   .p-badge[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  padding: 0.25rem 0.75rem;\n}\n.update-correction-container[_ngcontent-%COMP%]   .p-badge.p-badge-success[_ngcontent-%COMP%] {\n  background-color: #10b981;\n}\n.update-correction-container[_ngcontent-%COMP%]   .p-badge.p-badge-warning[_ngcontent-%COMP%] {\n  background-color: #f59e0b;\n}\n.update-correction-container[_ngcontent-%COMP%]     .p-tag {\n  font-weight: 500;\n  font-size: 0.875rem;\n  padding: 0.375rem 0.75rem;\n}\n.update-correction-container[_ngcontent-%COMP%]     .p-tag.p-tag-danger {\n  background: #fee2e2;\n  color: #991b1b;\n}\n.update-correction-container[_ngcontent-%COMP%]     .p-tag.p-tag-info {\n  background: #dbeafe;\n  color: #1e40af;\n}\n.update-correction-container[_ngcontent-%COMP%]     .p-tag.p-tag-success {\n  background: #d1fae5;\n  color: #065f46;\n}\n.update-correction-container[_ngcontent-%COMP%]     .p-button {\n  font-weight: 500;\n}\n.update-correction-container[_ngcontent-%COMP%]     .p-button.p-button-secondary {\n  background: #6c757d;\n  border-color: #6c757d;\n}\n.update-correction-container[_ngcontent-%COMP%]     .p-button.p-button-secondary:hover {\n  background: #5a6268;\n  border-color: #545b62;\n}\n.update-correction-container[_ngcontent-%COMP%]   .p-inputgroup[_ngcontent-%COMP%]   .p-inputgroup-addon[_ngcontent-%COMP%] {\n  background: #667eea;\n  color: white;\n  border-color: #667eea;\n}\n.update-correction-container[_ngcontent-%COMP%]   .p-inputgroup[_ngcontent-%COMP%]   input[readonly][_ngcontent-%COMP%] {\n  background-color: #f3f4f6;\n  cursor: not-allowed;\n}\n.update-correction-container[_ngcontent-%COMP%]   .flex.justify-content-center[_ngcontent-%COMP%] {\n  padding: 2rem;\n}\n.update-correction-container[_ngcontent-%COMP%]     .p-divider {\n  margin: 1.5rem 0;\n}\n.update-correction-container[_ngcontent-%COMP%]     .p-divider:before {\n  border-color: #e9ecef;\n}\n.update-correction-container[_ngcontent-%COMP%]   .bg-yellow-50[_ngcontent-%COMP%] {\n  background-color: #fef3c7;\n  border: 1px solid #fcd34d;\n}\n.update-correction-container[_ngcontent-%COMP%]   .bg-yellow-50[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n}\n.update-correction-container[_ngcontent-%COMP%]   .bg-yellow-50[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: #d97706;\n}\n.update-correction-container[_ngcontent-%COMP%]   .fiche-signaletique[_ngcontent-%COMP%]     .p-card-body {\n  padding: 2rem;\n}\n.update-correction-container[_ngcontent-%COMP%]   .fiche-signaletique[_ngcontent-%COMP%]   .grid[_ngcontent-%COMP%] {\n  margin: 0 -0.5rem;\n}\n.update-correction-container[_ngcontent-%COMP%]   .fiche-signaletique[_ngcontent-%COMP%]   .grid[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  padding: 0 0.5rem;\n}\n@media (max-width: 768px) {\n  .update-correction-container[_ngcontent-%COMP%]   .flex.justify-content-between[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 1rem;\n  }\n  .update-correction-container[_ngcontent-%COMP%]   .flex.justify-content-between[_ngcontent-%COMP%]   .flex.gap-2[_ngcontent-%COMP%] {\n    width: 100%;\n    justify-content: stretch;\n  }\n  .update-correction-container[_ngcontent-%COMP%]   .flex.justify-content-between[_ngcontent-%COMP%]   .flex.gap-2[_ngcontent-%COMP%]   .p-button[_ngcontent-%COMP%] {\n    flex: 1;\n  }\n  .update-correction-container[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n  .update-correction-container[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n    font-size: 1.1rem;\n  }\n  .update-correction-container[_ngcontent-%COMP%]   .field-group[_ngcontent-%COMP%] {\n    margin-bottom: 0.75rem;\n  }\n  .update-correction-container[_ngcontent-%COMP%]     .p-card .p-card-body {\n    padding: 1rem;\n  }\n  .update-correction-container[_ngcontent-%COMP%]   .motif-rejet-card[_ngcontent-%COMP%]   .flex.align-items-start[_ngcontent-%COMP%] {\n    flex-direction: column;\n  }\n  .update-correction-container[_ngcontent-%COMP%]   .motif-rejet-card[_ngcontent-%COMP%]   .flex.align-items-start[_ngcontent-%COMP%]   i.pi-exclamation-triangle[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n}\n.update-correction-container[_ngcontent-%COMP%]     .p-dialog .p-dialog-header {\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  color: white;\n}\n.update-correction-container[_ngcontent-%COMP%]     .p-dialog .p-dialog-header .p-dialog-title {\n  color: white;\n  font-weight: 600;\n}\n.update-correction-container[_ngcontent-%COMP%]     .p-dialog .p-dialog-header .p-dialog-header-icon {\n  color: white;\n}\n.update-correction-container[_ngcontent-%COMP%]     .p-dialog .p-dialog-content {\n  padding: 1.5rem;\n  max-height: 80vh;\n  overflow-y: auto;\n}\n.update-correction-container[_ngcontent-%COMP%]   .p-error[_ngcontent-%COMP%] {\n  color: #dc2626;\n  font-size: 0.875rem;\n  margin-top: 0.25rem;\n}\n.update-correction-container[_ngcontent-%COMP%]   .text-500[_ngcontent-%COMP%] {\n  color: #6b7280;\n}\n.update-correction-container[_ngcontent-%COMP%]   .text-700[_ngcontent-%COMP%] {\n  color: #374151;\n}\n.update-correction-container[_ngcontent-%COMP%]   .text-primary[_ngcontent-%COMP%] {\n  color: #667eea;\n}\n.update-correction-container[_ngcontent-%COMP%]   .text-red-600[_ngcontent-%COMP%] {\n  color: #dc2626;\n}\n.update-correction-container[_ngcontent-%COMP%]   .text-orange-500[_ngcontent-%COMP%] {\n  color: #f97316;\n}\n.update-correction-container[_ngcontent-%COMP%]   .text-orange-800[_ngcontent-%COMP%] {\n  color: #9a3412;\n}\n.update-correction-container[_ngcontent-%COMP%]   .text-lg[_ngcontent-%COMP%] {\n  font-size: 1.125rem;\n}\n.update-correction-container[_ngcontent-%COMP%]   .m-0[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.update-correction-container[_ngcontent-%COMP%]   .mt-2[_ngcontent-%COMP%] {\n  margin-top: 0.5rem;\n}\n.update-correction-container[_ngcontent-%COMP%]   .mt-3[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n}\n.update-correction-container[_ngcontent-%COMP%]   .mb-2[_ngcontent-%COMP%] {\n  margin-bottom: 0.5rem;\n}\n.update-correction-container[_ngcontent-%COMP%]   .mb-3[_ngcontent-%COMP%] {\n  margin-bottom: 1rem;\n}\n.update-correction-container[_ngcontent-%COMP%]   .mr-2[_ngcontent-%COMP%] {\n  margin-right: 0.5rem;\n}\n.update-correction-container[_ngcontent-%COMP%]   .p-3[_ngcontent-%COMP%] {\n  padding: 1rem;\n}\n.update-correction-container[_ngcontent-%COMP%]   .flex-1[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.update-correction-container[_ngcontent-%COMP%]   .gap-3[_ngcontent-%COMP%] {\n  gap: 0.75rem;\n}\n.update-correction-container[_ngcontent-%COMP%]   .align-items-start[_ngcontent-%COMP%] {\n  align-items: flex-start;\n}\n.update-correction-container[_ngcontent-%COMP%]   .font-semibold[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.update-correction-container[_ngcontent-%COMP%]   .font-bold[_ngcontent-%COMP%] {\n  font-weight: 700;\n}\n.update-correction-container[_ngcontent-%COMP%]   .border-round[_ngcontent-%COMP%] {\n  border-radius: 0.5rem;\n}\n@keyframes _ngcontent-%COMP%_pulse {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.5;\n  }\n}\n.update-correction-container[_ngcontent-%COMP%]   .loading[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;\n}\n/*# sourceMappingURL=update-correction-rejet.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(UpdateCorrectionRejetComponent, { className: "UpdateCorrectionRejetComponent", filePath: "src/app/pages/dashboard/agent-credit/update-correction-rejet/update-correction-rejet.component.ts", lineNumber: 31 });
})();
export {
  UpdateCorrectionRejetComponent
};
//# sourceMappingURL=chunk-ORIGSM5E.js.map
