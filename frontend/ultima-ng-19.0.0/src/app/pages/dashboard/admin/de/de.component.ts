import { IUser } from '@/interface/user';
import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CreditParDelegationComponent } from './credit-par-delegation/credit-par-delegation.component';
import { SuiviGlobalCreditsComponent } from './suivi-global-credits/suivi-global-credits.component';

export type CreditTypeFilter = 'ALL' | 'PETIT' | 'GROS';

@Component({
    selector: 'app-de',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, SelectButtonModule, CreditParDelegationComponent, SuiviGlobalCreditsComponent],
    templateUrl: './de.component.html',
    styleUrl: './de.component.scss'
})
export class DeComponent {
    @Input() user?: IUser;

    /** Seuil legal entre petit et gros credit (50M GNF) */
    static readonly SEUIL_PETIT_GROS_GNF = 50_000_000;

    /** Filtre actif: 'ALL' | 'PETIT' | 'GROS' */
    creditTypeFilter = signal<CreditTypeFilter>('ALL');

    creditTypeOptions = [
        { label: 'Tous les credits', value: 'ALL', icon: 'pi pi-list' },
        { label: 'Petits credits (< 50M)', value: 'PETIT', icon: 'pi pi-circle' },
        { label: 'Gros credits (≥ 50M)', value: 'GROS', icon: 'pi pi-circle-fill' }
    ];

    constructor(private router: Router) {}

    /** Navigation vers la page d'historique des anciens credits */
    ouvrirHistoriqueCredits(): void {
        this.router.navigate(['/dashboards/credit/analyse-credit']);
    }
}
