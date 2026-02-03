import {
  PanelModule
} from "./chunk-WJXIL2JJ.js";
import {
  TabPanel,
  TabView,
  TabViewModule
} from "./chunk-I3MJ27E7.js";
import {
  Toast,
  ToastModule
} from "./chunk-6SRYYUT2.js";
import {
  DividerModule
} from "./chunk-VDET62CU.js";
import {
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
  ProgressSpinner,
  ProgressSpinnerModule
} from "./chunk-Y2J5OGKB.js";
import {
  ActivatedRoute,
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
  ButtonDirective,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import {
  MessageService,
  PrimeTemplate
} from "./chunk-NQNBRQ7H.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  ReactiveFormsModule,
  Validators,
  ɵNgNoValidate
} from "./chunk-3HTR5OU7.js";
import {
  UserService
} from "./chunk-SQ5BRWVW.js";
import {
  CommonModule,
  NgClass,
  NgIf
} from "./chunk-SQQPVFHK.js";
import {
  DestroyRef,
  debounceTime,
  distinctUntilChanged,
  inject,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction3,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-ZKKMBKIA.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/pages/dashboard/agent-credit/digital-verification/digital-verification.component.ts
var _c0 = () => ({ "min-width": "60rem" });
var _c1 = (a0, a1, a2) => ({ "inactive-danger": a0, "inactive-warning": a1, "active": a2 });
function DigitalVerificationComponent_small_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 22);
    \u0275\u0275element(1, "i", 23);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", 11 - ((tmp_1_0 = ctx_r0.searchForm.get("codCliente")) == null ? null : tmp_1_0.value.length), " caract\xE8res restants ");
  }
}
function DigitalVerificationComponent_div_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24)(1, "div", 25);
    \u0275\u0275element(2, "p-progressSpinner", 26);
    \u0275\u0275elementStart(3, "p", 27);
    \u0275\u0275text(4, "Recherche en cours...");
    \u0275\u0275elementEnd()()();
  }
}
function DigitalVerificationComponent_div_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 28)(1, "div", 29);
    \u0275\u0275element(2, "i", 30);
    \u0275\u0275elementStart(3, "div")(4, "h4", 31);
    \u0275\u0275text(5, "Une erreur est survenue");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 32);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r0.state().error);
  }
}
function DigitalVerificationComponent_div_27_ng_template_51_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 115);
    \u0275\u0275element(1, "i", 116);
    \u0275\u0275text(2, " Informations Client ");
    \u0275\u0275elementEnd();
  }
}
function DigitalVerificationComponent_div_27_ng_template_211_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 115);
    \u0275\u0275element(1, "i", 117);
    \u0275\u0275text(2, " Comptes & Soldes ");
    \u0275\u0275elementStart(3, "span", 118);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.getComptes().length);
  }
}
function DigitalVerificationComponent_div_27_ng_template_233_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 119);
    \u0275\u0275text(2, "#");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th");
    \u0275\u0275text(4, "Num\xE9ro de Compte");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th");
    \u0275\u0275text(6, "Cat\xE9gorie");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 120);
    \u0275\u0275text(8, "Agence");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th", 120);
    \u0275\u0275text(10, "Statut");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th", 121);
    \u0275\u0275text(12, "Solde Disponible");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th", 121);
    \u0275\u0275text(14, "Solde Moyen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th", 120);
    \u0275\u0275text(16, "Derni\xE8re Op\xE9ration");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "th", 120);
    \u0275\u0275text(18, "Jours Inactifs");
    \u0275\u0275elementEnd()();
  }
}
function DigitalVerificationComponent_div_27_ng_template_234_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 122)(1, "td", 123);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td")(4, "div", 124);
    \u0275\u0275element(5, "i", 125);
    \u0275\u0275elementStart(6, "span", 126);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "td")(9, "span", 127);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "td", 120)(12, "span", 128);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "td", 120);
    \u0275\u0275element(15, "p-tag", 129);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "td", 121)(17, "span", 130);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "td", 121)(20, "span", 131);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "td", 120)(23, "span", 132);
    \u0275\u0275text(24);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "td", 120)(26, "div", 133)(27, "span");
    \u0275\u0275text(28);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "small");
    \u0275\u0275text(30, "jours");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const compte_r2 = ctx.$implicit;
    const rowIndex_r3 = ctx.rowIndex;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(rowIndex_r3 + 1);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(compte_r2.numCuenta);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(compte_r2.categorieLibelle || compte_r2.codCategoria);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(compte_r2.codAgencia);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", compte_r2.statutCompte || compte_r2.indEstado || "N/A")("severity", ctx_r0.getStatutSeverity(compte_r2.indEstado || ""));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.formatCurrency(compte_r2.salDisponible));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.formatCurrency(compte_r2.salPromedio));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.formatDate(compte_r2.fecUltMovimiento));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction3(11, _c1, compte_r2.joursSansMouvement > 90, compte_r2.joursSansMouvement > 30 && compte_r2.joursSansMouvement <= 90, compte_r2.joursSansMouvement <= 30));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(compte_r2.joursSansMouvement || 0);
  }
}
function DigitalVerificationComponent_div_27_ng_template_235_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 134)(2, "div", 135);
    \u0275\u0275element(3, "i", 136);
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5, "Aucun compte trouv\xE9");
    \u0275\u0275elementEnd()()()();
  }
}
function DigitalVerificationComponent_div_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 33)(1, "div", 34)(2, "div", 35)(3, "div", 36);
    \u0275\u0275element(4, "i", 37);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 38)(6, "p", 39);
    \u0275\u0275text(7, "Nombre de comptes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "h3", 40);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 41);
    \u0275\u0275element(11, "i", 42);
    \u0275\u0275elementStart(12, "span");
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(14, "div", 43)(15, "div", 36);
    \u0275\u0275element(16, "i", 44);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 38)(18, "p", 39);
    \u0275\u0275text(19, "Comptes actifs");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "h3", 40);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "div", 41)(23, "span", 45);
    \u0275\u0275text(24);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(25, "div", 46)(26, "div", 36);
    \u0275\u0275element(27, "i", 47);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "div", 38)(29, "p", 39);
    \u0275\u0275text(30, "Solde disponible");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "h3", 40);
    \u0275\u0275text(32);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "div", 48);
    \u0275\u0275element(34, "i", 49);
    \u0275\u0275elementStart(35, "span");
    \u0275\u0275text(36, "Disponible imm\xE9diatement");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(37, "div", 50)(38, "div", 36);
    \u0275\u0275element(39, "i", 51);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "div", 38)(41, "p", 39);
    \u0275\u0275text(42, "Solde moyen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "h3", 40);
    \u0275\u0275text(44);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "div", 41);
    \u0275\u0275element(46, "i", 23);
    \u0275\u0275elementStart(47, "span");
    \u0275\u0275text(48, "Moyenne sur 30 jours");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(49, "p-tabView", 52)(50, "p-tabPanel");
    \u0275\u0275template(51, DigitalVerificationComponent_div_27_ng_template_51_Template, 3, 0, "ng-template", 53);
    \u0275\u0275elementStart(52, "div", 54)(53, "div", 55)(54, "span");
    \u0275\u0275text(55);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(56, "div", 56)(57, "h2", 57);
    \u0275\u0275text(58);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(59, "div", 58)(60, "div", 59);
    \u0275\u0275element(61, "i", 14);
    \u0275\u0275elementStart(62, "span");
    \u0275\u0275text(63);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(64, "div", 59);
    \u0275\u0275element(65, "i", 60);
    \u0275\u0275elementStart(66, "span");
    \u0275\u0275text(67);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(68, "div", 59);
    \u0275\u0275element(69, "i", 61);
    \u0275\u0275elementStart(70, "span");
    \u0275\u0275text(71);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(72, "div", 62);
    \u0275\u0275element(73, "p-tag", 63);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(74, "div", 64)(75, "div", 65)(76, "div", 66)(77, "div", 67)(78, "div", 68)(79, "div", 69);
    \u0275\u0275element(80, "i", 70);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(81, "h3");
    \u0275\u0275text(82, "Informations Personnelles");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(83, "div", 71)(84, "div", 72)(85, "span", 73);
    \u0275\u0275text(86, "Sexe");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(87, "span", 74);
    \u0275\u0275text(88);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(89, "div", 72)(90, "span", 73);
    \u0275\u0275text(91, "\xC9tat Civil");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(92, "span", 74);
    \u0275\u0275text(93);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(94, "div", 72)(95, "span", 73);
    \u0275\u0275text(96, "Date de naissance");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(97, "span", 74);
    \u0275\u0275text(98);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(99, "div", 72)(100, "span", 73);
    \u0275\u0275text(101, "Lieu de naissance");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(102, "span", 74);
    \u0275\u0275text(103);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(104, "div", 72)(105, "span", 73);
    \u0275\u0275text(106, "Nationalit\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(107, "span", 74);
    \u0275\u0275text(108);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(109, "div", 72)(110, "span", 73);
    \u0275\u0275text(111, "Nombre d'enfants");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(112, "span", 74)(113, "span", 75);
    \u0275\u0275text(114);
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(115, "div", 76)(116, "div", 68)(117, "div", 77);
    \u0275\u0275element(118, "i", 78);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(119, "h3");
    \u0275\u0275text(120, "Contacts");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(121, "div", 71)(122, "div", 79)(123, "div", 80);
    \u0275\u0275element(124, "i", 78);
    \u0275\u0275text(125, " Principal ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(126, "div", 81);
    \u0275\u0275text(127);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(128, "div", 79)(129, "div", 80);
    \u0275\u0275element(130, "i", 82);
    \u0275\u0275text(131, " Secondaire ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(132, "div", 81);
    \u0275\u0275text(133);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(134, "div", 79)(135, "div", 80);
    \u0275\u0275element(136, "i", 78);
    \u0275\u0275text(137, " Autre ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(138, "div", 81);
    \u0275\u0275text(139);
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(140, "div", 66)(141, "div", 67)(142, "div", 68)(143, "div", 83);
    \u0275\u0275element(144, "i", 84);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(145, "h3");
    \u0275\u0275text(146, "Adresse");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(147, "div", 71)(148, "div", 85);
    \u0275\u0275element(149, "i", 86);
    \u0275\u0275text(150);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(151, "div", 87)(152, "div", 88)(153, "span", 89);
    \u0275\u0275text(154, "Province");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(155, "span", 90);
    \u0275\u0275text(156);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(157, "div", 88)(158, "span", 89);
    \u0275\u0275text(159, "District");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(160, "span", 90);
    \u0275\u0275text(161);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(162, "div", 88)(163, "span", 89);
    \u0275\u0275text(164, "Pays");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(165, "span", 90);
    \u0275\u0275text(166);
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(167, "div", 76)(168, "div", 68)(169, "div", 91);
    \u0275\u0275element(170, "i", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(171, "h3");
    \u0275\u0275text(172, "Identification");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(173, "div", 71)(174, "div", 92)(175, "div", 93);
    \u0275\u0275element(176, "i", 94);
    \u0275\u0275elementStart(177, "span");
    \u0275\u0275text(178, "Pi\xE8ce d'identit\xE9");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(179, "div", 95)(180, "div", 96)(181, "span");
    \u0275\u0275text(182, "Type:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(183, "strong");
    \u0275\u0275text(184);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(185, "div", 96)(186, "span");
    \u0275\u0275text(187, "Num\xE9ro:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(188, "strong");
    \u0275\u0275text(189);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(190, "div", 96)(191, "span");
    \u0275\u0275text(192, "Expiration:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(193, "strong");
    \u0275\u0275text(194);
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275elementStart(195, "div", 76)(196, "div", 68)(197, "div", 97);
    \u0275\u0275element(198, "i", 98);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(199, "h3");
    \u0275\u0275text(200, "B\xE9n\xE9ficiaire");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(201, "div", 71)(202, "div", 99)(203, "div", 100);
    \u0275\u0275element(204, "i", 70);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(205, "div", 101)(206, "p", 102);
    \u0275\u0275text(207);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(208, "p", 103);
    \u0275\u0275text(209);
    \u0275\u0275elementEnd()()()()()()()()();
    \u0275\u0275elementStart(210, "p-tabPanel");
    \u0275\u0275template(211, DigitalVerificationComponent_div_27_ng_template_211_Template, 5, 1, "ng-template", 53);
    \u0275\u0275elementStart(212, "div", 104)(213, "div", 105)(214, "div", 106)(215, "span", 107);
    \u0275\u0275text(216, "Total des comptes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(217, "span", 108);
    \u0275\u0275text(218);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(219, "div", 109);
    \u0275\u0275elementStart(220, "div", 106)(221, "span", 107);
    \u0275\u0275text(222, "Solde total disponible");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(223, "span", 110);
    \u0275\u0275text(224);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(225, "div", 109);
    \u0275\u0275elementStart(226, "div", 106)(227, "span", 107);
    \u0275\u0275text(228, "Solde moyen total");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(229, "span", 108);
    \u0275\u0275text(230);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(231, "div", 111)(232, "p-table", 112);
    \u0275\u0275template(233, DigitalVerificationComponent_div_27_ng_template_233_Template, 19, 0, "ng-template", 53)(234, DigitalVerificationComponent_div_27_ng_template_234_Template, 31, 15, "ng-template", 113)(235, DigitalVerificationComponent_div_27_ng_template_235_Template, 6, 0, "ng-template", 114);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    let tmp_7_0;
    let tmp_8_0;
    let tmp_9_0;
    let tmp_10_0;
    let tmp_11_0;
    let tmp_12_0;
    let tmp_13_0;
    let tmp_14_0;
    let tmp_15_0;
    let tmp_16_0;
    let tmp_17_0;
    let tmp_18_0;
    let tmp_19_0;
    let tmp_20_0;
    let tmp_21_0;
    let tmp_22_0;
    let tmp_23_0;
    let tmp_24_0;
    let tmp_25_0;
    let tmp_26_0;
    let tmp_27_0;
    let tmp_28_0;
    let tmp_29_0;
    let tmp_30_0;
    let tmp_31_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(ctx_r0.getComptes().length);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Total actifs: ", ((tmp_2_0 = ctx_r0.state().ficheSignaletique) == null ? null : tmp_2_0.comptesActifs) || 0, "");
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(((tmp_3_0 = ctx_r0.state().ficheSignaletique) == null ? null : tmp_3_0.comptesActifs) || 0);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", ((((tmp_4_0 = ctx_r0.state().ficheSignaletique) == null ? null : tmp_4_0.comptesActifs) || 0) / ctx_r0.getComptes().length * 100).toFixed(0), "%");
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r0.formatCurrency(ctx_r0.getTotalSoldeDisponible()));
    \u0275\u0275advance(12);
    \u0275\u0275textInterpolate(ctx_r0.formatCurrency(ctx_r0.getTotalSoldeMoyen()));
    \u0275\u0275advance(11);
    \u0275\u0275textInterpolate((((tmp_7_0 = ctx_r0.state().ficheSignaletique) == null ? null : tmp_7_0.nombreComplet) || ((tmp_7_0 = ctx_r0.state().ficheSignaletique) == null ? null : tmp_7_0.nomCliente) || "").charAt(0).toUpperCase());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ((tmp_8_0 = ctx_r0.state().ficheSignaletique) == null ? null : tmp_8_0.nombreComplet) || ((tmp_8_0 = ctx_r0.state().ficheSignaletique) == null ? null : tmp_8_0.nomCliente), " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate((tmp_9_0 = ctx_r0.state().ficheSignaletique) == null ? null : tmp_9_0.codCliente);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Membre depuis ", ctx_r0.formatDate((tmp_10_0 = ctx_r0.state().ficheSignaletique) == null ? null : tmp_10_0.fecIngreso), "");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Agence ", (tmp_11_0 = ctx_r0.state().ficheSignaletique) == null ? null : tmp_11_0.codAgencia, "");
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ((tmp_12_0 = ctx_r0.state().ficheSignaletique) == null ? null : tmp_12_0.statutClientLibelle) || "N/A")("severity", ctx_r0.getStatutSeverity(((tmp_13_0 = ctx_r0.state().ficheSignaletique) == null ? null : tmp_13_0.indRelacion) || ""));
    \u0275\u0275advance(15);
    \u0275\u0275textInterpolate(((tmp_14_0 = ctx_r0.state().ficheSignaletique) == null ? null : tmp_14_0.sexeLibelle) || "-");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(((tmp_15_0 = ctx_r0.state().ficheSignaletique) == null ? null : tmp_15_0.estatCivilLibelle) || "-");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.formatDate((tmp_16_0 = ctx_r0.state().ficheSignaletique) == null ? null : tmp_16_0.fechNacimiento));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(((tmp_17_0 = ctx_r0.state().ficheSignaletique) == null ? null : tmp_17_0.lugarNacimiento) || "-");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(((tmp_18_0 = ctx_r0.state().ficheSignaletique) == null ? null : tmp_18_0.nacionalidad) || "-");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(((tmp_19_0 = ctx_r0.state().ficheSignaletique) == null ? null : tmp_19_0.numHijos) || 0);
    \u0275\u0275advance(13);
    \u0275\u0275textInterpolate(((tmp_20_0 = ctx_r0.state().ficheSignaletique) == null ? null : tmp_20_0.telPrincipal) || "Non renseign\xE9");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(((tmp_21_0 = ctx_r0.state().ficheSignaletique) == null ? null : tmp_21_0.telSecundario) || "Non renseign\xE9");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(((tmp_22_0 = ctx_r0.state().ficheSignaletique) == null ? null : tmp_22_0.telOtro) || "Non renseign\xE9");
    \u0275\u0275advance(11);
    \u0275\u0275textInterpolate1(" ", ((tmp_23_0 = ctx_r0.state().ficheSignaletique) == null ? null : tmp_23_0.detDireccion) || "Adresse non renseign\xE9e", " ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(((tmp_24_0 = ctx_r0.state().ficheSignaletique) == null ? null : tmp_24_0.codProvincia) || "-");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(((tmp_25_0 = ctx_r0.state().ficheSignaletique) == null ? null : tmp_25_0.codDistrito) || "-");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(((tmp_26_0 = ctx_r0.state().ficheSignaletique) == null ? null : tmp_26_0.codPais) || "-");
    \u0275\u0275advance(18);
    \u0275\u0275textInterpolate(((tmp_27_0 = ctx_r0.state().ficheSignaletique) == null ? null : tmp_27_0.codTipoId) || "-");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(((tmp_28_0 = ctx_r0.state().ficheSignaletique) == null ? null : tmp_28_0.numId) || "-");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.formatDate((tmp_29_0 = ctx_r0.state().ficheSignaletique) == null ? null : tmp_29_0.fecVencim));
    \u0275\u0275advance(13);
    \u0275\u0275textInterpolate(((tmp_30_0 = ctx_r0.state().ficheSignaletique) == null ? null : tmp_30_0.nomBeneficiario) || "Non d\xE9sign\xE9");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(((tmp_31_0 = ctx_r0.state().ficheSignaletique) == null ? null : tmp_31_0.relacBeneficiario) || "-");
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(ctx_r0.getComptes().length);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r0.formatCurrency(ctx_r0.getTotalSoldeDisponible()));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r0.formatCurrency(ctx_r0.getTotalSoldeMoyen()));
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r0.getComptes())("paginator", true)("rows", 10)("showCurrentPageReport", true)("tableStyle", \u0275\u0275pureFunction0(39, _c0));
  }
}
var DigitalVerificationComponent = class _DigitalVerificationComponent {
  user;
  state = signal({
    loading: false,
    searching: false,
    message: void 0,
    error: void 0
  });
  searchForm;
  updateForm;
  userService = inject(UserService);
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  activatedRoute = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  messageService = inject(MessageService);
  ngOnInit() {
    this.initializeForms();
    this.setupSearchListener();
    this.loadUserInfo();
  }
  initializeForms() {
    this.searchForm = this.fb.group({
      codCliente: ["", [Validators.required, Validators.minLength(11)]]
    });
    this.updateForm = this.fb.group({
      codCliente: [{ value: "", disabled: true }],
      nomCliente: ["", Validators.required],
      telPrincipal: [""],
      telOtro: [""],
      detDireccion: [""],
      codProvincia: [""],
      codActividad: [""],
      codProfesion: [""],
      indSexo: [""],
      estCivil: [""],
      typeHabit: [""],
      nbrEnfant: [0],
      district: [""],
      pays: [""],
      typePiece: [""],
      numId: [""],
      nomBeneficiario: [""],
      relacBeneficiario: [""]
    });
  }
  setupSearchListener() {
    this.searchForm.get("codCliente")?.valueChanges.pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      if (value && value.length >= 11) {
        this.searchClient();
      }
    });
  }
  loadUserInfo() {
    this.userService.getInstanceUser$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        if (response.data?.user) {
          this.state.update((s) => __spreadProps(__spreadValues({}, s), { user: response.data.user }));
        }
      },
      error: (error) => {
        console.error("Error loading user profile:", error);
      }
    });
  }
  searchClient() {
    const codCliente = this.searchForm.get("codCliente")?.value;
    if (!codCliente) {
      this.showError("Veuillez saisir un code client");
      return;
    }
    this.state.update((s) => __spreadProps(__spreadValues({}, s), {
      searching: true,
      error: void 0,
      ficheSignaletique: void 0
    }));
    this.userService.getFicheSignaletiqueWithSolde$(codCliente).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        console.log("Response received:", response);
        if (response?.data?.data) {
          const ficheData = response.data.data;
          console.log("Fiche data extracted:", ficheData);
          this.state.update((s) => __spreadProps(__spreadValues({}, s), {
            searching: false,
            ficheSignaletique: ficheData,
            error: void 0
          }));
          this.populateUpdateForm(ficheData);
          const metadata = response.data.metadata;
          if (metadata) {
            this.showSuccess(`Fiche signal\xE9tique r\xE9cup\xE9r\xE9e - ${metadata.totalComptes} compte(s), Solde disponible: ${this.formatCurrency(ficheData.totalSoldeDisponible)}`);
          } else {
            this.showSuccess("Fiche signal\xE9tique r\xE9cup\xE9r\xE9e avec succ\xE8s");
          }
        } else {
          this.state.update((s) => __spreadProps(__spreadValues({}, s), {
            searching: false,
            error: "Aucune donn\xE9e trouv\xE9e"
          }));
          this.showWarning("Aucune donn\xE9e trouv\xE9e pour ce client");
        }
      },
      error: (error) => {
        console.error("Error fetching fiche signal\xE9tique:", error);
        this.state.update((s) => __spreadProps(__spreadValues({}, s), {
          searching: false,
          error: error.message || "Erreur lors de la r\xE9cup\xE9ration des donn\xE9es"
        }));
        this.showError(error.message || "Erreur lors de la r\xE9cup\xE9ration des donn\xE9es");
      }
    });
  }
  populateUpdateForm(data) {
    this.updateForm.patchValue({
      codCliente: data.codCliente,
      nomCliente: data.nomCliente || data.nombreComplet,
      telPrincipal: data.telPrincipal,
      telOtro: data.telOtro,
      detDireccion: data.detDireccion,
      codProvincia: data.codProvincia,
      codActividad: data.codActividad,
      codProfesion: data.codProfesion,
      indSexo: data.indSexo,
      estCivil: data.estCivil,
      typeHabit: data.tenenciaVivienda,
      nbrEnfant: data.numHijos,
      district: data.codDistrito,
      pays: data.codPais,
      typePiece: data.codTipoId,
      numId: data.numId,
      nomBeneficiario: data.nomBeneficiario,
      relacBeneficiario: data.relacBeneficiario
    });
  }
  getTotalSoldeDisponible() {
    const fiche = this.state().ficheSignaletique;
    return fiche?.totalSoldeDisponible || 0;
  }
  getTotalSoldeMoyen() {
    const fiche = this.state().ficheSignaletique;
    return fiche?.totalSoldeMoyen || 0;
  }
  getComptes() {
    const fiche = this.state().ficheSignaletique;
    return fiche?.comptes || [];
  }
  getStatutSeverity(indRelacion) {
    switch (indRelacion) {
      case "A":
        return "success";
      case "I":
        return "danger";
      case "S":
        return "warn";
      case "C":
        return "contrast";
      case "E":
        return "secondary";
      default:
        return "info";
    }
  }
  formatCurrency(value) {
    return new Intl.NumberFormat("fr-GN", {
      style: "currency",
      currency: "GNF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value || 0);
  }
  formatDate(date) {
    if (!date)
      return "-";
    return new Date(date).toLocaleDateString("fr-FR");
  }
  clearSearch() {
    this.searchForm.reset();
    this.updateForm.reset();
    this.state.update((s) => __spreadProps(__spreadValues({}, s), {
      ficheSignaletique: void 0,
      error: void 0
    }));
  }
  // Message service methods
  showSuccess(message) {
    this.messageService.add({
      severity: "success",
      summary: "Succ\xE8s",
      detail: message,
      life: 3e3
    });
  }
  showError(message) {
    this.messageService.add({
      severity: "error",
      summary: "Erreur",
      detail: message,
      life: 5e3
    });
  }
  showWarning(message) {
    this.messageService.add({
      severity: "warn",
      summary: "Attention",
      detail: message,
      life: 4e3
    });
  }
  showInfo(message) {
    this.messageService.add({
      severity: "info",
      summary: "Information",
      detail: message,
      life: 3e3
    });
  }
  static \u0275fac = function DigitalVerificationComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DigitalVerificationComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DigitalVerificationComponent, selectors: [["app-digital-verification"]], inputs: { user: "user" }, decls: 28, vars: 8, consts: [[1, "digital-verification-container"], [1, "page-header", "mb-4"], [1, "flex", "align-items-center", "gap-3"], [1, "header-icon"], [1, "pi", "pi-verified", "text-3xl"], [1, "page-title", "m-0"], [1, "page-subtitle", "m-0", "mt-1"], [1, "search-section", "mb-4"], [1, "search-card"], [1, "search-header"], [1, "pi", "pi-search", "mr-2"], [3, "formGroup"], [1, "search-input-group"], [1, "p-input-icon-left", "w-full"], [1, "pi", "pi-id-card"], ["pInputText", "", "id", "codCliente", "formControlName", "codCliente", "placeholder", "Entrez le code client (minimum 11 caract\xE8res)", 1, "w-full", "search-input"], ["pButton", "", "type", "button", "icon", "pi pi-search", "pTooltip", "Rechercher le client", 1, "search-button", 3, "click", "loading", "disabled"], ["pButton", "", "type", "button", "icon", "pi pi-times", "pTooltip", "Effacer la recherche", 1, "p-button-secondary", "clear-button", 3, "click", "disabled"], ["class", "search-hint", 4, "ngIf"], ["class", "loading-container", 4, "ngIf"], ["class", "error-container animate-fadeIn", 4, "ngIf"], ["class", "client-data-container animate-fadeIn", 4, "ngIf"], [1, "search-hint"], [1, "pi", "pi-info-circle", "mr-1"], [1, "loading-container"], [1, "loading-content"], ["styleClass", "custom-spinner"], [1, "loading-text"], [1, "error-container", "animate-fadeIn"], [1, "error-content"], [1, "pi", "pi-exclamation-triangle", "error-icon"], [1, "error-title"], [1, "error-message"], [1, "client-data-container", "animate-fadeIn"], [1, "stats-container", "mb-4"], [1, "stat-card", "stat-card-blue"], [1, "stat-icon"], [1, "pi", "pi-wallet"], [1, "stat-content"], [1, "stat-label"], [1, "stat-value"], [1, "stat-indicator"], [1, "pi", "pi-chart-line", "mr-1"], [1, "stat-card", "stat-card-green"], [1, "pi", "pi-check-circle"], [1, "percentage"], [1, "stat-card", "stat-card-orange"], [1, "pi", "pi-money-bill"], [1, "stat-indicator", "positive"], [1, "pi", "pi-arrow-up", "mr-1"], [1, "stat-card", "stat-card-purple"], [1, "pi", "pi-chart-line"], ["styleClass", "custom-tabs"], ["pTemplate", "header"], [1, "client-profile-header"], [1, "profile-avatar"], [1, "profile-info"], [1, "profile-name"], [1, "profile-meta"], [1, "meta-item"], [1, "pi", "pi-calendar"], [1, "pi", "pi-building"], [1, "profile-status"], ["styleClass", "status-tag", 3, "value", "severity"], [1, "info-sections"], [1, "grid"], [1, "col-12", "lg:col-6"], [1, "info-section"], [1, "section-header"], [1, "section-icon", "personal"], [1, "pi", "pi-user"], [1, "section-content"], [1, "info-row"], [1, "info-label"], [1, "info-value"], [1, "badge-number"], [1, "info-section", "mt-4"], [1, "section-icon", "contact"], [1, "pi", "pi-phone"], [1, "contact-card"], [1, "contact-type"], [1, "contact-value"], [1, "pi", "pi-mobile"], [1, "section-icon", "address"], [1, "pi", "pi-map-marker"], [1, "address-main"], [1, "pi", "pi-home", "mr-2"], [1, "address-details"], [1, "detail-item"], [1, "detail-label"], [1, "detail-value"], [1, "section-icon", "id"], [1, "id-card"], [1, "id-header"], [1, "pi", "pi-credit-card"], [1, "id-details"], [1, "id-row"], [1, "section-icon", "beneficiary"], [1, "pi", "pi-users"], [1, "beneficiary-card"], [1, "beneficiary-avatar"], [1, "beneficiary-info"], [1, "beneficiary-name"], [1, "beneficiary-relation"], [1, "accounts-overview", "mb-4"], [1, "overview-card"], [1, "overview-item"], [1, "overview-label"], [1, "overview-value"], [1, "overview-divider"], [1, "overview-value", "text-success"], [1, "accounts-table-container"], ["currentPageReportTemplate", "Affichage {first} \xE0 {last} sur {totalRecords} comptes", "styleClass", "custom-table", 3, "value", "paginator", "rows", "showCurrentPageReport", "tableStyle"], ["pTemplate", "body"], ["pTemplate", "emptymessage"], [1, "tab-header"], [1, "pi", "pi-user", "mr-2"], [1, "pi", "pi-wallet", "mr-2"], [1, "tab-badge"], [1, "text-center", 2, "width", "3rem"], [1, "text-center"], [1, "text-right"], [1, "table-row"], [1, "text-center", "font-semibold"], [1, "account-number"], [1, "pi", "pi-credit-card", "mr-2"], [1, "font-mono"], [1, "category-badge"], [1, "agency-code"], ["styleClass", "status-tag-small", 3, "value", "severity"], [1, "amount", "amount-positive"], [1, "amount"], [1, "date-text"], [1, "activity-indicator", 3, "ngClass"], ["colspan", "9", 1, "empty-message"], [1, "empty-state"], [1, "pi", "pi-inbox", "empty-icon"]], template: function DigitalVerificationComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "p-toast");
      \u0275\u0275elementStart(2, "div", 1)(3, "div", 2)(4, "div", 3);
      \u0275\u0275element(5, "i", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "div")(7, "h1", 5);
      \u0275\u0275text(8, "V\xE9rification Digitale");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "p", 6);
      \u0275\u0275text(10, "Recherchez et consultez les informations client");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(11, "div", 7)(12, "div", 8)(13, "div", 9);
      \u0275\u0275element(14, "i", 10);
      \u0275\u0275elementStart(15, "span");
      \u0275\u0275text(16, "Recherche Client");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(17, "form", 11)(18, "div", 12)(19, "span", 13);
      \u0275\u0275element(20, "i", 14)(21, "input", 15);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "button", 16);
      \u0275\u0275listener("click", function DigitalVerificationComponent_Template_button_click_22_listener() {
        return ctx.searchClient();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "button", 17);
      \u0275\u0275listener("click", function DigitalVerificationComponent_Template_button_click_23_listener() {
        return ctx.clearSearch();
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275template(24, DigitalVerificationComponent_small_24_Template, 3, 1, "small", 18);
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(25, DigitalVerificationComponent_div_25_Template, 5, 0, "div", 19)(26, DigitalVerificationComponent_div_26_Template, 8, 1, "div", 20)(27, DigitalVerificationComponent_div_27_Template, 236, 40, "div", 21);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_4_0;
      \u0275\u0275advance(17);
      \u0275\u0275property("formGroup", ctx.searchForm);
      \u0275\u0275advance(5);
      \u0275\u0275property("loading", ctx.state().searching)("disabled", ctx.searchForm.invalid || ctx.state().searching);
      \u0275\u0275advance();
      \u0275\u0275property("disabled", !ctx.searchForm.value.codCliente);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ((tmp_4_0 = ctx.searchForm.get("codCliente")) == null ? null : tmp_4_0.value) && ((tmp_4_0 = ctx.searchForm.get("codCliente")) == null ? null : tmp_4_0.value.length) < 11);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.state().searching);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.state().error && !ctx.state().searching);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.state().ficheSignaletique && !ctx.state().searching);
    }
  }, dependencies: [CommonModule, NgClass, NgIf, ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, InputTextModule, InputText, ButtonModule, ButtonDirective, PrimeTemplate, CardModule, TableModule, Table, TagModule, Tag, ToastModule, Toast, ProgressSpinnerModule, ProgressSpinner, DividerModule, PanelModule, TabViewModule, TabView, TabPanel], styles: ['\n\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes _ngcontent-%COMP%_slideIn {\n  from {\n    opacity: 0;\n    transform: translateX(-20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n@keyframes _ngcontent-%COMP%_pulse {\n  0% {\n    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4);\n  }\n  70% {\n    box-shadow: 0 0 0 15px rgba(102, 126, 234, 0);\n  }\n  100% {\n    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);\n  }\n}\n.digital-verification-container[_ngcontent-%COMP%] {\n  padding: 1.5rem;\n  background:\n    linear-gradient(\n      180deg,\n      var(--surface-ground) 0%,\n      var(--surface-50) 100%);\n  min-height: 100vh;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_fadeIn 0.5s ease;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .header-icon[_ngcontent-%COMP%] {\n  width: 60px;\n  height: 60px;\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  border-radius: 16px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: white;\n  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);\n}\n.digital-verification-container[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .page-title[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  font-weight: 700;\n  color: var(--text-color);\n  margin: 0;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .page-subtitle[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  font-size: 1rem;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_fadeIn 0.6s ease;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%]   .search-card[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 16px;\n  padding: 1.5rem;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);\n  border: 1px solid var(--surface-border);\n  transition: all 0.3s ease;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%]   .search-card[_ngcontent-%COMP%]:hover {\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);\n}\n.digital-verification-container[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%]   .search-card[_ngcontent-%COMP%]   .search-header[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  font-weight: 600;\n  color: var(--text-color);\n  margin-bottom: 1.5rem;\n  padding-bottom: 0.75rem;\n  border-bottom: 2px solid var(--surface-border);\n}\n.digital-verification-container[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%]   .search-card[_ngcontent-%COMP%]   .search-input-group[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.75rem;\n  align-items: center;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%]   .search-card[_ngcontent-%COMP%]   .search-input-group[_ngcontent-%COMP%]   .search-input[_ngcontent-%COMP%] {\n  border-radius: 12px;\n  padding: 0.875rem 1rem 0.875rem 2.5rem;\n  font-size: 1rem;\n  border: 2px solid transparent;\n  transition: all 0.3s ease;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%]   .search-card[_ngcontent-%COMP%]   .search-input-group[_ngcontent-%COMP%]   .search-input[_ngcontent-%COMP%]:focus {\n  border-color: var(--primary-color);\n  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);\n}\n.digital-verification-container[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%]   .search-card[_ngcontent-%COMP%]   .search-input-group[_ngcontent-%COMP%]   .search-button[_ngcontent-%COMP%] {\n  border-radius: 12px;\n  padding: 0.875rem 1.5rem;\n  font-weight: 600;\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  border: none;\n  transition: all 0.3s ease;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%]   .search-card[_ngcontent-%COMP%]   .search-input-group[_ngcontent-%COMP%]   .search-button[_ngcontent-%COMP%]:hover:not(:disabled) {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);\n}\n.digital-verification-container[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%]   .search-card[_ngcontent-%COMP%]   .search-input-group[_ngcontent-%COMP%]   .search-button[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%]   .search-card[_ngcontent-%COMP%]   .search-input-group[_ngcontent-%COMP%]   .clear-button[_ngcontent-%COMP%] {\n  border-radius: 12px;\n  padding: 0.875rem;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%]   .search-card[_ngcontent-%COMP%]   .search-hint[_ngcontent-%COMP%] {\n  display: inline-block;\n  margin-top: 0.5rem;\n  color: var(--text-color-secondary);\n  font-size: 0.875rem;\n  animation: _ngcontent-%COMP%_slideIn 0.3s ease;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .loading-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 300px;\n  animation: _ngcontent-%COMP%_fadeIn 0.3s ease;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .loading-container[_ngcontent-%COMP%]   .loading-content[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .loading-container[_ngcontent-%COMP%]   .loading-content[_ngcontent-%COMP%]   .custom-spinner[_ngcontent-%COMP%]     .p-progress-spinner-svg {\n  animation: _ngcontent-%COMP%_pulse 2s infinite;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .loading-container[_ngcontent-%COMP%]   .loading-content[_ngcontent-%COMP%]   .loading-text[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n  color: var(--text-color-secondary);\n  font-size: 1rem;\n  font-weight: 500;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .error-container[_ngcontent-%COMP%] {\n  margin-bottom: 1.5rem;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .error-container[_ngcontent-%COMP%]   .error-content[_ngcontent-%COMP%] {\n  background: #fee;\n  border: 1px solid #fcc;\n  border-radius: 12px;\n  padding: 1.5rem;\n  display: flex;\n  align-items: flex-start;\n  gap: 1rem;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .error-container[_ngcontent-%COMP%]   .error-content[_ngcontent-%COMP%]   .error-icon[_ngcontent-%COMP%] {\n  color: #e74c3c;\n  font-size: 1.5rem;\n  flex-shrink: 0;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .error-container[_ngcontent-%COMP%]   .error-content[_ngcontent-%COMP%]   .error-title[_ngcontent-%COMP%] {\n  margin: 0 0 0.5rem 0;\n  color: #e74c3c;\n  font-size: 1.1rem;\n  font-weight: 600;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .error-container[_ngcontent-%COMP%]   .error-content[_ngcontent-%COMP%]   .error-message[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #c0392b;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .stats-container[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 1.25rem;\n  margin-bottom: 2rem;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .stats-container[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 16px;\n  padding: 1.5rem;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);\n  border: 1px solid var(--surface-border);\n  display: flex;\n  align-items: center;\n  gap: 1.25rem;\n  transition: all 0.3s ease;\n  animation: _ngcontent-%COMP%_fadeIn 0.5s ease backwards;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .stats-container[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]:nth-child(1) {\n  animation-delay: 0.1s;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .stats-container[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]:nth-child(2) {\n  animation-delay: 0.2s;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .stats-container[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]:nth-child(3) {\n  animation-delay: 0.3s;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .stats-container[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]:nth-child(4) {\n  animation-delay: 0.4s;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .stats-container[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);\n}\n.digital-verification-container[_ngcontent-%COMP%]   .stats-container[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] {\n  width: 56px;\n  height: 56px;\n  border-radius: 14px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 1.5rem;\n  flex-shrink: 0;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .stats-container[_ngcontent-%COMP%]   .stat-card.stat-card-blue[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  color: white;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .stats-container[_ngcontent-%COMP%]   .stat-card.stat-card-green[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #84fab0 0%,\n      #8fd3f4 100%);\n  color: white;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .stats-container[_ngcontent-%COMP%]   .stat-card.stat-card-orange[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #ffd89b 0%,\n      #f9a826 100%);\n  color: white;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .stats-container[_ngcontent-%COMP%]   .stat-card.stat-card-purple[_ngcontent-%COMP%]   .stat-icon[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #ee74e1 0%,\n      #764ba2 100%);\n  color: white;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .stats-container[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]   .stat-content[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .stats-container[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]   .stat-content[_ngcontent-%COMP%]   .stat-label[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  color: var(--text-color-secondary);\n  margin: 0 0 0.5rem 0;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .stats-container[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]   .stat-content[_ngcontent-%COMP%]   .stat-value[_ngcontent-%COMP%] {\n  font-size: 1.75rem;\n  font-weight: 700;\n  color: var(--text-color);\n  margin: 0 0 0.5rem 0;\n  line-height: 1;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .stats-container[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]   .stat-content[_ngcontent-%COMP%]   .stat-indicator[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  color: var(--text-color-secondary);\n  display: flex;\n  align-items: center;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .stats-container[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]   .stat-content[_ngcontent-%COMP%]   .stat-indicator.positive[_ngcontent-%COMP%] {\n  color: #27ae60;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .stats-container[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%]   .stat-content[_ngcontent-%COMP%]   .stat-indicator[_ngcontent-%COMP%]   .percentage[_ngcontent-%COMP%] {\n  background: var(--surface-100);\n  padding: 2px 8px;\n  border-radius: 20px;\n  font-weight: 600;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .client-profile-header[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 16px;\n  padding: 2rem;\n  margin-bottom: 2rem;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);\n  display: flex;\n  align-items: center;\n  gap: 1.5rem;\n  border-left: 4px solid var(--primary-color);\n}\n.digital-verification-container[_ngcontent-%COMP%]   .client-profile-header[_ngcontent-%COMP%]   .profile-avatar[_ngcontent-%COMP%] {\n  width: 80px;\n  height: 80px;\n  border-radius: 50%;\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: white;\n  font-size: 2rem;\n  font-weight: 700;\n  flex-shrink: 0;\n  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);\n}\n.digital-verification-container[_ngcontent-%COMP%]   .client-profile-header[_ngcontent-%COMP%]   .profile-info[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .client-profile-header[_ngcontent-%COMP%]   .profile-info[_ngcontent-%COMP%]   .profile-name[_ngcontent-%COMP%] {\n  font-size: 1.75rem;\n  font-weight: 700;\n  color: var(--text-color);\n  margin: 0 0 0.75rem 0;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .client-profile-header[_ngcontent-%COMP%]   .profile-info[_ngcontent-%COMP%]   .profile-meta[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1.5rem;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .client-profile-header[_ngcontent-%COMP%]   .profile-info[_ngcontent-%COMP%]   .profile-meta[_ngcontent-%COMP%]   .meta-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  color: var(--text-color-secondary);\n  font-size: 0.95rem;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .client-profile-header[_ngcontent-%COMP%]   .profile-info[_ngcontent-%COMP%]   .profile-meta[_ngcontent-%COMP%]   .meta-item[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--primary-color);\n}\n.digital-verification-container[_ngcontent-%COMP%]   .client-profile-header[_ngcontent-%COMP%]   .profile-status[_ngcontent-%COMP%]   .status-tag[_ngcontent-%COMP%] {\n  padding: 0.5rem 1rem;\n  font-size: 0.95rem;\n  font-weight: 600;\n  border-radius: 8px;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 16px;\n  overflow: hidden;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);\n  transition: all 0.3s ease;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]:hover {\n  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%] {\n  padding: 1.25rem;\n  background: var(--surface-50);\n  border-bottom: 2px solid var(--surface-border);\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%]   .section-icon[_ngcontent-%COMP%] {\n  width: 40px;\n  height: 40px;\n  border-radius: 10px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 1.25rem;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%]   .section-icon.personal[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(102, 126, 234, 0.1254901961),\n      rgba(118, 75, 162, 0.1254901961));\n  color: #667eea;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%]   .section-icon.contact[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(132, 250, 176, 0.1254901961),\n      rgba(143, 211, 244, 0.1254901961));\n  color: #52c41a;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%]   .section-icon.address[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 216, 155, 0.1254901961),\n      rgba(249, 168, 38, 0.1254901961));\n  color: #f9a826;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%]   .section-icon.id[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(238, 116, 225, 0.1254901961),\n      rgba(118, 75, 162, 0.1254901961));\n  color: #764ba2;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%]   .section-icon.beneficiary[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(0, 210, 255, 0.1254901961),\n      rgba(58, 123, 213, 0.1254901961));\n  color: #3a7bd5;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.1rem;\n  font-weight: 600;\n  color: var(--text-color);\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-content[_ngcontent-%COMP%] {\n  padding: 1.5rem;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-content[_ngcontent-%COMP%]   .info-row[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0.75rem 0;\n  border-bottom: 1px solid var(--surface-border);\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-content[_ngcontent-%COMP%]   .info-row[_ngcontent-%COMP%]:last-child {\n  border-bottom: none;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-content[_ngcontent-%COMP%]   .info-row[_ngcontent-%COMP%]   .info-label[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  font-size: 0.95rem;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-content[_ngcontent-%COMP%]   .info-row[_ngcontent-%COMP%]   .info-value[_ngcontent-%COMP%] {\n  color: var(--text-color);\n  font-weight: 500;\n  text-align: right;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-content[_ngcontent-%COMP%]   .info-row[_ngcontent-%COMP%]   .info-value[_ngcontent-%COMP%]   .badge-number[_ngcontent-%COMP%] {\n  background: var(--primary-color);\n  color: white;\n  padding: 2px 10px;\n  border-radius: 20px;\n  font-weight: 600;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-content[_ngcontent-%COMP%]   .contact-card[_ngcontent-%COMP%] {\n  background: var(--surface-50);\n  border-radius: 12px;\n  padding: 1rem;\n  margin-bottom: 0.75rem;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  transition: all 0.2s ease;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-content[_ngcontent-%COMP%]   .contact-card[_ngcontent-%COMP%]:hover {\n  background: var(--surface-100);\n  transform: translateX(4px);\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-content[_ngcontent-%COMP%]   .contact-card[_ngcontent-%COMP%]:last-child {\n  margin-bottom: 0;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-content[_ngcontent-%COMP%]   .contact-card[_ngcontent-%COMP%]   .contact-type[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  color: var(--text-color-secondary);\n  font-size: 0.9rem;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-content[_ngcontent-%COMP%]   .contact-card[_ngcontent-%COMP%]   .contact-type[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--primary-color);\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-content[_ngcontent-%COMP%]   .contact-card[_ngcontent-%COMP%]   .contact-value[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: var(--text-color);\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-content[_ngcontent-%COMP%]   .address-main[_ngcontent-%COMP%] {\n  background: var(--surface-50);\n  padding: 1rem;\n  border-radius: 12px;\n  margin-bottom: 1rem;\n  color: var(--text-color);\n  line-height: 1.6;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-content[_ngcontent-%COMP%]   .address-details[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));\n  gap: 1rem;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-content[_ngcontent-%COMP%]   .address-details[_ngcontent-%COMP%]   .detail-item[_ngcontent-%COMP%]   .detail-label[_ngcontent-%COMP%] {\n  display: block;\n  color: var(--text-color-secondary);\n  font-size: 0.875rem;\n  margin-bottom: 0.25rem;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-content[_ngcontent-%COMP%]   .address-details[_ngcontent-%COMP%]   .detail-item[_ngcontent-%COMP%]   .detail-value[_ngcontent-%COMP%] {\n  color: var(--text-color);\n  font-weight: 500;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-content[_ngcontent-%COMP%]   .id-card[_ngcontent-%COMP%] {\n  background: var(--surface-50);\n  border-radius: 12px;\n  overflow: hidden;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-content[_ngcontent-%COMP%]   .id-card[_ngcontent-%COMP%]   .id-header[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  color: white;\n  padding: 0.75rem 1rem;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-weight: 500;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-content[_ngcontent-%COMP%]   .id-card[_ngcontent-%COMP%]   .id-details[_ngcontent-%COMP%] {\n  padding: 1rem;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-content[_ngcontent-%COMP%]   .id-card[_ngcontent-%COMP%]   .id-details[_ngcontent-%COMP%]   .id-row[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  padding: 0.5rem 0;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-content[_ngcontent-%COMP%]   .id-card[_ngcontent-%COMP%]   .id-details[_ngcontent-%COMP%]   .id-row[_ngcontent-%COMP%]:not(:last-child) {\n  border-bottom: 1px solid var(--surface-border);\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-content[_ngcontent-%COMP%]   .id-card[_ngcontent-%COMP%]   .id-details[_ngcontent-%COMP%]   .id-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:first-child {\n  color: var(--text-color-secondary);\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-content[_ngcontent-%COMP%]   .id-card[_ngcontent-%COMP%]   .id-details[_ngcontent-%COMP%]   .id-row[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--text-color);\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-content[_ngcontent-%COMP%]   .beneficiary-card[_ngcontent-%COMP%] {\n  background: var(--surface-50);\n  border-radius: 12px;\n  padding: 1.25rem;\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-content[_ngcontent-%COMP%]   .beneficiary-card[_ngcontent-%COMP%]   .beneficiary-avatar[_ngcontent-%COMP%] {\n  width: 50px;\n  height: 50px;\n  border-radius: 50%;\n  background:\n    linear-gradient(\n      135deg,\n      #00d2ff,\n      #3a7bd5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: white;\n  font-size: 1.25rem;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-content[_ngcontent-%COMP%]   .beneficiary-card[_ngcontent-%COMP%]   .beneficiary-info[_ngcontent-%COMP%]   .beneficiary-name[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: var(--text-color);\n  margin: 0 0 0.25rem 0;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%]   .section-content[_ngcontent-%COMP%]   .beneficiary-card[_ngcontent-%COMP%]   .beneficiary-info[_ngcontent-%COMP%]   .beneficiary-relation[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  font-size: 0.9rem;\n  margin: 0;\n}\n.digital-verification-container[_ngcontent-%COMP%]     .custom-tabs .p-tabview-nav {\n  background: transparent;\n  border: none;\n  margin-bottom: 1.5rem;\n}\n.digital-verification-container[_ngcontent-%COMP%]     .custom-tabs .p-tabview-nav li {\n  margin-right: 0.5rem;\n}\n.digital-verification-container[_ngcontent-%COMP%]     .custom-tabs .p-tabview-nav li .p-tabview-nav-link {\n  background: white;\n  border: 2px solid var(--surface-border);\n  border-radius: 12px;\n  padding: 0.75rem 1.5rem;\n  transition: all 0.3s ease;\n}\n.digital-verification-container[_ngcontent-%COMP%]     .custom-tabs .p-tabview-nav li .p-tabview-nav-link .tab-header {\n  display: flex;\n  align-items: center;\n  font-weight: 500;\n}\n.digital-verification-container[_ngcontent-%COMP%]     .custom-tabs .p-tabview-nav li .p-tabview-nav-link .tab-header .tab-badge {\n  background: var(--surface-200);\n  color: var(--text-color);\n  padding: 2px 8px;\n  border-radius: 20px;\n  margin-left: 0.5rem;\n  font-size: 0.875rem;\n  font-weight: 600;\n}\n.digital-verification-container[_ngcontent-%COMP%]     .custom-tabs .p-tabview-nav li .p-tabview-nav-link:not(.p-disabled):hover {\n  background: var(--surface-50);\n  border-color: var(--primary-color);\n}\n.digital-verification-container[_ngcontent-%COMP%]     .custom-tabs .p-tabview-nav li.p-highlight .p-tabview-nav-link {\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  color: white;\n  border-color: transparent;\n}\n.digital-verification-container[_ngcontent-%COMP%]     .custom-tabs .p-tabview-nav li.p-highlight .p-tabview-nav-link .tab-badge {\n  background: rgba(255, 255, 255, 0.2);\n  color: white;\n}\n.digital-verification-container[_ngcontent-%COMP%]     .custom-tabs .p-tabview-panels {\n  padding: 0;\n  background: transparent;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .accounts-overview[_ngcontent-%COMP%]   .overview-card[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 16px;\n  padding: 1.5rem;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);\n  display: flex;\n  justify-content: space-around;\n  align-items: center;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .accounts-overview[_ngcontent-%COMP%]   .overview-card[_ngcontent-%COMP%]   .overview-item[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .accounts-overview[_ngcontent-%COMP%]   .overview-card[_ngcontent-%COMP%]   .overview-item[_ngcontent-%COMP%]   .overview-label[_ngcontent-%COMP%] {\n  display: block;\n  color: var(--text-color-secondary);\n  font-size: 0.9rem;\n  margin-bottom: 0.5rem;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .accounts-overview[_ngcontent-%COMP%]   .overview-card[_ngcontent-%COMP%]   .overview-item[_ngcontent-%COMP%]   .overview-value[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: var(--text-color);\n}\n.digital-verification-container[_ngcontent-%COMP%]   .accounts-overview[_ngcontent-%COMP%]   .overview-card[_ngcontent-%COMP%]   .overview-item[_ngcontent-%COMP%]   .overview-value.text-success[_ngcontent-%COMP%] {\n  color: #27ae60;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .accounts-overview[_ngcontent-%COMP%]   .overview-card[_ngcontent-%COMP%]   .overview-divider[_ngcontent-%COMP%] {\n  width: 1px;\n  height: 50px;\n  background: var(--surface-border);\n}\n.digital-verification-container[_ngcontent-%COMP%]   .accounts-table-container[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 16px;\n  overflow: hidden;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);\n}\n.digital-verification-container[_ngcontent-%COMP%]   .accounts-table-container[_ngcontent-%COMP%]     .custom-table .p-datatable-header {\n  background: var(--surface-50);\n  border: none;\n  padding: 1.25rem;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .accounts-table-container[_ngcontent-%COMP%]     .custom-table .p-datatable-thead > tr > th {\n  background: var(--surface-50);\n  color: var(--text-color);\n  font-weight: 600;\n  text-transform: uppercase;\n  font-size: 0.875rem;\n  letter-spacing: 0.5px;\n  border: none;\n  padding: 1rem;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .accounts-table-container[_ngcontent-%COMP%]     .custom-table .p-datatable-tbody > tr {\n  transition: all 0.2s ease;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .accounts-table-container[_ngcontent-%COMP%]     .custom-table .p-datatable-tbody > tr:hover {\n  background: var(--surface-50);\n}\n.digital-verification-container[_ngcontent-%COMP%]   .accounts-table-container[_ngcontent-%COMP%]     .custom-table .p-datatable-tbody > tr td {\n  border: none;\n  padding: 1rem;\n  vertical-align: middle;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .accounts-table-container[_ngcontent-%COMP%]     .custom-table .p-datatable-tbody > tr td .account-number {\n  display: flex;\n  align-items: center;\n  color: var(--primary-color);\n  font-weight: 500;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .accounts-table-container[_ngcontent-%COMP%]     .custom-table .p-datatable-tbody > tr td .category-badge {\n  background: var(--surface-100);\n  padding: 4px 10px;\n  border-radius: 6px;\n  font-size: 0.875rem;\n  font-weight: 500;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .accounts-table-container[_ngcontent-%COMP%]     .custom-table .p-datatable-tbody > tr td .agency-code {\n  background: var(--surface-100);\n  padding: 4px 10px;\n  border-radius: 6px;\n  font-weight: 500;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .accounts-table-container[_ngcontent-%COMP%]     .custom-table .p-datatable-tbody > tr td .status-tag-small {\n  font-size: 0.875rem;\n  padding: 4px 10px;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .accounts-table-container[_ngcontent-%COMP%]     .custom-table .p-datatable-tbody > tr td .amount {\n  font-weight: 600;\n  font-family: "Courier New", monospace;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .accounts-table-container[_ngcontent-%COMP%]     .custom-table .p-datatable-tbody > tr td .amount.amount-positive {\n  color: #27ae60;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .accounts-table-container[_ngcontent-%COMP%]     .custom-table .p-datatable-tbody > tr td .date-text {\n  color: var(--text-color-secondary);\n  font-size: 0.9rem;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .accounts-table-container[_ngcontent-%COMP%]     .custom-table .p-datatable-tbody > tr td .activity-indicator {\n  display: inline-flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 4px 12px;\n  border-radius: 8px;\n  font-weight: 600;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .accounts-table-container[_ngcontent-%COMP%]     .custom-table .p-datatable-tbody > tr td .activity-indicator.active {\n  background: #d4edda;\n  color: #155724;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .accounts-table-container[_ngcontent-%COMP%]     .custom-table .p-datatable-tbody > tr td .activity-indicator.inactive-warning {\n  background: #fff3cd;\n  color: #856404;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .accounts-table-container[_ngcontent-%COMP%]     .custom-table .p-datatable-tbody > tr td .activity-indicator.inactive-danger {\n  background: #f8d7da;\n  color: #721c24;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .accounts-table-container[_ngcontent-%COMP%]     .custom-table .p-datatable-tbody > tr td .activity-indicator small {\n  font-size: 0.7rem;\n  font-weight: 400;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .accounts-table-container[_ngcontent-%COMP%]     .custom-table .empty-message {\n  padding: 3rem;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .accounts-table-container[_ngcontent-%COMP%]     .custom-table .empty-message .empty-state {\n  text-align: center;\n  color: var(--text-color-secondary);\n}\n.digital-verification-container[_ngcontent-%COMP%]   .accounts-table-container[_ngcontent-%COMP%]     .custom-table .empty-message .empty-state .empty-icon {\n  font-size: 3rem;\n  margin-bottom: 1rem;\n  opacity: 0.5;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .accounts-table-container[_ngcontent-%COMP%]     .custom-table .empty-message .empty-state p {\n  margin: 0;\n  font-size: 1.1rem;\n}\n.digital-verification-container[_ngcontent-%COMP%]   .animate-fadeIn[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_fadeIn 0.5s ease;\n}\n@media screen and (max-width: 768px) {\n  .digital-verification-container[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .digital-verification-container[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .page-title[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n  .digital-verification-container[_ngcontent-%COMP%]   .stats-container[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .digital-verification-container[_ngcontent-%COMP%]   .client-profile-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    text-align: center;\n  }\n  .digital-verification-container[_ngcontent-%COMP%]   .client-profile-header[_ngcontent-%COMP%]   .profile-meta[_ngcontent-%COMP%] {\n    justify-content: center;\n  }\n  .digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-row[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .digital-verification-container[_ngcontent-%COMP%]   .info-sections[_ngcontent-%COMP%]   .info-row[_ngcontent-%COMP%]   .info-value[_ngcontent-%COMP%] {\n    text-align: left;\n    margin-top: 0.25rem;\n  }\n  .digital-verification-container[_ngcontent-%COMP%]   .accounts-overview[_ngcontent-%COMP%]   .overview-card[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 1rem;\n  }\n  .digital-verification-container[_ngcontent-%COMP%]   .accounts-overview[_ngcontent-%COMP%]   .overview-card[_ngcontent-%COMP%]   .overview-divider[_ngcontent-%COMP%] {\n    width: 100px;\n    height: 1px;\n  }\n}\n@media (prefers-color-scheme: dark) {\n  .digital-verification-container[_ngcontent-%COMP%]   .search-card[_ngcontent-%COMP%], \n   .digital-verification-container[_ngcontent-%COMP%]   .stat-card[_ngcontent-%COMP%], \n   .digital-verification-container[_ngcontent-%COMP%]   .client-profile-header[_ngcontent-%COMP%], \n   .digital-verification-container[_ngcontent-%COMP%]   .info-section[_ngcontent-%COMP%], \n   .digital-verification-container[_ngcontent-%COMP%]   .overview-card[_ngcontent-%COMP%], \n   .digital-verification-container[_ngcontent-%COMP%]   .accounts-table-container[_ngcontent-%COMP%] {\n    background: var(--surface-card);\n  }\n}\n/*# sourceMappingURL=digital-verification.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DigitalVerificationComponent, { className: "DigitalVerificationComponent", filePath: "src/app/pages/dashboard/agent-credit/digital-verification/digital-verification.component.ts", lineNumber: 30 });
})();

export {
  DigitalVerificationComponent
};
//# sourceMappingURL=chunk-ZW7VTMV7.js.map
