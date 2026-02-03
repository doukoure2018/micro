import {
  Message,
  MessageModule
} from "./chunk-CSEZIGTY.js";
import {
  Toast,
  ToastModule
} from "./chunk-6SRYYUT2.js";
import "./chunk-KHEKFKWA.js";
import {
  InputText,
  InputTextModule
} from "./chunk-FZELBHWZ.js";
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
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-3HTR5OU7.js";
import "./chunk-W3K3GK4Z.js";
import {
  CommonModule
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
  ɵɵlistener,
  ɵɵtext,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// src/app/pages/uikit/messagesdemo.ts
var MessagesDemo = class _MessagesDemo {
  service;
  msgs = [];
  username;
  email;
  constructor(service) {
    this.service = service;
  }
  showInfoViaToast() {
    this.service.add({
      severity: "info",
      summary: "Info Message",
      detail: "PrimeNG rocks"
    });
  }
  showWarnViaToast() {
    this.service.add({
      severity: "warn",
      summary: "Warn Message",
      detail: "There are unsaved changes"
    });
  }
  showErrorViaToast() {
    this.service.add({
      severity: "error",
      summary: "Error Message",
      detail: "Validation failed"
    });
  }
  showSuccessViaToast() {
    this.service.add({
      severity: "success",
      summary: "Success Message",
      detail: "Message sent"
    });
  }
  static \u0275fac = function MessagesDemo_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MessagesDemo)(\u0275\u0275directiveInject(MessageService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MessagesDemo, selectors: [["app-messages-demo"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 38, vars: 2, consts: [[1, "flex", "flex-col", "md:flex-row", "gap-8"], [1, "md:w-1/2"], [1, "card"], [1, "font-semibold", "text-xl", "mb-4"], [1, "flex", "flex-wrap", "gap-2"], ["label", "Success", "severity", "success", 3, "click"], ["label", "Info", "severity", "info", 3, "click"], ["label", "Warn", "severity", "warn", 3, "click"], ["label", "Error", "severity", "danger", 3, "click"], [1, "font-semibold", "text-xl", "mt-4", "mb-4"], [1, "flex", "mb-4", "gap-1"], ["pInputText", "", "placeholder", "Username", "aria-label", "username", 1, "ng-dirty", "ng-invalid", 3, "ngModelChange", "ngModel"], ["severity", "error", "size", "small", "styleClass", "h-full w-full "], [1, "flex", "flex-wrap", "gap-1"], ["pInputText", "", "placeholder", "Email", "aria-label", "email", 1, "ng-dirty", "ng-invalid", 3, "ngModelChange", "ngModel"], ["severity", "error", "size", "small", "styleClass", "flex items-center text-center justify-center h-full w-11"], [1, "pi", "pi-times-circle"], [1, "flex", "flex-col", "gap-4", "mb-4"], ["severity", "success"], ["severity", "info"], ["severity", "warn"], ["severity", "error"], ["severity", "secondary"], ["severity", "contrast"]], template: function MessagesDemo_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
      \u0275\u0275text(4, "Toast");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div", 4)(6, "p-button", 5);
      \u0275\u0275listener("click", function MessagesDemo_Template_p_button_click_6_listener() {
        return ctx.showSuccessViaToast();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "p-button", 6);
      \u0275\u0275listener("click", function MessagesDemo_Template_p_button_click_7_listener() {
        return ctx.showInfoViaToast();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "p-button", 7);
      \u0275\u0275listener("click", function MessagesDemo_Template_p_button_click_8_listener() {
        return ctx.showWarnViaToast();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "p-button", 8);
      \u0275\u0275listener("click", function MessagesDemo_Template_p_button_click_9_listener() {
        return ctx.showErrorViaToast();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275element(10, "p-toast");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "div", 9);
      \u0275\u0275text(12, "Inline");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 10)(14, "input", 11);
      \u0275\u0275twoWayListener("ngModelChange", function MessagesDemo_Template_input_ngModelChange_14_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.username, $event) || (ctx.username = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "p-message", 12);
      \u0275\u0275text(16, "Username is required");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(17, "div", 13)(18, "input", 14);
      \u0275\u0275twoWayListener("ngModelChange", function MessagesDemo_Template_input_ngModelChange_18_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.email, $event) || (ctx.email = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "p-message", 15);
      \u0275\u0275element(20, "i", 16);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(21, "div", 1)(22, "div", 2)(23, "div", 3);
      \u0275\u0275text(24, "Message");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "div", 17)(26, "p-message", 18);
      \u0275\u0275text(27, "Success Message");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "p-message", 19);
      \u0275\u0275text(29, "Info Message");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "p-message", 20);
      \u0275\u0275text(31, "Warn Message");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "p-message", 21);
      \u0275\u0275text(33, "Error Message");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "p-message", 22);
      \u0275\u0275text(35, "Secondary Message");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "p-message", 23);
      \u0275\u0275text(37, "Contrast Message");
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(14);
      \u0275\u0275twoWayProperty("ngModel", ctx.username);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.email);
    }
  }, dependencies: [CommonModule, ToastModule, Toast, ButtonModule, Button, InputTextModule, InputText, MessageModule, Message, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MessagesDemo, { className: "MessagesDemo", filePath: "src/app/pages/uikit/messagesdemo.ts", lineNumber: 57 });
})();
export {
  MessagesDemo
};
//# sourceMappingURL=chunk-MSAVBUYK.js.map
