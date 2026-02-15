import { DemandeIndividuel } from '@/interface/demande-individuel.interface';
import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { switchMap, of, catchError, forkJoin } from 'rxjs';

@Component({
    selector: 'app-attente',
    standalone: true,
    imports: [CommonModule, TableModule, InputTextModule, ProgressBarModule, ButtonModule, IconField, InputIcon, TagModule, MessageModule, CardModule, DividerModule, BadgeModule, TooltipModule],
    templateUrl: './attente.component.html',
    styleUrls: ['./attente.component.scss']
})
export class AttenteComponent implements OnInit {
    // État du composant
    state = signal<{
        demandeAttentes?: DemandeIndividuel[];
        loading: boolean;
        message: string | undefined;
        error: string | any;
        agenceId?: number;
        pointVenteId?: number;
        userInfo?: any;
    }>({
        loading: false,
        message: undefined,
        error: undefined
    });

    // Propriété séparée pour les lignes expandées (compatible avec PrimeNG)
    expandedRows: { [key: string]: boolean } = {};

    // Filtre actif par statut
    activeFilter = signal<'ALL' | 'EN_ATTENTE' | 'AFFECTATION' | 'REJETEE'>('ALL');

    // IDs des demandes entièrement validées par le DA (bilan + flux VALIDE)
    demandesValideesIds = signal<Set<number>>(new Set());

    // Exclure uniquement les demandes entièrement validées par le DA
    private demandesSansBilanFlux = computed(() => {
        const all = this.state().demandeAttentes || [];
        const valideesIds = this.demandesValideesIds();
        return all.filter(d => {
            const id = d.demandeIndividuelId;
            return !id || !valideesIds.has(id);
        });
    });

    // Compteurs par statut
    countEnAttente = computed(() => {
        return this.demandesSansBilanFlux().filter(d => d.statutDemande === 'EN_ATTENTE' && (!d.validationState || d.validationState === 'NOUVEAU')).length;
    });

    countAffectation = computed(() => {
        return this.demandesSansBilanFlux().filter(d => d.validationState === 'SELECTION').length;
    });

    countRejetee = computed(() => {
        return this.demandesSansBilanFlux().filter(d => d.statutDemande === 'REJECTED' || d.validationState === 'REJECTED').length;
    });

    // Demandes filtrées, groupées par jour et triées par date décroissante
    filteredDemandes = computed(() => {
        const all = this.demandesSansBilanFlux();
        let filtered: any[];

        switch (this.activeFilter()) {
            case 'EN_ATTENTE':
                filtered = all.filter(d => d.statutDemande === 'EN_ATTENTE' && (!d.validationState || d.validationState === 'NOUVEAU'));
                break;
            case 'AFFECTATION':
                filtered = all.filter(d => d.validationState === 'SELECTION');
                break;
            case 'REJETEE':
                filtered = all.filter(d => d.statutDemande === 'REJECTED' || d.validationState === 'REJECTED');
                break;
            default:
                filtered = [...all];
        }

        return filtered
            .map(d => ({
                ...d,
                dateGroup: d.createdAt ? d.createdAt.substring(0, 10) : '1970-01-01'
            }))
            .sort((a, b) => {
                if (a.dateGroup !== b.dateGroup) {
                    return b.dateGroup.localeCompare(a.dateGroup);
                }
                const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return timeB - timeA;
            });
    });

    private userService = inject(UserService);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);

    ngOnInit(): void {
        // Charger les IDs des demandes entièrement validées par le DA
        this.loadDemandesValideesIds();
        // Récupérer les informations de l'utilisateur puis charger les données
        this.loadUserInfoAndDemandes();
    }

    // Méthodes pour gérer l'expansion des lignes
    onRowExpand(event: any) {
        console.log('Ligne expandée:', event.data);
    }

    onRowCollapse(event: any) {
        console.log('Ligne collapsée:', event.data);
    }

    // Méthode pour gérer l'expansion des lignes manuellement
    toggleRowManual(demande: any): void {
        const key = demande.demandeindividuel_id || demande.demandeIndividuelId;

        if (!key) {
            console.error("Pas d'ID trouvé pour la demande:", demande);
            return;
        }

        // Toggle l'état
        if (this.expandedRows[key]) {
            delete this.expandedRows[key];
        } else {
            this.expandedRows[key] = true;
        }

        // Forcer la mise à jour
        this.expandedRows = { ...this.expandedRows };

        console.log('Expanded rows après toggle:', this.expandedRows);
    }

    private loadDemandesValideesIds(): void {
        this.userService.getDemandesValideesIds$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    const ids: number[] = response.data?.demandesValideesIds || [];
                    this.demandesValideesIds.set(new Set(ids));
                },
                error: (error: any) => {
                    console.error('Erreur lors du chargement des demandes validées:', error);
                    this.demandesValideesIds.set(new Set());
                }
            });
    }

    private loadUserInfoAndDemandes(): void {
        this.state.update((state) => ({ ...state, loading: true }));

        // Récupérer les informations de l'utilisateur via l'API
        this.userService
            .getInstanceUser$()
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                switchMap((userResponse: IResponse) => {
                    console.log('Informations utilisateur récupérées:', userResponse);

                    if (userResponse.data && userResponse.data.user) {
                        const user = userResponse.data.user;

                        // Mettre à jour l'état avec les informations utilisateur
                        this.state.update((state) => ({
                            ...state,
                            userInfo: user,
                            agenceId: user.agenceId || user.agenceId,
                            pointVenteId: user.pointventeId || user.pointventeId
                        }));

                        // Stocker en localStorage pour une utilisation future (optionnel)
                        localStorage.setItem('userInfo', JSON.stringify(user));
                    }

                    // Charger les demandes en fonction des paramètres récupérés
                    const { agenceId, pointVenteId } = this.state();

                    // Si nous avons des paramètres, utiliser la nouvelle méthode
                    if (agenceId || pointVenteId) {
                        return this.userService.getAllDemandesWithGaranties$(agenceId, pointVenteId);
                    } else {
                        // Sinon, utiliser l'ancienne méthode pour récupérer toutes les demandes
                        return this.userService.getAllDemandeAttente$();
                    }
                }),
                catchError((error) => {
                    console.error('Erreur lors du chargement:', error);

                    // En cas d'erreur avec getInstanceUser, essayer de charger les demandes directement
                    if (error.message && error.message.includes('instanceUser')) {
                        console.log('Erreur avec getInstanceUser, chargement direct des demandes...');
                        return this.userService.getAllDemandeAttente$();
                    }

                    // Si c'est une erreur de paramètres manquants, essayer l'ancienne méthode
                    if (error.includes && error.includes('Au moins un des paramètres')) {
                        console.log('Paramètres manquants, utilisation de la méthode classique...');
                        return this.userService.getAllDemandeAttente$();
                    }

                    // Sinon, propager l'erreur
                    return of({ data: { demandes: [] }, message: 'Erreur lors du chargement' });
                })
            )
            .subscribe({
                next: (response: IResponse | { data: { demandes: never[] }; message: string }) => {
                    console.log('Demandes chargées:', response);

                    // Handle both possible response types
                    let demandes = (response as IResponse).data?.demandeAttentes || (response as any).data?.demandes || [];

                    // Normaliser les IDs des demandes
                    demandes = this.normalizeDemandesIds(demandes);

                    this.state.update((state) => ({
                        ...state,
                        demandeAttentes: demandes,
                        loading: false,
                        message: response.message,
                        error: undefined
                    }));
                },
                error: (error: any) => {
                    console.error('Erreur finale:', error);
                    this.state.update((state) => ({
                        ...state,
                        loading: false,
                        message: undefined,
                        error: error.message || error || 'Une erreur est survenue'
                    }));
                }
            });
    }

    // Méthode pour normaliser les IDs des demandes
    private normalizeDemandesIds(demandes: any[]): any[] {
        return demandes.map((demande) => {
            // S'assurer que demandeindividuel_id existe (format attendu par le dataKey)
            if (!demande.demandeindividuel_id && demande.demandeIndividuelId) {
                demande.demandeindividuel_id = demande.demandeIndividuelId;
            }
            // Garder aussi demandeIndividuelId pour compatibilité
            if (!demande.demandeIndividuelId && demande.demandeindividuel_id) {
                demande.demandeIndividuelId = demande.demandeindividuel_id;
            }
            return demande;
        });
    }

    private loadAllDemandesWithGaranties(): void {
        this.state.update((state) => ({ ...state, loading: true, error: undefined }));

        const agenceId = this.state().agenceId;
        const pointVenteId = this.state().pointVenteId;

        this.userService
            .getAllDemandesWithGaranties$(agenceId, pointVenteId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    console.log('Demandes avec garanties chargées:', response);

                    let demandes = response.data.demandeAttentes || [];

                    // Normaliser les IDs des demandes
                    demandes = this.normalizeDemandesIds(demandes);

                    this.state.update((state) => ({
                        ...state,
                        demandeAttentes: demandes,
                        loading: false,
                        message: response.message,
                        error: undefined
                    }));
                },
                error: (error: any) => {
                    console.error('Erreur lors du chargement des demandes avec garanties:', error);

                    // Si l'erreur est due aux paramètres manquants, essayer l'ancienne méthode
                    if (error.includes && error.includes('Au moins un des paramètres')) {
                        console.log("Tentative avec l'ancienne méthode...");
                        this.loadAllDemandeAttente();
                    } else {
                        this.state.update((state) => ({
                            ...state,
                            loading: false,
                            message: undefined,
                            error: error
                        }));
                    }
                }
            });
    }

    // Méthode de fallback utilisant l'ancien endpoint
    private loadAllDemandeAttente(): void {
        this.state.update((state) => ({ ...state, loading: true, error: undefined }));

        this.userService
            .getAllDemandeAttente$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    console.log('Demandes chargées (méthode classique):', response);

                    let demandes = response.data.demandeAttentes || [];

                    // Normaliser les IDs des demandes
                    demandes = this.normalizeDemandesIds(demandes);

                    this.state.update((state) => ({
                        ...state,
                        demandeAttentes: demandes,
                        loading: false,
                        message: response.message,
                        error: undefined
                    }));
                },
                error: (error: string) => {
                    console.error('Erreur lors du chargement des demandes:', error);
                    this.state.update((state) => ({
                        ...state,
                        loading: false,
                        message: undefined,
                        error: error
                    }));
                }
            });
    }

    onGlobalFilter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    getStatusLabel(statutDemande: string, validationState: string): string {
        if (statutDemande === 'EN_ATTENTE' && validationState === 'NOUVEAU') {
            return 'NOUVELLE DEMANDE';
        } else if (statutDemande === 'EN_ATTENTE' && validationState === 'SELECTION') {
            return 'AFFECTATION';
        } else if (statutDemande === 'EN_ATTENTE' && validationState === 'APPROVED') {
            return 'APPROUVÉE';
        }
        return statutDemande;
    }

    getStateValidation(statutDemande: string, validationState: string): string {
        if (statutDemande === 'EN_ATTENTE' && validationState === 'NOUVEAU') {
            return 'EN ATTENTE POUR LA SELECTION';
        } else if (statutDemande === 'EN_ATTENTE' && validationState === 'SELECTION') {
            return 'EN ATTENTE POUR LA VALIDATION';
        } else if (statutDemande === 'EN_ATTENTE' && validationState === 'APPROVED') {
            return "DEMANDE APPROUVÉE PAR L'AGENT";
        }
        return validationState;
    }

    getStatusSeverity(statutDemande: string, validationState: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
        if (validationState === 'APPROVED') return 'success';
        if (statutDemande === 'EN_ATTENTE') return 'info';
        if (statutDemande === 'REJECTED' || validationState === 'REJECTED') return 'danger';
        if (validationState === 'SELECTION') return 'warn';
        return 'secondary';
    }

    viewDetailDemandeAttente(demandeindividuel_id: number) {
        this.router.navigate(['/dashboards/credit/individuel/attente/detail/', demandeindividuel_id]);
    }

    // Calculer le total des garanties
    getTotalGaranties(garanties: any[]): number {
        if (!garanties || garanties.length === 0) return 0;
        return garanties.reduce((total, g) => total + (g.valeurGarantie || 0), 0);
    }

    // Calculer le total empruntable
    getTotalEmprunte(garanties: any[]): number {
        if (!garanties || garanties.length === 0) return 0;
        return garanties.reduce((total, g) => total + (g.valeurEmprunte || 0), 0);
    }

    // Obtenir la couleur du badge selon le type de garantie
    getGarantieSeverity(typeGarantie: string): 'info' | 'success' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
        const severityMap: { [key: string]: string } = {
            'Caution Solidaire': 'success',
            'Depot a terme': 'info',
            'Surete Reelles': 'warn',
            'Autre Garantie': 'secondary',
            Matériel: 'info',
            Immobilier: 'success',
            Caution: 'warn'
        };
        return (severityMap[typeGarantie] as any) || 'secondary';
    }

    // Formater la périodicité
    formatPeriodicite(periodicite: string): string {
        const formatMap: { [key: string]: string } = {
            Mensuelle: 'Mensuel',
            Bimestrielle: '2 mois',
            Trimestrielle: '3 mois',
            Quatrimestrielle: '4 mois',
            Semestrielle: '6 mois',
            Annuelle: 'Annuel'
        };
        return formatMap[periodicite] || periodicite;
    }

    // Rafraîchir les données
    refreshData(): void {
        this.expandedRows = {}; // Réinitialiser les lignes expandées
        this.loadUserInfoAndDemandes();
    }

    // Filtrer par agence
    filterByAgence(agenceId: number): void {
        this.expandedRows = {};
        this.state.update((state) => ({ ...state, agenceId, pointVenteId: undefined }));
        this.loadAllDemandesWithGaranties();
    }

    // Filtrer par point de vente
    filterByPointVente(pointVenteId: number): void {
        this.expandedRows = {};
        this.state.update((state) => ({ ...state, pointVenteId, agenceId: undefined }));
        this.loadAllDemandesWithGaranties();
    }

    // Réinitialiser les filtres et charger toutes les données
    clearFilters(): void {
        this.expandedRows = {};
        this.state.update((state) => ({ ...state, agenceId: undefined, pointVenteId: undefined }));
        // Utiliser l'ancienne méthode pour charger toutes les demandes
        this.loadAllDemandeAttente();
    }

    // Méthode pour définir manuellement l'agence (peut être appelée depuis l'extérieur)
    setAgence(agenceId: number): void {
        this.expandedRows = {};
        this.state.update((state) => ({ ...state, agenceId, pointVenteId: undefined }));
        this.loadAllDemandesWithGaranties();
    }

    // Méthode pour définir manuellement le point de vente
    setPointVente(pointVenteId: number): void {
        this.expandedRows = {};
        this.state.update((state) => ({ ...state, pointVenteId, agenceId: undefined }));
        this.loadAllDemandesWithGaranties();
    }

    // Nombre de demandes pour un jour donné
    getCountForDate(dateGroup: string): number {
        return this.filteredDemandes().filter(d => d.dateGroup === dateGroup).length;
    }

    // Montant total pour un jour donné
    getTotalMontantForDate(dateGroup: string): number {
        return this.filteredDemandes()
            .filter(d => d.dateGroup === dateGroup)
            .reduce((total: number, d: any) => total + (d.montantDemande || 0), 0);
    }

    // Formater la date du groupe en français
    formatDateGroup(dateGroup: string): string {
        const date = new Date(dateGroup + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const groupDate = new Date(date);
        groupDate.setHours(0, 0, 0, 0);

        if (groupDate.getTime() === today.getTime()) {
            return "Aujourd'hui";
        } else if (groupDate.getTime() === yesterday.getTime()) {
            return 'Hier';
        }

        const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('fr-FR', options);
    }

    // Obtenir le nombre de garanties
    getNombreGaranties(demande: any): number {
        return demande.garanties ? demande.garanties.length : 0;
    }

    // Vérifier si la demande a des garanties
    hasGaranties(demande: any): boolean {
        return demande.garanties && demande.garanties.length > 0;
    }

    // Formater le montant de la demande
    formatMontant(montant: number): string {
        if (!montant) return '0 GNF';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'GNF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(montant);
    }

    // Obtenir les informations de l'utilisateur
    getUserRole(): string {
        return this.state().userInfo?.role || 'N/A';
    }

    getUserName(): string {
        const user = this.state().userInfo;
        if (user) {
            return user.name || user.nom || user.username || 'Utilisateur';
        }
        return 'Utilisateur';
    }

    getUserAgenceName(): string {
        return this.state().userInfo?.agenceName || this.state().userInfo?.agence_name || 'N/A';
    }

    getUserPointVenteName(): string {
        return this.state().userInfo?.pointVenteName || this.state().userInfo?.point_vente_name || 'N/A';
    }

    /**
     * Obtenir un tooltip avec le détail des garanties
     */
    getGarantiesTooltip(garanties: any[]): string {
        if (!garanties || garanties.length === 0) return 'Aucune garantie';

        return garanties.map((g) => `${g.typeGarantie}: ${this.formatMontant(g.valeurGarantie)}`).join(' | ');
    }

    /**
     * Calculer le montant total des demandes filtrées
     */
    calculateTotalMontant(): number {
        const demandes = this.filteredDemandes();
        if (!demandes || demandes.length === 0) return 0;
        return demandes.reduce((total, d) => total + (d.montantDemande || 0), 0);
    }

    /**
     * Calculer le total des garanties des demandes filtrées
     */
    calculateTotalAllGaranties(): number {
        const demandes = this.filteredDemandes();
        if (!demandes || demandes.length === 0) return 0;
        return demandes.reduce((total, d) => {
            if (d.garanties && d.garanties.length > 0) {
                return total + d.garanties.reduce((sum: number, g: any) => sum + (g.valeurGarantie || 0), 0);
            }
            return total;
        }, 0);
    }
}
