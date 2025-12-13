// src/app/components/credit-par-delegation/credit-par-delegation.component.ts
import { DelegationCreditDto } from '@/interface/delegation-credit-dto.interface';
import { DemandeIndividuel } from '@/interface/demande-individuel.interface';
import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ProgressSpinner } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

interface ComponentState {
    delegations: DelegationCreditDto[];
    loading: boolean;
    message: string | undefined;
    error: string | undefined;
    totalDemandes: number;
    montantGlobal: number;
}

@Component({
    selector: 'app-credit-par-delegation',
    standalone: true,
    imports: [CommonModule, AccordionModule, TableModule, TagModule, ButtonModule, ProgressSpinner, MessageModule, CardModule, BadgeModule, DividerModule, IconFieldModule, InputIconModule, InputTextModule, TooltipModule, CurrencyPipe, RouterLink],
    templateUrl: './credit-par-delegation.component.html',
    styleUrl: './credit-par-delegation.component.scss',
    providers: [MessageService]
})
export class CreditParDelegationComponent implements OnInit {
    state = signal<ComponentState>({
        delegations: [],
        loading: false,
        message: undefined,
        error: undefined,
        totalDemandes: 0,
        montantGlobal: 0
    });

    private userService = inject(UserService);
    private destroyRef = inject(DestroyRef);

    ngOnInit(): void {
        this.loadCreditParDelegation();
    }

    private loadCreditParDelegation(): void {
        this.state.update((state) => ({ ...state, loading: true, error: undefined }));

        this.userService
            .getListCreditParDelegation$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    const delegations = response.data.listCreditParDelegation || [];

                    // Calculer les totaux
                    const totalDemandes = delegations.reduce((sum, d) => sum + d.totalDemandes, 0);
                    const montantGlobal = delegations.reduce((sum, d) => sum + (d.montantTotal || 0), 0);

                    this.state.update((state) => ({
                        ...state,
                        delegations,
                        totalDemandes,
                        montantGlobal,
                        loading: false,
                        message: response.message,
                        error: undefined
                    }));
                },
                error: (error: string) => {
                    this.state.update((state) => ({
                        ...state,
                        loading: false,
                        message: undefined,
                        error
                    }));
                }
            });
    }

    getStatusLabel(statutDemande: string, validationState: string): string {
        if (statutDemande === 'EN_ATTENTE' && validationState === 'NOUVEAU') {
            return 'NOUVELLE DEMANDE';
        } else if (statutDemande === 'EN_ATTENTE' && validationState === 'SELECTION') {
            return 'SÉLECTION';
        } else if (statutDemande === 'EN_ATTENTE' && validationState === 'APPROVED') {
            return 'EN COURS DE VALIDATION';
        }
        return statutDemande;
    }

    getStatusSeverity(statutDemande: string, validationState: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
        if (statutDemande === 'EN_ATTENTE' && validationState === 'APPROVED') return 'warn';
        if (statutDemande === 'EN_ATTENTE' && validationState === 'NOUVEAU') return 'info';
        if (statutDemande === 'EN_ATTENTE' && validationState === 'SELECTION') return 'secondary';
        if (statutDemande === 'REJECTED') return 'danger';
        if (statutDemande === 'APPROVED') return 'success';
        return undefined;
    }

    getDelegationSeverity(totalDemandes: number): 'success' | 'info' | 'warn' | 'danger' {
        if (totalDemandes >= 10) return 'danger';
        if (totalDemandes >= 5) return 'warn';
        if (totalDemandes >= 1) return 'info';
        return 'success';
    }

    formatDate(date: Date | string | undefined): string {
        if (!date) return '-';
        const d = new Date(date);
        return d.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    refreshData(): void {
        this.loadCreditParDelegation();
    }

    trackByDelegation(index: number, delegation: DelegationCreditDto): number {
        return delegation.delegationId;
    }

    trackByDemande(index: number, demande: DemandeIndividuel): number {
        return demande.demandeIndividuelId || index;
    }
}
