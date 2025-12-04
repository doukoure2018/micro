import { IUser } from '@/interface/user';
import { Component, Input, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '@/service/user.service';
import { catchError, of } from 'rxjs';
import { SyntheseDelegationDto } from '@/interface/SyntheseDelegationDto';
import { BonCommandeDelegationDto } from '@/interface/BonCommandeDelegationDto';

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
import { MessageService } from 'primeng/api';
import { PrintBonCommandeService } from '@/service/print-bon-commande.service';

@Component({
    selector: 'app-logistique',
    standalone: true,
    imports: [
        CommonModule,
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
        ChipModule
    ],
    templateUrl: './logistique.component.html',
    styleUrl: './logistique.component.scss',
    providers: [MessageService]
})
export class LogistiqueComponent implements OnInit {
    @Input() user?: IUser;

    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private printService = inject(PrintBonCommandeService);

    state = signal<{
        user?: IUser;
        syntheseDelegations: SyntheseDelegationDto[];
        bonsCommandeDelegation: BonCommandeDelegationDto[];
        selectedDelegation?: string;
        showDetailModal: boolean;
        showPrintView: boolean;
        loading: boolean;
        searching: boolean;
    }>({
        syntheseDelegations: [],
        bonsCommandeDelegation: [],
        selectedDelegation: undefined,
        showDetailModal: false,
        showPrintView: false,
        loading: false,
        searching: false
    });

    ngOnInit(): void {
        this.state.update((s) => ({ ...s, user: this.user }));
        this.loadSyntheseDelegations();
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

    /**
     * Charger la synthèse des délégations
     */
    loadSyntheseDelegations(): void {
        this.state.update((s) => ({ ...s, loading: true }));

        this.userService
            .getSyntheseDelegations$()
            .pipe(
                catchError((error) => {
                    console.error('Erreur lors du chargement de la synthèse:', error);
                    this.showError('Erreur lors du chargement de la synthèse des délégations');
                    this.state.update((s) => ({ ...s, loading: false }));
                    return of(null);
                })
            )
            .subscribe((response) => {
                console.log('Response synthèse:', response);
                if (response && response.data) {
                    this.state.update((s) => ({
                        ...s,
                        syntheseDelegations: response.data.syntheseDelegations || [],
                        loading: false
                    }));
                    this.showSuccess(response.message || 'Synthèse chargée avec succès');
                } else {
                    this.state.update((s) => ({ ...s, loading: false }));
                }
            });
    }

    /**
     * Charger les bons de commande d'une délégation
     */
    loadBonsCommande(delegation: string): void {
        console.log('Chargement des bons pour:', delegation);

        this.state.update((s) => ({
            ...s,
            searching: true,
            selectedDelegation: delegation
        }));

        this.userService
            .getBonsCommandeParDelegation$(delegation)
            .pipe(
                catchError((error) => {
                    console.error('Erreur lors du chargement des bons de commande:', error);
                    this.showError('Erreur lors du chargement des bons de commande');
                    this.state.update((s) => ({ ...s, searching: false }));
                    return of(null);
                })
            )
            .subscribe((response) => {
                console.log('Response bons commande:', response);
                if (response && response.data) {
                    const bons = response.data.bonsCommandeDelegation || [];
                    console.log('Bons récupérés:', bons);

                    this.state.update((s) => ({
                        ...s,
                        bonsCommandeDelegation: bons,
                        searching: false,
                        showDetailModal: true
                    }));
                    this.showSuccess(`${bons.length} bon(s) de commande trouvé(s)`);
                } else {
                    this.state.update((s) => ({ ...s, searching: false }));
                }
            });
    }

    /**
     * Afficher la vue d'impression
     */
    showPrint(): void {
        this.state.update((s) => ({ ...s, showPrintView: true, showDetailModal: false }));
    }

    /**
     * Fermer la vue d'impression
     */
    closePrint(): void {
        this.state.update((s) => ({ ...s, showPrintView: false, showDetailModal: true }));
    }

    /**
     * Fermer le modal de détails
     */
    closeDetailModal(): void {
        this.state.update((s) => ({
            ...s,
            showDetailModal: false,
            selectedDelegation: undefined,
            bonsCommandeDelegation: []
        }));
    }

    /**
     * Imprimer la page en utilisant le service
     */
    print(): void {
        if (this.state().selectedDelegation && this.state().bonsCommandeDelegation.length > 0) {
            this.printService.imprimerRapport(this.state().selectedDelegation!, this.state().bonsCommandeDelegation, {
                includeSignature: true,
                autoClose: false
            });
        }
    }

    /**
     * Convertir un nombre de commandes
     */
    getNombreCommandes(value: string | number): number {
        return typeof value === 'string' ? parseInt(value, 10) : value;
    }

    /**
     * Convertir un tableau de date en Date object
     */
    private arrayToDate(dateArray: number[]): Date {
        if (!dateArray || dateArray.length < 3) {
            return new Date();
        }
        return new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3] || 0, dateArray[4] || 0, dateArray[5] || 0, Math.floor((dateArray[6] || 0) / 1000000));
    }

    /**
     * Formater une date
     */
    formatDate(date: string | number[] | null | undefined): string {
        if (!date) return 'N/A';

        let dateObj: Date;

        if (Array.isArray(date)) {
            dateObj = this.arrayToDate(date);
        } else if (typeof date === 'string') {
            dateObj = new Date(date);
        } else {
            return 'N/A';
        }

        return dateObj.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Parser le détail JSON de la commande
     */
    parseDetailCommande(detail: string): string {
        if (!detail) return 'N/A';
        try {
            const parsed = JSON.parse(detail);
            return parsed.detailStandard || detail;
        } catch {
            return detail;
        }
    }

    /**
     * Obtenir la sévérité du tag selon le statut
     */
    getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        const statusMap: { [key: string]: 'success' | 'info' | 'warn' | 'danger' | 'secondary' } = {
            ENCOURS: 'warn',
            TERMINE: 'success',
            ANNULE: 'danger',
            EN_ATTENTE: 'info',
            VALIDE: 'success'
        };
        return statusMap[status] || 'secondary';
    }

    /**
     * Obtenir le label du statut
     */
    getStatusLabel(status: string): string {
        const statusLabels: { [key: string]: string } = {
            ENCOURS: 'En cours',
            TERMINE: 'Terminé',
            ANNULE: 'Annulé',
            EN_ATTENTE: 'En attente',
            VALIDE: 'Validé'
        };
        return statusLabels[status] || status;
    }

    /**
     * Calculer le total des commandes
     */
    getTotalCommandes(): number {
        if (!this.state().syntheseDelegations) return 0;
        return this.state().syntheseDelegations.reduce((sum, s) => sum + this.getNombreCommandes(s.nombreCommandes), 0);
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

    /**
     * Compter les commandes par statut
     */
    getCommandesParStatut(status: string): number {
        if (!this.state().bonsCommandeDelegation) return 0;
        return this.state().bonsCommandeDelegation.filter((b) => b.status === status).length;
    }

    /**
     * Compter les commandes en cours
     */
    getCommandesEnCours(): number {
        return this.getCommandesParStatut('ENCOURS');
    }

    /**
     * Compter les commandes terminées
     */
    getCommandesTerminees(): number {
        return this.getCommandesParStatut('TERMINE');
    }

    /**
     * Compter les commandes annulées
     */
    getCommandesAnnulees(): number {
        return this.getCommandesParStatut('ANNULE');
    }

    /**
     * Calculer le pourcentage d'un statut
     */
    getPourcentageStatut(status: string): number {
        if (!this.state().bonsCommandeDelegation) return 0;
        const total = this.state().bonsCommandeDelegation.length;
        if (total === 0) return 0;
        const count = this.getCommandesParStatut(status);
        return Math.round((count / total) * 100);
    }
}
