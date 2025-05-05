import { IResponse } from '@/interface/response';
import { IUser } from '@/interface/user';
import { StorageService } from '@/service/storage.service';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-admin',
    imports: [CommonModule, TableModule, InputTextModule, ProgressBarModule, ButtonModule, IconField, InputIcon, TagModule],
    templateUrl: './admin.component.html',
    providers: [ConfirmationService]
})
export class AdminComponent {
    state = signal<{ users?: IUser[]; loading: boolean; message: string | undefined; error: string | any }>({
        loading: false,
        message: undefined,
        error: undefined
    });

    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.state.set({ ...this.state(), loading: true, message: undefined, error: undefined });
        this.userService
            .listUser$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.state.set({
                        users: response.data.users,
                        loading: false,
                        message: response.message,
                        error: undefined
                    });
                },
                error: (error: string) => {
                    this.state.set({
                        ...this.state(),
                        loading: false,
                        message: undefined,
                        error: error
                    });
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
}
