import { DonneesSafComponent } from './donnees-saf.component';
import { ClasseScore, FicheAgent, ScoreAgent, Scores, SyntheseScore } from '@/interface/portefeuille-score';
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
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { Observable } from 'rxjs';

/**
 * Appréciation des agents de crédit à partir de leur portefeuille (V164, lot 1).
 * DE, DG, SUPER_ADMIN : tout le réseau ; DR : sa délégation. Lecture du dernier calcul nocturne.
 */
@Component({
    selector: 'app-portefeuille-scores',
    standalone: true,
    imports: [CommonModule, DonneesSafComponent, FormsModule, TableModule, ButtonModule, SelectModule, InputTextModule, TagModule, DialogModule, ToastModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>
        <div class="card">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div>
                    <h2 class="text-xl font-semibold m-0">Appréciation des agents de crédit</h2> <app-donnees-saf></app-donnees-saf>
                    <div class="text-sm text-gray-500">
                        Score sur 100 à partir du portefeuille affecté à chaque agent (crédits en cours lus dans SAF).
                        <span *ngIf="data()?.dateCalcul; else jamais">Calculé le {{ data()!.dateCalcul | date: 'dd/MM/yyyy' }}.</span>
                        <ng-template #jamais><span class="text-orange-600">Aucun calcul encore effectué.</span></ng-template>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button pButton icon="pi pi-question-circle" label="Comment lire ces scores ?" class="p-button-text" (click)="showAide = true"></button>
                    <button pButton icon="pi pi-refresh" class="p-button-text" (click)="charger()" [loading]="loading()" pTooltip="Recharger"></button>
                    <button *ngIf="data()?.peutRecalculer" pButton icon="pi pi-calculator" label="Recalculer maintenant" class="p-button-outlined" [loading]="recalcul()" (click)="recalculer()" pTooltip="Relit SAF pour tout le réseau (une à deux minutes) ; le calcul automatique tourne chaque nuit à 03:30"></button>
                    <button pButton icon="pi pi-file-excel" label="Exporter Excel" class="p-button-success p-button-outlined" [loading]="exportEnCours()" [disabled]="!data()?.agents?.length" (click)="exporter()"></button>
                </div>
            </div>

            <div *ngIf="erreurRecalcul()" class="border border-orange-400 bg-orange-50 text-orange-800 rounded p-3 mb-4 flex items-start gap-2">
                <i class="pi pi-exclamation-triangle mt-1"></i>
                <div>{{ erreurRecalcul() }}</div>
            </div>

            <!-- Réseau / périmètre -->
            <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4" *ngIf="data()?.reseau as r">
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Agents notés</div>
                    <div class="text-xl font-bold">{{ r.nbNotes }} / {{ r.nbAgents }}</div>
                    <div class="text-xs text-gray-500">{{ r.nbNonNotes }} non noté(s)</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Répartition</div>
                    <div class="text-lg font-bold flex gap-2 flex-wrap">
                        <span class="classe A">A {{ r.nbA }}</span><span class="classe B">B {{ r.nbB }}</span>
                        <span class="classe C">C {{ r.nbC }}</span><span class="classe D">D {{ r.nbD }}</span>
                    </div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Score moyen</div>
                    <div class="text-xl font-bold">{{ r.scoreMoyen ?? '—' }}</div>
                    <div class="text-xs text-gray-500">{{ r.delegation }}</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">PAR 30 moyen</div>
                    <div class="text-xl font-bold">{{ r.par30Moyen != null ? (r.par30Moyen | percent: '1.1-1') : '—' }}</div>
                    <div class="text-xs text-gray-500">des portefeuilles notés</div>
                </div>
                <div class="border rounded p-3" *ngIf="data()?.bornes as b">
                    <div class="text-xs text-gray-500 uppercase">Grille</div>
                    <div class="text-xs mt-1">PAR 30 (30) · régularité (20) · part en retard (15) · poids du retard (15) · charge (10)</div>
                    <div class="text-xs text-gray-500">non noté : &lt; {{ b.minCredits }} crédits ou &lt; {{ b.minJoursAffectation }} j d'affectation</div>
                </div>
            </div>

            <!-- Par délégation -->
            <div class="mb-4" *ngIf="(data()?.delegations?.length || 0) > 1">
                <p-table [value]="data()!.delegations" styleClass="p-datatable-sm" [rowHover]="true" selectionMode="single" (onRowSelect)="delegationFiltre.set($event.data.delegationId ?? null)">
                    <ng-template pTemplate="header">
                        <tr><th>Délégation</th><th class="text-right">Agents</th><th class="text-right">Notés</th><th class="text-right">A</th><th class="text-right">B</th><th class="text-right">C</th><th class="text-right">D</th><th class="text-right">Score moyen</th><th class="text-right">PAR 30 moyen</th></tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-d>
                        <tr [pSelectableRow]="d" class="cursor-pointer">
                            <td class="font-semibold">{{ d.delegation }}</td>
                            <td class="text-right">{{ d.nbAgents }}</td><td class="text-right">{{ d.nbNotes }}</td>
                            <td class="text-right">{{ d.nbA }}</td><td class="text-right">{{ d.nbB }}</td><td class="text-right">{{ d.nbC }}</td>
                            <td class="text-right" [class.text-red-600]="d.nbD > 0">{{ d.nbD }}</td>
                            <td class="text-right">{{ d.scoreMoyen ?? '—' }}</td>
                            <td class="text-right">{{ d.par30Moyen != null ? (d.par30Moyen | percent: '1.1-1') : '—' }}</td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>

            <!-- Filtres -->
            <div class="flex flex-wrap gap-3 items-center mb-3">
                <p-select *ngIf="delegations().length > 1" [options]="delegations()" [ngModel]="delegationFiltre()" (ngModelChange)="delegationFiltre.set($event); agenceFiltre.set(null); psFiltre.set(null)" optionLabel="label" optionValue="value" placeholder="Délégation" [showClear]="true" styleClass="w-56" appendTo="body"></p-select>
                <p-select *ngIf="agences().length > 1" [options]="agences()" [ngModel]="agenceFiltre()" (ngModelChange)="agenceFiltre.set($event); psFiltre.set(null)" optionLabel="label" optionValue="value" placeholder="Agence" [showClear]="true" styleClass="w-56" appendTo="body"></p-select>
                <p-select *ngIf="pointsService().length > 1" [options]="pointsService()" [ngModel]="psFiltre()" (ngModelChange)="psFiltre.set($event)" optionLabel="label" optionValue="value" placeholder="Point de service" [showClear]="true" styleClass="w-64" appendTo="body"></p-select>
                <p-select [options]="classeOptions" [ngModel]="classeFiltre()" (ngModelChange)="classeFiltre.set($event)" optionLabel="label" optionValue="value" placeholder="Classe" [showClear]="true" styleClass="w-44" appendTo="body"></p-select>
                <input pInputText type="text" [ngModel]="recherche()" (ngModelChange)="recherche.set($event)" placeholder="Agent, point de service…" class="w-64" />
                <span class="text-sm text-gray-500 ml-auto">{{ agentsFiltres().length }} agent(s)</span>
            </div>

            <!-- Agents -->
            <p-table [value]="agentsFiltres()" [loading]="loading()" styleClass="p-datatable-sm" [rowHover]="true" selectionMode="single" (onRowSelect)="ouvrirFiche($event.data)" [paginator]="agentsFiltres().length > 40" [rows]="40" sortMode="single" responsiveLayout="scroll">
                <ng-template pTemplate="header">
                    <tr>
                        <th pSortableColumn="agentNom">Agent <p-sortIcon field="agentNom"></p-sortIcon></th>
                        <th pSortableColumn="pointVente">Point de service <p-sortIcon field="pointVente"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="nbCredits">Crédits <p-sortIcon field="nbCredits"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="encours">Encours (GNF) <p-sortIcon field="encours"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="par30">PAR 30 <p-sortIcon field="par30"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="nbEnRetard">En retard <p-sortIcon field="nbEnRetard"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="montantRetard">Montant en retard <p-sortIcon field="montantRetard"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="score">Score <p-sortIcon field="score"></p-sortIcon></th>
                        <th>Classe</th>
                        <th>Tendance</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-a>
                    <tr [pSelectableRow]="a" class="cursor-pointer">
                        <td class="font-semibold">{{ a.agentNom }} <p-tag *ngIf="a.agentActif === false" severity="warn" value="désactivé"></p-tag></td>
                        <td>{{ a.codAgencia }} {{ a.pointVente }}<div class="text-xs text-gray-500">{{ a.agence }} · {{ a.delegation }}</div></td>
                        <td class="text-right">{{ a.nbCredits }}<span *ngIf="a.nbHerites" class="text-xs text-gray-500" pTooltip="Crédits déjà en retard à l'affectation, hors calcul pendant la franchise"> (dont {{ a.nbHerites }} hérités)</span></td>
                        <td class="text-right">{{ a.encours | number: '1.0-0' }}</td>
                        <td class="text-right">{{ a.par30 != null ? (a.par30 | percent: '1.1-1') : '—' }}</td>
                        <td class="text-right" [class.text-red-600]="a.nbEnRetard > 0">{{ a.nbEnRetard }}</td>
                        <td class="text-right" [class.text-red-600]="a.montantRetard > 0">{{ a.montantRetard | number: '1.0-0' }}</td>
                        <td class="text-right font-bold">{{ a.score ?? '—' }}</td>
                        <td><span class="classe" [ngClass]="a.classe">{{ libelleClasse(a.classe) }}</span><div *ngIf="a.motifNonNote" class="text-xs text-gray-500">{{ a.motifNonNote }}</div></td>
                        <td class="text-gray-500 text-sm">{{ a.ptsTendance != null ? a.ptsTendance : '— (dès 3 mois)' }}</td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr><td colspan="10" class="text-center text-gray-500 py-6">Aucun agent noté sur ce périmètre. Les agents apparaissent dès qu'ils portent des crédits affectés et que le calcul nocturne a tourné.</td></tr>
                </ng-template>
            </p-table>
        </div>

        <!-- Comment lire ces scores : la grille, les classes et le PAR 30 -->
        <p-dialog header="Comment lire ces scores" [(visible)]="showAide" [modal]="true" [style]="{ width: '920px', maxWidth: '96vw' }" [dismissableMask]="true">
            <div class="text-sm leading-relaxed">
                <p class="mb-4">
                    Chaque nuit, l'outil relit dans SAF les crédits <b>en cours</b> confiés à chaque agent et lui donne une note sur 100.
                    Aucune saisie n'est demandée : tout vient des encours et des échéances du système bancaire.
                    Le score résume la <b>santé du portefeuille</b> confié à l'agent — il ne mesure ni son effort ni son contexte, et ne décide rien à la place de la hiérarchie.
                </p>

                <h3 class="font-bold text-base mb-2">Les cinq critères</h3>
                <div class="overflow-x-auto mb-4">
                    <table class="w-full border-collapse text-sm">
                        <thead>
                            <tr class="bg-gray-50 border-b-2 border-gray-200 text-left">
                                <th class="py-2 px-3">Critère</th><th class="py-2 px-3">Ce qu'il mesure</th>
                                <th class="py-2 px-3 text-right">Tous les points</th><th class="py-2 px-3 text-right">Zéro point</th><th class="py-2 px-3 text-right">Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-b border-gray-100"><td class="py-2 px-3 font-semibold">PAR 30</td><td class="py-2 px-3">encours des crédits en retard de plus de 30 jours, rapporté à l'encours total</td><td class="py-2 px-3 text-right">0 %</td><td class="py-2 px-3 text-right">15 %</td><td class="py-2 px-3 text-right font-bold">30</td></tr>
                            <tr class="border-b border-gray-100"><td class="py-2 px-3 font-semibold">Régularité</td><td class="py-2 px-3">échéances payées sur échéances échues, tous crédits confondus</td><td class="py-2 px-3 text-right">100 %</td><td class="py-2 px-3 text-right">70 %</td><td class="py-2 px-3 text-right font-bold">20</td></tr>
                            <tr class="border-b border-gray-100"><td class="py-2 px-3 font-semibold">Crédits en retard</td><td class="py-2 px-3">part des crédits portant au moins une échéance impayée</td><td class="py-2 px-3 text-right">0 %</td><td class="py-2 px-3 text-right">30 %</td><td class="py-2 px-3 text-right font-bold">15</td></tr>
                            <tr class="border-b border-gray-100"><td class="py-2 px-3 font-semibold">Poids du retard</td><td class="py-2 px-3">capital et intérêts impayés, rapportés à l'encours</td><td class="py-2 px-3 text-right">0 %</td><td class="py-2 px-3 text-right">10 %</td><td class="py-2 px-3 text-right font-bold">15</td></tr>
                            <tr class="border-b border-gray-100"><td class="py-2 px-3 font-semibold">Charge</td><td class="py-2 px-3">nombre de crédits portés, face à la médiane des agents du réseau</td><td class="py-2 px-3 text-right">médiane atteinte</td><td class="py-2 px-3 text-right">aucun crédit</td><td class="py-2 px-3 text-right font-bold">10</td></tr>
                            <tr><td class="py-2 px-3 font-semibold text-gray-500">Tendance</td><td class="py-2 px-3 text-gray-500">variation du PAR 30 sur trois mois — entrera dans le barème au quatrième calcul mensuel</td><td class="py-2 px-3 text-right text-gray-500">en baisse</td><td class="py-2 px-3 text-right text-gray-500">en hausse</td><td class="py-2 px-3 text-right font-bold text-gray-500">10</td></tr>
                        </tbody>
                    </table>
                </div>
                <p class="mb-4">
                    Entre les deux bornes, les points se donnent en proportion : à mi-chemin, la moitié des points.
                    Tant que la tendance n'a pas trois mois d'historique, le score se calcule sur 90 points et se ramène à 100.
                </p>

                <h3 class="font-bold text-base mb-2">Les classes</h3>
                <div class="flex flex-wrap gap-2 mb-4">
                    <span class="border rounded-lg px-3 py-2"><span class="classe A">A</span> 80 à 100 — portefeuille sain</span>
                    <span class="border rounded-lg px-3 py-2"><span class="classe B">B</span> 65 à 79 — bon, quelques retards</span>
                    <span class="border rounded-lg px-3 py-2"><span class="classe C">C</span> 50 à 64 — à surveiller</span>
                    <span class="border rounded-lg px-3 py-2"><span class="classe D">D</span> moins de 50 — alerte</span>
                    <span class="border rounded-lg px-3 py-2"><span class="classe NN">non noté</span> moins de 10 crédits, ou affecté depuis moins de 90 jours</span>
                </div>

                <h3 class="font-bold text-base mb-2">Le PAR 30, le critère qui pèse le plus</h3>
                <p class="mb-3">
                    Il ne mesure pas ce que les clients doivent aujourd'hui, mais ce que la banque <b>risque de perdre</b>.
                    Prenons un client qui a emprunté 15 000 000 et à qui il reste 11 800 000 à rembourser.
                    Il ne paie plus depuis 64 jours ; les échéances sautées font 4 310 000.
                    S'il ne revient jamais, la banque ne perd pas 4 310 000 mais <b>11 800 000</b> : un crédit qui a décroché,
                    c'est son encours entier qui est en danger.
                </p>
                <p class="mb-3">
                    D'où la règle, la même dans toute la microfinance : un retard de <b>moins de 30 jours</b> ne compte pas
                    (le client a eu un contretemps, il paie la semaine suivante) ; à partir de <b>30 jours</b>, on compte
                    <b>tout l'encours</b> du crédit. Les jours de retard se déduisent de la date de la plus ancienne échéance
                    impayée dans SAF.
                </p>
                <div class="overflow-x-auto mb-3">
                    <table class="w-full border-collapse text-sm">
                        <thead>
                            <tr class="bg-gray-50 border-b-2 border-gray-200 text-left">
                                <th class="py-2 px-3">Exemple : un portefeuille de 26 crédits</th><th class="py-2 px-3 text-right">Retard</th><th class="py-2 px-3 text-right">Encours</th><th class="py-2 px-3">Compté dans le PAR 30 ?</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-b border-gray-100"><td class="py-2 px-3">Crédit 548 219</td><td class="py-2 px-3 text-right text-red-600 font-semibold">64 jours</td><td class="py-2 px-3 text-right">11 800 000</td><td class="py-2 px-3"><b class="text-red-600">oui</b>, tout l'encours</td></tr>
                            <tr class="border-b border-gray-100"><td class="py-2 px-3">Crédit 551 744</td><td class="py-2 px-3 text-right text-red-600 font-semibold">38 jours</td><td class="py-2 px-3 text-right">7 300 000</td><td class="py-2 px-3"><b class="text-red-600">oui</b>, tout l'encours</td></tr>
                            <tr class="border-b border-gray-100"><td class="py-2 px-3">Crédit 553 902</td><td class="py-2 px-3 text-right">17 jours</td><td class="py-2 px-3 text-right">6 100 000</td><td class="py-2 px-3">non — moins de 30 jours</td></tr>
                            <tr class="border-b border-gray-100"><td class="py-2 px-3">23 autres crédits</td><td class="py-2 px-3 text-right">à jour</td><td class="py-2 px-3 text-right">293 200 000</td><td class="py-2 px-3">non</td></tr>
                            <tr class="bg-gray-50"><td class="py-2 px-3 font-bold">Portefeuille</td><td class="py-2 px-3"></td><td class="py-2 px-3 text-right font-bold">318 400 000</td><td class="py-2 px-3"><b class="text-red-600">19 100 000 en danger</b></td></tr>
                        </tbody>
                    </table>
                </div>
                <p class="mb-4">
                    19 100 000 sur 318 400 000 font <b>6 %</b> : sur 100 francs en portefeuille, 6 francs sont dans des crédits
                    qui ont décroché. Le barème est linéaire — 15 % vaut 0 point, 0 % en vaut 30, donc chaque point de PAR 30
                    coûte 2 points : à 6 %, l'agent garde <b>18 points sur 30</b>.
                </p>

                <h3 class="font-bold text-base mb-2">Deux chiffres à ne pas confondre</h3>
                <div class="overflow-x-auto mb-4">
                    <table class="w-full border-collapse text-sm">
                        <thead><tr class="bg-gray-50 border-b-2 border-gray-200 text-left"><th class="py-2 px-3">Colonne</th><th class="py-2 px-3">Ce qu'elle dit</th><th class="py-2 px-3">À quoi elle sert</th></tr></thead>
                        <tbody>
                            <tr class="border-b border-gray-100"><td class="py-2 px-3 font-semibold">Montant en retard</td><td class="py-2 px-3">ce que les clients doivent maintenant : capital et intérêts échus impayés</td><td class="py-2 px-3">la somme à aller encaisser</td></tr>
                            <tr><td class="py-2 px-3 font-semibold">PAR 30</td><td class="py-2 px-3">l'encours entier des crédits qui ont décroché</td><td class="py-2 px-3">juger la santé du portefeuille</td></tr>
                        </tbody>
                    </table>
                </div>

                <h3 class="font-bold text-base mb-2">Trois règles de justice</h3>
                <ul class="list-disc pl-5 mb-1">
                    <li class="mb-1"><b>Retard hérité</b> : un crédit déjà en retard le jour où il est confié à l'agent ne compte pas contre lui pendant 90 jours — on ne lui reproche pas le retard qu'on lui donne à assainir. Il reste affiché, avec la mention « dont N hérités ».</li>
                    <li class="mb-1"><b>Non noté</b> : sous 10 crédits en cours, ou avant 90 jours d'affectation, aucun score n'est donné. Noter un agent sur six crédits ou trois semaines n'aurait pas de sens.</li>
                    <li><b>Mêmes bornes pour tous</b> : elles sont celles du réseau, pas du point de service. Le contexte se lit à côté — score moyen du point de service sur la fiche, et tendance dès trois mois.</li>
                </ul>
            </div>
            <ng-template pTemplate="footer"><button pButton label="Fermer" class="p-button-text" (click)="showAide = false"></button></ng-template>
        </p-dialog>

        <!-- Fiche agent -->
        <p-dialog [header]="fiche()?.score?.agentNom || 'Fiche agent'" [(visible)]="showFiche" [modal]="true" [style]="{ width: '960px', maxWidth: '96vw' }" [dismissableMask]="true">
            <div *ngIf="loadingFiche()" class="text-gray-500 py-4">Chargement…</div>
            <ng-container *ngIf="fiche() as f">
                <div class="flex flex-wrap gap-3 items-center mb-3">
                    <span class="classe text-lg" [ngClass]="f.score.classe">{{ libelleClasse(f.score.classe) }}</span>
                    <span class="text-2xl font-bold">{{ f.score.score ?? '—' }}<span class="text-sm text-gray-500"> / 100</span></span>
                    <span class="text-sm text-gray-500">{{ f.score.codAgencia }} {{ f.score.pointVente }} · {{ f.score.agence }} · calculé le {{ f.score.dateCalcul | date: 'dd/MM/yyyy' }}</span>
                    <span class="text-sm ml-auto" *ngIf="f.scoreMoyenPointService != null">Score moyen du point de service : <b>{{ f.scoreMoyenPointService }}</b></span>
                </div>
                <div *ngIf="f.score.motifNonNote" class="text-orange-600 mb-3">Non noté : {{ f.score.motifNonNote }}.</div>
                <p-table [value]="criteres(f.score)" styleClass="p-datatable-sm mb-4">
                    <ng-template pTemplate="header"><tr><th>Critère</th><th>Mesure</th><th class="text-right">Valeur</th><th class="text-right">Points</th></tr></ng-template>
                    <ng-template pTemplate="body" let-c>
                        <tr><td class="font-semibold">{{ c.nom }}</td><td class="text-sm text-gray-500">{{ c.mesure }}</td><td class="text-right">{{ c.valeur }}</td><td class="text-right">{{ c.points }}</td></tr>
                    </ng-template>
                </p-table>
                <div class="text-sm text-gray-500 mb-4">
                    {{ f.score.nbCredits }} crédit(s) en cours, encours {{ f.score.encours | number: '1.0-0' }} GNF, affecté depuis le {{ f.score.datePremiereAffectation | date: 'dd/MM/yyyy' }}.
                    <span *ngIf="f.score.nbHerites">{{ f.score.nbHerites }} crédit(s) déjà en retard à l'affectation, hors calcul pendant {{ data()?.bornes?.joursFranchiseHerite }} jours.</span>
                    <span *ngIf="f.score.medianeReseau">Médiane réseau : {{ f.score.medianeReseau }} crédits par agent.</span>
                </div>
                <h3 class="text-base font-semibold mb-2">Crédits en retard ({{ f.creditsEnRetard.length }})</h3>
                <p-table [value]="f.creditsEnRetard" styleClass="p-datatable-sm" [paginator]="f.creditsEnRetard.length > 15" [rows]="15">
                    <ng-template pTemplate="header"><tr><th>N° crédit</th><th>Client</th><th>Téléphone</th><th>Type</th><th class="text-right">Encours</th><th class="text-right">Jours</th><th>Depuis le</th><th class="text-right">Montant en retard</th><th></th></tr></ng-template>
                    <ng-template pTemplate="body" let-c>
                        <tr>
                            <td>{{ c.numCredito }}</td><td>{{ c.nomCliente }}<div class="text-xs text-gray-500">{{ c.codCliente }}</div></td><td>{{ c.telephone || '—' }}</td><td>{{ c.typeCredit }}</td>
                            <td class="text-right">{{ c.encours | number: '1.0-0' }}</td>
                            <td class="text-right" [class.text-red-600]="c.joursRetard > 30">{{ c.joursRetard }}</td>
                            <td>{{ c.datePremiereImpayee | date: 'dd/MM/yyyy' }}</td>
                            <td class="text-right">{{ c.montantRetard | number: '1.0-0' }}</td>
                            <td><p-tag *ngIf="c.herite" severity="secondary" value="hérité" pTooltip="Déjà en retard à l'affectation : hors calcul"></p-tag></td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage"><tr><td colspan="9" class="text-center text-gray-500 py-3">Aucun crédit en retard.</td></tr></ng-template>
                </p-table>
                <div *ngIf="f.historique.length" class="mt-4">
                    <h3 class="text-base font-semibold mb-2">Scores précédents</h3>
                    <div class="flex flex-wrap gap-2">
                        <span *ngFor="let h of f.historique.slice(0, 12)" class="text-xs border rounded px-2 py-1">{{ h.dateCalcul | date: 'dd/MM' }} : <b>{{ h.score ?? 'NN' }}</b></span>
                    </div>
                </div>
            </ng-container>
            <ng-template pTemplate="footer"><button pButton label="Fermer" class="p-button-text" (click)="showFiche = false"></button></ng-template>
        </p-dialog>
    `,
    styles: [
        `
            .classe { display: inline-block; font-weight: 700; font-size: 0.8rem; padding: 2px 9px; border-radius: 999px; }
            .classe.A { background: #e6f0ea; color: #1e5e3a; }
            .classe.B { background: #e4ecf5; color: #2a4f7c; }
            .classe.C { background: #fbf1dc; color: #9a6200; }
            .classe.D { background: #fae4e2; color: #a8322a; }
            .classe.NN { background: #f1f3f1; color: #54605a; border: 1px solid #d9e0db; }
        `
    ]
})
export class PortefeuilleScoresComponent implements OnInit {
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

    data = signal<Scores | null>(null);
    loading = signal(false);
    recalcul = signal(false);
    exportEnCours = signal(false);
    erreurRecalcul = signal<string | null>(null);
    fiche = signal<FicheAgent | null>(null);
    loadingFiche = signal(false);
    showFiche = false;
    /** Boîte « Comment lire ces scores » : la grille, les classes et le PAR 30 expliqués. */
    showAide = false;

    delegationFiltre = signal<number | null>(null);
    agenceFiltre = signal<number | null>(null);
    psFiltre = signal<string | null>(null);
    classeFiltre = signal<ClasseScore | null>(null);
    recherche = signal('');

    classeOptions = [
        { label: 'A — sain', value: 'A' },
        { label: 'B — bon', value: 'B' },
        { label: 'C — à surveiller', value: 'C' },
        { label: 'D — alerte', value: 'D' },
        { label: 'Non noté', value: 'NN' }
    ];

    delegations = computed(() => this.options(this.data()?.agents || [], (a) => a.delegationId, (a) => a.delegation));
    agences = computed(() =>
        this.options(
            (this.data()?.agents || []).filter((a) => this.delegationFiltre() == null || a.delegationId === this.delegationFiltre()),
            (a) => a.agenceId,
            (a) => a.agence
        )
    );
    pointsService = computed(() =>
        this.options(
            (this.data()?.agents || []).filter((a) => (this.delegationFiltre() == null || a.delegationId === this.delegationFiltre()) && (this.agenceFiltre() == null || a.agenceId === this.agenceFiltre())),
            (a) => a.codAgencia,
            (a) => `${a.codAgencia} ${a.pointVente || ''}`
        )
    );

    agentsFiltres = computed(() => {
        const q = this.recherche().trim().toLowerCase();
        return (this.data()?.agents || []).filter(
            (a) =>
                (this.delegationFiltre() == null || a.delegationId === this.delegationFiltre()) &&
                (this.agenceFiltre() == null || a.agenceId === this.agenceFiltre()) &&
                (this.psFiltre() == null || a.codAgencia === this.psFiltre()) &&
                (this.classeFiltre() == null || a.classe === this.classeFiltre()) &&
                (!q || `${a.agentNom} ${a.codAgencia} ${a.pointVente || ''} ${a.agence || ''}`.toLowerCase().includes(q))
        );
    });

    ngOnInit(): void {
        this.charger();
    }

    charger(): void {
        this.loading.set(true);
        this.userService
            .getScoresAgents$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.data.set((r.data?.scores || null) as Scores | null);
                    this.loading.set(false);
                },
                error: (err) => {
                    this.loading.set(false);
                    this.erreur('Scores indisponibles', err);
                }
            });
    }

    recalculer(): void {
        this.recalcul.set(true);
        this.erreurRecalcul.set(null);
        this.userService
            .recalculerScoresAgents$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.recalcul.set(false);
                    this.messageService.add({ severity: 'success', summary: 'Scores recalculés', detail: r.message || '' });
                    this.charger();
                },
                error: (err) => {
                    this.recalcul.set(false);
                    const detail = typeof err === 'string' ? err : (err as any)?.message || 'Erreur inattendue';
                    this.erreurRecalcul.set(detail);
                    this.messageService.add({ severity: 'error', summary: 'Recalcul impossible', detail, life: 10000 });
                }
            });
    }

    ouvrirFiche(a: ScoreAgent): void {
        this.fiche.set(null);
        this.showFiche = true;
        this.loadingFiche.set(true);
        this.userService
            .getFicheScoreAgent$(a.agentUserId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.fiche.set((r.data?.fiche || null) as FicheAgent | null);
                    this.loadingFiche.set(false);
                },
                error: (err) => {
                    this.loadingFiche.set(false);
                    this.erreur('Fiche indisponible', err);
                }
            });
    }

    exporter(): void {
        this.telecharger(this.userService.exportScoresAgents$(), 'appreciation_agents.xlsx');
    }

    libelleClasse(c: ClasseScore): string {
        return c === 'NN' ? 'non noté' : c;
    }

    criteres(s: ScoreAgent): { nom: string; mesure: string; valeur: string; points: string }[] {
        const b = this.data()?.bornes;
        const pct = (v?: number) => (v == null ? '—' : `${(v * 100).toFixed(1)} %`);
        const pts = (p?: number, max?: number) => (p == null ? '—' : `${p.toFixed(1)} / ${max}`);
        return [
            { nom: 'Qualité du portefeuille', mesure: `PAR 30 — 0 % → 30 pts, ≥ ${((b?.par30Mauvais ?? 0.15) * 100).toFixed(0)} % → 0`, valeur: pct(s.par30), points: pts(s.ptsPar30, 30) },
            { nom: 'Régularité des remboursements', mesure: `échéances payées / échues — 100 % → 20 pts, ≤ ${((b?.regulariteMauvais ?? 0.7) * 100).toFixed(0)} % → 0`, valeur: pct(s.regularite), points: pts(s.ptsRegularite, 20) },
            { nom: 'Crédits en retard', mesure: `part des crédits en retard — 0 % → 15 pts, ≥ ${((b?.tauxRetardMauvais ?? 0.3) * 100).toFixed(0)} % → 0`, valeur: pct(s.tauxRetard), points: pts(s.ptsTauxRetard, 15) },
            { nom: 'Poids du retard', mesure: `impayés / encours — 0 % → 15 pts, ≥ ${((b?.poidsRetardMauvais ?? 0.1) * 100).toFixed(0)} % → 0`, valeur: pct(s.poidsRetard), points: pts(s.ptsPoidsRetard, 15) },
            { nom: 'Charge de portefeuille', mesure: `crédits / médiane réseau (${s.medianeReseau ?? '—'}) — ≥ médiane → 10 pts`, valeur: pct(s.charge), points: pts(s.ptsCharge, 10) },
            { nom: 'Tendance à trois mois', mesure: 'variation du PAR 30 — active dès trois mois d\'historique', valeur: s.tendance != null ? pct(s.tendance) : '—', points: s.ptsTendance != null ? pts(s.ptsTendance, 10) : 'non encore' }
        ];
    }

    private options<T>(agents: ScoreAgent[], id: (a: ScoreAgent) => T | undefined, label: (a: ScoreAgent) => string | undefined): { label: string; value: T }[] {
        const m = new Map<T, string>();
        for (const a of agents) {
            const v = id(a);
            if (v != null && !m.has(v)) m.set(v, label(a) || String(v));
        }
        return [...m.entries()].map(([value, l]) => ({ label: l, value })).sort((x, y) => x.label.localeCompare(y.label));
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
        this.messageService.add({ severity: 'error', summary, detail });
    }
}
