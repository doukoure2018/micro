import { Routes } from '@angular/router';
import { RapprochementCutoffGuard } from '@/service/rapprochement-cutoff.guard';
import { AgentCreditGuard } from '@/service/agent-credit.guard';
import { AgentAccueilGuard } from '@/service/agent-accueil.guard';

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
        canActivate: [RapprochementCutoffGuard],
        loadComponent: () => import('./agent-credit/rapprochement-caisse/rapprochement-caisse.component').then((c) => c.RapprochementCaisseComponent)
    },
    {
        path: 'correction-physique',
        data: { breadcrumb: 'Correction Physique' },
        loadComponent: () => import('./agent-credit/correction-physique/correction-physique.component').then((c) => c.CorrectionPhysiqueComponent)
    },
    {
        path: 'situation-stock',
        data: { breadcrumb: 'Situation Stock' },
        loadComponent: () => import('./admin/de/situation-stock/situation-stock.component').then((c) => c.SituationStockComponent)
    },
    {
        path: 'credits-valides-de',
        data: { breadcrumb: 'Crédits validés par DE' },
        loadComponent: () => import('./admin/de/credits-valides-de/credits-valides-de.component').then((c) => c.CreditsValidesDeComponent)
    },
    {
        path: 'dg-vue-de',
        data: { breadcrumb: 'Suivi DE — Vue DG' },
        loadComponent: () => import('./admin/dg/vue-de/vue-de.component').then((c) => c.DgVueDeComponent)
    },
    {
        path: 'suivi-credits-reseau',
        data: { breadcrumb: 'Suivi des crédits de mon réseau' },
        loadComponent: () => import('./admin/reseau/suivi-credits-reseau/suivi-credits-reseau.component').then((c) => c.SuiviCreditsReseauComponent)
    },
    {
        path: 'credits-a-valider-dg',
        data: { breadcrumb: 'Crédits à valider (DG)' },
        loadComponent: () => import('./admin/dg/credits-a-valider-dg/credits-a-valider-dg.component').then((c) => c.CreditsAValiderDgComponent)
    },
    {
        path: 'rejets-dg-a-confirmer',
        data: { breadcrumb: 'Rejets DG à confirmer' },
        loadComponent: () => import('./admin/de/rejets-dg-a-confirmer/rejets-dg-a-confirmer.component').then((c) => c.RejetsDgAConfirmerComponent)
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
        path: 'actualiser-decodeur',
        data: { breadcrumb: 'Actualisation Décodeur Canal+' },
        loadComponent: () => import('./agent-credit/digital-verification/actualiser-decodeur/actualiser-decodeur.component').then((c) => c.ActualiserDecodeurComponent)
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
        path: 'agent-credit/demande-groupe',
        canActivate: [AgentCreditGuard],
        data: { breadcrumb: 'Nouvelle demande de crédit groupe' },
        loadComponent: () => import('./agent-credit/demande-groupe/demande-groupe.component').then((c) => c.DemandeGroupeComponent)
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
        path: 'resp-agent/demandes-affectees',
        data: { breadcrumb: 'Demandes Affectees' },
        loadComponent: () => import('./resp-agent/list-demandes-affectees/list-demandes-affectees.component').then((c) => c.ListDemandesAffecteesComponent)
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
        path: 'edit/:userId',
        data: { breadcrumb: 'Modifier Utilisateur' },
        loadComponent: () => import('./admin/edit-user/edit-user.component').then((c) => c.EditUserComponent)
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
        path: 'credit/individuel/detail/resume-analyse/:demandeId',
        data: { breadcrumb: 'Résumé Analyse Financière' },
        loadComponent: () => import('./credit/individuel/attente/detail/resume-analyse-financiere/resume-analyse-financiere.component').then((c) => c.ResumeAnalyseFinanciereComponent)
    },
    {
        path: 'credit/individuel/detail/analyse-flux-tresorerie/:demandeindividuelId',
        data: { breadcrumb: 'Analyse Flux de Tresorerie' },
        loadComponent: () => import('./credit/individuel/attente/detail/analyse-flux-tresorerie/analyse-flux-tresorerie.component').then((c) => c.AnalyseFluxTresorerieComponent)
    },
    {
        path: 'credit/individuel/detail/analyse-charges-fonctionnaire/:demandeindividuelId',
        data: { breadcrumb: 'Analyse Charges & Quotité (Fonctionnaire)' },
        loadComponent: () => import('./credit/individuel/attente/detail/analyse-charges-fonctionnaire/analyse-charges-fonctionnaire.component').then((c) => c.AnalyseChargesFonctionnaireComponent)
    },
    {
        path: 'credit/individuel/detail/personne-caution/:demandeindividuelId',
        data: { breadcrumb: 'Personnes Caution' },
        loadComponent: () => import('./credit/individuel/attente/detail/personne-caution/personne-caution.component').then((c) => c.PersonneCautionComponent)
    },
    {
        path: 'config',
        data: { breadcrumb: 'Configuration des Points de vente' },
        loadComponent: () => import('./admin/config-reseau/config-reseau.component').then((c) => c.ConfigReseauComponent)
    },
    {
        path: 'reseau-geo',
        data: { breadcrumb: 'Réseau — Géolocalisation' },
        loadComponent: () => import('./admin/reseau-geo/reseau-geo.component').then((c) => c.ReseauGeoComponent)
    },
    {
        path: 'reseau-carte',
        data: { breadcrumb: 'Réseau — Carte' },
        loadComponent: () => import('./admin/reseau-carte/reseau-carte.component').then((c) => c.ReseauCarteComponent)
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
    },
    {
        path: 'agent-credit/societariat/detail-ps',
        data: { breadcrumb: 'Détails corrections par point de service' },
        loadComponent: () => import('./agent-credit/societariat/societariat-detail-ps/societariat-detail-ps.component').then((c) => c.SocietariatDetailPsComponent)
    },
    {
        path: 'suivi-societariat',
        data: { breadcrumb: 'Suivi Societariat' },
        loadComponent: () => import('./admin/suivi-societariat/suivi-societariat.component').then((c) => c.SuiviSocietariatComponent)
    },
    {
        path: 'demande-avance-salaire',
        data: { breadcrumb: 'Demande Avance Salaire' },
        loadComponent: () => import('./admin/demande-avance-salaire/demande-avance-salaire.component').then((c) => c.DemandeAvanceSalaireComponent)
    },
    {
        path: 'mes-demandes-salaire',
        data: { breadcrumb: 'Demande Avance Salaire' },
        loadComponent: () => import('./admin/demande-avance-salaire/mes-demandes-salaire/mes-demandes-salaire.component').then((c) => c.MesDemandesSalaireComponent)
    },
    {
        path: 'gestion-personnel',
        data: { breadcrumb: 'Gestion Personnel' },
        loadComponent: () => import('./admin/gestion-personnel/gestion-personnel.component').then((c) => c.GestionPersonnelComponent)
    },
    {
        path: 'suivi-arrete-caisse',
        data: { breadcrumb: 'Suivi des Arretes de Caisse' },
        loadComponent: () => import('./admin/de/suivi-arrete-caisse/suivi-arrete-caisse.component').then((c) => c.SuiviArreteCaisseComponent)
    },
    {
        path: 'resp-regional',
        data: { breadcrumb: 'Validation DR - Delegue Regional' },
        loadComponent: () => import('./resp-regional/resp-regional.component').then((c) => c.RespRegionalComponent)
    },
    {
        path: 'direction-exploitation',
        data: { breadcrumb: 'Validation DE - Direction Exploitation' },
        loadComponent: () => import('./direction-exploitation/direction-exploitation.component').then((c) => c.DirectionExploitationComponent)
    },
    {
        path: 'agent-credit/correction-demande/:demandeIndividuelId',
        data: { breadcrumb: 'Correction de la Demande' },
        loadComponent: () => import('./agent-credit/correction-demande/correction-demande.component').then((c) => c.CorrectionDemandeComponent)
    },
    {
        path: 'audit-rapprochement',
        data: { breadcrumb: 'Audit Rapprochement de Caisse' },
        loadComponent: () => import('./admin/audit/audit.component').then((c) => c.AuditComponent)
    },
    {
        path: 'rapprochement-caisse-ra',
        data: { breadcrumb: 'Outil Rapprochement de Caisse' },
        canActivate: [RapprochementCutoffGuard],
        loadComponent: () => import('./admin/rapprochement-caisse-ra/rapprochement-caisse-ra.component').then((c) => c.RapprochementCaisseRaComponent)
    },
    {
        path: 'changement-telephone/agent',
        data: { breadcrumb: 'Changement Telephone (Agent)' },
        loadComponent: () => import('./changement-telephone/agent-changement-telephone.component').then((c) => c.AgentChangementTelephoneComponent)
    },
    {
        path: 'changement-telephone/da',
        data: { breadcrumb: 'Validation Changement Telephone (DA)' },
        loadComponent: () => import('./changement-telephone/da-validation-telephone.component').then((c) => c.DaValidationTelephoneComponent)
    },
    {
        path: 'changement-telephone/inspection',
        data: { breadcrumb: 'Inspection Changement Telephone' },
        loadComponent: () => import('./changement-telephone/inspection-telephone.component').then((c) => c.InspectionTelephoneComponent)
    },
    {
        path: 'inspection-credits',
        data: { breadcrumb: 'Inspection - Credits valides DR' },
        loadComponent: () => import('./admin/di/inspection-credits/inspection-credits.component').then((c) => c.InspectionCreditsComponent)
    },
    {
        path: 'guide-circuit-credit',
        data: { breadcrumb: "Guide d'utilisation - Circuit de crédit" },
        loadComponent: () => import('./guide/guide-circuit-credit.component').then((c) => c.GuideCircuitCreditComponent)
    },
    {
        path: 'accueil/reception-demande',
        canActivate: [AgentAccueilGuard],
        data: { breadcrumb: 'Réception demande de crédit', mode: 'accueil' },
        loadComponent: () => import('../auth/credit/demande-ind/demande-ind.component').then((c) => c.DemandeIndComponent)
    },
    {
        path: 'accueil/mes-receptions',
        canActivate: [AgentAccueilGuard],
        data: { breadcrumb: 'Mes demandes réceptionnées' },
        loadComponent: () => import('./accueil/mes-receptions/mes-receptions.component').then((c) => c.MesReceptionsComponent)
    },
    {
        path: 'da/receptions-a-affecter',
        data: { breadcrumb: 'Affectations & réorientation' },
        loadComponent: () => import('./admin/da/receptions-a-affecter/receptions-a-affecter.component').then((c) => c.ReceptionsAAffecterComponent)
    },
    {
        path: 'da/gestion-agents',
        data: { breadcrumb: 'Gestion des agents' },
        loadComponent: () => import('./admin/da/gestion-agents/gestion-agents.component').then((c) => c.GestionAgentsComponent)
    },
    {
        path: 'agent-credit/demandes-affectees',
        canActivate: [AgentCreditGuard],
        data: { breadcrumb: 'Demandes affectées par mon DA' },
        loadComponent: () => import('./agent-credit/demandes-affectees/demandes-affectees.component').then((c) => c.DemandesAffecteesComponent)
    },
    {
        path: 'campagnes-sms',
        data: { breadcrumb: 'Campagnes SMS' },
        loadComponent: () => import('./digital/campagnes-sms/campagnes-sms.component').then((c) => c.CampagnesSmsComponent)
    },
    {
        path: 'repertoires-sms',
        data: { breadcrumb: 'Répertoires SMS' },
        loadComponent: () => import('./digital/repertoires-sms/repertoires-sms.component').then((c) => c.RepertoiresSmsComponent)
    },
    {
        path: 'campagnes-sms/:campagneId',
        data: { breadcrumb: 'Suivi campagne SMS' },
        loadComponent: () => import('./digital/campagnes-sms/campagne-sms-detail.component').then((c) => c.CampagneSmsDetailComponent)
    }
] as Routes;
