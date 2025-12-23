import { IUser } from '@/interface/user';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { UserService } from '@/service/user.service';
import { CorrectionAgenceStats } from '@/interface/correction-agence-stats';
import { CorrectionPointVenteStats } from '@/interface/correction-pointvente-stats';
import { HttpErrorResponse } from '@angular/common/http';
import { SocietariatByAgenceComponent } from '../../agent-credit/societariat/societariat-by-agence/societariat-by-agence.component';
import { SocietariatByPsComponent } from '../../agent-credit/societariat/societariat-by-ps/societariat-by-ps.component';

@Component({
    selector: 'app-suivi-societariat',
    imports: [CommonModule, CardModule, TableModule, ProgressSpinnerModule, ButtonModule, SocietariatByAgenceComponent, SocietariatByPsComponent],
    templateUrl: './suivi-societariat.component.html',
    styleUrl: './suivi-societariat.component.scss'
})
export class SuiviSocietariatComponent implements OnInit {
    private userService = inject(UserService);

    state = signal<{
        loadingUser: boolean;
        user?: IUser;
        userError?: string;
        loadingAgences: boolean;
        agences: CorrectionAgenceStats[];
        agenceError?: string;
        loadingPoints: boolean;
        points: CorrectionPointVenteStats[];
        pointError?: string;
        selectedAgence?: CorrectionAgenceStats | null;
    }>({
        loadingUser: false,
        user: undefined,
        userError: undefined,
        loadingAgences: false,
        agences: [],
        agenceError: undefined,
        loadingPoints: false,
        points: [],
        pointError: undefined,
        selectedAgence: null
    });

    loadingUser = computed(() => this.state().loadingUser);
    user = computed(() => this.state().user);
    userError = computed(() => this.state().userError);
    agences = computed(() => this.state().agences);
    points = computed(() => this.state().points);
    loadingAgences = computed(() => this.state().loadingAgences);
    loadingPoints = computed(() => this.state().loadingPoints);
    selectedAgence = computed(() => this.state().selectedAgence);
    agenceError = computed(() => this.state().agenceError);
    pointError = computed(() => this.state().pointError);

    // Computed totals for the delegation
    totalEnAttente = computed(() => this.agences().reduce((sum, a) => sum + a.enAttente, 0));
    totalRejete = computed(() => this.agences().reduce((sum, a) => sum + a.rejete, 0));
    totalValide = computed(() => this.agences().reduce((sum, a) => sum + a.valide, 0));
    totalGlobal = computed(() => this.agences().reduce((sum, a) => sum + a.total, 0));

    ngOnInit(): void {
        this.loadUser();
    }

    loadUser(): void {
        this.state.update((s) => ({ ...s, loadingUser: true, userError: undefined }));
        this.userService.getInstanceUser$().subscribe({
            next: (response) => {
                const user = response.data?.user;
                this.state.update((s) => ({ ...s, user, loadingUser: false }));
                // Once user is loaded, load stats for their delegation
                if (user?.delegationId) {
                    this.loadAgenceStats(user.delegationId);
                } else {
                    this.state.update((s) => ({
                        ...s,
                        userError: 'Aucune délégation associée à votre compte.'
                    }));
                }
            },
            error: (err: HttpErrorResponse) => {
                const message = err.error?.message || 'Erreur lors du chargement des informations utilisateur.';
                this.state.update((s) => ({ ...s, loadingUser: false, userError: message }));
            }
        });
    }

    loadAgenceStats(delegationId: number): void {
        this.state.update((s) => ({
            ...s,
            loadingAgences: true,
            agenceError: undefined,
            agences: [],
            points: [],
            selectedAgence: null
        }));

        this.userService.getCorrectionStatsByAgence$(delegationId).subscribe({
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

    refresh(): void {
        const user = this.user();
        if (user?.delegationId) {
            this.loadAgenceStats(user.delegationId);
        }
    }
}
