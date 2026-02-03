import {
  CommonModule
} from "./chunk-SQQPVFHK.js";
import {
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtext
} from "./chunk-ZKKMBKIA.js";

// src/app/pages/documentation/documentation.ts
var Documentation = class _Documentation {
  static \u0275fac = function Documentation_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Documentation)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Documentation, selectors: [["app-documentation"]], decls: 72, vars: 0, consts: [[1, "card"], [1, "font-semibold", "text-2xl", "mb-6"], [1, "font-semibold", "text-xl", "mb-6"], [1, "text-lg", "mb-6"], [1, "app-code"], [1, "bg-highlight", "px-2", "py-1", "rounded-border", "not-italic", "text-base"], [1, "leading-normal", "list-disc", "pl-20", "text-lg", "mb-6"], [1, "text-primary", "font-medium"]], template: function Documentation_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
      \u0275\u0275text(2, "Documentation");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "div", 2);
      \u0275\u0275text(4, "Get Started");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p", 3);
      \u0275\u0275text(6, "Ultima is an application template for Angular and is distributed as a CLI project. Current versions is Angular v19 with PrimeNG v19. In case CLI is not installed already, use the command below to set it up.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "pre", 4)(8, "code");
      \u0275\u0275text(9, "npm install -g @angular/cli");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "p", 3);
      \u0275\u0275text(11, ' Once CLI is ready in your system, extract the contents of the zip file distribution, cd to the directory, install the libraries from npm and then execute "ng serve" to run the application in your local environment. ');
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "pre", 4)(13, "code");
      \u0275\u0275text(14, "git clone https://github.com/primefaces/ultima-ng\nnpm install\nng serve");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(15, "p", 3);
      \u0275\u0275text(16, " The application should run at ");
      \u0275\u0275elementStart(17, "i", 5);
      \u0275\u0275text(18, "http://localhost:4200/");
      \u0275\u0275elementEnd();
      \u0275\u0275text(19, " to view the application in your local environment. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "div", 2);
      \u0275\u0275text(21, "Structure");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "p", 3);
      \u0275\u0275text(23, "Templates consists of a couple folders, demos and layout have been separated so that you can easily identify what is necessary for your application.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "ul", 6)(25, "li")(26, "span", 7);
      \u0275\u0275text(27, "src/app/layout");
      \u0275\u0275elementEnd();
      \u0275\u0275text(28, ": Main layout files, needs to be present.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(29, "li")(30, "span", 7);
      \u0275\u0275text(31, "src/app/pages");
      \u0275\u0275elementEnd();
      \u0275\u0275text(32, ": Demo content like Dashboard.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "li")(34, "span", 7);
      \u0275\u0275text(35, "src/app/apps");
      \u0275\u0275elementEnd();
      \u0275\u0275text(36, ": Apps content like blog, chat.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "li")(38, "span", 7);
      \u0275\u0275text(39, "src/assets/demo");
      \u0275\u0275elementEnd();
      \u0275\u0275text(40, ": Assets used in demos");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "li")(42, "span", 7);
      \u0275\u0275text(43, "src/assets/layout");
      \u0275\u0275elementEnd();
      \u0275\u0275text(44, ": SCSS files of the main layout");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(45, "div", 2);
      \u0275\u0275text(46, "Menu");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "p", 3);
      \u0275\u0275text(48, " Main menu is defined at ");
      \u0275\u0275elementStart(49, "span", 5);
      \u0275\u0275text(50, "src/app/layout/components/app.menu.ts");
      \u0275\u0275elementEnd();
      \u0275\u0275text(51, " file. Update the ");
      \u0275\u0275elementStart(52, "i", 5);
      \u0275\u0275text(53, "model");
      \u0275\u0275elementEnd();
      \u0275\u0275text(54, " property to define your own menu items. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(55, "div", 2);
      \u0275\u0275text(56, "Layout Service");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(57, "p", 3)(58, "span", 5);
      \u0275\u0275text(59, "src/app/layout/service/layout.service.ts");
      \u0275\u0275elementEnd();
      \u0275\u0275text(60, " is a service that manages layout state changes, including dark mode, PrimeNG theme, menu modes, and states. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(61, "div", 2);
      \u0275\u0275text(62, "Tailwind CSS");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(63, "p", 3);
      \u0275\u0275text(64, "The demo pages are developed with Tailwind CSS however the core application shell uses custom CSS.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(65, "div", 2);
      \u0275\u0275text(66, "Variables");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(67, "p", 3);
      \u0275\u0275text(68, " CSS variables used in the template are derived from the applied PrimeNG theme. Customize them through the CSS variables in ");
      \u0275\u0275elementStart(69, "span", 5);
      \u0275\u0275text(70, "src/assets/layout/variables");
      \u0275\u0275elementEnd();
      \u0275\u0275text(71, ". ");
      \u0275\u0275elementEnd()();
    }
  }, dependencies: [CommonModule], styles: ["\n\n@media screen and (max-width: 991px) {\n  .video-container[_ngcontent-%COMP%] {\n    position: relative;\n    width: 100%;\n    height: 0;\n    padding-bottom: 56.25%;\n  }\n  .video-container[_ngcontent-%COMP%]   iframe[_ngcontent-%COMP%] {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n  }\n}\n/*# sourceMappingURL=documentation.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Documentation, { className: "Documentation", filePath: "src/app/pages/documentation/documentation.ts", lineNumber: 83 });
})();

export {
  Documentation
};
//# sourceMappingURL=chunk-EIZ54RW5.js.map
