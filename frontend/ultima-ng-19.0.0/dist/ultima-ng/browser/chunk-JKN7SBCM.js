import "./chunk-4MWRP73S.js";

// src/app/pages/dashboard/dashboard.routes.ts
var dashboard_routes_default = [
  {
    path: "",
    data: { breadcrumb: "Home" },
    loadComponent: () => import("./chunk-NKQ2TKGV.js").then((c) => c.HomeComponent)
  },
  {
    path: "home",
    redirectTo: "",
    pathMatch: "full"
  },
  {
    path: "admin",
    data: { breadcrumb: "Administrateur " },
    loadComponent: () => import("./chunk-J6CRLU2L.js").then((c) => c.AdminComponent)
  },
  {
    path: "stock",
    data: { breadcrumb: "Gestion de Stock" },
    loadComponent: () => import("./chunk-67F4HXCH.js").then((c) => c.StockCmdComponent)
  },
  {
    path: "rapprochement-caisse",
    data: { breadcrumb: "Rapprochement Caisse" },
    loadComponent: () => import("./chunk-AZV25HUD.js").then((c) => c.RapprochementCaisseComponent)
  },
  {
    path: "correction-physique",
    data: { breadcrumb: "Correction Physique" },
    loadComponent: () => import("./chunk-PTKBTYQ5.js").then((c) => c.CorrectionPhysiqueComponent)
  },
  {
    path: "situation-stock",
    data: { breadcrumb: "Situation Stock" },
    loadComponent: () => import("./chunk-6JTISUD3.js").then((c) => c.SituationStockComponent)
  },
  {
    path: "stock",
    data: { breadcrumb: "Gestion de Stock" },
    loadComponent: () => import("./chunk-67F4HXCH.js").then((c) => c.StockCmdComponent)
  },
  {
    path: "correction-en-attente",
    data: { breadcrumb: "Verification Avant et Apres et Mise \xE0 jour" },
    loadComponent: () => import("./chunk-KSAPU4ZN.js").then((c) => c.CorrectionEnAttenteComponent)
  },
  {
    path: "update-correction-rejet/:codCliente",
    data: { breadcrumb: "Correction Rejet" },
    loadComponent: () => import("./chunk-ORIGSM5E.js").then((c) => c.UpdateCorrectionRejetComponent)
  },
  {
    path: "correction-en-attente/detail/:codCliente",
    data: { breadcrumb: "Verification Avant et Apres et Mise \xE0 jour" },
    loadComponent: () => import("./chunk-PI5LUYX3.js").then((c) => c.UpdateCorrectionPersonnePhysiqueComponent)
  },
  {
    path: "verification-client",
    data: { breadcrumb: "Verification Client" },
    loadComponent: () => import("./chunk-43V66THI.js").then((c) => c.DigitalVerificationComponent)
  },
  {
    path: "document-verification",
    data: { breadcrumb: "Document Verification" },
    loadComponent: () => import("./chunk-QQRDP2GQ.js").then((c) => c.DocumentVerificationComponent)
  },
  {
    path: "document-verification/documents/:id",
    loadComponent: () => import("./chunk-LXQNP4RN.js").then((c) => c.DocumentDetailComponent)
  },
  {
    path: "agent-credit/verification/:numeroMembre",
    data: { breadcrumb: "Verfication du Statut de Client" },
    loadComponent: () => import("./chunk-I2WNDQON.js").then((c) => c.MiseEnPlaceCreditComponent)
  },
  {
    path: "agent-credit/detail-credit-ind/:referenceCredit/:numeroMembre",
    data: { breadcrumb: "Information detaill\xE9e du credit" },
    loadComponent: () => import("./chunk-QNTKLJKG.js").then((c) => c.ViewDetailCreditComponent)
  },
  {
    path: "agent-credit/detail-credit-ind/form-credit/:referenceCredit/:numeroMembre/:userId",
    data: { breadcrumb: "Mise en place de credit dans saf2000" },
    loadComponent: () => import("./chunk-PREUT56W.js").then((c) => c.FormCreditComponent)
  },
  {
    path: "fiche-signaletique/:numeroMembre",
    data: { breadcrumb: "Fiche Signaletique Client" },
    loadComponent: () => import("./chunk-FLBM3A3S.js").then((c) => c.FicheSignaletiqueComponent)
  },
  {
    path: "agent-credit/start-credit/:numeroMembre",
    data: { breadcrumb: "Mise en Place de Credit" },
    loadComponent: () => import("./chunk-RPOFAKI2.js").then((c) => c.StartCreditComponent)
  },
  {
    path: "agent-credit/process-credit/:numeroMembre",
    data: { breadcrumb: "Nouvelle Mise en place de petit Credit" },
    loadComponent: () => import("./chunk-SP66THA2.js").then((c) => c.ProcessCreditComponent)
  },
  {
    path: "agent-credit/process-update-credit/:referenceCredit",
    data: { breadcrumb: "Mise \xE0 Jour du Cr\xE9dit" },
    loadComponent: () => import("./chunk-WKI6D5FS.js").then((c) => c.ProcessUpdateCreditComponent)
  },
  {
    path: "agent-credit/process-big-credit/:numeroMembre",
    data: { breadcrumb: "Nouvelle Mise en place de Gros Credit" },
    loadComponent: () => import("./chunk-RRZUMJE3.js").then((c) => c.ProcessBigCreditComponent)
  },
  {
    path: "agent-credit/list-selection-ind",
    data: { breadcrumb: "Liste des demandes de Credit Pour la selection" },
    loadComponent: () => import("./chunk-KQDFQKVG.js").then((c) => c.CreditSelectionComponent)
  },
  {
    path: "agent-credit/selection/:demandeIndividuelId",
    data: { breadcrumb: "Televerser la fiche de Selection" },
    loadComponent: () => import("./chunk-JKFJJPWV.js").then((c) => c.ImportSelectionComponent)
  },
  {
    path: "resp-agent/:referenceCredit/:numeroMembre/:userId",
    data: { breadcrumb: "Mise en Place de Credit" },
    loadComponent: () => import("./chunk-4BNZU5ZL.js").then((c) => c.ViewInstanceCreditIndComponent)
  },
  {
    path: "createUser",
    data: { breadcrumb: "Creation de Compte " },
    loadComponent: () => import("./chunk-MEQRLU3Q.js").then((c) => c.CreateUserComponent)
  },
  {
    path: "credit/analyse-credit",
    data: { breadcrumb: "Analyse Credit" },
    loadComponent: () => import("./chunk-KZXLBJZA.js").then((c) => c.AnalyseCreditComponent)
  },
  {
    path: "credit/:userId/new-step",
    data: { breadcrumb: "Nouvelle analyse de Credit" },
    loadComponent: () => import("./chunk-DGVU7G2P.js").then((c) => c.StepCreditComponent)
  },
  {
    path: "credit/update-analyse-credit/:demandeId",
    data: { breadcrumb: "Nouvelle analyse de Credit" },
    loadComponent: () => import("./chunk-MNKKOTJ4.js").then((c) => c.UdpateAnalyseCreditCompleteComponent)
  },
  {
    path: "credit/:userId/resume-credit/:demandeId",
    data: { breadcrumb: "Nouvelle analyse de Credit" },
    loadComponent: () => import("./chunk-SJMKEUST.js").then((c) => c.ResumeCreditComponent)
  },
  {
    path: "credit/detail/:numberCredit",
    data: { breadcrumb: "Details Credit" },
    loadComponent: () => import("./chunk-RKHHDVIM.js").then((c) => c.DetailCreditComponent)
  },
  {
    path: "credit/individuel/attente",
    data: { breadcrumb: "Liste des Credits Individuels en attente" },
    loadComponent: () => import("./chunk-DNAZAKFG.js").then((c) => c.AttenteComponent)
  },
  {
    path: "credit/individuel/attente/detail/:demandeindividuelId",
    data: { breadcrumb: "Detail Credit Individuel" },
    loadComponent: () => import("./chunk-4L4AWFZP.js").then((c) => c.DetailComponent)
  },
  {
    path: "credit/individuel/detail/analyse-bilan-activite/:demandeindividuelId",
    data: { breadcrumb: "Analyse Bilan Activit\xE9" },
    loadComponent: () => import("./chunk-676XAJ2K.js").then((c) => c.AnalyseBilanActiviteComponent)
  },
  {
    path: "credit/individuel/detail/resume-analyse/:demandeId",
    data: { breadcrumb: "R\xE9sum\xE9 Analyse Financi\xE8re" },
    loadComponent: () => import("./chunk-DUZZ73FQ.js").then((c) => c.ResumeAnalyseFinanciereComponent)
  },
  {
    path: "credit/individuel/detail/analyse-flux-tresorerie/:demandeindividuelId",
    data: { breadcrumb: "Analyse Flux de Tresorerie" },
    loadComponent: () => import("./chunk-3EINSIGK.js").then((c) => c.AnalyseFluxTresorerieComponent)
  },
  {
    path: "config",
    data: { breadcrumb: "Configuration des Points de vente" },
    loadComponent: () => import("./chunk-IVJZ57R6.js").then((c) => c.ConfigReseauComponent)
  },
  {
    path: "analytics",
    data: { breadcrumb: "Analytics Dashboard" },
    loadComponent: () => import("./chunk-TOIXHCHC.js").then((c) => c.DashboardAnalytics)
  },
  {
    path: "sales",
    data: { breadcrumb: "Sales Dashboard" },
    loadComponent: () => import("./chunk-2DPEZO3Y.js").then((c) => c.DashboardSales)
  },
  {
    path: "saas",
    data: { breadcrumb: "Saas Dashboard" },
    loadComponent: () => import("./chunk-URORYKDM.js").then((c) => c.DashboardSaas)
  },
  {
    path: "agent-credit/societariat/detail-ps",
    data: { breadcrumb: "D\xE9tails corrections par point de service" },
    loadComponent: () => import("./chunk-2SMUVUE5.js").then((c) => c.SocietariatDetailPsComponent)
  },
  {
    path: "suivi-societariat",
    data: { breadcrumb: "Suivi Societariat" },
    loadComponent: () => import("./chunk-P6AUM36C.js").then((c) => c.SuiviSocietariatComponent)
  },
  {
    path: "demande-avance-salaire",
    data: { breadcrumb: "Demande Avance Salaire" },
    loadComponent: () => import("./chunk-KDFMPAKJ.js").then((c) => c.DemandeAvanceSalaireComponent)
  },
  {
    path: "mes-demandes-salaire",
    data: { breadcrumb: "Demande Avance Salaire" },
    loadComponent: () => import("./chunk-5UWLYTPX.js").then((c) => c.MesDemandesSalaireComponent)
  },
  {
    path: "gestion-personnel",
    data: { breadcrumb: "Gestion Personnel" },
    loadComponent: () => import("./chunk-D37BNP3V.js").then((c) => c.GestionPersonnelComponent)
  },
  {
    path: "suivi-arrete-caisse",
    data: { breadcrumb: "Suivi des Arretes de Caisse" },
    loadComponent: () => import("./chunk-PXHMLRI6.js").then((c) => c.SuiviArreteCaisseComponent)
  }
];
export {
  dashboard_routes_default as default
};
//# sourceMappingURL=chunk-JKN7SBCM.js.map
