import {
  ProductService
} from "./chunk-JVDBGEQL.js";
import {
  Timeline,
  TimelineModule
} from "./chunk-YFROPUH7.js";
import {
  Popover,
  PopoverModule
} from "./chunk-Q5J6E52W.js";
import {
  ChartModule,
  UIChart
} from "./chunk-D6T4WP2M.js";
import {
  LayoutService
} from "./chunk-ZGNAW63S.js";
import {
  InputGroupAddon,
  InputGroupAddonModule
} from "./chunk-7A3QEVK3.js";
import {
  Menu,
  MenuModule
} from "./chunk-RKCUEC6H.js";
import {
  InputGroup,
  InputGroupModule
} from "./chunk-GEBY3FYZ.js";
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
import {
  Tag,
  TagModule
} from "./chunk-MYUKI7DG.js";
import "./chunk-544F7IXR.js";
import "./chunk-YBM6FZLP.js";
import "./chunk-U4P2VV4G.js";
import "./chunk-CPYA4VSS.js";
import {
  Card,
  CardModule
} from "./chunk-H46GQ57A.js";
import "./chunk-JGOABXTK.js";
import "./chunk-HY2A3TN6.js";
import "./chunk-YEN5RMZS.js";
import "./chunk-XS7IVZ5T.js";
import "./chunk-CUABQE42.js";
import "./chunk-V6CKOH3G.js";
import "./chunk-DBPX6ILC.js";
import "./chunk-WIQZFAVH.js";
import "./chunk-CCBQFN2J.js";
import "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
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
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import {
  Ripple,
  RippleModule
} from "./chunk-AP3OAIHW.js";
import "./chunk-NQNBRQ7H.js";
import "./chunk-3HTR5OU7.js";
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
  ɵɵpureFunction4,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuery
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// src/app/pages/dashboard/sales/components/statswidget.ts
var _c0 = ["menu"];
function StatsWidget_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "div", 2)(2, "div", 3)(3, "div", 4);
    \u0275\u0275element(4, "i", 5);
    \u0275\u0275elementStart(5, "span", 6);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 7)(8, "button", 8);
    \u0275\u0275listener("click", function StatsWidget_ng_container_0_Template_button_click_8_listener($event) {
      const i_r2 = \u0275\u0275restoreView(_r1).index;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.toggleMenu($event, i_r2));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(9, "p-menu", 9, 0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 10)(12, "div", 11)(13, "span", 12);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "span", 13);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 14);
    \u0275\u0275element(18, "p-chart", 15);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const stat_r4 = ctx.$implicit;
    const i_r2 = ctx.index;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("ngClass", stat_r4.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(stat_r4.title);
    \u0275\u0275advance(3);
    \u0275\u0275property("model", ctx_r2.items);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(stat_r4.value);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", stat_r4.colorClass);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(stat_r4.subValue);
    \u0275\u0275advance(2);
    \u0275\u0275property("data", i_r2 === 0 ? ctx_r2.overviewChartData1 : i_r2 === 1 ? ctx_r2.overviewChartData2 : i_r2 === 2 ? ctx_r2.overviewChartData3 : ctx_r2.overviewChartData4)("options", ctx_r2.chartOptions);
  }
}
var StatsWidget = class _StatsWidget {
  menu;
  layoutService = inject(LayoutService);
  items = [
    { label: "Update", icon: "pi pi-fw pi-refresh" },
    { label: "Edit", icon: "pi pi-fw pi-pencil" }
  ];
  stats = [
    {
      icon: "pi pi-shopping-cart",
      title: "Orders",
      value: "640",
      subValue: "1420 Completed",
      colorClass: "text-teal-600 dark:text-teal-200"
    },
    {
      icon: "pi pi-dollar",
      title: "Revenue",
      value: "$57K",
      subValue: "$9,640 Income",
      colorClass: "text-teal-600 dark:text-teal-200"
    },
    {
      icon: "pi pi-users",
      title: "Customers",
      value: "8572",
      subValue: "25402 Registered",
      colorClass: "text-pink-600 dark:text-pink-200"
    },
    {
      icon: "pi pi-comments",
      title: "Comments",
      value: "805",
      subValue: "85 Responded",
      colorClass: "text-teal-600 dark:text-teal-200"
    }
  ];
  chartDatasets = [
    [50, 64, 32, 24, 18, 27, 20, 36, 30],
    [11, 30, 52, 35, 39, 20, 14, 18, 29],
    [20, 29, 39, 36, 45, 24, 28, 20, 15],
    [30, 39, 50, 21, 33, 18, 10, 24, 20]
  ];
  chartOptions = {
    plugins: {
      legend: {
        display: false
      }
    },
    responsive: true,
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
  overviewChartData1;
  overviewChartData2;
  overviewChartData3;
  overviewChartData4;
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
  toggleMenu(event, index) {
    const menu = this.menu.toArray()[index];
    menu.toggle(event);
  }
  initChart() {
    this.overviewChartData1 = this.createChartData(this.chartDatasets[0]);
    this.overviewChartData2 = this.createChartData(this.chartDatasets[1]);
    this.overviewChartData3 = this.createChartData(this.chartDatasets[2]);
    this.overviewChartData4 = this.createChartData(this.chartDatasets[3]);
    this.setOverviewColors();
  }
  setOverviewColors() {
    const colors = this.getOverviewColors();
    const chartData = [this.overviewChartData1, this.overviewChartData2, this.overviewChartData3, this.overviewChartData4];
    chartData.forEach((chart, index) => {
      const isPink = index === 2;
      chart.datasets[0].borderColor[0] = isPink ? colors.pinkBorderColor : colors.tealBorderColor;
      chart.datasets[0].backgroundColor[0] = isPink ? colors.pinkBgColor : colors.tealBgColor;
    });
  }
  getOverviewColors() {
    return {
      pinkBorderColor: !this.layoutService.isDarkTheme() ? "#E91E63" : "#EC407A",
      pinkBgColor: !this.layoutService.isDarkTheme() ? "#F48FB1" : "#F8BBD0",
      tealBorderColor: !this.layoutService.isDarkTheme() ? "#009688" : "#26A69A",
      tealBgColor: !this.layoutService.isDarkTheme() ? "#80CBC4" : "#B2DFDB"
    };
  }
  createChartData(data) {
    return {
      labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September"],
      datasets: [
        {
          data,
          borderColor: ["#4DD0E1"],
          backgroundColor: ["rgba(77, 208, 225, 0.8)"],
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }
      ]
    };
  }
  static \u0275fac = function StatsWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _StatsWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _StatsWidget, selectors: [["stats-widget"]], viewQuery: function StatsWidget_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.menu = _t);
    }
  }, hostAttrs: [1, "col-span-12", "grid", "grid-cols-12", "gap-4"], decls: 1, vars: 1, consts: [["menu", ""], [4, "ngFor", "ngForOf"], [1, "col-span-12", "md:col-span-6", "lg:col-span-3"], [1, "card", "flex", "flex-col"], [1, "flex", "items-center", "text-gray-700"], [1, "text-color", 3, "ngClass"], [1, "font-semibold", "m-0", "text-color", "pl-2"], [1, "ml-auto"], ["pButton", "", "pRipple", "", "icon", "pi pi-ellipsis-h", "rounded", "", "text", "", 3, "click"], ["popup", "", 3, "model"], [1, "flex", "justify-between", "mt-4", "flex-wrap"], [1, "flex", "flex-col", 2, "width", "80px"], [1, "mb-1", "text-4xl"], [1, "font-medium", "rounded-sm", "p-1", "text-sm", 3, "ngClass"], [1, "flex", "items-end"], ["type", "line", "height", "60", "width", "160", 3, "data", "options"]], template: function StatsWidget_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, StatsWidget_ng_container_0_Template, 19, 8, "ng-container", 1);
    }
    if (rf & 2) {
      \u0275\u0275property("ngForOf", ctx.stats);
    }
  }, dependencies: [CommonModule, NgClass, NgForOf, ButtonModule, ButtonDirective, MenuModule, Menu, ChartModule, UIChart, RippleModule, Ripple], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(StatsWidget, { className: "StatsWidget", filePath: "src/app/pages/dashboard/sales/components/statswidget.ts", lineNumber: 41 });
})();

// src/app/pages/dashboard/sales/components/contactwidget.ts
function ContactWidget_li_9_p_tag_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-tag", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tag_r3 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(tag_r3);
  }
}
function ContactWidget_li_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 8)(1, "div", 9);
    \u0275\u0275element(2, "img", 10);
    \u0275\u0275elementStart(3, "div", 11)(4, "div");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "small", 12);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 13);
    \u0275\u0275template(9, ContactWidget_li_9_p_tag_9_Template, 2, 1, "p-tag", 14);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const contact_r4 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("src", contact_r4.avatar, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(contact_r4.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(contact_r4.email);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", contact_r4.tags);
  }
}
var ContactWidget = class _ContactWidget {
  items = [
    { label: "New", icon: "pi pi-fw pi-plus" },
    { label: "Edit", icon: "pi pi-fw pi-pencil" },
    { label: "Delete", icon: "pi pi-fw pi-trash" }
  ];
  contacts = [
    {
      name: "Xuxue Feng",
      email: "feng@ultima.org",
      avatar: "/images/avatar/xuxuefeng.png",
      tags: ["Accounting", "Sales"]
    },
    {
      name: "Elwin Sharvill",
      email: "sharvill@ultima.org",
      avatar: "/images/avatar/elwinsharvill.png",
      tags: ["Finance", "Sales"]
    },
    {
      name: "Anna Fali",
      email: "fali@ultima.org",
      avatar: "/images/avatar/asiyajavayant.png",
      tags: ["Management"]
    },
    {
      name: "Jon Stone",
      email: "stone@ultima.org",
      avatar: "/images/avatar/ivanmagalhaes.png",
      tags: ["Management", "Finance"]
    },
    {
      name: "Stephen Shaw",
      email: "shaw@ultima.org",
      avatar: "/images/avatar/stephenshaw.png",
      tags: ["Finance"]
    }
  ];
  static \u0275fac = function ContactWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ContactWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ContactWidget, selectors: [["contact-widget"]], decls: 10, vars: 2, consts: [["menu", ""], [1, "card", "h-full"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "font-semibold", "text-xl", "m-0"], ["pButton", "", "pRipple", "", "icon", "pi pi-ellipsis-h", "rounded", "", "text", "", 3, "click"], ["popup", "", 3, "model"], [1, "p-0", "m-0", "border-0", "list-none"], ["class", "flex items-center py-4 justify-between", 4, "ngFor", "ngForOf"], [1, "flex", "items-center", "py-4", "justify-between"], [1, "flex", "items-center"], ["alt", "avatar", 3, "src"], [1, "ml-2"], [1, "text-muted-color"], [1, "flex", "gap-2"], ["severity", "secondary", 4, "ngFor", "ngForOf"], ["severity", "secondary"]], template: function ContactWidget_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "span", 3);
      \u0275\u0275text(3, "Contact");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div")(5, "button", 4);
      \u0275\u0275listener("click", function ContactWidget_Template_button_click_5_listener($event) {
        \u0275\u0275restoreView(_r1);
        const menu_r2 = \u0275\u0275reference(7);
        return \u0275\u0275resetView(menu_r2.toggle($event));
      });
      \u0275\u0275elementEnd();
      \u0275\u0275element(6, "p-menu", 5, 0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "ul", 6);
      \u0275\u0275template(9, ContactWidget_li_9_Template, 10, 4, "li", 7);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275property("model", ctx.items);
      \u0275\u0275advance(3);
      \u0275\u0275property("ngForOf", ctx.contacts);
    }
  }, dependencies: [CommonModule, NgForOf, ButtonModule, ButtonDirective, RippleModule, Ripple, TagModule, Tag, MenuModule, Menu], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ContactWidget, { className: "ContactWidget", filePath: "src/app/pages/dashboard/sales/components/contactwidget.ts", lineNumber: 36 });
})();

// src/app/pages/dashboard/sales/components/ordergraphwidget.ts
var OrderGraphWidget = class _OrderGraphWidget {
  layoutService = inject(LayoutService);
  items = [
    { label: "Update", icon: "pi pi-fw pi-refresh" },
    { label: "Edit", icon: "pi pi-fw pi-pencil" }
  ];
  ordersOptions;
  ordersChart;
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
    this.ordersChart = {
      labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September"],
      datasets: [
        {
          label: "New Orders",
          data: [31, 23, 69, 29, 62, 25, 59, 26, 46],
          borderColor: ["#4DD0E1"],
          backgroundColor: ["rgba(77, 208, 225, 0.2)"],
          borderWidth: 2,
          fill: true,
          tension: 0.4
        },
        {
          label: "Completed Orders",
          data: [57, 48, 27, 88, 38, 3, 22, 60, 56],
          borderColor: ["#3F51B5"],
          backgroundColor: ["rgba(63, 81, 181, 0.4)"],
          borderWidth: 2,
          fill: false,
          tension: 0.4
        }
      ]
    };
    this.ordersOptions = this.getOrdersOptions();
  }
  getOrdersOptions() {
    const textColor = getComputedStyle(document.body).getPropertyValue("--text-color") || "rgba(0, 0, 0, 0.87)";
    const gridLinesColor = getComputedStyle(document.body).getPropertyValue("--surface-border") || "rgba(160, 167, 181, .3)";
    const fontFamily = getComputedStyle(document.body).getPropertyValue("--font-family");
    return {
      plugins: {
        legend: {
          display: true,
          labels: {
            font: {
              family: fontFamily
            },
            color: textColor
          }
        }
      },
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        y: {
          ticks: {
            font: {
              family: fontFamily
            },
            color: textColor
          },
          grid: {
            color: gridLinesColor
          }
        },
        x: {
          ticks: {
            font: {
              family: fontFamily
            },
            color: textColor
          },
          grid: {
            color: gridLinesColor
          }
        }
      }
    };
  }
  static \u0275fac = function OrderGraphWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OrderGraphWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _OrderGraphWidget, selectors: [["order-graph-widget"]], decls: 9, vars: 3, consts: [["menu", ""], [1, "card", "h-full"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "font-semibold", "text-xl", "m-0"], ["pButton", "", "pRipple", "", "icon", "pi pi-ellipsis-h", "rounded", "", "text", "", 3, "click"], ["popup", "", 3, "model"], ["type", "line", "height", "375", "width", "300", 3, "data", "options"]], template: function OrderGraphWidget_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "span", 3);
      \u0275\u0275text(3, "Order Graph");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div")(5, "button", 4);
      \u0275\u0275listener("click", function OrderGraphWidget_Template_button_click_5_listener($event) {
        \u0275\u0275restoreView(_r1);
        const menu_r2 = \u0275\u0275reference(7);
        return \u0275\u0275resetView(menu_r2.toggle($event));
      });
      \u0275\u0275elementEnd();
      \u0275\u0275element(6, "p-menu", 5, 0);
      \u0275\u0275elementEnd()();
      \u0275\u0275element(8, "p-chart", 6);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275property("model", ctx.items);
      \u0275\u0275advance(2);
      \u0275\u0275property("data", ctx.ordersChart)("options", ctx.ordersOptions);
    }
  }, dependencies: [ButtonModule, ButtonDirective, RippleModule, Ripple, ChartModule, UIChart, MenuModule, Menu], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(OrderGraphWidget, { className: "OrderGraphWidget", filePath: "src/app/pages/dashboard/sales/components/ordergraphwidget.ts", lineNumber: 24 });
})();

// src/app/pages/dashboard/sales/components/customtimelinewidget.ts
function CustomTimelineWidget_ng_template_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 9);
    \u0275\u0275element(1, "i", 10);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const event_r3 = ctx.$implicit;
    \u0275\u0275styleProp("background-color", event_r3.color);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", event_r3.icon);
  }
}
function CustomTimelineWidget_ng_template_11_img_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 13);
  }
  if (rf & 2) {
    const event_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("src", "/images/product/" + event_r4.image, \u0275\u0275sanitizeUrl)("alt", event_r4.name);
  }
}
function CustomTimelineWidget_ng_template_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-card", 11);
    \u0275\u0275template(1, CustomTimelineWidget_ng_template_11_img_1_Template, 1, 2, "img", 12);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const event_r4 = ctx.$implicit;
    \u0275\u0275property("header", event_r4.status)("subheader", event_r4.date);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", event_r4.image);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(event_r4.description);
  }
}
var CustomTimelineWidget = class _CustomTimelineWidget {
  items = [
    { label: "Update", icon: "pi pi-fw pi-refresh" },
    { label: "Edit", icon: "pi pi-fw pi-pencil" }
  ];
  timelineEvents = [
    { status: "Ordered", date: "15/10/2024 10:30", icon: "pi pi-shopping-cart", color: "#E91E63", description: "Richard Jones (C8012) has ordered a blue t-shirt for $79." },
    { status: "Processing", date: "15/10/2024 14:00", icon: "pi pi-cog", color: "#FB8C00", description: "Order #99207 has processed succesfully." },
    { status: "Shipped", date: "15/10/2024 16:15", icon: "pi pi-compass", color: "#673AB7", description: "Order #99207 has shipped with shipping code 2222302090." },
    { status: "Delivered", date: "16/10/2024 10:00", icon: "pi pi-check-square", color: "#0097A7", description: "Richard Jones (C8012) has recieved his blue t-shirt." }
  ];
  static \u0275fac = function CustomTimelineWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CustomTimelineWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CustomTimelineWidget, selectors: [["custom-timeline-widget"]], decls: 13, vars: 2, consts: [["menu", ""], ["marker", ""], ["content", ""], [1, "card", "h-full"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "font-semibold", "text-xl", "m-0"], ["pButton", "", "pRipple", "", "icon", "pi pi-ellipsis-h", "rounded", "", "text", "", 3, "click"], ["popup", "", 3, "model"], ["align", "left", 3, "value"], [1, "shadow", "w-8", "h-8", "rounded-full", "flex", "justify-center", "items-center"], [1, "text-white", 3, "ngClass"], ["styleClass", "mb-4 !shadow-none border border-surface !rounded-xl", 3, "header", "subheader"], ["width", "200", "class", "shadow-2", 3, "src", "alt", 4, "ngIf"], ["width", "200", 1, "shadow-2", 3, "src", "alt"]], template: function CustomTimelineWidget_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 3)(1, "div", 4)(2, "span", 5);
      \u0275\u0275text(3, "Timeline");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div")(5, "button", 6);
      \u0275\u0275listener("click", function CustomTimelineWidget_Template_button_click_5_listener($event) {
        \u0275\u0275restoreView(_r1);
        const menu_r2 = \u0275\u0275reference(7);
        return \u0275\u0275resetView(menu_r2.toggle($event));
      });
      \u0275\u0275elementEnd();
      \u0275\u0275element(6, "p-menu", 7, 0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "p-timeline", 8);
      \u0275\u0275template(9, CustomTimelineWidget_ng_template_9_Template, 2, 3, "ng-template", null, 1, \u0275\u0275templateRefExtractor)(11, CustomTimelineWidget_ng_template_11_Template, 4, 4, "ng-template", null, 2, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275property("model", ctx.items);
      \u0275\u0275advance(2);
      \u0275\u0275property("value", ctx.timelineEvents);
    }
  }, dependencies: [CommonModule, NgClass, NgIf, TimelineModule, Timeline, ButtonModule, ButtonDirective, CardModule, Card, MenuModule, Menu, RippleModule, Ripple], styles: ["\n\n[_nghost-%COMP%]     .p-timeline-event-opposite {\n  flex: 0;\n  padding: 0 !important;\n}\n[_nghost-%COMP%]     .p-card {\n  box-shadow: none;\n}\n/*# sourceMappingURL=customtimelinewidget.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CustomTimelineWidget, { className: "CustomTimelineWidget", filePath: "src/app/pages/dashboard/sales/components/customtimelinewidget.ts", lineNumber: 48 });
})();

// src/app/pages/dashboard/sales/components/salestablewidget.ts
var _c02 = () => ({ "min-width": "40rem" });
function SalesTableWidget_ng_template_2_Template(rf, ctx) {
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
function SalesTableWidget_ng_template_4_Template(rf, ctx) {
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
var SalesTableWidget = class _SalesTableWidget {
  productService;
  products = signal([]);
  constructor(productService) {
    this.productService = productService;
    this.productService.getProducts().then((data) => {
      this.products.set(data);
    });
  }
  static \u0275fac = function SalesTableWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SalesTableWidget)(\u0275\u0275directiveInject(ProductService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SalesTableWidget, selectors: [["sales-table-widget"]], features: [\u0275\u0275ProvidersFeature([ProductService])], decls: 6, vars: 5, consts: [["header", ""], ["body", ""], [1, "card"], [3, "value", "paginator", "rows", "tableStyle"], [2, "width", "5rem"], ["pSortableColumn", "name", 2, "min-width", "14rem"], ["field", "name"], ["pSortableColumn", "category", 2, "min-width", "8rem"], ["field", "category"], ["pSortableColumn", "price", 2, "min-width", "8rem"], ["field", "price"], ["width", "50px", 1, "shadow-lg", "w-12", 3, "src", "alt"], ["pRipple", "", "pButton", "", "type", "button", "icon", "pi pi-search", "rounded", "", "text", "", 1, "mb-1"]], template: function SalesTableWidget_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 2)(1, "p-table", 3);
      \u0275\u0275template(2, SalesTableWidget_ng_template_2_Template, 14, 0, "ng-template", null, 0, \u0275\u0275templateRefExtractor)(4, SalesTableWidget_ng_template_4_Template, 12, 8, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275property("value", ctx.products())("paginator", true)("rows", 8)("tableStyle", \u0275\u0275pureFunction0(4, _c02));
    }
  }, dependencies: [CommonModule, CurrencyPipe, TableModule, Table, SortableColumn, SortIcon, ButtonModule, ButtonDirective, RippleModule, Ripple], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SalesTableWidget, { className: "SalesTableWidget", filePath: "src/app/pages/dashboard/sales/components/salestablewidget.ts", lineNumber: 56 });
})();

// src/app/pages/dashboard/sales/components/chatwidget.ts
var _c03 = ["chatcontainer"];
var _c1 = (a0, a1, a2, a3) => ({ from: a0, "text-right justify-end": a1, "mb-3": a2, "mb-1": a3 });
var _c2 = (a0, a1) => ({ "items-start": a0, "items-end": a1 });
var _c3 = (a0, a1, a2) => ({ "bg-cyan-500": a0, "bg-pink-500": a1, "mt-1": a2 });
function ChatWidget_li_11_img_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 21);
  }
  if (rf & 2) {
    const chartMessage_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("src", chartMessage_r3.url, \u0275\u0275sanitizeUrl);
  }
}
function ChatWidget_li_11_span_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 22);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const message_r4 = ctx.$implicit;
    const first_r5 = ctx.first;
    const chartMessage_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction3(2, _c3, !!chartMessage_r3.from, !chartMessage_r3.from, !first_r5));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", message_r4, " ");
  }
}
function ChatWidget_li_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 17);
    \u0275\u0275template(1, ChatWidget_li_11_img_1_Template, 1, 1, "img", 18);
    \u0275\u0275elementStart(2, "div", 19);
    \u0275\u0275template(3, ChatWidget_li_11_span_3_Template, 2, 6, "span", 20);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const chartMessage_r3 = ctx.$implicit;
    const last_r6 = ctx.last;
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction4(4, _c1, !!chartMessage_r3.from, !chartMessage_r3.from, !last_r6, last_r6));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !!chartMessage_r3.url);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(9, _c2, !!chartMessage_r3.from, !chartMessage_r3.from));
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", chartMessage_r3.messages);
  }
}
function ChatWidget_button_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 23);
    \u0275\u0275listener("click", function ChatWidget_button_23_Template_button_click_0_listener() {
      const emoji_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r9 = \u0275\u0275nextContext();
      const chatInput_r11 = \u0275\u0275reference(16);
      const op_r7 = \u0275\u0275reference(22);
      op_r7.hide();
      return \u0275\u0275resetView(ctx_r9.onEmojiClick(chatInput_r11, emoji_r9));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const emoji_r9 = ctx.$implicit;
    \u0275\u0275property("label", emoji_r9);
  }
}
var ChatWidget = class _ChatWidget {
  chatContainerViewChild;
  items = [
    { label: "View Media", icon: "pi pi-fw pi-images" },
    { label: "Starred Messages", icon: "pi pi-fw pi-star" },
    { label: "Search", icon: "pi pi-fw pi-search" }
  ];
  chatMessages = [
    {
      from: "Ioni Bowcher",
      url: "/images/avatar/ionibowcher.png",
      messages: ["Hey M. hope you are well.", "Our idea is accepted by the board. Now it\u2019s time to execute it"]
    },
    { messages: ["We did it! \u{1F920}"] },
    {
      from: "Ioni Bowcher",
      url: "/images/avatar/ionibowcher.png",
      messages: ["That's really good!"]
    },
    { messages: ["But it\u2019s important to ship MVP ASAP"] },
    {
      from: "Ioni Bowcher",
      url: "/images/avatar/ionibowcher.png",
      messages: ["I\u2019ll be looking at the process then, just to be sure \u{1F913}"]
    },
    { messages: ["That\u2019s awesome. Thanks!"] }
  ];
  chatEmojis = [
    "\u{1F600}",
    "\u{1F603}",
    "\u{1F604}",
    "\u{1F601}",
    "\u{1F606}",
    "\u{1F605}",
    "\u{1F602}",
    "\u{1F923}",
    "\u{1F607}",
    "\u{1F609}",
    "\u{1F60A}",
    "\u{1F642}",
    "\u{1F643}",
    "\u{1F60B}",
    "\u{1F60C}",
    "\u{1F60D}",
    "\u{1F970}",
    "\u{1F618}",
    "\u{1F617}",
    "\u{1F619}",
    "\u{1F61A}",
    "\u{1F92A}",
    "\u{1F61C}",
    "\u{1F61D}",
    "\u{1F61B}",
    "\u{1F911}",
    "\u{1F60E}",
    "\u{1F913}",
    "\u{1F9D0}",
    "\u{1F920}",
    "\u{1F973}",
    "\u{1F917}",
    "\u{1F921}",
    "\u{1F60F}",
    "\u{1F636}",
    "\u{1F610}",
    "\u{1F611}",
    "\u{1F612}",
    "\u{1F644}",
    "\u{1F928}",
    "\u{1F914}",
    "\u{1F92B}",
    "\u{1F92D}",
    "\u{1F925}",
    "\u{1F633}",
    "\u{1F61E}",
    "\u{1F61F}",
    "\u{1F620}",
    "\u{1F621}",
    "\u{1F92C}",
    "\u{1F614}",
    "\u{1F61F}",
    "\u{1F620}",
    "\u{1F621}",
    "\u{1F92C}",
    "\u{1F614}",
    "\u{1F615}",
    "\u{1F641}",
    "\u{1F62C}",
    "\u{1F97A}",
    "\u{1F623}",
    "\u{1F616}",
    "\u{1F62B}",
    "\u{1F629}",
    "\u{1F971}",
    "\u{1F624}",
    "\u{1F62E}",
    "\u{1F631}",
    "\u{1F628}",
    "\u{1F630}",
    "\u{1F62F}",
    "\u{1F626}",
    "\u{1F627}",
    "\u{1F622}",
    "\u{1F625}",
    "\u{1F62A}",
    "\u{1F924}"
  ];
  onEmojiClick(chatInput, emoji) {
    if (chatInput) {
      chatInput.value += emoji;
      chatInput.focus();
    }
  }
  onChatKeydown(event) {
    if (event.key === "Enter") {
      const message = event.currentTarget.value;
      const lastMessage = this.chatMessages[this.chatMessages.length - 1];
      if (lastMessage.from) {
        this.chatMessages.push({ messages: [message] });
      } else {
        lastMessage.messages.push(message);
      }
      if (message.match(/primeng|primereact|primefaces|primevue/i)) {
        this.chatMessages.push({
          from: "Ioni Bowcher",
          url: "/images/avatar/ionibowcher.png",
          messages: ["Always bet on Prime!"]
        });
      }
      event.currentTarget.value = "";
      const el = this.chatContainerViewChild.nativeElement;
      setTimeout(() => {
        el.scroll({
          top: el.scrollHeight,
          behavior: "smooth"
        });
      }, 1);
    }
  }
  static \u0275fac = function ChatWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ChatWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ChatWidget, selectors: [["chat-widget"]], viewQuery: function ChatWidget_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c03, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.chatContainerViewChild = _t.first);
    }
  }, decls: 24, vars: 4, consts: [["menu", ""], ["chatcontainer", ""], ["chatInput", ""], ["op", ""], [1, "card", "h-full"], [1, "flex", "items-center", "justify-between", "mb-3"], ["pButton", "", "pRipple", "", "type", "button", "icon", "pi pi-ellipsis-h", "rounded", "", "text", "", 3, "click"], [3, "popup", "model"], [1, "chat-container", "m-0", "px-4", "pt-4", "pb-0", "border-0", "list-none", "h-[30rem]", "overflow-y-auto", "outline-0"], ["class", "flex items-start", 3, "ngClass", 4, "ngFor", "ngForOf"], [1, "mt-4"], ["pButton", "", "pRipple", "", "type", "button", "icon", "pi pi-plus-circle", "text", "", 1, "h-full"], ["type", "text", "pInputText", "", "placeholder", "Write your message (Hint: 'PrimeNG')", 3, "keydown"], ["pButton", "", "pRipple", "", "type", "button", "icon", "pi pi-video", "text", "", 1, "h-full"], ["pButton", "", "pRipple", "", "type", "button", "icon", "pi pi-clock", 1, "h-full", 3, "click"], ["styleClass", "w-[45em]"], ["pButton", "", "pRipple", "", "type", "button", "class", "emoji-button p-2", "text", "", 3, "label", "click", 4, "ngFor", "ngForOf"], [1, "flex", "items-start", 3, "ngClass"], ["alt", "avatar", "width", "32px", "class", "mr-2", 3, "src", 4, "ngIf"], [1, "flex", "flex-col", 3, "ngClass"], ["style", "word-break: break-word;", "class", "p-4 rounded-3xl text-white", 3, "ngClass", 4, "ngFor", "ngForOf"], ["alt", "avatar", "width", "32px", 1, "mr-2", 3, "src"], [1, "p-4", "rounded-3xl", "text-white", 2, "word-break", "break-word", 3, "ngClass"], ["pButton", "", "pRipple", "", "type", "button", "text", "", 1, "emoji-button", "p-2", 3, "click", "label"]], template: function ChatWidget_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 4)(1, "div", 5)(2, "h5");
      \u0275\u0275text(3, "Chat");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div")(5, "button", 6);
      \u0275\u0275listener("click", function ChatWidget_Template_button_click_5_listener($event) {
        \u0275\u0275restoreView(_r1);
        const menu_r2 = \u0275\u0275reference(7);
        return \u0275\u0275resetView(menu_r2.toggle($event));
      });
      \u0275\u0275elementEnd();
      \u0275\u0275element(6, "p-menu", 7, 0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div")(9, "ul", 8, 1);
      \u0275\u0275template(11, ChatWidget_li_11_Template, 4, 12, "li", 9);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "p-input-group", 10)(13, "p-inputgroup-addon");
      \u0275\u0275element(14, "button", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "input", 12, 2);
      \u0275\u0275listener("keydown", function ChatWidget_Template_input_keydown_15_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onChatKeydown($event));
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "p-inputgroup-addon");
      \u0275\u0275element(18, "button", 13);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "p-inputgroup-addon")(20, "button", 14);
      \u0275\u0275listener("click", function ChatWidget_Template_button_click_20_listener($event) {
        \u0275\u0275restoreView(_r1);
        const op_r7 = \u0275\u0275reference(22);
        return \u0275\u0275resetView(op_r7.toggle($event));
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "p-popover", 15, 3);
      \u0275\u0275template(23, ChatWidget_button_23_Template, 1, 1, "button", 16);
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275property("popup", true)("model", ctx.items);
      \u0275\u0275advance(5);
      \u0275\u0275property("ngForOf", ctx.chatMessages);
      \u0275\u0275advance(12);
      \u0275\u0275property("ngForOf", ctx.chatEmojis);
    }
  }, dependencies: [CommonModule, NgClass, NgForOf, NgIf, ButtonModule, ButtonDirective, RippleModule, Ripple, MenuModule, Menu, InputTextModule, InputText, InputGroupModule, InputGroup, InputGroupAddonModule, InputGroupAddon, PopoverModule, Popover], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ChatWidget, { className: "ChatWidget", filePath: "src/app/pages/dashboard/sales/components/chatwidget.ts", lineNumber: 57 });
})();

// src/app/pages/dashboard/sales/components/activitywidget.ts
var _c04 = (a0) => [a0, "w-6/12 h-full rounded-lg"];
function ActivityWidget_div_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7)(1, "li", 8)(2, "div", 9)(3, "div", 10);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 11);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 12);
    \u0275\u0275element(8, "div", 13);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const activity_r3 = ctx.$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(activity_r3.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(activity_r3.description);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(3, _c04, activity_r3.progressColor));
  }
}
var ActivityWidget = class _ActivityWidget {
  items = [
    { label: "Update", icon: "pi pi-fw pi-refresh" },
    { label: "Edit", icon: "pi pi-fw pi-pencil" }
  ];
  activities = [
    {
      title: "Income",
      description: "30 November, 16.20",
      progressColor: "bg-yellow-500"
    },
    {
      title: "Tax",
      description: "1 December, 15.27",
      progressColor: "bg-pink-500"
    },
    {
      title: "Invoices",
      description: "1 December, 15.28",
      progressColor: "bg-cyan-600"
    },
    {
      title: "Expanses",
      description: "3 December, 09.15",
      progressColor: "bg-cyan-600"
    },
    {
      title: "Bonus",
      description: "1 December, 23.55",
      progressColor: "bg-cyan-600"
    },
    {
      title: "Revenue",
      description: "30 November, 16.20",
      progressColor: "bg-pink-500"
    }
  ];
  static \u0275fac = function ActivityWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ActivityWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ActivityWidget, selectors: [["activity-widget"]], decls: 9, vars: 2, consts: [["menu", ""], [1, "card", "h-full"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "font-semibold", "text-xl", "m-0"], ["pButton", "", "pRipple", "", "icon", "pi pi-ellipsis-h", "rounded", "", "text", "", 3, "click"], ["popup", "", 3, "model"], ["class", "widget-activity p-0 list-none", 4, "ngFor", "ngForOf"], [1, "widget-activity", "p-0", "list-none"], [1, "py-4", "px-0", "border-b", "border-surface"], [1, "activity-item", "flex", "flex-col"], [1, "font-medium", "mb-1"], [1, "text-sm", "text-muted-color", "mb-2"], [1, "bg-surface-50", "dark:bg-surface-800", 2, "height", "6px"], [3, "ngClass"]], template: function ActivityWidget_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "span", 3);
      \u0275\u0275text(3, "Activity");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div")(5, "button", 4);
      \u0275\u0275listener("click", function ActivityWidget_Template_button_click_5_listener($event) {
        \u0275\u0275restoreView(_r1);
        const menu_r2 = \u0275\u0275reference(7);
        return \u0275\u0275resetView(menu_r2.toggle($event));
      });
      \u0275\u0275elementEnd();
      \u0275\u0275element(6, "p-menu", 5, 0);
      \u0275\u0275elementEnd()();
      \u0275\u0275template(8, ActivityWidget_div_8_Template, 9, 5, "div", 6);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275property("model", ctx.items);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngForOf", ctx.activities);
    }
  }, dependencies: [CommonModule, NgClass, NgForOf, ButtonModule, ButtonDirective, RippleModule, Ripple, MenuModule, Menu], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ActivityWidget, { className: "ActivityWidget", filePath: "src/app/pages/dashboard/sales/components/activitywidget.ts", lineNumber: 33 });
})();

// src/app/pages/dashboard/sales/components/bestsellerswidget.ts
function BestSellersWidget_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275element(1, "img", 10);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 11)(5, "a", 12);
    \u0275\u0275element(6, "i", 13);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const seller_r3 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("src", seller_r3.image, \u0275\u0275sanitizeUrl)("alt", seller_r3.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(seller_r3.name);
  }
}
var BestSellersWidget = class _BestSellersWidget {
  items = [
    { label: "Update", icon: "pi pi-fw pi-refresh" },
    { label: "Edit", icon: "pi pi-fw pi-pencil" }
  ];
  sellers = [
    {
      name: "Blue Band",
      image: "/images/product/blue-band.jpg"
    },
    {
      name: "Bracelet",
      image: "/images/product/bracelet.jpg"
    },
    {
      name: "Black Watch",
      image: "/images/product/black-watch.jpg"
    },
    {
      name: "Bamboo Watch",
      image: "/images/product/bamboo-watch.jpg"
    },
    {
      name: "Blue T-Shirt",
      image: "/images/product/blue-t-shirt.jpg"
    },
    {
      name: "Game Controller",
      image: "/images/product/game-controller.jpg"
    },
    {
      name: "Phone Case",
      image: "/images/product/gold-phone-case.jpg"
    }
  ];
  static \u0275fac = function BestSellersWidget_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BestSellersWidget)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BestSellersWidget, selectors: [["best-sellers-widget"]], decls: 11, vars: 2, consts: [["menu", ""], [1, "card", "h-full"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "font-semibold", "text-xl", "m-0"], ["pButton", "", "pRipple", "", "icon", "pi pi-ellipsis-h", "rounded", "", "text", "", 3, "click"], ["popup", "", 3, "model"], [1, "m-0", "p-0", "border-0", "outline-0", "list-none"], [1, "py-4", "px-0"], ["class", "h-16 border rounded-xl flex items-center p-4 mb-2 cursor-pointer hover:bg-emphasis transition-colors duration-150", 4, "ngFor", "ngForOf"], [1, "h-16", "border", "rounded-xl", "flex", "items-center", "p-4", "mb-2", "cursor-pointer", "hover:bg-emphasis", "transition-colors", "duration-150"], ["width", "32px", "height", "32px", 1, "rounded-full", "mr-4", 3, "src", "alt"], [1, "ml-auto"], ["href", "#"], [1, "pi", "pi-chevron-right", "text-muted-color"]], template: function BestSellersWidget_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "span", 3);
      \u0275\u0275text(3, "Best Sellers");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div")(5, "button", 4);
      \u0275\u0275listener("click", function BestSellersWidget_Template_button_click_5_listener($event) {
        \u0275\u0275restoreView(_r1);
        const menu_r2 = \u0275\u0275reference(7);
        return \u0275\u0275resetView(menu_r2.toggle($event));
      });
      \u0275\u0275elementEnd();
      \u0275\u0275element(6, "p-menu", 5, 0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "ul", 6)(9, "li", 7);
      \u0275\u0275template(10, BestSellersWidget_div_10_Template, 7, 3, "div", 8);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275property("model", ctx.items);
      \u0275\u0275advance(4);
      \u0275\u0275property("ngForOf", ctx.sellers);
    }
  }, dependencies: [CommonModule, NgForOf, ButtonModule, ButtonDirective, RippleModule, Ripple, MenuModule, Menu], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BestSellersWidget, { className: "BestSellersWidget", filePath: "src/app/pages/dashboard/sales/components/bestsellerswidget.ts", lineNumber: 33 });
})();

// src/app/pages/dashboard/sales/dashboardsales.ts
var DashboardSales = class _DashboardSales {
  static \u0275fac = function DashboardSales_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DashboardSales)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DashboardSales, selectors: [["app-dashboard-sales"]], decls: 16, vars: 0, consts: [[1, "grid", "grid-cols-12", "gap-8"], [1, "col-span-12", "lg:col-span-6"], [1, "col-span-12", "md:col-span-12", "lg:col-span-6"], [1, "col-span-12", "lg:col-span-3"]], template: function DashboardSales_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "stats-widget");
      \u0275\u0275elementStart(2, "div", 1);
      \u0275\u0275element(3, "contact-widget");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div", 1);
      \u0275\u0275element(5, "order-graph-widget");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "div", 1);
      \u0275\u0275element(7, "custom-timeline-widget");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "div", 2);
      \u0275\u0275element(9, "sales-table-widget");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "div", 1);
      \u0275\u0275element(11, "chat-widget");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "div", 3);
      \u0275\u0275element(13, "activity-widget");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "div", 3);
      \u0275\u0275element(15, "best-sellers-widget");
      \u0275\u0275elementEnd()();
    }
  }, dependencies: [StatsWidget, ContactWidget, OrderGraphWidget, CustomTimelineWidget, SalesTableWidget, ChatWidget, ActivityWidget, BestSellersWidget], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DashboardSales, { className: "DashboardSales", filePath: "src/app/pages/dashboard/sales/dashboardsales.ts", lineNumber: 40 });
})();
export {
  DashboardSales
};
//# sourceMappingURL=chunk-2DPEZO3Y.js.map
