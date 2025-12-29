import { InfoPersonnelDto } from '@/interface/info.personnel';
import { ImportResultDto, ValidationErrorDto } from '@/interface/prevision-tresorerie-dto';
import { AvanceSalaireDto } from '@/interface/salary';
import { IUser } from '@/interface/user';
import { JavaDatePipe } from '@/pipes/java-date.pipe';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-gestion-personnel',
    imports: [
        CommonModule,
        FormsModule,
        JavaDatePipe,
        FileUploadModule,
        ButtonModule,
        TableModule,
        CardModule,
        ToastModule,
        ProgressBarModule,
        TagModule,
        DialogModule,
        TabViewModule,
        TooltipModule,
        BadgeModule,
        DividerModule,
        MessagesModule,
        MessageModule,
        ConfirmDialogModule
    ],
    templateUrl: './gestion-personnel.component.html',
    styleUrl: './gestion-personnel.component.scss',
    providers: [MessageService, ConfirmationService]
})
export class GestionPersonnelComponent implements OnInit {
    private salaireService = inject(UserService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    // ==================== SIGNALS ====================

    // État de chargement
    isLoadingPersonnel = signal<boolean>(false);
    isLoadingSalaire = signal<boolean>(false);
    isUploadingPersonnel = signal<boolean>(false);
    isUploadingSalaire = signal<boolean>(false);
    isResetting = signal<boolean>(false);

    // Données
    personnels = signal<InfoPersonnelDto[]>([]);
    avancesSalaire = signal<AvanceSalaireDto[]>([]);

    // Résultats d'import
    importResultPersonnel = signal<ImportResultDto | null>(null);
    importResultSalaire = signal<ImportResultDto | null>(null);

    // Dialog pour erreurs
    showErrorDialog = signal<boolean>(false);
    currentErrors = signal<ValidationErrorDto[]>([]);
    errorDialogTitle = signal<string>('');

    // ==================== COMPUTED ====================

    // Compteurs
    countPersonnels = computed(() => this.personnels().length);
    countAvances = computed(() => this.avancesSalaire().length);

    // ✅ NOUVEAU: Vérifier si des données de salaire existent pour le mois
    hasSalaireData = computed(() => this.avancesSalaire().length > 0);

    // ✅ NOUVEAU: Message pour l'utilisateur
    salaireImportMessage = computed(() => {
        if (this.hasSalaireData()) {
            const count = this.countAvances();
            return `${count} enregistrement(s) de salaire déjà importé(s) pour ce mois. Vous devez d'abord réinitialiser (reset mensuel) avant d'importer un nouveau fichier.`;
        }
        return '';
    });

    // ✅ NOUVEAU: Peut importer le fichier salaire ?
    canImportSalaire = computed(() => !this.hasSalaireData());

    // Stats des imports
    statsPersonnel = computed(() => {
        const result = this.importResultPersonnel();
        if (!result) return null;
        return {
            total: result.totalLignes,
            importees: result.lignesImportees,
            erreurs: result.lignesEnErreur,
            success: result.success
        };
    });

    statsSalaire = computed(() => {
        const result = this.importResultSalaire();
        if (!result) return null;
        return {
            total: result.totalLignes,
            importees: result.lignesImportees,
            erreurs: result.lignesEnErreur,
            success: result.success
        };
    });

    // ==================== LIFECYCLE ====================

    ngOnInit(): void {
        this.loadPersonnels();
        this.loadAvancesSalaire();
    }

    // ==================== CHARGEMENT DES DONNÉES ====================

    loadPersonnels(): void {
        this.isLoadingPersonnel.set(true);
        this.salaireService.getAllInfoPersonnel().subscribe({
            next: (response) => {
                if (response.data?.personnels) {
                    this.personnels.set(response.data.personnels as unknown as InfoPersonnelDto[]);
                }
                this.isLoadingPersonnel.set(false);
            },
            error: (error) => {
                console.error('Erreur chargement personnels:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible de charger la liste du personnel'
                });
                this.isLoadingPersonnel.set(false);
            }
        });
    }

    loadAvancesSalaire(): void {
        this.isLoadingSalaire.set(true);
        this.salaireService.getAllAvanceSalaire().subscribe({
            next: (response) => {
                if (response.data?.avances) {
                    this.avancesSalaire.set(response.data.avances as unknown as AvanceSalaireDto[]);
                } else {
                    this.avancesSalaire.set([]);
                }
                this.isLoadingSalaire.set(false);
            },
            error: (error) => {
                console.error('Erreur chargement avances:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible de charger les avances salaire'
                });
                this.avancesSalaire.set([]);
                this.isLoadingSalaire.set(false);
            }
        });
    }

    // ==================== IMPORT FICHIER PERSONNEL ====================

    onUploadPersonnel(event: FileUploadHandlerEvent): void {
        const file = event.files[0];

        if (!file) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Veuillez sélectionner un fichier'
            });
            return;
        }

        if (!this.isValidExcelFile(file)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Le fichier doit être au format Excel (.xlsx ou .xls)'
            });
            return;
        }

        this.isUploadingPersonnel.set(true);
        this.importResultPersonnel.set(null);

        this.salaireService.importInfoPersonnel(file).subscribe({
            next: (response) => {
                const result = response.data?.importResult as unknown as ImportResultDto;
                this.importResultPersonnel.set(result);

                if (result?.success) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: `Import terminé: ${result.lignesImportees}/${result.totalLignes} lignes importées`
                    });
                } else {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Import partiel',
                        detail: `${result?.lignesImportees}/${result?.totalLignes} lignes importées, ${result?.lignesEnErreur} erreurs`
                    });
                }
                this.loadPersonnels();
                this.isUploadingPersonnel.set(false);
            },
            error: (error) => {
                console.error('Erreur import personnel:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.message || "Erreur lors de l'import du fichier"
                });
                this.isUploadingPersonnel.set(false);
            }
        });
    }

    // ==================== IMPORT FICHIER SALAIRE ====================

    onUploadSalaire(event: FileUploadHandlerEvent): void {
        // ✅ Vérifier si on peut importer
        if (!this.canImportSalaire()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Import impossible',
                detail: "Vous devez d'abord réinitialiser les données avant d'importer un nouveau fichier."
            });
            return;
        }

        const file = event.files[0];

        if (!file) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Veuillez sélectionner un fichier'
            });
            return;
        }

        if (!this.isValidExcelFile(file)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Le fichier doit être au format Excel (.xlsx ou .xls)'
            });
            return;
        }

        this.isUploadingSalaire.set(true);
        this.importResultSalaire.set(null);

        this.salaireService.importAvanceSalaire(file).subscribe({
            next: (response) => {
                const result = response.data?.importResult as unknown as ImportResultDto;
                this.importResultSalaire.set(result);

                if (result?.success) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: `Import terminé: ${result.lignesImportees}/${result.totalLignes} lignes importées`
                    });
                } else {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Import partiel',
                        detail: `${result?.lignesImportees}/${result?.totalLignes} lignes importées, ${result?.lignesEnErreur} erreurs`
                    });
                }
                this.loadAvancesSalaire();
                this.isUploadingSalaire.set(false);
            },
            error: (error) => {
                console.error('Erreur import salaire:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error.message || "Erreur lors de l'import du fichier"
                });
                this.isUploadingSalaire.set(false);
            }
        });
    }

    // ==================== AFFICHAGE DES ERREURS ====================

    showErrors(type: 'personnel' | 'salaire'): void {
        const result = type === 'personnel' ? this.importResultPersonnel() : this.importResultSalaire();

        if (result?.erreursValidation && result.erreursValidation.length > 0) {
            this.currentErrors.set(result.erreursValidation);
            this.errorDialogTitle.set(type === 'personnel' ? "Erreurs d'import - Fichier Personnel" : "Erreurs d'import - Fichier Salaire");
            this.showErrorDialog.set(true);
        }
    }

    hideErrorDialog(): void {
        this.showErrorDialog.set(false);
        this.currentErrors.set([]);
    }

    // ==================== RESET MENSUEL ====================

    confirmResetAvancesSalaire(): void {
        this.confirmationService.confirm({
            message: `Êtes-vous sûr de vouloir réinitialiser les ${this.countAvances()} enregistrements de salaire? Cette action est irréversible.`,
            header: 'Confirmation du reset mensuel',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui, réinitialiser',
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.resetAvancesSalaire();
            }
        });
    }

    resetAvancesSalaire(): void {
        this.isResetting.set(true);

        this.salaireService.truncateAvanceSalaire().subscribe({
            next: (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Toutes les avances salaire ont été supprimées. Vous pouvez maintenant importer un nouveau fichier.'
                });
                this.avancesSalaire.set([]);
                this.importResultSalaire.set(null);
                this.isResetting.set(false);
            },
            error: (error) => {
                console.error('Erreur reset avances:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible de réinitialiser les avances salaire'
                });
                this.isResetting.set(false);
            }
        });
    }

    // ==================== UTILITAIRES ====================

    private isValidExcelFile(file: File): boolean {
        const validExtensions = ['.xlsx', '.xls'];
        const fileName = file.name.toLowerCase();
        return validExtensions.some((ext) => fileName.endsWith(ext));
    }

    formatMontant(montant: number | undefined): string {
        if (montant === undefined || montant === null) return '-';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'GNF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(montant);
    }

    getStatutSeverity(statut: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        switch (statut?.toUpperCase()) {
            case 'EN_ATTENTE':
                return 'warn';
            case 'APPROUVE':
            case 'VALIDER':
            case 'CONFIRMER':
                return 'success';
            case 'REJETE':
            case 'REJET':
            case 'ANNULLER':
                return 'danger';
            default:
                return 'info';
        }
    }
}
