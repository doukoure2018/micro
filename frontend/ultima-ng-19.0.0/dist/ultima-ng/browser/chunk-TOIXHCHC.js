import {
  ProductService
} from "./chunk-JVDBGEQL.js";
import {
  ChartModule,
  UIChart
} from "./chunk-D6T4WP2M.js";
import {
  LayoutService
} from "./chunk-ZGNAW63S.js";
import {
  Menu,
  MenuModule
} from "./chunk-RKCUEC6H.js";
import {
  ProgressBar
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
import {
  SelectButton
} from "./chunk-YEN5RMZS.js";
import "./chunk-XS7IVZ5T.js";
import "./chunk-CUABQE42.js";
import "./chunk-V6CKOH3G.js";
import "./chunk-DBPX6ILC.js";
import "./chunk-WIQZFAVH.js";
import "./chunk-CCBQFN2J.js";
import {
  ProgressSpinnerModule
} from "./chunk-Y2J5OGKB.js";
import {
  RouterLink,
  RouterModule
} from "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
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
import {
  MessageService
} from "./chunk-NQNBRQ7H.js";
import {
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-3HTR5OU7.js";
import "./chunk-BMYIFZHZ.js";
import "./chunk-W3K3GK4Z.js";
import {
  CommonModule,
  CurrencyPipe,
  NgClass,
  NgForOf,
  NgIf
} from "./chunk-SQQPVFHK.js";
import {
  debounceTime,
  inject,
  signal,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵpureFunction2,
  ɵɵpureFunction3,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuery
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// src/app/pages/dashboard/analytics/components/monthlycomparisonwidget.ts
var _c0 = ["monthlyChart"];
var MonthlyComparisonWidget = class _MonthlyComparisonWidget {
  layoutService = inject(LayoutService);
  chartViewChild;
  chartMonthlyData;
  chartMonthlyOptions;
  colorKeys = ["indigo", "blue", "cyan", "teal", "green", "emerald", "lime", "amber", "yellow"];
  yearsData = [
    { year: "2016", data: [6, 25, 47, 12, 7, 70, 42] },
    { year: "2017", data: [81, 3, 5, 11, 59, 47, 99] },
    { year: "2018", data: [68, 47, 46, 46, 61, 70, 94] },
    { year: "2019", data: [31, 9, 18, 76, 6, 11, 79] },
    { year: "2020", data: [85, 37, 47, 29, 2, 10, 54] },
    { year: "2021", data: [28, 48, 40, 19, 86, 27, 90] },
    { year: "2022", data: [89, 18, 75, 18, 97, 61, 54] },
    { year: "2023", data: [18, 36, 39, 58, 41, 50, 72] },
    { year: "2024", data: [31, 4, 35, 74, 47, 35, 46] }
  ];
  months = ["January", "February", "March", "April", "May", "June", "July"];
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
  getChartMonthlyData() {
    const documentStyle = getComputedStyle(document.documentElement);
    const suffix = this.layoutService.isDarkTheme() ? "400" : "500";
    const colors = this.colorKeys.map((color) => documentStyle.getPropertyValue(`--p-${color}-${suffix}`));
    return {
      labels: this.months,
      datasets: this.yearsData.map(({ year, data }, index) => ({
        label: year,
        data,
        borderColor: colors[index],
        backgroundColor: colors[index],
        borderWidth: 2,
        fill: true
      }))
    };
  }
  getMonthlyChartOptions() {
    const textColor = getComputedStyle(document.body).getPropertyValue("--text-color") || "rgba(0, 0, 0, 0.87)";
    const gridLinesColor = getComputedStyle(document.body).getPropertyValue("--surface-border") || "rgba(160, 167, 181, .3)";
    const fontFamily = getComputedStyle(document.body).getPropertyValue("--font-family");
    const fontConfig = {
      font: { family: fontFamily },
      color: textColor
    };
    return {
      plugins: {
        legend: {
          display: true,
          labels: fontConfig
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "x" },
      scales: {
        y: {
          ticks: fontConfig,
          grid: { color: gridLinesColor }
        },
        x: {
          categoryPercentage: 0.9,
          barPercentage: 0.8,
          ticks: fontConfig,
          grid: { color: gridLinesColor }
        }
      },
      animation: {
        animateScale: true,
        animateRotate: true
      }
    };
  }
  initChart() {
    this.chartMonthlyData = this.getChartMonthlyData();
    this.chartMonthlyOptions = this.getMonthlyChartOptions();
  }
  changeMonthlyDataView() {
    if (this.chartViewChild.chart.options.scales.x.stacked) {
      this.chartViewChild.chart.options.scales.x.stacked = false;
      this.chartViewChild.chart.options.scales.y.stacked = false;
    } else {
      this.chartViewChild.chart.options.scales.x.stacked = true;
      this.chartViewChild.chart.options.scales.y.stacked = true;
    }
    this.chartViewChild.chart.update();
  }
  static \u0275fac = function MonthlyComparisonWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MonthlyComparisonWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MonthlyComparisonWidget, selectors: [["monthly-comparison-widget"]], viewQuery: function MonthlyComparisonWidget_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.chartViewChild = _t.first);
    }
  }, decls: 7, vars: 2, consts: [["monthlyChart", ""], [1, "card", "h-full"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "text-xl", "font-semibold", "m-0"], ["pButton", "", "pRipple", "", "label", "Vertical/Stacked Data", "text", "", 1, "ml-auto", 3, "click"], ["type", "bar", "height", "400", 3, "data", "options"]], template: function MonthlyComparisonWidget_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "span", 3);
      \u0275\u0275text(3, "Monthly Comparison");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "button", 4);
      \u0275\u0275listener("click", function MonthlyComparisonWidget_Template_button_click_4_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.changeMonthlyDataView());
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275element(5, "p-chart", 5, 0);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(5);
      \u0275\u0275property("data", ctx.chartMonthlyData)("options", ctx.chartMonthlyOptions);
    }
  }, dependencies: [ButtonModule, ButtonDirective, ChartModule, UIChart, RippleModule, Ripple], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MonthlyComparisonWidget, { className: "MonthlyComparisonWidget", filePath: "src/app/pages/dashboard/analytics/components/monthlycomparisonwidget.ts", lineNumber: 21 });
})();

// src/app/pages/dashboard/analytics/components/insightswidget.ts
var _c02 = ["doughnutChart"];
var InsightsWidget = class _InsightsWidget {
  layoutService = inject(LayoutService);
  doughnutViewChild;
  colorKeys = ["indigo", "blue", "cyan", "green", "emerald", "orange", "yellow"];
  items = [
    { label: "Update", icon: "pi pi-fw pi-refresh" },
    { label: "Edit", icon: "pi pi-fw pi-pencil" }
  ];
  doughnutData;
  doughnutOptions;
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
  getDoughnutOptions() {
    const textColor = getComputedStyle(document.body).getPropertyValue("--text-color") || "rgba(0, 0, 0, 0.87)";
    const fontFamily = getComputedStyle(document.body).getPropertyValue("--font-family");
    return {
      plugins: {
        legend: {
          position: "top",
          labels: {
            font: {
              family: fontFamily
            },
            color: textColor
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      circumference: 180,
      rotation: -90,
      animation: {
        animateScale: true,
        animateRotate: true
      }
    };
  }
  getDoughnutData() {
    const documentStyle = getComputedStyle(document.documentElement);
    const borderColor = getComputedStyle(document.body).getPropertyValue("--surface-border") || "rgba(160, 167, 181, .3)";
    const suffix = this.layoutService.isDarkTheme() ? "400" : "500";
    const backgroundColor = this.colorKeys.map((color) => documentStyle.getPropertyValue(`--p-${color}-${suffix}`));
    return {
      labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      datasets: [
        {
          data: [11, 29, 71, 33, 28, 95, 6],
          backgroundColor,
          borderColor
        }
      ]
    };
  }
  changeDoughnutDataView() {
    if (this.doughnutViewChild.chart.options.circumference === 180) {
      this.doughnutViewChild.chart.options.circumference = 360;
      this.doughnutViewChild.chart.options.rotation = -45;
    } else {
      this.doughnutViewChild.chart.options.circumference = 180;
      this.doughnutViewChild.chart.options.rotation = -90;
    }
    this.doughnutViewChild.chart.update();
  }
  initChart() {
    this.doughnutData = this.getDoughnutData();
    this.doughnutOptions = this.getDoughnutOptions();
  }
  static \u0275fac = function InsightsWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _InsightsWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _InsightsWidget, selectors: [["insights-widget"]], viewQuery: function InsightsWidget_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c02, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.doughnutViewChild = _t.first);
    }
  }, decls: 33, vars: 3, consts: [["menu", ""], ["doughnutChart", ""], [1, "card", "h-full"], [1, "flex", "items-center", "justify-between", "mb-2"], [1, "text-xl", "font-semibold", "m-0"], ["pButton", "", "pRipple", "", "icon", "pi pi-ellipsis-h", "rounded", "", "text", "", 3, "click"], ["popup", "", 3, "model"], [1, "border-b", "border-surface", "text-sm", "text-muted-color", "mb-2", "flex", "items-center"], ["pButton", "", "pRipple", "", "label", "Semi/Full Data", "text", "", 1, "ml-auto", 3, "click"], ["type", "doughnut", "height", "200", 3, "data", "options"], [1, "flex", "flex-col", "justify-center"], [1, "flex", "flex-row", "items-center", "mt-6", "px-4"], [1, "pi", "pi-thumbs-up", "p-4", "rounded-full", "bg-green-500", "text-white"], [1, "flex", "flex-col", "ml-4"], [1, "text-indigo-500", "ml-auto"], [1, "flex", "flex-row", "items-center", "my-6", "px-4"], [1, "pi", "pi-thumbs-down", "rounded-full", "p-4", "bg-orange-500", "text-white"]], template: function InsightsWidget_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 2)(1, "div", 3)(2, "span", 4);
      \u0275\u0275text(3, "Insights");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div")(5, "button", 5);
      \u0275\u0275listener("click", function InsightsWidget_Template_button_click_5_listener($event) {
        \u0275\u0275restoreView(_r1);
        const menu_r2 = \u0275\u0275reference(7);
        return \u0275\u0275resetView(menu_r2.toggle($event));
      });
      \u0275\u0275elementEnd();
      \u0275\u0275element(6, "p-menu", 6, 0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 7)(9, "span");
      \u0275\u0275text(10, "November 22 - November 29");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "button", 8);
      \u0275\u0275listener("click", function InsightsWidget_Template_button_click_11_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.changeDoughnutDataView());
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275element(12, "p-chart", 9, 1);
      \u0275\u0275elementStart(14, "div", 10)(15, "div", 11);
      \u0275\u0275element(16, "i", 12);
      \u0275\u0275elementStart(17, "div", 13)(18, "span");
      \u0275\u0275text(19, "Best Day of the Week");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "small");
      \u0275\u0275text(21, "Friday");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(22, "span", 14);
      \u0275\u0275text(23, "95");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(24, "div", 15);
      \u0275\u0275element(25, "i", 16);
      \u0275\u0275elementStart(26, "div", 13)(27, "span");
      \u0275\u0275text(28, "Worst Day of the Week");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(29, "small");
      \u0275\u0275text(30, "Saturday");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(31, "span", 14);
      \u0275\u0275text(32, "6");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275property("model", ctx.items);
      \u0275\u0275advance(6);
      \u0275\u0275property("data", ctx.doughnutData)("options", ctx.doughnutOptions);
    }
  }, dependencies: [ButtonModule, ButtonDirective, ChartModule, UIChart, MenuModule, Menu, Ripple], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(InsightsWidget, { className: "InsightsWidget", filePath: "src/app/pages/dashboard/analytics/components/insightswidget.ts", lineNumber: 46 });
})();

// src/app/pages/dashboard/analytics/components/statswidget.ts
var _c03 = (a0, a1) => [a0, a1, "!text-6xl"];
function StatsWidget_div_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "div", 3)(3, "div");
    \u0275\u0275element(4, "i", 4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 5)(6, "span", 6);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 7);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 8)(11, "div", 9)(12, "span", 10);
    \u0275\u0275text(13, "Target");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span", 11);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275element(16, "p-progress-bar", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 13)(18, "span", 10);
    \u0275\u0275text(19, "All Time Record");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "span", 11);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd();
    \u0275\u0275element(22, "p-progress-bar", 12);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const stat_r1 = ctx.$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(9, _c03, stat_r1.icon, stat_r1.iconClass));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(stat_r1.count);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(stat_r1.label);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(stat_r1.target.value);
    \u0275\u0275advance();
    \u0275\u0275property("value", stat_r1.target.progress)("showValue", false);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(stat_r1.record.value);
    \u0275\u0275advance();
    \u0275\u0275property("value", stat_r1.record.progress)("showValue", false);
  }
}
var StatsWidget = class _StatsWidget {
  stats = [
    {
      icon: "pi pi-twitter",
      iconClass: "text-muted-color",
      count: "44.995",
      label: "Retweets",
      target: {
        value: "10.000",
        progress: 50
      },
      record: {
        value: "50.702",
        progress: 24
      }
    },
    {
      icon: "pi pi-facebook",
      iconClass: "text-muted-color",
      count: "63.573",
      label: "Facebook Interactions",
      target: {
        value: "10.000",
        progress: 23
      },
      record: {
        value: "99.028",
        progress: 38
      }
    },
    {
      icon: "pi pi-github",
      iconClass: "text-muted-color",
      count: "81.002",
      label: "Stars",
      target: {
        value: "10.000",
        progress: 62
      },
      record: {
        value: "162.550",
        progress: 14
      }
    }
  ];
  static \u0275fac = function StatsWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _StatsWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _StatsWidget, selectors: [["stats-widget"]], hostAttrs: [1, "col-span-12", "grid", "grid-cols-12", "gap-4"], decls: 1, vars: 1, consts: [["class", "col-span-12 md:col-span-4", 4, "ngFor", "ngForOf"], [1, "col-span-12", "md:col-span-4"], [1, "card"], [1, "flex", "justify-between", "items-center", "p-4"], [3, "ngClass"], [1, "text-right", "flex", "flex-col"], [1, "text-4xl"], [1, "text-muted-color", "mt-2"], [1, "border-t", "border-surface", "flex", "justify-between", "mt-4"], [1, "w-6/12", "text-center", "p-4", "flex", "flex-col", "border-r", "border-surface"], [1, "font-medium"], [1, "text-muted-color", "mb-2"], [3, "value", "showValue"], [1, "w-6/12", "text-center", "p-4", "flex", "flex-col"]], template: function StatsWidget_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, StatsWidget_div_0_Template, 23, 12, "div", 0);
    }
    if (rf & 2) {
      \u0275\u0275property("ngForOf", ctx.stats);
    }
  }, dependencies: [CommonModule, NgClass, NgForOf, ProgressBar], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(StatsWidget, { className: "StatsWidget", filePath: "src/app/pages/dashboard/analytics/components/statswidget.ts", lineNumber: 38 });
})();

// src/app/pages/dashboard/analytics/components/storeswidget.ts
var _c04 = ["storeA"];
var _c1 = ["storeB"];
var _c2 = ["storeC"];
var _c3 = ["storeD"];
var _c4 = (a0, a1) => ({ "pi-arrow-up text-green-500": a0, "pi-arrow-down text-red-500": a1 });
var _c5 = (a0, a1) => ({ "text-green-500": a0, "text-red-500": a1 });
function StoresWidget_i_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 13);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(1, _c4, ctx_r0.storeADiff > 0, ctx_r0.storeADiff < 0));
  }
}
function StoresWidget_span_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(3, _c5, ctx_r0.storeADiff > 0, ctx_r0.storeADiff < 0));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", ctx_r0.storeADiff > 0 ? "+" : "", "", ctx_r0.storeADiff, " ");
  }
}
function StoresWidget_i_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 13);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(1, _c4, ctx_r0.storeBDiff > 0, ctx_r0.storeBDiff < 0));
  }
}
function StoresWidget_span_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(3, _c5, ctx_r0.storeBDiff > 0, ctx_r0.storeBDiff < 0));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", ctx_r0.storeBDiff > 0 ? "+" : "", "", ctx_r0.storeBDiff, " ");
  }
}
function StoresWidget_i_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 13);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(1, _c4, ctx_r0.storeCDiff > 0, ctx_r0.storeCDiff < 0));
  }
}
function StoresWidget_span_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(3, _c5, ctx_r0.storeCDiff > 0, ctx_r0.storeCDiff < 0));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", ctx_r0.storeCDiff > 0 ? "+" : "", "", ctx_r0.storeCDiff, " ");
  }
}
function StoresWidget_i_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 13);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(1, _c4, ctx_r0.storeDDiff > 0, ctx_r0.storeDDiff < 0));
  }
}
function StoresWidget_span_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(3, _c5, ctx_r0.storeDDiff > 0, ctx_r0.storeDDiff < 0));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", ctx_r0.storeDDiff > 0 ? "+" : "", "", ctx_r0.storeDDiff, " ");
  }
}
var StoresWidget = class _StoresWidget {
  layoutService = inject(LayoutService);
  storeAViewChild;
  storeBViewChild;
  storeCViewChild;
  storeDViewChild;
  storeATotalValue = 100;
  storeADiff = 0;
  storeAStatus = 0;
  storeAData;
  storeAOptions;
  storeBTotalValue = 120;
  storeBDiff = 0;
  storeBStatus = 0;
  storeBData;
  storeBOptions;
  storeCTotalValue = 150;
  storeCDiff = 0;
  storeCStatus = 0;
  storeCData;
  storeCOptions;
  storeDTotalValue = 80;
  storeDDiff = 0;
  storeDStatus = 0;
  storeDData;
  storeDOptions;
  storeInterval;
  subscription;
  constructor() {
    this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(50)).subscribe((config) => {
      this.initCharts();
    });
  }
  ngOnInit() {
    this.initCharts();
    const calculateStore = (storeData, totalValue) => {
      let randomNumber = +(Math.random() * 500).toFixed(2);
      let data = [...storeData.datasets[0].data];
      let length = data.length;
      data.push(randomNumber);
      data.shift();
      storeData.datasets[0].data = data;
      let diff = +(data[length - 1] - data[length - 2]).toFixed(2);
      let status = diff === 0 ? 0 : diff > 0 ? 1 : -1;
      totalValue = +(totalValue + diff).toFixed(2);
      return { diff, totalValue, status };
    };
    this.storeInterval = setInterval(() => {
      requestAnimationFrame(() => {
        const { diff: storeADiff, totalValue: storeATotalValue, status: storeAStatus } = calculateStore(this.storeAData, this.storeATotalValue);
        this.storeADiff = storeADiff;
        this.storeATotalValue = storeATotalValue;
        this.storeAStatus = storeAStatus;
        this.storeAViewChild.refresh();
        const { diff: storeBDiff, totalValue: storeBTotalValue, status: storeBStatus } = calculateStore(this.storeBData, this.storeBTotalValue);
        this.storeBDiff = storeBDiff;
        this.storeBTotalValue = storeBTotalValue;
        this.storeBStatus = storeBStatus;
        this.storeBViewChild.refresh();
        const { diff: storeCDiff, totalValue: storeCTotalValue, status: storeCStatus } = calculateStore(this.storeCData, this.storeCTotalValue);
        this.storeCDiff = storeCDiff;
        this.storeCTotalValue = storeCTotalValue;
        this.storeCStatus = storeCStatus;
        this.storeCViewChild.refresh();
        const { diff: storeDDiff, totalValue: storeDTotalValue, status: storeDStatus } = calculateStore(this.storeDData, this.storeDTotalValue);
        this.storeDDiff = storeDDiff;
        this.storeDTotalValue = storeDTotalValue;
        this.storeDStatus = storeDStatus;
        this.storeDViewChild.refresh();
      });
    }, 2e3);
  }
  ngOnDestroy() {
    clearInterval(this.storeInterval);
    this.subscription.unsubscribe();
  }
  initCharts() {
    this.storeAData = {
      labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September"],
      datasets: [
        {
          data: [55, 3, 45, 6, 44, 58, 84, 68, 64],
          borderColor: ["#4DD0E1"],
          backgroundColor: ["rgba(77, 208, 225, 0.8)"],
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }
      ]
    };
    this.storeBData = {
      labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September"],
      datasets: [
        {
          data: [81, 75, 63, 100, 69, 79, 38, 37, 76],
          borderColor: ["#4DD0E1"],
          backgroundColor: ["rgba(77, 208, 225, 0.8)"],
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }
      ]
    };
    this.storeCData = {
      labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September"],
      datasets: [
        {
          data: [99, 55, 22, 72, 24, 79, 35, 91, 48],
          borderColor: ["#4DD0E1"],
          backgroundColor: ["rgba(77, 208, 225, 0.8)"],
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }
      ]
    };
    this.storeDData = {
      labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September"],
      datasets: [
        {
          data: [5, 51, 68, 82, 28, 21, 29, 45, 44],
          borderColor: ["#4DD0E1"],
          backgroundColor: ["rgba(77, 208, 225, 0.8)"],
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }
      ]
    };
    this.storeAOptions = {
      plugins: {
        legend: {
          display: false
        }
      },
      maintainAspectRatio: false,
      responsive: true,
      aspectRatio: 4,
      scales: {
        y: {
          display: false
        },
        x: {
          display: false
        }
      },
      tooltips: {
        enabled: false
      },
      elements: {
        point: {
          radius: 0
        }
      }
    };
    this.storeBOptions = {
      plugins: {
        legend: {
          display: false
        }
      },
      maintainAspectRatio: false,
      responsive: true,
      aspectRatio: 4,
      scales: {
        y: {
          display: false
        },
        x: {
          display: false
        }
      },
      tooltips: {
        enabled: false
      },
      elements: {
        point: {
          radius: 0
        }
      }
    };
    this.storeCOptions = {
      plugins: {
        legend: {
          display: false
        }
      },
      maintainAspectRatio: false,
      responsive: true,
      aspectRatio: 4,
      scales: {
        y: {
          display: false
        },
        x: {
          display: false
        }
      },
      tooltips: {
        enabled: false
      },
      elements: {
        point: {
          radius: 0
        }
      }
    };
    this.storeDOptions = {
      plugins: {
        legend: {
          display: false
        }
      },
      maintainAspectRatio: false,
      responsive: true,
      aspectRatio: 4,
      scales: {
        y: {
          display: false
        },
        x: {
          display: false
        }
      },
      tooltips: {
        enabled: false
      },
      elements: {
        point: {
          radius: 0
        }
      }
    };
  }
  static \u0275fac = function StoresWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _StoresWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _StoresWidget, selectors: [["stores-widget"]], viewQuery: function StoresWidget_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c04, 5);
      \u0275\u0275viewQuery(_c1, 5);
      \u0275\u0275viewQuery(_c2, 5);
      \u0275\u0275viewQuery(_c3, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.storeAViewChild = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.storeBViewChild = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.storeCViewChild = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.storeDViewChild = _t.first);
    }
  }, decls: 45, vars: 24, consts: [["storeA", ""], ["storeB", ""], ["storeC", ""], ["storeD", ""], [1, "card", "grid", "grid-cols-12", "gap-4", "grid-nogutter", "flex-wrap"], [1, "lg:col-span-3", "md:col-span-6", "sm:col-span-12", "col-span-12", "p-0"], [1, "flex", "flex-col", "p-6"], [1, "text-muted-color", "mb-2"], [1, "flex", "items-center", "mb-3"], ["class", "font-bold !text-2xl pi pr-1", 3, "ngClass", 4, "ngIf"], [1, "text-2xl"], ["class", "font-medium text-base ml-2", 3, "ngClass", 4, "ngIf"], ["type", "line", 3, "data", "options", "responsive"], [1, "font-bold", "!text-2xl", "pi", "pr-1", 3, "ngClass"], [1, "font-medium", "text-base", "ml-2", 3, "ngClass"]], template: function StoresWidget_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 4)(1, "div", 5)(2, "div", 6)(3, "div", 7);
      \u0275\u0275text(4, "Store A Sales");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div", 8);
      \u0275\u0275template(6, StoresWidget_i_6_Template, 1, 4, "i", 9);
      \u0275\u0275elementStart(7, "div", 10);
      \u0275\u0275text(8);
      \u0275\u0275elementEnd();
      \u0275\u0275template(9, StoresWidget_span_9_Template, 2, 6, "span", 11);
      \u0275\u0275elementEnd()();
      \u0275\u0275element(10, "p-chart", 12, 0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "div", 5)(13, "div", 6)(14, "span", 7);
      \u0275\u0275text(15, "Store B Sales");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "span", 8);
      \u0275\u0275template(17, StoresWidget_i_17_Template, 1, 4, "i", 9);
      \u0275\u0275elementStart(18, "div", 10);
      \u0275\u0275text(19);
      \u0275\u0275elementEnd();
      \u0275\u0275template(20, StoresWidget_span_20_Template, 2, 6, "span", 11);
      \u0275\u0275elementEnd()();
      \u0275\u0275element(21, "p-chart", 12, 1);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "div", 5)(24, "div", 6)(25, "span", 7);
      \u0275\u0275text(26, "Store C Sales");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "span", 8);
      \u0275\u0275template(28, StoresWidget_i_28_Template, 1, 4, "i", 9);
      \u0275\u0275elementStart(29, "div", 10);
      \u0275\u0275text(30);
      \u0275\u0275elementEnd();
      \u0275\u0275template(31, StoresWidget_span_31_Template, 2, 6, "span", 11);
      \u0275\u0275elementEnd()();
      \u0275\u0275element(32, "p-chart", 12, 2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "div", 5)(35, "div", 6)(36, "span", 7);
      \u0275\u0275text(37, "Store D Sales");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(38, "span", 8);
      \u0275\u0275template(39, StoresWidget_i_39_Template, 1, 4, "i", 9);
      \u0275\u0275elementStart(40, "div", 10);
      \u0275\u0275text(41);
      \u0275\u0275elementEnd();
      \u0275\u0275template(42, StoresWidget_span_42_Template, 2, 6, "span", 11);
      \u0275\u0275elementEnd()();
      \u0275\u0275element(43, "p-chart", 12, 3);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275property("ngIf", ctx.storeADiff !== 0);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.storeATotalValue);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.storeADiff !== 0);
      \u0275\u0275advance();
      \u0275\u0275property("data", ctx.storeAData)("options", ctx.storeAOptions)("responsive", true);
      \u0275\u0275advance(7);
      \u0275\u0275property("ngIf", ctx.storeBDiff !== 0);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.storeBTotalValue);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.storeBDiff !== 0);
      \u0275\u0275advance();
      \u0275\u0275property("data", ctx.storeBData)("options", ctx.storeBOptions)("responsive", true);
      \u0275\u0275advance(7);
      \u0275\u0275property("ngIf", ctx.storeCDiff !== 0);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.storeCTotalValue);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.storeCDiff !== 0);
      \u0275\u0275advance();
      \u0275\u0275property("data", ctx.storeCData)("options", ctx.storeCOptions)("responsive", true);
      \u0275\u0275advance(7);
      \u0275\u0275property("ngIf", ctx.storeDDiff !== 0);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.storeDTotalValue);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.storeDDiff !== 0);
      \u0275\u0275advance();
      \u0275\u0275property("data", ctx.storeDData)("options", ctx.storeDOptions)("responsive", true);
    }
  }, dependencies: [CommonModule, NgClass, NgIf, ChartModule, UIChart], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(StoresWidget, { className: "StoresWidget", filePath: "src/app/pages/dashboard/analytics/components/storeswidget.ts", lineNumber: 60 });
})();

// src/app/pages/dashboard/analytics/components/topsearcheswidget.ts
var _c05 = (a0) => ({ "flex justify-between p-4": true, "bg-surface-50 dark:bg-surface-800": a0 });
var _c12 = (a0, a1, a2) => ({ "font-medium": true, "text-green-500": a0, "text-orange-500": a1, "text-pink-500": a2 });
function TopSearchesWidget_ng_container_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "div", 7)(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 7);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const search_r3 = ctx.$implicit;
    const i_r4 = ctx.index;
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(4, _c05, i_r4 % 2 === 0));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(search_r3.name);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction3(6, _c12, search_r3.rate >= 60, search_r3.rate >= 40, search_r3.rate < 40));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", search_r3.rate, "% CONV RATE");
  }
}
var TopSearchesWidget = class _TopSearchesWidget {
  items = [
    { label: "View", icon: "pi pi-eye" },
    { label: "Export", icon: "pi pi-upload" }
  ];
  searches = [
    {
      name: "Mat Orange Case",
      rate: 82
    },
    {
      name: "Space T-Shirt",
      rate: 78
    },
    {
      name: "Orange Black Hoodie",
      rate: 61
    },
    {
      name: "Wonders Notebook",
      rate: 48
    },
    {
      name: "Robots T-Shirt",
      rate: 34
    },
    {
      name: "Green Portal Sticker",
      rate: 11
    }
  ];
  static \u0275fac = function TopSearchesWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TopSearchesWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TopSearchesWidget, selectors: [["top-searches-widget"]], decls: 9, vars: 2, consts: [["menu", ""], [1, "card", "h-full"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "text-xl", "font-semibold", "m-0"], ["pButton", "", "pRipple", "", "icon", "pi pi-ellipsis-h", "rounded", "", "text", "", 3, "click"], ["popup", "", 3, "model"], [4, "ngFor", "ngForOf"], [3, "ngClass"]], template: function TopSearchesWidget_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "span", 3);
      \u0275\u0275text(3, "Top Searches");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div")(5, "button", 4);
      \u0275\u0275listener("click", function TopSearchesWidget_Template_button_click_5_listener($event) {
        \u0275\u0275restoreView(_r1);
        const menu_r2 = \u0275\u0275reference(7);
        return \u0275\u0275resetView(menu_r2.toggle($event));
      });
      \u0275\u0275elementEnd();
      \u0275\u0275element(6, "p-menu", 5, 0);
      \u0275\u0275elementEnd()();
      \u0275\u0275template(8, TopSearchesWidget_ng_container_8_Template, 6, 10, "ng-container", 6);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275property("model", ctx.items);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngForOf", ctx.searches);
    }
  }, dependencies: [CommonModule, NgClass, NgForOf, MenuModule, Menu, ButtonModule, ButtonDirective, RippleModule, Ripple], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TopSearchesWidget, { className: "TopSearchesWidget", filePath: "src/app/pages/dashboard/analytics/components/topsearcheswidget.ts", lineNumber: 27 });
})();

// src/app/pages/dashboard/analytics/components/analyticstablewidget.ts
var _c06 = () => ({ "min-width": "40rem" });
function AnalyticsTableWidget_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 4);
    \u0275\u0275text(2, "Image");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th", 5);
    \u0275\u0275text(4, " Name ");
    \u0275\u0275element(5, "p-sortIcon", 6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 7);
    \u0275\u0275text(7, " Category ");
    \u0275\u0275element(8, "p-sortIcon", 8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th", 9);
    \u0275\u0275text(10, " Price ");
    \u0275\u0275element(11, "p-sortIcon", 10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 4);
    \u0275\u0275text(13, "View");
    \u0275\u0275elementEnd()();
  }
}
function AnalyticsTableWidget_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275element(2, "img", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td");
    \u0275\u0275element(11, "button", 12);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const product_r1 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("src", "/images/product/" + product_r1.image, \u0275\u0275sanitizeUrl)("alt", product_r1.image);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", product_r1.name, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", product_r1.category, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(9, 5, product_r1.price, "USD"), " ");
  }
}
var AnalyticsTableWidget = class _AnalyticsTableWidget {
  productService;
  products = signal([]);
  constructor(productService) {
    this.productService = productService;
    this.productService.getProducts().then((data) => {
      this.products.set(data);
    });
  }
  static \u0275fac = function AnalyticsTableWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AnalyticsTableWidget)(\u0275\u0275directiveInject(ProductService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AnalyticsTableWidget, selectors: [["analytics-table-widget"]], features: [\u0275\u0275ProvidersFeature([ProductService])], decls: 6, vars: 5, consts: [["header", ""], ["body", ""], [1, "card"], [3, "value", "paginator", "rows", "tableStyle"], [2, "width", "5rem"], ["pSortableColumn", "name", 2, "min-width", "14rem"], ["field", "name"], ["pSortableColumn", "category", 2, "min-width", "8rem"], ["field", "category"], ["pSortableColumn", "price", 2, "min-width", "8rem"], ["field", "price"], ["width", "50px", 1, "shadow-4", 3, "src", "alt"], ["pRipple", "", "pButton", "", "type", "button", "icon", "pi pi-search", "rounded", "", "text", "", 1, "mb-1"]], template: function AnalyticsTableWidget_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 2)(1, "p-table", 3);
      \u0275\u0275template(2, AnalyticsTableWidget_ng_template_2_Template, 14, 0, "ng-template", null, 0, \u0275\u0275templateRefExtractor)(4, AnalyticsTableWidget_ng_template_4_Template, 12, 8, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275property("value", ctx.products())("paginator", true)("rows", 4)("tableStyle", \u0275\u0275pureFunction0(4, _c06));
    }
  }, dependencies: [CommonModule, CurrencyPipe, TableModule, Table, SortableColumn, SortIcon, ButtonModule, ButtonDirective, RippleModule, Ripple], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AnalyticsTableWidget, { className: "AnalyticsTableWidget", filePath: "src/app/pages/dashboard/analytics/components/analyticstablewidget.ts", lineNumber: 56 });
})();

// src/app/pages/dashboard/analytics/components/expenseswidget.ts
var _c07 = (a0) => ({ "flex justify-between items-center my-2 p-2": true, "border-b border-surface": a0 });
function ExpensesWidget_ng_container_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "div", 8)(2, "div", 9);
    \u0275\u0275element(3, "i", 10);
    \u0275\u0275elementStart(4, "span", 11);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 12);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "span")(9, "a", 13);
    \u0275\u0275element(10, "i", 14);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const expense_r3 = ctx.$implicit;
    const i_r4 = ctx.index;
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(4, _c07, i_r4 !== ctx_r4.expenses.length - 1));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", expense_r3.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(expense_r3.amount);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(expense_r3.category);
  }
}
var ExpensesWidget = class _ExpensesWidget {
  expenses = [
    {
      icon: "pi pi-cloud",
      amount: "30.247",
      category: "Cloud Infrastructure"
    },
    {
      icon: "pi pi-tag",
      amount: "29.550",
      category: "General Goods"
    },
    {
      icon: "pi pi-desktop",
      amount: "16.660",
      category: "Consumer Electronics"
    },
    {
      icon: "pi pi-compass",
      amount: "5.801",
      category: "Incalculables"
    }
  ];
  items = [
    { label: "View", icon: "pi pi-eye" },
    { label: "Export", icon: "pi pi-upload" }
  ];
  static \u0275fac = function ExpensesWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ExpensesWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ExpensesWidget, selectors: [["expenses-widget"]], decls: 11, vars: 2, consts: [["menu", ""], [1, "card", "h-full"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "text-xl", "font-semibold", "m-0"], ["pButton", "", "pRipple", "", "icon", "pi pi-ellipsis-h", "rounded", "", "text", "", 3, "click"], ["popup", "", 3, "model"], [1, "border-b", "border-surface", "text-sm", "text-muted-color", "mb-2", "pb-4"], [4, "ngFor", "ngForOf"], [3, "ngClass"], [1, "flex", "flex-col"], [1, "text-cyan-700", "text-2xl", "mb-2", 3, "ngClass"], [1, "font-medium", "mb-1"], [1, "text-muted-color"], ["href", "#", 1, "text-muted-color"], [1, "pi", "pi-chevron-right"]], template: function ExpensesWidget_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "span", 3);
      \u0275\u0275text(3, "Expenses");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div")(5, "button", 4);
      \u0275\u0275listener("click", function ExpensesWidget_Template_button_click_5_listener($event) {
        \u0275\u0275restoreView(_r1);
        const menu_r2 = \u0275\u0275reference(7);
        return \u0275\u0275resetView(menu_r2.toggle($event));
      });
      \u0275\u0275elementEnd();
      \u0275\u0275element(6, "p-menu", 5, 0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 6);
      \u0275\u0275text(9, "November 22 - November 29");
      \u0275\u0275elementEnd();
      \u0275\u0275template(10, ExpensesWidget_ng_container_10_Template, 11, 6, "ng-container", 7);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275property("model", ctx.items);
      \u0275\u0275advance(4);
      \u0275\u0275property("ngForOf", ctx.expenses);
    }
  }, dependencies: [CommonModule, NgClass, NgForOf, ButtonModule, ButtonDirective, RippleModule, Ripple, MenuModule, Menu], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ExpensesWidget, { className: "ExpensesWidget", filePath: "src/app/pages/dashboard/analytics/components/expenseswidget.ts", lineNumber: 36 });
})();

// src/app/pages/dashboard/analytics/components/ratingswidget.ts
var _c08 = () => ["/dashboard-analytics"];
var _c13 = (a0) => [a0, "text-surface-900 dark:text-surface-0 text-2xl"];
function RatingsWidget_ng_container_10_ng_container_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "div", 17);
    \u0275\u0275element(2, "img", 18);
    \u0275\u0275elementStart(3, "div", 11)(4, "span", 19);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 20);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const item_r1 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("src", item_r1.image, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r1.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r1.description);
  }
}
function RatingsWidget_ng_container_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "div", 9)(2, "div", 10)(3, "div", 11)(4, "span", 12);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 13);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "a", 14);
    \u0275\u0275element(9, "i", 15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 16);
    \u0275\u0275template(11, RatingsWidget_ng_container_10_ng_container_11_Template, 8, 3, "ng-container", 8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const rating_r2 = ctx.$implicit;
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(rating_r2.value);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(rating_r2.title);
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(5, _c08));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(6, _c13, rating_r2.icon));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", rating_r2.items);
  }
}
var RatingsWidget = class _RatingsWidget {
  layoutService = inject(LayoutService);
  optionValue = { label: "Weekly", value: "weekly" };
  expensesData;
  expensesOptions;
  stateOptions = [
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" }
  ];
  ratings = [
    {
      title: "Product Questions",
      value: "23",
      icon: "pi pi-arrow-up-right",
      items: [
        {
          image: "/images/product/black-watch.jpg",
          title: "Black Watch",
          description: "Is the Black Watch product water-resistant?"
        },
        {
          image: "/images/product/blue-t-shirt.jpg",
          title: "Blue T-Shirt",
          description: "Can I return or exchange the blue t-shirt if I am not satisfied with it?"
        }
      ]
    },
    {
      title: "Product Reviews",
      value: "54",
      icon: "pi pi-arrow-up-right",
      items: [
        {
          image: "/images/product/blue-band.jpg",
          title: "Blue Band",
          description: "Loved the blue band from this e-commerce site!"
        },
        {
          image: "/images/product/bamboo-watch.jpg",
          title: "Bamboo Watch",
          description: "I purchased the bamboo watch and I'm really happy with it."
        }
      ]
    },
    {
      title: "Shipping Orders",
      value: "99+",
      icon: "pi pi-arrow-up-right",
      items: [
        {
          image: "/images/product/black-watch.jpg",
          title: "Black Watch",
          description: "Last Shipping Date"
        },
        {
          image: "/images/product/bamboo-watch.jpg",
          title: "Blue T-Shirt",
          description: "Last Shipping Date"
        }
      ]
    }
  ];
  subscription;
  constructor() {
    this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(50)).subscribe((config) => {
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
  setExpensesData() {
    return {
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          data: [30, 10, 32, 15, 20, 40],
          borderColor: [getComputedStyle(document.body).getPropertyValue("--p-primary-color")],
          backgroundColor: [
            this.layoutService.isDarkTheme() ? `color-mix(in srgb, ${getComputedStyle(document.body).getPropertyValue("--p-primary-200")}, transparent 84%)` : getComputedStyle(document.body).getPropertyValue("--p-primary-50")
          ],
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }
      ]
    };
  }
  setExpensesOptions() {
    return {
      plugins: {
        legend: {
          display: false
        }
      },
      maintainAspectRatio: false,
      responsive: true,
      aspectRatio: 4,
      scales: {
        y: {
          display: false,
          beginAtZero: true
        },
        x: {
          display: false
        }
      },
      tooltips: {
        enabled: false
      },
      elements: {
        point: {
          radius: 5,
          pointBackgroundColor: [getComputedStyle(document.body).getPropertyValue("--p-primary-800")]
        }
      }
    };
  }
  initChart() {
    this.expensesData = this.setExpensesData();
    this.expensesOptions = this.setExpensesOptions();
  }
  static \u0275fac = function RatingsWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RatingsWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RatingsWidget, selectors: [["ratings-widget"]], decls: 11, vars: 5, consts: [[1, "card", "h-full"], [1, "flex", "flex-col", "gap-4"], [1, "flex", "flex-col", "p-4", "gap-4", "w-full", "justify-between", "rounded-md"], [1, "flex", "justify-between", "items-center"], [1, "text-xl", "font-semibold", "m-0"], ["optionLabel", "label", 3, "ngModelChange", "ngModel", "options"], ["type", "line", 3, "data", "options"], [1, "flex", "flex-col", "lg:flex-row", "gap-4", "justify-between", "flex-1"], [4, "ngFor", "ngForOf"], [1, "flex", "flex-col", "p-4", "w-full", "border", "border-surface", "rounded-xl", "gap-4"], [1, "flex", "justify-between"], [1, "flex", "flex-col", "gap-1"], [1, "text-surface-900", "dark:text-surface-0", "text-4xl"], [1, "text-surface-700", "dark:text-surface-100"], [3, "routerLink"], [3, "ngClass"], [1, "flex", "flex-col", "gap-2"], [1, "flex", "gap-2", "p-2", "bg-surface-0", "dark:bg-surface-900", "shadow-sm", "rounded-md"], [1, "w-8", "h-8", "rounded-full", 3, "src"], [1, "text-sm", "font-medium", "text-surface-900", "dark:text-surface-0"], [1, "text-sm", "text-surface-900", "dark:text-surface-0"]], template: function RatingsWidget_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "span", 4);
      \u0275\u0275text(5, "Ratings");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "p-select-button", 5);
      \u0275\u0275twoWayListener("ngModelChange", function RatingsWidget_Template_p_select_button_ngModelChange_6_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.optionValue, $event) || (ctx.optionValue = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div");
      \u0275\u0275element(8, "p-chart", 6);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(9, "div", 7);
      \u0275\u0275template(10, RatingsWidget_ng_container_10_Template, 12, 8, "ng-container", 8);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275twoWayProperty("ngModel", ctx.optionValue);
      \u0275\u0275property("options", ctx.stateOptions);
      \u0275\u0275advance(2);
      \u0275\u0275property("data", ctx.expensesData)("options", ctx.expensesOptions);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngForOf", ctx.ratings);
    }
  }, dependencies: [CommonModule, NgClass, NgForOf, SelectButton, ChartModule, UIChart, RouterModule, RouterLink, FormsModule, NgControlStatus, NgModel], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RatingsWidget, { className: "RatingsWidget", filePath: "src/app/pages/dashboard/analytics/components/ratingswidget.ts", lineNumber: 54 });
})();

// src/app/pages/dashboard/analytics/dashboardanalytics.ts
var DashboardAnalytics = class _DashboardAnalytics {
  static \u0275fac = function DashboardAnalytics_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DashboardAnalytics)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DashboardAnalytics, selectors: [["app-dashboard-analytics"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 16, vars: 0, consts: [[1, "grid", "grid-cols-12", "gap-8"], [1, "col-span-12", "md:col-span-8"], [1, "col-span-12", "md:col-span-4"], [1, "col-span-12", "md:col-span-12"], [1, "col-span-12", "md:col-span-6"]], template: function DashboardAnalytics_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
      \u0275\u0275element(2, "monthly-comparison-widget");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "div", 2);
      \u0275\u0275element(4, "insights-widget");
      \u0275\u0275elementEnd();
      \u0275\u0275element(5, "stats-widget");
      \u0275\u0275elementStart(6, "div", 3);
      \u0275\u0275element(7, "stores-widget");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "div", 4);
      \u0275\u0275element(9, "top-searches-widget");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "div", 4);
      \u0275\u0275element(11, "analytics-table-widget");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "div", 2);
      \u0275\u0275element(13, "expenses-widget");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "div", 1);
      \u0275\u0275element(15, "ratings-widget");
      \u0275\u0275elementEnd()();
    }
  }, dependencies: [MonthlyComparisonWidget, InsightsWidget, StatsWidget, StoresWidget, TopSearchesWidget, AnalyticsTableWidget, ExpensesWidget, RatingsWidget, ProgressSpinnerModule], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DashboardAnalytics, { className: "DashboardAnalytics", filePath: "src/app/pages/dashboard/analytics/dashboardanalytics.ts", lineNumber: 20 });
})();
export {
  DashboardAnalytics
};
//# sourceMappingURL=chunk-TOIXHCHC.js.map
