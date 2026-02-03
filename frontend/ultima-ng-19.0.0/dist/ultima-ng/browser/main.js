import {
  AppConfigurator,
  material_default
} from "./chunk-I3HEDYSS.js";
import {
  Drawer,
  DrawerModule
} from "./chunk-EOOGB7IQ.js";
import {
  MegaMenuModule
} from "./chunk-PX2C2663.js";
import "./chunk-BVB72Z3E.js";
import {
  OverlayBadge
} from "./chunk-TVR7D6US.js";
import {
  LayoutService
} from "./chunk-ZGNAW63S.js";
import {
  AnimationDriver,
  AnimationEngine,
  AnimationRendererFactory,
  AnimationStyleNormalizer,
  NoopAnimationDriver,
  WebAnimationsDriver,
  WebAnimationsStyleNormalizer
} from "./chunk-DVIZOEBH.js";
import {
  StyleClass,
  StyleClassModule
} from "./chunk-CFS3J3Q2.js";
import {
  Toast
} from "./chunk-6SRYYUT2.js";
import "./chunk-HY2A3TN6.js";
import "./chunk-YEN5RMZS.js";
import "./chunk-XS7IVZ5T.js";
import "./chunk-CUABQE42.js";
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RouterOutlet,
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling
} from "./chunk-BTKK64MU.js";
import {
  BrowserModule,
  DomRendererFactory2,
  bootstrapApplication
} from "./chunk-36C7KO53.js";
import {
  takeUntilDestroyed
} from "./chunk-WRLBQDQK.js";
import "./chunk-KHEKFKWA.js";
import {
  InputText
} from "./chunk-FZELBHWZ.js";
import {
  Tooltip,
  TooltipModule
} from "./chunk-4IUQ6KTI.js";
import "./chunk-IVSL2HKS.js";
import "./chunk-E352KRZV.js";
import "./chunk-HHD4PK4J.js";
import {
  BadgeModule,
  Button,
  ButtonDirective,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import {
  DomHandler,
  Ripple,
  RippleModule
} from "./chunk-AP3OAIHW.js";
import {
  MessageService,
  definePreset,
  providePrimeNG
} from "./chunk-NQNBRQ7H.js";
import {
  FormsModule
} from "./chunk-3HTR5OU7.js";
import {
  Key,
  StorageService,
  UserService
} from "./chunk-SQ5BRWVW.js";
import "./chunk-ZRELZ6R7.js";
import {
  HttpResponse,
  provideHttpClient,
  withFetch,
  withInterceptors
} from "./chunk-BMYIFZHZ.js";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "./chunk-W3K3GK4Z.js";
import {
  AsyncPipe,
  CommonModule,
  DOCUMENT,
  DatePipe,
  NgClass,
  NgForOf,
  NgIf
} from "./chunk-SQQPVFHK.js";
import {
  ANIMATION_MODULE_TYPE,
  BehaviorSubject,
  ChangeDetectionScheduler,
  DestroyRef,
  ElementRef,
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  NgModule,
  NgZone,
  PLATFORM_ID,
  Renderer2,
  RendererFactory2,
  RuntimeError,
  catchError,
  computed,
  effect,
  filter,
  inject,
  makeEnvironmentProviders,
  of,
  performanceMarkFeature,
  setClassMetadata,
  signal,
  tap,
  throwError,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵinvalidFactory,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction2,
  ɵɵqueryRefresh,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵresolveDocument,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuery
} from "./chunk-ZKKMBKIA.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// node_modules/@angular/platform-browser/fesm2022/animations/async.mjs
var ANIMATION_PREFIX = "@";
var AsyncAnimationRendererFactory = class _AsyncAnimationRendererFactory {
  doc;
  delegate;
  zone;
  animationType;
  moduleImpl;
  _rendererFactoryPromise = null;
  scheduler = null;
  injector = inject(Injector);
  loadingSchedulerFn = inject(\u0275ASYNC_ANIMATION_LOADING_SCHEDULER_FN, {
    optional: true
  });
  _engine;
  /**
   *
   * @param moduleImpl allows to provide a mock implmentation (or will load the animation module)
   */
  constructor(doc, delegate, zone, animationType, moduleImpl) {
    this.doc = doc;
    this.delegate = delegate;
    this.zone = zone;
    this.animationType = animationType;
    this.moduleImpl = moduleImpl;
  }
  /** @nodoc */
  ngOnDestroy() {
    this._engine?.flush();
  }
  /**
   * @internal
   */
  loadImpl() {
    const loadFn = () => this.moduleImpl ?? import("./chunk-X4C2QM4G.js").then((m) => m);
    let moduleImplPromise;
    if (this.loadingSchedulerFn) {
      moduleImplPromise = this.loadingSchedulerFn(loadFn);
    } else {
      moduleImplPromise = loadFn();
    }
    return moduleImplPromise.catch((e) => {
      throw new RuntimeError(5300, (typeof ngDevMode === "undefined" || ngDevMode) && "Async loading for animations package was enabled, but loading failed. Angular falls back to using regular rendering. No animations will be displayed and their styles won't be applied.");
    }).then(({
      \u0275createEngine,
      \u0275AnimationRendererFactory
    }) => {
      this._engine = \u0275createEngine(this.animationType, this.doc);
      const rendererFactory = new \u0275AnimationRendererFactory(this.delegate, this._engine, this.zone);
      this.delegate = rendererFactory;
      return rendererFactory;
    });
  }
  /**
   * This method is delegating the renderer creation to the factories.
   * It uses default factory while the animation factory isn't loaded
   * and will rely on the animation factory once it is loaded.
   *
   * Calling this method will trigger as side effect the loading of the animation module
   * if the renderered component uses animations.
   */
  createRenderer(hostElement, rendererType) {
    const renderer = this.delegate.createRenderer(hostElement, rendererType);
    if (renderer.\u0275type === 0) {
      return renderer;
    }
    if (typeof renderer.throwOnSyntheticProps === "boolean") {
      renderer.throwOnSyntheticProps = false;
    }
    const dynamicRenderer = new DynamicDelegationRenderer(renderer);
    if (rendererType?.data?.["animation"] && !this._rendererFactoryPromise) {
      this._rendererFactoryPromise = this.loadImpl();
    }
    this._rendererFactoryPromise?.then((animationRendererFactory) => {
      const animationRenderer = animationRendererFactory.createRenderer(hostElement, rendererType);
      dynamicRenderer.use(animationRenderer);
      this.scheduler ??= this.injector.get(ChangeDetectionScheduler, null, {
        optional: true
      });
      this.scheduler?.notify(
        11
        /* NotificationSource.AsyncAnimationsLoaded */
      );
    }).catch((e) => {
      dynamicRenderer.use(renderer);
    });
    return dynamicRenderer;
  }
  begin() {
    this.delegate.begin?.();
  }
  end() {
    this.delegate.end?.();
  }
  whenRenderingDone() {
    return this.delegate.whenRenderingDone?.() ?? Promise.resolve();
  }
  /**
   * Used during HMR to clear any cached data about a component.
   * @param componentId ID of the component that is being replaced.
   */
  componentReplaced(componentId) {
    this._engine?.flush();
    this.delegate.componentReplaced?.(componentId);
  }
  static \u0275fac = function AsyncAnimationRendererFactory_Factory(__ngFactoryType__) {
    \u0275\u0275invalidFactory();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _AsyncAnimationRendererFactory,
    factory: _AsyncAnimationRendererFactory.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AsyncAnimationRendererFactory, [{
    type: Injectable
  }], () => [{
    type: Document
  }, {
    type: RendererFactory2
  }, {
    type: NgZone
  }, {
    type: void 0
  }, {
    type: Promise
  }], null);
})();
var DynamicDelegationRenderer = class {
  delegate;
  // List of callbacks that need to be replayed on the animation renderer once its loaded
  replay = [];
  \u0275type = 1;
  constructor(delegate) {
    this.delegate = delegate;
  }
  use(impl) {
    this.delegate = impl;
    if (this.replay !== null) {
      for (const fn of this.replay) {
        fn(impl);
      }
      this.replay = null;
    }
  }
  get data() {
    return this.delegate.data;
  }
  destroy() {
    this.replay = null;
    this.delegate.destroy();
  }
  createElement(name, namespace) {
    return this.delegate.createElement(name, namespace);
  }
  createComment(value) {
    return this.delegate.createComment(value);
  }
  createText(value) {
    return this.delegate.createText(value);
  }
  get destroyNode() {
    return this.delegate.destroyNode;
  }
  appendChild(parent, newChild) {
    this.delegate.appendChild(parent, newChild);
  }
  insertBefore(parent, newChild, refChild, isMove) {
    this.delegate.insertBefore(parent, newChild, refChild, isMove);
  }
  removeChild(parent, oldChild, isHostElement) {
    this.delegate.removeChild(parent, oldChild, isHostElement);
  }
  selectRootElement(selectorOrNode, preserveContent) {
    return this.delegate.selectRootElement(selectorOrNode, preserveContent);
  }
  parentNode(node) {
    return this.delegate.parentNode(node);
  }
  nextSibling(node) {
    return this.delegate.nextSibling(node);
  }
  setAttribute(el, name, value, namespace) {
    this.delegate.setAttribute(el, name, value, namespace);
  }
  removeAttribute(el, name, namespace) {
    this.delegate.removeAttribute(el, name, namespace);
  }
  addClass(el, name) {
    this.delegate.addClass(el, name);
  }
  removeClass(el, name) {
    this.delegate.removeClass(el, name);
  }
  setStyle(el, style2, value, flags) {
    this.delegate.setStyle(el, style2, value, flags);
  }
  removeStyle(el, style2, flags) {
    this.delegate.removeStyle(el, style2, flags);
  }
  setProperty(el, name, value) {
    if (this.shouldReplay(name)) {
      this.replay.push((renderer) => renderer.setProperty(el, name, value));
    }
    this.delegate.setProperty(el, name, value);
  }
  setValue(node, value) {
    this.delegate.setValue(node, value);
  }
  listen(target, eventName, callback, options) {
    if (this.shouldReplay(eventName)) {
      this.replay.push((renderer) => renderer.listen(target, eventName, callback, options));
    }
    return this.delegate.listen(target, eventName, callback, options);
  }
  shouldReplay(propOrEventName) {
    return this.replay !== null && propOrEventName.startsWith(ANIMATION_PREFIX);
  }
};
var \u0275ASYNC_ANIMATION_LOADING_SCHEDULER_FN = new InjectionToken(ngDevMode ? "async_animation_loading_scheduler_fn" : "");
function provideAnimationsAsync(type = "animations") {
  performanceMarkFeature("NgAsyncAnimations");
  return makeEnvironmentProviders([{
    provide: RendererFactory2,
    useFactory: (doc, renderer, zone) => {
      return new AsyncAnimationRendererFactory(doc, renderer, zone, type);
    },
    deps: [DOCUMENT, DomRendererFactory2, NgZone]
  }, {
    provide: ANIMATION_MODULE_TYPE,
    useValue: type === "noop" ? "NoopAnimations" : "BrowserAnimations"
  }]);
}

// src/app/layout/components/app.topbar.ts
var _c0 = ["searchInput"];
var _c1 = ["menuButton"];
var _c2 = ["mobileMenuButton"];
var _c3 = ["app-topbar", ""];
var _forTrack0 = ($index, $item) => $item.demandeIndividuelId;
function AppTopbar_Conditional_38_Conditional_0_Conditional_4_For_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li", 56);
    \u0275\u0275listener("click", function AppTopbar_Conditional_38_Conditional_0_Conditional_4_For_9_Template_li_click_0_listener() {
      const demande_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r2.viewDetailDemandeAttente(demande_r6.demandeIndividuelId));
    });
    \u0275\u0275elementStart(1, "div", 57)(2, "div", 58);
    \u0275\u0275element(3, "i", 59);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 60)(5, "span", 61);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "small", 62);
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(10, "i", 63);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const demande_r6 = ctx.$implicit;
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2(" ", demande_r6.nom, " ", demande_r6.prenom, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(9, 3, demande_r6.createdAt, "dd/MM/yyyy \xE0 HH:mm"), " ");
  }
}
function AppTopbar_Conditional_38_Conditional_0_Conditional_4_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 53);
    \u0275\u0275element(1, "i", 64);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r2.state().demandeAttentes.length - 10, " autre(s) demande(s) non affich\xE9e(s) ");
  }
}
function AppTopbar_Conditional_38_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 47);
    \u0275\u0275listener("clickOutside", function AppTopbar_Conditional_38_Conditional_0_Conditional_4_Template_div_clickOutside_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.closeNotificationMenu());
    });
    \u0275\u0275elementStart(1, "div", 48)(2, "span", 49);
    \u0275\u0275text(3, " Vous avez ");
    \u0275\u0275elementStart(4, "b", 50);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275text(6, " nouvelle(s) demande(s) ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "ul", 51);
    \u0275\u0275repeaterCreate(8, AppTopbar_Conditional_38_Conditional_0_Conditional_4_For_9_Template, 11, 6, "li", 52, _forTrack0);
    \u0275\u0275template(10, AppTopbar_Conditional_38_Conditional_0_Conditional_4_Conditional_10_Template, 3, 1, "li", 53);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 54)(12, "p-button", 55);
    \u0275\u0275listener("onClick", function AppTopbar_Conditional_38_Conditional_0_Conditional_4_Template_p_button_onClick_12_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.viewAllDemandes());
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.state().demandeAttentes.length);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r2.state().demandeAttentes.slice(0, 10));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.state().demandeAttentes.length > 10 ? 10 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("outlined", true);
  }
}
function AppTopbar_Conditional_38_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li")(1, "a", 42);
    \u0275\u0275listener("click", function AppTopbar_Conditional_38_Conditional_0_Template_a_click_1_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.toggleNotificationMenu());
    });
    \u0275\u0275elementStart(2, "p-overlay-badge", 44);
    \u0275\u0275element(3, "i", 45);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(4, AppTopbar_Conditional_38_Conditional_0_Conditional_4_Template, 13, 3, "div", 46);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r2.state().demandeAttentes.length.toString());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.notificationMenuVisible() ? 4 : -1);
  }
}
function AppTopbar_Conditional_38_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "a");
    \u0275\u0275element(2, "i", 45);
    \u0275\u0275elementEnd()();
  }
}
function AppTopbar_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, AppTopbar_Conditional_38_Conditional_0_Template, 5, 2, "li")(1, AppTopbar_Conditional_38_Conditional_1_Template, 3, 0, "li");
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r2.state().demandeAttentes && ctx_r2.state().demandeAttentes.length > 0 ? 0 : 1);
  }
}
function AppTopbar_Conditional_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "a", 65);
    \u0275\u0275element(2, "i", 66);
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "Setting");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(5, "li")(6, "a", 65);
    \u0275\u0275element(7, "i", 67);
    \u0275\u0275elementStart(8, "span");
    \u0275\u0275text(9, "Terms of Usage");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "li")(11, "a", 65);
    \u0275\u0275element(12, "i", 68);
    \u0275\u0275elementStart(13, "span");
    \u0275\u0275text(14, "Support");
    \u0275\u0275elementEnd()()();
  }
}
var AppTopbar = class _AppTopbar {
  user;
  notificationMenuVisible = signal(false);
  state = signal({
    loading: false,
    message: void 0,
    error: void 0
  });
  userService = inject(UserService);
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  layoutService = inject(LayoutService);
  elementRef = inject(ElementRef);
  // Fermer le menu au clic extérieur
  onDocumentClick(event) {
    const target = event.target;
    const notificationDropdown = this.elementRef.nativeElement.querySelector(".notification-dropdown");
    const bellIcon = this.elementRef.nativeElement.querySelector(".pi-bell")?.closest("a");
    if (notificationDropdown && bellIcon) {
      const clickedInsideDropdown = notificationDropdown.contains(target);
      const clickedOnBell = bellIcon.contains(target);
      if (!clickedInsideDropdown && !clickedOnBell) {
        this.closeNotificationMenu();
      }
    }
  }
  toggleNotificationMenu() {
    this.notificationMenuVisible.update((v) => !v);
  }
  closeNotificationMenu() {
    this.notificationMenuVisible.set(false);
  }
  viewDetailDemandeAttente(demandeIndividuelId) {
    this.closeNotificationMenu();
    this.router.navigate(["/dashboards/credit/individuel/attente/detail/", demandeIndividuelId]);
  }
  viewAllDemandes() {
    this.closeNotificationMenu();
    this.router.navigate(["/dashboards/credit/individuel/attente"]);
  }
  searchInput;
  menuButton;
  mobileMenuButton;
  loadDemandeAttente() {
    this.state.update((state2) => __spreadProps(__spreadValues({}, state2), { loading: true }));
    this.userService.getAllDemandeAttente$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        console.log("API Response:", response);
        this.state.update((state2) => __spreadProps(__spreadValues({}, state2), {
          demandeAttentes: response.data.demandeAttentes,
          agence: response.data.agence,
          pointVente: response.data.pointVente || null,
          loading: false
        }));
      },
      error: (error) => {
        console.error("API Error:", error);
        this.state.update((state2) => __spreadProps(__spreadValues({}, state2), { error, loading: false }));
      }
    });
  }
  ngOnChanges(changes) {
    if (this.user?.role === "DA") {
      this.loadDemandeAttente();
    }
  }
  model = [
    {
      label: "UI KIT",
      items: [
        [
          {
            label: "UI KIT 1",
            items: [
              { label: "Form Layout", icon: "pi pi-fw pi-id-card", to: "/uikit/formlayout" },
              { label: "Input", icon: "pi pi-fw pi-check-square", to: "/uikit/input" },
              { label: "Float Label", icon: "pi pi-fw pi-bookmark", to: "/uikit/floatlabel" },
              { label: "Button", icon: "pi pi-fw pi-mobile", to: "/uikit/button" },
              { label: "File", icon: "pi pi-fw pi-file", to: "/uikit/file" }
            ]
          }
        ],
        [
          {
            label: "UI KIT 2",
            items: [
              { label: "Table", icon: "pi pi-fw pi-table", to: "/uikit/table" },
              { label: "List", icon: "pi pi-fw pi-list", to: "/uikit/list" },
              { label: "Tree", icon: "pi pi-fw pi-share-alt", to: "/uikit/tree" },
              { label: "Panel", icon: "pi pi-fw pi-tablet", to: "/uikit/panel" },
              { label: "Chart", icon: "pi pi-fw pi-chart-bar", to: "/uikit/charts" }
            ]
          }
        ],
        [
          {
            label: "UI KIT 3",
            items: [
              { label: "Overlay", icon: "pi pi-fw pi-clone", to: "/uikit/overlay" },
              { label: "Media", icon: "pi pi-fw pi-image", to: "/uikit/media" },
              { label: "Menu", icon: "pi pi-fw pi-bars", to: "/uikit/menu" },
              { label: "Message", icon: "pi pi-fw pi-comment", to: "/uikit/message" },
              { label: "Misc", icon: "pi pi-fw pi-circle-off", to: "/uikit/misc" }
            ]
          }
        ]
      ]
    },
    {
      label: "UTILITIES",
      items: [
        [
          {
            label: "UTILITIES 1",
            items: [
              {
                label: "Buy Now",
                icon: "pi pi-fw pi-shopping-cart",
                url: "https://www.primefaces.org/store",
                target: "_blank"
              },
              {
                label: "Documentation",
                icon: "pi pi-fw pi-info-circle",
                to: "/documentation"
              }
            ]
          }
        ]
      ]
    }
  ];
  onMenuButtonClick() {
    this.layoutService.onMenuToggle();
  }
  onRightMenuButtonClick() {
    this.layoutService.openRightMenu();
  }
  toggleConfigSidebar() {
    let layoutState = this.layoutService.layoutState();
    if (this.layoutService.isSidebarActive()) {
      layoutState.overlayMenuActive = false;
      layoutState.overlaySubmenuActive = false;
      layoutState.staticMenuMobileActive = false;
      layoutState.menuHoverActive = false;
      layoutState.configSidebarVisible = false;
    }
    layoutState.configSidebarVisible = !layoutState.configSidebarVisible;
    this.layoutService.layoutState.set(__spreadValues({}, layoutState));
  }
  focusSearchInput() {
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 150);
  }
  onTopbarMenuToggle() {
    this.layoutService.layoutState.update((val) => __spreadProps(__spreadValues({}, val), { topbarMenuActive: !val.topbarMenuActive }));
  }
  logout() {
    this.userService.logOut();
    this.router.navigate([``]);
  }
  static \u0275fac = function AppTopbar_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppTopbar)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppTopbar, selectors: [["", "app-topbar", ""]], viewQuery: function AppTopbar_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
      \u0275\u0275viewQuery(_c1, 5);
      \u0275\u0275viewQuery(_c2, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.searchInput = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.menuButton = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.mobileMenuButton = _t.first);
    }
  }, hostAttrs: [1, "layout-topbar"], hostBindings: function AppTopbar_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("click", function AppTopbar_click_HostBindingHandler($event) {
        return ctx.onDocumentClick($event);
      }, false, \u0275\u0275resolveDocument);
    }
  }, inputs: { user: "user" }, features: [\u0275\u0275NgOnChangesFeature], attrs: _c3, decls: 56, vars: 7, consts: [["menuButton", ""], ["mobileMenuButton", ""], ["searchInput", ""], [1, "layout-topbar-start"], ["routerLink", "/", 1, "layout-topbar-logo"], [1, "layout-topbar-logo-full"], ["src", "/layout/images/logo/icon.png", "alt", "DIGI-CREDIT Icon", 1, "logo-icon"], ["width", "140", "height", "32", "viewBox", "0 0 140 32", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 1, "logo-text"], ["d", "M5 8 L5 24 L12 24 C15 24 17 22 17 16 C17 10 15 8 12 8 L5 8 Z M7 10 L11 10 C13 10 15 11 15 16 C15 21 13 22 11 22 L7 22 L7 10 Z", "fill", "var(--topbar-item-text-color)"], ["d", "M22 8 L22 24 L24 24 L24 8 L22 8 Z", "fill", "var(--topbar-item-text-color)"], ["d", "M30 8 C27 8 25 10 25 16 C25 22 27 24 30 24 C32 24 34 23 34 21 L34 18 L31 18 L31 20 L32 20 C32 21 31 22 30 22 C28 22 27 21 27 16 C27 11 28 10 30 10 C31 10 32 11 32 12 L34 12 C34 9 32 8 30 8 Z", "fill", "var(--topbar-item-text-color)"], ["d", "M39 8 L39 24 L41 24 L41 8 L39 8 Z", "fill", "var(--topbar-item-text-color)"], ["d", "M46 15 L52 15 L52 17 L46 17 L46 15 Z", "fill", "var(--topbar-item-text-color)"], ["d", "M58 8 C55 8 53 10 53 16 C53 22 55 24 58 24 C60 24 62 23 62 21 L60 21 C60 22 59 22 58 22 C56 22 55 21 55 16 C55 11 56 10 58 10 C59 10 60 10 60 11 L62 11 C62 9 60 8 58 8 Z", "fill", "var(--topbar-item-text-color)"], ["d", "M67 8 L67 24 L69 24 L69 17 L72 17 L75 24 L77 24 L74 16 C75.5 15.5 76 14 76 12 C76 9 74 8 72 8 L67 8 Z M69 10 L71 10 C73 10 74 10.5 74 12 C74 13.5 73 14 71 14 L69 14 L69 10 Z", "fill", "var(--topbar-item-text-color)"], ["d", "M83 8 C80 8 78 10 78 16 C78 22 80 24 83 24 C85 24 87 23 87 21 L87 18 L84 18 L84 20 L85 20 C85 21 84 22 83 22 C81 22 80 21 80 16 C80 11 81 10 83 10 C84 10 85 11 85 12 L87 12 C87 9 85 8 83 8 Z", "fill", "var(--topbar-item-text-color)"], [1, "layout-topbar-logo-slim"], ["src", "/layout/images/logo/icon.png", "alt", "DIGI-CREDIT", 1, "logo-icon-mobile"], [1, "layout-menu-button", 3, "click"], [1, "pi", "pi-chevron-right"], [1, "app-config-button", "app-config-mobile-button", 3, "click"], [1, "pi", "pi-cog"], [1, "layout-topbar-mobile-button", 3, "click"], [1, "pi", "pi-ellipsis-v"], [1, "layout-topbar-end"], [1, "layout-topbar-actions-start"], [1, "layout-topbar-actions-end"], [1, "layout-topbar-items"], [1, "layout-topbar-search"], ["pStyleClass", "@next", "enterFromClass", "!hidden", "enterActiveClass", "animate-scalein", "leaveToClass", "!hidden", "leaveActiveClass", "animate-fadeout", 3, "click", "hideOnOutsideClick"], [1, "pi", "pi-search"], [1, "layout-search-panel", "!hidden", "p-input-filled"], ["type", "text", "pInputText", "", "placeholder", "Search"], ["pButton", "", "pRipple", "", "type", "button", "icon", "pi pi-times", "rounded", "", "text", "", "pStyleClass", ".layout-search-panel", "leaveToClass", "!hidden", "leaveActiveClass", "animate-fadeout"], [1, "app-config-button", 3, "click"], ["pStyleClass", "@next", "enterFromClass", "hidden", "enterActiveClass", "animate-scalein", "leaveToClass", "hidden", "leaveActiveClass", "animate-fadeout", 3, "hideOnOutsideClick"], [1, "pi", "pi-table"], [1, "w-8", "h-8", 3, "src", "alt"], [1, "hidden"], [1, "list-none", "p-0", "m-0"], ["pRipple", "", 1, "cursor-pointer", "flex", "items-center", "hover:bg-emphasis", "duration-150", "transition-all", "px-4", "py-2", 3, "click"], [1, "pi", "pi-power-off", "mr-2"], [3, "click"], [1, "pi", "pi-arrow-left"], ["severity", "warn", 3, "value"], [1, "pi", "pi-bell", "!align-middle"], [1, "notification-dropdown"], [1, "notification-dropdown", 3, "clickOutside"], [1, "notification-header", "px-4", "py-3", "border-b", "border-surface"], [1, "font-semibold"], [1, "text-primary"], [1, "list-none", "p-0", "m-0", "notification-list"], [1, "notification-item", "p-3", "hover:bg-emphasis", "cursor-pointer", "transition-colors", "duration-150", "border-b", "border-surface"], [1, "p-3", "text-center", "text-muted-color", "text-sm"], [1, "notification-footer", "p-3", "border-t", "border-surface", "bg-surface-ground"], ["label", "Voir toutes les demandes", "icon", "pi pi-external-link", "styleClass", "w-full", "severity", "secondary", 3, "onClick", "outlined"], [1, "notification-item", "p-3", "hover:bg-emphasis", "cursor-pointer", "transition-colors", "duration-150", "border-b", "border-surface", 3, "click"], [1, "flex", "items-center", "gap-3"], [1, "flex-shrink-0", "w-10", "h-10", "rounded-full", "bg-primary/10", "flex", "items-center", "justify-center"], [1, "pi", "pi-user", "text-primary"], [1, "flex", "flex-col", "flex-1", "min-w-0"], [1, "font-semibold", "text-sm", "truncate"], [1, "text-muted-color", "text-xs"], [1, "pi", "pi-chevron-right", "text-muted-color", "text-xs"], [1, "pi", "pi-info-circle", "mr-1"], ["pRipple", "", 1, "cursor-pointer", "flex", "items-center", "hover:bg-emphasis", "duration-150", "transition-all", "px-4", "py-2"], [1, "pi", "pi-cog", "mr-2"], [1, "pi", "pi-file-o", "mr-2"], [1, "pi", "pi-compass", "mr-2"]], template: function AppTopbar_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 3)(1, "a", 4)(2, "div", 5);
      \u0275\u0275element(3, "img", 6);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(4, "svg", 7);
      \u0275\u0275element(5, "path", 8)(6, "path", 9)(7, "path", 10)(8, "path", 11)(9, "path", 12)(10, "path", 13)(11, "path", 14)(12, "path", 15);
      \u0275\u0275elementEnd()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(13, "div", 16);
      \u0275\u0275element(14, "img", 17);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(15, "a", 18, 0);
      \u0275\u0275listener("click", function AppTopbar_Template_a_click_15_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onMenuButtonClick());
      });
      \u0275\u0275element(17, "i", 19);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "button", 20);
      \u0275\u0275listener("click", function AppTopbar_Template_button_click_18_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.toggleConfigSidebar());
      });
      \u0275\u0275element(19, "i", 21);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "a", 22, 1);
      \u0275\u0275listener("click", function AppTopbar_Template_a_click_20_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onTopbarMenuToggle());
      });
      \u0275\u0275element(22, "i", 23);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(23, "div", 24);
      \u0275\u0275element(24, "div", 25);
      \u0275\u0275elementStart(25, "div", 26)(26, "ul", 27)(27, "li", 28)(28, "a", 29);
      \u0275\u0275listener("click", function AppTopbar_Template_a_click_28_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.focusSearchInput());
      });
      \u0275\u0275element(29, "i", 30);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "div", 31);
      \u0275\u0275element(31, "i", 30)(32, "input", 32, 2)(34, "button", 33);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(35, "li")(36, "button", 34);
      \u0275\u0275listener("click", function AppTopbar_Template_button_click_36_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.toggleConfigSidebar());
      });
      \u0275\u0275element(37, "i", 21);
      \u0275\u0275elementEnd()();
      \u0275\u0275template(38, AppTopbar_Conditional_38_Template, 2, 1);
      \u0275\u0275elementStart(39, "li")(40, "a", 35);
      \u0275\u0275element(41, "i", 36);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(42, "li")(43, "a", 35);
      \u0275\u0275element(44, "img", 37);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(45, "div", 38)(46, "ul", 39);
      \u0275\u0275template(47, AppTopbar_Conditional_47_Template, 15, 0);
      \u0275\u0275elementStart(48, "li")(49, "a", 40);
      \u0275\u0275listener("click", function AppTopbar_Template_a_click_49_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.logout());
      });
      \u0275\u0275element(50, "i", 41);
      \u0275\u0275elementStart(51, "span");
      \u0275\u0275text(52, "Logout");
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275elementStart(53, "li")(54, "a", 42);
      \u0275\u0275listener("click", function AppTopbar_Template_a_click_54_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onRightMenuButtonClick());
      });
      \u0275\u0275element(55, "i", 43);
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(28);
      \u0275\u0275property("hideOnOutsideClick", true);
      \u0275\u0275advance(10);
      \u0275\u0275conditional((ctx.user == null ? null : ctx.user.role) === "DA" ? 38 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275property("hideOnOutsideClick", true);
      \u0275\u0275advance(3);
      \u0275\u0275property("hideOnOutsideClick", true);
      \u0275\u0275advance();
      \u0275\u0275property("src", ctx.user == null ? null : ctx.user.imageUrl, \u0275\u0275sanitizeUrl)("alt", ctx.user == null ? null : ctx.user.firstName);
      \u0275\u0275advance(3);
      \u0275\u0275conditional((ctx.user == null ? null : ctx.user.role) === "SUPER_ADMIN" ? 47 : -1);
    }
  }, dependencies: [RouterModule, RouterLink, CommonModule, DatePipe, StyleClassModule, StyleClass, FormsModule, Ripple, InputText, ButtonModule, ButtonDirective, Button, MegaMenuModule, BadgeModule, OverlayBadge], styles: ["\n\n[_nghost-%COMP%]     .p-overlaybadge .p-badge {\n  outline-width: 0px;\n}\n.layout-topbar-logo[_ngcontent-%COMP%] {\n  display: inline-block;\n  text-decoration: none;\n  transition: all 0.3s ease;\n  padding: 8px;\n  border-radius: 8px;\n}\n.layout-topbar-logo[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);\n}\n.layout-topbar-logo-full[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.logo-icon[_ngcontent-%COMP%] {\n  height: 32px;\n  width: auto;\n  object-fit: contain;\n  transition: all 0.3s ease;\n}\n.logo-text[_ngcontent-%COMP%] {\n  height: 32px;\n  transition: all 0.3s ease;\n}\n.layout-topbar-logo-slim[_ngcontent-%COMP%] {\n  display: none;\n}\n.logo-icon-mobile[_ngcontent-%COMP%] {\n  height: 28px;\n  width: auto;\n  object-fit: contain;\n  transition: all 0.3s ease;\n}\n.layout-topbar-logo[_ngcontent-%COMP%]:hover   .logo-icon[_ngcontent-%COMP%], \n.layout-topbar-logo[_ngcontent-%COMP%]:hover   .logo-icon-mobile[_ngcontent-%COMP%] {\n  transform: scale(1.05);\n  opacity: 0.9;\n}\n.layout-topbar-logo[_ngcontent-%COMP%]:hover   .logo-text[_ngcontent-%COMP%]   path[_ngcontent-%COMP%] {\n  opacity: 0.9;\n}\n@media (max-width: 768px) {\n  .layout-topbar-logo-full[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .layout-topbar-logo-slim[_ngcontent-%COMP%] {\n    display: block;\n  }\n}\n.layout-topbar-logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%], \n.layout-topbar-logo[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  vertical-align: middle;\n}\n.notification-dropdown[_ngcontent-%COMP%] {\n  width: 360px;\n  max-width: 90vw;\n  display: flex;\n  flex-direction: column;\n  border-radius: 8px;\n  overflow: hidden;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);\n}\n.notification-header[_ngcontent-%COMP%] {\n  background: var(--surface-ground);\n  flex-shrink: 0;\n}\n.notification-list[_ngcontent-%COMP%] {\n  max-height: 320px;\n  overflow-y: auto;\n  flex: 1;\n}\n.notification-list[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 6px;\n}\n.notification-list[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: var(--surface-ground);\n}\n.notification-list[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: var(--surface-400);\n  border-radius: 3px;\n}\n.notification-list[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {\n  background: var(--surface-500);\n}\n.notification-footer[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n}\n.notification-item[_ngcontent-%COMP%]:last-of-type {\n  border-bottom: none;\n}\n@media (max-width: 480px) {\n  .notification-dropdown[_ngcontent-%COMP%] {\n    width: 300px;\n  }\n  .notification-list[_ngcontent-%COMP%] {\n    max-height: 250px;\n  }\n}\n.notification-dropdown[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 100%;\n  right: 0;\n  width: 360px;\n  max-width: 90vw;\n  display: flex;\n  flex-direction: column;\n  border-radius: 8px;\n  overflow: hidden;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);\n  background: var(--surface-overlay);\n  z-index: 1000;\n  animation: _ngcontent-%COMP%_scaleIn 0.12s ease-out;\n}\n@keyframes _ngcontent-%COMP%_scaleIn {\n  from {\n    opacity: 0;\n    transform: scale(0.95);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n.notification-header[_ngcontent-%COMP%] {\n  background: var(--surface-ground);\n  flex-shrink: 0;\n}\n.notification-list[_ngcontent-%COMP%] {\n  max-height: 320px;\n  overflow-y: auto;\n  flex: 1;\n}\n.notification-list[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 6px;\n}\n.notification-list[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: var(--surface-ground);\n}\n.notification-list[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: var(--surface-400);\n  border-radius: 3px;\n}\n.notification-list[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {\n  background: var(--surface-500);\n}\n.notification-footer[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n}\n.notification-item[_ngcontent-%COMP%]:last-of-type {\n  border-bottom: none;\n}\n@media (max-width: 480px) {\n  .notification-dropdown[_ngcontent-%COMP%] {\n    width: 300px;\n  }\n  .notification-list[_ngcontent-%COMP%] {\n    max-height: 250px;\n  }\n}\n/*# sourceMappingURL=app.topbar.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppTopbar, { className: "AppTopbar", filePath: "src/app/layout/components/app.topbar.ts", lineNumber: 426 });
})();

// src/app/layout/components/app.footer.ts
var _c02 = ["app-footer", ""];
var AppFooter = class _AppFooter {
  layoutService = inject(LayoutService);
  currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  static \u0275fac = function AppFooter_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppFooter)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppFooter, selectors: [["", "app-footer", ""]], hostAttrs: [1, "layout-footer"], attrs: _c02, decls: 7, vars: 1, consts: [[1, "footer-bottom"], [1, "footer-copyright"], [1, "text-muted-color"], [1, "footer-version"], [1, "text-muted-color", "text-sm"]], template: function AppFooter_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "span", 2);
      \u0275\u0275text(3);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(4, "div", 3)(5, "span", 4);
      \u0275\u0275text(6, " Version 1.0.0 ");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1(" \xA9 ", ctx.currentYear, " DIGI-CREDIT. Tous droits r\xE9serv\xE9s. ");
    }
  }, dependencies: [ButtonModule], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  margin-top: auto;\n}\n.footer-bottom[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 1rem 2rem;\n  background: white;\n  border-top: 1px solid var(--surface-border);\n  max-width: 100%;\n}\n.footer-copyright[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n}\n.footer-version[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n}\n@media (max-width: 768px) {\n  .footer-bottom[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 0.5rem;\n    text-align: center;\n    padding: 1rem;\n  }\n}\n.dark[_nghost-%COMP%]   .footer-bottom[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .footer-bottom[_ngcontent-%COMP%] {\n  background: white;\n  color: #6b7280;\n}\n.dark[_nghost-%COMP%]   .footer-bottom[_ngcontent-%COMP%]   .text-muted-color[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .footer-bottom[_ngcontent-%COMP%]   .text-muted-color[_ngcontent-%COMP%] {\n  color: #6b7280 !important;\n}\n/*# sourceMappingURL=app.footer.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppFooter, { className: "AppFooter", filePath: "src/app/layout/components/app.footer.ts", lineNumber: 67 });
})();

// src/app/layout/components/app.breadcrumb.ts
var _c03 = ["app-breadcrumb", ""];
function AppBreadcrumb_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275element(1, "i", 7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "li")(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r1 = ctx.$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(item_r1.label);
  }
}
var AppBreadcrumb = class _AppBreadcrumb {
  router;
  _breadcrumbs$ = new BehaviorSubject([]);
  breadcrumbs$ = this._breadcrumbs$.asObservable();
  constructor(router) {
    this.router = router;
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      const root = this.router.routerState.snapshot.root;
      const breadcrumbs = [];
      this.addBreadcrumb(root, [], breadcrumbs);
      this._breadcrumbs$.next(breadcrumbs);
    });
  }
  addBreadcrumb(route, parentUrl, breadcrumbs) {
    const routeUrl = parentUrl.concat(route.url.map((url) => url.path));
    const breadcrumb = route.data["breadcrumb"];
    const parentBreadcrumb = route.parent && route.parent.data ? route.parent.data["breadcrumb"] : null;
    if (breadcrumb && breadcrumb !== parentBreadcrumb) {
      breadcrumbs.push({
        label: route.data["breadcrumb"],
        url: "/" + routeUrl.join("/")
      });
    }
    if (route.firstChild) {
      this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs);
    }
  }
  static \u0275fac = function AppBreadcrumb_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppBreadcrumb)(\u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppBreadcrumb, selectors: [["", "app-breadcrumb", ""]], hostAttrs: [1, "layout-breadcrumb-container"], attrs: _c03, decls: 10, vars: 3, consts: [[1, "layout-breadcrumb"], [1, "pi", "pi-home"], ["ngFor", "", 3, "ngForOf"], [1, "layout-breadcrumb-buttons"], ["pButton", "", "pRipple", "", "type", "button", "icon", "pi pi-cloud-upload", 1, "p-button-rounded", "p-button-text", "p-button-plain"], ["pButton", "", "pRipple", "", "type", "button", "icon", "pi pi-bookmark", 1, "p-button-rounded", "p-button-text", "p-button-plain"], ["pButton", "", "pRipple", "", "type", "button", "icon", "pi pi-power-off", 1, "p-button-rounded", "p-button-text", "p-button-plain"], [1, "pi", "pi-angle-right"]], template: function AppBreadcrumb_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "nav", 0)(1, "ol")(2, "li");
      \u0275\u0275element(3, "i", 1);
      \u0275\u0275elementEnd();
      \u0275\u0275template(4, AppBreadcrumb_ng_template_4_Template, 5, 1, "ng-template", 2);
      \u0275\u0275pipe(5, "async");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 3);
      \u0275\u0275element(7, "button", 4)(8, "button", 5)(9, "button", 6);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275property("ngForOf", \u0275\u0275pipeBind1(5, 1, ctx.breadcrumbs$));
    }
  }, dependencies: [CommonModule, NgForOf, AsyncPipe, RouterModule, ButtonModule, ButtonDirective, RippleModule, Ripple], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppBreadcrumb, { className: "AppBreadcrumb", filePath: "src/app/layout/components/app.breadcrumb.ts", lineNumber: 40 });
})();

// src/app/layout/components/app.menuitem.ts
var _c04 = ["submenu"];
var _c12 = ["app-menuitem", ""];
var _c22 = () => ({ paths: "exact", queryParams: "ignored", matrixParams: "ignored", fragment: "ignored" });
function AppMenuitem_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "i", 6);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.item.label);
  }
}
function AppMenuitem_a_2_i_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 11);
  }
}
function AppMenuitem_a_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "a", 7);
    \u0275\u0275listener("click", function AppMenuitem_a_2_Template_a_click_0_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.itemClick($event));
    })("mouseenter", function AppMenuitem_a_2_Template_a_mouseenter_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onMouseEnter());
    });
    \u0275\u0275element(1, "i", 8);
    \u0275\u0275elementStart(2, "span", 9);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, AppMenuitem_a_2_i_4_Template, 1, 0, "i", 10);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", ctx_r0.item.class)("pTooltip", ctx_r0.item.label)("tooltipDisabled", !(ctx_r0.isSlim() && ctx_r0.root && !ctx_r0.active));
    \u0275\u0275attribute("href", ctx_r0.item.url, \u0275\u0275sanitizeUrl)("target", ctx_r0.item.target);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r0.item.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.item.label);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.item.items);
  }
}
function AppMenuitem_a_3_i_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 11);
  }
}
function AppMenuitem_a_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "a", 12);
    \u0275\u0275listener("click", function AppMenuitem_a_3_Template_a_click_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.itemClick($event));
    })("mouseenter", function AppMenuitem_a_3_Template_a_mouseenter_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onMouseEnter());
    });
    \u0275\u0275element(1, "i", 8);
    \u0275\u0275elementStart(2, "span", 9);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, AppMenuitem_a_3_i_4_Template, 1, 0, "i", 10);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", ctx_r0.item.class)("routerLink", ctx_r0.item.routerLink)("routerLinkActiveOptions", ctx_r0.item.routerLinkActiveOptions || \u0275\u0275pureFunction0(16, _c22))("fragment", ctx_r0.item.fragment)("queryParamsHandling", ctx_r0.item.queryParamsHandling)("preserveFragment", ctx_r0.item.preserveFragment)("skipLocationChange", ctx_r0.item.skipLocationChange)("replaceUrl", ctx_r0.item.replaceUrl)("state", ctx_r0.item.state)("queryParams", ctx_r0.item.queryParams)("pTooltip", ctx_r0.item.label)("tooltipDisabled", !(ctx_r0.isSlim() && ctx_r0.root));
    \u0275\u0275attribute("target", ctx_r0.item.target);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r0.item.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.item.label);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.item.items);
  }
}
function AppMenuitem_ul_4_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "li", 14);
  }
  if (rf & 2) {
    const child_r5 = ctx.$implicit;
    const i_r6 = ctx.index;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(child_r5["badgeClass"]);
    \u0275\u0275property("item", child_r5)("index", i_r6)("parentKey", ctx_r0.key);
  }
}
function AppMenuitem_ul_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ul", null, 0);
    \u0275\u0275listener("@children.done", function AppMenuitem_ul_4_Template_ul_animation_children_done_0_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onSubmenuAnimated($event));
    });
    \u0275\u0275template(2, AppMenuitem_ul_4_ng_template_2_Template, 1, 5, "ng-template", 13);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("@children", ctx_r0.submenuAnimation);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r0.item.items);
  }
}
var AppMenuitem = class _AppMenuitem {
  layoutService;
  router;
  item;
  index;
  root;
  parentKey;
  submenu;
  get activeClass() {
    return this.active;
  }
  active = false;
  menuSourceSubscription;
  menuResetSubscription;
  key = "";
  get submenuAnimation() {
    if (this.layoutService.isDesktop() && (this.layoutService.isHorizontal() || this.layoutService.isSlim() || this.layoutService.isSlimPlus())) {
      return this.active ? "visible" : "hidden";
    } else
      return this.root ? "expanded" : this.active ? "expanded" : "collapsed";
  }
  isSlim = computed(() => this.layoutService.isSlim());
  isSlimPlus = computed(() => this.layoutService.isSlimPlus());
  isHorizontal = computed(() => this.layoutService.isHorizontal());
  get isDesktop() {
    return this.layoutService.isDesktop();
  }
  get isMobile() {
    return this.layoutService.isMobile();
  }
  constructor(layoutService, router) {
    this.layoutService = layoutService;
    this.router = router;
    this.menuSourceSubscription = this.layoutService.menuSource$.subscribe((value) => {
      Promise.resolve(null).then(() => {
        if (value.routeEvent) {
          this.active = value.key === this.key || value.key.startsWith(this.key + "-") ? true : false;
        } else {
          if (value.key !== this.key && !value.key.startsWith(this.key + "-")) {
            this.active = false;
          }
        }
      });
    });
    this.menuResetSubscription = this.layoutService.resetSource$.subscribe(() => {
      this.active = false;
    });
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((params) => {
      if (this.isSlimPlus() || this.isSlim() || this.isHorizontal()) {
        this.active = false;
      } else {
        if (this.item.routerLink) {
          this.updateActiveStateFromRoute();
        }
      }
    });
  }
  ngOnInit() {
    this.key = this.parentKey ? this.parentKey + "-" + this.index : String(this.index);
    if (!(this.isSlimPlus() || this.isSlim() || this.isHorizontal()) && this.item.routerLink) {
      this.updateActiveStateFromRoute();
    }
  }
  ngAfterViewChecked() {
    if (this.root && this.active && this.isDesktop && (this.isHorizontal() || this.isSlim() || this.isSlimPlus())) {
      this.calculatePosition(this.submenu?.nativeElement, this.submenu?.nativeElement.parentElement);
    }
  }
  updateActiveStateFromRoute() {
    let activeRoute = this.router.isActive(this.item.routerLink[0], {
      paths: "exact",
      queryParams: "ignored",
      matrixParams: "ignored",
      fragment: "ignored"
    });
    if (activeRoute) {
      this.layoutService.onMenuStateChange({
        key: this.key,
        routeEvent: true
      });
    }
  }
  onSubmenuAnimated(event) {
    if (event.toState === "visible" && this.isDesktop && (this.isHorizontal() || this.isSlim() || this.isSlimPlus())) {
      const el = event.element;
      const elParent = el.parentElement;
      this.calculatePosition(el, elParent);
    }
  }
  calculatePosition(overlay, target) {
    if (overlay) {
      const { left, top } = target.getBoundingClientRect();
      const [vWidth, vHeight] = [window.innerWidth, window.innerHeight];
      const [oWidth, oHeight] = [overlay.offsetWidth, overlay.offsetHeight];
      const scrollbarWidth = DomHandler.calculateScrollbarWidth();
      const topbarEl = document.querySelector(".layout-topbar");
      const topbarHeight = topbarEl?.offsetHeight || 0;
      overlay.style.top = "";
      overlay.style.left = "";
      if (this.layoutService.isHorizontal()) {
        const width = left + oWidth + scrollbarWidth;
        overlay.style.left = vWidth < width ? `${left - (width - vWidth)}px` : `${left}px`;
      } else if (this.layoutService.isSlim() || this.layoutService.isSlimPlus()) {
        const topOffset = top - topbarHeight;
        const height = topOffset + oHeight + topbarHeight;
        overlay.style.top = vHeight < height ? `${topOffset - (height - vHeight)}px` : `${topOffset}px`;
      }
    }
  }
  itemClick(event) {
    if (this.item.disabled) {
      event.preventDefault();
      return;
    }
    if (this.root && this.isSlim() || this.isHorizontal() || this.isSlimPlus()) {
      this.layoutService.layoutState.update((val) => __spreadProps(__spreadValues({}, val), {
        menuHoverActive: !val.menuHoverActive
      }));
    }
    if (this.item.command) {
      this.item.command({ originalEvent: event, item: this.item });
    }
    if (this.item.items) {
      this.active = !this.active;
      if (this.root && this.active && (this.isSlim() || this.isHorizontal() || this.isSlimPlus())) {
        this.layoutService.onOverlaySubmenuOpen();
      }
    } else {
      if (this.layoutService.isMobile()) {
        this.layoutService.layoutState.update((val) => __spreadProps(__spreadValues({}, val), {
          staticMenuMobileActive: false
        }));
      }
      if (this.isSlim() || this.isHorizontal() || this.isSlimPlus()) {
        this.layoutService.reset();
        this.layoutService.layoutState.update((val) => __spreadProps(__spreadValues({}, val), {
          menuHoverActive: false
        }));
      }
    }
    this.layoutService.onMenuStateChange({ key: this.key });
  }
  onMouseEnter() {
    if (this.root && (this.isSlim() || this.isHorizontal() || this.isSlimPlus()) && this.layoutService.isDesktop()) {
      if (this.layoutService.layoutState().menuHoverActive) {
        this.active = true;
        this.layoutService.onMenuStateChange({ key: this.key });
      }
    }
  }
  ngOnDestroy() {
    if (this.menuSourceSubscription) {
      this.menuSourceSubscription.unsubscribe();
    }
    if (this.menuResetSubscription) {
      this.menuResetSubscription.unsubscribe();
    }
  }
  static \u0275fac = function AppMenuitem_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppMenuitem)(\u0275\u0275directiveInject(LayoutService), \u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppMenuitem, selectors: [["", "app-menuitem", ""]], viewQuery: function AppMenuitem_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c04, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.submenu = _t.first);
    }
  }, hostVars: 4, hostBindings: function AppMenuitem_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275classProp("layout-root-menuitem", ctx.root)("active-menuitem", ctx.activeClass);
    }
  }, inputs: { item: "item", index: "index", root: "root", parentKey: "parentKey" }, attrs: _c12, decls: 5, vars: 4, consts: [["submenu", ""], ["class", "layout-menuitem-root-text", 4, "ngIf"], ["tabindex", "0", "pRipple", "", 3, "ngClass", "pTooltip", "tooltipDisabled", "click", "mouseenter", 4, "ngIf"], ["routerLinkActive", "active-route", "tabindex", "0", "pRipple", "", 3, "ngClass", "routerLink", "routerLinkActiveOptions", "fragment", "queryParamsHandling", "preserveFragment", "skipLocationChange", "replaceUrl", "state", "queryParams", "pTooltip", "tooltipDisabled", "click", "mouseenter", 4, "ngIf"], [4, "ngIf"], [1, "layout-menuitem-root-text"], [1, "layout-menuitem-root-icon", "pi", "pi-fw", "pi-ellipsis-h"], ["tabindex", "0", "pRipple", "", 3, "click", "mouseenter", "ngClass", "pTooltip", "tooltipDisabled"], [1, "layout-menuitem-icon", 3, "ngClass"], [1, "layout-menuitem-text"], ["class", "pi pi-fw pi-angle-down layout-submenu-toggler", 4, "ngIf"], [1, "pi", "pi-fw", "pi-angle-down", "layout-submenu-toggler"], ["routerLinkActive", "active-route", "tabindex", "0", "pRipple", "", 3, "click", "mouseenter", "ngClass", "routerLink", "routerLinkActiveOptions", "fragment", "queryParamsHandling", "preserveFragment", "skipLocationChange", "replaceUrl", "state", "queryParams", "pTooltip", "tooltipDisabled"], ["ngFor", "", 3, "ngForOf"], ["app-menuitem", "", 3, "item", "index", "parentKey"]], template: function AppMenuitem_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementContainerStart(0);
      \u0275\u0275template(1, AppMenuitem_div_1_Template, 4, 1, "div", 1)(2, AppMenuitem_a_2_Template, 5, 8, "a", 2)(3, AppMenuitem_a_3_Template, 5, 17, "a", 3)(4, AppMenuitem_ul_4_Template, 3, 2, "ul", 4);
      \u0275\u0275elementContainerEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.root && ctx.item.visible !== false);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", (!ctx.item.routerLink || ctx.item.items) && ctx.item.visible !== false);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.item.routerLink && !ctx.item.items && ctx.item.visible !== false);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.item.items && ctx.item.visible !== false);
    }
  }, dependencies: [_AppMenuitem, CommonModule, NgClass, NgForOf, NgIf, RouterModule, RouterLink, RouterLinkActive, RippleModule, Ripple, TooltipModule, Tooltip], encapsulation: 2, data: { animation: [
    trigger("children", [
      state("collapsed", style({
        height: "0"
      })),
      state("expanded", style({
        height: "*"
      })),
      state("hidden", style({
        display: "none"
      })),
      state("visible", style({
        display: "block"
      })),
      transition("collapsed <=> expanded", animate("400ms cubic-bezier(0.86, 0, 0.07, 1)"))
    ])
  ] } });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppMenuitem, { className: "AppMenuitem", filePath: "src/app/layout/components/app.menuitem.ts", lineNumber: 108 });
})();

// src/app/layout/components/app.menu.ts
var _c05 = ["menuContainer"];
function AppMenu_ng_container_2_li_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "li", 5);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    const item_r2 = ctx_r0.$implicit;
    const i_r3 = ctx_r0.index;
    \u0275\u0275property("item", item_r2)("index", i_r3)("root", true);
  }
}
function AppMenu_ng_container_2_li_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "li", 6);
  }
}
function AppMenu_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, AppMenu_ng_container_2_li_1_Template, 1, 3, "li", 3)(2, AppMenu_ng_container_2_li_2_Template, 1, 0, "li", 4);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const item_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !item_r2.separator);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", item_r2.separator);
  }
}
var AppMenu = class _AppMenu {
  user;
  el = inject(ElementRef);
  menuContainer;
  model = [];
  ngOnInit() {
    this.initializeMenu();
  }
  initializeMenu() {
    this.model = [
      {
        label: "Tableau de Bord",
        icon: "pi pi-home",
        items: [
          {
            label: "Tableau de Bord",
            icon: "pi pi-fw pi-chart-pie",
            routerLink: ["/dashboards/"]
          },
          ...this.user?.role === "AGENT_CREDIT" ? [
            //   {
            //       label: 'Analyse de Credit',
            //       icon: 'pi pi-fw pi-hourglass',
            //       routerLink: ['/dashboards/credit', this.user?.userId]
            //   },
            //   {
            //       label: 'Membre',
            //       icon: 'pi pi-th-large',
            //       items: [
            //           {
            //               label: 'adhesion',
            //               icon: 'pi pi-fw pi-user',
            //               items: [
            //                   {
            //                       label: 'Personne Physique',
            //                       icon: 'pi pi-fw pi-user',
            //                       routerLink: ['/membre/adhesion/pphysique']
            //                   },
            //                   {
            //                       label: 'Personne Morale',
            //                       icon: 'pi pi-fw pi-user',
            //                       routerLink: ['/membre/adhesion/pmorale']
            //                   }
            //               ]
            //           },
            //           {
            //               label: 'Compte',
            //               icon: 'pi pi-fw pi-user',
            //               items: [
            //                   {
            //                       label: 'Personne Physique',
            //                       icon: 'pi pi-fw pi-inbox',
            //                       routerLink: ['/membre/compte/cphysique']
            //                   },
            //                   {
            //                       label: 'Personne Morale',
            //                       icon: 'pi pi-fw pi-user',
            //                       routerLink: ['/membre/compte/cmorale']
            //                   }
            //               ]
            //           },
            //           {
            //               label: 'Liaison Compte',
            //               icon: 'pi pi-fw pi-check-square',
            //               routerLink: ['/membre/liaison']
            //           }
            //       ]
            //   },
            {
              label: "Gestion stock",
              icon: "pi pi-fw pi-hourglass",
              routerLink: ["/dashboards/stock"]
            },
            // Correction P. Physique - Uniquement si l'utilisateur est autorisé
            ...this.user?.authorized ? [
              {
                label: "Correction P. Physique ",
                icon: "pi pi-fw pi-user-edit",
                routerLink: ["/dashboards/correction-physique"]
              }
            ] : [],
            {
              label: "Correction En attente",
              icon: "pi pi-fw pi-hourglass",
              routerLink: ["/dashboards/correction-en-attente"]
            },
            {
              label: "Mes avances de salaire",
              icon: "pi pi-fw pi-list",
              routerLink: ["/dashboards/mes-demandes-salaire"]
            }
          ] : this.user?.role === "SUPER_ADMIN" ? [
            {
              label: "Configuration Reseau",
              icon: "pi pi-fw pi-cog",
              routerLink: ["/dashboards/config"]
            }
          ] : this.user?.role === "CAISSE" ? [
            //   {
            //       label: 'Configuration Reseau',
            //       icon: 'pi pi-fw pi-cog',
            //       routerLink: ['/dashboards/config']
            //   }
          ] : this.user?.role === "MANAGER" ? this.user?.service === "DSIG" ? [
            {
              label: "document-verification",
              icon: "pi pi-fw pi-folder",
              routerLink: ["/dashboards/document-verification"]
            }
          ] : this.user?.service === "DE" ? [
            {
              label: "Situation Stock",
              icon: "pi pi-fw pi-box",
              routerLink: ["/dashboards/situation-stock"]
            },
            {
              label: "Mes avances de salaire",
              icon: "pi pi-fw pi-list",
              routerLink: ["/dashboards/mes-demandes-salaire"]
            },
            {
              label: "suivi des Arrete de caisse",
              icon: "pi pi-fw pi-mo",
              routerLink: ["/dashboards/suivi-arrete-caisse"]
            }
          ] : this.user?.service === "Logistique" ? [] : this.user?.service === "Societariat" ? [] : this.user?.service === "DRH" ? [
            {
              label: "Gestion Personnel",
              icon: "pi pi-fw pi-hourglass",
              routerLink: ["/dashboards/gestion-personnel"]
            },
            {
              label: "Mes avances de salaire",
              icon: "pi pi-fw pi-list",
              routerLink: ["/dashboards/mes-demandes-salaire"]
            }
          ] : this.user?.service === "DF" ? [
            {
              label: "Confirmation Avances (DF)",
              icon: "pi pi-fw pi-building",
              routerLink: ["/dashboards"]
            },
            {
              label: "Mes avances de salaire",
              icon: "pi pi-fw pi-list",
              routerLink: ["/dashboards/mes-demandes-salaire"]
            }
          ] : [] : this.user?.role === "DF" || this.user?.service === "DF" ? [
            {
              label: "Confirmation Avances (DF)",
              icon: "pi pi-fw pi-building",
              routerLink: ["/dashboards/admin/df"]
            },
            {
              label: "Mes avances de salaire",
              icon: "pi pi-fw pi-list",
              routerLink: ["/dashboards/mes-demandes-salaire"]
            }
          ] : this.user?.role === "AGENT_CORRECTEUR" ? [
            {
              label: "Correction P. Physique",
              icon: "pi pi-fw pi-hourglass",
              routerLink: ["/dashboards/correction-physique"]
            }
          ] : this.user?.role === "DR" ? [
            {
              label: "Suivi Societariat",
              icon: "pi pi-fw pi-hourglass",
              routerLink: ["/dashboards/suivi-societariat"]
            },
            {
              label: "Mes avances de salaire",
              icon: "pi pi-fw pi-list",
              routerLink: ["/dashboards/mes-demandes-salaire"]
            }
          ] : this.user?.role === "USER" && this.user?.service === "Personnel" ? [
            {
              label: "Demande Avance Salaire",
              icon: "pi pi-fw pi-wallet",
              routerLink: ["/dashboards/demande-avance-salaire"]
            },
            {
              label: "Mes Demandes",
              icon: "pi pi-fw pi-list",
              routerLink: ["/dashboards/mes-demandes-salaire"]
            }
          ] : this.user?.role === "RA" ? [
            {
              label: "Mes avances de salaire",
              icon: "pi pi-fw pi-list",
              routerLink: ["/dashboards/mes-demandes-salaire"]
            },
            {
              label: "Suivi Societariat",
              icon: "pi pi-fw pi-hourglass",
              routerLink: ["/dashboards/suivi-societariat"]
            },
            {
              label: "suivi des Arrete de caisse",
              icon: "pi pi-fw pi-money-bill",
              routerLink: ["/dashboards/suivi-arrete-caisse"]
            }
          ] : this.user?.role === "DA" ? [
            {
              label: "Mes avances de salaire",
              icon: "pi pi-fw pi-list",
              routerLink: ["/dashboards/mes-demandes-salaire"]
            },
            {
              label: "Suivi Societariat",
              icon: "pi pi-fw pi-hourglass",
              routerLink: ["/dashboards/suivi-societariat"]
            },
            {
              label: "suivi des Arrete de caisse",
              icon: "pi pi-fw pi-money-bill",
              routerLink: ["/dashboards/suivi-arrete-caisse"]
            }
          ] : []
        ]
      }
    ];
  }
  ngOnChanges(changes) {
    if (changes["user"]) {
      this.initializeMenu();
    }
  }
  static \u0275fac = function AppMenu_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppMenu)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppMenu, selectors: [["app-menu"], ["", "app-menu", ""]], viewQuery: function AppMenu_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c05, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.menuContainer = _t.first);
    }
  }, inputs: { user: "user" }, features: [\u0275\u0275NgOnChangesFeature], decls: 3, vars: 1, consts: [["menuContainer", ""], [1, "layout-menu"], [4, "ngFor", "ngForOf"], ["app-menuitem", "", 3, "item", "index", "root", 4, "ngIf"], ["class", "menu-separator", 4, "ngIf"], ["app-menuitem", "", 3, "item", "index", "root"], [1, "menu-separator"]], template: function AppMenu_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "ul", 1, 0);
      \u0275\u0275template(2, AppMenu_ng_container_2_Template, 3, 2, "ng-container", 2);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275property("ngForOf", ctx.model);
    }
  }, dependencies: [CommonModule, NgForOf, NgIf, AppMenuitem, RouterModule], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppMenu, { className: "AppMenu", filePath: "src/app/layout/components/app.menu.ts", lineNumber: 19 });
})();

// src/app/layout/components/app.menuprofile.ts
var _c06 = ["app-menu-profile", ""];
var _c13 = (a0, a1) => ({ "pi-angle-down": a0, "pi-angle-up": a1 });
var _c23 = () => ["/profile/create"];
var _c32 = () => ["/documentation"];
function AppMenuProfile_ul_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ul")(1, "li", 5)(2, "button", 6);
    \u0275\u0275element(3, "i", 7);
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5, "Settings");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(6, "li", 8)(7, "button", 6);
    \u0275\u0275element(8, "i", 9);
    \u0275\u0275elementStart(9, "span");
    \u0275\u0275text(10, "Profile");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "li", 10)(12, "button", 6);
    \u0275\u0275element(13, "i", 11);
    \u0275\u0275elementStart(14, "span");
    \u0275\u0275text(15, "Support");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(16, "li", 12);
    \u0275\u0275listener("click", function AppMenuProfile_ul_7_Template_li_click_16_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.logout());
    });
    \u0275\u0275elementStart(17, "button", 13);
    \u0275\u0275element(18, "i", 14);
    \u0275\u0275elementStart(19, "span");
    \u0275\u0275text(20, "Logout");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("@menu", ctx_r1.isHorizontal() ? "overlay" : "inline");
    \u0275\u0275advance();
    \u0275\u0275property("tooltipDisabled", ctx_r1.isTooltipDisabled())("routerLink", \u0275\u0275pureFunction0(9, _c23));
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(10, _c32));
    \u0275\u0275advance(4);
    \u0275\u0275property("tooltipDisabled", ctx_r1.isTooltipDisabled());
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(11, _c32));
    \u0275\u0275advance(4);
    \u0275\u0275property("tooltipDisabled", ctx_r1.isTooltipDisabled());
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(12, _c32));
    \u0275\u0275advance(4);
    \u0275\u0275property("tooltipDisabled", ctx_r1.isTooltipDisabled());
  }
}
var AppMenuProfile = class _AppMenuProfile {
  user;
  userService = inject(UserService);
  router = inject(Router);
  layoutService = inject(LayoutService);
  renderer = inject(Renderer2);
  el = inject(ElementRef);
  isHorizontal = computed(() => this.layoutService.isHorizontal() && this.layoutService.isDesktop());
  menuProfileActive = computed(() => this.layoutService.layoutState().menuProfileActive);
  menuProfilePosition = computed(() => this.layoutService.layoutConfig().menuProfilePosition);
  isTooltipDisabled = computed(() => !this.layoutService.isSlim());
  subscription;
  outsideClickListener;
  constructor() {
    this.subscription = this.layoutService.overlayOpen$.subscribe(() => {
      if (this.isHorizontal() && this.menuProfileActive()) {
        this.layoutService.layoutState.update((value) => __spreadProps(__spreadValues({}, value), { menuProfileActive: false }));
      }
    });
    effect(() => {
      if (this.isHorizontal() && this.menuProfileActive() && !this.outsideClickListener) {
        this.bindOutsideClickListener();
      }
      if (!this.menuProfileActive() && this.isHorizontal()) {
        this.unbindOutsideClickListener();
      }
    });
  }
  bindOutsideClickListener() {
    if (this.isHorizontal()) {
      this.outsideClickListener = this.renderer.listen(document, "click", (event) => {
        if (this.menuProfileActive()) {
          const isOutsideClicked = !(this.el.nativeElement.isSameNode(event.target) || this.el.nativeElement.contains(event.target));
          if (isOutsideClicked) {
            this.layoutService.layoutState.update((value) => __spreadProps(__spreadValues({}, value), { menuProfileActive: false }));
          }
        }
      });
    }
  }
  unbindOutsideClickListener() {
    if (this.outsideClickListener) {
      this.outsideClickListener();
      this.outsideClickListener = null;
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.unbindOutsideClickListener();
  }
  toggleMenu() {
    this.layoutService.onMenuProfileToggle();
  }
  logout() {
    this.userService.logOut();
    this.router.navigate([``]);
  }
  static \u0275fac = function AppMenuProfile_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppMenuProfile)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppMenuProfile, selectors: [["", "app-menu-profile", ""]], hostAttrs: [1, "layout-menu-profile"], inputs: { user: "user" }, attrs: _c06, decls: 8, vars: 9, consts: [["pTooltip", "Profile", 3, "click", "tooltipDisabled"], ["alt", "avatar", 2, "width", "32px", "height", "32px", 3, "src"], [1, "text-start"], [1, "layout-menu-profile-toggler", "pi", "pi-fw", 3, "ngClass"], [4, "ngIf"], ["pTooltip", "Settings", 3, "tooltipDisabled", "routerLink"], [3, "routerLink"], [1, "pi", "pi-cog", "pi-fw"], ["pTooltip", "Profile", 3, "tooltipDisabled"], [1, "pi", "pi-file-o", "pi-fw"], ["pTooltip", "Support", 3, "tooltipDisabled"], [1, "pi", "pi-compass", "pi-fw"], ["pTooltip", "Logout", 3, "click", "tooltipDisabled"], [1, "p-link"], [1, "pi", "pi-power-off", "pi-fw"]], template: function AppMenuProfile_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "button", 0);
      \u0275\u0275listener("click", function AppMenuProfile_Template_button_click_0_listener() {
        return ctx.toggleMenu();
      });
      \u0275\u0275element(1, "img", 1);
      \u0275\u0275elementStart(2, "span", 2)(3, "strong");
      \u0275\u0275text(4);
      \u0275\u0275elementEnd();
      \u0275\u0275element(5, "small");
      \u0275\u0275elementEnd();
      \u0275\u0275element(6, "i", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275template(7, AppMenuProfile_ul_7_Template, 21, 13, "ul", 4);
    }
    if (rf & 2) {
      \u0275\u0275property("tooltipDisabled", ctx.isTooltipDisabled());
      \u0275\u0275advance();
      \u0275\u0275property("src", ctx.user == null ? null : ctx.user.imageUrl, \u0275\u0275sanitizeUrl);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate2("", ctx.user == null ? null : ctx.user.lastName, " ", ctx.user == null ? null : ctx.user.firstName, " ");
      \u0275\u0275advance(2);
      \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(6, _c13, ctx.menuProfilePosition() === "start" || ctx.isHorizontal(), ctx.menuProfilePosition() === "end" && !ctx.isHorizontal()));
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.menuProfileActive());
    }
  }, dependencies: [CommonModule, NgClass, NgIf, TooltipModule, Tooltip, ButtonModule, RouterModule, RouterLink], encapsulation: 2, data: { animation: [
    trigger("menu", [
      transition("void => inline", [style({ height: 0 }), animate("400ms cubic-bezier(0.86, 0, 0.07, 1)", style({ opacity: 1, height: "*" }))]),
      transition("inline => void", [animate("400ms cubic-bezier(0.86, 0, 0.07, 1)", style({ opacity: 0, height: "0" }))]),
      transition("void => overlay", [style({ opacity: 0, transform: "scaleY(0.8)" }), animate(".12s cubic-bezier(0, 0, 0.2, 1)")]),
      transition("overlay => void", [animate(".1s linear", style({ opacity: 0 }))])
    ])
  ] } });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppMenuProfile, { className: "AppMenuProfile", filePath: "src/app/layout/components/app.menuprofile.ts", lineNumber: 63 });
})();

// src/app/layout/components/app.sidebar.ts
var _c07 = ["menuProfileStart"];
var _c14 = ["menuProfileEnd"];
var _c24 = ["menuContainer"];
var _c33 = ["app-sidebar", ""];
function AppSidebar_div_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 20, 1);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("user", ctx_r1.user);
  }
}
function AppSidebar_div_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 20, 2);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("user", ctx_r1.user);
  }
}
var AppSidebar = class _AppSidebar {
  user;
  el = inject(ElementRef);
  layoutService = inject(LayoutService);
  appMenu;
  menuProfileStart;
  menuProfileEnd;
  menuContainer;
  overlayMenuActive = computed(() => this.layoutService.layoutState().overlayMenuActive);
  menuProfilePosition = computed(() => this.layoutService.layoutConfig().menuProfilePosition);
  anchored = computed(() => this.layoutService.layoutState().anchored);
  timeout;
  resetOverlay() {
    if (this.overlayMenuActive()) {
      this.layoutService.layoutState.update((val) => __spreadProps(__spreadValues({}, val), { overlayMenuActive: false }));
    }
  }
  onMouseEnter() {
    if (!this.anchored()) {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
      this.layoutService.layoutState.update((val) => __spreadProps(__spreadValues({}, val), { sidebarActive: true }));
    }
  }
  onMouseLeave() {
    if (!this.anchored()) {
      if (!this.timeout) {
        this.timeout = setTimeout(() => this.layoutService.layoutState.update((val) => __spreadProps(__spreadValues({}, val), { sidebarActive: false })), 300);
      }
    }
  }
  anchor() {
    this.layoutService.layoutState.update((val) => __spreadProps(__spreadValues({}, val), { anchored: !val.anchored }));
  }
  ngOnDestroy() {
    this.resetOverlay();
  }
  static \u0275fac = function AppSidebar_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppSidebar)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppSidebar, selectors: [["", "app-sidebar", ""]], viewQuery: function AppSidebar_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(AppMenu, 5);
      \u0275\u0275viewQuery(_c07, 5);
      \u0275\u0275viewQuery(_c14, 5);
      \u0275\u0275viewQuery(_c24, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.appMenu = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.menuProfileStart = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.menuProfileEnd = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.menuContainer = _t.first);
    }
  }, inputs: { user: "user" }, attrs: _c33, decls: 19, vars: 3, consts: [["menuContainer", ""], ["menuProfileStart", ""], ["menuProfileEnd", ""], [1, "layout-sidebar", 3, "mouseenter", "mouseleave"], [1, "layout-sidebar-top"], ["href", "/"], ["width", "167", "height", "32", "viewBox", "0 0 167 32", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 1, "layout-sidebar-logo"], ["d", "M76.5469 5.25V20.7812C76.5365 22.3125 76.1979 23.6458 75.5312 24.7812C74.8646 25.9167 73.9219 26.7917 72.7031 27.4062C71.4948 28.0104 70.1042 28.3125 68.5312 28.3125C66.1354 28.3125 64.2135 27.6615 62.7656 26.3594C61.3281 25.0469 60.5833 23.2344 60.5312 20.9219V5.25H62.4375V20.6406C62.4375 22.5573 62.9844 24.0469 64.0781 25.1094C65.1719 26.1615 66.6562 26.6875 68.5312 26.6875C70.4062 26.6875 71.8854 26.1562 72.9688 25.0938C74.0625 24.0312 74.6094 22.5521 74.6094 20.6562V5.25H76.5469Z", "fill", "var(--topbar-item-text-color)"], ["d", "M83.8438 26.375H95.0781V28H81.9062V5.25H83.8438V26.375Z", "fill", "var(--topbar-item-text-color)"], ["d", "M109.906 6.89062H102.109V28H100.188V6.89062H92.4062V5.25H109.906V6.89062Z", "fill", "var(--topbar-item-text-color)"], ["d", "M115.938 28H114.016V5.25H115.938V28Z", "fill", "var(--topbar-item-text-color)"], ["d", "M124.672 5.25L133.062 25.3281L141.484 5.25H144.047V28H142.125V18.0938L142.281 7.9375L133.812 28H132.328L123.891 8.01562L124.047 18.0312V28H122.125V5.25H124.672Z", "fill", "var(--topbar-item-text-color)"], ["d", "M162.375 21.625H152.047L149.703 28H147.688L156.297 5.25H158.125L166.734 28H164.734L162.375 21.625ZM152.641 19.9844H161.766L157.203 7.59375L152.641 19.9844Z", "fill", "var(--topbar-item-text-color)"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M39.9709 8.57017C39.9112 8.42729 39.7717 8.33484 39.617 8.33484H37.5093L38.657 6.95037C38.752 6.83653 38.7711 6.67837 38.7083 6.54466C38.6455 6.41095 38.5106 6.32537 38.362 6.32537H15.2326L8.67361 0.10518C8.54643 -0.0147766 8.35336 -0.0346421 8.20625 0.0585729L4.52643 2.36221L4.52336 2.36526L4.51953 2.36679L0.17315 5.21978C0.162424 5.22666 0.157061 5.23735 0.147101 5.24576C0.125649 5.26257 0.107261 5.28091 0.0904059 5.30154C0.0750829 5.31987 0.0628245 5.33821 0.0513322 5.35884C0.0390738 5.381 0.0306461 5.40316 0.0229846 5.42684C0.015323 5.45129 0.0107261 5.47574 0.00766152 5.50172C0.00689537 5.51471 0 5.5254 0 5.53916C0 5.55138 0.00536306 5.56055 0.00689537 5.57278C0.00919382 5.59799 0.0145569 5.62168 0.0222184 5.64689C0.0298799 5.6721 0.0383076 5.69579 0.0513322 5.71948C0.0566952 5.72941 0.0574614 5.74011 0.0635906 5.75004C0.0689537 5.75844 0.0789137 5.7615 0.0850429 5.76914C0.111858 5.80352 0.14327 5.83179 0.180046 5.85471C0.193836 5.86312 0.204563 5.87382 0.218353 5.88069C0.268919 5.90514 0.324082 5.92119 0.383842 5.92119H5.61743L6.79883 8.86052L6.80036 8.86281V8.8651L14.4864 27.2292L9.94925 31.3353C9.83203 31.4415 9.79219 31.608 9.84965 31.7555C9.90635 31.903 10.0489 32 10.2067 32H16.7389C16.7895 32 16.8393 31.9893 16.886 31.9702C16.9327 31.9511 16.9749 31.9228 17.0101 31.8877L20.444 28.4502C20.4486 28.4555 20.4501 28.4624 20.4555 28.4678L23.707 31.8808C23.7798 31.958 23.8756 31.9794 23.9867 32C29.8899 31.9671 38.8462 31.9373 39.2676 31.9809C39.3074 31.9939 39.348 32 39.3886 32C39.5197 32 39.6476 31.9335 39.7189 31.8182C39.9403 31.459 39.9387 31.4552 28.6265 20.2603L39.8874 8.98888C39.9977 8.87733 40.0299 8.71305 39.9709 8.57017ZM37.5483 7.08867L36.5163 8.33484H17.3518L16.0379 7.08867H37.5483ZM8.36178 0.862361L16.2409 8.33484H7.41329L5.20447 2.83898L8.36178 0.862361ZM1.66178 5.15636L4.54864 3.2615L5.3102 5.15636H1.66178ZM21.0102 27.9406C21.0002 27.9299 20.9864 27.9253 20.9757 27.9169L23.7201 25.1701V30.7844L21.0102 27.9406ZM38.5045 31.213C37.058 31.1916 33.464 31.1825 24.4862 31.2321V24.6513C24.4862 24.581 24.4617 24.5183 24.4288 24.461L28.0864 20.7997C31.6934 24.3701 36.7998 29.4519 38.5045 31.213ZM16.8722 30.9425L7.72894 9.0989H36.6006C36.6282 9.10501 36.6558 9.11342 36.6834 9.11342C36.7056 9.11342 36.7263 9.10272 36.7485 9.0989H38.6945L16.8722 30.9425Z", "fill", "var(--topbar-item-text-color)"], ["width", "41", "height", "32", "viewBox", "0 0 41 32", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 1, "layout-sidebar-logo-slim"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M40.7209 8.57017C40.6612 8.42729 40.5217 8.33484 40.367 8.33484H38.2593L39.407 6.95037C39.502 6.83653 39.5211 6.67837 39.4583 6.54466C39.3955 6.41095 39.2606 6.32537 39.112 6.32537H15.9826L9.42361 0.10518C9.29643 -0.0147766 9.10336 -0.0346421 8.95625 0.0585729L5.27643 2.36221L5.27336 2.36526L5.26953 2.36679L0.92315 5.21978C0.912424 5.22666 0.907061 5.23735 0.897101 5.24576C0.875649 5.26257 0.857261 5.28091 0.840406 5.30154C0.825083 5.31987 0.812825 5.33821 0.801332 5.35884C0.789074 5.381 0.780646 5.40316 0.772985 5.42684C0.765323 5.45129 0.760726 5.47574 0.757662 5.50172C0.756895 5.51471 0.75 5.5254 0.75 5.53916C0.75 5.55138 0.755363 5.56055 0.756895 5.57278C0.759194 5.59799 0.764557 5.62168 0.772218 5.64689C0.77988 5.6721 0.788308 5.69579 0.801332 5.71948C0.806695 5.72941 0.807461 5.74011 0.813591 5.75004C0.818954 5.75844 0.828914 5.7615 0.835043 5.76914C0.861858 5.80352 0.89327 5.83179 0.930046 5.85471C0.943836 5.86312 0.954563 5.87382 0.968353 5.88069C1.01892 5.90514 1.07408 5.92119 1.13384 5.92119H6.36743L7.54883 8.86052L7.55036 8.86281V8.8651L15.2364 27.2292L10.6993 31.3353C10.582 31.4415 10.5422 31.608 10.5997 31.7555C10.6564 31.903 10.7989 32 10.9567 32H17.4889C17.5395 32 17.5893 31.9893 17.636 31.9702C17.6827 31.9511 17.7249 31.9228 17.7601 31.8877L21.194 28.4502C21.1986 28.4555 21.2001 28.4624 21.2055 28.4678L24.457 31.8808C24.5298 31.958 24.6256 31.9794 24.7367 32C30.6399 31.9671 39.5962 31.9373 40.0176 31.9809C40.0574 31.9939 40.098 32 40.1386 32C40.2697 32 40.3976 31.9335 40.4689 31.8182C40.6903 31.459 40.6887 31.4552 29.3765 20.2603L40.6374 8.98888C40.7477 8.87733 40.7799 8.71305 40.7209 8.57017ZM38.2983 7.08867L37.2663 8.33484H18.1018L16.7879 7.08867H38.2983ZM9.11178 0.862361L16.9909 8.33484H8.16329L5.95447 2.83898L9.11178 0.862361ZM2.41178 5.15636L5.29864 3.2615L6.0602 5.15636H2.41178ZM21.7602 27.9406C21.7502 27.9299 21.7364 27.9253 21.7257 27.9169L24.4701 25.1701V30.7844L21.7602 27.9406ZM39.2545 31.213C37.808 31.1916 34.214 31.1825 25.2362 31.2321V24.6513C25.2362 24.581 25.2117 24.5183 25.1788 24.461L28.8364 20.7997C32.4434 24.3701 37.5498 29.4519 39.2545 31.213ZM17.6222 30.9425L8.47894 9.0989H37.3506C37.3782 9.10501 37.4058 9.11342 37.4334 9.11342C37.4556 9.11342 37.4763 9.10272 37.4985 9.0989H39.4445L17.6222 30.9425Z", "fill", "var(--topbar-item-text-color)"], ["type", "button", 1, "layout-sidebar-anchor", 3, "click"], ["app-menu-profile", "", 3, "user", 4, "ngIf"], [1, "layout-menu-container"], ["app-menu", "", 3, "user"], ["app-menu-profile", "", 3, "user"]], template: function AppSidebar_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 3);
      \u0275\u0275listener("mouseenter", function AppSidebar_Template_div_mouseenter_0_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onMouseEnter());
      })("mouseleave", function AppSidebar_Template_div_mouseleave_0_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onMouseLeave());
      });
      \u0275\u0275elementStart(1, "div", 4)(2, "a", 5);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(3, "svg", 6);
      \u0275\u0275element(4, "path", 7)(5, "path", 8)(6, "path", 9)(7, "path", 10)(8, "path", 11)(9, "path", 12)(10, "path", 13);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "svg", 14);
      \u0275\u0275element(12, "path", 15);
      \u0275\u0275elementEnd()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(13, "button", 16);
      \u0275\u0275listener("click", function AppSidebar_Template_button_click_13_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.anchor());
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275template(14, AppSidebar_div_14_Template, 2, 1, "div", 17);
      \u0275\u0275elementStart(15, "div", 18, 0);
      \u0275\u0275element(17, "div", 19);
      \u0275\u0275elementEnd();
      \u0275\u0275template(18, AppSidebar_div_18_Template, 2, 1, "div", 17);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(14);
      \u0275\u0275property("ngIf", ctx.menuProfilePosition() === "start");
      \u0275\u0275advance(3);
      \u0275\u0275property("user", ctx.user);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.menuProfilePosition() === "end");
    }
  }, dependencies: [AppMenuProfile, AppMenu, CommonModule, NgIf], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppSidebar, { className: "AppSidebar", filePath: "src/app/layout/components/app.sidebar.ts", lineNumber: 50 });
})();

// src/app/layout/components/app.rightmenu.ts
var _c08 = ["app-right-menu", ""];
function AppRightMenu_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2)(1, "div", 3)(2, "span", 4);
    \u0275\u0275text(3, "ONLINE MEMBERS");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 5);
    \u0275\u0275element(5, "img", 6)(6, "img", 7)(7, "img", 8)(8, "img", 9)(9, "img", 10)(10, "img", 11)(11, "img", 12)(12, "img", 13)(13, "img", 14)(14, "img", 15)(15, "img", 16)(16, "img", 17)(17, "img", 18)(18, "img", 19)(19, "img", 20)(20, "img", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "span", 22)(22, "b", 23);
    \u0275\u0275text(23, "+19");
    \u0275\u0275elementEnd();
    \u0275\u0275text(24, " Costumers");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "div", 3)(26, "span", 4);
    \u0275\u0275text(27, "LATEST ACTIVITY");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "div", 24);
    \u0275\u0275element(29, "i", 25);
    \u0275\u0275elementStart(30, "div", 26)(31, "span", 27);
    \u0275\u0275text(32, "New Sale");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "span", 28);
    \u0275\u0275text(34, "Richard Jones has purchased a blue t-shirt for $79.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "span", 29);
    \u0275\u0275element(36, "img", 30);
    \u0275\u0275elementStart(37, "small");
    \u0275\u0275text(38, "Emmy Adams, 21.40");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(39, "div", 31);
    \u0275\u0275element(40, "i", 25);
    \u0275\u0275elementStart(41, "div", 26)(42, "span", 27);
    \u0275\u0275text(43, "Withdrawal Initiated");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "span", 28);
    \u0275\u0275text(45, "Your request for withdrawal of $2500 has been initiated.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "span", 29);
    \u0275\u0275element(47, "img", 32);
    \u0275\u0275elementStart(48, "small");
    \u0275\u0275text(49, "Emily Walter, 21.40");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(50, "div", 31);
    \u0275\u0275element(51, "i", 25);
    \u0275\u0275elementStart(52, "div", 26)(53, "span", 27);
    \u0275\u0275text(54, "Question Received");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "span", 28);
    \u0275\u0275text(56, "Jane Davis has posted a new question about your product.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "span", 29);
    \u0275\u0275element(58, "img", 33);
    \u0275\u0275elementStart(59, "small");
    \u0275\u0275text(60, "Jane Davis, 21.45");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(61, "div", 26)(62, "span", 4);
    \u0275\u0275text(63, "NEXT EVENTS");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(64, "ul", 34)(65, "li", 35);
    \u0275\u0275element(66, "i", 36);
    \u0275\u0275text(67, "A/B Test");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(68, "li", 35);
    \u0275\u0275element(69, "i", 37);
    \u0275\u0275text(70, "Video Shoot");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(71, "li", 35);
    \u0275\u0275element(72, "i", 38);
    \u0275\u0275text(73, "Board Meeting");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(74, "li", 35);
    \u0275\u0275element(75, "i", 39);
    \u0275\u0275text(76, "Q4 Planning");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(77, "li", 35);
    \u0275\u0275element(78, "i", 40);
    \u0275\u0275text(79, "Design Training");
    \u0275\u0275elementEnd()()()();
  }
}
var AppRightMenu = class _AppRightMenu {
  layoutService = inject(LayoutService);
  get rightMenuActive() {
    return this.layoutService.layoutState().rightMenuActive;
  }
  set rightMenuActive(_val) {
    this.layoutService.layoutState.update((prev) => __spreadProps(__spreadValues({}, prev), { rightMenuActive: _val }));
  }
  static \u0275fac = function AppRightMenu_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppRightMenu)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppRightMenu, selectors: [["", "app-right-menu", ""]], attrs: _c08, decls: 3, vars: 1, consts: [["headless", ""], ["position", "right", 3, "visibleChange", "visible"], [1, "p-7"], [1, "flex", "flex-col", "mb-8"], [1, "pb-2", "mb-2", "border-b", "border-surface", "font-semibold"], [1, "flex", "flex-row", "flex-wrap", "gap-1"], ["src", "/layout/images/avatar/avatar-1.png", "alt", "avatar-1", 1, "cursor-pointer", 2, "width", "32px"], ["src", "/layout/images/avatar/avatar-2.png", "alt", "avatar-2", 1, "cursor-pointer", 2, "width", "32px"], ["src", "/layout/images/avatar/avatar-3.png", "alt", "avatar-3", 1, "cursor-pointer", 2, "width", "32px"], ["src", "/layout/images/avatar/avatar-4.png", "alt", "avatar-4", 1, "cursor-pointer", 2, "width", "32px"], ["src", "/layout/images/avatar/avatar-5.png", "alt", "avatar-5", 1, "cursor-pointer", 2, "width", "32px"], ["src", "/layout/images/avatar/avatar-6.png", "alt", "avatar-6", 1, "cursor-pointer", 2, "width", "32px"], ["src", "/layout/images/avatar/avatar-7.png", "alt", "avatar-7", 1, "cursor-pointer", 2, "width", "32px"], ["src", "/layout/images/avatar/avatar-8.png", "alt", "avatar-8", 1, "cursor-pointer", 2, "width", "32px"], ["src", "/layout/images/avatar/avatar-9.png", "alt", "avatar-9", 1, "cursor-pointer", 2, "width", "32px"], ["src", "/layout/images/avatar/avatar-10.png", "alt", "avatar-10", 1, "cursor-pointer", 2, "width", "32px"], ["src", "/layout/images/avatar/avatar-11.png", "alt", "avatar-11", 1, "cursor-pointer", 2, "width", "32px"], ["src", "/layout/images/avatar/avatar-12.png", "alt", "avatar-12", 1, "cursor-pointer", 2, "width", "32px"], ["src", "/layout/images/avatar/avatar-13.png", "alt", "avatar-13", 1, "cursor-pointer", 2, "width", "32px"], ["src", "/layout/images/avatar/avatar-14.png", "alt", "avatar-14", 1, "cursor-pointer", 2, "width", "32px"], ["src", "/layout/images/avatar/avatar-15.png", "alt", "avatar-15", 1, "cursor-pointer", 2, "width", "32px"], ["src", "/layout/images/avatar/avatar-16.png", "alt", "avatar-16", 1, "cursor-pointer", 2, "width", "32px"], [1, "mt-4"], [1, "text-primary"], [1, "flex", "pt-2"], [1, "pi", "pi-images", "self-start", "p-2", "border", "border-transparent", "rounded-full", "mr-2", 2, "background-color", "rgba(0, 0, 0, 0.12)"], [1, "flex", "flex-col"], [1, "font-bold", "mb-1"], [1, "mb-2", "leading-normal"], [1, "flex", "items-center"], ["src", "/layout/images/avatar/activity-1.png", "alt", "", 1, "mr-2"], [1, "flex", "pt-4"], ["src", "/layout/images/avatar/activity-2.png", "alt", "avatar-2", 1, "mr-2"], ["src", "/layout/images/avatar/activity-3.png", "alt", "avatar-3", 1, "mr-2"], [1, "m-0", "list-none", "p-0"], [1, "py-4", "px-2", "rounded-md", "hover:bg-emphasis", "cursor-pointer"], [1, "pi", "pi-eye", "mr-4"], [1, "pi", "pi-video", "mr-4"], [1, "pi", "pi-sitemap", "mr-4"], [1, "pi", "pi-compass", "mr-4"], [1, "pi", "pi-palette", "mr-4"]], template: function AppRightMenu_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "p-drawer", 1);
      \u0275\u0275twoWayListener("visibleChange", function AppRightMenu_Template_p_drawer_visibleChange_0_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.rightMenuActive, $event) || (ctx.rightMenuActive = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275template(1, AppRightMenu_ng_template_1_Template, 80, 0, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275twoWayProperty("visible", ctx.rightMenuActive);
    }
  }, dependencies: [DrawerModule, Drawer, FormsModule], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppRightMenu, { className: "AppRightMenu", filePath: "src/app/layout/components/app.rightmenu.ts", lineNumber: 85 });
})();

// src/app/layout/components/app.layout.ts
var AppLayout = class _AppLayout {
  layoutService;
  renderer;
  router;
  state = signal({
    loading: false,
    message: void 0,
    error: void 0
  });
  destroyRef = inject(DestroyRef);
  userService = inject(UserService);
  ngOnInit() {
    this.loadUserProfile();
  }
  loadUserProfile() {
    this.state.update((state2) => __spreadProps(__spreadValues({}, state2), { loading: true, message: void 0, error: void 0 }));
    this.userService.getInstanceUser$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        console.log(response.data.user);
        this.state.update((state2) => __spreadProps(__spreadValues({}, state2), { loading: false, user: response.data.user, message: void 0, error: void 0 }));
      },
      error: (error) => {
        this.state.update((state2) => __spreadProps(__spreadValues({}, state2), { loading: false, user: void 0, message: void 0, error }));
      },
      complete: () => {
      }
    });
  }
  overlayMenuOpenSubscription;
  menuOutsideClickListener;
  menuScrollListener;
  appSidebar;
  appTopbar;
  constructor(layoutService, renderer, router) {
    this.layoutService = layoutService;
    this.renderer = renderer;
    this.router = router;
    this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
      if (!this.menuOutsideClickListener) {
        this.menuOutsideClickListener = this.renderer.listen("document", "click", (event) => {
          const isOutsideClicked = !(this.appSidebar.appMenu.el.nativeElement.isSameNode(event.target) || this.appSidebar.appMenu.el.nativeElement.contains(event.target) || this.appTopbar.menuButton.nativeElement.isSameNode(event.target) || this.appTopbar.menuButton.nativeElement.contains(event.target));
          if (isOutsideClicked) {
            this.hideMenu();
          }
        });
      }
      if ((this.layoutService.isSlim() || this.layoutService.isSlimPlus()) && !this.menuScrollListener) {
        this.menuScrollListener = this.renderer.listen(this.appSidebar.appMenu.menuContainer.nativeElement, "scroll", (event) => {
          if (this.layoutService.isDesktop()) {
            this.hideMenu();
          }
        });
      }
      if (this.layoutService.layoutState().staticMenuMobileActive) {
        this.blockBodyScroll();
      }
    });
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.hideMenu();
    });
  }
  blockBodyScroll() {
    if (document.body.classList) {
      document.body.classList.add("blocked-scroll");
    } else {
      document.body.className += " blocked-scroll";
    }
  }
  unblockBodyScroll() {
    if (document.body.classList) {
      document.body.classList.remove("blocked-scroll");
    } else {
      document.body.className = document.body.className.replace(new RegExp("(^|\\b)" + "blocked-scroll".split(" ").join("|") + "(\\b|$)", "gi"), " ");
    }
  }
  hideMenu() {
    this.layoutService.layoutState.update((prev) => __spreadProps(__spreadValues({}, prev), { overlayMenuActive: false, staticMenuMobileActive: false, menuHoverActive: false }));
    this.layoutService.reset();
    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
      this.menuOutsideClickListener = null;
    }
    if (this.menuScrollListener) {
      this.menuScrollListener();
      this.menuScrollListener = null;
    }
    this.unblockBodyScroll();
  }
  containerClass = computed(() => {
    const layoutConfig = this.layoutService.layoutConfig();
    const layoutState = this.layoutService.layoutState();
    return {
      "layout-overlay": layoutConfig.menuMode === "overlay",
      "layout-static": layoutConfig.menuMode === "static",
      "layout-slim": layoutConfig.menuMode === "slim",
      "layout-slim-plus": layoutConfig.menuMode === "slim-plus",
      "layout-horizontal": layoutConfig.menuMode === "horizontal",
      "layout-reveal": layoutConfig.menuMode === "reveal",
      "layout-drawer": layoutConfig.menuMode === "drawer",
      "layout-sidebar-dark": layoutConfig.darkTheme,
      "layout-static-inactive": layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === "static",
      "layout-overlay-active": layoutState.overlayMenuActive,
      "layout-mobile-active": layoutState.staticMenuMobileActive,
      "layout-topbar-menu-active": layoutState.topbarMenuActive,
      "layout-menu-profile-active": layoutState.rightMenuActive,
      "layout-sidebar-active": layoutState.sidebarActive,
      "layout-sidebar-anchored": layoutState.anchored,
      [`layout-topbar-${layoutConfig.topbarTheme}`]: true,
      [`layout-menu-${layoutConfig.menuTheme}`]: true,
      [`layout-menu-profile-${layoutConfig.menuProfilePosition}`]: true
    };
  });
  ngOnDestroy() {
    if (this.overlayMenuOpenSubscription) {
      this.overlayMenuOpenSubscription.unsubscribe();
    }
    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
    }
  }
  static \u0275fac = function AppLayout_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppLayout)(\u0275\u0275directiveInject(LayoutService), \u0275\u0275directiveInject(Renderer2), \u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppLayout, selectors: [["app-layout"]], viewQuery: function AppLayout_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(AppSidebar, 5);
      \u0275\u0275viewQuery(AppTopbar, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.appSidebar = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.appTopbar = _t.first);
    }
  }, features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 11, vars: 3, consts: [[1, "layout-container", 3, "ngClass"], ["app-topbar", "", 3, "user"], ["app-right-menu", ""], ["app-sidebar", "", 3, "user"], [1, "layout-content-wrapper"], ["app-breadcrumb", ""], [1, "layout-content"], ["app-footer", ""]], template: function AppLayout_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "div", 1)(2, "div", 2)(3, "div", 3);
      \u0275\u0275elementStart(4, "div", 4);
      \u0275\u0275element(5, "div", 5);
      \u0275\u0275elementStart(6, "div", 6);
      \u0275\u0275element(7, "router-outlet");
      \u0275\u0275elementEnd();
      \u0275\u0275element(8, "div", 7);
      \u0275\u0275elementEnd()();
      \u0275\u0275element(9, "app-configurator")(10, "p-toast");
    }
    if (rf & 2) {
      \u0275\u0275property("ngClass", ctx.containerClass());
      \u0275\u0275advance();
      \u0275\u0275property("user", ctx.state().user);
      \u0275\u0275advance(2);
      \u0275\u0275property("user", ctx.state().user);
    }
  }, dependencies: [CommonModule, NgClass, AppTopbar, AppSidebar, RouterModule, RouterOutlet, AppFooter, AppConfigurator, AppBreadcrumb, AppRightMenu, Toast], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppLayout, { className: "AppLayout", filePath: "src/app/layout/components/app.layout.ts", lineNumber: 41 });
})();

// src/app/service/auth.guard.ts
var AuthGuard = (route, state2) => {
  const router = inject(Router);
  const userService = inject(UserService);
  if (userService.isAuthenticated() && !userService.isTokenExpired()) {
    return true;
  }
  router.navigate([""]);
  return false;
};

// src/app.routes.ts
var appRoutes = [
  {
    path: "",
    pathMatch: "full",
    loadComponent: () => import("./chunk-6G62GMAY.js").then((c) => c.HomeComponent)
  },
  {
    path: "",
    component: AppLayout,
    canActivate: [AuthGuard],
    // Add AuthGuard to protect these routes
    children: [
      {
        path: "",
        redirectTo: "/dashboards",
        pathMatch: "full"
      },
      {
        path: "dashboards",
        data: { breadcrumb: "Dashboard" },
        loadChildren: () => import("./chunk-JKN7SBCM.js")
      },
      {
        path: "uikit",
        data: { breadcrumb: "UI Kit" },
        loadChildren: () => import("./chunk-X76IZPSW.js")
      },
      {
        path: "documentation",
        data: { breadcrumb: "Documentation" },
        loadComponent: () => import("./chunk-ICRWZVL4.js").then((c) => c.Documentation)
      },
      {
        path: "pages",
        data: { breadcrumb: "Pages" },
        loadChildren: () => import("./chunk-PKD4P4NG.js")
      },
      {
        path: "apps",
        data: { breadcrumb: "Apps" },
        loadChildren: () => import("./chunk-EZLUZQTK.js")
      },
      {
        path: "ecommerce",
        data: { breadcrumb: "E-Commerce" },
        loadChildren: () => import("./chunk-NWFPUVWS.js")
      },
      {
        path: "blocks",
        data: { breadcrumb: "Prime Blocks" },
        loadChildren: () => import("./chunk-2F67A2WF.js")
      },
      {
        path: "profile",
        data: { breadcrumb: "User Management" },
        loadChildren: () => import("./chunk-7Z6DXUZ4.js")
      }
    ]
  },
  { path: "", loadComponent: () => import("./chunk-6G62GMAY.js").then((c) => c.HomeComponent) },
  { path: "auth", loadChildren: () => import("./chunk-CLHKRFNM.js") },
  {
    path: "landing",
    loadComponent: () => import("./chunk-R2QDDH36.js").then((c) => c.Landing)
  },
  {
    path: "notfound",
    loadComponent: () => import("./chunk-OQZMCIAF.js").then((c) => c.Notfound)
  },
  { path: "**", redirectTo: "/notfound" }
];

// src/app/interceptors/token.interceptor.ts
var TokenInterceptor = (request, next) => {
  console.log("\u{1F525} TokenInterceptor D\xC9CLENCH\xC9 pour:", request.url);
  const storage = inject(StorageService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  if (shouldSkipAuthorization(request)) {
    console.log("\u23ED\uFE0F Skipping authorization pour:", request.url);
    return next(request);
  }
  console.log("\u2705 TokenInterceptor va traiter:", request.url);
  const token = storage.get(Key.TOKEN);
  console.log("\u{1F50D} Token r\xE9cup\xE9r\xE9 du storage:", token ? `${token.substring(0, 30)}...` : "NULL/UNDEFINED");
  const authRequest = addAuthorizationTokenHeader(request, token);
  console.log("\u{1F4E8} Requ\xEAte avec Authorization header:", authRequest.headers.has("Authorization"));
  return next(authRequest).pipe(catchError((error) => {
    console.log("\u274C Erreur HTTP intercept\xE9e:", error.status, error.statusText, "pour URL:", request.url);
    console.log("\u{1F50D} D\xE9tails erreur:", error.error);
    if (error.status === 401) {
      console.log("\u{1F6AB} 401 Unauthorized - Redirection vers page d'accueil");
      handleAuthFailure(storage, router);
    }
    return throwError(() => error);
  }));
};
function shouldSkipAuthorization(request) {
  const skipUrls = ["verify", "login", "refresh", "resetpassword", "oauth2/token", "search", "typeCredit", "agences", "pointventes", "addDemandeInd", "newDemandeInd"];
  return skipUrls.some((url) => request.url.includes(url));
}
function handleAuthFailure(storage, router) {
  storage.remove(Key.TOKEN);
  storage.remove(Key.REFRESH_TOKEN);
  router.navigate(["/"]);
}
function addAuthorizationTokenHeader(request, token) {
  console.log("\u{1F3D7}\uFE0F addAuthorizationTokenHeader appel\xE9e avec token ...:", token ? "PR\xC9SENT" : "ABSENT");
  if (!token || token === "" || token === "null" || token === "undefined") {
    console.log("\u26A0\uFE0F Token invalide, requ\xEAte non modifi\xE9e");
    return request;
  }
  const modifiedRequest = request.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
  console.log("\u2705 Header Authorization ajout\xE9 \xE0 la requ\xEAte");
  console.log("\u{1F50D} Headers finaux:", modifiedRequest.headers.keys());
  return modifiedRequest;
}

// src/app/service/http.cache.service.ts
var HttpCacheService = class _HttpCacheService {
  httpResponseCache = {};
  /**
   * Caches the HttpResponse for the provided key.
   * @param key The cache key.
   * @param httpResponse The HttpResponse to cache.
   */
  put(key, httpResponse) {
    if (!key || !httpResponse) {
      console.warn("Invalid key or response provided for caching.");
      return;
    }
    console.log("Caching response for key:", key);
    this.httpResponseCache[key] = httpResponse;
  }
  /**
   * Retrieves the cached HttpResponse for the provided key.
   * @param key The cache key.
   * @returns The cached HttpResponse or undefined if not found.
   */
  get(key) {
    return this.httpResponseCache[key];
  }
  /**
   * Removes the cached HttpResponse for the provided key.
   * @param key The cache key.
   * @returns True if the key existed and was deleted, false otherwise.
   */
  evict(key) {
    if (this.httpResponseCache[key]) {
      console.log("Evicting cache for key:", key);
      return delete this.httpResponseCache[key];
    }
    return false;
  }
  /**
   * Clears all cached HttpResponses.
   */
  evictAll() {
    console.log("Clearing entire cache");
    this.httpResponseCache = {};
  }
  /**
   * Logs the current state of the cache.
   */
  logCache() {
    console.log("Current cache state:", this.httpResponseCache);
  }
  static \u0275fac = function HttpCacheService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HttpCacheService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _HttpCacheService, factory: _HttpCacheService.\u0275fac, providedIn: "root" });
};

// src/app/interceptors/cache.interceptor.ts
var CacheInterceptor = (request, next) => {
  const httpCache = inject(HttpCacheService);
  if (shouldBypassCache(request, httpCache)) {
    return next(request);
  }
  const cacheKey = request.urlWithParams;
  const cachedResponse = httpCache.get(cacheKey);
  if (cachedResponse) {
    console.log(`Cache hit for URL: ${cacheKey}`);
    httpCache.logCache();
    return of(cachedResponse);
  }
  return handleAndCacheResponse(request, next, httpCache, cacheKey);
};
function shouldBypassCache(request, httpCache) {
  const bypassUrls = [
    "verify",
    "login",
    "refresh",
    "resetpassword",
    // ✅ NOUVEAU: Exclure toutes les URLs salaire du cache
    "/salaire/authorize",
    "/salaire/info-personnel",
    "/salaire/avance-salaire",
    "/salaire/demande-salary",
    "/demande-salary"
  ];
  const isBypassUrl = bypassUrls.some((url) => request.url.includes(url));
  const hasTimestamp = request.params.has("_t");
  if (isBypassUrl || request.method !== "GET" || request.url.includes("download") || hasTimestamp) {
    if (request.method !== "GET") {
      httpCache.evictAll();
    }
    if (isBypassUrl || hasTimestamp) {
      console.log(`\u{1F6AB} Cache SKIPPED for: ${request.url}`);
    }
    return true;
  }
  return false;
}
function handleAndCacheResponse(request, next, httpCache, cacheKey) {
  return next(request).pipe(tap((event) => {
    if (event instanceof HttpResponse && request.method === "GET") {
      console.log(`\u{1F4BE} Caching response for URL: ${cacheKey}`);
      httpCache.put(cacheKey, event);
    }
  }));
}

// node_modules/@angular/platform-browser/fesm2022/animations.mjs
var InjectableAnimationEngine = class _InjectableAnimationEngine extends AnimationEngine {
  // The `ApplicationRef` is injected here explicitly to force the dependency ordering.
  // Since the `ApplicationRef` should be created earlier before the `AnimationEngine`, they
  // both have `ngOnDestroy` hooks and `flush()` must be called after all views are destroyed.
  constructor(doc, driver, normalizer) {
    super(doc, driver, normalizer);
  }
  ngOnDestroy() {
    this.flush();
  }
  static \u0275fac = function InjectableAnimationEngine_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _InjectableAnimationEngine)(\u0275\u0275inject(DOCUMENT), \u0275\u0275inject(AnimationDriver), \u0275\u0275inject(AnimationStyleNormalizer));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _InjectableAnimationEngine,
    factory: _InjectableAnimationEngine.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InjectableAnimationEngine, [{
    type: Injectable
  }], () => [{
    type: Document,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }, {
    type: AnimationDriver
  }, {
    type: AnimationStyleNormalizer
  }], null);
})();
function instantiateDefaultStyleNormalizer() {
  return new WebAnimationsStyleNormalizer();
}
function instantiateRendererFactory(renderer, engine, zone) {
  return new AnimationRendererFactory(renderer, engine, zone);
}
var SHARED_ANIMATION_PROVIDERS = [{
  provide: AnimationStyleNormalizer,
  useFactory: instantiateDefaultStyleNormalizer
}, {
  provide: AnimationEngine,
  useClass: InjectableAnimationEngine
}, {
  provide: RendererFactory2,
  useFactory: instantiateRendererFactory,
  deps: [DomRendererFactory2, AnimationEngine, NgZone]
}];
var BROWSER_ANIMATIONS_PROVIDERS = [{
  provide: AnimationDriver,
  useFactory: () => new WebAnimationsDriver()
}, {
  provide: ANIMATION_MODULE_TYPE,
  useValue: "BrowserAnimations"
}, ...SHARED_ANIMATION_PROVIDERS];
var BROWSER_NOOP_ANIMATIONS_PROVIDERS = [{
  provide: AnimationDriver,
  useClass: NoopAnimationDriver
}, {
  provide: ANIMATION_MODULE_TYPE,
  useValue: "NoopAnimations"
}, ...SHARED_ANIMATION_PROVIDERS];
var BrowserAnimationsModule = class _BrowserAnimationsModule {
  /**
   * Configures the module based on the specified object.
   *
   * @param config Object used to configure the behavior of the `BrowserAnimationsModule`.
   * @see {@link BrowserAnimationsModuleConfig}
   *
   * @usageNotes
   * When registering the `BrowserAnimationsModule`, you can use the `withConfig`
   * function as follows:
   * ```ts
   * @NgModule({
   *   imports: [BrowserAnimationsModule.withConfig(config)]
   * })
   * class MyNgModule {}
   * ```
   */
  static withConfig(config) {
    return {
      ngModule: _BrowserAnimationsModule,
      providers: config.disableAnimations ? BROWSER_NOOP_ANIMATIONS_PROVIDERS : BROWSER_ANIMATIONS_PROVIDERS
    };
  }
  static \u0275fac = function BrowserAnimationsModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrowserAnimationsModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _BrowserAnimationsModule
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    providers: BROWSER_ANIMATIONS_PROVIDERS,
    imports: [BrowserModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrowserAnimationsModule, [{
    type: NgModule,
    args: [{
      exports: [BrowserModule],
      providers: BROWSER_ANIMATIONS_PROVIDERS
    }]
  }], null, null);
})();
function provideAnimations() {
  performanceMarkFeature("NgEagerAnimations");
  return [...BROWSER_ANIMATIONS_PROVIDERS];
}
var NoopAnimationsModule = class _NoopAnimationsModule {
  static \u0275fac = function NoopAnimationsModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NoopAnimationsModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _NoopAnimationsModule
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    providers: BROWSER_NOOP_ANIMATIONS_PROVIDERS,
    imports: [BrowserModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NoopAnimationsModule, [{
    type: NgModule,
    args: [{
      exports: [BrowserModule],
      providers: BROWSER_NOOP_ANIMATIONS_PROVIDERS
    }]
  }], null, null);
})();

// src/app.config.ts
var MyPreset = definePreset(material_default, {
  semantic: {
    primary: {
      50: "{indigo.50}",
      100: "{indigo.100}",
      200: "{indigo.200}",
      300: "{indigo.300}",
      400: "{indigo.400}",
      500: "{indigo.500}",
      600: "{indigo.600}",
      700: "{indigo.700}",
      800: "{indigo.800}",
      900: "{indigo.900}",
      950: "{indigo.950}"
    }
  }
});
var appConfig = {
  providers: [
    provideRouter(appRoutes, withInMemoryScrolling({
      anchorScrolling: "enabled",
      scrollPositionRestoration: "enabled"
    }), withEnabledBlockingInitialNavigation()),
    provideAnimations(),
    // CORRECTION CRITIQUE : Une seule configuration HttpClient avec les intercepteurs
    provideHttpClient(withFetch(), withInterceptors([TokenInterceptor, CacheInterceptor])),
    // SUPPRIMÉ : provideHttpClient(withFetch()), // ← Cette ligne supprimée !
    provideAnimationsAsync(),
    providePrimeNG({
      ripple: true,
      inputStyle: "filled",
      theme: { preset: MyPreset, options: { darkModeSelector: ".app-dark" } }
    }),
    UserService,
    StorageService
  ]
};

// src/app.component.ts
var AppComponent = class _AppComponent {
  router = inject(Router);
  userService = inject(UserService);
  ngOnInit() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      if (this.userService.isAuthenticated() && !this.userService.isTokenExpired()) {
        const currentUrl = this.router.url.split("?")[0];
        if (currentUrl === "/") {
          this.router.navigate(["/dashboards"]);
        }
      }
    });
  }
  static \u0275fac = function AppComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppComponent, selectors: [["app-root"]], decls: 1, vars: 0, template: function AppComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "router-outlet");
    }
  }, dependencies: [RouterModule, RouterOutlet], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppComponent, { className: "AppComponent", filePath: "src/app.component.ts", lineNumber: 12 });
})();

// src/main.ts
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
/*! Bundled license information:

@angular/platform-browser/fesm2022/animations/async.mjs:
  (**
   * @license Angular v19.1.7
   * (c) 2010-2024 Google LLC. https://angular.io/
   * License: MIT
   *)

@angular/platform-browser/fesm2022/animations.mjs:
  (**
   * @license Angular v19.1.7
   * (c) 2010-2024 Google LLC. https://angular.io/
   * License: MIT
   *)
*/
//# sourceMappingURL=main.js.map
