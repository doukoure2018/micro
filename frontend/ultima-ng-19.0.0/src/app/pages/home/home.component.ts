import { Key } from '@/enum/cache.key';
import { IAuthentication } from '@/interface/IAuthentication';

import { Topbar } from '@/pages/landing/components/topbar';
import { StorageService } from '@/service/storage.service';
import { UserService } from '@/service/user.service';
import { getFormData } from '@/utils/fileutils';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { catchError, delay, take, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-home',
    imports: [ProgressSpinnerModule, RouterModule, IconFieldModule, InputIconModule, InputTextModule, Topbar, DropdownModule, ButtonModule, MenuModule],
    templateUrl: './home.component.html',
    styles: `
        ::placeholder {
            color: #fff;
        }
        ::ng-deep .custom-dropdown {
            .p-dropdown {
                border-radius: 1.5rem !important;
                border: none !important;
            }

            .p-dropdown-label {
                color: #10b981 !important;
                font-weight: 500 !important;
            }
        }

        ::ng-deep .p-menu {
            border-radius: 0.75rem !important;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
        }
    `,
    providers: [MessageService]
})
export class HomeComponent {
    private readonly redirectBaseUrl: string = environment.redirectUri;
    loading = signal<boolean>(true);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private storage = inject(StorageService);
    private userService = inject(UserService);
    private activatedRoute = inject(ActivatedRoute);
    private messageService = inject(MessageService);

    // Add a signal to track if user is authenticated and redirecting
    isAuthenticatedAndRedirecting = signal<boolean>(false);

    ngOnInit(): void {
        // Keep loading true until we explicitly set it to false
        this.loading.set(true);

        // First check if user is already authenticated
        if (this.userService.isAuthenticated() && !this.userService.isTokenExpired()) {
            console.log('User already authenticated, redirecting...');
            const redirectUrl = this.storage.getRedirectUrl() || '/dashboards';

            // Mark as authenticated and redirecting
            this.isAuthenticatedAndRedirecting.set(true);

            // Keep loading true during navigation
            this.router
                .navigate([redirectUrl])
                .then(() => {
                    console.log('Navigation complete for authenticated user');
                })
                .catch((error) => {
                    console.error('Navigation error:', error);
                    // Only set loading to false if navigation fails
                    this.loading.set(false);
                    this.isAuthenticatedAndRedirecting.set(false);
                });

            return; // Exit early - don't process OAuth codes for already authenticated users
        }

        console.log('Checking for OAuth code in DashboardAnalytics');
        this.activatedRoute.queryParamMap
            .pipe(
                take(1), // Only take first emission to prevent multiple subscriptions
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((params) => {
                // Get code from either route params or window location
                const code = params.get('code');
                console.log('OAuth code from ActivatedRoute:', code);

                const urlParams = new URLSearchParams(window.location.search);
                const urlCode = urlParams.get('code');
                console.log('OAuth code from window.location:', urlCode);

                const authCode = code || urlCode;

                if (authCode) {
                    console.log('Processing authentication with code:', authCode);

                    // Ensure loading is true during validation
                    this.loading.set(true);

                    this.userService
                        .validateCode$(this.formData(authCode))
                        .pipe(
                            delay(3 * 1000),
                            takeUntilDestroyed(this.destroyRef),
                            // Ensure loading stays true during this operation
                            tap(() => this.loading.set(true)),
                            catchError((err) => {
                                console.error('Authentication error:', err);
                                this.loading.set(false);
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Verification Account',
                                    detail: typeof err === 'string' ? err : 'Authentication failed'
                                });
                                return throwError(() => err);
                            })
                        )
                        .subscribe({
                            next: (response: IAuthentication) => {
                                this.saveToken(response);
                                console.log('Authentication successful, tokens saved');

                                // Mark as authenticated and redirecting
                                this.isAuthenticatedAndRedirecting.set(true);

                                const currentUrlWithoutParams = this.router.url.split('?')[0];

                                // Navigate and keep loading true until navigation completes
                                this.router
                                    .navigateByUrl(currentUrlWithoutParams)
                                    .then(() => {
                                        console.log('Navigation complete after authentication');
                                        // Navigation successful - component should be destroyed
                                    })
                                    .catch((error) => {
                                        console.error('Navigation error after authentication:', error);
                                        // Only set loading to false if navigation fails
                                        this.loading.set(false);
                                        this.isAuthenticatedAndRedirecting.set(false);
                                    });
                            },
                            error: () => {
                                // Error handling moved to catchError operator
                                this.isAuthenticatedAndRedirecting.set(false);
                            }
                        });
                } else {
                    console.log('No OAuth code found, continuing normal initialization');
                    // Add a small delay before showing content to prevent flicker
                    setTimeout(() => {
                        this.loading.set(false);
                    }, 100);
                }
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
        console.log('Saving auth tokens');
        this.storage.set(Key.TOKEN, response.access_token);
        this.storage.set(Key.REFRESH_TOKEN, response.refresh_token || response.access_token);
    };

    demandesItems: MenuItem[] = [
        {
            label: 'Demande de Crédit Individuel',
            icon: 'pi pi-plus',
            command: () => this.navigateToNewDemande()
        },
        {
            label: 'Demande de Crédit Groupe',
            icon: 'pi pi-list',
            command: () => this.navigateToMyDemandes()
        }
    ];

    navigateToNewDemande() {
        this.router.navigate(['/auth/credit']);
    }

    navigateToMyDemandes() {
        // Logique de navigation
    }
}
