import { IUser } from '@/interface/user';
import { Component, Input, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { UserService } from '@/service/user.service';
import { CorrectionDelegationStats } from '@/interface/correction-delegation-stats';
import { CorrectionAgenceStats } from '@/interface/correction-agence-stats';
import { CorrectionPointVenteStats } from '@/interface/correction-pointvente-stats';
import { HttpErrorResponse } from '@angular/common/http';
import { SocietariatByAgenceComponent } from './societariat-by-agence/societariat-by-agence.component';
import { SocietariatByPsComponent } from './societariat-by-ps/societariat-by-ps.component';

@Component({
    selector: 'app-societariat',
    imports: [CommonModule, CardModule, TableModule, ProgressSpinnerModule, ButtonModule, SocietariatByAgenceComponent, SocietariatByPsComponent],
    templateUrl: './societariat.component.html',
    styleUrl: './societariat.component.scss'
})
export class SocietariatComponent implements OnInit {
    @Input() user?: IUser;

    private userService = inject(UserService);

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
        selectedAgence: null
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

    ngOnInit(): void {
        this.loadStats();
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
