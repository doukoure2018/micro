import {
  AutoFocus,
  BaseIcon
} from "./chunk-AP3OAIHW.js";
import {
  BaseComponent,
  BaseStyle,
  PrimeTemplate,
  SharedModule,
  focus,
  getFirstFocusableElement,
  uuid
} from "./chunk-NQNBRQ7H.js";
import {
  NG_VALUE_ACCESSOR
} from "./chunk-3HTR5OU7.js";
import {
  CommonModule,
  NgClass,
  NgForOf,
  NgIf,
  NgStyle,
  NgTemplateOutlet
} from "./chunk-SQQPVFHK.js";
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Injectable,
  Input,
  NgModule,
  Output,
  ViewEncapsulation,
  booleanAttribute,
  forwardRef,
  inject,
  numberAttribute,
  setClassMetadata,
  signal,
  ɵɵInheritDefinitionFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction2,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor
} from "./chunk-ZKKMBKIA.js";

// node_modules/primeng/fesm2022/primeng-icons-star.mjs
var StarIcon = class _StarIcon extends BaseIcon {
  pathId;
  ngOnInit() {
    this.pathId = "url(#" + uuid() + ")";
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275StarIcon_BaseFactory;
    return function StarIcon_Factory(__ngFactoryType__) {
      return (\u0275StarIcon_BaseFactory || (\u0275StarIcon_BaseFactory = \u0275\u0275getInheritedFactory(_StarIcon)))(__ngFactoryType__ || _StarIcon);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _StarIcon,
    selectors: [["StarIcon"]],
    features: [\u0275\u0275InheritDefinitionFeature],
    decls: 6,
    vars: 7,
    consts: [["width", "14", "height", "14", "viewBox", "0 0 14 14", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M10.9741 13.6721C10.8806 13.6719 10.7886 13.6483 10.7066 13.6033L7.00002 11.6545L3.29345 13.6033C3.19926 13.6539 3.09281 13.6771 2.98612 13.6703C2.87943 13.6636 2.77676 13.6271 2.6897 13.5651C2.60277 13.5014 2.53529 13.4147 2.4948 13.3148C2.45431 13.215 2.44241 13.1058 2.46042 12.9995L3.17881 8.87264L0.167699 5.95324C0.0922333 5.8777 0.039368 5.78258 0.0150625 5.67861C-0.00924303 5.57463 -0.00402231 5.46594 0.030136 5.36477C0.0621323 5.26323 0.122141 5.17278 0.203259 5.10383C0.284377 5.03488 0.383311 4.99023 0.488681 4.97501L4.63087 4.37126L6.48797 0.618832C6.54083 0.530159 6.61581 0.456732 6.70556 0.405741C6.79532 0.35475 6.89678 0.327942 7.00002 0.327942C7.10325 0.327942 7.20471 0.35475 7.29447 0.405741C7.38422 0.456732 7.4592 0.530159 7.51206 0.618832L9.36916 4.37126L13.5114 4.97501C13.6167 4.99023 13.7157 5.03488 13.7968 5.10383C13.8779 5.17278 13.9379 5.26323 13.9699 5.36477C14.0041 5.46594 14.0093 5.57463 13.985 5.67861C13.9607 5.78258 13.9078 5.8777 13.8323 5.95324L10.8212 8.87264L11.532 12.9995C11.55 13.1058 11.5381 13.215 11.4976 13.3148C11.4571 13.4147 11.3896 13.5014 11.3027 13.5651C11.2059 13.632 11.0917 13.6692 10.9741 13.6721ZM7.00002 10.4393C7.09251 10.4404 7.18371 10.4613 7.2675 10.5005L10.2098 12.029L9.65193 8.75036C9.6368 8.6584 9.64343 8.56418 9.6713 8.47526C9.69918 8.38633 9.74751 8.30518 9.81242 8.23832L12.1969 5.94559L8.90298 5.45648C8.81188 5.44198 8.72555 5.406 8.65113 5.35152C8.57671 5.29703 8.51633 5.2256 8.475 5.14314L7.00002 2.1626L5.52503 5.15078C5.4837 5.23324 5.42332 5.30467 5.3489 5.35916C5.27448 5.41365 5.18815 5.44963 5.09705 5.46412L1.80318 5.94559L4.18761 8.23832C4.25252 8.30518 4.30085 8.38633 4.32873 8.47526C4.3566 8.56418 4.36323 8.6584 4.3481 8.75036L3.7902 12.0519L6.73253 10.5234C6.81451 10.4762 6.9058 10.4475 7.00002 10.4393Z", "fill", "currentColor"], [3, "id"], ["width", "14", "height", "14", "fill", "white"]],
    template: function StarIcon_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275namespaceSVG();
        \u0275\u0275elementStart(0, "svg", 0)(1, "g");
        \u0275\u0275element(2, "path", 1);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(3, "defs")(4, "clipPath", 2);
        \u0275\u0275element(5, "rect", 3);
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        \u0275\u0275classMap(ctx.getClassNames());
        \u0275\u0275attribute("aria-label", ctx.ariaLabel)("aria-hidden", ctx.ariaHidden)("role", ctx.role);
        \u0275\u0275advance();
        \u0275\u0275attribute("clip-path", ctx.pathId);
        \u0275\u0275advance(3);
        \u0275\u0275property("id", ctx.pathId);
      }
    },
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StarIcon, [{
    type: Component,
    args: [{
      selector: "StarIcon",
      standalone: true,
      template: `
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" [attr.aria-label]="ariaLabel" [attr.aria-hidden]="ariaHidden" [attr.role]="role" [class]="getClassNames()">
            <g [attr.clip-path]="pathId">
                <path
                    d="M10.9741 13.6721C10.8806 13.6719 10.7886 13.6483 10.7066 13.6033L7.00002 11.6545L3.29345 13.6033C3.19926 13.6539 3.09281 13.6771 2.98612 13.6703C2.87943 13.6636 2.77676 13.6271 2.6897 13.5651C2.60277 13.5014 2.53529 13.4147 2.4948 13.3148C2.45431 13.215 2.44241 13.1058 2.46042 12.9995L3.17881 8.87264L0.167699 5.95324C0.0922333 5.8777 0.039368 5.78258 0.0150625 5.67861C-0.00924303 5.57463 -0.00402231 5.46594 0.030136 5.36477C0.0621323 5.26323 0.122141 5.17278 0.203259 5.10383C0.284377 5.03488 0.383311 4.99023 0.488681 4.97501L4.63087 4.37126L6.48797 0.618832C6.54083 0.530159 6.61581 0.456732 6.70556 0.405741C6.79532 0.35475 6.89678 0.327942 7.00002 0.327942C7.10325 0.327942 7.20471 0.35475 7.29447 0.405741C7.38422 0.456732 7.4592 0.530159 7.51206 0.618832L9.36916 4.37126L13.5114 4.97501C13.6167 4.99023 13.7157 5.03488 13.7968 5.10383C13.8779 5.17278 13.9379 5.26323 13.9699 5.36477C14.0041 5.46594 14.0093 5.57463 13.985 5.67861C13.9607 5.78258 13.9078 5.8777 13.8323 5.95324L10.8212 8.87264L11.532 12.9995C11.55 13.1058 11.5381 13.215 11.4976 13.3148C11.4571 13.4147 11.3896 13.5014 11.3027 13.5651C11.2059 13.632 11.0917 13.6692 10.9741 13.6721ZM7.00002 10.4393C7.09251 10.4404 7.18371 10.4613 7.2675 10.5005L10.2098 12.029L9.65193 8.75036C9.6368 8.6584 9.64343 8.56418 9.6713 8.47526C9.69918 8.38633 9.74751 8.30518 9.81242 8.23832L12.1969 5.94559L8.90298 5.45648C8.81188 5.44198 8.72555 5.406 8.65113 5.35152C8.57671 5.29703 8.51633 5.2256 8.475 5.14314L7.00002 2.1626L5.52503 5.15078C5.4837 5.23324 5.42332 5.30467 5.3489 5.35916C5.27448 5.41365 5.18815 5.44963 5.09705 5.46412L1.80318 5.94559L4.18761 8.23832C4.25252 8.30518 4.30085 8.38633 4.32873 8.47526C4.3566 8.56418 4.36323 8.6584 4.3481 8.75036L3.7902 12.0519L6.73253 10.5234C6.81451 10.4762 6.9058 10.4475 7.00002 10.4393Z"
                    fill="currentColor"
                />
            </g>
            <defs>
                <clipPath [id]="pathId">
                    <rect width="14" height="14" fill="white" />
                </clipPath>
            </defs>
        </svg>
    `
    }]
  }], null, null);
})();

// node_modules/primeng/fesm2022/primeng-icons-starfill.mjs
var StarFillIcon = class _StarFillIcon extends BaseIcon {
  pathId;
  ngOnInit() {
    this.pathId = "url(#" + uuid() + ")";
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275StarFillIcon_BaseFactory;
    return function StarFillIcon_Factory(__ngFactoryType__) {
      return (\u0275StarFillIcon_BaseFactory || (\u0275StarFillIcon_BaseFactory = \u0275\u0275getInheritedFactory(_StarFillIcon)))(__ngFactoryType__ || _StarFillIcon);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _StarFillIcon,
    selectors: [["StarFillIcon"]],
    features: [\u0275\u0275InheritDefinitionFeature],
    decls: 6,
    vars: 7,
    consts: [["width", "14", "height", "14", "viewBox", "0 0 14 14", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M13.9718 5.36453C13.9398 5.26298 13.8798 5.17252 13.7986 5.10356C13.7175 5.0346 13.6186 4.98994 13.5132 4.97472L9.37043 4.37088L7.51307 0.617955C7.46021 0.529271 7.38522 0.455834 7.29545 0.404836C7.20568 0.353838 7.1042 0.327026 7.00096 0.327026C6.89771 0.327026 6.79624 0.353838 6.70647 0.404836C6.6167 0.455834 6.54171 0.529271 6.48885 0.617955L4.63149 4.37088L0.488746 4.97472C0.383363 4.98994 0.284416 5.0346 0.203286 5.10356C0.122157 5.17252 0.0621407 5.26298 0.03014 5.36453C-0.00402286 5.46571 -0.00924428 5.57442 0.0150645 5.67841C0.0393733 5.7824 0.0922457 5.87753 0.167722 5.95308L3.17924 8.87287L2.4684 13.0003C2.45038 13.1066 2.46229 13.2158 2.50278 13.3157C2.54328 13.4156 2.61077 13.5022 2.6977 13.5659C2.78477 13.628 2.88746 13.6644 2.99416 13.6712C3.10087 13.678 3.20733 13.6547 3.30153 13.6042L7.00096 11.6551L10.708 13.6042C10.79 13.6491 10.882 13.6728 10.9755 13.673C11.0958 13.6716 11.2129 13.6343 11.3119 13.5659C11.3988 13.5022 11.4663 13.4156 11.5068 13.3157C11.5473 13.2158 11.5592 13.1066 11.5412 13.0003L10.8227 8.87287L13.8266 5.95308C13.9033 5.87835 13.9577 5.7836 13.9833 5.67957C14.009 5.57554 14.005 5.4664 13.9718 5.36453Z", "fill", "currentColor"], [3, "id"], ["width", "14", "height", "14", "fill", "white"]],
    template: function StarFillIcon_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275namespaceSVG();
        \u0275\u0275elementStart(0, "svg", 0)(1, "g");
        \u0275\u0275element(2, "path", 1);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(3, "defs")(4, "clipPath", 2);
        \u0275\u0275element(5, "rect", 3);
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        \u0275\u0275classMap(ctx.getClassNames());
        \u0275\u0275attribute("aria-label", ctx.ariaLabel)("aria-hidden", ctx.ariaHidden)("role", ctx.role);
        \u0275\u0275advance();
        \u0275\u0275attribute("clip-path", ctx.pathId);
        \u0275\u0275advance(3);
        \u0275\u0275property("id", ctx.pathId);
      }
    },
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StarFillIcon, [{
    type: Component,
    args: [{
      selector: "StarFillIcon",
      standalone: true,
      template: `
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" [attr.aria-label]="ariaLabel" [attr.aria-hidden]="ariaHidden" [attr.role]="role" [class]="getClassNames()">
            <g [attr.clip-path]="pathId">
                <path
                    d="M13.9718 5.36453C13.9398 5.26298 13.8798 5.17252 13.7986 5.10356C13.7175 5.0346 13.6186 4.98994 13.5132 4.97472L9.37043 4.37088L7.51307 0.617955C7.46021 0.529271 7.38522 0.455834 7.29545 0.404836C7.20568 0.353838 7.1042 0.327026 7.00096 0.327026C6.89771 0.327026 6.79624 0.353838 6.70647 0.404836C6.6167 0.455834 6.54171 0.529271 6.48885 0.617955L4.63149 4.37088L0.488746 4.97472C0.383363 4.98994 0.284416 5.0346 0.203286 5.10356C0.122157 5.17252 0.0621407 5.26298 0.03014 5.36453C-0.00402286 5.46571 -0.00924428 5.57442 0.0150645 5.67841C0.0393733 5.7824 0.0922457 5.87753 0.167722 5.95308L3.17924 8.87287L2.4684 13.0003C2.45038 13.1066 2.46229 13.2158 2.50278 13.3157C2.54328 13.4156 2.61077 13.5022 2.6977 13.5659C2.78477 13.628 2.88746 13.6644 2.99416 13.6712C3.10087 13.678 3.20733 13.6547 3.30153 13.6042L7.00096 11.6551L10.708 13.6042C10.79 13.6491 10.882 13.6728 10.9755 13.673C11.0958 13.6716 11.2129 13.6343 11.3119 13.5659C11.3988 13.5022 11.4663 13.4156 11.5068 13.3157C11.5473 13.2158 11.5592 13.1066 11.5412 13.0003L10.8227 8.87287L13.8266 5.95308C13.9033 5.87835 13.9577 5.7836 13.9833 5.67957C14.009 5.57554 14.005 5.4664 13.9718 5.36453Z"
                    fill="currentColor"
                />
            </g>
            <defs>
                <clipPath [id]="pathId">
                    <rect width="14" height="14" fill="white" />
                </clipPath>
            </defs>
        </svg>
    `
    }]
  }], null, null);
})();

// node_modules/primeng/fesm2022/primeng-rating.mjs
var _c0 = ["onicon"];
var _c1 = ["officon"];
var _c2 = ["cancelicon"];
var _c3 = (a0, a1) => ({
  "p-rating-option-active": a0,
  "p-focus-visible": a1
});
function Rating_ng_container_0_ng_template_1_ng_container_3_span_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 9);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275property("ngStyle", ctx_r2.iconOffStyle)("ngClass", ctx_r2.iconOffClass);
    \u0275\u0275attribute("data-pc-section", "offIcon");
  }
}
function Rating_ng_container_0_ng_template_1_ng_container_3_StarIcon_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "StarIcon", 10);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275property("ngStyle", ctx_r2.iconOffStyle)("styleClass", "p-rating-icon");
    \u0275\u0275attribute("data-pc-section", "offIcon");
  }
}
function Rating_ng_container_0_ng_template_1_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, Rating_ng_container_0_ng_template_1_ng_container_3_span_1_Template, 1, 3, "span", 7)(2, Rating_ng_container_0_ng_template_1_ng_container_3_StarIcon_2_Template, 1, 3, "StarIcon", 8);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.iconOffClass);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r2.iconOffClass);
  }
}
function Rating_ng_container_0_ng_template_1_ng_container_4_span_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 12);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275property("ngStyle", ctx_r2.iconOnStyle)("ngClass", ctx_r2.iconOnClass);
    \u0275\u0275attribute("data-pc-section", "onIcon");
  }
}
function Rating_ng_container_0_ng_template_1_ng_container_4_StarFillIcon_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "StarFillIcon", 10);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275property("ngStyle", ctx_r2.iconOnStyle)("styleClass", "p-rating-icon p-rating-icon-active");
    \u0275\u0275attribute("data-pc-section", "onIcon");
  }
}
function Rating_ng_container_0_ng_template_1_ng_container_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, Rating_ng_container_0_ng_template_1_ng_container_4_span_1_Template, 1, 3, "span", 11)(2, Rating_ng_container_0_ng_template_1_ng_container_4_StarFillIcon_2_Template, 1, 3, "StarFillIcon", 8);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.iconOnClass);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r2.iconOnClass);
  }
}
function Rating_ng_container_0_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 3);
    \u0275\u0275listener("click", function Rating_ng_container_0_ng_template_1_Template_div_click_0_listener($event) {
      const star_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onOptionClick($event, star_r2 + 1));
    });
    \u0275\u0275elementStart(1, "span", 4)(2, "input", 5);
    \u0275\u0275listener("focus", function Rating_ng_container_0_ng_template_1_Template_input_focus_2_listener($event) {
      const star_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onInputFocus($event, star_r2 + 1));
    })("blur", function Rating_ng_container_0_ng_template_1_Template_input_blur_2_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onInputBlur($event));
    })("change", function Rating_ng_container_0_ng_template_1_Template_input_change_2_listener($event) {
      const star_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onChange($event, star_r2 + 1));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275template(3, Rating_ng_container_0_ng_template_1_ng_container_3_Template, 3, 2, "ng-container", 6)(4, Rating_ng_container_0_ng_template_1_ng_container_4_Template, 3, 2, "ng-container", 6);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const star_r2 = ctx.$implicit;
    const i_r4 = ctx.index;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(10, _c3, star_r2 + 1 <= ctx_r2.value, star_r2 + 1 === ctx_r2.focusedOptionIndex() && ctx_r2.isFocusVisibleItem));
    \u0275\u0275advance();
    \u0275\u0275attribute("data-p-hidden-accessible", true);
    \u0275\u0275advance();
    \u0275\u0275property("name", ctx_r2.nameattr)("checked", ctx_r2.value === 0)("disabled", ctx_r2.disabled)("readonly", ctx_r2.readonly)("pAutoFocus", ctx_r2.autofocus);
    \u0275\u0275attribute("aria-label", ctx_r2.starAriaLabel(star_r2 + 1));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r2.value || i_r4 >= ctx_r2.value);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.value && i_r4 < ctx_r2.value);
  }
}
function Rating_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, Rating_ng_container_0_ng_template_1_Template, 5, 13, "ng-template", 2);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r2.starsArray);
  }
}
function Rating_ng_template_1_span_0_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function Rating_ng_template_1_span_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 14);
    \u0275\u0275listener("click", function Rating_ng_template_1_span_0_Template_span_click_0_listener($event) {
      const star_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onOptionClick($event, star_r6 + 1));
    });
    \u0275\u0275template(1, Rating_ng_template_1_span_0_ng_container_1_Template, 1, 0, "ng-container", 15);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const i_r7 = ctx.index;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("data-pc-section", "onIcon");
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", ctx_r2.getIconTemplate(i_r7));
  }
}
function Rating_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, Rating_ng_template_1_span_0_Template, 2, 2, "span", 13);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("ngForOf", ctx_r2.starsArray);
  }
}
var theme = ({
  dt
}) => `
.p-rating {
    position: relative;
    display: flex;
    align-items: center;
    gap: ${dt("rating.gap")};
}

.p-rating-option {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    outline-color: transparent;
    border-radius: 50%;
    transition: background ${dt("rating.transition.duration")}, color ${dt("rating.transition.duration")}, border-color ${dt("rating.transition.duration")}, outline-color ${dt("rating.transition.duration")}, box-shadow ${dt("rating.transition.duration")};
}

.p-rating-option.p-focus-visible {
    box-shadow: ${dt("rating.focus.ring.shadow")};
    outline: ${dt("rating.focus.ring.width")} ${dt("rating.focus.ring.style")} ${dt("rating.focus.ring.color")};
    outline-offset: ${dt("rating.focus.ring.offset")};
}

.p-rating-icon {
    color: ${dt("rating.icon.color")};
    transition: background ${dt("rating.transition.duration")}, color ${dt("rating.transition.duration")}, border-color ${dt("rating.transition.duration")}, outline-color ${dt("rating.transition.duration")}, box-shadow ${dt("rating.transition.duration")};
    font-size: ${dt("rating.icon.size")};
    width: ${dt("rating.icon.size")};
    height: ${dt("rating.icon.size")};
}

.p-rating:not(.p-disabled):not(.p-readonly) .p-rating-option:hover .p-rating-icon {
    color: ${dt("rating.icon.hover.color")};
}

.p-rating-option-active .p-rating-icon {
    color: ${dt("rating.icon.active.color")};
}

/* For PrimeNG */
p-rating.ng-invalid.ng-dirty > .p-rating > .p-rating-icon {
    stroke: ${dt("rating.invalid.icon.color")};
}`;
var classes = {
  root: ({
    props
  }) => ["p-rating", {
    "p-readonly": props.readonly,
    "p-disabled": props.disabled
  }],
  option: ({
    instance,
    props,
    value
  }) => ["p-rating-option", {
    "p-rating-option-active": value <= props.modelValue,
    "p-focus-visible": value === instance.focusedOptionIndex() && instance.isFocusVisibleItem
  }],
  onIcon: "p-rating-icon p-rating-on-icon",
  offIcon: "p-rating-icon p-rating-off-icon"
};
var RatingStyle = class _RatingStyle extends BaseStyle {
  name = "rating";
  theme = theme;
  classes = classes;
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275RatingStyle_BaseFactory;
    return function RatingStyle_Factory(__ngFactoryType__) {
      return (\u0275RatingStyle_BaseFactory || (\u0275RatingStyle_BaseFactory = \u0275\u0275getInheritedFactory(_RatingStyle)))(__ngFactoryType__ || _RatingStyle);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _RatingStyle,
    factory: _RatingStyle.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RatingStyle, [{
    type: Injectable
  }], null, null);
})();
var RatingClasses;
(function(RatingClasses2) {
  RatingClasses2["root"] = "p-rating";
  RatingClasses2["option"] = "p-rating-option";
  RatingClasses2["onIcon"] = "p-rating-on-icon";
  RatingClasses2["offIcon"] = "p-rating-off-icon";
})(RatingClasses || (RatingClasses = {}));
var RATING_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => Rating),
  multi: true
};
var Rating = class _Rating extends BaseComponent {
  /**
   * When present, it specifies that the element should be disabled.
   * @group Props
   */
  disabled;
  /**
   * When present, changing the value is not possible.
   * @group Props
   */
  readonly;
  /**
   * Number of stars.
   * @group Props
   */
  stars = 5;
  /**
   * Style class of the on icon.
   * @group Props
   */
  iconOnClass;
  /**
   * Inline style of the on icon.
   * @group Props
   */
  iconOnStyle;
  /**
   * Style class of the off icon.
   * @group Props
   */
  iconOffClass;
  /**
   * Inline style of the off icon.
   * @group Props
   */
  iconOffStyle;
  /**
   * When present, it specifies that the component should automatically get focus on load.
   * @group Props
   */
  autofocus;
  /**
   * Emitted on value change.
   * @param {RatingRateEvent} value - Custom rate event.
   * @group Emits
   */
  onRate = new EventEmitter();
  /**
   * Emitted when the rating is cancelled.
   * @param {Event} value - Browser event.
   * @group Emits
   */
  onCancel = new EventEmitter();
  /**
   * Emitted when the rating receives focus.
   * @param {Event} value - Browser event.
   * @group Emits
   */
  onFocus = new EventEmitter();
  /**
   * Emitted when the rating loses focus.
   * @param {Event} value - Browser event.
   * @group Emits
   */
  onBlur = new EventEmitter();
  /**
   * Custom on icon template.
   * @group Templates
   */
  onIconTemplate;
  /**
   * Custom off icon template.
   * @group Templates
   */
  offIconTemplate;
  /**
   * Custom cancel icon template.
   * @group Templates
   */
  cancelIconTemplate;
  templates;
  value;
  onModelChange = () => {
  };
  onModelTouched = () => {
  };
  starsArray;
  isFocusVisibleItem = true;
  focusedOptionIndex = signal(-1);
  nameattr;
  _componentStyle = inject(RatingStyle);
  _onIconTemplate;
  _offIconTemplate;
  _cancelIconTemplate;
  ngOnInit() {
    super.ngOnInit();
    this.nameattr = this.nameattr || uuid("pn_id_");
    this.starsArray = [];
    for (let i = 0; i < this.stars; i++) {
      this.starsArray[i] = i;
    }
  }
  ngAfterContentInit() {
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case "onicon":
          this._onIconTemplate = item.template;
          break;
        case "officon":
          this._offIconTemplate = item.template;
          break;
        case "cancelicon":
          this._cancelIconTemplate = item.template;
          break;
      }
    });
  }
  onOptionClick(event, value) {
    if (!this.readonly && !this.disabled) {
      this.onOptionSelect(event, value);
      this.isFocusVisibleItem = false;
      const firstFocusableEl = getFirstFocusableElement(event.currentTarget, "");
      firstFocusableEl && focus(firstFocusableEl);
    }
  }
  onOptionSelect(event, value) {
    if (!this.readonly && !this.disabled) {
      if (this.focusedOptionIndex() === value || value === this.value) {
        this.focusedOptionIndex.set(-1);
        this.updateModel(event, null);
      } else {
        this.focusedOptionIndex.set(value);
        this.updateModel(event, value || null);
      }
    }
  }
  onChange(event, value) {
    this.onOptionSelect(event, value);
    this.isFocusVisibleItem = true;
  }
  onInputBlur(event) {
    this.focusedOptionIndex.set(-1);
    this.onBlur.emit(event);
  }
  onInputFocus(event, value) {
    if (!this.readonly && !this.disabled) {
      this.focusedOptionIndex.set(value);
      this.onFocus.emit(event);
    }
  }
  updateModel(event, value) {
    this.value = value;
    this.onModelChange(this.value);
    this.onModelTouched();
    if (!value) {
      this.onCancel.emit();
    } else {
      this.onRate.emit({
        originalEvent: event,
        value
      });
    }
  }
  starAriaLabel(value) {
    return value === 1 ? this.config.translation.aria.star : this.config.translation.aria.stars.replace(/{star}/g, value);
  }
  getIconTemplate(i) {
    return !this.value || i >= this.value ? this.offIconTemplate || this._offIconTemplate : this.onIconTemplate || this.offIconTemplate;
  }
  writeValue(value) {
    this.value = value;
    this.cd.detectChanges();
  }
  registerOnChange(fn) {
    this.onModelChange = fn;
  }
  registerOnTouched(fn) {
    this.onModelTouched = fn;
  }
  setDisabledState(val) {
    this.disabled = val;
    this.cd.markForCheck();
  }
  get isCustomIcon() {
    return !!(this.onIconTemplate || this._onIconTemplate || this.offIconTemplate || this._offIconTemplate || this.cancelIconTemplate || this._cancelIconTemplate);
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275Rating_BaseFactory;
    return function Rating_Factory(__ngFactoryType__) {
      return (\u0275Rating_BaseFactory || (\u0275Rating_BaseFactory = \u0275\u0275getInheritedFactory(_Rating)))(__ngFactoryType__ || _Rating);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _Rating,
    selectors: [["p-rating"]],
    contentQueries: function Rating_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        \u0275\u0275contentQuery(dirIndex, _c0, 4);
        \u0275\u0275contentQuery(dirIndex, _c1, 4);
        \u0275\u0275contentQuery(dirIndex, _c2, 4);
        \u0275\u0275contentQuery(dirIndex, PrimeTemplate, 4);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.onIconTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.offIconTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.cancelIconTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.templates = _t);
      }
    },
    hostAttrs: [1, "p-rating"],
    hostVars: 6,
    hostBindings: function Rating_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275attribute("data-pc-name", "rating")("data-pc-section", "root");
        \u0275\u0275classProp("p-readonly", ctx.readonly)("p-disabled", ctx.disabled);
      }
    },
    inputs: {
      disabled: [2, "disabled", "disabled", booleanAttribute],
      readonly: [2, "readonly", "readonly", booleanAttribute],
      stars: [2, "stars", "stars", numberAttribute],
      iconOnClass: "iconOnClass",
      iconOnStyle: "iconOnStyle",
      iconOffClass: "iconOffClass",
      iconOffStyle: "iconOffStyle",
      autofocus: [2, "autofocus", "autofocus", booleanAttribute]
    },
    outputs: {
      onRate: "onRate",
      onCancel: "onCancel",
      onFocus: "onFocus",
      onBlur: "onBlur"
    },
    features: [\u0275\u0275ProvidersFeature([RATING_VALUE_ACCESSOR, RatingStyle]), \u0275\u0275InheritDefinitionFeature],
    decls: 3,
    vars: 2,
    consts: [["customTemplate", ""], [4, "ngIf", "ngIfElse"], ["ngFor", "", 3, "ngForOf"], [1, "p-rating-option", 3, "click", "ngClass"], [1, "p-hidden-accessible"], ["type", "radio", "value", "0", 3, "focus", "blur", "change", "name", "checked", "disabled", "readonly", "pAutoFocus"], [4, "ngIf"], ["class", "p-rating-icon", 3, "ngStyle", "ngClass", 4, "ngIf"], [3, "ngStyle", "styleClass", 4, "ngIf"], [1, "p-rating-icon", 3, "ngStyle", "ngClass"], [3, "ngStyle", "styleClass"], ["class", "p-rating-icon p-rating-icon-active", 3, "ngStyle", "ngClass", 4, "ngIf"], [1, "p-rating-icon", "p-rating-icon-active", 3, "ngStyle", "ngClass"], [3, "click", 4, "ngFor", "ngForOf"], [3, "click"], [4, "ngTemplateOutlet"]],
    template: function Rating_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275template(0, Rating_ng_container_0_Template, 2, 1, "ng-container", 1)(1, Rating_ng_template_1_Template, 1, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
      }
      if (rf & 2) {
        const customTemplate_r8 = \u0275\u0275reference(2);
        \u0275\u0275property("ngIf", !ctx.isCustomIcon)("ngIfElse", customTemplate_r8);
      }
    },
    dependencies: [CommonModule, NgClass, NgForOf, NgIf, NgTemplateOutlet, NgStyle, AutoFocus, StarFillIcon, StarIcon, SharedModule],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Rating, [{
    type: Component,
    args: [{
      selector: "p-rating",
      imports: [CommonModule, AutoFocus, StarFillIcon, StarIcon, SharedModule],
      standalone: true,
      template: `
        <ng-container *ngIf="!isCustomIcon; else customTemplate">
            <ng-template ngFor [ngForOf]="starsArray" let-star let-i="index">
                <div
                    class="p-rating-option"
                    [ngClass]="{
                        'p-rating-option-active': star + 1 <= value,
                        'p-focus-visible': star + 1 === focusedOptionIndex() && isFocusVisibleItem
                    }"
                    (click)="onOptionClick($event, star + 1)"
                >
                    <span class="p-hidden-accessible" [attr.data-p-hidden-accessible]="true">
                        <input
                            type="radio"
                            value="0"
                            [name]="nameattr"
                            [checked]="value === 0"
                            [disabled]="disabled"
                            [readonly]="readonly"
                            [attr.aria-label]="starAriaLabel(star + 1)"
                            (focus)="onInputFocus($event, star + 1)"
                            (blur)="onInputBlur($event)"
                            (change)="onChange($event, star + 1)"
                            [pAutoFocus]="autofocus"
                        />
                    </span>
                    <ng-container *ngIf="!value || i >= value">
                        <span class="p-rating-icon" *ngIf="iconOffClass" [ngStyle]="iconOffStyle" [ngClass]="iconOffClass" [attr.data-pc-section]="'offIcon'"></span>
                        <StarIcon *ngIf="!iconOffClass" [ngStyle]="iconOffStyle" [styleClass]="'p-rating-icon'" [attr.data-pc-section]="'offIcon'" />
                    </ng-container>
                    <ng-container *ngIf="value && i < value">
                        <span class="p-rating-icon p-rating-icon-active" *ngIf="iconOnClass" [ngStyle]="iconOnStyle" [ngClass]="iconOnClass" [attr.data-pc-section]="'onIcon'"></span>
                        <StarFillIcon *ngIf="!iconOnClass" [ngStyle]="iconOnStyle" [styleClass]="'p-rating-icon p-rating-icon-active'" [attr.data-pc-section]="'onIcon'" />
                    </ng-container>
                </div>
            </ng-template>
        </ng-container>
        <ng-template #customTemplate>
            <span *ngFor="let star of starsArray; let i = index" (click)="onOptionClick($event, star + 1)" [attr.data-pc-section]="'onIcon'">
                <ng-container *ngTemplateOutlet="getIconTemplate(i)"></ng-container>
            </span>
        </ng-template>
    `,
      providers: [RATING_VALUE_ACCESSOR, RatingStyle],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      host: {
        class: "p-rating",
        "[attr.data-pc-name]": '"rating"',
        "[attr.data-pc-section]": '"root"',
        "[class.p-readonly]": "readonly",
        "[class.p-disabled]": "disabled"
      }
    }]
  }], null, {
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    readonly: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    stars: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    iconOnClass: [{
      type: Input
    }],
    iconOnStyle: [{
      type: Input
    }],
    iconOffClass: [{
      type: Input
    }],
    iconOffStyle: [{
      type: Input
    }],
    autofocus: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    onRate: [{
      type: Output
    }],
    onCancel: [{
      type: Output
    }],
    onFocus: [{
      type: Output
    }],
    onBlur: [{
      type: Output
    }],
    onIconTemplate: [{
      type: ContentChild,
      args: ["onicon", {
        descendants: false
      }]
    }],
    offIconTemplate: [{
      type: ContentChild,
      args: ["officon", {
        descendants: false
      }]
    }],
    cancelIconTemplate: [{
      type: ContentChild,
      args: ["cancelicon", {
        descendants: false
      }]
    }],
    templates: [{
      type: ContentChildren,
      args: [PrimeTemplate]
    }]
  });
})();
var RatingModule = class _RatingModule {
  static \u0275fac = function RatingModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RatingModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _RatingModule
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [Rating, SharedModule, SharedModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RatingModule, [{
    type: NgModule,
    args: [{
      imports: [Rating, SharedModule],
      exports: [Rating, SharedModule]
    }]
  }], null, null);
})();

export {
  Rating,
  RatingModule
};
//# sourceMappingURL=chunk-A4PDURMQ.js.map
