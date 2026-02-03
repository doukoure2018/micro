import {
  MailService
} from "./chunk-UI4NWC5C.js";
import {
  Toast,
  ToastModule
} from "./chunk-6SRYYUT2.js";
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RouterOutlet
} from "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
import "./chunk-KHEKFKWA.js";
import "./chunk-IVSL2HKS.js";
import "./chunk-E352KRZV.js";
import "./chunk-HHD4PK4J.js";
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
import "./chunk-BMYIFZHZ.js";
import "./chunk-W3K3GK4Z.js";
import {
  CommonModule,
  NgClass,
  NgForOf,
  NgIf
} from "./chunk-SQQPVFHK.js";
import {
  filter,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵpureFunction2,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// src/app/apps/mail/mail-sidebar.ts
var _c0 = (a0, a1) => ({ "bg-primary": a0, "hover:surface-hover": a1 });
var _c1 = (a0) => ({ "text-white dark:text-surface-900": a0 });
var _c2 = (a0) => ({ "dark:bg-primary-900 dark:text-white": a0 });
function MailSidebarComponent_li_4_span_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r1 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(2, _c2, ctx_r1.url === item_r1.routerLink));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", item_r1.badge, " ");
  }
}
function MailSidebarComponent_li_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 4);
    \u0275\u0275element(1, "i", 5);
    \u0275\u0275elementStart(2, "span", 6);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, MailSidebarComponent_li_4_span_4_Template, 2, 4, "span", 7);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("routerLinkActive", "bg-primary")("routerLink", item_r1 == null ? null : item_r1.routerLink)("ngClass", \u0275\u0275pureFunction2(9, _c0, ctx_r1.url === item_r1.routerLink, ctx_r1.url !== item_r1.routerLink));
    \u0275\u0275advance();
    \u0275\u0275classMap(item_r1.icon || "");
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(12, _c1, ctx_r1.url === item_r1.routerLink));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(14, _c1, ctx_r1.url === item_r1.routerLink));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r1.label);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", item_r1.badge);
  }
}
var MailSidebarComponent = class _MailSidebarComponent {
  router;
  mailService;
  items = [];
  badgeValues;
  mailSubscription;
  routeSubscription;
  url = "";
  constructor(router, mailService) {
    this.router = router;
    this.mailService = mailService;
    this.url = this.router.url;
    this.mailSubscription = this.mailService.mails$.subscribe((data) => this.getBadgeValues(data));
    this.routeSubscription = this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((params) => {
      this.url = params.url;
    });
  }
  getBadgeValues(data) {
    let inbox = [], starred = [], spam = [], important = [], archived = [], trash = [], sent = [];
    for (let i = 0; i < data.length; i++) {
      let mail = data[i];
      if (!mail.archived && !mail.trash && !mail.spam && !mail.hasOwnProperty("sent")) {
        inbox.push(mail);
      }
      if (mail.starred && !mail.archived && !mail.trash) {
        starred.push(mail);
      }
      if (mail.spam && !mail.archived && !mail.trash) {
        spam.push(mail);
      }
      if (mail.important && !mail.archived && !mail.trash) {
        important.push(mail);
      }
      if (mail.archived && !mail.trash) {
        archived.push(mail);
      }
      if (mail.trash) {
        trash.push(mail);
      }
      if (mail.sent && !mail.archived && !mail.trash) {
        sent.push(mail);
      }
    }
    this.badgeValues = {
      inbox: inbox.length,
      starred: starred.length,
      spam: spam.length,
      important: important.length,
      archived: archived.length,
      trash: trash.length,
      sent: sent.length
    };
    this.updateSidebar();
  }
  updateSidebar() {
    this.items = [
      {
        label: "Inbox",
        icon: "pi pi-inbox",
        badge: this.badgeValues.inbox,
        routerLink: "/apps/mail/inbox"
      },
      {
        label: "Starred",
        icon: "pi pi-star",
        badge: this.badgeValues.starred,
        routerLink: "/apps/mail/starred"
      },
      {
        label: "Spam",
        icon: "pi pi-ban",
        badge: this.badgeValues.spam,
        routerLink: "/apps/mail/spam"
      },
      {
        label: "Important",
        icon: "pi pi-bookmark",
        badge: this.badgeValues.important,
        routerLink: "/apps/mail/important"
      },
      {
        label: "Sent",
        icon: "pi pi-send",
        badge: this.badgeValues.sent,
        routerLink: "/apps/mail/sent"
      },
      {
        label: "Archived",
        icon: "pi pi-book",
        badge: this.badgeValues.archived,
        routerLink: "/apps/mail/archived"
      },
      {
        label: "Trash",
        icon: "pi pi-trash",
        badge: this.badgeValues.trash,
        routerLink: "/apps/mail/trash"
      }
    ];
  }
  ngOnDestroy() {
    this.mailSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }
  static \u0275fac = function MailSidebarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MailSidebarComponent)(\u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(MailService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MailSidebarComponent, selectors: [["app-mail-sidebar"]], decls: 5, vars: 2, consts: [["pButton", "", "pRipple", "", "label", "Compose New", "outlined", "", 1, "mb-8", "w-full", 3, "routerLink"], [1, "overflow-auto"], [1, "flex", "flex-row", "md:flex-col", "gap-1", "md:gap-2", "list-none", "m-0", "p-0", "overflow-auto"], ["pRipple", "", "class", "cursor-pointer select-none p-4 duration-150 rounded flex items-center justify-center md:justify-start md:flex-1 flex-auto", 3, "routerLinkActive", "routerLink", "ngClass", 4, "ngFor", "ngForOf"], ["pRipple", "", 1, "cursor-pointer", "select-none", "p-4", "duration-150", "rounded", "flex", "items-center", "justify-center", "md:justify-start", "md:flex-1", "flex-auto", 3, "routerLinkActive", "routerLink", "ngClass"], [1, "md:mr-4", "text-surface-600", "dark:text-surface-200", "duration-150", "text-lg", 3, "ngClass"], [1, "text-surface-900", "dark:text-surface-0", "font-medium", "hidden", "md:inline", 3, "ngClass"], ["class", "ml-auto text-sm font-semibold bg-primary-50 text-primary-900 px-2 py-1 hidden md:inline-flex items-center justify-center", "style", "border-radius: 50%; min-width: 23px; height: auto; aspect-ratio: 1; padding: 0 6px;", 3, "ngClass", 4, "ngIf"], [1, "ml-auto", "text-sm", "font-semibold", "bg-primary-50", "text-primary-900", "px-2", "py-1", "hidden", "md:inline-flex", "items-center", "justify-center", 2, "border-radius", "50%", "min-width", "23px", "height", "auto", "aspect-ratio", "1", "padding", "0 6px", 3, "ngClass"]], template: function MailSidebarComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div");
      \u0275\u0275element(1, "button", 0);
      \u0275\u0275elementStart(2, "div", 1)(3, "ul", 2);
      \u0275\u0275template(4, MailSidebarComponent_li_4_Template, 5, 16, "li", 3);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275property("routerLink", "/apps/mail/compose/");
      \u0275\u0275advance(3);
      \u0275\u0275property("ngForOf", ctx.items);
    }
  }, dependencies: [ButtonModule, ButtonDirective, RippleModule, Ripple, RouterModule, RouterLink, RouterLinkActive, CommonModule, NgClass, NgForOf, NgIf], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MailSidebarComponent, { className: "MailSidebarComponent", filePath: "src/app/apps/mail/mail-sidebar.ts", lineNumber: 59 });
})();

// src/app/apps/mail/index.ts
var MailAppComponent = class _MailAppComponent {
  static \u0275fac = function MailAppComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MailAppComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MailAppComponent, selectors: [["ng-component"]], features: [\u0275\u0275ProvidersFeature([MessageService, MailService])], decls: 7, vars: 0, consts: [[1, "card"], [1, "flex", "flex-col", "md:flex-row", "gap-6"], [1, "w-full", "md:w-3/12", "xl:w-2/12", "xl:p-4"], [1, "md:w-9/12", "xl:w-10/12", "xl:p-4"]], template: function MailAppComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "p-toast");
      \u0275\u0275elementStart(1, "div", 0)(2, "div", 1)(3, "div", 2);
      \u0275\u0275element(4, "app-mail-sidebar");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div", 3);
      \u0275\u0275element(6, "router-outlet");
      \u0275\u0275elementEnd()()();
    }
  }, dependencies: [ToastModule, Toast, MailSidebarComponent, RouterModule, RouterOutlet], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MailAppComponent, { className: "MailAppComponent", filePath: "src/app/apps/mail/index.ts", lineNumber: 26 });
})();
export {
  MailAppComponent
};
//# sourceMappingURL=chunk-KGEBAPRG.js.map
