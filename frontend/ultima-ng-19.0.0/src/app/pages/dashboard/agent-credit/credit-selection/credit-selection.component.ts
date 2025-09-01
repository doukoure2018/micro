import { DemandeIndividuel } from '@/interface/demande-individuel.interface';
import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FluidModule } from 'primeng/fluid';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ProgressSpinner } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-credit-selection',
    imports: [CommonModule, FluidModule, InputTextModule, ButtonModule, TextareaModule, TableModule, DividerModule, MessageModule, IconFieldModule, InputIconModule, TagModule, CurrencyPipe, ProgressSpinner, AccordionModule, RouterLink],
    templateUrl: './credit-selection.component.html',
    providers: [MessageService]
})
export class CreditSelectionComponent {
    state = signal<{
        demandeAttentes?: DemandeIndividuel[];
        groupedDemandes: Map<string, DemandeIndividuel[]>;
        loading: boolean;
        message: string | undefined;
        error: string | any;
        statusOptions: { label: string; value: string }[];
        dateKeys: string[];
    }>({
        loading: false,
        message: undefined,
        error: undefined,
        statusOptions: [],
        groupedDemandes: new Map<string, DemandeIndividuel[]>(),
        dateKeys: []
    });

    private userService = inject(UserService);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private messageService = inject(MessageService);

    ngOnInit(): void {
        this.loadDemandeSelection();
    }

    private loadDemandeSelection(): void {
        this.state.update((state) => ({ ...state, loading: true, error: undefined }));

        this.userService
            .getAllDemandeCreditByDate$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    const demandes = response.data.demandeAttentes || [];
                    const groupedMap = this.groupDemandesByDate(demandes);

                    this.state.update((state) => ({
                        ...state,
                        demandeAttentes: demandes,
                        groupedDemandes: groupedMap,
                        dateKeys: Array.from(groupedMap.keys()).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()),
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

    private groupDemandesByDate(demandes: DemandeIndividuel[]): Map<string, DemandeIndividuel[]> {
        const groupedMap = new Map<string, DemandeIndividuel[]>();

        for (const demande of demandes) {
            const date = new Date(demande.createdAt!);
            const dateString = date.toISOString().split('T')[0];

            if (!groupedMap.has(dateString)) {
                groupedMap.set(dateString, []);
            }

            groupedMap.get(dateString)!.push(demande);
        }

        return groupedMap;
    }

    getStatusLabel(statutDemande: string, validationState: string): string {
        if (statutDemande === 'EN_ATTENTE' && validationState === 'NOUVEAU') {
            return 'NOUVELLE DEMANDE';
        } else if (statutDemande === 'EN_ATTENTE' && validationState === 'SELECTION') {
            return 'SELECTION';
        } else if (statutDemande === 'EN_ATTENTE' && validationState === 'APPROVED') {
            return 'EN COURS DE VALIDATION PAR DA';
        }
        return statutDemande;
    }

    getStatusSeverity(statutDemande: string, validationState: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
        if (statutDemande === 'EN_ATTENTE' && validationState === 'APPROVED') return 'danger';
        if (statutDemande === 'EN_ATTENTE') return 'info';
        if (statutDemande === 'REJECTED') return 'danger';
        return undefined;
    }

    formatDateHeader(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    // Optional: Add refresh method for manual refresh
    refreshData(): void {
        this.loadDemandeSelection();
    }
}
