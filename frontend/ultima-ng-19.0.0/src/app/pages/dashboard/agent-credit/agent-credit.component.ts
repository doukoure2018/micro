import { DemandeIndividuel } from '@/interface/demande-individuel.interface';
import { NewCredit } from '@/interface/newCredit';
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
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageModule } from 'primeng/message';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-agent-credit',
    imports: [CommonModule, ButtonModule, RippleModule, MessageModule, RouterLink, TableModule, IconFieldModule, InputIconModule, TagModule],
    templateUrl: './agent-credit.component.html',
    providers: [MessageService]
})
export class AgentCreditComponent {
    @Input() user?: IUser;

    state = signal<{
        pointVente?: PointVente;
        demandeAttentes?: DemandeIndividuel[];
        filteredDemandeAttentes?: DemandeIndividuel[];
        creditDtos?: NewCredit[];
        nombreDemandeInd?: number;
        loading: boolean;
        message: string | undefined;
        error: string | any;
    }>({
        loading: false,
        message: undefined,
        error: undefined,
        filteredDemandeAttentes: []
    });

    private userService = inject(UserService);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private activatedRouter = inject(ActivatedRoute);
    private messageService = inject(MessageService);

    ngOnChanges(changes: SimpleChanges): void {
        console.log(this.user);
        if (this.user && this.user.pointventeId) {
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

    getStatusLabel(statutDemande: string, validationState: string): string {
        if (statutDemande === 'EN_ATTENTE' && validationState === 'NOUVEAU') {
            return 'NOUVELLE DEMANDE';
        } else if (statutDemande === 'EN_ATTENTE' && validationState === 'SELECTION') {
            return 'SELECTION';
        }
        return statutDemande;
    }

    getStateValidation(statutDemande: string, validationState: string): string {
        if (statutDemande === 'EN_ATTENTE' && validationState === 'NOUVEAU') {
            return 'EN ATTENTE POUR LA SELECTION';
        } else if (statutDemande === 'EN_ATTENTE' && validationState === 'SELECTION') {
            return 'EN ATTENTE POUR LA VALIDATION';
        } else if (statutDemande === 'EN_ATTENTE' && validationState === 'APPROVED') {
            return "DEMANDE APPROVEE PAR L'AGENT";
        }
        return validationState;
    }

    onGlobalFilter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    getStatusSeverity(statutDemande: string, validationState: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
        if (statutDemande === 'APPROVED') return 'success';
        if (statutDemande === 'EN_ATTENTE') return 'info';
        if (statutDemande === 'REJECTED') return 'danger';
        return undefined;
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
                    // Store all demandes
                    const allDemandes = response.data.demandeAttentes;

                    // Filter for demandes with validationState === 'VALIDATION'
                    const filteredDemandes = allDemandes.filter((demande) => demande.validationState === 'VALIDATION');

                    this.state.set({
                        ...this.state(),
                        demandeAttentes: allDemandes,
                        filteredDemandeAttentes: filteredDemandes,
                        pointVente: response.data.pointVente,
                        creditDtos: response.data.creditDtos,
                        nombreDemandeInd: response.data.nombreDemandeInd,
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

    miseEnPlaceCredit(numeroMembre: string, userId: number) {
        this.router.navigate(['/dashboards/agent-credit/', numeroMembre, userId]);
    }

    viewCreditDetails(referenceCredit: string, numeroMembre: string, userId: number) {
        // agent-credit/detail-credit-ind/:referenceCredit/:numeroMembre/:userId
        this.router.navigate(['/dashboards/agent-credit/detail-credit-ind/', referenceCredit, numeroMembre, userId]);
    }
}
