import { CreditoDTO } from '@/interface/credito.histo.model';
import { DemandeCredit } from '@/interface/demande.credit';
import { IResponse } from '@/interface/response';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { MessageModule } from 'primeng/message';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { EMPTY, switchMap } from 'rxjs';

@Component({
    selector: 'app-manager',
    imports: [CommonModule, FormsModule, TableModule, CardModule, ButtonModule, TagModule, ProgressBarModule, AccordionModule, MessageModule, ProgressSpinnerModule, TooltipModule, DividerModule],
    templateUrl: './manager.component.html',
    styleUrl: './manager.component.scss'
})
export class ManagerComponent {
    @Input() user?: IUser;
    state = signal<{
        demandeAnalyseCredits?: DemandeCredit[];
        user?: IUser;
        loading: boolean;
        message: string | undefined;
        error: string | any;
        searching: boolean;
    }>({
        demandeAnalyseCredits: [],
        loading: false,
        message: undefined,
        error: undefined,
        searching: false
    });

    // Injected services
    private activatedRouter = inject(ActivatedRoute);
    // Keep only:
    private destroyRef = inject(DestroyRef);
    private userService = inject(UserService);
    private router = inject(Router);

    ngOnInit(): void {
        this.loadAnalyseEnours();
    }

    private loadAnalyseEnours(): void {
        // Get userId from input user or handle as needed
        const userId = this.user?.userId;
        const statut = 'EN_ATTENTE';

        if (userId) {
            this.state.update((state) => ({
                ...state,
                loading: true,
                message: undefined,
                error: undefined
            }));

            this.userService
                .listAnalyseCreditsEncours$(statut, userId)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (response: IResponse) => {
                        console.log('API Response:', response); // Debug log

                        let demandeAnalyseCredits: DemandeCredit[] = [];

                        if (response.data) {
                            console.log('Response data:', response.data); // Debug log

                            if (Array.isArray(response.data.demandeAnalyseCredits)) {
                                demandeAnalyseCredits = response.data.demandeAnalyseCredits;
                            } else if (response.data.demandeAnalyseCredits) {
                                demandeAnalyseCredits = [response.data.demandeAnalyseCredits];
                            }
                        }

                        console.log('Processed credits:', demandeAnalyseCredits); // Debug log
                        console.log('User role:', response.data?.user?.role); // Debug log

                        this.state.update((state) => ({
                            ...state,
                            demandeAnalyseCredits,
                            loading: false,
                            user: response.data?.user || this.user,
                            message: response.message,
                            error: undefined
                        }));

                        // Debug final state
                        console.log('Final state:', this.state());
                    },
                    error: (error) => {
                        console.error('API Error:', error); // Debug log

                        this.state.update((state) => ({
                            ...state,
                            demandeAnalyseCredits: [],
                            loading: false,
                            message: undefined,
                            error
                        }));
                    }
                });
        } else {
            console.log('No userId available'); // Debug log
            this.state.update((state) => ({
                ...state,
                loading: false,
                error: 'Utilisateur non trouvé'
            }));
        }
    }

    formatCurrency(amount: number): string {
        if (!amount) return '0 GNF';
        return new Intl.NumberFormat('fr-GN', {
            style: 'currency',
            currency: 'GNF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    viewDetailDemandeCredit(demandeId: number, userId: number): void {
        console.log('Demande ID:', demandeId);
        //console.log('User ID:', userId);
        this.router.navigate([`dashboards/credit/${userId}/resume-credit/${demandeId}`]);
    }

    newAnalyseCredit(userId: number): void {
        this.router.navigate([`dashboards/credit/${this.user?.userId}/new-step`]);
    }
}
