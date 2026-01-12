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
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { ChipModule } from 'primeng/chip';
import { DemandeSalaryDto } from '@/interface/demande.salary';
import { JavaDatePipe } from '@/pipes/java-date.pipe';
import { UserService } from '@/service/user.service';

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
    selector: 'app-df',
    standalone: true,
    imports: [CommonModule, FormsModule, JavaDatePipe, CardModule, TableModule, ButtonModule, TagModule, ToastModule, ConfirmDialogModule, TooltipModule, BadgeModule, DividerModule, CheckboxModule, ProgressSpinnerModule, TabViewModule, ChipModule],
    providers: [MessageService, ConfirmationService],
    templateUrl: './df.component.html',
    styleUrl: './df.component.scss'
})
export class DfComponent implements OnInit {
    @Input() user?: IUser;

    private salaireService = inject(UserService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    // ==================== SIGNALS ====================

    isLoading = signal<boolean>(false);
    isConfirming = signal<boolean>(false);
    isExporting = signal<boolean>(false);
    confirmingId = signal<number | null>(null);

    demandesParJour = signal<DemandesParJour[]>([]);
    selectedStatut = signal<string>('VALIDER');

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

    // IDs confirmés pour export
    confirmedIds = signal<number[]>([]);

    // ==================== LIFECYCLE ====================

    ngOnInit(): void {
        this.loadDemandesGroupedByDate();
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

        jour.allSelected = jour.selectedIds.length === jour.demandes.length;
        this.demandesParJour.set([...this.demandesParJour()]);
    }

    isSelected(jour: DemandesParJour, demandeId: number): boolean {
        return jour.selectedIds?.includes(demandeId) || false;
    }

    // ==================== CONFIRMATION INDIVIDUELLE ====================

    confirmConfirmer(demande: DemandeSalaryDto): void {
        this.confirmationService.confirm({
            message: `Voulez-vous confirmer la demande de ${this.formatMontant(demande.amount)} pour ${demande.prenomPersonnel} ${demande.nomPersonnel} ?`,
            header: 'Confirmer la demande',
            icon: 'pi pi-check-circle',
            acceptLabel: 'Confirmer',
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: 'p-button-success',
            accept: () => {
                this.confirmerDemande(demande.id!);
            }
        });
    }

    confirmerDemande(id: number): void {
        this.confirmingId.set(id);

        this.salaireService.confirmerDemandeSalary(id).subscribe({
            next: (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Demande confirmée avec succès'
                });
                this.confirmingId.set(null);

                // Ajouter l'ID pour export potentiel
                this.confirmedIds.update((ids) => [...ids, id]);

                this.loadDemandesGroupedByDate();
            },
            error: (error) => {
                console.error('Erreur confirmation:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.error?.message || 'Impossible de confirmer la demande'
                });
                this.confirmingId.set(null);
            }
        });
    }

    // ==================== CONFIRMATION MASSIVE ====================

    confirmConfirmerSelection(): void {
        const total = this.totalSelected();

        this.confirmationService.confirm({
            message: `Voulez-vous confirmer les ${total} demande(s) sélectionnée(s) ?`,
            header: 'Confirmation massive',
            icon: 'pi pi-check-circle',
            acceptLabel: `Confirmer ${total} demande(s)`,
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: 'p-button-success',
            accept: () => {
                this.confirmerSelection();
            }
        });
    }

    confirmerSelection(): void {
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

        this.isConfirming.set(true);

        this.salaireService.confirmerMultipleDemandeSalary(allSelectedIds).subscribe({
            next: (response) => {
                const totalConfirmed = response.data?.totalConfirmed || 0;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: `${totalConfirmed} demande(s) confirmée(s) avec succès`
                });
                this.isConfirming.set(false);

                // Ajouter les IDs pour export
                this.confirmedIds.update((ids) => [...ids, ...allSelectedIds]);

                // Proposer l'export
                this.proposeExport(allSelectedIds);

                this.loadDemandesGroupedByDate();
            },
            error: (error) => {
                console.error('Erreur confirmation massive:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.error?.message || 'Erreur lors de la confirmation massive'
                });
                this.isConfirming.set(false);
            }
        });
    }

    // ==================== CONFIRMATION PAR JOUR ====================

    confirmConfirmerJour(jour: DemandesParJour): void {
        this.confirmationService.confirm({
            message: `Voulez-vous confirmer les ${jour.count} demande(s) du ${this.formatDate(jour.date)} pour un total de ${this.formatMontant(jour.totalAmount)} ?`,
            header: 'Confirmer toutes les demandes du jour',
            icon: 'pi pi-check-circle',
            acceptLabel: `Confirmer ${jour.count} demande(s)`,
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: 'p-button-success',
            accept: () => {
                this.confirmerJour(jour);
            }
        });
    }

    confirmerJour(jour: DemandesParJour): void {
        const ids = jour.demandes.map((d) => d.id!);

        this.isConfirming.set(true);

        this.salaireService.confirmerMultipleDemandeSalary(ids).subscribe({
            next: (response) => {
                const totalConfirmed = response.data?.totalConfirmed || 0;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: `${totalConfirmed} demande(s) du ${this.formatDate(jour.date)} confirmée(s)`
                });
                this.isConfirming.set(false);

                // Proposer l'export
                this.proposeExport(ids);

                this.loadDemandesGroupedByDate();
            },
            error: (error) => {
                console.error('Erreur confirmation jour:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.error?.message || 'Erreur lors de la confirmation'
                });
                this.isConfirming.set(false);
            }
        });
    }

    // ==================== REJET ====================

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
        this.confirmingId.set(id);

        this.salaireService.rejeterDemandeSalary(id).subscribe({
            next: (response) => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Information',
                    detail: 'Demande rejetée'
                });
                this.confirmingId.set(null);
                this.loadDemandesGroupedByDate();
            },
            error: (error) => {
                console.error('Erreur rejet:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.error?.message || 'Impossible de rejeter la demande'
                });
                this.confirmingId.set(null);
            }
        });
    }

    // ==================== EXPORT EXCEL ====================

    proposeExport(ids: number[]): void {
        this.confirmationService.confirm({
            message: 'Voulez-vous exporter ces demandes en Excel ?',
            header: 'Export Excel',
            icon: 'pi pi-file-excel',
            acceptLabel: 'Exporter',
            rejectLabel: 'Plus tard',
            acceptButtonStyleClass: 'p-button-success',
            accept: () => {
                this.exportExcel(ids);
            }
        });
    }

    exportExcel(ids?: number[]): void {
        this.isExporting.set(true);

        const exportObservable = ids && ids.length > 0 ? this.salaireService.exportDemandesExcel(ids) : this.salaireService.exportAllConfirmedDemandesExcel();

        exportObservable.subscribe({
            next: (blob) => {
                // Vérifier si c'est une réponse d'erreur JSON
                if (blob.type === 'application/json') {
                    blob.text().then((text) => {
                        try {
                            const errorResponse = JSON.parse(text);
                            this.messageService.add({
                                severity: 'warn',
                                summary: 'Attention',
                                detail: errorResponse.message || 'Aucune donnée à exporter'
                            });
                        } catch {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Erreur',
                                detail: "Impossible d'exporter le fichier"
                            });
                        }
                        this.isExporting.set(false);
                    });
                    return;
                }

                const filename = `avances_salaire_${new Date().toISOString().split('T')[0]}.xlsx`;
                this.downloadFile(blob, filename);

                this.messageService.add({
                    severity: 'success',
                    summary: 'Export réussi',
                    detail: 'Le fichier Excel a été téléchargé'
                });
                this.isExporting.set(false);
            },
            error: (error) => {
                console.error('Erreur export:', error);
                // Essayer de lire le message d'erreur du blob
                if (error.error instanceof Blob) {
                    error.error.text().then((text: string) => {
                        try {
                            const errorResponse = JSON.parse(text);
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Erreur',
                                detail: errorResponse.message || "Impossible d'exporter le fichier"
                            });
                        } catch {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Erreur',
                                detail: "Impossible d'exporter le fichier"
                            });
                        }
                    });
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: error.error?.message || "Impossible d'exporter le fichier"
                    });
                }
                this.isExporting.set(false);
            }
        });
    }

    exportAllConfirmed(): void {
        this.isExporting.set(true);

        this.salaireService.exportAllConfirmedDemandesExcel().subscribe({
            next: (blob) => {
                // Vérifier si c'est une réponse d'erreur JSON
                if (blob.type === 'application/json') {
                    blob.text().then((text) => {
                        try {
                            const errorResponse = JSON.parse(text);
                            this.messageService.add({
                                severity: 'warn',
                                summary: 'Attention',
                                detail: errorResponse.message || 'Aucune donnée à exporter'
                            });
                        } catch {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Erreur',
                                detail: "Impossible d'exporter le fichier"
                            });
                        }
                        this.isExporting.set(false);
                    });
                    return;
                }

                const filename = `avances_salaire_confirmees_${new Date().toISOString().split('T')[0]}.xlsx`;
                this.downloadFile(blob, filename);

                this.messageService.add({
                    severity: 'success',
                    summary: 'Export réussi',
                    detail: 'Le fichier Excel a été téléchargé'
                });
                this.isExporting.set(false);
            },
            error: (error) => {
                console.error('Erreur export:', error);
                // Essayer de lire le message d'erreur du blob
                if (error.error instanceof Blob) {
                    error.error.text().then((text: string) => {
                        try {
                            const errorResponse = JSON.parse(text);
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Erreur',
                                detail: errorResponse.message || "Impossible d'exporter le fichier"
                            });
                        } catch {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Erreur',
                                detail: "Impossible d'exporter le fichier"
                            });
                        }
                    });
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: error.error?.message || "Impossible d'exporter le fichier"
                    });
                }
                this.isExporting.set(false);
            }
        });
    }

    private downloadFile(blob: Blob, filename: string): void {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
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
                return 'warn';
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
                return 'Validée (DRH)';
            case 'CONFIRMER':
                return 'Confirmée (DF)';
            case 'REJET':
                return 'Rejetée';
            case 'ANNULLER':
                return 'Annulée';
            default:
                return statut;
        }
    }

    /**
     * Récupérer les IDs des demandes d'un jour
     */
    getDemandeIds(jour: DemandesParJour): number[] {
        return jour.demandes.map((d) => d.id!);
    }

    /**
     * Exporter les demandes d'un jour
     */
    exportJour(jour: DemandesParJour): void {
        const ids = this.getDemandeIds(jour);
        this.exportExcel(ids);
    }
}
