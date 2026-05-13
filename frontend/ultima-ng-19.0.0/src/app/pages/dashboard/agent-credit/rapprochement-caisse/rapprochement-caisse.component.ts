import { Component, inject, signal, computed, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { MessageService, FilterMatchMode } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

import { UserService } from '@/service/user.service';
import { ReconciliationResultDTO } from '@/interface/ReconciliationResultDTO';
import { ExcelExportService } from '@/service/TransactionManquante';
import { IUser } from '@/interface/user';
import { PdfExportService } from '@/service/PdfExportService';
import { FormatReportPipe } from '@/pipes/FormatReportPipe';
import { RapprochementCutoffService } from '@/service/rapprochement-cutoff.service';

@Component({
    selector: 'app-rapprochement-caisse',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        CardModule,
        ToastModule,
        ProgressSpinnerModule,
        TagModule,
        TableModule,
        DividerModule,
        ChipModule,
        ProgressBarModule,
        TooltipModule,
        BadgeModule,
        DatePickerModule,
        TabViewModule,
        DialogModule,
        CheckboxModule,
        MultiSelectModule,
        DropdownModule,
        IconFieldModule,
        InputIconModule,
        CalendarModule,
        FormatReportPipe
    ],
    providers: [MessageService, ExcelExportService],
    templateUrl: './rapprochement-caisse.component.html',
    styleUrl: './rapprochement-caisse.component.scss'
})
export class RapprochementCaisseComponent implements OnDestroy {
    @Input() user?: IUser;
    private userService = inject(UserService);
    private fb = inject(FormBuilder);
    private messageService = inject(MessageService);
    private excelExportService = inject(ExcelExportService);
    cutoffService = inject(RapprochementCutoffService);

    private destroy$ = new Subject<void>();
    private currentSubscription?: Subscription;
    private pdfExportService = inject(PdfExportService);

    canSubmit(): boolean { return this.cutoffService.isSubmissionAllowed(); }
    isInWarningZone(): boolean { return this.cutoffService.isInWarningZone(); }

    // Dialog pour les options d'export
    showExportDialog = false;
    exportOptions = {
        includeResume: true,
        includeStatistics: true
    };

    // Filtres globaux pour chaque tableau
    globalFilters = {
        depositsMiddleware: '',
        withdrawalsMiddleware: '',
        depositsProduction: '',
        withdrawalsProduction: '',
        operationsReserve: '',
        transactionsManquantes: ''
    };

    // Configuration des filtres pour les tables PrimeNG
    filterMatchModes = FilterMatchMode;

    // Options de type d'opération pour le filtre
    typeOperationOptions = [
        { label: 'Dépôt', value: 'Depot' },
        { label: 'Retrait', value: 'Retrait' }
    ];

    // Options d'état pour le filtre
    etatOptions = [
        { label: 'Succès', value: 'SUCCESS' },
        { label: 'En attente', value: 'PENDING' },
        { label: 'Échoué', value: 'FAILED' }
    ];

    // Initialiser le formulaire directement
    reconciliationForm: FormGroup = this.fb.group({
        dateDebut: [new Date(), Validators.required],
        dateFin: [new Date(), Validators.required]
    });

    activeTabIndex = 0;

    // État principal
    state = signal<{
        loading: boolean;
        message: string | undefined;
        error: string | undefined;
        reconciliationResult: ReconciliationResultDTO | null;
        activeTabIndex: number;
        searchValue: string;
    }>({
        loading: false,
        message: undefined,
        error: undefined,
        reconciliationResult: null,
        activeTabIndex: 0,
        searchValue: ''
    });

    // Computed values
    hasEcart = computed(() => {
        const result = this.state().reconciliationResult;
        return result && result.montantEcart !== 0;
    });

    montantEcartFormatted = computed(() => {
        const result = this.state().reconciliationResult;
        if (!result) return '0';
        return this.formatMontant(result.montantEcart);
    });

    pourcentageEcart = computed(() => {
        const result = this.state().reconciliationResult;
        if (!result || result.montantTotalMiddleware === 0) return 0;
        return Math.abs((result.montantEcart / result.montantTotalMiddleware) * 100);
    });

    progressValue = computed(() => {
        const result = this.state().reconciliationResult;
        if (!result) return 0;
        if (result.totalMiddleware === 0) return 100;
        return Math.round((result.transactionsCorrespondantes / result.totalMiddleware) * 100);
    });

    // Computed pour vérifier s'il y a des transactions manquantes
    hasTransactionsManquantes = computed(() => {
        const result = this.state().reconciliationResult;
        return result && result.transactionsManquantes && result.transactionsManquantes.length > 0;
    });

    /**
     * Calcule le montant total des transactions manquantes
     */
    getTotalMontantManquant(): number {
        const result = this.state().reconciliationResult;
        if (!result || !result.transactionsManquantes) {
            return 0;
        }
        return result.transactionsManquantes.reduce((total, trans) => total + (trans.montant || 0), 0);
    }

    constructor() {
        // Le formulaire est déjà initialisé en tant que propriété
    }

    performReconciliation(): void {
        // Annuler toute requête en cours
        if (this.currentSubscription) {
            this.currentSubscription.unsubscribe();
            this.currentSubscription = undefined;
        }

        if (this.reconciliationForm.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez remplir tous les champs requis',
                life: 3000
            });
            return;
        }

        const formValue = this.reconciliationForm.value;
        const dateDebut = this.formatDateForAPI(formValue.dateDebut);
        const dateFin = this.formatDateForAPI(formValue.dateFin);

        if (new Date(dateDebut) > new Date(dateFin)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'La date de début doit être antérieure à la date de fin',
                life: 3000
            });
            return;
        }

        // Désactiver le formulaire pendant le chargement
        this.reconciliationForm.disable();

        // Réinitialiser complètement l'état et les filtres
        this.state.set({
            loading: true,
            error: undefined,
            message: undefined,
            reconciliationResult: null,
            activeTabIndex: 0,
            searchValue: ''
        });

        // Réinitialiser les filtres globaux
        this.resetAllFilters();

        this.currentSubscription = this.userService
            .checkReconciliation$(dateDebut, dateFin)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    this.reconciliationForm.enable();
                    this.state.set({
                        loading: false,
                        message: response.message,
                        reconciliationResult: response.data.reconciliationResultDTO || null,
                        error: undefined,
                        activeTabIndex: 0,
                        searchValue: ''
                    });

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: response.message,
                        life: 3000
                    });

                    // Si des transactions manquantes sont trouvées, afficher une notification
                    if (this.hasTransactionsManquantes()) {
                        const count = response.data.reconciliationResultDTO?.transactionsManquantes?.length || 0;
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Transactions manquantes détectées',
                            detail: `${count} transaction(s) manquante(s) trouvée(s). Vous pouvez les exporter en Excel.`,
                            life: 5000
                        });
                    }
                },
                error: (error) => {
                    this.reconciliationForm.enable();
                    const errorMessage = error.message || 'Erreur lors du rapprochement';

                    this.state.set({
                        loading: false,
                        error: errorMessage,
                        reconciliationResult: null,
                        message: undefined,
                        activeTabIndex: 0,
                        searchValue: ''
                    });

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: errorMessage,
                        life: 5000
                    });
                }
            });
    }

    /**
     * Met à jour le filtre global pour un tableau spécifique
     */
    applyGlobalFilter(table: any, event: Event, filterKey: keyof typeof this.globalFilters): void {
        const value = (event.target as HTMLInputElement).value;
        this.globalFilters[filterKey] = value;
        table.filterGlobal(value, 'contains');
    }

    /**
     * Réinitialise le filtre d'un tableau spécifique
     */
    clearFilter(table: any, filterKey: keyof typeof this.globalFilters): void {
        this.globalFilters[filterKey] = '';
        table.clear();
    }

    /**
     * Réinitialise tous les filtres
     */
    resetAllFilters(): void {
        this.globalFilters = {
            depositsMiddleware: '',
            withdrawalsMiddleware: '',
            depositsProduction: '',
            withdrawalsProduction: '',
            operationsReserve: '',
            transactionsManquantes: ''
        };
        // this.resetAmountFilters(); // Removed because the method does not exist
        //this.resetDateFilters();
    }

    /**
     * Exporte les données filtrées d'un tableau
     */
    exportFilteredData(table: any, type: string): void {
        const filteredData = table.filteredValue || table.value;

        if (!filteredData || filteredData.length === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Aucune donnée à exporter',
                life: 3000
            });
            return;
        }

        // Créer un CSV avec les données filtrées
        const headers = this.getHeadersForType(type);
        const rows = filteredData.map((item: any) => this.getRowDataForType(item, type));

        const BOM = '\uFEFF';
        const csvContent = BOM + [headers, ...rows].map((row) => row.map((cell: any) => `"${cell}"`).join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}_filtered_${new Date().getTime()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        this.messageService.add({
            severity: 'success',
            summary: 'Export réussi',
            detail: `${filteredData.length} enregistrement(s) exporté(s)`,
            life: 3000
        });
    }

    /**
     * Obtient les en-têtes selon le type de tableau
     */
    private getHeadersForType(type: string): string[] {
        switch (type) {
            case 'deposits_middleware':
            case 'withdrawals_middleware':
                return ['N° Trans', 'Date/Heure', 'Compte', 'Client', 'Montant', 'Motifs', 'Opérateur', 'État'];
            case 'deposits_production':
            case 'withdrawals_production':
                return ['N° Séquence', 'Date/Heure', 'Compte', 'Client', 'Montant', 'Opérateur', 'Type', 'État'];
            case 'operations_reserve':
                return ['N° Opération', 'Type', 'Date/Heure', 'Montant', 'Opérateur', 'Validé par', 'Compte Réserve', 'État'];
            case 'transactions_manquantes':
                return ['N° Transaction', 'Date/Heure', 'Type', 'Compte', 'Montant', 'Motifs', 'État'];
            default:
                return [];
        }
    }

    /**
     * Obtient les données de ligne selon le type
     */
    private getRowDataForType(item: any, type: string): any[] {
        switch (type) {
            case 'deposits_middleware':
            case 'withdrawals_middleware':
                return [item.numTransaction, this.formatDateTime(item.dateOperation), item.numCompte || '-', item.codeClient, item.montant, item.motifs || '-', item.faitPar, item.etatSaf];
            case 'deposits_production':
            case 'withdrawals_production':
                return [item.NUM_SECUENCIA_DOC, this.formatDateTime(item.FEC_TRANSACCION), item.NUM_MOV_ENTE || '-', item.COD_CLIENTE, item.MTO_MOVIMIENTO, item.COD_CAJERO, item.TIP_TRANSACCION, item.IND_ESTADO];
            case 'operations_reserve':
                return [item.numero, item.transactionOp === 1 ? 'Retrait' : 'Dépôt', this.formatDateTime(item.dateOperation), item.montant, item.codeUser, item.validerPar || '-', item.compteReserve || '-', item.etatOp];
            case 'transactions_manquantes':
                return [item.numTransaction, this.formatDateTime(item.dateOperation), item.typeOperation, item.numCompte || '-', item.montant, item.motifs || '-', item.etatSaf];
            default:
                return [];
        }
    }

    updateSearch(value: string): void {
        this.state.update((s) => ({ ...s, searchValue: value }));
    }

    private formatDateForAPI(date: any): string {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    formatMontant(montant: number): string {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'GNF',
            minimumFractionDigits: 0
        }).format(montant);
    }

    formatDate(date: number[] | string): string {
        if (typeof date === 'string') return date;
        if (Array.isArray(date) && date.length >= 3) {
            return `${date[2].toString().padStart(2, '0')}/${date[1].toString().padStart(2, '0')}/${date[0]}`;
        }
        return '';
    }

    formatDateTime(date: number[] | string): string {
        if (typeof date === 'string') return date;
        if (Array.isArray(date) && date.length >= 5) {
            return `${date[2].toString().padStart(2, '0')}/${date[1].toString().padStart(2, '0')}/${date[0]} ${date[3].toString().padStart(2, '0')}:${date[4].toString().padStart(2, '0')}`;
        }
        return '';
    }

    getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
        switch (status) {
            case 'OK':
            case 'SUCCESS':
            case 'SYNCHRONISE':
                return 'success';
            case 'WARNING':
            case 'ECART':
                return 'warn';
            case 'ERROR':
            case 'FAILED':
                return 'danger';
            case 'INFO':
                return 'info';
            default:
                return 'secondary';
        }
    }

    getOperationIcon(type: string): string {
        return type === 'Depot' ? 'pi-arrow-down' : 'pi-arrow-up';
    }

    getOperationSeverity(type: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
        switch (type) {
            case 'CREDIT':
            case 'Depot':
                return 'success';
            case 'DEBIT':
            case 'Retrait':
                return 'danger';
            default:
                return 'secondary';
        }
    }

    /**
     * Export CSV basique pour toutes les transactions
     */
    exportTransactions(): void {
        const result = this.state().reconciliationResult;
        if (!result || result.transactionsManquantes.length === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Aucune transaction à exporter',
                life: 3000
            });
            return;
        }

        const BOM = '\uFEFF';
        const headers = ['Num Transaction', 'Date Opération', 'Montant', 'Type', 'Client', 'Motifs', 'État'];
        const rows = result.transactionsManquantes.map((t) => [t.numTransaction, this.formatDateTime(t.dateOperation), t.montant, t.typeOperation, t.codeClient, t.motifs, t.etatSaf]);

        const csvContent = BOM + [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rapprochement_${this.formatDateForAPI(this.reconciliationForm.value.dateDebut)}_${this.formatDateForAPI(this.reconciliationForm.value.dateFin)}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        this.messageService.add({
            severity: 'success',
            summary: 'Export réussi',
            detail: 'Le fichier CSV a été téléchargé',
            life: 3000
        });
    }

    /**
     * Export Excel des transactions manquantes uniquement
     */
    exportExcel(): void {
        const result = this.state().reconciliationResult;

        if (!result || !result.transactionsManquantes || result.transactionsManquantes.length === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Aucune transaction manquante à exporter',
                life: 3000
            });
            return;
        }

        try {
            const dateDebut = this.formatDateForAPI(this.reconciliationForm.value.dateDebut);
            const dateFin = this.formatDateForAPI(this.reconciliationForm.value.dateFin);

            // Export direct sans dialog
            this.excelExportService.exportTransactionsManquantesToExcel(result.transactionsManquantes, dateDebut, dateFin);

            this.messageService.add({
                severity: 'success',
                summary: 'Export Excel réussi',
                detail: `${result.transactionsManquantes.length} transaction(s) manquante(s) exportée(s)`,
                life: 3000
            });
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: "Erreur lors de l'export Excel",
                life: 3000
            });
        }
    }

    /**
     * Ouvre le dialog pour export Excel avec options
     */
    openExportDialog(): void {
        const result = this.state().reconciliationResult;

        if (!result || !result.transactionsManquantes || result.transactionsManquantes.length === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Aucune transaction manquante à exporter',
                life: 3000
            });
            return;
        }

        this.showExportDialog = true;
        // Réinitialiser les options
        this.exportOptions = {
            includeResume: true,
            includeStatistics: true
        };
    }

    /**
     * Confirme l'export Excel avec les options sélectionnées
     */
    confirmExportExcel(): void {
        const result = this.state().reconciliationResult;

        if (!result || !result.transactionsManquantes) {
            return;
        }

        try {
            const dateDebut = this.formatDateForAPI(this.reconciliationForm.value.dateDebut);
            const dateFin = this.formatDateForAPI(this.reconciliationForm.value.dateFin);

            this.excelExportService.exportWithOptions(result.transactionsManquantes, {
                includeResume: this.exportOptions.includeResume,
                includeStatistics: this.exportOptions.includeStatistics,
                dateDebut: dateDebut,
                dateFin: dateFin
            });

            this.showExportDialog = false;

            this.messageService.add({
                severity: 'success',
                summary: 'Export Excel réussi',
                detail: `${result.transactionsManquantes.length} transaction(s) exportée(s) avec ${this.getExportOptionsDescription()}`,
                life: 4000
            });
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: "Erreur lors de l'export Excel",
                life: 3000
            });
        }
    }

    /**
     * Obtient la description des options d'export sélectionnées
     */
    private getExportOptionsDescription(): string {
        const options = [];
        if (this.exportOptions.includeResume) options.push('résumé');
        if (this.exportOptions.includeStatistics) options.push('statistiques');
        return options.length > 0 ? options.join(' et ') : 'données de base';
    }

    /**
     * Export PDF du rapport détaillé uniquement
     */
    exportPDF(): void {
        const result = this.state().reconciliationResult;

        if (!result || !result.details) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Aucun rapport détaillé à exporter',
                life: 3000
            });
            return;
        }

        try {
            // Générer un nom de fichier avec la date
            const dateDebut = this.formatDateForAPI(this.reconciliationForm.value.dateDebut);
            const dateFin = this.formatDateForAPI(this.reconciliationForm.value.dateFin);
            const filename = `rapport_rapprochement_${dateDebut}_${dateFin}.pdf`;

            // Exporter le contenu du rapport détaillé en PDF
            this.pdfExportService.exportReportToPdf(result.details, filename);

            this.messageService.add({
                severity: 'success',
                summary: 'Export PDF',
                detail: "Le rapport détaillé est en cours de génération. Utilisez la fonction d'impression pour sauvegarder en PDF.",
                life: 4000
            });
        } catch (error) {
            console.error("Erreur lors de l'export PDF:", error);
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: "Une erreur est survenue lors de l'export PDF",
                life: 3000
            });
        }
    }

    resetForm(): void {
        if (this.currentSubscription) {
            this.currentSubscription.unsubscribe();
            this.currentSubscription = undefined;
        }

        const today = new Date();
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        this.reconciliationForm.reset({
            dateDebut: lastWeek,
            dateFin: today
        });

        this.state.set({
            loading: false,
            reconciliationResult: null,
            message: undefined,
            error: undefined,
            activeTabIndex: 0,
            searchValue: ''
        });

        this.resetAllFilters();
        this.showExportDialog = false;
    }

    onTabChange(event: any): void {
        this.activeTabIndex = event.index || 0;
        this.state.update((s) => ({ ...s, activeTabIndex: event.index || 0 }));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        if (this.currentSubscription) {
            this.currentSubscription.unsubscribe();
        }
    }

    /**
     * Méthode alternative : Export PDF avec options avancées
     * Utilise jsPDF si disponible
     */
    async exportPDFAdvanced(): Promise<void> {
        const result = this.state().reconciliationResult;

        if (!result || !result.details) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Aucun rapport détaillé à exporter',
                life: 3000
            });
            return;
        }

        try {
            // Afficher un message de chargement
            this.messageService.add({
                severity: 'info',
                summary: 'Export en cours',
                detail: 'Génération du PDF en cours...',
                life: 2000
            });

            const dateDebut = this.formatDateForAPI(this.reconciliationForm.value.dateDebut);
            const dateFin = this.formatDateForAPI(this.reconciliationForm.value.dateFin);
            const filename = `rapport_rapprochement_${dateDebut}_${dateFin}.pdf`;

            // Tenter d'utiliser jsPDF si disponible
            await this.pdfExportService.exportToPdfWithJsPDF(result.details, filename);

            this.messageService.add({
                severity: 'success',
                summary: 'Export PDF réussi',
                detail: 'Le rapport a été exporté avec succès',
                life: 3000
            });
        } catch (error) {
            console.error("Erreur lors de l'export PDF avancé:", error);
            // Fallback vers la méthode standard
            this.exportPDF();
        }
    }

    /**
     * Méthode pour obtenir uniquement le contenu texte du rapport
     * (utile pour d'autres exports)
     */
    private getReportContent(): string | null {
        const result = this.state().reconciliationResult;
        return result?.details || null;
    }

    /**
     * Export PDF avec aperçu avant impression
     */
    exportPDFWithPreview(): void {
        const result = this.state().reconciliationResult;

        if (!result || !result.details) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Aucun rapport détaillé à exporter',
                life: 3000
            });
            return;
        }

        // Créer une fenêtre de prévisualisation
        const previewWindow = window.open('', '_blank', 'width=900,height=700,menubar=yes,toolbar=yes');

        if (!previewWindow) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: "Impossible d'ouvrir la fenêtre de prévisualisation",
                life: 3000
            });
            return;
        }

        const dateDebut = this.formatDateForAPI(this.reconciliationForm.value.dateDebut);
        const dateFin = this.formatDateForAPI(this.reconciliationForm.value.dateFin);

        // Créer le contenu HTML avec styles
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Rapport de Rapprochement - ${dateDebut} au ${dateFin}</title>
            <style>
                @page {
                    size: A4;
                    margin: 20mm;
                }
                
                body {
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #fff;
                }
                
                .controls {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    background: #f5f5f5;
                    padding: 10px;
                    border-bottom: 2px solid #ddd;
                    text-align: center;
                    z-index: 1000;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .controls button {
                    margin: 0 5px;
                    padding: 8px 16px;
                    background: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                }
                
                .controls button:hover {
                    background: #0056b3;
                }
                
                .controls button.secondary {
                    background: #6c757d;
                }
                
                .controls button.secondary:hover {
                    background: #545b62;
                }
                
                .document {
                    margin-top: 60px;
                }
                
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding-bottom: 15px;
                    border-bottom: 3px solid #333;
                }
                
                .header h1 {
                    margin: 0;
                    font-size: 20px;
                    font-weight: bold;
                    color: #222;
                }
                
                .header .subtitle {
                    margin-top: 10px;
                    font-size: 12px;
                    color: #666;
                }
                
                .header .period {
                    margin-top: 5px;
                    font-size: 14px;
                    font-weight: bold;
                    color: #444;
                }
                
                .content {
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    background-color: #f9f9f9;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    margin: 20px 0;
                }
                
                .footer {
                    margin-top: 40px;
                    padding-top: 15px;
                    border-top: 2px solid #ddd;
                    text-align: center;
                    font-size: 11px;
                    color: #666;
                }
                
                @media print {
                    .controls {
                        display: none !important;
                    }
                    
                    .document {
                        margin-top: 0;
                    }
                    
                    body {
                        padding: 0;
                    }
                }
            </style>
        </head>
        <body>
            <div class="controls no-print">
                <button onclick="window.print()">📄 Imprimer / Sauvegarder en PDF</button>
                <button class="secondary" onclick="window.close()">❌ Fermer</button>
            </div>
            
            <div class="document">
                <div class="header">
                    <h1>RAPPORT DE RAPPROCHEMENT DE CAISSE</h1>
                    <div class="period">Période : ${dateDebut} au ${dateFin}</div>
                    <div class="subtitle">Généré le : ${new Date().toLocaleString('fr-FR')}</div>
                </div>
                
                <div class="content">${this.escapeHtml(result.details)}</div>
                
                <div class="footer">
                    <p>© ${new Date().getFullYear()} - Système de Rapprochement de Caisse</p>
                    <p>Document généré automatiquement - Ne pas modifier</p>
                </div>
            </div>
        </body>
        </html>
    `;

        previewWindow.document.write(htmlContent);
        previewWindow.document.close();

        this.messageService.add({
            severity: 'info',
            summary: 'Aperçu ouvert',
            detail: 'Utilisez le bouton "Imprimer" pour sauvegarder en PDF',
            life: 4000
        });
    }

    /**
     * Méthode utilitaire pour échapper le HTML
     */
    private escapeHtml(text: string): string {
        const map: { [key: string]: string } = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }
}
