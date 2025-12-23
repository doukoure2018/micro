import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnChanges, SimpleChanges, OnInit, computed, inject, signal, LOCALE_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { PersonnePhysique } from '@/interface/personnePhysique';
import { UserService } from '@/service/user.service';

// Register French locale
registerLocaleData(localeFr);

@Component({
    selector: 'app-societariat-detail-ps',
    imports: [CommonModule, TableModule, ButtonModule, TooltipModule],
    templateUrl: './societariat-detail-ps.component.html',
    styleUrl: './societariat-detail-ps.component.scss',
    providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }]
})
export class SocietariatDetailPsComponent implements OnChanges, OnInit {
    @Input() pointCode?: string;
    @Input() pointLibele?: string;

    private userService = inject(UserService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    state = signal<{
        loading: boolean;
        allItems: PersonnePhysique[];
        filteredItems: PersonnePhysique[];
        error?: string;
        statut?: string | null;
    }>({
        loading: false,
        allItems: [],
        filteredItems: [],
        error: undefined,
        statut: null
    });

    isLoading = computed(() => this.state().loading);
    items = computed(() => this.state().filteredItems);
    allItems = computed(() => this.state().allItems);
    error = computed(() => this.state().error);
    statut = computed(() => this.state().statut);

    // Computed counts
    countAll = computed(() => this.allItems().length);
    countEnAttente = computed(() => this.allItems().filter((i) => i.correctionStatut === 'EN_ATTENTE').length);
    countRejete = computed(() => this.allItems().filter((i) => i.correctionStatut === 'REJETE').length);
    countValide = computed(() => this.allItems().filter((i) => i.correctionStatut === 'VALIDE').length);

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['pointCode'] && this.pointCode) {
            this.load(null);
        }
    }

    ngOnInit(): void {
        // Chargement direct via route (query params)
        this.route.queryParamMap.subscribe((params) => {
            const code = params.get('code');
            const libele = params.get('libele');
            if (code) {
                this.pointCode = code;
                this.pointLibele = libele || this.pointLibele;
                this.load(null);
            }
        });
    }

    load(statut: string | null, forceReload = false): void {
        if (!this.pointCode) {
            this.state.update((s) => ({ ...s, error: 'Code point de service manquant' }));
            return;
        }

        // If we already have all items and just need to filter, do it locally
        if (!forceReload && this.allItems().length > 0) {
            this.applyFilter(statut);
            return;
        }

        this.state.update((s) => ({ ...s, loading: true, error: undefined, statut }));
        // Always load all items (no filter) to have counts
        this.userService.getCorrectionsByPointVente$(this.pointCode, undefined).subscribe({
            next: (response) => {
                const allItems = (response.data?.corrections || []).map((item) => ({
                    ...item,
                    createdAt:
                        Array.isArray(item.createdAt) && item.createdAt.length >= 3
                            ? new Date(item.createdAt[0], (item.createdAt[1] || 1) - 1, item.createdAt[2] || 1, item.createdAt[3] || 0, item.createdAt[4] || 0, item.createdAt[5] || 0, item.createdAt[6] || 0).toISOString()
                            : item.createdAt
                }));
                const filteredItems = statut ? allItems.filter((i) => i.correctionStatut === statut) : allItems;
                this.state.update((s) => ({ ...s, allItems, filteredItems, loading: false, statut }));
            },
            error: (err: HttpErrorResponse) => {
                const message = err.error?.message || 'Erreur lors du chargement des corrections.';
                this.state.update((s) => ({ ...s, loading: false, error: message }));
            }
        });
    }

    applyFilter(statut: string | null): void {
        const allItems = this.allItems();
        const filteredItems = statut ? allItems.filter((i) => i.correctionStatut === statut) : allItems;
        this.state.update((s) => ({ ...s, filteredItems, statut }));
    }

    filterAll(): void {
        this.applyFilter(null);
    }

    filterAttente(): void {
        this.applyFilter('EN_ATTENTE');
    }

    filterRejete(): void {
        this.applyFilter('REJETE');
    }

    filterValide(): void {
        this.applyFilter('VALIDE');
    }

    refresh(): void {
        this.load(this.statut() ?? null, true);
    }

    goBack(): void {
        this.router.navigate(['/dashboards']);
    }
}
