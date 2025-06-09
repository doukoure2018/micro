import { Agence } from '@/interface/agence';
import { Delegation } from '@/interface/delegation';
import { PointVente } from '@/interface/point.vente';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
@Component({
    selector: 'app-config-reseau',
    imports: [
        CommonModule,
        InputTextModule,
        TextareaModule,
        FileUploadModule,
        TableModule,
        FormsModule,
        ButtonModule,
        InputGroupModule,
        RippleModule,
        ProgressSpinnerModule,
        PasswordModule,
        DropdownModule,
        ToastModule,
        CardModule,
        MessageModule,
        TagModule
    ],
    templateUrl: './config-reseau.component.html',
    providers: [MessageService, ConfirmationService]
})
export class ConfigReseauComponent {
    state = signal<{
        agence?: Agence;
        agences?: Agence[];
        delegations?: Delegation[];
        delegation?: Delegation;
        pointeVente?: PointVente;
        pointeVentes?: PointVente[];
        selectedDelegationId?: number;
        selectedAgenceId?: number;
        loading: boolean;
        submitting: boolean;
        message: string | undefined;
        error: string | any;
    }>({
        loading: false,
        submitting: false,
        message: undefined,
        error: undefined
    });

    // Form models
    delegationForm: Delegation = {};
    agenceForm: Agence = {};
    pointVenteForm: PointVente = {};

    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private userService = inject(UserService);
    private messageService = inject(MessageService);

    ngOnInit() {
        this.loadAllDelegations();
    }

    // ================== DELEGATION OPERATIONS ==================

    loadAllDelegations() {
        this.state.update((state) => ({ ...state, loading: true }));

        this.userService
            .getAllDelegation$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.state.update((state) => ({
                        ...state,
                        delegations: response.data?.delegations || response.data,
                        loading: false
                    }));
                },
                error: (error) => {
                    this.state.update((state) => ({ ...state, error, loading: false }));
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load delegations'
                    });
                }
            });
    }

    addDelegation() {
        if (!this.delegationForm.libele?.trim()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter delegation name'
            });
            return;
        }

        this.state.update((state) => ({ ...state, submitting: true }));

        this.userService
            .addDelegation$(this.delegationForm)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.state.update((state) => ({ ...state, submitting: false }));
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Delegation added successfully'
                    });
                    this.delegationForm = {}; // Reset form
                    this.loadAllDelegations(); // Refresh list
                },
                error: (error) => {
                    this.state.update((state) => ({ ...state, error, submitting: false }));
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to add delegation'
                    });
                }
            });
    }

    // ================== AGENCE OPERATIONS ==================

    onDelegationSelect(delegationId: number) {
        this.state.update((state) => ({ ...state, selectedDelegationId: delegationId }));
        this.agenceForm.delegation_id = delegationId;
        this.loadAgencesByDelegation(delegationId);
    }

    loadAgencesByDelegation(delegationId: number) {
        this.state.update((state) => ({ ...state, loading: true }));

        this.userService
            .getAllAgenceByDelegationId$(delegationId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.state.update((state) => ({
                        ...state,
                        agences: response.data?.agences || response.data,
                        loading: false
                    }));
                },
                error: (error) => {
                    this.state.update((state) => ({ ...state, error, loading: false }));
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load agences'
                    });
                }
            });
    }

    addAgence() {
        if (!this.agenceForm.libele?.trim()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter agence name'
            });
            return;
        }

        if (!this.agenceForm.delegation_id) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please select a delegation'
            });
            return;
        }

        this.state.update((state) => ({ ...state, submitting: true }));

        this.userService
            .addAgence$(this.agenceForm)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.state.update((state) => ({ ...state, submitting: false }));
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Agence added successfully'
                    });
                    this.agenceForm = { delegation_id: this.agenceForm.delegation_id }; // Reset form but keep delegation
                    this.loadAgencesByDelegation(this.agenceForm.delegation_id!); // Refresh list
                },
                error: (error) => {
                    this.state.update((state) => ({ ...state, error, submitting: false }));
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to add agence'
                    });
                }
            });
    }

    // ================== POINT VENTE OPERATIONS ==================

    onAgenceSelect(agenceId: number) {
        this.state.update((state) => ({ ...state, selectedAgenceId: agenceId }));
        this.pointVenteForm.agence_id = agenceId;
        this.pointVenteForm.delegation_id = this.state().selectedDelegationId;
        this.loadPointVentesByAgence(agenceId);
    }

    loadPointVentesByAgence(agenceId: number) {
        this.state.update((state) => ({ ...state, loading: true }));

        this.userService
            .getAllPointventesByAgenceId$(agenceId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.state.update((state) => ({
                        ...state,
                        pointeVentes: response.data?.pointVentes || response.data,
                        loading: false
                    }));
                },
                error: (error) => {
                    this.state.update((state) => ({ ...state, error, loading: false }));
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load point ventes'
                    });
                }
            });
    }

    addPointVente() {
        if (!this.pointVenteForm.libele?.trim()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter point vente name'
            });
            return;
        }

        if (!this.pointVenteForm.code?.trim()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter point vente code'
            });
            return;
        }

        if (!this.pointVenteForm.agence_id) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please select an agence'
            });
            return;
        }

        this.state.update((state) => ({ ...state, submitting: true }));

        this.userService
            .addPointeVente$(this.pointVenteForm)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.state.update((state) => ({ ...state, submitting: false }));
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Point vente added successfully'
                    });
                    this.pointVenteForm = {
                        agence_id: this.pointVenteForm.agence_id,
                        delegation_id: this.pointVenteForm.delegation_id
                    }; // Reset form but keep agence and delegation
                    this.loadPointVentesByAgence(this.pointVenteForm.agence_id!); // Refresh list
                },
                error: (error) => {
                    this.state.update((state) => ({ ...state, error, submitting: false }));
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to add point vente'
                    });
                }
            });
    }

    // ================== UTILITY METHODS ==================

    resetForms() {
        this.delegationForm = {};
        this.agenceForm = {};
        this.pointVenteForm = {};
        this.state.update((state) => ({
            ...state,
            selectedDelegationId: undefined,
            selectedAgenceId: undefined,
            agences: undefined,
            pointeVentes: undefined
        }));
    }
}
