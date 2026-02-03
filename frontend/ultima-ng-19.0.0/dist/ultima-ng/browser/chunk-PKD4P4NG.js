import {
  Documentation
} from "./chunk-EIZ54RW5.js";
import {
  Toolbar,
  ToolbarModule
} from "./chunk-MBO5DVGW.js";
import {
  ProductService
} from "./chunk-JVDBGEQL.js";
import {
  Rating,
  RatingModule
} from "./chunk-A4PDURMQ.js";
import {
  ConfirmDialog,
  ConfirmDialogModule
} from "./chunk-JQ4E7TJM.js";
import {
  Textarea,
  TextareaModule
} from "./chunk-RW4OSSQT.js";
import {
  LayoutService
} from "./chunk-ZGNAW63S.js";
import {
  Dialog,
  DialogModule
} from "./chunk-LPU4RT7P.js";
import "./chunk-WWXP2HWK.js";
import "./chunk-CXW3XKZ2.js";
import {
  ToastModule
} from "./chunk-6SRYYUT2.js";
import {
  SortIcon,
  SortableColumn,
  Table,
  TableCheckbox,
  TableHeaderCheckbox,
  TableModule
} from "./chunk-REDVHUQC.js";
import "./chunk-YZRRSC3U.js";
import "./chunk-6K6X5UBT.js";
import "./chunk-7HJ4XJ7U.js";
import {
  Select,
  SelectModule
} from "./chunk-UQSIOFSP.js";
import "./chunk-OCW7T434.js";
import "./chunk-4JIPYACT.js";
import "./chunk-6GA37Q7Z.js";
import {
  Tag,
  TagModule
} from "./chunk-MYUKI7DG.js";
import "./chunk-544F7IXR.js";
import "./chunk-YBM6FZLP.js";
import "./chunk-U4P2VV4G.js";
import "./chunk-CPYA4VSS.js";
import {
  InputNumber,
  InputNumberModule
} from "./chunk-JGOABXTK.js";
import {
  RadioButton,
  RadioButtonModule
} from "./chunk-HY2A3TN6.js";
import "./chunk-YEN5RMZS.js";
import "./chunk-XS7IVZ5T.js";
import "./chunk-CUABQE42.js";
import "./chunk-V6CKOH3G.js";
import "./chunk-DBPX6ILC.js";
import {
  IconField,
  IconFieldModule,
  InputIcon,
  InputIconModule
} from "./chunk-WIQZFAVH.js";
import "./chunk-CCBQFN2J.js";
import "./chunk-KHEKFKWA.js";
import {
  InputText,
  InputTextModule
} from "./chunk-FZELBHWZ.js";
import "./chunk-4IUQ6KTI.js";
import "./chunk-IVSL2HKS.js";
import "./chunk-E352KRZV.js";
import "./chunk-HHD4PK4J.js";
import {
  Button,
  ButtonDirective,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import {
  RippleModule
} from "./chunk-AP3OAIHW.js";
import {
  ConfirmationService,
  MessageService
} from "./chunk-NQNBRQ7H.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel,
  RequiredValidator
} from "./chunk-3HTR5OU7.js";
import "./chunk-BMYIFZHZ.js";
import "./chunk-W3K3GK4Z.js";
import {
  CommonModule,
  CurrencyPipe,
  NgClass,
  NgForOf,
  NgIf,
  NgStyle
} from "./chunk-SQQPVFHK.js";
import {
  signal,
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
  ɵɵloadQuery,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuery
} from "./chunk-ZKKMBKIA.js";
import {
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/pages/crud/crud.ts
var _c0 = ["dt"];
var _c1 = () => ({ "min-width": "75rem" });
var _c2 = () => [10, 20, 30];
var _c3 = () => ({ width: "450px" });
function Crud_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 12);
    \u0275\u0275listener("onClick", function Crud_ng_template_2_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.openNew());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 13);
    \u0275\u0275listener("onClick", function Crud_ng_template_2_Template_p_button_onClick_1_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.deleteSelectedProducts());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r2.selectedProducts || !ctx_r2.selectedProducts.length);
  }
}
function Crud_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 14);
    \u0275\u0275listener("onClick", function Crud_ng_template_4_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.exportCSV());
    });
    \u0275\u0275elementEnd();
  }
}
function Crud_ng_template_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 15)(1, "h5", 16);
    \u0275\u0275text(2, "Manage Products");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p-iconfield");
    \u0275\u0275element(4, "p-inputicon", 17);
    \u0275\u0275elementStart(5, "input", 18);
    \u0275\u0275listener("input", function Crud_ng_template_8_Template_input_input_5_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      const dt_r6 = \u0275\u0275reference(7);
      return \u0275\u0275resetView(ctx_r2.onGlobalFilter(dt_r6, $event));
    });
    \u0275\u0275elementEnd()()();
  }
}
function Crud_ng_template_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 19);
    \u0275\u0275element(2, "p-tableHeaderCheckbox");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th", 20);
    \u0275\u0275text(4, " Code ");
    \u0275\u0275element(5, "p-sortIcon", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 22);
    \u0275\u0275text(7, " Name ");
    \u0275\u0275element(8, "p-sortIcon", 23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th");
    \u0275\u0275text(10, "Image");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th", 24);
    \u0275\u0275text(12, " Price ");
    \u0275\u0275element(13, "p-sortIcon", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 26);
    \u0275\u0275text(15, " Category ");
    \u0275\u0275element(16, "p-sortIcon", 27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "th", 28);
    \u0275\u0275text(18, " Reviews ");
    \u0275\u0275element(19, "p-sortIcon", 29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "th", 30);
    \u0275\u0275text(21, " Status ");
    \u0275\u0275element(22, "p-sortIcon", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275element(23, "th", 32);
    \u0275\u0275elementEnd();
  }
}
function Crud_ng_template_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td", 19);
    \u0275\u0275element(2, "p-tableCheckbox", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 32);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 34);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275element(8, "img", 35);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "td");
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "td")(15, "p-rating", 36);
    \u0275\u0275twoWayListener("ngModelChange", function Crud_ng_template_12_Template_p_rating_ngModelChange_15_listener($event) {
      const product_r8 = \u0275\u0275restoreView(_r7).$implicit;
      \u0275\u0275twoWayBindingSet(product_r8.rating, $event) || (product_r8.rating = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "td");
    \u0275\u0275element(17, "p-tag", 37);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "td")(19, "p-button", 38);
    \u0275\u0275listener("click", function Crud_ng_template_12_Template_p_button_click_19_listener() {
      const product_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.editProduct(product_r8));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "p-button", 39);
    \u0275\u0275listener("click", function Crud_ng_template_12_Template_p_button_click_20_listener() {
      const product_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.deleteProduct(product_r8));
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const product_r8 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("value", product_r8);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(product_r8.code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(product_r8.name);
    \u0275\u0275advance(2);
    \u0275\u0275property("src", "/images/product/" + product_r8.image, \u0275\u0275sanitizeUrl)("alt", product_r8.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(11, 15, product_r8.price, "USD"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(product_r8.category);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", product_r8.rating);
    \u0275\u0275property("readonly", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", product_r8.inventoryStatus)("severity", ctx_r2.getSeverity(product_r8.inventoryStatus));
    \u0275\u0275advance(2);
    \u0275\u0275property("rounded", true)("outlined", true);
    \u0275\u0275advance();
    \u0275\u0275property("rounded", true)("outlined", true);
  }
}
function Crud_ng_template_15_img_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 65);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("src", "/images/product/" + ctx_r2.product.image, \u0275\u0275sanitizeUrl)("alt", ctx_r2.product.image);
  }
}
function Crud_ng_template_15_small_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 66);
    \u0275\u0275text(1, "Name is required.");
    \u0275\u0275elementEnd();
  }
}
function Crud_ng_template_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 40);
    \u0275\u0275template(1, Crud_ng_template_15_img_1_Template, 1, 2, "img", 41);
    \u0275\u0275elementStart(2, "div")(3, "label", 42);
    \u0275\u0275text(4, "Name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "input", 43);
    \u0275\u0275twoWayListener("ngModelChange", function Crud_ng_template_15_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.product.name, $event) || (ctx_r2.product.name = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, Crud_ng_template_15_small_6_Template, 2, 0, "small", 44);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div")(8, "label", 45);
    \u0275\u0275text(9, "Description");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "textarea", 46);
    \u0275\u0275twoWayListener("ngModelChange", function Crud_ng_template_15_Template_textarea_ngModelChange_10_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.product.description, $event) || (ctx_r2.product.description = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div")(12, "label", 47);
    \u0275\u0275text(13, "Inventory Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "p-select", 48);
    \u0275\u0275twoWayListener("ngModelChange", function Crud_ng_template_15_Template_p_select_ngModelChange_14_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.product.inventoryStatus, $event) || (ctx_r2.product.inventoryStatus = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div")(16, "span", 49);
    \u0275\u0275text(17, "Category");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "div", 50)(19, "div", 51)(20, "p-radiobutton", 52);
    \u0275\u0275twoWayListener("ngModelChange", function Crud_ng_template_15_Template_p_radiobutton_ngModelChange_20_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.product.category, $event) || (ctx_r2.product.category = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "label", 53);
    \u0275\u0275text(22, "Accessories");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div", 51)(24, "p-radiobutton", 54);
    \u0275\u0275twoWayListener("ngModelChange", function Crud_ng_template_15_Template_p_radiobutton_ngModelChange_24_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.product.category, $event) || (ctx_r2.product.category = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "label", 55);
    \u0275\u0275text(26, "Clothing");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "div", 51)(28, "p-radiobutton", 56);
    \u0275\u0275twoWayListener("ngModelChange", function Crud_ng_template_15_Template_p_radiobutton_ngModelChange_28_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.product.category, $event) || (ctx_r2.product.category = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "label", 57);
    \u0275\u0275text(30, "Electronics");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "div", 51)(32, "p-radiobutton", 58);
    \u0275\u0275twoWayListener("ngModelChange", function Crud_ng_template_15_Template_p_radiobutton_ngModelChange_32_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.product.category, $event) || (ctx_r2.product.category = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "label", 59);
    \u0275\u0275text(34, "Fitness");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(35, "div", 50)(36, "div", 60)(37, "label", 61);
    \u0275\u0275text(38, "Price");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "p-inputnumber", 62);
    \u0275\u0275twoWayListener("ngModelChange", function Crud_ng_template_15_Template_p_inputnumber_ngModelChange_39_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.product.price, $event) || (ctx_r2.product.price = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(40, "div", 60)(41, "label", 63);
    \u0275\u0275text(42, "Quantity");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "p-inputnumber", 64);
    \u0275\u0275twoWayListener("ngModelChange", function Crud_ng_template_15_Template_p_inputnumber_ngModelChange_43_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.product.quantity, $event) || (ctx_r2.product.quantity = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.product.image);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.product.name);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.submitted && !ctx_r2.product.name);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.product.description);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.product.inventoryStatus);
    \u0275\u0275property("options", ctx_r2.statuses);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.product.category);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.product.category);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.product.category);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.product.category);
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.product.price);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.product.quantity);
  }
}
function Crud_ng_template_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 67);
    \u0275\u0275listener("click", function Crud_ng_template_17_Template_p_button_click_0_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.hideDialog());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "p-button", 68);
    \u0275\u0275listener("click", function Crud_ng_template_17_Template_p_button_click_1_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.saveProduct());
    });
    \u0275\u0275elementEnd();
  }
}
var Crud = class _Crud {
  productService;
  messageService;
  confirmationService;
  filterFields = ["code", "name", "description", "price", "quantity", "inventoryStatus", "category", "rating", "image"];
  productDialog = false;
  products = signal([]);
  product;
  selectedProducts;
  submitted = false;
  statuses;
  dt;
  exportColumns;
  cols;
  constructor(productService, messageService, confirmationService) {
    this.productService = productService;
    this.messageService = messageService;
    this.confirmationService = confirmationService;
  }
  exportCSV() {
    this.dt.exportCSV();
  }
  ngOnInit() {
    this.loadDemoData();
  }
  loadDemoData() {
    this.productService.getProducts().then((data) => {
      this.products.set(data);
    });
    this.statuses = [
      { label: "INSTOCK", value: "instock" },
      { label: "LOWSTOCK", value: "lowstock" },
      { label: "OUTOFSTOCK", value: "outofstock" }
    ];
    this.cols = [
      {
        field: "code",
        header: "Code",
        customExportHeader: "Product Code"
      },
      { field: "name", header: "Name" },
      { field: "image", header: "Image" },
      { field: "price", header: "Price" },
      { field: "category", header: "Category" }
    ];
    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field
    }));
  }
  onGlobalFilter(table, event) {
    table.filterGlobal(event.target.value, "contains");
  }
  openNew() {
    this.product = {};
    this.submitted = false;
    this.productDialog = true;
  }
  editProduct(product) {
    this.product = __spreadValues({}, product);
    this.productDialog = true;
  }
  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete the selected products?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.products.set(this.products().filter((val) => !this.selectedProducts?.includes(val)));
        this.selectedProducts = null;
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "Products Deleted",
          life: 3e3
        });
      }
    });
  }
  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }
  deleteProduct(product) {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete " + product.name + "?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.products.set(this.products().filter((val) => val.id !== product.id));
        this.product = {};
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "Product Deleted",
          life: 3e3
        });
      }
    });
  }
  findIndexById(id) {
    let index = -1;
    for (let i = 0; i < this.products().length; i++) {
      if (this.products()[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }
  createId() {
    let id = "";
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
  getSeverity(status) {
    switch (status) {
      case "INSTOCK":
        return "success";
      case "LOWSTOCK":
        return "warn";
      case "OUTOFSTOCK":
        return "danger";
      default:
        return "info";
    }
  }
  saveProduct() {
    this.submitted = true;
    let _products = this.products();
    if (this.product.name?.trim()) {
      if (this.product.id) {
        _products[this.findIndexById(this.product.id)] = this.product;
        this.products.set([..._products]);
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "Product Updated",
          life: 3e3
        });
      } else {
        this.product.id = this.createId();
        this.product.image = "product-placeholder.svg";
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "Product Created",
          life: 3e3
        });
        this.products.set([..._products, this.product]);
      }
      this.productDialog = false;
      this.product = {};
    }
  }
  static \u0275fac = function Crud_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Crud)(\u0275\u0275directiveInject(ProductService), \u0275\u0275directiveInject(MessageService), \u0275\u0275directiveInject(ConfirmationService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Crud, selectors: [["app-crud"]], viewQuery: function Crud_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.dt = _t.first);
    }
  }, features: [\u0275\u0275ProvidersFeature([MessageService, ProductService, ConfirmationService])], decls: 20, vars: 20, consts: [["start", ""], ["end", ""], ["dt", ""], ["caption", ""], ["header", ""], ["body", ""], ["content", ""], ["footer", ""], [1, "card"], ["styleClass", "mb-12"], ["dataKey", "id", "currentPageReportTemplate", "Showing {first} to {last} of {totalRecords} products", 3, "selectionChange", "value", "rows", "columns", "paginator", "globalFilterFields", "tableStyle", "selection", "rowHover", "showCurrentPageReport", "rowsPerPageOptions"], ["header", "Product Details", 3, "visibleChange", "visible", "modal"], ["label", "New", "icon", "pi pi-plus", "severity", "secondary", 1, "mr-2", 3, "onClick"], ["severity", "secondary", "label", "Delete", "icon", "pi pi-trash", "outlined", "", 3, "onClick", "disabled"], ["label", "Export", "icon", "pi pi-upload", "severity", "secondary", 3, "onClick"], [1, "flex", "items-center", "justify-between"], [1, "m-0"], ["styleClass", "pi pi-search"], ["pInputText", "", "type", "text", "placeholder", "Search...", 3, "input"], [2, "width", "3rem"], ["pSortableColumn", "code", 2, "min-width", "16rem"], ["field", "code"], ["pSortableColumn", "name", 2, "min-width", "16rem"], ["field", "name"], ["pSortableColumn", "price", 2, "min-width", "8rem"], ["field", "price"], ["pSortableColumn", "category", 2, "min-width", "10rem"], ["field", "category"], ["pSortableColumn", "rating", 2, "min-width", "12rem"], ["field", "rating"], ["pSortableColumn", "inventoryStatus", 2, "min-width", "12rem"], ["field", "inventoryStatus"], [2, "min-width", "12rem"], [3, "value"], [2, "min-width", "16rem"], [1, "rounded", 2, "width", "64px", 3, "src", "alt"], [3, "ngModelChange", "ngModel", "readonly"], [3, "value", "severity"], ["icon", "pi pi-pencil", 1, "mr-2", 3, "click", "rounded", "outlined"], ["icon", "pi pi-trash", "severity", "danger", 3, "click", "rounded", "outlined"], [1, "flex", "flex-col", "gap-6"], ["class", "block m-auto pb-6", 3, "src", "alt", 4, "ngIf"], ["for", "name", 1, "block", "font-bold", "mb-4"], ["type", "text", "pInputText", "", "id", "name", "required", "", "autofocus", "", "fluid", "", 3, "ngModelChange", "ngModel"], ["class", "text-red-500", 4, "ngIf"], ["for", "description", 1, "block", "font-bold", "mb-4"], ["id", "description", "pTextarea", "", "required", "", "rows", "3", "cols", "20", "fluid", "", 3, "ngModelChange", "ngModel"], ["for", "inventoryStatus", 1, "block", "font-bold", "mb-4"], ["inputId", "inventoryStatus", "optionLabel", "label", "optionValue", "label", "placeholder", "Select a Status", "fluid", "", 3, "ngModelChange", "ngModel", "options"], [1, "block", "font-bold", "mb-6"], [1, "grid", "grid-cols-12", "gap-4"], [1, "flex", "items-center", "gap-2", "col-span-6"], ["id", "category1", "name", "category", "value", "Accessories", 3, "ngModelChange", "ngModel"], ["for", "category1"], ["id", "category2", "name", "category", "value", "Clothing", 3, "ngModelChange", "ngModel"], ["for", "category2"], ["id", "category3", "name", "category", "value", "Electronics", 3, "ngModelChange", "ngModel"], ["for", "category3"], ["id", "category4", "name", "category", "value", "Fitness", 3, "ngModelChange", "ngModel"], ["for", "category4"], [1, "col-span-6"], ["for", "price", 1, "block", "font-bold", "mb-4"], ["id", "price", "mode", "currency", "currency", "USD", "locale", "en-US", "fluid", "", 3, "ngModelChange", "ngModel"], ["for", "quantity", 1, "block", "font-bold", "mb-4"], ["id", "quantity", "fluid", "", 3, "ngModelChange", "ngModel"], [1, "block", "m-auto", "pb-6", 3, "src", "alt"], [1, "text-red-500"], ["label", "Cancel", "icon", "pi pi-times", "text", "", 3, "click"], ["label", "Save", "icon", "pi pi-check", 3, "click"]], template: function Crud_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 8)(1, "p-toolbar", 9);
      \u0275\u0275template(2, Crud_ng_template_2_Template, 2, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor)(4, Crud_ng_template_4_Template, 1, 0, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "p-table", 10, 2);
      \u0275\u0275twoWayListener("selectionChange", function Crud_Template_p_table_selectionChange_6_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.selectedProducts, $event) || (ctx.selectedProducts = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275template(8, Crud_ng_template_8_Template, 6, 0, "ng-template", null, 3, \u0275\u0275templateRefExtractor)(10, Crud_ng_template_10_Template, 24, 0, "ng-template", null, 4, \u0275\u0275templateRefExtractor)(12, Crud_ng_template_12_Template, 21, 18, "ng-template", null, 5, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(14, "p-dialog", 11);
      \u0275\u0275twoWayListener("visibleChange", function Crud_Template_p_dialog_visibleChange_14_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.productDialog, $event) || (ctx.productDialog = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275template(15, Crud_ng_template_15_Template, 44, 12, "ng-template", null, 6, \u0275\u0275templateRefExtractor)(17, Crud_ng_template_17_Template, 2, 0, "ng-template", null, 7, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd();
      \u0275\u0275element(19, "p-confirmdialog");
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275property("value", ctx.products())("rows", 10)("columns", ctx.cols)("paginator", true)("globalFilterFields", ctx.filterFields)("tableStyle", \u0275\u0275pureFunction0(16, _c1));
      \u0275\u0275twoWayProperty("selection", ctx.selectedProducts);
      \u0275\u0275property("rowHover", true)("showCurrentPageReport", true)("rowsPerPageOptions", \u0275\u0275pureFunction0(17, _c2));
      \u0275\u0275advance(8);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(18, _c3));
      \u0275\u0275twoWayProperty("visible", ctx.productDialog);
      \u0275\u0275property("modal", true);
      \u0275\u0275advance(5);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(19, _c3));
    }
  }, dependencies: [
    CommonModule,
    NgIf,
    CurrencyPipe,
    TableModule,
    Table,
    SortableColumn,
    SortIcon,
    TableCheckbox,
    TableHeaderCheckbox,
    FormsModule,
    DefaultValueAccessor,
    NgControlStatus,
    RequiredValidator,
    NgModel,
    ButtonModule,
    Button,
    RippleModule,
    ToastModule,
    ToolbarModule,
    Toolbar,
    RatingModule,
    Rating,
    InputTextModule,
    InputText,
    TextareaModule,
    Textarea,
    SelectModule,
    Select,
    RadioButtonModule,
    RadioButton,
    InputNumberModule,
    InputNumber,
    DialogModule,
    Dialog,
    TagModule,
    Tag,
    InputIconModule,
    InputIcon,
    IconFieldModule,
    IconField,
    ConfirmDialogModule,
    ConfirmDialog
  ], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Crud, { className: "Crud", filePath: "src/app/pages/crud/crud.ts", lineNumber: 218 });
})();

// src/app/pages/empty/empty.ts
var Empty = class _Empty {
  static \u0275fac = function Empty_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Empty)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Empty, selectors: [["app-empty"]], decls: 7, vars: 0, consts: [[1, "grid", "grid-cols-12", "gap-4"], [1, "col-span-12"], [1, "card"], [1, "font-semibold", "text-xl", "mb-4"]], template: function Empty_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
      \u0275\u0275text(4, "Empty Page");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p");
      \u0275\u0275text(6, "Use this page to start from scratch and place your custom content.");
      \u0275\u0275elementEnd()()()();
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Empty, { className: "Empty", filePath: "src/app/pages/empty/empty.ts", lineNumber: 15 });
})();

// src/app/pages/aboutus/aboutus.ts
var _c02 = () => ({ backgroundColor: "rgba(0,0,0,0.7)" });
function AboutUs_div_19_div_3_a_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 23);
    \u0275\u0275element(1, "i", 24);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const socialIcon_r3 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275classMap(socialIcon_r3.additionalClasses);
    \u0275\u0275property("ngClass", socialIcon_r3.iconClass);
  }
}
function AboutUs_div_19_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17)(1, "div", 18)(2, "span", 19);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 20);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 21);
    \u0275\u0275template(7, AboutUs_div_19_div_3_a_7_Template, 2, 3, "a", 22);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const member_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("ngStyle", \u0275\u0275pureFunction0(4, _c02));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(member_r4.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(member_r4.role);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", member_r4.socialIcons);
  }
}
function AboutUs_div_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 13)(1, "div", 14);
    \u0275\u0275listener("mouseenter", function AboutUs_div_19_Template_div_mouseenter_1_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.setVisibleMember(1));
    })("mouseleave", function AboutUs_div_19_Template_div_mouseleave_1_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.setVisibleMember(-1));
    });
    \u0275\u0275element(2, "img", 15);
    \u0275\u0275template(3, AboutUs_div_19_div_3_Template, 8, 5, "div", 16);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const member_r4 = ctx.$implicit;
    const i_r5 = ctx.index;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("src", member_r4.image, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.visibleMember === i_r5);
  }
}
var AboutUs = class _AboutUs {
  visibleMember = -1;
  teamMembers = [
    {
      name: "Jeff Davies",
      role: "Software Developer",
      image: "/images/blocks/team/team-1.png",
      socialIcons: [
        {
          iconClass: "pi pi-twitter",
          additionalClasses: "text-surface-600 dark:text-surface-200 text-xl mr-4"
        },
        {
          iconClass: "pi pi-github",
          additionalClasses: "text-surface-600 dark:text-surface-200 text-xl mr-4"
        },
        {
          iconClass: "pi pi-facebook",
          additionalClasses: "text-surface-600 dark:text-surface-200 text-xl"
        }
      ]
    },
    {
      name: "Kristin Watson",
      role: "UI/UX Designer",
      image: "/images/blocks/team/team-2.png",
      socialIcons: [
        {
          iconClass: "pi pi-twitter",
          additionalClasses: "text-surface-600 dark:text-surface-200 text-xl mr-4"
        },
        {
          iconClass: "pi pi-github",
          additionalClasses: "text-surface-600 dark:text-surface-200 text-xl mr-4"
        },
        {
          iconClass: "pi pi-facebook",
          additionalClasses: "text-surface-600 dark:text-surface-200 text-xl"
        }
      ]
    },
    {
      name: "Jenna Williams",
      role: "Marketing Specialist",
      image: "/images/blocks/team/team-3.png",
      socialIcons: [
        {
          iconClass: "pi pi-twitter",
          additionalClasses: "text-surface-600 dark:text-surface-200 text-xl mr-4"
        },
        {
          iconClass: "pi pi-github",
          additionalClasses: "text-surface-600 dark:text-surface-200 text-xl mr-4"
        },
        {
          iconClass: "pi pi-facebook",
          additionalClasses: "text-surface-600 dark:text-surface-200 text-xl"
        }
      ]
    },
    {
      name: "Joe Clifford",
      role: "Customer Relations",
      image: "/images/blocks/team/team-4.png",
      socialIcons: [
        {
          iconClass: "pi pi-twitter",
          additionalClasses: "text-surface-600 dark:text-surface-200 text-xl mr-4"
        },
        {
          iconClass: "pi pi-github",
          additionalClasses: "text-surface-600 dark:text-surface-200 text-xl mr-4"
        },
        {
          iconClass: "pi pi-facebook",
          additionalClasses: "text-surface-600 dark:text-surface-200 text-xl"
        }
      ]
    }
  ];
  setVisibleMember(index) {
    this.visibleMember = index;
  }
  static \u0275fac = function AboutUs_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AboutUs)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AboutUs, selectors: [["app-about-us"]], decls: 20, vars: 1, consts: [[1, "card", "px-6", "py-20", "md:px-12", "lg:px-20"], [1, "flex", "flex-wrap", "mb-6"], [1, "w-full", "lg:w-6/12", "pl-0", "lg:pr-6"], ["src", "/images/blocks/about/about-1.png", "alt", "Image", 1, "w-full", "rounded"], [1, "w-full", "lg:w-6/12", "pr-0", "lg:pl-6", "mt-4", "lg:mt-0"], [1, "font-bold", "text-4xl", "mb-6", "text-surface-900", "dark:text-surface-0"], [1, "leading-normal", "mt-0", "mb-4", "p-0"], [1, "leading-normal", "my-0", "p-0"], [1, "mt-4", "md:mt-20"], [1, "block", "text-surface-900", "dark:text-surface-0", "font-bold", "text-3xl", "mb-4", "text-center"], [1, "text-center", "text-lg", "leading-normal", "mb-12"], [1, "grid", "grid-cols-12", "gap-4"], ["class", "col-span-12 md:col-span-6 lg:col-span-3 p-4", 4, "ngFor", "ngForOf"], [1, "col-span-12", "md:col-span-6", "lg:col-span-3", "p-4"], [1, "relative", "overflow-hidden", 3, "mouseenter", "mouseleave"], ["alt", "Team 2", 1, "w-full", "block", 3, "src"], ["class", "absolute top-0 left-0 h-full w-full rounded animate-fadein animate-duration-300 select-none", 3, "ngStyle", 4, "ngIf"], [1, "absolute", "top-0", "left-0", "h-full", "w-full", "rounded", "animate-fadein", "animate-duration-300", "select-none", 3, "ngStyle"], [1, "flex", "flex-col", "p-8", "h-full"], [1, "block", "font-medium", "text-white", "text-xl", "mb-4"], [1, "font-medium", "text-surface-400", "dark:text-surface-400"], [1, "mt-auto"], ["tabindex", "0", "class", "cursor-pointer text-white", 4, "ngFor", "ngForOf"], ["tabindex", "0", 1, "cursor-pointer", "text-white"], [3, "ngClass"]], template: function AboutUs_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
      \u0275\u0275element(3, "img", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div", 4)(5, "div", 5);
      \u0275\u0275text(6, "About us");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "p", 6);
      \u0275\u0275text(8, " Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "p", 6);
      \u0275\u0275text(10, " Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "p", 7);
      \u0275\u0275text(12, " Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(13, "div", 8)(14, "span", 9);
      \u0275\u0275text(15, "Our Team");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "div", 10);
      \u0275\u0275text(17, "Faucibus ornare suspendisse sed nisi. Nisl rhoncus mattis rhoncus urna neque viverra justo nec.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "div", 11);
      \u0275\u0275template(19, AboutUs_div_19_Template, 4, 2, "div", 12);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(19);
      \u0275\u0275property("ngForOf", ctx.teamMembers);
    }
  }, dependencies: [CommonModule, NgClass, NgForOf, NgIf, NgStyle], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AboutUs, { className: "AboutUs", filePath: "src/app/pages/aboutus/aboutus.ts", lineNumber: 62 });
})();

// src/app/pages/contactus/contactus.ts
var _c03 = () => ({ height: "3.5rem" });
var _c12 = () => ({ left: "1.5rem" });
function ContactUs_div_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275element(1, "i", 21);
    \u0275\u0275elementStart(2, "span", 22);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 23);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275classMap(item_r1.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r1.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r1.info);
  }
}
var ContactUs = class _ContactUs {
  layoutService;
  options;
  name = "";
  email = "";
  message = "";
  content = [
    { icon: "pi pi-fw pi-phone", title: "Phone", info: "1 (833) 597-7538" },
    {
      icon: "pi pi-fw pi-map-marker",
      title: "Our Head Office",
      info: "Churchill-laan 16 II, 1052 CD, Amsterdam"
    },
    { icon: "pi pi-fw pi-print", title: "Fax", info: "3 (833) 297-1548" }
  ];
  constructor(layoutService) {
    this.layoutService = layoutService;
  }
  get mapStyle() {
    return {
      "background-image": this.layoutService.isDarkTheme() ? "url('/images/contact/map-dark.svg')" : "url('/images/contact/map-light.svg')"
    };
  }
  static \u0275fac = function ContactUs_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ContactUs)(\u0275\u0275directiveInject(LayoutService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ContactUs, selectors: [["app-contact-us"]], decls: 29, vars: 24, consts: [[1, "grid", "grid-cols-12", "gap-4", "card", "grid-nogutter", 2, "column-gap", "2rem", "row-gap", "2rem"], [1, "col-span-12"], [1, "text-surface-900", "dark:text-surface-0", "font-bold"], [1, "col-span-12", "mt-4", "h-80", "border", "border-surface", "p-0", "w-full", "bg-cover", "rounded-border", 3, "ngStyle"], [1, "col-span-12", "mt-8"], [1, "flex", "gap-4", "px-2", "flex-col", "md:flex-row", 2, "column-gap", "2rem", "row-gap", "2rem"], ["class", "md:w-1/3 flex flex-col justify-center text-center items-center border border-surface-200 dark:border-surface-700 py-8 px-6 rounded", 4, "ngFor", "ngForOf"], [1, "grid", "gap-4", "flex-col", "md:flex-row", "grid-nogutter", "mt-12", 2, "row-gap", "2rem", "column-gap", "2rem"], [1, "col-span-6", "flex", "flex-col"], ["for", "name", 1, "block", "font-bold", "text-surface-500"], [1, "mt-2"], [1, "pi", "pi-user"], ["pInputText", "", "id", "name", "type", "text", "placeholder", "Name", 1, "w-full", "!pl-16", "text-surface-900", "dark:text-surface-0", "font-semibold", 3, "ngModelChange", "ngModel"], ["for", "email", 1, "block", "font-bold", "text-surface-500"], [1, "pi", "pi-envelope"], ["pInputText", "", "id", "email", "type", "text", "placeholder", "Email", 1, "w-full", "!pl-16", "text-surface-900", "dark:text-surface-0", "font-semibold", 3, "ngModelChange", "ngModel"], [1, "col-span-12", "flex", "flex-col"], ["for", "message", 1, "block", "font-bold", "text-surface-500"], ["id", "message", "rows", "5", "pTextarea", "", 1, "w-full", "mt-2", "border-surface", "p-12", "text-surface-900", "dark:text-surface-0", "font-semibold", "rounded-border", 3, "ngModelChange", "autoResize", "ngModel"], ["pButton", "", "label", "Send Message", 1, "p-button-primary", "ml-auto", "mt-4", "rounded-border"], [1, "md:w-1/3", "flex", "flex-col", "justify-center", "text-center", "items-center", "border", "border-surface-200", "dark:border-surface-700", "py-8", "px-6", "rounded"], [1, "pi", "pi-fw", "text-2xl", "text-primary"], [1, "text-surface-900", "dark:text-surface-0", "font-bold", "mt-6", "mb-1"], [1, "text-surface-500", "dark:text-surface-300"]], template: function ContactUs_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "p", 2);
      \u0275\u0275text(3, "Contact Us");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(4, "div", 3);
      \u0275\u0275elementStart(5, "div", 4)(6, "div", 5);
      \u0275\u0275template(7, ContactUs_div_7_Template, 6, 4, "div", 6);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 4)(9, "p", 2);
      \u0275\u0275text(10, "Send Us Email");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "div", 7)(12, "div", 8)(13, "label", 9);
      \u0275\u0275text(14, "Name");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "p-icon-field", 10);
      \u0275\u0275element(16, "p-inputicon", 11);
      \u0275\u0275elementStart(17, "input", 12);
      \u0275\u0275twoWayListener("ngModelChange", function ContactUs_Template_input_ngModelChange_17_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.name, $event) || (ctx.name = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(18, "div", 8)(19, "label", 13);
      \u0275\u0275text(20, "Email Address");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "p-icon-field", 10);
      \u0275\u0275element(22, "p-inputicon", 14);
      \u0275\u0275elementStart(23, "input", 15);
      \u0275\u0275twoWayListener("ngModelChange", function ContactUs_Template_input_ngModelChange_23_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.email, $event) || (ctx.email = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(24, "div", 16)(25, "label", 17);
      \u0275\u0275text(26, "Message");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "textarea", 18);
      \u0275\u0275twoWayListener("ngModelChange", function ContactUs_Template_textarea_ngModelChange_27_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.message, $event) || (ctx.message = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275element(28, "button", 19);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275property("ngStyle", ctx.mapStyle);
      \u0275\u0275advance(3);
      \u0275\u0275property("ngForOf", ctx.content);
      \u0275\u0275advance(8);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(18, _c03));
      \u0275\u0275advance();
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(19, _c12));
      \u0275\u0275advance();
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(20, _c03));
      \u0275\u0275twoWayProperty("ngModel", ctx.name);
      \u0275\u0275advance(4);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(21, _c03));
      \u0275\u0275advance();
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(22, _c12));
      \u0275\u0275advance();
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(23, _c03));
      \u0275\u0275twoWayProperty("ngModel", ctx.email);
      \u0275\u0275advance(4);
      \u0275\u0275property("autoResize", true);
      \u0275\u0275twoWayProperty("ngModel", ctx.message);
    }
  }, dependencies: [CommonModule, NgForOf, NgStyle, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, InputTextModule, InputText, TextareaModule, Textarea, ButtonModule, ButtonDirective, IconField, InputIcon], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ContactUs, { className: "ContactUs", filePath: "src/app/pages/contactus/contactus.ts", lineNumber: 59 });
})();

// src/app/pages/help/help.ts
var _c04 = () => ({ borderRadius: "2rem" });
var Help = class _Help {
  static \u0275fac = function Help_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Help)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Help, selectors: [["app-help"]], decls: 125, vars: 3, consts: [[1, "card"], [1, "relative", "overflow-hidden", "h-80", "bg-primary", "text-primary-contrast", "flex", "flex-col", "items-center", "justify-center", "rounded", "mb-20"], ["xmlns", "http://www.w3.org/2000/svg", "viewBox", "0 0 1440 320", 1, "absolute", "w-full", "top-0", "left-0"], ["fill", "var(--p-primary-600)", "fillOpacity", "1", "d", "M0,64L48,90.7C96,117,192,171,288,208C384,245,480,267,576,256C672,245,768,203,864,165.3C960,128,1056,96,1152,74.7C1248,53,1344,43,1392,37.3L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"], [1, "font-bold", "mb-8", "text-4xl", "z-10"], [1, "w-9/12", "md:w-6/12"], [1, "pi", "pi-search"], ["pInputText", "", "id", "name", "type", "text", "placeholder", "Search", 1, "w-full"], [1, "grid", "grid-cols-12", "gap-4", "mb-8"], [1, "col-span-12", "md:col-span-4", "mb-8"], [1, "flex", "flex-col", "items-center"], [1, "inline-flex", "items-center", "justify-center", "rounded-full", "w-20", "h-20", "bg-primary-100", "mb-8"], [1, "pi", "pi-power-off", "!text-4xl", "text-primary-700"], [1, "text-2xl", "mb-4", "font-medium"], [1, "list-none", "m-0", "p-0", "text-center"], [1, "leading-normal", "mb-1"], [1, "text-surface-500", "dark:text-surface-400", "hover:text-primary", "cursor-pointer"], [1, "leading-normal", "mb-4"], [1, "text-primary", "hover:underline", "cursor-pointer", "font-medium"], [1, "pi", "pi-arrows-h", "!text-4xl", "text-primary-700"], [1, "pi", "pi-user", "!text-4xl", "text-primary-700"], [1, "pi", "pi-money-bill", "!text-4xl", "text-primary-700"], [1, "pi", "pi-database", "!text-4xl", "text-primary-700"], [1, "pi", "pi-lock", "!text-4xl", "text-primary-700"]], template: function Help_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div")(1, "div", 0)(2, "div", 1);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(3, "svg", 2);
      \u0275\u0275element(4, "path", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(5, "div", 4);
      \u0275\u0275text(6, "How can we help?");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "p-icon-field", 5);
      \u0275\u0275element(8, "p-inputicon", 6)(9, "input", 7);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "div", 8)(11, "div", 9)(12, "div", 10)(13, "span", 11);
      \u0275\u0275element(14, "i", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "div", 13);
      \u0275\u0275text(16, "Getting Started");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "ul", 14)(18, "li", 15)(19, "a", 16);
      \u0275\u0275text(20, "Lorem ipsum dolor");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(21, "li", 15)(22, "a", 16);
      \u0275\u0275text(23, "Consectetur adipiscing elit");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(24, "li", 17)(25, "a", 16);
      \u0275\u0275text(26, "Sed do eiusmod tempor");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(27, "li")(28, "a", 18);
      \u0275\u0275text(29, "View all");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(30, "div", 9)(31, "div", 10)(32, "span", 11);
      \u0275\u0275element(33, "i", 19);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "div", 13);
      \u0275\u0275text(35, "Transactions");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "ul", 14)(37, "li", 15)(38, "a", 16);
      \u0275\u0275text(39, "Lorem ipsum dolor");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(40, "li", 15)(41, "a", 16);
      \u0275\u0275text(42, "Consectetur adipiscing elit");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(43, "li", 17)(44, "a", 16);
      \u0275\u0275text(45, "Sed do eiusmod tempor");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(46, "li")(47, "a", 18);
      \u0275\u0275text(48, "View all");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(49, "div", 9)(50, "div", 10)(51, "span", 11);
      \u0275\u0275element(52, "i", 20);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(53, "div", 13);
      \u0275\u0275text(54, "Profile");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(55, "ul", 14)(56, "li", 15)(57, "a", 16);
      \u0275\u0275text(58, "Lorem ipsum dolor");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(59, "li", 15)(60, "a", 16);
      \u0275\u0275text(61, "Consectetur adipiscing elit");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(62, "li", 17)(63, "a", 16);
      \u0275\u0275text(64, "Sed do eiusmod tempor");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(65, "li")(66, "a", 18);
      \u0275\u0275text(67, "View all");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(68, "div", 9)(69, "div", 10)(70, "span", 11);
      \u0275\u0275element(71, "i", 21);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(72, "div", 13);
      \u0275\u0275text(73, "Billing");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(74, "ul", 14)(75, "li", 15)(76, "a", 16);
      \u0275\u0275text(77, "Lorem ipsum dolor");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(78, "li", 15)(79, "a", 16);
      \u0275\u0275text(80, "Consectetur adipiscing elit");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(81, "li", 17)(82, "a", 16);
      \u0275\u0275text(83, "Sed do eiusmod tempor");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(84, "li")(85, "a", 18);
      \u0275\u0275text(86, "View all");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(87, "div", 9)(88, "div", 10)(89, "span", 11);
      \u0275\u0275element(90, "i", 22);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(91, "div", 13);
      \u0275\u0275text(92, "Integrations");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(93, "ul", 14)(94, "li", 15)(95, "a", 16);
      \u0275\u0275text(96, "Lorem ipsum dolor");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(97, "li", 15)(98, "a", 16);
      \u0275\u0275text(99, "Consectetur adipiscing elit");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(100, "li", 17)(101, "a", 16);
      \u0275\u0275text(102, "Sed do eiusmod tempor");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(103, "li")(104, "a", 18);
      \u0275\u0275text(105, "View all");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(106, "div", 9)(107, "div", 10)(108, "span", 11);
      \u0275\u0275element(109, "i", 23);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(110, "div", 13);
      \u0275\u0275text(111, "Security");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(112, "ul", 14)(113, "li", 15)(114, "a", 16);
      \u0275\u0275text(115, "Lorem ipsum dolor");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(116, "li", 15)(117, "a", 16);
      \u0275\u0275text(118, "Consectetur adipiscing elit");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(119, "li", 17)(120, "a", 16);
      \u0275\u0275text(121, "Sed do eiusmod tempor");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(122, "li")(123, "a", 18);
      \u0275\u0275text(124, "View all");
      \u0275\u0275elementEnd()()()()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(9);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(2, _c04));
    }
  }, dependencies: [IconFieldModule, IconField, InputIconModule, InputIcon, InputTextModule, InputText], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Help, { className: "Help", filePath: "src/app/pages/help/help.ts", lineNumber: 166 });
})();

// src/app/pages/invoice/invoice.ts
var _c05 = () => ({ borderCollapse: "collapse", tableLayout: "auto" });
var Invoice = class _Invoice {
  static \u0275fac = function Invoice_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Invoice)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Invoice, selectors: [["app-invoice"]], decls: 96, vars: 3, consts: [[1, "card", "!py-20", "px-12", "md:px-20", "overflow-auto"], [1, "flex", "flex-col", "items-start", "md:flex-row", "md:items-center", "md:justify-between", "border-b", "border-surface-200", "dark:border-surface-700", "pb-8", "min-w-max"], [1, "flex", "flex-col"], ["width", "48", "height", "50", "viewBox", "0 0 48 50", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["fillRule", "evenodd", "clipRule", "evenodd", "d", "M33.1548 9.65956L23.9913 4.86169L5.54723 14.5106L0.924465 12.0851L23.9913 0L37.801 7.23403L33.1548 9.65956ZM23.9931 19.3085L42.4255 9.65955L47.0717 12.0851L23.9931 24.1595L10.1952 16.9361L14.8297 14.5106L23.9931 19.3085ZM4.6345 25.8937L0 23.4681V37.9149L23.0669 50V45.1489L4.6345 35.4894V25.8937ZM18.4324 28.2658L0 18.6169V13.7658L23.0669 25.8403V40.2977L18.4324 37.8615V28.2658ZM38.7301 23.468V18.6169L24.9205 25.8403V49.9999L29.555 47.5743V28.2659L38.7301 23.468ZM43.3546 35.4892V16.1914L48.0008 13.7659V37.9148L34.1912 45.1488V40.2977L43.3546 35.4892Z", "fill", "var(--primary-color)"], [1, "my-4", "text-4xl", "font-bold", "text-surface-900", "dark:text-surface-0"], [1, "mb-2"], [1, "flex", "flex-col", "mt-8", "md:mt-0"], [1, "text-2xl", "font-semibold", "text-left", "md:text-right", "mb-4"], [1, "flex", "justify-between", "items-center", "mb-2"], [1, "font-semibold", "mr-12"], [1, "flex", "justify-between", "items-center"], [1, "mt-8", "mb-20", "flex", "flex-col"], [1, "mb-4", "text-2xl", "font-medium"], [1, "overflow-x-auto"], [1, "w-full"], [1, "text-left", "font-semibold", "py-4", "border-b", "border-surface-200", "dark:border-surface-700", "whitespace-nowrap"], [1, "text-right", "font-semibold", "py-4", "border-b", "border-surface-200", "dark:border-surface-700", "whitespace-nowrap", "px-4"], [1, "text-right", "font-semibold", "py-4", "border-b", "border-surface-200", "dark:border-surface-700", "whitespace-nowrap"], [1, "text-left", "py-4", "border-b", "border-surface-200", "dark:border-surface-700", "whitespace-nowrap"], [1, "text-right", "py-4", "border-b", "border-surface-200", "dark:border-surface-700", "px-4"], [1, "text-right", "py-4", "border-b", "border-surface-200", "dark:border-surface-700"], [1, "flex", "flex-col", "md:flex-row", "md:items-start", "md:justify-between", "mt-20"], [1, "font-semibold", "mb-4", "md:mb-0"]], template: function Invoice_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(3, "svg", 3);
      \u0275\u0275element(4, "path", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(5, "div", 5);
      \u0275\u0275text(6, "YOUR COMPANY");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "span", 6);
      \u0275\u0275text(8, "9137 3rd Lane California City");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "span");
      \u0275\u0275text(10, "CA 93504, U.S.A.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(11, "div", 7)(12, "div", 8);
      \u0275\u0275text(13, "INVOICE");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "div", 2)(15, "div", 9)(16, "span", 10);
      \u0275\u0275text(17, "DATE");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "span");
      \u0275\u0275text(19, "30/08/2019");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(20, "div", 9)(21, "span", 10);
      \u0275\u0275text(22, "INVOICE #");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "span");
      \u0275\u0275text(24, "8523");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(25, "div", 11)(26, "span", 10);
      \u0275\u0275text(27, "CUSTOMER ID");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "span");
      \u0275\u0275text(29, "C1613");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(30, "div", 12)(31, "div", 13);
      \u0275\u0275text(32, "BILL TO");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "span", 6);
      \u0275\u0275text(34, "Claire Williams, 148 Hope Lane");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(35, "span");
      \u0275\u0275text(36, "Palo Alto, CA 94304.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(37, "div", 14)(38, "table", 15)(39, "thead")(40, "tr")(41, "th", 16);
      \u0275\u0275text(42, "Description");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(43, "th", 17);
      \u0275\u0275text(44, "Quantity");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(45, "th", 17);
      \u0275\u0275text(46, "Unit Price");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "th", 18);
      \u0275\u0275text(48, "Line Total");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(49, "tbody")(50, "tr")(51, "td", 19);
      \u0275\u0275text(52, "Green T-Shirt");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(53, "td", 20);
      \u0275\u0275text(54, "1");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(55, "td", 20);
      \u0275\u0275text(56, "$49.00");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(57, "td", 21);
      \u0275\u0275text(58, "$49.00");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(59, "tr")(60, "td", 19);
      \u0275\u0275text(61, "Game Controller");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(62, "td", 20);
      \u0275\u0275text(63, "2");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(64, "td", 20);
      \u0275\u0275text(65, "$99.00");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(66, "td", 21);
      \u0275\u0275text(67, "$198.00");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(68, "tr")(69, "td", 19);
      \u0275\u0275text(70, "Mini Speakers");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(71, "td", 20);
      \u0275\u0275text(72, "1");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(73, "td", 20);
      \u0275\u0275text(74, "$85.00");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(75, "td", 21);
      \u0275\u0275text(76, "$85.00");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(77, "div", 22)(78, "div", 23);
      \u0275\u0275text(79, "NOTES");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(80, "div", 2)(81, "div", 9)(82, "span", 10);
      \u0275\u0275text(83, "SUBTOTAL");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(84, "span");
      \u0275\u0275text(85, "$332.00");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(86, "div", 9)(87, "span", 10);
      \u0275\u0275text(88, "VAT #");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(89, "span");
      \u0275\u0275text(90, "0");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(91, "div", 11)(92, "span", 10);
      \u0275\u0275text(93, "TOTAL");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(94, "span");
      \u0275\u0275text(95, "$332.00");
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(38);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(2, _c05));
    }
  }, dependencies: [CommonModule], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Invoice, { className: "Invoice", filePath: "src/app/pages/invoice/invoice.ts", lineNumber: 107 });
})();

// src/app/pages/pages.routes.ts
var pages_routes_default = [
  { path: "aboutus", data: { breadcrumb: "About" }, component: AboutUs },
  {
    path: "documentation",
    data: { breadcrumb: "Documentation" },
    component: Documentation
  },
  { path: "contact", data: { breadcrumb: "Contact" }, component: ContactUs },
  { path: "crud", data: { breadcrumb: "Crud" }, component: Crud },
  { path: "empty", data: { breadcrumb: "Empty" }, component: Empty },
  { path: "help", data: { breadcrumb: "Help" }, component: Help },
  { path: "invoice", data: { breadcrumb: "Invoice" }, component: Invoice },
  { path: "**", redirectTo: "/notfound" }
];
export {
  pages_routes_default as default
};
//# sourceMappingURL=chunk-PKD4P4NG.js.map
