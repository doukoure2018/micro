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

// Service interface
interface Service {
    label: string;
    value: string;
}

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
    selectedService: Service | null = null;

    // Service options
    services: Service[] = [
        { label: 'Direction Système Information', value: 'DSIG' },
        { label: 'Direction Exploitation', value: 'DE' },
        { label: 'Direction Inspection', value: 'DI' },
        { label: 'Direction Financière', value: 'DF' },
        { label: 'Direction Commerciale', value: 'DC' },
        { label: 'Direction Resource Humaine', value: 'DRH' },
        { label: 'Logistique', value: 'Logistique' },
        { label: 'Contrôle', value: 'Contrôle' },
        { label: 'Audit', value: 'Audit' },
        { label: 'Partenariat', value: 'Partenariat' },
        { label: 'Societariat', value: 'Societariat' }
    ];

    state = signal<{
        roles?: IRole[];
        delegations?: Delegation[];
        agences?: Agence[];
        pointVentes?: PointVente[];
        selectedRole?: IRole;
        selectedDelegationId?: number;
        selectedAgenceId?: number;
        selectedPointVenteId?: number;
        selectedServiceValue?: string;
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
        selectedServiceValue: undefined,
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
        this.usernameSubject.pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe((username) => {
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

    // Handle service selection
    onServiceChange(service: Service): void {
        this.state.update((state) => ({
            ...state,
            selectedServiceValue: service?.value
        }));
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
            selectedPointVenteId: undefined,
            usernameValidation: {
                isValid: false,
                isActive: false,
                isLoading: false,
                message: '',
                checked: false
            }
        }));

        // Reset form selections
        this.selectedDelegation = null;
        this.selectedAgence = null;
        this.selectedPointVente = null;

        // Load delegations if role requires location-based fields
        if (this.shouldShowLocationFields(selectedRole.name!)) {
            this.loadDelegations();
        }
    }

    // Handle username input change
    onUsernameChange(username: string): void {
        if (this.shouldValidateUsername()) {
            this.state.update((state) => ({
                ...state,
                usernameValidation: {
                    ...state.usernameValidation!,
                    checked: false,
                    message: ''
                }
            }));

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

    /**
     * Validate email format - Version très flexible
     * Accepte tous les formats d'email valides incluant:
     * - Emails simples: nom@domain.com
     * - Emails avec points multiples: nom.prenom.service@domain.com
     * - Emails avec plusieurs niveaux: salifou.doukoure.manager.ra@creditruralgn.com
     * - Emails avec sous-domaines: nom@mail.domain.co.gn
     * - Emails avec caractères spéciaux autorisés: nom+tag@domain.com
     */
    validateEmail(email: string): boolean {
        if (!email) return false;

        // Trim whitespace
        email = email.trim();

        // Pattern très flexible qui accepte:
        // - Partie locale: lettres, chiffres, points, tirets, underscores, +
        //   (peut avoir plusieurs points consécutifs ou non)
        // - @ obligatoire
        // - Domaine: lettres, chiffres, tirets, points
        // - Extension: au moins 2 caractères

        // Option 1: Pattern flexible
        const flexiblePattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // Option 2: Pattern encore plus permissif (accepte presque tout)
        // Vérifie simplement: quelquechose@quelquechose.quelquechose
        const permissivePattern = /^.+@.+\..+$/;

        // Option 3: Pattern très détaillé pour les emails professionnels
        // Accepte: nom.prenom.service.role@domaine.sous-domaine.extension
        const professionalPattern = /^[a-zA-Z0-9]([a-zA-Z0-9._+-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;

        // Utiliser le pattern permissif pour accepter le maximum de formats valides
        // Vous pouvez changer pour flexiblePattern ou professionalPattern si besoin
        return permissivePattern.test(email);
    }

    /**
     * Alternative: Validation email basique
     * Vérifie seulement la structure minimale d'un email
     */
    validateEmailBasic(email: string): boolean {
        if (!email) return false;

        email = email.trim();

        // Vérifications basiques
        // 1. Contient exactement un @
        const atCount = (email.match(/@/g) || []).length;
        if (atCount !== 1) return false;

        // 2. Le @ n'est pas au début ou à la fin
        if (email.startsWith('@') || email.endsWith('@')) return false;

        // 3. Il y a quelque chose avant et après le @
        const [localPart, domainPart] = email.split('@');
        if (!localPart || !domainPart) return false;

        // 4. Le domaine contient au moins un point
        if (!domainPart.includes('.')) return false;

        // 5. Le domaine ne commence pas et ne finit pas par un point
        if (domainPart.startsWith('.') || domainPart.endsWith('.')) return false;

        // 6. L'extension a au moins 2 caractères
        const lastDotIndex = domainPart.lastIndexOf('.');
        const extension = domainPart.substring(lastDotIndex + 1);
        if (extension.length < 2) return false;

        return true;
    }

    // Check if form can be submitted
    canSubmitForm(): boolean {
        const validation = this.state().usernameValidation;

        if (this.shouldValidateUsername()) {
            return !!validation?.checked && !!validation?.isActive;
        }

        return true;
    }

    // Check if role requires location fields
    shouldShowLocationFields(roleName: string): boolean {
        return roleName === 'AGENT_CREDIT' || roleName === 'CAISSE' || roleName === 'AGENT_CORRECTEUR' || roleName === 'DA' || roleName === 'DR' || roleName === 'RA';
    }

    // Check if role requires agence field
    shouldShowAgenceField(roleName: string): boolean {
        return roleName === 'AGENT_CREDIT' || roleName === 'CAISSE' || roleName === 'AGENT_CORRECTEUR' || roleName === 'DA' || roleName === 'RA';
    }

    // Check if role requires point vente field
    shouldShowPointVenteField(roleName: string): boolean {
        return roleName === 'AGENT_CREDIT' || roleName === 'CAISSE' || roleName === 'AGENT_CORRECTEUR';
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
    onDelegationChange(delegation: Delegation): void {
        if (!delegation) {
            this.state.update((state) => ({
                ...state,
                selectedDelegationId: undefined,
                agences: undefined,
                pointVentes: undefined,
                selectedAgenceId: undefined,
                selectedPointVenteId: undefined
            }));
            this.selectedAgence = null;
            this.selectedPointVente = null;
            return;
        }

        const delegationId = delegation.id;

        this.state.update((state) => ({
            ...state,
            selectedDelegationId: delegationId,
            agences: undefined,
            pointVentes: undefined,
            selectedAgenceId: undefined,
            selectedPointVenteId: undefined
        }));

        this.selectedAgence = null;
        this.selectedPointVente = null;

        console.log('Selected Delegation:', delegation);
        console.log('Delegation ID:', delegationId);

        if (this.state().selectedRole && this.shouldShowAgenceField(this.state().selectedRole?.name!)) {
            this.loadAgencesByDelegation(delegationId!);
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
    onAgenceChange(agence: Agence): void {
        if (!agence) {
            this.state.update((state) => ({
                ...state,
                selectedAgenceId: undefined,
                pointVentes: undefined,
                selectedPointVenteId: undefined
            }));
            this.selectedPointVente = null;
            return;
        }

        const agenceId = agence.id;

        this.state.update((state) => ({
            ...state,
            selectedAgenceId: agenceId,
            pointVentes: undefined,
            selectedPointVenteId: undefined
        }));

        this.selectedPointVente = null;

        console.log('Selected Agence:', agence);
        console.log('Agence ID:', agenceId);

        if (this.state().selectedRole && this.shouldShowPointVenteField(this.state().selectedRole?.name!)) {
            this.loadPointVentesByAgence(agenceId!);
        }
    }

    // Handle point vente selection
    onPointVenteChange(pointVente: PointVente): void {
        if (!pointVente) {
            this.state.update((state) => ({
                ...state,
                selectedPointVenteId: undefined
            }));
            return;
        }

        const pointVenteId = pointVente.id;

        this.state.update((state) => ({
            ...state,
            selectedPointVenteId: pointVenteId
        }));

        console.log('Selected Point Vente:', pointVente);
        console.log('Point Vente ID:', pointVenteId);
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

        // Validate email format avec la nouvelle méthode flexible
        if (form.value.email && !this.validateEmail(form.value.email)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Email invalide',
                detail: 'Veuillez entrer une adresse email valide (ex: nom.prenom@domain.com)',
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

        const delegationId = this.state().selectedDelegationId || this.selectedDelegation?.id || null;
        const agenceId = this.state().selectedAgenceId || this.selectedAgence?.id || null;
        const pointventeId = this.state().selectedPointVenteId || this.selectedPointVente?.id || null;
        const serviceValue = this.state().selectedServiceValue || this.selectedService?.value || null;

        console.log('Creating user with location IDs:', {
            delegationId,
            agenceId,
            pointventeId,
            service: serviceValue,
            role: selectedRole.name
        });

        const roleName = selectedRole.name;
        if (this.shouldShowLocationFields(roleName)) {
            if (!delegationId) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Délégation is required for this role',
                    life: 3000
                });
                this.state.update((state) => ({ ...state, submitting: false }));
                return;
            }

            if (this.shouldShowAgenceField(roleName) && !agenceId) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Agence is required for this role',
                    life: 3000
                });
                this.state.update((state) => ({ ...state, submitting: false }));
                return;
            }

            if (this.shouldShowPointVenteField(roleName) && !pointventeId) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Point de vente is required for this role',
                    life: 3000
                });
                this.state.update((state) => ({ ...state, submitting: false }));
                return;
            }
        }

        const userData = {
            username: form.value.username,
            firstName: form.value.firstName,
            lastName: form.value.lastName,
            email: form.value.email?.trim(), // Trim l'email avant envoi
            phone: form.value.phone,
            password: form.value.password,
            bio: form.value.bio,
            service: serviceValue,
            roleName: selectedRole.name,
            roleId: selectedRole.role_id,
            delegationId: delegationId,
            agenceId: agenceId,
            pointventeId: pointventeId
        };

        console.log('Final user data to submit:', userData);

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
                    this.selectedDelegation = null;
                    this.selectedAgence = null;
                    this.selectedPointVente = null;
                    this.selectedService = null;
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
