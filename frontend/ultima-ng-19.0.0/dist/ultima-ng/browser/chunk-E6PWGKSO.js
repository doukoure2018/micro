import {
  Fluid,
  FluidModule
} from "./chunk-KPJXCGM6.js";
import {
  Textarea,
  TextareaModule
} from "./chunk-RW4OSSQT.js";
import {
  IconField,
  IconFieldModule,
  InputIcon,
  InputIconModule
} from "./chunk-WIQZFAVH.js";
import {
  Router
} from "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
import {
  InputText,
  InputTextModule
} from "./chunk-FZELBHWZ.js";
import {
  Button,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import "./chunk-AP3OAIHW.js";
import "./chunk-NQNBRQ7H.js";
import "./chunk-3HTR5OU7.js";
import "./chunk-BMYIFZHZ.js";
import {
  CommonModule,
  NgForOf
} from "./chunk-SQQPVFHK.js";
import {
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵproperty,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// src/app/apps/blog/detail.ts
function Detail_li_55_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 37);
    \u0275\u0275element(1, "img", 38);
    \u0275\u0275elementStart(2, "div")(3, "span", 39);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 40);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 41);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const comment_r1 = ctx.$implicit;
    const i_r2 = ctx.index;
    \u0275\u0275attribute("key", i_r2);
    \u0275\u0275advance();
    \u0275\u0275property("src", comment_r1.image, \u0275\u0275sanitizeUrl)("alt", "Image " + i_r2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", comment_r1.name, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", comment_r1.date, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", comment_r1.description, " ");
  }
}
var Detail = class _Detail {
  router;
  constructor(router) {
    this.router = router;
  }
  comments = [
    {
      image: "/images/avatar/circle/avatar-f-3@2x.png",
      name: "Courtney Henry",
      date: "03 February 2022",
      description: "Reprehenderit ut voluptas sapiente ratione nostrum est."
    },
    {
      image: "/images/avatar/circle/avatar-f-1@2x.png",
      name: "Esther Howard",
      date: "03 February 2022",
      description: "How likely are you to recommend our company to your friends and family ?"
    },
    {
      image: "/images/avatar/circle/avatar-f-4@2x.png",
      name: "Darlene Robertson",
      date: "03 February 2022",
      description: "Quo quia sit nihil nemo doloremque et."
    },
    {
      image: "/images/avatar/circle/avatar-f-5@2x.png",
      name: "Esther Howard",
      date: "03 February 2022",
      description: "How likely are you to recommend our company to your friends and family ?"
    }
  ];
  navigateToEdit() {
    this.router.navigate(["apps/blog/edit"]);
  }
  static \u0275fac = function Detail_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Detail)(\u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Detail, selectors: [["app-detail"]], decls: 70, vars: 3, consts: [[1, "card"], [1, "flex", "justify-between", "flex-col-reverse", "md:flex-row", "items-center"], [1, "text-xl", "text-surface-900", "dark:text-surface-0", "mb-6", "mt-6", "md:mt-0", "text-center", "md:text-left", "font-semibold", "md:pr-6"], [1, "flex", "flex-wrap", "justify-center", "md:justify-start", "gap-4"], [1, "inline-flex", "items-center", "py-2", "px-4", "font-medium", "border", "border-surface-200", "dark:border-surface-700", "rounded"], [1, "pi", "pi-clock", "text-primary", "mr-2"], [1, "text-surface-900", "dark:text-surface-0"], [1, "pi", "pi-comments", "text-primary", "mr-2"], [1, "pi", "pi-eye", "text-primary", "mr-2"], [1, "flex", "flex-col", "items-center", "justify-center"], ["src", "/images/avatar/circle/avatar-f-2@2x.png", "alt", "Avatar", 1, "w-16", "h-16"], [1, "mt-4", "font-bold", "text-surface-900", "dark:text-surface-0", "text-center", "whitespace-nowrap"], [1, "text-center", "my-12"], ["src", "/images/blog/blogdetail.png", "alt", "Image", 1, "w-full"], [1, "text-2xl", "text-surface-900", "dark:text-surface-0", "mb-6", "font-semibold"], [1, "leading-normal", "text-lg", "mb-6"], [1, "text-xl", "p-0", "my-0", "ml-8"], [1, "mb-4", "leading-normal"], [1, "leading-normal"], [1, "flex", "flex-col", "sm:flex-row", "my-20", "w-full", "gap-4"], ["icon", "pi pi-twitter", "severity", "secondary", "label", "Twitter"], ["icon", "pi pi-facebook", "severity", "secondary", "label", "Facebook"], ["icon", "pi pi-pencil", "label", "Edit Post", 1, "sm:ml-auto", 3, "onClick"], [1, "flex", "items-center", "mb-6", "font-bold"], [1, "text-xl", "text-surface-900", "dark:text-surface-0", "mr-6"], [1, "inline-flex", "items-center", "justify-center", "w-8", "h-8", "border", "border-surface-200", "dark:border-surface-700", "rounded"], [1, "list-none", "p-0", "m-0"], ["class", "flex p-4 mb-4 border border-surface-200 dark:border-surface-700 rounded", 4, "ngFor", "ngForOf"], [1, "text-xl", "text-surface-900", "dark:text-surface-0", "mb-6", "font-bold", "mt-20"], [1, "mb-4"], [1, "pi", "pi-user"], ["pInputText", "", "type", "text", "placeholder", "Name"], [1, "pi", "pi-envelope"], ["pInputText", "", "type", "text", "placeholder", "Email"], ["pTextarea", "", "placeholder", "Your comment", 1, "mb-4", 3, "rows"], [1, "flex", "justify-end"], ["label", "Post Comment"], [1, "flex", "p-4", "mb-4", "border", "border-surface-200", "dark:border-surface-700", "rounded"], [1, "w-12", "h-12", "mr-4", "flex-shrink-0", 3, "src", "alt"], [1, "font-semibold", "text-surface-900", "dark:text-surface-0"], [1, "font-semibold", "text-surface-600", "dark:text-surface-200", "m-0", "text-sm"], [1, "leading-normal", "mb-0", "my-4"]], template: function Detail_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div")(3, "div", 2);
      \u0275\u0275text(4, "How To Get Started Tutorial");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div", 3)(6, "span", 4);
      \u0275\u0275element(7, "i", 5);
      \u0275\u0275elementStart(8, "span", 6);
      \u0275\u0275text(9, "2d ago");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "span", 4);
      \u0275\u0275element(11, "i", 7);
      \u0275\u0275elementStart(12, "span", 6);
      \u0275\u0275text(13, "24");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(14, "span", 4);
      \u0275\u0275element(15, "i", 8);
      \u0275\u0275elementStart(16, "span", 6);
      \u0275\u0275text(17, "124");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(18, "div", 9);
      \u0275\u0275element(19, "img", 10);
      \u0275\u0275elementStart(20, "span", 11);
      \u0275\u0275text(21, "Jane Cooper");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(22, "div", 12);
      \u0275\u0275element(23, "img", 13);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "div", 14);
      \u0275\u0275text(25, "Sodales massa, morbi convallis");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "p", 15);
      \u0275\u0275text(27, " First, a disclaimer - the entire process of writing a blog post often takes more than a couple of hours, even if you can type eighty words per minute and your writing skills are sharp. From the seed of the idea to finally hitting \u201CPublish,\u201D you might spend several days or maybe even a week \u201Cwriting\u201D a blog post, but it\u2018s important to spend those vital hours planning your post and even thinking about Your Post(yes, thinking counts as working if you\u2018re a blogger) before you actually write it. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "p", 15);
      \u0275\u0275text(29, "There\u2018s an old maxim that states, \u201CNo fun for the writer, no fun for the reader.\u201DNo matter what industry you\u2018re working in, as a blogger, you should live and die by this statement.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "p", 15);
      \u0275\u0275text(31, " Before you do any of the following steps, be sure to pick a topic that actually interests you. Nothing - and I mean NOTHING- will kill a blog post more effectively than a lack of enthusiasm from the writer. You can tell when a writer is bored by their subject, and it\u2018s so cringe-worthy it\u2018s a little embarrassing. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "p", 15);
      \u0275\u0275text(33, " I can hear your objections already. \u201CBut Dan, I have to blog for a cardboard box manufacturing company.\u201D I feel your pain, I really do. During the course of my career, I\u2018ve written content for dozens of clients in some less-than-thrilling industries (such as financial regulatory compliance and corporate housing), but the hallmark of a professional blogger is the ability to write well about any topic, no matter how dry it may be. Blogging is a lot easier, however, if you can muster at least a little enthusiasm for the topic at hand. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "div", 14);
      \u0275\u0275text(35, "Commodo ultrices orci tempus et fermentum, pellentesque ultricies.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "ul", 16)(37, "li", 17);
      \u0275\u0275text(38, "Fermentum neque odio laoreet morbi sit. Venenatis in quam ut non.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(39, "li", 17);
      \u0275\u0275text(40, "Enim in porta facilisi a vulputate fermentum, morbi. Consequat, id praesent tristique euismod pellentesque.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "li", 17);
      \u0275\u0275text(42, "Implements This is an external link");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(43, "li", 18);
      \u0275\u0275text(44, "Scelerisque ultricies tincidunt lectus faucibus non morbi sed nibh varius. Quam a, habitasse egestaseleifend.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(45, "div", 19);
      \u0275\u0275element(46, "p-button", 20)(47, "p-button", 21);
      \u0275\u0275elementStart(48, "p-button", 22);
      \u0275\u0275listener("onClick", function Detail_Template_p_button_onClick_48_listener() {
        return ctx.navigateToEdit();
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(49, "div", 23)(50, "span", 24);
      \u0275\u0275text(51, "Comments");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(52, "span", 25);
      \u0275\u0275text(53);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(54, "ul", 26);
      \u0275\u0275template(55, Detail_li_55_Template, 9, 6, "li", 27);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(56, "div", 28);
      \u0275\u0275text(57, "Post a Comment");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(58, "p-fluid")(59, "p-iconfield", 29);
      \u0275\u0275element(60, "p-inputicon", 30)(61, "input", 31);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(62, "p-fluid")(63, "p-iconfield", 29);
      \u0275\u0275element(64, "p-inputicon", 32)(65, "input", 33);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(66, "p-fluid");
      \u0275\u0275element(67, "textarea", 34);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(68, "div", 35);
      \u0275\u0275element(69, "p-button", 36);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(53);
      \u0275\u0275textInterpolate(ctx.comments.length);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngForOf", ctx.comments);
      \u0275\u0275advance(12);
      \u0275\u0275property("rows", 6);
    }
  }, dependencies: [CommonModule, NgForOf, FluidModule, Fluid, IconFieldModule, IconField, InputIconModule, InputIcon, TextareaModule, Textarea, InputTextModule, InputText, ButtonModule, Button], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Detail, { className: "Detail", filePath: "src/app/apps/blog/detail.ts", lineNumber: 112 });
})();
export {
  Detail
};
//# sourceMappingURL=chunk-E6PWGKSO.js.map
