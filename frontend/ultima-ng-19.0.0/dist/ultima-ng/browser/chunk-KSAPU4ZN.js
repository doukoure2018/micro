import {
  Toast,
  ToastModule
} from "./chunk-6SRYYUT2.js";
import {
  CalendarModule
} from "./chunk-NLXNXYLN.js";
import {
  SortIcon,
  SortableColumn,
  Table,
  TableModule
} from "./chunk-REDVHUQC.js";
import "./chunk-YZRRSC3U.js";
import "./chunk-6K6X5UBT.js";
import "./chunk-7HJ4XJ7U.js";
import "./chunk-UQSIOFSP.js";
import "./chunk-OCW7T434.js";
import "./chunk-4JIPYACT.js";
import "./chunk-6GA37Q7Z.js";
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
import "./chunk-JGOABXTK.js";
import "./chunk-HY2A3TN6.js";
import "./chunk-YEN5RMZS.js";
import "./chunk-XS7IVZ5T.js";
import "./chunk-CUABQE42.js";
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
  FormsModule,
  NgControlStatus,
  NgModel
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
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵresetView,
  ɵɵrestoreView,
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

// src/app/pages/dashboard/agent-credit/correction-en-attente/correction-en-attente.component.ts
var _c0 = () => [5, 10, 20, 50];
var _c1 = () => ["nomCliente", "codCliente", "numId", "telPrincipal"];
var _c2 = () => ({ "min-width": "75rem" });
function CorrectionEnAttenteComponent_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 3)(1, "h2", 4);
    \u0275\u0275element(2, "i", 5);
    \u0275\u0275text(3, " Personnes Physiques en Attente Pour la validation ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 6)(5, "span", 7);
    \u0275\u0275element(6, "i", 8);
    \u0275\u0275elementStart(7, "input", 9);
    \u0275\u0275twoWayListener("ngModelChange", function CorrectionEnAttenteComponent_ng_template_3_Template_input_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.state().searchValue, $event) || (ctx_r1.state().searchValue = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function CorrectionEnAttenteComponent_ng_template_3_Template_input_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSearchChange($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "button", 10);
    \u0275\u0275listener("click", function CorrectionEnAttenteComponent_ng_template_3_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.refresh());
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.state().searchValue);
    \u0275\u0275property("disabled", ctx_r1.state().isAgentActive === false);
    \u0275\u0275advance();
    \u0275\u0275property("loading", ctx_r1.state().loading || ctx_r1.state().checkingStatus);
  }
}
function CorrectionEnAttenteComponent_ng_template_4_div_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14)(1, "div", 15);
    \u0275\u0275element(2, "i", 16);
    \u0275\u0275elementStart(3, "p", 17);
    \u0275\u0275text(4, "V\xE9rification de votre statut d'activation...");
    \u0275\u0275elementEnd()()();
  }
}
function CorrectionEnAttenteComponent_ng_template_4_div_1_div_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32)(1, "p");
    \u0275\u0275element(2, "i", 33);
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4, "Note:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " Point de service actuel: ");
    \u0275\u0275elementStart(6, "strong");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(((tmp_3_0 = ctx_r1.state().user) == null ? null : tmp_3_0.pointventeId) || "Non assign\xE9");
  }
}
function CorrectionEnAttenteComponent_ng_template_4_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 18)(1, "div", 19)(2, "div", 20);
    \u0275\u0275element(3, "i", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 22)(5, "h3", 23);
    \u0275\u0275text(6, " \u{1F6AB} Acc\xE8s Restreint - Agent Non Activ\xE9 ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 24)(8, "p", 25);
    \u0275\u0275text(9, " Vous n'\xEAtes pas activ\xE9 dans ce point de service. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 26);
    \u0275\u0275text(11, " Pour acc\xE9der aux fonctionnalit\xE9s de validation, votre compte doit \xEAtre activ\xE9 par le Responsable d'Agence (RA) pour ce point de service. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 27)(13, "h4");
    \u0275\u0275text(14, "\u{1F4CB} Que faire ?");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "ul")(16, "li");
    \u0275\u0275text(17, "Contactez votre Responsable d'Agence (RA)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "li");
    \u0275\u0275text(19, "Demandez l'activation de votre compte pour ce point de service");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "li");
    \u0275\u0275text(21, "Une fois activ\xE9, rafra\xEEchissez cette page");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(22, CorrectionEnAttenteComponent_ng_template_4_div_1_div_22_Template, 8, 1, "div", 28);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "div", 29)(24, "button", 30);
    \u0275\u0275listener("click", function CorrectionEnAttenteComponent_ng_template_4_div_1_Template_button_click_24_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.checkAgentStatus(ctx_r1.state().user));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "button", 31);
    \u0275\u0275listener("click", function CorrectionEnAttenteComponent_ng_template_4_div_1_Template_button_click_25_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.reloadPage());
    });
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(22);
    \u0275\u0275property("ngIf", ctx_r1.state().user);
    \u0275\u0275advance(2);
    \u0275\u0275property("loading", ctx_r1.state().checkingStatus);
  }
}
function CorrectionEnAttenteComponent_ng_template_4_div_2_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14);
    \u0275\u0275element(1, "p-progressSpinner");
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Chargement des donn\xE9es en cours...");
    \u0275\u0275elementEnd()();
  }
}
function CorrectionEnAttenteComponent_ng_template_4_div_2_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 36);
    \u0275\u0275element(1, "i", 21);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 37);
    \u0275\u0275listener("click", function CorrectionEnAttenteComponent_ng_template_4_div_2_div_2_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.loadListePPAttente());
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.state().error);
  }
}
function CorrectionEnAttenteComponent_ng_template_4_div_2_div_3_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 44)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r1.filteredList().length, " personne(s) trouv\xE9e(s)");
  }
}
function CorrectionEnAttenteComponent_ng_template_4_div_2_div_3_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 45);
    \u0275\u0275text(2, "#");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th", 46);
    \u0275\u0275text(4, " Code Client ");
    \u0275\u0275element(5, "p-sortIcon", 47);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 48);
    \u0275\u0275text(7, " Nom Complet ");
    \u0275\u0275element(8, "p-sortIcon", 49);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th");
    \u0275\u0275text(10, "N\xB0 Identit\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th");
    \u0275\u0275text(12, "T\xE9l\xE9phone");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th", 50);
    \u0275\u0275text(14, " Date Naissance ");
    \u0275\u0275element(15, "p-sortIcon", 51);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th");
    \u0275\u0275text(17, "Sexe");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "th");
    \u0275\u0275text(19, "\xC9tat Civil");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "th", 52);
    \u0275\u0275text(21, " Statut ");
    \u0275\u0275element(22, "p-sortIcon", 53);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "th");
    \u0275\u0275text(24, "Agence");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "th", 54);
    \u0275\u0275text(26, " Date Cr\xE9ation ");
    \u0275\u0275element(27, "p-sortIcon", 55);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "th", 56);
    \u0275\u0275text(29, "Actions");
    \u0275\u0275elementEnd()();
  }
}
function CorrectionEnAttenteComponent_ng_template_4_div_2_div_3_ng_template_4_small_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 59);
    \u0275\u0275element(1, "i", 69);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const pp_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", pp_r6.telOtro, " ");
  }
}
function CorrectionEnAttenteComponent_ng_template_4_div_2_div_3_ng_template_4_span_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const pp_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(pp_r6.fechNacimiento);
  }
}
function CorrectionEnAttenteComponent_ng_template_4_div_2_div_3_ng_template_4_span_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 70);
    \u0275\u0275text(1, "-");
    \u0275\u0275elementEnd();
  }
}
function CorrectionEnAttenteComponent_ng_template_4_div_2_div_3_ng_template_4_small_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 59);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const pp_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" Conjoint: ", pp_r6.conjoint, " ");
  }
}
function CorrectionEnAttenteComponent_ng_template_4_div_2_div_3_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td")(4, "span", 57);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "td")(7, "div", 58)(8, "strong");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "small", 59);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "td")(13, "div", 60)(14, "span");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "small", 59);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "td")(19, "div", 61);
    \u0275\u0275element(20, "i", 62);
    \u0275\u0275text(21);
    \u0275\u0275template(22, CorrectionEnAttenteComponent_ng_template_4_div_2_div_3_ng_template_4_small_22_Template, 3, 1, "small", 63);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "td");
    \u0275\u0275template(24, CorrectionEnAttenteComponent_ng_template_4_div_2_div_3_ng_template_4_span_24_Template, 2, 1, "span", 13)(25, CorrectionEnAttenteComponent_ng_template_4_div_2_div_3_ng_template_4_span_25_Template, 2, 0, "span", 64);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "td");
    \u0275\u0275element(27, "p-tag", 65);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "td")(29, "span");
    \u0275\u0275text(30);
    \u0275\u0275elementEnd();
    \u0275\u0275template(31, CorrectionEnAttenteComponent_ng_template_4_div_2_div_3_ng_template_4_small_31_Template, 2, 1, "small", 63);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "td");
    \u0275\u0275element(33, "p-tag", 65);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "td")(35, "span", 66);
    \u0275\u0275text(36);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(37, "td")(38, "small");
    \u0275\u0275text(39);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(40, "td")(41, "div", 67)(42, "button", 68);
    \u0275\u0275listener("click", function CorrectionEnAttenteComponent_ng_template_4_div_2_div_3_ng_template_4_Template_button_click_42_listener() {
      const pp_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.viewDetails(pp_r6));
    });
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const pp_r6 = ctx.$implicit;
    const rowIndex_r7 = ctx.rowIndex;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(rowIndex_r7 + 1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(pp_r6.codCliente);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(pp_r6.nomCliente);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", pp_r6.nomClient, " ", pp_r6.prenomClient, "");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(pp_r6.numId);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Type: ", pp_r6.typePiece, "");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", pp_r6.telPrincipal, " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", pp_r6.telOtro);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", pp_r6.fechNacimiento);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !pp_r6.fechNacimiento);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r1.getSexeLabel(pp_r6.indSexo))("severity", pp_r6.indSexo === "M" ? "info" : "success");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.getEtatCivilLabel(pp_r6.estCivil));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", pp_r6.conjoint);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r1.getStatusLabel(pp_r6.correctionStatut))("severity", ctx_r1.getStatusSeverity(pp_r6.correctionStatut));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(pp_r6.codeAgence);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(pp_r6.createdAt);
  }
}
function CorrectionEnAttenteComponent_ng_template_4_div_2_div_3_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 71)(2, "div", 72);
    \u0275\u0275element(3, "i", 73);
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5, "Aucune personne physique en attente trouv\xE9e");
    \u0275\u0275elementEnd()()()();
  }
}
function CorrectionEnAttenteComponent_ng_template_4_div_2_div_3_ng_template_6_span_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 76);
    \u0275\u0275element(1, "i", 78);
    \u0275\u0275text(2, " En attente: ");
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.enAttenteCount);
  }
}
function CorrectionEnAttenteComponent_ng_template_4_div_2_div_3_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 74)(1, "div", 75)(2, "span", 76);
    \u0275\u0275element(3, "i", 5);
    \u0275\u0275text(4, " Total: ");
    \u0275\u0275elementStart(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(7, CorrectionEnAttenteComponent_ng_template_4_div_2_div_3_ng_template_6_span_7_Template, 5, 1, "span", 77);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.filteredList().length);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.filteredList().length > 0);
  }
}
function CorrectionEnAttenteComponent_ng_template_4_div_2_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 38)(1, "p-table", 39);
    \u0275\u0275template(2, CorrectionEnAttenteComponent_ng_template_4_div_2_div_3_ng_template_2_Template, 3, 1, "ng-template", 40)(3, CorrectionEnAttenteComponent_ng_template_4_div_2_div_3_ng_template_3_Template, 30, 0, "ng-template", 1)(4, CorrectionEnAttenteComponent_ng_template_4_div_2_div_3_ng_template_4_Template, 43, 19, "ng-template", 41)(5, CorrectionEnAttenteComponent_ng_template_4_div_2_div_3_ng_template_5_Template, 6, 0, "ng-template", 42)(6, CorrectionEnAttenteComponent_ng_template_4_div_2_div_3_ng_template_6_Template, 8, 2, "ng-template", 43);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r1.filteredList())("paginator", true)("rows", 10)("rowsPerPageOptions", \u0275\u0275pureFunction0(7, _c0))("showCurrentPageReport", true)("globalFilterFields", \u0275\u0275pureFunction0(8, _c1))("tableStyle", \u0275\u0275pureFunction0(9, _c2));
  }
}
function CorrectionEnAttenteComponent_ng_template_4_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275template(1, CorrectionEnAttenteComponent_ng_template_4_div_2_div_1_Template, 4, 0, "div", 11)(2, CorrectionEnAttenteComponent_ng_template_4_div_2_div_2_Template, 5, 1, "div", 34)(3, CorrectionEnAttenteComponent_ng_template_4_div_2_div_3_Template, 7, 10, "div", 35);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.state().loading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.state().error && !ctx_r1.state().loading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.state().loading && !ctx_r1.state().error);
  }
}
function CorrectionEnAttenteComponent_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, CorrectionEnAttenteComponent_ng_template_4_div_0_Template, 5, 0, "div", 11)(1, CorrectionEnAttenteComponent_ng_template_4_div_1_Template, 26, 2, "div", 12)(2, CorrectionEnAttenteComponent_ng_template_4_div_2_Template, 4, 3, "div", 13);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("ngIf", ctx_r1.state().checkingStatus);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.state().checkingStatus && ctx_r1.state().isAgentActive === false);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.state().isAgentActive === true && !ctx_r1.state().checkingStatus);
  }
}
var CorrectionEnAttenteComponent = class _CorrectionEnAttenteComponent {
  state = signal({
    user: void 0,
    listePPAttente: [],
    loading: false,
    message: void 0,
    error: void 0,
    statusOptions: [
      { label: "En attente", value: "A" },
      { label: "Suspendu", value: "S" },
      { label: "Valid\xE9", value: "V" },
      { label: "Rejet\xE9", value: "R" }
    ],
    dateKeys: ["fecVencim", "fechNacimiento", "dateAttente", "createdAt", "updatedAt"],
    selectedPP: null,
    searchValue: "",
    isAgentActive: void 0,
    checkingStatus: false
  });
  filteredList = computed(() => {
    const searchValue = this.state().searchValue.toLowerCase();
    if (!searchValue) {
      return this.state().listePPAttente;
    }
    return this.state().listePPAttente.filter((pp) => pp.nomCliente?.toLowerCase().includes(searchValue) || pp.codCliente?.toLowerCase().includes(searchValue) || pp.numId?.toLowerCase().includes(searchValue) || pp.telPrincipal?.toLowerCase().includes(searchValue));
  });
  userService = inject(UserService);
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  messageService = inject(MessageService);
  ngOnInit() {
    console.log("\u{1F527} ngOnInit - Chargement du user...");
    this.loadUserAndCheckStatus();
  }
  /**
   * Charger l'utilisateur connecté et vérifier son statut
   */
  loadUserAndCheckStatus() {
    console.log("\u{1F464} Loading user from API...");
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { checkingStatus: true }));
    this.userService.getInstanceUser$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        console.log("\u{1F4E5} User API response:", response);
        const user = response.data?.user;
        if (!user) {
          console.error("\u274C No user in response");
          this.state.update((s) => __spreadProps(__spreadValues({}, s), {
            checkingStatus: false,
            error: "Impossible de charger les informations utilisateur"
          }));
          return;
        }
        console.log("\u2705 User loaded:", {
          userId: user.userId,
          pointventeId: user.pointventeId,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        });
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { user }));
        if (user.userId && user.pointventeId) {
          this.checkAgentStatus(user);
        } else {
          console.error("\u274C User missing userId or pointventeId");
          this.state.update((s) => __spreadProps(__spreadValues({}, s), {
            checkingStatus: false,
            isAgentActive: false,
            error: "Point de vente non assign\xE9"
          }));
          this.messageService.add({
            severity: "warn",
            summary: "Attention",
            detail: "Aucun point de vente assign\xE9 \xE0 votre compte",
            life: 5e3
          });
        }
      },
      error: (error) => {
        console.error("\u274C Error loading user:", error);
        this.state.update((s) => __spreadProps(__spreadValues({}, s), {
          checkingStatus: false,
          error: "Erreur lors du chargement des informations utilisateur"
        }));
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Impossible de charger vos informations",
          life: 5e3
        });
      }
    });
  }
  /**
   * Vérifier si l'agent est actif dans son point de vente
   */
  checkAgentStatus(user) {
    console.log("\u{1F50D} checkAgentStatus called for:", {
      userId: user.userId,
      pointventeId: user.pointventeId
    });
    this.userService.checkAgentDisponibility$(user.userId, user.pointventeId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        console.log("\u{1F4E5} Status check response:", response);
        const disponibility = response.data?.disponibilityAgent;
        const isActive = disponibility?.isActive || false;
        console.log("\u2705 Agent status:", {
          isActive,
          message: disponibility?.message,
          currentPs: disponibility?.currentPs
        });
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          isAgentActive: isActive,
          checkingStatus: false
        }));
        if (!isActive) {
          console.warn("\u26A0\uFE0F Agent is NOT active");
          this.messageService.add({
            severity: "error",
            summary: "Acc\xE8s Restreint",
            detail: "Vous n'\xEAtes pas activ\xE9 dans ce point de service.",
            life: 1e4
          });
        } else {
          console.log("\u2705 Agent is ACTIVE - Loading data...");
          this.messageService.add({
            severity: "success",
            summary: "Acc\xE8s Autoris\xE9",
            detail: "Chargement des donn\xE9es...",
            life: 3e3
          });
          this.loadListePPAttente();
        }
      },
      error: (error) => {
        console.error("\u274C Error checking agent status:", error);
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          isAgentActive: false,
          checkingStatus: false,
          error: "Impossible de v\xE9rifier votre statut"
        }));
        this.messageService.add({
          severity: "warn",
          summary: "Erreur",
          detail: "Impossible de v\xE9rifier votre statut d'activation.",
          life: 5e3
        });
      }
    });
  }
  /**
   * Charger la liste des personnes physiques en attente
   */
  /**
   * Charger la liste des personnes physiques en attente
   */
  loadListePPAttente() {
    console.log("\u{1F4CB} loadListePPAttente called");
    if (this.state().isAgentActive === false) {
      console.warn("\u26A0\uFE0F Cannot load data - Agent not active");
      this.messageService.add({
        severity: "warn",
        summary: "Acc\xE8s Refus\xE9",
        detail: "Vous devez \xEAtre activ\xE9 pour acc\xE9der aux donn\xE9es",
        life: 3e3
      });
      return;
    }
    console.log("\u{1F504} Loading PP Attente list...");
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: true, error: void 0 }));
    this.userService.getListPPAttente$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        console.log("\u{1F4E5} PP Attente response:", response);
        if (response.code === 200 && response.data?.listePPAttente) {
          const liste = Array.isArray(response.data.listePPAttente) ? response.data.listePPAttente : [response.data.listePPAttente];
          const processedList = this.processDateArrays(liste);
          console.log("\u2705 Loaded PP Attente:", processedList.length);
          this.state.update((s) => __spreadProps(__spreadValues({}, s), {
            listePPAttente: processedList,
            loading: false,
            message: response.message
          }));
          this.messageService.add({
            severity: "success",
            summary: "Succ\xE8s",
            detail: `${processedList.length} personne(s) charg\xE9e(s)`,
            life: 3e3
          });
        } else {
          console.warn("\u26A0\uFE0F No data in response");
          this.state.update((s) => __spreadProps(__spreadValues({}, s), {
            listePPAttente: [],
            loading: false,
            error: "Aucune donn\xE9e trouv\xE9e"
          }));
          this.messageService.add({
            severity: "info",
            summary: "Information",
            detail: "Aucune personne physique en attente",
            life: 3e3
          });
        }
      },
      error: (error) => {
        console.error("\u274C Error loading PP Attente:", error);
        this.state.update((s) => __spreadProps(__spreadValues({}, s), {
          loading: false,
          error: "Erreur lors du chargement"
        }));
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Erreur lors du chargement des donn\xE9es",
          life: 5e3
        });
      }
    });
  }
  processDateArrays(list) {
    return list.map((item) => {
      const processed = __spreadValues({}, item);
      if (item.fecVencim && Array.isArray(item.fecVencim)) {
        processed.fecVencim = this.arrayToDateString(item.fecVencim);
      }
      if (item.fechNacimiento && Array.isArray(item.fechNacimiento)) {
        processed.fechNacimiento = this.arrayToDateString(item.fechNacimiento);
      }
      if (item.createdAt && Array.isArray(item.createdAt)) {
        processed.createdAt = this.arrayToDateTimeString(item.createdAt);
      }
      if (item.updatedAt && Array.isArray(item.updatedAt)) {
        processed.updatedAt = this.arrayToDateTimeString(item.updatedAt);
      }
      return processed;
    });
  }
  arrayToDateString(dateArray) {
    if (!dateArray || dateArray.length < 3)
      return "";
    const [year, month, day] = dateArray;
    return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
  }
  arrayToDateTimeString(dateArray) {
    if (!dateArray || dateArray.length < 6)
      return "";
    const [year, month, day, hour, minute, second] = dateArray;
    return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  }
  viewDetails(pp) {
    if (this.state().isAgentActive === false) {
      this.messageService.add({
        severity: "error",
        summary: "Acc\xE8s Refus\xE9",
        detail: "Vous devez \xEAtre activ\xE9",
        life: 5e3
      });
      return;
    }
    this.router.navigate(["dashboards/correction-en-attente/detail", pp.codCliente]);
  }
  getStatusSeverity(status) {
    switch (status) {
      case "EN_ATTENTE":
        return "info";
      case "VALIDE":
        return "success";
      case "REJETE":
        return "danger";
      default:
        return "secondary";
    }
  }
  getStatusLabel(status) {
    const option = this.state().statusOptions.find((opt) => opt.value === status);
    return option ? option.label : status;
  }
  getSexeLabel(sexe) {
    return sexe === "M" ? "Masculin" : sexe === "F" ? "F\xE9minin" : sexe;
  }
  getEtatCivilLabel(etatCivil) {
    switch (etatCivil) {
      case "S":
        return "C\xE9libataire";
      case "M":
        return "Mari\xE9(e)";
      case "D":
        return "Divorc\xE9(e)";
      case "V":
        return "Veuf/Veuve";
      case "C":
        return "Concubinage";
      default:
        return etatCivil;
    }
  }
  refresh() {
    console.log("\u{1F504} Refresh clicked");
    if (this.state().isAgentActive) {
      this.state.update((s) => __spreadProps(__spreadValues({}, s), { searchValue: "" }));
      this.loadListePPAttente();
    } else {
      this.loadUserAndCheckStatus();
    }
  }
  onSearchChange(value) {
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { searchValue: value }));
  }
  reloadPage() {
    window.location.reload();
  }
  // ⭐ Mise à jour du getter pour utiliser state().user
  get enAttenteCount() {
    return this.filteredList().filter((p) => p.correctionStatut === "EN_ATTENTE").length;
  }
  static \u0275fac = function CorrectionEnAttenteComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CorrectionEnAttenteComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CorrectionEnAttenteComponent, selectors: [["app-correction-en-attente"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 5, vars: 0, consts: [[1, "correction-attente-container"], ["pTemplate", "header"], ["pTemplate", "content"], [1, "header-section"], [1, "page-title"], [1, "pi", "pi-users"], [1, "header-actions"], [1, "p-input-icon-left"], [1, "pi", "pi-search"], ["type", "text", "pInputText", "", "placeholder", "Rechercher par nom, code client, ID...", 1, "search-input", 3, "ngModelChange", "ngModel", "disabled"], ["pButton", "", "icon", "pi pi-refresh", "pTooltip", "Rafra\xEEchir", 1, "p-button-rounded", "p-button-outlined", 3, "click", "loading"], ["class", "loading-container", 4, "ngIf"], ["class", "inactive-agent-warning", 4, "ngIf"], [4, "ngIf"], [1, "loading-container"], [1, "flex", "flex-col", "items-center", "gap-3"], [1, "pi", "pi-spin", "pi-spinner", "text-4xl", "text-blue-500"], [1, "text-gray-600"], [1, "inactive-agent-warning"], [1, "warning-content"], [1, "warning-icon"], [1, "pi", "pi-exclamation-triangle"], [1, "warning-details"], [1, "warning-title"], [1, "warning-messages"], [1, "primary-message"], [1, "secondary-message"], [1, "action-steps"], ["class", "info-note", 4, "ngIf"], [1, "warning-actions"], ["pButton", "", "pRipple", "", "label", "V\xE9rifier mon statut", "icon", "pi pi-refresh", 1, "p-button-outlined", "p-button-danger", 3, "click", "loading"], ["pButton", "", "pRipple", "", "label", "Recharger la page", "icon", "pi pi-replay", 1, "p-button-outlined", 3, "click"], [1, "info-note"], [1, "pi", "pi-info-circle"], ["class", "error-container", 4, "ngIf"], ["class", "table-container", 4, "ngIf"], [1, "error-container"], ["pButton", "", "label", "R\xE9essayer", "icon", "pi pi-refresh", 3, "click"], [1, "table-container"], ["currentPageReportTemplate", "Affichage de {first} \xE0 {last} sur {totalRecords} entr\xE9es", "styleClass", "p-datatable-striped", "responsiveLayout", "scroll", 3, "value", "paginator", "rows", "rowsPerPageOptions", "showCurrentPageReport", "globalFilterFields", "tableStyle"], ["pTemplate", "caption"], ["pTemplate", "body"], ["pTemplate", "emptymessage"], ["pTemplate", "summary"], [1, "table-caption"], [2, "width", "3rem"], ["pSortableColumn", "codCliente"], ["field", "codCliente"], ["pSortableColumn", "nomCliente"], ["field", "nomCliente"], ["pSortableColumn", "fechNacimiento"], ["field", "fechNacimiento"], ["pSortableColumn", "statutClt"], ["field", "statutClt"], ["pSortableColumn", "createdAt"], ["field", "createdAt"], [2, "width", "12rem"], [1, "code-badge"], [1, "client-info"], [1, "text-muted", "d-block"], [1, "id-info"], [1, "phone-info"], [1, "pi", "pi-phone"], ["class", "text-muted d-block", 4, "ngIf"], ["class", "text-muted", 4, "ngIf"], [3, "value", "severity"], [1, "agence-code"], [1, "action-buttons"], ["pButton", "", "icon", "pi pi-eye", "pTooltip", "Voir d\xE9tails", 1, "p-button-rounded", "p-button-text", "p-button-info", 3, "click"], [1, "pi", "pi-mobile"], [1, "text-muted"], ["colspan", "12", 1, "text-center"], [1, "empty-message"], [1, "pi", "pi-inbox", 2, "font-size", "2rem"], [1, "summary-section"], [1, "summary-stats"], [1, "stat-item"], ["class", "stat-item", 4, "ngIf"], [1, "pi", "pi-clock"]], template: function CorrectionEnAttenteComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "p-toast");
      \u0275\u0275elementStart(2, "p-card");
      \u0275\u0275template(3, CorrectionEnAttenteComponent_ng_template_3_Template, 9, 3, "ng-template", 1)(4, CorrectionEnAttenteComponent_ng_template_4_Template, 3, 3, "ng-template", 2);
      \u0275\u0275elementEnd()();
    }
  }, dependencies: [CommonModule, NgIf, TableModule, Table, PrimeTemplate, SortableColumn, SortIcon, ButtonModule, ButtonDirective, InputTextModule, InputText, ProgressSpinnerModule, ProgressSpinner, TagModule, Tag, TooltipModule, Tooltip, CalendarModule, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, IconFieldModule, InputIconModule, CardModule, Card, ToastModule, Toast], styles: ["\n\n.correction-attente-container[_ngcontent-%COMP%] {\n  padding: 1.5rem;\n}\n.correction-attente-container[_ngcontent-%COMP%]   .header-section[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 1.5rem;\n  border-bottom: 1px solid var(--surface-border);\n}\n.correction-attente-container[_ngcontent-%COMP%]   .header-section[_ngcontent-%COMP%]   .page-title[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.5rem;\n  font-weight: 600;\n  color: var(--text-color);\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n}\n.correction-attente-container[_ngcontent-%COMP%]   .header-section[_ngcontent-%COMP%]   .page-title[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--primary-color);\n  font-size: 1.3rem;\n}\n.correction-attente-container[_ngcontent-%COMP%]   .header-section[_ngcontent-%COMP%]   .header-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n  align-items: center;\n}\n.correction-attente-container[_ngcontent-%COMP%]   .header-section[_ngcontent-%COMP%]   .header-actions[_ngcontent-%COMP%]   .search-input[_ngcontent-%COMP%] {\n  width: 300px;\n}\n.correction-attente-container[_ngcontent-%COMP%]   .loading-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 3rem;\n  gap: 1rem;\n}\n.correction-attente-container[_ngcontent-%COMP%]   .loading-container[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  font-size: 1.1rem;\n}\n.correction-attente-container[_ngcontent-%COMP%]   .error-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 3rem;\n  gap: 1rem;\n}\n.correction-attente-container[_ngcontent-%COMP%]   .error-container[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  color: var(--red-500);\n}\n.correction-attente-container[_ngcontent-%COMP%]   .error-container[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--text-color);\n  font-size: 1.1rem;\n  margin: 0.5rem 0;\n}\n.correction-attente-container[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%]   .table-caption[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0.5rem 0;\n}\n.correction-attente-container[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%]   .table-caption[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  font-weight: 500;\n}\n.correction-attente-container[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%]   .code-badge[_ngcontent-%COMP%] {\n  background: var(--primary-100);\n  color: var(--primary-700);\n  padding: 0.25rem 0.5rem;\n  border-radius: 4px;\n  font-weight: 600;\n  font-size: 0.875rem;\n  font-family: monospace;\n}\n.correction-attente-container[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%]   .client-info[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: block;\n  color: var(--text-color);\n  margin-bottom: 0.25rem;\n}\n.correction-attente-container[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%]   .client-info[_ngcontent-%COMP%]   .text-muted[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  font-size: 0.875rem;\n}\n.correction-attente-container[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%]   .id-info[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-weight: 500;\n  color: var(--text-color);\n}\n.correction-attente-container[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%]   .id-info[_ngcontent-%COMP%]   .text-muted[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  font-size: 0.75rem;\n  margin-top: 0.25rem;\n}\n.correction-attente-container[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%]   .phone-info[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--primary-color);\n  margin-right: 0.25rem;\n  font-size: 0.875rem;\n}\n.correction-attente-container[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%]   .phone-info[_ngcontent-%COMP%]   .text-muted[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  font-size: 0.875rem;\n  margin-top: 0.25rem;\n}\n.correction-attente-container[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%]   .agence-code[_ngcontent-%COMP%] {\n  background: var(--surface-100);\n  padding: 0.25rem 0.5rem;\n  border-radius: 4px;\n  font-weight: 500;\n  font-size: 0.875rem;\n}\n.correction-attente-container[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%]   .action-buttons[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.25rem;\n  justify-content: center;\n}\n.correction-attente-container[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%]   .action-buttons[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover {\n  transform: scale(1.1);\n  transition: transform 0.2s ease;\n}\n.correction-attente-container[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%]   .empty-message[_ngcontent-%COMP%] {\n  padding: 2rem;\n  text-align: center;\n}\n.correction-attente-container[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%]   .empty-message[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  margin-bottom: 1rem;\n}\n.correction-attente-container[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%]   .empty-message[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  font-size: 1.1rem;\n  margin: 0;\n}\n.correction-attente-container[_ngcontent-%COMP%]   .summary-section[_ngcontent-%COMP%] {\n  padding: 1rem 0;\n  border-top: 1px solid var(--surface-border);\n}\n.correction-attente-container[_ngcontent-%COMP%]   .summary-section[_ngcontent-%COMP%]   .summary-stats[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 2rem;\n  align-items: center;\n}\n.correction-attente-container[_ngcontent-%COMP%]   .summary-section[_ngcontent-%COMP%]   .summary-stats[_ngcontent-%COMP%]   .stat-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  color: var(--text-color-secondary);\n}\n.correction-attente-container[_ngcontent-%COMP%]   .summary-section[_ngcontent-%COMP%]   .summary-stats[_ngcontent-%COMP%]   .stat-item[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--primary-color);\n  font-size: 0.875rem;\n}\n.correction-attente-container[_ngcontent-%COMP%]   .summary-section[_ngcontent-%COMP%]   .summary-stats[_ngcontent-%COMP%]   .stat-item[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--text-color);\n  font-weight: 600;\n}\n@media (max-width: 768px) {\n  .correction-attente-container[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .correction-attente-container[_ngcontent-%COMP%]   .header-section[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 1rem;\n  }\n  .correction-attente-container[_ngcontent-%COMP%]   .header-section[_ngcontent-%COMP%]   .page-title[_ngcontent-%COMP%] {\n    font-size: 1.2rem;\n  }\n  .correction-attente-container[_ngcontent-%COMP%]   .header-section[_ngcontent-%COMP%]   .header-actions[_ngcontent-%COMP%] {\n    width: 100%;\n    justify-content: space-between;\n  }\n  .correction-attente-container[_ngcontent-%COMP%]   .header-section[_ngcontent-%COMP%]   .header-actions[_ngcontent-%COMP%]   .search-input[_ngcontent-%COMP%] {\n    width: 100%;\n    max-width: 250px;\n  }\n  .correction-attente-container[_ngcontent-%COMP%]   .summary-section[_ngcontent-%COMP%]   .summary-stats[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 0.5rem;\n    align-items: flex-start;\n  }\n}\n@media (prefers-color-scheme: dark) {\n  .correction-attente-container[_ngcontent-%COMP%]   .code-badge[_ngcontent-%COMP%] {\n    background: var(--primary-900);\n    color: var(--primary-100);\n  }\n  .correction-attente-container[_ngcontent-%COMP%]   .agence-code[_ngcontent-%COMP%] {\n    background: var(--surface-700);\n    color: var(--text-color);\n  }\n}\n@media print {\n  .correction-attente-container[_ngcontent-%COMP%]   .header-actions[_ngcontent-%COMP%], \n   .correction-attente-container[_ngcontent-%COMP%]   .action-buttons[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .correction-attente-container[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%] {\n    font-size: 0.875rem;\n  }\n}\n.inactive-agent-warning[_ngcontent-%COMP%] {\n  margin: 2rem;\n  background: #fee;\n  border: 2px solid #fcc;\n  border-radius: 8px;\n  padding: 2rem;\n}\n.inactive-agent-warning[_ngcontent-%COMP%]   .warning-content[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1.5rem;\n  align-items: flex-start;\n}\n.inactive-agent-warning[_ngcontent-%COMP%]   .warning-content[_ngcontent-%COMP%]   .warning-icon[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n}\n.inactive-agent-warning[_ngcontent-%COMP%]   .warning-content[_ngcontent-%COMP%]   .warning-icon[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 3.5rem;\n  color: #dc3545;\n}\n.inactive-agent-warning[_ngcontent-%COMP%]   .warning-content[_ngcontent-%COMP%]   .warning-details[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.inactive-agent-warning[_ngcontent-%COMP%]   .warning-content[_ngcontent-%COMP%]   .warning-details[_ngcontent-%COMP%]   .warning-title[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: #c82333;\n  margin: 0 0 1rem 0;\n}\n.inactive-agent-warning[_ngcontent-%COMP%]   .warning-content[_ngcontent-%COMP%]   .warning-details[_ngcontent-%COMP%]   .warning-messages[_ngcontent-%COMP%]   .primary-message[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  font-weight: 600;\n  color: #721c24;\n  margin-bottom: 0.75rem;\n}\n.inactive-agent-warning[_ngcontent-%COMP%]   .warning-content[_ngcontent-%COMP%]   .warning-details[_ngcontent-%COMP%]   .warning-messages[_ngcontent-%COMP%]   .secondary-message[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  color: #721c24;\n  margin-bottom: 1rem;\n  line-height: 1.6;\n}\n.inactive-agent-warning[_ngcontent-%COMP%]   .warning-content[_ngcontent-%COMP%]   .warning-details[_ngcontent-%COMP%]   .warning-messages[_ngcontent-%COMP%]   .action-steps[_ngcontent-%COMP%] {\n  background: white;\n  border: 1px solid #f5c6cb;\n  border-radius: 6px;\n  padding: 1rem;\n  margin: 1rem 0;\n}\n.inactive-agent-warning[_ngcontent-%COMP%]   .warning-content[_ngcontent-%COMP%]   .warning-details[_ngcontent-%COMP%]   .warning-messages[_ngcontent-%COMP%]   .action-steps[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  color: #721c24;\n  font-weight: 600;\n  margin: 0 0 0.75rem 0;\n}\n.inactive-agent-warning[_ngcontent-%COMP%]   .warning-content[_ngcontent-%COMP%]   .warning-details[_ngcontent-%COMP%]   .warning-messages[_ngcontent-%COMP%]   .action-steps[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  list-style: disc;\n  padding-left: 1.5rem;\n  margin: 0;\n}\n.inactive-agent-warning[_ngcontent-%COMP%]   .warning-content[_ngcontent-%COMP%]   .warning-details[_ngcontent-%COMP%]   .warning-messages[_ngcontent-%COMP%]   .action-steps[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  color: #721c24;\n  margin-bottom: 0.5rem;\n  line-height: 1.5;\n}\n.inactive-agent-warning[_ngcontent-%COMP%]   .warning-content[_ngcontent-%COMP%]   .warning-details[_ngcontent-%COMP%]   .warning-messages[_ngcontent-%COMP%]   .info-note[_ngcontent-%COMP%] {\n  background: #fff3cd;\n  border: 1px solid #ffc107;\n  border-radius: 6px;\n  padding: 0.75rem;\n  margin-top: 1rem;\n}\n.inactive-agent-warning[_ngcontent-%COMP%]   .warning-content[_ngcontent-%COMP%]   .warning-details[_ngcontent-%COMP%]   .warning-messages[_ngcontent-%COMP%]   .info-note[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #856404;\n  font-size: 0.9rem;\n}\n.inactive-agent-warning[_ngcontent-%COMP%]   .warning-content[_ngcontent-%COMP%]   .warning-details[_ngcontent-%COMP%]   .warning-messages[_ngcontent-%COMP%]   .info-note[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  margin-right: 0.5rem;\n  color: #ffc107;\n}\n.inactive-agent-warning[_ngcontent-%COMP%]   .warning-content[_ngcontent-%COMP%]   .warning-details[_ngcontent-%COMP%]   .warning-messages[_ngcontent-%COMP%]   .info-note[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #856404;\n}\n.inactive-agent-warning[_ngcontent-%COMP%]   .warning-content[_ngcontent-%COMP%]   .warning-details[_ngcontent-%COMP%]   .warning-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n  margin-top: 1.5rem;\n}\n/*# sourceMappingURL=correction-en-attente.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CorrectionEnAttenteComponent, { className: "CorrectionEnAttenteComponent", filePath: "src/app/pages/dashboard/agent-credit/correction-en-attente/correction-en-attente.component.ts", lineNumber: 57 });
})();
export {
  CorrectionEnAttenteComponent
};
//# sourceMappingURL=chunk-KSAPU4ZN.js.map
