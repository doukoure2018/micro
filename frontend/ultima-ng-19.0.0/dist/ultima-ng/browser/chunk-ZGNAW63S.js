import {
  Subject,
  computed,
  effect,
  signal,
  ɵɵdefineInjectable
} from "./chunk-ZKKMBKIA.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/layout/service/layout.service.ts
var LayoutService = class _LayoutService {
  _config = {
    primary: "indigo",
    surface: null,
    darkTheme: false,
    menuMode: "static",
    menuTheme: "light",
    topbarTheme: "indigo",
    menuProfilePosition: "end"
  };
  _state = {
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
    rightMenuActive: false,
    topbarMenuActive: false,
    sidebarActive: false,
    anchored: false,
    activeMenuItem: null,
    overlaySubmenuActive: false,
    menuProfileActive: false
  };
  layoutConfig = signal(this._config);
  layoutState = signal(this._state);
  configUpdate = new Subject();
  overlayOpen = new Subject();
  menuSource = new Subject();
  resetSource = new Subject();
  menuSource$ = this.menuSource.asObservable();
  resetSource$ = this.resetSource.asObservable();
  configUpdate$ = this.configUpdate.asObservable();
  overlayOpen$ = this.overlayOpen.asObservable();
  isSidebarActive = computed(() => this.layoutState().overlayMenuActive || this.layoutState().staticMenuMobileActive);
  isDarkTheme = computed(() => this.layoutConfig().darkTheme);
  isOverlay = computed(() => this.layoutConfig().menuMode === "overlay");
  isSlim = computed(() => this.layoutConfig().menuMode === "slim");
  isSlimPlus = computed(() => this.layoutConfig().menuMode === "slim-plus");
  isHorizontal = computed(() => this.layoutConfig().menuMode === "horizontal");
  transitionComplete = signal(false);
  isSidebarStateChanged = computed(() => {
    const layoutConfig = this.layoutConfig();
    return layoutConfig.menuMode === "horizontal" || layoutConfig.menuMode === "slim" || layoutConfig.menuMode === "slim-plus";
  });
  initialized = false;
  constructor() {
    effect(() => {
      const config = this.layoutConfig();
      if (config) {
        this.onConfigUpdate();
      }
    });
    effect(() => {
      const config = this.layoutConfig();
      if (!this.initialized || !config) {
        this.initialized = true;
        return;
      }
      this.handleDarkModeTransition(config);
    });
    effect(() => {
      this.isSidebarStateChanged() && this.reset();
    });
  }
  handleDarkModeTransition(config) {
    if (document.startViewTransition) {
      this.startViewTransition(config);
    } else {
      this.toggleDarkMode(config);
      this.onTransitionEnd();
    }
  }
  startViewTransition(config) {
    const transition = document.startViewTransition(() => {
      this.toggleDarkMode(config);
    });
    transition.ready.then(() => {
      this.onTransitionEnd();
    }).catch(() => {
    });
  }
  toggleDarkMode(config) {
    const _config = config || this.layoutConfig();
    if (_config.darkTheme) {
      document.documentElement.classList.add("app-dark");
    } else {
      document.documentElement.classList.remove("app-dark");
    }
  }
  onTransitionEnd() {
    this.transitionComplete.set(true);
    setTimeout(() => {
      this.transitionComplete.set(false);
    });
  }
  onMenuToggle() {
    if (this.isOverlay()) {
      this.layoutState.update((prev) => __spreadProps(__spreadValues({}, prev), { overlayMenuActive: !this.layoutState().overlayMenuActive }));
      if (this.layoutState().overlayMenuActive) {
        this.overlayOpen.next(null);
      }
    }
    if (this.isDesktop()) {
      this.layoutState.update((prev) => __spreadProps(__spreadValues({}, prev), { staticMenuDesktopInactive: !this.layoutState().staticMenuDesktopInactive }));
    } else {
      this.layoutState.update((prev) => __spreadProps(__spreadValues({}, prev), { staticMenuMobileActive: !this.layoutState().staticMenuMobileActive }));
      if (this.layoutState().staticMenuMobileActive) {
        this.overlayOpen.next(null);
      }
    }
  }
  onMenuProfileToggle() {
    this.layoutState.update((prev) => __spreadProps(__spreadValues({}, prev), { menuProfileActive: !prev.menuProfileActive }));
  }
  openRightMenu() {
    this.layoutState.update((prev) => __spreadProps(__spreadValues({}, prev), { rightMenuActive: true }));
  }
  isDesktop() {
    return window.innerWidth > 991;
  }
  isMobile() {
    return !this.isDesktop();
  }
  onConfigUpdate() {
    this._config = __spreadValues({}, this.layoutConfig());
    this.configUpdate.next(this.layoutConfig());
  }
  onMenuStateChange(event) {
    this.menuSource.next(event);
  }
  reset() {
    this.resetSource.next(true);
  }
  onOverlaySubmenuOpen() {
    this.overlayOpen.next(null);
  }
  hideConfigSidebar() {
    this.layoutState.update((prev) => __spreadProps(__spreadValues({}, prev), { configSidebarVisible: false }));
  }
  static \u0275fac = function LayoutService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LayoutService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _LayoutService, factory: _LayoutService.\u0275fac, providedIn: "root" });
};

export {
  LayoutService
};
//# sourceMappingURL=chunk-ZGNAW63S.js.map
