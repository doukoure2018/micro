import {
  Popover,
  PopoverModule
} from "./chunk-Q5J6E52W.js";
import {
  IconField,
  IconFieldModule,
  InputIcon,
  InputIconModule
} from "./chunk-WIQZFAVH.js";
import {
  InputText,
  InputTextModule
} from "./chunk-FZELBHWZ.js";
import "./chunk-E352KRZV.js";
import {
  ButtonDirective,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import "./chunk-AP3OAIHW.js";
import "./chunk-NQNBRQ7H.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-3HTR5OU7.js";
import {
  HttpClient
} from "./chunk-BMYIFZHZ.js";
import "./chunk-W3K3GK4Z.js";
import {
  CommonModule,
  NgClass,
  NgForOf,
  NgIf
} from "./chunk-SQQPVFHK.js";
import {
  BehaviorSubject,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpropertyInterpolate1,
  ɵɵpureFunction3,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// src/app/apps/chat/service/chat.service.ts
var ChatService = class _ChatService {
  http;
  _activeUser = {
    id: 1,
    name: "Ioni Bowcher",
    image: "ionibowcher.png",
    status: "active",
    messages: [
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        ownerId: 1,
        createdAt: 1652646338240
      },
      {
        text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
        ownerId: 1,
        createdAt: 1652646368718
      },
      {
        text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
        ownerId: 123,
        createdAt: 1652646368718
      }
    ],
    lastSeen: "2d"
  };
  activeUser = new BehaviorSubject(this._activeUser);
  activeUser$ = this.activeUser.asObservable();
  constructor(http) {
    this.http = http;
  }
  getChatData() {
    return this.http.get("/demo/data/chat.json").toPromise().then((res) => res.data).then((data) => data);
  }
  changeActiveChat(user) {
    this._activeUser = user;
    this.activeUser.next(user);
  }
  sendMessage(message) {
    this._activeUser.messages.push(message);
    this.activeUser.next(this._activeUser);
  }
  static \u0275fac = function ChatService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ChatService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ChatService, factory: _ChatService.\u0275fac });
};

// src/app/apps/chat/usercard.ts
var _c0 = (a0, a1, a2) => ({ "bg-green-400": a0, "bg-red-400": a1, "bg-yellow-400": a2 });
var UserCard = class _UserCard {
  chatService;
  user;
  lastMessage;
  constructor(chatService) {
    this.chatService = chatService;
  }
  ngOnInit() {
    let filtered = this.user.messages.filter((m) => m.ownerId !== 123);
    this.lastMessage = filtered[filtered.length - 1];
  }
  changeView(user) {
    this.chatService.changeActiveChat(user);
  }
  static \u0275fac = function UserCard_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UserCard)(\u0275\u0275directiveInject(ChatService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _UserCard, selectors: [["app-user-card"]], hostAttrs: [1, "flex-shrink-0"], inputs: { user: "user" }, decls: 12, vars: 10, consts: [["tabindex", "0", 1, "flex", "flex-nowrap", "justify-between", "items-center", "border", "border-surface-200", "dark:border-surface-700", "rounded", "p-4", "cursor-pointer", "select-none", "hover:bg-surface-100", "dark:hover:bg-surface-800", "transition-colors", "duration-150", 3, "keydown.enter", "click"], [1, "flex", "items-center"], [1, "relative", "md:mr-4"], ["alt", "user", 1, "w-12", "h-12", "rounded-full", "shadow-lg", 3, "src"], [1, "w-4", "h-4", "rounded-full", "border-2", "border-surface-200", "dark:border-surface-700", "absolute", 2, "bottom", "2px", "right", "2px", 3, "ngClass"], [1, "flex-col", "hidden", "md:flex"], [1, "text-surface-900", "dark:text-surface-0", "font-semibold", "block"], [1, "block", "text-surface-600", "dark:text-surface-200", "text-ellipsis", "overflow-hidden", "whitespace-nowrap", "w-40", "text-sm"], [1, "text-surface-700", "dark:text-surface-100", "font-semibold", "ml-auto", "hidden", "md:inline"]], template: function UserCard_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275listener("keydown.enter", function UserCard_Template_div_keydown_enter_0_listener() {
        return ctx.changeView(ctx.user);
      })("click", function UserCard_Template_div_click_0_listener() {
        return ctx.changeView(ctx.user);
      });
      \u0275\u0275elementStart(1, "div", 1)(2, "div", 2);
      \u0275\u0275element(3, "img", 3)(4, "span", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div", 5)(6, "span", 6);
      \u0275\u0275text(7);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "span", 7);
      \u0275\u0275text(9);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(10, "span", 8);
      \u0275\u0275text(11);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275propertyInterpolate1("src", "/images/avatar/", ctx.user.image, "", \u0275\u0275sanitizeUrl);
      \u0275\u0275advance();
      \u0275\u0275property("ngClass", \u0275\u0275pureFunction3(6, _c0, ctx.user.status === "active", ctx.user.status === "busy", ctx.user.status === "away"));
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.user.name);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.lastMessage.text);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.user.lastSeen);
    }
  }, dependencies: [CommonModule, NgClass], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(UserCard, { className: "UserCard", filePath: "src/app/apps/chat/usercard.ts", lineNumber: 40 });
})();

// src/app/apps/chat/chatsidebar.ts
function ChatSidebar_app_user_card_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-user-card", 9);
  }
  if (rf & 2) {
    const user_r1 = ctx.$implicit;
    \u0275\u0275property("user", user_r1);
  }
}
var ChatSidebar = class _ChatSidebar {
  chatService;
  searchValue = "";
  users = [];
  filteredUsers = [];
  constructor(chatService) {
    this.chatService = chatService;
  }
  ngOnInit() {
    this.chatService.getChatData().then((data) => {
      this.users = data;
      this.filteredUsers = this.users;
    });
  }
  filter() {
    let filtered = [];
    for (let i = 0; i < this.users.length; i++) {
      let user = this.users[i];
      if (user.name.toLowerCase().indexOf(this.searchValue.toLowerCase()) == 0) {
        filtered.push(user);
      }
    }
    this.filteredUsers = [...filtered];
  }
  static \u0275fac = function ChatSidebar_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ChatSidebar)(\u0275\u0275directiveInject(ChatService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ChatSidebar, selectors: [["app-chat-sidebar"]], decls: 10, vars: 2, consts: [[1, "flex", "flex-col", "items-center", "border-b", "border-surface-200", "dark:border-surface-700", "p-12"], ["src", "/images/avatar/circle/avatar-f-1@2x.png", "alt", "Asiya Javayant", 1, "w-24", "h-24", "rounded-full", "shadow-lg"], [1, "text-surface-900", "dark:text-surface-0", "text-xl", "font-semibold", "mt-6"], [1, "w-full", "flex", "gap-y-6", "flex-col", "border-surface-200", "dark:border-surface-700", "p-6"], [1, "w-full"], [1, "pi", "pi-search"], ["id", "search", "type", "text", "pInputText", "", "placeholder", "Search", 1, "w-full", 3, "ngModelChange", "input", "ngModel"], [1, "flex", "flex-row", "gap-6", "md:flex-col", "overflow-auto"], [3, "user", 4, "ngFor", "ngForOf"], [3, "user"]], template: function ChatSidebar_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "img", 1);
      \u0275\u0275elementStart(2, "span", 2);
      \u0275\u0275text(3, "Asiya Javayant");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(4, "div", 3)(5, "p-iconfield", 4);
      \u0275\u0275element(6, "p-inputicon", 5);
      \u0275\u0275elementStart(7, "input", 6);
      \u0275\u0275twoWayListener("ngModelChange", function ChatSidebar_Template_input_ngModelChange_7_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.searchValue, $event) || (ctx.searchValue = $event);
        return $event;
      });
      \u0275\u0275listener("input", function ChatSidebar_Template_input_input_7_listener() {
        return ctx.filter();
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 7);
      \u0275\u0275template(9, ChatSidebar_app_user_card_9_Template, 1, 1, "app-user-card", 8);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(7);
      \u0275\u0275twoWayProperty("ngModel", ctx.searchValue);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngForOf", ctx.filteredUsers);
    }
  }, dependencies: [CommonModule, NgForOf, IconFieldModule, IconField, InputIconModule, InputIcon, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, UserCard, InputTextModule, InputText], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ChatSidebar, { className: "ChatSidebar", filePath: "src/app/apps/chat/chatsidebar.ts", lineNumber: 29 });
})();

// src/app/apps/chat/chatbox.ts
var _c02 = (a0, a1, a2) => ({ "bg-green-400": a0, "bg-red-400": a1, "bg-yellow-400": a2 });
function ChatBox_div_15_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23)(1, "div", 24);
    \u0275\u0275element(2, "img", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 26)(4, "p", 27);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 28);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 29);
    \u0275\u0275text(9);
    \u0275\u0275element(10, "i", 30);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const message_r2 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275propertyInterpolate1("src", "/images/avatar/", ctx_r2.user.image, "", \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r2.user.name, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(message_r2.text);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.parseDate(message_r2.createdAt));
  }
}
function ChatBox_div_15_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23)(1, "div", 31)(2, "span", 32);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 29);
    \u0275\u0275text(5);
    \u0275\u0275element(6, "i", 30);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const message_r2 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(message_r2.text);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r2.parseDate(message_r2.createdAt), " ");
  }
}
function ChatBox_div_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275template(1, ChatBox_div_15_div_1_Template, 11, 5, "div", 22)(2, ChatBox_div_15_div_2_Template, 7, 2, "div", 22);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const message_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", message_r2.ownerId !== 123);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", message_r2.ownerId === ctx_r2.defaultUserId);
  }
}
function ChatBox_ng_template_24_button_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 34);
    \u0275\u0275listener("click", function ChatBox_ng_template_24_button_0_Template_button_click_0_listener() {
      const emoji_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      const op_r4 = \u0275\u0275reference(23);
      op_r4.hide();
      return \u0275\u0275resetView(ctx_r2.onEmojiSelect(emoji_r6));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const emoji_r6 = ctx.$implicit;
    \u0275\u0275property("label", emoji_r6);
  }
}
function ChatBox_ng_template_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ChatBox_ng_template_24_button_0_Template, 1, 1, "button", 33);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("ngForOf", ctx_r2.emojis);
  }
}
var ChatBox = class _ChatBox {
  chatService;
  defaultUserId = 123;
  message;
  textContent = "";
  uploadedFiles = [];
  emojis = [
    "\u{1F600}",
    "\u{1F603}",
    "\u{1F604}",
    "\u{1F601}",
    "\u{1F606}",
    "\u{1F605}",
    "\u{1F602}",
    "\u{1F923}",
    "\u{1F607}",
    "\u{1F609}",
    "\u{1F60A}",
    "\u{1F642}",
    "\u{1F643}",
    "\u{1F60B}",
    "\u{1F60C}",
    "\u{1F60D}",
    "\u{1F970}",
    "\u{1F618}",
    "\u{1F617}",
    "\u{1F619}",
    "\u{1F61A}",
    "\u{1F92A}",
    "\u{1F61C}",
    "\u{1F61D}",
    "\u{1F61B}",
    "\u{1F911}",
    "\u{1F60E}",
    "\u{1F913}",
    "\u{1F9D0}",
    "\u{1F920}",
    "\u{1F973}",
    "\u{1F917}",
    "\u{1F921}",
    "\u{1F60F}",
    "\u{1F636}",
    "\u{1F610}",
    "\u{1F611}",
    "\u{1F612}",
    "\u{1F644}",
    "\u{1F928}",
    "\u{1F914}",
    "\u{1F92B}",
    "\u{1F92D}",
    "\u{1F925}",
    "\u{1F633}",
    "\u{1F61E}",
    "\u{1F61F}",
    "\u{1F620}",
    "\u{1F621}",
    "\u{1F92C}",
    "\u{1F614}",
    "\u{1F61F}",
    "\u{1F620}",
    "\u{1F621}",
    "\u{1F92C}",
    "\u{1F614}",
    "\u{1F615}",
    "\u{1F641}",
    "\u{1F62C}",
    "\u{1F97A}",
    "\u{1F623}",
    "\u{1F616}",
    "\u{1F62B}",
    "\u{1F629}",
    "\u{1F971}",
    "\u{1F624}",
    "\u{1F62E}",
    "\u{1F631}",
    "\u{1F628}",
    "\u{1F630}",
    "\u{1F62F}",
    "\u{1F626}",
    "\u{1F627}",
    "\u{1F622}",
    "\u{1F625}",
    "\u{1F62A}",
    "\u{1F924}"
  ];
  user;
  constructor(chatService) {
    this.chatService = chatService;
  }
  setMessage() {
    if (this.user) {
      let filteredMessages = this.user.messages.filter((m) => m.ownerId !== this.defaultUserId);
      this.message = filteredMessages[filteredMessages.length - 1];
    }
  }
  ngOnInit() {
    this.setMessage();
  }
  sendMessage() {
    if (this.textContent == "" || this.textContent === " ") {
      return;
    } else {
      let message = {
        text: this.textContent,
        ownerId: 123,
        createdAt: (/* @__PURE__ */ new Date()).getTime()
      };
      this.chatService.sendMessage(message);
      this.textContent = "";
    }
  }
  onEmojiSelect(emoji) {
    this.textContent += emoji;
  }
  parseDate(timestamp) {
    return new Date(timestamp).toTimeString().split(":").slice(0, 2).join(":");
  }
  static \u0275fac = function ChatBox_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ChatBox)(\u0275\u0275directiveInject(ChatService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ChatBox, selectors: [["app-chat-box"]], inputs: { user: "user" }, decls: 26, vars: 11, consts: [["chatWindow", ""], ["op", ""], ["content", ""], [1, "flex", "flex-col", "h-full"], [1, "flex", "items-center", "border-b", "border-surface-200", "dark:border-surface-700", "p-4", "lg:p-12"], [1, "relative", "flex", "items-center", "mr-4"], ["alt", "user.name", 1, "w-16", "h-16", "rounded-full", "shadow-lg", 3, "src"], [1, "w-4", "h-4", "rounded-full", "border-2", "border-surface-200", "dark:border-surface-700", "absolute", "bottom-0", "right-0", 3, "ngClass"], [1, "mr-2"], [1, "text-surface-900", "dark:text-surface-0", "font-semibold", "block"], [1, "text-surface-700", "dark:text-surface-100"], [1, "flex", "items-center", "ml-auto"], ["pButton", "", "icon", "pi pi-phone", "outlined", "", "severity", "secondary", "rounded", "", 1, "mr-4"], ["pButton", "", "icon", "pi pi-ellipsis-v", "outlined", "", "severity", "secondary", "rounded", ""], [1, "user-message-container", "p-4", "md:px-6", "lg:px-12", "lg:py-6", "mt-2", "overflow-y-auto", 2, "max-height", "53vh", 3, "scrollTop"], [4, "ngFor", "ngForOf"], [1, "p-4", "md:p-6", "lg:p-12", "flex", "flex-col", "sm:flex-row", "items-center", "mt-auto", "border-t", "border-surface-200", "dark:border-surface-700", "gap-4"], ["id", "message", "type", "text", "pInputText", "", "placeholder", "Type a message", 1, "flex-1", "w-full", "sm:w-auto", "rounded", 3, "ngModelChange", "keydown.enter", "ngModel"], [1, "flex", "w-full", "sm:w-auto", "gap-4"], ["pRipple", "", "severity", "secondary", 1, "w-full", "sm:w-auto", "justify-center", "text-xl", 3, "click"], ["pButton", "", "pRipple", "", "label", "Send", "icon", "pi pi-send", 1, "w-full", "sm:w-auto", 3, "click"], ["styleClass", "w-full sm:w-30rem"], ["class", "grid gap-4 grid-nogutter mb-6", 4, "ngIf"], [1, "grid", "gap-4", "grid-nogutter", "mb-6"], [1, "mr-4", "mt-1"], ["alt", "user.name", 1, "w-12", "h-12", "rounded-full", "shadow-lg", 3, "src"], [1, "col", "mt-4"], [1, "text-surface-900", "dark:text-surface-0", "font-semibold", "mb-4"], [1, "text-surface-700", "dark:text-surface-100", "inline-block", "font-medium", "border", "border-surface-200", "dark:border-surface-700", "p-4", "whitespace-normal", "rounded", 2, "word-break", "break-word", "max-width", "80%"], [1, "text-surface-700", "dark:text-surface-100", "mt-4"], [1, "pi", "pi-check", "ml-2", "text-green-400"], [1, "col", "mt-4", "text-right"], [1, "inline-block", "text-left", "font-medium", "border", "border-surface-200", "dark:border-surface-700", "bg-primary-100", "text-primary-900", "p-4", "whitespace-normal", "rounded", 2, "word-break", "break-word", "max-width", "80%"], ["pButton", "", "pRipple", "", "type", "button", "class", "p-2 text-2xl", "text", "", 3, "label", "click", 4, "ngFor", "ngForOf"], ["pButton", "", "pRipple", "", "type", "button", "text", "", 1, "p-2", "text-2xl", 3, "click", "label"]], template: function ChatBox_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 3)(1, "div", 4)(2, "div", 5);
      \u0275\u0275element(3, "img", 6)(4, "span", 7);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div", 8)(6, "span", 9);
      \u0275\u0275text(7);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "span", 10);
      \u0275\u0275text(9, "Last active 1 hour ago");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "div", 11);
      \u0275\u0275element(11, "button", 12)(12, "button", 13);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(13, "div", 14, 0);
      \u0275\u0275template(15, ChatBox_div_15_Template, 3, 2, "div", 15);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "div", 16)(17, "input", 17);
      \u0275\u0275twoWayListener("ngModelChange", function ChatBox_Template_input_ngModelChange_17_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.textContent, $event) || (ctx.textContent = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275listener("keydown.enter", function ChatBox_Template_input_keydown_enter_17_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.sendMessage());
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "div", 18)(19, "button", 19);
      \u0275\u0275listener("click", function ChatBox_Template_button_click_19_listener($event) {
        \u0275\u0275restoreView(_r1);
        const op_r4 = \u0275\u0275reference(23);
        return \u0275\u0275resetView(op_r4.toggle($event));
      });
      \u0275\u0275text(20, "\u{1F600}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "button", 20);
      \u0275\u0275listener("click", function ChatBox_Template_button_click_21_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.sendMessage());
      });
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(22, "p-popover", 21, 1);
      \u0275\u0275template(24, ChatBox_ng_template_24_Template, 1, 1, "ng-template", null, 2, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      const chatWindow_r7 = \u0275\u0275reference(14);
      \u0275\u0275advance(3);
      \u0275\u0275propertyInterpolate1("src", "https://v2/images/avatar/", ctx.user.image, "", \u0275\u0275sanitizeUrl);
      \u0275\u0275advance();
      \u0275\u0275property("ngClass", \u0275\u0275pureFunction3(7, _c02, ctx.user.status === "active", ctx.user.status === "busy", ctx.user.status === "away"));
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.user.name);
      \u0275\u0275advance(6);
      \u0275\u0275property("scrollTop", chatWindow_r7.scrollHeight);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngForOf", ctx.user.messages);
      \u0275\u0275advance(2);
      \u0275\u0275twoWayProperty("ngModel", ctx.textContent);
    }
  }, dependencies: [FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, CommonModule, NgClass, NgForOf, NgIf, PopoverModule, Popover, InputTextModule, InputText, ButtonModule, ButtonDirective], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ChatBox, { className: "ChatBox", filePath: "src/app/apps/chat/chatbox.ts", lineNumber: 81 });
})();

// src/app/apps/chat/index.ts
var Chat = class _Chat {
  chatService;
  subscription;
  activeUser;
  constructor(chatService) {
    this.chatService = chatService;
    this.subscription = this.chatService.activeUser$.subscribe((data) => this.activeUser = data);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  static \u0275fac = function Chat_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Chat)(\u0275\u0275directiveInject(ChatService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Chat, selectors: [["app-chat"]], features: [\u0275\u0275ProvidersFeature([ChatService])], decls: 5, vars: 1, consts: [[1, "flex", "flex-col", "md:flex-row", "gap-8", 2, "min-height", "81vh"], [1, "md:w-[25rem]", "card", "!p-0"], [1, "flex-1", "card", "!p-0"], [3, "user"]], template: function Chat_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
      \u0275\u0275element(2, "app-chat-sidebar");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "div", 2);
      \u0275\u0275element(4, "app-chat-box", 3);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275property("user", ctx.activeUser);
    }
  }, dependencies: [ChatSidebar, ChatBox], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Chat, { className: "Chat", filePath: "src/app/apps/chat/index.ts", lineNumber: 21 });
})();
export {
  Chat
};
//# sourceMappingURL=chunk-IKCFDA5P.js.map
