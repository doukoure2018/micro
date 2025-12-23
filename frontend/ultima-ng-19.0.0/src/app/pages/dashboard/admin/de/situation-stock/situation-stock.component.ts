import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DividerModule } from 'primeng/divider';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TooltipModule } from 'primeng/tooltip';
import { Delegation } from '@/interface/delegation';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';

/**
 * Composant pour la gestion des stocks par le DE (Directeur d'Exploitation)
 *
 * Fonctionnalités:
 * - Affiche uniquement les bons validés par le DR (state_validation = 'VALIDE')
 * - Permet de suggérer une modification de quantité
 * - Si la quantité change, le motif est obligatoire
 * - Si la quantité reste identique (garder), le motif est optionnel
 * - Les bons rejetés ne sont pas visibles
 */
@Component({
    selector: 'app-situation-stock',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, TagModule, ButtonModule, CardModule, ToastModule, ProgressSpinnerModule, DividerModule, TooltipModule, DialogModule, ConfirmDialogModule, TextareaModule, InputNumberModule, CheckboxModule],
    templateUrl: './situation-stock.component.html',
    styleUrl: './situation-stock.component.scss',
    providers: [MessageService, ConfirmationService],
    animations: [trigger('rowExpand', [state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })), state('expanded', style({ height: '*' })), transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))])]
})
export class SituationStockComponent implements OnInit {
    @Input() user?: IUser;
    public Object = Object;

    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    // Signals principaux
    stocks = signal<any[]>([]);
    delegation = signal<Delegation | null>(null);
    loading = signal(false);
    delegationId = signal<number | null>(null);
    expandedRows = signal<{ [key: string]: boolean }>({});

    // Mode d'affichage: 'delegation' (uniquement ma délégation) ou 'all' (toutes les délégations)
    viewMode = signal<'delegation' | 'all'>('all');

    // Signals pour le dialogue de suggestion
    showSuggestionDialog = signal(false);
    selectedStock = signal<any>(null);
    qteSuggeree = signal<number | null>(null);
    motifQte = signal('');
    suggestionObservations = signal('');
    garderQuantite = signal(false);
    processingAction = signal(false);

    // Signals pour la validation finale
    showValidationFinaleDialog = signal(false);
    validationObservations = signal('');

    ngOnInit(): void {
        if (this.user?.delegationId) {
            this.delegationId.set(this.user.delegationId);
        }
        // Charger tous les bons validés par défaut
        this.loadAllStockValides();
    }

    /**
     * Charger TOUS les bons validés par le DR (toutes délégations)
     */
    loadAllStockValides(): void {
        this.loading.set(true);
        this.viewMode.set('all');

        this.userService.getAllStockValidesPourDE$().subscribe({
            next: (response) => {
                console.log('Tous les stocks validés:', response);
                if (response?.data?.stocks) {
                    this.stocks.set(response.data.stocks);
                    this.showSuccess(`${response.data.stocks.length} bon(s) validé(s) de toutes les délégations`);
                } else {
                    this.stocks.set([]);
                }
            },
            error: (error) => {
                console.error('Erreur:', error);
                this.showError('Erreur lors du chargement des bons validés');
                this.stocks.set([]);
            },
            complete: () => {
                this.loading.set(false);
            }
        });
    }

    /**
     * Charger les bons validés par le DR pour une délégation spécifique
     */
    loadStockValidesPourDE(): void {
        const delId = this.delegationId();
        if (!delId) {
            this.showWarning('Aucune délégation associée');
            return;
        }

        this.loading.set(true);
        this.viewMode.set('delegation');

        this.userService.getStockValidesPourDE$(delId).subscribe({
            next: (response) => {
                console.log('Stocks validés pour ma délégation:', response);
                if (response?.data?.stocks) {
                    this.stocks.set(response.data.stocks);
                    this.delegation.set(response.data.delegation);
                    this.showSuccess(`${response.data.stocks.length} bon(s) validé(s) pour ma délégation`);
                } else {
                    this.stocks.set([]);
                }
            },
            error: (error) => {
                console.error('Erreur:', error);
                this.showError('Erreur lors du chargement des bons validés');
                this.stocks.set([]);
            },
            complete: () => {
                this.loading.set(false);
            }
        });
    }

    /**
     * Changer le mode d'affichage
     */
    switchViewMode(mode: 'delegation' | 'all'): void {
        if (mode === 'all') {
            this.loadAllStockValides();
        } else {
            this.loadStockValidesPourDE();
        }
    }

    /**
     * Rafraîchir les données selon le mode actuel
     */
    refresh(): void {
        if (this.viewMode() === 'all') {
            this.loadAllStockValides();
        } else {
            this.loadStockValidesPourDE();
        }
    }

    // ==================== GESTION DES LIGNES EXPANSIBLES ====================

    toggleRow(stock: any): void {
        const currentExpanded = this.expandedRows();
        const stockId = stock.idCmd.toString();

        this.expandedRows.set({
            ...currentExpanded,
            [stockId]: !currentExpanded[stockId]
        });
    }

    isExpanded(stock: any): boolean {
        return this.expandedRows()[stock.idCmd.toString()] || false;
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

    getStatusSeverity(status: string): 'success' | 'warn' | 'danger' {
        switch (status) {
            case 'ACCEPT':
                return 'success';
            case 'REJET':
                return 'danger';
            case 'ENCOURS':
                return 'warn';
            default:
                return 'warn';
        }
    }

    getValidationSeverity(validation: string): 'success' | 'danger' | 'warn' {
        switch (validation) {
            case 'VALIDE':
            case 'ACCEPTE':
                return 'success';
            case 'REFUSE':
                return 'danger';
            case 'EN_ATTENTE':
            default:
                return 'warn';
        }
    }

    getStateValidationLabel(stateValidation: string): string {
        const labels: { [key: string]: string } = {
            VALIDE: 'Validé par DR',
            ACCEPTE: 'Accepté',
            REFUSE: 'Refusé',
            EN_ATTENTE: 'En attente'
        };
        return labels[stateValidation] || stateValidation;
    }

    formatDate(date: any): string {
        if (!date) return '-';
        if (Array.isArray(date)) {
            const [year, month, day, hour = 0, minute = 0] = date;
            return new Date(year, month - 1, day, hour, minute).toLocaleString('fr-FR');
        }
        return new Date(date).toLocaleString('fr-FR');
    }

    isUrgent(stock: any): boolean {
        return stock && stock.urgent === true;
    }

    // ==================== SUGGESTION DE QUANTITÉ ====================

    /**
     * Ouvrir le dialogue de suggestion de quantité
     */
    openSuggestionDialog(stock: any): void {
        this.selectedStock.set(stock);
        // Initialiser avec la quantité actuelle
        const qteActuelle = stock.qteActuelle || stock.qte;
        this.qteSuggeree.set(stock.qteSuggeree || qteActuelle);
        this.motifQte.set(stock.motifQte || '');
        this.suggestionObservations.set('');
        this.garderQuantite.set(false);
        this.showSuggestionDialog.set(true);
    }

    /**
     * Vérifier si le motif est obligatoire
     * Le motif est obligatoire si la quantité suggérée est différente de la quantité actuelle
     */
    isMotifRequired(): boolean {
        const stock = this.selectedStock();
        if (!stock || this.garderQuantite()) return false;

        const qteActuelle = stock.qteActuelle || stock.qte;
        return this.qteSuggeree() !== qteActuelle;
    }

    /**
     * Soumettre la suggestion de quantité
     */
    submitSuggestion(): void {
        const stock = this.selectedStock();
        if (!stock) return;

        // Validation: motif obligatoire si quantité modifiée
        if (this.isMotifRequired() && (!this.motifQte() || this.motifQte().trim().length === 0)) {
            this.showWarning('Le motif est obligatoire lorsque la quantité est modifiée');
            return;
        }

        const qteActuelle = stock.qteActuelle || stock.qte;
        const qteSuggereeFinal = this.garderQuantite() ? qteActuelle : this.qteSuggeree()!;

        this.confirmationService.confirm({
            message: this.garderQuantite() ? `Confirmer la quantité actuelle (${qteActuelle}) pour la commande ${stock.numeroCommande} ?` : `Suggérer une quantité de ${qteSuggereeFinal} pour la commande ${stock.numeroCommande} ?`,
            header: 'Confirmation',
            icon: 'pi pi-question-circle',
            acceptLabel: 'Confirmer',
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: 'p-button-primary',
            accept: () => {
                this.performSuggestion(stock);
            }
        });
    }

    /**
     * Effectuer la suggestion de quantité
     */
    private performSuggestion(stock: any): void {
        this.processingAction.set(true);

        const qteActuelle = stock.qteActuelle || stock.qte;
        const suggestionDto = {
            qteSuggeree: this.garderQuantite() ? qteActuelle : this.qteSuggeree()!,
            motifQte: this.motifQte() || undefined,
            observations: this.suggestionObservations() || undefined,
            garderQuantite: this.garderQuantite()
        };

        this.userService.suggererQuantite$(stock.idCmd, suggestionDto).subscribe({
            next: (response) => {
                const message = this.garderQuantite() ? `Quantité confirmée pour la commande ${stock.numeroCommande}` : `Suggestion de quantité enregistrée pour la commande ${stock.numeroCommande}`;
                this.showSuccess(message);

                // Fermer le dialogue d'abord
                this.closeSuggestionDialog();

                // Recharger les données selon le mode actuel
                this.refresh();
            },
            error: (error) => {
                console.error('Erreur suggestion:', error);
                this.showError(error.error?.message || "Erreur lors de l'enregistrement de la suggestion");
            },
            complete: () => {
                this.processingAction.set(false);
            }
        });
    }

    /**
     * Fermer le dialogue de suggestion
     */
    closeSuggestionDialog(): void {
        this.showSuggestionDialog.set(false);
        this.selectedStock.set(null);
        this.qteSuggeree.set(null);
        this.motifQte.set('');
        this.suggestionObservations.set('');
        this.garderQuantite.set(false);
    }

    /**
     * Vérifier si le bouton de suggestion doit être affiché
     * Seulement pour les bons validés par le DR
     */
    canSuggestQuantity(stock: any): boolean {
        return stock.status === 'ENCOURS' && stock.stateValidation === 'VALIDE';
    }

    /**
     * Vérifier si une suggestion a déjà été faite
     */
    hasSuggestion(stock: any): boolean {
        return stock.qteSuggeree !== null && stock.qteSuggeree !== undefined;
    }

    /**
     * Obtenir le libellé de la suggestion
     */
    getSuggestionLabel(stock: any): string {
        if (!this.hasSuggestion(stock)) {
            return 'Aucune suggestion';
        }
        const qteActuelle = stock.qteActuelle || stock.qte;
        if (stock.qteSuggeree === qteActuelle) {
            return 'Quantité confirmée';
        }
        return `Suggéré: ${stock.qteSuggeree} (était: ${qteActuelle})`;
    }

    /**
     * Obtenir la classe CSS pour la suggestion
     */
    getSuggestionClass(stock: any): string {
        if (!this.hasSuggestion(stock)) {
            return 'suggestion-pending';
        }
        const qteActuelle = stock.qteActuelle || stock.qte;
        if (stock.qteSuggeree === qteActuelle) {
            return 'suggestion-confirmed';
        }
        return 'suggestion-modified';
    }

    /**
     * Handler pour le changement de "garder quantité"
     */
    onGarderQuantiteChange(): void {
        if (this.garderQuantite()) {
            const stock = this.selectedStock();
            if (stock) {
                this.qteSuggeree.set(stock.qteActuelle || stock.qte);
            }
        }
    }

    // ==================== VALIDATION FINALE DE ====================

    /**
     * Vérifier si le bouton de validation finale doit être affiché
     * La validation finale est possible si une suggestion a été faite
     */
    canValidateFinale(stock: any): boolean {
        return stock.status === 'ENCOURS' && stock.stateValidation === 'VALIDE' && this.hasSuggestion(stock);
    }

    /**
     * Ouvrir le dialogue de validation finale
     */
    openValidationFinaleDialog(stock: any): void {
        this.selectedStock.set(stock);
        this.validationObservations.set('');
        this.showValidationFinaleDialog.set(true);
    }

    /**
     * Fermer le dialogue de validation finale
     */
    closeValidationFinaleDialog(): void {
        this.showValidationFinaleDialog.set(false);
        this.selectedStock.set(null);
        this.validationObservations.set('');
    }

    /**
     * Soumettre la validation finale
     */
    submitValidationFinale(): void {
        const stock = this.selectedStock();
        if (!stock) return;

        this.confirmationService.confirm({
            message: `Êtes-vous sûr de vouloir valider définitivement la commande ${stock.numeroCommande} ?\nCette action rendra le bon disponible pour la logistique.`,
            header: 'Confirmation de validation finale',
            icon: 'pi pi-check-circle',
            acceptLabel: 'Valider',
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: 'p-button-success',
            accept: () => {
                this.performValidationFinale(stock);
            }
        });
    }

    /**
     * Effectuer la validation finale
     */
    private performValidationFinale(stock: any): void {
        this.processingAction.set(true);

        this.userService.validationFinaleDE$(stock.idCmd, this.validationObservations() || undefined).subscribe({
            next: (response) => {
                this.showSuccess(`Commande ${stock.numeroCommande} validée et envoyée à la logistique`);
                this.closeValidationFinaleDialog();
                this.refresh();
            },
            error: (error) => {
                console.error('Erreur validation finale:', error);
                this.showError(error.error?.message || 'Erreur lors de la validation finale');
            },
            complete: () => {
                this.processingAction.set(false);
            }
        });
    }

    // ==================== MESSAGES ====================

    private showSuccess(message: string): void {
        this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: message,
            life: 3000
        });
    }

    private showError(message: string): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: message,
            life: 5000
        });
    }

    private showWarning(message: string): void {
        this.messageService.add({
            severity: 'warn',
            summary: 'Attention',
            detail: message,
            life: 4000
        });
    }

    private showInfo(message: string): void {
        this.messageService.add({
            severity: 'info',
            summary: 'Information',
            detail: message,
            life: 3000
        });
    }
}
