import {
  Editor,
  EditorModule
} from "./chunk-LEUN6ZA4.js";
import {
  MailService
} from "./chunk-UI4NWC5C.js";
import {
  Menu,
  MenuModule
} from "./chunk-RKCUEC6H.js";
import {
  Dialog,
  DialogModule
} from "./chunk-LPU4RT7P.js";
import {
  Avatar,
  AvatarModule
} from "./chunk-MCGUCMXD.js";
import {
  Table,
  TableCheckbox,
  TableHeaderCheckbox,
  TableModule
} from "./chunk-REDVHUQC.js";
import {
  IconField,
  IconFieldModule,
  InputIcon,
  InputIconModule
} from "./chunk-WIQZFAVH.js";
import {
  Router
} from "./chunk-BTKK64MU.js";
import {
  InputText,
  InputTextModule
} from "./chunk-FZELBHWZ.js";
import {
  Tooltip,
  TooltipModule
} from "./chunk-4IUQ6KTI.js";
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
import {
  CommonModule,
  NgClass,
  NgIf
} from "./chunk-SQQPVFHK.js";
import {
  EventEmitter,
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
  ɵɵpureFunction2,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeHtml,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-ZKKMBKIA.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/apps/mail/mail-reply.ts
var _c0 = () => ({ height: "250px" });
function MailReplyComponent_div_0_div_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 20);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("innerHTML", ctx_r1.content.message, \u0275\u0275sanitizeHtml);
  }
}
function MailReplyComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "div", 3)(3, "label", 4);
    \u0275\u0275text(4, "To");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p-iconfield", 5);
    \u0275\u0275element(6, "p-inputicon", 6);
    \u0275\u0275elementStart(7, "input", 7);
    \u0275\u0275twoWayListener("ngModelChange", function MailReplyComponent_div_0_Template_input_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.content.from, $event) || (ctx_r1.content.from = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 3)(9, "label", 8);
    \u0275\u0275text(10, "Subject");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "p-iconfield", 5);
    \u0275\u0275element(12, "p-inputicon", 9);
    \u0275\u0275elementStart(13, "input", 10);
    \u0275\u0275twoWayListener("ngModelChange", function MailReplyComponent_div_0_Template_input_ngModelChange_13_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.content.title, $event) || (ctx_r1.content.title = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(14, MailReplyComponent_div_0_div_14_Template, 1, 1, "div", 11);
    \u0275\u0275elementStart(15, "div", 12)(16, "span", 13);
    \u0275\u0275listener("click", function MailReplyComponent_div_0_Template_span_click_16_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleMessage());
    });
    \u0275\u0275element(17, "i", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "p-editor", 15);
    \u0275\u0275twoWayListener("ngModelChange", function MailReplyComponent_div_0_Template_p_editor_ngModelChange_18_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.newMail.message, $event) || (ctx_r1.newMail.message = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "div", 16);
    \u0275\u0275element(20, "button", 17)(21, "button", 18);
    \u0275\u0275elementStart(22, "button", 19);
    \u0275\u0275listener("click", function MailReplyComponent_div_0_Template_button_click_22_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.sendMail());
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.content.from);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.content.title);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.displayMessage);
    \u0275\u0275advance(2);
    \u0275\u0275property("pTooltip", ctx_r1.displayMessage ? "Hide content" : "Show content");
    \u0275\u0275advance(2);
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(7, _c0));
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.newMail.message);
  }
}
var MailReplyComponent = class _MailReplyComponent {
  messageService;
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
  displayMessage = false;
  content = {};
  hide = new EventEmitter();
  constructor(messageService, mailService) {
    this.messageService = messageService;
    this.mailService = mailService;
  }
  sendMail() {
    let { image, from, title } = this.content;
    this.newMail = __spreadProps(__spreadValues({}, this.newMail), {
      to: from,
      title,
      image
    });
    this.mailService.onSend(this.newMail);
    this.messageService.add({
      severity: "success",
      summary: "Success",
      detail: "Mail sent"
    });
    this.hide.emit();
  }
  toggleMessage() {
    this.displayMessage = !this.displayMessage;
  }
  static \u0275fac = function MailReplyComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MailReplyComponent)(\u0275\u0275directiveInject(MessageService), \u0275\u0275directiveInject(MailService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MailReplyComponent, selectors: [["app-mail-reply"]], inputs: { content: "content" }, outputs: { hide: "hide" }, decls: 1, vars: 1, consts: [["class", "p-0 m-0", 4, "ngIf"], [1, "p-0", "m-0"], [1, "bg-surface-0", "dark:bg-surface-950", "grid", "grid-cols-12", "grid-nogutter", "flex-col", "md:flex-row", "gap-12", "p-8", "rounded"], [1, "col-span-6"], ["for", "to", 1, "block", "text-surface-900", "dark:text-surface-0", "font-semibold", "mb-4"], ["styleClass", "w-full", 2, "height", "3.5rem"], ["styleClass", "pi pi-user", 2, "left", "1.5rem"], ["id", "to", "type", "text", "pInputText", "", 1, "w-full", "!pl-16", "text-surface-900", "dark:text-surface-0", "font-semibold", 2, "height", "3.5rem", 3, "ngModelChange", "ngModel"], ["for", "Subject", 1, "block", "text-surface-900", "dark:text-surface-0", "font-semibold", "mb-4"], ["styleClass", "pi pi-pencil", 2, "left", "1.5rem"], ["id", "subject", "type", "text", "pInputText", "", "placeholder", "Subject", 1, "w-full", "!pl-16", "text-surface-900", "dark:text-surface-0", "font-semibold", 2, "height", "3.5rem", 3, "ngModelChange", "ngModel"], ["class", "col-span-12", 3, "innerHTML", 4, "ngIf"], [1, "col-span-12"], [1, "bg-surface-50", "dark:bg-surface-950", "cursor-pointer", "rounded", "px-2", 3, "click", "pTooltip"], [1, "pi", "pi-ellipsis-h"], ["styleClass", "mt-4", 3, "ngModelChange", "ngModel"], [1, "flex", "gap-x-4", "justify-end", "p-8", "border-t", "border-surface-200", "dark:border-surface-700"], ["pButton", "", "pRipple", "", "type", "button", "outlined", "", "icon", "pi pi-image"], ["pButton", "", "pRipple", "", "type", "button", "outlined", "", "icon", "pi pi-paperclip"], ["pButton", "", "pRipple", "", "type", "button", "icon", "pi pi-send", "label", "Send", 1, "h-12", 3, "click"], [1, "col-span-12", 3, "innerHTML"]], template: function MailReplyComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, MailReplyComponent_div_0_Template, 23, 8, "div", 0);
    }
    if (rf & 2) {
      \u0275\u0275property("ngIf", ctx.content);
    }
  }, dependencies: [CommonModule, NgIf, TooltipModule, Tooltip, ButtonModule, ButtonDirective, EditorModule, Editor, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, IconFieldModule, IconField, InputIconModule, InputIcon, InputTextModule, InputText, RippleModule, Ripple], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MailReplyComponent, { className: "MailReplyComponent", filePath: "src/app/apps/mail/mail-reply.ts", lineNumber: 48 });
})();

// src/app/apps/mail/mail-table.ts
var _c02 = () => ["from", "title", "message"];
var _c1 = () => [10, 20, 30];
var _c2 = (a0, a1) => ({ "pi-star-fill": a0, "pi-star": a1 });
var _c3 = (a0, a1) => ({ "pi-bookmark-fill": a0, "pi-bookmark": a1 });
function MailTableComponent_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 9)(1, "div", 10);
    \u0275\u0275element(2, "p-tableHeaderCheckbox")(3, "button", 11);
    \u0275\u0275elementStart(4, "button", 12);
    \u0275\u0275listener("click", function MailTableComponent_ng_template_2_Template_button_click_4_listener($event) {
      \u0275\u0275restoreView(_r2);
      const menu_r3 = \u0275\u0275reference(6);
      return \u0275\u0275resetView(menu_r3.toggle($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "p-menu", 13, 3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p-iconfield");
    \u0275\u0275element(8, "p-inputicon", 14);
    \u0275\u0275elementStart(9, "input", 15);
    \u0275\u0275listener("input", function MailTableComponent_ng_template_2_Template_input_input_9_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r3 = \u0275\u0275nextContext();
      const dt_r5 = \u0275\u0275reference(1);
      return \u0275\u0275resetView(ctx_r3.onGlobalFilter(dt_r5, $event));
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    const dt_r5 = \u0275\u0275reference(1);
    \u0275\u0275advance(5);
    \u0275\u0275property("model", ctx_r3.menuItems)("appendTo", dt_r5)("popup", true);
  }
}
function MailTableComponent_ng_template_4_td_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "td", 32)(1, "span", 33);
    \u0275\u0275listener("click", function MailTableComponent_ng_template_4_td_3_Template_span_click_1_listener($event) {
      \u0275\u0275restoreView(_r10);
      const mail_r9 = \u0275\u0275nextContext().$implicit;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.onStar($event, mail_r9.id));
    })("touchend", function MailTableComponent_ng_template_4_td_3_Template_span_touchend_1_listener($event) {
      \u0275\u0275restoreView(_r10);
      const mail_r9 = \u0275\u0275nextContext().$implicit;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.onStar($event, mail_r9.id));
    });
    \u0275\u0275element(2, "i", 34);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const mail_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(1, _c2, mail_r9.starred, !mail_r9.starred));
  }
}
function MailTableComponent_ng_template_4_td_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "td", 32)(1, "span", 33);
    \u0275\u0275listener("click", function MailTableComponent_ng_template_4_td_4_Template_span_click_1_listener($event) {
      \u0275\u0275restoreView(_r11);
      const mail_r9 = \u0275\u0275nextContext().$implicit;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.onBookmark($event, mail_r9.id));
    })("touchend", function MailTableComponent_ng_template_4_td_4_Template_span_touchend_1_listener($event) {
      \u0275\u0275restoreView(_r11);
      const mail_r9 = \u0275\u0275nextContext().$implicit;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.onBookmark($event, mail_r9.id));
    });
    \u0275\u0275element(2, "i", 34);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const mail_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(1, _c3, mail_r9.important, !mail_r9.important));
  }
}
function MailTableComponent_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 16);
    \u0275\u0275listener("mouseenter", function MailTableComponent_ng_template_4_Template_tr_mouseenter_0_listener($event) {
      \u0275\u0275restoreView(_r6);
      const date_r7 = \u0275\u0275reference(15);
      const options_r8 = \u0275\u0275reference(18);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.toggleOptions($event, options_r8, date_r7));
    })("mouseleave", function MailTableComponent_ng_template_4_Template_tr_mouseleave_0_listener($event) {
      \u0275\u0275restoreView(_r6);
      const date_r7 = \u0275\u0275reference(15);
      const options_r8 = \u0275\u0275reference(18);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.toggleOptions($event, options_r8, date_r7));
    })("click", function MailTableComponent_ng_template_4_Template_tr_click_0_listener() {
      const mail_r9 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.onRowSelect(mail_r9.id));
    });
    \u0275\u0275elementStart(1, "td", 17)(2, "p-tableCheckbox", 18);
    \u0275\u0275listener("click", function MailTableComponent_ng_template_4_Template_p_tableCheckbox_click_2_listener($event) {
      \u0275\u0275restoreView(_r6);
      return \u0275\u0275resetView($event.stopPropagation());
    })("touchend", function MailTableComponent_ng_template_4_Template_p_tableCheckbox_touchend_2_listener($event) {
      \u0275\u0275restoreView(_r6);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275template(3, MailTableComponent_ng_template_4_td_3_Template, 3, 4, "td", 19)(4, MailTableComponent_ng_template_4_td_4_Template, 3, 4, "td", 19);
    \u0275\u0275elementStart(5, "td", 20);
    \u0275\u0275element(6, "p-avatar", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 22);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 23)(10, "span", 24);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "td", 25)(13, "div", 26)(14, "span", 27, 4);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 28, 5)(19, "button", 29);
    \u0275\u0275listener("click", function MailTableComponent_ng_template_4_Template_button_click_19_listener($event) {
      const mail_r9 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.onArchive($event, mail_r9.id));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "button", 30);
    \u0275\u0275listener("click", function MailTableComponent_ng_template_4_Template_button_click_20_listener($event) {
      const mail_r9 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.onReply($event, mail_r9));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "button", 31);
    \u0275\u0275listener("click", function MailTableComponent_ng_template_4_Template_button_click_21_listener($event) {
      const mail_r9 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.onTrash($event, mail_r9));
    });
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const mail_r9 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("value", mail_r9);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !mail_r9.trash && !mail_r9.spam);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !mail_r9.trash && !mail_r9.spam);
    \u0275\u0275advance(2);
    \u0275\u0275property("image", mail_r9.image ? "/images/avatar/" + mail_r9.image : "assets/layout/images/avatar.png");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", mail_r9.from || mail_r9.to, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", mail_r9.title, " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", mail_r9.date, " ");
  }
}
var MailTableComponent = class _MailTableComponent {
  router;
  mailService;
  messageService;
  mails;
  menuItems = [];
  selectedMails = [];
  mail = {};
  dialogVisible = false;
  constructor(router, mailService, messageService) {
    this.router = router;
    this.mailService = mailService;
    this.messageService = messageService;
  }
  ngOnInit() {
    this.menuItems = [
      {
        label: "Archive",
        icon: "pi pi-fw pi-file",
        command: () => this.onArchiveMultiple()
      },
      {
        label: "Spam",
        icon: "pi pi-fw pi-ban",
        command: () => this.onSpamMultiple()
      },
      {
        label: "Delete",
        icon: "pi pi-fw pi-trash",
        command: () => this.onDeleteMultiple()
      }
    ];
  }
  toggleOptions(event, opt, date) {
    if (event.type === "mouseenter") {
      opt.style.display = "flex";
      date.style.display = "none";
    } else {
      opt.style.display = "none";
      date.style.display = "flex";
    }
  }
  onRowSelect(id) {
    this.router.navigate(["/apps/mail/detail/", id]);
  }
  onStar(event, id) {
    event.stopPropagation();
    this.mailService.onStar(id);
  }
  onArchive(event, id) {
    event.stopPropagation();
    this.mailService.onArchive(id);
    this.messageService.add({
      severity: "info",
      summary: "Info",
      detail: "Mail archived",
      life: 3e3
    });
  }
  onBookmark(event, id) {
    event.stopPropagation();
    this.mailService.onBookmark(id);
  }
  onDelete(id) {
    this.mailService.onDelete(id);
    this.messageService.add({
      severity: "info",
      summary: "Info",
      detail: "Mail deleted",
      life: 3e3
    });
  }
  onDeleteMultiple() {
    if (this.selectedMails && this.selectedMails.length > 0) {
      this.mailService.onDeleteMultiple(this.selectedMails);
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "Mails deleted",
        life: 3e3
      });
    }
  }
  onSpamMultiple() {
    if (this.selectedMails && this.selectedMails.length > 0) {
      this.mailService.onSpamMultiple(this.selectedMails);
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "Moved to spam",
        life: 3e3
      });
    }
  }
  onArchiveMultiple() {
    if (this.selectedMails && this.selectedMails.length > 0) {
      this.mailService.onArchiveMultiple(this.selectedMails);
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "Moved to archive",
        life: 3e3
      });
    }
  }
  onTrash(event, mail) {
    event.stopPropagation();
    if (mail.trash) {
      this.onDelete(mail.id);
    }
    this.mailService.onTrash(mail.id);
  }
  onReply(event, mail) {
    event.stopPropagation();
    this.mail = mail;
    this.dialogVisible = true;
  }
  onGlobalFilter(table, event) {
    table.filterGlobal(event.target.value, "contains");
  }
  static \u0275fac = function MailTableComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MailTableComponent)(\u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(MailService), \u0275\u0275directiveInject(MessageService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MailTableComponent, selectors: [["app-mail-table"]], inputs: { mails: "mails" }, decls: 8, vars: 13, consts: [["dt", ""], ["caption", ""], ["body", ""], ["menu", ""], ["date", ""], ["options", ""], ["responsiveLayout", "scroll", "selectionMode", "multiple", "dataKey", "id", 3, "selectionChange", "value", "rows", "globalFilterFields", "paginator", "rowsPerPageOptions", "selection", "rowHover"], ["header", "New Message", "styleClass", "mx-4 sm:mx-0 sm:w-full md:w-8/12 lg:w-6/12", "contentStyleClass", "rounded-b border-t border-surface-200 dark:border-surface-700 p-0", 3, "visibleChange", "onHide", "visible", "closable", "modal"], [3, "hide", "content"], [1, "flex", "flex-wrap", "items-center", "justify-between", "gap-3"], [1, "flex", "gap-2", "items-center"], ["pButton", "", "pRipple", "", "type", "button", "icon", "pi pi-refresh", "rounded", "", "text", "", "plain", "", 1, "ml-4"], ["pButton", "", "pRipple", "", "type", "button", "icon", "pi pi-ellipsis-v", "rounded", "", "text", "", "plain", "", 1, "ml-3", 3, "click"], [3, "model", "appendTo", "popup"], [1, "pi", "pi-search"], ["pInputText", "", "type", "text", "placeholder", "Search Mail", 1, "w-full", "sm:w-auto", 3, "input"], [1, "cursor-pointer", 3, "mouseenter", "mouseleave", "click"], [1, "pl-3", 2, "width", "4rem"], [3, "click", "touchend", "value"], ["style", "width: 4rem", 4, "ngIf"], [2, "min-width", "4rem"], [3, "image"], [1, "text-900", "font-semibold", 2, "min-width", "12rem"], [2, "min-width", "12rem"], [1, "font-medium", "white-space-nowrap", "overflow-hidden", "text-overflow-ellipsis", "block", 2, "max-width", "30rem"], [2, "width", "12rem"], [1, "flex", "justify-content-end", "w-full", "px-0"], [1, "text-700", "font-semibold", "white-space-nowrap"], [2, "display", "none"], ["pButton", "", "pRipple", "", "icon", "pi pi-inbox", "pTooltip", "Archive", "tooltipPosition", "top", "type", "button", 1, "h-8", "w-8", "mr-2", 3, "click"], ["pButton", "", "pRipple", "", "icon", "pi pi-reply", "severity", "secondary", "pTooltip", "Reply", "tooltipPosition", "top", "type", "button", 1, "h-8", "w-8", "mr-2", 3, "click"], ["pButton", "", "pRipple", "", "icon", "pi pi-trash", "severity", "danger", "pTooltip", "Trash", "tooltipPosition", "top", "type", "button", 1, "h-8", "w-8rem", 3, "click"], [2, "width", "4rem"], [1, "cursor-pointer", 3, "click", "touchend"], [1, "pi", "pi-fw", "text-xl", 3, "ngClass"]], template: function MailTableComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "p-table", 6, 0);
      \u0275\u0275twoWayListener("selectionChange", function MailTableComponent_Template_p_table_selectionChange_0_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.selectedMails, $event) || (ctx.selectedMails = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275template(2, MailTableComponent_ng_template_2_Template, 10, 3, "ng-template", null, 1, \u0275\u0275templateRefExtractor)(4, MailTableComponent_ng_template_4_Template, 22, 7, "ng-template", null, 2, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "p-dialog", 7);
      \u0275\u0275twoWayListener("visibleChange", function MailTableComponent_Template_p_dialog_visibleChange_6_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.dialogVisible, $event) || (ctx.dialogVisible = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275listener("onHide", function MailTableComponent_Template_p_dialog_onHide_6_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.dialogVisible = false);
      });
      \u0275\u0275elementStart(7, "app-mail-reply", 8);
      \u0275\u0275listener("hide", function MailTableComponent_Template_app_mail_reply_hide_7_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.dialogVisible = false);
      });
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275property("value", ctx.mails)("rows", 10)("globalFilterFields", \u0275\u0275pureFunction0(11, _c02))("paginator", true)("rowsPerPageOptions", \u0275\u0275pureFunction0(12, _c1));
      \u0275\u0275twoWayProperty("selection", ctx.selectedMails);
      \u0275\u0275property("rowHover", true);
      \u0275\u0275advance(6);
      \u0275\u0275twoWayProperty("visible", ctx.dialogVisible);
      \u0275\u0275property("closable", true)("modal", true);
      \u0275\u0275advance();
      \u0275\u0275property("content", ctx.mail);
    }
  }, dependencies: [TableModule, Table, TableCheckbox, TableHeaderCheckbox, ButtonModule, ButtonDirective, CommonModule, NgClass, NgIf, DialogModule, Dialog, RippleModule, Ripple, AvatarModule, Avatar, MenuModule, Menu, MailReplyComponent, IconFieldModule, IconField, InputIconModule, InputIcon, InputTextModule, InputText, TooltipModule, Tooltip], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MailTableComponent, { className: "MailTableComponent", filePath: "src/app/apps/mail/mail-table.ts", lineNumber: 116 });
})();

export {
  MailTableComponent
};
//# sourceMappingURL=chunk-IC55ODXD.js.map
