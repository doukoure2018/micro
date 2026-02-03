import {
  LayoutService
} from "./chunk-ZGNAW63S.js";
import {
  Topbar
} from "./chunk-GHORVA4J.js";
import "./chunk-CFS3J3Q2.js";
import {
  RouterModule
} from "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
import {
  InputText
} from "./chunk-FZELBHWZ.js";
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
import "./chunk-ZRELZ6R7.js";
import "./chunk-BMYIFZHZ.js";
import {
  CommonModule
} from "./chunk-SQQPVFHK.js";
import {
  inject,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵtext,
  ɵɵtrustConstantResourceUrl
} from "./chunk-ZKKMBKIA.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/pages/landing/components/featureswidget.ts
var _c0 = ["*"];
var FeaturesWidget = class _FeaturesWidget {
  handleMouseEnter(event) {
    const target = event.target;
    if (target) {
      target.style.background = "linear-gradient(110.43deg, rgba(134,140,208,.5) 0.04%, rgba(255,87,89,.5) 100.11%)";
    }
  }
  handleMouseLeave(event) {
    const target = event.target;
    if (target) {
      target.style.background = "unset";
    }
  }
  static \u0275fac = function FeaturesWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FeaturesWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FeaturesWidget, selectors: [["features-widget"]], ngContentSelectors: _c0, decls: 71, vars: 0, consts: [["id", "features", 1, "pt-8", 2, "background-color", "#000"], [1, "flex", "flex-col", "items-center", "gap-4"], [1, "bg-surface-50", "dark:bg-surface-800", "text-white", "text-sm", "p-2", "rounded-lg", "mb-6"], [1, "text-white", "text-2xl", "uppercase"], [1, "m-0", "text-6xl", 2, "background", "linear-gradient(110.43deg, #868cd0 0.04%, #ff5759 100.11%)", "background-clip", "text", "-webkit-background-clip", "text", "color", "transparent"], [1, "flex", "flex-col", "items-center"], [1, "grid", "grid-cols-12", "gap-4", "pt-12", "p-6", 2, "max-width", "1200px"], [1, "col-span-6", "lg:col-span-4"], [1, "flex", "justify-center", "flex-col", "gap-4", "border", "border-surface-50", "dark:border-surface-800", "rounded-2xl", "p-8", "cursor-pointer", "h-full", 3, "mouseenter", "mouseleave"], [1, "pi", "pi-palette", "!text-4xl", "text-white"], [1, "font-semibold", "text-white"], [1, "text-white"], [1, "text-primary-300", "font-medium", "flex", "items-center"], [1, "pi", "pi-arrow-right", "ml-2"], [1, "pi", "pi-mobile", "!text-4xl", "text-white"], [1, "pi", "pi-sync", "!text-4xl", "text-white"], [1, "pi", "pi-th-large", "!text-4xl", "text-white"], [1, "flex", "justify-center", "flex-col", "gap-4", "border", "border-surface-50", "dark:border-surface-800", "rounded-2xl", "text-white", "p-8", "cursor-pointer", "h-full", 3, "mouseenter", "mouseleave"], [1, "pi", "pi-code", "!text-4xl", "text-white"], [1, "pi", "pi-box", "!text-4xl"], [1, "font-semibold"]], template: function FeaturesWidget_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
      \u0275\u0275text(3, "FEATURES");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "span", 3);
      \u0275\u0275text(5, "All you need is the Ultima.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "h1", 4);
      \u0275\u0275text(7, "ULTIMA");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 5)(9, "div", 6)(10, "div", 7)(11, "div", 8);
      \u0275\u0275listener("mouseenter", function FeaturesWidget_Template_div_mouseenter_11_listener($event) {
        return ctx.handleMouseEnter($event);
      })("mouseleave", function FeaturesWidget_Template_div_mouseleave_11_listener($event) {
        return ctx.handleMouseLeave($event);
      });
      \u0275\u0275element(12, "i", 9);
      \u0275\u0275elementStart(13, "span", 10);
      \u0275\u0275text(14, "Creative Design");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "span", 11);
      \u0275\u0275text(16, "Unleash your brand's full potential with our creative design services.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "span", 12);
      \u0275\u0275text(18, "Learn more ");
      \u0275\u0275element(19, "i", 13);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(20, "div", 7)(21, "div", 8);
      \u0275\u0275listener("mouseenter", function FeaturesWidget_Template_div_mouseenter_21_listener($event) {
        return ctx.handleMouseEnter($event);
      })("mouseleave", function FeaturesWidget_Template_div_mouseleave_21_listener($event) {
        return ctx.handleMouseLeave($event);
      });
      \u0275\u0275element(22, "i", 14);
      \u0275\u0275elementStart(23, "span", 10);
      \u0275\u0275text(24, "Responsive Design");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "span", 11);
      \u0275\u0275text(26, "Make sure your website looks great and functions seamlessly on any device with responsive design.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "span", 12);
      \u0275\u0275text(28, "Learn more ");
      \u0275\u0275element(29, "i", 13);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(30, "div", 7)(31, "div", 8);
      \u0275\u0275listener("mouseenter", function FeaturesWidget_Template_div_mouseenter_31_listener($event) {
        return ctx.handleMouseEnter($event);
      })("mouseleave", function FeaturesWidget_Template_div_mouseleave_31_listener($event) {
        return ctx.handleMouseLeave($event);
      });
      \u0275\u0275element(32, "i", 15);
      \u0275\u0275elementStart(33, "span", 10);
      \u0275\u0275text(34, "Cross Browser Support");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(35, "span", 11);
      \u0275\u0275text(36, "Don't let browser compatibility hold you back. Our cross browser support ensures your website works perfectly on all browsers.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "span", 12);
      \u0275\u0275text(38, "Learn more ");
      \u0275\u0275element(39, "i", 13);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(40, "div", 7)(41, "div", 8);
      \u0275\u0275listener("mouseenter", function FeaturesWidget_Template_div_mouseenter_41_listener($event) {
        return ctx.handleMouseEnter($event);
      })("mouseleave", function FeaturesWidget_Template_div_mouseleave_41_listener($event) {
        return ctx.handleMouseLeave($event);
      });
      \u0275\u0275element(42, "i", 16);
      \u0275\u0275elementStart(43, "span", 10);
      \u0275\u0275text(44, "Well Organized");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(45, "span", 11);
      \u0275\u0275text(46, "Our well-organized approach guarantees a smooth design process from start to finish.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "span", 12);
      \u0275\u0275text(48, "Learn more ");
      \u0275\u0275element(49, "i", 13);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(50, "div", 7)(51, "div", 17);
      \u0275\u0275listener("mouseenter", function FeaturesWidget_Template_div_mouseenter_51_listener($event) {
        return ctx.handleMouseEnter($event);
      })("mouseleave", function FeaturesWidget_Template_div_mouseleave_51_listener($event) {
        return ctx.handleMouseLeave($event);
      });
      \u0275\u0275element(52, "i", 18);
      \u0275\u0275elementStart(53, "span", 10);
      \u0275\u0275text(54, "Easy to Product");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(55, "span", 11);
      \u0275\u0275text(56, "We make product creation easy with straightforward and intuitive processes.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(57, "span", 12);
      \u0275\u0275text(58, "Learn more ");
      \u0275\u0275element(59, "i", 13);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(60, "div", 7)(61, "div", 17);
      \u0275\u0275listener("mouseenter", function FeaturesWidget_Template_div_mouseenter_61_listener($event) {
        return ctx.handleMouseEnter($event);
      })("mouseleave", function FeaturesWidget_Template_div_mouseleave_61_listener($event) {
        return ctx.handleMouseLeave($event);
      });
      \u0275\u0275element(62, "i", 19);
      \u0275\u0275elementStart(63, "span", 20);
      \u0275\u0275text(64, "Top Notch Quality");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(65, "span");
      \u0275\u0275text(66, "Expect top notch quality in all of our work, delivering exceptional results every time.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(67, "span", 12);
      \u0275\u0275text(68, "Learn more ");
      \u0275\u0275element(69, "i", 13);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275projection(70);
      \u0275\u0275elementEnd()();
    }
  }, dependencies: [CommonModule], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FeaturesWidget, { className: "FeaturesWidget", filePath: "src/app/pages/landing/components/featureswidget.ts", lineNumber: 70 });
})();

// src/app/pages/landing/components/footerwidget.ts
var FooterWidget = class _FooterWidget {
  static \u0275fac = function FooterWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FooterWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FooterWidget, selectors: [["footer-widget"]], hostAttrs: [1, "w-full", "px-6", 2, "max-width", "1200px"], decls: 63, vars: 0, consts: [[1, "grid", "grid-cols-12", "gap-4", "lg:gap-0", "lg:grid-nogutter", "pb-12"], [1, "col-span-12", "lg:col-span-3"], [1, "w-full", "text-white", "flex", "flex-col", "gap-4"], [1, "m-0", "font-medium", "text-sm", "text-surface-500", "dark:text-surface-300"], [1, "flex", "gap-8"], ["href", "#"], [1, "pi", "pi-github", "text-white", "!text-2xl"], [1, "pi", "pi-twitter", "text-white", "!text-2xl"], [1, "pi", "pi-linkedin", "text-white", "!text-2xl"], [1, "m-0", "text-base", "lg:text-sm"], [1, "text-base", "lg:text-sm"], [1, "text-base", "lg:text-sm", "block", "text-white"]], template: function FooterWidget_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1", 3);
      \u0275\u0275text(4, "CONTACT US");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div", 4)(6, "a", 5);
      \u0275\u0275element(7, "i", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "a", 5);
      \u0275\u0275element(9, "i", 7);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "a", 5);
      \u0275\u0275element(11, "i", 8);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(12, "p", 9);
      \u0275\u0275text(13, " (415) 931-1624 794 Mcallister ");
      \u0275\u0275element(14, "br");
      \u0275\u0275text(15, " St San Francisco, 94102 ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "span", 10);
      \u0275\u0275text(17, " 2023");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(18, "div", 1)(19, "div", 2)(20, "h1", 3);
      \u0275\u0275text(21, "ABOUT US");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "a", 5)(23, "span", 11);
      \u0275\u0275text(24, "Our Values");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(25, "a", 5)(26, "span", 11);
      \u0275\u0275text(27, "Our Team");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(28, "a", 5)(29, "span", 11);
      \u0275\u0275text(30, "Our History");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(31, "a", 5)(32, "span", 11);
      \u0275\u0275text(33, "Career & Join Us");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(34, "div", 1)(35, "div", 2)(36, "h1", 3);
      \u0275\u0275text(37, "SITE MAP");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(38, "a", 5)(39, "span", 11);
      \u0275\u0275text(40, "Dashboard");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(41, "a", 5)(42, "span", 11);
      \u0275\u0275text(43, "CRUD");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(44, "a", 5)(45, "span", 11);
      \u0275\u0275text(46, "Invoice");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(47, "a", 5)(48, "span", 11);
      \u0275\u0275text(49, "Help ");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(50, "div", 1)(51, "div", 2)(52, "h1", 3);
      \u0275\u0275text(53, "CALENDAR");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(54, "a", 5)(55, "span", 11);
      \u0275\u0275text(56, "Widgets");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(57, "a", 5)(58, "span", 11);
      \u0275\u0275text(59, "Documentation");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(60, "a", 5)(61, "span", 11);
      \u0275\u0275text(62, "Buy Now");
      \u0275\u0275elementEnd()()()()();
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FooterWidget, { className: "FooterWidget", filePath: "src/app/pages/landing/components/footerwidget.ts", lineNumber: 54 });
})();

// src/app/pages/landing/components/herowidget.ts
var HeroWidget = class _HeroWidget {
  handleScroll(id) {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  }
  static \u0275fac = function HeroWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HeroWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _HeroWidget, selectors: [["hero-widget"]], hostAttrs: [2, "display", "contents"], decls: 29, vars: 3, consts: [[1, "hidden", "lg:block", "absolute", "top-0", "right-0", "bottom-0", "left-0", "parallax__layer__0"], ["src", "/images/landing/layer-0-opt.jpg", 1, "w-full", "h-full", "block", "absolute", "bottom-0"], [1, "hidden", "lg:block", "absolute", "top-0", "right-0", "bottom-0", "left-0", "parallax__layer__1"], ["src", "/images/landing/layer-1-opt.png", 1, "w-full", "block", "absolute", "bottom-0"], [1, "hidden", "lg:flex", "absolute", "right-0", "bottom-0", "left-0", "parallax__layer__3", "justify-center", 2, "top", "27%"], [1, "m-0", "-mb-6", "text-4xl", "text-white"], [1, "m-0", "text-white", 2, "font-size", "15rem"], [1, "flex", "-mt-6", "justify-end"], [1, "m-0", "text-white", "text-4xl"], [1, "hidden", "lg:block", "absolute", "top-0", "right-0", "bottom-0", "left-0", "parallax__layer__2"], ["src", "/images/landing/layer-2-opt.png", 1, "w-full", "block", "absolute", "bottom-0"], [1, "absolute", "flex", "justify-center", "items-center", "w-full", "h-full", "parallax__layer__3", 2, "top", "112px"], ["pButton", "", "pRipple", "", "label", "GET STARTED", "text", "", 1, "!text-surface-0", "!bg-white/20", "!text-lg", "!px-8", "!py-4", "!font-semibold", "hover:!bg-white", "hover:!text-surface-900", "!rounded-xl", "!border-white/30", "border", 2, "backdrop-filter", "blur(7px)", 3, "click"], [1, "block", "lg:hidden", "h-[28rem]", "bg-center", "bg-no-repeat", "bg-cover", 2, "top", "68px", "background", "url(/images/landing/landing-hero-image.jpg)"], [1, "flex", "justify-center", "items-center", "h-full"], [1, "flex", "flex-col"], [1, "m-0", "text-base", "text-white", "font-semibold"], [1, "m-0", "text-4xl", "text-white", "font-semibold"], [1, "flex", "justify-end"], [1, "m-0", "text-white", "text-sm", "font-semibold"], [1, "flex", "justify-center", "mt-2"], ["pButton", "", "pRipple", "", "label", "GET STARTED", "text", "", 1, "!text-surface-0", "!bg-white/20", "!text-xs", "!font-semibold", "hover:!bg-white", "hover:!text-surface-900", "!rounded-xl", "!border-white/30", "border", 2, "backdrop-filter", "blur(7px)", 3, "click"]], template: function HeroWidget_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "img", 1);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(2, "div", 2);
      \u0275\u0275element(3, "img", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div", 4)(5, "div")(6, "h1", 5);
      \u0275\u0275text(7, "LET'S");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "h1", 6);
      \u0275\u0275text(9, "EXPLORE");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "div", 7)(11, "h1", 8);
      \u0275\u0275text(12, "TO ULTIMA");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(13, "div", 9);
      \u0275\u0275element(14, "img", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "div", 11)(16, "button", 12);
      \u0275\u0275listener("click", function HeroWidget_Template_button_click_16_listener() {
        return ctx.handleScroll("features");
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(17, "div", 13)(18, "div", 14)(19, "div", 15)(20, "span", 16);
      \u0275\u0275text(21, "LET'S");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "span", 17);
      \u0275\u0275text(23, "EXPLORE");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "div", 18)(25, "span", 19);
      \u0275\u0275text(26, "TO ULTIMA");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(27, "div", 20)(28, "button", 21);
      \u0275\u0275listener("click", function HeroWidget_Template_button_click_28_listener() {
        return ctx.handleScroll("parallaxBody");
      });
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275attribute("draggable", false);
      \u0275\u0275advance(2);
      \u0275\u0275attribute("draggable", false);
      \u0275\u0275advance(11);
      \u0275\u0275attribute("draggable", false);
    }
  }, dependencies: [ButtonModule, ButtonDirective, RippleModule, Ripple], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(HeroWidget, { className: "HeroWidget", filePath: "src/app/pages/landing/components/herowidget.ts", lineNumber: 67 });
})();

// src/app/pages/landing/components/whouses.ts
var WhoUsesWidget = class _WhoUsesWidget {
  static \u0275fac = function WhoUsesWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _WhoUsesWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _WhoUsesWidget, selectors: [["who-uses-widget"]], hostAttrs: [1, "grid", "grid-cols-12", "gap-4", "grid-nogutter", "p-2", "lg:p-8", 2, "background-color", "#000"], decls: 8, vars: 4, consts: [[1, "col-span-6", "lg:col-span-3", "flex", "items-center", "justify-center", "gap-4"], ["src", "/images/landing/landing-logo1.png", "alt", "", 3, "draggable"], ["src", "/images/landing/landing-logo2.png", "alt", "", 3, "draggable"], ["src", "/images/landing/landing-logo3.png", "alt", "", 3, "draggable"], ["src", "/images/landing/landing-logo4.png", "alt", "", 3, "draggable"]], template: function WhoUsesWidget_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "img", 1);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(2, "div", 0);
      \u0275\u0275element(3, "img", 2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div", 0);
      \u0275\u0275element(5, "img", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "div", 0);
      \u0275\u0275element(7, "img", 4);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275property("draggable", false);
      \u0275\u0275advance(2);
      \u0275\u0275property("draggable", false);
      \u0275\u0275advance(2);
      \u0275\u0275property("draggable", false);
      \u0275\u0275advance(2);
      \u0275\u0275property("draggable", false);
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(WhoUsesWidget, { className: "WhoUsesWidget", filePath: "src/app/pages/landing/components/whouses.ts", lineNumber: 25 });
})();

// src/app/pages/landing/components/collaborationwidget.ts
var CollaborationWidget = class _CollaborationWidget {
  static \u0275fac = function CollaborationWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CollaborationWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CollaborationWidget, selectors: [["collaboration-widget"]], decls: 10, vars: 1, consts: [["id", "collaboration", 1, "flex", "flex-col", "lg:flex-row", "gap-20", "mt-12", "py-12", "px-6", "w-full", 2, "max-width", "1200px"], [1, "flex", "flex-col", "items-end", "justify-center"], [1, "bg-surface-50", "dark:bg-surface-800", "text-white", "text-sm", "p-2", "rounded-lg", "mb-6"], [1, "m-0", "text-6xl", "font-bold", "text-right", 2, "background", "linear-gradient(110.43deg, #868cd0 0.04%, #ff5759 100.11%)", "background-clip", "text", "-webkit-background-clip", "text", "color", "transparent"], [1, "text-white", "text-right", "mt-4"], ["src", "/images/landing/collaboration-image.png", "alt", "collaboration"]], template: function CollaborationWidget_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
      \u0275\u0275text(3, "PLAY AS A TEAM");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div")(5, "h1", 3);
      \u0275\u0275text(6, "COLLABORATION");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "p", 4);
      \u0275\u0275text(8, " The Earth is a very small stage in a vast cosmic arena. Think of the rivers of blood spilled by all those generals and emperors so that, in glory and triumph, they could become the momentary masters of a fraction of a dot. ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275element(9, "img", 5);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(9);
      \u0275\u0275attribute("draggable", false);
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CollaborationWidget, { className: "CollaborationWidget", filePath: "src/app/pages/landing/components/collaborationwidget.ts", lineNumber: 19 });
})();

// src/app/pages/landing/components/easyfollowwidget.ts
var EasyFollowWidget = class _EasyFollowWidget {
  static \u0275fac = function EasyFollowWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EasyFollowWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EasyFollowWidget, selectors: [["easy-follow-widget"]], decls: 10, vars: 1, consts: [["id", "events", 1, "flex", "flex-col", "lg:flex-row", "gap-20", "mt-12", "py-12", "px-6", "w-full", 2, "max-width", "1200px"], ["src", "/images/landing/easyfollow-image.png", "alt", "easyfollow", 3, "draggable"], [1, "flex", "flex-col", "items-start", "justify-center"], [1, "bg-surface-50", "dark:bg-surface-800", "text-white", "text-sm", "p-2", "rounded-lg", "mb-6"], [1, "m-0", "text-6xl", "font-bold", 2, "background", "linear-gradient(110.43deg, #868cd0 0.04%, #ff5759 100.11%)", "background-clip", "text", "-webkit-background-clip", "text", "color", "transparent"], [1, "text-white", "mt-2"]], template: function EasyFollowWidget_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "img", 1);
      \u0275\u0275elementStart(2, "div", 2)(3, "div", 3);
      \u0275\u0275text(4, "EVENTS");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div")(6, "h1", 4);
      \u0275\u0275text(7, "EASY FOLLOW");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "p", 5);
      \u0275\u0275text(9, "It has been said that astronomy is a humbling and character-building experience. There is perhaps no better demonstration of the folly of human conceits than this distant image of our tiny world.");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275property("draggable", false);
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EasyFollowWidget, { className: "EasyFollowWidget", filePath: "src/app/pages/landing/components/easyfollowwidget.ts", lineNumber: 17 });
})();

// src/app/pages/landing/components/showreelswidget.ts
var ShowReelsWidget = class _ShowReelsWidget {
  static \u0275fac = function ShowReelsWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ShowReelsWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ShowReelsWidget, selectors: [["show-reels-widget"]], decls: 13, vars: 3, consts: [["id", "video", 1, "flex", "gap-6", "mt-12", "py-12", "flex-col", "items-center", "w-full", 2, "max-width", "1200px"], [1, "bg-surface-50", "dark:bg-surface-800", "text-white", "text-sm", "p-2", "rounded-lg"], [1, "m-0", "text-6xl", "font-bold", 2, "background", "linear-gradient(110.43deg, #868cd0 0.04%, #ff5759 100.11%)", "background-clip", "text", "-webkit-background-clip", "text", "color", "transparent"], [1, "mt-4", "relative"], ["width", "600", "height", "400", "src", \u0275\u0275trustConstantResourceUrl`https://www.youtube.com/embed/tgbNymZ7vqY`, 1, "border-0", "rounded-lg", "z-30", "max-w-full"], [1, "absolute", "z-0", 2, "top", "-50px", "left", "-50px"], ["src", "/images/landing/landing-ellipse.png", "alt", "", 1, "opacity-40"], [1, "absolute", "z-0", 2, "bottom", "-50px", "right", "-50px", "filter", "blur(4px)"], ["src", "/images/landing/landing-ellipse2.png", "alt", "", 1, "opacity-40"], [1, "absolute", "z-0", 2, "bottom", "-50px", "right", "10px", "filter", "blur(4px)"]], template: function ShowReelsWidget_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
      \u0275\u0275text(2, "VIDEO");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "h1", 2);
      \u0275\u0275text(4, "SHOWREELS");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div", 3);
      \u0275\u0275element(6, "iframe", 4);
      \u0275\u0275elementStart(7, "div", 5);
      \u0275\u0275element(8, "img", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "div", 7);
      \u0275\u0275element(10, "img", 8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "div", 9);
      \u0275\u0275element(12, "img", 8);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(8);
      \u0275\u0275attribute("draggable", false);
      \u0275\u0275advance(2);
      \u0275\u0275attribute("draggable", false);
      \u0275\u0275advance(2);
      \u0275\u0275attribute("draggable", false);
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ShowReelsWidget, { className: "ShowReelsWidget", filePath: "src/app/pages/landing/components/showreelswidget.ts", lineNumber: 17 });
})();

// src/app/pages/landing/components/newsletterwidget.ts
var NewsletterWidget = class _NewsletterWidget {
  static \u0275fac = function NewsletterWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NewsletterWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NewsletterWidget, selectors: [["newsletter-widget"]], hostAttrs: [1, "py-12", "px-6", "mt-12", "w-full", "flex", "justify-center"], decls: 9, vars: 0, consts: [[1, "p-8", "flex", "flex-col", "gap-4", "items-start", "justify-between", "lg:flex-row", "lg:items-center", "rounded-2xl", "w-full", 2, "background", "linear-gradient(110.43deg, #868cd0 0.04%, #ff5759 100.11%)", "max-width", "1200px"], [1, "flex", "flex-col", "gap-2"], [1, "m-0", "text-white", "font-bold", "text-2xl"], [1, "m-0", "text-white"], [1, "flex", "items-center", "gap-2"], ["pInputText", "", "placeholder", "Email Address", 1, "!bg-transparent", "!border-white", "!rounded-md", "placeholder:!text-white"], ["pButton", "", "pRipple", "", "text", "", "label", "JOIN", 1, "!text-white", "!border", "!border-white", "!rounded-md", "h-full"]], template: function NewsletterWidget_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1", 2);
      \u0275\u0275text(3, "NEWSLETTER");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Sign up for our newsletter and stay up-to-date on the latest features and updates for our platform.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4);
      \u0275\u0275element(7, "input", 5)(8, "button", 6);
      \u0275\u0275elementEnd()();
    }
  }, dependencies: [InputText, ButtonModule, ButtonDirective, RippleModule, Ripple], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NewsletterWidget, { className: "NewsletterWidget", filePath: "src/app/pages/landing/components/newsletterwidget.ts", lineNumber: 24 });
})();

// src/app/pages/landing/landing.ts
var Landing = class _Landing {
  layoutService = inject(LayoutService);
  ngOnInit() {
    if (!this.layoutService.isDarkTheme()) {
      this.layoutService.layoutConfig.update((state) => __spreadProps(__spreadValues({}, state), {
        darkTheme: true
      }));
    }
  }
  ngOnDestroy() {
    this.layoutService.layoutConfig.update((state) => __spreadProps(__spreadValues({}, state), {
      menuTheme: state.darkTheme ? "dark" : "light"
    }));
  }
  static \u0275fac = function Landing_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Landing)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Landing, selectors: [["app-landing"]], decls: 13, vars: 0, consts: [[1, "bg-surface-50", "dark:bg-surface-950"], [1, "h-screen"], [1, "h-screen", "overflow-x-hidden", "overflow-y-auto", "absolute", "top-0", "left-0", "right-0", "bottom-0", 2, "perspective", "101px"], ["id", "parallaxBody", 1, "lg:top-full", "block", "absolute", "left-0", "right-0", "h-full", "z-20"]], template: function Landing_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "topbar");
      \u0275\u0275elementStart(2, "div", 1)(3, "div", 2);
      \u0275\u0275element(4, "hero-widget");
      \u0275\u0275elementStart(5, "div", 3);
      \u0275\u0275element(6, "who-uses-widget");
      \u0275\u0275elementStart(7, "features-widget");
      \u0275\u0275element(8, "collaboration-widget")(9, "easy-follow-widget")(10, "show-reels-widget")(11, "newsletter-widget")(12, "footer-widget");
      \u0275\u0275elementEnd()()()()();
    }
  }, dependencies: [RouterModule, Topbar, HeroWidget, WhoUsesWidget, FeaturesWidget, CollaborationWidget, EasyFollowWidget, ShowReelsWidget, NewsletterWidget, FooterWidget], styles: ["\n\n[_ngcontent-%COMP%]::placeholder {\n  color: #fff;\n}\n/*# sourceMappingURL=landing.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Landing, { className: "Landing", filePath: "src/app/pages/landing/landing.ts", lineNumber: 44 });
})();
export {
  Landing
};
//# sourceMappingURL=chunk-R2QDDH36.js.map
