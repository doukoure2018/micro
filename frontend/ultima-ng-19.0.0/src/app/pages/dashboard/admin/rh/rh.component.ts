import { CommonModule } from '@angular/common';
import { IUser } from '@/interface/user';
import { Component, Input, OnInit, inject, signal, computed } from '@angular/core';

// PrimeNG
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { ChipModule } from 'primeng/chip';
import { DemandeSalaryDto } from '@/interface/demande.salary';
import { JavaDatePipe } from '@/pipes/java-date.pipe';
import { UserService } from '@/service/user.service';
import { AuthorizeSalaireDto } from '@/interface/authorize-salaire.dto';

interface DemandesParJour {
    date: string;
    count: number;
    totalAmount: number;
    demandes: DemandeSalaryDto[];
    expanded?: boolean;
    selectedIds?: number[];
    allSelected?: boolean;
}

@Component({
    selector: 'app-rh',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        JavaDatePipe,
        CardModule,
        TableModule,
        ButtonModule,
        TagModule,
        ToastModule,
        ConfirmDialogModule,
        TooltipModule,
        BadgeModule,
        DividerModule,
        AccordionModule,
        CheckboxModule,
        ProgressSpinnerModule,
        TabViewModule,
        ChipModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './rh.component.html',
    styleUrl: './rh.component.scss'
})
export class RhComponent implements OnInit {
    @Input() user?: IUser;

    private salaireService = inject(UserService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    // ==================== SIGNALS ====================

    isLoading = signal<boolean>(false);
    isValidating = signal<boolean>(false);
    validatingId = signal<number | null>(null);

    demandesParJour = signal<DemandesParJour[]>([]);
    selectedStatut = signal<string>('ENCOURS');

    isLoadingAuth = signal<boolean>(false);
    authorizeSalaire = signal<AuthorizeSalaireDto | null>(null);
    isDemandesAuthorized = computed(() => this.authorizeSalaire()?.isAuthorized ?? false);

    // ==================== COMPUTED ====================

    totalDemandes = computed(() => {
        return this.demandesParJour().reduce((sum, jour) => sum + jour.count, 0);
    });

    totalMontant = computed(() => {
        return this.demandesParJour().reduce((sum, jour) => sum + jour.totalAmount, 0);
    });

    totalSelected = computed(() => {
        return this.demandesParJour().reduce((sum, jour) => sum + (jour.selectedIds?.length || 0), 0);
    });

    hasSelection = computed(() => this.totalSelected() > 0);

    // ==================== LIFECYCLE ====================

    ngOnInit(): void {
        this.loadAuthorizeSalaire();
        this.loadDemandesGroupedByDate();
    }

    loadAuthorizeSalaire(): void {
        this.salaireService.getAuthorizeSalaire().subscribe({
            next: (response) => {
                if (response.data?.authorize) {
                    this.authorizeSalaire.set(response.data.authorize as AuthorizeSalaireDto);
                }
            },
            error: (error) => {
                console.error('Erreur chargement autorisation:', error);
            }
        });
    }

    toggleAuthorization(): void {
        const newValue = !this.isDemandesAuthorized();

        this.confirmationService.confirm({
            message: newValue ? "Voulez-vous ACTIVER les demandes d'avance sur salaire ?" : "Voulez-vous DÉSACTIVER les demandes d'avance sur salaire ?",
            header: 'Confirmation',
            icon: newValue ? 'pi pi-check-circle' : 'pi pi-exclamation-triangle',
            acceptLabel: newValue ? 'Activer' : 'Désactiver',
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: newValue ? 'p-button-success' : 'p-button-danger',
            accept: () => {
                this.isLoadingAuth.set(true);

                const action$ = newValue ? this.salaireService.enableAuthorizeSalaire() : this.salaireService.disableAuthorizeSalaire();

                action$.subscribe({
                    next: (response) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: newValue ? "Les demandes d'avance sur salaire sont maintenant OUVERTES" : "Les demandes d'avance sur salaire sont maintenant FERMÉES"
                        });
                        this.loadAuthorizeSalaire();
                        this.isLoadingAuth.set(false);
                    },
                    error: (error) => {
                        console.error('Erreur toggle autorisation:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: "Impossible de modifier l'autorisation"
                        });
                        this.isLoadingAuth.set(false);
                    }
                });
            }
        });
    }

    // ==================== CHARGEMENT ====================

    loadDemandesGroupedByDate(): void {
        this.isLoading.set(true);

        this.salaireService.getDemandesGroupedByDate(this.selectedStatut()).subscribe({
            next: (response) => {
                if (response.data?.groupedDemandes) {
                    const grouped = response.data.groupedDemandes as any[];
                    this.demandesParJour.set(
                        grouped.map((g) => ({
                            ...g,
                            expanded: false,
                            selectedIds: [],
                            allSelected: false
                        }))
                    );
                }
                this.isLoading.set(false);
            },
            error: (error) => {
                console.error('Erreur chargement demandes:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible de charger les demandes'
                });
                this.isLoading.set(false);
            }
        });
    }

    onStatutChange(statut: string): void {
        this.selectedStatut.set(statut);
        this.loadDemandesGroupedByDate();
    }

    // ==================== TOGGLE / SÉLECTION ====================

    toggleDay(jour: DemandesParJour): void {
        jour.expanded = !jour.expanded;
    }

    toggleSelectAll(jour: DemandesParJour): void {
        if (jour.allSelected) {
            jour.selectedIds = jour.demandes.map((d) => d.id!);
        } else {
            jour.selectedIds = [];
        }
        // Force update
        this.demandesParJour.set([...this.demandesParJour()]);
    }

    toggleSelectDemande(jour: DemandesParJour, demandeId: number): void {
        if (!jour.selectedIds) {
            jour.selectedIds = [];
        }

        const index = jour.selectedIds.indexOf(demandeId);
        if (index > -1) {
            jour.selectedIds.splice(index, 1);
        } else {
            jour.selectedIds.push(demandeId);
        }

        // Mettre à jour allSelected
        jour.allSelected = jour.selectedIds.length === jour.demandes.length;

        // Force update
        this.demandesParJour.set([...this.demandesParJour()]);
    }

    isSelected(jour: DemandesParJour, demandeId: number): boolean {
        return jour.selectedIds?.includes(demandeId) || false;
    }

    // ==================== VALIDATION INDIVIDUELLE ====================

    confirmValider(demande: DemandeSalaryDto): void {
        this.confirmationService.confirm({
            message: `Voulez-vous valider la demande de ${this.formatMontant(demande.amount)} pour ${demande.prenomPersonnel} ${demande.nomPersonnel} ?`,
            header: 'Confirmer la validation',
            icon: 'pi pi-check-circle',
            acceptLabel: 'Valider',
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: 'p-button-success',
            accept: () => {
                this.validerDemande(demande.id!);
            }
        });
    }

    validerDemande(id: number): void {
        this.validatingId.set(id);

        this.salaireService.validerDemandeSalary(id).subscribe({
            next: (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Demande validée avec succès'
                });
                this.validatingId.set(null);
                this.loadDemandesGroupedByDate();
            },
            error: (error) => {
                console.error('Erreur validation:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.error?.message || 'Impossible de valider la demande'
                });
                this.validatingId.set(null);
            }
        });
    }

    // ==================== VALIDATION MASSIVE ====================

    confirmValiderSelection(): void {
        const total = this.totalSelected();

        this.confirmationService.confirm({
            message: `Voulez-vous valider les ${total} demande(s) sélectionnée(s) ?`,
            header: 'Validation massive',
            icon: 'pi pi-check-circle',
            acceptLabel: `Valider ${total} demande(s)`,
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: 'p-button-success',
            accept: () => {
                this.validerSelection();
            }
        });
    }

    validerSelection(): void {
        // Collecter tous les IDs sélectionnés
        const allSelectedIds: number[] = [];
        this.demandesParJour().forEach((jour) => {
            if (jour.selectedIds && jour.selectedIds.length > 0) {
                allSelectedIds.push(...jour.selectedIds);
            }
        });

        if (allSelectedIds.length === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Aucune demande sélectionnée'
            });
            return;
        }

        this.isValidating.set(true);

        this.salaireService.validerMultipleDemandeSalary(allSelectedIds).subscribe({
            next: (response) => {
                const totalValidated = response.data?.totalValidated || 0;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: `${totalValidated} demande(s) validée(s) avec succès`
                });
                this.isValidating.set(false);
                this.loadDemandesGroupedByDate();
            },
            error: (error) => {
                console.error('Erreur validation massive:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.error?.message || 'Erreur lors de la validation massive'
                });
                this.isValidating.set(false);
            }
        });
    }

    // ==================== VALIDATION PAR JOUR ====================

    confirmValiderJour(jour: DemandesParJour): void {
        this.confirmationService.confirm({
            message: `Voulez-vous valider les ${jour.count} demande(s) du ${this.formatDate(jour.date)} pour un total de ${this.formatMontant(jour.totalAmount)} ?`,
            header: 'Valider toutes les demandes du jour',
            icon: 'pi pi-check-circle',
            acceptLabel: `Valider ${jour.count} demande(s)`,
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: 'p-button-success',
            accept: () => {
                this.validerJour(jour);
            }
        });
    }

    validerJour(jour: DemandesParJour): void {
        const ids = jour.demandes.map((d) => d.id!);

        this.isValidating.set(true);

        this.salaireService.validerMultipleDemandeSalary(ids).subscribe({
            next: (response) => {
                const totalValidated = response.data?.totalValidated || 0;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: `${totalValidated} demande(s) du ${this.formatDate(jour.date)} validée(s)`
                });
                this.isValidating.set(false);
                this.loadDemandesGroupedByDate();
            },
            error: (error) => {
                console.error('Erreur validation jour:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.error?.message || 'Erreur lors de la validation'
                });
                this.isValidating.set(false);
            }
        });
    }

    // ==================== REJETER ====================

    confirmRejeter(demande: DemandeSalaryDto): void {
        this.confirmationService.confirm({
            message: `Voulez-vous rejeter la demande de ${this.formatMontant(demande.amount)} pour ${demande.prenomPersonnel} ${demande.nomPersonnel} ?`,
            header: 'Confirmer le rejet',
            icon: 'pi pi-times-circle',
            acceptLabel: 'Rejeter',
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.rejeterDemande(demande.id!);
            }
        });
    }

    rejeterDemande(id: number): void {
        this.validatingId.set(id);

        this.salaireService.rejeterDemandeSalary(id).subscribe({
            next: (response) => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Information',
                    detail: 'Demande rejetée'
                });
                this.validatingId.set(null);
                this.loadDemandesGroupedByDate();
            },
            error: (error) => {
                console.error('Erreur rejet:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.error?.message || 'Impossible de rejeter la demande'
                });
                this.validatingId.set(null);
            }
        });
    }

    // ==================== UTILITAIRES ====================

    formatMontant(montant: number | undefined): string {
        if (montant === undefined || montant === null) return '-';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'GNF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(montant);
    }

    formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    formatDateShort(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

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
}
