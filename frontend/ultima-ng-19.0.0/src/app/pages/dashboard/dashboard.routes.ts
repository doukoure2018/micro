import { Routes } from '@angular/router';

export default [
    {
        path: '',
        data: { breadcrumb: 'Home' },
        loadComponent: () => import('./home/home.component').then((c) => c.HomeComponent)
    },
    {
        path: 'home',
        redirectTo: '',
        pathMatch: 'full'
    },
    {
        path: 'admin',
        data: { breadcrumb: 'Administrateur ' },
        loadComponent: () => import('./admin/admin.component').then((c) => c.AdminComponent)
    },
    {
        path: 'stock',
        data: { breadcrumb: 'Gestion de Stock' },
        loadComponent: () => import('./agent-credit/stock-cmd/stock-cmd.component').then((c) => c.StockCmdComponent)
    },
    {
        path: 'rapprochement-caisse',
        data: { breadcrumb: 'Rapprochement Caisse' },
        loadComponent: () => import('./agent-credit/rapprochement-caisse/rapprochement-caisse.component').then((c) => c.RapprochementCaisseComponent)
    },
    {
        path: 'correction-physique',
        data: { breadcrumb: 'Correction Physique' },
        loadComponent: () => import('./agent-credit/correction-physique/correction-physique.component').then((c) => c.CorrectionPhysiqueComponent)
    },
    {
        path: 'stock',
        data: { breadcrumb: 'Gestion de Stock' },
        loadComponent: () => import('./agent-credit/stock-cmd/stock-cmd.component').then((c) => c.StockCmdComponent)
    },
    {
        path: 'correction-en-attente',
        data: { breadcrumb: 'Verification Avant et Apres et Mise à jour' },
        loadComponent: () => import('./agent-credit/correction-en-attente/correction-en-attente.component').then((c) => c.CorrectionEnAttenteComponent)
    },
    {
        path: 'update-correction-rejet/:codCliente',
        data: { breadcrumb: 'Correction Rejet' },
        loadComponent: () => import('./agent-credit/update-correction-rejet/update-correction-rejet.component').then((c) => c.UpdateCorrectionRejetComponent)
    },
    {
        path: 'correction-en-attente/detail/:codCliente',
        data: { breadcrumb: 'Verification Avant et Apres et Mise à jour' },
        loadComponent: () => import('./agent-credit/correction-en-attente/update-correction-personne-physique/update-correction-personne-physique.component').then((c) => c.UpdateCorrectionPersonnePhysiqueComponent)
    },
    {
        path: 'verification-client',
        data: { breadcrumb: 'Verification Client' },
        loadComponent: () => import('./agent-credit/digital-verification/digital-verification.component').then((c) => c.DigitalVerificationComponent)
    },
    {
        path: 'document-verification',
        data: { breadcrumb: 'Document Verification' },
        loadComponent: () => import('./agent-credit/digital-verification/document-verification/document-verification.component').then((c) => c.DocumentVerificationComponent)
    },
    {
        path: 'document-verification/documents/:id',
        loadComponent: () => import('./agent-credit/digital-verification/document-verification/document-detail/document-detail.component').then((c) => c.DocumentDetailComponent)
    },
    {
        path: 'agent-credit/verification/:numeroMembre',
        data: { breadcrumb: 'Verfication du Statut de Client' },
        loadComponent: () => import('./agent-credit/mise-en-place-credit/mise-en-place-credit.component').then((c) => c.MiseEnPlaceCreditComponent)
    },
    {
        path: 'agent-credit/detail-credit-ind/:referenceCredit/:numeroMembre',
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
        path: 'agent-credit/start-credit/:numeroMembre',
        data: { breadcrumb: 'Mise en Place de Credit' },
        loadComponent: () => import('./agent-credit/start-credit/start-credit.component').then((c) => c.StartCreditComponent)
    },
    {
        path: 'agent-credit/process-credit/:numeroMembre',
        data: { breadcrumb: 'Nouvelle Mise en place de petit Credit' },
        loadComponent: () => import('./agent-credit/process-credit/process-credit.component').then((c) => c.ProcessCreditComponent)
    },
    {
        path: 'agent-credit/process-update-credit/:referenceCredit',
        data: { breadcrumb: 'Mise à Jour du Crédit' },
        loadComponent: () => import('./agent-credit/process-update-credit/process-update-credit.component').then((c) => c.ProcessUpdateCreditComponent)
    },
    {
        path: 'agent-credit/process-big-credit/:numeroMembre',
        data: { breadcrumb: 'Nouvelle Mise en place de Gros Credit' },
        loadComponent: () => import('./agent-credit/process-big-credit/process-big-credit.component').then((c) => c.ProcessBigCreditComponent)
    },
    {
        path: 'agent-credit/list-selection-ind',
        data: { breadcrumb: 'Liste des demandes de Credit Pour la selection' },
        loadComponent: () => import('./agent-credit/credit-selection/credit-selection.component').then((c) => c.CreditSelectionComponent)
    },
    {
        path: 'agent-credit/selection/:demandeIndividuelId',
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
        path: 'credit/analyse-credit',
        data: { breadcrumb: 'Analyse Credit' },
        loadComponent: () => import('./analyse-credit/analyse-credit.component').then((c) => c.AnalyseCreditComponent)
    },
    {
        path: 'credit/:userId/new-step',
        data: { breadcrumb: 'Nouvelle analyse de Credit' },
        loadComponent: () => import('./analyse-credit/step-credit/step-credit.component').then((c) => c.StepCreditComponent)
    },
    {
        path: 'credit/update-analyse-credit/:demandeId',
        data: { breadcrumb: 'Nouvelle analyse de Credit' },
        loadComponent: () => import('./analyse-credit/resume-credit/udpate-analyse-credit-complete/udpate-analyse-credit-complete.component').then((c) => c.UdpateAnalyseCreditCompleteComponent)
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
        path: 'credit/individuel/attente',
        data: { breadcrumb: 'Liste des Credits Individuels en attente' },
        loadComponent: () => import('./credit/individuel/attente/attente.component').then((c) => c.AttenteComponent)
    },
    {
        path: 'credit/individuel/attente/detail/:demandeindividuelId',
        data: { breadcrumb: 'Detail Credit Individuel' },
        loadComponent: () => import('./credit/individuel/attente/detail/detail.component').then((c) => c.DetailComponent)
    },
    {
        path: 'credit/individuel/detail/analyse-bilan-activite/:demandeindividuelId',
        data: { breadcrumb: 'Analyse Bilan Activité' },
        loadComponent: () => import('./credit/individuel/attente/detail/analyse-bilan-activite/analyse-bilan-activite.component').then((c) => c.AnalyseBilanActiviteComponent)
    },
    {
        path: 'credit/individuel/detail/analyse-flux-tresorerie/:demandeindividuelId',
        data: { breadcrumb: 'Analyse Flux de Tresorerie' },
        loadComponent: () => import('./credit/individuel/attente/detail/analyse-flux-tresorerie/analyse-flux-tresorerie.component').then((c) => c.AnalyseFluxTresorerieComponent)
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
