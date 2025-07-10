import { UserService } from '@/service/user.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { IResponse } from '@/interface/response';
import { TextareaModule } from 'primeng/textarea';
import { InputGroupModule } from 'primeng/inputgroup';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { ListboxModule } from 'primeng/listbox';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { Delegation } from '@/interface/delegation';
import { Agence } from '@/interface/agence';
import { PointVente } from '@/interface/point.vente';
import { Personnecaution } from '@/interface/personnecaution';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { DemandeUpdateRequest } from '@/interface/DemandeUpdateRequest';

type PrimeSeverity = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast';

interface ComponentState {
    loading: boolean;
    loadingInitialData: boolean;
    allDelegations: Delegation[];
    allAgences: Agence[];
    allPointsVente: PointVente[];
    filteredAgences: Agence[];
    filteredPointsVente: PointVente[];
    currentDemandeData: any;
}

@Component({
    selector: 'app-udpate-analyse-credit-complete',
    imports: [
        CommonModule,
        TextareaModule,
        InputGroupModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        InputNumberModule,
        CalendarModule,
        DropdownModule,
        StepsModule,
        CardModule,
        ToastModule,
        TagModule,
        BadgeModule,
        ListboxModule,
        AccordionModule,
        CurrencyPipe,
        TableModule,
        PanelModule,
        ProgressSpinnerModule,
        SkeletonModule
    ],
    templateUrl: './udpate-analyse-credit-complete.component.html',
    styleUrl: './udpate-analyse-credit-complete.component.scss',
    providers: [MessageService]
})
export class UdpateAnalyseCreditCompleteComponent {
    // Injection des services
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);
    private analyseCreditService = inject(UserService);
    private route = inject(ActivatedRoute);

    // State management
    state = signal<ComponentState>({
        loading: false,
        loadingInitialData: true,
        allDelegations: [],
        allAgences: [],
        allPointsVente: [],
        filteredAgences: [],
        filteredPointsVente: [],
        currentDemandeData: null
    });

    // Variables
    activeIndex = signal<number>(0);
    items = signal<MenuItem[]>([]);
    loading = signal<boolean>(false);
    demandeId: number | null = null;

    // Formulaires pour chaque étape
    infoBaseForm!: FormGroup;
    bilanEntrepriseForm!: FormGroup;
    bilanPersonnelForm!: FormGroup;
    resultatActuelForm!: FormGroup;
    resultatPrevisionnelForm!: FormGroup;
    chargesActuellesForm!: FormGroup;
    chargesPrevisionellesForm!: FormGroup;
    demandeCreditForm!: FormGroup;
    personnecautionForm!: FormGroup;

    // Données pour les formulaires
    formeJuridiques = [
        { label: 'SARL', value: 'SARL' },
        { label: 'SA', value: 'SA' },
        { label: 'EI', value: 'EI' },
        { label: 'EIRL', value: 'EIRL' },
        { label: 'SNC', value: 'SNC' }
    ];

    secteursActivite = [
        { label: 'Commerce', value: 'Commerce' },
        { label: 'Agriculture', value: 'Agriculture' },
        { label: 'Service', value: 'Service' },
        { label: 'Industrie', value: 'Industrie' },
        { label: 'Artisanat', value: 'Artisanat' }
    ];

    // Liste des personnes caution
    personnecautions: Personnecaution[] = [];

    // Résumé des informations saisies
    resumeData: any = {};

    ngOnInit() {
        // Extraire l'ID de la demande depuis les paramètres de route
        this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            this.demandeId = params['demandeId'] ? parseInt(params['demandeId'], 10) : null;
            console.log('Demande ID from route:', this.demandeId);

            if (!this.demandeId) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: "ID de la demande de crédit manquant dans l'URL",
                    life: 3000
                });
                this.router.navigate(['/dashboards']);
                return;
            }

            this.loadInitialData();
        });

        this.initStepItems();
        this.initForms();
    }

    private loadInitialData(): void {
        this.state.update((state) => ({ ...state, loadingInitialData: true }));

        // Charger les données de base (délégations, agences, etc.)
        this.analyseCreditService
            .startNewDemandeInd$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    console.log('Initial data loaded:', response);
                    if (response.data) {
                        this.state.update((state) => ({
                            ...state,
                            allDelegations: response.data.delegations || [],
                            allAgences: response.data.agences || [],
                            allPointsVente: response.data.pointVentes || []
                        }));
                    }
                    // Charger les données de la demande existante
                    this.loadExistingDemandeData();
                },
                error: (error) => {
                    console.error('Error loading initial data:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger les données initiales',
                        life: 3000
                    });
                    this.state.update((state) => ({
                        ...state,
                        loadingInitialData: false
                    }));
                }
            });
    }

    private loadExistingDemandeData(): void {
        if (!this.demandeId) return;

        this.analyseCreditService
            .obtenirAnalyseCompleteCredit$(this.demandeId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    console.log('Existing demande data loaded:', response);
                    // CORRECTION: Accès correct à analyseComplete
                    if (response.data && response.data.analyseComplete && response.data.analyseComplete.success) {
                        const data = response.data.analyseComplete.data;
                        this.state.update((state) => ({
                            ...state,
                            currentDemandeData: data,
                            loadingInitialData: false
                        }));
                        this.populateFormsWithExistingData(data);
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: 'Demande de crédit non trouvée',
                            life: 3000
                        });
                        this.router.navigate(['/dashboards']);
                    }
                },
                error: (error) => {
                    console.error('Error loading existing demande data:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger les données de la demande',
                        life: 3000
                    });
                    this.state.update((state) => ({
                        ...state,
                        loadingInitialData: false
                    }));
                }
            });
    }

    private populateFormsWithExistingData(data: any): void {
        try {
            console.log('Populating forms with data:', data);

            // Remplir le formulaire d'informations de base
            if (data.promoteur && data.entreprise) {
                this.infoBaseForm.patchValue({
                    // Promoteur
                    nomPromoteur: data.promoteur.nom || '',
                    prenomPromoteur: data.promoteur.prenom || '',
                    dateNaissance: data.promoteur.dateNaissance ? new Date(data.promoteur.dateNaissance) : null,
                    numeroIdentite: data.promoteur.numeroIdentite || '',
                    adressePromoteur: data.promoteur.adresse || '',
                    telephonePromoteur: data.promoteur.telephone || '',
                    emailPromoteur: data.promoteur.email || '',

                    // Entreprise
                    nomEntreprise: data.entreprise.nom || '',
                    formeJuridique: this.findOptionByValue(this.formeJuridiques, data.entreprise.formeJuridique),
                    secteurActivite: this.findOptionByValue(this.secteursActivite, data.entreprise.secteurActivite),
                    dateCreation: data.entreprise.dateCreation ? new Date(data.entreprise.dateCreation) : null,
                    numeroRegistre: data.entreprise.numeroRegistre || '',
                    adresseEntreprise: data.entreprise.adresse || '',
                    telephoneEntreprise: data.entreprise.telephone || '',
                    emailEntreprise: data.entreprise.email || ''
                });
            }

            // Remplir le formulaire de bilan entreprise
            if (data.bilanEntreprise) {
                this.bilanEntrepriseForm.patchValue({
                    liquidites: data.bilanEntreprise.liquidites || 0,
                    creancesClients: data.bilanEntreprise.creancesClients || 0,
                    valeurStocks: data.bilanEntreprise.valeurStocks || 0,
                    valeurEquipements: data.bilanEntreprise.valeurEquipements || 0,
                    dettesFournisseurs: data.bilanEntreprise.dettesFournisseurs || 0,
                    emprunts: data.bilanEntreprise.emprunts || 0,
                    capitalPropre: data.bilanEntreprise.capitalPropre || 0
                });
            }

            // Remplir le formulaire de bilan personnel
            if (data.bilanPersonnel) {
                this.bilanPersonnelForm.patchValue({
                    epargnes: data.bilanPersonnel.epargnes || 0,
                    valeurBiensDurables: data.bilanPersonnel.valeurBiensDurables || 0,
                    libeleGarantie: data.bilanPersonnel.libeleGarantie || '',
                    montantGarantie: data.bilanPersonnel.montantGarantie || 0
                });
            }

            // Remplir les formulaires de compte d'exploitation
            if (data.compteExploitationActuel) {
                this.resultatActuelForm.patchValue({
                    chiffreAffaires: data.compteExploitationActuel.chiffreAffaires || 0,
                    autresRevenus: data.compteExploitationActuel.autresRevenus || 0,
                    coutMarchandises: data.compteExploitationActuel.coutMarchandises || 0
                });

                this.chargesActuellesForm.patchValue({
                    coutTransportProduction: data.compteExploitationActuel.coutTransportProduction || 0,
                    fraisTransportPersonnel: data.compteExploitationActuel.fraisTransportPersonnel || 0,
                    fraisManutention: data.compteExploitationActuel.fraisManutention || 0,
                    montantAideExterne: data.compteExploitationActuel.montantAideExterne || 0,
                    fraisHebergementRestauration: data.compteExploitationActuel.fraisHebergementRestauration || 0,
                    impots: data.compteExploitationActuel.impots || 0,
                    loyers: data.compteExploitationActuel.loyers || 0
                });
            }

            if (data.compteExploitationPrevisionnel) {
                this.resultatPrevisionnelForm.patchValue({
                    chiffreAffaires: data.compteExploitationPrevisionnel.chiffreAffaires || 0,
                    autresRevenus: data.compteExploitationPrevisionnel.autresRevenus || 0,
                    coutMarchandises: data.compteExploitationPrevisionnel.coutMarchandises || 0
                });

                this.chargesPrevisionellesForm.patchValue({
                    coutTransportProduction: data.compteExploitationPrevisionnel.coutTransportProduction || 0,
                    fraisTransportPersonnel: data.compteExploitationPrevisionnel.fraisTransportPersonnel || 0,
                    fraisManutention: data.compteExploitationPrevisionnel.fraisManutention || 0,
                    montantAideExterne: data.compteExploitationPrevisionnel.montantAideExterne || 0,
                    fraisHebergementRestauration: data.compteExploitationPrevisionnel.fraisHebergementRestauration || 0,
                    impots: data.compteExploitationPrevisionnel.impots || 0,
                    loyers: data.compteExploitationPrevisionnel.loyers || 0
                });
            }

            // Remplir le formulaire de demande de crédit
            if (data.demande) {
                // Trouver et sélectionner la délégation
                const delegation = this.findDelegationById(data.demande.delegationId);
                if (delegation) {
                    this.demandeCreditForm.patchValue({ delegation });
                    this.onDelegationChange({ value: delegation });

                    // Trouver et sélectionner l'agence
                    setTimeout(() => {
                        const agence = this.findAgenceById(data.demande.agenceId);
                        if (agence) {
                            this.demandeCreditForm.patchValue({ agence });
                            this.onAgenceChange({ value: agence });

                            // Trouver et sélectionner le point de vente
                            setTimeout(() => {
                                const pointVente = this.findPointVenteById(data.demande.pointVenteId);
                                if (pointVente) {
                                    this.demandeCreditForm.patchValue({ pointVente });
                                }
                            }, 100);
                        }
                    }, 100);
                }

                this.demandeCreditForm.patchValue({
                    montantDemande: data.demande.montantDemande || 0,
                    dureeMois: data.demande.dureeMois || 12,
                    objetFinancement: data.demande.objetFinancement || ''
                });
            }

            // CORRECTION AMÉLIORÉE: Charger les cautions depuis le JSON string
            console.log('Processing cautions data:', data.cautions);
            console.log('Type of cautions:', typeof data.cautions);

            this.personnecautions = []; // Reset first

            if (data.cautions) {
                try {
                    let cautionsArray: any[] = [];

                    // Handle both string and already parsed array
                    if (typeof data.cautions === 'string') {
                        console.log('Parsing cautions from string:', data.cautions);
                        cautionsArray = JSON.parse(data.cautions);
                    } else if (Array.isArray(data.cautions)) {
                        console.log('Cautions already an array:', data.cautions);
                        cautionsArray = data.cautions;
                    }

                    if (Array.isArray(cautionsArray) && cautionsArray.length > 0) {
                        this.personnecautions = cautionsArray.map((caution: any) => ({
                            nom: caution.nom?.trim() || '',
                            prenom: caution.prenom?.trim() || '',
                            telephone: caution.telephone || '',
                            activite: caution.activite || '',
                            age: caution.age ? Number(caution.age) : undefined,
                            profession: caution.profession || ''
                        }));

                        console.log('Successfully loaded cautions:', this.personnecautions);

                        // Force change detection
                        setTimeout(() => {
                            console.log('Final personnecautions array:', this.personnecautions);
                        }, 100);
                    } else {
                        console.log('No valid cautions found in array');
                    }
                } catch (error) {
                    console.error('Error parsing cautions JSON:', error);
                    console.error('Raw cautions data:', data.cautions);
                    this.personnecautions = [];

                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Attention',
                        detail: 'Erreur lors du chargement des cautions',
                        life: 3000
                    });
                }
            } else {
                console.log('No cautions data found');
            }

            this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: `Données chargées avec succès${this.personnecautions.length > 0 ? ` (${this.personnecautions.length} cautions)` : ''}`,
                life: 3000
            });
        } catch (error) {
            console.error('Error populating forms:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Erreur lors du chargement des données dans les formulaires',
                life: 3000
            });
        }
    }

    private findOptionByValue(options: any[], value: string): any {
        return options.find((option) => option.value === value) || null;
    }

    private findDelegationById(id: number): Delegation | null {
        return this.state().allDelegations.find((d) => d.id === id) || null;
    }

    private findAgenceById(id: number): Agence | null {
        return this.state().allAgences.find((a) => a.id === id) || null;
    }

    private findPointVenteById(id: number): PointVente | null {
        return this.state().allPointsVente.find((p) => p.id === id) || null;
    }

    // Initialisation des étapes du stepper
    initStepItems() {
        this.items.set([
            { label: 'Informations de base', command: () => this.onStepChange(0) },
            { label: 'Bilan entreprise', command: () => this.onStepChange(1) },
            { label: 'Bilan personnel', command: () => this.onStepChange(2) },
            { label: 'Résultats actuels', command: () => this.onStepChange(3) },
            { label: 'Résultats prévisionnels', command: () => this.onStepChange(4) },
            { label: 'Charges actuelles', command: () => this.onStepChange(5) },
            { label: 'Charges prévisionnelles', command: () => this.onStepChange(6) },
            { label: 'Demande de crédit', command: () => this.onStepChange(7) },
            { label: 'Personnes caution', command: () => this.onStepChange(8) },
            { label: 'Résumé', command: () => this.onStepChange(9) }
        ]);
    }

    // Initialisation des formulaires pour chaque étape
    initForms() {
        // Formulaire pour les informations de base (promoteur et entreprise)
        this.infoBaseForm = this.fb.group({
            // Promoteur
            nomPromoteur: ['', Validators.required],
            prenomPromoteur: ['', Validators.required],
            dateNaissance: [null],
            numeroIdentite: [''],
            adressePromoteur: [''],
            telephonePromoteur: [''],
            emailPromoteur: ['', Validators.email],

            // Entreprise
            nomEntreprise: ['', Validators.required],
            formeJuridique: [''],
            secteurActivite: [''],
            dateCreation: [null],
            numeroRegistre: [''],
            adresseEntreprise: [''],
            telephoneEntreprise: [''],
            emailEntreprise: ['', Validators.email]
        });

        // Formulaire pour le bilan de l'entreprise
        this.bilanEntrepriseForm = this.fb.group({
            liquidites: [0, Validators.min(0)],
            creancesClients: [0, Validators.min(0)],
            valeurStocks: [0, Validators.min(0)],
            valeurEquipements: [0, Validators.min(0)],
            dettesFournisseurs: [0, Validators.min(0)],
            emprunts: [0, Validators.min(0)],
            capitalPropre: [0, Validators.min(0)]
        });

        // Formulaire pour le bilan personnel du promoteur
        this.bilanPersonnelForm = this.fb.group({
            epargnes: [0, Validators.min(0)],
            valeurBiensDurables: [0, Validators.min(0)],
            libeleGarantie: [''],
            montantGarantie: [0, Validators.min(0)]
        });

        // Formulaire pour les résultats actuels
        this.resultatActuelForm = this.fb.group({
            chiffreAffaires: [0, [Validators.required, Validators.min(0)]],
            autresRevenus: [0, Validators.min(0)],
            coutMarchandises: [0, [Validators.required, Validators.min(0)]]
        });

        // Formulaire pour les résultats prévisionnels
        this.resultatPrevisionnelForm = this.fb.group({
            chiffreAffaires: [0, [Validators.required, Validators.min(0)]],
            autresRevenus: [0, Validators.min(0)],
            coutMarchandises: [0, [Validators.required, Validators.min(0)]]
        });

        // Formulaire pour les charges actuelles
        this.chargesActuellesForm = this.fb.group({
            coutTransportProduction: [0, Validators.min(0)],
            fraisTransportPersonnel: [0, Validators.min(0)],
            fraisManutention: [0, Validators.min(0)],
            montantAideExterne: [0, Validators.min(0)],
            fraisHebergementRestauration: [0, Validators.min(0)],
            impots: [0, Validators.min(0)],
            loyers: [0, Validators.min(0)]
        });

        // Formulaire pour les charges prévisionnelles
        this.chargesPrevisionellesForm = this.fb.group({
            coutTransportProduction: [0, Validators.min(0)],
            fraisTransportPersonnel: [0, Validators.min(0)],
            fraisManutention: [0, Validators.min(0)],
            montantAideExterne: [0, Validators.min(0)],
            fraisHebergementRestauration: [0, Validators.min(0)],
            impots: [0, Validators.min(0)],
            loyers: [0, Validators.min(0)]
        });

        // Formulaire pour la demande de crédit
        this.demandeCreditForm = this.fb.group({
            montantDemande: [0, [Validators.required, Validators.min(1)]],
            dureeMois: [12, [Validators.required, Validators.min(1)]],
            objetFinancement: ['', Validators.required],
            delegation: [null],
            agence: [null],
            pointVente: [null]
        });

        // Formulaire pour les personnes caution
        this.personnecautionForm = this.fb.group({
            nom: [''],
            prenom: [''],
            telephone: [''],
            activite: [''],
            age: [null, [Validators.min(18), Validators.max(100)]],
            profession: ['']
        });
    }

    onStepChange(index: number) {
        if (!this.validateCurrentForm()) {
            return;
        }

        if (index === 9) {
            this.prepareSummary();
        }

        this.activeIndex.set(index);
    }

    // Navigation entre les étapes
    nextStep() {
        const currentIndex = this.activeIndex();

        if (!this.validateCurrentForm()) {
            return;
        }

        if (currentIndex < this.items().length - 1) {
            if (currentIndex === 8) {
                this.prepareSummary();
            }
            this.activeIndex.set(currentIndex + 1);
        }
    }

    prevStep() {
        const currentIndex = this.activeIndex();
        if (currentIndex > 0) {
            this.activeIndex.set(currentIndex - 1);
        }
    }

    // Validation du formulaire actuel
    validateCurrentForm(): boolean {
        const currentIndex = this.activeIndex();

        switch (currentIndex) {
            case 0: // Informations de base
                if (this.infoBaseForm.invalid) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Veuillez remplir correctement tous les champs obligatoires.'
                    });
                    return false;
                }
                this.saveInfoBaseToResume();
                break;
            case 1: // Bilan entreprise
                if (this.bilanEntrepriseForm.invalid) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Veuillez remplir correctement tous les champs du bilan.'
                    });
                    return false;
                }
                this.saveBilanEntrepriseToResume();
                break;
            case 2: // Bilan personnel
                if (this.bilanPersonnelForm.invalid) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Veuillez remplir correctement tous les champs du bilan personnel.'
                    });
                    return false;
                }
                this.saveBilanPersonnelToResume();
                break;
            case 3: // Résultats actuels
                if (this.resultatActuelForm.invalid) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Veuillez remplir correctement tous les champs des résultats actuels.'
                    });
                    return false;
                }
                this.saveResultatActuelToResume();
                break;
            case 4: // Résultats prévisionnels
                if (this.resultatPrevisionnelForm.invalid) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Veuillez remplir correctement tous les champs des résultats prévisionnels.'
                    });
                    return false;
                }
                this.saveResultatPrevisionnelToResume();
                break;
            case 5: // Charges actuelles
                if (this.chargesActuellesForm.invalid) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Veuillez remplir correctement tous les champs des charges actuelles.'
                    });
                    return false;
                }
                this.saveChargesActuellesToResume();
                break;
            case 6: // Charges prévisionnelles
                if (this.chargesPrevisionellesForm.invalid) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Veuillez remplir correctement tous les champs des charges prévisionnelles.'
                    });
                    return false;
                }
                this.saveChargesPrevisionellesToResume();
                break;
            case 7: // Demande de crédit
                if (this.demandeCreditForm.invalid) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Veuillez remplir correctement tous les champs de la demande de crédit.'
                    });
                    return false;
                }
                this.saveDemandeCreditToResume();
                break;
            case 8: // Personnes caution - optional validation
                break;
        }

        return true;
    }

    // Delegation/Agence/PointVente change handlers
    onDelegationChange(event: any): void {
        console.log('Delegation changed:', event);

        const delegation = event.value;
        if (!delegation || !delegation.id) {
            this.state.update((state) => ({
                ...state,
                filteredAgences: [],
                filteredPointsVente: []
            }));
            return;
        }

        const delegationId = delegation.id;
        console.log('Filtering agences for delegation ID:', delegationId);

        const filteredAgences = this.state().allAgences?.filter((agence) => agence.delegation_id === delegationId) || [];

        this.state.update((state) => ({
            ...state,
            filteredAgences,
            filteredPointsVente: []
        }));

        // Reset agence and point vente selections only if not loading existing data
        if (!this.state().loadingInitialData) {
            this.demandeCreditForm.patchValue({
                agence: null,
                pointVente: null
            });
        }
    }

    onAgenceChange(event: any): void {
        console.log('Agence changed:', event);

        const agence = event.value;
        if (!agence || !agence.id) {
            this.state.update((state) => ({
                ...state,
                filteredPointsVente: []
            }));
            return;
        }

        const agenceId = agence.id;
        console.log('Filtering points de vente for agence ID:', agenceId);

        const filteredPointsVente = this.state().allPointsVente?.filter((pointVente) => pointVente.agence_id === agenceId) || [];

        this.state.update((state) => ({
            ...state,
            filteredPointsVente
        }));

        // Reset point vente selection only if not loading existing data
        if (!this.state().loadingInitialData) {
            this.demandeCreditForm.patchValue({
                pointVente: null
            });
        }
    }

    // Personnecaution management methods
    addPersonnecaution(): void {
        if (this.personnecautionForm.invalid) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: "Veuillez remplir correctement tous les champs avant d'ajouter la personne caution."
            });
            return;
        }

        const personnecaution: Personnecaution = {
            nom: this.personnecautionForm.get('nom')?.value || '',
            prenom: this.personnecautionForm.get('prenom')?.value || '',
            telephone: this.personnecautionForm.get('telephone')?.value || '',
            activite: this.personnecautionForm.get('activite')?.value || '',
            age: this.personnecautionForm.get('age')?.value || undefined,
            profession: this.personnecautionForm.get('profession')?.value || ''
        };

        this.personnecautions.push(personnecaution);
        this.personnecautionForm.reset();

        this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Personne caution ajoutée avec succès.'
        });
    }

    removePersonnecaution(index: number): void {
        this.personnecautions.splice(index, 1);
        this.messageService.add({
            severity: 'info',
            summary: 'Information',
            detail: 'Personne caution supprimée.'
        });
    }

    // Méthodes pour sauvegarder les données dans l'objet résumé
    saveInfoBaseToResume() {
        const formeJuridiqueValue = this.infoBaseForm.get('formeJuridique')?.value;
        const formeJuridiqueLabel = formeJuridiqueValue
            ? (typeof formeJuridiqueValue === 'object' && formeJuridiqueValue.label ? formeJuridiqueValue.label : this.formeJuridiques.find((f) => f.value === formeJuridiqueValue)?.label) || formeJuridiqueValue || ''
            : '';

        const secteurActiviteValue = this.infoBaseForm.get('secteurActivite')?.value;
        const secteurActiviteLabel = secteurActiviteValue
            ? (typeof secteurActiviteValue === 'object' && secteurActiviteValue.label ? secteurActiviteValue.label : this.secteursActivite.find((s) => s.value === secteurActiviteValue)?.label) || secteurActiviteValue || ''
            : '';

        this.resumeData.promoteur = {
            nom: this.infoBaseForm.get('nomPromoteur')?.value || '',
            prenom: this.infoBaseForm.get('prenomPromoteur')?.value || '',
            date_naissance: this.formatDate(this.infoBaseForm.get('dateNaissance')?.value),
            numero_identite: this.infoBaseForm.get('numeroIdentite')?.value || '',
            adresse: this.infoBaseForm.get('adressePromoteur')?.value || '',
            telephone: this.infoBaseForm.get('telephonePromoteur')?.value || '',
            email: this.infoBaseForm.get('emailPromoteur')?.value || ''
        };

        this.resumeData.entreprise = {
            nom: this.infoBaseForm.get('nomEntreprise')?.value || '',
            forme_juridique: formeJuridiqueLabel,
            secteur_activite: secteurActiviteLabel,
            date_creation: this.formatDate(this.infoBaseForm.get('dateCreation')?.value),
            numero_registre: this.infoBaseForm.get('numeroRegistre')?.value || '',
            adresse: this.infoBaseForm.get('adresseEntreprise')?.value || '',
            telephone: this.infoBaseForm.get('telephoneEntreprise')?.value || '',
            email: this.infoBaseForm.get('emailEntreprise')?.value || ''
        };
    }

    saveBilanEntrepriseToResume() {
        this.resumeData.bilanEntreprise = {
            liquidites: this.bilanEntrepriseForm.get('liquidites')?.value || 0,
            creances_clients: this.bilanEntrepriseForm.get('creancesClients')?.value || 0,
            valeur_stocks: this.bilanEntrepriseForm.get('valeurStocks')?.value || 0,
            valeur_equipements: this.bilanEntrepriseForm.get('valeurEquipements')?.value || 0,
            dettes_fournisseurs: this.bilanEntrepriseForm.get('dettesFournisseurs')?.value || 0,
            emprunts: this.bilanEntrepriseForm.get('emprunts')?.value || 0,
            capital_propre: this.bilanEntrepriseForm.get('capitalPropre')?.value || 0
        };
    }

    saveBilanPersonnelToResume() {
        this.resumeData.bilanPersonnel = {
            epargnes: this.bilanPersonnelForm.get('epargnes')?.value || 0,
            valeur_biens_durables: this.bilanPersonnelForm.get('valeurBiensDurables')?.value || 0,
            libele_garantie: this.bilanPersonnelForm.get('libeleGarantie')?.value || '',
            montant_garantie: this.bilanPersonnelForm.get('montantGarantie')?.value || 0
        };
    }

    saveResultatActuelToResume() {
        this.resumeData.resultatActuel = {
            chiffre_affaires: this.resultatActuelForm.get('chiffreAffaires')?.value || 0,
            autres_revenus: this.resultatActuelForm.get('autresRevenus')?.value || 0,
            cout_marchandises: this.resultatActuelForm.get('coutMarchandises')?.value || 0
        };
    }

    saveResultatPrevisionnelToResume() {
        this.resumeData.resultatPrevisionnel = {
            chiffre_affaires: this.resultatPrevisionnelForm.get('chiffreAffaires')?.value || 0,
            autres_revenus: this.resultatPrevisionnelForm.get('autresRevenus')?.value || 0,
            cout_marchandises: this.resultatPrevisionnelForm.get('coutMarchandises')?.value || 0
        };
    }

    saveChargesActuellesToResume() {
        this.resumeData.chargesActuelles = {
            cout_transport_production: this.chargesActuellesForm.get('coutTransportProduction')?.value || 0,
            frais_transport_personnel: this.chargesActuellesForm.get('fraisTransportPersonnel')?.value || 0,
            frais_manutention: this.chargesActuellesForm.get('fraisManutention')?.value || 0,
            montant_aide_externe: this.chargesActuellesForm.get('montantAideExterne')?.value || 0,
            frais_hebergement_restauration: this.chargesActuellesForm.get('fraisHebergementRestauration')?.value || 0,
            impots: this.chargesActuellesForm.get('impots')?.value || 0,
            loyers: this.chargesActuellesForm.get('loyers')?.value || 0
        };
    }

    saveChargesPrevisionellesToResume() {
        this.resumeData.chargesPrevisionnelles = {
            cout_transport_production: this.chargesPrevisionellesForm.get('coutTransportProduction')?.value || 0,
            frais_transport_personnel: this.chargesPrevisionellesForm.get('fraisTransportPersonnel')?.value || 0,
            frais_manutention: this.chargesPrevisionellesForm.get('fraisManutention')?.value || 0,
            montant_aide_externe: this.chargesPrevisionellesForm.get('montantAideExterne')?.value || 0,
            frais_hebergement_restauration: this.chargesPrevisionellesForm.get('fraisHebergementRestauration')?.value || 0,
            impots: this.chargesPrevisionellesForm.get('impots')?.value || 0,
            loyers: this.chargesPrevisionellesForm.get('loyers')?.value || 0
        };
    }

    saveDemandeCreditToResume() {
        this.resumeData.demandeCredit = {
            montant_demande: this.demandeCreditForm.get('montantDemande')?.value || 0,
            duree_mois: this.demandeCreditForm.get('dureeMois')?.value || 0,
            objet_financement: this.demandeCreditForm.get('objetFinancement')?.value || '',
            delegation: this.demandeCreditForm.get('delegation')?.value?.libele || '',
            agence: this.demandeCreditForm.get('agence')?.value?.libele || '',
            point_vente: this.demandeCreditForm.get('pointVente')?.value?.libele || ''
        };
    }

    prepareSummary() {
        this.saveInfoBaseToResume();
        this.saveBilanEntrepriseToResume();
        this.saveBilanPersonnelToResume();
        this.saveResultatActuelToResume();
        this.saveResultatPrevisionnelToResume();
        this.saveChargesActuellesToResume();
        this.saveChargesPrevisionellesToResume();
        this.saveDemandeCreditToResume();
    }

    // UPDATED: Méthode de mise à jour
    mettreAJourDemande() {
        if (!this.demandeId) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'ID de la demande de crédit non disponible',
                life: 3000
            });
            return;
        }

        this.loading.set(true);

        // Validation des champs obligatoires
        if (!this.infoBaseForm.get('nomPromoteur')?.value || !this.infoBaseForm.get('prenomPromoteur')?.value || !this.infoBaseForm.get('nomEntreprise')?.value) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez remplir tous les champs obligatoires',
                life: 3000
            });
            this.loading.set(false);
            return;
        }

        // Générer les dates de manière plus sûre
        const currentYear = new Date().getFullYear();
        const formatDateSafe = (date: Date | string | null | undefined, defaultDate: Date): string => {
            if (!date) return this.formatDate(defaultDate);
            const formatted = this.formatDate(date);
            return formatted || this.formatDate(defaultDate);
        };

        try {
            const demandeUpdateRequest: DemandeUpdateRequest = {
                // ID de la demande à mettre à jour
                demandeCreditId: this.demandeId,

                // Promoteur - Champs obligatoires
                nomPromoteur: this.infoBaseForm.get('nomPromoteur')?.value?.trim() || '',
                prenomPromoteur: this.infoBaseForm.get('prenomPromoteur')?.value?.trim() || '',
                dateNaissancePromoteur: formatDateSafe(this.infoBaseForm.get('dateNaissance')?.value, new Date(1980, 0, 1)),
                numeroIdentitePromoteur: this.infoBaseForm.get('numeroIdentite')?.value?.trim() || '',
                adressePromoteur: this.infoBaseForm.get('adressePromoteur')?.value?.trim() || '',
                telephonePromoteur: this.infoBaseForm.get('telephonePromoteur')?.value?.trim() || '',
                emailPromoteur: this.infoBaseForm.get('emailPromoteur')?.value?.trim() || '',

                // Entreprise - Champs obligatoires
                nomEntreprise: this.infoBaseForm.get('nomEntreprise')?.value?.trim() || '',
                formeJuridique: this.getFormeJuridiqueValue() || 'EI',
                secteurActivite: this.getSecteurActiviteValue() || 'Commerce',
                dateCreationEntreprise: formatDateSafe(this.infoBaseForm.get('dateCreation')?.value, new Date(currentYear - 2, 0, 1)),
                numeroRegistre: this.infoBaseForm.get('numeroRegistre')?.value?.trim() || '',
                adresseEntreprise: this.infoBaseForm.get('adresseEntreprise')?.value?.trim() || '',
                telephoneEntreprise: this.infoBaseForm.get('telephoneEntreprise')?.value?.trim() || '',
                emailEntreprise: this.infoBaseForm.get('emailEntreprise')?.value?.trim() || '',

                // Bilan entreprise - avec valeurs par défaut sûres
                liquidites: this.bilanEntrepriseForm.get('liquidites')?.value || 0,
                creancesClients: this.bilanEntrepriseForm.get('creancesClients')?.value || 0,
                valeurStocks: this.bilanEntrepriseForm.get('valeurStocks')?.value || 0,
                valeurEquipements: this.bilanEntrepriseForm.get('valeurEquipements')?.value || 0,
                dettesFournisseurs: this.bilanEntrepriseForm.get('dettesFournisseurs')?.value || 0,
                emprunts: this.bilanEntrepriseForm.get('emprunts')?.value || 0,
                capitalPropre: this.bilanEntrepriseForm.get('capitalPropre')?.value || 0,

                // Bilan personnel
                epargnes: this.bilanPersonnelForm.get('epargnes')?.value || 0,
                valeurBiensDurables: this.bilanPersonnelForm.get('valeurBiensDurables')?.value || 0,
                libeleGarantie: this.bilanPersonnelForm.get('libeleGarantie')?.value?.trim() || '',
                montantGarantie: this.bilanPersonnelForm.get('montantGarantie')?.value || 0,

                // Dates des périodes
                dateDebutPeriodeActuel: formatDateSafe(null, new Date(currentYear - 1, 0, 1)),
                dateFinPeriodeActuel: formatDateSafe(null, new Date(currentYear - 1, 11, 31)),
                dateDebutPeriodePrevisionnel: formatDateSafe(null, new Date(currentYear, 0, 1)),
                dateFinPeriodePrevisionnel: formatDateSafe(null, new Date(currentYear, 11, 31)),

                // Exploitation actuelle
                chiffreAffairesActuel: this.resultatActuelForm.get('chiffreAffaires')?.value || 0,
                autresRevenusActuel: this.resultatActuelForm.get('autresRevenus')?.value || 0,
                coutMarchandisesActuel: this.resultatActuelForm.get('coutMarchandises')?.value || 0,
                coutTransportProductionActuel: this.chargesActuellesForm.get('coutTransportProduction')?.value || 0,
                fraisTransportPersonnelActuel: this.chargesActuellesForm.get('fraisTransportPersonnel')?.value || 0,
                fraisManutentionActuel: this.chargesActuellesForm.get('fraisManutention')?.value || 0,
                montantAideExterneActuel: this.chargesActuellesForm.get('montantAideExterne')?.value || 0,
                fraisHebergementRestaurationActuel: this.chargesActuellesForm.get('fraisHebergementRestauration')?.value || 0,
                impotsActuel: this.chargesActuellesForm.get('impots')?.value || 0,
                loyersActuel: this.chargesActuellesForm.get('loyers')?.value || 0,

                // Exploitation prévisionnelle
                chiffreAffairesPrevisionnel: this.resultatPrevisionnelForm.get('chiffreAffaires')?.value || 0,
                autresRevenusPrevisionnel: this.resultatPrevisionnelForm.get('autresRevenus')?.value || 0,
                coutMarchandisesPrevisionnel: this.resultatPrevisionnelForm.get('coutMarchandises')?.value || 0,
                coutTransportProductionPrevisionnel: this.chargesPrevisionellesForm.get('coutTransportProduction')?.value || 0,
                fraisTransportPersonnelPrevisionnel: this.chargesPrevisionellesForm.get('fraisTransportPersonnel')?.value || 0,
                fraisManutentionPrevisionnel: this.chargesPrevisionellesForm.get('fraisManutention')?.value || 0,
                montantAideExternePrevisionnel: this.chargesPrevisionellesForm.get('montantAideExterne')?.value || 0,
                fraisHebergementRestaurationPrevisionnel: this.chargesPrevisionellesForm.get('fraisHebergementRestauration')?.value || 0,
                impotsPrevisionnel: this.chargesPrevisionellesForm.get('impots')?.value || 0,
                loyersPrevisionnel: this.chargesPrevisionellesForm.get('loyers')?.value || 0,

                // Demande crédit
                montantDemande: this.demandeCreditForm.get('montantDemande')?.value || 0,
                dureeMois: this.demandeCreditForm.get('dureeMois')?.value || 12,
                objetFinancement: this.demandeCreditForm.get('objetFinancement')?.value?.trim() || '',

                // Cautions
                cautions: this.personnecautions || [],

                // Location IDs - avec vérification de validité
                delegationId: this.demandeCreditForm.get('delegation')?.value?.id ? Number(this.demandeCreditForm.get('delegation')?.value?.id) : undefined,
                agenceId: this.demandeCreditForm.get('agence')?.value?.id ? Number(this.demandeCreditForm.get('agence')?.value?.id) : undefined,
                pointVenteId: this.demandeCreditForm.get('pointVente')?.value?.id ? Number(this.demandeCreditForm.get('pointVente')?.value?.id) : undefined,
                userId: this.state().currentDemandeData?.demande?.userId || undefined
            };

            console.log('Données de mise à jour préparées:', JSON.stringify(demandeUpdateRequest, null, 2));

            // Appel de l'API de mise à jour
            this.analyseCreditService
                .updateAnalyseComplet$(demandeUpdateRequest)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (response: IResponse) => {
                        this.loading.set(false);
                        console.log('Réponse de mise à jour:', response);

                        if (response && (response.data?.success || response.code === 200)) {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Succès',
                                detail: 'Votre demande de crédit a été mise à jour avec succès!'
                            });
                            setTimeout(() => {
                                this.router.navigate(['/dashboards']);
                            }, 2000);
                        } else {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Erreur',
                                detail: response.message || 'Erreur lors de la mise à jour de la demande.'
                            });
                        }
                    },
                    error: (error) => {
                        this.loading.set(false);
                        console.error('Erreur lors de la mise à jour:', error);

                        let errorMessage = 'Erreur lors de la mise à jour de la demande.';
                        if (error.error?.message) {
                            errorMessage = error.error.message;
                        } else if (error.message) {
                            errorMessage = error.message;
                        }

                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: errorMessage
                        });
                    }
                });
        } catch (error) {
            this.loading.set(false);
            console.error('Erreur lors de la préparation des données:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Erreur lors de la préparation des données'
            });
        }
    }

    // Méthodes de calcul (identiques au composant original)
    calculerRevenusTotauxActuel(): number {
        const chiffreAffaires = this.resultatActuelForm.get('chiffreAffaires')?.value || 0;
        const autresRevenus = this.resultatActuelForm.get('autresRevenus')?.value || 0;
        return chiffreAffaires + autresRevenus;
    }

    calculerRevenusTotauxPrevisionnel(): number {
        const chiffreAffaires = this.resultatPrevisionnelForm.get('chiffreAffaires')?.value || 0;
        const autresRevenus = this.resultatPrevisionnelForm.get('autresRevenus')?.value || 0;
        return chiffreAffaires + autresRevenus;
    }

    calculerRatioDependanceActuel(): number {
        const revenus = this.calculerRevenusTotauxActuel();
        const autresRevenus = this.resultatActuelForm.get('autresRevenus')?.value || 0;
        return revenus > 0 ? autresRevenus / revenus : 0;
    }

    calculerRatioDependancePrevisionnel(): number {
        const revenus = this.calculerRevenusTotauxPrevisionnel();
        const autresRevenus = this.resultatPrevisionnelForm.get('autresRevenus')?.value || 0;
        return revenus > 0 ? autresRevenus / revenus : 0;
    }

    calculerMargeButeActuelle(): number {
        const revenus = this.calculerRevenusTotauxActuel();
        const coutMarchandises = this.resultatActuelForm.get('coutMarchandises')?.value || 0;
        return revenus > 0 ? (revenus - coutMarchandises) / revenus : 0;
    }

    calculerMargeButePrevisionnelle(): number {
        const revenus = this.calculerRevenusTotauxPrevisionnel();
        const coutMarchandises = this.resultatPrevisionnelForm.get('coutMarchandises')?.value || 0;
        return revenus > 0 ? (revenus - coutMarchandises) / revenus : 0;
    }

    calculerTotalActif(): number {
        const liquidites = this.bilanEntrepriseForm.get('liquidites')?.value || 0;
        const creancesClients = this.bilanEntrepriseForm.get('creancesClients')?.value || 0;
        const valeurStocks = this.bilanEntrepriseForm.get('valeurStocks')?.value || 0;
        const valeurEquipements = this.bilanEntrepriseForm.get('valeurEquipements')?.value || 0;

        return liquidites + creancesClients + valeurStocks + valeurEquipements;
    }

    calculerTotalPassif(): number {
        const dettesFournisseurs = this.bilanEntrepriseForm.get('dettesFournisseurs')?.value || 0;
        const emprunts = this.bilanEntrepriseForm.get('emprunts')?.value || 0;
        const capitalPropre = this.bilanEntrepriseForm.get('capitalPropre')?.value || 0;

        return dettesFournisseurs + emprunts + capitalPropre;
    }

    calculerRatioLiquidite(): number {
        const liquidites = this.bilanEntrepriseForm.get('liquidites')?.value || 0;
        const dettesFournisseurs = this.bilanEntrepriseForm.get('dettesFournisseurs')?.value || 0;
        const emprunts = this.bilanEntrepriseForm.get('emprunts')?.value || 0;

        const totalDettes = dettesFournisseurs + emprunts;

        return totalDettes > 0 ? liquidites / totalDettes : 0;
    }

    getFormeJuridiqueValue(): string {
        const value = this.infoBaseForm.get('formeJuridique')?.value;
        if (!value) return '';

        if (typeof value === 'object' && value.value) {
            return value.value;
        }

        return value;
    }

    getSecteurActiviteValue(): string {
        const value = this.infoBaseForm.get('secteurActivite')?.value;
        if (!value) return '';

        if (typeof value === 'object' && value.value) {
            return value.value;
        }

        return value;
    }

    calculerMensualite(): number {
        const montant = this.demandeCreditForm.get('montantDemande')?.value || 0;
        const duree = this.demandeCreditForm.get('dureeMois')?.value || 1;
        return montant / duree;
    }

    formatDateForDisplay(date: Date | string | null): string {
        if (!date) return '';

        let dateObj: Date;

        if (typeof date === 'string') {
            dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) {
                return date;
            }
        } else if (date instanceof Date) {
            dateObj = date;
        } else {
            return '';
        }

        return dateObj.toLocaleDateString('fr-FR');
    }

    formatDate(date: Date | string | null | undefined): string {
        if (!date) {
            return ''; // Retourner une chaîne vide au lieu de null pour satisfaire le type string
        }

        let dateObj: Date;

        if (typeof date === 'string') {
            // Si c'est déjà une chaîne au format ISO, la retourner directement si elle est valide
            if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
                return date; // Format déjà correct
            }
            dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) {
                return ''; // Date invalide
            }
        } else if (date instanceof Date) {
            dateObj = date;
            if (isNaN(dateObj.getTime())) {
                return ''; // Date invalide
            }
        } else {
            return '';
        }

        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    calculerTotalChargesActuelles(): number {
        const coutTransportProduction = this.chargesActuellesForm.get('coutTransportProduction')?.value || 0;
        const fraisTransportPersonnel = this.chargesActuellesForm.get('fraisTransportPersonnel')?.value || 0;
        const fraisManutention = this.chargesActuellesForm.get('fraisManutention')?.value || 0;
        const montantAideExterne = this.chargesActuellesForm.get('montantAideExterne')?.value || 0;
        const fraisHebergementRestauration = this.chargesActuellesForm.get('fraisHebergementRestauration')?.value || 0;
        const impots = this.chargesActuellesForm.get('impots')?.value || 0;
        const loyers = this.chargesActuellesForm.get('loyers')?.value || 0;

        return coutTransportProduction + fraisTransportPersonnel + fraisManutention + montantAideExterne + fraisHebergementRestauration + impots + loyers;
    }

    calculerTotalChargesPrevisionnelles(): number {
        const coutTransportProduction = this.chargesPrevisionellesForm.get('coutTransportProduction')?.value || 0;
        const fraisTransportPersonnel = this.chargesPrevisionellesForm.get('fraisTransportPersonnel')?.value || 0;
        const fraisManutention = this.chargesPrevisionellesForm.get('fraisManutention')?.value || 0;
        const montantAideExterne = this.chargesPrevisionellesForm.get('montantAideExterne')?.value || 0;
        const fraisHebergementRestauration = this.chargesPrevisionellesForm.get('fraisHebergementRestauration')?.value || 0;
        const impots = this.chargesPrevisionellesForm.get('impots')?.value || 0;
        const loyers = this.chargesPrevisionellesForm.get('loyers')?.value || 0;

        return coutTransportProduction + fraisTransportPersonnel + fraisManutention + montantAideExterne + fraisHebergementRestauration + impots + loyers;
    }

    calculerRatioCreditCA(): number {
        const montantDemande = this.demandeCreditForm.get('montantDemande')?.value || 0;
        const chiffreAffairesPrevisionnel = this.resultatPrevisionnelForm.get('chiffreAffaires')?.value || 0;

        return chiffreAffairesPrevisionnel > 0 ? montantDemande / chiffreAffairesPrevisionnel : 0;
    }

    getRatioCreditCASeverity(): PrimeSeverity {
        const ratio = this.calculerRatioCreditCA();

        if (ratio <= 0.5) return 'success';
        if (ratio <= 1) return 'info';
        if (ratio <= 1.5) return 'warn';
        return 'danger';
    }

    getMarginSeverity(margin: number): PrimeSeverity {
        if (margin >= 0.4) return 'success';
        if (margin >= 0.25) return 'info';
        if (margin >= 0.15) return 'warn';
        return 'danger';
    }

    getLiquiditySeverity(ratio: number): PrimeSeverity {
        if (ratio > 2) return 'success';
        if (ratio > 1.2) return 'info';
        if (ratio > 0.8) return 'warn';
        return 'danger';
    }
}
