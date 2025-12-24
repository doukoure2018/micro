import { IResponse } from '@/interface/response';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
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

@Component({
    selector: 'app-admin',
    imports: [CommonModule, TableModule, InputTextModule, ProgressBarModule, ButtonModule, IconField, InputIcon, TagModule, FormsModule, InputSwitchModule, TooltipModule, DividerModule, ProgressSpinnerModule],
    templateUrl: './admin.component.html',
    providers: [ConfirmationService]
})
export class AdminComponent {
    state = signal<{
        users?: IUser[];
        loading: boolean;
        message: string | undefined;
        error: string | any;
        // État pour la gestion des agents crédit
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
                        summary: 'Error',
                        detail: 'Failed to load users',
                        life: 3000
                    });
                }
            });
    }

    onGlobalFilter(table: Table, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    navigateToCreateUser(): void {
        this.router.navigate(['/dashboards/createUser']);
    }

    editUser(user: IUser): void {
        this.router.navigate([`/dashboards/edit/${user.userId}`]);
    }

    deleteUser(user: IUser): void {
        // this.confirmationService.confirm({
        //     message: `Are you sure you want to delete user ${user.firstName} ${user.lastName}?`,
        //     header: 'Confirm Delete',
        //     icon: 'pi pi-exclamation-triangle',
        //     accept: () => {
        //         this.state.set({ ...this.state(), loading: true });
        //         this.userService.deleteUser$(user.userId).subscribe({
        //             next: (response) => {
        //                 this.messageService.add({
        //                     severity: 'success',
        //                     summary: 'Success',
        //                     detail: 'User deleted successfully',
        //                     life: 3000
        //                 });
        //                 this.loadUsers();
        //             },
        //             error: (error) => {
        //                 this.state.set({ ...this.state(), loading: false });
        //                 this.messageService.add({
        //                     severity: 'error',
        //                     summary: 'Error',
        //                     detail: 'Failed to delete user',
        //                     life: 3000
        //                 });
        //             }
        //         });
        //     }
        // });
    }

    getRoleSeverity(role: string): 'success' | 'info' | 'warn' | 'danger' {
        switch (role) {
            case 'SUPER_ADMIN':
                return 'danger';
            case 'ADMIN':
                return 'warn';
            case 'USER':
                return 'info';
            default:
                return 'success';
        }
    }

    // ========================================
    // GESTION DES AUTORISATIONS AGENT CRÉDIT
    // ========================================

    /**
     * Charger la liste des agents crédit
     */
    loadAgentCredits(): void {
        this.state.update((state) => ({ ...state, loadingAgentCredits: true }));

        this.userService
            .getUsersByRole$('AGENT_CREDIT')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    console.log('Agents crédit chargés:', response);
                    this.state.update((state) => ({
                        ...state,
                        agentCredits: response.data?.users || [],
                        loadingAgentCredits: false
                    }));
                },
                error: (error) => {
                    console.error('Erreur lors du chargement des agents crédit:', error);
                    this.state.update((state) => ({
                        ...state,
                        loadingAgentCredits: false
                    }));
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger la liste des agents crédit',
                        life: 3000
                    });
                }
            });
    }

    /**
     * Basculer l'autorisation d'un agent crédit
     * Note: ngModel a déjà mis à jour user.isAuthorized avec la nouvelle valeur
     */
    toggleAuthorization(user: IUser): void {
        // La nouvelle valeur est déjà dans user.authorized grâce au ngModel
        const newAuthStatus = user.authorized ?? false;
        // Garder l'ancienne valeur pour pouvoir revenir en arrière en cas d'erreur
        const previousStatus = !newAuthStatus;

        this.state.update((state) => ({ ...state, updatingAuthorization: user.userId }));

        this.userService
            .updateUserAuthorization$(user.userId, newAuthStatus)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    console.log('Autorisation mise à jour:', response);
                    // Mettre à jour l'état local pour synchroniser
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
                    // Revenir à l'état précédent en cas d'erreur
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

    /**
     * Vérifier si un agent est en cours de mise à jour
     */
    isUpdatingAuthorization(userId: number): boolean {
        return this.state().updatingAuthorization === userId;
    }
}
