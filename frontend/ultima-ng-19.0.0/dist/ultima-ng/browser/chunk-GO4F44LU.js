import {
  MailTableComponent
} from "./chunk-IC55ODXD.js";
import "./chunk-LEUN6ZA4.js";
import {
  MailService
} from "./chunk-UI4NWC5C.js";
import "./chunk-RKCUEC6H.js";
import "./chunk-LPU4RT7P.js";
import "./chunk-WWXP2HWK.js";
import "./chunk-CXW3XKZ2.js";
import "./chunk-MCGUCMXD.js";
import "./chunk-REDVHUQC.js";
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
  Router
} from "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
import "./chunk-FZELBHWZ.js";
import "./chunk-4IUQ6KTI.js";
import "./chunk-IVSL2HKS.js";
import "./chunk-E352KRZV.js";
import "./chunk-HHD4PK4J.js";
import "./chunk-PJSNAOPI.js";
import "./chunk-AP3OAIHW.js";
import "./chunk-NQNBRQ7H.js";
import "./chunk-3HTR5OU7.js";
import "./chunk-BMYIFZHZ.js";
import "./chunk-W3K3GK4Z.js";
import "./chunk-SQQPVFHK.js";
import {
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵproperty
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// src/app/apps/mail/mail-inbox.ts
var MailInboxComponent = class _MailInboxComponent {
  mailService;
  router;
  mails = [];
  subscription;
  constructor(mailService, router) {
    this.mailService = mailService;
    this.router = router;
    this.subscription = this.mailService.mails$.subscribe((data) => {
      this.mails = data.filter((d) => !d.archived && !d.spam && !d.trash && !d.hasOwnProperty("sent"));
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  static \u0275fac = function MailInboxComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MailInboxComponent)(\u0275\u0275directiveInject(MailService), \u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MailInboxComponent, selectors: [["app-mail-inbox"]], decls: 1, vars: 1, consts: [[3, "mails"]], template: function MailInboxComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "app-mail-table", 0);
    }
    if (rf & 2) {
      \u0275\u0275property("mails", ctx.mails);
    }
  }, dependencies: [MailTableComponent], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MailInboxComponent, { className: "MailInboxComponent", filePath: "src/app/apps/mail/mail-inbox.ts", lineNumber: 14 });
})();
export {
  MailInboxComponent
};
//# sourceMappingURL=chunk-GO4F44LU.js.map
