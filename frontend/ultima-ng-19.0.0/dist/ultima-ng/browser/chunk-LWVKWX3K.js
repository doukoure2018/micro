import {
  DataView,
  DataViewModule
} from "./chunk-XTCJLQDC.js";
import {
  Avatar,
  AvatarModule
} from "./chunk-MCGUCMXD.js";
import "./chunk-7HJ4XJ7U.js";
import {
  Select,
  SelectModule
} from "./chunk-UQSIOFSP.js";
import "./chunk-JGOABXTK.js";
import "./chunk-XS7IVZ5T.js";
import "./chunk-CUABQE42.js";
import "./chunk-V6CKOH3G.js";
import "./chunk-DBPX6ILC.js";
import "./chunk-WIQZFAVH.js";
import "./chunk-CCBQFN2J.js";
import "./chunk-FZELBHWZ.js";
import "./chunk-4IUQ6KTI.js";
import "./chunk-IVSL2HKS.js";
import "./chunk-E352KRZV.js";
import "./chunk-HHD4PK4J.js";
import "./chunk-AP3OAIHW.js";
import "./chunk-NQNBRQ7H.js";
import {
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-3HTR5OU7.js";
import "./chunk-W3K3GK4Z.js";
import {
  CommonModule,
  NgForOf
} from "./chunk-SQQPVFHK.js";
import {
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
  ɵɵpureFunction0,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// src/app/apps/blog/list.ts
var _c0 = () => ({ bottom: "-1.5rem", right: "1.5rem" });
function List_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 25)(1, "span", 26);
    \u0275\u0275text(2, "Articles");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p-select", 27);
    \u0275\u0275twoWayListener("ngModelChange", function List_ng_template_2_Template_p_select_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.sortKey, $event) || (ctx_r1.sortKey = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("onChange", function List_ng_template_2_Template_p_select_onChange_3_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSortChange($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.sortKey);
    \u0275\u0275property("options", ctx_r1.sortOptions);
  }
}
function List_ng_template_4_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30)(1, "div", 31)(2, "div", 32)(3, "div", 33);
    \u0275\u0275element(4, "img", 34)(5, "img", 35);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 31)(7, "div", 36);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p", 37);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 38)(12, "span", 39);
    \u0275\u0275element(13, "i", 40);
    \u0275\u0275elementStart(14, "span", 41);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "span", 39);
    \u0275\u0275element(17, "i", 42);
    \u0275\u0275elementStart(18, "span", 41);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "span", 39);
    \u0275\u0275element(21, "i", 43);
    \u0275\u0275elementStart(22, "span", 44);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "span", 41);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd()()()()()()();
  }
  if (rf & 2) {
    const item_r3 = ctx.$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275property("src", item_r3.coverImage, \u0275\u0275sanitizeUrl)("alt", item_r3.description.split(" ", 1));
    \u0275\u0275advance();
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(12, _c0));
    \u0275\u0275property("src", item_r3.profile, \u0275\u0275sanitizeUrl)("alt", item_r3.description.split(" ", 1));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", item_r3.title, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", item_r3.description, " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(item_r3.comment);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(item_r3.share);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(item_r3.day);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r3.month);
  }
}
function List_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 28);
    \u0275\u0275template(1, List_ng_template_4_div_1_Template, 26, 13, "div", 29);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const items_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", items_r4);
  }
}
var List = class _List {
  sortOptions = [
    { label: "Most Shared", value: "share" },
    { label: "Most Commented", value: "comment" }
  ];
  sortOrder = -1;
  sortKey = null;
  sortField = "";
  totalBlogs = [
    {
      coverImage: "/images/blog/blog-1.png",
      profile: "/images/avatar/circle/avatar-f-1.png",
      title: "Blog",
      description: "Ornare egestas pellentesque facilisis in a ultrices erat diam metus integer sed",
      comment: 2,
      share: 7,
      day: "15",
      month: "October"
    },
    {
      coverImage: "/images/blog/blog-2.png",
      profile: "/images/avatar/circle/avatar-f-2.png",
      title: "Magazine",
      description: "Magna iaculis sagittis, amet faucibus scelerisque non ornare non in penatibus ",
      comment: 5,
      share: 1,
      day: "20",
      month: "Nov"
    },
    {
      coverImage: "/images/blog/blog-3.png",
      profile: "/images/avatar/circle/avatar-m-1.png",
      title: "Science",
      description: "Purus mattis mi, libero maecenas volutpat quis a morbi arcu pharetra, mollis",
      comment: 2,
      share: 6,
      day: "23",
      month: "Oct"
    },
    {
      coverImage: "/images/blog/blog-4.png",
      profile: "/images/avatar/circle/avatar-m-1.png",
      title: "Blog",
      description: "Curabitur vitae sit justo facilisi nec, sodales proin aliquet libero volutpat nunc",
      comment: 5,
      share: 5,
      day: "14",
      month: "Dec"
    },
    {
      coverImage: "/images/blog/blog-5.png",
      profile: "/images/avatar/circle/avatar-f-3.png",
      title: "Magazine",
      description: "Id eget arcu suspendisse ullamcorper dolor lobortis dui et morbi penatibus quam",
      comment: 4,
      share: 1,
      day: "05",
      month: "Apr"
    },
    {
      coverImage: "/images/blog/blog-6.png",
      profile: "/images/avatar/circle/avatar-m-3.png",
      title: "Science",
      description: "Sagittis hendrerit laoreet dignissim sed auctor sit pellentesque vel diam iaculis et",
      comment: 1,
      share: 3,
      day: "12",
      month: "Nov"
    }
  ];
  onSortChange(event) {
    const sortValue = event.value;
    if (sortValue.indexOf("!") === 0) {
      this.sortOrder = 1;
      this.sortField = sortValue.substring(1, sortValue.length);
      this.sortKey = sortValue;
    } else {
      this.sortOrder = -1;
      this.sortField = sortValue;
      this.sortKey = sortValue;
    }
  }
  static \u0275fac = function List_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _List)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _List, selectors: [["app-list"]], decls: 64, vars: 4, consts: [["header", ""], ["grid", ""], [1, "card"], ["paginator", "", "layout", "grid", 3, "value", "rows", "sortOrder", "sortField"], [1, "bg-surface-0", "dark:bg-surface-950", "px-6", "py-20", "md:px-12", "lg:px-20"], [1, "font-bold", "text-5xl", "text-surface-900", "dark:text-surface-0", "mb-4"], [1, "text-surface-700", "dark:text-surface-100", "text-xl", "leading-normal", "mb-8"], [1, "grid", "grid-cols-12", "gap-4", "nogutter"], [1, "col-span-12", "lg:col-span-4", "p-6"], [1, "border-t-4", "border-blue-600"], [1, "text-blue-600", "font-medium", "my-2"], [1, "text-surface-900", "dark:text-surface-0", "font-medium", "text-xl", "leading-normal", "mb-6"], [1, "font-sm", "text-surface-700", "dark:text-surface-100", "leading-normal"], [1, "flex", "mt-6"], ["image", "/images/avatar/circle/avatar-f-1.png", "shape", "circle"], [1, "ml-2"], [1, "text-xs", "font-bold", "text-surface-900", "dark:text-surface-0", "mb-1"], [1, "text-xs", "flex", "items-center", "text-surface-700", "dark:text-surface-100"], [1, "pi", "pi-calendar", "mr-1", "text-xs"], [1, "border-t-4", "border-pink-600"], [1, "text-pink-600", "font-medium", "my-2"], ["image", "/images/avatar/circle/avatar-f-2.png", "shape", "circle"], [1, "border-t-4", "border-orange-600"], [1, "text-orange-600", "font-medium", "my-2"], ["image", "/images/avatar/circle/avatar-f-3.png", "shape", "circle"], [1, "flex", "flex-col", "sm:flex-row", "sm:items-center", "sm:justify-between", "gap-4"], [1, "text-xl", "text-surface-900", "dark:text-surface-0", "font-semibold"], ["optionLabel", "label", "optionValue", "value", "placeholder", "Sort By", 1, "w-full", "md:w-60", 3, "ngModelChange", "onChange", "ngModel", "options"], [1, "grid", "grid-cols-12", "gap-4", "grid-nogutter"], ["class", "col-span-12 md:col-span-4", 4, "ngFor", "ngForOf"], [1, "col-span-12", "md:col-span-4"], [1, "p-4"], [1, "bg-surface-100", "dark:bg-surface-700", "cursor-pointer", "z-index", "rounded"], [1, "relative"], [1, "w-full", 3, "src", "alt"], [1, "flex", "absolute", "w-16", "h-16", 3, "src", "alt"], [1, "text-surface-900", "dark:text-surface-0", "font-semibold", "text-xl", "mb-4"], [1, "text-surface-700", "dark:text-surface-100", "text-lg", "mt-0", "mb-8"], [1, "flex", "flex-wrap", "gap-2", "items-center", "justify-between"], [1, "flex", "items-center", "text-surface-900", "dark:text-surface-0"], [1, "pi", "pi-comment", "mr-2"], [1, "font-semibold"], [1, "pi", "pi-share-alt", "mr-2"], [1, "pi", "pi-clock", "mr-2"], [1, "font-semibold", "mr-1"]], template: function List_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 2)(1, "p-dataview", 3);
      \u0275\u0275template(2, List_ng_template_2_Template, 4, 2, "ng-template", null, 0, \u0275\u0275templateRefExtractor)(4, List_ng_template_4_Template, 2, 1, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 2)(7, "div", 4)(8, "div", 5);
      \u0275\u0275text(9, "Recent Articles");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "div", 6);
      \u0275\u0275text(11, "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "div", 7)(13, "div", 8);
      \u0275\u0275element(14, "div", 9);
      \u0275\u0275elementStart(15, "div", 10);
      \u0275\u0275text(16, "Animals");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "div", 11);
      \u0275\u0275text(18, "Why Earth\u2018s most beloved creatures are headed toward extinction");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "div", 12);
      \u0275\u0275text(20, "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "div", 13);
      \u0275\u0275element(22, "p-avatar", 14);
      \u0275\u0275elementStart(23, "div", 15)(24, "div", 16);
      \u0275\u0275text(25, "Anna Miles");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "div", 17);
      \u0275\u0275element(27, "i", 18);
      \u0275\u0275elementStart(28, "span");
      \u0275\u0275text(29, "Apr 9, 2021");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(30, "div", 8);
      \u0275\u0275element(31, "div", 19);
      \u0275\u0275elementStart(32, "div", 20);
      \u0275\u0275text(33, "Oxygen");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "div", 11);
      \u0275\u0275text(35, "Only one-third of tropical rainforests remain intact, study says");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "div", 12);
      \u0275\u0275text(37, "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(38, "div", 13);
      \u0275\u0275element(39, "p-avatar", 21);
      \u0275\u0275elementStart(40, "div", 15)(41, "div", 16);
      \u0275\u0275text(42, "Arlene Miles");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(43, "div", 17);
      \u0275\u0275element(44, "i", 18);
      \u0275\u0275elementStart(45, "span");
      \u0275\u0275text(46, "Apr 9, 2021");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(47, "div", 8);
      \u0275\u0275element(48, "div", 22);
      \u0275\u0275elementStart(49, "div", 23);
      \u0275\u0275text(50, "Nature");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(51, "div", 11);
      \u0275\u0275text(52, "Does planting a tree really offset your carbon footprint?");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(53, "div", 12);
      \u0275\u0275text(54, "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(55, "div", 13);
      \u0275\u0275element(56, "p-avatar", 24);
      \u0275\u0275elementStart(57, "div", 15)(58, "div", 16);
      \u0275\u0275text(59, "Diane Miles");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(60, "div", 17);
      \u0275\u0275element(61, "i", 18);
      \u0275\u0275elementStart(62, "span");
      \u0275\u0275text(63, "Apr 9, 2021");
      \u0275\u0275elementEnd()()()()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275property("value", ctx.totalBlogs)("rows", 3)("sortOrder", ctx.sortOrder)("sortField", ctx.sortField);
    }
  }, dependencies: [CommonModule, NgForOf, FormsModule, NgControlStatus, NgModel, DataViewModule, DataView, SelectModule, Select, AvatarModule, Avatar], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(List, { className: "List", filePath: "src/app/apps/blog/list.ts", lineNumber: 125 });
})();
export {
  List
};
//# sourceMappingURL=chunk-LWVKWX3K.js.map
