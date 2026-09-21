import { InfoPersonnelDto } from '@/interface/info.personnel';
import { ImportResultDto, ValidationErrorDto } from '@/interface/prevision-tresorerie-dto';
import { AvanceSalaireDto } from '@/interface/salary';
import { JavaDatePipe } from '@/pipes/java-date.pipe';
import { UserService } from '@/service/user.service';
import { DrhService } from '@/service/drh.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
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
import * as XLSX from 'xlsx';

export interface SalairePreviewRow {
    matricule: string;
    netAPayer: number;
    netAPayerFormatted?: string;
}

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
        InputTextModule,
        CalendarModule
    ],
    templateUrl: './gestion-personnel.component.html',
    styleUrl: './gestion-personnel.component.scss',
    providers: [MessageService, ConfirmationService]
})
export class GestionPersonnelComponent implements OnInit {
    private salaireService = inject(UserService);
    private drhService = inject(DrhService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private destroyRef = inject(DestroyRef);

    // ==================== V150 : filtre siège, modification du nom, déclarations, badgés sans pointage ====================

    /** Filtre siège : TOUS | SIEGE (badge siège) | HORS_SIEGE. */
    filtreSiege = signal<'TOUS' | 'SIEGE' | 'HORS_SIEGE'>('TOUS');
    siegeOptions = [
        { label: 'Tout le personnel', value: 'TOUS' },
        { label: 'Personnel du siège (badgés)', value: 'SIEGE' },
        { label: 'Hors siège', value: 'HORS_SIEGE' }
    ];

    editionNomVisible = false;
    editionNomEnCours = signal(false);
    editionNom: { id: number; matricule: string; nom: string; prenom: string } = { id: 0, matricule: '', nom: '', prenom: '' };

    declarationVisible = false;
    declarationEnCours = signal(false);
    declaration: { id?: number; matricule: string; nomComplet: string; du: Date | null; au: Date | null; motif: string; commentaire: string } =
        { matricule: '', nomComplet: '', du: null, au: null, motif: 'OUBLI_BADGE', commentaire: '' };
    motifOptions = [
        { label: 'Oubli de badge (présent)', value: 'OUBLI_BADGE' },
        { label: 'Mission', value: 'MISSION' },
        { label: 'Formation', value: 'FORMATION' },
        { label: 'Maladie', value: 'MALADIE' },
        { label: 'Autre absence justifiée', value: 'AUTRE' }
    ];
    /** Déclarations récentes de la personne ouverte dans le dialogue (90 derniers jours + 60 à venir). */
    declarationsPersonne = signal<any[]>([]);

    badgesSansPointageVisible = false;
    badgesSansPointage = signal<any[]>([]);
    badgesSansPointageEnCours = signal(false);

    ouvrirEditionNom(p: InfoPersonnelDto): void {
        this.editionNom = { id: p.id!, matricule: p.matricule, nom: p.nom || '', prenom: p.prenom || '' };
        this.editionNomVisible = true;
    }

    enregistrerNom(): void {
        const nom = this.editionNom.nom.trim(), prenom = this.editionNom.prenom.trim();
        if (!nom || !prenom) return;
        this.editionNomEnCours.set(true);
        this.salaireService.updateNomPersonnel(this.editionNom.id, nom, prenom).subscribe({
            next: () => {
                this.editionNomEnCours.set(false);
                this.editionNomVisible = false;
                this.messageService.add({ severity: 'success', summary: 'Nom modifié', detail: `${prenom} ${nom} (matricule ${this.editionNom.matricule})` });
                this.loadPersonnels();
            },
            error: (e) => {
                this.editionNomEnCours.set(false);
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: e.error?.data?.error || e.error?.message || 'Modification impossible' });
            }
        });
    }

    ouvrirDeclaration(p: InfoPersonnelDto): void {
        const aujourdhui = new Date();
        this.declaration = { id: p.id, matricule: p.matricule, nomComplet: `${p.prenom || ''} ${p.nom || ''}`.trim(),
            du: aujourdhui, au: aujourdhui, motif: 'OUBLI_BADGE', commentaire: '' };
        this.declarationVisible = true;
        this.chargerDeclarationsPersonne(p.matricule);
    }

    private chargerDeclarationsPersonne(matricule: string): void {
        const du = new Date(); du.setDate(du.getDate() - 90);
        const au = new Date(); au.setDate(au.getDate() + 60);
        this.drhService.declarationsPresence$(this.toIso(du), this.toIso(au), matricule).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.declarationsPersonne.set((r.data as any)?.declarations || []),
            error: () => this.declarationsPersonne.set([])
        });
    }

    enregistrerDeclaration(): void {
        const d = this.declaration;
        if (!d.du) return;
        this.declarationEnCours.set(true);
        this.drhService.declarerPresence$({
            matricule: d.matricule, jourDebut: this.toIso(d.du), jourFin: this.toIso(d.au || d.du),
            motif: d.motif, commentaire: d.commentaire.trim() || undefined
        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => {
                this.declarationEnCours.set(false);
                this.messageService.add({ severity: 'success', summary: 'Déclaration enregistrée',
                    detail: `${d.nomComplet} : ${this.libelleMotif(d.motif)} — présences recalculées` });
                this.declaration.commentaire = '';
                this.chargerDeclarationsPersonne(d.matricule);
            },
            error: (e) => {
                this.declarationEnCours.set(false);
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: e.error?.data?.error || e.error?.message || 'Déclaration impossible' });
            }
        });
    }

    retirerDeclaration(dec: any): void {
        this.drhService.supprimerDeclarationPresence$(dec.declarationId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Retirée', detail: 'Déclaration retirée, présences recalculées' });
                this.chargerDeclarationsPersonne(this.declaration.matricule);
            },
            error: (e) => this.messageService.add({ severity: 'error', summary: 'Erreur', detail: e.error?.data?.error || e.error?.message || 'Retrait impossible' })
        });
    }

    libelleMotif(m: string): string {
        return this.motifOptions.find((o) => o.value === m)?.label || m;
    }

    ouvrirBadgesSansPointage(): void {
        this.badgesSansPointageVisible = true;
        this.badgesSansPointageEnCours.set(true);
        this.drhService.badgesSansPointage$(30).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => {
                this.badgesSansPointageEnCours.set(false);
                this.badgesSansPointage.set((r.data as any)?.badges || []);
            },
            error: (e) => {
                this.badgesSansPointageEnCours.set(false);
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: e.error?.data?.error || e.error?.message || 'Chargement impossible' });
            }
        });
    }

    retirerBadge(b: any): void {
        this.salaireService.updateBadgeSiege(b.id, false).subscribe({
            next: () => {
                this.badgesSansPointage.update((list) => list.filter((x) => x.id !== b.id));
                this.messageService.add({ severity: 'success', summary: 'Badge retiré', detail: `${b.prenom} ${b.nom} ne sera plus contrôlé` });
                this.loadPersonnels();
            },
            error: (e) => this.messageService.add({ severity: 'error', summary: 'Erreur', detail: e.error?.message || 'Mise à jour impossible' })
        });
    }

    private toIso(d: Date): string {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

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

    // Import du fichier du personnel + ajout manuel
    importPersonnelEnCours = signal(false);
    resultatImportPersonnel = signal<any | null>(null);
    ajoutPersonnelVisible = false;
    ajoutPersonnelEnCours = signal(false);
    nouveauPersonnel = { matricule: '', nom: '', prenom: '', numeroCompte: '' };

    importerFichierPersonnel(event: Event): void {
        const input = event.target as HTMLInputElement;
        const fichier = input.files?.[0];
        input.value = '';
        if (!fichier) return;
        this.importPersonnelEnCours.set(true);
        this.salaireService.importInfoPersonnel(fichier).subscribe({
            next: (response) => {
                this.importPersonnelEnCours.set(false);
                this.resultatImportPersonnel.set((response.data as any)?.importResult || null);
                this.messageService.add({ severity: 'success', summary: 'Importé', detail: response.message || 'Fichier du personnel importé' });
                this.loadPersonnels();
            },
            error: (e) => {
                this.importPersonnelEnCours.set(false);
                this.messageService.add({ severity: 'error', summary: 'Erreur',
                    detail: e.error?.data?.error || e.error?.message || "Import impossible — vérifiez le format (Matricule | Nom | Prénom)" });
            }
        });
    }

    /** Marquer / retirer le badge siège d'un personnel (rapprochement des présences). */
    basculerBadgeSiege(personnel: InfoPersonnelDto, actif: boolean): void {
        this.salaireService.updateBadgeSiege(personnel.id!, actif).subscribe({
            next: () => {
                personnel.badgeSiege = actif;
                this.messageService.add({ severity: 'success', summary: actif ? 'Badgé' : 'Retiré',
                    detail: `${personnel.prenom} ${personnel.nom} ${actif ? 'sera contrôlé' : 'ne sera plus contrôlé'} par le rapprochement des présences` });
            },
            error: (e) => {
                personnel.badgeSiege = !actif;
                this.personnels.set([...this.personnels()]);
                this.messageService.add({ severity: 'error', summary: 'Erreur',
                    detail: e.error?.message || 'Mise à jour impossible' });
            }
        });
    }

    ouvrirAjoutPersonnel(): void {
        this.nouveauPersonnel = { matricule: '', nom: '', prenom: '', numeroCompte: '' };
        this.ajoutPersonnelVisible = true;
    }

    ajouterPersonnel(): void {
        this.ajoutPersonnelEnCours.set(true);
        this.salaireService.addInfoPersonnel({
            matricule: this.nouveauPersonnel.matricule.trim(),
            nom: this.nouveauPersonnel.nom.trim(),
            prenom: this.nouveauPersonnel.prenom.trim(),
            numeroCompte: this.nouveauPersonnel.numeroCompte.trim() || undefined
        }).subscribe({
            next: () => {
                this.ajoutPersonnelEnCours.set(false);
                this.ajoutPersonnelVisible = false;
                this.messageService.add({ severity: 'success', summary: 'Ajouté', detail: 'Personnel ajouté au fichier du personnel' });
                this.loadPersonnels();
            },
            error: (e) => {
                this.ajoutPersonnelEnCours.set(false);
                this.messageService.add({ severity: 'error', summary: 'Erreur',
                    detail: e.error?.data?.error || e.error?.message || 'Ajout impossible' });
            }
        });
    }
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

    // Preview fichier salaire
    salairePreviewData = signal<SalairePreviewRow[]>([]);
    salaireSelectedFile = signal<File | null>(null);
    isParsingFile = signal<boolean>(false);

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

    hasSalairePreview = computed(() => this.salairePreviewData().length > 0);
    previewTotalNet = computed(() => {
        return this.salairePreviewData().reduce((sum, row) => sum + (row.netAPayer || 0), 0);
    });

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
        const siege = this.filtreSiege();
        const list = this.personnels().filter((p) =>
            siege === 'TOUS' ? true : siege === 'SIEGE' ? !!p.badgeSiege : !p.badgeSiege);

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

    /**
     * Appelé quand l'utilisateur sélectionne un fichier Excel.
     * Parse le fichier côté client et affiche un aperçu dans un tableau.
     */
    onSalaireFileSelect(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) return;

        if (!this.isValidExcelFile(file)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Le fichier doit être au format Excel (.xlsx ou .xls)'
            });
            input.value = '';
            return;
        }

        this.isParsingFile.set(true);
        this.salaireSelectedFile.set(file);
        this.salairePreviewData.set([]);
        this.importResultSalaire.set(null);

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // Lire toutes les données brutes par index de colonne
                const rawRows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '', raw: true });

                console.log('Excel raw rows (first 5):', rawRows.slice(0, 5));
                console.log('Number of columns in row 1:', rawRows[1]?.length, 'values:', rawRows[1]);

                // Ignorer la première ligne (en-têtes) et filtrer les lignes vides
                const dataRows = rawRows.slice(1).filter(row => {
                    const col0 = row[0];
                    return col0 !== '' && col0 !== null && col0 !== undefined;
                });

                const previewRows: SalairePreviewRow[] = dataRows.map(row => {
                    const matricule = String(row[0]).trim();

                    // Chercher le montant : essayer toutes les colonnes à partir de la 2ème
                    let netAPayer = 0;
                    for (let i = 1; i < row.length; i++) {
                        const val = row[i];
                        if (val === '' || val === null || val === undefined) continue;

                        if (typeof val === 'number') {
                            netAPayer = val;
                            break;
                        }
                        // Nettoyer les espaces (normaux, insécables, fins) et convertir
                        const cleaned = String(val).replace(/[\s\u00A0\u202F\u2009]/g, '').replace(',', '.');
                        const parsed = parseFloat(cleaned);
                        if (!isNaN(parsed) && parsed > 0) {
                            netAPayer = parsed;
                            break;
                        }
                    }

                    return {
                        matricule,
                        netAPayer,
                        netAPayerFormatted: new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'GNF',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(netAPayer)
                    };
                });

                this.salairePreviewData.set(previewRows);

                if (previewRows.length === 0) {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Fichier vide',
                        detail: 'Aucune donnée valide trouvée dans le fichier. Vérifiez les colonnes "Matricule" et "NET A PAYER".'
                    });
                } else {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Aperçu chargé',
                        detail: `${previewRows.length} ligne(s) lue(s) depuis le fichier. Vérifiez puis cliquez sur "Importer".`
                    });
                }
            } catch (error) {
                console.error('Erreur parsing Excel:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur de lecture',
                    detail: 'Impossible de lire le fichier Excel. Vérifiez le format.'
                });
                this.salaireSelectedFile.set(null);
            } finally {
                this.isParsingFile.set(false);
            }
        };

        reader.onerror = () => {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible de lire le fichier.'
            });
            this.isParsingFile.set(false);
            this.salaireSelectedFile.set(null);
        };

        reader.readAsArrayBuffer(file);
    }

    /**
     * Annuler la sélection du fichier et vider l'aperçu.
     */
    clearSalairePreview(): void {
        this.salairePreviewData.set([]);
        this.salaireSelectedFile.set(null);
        this.importResultSalaire.set(null);
    }

    /**
     * Envoyer le fichier sélectionné au backend pour import en base.
     */
    confirmImportSalaire(): void {
        const file = this.salaireSelectedFile();
        if (!file) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Veuillez d\'abord sélectionner un fichier'
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
                // Vider l'aperçu après import réussi
                this.salairePreviewData.set([]);
                this.salaireSelectedFile.set(null);
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

    /** Kept for backward compatibility with p-fileUpload if needed */
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
        if (!file) return;

        this.salaireSelectedFile.set(file);
        // Trigger the same parsing
        const fakeEvent = { target: { files: [file] } } as unknown as Event;
        this.onSalaireFileSelect(fakeEvent);
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
