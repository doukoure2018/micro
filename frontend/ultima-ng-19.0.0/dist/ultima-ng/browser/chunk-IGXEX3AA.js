import {
  Editor,
  EditorModule
} from "./chunk-LEUN6ZA4.js";
import {
  MailService
} from "./chunk-UI4NWC5C.js";
import {
  IconField,
  IconFieldModule,
  InputIcon,
  InputIconModule
} from "./chunk-WIQZFAVH.js";
import {
  Router
} from "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
import {
  InputText,
  InputTextModule
} from "./chunk-FZELBHWZ.js";
import {
  ButtonDirective,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import {
  Ripple,
  RippleModule
} from "./chunk-AP3OAIHW.js";
import {
  MessageService
} from "./chunk-NQNBRQ7H.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-3HTR5OU7.js";
import "./chunk-BMYIFZHZ.js";
import {
  CommonModule,
  Location
} from "./chunk-SQQPVFHK.js";
import {
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵpureFunction0,
  ɵɵstyleMap,
  ɵɵtext,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// src/app/apps/mail/mail-compose.ts
var _c0 = () => ({ height: "250px" });
var MailComposeComponent = class _MailComposeComponent {
  messageService;
  location;
  router;
  mailService;
  newMail = {
    id: "",
    to: "",
    email: "",
    image: "",
    title: "",
    message: "",
    date: "",
    important: false,
    starred: false,
    trash: false,
    spam: false,
    archived: false,
    sent: true
  };
  constructor(messageService, location, router, mailService) {
    this.messageService = messageService;
    this.location = location;
    this.router = router;
    this.mailService = mailService;
  }
  sendMail() {
    if (this.newMail.message) {
      this.newMail.id = Math.floor(Math.random() * 1e3);
      this.mailService.onSend(this.newMail);
      this.messageService.add({
        severity: "success",
        summary: "Success",
        detail: "Mail sent"
      });
      this.router.navigate(["apps/mail/inbox"]);
    }
  }
  goBack() {
    this.location.back();
  }
  static \u0275fac = function MailComposeComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MailComposeComponent)(\u0275\u0275directiveInject(MessageService), \u0275\u0275directiveInject(Location), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(MailService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MailComposeComponent, selectors: [["ng-component"]], decls: 21, vars: 6, consts: [[1, "flex", "items-center", "px-6", "md:px-0", "border-t", "border-surface-200", "dark:border-surface-700", "md:border-0", "pt-6", "md:pt-0"], ["pButton", "", "pRipple", "", "type", "button", "icon", "pi pi-chevron-left", "outlined", "", "severity", "secondary", 1, "border-surface-200", "dark:border-surface-700", "text-surface-900", "dark:text-surface-0", "w-12", "h-12", "mr-4", 3, "click"], [1, "block", "text-surface-900", "dark:text-surface-0", "font-bold", "text-xl"], [1, "bg-surface-0", "dark:bg-surface-950", "grid", "gap-4", "mt-6", "grid-nogutter", "p-6", "md:border-surface-200", "dark:md:border-surface-700", "md:border", "rounded"], [1, "col-span-12"], ["for", "to", 1, "text-surface-900", "dark:text-surface-0", "font-semibold"], [1, "mt-4", 2, "height", "3.5rem"], [1, "pi", "pi-user", 2, "left", "1.5rem"], ["id", "to", "type", "text", "pInputText", "", "fluid", "", 1, "!pl-16", "text-surface-900", "dark:text-surface-0", "font-semibold", 2, "height", "3.5rem", 3, "ngModelChange", "ngModel"], ["for", "Subject", 1, "text-surface-900", "dark:text-surface-0", "font-semibold"], [1, "pi", "pi-pencil", 2, "left", "1.5rem"], ["id", "subject", "type", "text", "pInputText", "", "fluid", "", 1, "!pl-16", "text-surface-900", "dark:text-surface-0", "font-semibold", 2, "height", "3.5rem", 3, "ngModelChange", "ngModel"], [3, "ngModelChange", "ngModel"], [1, "col-span-12", "flex", "gap-x-4", "justify-end", "mt-16"], ["pButton", "", "pRipple", "", "type", "button", "icon", "pi pi-send", "label", "Send Message", 1, "h-12", "w-full", "sm:w-auto", 3, "click"]], template: function MailComposeComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "button", 1);
      \u0275\u0275listener("click", function MailComposeComponent_Template_button_click_1_listener() {
        return ctx.goBack();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(2, "span", 2);
      \u0275\u0275text(3, "Compose Message");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(4, "div", 3)(5, "div", 4)(6, "label", 5);
      \u0275\u0275text(7, "To");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "p-iconfield", 6);
      \u0275\u0275element(9, "p-inputicon", 7);
      \u0275\u0275elementStart(10, "input", 8);
      \u0275\u0275twoWayListener("ngModelChange", function MailComposeComponent_Template_input_ngModelChange_10_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.newMail.to, $event) || (ctx.newMail.to = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(11, "div", 4)(12, "label", 9);
      \u0275\u0275text(13, "Subject");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "p-iconfield", 6);
      \u0275\u0275element(15, "p-inputicon", 10);
      \u0275\u0275elementStart(16, "input", 11);
      \u0275\u0275twoWayListener("ngModelChange", function MailComposeComponent_Template_input_ngModelChange_16_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.newMail.title, $event) || (ctx.newMail.title = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(17, "div", 4)(18, "p-editor", 12);
      \u0275\u0275twoWayListener("ngModelChange", function MailComposeComponent_Template_p_editor_ngModelChange_18_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.newMail.message, $event) || (ctx.newMail.message = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(19, "div", 13)(20, "button", 14);
      \u0275\u0275listener("click", function MailComposeComponent_Template_button_click_20_listener() {
        return ctx.sendMail();
      });
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(10);
      \u0275\u0275twoWayProperty("ngModel", ctx.newMail.to);
      \u0275\u0275advance(6);
      \u0275\u0275twoWayProperty("ngModel", ctx.newMail.title);
      \u0275\u0275advance(2);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(5, _c0));
      \u0275\u0275twoWayProperty("ngModel", ctx.newMail.message);
    }
  }, dependencies: [ButtonModule, ButtonDirective, CommonModule, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, RippleModule, Ripple, InputTextModule, InputText, IconFieldModule, IconField, InputIconModule, InputIcon, EditorModule, Editor], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MailComposeComponent, { className: "MailComposeComponent", filePath: "src/app/apps/mail/mail-compose.ts", lineNumber: 45 });
})();
export {
  MailComposeComponent
};
//# sourceMappingURL=chunk-IGXEX3AA.js.map
