import {
  MemberService
} from "./chunk-JCYGNDGJ.js";
import {
  AutoComplete,
  AutoCompleteModule
} from "./chunk-PMCRGRAO.js";
import {
  AvatarGroup,
  AvatarGroupModule
} from "./chunk-NE67ECLX.js";
import {
  CdkDrag,
  CdkDragHandle,
  CdkDropList,
  DragDropModule,
  moveItemInArray,
  transferArrayItem
} from "./chunk-DYTPHZSQ.js";
import {
  TieredMenu,
  TieredMenuModule
} from "./chunk-GEHWKAXI.js";
import {
  PopoverModule
} from "./chunk-Q5J6E52W.js";
import {
  Textarea,
  TextareaModule
} from "./chunk-RW4OSSQT.js";
import {
  Drawer,
  DrawerModule
} from "./chunk-EOOGB7IQ.js";
import {
  Menu,
  MenuModule
} from "./chunk-RKCUEC6H.js";
import {
  StyleClass,
  StyleClassModule
} from "./chunk-CFS3J3Q2.js";
import {
  Avatar,
  AvatarModule
} from "./chunk-MCGUCMXD.js";
import {
  ProgressBar,
  ProgressBarModule
} from "./chunk-WQ2EPPBK.js";
import "./chunk-SN3HAAMO.js";
import {
  DatePicker,
  DatePickerModule
} from "./chunk-6K6X5UBT.js";
import {
  Checkbox,
  CheckboxModule
} from "./chunk-4JIPYACT.js";
import "./chunk-6GA37Q7Z.js";
import "./chunk-544F7IXR.js";
import "./chunk-YBM6FZLP.js";
import "./chunk-U4P2VV4G.js";
import "./chunk-CPYA4VSS.js";
import "./chunk-XS7IVZ5T.js";
import "./chunk-DBPX6ILC.js";
import "./chunk-CCBQFN2J.js";
import "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
import "./chunk-KHEKFKWA.js";
import {
  InputText,
  InputTextModule
} from "./chunk-FZELBHWZ.js";
import {
  Tooltip,
  TooltipModule
} from "./chunk-4IUQ6KTI.js";
import {
  TimesIcon
} from "./chunk-IVSL2HKS.js";
import {
  zindexutils
} from "./chunk-E352KRZV.js";
import "./chunk-HHD4PK4J.js";
import {
  ButtonDirective,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import {
  ConnectedOverlayScrollHandler,
  Ripple,
  RippleModule
} from "./chunk-AP3OAIHW.js";
import {
  $dt,
  BaseComponent,
  BaseStyle,
  OverlayService,
  PrimeTemplate,
  SharedModule,
  absolutePosition,
  addClass,
  appendChild,
  findSingle,
  getOffset,
  isIOS,
  isTouchDevice
} from "./chunk-NQNBRQ7H.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  RequiredValidator,
  ɵNgNoValidate
} from "./chunk-3HTR5OU7.js";
import {
  HttpClient
} from "./chunk-BMYIFZHZ.js";
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
  SlicePipe,
  isPlatformBrowser
} from "./chunk-SQQPVFHK.js";
import {
  BehaviorSubject,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  HostListener,
  Injectable,
  Input,
  NgModule,
  NgZone,
  Output,
  Subject,
  Subscription,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  numberAttribute,
  setClassMetadata,
  ɵsetClassDebugInfo,
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
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵinject,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind3,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpropertyInterpolate1,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵpureFunction2,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵresetView,
  ɵɵresolveDocument,
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
  ɵɵtwoWayProperty,
  ɵɵviewQuery
} from "./chunk-ZKKMBKIA.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/apps/kanban/service/kanban.service.ts
var KanbanService = class _KanbanService {
  http;
  _lists = [];
  selectedCard = new Subject();
  selectedListId = new Subject();
  lists = new BehaviorSubject(this._lists);
  listNames = new Subject();
  lists$ = this.lists.asObservable();
  selectedCard$ = this.selectedCard.asObservable();
  selectedListId$ = this.selectedListId.asObservable();
  listNames$ = this.listNames.asObservable();
  constructor(http) {
    this.http = http;
    this.http.get("/demo/data/kanban.json").toPromise().then((res) => res.data).then((data) => {
      this.updateLists(data);
    });
  }
  updateLists(data) {
    this._lists = data;
    let small = data.map((l) => ({ listId: l.listId, title: l.title }));
    this.listNames.next(small);
    this.lists.next(data);
  }
  addList() {
    const listId = this.generateId();
    const title = "Untitled List";
    const newList = {
      listId,
      title,
      cards: []
    };
    this._lists.push(newList);
    this.lists.next(this._lists);
  }
  addCard(listId) {
    const cardId = this.generateId();
    const title = "Untitled card";
    const newCard = { id: cardId, title, description: "", progress: "", assignees: [], attachments: 0, comments: [], startDate: "", dueDate: "", completed: false, taskList: { title: "Untitled Task List", tasks: [] } };
    let lists = [];
    lists = this._lists.map((l) => l.listId === listId ? __spreadProps(__spreadValues({}, l), { cards: [...l.cards || [], newCard] }) : l);
    this.updateLists(lists);
  }
  updateCard(card, listId) {
    let lists = this._lists.map((l) => l.listId === listId ? __spreadProps(__spreadValues({}, l), { cards: l.cards.map((c) => c?.id === card.id ? __spreadValues({}, card) : c) }) : l);
    this.updateLists(lists);
  }
  deleteList(id) {
    this._lists = this._lists.filter((l) => l.listId !== id);
    this.lists.next(this._lists);
  }
  copyList(list) {
    let newId = this.generateId();
    let newList = __spreadProps(__spreadValues({}, list), { listId: newId });
    this._lists.push(newList);
    this.lists.next(this._lists);
  }
  deleteCard(cardId, listId) {
    let lists = [];
    for (let i = 0; i < this._lists.length; i++) {
      let list = this._lists[i];
      if (list.listId === listId && list.cards) {
        list.cards = list.cards.filter((c) => c.id !== cardId);
      }
      lists.push(list);
    }
    this.updateLists(lists);
  }
  copyCard(card, listId) {
    let lists = [];
    for (let i = 0; i < this._lists.length; i++) {
      let list = this._lists[i];
      if (list.listId === listId && list.cards) {
        let cardIndex = list.cards.indexOf(card);
        let newId = this.generateId();
        let newCard = __spreadProps(__spreadValues({}, card), { id: newId });
        list.cards.splice(cardIndex, 0, newCard);
      }
      lists.push(list);
    }
    this.updateLists(lists);
  }
  moveCard(card, targetListId, sourceListId) {
    if (card.id) {
      this.deleteCard(card.id, sourceListId);
      let lists = this._lists.map((l) => l.listId === targetListId ? __spreadProps(__spreadValues({}, l), { cards: [...l.cards || [], card] }) : l);
      this.updateLists(lists);
    }
  }
  onCardSelect(card, listId) {
    this.selectedCard.next(card);
    this.selectedListId.next(listId);
  }
  generateId() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
  isMobileDevice() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || /(android)/i.test(navigator.userAgent);
  }
  static \u0275fac = function KanbanService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _KanbanService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _KanbanService, factory: _KanbanService.\u0275fac });
};

// node_modules/primeng/fesm2022/primeng-inplace.mjs
var _c0 = ["*"];
var _c1 = ["display"];
var _c2 = ["content"];
var _c3 = ["closeicon"];
var _c4 = [[["", "pInplaceDisplay", ""]], [["", "pInplaceContent", ""]]];
var _c5 = ["[pInplaceDisplay]", "[pInplaceContent]"];
var _c6 = (a0) => ({
  "p-inplace p-component": true,
  "p-inplace-closable": a0
});
var _c7 = (a0) => ({
  "p-disabled": a0
});
var _c8 = (a0) => ({
  closeCallback: a0
});
function Inplace_div_1_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function Inplace_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 3);
    \u0275\u0275listener("click", function Inplace_div_1_Template_div_click_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onActivateClick($event));
    })("keydown", function Inplace_div_1_Template_div_keydown_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onKeydown($event));
    });
    \u0275\u0275projection(1);
    \u0275\u0275template(2, Inplace_div_1_ng_container_2_Template, 1, 0, "ng-container", 4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(2, _c7, ctx_r1.disabled));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngTemplateOutlet", ctx_r1.displayTemplate || ctx_r1._displayTemplate);
  }
}
function Inplace_div_2_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function Inplace_div_2_ng_container_3_button_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 10);
    \u0275\u0275listener("click", function Inplace_div_2_ng_container_3_button_1_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onDeactivateClick($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("icon", ctx_r1.closeIcon);
    \u0275\u0275attribute("aria-label", ctx_r1.closeAriaLabel);
  }
}
function Inplace_div_2_ng_container_3_button_2_TimesIcon_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "TimesIcon");
  }
}
function Inplace_div_2_ng_container_3_button_2_2_ng_template_0_Template(rf, ctx) {
}
function Inplace_div_2_ng_container_3_button_2_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, Inplace_div_2_ng_container_3_button_2_2_ng_template_0_Template, 0, 0, "ng-template");
  }
}
function Inplace_div_2_ng_container_3_button_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 11);
    \u0275\u0275listener("click", function Inplace_div_2_ng_container_3_button_2_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onDeactivateClick($event));
    });
    \u0275\u0275template(1, Inplace_div_2_ng_container_3_button_2_TimesIcon_1_Template, 1, 0, "TimesIcon", 7)(2, Inplace_div_2_ng_container_3_button_2_2_Template, 1, 0, null, 4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("ngClass", "p-button-icon-only");
    \u0275\u0275attribute("aria-label", ctx_r1.closeAriaLabel);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.closeIconTemplate && !ctx_r1._closeIconTemplate);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", ctx_r1.closeIconTemplate || ctx_r1._closeIconTemplate);
  }
}
function Inplace_div_2_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, Inplace_div_2_ng_container_3_button_1_Template, 1, 2, "button", 8)(2, Inplace_div_2_ng_container_3_button_2_Template, 3, 4, "button", 9);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.closeIcon);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.closeIcon);
  }
}
function Inplace_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275projection(1, 1);
    \u0275\u0275template(2, Inplace_div_2_ng_container_2_Template, 1, 0, "ng-container", 6)(3, Inplace_div_2_ng_container_3_Template, 3, 2, "ng-container", 7);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("ngTemplateOutlet", ctx_r1.contentTemplate || ctx_r1._contentTemplate)("ngTemplateOutletContext", \u0275\u0275pureFunction1(3, _c8, ctx_r1.onDeactivateClick.bind(ctx_r1)));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.closable);
  }
}
var theme = ({
  dt
}) => `
.p-inplace-display {
    display: inline-block;
    cursor: pointer;
    border: 1px solid transparent;
    padding: ${dt("inplace.padding")};
    border-radius: ${dt("inplace.border.radius")};
    transition: background ${dt("inplace.transition.duration")}, color ${dt("inplace.transition.duration")}, outline-color ${dt("inplace.transition.duration")}, box-shadow ${dt("inplace.transition.duration")};
    outline-color: transparent;
}

.p-inplace-display:not(.p-disabled):hover {
    background: ${dt("inplace.display.hover.background")};
    color: ${dt("inplace.display.hover.color")};
}

.p-inplace-display:focus-visible {
    box-shadow: ${dt("inplace.focus.ring.shadow")};
    outline: ${dt("inplace.focus.ring.width")} ${dt("inplace.focus.ring.style")} ${dt("inplace.focus.ring.color")};
    outline-offset: ${dt("inplace.focus.ring.offset")};
}

.p-inplace-content {
    display: block;
}
`;
var classes = {
  root: "p-inplace p-component",
  display: ({
    props
  }) => ["p-inplace-display", {
    "p-disabled": props.disabled
  }],
  content: "p-inplace-content"
};
var InplaceStyle = class _InplaceStyle extends BaseStyle {
  name = "inplace";
  theme = theme;
  classes = classes;
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275InplaceStyle_BaseFactory;
    return function InplaceStyle_Factory(__ngFactoryType__) {
      return (\u0275InplaceStyle_BaseFactory || (\u0275InplaceStyle_BaseFactory = \u0275\u0275getInheritedFactory(_InplaceStyle)))(__ngFactoryType__ || _InplaceStyle);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _InplaceStyle,
    factory: _InplaceStyle.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InplaceStyle, [{
    type: Injectable
  }], null, null);
})();
var InplaceClasses;
(function(InplaceClasses2) {
  InplaceClasses2["root"] = "p-inplace";
  InplaceClasses2["display"] = "p-inplace-display";
  InplaceClasses2["content"] = "p-inplace-content";
})(InplaceClasses || (InplaceClasses = {}));
var InplaceDisplay = class _InplaceDisplay {
  static \u0275fac = function InplaceDisplay_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _InplaceDisplay)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _InplaceDisplay,
    selectors: [["p-inplacedisplay"], ["p-inplaceDisplay"]],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function InplaceDisplay_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef();
        \u0275\u0275projection(0);
      }
    },
    dependencies: [CommonModule],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InplaceDisplay, [{
    type: Component,
    args: [{
      selector: "p-inplacedisplay, p-inplaceDisplay",
      standalone: true,
      imports: [CommonModule],
      template: "<ng-content></ng-content>"
    }]
  }], null, null);
})();
var InplaceContent = class _InplaceContent {
  static \u0275fac = function InplaceContent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _InplaceContent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _InplaceContent,
    selectors: [["p-inplacecontent"], ["p-inplaceContent"]],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function InplaceContent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef();
        \u0275\u0275projection(0);
      }
    },
    dependencies: [CommonModule],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InplaceContent, [{
    type: Component,
    args: [{
      selector: "p-inplacecontent, p-inplaceContent",
      standalone: true,
      imports: [CommonModule],
      template: "<ng-content></ng-content>"
    }]
  }], null, null);
})();
var Inplace = class _Inplace extends BaseComponent {
  /**
   * Whether the content is displayed or not.
   * @group Props
   */
  active = false;
  /**
   * Displays a button to switch back to display mode.
   * @group Props
   */
  closable = false;
  /**
   * When present, it specifies that the element should be disabled.
   * @group Props
   */
  disabled = false;
  /**
   * Allows to prevent clicking.
   * @group Props
   */
  preventClick;
  /**
   * Inline style of the element.
   * @group Props
   */
  style;
  /**
   * Class of the element.
   * @group Props
   */
  styleClass;
  /**
   * Icon to display in the close button.
   * @group Props
   */
  closeIcon;
  /**
   * Establishes a string value that labels the close button.
   * @group Props
   */
  closeAriaLabel;
  /**
   * Callback to invoke when inplace is opened.
   * @param {Event} event - Browser event.
   * @group Emits
   */
  onActivate = new EventEmitter();
  /**
   * Callback to invoke when inplace is closed.
   * @param {Event} event - Browser event.
   * @group Emits
   */
  onDeactivate = new EventEmitter();
  hover;
  /**
   * Display template of the element.
   * @group Templates
   */
  displayTemplate;
  /**
   * Content template of the element.
   * @group Templates
   */
  contentTemplate;
  /**
   * Close icon template of the element.
   * @group Templates
   */
  closeIconTemplate;
  _componentStyle = inject(InplaceStyle);
  onActivateClick(event) {
    if (!this.preventClick) this.activate(event);
  }
  onDeactivateClick(event) {
    if (!this.preventClick) this.deactivate(event);
  }
  /**
   * Activates the content.
   * @param {Event} event - Browser event.
   * @group Method
   */
  activate(event) {
    if (!this.disabled) {
      this.active = true;
      this.onActivate.emit(event);
      this.cd.markForCheck();
    }
  }
  /**
   * Deactivates the content.
   * @param {Event} event - Browser event.
   * @group Method
   */
  deactivate(event) {
    if (!this.disabled) {
      this.active = false;
      this.hover = false;
      this.onDeactivate.emit(event);
      this.cd.markForCheck();
    }
  }
  onKeydown(event) {
    if (event.code === "Enter") {
      this.activate(event);
      event.preventDefault();
    }
  }
  templates;
  _displayTemplate;
  _closeIconTemplate;
  _contentTemplate;
  ngAfterContentInit() {
    this.templates?.forEach((item) => {
      switch (item.getType()) {
        case "display":
          this._displayTemplate = item.template;
          break;
        case "closeicon":
          this._closeIconTemplate = item.template;
          break;
        case "content":
          this._contentTemplate = item.template;
          break;
      }
    });
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275Inplace_BaseFactory;
    return function Inplace_Factory(__ngFactoryType__) {
      return (\u0275Inplace_BaseFactory || (\u0275Inplace_BaseFactory = \u0275\u0275getInheritedFactory(_Inplace)))(__ngFactoryType__ || _Inplace);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _Inplace,
    selectors: [["p-inplace"]],
    contentQueries: function Inplace_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        \u0275\u0275contentQuery(dirIndex, _c1, 4);
        \u0275\u0275contentQuery(dirIndex, _c2, 4);
        \u0275\u0275contentQuery(dirIndex, _c3, 4);
        \u0275\u0275contentQuery(dirIndex, PrimeTemplate, 4);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.displayTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.contentTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.closeIconTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.templates = _t);
      }
    },
    inputs: {
      active: [2, "active", "active", booleanAttribute],
      closable: [2, "closable", "closable", booleanAttribute],
      disabled: [2, "disabled", "disabled", booleanAttribute],
      preventClick: [2, "preventClick", "preventClick", booleanAttribute],
      style: "style",
      styleClass: "styleClass",
      closeIcon: "closeIcon",
      closeAriaLabel: "closeAriaLabel"
    },
    outputs: {
      onActivate: "onActivate",
      onDeactivate: "onDeactivate"
    },
    features: [\u0275\u0275ProvidersFeature([InplaceStyle]), \u0275\u0275InheritDefinitionFeature],
    ngContentSelectors: _c5,
    decls: 3,
    vars: 9,
    consts: [[3, "ngClass", "ngStyle"], ["class", "p-inplace-display", "tabindex", "0", "role", "button", 3, "ngClass", "click", "keydown", 4, "ngIf"], ["class", "p-inplace-content", 4, "ngIf"], ["tabindex", "0", "role", "button", 1, "p-inplace-display", 3, "click", "keydown", "ngClass"], [4, "ngTemplateOutlet"], [1, "p-inplace-content"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], [4, "ngIf"], ["type", "button", "pButton", "", "pRipple", "", 3, "icon", "click", 4, "ngIf"], ["type", "button", "pButton", "", "pRipple", "", 3, "ngClass", "click", 4, "ngIf"], ["type", "button", "pButton", "", "pRipple", "", 3, "click", "icon"], ["type", "button", "pButton", "", "pRipple", "", 3, "click", "ngClass"]],
    template: function Inplace_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef(_c4);
        \u0275\u0275elementStart(0, "div", 0);
        \u0275\u0275template(1, Inplace_div_1_Template, 3, 4, "div", 1)(2, Inplace_div_2_Template, 4, 5, "div", 2);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275classMap(ctx.styleClass);
        \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(7, _c6, ctx.closable))("ngStyle", ctx.style);
        \u0275\u0275attribute("aria-live", "polite");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.active);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.active);
      }
    },
    dependencies: [CommonModule, NgClass, NgIf, NgTemplateOutlet, NgStyle, ButtonModule, ButtonDirective, TimesIcon, SharedModule, Ripple],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Inplace, [{
    type: Component,
    args: [{
      selector: "p-inplace",
      standalone: true,
      imports: [CommonModule, ButtonModule, TimesIcon, SharedModule, Ripple],
      template: `
        <div [ngClass]="{ 'p-inplace p-component': true, 'p-inplace-closable': closable }" [ngStyle]="style" [class]="styleClass" [attr.aria-live]="'polite'">
            <div class="p-inplace-display" (click)="onActivateClick($event)" tabindex="0" role="button" (keydown)="onKeydown($event)" [ngClass]="{ 'p-disabled': disabled }" *ngIf="!active">
                <ng-content select="[pInplaceDisplay]"></ng-content>
                <ng-container *ngTemplateOutlet="displayTemplate || _displayTemplate"></ng-container>
            </div>
            <div class="p-inplace-content" *ngIf="active">
                <ng-content select="[pInplaceContent]"></ng-content>
                <ng-container *ngTemplateOutlet="contentTemplate || _contentTemplate; context: { closeCallback: onDeactivateClick.bind(this) }"></ng-container>

                <ng-container *ngIf="closable">
                    <button *ngIf="closeIcon" type="button" [icon]="closeIcon" pButton pRipple (click)="onDeactivateClick($event)" [attr.aria-label]="closeAriaLabel"></button>
                    <button *ngIf="!closeIcon" type="button" pButton pRipple [ngClass]="'p-button-icon-only'" (click)="onDeactivateClick($event)" [attr.aria-label]="closeAriaLabel">
                        <TimesIcon *ngIf="!closeIconTemplate && !_closeIconTemplate" />
                        <ng-template *ngTemplateOutlet="closeIconTemplate || _closeIconTemplate"></ng-template>
                    </button>
                </ng-container>
            </div>
        </div>
    `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [InplaceStyle]
    }]
  }], null, {
    active: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    closable: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    preventClick: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    style: [{
      type: Input
    }],
    styleClass: [{
      type: Input
    }],
    closeIcon: [{
      type: Input
    }],
    closeAriaLabel: [{
      type: Input
    }],
    onActivate: [{
      type: Output
    }],
    onDeactivate: [{
      type: Output
    }],
    displayTemplate: [{
      type: ContentChild,
      args: ["display", {
        descendants: false
      }]
    }],
    contentTemplate: [{
      type: ContentChild,
      args: ["content", {
        descendants: false
      }]
    }],
    closeIconTemplate: [{
      type: ContentChild,
      args: ["closeicon", {
        descendants: false
      }]
    }],
    templates: [{
      type: ContentChildren,
      args: [PrimeTemplate]
    }]
  });
})();
var InplaceModule = class _InplaceModule {
  static \u0275fac = function InplaceModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _InplaceModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _InplaceModule
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [Inplace, InplaceContent, InplaceDisplay, SharedModule, SharedModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InplaceModule, [{
    type: NgModule,
    args: [{
      imports: [Inplace, InplaceContent, InplaceDisplay, SharedModule],
      exports: [Inplace, InplaceContent, InplaceDisplay, SharedModule]
    }]
  }], null, null);
})();

// node_modules/primeng/fesm2022/primeng-overlaypanel.mjs
var _c02 = ["content"];
var _c12 = ["closeicon"];
var _c22 = ["*"];
var _c32 = (a0, a1) => ({
  showTransitionParams: a0,
  hideTransitionParams: a1
});
var _c42 = (a0, a1) => ({
  value: a0,
  params: a1
});
function OverlayPanel_div_0_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function OverlayPanel_div_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275listener("click", function OverlayPanel_div_0_Template_div_click_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onOverlayClick($event));
    })("@animation.start", function OverlayPanel_div_0_Template_div_animation_animation_start_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onAnimationStart($event));
    })("@animation.done", function OverlayPanel_div_0_Template_div_animation_animation_done_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onAnimationEnd($event));
    });
    \u0275\u0275elementStart(1, "div", 2);
    \u0275\u0275listener("click", function OverlayPanel_div_0_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onContentClick($event));
    })("mousedown", function OverlayPanel_div_0_Template_div_mousedown_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onContentClick($event));
    });
    \u0275\u0275projection(2);
    \u0275\u0275template(3, OverlayPanel_div_0_ng_container_3_Template, 1, 0, "ng-container", 3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r1.styleClass);
    \u0275\u0275property("ngClass", "p-popover p-component")("ngStyle", ctx_r1.style)("@animation", \u0275\u0275pureFunction2(12, _c42, ctx_r1.overlayVisible ? "open" : "close", \u0275\u0275pureFunction2(9, _c32, ctx_r1.showTransitionOptions, ctx_r1.hideTransitionOptions)));
    \u0275\u0275attribute("aria-modal", ctx_r1.overlayVisible)("aria-label", ctx_r1.ariaLabel)("aria-labelledBy", ctx_r1.ariaLabelledBy);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngTemplateOutlet", ctx_r1.contentTemplate || ctx_r1._contentTemplate);
  }
}
var theme2 = ({
  dt
}) => `
.p-popover {
    margin-top: ${dt("popover.gutter")};
    background: ${dt("popover.background")};
    color: ${dt("popover.color")};
    border: 1px solid ${dt("popover.border.color")};
    border-radius: ${dt("popover.border.radius")};
    box-shadow: ${dt("popover.shadow")};
    position: absolute
}

.p-popover-content {
    padding: ${dt("popover.content.padding")};
}

.p-popover-flipped {
    margin-top: calc(${dt("popover.gutter")} * -1);
    margin-bottom: ${dt("popover.gutter")};
}

.p-popover-enter-from {
    opacity: 0;
    transform: scaleY(0.8);
}

.p-popover-leave-to {
    opacity: 0;
}

.p-popover-enter-active {
    transition: transform 0.12s cubic-bezier(0, 0, 0.2, 1), opacity 0.12s cubic-bezier(0, 0, 0.2, 1);
}

.p-popover-leave-active {
    transition: opacity 0.1s linear;
}

.p-popover:after,
.p-popover:before {
    bottom: 100%;
    left: calc(${dt("popover.arrow.offset")} + ${dt("popover.arrow.left")});
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
}

.p-popover:after {
    border-width: calc(${dt("popover.gutter")} - 2px);
    margin-left: calc(-1 * (${dt("popover.gutter")} - 2px));
    border-style: solid;
    border-color: transparent;
    border-bottom-color: ${dt("popover.background")};
}

.p-popover:before {
    border-width: ${dt("popover.gutter")};
    margin-left: calc(-1 * ${dt("popover.gutter")});
    border-style: solid;
    border-color: transparent;
    border-bottom-color: ${dt("popover.border.color")};
}

.p-popover-flipped:after,
.p-popover-flipped:before {
    bottom: auto;
    top: 100%;
}

.p-popover.p-popover-flipped:after {
    border-bottom-color: transparent;
    border-top-color: ${dt("popover.background")};
}

.p-popover.p-popover-flipped:before {
    border-bottom-color: transparent;
    border-top-color: ${dt("popover.border.color")};
}

`;
var classes2 = {
  root: "p-popover p-component",
  content: "p-popover-content"
};
var PopoverStyle = class _PopoverStyle extends BaseStyle {
  name = "popover";
  theme = theme2;
  classes = classes2;
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275PopoverStyle_BaseFactory;
    return function PopoverStyle_Factory(__ngFactoryType__) {
      return (\u0275PopoverStyle_BaseFactory || (\u0275PopoverStyle_BaseFactory = \u0275\u0275getInheritedFactory(_PopoverStyle)))(__ngFactoryType__ || _PopoverStyle);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _PopoverStyle,
    factory: _PopoverStyle.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PopoverStyle, [{
    type: Injectable
  }], null, null);
})();
var PopoverClasses;
(function(PopoverClasses2) {
  PopoverClasses2["root"] = "p-popover";
  PopoverClasses2["content"] = "p-popover-content";
})(PopoverClasses || (PopoverClasses = {}));
var OverlayPanel = class _OverlayPanel extends BaseComponent {
  zone;
  overlayService;
  /**
   * Defines a string that labels the input for accessibility.
   * @group Props
   */
  ariaLabel;
  /**
   * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
   * @group Props
   */
  ariaLabelledBy;
  /**
   * Enables to hide the overlay when outside is clicked.
   * @group Props
   */
  dismissable = true;
  /**
   * When enabled, displays a close icon at top right corner.
   * @group Props
   */
  showCloseIcon;
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
   *  Target element to attach the panel, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
   * @group Props
   */
  appendTo = "body";
  /**
   * Whether to automatically manage layering.
   * @group Props
   */
  autoZIndex = true;
  /**
   * Aria label of the close icon.
   * @group Props
   */
  ariaCloseLabel;
  /**
   * Base zIndex value to use in layering.
   * @group Props
   */
  baseZIndex = 0;
  /**
   * When enabled, first button receives focus on show.
   * @group Props
   */
  focusOnShow = true;
  /**
   * Transition options of the show animation.
   * @group Props
   */
  showTransitionOptions = ".12s cubic-bezier(0, 0, 0.2, 1)";
  /**
   * Transition options of the hide animation.
   * @group Props
   */
  hideTransitionOptions = ".1s linear";
  /**
   * Callback to invoke when an overlay becomes visible.
   * @group Emits
   */
  onShow = new EventEmitter();
  /**
   * Callback to invoke when an overlay gets hidden.
   * @group Emits
   */
  onHide = new EventEmitter();
  container;
  overlayVisible = false;
  render = false;
  isOverlayAnimationInProgress = false;
  selfClick = false;
  documentClickListener;
  target;
  willHide;
  scrollHandler;
  documentResizeListener;
  contentTemplate;
  closeIconTemplate;
  templates;
  _contentTemplate;
  destroyCallback;
  overlayEventListener;
  overlaySubscription;
  _componentStyle = inject(PopoverStyle);
  constructor(zone, overlayService) {
    super();
    this.zone = zone;
    this.overlayService = overlayService;
    console.log("OverlayPanel is deprecated. Use Popover instead.");
  }
  ngAfterContentInit() {
    this.templates?.forEach((item) => {
      switch (item.getType()) {
        case "content":
          this._contentTemplate = item.template;
          break;
        default:
          this._contentTemplate = item.template;
          break;
      }
      this.cd.markForCheck();
    });
  }
  bindDocumentClickListener() {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.documentClickListener) {
        let documentEvent = isIOS() ? "touchstart" : "click";
        const documentTarget = this.el ? this.el.nativeElement.ownerDocument : this.document;
        this.documentClickListener = this.renderer.listen(documentTarget, documentEvent, (event) => {
          if (!this.dismissable) {
            return;
          }
          if (!this.container?.contains(event.target) && this.target !== event.target && !this.target.contains(event.target) && !this.selfClick) {
            this.hide();
          }
          this.selfClick = false;
          this.cd.markForCheck();
        });
      }
    }
  }
  unbindDocumentClickListener() {
    if (this.documentClickListener) {
      this.documentClickListener();
      this.documentClickListener = null;
      this.selfClick = false;
    }
  }
  /**
   * Toggles the visibility of the panel.
   * @param {Event} event - Browser event
   * @param {Target} target - Target element.
   * @group Method
   */
  toggle(event, target) {
    if (this.isOverlayAnimationInProgress) {
      return;
    }
    if (this.overlayVisible) {
      if (this.hasTargetChanged(event, target)) {
        this.destroyCallback = () => {
          this.show(null, target || event.currentTarget || event.target);
        };
      }
      this.hide();
    } else {
      this.show(event, target);
    }
  }
  /**
   * Displays the panel.
   * @param {Event} event - Browser event
   * @param {Target} target - Target element.
   * @group Method
   */
  show(event, target) {
    target && event && event.stopPropagation();
    if (this.isOverlayAnimationInProgress) {
      return;
    }
    this.target = target || event.currentTarget || event.target;
    this.overlayVisible = true;
    this.render = true;
    this.cd.markForCheck();
  }
  onOverlayClick(event) {
    this.overlayService.add({
      originalEvent: event,
      target: this.el.nativeElement
    });
    this.selfClick = true;
  }
  onContentClick(event) {
    const targetElement = event.target;
    this.selfClick = event.offsetX < targetElement.clientWidth && event.offsetY < targetElement.clientHeight;
  }
  hasTargetChanged(event, target) {
    return this.target != null && this.target !== (target || event.currentTarget || event.target);
  }
  appendContainer() {
    if (this.appendTo) {
      if (this.appendTo === "body") this.renderer.appendChild(this.document.body, this.container);
      else appendChild(this.appendTo, this.container);
    }
  }
  restoreAppend() {
    if (this.container && this.appendTo) {
      this.renderer.appendChild(this.el.nativeElement, this.container);
    }
  }
  align() {
    if (this.autoZIndex) {
      zindexutils.set("overlay", this.container, this.baseZIndex + this.config.zIndex.overlay);
    }
    absolutePosition(this.container, this.target, false);
    const containerOffset = getOffset(this.container);
    const targetOffset = getOffset(this.target);
    const borderRadius = this.document.defaultView?.getComputedStyle(this.container).getPropertyValue("border-radius");
    let arrowLeft = 0;
    if (containerOffset.left < targetOffset.left) {
      arrowLeft = targetOffset.left - containerOffset.left - parseFloat(borderRadius) * 2;
    }
    this.container?.style.setProperty($dt("popover.arrow.left").name, `${arrowLeft}px`);
    if (containerOffset.top < targetOffset.top) {
      this.container.setAttribute("data-p-popover-flipped", "true");
      addClass(this.container, "p-popover-flipped");
      if (this.showCloseIcon) {
        this.renderer.setStyle(this.container, "margin-top", "-30px");
      }
    }
  }
  onAnimationStart(event) {
    if (event.toState === "open") {
      this.container = event.element;
      this.appendContainer();
      this.align();
      this.bindDocumentClickListener();
      this.bindDocumentResizeListener();
      this.bindScrollListener();
      if (this.focusOnShow) {
        this.focus();
      }
      this.overlayEventListener = (e) => {
        if (this.container && this.container.contains(e.target)) {
          this.selfClick = true;
        }
      };
      this.overlaySubscription = this.overlayService.clickObservable.subscribe(this.overlayEventListener);
      this.onShow.emit(null);
    }
    this.isOverlayAnimationInProgress = true;
  }
  onAnimationEnd(event) {
    switch (event.toState) {
      case "void":
        if (this.destroyCallback) {
          this.destroyCallback();
          this.destroyCallback = null;
        }
        if (this.overlaySubscription) {
          this.overlaySubscription.unsubscribe();
        }
        break;
      case "close":
        if (this.autoZIndex) {
          zindexutils.clear(this.container);
        }
        if (this.overlaySubscription) {
          this.overlaySubscription.unsubscribe();
        }
        this.onContainerDestroy();
        this.onHide.emit({});
        this.render = false;
        break;
    }
    this.isOverlayAnimationInProgress = false;
  }
  focus() {
    let focusable = findSingle(this.container, "[autofocus]");
    if (focusable) {
      this.zone.runOutsideAngular(() => {
        setTimeout(() => focusable.focus(), 5);
      });
    }
  }
  /**
   * Hides the panel.
   * @group Method
   */
  hide() {
    this.overlayVisible = false;
    this.cd.markForCheck();
  }
  onCloseClick(event) {
    this.hide();
    event.preventDefault();
  }
  onEscapeKeydown(event) {
    this.hide();
  }
  onWindowResize() {
    if (this.overlayVisible && !isTouchDevice()) {
      this.hide();
    }
  }
  bindDocumentResizeListener() {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.documentResizeListener) {
        const window = this.document.defaultView;
        this.documentResizeListener = this.renderer.listen(window, "resize", this.onWindowResize.bind(this));
      }
    }
  }
  unbindDocumentResizeListener() {
    if (this.documentResizeListener) {
      this.documentResizeListener();
      this.documentResizeListener = null;
    }
  }
  bindScrollListener() {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.scrollHandler) {
        this.scrollHandler = new ConnectedOverlayScrollHandler(this.target, () => {
          if (this.overlayVisible) {
            this.hide();
          }
        });
      }
      this.scrollHandler.bindScrollListener();
    }
  }
  unbindScrollListener() {
    if (this.scrollHandler) {
      this.scrollHandler.unbindScrollListener();
    }
  }
  onContainerDestroy() {
    if (!this.cd.destroyed) {
      this.target = null;
    }
    this.unbindDocumentClickListener();
    this.unbindDocumentResizeListener();
    this.unbindScrollListener();
  }
  ngOnDestroy() {
    if (this.scrollHandler) {
      this.scrollHandler.destroy();
      this.scrollHandler = null;
    }
    if (this.container && this.autoZIndex) {
      zindexutils.clear(this.container);
    }
    if (!this.cd.destroyed) {
      this.target = null;
    }
    this.destroyCallback = null;
    if (this.container) {
      this.restoreAppend();
      this.onContainerDestroy();
    }
    if (this.overlaySubscription) {
      this.overlaySubscription.unsubscribe();
    }
    super.ngOnDestroy();
  }
  static \u0275fac = function OverlayPanel_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OverlayPanel)(\u0275\u0275directiveInject(NgZone), \u0275\u0275directiveInject(OverlayService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _OverlayPanel,
    selectors: [["p-overlayPanel"], ["p-overlaypanel"]],
    contentQueries: function OverlayPanel_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        \u0275\u0275contentQuery(dirIndex, _c02, 4);
        \u0275\u0275contentQuery(dirIndex, _c12, 4);
        \u0275\u0275contentQuery(dirIndex, PrimeTemplate, 4);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.contentTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.closeIconTemplate = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.templates = _t);
      }
    },
    hostBindings: function OverlayPanel_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("keydown.escape", function OverlayPanel_keydown_escape_HostBindingHandler($event) {
          return ctx.onEscapeKeydown($event);
        }, false, \u0275\u0275resolveDocument);
      }
    },
    inputs: {
      ariaLabel: "ariaLabel",
      ariaLabelledBy: "ariaLabelledBy",
      dismissable: [2, "dismissable", "dismissable", booleanAttribute],
      showCloseIcon: [2, "showCloseIcon", "showCloseIcon", booleanAttribute],
      style: "style",
      styleClass: "styleClass",
      appendTo: "appendTo",
      autoZIndex: [2, "autoZIndex", "autoZIndex", booleanAttribute],
      ariaCloseLabel: "ariaCloseLabel",
      baseZIndex: [2, "baseZIndex", "baseZIndex", numberAttribute],
      focusOnShow: [2, "focusOnShow", "focusOnShow", booleanAttribute],
      showTransitionOptions: "showTransitionOptions",
      hideTransitionOptions: "hideTransitionOptions"
    },
    outputs: {
      onShow: "onShow",
      onHide: "onHide"
    },
    standalone: false,
    features: [\u0275\u0275ProvidersFeature([PopoverStyle]), \u0275\u0275InheritDefinitionFeature],
    ngContentSelectors: _c22,
    decls: 1,
    vars: 1,
    consts: [["role", "dialog", 3, "ngClass", "ngStyle", "class", "click", 4, "ngIf"], ["role", "dialog", 3, "click", "ngClass", "ngStyle"], [1, "p-popover-content", 3, "click", "mousedown"], [4, "ngTemplateOutlet"]],
    template: function OverlayPanel_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef();
        \u0275\u0275template(0, OverlayPanel_div_0_Template, 4, 15, "div", 0);
      }
      if (rf & 2) {
        \u0275\u0275property("ngIf", ctx.render);
      }
    },
    dependencies: [NgClass, NgIf, NgTemplateOutlet, NgStyle],
    encapsulation: 2,
    data: {
      animation: [trigger("animation", [state("void", style({
        transform: "scaleY(0.8)",
        opacity: 0
      })), state("close", style({
        opacity: 0
      })), state("open", style({
        transform: "translateY(0)",
        opacity: 1
      })), transition("void => open", animate("{{showTransitionParams}}")), transition("open => close", animate("{{hideTransitionParams}}"))])]
    },
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OverlayPanel, [{
    type: Component,
    args: [{
      selector: "p-overlayPanel, p-overlaypanel",
      standalone: false,
      template: `
        <div
            *ngIf="render"
            [ngClass]="'p-popover p-component'"
            [ngStyle]="style"
            [class]="styleClass"
            (click)="onOverlayClick($event)"
            [@animation]="{
                value: overlayVisible ? 'open' : 'close',
                params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions }
            }"
            (@animation.start)="onAnimationStart($event)"
            (@animation.done)="onAnimationEnd($event)"
            role="dialog"
            [attr.aria-modal]="overlayVisible"
            [attr.aria-label]="ariaLabel"
            [attr.aria-labelledBy]="ariaLabelledBy"
        >
            <div class="p-popover-content" (click)="onContentClick($event)" (mousedown)="onContentClick($event)">
                <ng-content></ng-content>
                <ng-container *ngTemplateOutlet="contentTemplate || _contentTemplate"></ng-container>
            </div>
        </div>
    `,
      animations: [trigger("animation", [state("void", style({
        transform: "scaleY(0.8)",
        opacity: 0
      })), state("close", style({
        opacity: 0
      })), state("open", style({
        transform: "translateY(0)",
        opacity: 1
      })), transition("void => open", animate("{{showTransitionParams}}")), transition("open => close", animate("{{hideTransitionParams}}"))])],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [PopoverStyle]
    }]
  }], () => [{
    type: NgZone
  }, {
    type: OverlayService
  }], {
    ariaLabel: [{
      type: Input
    }],
    ariaLabelledBy: [{
      type: Input
    }],
    dismissable: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    showCloseIcon: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    style: [{
      type: Input
    }],
    styleClass: [{
      type: Input
    }],
    appendTo: [{
      type: Input
    }],
    autoZIndex: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    ariaCloseLabel: [{
      type: Input
    }],
    baseZIndex: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    focusOnShow: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    showTransitionOptions: [{
      type: Input
    }],
    hideTransitionOptions: [{
      type: Input
    }],
    onShow: [{
      type: Output
    }],
    onHide: [{
      type: Output
    }],
    contentTemplate: [{
      type: ContentChild,
      args: ["content", {
        descendants: false
      }]
    }],
    closeIconTemplate: [{
      type: ContentChild,
      args: ["closeicon", {
        descendants: false
      }]
    }],
    templates: [{
      type: ContentChildren,
      args: [PrimeTemplate]
    }],
    onEscapeKeydown: [{
      type: HostListener,
      args: ["document:keydown.escape", ["$event"]]
    }]
  });
})();
var OverlayPanelModule = class _OverlayPanelModule {
  static \u0275fac = function OverlayPanelModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OverlayPanelModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _OverlayPanelModule
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [CommonModule, SharedModule, TimesIcon, SharedModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OverlayPanelModule, [{
    type: NgModule,
    args: [{
      imports: [CommonModule, Ripple, SharedModule, TimesIcon],
      exports: [OverlayPanel, SharedModule],
      declarations: [OverlayPanel]
    }]
  }], null, null);
})();

// src/app/apps/kanban/kanbansidebar.ts
var _c03 = ["inputTitle"];
var _c13 = ["inputTaskListTitle"];
var _c23 = () => ({ height: "2.5rem" });
var _c33 = (a0, a1) => ({ "text-600 line-through": a0, "text-900": a1 });
function KanbanSidebar_p_drawer_0_ng_template_2_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 47);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.formValue.title ? ctx_r1.formValue.title : "Untitled");
  }
}
function KanbanSidebar_p_drawer_0_ng_template_2_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 48)(1, "input", 49, 8);
    \u0275\u0275twoWayListener("ngModelChange", function KanbanSidebar_p_drawer_0_ng_template_2_ng_template_6_Template_input_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(3);
      \u0275\u0275twoWayBindingSet(ctx_r1.formValue.title, $event) || (ctx_r1.formValue.title = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("keydown.enter", function KanbanSidebar_p_drawer_0_ng_template_2_ng_template_6_Template_input_keydown_enter_1_listener() {
      \u0275\u0275restoreView(_r4);
      \u0275\u0275nextContext();
      const inplace_r5 = \u0275\u0275reference(3);
      return \u0275\u0275resetView(inplace_r5.deactivate());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 50);
    \u0275\u0275listener("click", function KanbanSidebar_p_drawer_0_ng_template_2_ng_template_6_Template_button_click_3_listener($event) {
      const closeCallback_r6 = \u0275\u0275restoreView(_r4).closeCallback;
      return \u0275\u0275resetView(closeCallback_r6($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.formValue.title);
  }
}
function KanbanSidebar_p_drawer_0_ng_template_2_span_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 22);
    \u0275\u0275listener("click", function KanbanSidebar_p_drawer_0_ng_template_2_span_17_Template_span_click_0_listener() {
      const list_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onMove(list_r8.listId || ""));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const list_r8 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(list_r8.title);
  }
}
function KanbanSidebar_p_drawer_0_ng_template_2_div_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 51)(1, "div", 52)(2, "span", 53);
    \u0275\u0275text(3, "Progress");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 54);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(6, "p-progress-bar", 55);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", ctx_r1.formValue.progress, "%");
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r1.formValue.progress)("showValue", false);
  }
}
function KanbanSidebar_p_drawer_0_ng_template_2_div_38_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 47);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.formValue.taskList.title);
  }
}
function KanbanSidebar_p_drawer_0_ng_template_2_div_38_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 48)(1, "input", 49, 9);
    \u0275\u0275twoWayListener("ngModelChange", function KanbanSidebar_p_drawer_0_ng_template_2_div_38_ng_template_6_Template_input_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext(4);
      \u0275\u0275twoWayBindingSet(ctx_r1.formValue.taskList.title, $event) || (ctx_r1.formValue.taskList.title = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("keydown.enter", function KanbanSidebar_p_drawer_0_ng_template_2_div_38_ng_template_6_Template_input_keydown_enter_1_listener() {
      \u0275\u0275restoreView(_r10);
      \u0275\u0275nextContext();
      const inplace_r11 = \u0275\u0275reference(3);
      return \u0275\u0275resetView(inplace_r11.deactivate());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 50);
    \u0275\u0275listener("click", function KanbanSidebar_p_drawer_0_ng_template_2_div_38_ng_template_6_Template_button_click_3_listener($event) {
      const closeCallback_r12 = \u0275\u0275restoreView(_r10).closeCallback;
      return \u0275\u0275resetView(closeCallback_r12($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.formValue.taskList.title);
  }
}
function KanbanSidebar_p_drawer_0_ng_template_2_div_38_ul_9_li_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li", 61)(1, "p-checkbox", 62);
    \u0275\u0275twoWayListener("ngModelChange", function KanbanSidebar_p_drawer_0_ng_template_2_div_38_ul_9_li_1_Template_p_checkbox_ngModelChange_1_listener($event) {
      const task_r14 = \u0275\u0275restoreView(_r13).$implicit;
      \u0275\u0275twoWayBindingSet(task_r14.completed, $event) || (task_r14.completed = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("onChange", function KanbanSidebar_p_drawer_0_ng_template_2_div_38_ul_9_li_1_Template_p_checkbox_onChange_1_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r1.calculateProgress());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span", 63);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const task_r14 = ctx.$implicit;
    const i_r15 = ctx.index;
    \u0275\u0275advance();
    \u0275\u0275property("name", task_r14.text + i_r15);
    \u0275\u0275twoWayProperty("ngModel", task_r14.completed);
    \u0275\u0275property("binary", true)("inputId", task_r14.text);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(6, _c33, task_r14.completed, !task_r14.completed));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", task_r14.text, " ");
  }
}
function KanbanSidebar_p_drawer_0_ng_template_2_div_38_ul_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 59);
    \u0275\u0275template(1, KanbanSidebar_p_drawer_0_ng_template_2_div_38_ul_9_li_1_Template, 4, 9, "li", 60);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.formValue.taskList == null ? null : ctx_r1.formValue.taskList.tasks);
  }
}
function KanbanSidebar_p_drawer_0_ng_template_2_div_38_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 51)(1, "div", 56)(2, "p-inplace", null, 2);
    \u0275\u0275template(4, KanbanSidebar_p_drawer_0_ng_template_2_div_38_ng_template_4_Template, 2, 1, "ng-template", null, 3, \u0275\u0275templateRefExtractor)(6, KanbanSidebar_p_drawer_0_ng_template_2_div_38_ng_template_6_Template, 4, 1, "ng-template", null, 4, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "textarea", 57);
    \u0275\u0275twoWayListener("ngModelChange", function KanbanSidebar_p_drawer_0_ng_template_2_div_38_Template_textarea_ngModelChange_8_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(3);
      \u0275\u0275twoWayBindingSet(ctx_r1.taskContent, $event) || (ctx_r1.taskContent = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("keydown.enter", function KanbanSidebar_p_drawer_0_ng_template_2_div_38_Template_textarea_keydown_enter_8_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.addTask($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(9, KanbanSidebar_p_drawer_0_ng_template_2_div_38_ul_9_Template, 2, 1, "ul", 58);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(8);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.taskContent);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (ctx_r1.formValue.taskList == null ? null : ctx_r1.formValue.taskList.tasks == null ? null : ctx_r1.formValue.taskList.tasks.length) !== 0);
  }
}
function KanbanSidebar_p_drawer_0_ng_template_2_ng_template_43_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 64)(1, "div", 65);
    \u0275\u0275element(2, "img", 66);
    \u0275\u0275elementStart(3, "span", 67);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const assignee_r16 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275propertyInterpolate1("src", "/images/avatar/", assignee_r16.image, "", \u0275\u0275sanitizeUrl);
    \u0275\u0275property("alt", assignee_r16.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(assignee_r16.name);
  }
}
function KanbanSidebar_p_drawer_0_ng_template_2_ng_template_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 68);
    \u0275\u0275element(1, "img", 66);
    \u0275\u0275elementStart(2, "span", 67);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const assignee_r17 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275propertyInterpolate1("src", "/images/avatar/", assignee_r17.image, "", \u0275\u0275sanitizeUrl);
    \u0275\u0275property("alt", assignee_r17.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(assignee_r17.name);
  }
}
function KanbanSidebar_p_drawer_0_ng_template_2_div_55_span_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 77);
    \u0275\u0275element(1, "img", 78);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const comment_r18 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275propertyInterpolate1("src", "/images/avatar/", comment_r18.image, "", \u0275\u0275sanitizeUrl);
  }
}
function KanbanSidebar_p_drawer_0_ng_template_2_div_55_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 79);
    \u0275\u0275element(1, "i", 40);
    \u0275\u0275elementEnd();
  }
}
function KanbanSidebar_p_drawer_0_ng_template_2_div_55_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 69);
    \u0275\u0275template(1, KanbanSidebar_p_drawer_0_ng_template_2_div_55_span_1_Template, 2, 2, "span", 70)(2, KanbanSidebar_p_drawer_0_ng_template_2_div_55_span_2_Template, 2, 0, "span", 71);
    \u0275\u0275elementStart(3, "div", 72)(4, "div", 73)(5, "span", 74);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 75);
    \u0275\u0275text(8, "1 Jun 17:58 pm");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "span", 76);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const comment_r18 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", comment_r18.image);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !comment_r18.image);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(comment_r18.name);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(comment_r18 == null ? null : comment_r18.text);
  }
}
function KanbanSidebar_p_drawer_0_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 12);
    \u0275\u0275listener("submit", function KanbanSidebar_p_drawer_0_ng_template_2_Template_form_submit_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onSave($event));
    });
    \u0275\u0275elementStart(1, "div", 13)(2, "p-inplace", null, 2);
    \u0275\u0275template(4, KanbanSidebar_p_drawer_0_ng_template_2_ng_template_4_Template, 2, 1, "ng-template", null, 3, \u0275\u0275templateRefExtractor)(6, KanbanSidebar_p_drawer_0_ng_template_2_ng_template_6_Template, 4, 1, "ng-template", null, 4, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 14);
    \u0275\u0275element(9, "button", 15, 5);
    \u0275\u0275elementStart(11, "button", 16);
    \u0275\u0275listener("click", function KanbanSidebar_p_drawer_0_ng_template_2_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.close());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 17)(13, "div", 18)(14, "div", 19)(15, "span", 20);
    \u0275\u0275text(16, "Move to...");
    \u0275\u0275elementEnd();
    \u0275\u0275template(17, KanbanSidebar_p_drawer_0_ng_template_2_span_17_Template, 2, 1, "span", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "div", 19)(19, "span", 20);
    \u0275\u0275text(20, "Tasks");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "span", 22);
    \u0275\u0275listener("click", function KanbanSidebar_p_drawer_0_ng_template_2_Template_span_click_21_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.addTaskList());
    });
    \u0275\u0275text(22, "Create a tasklist");
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275elementStart(23, "div", 23)(24, "div", 24)(25, "label", 25);
    \u0275\u0275text(26, "Description");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "textarea", 26);
    \u0275\u0275twoWayListener("ngModelChange", function KanbanSidebar_p_drawer_0_ng_template_2_Template_textarea_ngModelChange_27_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.formValue.description, $event) || (ctx_r1.formValue.description = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "div", 27)(29, "div", 28)(30, "label", 25);
    \u0275\u0275text(31, "Start Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "p-datepicker", 29);
    \u0275\u0275twoWayListener("ngModelChange", function KanbanSidebar_p_drawer_0_ng_template_2_Template_p_datepicker_ngModelChange_32_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.formValue.startDate, $event) || (ctx_r1.formValue.startDate = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(33, "div", 28)(34, "label", 30);
    \u0275\u0275text(35, "Due Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "p-datepicker", 31);
    \u0275\u0275twoWayListener("ngModelChange", function KanbanSidebar_p_drawer_0_ng_template_2_Template_p_datepicker_ngModelChange_36_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.formValue.dueDate, $event) || (ctx_r1.formValue.dueDate = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(37, KanbanSidebar_p_drawer_0_ng_template_2_div_37_Template, 7, 3, "div", 32)(38, KanbanSidebar_p_drawer_0_ng_template_2_div_38_Template, 10, 2, "div", 32);
    \u0275\u0275elementStart(39, "div", 33)(40, "label", 34);
    \u0275\u0275text(41, "Assignees");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "p-autocomplete", 35);
    \u0275\u0275twoWayListener("ngModelChange", function KanbanSidebar_p_drawer_0_ng_template_2_Template_p_autocomplete_ngModelChange_42_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.formValue.assignees, $event) || (ctx_r1.formValue.assignees = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("completeMethod", function KanbanSidebar_p_drawer_0_ng_template_2_Template_p_autocomplete_completeMethod_42_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.filterAssignees($event));
    });
    \u0275\u0275template(43, KanbanSidebar_p_drawer_0_ng_template_2_ng_template_43_Template, 5, 4, "ng-template", null, 6, \u0275\u0275templateRefExtractor)(45, KanbanSidebar_p_drawer_0_ng_template_2_ng_template_45_Template, 4, 4, "ng-template", null, 7, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(47, "div", 36)(48, "span", 37);
    \u0275\u0275text(49, "Comments");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "div", 38)(51, "span", 39);
    \u0275\u0275element(52, "i", 40);
    \u0275\u0275elementEnd();
    \u0275\u0275element(53, "span");
    \u0275\u0275elementStart(54, "textarea", 41);
    \u0275\u0275twoWayListener("ngModelChange", function KanbanSidebar_p_drawer_0_ng_template_2_Template_textarea_ngModelChange_54_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.comment, $event) || (ctx_r1.comment = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("keydown.enter", function KanbanSidebar_p_drawer_0_ng_template_2_Template_textarea_keydown_enter_54_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onComment($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275template(55, KanbanSidebar_p_drawer_0_ng_template_2_div_55_Template, 11, 4, "div", 42);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(56, "div", 43);
    \u0275\u0275element(57, "button", 44);
    \u0275\u0275elementStart(58, "button", 45);
    \u0275\u0275listener("click", function KanbanSidebar_p_drawer_0_ng_template_2_Template_button_click_58_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onDelete());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(59, "button", 46);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const sidebar_r19 = \u0275\u0275reference(1);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(17);
    \u0275\u0275property("ngForOf", ctx_r1.listNames);
    \u0275\u0275advance(10);
    \u0275\u0275property("rows", 5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.formValue.description);
    \u0275\u0275advance(5);
    \u0275\u0275property("showTime", false)("required", true)("showIcon", true);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.formValue.startDate);
    \u0275\u0275advance(4);
    \u0275\u0275property("showTime", false)("required", true)("showIcon", true);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.formValue.dueDate);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.formValue.taskList.tasks.length || ctx_r1.showTaskContainer);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.formValue.taskList.tasks.length || ctx_r1.showTaskContainer);
    \u0275\u0275advance(4);
    \u0275\u0275property("appendTo", sidebar_r19);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.formValue.assignees);
    \u0275\u0275property("suggestions", ctx_r1.filteredAssignees)("multiple", true)("showEmptyMessage", true)("inputStyle", \u0275\u0275pureFunction0(21, _c23));
    \u0275\u0275advance(12);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.comment);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.formValue.comments);
  }
}
function KanbanSidebar_p_drawer_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-drawer", 11, 0);
    \u0275\u0275twoWayListener("visibleChange", function KanbanSidebar_p_drawer_0_Template_p_drawer_visibleChange_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.parent.sidebarVisible, $event) || (ctx_r1.parent.sidebarVisible = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275template(2, KanbanSidebar_p_drawer_0_ng_template_2_Template, 60, 22, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275twoWayProperty("visible", ctx_r1.parent.sidebarVisible);
    \u0275\u0275property("baseZIndex", 1e4)("showCloseIcon", false);
  }
}
var KanbanSidebar = class _KanbanSidebar {
  parent;
  memberService;
  kanbanService;
  card = { id: "", taskList: { title: "Untitled Task List", tasks: [] } };
  formValue;
  listId = "";
  filteredAssignees = [];
  assignees = [];
  newComment = { id: "123", name: "Jane Cooper", text: "" };
  newTask = { text: "", completed: false };
  comment = "";
  taskContent = "";
  timeout = null;
  showTaskContainer = false;
  listNames = [];
  cardSubscription;
  listSubscription;
  listNameSubscription;
  inputTitle;
  inputTaskListTitle;
  constructor(parent, memberService, kanbanService) {
    this.parent = parent;
    this.memberService = memberService;
    this.kanbanService = kanbanService;
    this.memberService.getMembers().then((members) => this.assignees = members);
    this.cardSubscription = this.kanbanService.selectedCard$.subscribe((data) => {
      this.card = data;
      this.formValue = __spreadValues({}, data);
    });
    this.listSubscription = this.kanbanService.selectedListId$.subscribe((data) => this.listId = data);
    this.listNameSubscription = this.kanbanService.listNames$.subscribe((data) => this.listNames = data);
  }
  ngOnDestroy() {
    this.cardSubscription.unsubscribe();
    this.listSubscription.unsubscribe();
    this.listNameSubscription.unsubscribe();
    clearTimeout(this.timeout);
  }
  close() {
    this.parent.sidebarVisible = false;
    this.resetForm();
  }
  filterAssignees(event) {
    let filtered = [];
    let query = event.query;
    for (let i = 0; i < this.assignees.length; i++) {
      let assignee = this.assignees[i];
      if (assignee.name && assignee.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(assignee);
      }
    }
    this.filteredAssignees = filtered;
  }
  onComment(event) {
    event.preventDefault();
    if (this.comment.trim().length > 0) {
      this.newComment = __spreadProps(__spreadValues({}, this.newComment), { text: this.comment });
      this.formValue?.comments?.unshift(this.newComment);
      this.comment = "";
    }
  }
  onSave(event) {
    event.preventDefault();
    this.card = __spreadValues({}, this.formValue);
    this.kanbanService.updateCard(this.card, this.listId);
    this.close();
  }
  onMove(listId) {
    this.kanbanService.moveCard(this.formValue, listId, this.listId);
  }
  onDelete() {
    this.kanbanService.deleteCard(this.formValue?.id || "", this.listId);
    this.parent.sidebarVisible = false;
    this.resetForm();
  }
  resetForm() {
    this.formValue = { id: "", taskList: { title: "Untitled Task List", tasks: [] } };
  }
  addTaskList() {
    this.showTaskContainer = !this.showTaskContainer;
    if (!this.showTaskContainer) {
      return;
    } else if (!this.formValue.taskList) {
      let id = this.kanbanService.generateId();
      this.formValue = __spreadProps(__spreadValues({}, this.formValue), { taskList: { id, title: "Untitled Task List", tasks: [] } });
    }
  }
  addTask(event) {
    event.preventDefault();
    if (this.taskContent.trim().length > 0) {
      this.newTask = { text: this.taskContent, completed: false };
      this.formValue.taskList?.tasks.unshift(this.newTask);
      this.taskContent = "";
      this.calculateProgress();
    }
  }
  focus(arg) {
    if (arg == 1) {
      this.timeout = setTimeout(() => this.inputTitle.nativeElement.focus(), 1);
    }
    if (arg == 2) {
      this.timeout = setTimeout(() => this.inputTaskListTitle.nativeElement.focus(), 1);
    }
  }
  calculateProgress() {
    if (this.formValue.taskList) {
      let completed = this.formValue.taskList.tasks.filter((t) => t.completed).length;
      this.formValue.progress = Math.round(100 * (completed / this.formValue.taskList.tasks.length));
    }
  }
  static \u0275fac = function KanbanSidebar_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _KanbanSidebar)(\u0275\u0275directiveInject(Kanban), \u0275\u0275directiveInject(MemberService), \u0275\u0275directiveInject(KanbanService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _KanbanSidebar, selectors: [["kanban-sidebar"]], viewQuery: function KanbanSidebar_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c03, 5);
      \u0275\u0275viewQuery(_c13, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.inputTitle = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.inputTaskListTitle = _t.first);
    }
  }, decls: 1, vars: 1, consts: [["sidebar", ""], ["headless", ""], ["inplace", ""], ["display", ""], ["content", ""], ["action1", ""], ["selecteditem", ""], ["item", ""], ["inputTitle", ""], ["inputTaskListTitle", ""], ["position", "right", "styleClass", "!w-full lg:!w-[50rem] overflow-auto", 3, "visible", "baseZIndex", "showCloseIcon", "visibleChange", 4, "ngIf"], ["position", "right", "styleClass", "!w-full lg:!w-[50rem] overflow-auto", 3, "visibleChange", "visible", "baseZIndex", "showCloseIcon"], [3, "submit"], [1, "px-6", "py-12", "border-b", "border-surface", "flex", "items-center", "justify-between", "h-16"], [1, "flex", "relative"], ["pButton", "", "pRipple", "", "type", "button", "icon", "pi pi-cog", "severity", "secondary", "rounded", "", "text", "", "pTooltip", "Card Actions", "tooltipPosition", "left", "pStyleClass", "#op", "enterFromClass", "!hidden", "leaveToClass", "!hidden"], ["pButton", "", "pRipple", "", "type", "button", "icon", "pi pi-times", "severity", "secondary", "rounded", "", "text", "", 3, "click"], ["id", "op", 1, "card", "absolute", "shadow-md", "!rounded-md", "border", "border-gray-100", "dark:!border-gray-600", "!hidden", 2, "right", "50px", "top", "45px"], [1, "grid", "grid-cols-12", "gap-4", "flex-col", "w-60"], [1, "col-span-12", "flex", "flex-col"], [1, "text-surface-900", "dark:text-surface-0", "font-semibold", "block", "w-full", "border-b", "border-surface", "pb-4", "mb-2"], ["pRipple", "", "class", "text-surface-700 dark:text-surface-100 block p-2 cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-950 select-none rounded-border", 3, "click", 4, "ngFor", "ngForOf"], ["pRipple", "", 1, "text-surface-700", "dark:text-surface-100", "block", "p-2", "cursor-pointer", "hover:bg-surface-50", "dark:hover:bg-surface-950", "select-none", "rounded-border", 3, "click"], [1, "grid", "grid-cols-12", "gap-8", "pt-8", "flex-wrap", "flex-1", "flex-col"], [1, "col-span-12", "field", "px-8", "flex", "flex-col", "gap-4"], ["for", "start", 1, "block", "text-surface-900", "dark:text-surface-0", "font-semibold", "text-lg"], ["id", "description", "name", "description", "type", "text", "pTextarea", "", 1, "w-full", 2, "resize", "none", 3, "ngModelChange", "rows", "ngModel"], [1, "col-span-12", "px-8", "flex", "gap-4"], [1, "flex", "flex-col", "field", "w-full", "gap-4"], ["name", "startDate", "dateFormat", "yy-mm-dd", "inputId", "start", "inputStyleClass", "w-full text-surface-900 dark:text-surface-0 font-semibold", "styleClass", "w-full", 3, "ngModelChange", "showTime", "required", "showIcon", "ngModel"], ["for", "due", 1, "block", "text-surface-900", "dark:text-surface-0", "font-semibold", "text-lg"], ["name", "endDate", "dateFormat", "yy-mm-dd", "inputId", "due", "inputStyleClass", "w-full text-surface-900 dark:text-surface-0 font-semibold", "styleClass", "w-full", 3, "ngModelChange", "showTime", "required", "showIcon", "ngModel"], ["class", "col-span-12 flex flex-col px-8", 4, "ngIf"], [1, "col-span-12", "flex", "flex-col", "field", "px-8"], ["for", "assignees", 1, "block", "text-surface-900", "dark:text-surface-0", "font-semibold", "mb-4", "text-lg"], ["name", "assignees", "field", "name", "emptyMessage", "No results found", "placeholder", "Choose assignees", "styleClass", "w-full", "inputStyleClass", "w-full", 3, "ngModelChange", "completeMethod", "appendTo", "ngModel", "suggestions", "multiple", "showEmptyMessage", "inputStyle"], [1, "col-span-12", "flex", "flex-col", "gap-y-6", "px-8", "mb-12"], [1, "block", "text-surface-900", "dark:text-surface-0", "font-semibold", "text-lg"], [1, "flex", "items-center"], [1, "w-[3.5rem]", "h-[3.25rem]", "rounded-full", "flex", "items-center", "justify-center", "mr-4", "bg-surface-200", "dark:bg-surface-800"], [1, "pi", "pi-user"], ["type", "text", "pTextarea", "", "name", "comment", "placeholder", "Write a comment...", 1, "w-full", 2, "resize", "none", 3, "ngModelChange", "keydown.enter", "ngModel"], ["class", "flex items-center rounded-border", 4, "ngFor", "ngForOf"], [1, "flex", "w-full", "justify-end", "border-t", "border-surface", "py-8", "px-8", "gap-4"], ["pButton", "", "pRipple", "", "type", "button", "icon", "pi pi-paperclip", 1, "p-button-outlined", "p-button-secondary", "border-surface", "text-surface-900", "dark:text-surface-0", "w-12", "h-12"], ["pButton", "", "pRipple", "", "type", "button", "icon", "pi pi-trash", 1, "p-button-outlined", "p-button-secondary", "border-surface", "text-surface-900", "dark:text-surface-0", "w-12", "h-12", 3, "click"], ["pButton", "", "pRipple", "", "type", "submit", "icon", "pi pi-check", "label", "Save", 1, "p-button-primary", "h-12"], ["pTooltip", "Click to edit", 1, "text-surface-900", "dark:text-surface-0", "font-semibold", "text-lg"], [1, "inline-flex", "items-center", "gap-1", "h-10"], ["type", "text", "name", "title", "autofocus", "", "pInputText", "", 1, "h-full", "!rounded-r-none", 3, "ngModelChange", "keydown.enter", "ngModel"], ["pButton", "", "icon", "pi pi-check", 1, "!rounded-l-none", "!h-10", 3, "click"], [1, "col-span-12", "flex", "flex-col", "px-8"], [1, "flex", "justify-between", "mb-4"], [1, "text-surface-900", "dark:text-surface-0", "font-semibold", "text-lg"], [1, "text-surface-900", "dark:text-surface-0", "font-semibold"], ["name", "progress", "styleClass", "!h-1", 3, "value", "showValue"], [1, "h-16", "-mb-6"], ["type", "text", "pTextarea", "", "name", "taskContent", "placeholder", "Add a task", 1, "w-full", "mt-6", "mb-6", 2, "resize", "none", 3, "ngModelChange", "keydown.enter", "ngModel"], ["class", "list-none p-6 flex flex-col gap-4 bg-surface-50 dark:bg-surface-950 border-surface border rounded-border", 4, "ngIf"], [1, "list-none", "p-6", "flex", "flex-col", "gap-4", "bg-surface-50", "dark:bg-surface-950", "border-surface", "border", "rounded-border"], ["class", "flex items-center gap-4", 4, "ngFor", "ngForOf"], [1, "flex", "items-center", "gap-4"], [3, "ngModelChange", "onChange", "name", "ngModel", "binary", "inputId"], [2, "word-break", "break-all", 3, "ngClass"], [1, "flex", "items-center", "gap-2", "border", "rounded-full", "dark:!border-gray-600", "p-2"], [1, "flex", "gap-2", "items-center"], [1, "h-8", "w-8", "border-2", "rounded-full", "border-surface", 3, "src", "alt"], [1, "text-surface-900", "dark:text-surface-0"], [1, "flex", "items-center", "gap-2", "rounded-border"], [1, "flex", "items-center", "rounded-border"], ["class", "w-[3.5rem] h-[3.25rem] rounded-full flex items-center justify-center", 4, "ngIf"], ["class", "w-[3.5rem] h-[3.25rem] rounded-full flex items-center justify-center bg-surface-200 dark:bg-surface-800", 4, "ngIf"], [1, "ml-4", "w-full"], [1, "flex", "justify-between", "mb-2"], [1, "block", "text-surface-900", "dark:text-surface-0"], [1, "block", "text-surface-700", "dark:text-surface-100"], [1, "block", "text-surface-900", "dark:text-surface-0", "border", "bg-surface-50", "dark:bg-surface-950", "border-surface", "p-2", "rounded-border", 2, "word-break", "break-all"], [1, "w-[3.5rem]", "h-[3.25rem]", "rounded-full", "flex", "items-center", "justify-center"], [3, "src"], [1, "w-[3.5rem]", "h-[3.25rem]", "rounded-full", "flex", "items-center", "justify-center", "bg-surface-200", "dark:bg-surface-800"]], template: function KanbanSidebar_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, KanbanSidebar_p_drawer_0_Template, 4, 3, "p-drawer", 10);
    }
    if (rf & 2) {
      \u0275\u0275property("ngIf", ctx.formValue);
    }
  }, dependencies: [
    CommonModule,
    NgClass,
    NgForOf,
    NgIf,
    FormsModule,
    \u0275NgNoValidate,
    DefaultValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    RequiredValidator,
    NgModel,
    NgForm,
    DrawerModule,
    Drawer,
    PopoverModule,
    TooltipModule,
    Tooltip,
    InplaceModule,
    Inplace,
    AutoCompleteModule,
    AutoComplete,
    ProgressBarModule,
    ProgressBar,
    AvatarModule,
    CheckboxModule,
    Checkbox,
    InputTextModule,
    InputText,
    TextareaModule,
    Textarea,
    ButtonModule,
    ButtonDirective,
    RippleModule,
    Ripple,
    DatePickerModule,
    DatePicker,
    OverlayPanelModule,
    StyleClassModule,
    StyleClass
  ], styles: ["\n\n[_nghost-%COMP%]     .p-drawer .p-drawer-content {\n  padding: 0;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  height: 100%;\n  overflow: auto;\n}\n[_nghost-%COMP%]     .p-autocomplete .p-autocomplete-chip-item {\n  display: flex;\n}\n[_nghost-%COMP%]     div.p-inplace-display {\n  padding-left: 0 !important;\n}\n/*# sourceMappingURL=kanbansidebar.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(KanbanSidebar, { className: "KanbanSidebar", filePath: "src/app/apps/kanban/kanbansidebar.ts", lineNumber: 258 });
})();

// src/app/apps/kanban/kanbancard.ts
var _c04 = () => ({ height: ".5rem" });
function KanbanCard_div_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.card.description);
  }
}
function KanbanCard_p_progress_bar_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-progress-bar", 13);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(4, _c04));
    \u0275\u0275property("value", ctx_r2.card.progress)("showValue", false);
  }
}
function KanbanCard_p_avatar_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-avatar", 14);
  }
  if (rf & 2) {
    const assignee_r4 = ctx.$implicit;
    \u0275\u0275propertyInterpolate1("image", "/images/avatar/", assignee_r4.image, "");
  }
}
function KanbanCard_p_avatar_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-avatar", 15);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275propertyInterpolate1("label", "+ ", ctx_r2.card.assignees.length - 3, "");
  }
}
function KanbanCard_div_15_span_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 3);
    \u0275\u0275element(1, "i", 18);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.generateTaskInfo());
  }
}
function KanbanCard_div_15_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 3);
    \u0275\u0275element(1, "i", 19);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.card.attachments);
  }
}
function KanbanCard_div_15_span_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 3);
    \u0275\u0275element(1, "i", 20);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.parseDate(ctx_r2.card.dueDate));
  }
}
function KanbanCard_div_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16);
    \u0275\u0275template(1, KanbanCard_div_15_span_1_Template, 3, 1, "span", 17)(2, KanbanCard_div_15_span_2_Template, 3, 1, "span", 17)(3, KanbanCard_div_15_span_3_Template, 3, 1, "span", 17);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.card.taskList.tasks.length);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.card.attachments);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.card.dueDate);
  }
}
var KanbanCard = class _KanbanCard {
  kanbanService;
  card;
  listId;
  menuItems = [];
  subscription;
  constructor(kanbanService) {
    this.kanbanService = kanbanService;
    this.subscription = this.kanbanService.lists$.subscribe((data) => {
      let subMenu = data.map((d) => ({ id: d.listId, label: d.title, command: () => this.onMove(d.listId) }));
      this.generateMenu(subMenu);
    });
  }
  parseDate(dueDate) {
    return new Date(dueDate).toDateString().split(" ").slice(1, 3).join(" ");
  }
  onDelete() {
    this.kanbanService.deleteCard(this.card.id, this.listId);
  }
  onCopy() {
    this.kanbanService.copyCard(this.card, this.listId);
  }
  onMove(listId) {
    this.kanbanService.moveCard(this.card, listId, this.listId);
  }
  generateMenu(subMenu) {
    this.menuItems = [
      { label: "Copy card", command: () => this.onCopy() },
      { label: "Move card", items: subMenu },
      { label: "Delete card", command: () => this.onDelete() }
    ];
  }
  generateTaskInfo() {
    let total = this.card.taskList.tasks.length;
    let completed = this.card.taskList.tasks.filter((t) => t.completed).length;
    return `${completed} / ${total}`;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  static \u0275fac = function KanbanCard_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _KanbanCard)(\u0275\u0275directiveInject(KanbanService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _KanbanCard, selectors: [["kanban-card"]], inputs: { card: "card", listId: "listId" }, decls: 16, vars: 13, consts: [["menu", ""], ["cdkDragHandle", "", 1, "flex", "bg-surface-0", "dark:bg-surface-900", "flex-col", "w-full", "border", "border-surface", "p-4", "gap-8", "hover:bg-surface-50", "dark:hover:bg-surface-950", "cursor-pointer", "rounded-border", 3, "id"], [1, "flex", "justify-between", "items-center"], [1, "text-surface-900", "dark:text-surface-0", "font-semibold"], ["pButton", "", "pRipple", "", "type", "button", "icon", "pi pi-ellipsis-v", "rounded", "", "text", "", "severity", "secondary", 1, "p-trigger", 3, "click"], ["appendTo", "body", 3, "model", "popup"], ["style", "word-break: break-word", "class", "text-surface-700 dark:text-surface-100", 4, "ngIf"], [3, "value", "showValue", "style", 4, "ngIf"], [1, "flex", "items-center", "justify-between", "flex-col", "md:flex-row", "gap-6", "md:gap-0"], ["shape", "circle", "styleClass", "border-2 border-surface", 3, "image", 4, "ngFor", "ngForOf"], ["shape", "circle", "styleClass", "border-2 border-surface mb-1 bg-surface-50 dark:bg-surface-950", 3, "label", 4, "ngIf"], ["class", "flex items-center gap-4", 4, "ngIf"], [1, "text-surface-700", "dark:text-surface-100", 2, "word-break", "break-word"], [3, "value", "showValue"], ["shape", "circle", "styleClass", "border-2 border-surface", 3, "image"], ["shape", "circle", "styleClass", "border-2 border-surface mb-1 bg-surface-50 dark:bg-surface-950", 3, "label"], [1, "flex", "items-center", "gap-4"], ["class", "text-surface-900 dark:text-surface-0 font-semibold", 4, "ngIf"], [1, "pi", "pi-check-square", "text-surface-700", "dark:text-surface-100", "mr-2"], [1, "pi", "pi-paperclip", "text-surface-700", "dark:text-surface-100", "mr-2"], [1, "pi", "pi-clock", "text-surface-700", "dark:text-surface-100", "mr-2"]], template: function KanbanCard_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "span", 3);
      \u0275\u0275text(3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div")(5, "button", 4);
      \u0275\u0275listener("click", function KanbanCard_Template_button_click_5_listener($event) {
        \u0275\u0275restoreView(_r1);
        const menu_r2 = \u0275\u0275reference(7);
        return \u0275\u0275resetView(menu_r2.toggle($event));
      });
      \u0275\u0275elementEnd();
      \u0275\u0275element(6, "p-tiered-menu", 5, 0);
      \u0275\u0275elementEnd()();
      \u0275\u0275template(8, KanbanCard_div_8_Template, 2, 1, "div", 6)(9, KanbanCard_p_progress_bar_9_Template, 1, 5, "p-progress-bar", 7);
      \u0275\u0275elementStart(10, "div", 8)(11, "p-avatar-group");
      \u0275\u0275template(12, KanbanCard_p_avatar_12_Template, 1, 2, "p-avatar", 9);
      \u0275\u0275pipe(13, "slice");
      \u0275\u0275template(14, KanbanCard_p_avatar_14_Template, 1, 2, "p-avatar", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275template(15, KanbanCard_div_15_Template, 4, 3, "div", 11);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275property("id", ctx.card.id);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.card.title ? ctx.card.title : "Untitled");
      \u0275\u0275advance(3);
      \u0275\u0275property("model", ctx.menuItems)("popup", true);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngIf", ctx.card.description);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.card.taskList.tasks.length);
      \u0275\u0275advance(3);
      \u0275\u0275property("ngForOf", \u0275\u0275pipeBind3(13, 9, ctx.card.assignees, 0, 3));
      \u0275\u0275advance(2);
      \u0275\u0275property("ngIf", ctx.card.assignees && ctx.card.assignees.length > 3);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.card.attachments || ctx.card.dueDate);
    }
  }, dependencies: [CommonModule, NgForOf, NgIf, SlicePipe, TieredMenuModule, TieredMenu, ButtonModule, ButtonDirective, RippleModule, Ripple, AvatarModule, Avatar, ProgressBarModule, ProgressBar, AvatarGroupModule, AvatarGroup, CdkDragHandle], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(KanbanCard, { className: "KanbanCard", filePath: "src/app/apps/kanban/kanbancard.ts", lineNumber: 43 });
})();

// src/app/apps/kanban/kanbanlist.ts
var _c05 = ["inputEl"];
var _c14 = ["listEl"];
function KanbanList_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.list.title);
  }
}
function KanbanList_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 12)(1, "input", 13);
    \u0275\u0275twoWayListener("ngModelChange", function KanbanList_ng_template_4_Template_input_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.list.title, $event) || (ctx_r1.list.title = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 14);
    \u0275\u0275listener("click", function KanbanList_ng_template_4_Template_button_click_2_listener($event) {
      const closeCallback_r4 = \u0275\u0275restoreView(_r3).closeCallback;
      return \u0275\u0275resetView(closeCallback_r4($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r1.list.title);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.list.title);
  }
}
function KanbanList_kanban_card_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "kanban-card", 15);
    \u0275\u0275listener("click", function KanbanList_kanban_card_12_Template_kanban_card_click_0_listener($event) {
      const card_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onCardClick($event, card_r7));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const card_r7 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("card", card_r7)("listId", ctx_r1.list.listId)("cdkDragDisabled", ctx_r1.isMobileDevice);
  }
}
var KanbanList = class _KanbanList {
  parent;
  kanbanService;
  list;
  listIds;
  menuItems = [];
  title = "";
  timeout = null;
  isMobileDevice = false;
  inputEl;
  listEl;
  constructor(parent, kanbanService) {
    this.parent = parent;
    this.kanbanService = kanbanService;
  }
  ngOnInit() {
    this.isMobileDevice = this.kanbanService.isMobileDevice();
    this.menuItems = [
      {
        label: "List actions",
        items: [
          { separator: true },
          { label: "Copy list", command: () => this.onCopy(this.list) },
          {
            label: "Remove list",
            command: () => {
              if (this.list.listId) {
                this.onDelete(this.list.listId);
              }
            }
          }
        ]
      }
    ];
  }
  toggleSidebar() {
    this.parent.sidebarVisible = true;
  }
  onDelete(id) {
    this.kanbanService.deleteList(id);
  }
  onCopy(list) {
    this.kanbanService.copyList(list);
  }
  onCardClick(event, card) {
    const eventTarget = event.target;
    if (!(eventTarget.classList.contains("p-button-icon") || eventTarget.classList.contains("p-trigger"))) {
      if (this.list.listId) {
        this.kanbanService.onCardSelect(card, this.list.listId);
      }
      this.parent.sidebarVisible = true;
    }
  }
  insertCard() {
    if (this.list.listId) {
      this.kanbanService.addCard(this.list.listId);
    }
  }
  dropCard(event) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }
  focus() {
    this.timeout = setTimeout(() => this.inputEl.nativeElement.focus(), 1);
  }
  insertHeight(event) {
    event.container.element.nativeElement.style.minHeight = "10rem";
  }
  removeHeight(event) {
    event.container.element.nativeElement.style.minHeight = "2rem";
  }
  static \u0275fac = function KanbanList_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _KanbanList)(\u0275\u0275directiveInject(Kanban), \u0275\u0275directiveInject(KanbanService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _KanbanList, selectors: [["kanban-list"]], viewQuery: function KanbanList_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c05, 5);
      \u0275\u0275viewQuery(_c14, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.inputEl = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.listEl = _t.first);
    }
  }, hostAttrs: [1, "card", "md:w-[25rem]", "overflow-hidden", "shadow-md", "!rounded-border", "flex-shrink-0"], inputs: { list: "list", listIds: "listIds" }, decls: 15, vars: 6, consts: [["display", ""], ["content", ""], ["menu", ""], ["listEl", ""], [1, "flex", "justify-between", "items-center", "w-full"], ["pButton", "", "pRipple", "", "type", "button", "icon", "pi pi-ellipsis-h", 1, "p-button-rounded", "p-button-text", "p-button-secondary", 3, "click"], ["appendTo", "body", 3, "model", "popup"], ["cdkDropList", "", 1, "flex", "flex-col", "gap-8", "overflow-y-auto", "mt-6", "scrollable", "kanban-list", 2, "min-height", "2rem", 3, "cdkDropListDropped", "cdkDropListEntered", "cdkDropListExited", "id", "cdkDropListData", "cdkDropListConnectedTo"], ["cdkDrag", "", 3, "card", "listId", "cdkDragDisabled", "click", 4, "ngFor", "ngForOf"], [1, "px-6", "mb-4", "w-full", "mt-6", "flex"], ["pButton", "", "pRipple", "", "label", "New Card", "icon", "pi pi-plus font-semibold", 1, "py-4", "justify-center", "font-semibold", "w-full", "rounded-border", 3, "click"], [1, "text-lg", "font-semibold"], [1, "inline-flex", "items-center", "gap-1", "h-10"], ["type", "text", "autofocus", "", "pInputText", "", 1, "h-full", "!rounded-r-none", 3, "ngModelChange", "value", "ngModel"], ["pButton", "", "icon", "pi pi-check", 1, "!rounded-l-none", "!h-10", 3, "click"], ["cdkDrag", "", 3, "click", "card", "listId", "cdkDragDisabled"]], template: function KanbanList_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 4)(1, "p-inplace");
      \u0275\u0275template(2, KanbanList_ng_template_2_Template, 2, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor)(4, KanbanList_ng_template_4_Template, 3, 2, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "div")(7, "button", 5);
      \u0275\u0275listener("click", function KanbanList_Template_button_click_7_listener($event) {
        \u0275\u0275restoreView(_r1);
        const menu_r5 = \u0275\u0275reference(9);
        return \u0275\u0275resetView(menu_r5.toggle($event));
      });
      \u0275\u0275elementEnd();
      \u0275\u0275element(8, "p-menu", 6, 2);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "div", 7, 3);
      \u0275\u0275listener("cdkDropListDropped", function KanbanList_Template_div_cdkDropListDropped_10_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.dropCard($event));
      })("cdkDropListEntered", function KanbanList_Template_div_cdkDropListEntered_10_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.insertHeight($event));
      })("cdkDropListExited", function KanbanList_Template_div_cdkDropListExited_10_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.removeHeight($event));
      });
      \u0275\u0275template(12, KanbanList_kanban_card_12_Template, 1, 3, "kanban-card", 8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 9)(14, "button", 10);
      \u0275\u0275listener("click", function KanbanList_Template_button_click_14_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.insertCard());
      });
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(8);
      \u0275\u0275property("model", ctx.menuItems)("popup", true);
      \u0275\u0275advance(2);
      \u0275\u0275property("id", ctx.list.listId)("cdkDropListData", ctx.list.cards)("cdkDropListConnectedTo", ctx.listIds);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngForOf", ctx.list.cards);
    }
  }, dependencies: [CommonModule, NgForOf, InplaceModule, Inplace, ButtonModule, ButtonDirective, RippleModule, Ripple, MenuModule, Menu, KanbanCard, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, InputTextModule, InputText, CdkDropList, CdkDrag, TooltipModule], styles: ["\n\n[_nghost-%COMP%]     .p-button-label {\n  flex: 0;\n  white-space: nowrap;\n}\n[_nghost-%COMP%]     .scrollable {\n  scroll-behavior: smooth;\n  max-height: 70vh;\n}\n[_nghost-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 6px;\n}\n[_nghost-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: transparent;\n}\n[_nghost-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background-color: var(--p-gray-500);\n  border-radius: 20px;\n}\n.cdk-drag-preview[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  border-radius: 4px;\n  box-shadow:\n    0 5px 5px -3px rgba(0, 0, 0, 0.2),\n    0 8px 10px 1px rgba(0, 0, 0, 0.14),\n    0 3px 14px 2px rgba(0, 0, 0, 0.12);\n}\n.cdk-drag-placeholder[_ngcontent-%COMP%] {\n  opacity: 0.25;\n}\n.cdk-drag-animating[_ngcontent-%COMP%] {\n  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);\n}\n/*# sourceMappingURL=kanbanlist.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(KanbanList, { className: "KanbanList", filePath: "src/app/apps/kanban/kanbanlist.ts", lineNumber: 106 });
})();

// src/app/apps/kanban/index.ts
function Kanban_kanban_list_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "kanban-list", 4);
  }
  if (rf & 2) {
    const list_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("list", list_r1)("listIds", ctx_r1.listIds)("cdkDragDisabled", ctx_r1.isMobileDevice);
  }
}
var Kanban = class _Kanban {
  kanbanService;
  sidebarVisible = false;
  lists = [];
  listIds = [];
  subscription = new Subscription();
  style;
  isMobileDevice = false;
  constructor(kanbanService) {
    this.kanbanService = kanbanService;
    this.subscription = this.kanbanService.lists$.subscribe((data) => {
      this.lists = data;
      this.listIds = this.lists.map((l) => l.listId || "");
    });
  }
  ngOnInit() {
    this.removeLayoutResponsive();
    this.isMobileDevice = this.kanbanService.isMobileDevice();
  }
  toggleSidebar() {
    this.sidebarVisible = true;
  }
  addList() {
    this.kanbanService.addList();
  }
  dropList(event) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  }
  removeLayoutResponsive() {
    this.style = document.createElement("style");
    this.style.innerHTML = `
                .layout-content {
                    width: 100%;
                }

                .layout-topbar {
                    width: 100%;
                }
            `;
    document.head.appendChild(this.style);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    document.head.removeChild(this.style);
  }
  static \u0275fac = function Kanban_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Kanban)(\u0275\u0275directiveInject(KanbanService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Kanban, selectors: [["kanban"]], features: [\u0275\u0275ProvidersFeature([KanbanService])], decls: 5, vars: 2, consts: [["id", "kanban-wrapper", "cdkDropList", "", "cdkDropListOrientation", "horizontal", 1, "flex", "gap-8", "w-full", "flex-col", "md:flex-row", "flex-nowrap", "lg:overflow-y-hidden", "overflow-x-auto", 3, "cdkDropListDropped", "cdkDropListData"], ["cdkDrag", "", "cdkDragHandle", "", "class", "p-kanban-list", 3, "list", "listIds", "cdkDragDisabled", 4, "ngFor", "ngForOf"], [1, "px-4", "py-1", "mb-4", "md:w-[25rem]", "shrink-0"], ["pButton", "", "pRipple", "", "label", "New List", "icon", "pi pi-plus font-semibold", 1, "py-4", "justify-center", "font-semibold", "w-full", "rounded", 3, "click"], ["cdkDrag", "", "cdkDragHandle", "", 1, "p-kanban-list", 3, "list", "listIds", "cdkDragDisabled"]], template: function Kanban_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275listener("cdkDropListDropped", function Kanban_Template_div_cdkDropListDropped_0_listener($event) {
        return ctx.dropList($event);
      });
      \u0275\u0275template(1, Kanban_kanban_list_1_Template, 1, 3, "kanban-list", 1);
      \u0275\u0275elementStart(2, "div", 2)(3, "button", 3);
      \u0275\u0275listener("click", function Kanban_Template_button_click_3_listener() {
        return ctx.addList();
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275element(4, "kanban-sidebar");
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275property("cdkDropListData", ctx.lists);
      \u0275\u0275advance();
      \u0275\u0275property("ngForOf", ctx.lists);
    }
  }, dependencies: [KanbanSidebar, KanbanList, CommonModule, NgForOf, ButtonModule, ButtonDirective, RippleModule, Ripple, DragDropModule, CdkDropList, CdkDrag, CdkDragHandle], styles: ["\n\n[_nghost-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar {\n  height: 6px;\n}\n[_nghost-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: transparent;\n}\n[_nghost-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background-color: var(--gray-500);\n  border-radius: 20px;\n}\n[_nghost-%COMP%]     .p-button-label {\n  flex: 0;\n  white-space: nowrap;\n}\n[_nghost-%COMP%]     .p-inplace .p-inplace-content .p-inputtext {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n[_nghost-%COMP%]     .p-inplace .p-inplace-content .p-button {\n  border-top-left-radius: 0px;\n  border-bottom-left-radius: 0px;\n  width: 3rem;\n  height: 3rem;\n}\n[_nghost-%COMP%]     .p-inplace .p-inplace-display {\n  padding: 0;\n}\n.p-kanban-list[_ngcontent-%COMP%] {\n  cursor: pointer;\n  height: min-content;\n}\n.cdk-drag-preview[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  border-radius: 4px;\n  box-shadow:\n    0 5px 5px -3px rgba(0, 0, 0, 0.2),\n    0 8px 10px 1px rgba(0, 0, 0, 0.14),\n    0 3px 14px 2px rgba(0, 0, 0, 0.12);\n}\n.cdk-drag-placeholder[_ngcontent-%COMP%] {\n  opacity: 0.25;\n}\n.cdk-drag-animating[_ngcontent-%COMP%] {\n  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);\n}\n/*# sourceMappingURL=index.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Kanban, { className: "Kanban", filePath: "src/app/apps/kanban/index.ts", lineNumber: 90 });
})();
export {
  Kanban
};
//# sourceMappingURL=chunk-V3Q3JQAE.js.map
