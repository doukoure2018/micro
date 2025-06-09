import {
  BaseComponent
} from "./chunk-QNNEJSLY.js";
import "./chunk-SPCWIT7H.js";
import {
  BaseStyle
} from "./chunk-IYHY3PKC.js";
import {
  PrimeTemplate,
  SharedModule
} from "./chunk-QDJ4ZYJP.js";
import "./chunk-GFVF2TMO.js";
import "./chunk-VEIYLGKH.js";
import "./chunk-74JPDVWP.js";
import {
  CommonModule,
  NgTemplateOutlet,
  isPlatformBrowser
} from "./chunk-Q2IWXDGC.js";
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  Injectable,
  Input,
  NgModule,
  ViewEncapsulation,
  inject,
  setClassMetadata,
  ɵɵInheritDefinitionFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetInheritedFactory,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵtemplate
} from "./chunk-YQZEX5Y4.js";
import "./chunk-PEBH6BBU.js";
import "./chunk-WPM5VTLQ.js";
import "./chunk-4S3KYZTJ.js";
import "./chunk-4MWRP73S.js";

// node_modules/primeng/fesm2022/primeng-imagecompare.mjs
var _c0 = ["left"];
var _c1 = ["right"];
function ImageCompare_0_ng_template_0_Template(rf, ctx) {
}
function ImageCompare_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, ImageCompare_0_ng_template_0_Template, 0, 0, "ng-template");
  }
}
function ImageCompare_1_ng_template_0_Template(rf, ctx) {
}
function ImageCompare_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, ImageCompare_1_ng_template_0_Template, 0, 0, "ng-template");
  }
}
var theme = ({
  dt
}) => `
.p-imagecompare {
    position: relative;
    overflow: hidden;
    width: 100%;
    aspect-ratio: 16 / 9;
}

.p-imagecompare img {
    width: 100%;
    height: 100%;
    position: absolute;
}

.p-imagecompare img + img {
    clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);
}

.p-imagecompare:dir(rtl) img + img {
    clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);
}

.p-imagecompare-slider {
    position: relative;
    -webkit-appearance: none;
    width: calc(100% + ${dt("imagecompare.handle.size")});
    height: 100%;
    margin-inline-start: calc(-1 * calc(${dt("imagecompare.handle.size")} / 2));
    background-color: transparent;
    outline: none;
    transition: all ${dt("imagecompare.handle.transition.duration")};
}

.p-imagecompare-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: ${dt("imagecompare.handle.size")};
    width: ${dt("imagecompare.handle.size")};
    background: ${dt("imagecompare.handle.background")};
    border: ${dt("imagecompare.handle.border.width")} solid ${dt("imagecompare.handle.border.color")};
    border-radius: ${dt("imagecompare.handle.border.radius")};
    background-size: contain;
    cursor: ew-resize;
    transition: all ${dt("imagecompare.handle.transition.duration")};
}

.p-imagecompare-slider::-moz-range-thumb {
    height: ${dt("imagecompare.handle.size")};
    width: ${dt("imagecompare.handle.size")};
    background: ${dt("imagecompare.handle.background")};
    border: ${dt("imagecompare.handle.border.width")} ${dt("imagecompare.handle.border.style")} ${dt("imagecompare.handle.border.color")};
    border-radius: ${dt("imagecompare.handle.border.radius")};
    background-size: contain;
    cursor: ew-resize;
}

.p-imagecompare-slider:focus-visible::-webkit-slider-thumb {
    box-shadow: ${dt("imagecompare.handle.focus.ring.shadow")};
    outline: ${dt("imagecompare.handle.focus.ring.width")} ${dt("imagecompare.handle.focus.ring.style")} ${dt("imagecompare.handle.focus.ring.color")};
    outline-offset: ${dt("imagecompare.handle.focus.ring.offset")};
}

.p-imagecompare-slider:focus-visible::-moz-range-thumb {
    box-shadow: ${dt("imagecompare.handle.focus.ring.shadow")};
    outline: ${dt("imagecompare.handle.focus.ring.width")} ${dt("imagecompare.handle.focus.ring.style")} ${dt("imagecompare.handle.focus.ring.color")};
    outline-offset: ${dt("imagecompare.handle.focus.ring.offset")};
}

.p-imagecompare-slider:hover {
    width: calc(100% + ${dt("imagecompare.handle.hover.size")});
    margin-inline-start: calc(-1 * calc(${dt("imagecompare.handle.hover.size")} / 2));
}

.p-imagecompare-slider:hover::-webkit-slider-thumb {
    background: ${dt("imagecompare.handle.hover.background")};
    border-color: ${dt("imagecompare.handle.hover.border.color")};
    height: ${dt("imagecompare.handle.hover.size")};
    width: ${dt("imagecompare.handle.hover.size")};
}

.p-imagecompare-slider:hover::-moz-range-thumb {
    background: ${dt("imagecompare.handle.hover.background")};
    border-color: ${dt("imagecompare.handle.hover.border.color")};
    height: ${dt("imagecompare.handle.hover.size")};
    width: ${dt("imagecompare.handle.hover.size")};
}
`;
var classes = {
  root: "p-imagecompare",
  slider: "p-imagecompare-slider"
};
var ImageCompareStyle = class _ImageCompareStyle extends BaseStyle {
  name = "imagecompare";
  theme = theme;
  classes = classes;
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵImageCompareStyle_BaseFactory;
    return function ImageCompareStyle_Factory(__ngFactoryType__) {
      return (ɵImageCompareStyle_BaseFactory || (ɵImageCompareStyle_BaseFactory = ɵɵgetInheritedFactory(_ImageCompareStyle)))(__ngFactoryType__ || _ImageCompareStyle);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _ImageCompareStyle,
    factory: _ImageCompareStyle.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ImageCompareStyle, [{
    type: Injectable
  }], null, null);
})();
var ImageCompareClasses;
(function(ImageCompareClasses2) {
  ImageCompareClasses2["root"] = "p-imagecompare";
  ImageCompareClasses2["slider"] = "p-imagecompare-slider";
})(ImageCompareClasses || (ImageCompareClasses = {}));
var ImageCompare = class _ImageCompare extends BaseComponent {
  isRTL = false;
  /**
   * Index of the element in tabbing order.
   * @defaultValue 0
   * @group Props
   */
  tabindex;
  /**
   * Defines a string value that labels an interactive element.
   * @group Props
   */
  ariaLabelledby;
  /**
   * Identifier of the underlying input element.
   * @group Props
   */
  ariaLabel;
  /**
   * Template for the left side.
   * @group Templates
   */
  leftTemplate;
  /**
   * Template for the right side.
   * @group Templates
   */
  rightTemplate;
  _leftTemplate;
  _rightTemplate;
  templates;
  _componentStyle = inject(ImageCompareStyle);
  mutationObserver;
  ngOnInit() {
    super.ngOnInit();
    this.updateDirection();
    this.observeDirectionChanges();
  }
  ngAfterContentInit() {
    this.templates?.forEach((item) => {
      switch (item.getType()) {
        case "left":
          this._leftTemplate = item.template;
          break;
        case "right":
          this._rightTemplate = item.template;
          break;
      }
    });
  }
  onSlide(event) {
    const value = event.target.value;
    const image = event.target.previousElementSibling;
    if (this.isRTL) {
      image.style.clipPath = `polygon(${100 - value}% 0, 100% 0, 100% 100%, ${100 - value}% 100%)`;
    } else {
      image.style.clipPath = `polygon(0 0, ${value}% 0, ${value}% 100%, 0 100%)`;
    }
  }
  updateDirection() {
    this.isRTL = !!this.el.nativeElement.closest('[dir="rtl"]');
  }
  observeDirectionChanges() {
    if (isPlatformBrowser(this.platformId)) {
      const targetNode = document?.documentElement;
      const config = {
        attributes: true,
        attributeFilter: ["dir"]
      };
      this.mutationObserver = new MutationObserver(() => {
        this.updateDirection();
      });
      this.mutationObserver.observe(targetNode, config);
    }
  }
  ngOnDestroy() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
    super.ngOnDestroy();
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵImageCompare_BaseFactory;
    return function ImageCompare_Factory(__ngFactoryType__) {
      return (ɵImageCompare_BaseFactory || (ɵImageCompare_BaseFactory = ɵɵgetInheritedFactory(_ImageCompare)))(__ngFactoryType__ || _ImageCompare);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _ImageCompare,
    selectors: [["p-imageCompare"], ["p-imagecompare"], ["p-image-compare"]],
    contentQueries: function ImageCompare_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuery(dirIndex, _c0, 4);
        ɵɵcontentQuery(dirIndex, _c1, 4);
        ɵɵcontentQuery(dirIndex, PrimeTemplate, 4);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.leftTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.rightTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.templates = _t);
      }
    },
    hostAttrs: [1, "p-imagecompare"],
    hostVars: 3,
    hostBindings: function ImageCompare_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("tabindex", ctx.tabindex)("aria-labelledby", ctx.ariaLabelledby)("aria-label", ctx.ariaLabel);
      }
    },
    inputs: {
      tabindex: "tabindex",
      ariaLabelledby: "ariaLabelledby",
      ariaLabel: "ariaLabel"
    },
    features: [ɵɵProvidersFeature([ImageCompareStyle]), ɵɵInheritDefinitionFeature],
    decls: 3,
    vars: 4,
    consts: [[4, "ngTemplateOutlet"], ["type", "range", "min", "0", "max", "100", "value", "50", 3, "input"]],
    template: function ImageCompare_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵtemplate(0, ImageCompare_0_Template, 1, 0, null, 0)(1, ImageCompare_1_Template, 1, 0, null, 0);
        ɵɵelementStart(2, "input", 1);
        ɵɵlistener("input", function ImageCompare_Template_input_input_2_listener($event) {
          return ctx.onSlide($event);
        });
        ɵɵelementEnd();
      }
      if (rf & 2) {
        ɵɵproperty("ngTemplateOutlet", ctx.leftTemplate || ctx._leftTemplate);
        ɵɵadvance();
        ɵɵproperty("ngTemplateOutlet", ctx.rightTemplate || ctx._rightTemplate);
        ɵɵadvance();
        ɵɵclassMap(ctx.cx("slider"));
      }
    },
    dependencies: [CommonModule, NgTemplateOutlet, SharedModule],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ImageCompare, [{
    type: Component,
    args: [{
      selector: "p-imageCompare, p-imagecompare, p-image-compare",
      standalone: true,
      imports: [CommonModule, SharedModule],
      template: `
        <ng-template *ngTemplateOutlet="leftTemplate || _leftTemplate"></ng-template>
        <ng-template *ngTemplateOutlet="rightTemplate || _rightTemplate"></ng-template>

        <input type="range" min="0" max="100" value="50" (input)="onSlide($event)" [class]="cx('slider')" />
    `,
      host: {
        class: "p-imagecompare",
        "[attr.tabindex]": "tabindex",
        "[attr.aria-labelledby]": "ariaLabelledby",
        "[attr.aria-label]": "ariaLabel"
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [ImageCompareStyle]
    }]
  }], null, {
    tabindex: [{
      type: Input
    }],
    ariaLabelledby: [{
      type: Input
    }],
    ariaLabel: [{
      type: Input
    }],
    leftTemplate: [{
      type: ContentChild,
      args: ["left", {
        descendants: false
      }]
    }],
    rightTemplate: [{
      type: ContentChild,
      args: ["right", {
        descendants: false
      }]
    }],
    templates: [{
      type: ContentChildren,
      args: [PrimeTemplate]
    }]
  });
})();
var ImageCompareModule = class _ImageCompareModule {
  static ɵfac = function ImageCompareModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ImageCompareModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _ImageCompareModule,
    imports: [ImageCompare, SharedModule],
    exports: [ImageCompare, SharedModule]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [ImageCompare, SharedModule, SharedModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ImageCompareModule, [{
    type: NgModule,
    args: [{
      imports: [ImageCompare, SharedModule],
      exports: [ImageCompare, SharedModule]
    }]
  }], null, null);
})();
export {
  ImageCompare,
  ImageCompareClasses,
  ImageCompareModule,
  ImageCompareStyle
};
//# sourceMappingURL=primeng_imagecompare.js.map
