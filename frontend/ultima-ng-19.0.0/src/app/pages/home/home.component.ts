import { Key } from '@/enum/cache.key';
import { IAuthentication } from '@/interface/IAuthentication';

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
    imports: [ProgressSpinnerModule, RouterModule, InputTextModule, ButtonModule, DialogModule, FormsModule, InputGroupModule, InputGroupAddonModule, MessageModule, ToastModule],
    templateUrl: './home.component.html',
    styles: `
        /* ---- Typographie de la page de garde ---- */
        .landing {
            font-family: Figtree, Lato, 'Helvetica Neue', sans-serif;
            -webkit-font-smoothing: antialiased;
        }

        .landing h1,
        .landing h2,
        .landing h3 {
            font-family: Archivo, Lato, 'Helvetica Neue', sans-serif;
        }

        .landing .section-title {
            font-size: 1.75rem;
            font-weight: 600;
            line-height: 1.18;
            letter-spacing: -0.015em;
        }

        @media (min-width: 992px) {
            .landing .section-title {
                font-size: 2.5rem;
            }
        }

        .landing .eyebrow {
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: #176b3a;
        }

        .landing .stat-figure {
            font-family: Archivo, Lato, 'Helvetica Neue', sans-serif;
            font-size: 2.5rem;
            font-weight: 600;
            line-height: 1.1;
            letter-spacing: -0.02em;
        }

        .landing .service-card {
            background: #fff;
            border: 1px solid #e2e7e1;
            border-radius: 0.625rem;
            padding: 1.875rem;
        }

        .landing .chip {
            font-size: 0.8125rem;
            font-weight: 500;
            color: #176b3a;
            background: #edf4ee;
            border-radius: 0.25rem;
            padding: 0.375rem 0.75rem;
        }

        /* ---- Dialog d'inscription du personnel ---- */
        ::ng-deep .personnel-dialog .p-dialog-header {
            background: #176b3a;
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
            border-color: #176b3a !important;
            box-shadow: 0 0 0 2px rgba(23, 107, 58, 0.2) !important;
        }
    `,
    providers: [MessageService]
})
export class HomeComponent {
    loading = signal<boolean>(true);
    isAuthenticatedAndRedirecting = signal<boolean>(false);
    currentYear = new Date().getFullYear();
    mobileMenuOpen = signal<boolean>(false);

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
    private readonly authServer: string = environment.authServer;
    // Même code challenge que la topbar (PKCE fixe)
    private readonly codeChallenge = 'HK02sitqCRpUlfLEX2xl4JGqaVQhNDsfTWH-oQzJHGw';

    getLoginUrl(): string {
        return `${this.authServer}/oauth2/authorize?response_type=code&client_id=client&scope=openid&redirect_uri=${this.redirectBaseUrl}&code_challenge_method=S256&code_challenge=${this.codeChallenge}`;
    }

    toggleMobileMenu() {
        this.mobileMenuOpen.update((open) => !open);
    }

    closeMobileMenu() {
        this.mobileMenuOpen.set(false);
    }

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
