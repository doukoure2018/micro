import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

type Tranche = 'GROS' | 'PETIT';
type TrancheFilter = 'ALL' | Tranche;

@Component({
    selector: 'app-inspection-credits',
    standalone: true,
    imports: [
        CommonModule, FormsModule, TableModule, ButtonModule, TagModule, ToastModule,
        IconFieldModule, InputIconModule, InputTextModule, ProgressSpinnerModule, SelectModule
    ],
    templateUrl: './inspection-credits.component.html',
    providers: [MessageService]
})
export class InspectionCreditsComponent implements OnInit {
    /** Seuil gros / petit credit : 100M GNF (aligne sur le seuil d'aiguillage vers le DG) */
    static readonly SEUIL_GROS_GNF = 100_000_000;

    allDemandes = signal<any[]>([]);
    loading = signal(false);
    searchValue = signal<string>('');

    trancheFilter = signal<TrancheFilter>('ALL');
    selectedDelegation = signal<string | null>(null);
    selectedAgence = signal<string | null>(null);
    selectedPointvente = signal<string | null>(null);

    private userService = inject(UserService);
    private destroyRef = inject(DestroyRef);
    private messageService = inject(MessageService);

    // ---- Options de filtres, extraites dynamiquement des donnees ----
    delegationOptions = computed(() => {
        const unique = [...new Set(this.allDemandes().map((d) => d.delegationLibele).filter(Boolean))].sort();
        return [{ label: 'Toutes les délégations', value: null }, ...unique.map((d) => ({ label: d, value: d }))];
    });

    agenceOptions = computed(() => {
        let demandes = this.allDemandes();
        const del = this.selectedDelegation();
        if (del) demandes = demandes.filter((d) => d.delegationLibele === del);
        const unique = [...new Set(demandes.map((d) => d.agenceLibele).filter(Boolean))].sort();
        return [{ label: 'Toutes les agences', value: null }, ...unique.map((a) => ({ label: a, value: a }))];
    });

    pointventeOptions = computed(() => {
        let demandes = this.allDemandes();
        const del = this.selectedDelegation();
        const ag = this.selectedAgence();
        if (del) demandes = demandes.filter((d) => d.delegationLibele === del);
        if (ag) demandes = demandes.filter((d) => d.agenceLibele === ag);
        const unique = [...new Set(demandes.map((d) => d.pointventeLibele).filter(Boolean))].sort();
        return [{ label: 'Tous les points de vente', value: null }, ...unique.map((p) => ({ label: p, value: p }))];
    });

    // ---- Donnees enrichies (tranche) puis filtrees ----
    private enriched = computed(() =>
        this.allDemandes().map((d) => ({
            ...d,
            _montant: Number(d.montantDemande) || 0,
            tranche: (Number(d.montantDemande) || 0) >= InspectionCreditsComponent.SEUIL_GROS_GNF ? 'GROS' : 'PETIT'
        }))
    );

    private perimeterFiltered = computed(() => {
        const del = this.selectedDelegation();
        const ag = this.selectedAgence();
        const pv = this.selectedPointvente();
        const q = this.searchValue().trim().toLowerCase();
        return this.enriched().filter(
            (d) =>
                (!del || d.delegationLibele === del) &&
                (!ag || d.agenceLibele === ag) &&
                (!pv || d.pointventeLibele === pv) &&
                (!q ||
                    [d.nom, d.prenom, d.numeroMembre, d.objectCredit, d.delegationLibele, d.agenceLibele, d.pointventeLibele]
                        .some((v) => (v ? String(v).toLowerCase().includes(q) : false)))
        );
    });

    /** Liste finale affichee : filtre tranche + tri GROS d'abord puis montant decroissant (pour le regroupement) */
    displayedDemandes = computed(() => {
        const tf = this.trancheFilter();
        const rows = this.perimeterFiltered().filter((d) => tf === 'ALL' || d.tranche === tf);
        return [...rows].sort((a, b) => {
            if (a.tranche !== b.tranche) return a.tranche === 'GROS' ? -1 : 1;
            return b._montant - a._montant;
        });
    });

    // ---- Totaux (sur le perimetre courant, avant filtre tranche) ----
    private base = computed(() => this.perimeterFiltered());
    grosCount = computed(() => this.base().filter((d) => d.tranche === 'GROS').length);
    petitCount = computed(() => this.base().filter((d) => d.tranche === 'PETIT').length);
    totalCount = computed(() => this.base().length);
    grosMontant = computed(() => this.base().filter((d) => d.tranche === 'GROS').reduce((s, d) => s + d._montant, 0));
    petitMontant = computed(() => this.base().filter((d) => d.tranche === 'PETIT').reduce((s, d) => s + d._montant, 0));
    totalMontant = computed(() => this.base().reduce((s, d) => s + d._montant, 0));

    ngOnInit(): void {
        this.load();
    }

    private load(): void {
        this.loading.set(true);
        this.userService
            .getInspectionCreditsDR$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.allDemandes.set(response.data?.workflowDemandes || []);
                    this.loading.set(false);
                },
                error: () => {
                    this.loading.set(false);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: "Erreur lors du chargement de l'inspection des crédits",
                        life: 5000
                    });
                }
            });
    }

    setTranche(t: TrancheFilter): void {
        this.trancheFilter.set(t);
    }

    onDelegationChange(value: string | null): void {
        this.selectedDelegation.set(value);
        this.selectedAgence.set(null);
        this.selectedPointvente.set(null);
    }

    onAgenceChange(value: string | null): void {
        this.selectedAgence.set(value);
        this.selectedPointvente.set(null);
    }

    resetFilters(): void {
        this.trancheFilter.set('ALL');
        this.selectedDelegation.set(null);
        this.selectedAgence.set(null);
        this.selectedPointvente.set(null);
        this.searchValue.set('');
    }

    // ---- Helpers d'affichage ----
    formatMontant(value: number | string | null | undefined): string {
        const n = Number(value) || 0;
        return new Intl.NumberFormat('fr-FR').format(n) + ' GNF';
    }

    formatDate(value: string | null | undefined): string {
        if (!value) return '—';
        const d = String(value).slice(0, 10); // yyyy-MM-dd
        const parts = d.split('-');
        return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : d;
    }

    stateLabel(state: string): string {
        const map: Record<string, string> = {
            VALIDATED_DR: 'En attente DE',
            PENDING_DG: 'En visa DG',
            VALIDATED_FINAL: 'Mis en place',
            REJETE_DG: 'Rejeté DG',
            CORRECTION_DE: 'Correction DE',
            CORRECTION_DR: 'Correction DR',
            CORRECTION: 'Correction AC'
        };
        return map[state] || state;
    }

    stateSeverity(state: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        const map: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
            VALIDATED_DR: 'info',
            PENDING_DG: 'warn',
            VALIDATED_FINAL: 'success',
            REJETE_DG: 'danger',
            CORRECTION_DE: 'danger',
            CORRECTION_DR: 'danger',
            CORRECTION: 'danger'
        };
        return map[state] || 'secondary';
    }
}
