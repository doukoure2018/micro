import {
  Editor,
  EditorModule
} from "./chunk-LEUN6ZA4.js";
import {
  FileUpload,
  FileUploadModule
} from "./chunk-ZNXRKGHP.js";
import {
  Fluid,
  FluidModule
} from "./chunk-KPJXCGM6.js";
import {
  ToggleSwitch,
  ToggleSwitchModule
} from "./chunk-BVB72Z3E.js";
import "./chunk-CSEZIGTY.js";
import "./chunk-WQ2EPPBK.js";
import {
  Chip,
  ChipModule
} from "./chunk-SN3HAAMO.js";
import {
  Select,
  SelectModule
} from "./chunk-UQSIOFSP.js";
import "./chunk-OCW7T434.js";
import "./chunk-V6CKOH3G.js";
import "./chunk-DBPX6ILC.js";
import "./chunk-WIQZFAVH.js";
import "./chunk-CCBQFN2J.js";
import "./chunk-36C7KO53.js";
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
  ButtonDirective,
  ButtonIcon,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import {
  Ripple,
  RippleModule
} from "./chunk-AP3OAIHW.js";
import "./chunk-NQNBRQ7H.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-3HTR5OU7.js";
import "./chunk-BMYIFZHZ.js";
import "./chunk-W3K3GK4Z.js";
import {
  CommonModule,
  NgForOf,
  NgIf
} from "./chunk-SQQPVFHK.js";
import {
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
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
import "./chunk-4MWRP73S.js";

// src/app/pages/ecommerce/newproduct.ts
var _c0 = ["buttonEl"];
var _c1 = () => ({ height: "250px" });
var _c2 = () => ({ cursor: "copy" });
var _c3 = () => ({ padding: "1px" });
var _c4 = () => ({ "border-radius": "20px" });
function NewProduct_ng_template_19_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 38);
    \u0275\u0275element(1, "i", 39);
    \u0275\u0275elementStart(2, "span", 40);
    \u0275\u0275text(3, "Drop or select a cover image");
    \u0275\u0275elementEnd()();
  }
}
function NewProduct_ng_template_19_div_2_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 43);
    \u0275\u0275listener("mouseenter", function NewProduct_ng_template_19_div_2_div_1_Template_div_mouseenter_0_listener() {
      const file_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r5 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r5.onImageMouseOver(file_r5));
    })("mouseleave", function NewProduct_ng_template_19_div_2_div_1_Template_div_mouseleave_0_listener() {
      const file_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r5 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r5.onImageMouseLeave(file_r5));
    });
    \u0275\u0275elementStart(1, "div", 44);
    \u0275\u0275element(2, "img", 45);
    \u0275\u0275elementStart(3, "button", 46, 2);
    \u0275\u0275listener("click", function NewProduct_ng_template_19_div_2_div_1_Template_button_click_3_listener($event) {
      const file_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r5 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r5.removeImage($event, file_r5));
    });
    \u0275\u0275element(5, "i", 47);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const file_r5 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(5, _c3));
    \u0275\u0275advance();
    \u0275\u0275property("src", file_r5.objectURL, \u0275\u0275sanitizeUrl)("alt", file_r5.name);
    \u0275\u0275advance();
    \u0275\u0275property("id", file_r5.name);
  }
}
function NewProduct_ng_template_19_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 41);
    \u0275\u0275template(1, NewProduct_ng_template_19_div_2_div_1_Template, 6, 6, "div", 42);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r5 = \u0275\u0275nextContext(2);
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(3, _c2));
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r5.product.images);
  }
}
function NewProduct_ng_template_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 35);
    \u0275\u0275listener("click", function NewProduct_ng_template_19_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r2);
      \u0275\u0275nextContext();
      const fileUploader_r3 = \u0275\u0275reference(18);
      return \u0275\u0275resetView(fileUploader_r3.advancedFileInput.nativeElement.click());
    });
    \u0275\u0275template(1, NewProduct_ng_template_19_div_1_Template, 4, 0, "div", 36)(2, NewProduct_ng_template_19_div_2_Template, 2, 4, "div", 37);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r5 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r5.product.images.length);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r5.product.images.length);
  }
}
function NewProduct_p_chip_36_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-chip", 48)(1, "span", 49);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 50);
    \u0275\u0275listener("click", function NewProduct_p_chip_36_Template_span_click_3_listener() {
      const tag_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r5 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r5.onChipRemove(tag_r8));
    });
    \u0275\u0275element(4, "i", 51);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const tag_r8 = ctx.$implicit;
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(3, _c4));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(tag_r8);
  }
}
function NewProduct_div_46_i_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 54);
  }
}
function NewProduct_div_46_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 52);
    \u0275\u0275listener("click", function NewProduct_div_46_Template_div_click_0_listener() {
      const color_r10 = \u0275\u0275restoreView(_r9).$implicit;
      const ctx_r5 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r5.onColorSelect(color_r10.name));
    });
    \u0275\u0275template(1, NewProduct_div_46_i_1_Template, 1, 0, "i", 53);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const color_r10 = ctx.$implicit;
    const ctx_r5 = \u0275\u0275nextContext();
    \u0275\u0275classMap(color_r10.background);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r5.product.colors.indexOf(color_r10.name) !== -1);
  }
}
var NewProduct = class _NewProduct {
  buttonEl;
  text = "";
  categoryOptions = ["Sneakers", "Apparel", "Socks"];
  colorOptions = [
    { name: "Black", background: "bg-gray-900" },
    { name: "Orange", background: "bg-orange-500" },
    { name: "Navy", background: "bg-blue-500" }
  ];
  product = {
    name: "",
    price: "",
    code: "",
    sku: "",
    status: "Draft",
    tags: ["Nike", "Sneaker"],
    category: "Sneakers",
    colors: ["Blue"],
    stock: "Sneakers",
    inStock: true,
    description: "",
    images: []
  };
  uploadedFiles = [];
  showRemove = false;
  onChipRemove(item) {
    this.product.tags = this.product.tags.filter((i) => i !== item);
  }
  onColorSelect(color) {
    this.product.colors.indexOf(color) == -1 ? this.product.colors.push(color) : this.product.colors.splice(this.product.colors.indexOf(color), 1);
  }
  onUpload(event) {
    for (let file of event.files) {
      this.product.images.push(file);
    }
  }
  onImageMouseOver(file) {
    this.buttonEl.toArray().forEach((el) => {
      el.nativeElement.id === file.name ? el.nativeElement.style.display = "flex" : null;
    });
  }
  onImageMouseLeave(file) {
    this.buttonEl.toArray().forEach((el) => {
      el.nativeElement.id === file.name ? el.nativeElement.style.display = "none" : null;
    });
  }
  removeImage(event, file) {
    event.stopPropagation();
    this.product.images = this.product.images.filter((i) => i !== file);
  }
  static \u0275fac = function NewProduct_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NewProduct)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NewProduct, selectors: [["app-new-product"]], viewQuery: function NewProduct_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.buttonEl = _t);
    }
  }, decls: 54, vars: 18, consts: [["fileUploader", ""], ["content", ""], ["buttonEl", ""], [1, "card"], [1, "block", "text-surface-900", "dark:text-surface-0", "font-bold", "text-xl", "mb-6"], [1, "grid", "grid-cols-12", "gap-4", "flex-wrap"], [1, "col-span-12", "lg:col-span-8"], [1, "grid", "grid-cols-12", "gap-4"], [1, "col-span-12"], ["pInputText", "", "type", "text", "placeholder", "Product Name", "label", "Product Name", 3, "ngModelChange", "ngModel"], [1, "col-span-12", "lg:col-span-4"], ["pInputText", "", "type", "text", "placeholder", "Price", "label", "Price", 3, "ngModelChange", "ngModel"], ["pInputText", "", "type", "text", "placeholder", "Product Code", "label", "Product Code", 3, "ngModelChange", "ngModel"], ["pInputText", "", "type", "text", "placeholder", "Product SKU", "label", "SKU", 3, "ngModelChange", "ngModel"], [3, "ngModelChange", "ngModel"], [1, "col-span-12", "mt-4"], ["name", "demo[]", "url", "./upload.php", "accept", "image/*", "styleClass", "border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 p-0 rounded h-80", 3, "onUpload", "onSelect", "customUpload", "multiple", "showUploadButton", "showCancelButton", "auto"], [1, "col-span-12", "lg:col-span-4", "flex", "flex-col", "gap-y-4"], [1, "border", "border-surface-200", "dark:border-surface-700", "rounded"], [1, "text-surface-900", "dark:text-surface-0", "font-bold", "block", "border-b", "border-surface-200", "dark:border-surface-700", "p-4"], [1, "p-4"], [1, "bg-surface-100", "dark:bg-surface-700", "py-2", "px-4", "flex", "items-center", "rounded"], [1, "text-black/90", "dark:!text-surface-0", "font-bold", "mr-4"], [1, "text-black/60", "dark:!text-surface-0", "font-semibold"], ["pButton", "", "pRipple", "", "type", "button", "icon", "pi pi-fw pi-pencil", "text", "", "rounded", "", 1, "ml-auto"], [1, "p-4", "flex", "flex-wrap", "gap-1"], ["styleClass", "mr-2 py-2 px-4 text-surface-900 dark:text-surface-0 font-bold bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700", 3, "style", 4, "ngFor", "ngForOf"], ["placeholder", "Select a category", 3, "ngModelChange", "options", "ngModel"], [1, "p-4", "flex"], ["class", "w-8 h-8 mr-2 border border-surface-200 dark:border-surface-700 rounded-full cursor-pointer flex justify-center items-center", 3, "class", "click", 4, "ngFor", "ngForOf"], [1, "border", "border-surface-200", "dark:border-surface-700", "flex", "justify-between", "items-center", "px-4", "rounded"], [1, "text-surface-900", "dark:text-surface-0", "font-bold", "p-4"], [1, "flex", "justify-between", "gap-4"], ["pButton", "", "pRipple", "", "severity", "danger", "outlined", "", "label", "Discard", "icon", "pi pi-fw pi-trash"], ["pButton", "", "pRipple", "", "label", "Save", "icon", "pi pi-fw pi-check"], [1, "w-full", "h-full", "py-4", 2, "cursor", "copy", 3, "click"], ["class", "h-full flex flex-col justify-center items-center", 4, "ngIf"], ["class", "w-full py-4", 3, "style", 4, "ngIf"], [1, "h-full", "flex", "flex-col", "justify-center", "items-center"], [1, "pi", "pi-file", "text-primary", "text-4xl", "mb-4"], [1, "block", "font-semibold", "text-surface-900", "dark:text-surface-0", "text-lg"], [1, "w-full", "py-4"], ["class", "flex flex-wrap gap-8", "style", "padding: 1px;", 3, "mouseenter", "mouseleave", 4, "ngFor", "ngForOf"], [1, "flex", "flex-wrap", "gap-8", 2, "padding", "1px", 3, "mouseenter", "mouseleave"], [1, "remove-file-wrapper", "relative", "w-full", "h-60", "border-4", "border-transparent", "rounded", "hover:bg-primary", "hover:text-primary-contrast", "duration-100", "cursor-auto"], [1, "w-full", "h-full", "rounded", "shadow", 3, "src", "alt"], ["pButton", "", "pRipple", "", "rounded", "", "type", "button", 1, "remove-button", "text-sm", "absolute", "justify-center", "items-center", "cursor-pointer", 2, "top", "-10px", "right", "-10px", "display", "none", 3, "click", "id"], ["pButtonIcon", "", 1, "pi", "pi-times"], ["styleClass", "mr-2 py-2 px-4 text-surface-900 dark:text-surface-0 font-bold bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700"], [1, "mr-4"], [1, "flex", "w-4", "h-4", "items-center", "justify-center", "border", "border-surface-200", "dark:border-surface-700", "bg-gray-100", "rounded-full", "cursor-pointer", 3, "click"], [1, "pi", "pi-fw", "pi-times", "text-black/60", 2, "font-size", "9px"], [1, "w-8", "h-8", "mr-2", "border", "border-surface-200", "dark:border-surface-700", "rounded-full", "cursor-pointer", "flex", "justify-center", "items-center", 3, "click"], ["class", "pi pi-check text-sm text-white z-50", 4, "ngIf"], [1, "pi", "pi-check", "text-sm", "text-white", "z-50"]], template: function NewProduct_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 3)(1, "span", 4);
      \u0275\u0275text(2, "Create Product");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "p-fluid", 5)(4, "div", 6)(5, "div", 7)(6, "div", 8)(7, "input", 9);
      \u0275\u0275twoWayListener("ngModelChange", function NewProduct_Template_input_ngModelChange_7_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.product.name, $event) || (ctx.product.name = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 10)(9, "input", 11);
      \u0275\u0275twoWayListener("ngModelChange", function NewProduct_Template_input_ngModelChange_9_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.product.price, $event) || (ctx.product.price = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "div", 10)(11, "input", 12);
      \u0275\u0275twoWayListener("ngModelChange", function NewProduct_Template_input_ngModelChange_11_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.product.code, $event) || (ctx.product.code = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(12, "div", 10)(13, "input", 13);
      \u0275\u0275twoWayListener("ngModelChange", function NewProduct_Template_input_ngModelChange_13_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.product.sku, $event) || (ctx.product.sku = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(14, "div", 8)(15, "p-editor", 14);
      \u0275\u0275twoWayListener("ngModelChange", function NewProduct_Template_p_editor_ngModelChange_15_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.product.description, $event) || (ctx.product.description = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(16, "div", 15)(17, "p-fileUpload", 16, 0);
      \u0275\u0275listener("onUpload", function NewProduct_Template_p_fileUpload_onUpload_17_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onUpload($event));
      })("onSelect", function NewProduct_Template_p_fileUpload_onSelect_17_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onUpload($event));
      });
      \u0275\u0275template(19, NewProduct_ng_template_19_Template, 3, 2, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(21, "div", 17)(22, "div", 18)(23, "span", 19);
      \u0275\u0275text(24, "Publish");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "div", 20)(26, "div", 21)(27, "span", 22);
      \u0275\u0275text(28, "Status:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(29, "span", 23);
      \u0275\u0275text(30, "Draft");
      \u0275\u0275elementEnd();
      \u0275\u0275element(31, "button", 24);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(32, "div", 18)(33, "span", 19);
      \u0275\u0275text(34, "Tags");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(35, "div", 25);
      \u0275\u0275template(36, NewProduct_p_chip_36_Template, 5, 4, "p-chip", 26);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(37, "div", 18)(38, "span", 19);
      \u0275\u0275text(39, "Category");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(40, "div", 20)(41, "p-select", 27);
      \u0275\u0275twoWayListener("ngModelChange", function NewProduct_Template_p_select_ngModelChange_41_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.product.category, $event) || (ctx.product.category = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(42, "div", 18)(43, "span", 19);
      \u0275\u0275text(44, "Colors");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(45, "div", 28);
      \u0275\u0275template(46, NewProduct_div_46_Template, 2, 3, "div", 29);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(47, "div", 30)(48, "span", 31);
      \u0275\u0275text(49, "In stock");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(50, "p-toggleswitch", 14);
      \u0275\u0275twoWayListener("ngModelChange", function NewProduct_Template_p_toggleswitch_ngModelChange_50_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.product.inStock, $event) || (ctx.product.inStock = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(51, "div", 32);
      \u0275\u0275element(52, "button", 33)(53, "button", 34);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(7);
      \u0275\u0275twoWayProperty("ngModel", ctx.product.name);
      \u0275\u0275advance(2);
      \u0275\u0275twoWayProperty("ngModel", ctx.product.price);
      \u0275\u0275advance(2);
      \u0275\u0275twoWayProperty("ngModel", ctx.product.code);
      \u0275\u0275advance(2);
      \u0275\u0275twoWayProperty("ngModel", ctx.product.sku);
      \u0275\u0275advance(2);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(17, _c1));
      \u0275\u0275twoWayProperty("ngModel", ctx.product.description);
      \u0275\u0275advance(2);
      \u0275\u0275property("customUpload", true)("multiple", true)("showUploadButton", true)("showCancelButton", false)("auto", true);
      \u0275\u0275advance(19);
      \u0275\u0275property("ngForOf", ctx.product.tags);
      \u0275\u0275advance(5);
      \u0275\u0275property("options", ctx.categoryOptions);
      \u0275\u0275twoWayProperty("ngModel", ctx.product.category);
      \u0275\u0275advance(5);
      \u0275\u0275property("ngForOf", ctx.colorOptions);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.product.inStock);
    }
  }, dependencies: [CommonModule, NgForOf, NgIf, EditorModule, Editor, InputTextModule, InputText, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, FileUploadModule, FileUpload, ButtonModule, ButtonDirective, ButtonIcon, SelectModule, Select, ToggleSwitchModule, ToggleSwitch, RippleModule, Ripple, ChipModule, Chip, FluidModule, Fluid], styles: ["\n\n[_nghost-%COMP%]     .p-fileupload-header {\n  display: none;\n}\n[_nghost-%COMP%]     .p-fileupload-file-list {\n  display: none;\n}\n[_nghost-%COMP%]     .p-fileupload-content {\n  height: 20rem;\n}\n/*# sourceMappingURL=newproduct.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NewProduct, { className: "NewProduct", filePath: "src/app/pages/ecommerce/newproduct.ts", lineNumber: 182 });
})();
export {
  NewProduct
};
//# sourceMappingURL=chunk-W4HHFCSF.js.map
