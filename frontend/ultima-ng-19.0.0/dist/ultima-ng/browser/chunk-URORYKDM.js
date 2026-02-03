import {
  Knob,
  KnobModule
} from "./chunk-ZRJPB4WQ.js";
import {
  AvatarGroup
} from "./chunk-NE67ECLX.js";
import {
  ChartModule,
  UIChart
} from "./chunk-D6T4WP2M.js";
import {
  LayoutService
} from "./chunk-ZGNAW63S.js";
import {
  Avatar,
  AvatarModule
} from "./chunk-MCGUCMXD.js";
import {
  Checkbox,
  CheckboxModule
} from "./chunk-4JIPYACT.js";
import "./chunk-6GA37Q7Z.js";
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
import {
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-3HTR5OU7.js";
import {
  CommonModule,
  NgClass,
  NgForOf,
  NgIf
} from "./chunk-SQQPVFHK.js";
import {
  EventEmitter,
  debounceTime,
  inject,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// src/app/pages/dashboard/saas/components/introducewidget.ts
function IntroduceWidget_span_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "span", 18);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const todo_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", todo_r1.quantity, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(todo_r1.name);
  }
}
var IntroduceWidget = class _IntroduceWidget {
  todos = [
    {
      name: "tasks",
      quantity: 72
    },
    {
      name: "production",
      quantity: 4
    },
    {
      name: "tests",
      quantity: 18
    },
    {
      name: "meetings",
      quantity: 13
    }
  ];
  static \u0275fac = function IntroduceWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _IntroduceWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _IntroduceWidget, selectors: [["introduce-widget"]], decls: 24, vars: 1, consts: [[1, "card", "h-full"], [1, "p-2", "h-full", "flex", "flex-col", "justify-between"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "flex", "gap-4", "flex-col", "justify-between", "w-full", "md:flex-row", "md:items-center"], [1, "flex", "gap-4", "items-center"], [1, "text-4xl"], [1, "flex", "flex-col", "gap-1", "text-surface-600", "dark:text-surface-200"], [1, "text-2xl", "font-semibold"], [1, "text-color"], [1, "font-bold", "text-primary"], [1, "flex", "items-center", "gap-2"], ["pButton", "", "pRipple", "", "label", "Enroll a Ticket", "icon", "pi pi-send", "outlined", ""], ["pButton", "", "pRipple", "", "label", "Upgrade Your Plan", "icon", "pi pi-chart-line"], [1, "flex", "flex-col", "gap-2", "text-primary", "mt-6", "md:mt-0"], [1, "font-bold", "text-sm"], [1, "grid", "grid-cols-12", "gap-4", "grid-nogutter", "font-medium"], ["class", "col-span-6 text-6xl md:col-span-3 flex items-center", 4, "ngFor", "ngForOf"], [1, "col-span-6", "text-6xl", "md:col-span-3", "flex", "items-center"], [1, "text-base", "ml-2"]], template: function IntroduceWidget_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "div", 5);
      \u0275\u0275text(6, "\u{1F44B}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "div", 6)(8, "span", 7);
      \u0275\u0275text(9, "Hi,");
      \u0275\u0275elementStart(10, "span", 8);
      \u0275\u0275text(11, " Amy!");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(12, "span");
      \u0275\u0275text(13, "Team Lead ");
      \u0275\u0275elementStart(14, "span", 9);
      \u0275\u0275text(15, "@UX Designer");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(16, "div", 10);
      \u0275\u0275element(17, "button", 11)(18, "button", 12);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(19, "div", 13)(20, "span", 14);
      \u0275\u0275text(21, "Done in Current Month");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "div", 15);
      \u0275\u0275template(23, IntroduceWidget_span_23_Template, 4, 2, "span", 16);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(23);
      \u0275\u0275property("ngForOf", ctx.todos);
    }
  }, dependencies: [CommonModule, NgForOf, ButtonModule, ButtonDirective, RippleModule, Ripple], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(IntroduceWidget, { className: "IntroduceWidget", filePath: "src/app/pages/dashboard/saas/components/introducewidget.ts", lineNumber: 39 });
})();

// src/app/pages/dashboard/saas/components/upgradewidget.ts
var UpgradeWidget = class _UpgradeWidget {
  static \u0275fac = function UpgradeWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UpgradeWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _UpgradeWidget, selectors: [["upgrade-widget"]], decls: 12, vars: 1, consts: [[1, "h-full", "bg-primary", "flex", "justify-between", "items-center", "pl-8", "py-4", "rounded-md", "overflow-hidden"], [1, "flex", "flex-col", "justify-center"], [1, "font-bold", "text-white", "dark:text-surface-900", "text-sm"], [1, "font-bold", "text-white", "dark:text-surface-900", "mt-1", "text-4xl", "m-0"], ["pButton", "", "pRipple", "", "icon", "pi pi-database", "label", "See All Plans", "outlined", "", 1, "!bg-white", "mt-4", "dark:!text-surface-900"], ["src", "/images/dashboard/saas-card.png", "alt", "", 1, "-mr-4"]], template: function UpgradeWidget_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div")(3, "span", 2);
      \u0275\u0275text(4, "Carry your team on top");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "div")(6, "span", 3);
      \u0275\u0275text(7, "Upgrade Now");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div");
      \u0275\u0275element(9, "button", 4);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "div");
      \u0275\u0275element(11, "img", 5);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(11);
      \u0275\u0275attribute("draggable", false);
    }
  }, dependencies: [ButtonModule, ButtonDirective, RippleModule, Ripple], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(UpgradeWidget, { className: "UpgradeWidget", filePath: "src/app/pages/dashboard/saas/components/upgradewidget.ts", lineNumber: 22 });
})();

// src/app/pages/dashboard/saas/components/dailytaskwidget.ts
function DailyTaskWidget_div_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 11)(1, "div", 12)(2, "div")(3, "p-checkbox", 13);
    \u0275\u0275listener("onChange", function DailyTaskWidget_div_15_Template_p_checkbox_onChange_3_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.changeChecked());
    });
    \u0275\u0275twoWayListener("ngModelChange", function DailyTaskWidget_div_15_Template_p_checkbox_ngModelChange_3_listener($event) {
      const task_r3 = \u0275\u0275restoreView(_r1).$implicit;
      \u0275\u0275twoWayBindingSet(task_r3.checked, $event) || (task_r3.checked = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 14)(5, "span", 15);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 16);
    \u0275\u0275element(8, "i", 17)(9, "i", 18)(10, "i", 19);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "div", 12)(12, "div", 20)(13, "p-avatar-group");
    \u0275\u0275element(14, "p-avatar", 21)(15, "p-avatar", 22);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 23);
    \u0275\u0275element(17, "i", 24);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const task_r3 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", task_r3.checked);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(task_r3.label);
    \u0275\u0275advance(8);
    \u0275\u0275property("image", task_r3.avatar);
  }
}
var DailyTaskWidget = class _DailyTaskWidget {
  dailyTasks = [];
  completeTask = 1;
  changeChecked() {
    this.completeTask = this.dailyTasks.filter((task) => task.checked).length;
  }
  static \u0275fac = function DailyTaskWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DailyTaskWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DailyTaskWidget, selectors: [["daily-task-widget"]], hostAttrs: [1, "col-span-12", "md:col-span-4"], inputs: { dailyTasks: "dailyTasks" }, decls: 16, vars: 6, consts: [[1, "flex", "flex-col", "gap-4", "rounded-md", "border", "h-full", "border-surface", "py-6"], [1, "flex", "justify-between", "items-center", "mx-6"], [1, "flex", "items-center", "gap-4"], ["rangeColor", "#EEEEEE", "readonly", "", 3, "ngModelChange", "showValue", "size", "max", "ngModel"], [1, "flex", "flex-col", "justify-between", "gap-1"], [1, "font-bold", "text-surface-900", "dark:text-surface-0"], [1, "text-muted-color", "text-sm"], [1, "font-bold"], ["pButton", "", "pRipple", "", "icon", "pi pi-plus", "label", "New Task", "outlined", ""], [1, "flex", "flex-col", "gap-2", "h-[21rem]", "overflow-auto", "-mb-6"], ["class", "flex justify-between p-4 bg-surface-50 dark:bg-surface-800 cursor-pointer text-muted-color rounded-md mx-6 hover:bg-surface-0 dark:hover:bg-surface-900 hover:shadow", 4, "ngFor", "ngForOf"], [1, "flex", "justify-between", "p-4", "bg-surface-50", "dark:bg-surface-800", "cursor-pointer", "text-muted-color", "rounded-md", "mx-6", "hover:bg-surface-0", "dark:hover:bg-surface-900", "hover:shadow"], [1, "flex", "gap-4"], ["binary", "", 3, "onChange", "ngModelChange", "ngModel"], [1, "flex", "flex-col", "gap-2"], [1, "font-medium", "text-sm"], [1, "flex", "gap-2", "items-center"], [1, "pi", "pi-align-left", "text-muted-color"], [1, "pi", "pi-file", "text-muted-color"], [1, "pi", "pi-image", "text-muted-color"], [1, "flex", "items-end"], ["shape", "circle", 3, "image"], ["label", "+2", "shape", "circle", 1, "bg-surface-200", "dark:bg-surface-600", "text-muted-color"], [1, "flex", "items-center"], [1, "pi", "pi-ellipsis-h", "text-muted-color"]], template: function DailyTaskWidget_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div")(4, "p-knob", 3);
      \u0275\u0275twoWayListener("ngModelChange", function DailyTaskWidget_Template_p_knob_ngModelChange_4_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.completeTask, $event) || (ctx.completeTask = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "div", 4)(6, "span", 5);
      \u0275\u0275text(7, "My Daily Tasks");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "span", 6)(9, "span", 7);
      \u0275\u0275text(10);
      \u0275\u0275elementEnd();
      \u0275\u0275text(11, "/5 Tasks");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(12, "div");
      \u0275\u0275element(13, "button", 8);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(14, "div", 9);
      \u0275\u0275template(15, DailyTaskWidget_div_15_Template, 18, 3, "div", 10);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275property("showValue", false)("size", 36)("max", 5);
      \u0275\u0275twoWayProperty("ngModel", ctx.completeTask);
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate(ctx.completeTask);
      \u0275\u0275advance(5);
      \u0275\u0275property("ngForOf", ctx.dailyTasks);
    }
  }, dependencies: [CommonModule, NgForOf, FormsModule, NgControlStatus, NgModel, KnobModule, Knob, ButtonModule, ButtonDirective, RippleModule, Ripple, CheckboxModule, Checkbox, AvatarModule, Avatar, AvatarGroup], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DailyTaskWidget, { className: "DailyTaskWidget", filePath: "src/app/pages/dashboard/saas/components/dailytaskwidget.ts", lineNumber: 66 });
})();

// src/app/pages/dashboard/saas/components/performancewidget.ts
var PerformanceWidget = class _PerformanceWidget {
  layoutService = inject(LayoutService);
  basicData;
  basicOptions;
  subscription;
  constructor() {
    this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(50)).subscribe(() => {
      this.initChart();
    });
  }
  ngOnInit() {
    this.initChart();
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  initChart() {
    this.basicData = this.setChartData();
    this.basicOptions = this.setChartOptions();
  }
  setChartOptions() {
    const textColor = getComputedStyle(document.body).getPropertyValue("--text-color");
    const surfaceBorder = getComputedStyle(document.body).getPropertyValue("--surface-border");
    return {
      plugins: {
        legend: {
          labels: {
            color: textColor,
            boxWidth: 12,
            boxHeight: 4
          },
          position: "bottom"
        }
      },
      maintainAspectRatio: false,
      elements: { point: { radius: 0 } },
      scales: {
        x: {
          ticks: {
            color: textColor
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          ticks: {
            color: textColor,
            stepSize: 10
          },
          grid: {
            color: surfaceBorder
          }
        }
      }
    };
  }
  setChartData() {
    return {
      labels: ["January", "February", "March", "April", "May"],
      datasets: [
        {
          label: "Previous Month",
          borderColor: "#E0E0E0",
          tension: 0.5,
          data: [22, 36, 11, 33, 2]
        },
        {
          label: "Current Month",
          borderColor: "#6366F1",
          tension: 0.5,
          data: [22, 16, 31, 11, 38]
        }
      ]
    };
  }
  static \u0275fac = function PerformanceWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PerformanceWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PerformanceWidget, selectors: [["performance-widget"]], hostAttrs: [1, "col-span-12", "md:col-span-4"], decls: 15, vars: 2, consts: [[1, "flex", "flex-col", "gap-4", "rounded-md", "border", "h-full", "border-surface", "p-6"], [1, "flex", "justify-between", "items-center"], [1, "flex", "items-center", "gap-4"], [1, "pi", "pi-chart-bar", "text-primary", "text-3xl"], [1, "flex", "flex-col", "justify-between", "gap-1"], [1, "font-bold", "text-surface-900", "dark:text-surface-0"], [1, "flex", "items-center", "gap-1"], [1, "flex", "items-center", "justify-center", "gap-1", "rounded-md", "p-2", "bg-red-100", "text-red-400"], [1, "pi", "pi-arrow-down-right"], [1, "flex", "flex-col", "gap-2", "h-[21rem]", "-mb-6", "relative"], ["height", "300", "type", "line", 3, "data", "options"]], template: function PerformanceWidget_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div");
      \u0275\u0275element(4, "i", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div", 4)(6, "span", 5);
      \u0275\u0275text(7, "My Performance");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(8, "div", 6)(9, "div", 7);
      \u0275\u0275element(10, "i", 8);
      \u0275\u0275elementStart(11, "span");
      \u0275\u0275text(12, "-13%");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(13, "div", 9);
      \u0275\u0275element(14, "p-chart", 10);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(14);
      \u0275\u0275property("data", ctx.basicData)("options", ctx.basicOptions);
    }
  }, dependencies: [ChartModule, UIChart], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PerformanceWidget, { className: "PerformanceWidget", filePath: "src/app/pages/dashboard/saas/components/performancewidget.ts", lineNumber: 35 });
})();

// src/app/pages/dashboard/saas/components/calendarwidget.ts
function CalendarWidget_div_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13)(1, "div", 14)(2, "div", 15)(3, "span", 16);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 6);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 17);
    \u0275\u0275element(8, "i", 18);
    \u0275\u0275text(9, " 10:30 AM");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 19);
    \u0275\u0275element(11, "i", 20);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const task_r1 = ctx.$implicit;
    \u0275\u0275classMap(task_r1.borderColor);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(task_r1.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(task_r1.description);
  }
}
var CalendarWidget = class _CalendarWidget {
  dailyTasks = [];
  static \u0275fac = function CalendarWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CalendarWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CalendarWidget, selectors: [["calendar-widget"]], hostAttrs: [1, "col-span-12", "md:col-span-4"], inputs: { dailyTasks: "dailyTasks" }, decls: 17, vars: 1, consts: [[1, "flex", "flex-col", "gap-4", "rounded-md", "border", "h-full", "border-surface", "py-6"], [1, "flex", "justify-between", "items-center", "mx-6"], [1, "flex", "items-center", "gap-4"], [1, "pi", "pi-calendar", "text-primary", "text-3xl"], [1, "flex", "flex-col", "justify-between", "gap-1"], [1, "font-bold", "text-surface-900", "dark:text-surface-0"], [1, "text-muted-color", "text-sm"], [1, "font-bold"], [1, "flex", "items-center", "gap-1"], ["pButton", "", "pRipple", "", "icon", "pi pi-filter", "outlined", ""], ["pButton", "", "pRipple", "", "icon", "pi pi-plus", "outlined", ""], [1, "flex", "flex-col", "gap-2", "h-[21rem]", "overflow-auto", "-mb-6"], ["class", "flex justify-between px-4 py-2 border-l-2 cursor-pointer mx-6 rounded-md bg-surface-50 dark:bg-surface-800 hover:shadow hover:bg-surface-0 dark:hover:bg-surface-900", 3, "class", 4, "ngFor", "ngForOf"], [1, "flex", "justify-between", "px-4", "py-2", "border-l-2", "cursor-pointer", "mx-6", "rounded-md", "bg-surface-50", "dark:bg-surface-800", "hover:shadow", "hover:bg-surface-0", "dark:hover:bg-surface-900"], [1, "flex", "justify-between", "gap-4"], [1, "flex", "flex-col", "justify-center", "gap-2"], [1, "font-medium", "text-base", "text-color"], [1, "flex", "items-center", "font-medium", "gap-1", "text-muted-color", "text-xs"], [1, "pi", "pi-clock"], [1, "flex", "items-center"], [1, "pi", "pi-ellipsis-h", "text-muted-color"]], template: function CalendarWidget_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div");
      \u0275\u0275element(4, "i", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div", 4)(6, "span", 5);
      \u0275\u0275text(7, "My Calendar");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "span", 6)(9, "span", 7);
      \u0275\u0275text(10, "19");
      \u0275\u0275elementEnd();
      \u0275\u0275text(11, " Events on this month");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(12, "div", 8);
      \u0275\u0275element(13, "button", 9)(14, "button", 10);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(15, "div", 11);
      \u0275\u0275template(16, CalendarWidget_div_16_Template, 12, 4, "div", 12);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(16);
      \u0275\u0275property("ngForOf", ctx.dailyTasks);
    }
  }, dependencies: [CommonModule, NgForOf, ButtonModule, ButtonDirective, RippleModule, Ripple], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CalendarWidget, { className: "CalendarWidget", filePath: "src/app/pages/dashboard/saas/components/calendarwidget.ts", lineNumber: 45 });
})();

// src/app/pages/dashboard/saas/components/myworkspacewidget.ts
var MyWorkspaceWidget = class _MyWorkspaceWidget {
  dailyTasks = [
    {
      id: 1,
      checked: true,
      label: "Prepare personas",
      description: "Create profiles of fictional users representing target audience for product or service.",
      avatar: "/images/avatar/circle/avatar-f-6.png",
      borderColor: "border-pink-500"
    },
    {
      id: 2,
      checked: false,
      label: "Prepare a user journey map",
      description: "Visual representation of steps a user takes to accomplish a goal within product or service.",
      avatar: "/images/avatar/circle/avatar-f-7.png",
      borderColor: "border-purple-500"
    },
    {
      id: 3,
      checked: false,
      label: "Prepare wireframes for onboarding screen",
      description: "Create low-fidelity mockups of onboarding screen. Include layout, hierarchy, functionality.",
      avatar: "/images/avatar/circle/avatar-f-8.png",
      borderColor: "border-blue-500"
    },
    {
      id: 4,
      checked: false,
      label: "Review benchmarks",
      description: "Conduct research on similar products or services to understand market standards and identify opportunities.",
      avatar: "/images/avatar/circle/avatar-f-9.png",
      borderColor: "border-green-500"
    },
    {
      id: 5,
      checked: false,
      label: "Let a plan with UI Team",
      description: "Collaborate with UI design team to create plan for visual design of product or service.",
      avatar: "/images/avatar/circle/avatar-f-10.png",
      borderColor: "border-yellow-500"
    }
  ];
  static \u0275fac = function MyWorkspaceWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MyWorkspaceWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MyWorkspaceWidget, selectors: [["my-workspace-widget"]], decls: 9, vars: 2, consts: [[1, "card", "flex", "justify-between", "items-center"], [1, "p-2", "h-full", "w-full", "flex", "flex-col", "justify-between"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "font-semibold", "text-lg", "text-surface-900", "dark:text-surface-0"], [1, "grid", "grid-cols-12", "gap-8"], [3, "dailyTasks"]], template: function MyWorkspaceWidget_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "span", 3);
      \u0275\u0275text(4, "My Workspace");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "div", 4);
      \u0275\u0275element(6, "daily-task-widget", 5)(7, "performance-widget")(8, "calendar-widget", 5);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275property("dailyTasks", ctx.dailyTasks);
      \u0275\u0275advance(2);
      \u0275\u0275property("dailyTasks", ctx.dailyTasks);
    }
  }, dependencies: [DailyTaskWidget, PerformanceWidget, CalendarWidget], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MyWorkspaceWidget, { className: "MyWorkspaceWidget", filePath: "src/app/pages/dashboard/saas/components/myworkspacewidget.ts", lineNumber: 23 });
})();

// src/app/pages/dashboard/saas/components/saastablewidget.ts
function SaasTableWidget_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2)(1, "div", 3)(2, "div", 4);
    \u0275\u0275element(3, "p-avatar", 5);
    \u0275\u0275elementStart(4, "div", 6)(5, "span", 7);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 8);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(9, "div", 9)(10, "div", 10)(11, "div", 11)(12, "span", 7);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span", 8);
    \u0275\u0275text(15, "Task");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 11)(17, "span", 7);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span", 8);
    \u0275\u0275text(20, "Done");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div", 11)(22, "span", 7);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "span", 8);
    \u0275\u0275text(25, "Sprint");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "div", 11)(27, "span", 7);
    \u0275\u0275text(28);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "span", 8);
    \u0275\u0275text(30, "On Projects");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(31, "div", 12)(32, "div", 13);
    \u0275\u0275element(33, "button", 14);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const member_r1 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275property("image", member_r1.avatar);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(member_r1.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(member_r1.title);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(member_r1.taskCount);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(member_r1.doneCount);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(member_r1.sprintCount);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(member_r1.onProjectsCount);
  }
}
var SaasTableWidget = class _SaasTableWidget {
  filteredTeamMembers = [];
  static \u0275fac = function SaasTableWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SaasTableWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SaasTableWidget, selectors: [["saas-table-widget"]], hostAttrs: [1, "col-span-12", "md:col-span-8"], inputs: { filteredTeamMembers: "filteredTeamMembers" }, decls: 2, vars: 1, consts: [[1, "border", "border-surface", "rounded-md", "h-[28rem]", "overflow-y-auto"], ["class", "grid grid-cols-12 gap-4 grid-nogutter items-center p-4 border-b border-surface text-surface-700 dark:text-surface-100 cursor-pointer hover:text-color", 4, "ngFor", "ngForOf"], [1, "grid", "grid-cols-12", "gap-4", "grid-nogutter", "items-center", "p-4", "border-b", "border-surface", "text-surface-700", "dark:text-surface-100", "cursor-pointer", "hover:text-color"], [1, "col-span-4"], [1, "flex", "items-center", "gap-4"], ["size", "large", "shape", "circle", 3, "image"], [1, "flex", "flex-col", "flex-wrap"], [1, "font-medium"], [1, "text-sm"], [1, "col-span-6"], [1, "flex", "justify-between", "gap-8", "flex-1"], [1, "flex", "flex-col", 2, "flex-basis", "100%"], [1, "col-span-2"], [1, "flex", "justify-end"], ["pButton", "", "pRipple", "", "rounded", "", "text", "", "icon", "pi pi-ellipsis-h", 1, "text-surface-900", "dark:text-surface-0"]], template: function SaasTableWidget_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275template(1, SaasTableWidget_div_1_Template, 34, 7, "div", 1);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275property("ngForOf", ctx.filteredTeamMembers);
    }
  }, dependencies: [CommonModule, NgForOf, AvatarModule, Avatar, ButtonModule, ButtonDirective, RippleModule, Ripple], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SaasTableWidget, { className: "SaasTableWidget", filePath: "src/app/pages/dashboard/saas/components/saastablewidget.ts", lineNumber: 53 });
})();

// src/app/pages/dashboard/saas/components/teamswidget.ts
var _c0 = (a0) => ({ "bg-primary-50 border-primary-100 dark:bg-primary-900": a0 });
var _c1 = () => ({ width: "7px", height: "7px" });
var _c2 = () => ({ color: "#ffffff" });
function TeamsWidget_div_9_p_avatar_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-avatar", 14);
  }
  if (rf & 2) {
    const avatar_r4 = ctx.$implicit;
    \u0275\u0275property("image", avatar_r4);
  }
}
function TeamsWidget_div_9_p_avatar_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-avatar", 15);
  }
  if (rf & 2) {
    const team_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(3, _c2));
    \u0275\u0275property("label", team_r2 == null ? null : team_r2.avatarText);
  }
}
function TeamsWidget_div_9_i_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 16);
  }
}
function TeamsWidget_div_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275listener("click", function TeamsWidget_div_9_Template_div_click_0_listener() {
      const team_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.teamFilter(team_r2.title));
    });
    \u0275\u0275elementStart(1, "div", 8);
    \u0275\u0275element(2, "div", 9);
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 10)(6, "p-avatar-group");
    \u0275\u0275template(7, TeamsWidget_div_9_p_avatar_7_Template, 1, 1, "p-avatar", 11)(8, TeamsWidget_div_9_p_avatar_8_Template, 1, 4, "p-avatar", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275template(9, TeamsWidget_div_9_i_9_Template, 1, 0, "i", 13);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const team_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(8, _c0, ctx_r2.selectedTeam === team_r2.title));
    \u0275\u0275advance(2);
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(10, _c1));
    \u0275\u0275property("ngClass", team_r2.badgeClass);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(team_r2.title);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", team_r2 == null ? null : team_r2.avatar);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", team_r2 == null ? null : team_r2.avatarText);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.selectedTeam === team_r2.title);
  }
}
var TeamsWidget = class _TeamsWidget {
  selectedTeam;
  onTeamFilter = new EventEmitter();
  teams = [
    {
      title: "UX Researchers",
      avatar: [
        "/images/avatar/circle/avatar-f-1.png",
        "/images/avatar/circle/avatar-f-6.png",
        "/images/avatar/circle/avatar-f-11.png",
        "/images/avatar/circle/avatar-f-12.png"
      ],
      avatarText: "+4",
      badgeClass: "bg-pink-500"
    },
    {
      title: "UX Designers",
      avatar: ["/images/avatar/circle/avatar-f-2.png"],
      badgeClass: "bg-blue-500"
    },
    {
      title: "UI Designers",
      avatar: ["/images/avatar/circle/avatar-f-3.png", "/images/avatar/circle/avatar-f-8.png"],
      avatarText: "+1",
      badgeClass: "bg-green-500"
    },
    {
      title: "Front-End Developers",
      avatar: ["/images/avatar/circle/avatar-f-4.png", "/images/avatar/circle/avatar-f-9.png"],
      badgeClass: "bg-yellow-500"
    },
    {
      title: "Back-End Developers",
      avatar: ["/images/avatar/circle/avatar-f-10.png"],
      badgeClass: "bg-purple-500"
    }
  ];
  teamFilter(team) {
    this.onTeamFilter.emit(team);
  }
  static \u0275fac = function TeamsWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TeamsWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TeamsWidget, selectors: [["teams-widget"]], hostAttrs: [1, "col-span-12", "md:col-span-4"], inputs: { selectedTeam: "selectedTeam" }, outputs: { onTeamFilter: "onTeamFilter" }, decls: 10, vars: 1, consts: [[1, "border", "border-surface", "p-4", "rounded-md", "flex", "flex-col", "gap-4"], [1, "flex", "justify-between", "items-center"], [1, "flex", "flex-col", "gap-1"], [1, "font-semibold", "text-surface-900", "dark:text-surface-0", "text-lg"], [1, "text-sm", "text-muted-color"], ["pButton", "", "pRipple", "", "label", "New Team", "icon", "pi pi-users"], ["class", "flex justify-between items-center border border-transparent rounded-md p-4 -mx-2 cursor-pointer hover:bg-emphasis", 3, "ngClass", "click", 4, "ngFor", "ngForOf"], [1, "flex", "justify-between", "items-center", "border", "border-transparent", "rounded-md", "p-4", "-mx-2", "cursor-pointer", "hover:bg-emphasis", 3, "click", "ngClass"], [1, "flex", "items-center", "gap-4"], [1, "rounded-full", 3, "ngClass"], [1, "flex", "gap-2", "items-center"], ["shape", "circle", 3, "image", 4, "ngFor", "ngForOf"], ["shape", "circle", "class", "bg-surface-200 dark:bg-surface-600 text-muted-color", 3, "label", "style", 4, "ngIf"], ["class", "pi pi-chevron-right text-primary", 4, "ngIf"], ["shape", "circle", 3, "image"], ["shape", "circle", 1, "bg-surface-200", "dark:bg-surface-600", "text-muted-color", 3, "label"], [1, "pi", "pi-chevron-right", "text-primary"]], template: function TeamsWidget_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "span", 3);
      \u0275\u0275text(4, "Teams");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "span", 4);
      \u0275\u0275text(6, "18 Members");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(7, "button", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "div", 2);
      \u0275\u0275template(9, TeamsWidget_div_9_Template, 10, 11, "div", 6);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(9);
      \u0275\u0275property("ngForOf", ctx.teams);
    }
  }, dependencies: [CommonModule, NgClass, NgForOf, NgIf, ButtonModule, ButtonDirective, AvatarModule, Avatar, AvatarGroup, RippleModule, Ripple], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TeamsWidget, { className: "TeamsWidget", filePath: "src/app/pages/dashboard/saas/components/teamswidget.ts", lineNumber: 47 });
})();

// src/app/pages/dashboard/saas/components/projectoverviewwidget.ts
var ProjectOverviewWidget = class _ProjectOverviewWidget {
  selectedTeam = "UX Researchers";
  filteredTeamMembers;
  teamMembers = [
    {
      avatar: "/images/avatar/circle/avatar-f-1.png",
      name: "Theresa Webb",
      title: "UX Researchers",
      taskCount: 79,
      doneCount: 15,
      sprintCount: 72,
      onProjectsCount: 33,
      team: "UX Researchers"
    },
    {
      avatar: "/images/avatar/circle/avatar-f-2.png",
      name: "Courtney Henry",
      title: "President of Sales",
      taskCount: 22,
      doneCount: 11,
      sprintCount: 3,
      onProjectsCount: 12,
      team: "UX Researchers"
    },
    {
      avatar: "/images/avatar/circle/avatar-f-3.png",
      name: "Kathryn Murphy",
      title: "Web Designer",
      taskCount: 21,
      doneCount: 33,
      sprintCount: 11,
      onProjectsCount: 44,
      team: "UX Researchers"
    },
    {
      avatar: "/images/avatar/circle/avatar-f-4.png",
      name: "Diana Ross",
      title: "Project Manager",
      taskCount: 34,
      doneCount: 11,
      sprintCount: 45,
      onProjectsCount: 23,
      team: "UX Researchers"
    },
    {
      avatar: "/images/avatar/circle/avatar-f-5.png",
      name: "Emily Smith",
      title: "Software Engineer",
      taskCount: 22,
      doneCount: 3,
      sprintCount: 12,
      onProjectsCount: 1,
      team: "UX Researchers"
    },
    {
      avatar: "/images/avatar/circle/avatar-f-6.png",
      name: "Olivia Johnson",
      title: "Human Resources Manager",
      taskCount: 54,
      doneCount: 23,
      sprintCount: 29,
      onProjectsCount: 14,
      team: "UX Researchers"
    },
    {
      avatar: "/images/avatar/circle/avatar-f-7.png",
      name: "Sarah Williams",
      title: "Marketing Specialist",
      taskCount: 46,
      doneCount: 33,
      sprintCount: 12,
      onProjectsCount: 14,
      team: "UX Researchers"
    },
    {
      avatar: "/images/avatar/circle/avatar-f-8.png",
      name: "Madison Davis",
      title: "Graphic Designer",
      taskCount: 23,
      doneCount: 55,
      sprintCount: 31,
      onProjectsCount: 15,
      team: "UX Researchers"
    },
    {
      avatar: "/images/avatar/circle/avatar-f-9.png",
      name: "Abigail Rodriguez",
      title: "Content Writer",
      taskCount: 79,
      doneCount: 15,
      sprintCount: 72,
      onProjectsCount: 33,
      team: "UX Designers"
    },
    {
      avatar: "/images/avatar/circle/avatar-f-10.png",
      name: "Elizabeth Taylor",
      title: "Customer Support Representative",
      taskCount: 12,
      doneCount: 32,
      sprintCount: 14,
      onProjectsCount: 16,
      team: "UX Designers"
    },
    {
      avatar: "/images/avatar/circle/avatar-f-11.png",
      name: "Chloe Anderson",
      title: "Financial Analyst",
      taskCount: 11,
      doneCount: 17,
      sprintCount: 12,
      onProjectsCount: 14,
      team: "UI Designers"
    },
    {
      avatar: "/images/avatar/circle/avatar-f-12.png",
      name: "Sophia Lee",
      title: "Product Manager",
      taskCount: 79,
      doneCount: 15,
      sprintCount: 72,
      onProjectsCount: 33,
      team: "UI Designer"
    },
    {
      avatar: "/images/avatar/circle/avatar-f-3.png",
      name: "Aria Jackson",
      title: "Product Manager",
      taskCount: 79,
      doneCount: 15,
      sprintCount: 72,
      onProjectsCount: 33,
      team: "Front-End Developers"
    },
    {
      avatar: "/images/avatar/circle/avatar-f-7.png",
      name: "Aria Jackson",
      title: "Product Manager",
      taskCount: 79,
      doneCount: 15,
      sprintCount: 72,
      onProjectsCount: 33,
      team: "Front-End Developers"
    },
    {
      avatar: "/images/avatar/circle/avatar-f-9.png",
      name: "John Doe",
      title: "Product Manager",
      taskCount: 79,
      doneCount: 15,
      sprintCount: 72,
      onProjectsCount: 33,
      team: "Back-End Developers"
    }
  ];
  teamFilter(team) {
    this.selectedTeam = team;
    this.filteredTeamMembers = this.teamMembers.filter((item) => item.team === team);
  }
  ngOnInit() {
    this.filteredTeamMembers = this.teamMembers.filter((item) => item.team === this.selectedTeam);
  }
  static \u0275fac = function ProjectOverviewWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProjectOverviewWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProjectOverviewWidget, selectors: [["project-overview-widget"]], decls: 11, vars: 2, consts: [[1, "card", "flex", "justify-between", "items-center"], [1, "p-2", "h-full", "w-full", "flex", "flex-col", "justify-between"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "font-semibold", "text-lg", "text-surface-900", "dark:text-surface-0"], [1, "flex", "items-center", "gap-2"], ["pButton", "", "pRipple", "", "label", "Organize Teams", "icon", "pi pi-sliders-h", "outlined", ""], ["pButton", "", "pRipple", "", "label", "New Project", "icon", "pi pi-plus-circle"], [1, "grid", "grid-cols-12", "gap-8"], [3, "onTeamFilter", "selectedTeam"], [3, "filteredTeamMembers"]], template: function ProjectOverviewWidget_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "span", 3);
      \u0275\u0275text(4, "Projects Overview");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div", 4);
      \u0275\u0275element(6, "button", 5)(7, "button", 6);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 7)(9, "teams-widget", 8);
      \u0275\u0275listener("onTeamFilter", function ProjectOverviewWidget_Template_teams_widget_onTeamFilter_9_listener($event) {
        return ctx.teamFilter($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275element(10, "saas-table-widget", 9);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(9);
      \u0275\u0275property("selectedTeam", ctx.selectedTeam);
      \u0275\u0275advance();
      \u0275\u0275property("filteredTeamMembers", ctx.filteredTeamMembers);
    }
  }, dependencies: [ButtonModule, ButtonDirective, RippleModule, Ripple, TeamsWidget, SaasTableWidget], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProjectOverviewWidget, { className: "ProjectOverviewWidget", filePath: "src/app/pages/dashboard/saas/components/projectoverviewwidget.ts", lineNumber: 27 });
})();

// src/app/pages/dashboard/saas/dashboardsaas.ts
var DashboardSaas = class _DashboardSaas {
  static \u0275fac = function DashboardSaas_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DashboardSaas)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DashboardSaas, selectors: [["app-dashboard-saas"]], decls: 9, vars: 0, consts: [[1, "grid", "grid-cols-12", "gap-8", "mt-1"], [1, "col-span-12", "md:col-span-8"], [1, "col-span-12", "md:col-span-4"], [1, "col-span-12"]], template: function DashboardSaas_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
      \u0275\u0275element(2, "introduce-widget");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "div", 2);
      \u0275\u0275element(4, "upgrade-widget");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div", 3);
      \u0275\u0275element(6, "my-workspace-widget");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "div", 3);
      \u0275\u0275element(8, "project-overview-widget");
      \u0275\u0275elementEnd()();
    }
  }, dependencies: [IntroduceWidget, UpgradeWidget, MyWorkspaceWidget, ProjectOverviewWidget], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DashboardSaas, { className: "DashboardSaas", filePath: "src/app/pages/dashboard/saas/dashboardsaas.ts", lineNumber: 26 });
})();
export {
  DashboardSaas
};
//# sourceMappingURL=chunk-URORYKDM.js.map
