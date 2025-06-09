import { DemandeIndividuel } from '@/interface/demande-individuel.interface';
import { IResponse } from '@/interface/response';
import { IUser } from '@/interface/user';
import { TypeCreditService } from '@/pages/service/type.credit.service';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { EMPTY, switchMap } from 'rxjs';

@Component({
    selector: 'app-start-credit',
    imports: [CommonModule, ButtonModule, ChipModule, ConfirmDialogModule, ToastModule],
    templateUrl: './start-credit.component.html',
    providers: [MessageService, ConfirmationService]
})
export class StartCreditComponent {
    state = signal<{
        demandeIndividuel?: DemandeIndividuel;
        user?: IUser;
        loading: boolean;
        message: string | undefined;
        error: string | any;
    }>({
        loading: false,
        message: undefined,
        error: undefined
    });

    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private activatedRouter = inject(ActivatedRoute);
    private userService = inject(UserService);
    private typeCreditService = inject(TypeCreditService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    ngOnInit(): void {
        this.loadLastDemandeInd();
    }

    private loadLastDemandeInd(): void {
        this.activatedRouter.paramMap
            .pipe(
                switchMap((params: ParamMap) => {
                    const numeroMembre = params.get('numeroMembre');
                    const userId = params.get('userId');
                    if (numeroMembre && userId) {
                        this.state.update((state) => ({ ...state, loading: true, message: undefined, error: undefined }));
                        return this.userService.getLastDemandeInd$(numeroMembre, +userId);
                    } else {
                        this.state.update((state) => ({ ...state, loading: false, message: undefined, error: 'Invalide NumeroMembre' }));
                        return EMPTY;
                    }
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (response: IResponse) => {
                    this.state.update((state) => ({
                        ...state,
                        demandeIndividuel: response.data.demandeIndividuel,
                        user: response.data.user,
                        loading: false,
                        message: response.message,
                        error: undefined
                    }));
                },
                error: (error: string) => {
                    this.state.update((state) => ({ ...state, loading: false, message: undefined, error }));
                }
            });
    }

    /**
     * Formate le montant en devise guinéenne (GNF)
     * @param montant - Le montant à formater
     * @returns Le montant formaté avec la devise GNF
     */
    public formatMontantGNF(montant: number | undefined): string {
        if (!montant) return '0 GNF';

        return new Intl.NumberFormat('fr-GN', {
            style: 'currency',
            currency: 'GNF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(montant);
    }

    /**
     * Retourne la description du type de crédit en utilisant le service
     * @param tipCredito - L'ID du type de crédit
     * @returns La description du type de crédit
     */
    public getCreditTypeDescription(tipCredito: number | undefined): string {
        return this.typeCreditService.getCreditTypeDescription(tipCredito);
    }

    /**
     * Vérifie si le type de crédit existe
     * @param tipCredito - L'ID du type de crédit
     * @returns true si le type existe
     */
    public isCreditTypeValid(tipCredito: number | undefined): boolean {
        return tipCredito ? this.typeCreditService.creditTypeExists(tipCredito) : false;
    }

    /**
     * Retourne la couleur du chip selon le type de crédit
     * @param tipCredito - L'ID du type de crédit
     * @returns La classe CSS pour colorer le chip
     */
    public getCreditTypeChipStyle(tipCredito: number | undefined): string {
        if (!tipCredito) return 'bg-gray-100 text-gray-800';

        // Couleurs différentes selon les catégories de crédit
        if (tipCredito <= 5) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'; // Crédit solidaire
        if (tipCredito <= 14) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'; // Crédit spécialisé
        if (tipCredito <= 23) return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'; // Crédit personnel
        if (tipCredito <= 47) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'; // Crédit agricole/commercial

        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'; // Crédit régularisé
    }

    public startNewCredit(numeroMembre: string, userId: number): void {
        this.confirmationService.confirm({
            message: 'Êtes-vous sûr de vouloir continuer pour la mise en place du nouveau crédit?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.state.update((state) => ({ ...state, loading: true }));
                this.userService
                    .startCredit$(numeroMembre, userId)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe({
                        next: (response: IResponse) => {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Succès',
                                detail: response.message
                            });
                            this.state.update((state) => ({ ...state, loading: false }));

                            // Check if response.data and response.data.demandeIndividuel exist
                            if (response.data && response.data.demandeIndividuel) {
                                const montant = response.data.demandeIndividuel.montant || 0;

                                if (montant <= 25000000) {
                                    // Mise en place pour le petit credit
                                    this.router.navigate(['/dashboards/process-credit', numeroMembre, userId]);
                                } else {
                                    // Mise en place pour le gros credit
                                    this.router.navigate(['/dashboards/process-big-credit', numeroMembre, userId]);
                                }
                            } else {
                                // If demandeIndividuel is not available in the response, use the one from state
                                const montant = this.state().demandeIndividuel?.montant || 0;

                                if (montant <= 25000000) {
                                    this.router.navigate(['/dashboards/process-credit', numeroMembre, userId]);
                                } else {
                                    this.router.navigate(['/dashboards/process-big-credit', numeroMembre, userId]);
                                }
                            }
                        },
                        error: (error: string) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Erreur',
                                detail: error
                            });
                            this.state.update((state) => ({ ...state, loading: false, error }));
                        }
                    });
            }
        });
    }
}
