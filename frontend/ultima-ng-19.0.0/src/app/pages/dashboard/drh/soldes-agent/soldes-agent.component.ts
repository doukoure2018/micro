import { Component, DestroyRef, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DrhService, SoldeConge, QuotaPermission } from '@/service/drh.service';

/**
 * Bandeau « Mes soldes » de l'agent : jours de congé restants (droit 30 j)
 * et jours de permission sociale restants (quota annuel), affiché sur
 * toutes les pages de l'espace Mes congés.
 */
@Component({
    selector: 'app-soldes-agent',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="soldes" *ngIf="solde() || quota()">
            <div class="pastille-solde conge" *ngIf="solde() as s">
                <i class="pi pi-calendar"></i>
                <div>
                    <div class="valeur">{{ s.restant }} <small>/ {{ s.droit }} j</small></div>
                    <div class="libelle">Congés restants {{ exercice }}</div>
                </div>
            </div>
            <div class="pastille-solde permission" *ngIf="quota() as q">
                <i class="pi pi-heart"></i>
                <div>
                    <div class="valeur">{{ q.restant }} <small>/ {{ q.quota }} j</small></div>
                    <div class="libelle">Permissions restantes {{ exercice }}</div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .soldes { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; }
        .pastille-solde {
            display: flex; align-items: center; gap: 0.75rem;
            padding: 0.6rem 1.1rem; border-radius: 10px;
            border: 1px solid var(--surface-border); background: var(--surface-card);
        }
        .pastille-solde i { font-size: 1.4rem; }
        .pastille-solde.conge i { color: #16a34a; }
        .pastille-solde.permission i { color: #f97316; }
        .valeur { font-size: 1.25rem; font-weight: 700; line-height: 1.1; }
        .valeur small { font-weight: 400; color: var(--text-color-secondary); font-size: 0.85rem; }
        .libelle { font-size: 0.8rem; color: var(--text-color-secondary); }
    `]
})
export class SoldesAgentComponent implements OnInit {
    @Input() exercice = new Date().getFullYear();

    private drhService = inject(DrhService);
    private destroyRef = inject(DestroyRef);

    solde = signal<SoldeConge | null>(null);
    quota = signal<QuotaPermission | null>(null);

    ngOnInit(): void {
        this.drhService.soldeConge$(this.exercice).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.solde.set((r.data as any)?.solde || null),
            error: () => {}
        });
        this.drhService.quotaPermission$(this.exercice).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.quota.set((r.data as any)?.quota || null),
            error: () => {}
        });
    }
}
