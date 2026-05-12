import { IResponse } from '@/interface/response';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-credits-valides-de',
    standalone: true,
    imports: [
        CommonModule, TableModule, ButtonModule, TagModule, ToastModule,
        BadgeModule, IconFieldModule, InputIconModule, InputTextModule,
        ProgressSpinnerModule, ChipModule, TooltipModule
    ],
    templateUrl: './credits-valides-de.component.html',
    providers: [MessageService]
})
export class CreditsValidesDeComponent implements OnInit {
    @Input() user?: IUser;

    demandes = signal<any[]>([]);
    loading = signal(false);
    error = signal<string | undefined>(undefined);

    private userService = inject(UserService);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private messageService = inject(MessageService);

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.loading.set(true);
        this.error.set(undefined);

        this.userService.getValidesDE$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.demandes.set(response.data?.workflowDemandes || []);
                    this.loading.set(false);
                },
                error: (err) => {
                    this.error.set(err || 'Erreur lors du chargement');
                    this.loading.set(false);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: err || 'Impossible de charger les demandes',
                        life: 5000
                    });
                }
            });
    }

    formatMontantGNF(montant: number): string {
        if (!montant || montant === 0) return '0 GNF';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'GNF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(montant);
    }

    onGlobalFilter(table: any, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    viewDemandeDetail(demandeId: number): void {
        this.router.navigate(['/dashboards/credit/individuel/attente/detail', demandeId]);
    }

    refreshData(): void {
        this.loadData();
        this.messageService.add({
            severity: 'info',
            summary: 'Actualisation',
            detail: 'Données actualisées',
            life: 2000
        });
    }
}
