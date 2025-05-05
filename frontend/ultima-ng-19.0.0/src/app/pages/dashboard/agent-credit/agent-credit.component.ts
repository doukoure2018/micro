import { DemandeIndividuel } from '@/interface/demande-individuel.interface';
import { PointVente } from '@/interface/point.vente';
import { IResponse } from '@/interface/response';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, signal, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'app-agent-credit',
    imports: [CommonModule, ButtonModule, RippleModule, MessageModule, RouterLink],
    templateUrl: './agent-credit.component.html',
    providers: [MessageService]
})
export class AgentCreditComponent {
    @Input() user?: IUser;

    state = signal<{
        pointVente?: PointVente;
        demandeAttentes?: DemandeIndividuel[];
        loading: boolean;
        message: string | undefined;
        error: string | any;
    }>({
        loading: false,
        message: undefined,
        error: undefined
    });

    private userService = inject(UserService);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private activatedRouter = inject(ActivatedRoute);
    private messageService = inject(MessageService);

    ngOnChanges(changes: SimpleChanges): void {
        console.log(this.user);
        if (this.user && this.user.pointventeId) {
            this.loadUniquePointVente();
            this.laodDemandeAttenteByPointVente();
        } else {
            // Handle the case where pointventeId is null or undefined
            console.warn('pointventeId is null or undefined');
            // Optionally set an error message
            this.state.set({
                ...this.state(),
                error: 'Information de point de vente non disponible. Pointvente ID est manquant.'
            });

            // You could also show a toast message
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Information de point de vente non disponible',
                life: 5000
            });
        }
    }

    private loadUniquePointVente(): void {
        if (!this.user?.pointventeId) {
            return;
        }

        this.state.set({ ...this.state(), loading: true });

        this.userService
            .getInfoPointService$(this.user.pointventeId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    console.log('*** Point de vente Information *****');
                    console.log(response.data.pointVente);
                    this.state.set({
                        ...this.state(),
                        pointVente: response.data.pointVente,
                        loading: false
                    });
                },
                error: (error) => {
                    console.error('Error loading Unique Point de vente:', error);
                    this.state.set({
                        ...this.state(),
                        error: 'Erreur lors du chargement des informations du point de vente',
                        loading: false
                    });

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger les informations du point de vente',
                        life: 5000
                    });
                },
                complete: () => {}
            });
    }

    private laodDemandeAttenteByPointVente(): void {
        if (!this.user?.pointventeId) {
            return;
        }

        this.state.set({ ...this.state(), loading: true });

        this.userService
            .getAllDemandeAttente$(this.user.pointventeId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    console.log('*** Liste des demandes en attente *****');
                    console.log(response.data.demandeAttentes);
                    this.state.set({
                        ...this.state(),
                        demandeAttentes: response.data.demandeAttentes,
                        loading: false
                    });
                },
                error: (error) => {
                    console.error('Error loading Unique des demandes en attente de credit:', error);
                    this.state.set({
                        ...this.state(),
                        error: 'Erreur lors du chargement des informations des demandes en attente de credit',
                        loading: false
                    });

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger les informations du des demandes en attente de credit',
                        life: 5000
                    });
                },
                complete: () => {}
            });
    }
}
