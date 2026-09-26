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
            <p-selectButton [options]="vueOptions" [(ngModel)]="vue" optionLabel="label" optionValue="value" class="block mb-3" (onChange)="changerVue()"></p-selectButton>

            @if (vue === 'credits') {
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
                <p-dropdown
                    [options]="trancheOptions"
                    [(ngModel)]="tranche"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Tranche de retard"
                    [showClear]="true"
                    styleClass="w-48"
                    appendTo="body"
                    (onChange)="chargerPortefeuille(0)"
                ></p-dropdown>
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
            } @else {
            <!-- ═══════ TT1 (lot 1) : échéances de la période ═══════ -->
            <p class="text-sm text-gray-500 mb-4">
                Toutes les <strong>échéances du plan de paiement SAF</strong> tombant dans la période, sur les crédits en cours ou en contentieux. Une ligne par échéance : capital, intérêts, reste à payer, état
                calculé à la date du jour. Lecture seule.
            </p>

            <div class="flex flex-wrap gap-3 items-center mb-4">
                <p-dropdown
                    *ngIf="state().agences.length > 1"
                    [options]="state().agences"
                    [(ngModel)]="psEcheances"
                    optionLabel="desAgencia"
                    optionValue="codAgencia"
                    placeholder="Tous mes points de service"
                    [showClear]="true"
                    [filter]="state().agences.length > 8"
                    filterBy="desAgencia,codAgencia"
                    styleClass="w-72"
                    appendTo="body"
                    (onChange)="chargerEcheances(0)"
                ></p-dropdown>
                <span *ngIf="state().agences.length === 1" class="font-semibold text-lg"><i class="pi pi-building mr-1"></i>{{ state().agences[0]?.desAgencia }}</span>
                <p-selectButton [options]="raccourcisPeriode" [(ngModel)]="raccourci" optionLabel="label" optionValue="value" (onChange)="appliquerRaccourci()"></p-selectButton>
                <input pInputText type="date" [(ngModel)]="du" class="w-40" (change)="raccourci = null" />
                <span class="text-gray-500">au</span>
                <input pInputText type="date" [(ngModel)]="au" class="w-40" (change)="raccourci = null" />
                <p-dropdown [options]="etatOptions" [(ngModel)]="etatEch" optionLabel="label" optionValue="value" styleClass="w-44" appendTo="body" (onChange)="chargerEcheances(0)"></p-dropdown>
                <input pInputText type="text" [(ngModel)]="rechercheEch" placeholder="Client, code, n° crédit…" class="w-56" (keyup.enter)="chargerEcheances(0)" />
                <button pButton icon="pi pi-search" class="p-button-outlined" (click)="chargerEcheances(0)" [disabled]="!du || !au"></button>
                <button
                    pButton
                    icon="pi pi-file-excel"
                    label="Exporter Excel"
                    class="p-button-success p-button-outlined ml-auto"
                    pTooltip="Exporte toutes les échéances de la période (synthèse + détail), pas seulement la page affichée"
                    [loading]="exportEchEnCours()"
                    [disabled]="!du || !au"
                    (click)="exporterEcheances()"
                ></button>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-4" *ngIf="state().indEch as i">
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Échéances</div>
                    <div class="text-xl font-bold">{{ i.nbEcheances }}</div>
                    <div class="text-xs text-gray-500">{{ i.nbCredits }} crédit(s), {{ i.nbClients }} client(s)</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Attendu</div>
                    <div class="text-xl font-bold">{{ i.montantAttendu | number: '1.0-0' }} <span class="text-xs font-normal">GNF</span></div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">dont capital</div>
                    <div class="text-xl font-bold">{{ i.capitalAttendu | number: '1.0-0' }} <span class="text-xs font-normal">GNF</span></div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">dont intérêts</div>
                    <div class="text-xl font-bold">{{ i.interetsAttendus | number: '1.0-0' }} <span class="text-xs font-normal">GNF</span></div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Réglé</div>
                    <div class="text-xl font-bold text-green-700">{{ i.montantRegle | number: '1.0-0' }} <span class="text-xs font-normal">GNF</span></div>
                    <div class="text-xs text-gray-500">taux de recouvrement {{ i.tauxRecouvrement | number: '1.1-1' }} %</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Reste à encaisser</div>
                    <div class="text-xl font-bold" [class.text-red-600]="i.nbImpayees > 0">{{ i.resteAEncaisser | number: '1.0-0' }} <span class="text-xs font-normal">GNF</span></div>
                    <div class="text-xs text-gray-500">{{ i.nbImpayees }} impayée(s), {{ i.nbAEchoir }} à échoir</div>
                </div>
            </div>

            <p-table [value]="state().echeances" [loading]="state().loadingEch" responsiveLayout="scroll" [rowHover]="true">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Date</th>
                        <th *ngIf="!psEcheances && state().agences.length > 1">Point de service</th>
                        <th>Client</th>
                        <th>N° crédit</th>
                        <th class="text-center">Éch.</th>
                        <th class="text-right">Montant</th>
                        <th class="text-right">Capital</th>
                        <th class="text-right">Intérêts</th>
                        <th class="text-right">Reste à payer</th>
                        <th>État</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-e>
                    <tr>
                        <td class="whitespace-nowrap">{{ e.fecCuota | date: 'dd/MM/yyyy' }}</td>
                        <td *ngIf="!psEcheances && state().agences.length > 1">{{ e.desAgencia }}<div class="text-xs text-gray-500">{{ e.codAgencia }}</div></td>
                        <td><span class="font-medium">{{ e.nomCliente }}</span><div class="text-xs text-gray-500">{{ e.codCliente }}</div></td>
                        <td>{{ e.numCredito }}<div class="text-xs text-gray-500">{{ e.desTipCredito }}</div></td>
                        <td class="text-center">{{ e.numCuota }}</td>
                        <td class="text-right">{{ e.monCuota | number: '1.0-0' }}</td>
                        <td class="text-right">{{ e.monPrincipal | number: '1.0-0' }}</td>
                        <td class="text-right">{{ e.monInt | number: '1.0-0' }}</td>
                        <td class="text-right" [class.font-semibold]="e.resteAPayer > 0">{{ e.resteAPayer | number: '1.0-0' }}</td>
                        <td>
                            <p-tag [value]="libelleEtatEch(e)" [severity]="severiteEtatEch(e)"></p-tag>
                            <div class="text-xs text-gray-500" *ngIf="e.fecCancelacion">réglée le {{ e.fecCancelacion | date: 'dd/MM/yyyy' }}</div>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr>
                        <td colspan="10" class="text-center text-gray-500 py-6">Aucune échéance sur cette période pour ces critères.</td>
                    </tr>
                </ng-template>
            </p-table>

            <div class="flex justify-between items-center mt-3" *ngIf="state().pageEch as p">
                <span class="text-sm text-gray-500">{{ p.totalElements }} échéance(s) — page {{ p.page + 1 }} / {{ p.totalPages || 1 }}</span>
                <div class="flex gap-2">
                    <button pButton icon="pi pi-chevron-left" class="p-button-sm p-button-outlined" [disabled]="!p.hasPrevious" (click)="chargerEcheances(p.page - 1)"></button>
                    <button pButton icon="pi pi-chevron-right" class="p-button-sm p-button-outlined" [disabled]="!p.hasNext" (click)="chargerEcheances(p.page + 1)"></button>
                </div>
            </div>
            }
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
    tranche: string | null = null;
    trancheOptions = [
        { label: '1 – 30 jours', value: '1-30' },
        { label: '31 – 60 jours', value: '31-60' },
        { label: '61 – 90 jours', value: '61-90' },
        { label: '91 – 120 jours', value: '91-120' },
        { label: '+ de 120 jours', value: 'plus120' }
    ];
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
        // TT1 (lot 1)
        echeances: any[];
        indEch: any | null;
        pageEch: any | null;
        loadingEch: boolean;
    }>({ agences: [], credits: [], indicateurs: null, page: null, loading: false, showEcheancier: false, creditSelectionne: null, echeancier: [], loadingEcheancier: false,
         echeances: [], indEch: null, pageEch: null, loadingEch: false });

    // ── TT1 (lot 1) : échéances de la période ──
    vue: 'credits' | 'echeances' = 'credits';
    vueOptions = [
        { label: 'Crédits', value: 'credits' },
        { label: 'Échéances de la période (TT1)', value: 'echeances' }
    ];
    psEcheances: string | null = null;
    du = '';
    au = '';
    raccourci: string | null = 'mois';
    raccourcisPeriode = [
        { label: 'Semaine', value: 'semaine' },
        { label: 'Mois en cours', value: 'mois' },
        { label: 'Mois prochain', value: 'moisSuivant' }
    ];
    etatEch: 'toutes' | 'aechoir' | 'impayees' | 'reglees' = 'toutes';
    etatOptions = [
        { label: 'Toutes les échéances', value: 'toutes' },
        { label: 'À échoir', value: 'aechoir' },
        { label: 'Impayées', value: 'impayees' },
        { label: 'Réglées', value: 'reglees' }
    ];
    rechercheEch = '';
    exportEchEnCours = signal(false);

    changerVue(): void {
        if (this.vue === 'echeances' && !this.state().indEch) {
            this.appliquerRaccourci();
        }
    }

    private iso(d: Date): string {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    appliquerRaccourci(): void {
        const auj = new Date();
        let d: Date, a: Date;
        if (this.raccourci === 'semaine') {
            const jour = (auj.getDay() + 6) % 7; // lundi = 0
            d = new Date(auj); d.setDate(auj.getDate() - jour);
            a = new Date(d); a.setDate(d.getDate() + 6);
        } else if (this.raccourci === 'moisSuivant') {
            d = new Date(auj.getFullYear(), auj.getMonth() + 1, 1);
            a = new Date(auj.getFullYear(), auj.getMonth() + 2, 0);
        } else {
            this.raccourci = 'mois';
            d = new Date(auj.getFullYear(), auj.getMonth(), 1);
            a = new Date(auj.getFullYear(), auj.getMonth() + 1, 0);
        }
        this.du = this.iso(d);
        this.au = this.iso(a);
        this.chargerEcheances(0);
    }

    chargerEcheances(page: number): void {
        if (!this.du || !this.au) return;
        if (this.au < this.du) {
            this.messageService.add({ severity: 'warn', summary: 'Période', detail: 'La date de fin doit être postérieure à la date de début', life: 4000 });
            return;
        }
        const recherche = this.rechercheEch.trim() || null;
        this.state.update((s) => ({ ...s, loadingEch: true }));
        this.userService
            .getPortefeuilleEcheancesIndicateurs$(this.du, this.au, this.psEcheances, this.etatEch, recherche)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => this.state.update((s) => ({ ...s, indEch: (r.data as any)?.indicateurs || null })),
                error: () => {}
            });
        this.userService
            .getPortefeuilleEcheances$(this.du, this.au, this.psEcheances, this.etatEch, recherche, page, this.pageSize)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    const p = (r.data as any)?.echeances;
                    this.state.update((s) => ({ ...s, echeances: p?.content || [], pageEch: p || null, loadingEch: false }));
                },
                error: (err) => {
                    this.state.update((s) => ({ ...s, loadingEch: false }));
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Base SAF momentanément indisponible', life: 6000 });
                }
            });
    }

    exporterEcheances(): void {
        if (!this.du || !this.au) return;
        this.exportEchEnCours.set(true);
        this.userService
            .exportPortefeuilleEcheances$(this.du, this.au, this.psEcheances, this.etatEch, this.rechercheEch.trim() || null)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (reponse) => {
                    this.exportEchEnCours.set(false);
                    const disposition = reponse.headers.get('Content-Disposition') || '';
                    const nom = /filename="?([^";]+)"?/.exec(disposition)?.[1] || `echeances_TT1_${this.du}_${this.au}.xlsx`;
                    const url = URL.createObjectURL(reponse.body as Blob);
                    const lien = document.createElement('a');
                    lien.href = url;
                    lien.download = nom;
                    lien.click();
                    URL.revokeObjectURL(url);
                },
                error: () => {
                    this.exportEchEnCours.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Échec de l'export Excel — réessayez (base SAF indisponible ?)", life: 6000 });
                }
            });
    }

    libelleEtatEch(e: any): string {
        const base = e.etat === 'REGLEE' ? 'Réglée' : e.etat === 'IMPAYEE' ? `Impayée, ${e.joursRetard} j` : 'À échoir';
        return e.partielle ? base + ' (partielle)' : base;
    }

    severiteEtatEch(e: any): 'success' | 'warn' | 'danger' | 'info' {
        if (e.etat === 'REGLEE') return 'success';
        if (e.etat === 'IMPAYEE') return e.joursRetard > 30 ? 'danger' : 'warn';
        return 'info';
    }

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
            .getPortefeuilleIndicateurs$(agence.codAgencia, this.statut, this.tranche, this.recherche.trim() || null)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => this.state.update((s) => ({ ...s, indicateurs: (r.data as any)?.indicateurs || null })),
                error: () => {}
            });
        this.userService
            .getPortefeuilleCredits$(agence.codAgencia, this.statut, this.tranche, this.recherche.trim() || null, page, this.pageSize)
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
            .exportPortefeuille$(agence.codAgencia, this.statut, this.tranche, this.recherche.trim() || null)
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
