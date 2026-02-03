import {
  Chip
} from "./chunk-SN3HAAMO.js";
import {
  Checkbox
} from "./chunk-4JIPYACT.js";
import "./chunk-6GA37Q7Z.js";
import "./chunk-KHEKFKWA.js";
import {
  InputText
} from "./chunk-FZELBHWZ.js";
import {
  Tooltip,
  TooltipModule
} from "./chunk-4IUQ6KTI.js";
import "./chunk-E352KRZV.js";
import "./chunk-HHD4PK4J.js";
import {
  Button
} from "./chunk-PJSNAOPI.js";
import "./chunk-AP3OAIHW.js";
import "./chunk-NQNBRQ7H.js";
import {
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-3HTR5OU7.js";
import {
  CommonModule,
  NgClass,
  NgIf,
  NgStyle
} from "./chunk-SQQPVFHK.js";
import {
  booleanAttribute,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-ZKKMBKIA.js";
import {
  __async
} from "./chunk-4MWRP73S.js";

// src/app/pages/blocks/components/blockviewer.ts
var _c0 = ["*"];
var _c1 = (a0) => ({ "block-action-active": a0 });
function BlockViewer_span_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 13);
    \u0275\u0275text(1, "Free");
    \u0275\u0275elementEnd();
  }
}
function BlockViewer_span_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 14);
    \u0275\u0275text(1, "New");
    \u0275\u0275elementEnd();
  }
}
function BlockViewer_div_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15);
    \u0275\u0275projection(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r0.containerClass);
    \u0275\u0275property("ngStyle", ctx_r0.previewStyle);
  }
}
function BlockViewer_div_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "pre", 16)(2, "code");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.code);
  }
}
var BlockView;
(function(BlockView2) {
  BlockView2[BlockView2["PREVIEW"] = 0] = "PREVIEW";
  BlockView2[BlockView2["CODE"] = 1] = "CODE";
})(BlockView || (BlockView = {}));
var BlockViewer = class _BlockViewer {
  header;
  code;
  containerClass;
  previewStyle;
  free = true;
  new = false;
  BlockView = BlockView;
  blockView = BlockView.PREVIEW;
  activateView(event, blockView) {
    this.blockView = blockView;
    event.preventDefault();
  }
  copyCode(event) {
    return __async(this, null, function* () {
      yield navigator.clipboard.writeText(this.code);
      event.preventDefault();
    });
  }
  static \u0275fac = function BlockViewer_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BlockViewer)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BlockViewer, selectors: [["block-viewer"]], inputs: { header: "header", code: "code", containerClass: "containerClass", previewStyle: "previewStyle", free: [2, "free", "free", booleanAttribute], new: [2, "new", "new", booleanAttribute] }, ngContentSelectors: _c0, decls: 19, vars: 13, consts: [[1, "block-section"], [1, "block-header"], [1, "block-title"], ["class", "badge-free", 4, "ngIf"], ["class", "badge-new", 4, "ngIf"], [1, "block-actions"], ["tabindex", "0", 3, "click", "ngClass"], [3, "click", "ngClass"], ["pTooltip", "Copied to clipboard", "tooltipEvent", "focus", "tooltipPosition", "bottom", 1, "block-action-copy", 3, "click"], [1, "pi", "pi-copy", "m-0"], [1, "block-content"], [3, "class", "ngStyle", 4, "ngIf"], [4, "ngIf"], [1, "badge-free"], [1, "badge-new"], [3, "ngStyle"], [1, "app-code"]], template: function BlockViewer_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "span", 2)(3, "span");
      \u0275\u0275text(4);
      \u0275\u0275elementEnd();
      \u0275\u0275template(5, BlockViewer_span_5_Template, 2, 0, "span", 3)(6, BlockViewer_span_6_Template, 2, 0, "span", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "div", 5)(8, "a", 6);
      \u0275\u0275listener("click", function BlockViewer_Template_a_click_8_listener($event) {
        return ctx.activateView($event, ctx.BlockView.PREVIEW);
      });
      \u0275\u0275elementStart(9, "span");
      \u0275\u0275text(10, "Preview");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(11, "a", 7);
      \u0275\u0275listener("click", function BlockViewer_Template_a_click_11_listener($event) {
        return ctx.activateView($event, ctx.BlockView.CODE);
      });
      \u0275\u0275elementStart(12, "span");
      \u0275\u0275text(13, "Code");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(14, "a", 8);
      \u0275\u0275listener("click", function BlockViewer_Template_a_click_14_listener($event) {
        return ctx.copyCode($event);
      });
      \u0275\u0275element(15, "i", 9);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(16, "div", 10);
      \u0275\u0275template(17, BlockViewer_div_17_Template, 2, 3, "div", 11)(18, BlockViewer_div_18_Template, 4, 1, "div", 12);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.header);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.free);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.new);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(9, _c1, ctx.blockView === ctx.BlockView.PREVIEW));
      \u0275\u0275advance(3);
      \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(11, _c1, ctx.blockView === ctx.BlockView.CODE));
      \u0275\u0275attribute("tabindex", "0");
      \u0275\u0275advance(3);
      \u0275\u0275attribute("tabindex", "0");
      \u0275\u0275advance(3);
      \u0275\u0275property("ngIf", ctx.blockView === ctx.BlockView.PREVIEW);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.blockView === ctx.BlockView.CODE);
    }
  }, dependencies: [CommonModule, NgClass, NgIf, NgStyle, TooltipModule, Tooltip], styles: ["\n\n.block-section[_ngcontent-%COMP%] {\n  margin-bottom: 4rem;\n}\n.block-header[_ngcontent-%COMP%] {\n  padding: 1rem 2rem;\n  background-color: var(--surface-card);\n  border-top-left-radius: 4px;\n  border-top-right-radius: 4px;\n  border: 1px solid var(--surface-border);\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n.block-header[_ngcontent-%COMP%]   .block-title[_ngcontent-%COMP%] {\n  font-weight: 700;\n  display: inline-flex;\n  align-items: center;\n}\n.block-header[_ngcontent-%COMP%]   .block-title[_ngcontent-%COMP%]   .badge-free[_ngcontent-%COMP%] {\n  border-radius: 4px;\n  padding: 0.25rem 0.5rem;\n  background-color: var(--p-orange-500);\n  color: white;\n  margin-left: 1rem;\n  font-weight: 700;\n  font-size: 0.875rem;\n}\n.block-header[_ngcontent-%COMP%]   .block-actions[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  -webkit-user-select: none;\n  user-select: none;\n  margin-left: 1rem;\n}\n.block-header[_ngcontent-%COMP%]   .block-actions[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  margin-right: 0.75rem;\n  padding: 0.5rem 1rem;\n  border-radius: 4px;\n  border: 1px solid transparent;\n  transition: background-color 0.2s;\n  cursor: pointer;\n}\n.block-header[_ngcontent-%COMP%]   .block-actions[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:last-child {\n  margin-right: 0;\n}\n.block-header[_ngcontent-%COMP%]   .block-actions[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:not(.block-action-disabled):hover {\n  background-color: var(--surface-hover);\n}\n.block-header[_ngcontent-%COMP%]   .block-actions[_ngcontent-%COMP%]   a.block-action-active[_ngcontent-%COMP%] {\n  border-color: var(--primary-color);\n  color: var(--primary-color);\n}\n.block-header[_ngcontent-%COMP%]   .block-actions[_ngcontent-%COMP%]   a.block-action-copy[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--primary-color);\n  font-size: 1.25rem;\n}\n.block-header[_ngcontent-%COMP%]   .block-actions[_ngcontent-%COMP%]   a.block-action-disabled[_ngcontent-%COMP%] {\n  opacity: 0.6;\n  cursor: auto !important;\n}\n.block-header[_ngcontent-%COMP%]   .block-actions[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  margin-right: 0.5rem;\n}\n.block-content[_ngcontent-%COMP%] {\n  padding: 0;\n  border: 1px solid var(--surface-border);\n  border-top: 0 none;\n}\npre[class*=language-][_ngcontent-%COMP%] {\n  margin: 0 !important;\n}\npre[class*=language-][_ngcontent-%COMP%]:before, \npre[class*=language-][_ngcontent-%COMP%]:after {\n  display: none !important;\n}\npre[class*=language-][_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n  border-left: 0 none !important;\n  box-shadow: none !important;\n  background: var(--surface-card) !important;\n  margin: 0;\n  color: var(--text-color);\n  font-size: 14px;\n  padding: 0 2rem !important;\n}\npre[class*=language-][_ngcontent-%COMP%]   code[_ngcontent-%COMP%]   .token.tag[_ngcontent-%COMP%], \npre[class*=language-][_ngcontent-%COMP%]   code[_ngcontent-%COMP%]   .token.keyword[_ngcontent-%COMP%] {\n  color: #2196f3 !important;\n}\npre[class*=language-][_ngcontent-%COMP%]   code[_ngcontent-%COMP%]   .token.attr-name[_ngcontent-%COMP%], \npre[class*=language-][_ngcontent-%COMP%]   code[_ngcontent-%COMP%]   .token.attr-string[_ngcontent-%COMP%] {\n  color: #2196f3 !important;\n}\npre[class*=language-][_ngcontent-%COMP%]   code[_ngcontent-%COMP%]   .token.attr-value[_ngcontent-%COMP%] {\n  color: #4caf50 !important;\n}\npre[class*=language-][_ngcontent-%COMP%]   code[_ngcontent-%COMP%]   .token.punctuation[_ngcontent-%COMP%] {\n  color: var(--text-color);\n}\npre[class*=language-][_ngcontent-%COMP%]   code[_ngcontent-%COMP%]   .token.operator[_ngcontent-%COMP%], \npre[class*=language-][_ngcontent-%COMP%]   code[_ngcontent-%COMP%]   .token.string[_ngcontent-%COMP%] {\n  background: transparent;\n}\n@media screen and (max-width: 575px) {\n  .block-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: start;\n  }\n  .block-header[_ngcontent-%COMP%]   .block-actions[_ngcontent-%COMP%] {\n    margin-top: 1rem;\n    margin-left: 0;\n  }\n}\n/*# sourceMappingURL=blockviewer.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BlockViewer, { className: "BlockViewer", filePath: "src/app/pages/blocks/components/blockviewer.ts", lineNumber: 196 });
})();

// src/app/pages/blocks/blocks.ts
var Blocks = class _Blocks {
  block1 = `
  <div class="grid grid-cols-12 gap-4 grid-nogutter bg-surface-0 dark:bg-surface-950 text-surface-800 dark:text-surface-50">
    <div class="col-span-12 md:col-span-6 p-12 text-center md:text-left flex items-center ">
        <section>
            <span class="block text-6xl font-bold mb-1">Create the screens </span>
            <div class="text-6xl text-primary font-bold mb-4">your visitors deserve to see</div>
            <p class="mt-0 mb-6 text-surface-700 dark:text-surface-100 leading-normal">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

            <p-button label="Learn More" type="button" class="mr-4" raised></p-button>
            <p-button label="Live Demo" type="button" outlined></p-button>
        </section>
    </div>
    <div class="col-span-12 md:col-span-6 overflow-hidden">
        <img src="/images/blocks/hero/hero-1.png" alt="Image" class="md:ml-auto block md:h-full" style="clip-path: polygon(8% 0, 100% 0%, 100% 100%, 0 100%)">
    </div>
 </div>`;
  block2 = `
  <div class="bg-surface-0 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20 text-center">
    <div class="mb-4 font-bold text-3xl">
        <span class="text-surface-900 dark:text-surface-0">One Product, </span>
        <span class="text-primary">Many Solutions</span>
    </div>
    <div class="text-surface-700 dark:text-surface-100 mb-12">Ac turpis egestas maecenas pharetra convallis posuere morbi leo urna.</div>
    <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 md:col-span-4 mb-6 px-8">
            <span class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900" style="border-radius: 10px">
                <i class="pi pi-desktop text-4xl text-primary"></i>
            </span>
            <div class="text-surface-900 dark:text-surface-0 text-xl mb-4 font-medium">Built for Developers</div>
            <span class="text-surface-700 dark:text-surface-100 leading-normal">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</span>
        </div>
        <div class="col-span-12 md:col-span-4 mb-6 px-8">
            <span class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900" style="border-radius: 10px">
                <i class="pi pi-lock text-4xl text-primary"></i>
            </span>
            <div class="text-surface-900 dark:text-surface-0 text-xl mb-4 font-medium">End-to-End Encryption</div>
            <span class="text-surface-700 dark:text-surface-100 leading-normal">Risus nec feugiat in fermentum posuere urna nec. Posuere sollicitudin aliquam ultrices sagittis.</span>
        </div>
        <div class="col-span-12 md:col-span-4 mb-6 px-8">
            <span class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900" style="border-radius: 10px">
                <i class="pi pi-check-circle text-4xl text-primary"></i>
            </span>
            <div class="text-surface-900 dark:text-surface-0 text-xl mb-4 font-medium">Easy to Use</div>
            <span class="text-surface-700 dark:text-surface-100 leading-normal">Ornare suspendisse sed nisi lacus sed viverra tellus. Neque volutpat ac tincidunt vitae semper.</span>
        </div>
        <div class="col-span-12 md:col-span-4 mb-6 px-8">
            <span class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900" style="border-radius: 10px">
                <i class="pi pi-globe text-4xl text-primary"></i>
            </span>
            <div class="text-surface-900 dark:text-surface-0 text-xl mb-4 font-medium">Fast & Global Support</div>
            <span class="text-surface-700 dark:text-surface-100 leading-normal">Fermentum et sollicitudin ac orci phasellus egestas tellus rutrum tellus.</span>
        </div>
        <div class="col-span-12 md:col-span-4 mb-6 px-8">
            <span class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900" style="border-radius: 10px">
                <i class="pi pi-github text-4xl text-primary"></i>
            </span>
            <div class="text-surface-900 dark:text-surface-0 text-xl mb-4 font-medium">Open Source</div>
            <span class="text-surface-700 dark:text-surface-100 leading-normal">Nec tincidunt praesent semper feugiat. Sed adipiscing diam donec adipiscing tristique risus nec feugiat. </span>
        </div>
        <div class="col-span-12 md:col-span-4 md:mb-6 mb-0 px-4">
            <span class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900" style="border-radius: 10px">
                <i class="pi pi-shield text-4xl text-primary"></i>
            </span>
            <div class="text-surface-900 dark:text-surface-0 text-xl mb-4 font-medium">Trusted Securitty</div>
            <span class="text-surface-700 dark:text-surface-100 leading-normal">Mattis rhoncus urna neque viverra justo nec ultrices. Id cursus metus aliquam eleifend.</span>
        </div>
    </div>
  </div>`;
  block3 = `
  <div class="bg-surface-50 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
    <div class="text-surface-900 dark:text-surface-0 font-bold text-6xl mb-6 text-center">Pricing Plans</div>
    <div class="text-surface-700 dark:text-surface-100 text-xl mb-12 text-center leading-normal">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit numquam eligendi quos.</div>

    <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 lg:col-span-4">
            <div class="p-4 h-full">
                <div class="shadow p-4 h-full flex flex-col bg-surface-0 dark:bg-surface-900" style="border-radius: 6px">
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Basic</div>
                    <div class="text-surface-600 dark:text-surface-200">Plan description</div>
                    <hr class="my-4 mx-0 border-t border-0 border-surface-200 dark:border-surface-700" />
                    <div class="flex items-center">
                        <span class="font-bold text-2xl text-surface-900 dark:text-surface-0">$9</span>
                        <span class="ml-2 font-medium text-surface-600 dark:text-surface-200">per month</span>
                    </div>
                    <hr class="my-4 mx-0 border-t border-0 border-surface-200 dark:border-surface-700" />
                    <ul class="list-none p-0 m-0 flex-grow-1">
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span class="text-surface-900 dark:text-surface-0">Arcu vitae elementum</span>
                        </li>
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span class="text-surface-900 dark:text-surface-0">Dui faucibus in ornare</span>
                        </li>
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span class="text-surface-900 dark:text-surface-0">Morbi tincidunt augue</span>
                        </li>
                    </ul>
                    <hr class="mt-auto mb-4 mx-0 border-t border-0 border-surface-200 dark:border-surface-700" />
                    <p-button label="Buy Now" styleClass="p-4 w-full"></p-button>
                </div>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-4">
            <div class="p-4 h-full">
                <div class="shadow p-4 h-full flex flex-col bg-surface-0 dark:bg-surface-900" style="border-radius: 6px">
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Premium</div>
                    <div class="text-surface-600 dark:text-surface-200">Plan description</div>
                    <hr class="my-4 mx-0 border-t border-0 border-surface-200 dark:border-surface-700" />
                    <div class="flex items-center">
                        <span class="font-bold text-2xl text-surface-900 dark:text-surface-0">$29</span>
                        <span class="ml-2 font-medium text-surface-600 dark:text-surface-200">per month</span>
                    </div>
                    <hr class="my-4 mx-0 border-t border-0 border-surface-200 dark:border-surface-700" />
                    <ul class="list-none p-0 m-0 flex-grow-1">
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span class="text-surface-900 dark:text-surface-0">Arcu vitae elementum</span>
                        </li>
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span class="text-surface-900 dark:text-surface-0">Dui faucibus in ornare</span>
                        </li>
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span class="text-surface-900 dark:text-surface-0">Morbi tincidunt augue</span>
                        </li>
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span class="text-surface-900 dark:text-surface-0">Duis ultricies lacus sed</span>
                        </li>
                    </ul>
                    <hr class="mt-auto mb-4 mx-0 border-t border-0 border-surface-200 dark:border-surface-700" />
                    <p-button label="Buy Now" styleClass="p-4 w-full"></p-button>
                </div>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-4">
            <div class="p-4 h-full">
                <div class="shadow p-4 flex flex-col bg-surface-0 dark:bg-surface-900" style="border-radius: 6px">
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Enterprise</div>
                    <div class="text-surface-600 dark:text-surface-200">Plan description</div>
                    <hr class="my-4 mx-0 border-t border-0 border-surface-200 dark:border-surface-700" />
                    <div class="flex items-center">
                        <span class="font-bold text-2xl text-surface-900 dark:text-surface-0">$49</span>
                        <span class="ml-2 font-medium text-surface-600 dark:text-surface-200">per month</span>
                    </div>
                    <hr class="my-4 mx-0 border-t border-0 border-surface-200 dark:border-surface-700" />
                    <ul class="list-none p-0 m-0 flex-grow-1">
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span class="text-surface-900 dark:text-surface-0">Arcu vitae elementum</span>
                        </li>
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span class="text-surface-900 dark:text-surface-0">Dui faucibus in ornare</span>
                        </li>
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span class="text-surface-900 dark:text-surface-0">Morbi tincidunt augue</span>
                        </li>
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span class="text-surface-900 dark:text-surface-0">Duis ultricies lacus sed</span>
                        </li>
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span class="text-surface-900 dark:text-surface-0">Imperdiet proin</span>
                        </li>
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span class="text-surface-900 dark:text-surface-0">Nisi scelerisque</span>
                        </li>
                    </ul>
                    <hr class="mb-4 mx-0 border-t border-0 border-surface-200 dark:border-surface-700" />
                    <p-button label="Buy Now" styleClass="p-4 w-full" outlined></p-button>
                </div>
            </div>
        </div>
    </div>
  </div>`;
  block4 = `
  <div class="bg-surface-0 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
    <div class="text-surface-700 dark:text-surface-100 text-center">
        <div class="text-primary font-bold mb-4"><i class="pi pi-discord"></i>&nbsp;POWERED BY DISCORD</div>
        <div class="text-surface-900 dark:text-surface-0 font-bold text-5xl mb-4">Join Our Design Community</div>
        <div class="text-surface-700 dark:text-surface-100 text-2xl mb-8">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit numquam eligendi quos.</div>
        <p-button label="Join Now" icon="pi pi-discord" class="font-bold px-8 py-4 whitespace-nowrap" raised rounded></p-button>
    </div>
  </div>`;
  block5 = `
  <div class="bg-slate-900 text-gray-100 p-4 flex justify-between lg:justify-center items-center flex-wrap">
    <div class="font-bold mr-20">\u{1F525} Hot Deals!</div>
    <div class="items-center hidden lg:flex">
        <span class="leading-normal">Libero voluptatum atque exercitationem praesentium provident odit.</span>
    </div>
    <a class="flex items-center ml-2 mr-20">
        <a class="text-white" href="#"><span class="underline font-bold">Learn More</span></a>
    </a>
    <a  class=" flex items-center no-underline justify-center rounded-full text-gray-50 hover:bg-slate-700 cursor-pointer transition-colors duration-150" style="width:2rem; height: 2rem">
        <i class="pi pi-times"></i>
    </a>
  </div>`;
  block6 = `
  <div class="bg-surface-0 dark:bg-surface-950 px-6 py-8 md:px-12 lg:px-20">
    <ul class="list-none p-0 m-0 flex items-center font-medium mb-4">
        <li>
            <a class="text-surface-500 dark:text-surface-300 no-underline leading-normal cursor-pointer">Application</a>
        </li>
        <li class="px-2">
            <i class="pi pi-angle-right text-surface-500 dark:text-surface-300 leading-normal"></i>
        </li>
        <li>
            <span class="text-surface-900 dark:text-surface-0 leading-normal">Analytics</span>
        </li>
    </ul>
    <div class="flex items-start flex-col lg:justify-between lg:flex-row">
        <div>
            <div class="font-medium text-3xl text-surface-900 dark:text-surface-0">Customers</div>
            <div class="flex items-center text-surface-700 dark:text-surface-100 flex-wrap">
                <div class="mr-8 flex items-center mt-4">
                    <i class="pi pi-users mr-2"></i>
                    <span>332 Active Users</span>
                </div>
                <div class="mr-8 flex items-center mt-4">
                    <i class="pi pi-globe mr-2"></i>
                    <span>9402 Sessions</span>
                </div>
                <div class="flex items-center mt-4">
                    <i class="pi pi-clock mr-2"></i>
                    <span>2.32m Avg. Duration</span>
                </div>
            </div>
        </div>
        <div class="mt-4 lg:mt-0">
            <p-button label="Add" styleClass="mr-2" outlined icon="pi pi-user-plus"></p-button>
            <p-button label="Save" icon="pi pi-check"></p-button>
        </div>
    </div>
  </div>`;
  block7 = `
  <div class="bg-surface-50 dark:bg-surface-950 px-6 py-8 md:px-12 lg:px-20">
    <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 md:col-span-6 lg:col-span-3">
            <div class="bg-surface-0 dark:bg-surface-900 shadow p-4 rounded">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Orders</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 rounded" style="width:2.5rem;height:2.5rem">
                        <i class="pi pi-shopping-cart text-primary text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">24 new </span>
                <span class="text-surface-500 dark:text-surface-300">since last visit</span>
            </div>
        </div>
        <div class="col-span-12 md:col-span-6 lg:col-span-3">
            <div class="bg-surface-0 dark:bg-surface-900 shadow p-4 rounded">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Revenue</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">$2.100</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 rounded" style="width:2.5rem;height:2.5rem">
                        <i class="pi pi-map-marker text-orange-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">%52+ </span>
                <span class="text-surface-500 dark:text-surface-300">since last week</span>
            </div>
        </div>
        <div class="col-span-12 md:col-span-6 lg:col-span-3">
            <div class="bg-surface-0 dark:bg-surface-900 shadow p-4 rounded">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Customers</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">28441</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 rounded" style="width:2.5rem;height:2.5rem">
                        <i class="pi pi-inbox text-cyan-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">520  </span>
                <span class="text-surface-500 dark:text-surface-300">newly registered</span>
            </div>
        </div>
        <div class="col-span-12 md:col-span-6 lg:col-span-3">
            <div class="bg-surface-0 dark:bg-surface-900 shadow p-4 rounded">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Comments</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152 Unread</div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 rounded" style="width:2.5rem;height:2.5rem">
                        <i class="pi pi-comment text-purple-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">85 </span>
                <span class="text-surface-500 dark:text-surface-300">responded</span>
            </div>
        </div>
    </div>
  </div>`;
  block8 = `
  <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded w-full lg:w-6/12">
    <div class="text-center mb-8">
        <img src="/images/blocks/logos/hyper.svg" alt="Image" height="50" class="mb-4">
        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome Back</div>
        <span class="text-surface-600 dark:text-surface-200 font-medium leading-normal">Don't have an account?</span>
        <a class="font-medium no-underline ml-2 text-primary cursor-pointer">Create today!</a>
    </div>

    <div>
        <label for="email1" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">Email</label>
        <input pInputText id="email1" type="text" placeholder="Email address" class="w-full mb-4" />

        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">Password</label>
        <input pInputText id="password1" type="password" placeholder="Password" class="w-full mb-4" />

        <div class="flex items-center justify-between mb-12">
            <div class="flex items-center">
                <p-checkbox id="rememberme1" [binary]="true" [(ngModel)]="checked" class="mr-2 block"></p-checkbox>
                <label for="rememberme1" class="text-surface-900 dark:text-surface-0">Remember me</label>
            </div>
            <a class="font-medium no-underline ml-2 text-primary text-right cursor-pointer">Forgot password?</a>
        </div>

        <p-button label="Sign In" icon="pi pi-user" class="w-full"></p-button>
    </div>
  </div>`;
  block9 = `
  <div class="bg-surface-0 dark:bg-surface-950">
    <div class="font-medium text-3xl text-surface-900 dark:text-surface-0 mb-4">Movie Information</div>
    <div class="text-surface-500 dark:text-surface-300 mb-8">Morbi tristique blandit turpis. In viverra ligula id nulla hendrerit rutrum.</div>
    <ul class="list-none p-0 m-0">
        <li class="flex items-center py-4 px-2 border-t border-surface-200 dark:border-surface-700 flex-wrap">
            <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium">Title</div>
            <div class="text-surface-900 dark:text-surface-0 w-full md:w-8/12 md:order-none order-1">Heat</div>
            <div class="w-6/12 md:w-2/12 flex justify-end">
                <p-button label="Edit" icon="pi pi-pencil" text></p-button>
            </div>
        </li>
        <li class="flex items-center py-4 px-2 border-t border-surface-200 dark:border-surface-700 flex-wrap">
            <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium">Genre</div>
            <div class="text-surface-900 dark:text-surface-0 w-full md:w-8/12 md:order-none order-1">
                <p-chip label="Crime" styleClass="mr-2"></p-chip>
                <p-chip label="Drama" styleClass="mr-2"></p-chip>
                <p-chip label="Thriller"></p-chip>
            </div>
            <div class="w-6/12 md:w-2/12 flex justify-end">
                <p-button label="Edit" icon="pi pi-pencil" text></p-button>
            </div>
        </li>
        <li class="flex items-center py-4 px-2 border-t border-surface-200 dark:border-surface-700 flex-wrap">
            <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium">Director</div>
            <div class="text-surface-900 dark:text-surface-0 w-full md:w-8/12 md:order-none order-1">Michael Mann</div>
            <div class="w-6/12 md:w-2/12 flex justify-end">
                <p-button label="Edit" icon="pi pi-pencil" text></p-button>
            </div>
        </li>
        <li class="flex items-center py-4 px-2 border-t border-surface-200 dark:border-surface-700 flex-wrap">
            <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium">Actors</div>
            <div class="text-surface-900 dark:text-surface-0 w-full md:w-8/12 md:order-none order-1">Robert De Niro, Al Pacino</div>
            <div class="w-6/12 md:w-2/12 flex justify-end">
                <p-button label="Edit" icon="pi pi-pencil" text></p-button>
            </div>
        </li>
        <li class="flex items-center py-4 px-2 border-t border-b border-surface-200 dark:border-surface-700 flex-wrap">
            <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium">Plot</div>
            <div class="text-surface-900 dark:text-surface-0 w-full md:w-8/12 md:order-none order-1 leading-normal">
                A group of professional bank robbers start to feel the heat from police
                when they unknowingly leave a clue at their latest heist.</div>
            <div class="w-6/12 md:w-2/12 flex justify-end">
                <p-button label="Edit" icon="pi pi-pencil" text></p-button>
            </div>
        </li>
    </ul>
  </div>`;
  block10 = `
  <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded">
    <div class="text-3xl font-medium text-surface-900 dark:text-surface-0 mb-4">Card Title</div>
    <div class="font-medium text-surface-500 dark:text-surface-300 mb-4">Vivamus id nisl interdum, blandit augue sit amet, eleifend mi.</div>
    <div style="height: 150px" class="border-2 border-dashed border-surface-200 dark:border-surface-700"></div>
  </div>`;
  checked = false;
  static \u0275fac = function Blocks_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Blocks)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Blocks, selectors: [["app-blocks"]], decls: 369, vars: 11, consts: [["header", "Hero", "free", "", 3, "code"], [1, "grid", "grid-cols-12", "gap-4", "grid-nogutter", "bg-surface-0", "dark:bg-surface-950", "text-surface-800", "dark:text-surface-50"], [1, "col-span-12", "md:col-span-6", "p-12", "text-center", "md:text-left", "flex", "items-center"], [1, "block", "text-6xl", "font-bold", "mb-1"], [1, "text-6xl", "text-primary", "font-bold", "mb-4"], [1, "mt-0", "mb-6", "text-surface-700", "dark:text-surface-100", "leading-normal"], ["label", "Learn More", "type", "button", "raised", "", 1, "mr-4"], ["label", "Live Demo", "type", "button", "outlined", ""], [1, "col-span-12", "md:col-span-6", "overflow-hidden"], ["src", "/images/blocks/hero/hero-1.png", "alt", "Image", 1, "md:ml-auto", "block", "md:h-full", 2, "clip-path", "polygon(8% 0, 100% 0%, 100% 100%, 0 100%)"], ["header", "Feature", "free", "", 3, "code"], [1, "bg-surface-0", "dark:bg-surface-950", "px-6", "py-20", "md:px-12", "lg:px-20", "text-center"], [1, "mb-4", "font-bold", "text-3xl"], [1, "text-surface-900", "dark:text-surface-0"], [1, "text-primary"], [1, "text-surface-700", "dark:text-surface-100", "mb-12"], [1, "grid", "grid-cols-12", "gap-4"], [1, "col-span-12", "md:col-span-4", "mb-6", "px-8"], [1, "p-4", "shadow", "mb-4", "inline-block", "bg-surface-0", "dark:bg-surface-900", 2, "border-radius", "10px"], [1, "pi", "pi-desktop", "text-4xl", "text-primary"], [1, "text-surface-900", "dark:text-surface-0", "text-xl", "mb-4", "font-medium"], [1, "text-surface-700", "dark:text-surface-100", "leading-normal"], [1, "pi", "pi-lock", "text-4xl", "text-primary"], [1, "pi", "pi-check-circle", "text-4xl", "text-primary"], [1, "pi", "pi-globe", "text-4xl", "text-primary"], [1, "pi", "pi-github", "text-4xl", "text-primary"], [1, "col-span-12", "md:col-span-4", "md:mb-6", "mb-0", "px-4"], [1, "pi", "pi-shield", "text-4xl", "text-primary"], ["header", "Pricing", "free", "", 3, "code"], [1, "bg-surface-50", "dark:bg-surface-950", "px-6", "py-20", "md:px-12", "lg:px-20"], [1, "text-surface-900", "dark:text-surface-0", "font-bold", "text-6xl", "mb-6", "text-center"], [1, "text-surface-700", "dark:text-surface-100", "text-xl", "mb-12", "text-center", "leading-normal"], [1, "col-span-12", "lg:col-span-4"], [1, "p-4", "h-full"], [1, "shadow", "p-4", "h-full", "flex", "flex-col", "bg-surface-0", "dark:bg-surface-900", 2, "border-radius", "6px"], [1, "text-surface-900", "dark:text-surface-0", "font-medium", "text-xl", "mb-2"], [1, "text-surface-600", "dark:text-surface-200"], [1, "my-4", "mx-0", "border-t", "border-0", "border-surface-200", "dark:border-surface-700"], [1, "flex", "items-center"], [1, "font-bold", "text-2xl", "text-surface-900", "dark:text-surface-0"], [1, "ml-2", "font-medium", "text-surface-600", "dark:text-surface-200"], [1, "list-none", "p-0", "m-0", "flex-grow-1"], [1, "flex", "items-center", "mb-4"], [1, "pi", "pi-check-circle", "text-green-500", "mr-2"], [1, "mt-auto", "mb-4", "mx-0", "border-t", "border-0", "border-surface-200", "dark:border-surface-700"], ["label", "Buy Now", "styleClass", "p-4 w-full"], [1, "shadow", "p-4", "flex", "flex-col", "bg-surface-0", "dark:bg-surface-900", 2, "border-radius", "6px"], [1, "mb-4", "mx-0", "border-t", "border-0", "border-surface-200", "dark:border-surface-700"], ["label", "Buy Now", "styleClass", "p-4 w-full", "outlined", ""], ["header", "Call to Action", "free", "", 3, "code"], [1, "bg-surface-0", "dark:bg-surface-950", "px-6", "py-20", "md:px-12", "lg:px-20"], [1, "text-surface-700", "dark:text-surface-100", "text-center"], [1, "text-primary", "font-bold", "mb-4"], [1, "pi", "pi-discord"], [1, "text-surface-900", "dark:text-surface-0", "font-bold", "text-5xl", "mb-4"], [1, "text-surface-700", "dark:text-surface-100", "text-2xl", "mb-8"], ["label", "Join Now", "icon", "pi pi-discord", "raised", "", "rounded", "", 1, "font-bold", "px-8", "py-4", "whitespace-nowrap"], ["header", "Banner", "containerClass", "bg-surface-0 dark:bg-surface-950 py-20", "free", "", 3, "code"], [1, "bg-slate-900", "text-gray-100", "p-4", "flex", "justify-between", "lg:justify-center", "items-center", "flex-wrap"], [1, "font-bold", "mr-20"], [1, "items-center", "hidden", "lg:flex"], [1, "leading-normal"], [1, "flex", "items-center", "ml-2", "mr-20"], ["href", "#", 1, "text-white"], [1, "underline", "font-bold"], [1, "flex", "items-center", "no-underline", "justify-center", "rounded-full", "text-gray-50", "hover:bg-slate-700", "cursor-pointer", "transition-colors", "duration-150", 2, "width", "2rem", "height", "2rem"], [1, "pi", "pi-times"], [1, "block-category-title"], ["header", "Page Heading", "free", "", 3, "code"], [1, "bg-surface-0", "dark:bg-surface-950", "px-6", "py-8", "md:px-12", "lg:px-20"], [1, "list-none", "p-0", "m-0", "flex", "items-center", "font-medium", "mb-4"], [1, "text-surface-500", "dark:text-surface-300", "no-underline", "leading-normal", "cursor-pointer"], [1, "px-2"], [1, "pi", "pi-angle-right", "text-surface-500", "dark:text-surface-300", "leading-normal"], [1, "text-surface-900", "dark:text-surface-0", "leading-normal"], [1, "flex", "items-start", "flex-col", "lg:justify-between", "lg:flex-row"], [1, "font-medium", "text-3xl", "text-surface-900", "dark:text-surface-0"], [1, "flex", "items-center", "text-surface-700", "dark:text-surface-100", "flex-wrap"], [1, "mr-8", "flex", "items-center", "mt-4"], [1, "pi", "pi-users", "mr-2"], [1, "pi", "pi-globe", "mr-2"], [1, "flex", "items-center", "mt-4"], [1, "pi", "pi-clock", "mr-2"], [1, "mt-4", "lg:mt-0"], ["label", "Add", "styleClass", "mr-2", "outlined", "", "icon", "pi pi-user-plus"], ["label", "Save", "icon", "pi pi-check"], ["header", "Stats", "free", "", 3, "code"], [1, "bg-surface-50", "dark:bg-surface-950", "px-6", "py-8", "md:px-12", "lg:px-20"], [1, "col-span-12", "md:col-span-6", "lg:col-span-3"], [1, "bg-surface-0", "dark:bg-surface-900", "shadow", "p-4", "rounded"], [1, "flex", "justify-between", "mb-4"], [1, "block", "text-surface-500", "dark:text-surface-300", "font-medium", "mb-4"], [1, "text-surface-900", "dark:text-surface-0", "font-medium", "text-xl"], [1, "flex", "items-center", "justify-center", "bg-blue-100", "rounded", 2, "width", "2.5rem", "height", "2.5rem"], [1, "pi", "pi-shopping-cart", "text-primary", "text-xl"], [1, "text-green-500", "font-medium"], [1, "text-surface-500", "dark:text-surface-300"], [1, "flex", "items-center", "justify-center", "bg-orange-100", "rounded", 2, "width", "2.5rem", "height", "2.5rem"], [1, "pi", "pi-map-marker", "text-orange-500", "text-xl"], [1, "flex", "items-center", "justify-center", "bg-cyan-100", "rounded", 2, "width", "2.5rem", "height", "2.5rem"], [1, "pi", "pi-inbox", "text-cyan-500", "text-xl"], [1, "flex", "items-center", "justify-center", "bg-purple-100", "rounded", 2, "width", "2.5rem", "height", "2.5rem"], [1, "pi", "pi-comment", "text-purple-500", "text-xl"], ["header", "Sign-In", "containerClass", "bg-surface-50 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20 flex items-center justify-center", "free", "", 3, "code"], [1, "bg-surface-0", "dark:bg-surface-900", "p-6", "shadow", "rounded", "w-full", "lg:w-6/12"], [1, "text-center", "mb-8"], ["src", "/images/blocks/logos/hyper.svg", "alt", "Image", "height", "50", 1, "mb-4", "mx-auto"], [1, "text-surface-900", "dark:text-surface-0", "text-3xl", "font-medium", "mb-4"], [1, "text-surface-600", "dark:text-surface-200", "font-medium", "leading-normal"], [1, "font-medium", "no-underline", "ml-2", "text-primary", "cursor-pointer"], ["for", "email1", 1, "block", "text-surface-900", "dark:text-surface-0", "font-medium", "mb-2"], ["pInputText", "", "id", "email1", "type", "text", "placeholder", "Email address", 1, "w-full", "mb-4"], ["for", "password1", 1, "block", "text-surface-900", "dark:text-surface-0", "font-medium", "mb-2"], ["pInputText", "", "id", "password1", "type", "password", "placeholder", "Password", 1, "w-full", "mb-4"], [1, "flex", "items-center", "justify-between", "mb-12"], ["id", "rememberme1", "binary", "", 1, "mr-2", 3, "ngModelChange", "ngModel"], ["for", "rememberme1", 1, "text-surface-900", "dark:text-surface-0"], [1, "font-medium", "no-underline", "ml-2", "text-primary", "text-right", "cursor-pointer"], ["label", "Sign In", "icon", "pi pi-user", 1, "w-full"], ["header", "Description List", "containerClass", "bg-surface-0 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20", "free", "", 3, "code"], [1, "bg-surface-0", "dark:bg-surface-950"], [1, "font-medium", "text-3xl", "text-surface-900", "dark:text-surface-0", "mb-4"], [1, "text-surface-500", "dark:text-surface-300", "mb-8"], [1, "list-none", "p-0", "m-0"], [1, "flex", "items-center", "py-4", "px-2", "border-t", "border-surface-200", "dark:border-surface-700", "flex-wrap"], [1, "text-surface-500", "dark:text-surface-300", "w-6/12", "md:w-2/12", "font-medium"], [1, "text-surface-900", "dark:text-surface-0", "w-full", "md:w-8/12", "md:order-none", "order-1"], [1, "w-6/12", "md:w-2/12", "flex", "justify-end"], ["label", "Edit", "icon", "pi pi-pencil", "text", ""], ["label", "Crime", "styleClass", "mr-2"], ["label", "Drama", "styleClass", "mr-2"], ["label", "Thriller"], [1, "flex", "items-center", "py-4", "px-2", "border-t", "border-b", "border-surface-200", "dark:border-surface-700", "flex-wrap"], [1, "text-surface-900", "dark:text-surface-0", "w-full", "md:w-8/12", "md:order-none", "order-1", "leading-normal"], ["header", "Card", "containerClass", "px-6 py-20 md:px-12 lg:px-20", "free", "", 3, "code"], [1, "bg-surface-0", "dark:bg-surface-900", "p-6", "shadow", "rounded"], [1, "text-3xl", "font-medium", "text-surface-900", "dark:text-surface-0", "mb-4"], [1, "font-medium", "text-surface-500", "dark:text-surface-300", "mb-4"], [1, "border-2", "border-dashed", "border-surface-200", "dark:border-surface-700", 2, "height", "150px"]], template: function Blocks_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div")(1, "block-viewer", 0)(2, "div", 1)(3, "div", 2)(4, "section")(5, "span", 3);
      \u0275\u0275text(6, "Create the screens ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "div", 4);
      \u0275\u0275text(8, "your visitors deserve to see");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "p", 5);
      \u0275\u0275text(10, "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.");
      \u0275\u0275elementEnd();
      \u0275\u0275element(11, "p-button", 6)(12, "p-button", 7);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(13, "div", 8);
      \u0275\u0275element(14, "img", 9);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(15, "block-viewer", 10)(16, "div", 11)(17, "div", 12)(18, "span", 13);
      \u0275\u0275text(19, "One Product, ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "span", 14);
      \u0275\u0275text(21, "Many Solutions");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(22, "div", 15);
      \u0275\u0275text(23, "Ac turpis egestas maecenas pharetra convallis posuere morbi leo urna.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "div", 16)(25, "div", 17)(26, "span", 18);
      \u0275\u0275element(27, "i", 19);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "div", 20);
      \u0275\u0275text(29, "Built for Developers");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "span", 21);
      \u0275\u0275text(31, "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(32, "div", 17)(33, "span", 18);
      \u0275\u0275element(34, "i", 22);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(35, "div", 20);
      \u0275\u0275text(36, "End-to-End Encryption");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "span", 21);
      \u0275\u0275text(38, "Risus nec feugiat in fermentum posuere urna nec. Posuere sollicitudin aliquam ultrices sagittis.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(39, "div", 17)(40, "span", 18);
      \u0275\u0275element(41, "i", 23);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(42, "div", 20);
      \u0275\u0275text(43, "Easy to Use");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(44, "span", 21);
      \u0275\u0275text(45, "Ornare suspendisse sed nisi lacus sed viverra tellus. Neque volutpat ac tincidunt vitae semper.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(46, "div", 17)(47, "span", 18);
      \u0275\u0275element(48, "i", 24);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(49, "div", 20);
      \u0275\u0275text(50, "Fast & Global Support");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(51, "span", 21);
      \u0275\u0275text(52, "Fermentum et sollicitudin ac orci phasellus egestas tellus rutrum tellus.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(53, "div", 17)(54, "span", 18);
      \u0275\u0275element(55, "i", 25);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(56, "div", 20);
      \u0275\u0275text(57, "Open Source");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(58, "span", 21);
      \u0275\u0275text(59, "Nec tincidunt praesent semper feugiat. Sed adipiscing diam donec adipiscing tristique risus nec feugiat. ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(60, "div", 26)(61, "span", 18);
      \u0275\u0275element(62, "i", 27);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(63, "div", 20);
      \u0275\u0275text(64, "Trusted Securitty");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(65, "span", 21);
      \u0275\u0275text(66, "Mattis rhoncus urna neque viverra justo nec ultrices. Id cursus metus aliquam eleifend.");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(67, "block-viewer", 28)(68, "div", 29)(69, "div", 30);
      \u0275\u0275text(70, "Pricing Plans");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(71, "div", 31);
      \u0275\u0275text(72, "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit numquam eligendi quos.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(73, "div", 16)(74, "div", 32)(75, "div", 33)(76, "div", 34)(77, "div", 35);
      \u0275\u0275text(78, "Basic");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(79, "div", 36);
      \u0275\u0275text(80, "Plan description");
      \u0275\u0275elementEnd();
      \u0275\u0275element(81, "hr", 37);
      \u0275\u0275elementStart(82, "div", 38)(83, "span", 39);
      \u0275\u0275text(84, "$9");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(85, "span", 40);
      \u0275\u0275text(86, "per month");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(87, "hr", 37);
      \u0275\u0275elementStart(88, "ul", 41)(89, "li", 42);
      \u0275\u0275element(90, "i", 43);
      \u0275\u0275elementStart(91, "span", 13);
      \u0275\u0275text(92, "Arcu vitae elementum");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(93, "li", 42);
      \u0275\u0275element(94, "i", 43);
      \u0275\u0275elementStart(95, "span", 13);
      \u0275\u0275text(96, "Dui faucibus in ornare");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(97, "li", 42);
      \u0275\u0275element(98, "i", 43);
      \u0275\u0275elementStart(99, "span", 13);
      \u0275\u0275text(100, "Morbi tincidunt augue");
      \u0275\u0275elementEnd()()();
      \u0275\u0275element(101, "hr", 44)(102, "p-button", 45);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(103, "div", 32)(104, "div", 33)(105, "div", 34)(106, "div", 35);
      \u0275\u0275text(107, "Premium");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(108, "div", 36);
      \u0275\u0275text(109, "Plan description");
      \u0275\u0275elementEnd();
      \u0275\u0275element(110, "hr", 37);
      \u0275\u0275elementStart(111, "div", 38)(112, "span", 39);
      \u0275\u0275text(113, "$29");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(114, "span", 40);
      \u0275\u0275text(115, "per month");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(116, "hr", 37);
      \u0275\u0275elementStart(117, "ul", 41)(118, "li", 42);
      \u0275\u0275element(119, "i", 43);
      \u0275\u0275elementStart(120, "span", 13);
      \u0275\u0275text(121, "Arcu vitae elementum");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(122, "li", 42);
      \u0275\u0275element(123, "i", 43);
      \u0275\u0275elementStart(124, "span", 13);
      \u0275\u0275text(125, "Dui faucibus in ornare");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(126, "li", 42);
      \u0275\u0275element(127, "i", 43);
      \u0275\u0275elementStart(128, "span", 13);
      \u0275\u0275text(129, "Morbi tincidunt augue");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(130, "li", 42);
      \u0275\u0275element(131, "i", 43);
      \u0275\u0275elementStart(132, "span", 13);
      \u0275\u0275text(133, "Duis ultricies lacus sed");
      \u0275\u0275elementEnd()()();
      \u0275\u0275element(134, "hr", 44)(135, "p-button", 45);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(136, "div", 32)(137, "div", 33)(138, "div", 46)(139, "div", 35);
      \u0275\u0275text(140, "Enterprise");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(141, "div", 36);
      \u0275\u0275text(142, "Plan description");
      \u0275\u0275elementEnd();
      \u0275\u0275element(143, "hr", 37);
      \u0275\u0275elementStart(144, "div", 38)(145, "span", 39);
      \u0275\u0275text(146, "$49");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(147, "span", 40);
      \u0275\u0275text(148, "per month");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(149, "hr", 37);
      \u0275\u0275elementStart(150, "ul", 41)(151, "li", 42);
      \u0275\u0275element(152, "i", 43);
      \u0275\u0275elementStart(153, "span", 13);
      \u0275\u0275text(154, "Arcu vitae elementum");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(155, "li", 42);
      \u0275\u0275element(156, "i", 43);
      \u0275\u0275elementStart(157, "span", 13);
      \u0275\u0275text(158, "Dui faucibus in ornare");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(159, "li", 42);
      \u0275\u0275element(160, "i", 43);
      \u0275\u0275elementStart(161, "span", 13);
      \u0275\u0275text(162, "Morbi tincidunt augue");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(163, "li", 42);
      \u0275\u0275element(164, "i", 43);
      \u0275\u0275elementStart(165, "span", 13);
      \u0275\u0275text(166, "Duis ultricies lacus sed");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(167, "li", 42);
      \u0275\u0275element(168, "i", 43);
      \u0275\u0275elementStart(169, "span", 13);
      \u0275\u0275text(170, "Imperdiet proin");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(171, "li", 42);
      \u0275\u0275element(172, "i", 43);
      \u0275\u0275elementStart(173, "span", 13);
      \u0275\u0275text(174, "Nisi scelerisque");
      \u0275\u0275elementEnd()()();
      \u0275\u0275element(175, "hr", 47)(176, "p-button", 48);
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275elementStart(177, "block-viewer", 49)(178, "div", 50)(179, "div", 51)(180, "div", 52);
      \u0275\u0275element(181, "i", 53);
      \u0275\u0275text(182, "\xA0POWERED BY DISCORD");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(183, "div", 54);
      \u0275\u0275text(184, "Join Our Design Community");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(185, "div", 55);
      \u0275\u0275text(186, "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit numquam eligendi quos.");
      \u0275\u0275elementEnd();
      \u0275\u0275element(187, "p-button", 56);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(188, "block-viewer", 57)(189, "div", 58)(190, "div", 59);
      \u0275\u0275text(191, "\u{1F525} Hot Deals!");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(192, "div", 60)(193, "span", 61);
      \u0275\u0275text(194, "Libero voluptatum atque exercitationem praesentium provident odit.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(195, "a", 62)(196, "a", 63)(197, "span", 64);
      \u0275\u0275text(198, "Learn More");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(199, "a", 65);
      \u0275\u0275element(200, "i", 66);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(201, "div", 67);
      \u0275\u0275text(202, "Application UI");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(203, "block-viewer", 68)(204, "div", 69)(205, "ul", 70)(206, "li")(207, "a", 71);
      \u0275\u0275text(208, "Application");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(209, "li", 72);
      \u0275\u0275element(210, "i", 73);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(211, "li")(212, "span", 74);
      \u0275\u0275text(213, "Analytics");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(214, "div", 75)(215, "div")(216, "div", 76);
      \u0275\u0275text(217, "Customers");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(218, "div", 77)(219, "div", 78);
      \u0275\u0275element(220, "i", 79);
      \u0275\u0275elementStart(221, "span");
      \u0275\u0275text(222, "332 Active Users");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(223, "div", 78);
      \u0275\u0275element(224, "i", 80);
      \u0275\u0275elementStart(225, "span");
      \u0275\u0275text(226, "9402 Sessions");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(227, "div", 81);
      \u0275\u0275element(228, "i", 82);
      \u0275\u0275elementStart(229, "span");
      \u0275\u0275text(230, "2.32m Avg. Duration");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(231, "div", 83);
      \u0275\u0275element(232, "p-button", 84)(233, "p-button", 85);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(234, "block-viewer", 86)(235, "div", 87)(236, "div", 16)(237, "div", 88)(238, "div", 89)(239, "div", 90)(240, "div")(241, "span", 91);
      \u0275\u0275text(242, "Orders");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(243, "div", 92);
      \u0275\u0275text(244, "152");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(245, "div", 93);
      \u0275\u0275element(246, "i", 94);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(247, "span", 95);
      \u0275\u0275text(248, "24 new ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(249, "span", 96);
      \u0275\u0275text(250, "since last visit");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(251, "div", 88)(252, "div", 89)(253, "div", 90)(254, "div")(255, "span", 91);
      \u0275\u0275text(256, "Revenue");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(257, "div", 92);
      \u0275\u0275text(258, "$2.100");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(259, "div", 97);
      \u0275\u0275element(260, "i", 98);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(261, "span", 95);
      \u0275\u0275text(262, "%52+ ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(263, "span", 96);
      \u0275\u0275text(264, "since last week");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(265, "div", 88)(266, "div", 89)(267, "div", 90)(268, "div")(269, "span", 91);
      \u0275\u0275text(270, "Customers");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(271, "div", 92);
      \u0275\u0275text(272, "28441");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(273, "div", 99);
      \u0275\u0275element(274, "i", 100);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(275, "span", 95);
      \u0275\u0275text(276, "520 ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(277, "span", 96);
      \u0275\u0275text(278, "newly registered");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(279, "div", 88)(280, "div", 89)(281, "div", 90)(282, "div")(283, "span", 91);
      \u0275\u0275text(284, "Comments");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(285, "div", 92);
      \u0275\u0275text(286, "152 Unread");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(287, "div", 101);
      \u0275\u0275element(288, "i", 102);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(289, "span", 95);
      \u0275\u0275text(290, "85 ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(291, "span", 96);
      \u0275\u0275text(292, "responded");
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275elementStart(293, "block-viewer", 103)(294, "div", 104)(295, "div", 105);
      \u0275\u0275element(296, "img", 106);
      \u0275\u0275elementStart(297, "div", 107);
      \u0275\u0275text(298, "Welcome Back");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(299, "span", 108);
      \u0275\u0275text(300, "Don't have an account?");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(301, "a", 109);
      \u0275\u0275text(302, "Create today!");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(303, "div")(304, "label", 110);
      \u0275\u0275text(305, "Email");
      \u0275\u0275elementEnd();
      \u0275\u0275element(306, "input", 111);
      \u0275\u0275elementStart(307, "label", 112);
      \u0275\u0275text(308, "Password");
      \u0275\u0275elementEnd();
      \u0275\u0275element(309, "input", 113);
      \u0275\u0275elementStart(310, "div", 114)(311, "div", 38)(312, "p-checkbox", 115);
      \u0275\u0275twoWayListener("ngModelChange", function Blocks_Template_p_checkbox_ngModelChange_312_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.checked, $event) || (ctx.checked = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(313, "label", 116);
      \u0275\u0275text(314, "Remember me");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(315, "a", 117);
      \u0275\u0275text(316, "Forgot password?");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(317, "p-button", 118);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(318, "block-viewer", 119)(319, "div", 120)(320, "div", 121);
      \u0275\u0275text(321, "Movie Information");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(322, "div", 122);
      \u0275\u0275text(323, "Morbi tristique blandit turpis. In viverra ligula id nulla hendrerit rutrum.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(324, "ul", 123)(325, "li", 124)(326, "div", 125);
      \u0275\u0275text(327, "Title");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(328, "div", 126);
      \u0275\u0275text(329, "Heat");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(330, "div", 127);
      \u0275\u0275element(331, "p-button", 128);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(332, "li", 124)(333, "div", 125);
      \u0275\u0275text(334, "Genre");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(335, "div", 126);
      \u0275\u0275element(336, "p-chip", 129)(337, "p-chip", 130)(338, "p-chip", 131);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(339, "div", 127);
      \u0275\u0275element(340, "p-button", 128);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(341, "li", 124)(342, "div", 125);
      \u0275\u0275text(343, "Director");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(344, "div", 126);
      \u0275\u0275text(345, "Michael Mann");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(346, "div", 127);
      \u0275\u0275element(347, "p-button", 128);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(348, "li", 124)(349, "div", 125);
      \u0275\u0275text(350, "Actors");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(351, "div", 126);
      \u0275\u0275text(352, "Robert De Niro, Al Pacino");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(353, "div", 127);
      \u0275\u0275element(354, "p-button", 128);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(355, "li", 132)(356, "div", 125);
      \u0275\u0275text(357, "Plot");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(358, "div", 133);
      \u0275\u0275text(359, " A group of professional bank robbers start to feel the heat from police when they unknowingly leave a clue at their latest heist. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(360, "div", 127);
      \u0275\u0275element(361, "p-button", 128);
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(362, "block-viewer", 134)(363, "div", 135)(364, "div", 136);
      \u0275\u0275text(365, "Card Title");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(366, "div", 137);
      \u0275\u0275text(367, "Vivamus id nisl interdum, blandit augue sit amet, eleifend mi.");
      \u0275\u0275elementEnd();
      \u0275\u0275element(368, "div", 138);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275property("code", ctx.block1);
      \u0275\u0275advance(14);
      \u0275\u0275property("code", ctx.block2);
      \u0275\u0275advance(52);
      \u0275\u0275property("code", ctx.block3);
      \u0275\u0275advance(110);
      \u0275\u0275property("code", ctx.block4);
      \u0275\u0275advance(11);
      \u0275\u0275property("code", ctx.block5);
      \u0275\u0275advance(15);
      \u0275\u0275property("code", ctx.block6);
      \u0275\u0275advance(31);
      \u0275\u0275property("code", ctx.block7);
      \u0275\u0275advance(59);
      \u0275\u0275property("code", ctx.block8);
      \u0275\u0275advance(19);
      \u0275\u0275twoWayProperty("ngModel", ctx.checked);
      \u0275\u0275advance(6);
      \u0275\u0275property("code", ctx.block9);
      \u0275\u0275advance(44);
      \u0275\u0275property("code", ctx.block10);
    }
  }, dependencies: [CommonModule, BlockViewer, Button, Chip, InputText, Checkbox, FormsModule, NgControlStatus, NgModel], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Blocks, { className: "Blocks", filePath: "src/app/pages/blocks/blocks.ts", lineNumber: 426 });
})();

// src/app/pages/blocks/blocks.routes.ts
var blocks_routes_default = [{ path: "", data: { breadcrumb: "Free Blocks" }, component: Blocks }];
export {
  blocks_routes_default as default
};
//# sourceMappingURL=chunk-2F67A2WF.js.map
