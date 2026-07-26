import { IResponse } from '@/interface/response';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, OnInit, signal, computed } from '@angular/core';
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

    // Onglet "Valides par le DG"
    valides = signal<any[]>([]);
    loadingValides = signal(false);
    viewMode = signal<'a-valider' | 'valides' | 'synthese'>('a-valider');

    /** Synthese : cumul des credits vises par le DG, agrege par mois (date de visa DG). */
    syntheseParPeriode = computed(() => {
        const map = new Map<string, { periode: string; count: number; montant: number }>();
        for (const d of this.valides()) {
            const raw = d.dateValidationDg || d.createdAt;
            const periode = raw ? String(raw).slice(0, 7) : 'N/A'; // YYYY-MM
            const e = map.get(periode) || { periode, count: 0, montant: 0 };
            e.count += 1;
            e.montant += Number(d.montantDemande || 0);
            map.set(periode, e);
        }
        return [...map.values()].sort((a, b) => b.periode.localeCompare(a.periode));
    });

    totalValidesCount = computed(() => this.valides().length);
    totalValidesMontant = computed(() => this.valides().reduce((s, d) => s + Number(d.montantDemande || 0), 0));
    montantMoyen = computed(() => {
        const n = this.totalValidesCount();
        return n > 0 ? this.totalValidesMontant() / n : 0;
    });

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

    setView(mode: 'a-valider' | 'valides' | 'synthese'): void {
        this.viewMode.set(mode);
        if ((mode === 'valides' || mode === 'synthese') && this.valides().length === 0) {
            this.loadValides();
        }
    }

    /** "YYYY-MM" -> "Juillet 2026". */
    periodeLabel(p: string): string {
        if (!p || p === 'N/A') return 'Non daté';
        const [y, m] = p.split('-');
        const mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        return (mois[Number(m) - 1] || m) + ' ' + y;
    }

    loadValides(): void {
        this.loadingValides.set(true);
        this.userService.getValidesDG$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.valides.set(r.data?.workflowDemandes || []);
                    this.loadingValides.set(false);
                },
                error: (err) => {
                    this.loadingValides.set(false);
                    this.toast('error', 'Erreur', err || 'Impossible de charger les crédits validés');
                }
            });
    }

    viewDemandeDetail(demandeId: number): void {
        this.router.navigate(['/dashboards/credit/individuel/attente/detail', demandeId]);
    }

    refreshData(): void {
        if (this.viewMode() === 'valides' || this.viewMode() === 'synthese') {
            this.loadValides();
        } else {
            this.loadData();
        }
    }

    private toast(severity: string, summary: string, detail: string): void {
        this.messageService.add({ severity, summary, detail, life: 4000 });
    }
}
