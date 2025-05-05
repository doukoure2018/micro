import { ClientesDto } from '@/interface/clientes-dto.model';
import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FluidModule } from 'primeng/fluid';
import { IconField, IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-credit',
    imports: [InputTextModule, FluidModule, ButtonModule, SelectModule, FormsModule, TextareaModule, TableModule, DividerModule, IconFieldModule, InputIconModule],
    templateUrl: './credit.component.html'
})
export class CreditComponent {
    state = signal<{
        clientes?: ClientesDto;
        loading: boolean;
        message: string | undefined;
        error: string | any;
        searching: boolean;
    }>({
        loading: false,
        message: undefined,
        error: undefined,
        searching: false
    });

    // Search query binding
    searchQuery: string = '';
    private destroyRef = inject(DestroyRef);
    private userService = inject(UserService);
    private router = inject(Router);

    searchMembre(): void {
        if (!this.searchQuery || this.searchQuery.trim() === '') {
            this.state.update((state) => ({
                ...state,
                error: 'Veuillez saisir un numéro membre pour la recherche.'
            }));
            return;
        }

        this.state.update((state) => ({
            ...state,
            searching: true,
            error: undefined,
            message: undefined
        }));

        this.userService
            .searchClientes$(this.searchQuery)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => {
                    this.state.update((state) => ({
                        ...state,
                        searching: false
                    }));
                })
            )
            .subscribe({
                next: (response: IResponse) => {
                    if (response.code === 200) {
                        if (response.data && response.data.clientes) {
                            // Client found
                            this.state.update((state) => ({
                                ...state,
                                clientes: response.data.clientes,
                                message: response.message || 'Client trouvé avec succès.'
                            }));
                        } else {
                            // No client found
                            this.state.update((state) => ({
                                ...state,
                                clientes: undefined,
                                message: response.message || 'Aucun client trouvé avec ce numéro membre.'
                            }));
                        }
                    } else {
                        // API returned an error
                        this.state.update((state) => ({
                            ...state,
                            error: response.message || 'Une erreur est survenue lors de la recherche.'
                        }));
                    }
                },
                error: (err) => {
                    this.state.update((state) => ({
                        ...state,
                        error: 'Erreur de connexion. Veuillez réessayer plus tard.'
                    }));
                    console.error('Search error:', err);
                }
            });
    }

    doDamandeCredit(codeClient: string): void {
        this.router.navigate([`/auth/credit/demandeInd/${codeClient}`]);
    }
}
