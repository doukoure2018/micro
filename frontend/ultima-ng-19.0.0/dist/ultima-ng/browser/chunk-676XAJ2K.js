import {
  fr_default
} from "./chunk-DGHIY3K6.js";
import {
  PanelModule
} from "./chunk-WJXIL2JJ.js";
import {
  Steps,
  StepsModule
} from "./chunk-M4IO5JIC.js";
import {
  TextareaModule
} from "./chunk-RW4OSSQT.js";
import {
  InputGroupModule
} from "./chunk-GEBY3FYZ.js";
import {
  Toast,
  ToastModule
} from "./chunk-6SRYYUT2.js";
import {
  DividerModule
} from "./chunk-VDET62CU.js";
import {
  TableModule
} from "./chunk-REDVHUQC.js";
import "./chunk-YZRRSC3U.js";
import {
  DatePickerModule
} from "./chunk-6K6X5UBT.js";
import "./chunk-7HJ4XJ7U.js";
import {
  SelectModule
} from "./chunk-UQSIOFSP.js";
import "./chunk-OCW7T434.js";
import "./chunk-4JIPYACT.js";
import "./chunk-6GA37Q7Z.js";
import {
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
import "./chunk-HY2A3TN6.js";
import "./chunk-YEN5RMZS.js";
import "./chunk-XS7IVZ5T.js";
import "./chunk-CUABQE42.js";
import "./chunk-V6CKOH3G.js";
import "./chunk-DBPX6ILC.js";
import "./chunk-WIQZFAVH.js";
import "./chunk-CCBQFN2J.js";
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
import {
  Tooltip,
  TooltipModule
} from "./chunk-4IUQ6KTI.js";
import "./chunk-IVSL2HKS.js";
import "./chunk-E352KRZV.js";
import "./chunk-HHD4PK4J.js";
import {
  BadgeModule,
  ButtonDirective,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import "./chunk-AP3OAIHW.js";
import {
  MessageService,
  PrimeTemplate
} from "./chunk-NQNBRQ7H.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  ReactiveFormsModule,
  ɵNgNoValidate
} from "./chunk-3HTR5OU7.js";
import {
  UserService
} from "./chunk-SQ5BRWVW.js";
import {
  environment
} from "./chunk-ZRELZ6R7.js";
import {
  HttpClient
} from "./chunk-BMYIFZHZ.js";
import "./chunk-W3K3GK4Z.js";
import {
  CommonModule,
  CurrencyPipe,
  DecimalPipe,
  NgClass,
  NgForOf,
  NgIf,
  registerLocaleData
} from "./chunk-SQQPVFHK.js";
import {
  DestroyRef,
  LOCALE_ID,
  computed,
  forkJoin,
  inject,
  signal,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵpipeBindV,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-ZKKMBKIA.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/pages/dashboard/credit/individuel/attente/detail/analyse-bilan-activite/analyse-bilan-activite.component.ts
var _c0 = (a0) => [a0, "GNF", "symbol", "1.0-0", "fr-FR"];
function AnalyseBilanActiviteComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 9)(1, "div", 10)(2, "span");
    \u0275\u0275element(3, "i", 11);
    \u0275\u0275text(4, "Aucune analyse financi\xE8re n'existe pour cette demande.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 12);
    \u0275\u0275listener("click", function AnalyseBilanActiviteComponent_div_4_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.createOrUpdateAnalyse());
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275property("loading", ctx_r1.loading());
  }
}
function AnalyseBilanActiviteComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "div", 13);
    \u0275\u0275element(2, "i", 14);
    \u0275\u0275elementStart(3, "span", 15);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Analyse financi\xE8re #", ctx_r1.state().analyseId, " en cours d'\xE9dition");
  }
}
function AnalyseBilanActiviteComponent_div_8_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 47)(1, "h2", 48);
    \u0275\u0275text(2, "BILAN");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 49);
    \u0275\u0275text(4, "en GNF");
    \u0275\u0275elementEnd()();
  }
}
function AnalyseBilanActiviteComponent_div_8_ng_template_232_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 50)(1, "button", 51);
    \u0275\u0275listener("click", function AnalyseBilanActiviteComponent_div_8_ng_template_232_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.saveBilanAll());
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("loading", ctx_r1.savingBilan())("disabled", !ctx_r1.state().analyseExiste);
  }
}
function AnalyseBilanActiviteComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "p-card");
    \u0275\u0275template(2, AnalyseBilanActiviteComponent_div_8_ng_template_2_Template, 5, 0, "ng-template", 16);
    \u0275\u0275elementStart(3, "div", 17)(4, "table", 18)(5, "thead")(6, "tr", 19)(7, "th", 20);
    \u0275\u0275text(8, "Bilan");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th", 21);
    \u0275\u0275text(10, " \xC9valuation actuelle");
    \u0275\u0275element(11, "br");
    \u0275\u0275elementStart(12, "small", 22);
    \u0275\u0275text(13, "Montant (N)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "th", 23);
    \u0275\u0275text(15, " \xC9valuation pr\xE9c\xE9dente");
    \u0275\u0275element(16, "br");
    \u0275\u0275elementStart(17, "small", 22);
    \u0275\u0275text(18, "Montant (N-1)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "th", 24);
    \u0275\u0275text(20, "Observations");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "tbody")(22, "tr", 25)(23, "td", 26);
    \u0275\u0275text(24, "ACTIF");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "tr", 27)(26, "td", 28);
    \u0275\u0275text(27, "Immobilisations");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "td", 29);
    \u0275\u0275text(29);
    \u0275\u0275pipe(30, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "td", 30);
    \u0275\u0275text(32);
    \u0275\u0275pipe(33, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275element(34, "td", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "tr")(36, "td", 32);
    \u0275\u0275text(37, "Terrains");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "td", 33);
    \u0275\u0275element(39, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "td", 33);
    \u0275\u0275element(41, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "td", 33);
    \u0275\u0275element(43, "input", 35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(44, "tr")(45, "td", 32);
    \u0275\u0275text(46, "B\xE2timents et magasin");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "td", 33);
    \u0275\u0275element(48, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "td", 33);
    \u0275\u0275element(50, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(51, "td", 33);
    \u0275\u0275element(52, "input", 35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(53, "tr")(54, "td", 32);
    \u0275\u0275text(55, "Installations et agencements");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(56, "td", 33);
    \u0275\u0275element(57, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "td", 33);
    \u0275\u0275element(59, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(60, "td", 33);
    \u0275\u0275element(61, "input", 35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(62, "tr")(63, "td", 32);
    \u0275\u0275text(64, "Mat\xE9riels industriels");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(65, "td", 33);
    \u0275\u0275element(66, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(67, "td", 33);
    \u0275\u0275element(68, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(69, "td", 33);
    \u0275\u0275element(70, "input", 35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(71, "tr")(72, "td", 32);
    \u0275\u0275text(73, "Mobilier de bureau");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(74, "td", 33);
    \u0275\u0275element(75, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(76, "td", 33);
    \u0275\u0275element(77, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(78, "td", 33);
    \u0275\u0275element(79, "input", 35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(80, "tr")(81, "td", 32);
    \u0275\u0275text(82, "Mat\xE9riel informatique");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(83, "td", 33);
    \u0275\u0275element(84, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(85, "td", 33);
    \u0275\u0275element(86, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(87, "td", 33);
    \u0275\u0275element(88, "input", 35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(89, "tr")(90, "td", 32);
    \u0275\u0275text(91, "Mat\xE9riel de transport");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(92, "td", 33);
    \u0275\u0275element(93, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(94, "td", 33);
    \u0275\u0275element(95, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(96, "td", 33);
    \u0275\u0275element(97, "input", 35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(98, "tr")(99, "td", 32);
    \u0275\u0275text(100, "Autres immobilisations");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(101, "td", 33);
    \u0275\u0275element(102, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(103, "td", 33);
    \u0275\u0275element(104, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(105, "td", 33);
    \u0275\u0275element(106, "input", 35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(107, "tr")(108, "td", 28);
    \u0275\u0275text(109, "Stocks");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(110, "td", 33);
    \u0275\u0275element(111, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(112, "td", 33);
    \u0275\u0275element(113, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(114, "td", 33);
    \u0275\u0275element(115, "input", 35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(116, "tr")(117, "td", 28);
    \u0275\u0275text(118, "Cr\xE9ances, Clients");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(119, "td", 33);
    \u0275\u0275element(120, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(121, "td", 33);
    \u0275\u0275element(122, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(123, "td", 33);
    \u0275\u0275element(124, "input", 35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(125, "tr")(126, "td", 28);
    \u0275\u0275text(127, "Tr\xE9sorerie (Caisse+Banque)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(128, "td", 33);
    \u0275\u0275element(129, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(130, "td", 33);
    \u0275\u0275element(131, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(132, "td", 33);
    \u0275\u0275element(133, "input", 35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(134, "tr", 36)(135, "td", 37);
    \u0275\u0275text(136, "TOTAL ACTIF");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(137, "td", 38);
    \u0275\u0275text(138);
    \u0275\u0275pipe(139, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(140, "td", 38);
    \u0275\u0275text(141);
    \u0275\u0275pipe(142, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275element(143, "td", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(144, "tr");
    \u0275\u0275element(145, "td", 39);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(146, "tr", 40)(147, "td", 26);
    \u0275\u0275text(148, "PASSIF");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(149, "tr")(150, "td", 28);
    \u0275\u0275text(151, "Situation nette (Capitaux propres) ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(152, "td", 41);
    \u0275\u0275text(153);
    \u0275\u0275pipe(154, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(155, "td", 41);
    \u0275\u0275text(156);
    \u0275\u0275pipe(157, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(158, "td", 42);
    \u0275\u0275text(159, "Calcul\xE9 auto.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(160, "tr")(161, "td", 28);
    \u0275\u0275text(162, "Emprunt \xE0 plus d'un an");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(163, "td", 33);
    \u0275\u0275element(164, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(165, "td", 33);
    \u0275\u0275element(166, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(167, "td", 33);
    \u0275\u0275element(168, "input", 35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(169, "tr")(170, "td", 28);
    \u0275\u0275text(171, "Emprunt \xE0 moins d'un an");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(172, "td", 33);
    \u0275\u0275element(173, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(174, "td", 33);
    \u0275\u0275element(175, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(176, "td", 33);
    \u0275\u0275element(177, "input", 35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(178, "tr")(179, "td", 28);
    \u0275\u0275text(180, "Autres dettes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(181, "td", 33);
    \u0275\u0275element(182, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(183, "td", 33);
    \u0275\u0275element(184, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(185, "td", 33);
    \u0275\u0275element(186, "input", 35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(187, "tr", 36)(188, "td", 37);
    \u0275\u0275text(189, "TOTAL BILAN");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(190, "td", 38);
    \u0275\u0275text(191);
    \u0275\u0275pipe(192, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(193, "td", 38);
    \u0275\u0275text(194);
    \u0275\u0275pipe(195, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275element(196, "td", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(197, "tr");
    \u0275\u0275element(198, "td", 39);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(199, "tr", 43)(200, "td", 28);
    \u0275\u0275text(201, "Fonds de roulement");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(202, "td", 44);
    \u0275\u0275text(203);
    \u0275\u0275pipe(204, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(205, "td", 44);
    \u0275\u0275text(206);
    \u0275\u0275pipe(207, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(208, "td", 45);
    \u0275\u0275text(209, "= CP + DLT - Immo");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(210, "tr", 43)(211, "td", 28);
    \u0275\u0275text(212, "Besoin en fonds de roulement");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(213, "td", 30);
    \u0275\u0275text(214);
    \u0275\u0275pipe(215, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(216, "td", 30);
    \u0275\u0275text(217);
    \u0275\u0275pipe(218, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(219, "td", 45);
    \u0275\u0275text(220, "= Stocks + Cr\xE9ances - DCT");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(221, "tr", 43)(222, "td", 28);
    \u0275\u0275text(223, "Tr\xE9sorerie nette");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(224, "td", 44);
    \u0275\u0275text(225);
    \u0275\u0275pipe(226, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(227, "td", 44);
    \u0275\u0275text(228);
    \u0275\u0275pipe(229, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(230, "td", 45);
    \u0275\u0275text(231, "= FR - BFR");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275template(232, AnalyseBilanActiviteComponent_div_8_ng_template_232_Template, 2, 2, "ng-template", 46);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(29);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(30, 74, \u0275\u0275pureFunction1(158, _c0, ctx_r1.totalActifImmobiliseN())), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(33, 80, \u0275\u0275pureFunction1(160, _c0, ctx_r1.totalActifImmobiliseN1())), " ");
    \u0275\u0275advance(7);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.bilanNForm, "terrains"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.bilanN1Form, "terrains"))("useGrouping", true);
    \u0275\u0275advance(7);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.bilanNForm, "constructions"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.bilanN1Form, "constructions"))("useGrouping", true);
    \u0275\u0275advance(7);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.bilanNForm, "installationsTechniques"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.bilanN1Form, "installationsTechniques"))("useGrouping", true);
    \u0275\u0275advance(7);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.bilanNForm, "autresImmobilisations"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.bilanN1Form, "autresImmobilisations"))("useGrouping", true);
    \u0275\u0275advance(7);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.bilanNForm, "materielBureau"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.bilanN1Form, "materielBureau"))("useGrouping", true);
    \u0275\u0275advance(7);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.bilanNForm, "immobilisationsFinancieres"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.bilanN1Form, "immobilisationsFinancieres"))("useGrouping", true);
    \u0275\u0275advance(7);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.bilanNForm, "materielTransport"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.bilanN1Form, "materielTransport"))("useGrouping", true);
    \u0275\u0275advance(7);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.bilanNForm, "immobilisationsEnCours"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.bilanN1Form, "immobilisationsEnCours"))("useGrouping", true);
    \u0275\u0275advance(7);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.bilanNForm, "stocks"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.bilanN1Form, "stocks"))("useGrouping", true);
    \u0275\u0275advance(7);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.bilanNForm, "creances"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.bilanN1Form, "creances"))("useGrouping", true);
    \u0275\u0275advance(7);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.bilanNForm, "tresorerieActif"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.bilanN1Form, "tresorerieActif"))("useGrouping", true);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(139, 86, \u0275\u0275pureFunction1(162, _c0, ctx_r1.totalActifN())), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(142, 92, \u0275\u0275pureFunction1(164, _c0, ctx_r1.totalActifN1())), " ");
    \u0275\u0275advance(12);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(154, 98, \u0275\u0275pureFunction1(166, _c0, ctx_r1.capitauxPropresN())), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(157, 104, \u0275\u0275pureFunction1(168, _c0, ctx_r1.capitauxPropresN1())), " ");
    \u0275\u0275advance(8);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.bilanNForm, "dettesLongTerme"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.bilanN1Form, "dettesLongTerme"))("useGrouping", true);
    \u0275\u0275advance(7);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.bilanNForm, "dettesCourtTerme"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.bilanN1Form, "dettesCourtTerme"))("useGrouping", true);
    \u0275\u0275advance(7);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.bilanNForm, "tresoreriePassif"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.bilanN1Form, "tresoreriePassif"))("useGrouping", true);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(192, 110, \u0275\u0275pureFunction1(170, _c0, ctx_r1.totalPassifN())), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(195, 116, \u0275\u0275pureFunction1(172, _c0, ctx_r1.totalPassifN1())), " ");
    \u0275\u0275advance(8);
    \u0275\u0275property("ngClass", ctx_r1.fondsRoulementN() >= 0 ? "text-green-700" : "text-red-700");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(204, 122, \u0275\u0275pureFunction1(174, _c0, ctx_r1.fondsRoulementN())), " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r1.fondsRoulementN1() >= 0 ? "text-green-700" : "text-red-700");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(207, 128, \u0275\u0275pureFunction1(176, _c0, ctx_r1.fondsRoulementN1())), " ");
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(215, 134, \u0275\u0275pureFunction1(178, _c0, ctx_r1.besoinFondsRoulementN())), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(218, 140, \u0275\u0275pureFunction1(180, _c0, ctx_r1.besoinFondsRoulementN1())), " ");
    \u0275\u0275advance(7);
    \u0275\u0275property("ngClass", ctx_r1.tresorerieNetteN() >= 0 ? "text-green-700" : "text-red-700");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(226, 146, \u0275\u0275pureFunction1(182, _c0, ctx_r1.tresorerieNetteN())), " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r1.tresorerieNetteN1() >= 0 ? "text-green-700" : "text-red-700");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(229, 152, \u0275\u0275pureFunction1(184, _c0, ctx_r1.tresorerieNetteN1())), " ");
  }
}
function AnalyseBilanActiviteComponent_div_9_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 47)(1, "h2", 48);
    \u0275\u0275text(2, "RENTABILIT\xC9 DE L'ACTIVIT\xC9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 49);
    \u0275\u0275text(4, "en GNF");
    \u0275\u0275elementEnd()();
  }
}
function AnalyseBilanActiviteComponent_div_9_ng_template_220_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 50)(1, "button", 65);
    \u0275\u0275listener("click", function AnalyseBilanActiviteComponent_div_9_ng_template_220_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.saveRentabiliteAll());
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("loading", ctx_r1.savingRentabilite())("disabled", !ctx_r1.state().analyseExiste);
  }
}
function AnalyseBilanActiviteComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "p-card");
    \u0275\u0275template(2, AnalyseBilanActiviteComponent_div_9_ng_template_2_Template, 5, 0, "ng-template", 16);
    \u0275\u0275elementStart(3, "div", 17)(4, "table", 18)(5, "thead")(6, "tr", 19)(7, "th", 52);
    \u0275\u0275text(8, "Rentabilit\xE9 de l'activit\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th", 53);
    \u0275\u0275text(10, " \xC9valuation actuelle");
    \u0275\u0275element(11, "br");
    \u0275\u0275elementStart(12, "small", 22);
    \u0275\u0275text(13, "Montant (N)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "th", 54);
    \u0275\u0275text(15, " \xC9valuation pr\xE9c\xE9dente");
    \u0275\u0275element(16, "br");
    \u0275\u0275elementStart(17, "small", 22);
    \u0275\u0275text(18, "Montant (N-1)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "th", 55);
    \u0275\u0275text(20, " Analyse du Projet");
    \u0275\u0275element(21, "br");
    \u0275\u0275elementStart(22, "small", 22);
    \u0275\u0275text(23, "Montant (N+1)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "th", 56);
    \u0275\u0275text(25, "Obs.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(26, "tbody")(27, "tr", 57)(28, "td", 37);
    \u0275\u0275text(29, "Chiffre d'affaires");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "td", 33);
    \u0275\u0275element(31, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "td", 33);
    \u0275\u0275element(33, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "td", 33);
    \u0275\u0275element(35, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275element(36, "td", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "tr")(38, "td", 31);
    \u0275\u0275text(39, "Co\xFBt d'achats des marchandises vendues");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "td", 33);
    \u0275\u0275element(41, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "td", 33);
    \u0275\u0275element(43, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "td", 33);
    \u0275\u0275element(45, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275element(46, "td", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "tr", 36)(48, "td", 37);
    \u0275\u0275text(49, " Marge brute ");
    \u0275\u0275elementStart(50, "span", 58);
    \u0275\u0275text(51);
    \u0275\u0275pipe(52, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(53, "td", 38);
    \u0275\u0275text(54);
    \u0275\u0275pipe(55, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(56, "td", 38);
    \u0275\u0275text(57);
    \u0275\u0275pipe(58, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(59, "td", 38);
    \u0275\u0275text(60);
    \u0275\u0275pipe(61, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(62, "td", 45);
    \u0275\u0275text(63, "Auto.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(64, "tr", 59)(65, "td", 60);
    \u0275\u0275text(66, "Autres charges");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(67, "tr")(68, "td", 61);
    \u0275\u0275text(69, "Salaires");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(70, "td", 33);
    \u0275\u0275element(71, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(72, "td", 33);
    \u0275\u0275element(73, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(74, "td", 33);
    \u0275\u0275element(75, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275element(76, "td", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(77, "tr")(78, "td", 61);
    \u0275\u0275text(79, "Pr\xE9l\xE8vement de l'entrepreneur");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(80, "td", 33);
    \u0275\u0275element(81, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(82, "td", 33);
    \u0275\u0275element(83, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(84, "td", 33);
    \u0275\u0275element(85, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275element(86, "td", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(87, "tr")(88, "td", 61);
    \u0275\u0275text(89, "Loyers");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(90, "td", 33);
    \u0275\u0275element(91, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(92, "td", 33);
    \u0275\u0275element(93, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(94, "td", 33);
    \u0275\u0275element(95, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275element(96, "td", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(97, "tr")(98, "td", 61);
    \u0275\u0275text(99, "Transport");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(100, "td", 33);
    \u0275\u0275element(101, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(102, "td", 33);
    \u0275\u0275element(103, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(104, "td", 33);
    \u0275\u0275element(105, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275element(106, "td", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(107, "tr")(108, "td", 61);
    \u0275\u0275text(109, "\xC9lectricit\xE9, eau, t\xE9l\xE9phone");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(110, "td", 33);
    \u0275\u0275element(111, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(112, "td", 33);
    \u0275\u0275element(113, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(114, "td", 33);
    \u0275\u0275element(115, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275element(116, "td", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(117, "tr")(118, "td", 61);
    \u0275\u0275text(119, "Fournitures et autres besoins");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(120, "td", 33);
    \u0275\u0275element(121, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(122, "td", 33);
    \u0275\u0275element(123, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(124, "td", 33);
    \u0275\u0275element(125, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275element(126, "td", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(127, "tr")(128, "td", 61);
    \u0275\u0275text(129, "Imp\xF4ts et taxes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(130, "td", 33);
    \u0275\u0275element(131, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(132, "td", 33);
    \u0275\u0275element(133, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(134, "td", 33);
    \u0275\u0275element(135, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275element(136, "td", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(137, "tr")(138, "td", 61);
    \u0275\u0275text(139, "Frais financiers");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(140, "td", 33);
    \u0275\u0275element(141, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(142, "td", 33);
    \u0275\u0275element(143, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(144, "td", 33);
    \u0275\u0275element(145, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275element(146, "td", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(147, "tr")(148, "td", 61);
    \u0275\u0275text(149, "Dotation amortissement");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(150, "td", 33);
    \u0275\u0275element(151, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(152, "td", 33);
    \u0275\u0275element(153, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(154, "td", 33);
    \u0275\u0275element(155, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275element(156, "td", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(157, "tr")(158, "td", 61);
    \u0275\u0275text(159, "Autres charges diverses");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(160, "td", 33);
    \u0275\u0275element(161, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(162, "td", 33);
    \u0275\u0275element(163, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(164, "td", 33);
    \u0275\u0275element(165, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275element(166, "td", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(167, "tr", 62)(168, "td", 37);
    \u0275\u0275text(169, "Total Charges");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(170, "td", 63);
    \u0275\u0275text(171);
    \u0275\u0275pipe(172, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(173, "td", 63);
    \u0275\u0275text(174);
    \u0275\u0275pipe(175, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(176, "td", 63);
    \u0275\u0275text(177);
    \u0275\u0275pipe(178, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275element(179, "td", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(180, "tr")(181, "td", 28);
    \u0275\u0275text(182, "Autres revenus");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(183, "td", 33);
    \u0275\u0275element(184, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(185, "td", 33);
    \u0275\u0275element(186, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(187, "td", 33);
    \u0275\u0275element(188, "p-inputNumber", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275element(189, "td", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(190, "tr");
    \u0275\u0275element(191, "td", 64);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(192, "tr", 25)(193, "td", 37);
    \u0275\u0275text(194, "R\xE9sultat d'exploitation");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(195, "td", 44);
    \u0275\u0275text(196);
    \u0275\u0275pipe(197, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(198, "td", 44);
    \u0275\u0275text(199);
    \u0275\u0275pipe(200, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(201, "td", 44);
    \u0275\u0275text(202);
    \u0275\u0275pipe(203, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(204, "td", 45);
    \u0275\u0275text(205, "Auto.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(206, "tr", 40)(207, "td", 37);
    \u0275\u0275text(208, "Cash-Flow");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(209, "td", 41);
    \u0275\u0275text(210);
    \u0275\u0275pipe(211, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(212, "td", 41);
    \u0275\u0275text(213);
    \u0275\u0275pipe(214, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(215, "td", 41);
    \u0275\u0275text(216);
    \u0275\u0275pipe(217, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(218, "td", 45);
    \u0275\u0275text(219, "R\xE9sultat + Amort.");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275template(220, AnalyseBilanActiviteComponent_div_9_ng_template_220_Template, 2, 2, "ng-template", 46);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(31);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteNForm, "chiffreAffaires"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteN1Form, "chiffreAffaires"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteN2Form, "chiffreAffaires"))("useGrouping", true);
    \u0275\u0275advance(6);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteNForm, "coutAchats"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteN1Form, "coutAchats"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteN2Form, "coutAchats"))("useGrouping", true);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" (", \u0275\u0275pipeBind2(52, 94, ctx_r1.tauxMargeBruteN(), "1.0-0"), "%) ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(55, 97, \u0275\u0275pureFunction1(169, _c0, ctx_r1.margeBruteN())), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(58, 103, \u0275\u0275pureFunction1(171, _c0, ctx_r1.margeBruteN1())), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(61, 109, \u0275\u0275pureFunction1(173, _c0, ctx_r1.margeBruteN2())), " ");
    \u0275\u0275advance(11);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteNForm, "salaires"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteN1Form, "salaires"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteN2Form, "salaires"))("useGrouping", true);
    \u0275\u0275advance(6);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteNForm, "chargesSociales"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteN1Form, "chargesSociales"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteN2Form, "chargesSociales"))("useGrouping", true);
    \u0275\u0275advance(6);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteNForm, "loyer"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteN1Form, "loyer"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteN2Form, "loyer"))("useGrouping", true);
    \u0275\u0275advance(6);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteNForm, "transport"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteN1Form, "transport"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteN2Form, "transport"))("useGrouping", true);
    \u0275\u0275advance(6);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteNForm, "electricite"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteN1Form, "electricite"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteN2Form, "electricite"))("useGrouping", true);
    \u0275\u0275advance(6);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteNForm, "entretien"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteN1Form, "entretien"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteN2Form, "entretien"))("useGrouping", true);
    \u0275\u0275advance(6);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteNForm, "impotsTaxes"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteN1Form, "impotsTaxes"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteN2Form, "impotsTaxes"))("useGrouping", true);
    \u0275\u0275advance(6);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteNForm, "fraisFinanciers"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteN1Form, "fraisFinanciers"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteN2Form, "fraisFinanciers"))("useGrouping", true);
    \u0275\u0275advance(6);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteNForm, "dotationAmortissement"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteN1Form, "dotationAmortissement"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteN2Form, "dotationAmortissement"))("useGrouping", true);
    \u0275\u0275advance(6);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteNForm, "autresCharges"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteN1Form, "autresCharges"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteN2Form, "autresCharges"))("useGrouping", true);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(172, 115, \u0275\u0275pureFunction1(175, _c0, ctx_r1.totalChargesN())), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(175, 121, \u0275\u0275pureFunction1(177, _c0, ctx_r1.totalChargesN1())), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(178, 127, \u0275\u0275pureFunction1(179, _c0, ctx_r1.totalChargesN2())), " ");
    \u0275\u0275advance(7);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteNForm, "autresRevenus"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteN1Form, "autresRevenus"))("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r1.getControl(ctx_r1.rentabiliteN2Form, "autresRevenus"))("useGrouping", true);
    \u0275\u0275advance(7);
    \u0275\u0275property("ngClass", ctx_r1.resultatExploitationN() >= 0 ? "text-green-700" : "text-red-700");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(197, 133, \u0275\u0275pureFunction1(181, _c0, ctx_r1.resultatExploitationN())), " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r1.resultatExploitationN1() >= 0 ? "text-green-700" : "text-red-700");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(200, 139, \u0275\u0275pureFunction1(183, _c0, ctx_r1.resultatExploitationN1())), " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r1.resultatExploitationN2() >= 0 ? "text-green-700" : "text-red-700");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(203, 145, \u0275\u0275pureFunction1(185, _c0, ctx_r1.resultatExploitationN2())), " ");
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(211, 151, \u0275\u0275pureFunction1(187, _c0, ctx_r1.cashFlowN())), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(214, 157, \u0275\u0275pureFunction1(189, _c0, ctx_r1.cashFlowN1())), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(217, 163, \u0275\u0275pureFunction1(191, _c0, ctx_r1.cashFlowN2())), " ");
  }
}
function AnalyseBilanActiviteComponent_div_10_div_37_div_4_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 85)(1, "span", 86);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 87);
    \u0275\u0275listener("click", function AnalyseBilanActiviteComponent_div_10_div_37_div_4_ng_template_2_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r6);
      const i_r7 = \u0275\u0275nextContext().index;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.removePersonnecaution(i_r7));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const caution_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", caution_r8.prenom, " ", caution_r8.nom, "");
  }
}
function AnalyseBilanActiviteComponent_div_10_div_37_div_4_div_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 88)(1, "strong");
    \u0275\u0275text(2, "T\xE9l\xE9phone:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const caution_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", caution_r8.telephone, " ");
  }
}
function AnalyseBilanActiviteComponent_div_10_div_37_div_4_div_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 88)(1, "strong");
    \u0275\u0275text(2, "\xC2ge:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const caution_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", caution_r8.age, " ans ");
  }
}
function AnalyseBilanActiviteComponent_div_10_div_37_div_4_div_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 88)(1, "strong");
    \u0275\u0275text(2, "Activit\xE9:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const caution_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", caution_r8.activite, " ");
  }
}
function AnalyseBilanActiviteComponent_div_10_div_37_div_4_div_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 88)(1, "strong");
    \u0275\u0275text(2, "Profession:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const caution_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", caution_r8.profession, " ");
  }
}
function AnalyseBilanActiviteComponent_div_10_div_37_div_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 72)(1, "p-card");
    \u0275\u0275template(2, AnalyseBilanActiviteComponent_div_10_div_37_div_4_ng_template_2_Template, 4, 2, "ng-template", 16);
    \u0275\u0275elementStart(3, "div", 83);
    \u0275\u0275template(4, AnalyseBilanActiviteComponent_div_10_div_37_div_4_div_4_Template, 4, 1, "div", 84)(5, AnalyseBilanActiviteComponent_div_10_div_37_div_4_div_5_Template, 4, 1, "div", 84)(6, AnalyseBilanActiviteComponent_div_10_div_37_div_4_div_6_Template, 4, 1, "div", 84)(7, AnalyseBilanActiviteComponent_div_10_div_37_div_4_div_7_Template, 4, 1, "div", 84);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const caution_r8 = ctx.$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", caution_r8.telephone);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", caution_r8.age);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", caution_r8.activite);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", caution_r8.profession);
  }
}
function AnalyseBilanActiviteComponent_div_10_div_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 68)(1, "h3", 69);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 67);
    \u0275\u0275template(4, AnalyseBilanActiviteComponent_div_10_div_37_div_4_Template, 8, 4, "div", 82);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Personnes caution ajout\xE9es (", ctx_r1.personnecautions.length, ") ");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r1.personnecautions);
  }
}
function AnalyseBilanActiviteComponent_div_10_div_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 68)(1, "div", 89);
    \u0275\u0275element(2, "i", 11);
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "Aucune personne caution ajout\xE9e.");
    \u0275\u0275elementEnd()()();
  }
}
function AnalyseBilanActiviteComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "p-card", 66)(2, "div", 67)(3, "div", 68)(4, "h3", 69);
    \u0275\u0275text(5, " Ajouter une personne caution ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 70);
    \u0275\u0275text(7, " Les personnes caution sont optionnelles mais peuvent renforcer le dossier. ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 68)(9, "form", 71)(10, "div", 67)(11, "div", 72)(12, "label", 73);
    \u0275\u0275text(13, "Nom");
    \u0275\u0275elementEnd();
    \u0275\u0275element(14, "input", 74);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 72)(16, "label", 73);
    \u0275\u0275text(17, "Pr\xE9nom");
    \u0275\u0275elementEnd();
    \u0275\u0275element(18, "input", 75);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div", 72)(20, "label", 73);
    \u0275\u0275text(21, "T\xE9l\xE9phone");
    \u0275\u0275elementEnd();
    \u0275\u0275element(22, "input", 76);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "div", 72)(24, "label", 73);
    \u0275\u0275text(25, "\xC2ge");
    \u0275\u0275elementEnd();
    \u0275\u0275element(26, "p-inputNumber", 77);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "div", 72)(28, "label", 73);
    \u0275\u0275text(29, "Activit\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275element(30, "input", 78);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div", 72)(32, "label", 73);
    \u0275\u0275text(33, "Profession");
    \u0275\u0275elementEnd();
    \u0275\u0275element(34, "input", 79);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "div", 68)(36, "button", 80);
    \u0275\u0275listener("click", function AnalyseBilanActiviteComponent_div_10_Template_button_click_36_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.addPersonnecaution());
    });
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275template(37, AnalyseBilanActiviteComponent_div_10_div_37_Template, 5, 2, "div", 81)(38, AnalyseBilanActiviteComponent_div_10_div_38_Template, 5, 0, "div", 81);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(9);
    \u0275\u0275property("formGroup", ctx_r1.personnecautionForm);
    \u0275\u0275advance(17);
    \u0275\u0275property("showButtons", true)("min", 18)("max", 100);
    \u0275\u0275advance(11);
    \u0275\u0275property("ngIf", ctx_r1.personnecautions.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.personnecautions.length === 0);
  }
}
function AnalyseBilanActiviteComponent_div_11_div_45_div_1_span_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 113);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const caution_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("- ", caution_r9.profession, "");
  }
}
function AnalyseBilanActiviteComponent_div_11_div_45_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 72)(1, "div", 111)(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, AnalyseBilanActiviteComponent_div_11_div_45_div_1_span_4_Template, 2, 1, "span", 112);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const caution_r9 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", caution_r9.prenom, " ", caution_r9.nom, "");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", caution_r9.profession);
  }
}
function AnalyseBilanActiviteComponent_div_11_div_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 83);
    \u0275\u0275template(1, AnalyseBilanActiviteComponent_div_11_div_45_div_1_Template, 5, 3, "div", 82);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.personnecautions);
  }
}
function AnalyseBilanActiviteComponent_div_11_div_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 109);
    \u0275\u0275element(1, "i", 11);
    \u0275\u0275text(2, "Aucune personne caution ajout\xE9e ");
    \u0275\u0275elementEnd();
  }
}
function AnalyseBilanActiviteComponent_div_11_ng_template_52_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 114)(1, "button", 115);
    \u0275\u0275listener("click", function AnalyseBilanActiviteComponent_div_11_ng_template_52_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.submitAnalyse());
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("loading", ctx_r1.loading())("disabled", !ctx_r1.state().analyseExiste);
  }
}
function AnalyseBilanActiviteComponent_div_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "p-card", 90)(2, "div", 83)(3, "div", 68)(4, "h3", 91);
    \u0275\u0275element(5, "i", 92);
    \u0275\u0275text(6, "R\xE9capitulatif de la demande ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 93)(8, "div", 94)(9, "span", 95);
    \u0275\u0275text(10, "Montant sollicit\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "strong", 96);
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "currency");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "div", 93)(15, "div", 94)(16, "span", 95);
    \u0275\u0275text(17, "Dur\xE9e sollicit\xE9e");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "strong", 96);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "div", 93)(21, "div", 97)(22, "span", 95);
    \u0275\u0275text(23, "Besoin Investissement");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "strong", 98);
    \u0275\u0275text(25);
    \u0275\u0275pipe(26, "currency");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(27, "div", 93)(28, "div", 99)(29, "span", 95);
    \u0275\u0275text(30, "Besoin Exploitation");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "strong", 100);
    \u0275\u0275text(32);
    \u0275\u0275pipe(33, "currency");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(34, "div", 101)(35, "div", 102)(36, "span", 103);
    \u0275\u0275text(37, "Besoin Total de Financement (effectif)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "strong", 104);
    \u0275\u0275text(39);
    \u0275\u0275pipe(40, "currency");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(41, "div", 105)(42, "h3", 69);
    \u0275\u0275element(43, "i", 106);
    \u0275\u0275text(44);
    \u0275\u0275elementEnd();
    \u0275\u0275template(45, AnalyseBilanActiviteComponent_div_11_div_45_Template, 2, 1, "div", 107)(46, AnalyseBilanActiviteComponent_div_11_div_46_Template, 3, 0, "div", 108);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "div", 105)(48, "div", 109);
    \u0275\u0275element(49, "i", 110);
    \u0275\u0275elementStart(50, "span");
    \u0275\u0275text(51, "En soumettant cette analyse, le dossier sera transf\xE9r\xE9 au comit\xE9 de cr\xE9dit pour examen.");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275template(52, AnalyseBilanActiviteComponent_div_11_ng_template_52_Template, 2, 2, "ng-template", 46);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(12);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBindV(13, 8, \u0275\u0275pureFunction1(32, _c0, (tmp_1_0 = ctx_r1.state().demandeIndividuel) == null ? null : tmp_1_0.montantDemande)));
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1("", (tmp_2_0 = ctx_r1.state().demandeIndividuel) == null ? null : tmp_2_0.dureeDemande, " mois");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBindV(26, 14, \u0275\u0275pureFunction1(34, _c0, ctx_r1.besoinReelInvestissementFinal())));
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBindV(33, 20, \u0275\u0275pureFunction1(36, _c0, ctx_r1.besoinReelExploitationFinal())));
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBindV(40, 26, \u0275\u0275pureFunction1(38, _c0, ctx_r1.besoinTotalFinancementFinal())));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("Personnes caution (", ctx_r1.personnecautions.length, ") ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.personnecautions.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.personnecautions.length === 0);
  }
}
function AnalyseBilanActiviteComponent_div_12_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 47)(1, "h2", 48);
    \u0275\u0275text(2, "BESOIN EN CR\xC9DIT");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 49);
    \u0275\u0275text(4, "en GNF");
    \u0275\u0275elementEnd()();
  }
}
function AnalyseBilanActiviteComponent_div_12_ng_template_239_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 50)(1, "button", 179);
    \u0275\u0275listener("click", function AnalyseBilanActiviteComponent_div_12_ng_template_239_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.saveBesoinCredit());
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("loading", ctx_r1.savingBesoinCredit())("disabled", !ctx_r1.state().analyseExiste);
  }
}
function AnalyseBilanActiviteComponent_div_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "p-card");
    \u0275\u0275template(2, AnalyseBilanActiviteComponent_div_12_ng_template_2_Template, 5, 0, "ng-template", 16);
    \u0275\u0275elementStart(3, "form", 116)(4, "div", 17)(5, "table", 18)(6, "thead")(7, "tr", 19)(8, "th", 52);
    \u0275\u0275text(9, "D\xE9signation ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 117);
    \u0275\u0275text(11, " Montant");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 118);
    \u0275\u0275text(13, " Ajustement");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 119);
    \u0275\u0275text(15, " Montant effectif");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(16, "tbody")(17, "tr", 25)(18, "td", 26);
    \u0275\u0275element(19, "i", 120);
    \u0275\u0275text(20, "INVESTISSEMENT ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "tr")(22, "td", 61);
    \u0275\u0275text(23, "Co\xFBt de l'\xE9quipement");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "td", 33);
    \u0275\u0275element(25, "p-inputNumber", 121);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "td", 122);
    \u0275\u0275element(27, "p-inputNumber", 123);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "td", 124);
    \u0275\u0275text(29);
    \u0275\u0275pipe(30, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "tr")(32, "td", 61);
    \u0275\u0275text(33, "D\xE9penses rattach\xE9es");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "td", 33);
    \u0275\u0275element(35, "p-inputNumber", 125);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "td", 122);
    \u0275\u0275element(37, "p-inputNumber", 126);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "td", 124);
    \u0275\u0275text(39);
    \u0275\u0275pipe(40, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(41, "tr", 57)(42, "td", 127);
    \u0275\u0275text(43, "Total Investissement");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "td", 128);
    \u0275\u0275text(45);
    \u0275\u0275pipe(46, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "td", 129);
    \u0275\u0275text(48);
    \u0275\u0275pipe(49, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "td", 130);
    \u0275\u0275text(51);
    \u0275\u0275pipe(52, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(53, "tr")(54, "td", 131);
    \u0275\u0275text(55, "(-) Apport personnel ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(56, "td", 33);
    \u0275\u0275element(57, "p-inputNumber", 132);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "td", 122);
    \u0275\u0275element(59, "p-inputNumber", 133);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(60, "td", 134);
    \u0275\u0275text(61);
    \u0275\u0275pipe(62, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(63, "tr", 135)(64, "td", 37);
    \u0275\u0275text(65, "= BESOIN R\xC9EL INVESTISSEMENT");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(66, "td", 136);
    \u0275\u0275text(67);
    \u0275\u0275pipe(68, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(69, "td", 137);
    \u0275\u0275text(70);
    \u0275\u0275pipe(71, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(72, "td", 138);
    \u0275\u0275text(73);
    \u0275\u0275pipe(74, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(75, "tr");
    \u0275\u0275element(76, "td", 39);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(77, "tr", 40)(78, "td", 26);
    \u0275\u0275element(79, "i", 139);
    \u0275\u0275text(80, "EXPLOITATION ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(81, "tr")(82, "td", 61);
    \u0275\u0275text(83, "Co\xFBt d'achat du cycle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(84, "td", 33);
    \u0275\u0275element(85, "p-inputNumber", 140);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(86, "td", 122);
    \u0275\u0275element(87, "p-inputNumber", 141);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(88, "td", 124);
    \u0275\u0275text(89);
    \u0275\u0275pipe(90, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(91, "tr")(92, "td", 61);
    \u0275\u0275text(93, "Nombre de cycles \xE0 financer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(94, "td", 142);
    \u0275\u0275element(95, "p-inputNumber", 143);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(96, "td", 144);
    \u0275\u0275text(97);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(98, "tr", 145)(99, "td", 127);
    \u0275\u0275text(100, "Besoin brut (Co\xFBt \xD7 Cycles)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(101, "td", 41);
    \u0275\u0275text(102);
    \u0275\u0275pipe(103, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(104, "td", 129);
    \u0275\u0275text(105);
    \u0275\u0275pipe(106, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(107, "td", 130);
    \u0275\u0275text(108);
    \u0275\u0275pipe(109, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(110, "tr", 27)(111, "td", 146);
    \u0275\u0275text(112, " (-) Ressources disponibles ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(113, "tr")(114, "td", 147);
    \u0275\u0275text(115, "Tr\xE9sorerie disponible");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(116, "td", 33);
    \u0275\u0275element(117, "p-inputNumber", 148);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(118, "td", 122);
    \u0275\u0275element(119, "p-inputNumber", 149);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(120, "td", 124);
    \u0275\u0275text(121);
    \u0275\u0275pipe(122, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(123, "tr")(124, "td", 147);
    \u0275\u0275text(125, "Stock actuel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(126, "td", 33);
    \u0275\u0275element(127, "p-inputNumber", 150);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(128, "td", 122);
    \u0275\u0275element(129, "p-inputNumber", 151);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(130, "td", 124);
    \u0275\u0275text(131);
    \u0275\u0275pipe(132, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(133, "tr")(134, "td", 147);
    \u0275\u0275text(135, "Comptes \xE0 recevoir");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(136, "td", 33);
    \u0275\u0275element(137, "p-inputNumber", 152);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(138, "td", 122);
    \u0275\u0275element(139, "p-inputNumber", 153);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(140, "td", 124);
    \u0275\u0275text(141);
    \u0275\u0275pipe(142, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(143, "tr", 154)(144, "td", 155);
    \u0275\u0275text(145, "Total ressources disponibles");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(146, "td", 38);
    \u0275\u0275text(147);
    \u0275\u0275pipe(148, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(149, "td", 129);
    \u0275\u0275text(150);
    \u0275\u0275pipe(151, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(152, "td", 156);
    \u0275\u0275text(153);
    \u0275\u0275pipe(154, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(155, "tr", 27)(156, "td", 157);
    \u0275\u0275text(157, " (+) Dettes \xE0 payer ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(158, "tr")(159, "td", 147);
    \u0275\u0275text(160, "Dettes fournisseurs");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(161, "td", 33);
    \u0275\u0275element(162, "p-inputNumber", 158);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(163, "td", 122);
    \u0275\u0275element(164, "p-inputNumber", 159);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(165, "td", 124);
    \u0275\u0275text(166);
    \u0275\u0275pipe(167, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(168, "tr")(169, "td", 147);
    \u0275\u0275text(170, "Cr\xE9dit fournisseur");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(171, "td", 33);
    \u0275\u0275element(172, "p-inputNumber", 160);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(173, "td", 122);
    \u0275\u0275element(174, "p-inputNumber", 161);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(175, "td", 124);
    \u0275\u0275text(176);
    \u0275\u0275pipe(177, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(178, "tr", 59)(179, "td", 162);
    \u0275\u0275text(180, "Total dettes \xE0 payer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(181, "td", 63);
    \u0275\u0275text(182);
    \u0275\u0275pipe(183, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(184, "td", 129);
    \u0275\u0275text(185);
    \u0275\u0275pipe(186, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(187, "td", 163);
    \u0275\u0275text(188);
    \u0275\u0275pipe(189, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(190, "tr", 164)(191, "td", 37);
    \u0275\u0275text(192, "= BESOIN R\xC9EL EXPLOITATION");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(193, "td", 165);
    \u0275\u0275text(194);
    \u0275\u0275pipe(195, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(196, "td", 137);
    \u0275\u0275text(197);
    \u0275\u0275pipe(198, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(199, "td", 138);
    \u0275\u0275text(200);
    \u0275\u0275pipe(201, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(202, "tr");
    \u0275\u0275element(203, "td", 166);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(204, "tr", 167)(205, "td", 168);
    \u0275\u0275element(206, "i", 169);
    \u0275\u0275text(207, "BESOIN TOTAL DE FINANCEMENT ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(208, "td", 170);
    \u0275\u0275text(209);
    \u0275\u0275pipe(210, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(211, "td", 171);
    \u0275\u0275text(212);
    \u0275\u0275pipe(213, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(214, "td", 172);
    \u0275\u0275text(215);
    \u0275\u0275pipe(216, "currency");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(217, "div", 173)(218, "div", 174)(219, "div", 175)(220, "span", 95);
    \u0275\u0275text(221, "Besoin Investissement");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(222, "strong", 96);
    \u0275\u0275text(223);
    \u0275\u0275pipe(224, "currency");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(225, "div", 174)(226, "div", 176)(227, "span", 95);
    \u0275\u0275text(228, "Besoin Exploitation");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(229, "strong", 100);
    \u0275\u0275text(230);
    \u0275\u0275pipe(231, "currency");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(232, "div", 174)(233, "div", 177)(234, "span", 95);
    \u0275\u0275text(235, "Total Financement (effectif)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(236, "strong", 178);
    \u0275\u0275text(237);
    \u0275\u0275pipe(238, "currency");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275template(239, AnalyseBilanActiviteComponent_div_12_ng_template_239_Template, 2, 2, "ng-template", 46);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("formGroup", ctx_r1.besoinCreditForm);
    \u0275\u0275advance(22);
    \u0275\u0275property("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(30, 56, \u0275\u0275pureFunction1(254, _c0, ctx_r1.effCoutEquipement())), " ");
    \u0275\u0275advance(6);
    \u0275\u0275property("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(40, 62, \u0275\u0275pureFunction1(256, _c0, ctx_r1.effDepensesRattachees())), " ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(46, 68, \u0275\u0275pureFunction1(258, _c0, ctx_r1.totalInvestissementMontant())), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(49, 74, \u0275\u0275pureFunction1(260, _c0, ctx_r1.totalInvestissementAjuste())), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(52, 80, \u0275\u0275pureFunction1(262, _c0, ctx_r1.totalInvestissementEffectif())), " ");
    \u0275\u0275advance(6);
    \u0275\u0275property("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(62, 86, \u0275\u0275pureFunction1(264, _c0, ctx_r1.effApportPersonnel())), " ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(68, 92, \u0275\u0275pureFunction1(266, _c0, ctx_r1.besoinReelInvestissementMontant())), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(71, 98, \u0275\u0275pureFunction1(268, _c0, ctx_r1.besoinReelInvestissementAjuste())), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(74, 104, \u0275\u0275pureFunction1(270, _c0, ctx_r1.besoinReelInvestissementFinal())), " ");
    \u0275\u0275advance(12);
    \u0275\u0275property("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(90, 110, \u0275\u0275pureFunction1(272, _c0, ctx_r1.effCoutAchatCycle())), " ");
    \u0275\u0275advance(6);
    \u0275\u0275property("showButtons", true)("min", 1)("max", 12);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.exploitationNbreCycles(), " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(103, 116, \u0275\u0275pureFunction1(274, _c0, ctx_r1.besoinBrutExploitationMontant())), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(106, 122, \u0275\u0275pureFunction1(276, _c0, ctx_r1.besoinBrutExploitationAjuste())), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(109, 128, \u0275\u0275pureFunction1(278, _c0, ctx_r1.besoinBrutExploitationEffectif())), " ");
    \u0275\u0275advance(9);
    \u0275\u0275property("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(122, 134, \u0275\u0275pureFunction1(280, _c0, ctx_r1.effTresorerieDispo())), " ");
    \u0275\u0275advance(6);
    \u0275\u0275property("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(132, 140, \u0275\u0275pureFunction1(282, _c0, ctx_r1.effStockActuel())), " ");
    \u0275\u0275advance(6);
    \u0275\u0275property("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(142, 146, \u0275\u0275pureFunction1(284, _c0, ctx_r1.effComptesRecevoir())), " ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(148, 152, \u0275\u0275pureFunction1(286, _c0, ctx_r1.ressourcesDisponiblesMontant())), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(151, 158, \u0275\u0275pureFunction1(288, _c0, ctx_r1.ressourcesDisponiblesAjuste())), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(154, 164, \u0275\u0275pureFunction1(290, _c0, ctx_r1.ressourcesDisponiblesEffectif())), " ");
    \u0275\u0275advance(9);
    \u0275\u0275property("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(167, 170, \u0275\u0275pureFunction1(292, _c0, ctx_r1.effDettesFournisseurs())), " ");
    \u0275\u0275advance(6);
    \u0275\u0275property("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("useGrouping", true);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(177, 176, \u0275\u0275pureFunction1(294, _c0, ctx_r1.effCreditFournisseur())), " ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(183, 182, \u0275\u0275pureFunction1(296, _c0, ctx_r1.totalDettesMontant())), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(186, 188, \u0275\u0275pureFunction1(298, _c0, ctx_r1.totalDettesAjuste())), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(189, 194, \u0275\u0275pureFunction1(300, _c0, ctx_r1.totalDettesEffectif())), " ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(195, 200, \u0275\u0275pureFunction1(302, _c0, ctx_r1.besoinReelExploitationMontant())), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(198, 206, \u0275\u0275pureFunction1(304, _c0, ctx_r1.besoinReelExploitationAjuste())), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(201, 212, \u0275\u0275pureFunction1(306, _c0, ctx_r1.besoinReelExploitationFinal())), " ");
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(210, 218, \u0275\u0275pureFunction1(308, _c0, ctx_r1.besoinTotalFinancementMontant())), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(213, 224, \u0275\u0275pureFunction1(310, _c0, ctx_r1.besoinTotalFinancementAjuste())), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBindV(216, 230, \u0275\u0275pureFunction1(312, _c0, ctx_r1.besoinTotalFinancementFinal())), " ");
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBindV(224, 236, \u0275\u0275pureFunction1(314, _c0, ctx_r1.besoinReelInvestissementFinal())));
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBindV(231, 242, \u0275\u0275pureFunction1(316, _c0, ctx_r1.besoinReelExploitationFinal())));
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBindV(238, 248, \u0275\u0275pureFunction1(318, _c0, ctx_r1.besoinTotalFinancementFinal())));
  }
}
registerLocaleData(fr_default, "fr-FR");
var AnalyseBilanActiviteComponent = class _AnalyseBilanActiviteComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  messageService = inject(MessageService);
  destroyRef = inject(DestroyRef);
  userService = inject(UserService);
  http = inject(HttpClient);
  route = inject(ActivatedRoute);
  apiUrl = environment.apiBaseUrl;
  state = signal({
    loading: false,
    allDelegations: [],
    allAgences: [],
    allPointsVente: [],
    filteredAgences: [],
    filteredPointsVente: [],
    demandeIndividuel: null,
    userId: null,
    analyseId: null,
    analyseExiste: false
  });
  activeIndex = signal(0);
  items = signal([]);
  loading = signal(false);
  savingBilan = signal(false);
  savingRentabilite = signal(false);
  savingBesoinCredit = signal(false);
  calculatingRatios = signal(false);
  // Forms
  bilanNForm;
  // Bilan année N
  bilanN1Form;
  // Bilan année N-1
  rentabiliteNForm;
  // Rentabilité année N
  rentabiliteN1Form;
  // Rentabilité année N-1
  rentabiliteN2Form;
  // Rentabilité prévisionnel N+1
  besoinCreditForm;
  propositionForm;
  demandeCreditForm;
  personnecautionForm;
  // Ratios data
  ratiosData = signal([]);
  personnecautions = [];
  demandeIndividuelId = null;
  // Periodicités disponibles
  periodicites = [
    { label: "Mensuelle", value: "MENSUELLE", facteur: 1 },
    { label: "Bimestrielle", value: "BIMESTRIELLE", facteur: 2 },
    { label: "Trimestrielle", value: "TRIMESTRIELLE", facteur: 3 },
    { label: "Quadrimestrielle", value: "QUADRIMESTRIELLE", facteur: 4 },
    { label: "Semestrielle", value: "SEMESTRIELLE", facteur: 6 },
    { label: "Annuelle", value: "ANNUELLE", facteur: 12 },
    { label: "Unique", value: "UNIQUE", facteur: 1 }
  ];
  // ============== COMPUTED VALUES FOR BILAN ==============
  // Bilan N - ACTIF
  totalActifImmobiliseN = computed(() => {
    const form = this.bilanNForm;
    if (!form)
      return 0;
    return (form.get("terrains")?.value || 0) + (form.get("constructions")?.value || 0) + (form.get("installationsTechniques")?.value || 0) + (form.get("materielTransport")?.value || 0) + (form.get("materielBureau")?.value || 0) + (form.get("autresImmobilisations")?.value || 0) + (form.get("immobilisationsEnCours")?.value || 0) + (form.get("immobilisationsFinancieres")?.value || 0);
  });
  totalActifCirculantN = computed(() => {
    const form = this.bilanNForm;
    if (!form)
      return 0;
    return (form.get("stocks")?.value || 0) + (form.get("creances")?.value || 0) + (form.get("tresorerieActif")?.value || 0);
  });
  totalActifN = computed(() => this.totalActifImmobiliseN() + this.totalActifCirculantN());
  // Bilan N - PASSIF
  capitauxPropresN = computed(() => {
    const totalDettes = (this.bilanNForm?.get("dettesLongTerme")?.value || 0) + (this.bilanNForm?.get("dettesCourtTerme")?.value || 0) + (this.bilanNForm?.get("tresoreriePassif")?.value || 0);
    return this.totalActifN() - totalDettes;
  });
  totalPassifN = computed(() => {
    const form = this.bilanNForm;
    if (!form)
      return 0;
    return this.capitauxPropresN() + (form.get("dettesLongTerme")?.value || 0) + (form.get("dettesCourtTerme")?.value || 0) + (form.get("tresoreriePassif")?.value || 0);
  });
  fondsRoulementN = computed(() => {
    return this.capitauxPropresN() + (this.bilanNForm?.get("dettesLongTerme")?.value || 0) - this.totalActifImmobiliseN();
  });
  besoinFondsRoulementN = computed(() => {
    const stocks = this.bilanNForm?.get("stocks")?.value || 0;
    const creances = this.bilanNForm?.get("creances")?.value || 0;
    const dettesCourtTerme = this.bilanNForm?.get("dettesCourtTerme")?.value || 0;
    return stocks + creances - dettesCourtTerme;
  });
  tresorerieNetteN = computed(() => {
    return this.fondsRoulementN() - this.besoinFondsRoulementN();
  });
  // ============== COMPUTED VALUES FOR BILAN N-1 ==============
  // Bilan N-1 - ACTIF
  totalActifImmobiliseN1 = computed(() => {
    const form = this.bilanN1Form;
    if (!form)
      return 0;
    return (form.get("terrains")?.value || 0) + (form.get("constructions")?.value || 0) + (form.get("installationsTechniques")?.value || 0) + (form.get("materielTransport")?.value || 0) + (form.get("materielBureau")?.value || 0) + (form.get("autresImmobilisations")?.value || 0) + (form.get("immobilisationsEnCours")?.value || 0) + (form.get("immobilisationsFinancieres")?.value || 0);
  });
  totalActifCirculantN1 = computed(() => {
    const form = this.bilanN1Form;
    if (!form)
      return 0;
    return (form.get("stocks")?.value || 0) + (form.get("creances")?.value || 0) + (form.get("tresorerieActif")?.value || 0);
  });
  totalActifN1 = computed(() => this.totalActifImmobiliseN1() + this.totalActifCirculantN1());
  // Bilan N-1 - PASSIF
  capitauxPropresN1 = computed(() => {
    const totalDettes = (this.bilanN1Form?.get("dettesLongTerme")?.value || 0) + (this.bilanN1Form?.get("dettesCourtTerme")?.value || 0) + (this.bilanN1Form?.get("tresoreriePassif")?.value || 0);
    return this.totalActifN1() - totalDettes;
  });
  totalPassifN1 = computed(() => {
    const form = this.bilanN1Form;
    if (!form)
      return 0;
    return this.capitauxPropresN1() + (form.get("dettesLongTerme")?.value || 0) + (form.get("dettesCourtTerme")?.value || 0) + (form.get("tresoreriePassif")?.value || 0);
  });
  fondsRoulementN1 = computed(() => {
    return this.capitauxPropresN1() + (this.bilanN1Form?.get("dettesLongTerme")?.value || 0) - this.totalActifImmobiliseN1();
  });
  besoinFondsRoulementN1 = computed(() => {
    const stocks = this.bilanN1Form?.get("stocks")?.value || 0;
    const creances = this.bilanN1Form?.get("creances")?.value || 0;
    const dettesCourtTerme = this.bilanN1Form?.get("dettesCourtTerme")?.value || 0;
    return stocks + creances - dettesCourtTerme;
  });
  tresorerieNetteN1 = computed(() => {
    return this.fondsRoulementN1() - this.besoinFondsRoulementN1();
  });
  // ============== COMPUTED VALUES FOR RENTABILITE ==============
  // Rentabilité N
  margeBruteN = computed(() => {
    const ca = this.rentabiliteNForm?.get("chiffreAffaires")?.value || 0;
    const coutAchats = this.rentabiliteNForm?.get("coutAchats")?.value || 0;
    return ca - coutAchats;
  });
  totalChargesN = computed(() => {
    const form = this.rentabiliteNForm;
    if (!form)
      return 0;
    return (form.get("salaires")?.value || 0) + (form.get("chargesSociales")?.value || 0) + (form.get("loyer")?.value || 0) + (form.get("electricite")?.value || 0) + (form.get("eau")?.value || 0) + (form.get("telephone")?.value || 0) + (form.get("transport")?.value || 0) + (form.get("entretien")?.value || 0) + (form.get("assurances")?.value || 0) + (form.get("impotsTaxes")?.value || 0) + (form.get("fraisFinanciers")?.value || 0) + (form.get("autresCharges")?.value || 0) + (form.get("dotationAmortissement")?.value || 0);
  });
  resultatExploitationN = computed(() => {
    const margeBrute = this.margeBruteN();
    const totalCharges = this.totalChargesN();
    const autresRevenus = this.rentabiliteNForm?.get("autresRevenus")?.value || 0;
    return margeBrute - totalCharges + autresRevenus;
  });
  cashFlowN = computed(() => {
    return this.resultatExploitationN() + (this.rentabiliteNForm?.get("dotationAmortissement")?.value || 0);
  });
  tauxMargeBruteN = computed(() => {
    const ca = this.rentabiliteNForm?.get("chiffreAffaires")?.value || 0;
    if (ca === 0)
      return 0;
    return this.margeBruteN() / ca * 100;
  });
  // ============== COMPUTED VALUES FOR RENTABILITE N-1 ==============
  margeBruteN1 = computed(() => {
    const ca = this.rentabiliteN1Form?.get("chiffreAffaires")?.value || 0;
    const coutAchats = this.rentabiliteN1Form?.get("coutAchats")?.value || 0;
    return ca - coutAchats;
  });
  totalChargesN1 = computed(() => {
    const form = this.rentabiliteN1Form;
    if (!form)
      return 0;
    return (form.get("salaires")?.value || 0) + (form.get("chargesSociales")?.value || 0) + (form.get("loyer")?.value || 0) + (form.get("electricite")?.value || 0) + (form.get("eau")?.value || 0) + (form.get("telephone")?.value || 0) + (form.get("transport")?.value || 0) + (form.get("entretien")?.value || 0) + (form.get("assurances")?.value || 0) + (form.get("impotsTaxes")?.value || 0) + (form.get("fraisFinanciers")?.value || 0) + (form.get("autresCharges")?.value || 0) + (form.get("dotationAmortissement")?.value || 0);
  });
  resultatExploitationN1 = computed(() => {
    const margeBrute = this.margeBruteN1();
    const totalCharges = this.totalChargesN1();
    const autresRevenus = this.rentabiliteN1Form?.get("autresRevenus")?.value || 0;
    return margeBrute - totalCharges + autresRevenus;
  });
  cashFlowN1 = computed(() => {
    return this.resultatExploitationN1() + (this.rentabiliteN1Form?.get("dotationAmortissement")?.value || 0);
  });
  // Rentabilité N+1 (Prévisionnel)
  margeBruteN2 = computed(() => {
    const ca = this.rentabiliteN2Form?.get("chiffreAffaires")?.value || 0;
    const coutAchats = this.rentabiliteN2Form?.get("coutAchats")?.value || 0;
    return ca - coutAchats;
  });
  totalChargesN2 = computed(() => {
    const form = this.rentabiliteN2Form;
    if (!form)
      return 0;
    return (form.get("salaires")?.value || 0) + (form.get("chargesSociales")?.value || 0) + (form.get("loyer")?.value || 0) + (form.get("electricite")?.value || 0) + (form.get("eau")?.value || 0) + (form.get("telephone")?.value || 0) + (form.get("transport")?.value || 0) + (form.get("entretien")?.value || 0) + (form.get("assurances")?.value || 0) + (form.get("impotsTaxes")?.value || 0) + (form.get("fraisFinanciers")?.value || 0) + (form.get("autresCharges")?.value || 0) + (form.get("dotationAmortissement")?.value || 0);
  });
  resultatExploitationN2 = computed(() => {
    const margeBrute = this.margeBruteN2();
    const totalCharges = this.totalChargesN2();
    const autresRevenus = this.rentabiliteN2Form?.get("autresRevenus")?.value || 0;
    return margeBrute - totalCharges + autresRevenus;
  });
  cashFlowN2 = computed(() => {
    return this.resultatExploitationN2() + (this.rentabiliteN2Form?.get("dotationAmortissement")?.value || 0);
  });
  // ============== COMPUTED VALUES FOR BESOIN CREDIT ==============
  // INVESTISSEMENT - Colonnes Montant
  investissementCoutEquipement = computed(() => this.besoinCreditForm?.get("coutEquipement")?.value || 0);
  investissementDepensesRattachees = computed(() => this.besoinCreditForm?.get("depensesRattachees")?.value || 0);
  investissementApportPersonnel = computed(() => this.besoinCreditForm?.get("apportPersonnel")?.value || 0);
  // INVESTISSEMENT - Colonnes Ajustement
  investissementAjustCoutEquipement = computed(() => this.besoinCreditForm?.get("ajustCoutEquipement")?.value || 0);
  investissementAjustDepensesRattachees = computed(() => this.besoinCreditForm?.get("ajustDepensesRattachees")?.value || 0);
  investissementAjustApportPersonnel = computed(() => this.besoinCreditForm?.get("ajustApportPersonnel")?.value || 0);
  // INVESTISSEMENT - Colonnes Montant effectif (Montant + Ajustement)
  effCoutEquipement = computed(() => this.investissementCoutEquipement() + this.investissementAjustCoutEquipement());
  effDepensesRattachees = computed(() => this.investissementDepensesRattachees() + this.investissementAjustDepensesRattachees());
  effApportPersonnel = computed(() => this.investissementApportPersonnel() + this.investissementAjustApportPersonnel());
  // INVESTISSEMENT - Totaux
  totalInvestissementMontant = computed(() => this.investissementCoutEquipement() + this.investissementDepensesRattachees());
  totalInvestissementAjuste = computed(() => this.investissementAjustCoutEquipement() + this.investissementAjustDepensesRattachees());
  totalInvestissementEffectif = computed(() => this.effCoutEquipement() + this.effDepensesRattachees());
  // INVESTISSEMENT - Besoin réel = Total invest - Apport personnel
  besoinReelInvestissementMontant = computed(() => this.totalInvestissementMontant() - this.investissementApportPersonnel());
  besoinReelInvestissementAjuste = computed(() => this.totalInvestissementAjuste() - this.investissementAjustApportPersonnel());
  besoinReelInvestissementFinal = computed(() => this.totalInvestissementEffectif() - this.effApportPersonnel());
  // EXPLOITATION - Colonnes Montant
  exploitationCoutAchatCycle = computed(() => this.besoinCreditForm?.get("coutAchatCycle")?.value || 0);
  exploitationNbreCycles = computed(() => this.besoinCreditForm?.get("nbreCycleFinancer")?.value || 1);
  exploitationTresorerieDispo = computed(() => this.besoinCreditForm?.get("tresorerieDisponible")?.value || 0);
  exploitationStockActuel = computed(() => this.besoinCreditForm?.get("stockActuel")?.value || 0);
  exploitationComptesRecevoir = computed(() => this.besoinCreditForm?.get("comptesRecevoir")?.value || 0);
  exploitationDettesFournisseurs = computed(() => this.besoinCreditForm?.get("dettesFournisseurs")?.value || 0);
  exploitationCreditFournisseur = computed(() => this.besoinCreditForm?.get("creditFournisseur")?.value || 0);
  // EXPLOITATION - Colonnes Ajustement
  exploitationAjustCoutAchat = computed(() => this.besoinCreditForm?.get("ajustCoutAchatCycle")?.value || 0);
  exploitationAjustTresorerie = computed(() => this.besoinCreditForm?.get("ajustTresorerieDispo")?.value || 0);
  exploitationAjustStock = computed(() => this.besoinCreditForm?.get("ajustStockActuel")?.value || 0);
  exploitationAjustComptes = computed(() => this.besoinCreditForm?.get("ajustComptesRecevoir")?.value || 0);
  exploitationAjustDettes = computed(() => this.besoinCreditForm?.get("ajustDettesFournisseurs")?.value || 0);
  exploitationAjustCredit = computed(() => this.besoinCreditForm?.get("ajustCreditFournisseur")?.value || 0);
  // EXPLOITATION - Montants effectifs
  effCoutAchatCycle = computed(() => this.exploitationCoutAchatCycle() + this.exploitationAjustCoutAchat());
  effTresorerieDispo = computed(() => this.exploitationTresorerieDispo() + this.exploitationAjustTresorerie());
  effStockActuel = computed(() => this.exploitationStockActuel() + this.exploitationAjustStock());
  effComptesRecevoir = computed(() => this.exploitationComptesRecevoir() + this.exploitationAjustComptes());
  effDettesFournisseurs = computed(() => this.exploitationDettesFournisseurs() + this.exploitationAjustDettes());
  effCreditFournisseur = computed(() => this.exploitationCreditFournisseur() + this.exploitationAjustCredit());
  // EXPLOITATION - Besoin brut = Coût achat × Nbre cycles
  besoinBrutExploitationMontant = computed(() => this.exploitationCoutAchatCycle() * this.exploitationNbreCycles());
  besoinBrutExploitationAjuste = computed(() => this.exploitationAjustCoutAchat() * this.exploitationNbreCycles());
  besoinBrutExploitationEffectif = computed(() => this.effCoutAchatCycle() * this.exploitationNbreCycles());
  // EXPLOITATION - Ressources disponibles = Trésorerie + Stock + Comptes à recevoir
  ressourcesDisponiblesMontant = computed(() => this.exploitationTresorerieDispo() + this.exploitationStockActuel() + this.exploitationComptesRecevoir());
  ressourcesDisponiblesAjuste = computed(() => this.exploitationAjustTresorerie() + this.exploitationAjustStock() + this.exploitationAjustComptes());
  ressourcesDisponiblesEffectif = computed(() => this.effTresorerieDispo() + this.effStockActuel() + this.effComptesRecevoir());
  // EXPLOITATION - Dettes = Dettes fournisseurs + Crédit fournisseur
  totalDettesMontant = computed(() => this.exploitationDettesFournisseurs() + this.exploitationCreditFournisseur());
  totalDettesAjuste = computed(() => this.exploitationAjustDettes() + this.exploitationAjustCredit());
  totalDettesEffectif = computed(() => this.effDettesFournisseurs() + this.effCreditFournisseur());
  // EXPLOITATION - Besoin réel = Besoin brut - Ressources + Dettes
  besoinReelExploitationMontant = computed(() => this.besoinBrutExploitationMontant() - this.ressourcesDisponiblesMontant() + this.totalDettesMontant());
  besoinReelExploitationAjuste = computed(() => this.besoinBrutExploitationAjuste() - this.ressourcesDisponiblesAjuste() + this.totalDettesAjuste());
  besoinReelExploitationFinal = computed(() => this.besoinBrutExploitationEffectif() - this.ressourcesDisponiblesEffectif() + this.totalDettesEffectif());
  // TOTAL FINANCEMENT = Besoin investissement + Besoin exploitation
  besoinTotalFinancementMontant = computed(() => this.besoinReelInvestissementMontant() + this.besoinReelExploitationMontant());
  besoinTotalFinancementAjuste = computed(() => this.besoinReelInvestissementAjuste() + this.besoinReelExploitationAjuste());
  besoinTotalFinancementFinal = computed(() => this.besoinReelInvestissementFinal() + this.besoinReelExploitationFinal());
  // ============== COMPUTED FOR PROPOSITION (Echeance) ==============
  echeanceMensuelle = computed(() => {
    const montant = this.propositionForm?.get("montantPropose")?.value || 0;
    const duree = this.propositionForm?.get("dureeProposee")?.value || 12;
    const taux = this.propositionForm?.get("tauxPropose")?.value || 0;
    const periodicite = this.propositionForm?.get("periodiciteProposee")?.value;
    if (montant <= 0 || duree <= 0)
      return 0;
    const facteurPeriodicite = this.getFacteurPeriodicite(periodicite);
    const nombreEcheances = Math.ceil(duree / facteurPeriodicite);
    const tauxPeriodique = taux / 100 * facteurPeriodicite / 12;
    if (tauxPeriodique === 0) {
      return montant / nombreEcheances;
    }
    const echeance = montant * (tauxPeriodique * Math.pow(1 + tauxPeriodique, nombreEcheances)) / (Math.pow(1 + tauxPeriodique, nombreEcheances) - 1);
    return echeance;
  });
  capaciteRemboursementProposee = computed(() => {
    const cashFlow = this.cashFlowN2();
    const echeance = this.echeanceMensuelle();
    if (echeance === 0)
      return 0;
    const periodicite = this.propositionForm?.get("periodiciteProposee")?.value;
    const facteur = this.getFacteurPeriodicite(periodicite);
    const echeanceAnnuelle = echeance * (12 / facteur);
    return cashFlow / echeanceAnnuelle;
  });
  ngOnInit() {
    this.initForms();
    this.initStepItems();
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.demandeIndividuelId = params["demandeindividuelId"] ? parseInt(params["demandeindividuelId"], 10) : null;
      if (!this.demandeIndividuelId) {
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "ID de la demande individuelle manquant dans l'URL",
          life: 3e3
        });
        return;
      }
      this.loadAllData();
    });
  }
  loadAllData() {
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { loading: true }));
    forkJoin({
      initialData: this.userService.startNewDemandeInd$(),
      demandeData: this.userService.getDemandeWithGaranties$(this.demandeIndividuelId)
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (responses) => {
        if (responses.initialData?.data) {
          this.state.update((state) => __spreadProps(__spreadValues({}, state), {
            allDelegations: responses.initialData.data.delegations || [],
            allAgences: responses.initialData.data.agences || [],
            allPointsVente: responses.initialData.data.pointVentes || []
          }));
        }
        if (responses.demandeData?.data) {
          const demandeIndividuel = responses.demandeData.data.demandeIndividuel;
          const userId = responses.demandeData.data.user?.userId;
          this.state.update((state) => __spreadProps(__spreadValues({}, state), {
            demandeIndividuel,
            userId,
            loading: false
          }));
          this.prefillFormsWithDemande(demandeIndividuel);
          this.loadExistingAnalyse();
        }
      },
      error: (error) => {
        console.error("Error loading data:", error);
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Impossible de charger les donn\xE9es",
          life: 3e3
        });
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { loading: false }));
      }
    });
  }
  loadExistingAnalyse() {
    this.http.get(`${this.apiUrl}/ecredit/bilan_finance/analyse/demande/${this.demandeIndividuelId}`).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        const analyse = response?.data?.analyse;
        const analyseIdValue = analyse?.analyseId || analyse?.id;
        if (analyse && analyseIdValue) {
          this.state.update((state) => __spreadProps(__spreadValues({}, state), {
            analyseId: analyseIdValue,
            analyseExiste: true
          }));
          this.loadAnalyseDetails(analyseIdValue);
        } else {
          this.state.update((state) => __spreadProps(__spreadValues({}, state), { analyseExiste: false }));
        }
      },
      error: () => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { analyseExiste: false }));
      }
    });
  }
  loadAnalyseDetails(analyseId) {
    if (!analyseId || analyseId === void 0 || analyseId === null) {
      console.warn("loadAnalyseDetails called with invalid analyseId:", analyseId);
      return;
    }
    this.http.get(`${this.apiUrl}/ecredit/bilan_finance/bilan/analyse/${analyseId}`).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        if (response?.data?.bilans) {
          response.data.bilans.forEach((bilan) => {
            if (bilan.typePeriode === "N") {
              this.patchBilanForm(this.bilanNForm, bilan);
            } else if (bilan.typePeriode === "N-1") {
              this.patchBilanForm(this.bilanN1Form, bilan);
            }
          });
        }
      }
    });
    this.http.get(`${this.apiUrl}/ecredit/bilan_finance/rentabilite/analyse/${analyseId}`).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        if (response?.data?.rentabilites) {
          response.data.rentabilites.forEach((rent) => {
            if (rent.typePeriode === "N") {
              this.patchRentabiliteForm(this.rentabiliteNForm, rent);
            } else if (rent.typePeriode === "N-1") {
              this.patchRentabiliteForm(this.rentabiliteN1Form, rent);
            } else if (rent.typePeriode === "N+1") {
              this.patchRentabiliteForm(this.rentabiliteN2Form, rent);
            }
          });
        }
      }
    });
    this.http.get(`${this.apiUrl}/ecredit/bilan_finance/besoin-credit/analyse/${analyseId}`).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        if (response?.data?.besoinCredit) {
          this.patchBesoinCreditForm(response.data.besoinCredit);
        }
      }
    });
    this.http.get(`${this.apiUrl}/ecredit/bilan_finance/proposition/${this.demandeIndividuelId}`).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        if (response?.data?.proposition) {
          this.patchPropositionForm(response.data.proposition);
        }
      }
    });
    this.loadRatios(analyseId);
  }
  loadRatios(analyseId) {
    if (!analyseId) {
      console.warn("loadRatios called with invalid analyseId:", analyseId);
      return;
    }
    this.http.get(`${this.apiUrl}/ecredit/bilan_finance/ratios/analyse/${analyseId}`).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        if (response?.data?.ratios) {
          this.updateRatiosData(response.data.ratios);
        }
      }
    });
  }
  updateRatiosData(ratios) {
    const ratiosList = [
      {
        code: "R1",
        nom: "Capacit\xE9 de remboursement",
        operateur: ">=",
        norme: 2,
        normeDisplay: "200%",
        sollicite: ratios.r1Sollicite,
        propose: ratios.r1Propose,
        conformeSollicite: ratios.r1ConformeSollicite || false,
        conformePropose: ratios.r1ConformePropose || false
      },
      {
        code: "R2",
        nom: "Solvabilit\xE9",
        operateur: ">=",
        norme: 0.35,
        normeDisplay: "35%",
        sollicite: ratios.r2Sollicite,
        propose: ratios.r2Propose,
        conformeSollicite: ratios.r2ConformeSollicite || false,
        conformePropose: ratios.r2ConformePropose || false
      },
      {
        code: "R3",
        nom: "Liquidit\xE9 \xE0 \xE9ch\xE9ance",
        operateur: ">=",
        norme: 1,
        normeDisplay: "100%",
        sollicite: ratios.r3Sollicite,
        propose: ratios.r3Propose,
        conformeSollicite: ratios.r3ConformeSollicite || false,
        conformePropose: ratios.r3ConformePropose || false
      },
      {
        code: "R4",
        nom: "Endettement",
        operateur: "<",
        norme: 0.5,
        normeDisplay: "< 50%",
        sollicite: ratios.r4Sollicite,
        propose: ratios.r4Propose,
        conformeSollicite: ratios.r4ConformeSollicite || false,
        conformePropose: ratios.r4ConformePropose || false
      },
      {
        code: "R5",
        nom: "D\xE9pendance",
        operateur: "<",
        norme: 0.5,
        normeDisplay: "< 50%",
        sollicite: ratios.r5Sollicite,
        propose: ratios.r5Propose,
        conformeSollicite: ratios.r5ConformeSollicite || false,
        conformePropose: ratios.r5ConformePropose || false
      },
      {
        code: "R6",
        nom: "Couverture garantie",
        operateur: ">",
        norme: 1.5,
        normeDisplay: "> 150%",
        sollicite: ratios.r6Sollicite,
        propose: ratios.r6Propose,
        conformeSollicite: ratios.r6ConformeSollicite || false,
        conformePropose: ratios.r6ConformePropose || false
      }
    ];
    this.ratiosData.set(ratiosList);
  }
  prefillFormsWithDemande(demande) {
    if (!demande)
      return;
    this.demandeCreditForm.patchValue({
      montantDemande: demande.montantDemande,
      dureeMois: demande.dureeDemande,
      objetFinancement: demande.detailObjectCredit
    });
    this.propositionForm.patchValue({
      montantSollicite: demande.montantDemande,
      dureeSollicitee: demande.dureeDemande,
      montantPropose: demande.montantDemande,
      dureeProposee: demande.dureeDemande
    });
    if (demande.delegation) {
      const delegation = this.state().allDelegations.find((d) => d.id === demande.delegation);
      if (delegation) {
        this.demandeCreditForm.patchValue({ delegation });
        this.onDelegationChange({ value: delegation });
        setTimeout(() => {
          if (demande.agence) {
            const agence = this.state().filteredAgences.find((a) => a.id === demande.agence);
            if (agence) {
              this.demandeCreditForm.patchValue({ agence });
              this.onAgenceChange({ value: agence });
              setTimeout(() => {
                if (demande.pos) {
                  const pointVente = this.state().filteredPointsVente.find((p) => p.id === demande.pos);
                  if (pointVente) {
                    this.demandeCreditForm.patchValue({ pointVente });
                  }
                }
              }, 100);
            }
          }
        }, 100);
      }
    }
    this.demandeCreditForm.get("objetFinancement")?.disable();
    this.demandeCreditForm.get("delegation")?.disable();
    this.demandeCreditForm.get("agence")?.disable();
    this.demandeCreditForm.get("pointVente")?.disable();
  }
  patchBilanForm(form, bilan) {
    form.patchValue({
      terrains: bilan.terrains || 0,
      constructions: bilan.constructions || 0,
      installationsTechniques: bilan.installationsTechniques || 0,
      materielTransport: bilan.materielTransport || 0,
      materielBureau: bilan.materielBureau || 0,
      autresImmobilisations: bilan.autresImmobilisations || 0,
      immobilisationsEnCours: bilan.immobilisationsEnCours || 0,
      immobilisationsFinancieres: bilan.immobilisationsFinancieres || 0,
      stocks: bilan.stocks || 0,
      creances: bilan.creances || 0,
      tresorerieActif: bilan.tresorerieActif || 0,
      dettesLongTerme: bilan.dettesLongTerme || 0,
      dettesCourtTerme: bilan.dettesCourtTerme || 0,
      tresoreriePassif: bilan.tresoreriePassif || 0
    });
  }
  patchRentabiliteForm(form, rent) {
    form.patchValue({
      chiffreAffaires: rent.chiffreAffaires || 0,
      coutAchats: rent.coutAchats || 0,
      salaires: rent.salaires || 0,
      chargesSociales: rent.chargesSociales || 0,
      loyer: rent.loyer || 0,
      electricite: rent.electricite || 0,
      eau: rent.eau || 0,
      telephone: rent.telephone || 0,
      transport: rent.transport || 0,
      entretien: rent.entretien || 0,
      assurances: rent.assurances || 0,
      impotsTaxes: rent.impotsTaxes || 0,
      fraisFinanciers: rent.fraisFinanciers || 0,
      autresCharges: rent.autresCharges || 0,
      dotationAmortissement: rent.dotationAmortissement || 0,
      autresRevenus: rent.autresRevenus || 0
    });
  }
  patchBesoinCreditForm(besoin) {
    this.besoinCreditForm.patchValue({
      // INVESTISSEMENT - Montants
      coutEquipement: besoin.coutEquipement || 0,
      depensesRattachees: besoin.depensesRattachees || 0,
      apportPersonnel: besoin.apportPersonnel || 0,
      // INVESTISSEMENT - Ajustements
      ajustCoutEquipement: besoin.ajustCoutEquipement || 0,
      ajustDepensesRattachees: besoin.ajustDepensesRattachees || 0,
      ajustApportPersonnel: besoin.ajustApportPersonnel || 0,
      // EXPLOITATION - Montants
      coutAchatCycle: besoin.coutAchatCycle || 0,
      nbreCycleFinancer: besoin.nbreCycleFinancer || 1,
      tresorerieDisponible: besoin.tresorerieDisponible || 0,
      stockActuel: besoin.stockActuel || 0,
      comptesRecevoir: besoin.comptesRecevoir || 0,
      dettesFournisseurs: besoin.dettesFournisseurs || 0,
      creditFournisseur: besoin.creditFournisseur || 0,
      // EXPLOITATION - Ajustements
      ajustCoutAchatCycle: besoin.ajustCoutAchatCycle || 0,
      ajustTresorerieDispo: besoin.ajustTresorerieDispo || 0,
      ajustStockActuel: besoin.ajustStockActuel || 0,
      ajustComptesRecevoir: besoin.ajustComptesRecevoir || 0,
      ajustDettesFournisseurs: besoin.ajustDettesFournisseurs || 0,
      ajustCreditFournisseur: besoin.ajustCreditFournisseur || 0
    });
  }
  patchPropositionForm(prop) {
    this.propositionForm.patchValue({
      montantSollicite: prop.montantSollicite || 0,
      dureeSollicitee: prop.dureeSollicitee || 0,
      montantPropose: prop.montantPropose || 0,
      dureeProposee: prop.dureeProposee || 0,
      tauxPropose: prop.tauxPropose || 0,
      periodiciteProposee: prop.periodiciteProposee || "MENSUELLE",
      commentaireOrientation: prop.commentaireOrientation || ""
    });
  }
  initStepItems() {
    this.items.set([
      { label: "Bilan", command: () => this.onStepChange(0) },
      { label: "Rentabilit\xE9", command: () => this.onStepChange(1) },
      { label: "Personnes caution", command: () => this.onStepChange(2) },
      { label: "Synth\xE8se", command: () => this.onStepChange(3) },
      { label: "Besoin Cr\xE9dit", command: () => this.onStepChange(4) }
    ]);
  }
  initForms() {
    this.bilanNForm = this.fb.group({
      // Actif immobilisé
      terrains: [0],
      constructions: [0],
      installationsTechniques: [0],
      materielTransport: [0],
      materielBureau: [0],
      autresImmobilisations: [0],
      immobilisationsEnCours: [0],
      immobilisationsFinancieres: [0],
      // Actif circulant
      stocks: [0],
      creances: [0],
      tresorerieActif: [0],
      // Passif
      dettesLongTerme: [0],
      dettesCourtTerme: [0],
      tresoreriePassif: [0]
    });
    this.bilanN1Form = this.fb.group({
      terrains: [0],
      constructions: [0],
      installationsTechniques: [0],
      materielTransport: [0],
      materielBureau: [0],
      autresImmobilisations: [0],
      immobilisationsEnCours: [0],
      immobilisationsFinancieres: [0],
      stocks: [0],
      creances: [0],
      tresorerieActif: [0],
      dettesLongTerme: [0],
      dettesCourtTerme: [0],
      tresoreriePassif: [0]
    });
    this.rentabiliteNForm = this.fb.group({
      chiffreAffaires: [0],
      coutAchats: [0],
      salaires: [0],
      chargesSociales: [0],
      loyer: [0],
      electricite: [0],
      eau: [0],
      telephone: [0],
      transport: [0],
      entretien: [0],
      assurances: [0],
      impotsTaxes: [0],
      fraisFinanciers: [0],
      autresCharges: [0],
      dotationAmortissement: [0],
      autresRevenus: [0]
    });
    this.rentabiliteN1Form = this.fb.group({
      chiffreAffaires: [0],
      coutAchats: [0],
      salaires: [0],
      chargesSociales: [0],
      loyer: [0],
      electricite: [0],
      eau: [0],
      telephone: [0],
      transport: [0],
      entretien: [0],
      assurances: [0],
      impotsTaxes: [0],
      fraisFinanciers: [0],
      autresCharges: [0],
      dotationAmortissement: [0],
      autresRevenus: [0]
    });
    this.rentabiliteN2Form = this.fb.group({
      chiffreAffaires: [0],
      coutAchats: [0],
      salaires: [0],
      chargesSociales: [0],
      loyer: [0],
      electricite: [0],
      eau: [0],
      telephone: [0],
      transport: [0],
      entretien: [0],
      assurances: [0],
      impotsTaxes: [0],
      fraisFinanciers: [0],
      autresCharges: [0],
      dotationAmortissement: [0],
      autresRevenus: [0]
    });
    this.besoinCreditForm = this.fb.group({
      // INVESTISSEMENT - Montants
      coutEquipement: [0],
      depensesRattachees: [0],
      apportPersonnel: [0],
      // INVESTISSEMENT - Ajustements
      ajustCoutEquipement: [0],
      ajustDepensesRattachees: [0],
      ajustApportPersonnel: [0],
      // EXPLOITATION - Montants
      coutAchatCycle: [0],
      nbreCycleFinancer: [1],
      tresorerieDisponible: [0],
      stockActuel: [0],
      comptesRecevoir: [0],
      dettesFournisseurs: [0],
      creditFournisseur: [0],
      // EXPLOITATION - Ajustements
      ajustCoutAchatCycle: [0],
      ajustTresorerieDispo: [0],
      ajustStockActuel: [0],
      ajustComptesRecevoir: [0],
      ajustDettesFournisseurs: [0],
      ajustCreditFournisseur: [0]
    });
    this.propositionForm = this.fb.group({
      montantSollicite: [0],
      dureeSollicitee: [12],
      montantPropose: [0],
      dureeProposee: [12],
      tauxPropose: [0],
      periodiciteProposee: ["MENSUELLE"],
      commentaireOrientation: [""]
    });
    this.demandeCreditForm = this.fb.group({
      montantDemande: [0],
      dureeMois: [12],
      objetFinancement: [""],
      delegation: [null],
      agence: [null],
      pointVente: [null]
    });
    this.personnecautionForm = this.fb.group({
      nom: [""],
      prenom: [""],
      telephone: [""],
      activite: [""],
      age: [null],
      profession: [""]
    });
  }
  onStepChange(index) {
    this.activeIndex.set(index);
  }
  nextStep() {
    const currentIndex = this.activeIndex();
    if (currentIndex < this.items().length - 1) {
      this.activeIndex.set(currentIndex + 1);
    }
  }
  prevStep() {
    const currentIndex = this.activeIndex();
    if (currentIndex > 0) {
      this.activeIndex.set(currentIndex - 1);
    }
  }
  onDelegationChange(event) {
    const delegation = event.value;
    if (!delegation || !delegation.id) {
      this.state.update((state) => __spreadProps(__spreadValues({}, state), {
        filteredAgences: [],
        filteredPointsVente: []
      }));
      return;
    }
    const delegationId = delegation.id;
    const filteredAgences = this.state().allAgences?.filter((agence) => agence.delegation_id === delegationId) || [];
    this.state.update((state) => __spreadProps(__spreadValues({}, state), {
      filteredAgences,
      filteredPointsVente: []
    }));
    if (!this.demandeCreditForm.get("delegation")?.disabled) {
      this.demandeCreditForm.patchValue({
        agence: null,
        pointVente: null
      });
    }
  }
  onAgenceChange(event) {
    const agence = event.value;
    if (!agence || !agence.id) {
      this.state.update((state) => __spreadProps(__spreadValues({}, state), {
        filteredPointsVente: []
      }));
      return;
    }
    const agenceId = agence.id;
    const filteredPointsVente = this.state().allPointsVente?.filter((pv) => pv.agence_id === agenceId) || [];
    this.state.update((state) => __spreadProps(__spreadValues({}, state), {
      filteredPointsVente
    }));
    if (!this.demandeCreditForm.get("agence")?.disabled) {
      this.demandeCreditForm.patchValue({ pointVente: null });
    }
  }
  addPersonnecaution() {
    const personnecaution = {
      nom: this.personnecautionForm.get("nom")?.value || "",
      prenom: this.personnecautionForm.get("prenom")?.value || "",
      telephone: this.personnecautionForm.get("telephone")?.value || "",
      activite: this.personnecautionForm.get("activite")?.value || "",
      age: this.personnecautionForm.get("age")?.value || void 0,
      profession: this.personnecautionForm.get("profession")?.value || ""
    };
    this.personnecautions.push(personnecaution);
    this.personnecautionForm.reset();
    this.messageService.add({
      severity: "success",
      summary: "Succ\xE8s",
      detail: "Personne caution ajout\xE9e avec succ\xE8s."
    });
  }
  removePersonnecaution(index) {
    this.personnecautions.splice(index, 1);
    this.messageService.add({
      severity: "info",
      summary: "Information",
      detail: "Personne caution supprim\xE9e."
    });
  }
  // ============== API CALLS ==============
  createOrUpdateAnalyse() {
    if (this.state().analyseExiste) {
      return;
    }
    const request = {
      demandeindividuelId: this.demandeIndividuelId,
      nombreCycles: 12,
      hypothese: "CROISSANCE_MODEREE"
    };
    this.http.post(`${this.apiUrl}/ecredit/bilan_finance/analyse`, request).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        const analyse = response?.data?.analyse;
        if (analyse) {
          const newAnalyseId = analyse.analyseId || analyse.id;
          this.state.update((state) => __spreadProps(__spreadValues({}, state), {
            analyseId: newAnalyseId,
            analyseExiste: true
          }));
          this.messageService.add({
            severity: "success",
            summary: "Succ\xE8s",
            detail: "Analyse cr\xE9\xE9e avec succ\xE8s"
          });
        }
      },
      error: (error) => {
        console.error("Error creating analyse:", error);
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: error?.error?.message || "Impossible de cr\xE9er l'analyse"
        });
      }
    });
  }
  saveBilan(typePeriode) {
    const analyseId = this.state().analyseId;
    if (!analyseId) {
      this.messageService.add({
        severity: "warn",
        summary: "Attention",
        detail: "Veuillez d'abord cr\xE9er l'analyse"
      });
      return;
    }
    this.savingBilan.set(true);
    const form = typePeriode === "N" ? this.bilanNForm : this.bilanN1Form;
    const request = {
      analyseId,
      typePeriode,
      // ACTIF - Immobilisations
      terrain: form.get("terrains")?.value || 0,
      batimentMagasin: form.get("constructions")?.value || 0,
      installationAgencement: form.get("installationsTechniques")?.value || 0,
      materielIndustriel: 0,
      mobilierBureau: form.get("materielBureau")?.value || 0,
      materielInformatique: 0,
      materielTransport: form.get("materielTransport")?.value || 0,
      autreImmobilisation: (form.get("autresImmobilisations")?.value || 0) + (form.get("immobilisationsEnCours")?.value || 0) + (form.get("immobilisationsFinancieres")?.value || 0),
      // ACTIF - Circulant
      stocks: form.get("stocks")?.value || 0,
      creancesClients: form.get("creances")?.value || 0,
      tresorerieCaisseBanque: form.get("tresorerieActif")?.value || 0,
      // PASSIF - Dettes
      empruntLongTerme: form.get("dettesLongTerme")?.value || 0,
      empruntCourtTerme: form.get("dettesCourtTerme")?.value || 0,
      autresDettes: form.get("tresoreriePassif")?.value || 0
    };
    this.http.post(`${this.apiUrl}/ecredit/bilan_finance/bilan`, request).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.savingBilan.set(false);
        this.messageService.add({
          severity: "success",
          summary: "Succ\xE8s",
          detail: `Bilan ${typePeriode} enregistr\xE9 avec succ\xE8s`
        });
      },
      error: (error) => {
        this.savingBilan.set(false);
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: error?.error?.message || "Impossible d'enregistrer le bilan"
        });
      }
    });
  }
  saveBilanAll() {
    const analyseId = this.state().analyseId;
    if (!analyseId) {
      this.messageService.add({
        severity: "warn",
        summary: "Attention",
        detail: "Veuillez d'abord cr\xE9er l'analyse"
      });
      return;
    }
    this.savingBilan.set(true);
    const requestN = this.mapBilanFormToRequest(this.bilanNForm, analyseId, "N");
    const requestN1 = this.mapBilanFormToRequest(this.bilanN1Form, analyseId, "N-1");
    forkJoin({
      bilanN: this.http.post(`${this.apiUrl}/ecredit/bilan_finance/bilan`, requestN),
      bilanN1: this.http.post(`${this.apiUrl}/ecredit/bilan_finance/bilan`, requestN1)
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.savingBilan.set(false);
        this.messageService.add({
          severity: "success",
          summary: "Succ\xE8s",
          detail: "Bilans N et N-1 enregistr\xE9s avec succ\xE8s"
        });
      },
      error: (error) => {
        this.savingBilan.set(false);
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: error?.error?.message || "Impossible d'enregistrer les bilans"
        });
      }
    });
  }
  // Convertit le format frontend (N-1, N+1) vers le format backend (N_MOINS_1, N_PLUS_1)
  convertPeriodeToBackend(periode) {
    const mapping = {
      N: "N",
      "N-1": "N_MOINS_1",
      "N+1": "N_PLUS_1"
    };
    return mapping[periode] || periode;
  }
  mapBilanFormToRequest(form, analyseId, typePeriode) {
    return {
      analyseId,
      typePeriode: this.convertPeriodeToBackend(typePeriode),
      // ACTIF - Immobilisations
      terrain: form.get("terrains")?.value || 0,
      batimentMagasin: form.get("constructions")?.value || 0,
      installationAgencement: form.get("installationsTechniques")?.value || 0,
      materielIndustriel: 0,
      mobilierBureau: form.get("materielBureau")?.value || 0,
      materielInformatique: 0,
      materielTransport: form.get("materielTransport")?.value || 0,
      autreImmobilisation: (form.get("autresImmobilisations")?.value || 0) + (form.get("immobilisationsEnCours")?.value || 0) + (form.get("immobilisationsFinancieres")?.value || 0),
      // ACTIF - Circulant
      stocks: form.get("stocks")?.value || 0,
      creancesClients: form.get("creances")?.value || 0,
      tresorerieCaisseBanque: form.get("tresorerieActif")?.value || 0,
      // PASSIF - Dettes
      empruntLongTerme: form.get("dettesLongTerme")?.value || 0,
      empruntCourtTerme: form.get("dettesCourtTerme")?.value || 0,
      autresDettes: form.get("tresoreriePassif")?.value || 0
    };
  }
  saveRentabilite(typePeriode) {
    const analyseId = this.state().analyseId;
    if (!analyseId) {
      this.messageService.add({
        severity: "warn",
        summary: "Attention",
        detail: "Veuillez d'abord cr\xE9er l'analyse"
      });
      return;
    }
    this.savingRentabilite.set(true);
    let form;
    if (typePeriode === "N")
      form = this.rentabiliteNForm;
    else if (typePeriode === "N-1")
      form = this.rentabiliteN1Form;
    else
      form = this.rentabiliteN2Form;
    const request = this.mapRentabiliteFormToRequest(form, analyseId, typePeriode);
    this.http.post(`${this.apiUrl}/ecredit/bilan_finance/rentabilite`, request).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.savingRentabilite.set(false);
        this.messageService.add({
          severity: "success",
          summary: "Succ\xE8s",
          detail: `Rentabilit\xE9 ${typePeriode} enregistr\xE9e avec succ\xE8s`
        });
      },
      error: (error) => {
        this.savingRentabilite.set(false);
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: error?.error?.message || "Impossible d'enregistrer la rentabilit\xE9"
        });
      }
    });
  }
  mapRentabiliteFormToRequest(form, analyseId, typePeriode) {
    const ca = form.get("chiffreAffaires")?.value || 0;
    const coutAchats = form.get("coutAchats")?.value || 0;
    return {
      analyseId,
      typePeriode: this.convertPeriodeToBackend(typePeriode),
      // Revenue
      chiffreAffaires: ca,
      coutAchatMarchandises: coutAchats,
      margeBrute: ca - coutAchats,
      // 13 Charges posts
      salaires: form.get("salaires")?.value || 0,
      prelevementEntrepreneur: form.get("chargesSociales")?.value || 0,
      loyers: form.get("loyer")?.value || 0,
      transport: form.get("transport")?.value || 0,
      electriciteEauTelephone: (form.get("electricite")?.value || 0) + (form.get("eau")?.value || 0) + (form.get("telephone")?.value || 0),
      fournituresAutresBesoins: 0,
      entretienReparation: form.get("entretien")?.value || 0,
      carburantLubrifiants: 0,
      publicitePromotion: 0,
      impotsTaxes: form.get("impotsTaxes")?.value || 0,
      fraisBancairesInterets: form.get("fraisFinanciers")?.value || 0,
      echeanceAutreCredit: 0,
      diversesCharges: (form.get("assurances")?.value || 0) + (form.get("autresCharges")?.value || 0),
      amortissementsProvisions: form.get("dotationAmortissement")?.value || 0,
      autresRevenusHorsActivite: form.get("autresRevenus")?.value || 0
    };
  }
  saveRentabiliteAll() {
    const analyseId = this.state().analyseId;
    if (!analyseId) {
      this.messageService.add({
        severity: "warn",
        summary: "Attention",
        detail: "Veuillez d'abord cr\xE9er l'analyse"
      });
      return;
    }
    this.savingRentabilite.set(true);
    const requestN = this.mapRentabiliteFormToRequest(this.rentabiliteNForm, analyseId, "N");
    const requestN1 = this.mapRentabiliteFormToRequest(this.rentabiliteN1Form, analyseId, "N-1");
    const requestN2 = this.mapRentabiliteFormToRequest(this.rentabiliteN2Form, analyseId, "N+1");
    forkJoin({
      rentabiliteN: this.http.post(`${this.apiUrl}/ecredit/bilan_finance/rentabilite`, requestN),
      rentabiliteN1: this.http.post(`${this.apiUrl}/ecredit/bilan_finance/rentabilite`, requestN1),
      rentabiliteN2: this.http.post(`${this.apiUrl}/ecredit/bilan_finance/rentabilite`, requestN2)
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.savingRentabilite.set(false);
        this.messageService.add({
          severity: "success",
          summary: "Succ\xE8s",
          detail: "Rentabilit\xE9s N, N-1 et N+1 enregistr\xE9es avec succ\xE8s"
        });
      },
      error: (error) => {
        this.savingRentabilite.set(false);
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: error?.error?.message || "Impossible d'enregistrer les rentabilit\xE9s"
        });
      }
    });
  }
  saveBesoinCredit() {
    const analyseId = this.state().analyseId;
    if (!analyseId) {
      this.messageService.add({
        severity: "warn",
        summary: "Attention",
        detail: "Veuillez d'abord cr\xE9er l'analyse"
      });
      return;
    }
    this.savingBesoinCredit.set(true);
    const form = this.besoinCreditForm;
    const request = {
      analyseId,
      // INVESTISSEMENT - Montants
      coutEquipement: form.get("coutEquipement")?.value || 0,
      depensesRattachees: form.get("depensesRattachees")?.value || 0,
      apportPersonnel: form.get("apportPersonnel")?.value || 0,
      // INVESTISSEMENT - Ajustements
      ajustCoutEquipement: form.get("ajustCoutEquipement")?.value || 0,
      ajustDepensesRattachees: form.get("ajustDepensesRattachees")?.value || 0,
      ajustApportPersonnel: form.get("ajustApportPersonnel")?.value || 0,
      // EXPLOITATION - Montants
      coutAchatCycle: form.get("coutAchatCycle")?.value || 0,
      nbreCycleFinancer: form.get("nbreCycleFinancer")?.value || 1,
      tresorerieDisponible: form.get("tresorerieDisponible")?.value || 0,
      stockActuel: form.get("stockActuel")?.value || 0,
      comptesRecevoir: form.get("comptesRecevoir")?.value || 0,
      dettesFournisseurs: form.get("dettesFournisseurs")?.value || 0,
      creditFournisseur: form.get("creditFournisseur")?.value || 0,
      // EXPLOITATION - Ajustements
      ajustCoutAchatCycle: form.get("ajustCoutAchatCycle")?.value || 0,
      ajustTresorerieDispo: form.get("ajustTresorerieDispo")?.value || 0,
      ajustStockActuel: form.get("ajustStockActuel")?.value || 0,
      ajustComptesRecevoir: form.get("ajustComptesRecevoir")?.value || 0,
      ajustDettesFournisseurs: form.get("ajustDettesFournisseurs")?.value || 0,
      ajustCreditFournisseur: form.get("ajustCreditFournisseur")?.value || 0
    };
    this.http.post(`${this.apiUrl}/ecredit/bilan_finance/besoin-credit`, request).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.savingBesoinCredit.set(false);
        this.messageService.add({
          severity: "success",
          summary: "Succ\xE8s",
          detail: "Besoin en cr\xE9dit enregistr\xE9 avec succ\xE8s"
        });
      },
      error: (error) => {
        this.savingBesoinCredit.set(false);
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: error?.error?.message || "Impossible d'enregistrer le besoin en cr\xE9dit"
        });
      }
    });
  }
  saveProposition() {
    this.loading.set(true);
    const request = {
      montantSollicite: this.propositionForm.get("montantSollicite")?.value,
      dureeSollicitee: this.propositionForm.get("dureeSollicitee")?.value,
      montantPropose: this.propositionForm.get("montantPropose")?.value,
      dureeProposee: this.propositionForm.get("dureeProposee")?.value,
      tauxPropose: this.propositionForm.get("tauxPropose")?.value,
      periodiciteProposee: this.propositionForm.get("periodiciteProposee")?.value
    };
    this.http.put(`${this.apiUrl}/ecredit/bilan_finance/proposition/${this.demandeIndividuelId}`, request).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: "success",
          summary: "Succ\xE8s",
          detail: "Proposition enregistr\xE9e avec succ\xE8s"
        });
      },
      error: (error) => {
        this.loading.set(false);
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: error?.error?.message || "Impossible d'enregistrer la proposition"
        });
      }
    });
  }
  calculateRatios() {
    const analyseId = this.state().analyseId;
    if (!analyseId) {
      this.messageService.add({
        severity: "warn",
        summary: "Attention",
        detail: "Veuillez d'abord cr\xE9er et sauvegarder l'analyse"
      });
      return;
    }
    this.calculatingRatios.set(true);
    this.http.post(`${this.apiUrl}/ecredit/bilan_finance/ratios/calculer/${analyseId}`, {}).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.calculatingRatios.set(false);
        if (response?.data?.ratios) {
          this.updateRatiosData(response.data.ratios);
          this.messageService.add({
            severity: "success",
            summary: "Succ\xE8s",
            detail: "Ratios calcul\xE9s avec succ\xE8s"
          });
        }
      },
      error: (error) => {
        this.calculatingRatios.set(false);
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: error?.error?.message || "Impossible de calculer les ratios"
        });
      }
    });
  }
  submitAnalyse() {
    const analyseId = this.state().analyseId;
    if (!analyseId) {
      this.messageService.add({
        severity: "error",
        summary: "Erreur",
        detail: "L'analyse n'existe pas encore. Veuillez d'abord enregistrer le bilan et la rentabilit\xE9."
      });
      return;
    }
    this.loading.set(true);
    const request = {
      analyseId,
      forcerSoumission: false
    };
    this.http.post(`${this.apiUrl}/ecredit/bilan_finance/analyse/soumettre`, request).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.loading.set(false);
        const soumission = response?.data?.soumission;
        if (soumission?.succes) {
          this.messageService.add({
            severity: "success",
            summary: "Succ\xE8s",
            detail: "Analyse soumise avec succ\xE8s"
          });
          setTimeout(() => {
            this.router.navigate(["/dashboards/credit/individuel/attente/detail", this.demandeIndividuelId]);
          }, 2e3);
        } else {
          const erreurs = soumission?.erreurs || [];
          const message = erreurs.length > 0 ? erreurs.join("\n") : "La soumission a \xE9chou\xE9. V\xE9rifiez les donn\xE9es saisies.";
          this.messageService.add({
            severity: "warn",
            summary: "Validation \xE9chou\xE9e",
            detail: message,
            life: 1e4
          });
        }
      },
      error: (error) => {
        this.loading.set(false);
        const soumission = error?.error?.data?.soumission;
        const erreurs = soumission?.erreurs || [];
        if (erreurs.length > 0) {
          this.messageService.add({
            severity: "warn",
            summary: "Validation \xE9chou\xE9e",
            detail: erreurs.join("\n"),
            life: 1e4
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Erreur",
            detail: error?.error?.message || "Impossible de soumettre l'analyse"
          });
        }
      }
    });
  }
  // ============== HELPERS ==============
  // Helper to get FormControl from form - used in template
  getControl(form, name) {
    return form.get(name);
  }
  getFacteurPeriodicite(periodicite) {
    const found = this.periodicites.find((p) => p.value === periodicite);
    return found?.facteur || 1;
  }
  formatRatioValue(value) {
    if (value === null || value === void 0)
      return "-";
    return (value * 100).toFixed(1) + "%";
  }
  getRatioSeverity(conforme) {
    return conforme ? "success" : "danger";
  }
  getRatioLabel(conforme) {
    return conforme ? "Conforme" : "Non conforme";
  }
  allRatiosConformesSollicite() {
    return this.ratiosData().every((r) => r.conformeSollicite);
  }
  allRatiosConformesPropose() {
    return this.ratiosData().every((r) => r.conformePropose);
  }
  static \u0275fac = function AnalyseBilanActiviteComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AnalyseBilanActiviteComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AnalyseBilanActiviteComponent, selectors: [["app-analyse-bilan-activite"]], features: [\u0275\u0275ProvidersFeature([MessageService, { provide: LOCALE_ID, useValue: "fr-FR" }])], decls: 16, vars: 12, consts: [[1, "card"], [1, "text-surface-900", "dark:text-surface-0", "text-xl", "font-bold", "mb-6"], ["class", "mb-4", 4, "ngIf"], ["styleClass", "mb-5", 3, "model", "activeIndex", "readonly"], [1, "p-fluid"], [4, "ngIf"], [1, "flex", "justify-content-between", "mt-4"], ["pButton", "", "type", "button", "label", "Pr\xE9c\xE9dent", "icon", "pi pi-arrow-left", 1, "p-button-outlined", 3, "click", "disabled"], ["pButton", "", "type", "button", "label", "Suivant", "icon", "pi pi-arrow-right", "iconPos", "right", 1, "p-button-outlined", 3, "click", "disabled"], [1, "mb-4"], [1, "p-3", "bg-yellow-50", "border-round", "border-1", "border-yellow-200", "flex", "align-items-center", "justify-content-between"], [1, "pi", "pi-info-circle", "mr-2"], ["pButton", "", "label", "Cr\xE9er l'analyse", "icon", "pi pi-plus", 1, "p-button-success", 3, "click", "loading"], [1, "p-3", "bg-green-50", "border-round", "border-1", "border-green-200", "flex", "align-items-center"], [1, "pi", "pi-check-circle", "text-green-600", "mr-2"], [1, "text-green-700"], ["pTemplate", "header"], [1, "overflow-x-auto"], [1, "w-full", "border-collapse"], [1, "bg-gray-100"], [1, "p-3", "text-left", "border-1", "surface-border", 2, "width", "35%"], [1, "p-3", "text-center", "border-1", "surface-border", "bg-blue-50", 2, "width", "25%"], [1, "font-normal"], [1, "p-3", "text-center", "border-1", "surface-border", "bg-gray-50", 2, "width", "25%"], [1, "p-3", "text-center", "border-1", "surface-border", 2, "width", "15%"], [1, "bg-blue-100"], ["colspan", "4", 1, "p-2", "font-bold", "border-1", "surface-border"], [1, "bg-gray-50"], [1, "p-2", "font-semibold", "border-1", "surface-border"], [1, "p-2", "text-right", "border-1", "surface-border", "font-bold", "text-primary"], [1, "p-2", "text-right", "border-1", "surface-border", "font-bold"], [1, "p-2", "border-1", "surface-border"], [1, "p-2", "pl-5", "border-1", "surface-border"], [1, "p-1", "border-1", "surface-border"], ["mode", "decimal", 1, "w-full", "input-sm", 3, "formControl", "useGrouping"], ["type", "text", "pInputText", "", 1, "w-full", "p-1", "text-sm"], [1, "bg-green-100"], [1, "p-2", "font-bold", "border-1", "surface-border"], [1, "p-2", "text-right", "border-1", "surface-border", "font-bold", "text-green-700"], ["colspan", "4", 1, "p-2"], [1, "bg-purple-100"], [1, "p-2", "text-right", "border-1", "surface-border", "font-bold", "text-purple-700"], [1, "p-2", "border-1", "surface-border", "text-xs", "text-color-secondary"], [1, "bg-yellow-50"], [1, "p-2", "text-right", "border-1", "surface-border", "font-bold", 3, "ngClass"], [1, "p-2", "border-1", "surface-border", "text-xs"], ["pTemplate", "footer"], [1, "flex", "align-items-center", "justify-content-between", "p-3", "bg-primary", "text-white"], [1, "m-0", "text-xl", "font-bold"], [1, "text-sm"], [1, "flex", "justify-content-end", "gap-2"], ["pButton", "", "label", "Enregistrer Bilan", "icon", "pi pi-save", 3, "click", "loading", "disabled"], [1, "p-3", "text-left", "border-1", "surface-border", 2, "width", "30%"], [1, "p-3", "text-center", "border-1", "surface-border", "bg-blue-50", 2, "width", "20%"], [1, "p-3", "text-center", "border-1", "surface-border", "bg-gray-50", 2, "width", "20%"], [1, "p-3", "text-center", "border-1", "surface-border", "bg-green-50", 2, "width", "20%"], [1, "p-3", "text-center", "border-1", "surface-border", 2, "width", "10%"], [1, "bg-blue-50"], [1, "ml-2", "text-sm", "font-normal", "text-color-secondary"], [1, "bg-red-50"], ["colspan", "5", 1, "p-2", "font-bold", "border-1", "surface-border"], [1, "p-2", "pl-4", "border-1", "surface-border"], [1, "bg-red-100"], [1, "p-2", "text-right", "border-1", "surface-border", "font-bold", "text-red-700"], ["colspan", "5", 1, "p-2"], ["pButton", "", "label", "Enregistrer Rentabilit\xE9", "icon", "pi pi-save", 3, "click", "loading", "disabled"], ["header", "Personnes Caution"], [1, "grid", "gap-3"], [1, "col-12"], [1, "text-lg", "font-bold", "mb-3", "border-bottom-1", "surface-border", "pb-2"], [1, "text-color-secondary", "mb-4"], [1, "p-fluid", 3, "formGroup"], [1, "col-12", "md:col-6"], [1, "block", "font-medium", "mb-1"], ["type", "text", "pInputText", "", "formControlName", "nom", 1, "w-full"], ["type", "text", "pInputText", "", "formControlName", "prenom", 1, "w-full"], ["type", "text", "pInputText", "", "formControlName", "telephone", 1, "w-full"], ["formControlName", "age", "suffix", " ans", 1, "w-full", 3, "showButtons", "min", "max"], ["type", "text", "pInputText", "", "formControlName", "activite", 1, "w-full"], ["type", "text", "pInputText", "", "formControlName", "profession", 1, "w-full"], ["pButton", "", "type", "button", "label", "Ajouter cette personne caution", "icon", "pi pi-plus", 1, "p-button-success", 3, "click"], ["class", "col-12", 4, "ngIf"], ["class", "col-12 md:col-6", 4, "ngFor", "ngForOf"], [1, "grid"], ["class", "col-6", 4, "ngIf"], [1, "flex", "align-items-center", "justify-content-between", "p-3", "bg-gray-100"], [1, "font-bold"], ["pButton", "", "type", "button", "icon", "pi pi-trash", "pTooltip", "Supprimer", 1, "p-button-rounded", "p-button-danger", "p-button-text", 3, "click"], [1, "col-6"], [1, "p-3", "bg-yellow-50", "border-round", "border-1", "border-yellow-200", "text-center"], ["header", "Synth\xE8se de l'Analyse"], [1, "text-lg", "font-bold", "mb-4", "border-bottom-1", "surface-border", "pb-2"], [1, "pi", "pi-file-check", "mr-2"], [1, "col-12", "md:col-6", "lg:col-3"], [1, "p-3", "bg-blue-50", "border-round", "text-center"], [1, "block", "text-color-secondary", "mb-1"], [1, "text-lg", "text-blue-700"], [1, "p-3", "bg-green-50", "border-round", "text-center"], [1, "text-lg", "text-green-700"], [1, "p-3", "bg-purple-50", "border-round", "text-center"], [1, "text-lg", "text-purple-700"], [1, "col-12", "mt-3"], [1, "p-4", "bg-primary", "border-round", "text-white", "text-center"], [1, "block", "text-lg", "mb-1"], [1, "text-3xl"], [1, "col-12", "mt-4"], [1, "pi", "pi-users", "mr-2"], ["class", "grid", 4, "ngIf"], ["class", "p-3 bg-yellow-50 border-round border-1 border-yellow-200", 4, "ngIf"], [1, "p-3", "bg-yellow-50", "border-round", "border-1", "border-yellow-200"], [1, "pi", "pi-exclamation-triangle", "mr-2", "text-yellow-700"], [1, "p-3", "bg-gray-50", "border-round"], ["class", "ml-2 text-color-secondary", 4, "ngIf"], [1, "ml-2", "text-color-secondary"], [1, "flex", "justify-content-end"], ["pButton", "", "label", "Soumettre l'Analyse", "icon", "pi pi-send", 1, "p-button-success", 3, "click", "loading", "disabled"], [3, "formGroup"], [1, "p-3", "text-center", "border-1", "surface-border", "bg-blue-50", 2, "width", "23%"], [1, "p-3", "text-center", "border-1", "surface-border", "bg-yellow-50", 2, "width", "23%"], [1, "p-3", "text-center", "border-1", "surface-border", "bg-green-50", 2, "width", "24%"], [1, "pi", "pi-building", "mr-2"], ["formControlName", "coutEquipement", "mode", "decimal", 1, "w-full", "input-sm", 3, "useGrouping"], [1, "p-1", "border-1", "surface-border", "bg-yellow-50"], ["formControlName", "ajustCoutEquipement", "mode", "decimal", 1, "w-full", "input-sm", 3, "useGrouping"], [1, "p-2", "text-right", "border-1", "surface-border", "bg-green-50", "font-semibold"], ["formControlName", "depensesRattachees", "mode", "decimal", 1, "w-full", "input-sm", 3, "useGrouping"], ["formControlName", "ajustDepensesRattachees", "mode", "decimal", 1, "w-full", "input-sm", 3, "useGrouping"], [1, "p-2", "pl-4", "font-semibold", "border-1", "surface-border"], [1, "p-2", "text-right", "border-1", "surface-border", "font-bold", "text-blue-700"], [1, "p-2", "text-right", "border-1", "surface-border", "font-bold", "text-yellow-700", "bg-yellow-50"], [1, "p-2", "text-right", "border-1", "surface-border", "font-bold", "text-green-700", "bg-green-50"], [1, "p-2", "pl-4", "border-1", "surface-border", "text-green-700"], ["formControlName", "apportPersonnel", "mode", "decimal", 1, "w-full", "input-sm", 3, "useGrouping"], ["formControlName", "ajustApportPersonnel", "mode", "decimal", 1, "w-full", "input-sm", 3, "useGrouping"], [1, "p-2", "text-right", "border-1", "surface-border", "bg-green-50", "font-semibold", "text-green-700"], [1, "bg-blue-200"], [1, "p-2", "text-right", "border-1", "surface-border", "font-bold", "text-blue-800"], [1, "p-2", "text-right", "border-1", "surface-border", "font-bold", "text-yellow-800", "bg-yellow-100"], [1, "p-2", "text-right", "border-1", "surface-border", "font-bold", "text-green-800", "bg-green-100"], [1, "pi", "pi-sync", "mr-2"], ["formControlName", "coutAchatCycle", "mode", "decimal", 1, "w-full", "input-sm", 3, "useGrouping"], ["formControlName", "ajustCoutAchatCycle", "mode", "decimal", 1, "w-full", "input-sm", 3, "useGrouping"], ["colspan", "2", 1, "p-1", "border-1", "surface-border"], ["formControlName", "nbreCycleFinancer", 1, "w-full", "input-sm", 3, "showButtons", "min", "max"], [1, "p-2", "text-center", "border-1", "surface-border", "bg-green-50", "font-semibold"], [1, "bg-purple-50"], ["colspan", "4", 1, "p-2", "pl-4", "font-semibold", "border-1", "surface-border", "text-green-700"], [1, "p-2", "pl-6", "border-1", "surface-border"], ["formControlName", "tresorerieDisponible", "mode", "decimal", 1, "w-full", "input-sm", 3, "useGrouping"], ["formControlName", "ajustTresorerieDispo", "mode", "decimal", 1, "w-full", "input-sm", 3, "useGrouping"], ["formControlName", "stockActuel", "mode", "decimal", 1, "w-full", "input-sm", 3, "useGrouping"], ["formControlName", "ajustStockActuel", "mode", "decimal", 1, "w-full", "input-sm", 3, "useGrouping"], ["formControlName", "comptesRecevoir", "mode", "decimal", 1, "w-full", "input-sm", 3, "useGrouping"], ["formControlName", "ajustComptesRecevoir", "mode", "decimal", 1, "w-full", "input-sm", 3, "useGrouping"], [1, "bg-green-50"], [1, "p-2", "pl-4", "font-semibold", "border-1", "surface-border", "text-green-700"], [1, "p-2", "text-right", "border-1", "surface-border", "font-bold", "text-green-800"], ["colspan", "4", 1, "p-2", "pl-4", "font-semibold", "border-1", "surface-border", "text-red-700"], ["formControlName", "dettesFournisseurs", "mode", "decimal", 1, "w-full", "input-sm", 3, "useGrouping"], ["formControlName", "ajustDettesFournisseurs", "mode", "decimal", 1, "w-full", "input-sm", 3, "useGrouping"], ["formControlName", "creditFournisseur", "mode", "decimal", 1, "w-full", "input-sm", 3, "useGrouping"], ["formControlName", "ajustCreditFournisseur", "mode", "decimal", 1, "w-full", "input-sm", 3, "useGrouping"], [1, "p-2", "pl-4", "font-semibold", "border-1", "surface-border", "text-red-700"], [1, "p-2", "text-right", "border-1", "surface-border", "font-bold", "text-red-800", "bg-red-100"], [1, "bg-purple-200"], [1, "p-2", "text-right", "border-1", "surface-border", "font-bold", "text-purple-800"], ["colspan", "4", 1, "p-3"], [1, "bg-primary", "text-white"], [1, "p-3", "font-bold", "border-1", "border-white"], [1, "pi", "pi-wallet", "mr-2"], [1, "p-3", "text-right", "border-1", "border-white", "font-bold", "text-xl"], [1, "p-3", "text-right", "border-1", "border-white", "font-bold", "text-xl", "bg-yellow-600"], [1, "p-3", "text-right", "border-1", "border-white", "font-bold", "text-xl", "bg-green-600"], [1, "grid", "mt-4"], [1, "col-12", "md:col-4"], [1, "p-3", "bg-blue-100", "border-round", "text-center"], [1, "p-3", "bg-purple-100", "border-round", "text-center"], [1, "p-3", "bg-green-100", "border-round", "text-center"], [1, "text-xl", "text-green-700"], ["pButton", "", "label", "Enregistrer Besoin Cr\xE9dit", "icon", "pi pi-save", 3, "click", "loading", "disabled"]], template: function AnalyseBilanActiviteComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
      \u0275\u0275text(2, "Analyse Financi\xE8re");
      \u0275\u0275elementEnd();
      \u0275\u0275element(3, "p-toast");
      \u0275\u0275template(4, AnalyseBilanActiviteComponent_div_4_Template, 6, 1, "div", 2)(5, AnalyseBilanActiviteComponent_div_5_Template, 5, 1, "div", 2);
      \u0275\u0275element(6, "p-steps", 3);
      \u0275\u0275elementStart(7, "div", 4);
      \u0275\u0275template(8, AnalyseBilanActiviteComponent_div_8_Template, 233, 186, "div", 5)(9, AnalyseBilanActiviteComponent_div_9_Template, 221, 193, "div", 5)(10, AnalyseBilanActiviteComponent_div_10_Template, 39, 6, "div", 5)(11, AnalyseBilanActiviteComponent_div_11_Template, 53, 40, "div", 5)(12, AnalyseBilanActiviteComponent_div_12_Template, 240, 320, "div", 5);
      \u0275\u0275elementStart(13, "div", 6)(14, "button", 7);
      \u0275\u0275listener("click", function AnalyseBilanActiviteComponent_Template_button_click_14_listener() {
        return ctx.prevStep();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "button", 8);
      \u0275\u0275listener("click", function AnalyseBilanActiviteComponent_Template_button_click_15_listener() {
        return ctx.nextStep();
      });
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275property("ngIf", !ctx.state().analyseExiste);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.state().analyseExiste);
      \u0275\u0275advance();
      \u0275\u0275property("model", ctx.items())("activeIndex", ctx.activeIndex())("readonly", false);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngIf", ctx.activeIndex() === 0);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.activeIndex() === 1);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.activeIndex() === 2);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.activeIndex() === 3);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.activeIndex() === 4);
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", ctx.activeIndex() === 0);
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.activeIndex() === 4);
    }
  }, dependencies: [
    CommonModule,
    NgClass,
    NgForOf,
    NgIf,
    DecimalPipe,
    CurrencyPipe,
    TextareaModule,
    InputGroupModule,
    PrimeTemplate,
    FormsModule,
    \u0275NgNoValidate,
    DefaultValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    ReactiveFormsModule,
    FormControlDirective,
    FormGroupDirective,
    FormControlName,
    ButtonModule,
    ButtonDirective,
    InputTextModule,
    InputText,
    InputNumberModule,
    InputNumber,
    StepsModule,
    Steps,
    CardModule,
    Card,
    ToastModule,
    Toast,
    TagModule,
    BadgeModule,
    TableModule,
    PanelModule,
    DividerModule,
    TooltipModule,
    Tooltip,
    DatePickerModule,
    SelectModule
  ], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AnalyseBilanActiviteComponent, { className: "AnalyseBilanActiviteComponent", filePath: "src/app/pages/dashboard/credit/individuel/attente/detail/analyse-bilan-activite/analyse-bilan-activite.component.ts", lineNumber: 90 });
})();
export {
  AnalyseBilanActiviteComponent
};
//# sourceMappingURL=chunk-676XAJ2K.js.map
