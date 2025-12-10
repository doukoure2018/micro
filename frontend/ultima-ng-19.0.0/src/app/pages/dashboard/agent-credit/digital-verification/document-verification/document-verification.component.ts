import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EtatDocumentByDelegationDto, DelegationDto, StatutDocument, EtatsParDelegation, DelegationStats } from '@/interface/etat-document.model';
import { UserService } from '@/service/user.service';
import { Delegation } from '@/interface/delegation';

interface State {
    delegations: Delegation[];
    etatsParDelegation: Map<number, EtatDocumentByDelegationDto[]>;
    statistics: DelegationStats[];
    selectedDelegation: DelegationDto | null;
    selectedStatut: StatutDocument | 'ALL';
    loading: boolean;
    error: string | null;
    expandedDelegations: Set<number>;
}

@Component({
    selector: 'app-document-verification',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './document-verification.component.html',
    styleUrls: ['./document-verification.component.scss'],
    providers: [UserService]
})
export class DocumentVerificationComponent implements OnInit {
    private userService = inject(UserService);
    private router = inject(Router);

    state = signal<State>({
        delegations: [],
        etatsParDelegation: new Map(),
        statistics: [],
        selectedDelegation: null,
        selectedStatut: 'ALL',
        loading: false,
        error: null,
        expandedDelegations: new Set()
    });

    // Computed pour grouper les états par délégation
    etatsGroupes = computed(() => {
        const { delegations, etatsParDelegation, statistics } = this.state();

        return delegations
            .map((delegation) => {
                const etats = etatsParDelegation.get(delegation.id!) || [];
                const stats = statistics.find((s) => s.delegationId === delegation.id);

                return {
                    delegation,
                    etats,
                    stats: stats
                        ? {
                              total: stats.totalEtats,
                              encours: stats.encoursCount,
                              valide: stats.valideCount,
                              accepte: stats.accepteCount,
                              rejet: stats.rejetCount
                          }
                        : {
                              total: etats.length,
                              encours: etats.filter((e) => e.statut === 'ENCOURS').length,
                              valide: etats.filter((e) => e.statut === 'VALIDE').length,
                              accepte: etats.filter((e) => e.statut === 'ACCEPTE').length,
                              rejet: etats.filter((e) => e.statut === 'REJET').length
                          }
                } as EtatsParDelegation;
            })
            .filter((g) => g.etats.length > 0 || g.stats.total > 0);
    });

    // Filtrer les états selon le statut sélectionné
    filteredEtats = computed(() => {
        const { selectedStatut } = this.state();
        const groupes = this.etatsGroupes();

        if (selectedStatut === 'ALL') {
            return groupes;
        }

        return groupes
            .map((groupe) => ({
                ...groupe,
                etats: groupe.etats.filter((e) => e.statut === selectedStatut)
            }))
            .filter((g) => g.etats.length > 0);
    });

    statutOptions: { value: StatutDocument | 'ALL'; label: string; color: string }[] = [
        { value: 'ALL', label: 'Tous', color: 'secondary' },
        { value: 'ENCOURS', label: 'En cours', color: 'warning' },
        { value: 'VALIDE', label: 'Validé', color: 'info' },
        { value: 'ACCEPTE', label: 'Accepté', color: 'success' },
        { value: 'REJET', label: 'Rejeté', color: 'danger' }
    ];

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.updateState({ loading: true, error: null });

        // Charger les délégations et les statistiques
        Promise.all([this.loadDelegations(), this.loadStatistics(), this.loadAllEtats()]).finally(() => {
            this.updateState({ loading: false });
        });
    }

    private async loadDelegations(): Promise<void> {
        try {
            const response = await this.userService.getAllDelegationsBackoffice$().toPromise();
            if (response?.data?.delegations) {
                this.updateState({ delegations: response.data.delegations });
            }
        } catch (error) {
            console.error('Erreur chargement délégations:', error);
        }
    }

    private async loadStatistics(): Promise<void> {
        try {
            const response = await this.userService.getStatsEtatsDocuments$().toPromise();
            if (response?.data?.statistics) {
                this.updateState({ statistics: response.data.statistics });
            }
        } catch (error) {
            console.error('Erreur chargement statistiques:', error);
        }
    }

    private async loadAllEtats(): Promise<void> {
        try {
            const response = await this.userService.getAllEtatsDocuments$(0, 100).toPromise();
            if (response?.data?.etats) {
                const etatsParDelegation = new Map<number, EtatDocumentByDelegationDto[]>();

                response.data.etats.forEach((etat: EtatDocumentByDelegationDto) => {
                    const delegationId = etat.delegationId || 0;
                    if (!etatsParDelegation.has(delegationId)) {
                        etatsParDelegation.set(delegationId, []);
                    }
                    etatsParDelegation.get(delegationId)!.push(etat);
                });

                this.updateState({ etatsParDelegation });
            }
        } catch (error) {
            console.error('Erreur chargement états:', error);
            this.updateState({ error: 'Erreur lors du chargement des données' });
        }
    }

    async loadEtatsByDelegation(delegationId: number): Promise<void> {
        try {
            const { selectedStatut } = this.state();
            const statut = selectedStatut !== 'ALL' ? selectedStatut : undefined;

            const response = await this.userService.getEtatsByDelegation$(delegationId, 0, 50, statut).toPromise();

            if (response?.data?.etats) {
                const { etatsParDelegation } = this.state();
                const newMap = new Map(etatsParDelegation);
                newMap.set(delegationId, response.data.etats);
                this.updateState({ etatsParDelegation: newMap });
            }
        } catch (error) {
            console.error('Erreur chargement états délégation:', error);
        }
    }

    toggleDelegation(delegationId: number): void {
        const { expandedDelegations } = this.state();
        const newSet = new Set(expandedDelegations);

        if (newSet.has(delegationId)) {
            newSet.delete(delegationId);
        } else {
            newSet.add(delegationId);
            this.loadEtatsByDelegation(delegationId);
        }

        this.updateState({ expandedDelegations: newSet });
    }

    isDelegationExpanded(delegationId: number): boolean {
        return this.state().expandedDelegations.has(delegationId);
    }

    onStatutChange(statut: StatutDocument | 'ALL'): void {
        this.updateState({ selectedStatut: statut });

        // Recharger les états pour les délégations ouvertes
        const { expandedDelegations } = this.state();
        expandedDelegations.forEach((delegationId) => {
            this.loadEtatsByDelegation(delegationId);
        });
    }

    viewDetail(etatId: number): void {
        this.router.navigate(['/dashboards/document-verification/documents', etatId]);
    }

    getStatutClass(statut: StatutDocument): string {
        const classes: Record<StatutDocument, string> = {
            ENCOURS: 'badge-warning',
            VALIDE: 'badge-info',
            ACCEPTE: 'badge-success',
            REJET: 'badge-danger'
        };
        return classes[statut] || 'badge-secondary';
    }

    getStatutLabel(statut: StatutDocument): string {
        const labels: Record<StatutDocument, string> = {
            ENCOURS: 'En cours',
            VALIDE: 'Validé',
            ACCEPTE: 'Accepté',
            REJET: 'Rejeté'
        };
        return labels[statut] || statut;
    }

    formatDate(dateString: string): string {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    private updateState(partial: Partial<State>): void {
        this.state.update((current) => ({ ...current, ...partial }));
    }

    refresh(): void {
        this.loadData();
    }
}
