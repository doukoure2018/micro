import {
  FloatLabelModule
} from "./chunk-3BFG6HRY.js";
import {
  JavaDatePipe
} from "./chunk-O2RK2BKY.js";
import {
  Steps,
  StepsModule
} from "./chunk-M4IO5JIC.js";
import {
  MessagesModule
} from "./chunk-MWCM7PKA.js";
import {
  Message,
  MessageModule
} from "./chunk-CSEZIGTY.js";
import {
  Toast,
  ToastModule
} from "./chunk-6SRYYUT2.js";
import {
  Divider,
  DividerModule
} from "./chunk-VDET62CU.js";
import {
  Tag,
  TagModule
} from "./chunk-MYUKI7DG.js";
import {
  Card,
  CardModule
} from "./chunk-H46GQ57A.js";
import {
  InputNumber,
  InputNumberModule
} from "./chunk-JGOABXTK.js";
import {
  ProgressSpinner,
  ProgressSpinnerModule
} from "./chunk-Y2J5OGKB.js";
import {
  Router
} from "./chunk-BTKK64MU.js";
import {
  InputText,
  InputTextModule
} from "./chunk-FZELBHWZ.js";
import {
  TooltipModule
} from "./chunk-4IUQ6KTI.js";
import {
  Button,
  ButtonDirective,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import {
  MessageService
} from "./chunk-NQNBRQ7H.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  FormsModule,
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
import {
  CommonModule,
  DecimalPipe,
  NgClass
} from "./chunk-SQQPVFHK.js";
import {
  ChangeDetectorRef,
  computed,
  inject,
  signal,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
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
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleMap,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-ZKKMBKIA.js";

// src/app/pages/dashboard/admin/demande-avance-salaire/demande-avance-salaire.component.ts
var _c0 = () => ({ width: "50px", height: "50px" });
var _c1 = () => ({ width: "40px", height: "40px" });
var _c2 = () => ({ width: "100%" });
var _forTrack0 = ($index, $item) => $item.id;
function DemandeAvanceSalaireComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "p-card")(2, "div", 3);
    \u0275\u0275element(3, "p-progressSpinner");
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5, "V\xE9rification de la disponibilit\xE9 du service...");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(2, _c0));
  }
}
function DemandeAvanceSalaireComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1)(1, "p-card")(2, "div", 4)(3, "div", 5);
    \u0275\u0275element(4, "i", 6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "h2");
    \u0275\u0275text(6, "Service temporairement indisponible");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 7);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 8);
    \u0275\u0275element(10, "i", 9);
    \u0275\u0275elementStart(11, "div")(12, "strong");
    \u0275\u0275text(13, "Pourquoi ce message ?");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "p");
    \u0275\u0275text(15, "Les demandes d'avance sur salaire sont ouvertes apr\xE8s l'import du fichier de paie mensuel par le service RH. Veuillez patienter ou contacter la DRH pour plus d'informations.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(16, "div", 10)(17, "p-button", 11);
    \u0275\u0275listener("onClick", function DemandeAvanceSalaireComponent_Conditional_2_Template_p_button_onClick_17_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.checkAuthorization());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "p-button", 12);
    \u0275\u0275listener("onClick", function DemandeAvanceSalaireComponent_Conditional_2_Template_p_button_onClick_18_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.goToMesDemandes());
    });
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r1.authorizationMessage());
    \u0275\u0275advance(9);
    \u0275\u0275property("outlined", true)("loading", ctx_r1.isCheckingAuthorization());
  }
}
function DemandeAvanceSalaireComponent_Conditional_3_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-card")(1, "div", 17);
    \u0275\u0275element(2, "p-progressSpinner");
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "Chargement de vos informations...");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(2, _c1));
  }
}
function DemandeAvanceSalaireComponent_Conditional_3_Conditional_8_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 28);
    \u0275\u0275text(1, "Le matricule est obligatoire");
    \u0275\u0275elementEnd();
  }
}
function DemandeAvanceSalaireComponent_Conditional_3_Conditional_8_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 29);
    \u0275\u0275element(1, "p-message", 33);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("text", ctx_r1.matriculeSearchError());
  }
}
function DemandeAvanceSalaireComponent_Conditional_3_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-card", 16)(1, "div", 18)(2, "div", 19);
    \u0275\u0275element(3, "i", 9);
    \u0275\u0275elementStart(4, "div")(5, "strong");
    \u0275\u0275text(6, "Matricule non associ\xE9 \xE0 votre compte");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p");
    \u0275\u0275text(8, "Votre compte utilisateur n'a pas de matricule associ\xE9. Veuillez saisir votre matricule pour continuer.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "form", 20);
    \u0275\u0275listener("ngSubmit", function DemandeAvanceSalaireComponent_Conditional_3_Conditional_8_Template_form_ngSubmit_9_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.searchMatricule());
    });
    \u0275\u0275elementStart(10, "div", 21)(11, "label", 22);
    \u0275\u0275text(12, "Votre matricule *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 23)(14, "span", 24);
    \u0275\u0275element(15, "i", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275element(16, "input", 26)(17, "button", 27);
    \u0275\u0275elementEnd();
    \u0275\u0275template(18, DemandeAvanceSalaireComponent_Conditional_3_Conditional_8_Conditional_18_Template, 2, 0, "small", 28);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(19, DemandeAvanceSalaireComponent_Conditional_3_Conditional_8_Conditional_19_Template, 2, 1, "div", 29);
    \u0275\u0275element(20, "p-divider");
    \u0275\u0275elementStart(21, "div", 30)(22, "h4");
    \u0275\u0275element(23, "i", 31);
    \u0275\u0275text(24, " O\xF9 trouver mon matricule ?");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "ul")(26, "li");
    \u0275\u0275text(27, "Sur votre bulletin de paie");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "li");
    \u0275\u0275text(29, "Sur votre badge d'employ\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "li");
    \u0275\u0275text(31, "Aupr\xE8s du service des Ressources Humaines");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(32, "div", 10)(33, "p-button", 32);
    \u0275\u0275listener("onClick", function DemandeAvanceSalaireComponent_Conditional_3_Conditional_8_Template_p_button_onClick_33_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.goToMesDemandes());
    });
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_6_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(9);
    \u0275\u0275property("formGroup", ctx_r1.searchForm);
    \u0275\u0275advance(7);
    \u0275\u0275property("disabled", ctx_r1.isSearchingMatricule());
    \u0275\u0275advance();
    \u0275\u0275property("loading", ctx_r1.isSearchingMatricule())("disabled", ctx_r1.searchForm.invalid);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_6_0 = ctx_r1.searchForm.get("matricule")) == null ? null : tmp_6_0.touched) && ((tmp_6_0 = ctx_r1.searchForm.get("matricule")) == null ? null : tmp_6_0.invalid) ? 18 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.matriculeSearchError() ? 19 : -1);
    \u0275\u0275advance(14);
    \u0275\u0275property("outlined", true);
  }
}
function DemandeAvanceSalaireComponent_Conditional_3_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-card")(1, "div", 34)(2, "div", 35);
    \u0275\u0275element(3, "i", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h3");
    \u0275\u0275text(5, "Une erreur est survenue");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 37)(9, "p-button", 38);
    \u0275\u0275listener("onClick", function DemandeAvanceSalaireComponent_Conditional_3_Conditional_9_Template_p_button_onClick_9_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.loadMyAvanceInfo());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p-button", 12);
    \u0275\u0275listener("onClick", function DemandeAvanceSalaireComponent_Conditional_3_Conditional_9_Template_p_button_onClick_10_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.goToMesDemandes());
    });
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r1.searchError());
    \u0275\u0275advance(2);
    \u0275\u0275property("outlined", true);
  }
}
function DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 41);
    \u0275\u0275element(1, "i", 45);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "Matricule saisi manuellement: ");
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.manualMatricule());
  }
}
function DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_3_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275textInterpolate1(" ", (tmp_4_0 = ctx_r1.personnelInfo()) == null ? null : tmp_4_0.numeroCompte, " ");
  }
}
function DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_3_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 54);
    \u0275\u0275text(1, "Non d\xE9fini");
    \u0275\u0275elementEnd();
  }
}
function DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_3_Conditional_56_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 74)(1, "span", 75);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "p-tag", 76);
    \u0275\u0275elementStart(4, "span", 77);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "javaDate");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const demande_r6 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.formatMontant(demande_r6.amount));
    \u0275\u0275advance();
    \u0275\u0275property("value", demande_r6.statut)("severity", ctx_r1.getStatutSeverity(demande_r6.statut));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(6, 4, demande_r6.createdAt, "dd/MM/yyyy"));
  }
}
function DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_3_Conditional_56_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 67)(1, "h4");
    \u0275\u0275element(2, "i", 72);
    \u0275\u0275text(3, " Vos demandes actives");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 73);
    \u0275\u0275repeaterCreate(5, DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_3_Conditional_56_For_6_Template, 7, 7, "div", 74, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r1.demandesActives());
  }
}
function DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_3_Conditional_59_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 78);
    \u0275\u0275listener("onClick", function DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_3_Conditional_59_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.goToForm());
    });
    \u0275\u0275elementEnd();
  }
}
function DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_3_Conditional_60_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 71);
  }
}
function DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-card", 42)(1, "div", 46)(2, "div", 47)(3, "div", 48);
    \u0275\u0275element(4, "i", 45);
    \u0275\u0275elementStart(5, "h3");
    \u0275\u0275text(6, "Informations du personnel");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 49)(8, "div", 50)(9, "span", 51);
    \u0275\u0275text(10, "Matricule");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span", 52);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 50)(14, "span", 51);
    \u0275\u0275text(15, "Nom complet");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span", 53);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div", 50)(19, "span", 51);
    \u0275\u0275text(20, "N\xB0 Compte");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "span", 53);
    \u0275\u0275template(22, DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_3_Conditional_22_Template, 1, 1)(23, DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_3_Conditional_23_Template, 2, 0, "span", 54);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275element(24, "p-divider");
    \u0275\u0275elementStart(25, "div", 55)(26, "div", 48);
    \u0275\u0275element(27, "i", 56);
    \u0275\u0275elementStart(28, "h3");
    \u0275\u0275text(29, "Situation financi\xE8re");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "div", 57)(31, "div", 58)(32, "span", 51);
    \u0275\u0275text(33, "Salaire net");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "span", 59);
    \u0275\u0275text(35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "div", 58)(37, "span", 51);
    \u0275\u0275text(38, "Limite d'avance (50%)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "span", 60);
    \u0275\u0275text(40);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(41, "div", 58)(42, "span", 51);
    \u0275\u0275text(43, "Demandes actives");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "span", 61);
    \u0275\u0275text(45);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(46, "div", 62)(47, "span", 51);
    \u0275\u0275text(48, "Montant disponible");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "span", 63);
    \u0275\u0275text(50);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(51, "div", 64);
    \u0275\u0275element(52, "div", 65);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "div", 66);
    \u0275\u0275text(54);
    \u0275\u0275pipe(55, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(56, DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_3_Conditional_56_Template, 7, 0, "div", 67);
    \u0275\u0275elementStart(57, "div", 68)(58, "p-button", 69);
    \u0275\u0275listener("onClick", function DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_3_Template_p_button_onClick_58_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.reset());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(59, DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_3_Conditional_59_Template, 1, 0, "p-button", 70)(60, DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_3_Conditional_60_Template, 1, 0, "p-message", 71);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(12);
    \u0275\u0275textInterpolate(ctx_r1.matricule());
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.nomComplet());
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r1.hasNumeroCompte() ? 22 : 23);
    \u0275\u0275advance(13);
    \u0275\u0275textInterpolate(ctx_r1.formatMontant(ctx_r1.salaireNet()));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.formatMontant(ctx_r1.limiteAvance()));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.formatMontant(ctx_r1.totalDemandesActives()));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r1.getUsageClass());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.formatMontant(ctx_r1.montantDisponible()));
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", ctx_r1.limiteAvance() > 0 ? ctx_r1.totalDemandesActives() / ctx_r1.limiteAvance() * 100 : 0, "%");
    \u0275\u0275property("ngClass", ctx_r1.getUsageClass());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.totalDemandesActives() > 0 ? \u0275\u0275pipeBind2(55, 15, ctx_r1.totalDemandesActives() / ctx_r1.limiteAvance() * 100, "1.0-0") + "% utilis\xE9" : "Aucune demande active", " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.demandesActives().length > 0 ? 56 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("outlined", true);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.montantDisponible() > 0 ? 59 : 60);
  }
}
function DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_4_Conditional_13_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Le montant est obligatoire ");
  }
}
function DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_4_Conditional_13_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Le montant doit \xEAtre sup\xE9rieur \xE0 0 ");
  }
}
function DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_4_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 28);
    \u0275\u0275template(1, DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_4_Conditional_13_Conditional_1_Template, 1, 0)(2, DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_4_Conditional_13_Conditional_2_Template, 1, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_4_0 = ctx_r1.demandeForm.get("amount")) == null ? null : tmp_4_0.errors == null ? null : tmp_4_0.errors["required"]) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_5_0 = ctx_r1.demandeForm.get("amount")) == null ? null : tmp_5_0.errors == null ? null : tmp_5_0.errors["min"]) ? 2 : -1);
  }
}
function DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_4_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 28);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" Le montant ne peut pas d\xE9passer ", ctx_r1.formatMontant(ctx_r1.montantDisponible()), " ");
  }
}
function DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_4_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 87);
    \u0275\u0275element(1, "i", 100);
    \u0275\u0275elementEnd();
  }
}
function DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_4_Conditional_26_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Le num\xE9ro de compte est obligatoire ");
  }
}
function DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_4_Conditional_26_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Le num\xE9ro de compte doit contenir exactement 11 chiffres ");
  }
}
function DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_4_Conditional_26_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Le num\xE9ro de compte ne doit contenir que des chiffres ");
  }
}
function DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_4_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 28);
    \u0275\u0275template(1, DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_4_Conditional_26_Conditional_1_Template, 1, 0)(2, DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_4_Conditional_26_Conditional_2_Template, 1, 0)(3, DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_4_Conditional_26_Conditional_3_Template, 1, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_4_0 = ctx_r1.demandeForm.get("numeroCompte")) == null ? null : tmp_4_0.errors == null ? null : tmp_4_0.errors["required"]) ? 1 : ((tmp_4_0 = ctx_r1.demandeForm.get("numeroCompte")) == null ? null : tmp_4_0.errors == null ? null : tmp_4_0.errors["minlength"]) || ((tmp_4_0 = ctx_r1.demandeForm.get("numeroCompte")) == null ? null : tmp_4_0.errors == null ? null : tmp_4_0.errors["maxlength"]) ? 2 : ((tmp_4_0 = ctx_r1.demandeForm.get("numeroCompte")) == null ? null : tmp_4_0.errors == null ? null : tmp_4_0.errors["pattern"]) ? 3 : -1);
  }
}
function DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_4_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 89);
    \u0275\u0275element(1, "i", 9);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Num\xE9ro de compte enregistr\xE9: ", (tmp_4_0 = ctx_r1.personnelInfo()) == null ? null : tmp_4_0.numeroCompte, " ");
  }
}
function DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_4_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 94);
  }
}
function DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-card", 43)(1, "div", 79)(2, "div", 80);
    \u0275\u0275element(3, "i", 9);
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5, "Montant maximum disponible: ");
    \u0275\u0275elementStart(6, "strong");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "form", 81);
    \u0275\u0275listener("ngSubmit", function DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_4_Template_form_ngSubmit_8_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.submitDemande());
    });
    \u0275\u0275elementStart(9, "div", 21)(10, "label", 82);
    \u0275\u0275text(11, "Montant demand\xE9 (GNF) *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "p-inputNumber", 83);
    \u0275\u0275listener("onInput", function DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_4_Template_p_inputNumber_onInput_12_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onAmountChange($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(13, DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_4_Conditional_13_Template, 3, 2, "small", 28)(14, DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_4_Conditional_14_Template, 2, 1, "small", 28);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 21)(16, "label", 84);
    \u0275\u0275text(17, "Num\xE9ro de compte (11 chiffres) *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "div", 23)(19, "span", 24);
    \u0275\u0275element(20, "i", 85);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "input", 86);
    \u0275\u0275listener("input", function DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_4_Template_input_input_21_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onNumeroCompteInput($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(22, DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_4_Conditional_22_Template, 2, 0, "span", 87);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "div", 88)(24, "span");
    \u0275\u0275text(25);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(26, DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_4_Conditional_26_Template, 4, 1, "small", 28)(27, DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_4_Conditional_27_Template, 3, 1, "small", 89);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "div", 90)(29, "h4");
    \u0275\u0275text(30, "R\xE9capitulatif");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div", 91)(32, "div", 92)(33, "span", 51);
    \u0275\u0275text(34, "Matricule:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "span", 53);
    \u0275\u0275text(36);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(37, "div", 92)(38, "span", 51);
    \u0275\u0275text(39, "Nom:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "span", 53);
    \u0275\u0275text(41);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(42, "div", 92)(43, "span", 51);
    \u0275\u0275text(44, "Montant demand\xE9:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "span", 93);
    \u0275\u0275text(46);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(47, "div", 92)(48, "span", 51);
    \u0275\u0275text(49, "N\xB0 Compte:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "span", 53);
    \u0275\u0275text(51);
    \u0275\u0275template(52, DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_4_Conditional_52_Template, 1, 0, "i", 94);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(53, "div", 95)(54, "div", 96);
    \u0275\u0275element(55, "i");
    \u0275\u0275elementStart(56, "span");
    \u0275\u0275text(57, "Montant valide");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(58, "div", 96);
    \u0275\u0275element(59, "i");
    \u0275\u0275elementStart(60, "span");
    \u0275\u0275text(61, "Num\xE9ro de compte valide (11 chiffres)");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(62, "div", 97)(63, "p-button", 98);
    \u0275\u0275listener("onClick", function DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_4_Template_p_button_onClick_63_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.currentStep.set(1));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(64, "p-button", 99);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_10_0;
    let tmp_11_0;
    let tmp_14_0;
    let tmp_15_0;
    let tmp_16_0;
    let tmp_17_0;
    let tmp_18_0;
    let tmp_21_0;
    let tmp_24_0;
    let tmp_26_0;
    let tmp_27_0;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r1.formatMontant(ctx_r1.montantDisponible()));
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx_r1.demandeForm);
    \u0275\u0275advance(4);
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(41, _c2));
    \u0275\u0275property("min", 1)("max", ctx_r1.montantDisponible())("useGrouping", true)("inputStyle", \u0275\u0275pureFunction0(42, _c2));
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_10_0 = ctx_r1.demandeForm.get("amount")) == null ? null : tmp_10_0.touched) && ((tmp_10_0 = ctx_r1.demandeForm.get("amount")) == null ? null : tmp_10_0.invalid) ? 13 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_11_0 = ctx_r1.demandeForm.get("amount")) == null ? null : tmp_11_0.value) > ctx_r1.montantDisponible() ? 14 : -1);
    \u0275\u0275advance(7);
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(43, _c2));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isNumeroCompteValid() ? 22 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("valid", ((tmp_14_0 = ctx_r1.demandeForm.get("numeroCompte")) == null ? null : tmp_14_0.value == null ? null : tmp_14_0.value.length) === 11)("invalid", ((tmp_15_0 = ctx_r1.demandeForm.get("numeroCompte")) == null ? null : tmp_15_0.value == null ? null : tmp_15_0.value.length) > 0 && ((tmp_15_0 = ctx_r1.demandeForm.get("numeroCompte")) == null ? null : tmp_15_0.value == null ? null : tmp_15_0.value.length) !== 11);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ((tmp_16_0 = ctx_r1.demandeForm.get("numeroCompte")) == null ? null : tmp_16_0.value == null ? null : tmp_16_0.value.length) || 0, " / 11 caract\xE8res ");
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_17_0 = ctx_r1.demandeForm.get("numeroCompte")) == null ? null : tmp_17_0.touched) && ((tmp_17_0 = ctx_r1.demandeForm.get("numeroCompte")) == null ? null : tmp_17_0.invalid) ? 26 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.hasNumeroCompte() && ((tmp_18_0 = ctx_r1.personnelInfo()) == null ? null : tmp_18_0.numeroCompte) ? 27 : -1);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(ctx_r1.matricule());
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.nomComplet());
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.formatMontant((tmp_21_0 = ctx_r1.demandeForm.get("amount")) == null ? null : tmp_21_0.value));
    \u0275\u0275advance(4);
    \u0275\u0275classProp("valid", ctx_r1.isNumeroCompteValid())("invalid", !ctx_r1.isNumeroCompteValid());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ((tmp_24_0 = ctx_r1.demandeForm.get("numeroCompte")) == null ? null : tmp_24_0.value) || "-", " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isNumeroCompteValid() ? 52 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("valid", ((tmp_26_0 = ctx_r1.demandeForm.get("amount")) == null ? null : tmp_26_0.valid) && ((tmp_26_0 = ctx_r1.demandeForm.get("amount")) == null ? null : tmp_26_0.value) <= ctx_r1.montantDisponible());
    \u0275\u0275advance();
    \u0275\u0275classMap(((tmp_27_0 = ctx_r1.demandeForm.get("amount")) == null ? null : tmp_27_0.valid) && ((tmp_27_0 = ctx_r1.demandeForm.get("amount")) == null ? null : tmp_27_0.value) <= ctx_r1.montantDisponible() ? "pi pi-check-circle" : "pi pi-circle");
    \u0275\u0275advance(3);
    \u0275\u0275classProp("valid", ctx_r1.isNumeroCompteValid());
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r1.isNumeroCompteValid() ? "pi pi-check-circle" : "pi pi-circle");
    \u0275\u0275advance(4);
    \u0275\u0275property("outlined", true)("disabled", ctx_r1.isSubmitting());
    \u0275\u0275advance();
    \u0275\u0275property("loading", ctx_r1.isSubmitting())("disabled", !ctx_r1.canSubmit());
  }
}
function DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-card", 44)(1, "div", 101)(2, "div", 102);
    \u0275\u0275element(3, "i", 103);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h2");
    \u0275\u0275text(5, "Demande envoy\xE9e avec succ\xE8s !");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7, "Votre demande d'avance sur salaire a \xE9t\xE9 enregistr\xE9e et est en cours de traitement.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 104)(9, "div", 105)(10, "span", 51);
    \u0275\u0275text(11, "Matricule:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span", 53);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 105)(15, "span", 51);
    \u0275\u0275text(16, "Montant:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span", 53);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div", 105)(20, "span", 51);
    \u0275\u0275text(21, "Statut:");
    \u0275\u0275elementEnd();
    \u0275\u0275element(22, "p-tag", 106);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "p", 107);
    \u0275\u0275element(24, "i", 9);
    \u0275\u0275text(25, " Vous recevrez une notification lorsque votre demande sera trait\xE9e. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "div", 108)(27, "p-button", 109);
    \u0275\u0275listener("onClick", function DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_5_Template_p_button_onClick_27_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.reset());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "p-button", 110);
    \u0275\u0275listener("onClick", function DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_5_Template_p_button_onClick_28_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.goToMesDemandes());
    });
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(13);
    \u0275\u0275textInterpolate(ctx_r1.matricule());
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.formatMontant((tmp_4_0 = ctx_r1.demandeForm.get("amount")) == null ? null : tmp_4_0.value));
    \u0275\u0275advance(10);
    \u0275\u0275property("outlined", true);
  }
}
function DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 39);
    \u0275\u0275element(1, "p-steps", 40);
    \u0275\u0275elementEnd();
    \u0275\u0275template(2, DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_2_Template, 6, 1, "div", 41)(3, DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_3_Template, 61, 18, "p-card", 42)(4, DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_4_Template, 65, 44, "p-card", 43)(5, DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Conditional_5_Template, 29, 3, "p-card", 44);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("model", ctx_r1.steps)("activeIndex", ctx_r1.currentStep())("readonly", true);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r1.hasMatriculeInAccount() && ctx_r1.manualMatricule() ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.currentStep() === 1 ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.currentStep() === 2 ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.currentStep() === 3 ? 5 : -1);
  }
}
function DemandeAvanceSalaireComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2)(1, "div", 13)(2, "h2");
    \u0275\u0275element(3, "i", 14);
    \u0275\u0275text(4, " Demande d'avance sur salaire");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 15);
    \u0275\u0275text(6, "Faites une demande d'avance sur votre salaire (jusqu'\xE0 50% du net)");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(7, DemandeAvanceSalaireComponent_Conditional_3_Conditional_7_Template, 5, 3, "p-card")(8, DemandeAvanceSalaireComponent_Conditional_3_Conditional_8_Template, 34, 7, "p-card", 16)(9, DemandeAvanceSalaireComponent_Conditional_3_Conditional_9_Template, 11, 2, "p-card")(10, DemandeAvanceSalaireComponent_Conditional_3_Conditional_10_Template, 6, 7);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275conditional(ctx_r1.isSearching() && !ctx_r1.needsManualMatricule() ? 7 : ctx_r1.needsManualMatricule() ? 8 : ctx_r1.searchError() ? 9 : ctx_r1.currentStep() >= 1 ? 10 : -1);
  }
}
var DemandeAvanceSalaireComponent = class _DemandeAvanceSalaireComponent {
  user;
  salaireService = inject(UserService);
  router = inject(Router);
  messageService = inject(MessageService);
  fb = inject(FormBuilder);
  cdr = inject(ChangeDetectorRef);
  // ==================== SIGNALS ====================
  // Autorisation
  isCheckingAuthorization = signal(true);
  isAuthorized = signal(false);
  authorizationMessage = signal("Les demandes d'avance sur salaire ne sont pas disponibles pour le moment. Contactez la Direction des Ressources Humaines.");
  // ✅ NOUVEAU: Gestion du matricule manquant
  hasMatriculeInAccount = signal(true);
  // L'utilisateur a-t-il un matricule dans son compte?
  needsManualMatricule = signal(false);
  // Doit-on demander le matricule manuellement?
  isSearchingMatricule = signal(false);
  // Recherche manuelle en cours?
  matriculeSearchError = signal("");
  // Erreur de recherche matricule
  isSearching = signal(false);
  isSubmitting = signal(false);
  isLoadingDemandes = signal(false);
  personnelInfo = signal(null);
  avanceInfo = signal(null);
  demandesActives = signal([]);
  searchError = signal("");
  currentStep = signal(0);
  formAmount = signal(0);
  formNumeroCompte = signal("");
  // ✅ NOUVEAU: Matricule saisi manuellement
  manualMatricule = signal("");
  // ==================== FORMULAIRES ====================
  searchForm = this.fb.group({
    matricule: ["", [Validators.required, Validators.minLength(1)]]
  });
  demandeForm = this.fb.group({
    amount: [null, [Validators.required, Validators.min(1)]],
    numeroCompte: ["", [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern(/^\d{11}$/)]]
  });
  // ==================== COMPUTED ====================
  matricule = computed(() => this.personnelInfo()?.matricule || this.manualMatricule() || "");
  nomComplet = computed(() => {
    const p = this.personnelInfo();
    return p ? `${p.prenom} ${p.nom}` : "";
  });
  salaireNet = computed(() => this.avanceInfo()?.netAmount || 0);
  limiteAvance = computed(() => this.avanceInfo()?.netAmountLimit || 0);
  totalDemandesActives = computed(() => {
    return this.demandesActives().reduce((sum, d) => sum + (d.amount || 0), 0);
  });
  montantDisponible = computed(() => {
    const limite = this.limiteAvance();
    const totalActif = this.totalDemandesActives();
    return Math.max(0, limite - totalActif);
  });
  hasNumeroCompte = computed(() => {
    const p = this.personnelInfo();
    return p?.numeroCompte && p.numeroCompte.trim() !== "";
  });
  isNumeroCompteValid = computed(() => {
    const numeroCompte = this.formNumeroCompte();
    return /^\d{11}$/.test(numeroCompte);
  });
  isAmountValid = computed(() => {
    const amount = this.formAmount();
    return amount > 0 && amount <= this.montantDisponible();
  });
  canSubmit = computed(() => {
    return this.isAmountValid() && this.isNumeroCompteValid() && !this.isSubmitting();
  });
  steps = [{ label: "Recherche" }, { label: "V\xE9rification" }, { label: "Demande" }, { label: "Confirmation" }];
  // ==================== LIFECYCLE ====================
  ngOnInit() {
    this.checkAuthorization();
    this.demandeForm.valueChanges.subscribe((values) => {
      this.formAmount.set(values.amount || 0);
      this.formNumeroCompte.set(values.numeroCompte || "");
    });
  }
  // ==================== AUTORISATION ====================
  checkAuthorization() {
    console.log("\u{1F504} V\xE9rification de l'autorisation...");
    this.isCheckingAuthorization.set(true);
    this.salaireService.getAuthorizeSalaire().subscribe({
      next: (response) => {
        console.log("\u{1F4E5} R\xE9ponse autorisation:", response);
        let authorized = false;
        let message = "Les demandes d'avance sur salaire ne sont pas disponibles pour le moment. Contactez la Direction des Ressources Humaines.";
        if (response.data?.authorize) {
          const authorize = response.data.authorize;
          authorized = authorize.isAuthorized === true;
          message = authorize.message || message;
        } else if (response.data) {
          authorized = response.data.isAuthorized === true;
          message = response.data.message || message;
        }
        console.log("\u2705 Autorisation:", authorized, "| Message:", message);
        this.isAuthorized.set(authorized);
        this.authorizationMessage.set(message);
        this.isCheckingAuthorization.set(false);
        this.cdr.detectChanges();
        if (authorized) {
          console.log("\u{1F680} Chargement des infos de salaire...");
          this.searchError.set("");
          this.currentStep.set(0);
          this.loadMyAvanceInfo();
        }
      },
      error: (error) => {
        console.error("\u274C Erreur v\xE9rification autorisation:", error);
        this.isAuthorized.set(false);
        this.authorizationMessage.set("Impossible de v\xE9rifier l'\xE9tat des demandes. Veuillez r\xE9essayer plus tard.");
        this.isCheckingAuthorization.set(false);
        this.cdr.detectChanges();
      }
    });
  }
  // ==================== CHARGEMENT INFOS SALAIRE ====================
  loadMyAvanceInfo() {
    if (!this.isAuthorized()) {
      console.log("\u26A0\uFE0F Non autoris\xE9, pas de chargement");
      return;
    }
    this.isSearching.set(true);
    this.searchError.set("");
    this.needsManualMatricule.set(false);
    this.salaireService.getMyAvanceSalaire().subscribe({
      next: (response) => {
        console.log("\u{1F4E5} R\xE9ponse avance salaire:", response);
        if (response.data?.avance) {
          this.processAvanceData(response.data.avance);
          this.hasMatriculeInAccount.set(true);
          this.loadDemandesActives();
          this.currentStep.set(1);
        } else if (response.data?.hasMatricule === false) {
          console.log("\u26A0\uFE0F Utilisateur sans matricule, afficher formulaire de recherche");
          this.hasMatriculeInAccount.set(false);
          this.needsManualMatricule.set(true);
          this.isSearching.set(false);
        } else {
          this.searchError.set("Aucune donn\xE9e de salaire trouv\xE9e. Le fichier des salaires n'a peut-\xEAtre pas \xE9t\xE9 import\xE9.");
          this.isSearching.set(false);
        }
      },
      error: (error) => {
        console.error("\u274C Erreur chargement avance:", error);
        const errorMessage = error.error?.message || "";
        if (errorMessage.includes("matricule") || error.status === 400) {
          console.log("\u26A0\uFE0F Erreur matricule, afficher formulaire de recherche");
          this.hasMatriculeInAccount.set(false);
          this.needsManualMatricule.set(true);
          this.searchError.set("");
        } else {
          this.searchError.set(errorMessage || "Impossible de charger vos informations de salaire.");
        }
        this.isSearching.set(false);
      }
    });
  }
  // ==================== RECHERCHE MANUELLE PAR MATRICULE ====================
  /**
   * Rechercher un matricule saisi manuellement
   */
  searchMatricule() {
    const matricule = this.searchForm.get("matricule")?.value?.trim();
    if (!matricule) {
      this.messageService.add({
        severity: "warn",
        summary: "Attention",
        detail: "Veuillez saisir un matricule"
      });
      return;
    }
    console.log("\u{1F50D} Recherche matricule:", matricule);
    this.isSearchingMatricule.set(true);
    this.matriculeSearchError.set("");
    this.salaireService.getAvanceSalaireByMatricule(matricule).subscribe({
      next: (response) => {
        console.log("\u{1F4E5} R\xE9ponse recherche matricule:", response);
        if (response.data?.avance) {
          this.manualMatricule.set(matricule);
          this.processAvanceData(response.data.avance);
          this.needsManualMatricule.set(false);
          this.loadDemandesActivesByMatricule(matricule);
          this.currentStep.set(1);
          this.messageService.add({
            severity: "success",
            summary: "Succ\xE8s",
            detail: "Matricule trouv\xE9 ! Vous pouvez continuer."
          });
        } else {
          this.matriculeSearchError.set("Ce matricule n'existe pas dans le fichier de salaire du mois en cours.");
        }
        this.isSearchingMatricule.set(false);
      },
      error: (error) => {
        console.error("\u274C Erreur recherche matricule:", error);
        this.matriculeSearchError.set(error.error?.message || "Ce matricule n'a pas \xE9t\xE9 trouv\xE9. V\xE9rifiez qu'il existe dans le fichier du personnel et le fichier de salaire.");
        this.isSearchingMatricule.set(false);
      }
    });
  }
  /**
   * Charger les demandes actives par matricule (pour utilisateurs sans matricule dans compte)
   */
  loadDemandesActivesByMatricule(matricule) {
    this.isLoadingDemandes.set(true);
    this.salaireService.getDemandeSalaryByStatut("ENCOURS").subscribe({
      next: (response) => {
        if (response.data?.demandes) {
          const allDemandes = response.data.demandes;
          const actives = allDemandes.filter((d) => d.matricule === matricule && ["ENCOURS", "VALIDER", "CONFIRMER"].includes(d.statut));
          this.demandesActives.set(actives);
        }
        this.isSearching.set(false);
        this.isLoadingDemandes.set(false);
      },
      error: (error) => {
        console.error("Erreur chargement demandes:", error);
        this.demandesActives.set([]);
        this.isSearching.set(false);
        this.isLoadingDemandes.set(false);
      }
    });
  }
  /**
   * Traiter les données d'avance reçues
   */
  processAvanceData(avance) {
    this.avanceInfo.set(avance);
    this.personnelInfo.set({
      matricule: avance.matricule,
      nom: avance.nomPersonnel,
      prenom: avance.prenomPersonnel,
      numeroCompte: avance.numeroCompte
    });
    if (avance.numeroCompte && /^\d{11}$/.test(avance.numeroCompte)) {
      this.demandeForm.patchValue({ numeroCompte: avance.numeroCompte });
      this.formNumeroCompte.set(avance.numeroCompte);
    }
  }
  loadDemandesActives() {
    this.isLoadingDemandes.set(true);
    this.salaireService.getMyDemandeSalary().subscribe({
      next: (response) => {
        if (response.data?.demandes) {
          const demandes = response.data.demandes;
          const actives = demandes.filter((d) => ["ENCOURS", "VALIDER", "CONFIRMER"].includes(d.statut));
          this.demandesActives.set(actives);
        }
        this.isSearching.set(false);
        this.isLoadingDemandes.set(false);
      },
      error: (error) => {
        console.error("Erreur chargement demandes:", error);
        this.isSearching.set(false);
        this.isLoadingDemandes.set(false);
      }
    });
  }
  // ==================== SOUMISSION ====================
  goToForm() {
    if (this.montantDisponible() <= 0) {
      this.messageService.add({
        severity: "error",
        summary: "Limite atteinte",
        detail: "Vous avez atteint votre limite d'avance. Aucune nouvelle demande possible."
      });
      return;
    }
    this.currentStep.set(2);
  }
  onNumeroCompteInput(event) {
    const input = event.target;
    const cleaned = input.value.replace(/\D/g, "").substring(0, 11);
    input.value = cleaned;
    this.demandeForm.patchValue({ numeroCompte: cleaned });
    this.formNumeroCompte.set(cleaned);
  }
  onAmountChange(event) {
    const value = event?.value ?? event ?? 0;
    this.formAmount.set(Number(value) || 0);
  }
  goToMesDemandes() {
    this.router.navigate(["/dashboards/mes-demandes-salaire"]);
  }
  submitDemande() {
    if (!this.canSubmit()) {
      this.messageService.add({
        severity: "warn",
        summary: "Formulaire invalide",
        detail: "Veuillez v\xE9rifier les informations saisies"
      });
      return;
    }
    const amount = this.formAmount();
    const numeroCompte = this.formNumeroCompte();
    const matricule = this.matricule();
    this.isSubmitting.set(true);
    let submitObservable;
    if (this.hasMatriculeInAccount()) {
      submitObservable = this.salaireService.createMyDemandeSalary(amount, numeroCompte);
    } else {
      submitObservable = this.salaireService.createDemandeSalary(matricule, amount, numeroCompte);
    }
    submitObservable.subscribe({
      next: (response) => {
        this.messageService.add({
          severity: "success",
          summary: "Succ\xE8s",
          detail: "Votre demande d'avance sur salaire a \xE9t\xE9 cr\xE9\xE9e avec succ\xE8s"
        });
        this.isSubmitting.set(false);
        this.currentStep.set(3);
      },
      error: (error) => {
        console.error("Erreur cr\xE9ation demande:", error);
        const message = error.error?.message || "Erreur lors de la cr\xE9ation de la demande";
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: message
        });
        this.isSubmitting.set(false);
      }
    });
  }
  reset() {
    this.demandeForm.reset();
    this.searchForm.reset();
    this.formAmount.set(0);
    this.formNumeroCompte.set("");
    this.manualMatricule.set("");
    this.personnelInfo.set(null);
    this.avanceInfo.set(null);
    this.demandesActives.set([]);
    this.searchError.set("");
    this.matriculeSearchError.set("");
    this.needsManualMatricule.set(false);
    this.currentStep.set(0);
    this.checkAuthorization();
  }
  formatMontant(montant) {
    if (montant === void 0 || montant === null)
      return "-";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "GNF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(montant);
  }
  getUsageClass() {
    const limite = this.limiteAvance();
    const utilise = this.totalDemandesActives();
    if (limite === 0)
      return "";
    const pourcentage = utilise / limite * 100;
    if (pourcentage >= 100)
      return "usage-full";
    if (pourcentage >= 75)
      return "usage-high";
    if (pourcentage >= 50)
      return "usage-medium";
    return "usage-low";
  }
  getStatutSeverity(statut) {
    switch (statut?.toUpperCase()) {
      case "ENCOURS":
        return "info";
      case "VALIDER":
        return "success";
      case "CONFIRMER":
        return "success";
      case "REJET":
        return "danger";
      case "ANNULLER":
        return "secondary";
      default:
        return "info";
    }
  }
  static \u0275fac = function DemandeAvanceSalaireComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DemandeAvanceSalaireComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DemandeAvanceSalaireComponent, selectors: [["app-demande-avance-salaire"]], inputs: { user: "user" }, features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 4, vars: 1, consts: [[1, "authorization-check"], [1, "not-authorized"], [1, "demande-container"], [1, "loading-authorization"], [1, "not-authorized-content"], [1, "icon-container"], [1, "pi", "pi-lock"], [1, "message"], [1, "info-box"], [1, "pi", "pi-info-circle"], [1, "actions"], ["icon", "pi pi-refresh", "label", "V\xE9rifier \xE0 nouveau", 3, "onClick", "outlined", "loading"], ["icon", "pi pi-list", "label", "Voir mes demandes", "severity", "secondary", 3, "onClick"], [1, "header-section"], [1, "pi", "pi-wallet"], [1, "subtitle"], ["header", "Identification par matricule", "styleClass", "manual-matricule-card"], [1, "loading-section"], [1, "manual-matricule-section"], [1, "info-banner"], [1, "search-form", 3, "ngSubmit", "formGroup"], [1, "p-field"], ["for", "matricule"], [1, "p-inputgroup"], [1, "p-inputgroup-addon"], [1, "pi", "pi-id-card"], ["type", "text", "pInputText", "", "id", "matricule", "formControlName", "matricule", "placeholder", "Entrez votre matricule (ex: 631)", 3, "disabled"], ["type", "submit", "pButton", "", "icon", "pi pi-search", "label", "V\xE9rifier", 3, "loading", "disabled"], [1, "p-error"], [1, "search-error"], [1, "help-section"], [1, "pi", "pi-question-circle"], ["icon", "pi pi-list", "label", "Voir mes demandes", "severity", "secondary", 3, "onClick", "outlined"], ["severity", "error", 3, "text"], [1, "error-section"], [1, "error-icon"], [1, "pi", "pi-exclamation-triangle"], [1, "error-actions"], ["icon", "pi pi-refresh", "label", "R\xE9essayer", 3, "onClick", "outlined"], [1, "steps-container"], [3, "model", "activeIndex", "readonly"], [1, "manual-matricule-badge"], ["header", "\xC9tape 2: V\xE9rification de votre \xE9ligibilit\xE9", "styleClass", "step-card"], ["header", "\xC9tape 3: Saisie de la demande", "styleClass", "step-card"], ["styleClass", "step-card confirmation-card"], [1, "pi", "pi-user"], [1, "verification-section"], [1, "info-card"], [1, "info-header"], [1, "info-grid"], [1, "info-item"], [1, "label"], [1, "value", "badge"], [1, "value"], [1, "no-data"], [1, "info-card", "financial"], [1, "pi", "pi-chart-bar"], [1, "financial-grid"], [1, "financial-item"], [1, "value", "amount"], [1, "value", "amount", "limite"], [1, "value", "amount", "used"], [1, "financial-item", "highlight", 3, "ngClass"], [1, "value", "amount", "available"], [1, "usage-bar"], [1, "usage-progress", 3, "ngClass"], [1, "usage-text"], [1, "active-demands"], [1, "verification-actions"], ["label", "Retour", "icon", "pi pi-arrow-left", "severity", "secondary", 3, "onClick", "outlined"], ["label", "Faire une demande", "icon", "pi pi-arrow-right", "iconPos", "right"], ["severity", "warn", "text", "Vous avez atteint votre limite d'avance. Aucune nouvelle demande possible."], [1, "pi", "pi-list"], [1, "demands-list"], [1, "demand-item"], [1, "demand-amount"], [3, "value", "severity"], [1, "demand-date"], ["label", "Faire une demande", "icon", "pi pi-arrow-right", "iconPos", "right", 3, "onClick"], [1, "form-section"], [1, "available-reminder"], [1, "demande-form", 3, "ngSubmit", "formGroup"], ["for", "amount"], ["id", "amount", "formControlName", "amount", "mode", "decimal", "placeholder", "Entrez le montant", 3, "onInput", "min", "max", "useGrouping", "inputStyle"], ["for", "numeroCompte"], [1, "pi", "pi-credit-card"], ["type", "text", "pInputText", "", "id", "numeroCompte", "formControlName", "numeroCompte", "placeholder", "Ex: 12345678901", "maxlength", "11", 3, "input"], [1, "p-inputgroup-addon", "valid-icon"], [1, "char-counter"], [1, "p-hint"], [1, "summary-box"], [1, "summary-grid"], [1, "summary-item"], [1, "value", "highlight"], [1, "pi", "pi-check-circle", 2, "color", "var(--green-500)", "margin-left", "0.5rem"], [1, "validation-status"], [1, "validation-item"], [1, "form-actions"], ["label", "Retour", "icon", "pi pi-arrow-left", "severity", "secondary", 3, "onClick", "outlined", "disabled"], ["type", "submit", "label", "Soumettre la demande", "icon", "pi pi-check", 3, "loading", "disabled"], [1, "pi", "pi-check-circle", 2, "color", "var(--green-500)"], [1, "confirmation-section"], [1, "success-icon"], [1, "pi", "pi-check-circle"], [1, "confirmation-details"], [1, "detail-item"], ["value", "ENCOURS", "severity", "info"], [1, "next-steps"], [1, "confirmation-actions"], ["label", "Nouvelle demande", "icon", "pi pi-plus", 3, "onClick"], ["label", "Voir mes demandes", "icon", "pi pi-list", "severity", "secondary", 3, "onClick", "outlined"]], template: function DemandeAvanceSalaireComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "p-toast");
      \u0275\u0275template(1, DemandeAvanceSalaireComponent_Conditional_1_Template, 6, 3, "div", 0)(2, DemandeAvanceSalaireComponent_Conditional_2_Template, 19, 3, "div", 1)(3, DemandeAvanceSalaireComponent_Conditional_3_Template, 11, 1, "div", 2);
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isCheckingAuthorization() ? 1 : !ctx.isAuthorized() ? 2 : 3);
    }
  }, dependencies: [
    CommonModule,
    NgClass,
    DecimalPipe,
    FormsModule,
    \u0275NgNoValidate,
    DefaultValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    MaxLengthValidator,
    ReactiveFormsModule,
    FormGroupDirective,
    FormControlName,
    JavaDatePipe,
    CardModule,
    Card,
    InputTextModule,
    InputText,
    InputNumberModule,
    InputNumber,
    ButtonModule,
    ButtonDirective,
    Button,
    ToastModule,
    Toast,
    MessagesModule,
    MessageModule,
    Message,
    DividerModule,
    Divider,
    ProgressSpinnerModule,
    ProgressSpinner,
    TagModule,
    Tag,
    TooltipModule,
    StepsModule,
    Steps,
    FloatLabelModule
  ], styles: ["\n\n.demande-container[_ngcontent-%COMP%] {\n  max-width: 800px;\n  margin: 0 auto;\n  padding: 1.5rem;\n}\n.header-section[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: 2rem;\n}\n.header-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  color: var(--primary-color);\n  margin-bottom: 0.5rem;\n}\n.header-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  margin-right: 0.5rem;\n}\n.header-section[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n}\n.steps-container[_ngcontent-%COMP%] {\n  margin-bottom: 2rem;\n}\n.step-card[_ngcontent-%COMP%] {\n  margin-bottom: 1.5rem;\n}\n.search-section[_ngcontent-%COMP%]   .instruction[_ngcontent-%COMP%] {\n  background: var(--surface-100);\n  padding: 1rem;\n  border-radius: 8px;\n  margin-bottom: 1.5rem;\n}\n.search-section[_ngcontent-%COMP%]   .instruction[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  margin-right: 0.5rem;\n  color: var(--primary-color);\n}\n.search-section[_ngcontent-%COMP%]   .search-form[_ngcontent-%COMP%]   .p-field[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  margin-bottom: 0.5rem;\n  font-weight: 600;\n}\n.search-section[_ngcontent-%COMP%]   .search-error[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n}\n.verification-section[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%] {\n  background: var(--surface-50);\n  border-radius: 8px;\n  padding: 1.5rem;\n  margin-bottom: 1rem;\n}\n.verification-section[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%]   .info-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  margin-bottom: 1rem;\n}\n.verification-section[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%]   .info-header[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  color: var(--primary-color);\n}\n.verification-section[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%]   .info-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.1rem;\n}\n.verification-section[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%]   .info-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));\n  gap: 1rem;\n}\n.verification-section[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%]   .info-grid[_ngcontent-%COMP%]   .info-item[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.85rem;\n  color: var(--text-color-secondary);\n  margin-bottom: 0.25rem;\n}\n.verification-section[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%]   .info-grid[_ngcontent-%COMP%]   .info-item[_ngcontent-%COMP%]   .value[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.verification-section[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%]   .info-grid[_ngcontent-%COMP%]   .info-item[_ngcontent-%COMP%]   .value.badge[_ngcontent-%COMP%] {\n  background: var(--primary-100);\n  color: var(--primary-700);\n  padding: 0.25rem 0.75rem;\n  border-radius: 4px;\n}\n.verification-section[_ngcontent-%COMP%]   .info-card[_ngcontent-%COMP%]   .info-grid[_ngcontent-%COMP%]   .info-item[_ngcontent-%COMP%]   .value.no-data[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  font-style: italic;\n  font-weight: normal;\n}\n.verification-section[_ngcontent-%COMP%]   .info-card.financial[_ngcontent-%COMP%]   .financial-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 1rem;\n}\n.verification-section[_ngcontent-%COMP%]   .info-card.financial[_ngcontent-%COMP%]   .financial-grid[_ngcontent-%COMP%]   .financial-item[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 1rem;\n  background: white;\n  border-radius: 8px;\n}\n.verification-section[_ngcontent-%COMP%]   .info-card.financial[_ngcontent-%COMP%]   .financial-grid[_ngcontent-%COMP%]   .financial-item[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.85rem;\n  color: var(--text-color-secondary);\n  margin-bottom: 0.5rem;\n}\n.verification-section[_ngcontent-%COMP%]   .info-card.financial[_ngcontent-%COMP%]   .financial-grid[_ngcontent-%COMP%]   .financial-item[_ngcontent-%COMP%]   .value.amount[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  font-weight: 700;\n}\n.verification-section[_ngcontent-%COMP%]   .info-card.financial[_ngcontent-%COMP%]   .financial-grid[_ngcontent-%COMP%]   .financial-item[_ngcontent-%COMP%]   .value.amount.limite[_ngcontent-%COMP%] {\n  color: var(--blue-600);\n}\n.verification-section[_ngcontent-%COMP%]   .info-card.financial[_ngcontent-%COMP%]   .financial-grid[_ngcontent-%COMP%]   .financial-item[_ngcontent-%COMP%]   .value.amount.used[_ngcontent-%COMP%] {\n  color: var(--orange-600);\n}\n.verification-section[_ngcontent-%COMP%]   .info-card.financial[_ngcontent-%COMP%]   .financial-grid[_ngcontent-%COMP%]   .financial-item[_ngcontent-%COMP%]   .value.amount.available[_ngcontent-%COMP%] {\n  color: var(--green-600);\n}\n.verification-section[_ngcontent-%COMP%]   .info-card.financial[_ngcontent-%COMP%]   .financial-grid[_ngcontent-%COMP%]   .financial-item.highlight[_ngcontent-%COMP%] {\n  background: var(--green-50);\n  border: 2px solid var(--green-200);\n}\n.verification-section[_ngcontent-%COMP%]   .info-card.financial[_ngcontent-%COMP%]   .financial-grid[_ngcontent-%COMP%]   .financial-item.highlight.usage-high[_ngcontent-%COMP%] {\n  background: var(--orange-50);\n  border-color: var(--orange-200);\n}\n.verification-section[_ngcontent-%COMP%]   .info-card.financial[_ngcontent-%COMP%]   .financial-grid[_ngcontent-%COMP%]   .financial-item.highlight.usage-high[_ngcontent-%COMP%]   .value.available[_ngcontent-%COMP%] {\n  color: var(--orange-600);\n}\n.verification-section[_ngcontent-%COMP%]   .info-card.financial[_ngcontent-%COMP%]   .financial-grid[_ngcontent-%COMP%]   .financial-item.highlight.usage-full[_ngcontent-%COMP%] {\n  background: var(--red-50);\n  border-color: var(--red-200);\n}\n.verification-section[_ngcontent-%COMP%]   .info-card.financial[_ngcontent-%COMP%]   .financial-grid[_ngcontent-%COMP%]   .financial-item.highlight.usage-full[_ngcontent-%COMP%]   .value.available[_ngcontent-%COMP%] {\n  color: var(--red-600);\n}\n.verification-section[_ngcontent-%COMP%]   .info-card.financial[_ngcontent-%COMP%]   .usage-bar[_ngcontent-%COMP%] {\n  height: 8px;\n  background: var(--surface-200);\n  border-radius: 4px;\n  margin-top: 1rem;\n  overflow: hidden;\n}\n.verification-section[_ngcontent-%COMP%]   .info-card.financial[_ngcontent-%COMP%]   .usage-bar[_ngcontent-%COMP%]   .usage-progress[_ngcontent-%COMP%] {\n  height: 100%;\n  background: var(--green-500);\n  transition: width 0.3s ease;\n}\n.verification-section[_ngcontent-%COMP%]   .info-card.financial[_ngcontent-%COMP%]   .usage-bar[_ngcontent-%COMP%]   .usage-progress.usage-medium[_ngcontent-%COMP%] {\n  background: var(--yellow-500);\n}\n.verification-section[_ngcontent-%COMP%]   .info-card.financial[_ngcontent-%COMP%]   .usage-bar[_ngcontent-%COMP%]   .usage-progress.usage-high[_ngcontent-%COMP%] {\n  background: var(--orange-500);\n}\n.verification-section[_ngcontent-%COMP%]   .info-card.financial[_ngcontent-%COMP%]   .usage-bar[_ngcontent-%COMP%]   .usage-progress.usage-full[_ngcontent-%COMP%] {\n  background: var(--red-500);\n}\n.verification-section[_ngcontent-%COMP%]   .info-card.financial[_ngcontent-%COMP%]   .usage-text[_ngcontent-%COMP%] {\n  text-align: center;\n  font-size: 0.85rem;\n  color: var(--text-color-secondary);\n  margin-top: 0.5rem;\n}\n.verification-section[_ngcontent-%COMP%]   .active-demands[_ngcontent-%COMP%] {\n  margin-top: 1.5rem;\n}\n.verification-section[_ngcontent-%COMP%]   .active-demands[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  margin-bottom: 1rem;\n}\n.verification-section[_ngcontent-%COMP%]   .active-demands[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--primary-color);\n}\n.verification-section[_ngcontent-%COMP%]   .active-demands[_ngcontent-%COMP%]   .demands-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n.verification-section[_ngcontent-%COMP%]   .active-demands[_ngcontent-%COMP%]   .demands-list[_ngcontent-%COMP%]   .demand-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  padding: 0.75rem 1rem;\n  background: var(--surface-50);\n  border-radius: 6px;\n}\n.verification-section[_ngcontent-%COMP%]   .active-demands[_ngcontent-%COMP%]   .demands-list[_ngcontent-%COMP%]   .demand-item[_ngcontent-%COMP%]   .demand-amount[_ngcontent-%COMP%] {\n  font-weight: 600;\n  min-width: 120px;\n}\n.verification-section[_ngcontent-%COMP%]   .active-demands[_ngcontent-%COMP%]   .demands-list[_ngcontent-%COMP%]   .demand-item[_ngcontent-%COMP%]   .demand-date[_ngcontent-%COMP%] {\n  margin-left: auto;\n  font-size: 0.85rem;\n  color: var(--text-color-secondary);\n}\n.verification-section[_ngcontent-%COMP%]   .verification-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-top: 2rem;\n  padding-top: 1.5rem;\n  border-top: 1px solid var(--surface-border);\n}\n.form-section[_ngcontent-%COMP%]   .available-reminder[_ngcontent-%COMP%] {\n  background: var(--blue-50);\n  color: var(--blue-700);\n  padding: 1rem;\n  border-radius: 8px;\n  margin-bottom: 1.5rem;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.form-section[_ngcontent-%COMP%]   .available-reminder[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--blue-800);\n}\n.form-section[_ngcontent-%COMP%]   .demande-form[_ngcontent-%COMP%]   .p-field[_ngcontent-%COMP%] {\n  margin-bottom: 1.5rem;\n}\n.form-section[_ngcontent-%COMP%]   .demande-form[_ngcontent-%COMP%]   .p-field[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  margin-bottom: 0.5rem;\n  font-weight: 600;\n}\n.form-section[_ngcontent-%COMP%]   .demande-form[_ngcontent-%COMP%]   .p-field[_ngcontent-%COMP%]   .p-hint[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 0.5rem;\n  font-size: 0.85rem;\n  color: var(--text-color-secondary);\n}\n.form-section[_ngcontent-%COMP%]   .summary-box[_ngcontent-%COMP%] {\n  background: var(--surface-100);\n  border-radius: 8px;\n  padding: 1.5rem;\n  margin: 1.5rem 0;\n}\n.form-section[_ngcontent-%COMP%]   .summary-box[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin: 0 0 1rem 0;\n  color: var(--primary-color);\n}\n.form-section[_ngcontent-%COMP%]   .summary-box[_ngcontent-%COMP%]   .summary-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));\n  gap: 1rem;\n}\n.form-section[_ngcontent-%COMP%]   .summary-box[_ngcontent-%COMP%]   .summary-grid[_ngcontent-%COMP%]   .summary-item[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.85rem;\n  color: var(--text-color-secondary);\n}\n.form-section[_ngcontent-%COMP%]   .summary-box[_ngcontent-%COMP%]   .summary-grid[_ngcontent-%COMP%]   .summary-item[_ngcontent-%COMP%]   .value[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.form-section[_ngcontent-%COMP%]   .summary-box[_ngcontent-%COMP%]   .summary-grid[_ngcontent-%COMP%]   .summary-item[_ngcontent-%COMP%]   .value.highlight[_ngcontent-%COMP%] {\n  color: var(--primary-color);\n  font-size: 1.1rem;\n}\n.form-section[_ngcontent-%COMP%]   .form-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  margin-top: 2rem;\n  padding-top: 1.5rem;\n  border-top: 1px solid var(--surface-border);\n}\n.confirmation-section[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 2rem;\n}\n.confirmation-section[_ngcontent-%COMP%]   .success-icon[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 4rem;\n  color: var(--green-500);\n}\n.confirmation-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  color: var(--green-700);\n  margin: 1rem 0;\n}\n.confirmation-section[_ngcontent-%COMP%]   .confirmation-details[_ngcontent-%COMP%] {\n  background: var(--surface-100);\n  border-radius: 8px;\n  padding: 1.5rem;\n  margin: 2rem 0;\n  display: inline-block;\n  text-align: left;\n}\n.confirmation-section[_ngcontent-%COMP%]   .confirmation-details[_ngcontent-%COMP%]   .detail-item[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0.5rem 0;\n  min-width: 250px;\n}\n.confirmation-section[_ngcontent-%COMP%]   .confirmation-details[_ngcontent-%COMP%]   .detail-item[_ngcontent-%COMP%]:not(:last-child) {\n  border-bottom: 1px solid var(--surface-border);\n}\n.confirmation-section[_ngcontent-%COMP%]   .confirmation-details[_ngcontent-%COMP%]   .detail-item[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n}\n.confirmation-section[_ngcontent-%COMP%]   .confirmation-details[_ngcontent-%COMP%]   .detail-item[_ngcontent-%COMP%]   .value[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.confirmation-section[_ngcontent-%COMP%]   .next-steps[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  margin: 1.5rem 0;\n}\n.confirmation-section[_ngcontent-%COMP%]   .next-steps[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  margin-right: 0.5rem;\n  color: var(--blue-500);\n}\n.confirmation-section[_ngcontent-%COMP%]   .confirmation-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  gap: 1rem;\n  margin-top: 2rem;\n}\n@media (max-width: 768px) {\n  .verification-section[_ngcontent-%COMP%]   .info-card.financial[_ngcontent-%COMP%]   .financial-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .verification-section[_ngcontent-%COMP%]   .verification-actions[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 1rem;\n  }\n  .form-section[_ngcontent-%COMP%]   .form-actions[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 1rem;\n  }\n  .confirmation-section[_ngcontent-%COMP%]   .confirmation-actions[_ngcontent-%COMP%] {\n    flex-direction: column;\n  }\n}\n.char-counter[_ngcontent-%COMP%] {\n  text-align: right;\n  margin-top: 0.25rem;\n  font-size: 0.85rem;\n}\n.char-counter[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n}\n.char-counter[_ngcontent-%COMP%]   span.valid[_ngcontent-%COMP%] {\n  color: var(--green-600);\n  font-weight: 600;\n}\n.char-counter[_ngcontent-%COMP%]   span.invalid[_ngcontent-%COMP%] {\n  color: var(--orange-600);\n}\n.valid-icon[_ngcontent-%COMP%] {\n  background: var(--green-50);\n  border-color: var(--green-200);\n}\n.validation-status[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n  margin: 1rem 0;\n  padding: 1rem;\n  background: var(--surface-50);\n  border-radius: 8px;\n}\n.validation-status[_ngcontent-%COMP%]   .validation-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  color: var(--text-color-secondary);\n}\n.validation-status[_ngcontent-%COMP%]   .validation-item[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  color: var(--surface-400);\n}\n.validation-status[_ngcontent-%COMP%]   .validation-item.valid[_ngcontent-%COMP%] {\n  color: var(--green-700);\n}\n.validation-status[_ngcontent-%COMP%]   .validation-item.valid[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--green-500);\n}\n.summary-item[_ngcontent-%COMP%]   .value.valid[_ngcontent-%COMP%] {\n  color: var(--green-600);\n}\n.summary-item[_ngcontent-%COMP%]   .value.invalid[_ngcontent-%COMP%] {\n  color: var(--red-600);\n}\n.p-error[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 0.25rem;\n  font-size: 0.85rem;\n}\n.p-hint[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.25rem;\n  margin-top: 0.5rem;\n  font-size: 0.85rem;\n  color: var(--text-color-secondary);\n}\n.p-hint[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n}\n.authorization-check[_ngcontent-%COMP%], \n.not-authorized[_ngcontent-%COMP%] {\n  min-height: 60vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 2rem;\n}\n.loading-authorization[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 1.5rem;\n  padding: 3rem;\n  text-align: center;\n}\n.loading-authorization[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  font-size: 1.1rem;\n}\n.not-authorized-content[_ngcontent-%COMP%] {\n  text-align: center;\n  max-width: 600px;\n  margin: 0 auto;\n  padding: 2rem;\n}\n.not-authorized-content[_ngcontent-%COMP%]   .icon-container[_ngcontent-%COMP%] {\n  width: 100px;\n  height: 100px;\n  border-radius: 50%;\n  background:\n    linear-gradient(\n      135deg,\n      var(--orange-100) 0%,\n      var(--red-100) 100%);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin: 0 auto 1.5rem;\n}\n.not-authorized-content[_ngcontent-%COMP%]   .icon-container[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  color: var(--orange-600);\n}\n.not-authorized-content[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  color: var(--text-color);\n  margin: 0 0 1rem 0;\n  font-size: 1.75rem;\n}\n.not-authorized-content[_ngcontent-%COMP%]   .message[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  font-size: 1.1rem;\n  line-height: 1.6;\n  margin-bottom: 2rem;\n}\n.not-authorized-content[_ngcontent-%COMP%]   .info-box[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n  text-align: left;\n  background: var(--blue-50);\n  border: 1px solid var(--blue-200);\n  border-radius: 8px;\n  padding: 1rem 1.5rem;\n  margin-bottom: 2rem;\n}\n.not-authorized-content[_ngcontent-%COMP%]   .info-box[_ngcontent-%COMP%]    > i[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  color: var(--blue-500);\n  flex-shrink: 0;\n  margin-top: 0.25rem;\n}\n.not-authorized-content[_ngcontent-%COMP%]   .info-box[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--blue-700);\n  display: block;\n  margin-bottom: 0.5rem;\n}\n.not-authorized-content[_ngcontent-%COMP%]   .info-box[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  margin: 0;\n  font-size: 0.9rem;\n  line-height: 1.5;\n}\n.not-authorized-content[_ngcontent-%COMP%]   .actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n  justify-content: center;\n  flex-wrap: wrap;\n}\n.manual-matricule-card[_ngcontent-%COMP%] {\n  max-width: 600px;\n  margin: 0 auto;\n}\n.manual-matricule-section[_ngcontent-%COMP%]   .info-banner[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n  background: var(--blue-50);\n  border: 1px solid var(--blue-200);\n  border-radius: 8px;\n  padding: 1rem 1.5rem;\n  margin-bottom: 1.5rem;\n}\n.manual-matricule-section[_ngcontent-%COMP%]   .info-banner[_ngcontent-%COMP%]    > i[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  color: var(--blue-500);\n  flex-shrink: 0;\n}\n.manual-matricule-section[_ngcontent-%COMP%]   .info-banner[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: block;\n  color: var(--blue-700);\n  margin-bottom: 0.25rem;\n}\n.manual-matricule-section[_ngcontent-%COMP%]   .info-banner[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--text-color-secondary);\n  font-size: 0.9rem;\n}\n.manual-matricule-section[_ngcontent-%COMP%]   .search-form[_ngcontent-%COMP%] {\n  margin-bottom: 1rem;\n}\n.manual-matricule-section[_ngcontent-%COMP%]   .search-form[_ngcontent-%COMP%]   .p-field[_ngcontent-%COMP%] {\n  margin-bottom: 0;\n}\n.manual-matricule-section[_ngcontent-%COMP%]   .search-form[_ngcontent-%COMP%]   .p-field[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  margin-bottom: 0.5rem;\n  font-weight: 500;\n}\n.manual-matricule-section[_ngcontent-%COMP%]   .search-error[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n}\n.manual-matricule-section[_ngcontent-%COMP%]   .help-section[_ngcontent-%COMP%] {\n  background: var(--surface-50);\n  border-radius: 8px;\n  padding: 1rem 1.5rem;\n}\n.manual-matricule-section[_ngcontent-%COMP%]   .help-section[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin: 0 0 0.75rem 0;\n  color: var(--text-color);\n  font-size: 1rem;\n}\n.manual-matricule-section[_ngcontent-%COMP%]   .help-section[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  margin-right: 0.5rem;\n  color: var(--primary-color);\n}\n.manual-matricule-section[_ngcontent-%COMP%]   .help-section[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  margin: 0;\n  padding-left: 1.5rem;\n}\n.manual-matricule-section[_ngcontent-%COMP%]   .help-section[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  margin-bottom: 0.5rem;\n}\n.manual-matricule-section[_ngcontent-%COMP%]   .help-section[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:last-child {\n  margin-bottom: 0;\n}\n.manual-matricule-section[_ngcontent-%COMP%]   .actions[_ngcontent-%COMP%] {\n  margin-top: 1.5rem;\n  text-align: center;\n}\n.manual-matricule-badge[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  background: var(--orange-50);\n  border: 1px solid var(--orange-200);\n  border-radius: 8px;\n  padding: 0.75rem 1rem;\n  margin-bottom: 1rem;\n}\n.manual-matricule-badge[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--orange-500);\n}\n.manual-matricule-badge[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: var(--orange-700);\n  font-size: 0.9rem;\n}\n.manual-matricule-badge[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--orange-800);\n}\n.loading-section[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 3rem;\n}\n.loading-section[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n  color: var(--text-color-secondary);\n}\n.error-section[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 2rem;\n}\n.error-section[_ngcontent-%COMP%]   .error-icon[_ngcontent-%COMP%] {\n  width: 80px;\n  height: 80px;\n  border-radius: 50%;\n  background: var(--red-100);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin: 0 auto 1.5rem;\n}\n.error-section[_ngcontent-%COMP%]   .error-icon[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 2.5rem;\n  color: var(--red-500);\n}\n.error-section[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0 0 0.5rem 0;\n  color: var(--text-color);\n}\n.error-section[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  margin-bottom: 1.5rem;\n}\n.error-section[_ngcontent-%COMP%]   .error-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.5rem;\n  justify-content: center;\n}\n/*# sourceMappingURL=demande-avance-salaire.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DemandeAvanceSalaireComponent, { className: "DemandeAvanceSalaireComponent", filePath: "src/app/pages/dashboard/admin/demande-avance-salaire/demande-avance-salaire.component.ts", lineNumber: 55 });
})();

export {
  DemandeAvanceSalaireComponent
};
//# sourceMappingURL=chunk-SMND6ES2.js.map
