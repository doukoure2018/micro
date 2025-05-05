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
        path: 'agent-credit/:pointventeId/:userId',
        data: { breadcrumb: 'Liste des demandes de Credit Pour la selection ' },
        loadComponent: () => import('./agent-credit/credit-selection/credit-selection.component').then((c) => c.CreditSelectionComponent)
    },
    {
        path: 'agent-credit/selection/:demandeindividuel_id/:userId',
        data: { breadcrumb: 'Televerser la fiche de Selection' },
        loadComponent: () => import('./agent-credit/credit-selection/import-selection/import-selection.component').then((c) => c.ImportSelectionComponent)
    },
    {
        path: 'createUser',
        data: { breadcrumb: 'Creation de Compte ' },
        loadComponent: () => import('./admin/create-user/create-user.component').then((c) => c.CreateUserComponent)
    },
    {
        path: 'credit',
        data: { breadcrumb: 'Analyse Credit' },
        loadComponent: () => import('./analyse-credit/analyse-credit.component').then((c) => c.AnalyseCreditComponent)
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
        path: 'credit/new',
        data: { breadcrumb: 'Nouvelle de Credit' },
        loadComponent: () => import('./analyse-credit/step-credit/step-credit.component').then((c) => c.StepCreditComponent)
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
