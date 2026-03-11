import { Component, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';

interface DelegationOption {
    id: number;
    libele: string;
}

interface AgenceOption {
    id: number;
    libele: string;
    delegation_id: number;
}

interface PointVenteOption {
    id: number;
    libele: string;
    code: string;
    agence_id: number;
}

interface ArreteCaisseDto {
    id: number;
    montant: number;
    statut: string;
    dateArreteCaisse: string;
    dateRemonte: string;
    document: string;
    pointventeNom: string;
    pointventeCode: string;
    createdAt: string;
}

@Component({
    selector: 'app-remontee-arrete-caisse',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        InputNumberModule,
        CardModule,
        ToastModule,
        ProgressSpinnerModule,
        TagModule,
        DatePickerModule,
        SelectModule,
        FileUploadModule,
        DividerModule,
        TableModule
    ],
    providers: [MessageService],
    templateUrl: './remontee-arrete-caisse.component.html',
    styleUrl: './remontee-arrete-caisse.component.scss'
})
export class RemonteeArreteCaisseComponent implements OnDestroy {
    private http = inject(HttpClient);
    private fb = inject(FormBuilder);
    private messageService = inject(MessageService);
    private destroy$ = new Subject<void>();

    private apiUrl = environment.apiBaseUrl;

    // Step: 0 = localisation, 1 = saisie, 2 = confirmation
    activeStep = signal(0);

    // Lookups
    delegations = signal<DelegationOption[]>([]);
    agences = signal<AgenceOption[]>([]);
    pointVentes = signal<PointVenteOption[]>([]);
    loadingDelegations = signal(false);
    loadingAgences = signal(false);
    loadingPointVentes = signal(false);

    // Location form
    locationForm: FormGroup = this.fb.group({
        delegation: [null, Validators.required],
        agence: [null, Validators.required],
        pointVente: [null, Validators.required]
    });

    // Arrete form
    arreteForm: FormGroup = this.fb.group({
        montant: [null, [Validators.required, Validators.min(1)]],
        dateArreteCaisse: [null, Validators.required]
    });

    // Document
    selectedFile: File | null = null;
    submitting = signal(false);

    // Resultat
    createdArrete = signal<ArreteCaisseDto | null>(null);

    // Date max
    today = new Date();

    constructor() {
        this.loadDelegations();
    }

    // ==================== STEP 1: Localisation ====================

    loadDelegations(): void {
        this.loadingDelegations.set(true);
        this.http.get<any>(`${this.apiUrl}/ecredit/public/arrete-caisse/delegations`)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    this.delegations.set(response.data?.delegations || []);
                    this.loadingDelegations.set(false);
                },
                error: () => {
                    this.loadingDelegations.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger les delegations', life: 3000 });
                }
            });
    }

    onDelegationChange(): void {
        const delegation = this.locationForm.get('delegation')?.value;
        if (!delegation?.id) return;

        this.locationForm.patchValue({ agence: null, pointVente: null });
        this.agences.set([]);
        this.pointVentes.set([]);
        this.loadingAgences.set(true);

        this.http.get<any>(`${this.apiUrl}/ecredit/public/arrete-caisse/agences/${delegation.id}`)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    this.agences.set(response.data?.agences || []);
                    this.loadingAgences.set(false);
                },
                error: () => {
                    this.loadingAgences.set(false);
                }
            });
    }

    onAgenceChange(): void {
        const agence = this.locationForm.get('agence')?.value;
        if (!agence?.id) return;

        this.locationForm.patchValue({ pointVente: null });
        this.pointVentes.set([]);
        this.loadingPointVentes.set(true);

        this.http.get<any>(`${this.apiUrl}/ecredit/public/arrete-caisse/pointventes/${agence.id}`)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    this.pointVentes.set(response.data?.pointVentes || []);
                    this.loadingPointVentes.set(false);
                },
                error: () => {
                    this.loadingPointVentes.set(false);
                }
            });
    }

    // ==================== STEP 2: Saisie arrete ====================

    onFileSelect(event: any): void {
        this.selectedFile = event.files?.[0] || null;
    }

    onFileClear(): void {
        this.selectedFile = null;
    }

    submitArrete(): void {
        if (this.arreteForm.invalid) {
            this.messageService.add({ severity: 'warn', summary: 'Attention', detail: 'Veuillez remplir tous les champs obligatoires', life: 3000 });
            return;
        }

        const location = this.locationForm.value;
        const arrete = this.arreteForm.value;

        this.submitting.set(true);

        if (this.selectedFile) {
            const formData = new FormData();
            formData.append('montant', arrete.montant.toString());
            formData.append('dateArreteCaisse', this.formatDate(arrete.dateArreteCaisse));
            formData.append('delegationId', location.delegation.id.toString());
            formData.append('agenceId', location.agence.id.toString());
            formData.append('pointventeId', location.pointVente.id.toString());
            formData.append('document', this.selectedFile);

            this.http.post<any>(`${this.apiUrl}/ecredit/public/arrete-caisse/with-document`, formData)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (response) => this.handleSuccess(response, true),
                    error: (err: HttpErrorResponse) => this.handleError(err)
                });
        } else {
            const params = new URLSearchParams();
            params.append('montant', arrete.montant.toString());
            params.append('dateArreteCaisse', this.formatDate(arrete.dateArreteCaisse));
            params.append('delegationId', location.delegation.id.toString());
            params.append('agenceId', location.agence.id.toString());
            params.append('pointventeId', location.pointVente.id.toString());

            this.http.post<any>(`${this.apiUrl}/ecredit/public/arrete-caisse?${params.toString()}`, null)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (response) => this.handleSuccess(response, false),
                    error: (err: HttpErrorResponse) => this.handleError(err)
                });
        }
    }

    private handleSuccess(response: any, withDocument: boolean): void {
        this.submitting.set(false);
        this.createdArrete.set(response.data?.arrete);
        this.activeStep.set(2);
        this.messageService.add({
            severity: 'success',
            summary: 'Succes',
            detail: withDocument ? 'Arrete cree et valide avec document' : 'Arrete cree (ENCOURS). Vous pourrez ajouter le document plus tard.',
            life: 5000
        });
    }

    private handleError(err: HttpErrorResponse): void {
        this.submitting.set(false);
        this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: err.error?.message || 'Erreur lors de la creation',
            life: 5000
        });
    }

    // ==================== Navigation ====================

    goToStep(step: number): void {
        this.activeStep.set(step);
    }

    resetForm(): void {
        this.activeStep.set(0);
        this.locationForm.reset();
        this.arreteForm.reset();
        this.selectedFile = null;
        this.createdArrete.set(null);
        this.agences.set([]);
        this.pointVentes.set([]);
    }

    // ==================== Utilitaires ====================

    private formatDate(date: any): string {
        if (!(date instanceof Date)) date = new Date(date);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    formatMontant(montant: number): string {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'GNF', minimumFractionDigits: 0 }).format(montant);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
