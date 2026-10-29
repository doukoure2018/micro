import { DonneesSafComponent } from './donnees-saf.component';
import { IResponse } from '@/interface/response';
import { CreditRisque, LigneRisque, NON_AFFECTE, PortefeuilleRisque, TrancheRisque } from '@/interface/portefeuille-risque';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { Observable } from 'rxjs';

interface AgenceSaf {
    codAgencia: string;
    desAgencia: string;
}

/**
 * Portefeuille à risque par agent et par produit (proposition DSIG du 29/10/2026, lot 1).
 *
 * Un écran à part, avec sa propre entrée de menu : le PAR 30 et le PAR 90 d'un point de
 * service ventilés par produit (type de crédit SAF) et par agent (gestionnaire désigné dans
 * digi), avec la ligne « Non affecté » pour que les totaux retombent sur le point de service.
 * Un clic sur un produit restreint le tableau des agents à ce produit, et inversement ; chaque
 * chiffre renvoie aux crédits qui le composent. L'agent de crédit ne voit que sa ligne.
 */
@Component({
    selector: 'app-portefeuille-risque',
    standalone: true,
    imports: [CommonModule, DonneesSafComponent, FormsModule, ButtonModule, DialogModule, SelectModule, SelectButtonModule, TableModule, TagModule, ToastModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>
        <div class="card">
            <div class="flex flex-wrap justify-between items-center gap-3 mb-2">
                <h2 class="text-xl font-bold m-0">Portefeuille à risque</h2>
                <app-donnees-saf></app-donnees-saf>
                <button pButton icon="pi pi-refresh" class="p-button-text" pTooltip="Relire SAF" (click)="charger()" [loading]="loading()"></button>
            </div>
            <p class="text-sm text-gray-500 mb-3">
                PAR 30 et PAR 90 des crédits en cours, par produit et par gestionnaire désigné. Même règle que le bandeau du portefeuille et que la déclaration BCRG :
                un crédit entre dans le PAR 30 quand sa plus ancienne échéance impayée a 30 jours ou plus, et tout son encours compte.
            </p>

            <div class="flex flex-wrap gap-3 items-center mb-4">
                <span *ngIf="agences().length === 1" class="font-semibold text-lg"><i class="pi pi-building mr-1"></i>{{ agences()[0]?.desAgencia }}</span>
                <p-select
                    *ngIf="agences().length !== 1"
                    [options]="agences()"
                    [ngModel]="agence()"
                    (ngModelChange)="choisirAgence($event)"
                    optionLabel="desAgencia"
                    [filter]="agences().length > 8"
                    filterBy="desAgencia,codAgencia"
                    placeholder="Choisir un point de service"
                    styleClass="w-80"
                    appendTo="body"
                ></p-select>
                <button pButton icon="pi pi-file-excel" label="Exporter Excel" class="p-button-success p-button-outlined ml-auto" pTooltip="Trois feuilles : Par produit, Par agent, Croisement" [loading]="exportEnCours()" [disabled]="!data()" (click)="exporter()"></button>
            </div>

            @if (data(); as d) {
            <!-- Tuiles -->
            <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Crédits en cours</div>
                    <div class="text-xl font-bold">{{ d.total.nbCredits }}</div>
                    <div class="text-xs text-gray-500">lus le {{ d.dateLecture | date: 'dd/MM/yyyy' }}</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Encours</div>
                    <div class="text-xl font-bold">{{ d.total.encours | number: '1.0-0' }} <span class="text-xs font-normal">GNF</span></div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">En retard</div>
                    <div class="text-xl font-bold text-orange-600">{{ d.total.nbEnRetard }}</div>
                    <div class="text-xs text-gray-500">{{ d.total.impaye | number: '1.0-0' }} GNF impayés</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">PAR 30</div>
                    <div class="text-xl font-bold" [class.text-red-600]="d.total.tauxPar30 >= d.seuilPar30">{{ d.total.tauxPar30 | number: '1.1-1' }} %</div>
                    <div class="text-xs text-gray-500">{{ d.total.encoursPar30 | number: '1.0-0' }} GNF · {{ d.total.nbPar30 }} crédits</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">PAR 90</div>
                    <div class="text-xl font-bold" [class.text-red-600]="d.total.tauxPar90 >= d.seuilPar90">{{ d.total.tauxPar90 | number: '1.1-1' }} %</div>
                    <div class="text-xs text-gray-500">{{ d.total.encoursPar90 | number: '1.0-0' }} GNF · {{ d.total.nbPar90 }} crédits</div>
                </div>
            </div>

            <!-- Filtre croisé -->
            <div *ngIf="filtreProduit() || filtreAgent()" class="flex flex-wrap items-center gap-2 mb-3 p-2 rounded bg-blue-50 border border-blue-200 text-sm">
                <i class="pi pi-filter"></i>
                <span *ngIf="filtreProduit() as f">Le tableau des agents ne montre que le produit <b>{{ f.libelle }}</b>.</span>
                <span *ngIf="filtreAgent() as f">Le tableau des produits ne montre que <b>{{ f.libelle }}</b>.</span>
                <button pButton label="Tout afficher" icon="pi pi-times" class="p-button-text p-button-sm ml-auto" (click)="effacerFiltres()"></button>
            </div>

            <!-- Par produit -->
            <h3 class="text-lg font-semibold mb-1">Par produit</h3>
            <p class="text-xs text-gray-500 mb-2">Type de crédit SAF. Cliquez une ligne pour voir la part de chaque agent dans ce produit.</p>
            <p-table [value]="lignesProduit()" styleClass="p-datatable-sm mb-5" [rowHover]="true" responsiveLayout="scroll" sortField="encoursPar30" [sortOrder]="-1">
                <ng-template pTemplate="header">
                    <tr>
                        <th pSortableColumn="libelle">Produit <p-sortIcon field="libelle"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="nbCredits">Crédits <p-sortIcon field="nbCredits"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="encours">Encours (GNF) <p-sortIcon field="encours"></p-sortIcon></th>
                        <th class="text-right">Part</th>
                        <th class="text-right" pSortableColumn="nbEnRetard">En retard <p-sortIcon field="nbEnRetard"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="encoursPar30">PAR 30 (GNF) <p-sortIcon field="encoursPar30"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="tauxPar30">PAR 30 <p-sortIcon field="tauxPar30"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="encoursPar90">PAR 90 (GNF) <p-sortIcon field="encoursPar90"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="tauxPar90">PAR 90 <p-sortIcon field="tauxPar90"></p-sortIcon></th>
                        <th class="text-right" pTooltip="Dossiers passés au contentieux par le DA dans digi ; ils restent dans la base du PAR">Cont.</th>
                        <th>Crédits</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-l>
                    <tr class="cursor-pointer" [class.bg-blue-50]="filtreProduit()?.cle === l.cle" (click)="choisirProduit(l)">
                        <td class="font-semibold">{{ l.libelle }}<div class="text-xs text-gray-500 font-normal" *ngIf="l.tipCredito != null">type {{ l.tipCredito }}</div></td>
                        <td class="text-right">{{ l.nbCredits }}</td>
                        <td class="text-right">{{ l.encours | number: '1.0-0' }}</td>
                        <td class="text-right text-gray-500">{{ part(l.encours, d.total.encours) | number: '1.0-0' }} %</td>
                        <td class="text-right" [class.text-orange-600]="l.nbEnRetard > 0">{{ l.nbEnRetard }}</td>
                        <td class="text-right">{{ l.encoursPar30 | number: '1.0-0' }}</td>
                        <td class="text-right font-semibold" [class.text-red-600]="l.tauxPar30 >= d.seuilPar30">{{ l.tauxPar30 | number: '1.1-1' }} %</td>
                        <td class="text-right">{{ l.encoursPar90 | number: '1.0-0' }}</td>
                        <td class="text-right font-semibold" [class.text-red-600]="l.tauxPar90 >= d.seuilPar90">{{ l.tauxPar90 | number: '1.1-1' }} %</td>
                        <td class="text-right">{{ l.nbContentieuxDeclares || '' }}</td>
                        <td class="whitespace-nowrap" (click)="$event.stopPropagation()">
                            <button pButton label="30 j+" class="p-button-text p-button-sm" pTooltip="Crédits à 30 jours de retard et plus" [disabled]="!l.nbPar30" (click)="voirCredits(l, '30')"></button>
                            <button pButton label="90 j+" class="p-button-text p-button-sm" pTooltip="Crédits à 90 jours de retard et plus" [disabled]="!l.nbPar90" (click)="voirCredits(l, '90')"></button>
                            <button pButton icon="pi pi-list" class="p-button-text p-button-sm" pTooltip="Tous les crédits de la ligne" (click)="voirCredits(l, '')"></button>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr><td colspan="11" class="text-center text-gray-500 py-4">Aucun crédit en cours pour cette sélection.</td></tr>
                </ng-template>
            </p-table>

            <!-- Par agent -->
            <h3 class="text-lg font-semibold mb-1">Par agent</h3>
            <p class="text-xs text-gray-500 mb-2">
                Gestionnaire désigné dans digi (affectation du directeur d'agence). La ligne « Non affecté » porte les crédits que personne ne suit encore : la somme des lignes redonne le point de service.
                <span *ngIf="d.estAgent"> Vous voyez votre ligne et la ligne « Non affecté » ; la comparaison entre agents revient au directeur d'agence.</span>
                Cliquez une ligne pour voir la répartition par produit de cet agent.
            </p>
            <p-table [value]="lignesAgent()" styleClass="p-datatable-sm" [rowHover]="true" responsiveLayout="scroll">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Agent</th>
                        <th>Statut</th>
                        <th class="text-right">Crédits</th>
                        <th class="text-right">Encours (GNF)</th>
                        <th class="text-right">Part</th>
                        <th class="text-right">En retard</th>
                        <th class="text-right">PAR 30 (GNF)</th>
                        <th class="text-right">PAR 30</th>
                        <th class="text-right">PAR 90 (GNF)</th>
                        <th class="text-right">PAR 90</th>
                        <th class="text-right" pTooltip="Dossiers passés au contentieux par le DA dans digi ; ils restent dans la base du PAR">Cont.</th>
                        <th>Crédits</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-l>
                    <tr class="cursor-pointer" [class.bg-blue-50]="filtreAgent()?.cle === l.cle" [class.bg-gray-50]="l.nonAffecte" (click)="choisirAgent(l)">
                        <td class="font-semibold" [class.italic]="l.nonAffecte">{{ l.libelle }}</td>
                        <td>
                            <p-tag *ngIf="l.nonAffecte" severity="warn" value="sans gestionnaire" pTooltip="À affecter par le directeur d'agence"></p-tag>
                            <p-tag *ngIf="!l.nonAffecte && l.disponible" severity="success" value="agent du point de service"></p-tag>
                            <p-tag *ngIf="!l.nonAffecte && l.disponible === false" severity="danger" value="parti ou désactivé" pTooltip="Ses crédits sont à réaffecter"></p-tag>
                        </td>
                        <td class="text-right">{{ l.nbCredits }}</td>
                        <td class="text-right">{{ l.encours | number: '1.0-0' }}</td>
                        <td class="text-right text-gray-500">{{ part(l.encours, d.total.encours) | number: '1.0-0' }} %</td>
                        <td class="text-right" [class.text-orange-600]="l.nbEnRetard > 0">{{ l.nbEnRetard }}</td>
                        <td class="text-right">{{ l.encoursPar30 | number: '1.0-0' }}</td>
                        <td class="text-right font-semibold" [class.text-red-600]="l.tauxPar30 >= d.seuilPar30">{{ l.tauxPar30 | number: '1.1-1' }} %</td>
                        <td class="text-right">{{ l.encoursPar90 | number: '1.0-0' }}</td>
                        <td class="text-right font-semibold" [class.text-red-600]="l.tauxPar90 >= d.seuilPar90">{{ l.tauxPar90 | number: '1.1-1' }} %</td>
                        <td class="text-right">{{ l.nbContentieuxDeclares || '' }}</td>
                        <td class="whitespace-nowrap" (click)="$event.stopPropagation()">
                            <button pButton label="30 j+" class="p-button-text p-button-sm" pTooltip="Crédits à 30 jours de retard et plus" [disabled]="!l.nbPar30" (click)="voirCredits(l, '30')"></button>
                            <button pButton label="90 j+" class="p-button-text p-button-sm" pTooltip="Crédits à 90 jours de retard et plus" [disabled]="!l.nbPar90" (click)="voirCredits(l, '90')"></button>
                            <button pButton icon="pi pi-list" class="p-button-text p-button-sm" pTooltip="Tous les crédits de la ligne" (click)="voirCredits(l, '')"></button>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr><td colspan="12" class="text-center text-gray-500 py-4">Aucun crédit en cours pour cette sélection.</td></tr>
                </ng-template>
            </p-table>
            <p class="text-xs text-gray-500 mt-3">
                Seuils d'attention : PAR 30 ≥ {{ d.seuilPar30 }} %, PAR 90 ≥ {{ d.seuilPar90 }} %. Ce PAR est comptable : il dit où est le risque, pas la faute de quelqu'un.
                Un agent qui reçoit un portefeuille dégradé affiche un PAR élevé le jour de l'affectation. L'appréciation des agents, elle, retire les retards hérités.
            </p>
            } @else if (!loading() && agence()) {
            <p class="text-gray-500">Aucune donnée.</p>
            } @else if (!loading()) {
            <p class="text-gray-500">Choisissez un point de service.</p>
            }
        </div>

        <!-- Crédits derrière un chiffre -->
        <p-dialog [header]="creditsTitre()" [(visible)]="showCredits" [modal]="true" [style]="{ width: '95vw', maxWidth: '1300px' }" [dismissableMask]="true">
            <div class="flex flex-wrap items-center gap-3 mb-3">
                <p-selectButton [options]="trancheOptions" [ngModel]="tranche()" (ngModelChange)="changerTranche($event)" optionLabel="label" optionValue="value" [allowEmpty]="false"></p-selectButton>
                <span class="text-sm text-gray-500">{{ credits().length }} crédit(s) · {{ sommeEncours() | number: '1.0-0' }} GNF d'encours</span>
            </div>
            <p-table [value]="credits()" [loading]="loadingCredits()" styleClass="p-datatable-sm" responsiveLayout="scroll" [paginator]="credits().length > 25" [rows]="25">
                <ng-template pTemplate="header">
                    <tr>
                        <th>N° crédit</th>
                        <th>Client</th>
                        <th>Téléphone</th>
                        <th>Type</th>
                        <th class="text-right">Encours (GNF)</th>
                        <th class="text-right">Jours</th>
                        <th>Retard depuis</th>
                        <th class="text-right">Montant en retard</th>
                        <th>Gestionnaire désigné</th>
                        <th></th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-c>
                    <tr>
                        <td>{{ c.credit.numCredito }}</td>
                        <td>{{ c.credit.nomCliente }}<div class="text-xs text-gray-500">{{ c.credit.codCliente }}</div></td>
                        <td>{{ c.credit.telPrincipal || '—' }}</td>
                        <td>{{ c.credit.desTipCredito || c.credit.tipCredito }}</td>
                        <td class="text-right">{{ c.credit.monSaldo | number: '1.0-0' }}</td>
                        <td class="text-right" [class.text-red-600]="(c.credit.joursRetard || 0) >= 30">{{ c.credit.joursRetard || '' }}</td>
                        <td>{{ c.credit.datPremiereImpayee ? (c.credit.datPremiereImpayee | date: 'dd/MM/yyyy') : '' }}</td>
                        <td class="text-right">{{ montantRetard(c.credit) | number: '1.0-0' }}</td>
                        <td>{{ c.agentNom || 'Non affecté' }}</td>
                        <td><p-tag *ngIf="c.contentieuxDeclare" severity="warn" value="contentieux déclaré"></p-tag></td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr><td colspan="10" class="text-center text-gray-500 py-4">Aucun crédit pour ce filtre.</td></tr>
                </ng-template>
            </p-table>
        </p-dialog>
    `
})
export class PortefeuilleRisqueComponent implements OnInit {
    private readonly userService = inject(UserService);
    private readonly messageService = inject(MessageService);
    private readonly destroyRef = inject(DestroyRef);

    agences = signal<AgenceSaf[]>([]);
    agence = signal<AgenceSaf | null>(null);
    data = signal<PortefeuilleRisque | null>(null);
    loading = signal(false);
    exportEnCours = signal(false);

    filtreProduit = signal<LigneRisque | null>(null);
    filtreAgent = signal<LigneRisque | null>(null);

    // Dialogue des crédits derrière un chiffre
    showCredits = false;
    creditsTitre = signal('');
    credits = signal<CreditRisque[]>([]);
    loadingCredits = signal(false);
    tranche = signal<TrancheRisque>('30');
    private contexte: { tipCredito: number | null; agent: string | null } = { tipCredito: null, agent: null };
    trancheOptions = [
        { label: 'Tous', value: '' },
        { label: 'En retard', value: 'retard' },
        { label: '30 j et plus', value: '30' },
        { label: '90 j et plus', value: '90' }
    ];

    /** Tableau des produits : celui du point de service, ou la part de l'agent choisi. */
    lignesProduit = computed<LigneRisque[]>(() => {
        const d = this.data();
        if (!d) return [];
        const agent = this.filtreAgent();
        if (!agent) return d.parProduit;
        const libelles = new Map(d.parProduit.map((p) => [this.cleProduit(p.tipCredito), p.libelle]));
        return d.croisement
            .filter((x) => this.cleAgent(x) === agent.cle)
            .map((x) => ({ ...x, libelle: libelles.get(this.cleProduit(x.tipCredito)) || x.libelle }));
    });

    /** Tableau des agents : celui du point de service, ou la part de chacun dans le produit choisi. */
    lignesAgent = computed<LigneRisque[]>(() => {
        const d = this.data();
        if (!d) return [];
        const produit = this.filtreProduit();
        if (!produit) return d.parAgent;
        const noms = new Map(d.parAgent.map((a) => [a.cle, a]));
        const lignes = d.croisement
            .filter((x) => this.cleProduit(x.tipCredito) === produit.cle)
            .map((x) => {
                const a = noms.get(this.cleAgent(x));
                return { ...x, cle: this.cleAgent(x), libelle: a?.libelle || (x.nonAffecte ? 'Non affecté' : x.libelle), disponible: a?.disponible ?? x.disponible };
            });
        // « Non affecté » reste en bas, comme dans le tableau complet.
        return lignes.sort((a, b) => Number(a.nonAffecte) - Number(b.nonAffecte) || b.encoursPar30 - a.encoursPar30);
    });

    sommeEncours = computed(() => this.credits().reduce((s, c) => s + (c.credit.monSaldo || 0), 0));

    ngOnInit(): void {
        this.userService
            .getPortefeuilleAgences$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    const agences: AgenceSaf[] = (r.data as any)?.agences || [];
                    this.agences.set(agences);
                    if (agences.length === 1) {
                        this.agence.set(agences[0]);
                        this.charger();
                    }
                },
                error: (err) => this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Chargement des points de service impossible', life: 6000 })
            });
    }

    choisirAgence(a: AgenceSaf | null): void {
        this.agence.set(a);
        this.data.set(null);
        this.effacerFiltres();
        if (a) this.charger();
    }

    charger(): void {
        const a = this.agence();
        if (!a) return;
        this.loading.set(true);
        this.userService
            .getPortefeuilleRisque$(a.codAgencia)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.data.set(((r.data as any)?.risque as PortefeuilleRisque) || null);
                    this.loading.set(false);
                },
                error: (err) => {
                    this.loading.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Portefeuille à risque', detail: err || 'Lecture SAF impossible (clôture en cours ?)', life: 7000 });
                }
            });
    }

    choisirProduit(l: LigneRisque): void {
        const meme = this.filtreProduit()?.cle === l.cle;
        this.filtreAgent.set(null);
        this.filtreProduit.set(meme ? null : l);
    }

    choisirAgent(l: LigneRisque): void {
        const meme = this.filtreAgent()?.cle === l.cle;
        this.filtreProduit.set(null);
        this.filtreAgent.set(meme ? null : l);
    }

    effacerFiltres(): void {
        this.filtreProduit.set(null);
        this.filtreAgent.set(null);
    }

    /**
     * Ouvre la liste des crédits derrière une ligne. Une ligne produit filtrée par agent (ou
     * l'inverse) est un croisement : les deux filtres partent ensemble.
     */
    voirCredits(l: LigneRisque, tranche: TrancheRisque): void {
        const estLigneAgent = l.agentUserId != null || l.nonAffecte;
        const tipCredito = l.tipCredito ?? (estLigneAgent ? (this.filtreProduit()?.tipCredito ?? null) : null);
        const agent = estLigneAgent ? this.cleAgent(l) : this.filtreAgent() ? this.cleAgent(this.filtreAgent()!) : null;
        this.contexte = { tipCredito, agent };
        this.creditsTitre.set(`Crédits — ${l.libelle}` + (this.filtreProduit() && estLigneAgent ? ` · ${this.filtreProduit()!.libelle}` : '') + (this.filtreAgent() && !estLigneAgent ? ` · ${this.filtreAgent()!.libelle}` : ''));
        this.tranche.set(tranche);
        this.showCredits = true;
        this.chargerCredits();
    }

    changerTranche(t: TrancheRisque): void {
        this.tranche.set(t);
        this.chargerCredits();
    }

    private chargerCredits(): void {
        const a = this.agence();
        if (!a) return;
        this.loadingCredits.set(true);
        this.credits.set([]);
        this.userService
            .getPortefeuilleRisqueCredits$(a.codAgencia, this.contexte.tipCredito, this.contexte.agent, this.tranche() || null)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.credits.set(((r.data as any)?.credits as CreditRisque[]) || []);
                    this.loadingCredits.set(false);
                },
                error: (err) => {
                    this.loadingCredits.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Crédits', detail: err || 'Lecture impossible', life: 6000 });
                }
            });
    }

    exporter(): void {
        const a = this.agence();
        if (!a) return;
        this.telecharger(this.userService.exportPortefeuilleRisque$(a.codAgencia), `portefeuille_risque_${a.codAgencia}.xlsx`);
    }

    private telecharger(flux: Observable<HttpResponse<Blob>>, nomParDefaut: string): void {
        this.exportEnCours.set(true);
        flux.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (reponse) => {
                this.exportEnCours.set(false);
                const disposition = reponse.headers.get('Content-Disposition') || '';
                const nom = /filename="?([^";]+)"?/.exec(disposition)?.[1] || nomParDefaut;
                const url = URL.createObjectURL(reponse.body as Blob);
                const lien = document.createElement('a');
                lien.href = url;
                lien.download = nom;
                lien.click();
                URL.revokeObjectURL(url);
            },
            error: () => {
                this.exportEnCours.set(false);
                this.messageService.add({ severity: 'error', summary: 'Export', detail: "Échec de l'export Excel — réessayez (base SAF indisponible ?)", life: 6000 });
            }
        });
    }

    part(valeur: number, total: number): number {
        return total ? (valeur / total) * 100 : 0;
    }

    montantRetard(c: { mntCapImpaye?: number; mntIntImpaye?: number }): number {
        return (c.mntCapImpaye || 0) + (c.mntIntImpaye || 0);
    }

    cleProduit(tipCredito: number | null | undefined): string {
        return tipCredito === null || tipCredito === undefined ? 'SANS_TYPE' : String(tipCredito);
    }

    cleAgent(l: LigneRisque): string {
        return l.nonAffecte ? NON_AFFECTE : String(l.agentUserId);
    }
}
