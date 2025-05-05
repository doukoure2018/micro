import { IResponse } from '@/interface/response';
import { IRole } from '@/interface/role';
import { UserService } from '@/service/user.service';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputText } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-create-user',
    imports: [InputText, TextareaModule, FileUploadModule, FormsModule, ButtonModule, InputGroupModule, RippleModule, MessageModule, ProgressSpinnerModule, PasswordModule, DropdownModule],
    templateUrl: './create-user.component.html',
    providers: [MessageService]
})
export class CreateUserComponent {
    state = signal<{
        roles?: IRole[];
        loading: boolean;
        submitting: boolean;
        message: string | undefined;
        error: string | any;
    }>({
        loading: false,
        submitting: false,
        message: undefined,
        error: undefined
    });

    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private userService = inject(UserService);
    private messageService = inject(MessageService);

    ngOnInit(): void {
        this.loadRolesUsers();
    }

    private loadRolesUsers(): void {
        this.state.update((state) => ({ ...state, loading: true, message: undefined, error: undefined }));
        this.userService
            .listRoles$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.state.update((state) => ({
                        ...state,
                        loading: false,
                        roles: response.data.roles,
                        message: undefined,
                        error: undefined
                    }));
                },
                error: (error) => {
                    console.error('Error loading roles:', error);
                    this.state.update((state) => ({
                        ...state,
                        loading: false,
                        roles: undefined,
                        message: undefined,
                        error
                    }));
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load roles',
                        life: 3000
                    });
                }
            });
    }

    createAccout(form: NgForm): void {
        if (form.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill all required fields correctly',
                life: 3000
            });
            return;
        }

        this.state.update((state) => ({ ...state, submitting: true }));

        // Get the selected role object
        const selectedRole = form.value.role;

        if (!selectedRole) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please select a valid role',
                life: 3000
            });
            this.state.update((state) => ({ ...state, submitting: false }));
            return;
        }

        // Log the selected role for debugging
        console.log('Selected role:', selectedRole);

        // Create the user data object with the exact role name as it appears in the database
        const userData = {
            ...form.value,
            // Remove the role object and replace with just the role name
            role: undefined,
            roleName: selectedRole.name
        };

        console.log('Submitting user data:', userData);

        this.userService
            .createAccount$(userData)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'User account created successfully',
                        life: 3000
                    });
                    this.state.update((state) => ({ ...state, submitting: false }));
                    form.resetForm();
                    // Navigate to users list or stay on the page based on your requirement
                    this.router.navigate(['/dashboards']);
                },
                error: (error) => {
                    console.error('Error creating user:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.message || 'Failed to create user account',
                        life: 3000
                    });
                    this.state.update((state) => ({ ...state, submitting: false }));
                }
            });
    }
}
