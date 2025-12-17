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

@Component({
    selector: 'app-list-stock',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, TagModule, ButtonModule, CardModule, ToastModule, ProgressSpinnerModule, DividerModule, TooltipModule, DialogModule, ConfirmDialogModule, TextareaModule, InputNumberModule, CheckboxModule],
    templateUrl: './list-stock.component.html',
    styleUrl: './list-stock.component.scss',
    providers: [MessageService, ConfirmationService],
    animations: [trigger('rowExpand', [state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })), state('expanded', style({ height: '*' })), transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))])]
})
export class ListStockComponent implements OnInit {
    @Input() user?: IUser;
    public Object = Object;

    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    stocks = signal<any[]>([]);
    delegation = signal<Delegation | null>(null);
    loading = signal(false);
    delegationId = signal<number | null>(null);
    expandedRows = signal<{ [key: string]: boolean }>({});

    // Nouveaux signals pour les dialogues
    showRejectDialog = signal(false);
    showValidateDialog = signal(false);
    selectedStock = signal<any>(null);
    rejectMotif = signal('');
    validateObservations = signal('');
    rejectObservations = signal('');
    processingAction = signal(false);

    // Signals pour la suggestion de quantité (DE)
    showSuggestionDialog = signal(false);
    qteSuggeree = signal<number | null>(null);
    motifQte = signal('');
    suggestionObservations = signal('');
    garderQuantite = signal(false);
    
    // Mode de vue: 'encours' (DR) ou 'valides' (DE)
    viewMode = signal<'encours' | 'valides'>('encours');

    ngOnInit(): void {
        if (this.user?.delegationId) {
            this.delegationId.set(this.user.delegationId);
            // Charger selon le rôle de l'utilisateur
            if (this.user?.role === 'DE') {
                this.viewMode.set('valides');
                this.loadStockValidesPourDE();
            } else {
                this.viewMode.set('encours');
                this.loadStocksByDelegation();
            }
        } else {
            this.showWarning('Aucune délégation associée à cet utilisateur');
        }
    }

    /**
     * Charger les bons validés par le DR pour le DE
     */
    loadStockValidesPourDE(): void {
        const delId = this.delegationId();
        if (!delId) return;

        this.loading.set(true);

        this.userService.getStockValidesPourDE$(delId).subscribe({
            next: (response) => {
                console.log('Stocks validés pour DE:', response);
                if (response?.data?.stocks) {
                    this.stocks.set(response.data.stocks);
                    this.delegation.set(response.data.delegation);
                    this.showSuccess(`${response.data.stocks.length} bon(s) validé(s) disponible(s)`);
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
     * Changer le mode de vue
     */
    switchViewMode(mode: 'encours' | 'valides'): void {
        this.viewMode.set(mode);
        if (mode === 'valides') {
            this.loadStockValidesPourDE();
        } else {
            this.loadStocksByDelegation();
        }
    }

    isUrgent(stock: any): boolean {
        // Remplacez la logique ci-dessous par la condition réelle pour l'urgence
        return stock && stock.urgent === true;
    }

    /**
     * Ouvrir le dialogue de validation
     */
    openValidateDialog(stock: any): void {
        this.selectedStock.set(stock);
        this.validateObservations.set('');
        this.showValidateDialog.set(true);
    }

    /**
     * Ouvrir le dialogue de rejet
     */
    openRejectDialog(stock: any): void {
        this.selectedStock.set(stock);
        this.rejectMotif.set('');
        this.rejectObservations.set('');
        this.showRejectDialog.set(true);
    }

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

    loadStocksByDelegation(): void {
        const delId = this.delegationId();
        if (!delId) return;

        this.loading.set(true);

        this.userService.getStockEncoursByDelegation$(delId).subscribe({
            next: (response) => {
                console.log('Stocks par délégation:', response);
                if (response?.data?.stocks) {
                    this.stocks.set(response.data.stocks);
                    this.delegation.set(response.data.delegation);
                    this.showSuccess(`${response.data.stocks.length} bon(s) de commande chargé(s)`);
                } else {
                    this.stocks.set([]);
                }
            },
            error: (error) => {
                console.error('Erreur:', error);
                this.showError('Erreur lors du chargement des bons de commande');
                this.stocks.set([]);
            },
            complete: () => {
                this.loading.set(false);
            }
        });
    }

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

    /**
     * Obtenir la sévérité pour le tag de validation
     */
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

    formatDate(date: any): string {
        if (!date) return '-';
        if (Array.isArray(date)) {
            const [year, month, day, hour = 0, minute = 0] = date;
            return new Date(year, month - 1, day, hour, minute).toLocaleString('fr-FR');
        }
        return new Date(date).toLocaleString('fr-FR');
    }

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

    /**
     * Rejeter une commande (avec confirmation)
     */
    rejectCommand(stock?: any): void {
        const stockToReject = stock || this.selectedStock();

        if (!stockToReject) return;

        // Vérifier que le motif est renseigné
        if (!this.rejectMotif() || this.rejectMotif().trim().length === 0) {
            this.showWarning('Le motif de rejet est obligatoire');
            return;
        }

        this.confirmationService.confirm({
            message: `Êtes-vous sûr de vouloir rejeter la commande ${stockToReject.numeroCommande} ?`,
            header: 'Confirmation de rejet',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui, rejeter',
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.performRejection(stockToReject);
            },
            reject: () => {
                this.showInfo('Rejet annulé');
            }
        });
    }

    /**
     * Effectuer le rejet
     */
    private performRejection(stock: any): void {
        this.processingAction.set(true);
        const motif = this.rejectMotif();
        const observations = this.rejectObservations();

        this.userService.rejectCommand(stock.idCmd, motif, observations).subscribe({
            next: (response) => {
                this.showSuccess(`Commande ${stock.numeroCommande} rejetée avec succès`);
                this.loadStocksByDelegation(); // Recharger les données
                this.closeDialogs();

                // Mettre à jour localement le stock
                this.updateLocalStock(stock.idCmd, {
                    stateValidation: 'REFUSE',
                    motif: motif,
                    dateTraitement: new Date(),
                    traitePar: this.user?.userId
                });
            },
            error: (error) => {
                console.error('Erreur rejet:', error);
                this.showError(error.error?.message || 'Erreur lors du rejet de la commande');
            },
            complete: () => {
                this.processingAction.set(false);
            }
        });
    }

    /**
     * Valider une commande (avec confirmation)
     */
    validateCommand(stock?: any): void {
        const stockToValidate = stock || this.selectedStock();

        if (!stockToValidate) return;

        this.confirmationService.confirm({
            message: `Êtes-vous sûr de vouloir valider la commande ${stockToValidate.numeroCommande} ?`,
            header: 'Confirmation de validation',
            icon: 'pi pi-check-circle',
            acceptLabel: 'Oui, valider',
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: 'p-button-success',
            accept: () => {
                this.performValidation(stockToValidate);
            },
            reject: () => {
                this.showInfo('Validation annulée');
                this.closeDialogs();
            }
        });
    }

    /**
     * Effectuer la validation
     */
    private performValidation(stock: any): void {
        this.processingAction.set(true);
        const observations = this.validateObservations();

        this.userService.validateCommand(stock.idCmd, observations).subscribe({
            next: (response) => {
                this.showSuccess(`Commande ${stock.numeroCommande} validée avec succès`);
                this.loadStocksByDelegation(); // Recharger les données
                this.closeDialogs();

                // Mettre à jour localement le stock
                this.updateLocalStock(stock.idCmd, {
                    stateValidation: this.user?.role === 'DR' ? 'VALIDE' : 'ACCEPTE',
                    dateTraitement: new Date(),
                    traitePar: this.user?.userId
                });
            },
            error: (error) => {
                console.error('Erreur validation:', error);
                this.showError(error.error?.message || 'Erreur lors de la validation de la commande');
            },
            complete: () => {
                this.processingAction.set(false);
            }
        });
    }

    /**
     * Vérifie si les boutons d'action doivent être affichés
     */
    shouldShowActionButtons(stock: any): boolean {
        // Afficher les boutons seulement si la commande est en cours
        // ou si l'utilisateur a les permissions nécessaires
        return stock.status === 'ENCOURS' || stock.stateValidation === 'EN_ATTENTE';
    }

    /**
     * Vérifier si le bouton de rejet doit être désactivé
     */
    isRejectDisabled(stock: any): boolean {
        return stock.status !== 'ENCOURS' || stock.stateValidation === 'REFUSE' || stock.stateValidation === 'VALIDE' || stock.stateValidation === 'ACCEPTE';
    }
    /**
     * Vérifier si le bouton de validation doit être désactivé
     */
    isValidateDisabled(stock: any): boolean {
        return stock.status !== 'ENCOURS' || stock.stateValidation === 'REFUSE' || stock.stateValidation === 'VALIDE' || stock.stateValidation === 'ACCEPTE';
    }

    /**
     * Obtenir le libellé du state validation
     */
    getStateValidationLabel(stateValidation: string): string {
        const labels: { [key: string]: string } = {
            VALIDE: 'Validé par DR',
            ACCEPTE: 'Accepté',
            REFUSE: 'Refusé',
            EN_ATTENTE: 'En attente'
        };
        return labels[stateValidation] || stateValidation;
    }

    /**
     * Obtenir le tooltip pour le bouton de rejet
     */
    getRejectTooltip(stock: any): string {
        if (stock.stateValidation === 'REFUSE') {
            return 'Cette commande a déjà été rejetée';
        }
        if (stock.stateValidation === 'VALIDE' || stock.stateValidation === 'ACCEPTE') {
            return 'Impossible de rejeter une commande validée';
        }
        if (stock.status === 'ACCEPT') {
            return 'Impossible de rejeter une commande acceptée';
        }
        if (stock.status === 'REJET') {
            return 'Cette commande a déjà été rejetée';
        }
        return 'Rejeter cette commande';
    }

    /**
     * Obtenir le tooltip pour le bouton de validation
     */
    getValidateTooltip(stock: any): string {
        if (stock.stateValidation === 'VALIDE' || stock.stateValidation === 'ACCEPTE') {
            return 'Cette commande a déjà été validée';
        }
        if (stock.stateValidation === 'REFUSE') {
            return 'Impossible de valider une commande refusée';
        }
        if (stock.status === 'ACCEPT') {
            return 'Cette commande a déjà été acceptée';
        }
        if (stock.status === 'REJET') {
            return 'Impossible de valider une commande rejetée';
        }
        return 'Valider cette commande';
    }
    /**
     * Message d'information temporaire
     */
    private showInfo(message: string): void {
        this.messageService.add({
            severity: 'info',
            summary: 'Information',
            detail: message,
            life: 3000
        });
    }

    /**
     * Fermer tous les dialogues
     */
    closeDialogs(): void {
        this.showValidateDialog.set(false);
        this.showRejectDialog.set(false);
        this.selectedStock.set(null);
        this.rejectMotif.set('');
        this.validateObservations.set('');
        this.rejectObservations.set('');
    }

    /**
     * Mettre à jour un stock localement (optimistic update)
     */
    private updateLocalStock(idCmd: number, updates: any): void {
        const currentStocks = this.stocks();
        const updatedStocks = currentStocks.map((stock) => {
            if (stock.idCmd === idCmd) {
                return { ...stock, ...updates };
            }
            return stock;
        });
        this.stocks.set(updatedStocks);
    }

    /**
     * Ouvre un dialogue de confirmation avant action
     * À utiliser quand l'implémentation sera prête
     */
    private confirmAction(title: string, message: string, onConfirm: () => void): void {
        // Utilisation future avec PrimeNG ConfirmDialog
        /*
        this.confirmationService.confirm({
            message: message,
            header: title,
            icon: 'pi pi-exclamation-triangle',
            accept: onConfirm,
            reject: () => {
                this.showInfo('Action annulée');
            }
        });
        */
    }

    // ==================== FONCTIONNALITÉS DE SUGGESTION DE QUANTITÉ (DE) ====================

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

        // Validation
        if (this.isMotifRequired() && (!this.motifQte() || this.motifQte().trim().length === 0)) {
            this.showWarning('Le motif est obligatoire lorsque la quantité est modifiée');
            return;
        }

        this.confirmationService.confirm({
            message: this.garderQuantite() 
                ? `Confirmer la quantité actuelle (${stock.qteActuelle || stock.qte}) pour la commande ${stock.numeroCommande} ?`
                : `Suggérer une quantité de ${this.qteSuggeree()} pour la commande ${stock.numeroCommande} ?`,
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

        const suggestionDto = {
            qteSuggeree: this.garderQuantite() ? (stock.qteActuelle || stock.qte) : this.qteSuggeree()!,
            motifQte: this.motifQte() || undefined,
            observations: this.suggestionObservations() || undefined,
            garderQuantite: this.garderQuantite()
        };

        this.userService.suggererQuantite$(stock.idCmd, suggestionDto).subscribe({
            next: (response) => {
                const message = this.garderQuantite() 
                    ? `Quantité confirmée pour la commande ${stock.numeroCommande}`
                    : `Suggestion de quantité enregistrée pour la commande ${stock.numeroCommande}`;
                this.showSuccess(message);
                
                // Recharger les données selon le mode
                if (this.viewMode() === 'valides') {
                    this.loadStockValidesPourDE();
                } else {
                    this.loadStocksByDelegation();
                }
                
                this.closeSuggestionDialog();
            },
            error: (error) => {
                console.error('Erreur suggestion:', error);
                this.showError(error.error?.message || 'Erreur lors de l\'enregistrement de la suggestion');
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
}
