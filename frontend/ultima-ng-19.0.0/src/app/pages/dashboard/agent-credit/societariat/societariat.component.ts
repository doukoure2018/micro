import { IUser } from '@/interface/user';
import { Component, Input, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { DatePickerModule } from 'primeng/datepicker';
import { UserService } from '@/service/user.service';
import { CorrectionDelegationStats } from '@/interface/correction-delegation-stats';
import { CorrectionAgenceStats } from '@/interface/correction-agence-stats';
import { CorrectionPointVenteStats } from '@/interface/correction-pointvente-stats';
import { CorrectionEvolutionStats } from '@/interface/correction-evolution-stats';
import { HttpErrorResponse } from '@angular/common/http';
import { SocietariatByAgenceComponent } from './societariat-by-agence/societariat-by-agence.component';
import { SocietariatByPsComponent } from './societariat-by-ps/societariat-by-ps.component';

@Component({
    selector: 'app-societariat',
    imports: [CommonModule, CardModule, TableModule, ProgressSpinnerModule, ButtonModule, ChartModule, SelectButtonModule, FormsModule, TooltipModule, TagModule, DatePickerModule, SocietariatByAgenceComponent, SocietariatByPsComponent],
    templateUrl: './societariat.component.html',
    styleUrl: './societariat.component.scss'
})
export class SocietariatComponent implements OnInit {
    @Input() user?: IUser;

    private userService = inject(UserService);

    // Date range for period filter
    dateDebut: Date | null = null;
    dateFin: Date | null = null;
    maxDate: Date = new Date();
    usePeriodFilter = false;

    // Chart period options
    chartPeriodOptions = [
        { label: 'Par jour', value: 'day' },
        { label: 'Par semaine', value: 'week' }
    ];
    selectedPeriod = 'day';

    // View mode options and other
    viewModeOptions = [
        { label: 'Graphique', value: 'chart', icon: 'pi pi-chart-line' },
        { label: 'Tableau', value: 'table', icon: 'pi pi-table' },
        { label: 'Comparaison', value: 'comparison', icon: 'pi pi-arrows-h' }
    ];
    selectedViewMode = 'chart';

    // Show comparison toggle
    showComparison = false;

    state = signal<{
        loading: boolean;
        stats: CorrectionDelegationStats[];
        error?: string;
        loadingAgences: boolean;
        agences: CorrectionAgenceStats[];
        agenceError?: string;
        loadingPoints: boolean;
        points: CorrectionPointVenteStats[];
        pointError?: string;
        selectedDelegation?: CorrectionDelegationStats | null;
        selectedAgence?: CorrectionAgenceStats | null;
        loadingChart: boolean;
        evolutionByDay: CorrectionEvolutionStats[];
        evolutionByWeek: CorrectionEvolutionStats[];
        chartError?: string;
    }>({
        loading: false,
        stats: [],
        error: undefined,
        loadingAgences: false,
        agences: [],
        agenceError: undefined,
        loadingPoints: false,
        points: [],
        pointError: undefined,
        selectedDelegation: null,
        selectedAgence: null,
        loadingChart: false,
        evolutionByDay: [],
        evolutionByWeek: [],
        chartError: undefined
    });

    isLoading = computed(() => this.state().loading);
    stats = computed(() => this.state().stats);
    error = computed(() => this.state().error);
    agences = computed(() => this.state().agences);
    points = computed(() => this.state().points);
    loadingAgences = computed(() => this.state().loadingAgences);
    loadingPoints = computed(() => this.state().loadingPoints);
    selectedDelegation = computed(() => this.state().selectedDelegation);
    selectedAgence = computed(() => this.state().selectedAgence);
    agenceError = computed(() => this.state().agenceError);
    pointError = computed(() => this.state().pointError);
    loadingChart = computed(() => this.state().loadingChart);
    chartError = computed(() => this.state().chartError);

    // Evolution data computed
    evolutionData = computed(() => {
        return this.selectedPeriod === 'day' ? this.state().evolutionByDay : this.state().evolutionByWeek;
    });

    // Summary statistics computed
    summaryStats = computed(() => {
        const data = this.evolutionData();
        if (!data || data.length === 0) return null;

        const current = data.reduce(
            (acc, d) => ({
                enAttente: acc.enAttente + d.enAttente,
                rejete: acc.rejete + d.rejete,
                valide: acc.valide + d.valide,
                total: acc.total + d.total
            }),
            { enAttente: 0, rejete: 0, valide: 0, total: 0 }
        );

        const previous = data.reduce(
            (acc, d) => ({
                enAttente: acc.enAttente + (d.enAttentePrev || 0),
                rejete: acc.rejete + (d.rejetePrev || 0),
                valide: acc.valide + (d.validePrev || 0),
                total: acc.total + (d.totalPrev || 0)
            }),
            { enAttente: 0, rejete: 0, valide: 0, total: 0 }
        );

        const calcVariation = (curr: number, prev: number) => (prev > 0 ? Math.round(((curr - prev) / prev) * 100 * 100) / 100 : null);

        return {
            current,
            previous,
            variations: {
                enAttente: calcVariation(current.enAttente, previous.enAttente),
                rejete: calcVariation(current.rejete, previous.rejete),
                valide: calcVariation(current.valide, previous.valide),
                total: calcVariation(current.total, previous.total)
            }
        };
    });

    // Chart data computed with comparison option
    chartData = computed(() => {
        const data = this.evolutionData();
        if (!data || data.length === 0) return null;

        const datasets: any[] = [
            {
                label: 'En attente',
                data: data.map((d) => d.enAttente),
                fill: false,
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                tension: 0.4
            },
            {
                label: 'Rejetées',
                data: data.map((d) => d.rejete),
                fill: false,
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                tension: 0.4
            },
            {
                label: 'Validées',
                data: data.map((d) => d.valide),
                fill: false,
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                tension: 0.4
            },
            {
                label: 'Total',
                data: data.map((d) => d.total),
                fill: false,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                tension: 0.4,
                borderDash: [5, 5]
            }
        ];

        // Add comparison datasets if enabled
        if (this.showComparison) {
            datasets.push(
                {
                    label: 'En attente (période préc.)',
                    data: data.map((d) => d.enAttentePrev || 0),
                    fill: false,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4,
                    borderDash: [10, 5],
                    borderWidth: 1
                },
                {
                    label: 'Rejetées (période préc.)',
                    data: data.map((d) => d.rejetePrev || 0),
                    fill: false,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    borderDash: [10, 5],
                    borderWidth: 1
                },
                {
                    label: 'Validées (période préc.)',
                    data: data.map((d) => d.validePrev || 0),
                    fill: false,
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4,
                    borderDash: [10, 5],
                    borderWidth: 1
                },
                {
                    label: 'Total (période préc.)',
                    data: data.map((d) => d.totalPrev || 0),
                    fill: false,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                    borderDash: [10, 5],
                    borderWidth: 1
                }
            );
        }

        return {
            labels: data.map((d) => d.periode),
            datasets
        };
    });

    chartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                callbacks: {
                    afterBody: (context: any) => {
                        const dataIndex = context[0]?.dataIndex;
                        const data = this.evolutionData();
                        if (dataIndex !== undefined && data && data[dataIndex]) {
                            const item = data[dataIndex];
                            const lines = [];
                            if (item.totalVariation !== null && item.totalVariation !== undefined) {
                                const sign = item.totalVariation >= 0 ? '+' : '';
                                lines.push(`Variation totale: ${sign}${item.totalVariation}%`);
                            }
                            return lines;
                        }
                        return [];
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#6b7280'
                },
                grid: {
                    color: '#e5e7eb'
                }
            },
            y: {
                ticks: {
                    color: '#6b7280'
                },
                grid: {
                    color: '#e5e7eb'
                },
                beginAtZero: true
            }
        }
    };

    ngOnInit(): void {
        this.loadStats();
        this.loadChartData();
    }

    loadStats(): void {
        this.state.update((s) => ({ ...s, loading: true, error: undefined }));

        // Use period filter if dates are set
        if (this.usePeriodFilter && this.dateDebut && this.dateFin) {
            const dateDebutStr = this.formatDateForApi(this.dateDebut);
            const dateFinStr = this.formatDateForApi(this.dateFin);

            this.userService.getCorrectionStatsByDelegationWithPeriod$(dateDebutStr, dateFinStr).subscribe({
                next: (response) => {
                    const stats = response.data?.correctionStats || [];
                    this.state.update((s) => ({
                        ...s,
                        stats,
                        loading: false,
                        selectedDelegation: null,
                        selectedAgence: null,
                        agences: [],
                        points: []
                    }));
                },
                error: (err: HttpErrorResponse) => {
                    const message = err.error?.message || 'Erreur lors du chargement des statistiques.';
                    this.state.update((s) => ({ ...s, loading: false, error: message }));
                }
            });
        } else {
            this.userService.getCorrectionStatsByDelegation$().subscribe({
                next: (response) => {
                    const stats = response.data?.correctionStats || [];
                    this.state.update((s) => ({
                        ...s,
                        stats,
                        loading: false,
                        selectedDelegation: null,
                        selectedAgence: null,
                        agences: [],
                        points: []
                    }));
                },
                error: (err: HttpErrorResponse) => {
                    const message = err.error?.message || 'Erreur lors du chargement des statistiques.';
                    this.state.update((s) => ({ ...s, loading: false, error: message }));
                }
            });
        }
    }

    formatDateForApi(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    onApplyPeriodFilter(): void {
        if (this.dateDebut && this.dateFin) {
            if (this.dateDebut > this.dateFin) {
                this.state.update((s) => ({ ...s, error: 'La date de début doit être antérieure à la date de fin.' }));
                return;
            }
            this.usePeriodFilter = true;
            this.loadStats();
        }
    }

    onClearPeriodFilter(): void {
        this.dateDebut = null;
        this.dateFin = null;
        this.usePeriodFilter = false;
        this.loadStats();
    }

    loadChartData(): void {
        this.state.update((s) => ({ ...s, loadingChart: true, chartError: undefined }));

        this.userService.getCorrectionEvolutionByDay$().subscribe({
            next: (response) => {
                const evolutionByDay = response.data?.evolutionByDay || [];
                this.state.update((s) => ({ ...s, evolutionByDay }));
            },
            error: (err: HttpErrorResponse) => {
                console.error('Erreur chargement évolution par jour:', err);
            }
        });

        this.userService.getCorrectionEvolutionByWeek$().subscribe({
            next: (response) => {
                const evolutionByWeek = response.data?.evolutionByWeek || [];
                this.state.update((s) => ({ ...s, evolutionByWeek, loadingChart: false }));
            },
            error: (err: HttpErrorResponse) => {
                const message = err.error?.message || 'Erreur lors du chargement des données du graphique.';
                this.state.update((s) => ({ ...s, loadingChart: false, chartError: message }));
            }
        });
    }

    onPeriodChange(): void {
        // The chart data will automatically update via the computed signal
    }

    onViewModeChange(): void {
        // View mode changed
    }

    toggleComparison(): void {
        this.showComparison = !this.showComparison;
    }

    getVariationClass(variation: number | null | undefined): string {
        if (variation === null || variation === undefined) return '';
        if (variation > 0) return 'variation-up';
        if (variation < 0) return 'variation-down';
        return 'variation-neutral';
    }

    getVariationIcon(variation: number | null | undefined): string {
        if (variation === null || variation === undefined) return '';
        if (variation > 0) return 'pi pi-arrow-up';
        if (variation < 0) return 'pi pi-arrow-down';
        return 'pi pi-minus';
    }

    formatVariation(variation: number | null | undefined): string {
        if (variation === null || variation === undefined) return '-';
        const sign = variation >= 0 ? '+' : '';
        return `${sign}${variation}%`;
    }

    onSelectDelegation(row: CorrectionDelegationStats): void {
        if (!row?.delegationId) {
            this.state.update((s) => ({
                ...s,
                selectedDelegation: row,
                selectedAgence: null,
                agences: [],
                points: [],
                agenceError: 'Identifiant de délégation manquant'
            }));
            return;
        }

        this.state.update((s) => ({
            ...s,
            selectedDelegation: row,
            selectedAgence: null,
            agences: [],
            points: [],
            agenceError: undefined,
            pointError: undefined,
            loadingAgences: true
        }));

        this.userService.getCorrectionStatsByAgence$(row.delegationId).subscribe({
            next: (response) => {
                const agences = response.data?.correctionAgenceStats || [];
                this.state.update((s) => ({ ...s, agences, loadingAgences: false }));
            },
            error: (err: HttpErrorResponse) => {
                const message = err.error?.message || 'Erreur lors du chargement des agences.';
                this.state.update((s) => ({ ...s, loadingAgences: false, agenceError: message }));
            }
        });
    }

    onSelectAgence(row: CorrectionAgenceStats): void {
        if (!row?.agenceId) {
            this.state.update((s) => ({
                ...s,
                selectedAgence: row,
                points: [],
                pointError: 'Identifiant agence manquant'
            }));
            return;
        }

        this.state.update((s) => ({
            ...s,
            selectedAgence: row,
            points: [],
            pointError: undefined,
            loadingPoints: true
        }));

        this.userService.getCorrectionStatsByPointVente$(row.agenceId).subscribe({
            next: (response) => {
                const points = response.data?.correctionPointVenteStats || [];
                this.state.update((s) => ({ ...s, points, loadingPoints: false }));
            },
            error: (err: HttpErrorResponse) => {
                const message = err.error?.message || 'Erreur lors du chargement des points de vente.';
                this.state.update((s) => ({ ...s, loadingPoints: false, pointError: message }));
            }
        });
    }
}
