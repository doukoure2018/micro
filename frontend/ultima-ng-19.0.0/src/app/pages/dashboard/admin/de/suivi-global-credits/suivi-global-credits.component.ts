import { IResponse } from '@/interface/response';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, OnInit, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

interface ProfilCount {
    label: string;
    value: string;
    count: number;
    icon: string;
    color: string;
    bgColor: string;
}

@Component({
    selector: 'app-suivi-global-credits',
    standalone: true,
    imports: [
        CommonModule, FormsModule, TableModule, ButtonModule, TagModule, ToastModule,
        BadgeModule, IconFieldModule, InputIconModule, InputTextModule,
        ProgressSpinnerModule, ChipModule, SelectModule, DatePickerModule, TooltipModule
    ],
    templateUrl: './suivi-global-credits.component.html',
    providers: [MessageService]
})
export class SuiviGlobalCreditsComponent implements OnInit {
    @Input() user?: IUser;
    /**
     * Perimetre de la vue : 'DE' = national (endpoint suivi-global-de, comportement historique),
     * 'RESEAU' = reseau de l'appelant (DA = son agence, DR = sa delegation), incluant les
     * dossiers en attente DG, rejetes DG et valides DE/DG.
     */
    @Input() scope: 'DE' | 'RESEAU' = 'DE';
    @Input() set creditTypeFilter(value: 'ALL' | 'PETIT' | 'GROS' | undefined) {
        this._creditTypeFilter.set(value || 'ALL');
    }

    /** Seuil entre petit et gros credit (50M GNF) */
    private static readonly SEUIL_PETIT_GROS_GNF = 50_000_000;

    /**
     * Objectifs SLA (en jours) par niveau responsable de l'attente courante.
     * Au-dela de la cible : "Vigilance" ; au-dela du double : "En retard".
     * Valeurs a ajuster selon la politique interne.
     */
    static readonly SLA_JOURS: Record<string, number> = {
        AGENT: 5,   // instruction / correction par l'agent de credit
        DA: 3,      // validation Directeur d'Agence
        DR: 3,      // validation Delegue Regional
        DE: 3,      // validation Direction de l'Exploitation
        DG: 5       // visa Direction Generale (credits > 100M)
    };

    allDemandes = signal<any[]>([]);
    loading = signal(false);
    selectedProfil = signal<string>('ALL');
    slaFilter = signal<'ALL' | 'RETARD' | 'VIGILANCE'>('ALL');
    private _creditTypeFilter = signal<'ALL' | 'PETIT' | 'GROS'>('ALL');

    // Filtres
    dateDebut = signal<Date | null>(null);
    dateFin = signal<Date | null>(null);
    selectedDelegation = signal<string | null>(null);
    selectedAgence = signal<string | null>(null);
    selectedPointvente = signal<string | null>(null);

    private userService = inject(UserService);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private messageService = inject(MessageService);

    profilOptions = [
        { label: 'Tous les profils', value: 'ALL' },
        { label: 'Agent Credit', value: 'AGENT_CREDIT' },
        { label: 'Directeur Agence (DA)', value: 'DA' },
        { label: 'Delegue Regional (DR)', value: 'DR' },
        { label: 'En correction (AC)', value: 'CORRECTION_AC' },
        { label: 'En correction (DR)', value: 'CORRECTION_DR' },
        { label: 'En correction (DE)', value: 'CORRECTION_DE' }
    ];

    // Options dynamiques extraites des donnees
    delegationOptions = computed(() => {
        const unique = [...new Set(this.allDemandes().map(d => d.delegationLibele).filter(Boolean))].sort();
        return [{ label: 'Toutes', value: null }, ...unique.map(d => ({ label: d, value: d }))];
    });

    agenceOptions = computed(() => {
        let demandes = this.allDemandes();
        const del = this.selectedDelegation();
        if (del) {
            demandes = demandes.filter(d => d.delegationLibele === del);
        }
        const unique = [...new Set(demandes.map(d => d.agenceLibele).filter(Boolean))].sort();
        return [{ label: 'Toutes', value: null }, ...unique.map(a => ({ label: a, value: a }))];
    });

    pointventeOptions = computed(() => {
        let demandes = this.allDemandes();
        const del = this.selectedDelegation();
        const ag = this.selectedAgence();
        if (del) demandes = demandes.filter(d => d.delegationLibele === del);
        if (ag) demandes = demandes.filter(d => d.agenceLibele === ag);
        const unique = [...new Set(demandes.map(d => d.pointventeLibele).filter(Boolean))].sort();
        return [{ label: 'Tous', value: null }, ...unique.map(p => ({ label: p, value: p }))];
    });

    // Les compteurs se basent sur les demandes filtrees
    baseFilteredDemandes = computed(() => {
        let demandes = this.allDemandes();

        const dateDebut = this.dateDebut();
        const dateFin = this.dateFin();
        const delegation = this.selectedDelegation();
        const agence = this.selectedAgence();
        const pointvente = this.selectedPointvente();

        if (dateDebut) {
            const start = new Date(dateDebut);
            start.setHours(0, 0, 0, 0);
            demandes = demandes.filter(d => new Date(d.createdAt) >= start);
        }
        if (dateFin) {
            const end = new Date(dateFin);
            end.setHours(23, 59, 59, 999);
            demandes = demandes.filter(d => new Date(d.createdAt) <= end);
        }
        if (delegation) {
            demandes = demandes.filter(d => d.delegationLibele === delegation);
        }
        if (agence) {
            demandes = demandes.filter(d => d.agenceLibele === agence);
        }
        if (pointvente) {
            demandes = demandes.filter(d => d.pointventeLibele === pointvente);
        }

        // Filtre type de credit (petit / gros) base sur le seuil de 50M GNF
        const creditType = this._creditTypeFilter();
        if (creditType === 'PETIT') {
            demandes = demandes.filter(d => Number(d.montantDemande || 0) < SuiviGlobalCreditsComponent.SEUIL_PETIT_GROS_GNF);
        } else if (creditType === 'GROS') {
            demandes = demandes.filter(d => Number(d.montantDemande || 0) >= SuiviGlobalCreditsComponent.SEUIL_PETIT_GROS_GNF);
        }

        return demandes;
    });

    profilCounts = computed<ProfilCount[]>(() => {
        const demandes = this.baseFilteredDemandes();
        return [
            {
                label: 'Agent Credit',
                value: 'AGENT_CREDIT',
                count: demandes.filter(d => ['NOUVEAU', 'SELECTION', 'APPROVED'].includes(d.validationState)).length,
                icon: 'pi pi-user',
                color: 'text-blue-700',
                bgColor: 'bg-blue-50 border-blue-200'
            },
            {
                label: 'DA',
                value: 'DA',
                count: demandes.filter(d => d.validationState === 'APPROVED').length,
                icon: 'pi pi-building',
                color: 'text-green-700',
                bgColor: 'bg-green-50 border-green-200'
            },
            {
                label: 'DR',
                value: 'DR',
                count: demandes.filter(d => d.validationState === 'VALIDATED_DA').length,
                icon: 'pi pi-globe',
                color: 'text-orange-700',
                bgColor: 'bg-orange-50 border-orange-200'
            },
            {
                label: 'Correction AC',
                value: 'CORRECTION_AC',
                count: demandes.filter(d => d.validationState === 'CORRECTION').length,
                icon: 'pi pi-pencil',
                color: 'text-red-700',
                bgColor: 'bg-red-50 border-red-200'
            },
            {
                label: 'Correction DR',
                value: 'CORRECTION_DR',
                count: demandes.filter(d => d.validationState === 'CORRECTION_DR').length,
                icon: 'pi pi-pencil',
                color: 'text-orange-700',
                bgColor: 'bg-orange-50 border-orange-200'
            },
            {
                label: 'Correction DE',
                value: 'CORRECTION_DE',
                count: demandes.filter(d => d.validationState === 'CORRECTION_DE').length,
                icon: 'pi pi-pencil',
                color: 'text-purple-700',
                bgColor: 'bg-purple-50 border-purple-200'
            },
            {
                label: 'En attente DE',
                value: 'VALIDATED_DR',
                count: demandes.filter(d => d.validationState === 'VALIDATED_DR').length,
                icon: 'pi pi-check-circle',
                color: 'text-indigo-700',
                bgColor: 'bg-indigo-50 border-indigo-200'
            },
            {
                label: 'En attente visa DG',
                value: 'PENDING_DG',
                count: demandes.filter(d => d.validationState === 'PENDING_DG').length,
                icon: 'pi pi-crown',
                color: 'text-yellow-700',
                bgColor: 'bg-yellow-50 border-yellow-200'
            },
            {
                label: 'Validés (DE/DG)',
                value: 'VALIDES',
                count: demandes.filter(d => d.validationState === 'VALIDATED_FINAL').length,
                icon: 'pi pi-verified',
                color: 'text-teal-700',
                bgColor: 'bg-teal-50 border-teal-200'
            },
            {
                label: 'Rejetés DG',
                value: 'REJETE_DG',
                count: demandes.filter(d => d.validationState === 'REJETE_DG').length,
                icon: 'pi pi-times-circle',
                color: 'text-red-700',
                bgColor: 'bg-red-50 border-red-200'
            }
        ];
    });

    profilCountsRow1 = computed(() => {
        return this.profilCounts().filter(p => ['AGENT_CREDIT', 'DA', 'DR'].includes(p.value));
    });

    profilCountsRow2 = computed(() => {
        return this.profilCounts().filter(p => ['CORRECTION_AC', 'CORRECTION_DR', 'CORRECTION_DE', 'VALIDATED_DR'].includes(p.value));
    });

    /** Ligne supplementaire en mode RESEAU : dossiers au niveau DG et issue finale. */
    profilCountsRow3 = computed(() => {
        if (this.scope !== 'RESEAU') return [];
        return this.profilCounts().filter(p => ['PENDING_DG', 'VALIDES', 'REJETE_DG'].includes(p.value));
    });

    filteredDemandes = computed(() => {
        const profil = this.selectedProfil();
        let demandes = this.baseFilteredDemandes();

        if (profil !== 'ALL') {
            const stateMap: Record<string, string[]> = {
                AGENT_CREDIT: ['NOUVEAU', 'SELECTION', 'APPROVED'],
                DA: ['APPROVED'],
                DR: ['VALIDATED_DA'],
                CORRECTION_AC: ['CORRECTION'],
                CORRECTION_DR: ['CORRECTION_DR'],
                CORRECTION_DE: ['CORRECTION_DE'],
                VALIDATED_DR: ['VALIDATED_DR'],
                PENDING_DG: ['PENDING_DG'],
                VALIDES: ['VALIDATED_FINAL'],
                REJETE_DG: ['REJETE_DG']
            };
            const states = stateMap[profil] || [];
            demandes = demandes.filter(d => states.includes(d.validationState));
        }

        const sla = this.slaFilter();
        if (sla !== 'ALL') {
            demandes = demandes.filter(d => this.slaStatut(d) === sla);
        }
        return demandes;
    });

    // Compteurs SLA (sur le perimetre filtre, tous profils confondus)
    nbRetard = computed(() => this.baseFilteredDemandes().filter(d => this.slaStatut(d) === 'RETARD').length);
    nbVigilance = computed(() => this.baseFilteredDemandes().filter(d => this.slaStatut(d) === 'VIGILANCE').length);

    hasActiveFilters = computed(() => {
        return this.dateDebut() !== null || this.dateFin() !== null ||
            this.selectedDelegation() !== null || this.selectedAgence() !== null ||
            this.selectedPointvente() !== null || this.slaFilter() !== 'ALL';
    });

    /** Le filtre Delegation n'a de sens qu'en vue nationale. */
    get showDelegationFilter(): boolean {
        return this.scope !== 'RESEAU';
    }

    /** Le filtre Agence est inutile pour un DA (une seule agence : la sienne). */
    get showAgenceFilter(): boolean {
        return this.scope !== 'RESEAU' || this.user?.role === 'DR';
    }

    get titre(): string {
        return this.scope === 'RESEAU' ? 'Suivi des Crédits de mon Réseau' : 'Suivi Global des Credits en Cours';
    }

    ngOnInit(): void {
        this.loadSuiviGlobal();
    }

    private loadSuiviGlobal(): void {
        this.loading.set(true);
        const source$ = this.scope === 'RESEAU' ? this.userService.getSuiviGlobalReseau$() : this.userService.getSuiviGlobalDE$();
        source$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.allDemandes.set(response.data?.workflowDemandes || []);
                    this.loading.set(false);
                },
                error: () => {
                    this.loading.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors du chargement du suivi global', life: 5000 });
                }
            });
    }

    onDateDebutChange(date: Date | null): void {
        this.dateDebut.set(date);
    }

    onDateFinChange(date: Date | null): void {
        this.dateFin.set(date);
    }

    onDelegationChange(value: string | null): void {
        this.selectedDelegation.set(value);
        this.selectedAgence.set(null);
        this.selectedPointvente.set(null);
    }

    onAgenceChange(value: string | null): void {
        this.selectedAgence.set(value);
        this.selectedPointvente.set(null);
    }

    onPointventeChange(value: string | null): void {
        this.selectedPointvente.set(value);
    }

    resetFilters(): void {
        this.dateDebut.set(null);
        this.dateFin.set(null);
        this.selectedDelegation.set(null);
        this.selectedAgence.set(null);
        this.selectedPointvente.set(null);
        this.selectedProfil.set('ALL');
        this.slaFilter.set('ALL');
    }

    filterByProfil(profil: string): void {
        this.selectedProfil.set(profil);
    }

    getProfilLabel(validationState: string): string {
        const labels: Record<string, string> = {
            NOUVEAU: 'Agent Credit',
            SELECTION: 'Agent Credit',
            APPROVED: 'DA (en attente)',
            VALIDATED_DA: 'DR (en attente)',
            VALIDATED_DR: 'DE (en attente)',
            CORRECTION: 'Correction AC',
            CORRECTION_DR: 'Correction DR',
            CORRECTION_DE: 'Correction DE',
            RETOUR_AGENT: 'Renvoyé à l\'agent',
            PENDING_DG: 'DG (en attente)',
            VALIDATED_FINAL: 'Validé',
            REJETE_DG: 'Rejet DG'
        };
        return labels[validationState] || validationState;
    }

    getProfilSeverity(validationState: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
        const severities: Record<string, any> = {
            NOUVEAU: 'secondary',
            SELECTION: 'info',
            APPROVED: 'success',
            VALIDATED_DA: 'warn',
            VALIDATED_DR: 'contrast',
            CORRECTION: 'danger',
            CORRECTION_DR: 'danger',
            CORRECTION_DE: 'danger',
            RETOUR_AGENT: 'danger',
            PENDING_DG: 'warn',
            VALIDATED_FINAL: 'success',
            REJETE_DG: 'danger'
        };
        return severities[validationState] || 'info';
    }

    getEtapeLabel(validationState: string): string {
        const labels: Record<string, string> = {
            NOUVEAU: 'Nouveau (non affecte)',
            SELECTION: 'En selection par AC',
            APPROVED: 'Approuve par AC, en attente DA',
            VALIDATED_DA: 'Valide par DA, en attente DR',
            VALIDATED_DR: 'Valide par DR, en attente DE',
            CORRECTION: 'Rejete par DA, en correction AC',
            CORRECTION_DR: 'Rejete par DR, en correction',
            CORRECTION_DE: 'Rejete par DE, en correction',
            RETOUR_AGENT: 'Renvoye a l\'agent (erreur de destination)',
            PENDING_DG: 'Valide par DE, en attente visa DG',
            VALIDATED_FINAL: 'Credit valide (niveau final atteint)',
            REJETE_DG: 'Rejete par DG, confirmation DE en attente'
        };
        return labels[validationState] || validationState;
    }

    getJoursAttenteSeverity(jours: number): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
        if (jours <= 2) return 'success';
        if (jours <= 5) return 'info';
        if (jours <= 10) return 'warn';
        return 'danger';
    }

    // ==================== SLA (delais cibles par niveau) ====================

    /** Niveau qui detient actuellement le dossier (responsable du delai courant). */
    niveauResponsable(validationState: string): 'AGENT' | 'DA' | 'DR' | 'DE' | 'DG' {
        switch (validationState) {
            case 'APPROVED': return 'DA';        // en attente validation DA
            case 'VALIDATED_DA': return 'DR';    // en attente validation DR
            case 'VALIDATED_DR': return 'DE';    // en attente validation DE
            case 'PENDING_DG': return 'DG';      // en attente visa DG
            case 'REJETE_DG': return 'DE';       // en attente confirmation du rejet par le DE
            default: return 'AGENT';             // NOUVEAU, SELECTION, CORRECTION*, RETOUR_AGENT
        }
    }

    /** Objectif SLA (jours) applicable au dossier selon son niveau courant. */
    slaCible(demande: any): number {
        return SuiviGlobalCreditsComponent.SLA_JOURS[this.niveauResponsable(demande.validationState)] ?? 5;
    }

    /** Statut SLA : OK (<= cible), VIGILANCE (<= 2x cible), RETARD (> 2x cible). */
    slaStatut(demande: any): 'OK' | 'VIGILANCE' | 'RETARD' {
        const cible = this.slaCible(demande);
        const jours = Number(demande.joursAttente || 0);
        if (jours <= cible) return 'OK';
        if (jours <= cible * 2) return 'VIGILANCE';
        return 'RETARD';
    }

    slaSeverity(demande: any): 'success' | 'warn' | 'danger' {
        const s = this.slaStatut(demande);
        return s === 'OK' ? 'success' : s === 'VIGILANCE' ? 'warn' : 'danger';
    }

    slaLabel(demande: any): string {
        const s = this.slaStatut(demande);
        return s === 'OK' ? 'Dans les delais' : s === 'VIGILANCE' ? 'Vigilance' : 'En retard';
    }

    /** Bascule le filtre SLA (clic sur une carte). Re-clic = desactive. */
    toggleSlaFilter(value: 'RETARD' | 'VIGILANCE'): void {
        this.slaFilter.set(this.slaFilter() === value ? 'ALL' : value);
    }

    formatMontantGNF(montant: number): string {
        if (!montant || montant === 0) return '0 GNF';
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'GNF', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(montant);
    }

    onGlobalFilter(table: any, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    viewDemandeDetail(demandeId: number): void {
        this.router.navigate(['/dashboards/credit/individuel/attente/detail', demandeId]);
    }

    refreshData(): void {
        this.loadSuiviGlobal();
        this.messageService.add({ severity: 'info', summary: 'Actualisation', detail: 'Donnees actualisees', life: 2000 });
    }
}
