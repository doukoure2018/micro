import { PointVente } from '@/interface/point.vente';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AgentCreditDTO } from '@/interface/AgentCreditDTO';

interface AgentWithStatus extends AgentCreditDTO {
    isActive?: boolean;
    isLoading?: boolean;
    selectedPointVenteId?: number;
}

@Component({
    selector: 'app-rotation-agent',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, CardModule, TagModule, DropdownModule, ProgressSpinnerModule, ToastModule, ConfirmDialogModule, TooltipModule],
    templateUrl: './rotation-agent.component.html',
    styleUrl: './rotation-agent.component.scss',
    providers: [MessageService, ConfirmationService]
})
export class RotationAgentComponent implements OnInit {
    state = signal<{
        user?: IUser;
        agents: AgentWithStatus[];
        pointsVente: PointVente[];
        loading: boolean;
        error?: string;
    }>({
        agents: [],
        pointsVente: [],
        loading: false
    });

    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private destroyRef = inject(DestroyRef);

    ngOnInit(): void {
        this.loadUserAndData();
    }

    /**
     * Charger l'utilisateur connecté et les données associées
     */
    private loadUserAndData(): void {
        this.state.update((state) => ({ ...state, loading: true }));

        this.userService
            .getInstanceUser$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    const user = response.data?.user;

                    if (!user?.agenceId) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: 'Aucune agence associée à votre compte',
                            life: 3000
                        });
                        this.state.update((state) => ({ ...state, loading: false }));
                        return;
                    }

                    console.log('👤 Utilisateur connecté:', user);
                    this.state.update((state) => ({ ...state, user }));

                    // Charger les points de vente et les agents en parallèle
                    this.loadAgenceData(user.agenceId);
                },
                error: (error) => {
                    console.error('❌ Erreur chargement utilisateur:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger les informations utilisateur',
                        life: 3000
                    });
                    this.state.update((state) => ({ ...state, loading: false }));
                }
            });
    }

    /**
     * Charger les données de l'agence (points de vente + agents)
     */
    private loadAgenceData(agenceId: number): void {
        forkJoin({
            pointsVente: this.userService.getAllPointVenteByAgenceId$(agenceId),
            agents: this.userService.getListAgentCredit$(agenceId)
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (results) => {
                    const pointsVente = results.pointsVente.data?.pointVentes || [];
                    const agents = results.agents.data?.agentCreditDTO || [];

                    console.log('🏢 Points de vente chargés:', pointsVente.length);
                    console.log('👥 Agents chargés:', agents.length);

                    // Filtrer les agents valides
                    const validAgents = agents.filter((agent) => agent.userId && agent.pointventeId);

                    this.state.update((state) => ({
                        ...state,
                        pointsVente,
                        agents: validAgents
                    }));

                    // Charger les statuts des agents
                    if (validAgents.length > 0) {
                        this.loadAgentsStatus(validAgents);
                    } else {
                        this.state.update((state) => ({ ...state, loading: false }));
                    }
                },
                error: (error) => {
                    console.error('❌ Erreur chargement données agence:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: "Impossible de charger les données de l'agence",
                        life: 3000
                    });
                    this.state.update((state) => ({ ...state, loading: false }));
                }
            });
    }

    /**
     * Charger le statut de chaque agent
     */
    private loadAgentsStatus(agents: AgentWithStatus[]): void {
        const statusRequests = agents.map((agent) =>
            this.userService.checkAgentDisponibility$(agent.userId!, agent.pointventeId!).pipe(
                catchError(() =>
                    of({
                        data: { disponibilityAgent: { isActive: false } }
                    })
                )
            )
        );

        forkJoin(statusRequests)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (responses) => {
                    const agentsWithStatus = agents.map((agent, index) => ({
                        ...agent,
                        isActive: responses[index]?.data?.disponibilityAgent?.isActive || false,
                        selectedPointVenteId: agent.pointventeId, // PS actuel par défaut
                        isLoading: false
                    }));

                    this.state.update((state) => ({
                        ...state,
                        agents: agentsWithStatus,
                        loading: false
                    }));
                }
            });
    }

    /**
     * Activer la rotation avec le PS sélectionné
     */
    activateRotation(agent: AgentWithStatus): void {
        console.log('🔄 Activation pour:', agent);
        // Validation
        if (!agent.selectedPointVenteId) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Veuillez sélectionner un point de vente',
                life: 3000
            });
            return;
        }

        const selectedPs = this.state().pointsVente.find((pv) => pv.id === agent.selectedPointVenteId);

        this.confirmationService.confirm({
            message: `Activer la rotation pour ${agent.fullName} au point de vente ${selectedPs?.libele} (${selectedPs?.code}) ?`,
            header: "Confirmation d'activation",
            icon: 'pi pi-check-circle',
            acceptLabel: 'Oui, activer',
            rejectLabel: 'Annuler',
            accept: () => {
                this.performActivation(agent);
            }
        });
    }

    /**
     * Effectuer l'activation
     */
    private performActivation(agent: AgentWithStatus): void {
        this.updateAgentLoadingState(agent.userId!, true);

        const request = {
            userId: agent.userId!,
            pointVenteId: agent.selectedPointVenteId!
        };

        this.userService
            .activateRotation$(request)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: `Rotation activée pour ${agent.fullName}`,
                        life: 3000
                    });

                    // Mettre à jour l'agent
                    this.updateAgentAfterActivation(agent.userId!, agent.selectedPointVenteId!);
                },
                error: (error) => {
                    console.error('❌ Erreur activation:', error);
                    this.updateAgentLoadingState(agent.userId!, false);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: error.message || "Impossible d'activer la rotation",
                        life: 3000
                    });
                }
            });
    }

    /**
     * Désactiver la rotation
     */
    deactivateRotation(agent: AgentWithStatus): void {
        this.confirmationService.confirm({
            message: `Désactiver la rotation pour ${agent.fullName} ?`,
            header: 'Confirmation de désactivation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui, désactiver',
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.performDeactivation(agent);
            }
        });
    }

    /**
     * Effectuer la désactivation
     */
    private performDeactivation(agent: AgentWithStatus): void {
        this.updateAgentLoadingState(agent.userId!, true);

        this.userService
            .deactivateRotation$(agent.userId!)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: `Rotation désactivée pour ${agent.fullName}`,
                        life: 3000
                    });
                    this.updateAgentStatus(agent.userId!, false);
                },
                error: (error) => {
                    console.error('❌ Erreur désactivation:', error);
                    this.updateAgentLoadingState(agent.userId!, false);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: error.message || 'Impossible de désactiver',
                        life: 3000
                    });
                }
            });
    }

    /**
     * Mettre à jour l'agent après activation
     */
    private updateAgentAfterActivation(userId: number, newPointVenteId: number): void {
        const ps = this.state().pointsVente.find((p) => p.id === newPointVenteId);

        this.state.update((state) => ({
            ...state,
            agents: state.agents.map((a) =>
                a.userId === userId
                    ? {
                          ...a,
                          isActive: true,
                          isLoading: false,
                          pointventeId: newPointVenteId,
                          pointventeLibele: ps?.libele ?? '',
                          pointventeCode: ps?.code ?? '',
                          pointVenteDisplay: ps ? `${ps.libele} (${ps.code})` : 'Non assigné'
                      }
                    : a
            )
        }));
    }

    /**
     * Mettre à jour l'état de chargement
     */
    private updateAgentLoadingState(userId: number, isLoading: boolean): void {
        this.state.update((state) => ({
            ...state,
            agents: state.agents.map((a) => (a.userId === userId ? { ...a, isLoading } : a))
        }));
    }

    /**
     * Mettre à jour le statut
     */
    private updateAgentStatus(userId: number, isActive: boolean): void {
        this.state.update((state) => ({
            ...state,
            agents: state.agents.map((a) => (a.userId === userId ? { ...a, isActive, isLoading: false } : a))
        }));
    }

    /**
     * Rafraîchir
     */
    refresh(): void {
        const user = this.state().user;
        if (user?.agenceId) {
            this.loadAgenceData(user.agenceId);
        }
    }
}
