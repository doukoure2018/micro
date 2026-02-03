import {
  MemberService
} from "./chunk-JCYGNDGJ.js";
import {
  Editor,
  EditorModule
} from "./chunk-LEUN6ZA4.js";
import {
  AutoComplete,
  AutoCompleteModule
} from "./chunk-PMCRGRAO.js";
import {
  AvatarGroup,
  AvatarGroupModule
} from "./chunk-NE67ECLX.js";
import {
  Fluid,
  FluidModule
} from "./chunk-KPJXCGM6.js";
import {
  Menu,
  MenuModule
} from "./chunk-RKCUEC6H.js";
import {
  Dialog,
  DialogModule
} from "./chunk-LPU4RT7P.js";
import "./chunk-WWXP2HWK.js";
import "./chunk-CXW3XKZ2.js";
import {
  Toast,
  ToastModule
} from "./chunk-6SRYYUT2.js";
import {
  Avatar,
  AvatarModule
} from "./chunk-MCGUCMXD.js";
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
import "./chunk-DBPX6ILC.js";
import "./chunk-CCBQFN2J.js";
import "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
import "./chunk-KHEKFKWA.js";
import {
  InputText,
  InputTextModule
} from "./chunk-FZELBHWZ.js";
import "./chunk-4IUQ6KTI.js";
import "./chunk-IVSL2HKS.js";
import "./chunk-E352KRZV.js";
import "./chunk-HHD4PK4J.js";
import {
  ButtonDirective,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import {
  Ripple,
  RippleModule
} from "./chunk-AP3OAIHW.js";
import {
  MessageService,
  PrimeTemplate
} from "./chunk-NQNBRQ7H.js";
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
  NgIf,
  SlicePipe
} from "./chunk-SQQPVFHK.js";
import {
  BehaviorSubject,
  Subject,
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
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind3,
  ɵɵproperty,
  ɵɵpropertyInterpolate1,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵqueryRefresh,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuery
} from "./chunk-ZKKMBKIA.js";
import "./chunk-4MWRP73S.js";

// src/app/apps/tasklist/service/task.service.ts
var TaskService = class _TaskService {
  http;
  dialogConfig = {
    visible: false,
    header: "",
    newTask: false
  };
  tasks = [];
  taskSource = new BehaviorSubject(this.tasks);
  selectedTask = new Subject();
  dialogSource = new BehaviorSubject(this.dialogConfig);
  taskSource$ = this.taskSource.asObservable();
  selectedTask$ = this.selectedTask.asObservable();
  dialogSource$ = this.dialogSource.asObservable();
  constructor(http) {
    this.http = http;
    this.http.get("/demo/data/tasks.json").toPromise().then((res) => res.data).then((data) => {
      this.tasks = data;
      this.taskSource.next(data);
    });
  }
  addTask(task) {
    if (this.tasks.includes(task)) {
      this.tasks = this.tasks.map((t) => t.id === task.id ? task : t);
    } else {
      this.tasks = [...this.tasks, task];
    }
    this.taskSource.next(this.tasks);
  }
  removeTask(id) {
    this.tasks = this.tasks.filter((t) => t.id !== id);
    this.taskSource.next(this.tasks);
  }
  onTaskSelect(task) {
    this.selectedTask.next(task);
  }
  markAsCompleted(task) {
    this.tasks = this.tasks.map((t) => t.id === task.id ? task : t);
    this.taskSource.next(this.tasks);
  }
  showDialog(header, newTask) {
    this.dialogConfig = {
      visible: true,
      header,
      newTask
    };
    this.dialogSource.next(this.dialogConfig);
  }
  closeDialog() {
    this.dialogConfig = {
      visible: false
    };
    this.dialogSource.next(this.dialogConfig);
  }
  static \u0275fac = function TaskService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TaskService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _TaskService, factory: _TaskService.\u0275fac });
};

// src/app/apps/tasklist/task-list.ts
var _c0 = ["menu"];
var _c1 = (a0) => ({ "line-through": a0 });
var _c2 = () => ({ color: "#212121", border: "2px solid var(--surface-border)" });
function TaskListComponent_li_4_span_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 18);
    \u0275\u0275element(1, "i", 19);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const task_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(task_r2.comments);
  }
}
function TaskListComponent_li_4_span_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 18);
    \u0275\u0275element(1, "i", 20);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const task_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(task_r2.attachments);
  }
}
function TaskListComponent_li_4_span_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 21);
    \u0275\u0275element(1, "i", 22);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const task_r2 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.parseDate(task_r2.startDate));
  }
}
function TaskListComponent_li_4_p_avatar_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-avatar", 23);
  }
  if (rf & 2) {
    const member_r4 = ctx.$implicit;
    \u0275\u0275propertyInterpolate1("image", "/images/avatar/", member_r4.image, "");
  }
}
function TaskListComponent_li_4_p_avatar_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-avatar", 24);
  }
  if (rf & 2) {
    const task_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(4, _c2));
    \u0275\u0275propertyInterpolate1("label", "+ ", task_r2.members.length - 4, "");
  }
}
function TaskListComponent_li_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li", 4)(1, "div", 5)(2, "p-checkbox", 6);
    \u0275\u0275listener("onChange", function TaskListComponent_li_4_Template_p_checkbox_onChange_2_listener($event) {
      const task_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onCheckboxChange($event, task_r2));
    });
    \u0275\u0275twoWayListener("ngModelChange", function TaskListComponent_li_4_Template_p_checkbox_ngModelChange_2_listener($event) {
      const task_r2 = \u0275\u0275restoreView(_r1).$implicit;
      \u0275\u0275twoWayBindingSet(task_r2.completed, $event) || (task_r2.completed = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "label", 7);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 8)(6, "div", 9);
    \u0275\u0275template(7, TaskListComponent_li_4_span_7_Template, 3, 1, "span", 10)(8, TaskListComponent_li_4_span_8_Template, 3, 1, "span", 10)(9, TaskListComponent_li_4_span_9_Template, 3, 1, "span", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 12)(11, "p-avatarGroup", 13);
    \u0275\u0275template(12, TaskListComponent_li_4_p_avatar_12_Template, 1, 2, "p-avatar", 14);
    \u0275\u0275pipe(13, "slice");
    \u0275\u0275template(14, TaskListComponent_li_4_p_avatar_14_Template, 1, 5, "p-avatar", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "button", 16);
    \u0275\u0275listener("click", function TaskListComponent_li_4_Template_button_click_15_listener($event) {
      const task_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.toggleMenu($event, task_r2));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(16, "p-menu", 17, 0);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const task_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("binary", true);
    \u0275\u0275twoWayProperty("ngModel", task_r2.completed);
    \u0275\u0275property("inputId", task_r2.id.toString());
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(16, _c1, task_r2.completed));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(task_r2.name);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", task_r2.comments);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", task_r2.attachments);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", task_r2.startDate);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", \u0275\u0275pipeBind3(13, 12, task_r2.members, 0, 4));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", task_r2 && task_r2.members && task_r2.members.length > 4);
    \u0275\u0275advance(2);
    \u0275\u0275property("popup", true)("model", ctx_r2.menuItems);
  }
}
var TaskListComponent = class _TaskListComponent {
  taskService;
  taskList;
  title;
  menu;
  menuItems = [];
  clickedTask;
  constructor(taskService) {
    this.taskService = taskService;
  }
  ngOnInit() {
    this.menuItems = [
      {
        label: "Edit",
        icon: "pi pi-pencil",
        command: () => this.onEdit()
      },
      {
        label: "Delete",
        icon: "pi pi-trash",
        command: () => this.handleDelete()
      }
    ];
  }
  parseDate(date) {
    let d = new Date(date);
    return d.toUTCString().split(" ").slice(1, 3).join(" ");
  }
  handleDelete() {
    this.taskService.removeTask(this.clickedTask.id);
  }
  toggleMenu(event, task) {
    this.clickedTask = task;
    this.menu.toggle(event);
  }
  onEdit() {
    this.taskService.onTaskSelect(this.clickedTask);
    this.taskService.showDialog("Edit Task", false);
  }
  onCheckboxChange(event, task) {
    event.originalEvent.stopPropagation();
    task.completed = event.checked;
    this.taskService.markAsCompleted(task);
  }
  static \u0275fac = function TaskListComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TaskListComponent)(\u0275\u0275directiveInject(TaskService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TaskListComponent, selectors: [["app-task-list"]], viewQuery: function TaskListComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.menu = _t.first);
    }
  }, inputs: { taskList: "taskList", title: "title" }, decls: 5, vars: 2, consts: [["menu", ""], [1, "text-surface-900", "dark:text-surface-0", "font-semibold", "text-lg", "mt-8", "mb-4", "border-b", "border-surface-200", "dark:border-surface-700", "py-4"], [1, "list-none", "p-0", "m-0"], ["class", "flex flex-col gap-4 md:flex-row md:items-center p-2 border-b border-surface-200 dark:border-surface-700", 4, "ngFor", "ngForOf"], [1, "flex", "flex-col", "gap-4", "md:flex-row", "md:items-center", "p-2", "border-b", "border-surface-200", "dark:border-surface-700"], [1, "flex", "items-center", "flex-1"], [3, "onChange", "ngModelChange", "binary", "ngModel", "inputId"], ["for", "task.id", 1, "font-medium", "whitespace-nowrap", "text-ellipsis", "overflow-hidden", "ml-2", 2, "max-width", "500px", 3, "ngClass"], [1, "flex", "flex-1", "gap-4", "flex-col", "sm:flex-row", "sm:justify-between"], [1, "flex", "items-center"], ["class", "flex items-center font-semibold mr-4", 4, "ngIf"], ["class", "flex items-center font-semibold whitespace-nowrap", 4, "ngIf"], [1, "flex", "items-center", "sm:justify-end"], ["styleClass", "mr-4"], ["size", "large", "shape", "circle", 3, "image", 4, "ngFor", "ngForOf"], ["shape", "circle", "size", "large", "class", "bg-blue-500", 3, "label", "style", 4, "ngIf"], ["pButton", "", "pRipple", "", "type", "button", "icon", "pi pi-ellipsis-v", "text", "", "rounded", "", 1, "z-30", "ml-auto", "sm:ml-0", 3, "click"], ["styleClass", "w-32", 3, "popup", "model"], [1, "flex", "items-center", "font-semibold", "mr-4"], [1, "pi", "pi-comment", "mr-2"], [1, "pi", "pi-paperclip", "mr-2"], [1, "flex", "items-center", "font-semibold", "whitespace-nowrap"], [1, "pi", "pi-clock", "mr-2"], ["size", "large", "shape", "circle", 3, "image"], ["shape", "circle", "size", "large", 1, "bg-blue-500", 3, "label"]], template: function TaskListComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div")(1, "div", 1);
      \u0275\u0275text(2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "ul", 2);
      \u0275\u0275template(4, TaskListComponent_li_4_Template, 18, 18, "li", 3);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", ctx.title, " ");
      \u0275\u0275advance(2);
      \u0275\u0275property("ngForOf", ctx.taskList);
    }
  }, dependencies: [CommonModule, NgClass, NgForOf, NgIf, SlicePipe, CheckboxModule, Checkbox, AvatarGroupModule, AvatarGroup, AvatarModule, Avatar, MenuModule, Menu, ButtonModule, ButtonDirective, RippleModule, Ripple, FormsModule, NgControlStatus, NgModel], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TaskListComponent, { className: "TaskListComponent", filePath: "src/app/apps/tasklist/task-list.ts", lineNumber: 58 });
})();

// src/app/apps/tasklist/create-task.ts
var _c02 = () => ({ height: "150px" });
var _c12 = () => ({ height: "2.5rem" });
function CreateTaskComponent_ng_template_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275element(1, "img", 21);
    \u0275\u0275elementStart(2, "span", 22);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const member_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275propertyInterpolate1("src", "/images/avatar/", member_r1.image, "", \u0275\u0275sanitizeUrl);
    \u0275\u0275property("alt", member_r1.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(member_r1.name);
  }
}
function CreateTaskComponent_ng_template_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275element(1, "img", 21);
    \u0275\u0275elementStart(2, "span", 22);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const member_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275propertyInterpolate1("src", "/images/avatar/", member_r2.image, "", \u0275\u0275sanitizeUrl);
    \u0275\u0275property("alt", member_r2.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(member_r2.name);
  }
}
var CreateTaskComponent = class _CreateTaskComponent {
  memberService;
  messageService;
  taskService;
  task;
  members = [];
  filteredMembers = [];
  dialogConfig = { header: "", visible: false };
  subscription;
  dialogSubscription;
  constructor(memberService, messageService, taskService) {
    this.memberService = memberService;
    this.messageService = messageService;
    this.taskService = taskService;
    this.subscription = this.taskService.selectedTask$.subscribe((data) => this.task = data);
    this.dialogSubscription = this.taskService.dialogSource$.subscribe((data) => {
      this.dialogConfig = data;
      if (this.dialogConfig.newTask) {
        this.resetTask();
      }
    });
  }
  ngOnInit() {
    this.memberService.getMembers().then((members) => this.members = members);
    this.resetTask();
  }
  filterMembers(event) {
    let filtered = [];
    let query = event.query;
    for (let i = 0; i < this.members.length; i++) {
      let member = this.members[i];
      if (member.name?.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(member);
      }
    }
    this.filteredMembers = filtered;
  }
  save() {
    this.task.id = Math.floor(Math.random() * 1e3);
    this.messageService.add({
      severity: "success",
      summary: "Success",
      detail: `Task "${this.task.name}" created successfully.`
    });
    this.taskService.addTask(this.task);
    this.taskService.closeDialog();
  }
  cancelTask() {
    this.resetTask();
    this.taskService.closeDialog();
  }
  resetTask() {
    this.task = {
      id: this.task && this.task.id ? this.task.id : Math.floor(Math.random() * 1e3),
      status: "Waiting"
    };
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  static \u0275fac = function CreateTaskComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CreateTaskComponent)(\u0275\u0275directiveInject(MemberService), \u0275\u0275directiveInject(MessageService), \u0275\u0275directiveInject(TaskService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CreateTaskComponent, selectors: [["app-create-task"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 29, vars: 18, consts: [["styleClass", "mx-4 sm:mx-0 sm:w-full md:w-8/12 lg:w-6/12", "contentStyleClass", "rounded-b border-t border-surface-200 dark:border-surface-700 p-0", 3, "visibleChange", "header", "visible", "modal", "dismissableMask"], [1, "p-6"], [1, "grid", "grid-cols-12", "gap-4"], [1, "col-span-12"], ["for", "name", 1, "text-surface-900", "dark:text-surface-0", "font-semibold", "block", "mb-2"], ["id", "name", "type", "text", "placeholder", "Title", "pInputText", "", 3, "ngModelChange", "ngModel"], ["for", "description", 1, "text-surface-900", "dark:text-surface-0", "font-semibold", "block", "mb-2"], [3, "ngModelChange", "ngModel"], [1, "col-span-6"], ["for", "start", 1, "text-surface-900", "dark:text-surface-0", "font-semibold", "block", "mb-2"], ["appendTo", "body", "dateFormat", "yy-mm-dd", "inputId", "start", "placeholder", "Start Date", 3, "ngModelChange", "showTime", "ngModel"], ["for", "end", 1, "text-surface-900", "dark:text-surface-0", "font-semibold", "block", "mb-2"], ["appendTo", "body", "dateFormat", "yy-mm-dd", "inputId", "end", "placeholder", "Due Date", 3, "ngModelChange", "showTime", "ngModel"], ["for", "members", 1, "text-surface-900", "dark:text-surface-0", "font-semibold", "block", "mb-2"], ["appendTo", "body", "inputId", "members", "field", "name", "placeholder", "Choose team members", 3, "ngModelChange", "completeMethod", "ngModel", "suggestions", "multiple", "inputStyle"], ["pTemplate", "selectedItem"], ["pTemplate", "item"], [1, "col-span-12", "flex", "justify-end", "mt-6"], ["pButton", "", "pRipple", "", "outlined", "", "icon", "pi pi-times", "label", "Cancel", 1, "w-32", "mr-4", 3, "click"], ["pButton", "", "pRipple", "", "icon", "pi pi-check", "label", "Save", 1, "w-32", 3, "click"], [1, "flex", "items-center"], [1, "h-8", "w-8", "mr-2", 3, "src", "alt"], [1, "text-surface-900", "dark:text-surface-0", "font-medium"]], template: function CreateTaskComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "p-toast");
      \u0275\u0275elementStart(1, "p-dialog", 0);
      \u0275\u0275twoWayListener("visibleChange", function CreateTaskComponent_Template_p_dialog_visibleChange_1_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.dialogConfig.visible, $event) || (ctx.dialogConfig.visible = $event);
        return $event;
      });
      \u0275\u0275elementStart(2, "div", 1)(3, "p-fluid", 2)(4, "div", 3)(5, "label", 4);
      \u0275\u0275text(6, "Task Name");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "input", 5);
      \u0275\u0275twoWayListener("ngModelChange", function CreateTaskComponent_Template_input_ngModelChange_7_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.task.name, $event) || (ctx.task.name = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 3)(9, "label", 6);
      \u0275\u0275text(10, "Description");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "p-editor", 7);
      \u0275\u0275twoWayListener("ngModelChange", function CreateTaskComponent_Template_p_editor_ngModelChange_11_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.task.description, $event) || (ctx.task.description = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(12, "div", 8)(13, "label", 9);
      \u0275\u0275text(14, "Start Date");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "p-datepicker", 10);
      \u0275\u0275twoWayListener("ngModelChange", function CreateTaskComponent_Template_p_datepicker_ngModelChange_15_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.task.startDate, $event) || (ctx.task.startDate = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(16, "div", 8)(17, "label", 11);
      \u0275\u0275text(18, "Due Date");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "p-datepicker", 12);
      \u0275\u0275twoWayListener("ngModelChange", function CreateTaskComponent_Template_p_datepicker_ngModelChange_19_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.task.endDate, $event) || (ctx.task.endDate = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(20, "div", 3)(21, "label", 13);
      \u0275\u0275text(22, "Add Team Member");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "p-autocomplete", 14);
      \u0275\u0275twoWayListener("ngModelChange", function CreateTaskComponent_Template_p_autocomplete_ngModelChange_23_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.task.members, $event) || (ctx.task.members = $event);
        return $event;
      });
      \u0275\u0275listener("completeMethod", function CreateTaskComponent_Template_p_autocomplete_completeMethod_23_listener($event) {
        return ctx.filterMembers($event);
      });
      \u0275\u0275template(24, CreateTaskComponent_ng_template_24_Template, 4, 4, "ng-template", 15)(25, CreateTaskComponent_ng_template_25_Template, 4, 4, "ng-template", 16);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(26, "div", 17)(27, "button", 18);
      \u0275\u0275listener("click", function CreateTaskComponent_Template_button_click_27_listener() {
        return ctx.cancelTask();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "button", 19);
      \u0275\u0275listener("click", function CreateTaskComponent_Template_button_click_28_listener() {
        return ctx.save();
      });
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275property("header", ctx.dialogConfig.header || "");
      \u0275\u0275twoWayProperty("visible", ctx.dialogConfig.visible);
      \u0275\u0275property("modal", true)("dismissableMask", true);
      \u0275\u0275advance(6);
      \u0275\u0275twoWayProperty("ngModel", ctx.task.name);
      \u0275\u0275advance(4);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(16, _c02));
      \u0275\u0275twoWayProperty("ngModel", ctx.task.description);
      \u0275\u0275advance(4);
      \u0275\u0275property("showTime", false);
      \u0275\u0275twoWayProperty("ngModel", ctx.task.startDate);
      \u0275\u0275advance(4);
      \u0275\u0275property("showTime", false);
      \u0275\u0275twoWayProperty("ngModel", ctx.task.endDate);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.task.members);
      \u0275\u0275property("suggestions", ctx.filteredMembers)("multiple", true)("inputStyle", \u0275\u0275pureFunction0(17, _c12));
    }
  }, dependencies: [ToastModule, Toast, PrimeTemplate, DialogModule, Dialog, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, EditorModule, Editor, DatePickerModule, DatePicker, ButtonModule, ButtonDirective, AutoCompleteModule, AutoComplete, FluidModule, Fluid, InputTextModule, InputText, Ripple], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CreateTaskComponent, { className: "CreateTaskComponent", filePath: "src/app/apps/tasklist/create-task.ts", lineNumber: 85 });
})();

// src/app/apps/tasklist/index.ts
var TaskList = class _TaskList {
  taskService;
  subscription;
  todo = [];
  completed = [];
  constructor(taskService) {
    this.taskService = taskService;
    this.subscription = this.taskService.taskSource$.subscribe((data) => this.categorize(data));
  }
  categorize(tasks) {
    this.todo = tasks.filter((t) => t.completed !== true);
    this.completed = tasks.filter((t) => t.completed);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  showDialog() {
    this.taskService.showDialog("Create Task", true);
  }
  static \u0275fac = function TaskList_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TaskList)(\u0275\u0275directiveInject(TaskService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TaskList, selectors: [["ng-component"]], features: [\u0275\u0275ProvidersFeature([TaskService])], decls: 8, vars: 2, consts: [[1, "card"], [1, "flex", "justify-between", "items-center", "mb-8"], [1, "text-surface-900", "dark:text-surface-0", "text-xl", "font-semibold"], ["pButton", "", "pRipple", "", "outlined", "", "icon", "pi pi-plus", "label", "Create Task", 1, "font-semibold", 3, "click"], ["title", "ToDo", 3, "taskList"], ["title", "Completed", 3, "taskList"]], template: function TaskList_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "span", 2);
      \u0275\u0275text(3, "Task List");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "button", 3);
      \u0275\u0275listener("click", function TaskList_Template_button_click_4_listener() {
        return ctx.showDialog();
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275element(5, "app-task-list", 4)(6, "app-task-list", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275element(7, "app-create-task");
    }
    if (rf & 2) {
      \u0275\u0275advance(5);
      \u0275\u0275property("taskList", ctx.todo);
      \u0275\u0275advance();
      \u0275\u0275property("taskList", ctx.completed);
    }
  }, dependencies: [ButtonModule, ButtonDirective, TaskListComponent, CreateTaskComponent, RippleModule, Ripple], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TaskList, { className: "TaskList", filePath: "src/app/apps/tasklist/index.ts", lineNumber: 26 });
})();
export {
  TaskList
};
//# sourceMappingURL=chunk-B2UHPE7Q.js.map
