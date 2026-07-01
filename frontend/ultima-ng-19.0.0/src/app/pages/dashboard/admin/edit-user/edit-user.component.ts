import { Agence } from '@/interface/agence';
import { Delegation } from '@/interface/delegation';
import { PointVente } from '@/interface/point.vente';
import { IResponse } from '@/interface/response';
import { IRole } from '@/interface/role';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputText } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';

interface ServiceOption {
    label: string;
    value: string;
}

@Component({
    selector: 'app-edit-user',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputText,
        TextareaModule,
        DropdownModule,
        ButtonModule,
        InputGroupModule,
        RippleModule,
        MessageModule,
        ProgressSpinnerModule,
        ToastModule
    ],
    templateUrl: './edit-user.component.html',
    providers: [MessageService]
})
export class EditUserComponent implements OnInit {
    // Selections (template-driven, like create-user)
    selectedRole: IRole | null = null;
    selectedService: ServiceOption | null = null;
    selectedDelegation: Delegation | null = null;
    selectedAgence: Agence | null = null;
    selectedPointVente: PointVente | null = null;

    services: ServiceOption[] = [
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
        user?: IUser;
        roles?: IRole[];
        delegations?: Delegation[];
        agences?: Agence[];
        pointVentes?: PointVente[];
        loading: boolean;
        submitting: boolean;
        loadingRoles: boolean;
        loadingDelegations: boolean;
        loadingAgences: boolean;
        loadingPointVentes: boolean;
    }>({
        loading: true,
        submitting: false,
        loadingRoles: false,
        loadingDelegations: false,
        loadingAgences: false,
        loadingPointVentes: false
    });

    // Snapshot of original values so we know what actually changed
    private originalRole: string | null = null;
    private originalService: string | null = null;
    private originalDelegationId: number | null = null;
    private originalAgenceId: number | null = null;
    private originalPointVenteId: number | null = null;

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

    ngOnInit(): void {
        const userId = Number(this.route.snapshot.paramMap.get('userId'));
        if (!Number.isFinite(userId) || userId <= 0) {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Identifiant utilisateur invalide', life: 4000 });
            this.router.navigate(['/dashboards/admin']);
            return;
        }
        this.loadRoles();
        this.loadUser(userId);
    }

    private loadRoles(): void {
        this.state.update((s) => ({ ...s, loadingRoles: true }));
        this.userService
            .listRoles$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.state.update((s) => ({ ...s, roles: response.data?.roles, loadingRoles: false }));
                    this.matchRoleFromUser();
                },
                error: () => {
                    this.state.update((s) => ({ ...s, loadingRoles: false }));
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger les rôles' });
                }
            });
    }

    private loadUser(userId: number): void {
        this.userService
            .getUserById$(userId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (user) => {
                    this.state.update((s) => ({ ...s, user, loading: false }));

                    this.originalRole = user.role ?? null;
                    this.originalService = user.service ?? null;
                    this.originalDelegationId = user.delegationId ?? null;
                    this.originalAgenceId = user.agenceId ?? null;
                    this.originalPointVenteId = user.pointventeId ?? null;

                    // Pre-select service
                    if (user.service) {
                        this.selectedService = this.services.find((s) => s.value === user.service) ?? { label: user.service, value: user.service };
                    }

                    this.matchRoleFromUser();
                    this.preloadLocation(user);
                },
                error: (err) => {
                    this.state.update((s) => ({ ...s, loading: false }));
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err?.message || 'Impossible de charger l’utilisateur', life: 5000 });
                }
            });
    }

    /** Match the user's role string to the loaded roles list. */
    private matchRoleFromUser(): void {
        const user = this.state().user;
        const roles = this.state().roles;
        if (!user || !roles) return;
        const match = roles.find((r) => r.name === user.role);
        if (match) {
            this.selectedRole = match;
        }
    }

    /** Load delegation, then agence, then point de vente so the cascade dropdowns are pre-filled. */
    private preloadLocation(user: IUser): void {
        if (!user.delegationId) return;

        this.state.update((s) => ({ ...s, loadingDelegations: true }));
        this.userService
            .getAllDelegation$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    const delegations: Delegation[] = response.data?.delegations || response.data || [];
                    this.state.update((s) => ({ ...s, delegations, loadingDelegations: false }));
                    this.selectedDelegation = delegations.find((d) => d.id === user.delegationId) ?? null;

                    if (user.agenceId) {
                        this.loadAgencesByDelegation(user.delegationId!, user.agenceId, user.pointventeId);
                    }
                },
                error: () => this.state.update((s) => ({ ...s, loadingDelegations: false }))
            });
    }

    // ---- Cascade handlers (same UX as create-user) ----

    onRoleChange(role: IRole): void {
        this.selectedRole = role ?? null;
        if (!role) return;
        if (this.shouldShowLocationFields(role.name) && !this.state().delegations) {
            this.loadDelegations();
        }
    }

    onServiceChange(service: ServiceOption | null): void {
        this.selectedService = service;
    }

    onDelegationChange(delegation: Delegation | null): void {
        this.selectedDelegation = delegation;
        this.selectedAgence = null;
        this.selectedPointVente = null;
        this.state.update((s) => ({ ...s, agences: undefined, pointVentes: undefined }));
        if (delegation?.id && this.selectedRole && this.shouldShowAgenceField(this.selectedRole.name)) {
            this.loadAgencesByDelegation(delegation.id);
        }
    }

    onAgenceChange(agence: Agence | null): void {
        this.selectedAgence = agence;
        this.selectedPointVente = null;
        this.state.update((s) => ({ ...s, pointVentes: undefined }));
        if (agence?.id && this.selectedRole && this.shouldShowPointVenteField(this.selectedRole.name)) {
            this.loadPointVentesByAgence(agence.id);
        }
    }

    onPointVenteChange(pv: PointVente | null): void {
        this.selectedPointVente = pv;
    }

    private loadDelegations(): void {
        this.state.update((s) => ({ ...s, loadingDelegations: true }));
        this.userService
            .getAllDelegation$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.state.update((s) => ({ ...s, delegations: response.data?.delegations || response.data, loadingDelegations: false }));
                },
                error: () => this.state.update((s) => ({ ...s, loadingDelegations: false }))
            });
    }

    private loadAgencesByDelegation(delegationId: number, preselectAgenceId?: number, preselectPointVenteId?: number | null): void {
        this.state.update((s) => ({ ...s, loadingAgences: true }));
        this.userService
            .getAllAgenceByDelegationId$(delegationId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    const agences: Agence[] = response.data?.agences || response.data || [];
                    this.state.update((s) => ({ ...s, agences, loadingAgences: false }));
                    if (preselectAgenceId) {
                        this.selectedAgence = agences.find((a) => a.id === preselectAgenceId) ?? null;
                        if (this.selectedAgence?.id) {
                            this.loadPointVentesByAgence(this.selectedAgence.id, preselectPointVenteId ?? undefined);
                        }
                    }
                },
                error: () => this.state.update((s) => ({ ...s, loadingAgences: false }))
            });
    }

    private loadPointVentesByAgence(agenceId: number, preselectPointVenteId?: number): void {
        this.state.update((s) => ({ ...s, loadingPointVentes: true }));
        this.userService
            .getAllPointventesByAgenceId$(agenceId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    const pvs: PointVente[] = response.data?.pointVentes || response.data || [];
                    this.state.update((s) => ({ ...s, pointVentes: pvs, loadingPointVentes: false }));
                    if (preselectPointVenteId) {
                        this.selectedPointVente = pvs.find((p) => p.id === preselectPointVenteId) ?? null;
                    }
                },
                error: () => this.state.update((s) => ({ ...s, loadingPointVentes: false }))
            });
    }

    // ---- Visibility helpers (same as create-user) ----

    shouldShowLocationFields(roleName?: string | null): boolean {
        if (!roleName) return false;
        return ['AGENT_CREDIT', 'CAISSE', 'AGENT_CORRECTEUR', 'DA', 'DR', 'RA'].includes(roleName);
    }

    shouldShowAgenceField(roleName?: string | null): boolean {
        if (!roleName) return false;
        return ['AGENT_CREDIT', 'CAISSE', 'AGENT_CORRECTEUR', 'DA', 'RA'].includes(roleName);
    }

    shouldShowPointVenteField(roleName?: string | null): boolean {
        if (!roleName) return false;
        return ['AGENT_CREDIT', 'CAISSE', 'AGENT_CORRECTEUR'].includes(roleName);
    }

    // ---- Save: orchestrate the needed update calls ----

    save(form: NgForm): void {
        if (form.invalid) {
            form.control.markAllAsTouched();
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez remplir les champs requis', life: 3000 });
            return;
        }
        const user = this.state().user;
        if (!user) return;

        const newRole = this.selectedRole?.name ?? null;
        const newService = this.selectedService?.value ?? null;
        const newDelegationId = this.selectedDelegation?.id ?? null;
        const newAgenceId = this.selectedAgence?.id ?? null;
        const newPointVenteId = this.selectedPointVente?.id ?? null;

        // Password change is optional: only validate/submit if the admin typed something.
        const newPassword = (form.value.password ?? '').trim();
        const confirmPassword = (form.value.confirmPassword ?? '').trim();
        const wantsPasswordChange = newPassword.length > 0 || confirmPassword.length > 0;
        if (wantsPasswordChange) {
            if (newPassword.length < 6) {
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Le mot de passe doit contenir au moins 6 caractères', life: 4000 });
                return;
            }
            if (newPassword !== confirmPassword) {
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Les mots de passe ne correspondent pas', life: 4000 });
                return;
            }
        }

        const calls: Observable<unknown>[] = [];

        // Profile (firstName/lastName/email/phone/address/bio)
        calls.push(
            this.userService.updateUserById$(user.userId, {
                firstName: form.value.firstName,
                lastName: form.value.lastName,
                email: (form.value.email ?? '').trim(),
                phone: form.value.phone ?? '',
                address: form.value.address ?? '',
                bio: form.value.bio ?? ''
            })
        );

        if (newRole && newRole !== this.originalRole) {
            calls.push(this.userService.updateUserRole$(user.userId, newRole));
        }
        if (newService !== this.originalService && newService) {
            calls.push(this.userService.updateUserService$(user.userId, newService));
        }
        const locationChanged =
            newDelegationId !== this.originalDelegationId ||
            newAgenceId !== this.originalAgenceId ||
            newPointVenteId !== this.originalPointVenteId;
        if (locationChanged && this.shouldShowLocationFields(newRole)) {
            calls.push(this.userService.updateUserLocation$(user.userId, newDelegationId, newAgenceId, newPointVenteId));
        }
        if (wantsPasswordChange) {
            calls.push(this.userService.updateUserPasswordById$(user.userId, newPassword, confirmPassword));
        }

        this.state.update((s) => ({ ...s, submitting: true }));
        forkJoin(calls.length ? calls : [of(null)])
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.state.update((s) => ({ ...s, submitting: false }));
                    this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Utilisateur modifié avec succès', life: 3000 });
                    setTimeout(() => this.router.navigate(['/dashboards/admin']), 800);
                },
                error: (err) => {
                    this.state.update((s) => ({ ...s, submitting: false }));
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err?.message || 'Échec de la mise à jour', life: 5000 });
                }
            });
    }

    cancel(): void {
        this.router.navigate(['/dashboards/admin']);
    }
}
