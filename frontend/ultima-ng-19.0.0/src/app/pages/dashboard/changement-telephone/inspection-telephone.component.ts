import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';

import { ChangementTelephoneService } from '@/service/changement-telephone.service';
import { DemandeChangementTelephone, HistoriqueChangementTelephone, StatutChangementTelephone } from '@/interface/demande-changement-telephone';

interface DropdownOption {
    label: string;
    value: number | null;
}

interface DelegationStats {
    name: string;
    total: number;
    enAttente: number;
    approuve: number;
    valide: number;
    rejete: number;
    tauxValidation: number;
}

@Component({
    selector: 'app-inspection-telephone',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CardModule,
        DialogModule,
        DropdownModule,
        InputTextModule,
        ProgressBarModule,
        ProgressSpinnerModule,
        TableModule,
        TagModule,
        TimelineModule,
        ToastModule,
        TooltipModule,
        DividerModule
    ],
    providers: [MessageService],
    templateUrl: './inspection-telephone.component.html'
})
export class InspectionTelephoneComponent implements OnInit {
    private service = inject(ChangementTelephoneService);
    private toast = inject(MessageService);

    // Liste maitre (chargee une fois sans filtres backend, filtrage cote client)
    allDemandes = signal<DemandeChangementTelephone[]>([]);
    loading = signal(false);

    // Filtres (signals pour reactivite des computed)
    selectedDelegationId = signal<number | null>(null);
    selectedAgenceId = signal<number | null>(null);
    selectedPointVenteId = signal<number | null>(null);
    selectedStatut = signal<StatutChangementTelephone | null>(null);

    // Dialog detail
    showDetailDialog = signal(false);
    selectedDemande = signal<DemandeChangementTelephone | null>(null);
    historique = signal<HistoriqueChangementTelephone[]>([]);

    statutOptions: DropdownOption[] = [
        { label: 'Tous', value: null },
        { label: 'En attente DA', value: 'EN_ATTENTE_DA' as any },
        { label: 'Approuvee', value: 'APPROUVE' as any },
        { label: 'Rejetee', value: 'REJETE' as any },
        { label: 'Rejetee definitive', value: 'REJETE_DEFINITIF' as any },
        { label: 'Validee SAF', value: 'VALIDE_SAF' as any }
    ];

    // Cascade hiérarchique: délégation → agence → point de service
    delegationOptions = computed<DropdownOption[]>(() => {
        const map = new Map<number, string>();
        for (const d of this.allDemandes()) {
            if (d.delegationId != null) {
                map.set(d.delegationId, d.delegationLibele ?? `Délégation #${d.delegationId}`);
            }
        }
        const opts = [...map.entries()].sort((a, b) => a[1].localeCompare(b[1])).map(([id, libele]) => ({ label: libele, value: id }));
        return [{ label: 'Toutes les délégations', value: null }, ...opts];
    });

    agenceOptions = computed<DropdownOption[]>(() => {
        const filterDelegation = this.selectedDelegationId();
        const map = new Map<number, string>();
        for (const d of this.allDemandes()) {
            if (filterDelegation != null && d.delegationId !== filterDelegation) continue;
            if (d.agenceId != null) {
                map.set(d.agenceId, d.agenceLibele ?? `Agence #${d.agenceId}`);
            }
        }
        const opts = [...map.entries()].sort((a, b) => a[1].localeCompare(b[1])).map(([id, libele]) => ({ label: libele, value: id }));
        return [{ label: 'Toutes les agences', value: null }, ...opts];
    });

    pointVenteOptions = computed<DropdownOption[]>(() => {
        const filterAgence = this.selectedAgenceId();
        const filterDelegation = this.selectedDelegationId();
        const map = new Map<number, string>();
        for (const d of this.allDemandes()) {
            if (filterDelegation != null && d.delegationId !== filterDelegation) continue;
            if (filterAgence != null && d.agenceId !== filterAgence) continue;
            if (d.pointVenteId != null) {
                map.set(d.pointVenteId, d.pointVenteLibele ?? `Point de service #${d.pointVenteId}`);
            }
        }
        const opts = [...map.entries()].sort((a, b) => a[1].localeCompare(b[1])).map(([id, libele]) => ({ label: libele, value: id }));
        return [{ label: 'Tous les points de service', value: null }, ...opts];
    });

    // Demandes filtrees (cote client)
    filteredDemandes = computed<DemandeChangementTelephone[]>(() => {
        const dId = this.selectedDelegationId();
        const aId = this.selectedAgenceId();
        const pId = this.selectedPointVenteId();
        const st = this.selectedStatut();
        return this.allDemandes().filter(d => {
            if (dId != null && d.delegationId !== dId) return false;
            if (aId != null && d.agenceId !== aId) return false;
            if (pId != null && d.pointVenteId !== pId) return false;
            if (st && d.statut !== st) return false;
            return true;
        });
    });

    // Statistiques calculees a partir du sous-ensemble filtre
    stats = computed(() => {
        const list = this.filteredDemandes();
        const total = list.length;
        const enAttente = list.filter(x => x.statut === 'EN_ATTENTE_DA').length;
        const approuve = list.filter(x => x.statut === 'APPROUVE').length;
        const valide = list.filter(x => x.statut === 'VALIDE_SAF').length;
        const rejeteSimple = list.filter(x => x.statut === 'REJETE').length;
        const rejeteDef = list.filter(x => x.statut === 'REJETE_DEFINITIF').length;
        const rejete = rejeteSimple + rejeteDef;
        const totalNonZero = total || 1;
        return {
            total, enAttente, approuve, valide, rejeteSimple, rejeteDef, rejete,
            pctEnAttente: Math.round(enAttente / totalNonZero * 100),
            pctApprouve: Math.round(approuve / totalNonZero * 100),
            pctValide: Math.round(valide / totalNonZero * 100),
            pctRejete: Math.round(rejete / totalNonZero * 100),
            tauxReussite: total > 0 ? Math.round(valide / total * 100) : 0,
            tauxRejet: total > 0 ? Math.round(rejete / total * 100) : 0,
            sommeRejets: list.reduce((sum, d) => sum + (d.nombreRejets ?? 0), 0)
        };
    });

    // Top 5 delegations par volume
    topDelegations = computed<DelegationStats[]>(() => {
        const map = new Map<string, DelegationStats>();
        for (const d of this.filteredDemandes()) {
            const key = d.delegationLibele ?? 'Non définie';
            const e = map.get(key) ?? { name: key, total: 0, enAttente: 0, approuve: 0, valide: 0, rejete: 0, tauxValidation: 0 };
            e.total++;
            if (d.statut === 'EN_ATTENTE_DA') e.enAttente++;
            else if (d.statut === 'APPROUVE') e.approuve++;
            else if (d.statut === 'VALIDE_SAF') e.valide++;
            else if (d.statut === 'REJETE' || d.statut === 'REJETE_DEFINITIF') e.rejete++;
            map.set(key, e);
        }
        const arr = [...map.values()].sort((a, b) => b.total - a.total).slice(0, 5);
        for (const e of arr) {
            e.tauxValidation = e.total > 0 ? Math.round(e.valide / e.total * 100) : 0;
        }
        return arr;
    });

    constructor() {
        // Reset cascade automatiquement: changement de delegation efface agence + point de service
        effect(() => {
            this.selectedDelegationId();
            this.selectedAgenceId.set(null);
            this.selectedPointVenteId.set(null);
        }, { allowSignalWrites: true });

        effect(() => {
            this.selectedAgenceId();
            this.selectedPointVenteId.set(null);
        }, { allowSignalWrites: true });
    }

    ngOnInit() {
        this.refresh();
    }

    /** Charge toutes les demandes une fois (pas de filtre backend, filtrage cote client) */
    refresh() {
        this.loading.set(true);
        this.service.getInspection({}).subscribe({
            next: (res) => {
                const data = res.data as any;
                this.allDemandes.set((data?.demandes ?? []) as DemandeChangementTelephone[]);
                this.loading.set(false);
            },
            error: (err) => {
                this.toast.add({ severity: 'error', summary: 'Erreur', detail: err.message });
                this.loading.set(false);
            }
        });
    }

    resetFiltres() {
        this.selectedDelegationId.set(null);
        this.selectedAgenceId.set(null);
        this.selectedPointVenteId.set(null);
        this.selectedStatut.set(null);
    }

    openDetail(d: DemandeChangementTelephone) {
        this.selectedDemande.set(d);
        this.historique.set([]);
        this.showDetailDialog.set(true);
        if (d.id) {
            this.service.getDetail(d.id).subscribe({
                next: (res) => {
                    this.historique.set(((res.data as any)?.historique ?? []) as HistoriqueChangementTelephone[]);
                },
                error: (err) => {
                    this.toast.add({ severity: 'error', summary: 'Erreur historique', detail: err.message });
                }
            });
        }
    }

    statutSeverity(statut?: StatutChangementTelephone): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        switch (statut) {
            case 'VALIDE_SAF': return 'success';
            case 'APPROUVE': return 'info';
            case 'EN_ATTENTE_DA': return 'warn';
            case 'REJETE':
            case 'REJETE_DEFINITIF': return 'danger';
            default: return 'secondary';
        }
    }

    statutLabel(statut?: StatutChangementTelephone): string {
        switch (statut) {
            case 'EN_ATTENTE_DA': return 'En attente DA';
            case 'APPROUVE': return 'Approuvee';
            case 'REJETE': return 'Rejetee';
            case 'REJETE_DEFINITIF': return 'Rejetee definitive';
            case 'VALIDE_SAF': return 'Validee SAF';
            default: return statut ?? '';
        }
    }

    actionSeverity(action: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        switch (action) {
            case 'REJETE': return 'warn';
            case 'REJETE_DEFINITIF': return 'danger';
            case 'RESOUMIS': return 'info';
            default: return 'secondary';
        }
    }
}
