import { InfoPersonnelDto } from '@/interface/info.personnel';
import { ImportResultDto, ValidationErrorDto } from '@/interface/prevision-tresorerie-dto';
import { AvanceSalaireDto } from '@/interface/salary';
import { JavaDatePipe } from '@/pipes/java-date.pipe';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputText, InputTextModule } from 'primeng/inputtext';
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
    standalone: true,
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
        ConfirmDialogModule,
        DropdownModule,
        InputSwitchModule,
        InputTextModule
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
    isUpdatingStatut = signal<number | null>(null);

    // Données
    personnels = signal<InfoPersonnelDto[]>([]);
    avancesSalaire = signal<AvanceSalaireDto[]>([]);

    searchTerm = signal<string>('');
    // ✅ NOUVEAU: Filtre par statut
    selectedStatutFilter = signal<string>('ACTIVE'); // Par défaut: actifs uniquement
    statutOptions = [
        { label: 'Tous', value: '' },
        { label: 'Actifs', value: 'ACTIVE' },
        { label: 'Inactifs', value: 'INACTIVE' }
    ];

    // ✅ NOUVEAU: Compteurs par statut
    countByStatut = signal<{ ACTIVE?: number; INACTIVE?: number }>({});

    // ✅ NOUVEAU: Filtre par nom/prénom - Salaire
    searchTermSalaire = signal<string>('');

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
    countActivePersonnels = computed(() => this.countByStatut()['ACTIVE'] || 0);
    countInactivePersonnels = computed(() => this.countByStatut()['INACTIVE'] || 0);
    countAvances = computed(() => this.avancesSalaire().length);

    hasSalaireData = computed(() => this.avancesSalaire().length > 0);

    salaireImportMessage = computed(() => {
        if (this.hasSalaireData()) {
            const count = this.countAvances();
            return `${count} enregistrement(s) de salaire déjà importé(s) pour ce mois. Vous devez d'abord réinitialiser (reset mensuel) avant d'importer un nouveau fichier.`;
        }
        return '';
    });

    canImportSalaire = computed(() => !this.hasSalaireData());

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

    // ✅ NOUVEAU: Personnels filtrés par recherche
    filteredPersonnels = computed(() => {
        const search = this.searchTerm().toLowerCase().trim();
        const list = this.personnels();

        if (!search) {
            return list;
        }

        return list.filter(
            (p) =>
                p.nom?.toLowerCase().includes(search) ||
                p.prenom?.toLowerCase().includes(search) ||
                p.matricule?.toLowerCase().includes(search) ||
                `${p.prenom} ${p.nom}`.toLowerCase().includes(search) ||
                `${p.nom} ${p.prenom}`.toLowerCase().includes(search)
        );
    });

    // ✅ NOUVEAU: Compteur des résultats filtrés
    countFilteredPersonnels = computed(() => this.filteredPersonnels().length);

    // ✅ NOUVEAU: Avances salaire filtrées par recherche
    filteredAvancesSalaire = computed(() => {
        const search = this.searchTermSalaire().toLowerCase().trim();
        const list = this.avancesSalaire();

        if (!search) {
            return list;
        }

        return list.filter(
            (a) =>
                a.nomPersonnel?.toLowerCase().includes(search) ||
                a.prenomPersonnel?.toLowerCase().includes(search) ||
                a.matricule?.toLowerCase().includes(search) ||
                `${a.prenomPersonnel} ${a.nomPersonnel}`.toLowerCase().includes(search) ||
                `${a.nomPersonnel} ${a.prenomPersonnel}`.toLowerCase().includes(search)
        );
    });

    // ✅ NOUVEAU: Compteur des résultats filtrés - Salaire
    countFilteredAvances = computed(() => this.filteredAvancesSalaire().length);
    // ✅ NOUVEAU: Réinitialiser la recherche
    clearSearch(): void {
        this.searchTerm.set('');
    }

    // ✅ NOUVEAU: Handler pour la recherche
    onSearchChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.searchTerm.set(input.value);
    }

    // ✅ NOUVEAU: Réinitialiser la recherche - Salaire
    clearSearchSalaire(): void {
        this.searchTermSalaire.set('');
    }

    // ✅ NOUVEAU: Handler pour la recherche - Salaire
    onSearchChangeSalaire(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.searchTermSalaire.set(input.value);
    }
    // ✅ NOUVEAU: Surligner le texte recherché - Salaire
    highlightSearchSalaire(text: string | undefined): string {
        if (!text) return '';

        const search = this.searchTermSalaire().trim();
        if (!search) return text;

        const regex = new RegExp(`(${this.escapeRegex(search)})`, 'gi');
        return text.replace(regex, '<mark class="highlight">$1</mark>');
    }
    // ==================== LIFECYCLE ====================
    ngOnInit(): void {
        this.loadPersonnels();
        this.loadAvancesSalaire();
    }

    // ==================== CHARGEMENT DES DONNÉES ====================

    loadPersonnels(): void {
        this.isLoadingPersonnel.set(true);

        const statut = this.selectedStatutFilter();
        // ✅ Appeler avec timestamp pour éviter le cache
        const timestamp = new Date().getTime();
        let url = `${this.salaireService['server']}/ecredit/salaire/info-personnel?_t=${timestamp}`;
        if (statut) {
            url += `&statut=${statut}`;
        }
        this.salaireService.getAllInfoPersonnel(statut || undefined).subscribe({
            next: (response) => {
                if (response.data?.personnels) {
                    this.personnels.set(response.data.personnels as unknown as InfoPersonnelDto[]);
                }
                if (response.data?.countByStatut) {
                    this.countByStatut.set(response.data.countByStatut as { ACTIVE?: number; INACTIVE?: number });
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

    // ✅ NOUVEAU: Changer le filtre de statut
    onStatutFilterChange(event: any): void {
        this.selectedStatutFilter.set(event.value);
        this.loadPersonnels();
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

    // ==================== GESTION STATUT PERSONNEL ====================

    /**
     * Toggle le statut d'un personnel (activer/désactiver)
     */
    togglePersonnelStatut(personnel: InfoPersonnelDto): void {
        const newStatut = personnel.statut === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        const action = newStatut === 'ACTIVE' ? 'activer' : 'désactiver';

        this.confirmationService.confirm({
            message: `Voulez-vous ${action} ${personnel.prenom} ${personnel.nom} (${personnel.matricule}) ?`,
            header: 'Confirmation',
            icon: newStatut === 'ACTIVE' ? 'pi pi-check-circle' : 'pi pi-times-circle',
            acceptLabel: newStatut === 'ACTIVE' ? 'Activer' : 'Désactiver',
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: newStatut === 'ACTIVE' ? 'p-button-success' : 'p-button-danger',
            accept: () => {
                this.updatePersonnelStatut(personnel.id!, newStatut);
            }
        });
    }

    /**
     * Mettre à jour le statut d'un personnel
     */
    private updatePersonnelStatut(id: number, statut: string): void {
        this.isUpdatingStatut.set(id);

        this.salaireService.updateInfoPersonnelStatut(id, statut).subscribe({
            next: (response) => {
                const action = statut === 'ACTIVE' ? 'activé' : 'désactivé';
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: `Personnel ${action} avec succès`
                });

                // Mettre à jour localement
                this.personnels.update((list) => list.map((p) => (p.id === id ? { ...p, statut: statut as 'ACTIVE' | 'INACTIVE' } : p)));

                // Recharger les compteurs
                this.loadPersonnels();
                this.isUpdatingStatut.set(null);
            },
            error: (error) => {
                console.error('Erreur mise à jour statut:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible de mettre à jour le statut'
                });
                this.isUpdatingStatut.set(null);
            }
        });
    }

    /**
     * Activer un personnel directement
     */
    activerPersonnel(personnel: InfoPersonnelDto): void {
        this.confirmationService.confirm({
            message: `Voulez-vous réactiver ${personnel.prenom} ${personnel.nom} (${personnel.matricule}) ?`,
            header: 'Réactiver le personnel',
            icon: 'pi pi-check-circle',
            acceptLabel: 'Réactiver',
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: 'p-button-success',
            accept: () => {
                this.updatePersonnelStatut(personnel.id!, 'ACTIVE');
            }
        });
    }

    /**
     * Désactiver un personnel (retraite, démission, etc.)
     */
    desactiverPersonnel(personnel: InfoPersonnelDto): void {
        this.confirmationService.confirm({
            message: `Voulez-vous désactiver ${personnel.prenom} ${personnel.nom} (${personnel.matricule}) ?\n\nCette personne ne pourra plus faire de demande d'avance sur salaire.`,
            header: 'Désactiver le personnel',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Désactiver',
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.updatePersonnelStatut(personnel.id!, 'INACTIVE');
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
            case 'ACTIVE':
                return 'success';
            case 'INACTIVE':
                return 'danger';
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

    getStatutLabel(statut: string): string {
        switch (statut?.toUpperCase()) {
            case 'ACTIVE':
                return 'Actif';
            case 'INACTIVE':
                return 'Inactif';
            default:
                return statut || 'Inconnu';
        }
    }
    // ✅ NOUVEAU: Surligner le texte recherché
    highlightSearch(text: string | undefined): string {
        if (!text) return '';

        const search = this.searchTerm().trim();
        if (!search) return text;

        const regex = new RegExp(`(${this.escapeRegex(search)})`, 'gi');
        return text.replace(regex, '<mark class="highlight">$1</mark>');
    }

    // Helper pour échapper les caractères spéciaux regex
    private escapeRegex(str: string): string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
