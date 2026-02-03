import "./chunk-4MWRP73S.js";

// src/app/pages/auth/auth.routes.ts
var auth_routes_default = [
  {
    path: "",
    loadComponent: () => import("./chunk-2I3EWZEB.js").then((c) => c.AuthComponent),
    children: [
      { path: "", loadComponent: () => import("./chunk-6G62GMAY.js").then((c) => c.HomeComponent) },
      { path: "credit/demandeInd", loadComponent: () => import("./chunk-JTBO5UBM.js").then((c) => c.DemandeIndComponent) },
      { path: "error", loadComponent: () => import("./chunk-PWQBGTJF.js").then((c) => c.Error) },
      { path: "error2", loadComponent: () => import("./chunk-KAB3CNIZ.js").then((c) => c.Error2) },
      { path: "access", loadComponent: () => import("./chunk-7TEQ5XTU.js").then((c) => c.AccessDenied) },
      { path: "access2", loadComponent: () => import("./chunk-NNH6OIXJ.js").then((c) => c.AccessDenied2) },
      { path: "login", loadComponent: () => import("./chunk-Y6MMN6TT.js").then((c) => c.Login) },
      { path: "login2", loadComponent: () => import("./chunk-DEKA3CNY.js").then((c) => c.Login2) },
      { path: "forgotpassword", loadComponent: () => import("./chunk-JPSSGYNY.js").then((c) => c.ForgotpasswordComponent) },
      { path: "register", loadComponent: () => import("./chunk-AQGRFLEP.js").then((c) => c.RegisterComponent) },
      { path: "newpassword", loadComponent: () => import("./chunk-UNWV565M.js").then((c) => c.NewPassword) },
      { path: "verify/account", loadComponent: () => import("./chunk-IKF75Q46.js").then((c) => c.VerifyaccountComponent) },
      { path: "verify/password", loadComponent: () => import("./chunk-6RYCRYGU.js").then((c) => c.VerifypasswordComponent) },
      { path: "lockscreen", loadComponent: () => import("./chunk-I6KCS4XF.js").then((c) => c.LockScreen) },
      { path: "**", redirectTo: "/notfound" }
    ]
  }
];
export {
  auth_routes_default as default
};
//# sourceMappingURL=chunk-CLHKRFNM.js.map
