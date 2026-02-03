import {
  Select,
  SelectModule
} from "./chunk-UQSIOFSP.js";
import "./chunk-V6CKOH3G.js";
import "./chunk-DBPX6ILC.js";
import "./chunk-WIQZFAVH.js";
import "./chunk-CCBQFN2J.js";
import "./chunk-FZELBHWZ.js";
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
import "./chunk-W3K3GK4Z.js";
import "./chunk-SQQPVFHK.js";
import {
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵproperty,
  ɵɵtext
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// src/app/pages/ecommerce/shoppingcart.ts
var ShoppingCart = class _ShoppingCart {
  quantityOptions = [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 }
  ];
  static \u0275fac = function ShoppingCart_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ShoppingCart)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ShoppingCart, selectors: [["app-shopping-cart"]], decls: 97, vars: 2, consts: [[1, "card"], [1, "flex", "flex-col", "items-center", "mb-12"], [1, "text-surface-900", "dark:text-surface-0", "text-4xl", "mb-6", "font-medium"], [1, "text-surface-700", "dark:text-surface-100", "font-medium", "text-xl", "mt-0", "mb-6"], ["pButton", "", "pRipple", "", "label", "Check Out"], [1, "list-none", "p-0", "m-0"], [1, "flex", "flex-col", "md:flex-row", "py-12", "border-t", "border-b", "border-surface-200", "dark:border-surface-700", "md:items-center"], ["src", "/images/ecommerce/shopping-cart/shopping-cart-2-1.png", "alt", "shopping-cart-2-1", 1, "w-48", "flex-shrink-0", "mx-auto", "md:mx-0"], [1, "flex-auto", "py-8", "md:pl-8"], [1, "flex", "flex-wrap", "items-start", "sm:items-center", "sm:flex-row", "sm:justify-between", "border-surface-200", "dark:border-surface-700", "pb-12"], [1, "w-full", "sm:w-6/12", "flex", "flex-col"], [1, "text-surface-900", "dark:text-surface-0", "text-xl", "font-medium", "mb-4"], [1, "text-surface-700", "dark:text-surface-100"], [1, "w-full", "sm:w-6/12", "flex", "items-start", "justify-between", "mt-4", "sm:mt-0"], [3, "options"], [1, "flex", "flex-col", "sm:items-end"], [1, "text-surface-900", "dark:text-surface-0", "text-xl", "font-medium", "mb-2", "sm:mb-4"], ["tabindex", "0", 1, "cursor-pointer", "text-pink-500", "font-medium", "text-sm", "hover:text-pink-600", "transition-colors", "duration-300"], [1, "flex", "flex-col"], [1, "inline-flex", "items-center", "mb-4"], [1, "pi", "pi-envelope", "text-surface-700", "dark:text-surface-100", "mr-2"], [1, "text-surface-700", "dark:text-surface-100", "mr-2"], [1, "pi", "pi-send", "text-surface-700", "dark:text-surface-100", "mr-2"], [1, "font-bold"], [1, "flex", "items-center"], [1, "pi", "pi-exclamation-triangle", "text-surface-700", "dark:text-surface-100", "mr-2"], ["src", "/images/ecommerce/shopping-cart/shopping-cart-2-2.png", "alt", "shopping-cart-2-2", 1, "w-48", "flex-shrink-0", "mx-auto", "md:mx-0"], [1, "flex"], [1, "w-48", "hidden", "md:block"], [1, "list-none", "py-0", "pr-0", "pl-0", "md:pl-8", "mt-12", "mx-0", "mb-0", "flex-auto"], [1, "flex", "justify-between", "mb-6"], [1, "text-xl", "text-surface-900", "dark:text-surface-0", "font-semibold"], [1, "text-xl", "text-surface-900", "dark:text-surface-0"], [1, "flex", "justify-between", "border-t", "border-surface-200", "dark:border-surface-700", "mb-6", "pt-6"], [1, "text-xl", "text-surface-900", "dark:text-surface-0", "font-bold", "text-3xl"], [1, "flex", "justify-end"]], template: function ShoppingCart_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
      \u0275\u0275text(3, "Your cart total is $82.00");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "FREE SHIPPING AND RETURN");
      \u0275\u0275elementEnd();
      \u0275\u0275element(6, "button", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "ul", 5)(8, "li", 6);
      \u0275\u0275element(9, "img", 7);
      \u0275\u0275elementStart(10, "div", 8)(11, "div", 9)(12, "div", 10)(13, "span", 11);
      \u0275\u0275text(14, "Product Name");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "span", 12);
      \u0275\u0275text(16, "Medium");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(17, "div", 13)(18, "div");
      \u0275\u0275element(19, "p-select", 14);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "div", 15)(21, "span", 16);
      \u0275\u0275text(22, "$20.00");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "a", 17);
      \u0275\u0275text(24, " Remove ");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(25, "div", 18)(26, "span", 19);
      \u0275\u0275element(27, "i", 20);
      \u0275\u0275elementStart(28, "span", 21);
      \u0275\u0275text(29, "Order today.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(30, "span", 19);
      \u0275\u0275element(31, "i", 22);
      \u0275\u0275elementStart(32, "span", 21);
      \u0275\u0275text(33, " Delivery by ");
      \u0275\u0275elementStart(34, "span", 23);
      \u0275\u0275text(35, "Dec 23.");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(36, "span", 24);
      \u0275\u0275element(37, "i", 25);
      \u0275\u0275elementStart(38, "span", 12);
      \u0275\u0275text(39, "Only 8 Available.");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(40, "li", 6);
      \u0275\u0275element(41, "img", 26);
      \u0275\u0275elementStart(42, "div", 8)(43, "div", 9)(44, "div", 10)(45, "span", 11);
      \u0275\u0275text(46, "Product Name");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "span", 12);
      \u0275\u0275text(48, "Medium");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(49, "div", 13)(50, "div");
      \u0275\u0275element(51, "p-select", 14);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(52, "div", 15)(53, "span", 16);
      \u0275\u0275text(54, "$62.00");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(55, "a", 17);
      \u0275\u0275text(56, " Remove ");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(57, "div", 18)(58, "span", 19);
      \u0275\u0275element(59, "i", 20);
      \u0275\u0275elementStart(60, "span", 21);
      \u0275\u0275text(61, "Order today.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(62, "span", 19);
      \u0275\u0275element(63, "i", 22);
      \u0275\u0275elementStart(64, "span", 21);
      \u0275\u0275text(65, " Delivery by ");
      \u0275\u0275elementStart(66, "span", 23);
      \u0275\u0275text(67, "Dec 23.");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(68, "span", 24);
      \u0275\u0275element(69, "i", 25);
      \u0275\u0275elementStart(70, "span", 12);
      \u0275\u0275text(71, "Only 2 Available.");
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275elementStart(72, "div", 27);
      \u0275\u0275element(73, "div", 28);
      \u0275\u0275elementStart(74, "ul", 29)(75, "li", 30)(76, "span", 31);
      \u0275\u0275text(77, "Subtotal");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(78, "span", 32);
      \u0275\u0275text(79, "$82.00");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(80, "li", 30)(81, "span", 31);
      \u0275\u0275text(82, "Shipping");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(83, "span", 32);
      \u0275\u0275text(84, "Free");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(85, "li", 30)(86, "span", 31);
      \u0275\u0275text(87, "VAT");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(88, "span", 32);
      \u0275\u0275text(89, "$8.00");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(90, "li", 33)(91, "span", 34);
      \u0275\u0275text(92, "Total");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(93, "span", 34);
      \u0275\u0275text(94, "$90.00");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(95, "li", 35);
      \u0275\u0275element(96, "button", 4);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(19);
      \u0275\u0275property("options", ctx.quantityOptions);
      \u0275\u0275advance(32);
      \u0275\u0275property("options", ctx.quantityOptions);
    }
  }, dependencies: [ButtonModule, ButtonDirective, RippleModule, Ripple, SelectModule, Select], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ShoppingCart, { className: "ShoppingCart", filePath: "src/app/pages/ecommerce/shoppingcart.ts", lineNumber: 120 });
})();
export {
  ShoppingCart
};
//# sourceMappingURL=chunk-YJMM2OQK.js.map
