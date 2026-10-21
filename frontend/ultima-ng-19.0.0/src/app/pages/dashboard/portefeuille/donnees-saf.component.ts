import { DonneesSaf } from '@/interface/donnees-saf';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TooltipModule } from 'primeng/tooltip';

/**
 * Repère « Données SAF au … » : depuis le 21/10/2026 les écrans qui lisent SAF (portefeuille,
 * contentieux, scores, rapports) voient la sauvegarde restaurée chaque matin, pas la production.
 * Le repère dit de quand datent les chiffres ; il disparaît si l'aiguillage est désactivé.
 */
@Component({
    selector: 'app-donnees-saf',
    standalone: true,
    imports: [CommonModule, TooltipModule],
    template: `
        <span *ngIf="etat() as e" class="donnees-saf" [class.direct]="!e.sauvegardeActive" [pTooltip]="aide(e)" tooltipPosition="bottom">
            <i class="pi" [ngClass]="e.sauvegardeActive ? 'pi-history' : 'pi-bolt'"></i>
            {{ e.mention }}
        </span>
    `,
    styles: [
        `
            .donnees-saf { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; padding: 2px 9px; border-radius: 12px; background: #e3f1f1; color: #0f6e6e; white-space: nowrap; }
            .donnees-saf.direct { background: #eceff3; color: #5a6577; }
        `
    ]
})
export class DonneesSafComponent implements OnInit {
    private readonly userService = inject(UserService);
    private readonly destroyRef = inject(DestroyRef);
    etat = signal<DonneesSaf | null>(null);

    ngOnInit(): void {
        this.userService
            .getDonneesSaf$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (e) => this.etat.set(e && e.mention ? e : null),
                error: () => this.etat.set(null)
            });
    }

    aide(e: DonneesSaf): string {
        return e.sauvegardeActive
            ? 'Les chiffres SAF de cette page viennent de la sauvegarde de la veille : un crédit mis en place ou un remboursement encaissé aujourd’hui n’apparaît que demain matin après la restauration.'
            : 'Les chiffres SAF de cette page sont lus directement dans la base de production.';
    }
}
