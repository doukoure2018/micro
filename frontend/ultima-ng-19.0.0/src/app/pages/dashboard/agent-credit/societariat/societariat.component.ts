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
    imports: [CommonModule, CardModule, TableModule, ProgressSpinnerModule, ButtonModule, ChartModule, SelectButtonModule, FormsModule, SocietariatByAgenceComponent, SocietariatByPsComponent],
    templateUrl: './societariat.component.html',
    styleUrl: './societariat.component.scss'
})
export class SocietariatComponent implements OnInit {
    @Input() user?: IUser;

    private userService = inject(UserService);

    // Chart period options
    chartPeriodOptions = [
        { label: 'Par jour', value: 'day' },
        { label: 'Par semaine', value: 'week' }
    ];
    selectedPeriod = 'day';

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

    // Chart data computed
    chartData = computed(() => {
        const data = this.selectedPeriod === 'day' ? this.state().evolutionByDay : this.state().evolutionByWeek;
        if (!data || data.length === 0) return null;

        return {
            labels: data.map((d) => d.periode),
            datasets: [
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
            ]
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
                intersect: false
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

    loadChartData(): void {
        this.state.update((s) => ({ ...s, loadingChart: true, chartError: undefined }));

        // Load both day and week data
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
