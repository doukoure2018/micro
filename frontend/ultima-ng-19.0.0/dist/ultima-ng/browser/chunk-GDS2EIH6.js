import {
  AvatarGroup,
  AvatarGroupModule
} from "./chunk-NE67ECLX.js";
import {
  OverlayBadge,
  OverlayBadgeModule
} from "./chunk-TVR7D6US.js";
import {
  Avatar,
  AvatarModule
} from "./chunk-MCGUCMXD.js";
import {
  ProgressBar,
  ProgressBarModule
} from "./chunk-WQ2EPPBK.js";
import {
  Chip,
  ChipModule
} from "./chunk-SN3HAAMO.js";
import {
  Skeleton,
  SkeletonModule
} from "./chunk-ZUPKH4BQ.js";
import {
  Tag,
  TagModule
} from "./chunk-MYUKI7DG.js";
import {
  ChevronUpIcon
} from "./chunk-YBM6FZLP.js";
import "./chunk-KHEKFKWA.js";
import {
  zindexutils
} from "./chunk-E352KRZV.js";
import {
  Badge,
  BadgeModule,
  Button,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import "./chunk-AP3OAIHW.js";
import {
  BaseComponent,
  BaseStyle,
  PrimeTemplate,
  SharedModule,
  addClass,
  getHeight,
  getOuterHeight,
  getWindowScrollTop,
  removeClass,
  uuid
} from "./chunk-NQNBRQ7H.js";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "./chunk-W3K3GK4Z.js";
import {
  CommonModule,
  NgClass,
  NgForOf,
  NgIf,
  NgStyle,
  NgTemplateOutlet,
  isPlatformBrowser
} from "./chunk-SQQPVFHK.js";
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  Injectable,
  Input,
  NgModule,
  NgZone,
  ViewChild,
  ViewEncapsulation,
  forwardRef,
  inject,
  numberAttribute,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵInheritDefinitionFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵconditional,
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
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵpureFunction2,
  ɵɵpureFunction3,
  ɵɵpureFunction5,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate2,
  ɵɵviewQuery
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// node_modules/primeng/fesm2022/primeng-scrollpanel.mjs
var _c0 = ["content"];
var _c1 = ["container"];
var _c2 = ["xBar"];
var _c3 = ["yBar"];
var _c4 = ["*"];
function ScrollPanel_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275projection(0);
  }
}
function ScrollPanel_ng_container_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
var theme = ({
  dt
}) => `
.p-scrollpanel-content-container {
    overflow: hidden;
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
    float: left;
}

.p-scrollpanel-content {
    height: calc(100% + calc(2 * ${dt("scrollpanel.bar.size")}));
    width: calc(100% + calc(2 * ${dt("scrollpanel.bar.size")}));
    padding-inline: 0 calc(2 * ${dt("scrollpanel.bar.size")});
    padding-block: 0 calc(2 * ${dt("scrollpanel.bar.size")});
    position: relative;
    overflow: auto;
    box-sizing: border-box;
    scrollbar-width: none;
}

.p-scrollpanel-content::-webkit-scrollbar {
    display: none;
}

.p-scrollpanel-bar {
    position: relative;
    border-radius: ${dt("scrollpanel.bar.border.radius")};
    z-index: 2;
    cursor: pointer;
    opacity: 0;
    outline-color: transparent;
    transition: outline-color ${dt("scrollpanel.transition.duration")};
    background: ${dt("scrollpanel.bar.background")};
    border: 0 none;
    transition: outline-color ${dt("scrollpanel.transition.duration")}, opacity ${dt("scrollpanel.transition.duration")};
}

.p-scrollpanel-bar:focus-visible {
    box-shadow: ${dt("scrollpanel.bar.focus.ring.shadow")};
    outline: ${dt("scrollpanel.barfocus.ring.width")} ${dt("scrollpanel.bar.focus.ring.style")} ${dt("scrollpanel.bar.focus.ring.color")};
    outline-offset: ${dt("scrollpanel.barfocus.ring.offset")};
}

.p-scrollpanel-bar-y {
    width: ${dt("scrollpanel.bar.size")};
    top: 0;
}

.p-scrollpanel-bar-x {
    height: ${dt("scrollpanel.bar.size")};
    bottom: 0;
}

.p-scrollpanel-hidden {
    visibility: hidden;
}

.p-scrollpanel:hover .p-scrollpanel-bar,
.p-scrollpanel:active .p-scrollpanel-bar {
    opacity: 1;
}

.p-scrollpanel-grabbed {
    user-select: none;
}
`;
var classes = {
  root: "p-scrollpanel p-component",
  contentContainer: "p-scrollpanel-content-container",
  content: "p-scrollpanel-content",
  barX: "p-scrollpanel-bar p-scrollpanel-bar-x",
  barY: "p-scrollpanel-bar p-scrollpanel-bar-y"
};
var ScrollPanelStyle = class _ScrollPanelStyle extends BaseStyle {
  name = "scrollpanel";
  theme = theme;
  classes = classes;
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275ScrollPanelStyle_BaseFactory;
    return function ScrollPanelStyle_Factory(__ngFactoryType__) {
      return (\u0275ScrollPanelStyle_BaseFactory || (\u0275ScrollPanelStyle_BaseFactory = \u0275\u0275getInheritedFactory(_ScrollPanelStyle)))(__ngFactoryType__ || _ScrollPanelStyle);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _ScrollPanelStyle,
    factory: _ScrollPanelStyle.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScrollPanelStyle, [{
    type: Injectable
  }], null, null);
})();
var ScrollPanelClasses;
(function(ScrollPanelClasses2) {
  ScrollPanelClasses2["root"] = "p-scrollpanel";
  ScrollPanelClasses2["contentContainer"] = "p-scrollpanel-content-container";
  ScrollPanelClasses2["content"] = "p-scrollpanel-content";
  ScrollPanelClasses2["barX"] = "p-scrollpanel-bar-x";
  ScrollPanelClasses2["barY"] = "p-scrollpanel-bar-y";
})(ScrollPanelClasses || (ScrollPanelClasses = {}));
var ScrollPanel = class _ScrollPanel extends BaseComponent {
  /**
   * Inline style of the component.
   * @group Props
   */
  style;
  /**
   * Style class of the component.
   * @group Props
   */
  styleClass;
  /**
   * Step factor to scroll the content while pressing the arrow keys.
   * @group Props
   */
  step = 5;
  containerViewChild;
  contentViewChild;
  xBarViewChild;
  yBarViewChild;
  /**
   * Defines template option for content.
   * @group Templates
   */
  contentTemplate;
  templates;
  _contentTemplate;
  scrollYRatio;
  scrollXRatio;
  timeoutFrame = (fn) => setTimeout(fn, 0);
  initialized = false;
  lastPageY;
  lastPageX;
  isXBarClicked = false;
  isYBarClicked = false;
  lastScrollLeft = 0;
  lastScrollTop = 0;
  orientation = "vertical";
  timer;
  contentId;
  windowResizeListener;
  contentScrollListener;
  mouseEnterListener;
  xBarMouseDownListener;
  yBarMouseDownListener;
  documentMouseMoveListener;
  documentMouseUpListener;
  _componentStyle = inject(ScrollPanelStyle);
  zone = inject(NgZone);
  ngOnInit() {
    super.ngOnInit();
    this.contentId = uuid("pn_id_") + "_content";
  }
  ngAfterViewInit() {
    super.ngAfterViewInit();
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        this.moveBar();
        this.moveBar = this.moveBar.bind(this);
        this.onXBarMouseDown = this.onXBarMouseDown.bind(this);
        this.onYBarMouseDown = this.onYBarMouseDown.bind(this);
        this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
        this.onDocumentMouseUp = this.onDocumentMouseUp.bind(this);
        this.windowResizeListener = this.renderer.listen(window, "resize", this.moveBar);
        this.contentScrollListener = this.renderer.listen(this.contentViewChild.nativeElement, "scroll", this.moveBar);
        this.mouseEnterListener = this.renderer.listen(this.contentViewChild.nativeElement, "mouseenter", this.moveBar);
        this.xBarMouseDownListener = this.renderer.listen(this.xBarViewChild.nativeElement, "mousedown", this.onXBarMouseDown);
        this.yBarMouseDownListener = this.renderer.listen(this.yBarViewChild.nativeElement, "mousedown", this.onYBarMouseDown);
        this.calculateContainerHeight();
        this.initialized = true;
      });
    }
  }
  ngAfterContentInit() {
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case "content":
          this._contentTemplate = item.template;
          break;
        default:
          this._contentTemplate = item.template;
          break;
      }
    });
  }
  calculateContainerHeight() {
    let container = this.containerViewChild.nativeElement;
    let content = this.contentViewChild.nativeElement;
    let xBar = this.xBarViewChild.nativeElement;
    const window2 = this.document.defaultView;
    let containerStyles = window2.getComputedStyle(container), xBarStyles = window2.getComputedStyle(xBar), pureContainerHeight = getHeight(container) - parseInt(xBarStyles["height"], 10);
    if (containerStyles["max-height"] != "none" && pureContainerHeight == 0) {
      if (content.offsetHeight + parseInt(xBarStyles["height"], 10) > parseInt(containerStyles["max-height"], 10)) {
        container.style.height = containerStyles["max-height"];
      } else {
        container.style.height = content.offsetHeight + parseFloat(containerStyles.paddingTop) + parseFloat(containerStyles.paddingBottom) + parseFloat(containerStyles.borderTopWidth) + parseFloat(containerStyles.borderBottomWidth) + "px";
      }
    }
  }
  moveBar() {
    let container = this.containerViewChild.nativeElement;
    let content = this.contentViewChild.nativeElement;
    let xBar = this.xBarViewChild.nativeElement;
    let totalWidth = content.scrollWidth;
    let ownWidth = content.clientWidth;
    let bottom = (container.clientHeight - xBar.clientHeight) * -1;
    this.scrollXRatio = ownWidth / totalWidth;
    let yBar = this.yBarViewChild.nativeElement;
    let totalHeight = content.scrollHeight;
    let ownHeight = content.clientHeight;
    let right = (container.clientWidth - yBar.clientWidth) * -1;
    this.scrollYRatio = ownHeight / totalHeight;
    this.requestAnimationFrame(() => {
      if (this.scrollXRatio >= 1) {
        xBar.setAttribute("data-p-scrollpanel-hidden", "true");
        addClass(xBar, "p-scrollpanel-hidden");
      } else {
        xBar.setAttribute("data-p-scrollpanel-hidden", "false");
        removeClass(xBar, "p-scrollpanel-hidden");
        const xBarWidth = Math.max(this.scrollXRatio * 100, 10);
        const xBarLeft = Math.abs(content.scrollLeft * (100 - xBarWidth) / (totalWidth - ownWidth));
        xBar.style.cssText = "width:" + xBarWidth + "%; inset-inline-start:" + xBarLeft + "%;bottom:" + bottom + "px;";
      }
      if (this.scrollYRatio >= 1) {
        yBar.setAttribute("data-p-scrollpanel-hidden", "true");
        addClass(yBar, "p-scrollpanel-hidden");
      } else {
        yBar.setAttribute("data-p-scrollpanel-hidden", "false");
        removeClass(yBar, "p-scrollpanel-hidden");
        const yBarHeight = Math.max(this.scrollYRatio * 100, 10);
        const yBarTop = content.scrollTop * (100 - yBarHeight) / (totalHeight - ownHeight);
        yBar.style.cssText = "height:" + yBarHeight + "%; top: calc(" + yBarTop + "% - " + xBar.clientHeight + "px); inset-inline-end:" + right + "px;";
      }
    });
    this.cd.markForCheck();
  }
  onScroll(event) {
    if (this.lastScrollLeft !== event.target.scrollLeft) {
      this.lastScrollLeft = event.target.scrollLeft;
      this.orientation = "horizontal";
    } else if (this.lastScrollTop !== event.target.scrollTop) {
      this.lastScrollTop = event.target.scrollTop;
      this.orientation = "vertical";
    }
    this.moveBar();
  }
  onKeyDown(event) {
    if (this.orientation === "vertical") {
      switch (event.code) {
        case "ArrowDown": {
          this.setTimer("scrollTop", this.step);
          event.preventDefault();
          break;
        }
        case "ArrowUp": {
          this.setTimer("scrollTop", this.step * -1);
          event.preventDefault();
          break;
        }
        case "ArrowLeft":
        case "ArrowRight": {
          event.preventDefault();
          break;
        }
        default:
          break;
      }
    } else if (this.orientation === "horizontal") {
      switch (event.code) {
        case "ArrowRight": {
          this.setTimer("scrollLeft", this.step);
          event.preventDefault();
          break;
        }
        case "ArrowLeft": {
          this.setTimer("scrollLeft", this.step * -1);
          event.preventDefault();
          break;
        }
        case "ArrowDown":
        case "ArrowUp": {
          event.preventDefault();
          break;
        }
        default:
          break;
      }
    }
  }
  onKeyUp() {
    this.clearTimer();
  }
  repeat(bar, step) {
    this.contentViewChild.nativeElement[bar] += step;
    this.moveBar();
  }
  setTimer(bar, step) {
    this.clearTimer();
    this.timer = setTimeout(() => {
      this.repeat(bar, step);
    }, 40);
  }
  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
  bindDocumentMouseListeners() {
    if (!this.documentMouseMoveListener) {
      this.documentMouseMoveListener = (e) => {
        this.onDocumentMouseMove(e);
      };
      this.document.addEventListener("mousemove", this.documentMouseMoveListener);
    }
    if (!this.documentMouseUpListener) {
      this.documentMouseUpListener = (e) => {
        this.onDocumentMouseUp(e);
      };
      this.document.addEventListener("mouseup", this.documentMouseUpListener);
    }
  }
  unbindDocumentMouseListeners() {
    if (this.documentMouseMoveListener) {
      this.document.removeEventListener("mousemove", this.documentMouseMoveListener);
      this.documentMouseMoveListener = null;
    }
    if (this.documentMouseUpListener) {
      document.removeEventListener("mouseup", this.documentMouseUpListener);
      this.documentMouseUpListener = null;
    }
  }
  onYBarMouseDown(e) {
    this.isYBarClicked = true;
    this.yBarViewChild.nativeElement.focus();
    this.lastPageY = e.pageY;
    this.yBarViewChild.nativeElement.setAttribute("data-p-scrollpanel-grabbed", "true");
    addClass(this.yBarViewChild.nativeElement, "p-scrollpanel-grabbed");
    this.document.body.setAttribute("data-p-scrollpanel-grabbed", "true");
    addClass(this.document.body, "p-scrollpanel-grabbed");
    this.bindDocumentMouseListeners();
    e.preventDefault();
  }
  onXBarMouseDown(e) {
    this.isXBarClicked = true;
    this.xBarViewChild.nativeElement.focus();
    this.lastPageX = e.pageX;
    this.xBarViewChild.nativeElement.setAttribute("data-p-scrollpanel-grabbed", "false");
    addClass(this.xBarViewChild.nativeElement, "p-scrollpanel-grabbed");
    this.document.body.setAttribute("data-p-scrollpanel-grabbed", "false");
    addClass(this.document.body, "p-scrollpanel-grabbed");
    this.bindDocumentMouseListeners();
    e.preventDefault();
  }
  onDocumentMouseMove(e) {
    if (this.isXBarClicked) {
      this.onMouseMoveForXBar(e);
    } else if (this.isYBarClicked) {
      this.onMouseMoveForYBar(e);
    } else {
      this.onMouseMoveForXBar(e);
      this.onMouseMoveForYBar(e);
    }
  }
  onMouseMoveForXBar(e) {
    let deltaX = e.pageX - this.lastPageX;
    this.lastPageX = e.pageX;
    this.requestAnimationFrame(() => {
      this.contentViewChild.nativeElement.scrollLeft += deltaX / this.scrollXRatio;
    });
  }
  onMouseMoveForYBar(e) {
    let deltaY = e.pageY - this.lastPageY;
    this.lastPageY = e.pageY;
    this.requestAnimationFrame(() => {
      this.contentViewChild.nativeElement.scrollTop += deltaY / this.scrollYRatio;
    });
  }
  /**
   * Scrolls the top location to the given value.
   * @param scrollTop
   * @group Method
   */
  scrollTop(scrollTop) {
    let scrollableHeight = this.contentViewChild.nativeElement.scrollHeight - this.contentViewChild.nativeElement.clientHeight;
    scrollTop = scrollTop > scrollableHeight ? scrollableHeight : scrollTop > 0 ? scrollTop : 0;
    this.contentViewChild.nativeElement.scrollTop = scrollTop;
  }
  onFocus(event) {
    if (this.xBarViewChild.nativeElement.isSameNode(event.target)) {
      this.orientation = "horizontal";
    } else if (this.yBarViewChild.nativeElement.isSameNode(event.target)) {
      this.orientation = "vertical";
    }
  }
  onBlur() {
    if (this.orientation === "horizontal") {
      this.orientation = "vertical";
    }
  }
  onDocumentMouseUp(e) {
    this.yBarViewChild.nativeElement.setAttribute("data-p-scrollpanel-grabbed", "false");
    removeClass(this.yBarViewChild.nativeElement, "p-scrollpanel-grabbed");
    this.xBarViewChild.nativeElement.setAttribute("data-p-scrollpanel-grabbed", "false");
    removeClass(this.xBarViewChild.nativeElement, "p-scrollpanel-grabbed");
    this.document.body.setAttribute("data-p-scrollpanel-grabbed", "false");
    removeClass(this.document.body, "p-scrollpanel-grabbed");
    this.unbindDocumentMouseListeners();
    this.isXBarClicked = false;
    this.isYBarClicked = false;
  }
  requestAnimationFrame(f) {
    let frame = window.requestAnimationFrame || this.timeoutFrame;
    frame(f);
  }
  unbindListeners() {
    if (this.windowResizeListener) {
      this.windowResizeListener();
      this.windowResizeListener = null;
    }
    if (this.contentScrollListener) {
      this.contentScrollListener();
      this.contentScrollListener = null;
    }
    if (this.mouseEnterListener) {
      this.mouseEnterListener();
      this.mouseEnterListener = null;
    }
    if (this.xBarMouseDownListener) {
      this.xBarMouseDownListener();
      this.xBarMouseDownListener = null;
    }
    if (this.yBarMouseDownListener) {
      this.yBarMouseDownListener();
      this.yBarMouseDownListener = null;
    }
  }
  ngOnDestroy() {
    if (this.initialized) {
      this.unbindListeners();
    }
  }
  /**
   * Refreshes the position and size of the scrollbar.
   * @group Method
   */
  refresh() {
    this.moveBar();
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275ScrollPanel_BaseFactory;
    return function ScrollPanel_Factory(__ngFactoryType__) {
      return (\u0275ScrollPanel_BaseFactory || (\u0275ScrollPanel_BaseFactory = \u0275\u0275getInheritedFactory(_ScrollPanel)))(__ngFactoryType__ || _ScrollPanel);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _ScrollPanel,
    selectors: [["p-scroll-panel"], ["p-scrollPanel"], ["p-scrollpanel"]],
    contentQueries: function ScrollPanel_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        \u0275\u0275contentQuery(dirIndex, _c0, 4);
        \u0275\u0275contentQuery(dirIndex, PrimeTemplate, 4);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.contentTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.templates = _t);
      }
    },
    viewQuery: function ScrollPanel_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c1, 5);
        \u0275\u0275viewQuery(_c0, 5);
        \u0275\u0275viewQuery(_c2, 5);
        \u0275\u0275viewQuery(_c3, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.containerViewChild = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.contentViewChild = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.xBarViewChild = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.yBarViewChild = _t.first);
      }
    },
    inputs: {
      style: "style",
      styleClass: "styleClass",
      step: [2, "step", "step", numberAttribute]
    },
    features: [\u0275\u0275ProvidersFeature([ScrollPanelStyle]), \u0275\u0275InheritDefinitionFeature],
    ngContentSelectors: _c4,
    decls: 11,
    vars: 17,
    consts: [["container", ""], ["content", ""], ["xBar", ""], ["yBar", ""], [3, "ngClass", "ngStyle"], [1, "p-scrollpanel-content-container"], [1, "p-scrollpanel-content", 3, "mouseenter", "scroll"], [4, "ngTemplateOutlet"], ["tabindex", "0", "role", "scrollbar", 1, "p-scrollpanel-bar", "p-scrollpanel-bar-x", 3, "mousedown", "keydown", "keyup", "focus", "blur"], ["tabindex", "0", "role", "scrollbar", 1, "p-scrollpanel-bar", "p-scrollpanel-bar-y", 3, "mousedown", "keydown", "keyup", "focus"]],
    template: function ScrollPanel_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = \u0275\u0275getCurrentView();
        \u0275\u0275projectionDef();
        \u0275\u0275elementStart(0, "div", 4, 0)(2, "div", 5)(3, "div", 6, 1);
        \u0275\u0275listener("mouseenter", function ScrollPanel_Template_div_mouseenter_3_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.moveBar());
        })("scroll", function ScrollPanel_Template_div_scroll_3_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.onScroll($event));
        });
        \u0275\u0275template(5, ScrollPanel_Conditional_5_Template, 1, 0)(6, ScrollPanel_ng_container_6_Template, 1, 0, "ng-container", 7);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(7, "div", 8, 2);
        \u0275\u0275listener("mousedown", function ScrollPanel_Template_div_mousedown_7_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.onXBarMouseDown($event));
        })("keydown", function ScrollPanel_Template_div_keydown_7_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.onKeyDown($event));
        })("keyup", function ScrollPanel_Template_div_keyup_7_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.onKeyUp());
        })("focus", function ScrollPanel_Template_div_focus_7_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.onFocus($event));
        })("blur", function ScrollPanel_Template_div_blur_7_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.onBlur());
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(9, "div", 9, 3);
        \u0275\u0275listener("mousedown", function ScrollPanel_Template_div_mousedown_9_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.onYBarMouseDown($event));
        })("keydown", function ScrollPanel_Template_div_keydown_9_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.onKeyDown($event));
        })("keyup", function ScrollPanel_Template_div_keyup_9_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.onKeyUp());
        })("focus", function ScrollPanel_Template_div_focus_9_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.onFocus($event));
        });
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275classMap(ctx.styleClass);
        \u0275\u0275property("ngClass", "p-scrollpanel p-component")("ngStyle", ctx.style);
        \u0275\u0275attribute("data-pc-name", "scrollpanel");
        \u0275\u0275advance(2);
        \u0275\u0275attribute("data-pc-section", "wrapper");
        \u0275\u0275advance();
        \u0275\u0275attribute("data-pc-section", "content");
        \u0275\u0275advance(2);
        \u0275\u0275conditional(!ctx.contentTemplate && !ctx._contentTemplate ? 5 : -1);
        \u0275\u0275advance();
        \u0275\u0275property("ngTemplateOutlet", ctx.contentTemplate || ctx._contentTemplate);
        \u0275\u0275advance();
        \u0275\u0275attribute("aria-orientation", "horizontal")("aria-valuenow", ctx.lastScrollLeft)("data-pc-section", "barx")("aria-controls", ctx.contentId);
        \u0275\u0275advance(2);
        \u0275\u0275attribute("aria-orientation", "vertical")("aria-valuenow", ctx.lastScrollTop)("data-pc-section", "bary")("aria-controls", ctx.contentId);
      }
    },
    dependencies: [CommonModule, NgClass, NgTemplateOutlet, NgStyle, SharedModule],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScrollPanel, [{
    type: Component,
    args: [{
      selector: "p-scroll-panel, p-scrollPanel, p-scrollpanel",
      standalone: true,
      imports: [CommonModule, SharedModule],
      template: `
        <div #container [ngClass]="'p-scrollpanel p-component'" [ngStyle]="style" [class]="styleClass" [attr.data-pc-name]="'scrollpanel'">
            <div class="p-scrollpanel-content-container" [attr.data-pc-section]="'wrapper'">
                <div #content class="p-scrollpanel-content" [attr.data-pc-section]="'content'" (mouseenter)="moveBar()" (scroll)="onScroll($event)">
                    @if (!contentTemplate && !_contentTemplate) {
                        <ng-content></ng-content>
                    }
                    <ng-container *ngTemplateOutlet="contentTemplate || _contentTemplate"></ng-container>
                </div>
            </div>
            <div
                #xBar
                class="p-scrollpanel-bar p-scrollpanel-bar-x"
                tabindex="0"
                role="scrollbar"
                [attr.aria-orientation]="'horizontal'"
                [attr.aria-valuenow]="lastScrollLeft"
                [attr.data-pc-section]="'barx'"
                [attr.aria-controls]="contentId"
                (mousedown)="onXBarMouseDown($event)"
                (keydown)="onKeyDown($event)"
                (keyup)="onKeyUp()"
                (focus)="onFocus($event)"
                (blur)="onBlur()"
            ></div>
            <div
                #yBar
                class="p-scrollpanel-bar p-scrollpanel-bar-y"
                tabindex="0"
                role="scrollbar"
                [attr.aria-orientation]="'vertical'"
                [attr.aria-valuenow]="lastScrollTop"
                [attr.data-pc-section]="'bary'"
                [attr.aria-controls]="contentId"
                (mousedown)="onYBarMouseDown($event)"
                (keydown)="onKeyDown($event)"
                (keyup)="onKeyUp()"
                (focus)="onFocus($event)"
            ></div>
        </div>
    `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [ScrollPanelStyle]
    }]
  }], null, {
    style: [{
      type: Input
    }],
    styleClass: [{
      type: Input
    }],
    step: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    containerViewChild: [{
      type: ViewChild,
      args: ["container"]
    }],
    contentViewChild: [{
      type: ViewChild,
      args: ["content"]
    }],
    xBarViewChild: [{
      type: ViewChild,
      args: ["xBar"]
    }],
    yBarViewChild: [{
      type: ViewChild,
      args: ["yBar"]
    }],
    contentTemplate: [{
      type: ContentChild,
      args: ["content", {
        descendants: false
      }]
    }],
    templates: [{
      type: ContentChildren,
      args: [PrimeTemplate]
    }]
  });
})();
var ScrollPanelModule = class _ScrollPanelModule {
  static \u0275fac = function ScrollPanelModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ScrollPanelModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _ScrollPanelModule
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [ScrollPanel, SharedModule, SharedModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScrollPanelModule, [{
    type: NgModule,
    args: [{
      imports: [ScrollPanel, SharedModule],
      exports: [ScrollPanel, SharedModule]
    }]
  }], null, null);
})();

// node_modules/primeng/fesm2022/primeng-scrolltop.mjs
var _c02 = ["icon"];
var _c12 = (a0, a1) => ({
  showTransitionParams: a0,
  hideTransitionParams: a1
});
var _c22 = (a0) => ({
  value: "open",
  params: a0
});
var _c32 = () => ({
  styleClass: "p-scrolltop-icon"
});
var _c42 = () => ({
  "font-size": "1rem",
  scale: "1.5"
});
function ScrollTop_p_button_0_ng_template_1_ng_container_0_span_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 7);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275classMap(ctx_r1._icon);
    \u0275\u0275property("ngClass", "p-scrolltop-icon");
  }
}
function ScrollTop_p_button_0_ng_template_1_ng_container_0_ChevronUpIcon_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ChevronUpIcon", 8);
  }
  if (rf & 2) {
    \u0275\u0275property("styleClass", "p-scrolltop-icon")("ngStyle", \u0275\u0275pureFunction0(2, _c42));
  }
}
function ScrollTop_p_button_0_ng_template_1_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, ScrollTop_p_button_0_ng_template_1_ng_container_0_span_1_Template, 1, 3, "span", 5)(2, ScrollTop_p_button_0_ng_template_1_ng_container_0_ChevronUpIcon_2_Template, 1, 3, "ChevronUpIcon", 6);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1._icon);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1._icon);
  }
}
function ScrollTop_p_button_0_ng_template_1_1_ng_template_0_Template(rf, ctx) {
}
function ScrollTop_p_button_0_ng_template_1_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ScrollTop_p_button_0_ng_template_1_1_ng_template_0_Template, 0, 0, "ng-template", 9);
  }
  if (rf & 2) {
    \u0275\u0275nextContext(2);
    const icon_r3 = \u0275\u0275reference(2);
    \u0275\u0275property("ngIf", !icon_r3);
  }
}
function ScrollTop_p_button_0_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ScrollTop_p_button_0_ng_template_1_ng_container_0_Template, 3, 2, "ng-container", 3)(1, ScrollTop_p_button_0_ng_template_1_1_Template, 1, 1, null, 4);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngIf", !ctx_r1.iconTemplate && !ctx_r1._iconTemplate);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", ctx_r1.iconTemplate || ctx_r1._iconTemplate)("ngTemplateOutletContext", \u0275\u0275pureFunction0(3, _c32));
  }
}
function ScrollTop_p_button_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 2);
    \u0275\u0275listener("@animation.start", function ScrollTop_p_button_0_Template_p_button_animation_animation_start_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onEnter($event));
    })("@animation.done", function ScrollTop_p_button_0_Template_p_button_animation_animation_done_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onLeave($event));
    })("click", function ScrollTop_p_button_0_Template_p_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onClick());
    });
    \u0275\u0275template(1, ScrollTop_p_button_0_ng_template_1_Template, 2, 4, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("@animation", \u0275\u0275pureFunction1(8, _c22, \u0275\u0275pureFunction2(5, _c12, ctx_r1.showTransitionOptions, ctx_r1.hideTransitionOptions)))("styleClass", ctx_r1.getStyleClass())("ngStyle", ctx_r1.style)("buttonProps", ctx_r1.buttonProps);
    \u0275\u0275attribute("aria-label", ctx_r1.buttonAriaLabel);
  }
}
var theme2 = ({
  dt
}) => `
.p-scrolltop.p-button {
    position: fixed;
    bottom: 20px;
    inset-inline-end: 20px;
}

.p-scrolltop-sticky.p-button {
    position: sticky;
    display: flex;
    margin-left: auto;
}

.p-scrolltop-sticky.p-button:dir(rtl) {
    margin-left: 0;
    margin-right: auto;
}

.p-scrolltop-enter-from {
    opacity: 0;
}

.p-scrolltop-enter-active {
    transition: opacity 0.15s;
}

.p-scrolltop.p-scrolltop-leave-to {
    opacity: 0;
}

.p-scrolltop-leave-active {
    transition: opacity 0.15s;
}

/* For PrimeNG */
.p-scrolltop-sticky.p-link {
    margin-left: auto;
}
`;
var classes2 = {
  root: ({
    props
  }) => ["p-scrolltop", {
    "p-scrolltop-sticky": props.target !== "window"
  }],
  icon: "p-scrolltop-icon"
};
var ScrollTopStyle = class _ScrollTopStyle extends BaseStyle {
  name = "scrolltop";
  theme = theme2;
  classes = classes2;
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275ScrollTopStyle_BaseFactory;
    return function ScrollTopStyle_Factory(__ngFactoryType__) {
      return (\u0275ScrollTopStyle_BaseFactory || (\u0275ScrollTopStyle_BaseFactory = \u0275\u0275getInheritedFactory(_ScrollTopStyle)))(__ngFactoryType__ || _ScrollTopStyle);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _ScrollTopStyle,
    factory: _ScrollTopStyle.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScrollTopStyle, [{
    type: Injectable
  }], null, null);
})();
var ScrollTopClasses;
(function(ScrollTopClasses2) {
  ScrollTopClasses2["root"] = "p-scrolltop";
  ScrollTopClasses2["icon"] = "p-scrolltop-icon";
})(ScrollTopClasses || (ScrollTopClasses = {}));
var ScrollTop = class _ScrollTop extends BaseComponent {
  /**
   * Class of the element.
   * @group Props
   */
  styleClass;
  /**
   * Inline style of the element.
   * @group Props
   */
  style;
  /**
   * Target of the ScrollTop.
   * @group Props
   */
  target = "window";
  /**
   * Defines the threshold value of the vertical scroll position of the target to toggle the visibility.
   * @group Props
   */
  threshold = 400;
  /**
   * Name of the icon or JSX.Element for icon.
   * @group Props
   */
  get icon() {
    return this._icon;
  }
  /**
   * Defines the scrolling behavior, "smooth" adds an animation and "auto" scrolls with a jump.
   * @group Props
   */
  behavior = "smooth";
  /**
   * A string value used to determine the display transition options.
   * @group Props
   */
  showTransitionOptions = ".15s";
  /**
   * A string value used to determine the hiding transition options.
   * @group Props
   */
  hideTransitionOptions = ".15s";
  /**
   * Establishes a string value that labels the scroll-top button.
   * @group Props
   */
  buttonAriaLabel;
  /**
   * Used to pass all properties of the ButtonProps to the Button component.
   * @group Props
   */
  buttonProps = {
    rounded: true
  };
  /**
   * Template of the icon.
   * @group Templates
   */
  iconTemplate;
  templates;
  _iconTemplate;
  _icon;
  set icon(value) {
    this._icon = value;
  }
  documentScrollListener;
  parentScrollListener;
  visible = false;
  overlay;
  _componentStyle = inject(ScrollTopStyle);
  ngOnInit() {
    super.ngOnInit();
    if (this.target === "window") this.bindDocumentScrollListener();
    else if (this.target === "parent") this.bindParentScrollListener();
  }
  ngAfterContentInit() {
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case "icon":
          this._iconTemplate = item.template;
          break;
      }
    });
  }
  onClick() {
    let scrollElement = this.target === "window" ? this.document.defaultView : this.el.nativeElement.parentElement;
    scrollElement.scroll({
      top: 0,
      behavior: this.behavior
    });
  }
  onEnter(event) {
    switch (event.toState) {
      case "open":
        this.overlay = event.element;
        zindexutils.set("overlay", this.overlay, this.config.zIndex.overlay);
        break;
      case "void":
        this.overlay = null;
        break;
    }
  }
  onLeave(event) {
    switch (event.toState) {
      case "void":
        zindexutils.clear(event.element);
        break;
    }
  }
  checkVisibility(scrollY) {
    if (scrollY > this.threshold) this.visible = true;
    else this.visible = false;
    this.cd.markForCheck();
  }
  bindParentScrollListener() {
    if (isPlatformBrowser(this.platformId)) {
      this.parentScrollListener = this.renderer.listen(this.el.nativeElement.parentElement, "scroll", () => {
        this.checkVisibility(this.el.nativeElement.parentElement.scrollTop);
      });
    }
  }
  bindDocumentScrollListener() {
    if (isPlatformBrowser(this.platformId)) {
      this.documentScrollListener = this.renderer.listen(this.document.defaultView, "scroll", () => {
        this.checkVisibility(getWindowScrollTop());
      });
    }
  }
  unbindParentScrollListener() {
    if (this.parentScrollListener) {
      this.parentScrollListener();
      this.parentScrollListener = null;
    }
  }
  unbindDocumentScrollListener() {
    if (this.documentScrollListener) {
      this.documentScrollListener();
      this.documentScrollListener = null;
    }
  }
  getStyleClass() {
    return `p-scrolltop p-button${this.styleClass ? ` ${this.styleClass}` : ""}${this.target !== "window" ? " p-scrolltop-sticky" : ""}`;
  }
  ngOnDestroy() {
    if (this.target === "window") this.unbindDocumentScrollListener();
    else if (this.target === "parent") this.unbindParentScrollListener();
    if (this.overlay) {
      zindexutils.clear(this.overlay);
      this.overlay = null;
    }
    super.ngOnDestroy();
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275ScrollTop_BaseFactory;
    return function ScrollTop_Factory(__ngFactoryType__) {
      return (\u0275ScrollTop_BaseFactory || (\u0275ScrollTop_BaseFactory = \u0275\u0275getInheritedFactory(_ScrollTop)))(__ngFactoryType__ || _ScrollTop);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _ScrollTop,
    selectors: [["p-scrollTop"], ["p-scrolltop"], ["p-scroll-top"]],
    contentQueries: function ScrollTop_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        \u0275\u0275contentQuery(dirIndex, _c02, 4);
        \u0275\u0275contentQuery(dirIndex, PrimeTemplate, 4);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.iconTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.templates = _t);
      }
    },
    inputs: {
      styleClass: "styleClass",
      style: "style",
      target: "target",
      threshold: [2, "threshold", "threshold", numberAttribute],
      icon: "icon",
      behavior: "behavior",
      showTransitionOptions: "showTransitionOptions",
      hideTransitionOptions: "hideTransitionOptions",
      buttonAriaLabel: "buttonAriaLabel",
      buttonProps: "buttonProps"
    },
    features: [\u0275\u0275ProvidersFeature([ScrollTopStyle]), \u0275\u0275InheritDefinitionFeature],
    decls: 1,
    vars: 1,
    consts: [["icon", ""], ["type", "button", 3, "styleClass", "ngStyle", "buttonProps", "click", 4, "ngIf"], ["type", "button", 3, "click", "styleClass", "ngStyle", "buttonProps"], [4, "ngIf"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], [3, "class", "ngClass", 4, "ngIf"], [3, "styleClass", "ngStyle", 4, "ngIf"], [3, "ngClass"], [3, "styleClass", "ngStyle"], [3, "ngIf"]],
    template: function ScrollTop_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275template(0, ScrollTop_p_button_0_Template, 3, 10, "p-button", 1);
      }
      if (rf & 2) {
        \u0275\u0275property("ngIf", ctx.visible);
      }
    },
    dependencies: [CommonModule, NgClass, NgIf, NgTemplateOutlet, NgStyle, ChevronUpIcon, Button, SharedModule],
    encapsulation: 2,
    data: {
      animation: [trigger("animation", [state("void", style({
        opacity: 0
      })), state("open", style({
        opacity: 1
      })), transition("void => open", animate("{{showTransitionParams}}")), transition("open => void", animate("{{hideTransitionParams}}"))])]
    },
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScrollTop, [{
    type: Component,
    args: [{
      selector: "p-scrollTop, p-scrolltop, p-scroll-top",
      standalone: true,
      imports: [CommonModule, ChevronUpIcon, Button, SharedModule],
      template: `
        <p-button
            *ngIf="visible"
            [@animation]="{
                value: 'open',
                params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions }
            }"
            (@animation.start)="onEnter($event)"
            (@animation.done)="onLeave($event)"
            [attr.aria-label]="buttonAriaLabel"
            (click)="onClick()"
            [styleClass]="getStyleClass()"
            [ngStyle]="style"
            type="button"
            [buttonProps]="buttonProps"
        >
            <ng-template #icon>
                <ng-container *ngIf="!iconTemplate && !_iconTemplate">
                    <span *ngIf="_icon" [class]="_icon" [ngClass]="'p-scrolltop-icon'"></span>
                    <ChevronUpIcon *ngIf="!_icon" [styleClass]="'p-scrolltop-icon'" [ngStyle]="{ 'font-size': '1rem', scale: '1.5' }" />
                </ng-container>
                <ng-template [ngIf]="!icon" *ngTemplateOutlet="iconTemplate || _iconTemplate; context: { styleClass: 'p-scrolltop-icon' }"></ng-template>
            </ng-template>
        </p-button>
    `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      animations: [trigger("animation", [state("void", style({
        opacity: 0
      })), state("open", style({
        opacity: 1
      })), transition("void => open", animate("{{showTransitionParams}}")), transition("open => void", animate("{{hideTransitionParams}}"))])],
      providers: [ScrollTopStyle]
    }]
  }], null, {
    styleClass: [{
      type: Input
    }],
    style: [{
      type: Input
    }],
    target: [{
      type: Input
    }],
    threshold: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    icon: [{
      type: Input
    }],
    behavior: [{
      type: Input
    }],
    showTransitionOptions: [{
      type: Input
    }],
    hideTransitionOptions: [{
      type: Input
    }],
    buttonAriaLabel: [{
      type: Input
    }],
    buttonProps: [{
      type: Input
    }],
    iconTemplate: [{
      type: ContentChild,
      args: ["icon", {
        descendants: false
      }]
    }],
    templates: [{
      type: ContentChildren,
      args: [PrimeTemplate]
    }]
  });
})();
var ScrollTopModule = class _ScrollTopModule {
  static \u0275fac = function ScrollTopModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ScrollTopModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _ScrollTopModule
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [ScrollTop, SharedModule, SharedModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScrollTopModule, [{
    type: NgModule,
    args: [{
      imports: [ScrollTop, SharedModule],
      exports: [ScrollTop, SharedModule]
    }]
  }], null, null);
})();

// node_modules/primeng/fesm2022/primeng-metergroup.mjs
var _c03 = (a0, a1) => ({
  $implicit: a0,
  icon: a1
});
var _c13 = () => ({
  "p-metergroup-label-icon": true
});
var _c23 = (a0) => ({
  color: a0
});
var _c33 = (a0) => ({
  backgroundColor: a0
});
function MeterGroupLabel_li_1_ng_container_1_i_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 8);
  }
  if (rf & 2) {
    const labelItem_r1 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275classMap(labelItem_r1.icon);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction0(4, _c13))("ngStyle", \u0275\u0275pureFunction1(5, _c23, labelItem_r1.color));
  }
}
function MeterGroupLabel_li_1_ng_container_1_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 9);
  }
  if (rf & 2) {
    const labelItem_r1 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275property("ngStyle", \u0275\u0275pureFunction1(1, _c33, labelItem_r1.color));
  }
}
function MeterGroupLabel_li_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, MeterGroupLabel_li_1_ng_container_1_i_1_Template, 1, 7, "i", 6)(2, MeterGroupLabel_li_1_ng_container_1_span_2_Template, 1, 3, "span", 7);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const labelItem_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", labelItem_r1.icon);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !labelItem_r1.icon);
  }
}
function MeterGroupLabel_li_1_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function MeterGroupLabel_li_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 2);
    \u0275\u0275template(1, MeterGroupLabel_li_1_ng_container_1_Template, 3, 2, "ng-container", 3)(2, MeterGroupLabel_li_1_ng_container_2_Template, 1, 0, "ng-container", 4);
    \u0275\u0275elementStart(3, "span", 5);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const labelItem_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.iconTemplate);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", ctx_r1.iconTemplate)("ngTemplateOutletContext", \u0275\u0275pureFunction2(5, _c03, labelItem_r1, labelItem_r1.icon));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", labelItem_r1.label, " (", ctx_r1.parentInstance.percentValue(labelItem_r1.value), ")");
  }
}
var _c43 = ["label"];
var _c5 = ["meter"];
var _c6 = ["end"];
var _c7 = ["start"];
var _c8 = ["icon"];
var _c9 = ["container"];
var _c10 = (a0, a1, a2) => ({
  $implicit: a0,
  totalPercent: a1,
  percentages: a2
});
var _c11 = (a0, a1, a2, a3, a4) => ({
  $implicit: a0,
  index: a1,
  orientation: a2,
  class: "p-metergroup-meter",
  size: a3,
  totalPercent: a4
});
function MeterGroup_Conditional_2_p_meterGroupLabel_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-meterGroupLabel", 6);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("value", ctx_r0.value)("labelPosition", ctx_r0.labelPosition)("labelOrientation", ctx_r0.labelOrientation)("min", ctx_r0.min)("max", ctx_r0.max)("iconTemplate", ctx_r0.iconTemplate || ctx_r0._iconTemplate);
  }
}
function MeterGroup_Conditional_2_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function MeterGroup_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, MeterGroup_Conditional_2_p_meterGroupLabel_0_Template, 1, 6, "p-meterGroupLabel", 5)(1, MeterGroup_Conditional_2_ng_container_1_Template, 1, 0, "ng-container", 2);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngIf", !ctx_r0.labelTemplate && !ctx_r0._labelTemplate);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", ctx_r0.labelTemplate || ctx_r0.labelTemplate)("ngTemplateOutletContext", \u0275\u0275pureFunction3(3, _c10, ctx_r0.value, ctx_r0.totalPercent(), ctx_r0.percentages()));
  }
}
function MeterGroup_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function MeterGroup_ng_container_5_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function MeterGroup_ng_container_5_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275element(1, "span", 8);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const meterItem_r2 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngStyle", ctx_r0.meterStyle(meterItem_r2));
  }
}
function MeterGroup_ng_container_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, MeterGroup_ng_container_5_ng_container_1_Template, 1, 0, "ng-container", 2)(2, MeterGroup_ng_container_5_ng_container_2_Template, 2, 1, "ng-container", 7);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const meterItem_r2 = ctx.$implicit;
    const index_r3 = ctx.index;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", ctx_r0.meterTemplate || ctx_r0._meterTemplate)("ngTemplateOutletContext", \u0275\u0275pureFunction5(3, _c11, meterItem_r2, index_r3, ctx_r0.orientation, ctx_r0.percentValue(meterItem_r2.value), ctx_r0.totalPercent()));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.meterTemplate && !ctx_r0._meterTemplate && meterItem_r2.value > 0);
  }
}
function MeterGroup_ng_container_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function MeterGroup_Conditional_7_p_meterGroupLabel_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-meterGroupLabel", 6);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("value", ctx_r0.value)("labelPosition", ctx_r0.labelPosition)("labelOrientation", ctx_r0.labelOrientation)("min", ctx_r0.min)("max", ctx_r0.max)("iconTemplate", ctx_r0.iconTemplate || ctx_r0._iconTemplate);
  }
}
function MeterGroup_Conditional_7_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function MeterGroup_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, MeterGroup_Conditional_7_p_meterGroupLabel_0_Template, 1, 6, "p-meterGroupLabel", 5)(1, MeterGroup_Conditional_7_ng_container_1_Template, 1, 0, "ng-container", 2);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngIf", !ctx_r0.labelTemplate && !ctx_r0._labelTemplate);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", ctx_r0.labelTemplate || ctx_r0._labelTemplate)("ngTemplateOutletContext", \u0275\u0275pureFunction3(3, _c10, ctx_r0.value, ctx_r0.totalPercent(), ctx_r0.percentages()));
  }
}
var theme3 = ({
  dt
}) => `
.p-metergroup {
    display: flex;
    gap: ${dt("metergroup.gap")};
}

.p-metergroup-meters {
    display: flex;
    background: ${dt("metergroup.meters.background")};
    border-radius: ${dt("metergroup.border.radius")};
}

.p-metergroup-label-list {
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
    list-style-type: none;
}

.p-metergroup-label {
    display: inline-flex;
    align-items: center;
    gap: ${dt("metergroup.label.gap")};
}

.p-metergroup-label-marker {
    display: inline-flex;
    width: ${dt("metergroup.label.marker.size")};
    height: ${dt("metergroup.label.marker.size")};
    border-radius: 100%;
}

.p-metergroup-label-icon {
    font-size: ${dt("metergroup.label.icon.size")};
    width: ${dt("metergroup.label.icon.size")};
    height: ${dt("metergroup.label.icon.size")};
}

.p-metergroup-horizontal {
    flex-direction: column;
}

.p-metergroup-label-list-horizontal {
    gap: ${dt("metergroup.label.list.horizontal.gap")};
}

.p-metergroup-horizontal .p-metergroup-meters {
    height: ${dt("metergroup.meters.size")};
}

.p-metergroup-horizontal .p-metergroup-meter:first-of-type {
    border-start-start-radius: ${dt("metergroup.border.radius")};
    border-end-start-radius: ${dt("metergroup.border.radius")};
}

.p-metergroup-horizontal .p-metergroup-meter:last-of-type {
    border-start-end-radius: ${dt("metergroup.border.radius")};
    border-end-end-radius: ${dt("metergroup.border.radius")};
}

.p-metergroup-vertical {
    flex-direction: row;
}

.p-metergroup-label-list-vertical {
    flex-direction: column;
    gap: ${dt("metergroup.label.list.vertical.gap")};
}

.p-metergroup-vertical .p-metergroup-meters {
    flex-direction: column;
    width: ${dt("metergroup.meters.size")};
    height: 100%;
}

.p-metergroup-vertical .p-metergroup-label-list {
    align-items: start;
}

.p-metergroup-vertical .p-metergroup-meter:first-of-type {
    border-start-start-radius: ${dt("metergroup.border.radius")};
    border-start-end-radius: ${dt("metergroup.border.radius")};
}
.p-metergroup-vertical .p-metergroup-meter:last-of-type {
    border-end-start-radius: ${dt("metergroup.border.radius")};
    border-end-end-radius: ${dt("metergroup.border.radius")};
}
`;
var classes3 = {
  root: ({
    props
  }) => ["p-metergroup p-component", {
    "p-metergroup-horizontal": props.orientation === "horizontal",
    "p-metergroup-vertical": props.orientation === "vertical"
  }],
  meters: "p-metergroup-meters",
  meter: "p-metergroup-meter",
  labelList: ({
    props
  }) => ["p-metergroup-label-list", {
    "p-metergroup-label-list-vertical": props.labelOrientation === "vertical",
    "p-metergroup-label-list-horizontal": props.labelOrientation === "horizontal"
  }],
  label: "p-metergroup-label",
  labelIcon: "p-metergroup-label-icon",
  labelMarker: "p-metergroup-label-marker",
  labelText: "p-metergroup-label-text"
};
var MeterGroupStyle = class _MeterGroupStyle extends BaseStyle {
  name = "metergroup";
  theme = theme3;
  classes = classes3;
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MeterGroupStyle_BaseFactory;
    return function MeterGroupStyle_Factory(__ngFactoryType__) {
      return (\u0275MeterGroupStyle_BaseFactory || (\u0275MeterGroupStyle_BaseFactory = \u0275\u0275getInheritedFactory(_MeterGroupStyle)))(__ngFactoryType__ || _MeterGroupStyle);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _MeterGroupStyle,
    factory: _MeterGroupStyle.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MeterGroupStyle, [{
    type: Injectable
  }], null, null);
})();
var MeterGroupClasses;
(function(MeterGroupClasses2) {
  MeterGroupClasses2["root"] = "p-metergroup";
  MeterGroupClasses2["meters"] = "p-metergroup-meters";
  MeterGroupClasses2["meter"] = "p-metergroup-meter";
  MeterGroupClasses2["labelList"] = "p-metergroup-label-list";
  MeterGroupClasses2["label"] = "p-metergroup-label";
  MeterGroupClasses2["labelIcon"] = "p-metergroup-label-icon";
  MeterGroupClasses2["labelMarker"] = "p-metergroup-label-marker";
  MeterGroupClasses2["labelText"] = "p-metergroup-label-text";
})(MeterGroupClasses || (MeterGroupClasses = {}));
var MeterGroupLabel = class _MeterGroupLabel {
  value = null;
  labelPosition = "end";
  labelOrientation = "horizontal";
  min;
  max;
  iconTemplate;
  get labelClass() {
    return {
      "p-metergroup-label-list p-component": true,
      "p-metergroup-label-list-vertical": this.labelOrientation === "vertical",
      "p-metergroup-label-list-horizontal": this.labelOrientation === "horizontal"
    };
  }
  parentInstance = inject(forwardRef(() => MeterGroup));
  static \u0275fac = function MeterGroupLabel_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MeterGroupLabel)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MeterGroupLabel,
    selectors: [["p-meterGroupLabel"], ["p-metergrouplabel"]],
    inputs: {
      value: "value",
      labelPosition: "labelPosition",
      labelOrientation: "labelOrientation",
      min: "min",
      max: "max",
      iconTemplate: "iconTemplate"
    },
    decls: 2,
    vars: 3,
    consts: [[3, "ngClass"], ["class", "p-metergroup-label", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "p-metergroup-label"], [4, "ngIf"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "p-metergroup-label-text"], [3, "class", "ngClass", "ngStyle", 4, "ngIf"], ["class", "p-metergroup-label-marker", 3, "ngStyle", 4, "ngIf"], [3, "ngClass", "ngStyle"], [1, "p-metergroup-label-marker", 3, "ngStyle"]],
    template: function MeterGroupLabel_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "ol", 0);
        \u0275\u0275template(1, MeterGroupLabel_li_1_Template, 5, 8, "li", 1);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275property("ngClass", ctx.labelClass);
        \u0275\u0275advance();
        \u0275\u0275property("ngForOf", ctx.value)("ngForTrackBy", ctx.parentInstance.trackByFn);
      }
    },
    dependencies: [CommonModule, NgClass, NgForOf, NgIf, NgTemplateOutlet, NgStyle, SharedModule],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MeterGroupLabel, [{
    type: Component,
    args: [{
      selector: "p-meterGroupLabel, p-metergrouplabel",
      standalone: true,
      imports: [CommonModule, SharedModule],
      template: `
        <ol [ngClass]="labelClass">
            <li *ngFor="let labelItem of value; let index = index; trackBy: parentInstance.trackByFn" class="p-metergroup-label">
                <ng-container *ngIf="!iconTemplate">
                    <i *ngIf="labelItem.icon" [class]="labelItem.icon" [ngClass]="{ 'p-metergroup-label-icon': true }" [ngStyle]="{ color: labelItem.color }"></i>
                    <span *ngIf="!labelItem.icon" class="p-metergroup-label-marker" [ngStyle]="{ backgroundColor: labelItem.color }"></span>
                </ng-container>
                <ng-container *ngTemplateOutlet="iconTemplate; context: { $implicit: labelItem, icon: labelItem.icon }"></ng-container>
                <span class="p-metergroup-label-text">{{ labelItem.label }} ({{ parentInstance.percentValue(labelItem.value) }})</span>
            </li>
        </ol>
    `
    }]
  }], null, {
    value: [{
      type: Input
    }],
    labelPosition: [{
      type: Input
    }],
    labelOrientation: [{
      type: Input
    }],
    min: [{
      type: Input
    }],
    max: [{
      type: Input
    }],
    iconTemplate: [{
      type: Input
    }]
  });
})();
var MeterGroup = class _MeterGroup extends BaseComponent {
  /**
   * Current value of the metergroup.
   * @group Props
   */
  value;
  /**
   * Mininum boundary value.
   * @group Props
   */
  min = 0;
  /**
   * Maximum boundary value.
   * @group Props
   */
  max = 100;
  /**
   * Specifies the layout of the component, valid values are 'horizontal' and 'vertical'.
   * @group Props
   */
  orientation = "horizontal";
  /**
   * Specifies the label position of the component, valid values are 'start' and 'end'.
   * @group Props
   */
  labelPosition = "end";
  /**
   * Specifies the label orientation of the component, valid values are 'horizontal' and 'vertical'.
   * @group Props
   */
  labelOrientation = "horizontal";
  /**
   * Inline style of the element.
   * @group Props
   */
  style;
  /**
   * Style class of the element.
   * @group Props
   */
  styleClass;
  get vertical() {
    return this.orientation === "vertical";
  }
  get containerClass() {
    return {
      "p-metergroup p-component": true,
      "p-metergroup-horizontal": this.orientation === "horizontal",
      "p-metergroup-vertical": this.orientation === "vertical"
    };
  }
  labelTemplate;
  meterTemplate;
  endTemplate;
  startTemplate;
  iconTemplate;
  templates;
  _labelTemplate;
  _meterTemplate;
  _endTemplate;
  _startTemplate;
  _iconTemplate;
  _componentStyle = inject(MeterGroupStyle);
  container;
  ngAfterViewInit() {
    super.ngAfterViewInit();
    const _container = this.container.nativeElement;
    const height = getOuterHeight(_container);
    this.vertical && (_container.style.height = height + "px");
  }
  ngAfterContentInit() {
    this.templates?.forEach((item) => {
      switch (item.getType()) {
        case "label":
          this._labelTemplate = item.template;
          break;
        case "meter":
          this._meterTemplate = item.template;
          break;
        case "icon":
          this._iconTemplate = item.template;
          break;
        case "start":
          this._startTemplate = item.template;
          break;
        case "end":
          this._endTemplate = item.template;
          break;
      }
    });
  }
  percent(meter = 0) {
    const percentOfItem = (meter - this.min) / (this.max - this.min) * 100;
    return Math.round(Math.max(0, Math.min(100, percentOfItem)));
  }
  percentValue(meter) {
    return this.percent(meter) + "%";
  }
  meterStyle(val) {
    return {
      backgroundColor: val.color,
      width: this.orientation === "horizontal" && this.percentValue(val.value),
      height: this.orientation === "vertical" && this.percentValue(val.value)
    };
  }
  totalPercent() {
    return this.percent(this.value.reduce((total, val) => total + val.value, 0));
  }
  percentages() {
    let sum = 0;
    const sumsArray = [];
    this.value.forEach((item) => {
      sum += item.value;
      sumsArray.push(sum);
    });
    return sumsArray;
  }
  trackByFn(index) {
    return index;
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MeterGroup_BaseFactory;
    return function MeterGroup_Factory(__ngFactoryType__) {
      return (\u0275MeterGroup_BaseFactory || (\u0275MeterGroup_BaseFactory = \u0275\u0275getInheritedFactory(_MeterGroup)))(__ngFactoryType__ || _MeterGroup);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MeterGroup,
    selectors: [["p-meterGroup"], ["p-metergroup"], ["p-meter-group"]],
    contentQueries: function MeterGroup_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        \u0275\u0275contentQuery(dirIndex, _c43, 4);
        \u0275\u0275contentQuery(dirIndex, _c5, 4);
        \u0275\u0275contentQuery(dirIndex, _c6, 4);
        \u0275\u0275contentQuery(dirIndex, _c7, 4);
        \u0275\u0275contentQuery(dirIndex, _c8, 4);
        \u0275\u0275contentQuery(dirIndex, PrimeTemplate, 4);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.labelTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.meterTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.endTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.startTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.iconTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.templates = _t);
      }
    },
    viewQuery: function MeterGroup_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c9, 5, ElementRef);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.container = _t.first);
      }
    },
    inputs: {
      value: "value",
      min: "min",
      max: "max",
      orientation: "orientation",
      labelPosition: "labelPosition",
      labelOrientation: "labelOrientation",
      style: "style",
      styleClass: "styleClass"
    },
    features: [\u0275\u0275ProvidersFeature([MeterGroupStyle]), \u0275\u0275InheritDefinitionFeature],
    decls: 8,
    vars: 24,
    consts: [["container", ""], [3, "ngClass", "ngStyle"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "p-metergroup-meters"], [4, "ngFor", "ngForOf", "ngForTrackBy"], [3, "value", "labelPosition", "labelOrientation", "min", "max", "iconTemplate", 4, "ngIf"], [3, "value", "labelPosition", "labelOrientation", "min", "max", "iconTemplate"], [4, "ngIf"], [1, "p-metergroup-meter", 3, "ngStyle"]],
    template: function MeterGroup_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 1, 0);
        \u0275\u0275template(2, MeterGroup_Conditional_2_Template, 2, 7)(3, MeterGroup_ng_container_3_Template, 1, 0, "ng-container", 2);
        \u0275\u0275elementStart(4, "div", 3);
        \u0275\u0275template(5, MeterGroup_ng_container_5_Template, 3, 9, "ng-container", 4);
        \u0275\u0275elementEnd();
        \u0275\u0275template(6, MeterGroup_ng_container_6_Template, 1, 0, "ng-container", 2)(7, MeterGroup_Conditional_7_Template, 2, 7);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275classMap(ctx.styleClass);
        \u0275\u0275property("ngClass", ctx.containerClass)("ngStyle", ctx.style);
        \u0275\u0275attribute("role", "meter")("aria-valuemin", ctx.min)("aria-valuemax", ctx.max)("aria-valuenow", ctx.totalPercent());
        \u0275\u0275advance(2);
        \u0275\u0275conditional(ctx.labelPosition === "start" ? 2 : -1);
        \u0275\u0275advance();
        \u0275\u0275property("ngTemplateOutlet", ctx.startTemplate || ctx._startTemplate)("ngTemplateOutletContext", \u0275\u0275pureFunction3(16, _c10, ctx.value, ctx.totalPercent(), ctx.percentages()));
        \u0275\u0275advance(2);
        \u0275\u0275property("ngForOf", ctx.value)("ngForTrackBy", ctx.trackByFn);
        \u0275\u0275advance();
        \u0275\u0275property("ngTemplateOutlet", ctx.endTemplate || ctx._endTemplate)("ngTemplateOutletContext", \u0275\u0275pureFunction3(20, _c10, ctx.value, ctx.totalPercent(), ctx.percentages()));
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.labelPosition === "end" ? 7 : -1);
      }
    },
    dependencies: [CommonModule, NgClass, NgForOf, NgIf, NgTemplateOutlet, NgStyle, MeterGroupLabel, SharedModule],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MeterGroup, [{
    type: Component,
    args: [{
      selector: "p-meterGroup, p-metergroup, p-meter-group",
      standalone: true,
      imports: [CommonModule, MeterGroupLabel, SharedModule],
      template: `
        <div #container [ngClass]="containerClass" [attr.role]="'meter'" [attr.aria-valuemin]="min" [attr.aria-valuemax]="max" [attr.aria-valuenow]="totalPercent()" [ngStyle]="style" [class]="styleClass">
            @if (labelPosition === 'start') {
                <p-meterGroupLabel *ngIf="!labelTemplate && !_labelTemplate" [value]="value" [labelPosition]="labelPosition" [labelOrientation]="labelOrientation" [min]="min" [max]="max" [iconTemplate]="iconTemplate || _iconTemplate" />
                <ng-container *ngTemplateOutlet="labelTemplate || labelTemplate; context: { $implicit: value, totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
            }
            <ng-container *ngTemplateOutlet="startTemplate || _startTemplate; context: { $implicit: value, totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
            <div class="p-metergroup-meters">
                <ng-container *ngFor="let meterItem of value; let index = index; trackBy: trackByFn">
                    <ng-container
                        *ngTemplateOutlet="
                            meterTemplate || _meterTemplate;
                            context: {
                                $implicit: meterItem,
                                index: index,
                                orientation: this.orientation,
                                class: 'p-metergroup-meter',
                                size: percentValue(meterItem.value),
                                totalPercent: totalPercent()
                            }
                        "
                    >
                    </ng-container>
                    <ng-container *ngIf="!meterTemplate && !_meterTemplate && meterItem.value > 0">
                        <span class="p-metergroup-meter" [ngStyle]="meterStyle(meterItem)"></span>
                    </ng-container>
                </ng-container>
            </div>
            <ng-container *ngTemplateOutlet="endTemplate || _endTemplate; context: { $implicit: value, totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
            @if (labelPosition === 'end') {
                <p-meterGroupLabel *ngIf="!labelTemplate && !_labelTemplate" [value]="value" [labelPosition]="labelPosition" [labelOrientation]="labelOrientation" [min]="min" [max]="max" [iconTemplate]="iconTemplate || _iconTemplate" />
                <ng-container *ngTemplateOutlet="labelTemplate || _labelTemplate; context: { $implicit: value, totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
            }
        </div>
    `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [MeterGroupStyle]
    }]
  }], null, {
    value: [{
      type: Input
    }],
    min: [{
      type: Input
    }],
    max: [{
      type: Input
    }],
    orientation: [{
      type: Input
    }],
    labelPosition: [{
      type: Input
    }],
    labelOrientation: [{
      type: Input
    }],
    style: [{
      type: Input
    }],
    styleClass: [{
      type: Input
    }],
    labelTemplate: [{
      type: ContentChild,
      args: ["label", {
        descendants: false
      }]
    }],
    meterTemplate: [{
      type: ContentChild,
      args: ["meter", {
        descendants: false
      }]
    }],
    endTemplate: [{
      type: ContentChild,
      args: ["end", {
        descendants: false
      }]
    }],
    startTemplate: [{
      type: ContentChild,
      args: ["start", {
        descendants: false
      }]
    }],
    iconTemplate: [{
      type: ContentChild,
      args: ["icon", {
        descendants: false
      }]
    }],
    templates: [{
      type: ContentChildren,
      args: [PrimeTemplate]
    }],
    container: [{
      type: ViewChild,
      args: ["container", {
        read: ElementRef
      }]
    }]
  });
})();
var MeterGroupModule = class _MeterGroupModule {
  static \u0275fac = function MeterGroupModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MeterGroupModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _MeterGroupModule
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [MeterGroup, SharedModule, SharedModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MeterGroupModule, [{
    type: NgModule,
    args: [{
      imports: [MeterGroup, SharedModule],
      exports: [MeterGroup, SharedModule]
    }]
  }], null, null);
})();

// src/app/pages/uikit/miscdemo.ts
var _c04 = () => ({ "background-color": "#9c27b0", color: "#ffffff" });
var _c14 = () => ({ "background-color": "#2196F3", color: "#ffffff" });
var _c24 = () => ({ severity: "contrast", raised: true, rounded: true });
var MiscDemo = class _MiscDemo {
  value = 0;
  interval;
  meterGroupValue = [
    { label: "Apps", color: "#34d399", value: 16 },
    { label: "Messages", color: "#fbbf24", value: 8 },
    { label: "Media", color: "#60a5fa", value: 24 },
    { label: "System", color: "#c084fc", value: 10 }
  ];
  ngOnInit() {
    this.interval = setInterval(() => {
      this.value = this.value + Math.floor(Math.random() * 10) + 1;
      if (this.value >= 100) {
        this.value = 100;
        clearInterval(this.interval);
      }
    }, 2e3);
  }
  ngOnDestroy() {
    clearInterval(this.interval);
  }
  static \u0275fac = function MiscDemo_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MiscDemo)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MiscDemo, selectors: [["app-misc-demo"]], decls: 141, vars: 28, consts: [[1, "card"], [1, "font-semibold", "text-xl", "mb-4"], [1, "flex", "flex-col", "md:flex-row", "gap-4"], [1, "md:w-1/2"], [3, "value", "showValue"], [1, "flex", "flex-col", "md:flex-row", "gap-8"], [1, "flex", "gap-2"], ["value", "2"], ["value", "8", "severity", "success"], ["value", "4", "severity", "info"], ["value", "12", "severity", "warn"], ["value", "3", "severity", "danger"], [1, "font-semibold", "my-4"], [1, "flex", "gap-6"], [1, "pi", "pi-bell", 2, "font-size", "2rem"], ["value", "4", "severity", "danger"], [1, "pi", "pi-calendar", 2, "font-size", "2rem"], ["severity", "danger"], [1, "pi", "pi-envelope", 2, "font-size", "2rem"], ["label", "Emails", "badge", "8"], ["label", "Messages", "icon", "pi pi-users", "severity", "warn", "badge", "8", "badgeSeverity", "danger"], [1, "flex", "items-start", "gap-2"], [3, "value"], ["badgeSize", "large", "severity", "warn", 3, "value"], ["badgeSize", "xlarge", "severity", "success", 3, "value"], [1, "font-semibold", "mb-4"], [1, "mb-4"], ["image", "/images/avatar/amyelsner.png", "size", "large", "shape", "circle"], ["image", "/images/avatar/asiyajavayant.png", "size", "large", "shape", "circle"], ["image", "/images/avatar/onyamalimba.png", "size", "large", "shape", "circle"], ["image", "/images/avatar/ionibowcher.png", "size", "large", "shape", "circle"], ["image", "/images/avatar/xuxuefeng.png", "size", "large", "shape", "circle"], ["label", "+2", "shape", "circle", "size", "large"], ["label", "P", "size", "xlarge", "shape", "circle", 1, "mr-2"], ["label", "V", "size", "large", "shape", "circle", 1, "mr-2"], ["label", "U", "shape", "circle", 1, "mr-2"], ["value", "4", "severity", "danger", 1, "inline-flex"], ["label", "U", "size", "xlarge"], [2, "height", "200px", "overflow", "auto"], ["target", "parent", "icon", "pi pi-arrow-up", 3, "threshold", "buttonProps"], ["value", "Primary"], ["severity", "success", "value", "Success"], ["severity", "info", "value", "Info"], ["severity", "warn", "value", "Warning"], ["severity", "danger", "value", "Danger"], ["value", "Primary", 3, "rounded"], ["severity", "success", "value", "Success", 3, "rounded"], ["severity", "info", "value", "Info", 3, "rounded"], ["severity", "warn", "value", "Warning", 3, "rounded"], ["severity", "danger", "value", "Danger", 3, "rounded"], ["icon", "pi pi-user", "value", "Primary"], ["icon", "pi pi-check", "severity", "success", "value", "Success"], ["icon", "pi pi-info-circle", "severity", "info", "value", "Info"], ["icon", "pi pi-exclamation-triangle", "severity", "warn", "value", "Warning"], ["icon", "pi pi-times", "severity", "danger", "value", "Danger"], [1, "flex", "items-center", "flex-col", "sm:flex-row", "gap-2"], ["label", "Action"], ["label", "Comedy"], ["label", "Mystery"], ["label", "Thriller", 3, "removable"], ["label", "Apple", "icon", "pi pi-apple"], ["label", "Facebook", "icon", "pi pi-facebook"], ["label", "Google", "icon", "pi pi-google"], ["label", "Microsoft", "icon", "pi pi-microsoft", 3, "removable"], ["label", "Amy Elsner"], ["src", "/images/avatar/amyelsner.png", "alt", "avatar", 1, "w-8", "h-8"], ["label", "Asiya Javayant"], ["src", "/images/avatar/asiyajavayant.png", "alt", "avatar", 1, "w-8", "h-8"], ["label", "Onyama Limba"], ["src", "/images/avatar/onyamalimba.png", "alt", "avatar", 1, "w-8", "h-8"], ["label", "Xuxue Feng", 3, "removable"], ["src", "/images/avatar/xuxuefeng.png", "alt", "avatar", 1, "w-8", "h-8"], [1, "rounded-border", "border", "border-surface", "p-12"], [1, "flex", "mb-4"], ["shape", "circle", "size", "4rem", "styleClass", "mr-2"], ["width", "10rem", "styleClass", "mb-2"], ["width", "5rem", "styleClass", "mb-2"], ["height", ".5rem"], ["width", "100%", "height", "150px"], [1, "flex", "justify-between", "mt-6"], ["width", "4rem", "height", "2rem"]], template: function MiscDemo_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
      \u0275\u0275text(2, "ProgressBar");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "div", 2)(4, "div", 3);
      \u0275\u0275element(5, "p-progressbar", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "div", 3);
      \u0275\u0275element(7, "p-progressbar", 4);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(8, "div", 5)(9, "div", 3)(10, "div", 0)(11, "div", 1);
      \u0275\u0275text(12, "Badge");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 6);
      \u0275\u0275element(14, "p-badge", 7)(15, "p-badge", 8)(16, "p-badge", 9)(17, "p-badge", 10)(18, "p-badge", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "div", 12);
      \u0275\u0275text(20, "Overlay");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "div", 13)(22, "p-overlaybadge", 7);
      \u0275\u0275element(23, "i", 14);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "p-overlaybadge", 15);
      \u0275\u0275element(25, "i", 16);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "p-overlaybadge", 17);
      \u0275\u0275element(27, "i", 18);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(28, "div", 12);
      \u0275\u0275text(29, "Button");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "div", 6);
      \u0275\u0275element(31, "p-button", 19)(32, "p-button", 20);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "div", 12);
      \u0275\u0275text(34, "Sizes");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(35, "div", 21);
      \u0275\u0275element(36, "p-badge", 22)(37, "p-badge", 23)(38, "p-badge", 24);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(39, "div", 0)(40, "div", 1);
      \u0275\u0275text(41, "Avatar");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(42, "div", 25);
      \u0275\u0275text(43, "Group");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(44, "p-avatar-group", 26);
      \u0275\u0275element(45, "p-avatar", 27)(46, "p-avatar", 28)(47, "p-avatar", 29)(48, "p-avatar", 30)(49, "p-avatar", 31)(50, "p-avatar", 32);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(51, "div", 12);
      \u0275\u0275text(52, "Label - Circle");
      \u0275\u0275elementEnd();
      \u0275\u0275element(53, "p-avatar", 33)(54, "p-avatar", 34)(55, "p-avatar", 35);
      \u0275\u0275elementStart(56, "div", 12);
      \u0275\u0275text(57, "Icon - Badge");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(58, "p-overlaybadge", 36);
      \u0275\u0275element(59, "p-avatar", 37);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(60, "div", 0)(61, "div", 1);
      \u0275\u0275text(62, "ScrollTop");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(63, "div", 38)(64, "p");
      \u0275\u0275text(65, " Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae et leo duis ut diam. Ultricies mi quis hendrerit dolor magna eget est lorem. Amet consectetur adipiscing elit ut. Nam libero justo laoreet sit amet. Pharetra massa massa ultricies mi quis hendrerit dolor magna. Est ultricies integer quis auctor elit sed vulputate. Consequat ac felis donec et. Tellus orci ac auctor augue mauris. Semper feugiat nibh sed pulvinar proin gravida hendrerit lectus a. Tincidunt arcu non sodales neque sodales. Metus aliquam eleifend mi in nulla posuere sollicitudin aliquam ultrices. Sodales ut etiam sit amet nisl purus. Cursus sit amet dictum sit amet. Tristique senectus et netus et malesuada fames ac turpis egestas. Et tortor consequat id porta nibh venenatis cras sed. Diam maecenas ultricies mi eget mauris. Eget egestas purus viverra accumsan in nisl nisi. Suscipit adipiscing bibendum est ultricies integer. Mattis aliquam faucibus purus in massa tempor nec. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae et leo duis ut diam. Ultricies mi quis hendrerit dolor magna eget est lorem. Amet consectetur adipiscing elit ut. Nam libero justo laoreet sit amet. Pharetra massa massa ultricies mi quis hendrerit dolor magna. Est ultricies integer quis auctor elit sed vulputate. Consequat ac felis donec et. Tellus orci ac auctor augue mauris. Semper feugiat nibh sed pulvinar proin gravida hendrerit lectus a. Tincidunt arcu non sodales neque sodales. Metus aliquam eleifend mi in nulla posuere sollicitudin aliquam ultrices. Sodales ut etiam sit amet nisl purus. Cursus sit amet dictum sit amet. Tristique senectus et netus et malesuada fames ac turpis egestas. Et tortor consequat id porta nibh venenatis cras sed. Diam maecenas ultricies mi eget mauris. Eget egestas purus viverra accumsan in nisl nisi. Suscipit adipiscing bibendum est ultricies integer. Mattis aliquam faucibus purus in massa tempor nec. ");
      \u0275\u0275elementEnd();
      \u0275\u0275element(66, "p-scrolltop", 39);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(67, "div", 0)(68, "div", 1);
      \u0275\u0275text(69, "MeterGroup");
      \u0275\u0275elementEnd();
      \u0275\u0275element(70, "p-metergroup", 22);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(71, "div", 3)(72, "div", 0)(73, "div", 1);
      \u0275\u0275text(74, "Tag");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(75, "div", 25);
      \u0275\u0275text(76, "Default");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(77, "div", 6);
      \u0275\u0275element(78, "p-tag", 40)(79, "p-tag", 41)(80, "p-tag", 42)(81, "p-tag", 43)(82, "p-tag", 44);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(83, "div", 12);
      \u0275\u0275text(84, "Pills");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(85, "div", 6);
      \u0275\u0275element(86, "p-tag", 45)(87, "p-tag", 46)(88, "p-tag", 47)(89, "p-tag", 48)(90, "p-tag", 49);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(91, "div", 12);
      \u0275\u0275text(92, "Icons");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(93, "div", 6);
      \u0275\u0275element(94, "p-tag", 50)(95, "p-tag", 51)(96, "p-tag", 52)(97, "p-tag", 53)(98, "p-tag", 54);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(99, "div", 0)(100, "div", 1);
      \u0275\u0275text(101, "Chip");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(102, "div", 25);
      \u0275\u0275text(103, "Basic");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(104, "div", 55);
      \u0275\u0275element(105, "p-chip", 56)(106, "p-chip", 57)(107, "p-chip", 58)(108, "p-chip", 59);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(109, "div", 12);
      \u0275\u0275text(110, "Icon");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(111, "div", 55);
      \u0275\u0275element(112, "p-chip", 60)(113, "p-chip", 61)(114, "p-chip", 62)(115, "p-chip", 63);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(116, "div", 12);
      \u0275\u0275text(117, "Image");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(118, "div", 55)(119, "p-chip", 64);
      \u0275\u0275element(120, "img", 65);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(121, "p-chip", 66);
      \u0275\u0275element(122, "img", 67);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(123, "p-chip", 68);
      \u0275\u0275element(124, "img", 69);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(125, "p-chip", 70);
      \u0275\u0275element(126, "img", 71);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(127, "div", 0)(128, "div", 1);
      \u0275\u0275text(129, "Skeleton");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(130, "div", 72)(131, "div", 73);
      \u0275\u0275element(132, "p-skeleton", 74);
      \u0275\u0275elementStart(133, "div");
      \u0275\u0275element(134, "p-skeleton", 75)(135, "p-skeleton", 76)(136, "p-skeleton", 77);
      \u0275\u0275elementEnd()();
      \u0275\u0275element(137, "p-skeleton", 78);
      \u0275\u0275elementStart(138, "div", 79);
      \u0275\u0275element(139, "p-skeleton", 80)(140, "p-skeleton", 80);
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(5);
      \u0275\u0275property("value", ctx.value)("showValue", true);
      \u0275\u0275advance(2);
      \u0275\u0275property("value", 50)("showValue", false);
      \u0275\u0275advance(29);
      \u0275\u0275property("value", 2);
      \u0275\u0275advance();
      \u0275\u0275property("value", 4);
      \u0275\u0275advance();
      \u0275\u0275property("value", 6);
      \u0275\u0275advance(12);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(24, _c04));
      \u0275\u0275advance(4);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(25, _c14));
      \u0275\u0275advance();
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(26, _c04));
      \u0275\u0275advance(11);
      \u0275\u0275property("threshold", 100)("buttonProps", \u0275\u0275pureFunction0(27, _c24));
      \u0275\u0275advance(4);
      \u0275\u0275property("value", ctx.meterGroupValue);
      \u0275\u0275advance(16);
      \u0275\u0275property("rounded", true);
      \u0275\u0275advance();
      \u0275\u0275property("rounded", true);
      \u0275\u0275advance();
      \u0275\u0275property("rounded", true);
      \u0275\u0275advance();
      \u0275\u0275property("rounded", true);
      \u0275\u0275advance();
      \u0275\u0275property("rounded", true);
      \u0275\u0275advance(18);
      \u0275\u0275property("removable", true);
      \u0275\u0275advance(7);
      \u0275\u0275property("removable", true);
      \u0275\u0275advance(10);
      \u0275\u0275property("removable", true);
    }
  }, dependencies: [CommonModule, ProgressBarModule, ProgressBar, BadgeModule, Badge, AvatarModule, Avatar, ScrollPanelModule, TagModule, Tag, ChipModule, Chip, ButtonModule, Button, SkeletonModule, Skeleton, AvatarGroupModule, AvatarGroup, ScrollTopModule, ScrollTop, OverlayBadgeModule, OverlayBadge, MeterGroupModule, MeterGroup], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MiscDemo, { className: "MiscDemo", filePath: "src/app/pages/uikit/miscdemo.ts", lineNumber: 232 });
})();
export {
  MiscDemo
};
//# sourceMappingURL=chunk-GDS2EIH6.js.map
