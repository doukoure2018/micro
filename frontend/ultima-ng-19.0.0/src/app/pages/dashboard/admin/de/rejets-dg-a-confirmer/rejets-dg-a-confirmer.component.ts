import { IResponse } from '@/interface/response';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

/**
 * Ecran DE : credits rejetes par le DG (etat REJETE_DG). Le DE confirme le rejet
 * en cochant les sections a revoir (obligatoire) et en ajoutant des instructions,
 * ce qui renvoie la demande en CORRECTION vers l'agent avec un feedback actionnable.
 */
@Component({
    selector: 'app-rejets-dg-a-confirmer',
    standalone: true,
    imports: [
        CommonModule, FormsModule, TableModule, ButtonModule, TagModule, ToastModule,
        DialogModule, IconFieldModule, InputIconModule, InputTextModule,
        ProgressSpinnerModule, TooltipModule
    ],
    templateUrl: './rejets-dg-a-confirmer.component.html',
    providers: [MessageService]
})
export class RejetsDgAConfirmerComponent implements OnInit {
    @Input() user?: IUser;

    demandes = signal<any[]>([]);
    loading = signal(false);
    submitting = signal(false);
    showConfirmDialog = signal(false);
    selected: any = null;
    instructions = '';
    sectionsARevoir: string[] = [];

    /** Sections cochables, alignees sur les dialogs de rejet DA/DR/DE (detail.component). */
    workflowSectionsOptions = [
        { label: 'Collecte des donnees', value: 'COLLECTE' },
        { label: "Bilan d'activite", value: 'BILAN_ACTIVITE' },
        { label: 'Flux de tresorerie', value: 'FLUX_TRESORERIE' },
        { label: 'Amortissements', value: 'AMORTISSEMENTS' },
        { label: 'Rentabilite', value: 'RENTABILITE' },
        { label: 'Ratios financiers', value: 'RATIOS' },
        { label: 'Personne caution', value: 'PERSONNE_CAUTION' },
        { label: 'Garantie proposee', value: 'GARANTIE' },
        { label: 'Documents incomplets', value: 'DOCUMENTS_INCOMPLETS' },
        { label: 'Demande complete', value: 'DEMANDE_COMPLETE' }
    ];

    private userService = inject(UserService);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private messageService = inject(MessageService);

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.loading.set(true);
        this.userService.getRejetsDGAConfirmer$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.demandes.set(r.data?.workflowDemandes || []);
                    this.loading.set(false);
                },
                error: (err) => {
                    this.loading.set(false);
                    this.toast('error', 'Erreur', err || 'Impossible de charger les rejets');
                }
            });
    }

    formatMontantGNF(m: number): string {
        if (!m || m === 0) return '0 GNF';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency', currency: 'GNF',
            minimumFractionDigits: 0, maximumFractionDigits: 0
        }).format(m);
    }

    onGlobalFilter(table: any, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openConfirm(d: any): void {
        this.selected = d;
        this.instructions = '';
        this.sectionsARevoir = [];
        this.showConfirmDialog.set(true);
    }

    toggleSection(value: string, checked: boolean): void {
        if (checked) {
            if (!this.sectionsARevoir.includes(value)) {
                this.sectionsARevoir = [...this.sectionsARevoir, value];
            }
        } else {
            this.sectionsARevoir = this.sectionsARevoir.filter((v) => v !== value);
        }
    }

    isSectionChecked(value: string): boolean {
        return this.sectionsARevoir.includes(value);
    }

    confirmRejet(): void {
        if (!this.selected) return;
        if (this.sectionsARevoir.length === 0) {
            this.toast('warn', 'Sections requises', 'Cochez au moins une section a revoir pour guider la correction');
            return;
        }
        this.submitting.set(true);
        this.userService.confirmerRejetDG$(this.selected.demandeIndividuelId, this.instructions.trim(), this.sectionsARevoir)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.submitting.set(false);
                    this.showConfirmDialog.set(false);
                    this.toast('success', 'Confirme', 'Rejet confirme, demande renvoyee en correction');
                    this.loadData();
                },
                error: (err) => {
                    this.submitting.set(false);
                    this.toast('error', 'Erreur', err || 'Confirmation impossible');
                }
            });
    }

    viewDemandeDetail(id: number): void {
        this.router.navigate(['/dashboards/credit/individuel/attente/detail', id]);
    }

    refreshData(): void {
        this.loadData();
    }

    private toast(severity: string, summary: string, detail: string): void {
        this.messageService.add({ severity, summary, detail, life: 4000 });
    }
}
