import { Component, OnInit, inject, signal, computed, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '@/service/user.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { PanelModule } from 'primeng/panel';
import { MessagesModule } from 'primeng/messages';

import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { ReferenceData } from '@/interface/reference-data.interface';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea, TextareaModule } from 'primeng/textarea';

interface StateType {
    codCliente: string;
    correctionAvant: any | null; // Data from SAF SQL Server
    correctionApres: any | null; // Data from PostgreSQL
    loadingAvant: boolean;
    loadingApres: boolean;
    errorAvant: string | null;
    errorApres: string | null;
    activeTab: number;
    comparisons: ComparisonItem[];
    showRejectionDialog: boolean;
    rejectionMotif: string;
    submittingRejection: boolean;
}

interface ComparisonItem {
    field: string;
    label: string;
    avant: any;
    apres: any;
    isDifferent: boolean;
}

export interface Message {
    severity?: string;
    summary?: string;
    detail?: string;
}

@Component({
    selector: 'app-update-correction-personne-physique',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CardModule,
        ButtonModule,
        ProgressSpinnerModule,
        ToastModule,
        DividerModule,
        TabViewModule,
        TableModule,
        TagModule,
        PanelModule,
        MessagesModule,
        ChipModule,
        TooltipModule,
        ConfirmDialogModule,
        DialogModule,
        InputTextModule,
        TextareaModule
    ],
    templateUrl: './update-correction-personne-physique.component.html',
    styleUrl: './update-correction-personne-physique.component.scss',
    providers: [MessageService, ConfirmationService]
})
export class UpdateCorrectionPersonnePhysiqueComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private destroyRef = inject(DestroyRef);

    state = signal<StateType>({
        codCliente: '',
        correctionAvant: null,
        correctionApres: null,
        loadingAvant: false,
        loadingApres: false,
        errorAvant: null,
        errorApres: null,
        activeTab: 0,
        comparisons: [],
        showRejectionDialog: false,
        rejectionMotif: '',
        submittingRejection: false
    });

    // Computed properties
    isLoading = computed(() => this.state().loadingAvant || this.state().loadingApres);
    hasData = computed(() => this.state().correctionAvant || this.state().correctionApres);
    hasBothData = computed(() => this.state().correctionAvant && this.state().correctionApres);
    differenceCount = computed(() => this.state().comparisons.filter((c) => c.isDifferent).length);

    // New computed properties for rejection status
    isRejected = computed(() => this.state().correctionApres?.correctionStatut === 'REJETE');
    isValidated = computed(() => this.state().correctionApres?.correctionStatut === 'VALIDE');
    canPerformActions = computed(() => {
        const status = this.state().correctionApres?.correctionStatut;
        return status !== 'REJETE' && status !== 'VALIDE';
    });

    messages: Message[] = [];

    ngOnInit(): void {
        // Get codCliente from route params
        this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const codCliente = params['codCliente'];
            if (codCliente) {
                this.state.update((s) => ({ ...s, codCliente }));
                this.loadData(codCliente);
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Code client non fourni'
                });
                this.router.navigate(['/dashboards/correction-en-attente']);
            }
        });
    }

    // You can also add a method to get the status label
    getCorrectionStatusLabel(): string {
        const status = this.state().correctionApres?.correctionStatut;
        switch (status) {
            case 'REJETE':
                return 'Rejetée';
            case 'VALIDE':
                return 'Validée';
            case 'EN_COURS':
                return 'En cours';
            case 'EN_ATTENTE':
                return 'En attente';
            default:
                return status || 'Non défini';
        }
    }

    // And a method to get the status severity for p-tag
    getCorrectionStatusSeverity(): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
        const statut = this.state().correctionApres?.correctionStatut;
        if (statut === 'VALIDATED') {
            return 'success';
        }
        if (statut === 'REJECTED') {
            return 'danger';
        }
        if (statut === 'PENDING') {
            return 'warn';
        }
        return 'info';
    }

    /**
     * Load data from both sources
     */
    loadData(codCliente: string): void {
        // Load Correction AVANT (SAF SQL Server)
        this.loadCorrectionAvant(codCliente);

        // Load Correction APRES (PostgreSQL)
        this.loadCorrectionApres(codCliente);
    }

    /**
     * Load data from SAF SQL Server (Correction AVANT)
     */
    loadCorrectionAvant(codCliente: string): void {
        this.state.update((s) => ({ ...s, loadingAvant: true, errorAvant: null }));

        this.userService
            .getFicheSignaletique$(codCliente)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    // The SAF data is nested in response.data.data
                    if (response.data && response.data.data) {
                        const safData = response.data.data;

                        // Process the SAF data to match the expected format
                        const processedData = {
                            codCliente: safData.codCliente,
                            nomCliente: safData.nomCliente,
                            nomClient: safData.primerApellido,
                            prenomClient: safData.primerNombre,
                            numId: safData.numId,
                            typePiece: safData.codTipoId,
                            telPrincipal: safData.telPrincipal,
                            telOtro: safData.telOtro,
                            fecVencim: safData.fecVencim,
                            fechNacimiento: safData.fechNacimiento,
                            lieuxNaiss: safData.lugarNacimiento,
                            nationalite: safData.nacionalidad,
                            pays: safData.codPais,
                            indSexo: safData.indSexo,
                            estCivil: safData.estCivil,
                            conjoint: safData.nomConyugue || safData.codCteConyugue,
                            nbrEnfant: safData.numHijos,
                            detDireccion: safData.detDireccion,
                            codProvincia: safData.codProvincia,
                            district: safData.codDistrito,
                            codeAgence: safData.codAgencia,
                            nomBeneficiario: safData.nomBeneficiario,
                            relacBeneficiario: safData.relacBeneficiario,
                            codActividad: safData.codActividad,
                            codProfesion: safData.codProfesion,
                            codSector: safData.codSector,
                            typeEntre: safData.tenenciaPuesto,
                            typeHabit: safData.tenenciaVivienda,
                            nbrAnnee: safData.antiguedadResidencia,
                            nbrAnnee2: safData.antiguedadPuesto,
                            statutClt: safData.indEstado,
                            provServDestino: safData.provServDestino,
                            metadata: response.data
                        };

                        this.state.update((s) => ({
                            ...s,
                            correctionAvant: processedData,
                            loadingAvant: false
                        }));
                        this.compareData();

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: 'Données SAF chargées (Correction AVANT)'
                        });
                    } else {
                        this.state.update((s) => ({
                            ...s,
                            errorAvant: 'Aucune donnée trouvée',
                            loadingAvant: false
                        }));
                    }
                },
                error: (error) => {
                    this.state.update((s) => ({
                        ...s,
                        errorAvant: error.message || 'Erreur lors du chargement',
                        loadingAvant: false
                    }));

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger les données SAF'
                    });
                }
            });
    }

    /**
     * Load data from PostgreSQL (Correction APRES)
     */
    loadCorrectionApres(codCliente: string): void {
        this.state.update((s) => ({ ...s, loadingApres: true, errorApres: null }));

        this.userService
            .getPersonnePhysique$(codCliente)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    if (response.data?.personnePhysique) {
                        const personnePhysique = response.data.personnePhysique;
                        // Process date arrays to strings
                        if (personnePhysique) {
                            this.processDateFields(personnePhysique);
                        }

                        this.state.update((s) => ({
                            ...s,
                            correctionApres: personnePhysique,
                            loadingApres: false
                        }));
                        this.compareData();

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: 'Données PostgreSQL chargées (Correction APRES)'
                        });
                    } else {
                        this.state.update((s) => ({
                            ...s,
                            errorApres: 'Aucune donnée trouvée dans PostgreSQL',
                            loadingApres: false
                        }));

                        // Show info message
                        this.messages = [{ severity: 'info', summary: 'Information', detail: "Cette personne n'a pas encore été corrigée" }];
                    }
                },
                error: (error) => {
                    this.state.update((s) => ({
                        ...s,
                        errorApres: error.message || 'Erreur lors du chargement',
                        loadingApres: false
                    }));

                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Attention',
                        detail: 'Données non disponibles dans PostgreSQL'
                    });
                }
            });
    }
    /**
     * Process date fields from arrays to strings
     */
    processDateFields(data: any): void {
        if (data.fecVencim && Array.isArray(data.fecVencim)) {
            data.fecVencim = this.arrayToDateString(data.fecVencim);
        }
        if (data.fechNacimiento && Array.isArray(data.fechNacimiento)) {
            data.fechNacimiento = this.arrayToDateString(data.fechNacimiento);
        }
        if (data.createdAt && Array.isArray(data.createdAt)) {
            data.createdAt = this.arrayToDateTimeString(data.createdAt);
        }
        if (data.updatedAt && Array.isArray(data.updatedAt)) {
            data.updatedAt = this.arrayToDateTimeString(data.updatedAt);
        }
    }

    arrayToDateString(dateArray: number[]): string {
        if (!dateArray || dateArray.length < 3) return '';
        const [year, month, day] = dateArray;
        return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
    }

    arrayToDateTimeString(dateArray: number[]): string {
        if (!dateArray || dateArray.length < 6) return '';
        const [year, month, day, hour, minute] = dateArray;
        return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }

    /**
     * Compare data between AVANT and APRES
     */
    compareData(): void {
        if (!this.hasBothData()) return;

        const avant = this.state().correctionAvant;
        const apres = this.state().correctionApres;

        const fieldsToCompare = [
            { field: 'codCliente', label: 'Code Client' },
            { field: 'nomCliente', label: 'Nom Complet' },
            { field: 'nomClient', label: 'Nom' },
            { field: 'prenomClient', label: 'Prénom' },
            { field: 'numId', label: 'Numéro ID' },
            { field: 'typePiece', label: 'Type de Pièce' },
            { field: 'telPrincipal', label: 'Téléphone Principal' },
            { field: 'telOtro', label: 'Autre Téléphone' },
            { field: 'fecVencim', label: "Date d'Expiration" },
            { field: 'fechNacimiento', label: 'Date de Naissance' },
            { field: 'lieuxNaiss', label: 'Lieu de Naissance' },
            { field: 'nationalite', label: 'Nationalité' },
            { field: 'pays', label: 'Pays' },
            { field: 'indSexo', label: 'Sexe' },
            { field: 'estCivil', label: 'État Civil' },
            { field: 'conjoint', label: 'Conjoint' },
            { field: 'nbrEnfant', label: "Nombre d'Enfants" },
            { field: 'detDireccion', label: 'Adresse' },
            { field: 'codProvincia', label: 'Province' },
            { field: 'district', label: 'District' },
            { field: 'codeAgence', label: 'Code Agence' },
            { field: 'codActividad', label: 'Code Activité' },
            { field: 'codProfesion', label: 'Code Profession' },
            { field: 'codSector', label: 'Code Secteur' },
            { field: 'nomBeneficiario', label: 'Bénéficiaire' },
            { field: 'relacBeneficiario', label: 'Relation Bénéficiaire' },
            { field: 'typeEntre', label: 'Type Entreprise' },
            { field: 'typeHabit', label: 'Type Habitation' },
            { field: 'nbrAnnee', label: 'Ancienneté Résidence' },
            { field: 'nbrAnnee2', label: 'Ancienneté Poste' },
            { field: 'statutClt', label: 'Statut Client' },
            { field: 'provServDestino', label: 'Service Destination' }
        ];

        const comparisons: ComparisonItem[] = fieldsToCompare.map((item) => {
            const avantValue = this.getNestedValue(avant, item.field);
            const apresValue = this.getNestedValue(apres, item.field);

            return {
                field: item.field,
                label: item.label,
                avant: avantValue,
                apres: apresValue,
                isDifferent: this.areValuesDifferent(avantValue, apresValue)
            };
        });

        this.state.update((s) => ({ ...s, comparisons }));
    }

    /**
     * Get nested value from object
     */
    getNestedValue(obj: any, path: string): any {
        if (!obj) return null;

        const keys = path.split('.');
        let value = obj;

        for (const key of keys) {
            value = value?.[key];
            if (value === undefined) return null;
        }

        return value;
    }

    /**
     * Check if two values are different
     */
    areValuesDifferent(val1: any, val2: any): boolean {
        // Handle null/undefined
        if (val1 == null && val2 == null) return false;
        if (val1 == null || val2 == null) return true;

        // Convert to strings for comparison
        const str1 = String(val1).trim();
        const str2 = String(val2).trim();

        return str1 !== str2;
    }

    /**
     * Navigate back to list
     */
    goBack(): void {
        this.router.navigate(['/dashboards/correction-en-attente']);
    }

    /**
     * Reload all data
     */
    refresh(): void {
        const codCliente = this.state().codCliente;
        if (codCliente) {
            this.loadData(codCliente);
        }
    }

    /**
     * Get label for a reference code
     */
    getReferenceLabel(code: string, type: 'sector' | 'activity' | 'profession' | 'idType' | 'province' | 'district', provinceCode?: string): string {
        if (!code) return '-';

        let item: any;

        switch (type) {
            case 'sector':
                item = ReferenceData.SECTORS.find((s) => s.code === code);
                return item ? item.label : code;

            case 'activity':
                item = ReferenceData.ACTIVITIES.find((a) => a.code === code);
                return item ? item.label : code;

            case 'profession':
                item = ReferenceData.PROFESSIONS.find((p) => p.code === code);
                return item ? item.label : code;

            case 'idType':
                item = ReferenceData.ID_TYPES.find((i) => i.code === code);
                return item ? item.label : code;

            case 'province':
                item = ReferenceData.PROVINCES.find((p) => p.code === code);
                return item ? item.label : code;

            case 'district':
                if (provinceCode) {
                    const districts = ReferenceData.getDistrictsByProvince(provinceCode);
                    item = districts.find((d) => d.code === code);
                    return item ? item.label : code;
                }
                return code;

            default:
                return code;
        }
    }

    /**
     * Get formatted value for display
     */
    getDisplayValue(value: any): string {
        if (value == null || value === '') return '-';
        if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
        return String(value);
    }

    /**
     * Get formatted display value with label lookup for specific fields
     */
    getFormattedDisplayValue(value: any, field: string, dataSource: 'avant' | 'apres'): string {
        if (value == null || value === '') return '-';

        // Determine if we need to look up a label
        switch (field) {
            case 'typePiece':
                return this.getReferenceLabel(value, 'idType');

            case 'codProvincia':
                return this.getReferenceLabel(value, 'province');

            case 'district':
                // Get province code from the data source
                const provinceCode = dataSource === 'avant' ? this.state().correctionAvant?.codProvincia : this.state().correctionApres?.codProvincia;
                return this.getReferenceLabel(value, 'district', provinceCode);

            case 'codActividad':
                return this.getReferenceLabel(value, 'activity');

            case 'codProfesion':
                return this.getReferenceLabel(value, 'profession');

            case 'codSector':
                return this.getReferenceLabel(value, 'sector');

            case 'indSexo':
                return value === 'M' ? 'Masculin' : value === 'F' ? 'Féminin' : value;

            case 'estCivil':
                return this.getEtatCivilLabel(value);

            case 'statutClt':
                return this.getStatutLabel(value);

            case 'typeEntre':
            case 'typeHabit':
                return this.getTypeHabitationLabel(value);

            default:
                return this.getDisplayValue(value);
        }
    }

    /**
     * Get état civil label
     */
    getEtatCivilLabel(code: string): string {
        const labels: { [key: string]: string } = {
            S: 'Célibataire',
            M: 'Marié(e)',
            D: 'Divorcé(e)',
            V: 'Veuf/Veuve',
            C: 'Concubinage',
            O: 'Autre'
        };
        return labels[code] || code;
    }

    /**
     * Get statut label
     */
    getStatutLabel(code: string): string {
        const labels: { [key: string]: string } = {
            A: 'Actif',
            S: 'Suspendu',
            V: 'Validé',
            R: 'Rejeté',
            I: 'Inactif'
        };
        return labels[code] || code;
    }

    /**
     * Get type habitation label
     */
    getTypeHabitationLabel(code: string): string {
        const labels: { [key: string]: string } = {
            PO: 'Propriétaire',
            AL: 'Locataire',
            PR: 'Propriétaire',
            LO: 'Locataire',
            HG: 'Hébergé',
            AU: 'Autre'
        };
        return labels[code] || code;
    }

    /**
     * Get severity for difference tag
     */
    getDifferenceSeverity(isDifferent: boolean): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
        return isDifferent ? 'warn' : 'success';
    }

    /**
     * Open rejection dialog
     */
    rejetCorrection(): void {
        // Reset the motif and show dialog
        this.state.update((s) => ({
            ...s,
            rejectionMotif: '',
            showRejectionDialog: true
        }));
    }

    /**
     * Close rejection dialog
     */
    closeRejectionDialog(): void {
        this.state.update((s) => ({
            ...s,
            showRejectionDialog: false,
            rejectionMotif: ''
        }));
    }

    /**
     * Submit rejection with motif
     */
    /**
     * Submit rejection with motif
     */
    submitRejection(): void {
        const motif = this.state().rejectionMotif.trim();

        // Validation
        if (!motif) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation',
                detail: 'Le motif de rejet est obligatoire'
            });
            return;
        }

        if (motif.length < 10) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation',
                detail: 'Le motif doit contenir au moins 10 caractères'
            });
            return;
        }

        // Get user ID from correctionApres (PersonnePhysique data)
        const userId = this.state().correctionApres?.idUser;

        if (!userId) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'ID utilisateur non trouvé dans les données de correction'
            });
            return;
        }

        // Prepare rejection data
        const rejectionData = {
            userId: userId,
            libele: motif,
            codCliente: this.state().codCliente,
            codAgence: this.state().correctionApres?.codeAgence || this.state().correctionAvant?.codeAgence,
            statut: 'REJETE',
            personnePhysiqueId: this.state().correctionApres?.id || null
        };

        console.log('Rejection data prepared:', rejectionData);

        // Show loading
        this.state.update((s) => ({ ...s, submittingRejection: true }));

        // Call rejection API
        this.userService
            .rejetCorrection$(rejectionData)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.state.update((s) => ({
                        ...s,
                        submittingRejection: false,
                        showRejectionDialog: false,
                        rejectionMotif: ''
                    }));

                    if (response.code === 200) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: 'La correction a été rejetée avec succès'
                        });

                        // Update the local state to show rejection
                        if (this.state().correctionApres) {
                            this.state.update((s) => ({
                                ...s,
                                correctionApres: {
                                    ...s.correctionApres,
                                    correctionStatut: 'REJETE'
                                }
                            }));
                        }

                        // Navigate back after a delay
                        setTimeout(() => {
                            this.router.navigate(['/dashboards/correction-en-attente']);
                        }, 2000);
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: response.message || 'Erreur lors du rejet'
                        });
                    }
                },
                error: (error) => {
                    this.state.update((s) => ({
                        ...s,
                        submittingRejection: false
                    }));

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Erreur lors du rejet: ' + (error.message || error)
                    });

                    console.error('Erreur de rejet:', error);
                }
            });
    }

    /**
     * Validate correction - Updates SAF SQL Server from PostgreSQL data
     */
    validateCorrection(): void {
        // Check if we have data from PostgreSQL (correction APRES)
        if (!this.state().correctionApres) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Aucune correction disponible à valider'
            });
            return;
        }

        // Prepare the differences summary for confirmation
        const differences = this.state().comparisons.filter((c) => c.isDifferent);
        const differencesList = differences.map((d) => `• ${d.label}: "${this.getFormattedDisplayValue(d.avant, d.field, 'avant')}" → "${this.getFormattedDisplayValue(d.apres, d.field, 'apres')}"`).join('<br>');

        // Show confirmation dialog
        this.confirmationService.confirm({
            message: `Êtes-vous sûr de vouloir valider cette correction et mettre à jour la base SAF?<br><br>
                     <strong>Code Client:</strong> ${this.state().codCliente}<br><br>
                     <strong>${differences.length} modification(s) seront appliquées:</strong><br>
                     ${differencesList}`,
            header: 'Confirmation de validation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui, valider',
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: 'p-button-success',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => {
                this.performValidation();
            },
            reject: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Annulé',
                    detail: 'Validation annulée'
                });
            }
        });
    }

    /**
     * Perform the actual validation after confirmation
     */
    private performValidation(): void {
        // Prepare data from PostgreSQL (correction APRES)
        const updateData = this.prepareUpdateData();

        if (!updateData) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible de préparer les données pour la mise à jour'
            });
            return;
        }

        // Show loading state
        this.state.update((s) => ({ ...s, loadingAvant: true }));

        // Call the update API
        this.userService
            .updateFicheSignaletique$(updateData)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.state.update((s) => ({ ...s, loadingAvant: false }));

                    if (response.code === 200 || (response.data && response.code === 0)) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: 'La fiche signalétique a été mise à jour avec succès dans SAF'
                        });

                        // Update the correction status in PostgreSQL if needed
                        this.updateCorrectionStatus();

                        // Reload the data to show updated information
                        setTimeout(() => {
                            this.loadData(this.state().codCliente);
                        }, 1500);
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: response.message || 'Échec de la mise à jour'
                        });
                    }
                },
                error: (error) => {
                    this.state.update((s) => ({ ...s, loadingAvant: false }));

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Erreur lors de la mise à jour: ' + (error.message || error)
                    });

                    console.error('Erreur de validation:', error);
                }
            });
    }

    /**
     * Prepare update data from PostgreSQL data
     */
    private prepareUpdateData(): any {
        const apresData = this.state().correctionApres;

        if (!apresData) return null;

        // Convert date formats if needed
        const formatDate = (dateStr: string): string => {
            if (!dateStr) return '';
            // If date is in DD/MM/YYYY format, convert to YYYY-MM-DD
            const parts = dateStr.split('/');
            if (parts.length === 3) {
                return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            }
            return dateStr;
        };

        return {
            telPrincipal: apresData.telPrincipal || '',
            codCliente: apresData.codCliente || this.state().codCliente,
            telOtro: apresData.telOtro || '',
            nomCliente: apresData.nomCliente || '',
            nomClient: apresData.nomClient || '',
            prenomClient: apresData.prenomClient || '',
            fecVencim: formatDate(apresData.fecVencim),
            fechNacimiento: formatDate(apresData.fechNacimiento),
            lieuxNaiss: apresData.lieuxNaiss || '',
            nationalite: apresData.nationalite || '',
            numId: apresData.numId || '',
            nomBeneficiario: apresData.nomBeneficiario || '',
            relacBeneficiario: apresData.relacBeneficiario || '',
            detDireccion: apresData.detDireccion || '',
            codProvincia: apresData.codProvincia || '',
            codActividad: apresData.codActividad || '',
            codProfesion: apresData.codProfesion || '',
            codSector: apresData.codSector || '',
            indSexo: apresData.indSexo || '',
            estCivil: apresData.estCivil || '',
            typeHabit: apresData.typeHabit || '',
            nbrAnnee: parseInt(apresData.nbrAnnee) || 0,
            typeEntre: apresData.typeEntre || '',
            nbrAnnee2: parseInt(apresData.nbrAnnee2) || 0,
            nbrEnfant: parseInt(apresData.nbrEnfant) || 0,
            district: apresData.district || '',
            agence: apresData.agence || '',
            pays: apresData.pays || 'GN',
            typePiece: apresData.typePiece || '',
            idUser: apresData.idUser || null,
            statutClt: apresData.statutClt || 'A',
            idManagerAgent: apresData.idManagerAgent || null,
            dateAttente: apresData.dateAttente ? formatDate(apresData.dateAttente) : null,
            nature: apresData.nature || 'PP',
            codeAgence: apresData.codeAgence || '',
            provServDestino: apresData.provServDestino || '',
            conjoint: apresData.conjoint || ''
        };
    }

    /**
     * Update correction status in PostgreSQL (optional)
     */
    private updateCorrectionStatus(): void {
        console.log('Mise à jour du statut de correction dans PostgreSQL');
    }

    getIdentiquesCount(): number {
        return this.state().comparisons.filter((c) => !c.isDifferent).length;
    }
}
