import { Key } from '@/enum/cache.key';
import { IAuthentication } from '@/interface/IAuthentication';

import { Topbar } from '@/pages/landing/components/topbar';
import { StorageService } from '@/service/storage.service';
import { UserService } from '@/service/user.service';
import { getFormData } from '@/utils/fileutils';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute, RouterModule, ParamMap } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { catchError, delay, EMPTY, switchMap, take, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-home',
    imports: [ProgressSpinnerModule, RouterModule, InputTextModule, Topbar, ButtonModule, DialogModule, FormsModule, InputGroupModule, InputGroupAddonModule, MessageModule, ToastModule],
    templateUrl: './home.component.html',
    styles: `
        /* Grille décorative du hero */
        .hero-grid {
            background-image:
                linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
            background-size: 48px 48px;
            mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%);
        }

        /* Cartes services */
        .service-card {
            background: var(--surface-card, #fff);
            border: 1px solid var(--surface-border, #e5e7eb);
            border-radius: 1.25rem;
            padding: 1.75rem;
            transition: all 0.3s ease;
        }

        .service-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 20px 40px -12px rgba(6, 78, 59, 0.18);
            border-color: rgba(16, 185, 129, 0.4);
        }

        /* Tuiles "à propos" et "KUMY" */
        .about-tile {
            background: var(--surface-card, #fff);
            border: 1px solid var(--surface-border, #e5e7eb);
            border-radius: 1rem;
            padding: 1.5rem;
            transition: all 0.3s ease;
        }

        .about-tile:hover {
            transform: translateY(-4px);
            box-shadow: 0 14px 30px -12px rgba(6, 78, 59, 0.18);
            border-color: rgba(16, 185, 129, 0.4);
        }

        .kumy-tile {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 1rem;
            padding: 1.5rem;
            backdrop-filter: blur(4px);
        }

        /* Boutons du hero */
        ::ng-deep .hero-cta-primary .p-button {
            background: #fff !important;
            border-color: #fff !important;
            color: #065f46 !important;
            font-weight: 600;
        }

        ::ng-deep .hero-cta-primary .p-button:hover {
            background: #d1fae5 !important;
            border-color: #d1fae5 !important;
        }

        ::ng-deep .hero-cta-secondary .p-button {
            border-color: rgba(255, 255, 255, 0.4) !important;
            color: #fff !important;
        }

        ::ng-deep .hero-cta-secondary .p-button:hover {
            background: rgba(255, 255, 255, 0.1) !important;
        }

        /* Boutons des cartes services */
        ::ng-deep .service-btn-emerald .p-button {
            background: #059669 !important;
            border-color: #059669 !important;
        }

        ::ng-deep .service-btn-emerald .p-button:hover {
            background: #047857 !important;
            border-color: #047857 !important;
        }

        ::ng-deep .p-menu {
            border-radius: 0.75rem !important;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
        }

        ::ng-deep .personnel-dialog .p-dialog-header {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            color: white;
        }

        ::ng-deep .personnel-dialog .p-dialog-title {
            color: white;
        }

        /* Placeholders visibles dans le formulaire personnel */
        ::ng-deep .personnel-dialog input::placeholder {
            color: #6b7280 !important;
            opacity: 1 !important;
            font-weight: 500 !important;
        }

        ::ng-deep .personnel-dialog .p-inputtext::placeholder {
            color: #6b7280 !important;
            opacity: 1 !important;
            font-weight: 500 !important;
        }

        ::ng-deep .personnel-dialog input {
            border: 1px solid #d1d5db !important;
        }

        ::ng-deep .personnel-dialog input:focus {
            border-color: #059669 !important;
            box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
        }
    `,
    providers: [MessageService]
})
export class HomeComponent {
    loading = signal<boolean>(true);
    isAuthenticatedAndRedirecting = signal<boolean>(false);
    currentYear = new Date().getFullYear();

    // Dialog Personnel
    showPersonnelDialog = signal<boolean>(false);
    personnelState = signal<{ loading: boolean; message: string | undefined; error: string | undefined }>({
        loading: false,
        message: undefined,
        error: undefined
    });

    private destroyRef = inject(DestroyRef);
    private router = inject(Router);
    private storage = inject(StorageService);
    private userService = inject(UserService);
    private activatedRoute = inject(ActivatedRoute);
    private messageService = inject(MessageService);

    private readonly redirectBaseUrl: string = environment.redirectUri;

    ngOnInit(): void {
        // Si déjà authentifié
        if (this.userService.isAuthenticated() && !this.userService.isTokenExpired()) {
            this.isAuthenticatedAndRedirecting.set(true);
            console.log('User is authenticated and redirecting...');
            const redirectUrl = this.storage.getRedirectUrl() || '/dashboards';
            this.router.navigate([redirectUrl]);
            return;
        }

        // Gérer OAuth callback
        this.activatedRoute.queryParamMap
            .pipe(
                switchMap((params: ParamMap) => {
                    const code = params.get('code');
                    console.log('OAuth callback received with code:', code);
                    if (code) {
                        this.loading.set(true);
                        return this.userService.validateCode$(this.formData(code));
                    } else {
                        this.loading.set(false);
                        // Lien "Souscrire · Avance sur salaire" du menu → ouvre le dialog personnel
                        if (params.get('souscription') === 'personnel') {
                            this.openPersonnelDialog();
                        }
                        return EMPTY;
                    }
                }),
                delay(1000),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (response: IAuthentication) => {
                    console.log('Authentication successful:', response);
                    // CRITIQUE : Sauvegarder d'abord le token
                    this.saveToken(response);

                    // Petit délai pour s'assurer que le token est bien sauvegardé
                    setTimeout(() => {
                        this.isAuthenticatedAndRedirecting.set(true);
                        const redirectUrl = this.storage.getRedirectUrl() || '/dashboards';
                        this.router.navigate([redirectUrl]);
                    }, 100);
                },
                error: (error) => {
                    console.error('Authentication error:', error);
                    this.loading.set(false);
                    this.isAuthenticatedAndRedirecting.set(false);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Authentication Failed',
                        detail: typeof error === 'string' ? error : 'Please try again'
                    });
                },
                complete: () => console.log('Authentication complete')
            });
    }

    private formData = (code: string) =>
        getFormData({
            code,
            client_id: 'client',
            grant_type: 'authorization_code',
            redirect_uri: this.redirectBaseUrl,
            code_verifier: 'FyMQLDjN4mjiAY7O4fva2ZlxPZV9U_TU4GcdI5WSSufPBvH2ckvPWr3n3n-lWfwXSucLUSWimUqUc-_7Jmdk6ogzM2QDiSsMbY8UpBA1MEQbNteuXjWtW0psB1hPA_ED'
        });

    private saveToken = (response: IAuthentication) => {
        console.log('💾 Sauvegarde des tokens:');
        console.log('Access Token:', response.access_token?.substring(0, 50) + '...');
        console.log('Refresh Token:', response.refresh_token?.substring(0, 50) + '...');

        this.storage.set(Key.TOKEN, response.access_token);
        this.storage.set(Key.REFRESH_TOKEN, response.refresh_token || response.access_token);

        // Vérification immédiate
        const savedToken = this.storage.get(Key.TOKEN);
        console.log('✅ Token sauvegardé et vérifié:', savedToken ? 'Oui' : 'Non');
    };
    scrollToSolutions() {
        document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // ==================== GESTION DU PERSONNEL ====================

    openPersonnelDialog() {
        this.showPersonnelDialog.set(true);
        this.personnelState.set({ loading: false, message: undefined, error: undefined });
    }

    closePersonnelDialog() {
        this.showPersonnelDialog.set(false);
        this.personnelState.set({ loading: false, message: undefined, error: undefined });
    }

    registerPersonnel(form: NgForm) {
        if (form.invalid) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Veuillez remplir tous les champs obligatoires'
            });
            return;
        }

        this.personnelState.set({ loading: true, message: undefined, error: undefined });

        const formData = {
            firstName: form.value.firstName,
            lastName: form.value.lastName,
            email: form.value.email,
            password: form.value.password,
            matricule: form.value.matricule,
            phone: form.value.phone
            // Le username sera généré automatiquement par le backend
            // Le service sera automatiquement défini à 'Personnel' par le backend
        };

        this.userService
            .register$(formData)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.personnelState.set({ loading: false, message: response.message, error: undefined });
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: response.message || 'Compte créé avec succès. Vérifiez votre email pour activer votre compte.'
                    });
                    // Fermer le dialog après 3 secondes
                    setTimeout(() => {
                        this.closePersonnelDialog();
                        form.reset();
                    }, 3000);
                },
                error: (error) => {
                    this.personnelState.set({ loading: false, message: undefined, error });
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: error || 'Une erreur est survenue lors de la création du compte'
                    });
                }
            });
    }
}
