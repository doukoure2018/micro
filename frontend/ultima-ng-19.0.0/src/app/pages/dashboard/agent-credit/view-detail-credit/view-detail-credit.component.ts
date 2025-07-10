import { Appreciation } from '@/interface/appreciation';
import { ChargeInd } from '@/interface/ChargeInd';
import { ClientesDto } from '@/interface/clientes-dto.model';
import { Garantiepersonnecaution } from '@/interface/Garantiepersonnecaution';
import { InstanceCreditView } from '@/interface/instance-credit-view';
import { NoteGarantie } from '@/interface/note-garantie.model';
import { NoteProfile } from '@/interface/note-profile.model';
import { ProductInd } from '@/interface/ProductInd';
import { IResponse } from '@/interface/response';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-view-detail-credit',
    imports: [CommonModule, CardModule, DividerModule, ButtonModule, PanelModule, ToastModule, ChipModule, MessageModule, ProgressSpinnerModule, TableModule, TabViewModule],
    templateUrl: './view-detail-credit.component.html',
    styleUrl: './view-detail-credit.component.scss',
    providers: [MessageService]
})
export class ViewDetailCreditComponent {
    private userService = inject(UserService);
    private route = inject(ActivatedRoute);
    public router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private messageService = inject(MessageService);

    state = signal<{
        instanceCreditInd?: InstanceCreditView;
        appreciation?: Appreciation;
        membre?: ClientesDto;
        charges?: ChargeInd[];
        products?: ProductInd[];
        user?: IUser;
        garantieCaution?: Garantiepersonnecaution[];
        noteProfile?: NoteProfile;
        noteAnalyse?: NoteProfile;
        noteGarantie?: NoteGarantie;
        loading: boolean;
        message: string | undefined;
        error: string | any;
    }>({
        loading: false,
        message: undefined,
        error: undefined
    });

    ngOnInit(): void {
        this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const referenceCredit = params['referenceCredit'];
            const numeroMembre = params['numeroMembre'];

            if (referenceCredit && numeroMembre) {
                this.loadCreditDetails(referenceCredit, numeroMembre);
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Paramètres manquants pour charger les détails du crédit',
                    life: 5000
                });
            }
        });
    }

    loadCreditDetails(referenceCredit: string, numeroMembre: string): void {
        this.state.set({ ...this.state(), loading: true });

        this.userService
            .detailCreditInd$(referenceCredit, numeroMembre)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.state.set({
                        ...this.state(),
                        instanceCreditInd: response.data.instanceCreditInd,
                        appreciation: response.data.appreciation,
                        membre: response.data.membre,
                        charges: response.data.charges,
                        products: response.data.products,
                        garantieCaution: response.data.garantieCaution,
                        noteProfile: response.data.noteProfile,
                        noteAnalyse: response.data.noteAnalyse,
                        noteGarantie: response.data.noteGarantie,
                        user: response.data.user,
                        loading: false,
                        message: response.message
                    });
                },
                error: (error) => {
                    console.error('Error loading credit details:', error);
                    this.state.set({
                        ...this.state(),
                        error: 'Erreur lors du chargement des détails du crédit',
                        loading: false
                    });

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger les détails du crédit',
                        life: 5000
                    });
                }
            });
    }

    getFormattedDate(date: Date | undefined): string {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('fr-FR');
    }

    getFormattedAmount(amount: number | undefined): string {
        if (amount === undefined || amount === null) return 'N/A';
        return new Intl.NumberFormat('fr-GN', { style: 'currency', currency: 'GNF' }).format(amount);
    }

    getTotalProductAmount(): number {
        return this.state().products?.reduce((sum, p) => sum + (p.prix_unit || 0), 0) || 0;
    }

    // Add this method to calculate the total charges
    getTotalCharges(): number {
        return this.state().charges?.reduce((sum, c) => sum + (c.prix_unit || 0), 0) || 0;
    }

    startInsertingCredit(referenceCredit: string, numeroMembre: string, userId: number): void {
        console.log(referenceCredit, numeroMembre, userId);
        this.router.navigate(['/dashboards/agent-credit/detail-credit-ind/form-credit/', referenceCredit, numeroMembre, userId]);
    }

    updateCredit(referenceCredit: string): void {
        this.router.navigate(['/dashboards/agent-credit/process-update-credit/', referenceCredit]);
    }

    /**
     * Retourne la classe CSS pour les chips de statut
     */
    getStatusChipClass(status: string | undefined): string {
        if (!status) return '';

        const baseClass = 'status-chip ';
        switch (status.toUpperCase()) {
            case 'ACCEPTED':
            case 'ACCEPTÉ':
            case 'VALIDÉ':
                return baseClass + 'status-accepted';
            case 'REJECTED':
            case 'REJETÉ':
            case 'REFUSÉ':
                return baseClass + 'status-rejected';
            case 'PENDING':
            case 'EN_ATTENTE':
            case 'EN ATTENTE':
                return baseClass + 'status-pending';
            default:
                return baseClass + 'status-default';
        }
    }
}
