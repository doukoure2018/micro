import { Component, inject, signal, computed, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
import { SelectModule } from 'primeng/select';

import { UserService } from '@/service/user.service';
import { ReconciliationResultDTO } from '@/interface/ReconciliationResultDTO';
import { ExcelExportService } from '@/service/TransactionManquante';
import { PdfExportService } from '@/service/PdfExportService';
import { FormatReportPipe } from '@/pipes/FormatReportPipe';
import { IUser } from '@/interface/user';

interface PointVenteOption {
    id: number;
    libele: string;
    code: string;
}

@Component({
    selector: 'app-rapprochement-caisse-ra',
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
        SelectModule,
        FormatReportPipe
    ],
    providers: [MessageService, ExcelExportService],
    templateUrl: './rapprochement-caisse-ra.component.html',
    styleUrl: './rapprochement-caisse-ra.component.scss'
})
export class RapprochementCaisseRaComponent implements OnInit, OnDestroy {
    private userService = inject(UserService);
    private fb = inject(FormBuilder);
    private messageService = inject(MessageService);
    private excelExportService = inject(ExcelExportService);
    private pdfExportService = inject(PdfExportService);

    private destroy$ = new Subject<void>();
    private currentSubscription?: Subscription;

    user?: IUser;
    pointVenteOptions: PointVenteOption[] = [];
    loadingPointVentes = false;

    showExportDialog = false;
    exportOptions = {
        includeResume: true,
        includeStatistics: true
    };

    globalFilters = {
        depositsMiddleware: '',
        withdrawalsMiddleware: '',
        depositsProduction: '',
        withdrawalsProduction: '',
        operationsReserve: '',
        transactionsManquantes: ''
    };

    filterMatchModes = FilterMatchMode;

    typeOperationOptions = [
        { label: 'Depot', value: 'Depot' },
        { label: 'Retrait', value: 'Retrait' }
    ];

    etatOptions = [
        { label: 'Succes', value: 'SUCCESS' },
        { label: 'En attente', value: 'PENDING' },
        { label: 'Echoue', value: 'FAILED' }
    ];

    auditForm: FormGroup = this.fb.group({
        pointVente: [null, Validators.required],
        dateDebut: [new Date(), Validators.required],
        dateFin: [new Date(), Validators.required]
    });

    activeTabIndex = 0;

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

    hasTransactionsManquantes = computed(() => {
        const result = this.state().reconciliationResult;
        return result && result.transactionsManquantes && result.transactionsManquantes.length > 0;
    });

    selectedPointVenteLabel = computed(() => {
        const pv = this.auditForm.get('pointVente')?.value;
        if (!pv) return '';
        return pv.libele || '';
    });

    ngOnInit(): void {
        this.loadUserAndPointVentes();
    }

    private loadUserAndPointVentes(): void {
        this.loadingPointVentes = true;
        this.userService
            .getInstanceUser$()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    this.user = response.data?.user;

                    if (!this.user?.agenceId) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: 'Aucune agence associee a votre compte',
                            life: 3000
                        });
                        this.loadingPointVentes = false;
                        return;
                    }

                    this.loadPointVentesByAgence(this.user.agenceId);
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger les informations utilisateur',
                        life: 5000
                    });
                    this.loadingPointVentes = false;
                }
            });
    }

    private loadPointVentesByAgence(agenceId: number): void {
        this.userService
            .getAllPointVenteByAgenceId$(agenceId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    this.pointVenteOptions = (response.data?.pointVentes || []).map((pv: any) => ({
                        id: pv.id,
                        libele: pv.libele,
                        code: pv.code
                    }));
                    this.loadingPointVentes = false;
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger les points de vente',
                        life: 5000
                    });
                    this.loadingPointVentes = false;
                }
            });
    }

    getTotalMontantManquant(): number {
        const result = this.state().reconciliationResult;
        if (!result || !result.transactionsManquantes) return 0;
        return result.transactionsManquantes.reduce((total, trans) => total + (trans.montant || 0), 0);
    }

    performReconciliation(): void {
        if (this.currentSubscription) {
            this.currentSubscription.unsubscribe();
            this.currentSubscription = undefined;
        }

        if (this.auditForm.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez selectionner un point de service et remplir les dates',
                life: 3000
            });
            return;
        }

        const formValue = this.auditForm.value;
        const pointVenteCode = formValue.pointVente.code;
        const dateDebut = this.formatDateForAPI(formValue.dateDebut);
        const dateFin = this.formatDateForAPI(formValue.dateFin);

        if (new Date(dateDebut) > new Date(dateFin)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'La date de debut doit etre anterieure a la date de fin',
                life: 3000
            });
            return;
        }

        this.auditForm.disable();

        this.state.set({
            loading: true,
            error: undefined,
            message: undefined,
            reconciliationResult: null,
            activeTabIndex: 0,
            searchValue: ''
        });

        this.resetAllFilters();

        this.currentSubscription = this.userService
            .checkReconciliationAudit$(pointVenteCode, dateDebut, dateFin)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    this.auditForm.enable();
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
                        summary: 'Succes',
                        detail: response.message,
                        life: 3000
                    });

                    if (this.hasTransactionsManquantes()) {
                        const count = response.data.reconciliationResultDTO?.transactionsManquantes?.length || 0;
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Transactions manquantes detectees',
                            detail: `${count} transaction(s) manquante(s) trouvee(s).`,
                            life: 5000
                        });
                    }
                },
                error: (error) => {
                    this.auditForm.enable();
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

    applyGlobalFilter(table: any, event: Event, filterKey: keyof typeof this.globalFilters): void {
        const value = (event.target as HTMLInputElement).value;
        this.globalFilters[filterKey] = value;
        table.filterGlobal(value, 'contains');
    }

    clearFilter(table: any, filterKey: keyof typeof this.globalFilters): void {
        this.globalFilters[filterKey] = '';
        table.clear();
    }

    resetAllFilters(): void {
        this.globalFilters = {
            depositsMiddleware: '',
            withdrawalsMiddleware: '',
            depositsProduction: '',
            withdrawalsProduction: '',
            operationsReserve: '',
            transactionsManquantes: ''
        };
    }

    exportFilteredData(table: any, type: string): void {
        const filteredData = table.filteredValue || table.value;
        if (!filteredData || filteredData.length === 0) {
            this.messageService.add({ severity: 'warn', summary: 'Attention', detail: 'Aucune donnee a exporter', life: 3000 });
            return;
        }

        const headers = this.getHeadersForType(type);
        const rows = filteredData.map((item: any) => this.getRowDataForType(item, type));
        const BOM = '\uFEFF';
        const csvContent = BOM + [headers, ...rows].map((row) => row.map((cell: any) => `"${cell}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rapprochement_ra_${type}_${new Date().getTime()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        this.messageService.add({ severity: 'success', summary: 'Export reussi', detail: `${filteredData.length} enregistrement(s) exporte(s)`, life: 3000 });
    }

    private getHeadersForType(type: string): string[] {
        switch (type) {
            case 'deposits_middleware':
            case 'withdrawals_middleware':
                return ['N Trans', 'Date/Heure', 'Compte', 'Client', 'Montant', 'Motifs', 'Operateur', 'Etat'];
            case 'deposits_production':
            case 'withdrawals_production':
                return ['N Sequence', 'Date/Heure', 'Compte', 'Client', 'Montant', 'Operateur', 'Type', 'Etat'];
            case 'operations_reserve':
                return ['N Operation', 'Type', 'Date/Heure', 'Montant', 'Operateur', 'Valide par', 'Compte Reserve', 'Etat'];
            case 'transactions_manquantes':
                return ['N Transaction', 'Date/Heure', 'Type', 'Compte', 'Montant', 'Motifs', 'Etat'];
            default:
                return [];
        }
    }

    private getRowDataForType(item: any, type: string): any[] {
        switch (type) {
            case 'deposits_middleware':
            case 'withdrawals_middleware':
                return [item.numTransaction, this.formatDateTime(item.dateOperation), item.numCompte || '-', item.codeClient, item.montant, item.motifs || '-', item.faitPar, item.etatSaf];
            case 'deposits_production':
            case 'withdrawals_production':
                return [item.NUM_SECUENCIA_DOC, this.formatDateTime(item.FEC_TRANSACCION), item.NUM_MOV_ENTE || '-', item.COD_CLIENTE, item.MTO_MOVIMIENTO, item.COD_CAJERO, item.TIP_TRANSACCION, item.IND_ESTADO];
            case 'operations_reserve':
                return [item.numero, item.transactionOp === 1 ? 'Retrait' : 'Depot', this.formatDateTime(item.dateOperation), item.montant, item.codeUser, item.validerPar || '-', item.compteReserve || '-', item.etatOp];
            case 'transactions_manquantes':
                return [item.numTransaction, this.formatDateTime(item.dateOperation), item.typeOperation, item.numCompte || '-', item.montant, item.motifs || '-', item.etatSaf];
            default:
                return [];
        }
    }

    exportExcel(): void {
        const result = this.state().reconciliationResult;
        if (!result || !result.transactionsManquantes || result.transactionsManquantes.length === 0) {
            this.messageService.add({ severity: 'warn', summary: 'Attention', detail: 'Aucune transaction manquante a exporter', life: 3000 });
            return;
        }
        try {
            const dateDebut = this.formatDateForAPI(this.auditForm.value.dateDebut);
            const dateFin = this.formatDateForAPI(this.auditForm.value.dateFin);
            this.excelExportService.exportTransactionsManquantesToExcel(result.transactionsManquantes, dateDebut, dateFin);
            this.messageService.add({ severity: 'success', summary: 'Export Excel reussi', detail: `${result.transactionsManquantes.length} transaction(s) exportee(s)`, life: 3000 });
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Erreur lors de l'export Excel", life: 3000 });
        }
    }

    exportPDF(): void {
        const result = this.state().reconciliationResult;
        if (!result || !result.details) {
            this.messageService.add({ severity: 'warn', summary: 'Attention', detail: 'Aucun rapport detaille a exporter', life: 3000 });
            return;
        }
        try {
            const dateDebut = this.formatDateForAPI(this.auditForm.value.dateDebut);
            const dateFin = this.formatDateForAPI(this.auditForm.value.dateFin);
            const filename = `rapprochement_ra_${dateDebut}_${dateFin}.pdf`;
            this.pdfExportService.exportReportToPdf(result.details, filename);
            this.messageService.add({ severity: 'success', summary: 'Export PDF', detail: 'Le rapport est en cours de generation.', life: 4000 });
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Erreur lors de l'export PDF", life: 3000 });
        }
    }

    resetForm(): void {
        if (this.currentSubscription) {
            this.currentSubscription.unsubscribe();
            this.currentSubscription = undefined;
        }
        this.auditForm.reset({
            pointVente: null,
            dateDebut: new Date(),
            dateFin: new Date()
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
    }

    onTabChange(event: any): void {
        this.activeTabIndex = event.index || 0;
        this.state.update((s) => ({ ...s, activeTabIndex: event.index || 0 }));
    }

    private formatDateForAPI(date: any): string {
        if (!(date instanceof Date)) date = new Date(date);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    formatMontant(montant: number): string {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'GNF', minimumFractionDigits: 0 }).format(montant);
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
            case 'OK': case 'SUCCESS': case 'SYNCHRONISE': return 'success';
            case 'WARNING': case 'ECART': return 'warn';
            case 'ERROR': case 'FAILED': return 'danger';
            case 'INFO': return 'info';
            default: return 'secondary';
        }
    }

    getOperationIcon(type: string): string {
        return type === 'Depot' ? 'pi-arrow-down' : 'pi-arrow-up';
    }

    getOperationSeverity(type: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
        switch (type) {
            case 'CREDIT': case 'Depot': return 'success';
            case 'DEBIT': case 'Retrait': return 'danger';
            default: return 'secondary';
        }
    }

    private escapeHtml(text: string): string {
        const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        if (this.currentSubscription) this.currentSubscription.unsubscribe();
    }
}
