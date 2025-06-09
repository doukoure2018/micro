import { Credit } from '@/interface/credit';
import { PlanPagos } from '@/interface/plan.pagos';
import { IResponse } from '@/interface/response';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { switchMap, EMPTY, Observer } from 'rxjs';
import { Location } from '@angular/common';

@Component({
    selector: 'app-detail-credit',
    imports: [CommonModule, CardModule, ButtonModule, TagModule, MessageModule, ProgressSpinnerModule, TableModule, CurrencyPipe, DatePipe],
    templateUrl: './detail-credit.component.html',
    providers: [MessageService]
})
export class DetailCreditComponent {
    state = signal<{
        numberCredit?: string;
        planpagos?: PlanPagos[];
        credit?: Credit;
        user?: IUser;
        loading: boolean;
        message: string | undefined;
        error: string | undefined;
    }>({
        planpagos: [],
        loading: false,
        message: undefined,
        error: undefined
    });

    // Derived signals for easier template access
    loading = signal(false);
    planpagos = signal<PlanPagos[]>([]); // Always initialize as empty array
    error = signal<string | undefined>(undefined);
    private destroyRef = inject(DestroyRef);
    private userService = inject(UserService);
    private activatedRoute = inject(ActivatedRoute);
    private router = inject(Router);
    private location = inject(Location);

    ngOnInit(): void {
        this.activatedRoute.paramMap
            .pipe(
                switchMap((params: ParamMap) => {
                    const numberCredit = params.get('numberCredit');
                    if (numberCredit) {
                        this.state.update((state) => ({
                            ...state,
                            numberCredit,
                            loading: true,
                            message: undefined,
                            error: undefined
                        }));

                        // Update derived signals
                        this.loading.set(true);
                        this.error.set(undefined);

                        return this.userService.getAllPlanPagosByCreditos$(numberCredit);
                    } else {
                        const errorMsg = 'Credit number not provided in URL';
                        this.state.update((state) => ({
                            ...state,
                            loading: false,
                            message: undefined,
                            error: errorMsg
                        }));
                        this.loading.set(false);
                        this.error.set(errorMsg);

                        return EMPTY;
                    }
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(this.loadPlanPagosSubscriber);
    }

    private loadPlanPagosSubscriber: Observer<any> = {
        next: (response: IResponse) => {
            console.log('Response from getAllPlanPagosByCreditos$', response);
            // FIXED: Ensure planPagosData is always an array
            const planPagosData = response?.data?.planpagos || [];

            this.state.update((state) => ({
                ...state,
                loading: false,
                planpagos: planPagosData,
                error: undefined
            }));

            // Update derived signals - ensure it's always an array
            this.loading.set(false);
            this.planpagos.set(Array.isArray(planPagosData) ? planPagosData : []);
            this.error.set(undefined);
        },
        error: (error: string) => {
            this.state.update((state) => ({
                ...state,
                loading: false,
                message: undefined,
                error
            }));

            // Update derived signals
            this.loading.set(false);
            this.planpagos.set([]); // Reset to empty array on error
            this.error.set(error);
        },
        complete: () => {
            // Usually not needed but included for completeness
        }
    };

    // ADDED: Helper method to safely get planpagos length
    getPlanPagosLength(): number {
        const planpagos = this.planpagos();
        console.log('PlanPagos length:', planpagos.length);
        return Array.isArray(planpagos) ? planpagos.length : 0;
    }

    // ADDED: Helper method to safely get first planpago
    getFirstPlanPago(): PlanPagos | null {
        const planpagos = this.planpagos();
        return Array.isArray(planpagos) && planpagos.length > 0 ? planpagos[0] : null;
    }

    retourListe(): void {
        this.location.back();
    }
}
