import { IUser } from '@/interface/user';
import { Component, Input, signal, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '@/service/user.service';
import { catchError, of } from 'rxjs';
import { StockResponseDto } from '@/interface/StockResponseDto';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { ChipModule } from 'primeng/chip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PrintBonCommandeService } from '@/service/print-bon-commande.service';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TextareaModule } from 'primeng/textarea';
import { animate, state, style, transition, trigger } from '@angular/animations';

/**
 * Composant Logistique
 * Affiche uniquement les bons de commande acceptés par le DE (state_validation = 'ACCEPTE')
 * Ces bons sont prêts pour le traitement logistique
 */
@Component({
    selector: 'app-logistique',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        CardModule,
        TableModule,
        TagModule,
        ToastModule,
        ProgressSpinnerModule,
        DividerModule,
        PanelModule,
        TabViewModule,
        DialogModule,
        MessageModule,
        MessagesModule,
        TooltipModule,
        BadgeModule,
        ChipModule,
        InputTextModule,
        DropdownModule,
        ConfirmDialogModule,
        TextareaModule
    ],
    templateUrl: './logistique.component.html',
    styleUrl: './logistique.component.scss',
    providers: [MessageService, ConfirmationService],
    animations: [trigger('rowExpand', [state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })), state('expanded', style({ height: '*' })), transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))])]
})
export class LogistiqueComponent implements OnInit {
    @Input() user?: IUser;
    public Object = Object;

    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private printService = inject(PrintBonCommandeService);
    private confirmationService = inject(ConfirmationService);

    // Signals principaux
    stocks = signal<StockResponseDto[]>([]);
    loading = signal(false);
    expandedRows = signal<{ [key: string]: boolean }>({});
    processingAction = signal(false);

    // Dialogue de validation
    showValidationDialog = signal(false);
    validationObservations = signal('');

    // Filtres
    searchTerm = signal('');
    selectedDelegation = signal<string | null>(null);

    // Dialogue de détail
    showDetailDialog = signal(false);
    selectedStock = signal<StockResponseDto | null>(null);

    // Liste des délégations uniques
    delegations = computed(() => {
        const uniqueDelegations = [
            ...new Set(
                this.stocks()
                    .map((s) => s.delegationLibele)
                    .filter(Boolean)
            )
        ];
        return [{ label: 'Toutes les délégations', value: null }, ...uniqueDelegations.map((d) => ({ label: d, value: d }))];
    });

    // Stocks filtrés
    filteredStocks = computed(() => {
        let result = this.stocks();

        // Filtre par délégation
        if (this.selectedDelegation()) {
            result = result.filter((s) => s.delegationLibele === this.selectedDelegation());
        }

        // Filtre par terme de recherche
        const term = this.searchTerm().toLowerCase();
        if (term) {
            result = result.filter(
                (s) =>
                    s.numeroCommande?.toLowerCase().includes(term) ||
                    s.service?.toLowerCase().includes(term) ||
                    s.userFullName?.toLowerCase().includes(term) ||
                    s.delegationLibele?.toLowerCase().includes(term) ||
                    s.agenceLibele?.toLowerCase().includes(term)
            );
        }

        return result;
    });

    // Statistiques
    totalCommandes = computed(() => this.filteredStocks().length);
    totalQuantite = computed(() => this.filteredStocks().reduce((sum, s) => sum + (s.qteSuggeree || s.qte || 0), 0));

    ngOnInit(): void {
        this.loadStockAcceptes();
    }

    /**
     * Charger les bons acceptés par le DE pour la logistique
     */
    loadStockAcceptes(): void {
        this.loading.set(true);

        this.userService
            .getStockAcceptesPourLogistique$()
            .pipe(
                catchError((error) => {
                    console.error('Erreur lors du chargement des bons acceptés:', error);
                    this.showError('Erreur lors du chargement des bons de commande');
                    return of({ data: { stocks: [] } });
                })
            )
            .subscribe((response) => {
                console.log('Bons acceptés pour logistique:', response);
                if (response?.data?.stocks) {
                    this.stocks.set(response.data.stocks);
                    this.showSuccess(`${response.data.stocks.length} bon(s) de commande prêt(s) pour traitement`);
                } else {
                    this.stocks.set([]);
                }
                this.loading.set(false);
            });
    }

    /**
     * Afficher un message de succès
     */
    showSuccess(message: string): void {
        this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: message,
            life: 3000
        });
    }

    /**
     * Afficher un message d'erreur
     */
    showError(message: string): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: message,
            life: 5000
        });
    }

    // ==================== GESTION DES LIGNES EXPANSIBLES ====================

    toggleRow(stock: StockResponseDto): void {
        const currentExpanded = this.expandedRows();
        const stockId = stock.idCmd?.toString() || '';

        this.expandedRows.set({
            ...currentExpanded,
            [stockId]: !currentExpanded[stockId]
        });
    }

    isExpanded(stock: StockResponseDto): boolean {
        return this.expandedRows()[stock.idCmd?.toString() || ''] || false;
    }

    // ==================== UTILITAIRES D'AFFICHAGE ====================

    parseDetails(detailJson: string): any {
        try {
            if (!detailJson) return null;
            return JSON.parse(detailJson);
        } catch (e) {
            return { detailStandard: detailJson };
        }
    }

    getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        const statusMap: { [key: string]: 'success' | 'info' | 'warn' | 'danger' | 'secondary' } = {
            ENCOURS: 'warn',
            TERMINE: 'success',
            ANNULE: 'danger',
            EN_ATTENTE: 'info',
            VALIDE: 'success',
            ACCEPTE: 'success'
        };
        return statusMap[status] || 'secondary';
    }

    getStatusLabel(status: string): string {
        const statusLabels: { [key: string]: string } = {
            ENCOURS: 'En cours',
            TERMINE: 'Terminé',
            ANNULE: 'Annulé',
            EN_ATTENTE: 'En attente',
            VALIDE: 'Validé DR',
            ACCEPTE: 'Accepté DE'
        };
        return statusLabels[status] || status;
    }

    getValidationSeverity(validation: string): 'success' | 'danger' | 'warn' | 'info' {
        switch (validation) {
            case 'ACCEPTE':
                return 'success';
            case 'VALIDE':
                return 'info';
            case 'REFUSE':
                return 'danger';
            default:
                return 'warn';
        }
    }

    getValidationLabel(validation: string): string {
        const labels: { [key: string]: string } = {
            ACCEPTE: 'Accepté par DE',
            VALIDE: 'Validé par DR',
            REFUSE: 'Refusé',
            EN_ATTENTE: 'En attente'
        };
        return labels[validation] || validation;
    }

    formatDate(date: any): string {
        if (!date) return '-';
        if (Array.isArray(date)) {
            const [year, month, day, hour = 0, minute = 0] = date;
            return new Date(year, month - 1, day, hour, minute).toLocaleString('fr-FR');
        }
        if (typeof date === 'string') {
            return new Date(date).toLocaleString('fr-FR');
        }
        return '-';
    }

    // ==================== DIALOGUE DE DÉTAIL ====================

    openDetailDialog(stock: StockResponseDto): void {
        this.selectedStock.set(stock);
        this.showDetailDialog.set(true);
    }

    closeDetailDialog(): void {
        this.showDetailDialog.set(false);
        this.selectedStock.set(null);
    }

    // ==================== IMPRESSION ====================

    /**
     * Imprimer le rapport synthétique (tableau uniquement)
     */
    printRapportSynthese(): void {
        if (this.filteredStocks().length === 0) {
            this.showError('Aucune commande à imprimer');
            return;
        }

        this.printService.imprimerRapportLogistique(this.filteredStocks(), {
            includeSignature: true,
            includeDetails: false,
            autoClose: false,
            companyName: 'DIRECTION LOGISTIQUE'
        });
    }

    /**
     * Imprimer le rapport complet avec fiches détaillées
     */
    printRapportComplet(): void {
        if (this.filteredStocks().length === 0) {
            this.showError('Aucune commande à imprimer');
            return;
        }

        this.printService.imprimerRapportLogistique(this.filteredStocks(), {
            includeSignature: true,
            includeDetails: true,
            autoClose: false,
            companyName: 'DIRECTION LOGISTIQUE'
        });
    }

    /**
     * Imprimer une commande spécifique
     */
    printCommande(stock: StockResponseDto): void {
        this.printService.imprimerRapportLogistique([stock], {
            includeSignature: true,
            includeDetails: true,
            autoClose: false,
            companyName: 'DIRECTION LOGISTIQUE'
        });
    }

    /**
     * Obtenir la date actuelle formatée
     */
    getCurrentDate(): string {
        return new Date().toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // ==================== VALIDATION LOGISTIQUE ====================

    /**
     * Ouvrir le dialogue de validation pour une commande
     */
    openValidationDialog(stock: StockResponseDto): void {
        this.selectedStock.set(stock);
        this.validationObservations.set('');
        this.showValidationDialog.set(true);
    }

    /**
     * Fermer le dialogue de validation
     */
    closeValidationDialog(): void {
        this.showValidationDialog.set(false);
        this.selectedStock.set(null);
        this.validationObservations.set('');
    }

    /**
     * Confirmer et exécuter la validation logistique
     */
    confirmValidation(): void {
        const stock = this.selectedStock();
        if (!stock) return;

        this.confirmationService.confirm({
            message: `Êtes-vous sûr de vouloir valider la commande ${stock.numeroCommande} ?\nCette action est définitive et le bon disparaîtra de votre liste.`,
            header: 'Confirmation de traitement',
            icon: 'pi pi-check-circle',
            acceptLabel: 'Valider',
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: 'p-button-success',
            accept: () => {
                this.executeValidation(stock);
            }
        });
    }

    /**
     * Exécuter la validation logistique
     */
    private executeValidation(stock: StockResponseDto): void {
        this.processingAction.set(true);

        this.userService.validationLogistique$(stock.idCmd!, this.validationObservations() || undefined).subscribe({
            next: (response) => {
                this.showSuccess(`Commande ${stock.numeroCommande} traitée avec succès`);
                this.closeValidationDialog();
                this.loadStockAcceptes(); // Recharger la liste
            },
            error: (error) => {
                console.error('Erreur validation logistique:', error);
                this.showError(error.error?.message || 'Erreur lors du traitement de la commande');
            },
            complete: () => {
                this.processingAction.set(false);
            }
        });
    }

    /**
     * Validation rapide sans dialogue (avec confirmation)
     */
    quickValidate(stock: StockResponseDto): void {
        this.confirmationService.confirm({
            message: `Valider la commande ${stock.numeroCommande} ?\nLe bon sera marqué comme traité et disparaîtra de votre liste.`,
            header: 'Confirmation rapide',
            icon: 'pi pi-check',
            acceptLabel: 'Oui, valider',
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: 'p-button-success',
            accept: () => {
                this.processingAction.set(true);
                this.userService.validationLogistique$(stock.idCmd!).subscribe({
                    next: () => {
                        this.showSuccess(`Commande ${stock.numeroCommande} traitée`);
                        this.loadStockAcceptes();
                    },
                    error: (error) => {
                        this.showError(error.error?.message || 'Erreur lors du traitement');
                    },
                    complete: () => {
                        this.processingAction.set(false);
                    }
                });
            }
        });
    }

    /**
     * Compter les commandes par délégation
     */
    getCommandesParDelegation(): { delegation: string; count: number; quantite: number }[] {
        const map = new Map<string, { count: number; quantite: number }>();

        this.filteredStocks().forEach((stock) => {
            const delegation = stock.delegationLibele || 'Non spécifiée';
            const existing = map.get(delegation) || { count: 0, quantite: 0 };
            map.set(delegation, {
                count: existing.count + 1,
                quantite: existing.quantite + (stock.qteSuggeree || stock.qte || 0)
            });
        });

        return Array.from(map.entries())
            .map(([delegation, data]) => ({
                delegation,
                count: data.count,
                quantite: data.quantite
            }))
            .sort((a, b) => b.count - a.count);
    }
}
