import { DemandeIndividuel } from '@/interface/demande-individuel.interface';
import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { EMPTY, Observer, switchMap } from 'rxjs';

@Component({
    selector: 'app-attente',
    imports: [CommonModule, TableModule, InputTextModule, ProgressBarModule, ButtonModule, IconField, InputIcon, TagModule, MessageModule],
    templateUrl: './attente.component.html'
})
export class AttenteComponent {
    state = signal<{
        demandeAttentes?: DemandeIndividuel[];
        loading: boolean;
        message: string | undefined;
        error: string | any;
    }>({
        loading: false,
        message: undefined,
        error: undefined
    });

    private userService = inject(UserService);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);

    ngOnInit(): void {
        this.loadAllDemandeAttente();
    }

    private loadAllDemandeAttente(): void {
        this.state.update((state) => ({ ...state, loading: true, error: undefined }));

        this.userService
            .getAllDemandeAttente$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.state.update((state) => ({
                        ...state,
                        demandeAttentes: response.data.demandeAttentes,
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
            return 'SELECTION';
        }
        return statutDemande;
    }

    getStateValidation(statutDemande: string, validationState: string): string {
        if (statutDemande === 'EN_ATTENTE' && validationState === 'NOUVEAU') {
            return 'EN ATTENTE POUR LA SELECTION';
        } else if (statutDemande === 'EN_ATTENTE' && validationState === 'SELECTION') {
            return 'EN ATTENTE POUR LA VALIDATION';
        } else if (statutDemande === 'EN_ATTENTE' && validationState === 'APPROVED') {
            return "DEMANDE APPROVEE PAR L'AGENT";
        }
        return validationState;
    }

    getStatusSeverity(statutDemande: string, validationState: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
        if (statutDemande === 'APPROVED') return 'success';
        if (statutDemande === 'EN_ATTENTE') return 'info';
        if (statutDemande === 'REJECTED') return 'danger';
        return undefined;
    }

    viewDetailDemandeAttente(demandeindividuel_id: number) {
        this.router.navigate(['/dashboards/credit/individuel/attente/detail/', demandeindividuel_id]);
    }

    // Optional: Add refresh method for manual refresh
    refreshData(): void {
        this.loadAllDemandeAttente();
    }
}
