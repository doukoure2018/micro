import { Key } from '@/enum/cache.key';
import { IAuthentication } from '@/interface/IAuthentication';

import { Topbar } from '@/pages/landing/components/topbar';
import { StorageService } from '@/service/storage.service';
import { UserService } from '@/service/user.service';
import { getFormData } from '@/utils/fileutils';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute, RouterModule, ParamMap } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { catchError, delay, EMPTY, switchMap, take, tap, throwError } from 'rxjs';
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
    loading = signal<boolean>(true);
    isAuthenticatedAndRedirecting = signal<boolean>(false); // Ajoutez cette ligne

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
            this.isAuthenticatedAndRedirecting.set(true); // Ajoutez cette ligne
            const redirectUrl = this.storage.getRedirectUrl() || '/dashboards';
            this.router.navigate([redirectUrl]);
            return;
        }

        // Gérer OAuth callback
        this.activatedRoute.queryParamMap
            .pipe(
                switchMap((params: ParamMap) => {
                    const code = params.get('code');
                    if (code) {
                        this.loading.set(true);
                        return this.userService.validateCode$(this.formData(code));
                    } else {
                        this.loading.set(false);
                        return EMPTY;
                    }
                }),
                delay(1000),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (response: IAuthentication) => {
                    this.saveToken(response);
                    this.isAuthenticatedAndRedirecting.set(true); // Ajoutez cette ligne
                    const redirectUrl = this.storage.getRedirectUrl() || '/dashboards';
                    this.router.navigate([redirectUrl]);
                },
                error: (error) => {
                    this.loading.set(false);
                    this.isAuthenticatedAndRedirecting.set(false); // Ajoutez cette ligne
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
        this.storage.set(Key.TOKEN, response.access_token);
        this.storage.set(Key.REFRESH_TOKEN, response.refresh_token || response.access_token);
    };

    // Ajoutez les autres méthodes si elles sont utilisées dans le template
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
