import { AgregatRapport, EtatRapport, LigneRapport, MOIS_LIBELLES, RapportMensuel, RubriqueRapport } from '@/interface/rapport-mensuel';
import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { AfterViewChecked, Component, DestroyRef, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { Observable } from 'rxjs';

interface GroupeAgence {
    agregat: AgregatRapport;
    lignes: LigneRapport[];
}

/**
 * Indicateurs mensuels (V167, module A). Tout est saisi à la main par le directeur d'agence,
 * point de service par point de service ; SAF n'est qu'un contrôle affiché en regard. Le
 * brouillon s'enregistre tout seul au fil de la saisie, et à l'explicite par le bouton.
 * Le DR vérifie et valide (ou renvoie), la Direction de l'Exploitation consolide.
 */
@Component({
    selector: 'app-rapport-mensuel',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, DialogModule, InputTextModule, SelectModule, SelectButtonModule, TableModule, TagModule, TextareaModule, ToastModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>
        <div class="card">
            <!-- En-tête : période, actions globales -->
            <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                    <h2 class="text-xl font-semibold m-0">Indicateurs mensuels</h2>
                    <div class="text-sm text-gray-500">
                        <ng-container *ngIf="data()?.peutSaisir">Saisissez les 13 rubriques de chaque point de service ; tout s'enregistre en brouillon au fil de la saisie. Soumettez l'agence quand tout est complet.</ng-container>
                        <ng-container *ngIf="data() && !data()!.peutSaisir">Rapports saisis par les agences ; la colonne SAF est un contrôle, la saisie fait foi.</ng-container>
                    </div>
                </div>
                <div class="flex flex-wrap gap-2 items-center">
                    <p-select [options]="moisOptions" [ngModel]="mois()" (ngModelChange)="changerPeriode($event, annee())" optionLabel="label" optionValue="value" styleClass="w-40" appendTo="body"></p-select>
                    <p-select [options]="anneeOptions" [ngModel]="annee()" (ngModelChange)="changerPeriode(mois(), $event)" optionLabel="label" optionValue="value" styleClass="w-28" appendTo="body"></p-select>
                    <button pButton icon="pi pi-refresh" class="p-button-text" (click)="charger()" [loading]="loading()" pTooltip="Recharger"></button>
                    <button pButton icon="pi pi-sync" label="Contrôle SAF" class="p-button-outlined" [loading]="safEnCours()" (click)="actualiserSaf()" pTooltip="Relit dans SAF les valeurs de contrôle (encours, retards, capital en retard, octrois du mois)"></button>
                    <button pButton icon="pi pi-file-excel" label="Exporter Excel" class="p-button-success p-button-outlined" [loading]="exportEnCours()" [disabled]="!data()?.lignes?.length" (click)="exporter()"></button>
                </div>
            </div>

            <div *ngIf="data()?.avertissementSaf" class="border border-orange-400 bg-orange-50 text-orange-800 rounded p-3 mb-3 flex items-start gap-2">
                <i class="pi pi-exclamation-triangle mt-1"></i><div>{{ data()!.avertissementSaf }}</div>
            </div>

            <!-- Avancement du mois -->
            <div class="grid grid-cols-3 md:grid-cols-7 gap-2 mb-4" *ngIf="data()?.total as t">
                <div class="border rounded p-2"><div class="text-xs text-gray-500 uppercase">Points de service</div><div class="text-xl font-bold">{{ t.nbPointsService }}</div></div>
                <div class="border rounded p-2"><div class="text-xs text-gray-500 uppercase">Complets</div><div class="text-xl font-bold" [class.text-green-700]="t.nbComplets === t.nbPointsService">{{ t.nbComplets }}</div></div>
                <div class="border rounded p-2"><div class="text-xs text-gray-500 uppercase">Soumis</div><div class="text-xl font-bold text-blue-700">{{ t.nbSoumis }}</div></div>
                <div class="border rounded p-2"><div class="text-xs text-gray-500 uppercase">Validés</div><div class="text-xl font-bold text-green-700">{{ t.nbValides }}</div></div>
                <div class="border rounded p-2"><div class="text-xs text-gray-500 uppercase">Renvoyés</div><div class="text-xl font-bold" [class.text-red-600]="t.nbRenvoyes > 0">{{ t.nbRenvoyes }}</div></div>
                <div class="border rounded p-2"><div class="text-xs text-gray-500 uppercase">Consolidés</div><div class="text-xl font-bold">{{ t.nbConsolides }}</div></div>
                <div class="border rounded p-2"><div class="text-xs text-gray-500 uppercase">Écarts SAF</div><div class="text-xl font-bold" [class.text-orange-600]="t.nbEcarts > 0">{{ t.nbEcarts }}</div></div>
            </div>

            <div class="flex flex-wrap items-center gap-3 mb-3">
                <p-selectButton [options]="vueOptions()" [ngModel]="vue()" (ngModelChange)="vue.set($event)" optionLabel="label" optionValue="value"></p-selectButton>
                <ng-container *ngIf="data()?.peutConsolider">
                    <button pButton icon="pi pi-lock" label="Consolider le mois" class="p-button-outlined ml-auto" [disabled]="!(data()!.total?.nbValides)" [loading]="actionEnCours()" (click)="consolider()" pTooltip="Fige les rapports validés : ils ne pourront plus être renvoyés"></button>
                </ng-container>
            </div>

            <!-- ============ VUE CARTES (DR / DE) : une carte par agence, un clic sur un PS ouvre sa fiche ============ -->
            <ng-container *ngIf="vue() === 'cartes' && data() as d">
                <ng-container *ngFor="let bloc of blocsCartes()">
                    <div *ngIf="bloc.titre" class="flex items-center gap-3 mt-2 mb-2">
                        <h3 class="text-base font-semibold m-0">{{ bloc.titre }}</h3>
                        <span class="text-xs text-gray-500">{{ bloc.agregat.nbComplets }}/{{ bloc.agregat.nbPointsService }} complets · {{ bloc.agregat.nbSoumis }} soumis · {{ bloc.agregat.nbValides }} validés · {{ bloc.agregat.nbConsolides }} consolidés<span *ngIf="bloc.agregat.nbEcarts"> · <span class="text-orange-600">{{ bloc.agregat.nbEcarts }} écart(s)</span></span></span>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mb-4">
                        <div *ngFor="let g of bloc.groupes" class="carte border rounded flex flex-col" [class.carte-alerte]="g.agregat.nbRenvoyes > 0" [class.carte-ok]="g.agregat.nbValides + g.agregat.nbConsolides === g.agregat.nbPointsService">
                            <div class="px-3 py-2 border-b bg-gray-50 flex items-start justify-between gap-2">
                                <div class="min-w-0">
                                    <div class="font-semibold text-base truncate">{{ g.agregat.libelle }}</div>
                                    <div class="text-xs text-gray-500">{{ g.agregat.nbPointsService }} PS · {{ g.agregat.nbComplets }} complets</div>
                                </div>
                                <p-tag [value]="etatAgence(g)" [severity]="severiteAgence(g)"></p-tag>
                            </div>
                            <div class="px-3 pt-2">
                                <div class="barre"><div class="barre-valide" [style.width.%]="pct(g.agregat.nbValides + g.agregat.nbConsolides, g.agregat.nbPointsService)"></div><div class="barre-soumis" [style.left.%]="pct(g.agregat.nbValides + g.agregat.nbConsolides, g.agregat.nbPointsService)" [style.width.%]="pct(g.agregat.nbSoumis, g.agregat.nbPointsService)"></div></div>
                                <div class="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>{{ g.agregat.nbSoumis }} à vérifier</span>
                                    <span [class.text-orange-600]="g.agregat.nbEcarts > 0">{{ g.agregat.nbEcarts }} écart(s) SAF</span>
                                </div>
                            </div>
                            <div class="px-1 py-2 flex-1">
                                <div *ngFor="let l of g.lignes" class="ps flex items-center justify-between gap-2 px-2 py-1 rounded cursor-pointer hover:bg-blue-50" (click)="ouvrirFiche(l.codAgencia)">
                                    <div class="min-w-0">
                                        <div class="text-sm font-medium truncate">{{ l.pointService }}</div>
                                        <div class="text-xs text-gray-500">{{ l.nbSaisies }}/{{ l.nbSaisies + l.nbManquantes }}<span *ngIf="l.nbEcarts" class="text-orange-600"> · {{ l.nbEcarts }} écart(s)</span><span *ngIf="l.calcules['TAUX_PAR'] != null"> · PAR {{ fmt(l.calcules['TAUX_PAR'], 'TAUX') }}</span></div>
                                    </div>
                                    <p-tag [value]="libelleEtat(l.etat)" [severity]="severiteEtat(l.etat)"></p-tag>
                                </div>
                            </div>
                            <div class="px-3 py-2 border-t flex justify-end gap-2" *ngIf="d.peutValider">
                                <button pButton icon="pi pi-undo" label="Renvoyer" class="p-button-sm p-button-danger p-button-text" [disabled]="!idsRenvoyables(g).length" (click)="ouvrirRenvoi(idsRenvoyables(g), g.agregat.libelle)"></button>
                                <button pButton icon="pi pi-check" [label]="'Valider (' + idsSoumis(g).length + ')'" class="p-button-sm p-button-success" [disabled]="!idsSoumis(g).length" [loading]="actionEnCours()" (click)="valider(idsSoumis(g))"></button>
                            </div>
                        </div>
                    </div>
                </ng-container>
                <div *ngIf="!loading() && !groupes().length" class="text-gray-500 p-3">Aucun point de service dans votre périmètre.</div>
            </ng-container>

            <!-- ============ VUE SAISIE (DA) : liste des PS + fiche ============ -->
            <div *ngIf="vue() === 'saisie'" class="grid grid-cols-12 gap-4">
                <!-- Liste des points de service, groupés par agence -->
                <div class="col-span-12 lg:col-span-4">
                    <div *ngFor="let g of groupes()" class="mb-3 border rounded">
                        <div class="flex items-center justify-between gap-2 px-3 py-2 bg-gray-50 border-b">
                            <div>
                                <div class="font-semibold">{{ g.agregat.libelle }}</div>
                                <div class="text-xs text-gray-500">{{ g.agregat.nbComplets }}/{{ g.agregat.nbPointsService }} complet(s) · {{ g.agregat.nbSoumis }} soumis · {{ g.agregat.nbValides }} validé(s)<span *ngIf="g.agregat.nbEcarts"> · <span class="text-orange-600">{{ g.agregat.nbEcarts }} écart(s)</span></span></div>
                            </div>
                            <div class="flex gap-1">
                                <button *ngIf="data()?.peutSaisir && nbSoumettables(g) > 0" pButton icon="pi pi-send" label="Soumettre l'agence" class="p-button-sm" [disabled]="!toutesCompletes(g)" [loading]="actionEnCours()" (click)="soumettre(g)" [pTooltip]="toutesCompletes(g) ? nbSoumettables(g) + ' rapport(s) seront soumis à la délégation' : 'Complétez d\\'abord toutes les rubriques de chaque point de service'"></button>
                                <ng-container *ngIf="data()?.peutValider">
                                    <button pButton icon="pi pi-check" class="p-button-sm p-button-success p-button-outlined" [disabled]="!idsSoumis(g).length" [loading]="actionEnCours()" (click)="valider(idsSoumis(g))" [pTooltip]="'Valider les ' + idsSoumis(g).length + ' rapport(s) soumis'"></button>
                                    <button pButton icon="pi pi-undo" class="p-button-sm p-button-danger p-button-outlined" [disabled]="!idsRenvoyables(g).length" (click)="ouvrirRenvoi(idsRenvoyables(g), g.agregat.libelle)" pTooltip="Renvoyer à l'agence avec un motif"></button>
                                </ng-container>
                            </div>
                        </div>
                        <div *ngFor="let l of g.lignes" class="px-3 py-2 border-b last:border-b-0 cursor-pointer flex items-center justify-between gap-2 hover:bg-blue-50" [class.bg-blue-50]="l.codAgencia === codeSelectionne()" (click)="selectionner(l.codAgencia)">
                            <div class="min-w-0">
                                <div class="font-medium truncate">{{ l.pointService }} <span class="text-xs text-gray-400">{{ l.codAgencia }}</span></div>
                                <div class="text-xs text-gray-500">
                                    {{ l.nbSaisies }}/{{ l.nbSaisies + l.nbManquantes }} rubriques
                                    <span *ngIf="l.nbEcarts" class="text-orange-600"> · {{ l.nbEcarts }} écart(s)</span>
                                    <span *ngIf="l.etat === 'RENVOYE' && l.motifRenvoi" class="text-red-600"> · {{ l.motifRenvoi }}</span>
                                </div>
                            </div>
                            <p-tag [value]="libelleEtat(l.etat)" [severity]="severiteEtat(l.etat)"></p-tag>
                        </div>
                    </div>
                    <div *ngIf="!loading() && !groupes().length" class="text-gray-500 p-3">Aucun point de service dans votre périmètre.</div>
                </div>

                <!-- Fiche de saisie du PS sélectionné -->
                <div class="col-span-12 lg:col-span-8">
                    <ng-container *ngIf="ligne(); else choisir"><ng-container *ngTemplateOutlet="ficheTpl"></ng-container></ng-container>
                    <ng-template #choisir>
                        <div class="text-gray-500 p-6 text-center border rounded border-dashed" *ngIf="!loading()">Choisissez un point de service dans la liste.</div>
                    </ng-template>
                </div>
            </div>

            <!-- ============ VUE TABLEAU : la grille du fichier ============ -->
            <ng-container *ngIf="vue() === 'tableau' && data() as d">
                <!-- Barre de navigation horizontale : on reste en haut, la grille défile sous les en-têtes -->
                <div class="nav-grille flex flex-wrap items-center gap-2 mb-1" *ngIf="defilementMax() > 0">
                    <button pButton icon="pi pi-step-backward" class="p-button-text p-button-sm" (click)="allerA(0)" [disabled]="defilementPos() <= 0" pTooltip="Première colonne"></button>
                    <button pButton icon="pi pi-chevron-left" class="p-button-outlined p-button-sm" (click)="defiler(-1)" [disabled]="defilementPos() <= 0" pTooltip="Colonnes précédentes (← au clavier)"></button>
                    <input type="range" class="flex-1 min-w-40" min="0" [max]="defilementMax()" step="1" [value]="defilementPos()" (input)="allerA(+$any($event.target).value)" aria-label="Défilement horizontal de la grille" />
                    <button pButton icon="pi pi-chevron-right" class="p-button-outlined p-button-sm" (click)="defiler(1)" [disabled]="defilementPos() >= defilementMax()" pTooltip="Colonnes suivantes (→ au clavier)"></button>
                    <button pButton icon="pi pi-step-forward" class="p-button-text p-button-sm" (click)="allerA(defilementMax())" [disabled]="defilementPos() >= defilementMax()" pTooltip="Dernière colonne"></button>
                    <span class="text-xs text-gray-500 whitespace-nowrap">{{ colonnesVisibles() }}</span>
                </div>
                <div #grille class="grille-conteneur" tabindex="0" (scroll)="surDefilement()" (keydown.arrowleft)="defiler(-1); $event.preventDefault()" (keydown.arrowright)="defiler(1); $event.preventDefault()">
                <table class="w-full text-xs grille">
                    <thead>
                        <tr class="uppercase text-gray-600">
                            <th class="text-left py-2 pr-2 sticky-col">Point de service</th>
                            <th *ngFor="let r of d.rubriques" class="text-right py-2 px-2 whitespace-nowrap" [class.text-gray-400]="r.nature === 'CALCUL'" [pTooltip]="r.libelle">{{ r.libelleCourt }}</th>
                            <th class="text-left py-2 px-2">État</th>
                        </tr>
                    </thead>
                    <tbody>
                        <ng-container *ngFor="let g of groupes()">
                            <tr *ngFor="let l of g.lignes; let i = index" class="border-t hover:bg-blue-50 cursor-pointer" (click)="ouvrirDepuisTableau(l)">
                                <td class="py-1 pr-2 whitespace-nowrap sticky-col">{{ i + 1 }}. {{ l.pointService }}</td>
                                <td *ngFor="let r of d.rubriques" class="text-right px-2 tabular" [class.bg-orange-50]="l.valeurs[r.code]?.ecart" [class.text-gray-300]="r.nature === 'SAISIE' && l.valeurs[r.code]?.valeur == null">
                                    {{ r.nature === 'CALCUL' ? fmt(l.calcules[r.code], r.format) : (l.valeurs[r.code]?.valeur == null ? '·' : fmt(l.valeurs[r.code]?.valeur, r.format)) }}
                                </td>
                                <td class="px-2"><p-tag [value]="libelleEtat(l.etat)" [severity]="severiteEtat(l.etat)"></p-tag></td>
                            </tr>
                            <tr class="border-t bg-gray-100 font-semibold">
                                <td class="py-1 pr-2 whitespace-nowrap sticky-col">TOTAL AGENCE {{ g.agregat.libelle | uppercase }}</td>
                                <td *ngFor="let r of d.rubriques" class="text-right px-2 tabular">{{ fmt(g.agregat.valeurs[r.code], r.format) }}</td>
                                <td class="px-2 text-gray-500 font-normal">{{ g.agregat.nbComplets }}/{{ g.agregat.nbPointsService }} complets</td>
                            </tr>
                        </ng-container>
                        <ng-container *ngIf="d.delegations.length > 1">
                            <tr *ngFor="let del of d.delegations" class="border-t bg-blue-50 font-semibold">
                                <td class="py-1 pr-2 whitespace-nowrap sticky-col">DR {{ del.libelle | uppercase }}</td>
                                <td *ngFor="let r of d.rubriques" class="text-right px-2 tabular">{{ fmt(del.valeurs[r.code], r.format) }}</td>
                                <td class="px-2 text-gray-500 font-normal">{{ del.nbComplets }}/{{ del.nbPointsService }}</td>
                            </tr>
                        </ng-container>
                        <tr *ngIf="d.total && (d.delegations.length !== 1 || d.niveau === 'RESEAU')" class="border-t-2 bg-blue-100 font-bold">
                            <td class="py-1 pr-2 whitespace-nowrap sticky-col">{{ d.total.libelle }}</td>
                            <td *ngFor="let r of d.rubriques" class="text-right px-2 tabular">{{ fmt(d.total.valeurs[r.code], r.format) }}</td>
                            <td class="px-2 font-normal text-gray-500">{{ d.total.nbComplets }}/{{ d.total.nbPointsService }}</td>
                        </tr>
                        <tr *ngIf="d.total && d.delegations.length === 1 && d.niveau !== 'RESEAU'" class="border-t-2 bg-blue-100 font-bold">
                            <td class="py-1 pr-2 whitespace-nowrap sticky-col">DR {{ d.delegations[0].libelle | uppercase }}</td>
                            <td *ngFor="let r of d.rubriques" class="text-right px-2 tabular">{{ fmt(d.delegations[0].valeurs[r.code], r.format) }}</td>
                            <td class="px-2 font-normal text-gray-500">{{ d.delegations[0].nbComplets }}/{{ d.delegations[0].nbPointsService }}</td>
                        </tr>
                    </tbody>
                </table>
                </div>
                <div class="text-xs text-gray-400 mt-2">Les taux de retards, de réalisation, de couverture des charges et de PAR sont calculés ; le taux de remboursement d'une agence est la moyenne simple de ses points de service, comme dans le fichier actuel.</div>
            </ng-container>
        </div>


        <!-- Fiche d'un point de service : partagée entre la colonne de saisie (DA) et la fenêtre (DR / DE) -->
        <ng-template #ficheTpl>
                    <ng-container *ngIf="ligne() as l">
                        <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <div>
                                <div class="text-lg font-semibold">{{ l.pointService }} <span class="text-sm text-gray-400">{{ l.agence }} · {{ l.delegation }}</span></div>
                                <div class="text-xs text-gray-500">
                                    <p-tag [value]="libelleEtat(l.etat)" [severity]="severiteEtat(l.etat)"></p-tag>
                                    <span *ngIf="l.saisiPar"> · saisi par {{ l.saisiPar }} le {{ l.dateSaisie | date: 'dd/MM HH:mm' }}</span>
                                    <span *ngIf="l.soumisPar"> · soumis par {{ l.soumisPar }} le {{ l.dateSoumission | date: 'dd/MM HH:mm' }}</span>
                                    <span *ngIf="l.validePar"> · validé par {{ l.validePar }} le {{ l.dateValidation | date: 'dd/MM HH:mm' }}</span>
                                    <span *ngIf="l.consolidePar"> · consolidé le {{ l.dateConsolidation | date: 'dd/MM HH:mm' }}</span>
                                </div>
                            </div>
                            <div class="flex gap-1">
                                <button pButton icon="pi pi-chevron-left" class="p-button-text p-button-sm" [disabled]="!precedent()" (click)="aller(precedent())" pTooltip="Point de service précédent"></button>
                                <button pButton icon="pi pi-chevron-right" class="p-button-text p-button-sm" [disabled]="!suivant()" (click)="aller(suivant())" pTooltip="Point de service suivant"></button>
                            </div>
                        </div>

                        <div *ngIf="l.etat === 'RENVOYE'" class="border border-red-300 bg-red-50 text-red-800 rounded p-2 mb-2 text-sm">
                            <i class="pi pi-undo mr-1"></i>Renvoyé par {{ l.renvoyePar }} le {{ l.dateRenvoi | date: 'dd/MM/yyyy' }} : <strong>{{ l.motifRenvoi }}</strong>
                        </div>

                        <div *ngIf="l.modifiable" class="flex flex-wrap gap-2 mb-2 text-sm items-center">
                            <button pButton icon="pi pi-clipboard" label="Coller depuis Excel" class="p-button-text p-button-sm" (click)="showColler = true" pTooltip="Collez une ligne du fichier Excel : les 13 rubriques se remplissent dans l'ordre des colonnes"></button>
                            <button pButton icon="pi pi-history" label="Reprendre le mois précédent" class="p-button-text p-button-sm" [disabled]="!aMoisPrecedent()" (click)="reprendreMoisPrecedent()" pTooltip="Remplit les rubriques encore vides avec les valeurs déclarées le mois dernier (à corriger ensuite)"></button>
                            <span class="text-gray-400 ml-auto">Entrée : rubrique suivante · un espace sépare les milliers · les taux en %</span>
                        </div>

                        <div class="overflow-x-auto">
                            <table class="w-full text-sm fiche">
                                <thead>
                                    <tr class="text-xs uppercase text-gray-500">
                                        <th class="text-left py-1">Rubrique</th>
                                        <th class="text-right py-1 px-2 w-36">Mois précédent</th>
                                        <th class="text-right py-1 px-2 w-48">{{ l.modifiable ? 'Saisie' : 'Déclaré' }}</th>
                                        <th class="text-right py-1 px-2 w-40">Contrôle SAF</th>
                                        <th class="text-right py-1 px-2 w-24">Écart</th>
                                        <th class="text-left py-1 px-2">Commentaire</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr *ngFor="let r of data()!.rubriques; let i = index" class="border-t" [class.bg-gray-50]="r.nature === 'CALCUL'" [class.bg-orange-50]="l.valeurs[r.code]?.ecart">
                                        <td class="py-1 pr-2">
                                            <div class="font-medium" [class.text-gray-500]="r.nature === 'CALCUL'">{{ r.libelle }}</div>
                                            <div class="text-xs text-gray-400">{{ r.nature === 'CALCUL' ? 'Calculé : ' + formuleLisible(r) : r.aide }}</div>
                                        </td>
                                        <td class="text-right px-2 text-gray-500 tabular">{{ r.nature === 'SAISIE' ? fmt(l.moisPrecedent[r.code], r.format) : '' }}</td>
                                        <td class="text-right px-2">
                                            <ng-container *ngIf="r.nature === 'SAISIE'; else calc">
                                                <input *ngIf="l.modifiable; else lecture" pInputText [id]="'inp-' + r.code" type="text" inputmode="decimal" class="w-full text-right tabular" [class.manquant]="texte[r.code] === ''" [ngModel]="texte[r.code]" (ngModelChange)="saisir(r.code, $event)" (blur)="formater(r)" (focus)="brut(r)" (keydown.enter)="focusSuivant(i, 1)" (keydown.shift.enter)="focusSuivant(i, -1)" (paste)="coller($event, i)" [placeholder]="r.format === 'TAUX' ? '%' : '0'" autocomplete="off" />
                                                <ng-template #lecture><span class="tabular" [class.text-gray-400]="l.valeurs[r.code]?.valeur == null">{{ l.valeurs[r.code]?.valeur == null ? 'non saisi' : fmt(l.valeurs[r.code]?.valeur, r.format) }}</span></ng-template>
                                            </ng-container>
                                            <ng-template #calc><span class="tabular text-gray-600">{{ fmt(calculLocal(r), r.format) }}</span></ng-template>
                                        </td>
                                        <td class="text-right px-2 tabular">
                                            <ng-container *ngIf="r.controleSaf">
                                                <div>{{ l.valeurs[r.code]?.valeurSaf != null ? fmt(l.valeurs[r.code]?.valeurSaf, r.format) : '—' }}</div>
                                                <div class="text-xs text-gray-400" *ngIf="l.valeurs[r.code]?.dateLectureSaf">lu le {{ l.valeurs[r.code]?.dateLectureSaf | date: 'dd/MM HH:mm' }}</div>
                                            </ng-container>
                                            <span *ngIf="!r.controleSaf && r.nature === 'SAISIE'" class="text-xs text-gray-300">pas de contrôle</span>
                                        </td>
                                        <td class="text-right px-2 tabular">
                                            <ng-container *ngIf="r.controleSaf && ecartLocal(r) as e">
                                                <span [class.text-orange-600]="e.alerte" [class.font-semibold]="e.alerte" [class.text-gray-400]="!e.alerte">{{ e.pct == null ? '' : (e.pct > 0 ? '+' : '') + (e.pct * 100 | number: '1.1-1') + ' %' }}</span>
                                                <i *ngIf="e.alerte" class="pi pi-exclamation-triangle text-orange-600 ml-1" pTooltip="Écart au-delà des seuils : expliquez-le dans le commentaire"></i>
                                            </ng-container>
                                        </td>
                                        <td class="px-2">
                                            <ng-container *ngIf="r.controleSaf">
                                                <input *ngIf="l.modifiable; else lectureCom" pInputText type="text" class="w-full text-sm" [ngModel]="commentaires[r.code]" (ngModelChange)="commenter(r.code, $event)" placeholder="Pourquoi l'écart ?" maxlength="500" />
                                                <ng-template #lectureCom><span class="text-gray-600">{{ l.valeurs[r.code]?.commentaire }}</span></ng-template>
                                            </ng-container>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="mt-3">
                            <label class="text-xs text-gray-500 uppercase">Commentaire du point de service</label>
                            <textarea *ngIf="l.modifiable; else lectureComGlobal" pTextarea rows="2" class="w-full" [ngModel]="commentaireGlobal" (ngModelChange)="commentaireGlobal = $event; marquerModifie()" maxlength="1000" placeholder="Faits marquants du mois, précisions pour la délégation…"></textarea>
                            <ng-template #lectureComGlobal><div class="text-sm text-gray-600">{{ l.commentaire || '—' }}</div></ng-template>
                        </div>

                        <div class="flex flex-wrap items-center justify-between gap-2 mt-3" *ngIf="l.modifiable">
                            <div class="text-sm">
                                <span *ngIf="sauvegardeEnCours()" class="text-gray-500"><i class="pi pi-spin pi-spinner mr-1"></i>Enregistrement…</span>
                                <span *ngIf="!sauvegardeEnCours() && modifie()" class="text-orange-600"><i class="pi pi-pencil mr-1"></i>Modifications non enregistrées</span>
                                <span *ngIf="!sauvegardeEnCours() && !modifie() && dernierEnregistrement()" class="text-green-700"><i class="pi pi-check mr-1"></i>Brouillon enregistré à {{ dernierEnregistrement() | date: 'HH:mm:ss' }}</span>
                                <span *ngIf="!sauvegardeEnCours() && !modifie() && !dernierEnregistrement()" class="text-gray-400">Brouillon · {{ l.nbManquantes }} rubrique(s) à saisir</span>
                            </div>
                            <div class="flex gap-2">
                                <button pButton icon="pi pi-save" label="Enregistrer le brouillon" class="p-button-outlined" [loading]="sauvegardeEnCours()" (click)="enregistrer(false)"></button>
                                <button pButton icon="pi pi-send" label="Soumettre ce point de service" [disabled]="!peutSoumettreLigne(l)" [loading]="actionEnCours()" (click)="soumettreLigne(l)" [pTooltip]="peutSoumettreLigne(l) ? 'Le rapport part à la délégation ; il ne sera plus modifiable sauf renvoi' : 'Toutes les rubriques doivent être renseignées (0 compris)'"></button>
                            </div>
                        </div>
                    </ng-container>
        </ng-template>

        <!-- Fiche d'un point de service en fenêtre (vue cartes) -->
        <p-dialog [(visible)]="showFiche" [modal]="true" [maximizable]="true" [dismissableMask]="true" [style]="{ width: '72rem', maxWidth: '96vw' }" [header]="ligne()?.pointService || 'Point de service'">
            <ng-container *ngTemplateOutlet="ficheTpl"></ng-container>
            <ng-template pTemplate="footer">
                <div class="flex flex-wrap items-center justify-between gap-2 w-full" *ngIf="ligne() as l">
                    <div class="flex gap-1">
                        <button pButton icon="pi pi-chevron-left" label="Précédent" class="p-button-text p-button-sm" [disabled]="!precedent()" (click)="aller(precedent())"></button>
                        <button pButton icon="pi pi-chevron-right" label="Suivant" iconPos="right" class="p-button-text p-button-sm" [disabled]="!suivant()" (click)="aller(suivant())"></button>
                    </div>
                    <div class="flex gap-2">
                        <button pButton label="Fermer" class="p-button-text" (click)="showFiche = false"></button>
                        <ng-container *ngIf="data()?.peutValider">
                            <button pButton icon="pi pi-undo" label="Renvoyer" class="p-button-danger p-button-outlined" [disabled]="l.etat !== 'SOUMIS' && l.etat !== 'VALIDE'" (click)="ouvrirRenvoi([l.id], l.pointService)"></button>
                            <button pButton icon="pi pi-check" label="Valider" class="p-button-success" [disabled]="l.etat !== 'SOUMIS'" [loading]="actionEnCours()" (click)="valider([l.id])"></button>
                        </ng-container>
                    </div>
                </div>
            </ng-template>
        </p-dialog>

        <!-- Coller depuis Excel -->
        <p-dialog header="Coller depuis Excel" [(visible)]="showColler" [modal]="true" [style]="{ width: '34rem' }">
            <p class="text-sm text-gray-600 mb-2">Copiez dans Excel les cellules de la ligne du point de service, de <strong>ENCAISSES</strong> à <strong>CAPITAL RESTANT DÛ</strong> (colonnes C à R), puis collez ici. Les colonnes calculées sont ignorées ; les taux peuvent être en % (97) ou en fraction (0,97).</p>
            <textarea pTextarea rows="4" class="w-full font-mono text-sm" [(ngModel)]="texteColle" placeholder="615527000	3310624915	240041616	0,97	…"></textarea>
            <ng-template pTemplate="footer">
                <button pButton label="Annuler" class="p-button-text" (click)="showColler = false"></button>
                <button pButton label="Remplir" icon="pi pi-check" [disabled]="!texteColle.trim()" (click)="appliquerCollage()"></button>
            </ng-template>
        </p-dialog>

        <!-- Renvoi à l'agence -->
        <p-dialog [header]="'Renvoyer à l\\'agence — ' + renvoiLibelle" [(visible)]="showRenvoi" [modal]="true" [style]="{ width: '30rem' }">
            <p class="text-sm text-gray-600 mb-2">{{ renvoiIds.length }} rapport(s) repasseront en correction chez le directeur d'agence, qui verra ce motif.</p>
            <textarea pTextarea rows="3" class="w-full" [(ngModel)]="renvoiMotif" maxlength="500" placeholder="Ce qui doit être corrigé…"></textarea>
            <ng-template pTemplate="footer">
                <button pButton label="Annuler" class="p-button-text" (click)="showRenvoi = false"></button>
                <button pButton label="Renvoyer" icon="pi pi-undo" class="p-button-danger" [disabled]="renvoiMotif.trim().length < 5" [loading]="actionEnCours()" (click)="renvoyer()"></button>
            </ng-template>
        </p-dialog>
    `,
    styles: [
        `
            .tabular { font-variant-numeric: tabular-nums; }
            .fiche input.manquant { border-color: #f59e0b; background: #fffbeb; }
            .grille-conteneur { overflow: auto; max-height: calc(100vh - 230px); scroll-behavior: smooth; outline: none; border: 1px solid #e5e7eb; border-radius: 4px; }
            .grille-conteneur:focus-visible { box-shadow: 0 0 0 2px #93c5fd; }
            .grille thead th { position: sticky; top: 0; background: #f9fafb; z-index: 2; }
            .grille th.sticky-col, .grille td.sticky-col { position: sticky; left: 0; background: inherit; z-index: 1; }
            .grille thead th.sticky-col { z-index: 3; }
            .grille tbody tr:not(.bg-gray-100):not(.bg-blue-50):not(.bg-blue-100) td.sticky-col { background: #fff; }
            .nav-grille { position: sticky; top: 0; z-index: 4; background: #fff; padding: 4px 0; }
            .carte { background: #fff; transition: box-shadow 0.15s; }
            .carte:hover { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); }
            .carte-alerte { border-color: #fca5a5; }
            .carte-ok { border-color: #86efac; }
            .barre { position: relative; height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden; }
            .barre-valide { position: absolute; left: 0; top: 0; height: 100%; background: #16a34a; }
            .barre-soumis { position: absolute; top: 0; height: 100%; background: #60a5fa; }
            .ps + .ps { border-top: 1px solid #f3f4f6; }
            .nav-grille input[type='range'] { accent-color: #2563eb; cursor: pointer; }
        `
    ]
})
export class RapportMensuelComponent implements OnInit, OnDestroy, AfterViewChecked {
    private readonly userService = inject(UserService);
    private readonly messageService = inject(MessageService);
    private readonly destroyRef = inject(DestroyRef);

    data = signal<RapportMensuel | null>(null);
    loading = signal(false);
    safEnCours = signal(false);
    exportEnCours = signal(false);
    actionEnCours = signal(false);
    sauvegardeEnCours = signal(false);
    modifie = signal(false);
    dernierEnregistrement = signal<Date | null>(null);
    vue = signal<'saisie' | 'cartes' | 'tableau'>('saisie');
    showFiche = false;
    codeSelectionne = signal<string | null>(null);
    annee = signal(0);
    mois = signal(0);

    /** Le DA saisit point par point ; le DR et la DE vérifient par agence (cartes) ou dans la grille. */
    vueOptions = computed(() =>
        this.data()?.peutSaisir
            ? [
                  { label: 'Saisie par point de service', value: 'saisie' },
                  { label: 'Vue tableau', value: 'tableau' }
              ]
            : [
                  { label: 'Par agence', value: 'cartes' },
                  { label: 'Vue tableau', value: 'tableau' }
              ]
    );
    moisOptions = MOIS_LIBELLES.map((label, i) => ({ label, value: i + 1 }));
    anneeOptions: { label: string; value: number }[] = [];

    /** Texte affiché dans chaque champ du PS sélectionné (formaté hors focus, brut pendant la frappe). */
    texte: Record<string, string> = {};
    commentaires: Record<string, string> = {};
    commentaireGlobal = '';
    showColler = false;
    texteColle = '';
    showRenvoi = false;
    renvoiIds: number[] = [];
    renvoiLibelle = '';
    renvoiMotif = '';

    private timerAutosave: ReturnType<typeof setTimeout> | null = null;
    private enEdition: string | null = null;

    /** Navigation horizontale de la vue tableau sans aller chercher l'ascenseur en bas de page. */
    @ViewChild('grille') grille?: ElementRef<HTMLDivElement>;
    defilementPos = signal(0);
    defilementMax = signal(0);
    colonnesVisibles = signal('');

    groupes = computed<GroupeAgence[]>(() => {
        const d = this.data();
        if (!d) return [];
        return d.agences.map((a) => ({ agregat: a, lignes: d.lignes.filter((l) => l.agenceId === a.id) }));
    });
    /** Cartes groupées par délégation quand le périmètre en couvre plusieurs (DE), sinon un seul bloc sans titre. */
    blocsCartes = computed<{ titre: string | null; agregat: AgregatRapport; groupes: GroupeAgence[] }[]>(() => {
        const d = this.data();
        if (!d) return [];
        const groupes = this.groupes();
        if (d.delegations.length <= 1) {
            const agregat = d.delegations[0] || d.total;
            return agregat ? [{ titre: null, agregat, groupes }] : [];
        }
        return d.delegations.map((del) => ({ titre: 'DR ' + del.libelle, agregat: del, groupes: groupes.filter((g) => g.agregat.parentId === del.id) }));
    });
    private ordre = computed(() => this.groupes().flatMap((g) => g.lignes.map((l) => l.codAgencia)));
    ligne = computed(() => this.data()?.lignes.find((l) => l.codAgencia === this.codeSelectionne()) ?? null);
    precedent = computed(() => {
        const i = this.ordre().indexOf(this.codeSelectionne() || '');
        return i > 0 ? this.ordre()[i - 1] : null;
    });
    suivant = computed(() => {
        const i = this.ordre().indexOf(this.codeSelectionne() || '');
        return i >= 0 && i < this.ordre().length - 1 ? this.ordre()[i + 1] : null;
    });
    aMoisPrecedent = computed(() => Object.keys(this.ligne()?.moisPrecedent || {}).length > 0);

    ngOnInit(): void {
        // Le rapport porte sur le mois écoulé : au 20 octobre, c'est septembre qu'on saisit.
        const d = new Date();
        d.setDate(1);
        d.setMonth(d.getMonth() - 1);
        this.annee.set(d.getFullYear());
        this.mois.set(d.getMonth() + 1);
        const an = new Date().getFullYear();
        this.anneeOptions = [an, an - 1, an - 2].map((v) => ({ label: String(v), value: v }));
        this.charger();
    }

    ngOnDestroy(): void {
        if (this.timerAutosave) clearTimeout(this.timerAutosave);
    }

    ngAfterViewChecked(): void {
        const el = this.grille?.nativeElement;
        if (!el) {
            if (this.defilementMax() !== 0) this.defilementMax.set(0);
            return;
        }
        const max = Math.max(0, el.scrollWidth - el.clientWidth);
        if (max !== this.defilementMax()) {
            // Hors du cycle de vérification, pour ne pas modifier la vue pendant qu'Angular la contrôle.
            setTimeout(() => {
                this.defilementMax.set(max);
                this.surDefilement();
            });
        }
    }

    @HostListener('window:resize')
    surRedimensionnement(): void {
        this.ngAfterViewChecked();
    }

    // ==================== Navigation de la grille ====================

    surDefilement(): void {
        const el = this.grille?.nativeElement;
        if (!el) return;
        this.defilementPos.set(Math.round(el.scrollLeft));
        // Quelles rubriques sont à l'écran : repère pour l'utilisateur, calculé sur les en-têtes.
        const entetes = Array.from(el.querySelectorAll<HTMLElement>('thead th')).slice(1, -1);
        const gauche = el.scrollLeft + (el.querySelector<HTMLElement>('thead th.sticky-col')?.offsetWidth || 0);
        const droite = el.scrollLeft + el.clientWidth;
        const visibles = entetes.filter((th) => th.offsetLeft + th.offsetWidth > gauche + 8 && th.offsetLeft < droite - 8);
        if (visibles.length) {
            const premier = entetes.indexOf(visibles[0]) + 1;
            const dernier = entetes.indexOf(visibles[visibles.length - 1]) + 1;
            this.colonnesVisibles.set(`Colonnes ${premier}–${dernier} sur ${entetes.length}`);
        }
    }

    /** Avance ou recule d'une largeur d'écran moins une colonne, pour garder un repère. */
    defiler(sens: number): void {
        const el = this.grille?.nativeElement;
        if (!el) return;
        const pas = Math.max(120, el.clientWidth - 160);
        this.allerA(el.scrollLeft + sens * pas);
    }

    allerA(position: number): void {
        const el = this.grille?.nativeElement;
        if (!el) return;
        el.scrollLeft = Math.min(this.defilementMax(), Math.max(0, position));
    }

    @HostListener('window:beforeunload', ['$event'])
    avertirAvantFermeture(e: BeforeUnloadEvent): void {
        if (this.modifie()) {
            e.preventDefault();
        }
    }

    // ==================== Chargement ====================

    charger(): void {
        this.loading.set(true);
        this.userService
            .getRapportMensuel$(this.annee(), this.mois())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    const d = (r.data?.rapport || null) as RapportMensuel | null;
                    this.data.set(d);
                    this.loading.set(false);
                    if (d && !d.peutSaisir && this.vue() === 'saisie') {
                        this.vue.set('cartes');
                    }
                    const code = this.codeSelectionne();
                    if (code && d?.lignes.some((l) => l.codAgencia === code)) {
                        this.chargerFiche();
                    } else if (d?.peutSaisir && d.lignes.length) {
                        // Le DA tombe directement sur son premier point de service non terminé.
                        const premier = d.lignes.find((l) => l.modifiable && !l.complet) || d.lignes[0];
                        this.selectionner(premier.codAgencia);
                    } else {
                        this.codeSelectionne.set(null);
                    }
                },
                error: (err) => {
                    this.loading.set(false);
                    this.data.set(null);
                    this.erreur('Indicateurs indisponibles', err);
                }
            });
    }

    changerPeriode(mois: number, annee: number): void {
        this.flushAutosave();
        this.mois.set(mois);
        this.annee.set(annee);
        this.codeSelectionne.set(null);
        this.charger();
    }

    selectionner(code: string): void {
        if (code === this.codeSelectionne()) return;
        this.flushAutosave();
        this.codeSelectionne.set(code);
        this.chargerFiche();
    }

    aller(code: string | null): void {
        if (code) this.selectionner(code);
    }

    ouvrirDepuisTableau(l: LigneRapport): void {
        if (this.data()?.peutSaisir) {
            this.selectionner(l.codAgencia);
            this.vue.set('saisie');
        } else {
            this.ouvrirFiche(l.codAgencia);
        }
    }

    /** Vue cartes : la fiche du point de service s'ouvre en fenêtre, sans quitter la page. */
    ouvrirFiche(code: string): void {
        this.selectionner(code);
        this.showFiche = true;
    }

    etatAgence(g: GroupeAgence): string {
        const a = g.agregat;
        if (a.nbConsolides === a.nbPointsService) return 'Consolidée';
        if (a.nbValides + a.nbConsolides === a.nbPointsService) return 'Validée';
        if (a.nbRenvoyes > 0) return a.nbRenvoyes + ' renvoyé(s)';
        if (a.nbSoumis > 0) return a.nbSoumis + ' à vérifier';
        return a.nbComplets === a.nbPointsService ? 'Complète, non soumise' : 'En saisie';
    }

    severiteAgence(g: GroupeAgence): 'secondary' | 'info' | 'success' | 'danger' | 'contrast' | 'warn' {
        const a = g.agregat;
        if (a.nbConsolides === a.nbPointsService) return 'contrast';
        if (a.nbValides + a.nbConsolides === a.nbPointsService) return 'success';
        if (a.nbRenvoyes > 0) return 'danger';
        if (a.nbSoumis > 0) return 'info';
        return a.nbComplets === a.nbPointsService ? 'warn' : 'secondary';
    }

    pct(n: number, total: number): number {
        return total ? Math.round((100 * n) / total) : 0;
    }

    /** Recopie la ligne sélectionnée dans les champs de saisie. */
    private chargerFiche(): void {
        const l = this.ligne();
        const d = this.data();
        this.texte = {};
        this.commentaires = {};
        this.commentaireGlobal = l?.commentaire || '';
        this.modifie.set(false);
        this.dernierEnregistrement.set(null);
        this.enEdition = null;
        if (!l || !d) return;
        for (const r of d.rubriques) {
            if (r.nature !== 'SAISIE') continue;
            const v = l.valeurs[r.code];
            this.texte[r.code] = this.afficher(v?.valeur ?? null, r.format);
            this.commentaires[r.code] = v?.commentaire || '';
        }
    }

    // ==================== Saisie ====================

    saisir(code: string, valeur: string): void {
        this.texte[code] = valeur ?? '';
        this.marquerModifie();
    }

    commenter(code: string, valeur: string): void {
        this.commentaires[code] = valeur ?? '';
        this.marquerModifie();
    }

    marquerModifie(): void {
        this.modifie.set(true);
        if (this.timerAutosave) clearTimeout(this.timerAutosave);
        this.timerAutosave = setTimeout(() => this.enregistrer(true), 1500);
    }

    /** Pendant la frappe on montre le nombre brut, sans séparateurs. */
    brut(r: RubriqueRapport): void {
        this.enEdition = r.code;
        const v = this.parser(this.texte[r.code], r.format);
        this.texte[r.code] = v == null ? '' : r.format === 'TAUX' ? String(Math.round(v * 10000) / 100) : String(Math.round(v));
    }

    formater(r: RubriqueRapport): void {
        this.enEdition = null;
        const v = this.parser(this.texte[r.code], r.format);
        this.texte[r.code] = this.afficher(v, r.format);
    }

    focusSuivant(index: number, sens: number): void {
        const rubriques = this.data()?.rubriques || [];
        for (let i = index + sens; i >= 0 && i < rubriques.length; i += sens) {
            if (rubriques[i].nature === 'SAISIE') {
                document.getElementById('inp-' + rubriques[i].code)?.focus();
                return;
            }
        }
    }

    /** Collage d'une suite de nombres (tabulations, points-virgules, retours) : remplit à partir de la rubrique courante. */
    coller(e: ClipboardEvent, index: number): void {
        const brut = e.clipboardData?.getData('text') || '';
        const morceaux = brut.split(/[\t\n;]+/).map((s) => s.trim()).filter((s) => s.length);
        if (morceaux.length < 2) return;
        e.preventDefault();
        this.remplirDepuis(index, morceaux);
    }

    appliquerCollage(): void {
        const morceaux = this.texteColle.split(/[\t\n;]+/).map((s) => s.trim()).filter((s) => s.length);
        if (!morceaux.length) return;
        const rubriques = this.data()?.rubriques || [];
        // Une ligne Excel complète inclut les taux calculés (colonnes G, L, O) : on les saute.
        const premiere = rubriques.findIndex((r) => r.nature === 'SAISIE');
        this.remplirDepuis(premiere, morceaux, morceaux.length >= rubriques.length);
        this.showColler = false;
        this.texteColle = '';
    }

    private remplirDepuis(index: number, morceaux: string[], ligneComplete = false): void {
        const rubriques = this.data()?.rubriques || [];
        let j = 0;
        for (let i = index; i < rubriques.length && j < morceaux.length; i++) {
            const r = rubriques[i];
            if (r.nature === 'CALCUL') {
                if (ligneComplete) j++; // la colonne calculée du fichier est ignorée
                continue;
            }
            const v = this.parser(morceaux[j++], r.format, true);
            this.texte[r.code] = this.afficher(v, r.format);
        }
        this.marquerModifie();
        this.messageService.add({ severity: 'info', summary: 'Valeurs collées', detail: 'Vérifiez chaque rubrique puis enregistrez', life: 4000 });
    }

    reprendreMoisPrecedent(): void {
        const l = this.ligne();
        const d = this.data();
        if (!l || !d) return;
        let n = 0;
        for (const r of d.rubriques) {
            if (r.nature !== 'SAISIE' || this.texte[r.code]) continue;
            const v = l.moisPrecedent[r.code];
            if (v != null) {
                this.texte[r.code] = this.afficher(v, r.format);
                n++;
            }
        }
        if (n) this.marquerModifie();
        this.messageService.add({ severity: 'info', summary: 'Mois précédent repris', detail: n + ' rubrique(s) remplie(s) : corrigez-les avec les chiffres du mois', life: 5000 });
    }

    private flushAutosave(): void {
        if (this.timerAutosave) {
            clearTimeout(this.timerAutosave);
            this.timerAutosave = null;
        }
        if (this.modifie()) this.enregistrer(true);
    }

    enregistrer(auto: boolean): void {
        const l = this.ligne();
        const d = this.data();
        if (!l || !d || !l.modifiable) return;
        if (this.timerAutosave) {
            clearTimeout(this.timerAutosave);
            this.timerAutosave = null;
        }
        const valeurs: Record<string, number | null> = {};
        const commentaires: Record<string, string | null> = {};
        for (const r of d.rubriques) {
            if (r.nature !== 'SAISIE') continue;
            valeurs[r.code] = this.parser(this.texte[r.code], r.format);
            if (r.controleSaf) commentaires[r.code] = this.commentaires[r.code]?.trim() || null;
        }
        const id = l.id;
        this.sauvegardeEnCours.set(true);
        this.modifie.set(false);
        this.userService
            .enregistrerBrouillonRapportMensuel$(id, { valeurs, commentaires, commentaire: this.commentaireGlobal?.trim() || null })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.sauvegardeEnCours.set(false);
                    this.dernierEnregistrement.set(new Date());
                    const ligne = r.data?.ligne as LigneRapport | undefined;
                    if (ligne) this.remplacerLigne(ligne);
                    if (!auto) this.messageService.add({ severity: 'success', summary: 'Brouillon enregistré', life: 2500 });
                },
                error: (err) => {
                    this.sauvegardeEnCours.set(false);
                    this.modifie.set(true);
                    this.erreur('Brouillon non enregistré', err);
                }
            });
    }

    /** Met à jour la ligne dans le mois sans recharger (et recalcule les totaux de l'agence côté affichage au prochain chargement). */
    private remplacerLigne(ligne: LigneRapport): void {
        const d = this.data();
        if (!d) return;
        const lignes = d.lignes.map((l) => (l.id === ligne.id ? { ...ligne, pointService: l.pointService, agence: l.agence, agenceId: l.agenceId, delegation: l.delegation, delegationId: l.delegationId } : l));
        const agences = d.agences.map((a) => {
            if (a.id !== ligne.agenceId) return a;
            const ls = lignes.filter((l) => l.agenceId === a.id);
            return {
                ...a,
                nbComplets: ls.filter((l) => l.complet).length,
                nbEcarts: ls.reduce((s, l) => s + l.nbEcarts, 0)
            };
        });
        const total = d.total ? { ...d.total, nbComplets: lignes.filter((l) => l.complet).length, nbEcarts: lignes.reduce((s, l) => s + l.nbEcarts, 0) } : null;
        this.data.set({ ...d, lignes, agences, total });
        // Les commentaires et dates reviennent du serveur ; la saisie en cours reste celle de l'écran.
    }

    // ==================== Circuit ====================

    nbSoumettables(g: GroupeAgence): number {
        return g.lignes.filter((l) => l.modifiable).length;
    }

    toutesCompletes(g: GroupeAgence): boolean {
        return g.lignes.filter((l) => l.modifiable).every((l) => l.complet);
    }

    peutSoumettreLigne(l: LigneRapport): boolean {
        return l.modifiable && l.complet && !this.modifie() && !this.sauvegardeEnCours();
    }

    soumettre(g: GroupeAgence): void {
        this.flushAutosave();
        const codes = g.lignes.filter((l) => l.modifiable).map((l) => l.codAgencia);
        this.action(this.userService.soumettreRapportMensuel$(this.annee(), this.mois(), codes), 'Rapports soumis');
    }

    soumettreLigne(l: LigneRapport): void {
        this.action(this.userService.soumettreRapportMensuel$(this.annee(), this.mois(), [l.codAgencia]), 'Rapport soumis');
    }

    idsSoumis(g: GroupeAgence): number[] {
        return g.lignes.filter((l) => l.etat === 'SOUMIS').map((l) => l.id);
    }

    idsRenvoyables(g: GroupeAgence): number[] {
        return g.lignes.filter((l) => l.etat === 'SOUMIS' || l.etat === 'VALIDE').map((l) => l.id);
    }

    valider(ids: number[]): void {
        this.action(this.userService.validerRapportMensuel$(ids), 'Rapports validés', () => (this.showFiche = false));
    }

    ouvrirRenvoi(ids: number[], libelle: string): void {
        this.renvoiIds = ids;
        this.renvoiLibelle = libelle;
        this.renvoiMotif = '';
        this.showRenvoi = true;
    }

    renvoyer(): void {
        this.action(this.userService.renvoyerRapportMensuel$(this.renvoiIds, this.renvoiMotif.trim()), 'Rapports renvoyés', () => {
            this.showRenvoi = false;
            this.showFiche = false;
        });
    }

    consolider(): void {
        this.action(this.userService.consoliderRapportMensuel$(this.annee(), this.mois()), 'Mois consolidé');
    }

    actualiserSaf(): void {
        this.safEnCours.set(true);
        this.userService
            .actualiserControleSafRapportMensuel$(this.annee(), this.mois())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.safEnCours.set(false);
                    this.messageService.add({ severity: 'success', summary: 'Contrôle SAF', detail: r.message || '', life: 4000 });
                    this.charger();
                },
                error: (err) => {
                    this.safEnCours.set(false);
                    this.erreur('SAF indisponible', err);
                }
            });
    }

    private action(flux: Observable<IResponse>, summary: string, apres?: () => void): void {
        this.actionEnCours.set(true);
        flux.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r: IResponse) => {
                this.actionEnCours.set(false);
                this.messageService.add({ severity: 'success', summary, detail: r.message || '', life: 5000 });
                apres?.();
                this.charger();
            },
            error: (err) => {
                this.actionEnCours.set(false);
                this.erreur('Action refusée', err);
            }
        });
    }

    exporter(): void {
        this.flushAutosave();
        this.telecharger(this.userService.exportRapportMensuel$(this.annee(), this.mois()), 'indicateurs_mensuels.xlsx');
    }

    // ==================== Calculs d'affichage ====================

    /** Valeur calculée à partir de ce qui est tapé, avant même l'enregistrement. */
    calculLocal(r: RubriqueRapport): number | null {
        const l = this.ligne();
        if (!r.formule || !l) return null;
        const [num, den] = r.formule.split('/').map((s) => s.trim());
        const a = this.valeurLocale(num);
        const b = this.valeurLocale(den);
        if (a == null || b == null || b === 0) return null;
        return a / b;
    }

    ecartLocal(r: RubriqueRapport): { pct: number | null; alerte: boolean } | null {
        const l = this.ligne();
        const d = this.data();
        if (!l || !d) return null;
        const saf = l.valeurs[r.code]?.valeurSaf;
        const v = this.valeurLocale(r.code);
        if (saf == null || v == null) return null;
        const diff = Math.abs(v - saf);
        const pct = saf !== 0 ? (v - saf) / Math.abs(saf) : null;
        const depassePct = saf === 0 ? diff > 0 : diff > (Math.abs(saf) * d.seuilEcartPct) / 100;
        return { pct, alerte: diff > d.seuilEcartMontant && depassePct };
    }

    private valeurLocale(code: string): number | null {
        const l = this.ligne();
        const r = this.data()?.rubriques.find((x) => x.code === code);
        if (!l || !r) return null;
        if (l.modifiable) return this.parser(this.texte[code], r.format);
        return l.valeurs[code]?.valeur ?? null;
    }

    formuleLisible(r: RubriqueRapport): string {
        const rubriques = this.data()?.rubriques || [];
        const nom = (c: string) => rubriques.find((x) => x.code === c.trim())?.libelle || c;
        const [a, b] = (r.formule || '').split('/');
        return a && b ? nom(a) + ' ÷ ' + nom(b) : '';
    }

    /** "97" ou "0,97" → 0.97 pour un taux ; "3 310 624 915" → nombre ; vide → null. */
    private parser(texte: string | undefined, format: string, tolerant = false): number | null {
        if (texte == null) return null;
        let t = String(texte).replace(/[\s ]/g, '').replace('%', '').replace(',', '.');
        if (!t) return null;
        if (tolerant) t = t.replace(/[^0-9.\-]/g, '');
        const v = Number(t);
        if (!isFinite(v)) return null;
        if (format === 'TAUX') return v > 1.5 ? v / 100 : v;
        return format === 'NOMBRE' ? Math.round(v) : v;
    }

    private afficher(v: number | null, format: string): string {
        if (v == null) return '';
        if (format === 'TAUX') return String(Math.round(v * 10000) / 100);
        return Math.round(v).toLocaleString('fr-FR').replace(/ /g, ' ');
    }

    fmt(v: number | null | undefined, format: string): string {
        if (v == null) return '';
        if (format === 'TAUX') return (v * 100).toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' %';
        return Math.round(v).toLocaleString('fr-FR').replace(/ /g, ' ');
    }

    libelleEtat(e: EtatRapport): string {
        return { BROUILLON: 'Brouillon', SOUMIS: 'Soumis', VALIDE: 'Validé', RENVOYE: 'Renvoyé', CONSOLIDE: 'Consolidé' }[e] || e;
    }

    severiteEtat(e: EtatRapport): 'secondary' | 'info' | 'success' | 'danger' | 'contrast' {
        return ({ BROUILLON: 'secondary', SOUMIS: 'info', VALIDE: 'success', RENVOYE: 'danger', CONSOLIDE: 'contrast' } as const)[e] || 'secondary';
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
                this.messageService.add({ severity: 'error', summary: 'Export', detail: "Échec de l'export Excel", life: 6000 });
            }
        });
    }

    private erreur(summary: string, err: unknown): void {
        const detail = typeof err === 'string' ? err : (err as any)?.message || 'Erreur inattendue';
        this.messageService.add({ severity: 'error', summary, detail, life: 8000 });
    }
}
