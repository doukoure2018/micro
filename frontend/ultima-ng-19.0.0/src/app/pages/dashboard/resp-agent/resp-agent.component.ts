import { NewCredit } from '@/interface/newCredit';
import { IResponse } from '@/interface/response';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Popover, PopoverModule } from 'primeng/popover';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-resp-agent',
    imports: [CommonModule, TableModule, InputIconModule, IconFieldModule, TagModule, PopoverModule, ButtonModule, ToastModule, ProgressSpinnerModule, ChipModule],
    templateUrl: './resp-agent.component.html'
})
export class RespAgentComponent {
    @Input() user?: IUser;
    state = signal<{
        agence?: string;
        creditDtos?: NewCredit[];
        filteredDemandeAttentes?: NewCredit[];
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

    getStatusLabel(statutDemande: string, validationState: string): string {
        if (statutDemande === 'EN_ATTENTE' && validationState === 'NOUVEAU') {
            return 'NOUVELLE DEMANDE';
        } else if (statutDemande === 'EN_ATTENTE' && validationState === 'SELECTION') {
            return 'SELECTION';
        }
        return statutDemande;
    }

    ngOnInit(): void {
        this.laodAllCreditByAgence();
    }

    getStateValidation(statut: string): string {
        if (statut === 'ENCOURS') {
            return 'EN ATTENTE POUR LA NOTATION';
        } else if (statut === 'VALIDE') {
            return 'DEMANDE APROUVEE PAR LE DIRECTEUR';
        } else if (statut === 'REJECTED') {
            return 'DEMANDE REJETEE PAR LE DIRECTEUR';
        }
        return statut;
    }

    onGlobalFilter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    getStatusSeverity(statut: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
        if (statut === 'ENCOURS') return 'info';
        if (statut === 'VALIDE') return 'success';
        if (statut === 'REJECTED') return 'danger';
        return undefined;
    }

    // Méthode pour formater le montant en GNF
    formatMontantGNF(montant: number): string {
        if (!montant || montant === 0) return '0 GNF';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'GNF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(montant);
    }

    // Méthode pour calculer le total des montants
    getTotalMontant(): number {
        return this.state().filteredDemandeAttentes?.reduce((total, demande) => total + (demande.montantCredit || 0), 0) || 0;
    }

    private laodAllCreditByAgence(): void {
        if (!this.user?.pointventeId) {
            return;
        }

        this.state.set({ ...this.state(), loading: true });

        this.userService
            .getListCreditEnAttente$(this.user.agenceId!)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    // Make sure creditDtos is always treated as an array
                    const allCredits = Array.isArray(response.data.creditDtos) ? response.data.creditDtos : response.data.creditDtos ? [response.data.creditDtos] : [];

                    // Now we can safely filter the array
                    const filteredDemandes = allCredits.filter((demande) => demande.status === 'ENCOURS');

                    this.state.set({
                        ...this.state(),
                        creditDtos: allCredits,
                        filteredDemandeAttentes: filteredDemandes,
                        agence: response.data.agence?.libele || '',
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

    toggleDataTable(popover: Popover, event: Event): void {
        popover.toggle(event);
    }

    // Optional: If you want to handle selection like in the example
    selectedDemande: any;

    onDemandeSelect(popover: Popover, event: any): void {
        this.selectedDemande = event.data;
        popover.hide();
        this.messageService.add({
            severity: 'info',
            summary: 'Demande Sélectionnée',
            detail: `Membre: ${this.selectedDemande.codeMembre} ${this.selectedDemande.nom}`,
            life: 3000
        });
    }

    viewInstanceCredit(referenceCredit: string, numeroMembre: string, userId: number): void {
        console.log('viewInstanceCredit', referenceCredit, numeroMembre, userId);
        this.router.navigate(['/dashboards/resp-agent/', referenceCredit, numeroMembre, userId]);
    }

    // Méthode pour rafraîchir les données
    refreshData(): void {
        this.laodAllCreditByAgence();
        this.messageService.add({
            severity: 'info',
            summary: 'Actualisation',
            detail: 'Données actualisées avec succès',
            life: 2000
        });
    }
}
