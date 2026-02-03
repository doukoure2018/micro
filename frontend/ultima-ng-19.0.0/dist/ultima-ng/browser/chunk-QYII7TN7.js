import {
  ProductService
} from "./chunk-JVDBGEQL.js";
import {
  Image,
  ImageModule
} from "./chunk-EUWFULGH.js";
import "./chunk-UZIOTGW7.js";
import {
  WindowMaximizeIcon,
  WindowMinimizeIcon
} from "./chunk-WWXP2HWK.js";
import {
  FocusTrap
} from "./chunk-CXW3XKZ2.js";
import {
  Tag,
  TagModule
} from "./chunk-MYUKI7DG.js";
import {
  ChevronUpIcon
} from "./chunk-YBM6FZLP.js";
import {
  ChevronLeftIcon
} from "./chunk-U4P2VV4G.js";
import {
  ChevronRightIcon
} from "./chunk-CPYA4VSS.js";
import {
  ChevronDownIcon
} from "./chunk-CCBQFN2J.js";
import {
  TimesIcon
} from "./chunk-IVSL2HKS.js";
import {
  zindexutils
} from "./chunk-E352KRZV.js";
import {
  Button,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import {
  Ripple
} from "./chunk-AP3OAIHW.js";
import {
  BaseComponent,
  BaseStyle,
  Footer,
  Header,
  PrimeTemplate,
  SharedModule,
  addClass,
  blockBodyScroll,
  find,
  findSingle,
  focus,
  getAttribute,
  removeClass,
  setAttribute,
  unblockBodyScroll,
  uuid
} from "./chunk-NQNBRQ7H.js";
import "./chunk-BMYIFZHZ.js";
import {
  animate,
  style,
  transition,
  trigger
} from "./chunk-W3K3GK4Z.js";
import {
  CommonModule,
  DOCUMENT,
  NgClass,
  NgForOf,
  NgIf,
  NgStyle,
  NgTemplateOutlet,
  isPlatformBrowser
} from "./chunk-SQQPVFHK.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Injectable,
  Input,
  KeyValueDiffers,
  NgModule,
  NgZone,
  Output,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  numberAttribute,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵInheritDefinitionFeature,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
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
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpropertyInterpolate1,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵpureFunction2,
  ɵɵpureFunction3,
  ɵɵpureFunction4,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵresetView,
  ɵɵresolveDocument,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuery
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// node_modules/primeng/fesm2022/primeng-carousel.mjs
var _c0 = ["item"];
var _c1 = ["header"];
var _c2 = ["footer"];
var _c3 = ["previousicon"];
var _c4 = ["nexticon"];
var _c5 = ["itemsContainer"];
var _c6 = ["indicatorContent"];
var _c7 = [[["p-header"]], [["p-footer"]]];
var _c8 = ["p-header", "p-footer"];
var _c9 = (a0, a1) => ({
  "p-carousel p-component": true,
  "p-carousel-vertical": a0,
  "p-carousel-horizontal": a1
});
var _c10 = (a0) => ({
  height: a0
});
var _c11 = (a0) => ({
  "p-carousel-prev-button": true,
  "p-disabled": a0
});
var _c12 = (a0, a1, a2) => ({
  "p-carousel-item p-carousel-item-clone": true,
  "p-carousel-item-active": a0,
  "p-carousel-item-start": a1,
  "p-carousel-item-end": a2
});
var _c13 = (a0) => ({
  $implicit: a0
});
var _c14 = (a0, a1, a2) => ({
  "p-carousel-item": true,
  "p-carousel-item-active": a0,
  "p-carousel-item-start": a1,
  "p-carousel-item-end": a2
});
var _c15 = (a0) => ({
  "p-carousel-next-button": true,
  "p-disabled": a0
});
var _c16 = (a0) => ({
  "p-carousel-indicator": true,
  "p-carousel-indicator-active": a0
});
function Carousel_div_1_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function Carousel_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14);
    \u0275\u0275projection(1);
    \u0275\u0275template(2, Carousel_div_1_ng_container_2_Template, 1, 0, "ng-container", 15);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("ngTemplateOutlet", ctx_r1.headerTemplate);
  }
}
function Carousel_p_button_4_ng_template_1_ng_container_0_ChevronLeftIcon_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ChevronLeftIcon", 20);
  }
  if (rf & 2) {
    \u0275\u0275property("styleClass", "carousel-prev-icon");
  }
}
function Carousel_p_button_4_ng_template_1_ng_container_0_ChevronUpIcon_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ChevronUpIcon", 20);
  }
  if (rf & 2) {
    \u0275\u0275property("styleClass", "carousel-prev-icon");
  }
}
function Carousel_p_button_4_ng_template_1_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, Carousel_p_button_4_ng_template_1_ng_container_0_ChevronLeftIcon_1_Template, 1, 1, "ChevronLeftIcon", 19)(2, Carousel_p_button_4_ng_template_1_ng_container_0_ChevronUpIcon_2_Template, 1, 1, "ChevronUpIcon", 19);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isVertical());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.isVertical());
  }
}
function Carousel_p_button_4_ng_template_1_span_1_1_ng_template_0_Template(rf, ctx) {
}
function Carousel_p_button_4_ng_template_1_span_1_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, Carousel_p_button_4_ng_template_1_span_1_1_ng_template_0_Template, 0, 0, "ng-template");
  }
}
function Carousel_p_button_4_ng_template_1_span_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 21);
    \u0275\u0275template(1, Carousel_p_button_4_ng_template_1_span_1_1_Template, 1, 0, null, 15);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", ctx_r1.previousIconTemplate || ctx_r1._previousIconTemplate);
  }
}
function Carousel_p_button_4_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, Carousel_p_button_4_ng_template_1_ng_container_0_Template, 3, 2, "ng-container", 17)(1, Carousel_p_button_4_ng_template_1_span_1_Template, 2, 1, "span", 18);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngIf", !ctx_r1.previousIconTemplate && !ctx_r1._previousIconTemplate && !(ctx_r1.prevButtonProps == null ? null : ctx_r1.prevButtonProps.icon));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (ctx_r1.previousIconTemplate || ctx_r1._previousIconTemplate) && !(ctx_r1.prevButtonProps == null ? null : ctx_r1.prevButtonProps.icon));
  }
}
function Carousel_p_button_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 16);
    \u0275\u0275listener("click", function Carousel_p_button_4_Template_p_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.navBackward($event));
    });
    \u0275\u0275template(1, Carousel_p_button_4_ng_template_1_Template, 2, 2, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(5, _c11, ctx_r1.isBackwardNavDisabled()))("disabled", ctx_r1.isBackwardNavDisabled())("text", true)("buttonProps", ctx_r1.prevButtonProps);
    \u0275\u0275attribute("aria-label", ctx_r1.ariaPrevButtonLabel());
  }
}
function Carousel_div_8_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function Carousel_div_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275template(1, Carousel_div_8_ng_container_1_Template, 1, 0, "ng-container", 22);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r4 = ctx.$implicit;
    const index_r5 = ctx.index;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction3(6, _c12, ctx_r1.totalShiftedItems * -1 === ctx_r1.value.length, 0 === index_r5, ctx_r1.clonedItemsForStarting.length - 1 === index_r5));
    \u0275\u0275attribute("aria-hidden", !(ctx_r1.totalShiftedItems * -1 === ctx_r1.value.length))("aria-label", ctx_r1.ariaSlideNumber(index_r5))("aria-roledescription", ctx_r1.ariaSlideLabel());
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", ctx_r1.itemTemplate || ctx_r1._itemTemplate)("ngTemplateOutletContext", \u0275\u0275pureFunction1(10, _c13, item_r4));
  }
}
function Carousel_div_9_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function Carousel_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275template(1, Carousel_div_9_ng_container_1_Template, 1, 0, "ng-container", 22);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r6 = ctx.$implicit;
    const index_r7 = ctx.index;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction3(6, _c14, ctx_r1.firstIndex() <= index_r7 && ctx_r1.lastIndex() >= index_r7, ctx_r1.firstIndex() === index_r7, ctx_r1.lastIndex() === index_r7));
    \u0275\u0275attribute("aria-hidden", !(ctx_r1.totalShiftedItems * -1 === ctx_r1.value.length))("aria-label", ctx_r1.ariaSlideNumber(index_r7))("aria-roledescription", ctx_r1.ariaSlideLabel());
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", ctx_r1.itemTemplate || ctx_r1._itemTemplate)("ngTemplateOutletContext", \u0275\u0275pureFunction1(10, _c13, item_r6));
  }
}
function Carousel_div_10_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function Carousel_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275template(1, Carousel_div_10_ng_container_1_Template, 1, 0, "ng-container", 22);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r8 = ctx.$implicit;
    const index_r9 = ctx.index;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction3(3, _c12, ctx_r1.totalShiftedItems * -1 === ctx_r1.numVisible, 0 === index_r9, ctx_r1.clonedItemsForFinishing.length - 1 === index_r9));
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", ctx_r1.itemTemplate || ctx_r1._itemTemplate)("ngTemplateOutletContext", \u0275\u0275pureFunction1(7, _c13, item_r8));
  }
}
function Carousel_p_button_11_ng_template_1_ng_container_0_ChevronRightIcon_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ChevronRightIcon", 20);
  }
  if (rf & 2) {
    \u0275\u0275property("styleClass", "carousel-next-icon");
  }
}
function Carousel_p_button_11_ng_template_1_ng_container_0_ChevronDownIcon_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ChevronDownIcon", 20);
  }
  if (rf & 2) {
    \u0275\u0275property("styleClass", "carousel-next-icon");
  }
}
function Carousel_p_button_11_ng_template_1_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, Carousel_p_button_11_ng_template_1_ng_container_0_ChevronRightIcon_1_Template, 1, 1, "ChevronRightIcon", 19)(2, Carousel_p_button_11_ng_template_1_ng_container_0_ChevronDownIcon_2_Template, 1, 1, "ChevronDownIcon", 19);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isVertical());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.isVertical());
  }
}
function Carousel_p_button_11_ng_template_1_span_1_1_ng_template_0_Template(rf, ctx) {
}
function Carousel_p_button_11_ng_template_1_span_1_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, Carousel_p_button_11_ng_template_1_span_1_1_ng_template_0_Template, 0, 0, "ng-template");
  }
}
function Carousel_p_button_11_ng_template_1_span_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 25);
    \u0275\u0275template(1, Carousel_p_button_11_ng_template_1_span_1_1_Template, 1, 0, null, 15);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", ctx_r1.nextIconTemplate || ctx_r1._nextIconTemplate);
  }
}
function Carousel_p_button_11_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, Carousel_p_button_11_ng_template_1_ng_container_0_Template, 3, 2, "ng-container", 17)(1, Carousel_p_button_11_ng_template_1_span_1_Template, 2, 1, "span", 24);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngIf", !ctx_r1.nextIconTemplate && !ctx_r1._nextIconTemplate && !(ctx_r1.nextButtonProps == null ? null : ctx_r1.nextButtonProps.icon));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.nextIconTemplate || ctx_r1._nextIconTemplate && !(ctx_r1.nextButtonProps == null ? null : ctx_r1.nextButtonProps.icon));
  }
}
function Carousel_p_button_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 23);
    \u0275\u0275listener("click", function Carousel_p_button_11_Template_p_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.navForward($event));
    });
    \u0275\u0275template(1, Carousel_p_button_11_ng_template_1_Template, 2, 2, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(5, _c15, ctx_r1.isForwardNavDisabled()))("disabled", ctx_r1.isForwardNavDisabled())("buttonProps", ctx_r1.nextButtonProps)("text", true);
    \u0275\u0275attribute("aria-label", ctx_r1.ariaNextButtonLabel());
  }
}
function Carousel_ul_12_li_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li", 5)(1, "button", 27);
    \u0275\u0275listener("click", function Carousel_ul_12_li_2_Template_button_click_1_listener($event) {
      const i_r13 = \u0275\u0275restoreView(_r12).index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onDotClick($event, i_r13));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const i_r13 = ctx.index;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(9, _c16, ctx_r1._page === i_r13));
    \u0275\u0275attribute("data-pc-section", "indicator");
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r1.indicatorStyleClass);
    \u0275\u0275property("ngClass", "p-carousel-indicator-button")("ngStyle", ctx_r1.indicatorStyle)("tabindex", ctx_r1._page === i_r13 ? 0 : -1);
    \u0275\u0275attribute("aria-label", ctx_r1.ariaPageLabel(i_r13 + 1))("aria-current", ctx_r1._page === i_r13 ? "page" : void 0);
  }
}
function Carousel_ul_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ul", 26, 2);
    \u0275\u0275listener("keydown", function Carousel_ul_12_Template_ul_keydown_0_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onIndicatorKeydown($event));
    });
    \u0275\u0275template(2, Carousel_ul_12_li_2_Template, 2, 11, "li", 10);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r1.indicatorsContentClass);
    \u0275\u0275property("ngClass", "p-carousel-indicator-list")("ngStyle", ctx_r1.indicatorsContentStyle);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r1.totalDotsArray());
  }
}
function Carousel_div_13_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function Carousel_div_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 28);
    \u0275\u0275projection(1, 1);
    \u0275\u0275template(2, Carousel_div_13_ng_container_2_Template, 1, 0, "ng-container", 15);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("ngTemplateOutlet", ctx_r1.footerTemplate || ctx_r1._footerTemplate);
  }
}
var theme = ({
  dt
}) => `
.p-carousel {
    display: flex;
    flex-direction: column;
}

.p-carousel-content-container {
    display: flex;
    flex-direction: column;
    overflow: auto;
}

.p-carousel-content {
    display: flex;
    flex-direction: row;
    gap: ${dt("carousel.content.gap")};
}

.p-carousel-content:dir(rtl) {
    flex-direction: row-reverse;
}

.p-carousel-viewport {
    overflow: hidden;
    width: 100%;
}

.p-carousel-item-list {
    display: flex;
    flex-direction: row;
}

.p-carousel-item-list:dir(rtl) {
    flex-direction: row-reverse;
}

.p-carousel-prev-button,
.p-carousel-next-button {
    align-self: center;
    flex-shrink: 0;
}

.p-carousel-indicator-list {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    padding: ${dt("carousel.indicator.list.padding")};
    gap: ${dt("carousel.indicator.list.gap")};
    margin: 0;
    list-style: none;
}

.p-carousel-indicator-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${dt("carousel.indicator.background")};
    width: ${dt("carousel.indicator.width")};
    height: ${dt("carousel.indicator.height")};
    border: 0 none;
    transition: background ${dt("carousel.transition.duration")}, color ${dt("carousel.transition.duration")}, outline-color ${dt("carousel.transition.duration")}, box-shadow ${dt("carousel.transition.duration")};
    outline-color: transparent;
    border-radius: ${dt("carousel.indicator.border.radius")};
    padding: 0;
    margin: 0;
    user-select: none;
    cursor: pointer;
}

.p-carousel-indicator-button:focus-visible {
    box-shadow: ${dt("carousel.indicator.focus.ring.shadow")};
    outline: ${dt("carousel.indicator.focus.ring.width")} ${dt("carousel.indicator.focus.ring.style")} ${dt("carousel.indicator.focus.ring.color")};
    outline-offset: ${dt("carousel.indicator.focus.ring.offset")};
}

.p-carousel-indicator-button:hover {
    background: ${dt("carousel.indicator.hover.background")};
}

.p-carousel-indicator-active .p-carousel-indicator-button {
    background: ${dt("carousel.indicator.active.background")};
}

.p-carousel-vertical .p-carousel-content {
    flex-direction: column;
}

.p-carousel-vertical .p-carousel-item-list {
    flex-direction: column;
    height: 100%;
}

.p-items-hidden .p-carousel-item {
    visibility: hidden;
}

.p-items-hidden .p-carousel-item.p-carousel-item-active {
    visibility: visible;
}
`;
var classes = {
  root: ({
    instance
  }) => ["p-carousel p-component", {
    "p-carousel-vertical": instance.isVertical(),
    "p-carousel-horizontal": !instance.isVertical()
  }],
  header: "p-carousel-header",
  contentContainer: "p-carousel-content-container",
  content: "p-carousel-content",
  pcPrevButton: ({
    instance
  }) => ["p-carousel-prev-button", {
    "p-disabled": instance.backwardIsDisabled
  }],
  viewport: "p-carousel-viewport",
  itemList: "p-carousel-item-list",
  itemClone: ({
    index,
    value,
    totalShiftedItems,
    d_numVisible
  }) => ["p-carousel-item p-carousel-item-clone", {
    "p-carousel-item-active": totalShiftedItems * -1 === value.length + d_numVisible,
    "p-carousel-item-start": index === 0,
    "p-carousel-item-end": value.slice(-1 * d_numVisible).length - 1 === index
  }],
  item: ({
    instance,
    index
  }) => ["p-carousel-item", {
    "p-carousel-item-active": instance.firstIndex() <= index && instance.lastIndex() >= index,
    "p-carousel-item-start": instance.firstIndex() === index,
    "p-carousel-item-end": instance.lastIndex() === index
  }],
  pcNextButton: ({
    instance
  }) => ["p-carousel-next-button", {
    "p-disabled": instance.forwardIsDisabled
  }],
  indicatorList: "p-carousel-indicator-list",
  indicator: ({
    instance,
    index
  }) => ["p-carousel-indicator", {
    "p-carousel-indicator-active": instance.d_page === index
  }],
  indicatorButton: "p-carousel-indicator-button",
  footer: "p-carousel-footer"
};
var CarouselStyle = class _CarouselStyle extends BaseStyle {
  name = "carousel";
  theme = theme;
  classes = classes;
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275CarouselStyle_BaseFactory;
    return function CarouselStyle_Factory(__ngFactoryType__) {
      return (\u0275CarouselStyle_BaseFactory || (\u0275CarouselStyle_BaseFactory = \u0275\u0275getInheritedFactory(_CarouselStyle)))(__ngFactoryType__ || _CarouselStyle);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _CarouselStyle,
    factory: _CarouselStyle.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CarouselStyle, [{
    type: Injectable
  }], null, null);
})();
var CarouselClasses;
(function(CarouselClasses2) {
  CarouselClasses2["root"] = "p-carousel";
  CarouselClasses2["header"] = "p-carousel-header";
  CarouselClasses2["contentContainer"] = "p-carousel-content-container";
  CarouselClasses2["content"] = "p-carousel-content";
  CarouselClasses2["pcPrevButton"] = "p-carousel-prev-button";
  CarouselClasses2["viewport"] = "p-carousel-viewport";
  CarouselClasses2["itemList"] = "p-carousel-item-list";
  CarouselClasses2["itemClone"] = "p-carousel-item-clone";
  CarouselClasses2["item"] = "p-carousel-item";
  CarouselClasses2["pcNextButton"] = "p-carousel-next-button";
  CarouselClasses2["indicatorList"] = "p-carousel-indicator-list";
  CarouselClasses2["indicator"] = "p-carousel-indicator";
  CarouselClasses2["indicatorButton"] = "p-carousel-indicator-button";
  CarouselClasses2["footer"] = "p-carousel-footer";
})(CarouselClasses || (CarouselClasses = {}));
var Carousel = class _Carousel extends BaseComponent {
  el;
  zone;
  /**
   * Index of the first item.
   * @defaultValue 0
   * @group Props
   */
  get page() {
    return this._page;
  }
  set page(val) {
    if (this.isCreated && val !== this._page) {
      if (this.autoplayInterval) {
        this.stopAutoplay();
      }
      if (val > this._page && val <= this.totalDots() - 1) {
        this.step(-1, val);
      } else if (val < this._page) {
        this.step(1, val);
      }
    }
    this._page = val;
  }
  /**
   * Number of items per page.
   * @defaultValue 1
   * @group Props
   */
  get numVisible() {
    return this._numVisible;
  }
  set numVisible(val) {
    this._numVisible = val;
  }
  /**
   * Number of items to scroll.
   * @defaultValue 1
   * @group Props
   */
  get numScroll() {
    return this._numVisible;
  }
  set numScroll(val) {
    this._numScroll = val;
  }
  /**
   * An array of options for responsive design.
   * @see {CarouselResponsiveOptions}
   * @group Props
   */
  responsiveOptions;
  /**
   * Specifies the layout of the component.
   * @group Props
   */
  orientation = "horizontal";
  /**
   * Height of the viewport in vertical layout.
   * @group Props
   */
  verticalViewPortHeight = "300px";
  /**
   * Style class of main content.
   * @group Props
   */
  contentClass = "";
  /**
   * Style class of the indicator items.
   * @group Props
   */
  indicatorsContentClass = "";
  /**
   * Inline style of the indicator items.
   * @group Props
   */
  indicatorsContentStyle;
  /**
   * Style class of the indicators.
   * @group Props
   */
  indicatorStyleClass = "";
  /**
   * Style of the indicators.
   * @group Props
   */
  indicatorStyle;
  /**
   * An array of objects to display.
   * @defaultValue null
   * @group Props
   */
  get value() {
    return this._value;
  }
  set value(val) {
    this._value = val;
  }
  /**
   * Defines if scrolling would be infinite.
   * @group Props
   */
  circular = false;
  /**
   * Whether to display indicator container.
   * @group Props
   */
  showIndicators = true;
  /**
   * Whether to display navigation buttons in container.
   * @group Props
   */
  showNavigators = true;
  /**
   * Time in milliseconds to scroll items automatically.
   * @group Props
   */
  autoplayInterval = 0;
  /**
   * Inline style of the component.
   * @group Props
   */
  style;
  /**
   * Style class of the viewport container.
   * @group Props
   */
  styleClass;
  /**
   * Used to pass all properties of the ButtonProps to the Button component.
   * @group Props
   */
  prevButtonProps = {
    severity: "secondary",
    text: true,
    rounded: true
  };
  /**
   * Used to pass all properties of the ButtonProps to the Button component.
   * @group Props
   */
  nextButtonProps = {
    severity: "secondary",
    text: true,
    rounded: true
  };
  /**
   * Callback to invoke after scroll.
   * @param {CarouselPageEvent} event - Custom page event.
   * @group Emits
   */
  onPage = new EventEmitter();
  itemsContainer;
  indicatorContent;
  headerFacet;
  footerFacet;
  _numVisible = 1;
  _numScroll = 1;
  _oldNumScroll = 0;
  prevState = {
    numScroll: 0,
    numVisible: 0,
    value: []
  };
  defaultNumScroll = 1;
  defaultNumVisible = 1;
  _page = 0;
  _value;
  carouselStyle;
  id;
  totalShiftedItems;
  isRemainingItemsAdded = false;
  animationTimeout;
  translateTimeout;
  remainingItems = 0;
  _items;
  startPos;
  documentResizeListener;
  clonedItemsForStarting;
  clonedItemsForFinishing;
  allowAutoplay;
  interval;
  isCreated;
  swipeThreshold = 20;
  /**
   * Template for carousel items.
   * @group Templates
   */
  itemTemplate;
  /**
   * Template for the carousel header.
   * @group Templates
   */
  headerTemplate;
  /**
   * Template for the carousel footer.
   * @group Templates
   */
  footerTemplate;
  /**
   * Template for the previous button icon.
   * @group Templates
   */
  previousIconTemplate;
  /**
   * Template for the next button icon.
   * @group Templates
   */
  nextIconTemplate;
  _itemTemplate;
  _headerTemplate;
  _footerTemplate;
  _previousIconTemplate;
  _nextIconTemplate;
  window;
  _componentStyle = inject(CarouselStyle);
  constructor(el, zone) {
    super();
    this.el = el;
    this.zone = zone;
    this.totalShiftedItems = this.page * this.numScroll * -1;
    this.window = this.document.defaultView;
  }
  ngOnChanges(simpleChange) {
    if (isPlatformBrowser(this.platformId)) {
      if (simpleChange.value) {
        if (this.circular && this._value) {
          this.setCloneItems();
        }
      }
      if (this.isCreated) {
        if (simpleChange.numVisible) {
          if (this.responsiveOptions) {
            this.defaultNumVisible = this.numVisible;
          }
          if (this.isCircular()) {
            this.setCloneItems();
          }
          this.createStyle();
          this.calculatePosition();
        }
        if (simpleChange.numScroll) {
          if (this.responsiveOptions) {
            this.defaultNumScroll = this.numScroll;
          }
        }
      }
    }
    this.cd.markForCheck();
  }
  templates;
  ngAfterContentInit() {
    this.id = uuid("pn_id_");
    if (isPlatformBrowser(this.platformId)) {
      this.allowAutoplay = !!this.autoplayInterval;
      if (this.circular) {
        this.setCloneItems();
      }
      if (this.responsiveOptions) {
        this.defaultNumScroll = this._numScroll;
        this.defaultNumVisible = this._numVisible;
      }
      this.createStyle();
      this.calculatePosition();
      if (this.responsiveOptions) {
        this.bindDocumentListeners();
      }
    }
    this.templates?.forEach((item) => {
      switch (item.getType()) {
        case "item":
          this._itemTemplate = item.template;
          break;
        case "header":
          this._headerTemplate = item.template;
          break;
        case "footer":
          this._footerTemplate = item.template;
          break;
        case "previousicon":
          this._previousIconTemplate = item.template;
          break;
        case "nexticon":
          this._nextIconTemplate = item.template;
          break;
        default:
          this._itemTemplate = item.template;
          break;
      }
    });
    this.cd.detectChanges();
  }
  ngAfterContentChecked() {
    if (isPlatformBrowser(this.platformId)) {
      const isCircular = this.isCircular();
      let totalShiftedItems = this.totalShiftedItems;
      if (this.value && this.itemsContainer && (this.prevState.numScroll !== this._numScroll || this.prevState.numVisible !== this._numVisible || this.prevState.value.length !== this.value.length)) {
        if (this.autoplayInterval) {
          this.stopAutoplay(false);
        }
        this.remainingItems = (this.value.length - this._numVisible) % this._numScroll;
        let page = this._page;
        if (this.totalDots() !== 0 && page >= this.totalDots()) {
          page = this.totalDots() - 1;
          this._page = page;
          this.onPage.emit({
            page: this.page
          });
        }
        totalShiftedItems = page * this._numScroll * -1;
        if (isCircular) {
          totalShiftedItems -= this._numVisible;
        }
        if (page === this.totalDots() - 1 && this.remainingItems > 0) {
          totalShiftedItems += -1 * this.remainingItems + this._numScroll;
          this.isRemainingItemsAdded = true;
        } else {
          this.isRemainingItemsAdded = false;
        }
        if (totalShiftedItems !== this.totalShiftedItems) {
          this.totalShiftedItems = totalShiftedItems;
        }
        this._oldNumScroll = this._numScroll;
        this.prevState.numScroll = this._numScroll;
        this.prevState.numVisible = this._numVisible;
        this.prevState.value = [...this._value];
        if (this.totalDots() > 0 && this.itemsContainer.nativeElement) {
          this.itemsContainer.nativeElement.style.transform = this.isVertical() ? `translate3d(0, ${totalShiftedItems * (100 / this._numVisible)}%, 0)` : `translate3d(${totalShiftedItems * (100 / this._numVisible)}%, 0, 0)`;
        }
        this.isCreated = true;
        if (this.autoplayInterval && this.isAutoplay()) {
          this.startAutoplay();
        }
      }
      if (isCircular) {
        if (this.page === 0) {
          totalShiftedItems = -1 * this._numVisible;
        } else if (totalShiftedItems === 0) {
          totalShiftedItems = -1 * this.value.length;
          if (this.remainingItems > 0) {
            this.isRemainingItemsAdded = true;
          }
        }
        if (totalShiftedItems !== this.totalShiftedItems) {
          this.totalShiftedItems = totalShiftedItems;
        }
      }
    }
  }
  createStyle() {
    if (!this.carouselStyle) {
      this.carouselStyle = this.renderer.createElement("style");
      this.carouselStyle.type = "text/css";
      setAttribute(this.carouselStyle, "nonce", this.config?.csp()?.nonce);
      this.renderer.appendChild(this.document.head, this.carouselStyle);
    }
    let innerHTML = `
            #${this.id} .p-carousel-item {
				flex: 1 0 ${100 / this.numVisible}%
			}
        `;
    if (this.responsiveOptions) {
      this.responsiveOptions.sort((data1, data2) => {
        const value1 = data1.breakpoint;
        const value2 = data2.breakpoint;
        let result = null;
        if (value1 == null && value2 != null) result = -1;
        else if (value1 != null && value2 == null) result = 1;
        else if (value1 == null && value2 == null) result = 0;
        else if (typeof value1 === "string" && typeof value2 === "string") result = value1.localeCompare(value2, void 0, {
          numeric: true
        });
        else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
        return -1 * result;
      });
      for (let i = 0; i < this.responsiveOptions.length; i++) {
        let res = this.responsiveOptions[i];
        innerHTML += `
                    @media screen and (max-width: ${res.breakpoint}) {
                        #${this.id} .p-carousel-item {
                            flex: 1 0 ${100 / res.numVisible}%
                        }
                    }
                `;
      }
    }
    this.carouselStyle.innerHTML = innerHTML;
  }
  calculatePosition() {
    if (this.responsiveOptions) {
      let matchedResponsiveData = {
        numVisible: this.defaultNumVisible,
        numScroll: this.defaultNumScroll
      };
      if (typeof window !== "undefined") {
        let windowWidth = window.innerWidth;
        for (let i = 0; i < this.responsiveOptions.length; i++) {
          let res = this.responsiveOptions[i];
          if (parseInt(res.breakpoint, 10) >= windowWidth) {
            matchedResponsiveData = res;
          }
        }
      }
      if (this._numScroll !== matchedResponsiveData.numScroll) {
        let page = this._page;
        page = Math.floor(page * this._numScroll / matchedResponsiveData.numScroll);
        let totalShiftedItems = matchedResponsiveData.numScroll * this.page * -1;
        if (this.isCircular()) {
          totalShiftedItems -= matchedResponsiveData.numVisible;
        }
        this.totalShiftedItems = totalShiftedItems;
        this._numScroll = matchedResponsiveData.numScroll;
        this._page = page;
        this.onPage.emit({
          page: this.page
        });
      }
      if (this._numVisible !== matchedResponsiveData.numVisible) {
        this._numVisible = matchedResponsiveData.numVisible;
        this.setCloneItems();
      }
      this.cd.markForCheck();
    }
  }
  setCloneItems() {
    this.clonedItemsForStarting = [];
    this.clonedItemsForFinishing = [];
    if (this.isCircular()) {
      this.clonedItemsForStarting.push(...this.value.slice(-1 * this._numVisible));
      this.clonedItemsForFinishing.push(...this.value.slice(0, this._numVisible));
    }
  }
  firstIndex() {
    return this.isCircular() ? -1 * (this.totalShiftedItems + this.numVisible) : this.totalShiftedItems * -1;
  }
  lastIndex() {
    return this.firstIndex() + this.numVisible - 1;
  }
  totalDots() {
    return this.value?.length ? Math.ceil((this.value.length - this._numVisible) / this._numScroll) + 1 : 0;
  }
  totalDotsArray() {
    const totalDots = this.totalDots();
    return totalDots <= 0 ? [] : Array(totalDots).fill(0);
  }
  isVertical() {
    return this.orientation === "vertical";
  }
  isCircular() {
    return this.circular && this.value && this.value.length >= this.numVisible;
  }
  isAutoplay() {
    return this.autoplayInterval && this.allowAutoplay;
  }
  isForwardNavDisabled() {
    return this.isEmpty() || this._page >= this.totalDots() - 1 && !this.isCircular();
  }
  isBackwardNavDisabled() {
    return this.isEmpty() || this._page <= 0 && !this.isCircular();
  }
  isEmpty() {
    return !this.value || this.value.length === 0;
  }
  navForward(e, index) {
    if (this.isCircular() || this._page < this.totalDots() - 1) {
      this.step(-1, index);
    }
    if (this.autoplayInterval) {
      this.stopAutoplay();
    }
    if (e && e.cancelable) {
      e.preventDefault();
    }
  }
  navBackward(e, index) {
    if (this.isCircular() || this._page !== 0) {
      this.step(1, index);
    }
    if (this.autoplayInterval) {
      this.stopAutoplay();
    }
    if (e && e.cancelable) {
      e.preventDefault();
    }
  }
  onDotClick(e, index) {
    let page = this._page;
    if (this.autoplayInterval) {
      this.stopAutoplay();
    }
    if (index > page) {
      this.navForward(e, index);
    } else if (index < page) {
      this.navBackward(e, index);
    }
  }
  onIndicatorKeydown(event) {
    switch (event.code) {
      case "ArrowRight":
        this.onRightKey();
        break;
      case "ArrowLeft":
        this.onLeftKey();
        break;
    }
  }
  onRightKey() {
    const indicators = [...find(this.indicatorContent.nativeElement, '[data-pc-section="indicator"]')];
    const activeIndex = this.findFocusedIndicatorIndex();
    this.changedFocusedIndicator(activeIndex, activeIndex + 1 === indicators.length ? indicators.length - 1 : activeIndex + 1);
  }
  onLeftKey() {
    const activeIndex = this.findFocusedIndicatorIndex();
    this.changedFocusedIndicator(activeIndex, activeIndex - 1 <= 0 ? 0 : activeIndex - 1);
  }
  onHomeKey() {
    const activeIndex = this.findFocusedIndicatorIndex();
    this.changedFocusedIndicator(activeIndex, 0);
  }
  onEndKey() {
    const indicators = [...find(this.indicatorContent.nativeElement, '[data-pc-section="indicator"]r')];
    const activeIndex = this.findFocusedIndicatorIndex();
    this.changedFocusedIndicator(activeIndex, indicators.length - 1);
  }
  onTabKey() {
    const indicators = [...find(this.indicatorContent.nativeElement, '[data-pc-section="indicator"]')];
    const highlightedIndex = indicators.findIndex((ind) => getAttribute(ind, "data-p-highlight") === true);
    const activeIndicator = findSingle(this.indicatorContent.nativeElement, '[data-pc-section="indicator"] > button[tabindex="0"]');
    const activeIndex = indicators.findIndex((ind) => ind === activeIndicator.parentElement);
    indicators[activeIndex].children[0].tabIndex = "-1";
    indicators[highlightedIndex].children[0].tabIndex = "0";
  }
  findFocusedIndicatorIndex() {
    const indicators = [...find(this.indicatorContent.nativeElement, '[data-pc-section="indicator"]')];
    const activeIndicator = findSingle(this.indicatorContent.nativeElement, '[data-pc-section="indicator"] > button[tabindex="0"]');
    return indicators.findIndex((ind) => ind === activeIndicator.parentElement);
  }
  changedFocusedIndicator(prevInd, nextInd) {
    const indicators = [...find(this.indicatorContent.nativeElement, '[data-pc-section="indicator"]')];
    indicators[prevInd].children[0].tabIndex = "-1";
    indicators[nextInd].children[0].tabIndex = "0";
    indicators[nextInd].children[0].focus();
  }
  step(dir, page) {
    let totalShiftedItems = this.totalShiftedItems;
    const isCircular = this.isCircular();
    if (page != null) {
      totalShiftedItems = this._numScroll * page * -1;
      if (isCircular) {
        totalShiftedItems -= this._numVisible;
      }
      this.isRemainingItemsAdded = false;
    } else {
      totalShiftedItems += this._numScroll * dir;
      if (this.isRemainingItemsAdded) {
        totalShiftedItems += this.remainingItems - this._numScroll * dir;
        this.isRemainingItemsAdded = false;
      }
      let originalShiftedItems = isCircular ? totalShiftedItems + this._numVisible : totalShiftedItems;
      page = Math.abs(Math.floor(originalShiftedItems / this._numScroll));
    }
    if (isCircular && this.page === this.totalDots() - 1 && dir === -1) {
      totalShiftedItems = -1 * (this.value.length + this._numVisible);
      page = 0;
    } else if (isCircular && this.page === 0 && dir === 1) {
      totalShiftedItems = 0;
      page = this.totalDots() - 1;
    } else if (page === this.totalDots() - 1 && this.remainingItems > 0) {
      totalShiftedItems += this.remainingItems * -1 - this._numScroll * dir;
      this.isRemainingItemsAdded = true;
    }
    if (this.itemsContainer) {
      this.itemsContainer.nativeElement.style.transform = this.isVertical() ? `translate3d(0, ${totalShiftedItems * (100 / this._numVisible)}%, 0)` : `translate3d(${totalShiftedItems * (100 / this._numVisible)}%, 0, 0)`;
      this.itemsContainer.nativeElement.style.transition = "transform 500ms ease 0s";
    }
    this.totalShiftedItems = totalShiftedItems;
    this._page = page;
    this.onPage.emit({
      page: this.page
    });
    this.cd.markForCheck();
  }
  startAutoplay() {
    this.interval = setInterval(() => {
      if (this.totalDots() > 0) {
        if (this.page === this.totalDots() - 1) {
          this.step(-1, 0);
        } else {
          this.step(-1, this.page + 1);
        }
      }
    }, this.autoplayInterval);
    this.allowAutoplay = true;
    this.cd.markForCheck();
  }
  stopAutoplay(changeAllow = true) {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = void 0;
      if (changeAllow) {
        this.allowAutoplay = false;
      }
    }
    this.cd.markForCheck();
  }
  isPlaying() {
    return !!this.interval;
  }
  onTransitionEnd() {
    if (this.itemsContainer) {
      this.itemsContainer.nativeElement.style.transition = "";
      if ((this.page === 0 || this.page === this.totalDots() - 1) && this.isCircular()) {
        this.itemsContainer.nativeElement.style.transform = this.isVertical() ? `translate3d(0, ${this.totalShiftedItems * (100 / this._numVisible)}%, 0)` : `translate3d(${this.totalShiftedItems * (100 / this._numVisible)}%, 0, 0)`;
      }
    }
  }
  onTouchStart(e) {
    let touchobj = e.changedTouches[0];
    this.startPos = {
      x: touchobj.pageX,
      y: touchobj.pageY
    };
  }
  onTouchMove(e) {
    if (e.cancelable) {
      e.preventDefault();
    }
  }
  onTouchEnd(e) {
    let touchobj = e.changedTouches[0];
    if (this.isVertical()) {
      this.changePageOnTouch(e, touchobj.pageY - this.startPos.y);
    } else {
      this.changePageOnTouch(e, touchobj.pageX - this.startPos.x);
    }
  }
  changePageOnTouch(e, diff) {
    if (Math.abs(diff) > this.swipeThreshold) {
      if (diff < 0) {
        this.navForward(e);
      } else {
        this.navBackward(e);
      }
    }
  }
  ariaPrevButtonLabel() {
    return this.config.translation.aria ? this.config.translation.aria.prevPageLabel : void 0;
  }
  ariaSlideLabel() {
    return this.config.translation.aria ? this.config.translation.aria.slide : void 0;
  }
  ariaNextButtonLabel() {
    return this.config.translation.aria ? this.config.translation.aria.nextPageLabel : void 0;
  }
  ariaSlideNumber(value) {
    return this.config.translation.aria ? this.config.translation.aria.slideNumber.replace(/{slideNumber}/g, value) : void 0;
  }
  ariaPageLabel(value) {
    return this.config.translation.aria ? this.config.translation.aria.pageLabel.replace(/{page}/g, value) : void 0;
  }
  bindDocumentListeners() {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.documentResizeListener) {
        this.documentResizeListener = this.renderer.listen(this.window, "resize", (event) => {
          this.calculatePosition();
        });
      }
    }
  }
  unbindDocumentListeners() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.documentResizeListener) {
        this.documentResizeListener();
        this.documentResizeListener = null;
      }
    }
  }
  ngOnDestroy() {
    if (this.responsiveOptions) {
      this.unbindDocumentListeners();
    }
    if (this.autoplayInterval) {
      this.stopAutoplay();
    }
  }
  static \u0275fac = function Carousel_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Carousel)(\u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(NgZone));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _Carousel,
    selectors: [["p-carousel"]],
    contentQueries: function Carousel_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        \u0275\u0275contentQuery(dirIndex, Header, 5);
        \u0275\u0275contentQuery(dirIndex, Footer, 5);
        \u0275\u0275contentQuery(dirIndex, _c0, 4);
        \u0275\u0275contentQuery(dirIndex, _c1, 4);
        \u0275\u0275contentQuery(dirIndex, _c2, 4);
        \u0275\u0275contentQuery(dirIndex, _c3, 4);
        \u0275\u0275contentQuery(dirIndex, _c4, 4);
        \u0275\u0275contentQuery(dirIndex, PrimeTemplate, 4);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.headerFacet = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.footerFacet = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.itemTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.headerTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.footerTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.previousIconTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.nextIconTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.templates = _t);
      }
    },
    viewQuery: function Carousel_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c5, 5);
        \u0275\u0275viewQuery(_c6, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.itemsContainer = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.indicatorContent = _t.first);
      }
    },
    inputs: {
      page: "page",
      numVisible: "numVisible",
      numScroll: "numScroll",
      responsiveOptions: "responsiveOptions",
      orientation: "orientation",
      verticalViewPortHeight: "verticalViewPortHeight",
      contentClass: "contentClass",
      indicatorsContentClass: "indicatorsContentClass",
      indicatorsContentStyle: "indicatorsContentStyle",
      indicatorStyleClass: "indicatorStyleClass",
      indicatorStyle: "indicatorStyle",
      value: "value",
      circular: [2, "circular", "circular", booleanAttribute],
      showIndicators: [2, "showIndicators", "showIndicators", booleanAttribute],
      showNavigators: [2, "showNavigators", "showNavigators", booleanAttribute],
      autoplayInterval: [2, "autoplayInterval", "autoplayInterval", numberAttribute],
      style: "style",
      styleClass: "styleClass",
      prevButtonProps: "prevButtonProps",
      nextButtonProps: "nextButtonProps"
    },
    outputs: {
      onPage: "onPage"
    },
    features: [\u0275\u0275ProvidersFeature([CarouselStyle]), \u0275\u0275InheritDefinitionFeature, \u0275\u0275NgOnChangesFeature],
    ngContentSelectors: _c8,
    decls: 14,
    vars: 23,
    consts: [["itemsContainer", ""], ["icon", ""], ["indicatorContent", ""], ["role", "region", 3, "ngClass", "ngStyle"], ["class", "p-carousel-header", 4, "ngIf"], [3, "ngClass"], [1, "p-carousel-content"], [3, "ngClass", "disabled", "text", "buttonProps", "click", 4, "ngIf"], [1, "p-carousel-viewport", 3, "touchend", "touchstart", "touchmove", "ngStyle"], [1, "p-carousel-item-list", 3, "transitionend"], [3, "ngClass", 4, "ngFor", "ngForOf"], ["type", "button", 3, "ngClass", "disabled", "buttonProps", "text", "click", 4, "ngIf"], [3, "ngClass", "class", "ngStyle", "keydown", 4, "ngIf"], ["class", "p-carousel-footer", 4, "ngIf"], [1, "p-carousel-header"], [4, "ngTemplateOutlet"], [3, "click", "ngClass", "disabled", "text", "buttonProps"], [4, "ngIf"], ["class", "p-carousel-prev-icon", 4, "ngIf"], [3, "styleClass", 4, "ngIf"], [3, "styleClass"], [1, "p-carousel-prev-icon"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], ["type", "button", 3, "click", "ngClass", "disabled", "buttonProps", "text"], ["class", "next", 4, "ngIf"], [1, "next"], [3, "keydown", "ngClass", "ngStyle"], ["type", "button", 3, "click", "ngClass", "ngStyle", "tabindex"], [1, "p-carousel-footer"]],
    template: function Carousel_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = \u0275\u0275getCurrentView();
        \u0275\u0275projectionDef(_c7);
        \u0275\u0275elementStart(0, "div", 3);
        \u0275\u0275template(1, Carousel_div_1_Template, 3, 1, "div", 4);
        \u0275\u0275elementStart(2, "div", 5)(3, "div", 6);
        \u0275\u0275template(4, Carousel_p_button_4_Template, 3, 7, "p-button", 7);
        \u0275\u0275elementStart(5, "div", 8);
        \u0275\u0275listener("touchend", function Carousel_Template_div_touchend_5_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.onTouchEnd($event));
        })("touchstart", function Carousel_Template_div_touchstart_5_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.onTouchStart($event));
        })("touchmove", function Carousel_Template_div_touchmove_5_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.onTouchMove($event));
        });
        \u0275\u0275elementStart(6, "div", 9, 0);
        \u0275\u0275listener("transitionend", function Carousel_Template_div_transitionend_6_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.onTransitionEnd());
        });
        \u0275\u0275template(8, Carousel_div_8_Template, 2, 12, "div", 10)(9, Carousel_div_9_Template, 2, 12, "div", 10)(10, Carousel_div_10_Template, 2, 9, "div", 10);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(11, Carousel_p_button_11_Template, 3, 7, "p-button", 11);
        \u0275\u0275elementEnd();
        \u0275\u0275template(12, Carousel_ul_12_Template, 3, 5, "ul", 12);
        \u0275\u0275elementEnd();
        \u0275\u0275template(13, Carousel_div_13_Template, 3, 1, "div", 13);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275classMap(ctx.styleClass);
        \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(18, _c9, ctx.isVertical(), !ctx.isVertical()))("ngStyle", ctx.style);
        \u0275\u0275attribute("id", ctx.id);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.headerFacet || ctx.headerTemplate);
        \u0275\u0275advance();
        \u0275\u0275classMap(ctx.contentClass);
        \u0275\u0275property("ngClass", "p-carousel-content-container");
        \u0275\u0275advance();
        \u0275\u0275attribute("aria-live", ctx.allowAutoplay ? "polite" : "off");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showNavigators);
        \u0275\u0275advance();
        \u0275\u0275property("ngStyle", \u0275\u0275pureFunction1(21, _c10, ctx.isVertical() ? ctx.verticalViewPortHeight : "auto"));
        \u0275\u0275advance(3);
        \u0275\u0275property("ngForOf", ctx.clonedItemsForStarting);
        \u0275\u0275advance();
        \u0275\u0275property("ngForOf", ctx.value);
        \u0275\u0275advance();
        \u0275\u0275property("ngForOf", ctx.clonedItemsForFinishing);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showNavigators);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showIndicators);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.footerFacet || ctx.footerTemplate || ctx._footerTemplate);
      }
    },
    dependencies: [CommonModule, NgClass, NgForOf, NgIf, NgTemplateOutlet, NgStyle, ChevronRightIcon, ButtonModule, Button, ChevronLeftIcon, ChevronDownIcon, ChevronUpIcon, SharedModule],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Carousel, [{
    type: Component,
    args: [{
      selector: "p-carousel",
      standalone: true,
      imports: [CommonModule, ChevronRightIcon, ButtonModule, ChevronLeftIcon, ChevronDownIcon, ChevronUpIcon, SharedModule],
      template: `
        <div [attr.id]="id" [ngClass]="{ 'p-carousel p-component': true, 'p-carousel-vertical': isVertical(), 'p-carousel-horizontal': !isVertical() }" [ngStyle]="style" [class]="styleClass" role="region">
            <div class="p-carousel-header" *ngIf="headerFacet || headerTemplate">
                <ng-content select="p-header"></ng-content>
                <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
            </div>
            <div [class]="contentClass" [ngClass]="'p-carousel-content-container'">
                <div class="p-carousel-content" [attr.aria-live]="allowAutoplay ? 'polite' : 'off'">
                    <p-button
                        *ngIf="showNavigators"
                        [ngClass]="{ 'p-carousel-prev-button': true, 'p-disabled': isBackwardNavDisabled() }"
                        [disabled]="isBackwardNavDisabled()"
                        [attr.aria-label]="ariaPrevButtonLabel()"
                        (click)="navBackward($event)"
                        [text]="true"
                        [buttonProps]="prevButtonProps"
                    >
                        <ng-template #icon>
                            <ng-container *ngIf="!previousIconTemplate && !_previousIconTemplate && !prevButtonProps?.icon">
                                <ChevronLeftIcon *ngIf="!isVertical()" [styleClass]="'carousel-prev-icon'" />
                                <ChevronUpIcon *ngIf="isVertical()" [styleClass]="'carousel-prev-icon'" />
                            </ng-container>
                            <span *ngIf="(previousIconTemplate || _previousIconTemplate) && !prevButtonProps?.icon" class="p-carousel-prev-icon">
                                <ng-template *ngTemplateOutlet="previousIconTemplate || _previousIconTemplate"></ng-template>
                            </span>
                        </ng-template>
                    </p-button>
                    <div class="p-carousel-viewport" [ngStyle]="{ height: isVertical() ? verticalViewPortHeight : 'auto' }" (touchend)="onTouchEnd($event)" (touchstart)="onTouchStart($event)" (touchmove)="onTouchMove($event)">
                        <div #itemsContainer class="p-carousel-item-list" (transitionend)="onTransitionEnd()">
                            <div
                                *ngFor="let item of clonedItemsForStarting; let index = index"
                                [ngClass]="{
                                    'p-carousel-item p-carousel-item-clone': true,
                                    'p-carousel-item-active': totalShiftedItems * -1 === value.length,
                                    'p-carousel-item-start': 0 === index,
                                    'p-carousel-item-end': clonedItemsForStarting.length - 1 === index
                                }"
                                [attr.aria-hidden]="!(totalShiftedItems * -1 === value.length)"
                                [attr.aria-label]="ariaSlideNumber(index)"
                                [attr.aria-roledescription]="ariaSlideLabel()"
                            >
                                <ng-container *ngTemplateOutlet="itemTemplate || _itemTemplate; context: { $implicit: item }"></ng-container>
                            </div>
                            <div
                                *ngFor="let item of value; let index = index"
                                [ngClass]="{
                                    'p-carousel-item': true,
                                    'p-carousel-item-active': firstIndex() <= index && lastIndex() >= index,
                                    'p-carousel-item-start': firstIndex() === index,
                                    'p-carousel-item-end': lastIndex() === index
                                }"
                                [attr.aria-hidden]="!(totalShiftedItems * -1 === value.length)"
                                [attr.aria-label]="ariaSlideNumber(index)"
                                [attr.aria-roledescription]="ariaSlideLabel()"
                            >
                                <ng-container *ngTemplateOutlet="itemTemplate || _itemTemplate; context: { $implicit: item }"></ng-container>
                            </div>
                            <div
                                *ngFor="let item of clonedItemsForFinishing; let index = index"
                                [ngClass]="{
                                    'p-carousel-item p-carousel-item-clone': true,
                                    'p-carousel-item-active': totalShiftedItems * -1 === numVisible,
                                    'p-carousel-item-start': 0 === index,
                                    'p-carousel-item-end': clonedItemsForFinishing.length - 1 === index
                                }"
                            >
                                <ng-container *ngTemplateOutlet="itemTemplate || _itemTemplate; context: { $implicit: item }"></ng-container>
                            </div>
                        </div>
                    </div>
                    <p-button
                        type="button"
                        *ngIf="showNavigators"
                        [ngClass]="{ 'p-carousel-next-button': true, 'p-disabled': isForwardNavDisabled() }"
                        [disabled]="isForwardNavDisabled()"
                        (click)="navForward($event)"
                        [attr.aria-label]="ariaNextButtonLabel()"
                        [buttonProps]="nextButtonProps"
                        [text]="true"
                    >
                        <ng-template #icon>
                            <ng-container *ngIf="!nextIconTemplate && !_nextIconTemplate && !nextButtonProps?.icon">
                                <ChevronRightIcon *ngIf="!isVertical()" [styleClass]="'carousel-next-icon'" />
                                <ChevronDownIcon *ngIf="isVertical()" [styleClass]="'carousel-next-icon'" />
                            </ng-container>
                            <span *ngIf="nextIconTemplate || (_nextIconTemplate && !nextButtonProps?.icon)" class="next">
                                <ng-template *ngTemplateOutlet="nextIconTemplate || _nextIconTemplate"></ng-template>
                            </span>
                        </ng-template>
                    </p-button>
                </div>
                <ul #indicatorContent [ngClass]="'p-carousel-indicator-list'" [class]="indicatorsContentClass" [ngStyle]="indicatorsContentStyle" *ngIf="showIndicators" (keydown)="onIndicatorKeydown($event)">
                    <li *ngFor="let totalDot of totalDotsArray(); let i = index" [ngClass]="{ 'p-carousel-indicator': true, 'p-carousel-indicator-active': _page === i }" [attr.data-pc-section]="'indicator'">
                        <button
                            type="button"
                            [ngClass]="'p-carousel-indicator-button'"
                            (click)="onDotClick($event, i)"
                            [class]="indicatorStyleClass"
                            [ngStyle]="indicatorStyle"
                            [attr.aria-label]="ariaPageLabel(i + 1)"
                            [attr.aria-current]="_page === i ? 'page' : undefined"
                            [tabindex]="_page === i ? 0 : -1"
                        ></button>
                    </li>
                </ul>
            </div>
            <div class="p-carousel-footer" *ngIf="footerFacet || footerTemplate || _footerTemplate">
                <ng-content select="p-footer"></ng-content>
                <ng-container *ngTemplateOutlet="footerTemplate || _footerTemplate"></ng-container>
            </div>
        </div>
    `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [CarouselStyle]
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: NgZone
  }], {
    page: [{
      type: Input
    }],
    numVisible: [{
      type: Input
    }],
    numScroll: [{
      type: Input
    }],
    responsiveOptions: [{
      type: Input
    }],
    orientation: [{
      type: Input
    }],
    verticalViewPortHeight: [{
      type: Input
    }],
    contentClass: [{
      type: Input
    }],
    indicatorsContentClass: [{
      type: Input
    }],
    indicatorsContentStyle: [{
      type: Input
    }],
    indicatorStyleClass: [{
      type: Input
    }],
    indicatorStyle: [{
      type: Input
    }],
    value: [{
      type: Input
    }],
    circular: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    showIndicators: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    showNavigators: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    autoplayInterval: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    style: [{
      type: Input
    }],
    styleClass: [{
      type: Input
    }],
    prevButtonProps: [{
      type: Input
    }],
    nextButtonProps: [{
      type: Input
    }],
    onPage: [{
      type: Output
    }],
    itemsContainer: [{
      type: ViewChild,
      args: ["itemsContainer"]
    }],
    indicatorContent: [{
      type: ViewChild,
      args: ["indicatorContent"]
    }],
    headerFacet: [{
      type: ContentChild,
      args: [Header]
    }],
    footerFacet: [{
      type: ContentChild,
      args: [Footer]
    }],
    itemTemplate: [{
      type: ContentChild,
      args: ["item", {
        descendants: false
      }]
    }],
    headerTemplate: [{
      type: ContentChild,
      args: ["header", {
        descendants: false
      }]
    }],
    footerTemplate: [{
      type: ContentChild,
      args: ["footer", {
        descendants: false
      }]
    }],
    previousIconTemplate: [{
      type: ContentChild,
      args: ["previousicon", {
        descendants: false
      }]
    }],
    nextIconTemplate: [{
      type: ContentChild,
      args: ["nexticon", {
        descendants: false
      }]
    }],
    templates: [{
      type: ContentChildren,
      args: [PrimeTemplate]
    }]
  });
})();
var CarouselModule = class _CarouselModule {
  static \u0275fac = function CarouselModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CarouselModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _CarouselModule
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [Carousel, SharedModule, SharedModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CarouselModule, [{
    type: NgModule,
    args: [{
      imports: [Carousel, SharedModule],
      exports: [Carousel, SharedModule]
    }]
  }], null, null);
})();

// node_modules/primeng/fesm2022/primeng-galleria.mjs
var _c02 = ["header"];
var _c17 = ["footer"];
var _c22 = ["indicator"];
var _c32 = ["caption"];
var _c42 = ["closeicon"];
var _c52 = ["previousthumbnailicon"];
var _c62 = ["nextthumbnailicon"];
var _c72 = ["itempreviousicon"];
var _c82 = ["itemnexticon"];
var _c92 = ["item"];
var _c102 = ["thumbnail"];
var _c112 = ["mask"];
var _c122 = ["container"];
var _c132 = () => ({
  "p-galleria-mask p-overlay-mask p-overlay-mask-enter": true
});
var _c142 = (a0, a1) => ({
  showTransitionParams: a0,
  hideTransitionParams: a1
});
var _c152 = (a0) => ({
  value: "visible",
  params: a0
});
function Galleria_div_0_div_2_p_galleriaContent_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-galleriaContent", 7);
    \u0275\u0275listener("@animation.start", function Galleria_div_0_div_2_p_galleriaContent_2_Template_p_galleriaContent_animation_animation_start_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onAnimationStart($event));
    })("@animation.done", function Galleria_div_0_div_2_p_galleriaContent_2_Template_p_galleriaContent_animation_animation_done_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onAnimationEnd($event));
    })("maskHide", function Galleria_div_0_div_2_p_galleriaContent_2_Template_p_galleriaContent_maskHide_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onMaskHide());
    })("activeItemChange", function Galleria_div_0_div_2_p_galleriaContent_2_Template_p_galleriaContent_activeItemChange_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onActiveItemChange($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("@animation", \u0275\u0275pureFunction1(9, _c152, \u0275\u0275pureFunction2(6, _c142, ctx_r1.showTransitionOptions, ctx_r1.hideTransitionOptions)))("value", ctx_r1.value)("activeIndex", ctx_r1.activeIndex)("numVisible", ctx_r1.numVisibleLimit || ctx_r1.numVisible)("ngStyle", ctx_r1.containerStyle)("fullScreen", ctx_r1.fullScreen);
  }
}
function Galleria_div_0_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5, 2);
    \u0275\u0275template(2, Galleria_div_0_div_2_p_galleriaContent_2_Template, 1, 11, "p-galleriaContent", 6);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r1.maskClass);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction0(6, _c132));
    \u0275\u0275attribute("role", ctx_r1.fullScreen ? "dialog" : "region")("aria-modal", ctx_r1.fullScreen ? "true" : void 0);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.visible);
  }
}
function Galleria_div_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", null, 1);
    \u0275\u0275template(2, Galleria_div_0_div_2_Template, 3, 7, "div", 4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.maskVisible);
  }
}
function Galleria_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-galleriaContent", 8);
    \u0275\u0275listener("activeItemChange", function Galleria_ng_template_1_Template_p_galleriaContent_activeItemChange_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onActiveItemChange($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("value", ctx_r1.value)("activeIndex", ctx_r1.activeIndex)("numVisible", ctx_r1.numVisibleLimit || ctx_r1.numVisible);
  }
}
var _c162 = ["closeButton"];
var _c172 = (a0, a1, a2) => ({
  "p-galleria p-component": true,
  "p-galleria-fullscreen": a0,
  "p-galleria-inset-indicators": a1,
  "p-galleria-hover-navigators": a2
});
var _c18 = () => ({});
function GalleriaContent_div_0_button_1_TimesIcon_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "TimesIcon", 11);
  }
  if (rf & 2) {
    \u0275\u0275property("styleClass", "p-galleria-close-icon");
  }
}
function GalleriaContent_div_0_button_1_2_ng_template_0_Template(rf, ctx) {
}
function GalleriaContent_div_0_button_1_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, GalleriaContent_div_0_button_1_2_ng_template_0_Template, 0, 0, "ng-template");
  }
}
function GalleriaContent_div_0_button_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 8);
    \u0275\u0275listener("click", function GalleriaContent_div_0_button_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.maskHide.emit());
    });
    \u0275\u0275template(1, GalleriaContent_div_0_button_1_TimesIcon_1_Template, 1, 1, "TimesIcon", 9)(2, GalleriaContent_div_0_button_1_2_Template, 1, 0, null, 10);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("aria-label", ctx_r2.closeAriaLabel())("data-pc-section", "closebutton");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r2.galleria.closeIconTemplate && !ctx_r2.galleria._closeIconTemplate);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", ctx_r2.galleria.closeIconTemplate || ctx_r2.galleria._closeIconTemplate);
  }
}
function GalleriaContent_div_0_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275element(1, "p-galleriaItemSlot", 13);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("templates", ctx_r2.galleria.templates);
  }
}
function GalleriaContent_div_0_p_galleriaThumbnails_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-galleriaThumbnails", 14);
    \u0275\u0275listener("onActiveIndexChange", function GalleriaContent_div_0_p_galleriaThumbnails_5_Template_p_galleriaThumbnails_onActiveIndexChange_0_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onActiveIndexChange($event));
    })("stopSlideShow", function GalleriaContent_div_0_p_galleriaThumbnails_5_Template_p_galleriaThumbnails_stopSlideShow_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.stopSlideShow());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("containerId", ctx_r2.id)("value", ctx_r2.value)("activeIndex", ctx_r2.activeIndex)("templates", ctx_r2.galleria.templates)("numVisible", ctx_r2.numVisible)("responsiveOptions", ctx_r2.galleria.responsiveOptions)("circular", ctx_r2.galleria.circular)("isVertical", ctx_r2.isVertical())("contentHeight", ctx_r2.galleria.verticalThumbnailViewPortHeight)("showThumbnailNavigators", ctx_r2.galleria.showThumbnailNavigators)("slideShowActive", ctx_r2.slideShowActive);
  }
}
function GalleriaContent_div_0_div_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15);
    \u0275\u0275element(1, "p-galleriaItemSlot", 16);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("templates", ctx_r2.galleria.templates);
  }
}
function GalleriaContent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275template(1, GalleriaContent_div_0_button_1_Template, 3, 4, "button", 2)(2, GalleriaContent_div_0_div_2_Template, 2, 1, "div", 3);
    \u0275\u0275elementStart(3, "div", 4)(4, "p-galleriaItem", 5);
    \u0275\u0275listener("onActiveIndexChange", function GalleriaContent_div_0_Template_p_galleriaItem_onActiveIndexChange_4_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onActiveIndexChange($event));
    })("startSlideShow", function GalleriaContent_div_0_Template_p_galleriaItem_startSlideShow_4_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.startSlideShow());
    })("stopSlideShow", function GalleriaContent_div_0_Template_p_galleriaItem_stopSlideShow_4_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.stopSlideShow());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, GalleriaContent_div_0_p_galleriaThumbnails_5_Template, 1, 11, "p-galleriaThumbnails", 6);
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, GalleriaContent_div_0_div_6_Template, 2, 1, "div", 7);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r2.galleriaClass());
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction3(24, _c172, ctx_r2.galleria.fullScreen, ctx_r2.galleria.showIndicatorsOnItem, ctx_r2.galleria.showItemNavigatorsOnHover && !ctx_r2.galleria.fullScreen))("ngStyle", !ctx_r2.galleria.fullScreen ? ctx_r2.galleria.containerStyle : \u0275\u0275pureFunction0(28, _c18))("pFocusTrapDisabled", !ctx_r2.fullScreen);
    \u0275\u0275attribute("id", ctx_r2.id)("role", "region");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.galleria.fullScreen);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.galleria.templates && (ctx_r2.galleria.headerFacet || ctx_r2.galleria.headerTemplate));
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-live", ctx_r2.galleria.autoPlay ? "polite" : "off");
    \u0275\u0275advance();
    \u0275\u0275property("id", ctx_r2.id)("value", ctx_r2.value)("activeIndex", ctx_r2.activeIndex)("circular", ctx_r2.galleria.circular)("templates", ctx_r2.galleria.templates)("showIndicators", ctx_r2.galleria.showIndicators)("changeItemOnIndicatorHover", ctx_r2.galleria.changeItemOnIndicatorHover)("indicatorFacet", ctx_r2.galleria.indicatorFacet)("captionFacet", ctx_r2.galleria.captionFacet)("showItemNavigators", ctx_r2.galleria.showItemNavigators)("autoPlay", ctx_r2.galleria.autoPlay)("slideShowActive", ctx_r2.slideShowActive);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.galleria.showThumbnails);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.shouldRenderFooter());
  }
}
function GalleriaItemSlot_ng_container_0_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function GalleriaItemSlot_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, GalleriaItemSlot_ng_container_0_ng_container_1_Template, 1, 0, "ng-container", 1);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", ctx_r0.contentTemplate)("ngTemplateOutletContext", ctx_r0.context);
  }
}
var _c19 = (a0) => ({
  "p-galleria-prev-button p-galleria-nav-button": true,
  "p-disabled": a0
});
var _c20 = (a0) => ({
  "p-galleria-next-button p-galleria-nav-button": true,
  "p-disabled": a0
});
var _c21 = (a0) => ({
  "p-galleria-indicator": true,
  "p-galleria-indicator-active": a0
});
function GalleriaItem_button_1_ChevronLeftIcon_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ChevronLeftIcon", 9);
  }
  if (rf & 2) {
    \u0275\u0275property("styleClass", "p-galleria-prev-icon");
  }
}
function GalleriaItem_button_1_2_ng_template_0_Template(rf, ctx) {
}
function GalleriaItem_button_1_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, GalleriaItem_button_1_2_ng_template_0_Template, 0, 0, "ng-template");
  }
}
function GalleriaItem_button_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 6);
    \u0275\u0275listener("click", function GalleriaItem_button_1_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.navBackward($event));
    })("focus", function GalleriaItem_button_1_Template_button_focus_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onButtonFocus("left"));
    })("blur", function GalleriaItem_button_1_Template_button_blur_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onButtonBlur("left"));
    });
    \u0275\u0275template(1, GalleriaItem_button_1_ChevronLeftIcon_1_Template, 1, 1, "ChevronLeftIcon", 7)(2, GalleriaItem_button_1_2_Template, 1, 0, null, 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(4, _c19, ctx_r1.isNavBackwardDisabled()))("disabled", ctx_r1.isNavBackwardDisabled());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.galleria.itemPreviousIconTemplate && !ctx_r1.galleria._itemPreviousIconTemplate);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", ctx_r1.galleria.itemPreviousIconTemplate || ctx_r1.galleria._itemPreviousIconTemplate);
  }
}
function GalleriaItem_button_4_ChevronRightIcon_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ChevronRightIcon", 9);
  }
  if (rf & 2) {
    \u0275\u0275property("styleClass", "p-galleria-next-icon");
  }
}
function GalleriaItem_button_4_2_ng_template_0_Template(rf, ctx) {
}
function GalleriaItem_button_4_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, GalleriaItem_button_4_2_ng_template_0_Template, 0, 0, "ng-template");
  }
}
function GalleriaItem_button_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 6);
    \u0275\u0275listener("click", function GalleriaItem_button_4_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.navForward($event));
    })("focus", function GalleriaItem_button_4_Template_button_focus_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onButtonFocus("right"));
    })("blur", function GalleriaItem_button_4_Template_button_blur_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onButtonBlur("right"));
    });
    \u0275\u0275template(1, GalleriaItem_button_4_ChevronRightIcon_1_Template, 1, 1, "ChevronRightIcon", 7)(2, GalleriaItem_button_4_2_Template, 1, 0, null, 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(4, _c20, ctx_r1.isNavForwardDisabled()))("disabled", ctx_r1.isNavForwardDisabled());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.galleria.itemNextIconTemplate && !ctx_r1.galleria._itemNextIconTemplate);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", ctx_r1.galleria.itemNextIconTemplate || ctx_r1.galleria._itemNextIconTemplate);
  }
}
function GalleriaItem_div_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "p-galleriaItemSlot", 11);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("item", ctx_r1.activeItem)("templates", ctx_r1.templates);
  }
}
function GalleriaItem_ul_6_li_1_button_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "button", 17);
  }
}
function GalleriaItem_ul_6_li_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li", 14);
    \u0275\u0275listener("click", function GalleriaItem_ul_6_li_1_Template_li_click_0_listener() {
      const index_r5 = \u0275\u0275restoreView(_r4).index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onIndicatorClick(index_r5));
    })("mouseenter", function GalleriaItem_ul_6_li_1_Template_li_mouseenter_0_listener() {
      const index_r5 = \u0275\u0275restoreView(_r4).index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onIndicatorMouseEnter(index_r5));
    })("keydown", function GalleriaItem_ul_6_li_1_Template_li_keydown_0_listener($event) {
      const index_r5 = \u0275\u0275restoreView(_r4).index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onIndicatorKeyDown($event, index_r5));
    });
    \u0275\u0275template(1, GalleriaItem_ul_6_li_1_button_1_Template, 1, 0, "button", 15);
    \u0275\u0275element(2, "p-galleriaItemSlot", 16);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const index_r5 = ctx.index;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(7, _c21, ctx_r1.isIndicatorItemActive(index_r5)));
    \u0275\u0275attribute("aria-label", ctx_r1.ariaPageLabel(index_r5 + 1))("aria-selected", ctx_r1.activeIndex === index_r5)("aria-controls", ctx_r1.id + "_item_" + index_r5);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.indicatorFacet && !ctx_r1.galleria.indicatorTemplate);
    \u0275\u0275advance();
    \u0275\u0275property("index", index_r5)("templates", ctx_r1.templates);
  }
}
function GalleriaItem_ul_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 12);
    \u0275\u0275template(1, GalleriaItem_ul_6_li_1_Template, 3, 9, "li", 13);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.value);
  }
}
var _c222 = ["itemsContainer"];
var _c23 = (a0) => ({
  height: a0
});
var _c24 = (a0) => ({
  "p-galleria-thumbnail-prev-button p-galleria-thumbnail-nav-button": true,
  "p-disabled": a0
});
var _c25 = (a0, a1, a2, a3) => ({
  "p-galleria-thumbnail-item": true,
  "p-galleria-thumbnail-item-current": a0,
  "p-galleria-thumbnail-item-active": a1,
  "p-galleria-thumbnail-item-start": a2,
  "p-galleria-thumbnail-item-end": a3
});
var _c26 = (a0) => ({
  "p-galleria-thumbnail-next-button p-galleria-thumbnail-nav-button": true,
  "p-disabled": a0
});
function GalleriaThumbnails_button_2_ng_container_1_ChevronLeftIcon_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ChevronLeftIcon", 11);
  }
  if (rf & 2) {
    \u0275\u0275property("styleClass", "p-galleria-thumbnail-prev-icon");
  }
}
function GalleriaThumbnails_button_2_ng_container_1_ChevronUpIcon_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ChevronUpIcon", 11);
  }
  if (rf & 2) {
    \u0275\u0275property("styleClass", "p-galleria-thumbnail-prev-icon");
  }
}
function GalleriaThumbnails_button_2_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, GalleriaThumbnails_button_2_ng_container_1_ChevronLeftIcon_1_Template, 1, 1, "ChevronLeftIcon", 10)(2, GalleriaThumbnails_button_2_ng_container_1_ChevronUpIcon_2_Template, 1, 1, "ChevronUpIcon", 10);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r2.isVertical);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.isVertical);
  }
}
function GalleriaThumbnails_button_2_2_ng_template_0_Template(rf, ctx) {
}
function GalleriaThumbnails_button_2_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, GalleriaThumbnails_button_2_2_ng_template_0_Template, 0, 0, "ng-template");
  }
}
function GalleriaThumbnails_button_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 7);
    \u0275\u0275listener("click", function GalleriaThumbnails_button_2_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.navBackward($event));
    });
    \u0275\u0275template(1, GalleriaThumbnails_button_2_ng_container_1_Template, 3, 2, "ng-container", 8)(2, GalleriaThumbnails_button_2_2_Template, 1, 0, null, 9);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(5, _c24, ctx_r2.isNavBackwardDisabled()))("disabled", ctx_r2.isNavBackwardDisabled());
    \u0275\u0275attribute("aria-label", ctx_r2.ariaPrevButtonLabel());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r2.galleria.previousThumbnailIconTemplate && !ctx_r2.galleria._previousThumbnailIconTemplate);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", ctx_r2.galleria.previousThumbnailIconTemplate || ctx_r2.galleria._previousThumbnailIconTemplate);
  }
}
function GalleriaThumbnails_div_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275listener("keydown", function GalleriaThumbnails_div_6_Template_div_keydown_0_listener($event) {
      const index_r5 = \u0275\u0275restoreView(_r4).index;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onThumbnailKeydown($event, index_r5));
    });
    \u0275\u0275elementStart(1, "div", 13);
    \u0275\u0275listener("click", function GalleriaThumbnails_div_6_Template_div_click_1_listener() {
      const index_r5 = \u0275\u0275restoreView(_r4).index;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onItemClick(index_r5));
    })("touchend", function GalleriaThumbnails_div_6_Template_div_touchend_1_listener() {
      const index_r5 = \u0275\u0275restoreView(_r4).index;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onItemClick(index_r5));
    })("keydown.enter", function GalleriaThumbnails_div_6_Template_div_keydown_enter_1_listener() {
      const index_r5 = \u0275\u0275restoreView(_r4).index;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onItemClick(index_r5));
    });
    \u0275\u0275element(2, "p-galleriaItemSlot", 14);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r6 = ctx.$implicit;
    const index_r5 = ctx.index;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction4(10, _c25, ctx_r2.activeIndex === index_r5, ctx_r2.isItemActive(index_r5), ctx_r2.firstItemAciveIndex() === index_r5, ctx_r2.lastItemActiveIndex() === index_r5));
    \u0275\u0275attribute("aria-selected", ctx_r2.activeIndex === index_r5)("aria-controls", ctx_r2.containerId + "_item_" + index_r5)("data-pc-section", "thumbnailitem")("data-p-active", ctx_r2.activeIndex === index_r5);
    \u0275\u0275advance();
    \u0275\u0275attribute("tabindex", ctx_r2.activeIndex === index_r5 ? 0 : -1)("aria-current", ctx_r2.activeIndex === index_r5 ? "page" : void 0)("aria-label", ctx_r2.ariaPageLabel(index_r5 + 1));
    \u0275\u0275advance();
    \u0275\u0275property("item", item_r6)("templates", ctx_r2.templates);
  }
}
function GalleriaThumbnails_button_7_ng_container_1_ChevronRightIcon_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ChevronRightIcon", 16);
  }
  if (rf & 2) {
    \u0275\u0275property("ngClass", "p-galleria-thumbnail-next-icon");
  }
}
function GalleriaThumbnails_button_7_ng_container_1_ChevronDownIcon_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ChevronDownIcon", 16);
  }
  if (rf & 2) {
    \u0275\u0275property("ngClass", "p-galleria-thumbnail-next-icon");
  }
}
function GalleriaThumbnails_button_7_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, GalleriaThumbnails_button_7_ng_container_1_ChevronRightIcon_1_Template, 1, 1, "ChevronRightIcon", 15)(2, GalleriaThumbnails_button_7_ng_container_1_ChevronDownIcon_2_Template, 1, 1, "ChevronDownIcon", 15);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r2.isVertical);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.isVertical);
  }
}
function GalleriaThumbnails_button_7_2_ng_template_0_Template(rf, ctx) {
}
function GalleriaThumbnails_button_7_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, GalleriaThumbnails_button_7_2_ng_template_0_Template, 0, 0, "ng-template");
  }
}
function GalleriaThumbnails_button_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 7);
    \u0275\u0275listener("click", function GalleriaThumbnails_button_7_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.navForward($event));
    });
    \u0275\u0275template(1, GalleriaThumbnails_button_7_ng_container_1_Template, 3, 2, "ng-container", 8)(2, GalleriaThumbnails_button_7_2_Template, 1, 0, null, 9);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(5, _c26, ctx_r2.isNavForwardDisabled()))("disabled", ctx_r2.isNavForwardDisabled());
    \u0275\u0275attribute("aria-label", ctx_r2.ariaNextButtonLabel());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r2.galleria.nextThumbnailIconTemplate && !ctx_r2.galleria._nextThumbnailIconTemplate);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", ctx_r2.galleria.nextThumbnailIconTemplate || ctx_r2.galleria._nextThumbnailIconTemplate);
  }
}
var theme2 = ({
  dt
}) => `
.p-galleria {
    overflow: hidden;
    border-style: solid;
    border-width: ${dt("galleria.border.width")};
    border-color: ${dt("galleria.border.color")};
    border-radius: ${dt("galleria.border.radius")};
}

.p-galleria-content {
    display: flex;
    flex-direction: column;
}

.p-galleria-items-container {
    display: flex;
    flex-direction: column;
    position: relative;
}

.p-galleria-items {
    position: relative;
    display: flex;
    height: 100%;
}

.p-galleria-nav-button {
    position: absolute;
    top: 50%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background: ${dt("galleria.nav.button.background")};
    color: ${dt("galleria.nav.button.color")};
    width: ${dt("galleria.nav.button.size")};
    height: ${dt("galleria.nav.button.size")};
    transition: background ${dt("galleria.transition.duration")}, color ${dt("galleria.transition.duration")}, outline-color ${dt("galleria.transition.duration")}, box-shadow ${dt("galleria.transition.duration")};
    margin: calc(-1 * calc(${dt("galleria.nav.button.size")}) / 2) ${dt("galleria.nav.button.gutter")} 0 ${dt("galleria.nav.button.gutter")};
    padding: 0;
    user-select: none;
    border: 0 none;
    cursor: pointer;
    outline-color: transparent;
}

.p-galleria-nav-button:not(.p-disabled):hover {
    background: ${dt("galleria.nav.button.hover.background")};
    color: ${dt("galleria.nav.button.hover.color")};
}

.p-galleria-nav-button:not(.p-disabled):focus-visible {
    box-shadow: ${dt("galleria.nav.button.focus.ring.shadow")};
    outline: ${dt("galleria.nav.button.focus.ring.width")} ${dt("galleria.nav.button.focus.ring.style")} ${dt("galleria.nav.button.focus.ring.color")};
    outline-offset: ${dt("galleria.nav.button.focus.ring.offset")};
}

.p-galleria-next-icon,
.p-galleria-prev-icon {
    font-size: ${dt("galleria.nav.icon.size")};
    width: ${dt("galleria.nav.icon.size")};
    height: ${dt("galleria.nav.icon.size")};
}

.p-galleria-prev-button {
    border-radius: ${dt("galleria.nav.button.prev.border.radius")};
    left: 0;
}

.p-galleria-next-button {
    border-radius: ${dt("galleria.nav.button.next.border.radius")};
    right: 0;
}

.p-galleria-prev-button:dir(rtl) {
    left: auto;
    right: 0;
    transform: rotate(180deg);
}

.p-galleria-next-button:dir(rtl) {
    right: auto;
    left: 0;
    transform: rotate(180deg);
}

.p-galleria-item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
}

.p-galleria-hover-navigators .p-galleria-nav-button {
    pointer-events: none;
    opacity: 0;
    transition: opacity ${dt("galleria.transition.duration")} ease-in-out;
}

.p-galleria-hover-navigators .p-galleria-items-container:hover .p-galleria-nav-button {
    pointer-events: all;
    opacity: 1;
}

.p-galleria-hover-navigators .p-galleria-items-container:hover .p-galleria-nav-button.p-disabled {
    pointer-events: none;
}

.p-galleria-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: ${dt("galleria.caption.background")};
    color: ${dt("galleria.caption.color")};
    padding: ${dt("galleria.caption.padding")};
}

.p-galleria-thumbnails {
    display: flex;
    flex-direction: column;
    overflow: auto;
    flex-shrink: 0;
}

.p-galleria-thumbnail-nav-button {
    align-self: center;
    flex: 0 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
    margin: 0 ${dt("galleria.thumbnail.nav.button.gutter")};
    padding: 0;
    border: none;
    user-select: none;
    cursor: pointer;
    background: transparent;
    color: ${dt("galleria.thumbnail.nav.button.color")};
    width: ${dt("galleria.thumbnail.nav.button.size")};
    height: ${dt("galleria.thumbnail.nav.button.size")};
    transition: background ${dt("galleria.transition.duration")}, color ${dt("galleria.transition.duration")}, outline-color ${dt("galleria.transition.duration")};
    outline-color: transparent;
    border-radius: ${dt("galleria.thumbnail.nav.button.border.radius")};
}

.p-galleria-thumbnail-nav-button:hover {
    background: ${dt("galleria.thumbnail.nav.button.hover.background")};
    color: ${dt("galleria.thumbnail.nav.button.hover.color")};
}

.p-galleria-thumbnail-nav-button:focus-visible {
    box-shadow: ${dt("galleria.thumbnail.nav.button.focus.ring.shadow")};
    outline: ${dt("galleria.thumbnail.nav.button.focus.ring.width")} ${dt("galleria.thumbnail.nav.button.focus.ring.style")} ${dt("galleria.thumbnail.nav.button.focus.ring.color")};
    outline-offset: ${dt("galleria.thumbnail.nav.button.focus.ring.offset")};
}

.p-galleria-thumbnail-nav-button .p-galleria-thumbnail-next-icon,
.p-galleria-thumbnail-nav-button .p-galleria-thumbnail-prev-icon {
    font-size: ${dt("galleria.thumbnail.nav.button.icon.size")};
    width: ${dt("galleria.thumbnail.nav.button.icon.size")};
    height: ${dt("galleria.thumbnail.nav.button.icon.size")};
}

.p-galleria-thumbnails-content {
    display: flex;
    flex-direction: row;
    background: ${dt("galleria.thumbnails.content.background")};
    padding: ${dt("galleria.thumbnails.content.padding")};
}

.p-galleria-thumbnails-viewport {
    overflow: hidden;
    width: 100%;
}

.p-galleria:not(.p-galleria-thumbnails-right):not(.p-galleria-thumbnails-left) .p-galleria-thumbnail-prev-button:dir(rtl),
.p-galleria:not(.p-galleria-thumbnails-right):not(.p-galleria-thumbnails-left) .p-galleria-thumbnail-next-button:dir(rtl) {
    transform: rotate(180deg);
}

.p-galleria-thumbnail-items {
    display: flex;
}

.p-galleria-thumbnail-item {
    overflow: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0.5;
}

.p-galleria-thumbnail {
    outline-color: transparent;
}

.p-galleria-thumbnail-item:hover {
    opacity: 1;
    transition: opacity 0.3s;
}

.p-galleria-thumbnail-item-current {
    opacity: 1;
}

.p-galleria-thumbnails-left .p-galleria-content,
.p-galleria-thumbnails-right .p-galleria-content {
    flex-direction: row;
}

.p-galleria-thumbnails-left .p-galleria-items-container,
.p-galleria-thumbnails-right .p-galleria-items-container {
    flex-direction: row;
}

.p-galleria-thumbnails-left .p-galleria-items-container,
.p-galleria-thumbnails-top .p-galleria-items-container {
    order: 2;
}

.p-galleria-thumbnails-left .p-galleria-thumbnails,
.p-galleria-thumbnails-top .p-galleria-thumbnails {
    order: 1;
}

.p-galleria-thumbnails-left .p-galleria-thumbnails-content,
.p-galleria-thumbnails-right .p-galleria-thumbnails-content {
    flex-direction: column;
    flex-grow: 1;
}

.p-galleria-thumbnails-left .p-galleria-thumbnail-items,
.p-galleria-thumbnails-right .p-galleria-thumbnail-items {
    flex-direction: column;
    height: 100%;
}

.p-galleria-indicator-list {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${dt("galleria.indicator.list.padding")};
    gap: ${dt("galleria.indicator.list.gap")};
    margin: 0;
    list-style: none;
}

.p-galleria-indicator-button {
    display: inline-flex;
    align-items: center;
    background: ${dt("galleria.indicator.button.background")};
    width: ${dt("galleria.indicator.button.width")};
    height: ${dt("galleria.indicator.button.height")};
    transition: background ${dt("galleria.transition.duration")}, color ${dt("galleria.transition.duration")}, outline-color ${dt("galleria.transition.duration")}, box-shadow ${dt("galleria.transition.duration")};
    outline-color: transparent;
    border-radius: ${dt("galleria.indicator.button.border.radius")};
    margin: 0;
    padding: 0;
    border: none;
    user-select: none;
    cursor: pointer;
}

.p-galleria-indicator-button:hover {
    background: ${dt("galleria.indicator.button.hover.background")};
}

.p-galleria-indicator-button:focus-visible {
    box-shadow: ${dt("galleria.indicator.button.focus.ring.shadow")};
    outline: ${dt("galleria.indicator.button.focus.ring.width")} ${dt("galleria.indicator.button.focus.ring.style")} ${dt("galleria.indicator.button.focus.ring.color")};
    outline-offset: ${dt("galleria.indicator.button.focus.ring.offset")};
}

.p-galleria-indicator-active .p-galleria-indicator-button {
    background: ${dt("galleria.indicator.button.active.background")};
}

.p-galleria-indicators-left .p-galleria-items-container,
.p-galleria-indicators-right .p-galleria-items-container {
    flex-direction: row;
    align-items: center;
}

.p-galleria-indicators-left .p-galleria-items,
.p-galleria-indicators-top .p-galleria-items {
    order: 2;
}

.p-galleria-indicators-left .p-galleria-indicator-list,
.p-galleria-indicators-top .p-galleria-indicator-list {
    order: 1;
}

.p-galleria-indicators-left .p-galleria-indicator-list,
.p-galleria-indicators-right .p-galleria-indicator-list {
    flex-direction: column;
}

.p-galleria-inset-indicators .p-galleria-indicator-list {
    position: absolute;
    display: flex;
    z-index: 1;
    background: ${dt("galleria.inset.indicator.list.background")};
}

.p-galleria-inset-indicators .p-galleria-indicator-button {
    background: ${dt("galleria.inset.indicator.button.background")};
}

.p-galleria-inset-indicators .p-galleria-indicator-button:hover {
    background: ${dt("galleria.inset.indicator.button.hover.background")};
}

.p-galleria-inset-indicators .p-galleria-indicator-active .p-galleria-indicator-button {
    background: ${dt("galleria.inset.indicator.button.active.background")};
}

.p-galleria-inset-indicators.p-galleria-indicators-top .p-galleria-indicator-list {
    top: 0;
    left: 0;
    width: 100%;
    align-items: flex-start;
}

.p-galleria-inset-indicators.p-galleria-indicators-right .p-galleria-indicator-list {
    right: 0;
    top: 0;
    height: 100%;
    align-items: flex-end;
}

.p-galleria-inset-indicators.p-galleria-indicators-bottom .p-galleria-indicator-list {
    bottom: 0;
    left: 0;
    width: 100%;
    align-items: flex-end;
}

.p-galleria-inset-indicators.p-galleria-indicators-left .p-galleria-indicator-list {
    left: 0;
    top: 0;
    height: 100%;
    align-items: flex-start;
}

.p-galleria-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.p-galleria-close-button {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    margin: ${dt("galleria.close.button.gutter")};
    background: ${dt("galleria.close.button.background")};
    color: ${dt("galleria.close.button.color")};
    width: ${dt("galleria.close.button.size")};
    height: ${dt("galleria.close.button.size")};
    padding: 0;
    border: none;
    user-select: none;
    cursor: pointer;
    border-radius: ${dt("galleria.close.button.border.radius")};
    outline-color: transparent;
    transition: background ${dt("galleria.transition.duration")}, color ${dt("galleria.transition.duration")}, outline-color ${dt("galleria.transition.duration")};
}

.p-galleria-close-icon {
    font-size: ${dt("galleria.close.button.icon.size")};
    width: ${dt("galleria.close.button.icon.size")};
    height: ${dt("galleria.close.button.icon.size")};
}

.p-galleria-close-button:hover {
    background: ${dt("galleria.close.button.hover.background")};
    color: ${dt("galleria.close.button.hover.color")};
}

.p-galleria-close-button:focus-visible {
    box-shadow: ${dt("galleria.close.button.focus.ring.shadow")};
    outline: ${dt("galleria.close.button.focus.ring.width")} ${dt("galleria.close.button.focus.ring.style")} ${dt("galleria.close.button.focus.ring.color")};
    outline-offset: ${dt("galleria.close.button.focus.ring.offset")};
}

.p-galleria-mask .p-galleria-nav-button {
    position: fixed;
    top: 50%;
}

.p-galleria-enter-active {
    transition: all 150ms cubic-bezier(0, 0, 0.2, 1);
}

.p-galleria-leave-active {
    transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.p-galleria-enter-from,
.p-galleria-leave-to {
    opacity: 0;
    transform: scale(0.7);
}

.p-galleria-enter-active .p-galleria-nav-button {
    opacity: 0;
}

.p-items-hidden .p-galleria-thumbnail-item {
    visibility: hidden;
}

.p-items-hidden .p-galleria-thumbnail-item.p-galleria-thumbnail-item-active {
    visibility: visible;
}
`;
var classes2 = {
  mask: "p-galleria-mask p-overlay-mask p-overlay-mask-enter",
  root: ({
    instance
  }) => {
    const thumbnailsPosClass = instance.$attrs.showThumbnails && instance.getPositionClass("p-galleria-thumbnails", instance.$attrs.thumbnailsPosition);
    const indicatorPosClass = instance.$attrs.showIndicators && instance.getPositionClass("p-galleria-indicators", instance.$attrs.indicatorsPosition);
    return ["p-galleria p-component", {
      "p-galleria-fullscreen": instance.$attrs.fullScreen,
      "p-galleria-inset-indicators": instance.$attrs.showIndicatorsOnItem,
      "p-galleria-hover-navigators": instance.$attrs.showItemNavigatorsOnHover && !instance.$attrs.fullScreen
    }, thumbnailsPosClass, indicatorPosClass];
  },
  closeButton: "p-galleria-close-button",
  closeIcon: "p-galleria-close-icon",
  header: "p-galleria-header",
  content: "p-galleria-content",
  footer: "p-galleria-footer",
  itemsContainer: "p-galleria-items-container",
  items: "p-galleria-items",
  prevButton: ({
    instance
  }) => ["p-galleria-prev-button p-galleria-nav-button", {
    "p-disabled": instance.isNavBackwardDisabled()
  }],
  prevIcon: "p-galleria-prev-icon",
  item: "p-galleria-item",
  nextButton: ({
    instance
  }) => ["p-galleria-next-button p-galleria-nav-button", {
    "p-disabled": instance.isNavForwardDisabled()
  }],
  nextIcon: "p-galleria-next-icon",
  caption: "p-galleria-caption",
  indicatorList: "p-galleria-indicator-list",
  indicator: ({
    instance,
    index
  }) => ["p-galleria-indicator", {
    "p-galleria-indicator-active": instance.isIndicatorItemActive(index)
  }],
  indicatorButton: "p-galleria-indicator-button",
  thumbnails: "p-galleria-thumbnails",
  thumbnailContent: "p-galleria-thumbnails-content",
  thumbnailPrevButton: ({
    instance
  }) => ["p-galleria-thumbnail-prev-button p-galleria-thumbnail-nav-button", {
    "p-disabled": instance.isNavBackwardDisabled()
  }],
  thumbnailPrevIcon: "p-galleria-thumbnail-prev-icon",
  thumbnailsViewport: "p-galleria-thumbnails-viewport",
  thumbnailItems: "p-galleria-thumbnail-items",
  thumbnailItem: ({
    instance,
    index,
    activeIndex
  }) => ["p-galleria-thumbnail-item", {
    "p-galleria-thumbnail-item-current": activeIndex === index,
    "p-galleria-thumbnail-item-active": instance.isItemActive(index),
    "p-galleria-thumbnail-item-start": instance.firstItemAciveIndex() === index,
    "p-galleria-thumbnail-item-end": instance.lastItemActiveIndex() === index
  }],
  thumbnail: "p-galleria-thumbnail",
  thumbnailNextButton: ({
    instance
  }) => ["p-galleria-thumbnail-next-button  p-galleria-thumbnail-nav-button", {
    "p-disabled": instance.isNavForwardDisabled()
  }],
  thumbnailNextIcon: "p-galleria-thumbnail-next-icon"
};
var GalleriaStyle = class _GalleriaStyle extends BaseStyle {
  name = "galleria";
  theme = theme2;
  classes = classes2;
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275GalleriaStyle_BaseFactory;
    return function GalleriaStyle_Factory(__ngFactoryType__) {
      return (\u0275GalleriaStyle_BaseFactory || (\u0275GalleriaStyle_BaseFactory = \u0275\u0275getInheritedFactory(_GalleriaStyle)))(__ngFactoryType__ || _GalleriaStyle);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _GalleriaStyle,
    factory: _GalleriaStyle.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GalleriaStyle, [{
    type: Injectable
  }], null, null);
})();
var GalleriaClasses;
(function(GalleriaClasses2) {
  GalleriaClasses2["mask"] = "p-galleria-mask";
  GalleriaClasses2["root"] = "p-galleria";
  GalleriaClasses2["closeButton"] = "p-galleria-close-button";
  GalleriaClasses2["closeIcon"] = "p-galleria-close-icon";
  GalleriaClasses2["header"] = "p-galleria-header";
  GalleriaClasses2["content"] = "p-galleria-content";
  GalleriaClasses2["footer"] = "p-galleria-footer";
  GalleriaClasses2["itemsContainer"] = "p-galleria-items-container";
  GalleriaClasses2["items"] = "p-galleria-items";
  GalleriaClasses2["prevButton"] = "p-galleria-prev-button";
  GalleriaClasses2["prevIcon"] = "p-galleria-prev-icon";
  GalleriaClasses2["item"] = "p-galleria-item";
  GalleriaClasses2["nextButton"] = "p-galleria-next-button";
  GalleriaClasses2["nextIcon"] = "p-galleria-next-icon";
  GalleriaClasses2["caption"] = "p-galleria-caption";
  GalleriaClasses2["indicatorList"] = "p-galleria-indicator-list";
  GalleriaClasses2["indicator"] = "p-galleria-indicator";
  GalleriaClasses2["indicatorButton"] = "p-galleria-indicator-button";
  GalleriaClasses2["thumbnails"] = "p-galleria-thumbnails";
  GalleriaClasses2["thumbnailContent"] = "p-galleria-thumbnails-content";
  GalleriaClasses2["previousThumbnailButton"] = "p-galleria-thumbnail-prev-button";
  GalleriaClasses2["previousThumbnailIcon"] = "p-galleria-thumbnail-prev-icon";
  GalleriaClasses2["thumbnailsViewport"] = "p-galleria-thumbnails-viewport";
  GalleriaClasses2["thumbnailItems"] = "p-galleria-thumbnail-items";
  GalleriaClasses2["thumbnailItem"] = "p-galleria-thumbnail-item";
  GalleriaClasses2["thumbnail"] = "p-galleria-thumbnail";
  GalleriaClasses2["nextThumbnailButton"] = "p-galleria-thumbnail-next-button";
  GalleriaClasses2["nextThumbnailIcon"] = "p-galleria-thumbnail-next-icon";
})(GalleriaClasses || (GalleriaClasses = {}));
var Galleria = class _Galleria extends BaseComponent {
  platformId;
  element;
  cd;
  /**
   * Index of the first item.
   * @group Props
   */
  get activeIndex() {
    return this._activeIndex;
  }
  set activeIndex(activeIndex) {
    this._activeIndex = activeIndex;
  }
  /**
   * Whether to display the component on fullscreen.
   * @group Props
   */
  fullScreen = false;
  /**
   * Unique identifier of the element.
   * @group Props
   */
  id;
  /**
   * An array of objects to display.
   * @group Props
   */
  value;
  /**
   * Number of items per page.
   * @group Props
   */
  numVisible = 3;
  /**
   * An array of options for responsive design.
   * @see {GalleriaResponsiveOptions}
   * @group Props
   */
  responsiveOptions;
  /**
   * Whether to display navigation buttons in item section.
   * @group Props
   */
  showItemNavigators = false;
  /**
   * Whether to display navigation buttons in thumbnail container.
   * @group Props
   */
  showThumbnailNavigators = true;
  /**
   * Whether to display navigation buttons on item hover.
   * @group Props
   */
  showItemNavigatorsOnHover = false;
  /**
   * When enabled, item is changed on indicator hover.
   * @group Props
   */
  changeItemOnIndicatorHover = false;
  /**
   * Defines if scrolling would be infinite.
   * @group Props
   */
  circular = false;
  /**
   * Items are displayed with a slideshow in autoPlay mode.
   * @group Props
   */
  autoPlay = false;
  /**
   * When enabled, autorun should stop by click.
   * @group Props
   */
  shouldStopAutoplayByClick = true;
  /**
   * Time in milliseconds to scroll items.
   * @group Props
   */
  transitionInterval = 4e3;
  /**
   * Whether to display thumbnail container.
   * @group Props
   */
  showThumbnails = true;
  /**
   * Position of thumbnails.
   * @group Props
   */
  thumbnailsPosition = "bottom";
  /**
   * Height of the viewport in vertical thumbnail.
   * @group Props
   */
  verticalThumbnailViewPortHeight = "300px";
  /**
   * Whether to display indicator container.
   * @group Props
   */
  showIndicators = false;
  /**
   * When enabled, indicator container is displayed on item container.
   * @group Props
   */
  showIndicatorsOnItem = false;
  /**
   * Position of indicators.
   * @group Props
   */
  indicatorsPosition = "bottom";
  /**
   * Base zIndex value to use in layering.
   * @group Props
   */
  baseZIndex = 0;
  /**
   * Style class of the mask on fullscreen mode.
   * @group Props
   */
  maskClass;
  /**
   * Style class of the component on fullscreen mode. Otherwise, the 'class' property can be used.
   * @group Props
   */
  containerClass;
  /**
   * Inline style of the component on fullscreen mode. Otherwise, the 'style' property can be used.
   * @group Props
   */
  containerStyle;
  /**
   * Transition options of the show animation.
   * @group Props
   */
  showTransitionOptions = "150ms cubic-bezier(0, 0, 0.2, 1)";
  /**
   * Transition options of the hide animation.
   * @group Props
   */
  hideTransitionOptions = "150ms cubic-bezier(0, 0, 0.2, 1)";
  /**
   * Specifies the visibility of the mask on fullscreen mode.
   * @group Props
   */
  get visible() {
    return this._visible;
  }
  set visible(visible) {
    this._visible = visible;
    if (this._visible && !this.maskVisible) {
      this.maskVisible = true;
    }
  }
  /**
   * Callback to invoke on active index change.
   * @param {number} number - Active index.
   * @group Emits
   */
  activeIndexChange = new EventEmitter();
  /**
   * Callback to invoke on visiblity change.
   * @param {boolean} boolean - Visible value.
   * @group Emits
   */
  visibleChange = new EventEmitter();
  mask;
  container;
  _visible = false;
  _activeIndex = 0;
  headerTemplate;
  headerFacet;
  footerTemplate;
  footerFacet;
  indicatorTemplate;
  indicatorFacet;
  captionTemplate;
  captionFacet;
  _closeIconTemplate;
  closeIconTemplate;
  _previousThumbnailIconTemplate;
  previousThumbnailIconTemplate;
  _nextThumbnailIconTemplate;
  nextThumbnailIconTemplate;
  _itemPreviousIconTemplate;
  itemPreviousIconTemplate;
  _itemNextIconTemplate;
  itemNextIconTemplate;
  _itemTemplate;
  itemTemplate;
  _thumbnailTemplate;
  thumbnailTemplate;
  maskVisible = false;
  numVisibleLimit = 0;
  _componentStyle = inject(GalleriaStyle);
  constructor(platformId, element, cd) {
    super();
    this.platformId = platformId;
    this.element = element;
    this.cd = cd;
  }
  templates;
  ngAfterContentInit() {
    this.templates?.forEach((item) => {
      switch (item.getType()) {
        case "header":
          this.headerFacet = item.template;
          break;
        case "footer":
          this.footerFacet = item.template;
          break;
        case "indicator":
          this.indicatorFacet = item.template;
          break;
        case "closeicon":
          this.closeIconTemplate = item.template;
          break;
        case "itemnexticon":
          this.itemNextIconTemplate = item.template;
          break;
        case "itempreviousicon":
          this.itemPreviousIconTemplate = item.template;
          break;
        case "previousthumbnailicon":
          this.previousThumbnailIconTemplate = item.template;
          break;
        case "nextthumbnailicon":
          this.nextThumbnailIconTemplate = item.template;
          break;
        case "caption":
          this.captionFacet = item.template;
          break;
        case "item":
          this.itemTemplate = item.template;
          break;
        case "thumbnail":
          this.thumbnailTemplate = item.template;
          break;
      }
    });
  }
  ngOnChanges(simpleChanges) {
    super.ngOnChanges(simpleChanges);
    if (simpleChanges.value && simpleChanges.value.currentValue?.length < this.numVisible) {
      this.numVisibleLimit = simpleChanges.value.currentValue.length;
    } else {
      this.numVisibleLimit = 0;
    }
  }
  onMaskHide() {
    this.visible = false;
    this.visibleChange.emit(false);
  }
  onActiveItemChange(index) {
    if (this.activeIndex !== index) {
      this.activeIndex = index;
      this.activeIndexChange.emit(index);
    }
  }
  onAnimationStart(event) {
    switch (event.toState) {
      case "visible":
        this.enableModality();
        setTimeout(() => {
          focus(findSingle(this.container.nativeElement, '[data-pc-section="closebutton"]'));
        }, 25);
        break;
      case "void":
        addClass(this.mask?.nativeElement, "p-overlay-mask-leave");
        break;
    }
  }
  onAnimationEnd(event) {
    switch (event.toState) {
      case "void":
        this.disableModality();
        break;
    }
  }
  enableModality() {
    blockBodyScroll();
    this.cd.markForCheck();
    if (this.mask) {
      zindexutils.set("modal", this.mask.nativeElement, this.baseZIndex || this.config.zIndex.modal);
    }
  }
  disableModality() {
    unblockBodyScroll();
    this.maskVisible = false;
    this.cd.markForCheck();
    if (this.mask) {
      zindexutils.clear(this.mask.nativeElement);
    }
  }
  ngOnDestroy() {
    if (this.fullScreen) {
      removeClass(this.document.body, "p-overflow-hidden");
    }
    if (this.mask) {
      this.disableModality();
    }
  }
  static \u0275fac = function Galleria_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Galleria)(\u0275\u0275directiveInject(PLATFORM_ID), \u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(ChangeDetectorRef));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _Galleria,
    selectors: [["p-galleria"]],
    contentQueries: function Galleria_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        \u0275\u0275contentQuery(dirIndex, _c02, 4);
        \u0275\u0275contentQuery(dirIndex, _c17, 4);
        \u0275\u0275contentQuery(dirIndex, _c22, 4);
        \u0275\u0275contentQuery(dirIndex, _c32, 4);
        \u0275\u0275contentQuery(dirIndex, _c42, 4);
        \u0275\u0275contentQuery(dirIndex, _c52, 4);
        \u0275\u0275contentQuery(dirIndex, _c62, 4);
        \u0275\u0275contentQuery(dirIndex, _c72, 4);
        \u0275\u0275contentQuery(dirIndex, _c82, 4);
        \u0275\u0275contentQuery(dirIndex, _c92, 4);
        \u0275\u0275contentQuery(dirIndex, _c102, 4);
        \u0275\u0275contentQuery(dirIndex, PrimeTemplate, 4);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.headerTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.footerTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.indicatorTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.captionTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._closeIconTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._previousThumbnailIconTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._nextThumbnailIconTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._itemPreviousIconTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._itemNextIconTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._itemTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._thumbnailTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.templates = _t);
      }
    },
    viewQuery: function Galleria_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c112, 5);
        \u0275\u0275viewQuery(_c122, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.mask = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.container = _t.first);
      }
    },
    inputs: {
      activeIndex: "activeIndex",
      fullScreen: [2, "fullScreen", "fullScreen", booleanAttribute],
      id: "id",
      value: "value",
      numVisible: [2, "numVisible", "numVisible", numberAttribute],
      responsiveOptions: "responsiveOptions",
      showItemNavigators: [2, "showItemNavigators", "showItemNavigators", booleanAttribute],
      showThumbnailNavigators: [2, "showThumbnailNavigators", "showThumbnailNavigators", booleanAttribute],
      showItemNavigatorsOnHover: [2, "showItemNavigatorsOnHover", "showItemNavigatorsOnHover", booleanAttribute],
      changeItemOnIndicatorHover: [2, "changeItemOnIndicatorHover", "changeItemOnIndicatorHover", booleanAttribute],
      circular: [2, "circular", "circular", booleanAttribute],
      autoPlay: [2, "autoPlay", "autoPlay", booleanAttribute],
      shouldStopAutoplayByClick: [2, "shouldStopAutoplayByClick", "shouldStopAutoplayByClick", booleanAttribute],
      transitionInterval: [2, "transitionInterval", "transitionInterval", numberAttribute],
      showThumbnails: [2, "showThumbnails", "showThumbnails", booleanAttribute],
      thumbnailsPosition: "thumbnailsPosition",
      verticalThumbnailViewPortHeight: "verticalThumbnailViewPortHeight",
      showIndicators: [2, "showIndicators", "showIndicators", booleanAttribute],
      showIndicatorsOnItem: [2, "showIndicatorsOnItem", "showIndicatorsOnItem", booleanAttribute],
      indicatorsPosition: "indicatorsPosition",
      baseZIndex: [2, "baseZIndex", "baseZIndex", numberAttribute],
      maskClass: "maskClass",
      containerClass: "containerClass",
      containerStyle: "containerStyle",
      showTransitionOptions: "showTransitionOptions",
      hideTransitionOptions: "hideTransitionOptions",
      visible: "visible"
    },
    outputs: {
      activeIndexChange: "activeIndexChange",
      visibleChange: "visibleChange"
    },
    standalone: false,
    features: [\u0275\u0275ProvidersFeature([GalleriaStyle]), \u0275\u0275InheritDefinitionFeature, \u0275\u0275NgOnChangesFeature],
    decls: 3,
    vars: 2,
    consts: [["windowed", ""], ["container", ""], ["mask", ""], [4, "ngIf", "ngIfElse"], [3, "ngClass", "class", 4, "ngIf"], [3, "ngClass"], [3, "value", "activeIndex", "numVisible", "ngStyle", "fullScreen", "maskHide", "activeItemChange", 4, "ngIf"], [3, "maskHide", "activeItemChange", "value", "activeIndex", "numVisible", "ngStyle", "fullScreen"], [3, "activeItemChange", "value", "activeIndex", "numVisible"]],
    template: function Galleria_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275template(0, Galleria_div_0_Template, 3, 1, "div", 3)(1, Galleria_ng_template_1_Template, 1, 3, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
      }
      if (rf & 2) {
        const windowed_r4 = \u0275\u0275reference(2);
        \u0275\u0275property("ngIf", ctx.fullScreen)("ngIfElse", windowed_r4);
      }
    },
    dependencies: () => [NgClass, NgIf, NgStyle, GalleriaContent],
    encapsulation: 2,
    data: {
      animation: [trigger("animation", [transition("void => visible", [style({
        transform: "scale(0.7)",
        opacity: 0
      }), animate("{{showTransitionParams}}")]), transition("visible => void", [animate("{{hideTransitionParams}}", style({
        transform: "scale(0.7)",
        opacity: 0
      }))])])]
    },
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Galleria, [{
    type: Component,
    args: [{
      selector: "p-galleria",
      standalone: false,
      template: `
        <div *ngIf="fullScreen; else windowed" #container>
            <div *ngIf="maskVisible" #mask [ngClass]="{ 'p-galleria-mask p-overlay-mask p-overlay-mask-enter': true }" [class]="maskClass" [attr.role]="fullScreen ? 'dialog' : 'region'" [attr.aria-modal]="fullScreen ? 'true' : undefined">
                <p-galleriaContent
                    *ngIf="visible"
                    [@animation]="{
                        value: 'visible',
                        params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions }
                    }"
                    (@animation.start)="onAnimationStart($event)"
                    (@animation.done)="onAnimationEnd($event)"
                    [value]="value"
                    [activeIndex]="activeIndex"
                    [numVisible]="numVisibleLimit || numVisible"
                    (maskHide)="onMaskHide()"
                    (activeItemChange)="onActiveItemChange($event)"
                    [ngStyle]="containerStyle"
                    [fullScreen]="fullScreen"
                ></p-galleriaContent>
            </div>
        </div>

        <ng-template #windowed>
            <p-galleriaContent [value]="value" [activeIndex]="activeIndex" [numVisible]="numVisibleLimit || numVisible" (activeItemChange)="onActiveItemChange($event)"></p-galleriaContent>
        </ng-template>
    `,
      animations: [trigger("animation", [transition("void => visible", [style({
        transform: "scale(0.7)",
        opacity: 0
      }), animate("{{showTransitionParams}}")]), transition("visible => void", [animate("{{hideTransitionParams}}", style({
        transform: "scale(0.7)",
        opacity: 0
      }))])])],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [GalleriaStyle]
    }]
  }], () => [{
    type: void 0,
    decorators: [{
      type: Inject,
      args: [PLATFORM_ID]
    }]
  }, {
    type: ElementRef
  }, {
    type: ChangeDetectorRef
  }], {
    activeIndex: [{
      type: Input
    }],
    fullScreen: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    id: [{
      type: Input
    }],
    value: [{
      type: Input
    }],
    numVisible: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    responsiveOptions: [{
      type: Input
    }],
    showItemNavigators: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    showThumbnailNavigators: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    showItemNavigatorsOnHover: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    changeItemOnIndicatorHover: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    circular: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    autoPlay: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    shouldStopAutoplayByClick: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    transitionInterval: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    showThumbnails: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    thumbnailsPosition: [{
      type: Input
    }],
    verticalThumbnailViewPortHeight: [{
      type: Input
    }],
    showIndicators: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    showIndicatorsOnItem: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    indicatorsPosition: [{
      type: Input
    }],
    baseZIndex: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    maskClass: [{
      type: Input
    }],
    containerClass: [{
      type: Input
    }],
    containerStyle: [{
      type: Input
    }],
    showTransitionOptions: [{
      type: Input
    }],
    hideTransitionOptions: [{
      type: Input
    }],
    visible: [{
      type: Input
    }],
    activeIndexChange: [{
      type: Output
    }],
    visibleChange: [{
      type: Output
    }],
    mask: [{
      type: ViewChild,
      args: ["mask"]
    }],
    container: [{
      type: ViewChild,
      args: ["container"]
    }],
    headerTemplate: [{
      type: ContentChild,
      args: ["header", {
        descendants: false
      }]
    }],
    footerTemplate: [{
      type: ContentChild,
      args: ["footer", {
        descendants: false,
        static: false
      }]
    }],
    indicatorTemplate: [{
      type: ContentChild,
      args: ["indicator", {
        descendants: false
      }]
    }],
    captionTemplate: [{
      type: ContentChild,
      args: ["caption", {
        descendants: false
      }]
    }],
    _closeIconTemplate: [{
      type: ContentChild,
      args: ["closeicon", {
        descendants: false
      }]
    }],
    _previousThumbnailIconTemplate: [{
      type: ContentChild,
      args: ["previousthumbnailicon", {
        descendants: false
      }]
    }],
    _nextThumbnailIconTemplate: [{
      type: ContentChild,
      args: ["nextthumbnailicon", {
        descendants: false
      }]
    }],
    _itemPreviousIconTemplate: [{
      type: ContentChild,
      args: ["itempreviousicon", {
        descendants: false
      }]
    }],
    _itemNextIconTemplate: [{
      type: ContentChild,
      args: ["itemnexticon", {
        descendants: false
      }]
    }],
    _itemTemplate: [{
      type: ContentChild,
      args: ["item", {
        descendants: false
      }]
    }],
    _thumbnailTemplate: [{
      type: ContentChild,
      args: ["thumbnail", {
        descendants: false,
        static: false
      }]
    }],
    templates: [{
      type: ContentChildren,
      args: [PrimeTemplate]
    }]
  });
})();
var GalleriaContent = class _GalleriaContent extends BaseComponent {
  galleria;
  cd;
  differs;
  elementRef;
  get activeIndex() {
    return this._activeIndex;
  }
  set activeIndex(activeIndex) {
    this._activeIndex = activeIndex;
  }
  value = [];
  numVisible;
  fullScreen;
  maskHide = new EventEmitter();
  activeItemChange = new EventEmitter();
  closeButton;
  id;
  _activeIndex = 0;
  slideShowActive = true;
  interval;
  styleClass;
  differ;
  constructor(galleria, cd, differs, elementRef) {
    super();
    this.galleria = galleria;
    this.cd = cd;
    this.differs = differs;
    this.elementRef = elementRef;
    this.id = this.galleria.id || uuid("pn_id_");
    this.differ = this.differs.find(this.galleria).create();
  }
  // For custom fullscreen
  handleFullscreenChange(event) {
    if (document?.fullscreenElement === this.elementRef.nativeElement?.children[0]) {
      this.fullScreen = true;
    } else {
      this.fullScreen = false;
    }
  }
  ngDoCheck() {
    if (isPlatformBrowser(this.galleria.platformId)) {
      const changes = this.differ.diff(this.galleria);
      if (changes && changes.forEachItem.length > 0) {
        this.cd.markForCheck();
      }
    }
  }
  shouldRenderFooter() {
    return this.galleria.footerFacet && this.galleria.templates.toArray().length > 0 || this.galleria.footerTemplate;
  }
  galleriaClass() {
    const thumbnailsPosClass = this.galleria.showThumbnails && this.getPositionClass("p-galleria-thumbnails", this.galleria.thumbnailsPosition);
    const indicatorPosClass = this.galleria.showIndicators && this.getPositionClass("p-galleria-indicators", this.galleria.indicatorsPosition);
    return (this.galleria.containerClass ? this.galleria.containerClass + " " : "") + (thumbnailsPosClass ? thumbnailsPosClass + " " : "") + (indicatorPosClass ? indicatorPosClass + " " : "");
  }
  startSlideShow() {
    if (isPlatformBrowser(this.galleria.platformId)) {
      this.interval = setInterval(() => {
        let activeIndex = this.galleria.circular && this.value.length - 1 === this.activeIndex ? 0 : this.activeIndex + 1;
        this.onActiveIndexChange(activeIndex);
        this.activeIndex = activeIndex;
      }, this.galleria.transitionInterval);
      this.slideShowActive = true;
    }
  }
  stopSlideShow() {
    if (this.galleria.autoPlay && !this.galleria.shouldStopAutoplayByClick) {
      return;
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.slideShowActive = false;
  }
  getPositionClass(preClassName, position) {
    const positions = ["top", "left", "bottom", "right"];
    const pos = positions.find((item) => item === position);
    return pos ? `${preClassName}-${pos}` : "";
  }
  isVertical() {
    return this.galleria.thumbnailsPosition === "left" || this.galleria.thumbnailsPosition === "right";
  }
  onActiveIndexChange(index) {
    if (this.activeIndex !== index) {
      this.activeIndex = index;
      this.activeItemChange.emit(this.activeIndex);
    }
  }
  closeAriaLabel() {
    return this.config.translation.aria ? this.config.translation.aria.close : void 0;
  }
  static \u0275fac = function GalleriaContent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GalleriaContent)(\u0275\u0275directiveInject(Galleria), \u0275\u0275directiveInject(ChangeDetectorRef), \u0275\u0275directiveInject(KeyValueDiffers), \u0275\u0275directiveInject(ElementRef));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _GalleriaContent,
    selectors: [["p-galleriaContent"]],
    viewQuery: function GalleriaContent_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c162, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.closeButton = _t.first);
      }
    },
    hostBindings: function GalleriaContent_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("fullscreenchange", function GalleriaContent_fullscreenchange_HostBindingHandler($event) {
          return ctx.handleFullscreenChange($event);
        }, false, \u0275\u0275resolveDocument);
      }
    },
    inputs: {
      activeIndex: "activeIndex",
      value: "value",
      numVisible: [2, "numVisible", "numVisible", numberAttribute],
      fullScreen: [2, "fullScreen", "fullScreen", booleanAttribute]
    },
    outputs: {
      maskHide: "maskHide",
      activeItemChange: "activeItemChange"
    },
    standalone: false,
    features: [\u0275\u0275InheritDefinitionFeature],
    decls: 1,
    vars: 1,
    consts: [["pFocusTrap", "", 3, "ngClass", "ngStyle", "class", "pFocusTrapDisabled", 4, "ngIf"], ["pFocusTrap", "", 3, "ngClass", "ngStyle", "pFocusTrapDisabled"], ["type", "button", "class", "p-galleria-close-button", 3, "click", 4, "ngIf"], ["class", "p-galleria-header", 4, "ngIf"], [1, "p-galleria-content"], [3, "onActiveIndexChange", "startSlideShow", "stopSlideShow", "id", "value", "activeIndex", "circular", "templates", "showIndicators", "changeItemOnIndicatorHover", "indicatorFacet", "captionFacet", "showItemNavigators", "autoPlay", "slideShowActive"], [3, "containerId", "value", "activeIndex", "templates", "numVisible", "responsiveOptions", "circular", "isVertical", "contentHeight", "showThumbnailNavigators", "slideShowActive", "onActiveIndexChange", "stopSlideShow", 4, "ngIf"], ["class", "p-galleria-footer", 4, "ngIf"], ["type", "button", 1, "p-galleria-close-button", 3, "click"], [3, "styleClass", 4, "ngIf"], [4, "ngTemplateOutlet"], [3, "styleClass"], [1, "p-galleria-header"], ["type", "header", 3, "templates"], [3, "onActiveIndexChange", "stopSlideShow", "containerId", "value", "activeIndex", "templates", "numVisible", "responsiveOptions", "circular", "isVertical", "contentHeight", "showThumbnailNavigators", "slideShowActive"], [1, "p-galleria-footer"], ["type", "footer", 3, "templates"]],
    template: function GalleriaContent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275template(0, GalleriaContent_div_0_Template, 7, 29, "div", 0);
      }
      if (rf & 2) {
        \u0275\u0275property("ngIf", ctx.value && ctx.value.length > 0);
      }
    },
    dependencies: () => [NgClass, NgIf, NgTemplateOutlet, NgStyle, TimesIcon, FocusTrap, GalleriaItemSlot, GalleriaItem, GalleriaThumbnails],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GalleriaContent, [{
    type: Component,
    args: [{
      selector: "p-galleriaContent",
      standalone: false,
      template: `
        <div
            [attr.id]="id"
            [attr.role]="'region'"
            *ngIf="value && value.length > 0"
            [ngClass]="{
                'p-galleria p-component': true,
                'p-galleria-fullscreen': this.galleria.fullScreen,
                'p-galleria-inset-indicators': this.galleria.showIndicatorsOnItem,
                'p-galleria-hover-navigators': this.galleria.showItemNavigatorsOnHover && !this.galleria.fullScreen
            }"
            [ngStyle]="!galleria.fullScreen ? galleria.containerStyle : {}"
            [class]="galleriaClass()"
            pFocusTrap
            [pFocusTrapDisabled]="!fullScreen"
        >
            <button *ngIf="galleria.fullScreen" type="button" class="p-galleria-close-button" (click)="maskHide.emit()" [attr.aria-label]="closeAriaLabel()" [attr.data-pc-section]="'closebutton'">
                <TimesIcon *ngIf="!galleria.closeIconTemplate && !galleria._closeIconTemplate" [styleClass]="'p-galleria-close-icon'" />
                <ng-template *ngTemplateOutlet="galleria.closeIconTemplate || galleria._closeIconTemplate"></ng-template>
            </button>
            <div *ngIf="galleria.templates && (galleria.headerFacet || galleria.headerTemplate)" class="p-galleria-header">
                <p-galleriaItemSlot type="header" [templates]="galleria.templates"></p-galleriaItemSlot>
            </div>
            <div class="p-galleria-content" [attr.aria-live]="galleria.autoPlay ? 'polite' : 'off'">
                <p-galleriaItem
                    [id]="id"
                    [value]="value"
                    [activeIndex]="activeIndex"
                    [circular]="galleria.circular"
                    [templates]="galleria.templates"
                    (onActiveIndexChange)="onActiveIndexChange($event)"
                    [showIndicators]="galleria.showIndicators"
                    [changeItemOnIndicatorHover]="galleria.changeItemOnIndicatorHover"
                    [indicatorFacet]="galleria.indicatorFacet"
                    [captionFacet]="galleria.captionFacet"
                    [showItemNavigators]="galleria.showItemNavigators"
                    [autoPlay]="galleria.autoPlay"
                    [slideShowActive]="slideShowActive"
                    (startSlideShow)="startSlideShow()"
                    (stopSlideShow)="stopSlideShow()"
                ></p-galleriaItem>

                <p-galleriaThumbnails
                    *ngIf="galleria.showThumbnails"
                    [containerId]="id"
                    [value]="value"
                    (onActiveIndexChange)="onActiveIndexChange($event)"
                    [activeIndex]="activeIndex"
                    [templates]="galleria.templates"
                    [numVisible]="numVisible"
                    [responsiveOptions]="galleria.responsiveOptions"
                    [circular]="galleria.circular"
                    [isVertical]="isVertical()"
                    [contentHeight]="galleria.verticalThumbnailViewPortHeight"
                    [showThumbnailNavigators]="galleria.showThumbnailNavigators"
                    [slideShowActive]="slideShowActive"
                    (stopSlideShow)="stopSlideShow()"
                ></p-galleriaThumbnails>
            </div>
            <div *ngIf="shouldRenderFooter()" class="p-galleria-footer">
                <p-galleriaItemSlot type="footer" [templates]="galleria.templates"></p-galleriaItemSlot>
            </div>
        </div>
    `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], () => [{
    type: Galleria
  }, {
    type: ChangeDetectorRef
  }, {
    type: KeyValueDiffers
  }, {
    type: ElementRef
  }], {
    activeIndex: [{
      type: Input
    }],
    value: [{
      type: Input
    }],
    numVisible: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    fullScreen: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    maskHide: [{
      type: Output
    }],
    activeItemChange: [{
      type: Output
    }],
    closeButton: [{
      type: ViewChild,
      args: ["closeButton"]
    }],
    handleFullscreenChange: [{
      type: HostListener,
      args: ["document:fullscreenchange", ["$event"]]
    }]
  });
})();
var GalleriaItemSlot = class _GalleriaItemSlot {
  templates;
  index;
  get item() {
    return this._item;
  }
  shouldRender() {
    return this.contentTemplate || this.galleria._itemTemplate || this.galleria.itemTemplate || this.galleria.captionTemplate || this.galleria.captionTemplate || this.galleria.captionFacet || this.galleria.thumbnailTemplate || this.galleria._thumbnailTemplate || this.galleria.footerTemplate;
  }
  galleria = inject(Galleria);
  set item(item) {
    this._item = item;
    if (this.templates && this.templates?.toArray().length > 0) {
      this.templates.forEach((item2) => {
        if (item2.getType() === this.type) {
          switch (this.type) {
            case "item":
            case "caption":
            case "thumbnail":
              this.context = {
                $implicit: this.item
              };
              this.contentTemplate = item2.template;
              break;
            case "footer":
              this.context = {
                $implicit: this.item
              };
              this.contentTemplate = item2.template;
              break;
          }
        }
      });
    } else {
      this.getContentTemplate();
    }
  }
  getContentTemplate() {
    switch (this.type) {
      case "item":
        this.context = {
          $implicit: this.item
        };
        this.contentTemplate = this.galleria._itemTemplate || this.galleria.itemTemplate;
        break;
      case "caption":
        this.context = {
          $implicit: this.item
        };
        this.contentTemplate = this.galleria.captionTemplate || this.galleria.captionFacet;
        break;
      case "thumbnail":
        this.context = {
          $implicit: this.item
        };
        this.contentTemplate = this.galleria.thumbnailTemplate || this.galleria._thumbnailTemplate;
        break;
      case "indicator":
        this.context = {
          $implicit: this.index
        };
        this.contentTemplate = this.galleria.indicatorTemplate || this.galleria.indicatorFacet;
        break;
      case "footer":
        this.context = {
          $implicit: this.item
        };
        this.contentTemplate = this.galleria.footerTemplate || this.galleria.footerFacet;
        break;
      default:
        this.context = {
          $implicit: this.item
        };
        this.contentTemplate = this.galleria._itemTemplate || this.galleria.itemTemplate;
    }
  }
  type;
  contentTemplate;
  context;
  _item;
  ngAfterContentInit() {
    if (this.templates && this.templates.toArray().length > 0) {
      this.templates?.forEach((item) => {
        if (item.getType() === this.type) {
          switch (this.type) {
            case "item":
            case "caption":
            case "thumbnail":
              this.context = {
                $implicit: this.item
              };
              this.contentTemplate = item.template;
              break;
            case "indicator":
              this.context = {
                $implicit: this.index
              };
              this.contentTemplate = item.template;
              break;
            case "footer":
              this.context = {
                $implicit: this.item
              };
              this.contentTemplate = item.template;
              break;
            default:
              this.context = {
                $implicit: this.item
              };
              this.contentTemplate = item.template;
              break;
          }
        }
      });
    } else {
      this.getContentTemplate();
    }
  }
  static \u0275fac = function GalleriaItemSlot_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GalleriaItemSlot)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _GalleriaItemSlot,
    selectors: [["p-galleriaItemSlot"]],
    inputs: {
      templates: "templates",
      index: [2, "index", "index", numberAttribute],
      item: "item",
      type: "type"
    },
    standalone: false,
    decls: 1,
    vars: 1,
    consts: [[4, "ngIf"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"]],
    template: function GalleriaItemSlot_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275template(0, GalleriaItemSlot_ng_container_0_Template, 2, 2, "ng-container", 0);
      }
      if (rf & 2) {
        \u0275\u0275property("ngIf", ctx.shouldRender());
      }
    },
    dependencies: [NgIf, NgTemplateOutlet],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GalleriaItemSlot, [{
    type: Component,
    args: [{
      selector: "p-galleriaItemSlot",
      standalone: false,
      template: `
        <ng-container *ngIf="shouldRender()">
            <ng-container *ngTemplateOutlet="contentTemplate; context: context"></ng-container>
        </ng-container>
    `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, {
    templates: [{
      type: Input
    }],
    index: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    item: [{
      type: Input
    }],
    type: [{
      type: Input
    }]
  });
})();
var GalleriaItem = class _GalleriaItem {
  galleria;
  id;
  circular = false;
  value;
  showItemNavigators = false;
  showIndicators = true;
  slideShowActive = true;
  changeItemOnIndicatorHover = true;
  autoPlay = false;
  templates;
  indicatorFacet;
  captionFacet;
  startSlideShow = new EventEmitter();
  stopSlideShow = new EventEmitter();
  onActiveIndexChange = new EventEmitter();
  get activeIndex() {
    return this._activeIndex;
  }
  set activeIndex(activeIndex) {
    this._activeIndex = activeIndex;
  }
  get activeItem() {
    return this.value && this.value[this._activeIndex];
  }
  _activeIndex = 0;
  leftButtonFocused = false;
  rightButtonFocused = false;
  constructor(galleria) {
    this.galleria = galleria;
  }
  ngOnChanges({
    autoPlay
  }) {
    if (autoPlay?.currentValue) {
      this.startSlideShow.emit();
    }
    if (autoPlay && autoPlay.currentValue === false) {
      this.stopTheSlideShow();
    }
  }
  next() {
    let nextItemIndex = this.activeIndex + 1;
    let activeIndex = this.circular && this.value.length - 1 === this.activeIndex ? 0 : nextItemIndex;
    this.onActiveIndexChange.emit(activeIndex);
  }
  prev() {
    let prevItemIndex = this.activeIndex !== 0 ? this.activeIndex - 1 : 0;
    let activeIndex = this.circular && this.activeIndex === 0 ? this.value.length - 1 : prevItemIndex;
    this.onActiveIndexChange.emit(activeIndex);
  }
  onButtonFocus(pos) {
    if (pos === "left") {
      this.leftButtonFocused = true;
    } else this.rightButtonFocused = true;
  }
  onButtonBlur(pos) {
    if (pos === "left") {
      this.leftButtonFocused = false;
    } else this.rightButtonFocused = false;
  }
  stopTheSlideShow() {
    if (this.slideShowActive && this.stopSlideShow) {
      this.stopSlideShow.emit();
    }
  }
  navForward(e) {
    this.stopTheSlideShow();
    this.next();
    if (e && e.cancelable) {
      e.preventDefault();
    }
  }
  navBackward(e) {
    this.stopTheSlideShow();
    this.prev();
    if (e && e.cancelable) {
      e.preventDefault();
    }
  }
  onIndicatorClick(index) {
    this.stopTheSlideShow();
    this.onActiveIndexChange.emit(index);
  }
  onIndicatorMouseEnter(index) {
    if (this.changeItemOnIndicatorHover) {
      this.stopTheSlideShow();
      this.onActiveIndexChange.emit(index);
    }
  }
  onIndicatorKeyDown(event, index) {
    switch (event.code) {
      case "Enter":
      case "Space":
        this.stopTheSlideShow();
        this.onActiveIndexChange.emit(index);
        event.preventDefault();
        break;
      case "ArrowDown":
      case "ArrowUp":
        event.preventDefault();
        break;
      default:
        break;
    }
  }
  isNavForwardDisabled() {
    return !this.circular && this.activeIndex === this.value.length - 1;
  }
  isNavBackwardDisabled() {
    return !this.circular && this.activeIndex === 0;
  }
  isIndicatorItemActive(index) {
    return this.activeIndex === index;
  }
  ariaSlideLabel() {
    return this.galleria.config.translation.aria ? this.galleria.config.translation.aria.slide : void 0;
  }
  ariaSlideNumber(value) {
    return this.galleria.config.translation.aria ? this.galleria.config.translation.aria.slideNumber.replace(/{slideNumber}/g, value) : void 0;
  }
  ariaPageLabel(value) {
    return this.galleria.config.translation.aria ? this.galleria.config.translation.aria.pageLabel.replace(/{page}/g, value) : void 0;
  }
  static \u0275fac = function GalleriaItem_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GalleriaItem)(\u0275\u0275directiveInject(Galleria));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _GalleriaItem,
    selectors: [["p-galleriaItem"]],
    hostAttrs: [1, "p-galleria-items-container"],
    inputs: {
      id: "id",
      circular: [2, "circular", "circular", booleanAttribute],
      value: "value",
      showItemNavigators: [2, "showItemNavigators", "showItemNavigators", booleanAttribute],
      showIndicators: [2, "showIndicators", "showIndicators", booleanAttribute],
      slideShowActive: [2, "slideShowActive", "slideShowActive", booleanAttribute],
      changeItemOnIndicatorHover: [2, "changeItemOnIndicatorHover", "changeItemOnIndicatorHover", booleanAttribute],
      autoPlay: [2, "autoPlay", "autoPlay", booleanAttribute],
      templates: "templates",
      indicatorFacet: "indicatorFacet",
      captionFacet: "captionFacet",
      activeIndex: "activeIndex"
    },
    outputs: {
      startSlideShow: "startSlideShow",
      stopSlideShow: "stopSlideShow",
      onActiveIndexChange: "onActiveIndexChange"
    },
    standalone: false,
    features: [\u0275\u0275NgOnChangesFeature],
    decls: 7,
    vars: 9,
    consts: [[1, "p-galleria-items"], ["type", "button", "role", "navigation", 3, "ngClass", "disabled", "click", "focus", "blur", 4, "ngIf"], ["role", "group", 1, "p-galleria-item", 3, "id"], ["type", "item", 1, "p-galleria-item", 3, "item", "templates"], ["class", "p-galleria-caption", 4, "ngIf"], ["class", "p-galleria-indicator-list", 4, "ngIf"], ["type", "button", "role", "navigation", 3, "click", "focus", "blur", "ngClass", "disabled"], [3, "styleClass", 4, "ngIf"], [4, "ngTemplateOutlet"], [3, "styleClass"], [1, "p-galleria-caption"], ["type", "caption", 3, "item", "templates"], [1, "p-galleria-indicator-list"], ["tabindex", "0", 3, "ngClass", "click", "mouseenter", "keydown", 4, "ngFor", "ngForOf"], ["tabindex", "0", 3, "click", "mouseenter", "keydown", "ngClass"], ["type", "button", "tabIndex", "-1", "class", "p-galleria-indicator-button", 4, "ngIf"], ["type", "indicator", 3, "index", "templates"], ["type", "button", "tabIndex", "-1", 1, "p-galleria-indicator-button"]],
    template: function GalleriaItem_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0);
        \u0275\u0275template(1, GalleriaItem_button_1_Template, 3, 6, "button", 1);
        \u0275\u0275elementStart(2, "div", 2);
        \u0275\u0275element(3, "p-galleriaItemSlot", 3);
        \u0275\u0275elementEnd();
        \u0275\u0275template(4, GalleriaItem_button_4_Template, 3, 6, "button", 1)(5, GalleriaItem_div_5_Template, 2, 2, "div", 4);
        \u0275\u0275elementEnd();
        \u0275\u0275template(6, GalleriaItem_ul_6_Template, 2, 1, "ul", 5);
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showItemNavigators);
        \u0275\u0275advance();
        \u0275\u0275property("id", ctx.id + "_item_" + ctx.activeIndex);
        \u0275\u0275attribute("aria-label", ctx.ariaSlideNumber(ctx.activeIndex + 1))("aria-roledescription", ctx.ariaSlideLabel());
        \u0275\u0275advance();
        \u0275\u0275property("item", ctx.activeItem)("templates", ctx.templates);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showItemNavigators);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.captionFacet || ctx.galleria.captionTemplate);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showIndicators);
      }
    },
    dependencies: () => [NgClass, NgForOf, NgIf, NgTemplateOutlet, ChevronRightIcon, ChevronLeftIcon, GalleriaItemSlot],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GalleriaItem, [{
    type: Component,
    args: [{
      selector: "p-galleriaItem",
      standalone: false,
      template: `
        <div class="p-galleria-items">
            <button
                *ngIf="showItemNavigators"
                type="button"
                role="navigation"
                [ngClass]="{ 'p-galleria-prev-button p-galleria-nav-button': true, 'p-disabled': this.isNavBackwardDisabled() }"
                (click)="navBackward($event)"
                [disabled]="isNavBackwardDisabled()"
                (focus)="onButtonFocus('left')"
                (blur)="onButtonBlur('left')"
            >
                <ChevronLeftIcon *ngIf="!galleria.itemPreviousIconTemplate && !galleria._itemPreviousIconTemplate" [styleClass]="'p-galleria-prev-icon'" />
                <ng-template *ngTemplateOutlet="galleria.itemPreviousIconTemplate || galleria._itemPreviousIconTemplate"></ng-template>
            </button>
            <div [id]="id + '_item_' + activeIndex" role="group" class="p-galleria-item" [attr.aria-label]="ariaSlideNumber(activeIndex + 1)" [attr.aria-roledescription]="ariaSlideLabel()">
                <p-galleriaItemSlot type="item" [item]="activeItem" [templates]="templates" class="p-galleria-item"></p-galleriaItemSlot>
            </div>
            <button
                *ngIf="showItemNavigators"
                type="button"
                [ngClass]="{ 'p-galleria-next-button p-galleria-nav-button': true, 'p-disabled': this.isNavForwardDisabled() }"
                (click)="navForward($event)"
                [disabled]="isNavForwardDisabled()"
                role="navigation"
                (focus)="onButtonFocus('right')"
                (blur)="onButtonBlur('right')"
            >
                <ChevronRightIcon *ngIf="!galleria.itemNextIconTemplate && !galleria._itemNextIconTemplate" [styleClass]="'p-galleria-next-icon'" />
                <ng-template *ngTemplateOutlet="galleria.itemNextIconTemplate || galleria._itemNextIconTemplate"></ng-template>
            </button>
            <div class="p-galleria-caption" *ngIf="captionFacet || galleria.captionTemplate">
                <p-galleriaItemSlot type="caption" [item]="activeItem" [templates]="templates"></p-galleriaItemSlot>
            </div>
        </div>
        <ul *ngIf="showIndicators" class="p-galleria-indicator-list">
            <li
                *ngFor="let item of value; let index = index"
                tabindex="0"
                (click)="onIndicatorClick(index)"
                (mouseenter)="onIndicatorMouseEnter(index)"
                (keydown)="onIndicatorKeyDown($event, index)"
                [ngClass]="{ 'p-galleria-indicator': true, 'p-galleria-indicator-active': isIndicatorItemActive(index) }"
                [attr.aria-label]="ariaPageLabel(index + 1)"
                [attr.aria-selected]="activeIndex === index"
                [attr.aria-controls]="id + '_item_' + index"
            >
                <button type="button" tabIndex="-1" class="p-galleria-indicator-button" *ngIf="!indicatorFacet && !galleria.indicatorTemplate"></button>
                <p-galleriaItemSlot type="indicator" [index]="index" [templates]="templates"></p-galleriaItemSlot>
            </li>
        </ul>
    `,
      host: {
        class: "p-galleria-items-container"
      },
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], () => [{
    type: Galleria
  }], {
    id: [{
      type: Input
    }],
    circular: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    value: [{
      type: Input
    }],
    showItemNavigators: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    showIndicators: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    slideShowActive: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    changeItemOnIndicatorHover: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    autoPlay: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    templates: [{
      type: Input
    }],
    indicatorFacet: [{
      type: Input
    }],
    captionFacet: [{
      type: Input
    }],
    startSlideShow: [{
      type: Output
    }],
    stopSlideShow: [{
      type: Output
    }],
    onActiveIndexChange: [{
      type: Output
    }],
    activeIndex: [{
      type: Input
    }]
  });
})();
var GalleriaThumbnails = class _GalleriaThumbnails {
  galleria;
  document;
  platformId;
  renderer;
  cd;
  containerId;
  value;
  isVertical = false;
  slideShowActive = false;
  circular = false;
  responsiveOptions;
  contentHeight = "300px";
  showThumbnailNavigators = true;
  templates;
  onActiveIndexChange = new EventEmitter();
  stopSlideShow = new EventEmitter();
  itemsContainer;
  get numVisible() {
    return this._numVisible;
  }
  set numVisible(numVisible) {
    this._numVisible = numVisible;
    this._oldNumVisible = this.d_numVisible;
    this.d_numVisible = numVisible;
  }
  get activeIndex() {
    return this._activeIndex;
  }
  set activeIndex(activeIndex) {
    this._oldactiveIndex = this._activeIndex;
    this._activeIndex = activeIndex;
  }
  index;
  startPos = null;
  thumbnailsStyle = null;
  sortedResponsiveOptions = null;
  totalShiftedItems = 0;
  page = 0;
  documentResizeListener;
  _numVisible = 0;
  d_numVisible = 0;
  _oldNumVisible = 0;
  _activeIndex = 0;
  _oldactiveIndex = 0;
  constructor(galleria, document2, platformId, renderer, cd) {
    this.galleria = galleria;
    this.document = document2;
    this.platformId = platformId;
    this.renderer = renderer;
    this.cd = cd;
  }
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.createStyle();
      if (this.responsiveOptions) {
        this.bindDocumentListeners();
      }
    }
  }
  ngAfterContentChecked() {
    let totalShiftedItems = this.totalShiftedItems;
    if ((this._oldNumVisible !== this.d_numVisible || this._oldactiveIndex !== this._activeIndex) && this.itemsContainer) {
      if (this._activeIndex <= this.getMedianItemIndex()) {
        totalShiftedItems = 0;
      } else if (this.value.length - this.d_numVisible + this.getMedianItemIndex() < this._activeIndex) {
        totalShiftedItems = this.d_numVisible - this.value.length;
      } else if (this.value.length - this.d_numVisible < this._activeIndex && this.d_numVisible % 2 === 0) {
        totalShiftedItems = this._activeIndex * -1 + this.getMedianItemIndex() + 1;
      } else {
        totalShiftedItems = this._activeIndex * -1 + this.getMedianItemIndex();
      }
      if (totalShiftedItems !== this.totalShiftedItems) {
        this.totalShiftedItems = totalShiftedItems;
      }
      if (this.itemsContainer && this.itemsContainer.nativeElement) {
        this.itemsContainer.nativeElement.style.transform = this.isVertical ? `translate3d(0, ${totalShiftedItems * (100 / this.d_numVisible)}%, 0)` : `translate3d(${totalShiftedItems * (100 / this.d_numVisible)}%, 0, 0)`;
      }
      if (this._oldactiveIndex !== this._activeIndex) {
        removeClass(this.itemsContainer.nativeElement, "p-items-hidden");
        this.itemsContainer.nativeElement.style.transition = "transform 500ms ease 0s";
      }
      this._oldactiveIndex = this._activeIndex;
      this._oldNumVisible = this.d_numVisible;
    }
  }
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.calculatePosition();
    }
  }
  createStyle() {
    if (!this.thumbnailsStyle) {
      this.thumbnailsStyle = this.document.createElement("style");
      this.document.body.appendChild(this.thumbnailsStyle);
    }
    let innerHTML = `
            #${this.containerId} .p-galleria-thumbnail-item {
                flex: 1 0 ${100 / this.d_numVisible}%
            }
        `;
    if (this.responsiveOptions) {
      this.sortedResponsiveOptions = [...this.responsiveOptions];
      this.sortedResponsiveOptions.sort((data1, data2) => {
        const value1 = data1.breakpoint;
        const value2 = data2.breakpoint;
        let result = null;
        if (value1 == null && value2 != null) result = -1;
        else if (value1 != null && value2 == null) result = 1;
        else if (value1 == null && value2 == null) result = 0;
        else if (typeof value1 === "string" && typeof value2 === "string") result = value1.localeCompare(value2, void 0, {
          numeric: true
        });
        else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
        return -1 * result;
      });
      for (let i = 0; i < this.sortedResponsiveOptions.length; i++) {
        let res = this.sortedResponsiveOptions[i];
        innerHTML += `
                    @media screen and (max-width: ${res.breakpoint}) {
                        #${this.containerId} .p-galleria-thumbnail-item {
                            flex: 1 0 ${100 / res.numVisible}%
                        }
                    }
                `;
      }
    }
    this.thumbnailsStyle.innerHTML = innerHTML;
    setAttribute(this.thumbnailsStyle, "nonce", this.galleria.config?.csp()?.nonce);
  }
  calculatePosition() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.itemsContainer && this.sortedResponsiveOptions) {
        let windowWidth = window.innerWidth;
        let matchedResponsiveData = {
          numVisible: this._numVisible
        };
        for (let i = 0; i < this.sortedResponsiveOptions.length; i++) {
          let res = this.sortedResponsiveOptions[i];
          if (parseInt(res.breakpoint, 10) >= windowWidth) {
            matchedResponsiveData = res;
          }
        }
        if (this.d_numVisible !== matchedResponsiveData.numVisible) {
          this.d_numVisible = matchedResponsiveData.numVisible;
          this.cd.markForCheck();
        }
      }
    }
  }
  getTabIndex(index) {
    return this.isItemActive(index) ? 0 : null;
  }
  navForward(e) {
    this.stopTheSlideShow();
    let nextItemIndex = this._activeIndex + 1;
    if (nextItemIndex + this.totalShiftedItems > this.getMedianItemIndex() && (-1 * this.totalShiftedItems < this.getTotalPageNumber() - 1 || this.circular)) {
      this.step(-1);
    }
    let activeIndex = this.circular && this.value.length - 1 === this._activeIndex ? 0 : nextItemIndex;
    this.onActiveIndexChange.emit(activeIndex);
    if (e.cancelable) {
      e.preventDefault();
    }
  }
  navBackward(e) {
    this.stopTheSlideShow();
    let prevItemIndex = this._activeIndex !== 0 ? this._activeIndex - 1 : 0;
    let diff = prevItemIndex + this.totalShiftedItems;
    if (this.d_numVisible - diff - 1 > this.getMedianItemIndex() && (-1 * this.totalShiftedItems !== 0 || this.circular)) {
      this.step(1);
    }
    let activeIndex = this.circular && this._activeIndex === 0 ? this.value.length - 1 : prevItemIndex;
    this.onActiveIndexChange.emit(activeIndex);
    if (e.cancelable) {
      e.preventDefault();
    }
  }
  onItemClick(index) {
    this.stopTheSlideShow();
    let selectedItemIndex = index;
    if (selectedItemIndex !== this._activeIndex) {
      const diff = selectedItemIndex + this.totalShiftedItems;
      let dir = 0;
      if (selectedItemIndex < this._activeIndex) {
        dir = this.d_numVisible - diff - 1 - this.getMedianItemIndex();
        if (dir > 0 && -1 * this.totalShiftedItems !== 0) {
          this.step(dir);
        }
      } else {
        dir = this.getMedianItemIndex() - diff;
        if (dir < 0 && -1 * this.totalShiftedItems < this.getTotalPageNumber() - 1) {
          this.step(dir);
        }
      }
      this.activeIndex = selectedItemIndex;
      this.onActiveIndexChange.emit(this.activeIndex);
    }
  }
  onThumbnailKeydown(event, index) {
    if (event.code === "Enter" || event.code === "Space") {
      this.onItemClick(index);
      event.preventDefault();
    }
    switch (event.code) {
      case "ArrowRight":
        this.onRightKey();
        break;
      case "ArrowLeft":
        this.onLeftKey();
        break;
      case "Home":
        this.onHomeKey();
        event.preventDefault();
        break;
      case "End":
        this.onEndKey();
        event.preventDefault();
        break;
      case "ArrowUp":
      case "ArrowDown":
        event.preventDefault();
        break;
      case "Tab":
        this.onTabKey();
        break;
      default:
        break;
    }
  }
  onRightKey() {
    const indicators = find(this.itemsContainer.nativeElement, '[data-pc-section="thumbnailitem"]');
    const activeIndex = this.findFocusedIndicatorIndex();
    this.changedFocusedIndicator(activeIndex, activeIndex + 1 === indicators.length ? indicators.length - 1 : activeIndex + 1);
  }
  onLeftKey() {
    const activeIndex = this.findFocusedIndicatorIndex();
    this.changedFocusedIndicator(activeIndex, activeIndex - 1 <= 0 ? 0 : activeIndex - 1);
  }
  onHomeKey() {
    const activeIndex = this.findFocusedIndicatorIndex();
    this.changedFocusedIndicator(activeIndex, 0);
  }
  onEndKey() {
    const indicators = find(this.itemsContainer.nativeElement, '[data-pc-section="thumbnailitem"]');
    const activeIndex = this.findFocusedIndicatorIndex();
    this.changedFocusedIndicator(activeIndex, indicators.length - 1);
  }
  onTabKey() {
    const indicators = [...find(this.itemsContainer.nativeElement, '[data-pc-section="thumbnailitem"]')];
    const highlightedIndex = indicators.findIndex((ind) => getAttribute(ind, "data-p-active") === true);
    const activeIndicator = findSingle(this.itemsContainer.nativeElement, '[tabindex="0"]');
    const activeIndex = indicators.findIndex((ind) => ind === activeIndicator.parentElement);
    indicators[activeIndex].children[0].tabIndex = "-1";
    indicators[highlightedIndex].children[0].tabIndex = "0";
  }
  findFocusedIndicatorIndex() {
    const indicators = [...find(this.itemsContainer.nativeElement, '[data-pc-section="thumbnailitem"]')];
    const activeIndicator = findSingle(this.itemsContainer.nativeElement, '[data-pc-section="thumbnailitem"] > [tabindex="0"]');
    return indicators.findIndex((ind) => ind === activeIndicator.parentElement);
  }
  changedFocusedIndicator(prevInd, nextInd) {
    const indicators = find(this.itemsContainer.nativeElement, '[data-pc-section="thumbnailitem"]');
    indicators[prevInd].children[0].tabIndex = "-1";
    indicators[nextInd].children[0].tabIndex = "0";
    indicators[nextInd].children[0].focus();
  }
  step(dir) {
    let totalShiftedItems = this.totalShiftedItems + dir;
    if (dir < 0 && -1 * totalShiftedItems + this.d_numVisible > this.value.length - 1) {
      totalShiftedItems = this.d_numVisible - this.value.length;
    } else if (dir > 0 && totalShiftedItems > 0) {
      totalShiftedItems = 0;
    }
    if (this.circular) {
      if (dir < 0 && this.value.length - 1 === this._activeIndex) {
        totalShiftedItems = 0;
      } else if (dir > 0 && this._activeIndex === 0) {
        totalShiftedItems = this.d_numVisible - this.value.length;
      }
    }
    if (this.itemsContainer) {
      removeClass(this.itemsContainer.nativeElement, "p-items-hidden");
      this.itemsContainer.nativeElement.style.transform = this.isVertical ? `translate3d(0, ${totalShiftedItems * (100 / this.d_numVisible)}%, 0)` : `translate3d(${totalShiftedItems * (100 / this.d_numVisible)}%, 0, 0)`;
      this.itemsContainer.nativeElement.style.transition = "transform 500ms ease 0s";
    }
    this.totalShiftedItems = totalShiftedItems;
  }
  stopTheSlideShow() {
    if (this.slideShowActive && this.stopSlideShow) {
      this.stopSlideShow.emit();
    }
  }
  changePageOnTouch(e, diff) {
    if (diff < 0) {
      this.navForward(e);
    } else {
      this.navBackward(e);
    }
  }
  getTotalPageNumber() {
    return this.value.length > this.d_numVisible ? this.value.length - this.d_numVisible + 1 : 0;
  }
  getMedianItemIndex() {
    let index = Math.floor(this.d_numVisible / 2);
    return this.d_numVisible % 2 ? index : index - 1;
  }
  onTransitionEnd() {
    if (this.itemsContainer && this.itemsContainer.nativeElement) {
      addClass(this.itemsContainer.nativeElement, "p-items-hidden");
      this.itemsContainer.nativeElement.style.transition = "";
    }
  }
  onTouchEnd(e) {
    let touchobj = e.changedTouches[0];
    if (this.isVertical) {
      this.changePageOnTouch(e, touchobj.pageY - this.startPos.y);
    } else {
      this.changePageOnTouch(e, touchobj.pageX - this.startPos.x);
    }
  }
  onTouchMove(e) {
    if (e.cancelable) {
      e.preventDefault();
    }
  }
  onTouchStart(e) {
    let touchobj = e.changedTouches[0];
    this.startPos = {
      x: touchobj.pageX,
      y: touchobj.pageY
    };
  }
  isNavBackwardDisabled() {
    return !this.circular && this._activeIndex === 0 || this.value.length <= this.d_numVisible;
  }
  isNavForwardDisabled() {
    return !this.circular && this._activeIndex === this.value.length - 1 || this.value.length <= this.d_numVisible;
  }
  firstItemAciveIndex() {
    return this.totalShiftedItems * -1;
  }
  lastItemActiveIndex() {
    return this.firstItemAciveIndex() + this.d_numVisible - 1;
  }
  isItemActive(index) {
    return this.firstItemAciveIndex() <= index && this.lastItemActiveIndex() >= index;
  }
  bindDocumentListeners() {
    if (isPlatformBrowser(this.platformId)) {
      const window2 = this.document.defaultView || "window";
      this.documentResizeListener = this.renderer.listen(window2, "resize", () => {
        this.calculatePosition();
      });
    }
  }
  unbindDocumentListeners() {
    if (this.documentResizeListener) {
      this.documentResizeListener();
      this.documentResizeListener = null;
    }
  }
  ngOnDestroy() {
    if (this.responsiveOptions) {
      this.unbindDocumentListeners();
    }
    if (this.thumbnailsStyle) {
      this.thumbnailsStyle.parentNode?.removeChild(this.thumbnailsStyle);
    }
  }
  ariaPrevButtonLabel() {
    return this.galleria.config.translation.aria ? this.galleria.config.translation.aria.prevPageLabel : void 0;
  }
  ariaNextButtonLabel() {
    return this.galleria.config.translation.aria ? this.galleria.config.translation.aria.nextPageLabel : void 0;
  }
  ariaPageLabel(value) {
    return this.galleria.config.translation.aria ? this.galleria.config.translation.aria.pageLabel.replace(/{page}/g, value) : void 0;
  }
  static \u0275fac = function GalleriaThumbnails_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GalleriaThumbnails)(\u0275\u0275directiveInject(Galleria), \u0275\u0275directiveInject(DOCUMENT), \u0275\u0275directiveInject(PLATFORM_ID), \u0275\u0275directiveInject(Renderer2), \u0275\u0275directiveInject(ChangeDetectorRef));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _GalleriaThumbnails,
    selectors: [["p-galleriaThumbnails"]],
    viewQuery: function GalleriaThumbnails_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c222, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.itemsContainer = _t.first);
      }
    },
    inputs: {
      containerId: "containerId",
      value: "value",
      isVertical: [2, "isVertical", "isVertical", booleanAttribute],
      slideShowActive: [2, "slideShowActive", "slideShowActive", booleanAttribute],
      circular: [2, "circular", "circular", booleanAttribute],
      responsiveOptions: "responsiveOptions",
      contentHeight: "contentHeight",
      showThumbnailNavigators: "showThumbnailNavigators",
      templates: "templates",
      numVisible: "numVisible",
      activeIndex: "activeIndex"
    },
    outputs: {
      onActiveIndexChange: "onActiveIndexChange",
      stopSlideShow: "stopSlideShow"
    },
    standalone: false,
    decls: 8,
    vars: 6,
    consts: [["itemsContainer", ""], [1, "p-galleria-thumbnails"], [1, "p-galleria-thumbnails-content"], ["type", "button", "pRipple", "", 3, "ngClass", "disabled", "click", 4, "ngIf"], [1, "p-galleria-thumbnails-viewport", 3, "ngStyle"], ["role", "tablist", 1, "p-galleria-thumbnail-items", 3, "transitionend", "touchstart", "touchmove"], [3, "ngClass", "keydown", 4, "ngFor", "ngForOf"], ["type", "button", "pRipple", "", 3, "click", "ngClass", "disabled"], [4, "ngIf"], [4, "ngTemplateOutlet"], [3, "styleClass", 4, "ngIf"], [3, "styleClass"], [3, "keydown", "ngClass"], [1, "p-galleria-thumbnail", 3, "click", "touchend", "keydown.enter"], ["type", "thumbnail", 3, "item", "templates"], [3, "ngClass", 4, "ngIf"], [3, "ngClass"]],
    template: function GalleriaThumbnails_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = \u0275\u0275getCurrentView();
        \u0275\u0275elementStart(0, "div", 1)(1, "div", 2);
        \u0275\u0275template(2, GalleriaThumbnails_button_2_Template, 3, 7, "button", 3);
        \u0275\u0275elementStart(3, "div", 4)(4, "div", 5, 0);
        \u0275\u0275listener("transitionend", function GalleriaThumbnails_Template_div_transitionend_4_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.onTransitionEnd());
        })("touchstart", function GalleriaThumbnails_Template_div_touchstart_4_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.onTouchStart($event));
        })("touchmove", function GalleriaThumbnails_Template_div_touchmove_4_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.onTouchMove($event));
        });
        \u0275\u0275template(6, GalleriaThumbnails_div_6_Template, 3, 15, "div", 6);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(7, GalleriaThumbnails_button_7_Template, 3, 7, "button", 3);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(2);
        \u0275\u0275property("ngIf", ctx.showThumbnailNavigators);
        \u0275\u0275advance();
        \u0275\u0275property("ngStyle", \u0275\u0275pureFunction1(4, _c23, ctx.isVertical ? ctx.contentHeight : ""));
        \u0275\u0275advance(3);
        \u0275\u0275property("ngForOf", ctx.value);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showThumbnailNavigators);
      }
    },
    dependencies: () => [NgClass, NgForOf, NgIf, NgTemplateOutlet, NgStyle, Ripple, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, GalleriaItemSlot],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GalleriaThumbnails, [{
    type: Component,
    args: [{
      selector: "p-galleriaThumbnails",
      standalone: false,
      template: `
        <div class="p-galleria-thumbnails">
            <div class="p-galleria-thumbnails-content">
                <button
                    *ngIf="showThumbnailNavigators"
                    type="button"
                    [ngClass]="{
                        'p-galleria-thumbnail-prev-button p-galleria-thumbnail-nav-button': true,
                        'p-disabled': this.isNavBackwardDisabled()
                    }"
                    (click)="navBackward($event)"
                    [disabled]="isNavBackwardDisabled()"
                    pRipple
                    [attr.aria-label]="ariaPrevButtonLabel()"
                >
                    <ng-container *ngIf="!galleria.previousThumbnailIconTemplate && !galleria._previousThumbnailIconTemplate">
                        <ChevronLeftIcon *ngIf="!isVertical" [styleClass]="'p-galleria-thumbnail-prev-icon'" />
                        <ChevronUpIcon *ngIf="isVertical" [styleClass]="'p-galleria-thumbnail-prev-icon'" />
                    </ng-container>
                    <ng-template *ngTemplateOutlet="galleria.previousThumbnailIconTemplate || galleria._previousThumbnailIconTemplate"></ng-template>
                </button>
                <div class="p-galleria-thumbnails-viewport" [ngStyle]="{ height: isVertical ? contentHeight : '' }">
                    <div #itemsContainer class="p-galleria-thumbnail-items" (transitionend)="onTransitionEnd()" (touchstart)="onTouchStart($event)" (touchmove)="onTouchMove($event)" role="tablist">
                        <div
                            *ngFor="let item of value; let index = index"
                            [ngClass]="{
                                'p-galleria-thumbnail-item': true,
                                'p-galleria-thumbnail-item-current': activeIndex === index,
                                'p-galleria-thumbnail-item-active': isItemActive(index),
                                'p-galleria-thumbnail-item-start': firstItemAciveIndex() === index,
                                'p-galleria-thumbnail-item-end': lastItemActiveIndex() === index
                            }"
                            [attr.aria-selected]="activeIndex === index"
                            [attr.aria-controls]="containerId + '_item_' + index"
                            [attr.data-pc-section]="'thumbnailitem'"
                            [attr.data-p-active]="activeIndex === index"
                            (keydown)="onThumbnailKeydown($event, index)"
                        >
                            <div
                                class="p-galleria-thumbnail"
                                [attr.tabindex]="activeIndex === index ? 0 : -1"
                                [attr.aria-current]="activeIndex === index ? 'page' : undefined"
                                [attr.aria-label]="ariaPageLabel(index + 1)"
                                (click)="onItemClick(index)"
                                (touchend)="onItemClick(index)"
                                (keydown.enter)="onItemClick(index)"
                            >
                                <p-galleriaItemSlot type="thumbnail" [item]="item" [templates]="templates"></p-galleriaItemSlot>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    *ngIf="showThumbnailNavigators"
                    type="button"
                    [ngClass]="{
                        'p-galleria-thumbnail-next-button p-galleria-thumbnail-nav-button': true,
                        'p-disabled': this.isNavForwardDisabled()
                    }"
                    (click)="navForward($event)"
                    [disabled]="isNavForwardDisabled()"
                    pRipple
                    [attr.aria-label]="ariaNextButtonLabel()"
                >
                    <ng-container *ngIf="!galleria.nextThumbnailIconTemplate && !galleria._nextThumbnailIconTemplate">
                        <ChevronRightIcon *ngIf="!isVertical" [ngClass]="'p-galleria-thumbnail-next-icon'" />
                        <ChevronDownIcon *ngIf="isVertical" [ngClass]="'p-galleria-thumbnail-next-icon'" />
                    </ng-container>
                    <ng-template *ngTemplateOutlet="galleria.nextThumbnailIconTemplate || galleria._nextThumbnailIconTemplate"></ng-template>
                </button>
            </div>
        </div>
    `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], () => [{
    type: Galleria
  }, {
    type: Document,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [PLATFORM_ID]
    }]
  }, {
    type: Renderer2
  }, {
    type: ChangeDetectorRef
  }], {
    containerId: [{
      type: Input
    }],
    value: [{
      type: Input
    }],
    isVertical: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    slideShowActive: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    circular: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    responsiveOptions: [{
      type: Input
    }],
    contentHeight: [{
      type: Input
    }],
    showThumbnailNavigators: [{
      type: Input
    }],
    templates: [{
      type: Input
    }],
    onActiveIndexChange: [{
      type: Output
    }],
    stopSlideShow: [{
      type: Output
    }],
    itemsContainer: [{
      type: ViewChild,
      args: ["itemsContainer"]
    }],
    numVisible: [{
      type: Input
    }],
    activeIndex: [{
      type: Input
    }]
  });
})();
var GalleriaModule = class _GalleriaModule {
  static \u0275fac = function GalleriaModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GalleriaModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _GalleriaModule
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [CommonModule, SharedModule, TimesIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, WindowMaximizeIcon, WindowMinimizeIcon, CommonModule, SharedModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GalleriaModule, [{
    type: NgModule,
    args: [{
      imports: [CommonModule, SharedModule, Ripple, TimesIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, WindowMaximizeIcon, WindowMinimizeIcon, FocusTrap],
      exports: [CommonModule, Galleria, GalleriaContent, GalleriaItemSlot, GalleriaItem, GalleriaThumbnails, SharedModule],
      declarations: [Galleria, GalleriaContent, GalleriaItemSlot, GalleriaItem, GalleriaThumbnails]
    }]
  }], null, null);
})();

// src/app/pages/service/photo.service.ts
var PhotoService = class _PhotoService {
  getData() {
    return [
      {
        itemImageSrc: "https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg",
        thumbnailImageSrc: "https://primefaces.org/cdn/primeng/images/galleria/galleria1s.jpg",
        alt: "Description for Image 1",
        title: "Title 1"
      },
      {
        itemImageSrc: "https://primefaces.org/cdn/primeng/images/galleria/galleria2.jpg",
        thumbnailImageSrc: "https://primefaces.org/cdn/primeng/images/galleria/galleria2s.jpg",
        alt: "Description for Image 2",
        title: "Title 2"
      },
      {
        itemImageSrc: "https://primefaces.org/cdn/primeng/images/galleria/galleria3.jpg",
        thumbnailImageSrc: "https://primefaces.org/cdn/primeng/images/galleria/galleria3s.jpg",
        alt: "Description for Image 3",
        title: "Title 3"
      },
      {
        itemImageSrc: "https://primefaces.org/cdn/primeng/images/galleria/galleria4.jpg",
        thumbnailImageSrc: "https://primefaces.org/cdn/primeng/images/galleria/galleria4s.jpg",
        alt: "Description for Image 4",
        title: "Title 4"
      },
      {
        itemImageSrc: "https://primefaces.org/cdn/primeng/images/galleria/galleria5.jpg",
        thumbnailImageSrc: "https://primefaces.org/cdn/primeng/images/galleria/galleria5s.jpg",
        alt: "Description for Image 5",
        title: "Title 5"
      },
      {
        itemImageSrc: "https://primefaces.org/cdn/primeng/images/galleria/galleria6.jpg",
        thumbnailImageSrc: "https://primefaces.org/cdn/primeng/images/galleria/galleria6s.jpg",
        alt: "Description for Image 6",
        title: "Title 6"
      },
      {
        itemImageSrc: "https://primefaces.org/cdn/primeng/images/galleria/galleria7.jpg",
        thumbnailImageSrc: "https://primefaces.org/cdn/primeng/images/galleria/galleria7s.jpg",
        alt: "Description for Image 7",
        title: "Title 7"
      },
      {
        itemImageSrc: "https://primefaces.org/cdn/primeng/images/galleria/galleria8.jpg",
        thumbnailImageSrc: "https://primefaces.org/cdn/primeng/images/galleria/galleria8s.jpg",
        alt: "Description for Image 8",
        title: "Title 8"
      },
      {
        itemImageSrc: "https://primefaces.org/cdn/primeng/images/galleria/galleria9.jpg",
        thumbnailImageSrc: "https://primefaces.org/cdn/primeng/images/galleria/galleria9s.jpg",
        alt: "Description for Image 9",
        title: "Title 9"
      },
      {
        itemImageSrc: "https://primefaces.org/cdn/primeng/images/galleria/galleria10.jpg",
        thumbnailImageSrc: "https://primefaces.org/cdn/primeng/images/galleria/galleria10s.jpg",
        alt: "Description for Image 10",
        title: "Title 10"
      },
      {
        itemImageSrc: "https://primefaces.org/cdn/primeng/images/galleria/galleria11.jpg",
        thumbnailImageSrc: "https://primefaces.org/cdn/primeng/images/galleria/galleria11s.jpg",
        alt: "Description for Image 11",
        title: "Title 11"
      },
      {
        itemImageSrc: "https://primefaces.org/cdn/primeng/images/galleria/galleria12.jpg",
        thumbnailImageSrc: "https://primefaces.org/cdn/primeng/images/galleria/galleria12s.jpg",
        alt: "Description for Image 12",
        title: "Title 12"
      },
      {
        itemImageSrc: "https://primefaces.org/cdn/primeng/images/galleria/galleria13.jpg",
        thumbnailImageSrc: "https://primefaces.org/cdn/primeng/images/galleria/galleria13s.jpg",
        alt: "Description for Image 13",
        title: "Title 13"
      },
      {
        itemImageSrc: "https://primefaces.org/cdn/primeng/images/galleria/galleria14.jpg",
        thumbnailImageSrc: "https://primefaces.org/cdn/primeng/images/galleria/galleria14s.jpg",
        alt: "Description for Image 14",
        title: "Title 14"
      },
      {
        itemImageSrc: "https://primefaces.org/cdn/primeng/images/galleria/galleria15.jpg",
        thumbnailImageSrc: "https://primefaces.org/cdn/primeng/images/galleria/galleria15s.jpg",
        alt: "Description for Image 15",
        title: "Title 15"
      }
    ];
  }
  getImages() {
    return Promise.resolve(this.getData());
  }
  static \u0275fac = function PhotoService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PhotoService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PhotoService, factory: _PhotoService.\u0275fac });
};

// node_modules/primeng/fesm2022/primeng-imagecompare.mjs
var _c03 = ["left"];
var _c110 = ["right"];
function ImageCompare_0_ng_template_0_Template(rf, ctx) {
}
function ImageCompare_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ImageCompare_0_ng_template_0_Template, 0, 0, "ng-template");
  }
}
function ImageCompare_1_ng_template_0_Template(rf, ctx) {
}
function ImageCompare_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ImageCompare_1_ng_template_0_Template, 0, 0, "ng-template");
  }
}
var theme3 = ({
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
var classes3 = {
  root: "p-imagecompare",
  slider: "p-imagecompare-slider"
};
var ImageCompareStyle = class _ImageCompareStyle extends BaseStyle {
  name = "imagecompare";
  theme = theme3;
  classes = classes3;
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275ImageCompareStyle_BaseFactory;
    return function ImageCompareStyle_Factory(__ngFactoryType__) {
      return (\u0275ImageCompareStyle_BaseFactory || (\u0275ImageCompareStyle_BaseFactory = \u0275\u0275getInheritedFactory(_ImageCompareStyle)))(__ngFactoryType__ || _ImageCompareStyle);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _ImageCompareStyle,
    factory: _ImageCompareStyle.\u0275fac
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
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275ImageCompare_BaseFactory;
    return function ImageCompare_Factory(__ngFactoryType__) {
      return (\u0275ImageCompare_BaseFactory || (\u0275ImageCompare_BaseFactory = \u0275\u0275getInheritedFactory(_ImageCompare)))(__ngFactoryType__ || _ImageCompare);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _ImageCompare,
    selectors: [["p-imageCompare"], ["p-imagecompare"], ["p-image-compare"]],
    contentQueries: function ImageCompare_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        \u0275\u0275contentQuery(dirIndex, _c03, 4);
        \u0275\u0275contentQuery(dirIndex, _c110, 4);
        \u0275\u0275contentQuery(dirIndex, PrimeTemplate, 4);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.leftTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.rightTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.templates = _t);
      }
    },
    hostAttrs: [1, "p-imagecompare"],
    hostVars: 3,
    hostBindings: function ImageCompare_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275attribute("tabindex", ctx.tabindex)("aria-labelledby", ctx.ariaLabelledby)("aria-label", ctx.ariaLabel);
      }
    },
    inputs: {
      tabindex: "tabindex",
      ariaLabelledby: "ariaLabelledby",
      ariaLabel: "ariaLabel"
    },
    features: [\u0275\u0275ProvidersFeature([ImageCompareStyle]), \u0275\u0275InheritDefinitionFeature],
    decls: 3,
    vars: 4,
    consts: [[4, "ngTemplateOutlet"], ["type", "range", "min", "0", "max", "100", "value", "50", 3, "input"]],
    template: function ImageCompare_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275template(0, ImageCompare_0_Template, 1, 0, null, 0)(1, ImageCompare_1_Template, 1, 0, null, 0);
        \u0275\u0275elementStart(2, "input", 1);
        \u0275\u0275listener("input", function ImageCompare_Template_input_input_2_listener($event) {
          return ctx.onSlide($event);
        });
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275property("ngTemplateOutlet", ctx.leftTemplate || ctx._leftTemplate);
        \u0275\u0275advance();
        \u0275\u0275property("ngTemplateOutlet", ctx.rightTemplate || ctx._rightTemplate);
        \u0275\u0275advance();
        \u0275\u0275classMap(ctx.cx("slider"));
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
  static \u0275fac = function ImageCompareModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ImageCompareModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _ImageCompareModule
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
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

// src/app/pages/uikit/mediademo.ts
var _c04 = () => ({ "max-width": "640px" });
var _c111 = () => ({ "left.px": 5, "top.px": 5 });
function MediaDemo_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11)(1, "div", 12)(2, "div", 13);
    \u0275\u0275element(3, "img", 14);
    \u0275\u0275elementStart(4, "div", 15);
    \u0275\u0275element(5, "p-tag", 16);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(6, "div", 17);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 18)(9, "div", 19);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span");
    \u0275\u0275element(12, "p-button", 20)(13, "p-button", 21);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const product_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275propertyInterpolate1("src", "/images/product/", product_r1.image, "", \u0275\u0275sanitizeUrl);
    \u0275\u0275property("alt", product_r1.name);
    \u0275\u0275advance();
    \u0275\u0275property("ngStyle", \u0275\u0275pureFunction0(9, _c111));
    \u0275\u0275advance();
    \u0275\u0275property("value", product_r1.inventoryStatus)("severity", ctx_r1.getSeverity(product_r1.inventoryStatus));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(product_r1.name);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", "$" + product_r1.price, " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("outlined", true);
  }
}
function MediaDemo_ng_template_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 22);
  }
}
function MediaDemo_ng_template_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 23);
  }
}
function MediaDemo_ng_template_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 24);
  }
  if (rf & 2) {
    const item_r3 = ctx.$implicit;
    \u0275\u0275property("src", item_r3.itemImageSrc, \u0275\u0275sanitizeUrl);
  }
}
function MediaDemo_ng_template_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 25);
  }
  if (rf & 2) {
    const item_r4 = ctx.$implicit;
    \u0275\u0275property("src", item_r4.thumbnailImageSrc, \u0275\u0275sanitizeUrl);
  }
}
var MediaDemo = class _MediaDemo {
  productService;
  photoService;
  products;
  images;
  galleriaResponsiveOptions = [
    {
      breakpoint: "1024px",
      numVisible: 5
    },
    {
      breakpoint: "960px",
      numVisible: 4
    },
    {
      breakpoint: "768px",
      numVisible: 3
    },
    {
      breakpoint: "560px",
      numVisible: 1
    }
  ];
  carouselResponsiveOptions = [
    {
      breakpoint: "1024px",
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: "768px",
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: "560px",
      numVisible: 1,
      numScroll: 1
    }
  ];
  constructor(productService, photoService) {
    this.productService = productService;
    this.photoService = photoService;
  }
  ngOnInit() {
    this.productService.getProductsSmall().then((products) => {
      this.products = products;
    });
    this.photoService.getImages().then((images) => {
      this.images = images;
    });
  }
  getSeverity(status) {
    switch (status) {
      case "INSTOCK":
        return "success";
      case "LOWSTOCK":
        return "warn";
      case "OUTOFSTOCK":
        return "danger";
      default:
        return "success";
    }
  }
  static \u0275fac = function MediaDemo_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MediaDemo)(\u0275\u0275directiveInject(ProductService), \u0275\u0275directiveInject(PhotoService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MediaDemo, selectors: [["app-media-demo"]], features: [\u0275\u0275ProvidersFeature([ProductService, PhotoService])], decls: 26, vars: 10, consts: [["item", ""], ["left", ""], ["right", ""], ["thumbnail", ""], [1, "card"], [1, "font-semibold", "text-xl", "mb-6"], [3, "value", "numVisible", "numScroll", "circular", "responsiveOptions"], ["src", "https://primefaces.org/cdn/primeng/images/galleria/galleria10.jpg", "alt", "Image", "width", "250", "preview", ""], [1, "card", "flex", "flex-col"], [1, "sm:!w-96", "shadow-lg", "rounded-2xl"], [3, "value", "responsiveOptions", "containerStyle", "numVisible"], [1, "border", "border-surface", "rounded-border", "m-2", "p-6"], [1, "mb-6"], [1, "relative", "mx-auto"], [1, "w-full", "rounded-border", 3, "src", "alt"], [1, "absolute", "bg-black/70", "rounded-border", 3, "ngStyle"], [3, "value", "severity"], [1, "mb-6", "font-medium"], [1, "flex", "justify-between", "items-center"], [1, "mt-0", "font-semibold", "text-xl"], ["icon", "pi pi-heart", "severity", "secondary", 3, "outlined"], ["icon", "pi pi-shopping-cart", "styleClass", "ml-2"], ["src", "https://primefaces.org/cdn/primevue/images/compare/island1.jpg"], ["src", "https://primefaces.org/cdn/primevue/images/compare/island2.jpg"], [2, "width", "100%", 3, "src"], [3, "src"]], template: function MediaDemo_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 4)(1, "div", 5);
      \u0275\u0275text(2, "Carousel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "p-carousel", 6);
      \u0275\u0275template(4, MediaDemo_ng_template_4_Template, 14, 10, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5);
      \u0275\u0275text(8, "Image");
      \u0275\u0275elementEnd();
      \u0275\u0275element(9, "p-image", 7);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "div", 8)(11, "div", 5);
      \u0275\u0275text(12, "Image Compare");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "p-imagecompare", 9);
      \u0275\u0275template(14, MediaDemo_ng_template_14_Template, 1, 0, "ng-template", null, 1, \u0275\u0275templateRefExtractor)(16, MediaDemo_ng_template_16_Template, 1, 0, "ng-template", null, 2, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(18, "div", 4)(19, "div", 5);
      \u0275\u0275text(20, "Galleria");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "p-galleria", 10);
      \u0275\u0275template(22, MediaDemo_ng_template_22_Template, 1, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor)(24, MediaDemo_ng_template_24_Template, 1, 1, "ng-template", null, 3, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275property("value", ctx.products)("numVisible", 3)("numScroll", 3)("circular", false)("responsiveOptions", ctx.carouselResponsiveOptions);
      \u0275\u0275advance(18);
      \u0275\u0275property("value", ctx.images)("responsiveOptions", ctx.galleriaResponsiveOptions)("containerStyle", \u0275\u0275pureFunction0(9, _c04))("numVisible", 5);
    }
  }, dependencies: [CommonModule, NgStyle, CarouselModule, Carousel, ButtonModule, Button, GalleriaModule, Galleria, ImageModule, Image, TagModule, Tag, ImageCompareModule, ImageCompare], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MediaDemo, { className: "MediaDemo", filePath: "src/app/pages/uikit/mediademo.ts", lineNumber: 74 });
})();
export {
  MediaDemo
};
//# sourceMappingURL=chunk-QYII7TN7.js.map
