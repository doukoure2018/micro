import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-list-demandes-affectees',
    standalone: true,
    imports: [
        CommonModule, TableModule, ButtonModule, TagModule, ToastModule,
        BadgeModule, IconFieldModule, InputIconModule, InputTextModule,
        ProgressSpinnerModule, MessageModule, ConfirmDialogModule
    ],
    templateUrl: './list-demandes-affectees.component.html',
    providers: [MessageService, ConfirmationService]
})
export class ListDemandesAffecteesComponent {
    state = signal<{
        demandes: any[];
        loading: boolean;
        error: string | undefined;
    }>({
        demandes: [],
        loading: false,
        error: undefined
    });

    private userService = inject(UserService);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    ngOnInit(): void {
        this.loadDemandesAffectees();
    }

    private loadDemandesAffectees(): void {
        this.state.update(s => ({ ...s, loading: true, error: undefined }));

        this.userService.getDemandesAffecteesDA$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.state.update(s => ({
                        ...s,
                        demandes: response.data?.workflowDemandes || [],
                        loading: false
                    }));
                },
                error: (error) => {
                    this.state.update(s => ({
                        ...s,
                        loading: false,
                        error: 'Erreur lors du chargement des demandes affectees'
                    }));
                }
            });
    }

    getValidationStateLabel(validationState: string): string {
        const labels: Record<string, string> = {
            SELECTION: 'En selection',
            APPROVED: 'Approuvee par AC'
        };
        return labels[validationState] || validationState;
    }

    getValidationStateSeverity(validationState: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
        const severities: Record<string, any> = {
            SELECTION: 'info',
            APPROVED: 'success'
        };
        return severities[validationState] || 'info';
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

    confirmerAnnulation(demande: any): void {
        this.confirmationService.confirm({
            message: `Voulez-vous vraiment annuler l'affectation de la demande de ${demande.prenom} ${demande.nom} (${demande.numeroMembre}) ?`,
            header: "Confirmation d'annulation",
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui, annuler',
            rejectLabel: 'Non',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.annulerAffectation(demande.demandeIndividuelId);
            }
        });
    }

    private annulerAffectation(demandeId: number): void {
        this.userService.annulerAffectation$(demandeId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succes',
                        detail: 'Affectation annulee avec succes',
                        life: 3000
                    });
                    this.loadDemandesAffectees();
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: err || "Erreur lors de l'annulation de l'affectation",
                        life: 5000
                    });
                }
            });
    }

    refreshData(): void {
        this.loadDemandesAffectees();
    }

    goBack(): void {
        this.router.navigate(['/']);
    }
}
