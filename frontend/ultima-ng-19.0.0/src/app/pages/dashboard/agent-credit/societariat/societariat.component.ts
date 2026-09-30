import { CorrectionAgenceStats } from '@/interface/correction-agence-stats';
import { CorrectionDelegationStats } from '@/interface/correction-delegation-stats';
import { CorrectionPointVenteStats } from '@/interface/correction-pointvente-stats';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

/**
 * Assainissement des fiches clients : combien de corrections sont validées, rejetées et en
 * cours, par délégation, sur une période choisie. Le clic descend vers les agences puis les
 * points de service, en gardant la même période.
 */
@Component({
    selector: 'app-societariat',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, CardModule, DatePickerModule, ProgressSpinnerModule, SelectModule, TableModule, ToastModule],
    providers: [MessageService],
    templateUrl: './societariat.component.html'
})
export class SocietariatComponent implements OnInit {
    @Input() user: any;

    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

    delegations = signal<CorrectionDelegationStats[]>([]);
    agences = signal<CorrectionAgenceStats[]>([]);
    pointsDeService = signal<CorrectionPointVenteStats[]>([]);
    delegationChoisie = signal<CorrectionDelegationStats | null>(null);
    agenceChoisie = signal<CorrectionAgenceStats | null>(null);
    chargement = signal(false);

    // ── Période ──
    raccourci = 'semaine';
    du: Date | null = null;
    au: Date | null = null;
    raccourcis = [
        { label: 'Semaine en cours', value: 'semaine' },
        { label: 'Semaine passée', value: 'semainePassee' },
        { label: 'Mois en cours', value: 'mois' },
        { label: 'Mois passé', value: 'moisPasse' },
        { label: 'Depuis le début', value: 'tout' },
        { label: 'Période au choix', value: 'libre' }
    ];

    /** Totaux du réseau, calculés sur les lignes affichées. */
    totaux = computed(() => {
        const lignes = this.delegations();
        if (!lignes.length) return null;
        return {
            valide: lignes.reduce((t, d) => t + (d.valide || 0), 0),
            rejete: lignes.reduce((t, d) => t + (d.rejete || 0), 0),
            enAttente: lignes.reduce((t, d) => t + (d.enAttente || 0), 0),
            total: lignes.reduce((t, d) => t + (d.total || 0), 0)
        };
    });

    ngOnInit(): void {
        this.appliquerRaccourci();
    }

    // ==================== Période ====================

    /** Lundi de la semaine contenant la date donnée. */
    private lundiDe(d: Date): Date {
        const j = new Date(d);
        j.setDate(j.getDate() - ((j.getDay() + 6) % 7));
        j.setHours(0, 0, 0, 0);
        return j;
    }

    appliquerRaccourci(): void {
        const auj = new Date();
        switch (this.raccourci) {
            case 'semaine': {
                const lundi = this.lundiDe(auj);
                this.du = lundi;
                this.au = new Date(lundi.getTime() + 6 * 86400000);
                break;
            }
            case 'semainePassee': {
                const lundi = new Date(this.lundiDe(auj).getTime() - 7 * 86400000);
                this.du = lundi;
                this.au = new Date(lundi.getTime() + 6 * 86400000);
                break;
            }
            case 'mois':
                this.du = new Date(auj.getFullYear(), auj.getMonth(), 1);
                this.au = new Date(auj.getFullYear(), auj.getMonth() + 1, 0);
                break;
            case 'moisPasse':
                this.du = new Date(auj.getFullYear(), auj.getMonth() - 1, 1);
                this.au = new Date(auj.getFullYear(), auj.getMonth(), 0);
                break;
            case 'tout':
                this.du = null;
                this.au = null;
                break;
            case 'libre':
            default:
                return; // l'utilisateur saisit ses dates, on attend qu'elles soient complètes
        }
        this.charger();
    }

    /** Saisir une date bascule sur « Période au choix ». */
    surChangementDate(): void {
        this.raccourci = 'libre';
        if (this.du && this.au) {
            this.charger();
        }
    }

    libellePeriode(): string {
        if (!this.du && !this.au) return 'tout l’historique';
        const f = (d: Date | null) => (d ? d.toLocaleDateString('fr-FR') : '—');
        return `du ${f(this.du)} au ${f(this.au)}`;
    }

    private iso(d: Date | null): string | null {
        if (!d) return null;
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    // ==================== Chargement ====================

    /** Recharge le niveau affiché, en conservant la période et la position dans la hiérarchie. */
    charger(): void {
        if (this.agenceChoisie()) {
            this.chargerPointsDeService(this.agenceChoisie()!);
        } else if (this.delegationChoisie()) {
            this.chargerAgences(this.delegationChoisie()!);
        } else {
            this.chargerDelegations();
        }
    }

    private chargerDelegations(): void {
        this.chargement.set(true);
        const du = this.iso(this.du);
        const au = this.iso(this.au);
        const appel$ =
            du && au
                ? this.userService.getCorrectionStatsByDelegationWithPeriod$(du, au)
                : this.userService.getCorrectionStatsByDelegation$();
        appel$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => {
                // Les deux routes de délégations renvoient la clé « correctionStats », pas « correctionDelegationStats »
                const data = r.data as any;
                this.delegations.set((data?.correctionStats || data?.correctionDelegationStats || []) as CorrectionDelegationStats[]);
                this.chargement.set(false);
            },
            error: (e) => this.erreur(e)
        });
    }

    private chargerAgences(delegation: CorrectionDelegationStats): void {
        if (!delegation.delegationId) return;
        this.chargement.set(true);
        this.userService
            .getCorrectionStatsByAgence$(delegation.delegationId, this.iso(this.du), this.iso(this.au))
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r) => {
                    this.agences.set(((r.data as any)?.correctionAgenceStats || []) as CorrectionAgenceStats[]);
                    this.chargement.set(false);
                },
                error: (e) => this.erreur(e)
            });
    }

    private chargerPointsDeService(agence: CorrectionAgenceStats): void {
        if (!agence.agenceId) return;
        this.chargement.set(true);
        this.userService
            .getCorrectionStatsByPointVente$(agence.agenceId, this.iso(this.du), this.iso(this.au))
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r) => {
                    this.pointsDeService.set(((r.data as any)?.correctionPointVenteStats || []) as CorrectionPointVenteStats[]);
                    this.chargement.set(false);
                },
                error: (e) => this.erreur(e)
            });
    }

    // ==================== Navigation ====================

    choisirDelegation(d: CorrectionDelegationStats): void {
        if (!d.delegationId) {
            this.messageService.add({
                severity: 'info',
                summary: 'Non rattachée',
                detail: "Ces fiches ne sont rattachées à aucune délégation, il n'y a pas de détail à afficher",
                life: 5000
            });
            return;
        }
        this.delegationChoisie.set(d);
        this.agenceChoisie.set(null);
        this.chargerAgences(d);
    }

    choisirAgence(a: CorrectionAgenceStats): void {
        if (!a.agenceId) return;
        this.agenceChoisie.set(a);
        this.chargerPointsDeService(a);
    }

    revenirAuxDelegations(): void {
        this.delegationChoisie.set(null);
        this.agenceChoisie.set(null);
        this.chargerDelegations();
    }

    revenirAuxAgences(): void {
        this.agenceChoisie.set(null);
        if (this.delegationChoisie()) {
            this.chargerAgences(this.delegationChoisie()!);
        }
    }

    private erreur(e: any): void {
        this.chargement.set(false);
        this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: e?.message || e || 'Chargement impossible',
            life: 6000
        });
    }
}
