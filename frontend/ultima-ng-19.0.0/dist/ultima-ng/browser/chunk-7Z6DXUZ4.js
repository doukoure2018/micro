import {
  CustomerService
} from "./chunk-BDZY2JQU.js";
import {
  FileUpload,
  FileUploadModule
} from "./chunk-ZNXRKGHP.js";
import {
  Textarea,
  TextareaModule
} from "./chunk-RW4OSSQT.js";
import {
  InputGroupAddon
} from "./chunk-7A3QEVK3.js";
import {
  InputGroup,
  InputGroupModule
} from "./chunk-GEBY3FYZ.js";
import "./chunk-CSEZIGTY.js";
import {
  ProgressBar,
  ProgressBarModule
} from "./chunk-WQ2EPPBK.js";
import {
  SortIcon,
  SortableColumn,
  Table,
  TableModule
} from "./chunk-REDVHUQC.js";
import "./chunk-YZRRSC3U.js";
import "./chunk-6K6X5UBT.js";
import "./chunk-7HJ4XJ7U.js";
import {
  Select
} from "./chunk-UQSIOFSP.js";
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
import {
  IconField,
  InputIcon
} from "./chunk-WIQZFAVH.js";
import "./chunk-CCBQFN2J.js";
import {
  Router
} from "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
import {
  InputText,
  InputTextModule
} from "./chunk-FZELBHWZ.js";
import "./chunk-4IUQ6KTI.js";
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
import "./chunk-NQNBRQ7H.js";
import "./chunk-3HTR5OU7.js";
import "./chunk-BMYIFZHZ.js";
import "./chunk-W3K3GK4Z.js";
import {
  CommonModule,
  DatePipe
} from "./chunk-SQQPVFHK.js";
import {
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpropertyInterpolate1,
  ɵɵpureFunction0,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// src/app/pages/usermanagement/userlist.ts
var _c0 = () => [10, 25, 50];
var _c1 = () => ["name", "country.name", "representative.name"];
var _c2 = () => ({ height: ".5rem" });
function UserList_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 6)(1, "p-icon-field", 7);
    \u0275\u0275element(2, "p-inputicon", 8);
    \u0275\u0275elementStart(3, "input", 9);
    \u0275\u0275listener("input", function UserList_ng_template_3_Template_input_input_3_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      const dt_r3 = \u0275\u0275reference(2);
      return \u0275\u0275resetView(ctx_r1.onGlobalFilter(dt_r3, $event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "button", 10);
    \u0275\u0275listener("click", function UserList_ng_template_3_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.navigateToCreateUser());
    });
    \u0275\u0275elementEnd()();
  }
}
function UserList_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 11);
    \u0275\u0275text(2, "Name ");
    \u0275\u0275element(3, "p-sortIcon", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "th", 13);
    \u0275\u0275text(5, "Country ");
    \u0275\u0275element(6, "p-sortIcon", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 15);
    \u0275\u0275text(8, "Join Date ");
    \u0275\u0275element(9, "p-sortIcon", 16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 17);
    \u0275\u0275text(11, " Created By ");
    \u0275\u0275element(12, "p-sortIcon", 18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th", 19);
    \u0275\u0275text(14, "Activity ");
    \u0275\u0275element(15, "p-sortIcon", 20);
    \u0275\u0275elementEnd()();
  }
}
function UserList_ng_template_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td")(4, "div", 21);
    \u0275\u0275element(5, "img", 22);
    \u0275\u0275elementStart(6, "span", 23);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "td");
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td")(12, "div", 24);
    \u0275\u0275element(13, "img", 25);
    \u0275\u0275elementStart(14, "span");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(16, "td");
    \u0275\u0275element(17, "p-progressBar", 26);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const customer_r4 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(customer_r4.name);
    \u0275\u0275advance(3);
    \u0275\u0275classMap("flag flag-" + customer_r4.country.code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(customer_r4.country.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(10, 13, customer_r4.date, "MM/dd/yyyy"));
    \u0275\u0275advance(4);
    \u0275\u0275propertyInterpolate1("src", "/images/avatar/", customer_r4.representative.image, "", \u0275\u0275sanitizeUrl);
    \u0275\u0275property("alt", customer_r4.representative.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(customer_r4.representative.name);
    \u0275\u0275advance(2);
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(16, _c2));
    \u0275\u0275property("value", customer_r4.activity)("showValue", false);
  }
}
var UserList = class _UserList {
  customerService;
  router;
  customers = [];
  constructor(customerService, router) {
    this.customerService = customerService;
    this.router = router;
  }
  ngOnInit() {
    this.customerService.getCustomersLarge().then((customers) => this.customers = customers);
  }
  onGlobalFilter(table, event) {
    table.filterGlobal(event.target.value, "contains");
  }
  navigateToCreateUser() {
    this.router.navigate(["profile/create"]);
  }
  static \u0275fac = function UserList_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UserList)(\u0275\u0275directiveInject(CustomerService), \u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _UserList, selectors: [["user-list"]], features: [\u0275\u0275ProvidersFeature([CustomerService])], decls: 9, vars: 8, consts: [["dt", ""], ["caption", ""], ["header", ""], ["body", ""], [1, "card"], ["paginatorDropdownAppendTo", "body", "responsiveLayout", "scroll", "currentPageReportTemplate", "Showing {first} to {last} of {totalRecords} entries", 3, "value", "paginator", "rows", "showCurrentPageReport", "rowsPerPageOptions", "globalFilterFields"], [1, "flex", "flex-wrap", "gap-2", "items-center", "justify-between"], [1, "w-full", "sm:w-80", "order-1", "sm:order-none"], [1, "pi", "pi-search"], ["pInputText", "", "type", "text", "placeholder", "Global Search", 1, "w-full", 3, "input"], ["pButton", "", "outlined", "", "icon", "pi pi-user-plus", "label", "Add New", 1, "w-full", "sm:w-auto", "flex-order-0", "sm:flex-order-1", 3, "click"], ["pSortableColumn", "name", 1, "white-space-nowrap", 2, "width", "23%"], ["field", "name"], ["pSortableColumn", "country.name", 1, "white-space-nowrap", 2, "width", "23%"], ["field", "country.name"], ["pSortableColumn", "date", 1, "white-space-nowrap", 2, "width", "23%"], ["field", "date"], ["pSortableColumn", "representative.name", 1, "white-space-nowrap", 2, "width", "23%"], ["field", "representative.name"], ["pSortableColumn", "activity", 1, "white-space-nowrap"], ["field", "activity"], [1, "flex", "items-center", "gap-2"], ["src", "/images/flag/flag_placeholder.png", 1, "mr-2"], [1, "image-text"], [1, "inline-flex", "align-items-center"], [1, "w-8", "h-8", "mr-2", 3, "alt", "src"], [3, "value", "showValue"]], template: function UserList_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 4)(1, "p-table", 5, 0);
      \u0275\u0275template(3, UserList_ng_template_3_Template, 5, 0, "ng-template", null, 1, \u0275\u0275templateRefExtractor)(5, UserList_ng_template_5_Template, 16, 0, "ng-template", null, 2, \u0275\u0275templateRefExtractor)(7, UserList_ng_template_7_Template, 18, 17, "ng-template", null, 3, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275property("value", ctx.customers)("paginator", true)("rows", 10)("showCurrentPageReport", true)("rowsPerPageOptions", \u0275\u0275pureFunction0(6, _c0))("globalFilterFields", \u0275\u0275pureFunction0(7, _c1));
    }
  }, dependencies: [CommonModule, DatePipe, TableModule, Table, SortableColumn, SortIcon, InputTextModule, InputText, ProgressBarModule, ProgressBar, ButtonModule, ButtonDirective, IconField, InputIcon], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(UserList, { className: "UserList", filePath: "src/app/pages/usermanagement/userlist.ts", lineNumber: 76 });
})();

// src/app/pages/usermanagement/usercreate.ts
function UserCreate_ng_template_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 29);
    \u0275\u0275element(1, "img", 30);
    \u0275\u0275elementStart(2, "div");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const country_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275classMap("mr-2 flag flag-" + country_r1.code.toLowerCase());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(country_r1.name);
  }
}
var UserCreate = class _UserCreate {
  countries = [];
  ngOnInit() {
    this.countries = [
      { name: "Australia", code: "AU" },
      { name: "Brazil", code: "BR" },
      { name: "China", code: "CN" },
      { name: "Egypt", code: "EG" },
      { name: "France", code: "FR" },
      { name: "Germany", code: "DE" },
      { name: "India", code: "IN" },
      { name: "Japan", code: "JP" },
      { name: "Spain", code: "ES" },
      { name: "United States", code: "US" }
    ];
  }
  static \u0275fac = function UserCreate_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UserCreate)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _UserCreate, selectors: [["user-create"]], decls: 51, vars: 5, consts: [["item", ""], [1, "card"], [1, "text-surface-900", "dark:text-surface-0", "text-xl", "font-bold", "mb-6", "block"], [1, "grid", "grid-cols-12", "gap-4"], [1, "col-span-12", "lg:col-span-2"], [1, "text-surface-900", "dark:text-surface-0", "font-medium", "text-xl", "mb-4"], [1, "m-0", "p-0", "text-surface-600", "dark:text-surface-200", "leading-normal", "mr-4"], [1, "col-span-12", "lg:col-span-10"], [1, "mb-6", "col-span-12"], ["for", "nickname", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["id", "nickname", "type", "text", "pInputText", "", "fluid", ""], [1, "mb-6", "col-span-12", "flex", "flex-col", "items-start"], ["for", "avatar", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["mode", "basic", "name", "avatar", "url", "./upload.php", "accept", "image/*", "styleClass", "p-button-outlined p-button-plain", "chooseLabel", "Upload Image", 3, "maxFileSize"], ["for", "bio", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["pTextarea", "", "id", "bio", "type", "text", "rows", "5", "fluid", "", 3, "autoResize"], [1, "mb-6", "col-span-12", "md:col-span-6"], ["for", "email", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["id", "email", "type", "text", "pInputText", "", "fluid", ""], ["for", "country", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["inputId", "country", "optionLabel", "name", "fluid", "", "filterBy", "name", "placeholder", "Select a Country", 3, "options", "filter", "showClear"], ["for", "city", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["id", "city", "type", "text", "pInputText", "", "fluid", ""], ["for", "state", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["id", "state", "type", "text", "pInputText", "", "fluid", ""], ["for", "website", 1, "font-medium", "text-surface-900", "dark:text-surface-0", "mb-2", "block"], ["id", "website", "type", "text", "pInputText", "", "fluid", ""], [1, "col-span-12"], ["pButton", "", "pRipple", "", "label", "Create User", 1, "w-auto", "mt-3"], [1, "flex", "items-center"], ["src", "/images/flag/flag_placeholder.png", 2, "width", "18px"]], template: function UserCreate_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 1)(1, "span", 2);
      \u0275\u0275text(2, "Create User");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "div", 3)(4, "div", 4)(5, "div", 5);
      \u0275\u0275text(6, "Profile");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "p", 6);
      \u0275\u0275text(8, "Odio euismod lacinia at quis risus sed vulputate odio.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(9, "div", 7)(10, "div", 3)(11, "div", 8)(12, "label", 9);
      \u0275\u0275text(13, " Nickname ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(14, "input", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "div", 11)(16, "label", 12);
      \u0275\u0275text(17, "Avatar");
      \u0275\u0275elementEnd();
      \u0275\u0275element(18, "p-fileupload", 13);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "div", 8)(20, "label", 14);
      \u0275\u0275text(21, " Bio ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(22, "input", 15);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "div", 16)(24, "label", 17);
      \u0275\u0275text(25, " Email ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(26, "input", 18);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "div", 16)(28, "label", 19);
      \u0275\u0275text(29, " Country ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "p-select", 20);
      \u0275\u0275template(31, UserCreate_ng_template_31_Template, 4, 3, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(33, "div", 16)(34, "label", 21);
      \u0275\u0275text(35, " City ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(36, "input", 22);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "div", 16)(38, "label", 23);
      \u0275\u0275text(39, " State ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(40, "input", 24);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "div", 8)(42, "label", 25);
      \u0275\u0275text(43, " Website ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(44, "p-inputgroup")(45, "p-inputgroup-addon")(46, "span");
      \u0275\u0275text(47, "www");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(48, "input", 26);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(49, "div", 27);
      \u0275\u0275element(50, "button", 28);
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(18);
      \u0275\u0275property("maxFileSize", 1e6);
      \u0275\u0275advance(4);
      \u0275\u0275property("autoResize", true);
      \u0275\u0275advance(8);
      \u0275\u0275property("options", ctx.countries)("filter", true)("showClear", true);
    }
  }, dependencies: [Select, InputText, TextareaModule, Textarea, FileUploadModule, FileUpload, InputGroupAddon, ButtonModule, ButtonDirective, InputGroupModule, InputGroup, RippleModule, Ripple], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(UserCreate, { className: "UserCreate", filePath: "src/app/pages/usermanagement/usercreate.ts", lineNumber: 76 });
})();

// src/app/pages/usermanagement/usermanagement.routes.ts
var usermanagement_routes_default = [
  { path: "", redirectTo: "list", pathMatch: "full" },
  { path: "list", data: { breadcrumb: "List" }, component: UserList },
  { path: "create", data: { breadcrumb: "Create" }, component: UserCreate }
];
export {
  usermanagement_routes_default as default
};
//# sourceMappingURL=chunk-7Z6DXUZ4.js.map
