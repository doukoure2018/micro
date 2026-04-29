import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { ChangementTelephoneService } from '@/service/changement-telephone.service';
import { DemandeChangementTelephone, HistoriqueChangementTelephone, InspectionFiltre, StatutChangementTelephone } from '@/interface/demande-changement-telephone';

interface KpiCard {
    label: string;
    value: number;
    statut: StatutChangementTelephone | 'TOTAL';
    icon: string;
    color: string;
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
        ProgressSpinnerModule,
        TableModule,
        TagModule,
        TimelineModule,
        ToastModule,
        TooltipModule
    ],
    providers: [MessageService],
    templateUrl: './inspection-telephone.component.html'
})
export class InspectionTelephoneComponent implements OnInit {
    private service = inject(ChangementTelephoneService);
    private toast = inject(MessageService);

    demandes = signal<DemandeChangementTelephone[]>([]);
    statistiques = signal<Record<string, number>>({});
    loading = signal(false);

    showDetailDialog = signal(false);
    selectedDemande = signal<DemandeChangementTelephone | null>(null);
    historique = signal<HistoriqueChangementTelephone[]>([]);

    filtre: InspectionFiltre = {};

    statutOptions = [
        { label: 'Tous les statuts', value: null },
        { label: 'En attente DA', value: 'EN_ATTENTE_DA' },
        { label: 'Approuvee', value: 'APPROUVE' },
        { label: 'Rejetee', value: 'REJETE' },
        { label: 'Rejetee definitive', value: 'REJETE_DEFINITIF' },
        { label: 'Validee SAF', value: 'VALIDE_SAF' }
    ];

    kpis = computed<KpiCard[]>(() => {
        const stats = this.statistiques();
        const total = Object.values(stats).reduce((a, b) => a + b, 0);
        return [
            { label: 'Total', value: total, statut: 'TOTAL', icon: 'pi pi-list', color: 'bg-blue-50 text-blue-700' },
            { label: 'En attente', value: stats['EN_ATTENTE_DA'] ?? 0, statut: 'EN_ATTENTE_DA', icon: 'pi pi-clock', color: 'bg-yellow-50 text-yellow-700' },
            { label: 'Approuvees', value: stats['APPROUVE'] ?? 0, statut: 'APPROUVE', icon: 'pi pi-check', color: 'bg-cyan-50 text-cyan-700' },
            { label: 'Validees SAF', value: stats['VALIDE_SAF'] ?? 0, statut: 'VALIDE_SAF', icon: 'pi pi-check-circle', color: 'bg-green-50 text-green-700' },
            { label: 'Rejetees', value: (stats['REJETE'] ?? 0) + (stats['REJETE_DEFINITIF'] ?? 0), statut: 'REJETE', icon: 'pi pi-times-circle', color: 'bg-red-50 text-red-700' }
        ];
    });

    ngOnInit() {
        this.refresh();
    }

    refresh() {
        this.loading.set(true);
        this.service.getInspection(this.filtre).subscribe({
            next: (res) => {
                const data = res.data as any;
                this.demandes.set((data?.demandes ?? []) as DemandeChangementTelephone[]);
                this.statistiques.set((data?.statistiques ?? {}) as Record<string, number>);
                this.loading.set(false);
            },
            error: (err) => {
                this.toast.add({ severity: 'error', summary: 'Erreur', detail: err.message });
                this.loading.set(false);
            }
        });
    }

    resetFiltre() {
        this.filtre = {};
        this.refresh();
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
