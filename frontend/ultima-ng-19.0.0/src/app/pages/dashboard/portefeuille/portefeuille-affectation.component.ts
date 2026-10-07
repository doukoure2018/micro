import { CreditAffecte, PortefeuilleAffectation, Affectation, SynthesePointService } from '@/interface/portefeuille-affectation';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
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

interface AgenceSaf {
    codAgencia: string;
    desAgencia: string;
}

// « enCours » remplace « tous » : depuis la regle DSIG du 07/10/2026 la liste de travail ne
// montre que les credits qui courent. Les apures et les contentieux ont chacun leur filtre.
type Filtre = 'enCours' | 'nonAffectes' | 'aReaffecter' | 'affectes' | 'agent' | 'apures' | 'contentieux';

/**
 * Affectation des crédits SAF aux agents de crédit (V159).
 * Le DA affecte et désaffecte sur les points de service de son agence ; l'agent voit son
 * portefeuille ; DR, DE et DG consultent. SAF reste la source des encours.
 */
@Component({
    selector: 'app-portefeuille-affectation',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, DialogModule, InputTextModule, SelectModule, SelectButtonModule, TableModule, TagModule, TextareaModule, ToastModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>
        <div class="card">
            <div class="flex flex-wrap justify-between items-center gap-3 mb-2">
                <h2 class="text-xl font-bold m-0">{{ titre() }}</h2>
                <button pButton icon="pi pi-refresh" class="p-button-text" (click)="vue() === 'synthese' ? chargerSynthese() : charger()" [loading]="loading() || loadingSynthese()"></button>
            </div>
            <p-selectButton *ngIf="agences().length > 1" [options]="vueOptions" [ngModel]="vue()" (ngModelChange)="changerVue($event)" optionLabel="label" optionValue="value" [allowEmpty]="false" class="block mb-3"></p-selectButton>

            @if (vue() === 'synthese') {
            <p class="text-sm text-gray-500 mb-4">Une ligne par point de service de votre périmètre : encours et retards lus dans SAF, affectations digi en face. Cliquez une ligne pour descendre sur ses crédits et ses agents.</p>
            <div class="flex flex-wrap gap-3 items-center mb-3">
                <p-select
                    *ngIf="delegations().length > 1"
                    [options]="delegations()"
                    [ngModel]="delegationFiltre()"
                    (ngModelChange)="delegationFiltre.set($event)"
                    optionLabel="libelle"
                    optionValue="id"
                    placeholder="Toutes les délégations"
                    [showClear]="true"
                    styleClass="w-64"
                    appendTo="body"
                ></p-select>
                <input pInputText type="text" [ngModel]="rechercheSynthese()" (ngModelChange)="rechercheSynthese.set($event)" placeholder="Agence, point de service…" class="w-72" />
                <button pButton icon="pi pi-file-excel" label="Exporter Excel" class="p-button-success p-button-outlined ml-auto" [loading]="exportEnCours()" (click)="exporterSynthese()"></button>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4" *ngIf="totauxSynthese() as t">
                <div class="border rounded p-3"><div class="text-xs text-gray-500 uppercase">Points de service</div><div class="text-xl font-bold">{{ t.nbPs }}</div></div>
                <div class="border rounded p-3"><div class="text-xs text-gray-500 uppercase">Crédits en cours</div><div class="text-xl font-bold">{{ t.nbCredits }}</div><div class="text-xs text-gray-500">{{ t.encours | number: '1.0-0' }} GNF</div></div>
                <div class="border rounded p-3"><div class="text-xs text-gray-500 uppercase">Affectés</div><div class="text-xl font-bold text-green-700">{{ t.nbAffectes }}</div><div class="text-xs text-gray-500">{{ t.nbCredits ? ((100 * t.nbAffectes) / t.nbCredits | number: '1.0-0') : 0 }} %</div></div>
                <div class="border rounded p-3"><div class="text-xs text-gray-500 uppercase">Non affectés</div><div class="text-xl font-bold" [class.text-red-600]="t.nbNonAffectes > 0">{{ t.nbNonAffectes }}</div></div>
                <div class="border rounded p-3"><div class="text-xs text-gray-500 uppercase">À réaffecter</div><div class="text-xl font-bold" [class.text-orange-600]="t.nbAReaffecter > 0">{{ t.nbAReaffecter }}</div></div>
            </div>
            <p-table [value]="syntheseFiltree()" [loading]="loadingSynthese()" styleClass="p-datatable-sm" [rowHover]="true" selectionMode="single" (onRowSelect)="ouvrirPointService($event.data)" [paginator]="syntheseFiltree().length > 30" [rows]="30" sortMode="single" sortField="tauxAffectation" [sortOrder]="1">
                <ng-template pTemplate="header">
                    <tr>
                        <th pSortableColumn="delegation">Délégation <p-sortIcon field="delegation"></p-sortIcon></th>
                        <th pSortableColumn="agence">Agence <p-sortIcon field="agence"></p-sortIcon></th>
                        <th pSortableColumn="pointVente">Point de service <p-sortIcon field="pointVente"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="nbCredits">Crédits <p-sortIcon field="nbCredits"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="encours">Encours <p-sortIcon field="encours"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="nbEnRetard">En retard <p-sortIcon field="nbEnRetard"></p-sortIcon></th>
                        <th class="text-right">PAR 30</th>
                        <th class="text-right" pSortableColumn="nbAffectes">Affectés <p-sortIcon field="nbAffectes"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="nbNonAffectes">Non affectés <p-sortIcon field="nbNonAffectes"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="nbAReaffecter">À réaffecter <p-sortIcon field="nbAReaffecter"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="nbAgents">Agents <p-sortIcon field="nbAgents"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="tauxAffectation">Taux <p-sortIcon field="tauxAffectation"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="nbApures">Apurés <p-sortIcon field="nbApures"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="nbContentieux">Contentieux <p-sortIcon field="nbContentieux"></p-sortIcon></th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-s>
                    <tr [pSelectableRow]="s" class="cursor-pointer" [class.bg-orange-50]="s.nbAgents === 0 && s.nbCredits > 0">
                        <td class="text-sm">{{ s.delegation || '—' }}</td>
                        <td class="text-sm">{{ s.agence || '—' }}</td>
                        <td class="font-semibold">{{ s.pointVente }} <span class="text-xs text-gray-400 font-mono">{{ s.codAgencia }}</span></td>
                        <td class="text-right">{{ s.nbCredits }}</td>
                        <td class="text-right">{{ s.encours | number: '1.0-0' }}</td>
                        <td class="text-right" [class.text-red-600]="s.nbEnRetard > 0">{{ s.nbEnRetard }}</td>
                        <td class="text-right" [class.text-red-600]="pct(s.encoursPar30, s.encours) >= 5">{{ pct(s.encoursPar30, s.encours) | number: '1.1-1' }} %</td>
                        <td class="text-right text-green-700">{{ s.nbAffectes }}</td>
                        <td class="text-right" [class.text-red-600]="s.nbNonAffectes > 0">{{ s.nbNonAffectes }}</td>
                        <td class="text-right" [class.text-orange-600]="s.nbAReaffecter > 0">{{ s.nbAReaffecter }}</td>
                        <td class="text-right"><span [class.text-orange-600]="s.nbAgents === 0" [pTooltip]="s.nbAgents === 0 ? 'Aucun agent de crédit rattaché : rien ne peut être affecté' : ''">{{ s.nbAgents }}</span></td>
                        <td class="text-right font-semibold">{{ s.tauxAffectation * 100 | number: '1.0-0' }} %</td>
                        <td class="text-right text-gray-500" [pTooltip]="s.encoursApure ? (s.encoursApure | number: '1.0-0') + ' GNF' : ''">{{ s.nbApures }}</td>
                        <td class="text-right text-gray-500" [pTooltip]="s.encoursContentieux ? (s.encoursContentieux | number: '1.0-0') + ' GNF' : ''">{{ s.nbContentieux }}</td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr><td colspan="14" class="text-center text-gray-500 py-6">Aucun point de service dans votre périmètre.</td></tr>
                </ng-template>
            </p-table>
            } @else {
            <p class="text-sm text-gray-500 mb-4">
                Crédits vivants <strong>lus dans SAF2000</strong> (capital restant dû &gt; 0), chacun avec l'agent de crédit digi qui en répond.
                @if (data()?.peutAffecter) {
                    Cochez des crédits puis confiez-les à un agent du point de service. Le gestionnaire SAF est affiché à titre d'information : il ne crée aucune affectation.
                } @else {
                    Lecture seule. L'affectation est faite par le Directeur d'Agence.
                }
            </p>

            <div class="flex flex-wrap gap-3 items-center mb-4">
                <span *ngIf="agences().length === 1" class="font-semibold text-lg"><i class="pi pi-building mr-1"></i>{{ agence?.desAgencia }}</span>
                <p-select
                    *ngIf="delegations().length > 1"
                    [options]="delegations()"
                    [ngModel]="delegationFiltre()"
                    (ngModelChange)="delegationFiltre.set($event)"
                    optionLabel="libelle"
                    optionValue="id"
                    placeholder="Toutes les délégations"
                    [showClear]="true"
                    styleClass="w-64"
                    appendTo="body"
                ></p-select>
                <p-select
                    *ngIf="agences().length !== 1"
                    [options]="agencesOptions()"
                    [(ngModel)]="agence"
                    optionLabel="desAgencia"
                    placeholder="Choisir un point de service"
                    [filter]="agences().length > 8"
                    filterBy="desAgencia,codAgencia"
                    styleClass="w-72"
                    appendTo="body"
                    (onChange)="charger()"
                ></p-select>
                <p-selectButton [options]="filtreOptions()" [ngModel]="filtre()" (ngModelChange)="changerFiltre($event)" optionLabel="label" optionValue="value" [allowEmpty]="false"></p-selectButton>
                <p-select
                    [options]="data()?.agents || []"
                    [ngModel]="agentFiltre()"
                    (ngModelChange)="filtrerParAgent($event)"
                    optionLabel="nom"
                    optionValue="userId"
                    placeholder="Par agent"
                    [showClear]="true"
                    styleClass="w-56"
                    appendTo="body"
                ></p-select>
                <input pInputText type="text" [ngModel]="recherche()" (ngModelChange)="recherche.set($event)" placeholder="Client, code, n° crédit…" class="w-64" />
                <button pButton icon="pi pi-file-excel" label="Exporter Excel" class="p-button-success p-button-outlined ml-auto" pTooltip="Tous les crédits du point de service, au format DR / Agence / PS / crédit… + agent digi" [loading]="exportEnCours()" [disabled]="!agence || !data()" (click)="exporterPointService()"></button>
            </div>

            <!-- Indicateurs -->
            <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4" *ngIf="data()?.indicateurs as ind">
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Crédits en cours</div>
                    <div class="text-xl font-bold">{{ ind.nbCredits }}</div>
                    <div class="text-xs text-gray-500">seuls affectables</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Encours</div>
                    <div class="text-xl font-bold">{{ ind.encours | number: '1.0-0' }} <span class="text-xs font-normal">GNF</span></div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Affectés</div>
                    <div class="text-xl font-bold text-green-700">{{ ind.nbAffectes }}</div>
                    <div class="text-xs text-gray-500">{{ ind.nbCredits ? ((100 * ind.nbAffectes) / ind.nbCredits | number: '1.0-0') : 0 }} % du portefeuille</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Non affectés</div>
                    <div class="text-xl font-bold" [class.text-red-600]="ind.nbNonAffectes > 0">{{ ind.nbNonAffectes }}</div>
                    <div class="text-xs text-gray-500">{{ ind.encoursNonAffecte | number: '1.0-0' }} GNF sans responsable</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">À réaffecter</div>
                    <div class="text-xl font-bold" [class.text-orange-600]="ind.nbAReaffecter > 0">{{ ind.nbAReaffecter }}</div>
                    <div class="text-xs text-gray-500">agent parti ou désactivé</div>
                </div>
            </div>

            <!-- Hors charge d'agent : visibles au filtre, jamais affectables -->
            <div class="flex flex-wrap gap-x-8 gap-y-2 items-baseline mb-4 px-3 py-2 border rounded bg-surface-50 text-sm" *ngIf="data()?.indicateurs as ind">
                <span class="text-xs text-gray-500 uppercase">Hors charge d'agent</span>
                <span>
                    <b>{{ ind.nbApures }}</b> apuré(s)
                    <span class="text-gray-500">— {{ ind.encoursApure | number: '1.0-0' }} GNF</span>
                </span>
                <span>
                    <b>{{ ind.nbContentieux }}</b> au contentieux
                    <span class="text-gray-500">— {{ ind.encoursContentieux | number: '1.0-0' }} GNF</span>
                </span>
                <span class="text-xs text-gray-500">sortis du cycle de remboursement, non affectables</span>
            </div>

            <!-- Barre d'action sur la selection (DA) -->
            <div class="flex flex-wrap gap-2 items-center mb-3 p-3 border rounded bg-surface-50" *ngIf="data()?.peutAffecter">
                <span class="font-semibold">{{ selection.length }} crédit(s) sélectionné(s)</span>
                <span class="text-sm text-gray-500" *ngIf="selection.length">— {{ encoursSelection() | number: '1.0-0' }} GNF</span>
                <button pButton icon="pi pi-user-plus" label="Affecter la sélection" class="ml-auto" [disabled]="!selectionAffectable().length || !agentsDisponibles().length" (click)="ouvrirAffectation(selection)"></button>
                <button pButton icon="pi pi-user-minus" label="Désaffecter" class="p-button-outlined p-button-warning" [disabled]="!selectionAffectee().length" (click)="ouvrirDesaffectation(selectionAffectee())"></button>
                <button pButton icon="pi pi-times" class="p-button-text" [disabled]="!selection.length" (click)="selection = []" pTooltip="Vider la sélection"></button>
            </div>

            <p-table
                [value]="lignes()"
                [loading]="loading()"
                dataKey="credit.numCredito"
                [(selection)]="selection"
                [paginator]="true"
                [rows]="25"
                [rowsPerPageOptions]="[25, 50, 100]"
                [showCurrentPageReport]="true"
                currentPageReportTemplate="{first} à {last} sur {totalRecords} crédits"
                responsiveLayout="scroll"
                [rowHover]="true"
                styleClass="p-datatable-sm"
            >
                <ng-template pTemplate="header">
                    <tr>
                        <th style="width: 3rem" *ngIf="data()?.peutAffecter"><p-tableHeaderCheckbox></p-tableHeaderCheckbox></th>
                        <th>N° crédit</th>
                        <th>Client</th>
                        <th>Type</th>
                        <th>État</th>
                        <th>Octroi</th>
                        <th class="text-right">Octroyé</th>
                        <th class="text-right">Encours</th>
                        <th>Retard</th>
                        <th>Gestionnaire SAF</th>
                        <th>Mise en place</th>
                        <th>Agent digi</th>
                        <th></th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-l>
                    <tr [class.bg-orange-50]="l.aReaffecter" [class.bg-red-50]="l.affectable && !l.affectation && !l.aReaffecter && data()?.peutAffecter" [class.opacity-60]="!l.affectable">
                        <td *ngIf="data()?.peutAffecter"><p-tableCheckbox [value]="l" [disabled]="!l.affectable" [pTooltip]="l.affectable ? '' : 'Crédit ' + l.categorieLibelle.toLowerCase() + ' : hors cycle de remboursement, non affectable'"></p-tableCheckbox></td>
                        <td class="font-mono text-sm">{{ l.credit.numCredito }}</td>
                        <td>
                            <div class="font-semibold">{{ l.credit.nomCliente }}</div>
                            <div class="text-xs text-gray-500">{{ l.credit.codCliente }}</div>
                        </td>
                        <td class="text-sm">{{ l.credit.desTipCredito || l.credit.tipCredito }}</td>
                        <td>
                            <p-tag [severity]="l.categorie === 'EN_COURS' ? 'success' : l.categorie === 'CONTENTIEUX' ? 'warn' : 'secondary'" [value]="l.categorieLibelle"></p-tag>
                        </td>
                        <td class="text-sm">{{ l.credit.fecApertura | date: 'dd/MM/yyyy' }}</td>
                        <td class="text-right">{{ l.credit.monCredito | number: '1.0-0' }}</td>
                        <td class="text-right font-semibold">{{ l.credit.monSaldo | number: '1.0-0' }}</td>
                        <td>
                            <p-tag *ngIf="l.credit.datPremiereImpayee; else sain" severity="danger" [value]="(l.credit.joursRetard || 0) + ' j'"></p-tag>
                            <ng-template #sain><span class="text-gray-400">—</span></ng-template>
                        </td>
                        <td class="text-sm">
                            <div>{{ l.credit.nomGestionnaireSaf || l.credit.codGestionnaireSaf || '—' }}</div>
                            <div class="flex items-center gap-1 text-xs text-gray-500">
                                <span class="font-mono">{{ l.credit.codGestionnaireSaf }}</span>
                                <p-tag *ngIf="l.credit.statutGestionnaireSaf" [severity]="l.credit.statutGestionnaireSaf === 'A' ? 'success' : 'secondary'" [value]="l.credit.statutGestionnaireSaf === 'A' ? 'actif' : 'inactif'"></p-tag>
                            </div>
                        </td>
                        <td class="text-xs font-mono">{{ l.credit.usagerMiseEnPlace }}</td>
                        <td>
                            @if (l.affectation) {
                                <div class="font-semibold">{{ l.affectation.agentNom }}</div>
                                <div class="text-xs text-gray-500">depuis le {{ l.affectation.dateAffectation | date: 'dd/MM/yyyy' }}</div>
                                <p-tag *ngIf="l.aReaffecter" severity="warn" value="à réaffecter" [pTooltip]="l.motifReaffectation"></p-tag>
                            } @else if (l.affectable) {
                                <p-tag severity="danger" value="non affecté"></p-tag>
                            } @else {
                                <span class="text-gray-400">—</span>
                            }
                        </td>
                        <td class="whitespace-nowrap">
                            <button *ngIf="data()?.peutAffecter && l.affectable" pButton icon="pi pi-user-plus" class="p-button-text p-button-sm" pTooltip="Affecter ce crédit" (click)="ouvrirAffectation([l])"></button>
                            <button *ngIf="data()?.peutAffecter && l.affectation" pButton icon="pi pi-user-minus" class="p-button-text p-button-sm p-button-warning" pTooltip="Désaffecter" (click)="ouvrirDesaffectation([l])"></button>
                            <button pButton icon="pi pi-history" class="p-button-text p-button-sm" pTooltip="Historique des responsables" (click)="ouvrirHistorique(l)"></button>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr>
                        <td [attr.colspan]="data()?.peutAffecter ? 13 : 12" class="text-center text-gray-500 py-6">
                            {{ agence ? 'Aucun crédit pour ce filtre.' : 'Choisissez un point de service.' }}
                        </td>
                    </tr>
                </ng-template>
            </p-table>

            <!-- Charge par agent -->
            <div class="mt-6" *ngIf="data()?.agents?.length">
                <h3 class="text-lg font-semibold mb-2">Charge par agent</h3>
                <p-table [value]="data()!.agents" styleClass="p-datatable-sm" [rowHover]="true" (onRowSelect)="filtrerParAgent($event.data.userId)" selectionMode="single">
                    <ng-template pTemplate="header">
                        <tr>
                            <th>Agent</th>
                            <th>Statut</th>
                            <th class="text-right">Crédits</th>
                            <th class="text-right">Encours</th>
                            <th class="text-right">En retard</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-a>
                        <tr [pSelectableRow]="a" class="cursor-pointer">
                            <td class="font-semibold">{{ a.nom }}</td>
                            <td>
                                <p-tag *ngIf="a.disponible; else indispo" severity="success" value="agent du point de service"></p-tag>
                                <ng-template #indispo><p-tag severity="warn" value="parti ou désactivé" pTooltip="Ses crédits sont à réaffecter"></p-tag></ng-template>
                            </td>
                            <td class="text-right">{{ a.nbCredits }}</td>
                            <td class="text-right">{{ a.encours | number: '1.0-0' }}</td>
                            <td class="text-right" [class.text-red-600]="a.nbEnRetard > 0">{{ a.nbEnRetard }}</td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
            }
        </div>

        <!-- Dialogue d'affectation -->
        <p-dialog header="Affecter à un agent" [visible]="showAffectation()" (visibleChange)="!$event && showAffectation.set(false)" [modal]="true" [style]="{ width: '520px' }">
            <p class="mb-3">
                <strong>{{ cibles.length }}</strong> crédit(s), <strong>{{ encoursCibles() | number: '1.0-0' }}</strong> GNF d'encours, point de service <strong>{{ agence?.desAgencia }}</strong>.
            </p>
            <div class="mb-3">
                <label class="block text-sm font-semibold mb-1">Agent de crédit du point de service</label>
                <p-select [options]="agentsDisponibles()" [(ngModel)]="agentChoisi" optionLabel="nom" optionValue="userId" placeholder="Choisir un agent" styleClass="w-full" appendTo="body"></p-select>
                <small class="text-gray-500" *ngIf="!agentsDisponibles().length">Aucun agent de crédit actif n'est rattaché à ce point de service.</small>
            </div>
            <div class="mb-2">
                <label class="block text-sm font-semibold mb-1">Motif (facultatif)</label>
                <textarea pTextarea [(ngModel)]="motif" rows="2" class="w-full" placeholder="Ex. : prise en charge du portefeuille de l'agent parti"></textarea>
            </div>
            <ng-template pTemplate="footer">
                <button pButton label="Annuler" class="p-button-text" (click)="showAffectation.set(false)"></button>
                <button pButton label="Confirmer l'affectation" icon="pi pi-check" [loading]="envoi()" [disabled]="!agentChoisi" (click)="confirmerAffectation()"></button>
            </ng-template>
        </p-dialog>

        <!-- Dialogue de desaffectation -->
        <p-dialog header="Désaffecter" [visible]="showDesaffectation()" (visibleChange)="!$event && showDesaffectation.set(false)" [modal]="true" [style]="{ width: '480px' }">
            <p class="mb-3">Retirer <strong>{{ cibles.length }}</strong> crédit(s) à leur agent. Ils redeviendront « non affectés » ; l'historique conserve qui les a portés.</p>
            <div class="mb-2">
                <label class="block text-sm font-semibold mb-1">Motif (facultatif)</label>
                <textarea pTextarea [(ngModel)]="motif" rows="2" class="w-full" placeholder="Ex. : rotation de l'agent"></textarea>
            </div>
            <ng-template pTemplate="footer">
                <button pButton label="Annuler" class="p-button-text" (click)="showDesaffectation.set(false)"></button>
                <button pButton label="Confirmer" icon="pi pi-user-minus" class="p-button-warning" [loading]="envoi()" (click)="confirmerDesaffectation()"></button>
            </ng-template>
        </p-dialog>

        <!-- Historique -->
        <p-dialog header="Historique des responsables" [visible]="showHistorique()" (visibleChange)="!$event && showHistorique.set(false)" [modal]="true" [style]="{ width: '720px' }">
            <p class="text-sm text-gray-500 mb-2" *ngIf="creditHistorique">Crédit {{ creditHistorique.credit.numCredito }} · {{ creditHistorique.credit.nomCliente }}</p>
            <p-table [value]="historique()" [loading]="loadingHistorique()" styleClass="p-datatable-sm">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Agent</th>
                        <th>Du</th>
                        <th>Au</th>
                        <th>Par</th>
                        <th>Motif</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-h>
                    <tr>
                        <td class="font-semibold">{{ h.agentNom }} <p-tag *ngIf="h.actif" severity="success" value="en cours"></p-tag></td>
                        <td class="text-sm">{{ h.dateAffectation | date: 'dd/MM/yyyy HH:mm' }}</td>
                        <td class="text-sm">{{ h.dateFin ? (h.dateFin | date: 'dd/MM/yyyy HH:mm') : '—' }}</td>
                        <td class="text-sm">{{ h.affecteParNom }}</td>
                        <td class="text-sm">{{ h.motif }}<span *ngIf="h.motifFin" class="text-gray-500"> · fin : {{ h.motifFin }}</span></td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr><td colspan="5" class="text-center text-gray-500 py-4">Ce crédit n'a jamais été affecté.</td></tr>
                </ng-template>
            </p-table>
        </p-dialog>
    `
})
export class PortefeuilleAffectationComponent implements OnInit {
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

    agences = signal<AgenceSaf[]>([]);
    agence: AgenceSaf | null = null;
    data = signal<PortefeuilleAffectation | null>(null);
    loading = signal(false);

    filtre = signal<Filtre>('enCours');
    agentFiltre = signal<number | null>(null);
    recherche = signal('');

    selection: CreditAffecte[] = [];
    cibles: CreditAffecte[] = [];
    agentChoisi: number | null = null;
    motif = '';
    envoi = signal(false);
    showAffectation = signal(false);
    showDesaffectation = signal(false);

    // Vue synthese (perimetre a plusieurs points de service : DA, DR, DE, DG)
    vueOptions = [
        { label: 'Synthèse par point de service', value: 'synthese' },
        { label: "Crédits d'un point de service", value: 'credits' }
    ];
    vue = signal<'credits' | 'synthese'>('credits');
    synthese = signal<SynthesePointService[]>([]);
    loadingSynthese = signal(false);
    rechercheSynthese = signal('');
    exportEnCours = signal(false);

    // Délégation choisie (DE, DG : Conakry, Basse, Moyenne, Haute Guinée, Guinée Forestière)
    delegationFiltre = signal<number | null>(null);

    delegations = computed(() => {
        const m = new Map<number, string>();
        for (const s of this.synthese()) {
            if (s.delegationId != null && s.delegation) m.set(s.delegationId, s.delegation);
        }
        return [...m.entries()].map(([id, libelle]) => ({ id, libelle })).sort((a, b) => a.libelle.localeCompare(b.libelle));
    });

    syntheseFiltree = computed(() => {
        const q = this.rechercheSynthese().trim().toLowerCase();
        const d = this.delegationFiltre();
        return this.synthese()
            .filter((s) => d === null || s.delegationId === d)
            .filter((s) => !q || [s.delegation, s.agence, s.pointVente, s.codAgencia].some((v) => (v || '').toLowerCase().includes(q)));
    });

    /** Points de service proposés dans la vue crédits, restreints à la délégation choisie. */
    agencesOptions = computed(() => {
        const d = this.delegationFiltre();
        if (d === null) return this.agences();
        const codes = new Set(this.synthese().filter((s) => s.delegationId === d).map((s) => s.codAgencia));
        return this.agences().filter((a) => codes.has(a.codAgencia));
    });

    totauxSynthese = computed(() => {
        const l = this.syntheseFiltree();
        if (!l.length) return null;
        return l.reduce(
            (t, s) => ({
                nbPs: t.nbPs + 1,
                nbCredits: t.nbCredits + s.nbCredits,
                encours: t.encours + (s.encours || 0),
                nbAffectes: t.nbAffectes + s.nbAffectes,
                nbNonAffectes: t.nbNonAffectes + s.nbNonAffectes,
                nbAReaffecter: t.nbAReaffecter + s.nbAReaffecter
            }),
            { nbPs: 0, nbCredits: 0, encours: 0, nbAffectes: 0, nbNonAffectes: 0, nbAReaffecter: 0 }
        );
    });

    showHistorique = signal(false);
    loadingHistorique = signal(false);
    historique = signal<Affectation[]>([]);
    creditHistorique: CreditAffecte | null = null;

    /** L'agent voit « Mes crédits » à la place du filtre par agent. */
    filtreOptions = computed(() => {
        const ind = this.data()?.indicateurs;
        const base = [
            { label: 'En cours', value: 'enCours' },
            { label: 'Non affectés', value: 'nonAffectes' },
            { label: 'À réaffecter', value: 'aReaffecter' },
            { label: 'Affectés', value: 'affectes' },
            { label: 'Apurés (' + (ind?.nbApures ?? 0) + ')', value: 'apures' },
            { label: 'Contentieux (' + (ind?.nbContentieux ?? 0) + ')', value: 'contentieux' }
        ];
        return this.data()?.role === 'AGENT_CREDIT' ? [{ label: 'Mes crédits', value: 'agent' }, ...base] : base;
    });

    titre = computed(() => {
        const d = this.data();
        if (!d) return 'Portefeuille par agent';
        if (d.peutAffecter) return 'Affectation du portefeuille';
        return d.role === 'AGENT_CREDIT' ? 'Mon portefeuille' : 'Portefeuille par agent';
    });

    agentsDisponibles = computed(() => (this.data()?.agents || []).filter((a) => a.disponible));

    /** Lignes affichées : filtre, agent, recherche ; à réaffecter puis non affectés en tête. */
    lignes = computed<CreditAffecte[]>(() => {
        const d = this.data();
        if (!d) return [];
        const f = this.filtre();
        const agentId = this.agentFiltre();
        const q = this.recherche().trim().toLowerCase();
        const rang = (l: CreditAffecte) => (l.aReaffecter ? 0 : !l.affectation ? 1 : 2);
        return d.credits
            .filter((l) => {
                switch (f) {
                    // Sans le test d'affectable, « Non affectés » remonterait aussi les milliers
                    // de crédits apurés, qui n'ont par construction aucun responsable.
                    case 'nonAffectes':
                        return l.affectable && !l.affectation;
                    case 'aReaffecter':
                        return l.affectable && l.aReaffecter;
                    case 'affectes':
                        return l.affectable && !!l.affectation;
                    case 'agent':
                        return !!l.affectation && l.affectation.agentUserId === agentId;
                    case 'apures':
                        return l.categorie === 'APURE';
                    case 'contentieux':
                        return l.categorie === 'CONTENTIEUX';
                    default:
                        return l.affectable;
                }
            })
            .filter((l) => {
                if (!q) return true;
                const c = l.credit;
                return (c.nomCliente || '').toLowerCase().includes(q) || (c.codCliente || '').toLowerCase().includes(q) || String(c.numCredito).includes(q) || (l.affectation?.agentNom || '').toLowerCase().includes(q);
            })
            .sort((a, b) => rang(a) - rang(b));
    });

    ngOnInit(): void {
        this.userService
            .getPortefeuilleAgences$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    const agences = (r.data?.agences || []) as unknown as AgenceSaf[];
                    this.agences.set(agences);
                    if (agences.length === 1) {
                        this.agence = agences[0];
                        this.charger();
                    } else if (agences.length > 1) {
                        this.vue.set('synthese');
                        this.chargerSynthese();
                    }
                },
                error: (err) => this.erreur('Points de service indisponibles', err)
            });
    }

    charger(): void {
        if (!this.agence) return;
        this.loading.set(true);
        this.selection = [];
        this.userService
            .getPortefeuilleAffectations$(this.agence.codAgencia)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    const d: PortefeuilleAffectation = r.data?.portefeuille;
                    this.data.set(d);
                    // L'agent arrive directement sur ses crédits
                    if (d?.role === 'AGENT_CREDIT' && this.filtre() === 'enCours' && this.agentFiltre() === null) {
                        this.agentFiltre.set(d.utilisateurId);
                        this.filtre.set('agent');
                    }
                    this.loading.set(false);
                },
                error: (err) => {
                    this.loading.set(false);
                    this.erreur('Portefeuille indisponible', err);
                }
            });
    }

    changerFiltre(f: Filtre): void {
        this.filtre.set(f);
        if (f === 'agent' && this.agentFiltre() === null && this.data()?.role === 'AGENT_CREDIT') {
            this.agentFiltre.set(this.data()!.utilisateurId);
        }
        if (f !== 'agent') this.agentFiltre.set(null);
    }

    filtrerParAgent(userId: number | null): void {
        this.agentFiltre.set(userId);
        this.filtre.set(userId === null ? 'enCours' : 'agent');
    }

    changerVue(v: 'credits' | 'synthese'): void {
        this.vue.set(v);
        if (v === 'synthese' && !this.synthese().length) this.chargerSynthese();
    }

    chargerSynthese(): void {
        this.loadingSynthese.set(true);
        this.userService
            .getSyntheseAffectations$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.synthese.set((r.data?.synthese || []) as SynthesePointService[]);
                    this.loadingSynthese.set(false);
                },
                error: (err) => {
                    this.loadingSynthese.set(false);
                    this.erreur('Synthèse indisponible', err);
                }
            });
    }

    /** Descente depuis la synthèse : le point de service cliqué devient la vue crédits. */
    ouvrirPointService(s: SynthesePointService): void {
        this.agence = this.agences().find((x) => x.codAgencia === s.codAgencia) || { codAgencia: s.codAgencia, desAgencia: s.pointVente || s.codAgencia };
        this.filtre.set('enCours');
        this.agentFiltre.set(null);
        this.vue.set('credits');
        this.charger();
    }

    pct(part: number, total: number): number {
        return total > 0 ? (100 * (part || 0)) / total : 0;
    }

    exporterPointService(): void {
        if (!this.agence) return;
        this.telecharger(this.userService.exportAffectations$(this.agence.codAgencia), `portefeuille_agents_${this.agence.codAgencia}.xlsx`);
    }

    exporterSynthese(): void {
        this.telecharger(this.userService.exportSyntheseAffectations$(), 'portefeuille_agents_synthese.xlsx');
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

    selectionAffectee(): CreditAffecte[] {
        return this.selection.filter((l) => !!l.affectation);
    }

    /** Les crédits sélectionnés qui peuvent effectivement être confiés à un agent. */
    selectionAffectable(): CreditAffecte[] {
        return this.selection.filter((l) => l.affectable);
    }

    encoursSelection(): number {
        return this.selection.reduce((s, l) => s + (l.credit.monSaldo || 0), 0);
    }

    encoursCibles(): number {
        return this.cibles.reduce((s, l) => s + (l.credit.monSaldo || 0), 0);
    }

    ouvrirAffectation(lignes: CreditAffecte[]): void {
        // La case a cocher est deja desactivee sur les credits hors cycle, mais la case d'en-tete
        // selectionne tout le filtre courant : on filtre donc ici aussi, avant d'ouvrir.
        const affectables = lignes.filter((l) => l.affectable);
        const ecartes = lignes.length - affectables.length;
        if (!affectables.length) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Aucun crédit affectable',
                detail: "Les crédits apurés ou au contentieux sont sortis du cycle de remboursement et ne peuvent pas être confiés à un agent."
            });
            return;
        }
        if (ecartes > 0) {
            this.messageService.add({
                severity: 'info',
                summary: ecartes + ' crédit(s) écarté(s)',
                detail: 'Apurés ou au contentieux : ils ne sont la charge de personne.'
            });
        }
        this.cibles = affectables;
        this.agentChoisi = null;
        this.motif = '';
        this.showAffectation.set(true);
    }

    confirmerAffectation(): void {
        if (!this.agence || !this.agentChoisi || !this.cibles.length) return;
        this.envoi.set(true);
        this.userService
            .affecterCredits$({
                codAgencia: this.agence.codAgencia,
                numCreditos: this.cibles.map((l) => l.credit.numCredito),
                agentUserId: this.agentChoisi,
                motif: this.motif.trim() || undefined
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.envoi.set(false);
                    this.showAffectation.set(false);
                    this.messageService.add({ severity: 'success', summary: 'Affectation', detail: r.message });
                    this.charger();
                },
                error: (err) => {
                    this.envoi.set(false);
                    this.erreur("Affectation refusée", err);
                }
            });
    }

    ouvrirDesaffectation(lignes: CreditAffecte[]): void {
        this.cibles = lignes;
        this.motif = '';
        this.showDesaffectation.set(true);
    }

    confirmerDesaffectation(): void {
        if (!this.agence || !this.cibles.length) return;
        this.envoi.set(true);
        this.userService
            .desaffecterCredits$({
                codAgencia: this.agence.codAgencia,
                numCreditos: this.cibles.map((l) => l.credit.numCredito),
                motif: this.motif.trim() || undefined
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.envoi.set(false);
                    this.showDesaffectation.set(false);
                    this.messageService.add({ severity: 'success', summary: 'Désaffectation', detail: r.message });
                    this.charger();
                },
                error: (err) => {
                    this.envoi.set(false);
                    this.erreur('Désaffectation refusée', err);
                }
            });
    }

    ouvrirHistorique(l: CreditAffecte): void {
        this.creditHistorique = l;
        this.historique.set([]);
        this.showHistorique.set(true);
        this.loadingHistorique.set(true);
        this.userService
            .getHistoriqueAffectation$(l.credit.codAgencia, l.credit.numCredito)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.historique.set(r.data?.historique || []);
                    this.loadingHistorique.set(false);
                },
                error: (err) => {
                    this.loadingHistorique.set(false);
                    this.erreur('Historique indisponible', err);
                }
            });
    }

    private erreur(summary: string, err: unknown): void {
        const detail = typeof err === 'string' ? err : (err as any)?.message || 'Erreur inattendue';
        this.messageService.add({ severity: 'error', summary, detail });
    }
}
