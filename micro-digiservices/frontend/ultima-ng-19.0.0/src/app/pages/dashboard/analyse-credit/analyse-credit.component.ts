import { Credit } from '@/interface/credit';
import { IResponse } from '@/interface/response';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-analyse-credit',
    imports: [InputTextModule, FluidModule, ButtonModule, SelectModule, FormsModule, TextareaModule, TableModule, CurrencyPipe, IconField],
    templateUrl: './analyse-credit.component.html'
})
export class AnalyseCreditComponent {
    state = signal<{ credits?: Credit[]; user?: IUser; loading: boolean; message: string | undefined; error: string | any; searching: boolean }>({
        credits: [],
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

    ngOnInit(): void {
        this.loadUserProfile();
    }

    private loadUserProfile(): void {
        this.state.update((state) => ({ ...state, loading: true, message: undefined, error: undefined }));
        this.userService
            .profile$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.state.update((state) => ({ ...state, loading: false, user: response.data.user, message: undefined, error: undefined }));
                },
                error: (error) => {
                    this.state.update((state) => ({ ...state, loading: false, user: undefined, message: undefined, error }));
                },
                complete: () => {}
            });
    }

    // Method called when search button is clicked
    searchCredits(): void {
        if (!this.searchQuery || this.searchQuery.trim() === '') {
            this.state.update((state) => ({
                ...state,
                message: 'Veuillez saisir un numéro de membre',
                credits: []
            }));
            return;
        }

        this.state.update((state) => ({
            ...state,
            searching: true,
            message: undefined,
            error: undefined
        }));

        this.userService
            .getAllCreditos$(this.searchQuery)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    let creditsList: Credit[] = [];

                    if (response.data) {
                        if (response.data.credits) {
                            // If credits array is present, use it
                            creditsList = response.data.credits;
                        } else if (response.data.credit) {
                            // If single credit object is present, use it as an array
                            creditsList = [response.data.credit];
                        }
                    }

                    this.state.update((state) => ({
                        ...state,
                        credits: creditsList,
                        searching: false,
                        message: response.message,
                        error: undefined
                    }));
                },
                error: (error) => {
                    this.state.update((state) => ({
                        ...state,
                        credits: [],
                        searching: false,
                        message: undefined,
                        error
                    }));
                }
            });
    }

    viewDetailCredit(numberCredit: string) {
        this.router.navigate([`dashboards/credit/detail/${numberCredit}`]);
    }

    newAnalyseCredit() {
        this.router.navigate([`dashboards/credit/new`]);
    }
}
