import { DossierCredit, LigneCreditNegatif, SituationCreditsNegatifs } from '@/interface/credit-negatif';
import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

/**
 * Crédits à solde négatif dans SAF (V177, lot 2). Réservé au service DSIG.
 *
 * La page montre TOUS les états, l'état écrit en clair plutôt qu'en code SAF : masquer les
 * apurés ferait disparaître de l'écran le stock que personne ne traite parce que personne ne
 * le voit. L'alerte par courriel, elle, ne porte que sur les crédits en cours.
 *
 * digi lit SAF, il n'y écrit pas : la correction se fait dans SAF, la page suit qui s'en occupe.
 */
@Component({
    selector: 'app-credits-negatifs',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, DialogModule, InputTextModule, SelectButtonModule, TableModule, TabViewModule, TagModule, TextareaModule, ToastModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>
        <div class="card">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                    <h2 class="text-xl font-semibold m-0">Crédits négatifs</h2>
                    <div class="text-sm text-gray-500">
                        Crédits dont le solde SAF est inférieur à zéro, relevés dans la base de production.
                        <span *ngIf="data()?.dernierPassage as d">Dernière détection le {{ d | date: 'dd/MM/yyyy à HH:mm' }}.</span>
                    </div>
                </div>
                <div class="flex flex-wrap gap-2 items-center">
                    <button pButton icon="pi pi-refresh" class="p-button-text" (click)="charger()" [loading]="loading()" pTooltip="Recharger"></button>
                    <button pButton icon="pi pi-sync" label="Vérifier tous les pris en charge" class="p-button-outlined" [loading]="verificationEnCours()" [disabled]="!data()" (click)="verifierTous()"
                            pTooltip="Confronte à SAF production, à l'instant, chaque crédit pris en charge : corrigé, clos dans SAF ou toujours négatif. Lecture seule."></button>
                    <button pButton icon="pi pi-file-excel" label="Exporter Excel" class="p-button-success p-button-outlined" [loading]="exportEnCours()" [disabled]="!data()" (click)="exporter()"></button>
                </div>
            </div>

            <ng-container *ngIf="data() as d">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div class="border rounded p-3">
                        <div class="text-xs text-gray-500 uppercase">Crédits négatifs ouverts</div>
                        <div class="text-2xl font-bold text-red-600">{{ d.nbOuverts }}</div>
                        <div class="text-xs text-gray-500">{{ d.montantOuvert | number: '1.0-0' }} GNF</div>
                    </div>
                    <div class="border rounded p-3">
                        <div class="text-xs text-gray-500 uppercase">Sans prise en charge</div>
                        <div class="text-2xl font-bold" [class.text-red-600]="d.nbNonTraites > 0">{{ d.nbNonTraites }}</div>
                        <div class="text-xs text-gray-500">personne ne s'en occupe encore</div>
                    </div>
                    <div class="border rounded p-3">
                        <div class="text-xs text-gray-500 uppercase">Détectés aujourd'hui</div>
                        <div class="text-2xl font-bold">{{ d.nbDetectesAujourdhui }}</div>
                    </div>
                    <div class="border rounded p-3">
                        <div class="text-xs text-gray-500 uppercase">Corrigés ce mois</div>
                        <div class="text-2xl font-bold text-green-700">{{ d.nbCorrigesCeMois }}</div>
                    </div>
                    <div class="border rounded p-3" [class.border-red-400]="d.nbPrisEnChargeAnciens > 0">
                        <div class="text-xs text-gray-500 uppercase">Pris en charge depuis + de 7 jours</div>
                        <div class="text-2xl font-bold" [class.text-red-600]="d.nbPrisEnChargeAnciens > 0">{{ d.nbPrisEnChargeAnciens }}</div>
                        <div class="text-xs text-gray-500">toujours négatifs dans SAF</div>
                    </div>
                    <div class="border rounded p-3">
                        <div class="text-xs text-gray-500 uppercase">Arrondis</div>
                        <div class="text-2xl font-bold text-gray-600">{{ d.nbArrondis }}</div>
                        <div class="text-xs text-gray-500">moins d'un franc : écriture de régularisation</div>
                    </div>
                </div>

                <div class="flex flex-wrap items-center gap-3 mb-3">
                    <p-selectButton [options]="filtresEtat()" [ngModel]="filtreEtat()" (ngModelChange)="filtreEtat.set($event)" optionLabel="label" optionValue="value" styleClass="text-sm"></p-selectButton>
                    <p-selectButton [options]="filtresSuivi" [ngModel]="filtreSuivi()" (ngModelChange)="filtreSuivi.set($event)" optionLabel="label" optionValue="value" styleClass="text-sm"></p-selectButton>
                    <p-selectButton [options]="vues" [ngModel]="vue()" (ngModelChange)="changerVue($event)" optionLabel="label" optionValue="value" styleClass="text-sm"></p-selectButton>
                    <input pInputText type="text" [ngModel]="recherche()" (ngModelChange)="recherche.set($event)" placeholder="Client, crédit, point de service" class="w-72" />
                </div>

                <div class="text-sm text-gray-500 mb-2" *ngIf="d.message">{{ d.message }}</div>

                <ng-container *ngIf="vue() === 'CORRIGES'">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        <div class="border rounded p-3">
                            <div class="text-xs text-gray-500 uppercase">Crédits corrigés</div>
                            <div class="text-2xl font-bold text-green-700">{{ corriges().length }}</div>
                            <div class="text-xs text-gray-500">{{ nbAvecPreuve() }} avec preuve lue dans SAF</div>
                        </div>
                        <div class="border rounded p-3">
                            <div class="text-xs text-gray-500 uppercase">Solde négatif régularisé</div>
                            <div class="text-2xl font-bold">{{ montantRegularise() | number: '1.0-0' }}</div>
                            <div class="text-xs text-gray-500">GNF, somme des pires soldes des crédits corrigés</div>
                        </div>
                        <div class="border rounded p-3">
                            <div class="text-xs text-gray-500 uppercase">Clos dans SAF</div>
                            <div class="text-2xl font-bold text-gray-600">{{ nbClosSaf() }}</div>
                            <div class="text-xs text-gray-500">disparus sans preuve de régularisation</div>
                        </div>
                        <div class="border rounded p-3">
                            <div class="text-xs text-gray-500 uppercase">Sans preuve</div>
                            <div class="text-2xl font-bold text-gray-600">{{ corriges().length - nbAvecPreuve() }}</div>
                            <div class="text-xs text-gray-500">clôtures antérieures : « Lire le solde dans SAF »</div>
                        </div>
                    </div>
                    <p-table [value]="corriges()" styleClass="p-datatable-sm" [paginator]="corriges().length > 25" [rows]="25" [scrollable]="true">
                        <ng-template pTemplate="header">
                            <tr>
                                <th>Point de service</th>
                                <th>Crédit</th>
                                <th>Client</th>
                                <th class="text-right">Solde négatif relevé</th>
                                <th class="text-right" pTooltip="Le solde que SAF montrait au moment de la régularisation. Figé : il ne change plus.">Solde corrigé</th>
                                <th class="text-right" pTooltip="Solde corrigé moins le pire solde relevé : le montant que la régularisation a porté.">Écart régularisé</th>
                                <th class="text-right" pTooltip="Remis à jour à chaque vérification : il sert à détecter une rechute, pas à chiffrer la correction.">Dernier solde lu dans SAF</th>
                                <th>État après</th>
                                <th>Conclusion</th>
                                <th>Corrigé le</th>
                                <th>Par</th>
                                <th></th>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-c>
                            <tr>
                                <td>{{ c.desAgencia }} <span class="text-xs text-gray-400">({{ c.codAgencia }})</span></td>
                                <td class="font-mono">{{ c.numCredito }}</td>
                                <td>{{ c.nomCliente }} <span class="text-xs text-gray-400">({{ c.codCliente }})</span></td>
                                <td class="text-right text-red-600">{{ c.pireSolde | number: '1.0-2' }}</td>
                                <td class="text-right font-semibold">
                                    <ng-container *ngIf="c.soldeCorrige !== null">
                                        <span class="text-green-700">{{ c.soldeCorrige | number: '1.0-2' }}</span>
                                        <div class="text-xs font-normal text-gray-500">
                                            <span *ngIf="c.soldeCorrigeAt">figé le {{ c.soldeCorrigeAt | date: 'dd/MM/yyyy' }}</span>
                                            <span *ngIf="c.soldeCorrigeSource === 'REPRISE'" class="text-orange-600" pTooltip="Valeur reconstituée après coup depuis la dernière lecture connue, pas observée au moment de la correction"> · reconstitué</span>
                                        </div>
                                    </ng-container>
                                    <span *ngIf="c.soldeCorrige === null" class="text-xs font-normal text-gray-400" [pTooltip]="motifSansSoldeCorrige(c)">—</span>
                                </td>
                                <td class="text-right">
                                    <span *ngIf="c.ecartRegularise !== null" class="font-medium">{{ c.ecartRegularise | number: '1.0-2' }}</span>
                                    <span *ngIf="c.ecartRegularise === null" class="text-xs text-gray-400">—</span>
                                </td>
                                <td class="text-right" [class.text-green-700]="c.soldeApres !== null && c.soldeApres >= 0" [class.text-red-600]="c.soldeApres !== null && c.soldeApres < 0">
                                    <ng-container *ngIf="c.soldeApres !== null">
                                        {{ c.soldeApres | number: '1.0-2' }}
                                        <div class="text-xs text-gray-500" *ngIf="c.verifieSafAt">lu le {{ c.verifieSafAt | date: 'dd/MM HH:mm' }}</div>
                                    </ng-container>
                                    <span *ngIf="c.soldeApres === null" class="text-xs text-gray-400">non lu</span>
                                </td>
                                <td class="text-xs">{{ c.etatApresLibelle || '—' }}</td>
                                <td>
                                    <p-tag *ngIf="c.conclusion === 'CORRIGE'" value="Corrigé" severity="success"></p-tag>
                                    <p-tag *ngIf="c.conclusion === 'CLOS_SAF'" value="Clos dans SAF" severity="secondary"></p-tag>
                                    <p-tag *ngIf="c.conclusion === 'TOUJOURS_NEGATIF'" value="Encore négatif aujourd'hui" severity="danger" pTooltip="Clôture prématurée : SAF le voit toujours négatif"></p-tag>
                                    <p-tag *ngIf="!c.conclusion" value="Sans preuve" severity="secondary"></p-tag>
                                </td>
                                <td class="text-xs">{{ c.corrigeAt | date: 'dd/MM/yyyy HH:mm' }}</td>
                                <td class="text-xs">
                                    <span *ngIf="c.corrigeMode === 'MANUEL' && c.corrigePar">{{ c.corrigePar }}</span>
                                    <span *ngIf="c.corrigeMode === 'AUTO'" class="text-gray-500">passage horaire</span>
                                    <span *ngIf="!c.corrigeMode" class="text-gray-400">—</span>
                                </td>
                                <td class="whitespace-nowrap">
                                    <button *ngIf="c.soldeApres === null" pButton icon="pi pi-search" class="p-button-text p-button-sm" [loading]="verificationLigne() === c.id" (click)="completerPreuve(c)" pTooltip="Lire le solde dans SAF aujourd'hui"></button>
                                    <button pButton icon="pi pi-folder-open" class="p-button-text p-button-sm" [loading]="chargementDossier() === c.id" (click)="ouvrirDossier(c)" pTooltip="Dossier SAF du crédit : fiche, échéancier, opérations, compte courant, écritures"></button>
                                </td>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="emptymessage"><tr><td colspan="12" class="text-center text-gray-500 py-4">Aucun crédit corrigé.</td></tr></ng-template>
                    </p-table>
                </ng-container>

                <p-table *ngIf="vue() === 'OUVERTS'" [value]="lignesFiltrees()" styleClass="p-datatable-sm" [paginator]="lignesFiltrees().length > 25" [rows]="25" [scrollable]="true">
                    <ng-template pTemplate="header">
                        <tr>
                            <th>Point de service</th>
                            <th>Crédit</th>
                            <th>Client</th>
                            <th class="text-right">Octroyé</th>
                            <th class="text-right">Solde</th>
                            <th>Ouvert le</th>
                            <th>État</th>
                            <th>Agent SAF</th>
                            <th>Suivi</th>
                            <th></th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-c>
                        <tr [class.opacity-60]="c.corrigeAt">
                            <td>{{ c.desAgencia }} <span class="text-xs text-gray-400">({{ c.codAgencia }})</span></td>
                            <td class="font-mono">{{ c.numCredito }}</td>
                            <td>{{ c.nomCliente }} <span class="text-xs text-gray-400">({{ c.codCliente }})</span></td>
                            <td class="text-right">{{ c.monCredito | number: '1.0-0' }}</td>
                            <td class="text-right font-medium text-red-600">{{ c.monSaldo | number: '1.0-0' }}</td>
                            <td>{{ c.fecApertura | date: 'dd/MM/yyyy' }}</td>
                            <td><p-tag [value]="c.etat" [severity]="severiteEtat(c)"></p-tag></td>
                            <td class="text-xs">{{ c.codEjecutivo }}</td>
                            <td>
                                <ng-container *ngIf="c.corrigeAt">
                                    <p-tag *ngIf="c.conclusion === 'CORRIGE'" value="Corrigé" severity="success"></p-tag>
                                    <p-tag *ngIf="c.conclusion === 'CLOS_SAF'" value="Clos dans SAF" severity="secondary" pTooltip="Le crédit a disparu de SAF sans preuve de régularisation"></p-tag>
                                    <p-tag *ngIf="!c.conclusion" value="Corrigé (sans preuve)" severity="secondary" pTooltip="Clôture antérieure à la preuve de correction"></p-tag>
                                    <div class="text-xs text-gray-500 mt-1">
                                        le {{ c.corrigeAt | date: 'dd/MM HH:mm' }}
                                        <span *ngIf="c.corrigeMode === 'AUTO'"> · passage horaire</span>
                                        <span *ngIf="c.corrigeMode === 'MANUEL' && c.corrigePar"> · {{ c.corrigePar }}</span>
                                        <span *ngIf="c.soldeCorrige !== null"> · solde corrigé {{ c.soldeCorrige | number: '1.0-2' }}</span>
                                        <span *ngIf="c.soldeApres !== null"> · dernier solde lu {{ c.soldeApres | number: '1.0-2' }}</span>
                                        <span *ngIf="c.etatApresLibelle"> · {{ c.etatApresLibelle }}</span>
                                    </div>
                                </ng-container>
                                <ng-container *ngIf="!c.corrigeAt">
                                    <p-tag *ngIf="c.conclusion === 'ARRONDI'" value="Arrondi" severity="secondary" pTooltip="Moins d'un franc : seule une écriture de régularisation dans SAF le corrigera"></p-tag>
                                    <p-tag *ngIf="c.conclusion === 'TOUJOURS_NEGATIF'" value="Toujours négatif" severity="danger" [pTooltip]="'Vérifié dans SAF le ' + (c.verifieSafAt | date: 'dd/MM HH:mm')"></p-tag>
                                    <div class="text-xs mt-1" *ngIf="c.traiteAt">
                                        {{ c.traitePar }} · pris en charge le {{ c.traiteAt | date: 'dd/MM' }}
                                        <span *ngIf="c.joursDepuisPriseEnCharge !== null && c.joursDepuisPriseEnCharge >= 7" class="text-red-600 font-semibold"> · {{ c.joursDepuisPriseEnCharge }} j</span>
                                    </div>
                                    <span *ngIf="!c.traiteAt && c.conclusion !== 'ARRONDI'" class="text-xs text-gray-400">à traiter</span>
                                </ng-container>
                                <div class="text-xs text-gray-500" *ngIf="c.commentaire">{{ c.commentaire }}</div>
                            </td>
                            <td class="whitespace-nowrap">
                                <button *ngIf="!c.corrigeAt && !c.traiteAt" pButton icon="pi pi-user-plus" class="p-button-text p-button-sm" (click)="ouvrirSuivi(c)" pTooltip="Je m'en occupe"></button>
                                <button *ngIf="!c.corrigeAt && c.traiteAt" pButton icon="pi pi-sync" class="p-button-text p-button-sm" [loading]="verificationLigne() === c.id" (click)="verifierUn(c)" pTooltip="Vérifier dans SAF maintenant"></button>
                                <button pButton icon="pi pi-folder-open" class="p-button-text p-button-sm" [loading]="chargementDossier() === c.id" (click)="ouvrirDossier(c)" pTooltip="Dossier SAF du crédit : pourquoi le solde est passé sous zéro"></button>
                                <button *ngIf="!c.corrigeAt && c.traiteAt" pButton icon="pi pi-times" class="p-button-text p-button-sm" (click)="retirerSuivi(c)" pTooltip="Retirer la prise en charge"></button>
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr><td colspan="10" class="text-center text-gray-500 py-4">Aucun crédit négatif pour ce filtre.</td></tr>
                    </ng-template>
                </p-table>

                <div class="text-sm text-gray-500 mt-3" *ngIf="d.parEtat.length">
                    Répartition des crédits ouverts :
                    <span *ngFor="let e of d.parEtat; let i = index">
                        {{ i > 0 ? ' · ' : '' }}{{ e.libelle }} {{ e.nb }} ({{ e.montant | number: '1.0-0' }} GNF)
                    </span>
                </div>
                <div class="text-xs text-gray-500 mt-2">
                    digi lit SAF, il n'y écrit pas : la correction se fait dans SAF. La prise en charge notée ici
                    sert seulement à éviter que deux personnes travaillent le même crédit.
                </div>
            </ng-container>

            <div *ngIf="!data() && !loading()" class="text-gray-500">Aucune donnée.</div>
        </div>

        <p-dialog header="Prise en charge" [visible]="showSuivi()" (visibleChange)="!$event && showSuivi.set(false)" [modal]="true" [style]="{ width: '520px' }">
            <p class="text-sm m-0 mb-2" *ngIf="ligneSuivi() as c">
                Crédit <strong>{{ c.numCredito }}</strong> — {{ c.nomCliente }}, solde {{ c.monSaldo | number: '1.0-0' }} GNF.
            </p>
            <textarea pTextarea [ngModel]="commentaire()" (ngModelChange)="commentaire.set($event)" rows="3" class="w-full" placeholder="Ce qui a été constaté, ce qui reste à faire dans SAF (facultatif)"></textarea>
            <ng-template pTemplate="footer">
                <button pButton label="Annuler" class="p-button-text" (click)="showSuivi.set(false)"></button>
                <button pButton label="Je m'en occupe" icon="pi pi-check" (click)="confirmerSuivi()" [loading]="enregistrement()"></button>
            </ng-template>
        </p-dialog>

        <!-- ===================== Dossier SAF du crédit ===================== -->
        <p-dialog [header]="titreDossier()" [(visible)]="afficherDossier" [modal]="true" [style]="{ width: '97vw', maxWidth: '1500px' }" [dismissableMask]="true">
            @if (dossier(); as d) {
            @if (!d.trouve) {
            <p class="text-gray-500 py-4"><i class="pi pi-exclamation-triangle mr-2"></i>Ce crédit n'existe pas (ou plus) dans SAF aujourd'hui.</p>
            } @else {
            <div class="flex flex-wrap items-center gap-3 mb-3 text-sm">
                <span class="text-gray-500">Lu dans SAF (production) le {{ d.dateLecture | date: 'dd/MM/yyyy' }}</span>
                <span class="text-gray-400" *ngIf="totalMillis() !== null">· {{ totalMillis() }} ms</span>
                <button pButton icon="pi pi-file-excel" label="Exporter le dossier" class="p-button-success p-button-outlined p-button-sm ml-auto" [loading]="exportDossierEnCours()" (click)="exporterDossier()"></button>
            </div>

            <p-tabView>
                <!-- Opérations du crédit : l'onglet qui répond à « pourquoi ce solde est négatif » -->
                <p-tabPanel [header]="'Opérations du crédit (' + (d.mouvements?.length || 0) + ')'">
                    <p class="text-xs text-gray-500 mb-2">
                        Table <span class="font-mono">PR_MOVIMIENTOS</span>. Les colonnes « solde avant » et « solde après » sont la valeur antérieure et la valeur actuelle que SAF enregistre à chaque mouvement :
                        la ligne surlignée est celle où le solde passe sous zéro.
                        <span *ngIf="!d.mouvementsComplets" class="text-orange-600"> Plafond de lignes atteint : le dossier est tronqué.</span>
                    </p>
                    <p-table [value]="d.mouvements || []" styleClass="p-datatable-sm" [paginator]="(d.mouvements?.length || 0) > 30" [rows]="30" [scrollable]="true">
                        <ng-template pTemplate="header">
                            <tr>
                                <th>N°</th><th>Date</th><th>Transaction</th><th class="text-right">Montant</th>
                                <th class="text-right">Capital</th><th class="text-right">Intérêts</th><th class="text-right">Pénalités</th>
                                <th class="text-right">Solde avant</th><th class="text-right">Solde après</th><th>Observation</th>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-m>
                            <tr [class.bg-red-50]="bascule(m)">
                                <td class="font-mono text-xs">{{ m.NUM_MOVIMIENTO }}</td>
                                <td class="text-xs">{{ jour(m.FEC_MOVIMIENTO) }}</td>
                                <td class="text-xs">{{ m.TIP_TRANSACCION }}<span *ngIf="m.SUB_TIP_TRANSACCION">/{{ m.SUB_TIP_TRANSACCION }}</span></td>
                                <td class="text-right">{{ m.MON_MOVIMIENTO | number: '1.0-2' }}</td>
                                <td class="text-right">{{ m.MON_PRINCIPAL | number: '1.0-2' }}</td>
                                <td class="text-right">{{ m.MON_INT | number: '1.0-2' }}</td>
                                <td class="text-right">{{ m.MON_MORA | number: '1.0-2' }}</td>
                                <td class="text-right text-gray-600">{{ m.VAL_ANTERIOR | number: '1.0-2' }}</td>
                                <td class="text-right font-semibold" [class.text-red-600]="m.VAL_ACTUAL < 0">{{ m.VAL_ACTUAL | number: '1.0-2' }}</td>
                                <td class="text-xs">
                                    {{ m.OBSERVACIONES }}
                                    <span *ngIf="bascule(m)" class="text-red-600 font-semibold">· le solde passe sous zéro ici</span>
                                </td>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="emptymessage"><tr><td colspan="10" class="text-center text-gray-500 py-4">Aucune opération.</td></tr></ng-template>
                    </p-table>
                </p-tabPanel>

                <!-- Fiche -->
                <p-tabPanel header="Fiche du crédit">
                    <div class="flex items-center gap-3 mb-2">
                        <p-selectButton [options]="optionsFiche" [ngModel]="ficheComplete() ? 'tout' : 'resume'" (ngModelChange)="ficheComplete.set($event === 'tout')" optionLabel="label" optionValue="value" [allowEmpty]="false"></p-selectButton>
                        <span class="text-xs text-gray-500">Table <span class="font-mono">PR_CREDITOS</span>, {{ nbColonnesFiche() }} colonnes au total.</span>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-1">
                        <div *ngFor="let e of champsFiche()" class="flex justify-between border-b border-gray-100 py-1 text-sm">
                            <span class="text-gray-500 font-mono text-xs pr-2">{{ e.cle }}</span>
                            <span class="text-right font-medium">{{ valeur(e.valeur) }}</span>
                        </div>
                    </div>
                </p-tabPanel>

                <!-- Échéancier -->
                <p-tabPanel [header]="'Échéancier (' + (d.echeancier?.length || 0) + ')'">
                    <p class="text-xs text-gray-500 mb-2">Table <span class="font-mono">PR_PLAN_PAGOS</span>.</p>
                    <p-table [value]="d.echeancier || []" styleClass="p-datatable-sm" [paginator]="(d.echeancier?.length || 0) > 30" [rows]="30" [scrollable]="true">
                        <ng-template pTemplate="header">
                            <tr>
                                <th>N°</th><th>Échéance</th><th class="text-right">Montant</th><th class="text-right">Capital</th>
                                <th class="text-right">Intérêts</th><th class="text-right">Reste capital</th><th class="text-right">Reste intérêts</th>
                                <th class="text-right">Solde crédit</th><th>Réglée le</th><th>État</th>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-e>
                            <tr>
                                <td class="font-mono text-xs">{{ e.NUM_CUOTA }}</td>
                                <td class="text-xs">{{ jour(e.FEC_CUOTA) }}</td>
                                <td class="text-right">{{ e.MON_CUOTA | number: '1.0-2' }}</td>
                                <td class="text-right">{{ e.MON_PRINCIPAL | number: '1.0-2' }}</td>
                                <td class="text-right">{{ e.MON_INT | number: '1.0-2' }}</td>
                                <td class="text-right">{{ e.SAL_PRINCIPAL | number: '1.0-2' }}</td>
                                <td class="text-right">{{ e.SAL_INT | number: '1.0-2' }}</td>
                                <td class="text-right">{{ e.SAL_CREDITO | number: '1.0-2' }}</td>
                                <td class="text-xs">{{ jour(e.FEC_CANCELACION) }}</td>
                                <td class="text-xs">{{ e.IND_ESTADO }}</td>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="emptymessage"><tr><td colspan="10" class="text-center text-gray-500 py-4">Aucune échéance.</td></tr></ng-template>
                    </p-table>
                </p-tabPanel>

                <!-- Compte courant -->
                <p-tabPanel [header]="'Compte courant (' + (d.mouvementsCompte?.length || 0) + ')'">
                    <p class="text-xs text-gray-500 mb-2">
                        Table <span class="font-mono">CC_MOVIMTO_MENSUAL</span>, rattachée par le compte du crédit (<span class="font-mono">{{ d.idCuenta || '—' }}</span>) ou par son numéro cité dans le libellé.
                        Un mouvement qui ne cite ni l'un ni l'autre n'apparaît pas : une absence n'est pas une preuve.
                        <span *ngIf="!d.mouvementsCompteComplets" class="text-orange-600"> Plafond de lignes atteint.</span>
                    </p>
                    <p-table [value]="d.mouvementsCompte || []" styleClass="p-datatable-sm" [paginator]="(d.mouvementsCompte?.length || 0) > 30" [rows]="30" [scrollable]="true">
                        <ng-template pTemplate="header">
                            <tr><th>N°</th><th>Date</th><th>Compte</th><th>Transaction</th><th class="text-right">Montant</th><th>Document</th><th>Libellé</th><th>Usager</th></tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-m>
                            <tr>
                                <td class="font-mono text-xs">{{ m.NUM_MOVIMIENTO }}</td>
                                <td class="text-xs">{{ jour(m.FEC_MOVIMIENTO) }}</td>
                                <td class="font-mono text-xs">{{ m.NUM_CUENTA }}</td>
                                <td class="text-xs">{{ m.TIP_TRANSACCION }}<span *ngIf="m.SUBTIP_TRANSAC">/{{ m.SUBTIP_TRANSAC }}</span></td>
                                <td class="text-right">{{ m.MON_MOVIMIENTO | number: '1.0-2' }}</td>
                                <td class="text-xs">{{ m.NUM_DOCUMENTO }}</td>
                                <td class="text-xs">{{ m.DES_MOVIMIENTO }}</td>
                                <td class="text-xs">{{ m.COD_USUARIO }}</td>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="emptymessage"><tr><td colspan="8" class="text-center text-gray-500 py-4">Aucun mouvement rattaché.</td></tr></ng-template>
                    </p-table>
                </p-tabPanel>

                <!-- Écritures comptables -->
                <p-tabPanel [header]="'Écritures comptables (' + (d.ecritures?.length || 0) + ')'">
                    <p class="text-xs text-gray-500 mb-2">
                        Table <span class="font-mono">CG_ASTO_DETALLE</span>, rattachée par le numéro du crédit cité dans la référence de l'écriture. C'est ici qu'on retrouve l'écriture de régularisation.
                        <span *ngIf="!d.ecrituresCompletes" class="text-orange-600"> Plafond de lignes atteint.</span>
                    </p>
                    <p-table [value]="d.ecritures || []" styleClass="p-datatable-sm" [paginator]="(d.ecritures?.length || 0) > 30" [rows]="30" [scrollable]="true">
                        <ng-template pTemplate="header">
                            <tr><th>Écriture</th><th>Ligne</th><th>Date</th><th>Compte comptable</th><th class="text-right">Débit</th><th class="text-right">Crédit</th><th>Libellé</th><th>Référence</th></tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-e>
                            <tr>
                                <td class="font-mono text-xs">{{ e.NUM_ASIENTO }}</td>
                                <td class="text-xs">{{ e.NUM_LINEA }}</td>
                                <td class="text-xs">{{ jour(e.FEC_MOVIMIENTO) }}</td>
                                <td class="font-mono text-xs">{{ e.CUENTA_CONTABLE }}</td>
                                <td class="text-right">{{ e.DEBITO | number: '1.0-2' }}</td>
                                <td class="text-right">{{ e.CREDITO | number: '1.0-2' }}</td>
                                <td class="text-xs">{{ e.DETALLE }}</td>
                                <td class="text-xs">{{ e.REFERENCIA }}</td>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="emptymessage"><tr><td colspan="8" class="text-center text-gray-500 py-4">Aucune écriture rattachée.</td></tr></ng-template>
                    </p-table>
                </p-tabPanel>
            </p-tabView>
            }
            } @else {
            <p class="text-gray-500 py-4">Lecture du dossier dans SAF…</p>
            }
        </p-dialog>
    `
})
export class CreditsNegatifsComponent implements OnInit {
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

    data = signal<SituationCreditsNegatifs | null>(null);
    loading = signal(false);
    exportEnCours = signal(false);
    enregistrement = signal(false);
    inclureCorriges = signal(false);
    /** Vue « Corrigés » (26/10/2026) : les crédits clos, avec le solde lu dans SAF après correction. */
    vue = signal<'OUVERTS' | 'CORRIGES'>('OUVERTS');
    vues = [
        { label: 'Ouverts', value: 'OUVERTS' },
        { label: 'Corrigés', value: 'CORRIGES' }
    ];
    corriges = computed(() => (this.data()?.lignes ?? []).filter((l) => !!l.corrigeAt).filter((l) => {
        const q = this.recherche().trim().toLowerCase();
        return !q || [l.nomCliente, l.codCliente, String(l.numCredito), l.desAgencia].some((v) => (v || '').toLowerCase().includes(q));
    }));
    nbAvecPreuve = computed(() => this.corriges().filter((l) => l.soldeApres !== null).length);
    nbClosSaf = computed(() => this.corriges().filter((l) => l.conclusion === 'CLOS_SAF').length);
    montantRegularise = computed(() => this.corriges().filter((l) => l.conclusion !== 'CLOS_SAF').reduce((t, l) => t + Math.abs(l.pireSolde || 0), 0));

    changerVue(v: 'OUVERTS' | 'CORRIGES'): void {
        this.vue.set(v);
        const besoin = v === 'CORRIGES';
        if (this.inclureCorriges() !== besoin) {
            this.inclureCorriges.set(besoin);
            this.charger();
        }
    }

    completerPreuve(c: LigneCreditNegatif): void {
        this.verificationLigne.set(c.id);
        this.userService
            .completerPreuveCreditNegatif$(c.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res: IResponse) => {
                    this.verificationLigne.set(null);
                    const v = (res.data as any)?.verification;
                    this.messageService.add({ severity: v?.conclusion === 'TOUJOURS_NEGATIF' ? 'warn' : 'success', summary: 'Preuve', detail: res.message || v?.libelle || 'Lu', life: 7000 });
                    this.charger();
                },
                error: (err) => {
                    this.verificationLigne.set(null);
                    this.messageService.add({ severity: 'error', summary: 'Preuve', detail: err?.message || err || 'Lecture impossible', life: 6000 });
                }
            });
    }

    filtreEtat = signal<string>('TOUS');
    filtreSuivi = signal<string>('TOUS');
    recherche = signal('');

    showSuivi = signal(false);
    ligneSuivi = signal<LigneCreditNegatif | null>(null);
    commentaire = signal('');

    filtresSuivi = [
        { label: 'Tous', value: 'TOUS' },
        { label: 'À traiter', value: 'A_TRAITER' },
        { label: 'Pris en charge', value: 'PRIS' }
    ];

    filtresEtat = computed(() => {
        const etats = this.data()?.parEtat ?? [];
        return [{ label: 'Tous les états', value: 'TOUS' }, ...etats.map((e) => ({ label: `${e.libelle} (${e.nb})`, value: e.libelle }))];
    });

    lignesFiltrees = computed(() => {
        const d = this.data();
        if (!d) return [];
        const etat = this.filtreEtat();
        const suivi = this.filtreSuivi();
        const q = this.recherche().trim().toLowerCase();
        return d.lignes.filter((l) => {
            if (l.corrigeAt) return false;
            if (etat !== 'TOUS' && l.etat !== etat) return false;
            if (suivi === 'A_TRAITER' && (l.traiteAt || l.corrigeAt)) return false;
            if (suivi === 'PRIS' && !l.traiteAt) return false;
            if (!q) return true;
            return [l.nomCliente, l.codCliente, l.desAgencia, l.codAgencia, String(l.numCredito), l.codEjecutivo]
                .some((v) => (v || '').toLowerCase().includes(q));
        });
    });

    ngOnInit(): void {
        this.charger();
    }

    charger(): void {
        this.loading.set(true);
        this.userService
            .getCreditsNegatifs$(this.inclureCorriges())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res: IResponse) => {
                    this.data.set((res.data as any)?.situation ?? null);
                    this.loading.set(false);
                },
                error: (err: any) => {
                    this.loading.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Chargement', detail: err?.message || err || 'Lecture impossible', life: 6000 });
                }
            });
    }

    basculerCorriges(): void {
        this.inclureCorriges.set(!this.inclureCorriges());
        this.charger();
    }

    severiteEtat(c: LigneCreditNegatif): 'danger' | 'warn' | 'info' | 'secondary' {
        if (c.indEstado === 'I') return 'secondary';
        if (c.indEstado === 'J') return 'warn';
        return 'danger';
    }

    /** Confrontation à SAF production (V183) : lecture seule, l'état digi change selon la réponse. */
    verificationEnCours = signal(false);
    verificationLigne = signal<number | null>(null);

    // ---------------- Dossier SAF du credit (29/10/2026)
    afficherDossier = false;
    dossier = signal<DossierCredit | null>(null);
    chargementDossier = signal<number | null>(null);
    exportDossierEnCours = signal(false);
    ligneDossier = signal<LigneCreditNegatif | null>(null);
    ficheComplete = signal(false);
    optionsFiche = [
        { label: 'Champs utiles', value: 'resume' },
        { label: 'Toutes les colonnes', value: 'tout' }
    ];

    /** Les champs de la fiche qui servent au diagnostic d'un solde negatif, dans cet ordre. */
    private static readonly CHAMPS_UTILES = [
        'NUM_CREDITO', 'COD_CLIENTE', 'COD_AGENCIA', 'TIP_CREDITO', 'IND_ESTADO', 'ID_CUENTA',
        'MON_CREDITO', 'MON_SALDO', 'MON_DESEMBOLSADO', 'MON_PAGADO_PRINCIPAL', 'MON_PAGADO_INTERESES',
        'MON_INT_ACUMULADO', 'MON_INT_SUSPENSO', 'MON_INT_MORA_ACUMULA', 'MON_PROVISION',
        'MON_SUSPEN_PRINCIPAL', 'MON_SUSPEN_INTERESES', 'MON_CUOTA', 'CANT_CUOTAS', 'PLAZO_CREDITO',
        'FEC_APERTURA', 'FEC_VENCIMIENTO', 'FEC_CANCELACION', 'FEC_ULT_PAGO_PRINCIPAL',
        'FEC_ULT_PAGO_INTERESES', 'FEC_ULT_DESEMBOLSO', 'FEC_RENOVACION',
        'COD_USUARIO', 'COD_EJECUTIVO', 'COD_OFICIAL', 'IND_BLOQUEO', 'COD_ESTADO_CONTABLE',
        'COD_TIPO_RAZON_CANCELACION', 'COD_TIPO_RAZON_ANULACION', 'OBSERVACIONES'
    ];

    titreDossier = computed(() => {
        const l = this.ligneDossier();
        return l ? `Dossier du crédit ${l.numCredito} — ${l.nomCliente}` : 'Dossier du crédit';
    });

    nbColonnesFiche = computed(() => Object.keys(this.dossier()?.fiche || {}).length);

    totalMillis = computed(() => {
        const m = this.dossier()?.millisecondes;
        return m ? Object.values(m).reduce((s, v) => s + v, 0) : null;
    });

    /** La fiche en couples lisibles : les champs utiles, ou toutes les colonnes de la table. */
    champsFiche = computed<{ cle: string; valeur: any }[]>(() => {
        const f = this.dossier()?.fiche;
        if (!f) return [];
        if (this.ficheComplete()) {
            return Object.keys(f).map((cle) => ({ cle, valeur: f[cle] }));
        }
        return CreditsNegatifsComponent.CHAMPS_UTILES.filter((cle) => cle in f).map((cle) => ({ cle, valeur: f[cle] }));
    });

    /** Pourquoi une ligne n'a pas de solde fige : il n'y avait rien a figer, ou la cloture est trop ancienne. */
    motifSansSoldeCorrige(c: LigneCreditNegatif): string {
        if (c.conclusion === 'CLOS_SAF') {
            return "Le crédit a disparu de SAF : il n'y a pas eu de régularisation à figer";
        }
        if (c.conclusion === 'ARRONDI') {
            return "Moins d'un franc : seule une écriture de régularisation dans SAF le corrigera";
        }
        return 'Clôture antérieure à la preuve de correction : la valeur ne peut pas être reconstituée';
    }

    /** Le mouvement ou le solde franchit zero : solde avant positif ou nul, solde apres negatif. */
    bascule(m: Record<string, any>): boolean {
        const avant = Number(m?.['VAL_ANTERIOR']);
        const apres = Number(m?.['VAL_ACTUAL']);
        return Number.isFinite(avant) && Number.isFinite(apres) && avant >= 0 && apres < 0;
    }

    jour(v: any): string {
        if (!v) return '';
        const d = new Date(v);
        return Number.isNaN(d.getTime()) ? String(v) : d.toLocaleDateString('fr-FR');
    }

    valeur(v: any): string {
        if (v === null || v === undefined || v === '') return '—';
        if (typeof v === 'number') return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(v);
        if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v)) return this.jour(v);
        return String(v);
    }

    ouvrirDossier(c: LigneCreditNegatif): void {
        this.ligneDossier.set(c);
        this.dossier.set(null);
        this.ficheComplete.set(false);
        this.afficherDossier = true;
        this.chargementDossier.set(c.id);
        this.userService
            .getDossierCreditNegatif$(c.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.dossier.set(((r.data as any)?.dossier as DossierCredit) || null);
                    this.chargementDossier.set(null);
                },
                error: (err) => {
                    this.chargementDossier.set(null);
                    this.afficherDossier = false;
                    this.messageService.add({ severity: 'error', summary: 'Dossier', detail: err || 'Lecture SAF impossible', life: 7000 });
                }
            });
    }

    exporterDossier(): void {
        const l = this.ligneDossier();
        if (!l) return;
        this.exportDossierEnCours.set(true);
        this.userService
            .exportDossierCreditNegatif$(l.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (reponse: HttpResponse<Blob>) => {
                    this.exportDossierEnCours.set(false);
                    const disposition = reponse.headers.get('Content-Disposition') || '';
                    const nom = /filename="?([^";]+)"?/.exec(disposition)?.[1] || `Dossier_credit_${l.numCredito}.xlsx`;
                    const url = URL.createObjectURL(reponse.body as Blob);
                    const lien = document.createElement('a');
                    lien.href = url;
                    lien.download = nom;
                    lien.click();
                    URL.revokeObjectURL(url);
                },
                error: () => {
                    this.exportDossierEnCours.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Export', detail: "Échec de l'export du dossier", life: 6000 });
                }
            });
    }

    verifierUn(c: LigneCreditNegatif): void {
        this.verificationLigne.set(c.id);
        this.userService
            .verifierCreditNegatif$(c.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res: IResponse) => {
                    this.verificationLigne.set(null);
                    const v = (res.data as any)?.verification;
                    this.messageService.add({
                        severity: v?.conclusion === 'CORRIGE' ? 'success' : v?.conclusion === 'TOUJOURS_NEGATIF' ? 'warn' : 'info',
                        summary: 'Vérification SAF',
                        detail: res.message || v?.libelle || 'Vérifié',
                        life: 6000
                    });
                    this.charger();
                },
                error: (err) => {
                    this.verificationLigne.set(null);
                    this.messageService.add({ severity: 'error', summary: 'Vérification SAF', detail: err?.message || err || 'Vérification impossible', life: 6000 });
                }
            });
    }

    verifierTous(): void {
        this.verificationEnCours.set(true);
        this.userService
            .verifierCreditsNegatifsPrisEnCharge$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res: IResponse) => {
                    this.verificationEnCours.set(false);
                    this.messageService.add({ severity: 'info', summary: 'Vérification SAF', detail: res.message || 'Terminé', life: 8000 });
                    this.charger();
                },
                error: (err) => {
                    this.verificationEnCours.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Vérification SAF', detail: err?.message || err || 'Vérification impossible', life: 6000 });
                }
            });
    }

    ouvrirSuivi(c: LigneCreditNegatif): void {
        this.ligneSuivi.set(c);
        this.commentaire.set('');
        this.showSuivi.set(true);
    }

    confirmerSuivi(): void {
        const c = this.ligneSuivi();
        if (!c) return;
        this.enregistrement.set(true);
        this.userService
            .suiviCreditNegatif$(c.id, this.commentaire() || null, true)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res: IResponse) => {
                    this.enregistrement.set(false);
                    this.showSuivi.set(false);
                    this.messageService.add({ severity: 'success', summary: 'Suivi', detail: res.message || 'Enregistré' });
                    this.charger();
                },
                error: (err: any) => {
                    this.enregistrement.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Suivi', detail: err?.message || err || 'Enregistrement impossible', life: 6000 });
                }
            });
    }

    retirerSuivi(c: LigneCreditNegatif): void {
        this.userService
            .suiviCreditNegatif$(c.id, null, false)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.messageService.add({ severity: 'info', summary: 'Suivi', detail: 'Prise en charge retirée' });
                    this.charger();
                },
                error: (err: any) => this.messageService.add({ severity: 'error', summary: 'Suivi', detail: err?.message || err || 'Action impossible', life: 6000 })
            });
    }

    exporter(): void {
        this.exportEnCours.set(true);
        this.userService
            .exportCreditsNegatifs$(this.inclureCorriges())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res: HttpResponse<Blob>) => {
                    this.exportEnCours.set(false);
                    const blob = res.body;
                    if (!blob) return;
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `Credits_negatifs_${new Date().toISOString().slice(0, 10)}.xlsx`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                },
                error: () => {
                    this.exportEnCours.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Export', detail: 'Export impossible' });
                }
            });
    }
}
