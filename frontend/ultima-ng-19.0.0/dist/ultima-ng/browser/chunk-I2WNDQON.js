import {
  ActivatedRoute,
  Router
} from "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
import {
  takeUntilDestroyed
} from "./chunk-WRLBQDQK.js";
import {
  UserService
} from "./chunk-SQ5BRWVW.js";
import "./chunk-ZRELZ6R7.js";
import "./chunk-BMYIFZHZ.js";
import "./chunk-SQQPVFHK.js";
import {
  DestroyRef,
  EMPTY,
  inject,
  signal,
  switchMap,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtext
} from "./chunk-ZKKMBKIA.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/pages/dashboard/agent-credit/mise-en-place-credit/mise-en-place-credit.component.ts
var MiseEnPlaceCreditComponent = class _MiseEnPlaceCreditComponent {
  state = signal({
    loading: false,
    message: void 0,
    error: void 0
  });
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  activatedRouter = inject(ActivatedRoute);
  userService = inject(UserService);
  ngOnInit() {
    this.redirectCredit();
  }
  redirectCredit() {
    this.activatedRouter.paramMap.pipe(switchMap((params) => {
      const numeroMembre = params.get("numeroMembre");
      console.log("processus de verification de numeroMembre");
      console.log("numeroMembre", numeroMembre);
      if (numeroMembre) {
        const existMembre = this.userService.existNumeroMembre$(+numeroMembre);
        this.state.set({ numeroMembre, loading: true, message: void 0, error: void 0 });
        if (existMembre) {
          return this.router.navigate(["/dashboards/agent-credit/start-credit/", numeroMembre]);
        } else {
          return this.router.navigate(["/dashboards/agent-credit/start-credit/", numeroMembre]);
        }
      } else {
        this.state.set(__spreadProps(__spreadValues({}, this.state()), { loading: false, message: void 0, error: "Invalide Code AgenceId or not exist" }));
        return EMPTY;
      }
    }), takeUntilDestroyed(this.destroyRef)).subscribe();
  }
  static \u0275fac = function MiseEnPlaceCreditComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MiseEnPlaceCreditComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MiseEnPlaceCreditComponent, selectors: [["app-mise-en-place-credit"]], decls: 2, vars: 0, template: function MiseEnPlaceCreditComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "p");
      \u0275\u0275text(1, "mise-en-place-credit works!");
      \u0275\u0275elementEnd();
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MiseEnPlaceCreditComponent, { className: "MiseEnPlaceCreditComponent", filePath: "src/app/pages/dashboard/agent-credit/mise-en-place-credit/mise-en-place-credit.component.ts", lineNumber: 12 });
})();
export {
  MiseEnPlaceCreditComponent
};
//# sourceMappingURL=chunk-I2WNDQON.js.map
