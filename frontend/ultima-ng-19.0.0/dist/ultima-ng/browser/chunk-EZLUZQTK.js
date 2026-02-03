import "./chunk-4MWRP73S.js";

// src/app/apps/apps.routes.ts
var apps_routes_default = [
  {
    path: "blog",
    loadChildren: () => import("./chunk-KVRG5PZY.js"),
    data: { breadcrumb: "Blog" }
  },
  {
    path: "chat",
    loadComponent: () => import("./chunk-IKCFDA5P.js").then((c) => c.Chat),
    data: { breadcrumb: "Chat" }
  },
  {
    path: "files",
    loadComponent: () => import("./chunk-BKPTWARD.js").then((c) => c.Files),
    data: { breadcrumb: "Files" }
  },
  {
    path: "mail",
    loadChildren: () => import("./chunk-WIQHYNWW.js"),
    data: { breadcrumb: "Mail" }
  },
  {
    path: "tasklist",
    loadComponent: () => import("./chunk-B2UHPE7Q.js").then((c) => c.TaskList),
    data: { breadcrumb: "Tasklist" }
  },
  {
    path: "kanban",
    loadComponent: () => import("./chunk-V3Q3JQAE.js").then((c) => c.Kanban),
    data: { breadcrumb: "Kanban" }
  }
];
export {
  apps_routes_default as default
};
//# sourceMappingURL=chunk-EZLUZQTK.js.map
