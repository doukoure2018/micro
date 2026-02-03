import {
  Fluid,
  FluidModule
} from "./chunk-KPJXCGM6.js";
import {
  ChartModule,
  UIChart
} from "./chunk-D6T4WP2M.js";
import {
  LayoutService
} from "./chunk-ZGNAW63S.js";
import "./chunk-NQNBRQ7H.js";
import {
  CommonModule
} from "./chunk-SQQPVFHK.js";
import {
  debounceTime,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵproperty,
  ɵɵtext
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// src/app/pages/uikit/chartdemo.ts
var ChartDemo = class _ChartDemo {
  layoutService;
  lineData;
  barData;
  pieData;
  polarData;
  radarData;
  lineOptions;
  barOptions;
  pieOptions;
  polarOptions;
  radarOptions;
  subscription;
  constructor(layoutService) {
    this.layoutService = layoutService;
    this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(50)).subscribe(() => {
      this.initCharts();
    });
  }
  ngOnInit() {
    this.initCharts();
  }
  initCharts() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    this.barData = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "My First dataset",
          backgroundColor: documentStyle.getPropertyValue("--p-primary-500"),
          borderColor: documentStyle.getPropertyValue("--p-primary-500"),
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: "My Second dataset",
          backgroundColor: documentStyle.getPropertyValue("--p-primary-200"),
          borderColor: documentStyle.getPropertyValue("--p-primary-200"),
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    };
    this.barOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            display: false,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
    this.pieData = {
      labels: ["A", "B", "C"],
      datasets: [
        {
          data: [540, 325, 702],
          backgroundColor: [documentStyle.getPropertyValue("--p-indigo-500"), documentStyle.getPropertyValue("--p-purple-500"), documentStyle.getPropertyValue("--p-teal-500")],
          hoverBackgroundColor: [documentStyle.getPropertyValue("--p-indigo-400"), documentStyle.getPropertyValue("--p-purple-400"), documentStyle.getPropertyValue("--p-teal-400")]
        }
      ]
    };
    this.pieOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      }
    };
    this.lineData = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "First Dataset",
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          backgroundColor: documentStyle.getPropertyValue("--p-primary-500"),
          borderColor: documentStyle.getPropertyValue("--p-primary-500"),
          tension: 0.4
        },
        {
          label: "Second Dataset",
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          backgroundColor: documentStyle.getPropertyValue("--p-primary-200"),
          borderColor: documentStyle.getPropertyValue("--p-primary-200"),
          tension: 0.4
        }
      ]
    };
    this.lineOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
    this.polarData = {
      datasets: [
        {
          data: [11, 16, 7, 3],
          backgroundColor: [documentStyle.getPropertyValue("--p-indigo-500"), documentStyle.getPropertyValue("--p-purple-500"), documentStyle.getPropertyValue("--p-teal-500"), documentStyle.getPropertyValue("--p-orange-500")],
          label: "My dataset"
        }
      ],
      labels: ["Indigo", "Purple", "Teal", "Orange"]
    };
    this.polarOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        r: {
          grid: {
            color: surfaceBorder
          },
          ticks: {
            display: false,
            color: textColorSecondary
          }
        }
      }
    };
    this.radarData = {
      labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
      datasets: [
        {
          label: "My First dataset",
          borderColor: documentStyle.getPropertyValue("--p-indigo-400"),
          pointBackgroundColor: documentStyle.getPropertyValue("--p-indigo-400"),
          pointBorderColor: documentStyle.getPropertyValue("--p-indigo-400"),
          pointHoverBackgroundColor: textColor,
          pointHoverBorderColor: documentStyle.getPropertyValue("--p-indigo-400"),
          data: [65, 59, 90, 81, 56, 55, 40]
        },
        {
          label: "My Second dataset",
          borderColor: documentStyle.getPropertyValue("--p-purple-400"),
          pointBackgroundColor: documentStyle.getPropertyValue("--p-purple-400"),
          pointBorderColor: documentStyle.getPropertyValue("--p-purple-400"),
          pointHoverBackgroundColor: textColor,
          pointHoverBorderColor: documentStyle.getPropertyValue("--p-purple-400"),
          data: [28, 48, 40, 19, 96, 27, 100]
        }
      ]
    };
    this.radarOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        r: {
          pointLabels: {
            color: textColor
          },
          grid: {
            color: surfaceBorder
          }
        }
      }
    };
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  static \u0275fac = function ChartDemo_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ChartDemo)(\u0275\u0275directiveInject(LayoutService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ChartDemo, selectors: [["app-chart-demo"]], decls: 31, vars: 12, consts: [[1, "grid", "grid-cols-12", "gap-8"], [1, "col-span-12", "xl:col-span-6"], [1, "card"], [1, "font-semibold", "text-xl", "mb-6"], ["type", "line", 3, "data", "options"], ["type", "bar", 3, "data", "options"], [1, "card", "flex", "flex-col", "items-center"], ["type", "pie", 3, "data", "options"], ["type", "doughnut", 3, "data", "options"], ["type", "polarArea", 3, "data", "options"], ["type", "radar", 3, "data", "options"]], template: function ChartDemo_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "p-fluid", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
      \u0275\u0275text(4, "Linear");
      \u0275\u0275elementEnd();
      \u0275\u0275element(5, "p-chart", 4);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 1)(7, "div", 2)(8, "div", 3);
      \u0275\u0275text(9, "Bar");
      \u0275\u0275elementEnd();
      \u0275\u0275element(10, "p-chart", 5);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(11, "div", 1)(12, "div", 6)(13, "div", 3);
      \u0275\u0275text(14, "Pie");
      \u0275\u0275elementEnd();
      \u0275\u0275element(15, "p-chart", 7);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(16, "div", 1)(17, "div", 6)(18, "div", 3);
      \u0275\u0275text(19, "Doughnut");
      \u0275\u0275elementEnd();
      \u0275\u0275element(20, "p-chart", 8);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(21, "div", 1)(22, "div", 6)(23, "div", 3);
      \u0275\u0275text(24, "Polar Area");
      \u0275\u0275elementEnd();
      \u0275\u0275element(25, "p-chart", 9);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(26, "div", 1)(27, "div", 6)(28, "div", 3);
      \u0275\u0275text(29, "Radar");
      \u0275\u0275elementEnd();
      \u0275\u0275element(30, "p-chart", 10);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(5);
      \u0275\u0275property("data", ctx.lineData)("options", ctx.lineOptions);
      \u0275\u0275advance(5);
      \u0275\u0275property("data", ctx.barData)("options", ctx.barOptions);
      \u0275\u0275advance(5);
      \u0275\u0275property("data", ctx.pieData)("options", ctx.pieOptions);
      \u0275\u0275advance(5);
      \u0275\u0275property("data", ctx.pieData)("options", ctx.pieOptions);
      \u0275\u0275advance(5);
      \u0275\u0275property("data", ctx.polarData)("options", ctx.polarOptions);
      \u0275\u0275advance(5);
      \u0275\u0275property("data", ctx.radarData)("options", ctx.radarOptions);
    }
  }, dependencies: [CommonModule, ChartModule, UIChart, FluidModule, Fluid], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ChartDemo, { className: "ChartDemo", filePath: "src/app/pages/uikit/chartdemo.ts", lineNumber: 53 });
})();
export {
  ChartDemo
};
//# sourceMappingURL=chunk-P5YPPGZ3.js.map
