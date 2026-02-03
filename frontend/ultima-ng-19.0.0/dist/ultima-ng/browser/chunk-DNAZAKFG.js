import {
  MessageModule
} from "./chunk-CSEZIGTY.js";
import {
  ProgressBar,
  ProgressBarModule
} from "./chunk-WQ2EPPBK.js";
import {
  DividerModule
} from "./chunk-VDET62CU.js";
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
  IconField,
  InputIcon
} from "./chunk-WIQZFAVH.js";
import "./chunk-CCBQFN2J.js";
import {
  Router
} from "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
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
import "./chunk-IVSL2HKS.js";
import "./chunk-E352KRZV.js";
import "./chunk-HHD4PK4J.js";
import {
  Badge,
  BadgeModule,
  ButtonDirective,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import "./chunk-AP3OAIHW.js";
import {
  PrimeTemplate
} from "./chunk-NQNBRQ7H.js";
import "./chunk-3HTR5OU7.js";
import {
  UserService
} from "./chunk-SQ5BRWVW.js";
import "./chunk-ZRELZ6R7.js";
import "./chunk-BMYIFZHZ.js";
import "./chunk-W3K3GK4Z.js";
import {
  CommonModule,
  CurrencyPipe,
  DatePipe
} from "./chunk-SQQPVFHK.js";
import {
  DestroyRef,
  catchError,
  inject,
  of,
  signal,
  switchMap,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵpipeBind4,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleMap,
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

// src/app/pages/dashboard/credit/individuel/attente/attente.component.ts
var _c0 = () => [10, 25, 50];
var _c1 = () => ["nom", "prenom", "numeroMembre", "typeActivite", "telephone", "montantDemande"];
var _c2 = () => ({ "height": "6px" });
function AttenteComponent_ng_template_3_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 16);
    \u0275\u0275listener("click", function AttenteComponent_ng_template_3_Conditional_3_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.clearFilters());
    });
    \u0275\u0275elementEnd();
  }
}
function AttenteComponent_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 9)(1, "div", 10)(2, "button", 11);
    \u0275\u0275listener("click", function AttenteComponent_ng_template_3_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.refreshData());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, AttenteComponent_ng_template_3_Conditional_3_Template, 1, 0, "button", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p-icon-field", 13);
    \u0275\u0275element(5, "p-inputicon", 14);
    \u0275\u0275elementStart(6, "input", 15);
    \u0275\u0275listener("input", function AttenteComponent_ng_template_3_Template_input_input_6_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      const dt_r4 = \u0275\u0275reference(2);
      return \u0275\u0275resetView(ctx_r1.onGlobalFilter(dt_r4, $event));
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.state().agenceId || ctx_r1.state().pointVenteId ? 3 : -1);
  }
}
function AttenteComponent_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 17);
    \u0275\u0275text(2, " ID ");
    \u0275\u0275element(3, "p-sortIcon", 18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "th", 19);
    \u0275\u0275text(5, " Demandeur ");
    \u0275\u0275element(6, "p-sortIcon", 20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 21);
    \u0275\u0275text(8, " N\xB0 Membre ");
    \u0275\u0275element(9, "p-sortIcon", 22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 23);
    \u0275\u0275text(11, " Montant ");
    \u0275\u0275element(12, "p-sortIcon", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th", 25);
    \u0275\u0275text(14, " Activit\xE9 ");
    \u0275\u0275element(15, "p-sortIcon", 26);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 27);
    \u0275\u0275text(17, " Garanties ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "th", 28);
    \u0275\u0275text(19, " Dur\xE9e ");
    \u0275\u0275element(20, "p-sortIcon", 29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "th", 30);
    \u0275\u0275text(22, " Statut ");
    \u0275\u0275element(23, "p-sortIcon", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "th", 32);
    \u0275\u0275text(25, " Date ");
    \u0275\u0275element(26, "p-sortIcon", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "th", 34);
    \u0275\u0275text(28, "Actions");
    \u0275\u0275elementEnd()();
  }
}
function AttenteComponent_ng_template_5_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 38);
    \u0275\u0275element(1, "i", 49);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const demande_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", demande_r6.addresseDomicileContact, " ");
  }
}
function AttenteComponent_ng_template_5_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 38);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "currency");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const demande_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \xC9ch\xE9ance: ", \u0275\u0275pipeBind4(2, 1, demande_r6.echeance, "GNF", "symbol", "1.0-0"), " ");
  }
}
function AttenteComponent_ng_template_5_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 38);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const demande_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(demande_r6.sousActivite);
  }
}
function AttenteComponent_ng_template_5_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 41);
    \u0275\u0275element(1, "i", 50);
    \u0275\u0275text(2, "Description ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const demande_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("pTooltip", demande_r6.descriptionActivite);
  }
}
function AttenteComponent_ng_template_5_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 43);
    \u0275\u0275element(1, "p-badge", 51);
    \u0275\u0275elementStart(2, "small", 38);
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "currency");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const demande_r6 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("value", demande_r6.garanties.length.toString())("pTooltip", ctx_r1.getGarantiesTooltip(demande_r6.garanties));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind4(4, 3, ctx_r1.getTotalGaranties(demande_r6.garanties), "GNF", "symbol", "1.0-0"), " ");
  }
}
function AttenteComponent_ng_template_5_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-badge", 44);
  }
}
function AttenteComponent_ng_template_5_Conditional_31_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 38);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const demande_r6 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatPeriodicite(demande_r6.periodiciteRemboursement), " ");
  }
}
function AttenteComponent_ng_template_5_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 43)(1, "span", 37);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, AttenteComponent_ng_template_5_Conditional_31_Conditional_3_Template, 2, 1, "small", 38);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const demande_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", demande_r6.dureeDemande, " mois");
    \u0275\u0275advance();
    \u0275\u0275conditional(demande_r6.periodiciteRemboursement ? 3 : -1);
  }
}
function AttenteComponent_ng_template_5_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "-");
    \u0275\u0275elementEnd();
  }
}
function AttenteComponent_ng_template_5_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275element(1, "p-tag", 52);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const demande_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("value", demande_r6.statutCredit);
  }
}
function AttenteComponent_ng_template_5_Conditional_48_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 53);
    \u0275\u0275listener("click", function AttenteComponent_ng_template_5_Conditional_48_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const demande_r6 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.viewDetailDemandeAttente(demande_r6.demandeIndividuelId || demande_r6.demandeindividuel_id));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const demande_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("pTooltip", "Voir " + demande_r6.garanties.length + " garantie(s)");
  }
}
function AttenteComponent_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "span", 35);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td")(5, "div", 36)(6, "span", 37);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "small", 38);
    \u0275\u0275element(9, "i", 39);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275template(11, AttenteComponent_ng_template_5_Conditional_11_Template, 3, 1, "small", 38);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "td")(13, "span", 40);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "td")(16, "div", 36)(17, "span", 35);
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275template(20, AttenteComponent_ng_template_5_Conditional_20_Template, 3, 6, "small", 38);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "td")(22, "div", 36)(23, "span");
    \u0275\u0275text(24);
    \u0275\u0275elementEnd();
    \u0275\u0275template(25, AttenteComponent_ng_template_5_Conditional_25_Template, 2, 1, "small", 38)(26, AttenteComponent_ng_template_5_Conditional_26_Template, 3, 1, "small", 41);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "td", 42);
    \u0275\u0275template(28, AttenteComponent_ng_template_5_Conditional_28_Template, 5, 8, "div", 43)(29, AttenteComponent_ng_template_5_Conditional_29_Template, 1, 0, "p-badge", 44);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "td", 42);
    \u0275\u0275template(31, AttenteComponent_ng_template_5_Conditional_31_Template, 4, 2, "div", 43)(32, AttenteComponent_ng_template_5_Conditional_32_Template, 2, 0, "span");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "td")(34, "div", 36);
    \u0275\u0275element(35, "p-tag", 45);
    \u0275\u0275template(36, AttenteComponent_ng_template_5_Conditional_36_Template, 2, 1, "small");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(37, "td")(38, "div", 36)(39, "span");
    \u0275\u0275text(40);
    \u0275\u0275pipe(41, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "small", 38);
    \u0275\u0275text(43);
    \u0275\u0275pipe(44, "date");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(45, "td")(46, "div", 46)(47, "button", 47);
    \u0275\u0275listener("click", function AttenteComponent_ng_template_5_Template_button_click_47_listener() {
      const demande_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.viewDetailDemandeAttente(demande_r6.demandeIndividuelId || demande_r6.demandeindividuel_id));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(48, AttenteComponent_ng_template_5_Conditional_48_Template, 1, 1, "button", 48);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const demande_r6 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" #", demande_r6.demandeIndividuelId || demande_r6.demandeindividuel_id, " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2(" ", demande_r6.prenom, " ", demande_r6.nom, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", demande_r6.telephone, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(demande_r6.addresseDomicileContact ? 11 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(demande_r6.numeroMembre);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind4(19, 19, demande_r6.montantDemande || demande_r6.montant, "GNF", "symbol", "1.0-0"), " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(demande_r6.echeance ? 20 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(demande_r6.typeActivite || demande_r6.activite);
    \u0275\u0275advance();
    \u0275\u0275conditional(demande_r6.sousActivite ? 25 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(demande_r6.descriptionActivite ? 26 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(demande_r6.garanties && demande_r6.garanties.length > 0 ? 28 : 29);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(demande_r6.dureeDemande ? 31 : 32);
    \u0275\u0275advance(4);
    \u0275\u0275property("value", ctx_r1.getStatusLabel(demande_r6.statutDemande, demande_r6.validationState))("severity", ctx_r1.getStatusSeverity(demande_r6.statutDemande, demande_r6.validationState));
    \u0275\u0275advance();
    \u0275\u0275conditional(demande_r6.statutCredit ? 36 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(41, 24, demande_r6.createdAt, "dd/MM/yyyy"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(44, 27, demande_r6.createdAt, "HH:mm"), " ");
    \u0275\u0275advance(5);
    \u0275\u0275conditional(demande_r6.garanties && demande_r6.garanties.length > 0 ? 48 : -1);
  }
}
function AttenteComponent_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 54)(2, "div", 55);
    \u0275\u0275element(3, "i", 56);
    \u0275\u0275elementStart(4, "h3", 57);
    \u0275\u0275text(5, "Aucune demande en attente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 38);
    \u0275\u0275text(7, "Les nouvelles demandes appara\xEEtront ici");
    \u0275\u0275elementEnd()()()();
  }
}
function AttenteComponent_Conditional_7_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 54);
    \u0275\u0275element(2, "p-progressBar", 58);
    \u0275\u0275elementStart(3, "p", 59);
    \u0275\u0275text(4, "Chargement des demandes...");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(2, _c2));
  }
}
function AttenteComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, AttenteComponent_Conditional_7_ng_template_0_Template, 5, 3, "ng-template", 7);
  }
}
function AttenteComponent_ng_template_8_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 62)(1, "strong");
    \u0275\u0275text(2, "Montant total:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 62)(6, "strong");
    \u0275\u0275text(7, "Total garanties:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "currency");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind4(4, 2, ctx_r1.calculateTotalMontant(), "GNF", "symbol", "1.0-0"), " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind4(9, 7, ctx_r1.calculateTotalAllGaranties(), "GNF", "symbol", "1.0-0"), " ");
  }
}
function AttenteComponent_ng_template_8_Conditional_7_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 64);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("| ", ctx_r1.getUserAgenceName(), "");
  }
}
function AttenteComponent_ng_template_8_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 62);
    \u0275\u0275element(1, "i", 63);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, AttenteComponent_ng_template_8_Conditional_7_Conditional_4_Template, 2, 1, "span", 64);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.getUserName());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.getUserAgenceName() !== "N/A" ? 4 : -1);
  }
}
function AttenteComponent_ng_template_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 60)(1, "div", 61)(2, "span", 62)(3, "strong");
    \u0275\u0275text(4, "Total demandes:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, AttenteComponent_ng_template_8_Conditional_6_Template, 10, 12);
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, AttenteComponent_ng_template_8_Conditional_7_Template, 5, 2, "div", 62);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ((tmp_2_0 = ctx_r1.state().demandeAttentes) == null ? null : tmp_2_0.length) || 0, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.state().demandeAttentes && ctx_r1.state().demandeAttentes.length > 0 ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.state().userInfo ? 7 : -1);
  }
}
var AttenteComponent = class _AttenteComponent {
  // État du composant
  state = signal({
    loading: false,
    message: void 0,
    error: void 0
  });
  // Propriété séparée pour les lignes expandées (compatible avec PrimeNG)
  expandedRows = {};
  userService = inject(UserService);
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  ngOnInit() {
    this.loadUserInfoAndDemandes();
  }
  // Méthodes pour gérer l'expansion des lignes
  onRowExpand(event) {
    console.log("Ligne expand\xE9e:", event.data);
  }
  onRowCollapse(event) {
    console.log("Ligne collaps\xE9e:", event.data);
  }
  // Méthode pour gérer l'expansion des lignes manuellement
  toggleRowManual(demande) {
    const key = demande.demandeindividuel_id || demande.demandeIndividuelId;
    if (!key) {
      console.error("Pas d'ID trouv\xE9 pour la demande:", demande);
      return;
    }
    if (this.expandedRows[key]) {
      delete this.expandedRows[key];
    } else {
      this.expandedRows[key] = true;
    }
    this.expandedRows = __spreadValues({}, this.expandedRows);
    console.log("Expanded rows apr\xE8s toggle:", this.expandedRows);
  }
  loadUserInfoAndDemandes() {
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { loading: true }));
    this.userService.getInstanceUser$().pipe(takeUntilDestroyed(this.destroyRef), switchMap((userResponse) => {
      console.log("Informations utilisateur r\xE9cup\xE9r\xE9es:", userResponse);
      if (userResponse.data && userResponse.data.user) {
        const user = userResponse.data.user;
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          userInfo: user,
          agenceId: user.agenceId || user.agenceId,
          pointVenteId: user.pointventeId || user.pointventeId
        }));
        localStorage.setItem("userInfo", JSON.stringify(user));
      }
      const { agenceId, pointVenteId } = this.state();
      if (agenceId || pointVenteId) {
        return this.userService.getAllDemandesWithGaranties$(agenceId, pointVenteId);
      } else {
        return this.userService.getAllDemandeAttente$();
      }
    }), catchError((error) => {
      console.error("Erreur lors du chargement:", error);
      if (error.message && error.message.includes("instanceUser")) {
        console.log("Erreur avec getInstanceUser, chargement direct des demandes...");
        return this.userService.getAllDemandeAttente$();
      }
      if (error.includes && error.includes("Au moins un des param\xE8tres")) {
        console.log("Param\xE8tres manquants, utilisation de la m\xE9thode classique...");
        return this.userService.getAllDemandeAttente$();
      }
      return of({ data: { demandes: [] }, message: "Erreur lors du chargement" });
    })).subscribe({
      next: (response) => {
        console.log("Demandes charg\xE9es:", response);
        let demandes = response.data?.demandeAttentes || response.data?.demandes || [];
        demandes = this.normalizeDemandesIds(demandes);
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          demandeAttentes: demandes,
          loading: false,
          message: response.message,
          error: void 0
        }));
      },
      error: (error) => {
        console.error("Erreur finale:", error);
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          loading: false,
          message: void 0,
          error: error.message || error || "Une erreur est survenue"
        }));
      }
    });
  }
  // Méthode pour normaliser les IDs des demandes
  normalizeDemandesIds(demandes) {
    return demandes.map((demande) => {
      if (!demande.demandeindividuel_id && demande.demandeIndividuelId) {
        demande.demandeindividuel_id = demande.demandeIndividuelId;
      }
      if (!demande.demandeIndividuelId && demande.demandeindividuel_id) {
        demande.demandeIndividuelId = demande.demandeindividuel_id;
      }
      return demande;
    });
  }
  loadAllDemandesWithGaranties() {
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { loading: true, error: void 0 }));
    const agenceId = this.state().agenceId;
    const pointVenteId = this.state().pointVenteId;
    this.userService.getAllDemandesWithGaranties$(agenceId, pointVenteId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        console.log("Demandes avec garanties charg\xE9es:", response);
        let demandes = response.data.demandeAttentes || [];
        demandes = this.normalizeDemandesIds(demandes);
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          demandeAttentes: demandes,
          loading: false,
          message: response.message,
          error: void 0
        }));
      },
      error: (error) => {
        console.error("Erreur lors du chargement des demandes avec garanties:", error);
        if (error.includes && error.includes("Au moins un des param\xE8tres")) {
          console.log("Tentative avec l'ancienne m\xE9thode...");
          this.loadAllDemandeAttente();
        } else {
          this.state.update((state) => __spreadProps(__spreadValues({}, state), {
            loading: false,
            message: void 0,
            error
          }));
        }
      }
    });
  }
  // Méthode de fallback utilisant l'ancien endpoint
  loadAllDemandeAttente() {
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { loading: true, error: void 0 }));
    this.userService.getAllDemandeAttente$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        console.log("Demandes charg\xE9es (m\xE9thode classique):", response);
        let demandes = response.data.demandeAttentes || [];
        demandes = this.normalizeDemandesIds(demandes);
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          demandeAttentes: demandes,
          loading: false,
          message: response.message,
          error: void 0
        }));
      },
      error: (error) => {
        console.error("Erreur lors du chargement des demandes:", error);
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          loading: false,
          message: void 0,
          error
        }));
      }
    });
  }
  onGlobalFilter(table, event) {
    table.filterGlobal(event.target.value, "contains");
  }
  getStatusLabel(statutDemande, validationState) {
    if (statutDemande === "EN_ATTENTE" && validationState === "NOUVEAU") {
      return "NOUVELLE DEMANDE";
    } else if (statutDemande === "EN_ATTENTE" && validationState === "SELECTION") {
      return "SELECTION";
    } else if (statutDemande === "EN_ATTENTE" && validationState === "APPROVED") {
      return "APPROUV\xC9E";
    }
    return statutDemande;
  }
  getStateValidation(statutDemande, validationState) {
    if (statutDemande === "EN_ATTENTE" && validationState === "NOUVEAU") {
      return "EN ATTENTE POUR LA SELECTION";
    } else if (statutDemande === "EN_ATTENTE" && validationState === "SELECTION") {
      return "EN ATTENTE POUR LA VALIDATION";
    } else if (statutDemande === "EN_ATTENTE" && validationState === "APPROVED") {
      return "DEMANDE APPROUV\xC9E PAR L'AGENT";
    }
    return validationState;
  }
  getStatusSeverity(statutDemande, validationState) {
    if (validationState === "APPROVED")
      return "success";
    if (statutDemande === "EN_ATTENTE")
      return "info";
    if (statutDemande === "REJECTED" || validationState === "REJECTED")
      return "danger";
    if (validationState === "SELECTION")
      return "warn";
    return "secondary";
  }
  viewDetailDemandeAttente(demandeindividuel_id) {
    this.router.navigate(["/dashboards/credit/individuel/attente/detail/", demandeindividuel_id]);
  }
  // Calculer le total des garanties
  getTotalGaranties(garanties) {
    if (!garanties || garanties.length === 0)
      return 0;
    return garanties.reduce((total, g) => total + (g.valeurGarantie || 0), 0);
  }
  // Calculer le total empruntable
  getTotalEmprunte(garanties) {
    if (!garanties || garanties.length === 0)
      return 0;
    return garanties.reduce((total, g) => total + (g.valeurEmprunte || 0), 0);
  }
  // Obtenir la couleur du badge selon le type de garantie
  getGarantieSeverity(typeGarantie) {
    const severityMap = {
      "Caution Solidaire": "success",
      "Depot a terme": "info",
      "Surete Reelles": "warn",
      "Autre Garantie": "secondary",
      Mat\u00E9riel: "info",
      Immobilier: "success",
      Caution: "warn"
    };
    return severityMap[typeGarantie] || "secondary";
  }
  // Formater la périodicité
  formatPeriodicite(periodicite) {
    const formatMap = {
      Mensuelle: "Mensuel",
      Bimestrielle: "2 mois",
      Trimestrielle: "3 mois",
      Quatrimestrielle: "4 mois",
      Semestrielle: "6 mois",
      Annuelle: "Annuel"
    };
    return formatMap[periodicite] || periodicite;
  }
  // Rafraîchir les données
  refreshData() {
    this.expandedRows = {};
    this.loadUserInfoAndDemandes();
  }
  // Filtrer par agence
  filterByAgence(agenceId) {
    this.expandedRows = {};
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { agenceId, pointVenteId: void 0 }));
    this.loadAllDemandesWithGaranties();
  }
  // Filtrer par point de vente
  filterByPointVente(pointVenteId) {
    this.expandedRows = {};
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { pointVenteId, agenceId: void 0 }));
    this.loadAllDemandesWithGaranties();
  }
  // Réinitialiser les filtres et charger toutes les données
  clearFilters() {
    this.expandedRows = {};
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { agenceId: void 0, pointVenteId: void 0 }));
    this.loadAllDemandeAttente();
  }
  // Méthode pour définir manuellement l'agence (peut être appelée depuis l'extérieur)
  setAgence(agenceId) {
    this.expandedRows = {};
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { agenceId, pointVenteId: void 0 }));
    this.loadAllDemandesWithGaranties();
  }
  // Méthode pour définir manuellement le point de vente
  setPointVente(pointVenteId) {
    this.expandedRows = {};
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { pointVenteId, agenceId: void 0 }));
    this.loadAllDemandesWithGaranties();
  }
  // Obtenir le nombre de garanties
  getNombreGaranties(demande) {
    return demande.garanties ? demande.garanties.length : 0;
  }
  // Vérifier si la demande a des garanties
  hasGaranties(demande) {
    return demande.garanties && demande.garanties.length > 0;
  }
  // Formater le montant de la demande
  formatMontant(montant) {
    if (!montant)
      return "0 GNF";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "GNF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(montant);
  }
  // Obtenir les informations de l'utilisateur
  getUserRole() {
    return this.state().userInfo?.role || "N/A";
  }
  getUserName() {
    const user = this.state().userInfo;
    if (user) {
      return user.name || user.nom || user.username || "Utilisateur";
    }
    return "Utilisateur";
  }
  getUserAgenceName() {
    return this.state().userInfo?.agenceName || this.state().userInfo?.agence_name || "N/A";
  }
  getUserPointVenteName() {
    return this.state().userInfo?.pointVenteName || this.state().userInfo?.point_vente_name || "N/A";
  }
  /**
   * Obtenir un tooltip avec le détail des garanties
   */
  getGarantiesTooltip(garanties) {
    if (!garanties || garanties.length === 0)
      return "Aucune garantie";
    return garanties.map((g) => `${g.typeGarantie}: ${this.formatMontant(g.valeurGarantie)}`).join(" | ");
  }
  /**
   * Calculer le montant total de toutes les demandes
   */
  calculateTotalMontant() {
    const demandes = this.state().demandeAttentes;
    if (!demandes || demandes.length === 0)
      return 0;
    return demandes.reduce((total, d) => total + (d.montantDemande || 0), 0);
  }
  /**
   * Calculer le total de toutes les garanties de toutes les demandes
   */
  calculateTotalAllGaranties() {
    const demandes = this.state().demandeAttentes;
    if (!demandes || demandes.length === 0)
      return 0;
    return demandes.reduce((total, d) => {
      if (d.garanties && d.garanties.length > 0) {
        return total + d.garanties.reduce((sum, g) => sum + (g.valeurGarantie || 0), 0);
      }
      return total;
    }, 0);
  }
  static \u0275fac = function AttenteComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AttenteComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AttenteComponent, selectors: [["app-attente"]], decls: 9, vars: 9, consts: [["dt", ""], [1, "card"], ["paginatorDropdownAppendTo", "body", "responsiveLayout", "scroll", "currentPageReportTemplate", "Affichage de {first} \xE0 {last} sur {totalRecords} entr\xE9es", 3, "value", "paginator", "rows", "showCurrentPageReport", "rowsPerPageOptions", "globalFilterFields"], ["pTemplate", "caption"], ["pTemplate", "header"], ["pTemplate", "body"], ["pTemplate", "emptymessage"], ["pTemplate", "loading"], ["pTemplate", "summary"], [1, "flex", "flex-wrap", "gap-2", "items-center", "justify-between"], [1, "flex", "gap-2"], ["pButton", "", "icon", "pi pi-refresh", "pTooltip", "Rafra\xEEchir les donn\xE9es", 1, "p-button-outlined", "p-button-sm", 3, "click"], ["pButton", "", "icon", "pi pi-filter-slash", "label", "R\xE9initialiser filtres", 1, "p-button-text", "p-button-sm"], [1, "w-full", "sm:w-80", "order-1", "sm:order-none"], [1, "pi", "pi-search"], ["pInputText", "", "type", "text", "placeholder", "Recherche globale...", 1, "w-full", 3, "input"], ["pButton", "", "icon", "pi pi-filter-slash", "label", "R\xE9initialiser filtres", 1, "p-button-text", "p-button-sm", 3, "click"], ["pSortableColumn", "demandeIndividuelId", 2, "width", "5%"], ["field", "demandeIndividuelId"], ["pSortableColumn", "nom", 2, "width", "20%"], ["field", "nom"], ["pSortableColumn", "numeroMembre", 2, "width", "10%"], ["field", "numeroMembre"], ["pSortableColumn", "montantDemande", 2, "width", "12%"], ["field", "montantDemande"], ["pSortableColumn", "typeActivite", 2, "width", "15%"], ["field", "typeActivite"], [2, "width", "8%"], ["pSortableColumn", "dureeDemande", 2, "width", "8%"], ["field", "dureeDemande"], ["pSortableColumn", "statutDemande", 2, "width", "12%"], ["field", "statutDemande"], ["pSortableColumn", "createdAt", 2, "width", "10%"], ["field", "createdAt"], [2, "width", "10%"], [1, "font-bold", "text-primary"], [1, "flex", "flex-column", "gap-1"], [1, "font-semibold"], [1, "text-gray-500"], [1, "pi", "pi-phone", "mr-1"], [1, "font-medium"], [1, "text-gray-500", 3, "pTooltip"], [1, "text-center"], [1, "flex", "flex-column", "align-items-center", "gap-1"], ["value", "0", "severity", "secondary"], [3, "value", "severity"], [1, "flex", "gap-2", "justify-center"], ["pButton", "", "icon", "pi pi-eye", "pTooltip", "Voir d\xE9tails complets", 1, "p-button-rounded", "p-button-text", "p-button-sm", 3, "click"], ["pButton", "", "icon", "pi pi-shield", 1, "p-button-rounded", "p-button-text", "p-button-sm", "p-button-success", 3, "pTooltip"], [1, "pi", "pi-map-marker", "mr-1"], [1, "pi", "pi-info-circle", "mr-1"], ["severity", "info", 3, "value", "pTooltip"], ["severity", "secondary", "styleClass", "text-xs", 3, "value"], ["pButton", "", "icon", "pi pi-shield", 1, "p-button-rounded", "p-button-text", "p-button-sm", "p-button-success", 3, "click", "pTooltip"], ["colspan", "10", 1, "text-center", "p-4"], [1, "flex", "flex-column", "align-items-center", "gap-3"], [1, "pi", "pi-inbox", "text-5xl", "text-gray-400"], [1, "text-xl", "font-semibold", "text-gray-600"], ["mode", "indeterminate"], [1, "mt-2"], [1, "flex", "align-items-center", "justify-between", "p-3", "border-top-1", "surface-border"], [1, "flex", "gap-4"], [1, "text-gray-600"], [1, "pi", "pi-user", "mr-2"], [1, "ml-2"]], template: function AttenteComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 1)(1, "p-table", 2, 0);
      \u0275\u0275template(3, AttenteComponent_ng_template_3_Template, 7, 1, "ng-template", 3)(4, AttenteComponent_ng_template_4_Template, 29, 0, "ng-template", 4)(5, AttenteComponent_ng_template_5_Template, 49, 30, "ng-template", 5)(6, AttenteComponent_ng_template_6_Template, 8, 0, "ng-template", 6)(7, AttenteComponent_Conditional_7_Template, 1, 0, null, 7)(8, AttenteComponent_ng_template_8_Template, 8, 3, "ng-template", 8);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275property("value", ctx.state().demandeAttentes)("paginator", true)("rows", 10)("showCurrentPageReport", true)("rowsPerPageOptions", \u0275\u0275pureFunction0(7, _c0))("globalFilterFields", \u0275\u0275pureFunction0(8, _c1));
      \u0275\u0275advance(6);
      \u0275\u0275conditional(ctx.state().loading ? 7 : -1);
    }
  }, dependencies: [CommonModule, CurrencyPipe, DatePipe, TableModule, Table, PrimeTemplate, SortableColumn, SortIcon, InputTextModule, InputText, ProgressBarModule, ProgressBar, ButtonModule, ButtonDirective, IconField, InputIcon, TagModule, Tag, MessageModule, CardModule, DividerModule, BadgeModule, Badge, TooltipModule, Tooltip], styles: ["\n\n.garantie-item[_ngcontent-%COMP%] {\n  transition: all 0.3s ease;\n  border: 1px solid var(--surface-border);\n}\n.garantie-item[_ngcontent-%COMP%]:hover {\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n  transform: translateY(-2px);\n}\n.totaux-garanties[_ngcontent-%COMP%] {\n  border: 2px solid var(--primary-color);\n  background:\n    linear-gradient(\n      to right,\n      var(--surface-50),\n      var(--surface-100));\n}\n.field-group[_ngcontent-%COMP%]   .mb-2[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n}\n.field-group[_ngcontent-%COMP%]   .mb-2[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  min-width: 180px;\n  color: var(--text-color-secondary);\n}\n.field-group[_ngcontent-%COMP%]   .mb-2[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: var(--text-color);\n}\n  .p-datatable .p-datatable-tbody tr.p-row-expansion {\n  animation: _ngcontent-%COMP%_slideDown 0.3s ease-out;\n}\n  .p-datatable .p-datatable-row-expansion {\n  background: var(--surface-ground) !important;\n}\n  .p-badge {\n  font-size: 0.9rem;\n  min-width: 1.5rem;\n  height: 1.5rem;\n  line-height: 1.5rem;\n}\n  .p-tag {\n  font-weight: 600;\n  padding: 0.25rem 0.75rem;\n}\n@keyframes _ngcontent-%COMP%_slideDown {\n  from {\n    opacity: 0;\n    max-height: 0;\n  }\n  to {\n    opacity: 1;\n    max-height: 1000px;\n  }\n}\n@media screen and (max-width: 768px) {\n  .field-group[_ngcontent-%COMP%]   .mb-2[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .field-group[_ngcontent-%COMP%]   .mb-2[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n    min-width: auto;\n    margin-bottom: 0.25rem;\n  }\n}\n.status-badge.status-approved[_ngcontent-%COMP%] {\n  background-color: var(--green-500);\n  color: white;\n}\n.status-badge.status-pending[_ngcontent-%COMP%] {\n  background-color: var(--blue-500);\n  color: white;\n}\n.status-badge.status-rejected[_ngcontent-%COMP%] {\n  background-color: var(--red-500);\n  color: white;\n}\n  .p-datatable .p-datatable-header {\n  background: var(--surface-card);\n  border: none;\n  padding: 1rem;\n}\n  .p-datatable .p-datatable-thead > tr > th {\n  background: var(--surface-50);\n  color: var(--text-color);\n  font-weight: 600;\n  border-color: var(--surface-border);\n}\n  .p-datatable .p-datatable-tbody > tr {\n  transition: all 0.2s;\n}\n  .p-datatable .p-datatable-tbody > tr:hover {\n  background: var(--surface-50) !important;\n}\n  .p-datatable .p-datatable-tbody > tr > td {\n  border-color: var(--surface-border);\n}\n  .p-datatable .p-row-toggler {\n  width: 2rem;\n  height: 2rem;\n  border-radius: 50%;\n  transition: all 0.2s;\n}\n  .p-datatable .p-row-toggler:hover {\n  background: var(--primary-color);\n  color: white;\n}\n  .p-card {\n  box-shadow: none;\n  border: 1px solid var(--surface-border);\n}\n  .p-card .p-card-body {\n  padding: 1.5rem;\n}\n  .p-card h5 {\n  color: var(--primary-color);\n  margin-bottom: 1rem;\n  display: flex;\n  align-items: center;\n}\n  .p-card h5 i {\n  font-size: 1.2rem;\n}\n.loading-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  min-height: 400px;\n}\n.loading-container[_ngcontent-%COMP%]   .pi-spin[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  color: var(--primary-color);\n}\n/*# sourceMappingURL=attente.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AttenteComponent, { className: "AttenteComponent", filePath: "src/app/pages/dashboard/credit/individuel/attente/attente.component.ts", lineNumber: 29 });
})();
export {
  AttenteComponent
};
//# sourceMappingURL=chunk-DNAZAKFG.js.map
