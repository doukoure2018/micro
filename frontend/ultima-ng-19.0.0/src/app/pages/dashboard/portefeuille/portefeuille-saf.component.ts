import { IResponse } from '@/interface/response';
import { CapacitesSignalement, MOTIFS_SIGNALEMENT, MotifSignalementTelephone, SignalementTelephone, libelleMotifSignalement, libelleStatutSignalement, severiteStatutSignalement } from '@/interface/signalement-telephone';
import { SignalementTelephoneService } from '@/service/signalement-telephone.service';
import { FiltresTT1, UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { lastValueFrom } from 'rxjs';
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
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { Router } from '@angular/router';

/**
 * Suivi du portefeuille crédits SAF (phase 1) : crédits actifs d'une agence SAF,
 * indicateurs (encours, PAR 30/90, impayés) et échéancier détaillé.
 * Lecture seule — les retards apparaissent en tête de liste.
 */
@Component({
    selector: 'app-portefeuille-saf',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, DialogModule, DropdownModule, InputTextModule, SelectButtonModule, TableModule, TagModule, TextareaModule, ToastModule, TooltipModule],
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
                        <th>Téléphones</th>
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
                        <td class="whitespace-nowrap text-sm" style="font-variant-numeric: tabular-nums">
                            <div [class.text-gray-400]="!c.telPrincipal">
                                {{ c.telPrincipal || '—' }}
                                <i class="pi pi-exclamation-triangle text-orange-500 text-xs ml-1" *ngIf="formatDouteux(c.telPrincipal)" title="Ce numéro n'a pas 9 chiffres"></i>
                            </div>
                            <div [class.text-gray-400]="!c.telSecundario">{{ c.telSecundario || '—' }}</div>
                            <div [class.text-gray-400]="!c.telOtro">{{ c.telOtro || '—' }}</div>
                            <div class="mt-1" *ngIf="signalementDe(c.codCliente) as sig">
                                <p-tag [value]="libelleStatutSig(sig.statut)" [severity]="severiteStatutSig(sig.statut)" styleClass="text-xs"></p-tag>
                            </div>
                            <a class="text-xs text-primary cursor-pointer hover:underline" *ngIf="!signalementDe(c.codCliente) && capacites().estAgent" (click)="modifierNumero(c)">
                                <i class="pi pi-pencil text-xs mr-1"></i>Modifier le numéro
                            </a>
                            <a class="text-xs text-orange-600 cursor-pointer hover:underline" *ngIf="!signalementDe(c.codCliente) && capacites().peutSignaler" (click)="ouvrirSignalement(c)">
                                <i class="pi pi-flag text-xs mr-1"></i>Signaler le numéro
                            </a>
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
                        <td colspan="10" class="text-center py-6 text-gray-500">
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
                <p-selectButton *ngIf="state().agences.length > 1" [options]="modeOptions" [(ngModel)]="modeEch" optionLabel="label" optionValue="value" (onChange)="changerMode()"></p-selectButton>
                <p-selectButton
                    *ngIf="modeEch === 'synthese' && niveauOptions.length > 1"
                    [options]="niveauOptions"
                    [(ngModel)]="niveauSyn"
                    optionLabel="label"
                    optionValue="value"
                    (onChange)="chargerEcheances(0)"
                ></p-selectButton>
                <p-dropdown
                    *ngIf="state().agences.length > 1 && modeEch === 'detail'"
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
                    icon="pi pi-flag"
                    [label]="nbSignalementsOuverts() ? 'Signalements (' + nbSignalementsOuverts() + ')' : 'Signalements'"
                    class="p-button-outlined"
                    [class.p-button-warning]="nbSignalementsOuverts() > 0"
                    pTooltip="Numéros signalés au point de service et leur suivi"
                    (click)="ouvrirListeSignalements()"
                ></button>
                <button
                    pButton
                    icon="pi pi-print"
                    label="Imprimer"
                    class="p-button-outlined ml-auto"
                    pTooltip="Imprime l'état TT1 : en-tête, période, totaux, tableau et emplacement de signature"
                    [loading]="impressionEnCours()"
                    [disabled]="!du || !au"
                    (click)="imprimer()"
                ></button>
                <button
                    pButton
                    icon="pi pi-file-excel"
                    label="Exporter Excel"
                    class="p-button-success p-button-outlined"
                    pTooltip="Exporte toutes les échéances de la période (synthèse + répartition par point de service + détail), pas seulement la page affichée"
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

            <div class="flex flex-wrap items-center gap-2 mb-3 text-sm" *ngIf="filtreDelegation || filtreAgence">
                <span class="text-gray-500">Périmètre :</span>
                <a class="cursor-pointer text-primary hover:underline" (click)="remonter(null)">Tout mon périmètre</a>
                <ng-container *ngIf="filtreDelegation">
                    <i class="pi pi-angle-right text-gray-400"></i>
                    <a class="cursor-pointer text-primary hover:underline" (click)="remonter('delegation')">{{ filtreDelegation.libelle }}</a>
                </ng-container>
                <ng-container *ngIf="filtreAgence">
                    <i class="pi pi-angle-right text-gray-400"></i>
                    <span class="font-semibold">{{ filtreAgence.libelle }}</span>
                </ng-container>
            </div>

            @if (modeEch === 'synthese') {
            <p-table [value]="state().synthese" [loading]="state().loadingSyn" responsiveLayout="scroll" [rowHover]="true" sortMode="single">
                <ng-template pTemplate="header">
                    <tr>
                        <th pSortableColumn="libelle">{{ libelleNiveau(niveauSyn) }} <p-sortIcon field="libelle"></p-sortIcon></th>
                        <th class="text-center" *ngIf="niveauSyn !== 'ps'">Points de service</th>
                        <th class="text-right" pSortableColumn="indicateurs.nbEcheances">Échéances <p-sortIcon field="indicateurs.nbEcheances"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="indicateurs.montantAttendu">Attendu <p-sortIcon field="indicateurs.montantAttendu"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="indicateurs.montantRegle">Réglé <p-sortIcon field="indicateurs.montantRegle"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="indicateurs.resteAEncaisser">Reste à encaisser <p-sortIcon field="indicateurs.resteAEncaisser"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="indicateurs.tauxRecouvrement">Taux <p-sortIcon field="indicateurs.tauxRecouvrement"></p-sortIcon></th>
                        <th class="text-center" pSortableColumn="indicateurs.nbImpayees">Impayées <p-sortIcon field="indicateurs.nbImpayees"></p-sortIcon></th>
                        <th></th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-s>
                    <tr class="cursor-pointer" (click)="descendre(s)" [title]="s.niveau === 'PS' ? 'Voir les échéances de ce point de service' : 'Voir le détail'">
                        <td>
                            <span class="font-medium">{{ s.libelle }}</span>
                            <div class="text-xs text-gray-500" *ngIf="s.rattachement || s.code">{{ s.rattachement }}<span *ngIf="s.code"> · {{ s.code }}</span></div>
                        </td>
                        <td class="text-center" *ngIf="niveauSyn !== 'ps'">{{ s.nbPointsService }}</td>
                        <td class="text-right">{{ s.indicateurs?.nbEcheances }}</td>
                        <td class="text-right">{{ s.indicateurs?.montantAttendu | number: '1.0-0' }}</td>
                        <td class="text-right text-green-700">{{ s.indicateurs?.montantRegle | number: '1.0-0' }}</td>
                        <td class="text-right font-semibold" [class.text-red-600]="s.indicateurs?.nbImpayees > 0">{{ s.indicateurs?.resteAEncaisser | number: '1.0-0' }}</td>
                        <td class="text-right"><p-tag [value]="(s.indicateurs?.tauxRecouvrement | number: '1.1-1') + ' %'" [severity]="severiteTaux(s.indicateurs?.tauxRecouvrement)"></p-tag></td>
                        <td class="text-center">{{ s.indicateurs?.nbImpayees }}</td>
                        <td class="text-right"><i class="pi pi-angle-right text-gray-400"></i></td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr>
                        <td colspan="9" class="text-center text-gray-500 py-6">Aucune échéance sur cette période pour ces critères.</td>
                    </tr>
                </ng-template>
            </p-table>
            <p class="text-xs text-gray-500 mt-2" *ngIf="state().synthese.length">
                Lignes triées par reste à encaisser décroissant. Cliquez sur une ligne pour descendre d'un niveau, jusqu'aux échéances du point de service.
            </p>
            } @else {
            <p-table [value]="state().echeances" [loading]="state().loadingEch" responsiveLayout="scroll" [rowHover]="true">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Date</th>
                        <th *ngIf="!psEcheances && state().agences.length > 1">Point de service</th>
                        <th>Client</th>
                        <th>Téléphones</th>
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
                        <td class="whitespace-nowrap text-sm" style="font-variant-numeric: tabular-nums">
                            <div [class.text-gray-400]="!e.telPrincipal">
                                {{ e.telPrincipal || '—' }}
                                <i class="pi pi-exclamation-triangle text-orange-500 text-xs ml-1" *ngIf="formatDouteux(e.telPrincipal)" title="Ce numéro n'a pas 9 chiffres"></i>
                            </div>
                            <div [class.text-gray-400]="!e.telSecundario">{{ e.telSecundario || '—' }}</div>
                            <div [class.text-gray-400]="!e.telOtro">{{ e.telOtro || '—' }}</div>
                            <div class="mt-1" *ngIf="signalementDe(e.codCliente) as sig">
                                <p-tag [value]="libelleStatutSig(sig.statut)" [severity]="severiteStatutSig(sig.statut)" styleClass="text-xs"></p-tag>
                            </div>
                            <a class="text-xs text-primary cursor-pointer hover:underline" *ngIf="!signalementDe(e.codCliente) && capacites().estAgent" (click)="modifierNumero(e)">
                                <i class="pi pi-pencil text-xs mr-1"></i>Modifier le numéro
                            </a>
                            <a class="text-xs text-orange-600 cursor-pointer hover:underline" *ngIf="!signalementDe(e.codCliente) && capacites().peutSignaler" (click)="ouvrirSignalement(e)">
                                <i class="pi pi-flag text-xs mr-1"></i>Signaler le numéro
                            </a>
                        </td>
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
                        <td colspan="11" class="text-center text-gray-500 py-6">Aucune échéance sur cette période pour ces critères.</td>
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
            }
        </div>

        <!-- Dialog : signaler un numéro (DA, DR, DE) -->
        <p-dialog header="Signaler le numéro de téléphone" [visible]="showSignalement()" (visibleChange)="!$event && fermerSignalement()" [modal]="true" [style]="{ width: '560px' }">
            <div *ngIf="ligneSignalee as e">
                <p class="m-0 mb-3 text-sm">
                    <strong>{{ e.nomCliente }}</strong> ({{ e.codCliente }})<span *ngIf="e.numCredito"> — crédit {{ e.numCredito }}</span><span *ngIf="e.desAgencia"> — {{ e.desAgencia }}</span>
                </p>
                <div class="border rounded p-2 mb-3 text-sm" style="font-variant-numeric: tabular-nums">
                    <div class="text-xs text-gray-500 uppercase mb-1">Numéros constatés dans SAF</div>
                    <div [class.text-gray-400]="!e.telPrincipal">Principal : {{ e.telPrincipal || '—' }}</div>
                    <div [class.text-gray-400]="!e.telSecundario">Secondaire : {{ e.telSecundario || '—' }}</div>
                    <div [class.text-gray-400]="!e.telOtro">Autre : {{ e.telOtro || '—' }}</div>
                </div>
                <label class="block text-sm font-medium mb-1">Motif <span class="text-red-500">*</span></label>
                <p-dropdown [options]="motifsSignalement" [(ngModel)]="motifSignalement" optionLabel="label" optionValue="value" styleClass="w-full mb-3" appendTo="body" placeholder="Choisir un motif"></p-dropdown>
                <label class="block text-sm font-medium mb-1">Commentaire</label>
                <textarea pTextarea [(ngModel)]="commentaireSignalement" rows="3" class="w-full" maxlength="2000" placeholder="Ce que le client ou l'agent vous a indiqué"></textarea>
                <p class="text-xs text-gray-500 mt-2">
                    Le point de service reçoit une notification et un courriel. C'est l'agent de crédit qui saisira le nouveau numéro et suivra le circuit habituel de validation par le directeur d'agence.
                </p>
            </div>
            <ng-template pTemplate="footer">
                <button pButton label="Annuler" class="p-button-text" (click)="fermerSignalement()"></button>
                <button pButton label="Envoyer le signalement" icon="pi pi-send" [loading]="envoiSignalement()" [disabled]="!motifSignalement" (click)="envoyerSignalement()"></button>
            </ng-template>
        </p-dialog>

        <!-- Dialog : suivi des signalements du périmètre -->
        <p-dialog header="Signalements de numéros" [visible]="showListeSignalements()" (visibleChange)="!$event && showListeSignalements.set(false)" [modal]="true" [style]="{ width: '900px' }">
            <p-table [value]="listeSignalements()" [loading]="loadingSignalements()" responsiveLayout="scroll">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Signalé le</th>
                        <th>Client</th>
                        <th>Point de service</th>
                        <th>Motif</th>
                        <th>Statut</th>
                        <th>Suivi</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-sig>
                    <tr>
                        <td class="whitespace-nowrap">{{ sig.signaleAt | date: 'dd/MM/yyyy HH:mm' }}<div class="text-xs text-gray-500">{{ sig.signalePar }} ({{ sig.signaleParRole }})</div></td>
                        <td><span class="font-medium">{{ sig.nomClient || sig.codCliente }}</span><div class="text-xs text-gray-500">{{ sig.codCliente }}<span *ngIf="sig.numCredito"> · crédit {{ sig.numCredito }}</span></div></td>
                        <td>{{ sig.pointVente || sig.codAgencia }}</td>
                        <td>{{ libelleMotifSig(sig.motif) }}<div class="text-xs text-gray-500" *ngIf="sig.commentaire">{{ sig.commentaire }}</div></td>
                        <td><p-tag [value]="libelleStatutSig(sig.statut)" [severity]="severiteStatutSig(sig.statut)"></p-tag></td>
                        <td class="text-sm">
                            <div *ngIf="sig.prisPar">Pris par {{ sig.prisPar }} le {{ sig.prisAt | date: 'dd/MM/yyyy' }}</div>
                            <div *ngIf="sig.demandeId">Demande {{ sig.demandeId }} — {{ sig.demandeStatut }}</div>
                            <div *ngIf="sig.motifClassement" class="text-gray-500">Classé : {{ sig.motifClassement }}</div>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr><td colspan="6" class="text-center text-gray-500 py-6">Aucun signalement sur votre périmètre.</td></tr>
                </ng-template>
            </p-table>
        </p-dialog>

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
    private signalementService = inject(SignalementTelephoneService);
    private router = inject(Router);
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
        // TT1 (lot 2)
        synthese: any[];
        loadingSyn: boolean;
    }>({ agences: [], credits: [], indicateurs: null, page: null, loading: false, showEcheancier: false, creditSelectionne: null, echeancier: [], loadingEcheancier: false,
         echeances: [], indEch: null, pageEch: null, loadingEch: false, synthese: [], loadingSyn: false });

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

    // ── Téléphones clients et signalement (V156) ──
    capacites = signal<CapacitesSignalement>({ peutSignaler: false, estAgent: false, niveau: 'PS', ouverts: {} });
    motifsSignalement = MOTIFS_SIGNALEMENT;
    motifSignalement: MotifSignalementTelephone | null = null;
    commentaireSignalement = '';
    ligneSignalee: any | null = null;
    showSignalement = signal(false);
    envoiSignalement = signal(false);
    showListeSignalements = signal(false);
    listeSignalements = signal<SignalementTelephone[]>([]);
    loadingSignalements = signal(false);

    libelleMotifSig = libelleMotifSignalement;
    libelleStatutSig = libelleStatutSignalement;
    severiteStatutSig = severiteStatutSignalement;

    nbSignalementsOuverts(): number {
        return Object.keys(this.capacites().ouverts || {}).length;
    }

    /** Signalement ouvert pour ce client, s'il y en a un (étiquette sur la ligne). */
    signalementDe(codCliente: string): SignalementTelephone | null {
        return this.capacites().ouverts?.[codCliente] || null;
    }

    /** Un numéro guinéen a neuf chiffres : au-delà ou en deçà, on le signale à l'œil. */
    formatDouteux(numero?: string | null): boolean {
        if (!numero) return false;
        return numero.replace(/\D/g, '').length !== 9;
    }

    private chargerCapacites(): void {
        this.signalementService
            .capacitesEtOuverts()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    const d: any = r.data || {};
                    this.capacites.set({
                        peutSignaler: !!d.peutSignaler,
                        estAgent: !!d.estAgent,
                        niveau: d.niveau || 'PS',
                        ouverts: d.ouverts || {}
                    });
                },
                error: () => {}
            });
    }

    /** Agent de crédit : le formulaire de changement de numéro s'ouvre pré-rempli. */
    modifierNumero(ligne: any): void {
        this.router.navigate(['/dashboards/changement-telephone/agent'], { queryParams: { codCliente: ligne.codCliente } });
    }

    ouvrirSignalement(ligne: any): void {
        this.ligneSignalee = ligne;
        this.motifSignalement = ligne.telPrincipal ? null : 'ABSENT';
        this.commentaireSignalement = '';
        this.showSignalement.set(true);
    }

    fermerSignalement(): void {
        this.showSignalement.set(false);
        this.ligneSignalee = null;
    }

    envoyerSignalement(): void {
        const e = this.ligneSignalee;
        if (!e || !this.motifSignalement) return;
        this.envoiSignalement.set(true);
        this.signalementService
            .signaler({
                codCliente: e.codCliente,
                nomClient: e.nomCliente,
                numCredito: e.numCredito,
                codAgencia: e.codAgencia,
                motif: this.motifSignalement,
                commentaire: this.commentaireSignalement.trim() || undefined
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.envoiSignalement.set(false);
                    this.fermerSignalement();
                    this.messageService.add({ severity: 'success', summary: 'Signalement transmis', detail: 'Le point de service a été notifié', life: 5000 });
                    this.chargerCapacites();
                },
                error: (err) => {
                    this.envoiSignalement.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || "Le signalement n'a pas pu être enregistré", life: 6000 });
                }
            });
    }

    ouvrirListeSignalements(): void {
        this.showListeSignalements.set(true);
        this.loadingSignalements.set(true);
        this.signalementService
            .listPerimetre()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.listeSignalements.set((r.data as any)?.signalements || []);
                    this.loadingSignalements.set(false);
                },
                error: (err) => {
                    this.loadingSignalements.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Liste indisponible', life: 6000 });
                }
            });
    }

    // ── TT1 (lot 2) : synthèse hiérarchique + impression ──
    modeEch: 'detail' | 'synthese' = 'detail';
    modeOptions = [
        { label: 'Synthèse', value: 'synthese' },
        { label: 'Détail', value: 'detail' }
    ];
    niveauSyn: string = 'auto';
    niveauOptions: { label: string; value: string }[] = [];
    filtreAgence: { id: number; libelle: string } | null = null;
    filtreDelegation: { id: number; libelle: string } | null = null;
    impressionEnCours = signal(false);
    private static readonly IMPRESSION_MAX_LIGNES = 3000;

    changerVue(): void {
        if (this.vue === 'echeances' && !this.state().indEch) {
            // DA / DR / DE : synthèse par défaut ; agent (un seul PS) : détail
            this.modeEch = this.state().agences.length > 1 ? 'synthese' : 'detail';
            this.appliquerRaccourci();
        }
    }

    changerMode(): void {
        if (this.modeEch === 'synthese') {
            this.psEcheances = null;
        }
        this.chargerEcheances(0);
    }

    private filtresTT1(): FiltresTT1 {
        return {
            du: this.du,
            au: this.au,
            etat: this.etatEch,
            codAgencia: this.modeEch === 'detail' ? this.psEcheances : null,
            agenceId: this.filtreAgence?.id ?? null,
            delegationId: this.filtreAgence ? null : (this.filtreDelegation?.id ?? null),
            recherche: this.rechercheEch.trim() || null
        };
    }

    libelleNiveau(niveau: string): string {
        return niveau === 'delegation' ? 'Délégation' : niveau === 'agence' ? 'Agence' : 'Point de service';
    }

    severiteTaux(taux: number | null | undefined): 'success' | 'warn' | 'danger' | 'info' {
        if (taux === null || taux === undefined) return 'info';
        return taux >= 80 ? 'success' : taux >= 50 ? 'warn' : 'danger';
    }

    chargerSynthese(): void {
        this.state.update((s) => ({ ...s, loadingSyn: true }));
        this.userService
            .getPortefeuilleEcheancesSynthese$(this.filtresTT1(), this.niveauSyn)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    const d: any = r.data || {};
                    const niveaux: string[] = d.niveaux || ['ps'];
                    this.niveauOptions = niveaux.map((n) => ({ label: this.libelleNiveau(n), value: n }));
                    this.niveauSyn = d.niveau || this.niveauSyn;
                    this.state.update((s) => ({ ...s, synthese: d.synthese || [], loadingSyn: false }));
                },
                error: (err) => {
                    this.state.update((s) => ({ ...s, loadingSyn: false }));
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Base SAF momentanément indisponible', life: 6000 });
                }
            });
    }

    /** Descente d'un niveau depuis une ligne de synthèse, jusqu'aux échéances du point de service. */
    descendre(s: any): void {
        if (s.niveau === 'PS') {
            this.psEcheances = s.code;
            this.modeEch = 'detail';
        } else if (s.id === null || s.id === undefined) {
            this.messageService.add({ severity: 'info', summary: 'Non rattaché', detail: 'Ces points de service ne sont pas rattachés dans la plateforme : passez en détail pour les consulter', life: 5000 });
            return;
        } else if (s.niveau === 'DELEGATION') {
            this.filtreDelegation = { id: s.id, libelle: s.libelle };
            this.filtreAgence = null;
            this.niveauSyn = 'agence';
        } else if (s.niveau === 'AGENCE') {
            this.filtreAgence = { id: s.id, libelle: s.libelle };
            this.niveauSyn = 'ps';
        }
        this.chargerEcheances(0);
    }

    remonter(jusqua: 'delegation' | null): void {
        if (jusqua === 'delegation') {
            this.filtreAgence = null;
            this.niveauSyn = 'agence';
        } else {
            this.filtreAgence = null;
            this.filtreDelegation = null;
            this.niveauSyn = this.niveauOptions[0]?.value || 'auto';
        }
        this.psEcheances = null;
        this.modeEch = 'synthese';
        this.chargerEcheances(0);
    }

    private libellePerimetre(): string {
        const ag = this.state().agences;
        if (this.modeEch === 'detail' && this.psEcheances) {
            return ag.find((a) => a.codAgencia === this.psEcheances)?.desAgencia || this.psEcheances;
        }
        if (ag.length === 1) return ag[0].desAgencia;
        if (this.filtreAgence) return 'Agence ' + this.filtreAgence.libelle;
        if (this.filtreDelegation) return 'Délégation ' + this.filtreDelegation.libelle;
        return 'Tout mon périmètre (' + ag.length + ' points de service)';
    }

    /** Impression de l'état TT1 : en-tête CRG, période, périmètre, totaux, tableau et signatures. */
    async imprimer(): Promise<void> {
        if (!this.du || !this.au) return;
        this.impressionEnCours.set(true);
        const nb = (v: any) => (v === null || v === undefined ? '' : new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Number(v)));
        const pct = (v: any) => (v === null || v === undefined ? '' : new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(Number(v)) + ' %');
        const dt = (v: any) => (v ? new Date(v).toLocaleDateString('fr-FR') : '');
        try {
            let colonnes: string[];
            let lignes: (string | number)[][];
            let tronque = false;
            if (this.modeEch === 'synthese') {
                const parNiveau = this.niveauSyn !== 'ps';
                colonnes = [this.libelleNiveau(this.niveauSyn), ...(parNiveau ? ['PS'] : ['Code']), 'Échéances', 'Attendu (GNF)', 'Réglé (GNF)', 'Reste à encaisser (GNF)', 'Taux', 'Impayées', 'À échoir'];
                lignes = this.state().synthese.map((s: any) => [
                    s.libelle + (s.rattachement ? ' (' + s.rattachement + ')' : ''),
                    parNiveau ? s.nbPointsService : s.code || '',
                    s.indicateurs?.nbEcheances ?? 0,
                    nb(s.indicateurs?.montantAttendu),
                    nb(s.indicateurs?.montantRegle),
                    nb(s.indicateurs?.resteAEncaisser),
                    pct(s.indicateurs?.tauxRecouvrement),
                    s.indicateurs?.nbImpayees ?? 0,
                    s.indicateurs?.nbAEchoir ?? 0
                ]);
            } else {
                colonnes = ['Date', 'Point de service', 'Client', 'Téléphones', 'N° crédit', 'Éch.', 'Montant (GNF)', 'Capital (GNF)', 'Intérêts (GNF)', 'Reste à payer (GNF)', 'État'];
                const toutes: any[] = [];
                let page = 0;
                while (toutes.length < PortefeuilleSafComponent.IMPRESSION_MAX_LIGNES) {
                    const r: IResponse = await lastValueFrom(this.userService.getPortefeuilleEcheances$(this.filtresTT1(), page, 100));
                    const p = (r.data as any)?.echeances;
                    toutes.push(...(p?.content || []));
                    if (!p?.hasNext) break;
                    page++;
                }
                tronque = toutes.length >= PortefeuilleSafComponent.IMPRESSION_MAX_LIGNES;
                lignes = toutes.slice(0, PortefeuilleSafComponent.IMPRESSION_MAX_LIGNES).map((e: any) => [
                    dt(e.fecCuota),
                    e.desAgencia || e.codAgencia || '',
                    (e.nomCliente || '') + (e.codCliente ? ' (' + e.codCliente + ')' : ''),
                    [e.telPrincipal || '—', e.telSecundario || '—', e.telOtro || '—'].join(' / '),
                    e.numCredito,
                    e.numCuota,
                    nb(e.monCuota),
                    nb(e.monPrincipal),
                    nb(e.monInt),
                    nb(e.resteAPayer),
                    this.libelleEtatEch(e)
                ]);
            }
            const i = this.state().indEch;
            const totaux: [string, string][] = i
                ? [
                      ['Échéances', String(i.nbEcheances) + ' (' + i.nbCredits + ' crédits, ' + i.nbClients + ' clients)'],
                      ['Montant attendu', nb(i.montantAttendu) + ' GNF'],
                      ['dont capital', nb(i.capitalAttendu) + ' GNF'],
                      ['dont intérêts', nb(i.interetsAttendus) + ' GNF'],
                      ['Réglé', nb(i.montantRegle) + ' GNF (' + pct(i.tauxRecouvrement) + ')'],
                      ['Reste à encaisser', nb(i.resteAEncaisser) + ' GNF'],
                      ['Réglées / à échoir / impayées', i.nbReglees + ' / ' + i.nbAEchoir + ' / ' + i.nbImpayees]
                  ]
                : [];
            const etat = this.etatOptions.find((o) => o.value === this.etatEch)?.label || '';
            this.ouvrirImpression(
                'État TT1 — Échéances de la période',
                [
                    ['Périmètre', this.libellePerimetre()],
                    ['Période', dt(this.du) + ' au ' + dt(this.au)],
                    ['État des échéances', etat + (this.rechercheEch.trim() ? ' — recherche « ' + this.rechercheEch.trim() + ' »' : '')],
                    ['Vue', this.modeEch === 'synthese' ? 'Synthèse par ' + this.libelleNiveau(this.niveauSyn).toLowerCase() : 'Détail des échéances']
                ],
                totaux,
                colonnes,
                lignes,
                tronque ? 'Liste limitée aux ' + PortefeuilleSafComponent.IMPRESSION_MAX_LIGNES + ' premières échéances : utilisez l’export Excel pour la liste complète.' : ''
            );
        } catch (err: any) {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || "Échec de la préparation de l'impression", life: 6000 });
        } finally {
            this.impressionEnCours.set(false);
        }
    }

    private ouvrirImpression(titre: string, meta: [string, string][], totaux: [string, string][], colonnes: string[], lignes: (string | number)[][], avertissement: string): void {
        const w = window.open('', '_blank', 'width=1100,height=900');
        if (!w) {
            this.messageService.add({ severity: 'warn', summary: 'Impression', detail: 'Autorisez les fenêtres surgissantes pour imprimer', life: 5000 });
            return;
        }
        const esc = (v: string | number) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
        const num = (v: string | number) => typeof v === 'number' || /^[\d\s\u202f\u00a0,.]+( %)?$/.test(String(v));
        const thead = colonnes.map((c) => `<th>${esc(c)}</th>`).join('');
        const tbody = lignes.length
            ? lignes.map((l) => `<tr>${l.map((v) => `<td class="${num(v) ? 'num' : ''}">${esc(v)}</td>`).join('')}</tr>`).join('')
            : `<tr><td colspan="${colonnes.length}" class="vide">Aucune échéance</td></tr>`;
        const metaHtml = meta.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('');
        const totauxHtml = totaux.map(([k, v]) => `<tr><th>${esc(k)}</th><td class="num">${esc(v)}</td></tr>`).join('');
        const genere = new Date().toLocaleString('fr-FR');
        w.document.write(`<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">
<title>${esc(titre)}</title>
<style>
  body { font-family: Georgia, 'Times New Roman', serif; color: #111; max-width: 1050px; margin: 1.5rem auto; }
  .entete { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #111; padding-bottom: .4rem; margin-bottom: 1rem; }
  .entete h2 { margin: 0; font-size: 1.1rem; } .entete small { color: #444; }
  h1 { text-align: center; font-size: 1.3rem; letter-spacing: .04em; margin: .6rem 0 .8rem; }
  .cartouche { display: flex; gap: 2rem; margin-bottom: 1rem; }
  .cartouche table { font-size: .85rem; border-collapse: collapse; }
  .cartouche th { text-align: left; padding: 2px 10px 2px 0; color: #444; font-weight: normal; white-space: nowrap; }
  .cartouche td { padding: 2px 0; }
  .cartouche td.num { text-align: right; font-variant-numeric: tabular-nums; }
  table.liste { width: 100%; border-collapse: collapse; font-size: .78rem; }
  table.liste th, table.liste td { border: 1px solid #333; padding: 3px 5px; text-align: left; vertical-align: top; }
  table.liste th { background: #eee; }
  table.liste td.num { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
  td.vide { text-align: center; color: #666; }
  .avert { font-size: .8rem; color: #8a4b00; margin-top: .5rem; }
  .pied { display: flex; justify-content: space-between; margin-top: 2rem; font-size: .85rem; }
  .signature { text-align: center; width: 30%; }
  .signature .ligne { border-top: 1px solid #111; margin-top: 3.5rem; padding-top: .3rem; }
  @media print { body { margin: 0.5cm auto; } thead { display: table-header-group; } tr { page-break-inside: avoid; } }
</style></head><body>
<div class="entete"><div><h2>CRÉDIT RURAL DE GUINÉE S.A</h2><small>Suivi du portefeuille crédits</small></div><small>Édité le ${esc(genere)}</small></div>
<h1>${esc(titre)}</h1>
<div class="cartouche"><table>${metaHtml}</table><table>${totauxHtml}</table></div>
<table class="liste"><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table>
${avertissement ? `<div class="avert">${esc(avertissement)}</div>` : ''}
<div class="pied">
  <div class="signature"><b>Établi par</b><div class="ligne">&nbsp;</div></div>
  <div class="signature"><b>Le Directeur d'agence</b><div class="ligne">&nbsp;</div></div>
  <div class="signature"><b>Visa</b><div class="ligne">&nbsp;</div></div>
</div>
<script>window.onload = function(){ window.print(); }<\/script>
</body></html>`);
        w.document.close();
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
        const filtres = this.filtresTT1();
        this.userService
            .getPortefeuilleEcheancesIndicateurs$(filtres)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => this.state.update((s) => ({ ...s, indEch: (r.data as any)?.indicateurs || null })),
                error: () => {}
            });
        if (this.modeEch === 'synthese') {
            this.chargerSynthese();
            return;
        }
        this.state.update((s) => ({ ...s, loadingEch: true }));
        this.userService
            .getPortefeuilleEcheances$(filtres, page, this.pageSize)
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
            .exportPortefeuilleEcheances$(this.filtresTT1())
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
        this.chargerCapacites();
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
