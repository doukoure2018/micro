import {
  FileUpload,
  FileUploadModule
} from "./chunk-ZNXRKGHP.js";
import {
  TabPanel,
  TabView,
  TabViewModule
} from "./chunk-I3MJ27E7.js";
import {
  JavaDatePipe
} from "./chunk-O2RK2BKY.js";
import {
  MessagesModule
} from "./chunk-MWCM7PKA.js";
import {
  ConfirmDialog,
  ConfirmDialogModule
} from "./chunk-JQ4E7TJM.js";
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
import {
  Toast,
  ToastModule
} from "./chunk-6SRYYUT2.js";
import {
  InputSwitchModule
} from "./chunk-5EDISLF5.js";
import {
  ProgressBar,
  ProgressBarModule
} from "./chunk-WQ2EPPBK.js";
import {
  Divider,
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
  Card,
  CardModule
} from "./chunk-H46GQ57A.js";
import "./chunk-JGOABXTK.js";
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
import "./chunk-WIQZFAVH.js";
import "./chunk-CCBQFN2J.js";
import "./chunk-36C7KO53.js";
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
  Badge,
  BadgeModule,
  Button,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import "./chunk-AP3OAIHW.js";
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
import "./chunk-ZRELZ6R7.js";
import "./chunk-BMYIFZHZ.js";
import "./chunk-W3K3GK4Z.js";
import {
  CommonModule
} from "./chunk-SQQPVFHK.js";
import {
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
  ɵɵpropertyInterpolate1,
  ɵɵpureFunction0,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeHtml,
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

// src/app/pages/dashboard/admin/gestion-personnel/gestion-personnel.component.ts
var _c0 = () => ({ width: "180px" });
var _c1 = () => ({ width: "300px" });
var _c2 = () => [10, 25, 50, 100];
var _c3 = () => ({ "min-width": "60rem" });
var _c4 = () => ({ width: "700px" });
var _c5 = () => ({ width: "100%" });
var _c6 = () => ({ height: "6px" });
function GestionPersonnelComponent_ng_template_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 47);
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2, "Fichier Personnel");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "p-badge", 48);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("value", ctx_r0.countPersonnels().toString());
  }
}
function GestionPersonnelComponent_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "i", 49);
    \u0275\u0275listener("click", function GestionPersonnelComponent_Conditional_22_Template_i_click_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.clearSearch());
    });
    \u0275\u0275elementEnd();
  }
}
function GestionPersonnelComponent_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 22);
    \u0275\u0275element(1, "i", 50);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p-button", 51);
    \u0275\u0275listener("onClick", function GestionPersonnelComponent_Conditional_31_Template_p_button_onClick_4_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.clearSearch());
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", ctx_r0.countFilteredPersonnels(), ' r\xE9sultat(s) pour "', ctx_r0.searchTerm(), '" ');
    \u0275\u0275advance();
    \u0275\u0275property("text", true);
  }
}
function GestionPersonnelComponent_ng_template_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 52);
    \u0275\u0275text(2, " Matricule ");
    \u0275\u0275element(3, "p-sortIcon", 53);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "th", 54);
    \u0275\u0275text(5, " Nom ");
    \u0275\u0275element(6, "p-sortIcon", 55);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 56);
    \u0275\u0275text(8, " Pr\xE9nom ");
    \u0275\u0275element(9, "p-sortIcon", 57);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 58);
    \u0275\u0275text(11, " Statut ");
    \u0275\u0275element(12, "p-sortIcon", 59);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th", 60);
    \u0275\u0275text(14, "Date cr\xE9ation");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th", 61);
    \u0275\u0275text(16, "Actions");
    \u0275\u0275elementEnd()();
  }
}
function GestionPersonnelComponent_ng_template_34_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 68);
    \u0275\u0275listener("onClick", function GestionPersonnelComponent_ng_template_34_Conditional_15_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r4);
      const personnel_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.desactiverPersonnel(personnel_r5));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const personnel_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("text", true)("rounded", true)("loading", ctx_r0.isUpdatingStatut() === personnel_r5.id);
  }
}
function GestionPersonnelComponent_ng_template_34_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 69);
    \u0275\u0275listener("onClick", function GestionPersonnelComponent_ng_template_34_Conditional_16_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r6);
      const personnel_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.activerPersonnel(personnel_r5));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const personnel_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("text", true)("rounded", true)("loading", ctx_r0.isUpdatingStatut() === personnel_r5.id);
  }
}
function GestionPersonnelComponent_ng_template_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "span", 62);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td");
    \u0275\u0275element(5, "span", 63);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275element(7, "span", 63);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td");
    \u0275\u0275element(9, "p-tag", 64);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td");
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "javaDate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td")(14, "div", 65);
    \u0275\u0275template(15, GestionPersonnelComponent_ng_template_34_Conditional_15_Template, 1, 3, "p-button", 66)(16, GestionPersonnelComponent_ng_template_34_Conditional_16_Template, 1, 3, "p-button", 67);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const personnel_r5 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classProp("inactive-row", personnel_r5.statut === "INACTIVE");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(personnel_r5.matricule);
    \u0275\u0275advance(2);
    \u0275\u0275property("innerHTML", ctx_r0.highlightSearch(personnel_r5.nom), \u0275\u0275sanitizeHtml);
    \u0275\u0275advance(2);
    \u0275\u0275property("innerHTML", ctx_r0.highlightSearch(personnel_r5.prenom), \u0275\u0275sanitizeHtml);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r0.getStatutLabel(personnel_r5.statut))("severity", ctx_r0.getStatutSeverity(personnel_r5.statut));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(12, 9, personnel_r5.createdAt, "dd/MM/yyyy HH:mm"));
    \u0275\u0275advance(4);
    \u0275\u0275conditional(personnel_r5.statut === "ACTIVE" ? 15 : 16);
  }
}
function GestionPersonnelComponent_ng_template_35_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1('Aucun personnel trouv\xE9 pour "', ctx_r0.searchTerm(), '"');
  }
}
function GestionPersonnelComponent_ng_template_35_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Aucun personnel trouv\xE9");
    \u0275\u0275elementEnd();
  }
}
function GestionPersonnelComponent_ng_template_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 70);
    \u0275\u0275element(2, "i", 71);
    \u0275\u0275template(3, GestionPersonnelComponent_ng_template_35_Conditional_3_Template, 2, 1, "span")(4, GestionPersonnelComponent_ng_template_35_Conditional_4_Template, 2, 0, "span");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r0.searchTerm() ? 3 : 4);
  }
}
function GestionPersonnelComponent_ng_template_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 72);
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2, "Fichier Salaire");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "p-badge", 73);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("value", ctx_r0.countAvances().toString());
  }
}
function GestionPersonnelComponent_Conditional_68_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 78);
    \u0275\u0275element(1, "i", 79);
    \u0275\u0275elementStart(2, "div", 80)(3, "strong");
    \u0275\u0275text(4, "Import bloqu\xE9");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r0.salaireImportMessage());
  }
}
function GestionPersonnelComponent_Conditional_68_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 32)(1, "p-message", 74);
    \u0275\u0275template(2, GestionPersonnelComponent_Conditional_68_ng_template_2_Template, 7, 1, "ng-template", 75);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 76)(4, "p-button", 77);
    \u0275\u0275listener("onClick", function GestionPersonnelComponent_Conditional_68_Template_p_button_onClick_4_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.confirmResetAvancesSalaire());
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(3, _c5));
    \u0275\u0275advance(3);
    \u0275\u0275property("loading", ctx_r0.isResetting());
  }
}
function GestionPersonnelComponent_Conditional_69_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 83);
    \u0275\u0275element(1, "i", 84);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Glissez-d\xE9posez votre fichier Excel ici");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5, "ou cliquez pour s\xE9lectionner");
    \u0275\u0275elementEnd()();
  }
}
function GestionPersonnelComponent_Conditional_69_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 82);
    \u0275\u0275element(1, "p-progressBar", 85);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "Import en cours...");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(2, _c6));
  }
}
function GestionPersonnelComponent_Conditional_69_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 33)(1, "p-fileUpload", 81);
    \u0275\u0275listener("uploadHandler", function GestionPersonnelComponent_Conditional_69_Template_p_fileUpload_uploadHandler_1_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onUploadSalaire($event));
    });
    \u0275\u0275template(2, GestionPersonnelComponent_Conditional_69_ng_template_2_Template, 6, 0, "ng-template", 75);
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, GestionPersonnelComponent_Conditional_69_Conditional_3_Template, 4, 3, "div", 82);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("maxFileSize", 1e7)("customUpload", true)("auto", false)("showUploadButton", true)("showCancelButton", true)("disabled", ctx_r0.isUploadingSalaire());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.isUploadingSalaire() ? 3 : -1);
  }
}
function GestionPersonnelComponent_Conditional_70_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 89)(1, "span", 90);
    \u0275\u0275text(2, "Erreurs:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 93);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p-button", 94);
    \u0275\u0275listener("onClick", function GestionPersonnelComponent_Conditional_70_Conditional_16_Template_p_button_onClick_5_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.showErrors("salaire"));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.statsSalaire().erreurs);
    \u0275\u0275advance();
    \u0275\u0275property("text", true);
  }
}
function GestionPersonnelComponent_Conditional_70_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 86)(1, "div", 87);
    \u0275\u0275element(2, "i");
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 88)(6, "div", 89)(7, "span", 90);
    \u0275\u0275text(8, "Total lignes:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 91);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 89)(12, "span", 90);
    \u0275\u0275text(13, "Import\xE9es:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span", 92);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(16, GestionPersonnelComponent_Conditional_70_Conditional_16_Template, 6, 2, "div", 89);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classProp("success", ctx_r0.statsSalaire().success)("partial", !ctx_r0.statsSalaire().success);
    \u0275\u0275advance(2);
    \u0275\u0275classMap(ctx_r0.statsSalaire().success ? "pi pi-check-circle" : "pi pi-exclamation-triangle");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.statsSalaire().success ? "Import r\xE9ussi" : "Import partiel");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r0.statsSalaire().total);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.statsSalaire().importees);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.statsSalaire().erreurs > 0 ? 16 : -1);
  }
}
function GestionPersonnelComponent_Conditional_73_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 95);
    \u0275\u0275listener("onClick", function GestionPersonnelComponent_Conditional_73_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.confirmResetAvancesSalaire());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275propertyInterpolate1("label", "Reset mensuel (", ctx_r0.countAvances(), " enregistrements)");
    \u0275\u0275property("outlined", true)("loading", ctx_r0.isResetting());
  }
}
function GestionPersonnelComponent_Conditional_80_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "i", 49);
    \u0275\u0275listener("click", function GestionPersonnelComponent_Conditional_80_Template_i_click_0_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.clearSearchSalaire());
    });
    \u0275\u0275elementEnd();
  }
}
function GestionPersonnelComponent_Conditional_86_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 22);
    \u0275\u0275element(1, "i", 50);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p-button", 51);
    \u0275\u0275listener("onClick", function GestionPersonnelComponent_Conditional_86_Template_p_button_onClick_4_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.clearSearchSalaire());
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", ctx_r0.countFilteredAvances(), ' r\xE9sultat(s) pour "', ctx_r0.searchTermSalaire(), '" ');
    \u0275\u0275advance();
    \u0275\u0275property("text", true);
  }
}
function GestionPersonnelComponent_ng_template_88_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 52);
    \u0275\u0275text(2, " Matricule ");
    \u0275\u0275element(3, "p-sortIcon", 53);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "th", 96);
    \u0275\u0275text(5, " Nom ");
    \u0275\u0275element(6, "p-sortIcon", 97);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 98);
    \u0275\u0275text(8, " Pr\xE9nom ");
    \u0275\u0275element(9, "p-sortIcon", 99);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 100);
    \u0275\u0275text(11, " Net \xE0 payer ");
    \u0275\u0275element(12, "p-sortIcon", 101);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th", 102);
    \u0275\u0275text(14, " Limite avance (50%) ");
    \u0275\u0275element(15, "p-sortIcon", 103);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 60);
    \u0275\u0275text(17, "Date import");
    \u0275\u0275elementEnd()();
  }
}
function GestionPersonnelComponent_ng_template_89_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "span", 62);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td");
    \u0275\u0275element(5, "span", 63);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275element(7, "span", 63);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td", 104)(9, "span", 105);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "td", 104)(12, "span", 106);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "td");
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "javaDate");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const avance_r13 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(avance_r13.matricule);
    \u0275\u0275advance(2);
    \u0275\u0275property("innerHTML", ctx_r0.highlightSearchSalaire(avance_r13.nomPersonnel), \u0275\u0275sanitizeHtml);
    \u0275\u0275advance(2);
    \u0275\u0275property("innerHTML", ctx_r0.highlightSearchSalaire(avance_r13.prenomPersonnel), \u0275\u0275sanitizeHtml);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.formatMontant(avance_r13.netAmount));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.formatMontant(avance_r13.netAmountLimit));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(16, 6, avance_r13.createdAt, "dd/MM/yyyy HH:mm"));
  }
}
function GestionPersonnelComponent_ng_template_90_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1('Aucune avance trouv\xE9e pour "', ctx_r0.searchTermSalaire(), '"');
  }
}
function GestionPersonnelComponent_ng_template_90_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Aucune avance salaire trouv\xE9e. Importez un fichier pour commencer.");
    \u0275\u0275elementEnd();
  }
}
function GestionPersonnelComponent_ng_template_90_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 107);
    \u0275\u0275element(2, "i", 71);
    \u0275\u0275template(3, GestionPersonnelComponent_ng_template_90_Conditional_3_Template, 2, 1, "span")(4, GestionPersonnelComponent_ng_template_90_Conditional_4_Template, 2, 0, "span");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r0.searchTermSalaire() ? 3 : 4);
  }
}
function GestionPersonnelComponent_Conditional_93_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 108);
    \u0275\u0275text(2, "Ligne");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th", 61);
    \u0275\u0275text(4, "Champ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th");
    \u0275\u0275text(6, "Valeur");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th");
    \u0275\u0275text(8, "Message d'erreur");
    \u0275\u0275elementEnd()();
  }
}
function GestionPersonnelComponent_Conditional_93_ng_template_2_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "code");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const error_r14 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(error_r14.valeur);
  }
}
function GestionPersonnelComponent_Conditional_93_ng_template_2_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 110);
    \u0275\u0275text(1, "(vide)");
    \u0275\u0275elementEnd();
  }
}
function GestionPersonnelComponent_Conditional_93_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "span", 109);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275template(7, GestionPersonnelComponent_Conditional_93_ng_template_2_Conditional_7_Template, 2, 1, "code")(8, GestionPersonnelComponent_Conditional_93_ng_template_2_Conditional_8_Template, 2, 0, "span", 110);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 111);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const error_r14 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(error_r14.ligne);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(error_r14.champ);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(error_r14.valeur ? 7 : 8);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(error_r14.message);
  }
}
function GestionPersonnelComponent_Conditional_93_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-table", 44);
    \u0275\u0275template(1, GestionPersonnelComponent_Conditional_93_ng_template_1_Template, 9, 0, "ng-template", 4)(2, GestionPersonnelComponent_Conditional_93_ng_template_2_Template, 11, 4, "ng-template", 24);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("value", ctx_r0.currentErrors());
  }
}
function GestionPersonnelComponent_Conditional_94_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 45);
    \u0275\u0275element(1, "i", 18);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "Aucune erreur \xE0 afficher");
    \u0275\u0275elementEnd()();
  }
}
function GestionPersonnelComponent_ng_template_95_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 112);
    \u0275\u0275listener("onClick", function GestionPersonnelComponent_ng_template_95_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.hideErrorDialog());
    });
    \u0275\u0275elementEnd();
  }
}
var GestionPersonnelComponent = class _GestionPersonnelComponent {
  salaireService = inject(UserService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  // ==================== SIGNALS ====================
  // État de chargement
  isLoadingPersonnel = signal(false);
  isLoadingSalaire = signal(false);
  isUploadingPersonnel = signal(false);
  isUploadingSalaire = signal(false);
  isResetting = signal(false);
  isUpdatingStatut = signal(null);
  // Données
  personnels = signal([]);
  avancesSalaire = signal([]);
  searchTerm = signal("");
  // ✅ NOUVEAU: Filtre par statut
  selectedStatutFilter = signal("ACTIVE");
  // Par défaut: actifs uniquement
  statutOptions = [
    { label: "Tous", value: "" },
    { label: "Actifs", value: "ACTIVE" },
    { label: "Inactifs", value: "INACTIVE" }
  ];
  // ✅ NOUVEAU: Compteurs par statut
  countByStatut = signal({});
  // ✅ NOUVEAU: Filtre par nom/prénom - Salaire
  searchTermSalaire = signal("");
  // Résultats d'import
  importResultPersonnel = signal(null);
  importResultSalaire = signal(null);
  // Dialog pour erreurs
  showErrorDialog = signal(false);
  currentErrors = signal([]);
  errorDialogTitle = signal("");
  // ==================== COMPUTED ====================
  // Compteurs
  countPersonnels = computed(() => this.personnels().length);
  countActivePersonnels = computed(() => this.countByStatut()["ACTIVE"] || 0);
  countInactivePersonnels = computed(() => this.countByStatut()["INACTIVE"] || 0);
  countAvances = computed(() => this.avancesSalaire().length);
  hasSalaireData = computed(() => this.avancesSalaire().length > 0);
  salaireImportMessage = computed(() => {
    if (this.hasSalaireData()) {
      const count = this.countAvances();
      return `${count} enregistrement(s) de salaire d\xE9j\xE0 import\xE9(s) pour ce mois. Vous devez d'abord r\xE9initialiser (reset mensuel) avant d'importer un nouveau fichier.`;
    }
    return "";
  });
  canImportSalaire = computed(() => !this.hasSalaireData());
  statsPersonnel = computed(() => {
    const result = this.importResultPersonnel();
    if (!result)
      return null;
    return {
      total: result.totalLignes,
      importees: result.lignesImportees,
      erreurs: result.lignesEnErreur,
      success: result.success
    };
  });
  statsSalaire = computed(() => {
    const result = this.importResultSalaire();
    if (!result)
      return null;
    return {
      total: result.totalLignes,
      importees: result.lignesImportees,
      erreurs: result.lignesEnErreur,
      success: result.success
    };
  });
  // ✅ NOUVEAU: Personnels filtrés par recherche
  filteredPersonnels = computed(() => {
    const search = this.searchTerm().toLowerCase().trim();
    const list = this.personnels();
    if (!search) {
      return list;
    }
    return list.filter((p) => p.nom?.toLowerCase().includes(search) || p.prenom?.toLowerCase().includes(search) || p.matricule?.toLowerCase().includes(search) || `${p.prenom} ${p.nom}`.toLowerCase().includes(search) || `${p.nom} ${p.prenom}`.toLowerCase().includes(search));
  });
  // ✅ NOUVEAU: Compteur des résultats filtrés
  countFilteredPersonnels = computed(() => this.filteredPersonnels().length);
  // ✅ NOUVEAU: Avances salaire filtrées par recherche
  filteredAvancesSalaire = computed(() => {
    const search = this.searchTermSalaire().toLowerCase().trim();
    const list = this.avancesSalaire();
    if (!search) {
      return list;
    }
    return list.filter((a) => a.nomPersonnel?.toLowerCase().includes(search) || a.prenomPersonnel?.toLowerCase().includes(search) || a.matricule?.toLowerCase().includes(search) || `${a.prenomPersonnel} ${a.nomPersonnel}`.toLowerCase().includes(search) || `${a.nomPersonnel} ${a.prenomPersonnel}`.toLowerCase().includes(search));
  });
  // ✅ NOUVEAU: Compteur des résultats filtrés - Salaire
  countFilteredAvances = computed(() => this.filteredAvancesSalaire().length);
  // ✅ NOUVEAU: Réinitialiser la recherche
  clearSearch() {
    this.searchTerm.set("");
  }
  // ✅ NOUVEAU: Handler pour la recherche
  onSearchChange(event) {
    const input = event.target;
    this.searchTerm.set(input.value);
  }
  // ✅ NOUVEAU: Réinitialiser la recherche - Salaire
  clearSearchSalaire() {
    this.searchTermSalaire.set("");
  }
  // ✅ NOUVEAU: Handler pour la recherche - Salaire
  onSearchChangeSalaire(event) {
    const input = event.target;
    this.searchTermSalaire.set(input.value);
  }
  // ✅ NOUVEAU: Surligner le texte recherché - Salaire
  highlightSearchSalaire(text) {
    if (!text)
      return "";
    const search = this.searchTermSalaire().trim();
    if (!search)
      return text;
    const regex = new RegExp(`(${this.escapeRegex(search)})`, "gi");
    return text.replace(regex, '<mark class="highlight">$1</mark>');
  }
  // ==================== LIFECYCLE ====================
  ngOnInit() {
    this.loadPersonnels();
    this.loadAvancesSalaire();
  }
  // ==================== CHARGEMENT DES DONNÉES ====================
  loadPersonnels() {
    this.isLoadingPersonnel.set(true);
    const statut = this.selectedStatutFilter();
    const timestamp = (/* @__PURE__ */ new Date()).getTime();
    let url = `${this.salaireService["server"]}/ecredit/salaire/info-personnel?_t=${timestamp}`;
    if (statut) {
      url += `&statut=${statut}`;
    }
    this.salaireService.getAllInfoPersonnel(statut || void 0).subscribe({
      next: (response) => {
        if (response.data?.personnels) {
          this.personnels.set(response.data.personnels);
        }
        if (response.data?.countByStatut) {
          this.countByStatut.set(response.data.countByStatut);
        }
        this.isLoadingPersonnel.set(false);
      },
      error: (error) => {
        console.error("Erreur chargement personnels:", error);
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Impossible de charger la liste du personnel"
        });
        this.isLoadingPersonnel.set(false);
      }
    });
  }
  // ✅ NOUVEAU: Changer le filtre de statut
  onStatutFilterChange(event) {
    this.selectedStatutFilter.set(event.value);
    this.loadPersonnels();
  }
  loadAvancesSalaire() {
    this.isLoadingSalaire.set(true);
    this.salaireService.getAllAvanceSalaire().subscribe({
      next: (response) => {
        if (response.data?.avances) {
          this.avancesSalaire.set(response.data.avances);
        } else {
          this.avancesSalaire.set([]);
        }
        this.isLoadingSalaire.set(false);
      },
      error: (error) => {
        console.error("Erreur chargement avances:", error);
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Impossible de charger les avances salaire"
        });
        this.avancesSalaire.set([]);
        this.isLoadingSalaire.set(false);
      }
    });
  }
  // ==================== GESTION STATUT PERSONNEL ====================
  /**
   * Toggle le statut d'un personnel (activer/désactiver)
   */
  togglePersonnelStatut(personnel) {
    const newStatut = personnel.statut === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const action = newStatut === "ACTIVE" ? "activer" : "d\xE9sactiver";
    this.confirmationService.confirm({
      message: `Voulez-vous ${action} ${personnel.prenom} ${personnel.nom} (${personnel.matricule}) ?`,
      header: "Confirmation",
      icon: newStatut === "ACTIVE" ? "pi pi-check-circle" : "pi pi-times-circle",
      acceptLabel: newStatut === "ACTIVE" ? "Activer" : "D\xE9sactiver",
      rejectLabel: "Annuler",
      acceptButtonStyleClass: newStatut === "ACTIVE" ? "p-button-success" : "p-button-danger",
      accept: () => {
        this.updatePersonnelStatut(personnel.id, newStatut);
      }
    });
  }
  /**
   * Mettre à jour le statut d'un personnel
   */
  updatePersonnelStatut(id, statut) {
    this.isUpdatingStatut.set(id);
    this.salaireService.updateInfoPersonnelStatut(id, statut).subscribe({
      next: (response) => {
        const action = statut === "ACTIVE" ? "activ\xE9" : "d\xE9sactiv\xE9";
        this.messageService.add({
          severity: "success",
          summary: "Succ\xE8s",
          detail: `Personnel ${action} avec succ\xE8s`
        });
        this.personnels.update((list) => list.map((p) => p.id === id ? __spreadProps(__spreadValues({}, p), { statut }) : p));
        this.loadPersonnels();
        this.isUpdatingStatut.set(null);
      },
      error: (error) => {
        console.error("Erreur mise \xE0 jour statut:", error);
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Impossible de mettre \xE0 jour le statut"
        });
        this.isUpdatingStatut.set(null);
      }
    });
  }
  /**
   * Activer un personnel directement
   */
  activerPersonnel(personnel) {
    this.confirmationService.confirm({
      message: `Voulez-vous r\xE9activer ${personnel.prenom} ${personnel.nom} (${personnel.matricule}) ?`,
      header: "R\xE9activer le personnel",
      icon: "pi pi-check-circle",
      acceptLabel: "R\xE9activer",
      rejectLabel: "Annuler",
      acceptButtonStyleClass: "p-button-success",
      accept: () => {
        this.updatePersonnelStatut(personnel.id, "ACTIVE");
      }
    });
  }
  /**
   * Désactiver un personnel (retraite, démission, etc.)
   */
  desactiverPersonnel(personnel) {
    this.confirmationService.confirm({
      message: `Voulez-vous d\xE9sactiver ${personnel.prenom} ${personnel.nom} (${personnel.matricule}) ?

Cette personne ne pourra plus faire de demande d'avance sur salaire.`,
      header: "D\xE9sactiver le personnel",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "D\xE9sactiver",
      rejectLabel: "Annuler",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => {
        this.updatePersonnelStatut(personnel.id, "INACTIVE");
      }
    });
  }
  // ==================== IMPORT FICHIER PERSONNEL ====================
  onUploadPersonnel(event) {
    const file = event.files[0];
    if (!file) {
      this.messageService.add({
        severity: "warn",
        summary: "Attention",
        detail: "Veuillez s\xE9lectionner un fichier"
      });
      return;
    }
    if (!this.isValidExcelFile(file)) {
      this.messageService.add({
        severity: "error",
        summary: "Erreur",
        detail: "Le fichier doit \xEAtre au format Excel (.xlsx ou .xls)"
      });
      return;
    }
    this.isUploadingPersonnel.set(true);
    this.importResultPersonnel.set(null);
    this.salaireService.importInfoPersonnel(file).subscribe({
      next: (response) => {
        const result = response.data?.importResult;
        this.importResultPersonnel.set(result);
        if (result?.success) {
          this.messageService.add({
            severity: "success",
            summary: "Succ\xE8s",
            detail: `Import termin\xE9: ${result.lignesImportees}/${result.totalLignes} lignes import\xE9es`
          });
        } else {
          this.messageService.add({
            severity: "warn",
            summary: "Import partiel",
            detail: `${result?.lignesImportees}/${result?.totalLignes} lignes import\xE9es, ${result?.lignesEnErreur} erreurs`
          });
        }
        this.loadPersonnels();
        this.isUploadingPersonnel.set(false);
      },
      error: (error) => {
        console.error("Erreur import personnel:", error);
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: error.message || "Erreur lors de l'import du fichier"
        });
        this.isUploadingPersonnel.set(false);
      }
    });
  }
  // ==================== IMPORT FICHIER SALAIRE ====================
  onUploadSalaire(event) {
    if (!this.canImportSalaire()) {
      this.messageService.add({
        severity: "warn",
        summary: "Import impossible",
        detail: "Vous devez d'abord r\xE9initialiser les donn\xE9es avant d'importer un nouveau fichier."
      });
      return;
    }
    const file = event.files[0];
    if (!file) {
      this.messageService.add({
        severity: "warn",
        summary: "Attention",
        detail: "Veuillez s\xE9lectionner un fichier"
      });
      return;
    }
    if (!this.isValidExcelFile(file)) {
      this.messageService.add({
        severity: "error",
        summary: "Erreur",
        detail: "Le fichier doit \xEAtre au format Excel (.xlsx ou .xls)"
      });
      return;
    }
    this.isUploadingSalaire.set(true);
    this.importResultSalaire.set(null);
    this.salaireService.importAvanceSalaire(file).subscribe({
      next: (response) => {
        const result = response.data?.importResult;
        this.importResultSalaire.set(result);
        if (result?.success) {
          this.messageService.add({
            severity: "success",
            summary: "Succ\xE8s",
            detail: `Import termin\xE9: ${result.lignesImportees}/${result.totalLignes} lignes import\xE9es`
          });
        } else {
          this.messageService.add({
            severity: "warn",
            summary: "Import partiel",
            detail: `${result?.lignesImportees}/${result?.totalLignes} lignes import\xE9es, ${result?.lignesEnErreur} erreurs`
          });
        }
        this.loadAvancesSalaire();
        this.isUploadingSalaire.set(false);
      },
      error: (error) => {
        console.error("Erreur import salaire:", error);
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: error.message || "Erreur lors de l'import du fichier"
        });
        this.isUploadingSalaire.set(false);
      }
    });
  }
  // ==================== AFFICHAGE DES ERREURS ====================
  showErrors(type) {
    const result = type === "personnel" ? this.importResultPersonnel() : this.importResultSalaire();
    if (result?.erreursValidation && result.erreursValidation.length > 0) {
      this.currentErrors.set(result.erreursValidation);
      this.errorDialogTitle.set(type === "personnel" ? "Erreurs d'import - Fichier Personnel" : "Erreurs d'import - Fichier Salaire");
      this.showErrorDialog.set(true);
    }
  }
  hideErrorDialog() {
    this.showErrorDialog.set(false);
    this.currentErrors.set([]);
  }
  // ==================== RESET MENSUEL ====================
  confirmResetAvancesSalaire() {
    this.confirmationService.confirm({
      message: `\xCAtes-vous s\xFBr de vouloir r\xE9initialiser les ${this.countAvances()} enregistrements de salaire? Cette action est irr\xE9versible.`,
      header: "Confirmation du reset mensuel",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Oui, r\xE9initialiser",
      rejectLabel: "Annuler",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => {
        this.resetAvancesSalaire();
      }
    });
  }
  resetAvancesSalaire() {
    this.isResetting.set(true);
    this.salaireService.truncateAvanceSalaire().subscribe({
      next: (response) => {
        this.messageService.add({
          severity: "success",
          summary: "Succ\xE8s",
          detail: "Toutes les avances salaire ont \xE9t\xE9 supprim\xE9es. Vous pouvez maintenant importer un nouveau fichier."
        });
        this.avancesSalaire.set([]);
        this.importResultSalaire.set(null);
        this.isResetting.set(false);
      },
      error: (error) => {
        console.error("Erreur reset avances:", error);
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Impossible de r\xE9initialiser les avances salaire"
        });
        this.isResetting.set(false);
      }
    });
  }
  // ==================== UTILITAIRES ====================
  isValidExcelFile(file) {
    const validExtensions = [".xlsx", ".xls"];
    const fileName = file.name.toLowerCase();
    return validExtensions.some((ext) => fileName.endsWith(ext));
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
  getStatutSeverity(statut) {
    switch (statut?.toUpperCase()) {
      case "ACTIVE":
        return "success";
      case "INACTIVE":
        return "danger";
      case "EN_ATTENTE":
        return "warn";
      case "APPROUVE":
      case "VALIDER":
      case "CONFIRMER":
        return "success";
      case "REJETE":
      case "REJET":
      case "ANNULLER":
        return "danger";
      default:
        return "info";
    }
  }
  getStatutLabel(statut) {
    switch (statut?.toUpperCase()) {
      case "ACTIVE":
        return "Actif";
      case "INACTIVE":
        return "Inactif";
      default:
        return statut || "Inconnu";
    }
  }
  // ✅ NOUVEAU: Surligner le texte recherché
  highlightSearch(text) {
    if (!text)
      return "";
    const search = this.searchTerm().trim();
    if (!search)
      return text;
    const regex = new RegExp(`(${this.escapeRegex(search)})`, "gi");
    return text.replace(regex, '<mark class="highlight">$1</mark>');
  }
  // Helper pour échapper les caractères spéciaux regex
  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  static \u0275fac = function GestionPersonnelComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GestionPersonnelComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _GestionPersonnelComponent, selectors: [["app-gestion-personnel"]], features: [\u0275\u0275ProvidersFeature([MessageService, ConfirmationService])], decls: 96, vars: 55, consts: [[1, "rh-container"], [1, "header-section"], [1, "pi", "pi-users"], [1, "subtitle"], ["pTemplate", "header"], [1, "tab-content"], ["header", "Importer le fichier du personnel", "styleClass", "mb-4"], ["header", "Liste du personnel"], [1, "table-header"], [1, "filter-section"], ["optionLabel", "label", "optionValue", "value", "placeholder", "Filtrer par statut", 3, "ngModelChange", "onChange", "options", "ngModel"], [1, "search-section"], [1, "p-input-icon-left", "p-input-icon-right"], [1, "pi", "pi-search"], ["type", "text", "pInputText", "", "placeholder", "Rechercher par nom, pr\xE9nom ou matricule...", 3, "input", "ngModel"], [1, "pi", "pi-times", "clear-icon"], [1, "statut-counters"], [1, "counter", "active"], [1, "pi", "pi-check-circle"], [1, "counter", "inactive"], [1, "pi", "pi-times-circle"], ["icon", "pi pi-refresh", "pTooltip", "Actualiser", 3, "onClick", "text", "loading"], [1, "search-results-info"], ["styleClass", "p-datatable-striped p-datatable-gridlines", "currentPageReportTemplate", "Affichage {first} \xE0 {last} sur {totalRecords} personnels", 3, "value", "paginator", "rows", "rowsPerPageOptions", "loading", "tableStyle", "showCurrentPageReport"], ["pTemplate", "body"], ["pTemplate", "emptymessage"], ["header", "Importer le fichier des salaires", "styleClass", "mb-4"], [1, "upload-section"], [1, "upload-info"], [1, "pi", "pi-info-circle"], [1, "format-table"], [1, "info-note"], [1, "import-blocked-message"], [1, "upload-zone"], [1, "import-result", 3, "success", "partial"], [1, "actions-bar", "mb-3"], ["icon", "pi pi-refresh", "label", "Actualiser", 3, "onClick", "text", "loading"], ["icon", "pi pi-trash", "severity", "danger", "pTooltip", "Supprimer toutes les avances pour permettre un nouvel import", 3, "label", "outlined", "loading"], ["header", "Liste des avances salaire"], [1, "result-counter"], [1, "counter"], ["styleClass", "p-datatable-striped p-datatable-gridlines", "currentPageReportTemplate", "Affichage {first} \xE0 {last} sur {totalRecords} avances", 3, "value", "paginator", "rows", "rowsPerPageOptions", "loading", "tableStyle", "showCurrentPageReport"], [3, "visibleChange", "onHide", "header", "visible", "modal", "dismissableMask"], [1, "error-dialog-content"], ["styleClass", "p-datatable-sm", 3, "value"], [1, "no-errors"], ["pTemplate", "footer"], [1, "pi", "pi-user-plus", "mr-2"], ["severity", "info", 1, "ml-2", 3, "value"], [1, "pi", "pi-times", "clear-icon", 3, "click"], [1, "pi", "pi-filter"], ["icon", "pi pi-times", "label", "Effacer", "size", "small", 3, "onClick", "text"], ["pSortableColumn", "matricule", 2, "width", "100px"], ["field", "matricule"], ["pSortableColumn", "nom"], ["field", "nom"], ["pSortableColumn", "prenom"], ["field", "prenom"], ["pSortableColumn", "statut", 2, "width", "120px"], ["field", "statut"], [2, "width", "150px"], [2, "width", "120px"], [1, "matricule-badge"], [3, "innerHTML"], [3, "value", "severity"], [1, "action-buttons"], ["icon", "pi pi-user-minus", "severity", "danger", "size", "small", "pTooltip", "D\xE9sactiver (retraite, d\xE9mission...)", "tooltipPosition", "left", 3, "text", "rounded", "loading"], ["icon", "pi pi-user-plus", "severity", "success", "size", "small", "pTooltip", "R\xE9activer", "tooltipPosition", "left", 3, "text", "rounded", "loading"], ["icon", "pi pi-user-minus", "severity", "danger", "size", "small", "pTooltip", "D\xE9sactiver (retraite, d\xE9mission...)", "tooltipPosition", "left", 3, "onClick", "text", "rounded", "loading"], ["icon", "pi pi-user-plus", "severity", "success", "size", "small", "pTooltip", "R\xE9activer", "tooltipPosition", "left", 3, "onClick", "text", "rounded", "loading"], ["colspan", "7", 1, "empty-message"], [1, "pi", "pi-inbox"], [1, "pi", "pi-wallet", "mr-2"], ["severity", "success", 1, "ml-2", 3, "value"], ["severity", "warn"], ["pTemplate", "content"], [1, "reset-action"], ["icon", "pi pi-refresh", "label", "R\xE9initialiser maintenant", "severity", "danger", 3, "onClick", "loading"], [1, "blocked-content"], [1, "pi", "pi-lock"], [1, "blocked-text"], ["mode", "advanced", "name", "file", "accept", ".xlsx,.xls", "chooseLabel", "Choisir fichier", "uploadLabel", "Importer", "cancelLabel", "Annuler", 3, "uploadHandler", "maxFileSize", "customUpload", "auto", "showUploadButton", "showCancelButton", "disabled"], [1, "upload-progress"], [1, "upload-placeholder"], [1, "pi", "pi-cloud-upload"], ["mode", "indeterminate"], [1, "import-result"], [1, "result-header"], [1, "result-stats"], [1, "stat"], [1, "label"], [1, "value"], [1, "value", "success"], [1, "value", "error"], ["icon", "pi pi-eye", "severity", "danger", "size", "small", "pTooltip", "Voir les erreurs", 3, "onClick", "text"], ["icon", "pi pi-trash", "severity", "danger", "pTooltip", "Supprimer toutes les avances pour permettre un nouvel import", 3, "onClick", "label", "outlined", "loading"], ["pSortableColumn", "nomPersonnel"], ["field", "nomPersonnel"], ["pSortableColumn", "prenomPersonnel"], ["field", "prenomPersonnel"], ["pSortableColumn", "netAmount", 2, "width", "150px"], ["field", "netAmount"], ["pSortableColumn", "netAmountLimit", 2, "width", "150px"], ["field", "netAmountLimit"], [1, "text-right"], [1, "montant"], [1, "montant", "limite"], ["colspan", "6", 1, "empty-message"], [2, "width", "80px"], [1, "error-line"], [1, "no-data"], [1, "error-message"], ["label", "Fermer", "icon", "pi pi-times", 3, "onClick"]], template: function GestionPersonnelComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "p-toast")(1, "p-confirmDialog");
      \u0275\u0275elementStart(2, "div", 0)(3, "div", 1)(4, "h2");
      \u0275\u0275element(5, "i", 2);
      \u0275\u0275text(6, " Gestion des Ressources Humaines");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "p", 3);
      \u0275\u0275text(8, "Import et gestion des fichiers du personnel et des salaires");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(9, "p-tabView")(10, "p-tabPanel");
      \u0275\u0275template(11, GestionPersonnelComponent_ng_template_11_Template, 4, 1, "ng-template", 4);
      \u0275\u0275elementStart(12, "div", 5);
      \u0275\u0275element(13, "p-card", 6);
      \u0275\u0275elementStart(14, "p-card", 7)(15, "div", 8)(16, "div", 9)(17, "p-dropdown", 10);
      \u0275\u0275twoWayListener("ngModelChange", function GestionPersonnelComponent_Template_p_dropdown_ngModelChange_17_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.selectedStatutFilter, $event) || (ctx.selectedStatutFilter = $event);
        return $event;
      });
      \u0275\u0275listener("onChange", function GestionPersonnelComponent_Template_p_dropdown_onChange_17_listener($event) {
        return ctx.onStatutFilterChange($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(18, "div", 11)(19, "span", 12);
      \u0275\u0275element(20, "i", 13);
      \u0275\u0275elementStart(21, "input", 14);
      \u0275\u0275listener("input", function GestionPersonnelComponent_Template_input_input_21_listener($event) {
        return ctx.onSearchChange($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275template(22, GestionPersonnelComponent_Conditional_22_Template, 1, 0, "i", 15);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(23, "div", 16)(24, "span", 17);
      \u0275\u0275element(25, "i", 18);
      \u0275\u0275text(26);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "span", 19);
      \u0275\u0275element(28, "i", 20);
      \u0275\u0275text(29);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(30, "p-button", 21);
      \u0275\u0275listener("onClick", function GestionPersonnelComponent_Template_p_button_onClick_30_listener() {
        return ctx.loadPersonnels();
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275template(31, GestionPersonnelComponent_Conditional_31_Template, 5, 3, "div", 22);
      \u0275\u0275elementStart(32, "p-table", 23);
      \u0275\u0275template(33, GestionPersonnelComponent_ng_template_33_Template, 17, 0, "ng-template", 4)(34, GestionPersonnelComponent_ng_template_34_Template, 17, 12, "ng-template", 24)(35, GestionPersonnelComponent_ng_template_35_Template, 5, 1, "ng-template", 25);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(36, "p-tabPanel");
      \u0275\u0275template(37, GestionPersonnelComponent_ng_template_37_Template, 4, 1, "ng-template", 4);
      \u0275\u0275elementStart(38, "div", 5)(39, "p-card", 26)(40, "div", 27)(41, "div", 28)(42, "h4");
      \u0275\u0275element(43, "i", 29);
      \u0275\u0275text(44, " Format attendu du fichier Excel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(45, "table", 30)(46, "thead")(47, "tr")(48, "th");
      \u0275\u0275text(49, "Matricule");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(50, "th");
      \u0275\u0275text(51, "NET A PAYER");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(52, "tbody")(53, "tr")(54, "td");
      \u0275\u0275text(55, "1");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(56, "td");
      \u0275\u0275text(57, "7 259 220");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(58, "tr")(59, "td");
      \u0275\u0275text(60, "13");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(61, "td");
      \u0275\u0275text(62, "5 931 300");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(63, "p", 31);
      \u0275\u0275element(64, "i", 29);
      \u0275\u0275elementStart(65, "span");
      \u0275\u0275text(66, "La limite d'avance (50% du salaire net) est calcul\xE9e automatiquement.");
      \u0275\u0275elementEnd()()();
      \u0275\u0275element(67, "p-divider");
      \u0275\u0275template(68, GestionPersonnelComponent_Conditional_68_Template, 5, 4, "div", 32)(69, GestionPersonnelComponent_Conditional_69_Template, 4, 7, "div", 33)(70, GestionPersonnelComponent_Conditional_70_Template, 17, 10, "div", 34);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(71, "div", 35)(72, "p-button", 36);
      \u0275\u0275listener("onClick", function GestionPersonnelComponent_Template_p_button_onClick_72_listener() {
        return ctx.loadAvancesSalaire();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275template(73, GestionPersonnelComponent_Conditional_73_Template, 1, 4, "p-button", 37);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(74, "p-card", 38)(75, "div", 8)(76, "div", 11)(77, "span", 12);
      \u0275\u0275element(78, "i", 13);
      \u0275\u0275elementStart(79, "input", 14);
      \u0275\u0275listener("input", function GestionPersonnelComponent_Template_input_input_79_listener($event) {
        return ctx.onSearchChangeSalaire($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275template(80, GestionPersonnelComponent_Conditional_80_Template, 1, 0, "i", 15);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(81, "div", 39)(82, "span", 40);
      \u0275\u0275element(83, "i", 2);
      \u0275\u0275text(84);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(85, "p-button", 21);
      \u0275\u0275listener("onClick", function GestionPersonnelComponent_Template_p_button_onClick_85_listener() {
        return ctx.loadAvancesSalaire();
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275template(86, GestionPersonnelComponent_Conditional_86_Template, 5, 3, "div", 22);
      \u0275\u0275elementStart(87, "p-table", 41);
      \u0275\u0275template(88, GestionPersonnelComponent_ng_template_88_Template, 18, 0, "ng-template", 4)(89, GestionPersonnelComponent_ng_template_89_Template, 17, 9, "ng-template", 24)(90, GestionPersonnelComponent_ng_template_90_Template, 5, 1, "ng-template", 25);
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275elementStart(91, "p-dialog", 42);
      \u0275\u0275twoWayListener("visibleChange", function GestionPersonnelComponent_Template_p_dialog_visibleChange_91_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.showErrorDialog, $event) || (ctx.showErrorDialog = $event);
        return $event;
      });
      \u0275\u0275listener("onHide", function GestionPersonnelComponent_Template_p_dialog_onHide_91_listener() {
        return ctx.hideErrorDialog();
      });
      \u0275\u0275elementStart(92, "div", 43);
      \u0275\u0275template(93, GestionPersonnelComponent_Conditional_93_Template, 3, 1, "p-table", 44)(94, GestionPersonnelComponent_Conditional_94_Template, 4, 0, "div", 45);
      \u0275\u0275elementEnd();
      \u0275\u0275template(95, GestionPersonnelComponent_ng_template_95_Template, 1, 0, "ng-template", 46);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(17);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(47, _c0));
      \u0275\u0275property("options", ctx.statutOptions);
      \u0275\u0275twoWayProperty("ngModel", ctx.selectedStatutFilter);
      \u0275\u0275advance(4);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(48, _c1));
      \u0275\u0275property("ngModel", ctx.searchTerm());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.searchTerm() ? 22 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate1(" ", ctx.countActivePersonnels(), " actifs ");
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1(" ", ctx.countInactivePersonnels(), " inactifs ");
      \u0275\u0275advance();
      \u0275\u0275property("text", true)("loading", ctx.isLoadingPersonnel());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.searchTerm() ? 31 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("value", ctx.filteredPersonnels())("paginator", true)("rows", 10)("rowsPerPageOptions", \u0275\u0275pureFunction0(49, _c2))("loading", ctx.isLoadingPersonnel())("tableStyle", \u0275\u0275pureFunction0(50, _c3))("showCurrentPageReport", true);
      \u0275\u0275advance(36);
      \u0275\u0275conditional(ctx.hasSalaireData() ? 68 : 69);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.statsSalaire() ? 70 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275property("text", true)("loading", ctx.isLoadingSalaire());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.hasSalaireData() ? 73 : -1);
      \u0275\u0275advance(6);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(51, _c1));
      \u0275\u0275property("ngModel", ctx.searchTermSalaire());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.searchTermSalaire() ? 80 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate1(" ", ctx.countAvances(), " enregistrement(s) ");
      \u0275\u0275advance();
      \u0275\u0275property("text", true)("loading", ctx.isLoadingSalaire());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.searchTermSalaire() ? 86 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("value", ctx.filteredAvancesSalaire())("paginator", true)("rows", 10)("rowsPerPageOptions", \u0275\u0275pureFunction0(52, _c2))("loading", ctx.isLoadingSalaire())("tableStyle", \u0275\u0275pureFunction0(53, _c3))("showCurrentPageReport", true);
      \u0275\u0275advance(4);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(54, _c4));
      \u0275\u0275property("header", ctx.errorDialogTitle());
      \u0275\u0275twoWayProperty("visible", ctx.showErrorDialog);
      \u0275\u0275property("modal", true)("dismissableMask", true);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.currentErrors().length > 0 ? 93 : 94);
    }
  }, dependencies: [
    CommonModule,
    FormsModule,
    DefaultValueAccessor,
    NgControlStatus,
    NgModel,
    JavaDatePipe,
    FileUploadModule,
    FileUpload,
    PrimeTemplate,
    ButtonModule,
    Button,
    TableModule,
    Table,
    SortableColumn,
    SortIcon,
    CardModule,
    Card,
    ToastModule,
    Toast,
    ProgressBarModule,
    ProgressBar,
    TagModule,
    Tag,
    DialogModule,
    Dialog,
    TabViewModule,
    TabView,
    TabPanel,
    TooltipModule,
    Tooltip,
    BadgeModule,
    Badge,
    DividerModule,
    Divider,
    MessagesModule,
    MessageModule,
    Message,
    ConfirmDialogModule,
    ConfirmDialog,
    DropdownModule,
    Dropdown,
    InputSwitchModule,
    InputTextModule,
    InputText
  ], styles: ['\n\n.rh-container[_ngcontent-%COMP%] {\n  padding: 1.5rem;\n}\n.rh-container[_ngcontent-%COMP%]   .header-section[_ngcontent-%COMP%] {\n  margin-bottom: 2rem;\n}\n.rh-container[_ngcontent-%COMP%]   .header-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  font-size: 1.75rem;\n  font-weight: 600;\n  color: var(--text-color);\n  margin: 0 0 0.5rem 0;\n}\n.rh-container[_ngcontent-%COMP%]   .header-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--primary-color);\n}\n.rh-container[_ngcontent-%COMP%]   .header-section[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  margin: 0;\n  font-size: 0.95rem;\n}\n.rh-container[_ngcontent-%COMP%]   .tab-content[_ngcontent-%COMP%] {\n  padding: 1rem 0;\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .upload-info[_ngcontent-%COMP%] {\n  margin-bottom: 1.5rem;\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .upload-info[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  color: var(--primary-color);\n  font-size: 1rem;\n  margin: 0 0 1rem 0;\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .upload-info[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .upload-info[_ngcontent-%COMP%]   .format-table[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 500px;\n  border-collapse: collapse;\n  border: 1px solid var(--surface-border);\n  border-radius: 6px;\n  overflow: hidden;\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .upload-info[_ngcontent-%COMP%]   .format-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], \n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .upload-info[_ngcontent-%COMP%]   .format-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 0.75rem 1rem;\n  text-align: left;\n  border-bottom: 1px solid var(--surface-border);\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .upload-info[_ngcontent-%COMP%]   .format-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  background: var(--surface-100);\n  font-weight: 600;\n  color: var(--text-color);\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .upload-info[_ngcontent-%COMP%]   .format-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  background: var(--surface-card);\n  color: var(--text-color-secondary);\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .upload-info[_ngcontent-%COMP%]   .format-table[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:last-child   td[_ngcontent-%COMP%] {\n  border-bottom: none;\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .upload-info[_ngcontent-%COMP%]   .info-note[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  margin-top: 1rem;\n  padding: 0.75rem 1rem;\n  background: var(--blue-50);\n  border-radius: 6px;\n  color: var(--blue-700);\n  font-size: 0.9rem;\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .upload-info[_ngcontent-%COMP%]   .info-note[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--blue-500);\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .upload-zone[_ngcontent-%COMP%]   .upload-placeholder[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 2rem;\n  color: var(--text-color-secondary);\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .upload-zone[_ngcontent-%COMP%]   .upload-placeholder[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  color: var(--primary-color);\n  opacity: 0.7;\n  margin-bottom: 1rem;\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .upload-zone[_ngcontent-%COMP%]   .upload-placeholder[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.1rem;\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .upload-zone[_ngcontent-%COMP%]   .upload-placeholder[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  opacity: 0.8;\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .upload-zone[_ngcontent-%COMP%]   .upload-progress[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.5rem;\n  margin-top: 1rem;\n  padding: 1rem;\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .upload-zone[_ngcontent-%COMP%]   .upload-progress[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: var(--primary-color);\n  font-size: 0.9rem;\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .import-result[_ngcontent-%COMP%] {\n  margin-top: 1.5rem;\n  padding: 1rem 1.5rem;\n  border-radius: 8px;\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .import-result.success[_ngcontent-%COMP%] {\n  background: var(--green-50);\n  border: 1px solid var(--green-200);\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .import-result.success[_ngcontent-%COMP%]   .result-header[_ngcontent-%COMP%] {\n  color: var(--green-700);\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .import-result.success[_ngcontent-%COMP%]   .result-header[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--green-500);\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .import-result.partial[_ngcontent-%COMP%] {\n  background: var(--orange-50);\n  border: 1px solid var(--orange-200);\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .import-result.partial[_ngcontent-%COMP%]   .result-header[_ngcontent-%COMP%] {\n  color: var(--orange-700);\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .import-result.partial[_ngcontent-%COMP%]   .result-header[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--orange-500);\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .import-result[_ngcontent-%COMP%]   .result-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-weight: 600;\n  margin-bottom: 0.75rem;\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .import-result[_ngcontent-%COMP%]   .result-header[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .import-result[_ngcontent-%COMP%]   .result-stats[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1.5rem;\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .import-result[_ngcontent-%COMP%]   .result-stats[_ngcontent-%COMP%]   .stat[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .import-result[_ngcontent-%COMP%]   .result-stats[_ngcontent-%COMP%]   .stat[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .import-result[_ngcontent-%COMP%]   .result-stats[_ngcontent-%COMP%]   .stat[_ngcontent-%COMP%]   .value[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .import-result[_ngcontent-%COMP%]   .result-stats[_ngcontent-%COMP%]   .stat[_ngcontent-%COMP%]   .value.success[_ngcontent-%COMP%] {\n  color: var(--green-600);\n}\n.rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .import-result[_ngcontent-%COMP%]   .result-stats[_ngcontent-%COMP%]   .stat[_ngcontent-%COMP%]   .value.error[_ngcontent-%COMP%] {\n  color: var(--red-600);\n}\n.rh-container[_ngcontent-%COMP%]   .table-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 1rem;\n}\n.rh-container[_ngcontent-%COMP%]   .matricule-badge[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 0.25rem 0.75rem;\n  background: var(--primary-100);\n  color: var(--primary-700);\n  border-radius: 4px;\n  font-weight: 600;\n  font-size: 0.9rem;\n}\n.rh-container[_ngcontent-%COMP%]   .numero-compte[_ngcontent-%COMP%] {\n  font-family: "Roboto Mono", monospace;\n  font-size: 0.9rem;\n  color: var(--text-color);\n}\n.rh-container[_ngcontent-%COMP%]   .no-data[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  font-style: italic;\n  opacity: 0.7;\n}\n.rh-container[_ngcontent-%COMP%]   .montant[_ngcontent-%COMP%] {\n  font-family: "Roboto Mono", monospace;\n  font-weight: 600;\n}\n.rh-container[_ngcontent-%COMP%]   .montant.limite[_ngcontent-%COMP%] {\n  color: var(--blue-600);\n}\n.rh-container[_ngcontent-%COMP%]   .text-right[_ngcontent-%COMP%] {\n  text-align: right !important;\n}\n.rh-container[_ngcontent-%COMP%]   .empty-message[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 3rem;\n  color: var(--text-color-secondary);\n}\n.rh-container[_ngcontent-%COMP%]   .empty-message[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 2.5rem;\n  opacity: 0.5;\n  margin-bottom: 0.5rem;\n}\n.rh-container[_ngcontent-%COMP%]   .empty-message[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 1rem;\n}\n.rh-container[_ngcontent-%COMP%]   .actions-bar[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n  justify-content: flex-end;\n}\n.error-dialog-content[_ngcontent-%COMP%]   .error-line[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 0.2rem 0.5rem;\n  background: var(--red-100);\n  color: var(--red-700);\n  border-radius: 4px;\n  font-weight: 600;\n  font-size: 0.85rem;\n}\n.error-dialog-content[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n  padding: 0.2rem 0.5rem;\n  background: var(--surface-100);\n  border-radius: 4px;\n  font-size: 0.85rem;\n}\n.error-dialog-content[_ngcontent-%COMP%]   .error-message[_ngcontent-%COMP%] {\n  color: var(--red-600);\n  font-size: 0.9rem;\n}\n.error-dialog-content[_ngcontent-%COMP%]   .no-errors[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 2rem;\n  color: var(--green-600);\n}\n.error-dialog-content[_ngcontent-%COMP%]   .no-errors[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 2.5rem;\n  margin-bottom: 0.5rem;\n}\n@media screen and (max-width: 768px) {\n  .rh-container[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .rh-container[_ngcontent-%COMP%]   .header-section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n  .rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .upload-info[_ngcontent-%COMP%]   .format-table[_ngcontent-%COMP%] {\n    font-size: 0.85rem;\n  }\n  .rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .upload-info[_ngcontent-%COMP%]   .format-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], \n   .rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .upload-info[_ngcontent-%COMP%]   .format-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n    padding: 0.5rem 0.75rem;\n  }\n  .rh-container[_ngcontent-%COMP%]   .upload-section[_ngcontent-%COMP%]   .import-result[_ngcontent-%COMP%]   .result-stats[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 0.75rem;\n  }\n  .rh-container[_ngcontent-%COMP%]   .actions-bar[_ngcontent-%COMP%] {\n    flex-direction: column;\n  }\n  .rh-container[_ngcontent-%COMP%]   .actions-bar[_ngcontent-%COMP%]     .p-button {\n    width: 100%;\n  }\n}\n  .p-fileupload .p-fileupload-content {\n  background: var(--surface-50);\n  border: 2px dashed var(--surface-border);\n  border-radius: 8px;\n  min-height: 150px;\n}\n  .p-fileupload .p-fileupload-content:hover {\n  border-color: var(--primary-color);\n  background: var(--surface-100);\n}\n  .p-fileupload .p-fileupload-buttonbar {\n  background: transparent;\n  border: none;\n  padding: 0 0 1rem 0;\n}\n  .p-tabview .p-tabview-nav {\n  background: transparent;\n  border: none;\n  border-bottom: 2px solid var(--surface-border);\n}\n  .p-tabview .p-tabview-nav li .p-tabview-nav-link {\n  border: none;\n  border-radius: 0;\n  margin: 0;\n  padding: 1rem 1.5rem;\n}\n  .p-tabview .p-tabview-nav li .p-tabview-nav-link:focus {\n  box-shadow: none;\n}\n  .p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {\n  border-bottom: 2px solid var(--primary-color);\n  margin-bottom: -2px;\n}\n  .p-tabview .p-tabview-panels {\n  background: transparent;\n  padding: 0;\n}\n  .p-card {\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);\n  border-radius: 8px;\n}\n  .p-card .p-card-header {\n  padding: 1.25rem 1.5rem 0;\n  font-weight: 600;\n  font-size: 1.1rem;\n}\n  .p-card .p-card-body {\n  padding: 1.25rem 1.5rem;\n}\n.import-blocked-message[_ngcontent-%COMP%] {\n  margin: 1.5rem 0;\n}\n.import-blocked-message[_ngcontent-%COMP%]   .blocked-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 1rem;\n  padding: 0.5rem;\n}\n.import-blocked-message[_ngcontent-%COMP%]   .blocked-content[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  color: var(--orange-500);\n  margin-top: 0.25rem;\n}\n.import-blocked-message[_ngcontent-%COMP%]   .blocked-content[_ngcontent-%COMP%]   .blocked-text[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.import-blocked-message[_ngcontent-%COMP%]   .blocked-content[_ngcontent-%COMP%]   .blocked-text[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 1.1rem;\n  color: var(--orange-700);\n  margin-bottom: 0.5rem;\n}\n.import-blocked-message[_ngcontent-%COMP%]   .blocked-content[_ngcontent-%COMP%]   .blocked-text[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--text-color-secondary);\n  line-height: 1.5;\n}\n.import-blocked-message[_ngcontent-%COMP%]   .reset-action[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  margin-top: 1.5rem;\n  padding-top: 1rem;\n  border-top: 1px dashed var(--surface-border);\n}\n.import-blocked-message[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_fadeIn 0.3s ease-in-out;\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.table-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 1rem;\n  margin-bottom: 1rem;\n}\n.table-header[_ngcontent-%COMP%]   .filter-section[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n}\n.table-header[_ngcontent-%COMP%]   .statut-counters[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n}\n.table-header[_ngcontent-%COMP%]   .statut-counters[_ngcontent-%COMP%]   .counter[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.5rem 1rem;\n  border-radius: 20px;\n  font-size: 0.875rem;\n  font-weight: 500;\n}\n.table-header[_ngcontent-%COMP%]   .statut-counters[_ngcontent-%COMP%]   .counter.active[_ngcontent-%COMP%] {\n  background: var(--green-100);\n  color: var(--green-700);\n}\n.table-header[_ngcontent-%COMP%]   .statut-counters[_ngcontent-%COMP%]   .counter.active[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--green-500);\n}\n.table-header[_ngcontent-%COMP%]   .statut-counters[_ngcontent-%COMP%]   .counter.inactive[_ngcontent-%COMP%] {\n  background: var(--red-100);\n  color: var(--red-700);\n}\n.table-header[_ngcontent-%COMP%]   .statut-counters[_ngcontent-%COMP%]   .counter.inactive[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--red-500);\n}\n.inactive-row[_ngcontent-%COMP%] {\n  background-color: var(--surface-100) !important;\n  opacity: 0.7;\n}\n.inactive-row[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n}\n.inactive-row[_ngcontent-%COMP%]   .matricule-badge[_ngcontent-%COMP%] {\n  background: var(--surface-300);\n  color: var(--text-color-secondary);\n}\n.action-buttons[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  gap: 0.25rem;\n}\n[_nghost-%COMP%]     .p-tag {\n  font-size: 0.75rem;\n  padding: 0.25rem 0.5rem;\n}\n.table-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 1rem;\n  margin-bottom: 1rem;\n}\n.table-header[_ngcontent-%COMP%]   .filter-section[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n}\n.table-header[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 250px;\n  max-width: 350px;\n}\n.table-header[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%]   .p-input-icon-left[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.table-header[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%]   .p-input-icon-left[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  padding-right: 2.5rem;\n}\n.table-header[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%]   .clear-icon[_ngcontent-%COMP%] {\n  cursor: pointer;\n  color: var(--text-color-secondary);\n  transition: color 0.2s;\n}\n.table-header[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%]   .clear-icon[_ngcontent-%COMP%]:hover {\n  color: var(--primary-color);\n}\n.table-header[_ngcontent-%COMP%]   .statut-counters[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n}\n.table-header[_ngcontent-%COMP%]   .statut-counters[_ngcontent-%COMP%]   .counter[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.5rem 1rem;\n  border-radius: 20px;\n  font-size: 0.875rem;\n  font-weight: 500;\n}\n.table-header[_ngcontent-%COMP%]   .statut-counters[_ngcontent-%COMP%]   .counter.active[_ngcontent-%COMP%] {\n  background: var(--green-100);\n  color: var(--green-700);\n}\n.table-header[_ngcontent-%COMP%]   .statut-counters[_ngcontent-%COMP%]   .counter.active[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--green-500);\n}\n.table-header[_ngcontent-%COMP%]   .statut-counters[_ngcontent-%COMP%]   .counter.inactive[_ngcontent-%COMP%] {\n  background: var(--red-100);\n  color: var(--red-700);\n}\n.table-header[_ngcontent-%COMP%]   .statut-counters[_ngcontent-%COMP%]   .counter.inactive[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--red-500);\n}\n.search-results-info[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.75rem 1rem;\n  background: var(--blue-50);\n  border: 1px solid var(--blue-200);\n  border-radius: 6px;\n  margin-bottom: 1rem;\n  font-size: 0.9rem;\n  color: var(--blue-700);\n}\n.search-results-info[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--blue-500);\n}\n[_nghost-%COMP%]     .highlight {\n  background-color: var(--yellow-200);\n  padding: 0.1rem 0.2rem;\n  border-radius: 3px;\n  font-weight: 600;\n}\n.inactive-row[_ngcontent-%COMP%] {\n  background-color: var(--surface-100) !important;\n  opacity: 0.7;\n}\n.inactive-row[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n}\n.inactive-row[_ngcontent-%COMP%]   .matricule-badge[_ngcontent-%COMP%] {\n  background: var(--surface-300);\n  color: var(--text-color-secondary);\n}\n.action-buttons[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  gap: 0.25rem;\n}\n@media (max-width: 768px) {\n  .table-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: stretch;\n  }\n  .table-header[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%] {\n    max-width: 100%;\n    order: -1;\n  }\n  .table-header[_ngcontent-%COMP%]   .statut-counters[_ngcontent-%COMP%] {\n    justify-content: center;\n  }\n}\n.table-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 1rem;\n  margin-bottom: 1rem;\n}\n.table-header[_ngcontent-%COMP%]   .filter-section[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n}\n.table-header[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 250px;\n  max-width: 350px;\n}\n.table-header[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%]   .p-input-icon-left[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.table-header[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%]   .p-input-icon-left[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  padding-right: 2.5rem;\n}\n.table-header[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%]   .clear-icon[_ngcontent-%COMP%] {\n  cursor: pointer;\n  color: var(--text-color-secondary);\n  transition: color 0.2s;\n}\n.table-header[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%]   .clear-icon[_ngcontent-%COMP%]:hover {\n  color: var(--primary-color);\n}\n.table-header[_ngcontent-%COMP%]   .statut-counters[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n}\n.table-header[_ngcontent-%COMP%]   .statut-counters[_ngcontent-%COMP%]   .counter[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.5rem 1rem;\n  border-radius: 20px;\n  font-size: 0.875rem;\n  font-weight: 500;\n}\n.table-header[_ngcontent-%COMP%]   .statut-counters[_ngcontent-%COMP%]   .counter.active[_ngcontent-%COMP%] {\n  background: var(--green-100);\n  color: var(--green-700);\n}\n.table-header[_ngcontent-%COMP%]   .statut-counters[_ngcontent-%COMP%]   .counter.active[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--green-500);\n}\n.table-header[_ngcontent-%COMP%]   .statut-counters[_ngcontent-%COMP%]   .counter.inactive[_ngcontent-%COMP%] {\n  background: var(--red-100);\n  color: var(--red-700);\n}\n.table-header[_ngcontent-%COMP%]   .statut-counters[_ngcontent-%COMP%]   .counter.inactive[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--red-500);\n}\n.table-header[_ngcontent-%COMP%]   .result-counter[_ngcontent-%COMP%]   .counter[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.5rem 1rem;\n  border-radius: 20px;\n  font-size: 0.875rem;\n  font-weight: 500;\n  background: var(--primary-100);\n  color: var(--primary-700);\n}\n.table-header[_ngcontent-%COMP%]   .result-counter[_ngcontent-%COMP%]   .counter[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--primary-500);\n}\n.search-results-info[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.75rem 1rem;\n  background: var(--blue-50);\n  border: 1px solid var(--blue-200);\n  border-radius: 6px;\n  margin-bottom: 1rem;\n  font-size: 0.9rem;\n  color: var(--blue-700);\n}\n.search-results-info[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--blue-500);\n}\n[_nghost-%COMP%]     .highlight {\n  background-color: var(--yellow-200);\n  padding: 0.1rem 0.2rem;\n  border-radius: 3px;\n  font-weight: 600;\n}\n.inactive-row[_ngcontent-%COMP%] {\n  background-color: var(--surface-100) !important;\n  opacity: 0.7;\n}\n.inactive-row[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n}\n.inactive-row[_ngcontent-%COMP%]   .matricule-badge[_ngcontent-%COMP%] {\n  background: var(--surface-300);\n  color: var(--text-color-secondary);\n}\n.action-buttons[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  gap: 0.25rem;\n}\n.actions-bar[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 1rem;\n}\n@media (max-width: 768px) {\n  .table-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: stretch;\n  }\n  .table-header[_ngcontent-%COMP%]   .search-section[_ngcontent-%COMP%] {\n    max-width: 100%;\n    order: -1;\n  }\n  .table-header[_ngcontent-%COMP%]   .statut-counters[_ngcontent-%COMP%], \n   .table-header[_ngcontent-%COMP%]   .result-counter[_ngcontent-%COMP%] {\n    justify-content: center;\n  }\n  .actions-bar[_ngcontent-%COMP%] {\n    flex-direction: column;\n  }\n  .actions-bar[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n.montant[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: var(--text-color);\n}\n.montant.limite[_ngcontent-%COMP%] {\n  color: var(--green-600);\n}\n.text-right[_ngcontent-%COMP%] {\n  text-align: right;\n}\n.matricule-badge[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 0.25rem 0.5rem;\n  background: var(--primary-100);\n  color: var(--primary-700);\n  border-radius: 4px;\n  font-weight: 600;\n  font-size: 0.875rem;\n}\n.numero-compte[_ngcontent-%COMP%] {\n  font-family: monospace;\n  font-size: 0.9rem;\n  color: var(--text-color);\n}\n.no-data[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  font-style: italic;\n  font-size: 0.875rem;\n}\n.empty-message[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 3rem 1rem;\n}\n.empty-message[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  color: var(--text-color-secondary);\n  display: block;\n  margin-bottom: 1rem;\n}\n.empty-message[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  font-size: 1rem;\n}\n.import-blocked-message[_ngcontent-%COMP%] {\n  margin-bottom: 1rem;\n}\n.import-blocked-message[_ngcontent-%COMP%]   .blocked-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 1rem;\n}\n.import-blocked-message[_ngcontent-%COMP%]   .blocked-content[_ngcontent-%COMP%]    > i[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  margin-top: 0.25rem;\n}\n.import-blocked-message[_ngcontent-%COMP%]   .blocked-content[_ngcontent-%COMP%]   .blocked-text[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: block;\n  margin-bottom: 0.25rem;\n}\n.import-blocked-message[_ngcontent-%COMP%]   .blocked-content[_ngcontent-%COMP%]   .blocked-text[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.9rem;\n}\n.import-blocked-message[_ngcontent-%COMP%]   .reset-action[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n  text-align: center;\n}\n.upload-placeholder[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 2rem;\n  color: var(--text-color-secondary);\n}\n.upload-placeholder[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  margin-bottom: 1rem;\n  color: var(--primary-color);\n}\n.upload-placeholder[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0 0 0.5rem 0;\n  font-size: 1rem;\n}\n.upload-placeholder[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n}\n.upload-progress[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.5rem;\n  margin-top: 1rem;\n}\n.upload-progress[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n  font-size: 0.9rem;\n}\n.import-result[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n  padding: 1rem;\n  border-radius: 8px;\n}\n.import-result.success[_ngcontent-%COMP%] {\n  background: var(--green-50);\n  border: 1px solid var(--green-200);\n}\n.import-result.success[_ngcontent-%COMP%]   .result-header[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--green-500);\n}\n.import-result.partial[_ngcontent-%COMP%] {\n  background: var(--orange-50);\n  border: 1px solid var(--orange-200);\n}\n.import-result.partial[_ngcontent-%COMP%]   .result-header[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--orange-500);\n}\n.import-result[_ngcontent-%COMP%]   .result-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  margin-bottom: 0.75rem;\n  font-weight: 600;\n}\n.import-result[_ngcontent-%COMP%]   .result-header[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n}\n.import-result[_ngcontent-%COMP%]   .result-stats[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 2rem;\n  flex-wrap: wrap;\n}\n.import-result[_ngcontent-%COMP%]   .result-stats[_ngcontent-%COMP%]   .stat[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.import-result[_ngcontent-%COMP%]   .result-stats[_ngcontent-%COMP%]   .stat[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  color: var(--text-color-secondary);\n}\n.import-result[_ngcontent-%COMP%]   .result-stats[_ngcontent-%COMP%]   .stat[_ngcontent-%COMP%]   .value[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.import-result[_ngcontent-%COMP%]   .result-stats[_ngcontent-%COMP%]   .stat[_ngcontent-%COMP%]   .value.success[_ngcontent-%COMP%] {\n  color: var(--green-600);\n}\n.import-result[_ngcontent-%COMP%]   .result-stats[_ngcontent-%COMP%]   .stat[_ngcontent-%COMP%]   .value.error[_ngcontent-%COMP%] {\n  color: var(--red-600);\n}\n.format-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  margin: 1rem 0;\n}\n.format-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], \n.format-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 0.5rem 1rem;\n  text-align: left;\n  border: 1px solid var(--surface-300);\n}\n.format-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  background: var(--surface-100);\n  font-weight: 600;\n}\n.format-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  font-family: monospace;\n}\n.info-note[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  color: var(--blue-600);\n  font-size: 0.9rem;\n  margin-top: 0.5rem;\n}\n.info-note[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--blue-500);\n}\n/*# sourceMappingURL=gestion-personnel.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(GestionPersonnelComponent, { className: "GestionPersonnelComponent", filePath: "src/app/pages/dashboard/admin/gestion-personnel/gestion-personnel.component.ts", lineNumber: 59 });
})();
export {
  GestionPersonnelComponent
};
//# sourceMappingURL=chunk-D37BNP3V.js.map
