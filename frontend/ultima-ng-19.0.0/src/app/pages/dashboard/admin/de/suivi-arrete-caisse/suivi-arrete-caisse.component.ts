import { ArreteCaisse, EtatPointVente, SituationPointVente } from '@/interface/arrete-caisse';
import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import * as XLSX from 'xlsx';

type ViewMode = 'situation' | 'all' | 'latest';

interface ComponentState {
    arretes: ArreteCaisse[];
    situation: SituationPointVente[];
    dateReference: string | number[] | null;
    dateLimite: string | number[] | null;
    loading: boolean;
    message: string | undefined;
    error: string | undefined;
    viewMode: ViewMode;
}

interface FilterState {
    delegation: string;
    agence: string;
    pointvente: string;
    statut: string;
    etat: string;
    dateDebut: string;
    dateFin: string;
    globalFilter: string;
}

@Component({
    selector: 'app-suivi-arrete-caisse',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        TagModule,
        ButtonModule,
        ProgressSpinnerModule,
        ProgressBarModule,
        MessageModule,
        CardModule,
        BadgeModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        TooltipModule,
        DropdownModule,
        SelectButtonModule,
        ToastModule
    ],
    templateUrl: './suivi-arrete-caisse.component.html',
    styleUrl: './suivi-arrete-caisse.component.scss',
    providers: [MessageService]
})
export class SuiviArreteCaisseComponent implements OnInit {
    // Services
    private userService = inject(UserService);
    private destroyRef = inject(DestroyRef);
    private messageService = inject(MessageService);

    // State principal
    state = signal<ComponentState>({
        arretes: [],
        situation: [],
        dateReference: null,
        dateLimite: null,
        loading: false,
        message: undefined,
        error: undefined,
        viewMode: 'situation'
    });

    // State des filtres
    filters = signal<FilterState>({
        delegation: '',
        agence: '',
        pointvente: '',
        statut: '',
        etat: '',
        dateDebut: '',
        dateFin: '',
        globalFilter: ''
    });

    // Options pour les dropdowns
    viewModeOptions = [
        { label: 'Situation du jour', value: 'situation' },
        { label: 'Tous les arrêtés', value: 'all' },
        { label: 'Derniers par point de vente', value: 'latest' }
    ];

    statutOptions = [
        { label: 'Tous', value: '' },
        { label: 'En cours', value: 'ENCOURS' },
        { label: 'Validé', value: 'VALIDE' }
    ];

    etatOptions = [
        { label: 'Tous', value: '' },
        { label: 'À jour', value: 'A_JOUR' },
        { label: 'À valider', value: 'A_VALIDER' },
        { label: 'En retard', value: 'EN_RETARD' },
        { label: 'Jamais remonté', value: 'JAMAIS_REMONTE' }
    ];

    // Computed: Liste des délégations uniques (selon la vue active)
    delegations = computed(() => {
        const noms = this.isSituationMode() ? this.state().situation.map((s) => s.delegationNom) : this.state().arretes.map((a) => a.delegationNom);
        const unique = [...new Set(noms.filter((d): d is string => !!d))];
        return [{ label: 'Toutes', value: '' }, ...unique.sort().map((d) => ({ label: d, value: d }))];
    });

    // Computed: Liste des agences uniques
    agences = computed(() => {
        const noms = this.isSituationMode() ? this.state().situation.map((s) => s.agenceNom) : this.state().arretes.map((a) => a.agenceNom);
        const unique = [...new Set(noms.filter((a): a is string => !!a))];
        return [{ label: 'Toutes', value: '' }, ...unique.sort().map((a) => ({ label: a, value: a }))];
    });

    // Computed: Liste des points de vente uniques
    pointventes = computed(() => {
        const noms = this.isSituationMode() ? this.state().situation.map((s) => s.pointventeNom) : this.state().arretes.map((a) => a.pointventeNom);
        const unique = [...new Set(noms.filter((p): p is string => !!p))];
        return [{ label: 'Tous', value: '' }, ...unique.sort().map((p) => ({ label: p, value: p }))];
    });

    isSituationMode = computed(() => this.state().viewMode === 'situation');

    // Computed: Situation filtrée (un point de vente par ligne)
    filteredSituation = computed(() => {
        const situation = this.state().situation;
        const f = this.filters();

        return situation.filter((s) => {
            if (f.delegation && s.delegationNom !== f.delegation) return false;
            if (f.agence && s.agenceNom !== f.agence) return false;
            if (f.pointvente && s.pointventeNom !== f.pointvente) return false;
            if (f.etat && s.etat !== f.etat) return false;

            if (f.globalFilter) {
                const search = f.globalFilter.toLowerCase();
                const matchDelegation = s.delegationNom?.toLowerCase().includes(search);
                const matchAgence = s.agenceNom?.toLowerCase().includes(search);
                const matchPointvente = s.pointventeNom?.toLowerCase().includes(search);
                const matchCode = s.pointventeCode?.toLowerCase().includes(search);
                if (!matchDelegation && !matchAgence && !matchPointvente && !matchCode) return false;
            }

            return true;
        });
    });

    // Computed: Arrêtés filtrés (vues historique)
    filteredArretes = computed(() => {
        const arretes = this.state().arretes;
        const f = this.filters();

        return arretes.filter((arrete) => {
            // Filtre délégation
            if (f.delegation && arrete.delegationNom !== f.delegation) return false;

            // Filtre agence
            if (f.agence && arrete.agenceNom !== f.agence) return false;

            // Filtre point de vente
            if (f.pointvente && arrete.pointventeNom !== f.pointvente) return false;

            // Filtre statut
            if (f.statut && arrete.statut !== f.statut) return false;

            // Filtre date début
            if (f.dateDebut) {
                const dateDebut = new Date(f.dateDebut);
                const dateArrete = this.userService.parseDate(arrete.dateArreteCaisse);
                if (dateArrete && dateArrete < dateDebut) return false;
            }

            // Filtre date fin
            if (f.dateFin) {
                const dateFin = new Date(f.dateFin);
                const dateArrete = this.userService.parseDate(arrete.dateArreteCaisse);
                if (dateArrete && dateArrete > dateFin) return false;
            }

            // Filtre global (recherche texte)
            if (f.globalFilter) {
                const search = f.globalFilter.toLowerCase();
                const matchDelegation = arrete.delegationNom?.toLowerCase().includes(search);
                const matchAgence = arrete.agenceNom?.toLowerCase().includes(search);
                const matchPointvente = arrete.pointventeNom?.toLowerCase().includes(search);
                const matchMontant = arrete.montant.toString().includes(search);
                if (!matchDelegation && !matchAgence && !matchPointvente && !matchMontant) return false;
            }

            return true;
        });
    });

    // Computed: Statistiques de conformité (vue situation)
    situationStats = computed(() => {
        const situation = this.state().situation;
        const count = (etat: EtatPointVente) => situation.filter((s) => s.etat === etat).length;

        const aJour = count('A_JOUR');
        const total = situation.length;

        return {
            aJour,
            aValider: count('A_VALIDER'),
            enRetard: count('EN_RETARD'),
            jamaisRemonte: count('JAMAIS_REMONTE'),
            total,
            tauxConformite: total > 0 ? Math.round((aJour / total) * 100) : 0
        };
    });

    // Computed: Statistiques (vues historique)
    stats = computed(() => {
        const arretes = this.state().arretes;

        const encours = arretes.filter((a) => a.statut === 'ENCOURS');
        const valide = arretes.filter((a) => a.statut === 'VALIDE');

        return {
            totalEncours: encours.length,
            montantEncours: encours.reduce((sum, a) => sum + a.montant, 0),
            totalValide: valide.length,
            montantValide: valide.reduce((sum, a) => sum + a.montant, 0),
            total: arretes.length,
            montantTotal: arretes.reduce((sum, a) => sum + a.montant, 0)
        };
    });

    ngOnInit(): void {
        this.loadSituation();
        this.loadArretes(true);
    }

    loadSituation(): void {
        this.state.update((s) => ({ ...s, loading: true, error: undefined }));

        this.userService
            .getSituationArretesPointvente$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    const situation = response.data.situation || [];

                    this.state.update((s) => ({
                        ...s,
                        situation,
                        dateReference: response.data.dateReference || null,
                        dateLimite: response.data.dateLimite || null,
                        loading: false,
                        message: response.message,
                        error: undefined
                    }));

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: `Situation de ${situation.length} point(s) de vente chargée`,
                        life: 3000
                    });
                },
                error: (error) => {
                    console.error('Erreur chargement situation:', error);
                    this.state.update((s) => ({
                        ...s,
                        loading: false,
                        error: 'Erreur lors du chargement de la situation'
                    }));

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger la situation des points de vente',
                        life: 5000
                    });
                }
            });
    }

    loadArretes(silent = false): void {
        if (!silent) {
            this.state.update((s) => ({ ...s, loading: true, error: undefined }));
        }

        const observable = this.state().viewMode === 'latest' ? this.userService.getLatestArretesByPointvente$() : this.userService.getAllArretesForSuivi$();

        observable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (response: IResponse) => {
                const arretes = response.data.arretes || [];

                this.state.update((s) => ({
                    ...s,
                    arretes,
                    loading: false,
                    message: response.message,
                    error: undefined
                }));

                if (!silent) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: `${arretes.length} arrêté(s) chargé(s)`,
                        life: 3000
                    });
                }
            },
            error: (error) => {
                console.error('Erreur chargement arrêtés:', error);
                this.state.update((s) => ({
                    ...s,
                    loading: false,
                    error: 'Erreur lors du chargement des données'
                }));

                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible de charger les données',
                    life: 5000
                });
            }
        });
    }

    onViewModeChange(event: any): void {
        this.state.update((s) => ({ ...s, viewMode: event.value }));
        this.refresh();
    }

    updateFilter(key: keyof FilterState, value: any): void {
        this.filters.update((f) => ({ ...f, [key]: value }));
    }

    // Filtre rapide par état via les cartes KPI (clic = filtrer, re-clic = annuler)
    toggleEtatFilter(etat: EtatPointVente): void {
        this.filters.update((f) => ({ ...f, etat: f.etat === etat ? '' : etat }));
    }

    resetFilters(): void {
        this.filters.set({
            delegation: '',
            agence: '',
            pointvente: '',
            statut: '',
            etat: '',
            dateDebut: '',
            dateFin: '',
            globalFilter: ''
        });
    }

    refresh(): void {
        if (this.isSituationMode()) {
            this.loadSituation();
        } else {
            this.loadArretes();
        }
    }

    openDocument(url: string): void {
        window.open(url, '_blank');
    }

    formatDate(date: string | number[] | null): string {
        return this.userService.formatDate(date);
    }

    formatDateTime(date: string | number[] | null): string {
        return this.userService.formatDateTime(date);
    }

    formatMontant(montant: number | null): string {
        return montant !== null && montant !== undefined ? this.userService.formatMontant(montant) : '-';
    }

    getStatusSeverity(statut: string): 'success' | 'warn' | 'danger' | 'info' | 'secondary' | 'contrast' | undefined {
        return statut === 'VALIDE' ? 'success' : 'warn';
    }

    getStatusLabel(statut: string): string {
        return statut === 'VALIDE' ? 'Validé' : 'En cours';
    }

    getEtatSeverity(etat: EtatPointVente): 'success' | 'warn' | 'danger' | 'info' | 'secondary' | 'contrast' | undefined {
        switch (etat) {
            case 'A_JOUR':
                return 'success';
            case 'A_VALIDER':
                return 'warn';
            case 'EN_RETARD':
                return 'danger';
            default:
                return 'secondary';
        }
    }

    getEtatLabel(etat: EtatPointVente): string {
        switch (etat) {
            case 'A_JOUR':
                return 'À jour';
            case 'A_VALIDER':
                return 'À valider';
            case 'EN_RETARD':
                return 'En retard';
            default:
                return 'Jamais remonté';
        }
    }

    exportToExcel(): void {
        const wb = XLSX.utils.book_new();

        const situationRows = this.filteredSituation().map((s) => ({
            'Délégation': s.delegationNom || '',
            'Agence': s.agenceNom || '',
            'Point de vente': s.pointventeNom || '',
            'Code PV': s.pointventeCode || '',
            'État': this.getEtatLabel(s.etat),
            'Jours de retard': s.joursRetard ?? '',
            'Dernier arrêté': s.dateArreteCaisse ? this.formatDate(s.dateArreteCaisse) : '',
            'Montant': s.montant ?? '',
            'Statut': s.statut ? this.getStatusLabel(s.statut) : '',
            'Date remontée': s.dateRemonte ? this.formatDateTime(s.dateRemonte) : '',
            'Agent': [s.nomUser, s.prenomUser].filter(Boolean).join(' ')
        }));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(situationRows), 'Situation');

        const historiqueRows = this.filteredArretes().map((a) => ({
            'ID': a.id,
            'Délégation': a.delegationNom || '',
            'Agence': a.agenceNom || '',
            'Point de vente': a.pointventeNom || '',
            'Montant': a.montant,
            'Date arrêté': this.formatDate(a.dateArreteCaisse),
            'Date remontée': a.dateRemonte ? this.formatDateTime(a.dateRemonte) : '',
            'Statut': this.getStatusLabel(a.statut),
            'Agent': [a.nomUser, a.prenomUser].filter(Boolean).join(' ')
        }));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(historiqueRows), 'Historique');

        const dateRef = this.userService.parseDate(this.state().dateReference) || new Date();
        const suffix = dateRef.toISOString().slice(0, 10);
        XLSX.writeFile(wb, `arretes_caisse_${suffix}.xlsx`);

        this.messageService.add({
            severity: 'success',
            summary: 'Export',
            detail: `Fichier Excel généré (${situationRows.length} point(s) de vente, ${historiqueRows.length} arrêté(s))`,
            life: 3000
        });
    }

    trackByArrete(index: number, arrete: ArreteCaisse): number {
        return arrete.id;
    }

    trackBySituation(index: number, situation: SituationPointVente): number {
        return situation.pointventeId;
    }
}
