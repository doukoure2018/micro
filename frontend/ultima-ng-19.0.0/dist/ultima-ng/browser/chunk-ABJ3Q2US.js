import {
  ButtonDirective,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import "./chunk-AP3OAIHW.js";
import "./chunk-NQNBRQ7H.js";
import {
  CommonModule,
  NgClass,
  NgForOf
} from "./chunk-SQQPVFHK.js";
import {
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// src/app/pages/ecommerce/ordersummary.ts
var _c0 = (a0) => ({ "border-bottom-1": a0 });
function OrderSummary_li_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 58);
    \u0275\u0275element(1, "img", 59);
    \u0275\u0275elementStart(2, "div", 21)(3, "span", 60);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 61);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 23);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "span", 62);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const product_r1 = ctx.$implicit;
    const i_r2 = ctx.index;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(7, _c0, i_r2 !== ctx_r2.products.length - 1));
    \u0275\u0275advance();
    \u0275\u0275property("src", product_r1.image, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(product_r1.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", product_r1.color, " | ", product_r1.size, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Quantity: ", product_r1.quantity, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(product_r1.price);
  }
}
var OrderSummary = class _OrderSummary {
  products = [
    {
      name: "Cotton Sweatshirt",
      size: "Medium",
      color: "White",
      price: "$12",
      quantity: "1",
      image: "/images/ecommerce/ordersummary/order-summary-1-1.png"
    },
    {
      name: "Regular Jeans",
      size: "Large",
      color: "Black",
      price: "$24",
      quantity: "1",
      image: "/images/ecommerce/ordersummary/order-summary-1-2.png"
    }
  ];
  static \u0275fac = function OrderSummary_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OrderSummary)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _OrderSummary, selectors: [["app-order-summary"]], decls: 124, vars: 1, consts: [[1, "card"], [1, "text-surface-700", "dark:text-surface-100", "text-xl"], [1, "text-surface-900", "dark:text-surface-0", "font-bold", "text-4xl", "my-2"], [1, "text-surface-700", "dark:text-surface-100", "text-xl", "mt-0", "mb-6", "p-0"], [2, "height", "3px", "background", "linear-gradient(90deg, var(--primary-color) 0%, rgba(33, 150, 243, 0) 50%)"], [1, "flex", "flex-col", "sm:flex-row", "sm:items-center", "sm:justify-between", "py-8"], [1, "mb-4", "sm:mb-0"], [1, "font-medium", "text-xl", "text-surface-900", "dark:text-surface-0", "mr-2"], [1, "font-medium", "text-xl", "text-blue-500"], ["pButton", "", "pRipple", "", "label", "Details", "icon", "pi pi-list", "outlined", "", 1, "mr-2"], ["pButton", "", "pRipple", "", "label", "Print", "icon", "pi pi-print", "outlined", "", 1, "p-button-outlined"], [1, "rounded", "border-surface-200", "dark:border-surface-700", "border"], [1, "list-none", "p-0", "m-0"], ["class", "p-4 border-surface-200 dark:border-surface-700 flex items-start sm:items-center", 3, "ngClass", 4, "ngFor", "ngForOf"], [1, "flex", "flex-wrap", "mt-8", "pb-4"], [1, "w-full", "lg:w-6/12", "pl-4"], [1, "font-medium", "text-surface-900", "dark:text-surface-0"], [1, "flex", "flex-col", "text-surface-900", "dark:text-surface-0", "mt-4", "mb-8"], [1, "mb-1"], [1, "flex", "items-center", "mt-4"], ["src", "/images/ecommerce/ordersummary/visa.png", "alt", "visa", 1, "w-16", "mr-4"], [1, "flex", "flex-col"], [1, "text-surface-900", "dark:text-surface-0", "mb-1"], [1, "text-surface-900", "dark:text-surface-0", "font-medium"], [1, "w-full", "lg:w-6/12", "pl-4", "lg:pl-0", "lg:pr-4", "flex", "items-end", "mt-8", "lg:mt-0"], [1, "list-none", "p-0", "m-0", "w-full"], [1, "mb-4"], [1, "flex", "justify-between", "mb-4"], [1, "text-surface-900", "dark:text-surface-0"], [1, "text-surface-900", "dark:text-surface-0", "font-medium", "text-lg"], [1, "flex", "justify-between", "border-t", "border-surface-200", "dark:border-surface-700", "py-4"], [1, "text-surface-900", "dark:text-surface-0", "font-bold", "text-lg"], [1, "flex", "flex-col", "sm:flex-row", "sm:justify-between", "sm:items-center"], [1, "text-2xl", "font-medium", "text-surface-900", "dark:text-surface-0"], [1, "flex", "mt-4", "sm:mt-0"], [1, "flex", "flex-col", "items-center"], [1, "text-surface-900", "dark:text-surface-0", "font-medium", "mb-2"], [1, "text-surface-700", "dark:text-surface-100"], [1, "flex", "flex-col", "items-center", "ml-12", "md:ml-20"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "border-b", "border-surface-200", "dark:border-surface-700", "py-8"], ["src", "/images/ecommerce/ordersummary/order-summary-2-1.png", 1, "w-60", "flex-shrink-0", "md:mr-12"], [1, "flex-auto", "mt-4", "md:mt-0"], [1, "text-xl", "text-surface-900", "dark:text-surface-0"], [1, "font-medium", "text-2xl", "text-surface-900", "dark:text-surface-0", "mt-4", "mb-8"], [1, "rounded", "overflow-hidden", "bg-surface-300", "dark:bg-surface-500", "mb-4", 2, "height", "7px"], [1, "bg-primary", "text-primary-contrast", "rounded", "w-4/12", "h-full"], [1, "flex", "w-full", "justify-between"], [1, "text-surface-900", "dark:text-surface-0", "text-xs", "sm:text-base"], [1, "text-surface-900", "dark:text-surface-0", "font-medium", "text-xs", "sm:text-base"], [1, "text-surface-500", "dark:text-surface-300", "text-xs", "sm:text-base"], [1, "py-8", "flex", "justify-between", "flex-wrap"], [1, "flex", "sm:mr-8", "mb-8"], [1, "font-medium", "text-surface-900", "dark:text-surface-0", "text-xl", "mr-20"], [1, "text-surface-900", "dark:text-surface-0", "text-xl"], [1, "flex", "flex-col", "sm:mr-8", "mb-8"], [1, "font-medium", "text-surface-900", "dark:text-surface-0", "text-xl"], [1, "flex", "flex-col", "text-surface-900", "dark:text-surface-0", "mt-4"], ["src", "/images/ecommerce/ordersummary/visa.png", "alt", "visa-2", 1, "w-16", "mr-4"], [1, "p-4", "border-surface-200", "dark:border-surface-700", "flex", "items-start", "sm:items-center", 3, "ngClass"], [1, "w-12", "sm:w-32", "flex-shrink-0", "mr-4", "shadow", 3, "src"], [1, "text-surface-900", "dark:text-surface-0", "font-semibold", "text-xl", "mb-2"], [1, "text-surface-700", "dark:text-surface-100", "font-medium", "mb-4"], [1, "text-surface-900", "dark:text-surface-0", "font-medium", "text-lg", "ml-auto"]], template: function OrderSummary_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "span", 1);
      \u0275\u0275text(2, "Thanks!");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "div", 2);
      \u0275\u0275text(4, "Successful Order \u{1F680}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p", 3);
      \u0275\u0275text(6, "Your order is on the way. It'll be shipped today. We'll inform you.");
      \u0275\u0275elementEnd();
      \u0275\u0275element(7, "div", 4);
      \u0275\u0275elementStart(8, "div", 5)(9, "div", 6)(10, "span", 7);
      \u0275\u0275text(11, "Order number:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "span", 8);
      \u0275\u0275text(13, "451234");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(14, "div");
      \u0275\u0275element(15, "button", 9)(16, "button", 10);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(17, "div", 11)(18, "ul", 12);
      \u0275\u0275template(19, OrderSummary_li_19_Template, 11, 9, "li", 13);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(20, "div", 14)(21, "div", 15)(22, "span", 16);
      \u0275\u0275text(23, "Shipping Address");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "div", 17)(25, "span", 18);
      \u0275\u0275text(26, "Celeste Slater");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "span", 18);
      \u0275\u0275text(28, "606-3727 Ullamcorper. Roseville NH 11523");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(29, "span");
      \u0275\u0275text(30, "(786) 713-8616");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(31, "span", 16);
      \u0275\u0275text(32, "Payment");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "div", 19);
      \u0275\u0275element(34, "img", 20);
      \u0275\u0275elementStart(35, "div", 21)(36, "span", 22);
      \u0275\u0275text(37, "Visa Debit Card");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(38, "span", 23);
      \u0275\u0275text(39, "**** **** **** 1234");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(40, "div", 24)(41, "ul", 25)(42, "li", 26)(43, "span", 16);
      \u0275\u0275text(44, "Summary");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(45, "li", 27)(46, "span", 28);
      \u0275\u0275text(47, "Subtotal");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(48, "span", 29);
      \u0275\u0275text(49, "$36.00");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(50, "li", 27)(51, "span", 28);
      \u0275\u0275text(52, "Shipping");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(53, "span", 29);
      \u0275\u0275text(54, "$5.00");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(55, "li", 27)(56, "span", 28);
      \u0275\u0275text(57, "Tax");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(58, "span", 29);
      \u0275\u0275text(59, "$4.00");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(60, "li", 30)(61, "span", 23);
      \u0275\u0275text(62, "Total");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(63, "span", 31);
      \u0275\u0275text(64, "$41.00");
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275elementStart(65, "div", 0)(66, "div", 32)(67, "span", 33);
      \u0275\u0275text(68, "Thanks for your order!");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(69, "div", 34)(70, "div", 35)(71, "span", 36);
      \u0275\u0275text(72, "Order ID");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(73, "span", 37);
      \u0275\u0275text(74, "451234");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(75, "div", 38)(76, "span", 36);
      \u0275\u0275text(77, "Order Date");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(78, "span", 37);
      \u0275\u0275text(79, "7 Feb 2023");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(80, "div", 39);
      \u0275\u0275element(81, "img", 40);
      \u0275\u0275elementStart(82, "div", 41)(83, "span", 42);
      \u0275\u0275text(84, "Product Name");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(85, "div", 43);
      \u0275\u0275text(86, "Order Processing");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(87, "div", 44);
      \u0275\u0275element(88, "div", 45);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(89, "div", 46)(90, "span", 47);
      \u0275\u0275text(91, "Ordered");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(92, "span", 48);
      \u0275\u0275text(93, "Processing");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(94, "span", 49);
      \u0275\u0275text(95, "Shipping");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(96, "span", 49);
      \u0275\u0275text(97, "Delivered");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(98, "div", 50)(99, "div", 51)(100, "span", 52);
      \u0275\u0275text(101, "Product Name");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(102, "span", 53);
      \u0275\u0275text(103, "$21.00");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(104, "div", 54)(105, "span", 55);
      \u0275\u0275text(106, "Shipping Address");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(107, "div", 56)(108, "span", 18);
      \u0275\u0275text(109, "Celeste Slater");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(110, "span", 18);
      \u0275\u0275text(111, "606-3727 Ullamcorper. Roseville NH 11523");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(112, "span");
      \u0275\u0275text(113, "(786) 713-8616");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(114, "div", 21)(115, "span", 55);
      \u0275\u0275text(116, "Payment");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(117, "div", 19);
      \u0275\u0275element(118, "img", 57);
      \u0275\u0275elementStart(119, "div", 21)(120, "span", 22);
      \u0275\u0275text(121, "Visa Debit Card");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(122, "span", 23);
      \u0275\u0275text(123, "**** **** **** 1234");
      \u0275\u0275elementEnd()()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(19);
      \u0275\u0275property("ngForOf", ctx.products);
    }
  }, dependencies: [CommonModule, NgClass, NgForOf, ButtonModule, ButtonDirective], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(OrderSummary, { className: "OrderSummary", filePath: "src/app/pages/ecommerce/ordersummary.ts", lineNumber: 145 });
})();
export {
  OrderSummary
};
//# sourceMappingURL=chunk-ABJ3Q2US.js.map
