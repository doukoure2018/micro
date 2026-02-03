import {
  Editor,
  EditorModule
} from "./chunk-LEUN6ZA4.js";
import {
  MailService
} from "./chunk-UI4NWC5C.js";
import {
  Avatar,
  AvatarModule
} from "./chunk-MCGUCMXD.js";
import {
  ActivatedRoute,
  Router
} from "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
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
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-3HTR5OU7.js";
import "./chunk-BMYIFZHZ.js";
import {
  CommonModule,
  Location,
  NgIf
} from "./chunk-SQQPVFHK.js";
import {
  switchMap,
  ɵsetClassDebugInfo,
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
  ɵɵpureFunction0,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeHtml,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// src/app/apps/mail/mail-detail.ts
var _c0 = () => ({ height: "250px" });
function MailDetailComponent_div_0_p_avatar_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-avatar", 20);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("image", "/images/avatar/" + ctx_r1.mail.image);
  }
}
function MailDetailComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 1)(2, "div", 2)(3, "button", 3);
    \u0275\u0275listener("click", function MailDetailComponent_div_0_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.goBack());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, MailDetailComponent_div_0_p_avatar_4_Template, 1, 1, "p-avatar", 4);
    \u0275\u0275elementStart(5, "div", 5)(6, "span", 6);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 7);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 8)(11, "span", 9);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275element(13, "button", 10)(14, "button", 11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div", 12)(16, "div", 13);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275element(18, "p", 14);
    \u0275\u0275elementStart(19, "p-editor", 15);
    \u0275\u0275twoWayListener("ngModelChange", function MailDetailComponent_div_0_Template_p_editor_ngModelChange_19_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.newMail.message, $event) || (ctx_r1.newMail.message = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "div", 16);
    \u0275\u0275element(21, "button", 17)(22, "button", 18);
    \u0275\u0275elementStart(23, "button", 19);
    \u0275\u0275listener("click", function MailDetailComponent_div_0_Template_button_click_23_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.sendMail());
    });
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", ctx_r1.mail && ctx_r1.mail.image);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.mail.from);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("To: ", ctx_r1.mail.email || ctx_r1.mail.to, "");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.mail.date);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r1.mail.title, " ");
    \u0275\u0275advance();
    \u0275\u0275property("innerHTML", ctx_r1.mail.message, \u0275\u0275sanitizeHtml);
    \u0275\u0275advance();
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(9, _c0));
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newMail.message);
  }
}
var MailDetailComponent = class _MailDetailComponent {
  route;
  mailService;
  location;
  router;
  messageService;
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
  subscription;
  mail = {};
  id;
  constructor(route, mailService, location, router, messageService) {
    this.route = route;
    this.mailService = mailService;
    this.location = location;
    this.router = router;
    this.messageService = messageService;
    this.subscription = this.route.params.pipe(switchMap((params) => {
      this.id = params["id"];
      return this.mailService.mails$;
    })).subscribe((data) => {
      this.mail = data.filter((d) => d.id == this.id)[0];
    });
  }
  goBack() {
    this.location.back();
  }
  sendMail() {
    if (this.newMail.message) {
      this.newMail.to = this.mail.from ? this.mail.from : this.mail.to;
      this.newMail.image = this.mail.image;
      this.mailService.onSend(this.newMail);
      this.messageService.add({
        severity: "success",
        summary: "Success",
        detail: "Mail sent"
      });
      this.router.navigate(["apps/mail/inbox"]);
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  static \u0275fac = function MailDetailComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MailDetailComponent)(\u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(MailService), \u0275\u0275directiveInject(Location), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(MessageService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MailDetailComponent, selectors: [["ng-component"]], decls: 1, vars: 1, consts: [[4, "ngIf"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "md:justify-between", "mb-8", "pt-8", "md:pt-0", "gap-6", "md:border-t-0", "border-t", "border-surface-200", "dark:border-surface-700"], [1, "flex", "items-center", "md:justify-start"], ["pButton", "", "pRipple", "", "type", "button", "icon", "pi pi-chevron-left", "text", "", "plain", "", 1, "md:mr-4", 3, "click"], ["size", "large", "shape", "circle", "styleClass", "border-2 border-surface-200 dark:border-surface-700", 3, "image", 4, "ngIf"], [1, "flex", "flex-col", "mx-4"], [1, "block", "text-surface-900", "dark:text-surface-0", "font-bold", "text-lg"], [1, "block", "text-surface-900", "dark:text-surface-0", "font-semibold"], [1, "flex", "items-center", "justify-end", "gap-x-4", "px-6", "md:px-0"], [1, "text-surface-900", "dark:text-surface-0", "font-semibold", "whitespace-nowrap", "mr-auto"], ["pButton", "", "pRipple", "", "type", "button", "icon", "pi pi-reply", "text", "", "plain", "", 1, "flex-shrink-0"], ["pButton", "", "pRipple", "", "type", "button", "icon", "pi pi-ellipsis-v", "text", "", "plain", "", 1, "flex-shrink-0"], [1, "border-surface-200", "dark:border-surface-700", "border", "rounded", "p-6"], [1, "text-surface-900", "dark:text-surface-0", "font-semibold", "text-lg", "mb-4"], [1, "leading-normal", "mt-0", "mb-4", 3, "innerHTML"], [3, "ngModelChange", "ngModel"], [1, "flex", "gap-x-4", "justify-end", "mt-4"], ["pButton", "", "pRipple", "", "type", "button", "outlined", "", "icon", "pi pi-image"], ["pButton", "", "pRipple", "", "type", "button", "outlined", "", "icon", "pi pi-paperclip"], ["pButton", "", "pRipple", "", "type", "button", "icon", "pi pi-send", "label", "Send", 3, "click"], ["size", "large", "shape", "circle", "styleClass", "border-2 border-surface-200 dark:border-surface-700", 3, "image"]], template: function MailDetailComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, MailDetailComponent_div_0_Template, 24, 10, "div", 0);
    }
    if (rf & 2) {
      \u0275\u0275property("ngIf", ctx.mail);
    }
  }, dependencies: [AvatarModule, Avatar, ButtonModule, ButtonDirective, RippleModule, Ripple, CommonModule, NgIf, EditorModule, Editor, FormsModule, NgControlStatus, NgModel], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MailDetailComponent, { className: "MailDetailComponent", filePath: "src/app/apps/mail/mail-detail.ts", lineNumber: 48 });
})();
export {
  MailDetailComponent
};
//# sourceMappingURL=chunk-5QMBOOHX.js.map
