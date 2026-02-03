import {
  ActivatedRoute,
  Router
} from "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
import {
  UserService
} from "./chunk-SQ5BRWVW.js";
import "./chunk-ZRELZ6R7.js";
import "./chunk-BMYIFZHZ.js";
import {
  CommonModule,
  NgClass
} from "./chunk-SQQPVFHK.js";
import {
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
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-ZKKMBKIA.js";
import {
  __async,
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/pages/dashboard/agent-credit/digital-verification/document-verification/document-detail/document-detail.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function DocumentDetailComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 5);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("#", (tmp_1_0 = ctx_r0.state().etat) == null ? null : tmp_1_0.id, "");
  }
}
function DocumentDetailComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275element(1, "i", 11);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.state().success, " ");
  }
}
function DocumentDetailComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275element(1, "i", 12);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.state().error, " ");
  }
}
function DocumentDetailComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275element(1, "div", 13);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Chargement des d\xE9tails...");
    \u0275\u0275elementEnd()();
  }
}
function DocumentDetailComponent_Conditional_11_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 44);
    \u0275\u0275listener("click", function DocumentDetailComponent_Conditional_11_Conditional_8_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.valider());
    });
    \u0275\u0275element(1, "i", 45);
    \u0275\u0275text(2, " Valider ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r0.state().processing);
  }
}
function DocumentDetailComponent_Conditional_11_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 46);
    \u0275\u0275listener("click", function DocumentDetailComponent_Conditional_11_Conditional_9_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.accepter());
    });
    \u0275\u0275element(1, "i", 47);
    \u0275\u0275text(2, " Accepter ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r0.state().processing);
  }
}
function DocumentDetailComponent_Conditional_11_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 48);
    \u0275\u0275listener("click", function DocumentDetailComponent_Conditional_11_Conditional_10_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.openRejectModal());
    });
    \u0275\u0275element(1, "i", 49);
    \u0275\u0275text(2, " Rejeter ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r0.state().processing);
  }
}
function DocumentDetailComponent_Conditional_11_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 22);
    \u0275\u0275element(1, "i", 50);
    \u0275\u0275text(2, " Traitement... ");
    \u0275\u0275elementEnd();
  }
}
function DocumentDetailComponent_Conditional_11_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 28)(1, "img", 51);
    \u0275\u0275listener("error", function DocumentDetailComponent_Conditional_11_Conditional_19_Template_img_error_1_listener($event) {
      \u0275\u0275restoreView(_r5);
      return \u0275\u0275resetView($event.target.src = "assets/images/default-avatar.png");
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 52)(3, "h4", 53);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 54);
    \u0275\u0275element(6, "i", 55);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 56);
    \u0275\u0275element(9, "i", 57);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("src", ctx_r0.state().etat.user.imageUrl || "assets/images/default-avatar.png", \u0275\u0275sanitizeUrl)("alt", ctx_r0.state().etat.user.firstName);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" ", ctx_r0.state().etat.user.firstName, " ", ctx_r0.state().etat.user.lastName, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.state().etat.user.email, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.state().etat.user.phone || "Non renseign\xE9", " ");
  }
}
function DocumentDetailComponent_Conditional_11_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 34);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.state().etat.pointVente.code);
  }
}
function DocumentDetailComponent_Conditional_11_Conditional_64_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 50);
  }
}
function DocumentDetailComponent_Conditional_11_Conditional_64_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 59);
  }
}
function DocumentDetailComponent_Conditional_11_Conditional_64_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 58);
    \u0275\u0275listener("click", function DocumentDetailComponent_Conditional_11_Conditional_64_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.downloadAllDocuments());
    });
    \u0275\u0275template(1, DocumentDetailComponent_Conditional_11_Conditional_64_Conditional_1_Template, 1, 0, "i", 50)(2, DocumentDetailComponent_Conditional_11_Conditional_64_Conditional_2_Template, 1, 0, "i", 59);
    \u0275\u0275text(3, " Tout t\xE9l\xE9charger ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r0.state().processing);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.state().processing ? 1 : 2);
  }
}
function DocumentDetailComponent_Conditional_11_Conditional_65_For_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 62);
    \u0275\u0275element(1, "img", 71);
    \u0275\u0275elementStart(2, "div", 72);
    \u0275\u0275element(3, "i", 73);
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5, "Agrandir");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const doc_r8 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("src", doc_r8.doc, \u0275\u0275sanitizeUrl)("alt", ctx_r0.getFileName(doc_r8.doc));
  }
}
function DocumentDetailComponent_Conditional_11_Conditional_65_For_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 63);
    \u0275\u0275element(1, "i", 74);
    \u0275\u0275elementEnd();
  }
}
function DocumentDetailComponent_Conditional_11_Conditional_65_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 60)(1, "div", 61);
    \u0275\u0275listener("click", function DocumentDetailComponent_Conditional_11_Conditional_65_For_2_Template_div_click_1_listener() {
      const doc_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.isImage(doc_r8.doc) ? ctx_r0.openImage(doc_r8.doc) : null);
    });
    \u0275\u0275template(2, DocumentDetailComponent_Conditional_11_Conditional_65_For_2_Conditional_2_Template, 6, 2, "div", 62)(3, DocumentDetailComponent_Conditional_11_Conditional_65_For_2_Conditional_3_Template, 2, 0, "div", 63);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 64)(5, "span", 65);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 66);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 67)(10, "button", 68);
    \u0275\u0275listener("click", function DocumentDetailComponent_Conditional_11_Conditional_65_For_2_Template_button_click_10_listener($event) {
      const doc_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      ctx_r0.downloadDocument(doc_r8);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275element(11, "i", 59);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "a", 69);
    \u0275\u0275listener("click", function DocumentDetailComponent_Conditional_11_Conditional_65_For_2_Template_a_click_12_listener($event) {
      \u0275\u0275restoreView(_r7);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275element(13, "i", 70);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const doc_r8 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.isImage(doc_r8.doc) ? 2 : 3);
    \u0275\u0275advance(3);
    \u0275\u0275property("title", ctx_r0.getFileName(doc_r8.doc));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getFileName(doc_r8.doc), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.formatDate(doc_r8.createdAt), " ");
    \u0275\u0275advance(4);
    \u0275\u0275property("href", doc_r8.doc, \u0275\u0275sanitizeUrl);
  }
}
function DocumentDetailComponent_Conditional_11_Conditional_65_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42);
    \u0275\u0275repeaterCreate(1, DocumentDetailComponent_Conditional_11_Conditional_65_For_2_Template, 14, 5, "div", 60, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.state().etat.documents);
  }
}
function DocumentDetailComponent_Conditional_11_Conditional_66_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 43);
    \u0275\u0275element(1, "i", 75);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Aucun document upload\xE9");
    \u0275\u0275elementEnd()();
  }
}
function DocumentDetailComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "div", 14)(2, "div", 15)(3, "span", 16);
    \u0275\u0275text(4, "Statut actuel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 17);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 18);
    \u0275\u0275template(8, DocumentDetailComponent_Conditional_11_Conditional_8_Template, 3, 1, "button", 19)(9, DocumentDetailComponent_Conditional_11_Conditional_9_Template, 3, 1, "button", 20)(10, DocumentDetailComponent_Conditional_11_Conditional_10_Template, 3, 1, "button", 21)(11, DocumentDetailComponent_Conditional_11_Conditional_11_Template, 3, 0, "span", 22);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 23)(13, "div", 24)(14, "div", 25);
    \u0275\u0275element(15, "i", 26);
    \u0275\u0275elementStart(16, "h3");
    \u0275\u0275text(17, "Informations Utilisateur");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div", 27);
    \u0275\u0275template(19, DocumentDetailComponent_Conditional_11_Conditional_19_Template, 11, 6, "div", 28);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "div", 29)(21, "div", 25);
    \u0275\u0275element(22, "i", 30);
    \u0275\u0275elementStart(23, "h3");
    \u0275\u0275text(24, "Localisation");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "div", 27)(26, "div", 31)(27, "span", 32);
    \u0275\u0275text(28, "D\xE9l\xE9gation");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "span", 33);
    \u0275\u0275text(30);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "div", 31)(32, "span", 32);
    \u0275\u0275text(33, "Agence");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "span", 33);
    \u0275\u0275text(35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "div", 31)(37, "span", 32);
    \u0275\u0275text(38, "Point de Vente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "span", 33);
    \u0275\u0275text(40);
    \u0275\u0275template(41, DocumentDetailComponent_Conditional_11_Conditional_41_Template, 2, 1, "span", 34);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(42, "div", 35)(43, "div", 25);
    \u0275\u0275element(44, "i", 36);
    \u0275\u0275elementStart(45, "h3");
    \u0275\u0275text(46, "Dates");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(47, "div", 27)(48, "div", 31)(49, "span", 32);
    \u0275\u0275text(50, "Cr\xE9\xE9 le");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(51, "span", 33);
    \u0275\u0275text(52);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(53, "div", 31)(54, "span", 32);
    \u0275\u0275text(55, "Mis \xE0 jour le");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(56, "span", 33);
    \u0275\u0275text(57);
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(58, "div", 37)(59, "div", 38)(60, "div", 39);
    \u0275\u0275element(61, "i", 40);
    \u0275\u0275elementStart(62, "h3");
    \u0275\u0275text(63);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(64, DocumentDetailComponent_Conditional_11_Conditional_64_Template, 4, 2, "button", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275template(65, DocumentDetailComponent_Conditional_11_Conditional_65_Template, 3, 0, "div", 42)(66, DocumentDetailComponent_Conditional_11_Conditional_66_Template, 4, 0, "div", 43);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275property("ngClass", ctx_r0.getStatutClass(ctx_r0.state().etat.statut));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getStatutLabel(ctx_r0.state().etat.statut), " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.canValidate() ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.canAccept() ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.canReject() ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.state().processing ? 11 : -1);
    \u0275\u0275advance(8);
    \u0275\u0275conditional(ctx_r0.state().etat.user ? 19 : -1);
    \u0275\u0275advance(11);
    \u0275\u0275textInterpolate1(" ", ctx_r0.state().etat.delegation.libele || "-", " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r0.state().etat.agence.libele || "-", " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r0.state().etat.pointVente.libele || "-", " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.state().etat.pointVente.code ? 41 : -1);
    \u0275\u0275advance(11);
    \u0275\u0275textInterpolate(ctx_r0.formatDate(ctx_r0.state().etat.createdAt));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.formatDate(ctx_r0.state().etat.updatedAt));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("Documents (", ctx_r0.state().etat.documentCount, ")");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.state().etat.documents && ctx_r0.state().etat.documents.length > 0 ? 64 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.state().etat.documents && ctx_r0.state().etat.documents.length > 0 ? 65 : 66);
  }
}
function DocumentDetailComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 76);
    \u0275\u0275listener("click", function DocumentDetailComponent_Conditional_12_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeImage());
    });
    \u0275\u0275elementStart(1, "div", 77);
    \u0275\u0275listener("click", function DocumentDetailComponent_Conditional_12_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r9);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "button", 78);
    \u0275\u0275listener("click", function DocumentDetailComponent_Conditional_12_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeImage());
    });
    \u0275\u0275element(3, "i", 49);
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "img", 79);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("src", ctx_r0.state().selectedImage, \u0275\u0275sanitizeUrl);
  }
}
function DocumentDetailComponent_Conditional_13_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 50);
  }
}
function DocumentDetailComponent_Conditional_13_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 49);
  }
}
function DocumentDetailComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 76);
    \u0275\u0275listener("click", function DocumentDetailComponent_Conditional_13_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeRejectModal());
    });
    \u0275\u0275elementStart(1, "div", 80);
    \u0275\u0275listener("click", function DocumentDetailComponent_Conditional_13_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r10);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 81)(3, "h3");
    \u0275\u0275element(4, "i", 82);
    \u0275\u0275text(5, " Rejeter la demande ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 78);
    \u0275\u0275listener("click", function DocumentDetailComponent_Conditional_13_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeRejectModal());
    });
    \u0275\u0275element(7, "i", 49);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 83)(9, "p");
    \u0275\u0275text(10, "\xCAtes-vous s\xFBr de vouloir rejeter cette demande ?");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 84)(12, "label", 85);
    \u0275\u0275text(13, "Motif du rejet (optionnel)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "textarea", 86);
    \u0275\u0275listener("input", function DocumentDetailComponent_Conditional_13_Template_textarea_input_14_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.updateRejectMotif($event));
    });
    \u0275\u0275text(15, "                    ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(16, "div", 87)(17, "button", 88);
    \u0275\u0275listener("click", function DocumentDetailComponent_Conditional_13_Template_button_click_17_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeRejectModal());
    });
    \u0275\u0275text(18, " Annuler ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "button", 89);
    \u0275\u0275listener("click", function DocumentDetailComponent_Conditional_13_Template_button_click_19_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.rejeter());
    });
    \u0275\u0275template(20, DocumentDetailComponent_Conditional_13_Conditional_20_Template, 1, 0, "i", 50)(21, DocumentDetailComponent_Conditional_13_Conditional_21_Template, 1, 0, "i", 49);
    \u0275\u0275text(22, " Confirmer le rejet ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(14);
    \u0275\u0275property("value", ctx_r0.state().rejectMotif);
    \u0275\u0275advance(5);
    \u0275\u0275property("disabled", ctx_r0.state().processing);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.state().processing ? 20 : 21);
  }
}
var DocumentDetailComponent = class _DocumentDetailComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  userService = inject(UserService);
  state = signal({
    etat: null,
    loading: false,
    processing: false,
    error: null,
    success: null,
    selectedImage: null,
    showRejectModal: false,
    rejectMotif: ""
  });
  ngOnInit() {
    const etatId = this.route.snapshot.params["id"];
    if (etatId) {
      this.loadDetail(+etatId);
    }
  }
  loadDetail(etatId) {
    return __async(this, null, function* () {
      this.updateState({ loading: true, error: null });
      try {
        const response = yield this.userService.getEtatDocumentDetail$(etatId).toPromise();
        if (response?.data?.etat) {
          this.updateState({ etat: response.data.etat });
        }
      } catch (error) {
        this.updateState({ error: error?.message || "Erreur lors du chargement" });
      } finally {
        this.updateState({ loading: false });
      }
    });
  }
  valider() {
    return __async(this, null, function* () {
      const { etat } = this.state();
      if (!etat)
        return;
      this.updateState({ processing: true, error: null, success: null });
      try {
        const response = yield this.userService.validerEtatDocument$(etat.id).toPromise();
        if (response?.data?.etat) {
          this.updateState({
            etat: __spreadProps(__spreadValues({}, etat), { statut: "VALIDE" }),
            success: "Document valid\xE9 avec succ\xE8s"
          });
          setTimeout(() => this.loadDetail(etat.id), 1e3);
        }
      } catch (error) {
        this.updateState({ error: error?.message || "Erreur lors de la validation" });
      } finally {
        this.updateState({ processing: false });
      }
    });
  }
  accepter() {
    return __async(this, null, function* () {
      const { etat } = this.state();
      if (!etat)
        return;
      this.updateState({ processing: true, error: null, success: null });
      try {
        const response = yield this.userService.accepterEtatDocument$(etat.id).toPromise();
        if (response?.data?.etat) {
          this.updateState({
            etat: __spreadProps(__spreadValues({}, etat), { statut: "ACCEPTE" }),
            success: "Document accept\xE9 avec succ\xE8s"
          });
          setTimeout(() => this.loadDetail(etat.id), 1e3);
        }
      } catch (error) {
        this.updateState({ error: error?.message || "Erreur lors de l'acceptation" });
      } finally {
        this.updateState({ processing: false });
      }
    });
  }
  openRejectModal() {
    this.updateState({ showRejectModal: true, rejectMotif: "" });
  }
  closeRejectModal() {
    this.updateState({ showRejectModal: false, rejectMotif: "" });
  }
  rejeter() {
    return __async(this, null, function* () {
      const { etat, rejectMotif } = this.state();
      if (!etat)
        return;
      this.updateState({ processing: true, error: null, success: null });
      try {
        const response = yield this.userService.rejeterEtatDocument$(etat.id, rejectMotif).toPromise();
        if (response?.data?.etat) {
          this.updateState({
            etat: __spreadProps(__spreadValues({}, etat), { statut: "REJET" }),
            success: "Document rejet\xE9",
            showRejectModal: false
          });
          setTimeout(() => this.loadDetail(etat.id), 1e3);
        }
      } catch (error) {
        this.updateState({ error: error?.message || "Erreur lors du rejet" });
      } finally {
        this.updateState({ processing: false });
      }
    });
  }
  openImage(imageUrl) {
    this.updateState({ selectedImage: imageUrl });
  }
  closeImage() {
    this.updateState({ selectedImage: null });
  }
  goBack() {
    this.router.navigate(["/dashboards/document-verification"]);
  }
  getStatutClass(statut) {
    const classes = {
      ENCOURS: "status-warning",
      VALIDE: "status-info",
      ACCEPTE: "status-success",
      REJET: "status-danger"
    };
    return classes[statut] || "status-secondary";
  }
  getStatutLabel(statut) {
    const labels = {
      ENCOURS: "En cours",
      VALIDE: "Valid\xE9",
      ACCEPTE: "Accept\xE9",
      REJET: "Rejet\xE9"
    };
    return labels[statut] || statut;
  }
  canValidate() {
    return this.state().etat?.statut === "ENCOURS";
  }
  canAccept() {
    return this.state().etat?.statut === "VALIDE";
  }
  canReject() {
    const statut = this.state().etat?.statut;
    return statut === "ENCOURS" || statut === "VALIDE";
  }
  formatDate(dateString) {
    if (!dateString)
      return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  getFileExtension(url) {
    if (!url)
      return "";
    const parts = url.split(".");
    return parts[parts.length - 1].toLowerCase();
  }
  isImage(url) {
    const ext = this.getFileExtension(url);
    return ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
  }
  getFileName(url) {
    if (!url)
      return "Document";
    const parts = url.split("/");
    return parts[parts.length - 1];
  }
  updateState(partial) {
    this.state.update((current) => __spreadValues(__spreadValues({}, current), partial));
  }
  updateRejectMotif(event) {
    const input = event.target;
    this.updateState({ rejectMotif: input.value });
  }
  /**
   * Télécharger un document
   */
  downloadDocument(doc) {
    return __async(this, null, function* () {
      try {
        const response = yield fetch(doc.doc);
        const blob = yield response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = this.getFileName(doc.doc);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Erreur lors du t\xE9l\xE9chargement:", error);
        this.updateState({ error: "Erreur lors du t\xE9l\xE9chargement du document" });
      }
    });
  }
  /**
   * Télécharger tous les documents
   */
  downloadAllDocuments() {
    return __async(this, null, function* () {
      const { etat } = this.state();
      if (!etat?.documents || etat.documents.length === 0)
        return;
      this.updateState({ processing: true });
      try {
        for (const doc of etat.documents) {
          yield this.downloadDocument(doc);
          yield new Promise((resolve) => setTimeout(resolve, 500));
        }
        this.updateState({ success: `${etat.documents.length} document(s) t\xE9l\xE9charg\xE9(s)` });
      } catch (error) {
        this.updateState({ error: "Erreur lors du t\xE9l\xE9chargement des documents" });
      } finally {
        this.updateState({ processing: false });
      }
    });
  }
  static \u0275fac = function DocumentDetailComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DocumentDetailComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DocumentDetailComponent, selectors: [["app-document-detail"]], features: [\u0275\u0275ProvidersFeature([UserService])], decls: 14, vars: 7, consts: [[1, "document-detail-container"], [1, "page-header"], [1, "btn", "btn-back", 3, "click"], [1, "fas", "fa-arrow-left"], [1, "page-title"], [1, "id-badge"], [1, "alert", "alert-success"], [1, "alert", "alert-danger"], [1, "loading-container"], [1, "detail-content"], [1, "modal-overlay"], [1, "fas", "fa-check-circle"], [1, "fas", "fa-exclamation-triangle"], ["role", "status", 1, "spinner-border", "text-primary"], [1, "status-actions-card"], [1, "status-section"], [1, "status-label"], [1, "status-badge", 3, "ngClass"], [1, "actions-section"], [1, "btn", "btn-success", "btn-action", 3, "disabled"], [1, "btn", "btn-primary", "btn-action", 3, "disabled"], [1, "btn", "btn-danger", "btn-action", 3, "disabled"], [1, "processing-indicator"], [1, "info-grid"], [1, "info-card", "user-card"], [1, "card-header"], [1, "fas", "fa-user"], [1, "card-body"], [1, "user-profile"], [1, "info-card", "location-card"], [1, "fas", "fa-map-marker-alt"], [1, "info-row"], [1, "info-label"], [1, "info-value"], [1, "code-badge"], [1, "info-card", "dates-card"], [1, "fas", "fa-calendar-alt"], [1, "documents-section"], [1, "section-header"], [1, "section-title"], [1, "fas", "fa-file-image"], [1, "btn", "btn-outline-primary", "btn-download-all", 3, "disabled"], [1, "documents-grid"], [1, "empty-documents"], [1, "btn", "btn-success", "btn-action", 3, "click", "disabled"], [1, "fas", "fa-check"], [1, "btn", "btn-primary", "btn-action", 3, "click", "disabled"], [1, "fas", "fa-thumbs-up"], [1, "btn", "btn-danger", "btn-action", 3, "click", "disabled"], [1, "fas", "fa-times"], [1, "fas", "fa-spinner", "fa-spin"], [1, "user-avatar", 3, "error", "src", "alt"], [1, "user-info"], [1, "user-name"], [1, "user-email"], [1, "fas", "fa-envelope"], [1, "user-phone"], [1, "fas", "fa-phone"], [1, "btn", "btn-outline-primary", "btn-download-all", 3, "click", "disabled"], [1, "fas", "fa-download"], [1, "document-card"], [1, "document-preview-wrapper", 3, "click"], [1, "document-preview", "image-preview"], [1, "document-preview", "file-preview"], [1, "document-info"], [1, "document-name", 3, "title"], [1, "document-date"], [1, "document-actions"], ["title", "T\xE9l\xE9charger", 1, "btn", "btn-sm", "btn-primary", "download-btn", 3, "click"], ["target", "_blank", "title", "Ouvrir dans un nouvel onglet", 1, "btn", "btn-sm", "btn-outline-secondary", 3, "click", "href"], [1, "fas", "fa-external-link-alt"], [3, "src", "alt"], [1, "preview-overlay"], [1, "fas", "fa-search-plus"], [1, "fas", "fa-file-pdf"], [1, "fas", "fa-folder-open"], [1, "modal-overlay", 3, "click"], [1, "modal-content", "image-modal", 3, "click"], [1, "close-btn", 3, "click"], ["alt", "Document", 3, "src"], [1, "modal-content", "reject-modal", 3, "click"], [1, "modal-header"], [1, "fas", "fa-exclamation-triangle", "text-danger"], [1, "modal-body"], [1, "form-group"], ["for", "motif"], ["id", "motif", "rows", "3", "placeholder", "Indiquez la raison du rejet...", 1, "form-control", 3, "input", "value"], [1, "modal-footer"], [1, "btn", "btn-secondary", 3, "click"], [1, "btn", "btn-danger", 3, "click", "disabled"]], template: function DocumentDetailComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "button", 2);
      \u0275\u0275listener("click", function DocumentDetailComponent_Template_button_click_2_listener() {
        return ctx.goBack();
      });
      \u0275\u0275element(3, "i", 3);
      \u0275\u0275text(4, " Retour ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "h1", 4);
      \u0275\u0275text(6, " D\xE9tail de la demande ");
      \u0275\u0275template(7, DocumentDetailComponent_Conditional_7_Template, 2, 1, "span", 5);
      \u0275\u0275elementEnd()();
      \u0275\u0275template(8, DocumentDetailComponent_Conditional_8_Template, 3, 1, "div", 6)(9, DocumentDetailComponent_Conditional_9_Template, 3, 1, "div", 7)(10, DocumentDetailComponent_Conditional_10_Template, 4, 0, "div", 8)(11, DocumentDetailComponent_Conditional_11_Template, 67, 16, "div", 9);
      \u0275\u0275elementEnd();
      \u0275\u0275template(12, DocumentDetailComponent_Conditional_12_Template, 5, 1, "div", 10)(13, DocumentDetailComponent_Conditional_13_Template, 23, 3, "div", 10);
    }
    if (rf & 2) {
      \u0275\u0275advance(7);
      \u0275\u0275conditional(ctx.state().etat ? 7 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.state().success ? 8 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.state().error ? 9 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.state().loading ? 10 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.state().loading && ctx.state().etat ? 11 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.state().selectedImage ? 12 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.state().showRejectModal ? 13 : -1);
    }
  }, dependencies: [CommonModule, NgClass], styles: ["\n\n.document-detail-container[_ngcontent-%COMP%] {\n  padding: 1.5rem;\n  max-width: 1200px;\n  margin: 0 auto;\n}\n.page-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  margin-bottom: 1.5rem;\n}\n.page-header[_ngcontent-%COMP%]   .btn-back[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.5rem 1rem;\n  background: #f8f9fa;\n  border: 1px solid #dee2e6;\n  border-radius: 8px;\n  color: #495057;\n  transition: all 0.2s ease;\n}\n.page-header[_ngcontent-%COMP%]   .btn-back[_ngcontent-%COMP%]:hover {\n  background: #e9ecef;\n}\n.page-header[_ngcontent-%COMP%]   .page-title[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: #2c3e50;\n  margin: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n}\n.page-header[_ngcontent-%COMP%]   .page-title[_ngcontent-%COMP%]   .id-badge[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  padding: 0.25rem 0.75rem;\n  background: #e3f2fd;\n  color: #1976d2;\n  border-radius: 20px;\n}\n.alert[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  padding: 1rem 1.25rem;\n  border-radius: 10px;\n  margin-bottom: 1rem;\n}\n.alert.alert-success[_ngcontent-%COMP%] {\n  background: #d4edda;\n  color: #155724;\n}\n.alert.alert-danger[_ngcontent-%COMP%] {\n  background: #f8d7da;\n  color: #721c24;\n}\n.loading-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 4rem;\n  color: #6c757d;\n}\n.loading-container[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n}\n.status-actions-card[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 1.25rem 1.5rem;\n  background: #fff;\n  border-radius: 12px;\n  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);\n  margin-bottom: 1.5rem;\n}\n.status-actions-card[_ngcontent-%COMP%]   .status-section[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n}\n.status-actions-card[_ngcontent-%COMP%]   .status-section[_ngcontent-%COMP%]   .status-label[_ngcontent-%COMP%] {\n  color: #6c757d;\n  font-weight: 500;\n}\n.status-actions-card[_ngcontent-%COMP%]   .status-section[_ngcontent-%COMP%]   .status-badge[_ngcontent-%COMP%] {\n  padding: 0.5rem 1.25rem;\n  border-radius: 25px;\n  font-weight: 600;\n  font-size: 0.95rem;\n}\n.status-actions-card[_ngcontent-%COMP%]   .status-section[_ngcontent-%COMP%]   .status-badge.status-warning[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #fff3cd 0%,\n      #ffeeba 100%);\n  color: #856404;\n}\n.status-actions-card[_ngcontent-%COMP%]   .status-section[_ngcontent-%COMP%]   .status-badge.status-info[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #cce5ff 0%,\n      #b8daff 100%);\n  color: #004085;\n}\n.status-actions-card[_ngcontent-%COMP%]   .status-section[_ngcontent-%COMP%]   .status-badge.status-success[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #d4edda 0%,\n      #c3e6cb 100%);\n  color: #155724;\n}\n.status-actions-card[_ngcontent-%COMP%]   .status-section[_ngcontent-%COMP%]   .status-badge.status-danger[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #f8d7da 0%,\n      #f5c6cb 100%);\n  color: #721c24;\n}\n.status-actions-card[_ngcontent-%COMP%]   .actions-section[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.75rem;\n  align-items: center;\n}\n.status-actions-card[_ngcontent-%COMP%]   .actions-section[_ngcontent-%COMP%]   .btn-action[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.625rem 1.25rem;\n  border-radius: 8px;\n  font-weight: 500;\n  transition: all 0.2s ease;\n}\n.status-actions-card[_ngcontent-%COMP%]   .actions-section[_ngcontent-%COMP%]   .btn-action[_ngcontent-%COMP%]:hover:not(:disabled) {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n}\n.status-actions-card[_ngcontent-%COMP%]   .actions-section[_ngcontent-%COMP%]   .btn-action[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.status-actions-card[_ngcontent-%COMP%]   .actions-section[_ngcontent-%COMP%]   .processing-indicator[_ngcontent-%COMP%] {\n  color: #6c757d;\n  font-size: 0.9rem;\n}\n.info-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 1.5rem;\n  margin-bottom: 1.5rem;\n}\n.info-card[_ngcontent-%COMP%] {\n  background: #fff;\n  border-radius: 12px;\n  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);\n  overflow: hidden;\n}\n.info-card[_ngcontent-%COMP%]   .card-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  padding: 1rem 1.25rem;\n  background:\n    linear-gradient(\n      135deg,\n      #f8f9fa 0%,\n      #fff 100%);\n  border-bottom: 1px solid #e9ecef;\n}\n.info-card[_ngcontent-%COMP%]   .card-header[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  color: #3498db;\n}\n.info-card[_ngcontent-%COMP%]   .card-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  font-weight: 600;\n  color: #2c3e50;\n  margin: 0;\n}\n.info-card[_ngcontent-%COMP%]   .card-body[_ngcontent-%COMP%] {\n  padding: 1.25rem;\n}\n.user-profile[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n}\n.user-profile[_ngcontent-%COMP%]   .user-avatar[_ngcontent-%COMP%] {\n  width: 64px;\n  height: 64px;\n  border-radius: 50%;\n  object-fit: cover;\n  border: 3px solid #e9ecef;\n}\n.user-profile[_ngcontent-%COMP%]   .user-info[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.user-profile[_ngcontent-%COMP%]   .user-info[_ngcontent-%COMP%]   .user-name[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  font-weight: 600;\n  color: #2c3e50;\n  margin: 0 0 0.5rem;\n}\n.user-profile[_ngcontent-%COMP%]   .user-info[_ngcontent-%COMP%]   .user-email[_ngcontent-%COMP%], \n.user-profile[_ngcontent-%COMP%]   .user-info[_ngcontent-%COMP%]   .user-phone[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-size: 0.9rem;\n  color: #6c757d;\n  margin: 0.25rem 0;\n}\n.user-profile[_ngcontent-%COMP%]   .user-info[_ngcontent-%COMP%]   .user-email[_ngcontent-%COMP%]   i[_ngcontent-%COMP%], \n.user-profile[_ngcontent-%COMP%]   .user-info[_ngcontent-%COMP%]   .user-phone[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  width: 16px;\n  color: #adb5bd;\n}\n.info-row[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0.75rem 0;\n  border-bottom: 1px solid #f1f3f4;\n}\n.info-row[_ngcontent-%COMP%]:last-child {\n  border-bottom: none;\n}\n.info-row[_ngcontent-%COMP%]   .info-label[_ngcontent-%COMP%] {\n  color: #6c757d;\n  font-size: 0.9rem;\n}\n.info-row[_ngcontent-%COMP%]   .info-value[_ngcontent-%COMP%] {\n  font-weight: 500;\n  color: #2c3e50;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.info-row[_ngcontent-%COMP%]   .info-value[_ngcontent-%COMP%]   .code-badge[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  padding: 0.15rem 0.5rem;\n  background: #e9ecef;\n  border-radius: 4px;\n  color: #495057;\n}\n.documents-section[_ngcontent-%COMP%] {\n  background: #fff;\n  border-radius: 12px;\n  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);\n  overflow: hidden;\n}\n.documents-section[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  padding: 1rem 1.25rem;\n  background:\n    linear-gradient(\n      135deg,\n      #f8f9fa 0%,\n      #fff 100%);\n  border-bottom: 1px solid #e9ecef;\n}\n.documents-section[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  color: #e74c3c;\n}\n.documents-section[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  font-weight: 600;\n  color: #2c3e50;\n  margin: 0;\n}\n.documents-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));\n  gap: 1rem;\n  padding: 1.25rem;\n}\n.document-card[_ngcontent-%COMP%] {\n  background: #f8f9fa;\n  border-radius: 10px;\n  overflow: hidden;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  position: relative;\n}\n.document-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);\n}\n.document-card[_ngcontent-%COMP%]:hover   .preview-overlay[_ngcontent-%COMP%] {\n  opacity: 1;\n}\n.document-card[_ngcontent-%COMP%]   .document-preview[_ngcontent-%COMP%] {\n  height: 150px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n}\n.document-card[_ngcontent-%COMP%]   .document-preview.image-preview[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n.document-card[_ngcontent-%COMP%]   .document-preview.file-preview[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #e74c3c 0%,\n      #c0392b 100%);\n}\n.document-card[_ngcontent-%COMP%]   .document-preview.file-preview[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  color: #fff;\n}\n.document-card[_ngcontent-%COMP%]   .document-preview[_ngcontent-%COMP%]   .preview-overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  color: #fff;\n  opacity: 0;\n  transition: opacity 0.2s ease;\n}\n.document-card[_ngcontent-%COMP%]   .document-preview[_ngcontent-%COMP%]   .preview-overlay[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  margin-bottom: 0.25rem;\n}\n.document-card[_ngcontent-%COMP%]   .document-preview[_ngcontent-%COMP%]   .preview-overlay[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n}\n.document-card[_ngcontent-%COMP%]   .document-info[_ngcontent-%COMP%] {\n  padding: 0.75rem;\n}\n.document-card[_ngcontent-%COMP%]   .document-info[_ngcontent-%COMP%]   .document-name[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.85rem;\n  font-weight: 500;\n  color: #2c3e50;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.document-card[_ngcontent-%COMP%]   .document-info[_ngcontent-%COMP%]   .document-date[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.75rem;\n  color: #6c757d;\n  margin-top: 0.25rem;\n}\n.document-card[_ngcontent-%COMP%]   .download-btn[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.5rem;\n  right: 0.5rem;\n  width: 32px;\n  height: 32px;\n  padding: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n  background: #fff;\n  opacity: 0.9;\n}\n.document-card[_ngcontent-%COMP%]   .download-btn[_ngcontent-%COMP%]:hover {\n  opacity: 1;\n}\n.empty-documents[_ngcontent-%COMP%] {\n  padding: 3rem;\n  text-align: center;\n  color: #6c757d;\n}\n.empty-documents[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  opacity: 0.5;\n  margin-bottom: 1rem;\n}\n.modal-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.7);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000;\n  padding: 1rem;\n}\n.modal-content[_ngcontent-%COMP%] {\n  background: #fff;\n  border-radius: 12px;\n  max-width: 90vw;\n  max-height: 90vh;\n  position: relative;\n}\n.modal-content[_ngcontent-%COMP%]   .close-btn[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 1rem;\n  right: 1rem;\n  width: 36px;\n  height: 36px;\n  border-radius: 50%;\n  border: none;\n  background: rgba(0, 0, 0, 0.1);\n  color: #495057;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all 0.2s ease;\n  z-index: 10;\n}\n.modal-content[_ngcontent-%COMP%]   .close-btn[_ngcontent-%COMP%]:hover {\n  background: rgba(0, 0, 0, 0.2);\n}\n.modal-content.image-modal[_ngcontent-%COMP%] {\n  background: transparent;\n  box-shadow: none;\n}\n.modal-content.image-modal[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  max-width: 100%;\n  max-height: 85vh;\n  border-radius: 8px;\n}\n.modal-content.image-modal[_ngcontent-%COMP%]   .close-btn[_ngcontent-%COMP%] {\n  background: #fff;\n  top: -18px;\n  right: -18px;\n}\n.modal-content.reject-modal[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 500px;\n}\n.modal-content.reject-modal[_ngcontent-%COMP%]   .modal-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 1.25rem;\n  border-bottom: 1px solid #e9ecef;\n}\n.modal-content.reject-modal[_ngcontent-%COMP%]   .modal-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  margin: 0;\n  font-size: 1.15rem;\n}\n.modal-content.reject-modal[_ngcontent-%COMP%]   .modal-header[_ngcontent-%COMP%]   .close-btn[_ngcontent-%COMP%] {\n  position: static;\n  background: transparent;\n}\n.modal-content.reject-modal[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%] {\n  padding: 1.25rem;\n}\n.modal-content.reject-modal[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%]   .form-group[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n}\n.modal-content.reject-modal[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%]   .form-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  margin-bottom: 0.5rem;\n  font-weight: 500;\n  color: #495057;\n}\n.modal-content.reject-modal[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%]   .form-group[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.75rem;\n  border: 1px solid #ced4da;\n  border-radius: 8px;\n  resize: vertical;\n}\n.modal-content.reject-modal[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%]   .form-group[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #3498db;\n  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);\n}\n.modal-content.reject-modal[_ngcontent-%COMP%]   .modal-footer[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.75rem;\n  padding: 1rem 1.25rem;\n  border-top: 1px solid #e9ecef;\n}\n@media (max-width: 768px) {\n  .status-actions-card[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 1rem;\n    align-items: flex-start;\n  }\n  .actions-section[_ngcontent-%COMP%] {\n    width: 100%;\n    flex-wrap: wrap;\n  }\n  .documents-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n.section-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 1.5rem;\n  flex-wrap: wrap;\n  gap: 1rem;\n}\n.section-header[_ngcontent-%COMP%]   .section-title[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n}\n.section-header[_ngcontent-%COMP%]   .section-title[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  color: var(--primary-color, #007bff);\n}\n.section-header[_ngcontent-%COMP%]   .section-title[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.25rem;\n  font-weight: 600;\n}\n.section-header[_ngcontent-%COMP%]   .btn-download-all[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.5rem 1rem;\n  font-size: 0.875rem;\n  border-radius: 8px;\n  transition: all 0.2s ease;\n}\n.section-header[_ngcontent-%COMP%]   .btn-download-all[_ngcontent-%COMP%]:hover:not(:disabled) {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);\n}\n.section-header[_ngcontent-%COMP%]   .btn-download-all[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.documents-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));\n  gap: 1.5rem;\n}\n.document-card[_ngcontent-%COMP%] {\n  background: #fff;\n  border-radius: 12px;\n  overflow: hidden;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);\n  transition: all 0.3s ease;\n  border: 1px solid #e9ecef;\n}\n.document-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);\n}\n.document-preview-wrapper[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n.document-preview[_ngcontent-%COMP%] {\n  height: 180px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: #f8f9fa;\n  position: relative;\n  overflow: hidden;\n}\n.document-preview.image-preview[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  transition: transform 0.3s ease;\n}\n.document-preview.image-preview[_ngcontent-%COMP%]:hover   img[_ngcontent-%COMP%] {\n  transform: scale(1.05);\n}\n.document-preview.file-preview[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  color: #dc3545;\n}\n.document-preview[_ngcontent-%COMP%]   .preview-overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  opacity: 0;\n  transition: opacity 0.3s ease;\n  color: white;\n  gap: 0.5rem;\n}\n.document-preview[_ngcontent-%COMP%]   .preview-overlay[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n}\n.document-preview[_ngcontent-%COMP%]   .preview-overlay[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n}\n.document-preview[_ngcontent-%COMP%]:hover   .preview-overlay[_ngcontent-%COMP%] {\n  opacity: 1;\n}\n.document-info[_ngcontent-%COMP%] {\n  padding: 1rem;\n  border-bottom: 1px solid #e9ecef;\n}\n.document-info[_ngcontent-%COMP%]   .document-name[_ngcontent-%COMP%] {\n  display: block;\n  font-weight: 500;\n  color: #212529;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  margin-bottom: 0.25rem;\n}\n.document-info[_ngcontent-%COMP%]   .document-date[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: #6c757d;\n}\n.document-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.5rem;\n  padding: 0.75rem 1rem;\n  background: #f8f9fa;\n}\n.document-actions[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  padding: 0.5rem;\n  border-radius: 6px;\n  font-size: 0.875rem;\n  transition: all 0.2s ease;\n}\n.document-actions[_ngcontent-%COMP%]   .btn.download-btn[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #007bff 0%,\n      #0056b3 100%);\n  border: none;\n  color: white;\n}\n.document-actions[_ngcontent-%COMP%]   .btn.download-btn[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);\n}\n.document-actions[_ngcontent-%COMP%]   .btn.btn-outline-secondary[_ngcontent-%COMP%]:hover {\n  background: #6c757d;\n  color: white;\n}\n.empty-documents[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 3rem;\n  background: #f8f9fa;\n  border-radius: 12px;\n  border: 2px dashed #dee2e6;\n}\n.empty-documents[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  color: #adb5bd;\n  margin-bottom: 1rem;\n}\n.empty-documents[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #6c757d;\n  margin: 0;\n}\n@media (max-width: 576px) {\n  .section-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .section-header[_ngcontent-%COMP%]   .btn-download-all[_ngcontent-%COMP%] {\n    width: 100%;\n    justify-content: center;\n  }\n  .documents-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=document-detail.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DocumentDetailComponent, { className: "DocumentDetailComponent", filePath: "src/app/pages/dashboard/agent-credit/digital-verification/document-verification/document-detail/document-detail.component.ts", lineNumber: 26 });
})();
export {
  DocumentDetailComponent
};
//# sourceMappingURL=chunk-LXQNP4RN.js.map
