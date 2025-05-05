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
        delegations?: Delegation[];
        agences?: Agence[];
        pointsVente?: PointVente[];
        loading: boolean;
        submitting: boolean;
        message: string | undefined;
        error: string | any;
    }>({
        loading: false,
        submitting: false,
        message: undefined,
        error: undefined,
        delegations: [],
        agences: [],
        pointsVente: []
    });

    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private destroyRef = inject(DestroyRef);
    private creditService = inject(UserService);
    private messageService = inject(MessageService);

    ngOnInit(): void {
        console.log('this demande credit');

        this.loadTypeCreditos();
        this.loadDelegations();
        this.activatedRoute.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const codeClient = params['codeClient'];
            if (codeClient) {
                console.log('Code client:', codeClient);
                this.loadClientData(codeClient);
            }
        });
    }

    private loadClientData(codeClient: string): void {
        // Call your service to get client data if needed
        this.creditService
            .searchClientes$(codeClient)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    if (response.data && response.data.clientes) {
                        // Update form with client data
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

    private loadTypeCreditos(): void {
        this.state.update((state) => ({ ...state, loading: true, message: undefined, error: undefined }));
        this.creditService
            .getTypeCreditos$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.state.update((state) => ({
                        ...state,
                        loading: false,
                        typeCreditos: response.data.typeCreditos,
                        message: undefined,
                        error: undefined
                    }));
                },
                error: (error) => {
                    console.error('Error loading type creditos:', error);
                    this.state.update((state) => ({
                        ...state,
                        loading: false,
                        typeCreditos: undefined,
                        message: undefined,
                        error
                    }));
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Échec du chargement des types de crédit',
                        life: 3000
                    });
                }
            });
    }

    private loadDelegations(): void {
        this.state.update((state) => ({ ...state, loading: true }));
        this.creditService
            .getAllDelegation$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    console.log('Delegations loaded:', response);
                    if (response.data && response.data.delegations) {
                        this.state.update((state) => ({
                            ...state,
                            loading: false,
                            delegations: response.data.delegations
                        }));
                    } else if (response.data) {
                        // Handle case where the data structure might be different
                        // Check if delegations might be directly in data or in a different property
                        const possibleDelegations = Object.values(response.data).find((item) => Array.isArray(item) && item.length > 0 && item[0].hasOwnProperty('libele'));

                        if (possibleDelegations) {
                            this.state.update((state) => ({
                                ...state,
                                loading: false,
                                delegations: possibleDelegations as Delegation[]
                            }));
                        } else {
                            console.error('Delegations data structure is unexpected:', response.data);
                            this.state.update((state) => ({ ...state, loading: false }));
                        }
                    }
                },
                error: (error) => {
                    console.error('Error loading delegations:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger les délégations',
                        life: 3000
                    });
                    this.state.update((state) => ({ ...state, loading: false }));
                }
            });
    }

    onDelegationChange(event: any): void {
        console.log('Delegation changed:', event);
        // Reset agence and point de vente when delegation changes
        this.state.update((state) => ({
            ...state,
            agences: [],
            pointsVente: []
        }));

        const delegation = event.value;
        if (!delegation || !delegation.id) {
            console.warn('No valid delegation selected');
            return;
        }

        const delegationId = delegation.id;
        console.log('Loading agences for delegation ID:', delegationId);

        this.state.update((state) => ({ ...state, loading: true }));
        this.creditService
            .getAllAgencesByDelegationId$(delegationId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    console.log('Agences loaded:', response);
                    if (response.data && response.data.agences) {
                        this.state.update((state) => ({
                            ...state,
                            loading: false,
                            agences: response.data.agences
                        }));
                    } else if (response.data) {
                        // Handle case where the data structure might be different
                        const possibleAgences = Object.values(response.data).find((item) => Array.isArray(item) && item.length > 0 && item[0].hasOwnProperty('libele'));

                        if (possibleAgences) {
                            this.state.update((state) => ({
                                ...state,
                                loading: false,
                                agences: possibleAgences as Agence[]
                            }));
                        } else {
                            console.error('Agences data structure is unexpected:', response.data);
                            this.state.update((state) => ({ ...state, loading: false }));
                        }
                    }
                },
                error: (error) => {
                    console.error('Error loading agences:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger les agences',
                        life: 3000
                    });
                    this.state.update((state) => ({ ...state, loading: false }));
                }
            });
    }

    onAgenceChange(event: any): void {
        console.log('Agence changed:', event);
        // Reset point de vente when agence changes
        this.state.update((state) => ({
            ...state,
            pointsVente: []
        }));

        const agence = event.value;
        if (!agence || !agence.id) {
            console.warn('No valid agence selected');
            return;
        }

        const agenceId = agence.id;
        console.log('Loading points de vente for agence ID:', agenceId);

        this.state.update((state) => ({ ...state, loading: true }));
        this.creditService
            .getAllPointVenteByAgenceId$(agenceId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    console.log('Points de vente loaded:', response);
                    if (response.data && response.data.pointVentes) {
                        this.state.update((state) => ({
                            ...state,
                            loading: false,
                            pointsVente: response.data.pointVentes
                        }));
                    } else if (response.data) {
                        // Handle case where the data structure might be different
                        const possiblePointsVente = Object.values(response.data).find((item) => Array.isArray(item) && item.length > 0 && item[0].hasOwnProperty('libele'));

                        if (possiblePointsVente) {
                            this.state.update((state) => ({
                                ...state,
                                loading: false,
                                pointsVente: possiblePointsVente as PointVente[]
                            }));
                        } else {
                            console.error('Points de vente data structure is unexpected:', response.data);
                            this.state.update((state) => ({ ...state, loading: false }));
                        }
                    }
                },
                error: (error) => {
                    console.error('Error loading points de vente:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger les points de vente',
                        life: 3000
                    });
                    this.state.update((state) => ({ ...state, loading: false }));
                }
            });
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
                    // Navigate to dashboard or stay on the page based on your requirement
                    //this.router.navigate(['/auth/credit']);
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
