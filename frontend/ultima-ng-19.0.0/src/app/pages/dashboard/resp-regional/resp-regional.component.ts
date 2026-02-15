import { IResponse } from '@/interface/response';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-resp-regional',
    standalone: true,
    imports: [
        CommonModule, TableModule, InputIconModule, IconFieldModule, TagModule,
        ButtonModule, ToastModule, ProgressSpinnerModule, ChipModule, DividerModule,
        TabViewModule, BadgeModule, DialogModule, ReactiveFormsModule, TextareaModule
    ],
    templateUrl: './resp-regional.component.html',
    providers: [MessageService]
})
export class RespRegionalComponent {
    @Input() user?: IUser;

    state = signal<{
        demandesAValider: any[];
        demandesCorrectionDE: any[];
        loading: boolean;
        error: string | undefined;
    }>({
        demandesAValider: [],
        demandesCorrectionDE: [],
        loading: false,
        error: undefined
    });

    showValidationDialog = false;
    showRejetDialog = false;
    selectedDemande: any = null;

    validationForm: FormGroup;
    rejetForm: FormGroup;

    sectionsOptions = [
        { label: 'Collecte des donnees', value: 'COLLECTE' },
        { label: 'Bilan d\'activite', value: 'BILAN_ACTIVITE' },
        { label: 'Flux de tresorerie', value: 'FLUX_TRESORERIE' },
        { label: 'Amortissements', value: 'AMORTISSEMENTS' },
        { label: 'Rentabilite', value: 'RENTABILITE' },
        { label: 'Ratios financiers', value: 'RATIOS' },
        { label: 'Personne caution', value: 'PERSONNE_CAUTION' }
    ];

    private userService = inject(UserService);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private messageService = inject(MessageService);
    private fb = inject(FormBuilder);

    constructor() {
        this.validationForm = this.fb.group({
            avis: ['', [Validators.required, Validators.minLength(10)]]
        });
        this.rejetForm = this.fb.group({
            motifRejet: ['', [Validators.required, Validators.minLength(10)]],
            sectionsARevoir: [[], [Validators.required]],
            instructions: ['']
        });
    }

    ngOnInit(): void {
        this.loadData();
    }

    private loadData(): void {
        this.state.update(s => ({ ...s, loading: true }));

        this.userService.getAValiderDR$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.state.update(s => ({
                        ...s,
                        demandesAValider: response.data?.workflowDemandes || [],
                        loading: false
                    }));
                },
                error: () => {
                    this.state.update(s => ({ ...s, loading: false, error: 'Erreur lors du chargement' }));
                }
            });

        this.userService.getEnCorrectionDE$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.state.update(s => ({
                        ...s,
                        demandesCorrectionDE: response.data?.workflowDemandes || []
                    }));
                },
                error: () => {}
            });
    }

    formatMontantGNF(montant: number): string {
        if (!montant || montant === 0) return '0 GNF';
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'GNF', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(montant);
    }

    onGlobalFilter(table: any, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    viewDemandeDetail(demandeId: number): void {
        this.router.navigate(['/dashboards/credit/individuel/attente/detail', demandeId]);
    }

    ouvrirValidation(demande: any): void {
        this.selectedDemande = demande;
        this.validationForm.reset();
        this.showValidationDialog = true;
    }

    ouvrirRejet(demande: any): void {
        this.selectedDemande = demande;
        this.rejetForm.reset();
        this.showRejetDialog = true;
    }

    confirmerValidation(): void {
        if (this.validationForm.invalid || !this.selectedDemande) return;

        this.userService.validerDR$(this.selectedDemande.demandeIndividuelId, this.validationForm.value.avis)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Succes', detail: 'Demande validee par DR', life: 3000 });
                    this.showValidationDialog = false;
                    this.loadData();
                },
                error: (err) => {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Erreur lors de la validation', life: 5000 });
                }
            });
    }

    confirmerRejet(): void {
        if (this.rejetForm.invalid || !this.selectedDemande) return;

        const body = {
            motifRejet: this.rejetForm.value.motifRejet,
            sectionsARevoir: this.rejetForm.value.sectionsARevoir,
            instructions: this.rejetForm.value.instructions || undefined
        };

        this.userService.rejeterDR$(this.selectedDemande.demandeIndividuelId, body)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.messageService.add({ severity: 'warn', summary: 'Rejet', detail: 'Demande rejetee par DR', life: 3000 });
                    this.showRejetDialog = false;
                    this.loadData();
                },
                error: (err) => {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Erreur lors du rejet', life: 5000 });
                }
            });
    }

    toggleSection(value: string, event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        const current: string[] = this.rejetForm.get('sectionsARevoir')?.value || [];
        if (checkbox.checked) {
            this.rejetForm.get('sectionsARevoir')?.setValue([...current, value]);
        } else {
            this.rejetForm.get('sectionsARevoir')?.setValue(current.filter(v => v !== value));
        }
        this.rejetForm.get('sectionsARevoir')?.markAsTouched();
    }

    refreshData(): void {
        this.loadData();
        this.messageService.add({ severity: 'info', summary: 'Actualisation', detail: 'Donnees actualisees', life: 2000 });
    }
}
