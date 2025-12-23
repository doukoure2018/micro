import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnChanges, SimpleChanges, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PersonnePhysique } from '@/interface/personnePhysique';
import { UserService } from '@/service/user.service';

@Component({
    selector: 'app-societariat-detail-ps',
    imports: [CommonModule, TableModule, ButtonModule],
    templateUrl: './societariat-detail-ps.component.html',
    styleUrl: './societariat-detail-ps.component.scss'
})
export class SocietariatDetailPsComponent implements OnChanges {
    @Input() pointCode?: string;
    @Input() pointLibele?: string;

    private userService = inject(UserService);
    private route = inject(ActivatedRoute);

    state = signal<{
        loading: boolean;
        items: PersonnePhysique[];
        error?: string;
        statut?: string | null;
    }>({
        loading: false,
        items: [],
        error: undefined,
        statut: null
    });

    isLoading = computed(() => this.state().loading);
    items = computed(() => this.state().items);
    error = computed(() => this.state().error);
    statut = computed(() => this.state().statut);

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

    load(statut: string | null): void {
        if (!this.pointCode) {
            this.state.update((s) => ({ ...s, error: 'Code point de service manquant' }));
            return;
        }

        this.state.update((s) => ({ ...s, loading: true, error: undefined, statut }));
        this.userService.getCorrectionsByPointVente$(this.pointCode, statut || undefined).subscribe({
            next: (response) => {
                const items = (response.data?.corrections || []).map((item) => ({
                    ...item,
                    createdAt:
                        Array.isArray(item.createdAt) && item.createdAt.length >= 3
                            ? new Date(
                                  item.createdAt[0],
                                  (item.createdAt[1] || 1) - 1,
                                  item.createdAt[2] || 1,
                                  item.createdAt[3] || 0,
                                  item.createdAt[4] || 0,
                                  item.createdAt[5] || 0,
                                  item.createdAt[6] || 0
                              ).toISOString()
                            : item.createdAt
                }));
                this.state.update((s) => ({ ...s, items, loading: false }));
            },
            error: (err: HttpErrorResponse) => {
                const message = err.error?.message || 'Erreur lors du chargement des corrections.';
                this.state.update((s) => ({ ...s, loading: false, error: message }));
            }
        });
    }

    filterAll(): void {
        this.load(null);
    }

    filterAttente(): void {
        this.load('EN_ATTENTE');
    }

    filterRejete(): void {
        this.load('REJETE');
    }

    filterValide(): void {
        this.load('VALIDE');
    }
}
