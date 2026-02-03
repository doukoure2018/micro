import {
  FileUpload,
  FileUploadModule
} from "./chunk-ZNXRKGHP.js";
import {
  ImageModule
} from "./chunk-EUWFULGH.js";
import "./chunk-UZIOTGW7.js";
import {
  ConfirmDialog,
  ConfirmDialogModule
} from "./chunk-JQ4E7TJM.js";
import {
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
import "./chunk-WQ2EPPBK.js";
import {
  TableModule
} from "./chunk-REDVHUQC.js";
import "./chunk-YZRRSC3U.js";
import "./chunk-6K6X5UBT.js";
import "./chunk-7HJ4XJ7U.js";
import "./chunk-UQSIOFSP.js";
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
import "./chunk-JGOABXTK.js";
import "./chunk-HY2A3TN6.js";
import "./chunk-YEN5RMZS.js";
import "./chunk-XS7IVZ5T.js";
import "./chunk-CUABQE42.js";
import "./chunk-V6CKOH3G.js";
import "./chunk-DBPX6ILC.js";
import "./chunk-WIQZFAVH.js";
import "./chunk-CCBQFN2J.js";
import {
  ProgressSpinnerModule
} from "./chunk-Y2J5OGKB.js";
import {
  ActivatedRoute,
  Router,
  RouterLink
} from "./chunk-BTKK64MU.js";
import {
  DomSanitizer
} from "./chunk-36C7KO53.js";
import {
  takeUntilDestroyed
} from "./chunk-WRLBQDQK.js";
import "./chunk-KHEKFKWA.js";
import "./chunk-FZELBHWZ.js";
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
  ConfirmationService,
  MessageService,
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
  DatePipe,
  NgForOf,
  NgIf
} from "./chunk-SQQPVFHK.js";
import {
  DestroyRef,
  EMPTY,
  catchError,
  forkJoin,
  inject,
  of,
  signal,
  switchMap,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵclassMap,
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
  ɵɵpureFunction1,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
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

// src/app/pages/dashboard/agent-credit/credit-selection/import-selection/import-selection.component.ts
var _c0 = () => ({ width: "450px" });
var _c1 = () => ({ width: "90vw", maxWidth: "1000px", minHeight: "400px" });
var _c2 = () => ({ width: "90vw", maxWidth: "1200px", height: "80vh" });
var _c3 = (a0) => ["/dashboards/credit/individuel/attente/detail", a0];
function ImportSelectionComponent_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24)(1, "span", 25);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(3, "button", 26);
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.state().documents.length, " document(s) pr\xEAt(s) ");
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(2, _c3, (tmp_3_0 = ctx_r1.state().demandeIndividuel) == null ? null : tmp_3_0.demandeIndividuelId));
  }
}
function ImportSelectionComponent_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15)(1, "span", 27);
    \u0275\u0275text(2, " En attente de documents ");
    \u0275\u0275elementEnd()();
  }
}
function ImportSelectionComponent_div_25_div_21_div_7_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 71);
    \u0275\u0275element(1, "img", 72);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const preview_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("src", preview_r6.url, \u0275\u0275sanitizeUrl);
  }
}
function ImportSelectionComponent_div_25_div_21_div_7_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 71)(1, "div", 73);
    \u0275\u0275listener("click", function ImportSelectionComponent_div_25_div_21_div_7_div_3_Template_div_click_1_listener() {
      \u0275\u0275restoreView(_r7);
      const preview_r6 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.previewPDF(preview_r6));
    });
    \u0275\u0275element(2, "i", 74);
    \u0275\u0275elementStart(3, "span", 75);
    \u0275\u0275text(4, "PDF Document");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 76);
    \u0275\u0275text(6, "Cliquez pour pr\xE9visualiser");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 77);
    \u0275\u0275element(8, "i", 78);
    \u0275\u0275text(9, " PDF ");
    \u0275\u0275elementEnd()();
  }
}
function ImportSelectionComponent_div_25_div_21_div_7_div_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 79);
    \u0275\u0275element(1, "i", 80);
    \u0275\u0275elementStart(2, "span", 75);
    \u0275\u0275text(3, "Document Word");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 76);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const preview_r6 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.getFileExtension(preview_r6.file.name));
  }
}
function ImportSelectionComponent_div_25_div_21_div_7_div_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 81);
    \u0275\u0275element(1, "i", 82);
    \u0275\u0275elementStart(2, "span", 75);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 76);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const preview_r6 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.getFileTypeDisplay(preview_r6.file));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.getFileExtension(preview_r6.file.name));
  }
}
function ImportSelectionComponent_div_25_div_21_div_7_div_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 67);
    \u0275\u0275element(1, "i", 83);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const preview_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", preview_r6.width, "\xD7", preview_r6.height, "");
  }
}
function ImportSelectionComponent_div_25_div_21_div_7_div_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 84)(1, "button", 85);
    \u0275\u0275listener("click", function ImportSelectionComponent_div_25_div_21_div_7_div_19_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r9);
      const preview_r6 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.previewPDF(preview_r6));
    });
    \u0275\u0275elementEnd()();
  }
}
function ImportSelectionComponent_div_25_div_21_div_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 56)(1, "div", 57);
    \u0275\u0275template(2, ImportSelectionComponent_div_25_div_21_div_7_div_2_Template, 2, 1, "div", 58)(3, ImportSelectionComponent_div_25_div_21_div_7_div_3_Template, 10, 0, "div", 58)(4, ImportSelectionComponent_div_25_div_21_div_7_div_4_Template, 6, 1, "div", 59)(5, ImportSelectionComponent_div_25_div_21_div_7_div_5_Template, 6, 2, "div", 60);
    \u0275\u0275elementStart(6, "button", 61);
    \u0275\u0275listener("click", function ImportSelectionComponent_div_25_div_21_div_7_Template_button_click_6_listener() {
      const i_r8 = \u0275\u0275restoreView(_r5).index;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.removeFile(i_r8));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 62)(8, "div", 63);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 64)(11, "span", 65);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 66)(14, "div", 67);
    \u0275\u0275element(15, "i", 68);
    \u0275\u0275elementStart(16, "span");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(18, ImportSelectionComponent_div_25_div_21_div_7_div_18_Template, 4, 2, "div", 69)(19, ImportSelectionComponent_div_25_div_21_div_7_div_19_Template, 2, 0, "div", 70);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const preview_r6 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", preview_r6.file.type.includes("image"));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", preview_r6.file.type === "application/pdf");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", preview_r6.file.type.includes("word") || preview_r6.file.type.includes("document"));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !preview_r6.file.type.includes("image") && preview_r6.file.type !== "application/pdf" && !preview_r6.file.type.includes("word") && !preview_r6.file.type.includes("document"));
    \u0275\u0275advance(3);
    \u0275\u0275property("title", preview_r6.file.name);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", preview_r6.file.name, " ");
    \u0275\u0275advance(2);
    \u0275\u0275classMap(ctx_r1.getFileTypeBadgeClass(preview_r6.file));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.getFileTypeDisplay(preview_r6.file), " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.formatFileSize(preview_r6.file.size));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", preview_r6.width && preview_r6.height);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", preview_r6.file.type === "application/pdf");
  }
}
function ImportSelectionComponent_div_25_div_21_i_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 86);
  }
}
function ImportSelectionComponent_div_25_div_21_i_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 87);
  }
}
function ImportSelectionComponent_div_25_div_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 46)(1, "div", 47)(2, "h3", 48);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 49);
    \u0275\u0275text(5, " Pr\xEAt pour le t\xE9l\xE9versement ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 50);
    \u0275\u0275template(7, ImportSelectionComponent_div_25_div_21_div_7_Template, 20, 12, "div", 51);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 52)(9, "button", 53);
    \u0275\u0275listener("click", function ImportSelectionComponent_div_25_div_21_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.uploadDocuments());
    });
    \u0275\u0275template(10, ImportSelectionComponent_div_25_div_21_i_10_Template, 1, 0, "i", 54)(11, ImportSelectionComponent_div_25_div_21_i_11_Template, 1, 0, "i", 55);
    \u0275\u0275elementStart(12, "span");
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" Fichiers s\xE9lectionn\xE9s (", ctx_r1.state().previews.length, ") ");
    \u0275\u0275advance(4);
    \u0275\u0275property("ngForOf", ctx_r1.state().previews);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.state().loading || ctx_r1.state().previews.length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.state().loading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.state().loading);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.state().loading ? "T\xE9l\xE9versement..." : "T\xE9l\xE9verser tous les documents");
  }
}
function ImportSelectionComponent_div_25_div_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 88)(1, "div", 89)(2, "div", 31);
    \u0275\u0275element(3, "i", 90);
    \u0275\u0275elementStart(4, "span", 91);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.state().error);
  }
}
function ImportSelectionComponent_div_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 28)(1, "div", 29)(2, "div", 30)(3, "div", 31)(4, "div", 32);
    \u0275\u0275element(5, "i", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div")(7, "h2", 34);
    \u0275\u0275text(8, "T\xE9l\xE9verser des documents");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p", 35);
    \u0275\u0275text(10, "Formats accept\xE9s: Images, PDF, Word");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(11, "div", 36)(12, "div", 37)(13, "div", 38)(14, "p-fileUpload", 39);
    \u0275\u0275listener("onSelect", function ImportSelectionComponent_div_25_Template_p_fileUpload_onSelect_14_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onFileSelect($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 40);
    \u0275\u0275element(16, "i", 41);
    \u0275\u0275elementStart(17, "div", 42);
    \u0275\u0275text(18, " Glissez vos fichiers ici ou cliquez pour parcourir ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "p", 43);
    \u0275\u0275text(20, " Taille max: 10MB \u2022 Formats: JPG, PNG, PDF, DOC, DOCX ");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275template(21, ImportSelectionComponent_div_25_div_21_Template, 14, 6, "div", 44)(22, ImportSelectionComponent_div_25_div_22_Template, 6, 1, "div", 45);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(14);
    \u0275\u0275property("showUploadButton", false)("showCancelButton", false)("multiple", true);
    \u0275\u0275advance(7);
    \u0275\u0275property("ngIf", ctx_r1.state().previews.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.state().error);
  }
}
function ImportSelectionComponent_div_26_div_5_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 121);
    \u0275\u0275element(1, "img", 122);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r11 = \u0275\u0275nextContext();
    const doc_r11 = ctx_r11.$implicit;
    const i_r13 = ctx_r11.index;
    \u0275\u0275advance();
    \u0275\u0275property("src", doc_r11.doc, \u0275\u0275sanitizeUrl)("alt", "Document " + (i_r13 + 1));
  }
}
function ImportSelectionComponent_div_26_div_5_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 123);
    \u0275\u0275element(1, "i", 124);
    \u0275\u0275elementStart(2, "span", 125);
    \u0275\u0275text(3, "Document PDF");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 76);
    \u0275\u0275text(5, "Cliquez pour pr\xE9visualiser");
    \u0275\u0275elementEnd()();
  }
}
function ImportSelectionComponent_div_26_div_5_div_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 126);
    \u0275\u0275element(1, "i", 127);
    \u0275\u0275elementStart(2, "span", 125);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 76);
    \u0275\u0275text(5, "Document");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const doc_r11 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.getDocumentExtension(doc_r11));
  }
}
function ImportSelectionComponent_div_26_div_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 96)(1, "div", 97)(2, "div", 98)(3, "div", 99);
    \u0275\u0275listener("click", function ImportSelectionComponent_div_26_div_5_Template_div_click_3_listener() {
      const doc_r11 = \u0275\u0275restoreView(_r10).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.viewDocument(doc_r11));
    });
    \u0275\u0275elementStart(4, "span", 100);
    \u0275\u0275element(5, "i", 101);
    \u0275\u0275text(6, " VALID\xC9 ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 102);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275template(9, ImportSelectionComponent_div_26_div_5_div_9_Template, 2, 2, "div", 103)(10, ImportSelectionComponent_div_26_div_5_div_10_Template, 6, 0, "div", 104)(11, ImportSelectionComponent_div_26_div_5_div_11_Template, 6, 1, "div", 105);
    \u0275\u0275elementStart(12, "div", 106)(13, "button", 107);
    \u0275\u0275element(14, "i", 108);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(16, "div", 109)(17, "span", 110);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span", 111);
    \u0275\u0275element(20, "i", 112);
    \u0275\u0275elementStart(21, "span", 113);
    \u0275\u0275text(22, "5.0");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(23, "p", 114);
    \u0275\u0275text(24);
    \u0275\u0275pipe(25, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "div", 115)(27, "span", 116);
    \u0275\u0275element(28, "i", 117);
    \u0275\u0275text(29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "div", 118)(31, "button", 119);
    \u0275\u0275listener("click", function ImportSelectionComponent_div_26_div_5_Template_button_click_31_listener($event) {
      const doc_r11 = \u0275\u0275restoreView(_r10).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      ctx_r1.viewDocument(doc_r11);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "button", 120);
    \u0275\u0275listener("click", function ImportSelectionComponent_div_26_div_5_Template_button_click_32_listener($event) {
      const doc_r11 = \u0275\u0275restoreView(_r10).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      ctx_r1.confirmDelete(doc_r11);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementEnd()()()()()();
  }
  if (rf & 2) {
    const doc_r11 = ctx.$implicit;
    const i_r13 = ctx.index;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(7);
    \u0275\u0275classMap(ctx_r1.isPDFDocument(doc_r11) ? "bg-red-500 text-white" : "bg-blue-500 text-white");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.getDocumentExtension(doc_r11), " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.isImageDocument(doc_r11));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.isPDFDocument(doc_r11));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isImageDocument(doc_r11) && !ctx_r1.isPDFDocument(doc_r11));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.isPDFDocument(doc_r11) ? "Voir PDF" : "Aper\xE7u", " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" Document ", i_r13 + 1, " ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2(" ", ctx_r1.getDocumentExtension(doc_r11), " t\xE9l\xE9vers\xE9 le ", doc_r11.createdAt ? \u0275\u0275pipeBind2(25, 16, doc_r11.createdAt, "dd/MM/yyyy") : "date inconnue", ". Fichier de haute qualit\xE9 valid\xE9 et s\xE9curis\xE9. ");
    \u0275\u0275advance(4);
    \u0275\u0275classMap(ctx_r1.isPDFDocument(doc_r11) ? "pi pi-file-pdf" : "pi pi-image");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.isPDFDocument(doc_r11) ? "PDF" : "Image", " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("icon", ctx_r1.isPDFDocument(doc_r11) ? "pi pi-file-pdf" : "pi pi-eye")("pTooltip", ctx_r1.isPDFDocument(doc_r11) ? "Voir le PDF" : "Voir le document");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.state().loading);
  }
}
function ImportSelectionComponent_div_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "div", 92)(2, "div", 93);
    \u0275\u0275text(3, " Liste des Documents pour la s\xE9lection ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 94);
    \u0275\u0275template(5, ImportSelectionComponent_div_26_div_5_Template, 33, 19, "div", 95);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275property("ngForOf", ctx_r1.state().documents);
  }
}
function ImportSelectionComponent_div_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 128)(1, "div", 129);
    \u0275\u0275element(2, "i", 130);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3", 131);
    \u0275\u0275text(4, " Aucun document t\xE9l\xE9vers\xE9 ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 132);
    \u0275\u0275text(6, " Commencez par t\xE9l\xE9verser vos documents de s\xE9lection pour les voir appara\xEEtre ici ");
    \u0275\u0275elementEnd()();
  }
}
function ImportSelectionComponent_div_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 133)(1, "div", 134);
    \u0275\u0275element(2, "img", 135);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 136)(4, "div", 137)(5, "div", 9);
    \u0275\u0275element(6, "i", 138);
    \u0275\u0275elementStart(7, "span")(8, "strong");
    \u0275\u0275text(9, "Ajout\xE9 le:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 9);
    \u0275\u0275element(13, "i", 139);
    \u0275\u0275elementStart(14, "span")(15, "strong");
    \u0275\u0275text(16, "Statut:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(17, " Valid\xE9");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "div", 140)(19, "button", 141);
    \u0275\u0275listener("click", function ImportSelectionComponent_div_29_Template_button_click_19_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closePreviewDialog());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "button", 142);
    \u0275\u0275listener("click", function ImportSelectionComponent_div_29_Template_button_click_20_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      ctx_r1.confirmDelete(ctx_r1.state().selectedDocumentForPreview);
      return \u0275\u0275resetView(ctx_r1.closePreviewDialog());
    });
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("src", (tmp_2_0 = ctx_r1.state().selectedDocumentForPreview) == null ? null : tmp_2_0.doc, \u0275\u0275sanitizeUrl)("alt", "Document preview");
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1(" ", ((tmp_4_0 = ctx_r1.state().selectedDocumentForPreview) == null ? null : tmp_4_0.createdAt) ? \u0275\u0275pipeBind2(11, 3, (tmp_4_0 = ctx_r1.state().selectedDocumentForPreview) == null ? null : tmp_4_0.createdAt, "dd/MM/yyyy \xE0 HH:mm") : "Date inconnue", " ");
  }
}
function ImportSelectionComponent_ng_template_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 143);
    \u0275\u0275element(1, "i", 144);
    \u0275\u0275elementStart(2, "h3", 42);
    \u0275\u0275text(3, " Aucun document \xE0 pr\xE9visualiser ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 145);
    \u0275\u0275text(5, " S\xE9lectionnez un document pour l'afficher ici ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 146);
    \u0275\u0275listener("click", function ImportSelectionComponent_ng_template_30_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closePreviewDialog());
    });
    \u0275\u0275elementEnd()();
  }
}
function ImportSelectionComponent_ng_template_33_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 147)(1, "span", 148);
    \u0275\u0275text(2, "Aper\xE7u PDF");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 149);
    \u0275\u0275listener("click", function ImportSelectionComponent_ng_template_33_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closePDFPreview());
    });
    \u0275\u0275elementEnd()();
  }
}
function ImportSelectionComponent_div_34_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 150)(1, "div", 151)(2, "div", 152)(3, "div", 37);
    \u0275\u0275element(4, "i", 153);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "h3", 154);
    \u0275\u0275text(6, "Document PDF");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 155);
    \u0275\u0275text(8, " Cliquez sur l'une des options ci-dessous pour consulter le PDF : ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 156)(10, "button", 157);
    \u0275\u0275listener("click", function ImportSelectionComponent_div_34_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openPDFInNewTab());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "button", 158);
    \u0275\u0275listener("click", function ImportSelectionComponent_div_34_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.downloadPDF());
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(12, "div", 159)(13, "button", 160);
    \u0275\u0275listener("click", function ImportSelectionComponent_div_34_Template_button_click_13_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closePDFPreview());
    });
    \u0275\u0275elementEnd()()();
  }
}
var ImportSelectionComponent = class _ImportSelectionComponent {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  messageService = inject(MessageService);
  userService = inject(UserService);
  destroyRef = inject(DestroyRef);
  confirmationService = inject(ConfirmationService);
  // 2. Injection dans le constructeur
  domSanitizer = inject(DomSanitizer);
  // Remplacez complètement votre state signal par celui-ci :
  state = signal({
    loading: false,
    error: null,
    selectedFiles: [],
    previews: [],
    document: null,
    documents: null,
    demandeIndividuel: null,
    demandeIndividuelId: null,
    userId: null,
    showPreviewDialog: false,
    selectedDocumentForPreview: null,
    // Valeurs par défaut PDF
    showPDFPreview: false,
    selectedPDFFile: null,
    pdfBlobUrl: null
  });
  // 3. Nouvelles propriétés dans le state signal
  ngOnInit() {
    this.loadDemandeDocument();
  }
  loadDemandeDocument() {
    this.activatedRoute.paramMap.pipe(switchMap((params) => {
      const demandeId = params.get("demandeIndividuelId");
      console.log("Route parameter demandeIndividuelId:", demandeId);
      if (demandeId) {
        this.state.update((s) => __spreadProps(__spreadValues({}, s), {
          demandeIndividuelId: Number(demandeId),
          loading: true,
          error: null
        }));
        return this.userService.getAllDocuments$(+demandeId);
      } else {
        console.error("No demandeIndividuelId found in route parameters");
        this.state.update((state) => __spreadProps(__spreadValues({}, state), {
          loading: false,
          error: "Invalid demandeId - parameter not found in route"
        }));
        return EMPTY;
      }
    }), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        console.log("Documents loaded successfully:", response);
        this.state.update((s) => __spreadProps(__spreadValues({}, s), {
          documents: response.data.documents,
          user: response.data.user,
          demandeIndividuel: response.data.demandeIndividuel,
          loading: false
        }));
      },
      error: (error) => {
        console.error("Error loading documents:", error);
        this.state.update((s) => __spreadProps(__spreadValues({}, s), {
          loading: false,
          error
        }));
      }
    });
  }
  /**
   * Version améliorée de deleteDocument avec feedback visuel
   */
  deleteDocument(document2) {
    if (!document2 || !document2.selectionId || !this.state().demandeIndividuelId) {
      this.messageService.add({
        severity: "error",
        summary: "Erreur",
        detail: "Impossible de supprimer le document : Informations manquantes"
      });
      return;
    }
    this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: true }));
    this.userService.deleteDocument$(document2.selectionId, this.state().demandeIndividuelId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.state.update((s) => __spreadProps(__spreadValues({}, s), {
          loading: false,
          // Supprimer le document de la liste
          documents: s.documents?.filter((doc) => doc.selectionId !== document2.selectionId) || null
        }));
        this.messageService.add({
          severity: "success",
          summary: "Succ\xE8s",
          detail: "Document supprim\xE9 avec succ\xE8s"
        });
      },
      error: (err) => {
        this.state.update((s) => __spreadProps(__spreadValues({}, s), {
          loading: false,
          error: err.message || "\xC9chec de la suppression du document"
        }));
        this.messageService.add({
          severity: "error",
          summary: "Erreur de suppression",
          detail: err.message || "Erreur lors de la suppression du document"
        });
      }
    });
  }
  approvedDemande(demandeIndividuel) {
    if (!demandeIndividuel.demandeIndividuelId || !demandeIndividuel?.codUsuarios) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "La demande ne peut pas \xEAtre approuv\xE9e: Identifiants manquants"
      });
      return;
    }
    this.confirmationService.confirm({
      message: "\xCAtes-vous s\xFBr de vouloir approuver cette demande?",
      header: "Confirmation d'approbation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: true }));
        this.userService.updateDemandeIndividuel$("APPROVED", demandeIndividuel?.codUsuarios, demandeIndividuel.demandeIndividuelId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: (response) => {
            this.state.update((s) => __spreadProps(__spreadValues({}, s), {
              loading: false
            }));
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Demande approuv\xE9e avec succ\xE8s"
            });
            setTimeout(() => {
              this.router.navigate(["/dashboards/home"]);
            }, 3e3);
          },
          error: (error) => {
            this.state.update((s) => __spreadProps(__spreadValues({}, s), { loading: false, error: error.message || String(error) }));
            this.messageService.add({
              severity: "error",
              summary: "Failed",
              detail: error.message || "Erreur lors de l'approbation"
            });
          }
        });
      },
      reject: () => {
        this.messageService.add({
          severity: "info",
          summary: "Annul\xE9",
          detail: "Vous avez annul\xE9 l'approbation"
        });
      }
    });
  }
  /**
   * Méthode améliorée pour la sélection de fichiers avec validation
   */
  onFileSelect(event) {
    const files = event.files;
    if (!files || files.length === 0)
      return;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const maxFileSize = 10 * 1024 * 1024;
    const maxFiles = 10;
    const currentFiles = this.state().selectedFiles.length;
    const newFiles = [];
    const newPreviews = [];
    const errors = [];
    for (const file of files) {
      if (currentFiles + newFiles.length >= maxFiles) {
        errors.push(`Limite de ${maxFiles} fichiers atteinte`);
        break;
      }
      if (file.size > maxFileSize) {
        errors.push(`${file.name}: Fichier trop volumineux (max 10MB)`);
        continue;
      }
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Format non support\xE9`);
        continue;
      }
      const isDuplicate = this.state().selectedFiles.some((existingFile) => existingFile.name === file.name && existingFile.size === file.size);
      if (isDuplicate) {
        errors.push(`${file.name}: Fichier d\xE9j\xE0 s\xE9lectionn\xE9`);
        continue;
      }
      const previewObj = {
        file,
        url: URL.createObjectURL(file)
      };
      newPreviews.push(previewObj);
      newFiles.push(file);
      if (file.type.startsWith("image/")) {
        const img = new Image();
        img.onload = () => {
          this.state.update((s) => {
            const updatedPreviews = s.previews.map((p) => {
              if (p.file === file) {
                return __spreadProps(__spreadValues({}, p), { width: img.width, height: img.height });
              }
              return p;
            });
            return __spreadProps(__spreadValues({}, s), { previews: updatedPreviews });
          });
        };
        img.src = previewObj.url;
      }
    }
    if (errors.length > 0) {
      this.messageService.add({
        severity: "warn",
        summary: "Attention",
        detail: errors.join("\n"),
        life: 5e3
      });
    }
    if (newFiles.length > 0) {
      this.state.update((s) => __spreadProps(__spreadValues({}, s), {
        selectedFiles: [...s.selectedFiles, ...newFiles],
        previews: [...s.previews, ...newPreviews],
        error: null
      }));
      this.messageService.add({
        severity: "success",
        summary: "Fichiers ajout\xE9s",
        detail: `${newFiles.length} fichier(s) s\xE9lectionn\xE9(s)`,
        life: 3e3
      });
    }
  }
  /**
   * Méthode d'upload corrigée et simplifiée
   */
  uploadDocuments() {
    const { selectedFiles, demandeIndividuelId } = this.state();
    if (selectedFiles.length === 0 || !demandeIndividuelId) {
      this.messageService.add({
        severity: "error",
        summary: "Erreur",
        detail: "Veuillez s\xE9lectionner des fichiers et v\xE9rifier les param\xE8tres"
      });
      return;
    }
    this.state.update((s) => __spreadProps(__spreadValues({}, s), {
      loading: true,
      error: null
    }));
    const uploadPromises = selectedFiles.map((file) => {
      const formData = new FormData();
      formData.append("image", file);
      return this.userService.addDocuments$(demandeIndividuelId, formData).pipe(takeUntilDestroyed(this.destroyRef), catchError((error) => {
        this.messageService.add({
          severity: "error",
          summary: "\xC9chec du t\xE9l\xE9versement",
          detail: `Erreur pour ${file.name}: ${error.message || "Erreur inconnue"}`,
          life: 5e3
        });
        return of(null);
      }));
    });
    forkJoin(uploadPromises).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (responses) => {
        const successCount = responses.filter((r) => r !== null).length;
        const failureCount = responses.length - successCount;
        this.state().previews.forEach((preview) => {
          URL.revokeObjectURL(preview.url);
        });
        this.state.update((s) => __spreadProps(__spreadValues({}, s), {
          loading: false,
          selectedFiles: [],
          previews: []
        }));
        if (successCount > 0) {
          this.messageService.add({
            severity: "success",
            summary: "T\xE9l\xE9versement r\xE9ussi",
            detail: `${successCount} document(s) t\xE9l\xE9vers\xE9(s) avec succ\xE8s`,
            life: 5e3
          });
          this.loadDemandeDocument();
        }
        if (failureCount > 0) {
          this.messageService.add({
            severity: "warn",
            summary: "T\xE9l\xE9versement partiel",
            detail: `${failureCount} document(s) n'ont pas pu \xEAtre t\xE9l\xE9vers\xE9s`,
            life: 5e3
          });
        }
      },
      error: (err) => {
        this.state.update((s) => __spreadProps(__spreadValues({}, s), {
          loading: false,
          error: err.message || "Erreur lors du t\xE9l\xE9versement des documents"
        }));
        this.messageService.add({
          severity: "error",
          summary: "\xC9chec du t\xE9l\xE9versement",
          detail: err.message || "Erreur lors du t\xE9l\xE9versement des documents",
          life: 5e3
        });
      }
    });
  }
  /**
   * Enhanced viewDocument method to handle both images and PDFs
   */
  viewDocument(document2) {
    console.log("viewDocument called with:", document2);
    if (this.isPDFDocument(document2)) {
      this.previewSavedPDF(document2);
    } else if (this.isImageDocument(document2)) {
      this.state.update((s) => __spreadProps(__spreadValues({}, s), {
        selectedDocumentForPreview: document2,
        showPreviewDialog: true
      }));
    } else {
      this.messageService.add({
        severity: "info",
        summary: "Pr\xE9visualisation",
        detail: "Pr\xE9visualisation non disponible pour ce type de fichier"
      });
    }
  }
  /**
   * Ferme la dialog de prévisualisation
   */
  closePreviewDialog() {
    console.log("closePreviewDialog called");
    this.state.update((s) => __spreadProps(__spreadValues({}, s), {
      showPreviewDialog: false,
      selectedDocumentForPreview: null
    }));
  }
  /**
   * Add getter and setter for better dialog control
   */
  set showPDFPreview(value) {
    if (!value) {
      this.closePDFPreview();
    } else {
      this.state.update((s) => __spreadProps(__spreadValues({}, s), { showPDFPreview: true }));
    }
  }
  /**
   * Méthode alternative pour ouvrir la prévisualisation (simplifiée)
   */
  openPreview(doc) {
    console.log("Opening preview for document:", doc);
    this.state.update((currentState) => {
      console.log("Current state before update:", currentState.showPreviewDialog);
      return __spreadProps(__spreadValues({}, currentState), {
        selectedDocumentForPreview: doc,
        showPreviewDialog: true
      });
    });
    setTimeout(() => {
      console.log("State after update:", this.state().showPreviewDialog);
      console.log("Selected doc:", this.state().selectedDocumentForPreview);
    }, 100);
  }
  // 2. Ajoutez cette méthode pour débugger
  debugState() {
    console.log("Current state:", this.state());
    console.log("Show dialog:", this.state().showPreviewDialog);
    console.log("Selected doc:", this.state().selectedDocumentForPreview);
  }
  // 3. Méthode pour gérer les clics sur les images (sans conflit d'événements)
  onImageClick(event, doc) {
    event.stopPropagation();
    console.log("Image clicked, document:", doc);
    this.openPreview(doc);
  }
  // 4. Méthode pour gérer les clics sur les boutons de prévisualisation
  onPreviewButtonClick(event, doc) {
    event.stopPropagation();
    console.log("Preview button clicked, document:", doc);
    this.openPreview(doc);
  }
  /**
   * Getters et setters pour le dialog de prévisualisation
   */
  get showPreviewDialog() {
    return this.state().showPreviewDialog;
  }
  /**
   * Setter pour showPreviewDialog (pour le template)
   */
  set showPreviewDialog(value) {
    this.state.update((s) => __spreadProps(__spreadValues({}, s), {
      showPreviewDialog: value,
      selectedDocumentForPreview: value ? s.selectedDocumentForPreview : null
    }));
  }
  /**
   * Getter pour selectedDocumentForPreview (pour le template)
   */
  get selectedDocumentForPreview() {
    return this.state().selectedDocumentForPreview;
  }
  /**
   * Confirmation de suppression avec style amélioré
   */
  confirmDelete(document2) {
    this.confirmationService.confirm({
      message: "\xCAtes-vous certain de vouloir supprimer ce document ? Cette action est irr\xE9versible.",
      header: "Confirmer la suppression",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Oui, supprimer",
      rejectLabel: "Annuler",
      acceptButtonStyleClass: "p-button-danger",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.deleteDocument(document2);
      },
      reject: () => {
        this.messageService.add({
          severity: "info",
          summary: "Suppression annul\xE9e",
          detail: "Le document a \xE9t\xE9 conserv\xE9",
          life: 3e3
        });
      }
    });
  }
  /**
   * Estime la taille du fichier basée sur l'URL de l'image
   * (Optionnel - vous pouvez adapter selon vos besoins)
   */
  getFileSize(document2) {
    return "Image";
  }
  /**
   * Méthode pour valider le type de fichier
   */
  isValidFileType(file) {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    return allowedTypes.includes(file.type);
  }
  /**
   * Supprime un fichier de la liste des fichiers sélectionnés
   * @param index - L'index du fichier à supprimer
   */
  removeFile(index) {
    this.state.update((s) => {
      const newSelectedFiles = [...s.selectedFiles];
      const newPreviews = [...s.previews];
      if (newPreviews[index]) {
        URL.revokeObjectURL(newPreviews[index].url);
      }
      newSelectedFiles.splice(index, 1);
      newPreviews.splice(index, 1);
      return __spreadProps(__spreadValues({}, s), {
        selectedFiles: newSelectedFiles,
        previews: newPreviews
      });
    });
    this.messageService.add({
      severity: "info",
      summary: "Fichier supprim\xE9",
      detail: "Le fichier a \xE9t\xE9 retir\xE9 de la s\xE9lection",
      life: 2e3
    });
  }
  /**
   * Vérifie si l'image est de grande taille
   */
  isLargeImage(preview) {
    return preview.width && preview.width > 2e3 || preview.height && preview.height > 2e3 || false;
  }
  /**
   * Prévisualise un fichier PDF
   */
  previewPDF(preview) {
    if (preview.file.type !== "application/pdf") {
      this.messageService.add({
        severity: "error",
        summary: "Erreur",
        detail: "Ce fichier n'est pas un PDF"
      });
      return;
    }
    this.state.update((s) => __spreadProps(__spreadValues({}, s), {
      selectedPDFFile: preview.file,
      pdfBlobUrl: preview.url,
      showPDFPreview: true
    }));
  }
  /**
   * Updated pdfSafeUrl getter to handle direct URLs
   */
  get pdfSafeUrl() {
    const pdfUrl = this.state().pdfBlobUrl;
    if (!pdfUrl)
      return null;
    if (pdfUrl.startsWith("blob:")) {
      return this.domSanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
    } else {
      const urlWithParams = `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`;
      return this.domSanitizer.bypassSecurityTrustResourceUrl(urlWithParams);
    }
  }
  /**
   * Downloads the PDF
   */
  downloadPDF() {
    const pdfUrl = this.state().pdfBlobUrl;
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "document.pdf";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.messageService.add({
        severity: "success",
        summary: "T\xE9l\xE9chargement",
        detail: "Le t\xE9l\xE9chargement du PDF a commenc\xE9"
      });
    }
  }
  /**
   * Formate la taille du fichier de manière lisible
   */
  formatFileSize(bytes) {
    if (bytes === 0)
      return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }
  /**
   * Extrait l'extension du fichier
   */
  getFileExtension(filename) {
    const extension = filename.split(".").pop()?.toUpperCase();
    return extension || "FILE";
  }
  /**
   * Obtient le type de fichier pour l'affichage
   */
  getFileTypeDisplay(file) {
    const type = file.type;
    if (type.includes("image"))
      return "Image";
    if (type === "application/pdf")
      return "PDF";
    if (type.includes("word") || type.includes("document"))
      return "Word";
    if (type.includes("excel") || type.includes("spreadsheet"))
      return "Excel";
    if (type.includes("powerpoint") || type.includes("presentation"))
      return "PowerPoint";
    return "Fichier";
  }
  /**
   * Obtient la couleur du badge selon le type de fichier
   */
  getFileTypeBadgeClass(file) {
    const type = file.type;
    if (type.includes("image"))
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    if (type === "application/pdf")
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    if (type.includes("word") || type.includes("document"))
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300";
    if (type.includes("excel"))
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    if (type.includes("powerpoint"))
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
    return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  }
  /**
   * Vérifie si un fichier peut être prévisualisé
   */
  canPreviewFile(file) {
    return file.type.includes("image") || file.type === "application/pdf";
  }
  /**
   * Ouvre la prévisualisation appropriée selon le type de fichier
   */
  openFilePreview(preview) {
    if (preview.file.type === "application/pdf") {
      this.previewPDF(preview);
    } else if (preview.file.type.includes("image")) {
      console.log("Preview image:", preview);
    } else {
      this.messageService.add({
        severity: "info",
        summary: "Pr\xE9visualisation non disponible",
        detail: "Ce type de fichier ne peut pas \xEAtre pr\xE9visualis\xE9"
      });
    }
  }
  /**
   * Nettoyage des ressources PDF
   */
  ngOnDestroy() {
    this.state().previews.forEach((preview) => {
      URL.revokeObjectURL(preview.url);
    });
    const pdfUrl = this.state().pdfBlobUrl;
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
  }
  /**
   * Determines if a document URL points to a PDF file
   */
  isPDFDocument(doc) {
    if (!doc.doc)
      return false;
    return doc.doc.toLowerCase().includes(".pdf");
  }
  /**
   * Determines if a document URL points to an image file
   */
  isImageDocument(doc) {
    if (!doc.doc)
      return false;
    const url = doc.doc.toLowerCase();
    return url.includes(".png") || url.includes(".jpg") || url.includes(".jpeg") || url.includes(".gif");
  }
  /**
   * Gets file extension from document URL
   */
  getDocumentExtension(doc) {
    if (!doc.doc)
      return "";
    const url = doc.doc.toLowerCase();
    if (url.includes(".pdf"))
      return "PDF";
    if (url.includes(".png"))
      return "PNG";
    if (url.includes(".jpg") || url.includes(".jpeg"))
      return "JPG";
    if (url.includes(".gif"))
      return "GIF";
    if (url.includes(".doc"))
      return "DOC";
    if (url.includes(".docx"))
      return "DOCX";
    return "FILE";
  }
  /**
   * Enhanced PDF preview that works around X-Frame-Options
   */
  previewSavedPDF(document2) {
    if (!this.isPDFDocument(document2)) {
      this.messageService.add({
        severity: "error",
        summary: "Erreur",
        detail: "Ce document n'est pas un PDF"
      });
      return;
    }
    this.state.update((s) => __spreadProps(__spreadValues({}, s), {
      selectedPDFFile: new File([], `document.pdf`, { type: "application/pdf" }),
      pdfBlobUrl: document2.doc || null,
      showPDFPreview: true
    }));
    window.open(document2.doc, "_blank");
    this.messageService.add({
      severity: "info",
      summary: "PDF ouvert",
      detail: "Le PDF s'ouvre dans un nouvel onglet",
      life: 3e3
    });
  }
  /**
   * Handle PDF load success
   */
  onPDFLoad() {
    console.log("PDF loaded successfully");
  }
  /**
   * Handle PDF load error
   */
  onPDFError() {
    console.error("Error loading PDF");
    this.messageService.add({
      severity: "warn",
      summary: "Attention",
      detail: "Le PDF ne peut pas \xEAtre affich\xE9 dans cette fen\xEAtre. Utilisez le bouton de t\xE9l\xE9chargement."
    });
  }
  /**
   * Enhanced close method for PDF preview
   */
  closePDFPreview() {
    console.log("Closing PDF preview dialog");
    const pdfUrl = this.state().pdfBlobUrl;
    if (pdfUrl && pdfUrl.startsWith("blob:")) {
      URL.revokeObjectURL(pdfUrl);
    }
    this.state.update((s) => __spreadProps(__spreadValues({}, s), {
      showPDFPreview: false,
      selectedPDFFile: null,
      pdfBlobUrl: null
    }));
    console.log("PDF dialog state after close:", this.state().showPDFPreview);
  }
  /**
   * Opens PDF in new tab
   */
  openPDFInNewTab() {
    const pdfUrl = this.state().pdfBlobUrl;
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
      this.messageService.add({
        severity: "success",
        summary: "PDF ouvert",
        detail: "Le PDF s'ouvre dans un nouvel onglet"
      });
    }
  }
  /**
   * Copies PDF link to clipboard
   */
  copyPDFLink() {
    const pdfUrl = this.state().pdfBlobUrl;
    if (pdfUrl) {
      navigator.clipboard.writeText(pdfUrl).then(() => {
        this.messageService.add({
          severity: "success",
          summary: "Lien copi\xE9",
          detail: "Le lien du PDF a \xE9t\xE9 copi\xE9 dans le presse-papiers"
        });
      }).catch(() => {
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Impossible de copier le lien"
        });
      });
    }
  }
  goBack() {
  }
  static \u0275fac = function ImportSelectionComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ImportSelectionComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ImportSelectionComponent, selectors: [["app-import-selection"]], features: [\u0275\u0275ProvidersFeature([MessageService, ConfirmationService])], decls: 35, vars: 29, consts: [["noDocument", ""], [1, "min-h-screen", "bg-surface-50", "dark:bg-surface-950"], [1, "bg-surface-0", "dark:bg-surface-900", "shadow-sm", "border-b", "border-surface-200", "dark:border-surface-700"], [1, "container", "mx-auto", "px-6", "py-8"], [1, "flex", "flex-col", "lg:flex-row", "justify-between", "items-start", "lg:items-center", "gap-6"], [1, "flex-1"], [1, "text-surface-900", "dark:text-surface-0", "text-4xl", "font-bold", "mb-3"], [1, "text-surface-600", "dark:text-surface-400", "text-lg"], [1, "flex", "items-center", "gap-3", "mt-4"], [1, "flex", "items-center", "gap-2"], [1, "pi", "pi-upload", "text-primary", "text-sm"], [1, "text-surface-700", "dark:text-surface-300", "text-sm"], [1, "w-8", "h-px", "bg-surface-300", "dark:bg-surface-600"], [1, "pi", "pi-check-circle", "text-green-500", "text-sm"], [1, "flex", "flex-col", "items-end", "gap-3"], [1, "bg-orange-50", "dark:bg-orange-900/20", "px-4", "py-2", "rounded-full"], ["class", "mb-8", 4, "ngIf"], [4, "ngIf"], ["class", "text-center py-16", 4, "ngIf"], ["header", "Aper\xE7u du document", "styleClass", "preview-dialog", 3, "onHide", "visible", "modal", "closable", "draggable", "resizable", "maximizable", "blockScroll"], ["class", "text-center", 4, "ngIf", "ngIfElse"], ["header", "Aper\xE7u PDF", "styleClass", "pdf-preview-dialog", 3, "visibleChange", "onHide", "visible", "modal", "closable", "closeOnEscape", "maximizable", "blockScroll"], ["pTemplate", "header"], ["class", "h-full", 4, "ngIf"], [1, "bg-green-50", "dark:bg-green-900/20", "px-4", "py-2", "rounded-full"], [1, "text-green-700", "dark:text-green-300", "text-sm", "font-medium"], ["pButton", "", "type", "button", "label", "Retour", "icon", "pi pi-arrow-left", 1, "p-button-outlined", 3, "routerLink"], [1, "text-orange-700", "dark:text-orange-300", "text-sm", "font-medium"], [1, "mb-8"], [1, "bg-surface-0", "dark:bg-surface-900", "rounded-2xl", "shadow-lg", "border", "border-surface-200", "dark:border-surface-700", "overflow-hidden"], [1, "bg-gradient-to-r", "from-primary-500", "to-primary-600", "px-8", "py-6"], [1, "flex", "items-center", "gap-3"], [1, "w-12", "h-12", "bg-white/20", "rounded-xl", "flex", "items-center", "justify-center"], [1, "pi", "pi-cloud-upload", "text-white", "text-xl"], [1, "text-white", "text-2xl", "font-bold", "mb-1"], [1, "text-white/80", "text-sm"], [1, "p-8"], [1, "mb-6"], [1, "relative"], ["mode", "basic", "chooseLabel", "Choisir des fichiers", "accept", "image/*,.pdf,.doc,.docx", "styleClass", "custom-file-upload", 3, "onSelect", "showUploadButton", "showCancelButton", "multiple"], [1, "mt-4", "border-2", "border-dashed", "border-surface-300", "dark:border-surface-600", "rounded-xl", "p-8", "text-center", "hover:border-primary-400", "transition-colors", "duration-300", "cursor-pointer"], [1, "pi", "pi-cloud-upload", "text-surface-400", "dark:text-surface-500", "text-4xl", "mb-4"], [1, "text-surface-900", "dark:text-surface-0", "text-lg", "font-medium", "mb-2"], [1, "text-surface-600", "dark:text-surface-400", "text-sm"], ["class", "space-y-6", 4, "ngIf"], ["class", "mt-6", 4, "ngIf"], [1, "space-y-6"], [1, "flex", "items-center", "justify-between"], [1, "text-surface-900", "dark:text-surface-0", "text-xl", "font-semibold"], [1, "text-surface-500", "dark:text-surface-400", "text-sm"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-6"], ["class", "bg-surface-50 dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden hover:shadow-lg transition-all duration-300", 4, "ngFor", "ngForOf"], [1, "flex", "justify-center", "pt-6", "border-t", "border-surface-200", "dark:border-surface-700"], ["pButton", "", "type", "button", 1, "bg-gradient-to-r", "from-primary-500", "to-primary-600", "hover:from-primary-600", "hover:to-primary-700", "border-0", "px-8", "py-3", "text-white", "font-semibold", "shadow-lg", "hover:shadow-xl", "transition-all", "duration-300", 3, "click", "disabled"], ["class", "pi pi-upload mr-3", 4, "ngIf"], ["class", "pi pi-spinner pi-spin mr-3", 4, "ngIf"], [1, "bg-surface-50", "dark:bg-surface-800", "rounded-xl", "border", "border-surface-200", "dark:border-surface-700", "overflow-hidden", "hover:shadow-lg", "transition-all", "duration-300"], [1, "relative", "h-40", "bg-surface-100", "dark:bg-surface-700", "flex", "items-center", "justify-center"], ["class", "w-full h-full relative", 4, "ngIf"], ["class", "w-full h-full flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400", 4, "ngIf"], ["class", "w-full h-full flex flex-col items-center justify-center text-surface-400", 4, "ngIf"], ["pButton", "", "type", "button", "icon", "pi pi-times", "pTooltip", "Supprimer", 1, "p-button-danger", "p-button-sm", "p-button-rounded", "absolute", "top-2", "right-2", "!w-8", "!h-8", "opacity-80", "hover:opacity-100", 3, "click"], [1, "p-4"], [1, "text-surface-900", "dark:text-surface-0", "font-medium", "text-sm", "mb-2", "truncate", 3, "title"], [1, "mb-2"], [1, "px-2", "py-1", "rounded-full", "text-xs", "font-medium"], [1, "grid", "grid-cols-2", "gap-2", "text-xs", "text-surface-600", "dark:text-surface-400"], [1, "flex", "items-center", "gap-1"], [1, "pi", "pi-database", "text-xs"], ["class", "flex items-center gap-1", 4, "ngIf"], ["class", "col-span-2 mt-2", 4, "ngIf"], [1, "w-full", "h-full", "relative"], ["alt", "Preview", 1, "w-full", "h-full", "object-contain", "bg-surface-50", "dark:bg-surface-800", 3, "src"], [1, "w-full", "h-full", "flex", "flex-col", "items-center", "justify-center", "bg-red-50", "dark:bg-red-900/20", "text-red-600", "dark:text-red-400", "cursor-pointer", 3, "click"], [1, "pi", "pi-file-pdf", "text-4xl", "mb-2"], [1, "text-xs", "font-medium"], [1, "text-xs", "opacity-75"], [1, "absolute", "top-2", "left-2", "bg-red-500", "text-white", "px-2", "py-1", "rounded", "text-xs", "font-medium"], [1, "pi", "pi-file-pdf", "mr-1"], [1, "w-full", "h-full", "flex", "flex-col", "items-center", "justify-center", "bg-blue-50", "dark:bg-blue-900/20", "text-blue-600", "dark:text-blue-400"], [1, "pi", "pi-file-word", "text-4xl", "mb-2"], [1, "w-full", "h-full", "flex", "flex-col", "items-center", "justify-center", "text-surface-400"], [1, "pi", "pi-file", "text-4xl", "mb-2"], [1, "pi", "pi-expand", "text-xs"], [1, "col-span-2", "mt-2"], ["pButton", "", "type", "button", "label", "Pr\xE9visualiser PDF", "icon", "pi pi-eye", 1, "p-button-outlined", "p-button-sm", "w-full", 3, "click"], [1, "pi", "pi-upload", "mr-3"], [1, "pi", "pi-spinner", "pi-spin", "mr-3"], [1, "mt-6"], [1, "bg-red-50", "dark:bg-red-900/20", "border", "border-red-200", "dark:border-red-800", "rounded-lg", "p-4"], [1, "pi", "pi-exclamation-triangle", "text-red-500"], [1, "text-red-700", "dark:text-red-300"], [1, "card"], [1, "text-surface-900", "dark:text-surface-0", "font-medium", "text-2xl", "mb-6"], [1, "grid", "grid-cols-12", "gap-4", "-mt-4", "-ml-4", "-mr-4"], ["class", "col-span-12 md:col-span-6 lg:col-span-4", 4, "ngFor", "ngForOf"], [1, "col-span-12", "md:col-span-6", "lg:col-span-4"], [1, "p-2"], [1, "shadow", "p-6", "bg-surface-0", "dark:bg-surface-900", "rounded", "hover:shadow-lg", "transition-shadow", "duration-300"], [1, "relative", "mb-4", "cursor-pointer", "group", 3, "click"], [1, "bg-green-500", "text-white", "shadow", "px-4", "py-2", "absolute", "rounded-3xl", "z-10", 2, "left", "1rem", "top", "1rem", "font-size", "12px", "font-weight", "600"], [1, "pi", "pi-check", "mr-1"], [1, "absolute", "top-2", "right-2", "z-10", "px-2", "py-1", "rounded", "text-xs", "font-medium"], ["class", "w-full h-48 relative", 4, "ngIf"], ["class", "w-full h-48 bg-red-50 dark:bg-red-900/20 rounded-lg flex flex-col items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-105 transition-transform duration-300", 4, "ngIf"], ["class", "w-full h-48 bg-surface-100 dark:bg-surface-700 rounded-lg flex flex-col items-center justify-center text-surface-400", 4, "ngIf"], [1, "absolute", "inset-0", "bg-black", "bg-opacity-0", "group-hover:bg-opacity-30", "transition-all", "duration-300", "flex", "items-center", "justify-center", "rounded-lg"], [1, "opacity-0", "group-hover:opacity-100", "bg-white", "bg-opacity-20", "text-white", "px-4", "py-2", "rounded-lg", "font-medium", "transition-all", "duration-300", "backdrop-blur-sm"], [1, "pi", "pi-eye", "mr-2"], [1, "flex", "justify-between", "items-center", "mb-4"], [1, "text-surface-900", "dark:text-surface-0", "font-medium", "text-xl"], [1, "flex", "items-center"], [1, "pi", "pi-star-fill", "text-yellow-500", "mr-1"], [1, "font-medium"], [1, "mt-0", "mb-4", "text-surface-700", "dark:text-surface-100", "leading-normal"], [1, "flex", "justify-between", "items-center"], [1, "text-primary", "text-xl", "font-medium"], [1, "mr-2"], [1, "flex", "gap-2"], ["pButton", "", "type", "button", 1, "p-button-outlined", "p-button-sm", 3, "click", "icon", "pTooltip"], ["pButton", "", "type", "button", "icon", "pi pi-trash", "pTooltip", "Supprimer", 1, "p-button-danger", "p-button-outlined", "p-button-sm", 3, "click", "disabled"], [1, "w-full", "h-48", "relative"], [1, "w-full", "h-full", "object-cover", "rounded-lg", "group-hover:scale-105", "transition-transform", "duration-300", 3, "src", "alt"], [1, "w-full", "h-48", "bg-red-50", "dark:bg-red-900/20", "rounded-lg", "flex", "flex-col", "items-center", "justify-center", "text-red-600", "dark:text-red-400", "group-hover:scale-105", "transition-transform", "duration-300"], [1, "pi", "pi-file-pdf", "text-6xl", "mb-3"], [1, "text-sm", "font-medium"], [1, "w-full", "h-48", "bg-surface-100", "dark:bg-surface-700", "rounded-lg", "flex", "flex-col", "items-center", "justify-center", "text-surface-400"], [1, "pi", "pi-file", "text-6xl", "mb-3"], [1, "text-center", "py-16"], [1, "w-24", "h-24", "bg-surface-100", "dark:bg-surface-800", "rounded-full", "flex", "items-center", "justify-center", "mx-auto", "mb-6"], [1, "pi", "pi-file", "text-surface-400", "dark:text-surface-500", "text-3xl"], [1, "text-surface-900", "dark:text-surface-0", "text-xl", "font-semibold", "mb-3"], [1, "text-surface-600", "dark:text-surface-400", "text-lg", "max-w-md", "mx-auto"], [1, "text-center"], [1, "relative", "inline-block", "mb-4"], [1, "max-w-full", "max-h-[70vh]", "object-contain", "rounded-lg", "shadow-lg", 2, "max-width", "100%", "height", "auto", 3, "src", "alt"], [1, "mt-6", "p-4", "bg-surface-50", "dark:bg-surface-800", "rounded-lg"], [1, "flex", "items-center", "justify-center", "gap-6", "text-surface-700", "dark:text-surface-300", "flex-wrap"], [1, "pi", "pi-calendar", "text-primary"], [1, "pi", "pi-check-circle", "text-green-500"], [1, "flex", "justify-center", "gap-3", "mt-4"], ["pButton", "", "type", "button", "label", "Fermer", "icon", "pi pi-times", 1, "p-button-outlined", "p-button-sm", 3, "click"], ["pButton", "", "type", "button", "label", "Supprimer", "icon", "pi pi-trash", 1, "p-button-danger", "p-button-outlined", "p-button-sm", 3, "click"], [1, "text-center", "py-8"], [1, "pi", "pi-image", "text-surface-400", "text-4xl", "mb-4"], [1, "text-surface-600", "dark:text-surface-400"], ["pButton", "", "type", "button", "label", "Fermer", 1, "p-button-text", "mt-4", 3, "click"], [1, "flex", "justify-between", "items-center", "w-full"], [1, "text-lg", "font-semibold"], ["pButton", "", "type", "button", "icon", "pi pi-times", "pTooltip", "Fermer", 1, "p-button-rounded", "p-button-text", "p-button-sm", 3, "click"], [1, "h-full"], [1, "pdf-container", 2, "height", "calc(80vh - 120px)"], [1, "text-center", "p-8"], [1, "pi", "pi-file-pdf", "text-red-500", "text-6xl"], [1, "text-xl", "font-semibold", "mb-4"], [1, "text-surface-600", "dark:text-surface-400", "mb-6"], [1, "flex", "flex-col", "gap-3", "max-w-sm", "mx-auto"], ["pButton", "", "type", "button", "label", "Ouvrir dans un nouvel onglet", "icon", "pi pi-external-link", 1, "p-button-primary", "w-full", 3, "click"], ["pButton", "", "type", "button", "label", "T\xE9l\xE9charger le PDF", "icon", "pi pi-download", 1, "p-button-outlined", "w-full", 3, "click"], [1, "flex", "justify-end", "gap-2", "mt-4", "pt-4", "border-t", "border-surface-200", "dark:border-surface-700"], ["pButton", "", "type", "button", "label", "Fermer", "icon", "pi pi-times", 1, "p-button-text", 3, "click"]], template: function ImportSelectionComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 1);
      \u0275\u0275element(1, "p-toast")(2, "p-confirmDialog");
      \u0275\u0275elementStart(3, "div", 2)(4, "div", 3)(5, "div", 4)(6, "div", 5)(7, "h1", 6);
      \u0275\u0275text(8, " Gestion des Documents ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "p", 7);
      \u0275\u0275text(10, " T\xE9l\xE9versez et g\xE9rez vos fiches de s\xE9lection ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "div", 8)(12, "div", 9);
      \u0275\u0275element(13, "i", 10);
      \u0275\u0275elementStart(14, "span", 11);
      \u0275\u0275text(15, "\xC9tape 1: T\xE9l\xE9versement");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(16, "div", 12);
      \u0275\u0275elementStart(17, "div", 9);
      \u0275\u0275element(18, "i", 13);
      \u0275\u0275elementStart(19, "span", 11);
      \u0275\u0275text(20, "\xC9tape 2: Validation");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(21, "div", 14);
      \u0275\u0275template(22, ImportSelectionComponent_Conditional_22_Template, 4, 4)(23, ImportSelectionComponent_Conditional_23_Template, 3, 0, "div", 15);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(24, "div", 3);
      \u0275\u0275template(25, ImportSelectionComponent_div_25_Template, 23, 5, "div", 16)(26, ImportSelectionComponent_div_26_Template, 6, 1, "div", 17)(27, ImportSelectionComponent_div_27_Template, 7, 0, "div", 18);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "p-dialog", 19);
      \u0275\u0275listener("onHide", function ImportSelectionComponent_Template_p_dialog_onHide_28_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.closePreviewDialog());
      });
      \u0275\u0275template(29, ImportSelectionComponent_div_29_Template, 21, 6, "div", 20)(30, ImportSelectionComponent_ng_template_30_Template, 7, 0, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "p-dialog", 21);
      \u0275\u0275twoWayListener("visibleChange", function ImportSelectionComponent_Template_p_dialog_visibleChange_32_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.showPDFPreview, $event) || (ctx.showPDFPreview = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275listener("onHide", function ImportSelectionComponent_Template_p_dialog_onHide_32_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.closePDFPreview());
      });
      \u0275\u0275template(33, ImportSelectionComponent_ng_template_33_Template, 4, 0, "ng-template", 22)(34, ImportSelectionComponent_div_34_Template, 14, 0, "div", 23);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      let tmp_3_0;
      const noDocument_r18 = \u0275\u0275reference(31);
      \u0275\u0275advance(2);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(26, _c0));
      \u0275\u0275advance(20);
      \u0275\u0275conditional(ctx.state().documents && ctx.state().documents.length > 0 ? 22 : 23);
      \u0275\u0275advance(3);
      \u0275\u0275property("ngIf", ((tmp_3_0 = ctx.state()) == null ? null : tmp_3_0.user == null ? null : tmp_3_0.user.role) === "AGENT_CREDIT");
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.state().documents && ctx.state().documents.length > 0);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.state().documents || ctx.state().documents.length === 0);
      \u0275\u0275advance();
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(27, _c1));
      \u0275\u0275property("visible", ctx.state().showPreviewDialog)("modal", true)("closable", true)("draggable", false)("resizable", true)("maximizable", true)("blockScroll", true);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.state().selectedDocumentForPreview)("ngIfElse", noDocument_r18);
      \u0275\u0275advance(3);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(28, _c2));
      \u0275\u0275twoWayProperty("visible", ctx.showPDFPreview);
      \u0275\u0275property("modal", true)("closable", true)("closeOnEscape", true)("maximizable", true)("blockScroll", true);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngIf", ctx.state().selectedPDFFile);
    }
  }, dependencies: [CommonModule, NgForOf, NgIf, DatePipe, ToastModule, Toast, PrimeTemplate, CardModule, ProgressSpinnerModule, MessageModule, FileUploadModule, FileUpload, ButtonModule, ButtonDirective, ImageModule, TableModule, ConfirmDialogModule, ConfirmDialog, DialogModule, Dialog, TooltipModule, Tooltip, RouterLink], styles: ['@charset "UTF-8";\n\n\n\n.container[_ngcontent-%COMP%] {\n  max-width: 1200px;\n  margin: 0 auto;\n}\n.card[_ngcontent-%COMP%] {\n  background: var(--surface-card);\n  padding: 2rem;\n  border-radius: 10px;\n  margin-bottom: 1rem;\n  box-shadow:\n    0 2px 1px -1px rgba(0, 0, 0, 0.2),\n    0 1px 1px 0 rgba(0, 0, 0, 0.14),\n    0 1px 3px 0 rgba(0, 0, 0, 0.12);\n}\n.custom-file-upload[_ngcontent-%COMP%]   .p-button[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      to right,\n      var(--primary-500),\n      var(--primary-600));\n  border: none;\n  padding: 0.75rem 1.5rem;\n  font-weight: 600;\n  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);\n  transition: all 0.3s ease;\n}\n.custom-file-upload[_ngcontent-%COMP%]   .p-button[_ngcontent-%COMP%]:hover {\n  background:\n    linear-gradient(\n      to right,\n      var(--primary-600),\n      var(--primary-700));\n  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);\n}\n.preview-dialog[_ngcontent-%COMP%]   .p-dialog-content[_ngcontent-%COMP%] {\n  padding: 1.5rem;\n}\n.preview-dialog[_ngcontent-%COMP%]   .p-dialog-header[_ngcontent-%COMP%] {\n  padding: 1.5rem 1.5rem 1rem 1.5rem;\n}\n@keyframes _ngcontent-%COMP%_shimmer {\n  0% {\n    background-position: -200px 0;\n  }\n  100% {\n    background-position: calc(200px + 100%) 0;\n  }\n}\n.loading-shimmer[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      90deg,\n      transparent,\n      rgba(255, 255, 255, 0.4),\n      transparent);\n  background-size: 200px 100%;\n  animation: _ngcontent-%COMP%_shimmer 1.5s infinite;\n}\n.fade-in[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_fadeIn 0.3s ease-out;\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.shadow[_ngcontent-%COMP%]:hover {\n  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);\n}\n@media (max-width: 640px) {\n  .container[_ngcontent-%COMP%] {\n    padding-left: 1rem;\n    padding-right: 1rem;\n  }\n  .grid.grid-cols-12[_ngcontent-%COMP%]   .col-span-12[_ngcontent-%COMP%] {\n    grid-column: span 12/span 12;\n  }\n  .grid.grid-cols-12[_ngcontent-%COMP%]   .md\\\\[_ngcontent-%COMP%]:col-span-6 {\n    grid-column: span 12/span 12;\n  }\n  .grid.grid-cols-12[_ngcontent-%COMP%]   .lg\\\\[_ngcontent-%COMP%]:col-span-4 {\n    grid-column: span 12/span 12;\n  }\n}\n@media (min-width: 641px) and (max-width: 1024px) {\n  .grid.grid-cols-12[_ngcontent-%COMP%]   .md\\\\[_ngcontent-%COMP%]:col-span-6 {\n    grid-column: span 6/span 6;\n  }\n  .grid.grid-cols-12[_ngcontent-%COMP%]   .lg\\\\[_ngcontent-%COMP%]:col-span-4 {\n    grid-column: span 6/span 6;\n  }\n}\n@media (min-width: 1025px) {\n  .grid.grid-cols-12[_ngcontent-%COMP%]   .lg\\\\[_ngcontent-%COMP%]:col-span-4 {\n    grid-column: span 4/span 4;\n  }\n}\n@media (prefers-color-scheme: dark) {\n  .card[_ngcontent-%COMP%] {\n    background: var(--surface-900);\n    color: var(--text-color);\n  }\n}\n.pdf-preview-dialog[_ngcontent-%COMP%]   .p-dialog-content[_ngcontent-%COMP%] {\n  padding: 1rem;\n  height: calc(80vh - 120px);\n  overflow: hidden;\n}\n.pdf-preview-dialog[_ngcontent-%COMP%]   .p-dialog-header[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      to right,\n      #dc2626,\n      #ef4444);\n  color: white;\n}\n.pdf-preview-dialog[_ngcontent-%COMP%]   .p-dialog-header[_ngcontent-%COMP%]   .p-dialog-title[_ngcontent-%COMP%] {\n  color: white;\n  font-weight: 600;\n}\n.pdf-preview-dialog[_ngcontent-%COMP%]   .p-dialog-header[_ngcontent-%COMP%]   .p-dialog-header-icons[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  color: white;\n}\n.pdf-preview-dialog[_ngcontent-%COMP%]   .p-dialog-header[_ngcontent-%COMP%]   .p-dialog-header-icons[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 255, 255, 0.2);\n}\n.file-type-pdf[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #fee2e2,\n      #fecaca);\n  border: 1px solid #fca5a5;\n}\n.file-type-word[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #dbeafe,\n      #bfdbfe);\n  border: 1px solid #93c5fd;\n}\n.file-type-excel[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #dcfce7,\n      #bbf7d0);\n  border: 1px solid #86efac;\n}\n.file-type-image[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #f3e8ff,\n      #e9d5ff);\n  border: 1px solid #c4b5fd;\n}\n.pdf-loading[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 200px;\n  background: #f8fafc;\n  border-radius: 8px;\n}\n.pdf-loading[_ngcontent-%COMP%]::after {\n  content: "";\n  width: 40px;\n  height: 40px;\n  border: 4px solid #e2e8f0;\n  border-top: 4px solid #dc2626;\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_spin 1s linear infinite;\n}\n@keyframes _ngcontent-%COMP%_spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n@media (max-width: 768px) {\n  .pdf-preview-dialog[_ngcontent-%COMP%] {\n    width: 95vw !important;\n    height: 90vh !important;\n  }\n  .pdf-preview-dialog[_ngcontent-%COMP%]   .p-dialog-content[_ngcontent-%COMP%] {\n    height: calc(90vh - 120px);\n  }\n}\n.file-badge[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\n.file-badge[_ngcontent-%COMP%]:hover {\n  transform: scale(1.05);\n}\n@media (prefers-color-scheme: dark) {\n  .file-type-pdf[_ngcontent-%COMP%] {\n    background:\n      linear-gradient(\n        135deg,\n        #7f1d1d,\n        #991b1b);\n    border-color: #dc2626;\n  }\n  .file-type-word[_ngcontent-%COMP%] {\n    background:\n      linear-gradient(\n        135deg,\n        #1e3a8a,\n        #1d4ed8);\n    border-color: #3b82f6;\n  }\n  .file-type-excel[_ngcontent-%COMP%] {\n    background:\n      linear-gradient(\n        135deg,\n        #14532d,\n        #166534);\n    border-color: #22c55e;\n  }\n  .file-type-image[_ngcontent-%COMP%] {\n    background:\n      linear-gradient(\n        135deg,\n        #581c87,\n        #6b21a8);\n    border-color: #a855f7;\n  }\n}\n/*# sourceMappingURL=import-selection.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ImportSelectionComponent, { className: "ImportSelectionComponent", filePath: "src/app/pages/dashboard/agent-credit/credit-selection/import-selection/import-selection.component.ts", lineNumber: 31 });
})();
export {
  ImportSelectionComponent
};
//# sourceMappingURL=chunk-JKFJJPWV.js.map
