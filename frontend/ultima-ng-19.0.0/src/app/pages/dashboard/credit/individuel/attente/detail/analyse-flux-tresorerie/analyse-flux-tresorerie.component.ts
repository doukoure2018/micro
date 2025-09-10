import { Component, signal, computed, OnInit, inject, effect, ChangeDetectorRef, NgZone, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '@/service/user.service';
import { CATEGORIES_DECAISSEMENT } from '@/interface/categorie-decaissement';
import { FieldsetModule } from 'primeng/fieldset';
import { DividerModule } from 'primeng/divider';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';

import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ModeVueTresorerieComponent } from './mode-vue-tresorerie/mode-vue-tresorerie.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TresorerieStateService } from '@/service/tresorerie-state.service';
import { TresoreriePrintService } from '@/service/TresoreriePrintService';
import { SplitButtonModule } from 'primeng/splitbutton';

@Component({
    selector: 'app-analyse-flux-tresorerie',
    imports: [
        CommonModule,
        RouterLink,
        ButtonModule,
        TableModule,
        InputNumberModule,
        CardModule,
        ToastModule,
        DialogModule,
        DropdownModule,
        ReactiveFormsModule,
        FieldsetModule,
        DialogModule,
        DividerModule,
        InputTextModule,
        TextareaModule,
        TagModule,
        MessageModule,
        ConfirmDialog,
        ProgressBarModule,
        TooltipModule,
        BadgeModule,
        ModeVueTresorerieComponent,
        SplitButtonModule
    ],
    templateUrl: './analyse-flux-tresorerie.component.html',
    styleUrl: './analyse-flux-tresorerie.component.scss',
    providers: [MessageService, ConfirmationService]
})
export class AnalyseFluxTresorerieComponent {
    private fb = inject(FormBuilder);
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private cdr = inject(ChangeDetectorRef);
    private destroyRef = inject(DestroyRef);
    public tresorerieState = inject(TresorerieStateService);

    private tresoreriePrintService = inject(TresoreriePrintService);

    // Données de la demande individuelle
    demandeIndividuelId: number | null = null;
    demandeIndividuel = signal<any>(null);
    garanties = signal<any[]>([]);

    // État de chargement pour la demande
    loadingDemande = signal(false);

    // Formulaire principal
    tresorerieForm!: FormGroup;
    creditParamsForm!: FormGroup;
    newClientForm!: FormGroup;

    // Dialog
    showNewClientDialog = false;
    savingClient = false;
    showHistoryDialog = false;

    private ngZone = inject(NgZone);

    // État global
    state = signal({
        hasDossierCredit: false,
        loading: false,
        saving: false,
        viewMode: 'saisie' as 'saisie' | 'vue-ensemble',
        error: null as string | null
    });

    // Observable du mois courant
    currentMonth = signal(0);

    // Tracking des mois
    moisRenseignes = signal<Set<number>>(new Set());
    moisSauvegardes = signal<Set<number>>(new Set());

    // Listes et données
    clients = signal<any[]>([]);
    dossiers = signal<any[]>([]);
    selectedDossier = signal<any>(null);
    hasExistingAnalysis = signal<boolean>(false);
    // Mois de 0 à 12
    mois = Array.from({ length: 13 }, (_, i) => i);
    categoriesDecaissement = CATEGORIES_DECAISSEMENT;

    // État actuel du mois en édition
    // currentMonthData = signal<any>(null);
    // isEditMode = signal<boolean>(false);

    showDossiersHistory() {
        this.showHistoryDialog = true;
    }

    getStatutSeverity(statut: string): 'success' | 'info' | 'warn' | 'secondary' | 'contrast' | 'danger' | undefined {
        if (statut === 'Validé') return 'success';
        if (statut === 'En attente') return 'info';
        if (statut === 'Rejeté') return 'danger';
        return 'secondary';
    }

    moisEnCoursModification = signal<number | null>(null);

    // Types d'activité
    typesActivite = [
        { label: 'Commerce', value: 'COMMERCE' },
        { label: 'Service', value: 'SERVICE' },
        { label: 'Production', value: 'PRODUCTION' },
        { label: 'Agriculture', value: 'AGRICULTURE' },
        { label: 'Artisanat', value: 'ARTISANAT' },
        { label: 'Autre', value: 'AUTRE' }
    ];
    // Paramètres du crédit
    creditParams = signal({
        montantCredit: 0,
        tauxInteret: 0,
        duree: 12,
        clientId: 0,
        clientNom: '',
        dossierId: 0
    });

    // SOLUTION 1: Ajouter un signal pour forcer le refresh du formulaire
    formRefreshTrigger = signal(0);

    // Calcul de la mensualité
    mensualite = computed(() => {
        const params = this.creditParams();
        if (!params.montantCredit || !params.duree || !params.tauxInteret) {
            return { capital: 0, interet: 0, total: 0 };
        }

        const tauxMensuel = params.tauxInteret / 100 / 12;
        const nombreMensualites = params.duree;
        const montant = params.montantCredit;

        if (tauxMensuel === 0) {
            const mensualite = montant / nombreMensualites;
            return { capital: mensualite, interet: 0, total: mensualite };
        }

        const mensualite = (montant * (tauxMensuel * Math.pow(1 + tauxMensuel, nombreMensualites))) / (Math.pow(1 + tauxMensuel, nombreMensualites) - 1);

        const interetMoyen = mensualite - montant / nombreMensualites;
        const capitalMoyen = montant / nombreMensualites;

        return {
            capital: capitalMoyen,
            interet: interetMoyen,
            total: mensualite
        };
    });

    constructor() {
        // S'abonner aux changements de mois
        this.tresorerieState.currentMonth$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((month) => {
            this.currentMonth.set(month);
            this.loadMonthData(month);
        });

        // S'abonner aux changements de prévisions
        this.tresorerieState.previsions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.updateTrackingSets();
        });
    }

    // Mise à jour des sets de tracking
    private updateTrackingSets(): void {
        const monthsWithData = this.tresorerieState.getMonthsWithData();
        const savedMonths = this.tresorerieState.getSavedMonths();

        this.moisRenseignes.set(new Set(monthsWithData));
        this.moisSauvegardes.set(new Set(savedMonths));
    }

    ngOnInit() {
        // D'ABORD initialiser les formulaires
        this.initializeCreditParamsForm();
        this.initializeNewClientForm();
        this.initializeForm();
        this.setupCalculations();

        // ENSUITE charger les données
        this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            this.demandeIndividuelId = params['demandeindividuelId'] ? parseInt(params['demandeindividuelId'], 10) : null;

            if (this.demandeIndividuelId) {
                this.loadDemandeIndividuel();
            }
        });

        this.loadInitialParams();
    }

    loadDemandeIndividuel() {
        if (!this.demandeIndividuelId) return;

        this.loadingDemande.set(true);
        this.userService.getDemandeWithGaranties$(this.demandeIndividuelId).subscribe({
            next: (response) => {
                console.log('Response demandeIndividuel:', response);

                if (response.data?.demandeIndividuel) {
                    const demande = response.data.demandeIndividuel;
                    this.demandeIndividuel.set(demande);
                    this.garanties.set(demande.garanties || []);

                    // Pré-remplir le formulaire des paramètres du crédit
                    this.preFillCreditParams(demande);

                    // Vérifier si un dossier de crédit existe
                    if (response.data.hasDossierCredit && response.data.dossierCredit) {
                        console.log('Dossier de crédit existant trouvé:', response.data.dossierCredit);
                        this.handleExistingDossierWithPrevisions(response.data.dossierCredit);
                    } else if (response.data.hasDemandeCredit && response.data.demande_credit) {
                        // Si pas de dossier mais une demande de crédit existe
                        this.handleExistingDemandeCredit(response.data.demande_credit);
                    }
                }
                this.loadingDemande.set(false);
            },
            error: (error) => {
                console.error('Erreur chargement demande:', error);
                this.loadingDemande.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible de charger la demande individuelle'
                });
            }
        });
    }

    handleExistingDemandeCredit(demandeCredit: any) {
        console.log('Handling existing demande credit:', demandeCredit);

        this.messageService.add({
            severity: 'info',
            summary: 'Demande de crédit existante',
            detail: "Une demande de crédit existe mais aucun dossier d'analyse n'a été créé"
        });
    }

    handleExistingDossierWithPrevisions(dossierCredit: any) {
        console.log('Handling existing dossier with previsions:', dossierCredit);

        // Mettre à jour les paramètres du crédit avec les infos du dossier
        this.creditParams.update((params) => ({
            ...params,
            dossierId: dossierCredit.id,
            montantCredit: dossierCredit.montantDemande || params.montantCredit,
            duree: dossierCredit.dureeMois || params.duree,
            tauxInteret: dossierCredit.tauxInteret || params.tauxInteret
        }));

        // Mettre à jour le formulaire aussi
        this.creditParamsForm.patchValue(
            {
                montantCredit: dossierCredit.montantDemande,
                duree: dossierCredit.dureeMois,
                tauxInteret: dossierCredit.tauxInteret
            },
            { emitEvent: false }
        );

        this.messageService.add({
            severity: 'info',
            summary: 'Dossier existant',
            detail: `Dossier de crédit N°${dossierCredit.id} trouvé - Chargement des prévisions...`
        });

        // Charger les prévisions pour ce dossier
        this.loadPrevisionsForDossier(dossierCredit.id);
    }

    private loadPrevisionsForDossier(dossierId: number) {
        console.log('Loading previsions for dossier:', dossierId);
        this.state.update((s) => ({ ...s, loading: true }));

        this.userService.getPrevisionsTresorerie$(dossierId).subscribe({
            next: (response) => {
                if (response.data?.previsions?.length! > 0) {
                    // Réinitialiser le service d'état
                    this.tresorerieState.clearAll();
                    const previsionsData = response.data.previsions!.map((p: any) => ({
                        numeroMois: p.numeroMois,
                        data: this.extractPrevisionFormData(p)
                    }));

                    this.tresorerieState.loadAllPrevisions(previsionsData);

                    // Charger dans les formulaires
                    response.data.previsions!.forEach((prevision: any) => {
                        this.loadPrevisionData(prevision);
                    });

                    // Aller au premier mois avec des données ou au mois 0
                    const firstMonthWithData = this.tresorerieState.getMonthsWithData()[0] || 0;
                    this.goToMonth(firstMonthWithData);

                    // Recalculer après un délai
                    setTimeout(() => {
                        this.calculateAllMonths();
                        this.cdr.detectChanges();
                    }, 200);

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Prévisions chargées',
                        detail: `${response.data.previsions!.length} mois chargés`
                    });
                }

                this.state.update((s) => ({ ...s, loading: false }));
            },
            error: (error) => {
                console.error('Erreur chargement prévisions:', error);
                this.state.update((s) => ({ ...s, loading: false }));
            }
        });
    }

    // Méthode pour charger les prévisions avec meilleure gestion d'état
    private loadPrevisionData(prevision: any) {
        const moisNum = prevision.numeroMois;
        const moisForm = this.getMoisFormGroup(moisNum);

        if (!moisForm) {
            console.warn(`FormGroup pour mois ${moisNum} non trouvé`);
            return;
        }

        // Préparer toutes les données
        const formData = this.extractPrevisionFormData(prevision);

        // Mettre à jour le formulaire
        moisForm.patchValue(formData, { emitEvent: false });

        // Mettre à jour le service d'état
        this.tresorerieState.updatePrevision(
            moisNum,
            formData,
            true, // saved
            true // hasData
        );

        // Forcer la détection de changements
        this.cdr.detectChanges();
    }

    // Nouvelle méthode pour extraire les données
    private extractPrevisionFormData(prevision: any): any {
        const formData: any = {
            soldeDebut: prevision.soldeDebut || 0,
            totalEncaissements: prevision.totalEncaissements || 0,
            totalDecaissements: prevision.totalDecaissements || 0,
            excedentDeficit: prevision.excedentDeficit || 0,
            soldeFin: prevision.soldeFin || 0,
            ventes: 0,
            autresRevenus: 0,
            pret: 0,
            achatmarchandises: 0,
            mainoeuvre: 0,
            investissement: 0,
            impotstaxes: 0,
            loyer: 0,
            utilities: 0,
            transport: 0,
            salaires: 0,
            fraistelephone: 0,
            chargesfinancieres: 0,
            entretien: 0,
            autresdepenses: 0,
            interetsAVerser: 0,
            remboursementCapital: 0
        };

        // Traiter les encaissements
        if (prevision.lignesEncaissement?.length) {
            prevision.lignesEncaissement.forEach((ligne: any) => {
                switch (ligne.categorie) {
                    case 'VENTES':
                        formData.ventes = ligne.montant;
                        break;
                    case 'AUTRES_REVENUS':
                        formData.autresRevenus = ligne.montant;
                        break;
                    case 'PRET':
                        formData.pret = ligne.montant;
                        break;
                }
            });
        }

        // Traiter les décaissements
        if (prevision.lignesDecaissement?.length) {
            prevision.lignesDecaissement.forEach((ligne: any) => {
                switch (ligne.categorie) {
                    case 'ACHAT_MARCHANDISES':
                        formData.achatmarchandises = ligne.montant;
                        break;
                    case 'MAIN_OEUVRE':
                        formData.mainoeuvre = ligne.montant;
                        break;
                    case 'INVESTISSEMENT':
                        formData.investissement = ligne.montant;
                        break;
                    case 'IMPOTS_TAXES':
                        formData.impotstaxes = ligne.montant;
                        break;
                    case 'LOYER':
                        formData.loyer = ligne.montant;
                        break;
                    case 'UTILITIES':
                        formData.utilities = ligne.montant;
                        break;
                    case 'TRANSPORT':
                        formData.transport = ligne.montant;
                        break;
                    case 'SALAIRES':
                        formData.salaires = ligne.montant;
                        break;
                    case 'FRAIS_TELEPHONE':
                        formData.fraistelephone = ligne.montant;
                        break;
                    case 'CHARGES_FINANCIERES':
                        formData.chargesfinancieres = ligne.montant;
                        break;
                    case 'ENTRETIEN':
                        formData.entretien = ligne.montant;
                        break;
                    case 'AUTRES_DEPENSES':
                        formData.autresdepenses = ligne.montant;
                        break;
                    case 'INTERETS':
                        formData.interetsAVerser = ligne.montant;
                        break;
                    case 'CAPITAL':
                        formData.remboursementCapital = ligne.montant;
                        break;
                }
            });
        }

        return formData;
    }
    // Gérer un dossier existant
    handleExistingDossier(dossierCredit: any) {
        console.log('Handling existing dossier:', dossierCredit);

        this.creditParams.update((params) => ({
            ...params,
            dossierId: dossierCredit.id
        }));

        this.messageService.add({
            severity: 'info',
            summary: 'Dossier existant',
            detail: `Dossier de crédit N°${dossierCredit.id} trouvé - Chargement des prévisions...`
        });

        // IMPORTANT : Charger automatiquement les prévisions existantes
        this.loadExistingPrevisionsForDossier(dossierCredit.id);
    }

    // Nouvelle méthode pour charger les prévisions d'un dossier existant
    private loadExistingPrevisionsForDossier(dossierId: number) {
        console.log('Loading previsions for dossier:', dossierId);
        this.state.update((s) => ({ ...s, loading: true }));

        this.userService.getPrevisionsTresorerie$(dossierId).subscribe({
            next: (response) => {
                console.log('Previsions loaded:', response);

                if (response.data?.previsions && response.data.previsions.length > 0) {
                    const previsions = response.data.previsions;

                    // Remplir les formulaires avec les données
                    previsions.forEach((prevision: any) => {
                        const moisNum = prevision.numeroMois;
                        const moisForm = this.getMoisFormGroup(moisNum);

                        if (moisForm) {
                            // Remplir les totaux
                            moisForm.patchValue({
                                soldeDebut: prevision.soldeDebut || 0,
                                totalEncaissements: prevision.totalEncaissements || 0,
                                totalDecaissements: prevision.totalDecaissements || 0,
                                excedentDeficit: prevision.excedentDeficit || 0,
                                soldeFin: prevision.soldeFin || 0
                            });

                            // Remplir les lignes d'encaissement
                            if (prevision.lignesEncaissement) {
                                prevision.lignesEncaissement.forEach((ligne: any) => {
                                    switch (ligne.categorie) {
                                        case 'VENTES':
                                            moisForm.patchValue({ ventes: ligne.montant });
                                            break;
                                        case 'AUTRES_REVENUS':
                                            moisForm.patchValue({ autresRevenus: ligne.montant });
                                            break;
                                        case 'PRET':
                                            moisForm.patchValue({ pret: ligne.montant });
                                            break;
                                    }
                                });
                            }

                            // Remplir les lignes de décaissement
                            if (prevision.lignesDecaissement) {
                                prevision.lignesDecaissement.forEach((ligne: any) => {
                                    switch (ligne.categorie) {
                                        case 'ACHAT_MARCHANDISES':
                                            moisForm.patchValue({ achatmarchandises: ligne.montant });
                                            break;
                                        case 'MAIN_OEUVRE':
                                            moisForm.patchValue({ mainoeuvre: ligne.montant });
                                            break;
                                        case 'INVESTISSEMENT':
                                            moisForm.patchValue({ investissement: ligne.montant });
                                            break;
                                        case 'IMPOTS_TAXES':
                                            moisForm.patchValue({ impotstaxes: ligne.montant });
                                            break;
                                        case 'LOYER':
                                            moisForm.patchValue({ loyer: ligne.montant });
                                            break;
                                        case 'UTILITIES':
                                            moisForm.patchValue({ utilities: ligne.montant });
                                            break;
                                        case 'TRANSPORT':
                                            moisForm.patchValue({ transport: ligne.montant });
                                            break;
                                        case 'SALAIRES':
                                            moisForm.patchValue({ salaires: ligne.montant });
                                            break;
                                        case 'FRAIS_TELEPHONE':
                                            moisForm.patchValue({ fraistelephone: ligne.montant });
                                            break;
                                        case 'CHARGES_FINANCIERES':
                                            moisForm.patchValue({ chargesfinancieres: ligne.montant });
                                            break;
                                        case 'ENTRETIEN':
                                            moisForm.patchValue({ entretien: ligne.montant });
                                            break;
                                        case 'AUTRES_DEPENSES':
                                            moisForm.patchValue({ autresdepenses: ligne.montant });
                                            break;
                                        case 'INTERETS':
                                            moisForm.patchValue({ interetsAVerser: ligne.montant });
                                            break;
                                        case 'CAPITAL':
                                            moisForm.patchValue({ remboursementCapital: ligne.montant });
                                            break;
                                    }
                                });
                            }

                            // Marquer ce mois comme sauvegardé et renseigné
                            this.moisSauvegardes.update((set) => {
                                set.add(moisNum);
                                return new Set(set);
                            });

                            this.moisRenseignes.update((set) => {
                                set.add(moisNum);
                                return new Set(set);
                            });
                        }
                    });

                    // Recalculer tous les mois pour s'assurer de la cohérence
                    this.calculateAllMonths();

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Prévisions chargées',
                        detail: `${previsions.length} mois de prévisions chargés avec succès`
                    });
                } else {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Aucune prévision',
                        detail: 'Aucune prévision trouvée pour ce dossier. Vous pouvez commencer la saisie.'
                    });
                }

                this.state.update((s) => ({ ...s, loading: false }));
            },
            error: (error) => {
                console.error('Erreur chargement prévisions:', error);
                this.state.update((s) => ({ ...s, loading: false }));

                // Ne pas afficher d'erreur si c'est juste qu'il n'y a pas de prévisions
                if (error.status !== 404) {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Attention',
                        detail: 'Impossible de charger les prévisions existantes'
                    });
                }
            }
        });
    }

    // Pré-remplir les paramètres du crédit avec les données de la demande
    preFillCreditParams(demande: any) {
        // Mettre à jour le formulaire
        this.creditParamsForm.patchValue({
            montantCredit: demande.montantDemande || 0,
            duree: demande.dureeDemande || 12,
            tauxInteret: demande.tauxInteret || 3
        });

        // Mettre à jour les paramètres
        this.creditParams.update((params) => ({
            ...params,
            montantCredit: demande.montantDemande || 0,
            duree: demande.dureeDemande || 12,
            tauxInteret: demande.tauxInteret || 3,
            clientNom: `${demande.prenom} ${demande.nom}`
        }));

        // Appliquer les calculs
        setTimeout(() => {
            this.applyCalculations();
        }, 100);
    }

    // Initialiser le formulaire des paramètres du crédit
    initializeCreditParamsForm() {
        this.creditParamsForm = this.fb.group({
            clientId: [null, Validators.required],
            montantCredit: [null, [Validators.required, Validators.min(100000)]],
            duree: [12, [Validators.required, Validators.min(1), Validators.max(60)]],
            tauxInteret: [3, [Validators.required, Validators.min(0), Validators.max(100)]]
        });

        // Écouter les changements du formulaire
        this.creditParamsForm.valueChanges.subscribe((values) => {
            if (this.creditParamsForm.valid) {
                const client = this.clients().find((c) => c.id === values.clientId);
                this.creditParams.update((params) => ({
                    ...params,
                    ...values,
                    clientNom: client ? `${client.prenom} ${client.nom}` : ''
                }));
            }
        });
    }

    // Initialiser le formulaire nouveau client
    initializeNewClientForm() {
        this.newClientForm = this.fb.group({
            nom: ['', Validators.required],
            prenom: ['', Validators.required],
            telephone: [
                '',
                [
                    Validators.required,
                    Validators.pattern(/^[0-9]{9}$/) // 9 chiffres exactement
                ]
            ],
            email: ['', Validators.email],
            adresse: [''],
            typeActivite: [''],
            numeroIdentite: ['']
        });
    }

    trackByIndex(index: number): number {
        return index;
    }

    // Charger les paramètres initiaux depuis la route
    loadInitialParams() {
        const queryParams = this.route.snapshot.queryParams;

        if (queryParams['clientId']) {
            this.creditParamsForm.patchValue({
                clientId: +queryParams['clientId'],
                montantCredit: queryParams['montant'] ? +queryParams['montant'] : null,
                duree: queryParams['duree'] ? +queryParams['duree'] : 12,
                tauxInteret: queryParams['taux'] ? +queryParams['taux'] : 3
            });
        }
    }

    // Méthode loadClientDossiers avec debug
    loadClientDossiers(clientId: number) {
        console.log('Loading dossiers for client:', clientId);
        this.state.update((s) => ({ ...s, loading: true }));

        this.userService.getDossiersByClient$(clientId).subscribe({
            next: (response) => {
                console.log('Response getDossiersByClient:', response);

                if (response?.data?.dossiers && response.data.dossiers.length > 0) {
                    const dossiers = response.data.dossiers;
                    this.dossiers.set(dossiers);

                    // Prendre le dossier le plus récent
                    const latestDossier = dossiers[0];
                    console.log('Latest dossier:', latestDossier);

                    this.selectedDossier.set(latestDossier);
                    this.hasExistingAnalysis.set(true);

                    // Afficher le dialog de choix
                    this.showAnalysisChoiceDialog(latestDossier);
                } else {
                    console.log('Pas de dossier trouvé');
                    this.hasExistingAnalysis.set(false);
                    this.dossiers.set([]);
                    this.selectedDossier.set(null);

                    this.messageService.add({
                        severity: 'info',
                        summary: 'Nouveau client',
                        detail: 'Aucune analyse existante pour ce client'
                    });
                }
                this.state.update((s) => ({ ...s, loading: false }));
            },
            error: (error) => {
                console.error('Erreur chargement dossiers:', error);
                this.state.update((s) => ({ ...s, loading: false }));
                this.hasExistingAnalysis.set(false);
                this.dossiers.set([]);

                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible de charger les dossiers'
                });
            }
        });
    }

    // Méthode showAnalysisChoiceDialog corrigée
    showAnalysisChoiceDialog(dossier: any) {
        console.log('Showing dialog for dossier:', dossier);

        // Formater les dates correctement
        const dateFormatted = this.formatDateFromArray(dossier.dateDemande);

        this.confirmationService.confirm({
            message: `Ce client a déjà un dossier (N°${dossier.id}) du ${dateFormatted}. 
                      Montant: ${this.formatMontant(dossier.montantDemande)} | 
                      Durée: ${dossier.dureeMois} mois | 
                      Taux: ${dossier.tauxInteret}% |
                      Statut: ${dossier.statut}`,
            header: 'Analyse existante trouvée',
            icon: 'pi pi-info-circle',
            acceptLabel: "Charger l'analyse",
            rejectLabel: 'Nouvelle analyse',
            accept: () => {
                console.log("Chargement de l'analyse existante");
                this.loadExistingAnalysis(dossier);
            },
            reject: () => {
                console.log("Création d'une nouvelle analyse");
                this.startNewAnalysis();
            }
        });
    }

    // Méthode pour formater les dates depuis les arrays Java
    formatDateFromArray(dateArray: any): string {
        if (!dateArray) return '';
        if (typeof dateArray === 'string') {
            return new Date(dateArray).toLocaleDateString('fr-FR');
        }
        if (Array.isArray(dateArray) && dateArray.length >= 3) {
            const [year, month, day] = dateArray;
            return new Date(year, month - 1, day).toLocaleDateString('fr-FR');
        }
        return '';
    }

    calculateAge(dateArray: any): number {
        if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) return 0;
        const [year, month, day] = dateArray;
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    getTotalGaranties(): number {
        return this.garanties().reduce((sum, g) => sum + (g.valeurGarantie || 0), 0);
    }

    getCouvertureGaranties(): number {
        const total = this.getTotalGaranties();
        const montant = this.creditParams().montantCredit;
        if (!montant || montant === 0) return 0;
        return (total / montant) * 100;
    }

    // Méthodes utilitaires
    formatDate(date: string): string {
        if (!date) return '';
        return new Date(date).toLocaleDateString('fr-FR');
    }

    formatMontant(montant: number): string {
        if (!montant) return '0 GNF';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'GNF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(montant);
    }
    // Démarrer une nouvelle analyse
    startNewAnalysis() {
        console.log('Starting new analysis');

        // Réinitialiser le dossier ID mais garder le client
        const currentClientId = this.creditParams().clientId;
        const currentClientNom = this.creditParams().clientNom;

        this.creditParams.update((params) => ({
            ...params,
            dossierId: 0,
            montantCredit: 0,
            duree: 12,
            tauxInteret: 0
        }));

        // Réinitialiser le formulaire mais garder le client
        this.creditParamsForm.patchValue({
            montantCredit: 0,
            duree: 12,
            tauxInteret: 0
        });

        // Réinitialiser le formulaire de trésorerie
        this.resetTresorerieForm();

        this.messageService.add({
            severity: 'info',
            summary: 'Nouvelle analyse',
            detail: 'Vous pouvez créer une nouvelle analyse pour ce client'
        });
    }

    // Réinitialiser le formulaire de trésorerie
    resetTresorerieForm() {
        for (let mois = 1; mois <= 12; mois++) {
            const moisForm = this.getMoisFormGroup(mois);
            if (moisForm) {
                moisForm.reset({
                    soldeDebut: mois === 1 ? 0 : null,
                    ventes: 0,
                    autresRevenus: 0,
                    pret: 0,
                    achatmarchandises: 0,
                    mainoeuvre: 0,
                    investissement: 0,
                    impotstaxes: 0,
                    loyer: 0,
                    utilities: 0,
                    transport: 0,
                    salaires: 0,
                    fraistelephone: 0,
                    chargesfinancieres: 0,
                    entretien: 0,
                    autresdepenses: 0,
                    interetsAVerser: 0,
                    remboursementCapital: 0,
                    totalEncaissements: 0,
                    totalDecaissements: 0,
                    disponibleEnCaisse: 0,
                    excedentDeficit: 0,
                    soldeFin: 0
                });
            }
        }
    }

    // Réinitialiser complètement le formulaire
    resetAll() {
        this.confirmationService.confirm({
            message: 'Êtes-vous sûr de vouloir réinitialiser toutes les données ?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // Réinitialiser les paramètres
                this.creditParams.set({
                    clientId: 0,
                    clientNom: '',
                    montantCredit: 0,
                    duree: 12,
                    tauxInteret: 0,
                    dossierId: 0
                });

                // Réinitialiser les formulaires
                this.creditParamsForm.reset({
                    clientId: 0,
                    montantCredit: 0,
                    duree: 12,
                    tauxInteret: 0
                });

                this.resetTresorerieForm();

                this.hasExistingAnalysis.set(false);
                this.selectedDossier.set(null);

                this.messageService.add({
                    severity: 'success',
                    summary: 'Réinitialisation',
                    detail: 'Toutes les données ont été réinitialisées'
                });
            }
        });
    }

    // Charger une analyse existante
    loadExistingAnalysis(dossier: any) {
        console.log('Loading existing analysis:', dossier);

        // Mettre à jour les paramètres du crédit
        this.creditParams.update((params) => ({
            ...params,
            dossierId: dossier.id,
            montantCredit: dossier.montantDemande,
            duree: dossier.dureeMois,
            tauxInteret: dossier.tauxInteret,
            clientNom: dossier.clientNomComplet
        }));

        // Mettre à jour le formulaire
        this.creditParamsForm.patchValue({
            clientId: dossier.clientId,
            montantCredit: dossier.montantDemande,
            duree: dossier.dureeMois,
            tauxInteret: dossier.tauxInteret
        });

        // Appliquer les calculs
        this.applyCalculations();

        // Charger les prévisions si elles existent
        this.loadPrevisions(dossier.id);

        this.messageService.add({
            severity: 'success',
            summary: 'Analyse chargée',
            detail: `Dossier N°${dossier.id} chargé avec succès`
        });
    }

    // Charger les prévisions d'un dossier
    loadPrevisions(dossierId: number) {
        this.state.update((s) => ({ ...s, loading: true }));

        this.userService.getPrevisionsTresorerie$(dossierId).subscribe({
            next: (response) => {
                if (response.data?.previsions) {
                    // Remplir le formulaire
                    this.populatePrevisionsForm(response.data.previsions);

                    // Marquer les mois comme sauvegardés
                    response.data.previsions.forEach((prevision: any) => {
                        this.moisSauvegardes.update((set) => {
                            set.add(prevision.numeroMois);
                            return new Set(set);
                        });

                        // Marquer aussi comme renseigné
                        this.moisRenseignes.update((set) => {
                            set.add(prevision.numeroMois);
                            return new Set(set);
                        });
                    });

                    // Charger les lignes d'encaissement et décaissement
                    response.data.previsions.forEach((prevision: any) => {
                        this.loadLignesPrevision(prevision);
                    });
                }
                this.state.update((s) => ({ ...s, loading: false }));
            },
            error: (error) => {
                console.error('Erreur chargement prévisions:', error);
                this.state.update((s) => ({ ...s, loading: false }));
            }
        });
    }

    // Remplir le formulaire avec les prévisions
    populatePrevisionsForm(previsions: any[]) {
        previsions.forEach((prevision) => {
            const moisForm = this.getMoisFormGroup(prevision.numeroMois);
            if (moisForm) {
                moisForm.patchValue({
                    soldeDebut: prevision.soldeDebut,
                    totalEncaissements: prevision.totalEncaissements,
                    totalDecaissements: prevision.totalDecaissements,
                    excedentDeficit: prevision.excedentDeficit,
                    soldeFin: prevision.soldeFin
                });
            }
        });
    }

    // Charger les lignes d'une prévision
    loadLignesPrevision(prevision: any) {
        const moisNum = prevision.numeroMois;

        // Charger les encaissements
        if (prevision.id) {
            this.userService.getLignesEncaissement$(prevision.id).subscribe({
                next: (response) => {
                    if (response.data?.encaissements) {
                        this.populateLignesEncaissement(moisNum, response.data.encaissements);
                    }
                },
                error: (error) => console.error('Erreur chargement encaissements:', error)
            });

            // Charger les décaissements
            this.userService.getLignesDecaissement$(prevision.id).subscribe({
                next: (response) => {
                    if (response.data?.decaissements) {
                        this.populateLignesDecaissement(moisNum, response.data.decaissements);
                    }
                },
                error: (error) => console.error('Erreur chargement décaissements:', error)
            });
        }
    }

    // Remplir les lignes de décaissement
    populateLignesDecaissement(moisNum: number, lignes: any[]) {
        const moisForm = this.getMoisFormGroup(moisNum);
        if (!moisForm) return;

        lignes.forEach((ligne) => {
            switch (ligne.categorie) {
                case 'ACHAT_MARCHANDISES':
                    moisForm.patchValue({ achatmarchandises: ligne.montant });
                    break;
                case 'MAIN_OEUVRE':
                    moisForm.patchValue({ mainoeuvre: ligne.montant });
                    break;
                case 'INVESTISSEMENT':
                    moisForm.patchValue({ investissement: ligne.montant });
                    break;
                case 'IMPOTS_TAXES':
                    moisForm.patchValue({ impotstaxes: ligne.montant });
                    break;
                case 'LOYER':
                    moisForm.patchValue({ loyer: ligne.montant });
                    break;
                case 'UTILITIES':
                    moisForm.patchValue({ utilities: ligne.montant });
                    break;
                case 'TRANSPORT':
                    moisForm.patchValue({ transport: ligne.montant });
                    break;
                case 'SALAIRES':
                    moisForm.patchValue({ salaires: ligne.montant });
                    break;
                case 'FRAIS_TELEPHONE':
                    moisForm.patchValue({ fraistelephone: ligne.montant });
                    break;
                case 'CHARGES_FINANCIERES':
                    moisForm.patchValue({ chargesfinancieres: ligne.montant });
                    break;
                case 'ENTRETIEN':
                    moisForm.patchValue({ entretien: ligne.montant });
                    break;
                case 'AUTRES_DEPENSES':
                    moisForm.patchValue({ autresdepenses: ligne.montant });
                    break;
            }
        });
    }

    // Remplir les lignes d'encaissement
    populateLignesEncaissement(moisNum: number, lignes: any[]) {
        const moisForm = this.getMoisFormGroup(moisNum);
        if (!moisForm) return;

        lignes.forEach((ligne) => {
            switch (ligne.categorie) {
                case 'VENTES':
                    moisForm.patchValue({ ventes: ligne.montant });
                    break;
                case 'AUTRES_REVENUS':
                    moisForm.patchValue({ autresRevenus: ligne.montant });
                    break;
                case 'PRET':
                    moisForm.patchValue({ pret: ligne.montant });
                    break;
            }
        });
    }

    // Méthode pour appliquer les calculs après mise à jour des paramètres
    private applyCalculations() {
        // Juste recalculer tous les mois SANS toucher aux remboursements
        this.calculateAllMonths();

        this.messageService.add({
            severity: 'success',
            summary: 'Paramètres appliqués',
            detail: 'Les paramètres du crédit ont été mis à jour'
        });
    }

    // Mettre à jour les remboursements dans le formulaire
    private updateRemboursementsInForm(capital: number, interet: number) {
        for (let mois = 1; mois <= 12; mois++) {
            const moisForm = this.getMoisFormGroup(mois);
            if (moisForm) {
                moisForm.patchValue(
                    {
                        interetsAVerser: interet,
                        remboursementCapital: capital
                    },
                    { emitEvent: false }
                ); // Éviter les boucles infinies
            }
        }
    }
    // Sauvegarder nouveau client
    saveNewClient() {
        if (this.newClientForm.invalid) return;

        this.savingClient = true;
        const clientData = this.newClientForm.value;

        this.userService.createClient$(clientData).subscribe({
            next: (response) => {
                if (response.data?.client) {
                    const newClient = {
                        ...response.data.client,
                        nomComplet: `${response.data.client.prenom} ${response.data.client.nom}`
                    };

                    // Ajouter à la liste
                    this.clients.update((clients) => [...clients, newClient]);

                    // Sélectionner automatiquement
                    this.creditParamsForm.patchValue({
                        clientId: newClient.id
                    });

                    this.showNewClientDialog = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Client créé avec succès'
                    });
                }
                this.savingClient = false;
            },
            error: (error) => {
                this.savingClient = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible de créer le client'
                });
            }
        });
    }

    // Réinitialiser les paramètres
    resetCreditParams() {
        this.creditParamsForm.reset({
            clientId: null,
            montantCredit: null,
            duree: 12,
            tauxInteret: 3
        });

        this.creditParams.set({
            montantCredit: 0,
            tauxInteret: 0,
            duree: 12,
            clientId: 0,
            clientNom: '',
            dossierId: 0
        });

        // Réinitialiser aussi le formulaire de trésorerie
        this.initializeForm();
    }

    // Appliquer les paramètres
    applyCreditParams() {
        if (this.creditParamsForm.invalid) {
            Object.keys(this.creditParamsForm.controls).forEach((key) => {
                const control = this.creditParamsForm.get(key);
                control?.markAsTouched();
            });
            this.messageService.add({
                severity: 'warn',
                summary: 'Formulaire invalide',
                detail: 'Veuillez remplir tous les champs obligatoires'
            });
            return;
        }

        // Si pas de dossier existant, en créer un
        if (!this.creditParams().dossierId || this.creditParams().dossierId === 0) {
            this.createDossierCredit();
        } else {
            // Sinon, juste mettre à jour les calculs
            this.applyCalculations();
        }
    }

    // Créer uniquement le dossier
    public createDossierCredit() {
        const params = this.creditParams();
        const demande = this.demandeIndividuel();

        const dossierData = {
            demandeindividuelId: this.demandeIndividuelId,
            clientId: params.clientId || null,
            montantDemande: params.montantCredit,
            dureeMois: params.duree,
            tauxInteret: params.tauxInteret,
            statut: 'EN_COURS'
        };

        this.state.update((s) => ({ ...s, saving: true }));

        this.userService.createDossierCredit$(dossierData).subscribe({
            next: (response) => {
                if (response.data?.dossier) {
                    this.creditParams.update((params) => ({
                        ...params,
                        dossierId: response.data.dossier!.id!
                    }));

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Dossier créé',
                        detail: `Dossier N°${response.data.dossier.id} créé avec succès`
                    });

                    this.applyCalculations();
                }
                this.state.update((s) => ({ ...s, saving: false }));
            },
            error: (error) => {
                this.state.update((s) => ({ ...s, saving: false }));
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible de créer le dossier de crédit'
                });
            }
        });
    }

    // Charger les paramètres depuis la route ou l'API
    loadCreditParams() {
        // Récupérer les paramètres depuis la route
        const queryParams = this.route.snapshot.queryParams;
        const routeParams = this.route.snapshot.params;

        // Option 1: Depuis les query params
        const clientId = queryParams['clientId'] || routeParams['clientId'];
        const dossierId = queryParams['dossierId'] || routeParams['dossierId'];
        const montant = queryParams['montant'] || routeParams['montant'];
        const duree = queryParams['duree'] || routeParams['duree'];
        const taux = queryParams['taux'] || routeParams['taux'];
        const clientNom = queryParams['clientNom'] || routeParams['clientNom'];

        // Si on a un dossier ID, charger depuis l'API
        if (dossierId) {
            this.loadDossierFromAPI(+dossierId);
        }
        // Sinon, utiliser les paramètres de la route
        else if (clientId) {
            this.creditParams.set({
                clientId: +clientId,
                dossierId: dossierId ? +dossierId : 0,
                montantCredit: montant ? +montant : 0,
                duree: duree ? +duree : 12,
                tauxInteret: taux ? +taux : 0,
                clientNom: clientNom || ''
            });

            // Si on a un client ID mais pas de nom, charger les infos client
            if (!clientNom && clientId) {
                this.loadClientInfo(+clientId);
            }
        }
        // Si aucun paramètre, rediriger vers la page de sélection
        else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Paramètres manquants',
                detail: 'Veuillez sélectionner un client et définir les paramètres du crédit'
            });
            this.router.navigate(['/credit/nouveau']);
        }
    }

    // Charger les informations du dossier depuis l'API
    loadDossierFromAPI(dossierId: number) {
        this.state.update((s) => ({ ...s, loading: true }));

        this.userService.getDossierCredit$(dossierId).subscribe({
            next: (response) => {
                if (response.data?.dossier) {
                    const dossier = response.data.dossier;
                    this.creditParams.set({
                        clientId: dossier.clientId,
                        clientNom: dossier.clientNomComplet || '',
                        dossierId: dossier.id!,
                        montantCredit: dossier.montantDemande,
                        duree: dossier.dureeMois,
                        tauxInteret: dossier.tauxInteret
                    });

                    // Charger aussi les prévisions existantes si elles existent
                    this.loadExistingPrevisions(dossierId);
                }
                this.state.update((s) => ({ ...s, loading: false }));
            },
            error: (error) => {
                this.state.update((s) => ({ ...s, loading: false }));
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible de charger les informations du dossier'
                });
                console.error('Erreur chargement dossier:', error);
            }
        });
    }

    loadExistingPrevisions(dossierId: number) {
        this.userService.getPrevisionsTresorerie$(dossierId).subscribe({
            next: (response) => {
                if (response.data?.previsions || response.data?.previsionsTresorerie) {
                    const previsions = response.data.previsions || response.data.previsionsTresorerie;
                    this.populateForm(previsions);
                }
            },
            error: (error) => {
                console.error('Erreur chargement prévisions:', error);
            }
        });
    }

    // Charger les informations du client
    loadClientInfo(clientId: number) {
        this.userService.getClient$(clientId).subscribe({
            next: (response) => {
                if (response.data?.client) {
                    this.creditParams.update((params) => ({
                        ...params,
                        clientNom: `${response.data.client?.prenom} ${response.data.client?.nom}`
                    }));
                }
            },
            error: (error) => {
                console.error('Erreur chargement client:', error);
            }
        });
    }

    // Améliorer initializeForm pour initialiser correctement chaque mois
    initializeForm() {
        const moisGroups: { [key: string]: FormGroup } = {};

        // Créer les formulaires pour les mois 0 à 12
        for (let mois = 0; mois <= 12; mois++) {
            moisGroups[`mois${mois}`] = this.fb.group({
                numeroMois: [mois],
                soldeDebut: [{ value: null, disabled: mois > 0 }],

                // Encaissements
                ventes: [{ value: null, disabled: mois === 0 }],
                autresRevenus: [{ value: null, disabled: mois === 0 }],
                pret: [null],

                // Décaissements
                achatmarchandises: [null],
                mainoeuvre: [null],
                investissement: [null],
                impotstaxes: [null],
                loyer: [null],
                utilities: [null],
                transport: [null],
                salaires: [null],
                fraistelephone: [null],
                chargesfinancieres: [null],
                entretien: [null],
                autresdepenses: [null],

                // Remboursements
                interetsAVerser: [null],
                remboursementCapital: [null],

                // Calculs (toujours disabled)
                totalEncaissements: [{ value: 0, disabled: true }],
                totalDecaissements: [{ value: 0, disabled: true }],
                disponibleEnCaisse: [{ value: 0, disabled: true }],
                excedentDeficit: [{ value: 0, disabled: true }],
                soldeFin: [{ value: 0, disabled: true }]
            });
        }

        this.tresorerieForm = this.fb.group(moisGroups);

        // Initialiser le mois 0 avec un solde début de 0
        const mois0Form = this.getMoisFormGroup(0);
        if (mois0Form) {
            mois0Form.patchValue({ soldeDebut: 0 }, { emitEvent: false });
        }

        this.setupFormChangeListeners();
    }
    // Améliorer checkIfMoisHasData pour considérer null comme vide
    checkIfMoisHasData(values: any): boolean {
        if (!values) return false;

        const fieldsToCheck = [
            'ventes',
            'autresRevenus',
            'pret',
            'achatmarchandises',
            'mainoeuvre',
            'investissement',
            'impotstaxes',
            'loyer',
            'utilities',
            'transport',
            'salaires',
            'fraistelephone',
            'chargesfinancieres',
            'entretien',
            'autresdepenses',
            'interetsAVerser',
            'remboursementCapital'
        ];

        return fieldsToCheck.some((field) => {
            const value = values[field];
            return value !== null && value !== undefined && value !== '' && value !== 0;
        });
    }

    // Obtenir le FormGroup d'un mois
    getMoisFormGroup(mois: number): FormGroup {
        return this.tresorerieForm?.get(`mois${mois}`) as FormGroup;
    }

    // Mise à jour de la méthode calculateMonth pour gérer les valeurs null
    calculateMonth(mois: number) {
        const moisForm = this.getMoisFormGroup(mois);
        if (!moisForm) return;

        const values = moisForm.getRawValue();
        const safeValue = (val: any) => {
            if (val === null || val === undefined || val === '') return 0;
            const num = Number(val);
            return isNaN(num) ? 0 : num;
        };

        // Total Encaissements
        const totalEnc = safeValue(values.ventes) + safeValue(values.autresRevenus) + safeValue(values.pret);

        // Total Décaissements (sans les remboursements)
        const totalDec =
            safeValue(values.achatmarchandises) +
            safeValue(values.mainoeuvre) +
            safeValue(values.investissement) +
            safeValue(values.impotstaxes) +
            safeValue(values.loyer) +
            safeValue(values.utilities) +
            safeValue(values.transport) +
            safeValue(values.salaires) +
            safeValue(values.fraistelephone) +
            safeValue(values.chargesfinancieres) +
            safeValue(values.entretien) +
            safeValue(values.autresdepenses);

        // Disponible en caisse
        const disponible = safeValue(values.soldeDebut) + totalEnc;

        // Excédent/Déficit (avant remboursements)
        const excedent = disponible - totalDec;

        // Solde fin (après remboursements)
        const soldeFin = excedent - safeValue(values.interetsAVerser) - safeValue(values.remboursementCapital);

        // Mettre à jour les valeurs calculées
        moisForm.patchValue(
            {
                totalEncaissements: totalEnc,
                totalDecaissements: totalDec,
                disponibleEnCaisse: disponible,
                excedentDeficit: excedent,
                soldeFin: soldeFin
            },
            { emitEvent: false, onlySelf: true }
        );

        // Mettre à jour le solde début du mois suivant
        if (mois < 12) {
            const nextMoisForm = this.getMoisFormGroup(mois + 1);
            if (nextMoisForm) {
                nextMoisForm.patchValue({ soldeDebut: soldeFin }, { emitEvent: false });
            }
        }

        this.cdr.markForCheck();
    }

    // Méthode pour réinitialiser un mois manuellement (bouton Réinitialiser)
    resetMonth(mois: number) {
        this.confirmationService.confirm({
            message: `Êtes-vous sûr de vouloir réinitialiser les données du ${this.getMoisLabel(mois)} ?`,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.resetMonthToDefaults(mois);
                this.tresorerieState.clearMonth(mois);

                // Recalculer les mois suivants
                for (let m = mois + 1; m <= 12; m++) {
                    this.calculateMonth(m);
                }

                this.messageService.add({
                    severity: 'success',
                    summary: 'Réinitialisation',
                    detail: `${this.getMoisLabel(mois)} réinitialisé avec succès`
                });

                this.cdr.detectChanges();
            }
        });
    }

    // Obtenir un résumé
    getFormSummary() {
        const monthsWithData = this.tresorerieState.getMonthsWithData();
        const savedMonths = this.tresorerieState.getSavedMonths();

        return {
            totalMois: 13,
            moisRenseignes: monthsWithData.length,
            moisSauvegardes: savedMonths.length,
            pourcentageComplete: Math.round((monthsWithData.length / 13) * 100),
            pourcentageSauvegarde: Math.round((savedMonths.length / 13) * 100),
            peutSauvegarder: this.canSave()
        };
    }
    // Calculer tous les mois
    calculateAllMonths() {
        for (let mois = 0; mois <= 12; mois++) {
            this.calculateMonth(mois);
        }
    }

    // Écouter les changements
    setupCalculations() {
        for (let mois = 0; mois <= 12; mois++) {
            const moisForm = this.getMoisFormGroup(mois);
            if (!moisForm) continue;

            const fieldsToWatch = [
                'ventes',
                'autresRevenus',
                'pret',
                'achatmarchandises',
                'mainoeuvre',
                'investissement',
                'impotstaxes',
                'loyer',
                'utilities',
                'transport',
                'salaires',
                'fraistelephone',
                'chargesfinancieres',
                'entretien',
                'autresdepenses',
                'interetsAVerser',
                'remboursementCapital'
            ];

            fieldsToWatch.forEach((field) => {
                const control = moisForm.get(field);
                if (control) {
                    control.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
                        if (mois === this.currentMonth()) {
                            this.calculateMonth(mois);
                        }
                    });
                }
            });
        }
    }

    // Nouvelle méthode pour mettre à jour le statut d'un mois
    private updateMoisStatus(mois: number, hasData: boolean) {
        if (hasData) {
            this.moisRenseignes.update((set) => {
                set.add(mois);
                return new Set(set);
            });
        } else {
            this.moisRenseignes.update((set) => {
                set.delete(mois);
                return new Set(set);
            });
            // Si pas de données, retirer aussi de sauvegardés
            this.moisSauvegardes.update((set) => {
                set.delete(mois);
                return new Set(set);
            });
        }
    }

    // Appliquer les remboursements suggérés
    applySuggestedRepayments() {
        const mensualite = this.mensualite();

        if (mensualite.total === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: "Veuillez d'abord définir les paramètres du crédit"
            });
            return;
        }

        this.confirmationService.confirm({
            message: `Voulez-vous appliquer les remboursements suggérés (Capital: ${mensualite.capital.toFixed(0)} GNF, Intérêts: ${mensualite.interet.toFixed(0)} GNF) aux mois 1 à 12 ?`,
            header: 'Appliquer les remboursements',
            icon: 'pi pi-question-circle',
            accept: () => {
                // Appliquer uniquement aux mois 1 à 12 (pas au mois 0)
                for (let mois = 1; mois <= 12; mois++) {
                    const moisForm = this.getMoisFormGroup(mois);
                    if (moisForm) {
                        moisForm.patchValue({
                            interetsAVerser: mensualite.interet,
                            remboursementCapital: mensualite.capital
                        });
                    }
                }
                this.calculateAllMonths();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Remboursements appliqués aux mois 1 à 12'
                });
            }
        });
    }

    // Charger les données du client
    loadClientData() {
        // Récupérer les paramètres de la route
        const clientId = this.route.snapshot.queryParams['clientId'];
        const dossierId = this.route.snapshot.queryParams['dossierId'];

        if (clientId) {
            this.creditParams.update((params) => ({
                ...params,
                clientId: +clientId,
                dossierId: dossierId ? +dossierId : 0
            }));

            // Charger les données existantes si disponibles
            this.loadExistingData(dossierId);
        }
    }

    // Charger les données existantes
    loadExistingData(dossierId: number) {
        if (!dossierId) return;

        this.state.update((s) => ({ ...s, loading: true }));

        this.userService.getPrevisionsTresorerie$(dossierId).subscribe({
            next: (response) => {
                if (response.data?.previsionsTresorerie) {
                    this.populateForm(response.data.previsionsTresorerie);
                }
                this.state.update((s) => ({ ...s, loading: false }));
            },
            error: (error) => {
                this.state.update((s) => ({
                    ...s,
                    loading: false,
                    error: error
                }));
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible de charger les données'
                });
            }
        });
    }

    // Remplir le formulaire avec les données existantes
    populateForm(data: any) {
        // Implémenter selon la structure de vos données
        console.log('Populating form with:', data);
    }

    // Sauvegarder les prévisions
    savePrevisions() {
        if (!this.creditParams().dossierId || this.creditParams().dossierId === 0) {
            this.createDossierAndSavePrevisions();
            return;
        }

        this.saveAllPrevisions();
    }

    // Sauvegarder toutes les prévisions
    private saveAllPrevisions() {
        const dossierId = this.creditParams().dossierId;
        if (!dossierId || dossierId === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'ID du dossier invalide'
            });
            return;
        }

        const allPrevisionsData = this.prepareAllPrevisionsData();
        this.state.update((s) => ({ ...s, saving: true }));

        this.userService.savePrevisionsTresorerie$(dossierId, allPrevisionsData).subscribe({
            next: (response) => {
                // Marquer tous les mois comme sauvegardés
                allPrevisionsData.forEach((prevision) => {
                    this.tresorerieState.markAsSaved(prevision.numeroMois);
                });

                this.state.update((s) => ({ ...s, saving: false }));
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Toutes les prévisions ont été sauvegardées'
                });
            },
            error: (error) => {
                console.error('Erreur sauvegarde globale:', error);
                this.state.update((s) => ({ ...s, saving: false }));
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.error?.message || 'Impossible de sauvegarder les prévisions'
                });
            }
        });
    }

    private validateDataBeforeSave(data: any[]): boolean {
        let isValid = true;

        data.forEach((prevision, index) => {
            console.log(`Validation Mois ${prevision.numeroMois}:`);

            // Vérifier les remboursements
            const interets = prevision.lignesDecaissement.find((l: any) => l.categorie === 'INTERETS');
            const capital = prevision.lignesDecaissement.find((l: any) => l.categorie === 'CAPITAL');

            if (interets) {
                console.log(`  - Intérêts: ${interets.montant} GNF`);
            } else {
                console.log(`  - Intérêts: non définis`);
            }

            if (capital) {
                console.log(`  - Capital: ${capital.montant} GNF`);
            } else {
                console.log(`  - Capital: non défini`);
            }

            // Vérifier la cohérence des totaux
            const totalEnc = prevision.lignesEncaissement.reduce((sum: number, l: any) => sum + l.montant, 0);
            const totalDec = prevision.lignesDecaissement.reduce((sum: number, l: any) => sum + l.montant, 0);

            console.log(`  - Total encaissements calculé: ${totalEnc}`);
            console.log(`  - Total décaissements calculé: ${totalDec}`);
        });

        return isValid;
    }

    // Préparer toutes les données
    private prepareAllPrevisionsData(): any[] {
        const previsions = [];

        for (let mois = 0; mois <= 12; mois++) {
            if (this.tresorerieState.monthHasData(mois)) {
                const monthData = this.prepareMonthData(mois);
                previsions.push(monthData);
            }
        }

        return previsions;
    }

    // Sauvegarder uniquement les prévisions
    private savePrevisionsOnly() {
        const dossierId = this.creditParams().dossierId;

        // Double vérification
        if (!dossierId || dossierId === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'ID du dossier invalide'
            });
            return;
        }

        const previsionData = this.preparePrevisionData();

        this.state.update((s) => ({ ...s, saving: true }));

        this.userService.savePrevisionsTresorerie$(dossierId, previsionData).subscribe({
            next: (response) => {
                this.state.update((s) => ({ ...s, saving: false }));
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Prévisions de trésorerie sauvegardées'
                });

                // Optionnel : naviguer vers la page d'analyse
                // this.router.navigate(['/credit/analyse', dossierId]);
            },
            error: (error) => {
                this.state.update((s) => ({ ...s, saving: false }));
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.error?.message || 'Impossible de sauvegarder les prévisions'
                });
                console.error('Erreur sauvegarde prévisions:', error);
            }
        });
    }

    // Créer le dossier puis sauvegarder
    private createDossierAndSavePrevisions() {
        const params = this.creditParams();

        // Vérifier qu'on a les paramètres minimums
        if (!params.clientId || !params.montantCredit || !params.duree) {
            this.messageService.add({
                severity: 'error',
                summary: 'Paramètres manquants',
                detail: 'Veuillez remplir tous les paramètres du crédit'
            });
            return;
        }

        const dossierData = {
            clientId: params.clientId,
            montantDemande: params.montantCredit,
            dureeMois: params.duree,
            tauxInteret: params.tauxInteret || 0,
            statut: 'EN_COURS'
        };

        this.state.update((s) => ({ ...s, saving: true }));

        // 1. Créer le dossier
        this.userService.createDossierCredit$(dossierData).subscribe({
            next: (response) => {
                if (response.data?.dossier) {
                    const dossierId = response.data.dossier.id;

                    // Mettre à jour le dossierId
                    this.creditParams.update((p) => ({ ...p, dossierId: dossierId! }));

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Dossier créé',
                        detail: `Dossier N°${dossierId} créé avec succès`
                    });

                    // 2. Maintenant sauvegarder les prévisions
                    this.savePrevisionsOnly();
                } else {
                    throw new Error('Réponse invalide lors de la création du dossier');
                }
            },
            error: (error) => {
                this.state.update((s) => ({ ...s, saving: false }));
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible de créer le dossier de crédit'
                });
                console.error('Erreur création dossier:', error);
            }
        });
    }

    // Préparer les données de prévision
    private preparePrevisionData(): any[] {
        const formData = this.tresorerieForm.getRawValue();
        const previsions = [];

        for (let mois = 1; mois <= 12; mois++) {
            const moisData = formData[`mois${mois}`];

            const prevision = {
                numeroMois: mois,
                soldeDebut: moisData.soldeDebut || 0,
                lignesEncaissement: [
                    { categorie: 'VENTES', libelle: 'Ventes', montant: moisData.ventes || 0 },
                    { categorie: 'AUTRES_REVENUS', libelle: 'Autres revenus', montant: moisData.autresRevenus || 0 },
                    { categorie: 'PRET', libelle: 'Prêt', montant: moisData.pret || 0 }
                ].filter((l) => l.montant > 0),
                lignesDecaissement: [
                    { categorie: 'ACHAT_MARCHANDISES', libelle: 'Achat marchandises', montant: moisData.achatmarchandises || 0 },
                    { categorie: 'MAIN_OEUVRE', libelle: "Main d'œuvre", montant: moisData.mainoeuvre || 0 },
                    { categorie: 'INVESTISSEMENT', libelle: 'Investissement', montant: moisData.investissement || 0 },
                    { categorie: 'IMPOTS_TAXES', libelle: 'Impôts et taxes', montant: moisData.impotstaxes || 0 },
                    { categorie: 'LOYER', libelle: 'Loyer', montant: moisData.loyer || 0 },
                    { categorie: 'UTILITIES', libelle: 'Utilities', montant: moisData.utilities || 0 },
                    { categorie: 'TRANSPORT', libelle: 'Transport', montant: moisData.transport || 0 },
                    { categorie: 'SALAIRES', libelle: 'Salaires', montant: moisData.salaires || 0 },
                    { categorie: 'FRAIS_TELEPHONE', libelle: 'Frais téléphone', montant: moisData.fraistelephone || 0 },
                    { categorie: 'CHARGES_FINANCIERES', libelle: 'Charges financières', montant: moisData.chargesfinancieres || 0 },
                    { categorie: 'ENTRETIEN', libelle: 'Entretien', montant: moisData.entretien || 0 },
                    { categorie: 'AUTRES_DEPENSES', libelle: 'Autres dépenses', montant: moisData.autresdepenses || 0 }
                ].filter((l) => l.montant > 0),
                totalEncaissements: moisData.totalEncaissements || 0,
                totalDecaissements: moisData.totalDecaissements || 0,
                excedentDeficit: moisData.excedentDeficit || 0,
                soldeFin: moisData.soldeFin || 0
            };

            previsions.push(prevision);
        }

        return previsions;
    }

    // Nouvelle méthode pour gérer la transition
    private performMonthTransition(targetMonth: number) {
        // 1. Mettre à jour l'état immédiatement
        this.state.update((s) => ({ ...s, currentMonth: targetMonth }));

        // 2. Forcer Angular à détecter les changements
        this.ngZone.run(() => {
            // 3. Rafraîchir le formulaire du nouveau mois
            this.refreshMonthData(targetMonth);

            // 4. Mettre à jour l'état des champs
            this.updateFieldsStateForMonth(targetMonth);

            // 5. Recalculer les totaux
            setTimeout(() => {
                this.calculateMonth(targetMonth);
                this.cdr.detectChanges();
            }, 0);
        });
    }

    // Méthode améliorée pour rafraîchir les données d'un mois
    private refreshMonthData(mois: number) {
        const moisForm = this.getMoisFormGroup(mois);
        if (!moisForm) return;

        // Si le mois a des données sauvegardées, les recharger
        if (this.moisSauvegardes().has(mois)) {
            // Les données sont déjà dans le formulaire, juste forcer la mise à jour
            const currentValues = moisForm.getRawValue();
            moisForm.patchValue(currentValues, { emitEvent: false });
        }
        // Si le mois a été renseigné mais pas sauvegardé
        else if (this.moisRenseignes().has(mois)) {
            // Garder les données actuelles
            const currentValues = moisForm.getRawValue();
            moisForm.patchValue(currentValues, { emitEvent: false });
        }
        // Si c'est un nouveau mois vide
        else {
            this.initializeEmptyMonth(mois);
        }

        // Forcer la mise à jour de validité
        moisForm.updateValueAndValidity({ emitEvent: false });
    }

    // NOUVELLE méthode pour gérer l'état des champs selon le mois
    updateFieldsStateForMonth(mois: number) {
        const moisForm = this.getMoisFormGroup(mois);
        if (!moisForm) return;

        // Gérer le solde début
        const soldeDebutControl = moisForm.get('soldeDebut');
        if (soldeDebutControl) {
            if (mois === 0) {
                soldeDebutControl.enable({ emitEvent: false });
            } else {
                soldeDebutControl.disable({ emitEvent: false });
            }
        }

        // Gérer les ventes et autres revenus (disabled pour mois 0)
        const ventesControl = moisForm.get('ventes');
        const autresRevenusControl = moisForm.get('autresRevenus');

        if (mois === 0) {
            ventesControl?.disable({ emitEvent: false });
            autresRevenusControl?.disable({ emitEvent: false });
            ventesControl?.setValue(null, { emitEvent: false });
            autresRevenusControl?.setValue(null, { emitEvent: false });
        } else {
            ventesControl?.enable({ emitEvent: false });
            autresRevenusControl?.enable({ emitEvent: false });
        }

        // Les champs de calcul restent toujours disabled
        ['totalEncaissements', 'totalDecaissements', 'disponibleEnCaisse', 'excedentDeficit', 'soldeFin'].forEach((field) => {
            moisForm.get(field)?.disable({ emitEvent: false });
        });
    }

    // NOUVELLE méthode pour réinitialiser un mois avec les bonnes valeurs par défaut
    private resetMonthToDefaults(mois: number) {
        const moisForm = this.getMoisFormGroup(mois);
        if (!moisForm) return;

        // Calculer le solde de début
        let soldeDebut = 0;
        if (mois === 0) {
            soldeDebut = 0;
        } else if (mois > 0) {
            const prevMoisForm = this.getMoisFormGroup(mois - 1);
            if (prevMoisForm) {
                const prevSoldeFin = prevMoisForm.get('soldeFin')?.value;
                soldeDebut = prevSoldeFin || 0;
            }
        }

        const defaultValues: any = {
            numeroMois: mois,
            soldeDebut: soldeDebut,
            ventes: null,
            autresRevenus: null,
            pret: mois === 0 && this.creditParams().montantCredit > 0 ? this.creditParams().montantCredit : null,
            achatmarchandises: null,
            mainoeuvre: null,
            investissement: null,
            impotstaxes: null,
            loyer: null,
            utilities: null,
            transport: null,
            salaires: null,
            fraistelephone: null,
            chargesfinancieres: null,
            entretien: null,
            autresdepenses: null,
            // NE PAS pré-remplir les remboursements - laisser NULL
            interetsAVerser: null,
            remboursementCapital: null,
            totalEncaissements: 0,
            totalDecaissements: 0,
            disponibleEnCaisse: 0,
            excedentDeficit: 0,
            soldeFin: 0
        };

        moisForm.reset(defaultValues, { emitEvent: false });
        moisForm.markAsPristine();
        moisForm.markAsUntouched();

        this.calculateMonth(mois);
        moisForm.updateValueAndValidity();
        this.cdr.detectChanges();
    }
    // Nouvelle méthode pour initialiser un mois vide
    private initializeEmptyMonth(mois: number) {
        const moisForm = this.getMoisFormGroup(mois);
        if (!moisForm) return;

        // Calculer le solde de début
        let soldeDebut = 0;
        if (mois === 0) {
            soldeDebut = 0;
        } else if (mois > 0) {
            const prevMoisForm = this.getMoisFormGroup(mois - 1);
            if (prevMoisForm) {
                soldeDebut = prevMoisForm.get('soldeFin')?.value || 0;
            }
        }

        // Valeurs par défaut avec null au lieu de 0 pour les champs vides
        const defaultValues = {
            numeroMois: mois,
            soldeDebut: soldeDebut,
            ventes: mois === 0 ? null : null,
            autresRevenus: mois === 0 ? null : null,
            pret: mois === 0 && this.creditParams().montantCredit > 0 ? this.creditParams().montantCredit : null,
            achatmarchandises: null,
            mainoeuvre: null,
            investissement: null,
            impotstaxes: null,
            loyer: null,
            utilities: null,
            transport: null,
            salaires: null,
            fraistelephone: null,
            chargesfinancieres: null,
            entretien: null,
            autresdepenses: null,
            interetsAVerser: mois > 0 && this.mensualite().interet > 0 ? this.mensualite().interet : null,
            remboursementCapital: mois > 0 && this.mensualite().capital > 0 ? this.mensualite().capital : null,
            totalEncaissements: 0,
            totalDecaissements: 0,
            disponibleEnCaisse: 0,
            excedentDeficit: 0,
            soldeFin: 0
        };

        // Utiliser patchValue sans événements
        moisForm.patchValue(defaultValues, { emitEvent: false });

        // Marquer comme pristine
        moisForm.markAsPristine();
        moisForm.markAsUntouched();
    }

    // SOLUTION 6: Nouvelle méthode pour rafraîchir le formulaire d'un mois
    private refreshMonthForm(mois: number) {
        const moisForm = this.getMoisFormGroup(mois);
        if (!moisForm) return;

        // Obtenir les valeurs actuelles
        const currentValues = moisForm.getRawValue();

        // Si le mois n'a pas de données et n'est pas sauvegardé
        if (!this.moisRenseignes().has(mois) && !this.moisSauvegardes().has(mois)) {
            // Réinitialiser avec les valeurs par défaut
            this.resetMonthFormValues(mois);
        } else {
            // Forcer la mise à jour avec les valeurs existantes
            moisForm.patchValue(currentValues, { emitEvent: true });
        }

        // Mettre à jour la validité
        moisForm.updateValueAndValidity();

        // Recalculer les totaux
        this.calculateMonth(mois);
    }

    // SOLUTION 7: Méthode pour réinitialiser les valeurs du formulaire
    private resetMonthFormValues(mois: number) {
        const moisForm = this.getMoisFormGroup(mois);
        if (!moisForm) return;

        let soldeDebut = 0;

        // Calculer le solde de début
        if (mois === 0) {
            soldeDebut = 0;
        } else if (mois > 0) {
            const prevMoisForm = this.getMoisFormGroup(mois - 1);
            if (prevMoisForm) {
                soldeDebut = prevMoisForm.get('soldeFin')?.value || 0;
            }
        }

        // Valeurs par défaut
        const defaultValues = {
            numeroMois: mois,
            soldeDebut: soldeDebut,
            ventes: 0,
            autresRevenus: 0,
            pret: mois === 0 ? this.creditParams().montantCredit : 0,
            achatmarchandises: 0,
            mainoeuvre: 0,
            investissement: 0,
            impotstaxes: 0,
            loyer: 0,
            utilities: 0,
            transport: 0,
            salaires: 0,
            fraistelephone: 0,
            chargesfinancieres: 0,
            entretien: 0,
            autresdepenses: 0,
            interetsAVerser: 0,
            remboursementCapital: 0,
            totalEncaissements: 0,
            totalDecaissements: 0,
            disponibleEnCaisse: 0,
            excedentDeficit: 0,
            soldeFin: 0
        };

        // Appliquer les valeurs
        moisForm.reset(defaultValues);

        // Forcer la mise à jour
        moisForm.updateValueAndValidity();
    }

    // Nouvelle méthode pour vérifier s'il y a des changements non sauvegardés
    hasUnsavedChanges(mois: number): boolean {
        const moisForm = this.getMoisFormGroup(mois);
        if (!moisForm) return false;

        // Vérifier si le formulaire a été modifié
        return moisForm.dirty && !this.moisSauvegardes().has(mois);
    }

    // Méthode améliorée pour procéder à la navigation
    private proceedToMonth(mois: number) {
        // Mettre à jour le mois actuel
        this.state.update((s) => ({ ...s, currentMonth: mois }));

        // Charger les données du mois si elles existent
        this.loadMonthData(mois);

        // Forcer la détection de changements
        this.cdr.detectChanges();
    }

    // Nouvelle méthode pour charger les données d'un mois
    private loadMonthData(mois: number): void {
        const previsionState = this.tresorerieState.getPrevision(mois);
        const moisForm = this.getMoisFormGroup(mois);

        if (!moisForm) return;

        if (previsionState && previsionState.hasData) {
            // Charger les données depuis l'état
            moisForm.patchValue(previsionState.data, { emitEvent: false });

            // Mettre à jour les états de validation
            if (previsionState.saved) {
                moisForm.markAsPristine();
            } else {
                moisForm.markAsDirty();
            }
        } else {
            // Initialiser avec des valeurs par défaut
            this.resetMonthToDefaults(mois);
        }

        this.calculateMonth(mois);
        this.updateFieldsStateForMonth(mois);
        this.cdr.detectChanges();
    }

    // Sauvegarder le mois actuel
    saveCurrentMonth() {
        const currentMonth = this.currentMonth();
        const moisForm = this.getMoisFormGroup(currentMonth);

        if (!moisForm || !this.creditParams().dossierId) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Veuillez créer un dossier avant de sauvegarder'
            });
            return;
        }

        if (!this.checkIfMoisHasData(moisForm.getRawValue())) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Aucune donnée à sauvegarder pour ce mois'
            });
            return;
        }

        const monthData = this.prepareMonthData(currentMonth);
        this.state.update((s) => ({ ...s, saving: true }));

        this.userService.savePrevisionsTresorerie$(this.creditParams().dossierId, [monthData]).subscribe({
            next: (response) => {
                this.tresorerieState.markAsSaved(currentMonth);
                moisForm.markAsPristine();

                this.state.update((s) => ({ ...s, saving: false }));
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: `Mois ${currentMonth} sauvegardé avec succès`
                });
            },
            error: (error) => {
                console.error('Erreur sauvegarde:', error);
                this.state.update((s) => ({ ...s, saving: false }));
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.error?.message || 'Impossible de sauvegarder le mois'
                });
            }
        });
    }

    // Navigation entre les mois
    goToMonth(mois: number): void {
        // Sauvegarder l'état actuel avant de changer de mois
        this.saveCurrentMonthState();

        // Changer le mois via le service
        this.tresorerieState.setCurrentMonth(mois);
    }

    private saveCurrentMonthState(): void {
        const currentMonth = this.currentMonth();
        const currentForm = this.getMoisFormGroup(currentMonth);

        if (currentForm && this.checkIfMoisHasData(currentForm.getRawValue())) {
            this.tresorerieState.updatePrevision(currentMonth, currentForm.getRawValue(), this.moisSauvegardes().has(currentMonth), true);
        }
    }

    // Préparer les données d'un mois
    private prepareMonthData(mois: number): any {
        const moisData = this.getMoisFormGroup(mois).getRawValue();

        const safeNumber = (val: any): number => {
            if (val === null || val === undefined || val === '') return 0;
            const num = Number(val);
            return isNaN(num) ? 0 : num;
        };

        const lignesEncaissement = [];
        if (safeNumber(moisData.ventes) > 0) {
            lignesEncaissement.push({
                categorie: 'VENTES',
                libelle: 'Ventes',
                montant: safeNumber(moisData.ventes)
            });
        }
        if (safeNumber(moisData.autresRevenus) > 0) {
            lignesEncaissement.push({
                categorie: 'AUTRES_REVENUS',
                libelle: 'Autres revenus',
                montant: safeNumber(moisData.autresRevenus)
            });
        }
        if (safeNumber(moisData.pret) > 0) {
            lignesEncaissement.push({
                categorie: 'PRET',
                libelle: 'Prêt',
                montant: safeNumber(moisData.pret)
            });
        }

        const lignesDecaissement = [];
        if (safeNumber(moisData.achatmarchandises) > 0) {
            lignesDecaissement.push({
                categorie: 'ACHAT_MARCHANDISES',
                libelle: 'Achat marchandises',
                montant: safeNumber(moisData.achatmarchandises)
            });
        }
        if (safeNumber(moisData.mainoeuvre) > 0) {
            lignesDecaissement.push({
                categorie: 'MAIN_OEUVRE',
                libelle: "Main d'œuvre",
                montant: safeNumber(moisData.mainoeuvre)
            });
        }
        if (safeNumber(moisData.investissement) > 0) {
            lignesDecaissement.push({
                categorie: 'INVESTISSEMENT',
                libelle: 'Investissement',
                montant: safeNumber(moisData.investissement)
            });
        }
        if (safeNumber(moisData.impotstaxes) > 0) {
            lignesDecaissement.push({
                categorie: 'IMPOTS_TAXES',
                libelle: 'Impôts et taxes',
                montant: safeNumber(moisData.impotstaxes)
            });
        }
        if (safeNumber(moisData.loyer) > 0) {
            lignesDecaissement.push({
                categorie: 'LOYER',
                libelle: 'Loyer',
                montant: safeNumber(moisData.loyer)
            });
        }
        if (safeNumber(moisData.utilities) > 0) {
            lignesDecaissement.push({
                categorie: 'UTILITIES',
                libelle: 'Utilities',
                montant: safeNumber(moisData.utilities)
            });
        }
        if (safeNumber(moisData.transport) > 0) {
            lignesDecaissement.push({
                categorie: 'TRANSPORT',
                libelle: 'Transport',
                montant: safeNumber(moisData.transport)
            });
        }
        if (safeNumber(moisData.salaires) > 0) {
            lignesDecaissement.push({
                categorie: 'SALAIRES',
                libelle: 'Salaires',
                montant: safeNumber(moisData.salaires)
            });
        }
        if (safeNumber(moisData.fraistelephone) > 0) {
            lignesDecaissement.push({
                categorie: 'FRAIS_TELEPHONE',
                libelle: 'Frais téléphone',
                montant: safeNumber(moisData.fraistelephone)
            });
        }
        if (safeNumber(moisData.chargesfinancieres) > 0) {
            lignesDecaissement.push({
                categorie: 'CHARGES_FINANCIERES',
                libelle: 'Charges financières',
                montant: safeNumber(moisData.chargesfinancieres)
            });
        }
        if (safeNumber(moisData.entretien) > 0) {
            lignesDecaissement.push({
                categorie: 'ENTRETIEN',
                libelle: 'Entretien',
                montant: safeNumber(moisData.entretien)
            });
        }
        if (safeNumber(moisData.autresdepenses) > 0) {
            lignesDecaissement.push({
                categorie: 'AUTRES_DEPENSES',
                libelle: 'Autres dépenses',
                montant: safeNumber(moisData.autresdepenses)
            });
        }
        if (safeNumber(moisData.interetsAVerser) > 0) {
            lignesDecaissement.push({
                categorie: 'INTERETS',
                libelle: 'Intérêts à verser',
                montant: safeNumber(moisData.interetsAVerser)
            });
        }
        if (safeNumber(moisData.remboursementCapital) > 0) {
            lignesDecaissement.push({
                categorie: 'CAPITAL',
                libelle: 'Remboursement capital',
                montant: safeNumber(moisData.remboursementCapital)
            });
        }

        return {
            numeroMois: mois,
            soldeDebut: safeNumber(moisData.soldeDebut),
            lignesEncaissement: lignesEncaissement,
            lignesDecaissement: lignesDecaissement,
            totalEncaissements: safeNumber(moisData.totalEncaissements),
            totalDecaissements: safeNumber(moisData.totalDecaissements),
            excedentDeficit: safeNumber(moisData.excedentDeficit),
            soldeFin: safeNumber(moisData.soldeFin)
        };
    }

    // Nouvelle méthode pour vider un formulaire de mois
    clearMoisForm(mois: number) {
        const moisForm = this.getMoisFormGroup(mois);
        if (!moisForm) return;

        // Conserver certaines valeurs selon le mois
        let soldeDebut = null;

        // Pour le mois 0, solde début = 0
        if (mois === 0) {
            soldeDebut = 0;
        }
        // Pour les autres mois, prendre le solde fin du mois précédent
        else if (mois > 0) {
            const prevMoisForm = this.getMoisFormGroup(mois - 1);
            if (prevMoisForm) {
                soldeDebut = prevMoisForm.get('soldeFin')?.value || 0;
            }
        }

        // Réinitialiser TOUS les champs
        const emptyValues: any = {
            numeroMois: mois,
            soldeDebut: soldeDebut,
            ventes: null,
            autresRevenus: null,
            pret: null,
            achatmarchandises: null,
            mainoeuvre: null,
            investissement: null,
            impotstaxes: null,
            loyer: null,
            utilities: null,
            transport: null,
            salaires: null,
            fraistelephone: null,
            chargesfinancieres: null,
            entretien: null,
            autresdepenses: null,
            interetsAVerser: null,
            remboursementCapital: null,
            totalEncaissements: 0,
            totalDecaissements: 0,
            disponibleEnCaisse: 0,
            excedentDeficit: 0,
            soldeFin: 0
        };

        // Pour le mois 0, on peut pré-remplir le prêt avec le montant du crédit
        if (mois === 0 && this.creditParams().montantCredit > 0) {
            emptyValues.pret = this.creditParams().montantCredit;
        }

        // Appliquer les valeurs
        moisForm.reset(emptyValues, { emitEvent: false });

        // Forcer la mise à jour
        moisForm.updateValueAndValidity();

        // Recalculer ce mois
        setTimeout(() => {
            this.calculateMonth(mois);
        }, 0);
    }

    // SOLUTION 8: Améliorer setupFormChangeListeners
    setupFormChangeListeners() {
        for (let mois = 0; mois <= 12; mois++) {
            const moisForm = this.getMoisFormGroup(mois);
            if (!moisForm) continue;

            moisForm.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe((values) => {
                // Ne traiter que si c'est le mois actuel
                if (mois === this.currentMonth()) {
                    const hasData = this.checkIfMoisHasData(values);

                    // Mettre à jour l'état via le service
                    if (hasData) {
                        this.tresorerieState.updatePrevision(
                            mois,
                            values,
                            false, // not saved yet
                            true // has data
                        );
                    } else if (this.tresorerieState.getPrevision(mois)) {
                        // Si pas de données mais une prévision existe, la supprimer
                        this.tresorerieState.clearMonth(mois);
                    }

                    // Recalculer
                    this.calculateMonth(mois);
                }
            });
        }
    }

    // Vérifier si on peut sauvegarder
    canSave(): boolean {
        return this.moisRenseignes().size > 0 && this.creditParams().dossierId > 0 && !this.state().saving;
    }

    // Obtenir le statut d'un mois
    getMoisStatus(mois: number): 'empty' | 'filled' | 'saved' | 'current' {
        if (this.currentMonth() === mois) {
            return 'current';
        }
        return this.tresorerieState.getMonthStatus(mois);
    }

    // Obtenir le label d'un mois
    getMoisLabel(mois: number): string {
        return mois === 0 ? 'Mois 0 (Démarrage)' : `Mois ${mois}`;
    }

    // Basculer entre les vues
    toggleView() {
        this.state.update((s) => ({
            ...s,
            viewMode: s.viewMode === 'saisie' ? 'vue-ensemble' : 'saisie'
        }));
    }

    // Import Excel
    importExcel(event: any) {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            this.state.update((s) => ({ ...s, loading: true }));

            this.userService.importPrevisionsTresorerie$(this.creditParams().dossierId, formData).subscribe({
                next: (response) => {
                    if (response.data) {
                        this.populateForm(response.data);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: 'Données importées avec succès'
                        });
                    }
                    this.state.update((s) => ({ ...s, loading: false }));
                },
                error: (error) => {
                    this.state.update((s) => ({
                        ...s,
                        loading: false,
                        error: error
                    }));
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: "Erreur lors de l'import"
                    });
                }
            });
        }
    }

    // Export Excel
    exportExcel() {
        this.userService.exportPrevisionsTresorerie$(this.creditParams().dossierId).subscribe({
            next: (blob: any) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `previsions_tresorerie_${this.creditParams().clientNom}.xlsx`;
                link.click();
                window.URL.revokeObjectURL(url);
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: "Impossible d'exporter les données"
                });
            }
        });
    }

    // Validation du formulaire
    validateAndProceed() {
        this.calculateAllMonths();
        const isValid = this.validateCoherence();

        if (isValid) {
            this.savePrevisions();
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Veuillez vérifier la cohérence des données'
            });
        }
    }
    // Valider la cohérence des données
    validateCoherence(): boolean {
        for (let mois = 1; mois <= 12; mois++) {
            if (this.tresorerieState.monthHasData(mois)) {
                const moisData = this.getMoisFormGroup(mois).getRawValue();
                const remboursementTotal = (moisData.interetsAVerser || 0) + (moisData.remboursementCapital || 0);

                if (moisData.excedentDeficit < remboursementTotal) {
                    this.messageService.add({
                        severity: 'warn',
                        summary: `Mois ${mois}`,
                        detail: "L'excédent ne couvre pas les remboursements"
                    });
                    return false;
                }
            }
        }
        return true;
    }

    // Obtenir le cumul total
    getCumuls() {
        let cumuls = {
            ventes: 0,
            autresRevenus: 0,
            pret: 0,
            totalEncaissements: 0,
            achatMarchandises: 0,
            totalDecaissements: 0,
            excedentDeficit: 0
        };

        for (let mois = 1; mois <= 12; mois++) {
            const moisData = this.getMoisFormGroup(mois).getRawValue();
            cumuls.ventes += moisData.ventes || 0;
            cumuls.autresRevenus += moisData.autresRevenus || 0;
            cumuls.pret += moisData.pret || 0;
            cumuls.totalEncaissements += moisData.totalEncaissements || 0;
            cumuls.achatMarchandises += moisData.achatMarchandises || 0;
            cumuls.totalDecaissements += moisData.totalDecaissements || 0;
            cumuls.excedentDeficit += moisData.excedentDeficit || 0;
        }
        return cumuls;
    }

    /**
     * Méthode pour imprimer le tableau de trésorerie
     */
    imprimerTableauTresorerie(): void {
        if (!this.tresorerieForm) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: "Aucune donnée de trésorerie disponible pour l'impression"
            });
            return;
        }

        // Vérifier s'il y a des données à imprimer
        const hasSomeData = this.getFormSummary().moisRenseignes > 0;

        if (!hasSomeData) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: "Veuillez saisir au moins un mois de données avant d'imprimer"
            });
            return;
        }

        try {
            // Utiliser le service d'impression
            this.tresoreriePrintService.imprimerTableauTresorerie(this.tresorerieForm, this.creditParams(), this.demandeIndividuel());

            this.messageService.add({
                severity: 'success',
                summary: 'Impression',
                detail: "Fenêtre d'impression ouverte"
            });
        } catch (error) {
            console.error("Erreur lors de l'impression:", error);
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: "Impossible de générer le document d'impression"
            });
        }
    }

    /**
     * Vérifie si l'impression est possible
     */
    peutImprimer(): boolean {
        return !!(this.tresorerieForm && this.getFormSummary().moisRenseignes > 0);
    }

    /**
     * Obtient un aperçu des données pour l'impression
     */
    getApercuImpression(): string {
        if (!this.peutImprimer()) return 'Aucune donnée disponible';

        const summary = this.getFormSummary();
        const creditParams = this.creditParams();
        const demandeur = this.demandeIndividuel();

        const nomClient = demandeur ? `${demandeur.prenom} ${demandeur.nom}` : creditParams.clientNom || 'Client non défini';

        const montant = this.formatMontant(creditParams.montantCredit);

        return `${nomClient} - ${montant} - ${summary.moisRenseignes} mois renseignés`;
    }

    /**
     * Prévisualisation avant impression
     */
    previsualiserTableauTresorerie(): void {
        if (!this.peutImprimer()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Aucune donnée disponible pour la prévisualisation'
            });
            return;
        }

        // Simplement ouvrir l'impression - le navigateur proposera la prévisualisation
        this.imprimerTableauTresorerie();
    }

    /**
     * Export en PDF (via impression navigateur)
     */
    exporterTableauPDF(): void {
        if (!this.peutImprimer()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: "Aucune donnée disponible pour l'export"
            });
            return;
        }

        this.messageService.add({
            severity: 'info',
            summary: 'Export PDF',
            detail: 'Dans la fenêtre d\'impression, choisissez "Enregistrer au format PDF"'
        });

        // Délai pour que l'utilisateur voie le message
        setTimeout(() => {
            this.imprimerTableauTresorerie();
        }, 1000);
    }

    /**
     * Validation avant impression
     */
    private validerDonneesAvantImpression(): boolean {
        const summary = this.getFormSummary();

        if (summary.moisRenseignes === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Données insuffisantes',
                detail: 'Veuillez saisir au moins un mois de données'
            });
            return false;
        }

        if (!this.creditParams().montantCredit || this.creditParams().montantCredit === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Paramètres incomplets',
                detail: "Le montant du crédit n'est pas défini"
            });
            return false;
        }

        return true;
    }

    /**
     * Impression avec options avancées
     */
    imprimerAvecOptions(
        options: {
            inclureAnalyse?: boolean;
            inclureSignature?: boolean;
            titre?: string;
        } = {}
    ): void {
        if (!this.validerDonneesAvantImpression()) {
            return;
        }

        try {
            this.tresoreriePrintService.imprimerTableauTresorerie(this.tresorerieForm, this.creditParams(), this.demandeIndividuel());

            this.messageService.add({
                severity: 'success',
                summary: 'Impression',
                detail: 'Document généré avec les options demandées'
            });
        } catch (error) {
            console.error('Erreur impression avec options:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible de générer le document avec ces options'
            });
        }
    }

    /**
     * Obtient un résumé des données pour affichage dans l'interface
     */
    getResumeImpressionPourAffichage(): any {
        if (!this.peutImprimer()) {
            return {
                status: 'unavailable',
                message: 'Données insuffisantes',
                details: 'Veuillez saisir au moins un mois de prévisions'
            };
        }

        const summary = this.getFormSummary();
        const creditParams = this.creditParams();

        return {
            status: 'ready',
            message: 'Prêt pour impression',
            details: {
                moisRenseignes: summary.moisRenseignes,
                moisSauvegardes: summary.moisSauvegardes,
                client: this.demandeIndividuel() ? `${this.demandeIndividuel().prenom} ${this.demandeIndividuel().nom}` : creditParams.clientNom,
                montantCredit: this.formatMontant(creditParams.montantCredit),
                duree: `${creditParams.duree} mois`,
                tauxInteret: `${creditParams.tauxInteret}%`
            }
        };
    }

    public splitButtonOptions = [
        {
            label: 'Prévisualiser',
            icon: 'pi pi-eye',
            command: () => this.previsualiserTableauTresorerie()
        },
        {
            separator: true
        },
        {
            label: 'Exporter en PDF',
            icon: 'pi pi-file-pdf',
            command: () => this.exporterTableauPDF()
        }
    ];
}
