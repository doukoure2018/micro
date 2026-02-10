import { IResponse } from '@/interface/response';
import { IUser } from '@/interface/user';
import { Delegation } from '@/interface/delegation';
import { Agence } from '@/interface/agence';
import { PointVente } from '@/interface/point.vente';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';
import { ChipModule } from 'primeng/chip';

interface FilterOption {
    label: string;
    value: string;
}

@Component({
    selector: 'app-admin',
    imports: [
        CommonModule,
        TableModule,
        InputTextModule,
        ProgressBarModule,
        ButtonModule,
        DialogModule,
        IconField,
        InputIcon,
        TagModule,
        FormsModule,
        InputSwitchModule,
        TooltipModule,
        DividerModule,
        ProgressSpinnerModule,
        DropdownModule,
        MultiSelectModule,
        CalendarModule,
        CardModule,
        BadgeModule,
        AvatarModule,
        SkeletonModule,
        ChipModule
    ],
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss',
    providers: [ConfirmationService]
})
export class AdminComponent {
    @ViewChild('dtUsers') dtUsers!: Table;
    @ViewChild('dtAgents') dtAgents!: Table;

    state = signal<{
        users?: IUser[];
        loading: boolean;
        message: string | undefined;
        error: string | any;
        agentCredits?: IUser[];
        loadingAgentCredits: boolean;
        updatingAuthorization: number | null;
    }>({
        loading: false,
        message: undefined,
        error: undefined,
        loadingAgentCredits: false,
        updatingAuthorization: null
    });

    // Options de filtrage
    roleOptions: FilterOption[] = [
        { label: 'Super Admin', value: 'SUPER_ADMIN' },
        { label: 'Admin', value: 'ADMIN' },
        { label: 'Agent Crédit', value: 'AGENT_CREDIT' },
        { label: 'Agent Caisse', value: 'AGENT_CAISSE' },
        { label: 'Utilisateur', value: 'USER' }
    ];

    statusOptions: FilterOption[] = [
        { label: 'Actif', value: 'true' },
        { label: 'Inactif', value: 'false' }
    ];

    authorizationOptions: FilterOption[] = [
        { label: 'Autorisé', value: 'true' },
        { label: 'Non autorisé', value: 'false' }
    ];

    serviceOptions: FilterOption[] = [
        { label: 'Crédit', value: 'CREDIT' },
        { label: 'Caisse', value: 'CAISSE' },
        { label: 'Administration', value: 'ADMIN' }
    ];

    // Variables pour les filtres globaux
    globalFilterUsers: string = '';
    globalFilterAgents: string = '';

    // Dialog modification localisation CAISSE
    showLocationDialog = signal(false);
    locationDialogUser = signal<IUser | null>(null);
    savingLocation = signal(false);
    delegations = signal<Delegation[]>([]);
    agences = signal<Agence[]>([]);
    pointVentes = signal<PointVente[]>([]);
    selectedDelegationId = signal<number | null>(null);
    selectedAgenceId = signal<number | null>(null);
    selectedPointventeId = signal<number | null>(null);

    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    ngOnInit(): void {
        this.loadUsers();
        this.loadAgentCredits();
    }

    loadUsers(): void {
        this.state.update((state) => ({ ...state, loading: true, message: undefined, error: undefined }));
        this.userService
            .listUser$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.state.update((state) => ({
                        ...state,
                        users: response.data.users,
                        loading: false,
                        message: response.message,
                        error: undefined
                    }));
                },
                error: (error: string) => {
                    this.state.update((state) => ({
                        ...state,
                        loading: false,
                        message: undefined,
                        error: error
                    }));
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger les utilisateurs',
                        life: 3000
                    });
                }
            });
    }

    // Filtre global pour le tableau des utilisateurs
    onGlobalFilterUsers(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.dtUsers?.filterGlobal(value, 'contains');
    }

    // Filtre global pour le tableau des agents
    onGlobalFilterAgents(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.dtAgents?.filterGlobal(value, 'contains');
    }

    // Effacer tous les filtres du tableau utilisateurs
    clearFiltersUsers(): void {
        this.dtUsers?.clear();
        this.globalFilterUsers = '';
    }

    // Effacer tous les filtres du tableau agents
    clearFiltersAgents(): void {
        this.dtAgents?.clear();
        this.globalFilterAgents = '';
    }

    navigateToCreateUser(): void {
        this.router.navigate(['/dashboards/createUser']);
    }

    editUser(user: IUser): void {
        this.router.navigate([`/dashboards/edit/${user.userId}`]);
    }

    deleteUser(user: IUser): void {
        this.confirmationService.confirm({
            message: `Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.firstName} ${user.lastName}?`,
            header: 'Confirmation de suppression',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui, supprimer',
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                // Logique de suppression
                this.messageService.add({
                    severity: 'info',
                    summary: 'Info',
                    detail: 'Fonctionnalité en cours de développement',
                    life: 3000
                });
            }
        });
    }

    getRoleSeverity(role: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        switch (role) {
            case 'SUPER_ADMIN':
                return 'danger';
            case 'ADMIN':
                return 'warn';
            case 'AGENT_CREDIT':
                return 'info';
            case 'AGENT_CAISSE':
                return 'success';
            case 'USER':
                return 'secondary';
            default:
                return 'info';
        }
    }

    getRoleLabel(role: string): string {
        const found = this.roleOptions.find((r) => r.value === role);
        return found ? found.label : role;
    }

    // ========================================
    // GESTION DES AUTORISATIONS AGENT CRÉDIT
    // ========================================

    loadAgentCredits(): void {
        this.state.update((state) => ({ ...state, loadingAgentCredits: true }));

        forkJoin({
            agents: this.userService.getUsersByRole$('AGENT_CREDIT'),
            caisse: this.userService.getUsersByRole$('CAISSE')
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: ({ agents, caisse }) => {
                    const allUsers = [
                        ...(agents.data?.users || []),
                        ...(caisse.data?.users || [])
                    ];
                    this.state.update((state) => ({
                        ...state,
                        agentCredits: allUsers,
                        loadingAgentCredits: false
                    }));
                },
                error: (error) => {
                    console.error('Erreur lors du chargement des agents:', error);
                    this.state.update((state) => ({
                        ...state,
                        loadingAgentCredits: false
                    }));
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger la liste des agents',
                        life: 3000
                    });
                }
            });
    }

    toggleAuthorization(user: IUser): void {
        const newAuthStatus = user.authorized ?? false;
        const previousStatus = !newAuthStatus;

        this.state.update((state) => ({ ...state, updatingAuthorization: user.userId }));

        this.userService
            .updateUserAuthorization$(user.userId, newAuthStatus)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    console.log('Autorisation mise à jour:', response);
                    this.state.update((state) => ({
                        ...state,
                        updatingAuthorization: null,
                        agentCredits: state.agentCredits?.map((agent) => (agent.userId === user.userId ? { ...agent, authorized: newAuthStatus } : agent))
                    }));

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: newAuthStatus ? `${user.firstName} ${user.lastName} a été autorisé` : `${user.firstName} ${user.lastName} a été désautorisé`,
                        life: 3000
                    });
                },
                error: (error) => {
                    console.error("Erreur lors de la mise à jour de l'autorisation:", error);
                    this.state.update((state) => ({
                        ...state,
                        updatingAuthorization: null,
                        agentCredits: state.agentCredits?.map((agent) => (agent.userId === user.userId ? { ...agent, authorized: previousStatus } : agent))
                    }));
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: "Impossible de modifier l'autorisation",
                        life: 3000
                    });
                }
            });
    }

    isUpdatingAuthorization(userId: number): boolean {
        return this.state().updatingAuthorization === userId;
    }

    // Statistiques calculées
    get totalUsers(): number {
        return this.state().users?.length || 0;
    }

    get activeUsers(): number {
        return this.state().users?.filter((u) => u.enabled).length || 0;
    }

    get totalAgents(): number {
        return this.state().agentCredits?.length || 0;
    }

    get authorizedAgents(): number {
        return this.state().agentCredits?.filter((a) => a.authorized).length || 0;
    }

    // ========================================
    // MODIFICATION LOCALISATION (CAISSE)
    // ========================================

    openLocationDialog(user: IUser): void {
        this.locationDialogUser.set(user);
        this.selectedDelegationId.set(user.delegationId || null);
        this.selectedAgenceId.set(user.agenceId || null);
        this.selectedPointventeId.set(user.pointventeId || null);
        this.agences.set([]);
        this.pointVentes.set([]);

        // Charger les delegations
        this.userService.getAllDelegation$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res: IResponse) => {
                    this.delegations.set(res.data?.delegations || []);
                    // Si delegation deja selectionnee, charger les agences
                    if (user.delegationId) {
                        this.loadAgences(user.delegationId, user.agenceId || null);
                    }
                }
            });

        this.showLocationDialog.set(true);
    }

    onDelegationChange(delegationId: number): void {
        this.selectedDelegationId.set(delegationId);
        this.selectedAgenceId.set(null);
        this.selectedPointventeId.set(null);
        this.agences.set([]);
        this.pointVentes.set([]);
        if (delegationId) {
            this.loadAgences(delegationId, null);
        }
    }

    onAgenceChange(agenceId: number): void {
        this.selectedAgenceId.set(agenceId);
        this.selectedPointventeId.set(null);
        this.pointVentes.set([]);
        if (agenceId) {
            this.loadPointVentes(agenceId);
        }
    }

    private loadAgences(delegationId: number, preselectedAgenceId: number | null): void {
        this.userService.getAllAgenceByDelegationId$(delegationId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res: IResponse) => {
                    this.agences.set(res.data?.agences || []);
                    if (preselectedAgenceId) {
                        this.loadPointVentes(preselectedAgenceId);
                    }
                }
            });
    }

    private loadPointVentes(agenceId: number): void {
        this.userService.getAllPointventesByAgenceId$(agenceId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res: IResponse) => {
                    this.pointVentes.set(res.data?.pointVentes || []);
                }
            });
    }

    saveLocation(): void {
        const user = this.locationDialogUser();
        const delegationId = this.selectedDelegationId();
        const agenceId = this.selectedAgenceId();
        const pointventeId = this.selectedPointventeId();

        if (!user || !delegationId || !agenceId || !pointventeId) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Veuillez remplir tous les champs',
                life: 3000
            });
            return;
        }

        this.savingLocation.set(true);
        this.userService.updateUserLocation$(user.userId, delegationId, agenceId, pointventeId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.state.update((state) => ({
                        ...state,
                        agentCredits: state.agentCredits?.map((a) =>
                            a.userId === user.userId
                                ? { ...a, delegationId, agenceId, pointventeId }
                                : a
                        )
                    }));
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: `Localisation de ${user.firstName} ${user.lastName} mise à jour`,
                        life: 3000
                    });
                    this.savingLocation.set(false);
                    this.showLocationDialog.set(false);
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de mettre à jour la localisation',
                        life: 3000
                    });
                    this.savingLocation.set(false);
                }
            });
    }
}
