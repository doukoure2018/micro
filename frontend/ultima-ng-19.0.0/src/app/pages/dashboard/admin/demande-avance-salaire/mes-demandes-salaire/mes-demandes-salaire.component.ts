import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DividerModule } from 'primeng/divider';
import { JavaDatePipe } from '@/pipes/java-date.pipe';
import { UserService } from '@/service/user.service';
import { DemandeSalaryDto } from '@/interface/demande.salary';
import { Router } from '@angular/router';

@Component({
    selector: 'app-mes-demandes-salaire',
    standalone: true,
    imports: [CommonModule, JavaDatePipe, TableModule, CardModule, ButtonModule, TagModule, ToastModule, ConfirmDialogModule, TooltipModule, BadgeModule, ProgressSpinnerModule, DividerModule],
    providers: [MessageService, ConfirmationService],
    templateUrl: './mes-demandes-salaire.component.html',
    styleUrl: './mes-demandes-salaire.component.scss'
})
export class MesDemandesSalaireComponent implements OnInit {
    private salaireService = inject(UserService);
    private router = inject(Router);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    // ==================== SIGNALS ====================

    isLoading = signal<boolean>(false);
    demandes = signal<DemandeSalaryDto[]>([]);
    cancellingId = signal<number | null>(null);

    // ==================== COMPUTED ====================

    // Demandes par statut
    demandesEncours = computed(() => this.demandes().filter((d) => d.statut === 'ENCOURS'));

    demandesValidees = computed(() => this.demandes().filter((d) => d.statut === 'VALIDER'));

    demandesConfirmees = computed(() => this.demandes().filter((d) => d.statut === 'CONFIRMER'));

    demandesRejetees = computed(() => this.demandes().filter((d) => d.statut === 'REJET'));

    demandesAnnulees = computed(() => this.demandes().filter((d) => d.statut === 'ANNULLER'));

    // Total des demandes actives
    totalActif = computed(() => {
        return this.demandes()
            .filter((d) => ['ENCOURS', 'VALIDER', 'CONFIRMER'].includes(d.statut!))
            .reduce((sum, d) => sum + (d.amount || 0), 0);
    });

    // Compteurs
    countTotal = computed(() => this.demandes().length);
    countActives = computed(() => this.demandes().filter((d) => ['ENCOURS', 'VALIDER', 'CONFIRMER'].includes(d.statut!)).length);

    // ==================== LIFECYCLE ====================

    ngOnInit(): void {
        this.loadDemandes();
    }

    // ==================== MÉTHODES ====================

    loadDemandes(): void {
        this.isLoading.set(true);

        this.salaireService.getMyDemandeSalary().subscribe({
            next: (response) => {
                if (response.data?.demandes) {
                    this.demandes.set(response.data.demandes as unknown as DemandeSalaryDto[]);
                }
                this.isLoading.set(false);
            },
            error: (error) => {
                console.error('Erreur chargement demandes:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible de charger vos demandes'
                });
                this.isLoading.set(false);
            }
        });
    }

    /**
     * Confirmer l'annulation d'une demande
     */
    confirmAnnuler(demande: DemandeSalaryDto): void {
        this.confirmationService.confirm({
            message: `Êtes-vous sûr de vouloir annuler cette demande de ${this.formatMontant(demande.amount)} ?`,
            header: "Confirmation d'annulation",
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui, annuler',
            rejectLabel: 'Non',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.annulerDemande(demande.id!);
            }
        });
    }

    /**
     * Annuler une demande
     */
    annulerDemande(id: number): void {
        this.cancellingId.set(id);

        this.salaireService.annulerDemandeSalary(id).subscribe({
            next: (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Demande annulée avec succès'
                });
                this.loadDemandes();
                this.cancellingId.set(null);
            },
            error: (error) => {
                console.error('Erreur annulation:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.error?.message || "Impossible d'annuler la demande"
                });
                this.cancellingId.set(null);
            }
        });
    }

    /**
     * Peut annuler une demande
     */
    canCancel(demande: DemandeSalaryDto): boolean {
        return demande.statut === 'ENCOURS';
    }

    /**
     * Formater un montant en GNF
     */
    formatMontant(montant: number | undefined): string {
        if (montant === undefined || montant === null) return '-';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'GNF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(montant);
    }

    /**
     * Obtenir le severity du tag selon le statut
     */
    getStatutSeverity(statut: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        switch (statut?.toUpperCase()) {
            case 'ENCOURS':
                return 'info';
            case 'VALIDER':
                return 'success';
            case 'CONFIRMER':
                return 'success';
            case 'REJET':
                return 'danger';
            case 'ANNULLER':
                return 'secondary';
            default:
                return 'info';
        }
    }

    /**
     * Obtenir le libellé du statut
     */
    getStatutLabel(statut: string): string {
        switch (statut?.toUpperCase()) {
            case 'ENCOURS':
                return 'En cours';
            case 'VALIDER':
                return 'Validée';
            case 'CONFIRMER':
                return 'Confirmée';
            case 'REJET':
                return 'Rejetée';
            case 'ANNULLER':
                return 'Annulée';
            default:
                return statut;
        }
    }

    nouvelleDemande(): void {
        this.router.navigate(['/dashboards/demande-avance-salaire']);
    }
}
