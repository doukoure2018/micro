import { Agence } from '@/interface/agence';
import { Delegation } from '@/interface/delegation';
import { DemandeIndividuel } from '@/interface/demande-individuel.interface';
import { PointVente } from '@/interface/point.vente';
import { IResponse } from '@/interface/response';
import { TypeCreditDto } from '@/interface/typeCredit.model';
import { UserService } from '@/service/user.service';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-demande-ind',
    imports: [InputText, TextareaModule, FileUploadModule, FormsModule, ButtonModule, InputGroupModule, RippleModule, MessageModule, ProgressSpinnerModule, PasswordModule, DropdownModule, InputNumberModule, ToastModule],
    templateUrl: './demande-ind.component.html',
    providers: [MessageService]
})
export class DemandeIndComponent {
    state = signal<{
        typeCreditos?: TypeCreditDto[];
        clientData?: any;
        allDelegations?: Delegation[];
        allAgences?: Agence[];
        allPointsVente?: PointVente[];
        // Filtered data based on selections
        filteredAgences?: Agence[];
        filteredPointsVente?: PointVente[];
        loading: boolean;
        submitting: boolean;
        message: string | undefined;
        error: string | any;
    }>({
        loading: false,
        submitting: false,
        message: undefined,
        error: undefined,
        allDelegations: [],
        allAgences: [],
        allPointsVente: [],
        filteredAgences: [],
        filteredPointsVente: []
    });

    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private destroyRef = inject(DestroyRef);
    private creditService = inject(UserService);
    private messageService = inject(MessageService);

    ngOnInit(): void {
        console.log('this demande credit');

        this.loadInitialData();
        this.activatedRoute.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const codeClient = params['codeClient'];
            if (codeClient) {
                console.log('Code client:', codeClient);
                this.loadClientData(codeClient);
            }
        });
    }

    private loadClientData(codeClient: string): void {
        this.creditService
            .searchClientes$(codeClient)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    if (response.data && response.data.clientes) {
                        this.state.update((state) => ({
                            ...state,
                            clientData: response.data.clientes
                        }));
                    }
                },
                error: (error) => {
                    console.error('Error loading client data:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger les données du client',
                        life: 3000
                    });
                }
            });
    }

    private loadInitialData(): void {
        this.state.update((state) => ({ ...state, loading: true }));

        this.creditService
            .startNewDemandeInd$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    console.log('Initial data loaded:', response);
                    if (response.data) {
                        this.state.update((state) => ({
                            ...state,
                            loading: false,
                            allDelegations: response.data.delegations || [],
                            allAgences: response.data.agences || [],
                            allPointsVente: response.data.pointVentes || [],
                            typeCreditos: response.data.typeCreditos || this.getDefaultCreditTypes()
                        }));
                    }
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
                        loading: false,
                        typeCreditos: this.getDefaultCreditTypes()
                    }));
                }
            });
    }

    private getDefaultCreditTypes(): TypeCreditDto[] {
        // Fallback credit types in case the API doesn't return them
        const creditTypes = [
            { tip_CREDITO: 1, des_TIP_CREDITO: 'CREDIT RURAL SOLIDAIRE' },
            { tip_CREDITO: 2, des_TIP_CREDITO: 'CREDIT AGRICOLE SOLIDAIRE ORDINAIRE' },
            { tip_CREDITO: 3, des_TIP_CREDITO: 'CREDIT COMMERCIALE SOLIDAIRE' },
            { tip_CREDITO: 4, des_TIP_CREDITO: 'ASSOCIATION DE CAUTION MUTUELLE' },
            { tip_CREDITO: 5, des_TIP_CREDITO: 'CREDIT STOCKAGE ET EMBOUCHE' },
            { tip_CREDITO: 6, des_TIP_CREDITO: 'CREDIT MOYEN TERME' },
            { tip_CREDITO: 7, des_TIP_CREDITO: 'CREDIT FONCTIONNAIRES EPARGNANTS' },
            { tip_CREDITO: 8, des_TIP_CREDITO: 'CREDIT DEPANNAGE FONCTIONNAIRES ET RETRAITES' },
            { tip_CREDITO: 9, des_TIP_CREDITO: 'CREDIT MOURABAHA' },
            { tip_CREDITO: 10, des_TIP_CREDITO: 'CREDIT AGRICOLE SOLIDAIRE RENTE' },
            { tip_CREDITO: 11, des_TIP_CREDITO: 'CREDIT COMMERCIAL PECHE' },
            { tip_CREDITO: 12, des_TIP_CREDITO: 'CREDIT OIM' },
            { tip_CREDITO: 13, des_TIP_CREDITO: 'CREDIT ELUS' },
            { tip_CREDITO: 14, des_TIP_CREDITO: 'CREDIT ANAMIF' },
            { tip_CREDITO: 15, des_TIP_CREDITO: 'CREDITS CT PERSONNEL CDS' },
            { tip_CREDITO: 16, des_TIP_CREDITO: 'CREDITS CT PERSONNEL PRETS SOCIAUX' },
            { tip_CREDITO: 17, des_TIP_CREDITO: 'CREDITS CT PERSONNEL PRETS VEHICULE' },
            { tip_CREDITO: 18, des_TIP_CREDITO: 'CREDITS MT PERSONNEL CDS' },
            { tip_CREDITO: 19, des_TIP_CREDITO: 'CREDITS MT PERSONNEL PRETS SOCIAUX' },
            { tip_CREDITO: 20, des_TIP_CREDITO: 'CREDITS MT PERSONNEL PRETS VEHICULE' },
            { tip_CREDITO: 21, des_TIP_CREDITO: 'CREDITS LT PERSONNE CDS' },
            { tip_CREDITO: 22, des_TIP_CREDITO: 'CREDITS LT PERSONNEL PRETS SOCIAUX' },
            { tip_CREDITO: 23, des_TIP_CREDITO: 'CREDITS LT PERSONNEL PRETS VEHICULE' },
            { tip_CREDITO: 24, des_TIP_CREDITO: 'CREDIT WARRANTAGE' },
            { tip_CREDITO: 25, des_TIP_CREDITO: 'CREDIT TONTINE' },
            { tip_CREDITO: 26, des_TIP_CREDITO: 'CREDIT MOTEUR HORS BORD' },
            { tip_CREDITO: 27, des_TIP_CREDITO: 'CREDIT PROJET VILLAGE DURABLE GUINEE' },
            { tip_CREDITO: 28, des_TIP_CREDITO: 'CREDIT AVANCE SALAIRE FONCTIONAIRES VIRES' },
            { tip_CREDITO: 29, des_TIP_CREDITO: 'CREDIT PRÊTS SCOLAIRES' },
            { tip_CREDITO: 30, des_TIP_CREDITO: 'CREDIT PRETS EQUIPEMENTS' },
            { tip_CREDITO: 31, des_TIP_CREDITO: 'CREDIT PRÊTS INVESTISSEMENTS FONCTIONNAIRE' },
            { tip_CREDITO: 32, des_TIP_CREDITO: 'CREDIT BOEUF PDABAD' },
            { tip_CREDITO: 33, des_TIP_CREDITO: 'MICROCREDIT KIOSQUE' },
            { tip_CREDITO: 34, des_TIP_CREDITO: 'CREDIT EXPLOITATION AGRICOLE' },
            { tip_CREDITO: 35, des_TIP_CREDITO: 'CREDIT INTRANTS ET TRANSFORMATION PRODUITS AGRICOLES' },
            { tip_CREDITO: 36, des_TIP_CREDITO: 'CREDIT EQUIPEMENT AGRICOLE' },
            { tip_CREDITO: 37, des_TIP_CREDITO: 'CREDIT AGRICOLE PRODUCTION ANANAS' },
            { tip_CREDITO: 38, des_TIP_CREDITO: 'CREDIT EXTENSION AGRICOLE' },
            { tip_CREDITO: 39, des_TIP_CREDITO: 'CREDIT MOTO BAJAJ' },
            { tip_CREDITO: 40, des_TIP_CREDITO: 'CREDIT PERFORM WORLD' },
            { tip_CREDITO: 41, des_TIP_CREDITO: 'CREDIT EQUIPEMENT PERFORM WORLD' },
            { tip_CREDITO: 42, des_TIP_CREDITO: 'CREDIT PRODUCTION AGRICOLE' },
            { tip_CREDITO: 43, des_TIP_CREDITO: 'CREDIT TRANSFORMATION COMMERCIALISATION PRODUITS' },
            { tip_CREDITO: 44, des_TIP_CREDITO: 'CREDIT EQUIPEMENT AGRICOLE ET DE TRANSFORMATION PRODUITS' },
            { tip_CREDITO: 45, des_TIP_CREDITO: 'PASSEPORT BRIQUETERIE' },
            { tip_CREDITO: 46, des_TIP_CREDITO: 'PASSEPORT PDV CIMENT' },
            { tip_CREDITO: 47, des_TIP_CREDITO: 'PASSEPORT SALARIE' },
            { tip_CREDITO: 100, des_TIP_CREDITO: 'CREDITS REGULARISE OPS' }
        ];

        return creditTypes as unknown as TypeCreditDto[];
    }

    onDelegationChange(event: any): void {
        console.log('Delegation changed:', event);

        const delegation = event.value;
        if (!delegation || !delegation.id) {
            // Reset when no delegation is selected
            this.state.update((state) => ({
                ...state,
                filteredAgences: [],
                filteredPointsVente: []
            }));
            return;
        }

        const delegationId = delegation.id;
        console.log('Filtering agences for delegation ID:', delegationId);

        // Filter agences based on selected delegation
        const filteredAgences = this.state().allAgences?.filter((agence) => agence.delegation_id === delegationId) || [];

        this.state.update((state) => ({
            ...state,
            filteredAgences,
            filteredPointsVente: [] // Reset points de vente when delegation changes
        }));
    }

    onAgenceChange(event: any): void {
        console.log('Agence changed:', event);

        const agence = event.value;
        if (!agence || !agence.id) {
            // Reset when no agence is selected
            this.state.update((state) => ({
                ...state,
                filteredPointsVente: []
            }));
            return;
        }

        const agenceId = agence.id;
        console.log('Filtering points de vente for agence ID:', agenceId);

        // Filter points de vente based on selected agence
        const filteredPointsVente = this.state().allPointsVente?.filter((pointVente) => pointVente.agence_id === agenceId) || [];

        this.state.update((state) => ({
            ...state,
            filteredPointsVente
        }));
    }

    createDemande(form: NgForm): void {
        if (form.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez remplir correctement tous les champs obligatoires',
                life: 3000
            });
            return;
        }

        this.state.update((state) => ({ ...state, submitting: true }));
        const selectedCredit = form.value.tipCredito;

        if (!selectedCredit) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez sélectionner un type de crédit valide',
                life: 3000
            });
            this.state.update((state) => ({ ...state, submitting: false }));
            return;
        }

        // Set the current date
        const now = new Date();

        // Create the demande object
        const demandeData: DemandeIndividuel = {
            ...form.value,
            // Extract IDs from selected objects
            delegation: form.value.delegation?.id,
            agence: form.value.agence?.id,
            pos: form.value.pos?.id,
            // Extract the tip_CREDITO value from the selected credit type
            tipCredito: selectedCredit.typeCreditPKId?.tip_CREDITO || selectedCredit.tip_CREDITO,
            // Add current date
            createdAt: now,
            // Add default values for form submission
            statutDemande: 'EN_ATTENTE',
            validationState: 'NOUVEAU'
        };

        console.log('Submitting demande data:', demandeData);

        this.creditService
            .addDemandeInd$(demandeData)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Demande de crédit soumise avec succès',
                        life: 3000
                    });
                    this.state.update((state) => ({ ...state, submitting: false }));
                    form.resetForm();
                    // Reset filtered data
                    this.state.update((state) => ({
                        ...state,
                        filteredAgences: [],
                        filteredPointsVente: []
                    }));
                },
                error: (error) => {
                    console.error('Error creating demande:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: error.message || 'Échec de la soumission de la demande de crédit',
                        life: 3000
                    });
                    this.state.update((state) => ({ ...state, submitting: false }));
                }
            });
    }
}
