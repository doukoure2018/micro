import { Agence } from '@/interface/agence';
import { Delegation } from '@/interface/delegation';
import { PointVente } from '@/interface/point.vente';
import { IResponse } from '@/interface/response';
import { IRole } from '@/interface/role';
import { SG_USUARIOS } from '@/interface/sg_usuarios';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
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
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
    selector: 'app-create-user',
    imports: [CommonModule, InputText, TextareaModule, FileUploadModule, FormsModule, ButtonModule, InputGroupModule, RippleModule, MessageModule, ProgressSpinnerModule, PasswordModule, DropdownModule],
    templateUrl: './create-user.component.html',
    providers: [MessageService]
})
export class CreateUserComponent {
    selectedDelegation: Delegation | null = null;
    selectedAgence: Agence | null = null;
    selectedPointVente: PointVente | null = null;
    state = signal<{
        roles?: IRole[];
        delegations?: Delegation[];
        agences?: Agence[];
        pointVentes?: PointVente[];
        selectedRole?: IRole;
        selectedDelegationId?: number;
        selectedAgenceId?: number;
        usuario?: SG_USUARIOS;
        usernameValidation?: {
            isValid: boolean;
            isActive: boolean;
            isLoading: boolean;
            message: string;
            checked: boolean;
        };
        loading: boolean;
        submitting: boolean;
        loadingDelegations: boolean;
        loadingAgences: boolean;
        loadingPointVentes: boolean;
        message: string | undefined;
        error: string | any;
    }>({
        loading: false,
        submitting: false,
        loadingDelegations: false,
        loadingAgences: false,
        loadingPointVentes: false,
        message: undefined,
        error: undefined,
        usernameValidation: {
            isValid: false,
            isActive: false,
            isLoading: false,
            message: '',
            checked: false
        }
    });

    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private userService = inject(UserService);
    private messageService = inject(MessageService);

    // Subject for debouncing username input
    private usernameSubject = new Subject<string>();

    ngOnInit(): void {
        this.loadRolesUsers();
        this.setupUsernameValidation();
    }

    private setupUsernameValidation(): void {
        this.usernameSubject
            .pipe(
                debounceTime(500), // Wait 500ms after user stops typing
                distinctUntilChanged(),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((username) => {
                if (username && this.shouldValidateUsername()) {
                    this.validateUsername(username);
                }
            });
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

    // Handle role selection change
    onRoleChange(selectedRole: IRole): void {
        this.state.update((state) => ({
            ...state,
            selectedRole,
            delegations: undefined,
            agences: undefined,
            pointVentes: undefined,
            selectedDelegationId: undefined,
            selectedAgenceId: undefined,
            usernameValidation: {
                isValid: false,
                isActive: false,
                isLoading: false,
                message: '',
                checked: false
            }
        }));

        // Load delegations if role requires location-based fields
        if (this.shouldShowLocationFields(selectedRole.name!)) {
            this.loadDelegations();
        }
    }

    // Handle username input change
    onUsernameChange(username: string): void {
        if (this.shouldValidateUsername()) {
            // Reset validation state while typing
            this.state.update((state) => ({
                ...state,
                usernameValidation: {
                    ...state.usernameValidation!,
                    checked: false,
                    message: ''
                }
            }));

            // Trigger debounced validation
            this.usernameSubject.next(username);
        }
    }

    // Check if username validation is needed (only for AGENT_CREDIT)
    public shouldValidateUsername(): boolean {
        const roleName = this.state().selectedRole?.name;
        return roleName === 'AGENT_CREDIT';
    }

    // Validate username against SAF backend
    private validateUsername(username: string): void {
        this.state.update((state) => ({
            ...state,
            usernameValidation: {
                ...state.usernameValidation!,
                isLoading: true,
                message: 'Vérification en cours...'
            }
        }));

        this.userService
            .getUserSaf$(username)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    console.log('Username validation response:', response);

                    if (response.data?.usuario) {
                        const usuario: SG_USUARIOS = response.data.usuario;
                        const isActive = usuario.indActivo === 'A';

                        this.state.update((state) => ({
                            ...state,
                            usuario,
                            usernameValidation: {
                                isValid: true,
                                isActive: isActive,
                                isLoading: false,
                                message: isActive ? 'Utilisateur validé et actif' : 'Utilisateur existe mais non actif',
                                checked: true
                            }
                        }));

                        // Show user feedback
                        if (isActive) {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Validation réussie',
                                detail: 'Utilisateur validé et actif',
                                life: 3000
                            });
                        } else {
                            this.messageService.add({
                                severity: 'warn',
                                summary: 'Utilisateur non actif',
                                detail: 'Utilisateur existe mais non actif',
                                life: 5000
                            });
                        }
                    } else {
                        // User not found
                        this.state.update((state) => ({
                            ...state,
                            usernameValidation: {
                                isValid: false,
                                isActive: false,
                                isLoading: false,
                                message: 'Utilisateur non trouvé',
                                checked: true
                            }
                        }));

                        this.messageService.add({
                            severity: 'error',
                            summary: 'Utilisateur non trouvé',
                            detail: 'Aucun utilisateur trouvé avec ce nom',
                            life: 3000
                        });
                    }
                },
                error: (error) => {
                    console.error('Error validating username:', error);
                    this.state.update((state) => ({
                        ...state,
                        usernameValidation: {
                            isValid: false,
                            isActive: false,
                            isLoading: false,
                            message: 'Erreur lors de la validation',
                            checked: true
                        }
                    }));

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur de validation',
                        detail: "Impossible de valider le nom d'utilisateur",
                        life: 3000
                    });
                }
            });
    }

    // Validate email format
    validateEmail(email: string): boolean {
        if (!email) return false;

        // Regex pattern that accepts both professional emails (xxx.xxx@domain.com) and standard emails
        // This pattern allows:
        // - Dots in the local part (before @)
        // - Alphanumeric characters, dots, hyphens, and underscores
        // - Various domain extensions
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        return emailPattern.test(email);
    }

    // Check if form can be submitted
    canSubmitForm(): boolean {
        const validation = this.state().usernameValidation;

        if (this.shouldValidateUsername()) {
            // For AGENT_CREDIT, username must be validated and active
            return !!validation?.checked && !!validation?.isActive;
        }

        // For other roles (including CAISSE), no username validation needed
        return true;
    }

    // Check if role requires location fields (delegation at minimum)
    shouldShowLocationFields(roleName: string): boolean {
        return roleName === 'AGENT_CREDIT' || roleName === 'CAISSE' || roleName === 'DA' || roleName === 'DR';
    }

    // Check if role requires agence field
    shouldShowAgenceField(roleName: string): boolean {
        // DR only needs delegation, not agence
        // AGENT_CREDIT and CAISSE need all three levels
        return roleName === 'AGENT_CREDIT' || roleName === 'CAISSE' || roleName === 'DA';
    }

    // Check if role requires point vente field
    shouldShowPointVenteField(roleName: string): boolean {
        // Both AGENT_CREDIT and CAISSE need point de vente
        return roleName === 'AGENT_CREDIT' || roleName === 'CAISSE';
    }

    // Load delegations
    loadDelegations(): void {
        this.state.update((state) => ({ ...state, loadingDelegations: true }));

        this.userService
            .getAllDelegation$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.state.update((state) => ({
                        ...state,
                        delegations: response.data?.delegations || response.data,
                        loadingDelegations: false
                    }));
                },
                error: (error) => {
                    this.state.update((state) => ({ ...state, loadingDelegations: false }));
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load delegations'
                    });
                }
            });
    }

    // Handle delegation selection
    onDelegationChange(delegationId: number): void {
        this.state.update((state) => ({
            ...state,
            selectedDelegationId: delegationId,
            agences: undefined,
            pointVentes: undefined,
            selectedAgenceId: undefined
        }));

        // Only load agences if the role requires it (not for DR)
        if (this.state().selectedRole && this.shouldShowAgenceField(this.state().selectedRole?.name!)) {
            this.loadAgencesByDelegation(delegationId);
        }
    }

    // Load agences by delegation
    loadAgencesByDelegation(delegationId: number): void {
        this.state.update((state) => ({ ...state, loadingAgences: true }));

        this.userService
            .getAllAgenceByDelegationId$(delegationId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.state.update((state) => ({
                        ...state,
                        agences: response.data?.agences || response.data,
                        loadingAgences: false
                    }));
                },
                error: (error) => {
                    this.state.update((state) => ({ ...state, loadingAgences: false }));
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load agences'
                    });
                }
            });
    }

    // Handle agence selection
    onAgenceChange(agenceId: number): void {
        this.state.update((state) => ({
            ...state,
            selectedAgenceId: agenceId,
            pointVentes: undefined
        }));

        // Load point ventes for AGENT_CREDIT and CAISSE roles
        if (this.state().selectedRole && this.shouldShowPointVenteField(this.state().selectedRole?.name!)) {
            this.loadPointVentesByAgence(agenceId);
        }
    }

    // Load point ventes by agence
    loadPointVentesByAgence(agenceId: number): void {
        this.state.update((state) => ({ ...state, loadingPointVentes: true }));

        this.userService
            .getAllPointventesByAgenceId$(agenceId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.state.update((state) => ({
                        ...state,
                        pointVentes: response.data?.pointVentes || response.data,
                        loadingPointVentes: false
                    }));
                },
                error: (error) => {
                    this.state.update((state) => ({ ...state, loadingPointVentes: false }));
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load point ventes'
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

        // Validate email format
        if (form.value.email && !this.validateEmail(form.value.email)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Email invalide',
                detail: 'Veuillez entrer une adresse email valide (ex: nom.prenom@creditruralgn.com ou nom@gmail.com)',
                life: 5000
            });
            return;
        }

        // Check username validation for AGENT_CREDIT only
        if (!this.canSubmitForm()) {
            this.messageService.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Username validation is required for AGENT_CREDIT role',
                life: 3000
            });
            return;
        }

        this.state.update((state) => ({ ...state, submitting: true }));

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

        // Create the user data object
        const userData = {
            ...form.value,
            role: undefined,
            roleName: selectedRole.name,
            // Add location-based fields if applicable
            delegationId: form.value.delegation?.id || null,
            agenceId: form.value.agence?.id || null,
            pointventeId: form.value.pointVente?.id || null
        };

        console.log('Final user data:', userData);

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
