import {
  Fluid,
  FluidModule
} from "./chunk-KPJXCGM6.js";
import {
  Textarea,
  TextareaModule
} from "./chunk-RW4OSSQT.js";
import {
  Select,
  SelectModule
} from "./chunk-UQSIOFSP.js";
import "./chunk-V6CKOH3G.js";
import "./chunk-DBPX6ILC.js";
import "./chunk-WIQZFAVH.js";
import "./chunk-CCBQFN2J.js";
import {
  InputText,
  InputTextModule
} from "./chunk-FZELBHWZ.js";
import "./chunk-4IUQ6KTI.js";
import "./chunk-IVSL2HKS.js";
import "./chunk-E352KRZV.js";
import "./chunk-HHD4PK4J.js";
import {
  Button,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import "./chunk-AP3OAIHW.js";
import "./chunk-NQNBRQ7H.js";
import {
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-3HTR5OU7.js";
import "./chunk-W3K3GK4Z.js";
import "./chunk-SQQPVFHK.js";
import {
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵproperty,
  ɵɵtext,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// src/app/pages/uikit/formlayoutdemo.ts
var FormLayoutDemo = class _FormLayoutDemo {
  dropdownItems = [
    { name: "Option 1", code: "Option 1" },
    { name: "Option 2", code: "Option 2" },
    { name: "Option 3", code: "Option 3" }
  ];
  dropdownItem = null;
  static \u0275fac = function FormLayoutDemo_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FormLayoutDemo)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FormLayoutDemo, selectors: [["app-formlayout-demo"]], decls: 92, vars: 3, consts: [[1, "flex", "flex-col", "md:flex-row", "gap-8"], [1, "md:w-1/2"], [1, "card", "flex", "flex-col", "gap-4"], [1, "font-semibold", "text-xl"], [1, "flex", "flex-col", "gap-2"], ["for", "name1"], ["pInputText", "", "id", "name1", "type", "text"], ["for", "email1"], ["pInputText", "", "id", "email1", "type", "text"], ["for", "age1"], ["pInputText", "", "id", "age1", "type", "text"], [1, "flex", "flex-wrap", "gap-4"], [1, "flex", "flex-col", "grow", "basis-0", "gap-2"], ["for", "name2"], ["pInputText", "", "id", "name2", "type", "text"], ["for", "email2"], ["pInputText", "", "id", "email2", "type", "text"], [1, "grid", "grid-cols-12", "gap-2"], ["for", "name3", 1, "flex", "items-center", "col-span-12", "mb-2", "md:col-span-2", "md:mb-0"], [1, "col-span-12", "md:col-span-10"], ["pInputText", "", "id", "name3", "type", "text"], ["for", "email3", 1, "flex", "items-center", "col-span-12", "mb-2", "md:col-span-2", "md:mb-0"], ["pInputText", "", "id", "email3", "type", "text"], [1, "flex", "flex-wrap", "items-start", "gap-4"], [1, "field"], ["for", "firstname1", 1, "sr-only"], ["pInputText", "", "id", "firstname1", "type", "text", "placeholder", "Firstname"], ["for", "lastname1", 1, "sr-only"], ["pInputText", "", "id", "lastname1", "type", "text", "placeholder", "Lastname"], ["label", "Submit", 3, "fluid"], [1, "flex", "flex-wrap", "gap-2"], ["for", "username"], ["pInputText", "", "id", "username", "type", "text"], [1, "flex", "mt-8"], [1, "card", "flex", "flex-col", "gap-4", "w-full"], [1, "flex", "flex-col", "md:flex-row", "gap-4"], [1, "flex", "flex-wrap", "gap-2", "w-full"], ["for", "firstname2"], ["pInputText", "", "id", "firstname2", "type", "text"], ["for", "lastname2"], ["pInputText", "", "id", "lastname2", "type", "text"], [1, "flex", "flex-wrap"], ["for", "address"], ["pTextarea", "", "id", "address", "rows", "4"], ["for", "state"], ["id", "state", "optionLabel", "name", "placeholder", "Select One", 1, "w-full", 3, "ngModelChange", "ngModel", "options"], ["for", "zip"], ["pInputText", "", "id", "zip", "type", "text"]], template: function FormLayoutDemo_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "p-fluid")(1, "div", 0)(2, "div", 1)(3, "div", 2)(4, "div", 3);
      \u0275\u0275text(5, "Vertical");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "div", 4)(7, "label", 5);
      \u0275\u0275text(8, "Name");
      \u0275\u0275elementEnd();
      \u0275\u0275element(9, "input", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "div", 4)(11, "label", 7);
      \u0275\u0275text(12, "Email");
      \u0275\u0275elementEnd();
      \u0275\u0275element(13, "input", 8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "div", 4)(15, "label", 9);
      \u0275\u0275text(16, "Age");
      \u0275\u0275elementEnd();
      \u0275\u0275element(17, "input", 10);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(18, "div", 2)(19, "div", 3);
      \u0275\u0275text(20, "Vertical Grid");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "div", 11)(22, "div", 12)(23, "label", 13);
      \u0275\u0275text(24, "Name");
      \u0275\u0275elementEnd();
      \u0275\u0275element(25, "input", 14);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "div", 12)(27, "label", 15);
      \u0275\u0275text(28, "Email");
      \u0275\u0275elementEnd();
      \u0275\u0275element(29, "input", 16);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(30, "div", 1)(31, "div", 2)(32, "div", 3);
      \u0275\u0275text(33, "Horizontal");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "div", 17)(35, "label", 18);
      \u0275\u0275text(36, "Name");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "div", 19);
      \u0275\u0275element(38, "input", 20);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(39, "div", 17)(40, "label", 21);
      \u0275\u0275text(41, "Email");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(42, "div", 19);
      \u0275\u0275element(43, "input", 22);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(44, "div", 2)(45, "div", 3);
      \u0275\u0275text(46, "Inline");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "div", 23)(48, "div", 24)(49, "label", 25);
      \u0275\u0275text(50, "Firstname");
      \u0275\u0275elementEnd();
      \u0275\u0275element(51, "input", 26);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(52, "div", 24)(53, "label", 27);
      \u0275\u0275text(54, "Lastname");
      \u0275\u0275elementEnd();
      \u0275\u0275element(55, "input", 28);
      \u0275\u0275elementEnd();
      \u0275\u0275element(56, "p-button", 29);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(57, "div", 2)(58, "div", 3);
      \u0275\u0275text(59, "Help Text");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(60, "div", 30)(61, "label", 31);
      \u0275\u0275text(62, "Username");
      \u0275\u0275elementEnd();
      \u0275\u0275element(63, "input", 32);
      \u0275\u0275elementStart(64, "small");
      \u0275\u0275text(65, "Enter your username to reset your password.");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(66, "div", 33)(67, "div", 34)(68, "div", 3);
      \u0275\u0275text(69, "Advanced");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(70, "div", 35)(71, "div", 36)(72, "label", 37);
      \u0275\u0275text(73, "Firstname");
      \u0275\u0275elementEnd();
      \u0275\u0275element(74, "input", 38);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(75, "div", 36)(76, "label", 39);
      \u0275\u0275text(77, "Lastname");
      \u0275\u0275elementEnd();
      \u0275\u0275element(78, "input", 40);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(79, "div", 41)(80, "label", 42);
      \u0275\u0275text(81, "Address");
      \u0275\u0275elementEnd();
      \u0275\u0275element(82, "textarea", 43);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(83, "div", 35)(84, "div", 36)(85, "label", 44);
      \u0275\u0275text(86, "State");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(87, "p-select", 45);
      \u0275\u0275twoWayListener("ngModelChange", function FormLayoutDemo_Template_p_select_ngModelChange_87_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.dropdownItem, $event) || (ctx.dropdownItem = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(88, "div", 36)(89, "label", 46);
      \u0275\u0275text(90, "Zip");
      \u0275\u0275elementEnd();
      \u0275\u0275element(91, "input", 47);
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(56);
      \u0275\u0275property("fluid", false);
      \u0275\u0275advance(31);
      \u0275\u0275twoWayProperty("ngModel", ctx.dropdownItem);
      \u0275\u0275property("options", ctx.dropdownItems);
    }
  }, dependencies: [InputTextModule, InputText, FluidModule, Fluid, ButtonModule, Button, SelectModule, Select, FormsModule, NgControlStatus, NgModel, TextareaModule, Textarea], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FormLayoutDemo, { className: "FormLayoutDemo", filePath: "src/app/pages/uikit/formlayoutdemo.ts", lineNumber: 121 });
})();
export {
  FormLayoutDemo
};
//# sourceMappingURL=chunk-Y4M7TNKG.js.map
