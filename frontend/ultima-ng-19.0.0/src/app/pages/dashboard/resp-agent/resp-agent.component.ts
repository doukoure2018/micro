import { Agence } from '@/interface/agence';
import { DemandeCredit } from '@/interface/demande.credit';
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
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Popover, PopoverModule } from 'primeng/popover';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-resp-agent',
    imports: [CommonModule, TableModule, InputIconModule, IconFieldModule, TagModule, PopoverModule, ButtonModule, ToastModule, ProgressSpinnerModule, ChipModule, CardModule, DividerModule, TabViewModule],
    templateUrl: './resp-agent.component.html'
})
export class RespAgentComponent {
    @Input() user?: IUser;
    state = signal<{
        demandeAnalyseCredits?: DemandeCredit[];
        agence?: Agence;
        creditDtos?: NewCredit[];
        filteredDemandeAttentes?: NewCredit[];
        loading: boolean;
        message: string | undefined;
        error: string | any;
    }>({
        loading: false,
        message: undefined,
        error: undefined,
        filteredDemandeAttentes: [],
        demandeAnalyseCredits: []
    });

    private userService = inject(UserService);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
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

    // NEW: Get severity for demandeAnalyseCredits status
    getAnalyseStatusSeverity(statut: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
        switch (statut?.toUpperCase()) {
            case 'VUE':
                return 'info';
            case 'EN_ATTENTE':
                return 'warn';
            case 'APPROUVE':
                return 'success';
            case 'REJETE':
                return 'danger';
            case 'EN_COURS':
                return 'info';
            default:
                return 'secondary';
        }
    }

    // NEW: Get label for demandeAnalyseCredits status
    getAnalyseStatusLabel(statut: string): string {
        switch (statut?.toUpperCase()) {
            case 'VUE':
                return 'Vue';
            case 'EN_ATTENTE':
                return 'En attente';
            case 'APPROUVE':
                return 'Approuvé';
            case 'REJETE':
                return 'Rejeté';
            case 'EN_COURS':
                return 'En cours';
            default:
                return statut || 'Inconnu';
        }
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

    // NEW: Check if there are demandeAnalyseCredits
    hasAnalyseCredits(): boolean {
        return !!(this.state().demandeAnalyseCredits && this.state().demandeAnalyseCredits!.length > 0);
    }

    // NEW: Format date for display
    formatDate(dateString: string | null): string {
        if (!dateString) return 'Non définie';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    }

    private laodAllCreditByAgence(): void {
        this.state.set({ ...this.state(), loading: true });

        this.userService
            .getListCreditEnAttente$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    console.log('🔍 Response reçue:', response);

                    // Handle creditDtos
                    const allCredits = Array.isArray(response.data.creditDtos) ? response.data.creditDtos : response.data.creditDtos ? [response.data.creditDtos] : [];
                    const filteredDemandes = allCredits.filter((demande) => demande.status === 'ENCOURS');

                    // Handle demandeAnalyseCredits
                    const analyseCredits = Array.isArray(response.data.demandeAnalyseCredits) ? response.data.demandeAnalyseCredits : response.data.demandeAnalyseCredits ? [response.data.demandeAnalyseCredits] : [];

                    console.log("📊 Demandes d'analyse trouvées:", analyseCredits);

                    this.state.set({
                        ...this.state(),
                        creditDtos: allCredits,
                        filteredDemandeAttentes: filteredDemandes,
                        demandeAnalyseCredits: analyseCredits, // NEW: Set the analyse credits
                        agence: response.data.agence,
                        loading: false
                    });

                    // Show notification if there are analyse credits
                    if (analyseCredits.length > 0) {
                        this.messageService.add({
                            severity: 'info',
                            summary: "Demandes d'analyse disponibles",
                            detail: `${analyseCredits.length} demande(s) d'analyse de crédit trouvée(s)`,
                            life: 5000
                        });
                    }
                },
                error: (error) => {
                    console.error('Error loading credits:', error);
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

    // NEW: Toggle analyse credits table
    toggleAnalyseTable(popover: Popover, event: Event): void {
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

    // NEW: Navigate to analyse credit details
    viewAnalyseCredit(demandeCreditId: number, userId: number): void {
        console.log('viewAnalyseCredit', demandeCreditId, userId);
        this.router.navigate([`dashboards/credit/${userId}/resume-credit/${demandeCreditId}`]);
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
