import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  TabsModule
} from "./chunk-24QVUA7A.js";
import {
  Toolbar,
  ToolbarModule
} from "./chunk-MBO5DVGW.js";
import {
  Fieldset,
  FieldsetModule
} from "./chunk-NFUGNMSZ.js";
import {
  SplitButton,
  SplitButtonModule
} from "./chunk-L4DY2TIW.js";
import "./chunk-GEHWKAXI.js";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionModule,
  AccordionPanel
} from "./chunk-GWCBG6OL.js";
import {
  Panel,
  PanelModule
} from "./chunk-WJXIL2JJ.js";
import {
  MenuModule
} from "./chunk-RKCUEC6H.js";
import {
  Divider,
  DividerModule
} from "./chunk-VDET62CU.js";
import "./chunk-OCW7T434.js";
import "./chunk-6GA37Q7Z.js";
import "./chunk-YBM6FZLP.js";
import "./chunk-U4P2VV4G.js";
import "./chunk-CPYA4VSS.js";
import "./chunk-XS7IVZ5T.js";
import {
  IconField,
  IconFieldModule,
  InputIcon,
  InputIconModule
} from "./chunk-WIQZFAVH.js";
import "./chunk-CCBQFN2J.js";
import "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
import {
  InputText,
  InputTextModule
} from "./chunk-FZELBHWZ.js";
import "./chunk-4IUQ6KTI.js";
import "./chunk-E352KRZV.js";
import {
  Button,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import {
  RippleModule
} from "./chunk-AP3OAIHW.js";
import {
  BaseComponent,
  BaseStyle,
  PrimeTemplate,
  SharedModule,
  addClass,
  getHeight,
  getOuterHeight,
  getOuterWidth,
  getWidth,
  hasClass,
  isRTL,
  removeClass
} from "./chunk-NQNBRQ7H.js";
import {
  FormsModule
} from "./chunk-3HTR5OU7.js";
import "./chunk-BMYIFZHZ.js";
import "./chunk-W3K3GK4Z.js";
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
  ContentChildren,
  EventEmitter,
  Injectable,
  Input,
  NgModule,
  Output,
  ViewChild,
  ViewEncapsulation,
  computed,
  contentChild,
  inject,
  numberAttribute,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵInheritDefinitionFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵcontentQuery,
  ɵɵcontentQuerySignal,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelement,
  ɵɵelementContainer,
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
  ɵɵqueryAdvance,
  ɵɵqueryRefresh,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵviewQuery
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// node_modules/primeng/fesm2022/primeng-splitter.mjs
var _c0 = ["*"];
var _c1 = ["panel"];
var _c2 = ["container"];
var _c3 = (a0) => ({
  display: "flex",
  "flex-wrap": "nowrap",
  "flex-direction": a0
});
function Splitter_ng_template_2_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function Splitter_ng_template_2_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275listener("mousedown", function Splitter_ng_template_2_div_2_Template_div_mousedown_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const i_r2 = \u0275\u0275nextContext().index;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onGutterMouseDown($event, i_r2));
    })("touchstart", function Splitter_ng_template_2_div_2_Template_div_touchstart_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const i_r2 = \u0275\u0275nextContext().index;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onGutterTouchStart($event, i_r2));
    })("touchmove", function Splitter_ng_template_2_div_2_Template_div_touchmove_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onGutterTouchMove($event));
    })("touchend", function Splitter_ng_template_2_div_2_Template_div_touchend_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onGutterTouchEnd($event));
    });
    \u0275\u0275elementStart(1, "div", 7);
    \u0275\u0275listener("keyup", function Splitter_ng_template_2_div_2_Template_div_keyup_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onGutterKeyUp($event));
    })("keydown", function Splitter_ng_template_2_div_2_Template_div_keydown_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      const i_r2 = \u0275\u0275nextContext().index;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onGutterKeyDown($event, i_r2));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("data-p-gutter-resizing", false)("data-pc-section", "gutter");
    \u0275\u0275advance();
    \u0275\u0275property("ngStyle", ctx_r2.gutterStyle());
    \u0275\u0275attribute("aria-orientation", ctx_r2.layout)("aria-valuenow", ctx_r2.prevSize)("data-pc-section", "gutterhandle");
  }
}
function Splitter_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3);
    \u0275\u0275template(1, Splitter_ng_template_2_ng_container_1_Template, 1, 0, "ng-container", 4);
    \u0275\u0275elementEnd();
    \u0275\u0275template(2, Splitter_ng_template_2_div_2_Template, 2, 6, "div", 5);
  }
  if (rf & 2) {
    const panel_r4 = ctx.$implicit;
    const i_r2 = ctx.index;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r2.panelStyleClass);
    \u0275\u0275property("ngClass", ctx_r2.panelContainerClass())("ngStyle", ctx_r2.panelStyle);
    \u0275\u0275attribute("data-pc-name", "splitter")("data-pc-section", "root");
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", panel_r4);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", i_r2 !== ctx_r2.panels.length - 1);
  }
}
var theme = ({
  dt
}) => `
.p-splitter {
    display: flex;
    flex-wrap: nowrap;
    border: 1px solid ${dt("splitter.border.color")};
    background: ${dt("splitter.background")};
    border-radius: ${dt("border.radius.md")};
    color: ${dt("splitter.color")};
}

.p-splitter-vertical {
    flex-direction: column;
}

.p-splitter-gutter {
    flex-grow: 0;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    background: ${dt("splitter.gutter.background")};
}

.p-splitter-gutter-handle {
    border-radius: ${dt("splitter.handle.border.radius")};
    background: ${dt("splitter.handle.background")};
    transition: outline-color ${dt("splitter.transition.duration")}, box-shadow ${dt("splitter.transition.duration")};
    outline-color: transparent;
}

.p-splitter-gutter-handle:focus-visible {
    box-shadow: ${dt("splitter.handle.focus.ring.shadow")};
    outline: ${dt("splitter.handle.focus.ring.width")} ${dt("splitter.handle.focus.ring.style")} ${dt("splitter.handle.focus.ring.color")};
    outline-offset: ${dt("splitter.handle.focus.ring.offset")};
}

.p-splitter-horizontal.p-splitter-resizing {
    cursor: col-resize;
    user-select: none;
}

.p-splitter-vertical.p-splitter-resizing {
    cursor: row-resize;
    user-select: none;
}

.p-splitter-horizontal > .p-splitter-gutter > .p-splitter-gutter-handle {
    height: ${dt("splitter.handle.size")};
    width: 100%;
}

.p-splitter-vertical > .p-splitter-gutter > .p-splitter-gutter-handle {
    width: ${dt("splitter.handle.size")};
    height: 100%;
}

.p-splitter-horizontal > .p-splitter-gutter {
    cursor: col-resize;
}

.p-splitter-vertical > .p-splitter-gutter {
    cursor: row-resize;
}

.p-splitterpanel {
    flex-grow: 1;
    overflow: hidden;
}

.p-splitterpanel-nested {
    display: flex;
    flex-grow: 1;
    justify-content: center;
}

.p-splitterpanel .p-splitter {
    flex-grow: 1;
    border: 0 none;
}
`;
var classes = {
  root: ({
    props
  }) => ["p-splitter p-component", "p-splitter-" + props.layout],
  gutter: "p-splitter-gutter",
  gutterHandle: "p-splitter-gutter-handle"
};
var SplitterStyle = class _SplitterStyle extends BaseStyle {
  name = "splitter";
  theme = theme;
  classes = classes;
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275SplitterStyle_BaseFactory;
    return function SplitterStyle_Factory(__ngFactoryType__) {
      return (\u0275SplitterStyle_BaseFactory || (\u0275SplitterStyle_BaseFactory = \u0275\u0275getInheritedFactory(_SplitterStyle)))(__ngFactoryType__ || _SplitterStyle);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _SplitterStyle,
    factory: _SplitterStyle.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SplitterStyle, [{
    type: Injectable
  }], null, null);
})();
var SplitterClasses;
(function(SplitterClasses2) {
  SplitterClasses2["root"] = "p-splitter";
  SplitterClasses2["gutter"] = "p-splitter-gutter";
  SplitterClasses2["gutterHandle"] = "p-splitter-gutter-handle";
})(SplitterClasses || (SplitterClasses = {}));
var SplitterPanel = class _SplitterPanel extends BaseComponent {
  splitter = contentChild(Splitter);
  nestedState = computed(() => this.splitter());
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275SplitterPanel_BaseFactory;
    return function SplitterPanel_Factory(__ngFactoryType__) {
      return (\u0275SplitterPanel_BaseFactory || (\u0275SplitterPanel_BaseFactory = \u0275\u0275getInheritedFactory(_SplitterPanel)))(__ngFactoryType__ || _SplitterPanel);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _SplitterPanel,
    selectors: [["p-splitter-panel"]],
    contentQueries: function SplitterPanel_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        \u0275\u0275contentQuerySignal(dirIndex, ctx.splitter, Splitter, 5);
      }
      if (rf & 2) {
        \u0275\u0275queryAdvance();
      }
    },
    hostAttrs: [1, "p-splitterpanel"],
    features: [\u0275\u0275InheritDefinitionFeature],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function SplitterPanel_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef();
        \u0275\u0275projection(0);
      }
    },
    dependencies: [CommonModule],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SplitterPanel, [{
    type: Component,
    args: [{
      selector: "p-splitter-panel",
      standalone: true,
      imports: [CommonModule],
      template: `<ng-content></ng-content>`,
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        class: "p-splitterpanel"
      }
    }]
  }], null, null);
})();
var Splitter = class _Splitter extends BaseComponent {
  /**
   * Style class of the component.
   * @group Props
   */
  styleClass;
  /**
   * Style class of the panel.
   * @group Props
   */
  panelStyleClass;
  /**
   * Inline style of the component.
   * @group Props
   */
  style;
  /**
   * Inline style of the panel.
   * @group Props
   */
  panelStyle;
  /**
   * Defines where a stateful splitter keeps its state, valid values are 'session' for sessionStorage and 'local' for localStorage.
   * @group Props
   */
  stateStorage = "session";
  /**
   * Storage identifier of a stateful Splitter.
   * @group Props
   */
  stateKey = null;
  /**
   * Orientation of the panels. Valid values are 'horizontal' and 'vertical'.
   * @group Props
   */
  layout = "horizontal";
  /**
   * Size of the divider in pixels.
   * @group Props
   */
  gutterSize = 4;
  /**
   * Step factor to increment/decrement the size of the panels while pressing the arrow keys.
   * @group Props
   */
  step = 5;
  /**
   * Minimum size of the elements relative to 100%.
   * @group Props
   */
  minSizes = [];
  /**
   * Size of the elements relative to 100%.
   * @group Props
   */
  get panelSizes() {
    return this._panelSizes;
  }
  set panelSizes(val) {
    this._panelSizes = val;
    if (this.el && this.el.nativeElement && this.panels.length > 0) {
      let children = [...this.el.nativeElement.children[0].children].filter((child) => hasClass(child, "p-splitterpanel"));
      let _panelSizes = [];
      this.panels.map((panel, i) => {
        let panelInitialSize = this.panelSizes.length - 1 >= i ? this.panelSizes[i] : null;
        let panelSize = panelInitialSize || 100 / this.panels.length;
        _panelSizes[i] = panelSize;
        children[i].style.flexBasis = "calc(" + panelSize + "% - " + (this.panels.length - 1) * this.gutterSize + "px)";
      });
    }
  }
  /**
   * Callback to invoke when resize ends.
   * @param {SplitterResizeEndEvent} event - Custom panel resize end event
   * @group Emits
   */
  onResizeEnd = new EventEmitter();
  /**
   * Callback to invoke when resize starts.
   * @param {SplitterResizeStartEvent} event - Custom panel resize start event
   * @group Emits
   */
  onResizeStart = new EventEmitter();
  containerViewChild;
  templates;
  panelChildren;
  nested = false;
  panels = [];
  dragging = false;
  mouseMoveListener;
  mouseUpListener;
  touchMoveListener;
  touchEndListener;
  size;
  gutterElement;
  startPos;
  prevPanelElement;
  nextPanelElement;
  nextPanelSize;
  prevPanelSize;
  _panelSizes = [];
  prevPanelIndex;
  timer;
  prevSize;
  _componentStyle = inject(SplitterStyle);
  ngOnInit() {
    super.ngOnInit();
    this.nested = this.isNested();
  }
  ngAfterContentInit() {
    if (this.templates && this.templates.toArray().length > 0) {
      this.templates.forEach((item) => {
        switch (item.getType()) {
          case "panel":
            this.panels.push(item.template);
            break;
          default:
            this.panels.push(item.template);
            break;
        }
      });
    }
    if (this.panelChildren && this.panelChildren.toArray().length > 0) {
      this.panelChildren.forEach((item) => {
        this.panels.push(item);
      });
    }
  }
  ngAfterViewInit() {
    super.ngAfterViewInit();
    if (isPlatformBrowser(this.platformId)) {
      if (this.panels && this.panels.length) {
        let initialized = false;
        if (this.isStateful()) {
          initialized = this.restoreState();
        }
        if (!initialized) {
          let children = [...this.el.nativeElement.children[0].children].filter((child) => hasClass(child, "p-splitterpanel"));
          let _panelSizes = [];
          this.panels.map((panel, i) => {
            let panelInitialSize = this.panelSizes.length - 1 >= i ? this.panelSizes[i] : null;
            let panelSize = panelInitialSize || 100 / this.panels.length;
            _panelSizes[i] = panelSize;
            children[i].style.flexBasis = "calc(" + panelSize + "% - " + (this.panels.length - 1) * this.gutterSize + "px)";
          });
          this._panelSizes = _panelSizes;
          this.prevSize = parseFloat(_panelSizes[0]).toFixed(4);
        }
      }
    }
  }
  resizeStart(event, index, isKeyDown) {
    this.gutterElement = event.currentTarget || event.target.parentElement;
    this.size = this.horizontal() ? getWidth(this.containerViewChild.nativeElement) : getHeight(this.containerViewChild.nativeElement);
    if (!isKeyDown) {
      this.dragging = true;
      this.startPos = this.horizontal() ? event instanceof MouseEvent ? event.pageX : event.changedTouches[0].pageX : event instanceof MouseEvent ? event.pageY : event.changedTouches[0].pageY;
    }
    this.prevPanelElement = this.gutterElement.previousElementSibling;
    this.nextPanelElement = this.gutterElement.nextElementSibling;
    if (isKeyDown) {
      this.prevPanelSize = this.horizontal() ? getOuterWidth(this.prevPanelElement, true) : getOuterHeight(this.prevPanelElement, true);
      this.nextPanelSize = this.horizontal() ? getOuterWidth(this.nextPanelElement, true) : getOuterHeight(this.nextPanelElement, true);
    } else {
      this.prevPanelSize = 100 * (this.horizontal() ? getOuterWidth(this.prevPanelElement, true) : getOuterHeight(this.prevPanelElement, true)) / this.size;
      this.nextPanelSize = 100 * (this.horizontal() ? getOuterWidth(this.nextPanelElement, true) : getOuterHeight(this.nextPanelElement, true)) / this.size;
    }
    this.prevPanelIndex = index;
    addClass(this.gutterElement, "p-splitter-gutter-resizing");
    this.gutterElement.setAttribute("data-p-gutter-resizing", "true");
    addClass(this.containerViewChild.nativeElement, "p-splitter-resizing");
    this.containerViewChild.nativeElement.setAttribute("data-p-resizing", "true");
    this.onResizeStart.emit({
      originalEvent: event,
      sizes: this._panelSizes
    });
  }
  onResize(event, step, isKeyDown) {
    let newPos, newPrevPanelSize, newNextPanelSize;
    if (isKeyDown) {
      if (this.horizontal()) {
        newPrevPanelSize = 100 * (this.prevPanelSize + step) / this.size;
        newNextPanelSize = 100 * (this.nextPanelSize - step) / this.size;
      } else {
        newPrevPanelSize = 100 * (this.prevPanelSize - step) / this.size;
        newNextPanelSize = 100 * (this.nextPanelSize + step) / this.size;
      }
    } else {
      if (this.horizontal()) {
        if (isRTL(this.el.nativeElement)) {
          newPos = (this.startPos - event.pageX) * 100 / this.size;
        } else {
          newPos = (event.pageX - this.startPos) * 100 / this.size;
        }
      } else {
        newPos = (event.pageY - this.startPos) * 100 / this.size;
      }
      newPrevPanelSize = this.prevPanelSize + newPos;
      newNextPanelSize = this.nextPanelSize - newPos;
    }
    this.prevSize = parseFloat(newPrevPanelSize).toFixed(4);
    if (this.validateResize(newPrevPanelSize, newNextPanelSize)) {
      this.prevPanelElement.style.flexBasis = "calc(" + newPrevPanelSize + "% - " + (this.panels.length - 1) * this.gutterSize + "px)";
      this.nextPanelElement.style.flexBasis = "calc(" + newNextPanelSize + "% - " + (this.panels.length - 1) * this.gutterSize + "px)";
      this._panelSizes[this.prevPanelIndex] = newPrevPanelSize;
      this._panelSizes[this.prevPanelIndex + 1] = newNextPanelSize;
    }
  }
  resizeEnd(event) {
    if (this.isStateful()) {
      this.saveState();
    }
    this.onResizeEnd.emit({
      originalEvent: event,
      sizes: this._panelSizes
    });
    removeClass(this.gutterElement, "p-splitter-gutter-resizing");
    removeClass(this.containerViewChild.nativeElement, "p-splitter-resizing");
    this.clear();
  }
  onGutterMouseDown(event, index) {
    this.resizeStart(event, index);
    this.bindMouseListeners();
  }
  onGutterTouchStart(event, index) {
    if (event.cancelable) {
      this.resizeStart(event, index);
      this.bindTouchListeners();
      event.preventDefault();
    }
  }
  onGutterTouchMove(event) {
    this.onResize(event);
    event.preventDefault();
  }
  onGutterTouchEnd(event) {
    this.resizeEnd(event);
    this.unbindTouchListeners();
    if (event.cancelable) event.preventDefault();
  }
  repeat(event, index, step) {
    this.resizeStart(event, index, true);
    this.onResize(event, step, true);
  }
  setTimer(event, index, step) {
    this.clearTimer();
    this.timer = setTimeout(() => {
      this.repeat(event, index, step);
    }, 40);
  }
  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
  onGutterKeyUp(event) {
    this.clearTimer();
    this.resizeEnd(event);
  }
  onGutterKeyDown(event, index) {
    switch (event.code) {
      case "ArrowLeft": {
        if (this.layout === "horizontal") {
          this.setTimer(event, index, this.step * -1);
        }
        event.preventDefault();
        break;
      }
      case "ArrowRight": {
        if (this.layout === "horizontal") {
          this.setTimer(event, index, this.step);
        }
        event.preventDefault();
        break;
      }
      case "ArrowDown": {
        if (this.layout === "vertical") {
          this.setTimer(event, index, this.step * -1);
        }
        event.preventDefault();
        break;
      }
      case "ArrowUp": {
        if (this.layout === "vertical") {
          this.setTimer(event, index, this.step);
        }
        event.preventDefault();
        break;
      }
      default:
        break;
    }
  }
  validateResize(newPrevPanelSize, newNextPanelSize) {
    if (this.minSizes.length >= 1 && this.minSizes[0] && this.minSizes[0] > newPrevPanelSize) {
      return false;
    }
    if (this.minSizes.length > 1 && this.minSizes[1] && this.minSizes[1] > newNextPanelSize) {
      return false;
    }
    return true;
  }
  bindMouseListeners() {
    if (!this.mouseMoveListener) {
      this.mouseMoveListener = this.renderer.listen(this.document, "mousemove", (event) => {
        this.onResize(event);
      });
    }
    if (!this.mouseUpListener) {
      this.mouseUpListener = this.renderer.listen(this.document, "mouseup", (event) => {
        this.resizeEnd(event);
        this.unbindMouseListeners();
      });
    }
  }
  bindTouchListeners() {
    if (!this.touchMoveListener) {
      this.touchMoveListener = this.renderer.listen(this.document, "touchmove", (event) => {
        this.onResize(event.changedTouches[0]);
      });
    }
    if (!this.touchEndListener) {
      this.touchEndListener = this.renderer.listen(this.document, "touchend", (event) => {
        this.resizeEnd(event);
        this.unbindTouchListeners();
      });
    }
  }
  unbindMouseListeners() {
    if (this.mouseMoveListener) {
      this.mouseMoveListener();
      this.mouseMoveListener = null;
    }
    if (this.mouseUpListener) {
      this.mouseUpListener();
      this.mouseUpListener = null;
    }
  }
  unbindTouchListeners() {
    if (this.touchMoveListener) {
      this.touchMoveListener();
      this.touchMoveListener = null;
    }
    if (this.touchEndListener) {
      this.touchEndListener();
      this.touchEndListener = null;
    }
  }
  clear() {
    this.dragging = false;
    this.size = null;
    this.startPos = null;
    this.prevPanelElement = null;
    this.nextPanelElement = null;
    this.prevPanelSize = null;
    this.nextPanelSize = null;
    this.gutterElement = null;
    this.prevPanelIndex = null;
  }
  isNested() {
    if (this.el.nativeElement) {
      let parent = this.el.nativeElement.parentElement;
      while (parent && !hasClass(parent, "p-splitter")) {
        parent = parent.parentElement;
      }
      return parent !== null;
    } else {
      return false;
    }
  }
  isStateful() {
    return this.stateKey != null;
  }
  getStorage() {
    if (isPlatformBrowser(this.platformId)) {
      switch (this.stateStorage) {
        case "local":
          return this.document.defaultView.localStorage;
        case "session":
          return this.document.defaultView.sessionStorage;
        default:
          throw new Error(this.stateStorage + ' is not a valid value for the state storage, supported values are "local" and "session".');
      }
    } else {
      throw new Error("Storage is not a available by default on the server.");
    }
  }
  saveState() {
    this.getStorage().setItem(this.stateKey, JSON.stringify(this._panelSizes));
  }
  restoreState() {
    const storage = this.getStorage();
    const stateString = storage.getItem(this.stateKey);
    if (stateString) {
      this._panelSizes = JSON.parse(stateString);
      let children = [...this.containerViewChild.nativeElement.children].filter((child) => hasClass(child, "p-splitterpanel"));
      children.forEach((child, i) => {
        child.style.flexBasis = "calc(" + this._panelSizes[i] + "% - " + (this.panels.length - 1) * this.gutterSize + "px)";
      });
      return true;
    }
    return false;
  }
  containerClass() {
    return {
      "p-splitter p-component": true,
      "p-splitter-horizontal": this.layout === "horizontal",
      "p-splitter-vertical": this.layout === "vertical"
    };
  }
  panelContainerClass() {
    return {
      "p-splitterpanel": true,
      "p-splitterpanel-nested": true
    };
  }
  gutterStyle() {
    if (this.horizontal()) return {
      width: this.gutterSize + "px"
    };
    else return {
      height: this.gutterSize + "px"
    };
  }
  horizontal() {
    return this.layout === "horizontal";
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275Splitter_BaseFactory;
    return function Splitter_Factory(__ngFactoryType__) {
      return (\u0275Splitter_BaseFactory || (\u0275Splitter_BaseFactory = \u0275\u0275getInheritedFactory(_Splitter)))(__ngFactoryType__ || _Splitter);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _Splitter,
    selectors: [["p-splitter"]],
    contentQueries: function Splitter_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        \u0275\u0275contentQuery(dirIndex, PrimeTemplate, 4);
        \u0275\u0275contentQuery(dirIndex, _c1, 4);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.templates = _t);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.panelChildren = _t);
      }
    },
    viewQuery: function Splitter_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c2, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.containerViewChild = _t.first);
      }
    },
    hostVars: 2,
    hostBindings: function Splitter_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275classProp("p-splitterpanel-nested", ctx.nested);
      }
    },
    inputs: {
      styleClass: "styleClass",
      panelStyleClass: "panelStyleClass",
      style: "style",
      panelStyle: "panelStyle",
      stateStorage: "stateStorage",
      stateKey: "stateKey",
      layout: "layout",
      gutterSize: [2, "gutterSize", "gutterSize", numberAttribute],
      step: [2, "step", "step", numberAttribute],
      minSizes: "minSizes",
      panelSizes: "panelSizes"
    },
    outputs: {
      onResizeEnd: "onResizeEnd",
      onResizeStart: "onResizeStart"
    },
    features: [\u0275\u0275ProvidersFeature([SplitterStyle]), \u0275\u0275InheritDefinitionFeature],
    decls: 3,
    vars: 12,
    consts: [["container", ""], [3, "ngClass", "ngStyle"], ["ngFor", "", 3, "ngForOf"], ["tabindex", "-1", 3, "ngClass", "ngStyle"], [4, "ngTemplateOutlet"], ["class", "p-splitter-gutter", "role", "separator", "tabindex", "-1", 3, "mousedown", "touchstart", "touchmove", "touchend", 4, "ngIf"], ["role", "separator", "tabindex", "-1", 1, "p-splitter-gutter", 3, "mousedown", "touchstart", "touchmove", "touchend"], ["tabindex", "0", 1, "p-splitter-gutter-handle", 3, "keyup", "keydown", "ngStyle"]],
    template: function Splitter_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 1, 0);
        \u0275\u0275template(2, Splitter_ng_template_2_Template, 3, 8, "ng-template", 2);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275styleMap(\u0275\u0275pureFunction1(10, _c3, ctx.layout === "vertical" ? "column" : ""));
        \u0275\u0275classMap(ctx.styleClass);
        \u0275\u0275property("ngClass", ctx.containerClass())("ngStyle", ctx.style);
        \u0275\u0275attribute("data-pc-name", "splitter")("data-p-gutter-resizing", false)("data-pc-section", "root");
        \u0275\u0275advance(2);
        \u0275\u0275property("ngForOf", ctx.panels);
      }
    },
    dependencies: [CommonModule, NgClass, NgForOf, NgIf, NgTemplateOutlet, NgStyle, SharedModule],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Splitter, [{
    type: Component,
    args: [{
      selector: "p-splitter",
      standalone: true,
      imports: [CommonModule, SharedModule],
      template: `
        <div
            #container
            [ngClass]="containerClass()"
            [class]="styleClass"
            [ngStyle]="style"
            [style]="{ display: 'flex', 'flex-wrap': 'nowrap', 'flex-direction': layout === 'vertical' ? 'column' : '' }"
            [attr.data-pc-name]="'splitter'"
            [attr.data-p-gutter-resizing]="false"
            [attr.data-pc-section]="'root'"
        >
            <ng-template ngFor let-panel [ngForOf]="panels" let-i="index">
                <div [ngClass]="panelContainerClass()" [class]="panelStyleClass" [ngStyle]="panelStyle" tabindex="-1" [attr.data-pc-name]="'splitter'" [attr.data-pc-section]="'root'">
                    <ng-container *ngTemplateOutlet="panel"></ng-container>
                </div>
                <div
                    *ngIf="i !== panels.length - 1"
                    class="p-splitter-gutter"
                    role="separator"
                    tabindex="-1"
                    (mousedown)="onGutterMouseDown($event, i)"
                    (touchstart)="onGutterTouchStart($event, i)"
                    (touchmove)="onGutterTouchMove($event)"
                    (touchend)="onGutterTouchEnd($event)"
                    [attr.data-p-gutter-resizing]="false"
                    [attr.data-pc-section]="'gutter'"
                >
                    <div
                        class="p-splitter-gutter-handle"
                        tabindex="0"
                        [ngStyle]="gutterStyle()"
                        [attr.aria-orientation]="layout"
                        [attr.aria-valuenow]="prevSize"
                        [attr.data-pc-section]="'gutterhandle'"
                        (keyup)="onGutterKeyUp($event)"
                        (keydown)="onGutterKeyDown($event, i)"
                    ></div>
                </div>
            </ng-template>
        </div>
    `,
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        "[class.p-splitterpanel-nested]": "nested"
      },
      providers: [SplitterStyle]
    }]
  }], null, {
    styleClass: [{
      type: Input
    }],
    panelStyleClass: [{
      type: Input
    }],
    style: [{
      type: Input
    }],
    panelStyle: [{
      type: Input
    }],
    stateStorage: [{
      type: Input
    }],
    stateKey: [{
      type: Input
    }],
    layout: [{
      type: Input
    }],
    gutterSize: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    step: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    minSizes: [{
      type: Input
    }],
    panelSizes: [{
      type: Input
    }],
    onResizeEnd: [{
      type: Output
    }],
    onResizeStart: [{
      type: Output
    }],
    containerViewChild: [{
      type: ViewChild,
      args: ["container", {
        static: false
      }]
    }],
    templates: [{
      type: ContentChildren,
      args: [PrimeTemplate]
    }],
    panelChildren: [{
      type: ContentChildren,
      args: ["panel", {
        descendants: false
      }]
    }]
  });
})();
var SplitterModule = class _SplitterModule {
  static \u0275fac = function SplitterModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SplitterModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _SplitterModule
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [Splitter, SplitterPanel, SharedModule, SharedModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SplitterModule, [{
    type: NgModule,
    args: [{
      imports: [Splitter, SplitterPanel, SharedModule],
      exports: [Splitter, SplitterPanel, SharedModule]
    }]
  }], null, null);
})();

// src/app/pages/uikit/panelsdemo.ts
var _c02 = () => ({ height: "300px" });
var _c12 = () => [20, 80];
var _c22 = () => [10, 0];
var _c32 = () => [50, 50];
function PanelsDemo_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-button", 32)(1, "p-button", 33)(2, "p-button", 34);
  }
}
function PanelsDemo_ng_template_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-iconfield")(1, "p-inputicon");
    \u0275\u0275element(2, "i", 35);
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "input", 36);
    \u0275\u0275elementEnd();
  }
}
function PanelsDemo_ng_template_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-splitbutton", 37);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r0.items);
  }
}
function PanelsDemo_ng_template_97_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 38);
    \u0275\u0275text(1, "Panel 1");
    \u0275\u0275elementEnd();
  }
}
function PanelsDemo_ng_template_99_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 40);
    \u0275\u0275text(1, "Panel 2");
    \u0275\u0275elementEnd();
  }
}
function PanelsDemo_ng_template_99_ng_template_3_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 38);
    \u0275\u0275text(1, "Panel 3");
    \u0275\u0275elementEnd();
  }
}
function PanelsDemo_ng_template_99_ng_template_3_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 38);
    \u0275\u0275text(1, "Panel 4");
    \u0275\u0275elementEnd();
  }
}
function PanelsDemo_ng_template_99_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-splitter", 41);
    \u0275\u0275template(1, PanelsDemo_ng_template_99_ng_template_3_ng_template_1_Template, 2, 0, "ng-template", null, 3, \u0275\u0275templateRefExtractor)(3, PanelsDemo_ng_template_99_ng_template_3_ng_template_3_Template, 2, 0, "ng-template", null, 3, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("panelSizes", \u0275\u0275pureFunction0(1, _c12));
  }
}
function PanelsDemo_ng_template_99_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-splitter", 39);
    \u0275\u0275template(1, PanelsDemo_ng_template_99_ng_template_1_Template, 2, 0, "ng-template", null, 3, \u0275\u0275templateRefExtractor)(3, PanelsDemo_ng_template_99_ng_template_3_Template, 5, 2, "ng-template", null, 3, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("panelSizes", \u0275\u0275pureFunction0(1, _c32));
  }
}
var PanelsDemo = class _PanelsDemo {
  items = [
    {
      label: "Save",
      icon: "pi pi-check"
    },
    {
      label: "Update",
      icon: "pi pi-upload"
    },
    {
      label: "Delete",
      icon: "pi pi-trash"
    },
    {
      label: "Home Page",
      icon: "pi pi-home"
    }
  ];
  static \u0275fac = function PanelsDemo_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PanelsDemo)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PanelsDemo, selectors: [["app-panels-demo"]], decls: 101, vars: 9, consts: [["start", ""], ["center", ""], ["end", ""], ["panel", ""], [1, "flex", "flex-col"], [1, "card"], [1, "font-semibold", "text-xl", "mb-4"], [1, "flex", "flex-col", "md:flex-row", "gap-8"], [1, "md:w-1/2"], ["value", "0"], [1, "m-0"], ["value", "1"], ["value", "2"], [1, "md:w-1/2", "mt-6", "md:mt-0"], ["header", "Header", 3, "toggleable"], ["legend", "Legend", 3, "toggleable"], [1, "card", "mt-8"], [1, "flex", "flex-col", "md:flex-row"], [1, "w-full", "md:w-5/12", "flex", "flex-col", "items-center", "justify-center", "gap-4", "py-8"], [1, "flex", "flex-col", "gap-2"], ["for", "username"], ["pInputText", "", "id", "username", "type", "text"], ["for", "password"], ["pInputText", "", "id", "password", "type", "password"], [1, "flex"], ["label", "Login", "icon", "pi pi-user", 1, "w-full", "max-w-[17.35rem]", "mx-auto"], [1, "w-full", "md:w-2/12"], ["layout", "vertical", 1, "!hidden", "md:!flex"], ["layout", "horizontal", "align", "center", 1, "!flex", "md:!hidden"], [1, "w-full", "md:w-5/12", "flex", "items-center", "justify-center", "py-8"], ["label", "Sign Up", "icon", "pi pi-user-plus", "severity", "success", "styleClass", "w-full max-w-[17.35rem] mx-auto", 1, "w-full"], ["styleClass", "mb-20", 3, "panelSizes", "minSizes"], ["icon", "pi pi-plus", "severity", "secondary", "text", "", 1, "mr-2"], ["icon", "pi pi-print", "severity", "secondary", "text", "", 1, "mr-2"], ["icon", "pi pi-upload", "severity", "secondary", "text", ""], [1, "pi", "pi-search"], ["pInputText", "", "placeholder", "Search"], ["label", "Save", 3, "model"], [1, "col", "flex", "items-center", "justify-center"], ["layout", "vertical", 3, "panelSizes"], [1, "flex", "items-center", "justify-center", 2, "flex-grow", "1"], [3, "panelSizes"]], template: function PanelsDemo_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 4)(1, "div", 5)(2, "div", 6);
      \u0275\u0275text(3, "Toolbar");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p-toolbar");
      \u0275\u0275template(5, PanelsDemo_ng_template_5_Template, 3, 0, "ng-template", null, 0, \u0275\u0275templateRefExtractor)(7, PanelsDemo_ng_template_7_Template, 4, 0, "ng-template", null, 1, \u0275\u0275templateRefExtractor)(9, PanelsDemo_ng_template_9_Template, 1, 1, "ng-template", null, 2, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(11, "div", 7)(12, "div", 8)(13, "div", 5)(14, "div", 6);
      \u0275\u0275text(15, "Accordion");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "p-accordion", 9)(17, "p-accordion-panel", 9)(18, "p-accordion-header");
      \u0275\u0275text(19, "Header I");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "p-accordion-content")(21, "p", 10);
      \u0275\u0275text(22, " Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(23, "p-accordion-panel", 11)(24, "p-accordion-header");
      \u0275\u0275text(25, "Header II");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "p-accordion-content")(27, "p", 10);
      \u0275\u0275text(28, " Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi. ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(29, "p-accordion-panel", 12)(30, "p-accordion-header");
      \u0275\u0275text(31, "Header III");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "p-accordion-content")(33, "p", 10);
      \u0275\u0275text(34, " Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi. ");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(35, "div", 5)(36, "div", 6);
      \u0275\u0275text(37, "Tabs");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(38, "p-tabs", 9)(39, "p-tablist")(40, "p-tab", 9);
      \u0275\u0275text(41, "Header I");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(42, "p-tab", 11);
      \u0275\u0275text(43, "Header II");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(44, "p-tab", 12);
      \u0275\u0275text(45, "Header III");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(46, "p-tabpanels")(47, "p-tabpanel", 9)(48, "p", 10);
      \u0275\u0275text(49, " Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(50, "p-tabpanel", 11)(51, "p", 10);
      \u0275\u0275text(52, " Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi. ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(53, "p-tabpanel", 12)(54, "p", 10);
      \u0275\u0275text(55, " At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus. ");
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275elementStart(56, "div", 13)(57, "div", 5)(58, "div", 6);
      \u0275\u0275text(59, "Panel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(60, "p-panel", 14)(61, "p", 10);
      \u0275\u0275text(62, " Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(63, "div", 5)(64, "div", 6);
      \u0275\u0275text(65, "Fieldset");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(66, "p-fieldset", 15)(67, "p", 10);
      \u0275\u0275text(68, " Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(69, "div", 16)(70, "div", 6);
      \u0275\u0275text(71, "Divider");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(72, "div", 17)(73, "div", 18)(74, "div", 19)(75, "label", 20);
      \u0275\u0275text(76, "Username");
      \u0275\u0275elementEnd();
      \u0275\u0275element(77, "input", 21);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(78, "div", 19)(79, "label", 22);
      \u0275\u0275text(80, "Password");
      \u0275\u0275elementEnd();
      \u0275\u0275element(81, "input", 23);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(82, "div", 24);
      \u0275\u0275element(83, "p-button", 25);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(84, "div", 26)(85, "p-divider", 27)(86, "b");
      \u0275\u0275text(87, "OR");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(88, "p-divider", 28)(89, "b");
      \u0275\u0275text(90, "OR");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(91, "div", 29);
      \u0275\u0275element(92, "p-button", 30);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(93, "div", 5)(94, "div", 6);
      \u0275\u0275text(95, "Splitter");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(96, "p-splitter", 31);
      \u0275\u0275template(97, PanelsDemo_ng_template_97_Template, 2, 0, "ng-template", null, 3, \u0275\u0275templateRefExtractor)(99, PanelsDemo_ng_template_99_Template, 5, 2, "ng-template", null, 3, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(60);
      \u0275\u0275property("toggleable", true);
      \u0275\u0275advance(6);
      \u0275\u0275property("toggleable", true);
      \u0275\u0275advance(30);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(6, _c02));
      \u0275\u0275property("panelSizes", \u0275\u0275pureFunction0(7, _c12))("minSizes", \u0275\u0275pureFunction0(8, _c22));
    }
  }, dependencies: [
    CommonModule,
    FormsModule,
    ToolbarModule,
    Toolbar,
    ButtonModule,
    Button,
    RippleModule,
    SplitButtonModule,
    SplitButton,
    AccordionModule,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    FieldsetModule,
    Fieldset,
    MenuModule,
    InputTextModule,
    InputText,
    DividerModule,
    Divider,
    SplitterModule,
    Splitter,
    PanelModule,
    Panel,
    TabsModule,
    Tabs,
    TabPanels,
    TabPanel,
    TabList,
    Tab,
    IconFieldModule,
    IconField,
    InputIconModule,
    InputIcon
  ], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PanelsDemo, { className: "PanelsDemo", filePath: "src/app/pages/uikit/panelsdemo.ts", lineNumber: 216 });
})();
export {
  PanelsDemo
};
//# sourceMappingURL=chunk-IZGEMAYZ.js.map
