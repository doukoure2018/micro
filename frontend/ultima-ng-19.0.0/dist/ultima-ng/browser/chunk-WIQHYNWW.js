import "./chunk-4MWRP73S.js";

// src/app/apps/mail/mail.routes.ts
var mail_routes_default = [
  {
    path: "",
    loadComponent: () => import("./chunk-KGEBAPRG.js").then((c) => c.MailAppComponent),
    children: [
      { path: "", redirectTo: "inbox", pathMatch: "full" },
      {
        path: "inbox",
        data: { breadcrumb: "Inbox" },
        loadComponent: () => import("./chunk-GO4F44LU.js").then((c) => c.MailInboxComponent)
      },
      {
        path: "detail/:id",
        data: { breadcrumb: "Detail" },
        loadComponent: () => import("./chunk-5QMBOOHX.js").then((c) => c.MailDetailComponent)
      },
      {
        path: "compose",
        data: { breadcrumb: "Compose" },
        loadComponent: () => import("./chunk-IGXEX3AA.js").then((c) => c.MailComposeComponent)
      },
      {
        path: "archived",
        data: { breadcrumb: "Archived" },
        loadComponent: () => import("./chunk-CWMT4PWP.js").then((c) => c.MailArchiveComponent)
      },
      {
        path: "important",
        data: { breadcrumb: "Important" },
        loadComponent: () => import("./chunk-NODYFHDF.js").then((c) => c.MailImportantComponent)
      },
      {
        path: "sent",
        data: { breadcrumb: "Sent" },
        loadComponent: () => import("./chunk-A4EIXXIU.js").then((c) => c.MailSentComponent)
      },
      {
        path: "spam",
        data: { breadcrumb: "Spam" },
        loadComponent: () => import("./chunk-T524FEPE.js").then((c) => c.MailSpamComponent)
      },
      {
        path: "starred",
        data: { breadcrumb: "Starred" },
        loadComponent: () => import("./chunk-YBMKLAQ7.js").then((c) => c.MailStarredComponent)
      },
      {
        path: "trash",
        data: { breadcrumb: "Trash" },
        loadComponent: () => import("./chunk-OQVBILVF.js").then((c) => c.MailTrashComponent)
      }
    ]
  }
];
export {
  mail_routes_default as default
};
//# sourceMappingURL=chunk-WIQHYNWW.js.map
