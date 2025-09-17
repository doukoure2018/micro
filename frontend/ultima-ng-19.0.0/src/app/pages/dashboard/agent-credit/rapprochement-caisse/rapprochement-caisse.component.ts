import { Component, inject, signal, computed, OnDestroy } from '@angular/core';
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
        CalendarModule // Ajout du CalendarModule pour les filtres de date
    ],
    providers: [MessageService, ExcelExportService],
    templateUrl: './rapprochement-caisse.component.html',
    styleUrl: './rapprochement-caisse.component.scss'
})
export class RapprochementCaisseComponent implements OnDestroy {
    private userService = inject(UserService);
    private fb = inject(FormBuilder);
    private messageService = inject(MessageService);
    private excelExportService = inject(ExcelExportService);

    private destroy$ = new Subject<void>();
    private currentSubscription?: Subscription;

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
        dateDebut: [new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), Validators.required],
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
     * Export PDF (placeholder)
     */
    exportPDF(): void {
        this.messageService.add({
            severity: 'info',
            summary: 'Export PDF',
            detail: 'Fonctionnalité en cours de développement',
            life: 3000
        });
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
}
