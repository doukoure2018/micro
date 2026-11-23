import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

/** Un point de la courbe du réseau. */
interface PointJour {
    jour: string;
    module: string;
    ecartTotal: number;
    soldeClient?: number;
    soldeComptable?: number;
    nbLignes?: number;
    nbConcordantes?: number;
    nbEcarts?: number;
    pointsLus?: number;
    pointsAttendus?: number;
    complete: boolean;
    horodatage?: string;
}

/** Une ligne du tableau : un point de service, ou un compte comptable d'un point de service. */
interface LignePhoto {
    codAgencia: string;
    libellePoint?: string;
    codAgence?: string;
    libelleAgence?: string;
    codDelegation?: string;
    libelleDelegation?: string;
    compteComptable?: string;
    produits?: string;
    nbComptes?: number;
    ecart: number;
    soldeClient?: number;
    soldeComptable?: number;
    etat?: string;
    ecartVeille?: number;
    variation?: number;
}

interface PointSerie {
    jour: string;
    ecart: number;
    nbComptes?: number;
}

/**
 * Évolution des écarts de rapprochement (V217).
 *
 * L'outil de bureau rapproche les encours clients avec la comptabilité générale et fige son
 * écart total chaque matin. Cet écran lit ces photos : la courbe du réseau, le tableau du jour
 * par point de service, et la courbe d'un point de service avec ses comptes comptables.
 *
 * Rien n'est calculé ici. Le calcul vit dans l'outil, qui lit SAF depuis le réseau interne ;
 * digi reçoit, range et affiche. Une photo incomplète est signalée comme telle : un total qui
 * baisse parce que des points de service n'ont pas été lus ne doit jamais ressembler à une
 * amélioration.
 */
@Component({
    selector: 'app-evolution-ecarts',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, ChartModule, DialogModule, ProgressSpinnerModule, SelectModule, TableModule, TagModule, ToastModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>
        <div class="card">
            <div class="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                    <h2 class="text-xl font-semibold m-0">Évolution des écarts de rapprochement</h2>
                    <p class="text-sm text-gray-500 mt-1 mb-0 max-w-3xl">
                        Écart entre les encours des comptes clients et la comptabilité générale, figé chaque matin par
                        l'outil de rapprochement. Une photo par jour et par module : la dernière de la journée fait foi.
                    </p>
                </div>
                <div class="flex items-center gap-2">
                    <p-select [options]="modules" [(ngModel)]="module" optionLabel="label" optionValue="value"
                        (onChange)="charger()" styleClass="w-56"></p-select>
                    <p-select [options]="fenetres" [(ngModel)]="jours" optionLabel="label" optionValue="value"
                        (onChange)="chargerCourbe()" styleClass="w-40"></p-select>
                    <button pButton icon="pi pi-refresh" label="Actualiser" class="p-button-outlined p-button-sm"
                        [loading]="chargement()" (click)="charger()"></button>
                </div>
            </div>

            @if (chargement()) {
            <div class="flex justify-center py-8"><p-progressSpinner styleClass="w-3rem h-3rem"></p-progressSpinner></div>
            } @else if (!photo()) {
            <div class="p-4 border-l-4 border-gray-400 bg-gray-50 rounded text-sm">
                <div class="font-semibold text-gray-800"><i class="pi pi-info-circle mr-2"></i>Aucune photo enregistrée</div>
                <p class="text-gray-600 mt-2 mb-0">
                    L'outil de rapprochement n'a encore poussé aucune photo pour ce module. La première arrive au
                    prochain passage de la tâche de 7 h 45, ou dès qu'un rapprochement est lancé depuis le poste.
                </p>
            </div>
            } @else {
            <!-- Les indicateurs du jour photographié -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500">Écart total ({{ photo()!.jour | date: 'dd/MM/yyyy' }})</div>
                    <div class="text-2xl font-semibold" [class.text-red-600]="photo()!.ecartTotal !== 0">
                        {{ photo()!.ecartTotal | number: '1.2-2' }}
                    </div>
                    <div class="text-xs text-gray-500">GNF</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500">Variation depuis la photo précédente</div>
                    <div class="text-2xl font-semibold" [class.text-red-600]="(variationReseau() || 0) > 0"
                        [class.text-green-700]="(variationReseau() || 0) < 0">
                        {{ variationReseau() === null ? '—' : (variationReseau()! | number: '1.2-2') }}
                    </div>
                    <div class="text-xs text-gray-500">{{ variationReseau() === null ? 'pas de photo antérieure' : 'GNF' }}</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500">Lignes en écart</div>
                    <div class="text-2xl font-semibold">{{ photo()!.nbEcarts ?? '—' }}</div>
                    <div class="text-xs text-gray-500">sur {{ photo()!.nbLignes ?? '—' }} rapprochées</div>
                </div>
                <div class="border rounded p-3" [class.bg-orange-50]="!photo()!.complete">
                    <div class="text-xs text-gray-500">Points de service lus</div>
                    <div class="text-2xl font-semibold" [class.text-orange-700]="!photo()!.complete">
                        {{ photo()!.pointsLus ?? '—' }}<span class="text-base text-gray-500"> / {{ photo()!.pointsAttendus ?? '—' }}</span>
                    </div>
                    <div class="text-xs" [class.text-orange-700]="!photo()!.complete" [class.text-gray-500]="photo()!.complete">
                        {{ photo()!.complete ? 'photo complète' : 'photo incomplète' }}
                    </div>
                </div>
            </div>

            @if (!photo()!.complete) {
            <div class="mb-4 p-3 border-l-4 border-orange-400 bg-orange-50 rounded text-sm text-orange-800">
                <i class="pi pi-exclamation-triangle mr-2"></i>
                {{ (photo()!.pointsAttendus || 0) - (photo()!.pointsLus || 0) }} point(s) de service n'ont pas pu être lus ce jour-là
                (calendrier non aligné, agence en clôture, lecture trop longue). Leur écart manque au total :
                une baisse ne veut pas dire une amélioration.
            </div>
            }

            <!-- La courbe du réseau -->
            <div class="border rounded p-3 mb-4">
                <div class="flex items-center justify-between mb-1">
                    <div class="text-sm font-medium">Écart total du réseau, jour par jour</div>
                    <div class="text-xs text-gray-500">{{ courbe().length }} photo(s) · les jours incomplets sont marqués en orange</div>
                </div>
                <p-chart type="line" [data]="graphReseau()" [options]="optionsCourbe" height="260px"></p-chart>
            </div>

            <!-- Le tableau du jour -->
            <div class="flex items-center justify-between mb-2">
                <h3 class="text-base font-semibold m-0">Points de service au {{ photo()!.jour | date: 'dd/MM/yyyy' }}</h3>
                <span class="text-xs text-gray-500">{{ points().length }} point(s) de service · cliquez une ligne pour son détail</span>
            </div>
            <p-table [value]="points()" styleClass="p-datatable-sm" [paginator]="points().length > 20" [rows]="20"
                [scrollable]="true" selectionMode="single" (onRowSelect)="ouvrirPoint($event.data)">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Délégation</th><th>Agence</th><th>Point de service</th>
                        <th class="text-right">Écart (GNF)</th>
                        <th class="text-right">Variation</th>
                        <th class="text-right">Solde client</th>
                        <th class="text-right">Solde comptable</th>
                        <th class="text-right">Comptes</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-l>
                    <tr [pSelectableRow]="l" class="cursor-pointer">
                        <td class="text-xs">{{ l.libelleDelegation || '—' }}</td>
                        <td class="text-xs">{{ l.libelleAgence || '—' }}</td>
                        <td class="font-medium">{{ l.libellePoint || l.codAgencia }}<span class="text-xs text-gray-500"> ({{ l.codAgencia }})</span></td>
                        <td class="text-right font-semibold" [class.text-red-600]="l.ecart !== 0">{{ l.ecart | number: '1.2-2' }}</td>
                        <td class="text-right text-sm" [class.text-red-600]="(l.variation || 0) > 0" [class.text-green-700]="(l.variation || 0) < 0">
                            {{ l.variation === null || l.variation === undefined ? '—' : (l.variation | number: '1.2-2') }}
                        </td>
                        <td class="text-right text-sm">{{ l.soldeClient | number: '1.2-2' }}</td>
                        <td class="text-right text-sm">{{ l.soldeComptable | number: '1.2-2' }}</td>
                        <td class="text-right text-sm">{{ l.nbComptes ?? '—' }}</td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr><td colspan="8" class="text-center text-gray-500 py-4">Aucun point de service dans votre périmètre pour cette photo.</td></tr>
                </ng-template>
            </p-table>
            }
        </div>

        <!-- Le détail d'un point de service -->
        <p-dialog [header]="titrePoint()" [(visible)]="afficherPoint" [modal]="true" [style]="{ width: '92vw', maxWidth: '1200px' }" [dismissableMask]="true">
            @if (chargementPoint()) {
            <div class="flex justify-center py-6"><p-progressSpinner styleClass="w-2rem h-2rem"></p-progressSpinner></div>
            } @else {
            <div class="border rounded p-3 mb-4">
                <div class="text-sm font-medium mb-1">Écart de ce point de service, jour par jour</div>
                <p-chart type="line" [data]="graphPoint()" [options]="optionsCourbe" height="220px"></p-chart>
            </div>
            <div class="text-sm font-medium mb-2">Comptes comptables au {{ photo()?.jour | date: 'dd/MM/yyyy' }}</div>
            <p-table [value]="comptes()" styleClass="p-datatable-sm" [scrollable]="true">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Compte comptable</th><th>Produits</th>
                        <th class="text-right">Comptes</th>
                        <th class="text-right">Solde client</th>
                        <th class="text-right">Solde comptable</th>
                        <th class="text-right">Écart (GNF)</th>
                        <th class="text-right">Variation</th>
                        <th>État</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-c>
                    <tr>
                        <td class="font-mono text-xs">{{ c.compteComptable }}</td>
                        <td class="text-xs">{{ c.produits || '—' }}</td>
                        <td class="text-right text-sm">{{ c.nbComptes ?? '—' }}</td>
                        <td class="text-right text-sm">{{ c.soldeClient | number: '1.2-2' }}</td>
                        <td class="text-right text-sm">{{ c.soldeComptable | number: '1.2-2' }}</td>
                        <td class="text-right font-semibold" [class.text-red-600]="c.ecart !== 0">{{ c.ecart | number: '1.2-2' }}</td>
                        <td class="text-right text-sm" [class.text-red-600]="(c.variation || 0) > 0" [class.text-green-700]="(c.variation || 0) < 0">
                            {{ c.variation === null || c.variation === undefined ? '—' : (c.variation | number: '1.2-2') }}
                        </td>
                        <td><p-tag [value]="c.etat || '—'" [severity]="c.ecart === 0 ? 'success' : 'danger'"></p-tag></td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr><td colspan="8" class="text-center text-gray-500 py-4">Aucun compte comptable dans cette photo.</td></tr>
                </ng-template>
            </p-table>
            <p class="text-xs text-gray-500 mt-3 mb-0">
                Un écart total qui ne bouge pas peut cacher deux comptes qui bougent en sens contraire : c'est cette
                table qui le dit. Pour comprendre une ligne, ouvrez ses mouvements dans l'outil de rapprochement.
            </p>
            }
        </p-dialog>
    `
})
export class EvolutionEcartsComponent {
    private readonly userService = inject(UserService);
    private readonly messageService = inject(MessageService);
    private readonly destroyRef = inject(DestroyRef);

    readonly modules = [
        { label: 'Comptes clients', value: 'COMPTES' },
        { label: 'Crédits', value: 'CREDITS' },
        { label: 'Dépôts à terme', value: 'DAT' }
    ];
    readonly fenetres = [
        { label: '30 jours', value: 30 },
        { label: '60 jours', value: 60 },
        { label: '90 jours', value: 90 },
        { label: '1 an', value: 365 }
    ];

    module = 'COMPTES';
    jours = 30;

    readonly chargement = signal(false);
    readonly photo = signal<PointJour | null>(null);
    readonly points = signal<LignePhoto[]>([]);
    readonly courbe = signal<PointJour[]>([]);

    afficherPoint = false;
    readonly chargementPoint = signal(false);
    readonly pointChoisi = signal<LignePhoto | null>(null);
    readonly comptes = signal<LignePhoto[]>([]);
    readonly seriePoint = signal<PointSerie[]>([]);

    /** Le jour précédent de la courbe : c'est lui qui donne la variation du réseau. */
    readonly variationReseau = computed<number | null>(() => {
        const serie = this.courbe();
        if (serie.length < 2) return null;
        const dernier = serie[serie.length - 1];
        const avant = serie[serie.length - 2];
        return dernier.ecartTotal - avant.ecartTotal;
    });

    readonly titrePoint = computed(() => {
        const p = this.pointChoisi();
        return p ? `${p.libellePoint || p.codAgencia} (${p.codAgencia})` : 'Point de service';
    });

    /** Un jour incomplet est marqué : sa baisse ne veut pas dire une amélioration. */
    readonly graphReseau = computed(() => {
        const serie = this.courbe();
        return {
            labels: serie.map((p) => this.jourCourt(p.jour)),
            datasets: [
                {
                    label: 'Écart total (GNF)',
                    data: serie.map((p) => p.ecartTotal),
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.08)',
                    pointBackgroundColor: serie.map((p) => (p.complete ? '#2563eb' : '#f97316')),
                    pointRadius: serie.map((p) => (p.complete ? 3 : 6)),
                    fill: true,
                    tension: 0.25
                }
            ]
        };
    });

    readonly graphPoint = computed(() => {
        const serie = this.seriePoint();
        return {
            labels: serie.map((p) => this.jourCourt(p.jour)),
            datasets: [
                {
                    label: 'Écart du point de service (GNF)',
                    data: serie.map((p) => p.ecart),
                    borderColor: '#b45309',
                    backgroundColor: 'rgba(180, 83, 9, 0.08)',
                    fill: true,
                    tension: 0.25
                }
            ]
        };
    });

    readonly optionsCourbe = {
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { ticks: { callback: (v: any) => new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(v) } }
        }
    };

    constructor() {
        this.charger();
    }

    private jourCourt(iso: string): string {
        return iso ? iso.slice(8, 10) + '/' + iso.slice(5, 7) : '';
    }

    charger(): void {
        this.chargement.set(true);
        this.userService
            .getSituationEcarts$(this.module)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    const situation = (r.data as any)?.situation;
                    this.photo.set(situation?.photo || null);
                    this.points.set(situation?.points || []);
                    this.chargement.set(false);
                    this.chargerCourbe();
                },
                error: (err: any) => {
                    this.chargement.set(false);
                    this.photo.set(null);
                    this.points.set([]);
                    this.messageService.add({ severity: 'error', summary: 'Lecture impossible', detail: err || '', life: 7000 });
                }
            });
    }

    chargerCourbe(): void {
        this.userService
            .getCourbeEcarts$(this.module, this.jours)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => this.courbe.set((r.data as any)?.courbe || []),
                error: () => this.courbe.set([])
            });
    }

    ouvrirPoint(ligne: LignePhoto): void {
        this.pointChoisi.set(ligne);
        this.comptes.set([]);
        this.seriePoint.set([]);
        this.afficherPoint = true;
        this.chargementPoint.set(true);
        this.userService
            .getComptesEcarts$(this.module, ligne.codAgencia)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.comptes.set((r.data as any)?.comptes || []);
                    this.chargementPoint.set(false);
                },
                error: (err: any) => {
                    this.chargementPoint.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Détail indisponible', detail: err || '', life: 7000 });
                }
            });
        this.userService
            .getSerieEcartsPoint$(this.module, ligne.codAgencia, this.jours)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => this.seriePoint.set((r.data as any)?.serie || []),
                error: () => this.seriePoint.set([])
            });
    }
}
