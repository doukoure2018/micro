import {
  SplitButton,
  SplitButtonModule
} from "./chunk-L4DY2TIW.js";
import "./chunk-GEHWKAXI.js";
import "./chunk-XS7IVZ5T.js";
import "./chunk-CCBQFN2J.js";
import "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
import "./chunk-4IUQ6KTI.js";
import "./chunk-E352KRZV.js";
import {
  Button,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import "./chunk-AP3OAIHW.js";
import {
  BaseComponent,
  BaseStyle
} from "./chunk-NQNBRQ7H.js";
import "./chunk-BMYIFZHZ.js";
import "./chunk-W3K3GK4Z.js";
import {
  CommonModule
} from "./chunk-SQQPVFHK.js";
import {
  ChangeDetectionStrategy,
  Component,
  Injectable,
  NgModule,
  ViewEncapsulation,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵInheritDefinitionFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetInheritedFactory,
  ɵɵlistener,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵtext
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// node_modules/primeng/fesm2022/primeng-buttongroup.mjs
var _c0 = ["*"];
var theme = ({
  dt
}) => `
.p-buttongroup .p-button {
    margin: 0;
}

.p-buttongroup .p-button:not(:last-child),
.p-buttongroup .p-button:not(:last-child):hover {
    border-right: 0 none;
}

.p-buttongroup .p-button:not(:first-of-type):not(:last-of-type) {
    border-radius: 0;
}

.p-buttongroup .p-button:first-of-type:not(:only-of-type) {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
}

.p-buttongroup .p-button:last-of-type:not(:only-of-type) {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
}

.p-buttongroup .p-button:focus {
    position: relative;
    z-index: 1;
}

.p-buttongroup {
    display:flex;
}

.p-buttongroup > .p-button {
    flex: 1;
}

/* For PrimeNG */

.p-buttongroup .p-button:focus,
.p-buttongroup p-button:focus .p-button,
.p-buttonset .p-button:focus,
.p-buttonset .p-button:focus,
.p-buttonset p-button:focus .p-button,
.p-buttonset .p-button:focus {
    position: relative;
    z-index: 1;
}

.p-buttongroup .p-button:not(:last-child),
.p-buttongroup .p-button:not(:last-child):hover,
.p-buttongroup p-button:not(:last-child) .p-button,
.p-buttongroup p-button:not(:last-child) .p-button:hover,
.p-buttonset .p-button:not(:last-child),
.p-buttonset .p-button:not(:last-child):hover,
.p-buttonset p-button:not(:last-child) .p-button,
.p-buttonset p-button:not(:last-child) .p-button:hover {
    border-right: 0 none;
}

.p-buttongroup .p-button:not(:first-of-type):not(:last-of-type),
.p-buttongroup p-button:not(:first-of-type):not(:last-of-type) .p-button,
.p-buttonset .p-button:not(:first-of-type):not(:last-of-type),
.p-buttonset p-button:not(:first-of-type):not(:last-of-type) .p-button {
    border-radius: 0;
}

.p-buttongroup .p-button:first-of-type:not(:only-of-type),
.p-buttongroup p-button:first-of-type:not(:only-of-type) .p-button,
.p-buttonset .p-button:first-of-type:not(:only-of-type),
.p-buttonset p-button:first-of-type:not(:only-of-type) .p-button {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
}

.p-buttongroup .p-button:last-of-type:not(:only-of-type),
.p-buttongroup p-button:last-of-type:not(:only-of-type) .p-button,
.p-buttonset .p-button:last-of-type:not(:only-of-type),
.p-buttonset p-button:last-of-type:not(:only-of-type) .p-button {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
}

p-button[iconpos='right'] spinnericon {
    order: 1;
}
`;
var classes = {
  root: "p-buttongroup p-component"
};
var ButtonGroupStyle = class _ButtonGroupStyle extends BaseStyle {
  name = "buttongroup";
  theme = theme;
  classes = classes;
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275ButtonGroupStyle_BaseFactory;
    return function ButtonGroupStyle_Factory(__ngFactoryType__) {
      return (\u0275ButtonGroupStyle_BaseFactory || (\u0275ButtonGroupStyle_BaseFactory = \u0275\u0275getInheritedFactory(_ButtonGroupStyle)))(__ngFactoryType__ || _ButtonGroupStyle);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _ButtonGroupStyle,
    factory: _ButtonGroupStyle.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ButtonGroupStyle, [{
    type: Injectable
  }], null, null);
})();
var ButtonGroupClasses;
(function(ButtonGroupClasses2) {
  ButtonGroupClasses2["root"] = "p-buttongroup";
})(ButtonGroupClasses || (ButtonGroupClasses = {}));
var ButtonGroup = class _ButtonGroup extends BaseComponent {
  _componentStyle = inject(ButtonGroupStyle);
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275ButtonGroup_BaseFactory;
    return function ButtonGroup_Factory(__ngFactoryType__) {
      return (\u0275ButtonGroup_BaseFactory || (\u0275ButtonGroup_BaseFactory = \u0275\u0275getInheritedFactory(_ButtonGroup)))(__ngFactoryType__ || _ButtonGroup);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _ButtonGroup,
    selectors: [["p-buttonGroup"], ["p-buttongroup"], ["p-button-group"]],
    features: [\u0275\u0275ProvidersFeature([ButtonGroupStyle]), \u0275\u0275InheritDefinitionFeature],
    ngContentSelectors: _c0,
    decls: 2,
    vars: 0,
    consts: [["role", "group", 1, "p-buttongroup", "p-component"]],
    template: function ButtonGroup_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef();
        \u0275\u0275elementStart(0, "span", 0);
        \u0275\u0275projection(1);
        \u0275\u0275elementEnd();
      }
    },
    dependencies: [CommonModule],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ButtonGroup, [{
    type: Component,
    args: [{
      selector: "p-buttonGroup, p-buttongroup, p-button-group",
      standalone: true,
      imports: [CommonModule],
      template: `
        <span class="p-buttongroup p-component" role="group">
            <ng-content></ng-content>
        </span>
    `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [ButtonGroupStyle]
    }]
  }], null, null);
})();
var ButtonGroupModule = class _ButtonGroupModule {
  static \u0275fac = function ButtonGroupModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ButtonGroupModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _ButtonGroupModule
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [ButtonGroup]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ButtonGroupModule, [{
    type: NgModule,
    args: [{
      imports: [ButtonGroup],
      exports: [ButtonGroup]
    }]
  }], null, null);
})();

// src/app/pages/uikit/buttondemo.ts
var ButtonDemo = class _ButtonDemo {
  items = [];
  loading = [false, false, false, false];
  ngOnInit() {
    this.items = [
      { label: "Update", icon: "pi pi-refresh" },
      { label: "Delete", icon: "pi pi-times" },
      {
        label: "Angular.io",
        icon: "pi pi-info",
        url: "http://angular.io"
      },
      { separator: true },
      { label: "Setup", icon: "pi pi-cog" }
    ];
  }
  load(index) {
    this.loading[index] = true;
    setTimeout(() => this.loading[index] = false, 1e3);
  }
  static \u0275fac = function ButtonDemo_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ButtonDemo)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ButtonDemo, selectors: [["app-button-demo"]], decls: 148, vars: 13, consts: [[1, "flex", "flex-col", "md:flex-row", "gap-8"], [1, "md:w-1/2"], [1, "card", "flex", "flex-col", "gap-4"], [1, "font-semibold", "text-xl"], [1, "flex", "flex-wrap", "gap-2"], ["label", "Submit"], ["label", "Disabled", 3, "disabled"], ["label", "Link", 1, "p-button-link"], ["label", "Primary"], ["label", "Secondary", "severity", "secondary"], ["label", "Success", "severity", "success"], ["label", "Info", "severity", "info"], ["label", "Warn", "severity", "warn"], ["label", "Help", "severity", "help"], ["label", "Danger", "severity", "danger"], ["label", "Contrast", "severity", "contrast"], ["label", "Primary", "text", ""], ["label", "Secondary", "severity", "secondary", "text", ""], ["label", "Success", "severity", "success", "text", ""], ["label", "Info", "severity", "info", "text", ""], ["label", "Warn", "severity", "warn", "text", ""], ["label", "Help", "severity", "help", "text", ""], ["label", "Danger", "severity", "danger", "text", ""], ["label", "Plain", "text", ""], ["label", "Primary", "outlined", ""], ["label", "Secondary", "severity", "secondary", "outlined", ""], ["label", "Success", "severity", "success", "outlined", ""], ["label", "Info", "severity", "info", "outlined", ""], ["label", "Warn", "severity", "warn", "outlined", ""], ["label", "Help", "severity", "help", "outlined", ""], ["label", "Danger", "severity", "danger", "outlined", ""], ["label", "Contrast", "severity", "contrast", "outlined", ""], ["label", "Save", "icon", "pi pi-check"], ["label", "Delete", "icon", "pi pi-trash"], ["label", "Cancel", "icon", "pi pi-times"], ["label", "Save", 3, "model"], ["label", "Save", "severity", "secondary", 3, "model"], ["label", "Save", "severity", "success", 3, "model"], ["label", "Save", "severity", "info", 3, "model"], ["label", "Save", "severity", "warn", 3, "model"], ["label", "Save", "severity", "help", 3, "model"], ["label", "Save", "severity", "danger", 3, "model"], ["label", "Save", "severity", "contrast", 3, "model"], ["type", "button"], ["alt", "logo", "src", "https://primefaces.org/cdn/primeng/images/logo.svg", 2, "width", "1.5rem"], ["type", "button", "outlined", "", "severity", "success"], [1, "text-bold"], ["icon", "pi pi-star-fill"], ["label", "Bookmark", "icon", "pi pi-bookmark"], ["label", "Bookmark", "icon", "pi pi-bookmark", "iconPos", "right"], ["label", "Primary", "raised", ""], ["label", "Secondary", "severity", "secondary", "raised", ""], ["label", "Success", "severity", "success", "raised", ""], ["label", "Info", "severity", "info", "raised", ""], ["label", "Warn", "severity", "warn", "raised", ""], ["label", "Help", "severity", "help", "raised", ""], ["label", "Danger", "severity", "danger", "raised", ""], ["label", "Contrast", "severity", "contrast", "raised", ""], ["label", "Primary", "rounded", ""], ["label", "Secondary", "severity", "secondary", "rounded", ""], ["label", "Success", "severity", "success", "rounded", ""], ["label", "Info", "severity", "info", "rounded", ""], ["label", "Warn", "severity", "warn", "rounded", ""], ["label", "Help", "severity", "help", "rounded", ""], ["label", "Danger", "severity", "danger", "rounded", ""], ["label", "Contrast", "severity", "contrast", "rounded", ""], ["icon", "pi pi-check", "rounded", ""], ["icon", "pi pi-bookmark", "severity", "secondary", "rounded", ""], ["icon", "pi pi-search", "severity", "success", "rounded", ""], ["icon", "pi pi-user", "severity", "info", "rounded", ""], ["icon", "pi pi-bell", "severity", "warn", "rounded", ""], ["icon", "pi pi-heart", "severity", "help", "rounded", ""], ["icon", "pi pi-times", "severity", "danger", "rounded", ""], ["icon", "pi pi-check", "text", "", "raised", "", "rounded", ""], ["icon", "pi pi-bookmark", "severity", "secondary", "text", "", "raised", "", "rounded", ""], ["icon", "pi pi-search", "severity", "success", "text", "", "raised", "", "rounded", ""], ["icon", "pi pi-user", "severity", "info", "text", "", "raised", "", "rounded", ""], ["icon", "pi pi-bell", "severity", "warn", "text", "", "raised", "", "rounded", ""], ["icon", "pi pi-heart", "severity", "help", "text", "", "raised", "", "rounded", ""], ["icon", "pi pi-times", "severity", "danger", "text", "", "raised", "", "rounded", ""], ["icon", "pi pi-check", "rounded", "", "outlined", ""], ["icon", "pi pi-bookmark", "severity", "secondary", "rounded", "", "outlined", ""], ["icon", "pi pi-search", "severity", "success", "rounded", "", "outlined", ""], ["icon", "pi pi-user", "severity", "info", "rounded", "", "outlined", ""], ["icon", "pi pi-bell", "severity", "warn", "rounded", "", "outlined", ""], ["icon", "pi pi-heart", "severity", "help", "rounded", "", "outlined", ""], ["icon", "pi pi-times", "severity", "danger", "rounded", "", "outlined", ""], ["type", "button", "label", "Search", "icon", "pi pi-search", 3, "click", "loading"], ["type", "button", "label", "Search", "icon", "pi pi-search", "iconPos", "right", 3, "click", "loading"], ["type", "button", "styleClass", "h-full", "icon", "pi pi-search", 3, "click", "loading"], ["type", "button", "label", "Search", 3, "click", "loading"]], template: function ButtonDemo_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
      \u0275\u0275text(4, "Default");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div", 4);
      \u0275\u0275element(6, "p-button", 5)(7, "p-button", 6)(8, "p-button", 7);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(9, "div", 2)(10, "div", 3);
      \u0275\u0275text(11, "Severities");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "div", 4);
      \u0275\u0275element(13, "p-button", 8)(14, "p-button", 9)(15, "p-button", 10)(16, "p-button", 11)(17, "p-button", 12)(18, "p-button", 13)(19, "p-button", 14)(20, "p-button", 15);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(21, "div", 2)(22, "div", 3);
      \u0275\u0275text(23, "Text");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "div", 4);
      \u0275\u0275element(25, "p-button", 16)(26, "p-button", 17)(27, "p-button", 18)(28, "p-button", 19)(29, "p-button", 20)(30, "p-button", 21)(31, "p-button", 22)(32, "p-button", 23);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(33, "div", 2)(34, "div", 3);
      \u0275\u0275text(35, "Outlined");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "div", 4);
      \u0275\u0275element(37, "p-button", 24)(38, "p-button", 25)(39, "p-button", 26)(40, "p-button", 27)(41, "p-button", 28)(42, "p-button", 29)(43, "p-button", 30)(44, "p-button", 31);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(45, "div", 2)(46, "div", 3);
      \u0275\u0275text(47, "Group");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(48, "div", 4)(49, "p-buttongroup");
      \u0275\u0275element(50, "p-button", 32)(51, "p-button", 33)(52, "p-button", 34);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(53, "div", 2)(54, "div", 3);
      \u0275\u0275text(55, "SplitButton");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(56, "div", 4);
      \u0275\u0275element(57, "p-splitbutton", 35)(58, "p-splitbutton", 36)(59, "p-splitbutton", 37)(60, "p-splitbutton", 38)(61, "p-splitbutton", 39)(62, "p-splitbutton", 40)(63, "p-splitbutton", 41)(64, "p-splitbutton", 42);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(65, "div", 2)(66, "div", 3);
      \u0275\u0275text(67, "Templating");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(68, "div", 4)(69, "p-button", 43);
      \u0275\u0275element(70, "img", 44);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(71, "p-button", 45);
      \u0275\u0275element(72, "img", 44);
      \u0275\u0275elementStart(73, "span", 46);
      \u0275\u0275text(74, "PrimeNG");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(75, "div", 1)(76, "div", 2)(77, "div", 3);
      \u0275\u0275text(78, "Icons");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(79, "div", 4);
      \u0275\u0275element(80, "p-button", 47)(81, "p-button", 48)(82, "p-button", 49);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(83, "div", 2)(84, "div", 3);
      \u0275\u0275text(85, "Raised");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(86, "div", 4);
      \u0275\u0275element(87, "p-button", 50)(88, "p-button", 51)(89, "p-button", 52)(90, "p-button", 53)(91, "p-button", 54)(92, "p-button", 55)(93, "p-button", 56)(94, "p-button", 57);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(95, "div", 2)(96, "div", 3);
      \u0275\u0275text(97, "Rounded");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(98, "div", 4);
      \u0275\u0275element(99, "p-button", 58)(100, "p-button", 59)(101, "p-button", 60)(102, "p-button", 61)(103, "p-button", 62)(104, "p-button", 63)(105, "p-button", 64)(106, "p-button", 65);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(107, "div", 2)(108, "div", 3);
      \u0275\u0275text(109, "Rounded Icons");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(110, "div", 4);
      \u0275\u0275element(111, "p-button", 66)(112, "p-button", 67)(113, "p-button", 68)(114, "p-button", 69)(115, "p-button", 70)(116, "p-button", 71)(117, "p-button", 72);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(118, "div", 2)(119, "div", 3);
      \u0275\u0275text(120, "Rounded Text");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(121, "div", 4);
      \u0275\u0275element(122, "p-button", 73)(123, "p-button", 74)(124, "p-button", 75)(125, "p-button", 76)(126, "p-button", 77)(127, "p-button", 78)(128, "p-button", 79);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(129, "div", 2)(130, "div", 3);
      \u0275\u0275text(131, "Rounded Outlined");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(132, "div", 4);
      \u0275\u0275element(133, "p-button", 80)(134, "p-button", 81)(135, "p-button", 82)(136, "p-button", 83)(137, "p-button", 84)(138, "p-button", 85)(139, "p-button", 86);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(140, "div", 2)(141, "div", 3);
      \u0275\u0275text(142, "Loading");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(143, "div", 4)(144, "p-button", 87);
      \u0275\u0275listener("click", function ButtonDemo_Template_p_button_click_144_listener() {
        return ctx.load(0);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(145, "p-button", 88);
      \u0275\u0275listener("click", function ButtonDemo_Template_p_button_click_145_listener() {
        return ctx.load(1);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(146, "p-button", 89);
      \u0275\u0275listener("click", function ButtonDemo_Template_p_button_click_146_listener() {
        return ctx.load(2);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(147, "p-button", 90);
      \u0275\u0275listener("click", function ButtonDemo_Template_p_button_click_147_listener() {
        return ctx.load(3);
      });
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(7);
      \u0275\u0275property("disabled", true);
      \u0275\u0275advance(50);
      \u0275\u0275property("model", ctx.items);
      \u0275\u0275advance();
      \u0275\u0275property("model", ctx.items);
      \u0275\u0275advance();
      \u0275\u0275property("model", ctx.items);
      \u0275\u0275advance();
      \u0275\u0275property("model", ctx.items);
      \u0275\u0275advance();
      \u0275\u0275property("model", ctx.items);
      \u0275\u0275advance();
      \u0275\u0275property("model", ctx.items);
      \u0275\u0275advance();
      \u0275\u0275property("model", ctx.items);
      \u0275\u0275advance();
      \u0275\u0275property("model", ctx.items);
      \u0275\u0275advance(80);
      \u0275\u0275property("loading", ctx.loading[0]);
      \u0275\u0275advance();
      \u0275\u0275property("loading", ctx.loading[1]);
      \u0275\u0275advance();
      \u0275\u0275property("loading", ctx.loading[2]);
      \u0275\u0275advance();
      \u0275\u0275property("loading", ctx.loading[3]);
    }
  }, dependencies: [ButtonModule, Button, ButtonGroupModule, ButtonGroup, SplitButtonModule, SplitButton], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ButtonDemo, { className: "ButtonDemo", filePath: "src/app/pages/uikit/buttondemo.ts", lineNumber: 179 });
})();
export {
  ButtonDemo
};
//# sourceMappingURL=chunk-PUZS47VJ.js.map
