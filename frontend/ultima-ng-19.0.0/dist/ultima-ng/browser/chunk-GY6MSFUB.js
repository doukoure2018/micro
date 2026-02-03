import {
  FileUpload,
  FileUploadModule
} from "./chunk-ZNXRKGHP.js";
import "./chunk-CSEZIGTY.js";
import {
  Toast,
  ToastModule
} from "./chunk-6SRYYUT2.js";
import "./chunk-WQ2EPPBK.js";
import "./chunk-OCW7T434.js";
import "./chunk-36C7KO53.js";
import "./chunk-KHEKFKWA.js";
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
import "./chunk-BMYIFZHZ.js";
import "./chunk-W3K3GK4Z.js";
import {
  CommonModule,
  NgForOf,
  NgIf
} from "./chunk-SQQPVFHK.js";
import {
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
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
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate2
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// src/app/pages/uikit/filedemo.ts
function FileDemo_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275text(1, "Drag and drop files to here to upload.");
    \u0275\u0275elementEnd();
  }
}
function FileDemo_ng_template_8_ul_0_li_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const file_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", file_r2.name, " - ", file_r2.size, " bytes");
  }
}
function FileDemo_ng_template_8_ul_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul");
    \u0275\u0275template(1, FileDemo_ng_template_8_ul_0_li_1_Template, 2, 2, "li", 12);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r2.uploadedFiles);
  }
}
function FileDemo_ng_template_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, FileDemo_ng_template_8_ul_0_Template, 2, 1, "ul", 11);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("ngIf", ctx_r2.uploadedFiles.length);
  }
}
var FileDemo = class _FileDemo {
  messageService;
  uploadedFiles = [];
  constructor(messageService) {
    this.messageService = messageService;
  }
  onUpload(event) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.messageService.add({ severity: "info", summary: "Success", detail: "File Uploaded" });
  }
  onBasicUpload() {
    this.messageService.add({ severity: "info", summary: "Success", detail: "File Uploaded with Basic Mode" });
  }
  static \u0275fac = function FileDemo_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FileDemo)(\u0275\u0275directiveInject(MessageService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FileDemo, selectors: [["app-file-demo"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 19, vars: 1, consts: [["empty", ""], ["content", ""], ["fu", ""], [1, "grid", "grid-cols-12", "gap-8"], [1, "col-span-full", "lg:col-span-6"], [1, "card"], [1, "font-semibold", "text-xl", "mb-4"], ["name", "demo[]", "accept", "image/*", "maxFileSize", "1000000", "mode", "advanced", "url", "https://www.primefaces.org/cdn/api/upload.php", 3, "onUpload", "multiple"], [1, "card", "flex", "flex-col", "gap-6", "items-center", "justify-center"], ["mode", "basic", "chooseLabel", "Choose", "chooseIcon", "pi pi-upload", "name", "demo[]", "accept", "image/*", "maxFileSize", "1000000", "url", "https://www.primefaces.org/cdn/api/upload.php", 3, "onUpload"], ["label", "Upload", "severity", "secondary", 3, "onClick"], [4, "ngIf"], [4, "ngFor", "ngForOf"]], template: function FileDemo_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 3)(1, "div", 4)(2, "div", 5)(3, "div", 6);
      \u0275\u0275text(4, "Advanced");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p-fileupload", 7);
      \u0275\u0275listener("onUpload", function FileDemo_Template_p_fileupload_onUpload_5_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onUpload($event));
      });
      \u0275\u0275template(6, FileDemo_ng_template_6_Template, 2, 0, "ng-template", null, 0, \u0275\u0275templateRefExtractor)(8, FileDemo_ng_template_8_Template, 1, 1, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(10, "div", 4)(11, "div", 5)(12, "div", 6);
      \u0275\u0275text(13, "Basic");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "div", 8);
      \u0275\u0275element(15, "p-toast");
      \u0275\u0275elementStart(16, "p-fileupload", 9, 2);
      \u0275\u0275listener("onUpload", function FileDemo_Template_p_fileupload_onUpload_16_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onBasicUpload());
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "p-button", 10);
      \u0275\u0275listener("onClick", function FileDemo_Template_p_button_onClick_18_listener() {
        \u0275\u0275restoreView(_r1);
        const fu_r4 = \u0275\u0275reference(17);
        return \u0275\u0275resetView(fu_r4.upload());
      });
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(5);
      \u0275\u0275property("multiple", true);
    }
  }, dependencies: [CommonModule, NgForOf, NgIf, FileUploadModule, FileUpload, ToastModule, Toast, ButtonModule, Button], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FileDemo, { className: "FileDemo", filePath: "src/app/pages/uikit/filedemo.ts", lineNumber: 41 });
})();
export {
  FileDemo
};
//# sourceMappingURL=chunk-GY6MSFUB.js.map
