import { ArreteCaisse } from '@/interface/arrete-caisse';
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
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

interface ComponentState {
    arretes: ArreteCaisse[];
    loading: boolean;
    message: string | undefined;
    error: string | undefined;
    viewMode: 'all' | 'latest';
}

interface FilterState {
    delegation: string;
    agence: string;
    pointvente: string;
    statut: string;
    dateDebut: string; // ✅ Changed to string for native input
    dateFin: string; // ✅ Changed to string for native input
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
        loading: false,
        message: undefined,
        error: undefined,
        viewMode: 'all'
    });

    // State des filtres
    filters = signal<FilterState>({
        delegation: '',
        agence: '',
        pointvente: '',
        statut: '',
        dateDebut: '',
        dateFin: '',
        globalFilter: ''
    });

    // Options pour les dropdowns
    viewModeOptions = [
        { label: 'Tous les arrêtés', value: 'all' },
        { label: 'Derniers par point de vente', value: 'latest' }
    ];

    statutOptions = [
        { label: 'Tous', value: '' },
        { label: 'En cours', value: 'ENCOURS' },
        { label: 'Validé', value: 'VALIDE' }
    ];

    // Computed: Liste des délégations uniques
    delegations = computed(() => {
        const arretes = this.state().arretes;
        const unique = [...new Set(arretes.map((a) => a.delegationNom).filter((d): d is string => d !== null))];
        return [{ label: 'Toutes', value: '' }, ...unique.sort().map((d) => ({ label: d, value: d }))];
    });

    // Computed: Liste des agences uniques
    agences = computed(() => {
        const arretes = this.state().arretes;
        const unique = [...new Set(arretes.map((a) => a.agenceNom).filter((a): a is string => a !== null))];
        return [{ label: 'Toutes', value: '' }, ...unique.sort().map((a) => ({ label: a, value: a }))];
    });

    // Computed: Liste des points de vente uniques
    pointventes = computed(() => {
        const arretes = this.state().arretes;
        const unique = [...new Set(arretes.map((a) => a.pointventeNom).filter((p): p is string => p !== null))];
        return [{ label: 'Tous', value: '' }, ...unique.sort().map((p) => ({ label: p, value: p }))];
    });

    // Computed: Arrêtés filtrés
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

    // Computed: Statistiques
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
        this.loadData();
    }

    loadData(): void {
        this.state.update((s) => ({ ...s, loading: true, error: undefined }));

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

                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: `${arretes.length} arrêté(s) chargé(s)`,
                    life: 3000
                });
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
        this.loadData();
    }

    updateFilter(key: keyof FilterState, value: any): void {
        this.filters.update((f) => ({ ...f, [key]: value }));
    }

    resetFilters(): void {
        this.filters.set({
            delegation: '',
            agence: '',
            pointvente: '',
            statut: '',
            dateDebut: '',
            dateFin: '',
            globalFilter: ''
        });
    }

    refresh(): void {
        this.loadData();
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

    formatMontant(montant: number): string {
        return this.userService.formatMontant(montant);
    }

    getStatusSeverity(statut: string): 'success' | 'warn' | 'danger' | 'info' | 'secondary' | 'contrast' | undefined {
        return statut === 'VALIDE' ? 'success' : 'warn';
    }

    getStatusLabel(statut: string): string {
        return statut === 'VALIDE' ? 'Validé' : 'En cours';
    }

    exportToExcel(): void {
        this.messageService.add({
            severity: 'info',
            summary: 'Export',
            detail: 'Fonctionnalité en cours de développement',
            life: 3000
        });
    }

    trackByArrete(index: number, arrete: ArreteCaisse): number {
        return arrete.id;
    }
}
