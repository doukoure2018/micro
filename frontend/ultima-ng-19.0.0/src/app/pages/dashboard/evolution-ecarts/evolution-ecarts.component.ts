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
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
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

/** Une variation : un couple (point de service, compte comptable) dont l'écart a changé entre deux photos. */
interface VariationCouple {
    codAgencia: string;
    libellePoint?: string;
    libelleAgence?: string;
    libelleDelegation?: string;
    compteComptable: string;
    produits?: string;
    ecartReference?: number | null;
    ecartJour?: number | null;
    variation: number;
    variationClient?: number;
    variationComptable?: number;
    etatReference?: string;
    etatJour?: string;
    statut: string;
    cote?: string | null;
    explication?: string;
}

/** Un compte comptable, tous points de service confondus. */
interface VariationCompte {
    compteComptable: string;
    produits?: string;
    nbPoints: number;
    variationNette: number;
    variationAbsolue: number;
    coteDominant?: string | null;
    nbApparus: number;
    nbAggraves: number;
    nbReduits: number;
    nbResolus: number;
    nbNouvelles: number;
    nbDisparues: number;
    nbMouvements: number;
}

interface PointExclu {
    codAgencia: string;
    libellePoint?: string;
    dansJour: boolean;
    dansReference: boolean;
}

interface Variations {
    photo: PointJour | null;
    reference: PointJour | null;
    seuil: number;
    pointsCompares: number;
    pointsExclus: PointExclu[];
    nbCouples: number;
    sommeAggravations?: number | null;
    sommeResolutions?: number | null;
    partCinqPremiers?: number | null;
    comptes: VariationCompte[];
    couples: VariationCouple[];
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
    imports: [CommonModule, FormsModule, ButtonModule, ChartModule, DialogModule, InputNumberModule, ProgressSpinnerModule, SelectModule, SelectButtonModule, TableModule, TagModule, ToastModule, TooltipModule],
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
                <div class="flex flex-wrap items-center gap-2">
                    <p-selectButton [options]="vues" [(ngModel)]="vue" optionLabel="label" optionValue="value" [allowEmpty]="false"
                        (onChange)="changerVue()"></p-selectButton>
                    <p-select [options]="modules" [(ngModel)]="module" optionLabel="label" optionValue="value"
                        (onChange)="charger()" styleClass="w-56"
                        pTooltip="Le module du tableau et des indicateurs ; la courbe montre les trois" tooltipPosition="bottom"></p-select>
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
                    <div class="text-sm font-medium">Écart total du réseau, jour par jour — les trois modules</div>
                    <div class="text-xs text-gray-500">les jours incomplets sont marqués en orange · un module sans photo laisse un trou, jamais un zéro</div>
                </div>
                <p-chart type="line" [data]="graphReseau()" [options]="optionsCourbe" height="260px"></p-chart>
            </div>

            @if (vue === 'JOUR') {
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
            } @else {
            <!-- L'onglet Variations : entrer par ce qui a bougé -->
            <div class="flex flex-wrap items-end justify-between gap-3 mb-3">
                <div>
                    <h3 class="text-base font-semibold m-0">Ce qui a bougé entre deux photos</h3>
                    <div class="text-xs text-gray-500 mt-1">
                        @if (variations()?.reference) {
                        du {{ variations()!.reference!.jour | date: 'dd/MM/yyyy' }} au {{ variations()!.photo!.jour | date: 'dd/MM/yyyy' }}
                        · {{ variations()!.pointsCompares }} point(s) de service comparés
                        · variations sous {{ variations()!.seuil | number: '1.0-0' }} GNF masquées
                        } @else {
                        la photo précédente sert de référence ; choisissez un autre jour pour lire une semaine d'un coup
                        }
                    </div>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <p-select [options]="joursReference()" [(ngModel)]="reference" optionLabel="label" optionValue="value"
                        placeholder="Photo précédente" [showClear]="true" (onChange)="chargerVariations()" styleClass="w-48"
                        pTooltip="La photo à laquelle comparer le jour lu" tooltipPosition="bottom"></p-select>
                    <p-inputNumber [(ngModel)]="seuil" [min]="0" [useGrouping]="true" suffix=" GNF" inputStyleClass="w-36"
                        (onBlur)="chargerVariations()" pTooltip="Variation en dessous de laquelle un couple ne s'affiche pas" tooltipPosition="bottom"></p-inputNumber>
                    <p-selectButton [options]="vuesVariations" [(ngModel)]="vueVariations" optionLabel="label" optionValue="value" [allowEmpty]="false"></p-selectButton>
                    <button pButton icon="pi pi-refresh" class="p-button-outlined p-button-sm" [loading]="chargementVariations()" (click)="chargerVariations()"></button>
                </div>
            </div>

            @if (chargementVariations()) {
            <div class="flex justify-center py-8"><p-progressSpinner styleClass="w-3rem h-3rem"></p-progressSpinner></div>
            } @else if (!variations()?.reference) {
            <div class="p-4 border-l-4 border-gray-400 bg-gray-50 rounded text-sm">
                <div class="font-semibold text-gray-800"><i class="pi pi-info-circle mr-2"></i>Rien à comparer encore</div>
                <p class="text-gray-600 mt-2 mb-0">Une seule photo existe pour ce module. La première variation se lira dès la photo suivante.</p>
            </div>
            } @else {
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500">Couples qui bougent</div>
                    <div class="text-2xl font-semibold">{{ variations()!.nbCouples }}</div>
                    <div class="text-xs text-gray-500">(point de service, compte comptable)</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500">Écarts qui se creusent</div>
                    <div class="text-2xl font-semibold text-red-600">{{ (variations()!.sommeAggravations || 0) | number: '1.2-2' }}</div>
                    <div class="text-xs text-gray-500">GNF, en valeur absolue</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500">Écarts qui se résorbent</div>
                    <div class="text-2xl font-semibold text-green-700">{{ (variations()!.sommeResolutions || 0) | number: '1.2-2' }}</div>
                    <div class="text-xs text-gray-500">GNF, en valeur absolue</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500">Part des 5 premiers comptes</div>
                    <div class="text-2xl font-semibold">
                        {{ variations()!.partCinqPremiers === null || variations()!.partCinqPremiers === undefined ? '—' : (variations()!.partCinqPremiers! | percent: '1.0-0') }}
                    </div>
                    <div class="text-xs text-gray-500">de la variation absolue du réseau</div>
                </div>
            </div>

            @if (variations()!.pointsExclus.length) {
            <div class="mb-3 p-3 border-l-4 border-orange-400 bg-orange-50 rounded text-sm text-orange-800">
                <i class="pi pi-exclamation-triangle mr-2"></i>
                {{ variations()!.pointsExclus.length }} point(s) de service présents dans une seule des deux photos sont comptés à part et absents
                des tableaux : une disparition due à une photo incomplète n'est pas une correction.
                <span class="text-xs" [pTooltip]="libellePointsExclus()" tooltipPosition="bottom"><u>Lesquels ?</u></span>
            </div>
            }

            @if (vueVariations === 'COMPTE') {
            <p-table [value]="variations()!.comptes" dataKey="compteComptable" styleClass="p-datatable-sm" [scrollable]="true"
                [paginator]="variations()!.comptes.length > 25" [rows]="25" [expandedRowKeys]="comptesDeplies">
                <ng-template pTemplate="header">
                    <tr>
                        <th style="width: 3rem"></th>
                        <th>Compte comptable</th><th>Produits</th>
                        <th class="text-right">PS qui bougent</th>
                        <th class="text-right">Variation nette (GNF)</th>
                        <th class="text-right">Variation absolue (GNF)</th>
                        <th>Côté dominant</th>
                        <th class="text-right" pTooltip="apparus / aggravés / réduits / résolus">App. / Agg. / Réd. / Rés.</th>
                        <th class="text-right" pTooltip="lignes nouvelles / disparues / mouvements">Nouv. / Disp. / Mouv.</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-c let-expanded="expanded">
                    <tr>
                        <td><button type="button" pButton [pRowToggler]="c" class="p-button-text p-button-rounded p-button-plain p-button-sm"
                                [icon]="expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"></button></td>
                        <td class="font-mono text-xs font-semibold">{{ c.compteComptable }}</td>
                        <td class="text-xs">{{ c.produits || '—' }}</td>
                        <td class="text-right">{{ c.nbPoints }}</td>
                        <td class="text-right font-semibold" [class.text-red-600]="c.variationNette > 0" [class.text-green-700]="c.variationNette < 0">{{ c.variationNette | number: '1.2-2' }}</td>
                        <td class="text-right">{{ c.variationAbsolue | number: '1.2-2' }}</td>
                        <td><p-tag [value]="c.coteDominant || '—'" [severity]="severiteCote(c.coteDominant)"></p-tag></td>
                        <td class="text-right text-sm"><span class="text-red-600">{{ c.nbApparus }}</span> / <span class="text-red-600">{{ c.nbAggraves }}</span> / <span class="text-green-700">{{ c.nbReduits }}</span> / <span class="text-green-700">{{ c.nbResolus }}</span></td>
                        <td class="text-right text-sm">{{ c.nbNouvelles }} / {{ c.nbDisparues }} / {{ c.nbMouvements }}</td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="expandedrow" let-c>
                    <tr>
                        <td colspan="9" class="bg-gray-50 p-2">
                            <p-table [value]="couplesParCompte().get(c.compteComptable) || []" styleClass="p-datatable-sm" [scrollable]="true">
                                <ng-template pTemplate="header">
                                    <tr>
                                        <th>Point de service</th><th>Agence</th>
                                        <th class="text-right">Écart réf. (GNF)</th><th class="text-right">Écart du jour (GNF)</th>
                                        <th class="text-right">Variation</th><th>Statut</th><th>Côté</th><th>Explication</th>
                                    </tr>
                                </ng-template>
                                <ng-template pTemplate="body" let-v>
                                    <tr>
                                        <td class="text-sm">{{ v.libellePoint || v.codAgencia }}<span class="text-xs text-gray-500"> ({{ v.codAgencia }})</span></td>
                                        <td class="text-xs">{{ v.libelleAgence || '—' }}</td>
                                        <td class="text-right text-sm">{{ v.ecartReference === null || v.ecartReference === undefined ? '—' : (v.ecartReference | number: '1.2-2') }}</td>
                                        <td class="text-right text-sm">{{ v.ecartJour === null || v.ecartJour === undefined ? '—' : (v.ecartJour | number: '1.2-2') }}</td>
                                        <td class="text-right font-semibold" [class.text-red-600]="v.variation > 0" [class.text-green-700]="v.variation < 0">{{ v.variation | number: '1.2-2' }}</td>
                                        <td><p-tag [value]="v.statut" [severity]="severiteStatut(v.statut)"></p-tag></td>
                                        <td class="text-xs">{{ v.cote || '—' }}</td>
                                        <td class="text-xs text-gray-600">{{ v.explication }}</td>
                                    </tr>
                                </ng-template>
                            </p-table>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr><td colspan="9" class="text-center text-gray-500 py-4">Aucun compte comptable n'a bougé au-dessus du seuil entre ces deux photos.</td></tr>
                </ng-template>
            </p-table>
            } @else {
            <div class="flex items-center gap-2 mb-2">
                <p-select [options]="statuts" [(ngModel)]="statutFiltre" placeholder="Tous les statuts" [showClear]="true" styleClass="w-56" (onChange)="statutFiltreSignal.set(statutFiltre)"></p-select>
                <span class="text-xs text-gray-500">{{ couplesFiltres().length }} couple(s) · les plus grosses variations d'abord</span>
            </div>
            <p-table [value]="couplesFiltres()" styleClass="p-datatable-sm" [scrollable]="true" [paginator]="couplesFiltres().length > 25" [rows]="25">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Délégation</th><th>Agence</th><th>Point de service</th><th>Compte comptable</th>
                        <th class="text-right">Écart réf. (GNF)</th><th class="text-right">Écart du jour (GNF)</th>
                        <th class="text-right">Variation</th><th class="text-right">Δ client</th><th class="text-right">Δ comptabilité</th>
                        <th>Statut</th><th>Côté</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-v>
                    <tr [pTooltip]="v.explication" tooltipPosition="top">
                        <td class="text-xs">{{ v.libelleDelegation || '—' }}</td>
                        <td class="text-xs">{{ v.libelleAgence || '—' }}</td>
                        <td class="text-sm font-medium">{{ v.libellePoint || v.codAgencia }}<span class="text-xs text-gray-500"> ({{ v.codAgencia }})</span></td>
                        <td class="font-mono text-xs">{{ v.compteComptable }}</td>
                        <td class="text-right text-sm">{{ v.ecartReference === null || v.ecartReference === undefined ? '—' : (v.ecartReference | number: '1.2-2') }}</td>
                        <td class="text-right text-sm">{{ v.ecartJour === null || v.ecartJour === undefined ? '—' : (v.ecartJour | number: '1.2-2') }}</td>
                        <td class="text-right font-semibold" [class.text-red-600]="v.variation > 0" [class.text-green-700]="v.variation < 0">{{ v.variation | number: '1.2-2' }}</td>
                        <td class="text-right text-sm">{{ v.variationClient === null || v.variationClient === undefined ? '—' : (v.variationClient | number: '1.2-2') }}</td>
                        <td class="text-right text-sm">{{ v.variationComptable === null || v.variationComptable === undefined ? '—' : (v.variationComptable | number: '1.2-2') }}</td>
                        <td><p-tag [value]="v.statut" [severity]="severiteStatut(v.statut)"></p-tag></td>
                        <td class="text-xs">{{ v.cote || '—' }}</td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr><td colspan="11" class="text-center text-gray-500 py-4">Aucune variation au-dessus du seuil entre ces deux photos.</td></tr>
                </ng-template>
            </p-table>
            }
            <p class="text-xs text-gray-500 mt-3 mb-0">
                Le côté dit quel solde a bougé : « client seul » oriente vers des mouvements sans écriture, « comptabilité seule » vers une
                écriture manuelle ou passée sur un autre compte. Pour voir les opérations, ouvrez le point de service et le compte dans l'outil
                de rapprochement sur la fenêtre entre les deux photos.
            </p>
            }
            }
            }
        </div>

        <!-- Le détail d'un point de service -->
        <p-dialog [header]="titrePoint()" [(visible)]="afficherPoint" [modal]="true" [style]="{ width: '92vw', maxWidth: '1200px' }" [dismissableMask]="true">
            @if (chargementPoint()) {
            <div class="flex justify-center py-6"><p-progressSpinner styleClass="w-2rem h-2rem"></p-progressSpinner></div>
            } @else {
            <div class="border rounded p-3 mb-4">
                <div class="text-sm font-medium mb-1">Écart de ce point de service, jour par jour ({{ libelleModule() }})</div>
                <p-chart type="line" [data]="graphPoint()" [options]="optionsPoint" height="220px"></p-chart>
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

    readonly vues = [
        { label: 'Situation du jour', value: 'JOUR' },
        { label: 'Variations', value: 'VARIATIONS' }
    ];
    readonly vuesVariations = [
        { label: 'Par compte comptable', value: 'COMPTE' },
        { label: 'Par point de service', value: 'COUPLE' }
    ];
    readonly statuts = ['Écart apparu', 'Écart aggravé', 'Écart réduit', 'Écart résolu', 'Ligne nouvelle', 'Ligne disparue', 'Mouvement'];

    module = 'COMPTES';
    jours = 30;
    vue: 'JOUR' | 'VARIATIONS' = 'JOUR';
    vueVariations: 'COMPTE' | 'COUPLE' = 'COMPTE';
    /** Le jour de la photo de référence ; null = la photo précédente. */
    reference: string | null = null;
    /** Variation absolue en dessous de laquelle un couple ne s'affiche pas (seuil d'écart mineur de l'outil). */
    seuil = 1000;
    statutFiltre: string | null = null;
    comptesDeplies: Record<string, boolean> = {};

    readonly chargementVariations = signal(false);
    readonly variations = signal<Variations | null>(null);
    readonly joursConnus = signal<string[]>([]);

    /** Les jours proposés comme référence : ceux d'avant la photo lue. */
    readonly joursReference = computed(() => {
        const courant = this.photo()?.jour;
        return this.joursConnus()
            .filter((j) => !courant || j < courant)
            .map((j) => ({ label: this.jourLong(j), value: j }));
    });

    /** Les couples d'un compte, calculés une fois : jamais un tableau neuf par rendu. */
    readonly couplesParCompte = computed(() => {
        const parCompte = new Map<string, VariationCouple[]>();
        for (const v of this.variations()?.couples || []) {
            const liste = parCompte.get(v.compteComptable) || [];
            liste.push(v);
            parCompte.set(v.compteComptable, liste);
        }
        return parCompte;
    });

    readonly couplesFiltres = computed(() => {
        const couples = this.variations()?.couples || [];
        const statut = this.statutFiltreSignal();
        return statut ? couples.filter((v) => v.statut === statut) : couples;
    });
    readonly statutFiltreSignal = signal<string | null>(null);

    readonly libellePointsExclus = computed(() =>
        (this.variations()?.pointsExclus || [])
            .map((p) => `${p.libellePoint || p.codAgencia} (${p.codAgencia}) : ${p.dansJour ? 'absent de la référence' : 'absent du jour'}`)
            .join(' · ')
    );

    readonly chargement = signal(false);
    readonly photo = signal<PointJour | null>(null);
    readonly points = signal<LignePhoto[]>([]);
    /** Une courbe par module : les trois se lisent ensemble. */
    readonly courbes = signal<Record<string, PointJour[]>>({});

    afficherPoint = false;
    readonly chargementPoint = signal(false);
    readonly pointChoisi = signal<LignePhoto | null>(null);
    readonly comptes = signal<LignePhoto[]>([]);
    readonly seriePoint = signal<PointSerie[]>([]);

    /** Le jour précédent de la courbe : c'est lui qui donne la variation du réseau. */
    readonly variationReseau = computed<number | null>(() => {
        const serie = this.courbes()[this.module] || [];
        if (serie.length < 2) return null;
        const dernier = serie[serie.length - 1];
        const avant = serie[serie.length - 2];
        return dernier.ecartTotal - avant.ecartTotal;
    });

    /** Le détail ne porte qu'une série : sa légende n'apprend rien. */
    readonly optionsPoint = {
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { ticks: { callback: (v: any) => new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(v) } }
        }
    };

    readonly libelleModule = computed(() => this.modules.find((m) => m.value === this.module)?.label || this.module);

    readonly titrePoint = computed(() => {
        const p = this.pointChoisi();
        return p ? `${p.libellePoint || p.codAgencia} (${p.codAgencia})` : 'Point de service';
    });

    /**
     * Les trois modules sur un même graphe, une ligne chacun.
     *
     * Les trois écarts se lisent ensemble ou pas du tout : un écart qui passe des comptes
     * clients aux dépôts à terme ne se voit sur aucune courbe prise isolément. L'axe des jours
     * est l'union des jours photographiés ; un module sans photo ce jour-là laisse un trou
     * (`null`), jamais un zéro, qui se lirait comme une concordance.
     *
     * Un jour incomplet porte un point orange plus gros : sa baisse ne veut pas dire une
     * amélioration, elle peut venir de points de service non lus.
     */
    readonly graphReseau = computed(() => {
        const courbes = this.courbes();
        const jours = [...new Set(this.modules.flatMap((m) => (courbes[m.value] || []).map((p) => p.jour)))].sort();
        return {
            labels: jours.map((j) => this.jourCourt(j)),
            datasets: this.modules.map((m) => {
                const serie = courbes[m.value] || [];
                const parJour = new Map(serie.map((p) => [p.jour, p]));
                const couleur = this.COULEURS[m.value];
                return {
                    label: m.label,
                    data: jours.map((j) => (parJour.has(j) ? parJour.get(j)!.ecartTotal : null)),
                    borderColor: couleur,
                    backgroundColor: couleur,
                    pointBackgroundColor: jours.map((j) => (parJour.get(j)?.complete === false ? '#f97316' : couleur)),
                    pointRadius: jours.map((j) => (parJour.has(j) ? (parJour.get(j)!.complete ? 3 : 6) : 0)),
                    spanGaps: true,
                    fill: false,
                    tension: 0.25
                };
            })
        };
    });

    /** Une couleur par module, la même partout : on compare trois lignes, pas trois écrans. */
    readonly COULEURS: Record<string, string> = {
        COMPTES: '#2563eb',
        CREDITS: '#15803d',
        DAT: '#b45309'
    };

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

    /** Trois séries : la légende est nécessaire pour savoir laquelle est laquelle. */
    readonly optionsCourbe = {
        maintainAspectRatio: false,
        plugins: { legend: { display: true, position: 'bottom' } },
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

    private jourLong(iso: string): string {
        return iso ? iso.slice(8, 10) + '/' + iso.slice(5, 7) + '/' + iso.slice(0, 4) : '';
    }

    changerVue(): void {
        if (this.vue === 'VARIATIONS' && !this.variations()) {
            this.chargerVariations();
        }
    }

    severiteStatut(statut: string): 'success' | 'danger' | 'warn' | 'info' | 'secondary' {
        if (statut === 'Écart apparu' || statut === 'Écart aggravé') return 'danger';
        if (statut === 'Écart résolu' || statut === 'Écart réduit') return 'success';
        if (statut === 'Ligne nouvelle' || statut === 'Ligne disparue') return 'warn';
        return 'secondary';
    }

    severiteCote(cote?: string | null): 'info' | 'warn' | 'secondary' | 'contrast' {
        if (cote === 'Client seul') return 'info';
        if (cote === 'Comptabilité seule') return 'warn';
        if (cote === 'Les deux côtés') return 'contrast';
        return 'secondary';
    }

    /** Les variations entre la photo lue et sa référence, dans le périmètre du compte connecté. */
    chargerVariations(): void {
        this.statutFiltreSignal.set(this.statutFiltre);
        this.chargementVariations.set(true);
        this.comptesDeplies = {};
        this.userService
            .getVariationsEcarts$(this.module, undefined, this.reference || undefined, this.seuil ?? 1000)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.variations.set((r.data as any)?.variations || null);
                    this.chargementVariations.set(false);
                },
                error: (err: any) => {
                    this.chargementVariations.set(false);
                    this.variations.set(null);
                    this.messageService.add({ severity: 'error', summary: 'Variations indisponibles', detail: err || '', life: 7000 });
                }
            });
    }

    private chargerJours(): void {
        this.userService
            .getJoursEcarts$(this.module)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => this.joursConnus.set((r.data as any)?.jours || []),
                error: () => this.joursConnus.set([])
            });
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
                    this.chargerJours();
                    this.reference = null;
                    this.variations.set(null);
                    if (this.vue === 'VARIATIONS') {
                        this.chargerVariations();
                    }
                },
                error: (err: any) => {
                    this.chargement.set(false);
                    this.photo.set(null);
                    this.points.set([]);
                    this.messageService.add({ severity: 'error', summary: 'Lecture impossible', detail: err || '', life: 7000 });
                }
            });
    }

    /** Les trois courbes, chargées indépendamment : un module sans photo n'empêche pas les autres. */
    chargerCourbe(): void {
        for (const m of this.modules) {
            this.userService
                .getCourbeEcarts$(m.value, this.jours)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (r: IResponse) => this.courbes.update((c) => ({ ...c, [m.value]: (r.data as any)?.courbe || [] })),
                    error: () => this.courbes.update((c) => ({ ...c, [m.value]: [] }))
                });
        }
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
