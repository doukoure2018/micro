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
        <ng-container *ngIf="etat() as e">
            <span *ngIf="!e.enRestauration" class="donnees-saf" [class.direct]="!e.sauvegardeActive" [pTooltip]="aide(e)" tooltipPosition="bottom">
                <i class="pi" [ngClass]="e.sauvegardeActive ? 'pi-history' : 'pi-bolt'"></i>
                {{ e.mention }}
            </span>
            <div *ngIf="e.enRestauration" class="restauration">
                <i class="pi pi-clock"></i>
                <div><strong>{{ e.messageInfo }}</strong><div class="text-xs">Les chiffres SAF de cette page (portefeuille, retards, contrôles) ne peuvent pas être lus pendant la restauration quotidienne ; les saisies et les dossiers digi restent accessibles.</div></div>
            </div>
            <div *ngIf="!e.enRestauration && e.enCloture" class="cloture">
                <i class="pi pi-moon"></i>
                <div><strong>{{ e.messageInfo }}</strong><div class="text-xs">Cette page continue de fonctionner normalement sur la sauvegarde du matin. Seules les vérifications en direct dans la production — numéro de membre à la saisie, contrôle d'un crédit négatif — sont reportées à demain matin ; une saisie faite ce soir est acceptée sous réserve.</div></div>
            </div>
        </ng-container>
    `,
    styles: [
        `
            :host { display: contents; }
            .donnees-saf { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; padding: 2px 9px; border-radius: 12px; background: #e3f1f1; color: #0f6e6e; white-space: nowrap; }
            .donnees-saf.direct { background: #eceff3; color: #5a6577; }
            .restauration { flex-basis: 100%; display: flex; gap: 10px; align-items: flex-start; margin-top: 8px; padding: 10px 12px; border-radius: 6px; border: 1px solid #93c5fd; background: #eff6ff; color: #1e3a8a; font-size: 14px; font-weight: normal; }
            .restauration .pi { margin-top: 2px; }
            .cloture { flex-basis: 100%; display: flex; gap: 10px; align-items: flex-start; margin-top: 8px; padding: 10px 12px; border-radius: 6px; border: 1px solid #fcd34d; background: #fffbeb; color: #78451a; font-size: 14px; font-weight: normal; }
            .cloture .pi { margin-top: 2px; }
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
