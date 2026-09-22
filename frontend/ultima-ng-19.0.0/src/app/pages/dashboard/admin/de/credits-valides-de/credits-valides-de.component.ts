import { IResponse } from '@/interface/response';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, Input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-credits-valides-de',
    standalone: true,
    imports: [
        CommonModule, TableModule, ButtonModule, TagModule, ToastModule,
        BadgeModule, IconFieldModule, InputIconModule, InputTextModule,
        ProgressSpinnerModule, ChipModule, TooltipModule
    ],
    templateUrl: './credits-valides-de.component.html',
    providers: [MessageService]
})
export class CreditsValidesDeComponent implements OnInit {
    @Input() user?: IUser;

    demandes = signal<any[]>([]);
    loading = signal(false);
    error = signal<string | undefined>(undefined);

    private userService = inject(UserService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private destroyRef = inject(DestroyRef);
    private messageService = inject(MessageService);

    /** Niveau qui a signé la validation finale : DG si visa DG, sinon DE, DR, DA (échelle de délégation). */
    niveauFinal(d: any): 'DA' | 'DR' | 'DE' | 'DG' {
        if (d?.dateValidationDg) return 'DG';
        if (d?.dateValidationDe) return 'DE';
        if (d?.dateValidationDr) return 'DR';
        return 'DA';
    }

    validePar(d: any): string {
        switch (this.niveauFinal(d)) {
            case 'DG': return d.validatedByDg || '—';
            case 'DE': return d.validatedByDe || '—';
            case 'DR': return d.validatedByDr || '—';
            default: return d.validatedByDa || '—';
        }
    }

    dateValidationFinale(d: any): string | null {
        return d?.dateValidationDg || d?.dateValidationDe || d?.dateValidationDr || d?.dateValidationDa || null;
    }

    /** Filtre par niveau de validation finale (cartes + paramètre d'URL ?niveau=DG depuis le menu). */
    filtreNiveau = signal<'TOUS' | 'DA' | 'DR' | 'DE' | 'DG'>('TOUS');
    readonly niveaux: { cle: 'TOUS' | 'DA' | 'DR' | 'DE' | 'DG'; libelle: string; description: string; couleur: string }[] = [
        { cle: 'TOUS', libelle: 'Tous les crédits validés', description: 'Niveau final atteint', couleur: 'primary' },
        { cle: 'DA', libelle: 'Validés par un DA', description: 'Montant ≤ 25 M', couleur: 'blue' },
        { cle: 'DR', libelle: 'Validés par un DR', description: 'Montant ≤ 50 M', couleur: 'orange' },
        { cle: 'DE', libelle: 'Validés par la DE', description: 'Montant ≤ 100 M', couleur: 'green' },
        { cle: 'DG', libelle: 'Validés par le DG', description: 'Montant > 100 M, visa DG', couleur: 'purple' }
    ];
    compteurs = computed<Record<string, number>>(() => {
        const r: Record<string, number> = { TOUS: this.demandes().length, DA: 0, DR: 0, DE: 0, DG: 0 };
        this.demandes().forEach((d) => { r[this.niveauFinal(d)]++; });
        return r;
    });
    demandesFiltrees = computed(() => {
        const f = this.filtreNiveau();
        return f === 'TOUS' ? this.demandes() : this.demandes().filter((d) => this.niveauFinal(d) === f);
    });
    severiteNiveau(n: string): 'info' | 'warn' | 'success' | 'contrast' | 'secondary' {
        return n === 'DG' ? 'contrast' : n === 'DE' ? 'success' : n === 'DR' ? 'warn' : 'info';
    }
    titre(): string {
        const f = this.filtreNiveau();
        return f === 'TOUS' ? 'Crédits validés (tous niveaux)' : this.niveaux.find((n) => n.cle === f)?.libelle || 'Crédits validés';
    }

    ngOnInit(): void {
        const niveau = String(this.route.snapshot.queryParamMap.get('niveau') || '').toUpperCase();
        if (['DA', 'DR', 'DE', 'DG'].includes(niveau)) {
            this.filtreNiveau.set(niveau as any);
        }
        this.loadData();
    }

    loadData(): void {
        this.loading.set(true);
        this.error.set(undefined);

        this.userService.getValidesDE$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.demandes.set(response.data?.workflowDemandes || []);
                    this.loading.set(false);
                },
                error: (err) => {
                    this.error.set(err || 'Erreur lors du chargement');
                    this.loading.set(false);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: err || 'Impossible de charger les demandes',
                        life: 5000
                    });
                }
            });
    }

    formatMontantGNF(montant: number): string {
        if (!montant || montant === 0) return '0 GNF';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'GNF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(montant);
    }

    onGlobalFilter(table: any, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    viewDemandeDetail(demandeId: number): void {
        this.router.navigate(['/dashboards/credit/individuel/attente/detail', demandeId]);
    }

    refreshData(): void {
        this.loadData();
        this.messageService.add({
            severity: 'info',
            summary: 'Actualisation',
            detail: 'Données actualisées',
            life: 2000
        });
    }
}
