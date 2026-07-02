import { Component, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
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

interface SelectedFile {
    file: File;
    preview: string | null; // object URL pour les images, null pour les PDF
}

/**
 * Page PUBLIQUE (sans connexion) : remontée des documents carte prépayée.
 * La personne choisit Délégation / Agence / Point de service puis téléverse les images.
 * Alimente le backoffice de vérification des documents (regroupement par localisation choisie).
 */
@Component({
    selector: 'app-remontee-carte-prepaid',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, CardModule, ToastModule, ProgressSpinnerModule, SelectModule, DividerModule],
    providers: [MessageService],
    templateUrl: './remontee-carte-prepaid.component.html',
    styleUrl: './remontee-carte-prepaid.component.scss'
})
export class RemonteeCartePrepaidComponent implements OnDestroy {
    private http = inject(HttpClient);
    private fb = inject(FormBuilder);
    private messageService = inject(MessageService);
    private destroy$ = new Subject<void>();

    private base = `${environment.apiBaseUrl}/ecredit/public/carte-prepaid`;

    // Lookups
    delegations = signal<DelegationOption[]>([]);
    agences = signal<AgenceOption[]>([]);
    pointVentes = signal<PointVenteOption[]>([]);
    loadingDelegations = signal(false);
    loadingAgences = signal(false);
    loadingPointVentes = signal(false);

    locationForm: FormGroup = this.fb.group({
        delegation: [null, Validators.required],
        agence: [null, Validators.required],
        pointVente: [null, Validators.required]
    });

    // Fichiers sélectionnés (images / PDF)
    selectedFiles = signal<SelectedFile[]>([]);
    submitting = signal(false);
    submitted = signal(false);

    constructor() {
        this.loadDelegations();
    }

    // ==================== Cascade localisation ====================

    loadDelegations(): void {
        this.loadingDelegations.set(true);
        this.http
            .get<any>(`${this.base}/delegations`)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    this.delegations.set(response.data?.delegations || []);
                    this.loadingDelegations.set(false);
                },
                error: () => {
                    this.loadingDelegations.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger les délégations', life: 3000 });
                }
            });
    }

    onDelegationChange(): void {
        const delegation = this.locationForm.get('delegation')?.value;
        this.locationForm.patchValue({ agence: null, pointVente: null });
        this.agences.set([]);
        this.pointVentes.set([]);
        if (!delegation?.id) return;

        this.loadingAgences.set(true);
        this.http
            .get<any>(`${this.base}/agences/${delegation.id}`)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    this.agences.set(response.data?.agences || []);
                    this.loadingAgences.set(false);
                },
                error: () => this.loadingAgences.set(false)
            });
    }

    onAgenceChange(): void {
        const agence = this.locationForm.get('agence')?.value;
        this.locationForm.patchValue({ pointVente: null });
        this.pointVentes.set([]);
        if (!agence?.id) return;

        this.loadingPointVentes.set(true);
        this.http
            .get<any>(`${this.base}/pointventes/${agence.id}`)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    this.pointVentes.set(response.data?.pointVentes || []);
                    this.loadingPointVentes.set(false);
                },
                error: () => this.loadingPointVentes.set(false)
            });
    }

    // ==================== Fichiers ====================

    onFilesSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input.files) return;
        const incoming = Array.from(input.files);
        // Cumuler avec la sélection précédente, en évitant les doublons (nom+taille)
        const merged = [...this.selectedFiles()];
        for (const f of incoming) {
            if (!merged.some((m) => m.file.name === f.name && m.file.size === f.size)) {
                merged.push({ file: f, preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null });
            }
        }
        this.selectedFiles.set(merged);
        input.value = '';
    }

    removeFile(index: number): void {
        const files = [...this.selectedFiles()];
        const [removed] = files.splice(index, 1);
        if (removed?.preview) URL.revokeObjectURL(removed.preview);
        this.selectedFiles.set(files);
    }

    formatSize(bytes: number): string {
        if (bytes < 1024) return `${bytes} o`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
        return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
    }

    // ==================== Soumission ====================

    canSubmit(): boolean {
        return this.locationForm.valid && this.selectedFiles().length > 0 && !this.submitting();
    }

    submit(): void {
        if (this.locationForm.invalid) {
            this.messageService.add({ severity: 'warn', summary: 'Attention', detail: 'Veuillez sélectionner la délégation, l’agence et le point de service', life: 3000 });
            return;
        }
        if (this.selectedFiles().length === 0) {
            this.messageService.add({ severity: 'warn', summary: 'Attention', detail: 'Veuillez ajouter au moins un document', life: 3000 });
            return;
        }

        const location = this.locationForm.value;
        const formData = new FormData();
        formData.append('delegationId', location.delegation.id.toString());
        formData.append('agenceId', location.agence.id.toString());
        formData.append('pointventeId', location.pointVente.id.toString());
        for (const item of this.selectedFiles()) {
            formData.append('files', item.file);
        }

        this.submitting.set(true);
        this.http
            .post<any>(`${this.base}/submit`, formData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.submitting.set(false);
                    this.submitted.set(true);
                    this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Documents remontés avec succès', life: 5000 });
                },
                error: (err: HttpErrorResponse) => {
                    this.submitting.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err.error?.message || 'Erreur lors de la remontée', life: 5000 });
                }
            });
    }

    reset(): void {
        this.submitted.set(false);
        this.locationForm.reset();
        this.revokePreviews();
        this.selectedFiles.set([]);
        this.agences.set([]);
        this.pointVentes.set([]);
    }

    private revokePreviews(): void {
        for (const item of this.selectedFiles()) {
            if (item.preview) URL.revokeObjectURL(item.preview);
        }
    }

    ngOnDestroy(): void {
        this.revokePreviews();
        this.destroy$.next();
        this.destroy$.complete();
    }
}
