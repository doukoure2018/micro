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
 * Ecran DG : credits valides par le DE avec montant >= 100M (etat PENDING_DG),
 * en attente du visa du Directeur General. Le DG valide (avis) ou rejette (remarques).
 */
@Component({
    selector: 'app-credits-a-valider-dg',
    standalone: true,
    imports: [
        CommonModule, FormsModule, TableModule, ButtonModule, TagModule, ToastModule,
        DialogModule, IconFieldModule, InputIconModule, InputTextModule,
        ProgressSpinnerModule, TooltipModule
    ],
    templateUrl: './credits-a-valider-dg.component.html',
    providers: [MessageService]
})
export class CreditsAValiderDgComponent implements OnInit {
    @Input() user?: IUser;

    demandes = signal<any[]>([]);
    loading = signal(false);
    submitting = signal(false);

    showValiderDialog = signal(false);
    showRejeterDialog = signal(false);
    selected: any = null;
    avis = '';
    motifRejet = '';

    private userService = inject(UserService);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private messageService = inject(MessageService);

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.loading.set(true);
        this.userService.getAValiderDG$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.demandes.set(response.data?.workflowDemandes || []);
                    this.loading.set(false);
                },
                error: (err) => {
                    this.loading.set(false);
                    this.toast('error', 'Erreur', err || 'Impossible de charger les demandes');
                }
            });
    }

    formatMontantGNF(montant: number): string {
        if (!montant || montant === 0) return '0 GNF';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency', currency: 'GNF',
            minimumFractionDigits: 0, maximumFractionDigits: 0
        }).format(montant);
    }

    onGlobalFilter(table: any, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openValider(d: any): void {
        this.selected = d;
        this.avis = '';
        this.showValiderDialog.set(true);
    }

    openRejeter(d: any): void {
        this.selected = d;
        this.motifRejet = '';
        this.showRejeterDialog.set(true);
    }

    confirmValider(): void {
        if (!this.selected || this.avis.trim().length < 10) return;
        this.submitting.set(true);
        this.userService.validerDG$(this.selected.demandeIndividuelId, this.avis.trim())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.submitting.set(false);
                    this.showValiderDialog.set(false);
                    this.toast('success', 'Valide', 'Visa favorable DG enregistre');
                    this.loadData();
                },
                error: (err) => {
                    this.submitting.set(false);
                    this.toast('error', 'Erreur', err || 'Validation impossible');
                }
            });
    }

    confirmRejeter(): void {
        if (!this.selected || this.motifRejet.trim().length < 5) return;
        this.submitting.set(true);
        this.userService.rejeterDG$(this.selected.demandeIndividuelId, this.motifRejet.trim())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.submitting.set(false);
                    this.showRejeterDialog.set(false);
                    this.toast('warn', 'Rejete', 'Rejet enregistre (en attente de confirmation du DE)');
                    this.loadData();
                },
                error: (err) => {
                    this.submitting.set(false);
                    this.toast('error', 'Erreur', err || 'Rejet impossible');
                }
            });
    }

    viewDemandeDetail(demandeId: number): void {
        this.router.navigate(['/dashboards/credit/individuel/attente/detail', demandeId]);
    }

    refreshData(): void {
        this.loadData();
    }

    private toast(severity: string, summary: string, detail: string): void {
        this.messageService.add({ severity, summary, detail, life: 4000 });
    }
}
