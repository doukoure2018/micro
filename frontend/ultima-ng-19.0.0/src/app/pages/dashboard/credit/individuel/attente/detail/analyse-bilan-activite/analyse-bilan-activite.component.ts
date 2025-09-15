import { Agence } from '@/interface/agence';
import { Delegation } from '@/interface/delegation';
import { PointVente } from '@/interface/point.vente';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { IResponse } from '@/interface/response';
import { TextareaModule } from 'primeng/textarea';
import { InputGroupModule } from 'primeng/inputgroup';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { ListboxModule } from 'primeng/listbox';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { DemandeCreditCompleteDTO } from '@/interface/demandeCreditComplete';
import { Personnecaution } from '@/interface/personnecaution';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@/service/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';

interface ComponentState {
    loading: boolean;
    allDelegations: Delegation[];
    allAgences: Agence[];
    allPointsVente: PointVente[];
    filteredAgences: Agence[];
    filteredPointsVente: PointVente[];
    demandeIndividuel: any;
    userId: number | null;
    natureClient: 'Individuel' | 'Entreprise';
}

@Component({
    selector: 'app-analyse-bilan-activite',
    imports: [
        CommonModule,
        TextareaModule,
        InputGroupModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        InputNumberModule,
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
        DatePickerModule,
        SelectModule
    ],
    templateUrl: './analyse-bilan-activite.component.html',
    styleUrl: './analyse-bilan-activite.component.scss',
    providers: [MessageService]
})
export class AnalyseBilanActiviteComponent {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);
    private analyseCreditService = inject(UserService);
    private route = inject(ActivatedRoute);

    state = signal<ComponentState>({
        loading: false,
        allDelegations: [],
        allAgences: [],
        allPointsVente: [],
        filteredAgences: [],
        filteredPointsVente: [],
        demandeIndividuel: null,
        userId: null,
        natureClient: 'Individuel' // Default value
    });

    activeIndex = signal<number>(0);
    items = signal<MenuItem[]>([]);
    loading = signal<boolean>(false);

    // Forms for each step
    infoBaseForm!: FormGroup;
    bilanEntrepriseForm!: FormGroup;
    bilanPersonnelForm!: FormGroup;
    resultatActuelForm!: FormGroup;
    resultatPrevisionnelForm!: FormGroup;
    chargesActuellesForm!: FormGroup;
    chargesPrevisionellesForm!: FormGroup;
    demandeCreditForm!: FormGroup;
    personnecautionForm!: FormGroup;

    formeJuridiques = [
        { label: 'SARL', value: 'SARL' },
        { label: 'SA', value: 'SA' },
        { label: 'EI', value: 'EI' },
        { label: 'EIRL', value: 'EIRL' },
        { label: 'SNC', value: 'SNC' }
    ];

    personnecautions: Personnecaution[] = [];
    resumeData: any = {};
    demandeIndividuelId: number | null = null;

    ngOnInit() {
        // Initialize forms FIRST - before any data loading
        this.initForms();
        this.initStepItems();

        // Extract demandeIndividuelId from route
        this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            this.demandeIndividuelId = params['demandeindividuelId'] ? parseInt(params['demandeindividuelId'], 10) : null;
            console.log('DemandeIndividuel ID from route:', this.demandeIndividuelId);

            if (!this.demandeIndividuelId) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: "ID de la demande individuelle manquant dans l'URL",
                    life: 3000
                });
                return;
            }

            this.loadAllData();
        });
    }

    private loadAllData(): void {
        this.state.update((state) => ({ ...state, loading: true }));

        // Load both initial data and demande individuelle
        forkJoin({
            initialData: this.analyseCreditService.startNewDemandeInd$(),
            demandeData: this.analyseCreditService.getDemandeWithGaranties$(this.demandeIndividuelId!)
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (responses) => {
                    console.log('All data loaded:', responses);

                    // Process initial data
                    if (responses.initialData?.data) {
                        this.state.update((state) => ({
                            ...state,
                            allDelegations: responses.initialData.data.delegations || [],
                            allAgences: responses.initialData.data.agences || [],
                            allPointsVente: responses.initialData.data.pointVentes || []
                        }));
                    }

                    // Process demande data
                    if (responses.demandeData?.data) {
                        const demandeIndividuel = responses.demandeData.data.demandeIndividuel;
                        const userId = responses.demandeData.data.user?.userId!;
                        const natureClient: 'Individuel' | 'Entreprise' = demandeIndividuel.natureClient === 'Entreprise' ? 'Entreprise' : 'Individuel';

                        this.state.update((state) => ({
                            ...state,
                            demandeIndividuel,
                            userId,
                            natureClient,
                            loading: false
                        }));

                        // Update form validators based on nature client
                        this.updateFormValidators(natureClient);

                        // Prefill forms with demande data
                        this.prefillFormsWithDemande(demandeIndividuel);
                    }
                },
                error: (error) => {
                    console.error('Error loading data:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger les données',
                        life: 3000
                    });
                    this.state.update((state) => ({ ...state, loading: false }));
                }
            });
    }

    private updateFormValidators(natureClient: string): void {
        if (natureClient === 'Individuel') {
            // Remove validators for enterprise fields
            this.infoBaseForm.get('nomEntreprise')?.clearValidators();
            this.infoBaseForm.get('nomEntreprise')?.updateValueAndValidity();

            // Disable enterprise fields
            this.infoBaseForm.get('nomEntreprise')?.disable();
            this.infoBaseForm.get('formeJuridique')?.disable();
            this.infoBaseForm.get('dateCreation')?.disable();
            this.infoBaseForm.get('numeroRegistre')?.disable();
            this.infoBaseForm.get('adresseEntreprise')?.disable();
            this.infoBaseForm.get('telephoneEntreprise')?.disable();
            this.infoBaseForm.get('emailEntreprise')?.disable();
        } else {
            // Enable enterprise fields for 'Entreprise' type
            this.infoBaseForm.get('nomEntreprise')?.setValidators([Validators.required]);
            this.infoBaseForm.get('nomEntreprise')?.updateValueAndValidity();

            this.infoBaseForm.get('nomEntreprise')?.enable();
            this.infoBaseForm.get('formeJuridique')?.enable();
            this.infoBaseForm.get('dateCreation')?.enable();
            this.infoBaseForm.get('numeroRegistre')?.enable();
            this.infoBaseForm.get('adresseEntreprise')?.enable();
            this.infoBaseForm.get('telephoneEntreprise')?.enable();
            this.infoBaseForm.get('emailEntreprise')?.enable();
        }
    }

    private prefillFormsWithDemande(demande: any): void {
        if (!demande) return;

        // Add safety check for forms
        if (!this.infoBaseForm || !this.bilanPersonnelForm || !this.demandeCreditForm) {
            console.error('Forms not initialized');
            return;
        }

        // Convert date array to Date object
        const convertDateArray = (dateArray: number[]): Date | null => {
            if (!dateArray || dateArray.length < 3) return null;
            return new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
        };

        // Prefill info base form
        this.infoBaseForm.patchValue({
            nomPromoteur: demande.nom,
            prenomPromoteur: demande.prenom,
            dateNaissance: convertDateArray(demande.dateNaissance),
            numeroIdentite: demande.numId,
            adressePromoteur: demande.addresseDomicileContact,
            telephonePromoteur: demande.telephone,
            secteurActivite: demande.descriptionActivite,
            adresseEntreprise: demande.adresseLieuActivite
        });

        // Disable prefilled fields
        this.infoBaseForm.get('nomPromoteur')?.disable();
        this.infoBaseForm.get('prenomPromoteur')?.disable();
        this.infoBaseForm.get('dateNaissance')?.disable();
        this.infoBaseForm.get('numeroIdentite')?.disable();
        this.infoBaseForm.get('telephonePromoteur')?.disable();
        this.infoBaseForm.get('secteurActivite')?.disable();

        // Calculate guarantee values
        if (demande.garanties && demande.garanties.length > 0) {
            const totalValeurGarantie = demande.garanties.reduce((sum: number, g: any) => sum + (g.valeurGarantie || 0), 0);
            const totalValeurEmprunte = demande.garanties.reduce((sum: number, g: any) => sum + (g.valeurEmprunte || 0), 0);
            const libeleGarantie = demande.garanties
                .map((g: any) => g.descriptionGarantie)
                .filter((d: string) => d)
                .join(', ');

            this.bilanPersonnelForm.patchValue({
                valeurBiensDurables: totalValeurGarantie,
                libeleGarantie: libeleGarantie,
                montantGarantie: totalValeurEmprunte
            });
        }

        // Prefill demande credit form
        this.demandeCreditForm.patchValue({
            montantDemande: demande.montantDemande,
            dureeMois: demande.dureeDemande,
            objetFinancement: demande.detailObjectCredit
        });

        // Set delegation, agence, and point vente
        if (demande.delegation) {
            const delegation = this.state().allDelegations.find((d) => d.id === demande.delegation);
            if (delegation) {
                this.demandeCreditForm.patchValue({ delegation });
                this.onDelegationChange({ value: delegation });

                // Set agence after delegation is set
                setTimeout(() => {
                    if (demande.agence) {
                        const agence = this.state().filteredAgences.find((a) => a.id === demande.agence);
                        if (agence) {
                            this.demandeCreditForm.patchValue({ agence });
                            this.onAgenceChange({ value: agence });

                            // Set point vente after agence is set
                            setTimeout(() => {
                                if (demande.pos) {
                                    const pointVente = this.state().filteredPointsVente.find((p) => p.id === demande.pos);
                                    if (pointVente) {
                                        this.demandeCreditForm.patchValue({ pointVente });
                                    }
                                }
                            }, 100);
                        }
                    }
                }, 100);
            }
        }

        // Disable location fields
        this.demandeCreditForm.get('objetFinancement')?.disable();
        this.demandeCreditForm.get('delegation')?.disable();
        this.demandeCreditForm.get('agence')?.disable();
        this.demandeCreditForm.get('pointVente')?.disable();
    }

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

    initForms() {
        // Info base form - email not required anymore
        this.infoBaseForm = this.fb.group({
            nomPromoteur: [''],
            prenomPromoteur: [''],
            dateNaissance: [null],
            numeroIdentite: [''],
            adressePromoteur: [''],
            telephonePromoteur: [''],
            emailPromoteur: [''], // No email validation required
            nomEntreprise: ['', Validators.required], // Will be updated based on natureClient
            formeJuridique: [''],
            secteurActivite: [''],
            dateCreation: [null],
            numeroRegistre: [''],
            adresseEntreprise: [''],
            telephoneEntreprise: [''],
            emailEntreprise: [''] // No email validation required
        });

        // Bilan entreprise
        this.bilanEntrepriseForm = this.fb.group({
            liquidites: [0],
            creancesClients: [0],
            valeurStocks: [0],
            valeurEquipements: [0],
            dettesFournisseurs: [0],
            emprunts: [0],
            capitalPropre: [0]
        });

        // Bilan personnel
        this.bilanPersonnelForm = this.fb.group({
            epargnes: [0],
            valeurBiensDurables: [0],
            libeleGarantie: [''],
            montantGarantie: [0]
        });

        // Résultats actuels
        this.resultatActuelForm = this.fb.group({
            chiffreAffaires: [0],
            autresRevenus: [0],
            coutMarchandises: [0]
        });

        // Résultats prévisionnels
        this.resultatPrevisionnelForm = this.fb.group({
            chiffreAffaires: [0],
            autresRevenus: [0],
            coutMarchandises: [0]
        });

        // Charges actuelles
        this.chargesActuellesForm = this.fb.group({
            coutTransportProduction: [0],
            fraisTransportPersonnel: [0],
            fraisManutention: [0],
            montantAideExterne: [0],
            fraisHebergementRestauration: [0],
            impots: [0],
            loyers: [0]
        });

        // Charges prévisionnelles
        this.chargesPrevisionellesForm = this.fb.group({
            coutTransportProduction: [0],
            fraisTransportPersonnel: [0],
            fraisManutention: [0],
            montantAideExterne: [0],
            fraisHebergementRestauration: [0],
            impots: [0],
            loyers: [0]
        });

        // Demande credit form
        this.demandeCreditForm = this.fb.group({
            montantDemande: [0],
            dureeMois: [12],
            objetFinancement: [''],
            delegation: [null],
            agence: [null],
            pointVente: [null]
        });

        // Personne caution form
        this.personnecautionForm = this.fb.group({
            nom: [''],
            prenom: [''],
            telephone: [''],
            activite: [''],
            age: [null],
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

    validateCurrentForm(): boolean {
        const currentIndex = this.activeIndex();
        const natureClient = this.state().natureClient;

        switch (currentIndex) {
            case 0: // Info base
                // Only validate enterprise name if natureClient is 'Entreprise'
                if (natureClient === 'Entreprise' && this.infoBaseForm.get('nomEntreprise')?.invalid) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: "Le nom de l'entreprise est requis."
                    });
                    return false;
                }
                this.saveInfoBaseToResume();
                break;
            case 1:
                this.saveBilanEntrepriseToResume();
                break;
            case 2:
                this.saveBilanPersonnelToResume();
                break;
            case 3:
                this.saveResultatActuelToResume();
                break;
            case 4:
                this.saveResultatPrevisionnelToResume();
                break;
            case 5:
                this.saveChargesActuellesToResume();
                break;
            case 6:
                this.saveChargesPrevisionellesToResume();
                break;
            case 7:
                this.saveDemandeCreditToResume();
                break;
            case 8:
                // Personnes caution - optional
                break;
        }

        return true;
    }

    onDelegationChange(event: any): void {
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
        const filteredAgences = this.state().allAgences?.filter((agence) => agence.delegation_id === delegationId) || [];

        this.state.update((state) => ({
            ...state,
            filteredAgences,
            filteredPointsVente: []
        }));

        if (!this.demandeCreditForm.get('delegation')?.disabled) {
            this.demandeCreditForm.patchValue({
                agence: null,
                pointVente: null
            });
        }
    }

    onAgenceChange(event: any): void {
        const agence = event.value;
        if (!agence || !agence.id) {
            this.state.update((state) => ({
                ...state,
                filteredPointsVente: []
            }));
            return;
        }

        const agenceId = agence.id;
        const filteredPointsVente = this.state().allPointsVente?.filter((pointVente) => pointVente.agence_id === agenceId) || [];

        this.state.update((state) => ({
            ...state,
            filteredPointsVente
        }));

        if (!this.demandeCreditForm.get('agence')?.disabled) {
            this.demandeCreditForm.patchValue({
                pointVente: null
            });
        }
    }

    addPersonnecaution(): void {
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

    saveInfoBaseToResume() {
        const getValue = (controlName: string) => {
            const control = this.infoBaseForm.get(controlName);
            return control?.disabled ? control.value : control?.value;
        };

        this.resumeData.promoteur = {
            nom: getValue('nomPromoteur') || '',
            prenom: getValue('prenomPromoteur') || '',
            date_naissance: this.formatDate(getValue('dateNaissance')),
            numero_identite: getValue('numeroIdentite') || '',
            adresse: getValue('adressePromoteur') || '',
            telephone: getValue('telephonePromoteur') || '',
            email: getValue('emailPromoteur') || ''
        };

        // Only save enterprise data if natureClient is 'Entreprise'
        if (this.state().natureClient === 'Entreprise') {
            this.resumeData.entreprise = {
                nom: getValue('nomEntreprise') || '',
                forme_juridique: this.getFormeJuridiqueValue() || '',
                secteur_activite: getValue('secteurActivite') || '',
                date_creation: this.formatDate(getValue('dateCreation')),
                numero_registre: getValue('numeroRegistre') || '',
                adresse: getValue('adresseEntreprise') || '',
                telephone: getValue('telephoneEntreprise') || '',
                email: getValue('emailEntreprise') || ''
            };
        } else {
            this.resumeData.entreprise = null;
        }
    }

    // Rest of the save methods remain the same...
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
        const getValue = (controlName: string) => {
            const control = this.demandeCreditForm.get(controlName);
            return control?.disabled ? control.value : control?.value;
        };

        this.resumeData.demandeCredit = {
            montant_demande: getValue('montantDemande') || 0,
            duree_mois: getValue('dureeMois') || 0,
            objet_financement: getValue('objetFinancement') || '',
            delegation: getValue('delegation')?.libele || '',
            agence: getValue('agence')?.libele || '',
            point_vente: getValue('pointVente')?.libele || ''
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

    finaliserDemande() {
        if (!this.demandeIndividuelId) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'ID de la demande individuelle non disponible',
                life: 3000
            });
            return;
        }

        this.loading.set(true);

        const currentYear = new Date().getFullYear();
        const dateDebutActuel = new Date(currentYear - 1, 0, 1);
        const dateFinActuel = new Date(currentYear - 1, 11, 31);
        const dateDebutPrevisionnel = new Date(currentYear, 0, 1);
        const dateFinPrevisionnel = new Date(currentYear, 11, 31);

        const formatDateSafe = (date: Date): string => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const getFormValue = (form: FormGroup, field: string, defaultValue: any = '') => {
            const control = form.get(field);
            return control?.disabled ? control.value : control?.value || defaultValue;
        };

        const natureClient = this.state().natureClient;

        // Créer un nom d'entreprise par défaut pour les clients individuels
        let nomEntreprise: string;
        let formeJuridique: string;

        const prenomPromoteur = getFormValue(this.infoBaseForm, 'prenomPromoteur', '');
        const nomPromoteur = getFormValue(this.infoBaseForm, 'nomPromoteur', '');

        if (natureClient === 'Individuel') {
            nomEntreprise = `Entreprise de ${prenomPromoteur} ${nomPromoteur}`.trim();
            if (nomEntreprise === 'Entreprise de ') {
                nomEntreprise = 'Entreprise Individuelle';
            }
            formeJuridique = 'EI';
        } else {
            nomEntreprise = getFormValue(this.infoBaseForm, 'nomEntreprise', 'Entreprise');
            formeJuridique = this.getFormeJuridiqueValue() || 'EI';
        }

        const demandeComplete: DemandeCreditCompleteDTO = {
            demandeIndividuelId: this.demandeIndividuelId,

            // Promoteur
            nomPromoteur: nomPromoteur || 'Non spécifié',
            prenomPromoteur: prenomPromoteur || 'Non spécifié',
            dateNaissancePromoteur: this.formatDate(getFormValue(this.infoBaseForm, 'dateNaissance')) || formatDateSafe(new Date(1980, 0, 1)),
            numeroIdentitePromoteur: getFormValue(this.infoBaseForm, 'numeroIdentite', ''),
            adressePromoteur: getFormValue(this.infoBaseForm, 'adressePromoteur', ''),
            telephonePromoteur: getFormValue(this.infoBaseForm, 'telephonePromoteur', ''),
            emailPromoteur: getFormValue(this.infoBaseForm, 'emailPromoteur', '') || null,

            // Entreprise - JAMAIS null ou undefined
            nomEntreprise: nomEntreprise,
            formeJuridique: formeJuridique,
            secteurActivite: getFormValue(this.infoBaseForm, 'secteurActivite', 'Commerce'),
            dateCreationEntreprise: this.formatDate(getFormValue(this.infoBaseForm, 'dateCreation')) || '',
            numeroRegistre: getFormValue(this.infoBaseForm, 'numeroRegistre', '') || null,
            adresseEntreprise: getFormValue(this.infoBaseForm, 'adresseEntreprise', '') || getFormValue(this.infoBaseForm, 'adressePromoteur', '') || null,
            telephoneEntreprise: getFormValue(this.infoBaseForm, 'telephoneEntreprise', '') || null,
            emailEntreprise: getFormValue(this.infoBaseForm, 'emailEntreprise', '') || null,

            // Bilan entreprise
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
            libeleGarantie: this.bilanPersonnelForm.get('libeleGarantie')?.value || '',
            montantGarantie: this.bilanPersonnelForm.get('montantGarantie')?.value || 0,

            // Dates
            dateDebutPeriodeActuel: formatDateSafe(dateDebutActuel),
            dateFinPeriodeActuel: formatDateSafe(dateFinActuel),
            dateDebutPeriodePrevisionnel: formatDateSafe(dateDebutPrevisionnel),
            dateFinPeriodePrevisionnel: formatDateSafe(dateFinPrevisionnel),

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
            montantDemande: getFormValue(this.demandeCreditForm, 'montantDemande', 60000000),
            dureeMois: getFormValue(this.demandeCreditForm, 'dureeMois', 12),
            objetFinancement: getFormValue(this.demandeCreditForm, 'objetFinancement', 'Fond commerce'),

            // Personnecautions
            personnecautions: this.personnecautions || [],

            // Location IDs - Correction importante ici
            delegationId: 1, // Forcer les valeurs pour le test
            agenceId: 1,
            pointVenteId: 1,
            userId: this.state().userId || 3
        };

        // Debug complet
        console.log('=== DONNÉES ENVOYÉES ===');
        console.log('Nature client:', natureClient);
        console.log('Nom entreprise:', demandeComplete.nomEntreprise);
        console.log('Forme juridique:', demandeComplete.formeJuridique);
        console.log('Personnecautions:', JSON.stringify(demandeComplete.personnecautions));
        console.log('Demande complète:', JSON.stringify(demandeComplete, null, 2));

        this.analyseCreditService
            .submitCompleteDemande$(demandeComplete)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: any) => {
                    this.loading.set(false);

                    // Debug de la réponse
                    console.log('=== RÉPONSE REÇUE ===');
                    console.log('Response complète:', response);
                    console.log('Response.data:', response?.data);
                    console.log('Response.data.demande:', response?.data?.demande);
                    console.log('Response.data.demande.success:', response?.data?.demande?.success);

                    // Vérifier la bonne structure de réponse
                    const isSuccess = response?.data?.demande?.success === true || response?.success === true || response?.data?.success === true || response?.code === 0 || response?.statusCode === 200;

                    if (isSuccess) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: response?.data?.demande?.message || 'Votre demande de crédit a été soumise avec succès!',
                            life: 3000
                        });

                        // Redirection après 2 secondes
                        console.log('Redirection vers /dashboards dans 2 secondes...');
                        setTimeout(() => {
                            console.log('Redirection en cours...');
                            this.router.navigate(['/dashboards']).then(
                                (success) => console.log('Navigation réussie:', success),
                                (error) => console.error('Erreur de navigation:', error)
                            );
                        }, 2000);
                    } else {
                        // Gestion de l'échec
                        console.log('Réponse non-succès:', response);
                        const errorMessage = response?.data?.demande?.message || response?.data?.error || response?.message || 'La demande a été traitée mais nécessite une vérification';

                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Attention',
                            detail: errorMessage,
                            life: 5000
                        });
                    }
                },
                error: (error: any) => {
                    this.loading.set(false);

                    console.error('=== ERREUR ===');
                    console.error('Erreur complète:', error);
                    console.error('Error.error:', error?.error);
                    console.error('Error.message:', error?.message);

                    const errorMessage = error?.error?.message || error?.error?.data?.error || error?.message || 'Erreur lors de la soumission de la demande';

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: errorMessage,
                        life: 5000
                    });
                }
            });
    }

    // Calculation methods remain the same...
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

    getFormeJuridiqueValue(): string {
        const value = this.infoBaseForm.get('formeJuridique')?.value;
        if (!value) return '';
        if (typeof value === 'object' && value.value) {
            return value.value;
        }
        return value;
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
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        let dateObj: Date;
        if (typeof date === 'string') {
            if (date.trim() === '') {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }
            dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }
        } else if (date instanceof Date) {
            dateObj = date;
            if (isNaN(dateObj.getTime())) {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }
        } else {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Helper method to check if enterprise section should be shown
    isEnterpriseSection(): boolean {
        return this.state().natureClient === 'Entreprise';
    }
}
