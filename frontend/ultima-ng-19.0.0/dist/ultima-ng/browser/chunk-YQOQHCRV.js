import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  TabsModule
} from "./chunk-24QVUA7A.js";
import "./chunk-U4P2VV4G.js";
import "./chunk-CPYA4VSS.js";
import {
  InputNumber,
  InputNumberModule
} from "./chunk-JGOABXTK.js";
import "./chunk-CUABQE42.js";
import "./chunk-FZELBHWZ.js";
import "./chunk-IVSL2HKS.js";
import {
  ButtonDirective,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import {
  Ripple,
  RippleModule
} from "./chunk-AP3OAIHW.js";
import "./chunk-NQNBRQ7H.js";
import {
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-3HTR5OU7.js";
import {
  CommonModule,
  NgClass,
  NgForOf
} from "./chunk-SQQPVFHK.js";
import {
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpropertyInterpolate1,
  ɵɵpureFunction1,
  ɵɵpureFunction2,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// src/app/pages/ecommerce/productoverview.ts
var _c0 = (a0) => ({ "!border-primary border-2 !text-primary": a0 });
var _c1 = (a0, a1) => ({ "pi-heart text-600": a0, "pi-heart-fill text-orange-500": a1 });
var _c2 = (a0) => ({ "border-primary": a0 });
function ProductOverview_img_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "img", 68);
    \u0275\u0275listener("click", function ProductOverview_img_5_Template_img_click_0_listener() {
      const i_r2 = \u0275\u0275restoreView(_r1).index;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.selectedImageIndex = i_r2);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const image_r4 = ctx.$implicit;
    const i_r2 = ctx.index;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275propertyInterpolate1("src", "/images/ecommerce/productoverview/", image_r4, "", \u0275\u0275sanitizeUrl);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(3, _c2, ctx_r2.selectedImageIndex === i_r2));
  }
}
var ProductOverview = class _ProductOverview {
  color = signal("bluegray");
  size = "M";
  liked = false;
  images = [];
  selectedImageIndex = 0;
  quantity = 1;
  ngOnInit() {
    this.images = ["product-overview-3-1.png", "product-overview-3-2.png", "product-overview-3-3.png", "product-overview-3-4.png"];
  }
  changeColor(arg) {
    this.color.set(arg);
  }
  static \u0275fac = function ProductOverview_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProductOverview)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProductOverview, selectors: [["app-product-overview"]], decls: 178, vars: 31, consts: [[1, "card"], [1, "grid", "grid-cols-12", "gap-4", "mb-16"], [1, "col-span-12", "lg:col-span-7"], [1, "flex"], [1, "flex", "flex-col", "w-2/12", "justify-between", 2, "row-gap", "1rem"], ["class", "w-full cursor-pointer border-2 border-transparent transition-colors duration-150 border-round", 3, "ngClass", "src", "click", 4, "ngFor", "ngForOf"], [1, "pl-4", "w-10/12", "flex"], [1, "w-full", "border-2", "border-transparent", "rounded", 3, "src"], [1, "col-span-12", "lg:col-span-4", "py-4", "lg:pl-12"], [1, "flex", "items-center", "text-xl", "font-medium", "text-surface-900", "dark:text-surface-0", "mb-6"], [1, "flex", "items-center", "justify-between", "mb-8"], [1, "text-surface-900", "dark:text-surface-0", "font-medium", "text-3xl", "block"], [1, "flex", "items-center"], [1, "mr-4"], [1, "pi", "pi-star-fill", "text-yellow-500", "mr-1"], [1, "pi", "pi-star", "text-surface-600", "dark:text-surface-200", "mr-1"], [1, "text-sm"], [1, "text-surface-900", "dark:text-surface-0", "mr-1"], [1, "text-surface-500", "dark:text-surface-300"], [1, "font-bold", "text-surface-900", "dark:text-surface-0", "mb-4"], [1, "flex", "items-center", "mb-8"], [1, "w-8", "h-8", "flex-shrink-0", "rounded-full", "bg-slate-500", "mr-4", "cursor-pointer", "border-2", "border-surface-200", "dark:border-surface-700", "transition-all", "duration-300", 3, "click"], [1, "w-8", "h-8", "flex-shrink-0", "rounded-full", "bg-green-500", "mr-4", "cursor-pointer", "border-2", "border-surface-200", "dark:border-surface-700", "transition-all", "duration-300", 3, "click"], [1, "w-8", "h-8", "flex-shrink-0", "rounded-full", "bg-blue-500", "cursor-pointer", "border-2", "border-surface-200", "dark:border-surface-700", "transition-all", "duration-300", 3, "click"], [1, "mb-4", "flex", "items-center", "justify-between"], [1, "font-bold", "text-surface-900", "dark:text-surface-0"], ["tabindex", "0", 1, "cursor-pointer", "text-surface-600", "dark:text-surface-200", "text-sm", "flex", "items-center"], [1, "ml-1", "pi", "pi-angle-right"], [1, "flex", "flex-wrap", "gap-4", "items-center", "mb-8"], [1, "h-12", "grow", "basis-0", "border", "border-surface-300", "dark:border-surface-500", "text-surface-900", "dark:text-surface-0", "inline-flex", "justify-center", "items-center", "flex-shrink-0", "rounded", "mr-4", "cursor-pointer", "hover:bg-surface-100", "dark:hover:bg-surface-700", "duration-150", "transition-colors", 3, "click", "ngClass"], [1, "h-12", "grow", "basis-0", "border", "border-surface-300", "dark:border-surface-500", "text-surface-900", "dark:text-surface-0", "inline-flex", "justify-center", "items-center", "flex-shrink-0", "rounded", "cursor-pointer", "hover:bg-surface-100", "dark:hover:bg-surface-700", "duration-150", "transition-colors", 3, "click", "ngClass"], [1, "flex", "flex-col", "sm:flex-row", "sm:items-center", "sm:justify-between"], ["buttonLayout", "horizontal", "inputStyleClass", "w-12 text-center py-2 px-1 border-transparent outline-0 shadow-none", "styleClass", "border border-surface-200 dark:border-surface-700 rounded", "decrementButtonClass", "p-button-text text-surface-600 dark:text-surface-200 hover:text-primary py-1 px-1", "incrementButtonClass", "p-button-text text-surface-600 dark:text-surface-200 hover:text-primary py-1 px-1", "incrementButtonIcon", "pi pi-plus", "decrementButtonIcon", "pi pi-minus", 3, "ngModelChange", "showButtons", "min", "ngModel"], [1, "flex", "items-center", "flex-1", "mt-4", "sm:mt-0", "ml-0", "sm:ml-8"], ["pButton", "", "pRipple", "", "label", "Add to Cart", 1, "flex-1", "mr-8"], [1, "pi", "text-2xl", "cursor-pointer", 3, "click", "ngClass"], ["value", "0"], ["value", "1"], ["value", "2"], [1, "text-surface-900", "dark:text-surface-0", "font-bold", "text-3xl", "mb-6", "mt-2"], [1, "leading-normal", "text-surface-600", "dark:text-surface-200", "p-0", "mx-0", "mt-0", "mb-6"], [1, "grid", "grid-cols-12", "gap-4"], [1, "col-span-12", "lg:col-span-4"], [1, "text-surface-900", "dark:text-surface-0", "block", "mb-4", "font-bold"], [1, "py-0", "pl-4", "m-0", "text-surface-600", "dark:text-surface-200", "mb-4"], [1, "mb-2"], [1, "list-none", "p-0", "m-0", "text-surface-600", "dark:text-surface-200", "mb-6"], [1, "mb-4"], [1, "font-semibold"], [1, "p-0", "m-0", "flex", "flex-wrap", "flex-col", "xl:flex-row", "text-surface-600", "dark:text-surface-200"], [1, "flex", "items-center", "whitespace-nowrap", "w-40", "mr-2", "mb-4"], [1, "pi", "pi-sun", "mr-2", "text-surface-900", "dark:text-surface-0"], [1, "flex", "items-center", "whitespace-nowrap", "w-40", "mb-4"], [1, "pi", "pi-times-circle", "mr-2", "text-surface-900", "dark:text-surface-0"], [1, "flex", "items-center", "whitespace-nowrap", "w-40", "mb-4", "mr-2"], [1, "pi", "pi-sliders-h", "mr-2", "text-surface-900", "dark:text-surface-0"], [1, "pi", "pi-minus-circle", "mr-2", "text-surface-900", "dark:text-surface-0"], [1, "list-none", "p-0", "m-0"], [1, "pb-8", "border-b", "border-surface-200", "dark:border-surface-700"], [1, "pi", "pi-star-fill", "text-gray-500"], [1, "text-surface-900", "dark:text-surface-0", "font-bold", "text-xl", "my-4"], [1, "mx-0", "mt-0", "mb-4", "text-surface-600", "dark:text-surface-200", "leading-normal"], [1, "font-medium"], [1, "py-8", "border-b", "border-surface-200", "dark:border-surface-700"], [1, "pi", "pi-star-fill", "text-yellow-500"], [1, "col-span-12", "md:col-span-6"], [1, "text-surface-900", "dark:text-surface-0", "block", "font-bold", "mb-4"], [1, "leading-normal", "text-surface-600", "dark:text-surface-200", "p-0", "m-0"], [1, "w-full", "cursor-pointer", "border-2", "border-transparent", "transition-colors", "duration-150", "border-round", 3, "click", "ngClass", "src"]], template: function ProductOverview_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4);
      \u0275\u0275template(5, ProductOverview_img_5_Template, 1, 5, "img", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "div", 6);
      \u0275\u0275element(7, "img", 7);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(8, "div", 8)(9, "div", 9);
      \u0275\u0275text(10, "Product Title Placeholder");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "div", 10)(12, "span", 11);
      \u0275\u0275text(13, "$120");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "div", 12)(15, "span", 13);
      \u0275\u0275element(16, "i", 14)(17, "i", 14)(18, "i", 14)(19, "i", 14)(20, "i", 15);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "span", 16)(22, "b", 17);
      \u0275\u0275text(23, "24");
      \u0275\u0275elementEnd();
      \u0275\u0275element(24, "span", 18);
      \u0275\u0275text(25, "reviews ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(26, "div", 19);
      \u0275\u0275text(27, "Color");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "div", 20)(29, "div", 21);
      \u0275\u0275listener("click", function ProductOverview_Template_div_click_29_listener() {
        return ctx.changeColor("bluegray");
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "div", 22);
      \u0275\u0275listener("click", function ProductOverview_Template_div_click_30_listener() {
        return ctx.changeColor("green");
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(31, "div", 23);
      \u0275\u0275listener("click", function ProductOverview_Template_div_click_31_listener() {
        return ctx.changeColor("blue");
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(32, "div", 24)(33, "span", 25);
      \u0275\u0275text(34, "Size");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(35, "a", 26);
      \u0275\u0275text(36, " Size Guide ");
      \u0275\u0275element(37, "i", 27);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(38, "div", 28)(39, "div", 29);
      \u0275\u0275listener("click", function ProductOverview_Template_div_click_39_listener() {
        return ctx.size = "XS";
      });
      \u0275\u0275text(40, " XS ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "div", 29);
      \u0275\u0275listener("click", function ProductOverview_Template_div_click_41_listener() {
        return ctx.size = "S";
      });
      \u0275\u0275text(42, " S ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(43, "div", 29);
      \u0275\u0275listener("click", function ProductOverview_Template_div_click_43_listener() {
        return ctx.size = "M";
      });
      \u0275\u0275text(44, " M ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(45, "div", 29);
      \u0275\u0275listener("click", function ProductOverview_Template_div_click_45_listener() {
        return ctx.size = "L";
      });
      \u0275\u0275text(46, " L ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "div", 30);
      \u0275\u0275listener("click", function ProductOverview_Template_div_click_47_listener() {
        return ctx.size = "XL";
      });
      \u0275\u0275text(48, " XL ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(49, "div", 19);
      \u0275\u0275text(50, "Quantity");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(51, "div", 31)(52, "p-inputNumber", 32);
      \u0275\u0275twoWayListener("ngModelChange", function ProductOverview_Template_p_inputNumber_ngModelChange_52_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.quantity, $event) || (ctx.quantity = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(53, "div", 33);
      \u0275\u0275element(54, "button", 34);
      \u0275\u0275elementStart(55, "i", 35);
      \u0275\u0275listener("click", function ProductOverview_Template_i_click_55_listener() {
        return ctx.liked = !ctx.liked;
      });
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(56, "p-tabs", 36)(57, "p-tablist")(58, "p-tab", 36);
      \u0275\u0275text(59, "Details");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(60, "p-tab", 37);
      \u0275\u0275text(61, "Reviews");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(62, "p-tab", 38);
      \u0275\u0275text(63, "Shipping and Returns");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(64, "p-tabpanels")(65, "p-tabpanel", 36)(66, "div", 39);
      \u0275\u0275text(67, "Product Details");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(68, "p", 40);
      \u0275\u0275text(69, " Volutpat maecenas volutpat blandit aliquam etiam erat velit scelerisque in. Duis ultricies lacus sed turpis tincidunt id. Sed tempus urna et pharetra. Metus vulputate eu scelerisque felis imperdiet proin fermentum. Venenatis urna cursus eget nunc scelerisque viverra mauris in. Viverra justo nec ultrices dui sapien eget mi proin. Laoreet suspendisse interdum consectetur libero id faucibus. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(70, "div", 41)(71, "div", 42)(72, "span", 43);
      \u0275\u0275text(73, "Highlights");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(74, "ul", 44)(75, "li", 45);
      \u0275\u0275text(76, "Vulputate sapien nec.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(77, "li", 45);
      \u0275\u0275text(78, "Purus gravida quis blandit.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(79, "li", 45);
      \u0275\u0275text(80, "Nisi quis eleifend quam adipiscing.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(81, "li");
      \u0275\u0275text(82, "Imperdiet proin fermentum.");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(83, "div", 42)(84, "span", 43);
      \u0275\u0275text(85, "Size and Fit");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(86, "ul", 46)(87, "li", 47)(88, "span", 48);
      \u0275\u0275text(89, "Leo vel:");
      \u0275\u0275elementEnd();
      \u0275\u0275text(90, " Egestas congue. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(91, "li", 47)(92, "span", 48);
      \u0275\u0275text(93, "Sociis natoque:");
      \u0275\u0275elementEnd();
      \u0275\u0275text(94, " Parturient montes nascetur. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(95, "li")(96, "span", 48);
      \u0275\u0275text(97, "Suspendisse in:");
      \u0275\u0275elementEnd();
      \u0275\u0275text(98, " Purus sit amet volutpat. ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(99, "div", 42)(100, "span", 43);
      \u0275\u0275text(101, "Material & Care");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(102, "ul", 49)(103, "li", 50);
      \u0275\u0275element(104, "i", 51);
      \u0275\u0275elementStart(105, "span");
      \u0275\u0275text(106, "Not dryer safe");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(107, "li", 52);
      \u0275\u0275element(108, "i", 53);
      \u0275\u0275elementStart(109, "span");
      \u0275\u0275text(110, "No chemical wash");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(111, "li", 54);
      \u0275\u0275element(112, "i", 55);
      \u0275\u0275elementStart(113, "span");
      \u0275\u0275text(114, "Iron medium heat");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(115, "li", 52);
      \u0275\u0275element(116, "i", 56);
      \u0275\u0275elementStart(117, "span");
      \u0275\u0275text(118, "Dry flat");
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275elementStart(119, "p-tabpanel", 37)(120, "div", 39);
      \u0275\u0275text(121, "Customer Reviews");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(122, "ul", 57)(123, "li", 58)(124, "span");
      \u0275\u0275element(125, "i", 14)(126, "i", 14)(127, "i", 14)(128, "i", 14)(129, "i", 59);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(130, "div", 60);
      \u0275\u0275text(131, "Absolute Perfection!");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(132, "p", 61);
      \u0275\u0275text(133, " Blandit libero volutpat sed cras ornare arcu dui vivamus. Arcu dictum varius duis at consectetur lorem donec massa. Imperdiet proin fermentum leo vel orci porta non. Porttitor rhoncus dolor purus non. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(134, "span", 62);
      \u0275\u0275text(135, "Darlene Robertson, 2 days ago");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(136, "li", 63)(137, "span");
      \u0275\u0275element(138, "i", 14)(139, "i", 14)(140, "i", 14)(141, "i", 14)(142, "i", 64);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(143, "div", 60);
      \u0275\u0275text(144, "Classy");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(145, "p", 61);
      \u0275\u0275text(146, "Venenatis cras sed felis eget. Proin nibh nisl condimentum id venenatis a condimentum.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(147, "span", 62);
      \u0275\u0275text(148, "Kristin Watson, 2 days ago");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(149, "p-tabpanel", 38)(150, "div", 39);
      \u0275\u0275text(151, "Shipping Placeholder");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(152, "p", 40);
      \u0275\u0275text(153, " Mattis aliquam faucibus purus in massa tempor nec feugiat nisl. Justo donec enim diam vulputate ut pharetra. Tempus egestas sed sed risus. Feugiat sed lectus vestibulum mattis. Tristique nulla aliquet enim tortor at auctor urna nunc. Habitant morbi tristique senectus et. Facilisi nullam vehicula ipsum. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(154, "div", 41)(155, "div", 65)(156, "span", 66);
      \u0275\u0275text(157, "Shipping Costs");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(158, "ul", 44)(159, "li", 45);
      \u0275\u0275text(160, "Japan - JPY 2,500.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(161, "li", 45);
      \u0275\u0275text(162, "Europe - EUR 10");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(163, "li", 45);
      \u0275\u0275text(164, "Switzerland - CHF 10");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(165, "li", 45);
      \u0275\u0275text(166, "Canada - CAD 25");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(167, "li", 45);
      \u0275\u0275text(168, "USA - USD 20");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(169, "li", 45);
      \u0275\u0275text(170, "Australia - AUD 30");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(171, "li", 45);
      \u0275\u0275text(172, "United Kingdom - GBP 10");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(173, "div", 65)(174, "span", 66);
      \u0275\u0275text(175, "Return Policy");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(176, "p", 67);
      \u0275\u0275text(177, "Pharetra et ultrices neque ornare aenean euismod elementum nisi. Diam phasellus vestibulum lorem sed. Mattis molestie a iaculis at.");
      \u0275\u0275elementEnd()()()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(5);
      \u0275\u0275property("ngForOf", ctx.images);
      \u0275\u0275advance(2);
      \u0275\u0275propertyInterpolate1("src", "/images/ecommerce/productoverview/", ctx.images[ctx.selectedImageIndex], "", \u0275\u0275sanitizeUrl);
      \u0275\u0275advance(22);
      \u0275\u0275styleProp("box-shadow", ctx.color() === "bluegray" ? "0 0 0 0.2rem var(--p-slate-500)" : null);
      \u0275\u0275advance();
      \u0275\u0275styleProp("box-shadow", ctx.color() === "green" ? "0 0 0 0.2rem var(--p-green-500)" : null);
      \u0275\u0275advance();
      \u0275\u0275styleProp("box-shadow", ctx.color() === "blue" ? "0 0 0 0.2rem var(--p-blue-500)" : null);
      \u0275\u0275advance(8);
      \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(18, _c0, ctx.size === "XS"));
      \u0275\u0275advance(2);
      \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(20, _c0, ctx.size === "S"));
      \u0275\u0275advance(2);
      \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(22, _c0, ctx.size === "M"));
      \u0275\u0275advance(2);
      \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(24, _c0, ctx.size === "L"));
      \u0275\u0275advance(2);
      \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(26, _c0, ctx.size === "XL"));
      \u0275\u0275advance(5);
      \u0275\u0275property("showButtons", true)("min", 0);
      \u0275\u0275twoWayProperty("ngModel", ctx.quantity);
      \u0275\u0275advance(3);
      \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(28, _c1, !ctx.liked, ctx.liked));
    }
  }, dependencies: [CommonModule, NgClass, NgForOf, FormsModule, NgControlStatus, NgModel, InputNumberModule, InputNumber, ButtonModule, ButtonDirective, RippleModule, Ripple, TabsModule, Tabs, TabPanels, TabPanel, TabList, Tab], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProductOverview, { className: "ProductOverview", filePath: "src/app/pages/ecommerce/productoverview.ts", lineNumber: 278 });
})();
export {
  ProductOverview
};
//# sourceMappingURL=chunk-YQOQHCRV.js.map
