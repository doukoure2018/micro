import {
  PasswordModule
} from "./chunk-NBJHCGNS.js";
import {
  FileUploadModule
} from "./chunk-ZNXRKGHP.js";
import "./chunk-UZIOTGW7.js";
import {
  TextareaModule
} from "./chunk-RW4OSSQT.js";
import {
  InputGroupModule
} from "./chunk-GEBY3FYZ.js";
import {
  Message,
  MessageModule
} from "./chunk-CSEZIGTY.js";
import {
  Toast,
  ToastModule
} from "./chunk-6SRYYUT2.js";
import "./chunk-WQ2EPPBK.js";
import {
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
import {
  RippleModule
} from "./chunk-AP3OAIHW.js";
import {
  ConfirmationService,
  MessageService,
  PrimeTemplate
} from "./chunk-NQNBRQ7H.js";
import {
  DefaultValueAccessor,
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
  NgIf
} from "./chunk-SQQPVFHK.js";
import {
  DestroyRef,
  inject,
  signal,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-ZKKMBKIA.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/pages/dashboard/admin/config-reseau/config-reseau.component.ts
function ConfigReseauComponent_ng_template_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32);
    \u0275\u0275element(1, "i", 33);
    \u0275\u0275elementStart(2, "span", 34);
    \u0275\u0275text(3, "D\xE9l\xE9gations");
    \u0275\u0275elementEnd()();
  }
}
function ConfigReseauComponent_div_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35);
    \u0275\u0275element(1, "p-progressSpinner", 36);
    \u0275\u0275elementEnd();
  }
}
function ConfigReseauComponent_p_table_29_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th");
    \u0275\u0275text(2, "ID");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th");
    \u0275\u0275text(4, "Nom");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th", 39);
    \u0275\u0275text(6, "Actions");
    \u0275\u0275elementEnd()();
  }
}
function ConfigReseauComponent_p_table_29_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 39)(6, "p-button", 40);
    \u0275\u0275listener("onClick", function ConfigReseauComponent_p_table_29_ng_template_2_Template_p_button_onClick_6_listener() {
      const delegation_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.onDelegationSelect(delegation_r3.id));
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const delegation_r3 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("bg-primary-50", ctx_r3.state().selectedDelegationId === delegation_r3.id);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(delegation_r3.id);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(delegation_r3.libele);
    \u0275\u0275advance(2);
    \u0275\u0275property("label", ctx_r3.state().selectedDelegationId === delegation_r3.id ? "S\xE9lectionn\xE9" : "S\xE9lectionner")("icon", ctx_r3.state().selectedDelegationId === delegation_r3.id ? "pi pi-check" : "pi pi-chevron-right")("severity", ctx_r3.state().selectedDelegationId === delegation_r3.id ? "success" : "info");
  }
}
function ConfigReseauComponent_p_table_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-table", 37);
    \u0275\u0275template(1, ConfigReseauComponent_p_table_29_ng_template_1_Template, 7, 0, "ng-template", 9)(2, ConfigReseauComponent_p_table_29_ng_template_2_Template, 7, 7, "ng-template", 38);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275property("value", ctx_r3.state().delegations)("rows", 5)("paginator", ctx_r3.state().delegations.length > 5);
  }
}
function ConfigReseauComponent_p_message_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 41);
  }
}
function ConfigReseauComponent_ng_template_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32);
    \u0275\u0275element(1, "i", 42);
    \u0275\u0275elementStart(2, "span", 34);
    \u0275\u0275text(3, "Agences");
    \u0275\u0275elementEnd()();
  }
}
function ConfigReseauComponent_p_message_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 43);
  }
}
function ConfigReseauComponent_p_message_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 44);
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275property("text", "D\xE9l\xE9gation s\xE9lectionn\xE9e - ID: " + ctx_r3.state().selectedDelegationId);
  }
}
function ConfigReseauComponent_form_37_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 10, 1);
    \u0275\u0275listener("ngSubmit", function ConfigReseauComponent_form_37_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.addAgence());
    });
    \u0275\u0275elementStart(2, "div", 4)(3, "div", 11)(4, "div", 12)(5, "label", 45);
    \u0275\u0275text(6, " Nom de l'agence * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "input", 46);
    \u0275\u0275twoWayListener("ngModelChange", function ConfigReseauComponent_form_37_Template_input_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.agenceForm.libele, $event) || (ctx_r3.agenceForm.libele = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 15)(9, "div", 12)(10, "label", 16);
    \u0275\u0275text(11, "\xA0");
    \u0275\u0275elementEnd();
    \u0275\u0275element(12, "p-button", 47);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const agenceFormRef_r6 = \u0275\u0275reference(1);
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.agenceForm.libele);
    \u0275\u0275advance(5);
    \u0275\u0275property("label", ctx_r3.state().submitting ? "Ajout..." : "Ajouter Agence")("icon", ctx_r3.state().submitting ? "pi pi-spin pi-spinner" : "pi pi-plus")("disabled", ctx_r3.state().submitting || !agenceFormRef_r6.valid)("loading", ctx_r3.state().submitting);
  }
}
function ConfigReseauComponent_div_38_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35);
    \u0275\u0275element(1, "p-progressSpinner", 36);
    \u0275\u0275elementEnd();
  }
}
function ConfigReseauComponent_div_38_p_table_4_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th");
    \u0275\u0275text(2, "ID");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th");
    \u0275\u0275text(4, "Nom");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th");
    \u0275\u0275text(6, "D\xE9l\xE9gation ID");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 39);
    \u0275\u0275text(8, "Actions");
    \u0275\u0275elementEnd()();
  }
}
function ConfigReseauComponent_div_38_p_table_4_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 39)(8, "p-button", 40);
    \u0275\u0275listener("onClick", function ConfigReseauComponent_div_38_p_table_4_ng_template_2_Template_p_button_onClick_8_listener() {
      const agence_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.onAgenceSelect(agence_r8.id));
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const agence_r8 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("bg-blue-50", ctx_r3.state().selectedAgenceId === agence_r8.id);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(agence_r8.id);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(agence_r8.libele);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(agence_r8.delegation_id);
    \u0275\u0275advance(2);
    \u0275\u0275property("label", ctx_r3.state().selectedAgenceId === agence_r8.id ? "S\xE9lectionn\xE9" : "S\xE9lectionner")("icon", ctx_r3.state().selectedAgenceId === agence_r8.id ? "pi pi-check" : "pi pi-chevron-right")("severity", ctx_r3.state().selectedAgenceId === agence_r8.id ? "success" : "info");
  }
}
function ConfigReseauComponent_div_38_p_table_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-table", 37);
    \u0275\u0275template(1, ConfigReseauComponent_div_38_p_table_4_ng_template_1_Template, 9, 0, "ng-template", 9)(2, ConfigReseauComponent_div_38_p_table_4_ng_template_2_Template, 9, 8, "ng-template", 38);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275property("value", ctx_r3.state().agences)("rows", 5)("paginator", ctx_r3.state().agences.length > 5);
  }
}
function ConfigReseauComponent_div_38_p_message_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 49);
  }
}
function ConfigReseauComponent_div_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20)(1, "h3", 21);
    \u0275\u0275text(2, "Liste des Agences");
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, ConfigReseauComponent_div_38_div_3_Template, 2, 0, "div", 22)(4, ConfigReseauComponent_div_38_p_table_4_Template, 3, 3, "p-table", 23)(5, ConfigReseauComponent_div_38_p_message_5_Template, 1, 0, "p-message", 48);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r3.state().loading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r3.state().loading && ctx_r3.state().agences && ctx_r3.state().agences.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r3.state().loading && (!ctx_r3.state().agences || ctx_r3.state().agences.length === 0));
  }
}
function ConfigReseauComponent_ng_template_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32);
    \u0275\u0275element(1, "i", 50);
    \u0275\u0275elementStart(2, "span", 34);
    \u0275\u0275text(3, "Points de Vente");
    \u0275\u0275elementEnd()();
  }
}
function ConfigReseauComponent_p_message_43_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 51);
  }
}
function ConfigReseauComponent_p_message_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 44);
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275property("text", "Agence s\xE9lectionn\xE9e - ID: " + ctx_r3.state().selectedAgenceId + " | D\xE9l\xE9gation ID: " + ctx_r3.state().selectedDelegationId);
  }
}
function ConfigReseauComponent_form_45_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 10, 2);
    \u0275\u0275listener("ngSubmit", function ConfigReseauComponent_form_45_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.addPointVente());
    });
    \u0275\u0275elementStart(2, "div", 4)(3, "div", 15)(4, "div", 12)(5, "label", 52);
    \u0275\u0275text(6, " Nom du point de vente * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "input", 53);
    \u0275\u0275twoWayListener("ngModelChange", function ConfigReseauComponent_form_45_Template_input_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.pointVenteForm.libele, $event) || (ctx_r3.pointVenteForm.libele = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 15)(9, "div", 12)(10, "label", 54);
    \u0275\u0275text(11, " Code du point de vente * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "input", 55);
    \u0275\u0275twoWayListener("ngModelChange", function ConfigReseauComponent_form_45_Template_input_ngModelChange_12_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.pointVenteForm.code, $event) || (ctx_r3.pointVenteForm.code = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "div", 15)(14, "div", 12)(15, "label", 16);
    \u0275\u0275text(16, "\xA0");
    \u0275\u0275elementEnd();
    \u0275\u0275element(17, "p-button", 56);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const pointVenteFormRef_r10 = \u0275\u0275reference(1);
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.pointVenteForm.libele);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.pointVenteForm.code);
    \u0275\u0275advance(5);
    \u0275\u0275property("label", ctx_r3.state().submitting ? "Ajout..." : "Ajouter Point de Vente")("icon", ctx_r3.state().submitting ? "pi pi-spin pi-spinner" : "pi pi-plus")("disabled", ctx_r3.state().submitting || !pointVenteFormRef_r10.valid)("loading", ctx_r3.state().submitting);
  }
}
function ConfigReseauComponent_div_46_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35);
    \u0275\u0275element(1, "p-progressSpinner", 36);
    \u0275\u0275elementEnd();
  }
}
function ConfigReseauComponent_div_46_p_table_4_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th");
    \u0275\u0275text(2, "ID");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th");
    \u0275\u0275text(4, "Nom");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th");
    \u0275\u0275text(6, "Code");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th");
    \u0275\u0275text(8, "Agence ID");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th");
    \u0275\u0275text(10, "D\xE9l\xE9gation ID");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th", 39);
    \u0275\u0275text(12, "Actions");
    \u0275\u0275elementEnd()();
  }
}
function ConfigReseauComponent_div_46_p_table_4_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275element(6, "p-tag", 58);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td", 39);
    \u0275\u0275element(12, "p-button", 59);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const pointVente_r11 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(pointVente_r11.id);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(pointVente_r11.libele);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", pointVente_r11.code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(pointVente_r11.agence_id);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(pointVente_r11.delegation_id);
    \u0275\u0275advance(2);
    \u0275\u0275property("text", true);
  }
}
function ConfigReseauComponent_div_46_p_table_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-table", 37);
    \u0275\u0275template(1, ConfigReseauComponent_div_46_p_table_4_ng_template_1_Template, 13, 0, "ng-template", 9)(2, ConfigReseauComponent_div_46_p_table_4_ng_template_2_Template, 13, 6, "ng-template", 38);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275property("value", ctx_r3.state().pointeVentes)("rows", 5)("paginator", ctx_r3.state().pointeVentes.length > 5);
  }
}
function ConfigReseauComponent_div_46_p_message_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-message", 60);
  }
}
function ConfigReseauComponent_div_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20)(1, "h3", 21);
    \u0275\u0275text(2, "Liste des Points de Vente");
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, ConfigReseauComponent_div_46_div_3_Template, 2, 0, "div", 22)(4, ConfigReseauComponent_div_46_p_table_4_Template, 3, 3, "p-table", 23)(5, ConfigReseauComponent_div_46_p_message_5_Template, 1, 0, "p-message", 57);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r3.state().loading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r3.state().loading && ctx_r3.state().pointeVentes && ctx_r3.state().pointeVentes.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r3.state().loading && (!ctx_r3.state().pointeVentes || ctx_r3.state().pointeVentes.length === 0));
  }
}
var ConfigReseauComponent = class _ConfigReseauComponent {
  state = signal({
    loading: false,
    submitting: false,
    message: void 0,
    error: void 0
  });
  // Form models
  delegationForm = {};
  agenceForm = {};
  pointVenteForm = {};
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  userService = inject(UserService);
  messageService = inject(MessageService);
  ngOnInit() {
    this.loadAllDelegations();
  }
  // ================== DELEGATION OPERATIONS ==================
  loadAllDelegations() {
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { loading: true }));
    this.userService.getAllDelegation$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          delegations: response.data?.delegations || response.data,
          loading: false
        }));
      },
      error: (error) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { error, loading: false }));
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load delegations"
        });
      }
    });
  }
  addDelegation() {
    if (!this.delegationForm.libele?.trim()) {
      this.messageService.add({
        severity: "warn",
        summary: "Warning",
        detail: "Please enter delegation name"
      });
      return;
    }
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { submitting: true }));
    this.userService.addDelegation$(this.delegationForm).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { submitting: false }));
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Delegation added successfully"
        });
        this.delegationForm = {};
        this.loadAllDelegations();
      },
      error: (error) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { error, submitting: false }));
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to add delegation"
        });
      }
    });
  }
  // ================== AGENCE OPERATIONS ==================
  onDelegationSelect(delegationId) {
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { selectedDelegationId: delegationId }));
    this.agenceForm.delegation_id = delegationId;
    this.loadAgencesByDelegation(delegationId);
  }
  loadAgencesByDelegation(delegationId) {
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { loading: true }));
    this.userService.getAllAgenceByDelegationId$(delegationId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          agences: response.data?.agences || response.data,
          loading: false
        }));
      },
      error: (error) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { error, loading: false }));
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load agences"
        });
      }
    });
  }
  addAgence() {
    if (!this.agenceForm.libele?.trim()) {
      this.messageService.add({
        severity: "warn",
        summary: "Warning",
        detail: "Please enter agence name"
      });
      return;
    }
    if (!this.agenceForm.delegation_id) {
      this.messageService.add({
        severity: "warn",
        summary: "Warning",
        detail: "Please select a delegation"
      });
      return;
    }
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { submitting: true }));
    this.userService.addAgence$(this.agenceForm).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { submitting: false }));
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Agence added successfully"
        });
        this.agenceForm = { delegation_id: this.agenceForm.delegation_id };
        this.loadAgencesByDelegation(this.agenceForm.delegation_id);
      },
      error: (error) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { error, submitting: false }));
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to add agence"
        });
      }
    });
  }
  // ================== POINT VENTE OPERATIONS ==================
  onAgenceSelect(agenceId) {
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { selectedAgenceId: agenceId }));
    this.pointVenteForm.agence_id = agenceId;
    this.pointVenteForm.delegation_id = this.state().selectedDelegationId;
    this.loadPointVentesByAgence(agenceId);
  }
  loadPointVentesByAgence(agenceId) {
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { loading: true }));
    this.userService.getAllPointventesByAgenceId$(agenceId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          pointeVentes: response.data?.pointVentes || response.data,
          loading: false
        }));
      },
      error: (error) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { error, loading: false }));
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load point ventes"
        });
      }
    });
  }
  addPointVente() {
    if (!this.pointVenteForm.libele?.trim()) {
      this.messageService.add({
        severity: "warn",
        summary: "Warning",
        detail: "Please enter point vente name"
      });
      return;
    }
    if (!this.pointVenteForm.code?.trim()) {
      this.messageService.add({
        severity: "warn",
        summary: "Warning",
        detail: "Please enter point vente code"
      });
      return;
    }
    if (!this.pointVenteForm.agence_id) {
      this.messageService.add({
        severity: "warn",
        summary: "Warning",
        detail: "Please select an agence"
      });
      return;
    }
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { submitting: true }));
    this.userService.addPointeVente$(this.pointVenteForm).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { submitting: false }));
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Point vente added successfully"
        });
        this.pointVenteForm = {
          agence_id: this.pointVenteForm.agence_id,
          delegation_id: this.pointVenteForm.delegation_id
        };
        this.loadPointVentesByAgence(this.pointVenteForm.agence_id);
      },
      error: (error) => {
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { error, submitting: false }));
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to add point vente"
        });
      }
    });
  }
  // ================== UTILITY METHODS ==================
  resetForms() {
    this.delegationForm = {};
    this.agenceForm = {};
    this.pointVenteForm = {};
    this.state.update((state) => __spreadProps(__spreadValues({}, state), {
      selectedDelegationId: void 0,
      selectedAgenceId: void 0,
      agences: void 0,
      pointeVentes: void 0
    }));
  }
  static \u0275fac = function ConfigReseauComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ConfigReseauComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ConfigReseauComponent, selectors: [["app-config-reseau"]], features: [\u0275\u0275ProvidersFeature([MessageService, ConfirmationService])], decls: 48, vars: 20, consts: [["delegationFormRef", "ngForm"], ["agenceFormRef", "ngForm"], ["pointVenteFormRef", "ngForm"], [1, "config-container"], [1, "grid"], [1, "col-12"], [1, "text-3xl", "font-bold", "text-900", "mb-4"], [1, "pi", "pi-sitemap", "mr-2"], ["header", "D\xE9l\xE9gations", "styleClass", "mb-4"], ["pTemplate", "header"], [1, "mb-4", 3, "ngSubmit"], [1, "col-12", "md:col-8"], [1, "field"], ["for", "delegationLibele", 1, "block", "text-900", "font-medium", "mb-2"], ["pInputText", "", "id", "delegationLibele", "name", "delegationLibele", "placeholder", "Entrez le nom de la d\xE9l\xE9gation", "required", "", 1, "w-full", 3, "ngModelChange", "ngModel"], [1, "col-12", "md:col-4"], [1, "block", "text-900", "font-medium", "mb-2"], [1, "flex", "gap-2"], ["label", "R\xE9initialiser", "icon", "pi pi-refresh", "severity", "secondary", "size", "small", 3, "onClick"], ["type", "submit", 3, "label", "icon", "disabled", "loading"], [1, "border-top-1", "surface-border", "pt-4"], [1, "text-lg", "font-semibold", "text-900", "mb-3"], ["class", "flex justify-content-center p-4", 4, "ngIf"], ["responsiveLayout", "scroll", "styleClass", "p-datatable-sm", 3, "value", "rows", "paginator", 4, "ngIf"], ["severity", "info", "text", "Aucune d\xE9l\xE9gation trouv\xE9e", "styleClass", "w-full", 4, "ngIf"], ["header", "Agences", "styleClass", "mb-4"], ["severity", "info", "text", "Veuillez d'abord s\xE9lectionner une d\xE9l\xE9gation pour g\xE9rer les agences.", "styleClass", "w-full mb-4", 4, "ngIf"], ["severity", "success", "styleClass", "w-full mb-4", 3, "text", 4, "ngIf"], ["class", "mb-4", 3, "ngSubmit", 4, "ngIf"], ["class", "border-top-1 surface-border pt-4", 4, "ngIf"], ["header", "Points de Vente", "styleClass", "mb-4"], ["severity", "info", "text", "Veuillez d'abord s\xE9lectionner une agence pour g\xE9rer les points de vente.", "styleClass", "w-full mb-4", 4, "ngIf"], [1, "flex", "align-items-center"], [1, "pi", "pi-building", "mr-2", "text-primary"], [1, "text-xl", "font-semibold"], [1, "flex", "justify-content-center", "p-4"], ["styleClass", "w-3rem h-3rem"], ["responsiveLayout", "scroll", "styleClass", "p-datatable-sm", 3, "value", "rows", "paginator"], ["pTemplate", "body"], [1, "text-center"], ["size", "small", 3, "onClick", "label", "icon", "severity"], ["severity", "info", "text", "Aucune d\xE9l\xE9gation trouv\xE9e", "styleClass", "w-full"], [1, "pi", "pi-warehouse", "mr-2", "text-blue-500"], ["severity", "info", "text", "Veuillez d'abord s\xE9lectionner une d\xE9l\xE9gation pour g\xE9rer les agences.", "styleClass", "w-full mb-4"], ["severity", "success", "styleClass", "w-full mb-4", 3, "text"], ["for", "agenceLibele", 1, "block", "text-900", "font-medium", "mb-2"], ["pInputText", "", "id", "agenceLibele", "name", "agenceLibele", "placeholder", "Entrez le nom de l'agence", "required", "", 1, "w-full", 3, "ngModelChange", "ngModel"], ["type", "submit", "severity", "info", 1, "w-full", 3, "label", "icon", "disabled", "loading"], ["severity", "info", "text", "Aucune agence trouv\xE9e pour cette d\xE9l\xE9gation", "styleClass", "w-full", 4, "ngIf"], ["severity", "info", "text", "Aucune agence trouv\xE9e pour cette d\xE9l\xE9gation", "styleClass", "w-full"], [1, "pi", "pi-shop", "mr-2", "text-orange-500"], ["severity", "info", "text", "Veuillez d'abord s\xE9lectionner une agence pour g\xE9rer les points de vente.", "styleClass", "w-full mb-4"], ["for", "pointVenteLibele", 1, "block", "text-900", "font-medium", "mb-2"], ["pInputText", "", "id", "pointVenteLibele", "name", "pointVenteLibele", "placeholder", "Nom du point de vente", "required", "", 1, "w-full", 3, "ngModelChange", "ngModel"], ["for", "pointVenteCode", 1, "block", "text-900", "font-medium", "mb-2"], ["pInputText", "", "id", "pointVenteCode", "name", "pointVenteCode", "placeholder", "Code du point de vente", "required", "", 1, "w-full", 3, "ngModelChange", "ngModel"], ["type", "submit", "severity", "warn", 1, "w-full", 3, "label", "icon", "disabled", "loading"], ["severity", "info", "text", "Aucun point de vente trouv\xE9 pour cette agence", "styleClass", "w-full", 4, "ngIf"], ["severity", "info", 3, "value"], ["icon", "pi pi-eye", "severity", "help", "size", "small", "pTooltip", "Voir d\xE9tails", 3, "text"], ["severity", "info", "text", "Aucun point de vente trouv\xE9 pour cette agence", "styleClass", "w-full"]], template: function ConfigReseauComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 3)(1, "div", 4)(2, "div", 5)(3, "h1", 6);
      \u0275\u0275element(4, "i", 7);
      \u0275\u0275text(5, " Configuration du R\xE9seau ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "p-card", 8);
      \u0275\u0275template(9, ConfigReseauComponent_ng_template_9_Template, 4, 0, "ng-template", 9);
      \u0275\u0275elementStart(10, "form", 10, 0);
      \u0275\u0275listener("ngSubmit", function ConfigReseauComponent_Template_form_ngSubmit_10_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.addDelegation());
      });
      \u0275\u0275elementStart(12, "div", 4)(13, "div", 11)(14, "div", 12)(15, "label", 13);
      \u0275\u0275text(16, " Nom de la d\xE9l\xE9gation * ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "input", 14);
      \u0275\u0275twoWayListener("ngModelChange", function ConfigReseauComponent_Template_input_ngModelChange_17_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.delegationForm.libele, $event) || (ctx.delegationForm.libele = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(18, "div", 15)(19, "div", 12)(20, "label", 16);
      \u0275\u0275text(21, "\xA0");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "div", 17)(23, "p-button", 18);
      \u0275\u0275listener("onClick", function ConfigReseauComponent_Template_p_button_onClick_23_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.resetForms());
      });
      \u0275\u0275elementEnd();
      \u0275\u0275element(24, "p-button", 19);
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(25, "div", 20)(26, "h3", 21);
      \u0275\u0275text(27, "Liste des D\xE9l\xE9gations");
      \u0275\u0275elementEnd();
      \u0275\u0275template(28, ConfigReseauComponent_div_28_Template, 2, 0, "div", 22)(29, ConfigReseauComponent_p_table_29_Template, 3, 3, "p-table", 23)(30, ConfigReseauComponent_p_message_30_Template, 1, 0, "p-message", 24);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(31, "div", 4)(32, "div", 5)(33, "p-card", 25);
      \u0275\u0275template(34, ConfigReseauComponent_ng_template_34_Template, 4, 0, "ng-template", 9)(35, ConfigReseauComponent_p_message_35_Template, 1, 0, "p-message", 26)(36, ConfigReseauComponent_p_message_36_Template, 1, 1, "p-message", 27)(37, ConfigReseauComponent_form_37_Template, 13, 5, "form", 28)(38, ConfigReseauComponent_div_38_Template, 6, 3, "div", 29);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(39, "div", 4)(40, "div", 5)(41, "p-card", 30);
      \u0275\u0275template(42, ConfigReseauComponent_ng_template_42_Template, 4, 0, "ng-template", 9)(43, ConfigReseauComponent_p_message_43_Template, 1, 0, "p-message", 31)(44, ConfigReseauComponent_p_message_44_Template, 1, 1, "p-message", 27)(45, ConfigReseauComponent_form_45_Template, 18, 6, "form", 28)(46, ConfigReseauComponent_div_46_Template, 6, 3, "div", 29);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275element(47, "p-toast");
    }
    if (rf & 2) {
      const delegationFormRef_r12 = \u0275\u0275reference(11);
      \u0275\u0275advance(17);
      \u0275\u0275twoWayProperty("ngModel", ctx.delegationForm.libele);
      \u0275\u0275advance(7);
      \u0275\u0275property("label", ctx.state().submitting ? "Ajout..." : "Ajouter")("icon", ctx.state().submitting ? "pi pi-spin pi-spinner" : "pi pi-plus")("disabled", ctx.state().submitting || !delegationFormRef_r12.valid)("loading", ctx.state().submitting);
      \u0275\u0275advance(4);
      \u0275\u0275property("ngIf", ctx.state().loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.state().loading && ctx.state().delegations && ctx.state().delegations.length > 0);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.state().loading && (!ctx.state().delegations || ctx.state().delegations.length === 0));
      \u0275\u0275advance(3);
      \u0275\u0275classMap(!ctx.state().selectedDelegationId ? "opacity-60 pointer-events-none" : "");
      \u0275\u0275advance(2);
      \u0275\u0275property("ngIf", !ctx.state().selectedDelegationId);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.state().selectedDelegationId);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.state().selectedDelegationId);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.state().selectedDelegationId);
      \u0275\u0275advance(3);
      \u0275\u0275classMap(!ctx.state().selectedAgenceId ? "opacity-60 pointer-events-none" : "");
      \u0275\u0275advance(2);
      \u0275\u0275property("ngIf", !ctx.state().selectedAgenceId);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.state().selectedAgenceId);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.state().selectedAgenceId);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.state().selectedAgenceId);
    }
  }, dependencies: [
    CommonModule,
    NgIf,
    InputTextModule,
    InputText,
    TextareaModule,
    FileUploadModule,
    PrimeTemplate,
    TableModule,
    Table,
    FormsModule,
    \u0275NgNoValidate,
    DefaultValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    RequiredValidator,
    NgModel,
    NgForm,
    ButtonModule,
    Button,
    InputGroupModule,
    RippleModule,
    ProgressSpinnerModule,
    ProgressSpinner,
    PasswordModule,
    DropdownModule,
    ToastModule,
    Toast,
    CardModule,
    Card,
    MessageModule,
    Message,
    TagModule,
    Tag
  ], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ConfigReseauComponent, { className: "ConfigReseauComponent", filePath: "src/app/pages/dashboard/admin/config-reseau/config-reseau.component.ts", lineNumber: 48 });
})();
export {
  ConfigReseauComponent
};
//# sourceMappingURL=chunk-IVJZ57R6.js.map
