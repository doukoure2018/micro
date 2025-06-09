import { Routes } from '@angular/router';

export default [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        data: { breadcrumb: 'Home' },
        loadComponent: () => import('./home/home.component').then((c) => c.HomeComponent)
    },
    {
        path: 'admin',
        data: { breadcrumb: 'Administrateur ' },
        loadComponent: () => import('./admin/admin.component').then((c) => c.AdminComponent)
    },
    {
        path: 'agent-credit/:numeroMembre/:userId',
        data: { breadcrumb: 'Verfication du Statut de Client' },
        loadComponent: () => import('./agent-credit/mise-en-place-credit/mise-en-place-credit.component').then((c) => c.MiseEnPlaceCreditComponent)
    },
    {
        path: 'agent-credit/detail-credit-ind/:referenceCredit/:numeroMembre/:userId',
        data: { breadcrumb: 'Information detaillée du credit' },
        loadComponent: () => import('./agent-credit/view-detail-credit/view-detail-credit.component').then((c) => c.ViewDetailCreditComponent)
    },
    {
        path: 'agent-credit/detail-credit-ind/form-credit/:referenceCredit/:numeroMembre/:userId',
        data: { breadcrumb: 'Mise en place de credit dans saf2000' },
        loadComponent: () => import('./agent-credit/view-detail-credit/form-place-credit/form-credit.component').then((c) => c.FormCreditComponent)
    },
    {
        path: 'fiche-signaletique/:numeroMembre',
        data: { breadcrumb: 'Fiche Signaletique Client' },
        loadComponent: () => import('./agent-credit/fiche-signaletique/fiche-signaletique.component').then((c) => c.FicheSignaletiqueComponent)
    },
    {
        path: 'start-credit/:numeroMembre/:userId',
        data: { breadcrumb: 'Mise en Place de Credit' },
        loadComponent: () => import('./agent-credit/start-credit/start-credit.component').then((c) => c.StartCreditComponent)
    },
    {
        path: 'process-credit/:numeroMembre/:userId',
        data: { breadcrumb: 'Nouvelle Mise en place de petit Credit' },
        loadComponent: () => import('./agent-credit/process-credit/process-credit.component').then((c) => c.ProcessCreditComponent)
    },
    {
        path: 'process-big-credit/:numeroMembre/:userId',
        data: { breadcrumb: 'Nouvelle Mise en place de Gros Credit' },
        loadComponent: () => import('./agent-credit/process-big-credit/process-big-credit.component').then((c) => c.ProcessBigCreditComponent)
    },
    {
        path: 'agent-credit/list-selection-ind/:pointventeId/:userId',
        data: { breadcrumb: 'Liste des demandes de Credit Pour la selection' },
        loadComponent: () => import('./agent-credit/credit-selection/credit-selection.component').then((c) => c.CreditSelectionComponent)
    },
    {
        path: 'agent-credit/selection/:demandeindividuel_id/:userId',
        data: { breadcrumb: 'Televerser la fiche de Selection' },
        loadComponent: () => import('./agent-credit/credit-selection/import-selection/import-selection.component').then((c) => c.ImportSelectionComponent)
    },
    {
        path: 'resp-agent/:referenceCredit/:numeroMembre/:userId',
        data: { breadcrumb: 'Mise en Place de Credit' },
        loadComponent: () => import('./resp-agent/view-instance-credit-ind/view-instance-credit-ind.component').then((c) => c.ViewInstanceCreditIndComponent)
    },

    {
        path: 'createUser',
        data: { breadcrumb: 'Creation de Compte ' },
        loadComponent: () => import('./admin/create-user/create-user.component').then((c) => c.CreateUserComponent)
    },
    {
        path: 'credit/:userId',
        data: { breadcrumb: 'Analyse Credit' },
        loadComponent: () => import('./analyse-credit/analyse-credit.component').then((c) => c.AnalyseCreditComponent)
    },
    {
        path: 'credit/:userId/new-step',
        data: { breadcrumb: 'Nouvelle analyse de Credit' },
        loadComponent: () => import('./analyse-credit/step-credit/step-credit.component').then((c) => c.StepCreditComponent)
    },
    {
        path: 'credit/:userId/resume-credit/:demandeId',
        data: { breadcrumb: 'Nouvelle analyse de Credit' },
        loadComponent: () => import('./analyse-credit/resume-credit/resume-credit.component').then((c) => c.ResumeCreditComponent)
    },

    {
        path: 'credit/detail/:numberCredit',
        data: { breadcrumb: 'Details Credit' },
        loadComponent: () => import('./analyse-credit/detail-credit/detail-credit.component').then((c) => c.DetailCreditComponent)
    },
    {
        path: 'credit/individuel/attente/:pointventeId',
        data: { breadcrumb: 'Liste des Credits Individuels en attente' },
        loadComponent: () => import('./credit/individuel/attente/attente.component').then((c) => c.AttenteComponent)
    },
    {
        path: 'credit/individuel/attente/detail/:demandeindividuel_id',
        data: { breadcrumb: 'Detail Credit Individuel' },
        loadComponent: () => import('./credit/individuel/attente/detail/detail.component').then((c) => c.DetailComponent)
    },

    {
        path: 'config',
        data: { breadcrumb: 'Configuration des Points de vente' },
        loadComponent: () => import('./admin/config-reseau/config-reseau.component').then((c) => c.ConfigReseauComponent)
    },
    {
        path: 'analytics',
        data: { breadcrumb: 'Analytics Dashboard' },
        loadComponent: () => import('./analytics/dashboardanalytics').then((c) => c.DashboardAnalytics)
    },

    {
        path: 'sales',
        data: { breadcrumb: 'Sales Dashboard' },
        loadComponent: () => import('./sales/dashboardsales').then((c) => c.DashboardSales)
    },
    {
        path: 'saas',
        data: { breadcrumb: 'Saas Dashboard' },
        loadComponent: () => import('./saas/dashboardsaas').then((c) => c.DashboardSaas)
    }
] as Routes;
