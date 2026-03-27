import { IResponse } from '@/interface/response';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, OnInit, signal, computed } from '@angular/core';
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
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

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
        CommonModule, TableModule, ButtonModule, TagModule, ToastModule,
        BadgeModule, IconFieldModule, InputIconModule, InputTextModule,
        ProgressSpinnerModule, ChipModule, SelectModule
    ],
    templateUrl: './suivi-global-credits.component.html',
    providers: [MessageService]
})
export class SuiviGlobalCreditsComponent implements OnInit {
    @Input() user?: IUser;

    allDemandes = signal<any[]>([]);
    loading = signal(false);
    selectedProfil = signal<string>('ALL');

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

    profilCounts = computed<ProfilCount[]>(() => {
        const demandes = this.allDemandes();
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
            }
        ];
    });

    filteredDemandes = computed(() => {
        const profil = this.selectedProfil();
        const demandes = this.allDemandes();
        if (profil === 'ALL') return demandes;

        const stateMap: Record<string, string[]> = {
            AGENT_CREDIT: ['NOUVEAU', 'SELECTION', 'APPROVED'],
            DA: ['APPROVED'],
            DR: ['VALIDATED_DA'],
            CORRECTION_AC: ['CORRECTION'],
            CORRECTION_DR: ['CORRECTION_DR'],
            CORRECTION_DE: ['CORRECTION_DE'],
            VALIDATED_DR: ['VALIDATED_DR']
        };
        const states = stateMap[profil] || [];
        return demandes.filter(d => states.includes(d.validationState));
    });

    ngOnInit(): void {
        this.loadSuiviGlobal();
    }

    private loadSuiviGlobal(): void {
        this.loading.set(true);
        this.userService.getSuiviGlobalDE$()
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
            CORRECTION_DE: 'Correction DE'
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
            CORRECTION_DE: 'danger'
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
            CORRECTION_DE: 'Rejete par DE, en correction'
        };
        return labels[validationState] || validationState;
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
