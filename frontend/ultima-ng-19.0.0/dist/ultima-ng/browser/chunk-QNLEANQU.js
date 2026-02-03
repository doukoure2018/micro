import {
  Timeline,
  TimelineModule
} from "./chunk-YFROPUH7.js";
import {
  Card,
  CardModule
} from "./chunk-H46GQ57A.js";
import {
  Button,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import "./chunk-AP3OAIHW.js";
import "./chunk-NQNBRQ7H.js";
import {
  CommonModule,
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
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵsanitizeUrl,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// src/app/pages/uikit/timelinedemo.ts
var _c0 = (a0) => ({ "background-color": a0 });
function TimelineDemo_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const event_r1 = ctx.$implicit;
    \u0275\u0275textInterpolate1(" ", event_r1.status, " ");
  }
}
function TimelineDemo_ng_template_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const event_r2 = ctx.$implicit;
    \u0275\u0275textInterpolate1(" ", event_r2.status, " ");
  }
}
function TimelineDemo_ng_template_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const event_r3 = ctx.$implicit;
    \u0275\u0275textInterpolate1(" ", event_r3.status, " ");
  }
}
function TimelineDemo_ng_template_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const event_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(event_r4.date);
  }
}
function TimelineDemo_ng_template_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const event_r5 = ctx.$implicit;
    \u0275\u0275textInterpolate1(" ", event_r5.status, " ");
  }
}
function TimelineDemo_ng_template_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 18);
    \u0275\u0275element(1, "i");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const event_r6 = ctx.$implicit;
    \u0275\u0275styleMap(\u0275\u0275pureFunction1(4, _c0, event_r6.color));
    \u0275\u0275advance();
    \u0275\u0275classMap(event_r6.icon);
  }
}
function TimelineDemo_ng_template_38_img_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 22);
  }
  if (rf & 2) {
    const event_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("src", "/images/product/" + event_r7.image, \u0275\u0275sanitizeUrl)("alt", event_r7.name);
  }
}
function TimelineDemo_ng_template_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-card", 19);
    \u0275\u0275template(1, TimelineDemo_ng_template_38_img_1_Template, 1, 2, "img", 20);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, " Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas! ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "p-button", 21);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const event_r7 = ctx.$implicit;
    \u0275\u0275property("header", event_r7.status)("subheader", event_r7.date);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", event_r7.image);
    \u0275\u0275advance(3);
    \u0275\u0275property("text", true);
  }
}
function TimelineDemo_ng_template_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const event_r8 = ctx.$implicit;
    \u0275\u0275textInterpolate1(" ", event_r8, " ");
  }
}
function TimelineDemo_ng_template_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const event_r9 = ctx.$implicit;
    \u0275\u0275textInterpolate1(" ", event_r9, " ");
  }
}
function TimelineDemo_ng_template_57_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const event_r10 = ctx.$implicit;
    \u0275\u0275textInterpolate1(" ", event_r10, " ");
  }
}
function TimelineDemo_ng_template_59_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \xA0 ");
  }
}
var TimelineDemo = class _TimelineDemo {
  events1 = [];
  events2 = [];
  ngOnInit() {
    this.events1 = [
      {
        status: "Ordered",
        date: "15/10/2024 10:30",
        icon: "pi pi-shopping-cart",
        color: "#9C27B0",
        image: "game-controller.jpg"
      },
      {
        status: "Processing",
        date: "15/10/2024 14:00",
        icon: "pi pi-cog",
        color: "#673AB7"
      },
      {
        status: "Shipped",
        date: "15/10/2024 16:15",
        icon: "pi pi-envelope",
        color: "#FF9800"
      },
      {
        status: "Delivered",
        date: "16/10/2024 10:00",
        icon: "pi pi-check",
        color: "#607D8B"
      }
    ];
    this.events2 = ["2021", "2022", "2023", "2024"];
  }
  static \u0275fac = function TimelineDemo_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TimelineDemo)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TimelineDemo, selectors: [["app-timeline-demo"]], decls: 61, vars: 8, consts: [["content", ""], ["opposite", ""], ["marker", ""], [1, "grid", "grid-cols-12", "gap-8"], [1, "col-span-6"], [1, "card"], [1, "font-semibold", "text-xl", "mb-4"], [3, "value"], ["align", "right", 3, "value"], ["align", "alternate", 3, "value"], [1, "col-span-full"], ["align", "alternate", "styleClass", "customized-timeline", 3, "value"], [1, "font-semibold", "mb-2"], ["layout", "horizontal", "align", "top", 3, "value"], [1, "font-semibold", "mt-4", "mb-2"], ["layout", "horizontal", "align", "bottom", 3, "value"], ["layout", "horizontal", "align", "alternate", 3, "value"], [1, "p-text-secondary"], [1, "flex", "w-8", "h-8", "items-center", "justify-center", "text-white", "rounded-full", "z-10", "shadow-sm"], [3, "header", "subheader"], ["width", "200", "class", "shadow", 3, "src", "alt", 4, "ngIf"], ["label", "Read more", 3, "text"], ["width", "200", 1, "shadow", 3, "src", "alt"]], template: function TimelineDemo_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 3)(1, "div", 4)(2, "div", 5)(3, "div", 6);
      \u0275\u0275text(4, "Left Align");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p-timeline", 7);
      \u0275\u0275template(6, TimelineDemo_ng_template_6_Template, 1, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(8, "div", 4)(9, "div", 5)(10, "div", 6);
      \u0275\u0275text(11, "Right Align");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "p-timeline", 8);
      \u0275\u0275template(13, TimelineDemo_ng_template_13_Template, 1, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(15, "div", 4)(16, "div", 5)(17, "div", 6);
      \u0275\u0275text(18, "Alternate Align");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "p-timeline", 9);
      \u0275\u0275template(20, TimelineDemo_ng_template_20_Template, 1, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(22, "div", 4)(23, "div", 5)(24, "div", 6);
      \u0275\u0275text(25, "Opposite Content");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "p-timeline", 7);
      \u0275\u0275template(27, TimelineDemo_ng_template_27_Template, 2, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor)(29, TimelineDemo_ng_template_29_Template, 1, 1, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(31, "div", 10)(32, "div", 5)(33, "div", 6);
      \u0275\u0275text(34, "Templating");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(35, "p-timeline", 11);
      \u0275\u0275template(36, TimelineDemo_ng_template_36_Template, 2, 6, "ng-template", null, 2, \u0275\u0275templateRefExtractor)(38, TimelineDemo_ng_template_38_Template, 5, 4, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(40, "div", 10)(41, "div", 5)(42, "div", 6);
      \u0275\u0275text(43, "Horizontal");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(44, "div", 12);
      \u0275\u0275text(45, "Top Align");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(46, "p-timeline", 13);
      \u0275\u0275template(47, TimelineDemo_ng_template_47_Template, 1, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(49, "div", 14);
      \u0275\u0275text(50, "Bottom Align");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(51, "p-timeline", 15);
      \u0275\u0275template(52, TimelineDemo_ng_template_52_Template, 1, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(54, "div", 14);
      \u0275\u0275text(55, "Alternate Align");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(56, "p-timeline", 16);
      \u0275\u0275template(57, TimelineDemo_ng_template_57_Template, 1, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor)(59, TimelineDemo_ng_template_59_Template, 1, 0, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(5);
      \u0275\u0275property("value", ctx.events1);
      \u0275\u0275advance(7);
      \u0275\u0275property("value", ctx.events1);
      \u0275\u0275advance(7);
      \u0275\u0275property("value", ctx.events1);
      \u0275\u0275advance(7);
      \u0275\u0275property("value", ctx.events1);
      \u0275\u0275advance(9);
      \u0275\u0275property("value", ctx.events1);
      \u0275\u0275advance(11);
      \u0275\u0275property("value", ctx.events2);
      \u0275\u0275advance(5);
      \u0275\u0275property("value", ctx.events2);
      \u0275\u0275advance(5);
      \u0275\u0275property("value", ctx.events2);
    }
  }, dependencies: [CommonModule, NgIf, TimelineModule, Timeline, ButtonModule, Button, CardModule, Card], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TimelineDemo, { className: "TimelineDemo", filePath: "src/app/pages/uikit/timelinedemo.ts", lineNumber: 105 });
})();
export {
  TimelineDemo
};
//# sourceMappingURL=chunk-QNLEANQU.js.map
