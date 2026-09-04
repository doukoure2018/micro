import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

/**
 * Suivi du portefeuille crédits SAF (phase 1) : crédits actifs d'une agence SAF,
 * indicateurs (encours, PAR 30/90, impayés) et échéancier détaillé.
 * Lecture seule — les retards apparaissent en tête de liste.
 */
@Component({
    selector: 'app-portefeuille-saf',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, DialogModule, DropdownModule, InputTextModule, SelectButtonModule, TableModule, TagModule, ToastModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>
        <div class="card">
            <div class="flex flex-wrap justify-between items-center gap-3 mb-2">
                <h2 class="text-xl font-bold m-0">Portefeuille crédits SAF</h2>
                <button pButton icon="pi pi-refresh" class="p-button-text" (click)="recharger()" [loading]="state().loading"></button>
            </div>
            <p class="text-sm text-gray-500 mb-4">
                Crédits <strong>mis en place dans SAF2000</strong> (capital restant dû &gt; 0), calculés à la date du jour. Les crédits en retard apparaissent en tête, du plus ancien impayé au plus récent. Lecture
                seule.
            </p>

            <div class="flex flex-wrap gap-3 items-center mb-4">
                <!-- Perimetre a une seule agence (agent) : preselection, pas de choix -->
                <span *ngIf="state().agences.length === 1" class="font-semibold text-lg">
                    <i class="pi pi-building mr-1"></i>{{ agenceSelectionnee?.desAgencia }}
                </span>
                <p-dropdown
                    *ngIf="state().agences.length !== 1"
                    [options]="state().agences"
                    [(ngModel)]="agenceSelectionnee"
                    optionLabel="desAgencia"
                    placeholder="Choisir une agence SAF"
                    [filter]="state().agences.length > 8"
                    filterBy="desAgencia,codAgencia"
                    styleClass="w-72"
                    appendTo="body"
                    (onChange)="chargerPortefeuille(0)"
                ></p-dropdown>
                <p-selectButton [options]="statutOptions" [(ngModel)]="statut" optionLabel="label" optionValue="value" (onChange)="chargerPortefeuille(0)"></p-selectButton>
                <input pInputText type="text" [(ngModel)]="recherche" placeholder="Client, code, n° crédit…" class="w-64" (keyup.enter)="chargerPortefeuille(0)" />
                <button pButton icon="pi pi-search" class="p-button-outlined" (click)="chargerPortefeuille(0)" [disabled]="!agenceSelectionnee"></button>
                <button
                    pButton
                    icon="pi pi-file-excel"
                    label="Exporter Excel"
                    class="p-button-success p-button-outlined ml-auto"
                    pTooltip="Exporte toute la sélection courante (agence + filtres), pas seulement la page affichée"
                    [loading]="exportEnCours()"
                    [disabled]="!agenceSelectionnee"
                    (click)="exporterExcel()"
                ></button>
            </div>

            <!-- Indicateurs -->
            <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4" *ngIf="state().indicateurs as ind">
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Crédits actifs</div>
                    <div class="text-xl font-bold">{{ ind.nbCredits }}</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Encours total</div>
                    <div class="text-xl font-bold">{{ ind.encoursTotal | number: '1.0-0' }} <span class="text-xs font-normal">GNF</span></div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">En retard</div>
                    <div class="text-xl font-bold text-orange-600">{{ ind.nbEnRetard }}</div>
                    <div class="text-xs text-gray-500">{{ ind.mntImpaye | number: '1.0-0' }} GNF impayés</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">PAR 30</div>
                    <div class="text-xl font-bold" [class.text-red-600]="par(ind.encoursPar30, ind.encoursTotal) >= 5">{{ par(ind.encoursPar30, ind.encoursTotal) | number: '1.1-1' }} %</div>
                    <div class="text-xs text-gray-500">{{ ind.encoursPar30 | number: '1.0-0' }} GNF</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">PAR 90</div>
                    <div class="text-xl font-bold" [class.text-red-600]="par(ind.encoursPar90, ind.encoursTotal) >= 3">{{ par(ind.encoursPar90, ind.encoursTotal) | number: '1.1-1' }} %</div>
                    <div class="text-xs text-gray-500">{{ ind.encoursPar90 | number: '1.0-0' }} GNF</div>
                </div>
            </div>

            <p-table [value]="state().credits" [loading]="state().loading" responsiveLayout="scroll" [rowHover]="true">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Client</th>
                        <th>N° crédit</th>
                        <th>Type</th>
                        <th class="text-right">Montant</th>
                        <th class="text-right">Capital restant dû</th>
                        <th class="text-center">Échéances (payées/imp./rest.)</th>
                        <th>Prochaine échéance</th>
                        <th>Retard</th>
                        <th></th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-c>
                    <tr>
                        <td>
                            {{ c.nomCliente }}<br />
                            <span class="text-xs text-gray-500">{{ c.codCliente }}</span>
                        </td>
                        <td>{{ c.numCredito }}</td>
                        <td>{{ c.desTipCredito || c.tipCredito }}</td>
                        <td class="text-right">{{ c.monCredito | number: '1.0-0' }}</td>
                        <td class="text-right font-semibold">{{ c.monSaldo | number: '1.0-0' }}</td>
                        <td class="text-center">{{ c.nbEchPayees }} / {{ c.nbEchImpayees }} / {{ c.nbEchRestantes }}</td>
                        <td>{{ c.prochaineEcheance | date: 'dd/MM/yyyy' }}</td>
                        <td>
                            <p-tag *ngIf="c.joursRetard; else sain" [value]="c.joursRetard + ' j'" [severity]="severiteRetard(c.joursRetard)"></p-tag>
                            <ng-template #sain><p-tag value="Sain" severity="success"></p-tag></ng-template>
                            <div *ngIf="c.joursRetard" class="text-xs text-gray-500 mt-1">{{ c.mntCapImpaye + c.mntIntImpaye | number: '1.0-0' }} GNF</div>
                        </td>
                        <td>
                            <button pButton icon="pi pi-calendar" class="p-button-sm p-button-text" pTooltip="Voir l'échéancier" (click)="voirEcheancier(c)"></button>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr>
                        <td colspan="9" class="text-center py-6 text-gray-500">
                            {{ agenceSelectionnee ? 'Aucun crédit pour ces critères.' : 'Choisissez une agence SAF pour afficher son portefeuille.' }}
                        </td>
                    </tr>
                </ng-template>
            </p-table>

            <!-- Pagination serveur -->
            <div class="flex justify-between items-center mt-3" *ngIf="state().page as p">
                <span class="text-sm text-gray-500">{{ p.totalElements }} crédit(s) — page {{ p.page + 1 }} / {{ p.totalPages || 1 }}</span>
                <div class="flex gap-2">
                    <button pButton icon="pi pi-chevron-left" class="p-button-sm p-button-outlined" [disabled]="!p.hasPrevious" (click)="chargerPortefeuille(p.page - 1)"></button>
                    <button pButton icon="pi pi-chevron-right" class="p-button-sm p-button-outlined" [disabled]="!p.hasNext" (click)="chargerPortefeuille(p.page + 1)"></button>
                </div>
            </div>
        </div>

        <!-- Dialog echeancier -->
        <p-dialog
            [header]="'Échéancier — crédit ' + (state().creditSelectionne?.numCredito || '')"
            [visible]="state().showEcheancier"
            (visibleChange)="!$event && fermerEcheancier()"
            [modal]="true"
            [style]="{ width: '760px' }"
            [closable]="true"
        >
            <p class="m-0 mb-3 text-sm" *ngIf="state().creditSelectionne as c">
                <strong>{{ c.nomCliente }}</strong> ({{ c.codCliente }}) — {{ c.monCredito | number: '1.0-0' }} GNF, CRD {{ c.monSaldo | number: '1.0-0' }} GNF
            </p>
            <p-table [value]="state().echeancier" [loading]="state().loadingEcheancier" responsiveLayout="scroll">
                <ng-template pTemplate="header">
                    <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th class="text-right">Montant</th>
                        <th class="text-right">dont intérêts</th>
                        <th class="text-right">Restant dû (cap. + int.)</th>
                        <th>Statut</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-e>
                    <tr>
                        <td>{{ e.numCuota }}</td>
                        <td>{{ e.fecCuota | date: 'dd/MM/yyyy' }}</td>
                        <td class="text-right">{{ e.monCuota | number: '1.0-0' }}</td>
                        <td class="text-right">{{ e.monInt | number: '1.0-0' }}</td>
                        <td class="text-right">{{ e.salPrincipal + e.salInt | number: '1.0-0' }}</td>
                        <td>
                            <p-tag *ngIf="e.fecCancelacion" [value]="'Payée le ' + (e.fecCancelacion | date: 'dd/MM/yyyy')" severity="success"></p-tag>
                            <p-tag *ngIf="!e.fecCancelacion" [value]="enRetard(e.fecCuota) ? 'Impayée' : 'À venir'" [severity]="enRetard(e.fecCuota) ? 'danger' : 'info'"></p-tag>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
            <ng-template pTemplate="footer">
                <button pButton label="Fermer" icon="pi pi-times" class="p-button-text" (click)="fermerEcheancier()"></button>
            </ng-template>
        </p-dialog>
    `
})
export class PortefeuilleSafComponent implements OnInit {
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

    agenceSelectionnee: { codAgencia: string; desAgencia: string } | null = null;
    statut: 'actifs' | 'retard' = 'actifs';
    recherche = '';
    statutOptions = [
        { label: 'Tous les actifs', value: 'actifs' },
        { label: 'En retard', value: 'retard' }
    ];
    pageSize = 20;

    state = signal<{
        agences: any[];
        credits: any[];
        indicateurs: any | null;
        page: any | null;
        loading: boolean;
        showEcheancier: boolean;
        creditSelectionne: any | null;
        echeancier: any[];
        loadingEcheancier: boolean;
    }>({ agences: [], credits: [], indicateurs: null, page: null, loading: false, showEcheancier: false, creditSelectionne: null, echeancier: [], loadingEcheancier: false });

    ngOnInit(): void {
        this.userService
            .getPortefeuilleAgences$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    const agences = (r.data as any)?.agences || [];
                    this.state.update((s) => ({ ...s, agences }));
                    // Perimetre a une seule agence (agent de credit) : chargement direct
                    if (agences.length === 1) {
                        this.agenceSelectionnee = agences[0];
                        this.chargerPortefeuille(0);
                    }
                },
                error: (err) => this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Chargement des agences impossible', life: 6000 })
            });
    }

    recharger(): void {
        this.chargerPortefeuille(this.state().page?.page || 0);
    }

    chargerPortefeuille(page: number): void {
        const agence = this.agenceSelectionnee;
        if (!agence) return;
        this.state.update((s) => ({ ...s, loading: true }));
        this.userService
            .getPortefeuilleIndicateurs$(agence.codAgencia)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => this.state.update((s) => ({ ...s, indicateurs: (r.data as any)?.indicateurs || null })),
                error: () => {}
            });
        this.userService
            .getPortefeuilleCredits$(agence.codAgencia, this.statut, this.recherche.trim() || null, page, this.pageSize)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    const p = (r.data as any)?.credits;
                    this.state.update((s) => ({ ...s, credits: p?.content || [], page: p || null, loading: false }));
                },
                error: (err) => {
                    this.state.update((s) => ({ ...s, loading: false }));
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Base SAF momentanément indisponible', life: 6000 });
                }
            });
    }

    voirEcheancier(credit: any): void {
        this.state.update((s) => ({ ...s, showEcheancier: true, creditSelectionne: credit, echeancier: [], loadingEcheancier: true }));
        this.userService
            .getPortefeuilleEcheancier$(credit.codAgencia, credit.numCredito)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => this.state.update((s) => ({ ...s, echeancier: (r.data as any)?.echeancier || [], loadingEcheancier: false })),
                error: (err) => {
                    this.state.update((s) => ({ ...s, loadingEcheancier: false }));
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Échéancier indisponible', life: 6000 });
                }
            });
    }

    exportEnCours = signal(false);

    exporterExcel(): void {
        const agence = this.agenceSelectionnee;
        if (!agence) return;
        this.exportEnCours.set(true);
        this.userService
            .exportPortefeuille$(agence.codAgencia, this.statut, this.recherche.trim() || null)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (reponse) => {
                    this.exportEnCours.set(false);
                    const disposition = reponse.headers.get('Content-Disposition') || '';
                    const nom = /filename="?([^";]+)"?/.exec(disposition)?.[1] || `portefeuille_${agence.codAgencia}.xlsx`;
                    const url = URL.createObjectURL(reponse.body as Blob);
                    const lien = document.createElement('a');
                    lien.href = url;
                    lien.download = nom;
                    lien.click();
                    URL.revokeObjectURL(url);
                },
                error: () => {
                    this.exportEnCours.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Échec de l'export Excel — réessayez (base SAF indisponible ?)", life: 6000 });
                }
            });
    }

    fermerEcheancier(): void {
        this.state.update((s) => ({ ...s, showEcheancier: false, creditSelectionne: null, echeancier: [] }));
    }

    par(encoursRisque: number, encoursTotal: number): number {
        return encoursTotal > 0 ? (encoursRisque / encoursTotal) * 100 : 0;
    }

    severiteRetard(jours: number): 'warn' | 'danger' {
        return jours > 30 ? 'danger' : 'warn';
    }

    enRetard(fecCuota: string): boolean {
        return !!fecCuota && new Date(fecCuota) < new Date();
    }
}
