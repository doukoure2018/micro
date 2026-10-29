import { DonneesSafComponent } from './donnees-saf.component';
import { IResponse } from '@/interface/response';
import { CreditRisque, FAMILLES_PROPOSEES, FamilleProduit, LigneRisque, NON_AFFECTE, PortefeuilleRisque, RisqueReseau, TrancheRisque } from '@/interface/portefeuille-risque';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
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

type Mode = 'ps' | 'perimetre';
type VueProduit = 'type' | 'famille';

/**
 * Portefeuille à risque par agent et par produit (proposition DSIG du 29/10/2026).
 *
 * Un écran à part, avec sa propre entrée de menu. Lot 1 : un point de service lu en direct,
 * PAR 30 et PAR 90 par produit (type de crédit SAF) et par agent (gestionnaire désigné), avec
 * la ligne « Non affecté », le croisement des deux et les crédits derrière chaque chiffre.
 * Lot 2 : tout le périmètre, descente délégation → agence → point de service, produit lu en
 * direct dans SAF, agents lus dans la photo du matin, familles et seuils réglés par la
 * Direction de l'exploitation.
 */
@Component({
    selector: 'app-portefeuille-risque',
    standalone: true,
    imports: [CommonModule, DonneesSafComponent, FormsModule, ButtonModule, DialogModule, InputNumberModule, InputTextModule, SelectModule, SelectButtonModule, TableModule, TagModule, ToastModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>
        <div class="card">
            <div class="flex flex-wrap justify-between items-center gap-3 mb-2">
                <h2 class="text-xl font-bold m-0">Portefeuille à risque</h2>
                <app-donnees-saf></app-donnees-saf>
                <button pButton icon="pi pi-refresh" class="p-button-text" pTooltip="Relire SAF" (click)="recharger()" [loading]="loading() || loadingReseau()"></button>
            </div>
            <p class="text-sm text-gray-500 mb-3">
                PAR 30, 60, 90 et 120 des crédits en cours, par produit et par gestionnaire désigné. Même règle que le bandeau du portefeuille et que la déclaration BCRG :
                un crédit entre dans le PAR 30 quand sa plus ancienne échéance impayée a 30 jours ou plus, et tout son encours compte.
            </p>

            <div class="flex flex-wrap gap-3 items-center mb-4">
                <p-selectButton *ngIf="agences().length > 1" [options]="modeOptions" [ngModel]="mode()" (ngModelChange)="changerMode($event)" optionLabel="label" optionValue="value" [allowEmpty]="false"></p-selectButton>
                <span *ngIf="agences().length === 1" class="font-semibold text-lg"><i class="pi pi-building mr-1"></i>{{ agences()[0]?.desAgencia }}</span>
                <p-select
                    *ngIf="agences().length > 1 && mode() === 'ps'"
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
                <p-selectButton *ngIf="mode() === 'perimetre' && niveauOptions().length > 1" [options]="niveauOptions()" [ngModel]="niveau()" (ngModelChange)="changerNiveau($event)" optionLabel="label" optionValue="value" [allowEmpty]="false"></p-selectButton>
                <p-selectButton [options]="vueProduitOptions" [ngModel]="vueProduit()" (ngModelChange)="vueProduit.set($event)" optionLabel="label" optionValue="value" [allowEmpty]="false" pTooltip="Lire les produits par type SAF ou par famille"></p-selectButton>
                <button *ngIf="peutParametrer()" pButton icon="pi pi-sliders-h" label="Familles et seuils" class="p-button-outlined" (click)="ouvrirFamilles()"></button>
                <button pButton icon="pi pi-file-excel" label="Exporter Excel" class="p-button-success p-button-outlined ml-auto" [loading]="exportEnCours()" [disabled]="mode() === 'ps' ? !data() : !reseau()" (click)="exporter()"></button>
            </div>

            <!-- ========================= Un périmètre (lot 2) ========================= -->
            @if (mode() === 'perimetre') {
            <div class="text-sm mb-3 flex flex-wrap items-center gap-1">
                <a class="cursor-pointer text-primary hover:underline" (click)="remonter(null)">Tout mon périmètre</a>
                <ng-container *ngIf="filtreDelegation()">
                    <i class="pi pi-angle-right text-gray-400"></i>
                    <a class="cursor-pointer text-primary hover:underline" (click)="remonter('delegation')">{{ filtreDelegation()!.libelle }}</a>
                </ng-container>
                <ng-container *ngIf="filtreAgence()">
                    <i class="pi pi-angle-right text-gray-400"></i>
                    <span class="font-semibold">{{ filtreAgence()!.libelle }}</span>
                </ng-container>
                <span *ngIf="reseau() as r" class="text-gray-500 ml-2">· {{ r.nbPointsService }} point(s) de service · lu le {{ r.dateLecture | date: 'dd/MM/yyyy' }}</span>
            </div>

            @if (reseau(); as r) {
            <ng-container *ngTemplateOutlet="tuiles; context: { $implicit: r.total, seuil30: r.seuilPar30, seuil90: r.seuilPar90 }"></ng-container>

            <h3 class="text-lg font-semibold mb-1">{{ libelleNiveau(r.niveau) }}</h3>
            <p class="text-xs text-gray-500 mb-2">Cliquez une ligne pour descendre jusqu'aux points de service, puis au détail d'un point de service.</p>
            <p-table [value]="r.parNiveau" styleClass="p-datatable-sm mb-5" [rowHover]="true" responsiveLayout="scroll">
                <ng-template pTemplate="header">
                    <tr>
                        <th>{{ libelleNiveau(r.niveau) }}</th>
                        <th>Rattachement</th>
                        <th class="text-right">PS</th>
                        <th class="text-right">Crédits</th>
                        <th class="text-right">Encours (GNF)</th>
                        <th class="text-right">Part</th>
                        <th class="text-right">En retard</th>
                        <th class="text-right">PAR 30</th>
                        <th class="text-right">PAR 60</th>
                        <th class="text-right">PAR 90</th>
                        <th class="text-right">PAR 120</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-l>
                    <tr class="cursor-pointer" (click)="descendre(l)">
                        <td class="font-semibold">{{ l.libelle }}<div class="text-xs text-gray-500 font-normal" *ngIf="l.code">{{ l.code }}</div></td>
                        <td class="text-gray-500">{{ l.rattachement || '' }}</td>
                        <td class="text-right">{{ l.nbPointsService }}</td>
                        <td class="text-right">{{ l.nbCredits }}</td>
                        <td class="text-right">{{ l.encours | number: '1.0-0' }}</td>
                        <td class="text-right text-gray-500">{{ part(l.encours, r.total.encours) | number: '1.0-0' }} %</td>
                        <td class="text-right" [class.text-orange-600]="l.nbEnRetard > 0">{{ l.nbEnRetard }}</td>
                        <td class="text-right">
                            <div class="font-semibold" [class.text-red-600]="l.tauxPar30 >= r.seuilPar30">{{ l.tauxPar30 | number: '1.1-1' }} %</div>
                            <div class="text-xs text-gray-500">{{ l.encoursPar30 | number: '1.0-0' }} · {{ l.nbPar30 }}</div>
                        </td>
                        <td class="text-right">
                            <div class="font-semibold">{{ l.tauxPar60 | number: '1.1-1' }} %</div>
                            <div class="text-xs text-gray-500">{{ l.encoursPar60 | number: '1.0-0' }} · {{ l.nbPar60 }}</div>
                        </td>
                        <td class="text-right">
                            <div class="font-semibold" [class.text-red-600]="l.tauxPar90 >= r.seuilPar90">{{ l.tauxPar90 | number: '1.1-1' }} %</div>
                            <div class="text-xs text-gray-500">{{ l.encoursPar90 | number: '1.0-0' }} · {{ l.nbPar90 }}</div>
                        </td>
                        <td class="text-right">
                            <div class="font-semibold">{{ l.tauxPar120 | number: '1.1-1' }} %</div>
                            <div class="text-xs text-gray-500">{{ l.encoursPar120 | number: '1.0-0' }} · {{ l.nbPar120 }}</div>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage"><tr><td colspan="11" class="text-center text-gray-500 py-4">Aucun crédit en cours.</td></tr></ng-template>
            </p-table>

            <h3 class="text-lg font-semibold mb-1">{{ vueProduit() === 'famille' ? 'Par famille de produits' : 'Par produit' }}</h3>
            <p class="text-xs text-gray-500 mb-2">Type de crédit SAF, lu en direct pour tout le périmètre. Les familles sont celles de la Direction de l'exploitation ; un type non classé est dans « Autres ».</p>
            <ng-container *ngTemplateOutlet="tableProduits; context: { $implicit: vueProduit() === 'famille' ? r.parFamille : r.parProduit, total: r.total, seuil30: r.seuilPar30, seuil90: r.seuilPar90, cliquable: false, credits: false }"></ng-container>

            <h3 class="text-lg font-semibold mb-1 mt-5">
                Par agent
                <span *ngIf="r.datePhoto" class="text-sm font-normal text-gray-500">— photo du {{ r.datePhoto | date: 'dd/MM/yyyy' }}</span>
            </h3>
            <p class="text-xs text-gray-500 mb-2">
                SAF ne connaît pas les affectations digi : au-delà d'un point de service, la ventilation par agent se lit dans la photo prise chaque matin à 08h40 GMT.
                <span *ngIf="r.peutPhotographier"> <a class="cursor-pointer text-primary hover:underline" (click)="photographier()">{{ r.photoEnCours ? 'Photo en cours…' : 'Reprendre la photo maintenant' }}</a>.</span>
            </p>
            @if (!r.datePhoto) {
            <p class="text-gray-500 border rounded p-3 mb-3"><i class="pi pi-camera mr-2"></i>Aucune photo encore disponible. La première sera prise demain à 08h40 GMT<span *ngIf="r.peutPhotographier">, ou tout de suite en reprenant la photo</span>.</p>
            } @else {
            <ng-container *ngTemplateOutlet="tableAgents; context: { $implicit: r.parAgent, total: r.total, seuil30: r.seuilPar30, seuil90: r.seuilPar90, cliquable: false, credits: false }"></ng-container>
            }
            } @else if (!loadingReseau()) {
            <p class="text-gray-500">Chargement du périmètre…</p>
            }
            }

            <!-- ========================= Un point de service (lot 1) ========================= -->
            @if (mode() === 'ps') {
            @if (data(); as d) {
            <ng-container *ngTemplateOutlet="tuiles; context: { $implicit: d.total, seuil30: d.seuilPar30, seuil90: d.seuilPar90 }"></ng-container>

            <div *ngIf="filtreProduit() || filtreAgent()" class="flex flex-wrap items-center gap-2 mb-3 p-2 rounded bg-blue-50 border border-blue-200 text-sm">
                <i class="pi pi-filter"></i>
                <span *ngIf="filtreProduit() as f">Le tableau des agents ne montre que le produit <b>{{ f.libelle }}</b>.</span>
                <span *ngIf="filtreAgent() as f">Le tableau des produits ne montre que <b>{{ f.libelle }}</b>.</span>
                <button pButton label="Tout afficher" icon="pi pi-times" class="p-button-text p-button-sm ml-auto" (click)="effacerFiltres()"></button>
            </div>

            <h3 class="text-lg font-semibold mb-1">{{ vueProduit() === 'famille' && !filtreAgent() ? 'Par famille de produits' : 'Par produit' }}</h3>
            <p class="text-xs text-gray-500 mb-2">Type de crédit SAF. Cliquez une ligne pour voir la part de chaque agent dans ce produit.</p>
            <ng-container *ngTemplateOutlet="tableProduits; context: { $implicit: lignesProduit(), total: d.total, seuil30: d.seuilPar30, seuil90: d.seuilPar90, cliquable: true, credits: true }"></ng-container>

            <h3 class="text-lg font-semibold mb-1 mt-5">Par agent</h3>
            <p class="text-xs text-gray-500 mb-2">
                Gestionnaire désigné dans digi (affectation du directeur d'agence). La ligne « Non affecté » porte les crédits que personne ne suit encore : la somme des lignes redonne le point de service.
                <span *ngIf="d.estAgent"> Vous voyez votre ligne et la ligne « Non affecté » ; la comparaison entre agents revient au directeur d'agence.</span>
                Cliquez une ligne pour voir la répartition par produit de cet agent.
            </p>
            <ng-container *ngTemplateOutlet="tableAgents; context: { $implicit: lignesAgent(), total: d.total, seuil30: d.seuilPar30, seuil90: d.seuilPar90, cliquable: true, credits: true }"></ng-container>
            <p class="text-xs text-gray-500 mt-3">
                Dans chaque case PAR : le taux, puis l'encours en GNF et le nombre de crédits. Seuils d'attention : PAR 30 ≥ {{ d.seuilPar30 }} %, PAR 90 ≥ {{ d.seuilPar90 }} %, sauf seuil propre à une famille ; PAR 60 et PAR 120 sont donnés sans seuil. Ce PAR est comptable : il dit où est le risque, pas la faute de quelqu'un.
                Un agent qui reçoit un portefeuille dégradé affiche un PAR élevé le jour de l'affectation. L'appréciation des agents, elle, retire les retards hérités.
            </p>
            } @else if (!loading() && agence()) {
            <p class="text-gray-500">Aucune donnée.</p>
            } @else if (!loading()) {
            <p class="text-gray-500">Choisissez un point de service.</p>
            }
            }
        </div>

        <!-- ========================= Gabarits ========================= -->
        <ng-template #tuiles let-t let-seuil30="seuil30" let-seuil90="seuil90">
            <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3 mb-4">
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Crédits en cours</div>
                    <div class="text-xl font-bold">{{ t.nbCredits }}</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Encours</div>
                    <div class="text-xl font-bold">{{ t.encours | number: '1.0-0' }} <span class="text-xs font-normal">GNF</span></div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">En retard</div>
                    <div class="text-xl font-bold text-orange-600">{{ t.nbEnRetard }}</div>
                    <div class="text-xs text-gray-500">{{ t.impaye | number: '1.0-0' }} GNF impayés</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">PAR 30</div>
                    <div class="text-xl font-bold" [class.text-red-600]="t.tauxPar30 >= seuil30">{{ t.tauxPar30 | number: '1.1-1' }} %</div>
                    <div class="text-xs text-gray-500">{{ t.encoursPar30 | number: '1.0-0' }} GNF · {{ t.nbPar30 }} crédits</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">PAR 60</div>
                    <div class="text-xl font-bold">{{ t.tauxPar60 | number: '1.1-1' }} %</div>
                    <div class="text-xs text-gray-500">{{ t.encoursPar60 | number: '1.0-0' }} GNF · {{ t.nbPar60 }} crédits</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">PAR 90</div>
                    <div class="text-xl font-bold" [class.text-red-600]="t.tauxPar90 >= seuil90">{{ t.tauxPar90 | number: '1.1-1' }} %</div>
                    <div class="text-xs text-gray-500">{{ t.encoursPar90 | number: '1.0-0' }} GNF · {{ t.nbPar90 }} crédits</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">PAR 120</div>
                    <div class="text-xl font-bold">{{ t.tauxPar120 | number: '1.1-1' }} %</div>
                    <div class="text-xs text-gray-500">{{ t.encoursPar120 | number: '1.0-0' }} GNF · {{ t.nbPar120 }} crédits</div>
                </div>
            </div>
        </ng-template>

        <ng-template #tableProduits let-lignes let-total="total" let-seuil30="seuil30" let-seuil90="seuil90" let-cliquable="cliquable" let-avecCredits="credits">
            <p-table [value]="lignes" styleClass="p-datatable-sm" [rowHover]="true" responsiveLayout="scroll">
                <ng-template pTemplate="header">
                    <tr>
                        <th pSortableColumn="libelle">Produit <p-sortIcon field="libelle"></p-sortIcon></th>
                        <th *ngIf="vueProduit() === 'type'">Famille</th>
                        <th class="text-right" pSortableColumn="nbCredits">Crédits <p-sortIcon field="nbCredits"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="encours">Encours (GNF) <p-sortIcon field="encours"></p-sortIcon></th>
                        <th class="text-right">Part</th>
                        <th class="text-right" pSortableColumn="nbEnRetard">En retard <p-sortIcon field="nbEnRetard"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="tauxPar30">PAR 30 <p-sortIcon field="tauxPar30"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="tauxPar60">PAR 60 <p-sortIcon field="tauxPar60"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="tauxPar90">PAR 90 <p-sortIcon field="tauxPar90"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="tauxPar120">PAR 120 <p-sortIcon field="tauxPar120"></p-sortIcon></th>
                        <th class="text-right" pTooltip="Dossiers passés au contentieux par le DA dans digi ; ils restent dans la base du PAR">Cont.</th>
                        <th *ngIf="avecCredits">Crédits</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-l>
                    <tr [class.cursor-pointer]="cliquable" [class.bg-blue-50]="cliquable && filtreProduit()?.cle === l.cle" (click)="cliquable && choisirProduit(l)">
                        <td class="font-semibold">
                            {{ l.libelleCourt || l.libelle }}
                            <div class="text-xs text-gray-500 font-normal" *ngIf="l.libelleCourt">{{ l.libelle }}</div>
                            <div class="text-xs text-gray-500 font-normal" *ngIf="l.tipCredito != null">type {{ l.tipCredito }}</div>
                        </td>
                        <td *ngIf="vueProduit() === 'type'" class="text-gray-500">{{ l.famille || '' }}</td>
                        <td class="text-right">{{ l.nbCredits }}</td>
                        <td class="text-right">{{ l.encours | number: '1.0-0' }}</td>
                        <td class="text-right text-gray-500">{{ part(l.encours, total.encours) | number: '1.0-0' }} %</td>
                        <td class="text-right" [class.text-orange-600]="l.nbEnRetard > 0">{{ l.nbEnRetard }}</td>
                        <td class="text-right" [pTooltip]="l.seuilPar30 != null ? 'Seuil propre à la famille : ' + l.seuilPar30 + ' %' : ''">
                            <div class="font-semibold" [class.text-red-600]="l.tauxPar30 >= (l.seuilPar30 ?? seuil30)">{{ l.tauxPar30 | number: '1.1-1' }} %</div>
                            <div class="text-xs text-gray-500">{{ l.encoursPar30 | number: '1.0-0' }} · {{ l.nbPar30 }}</div>
                        </td>
                        <td class="text-right">
                            <div class="font-semibold">{{ l.tauxPar60 | number: '1.1-1' }} %</div>
                            <div class="text-xs text-gray-500">{{ l.encoursPar60 | number: '1.0-0' }} · {{ l.nbPar60 }}</div>
                        </td>
                        <td class="text-right">
                            <div class="font-semibold" [class.text-red-600]="l.tauxPar90 >= (l.seuilPar90 ?? seuil90)">{{ l.tauxPar90 | number: '1.1-1' }} %</div>
                            <div class="text-xs text-gray-500">{{ l.encoursPar90 | number: '1.0-0' }} · {{ l.nbPar90 }}</div>
                        </td>
                        <td class="text-right">
                            <div class="font-semibold">{{ l.tauxPar120 | number: '1.1-1' }} %</div>
                            <div class="text-xs text-gray-500">{{ l.encoursPar120 | number: '1.0-0' }} · {{ l.nbPar120 }}</div>
                        </td>
                        <td class="text-right">{{ l.nbContentieuxDeclares || '' }}</td>
                        <td *ngIf="avecCredits" class="whitespace-nowrap" (click)="$event.stopPropagation()">
                            <button pButton label="30 j+" class="p-button-text p-button-sm" pTooltip="Crédits à 30 jours de retard et plus" [disabled]="!l.nbPar30" (click)="voirCredits(l, '30')"></button>
                            <button pButton label="90 j+" class="p-button-text p-button-sm" pTooltip="Crédits à 90 jours de retard et plus" [disabled]="!l.nbPar90" (click)="voirCredits(l, '90')"></button>
                            <button pButton icon="pi pi-list" class="p-button-text p-button-sm" pTooltip="Tous les crédits de la ligne" (click)="voirCredits(l, '')"></button>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage"><tr><td colspan="13" class="text-center text-gray-500 py-4">Aucun crédit en cours pour cette sélection.</td></tr></ng-template>
            </p-table>
        </ng-template>

        <ng-template #tableAgents let-lignes let-total="total" let-seuil30="seuil30" let-seuil90="seuil90" let-cliquable="cliquable" let-avecCredits="credits">
            <p-table [value]="lignes" styleClass="p-datatable-sm" [rowHover]="true" responsiveLayout="scroll">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Agent</th>
                        <th>Statut</th>
                        <th class="text-right">Crédits</th>
                        <th class="text-right">Encours (GNF)</th>
                        <th class="text-right">Part</th>
                        <th class="text-right">En retard</th>
                        <th class="text-right">PAR 30</th>
                        <th class="text-right">PAR 60</th>
                        <th class="text-right">PAR 90</th>
                        <th class="text-right">PAR 120</th>
                        <th class="text-right" pTooltip="Dossiers passés au contentieux par le DA dans digi ; ils restent dans la base du PAR">Cont.</th>
                        <th *ngIf="avecCredits">Crédits</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-l>
                    <tr [class.cursor-pointer]="cliquable" [class.bg-blue-50]="cliquable && filtreAgent()?.cle === l.cle" [class.bg-gray-50]="l.nonAffecte" (click)="cliquable && choisirAgent(l)">
                        <td class="font-semibold" [class.italic]="l.nonAffecte">{{ l.libelle }}</td>
                        <td>
                            <p-tag *ngIf="l.nonAffecte" severity="warn" value="sans gestionnaire" pTooltip="À affecter par le directeur d'agence"></p-tag>
                            <p-tag *ngIf="!l.nonAffecte && l.disponible" severity="success" value="agent du point de service"></p-tag>
                            <p-tag *ngIf="!l.nonAffecte && l.disponible === false" severity="danger" value="parti ou désactivé" pTooltip="Ses crédits sont à réaffecter"></p-tag>
                        </td>
                        <td class="text-right">{{ l.nbCredits }}</td>
                        <td class="text-right">{{ l.encours | number: '1.0-0' }}</td>
                        <td class="text-right text-gray-500">{{ part(l.encours, total.encours) | number: '1.0-0' }} %</td>
                        <td class="text-right" [class.text-orange-600]="l.nbEnRetard > 0">{{ l.nbEnRetard }}</td>
                        <td class="text-right">
                            <div class="font-semibold" [class.text-red-600]="l.tauxPar30 >= seuil30">{{ l.tauxPar30 | number: '1.1-1' }} %</div>
                            <div class="text-xs text-gray-500">{{ l.encoursPar30 | number: '1.0-0' }} · {{ l.nbPar30 }}</div>
                        </td>
                        <td class="text-right">
                            <div class="font-semibold">{{ l.tauxPar60 | number: '1.1-1' }} %</div>
                            <div class="text-xs text-gray-500">{{ l.encoursPar60 | number: '1.0-0' }} · {{ l.nbPar60 }}</div>
                        </td>
                        <td class="text-right">
                            <div class="font-semibold" [class.text-red-600]="l.tauxPar90 >= seuil90">{{ l.tauxPar90 | number: '1.1-1' }} %</div>
                            <div class="text-xs text-gray-500">{{ l.encoursPar90 | number: '1.0-0' }} · {{ l.nbPar90 }}</div>
                        </td>
                        <td class="text-right">
                            <div class="font-semibold">{{ l.tauxPar120 | number: '1.1-1' }} %</div>
                            <div class="text-xs text-gray-500">{{ l.encoursPar120 | number: '1.0-0' }} · {{ l.nbPar120 }}</div>
                        </td>
                        <td class="text-right">{{ l.nbContentieuxDeclares || '' }}</td>
                        <td *ngIf="avecCredits" class="whitespace-nowrap" (click)="$event.stopPropagation()">
                            <button pButton label="30 j+" class="p-button-text p-button-sm" pTooltip="Crédits à 30 jours de retard et plus" [disabled]="!l.nbPar30" (click)="voirCredits(l, '30')"></button>
                            <button pButton label="90 j+" class="p-button-text p-button-sm" pTooltip="Crédits à 90 jours de retard et plus" [disabled]="!l.nbPar90" (click)="voirCredits(l, '90')"></button>
                            <button pButton icon="pi pi-list" class="p-button-text p-button-sm" pTooltip="Tous les crédits de la ligne" (click)="voirCredits(l, '')"></button>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage"><tr><td colspan="12" class="text-center text-gray-500 py-4">Aucun crédit en cours pour cette sélection.</td></tr></ng-template>
            </p-table>
        </ng-template>

        <!-- ========================= Crédits derrière un chiffre ========================= -->
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
                <ng-template pTemplate="emptymessage"><tr><td colspan="10" class="text-center text-gray-500 py-4">Aucun crédit pour ce filtre.</td></tr></ng-template>
            </p-table>
        </p-dialog>

        <!-- ========================= Familles et seuils (Direction de l'exploitation) ========================= -->
        <p-dialog header="Familles de produits et seuils d'attention" [(visible)]="showFamilles" [modal]="true" [style]="{ width: '95vw', maxWidth: '1200px' }" [dismissableMask]="true">
            <div class="border rounded p-3 mb-4">
                <div class="font-semibold mb-2">Seuils généraux</div>
                <div class="flex flex-wrap items-end gap-3">
                    <div>
                        <label class="block text-xs text-gray-500 mb-1">PAR 30 en rouge à partir de (%)</label>
                        <p-inputNumber [(ngModel)]="seuilsEdit.seuilPar30" [min]="0" [max]="100" [minFractionDigits]="0" [maxFractionDigits]="2" styleClass="w-32"></p-inputNumber>
                    </div>
                    <div>
                        <label class="block text-xs text-gray-500 mb-1">PAR 90 en rouge à partir de (%)</label>
                        <p-inputNumber [(ngModel)]="seuilsEdit.seuilPar90" [min]="0" [max]="100" [minFractionDigits]="0" [maxFractionDigits]="2" styleClass="w-32"></p-inputNumber>
                    </div>
                    <button pButton label="Enregistrer les seuils" icon="pi pi-check" [loading]="enregistrementEnCours()" (click)="enregistrerSeuils()"></button>
                    <span class="text-xs text-gray-500">L'écran portefeuille utilisait 5 % et 3 % ; le gabarit du rapport réseau cite 5 % et 2 %.</span>
                </div>
            </div>
            <p class="text-sm text-gray-500 mb-2">
                Un type de crédit SAF, une famille, un libellé court lisible par tous, et si besoin un seuil propre à la famille. Un type non classé reste dans « Autres » avec son libellé SAF, jamais hors des totaux.
            </p>
            <p-table [value]="familles()" [loading]="loadingFamilles()" styleClass="p-datatable-sm" responsiveLayout="scroll" dataKey="tipCredito">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Type</th>
                        <th>Libellé SAF</th>
                        <th class="text-right">Crédits</th>
                        <th class="text-right">Encours (GNF)</th>
                        <th style="min-width: 14rem">Famille</th>
                        <th style="min-width: 12rem">Libellé court</th>
                        <th>Seuil PAR 30</th>
                        <th>Seuil PAR 90</th>
                        <th>Dernière modification</th>
                        <th></th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-f>
                    <tr>
                        <td>{{ f.tipCredito === -1 ? 'sans type' : f.tipCredito }}</td>
                        <td>{{ f.libelleSaf || '—' }}</td>
                        <td class="text-right">{{ f.nbCredits }}</td>
                        <td class="text-right">{{ f.encours | number: '1.0-0' }}</td>
                        <td><p-select [options]="famillesProposees" [(ngModel)]="f.famille" [editable]="true" placeholder="Autres" appendTo="body" styleClass="w-full"></p-select></td>
                        <td><input pInputText type="text" [(ngModel)]="f.libelleCourt" maxlength="80" class="w-full" placeholder="ex. Commerce" /></td>
                        <td><p-inputNumber [(ngModel)]="f.seuilPar30" [min]="0" [max]="100" [maxFractionDigits]="2" placeholder="général" styleClass="w-24"></p-inputNumber></td>
                        <td><p-inputNumber [(ngModel)]="f.seuilPar90" [min]="0" [max]="100" [maxFractionDigits]="2" placeholder="général" styleClass="w-24"></p-inputNumber></td>
                        <td class="text-xs text-gray-500">{{ f.modifiePar || '' }}<div *ngIf="f.modifieLe">{{ f.modifieLe | date: 'dd/MM/yyyy HH:mm' }}</div></td>
                        <td><button pButton icon="pi pi-check" class="p-button-sm" pTooltip="Enregistrer cette ligne" [loading]="enregistrementEnCours()" (click)="enregistrerFamille(f)"></button></td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage"><tr><td colspan="10" class="text-center text-gray-500 py-4">Aucun type de crédit lu.</td></tr></ng-template>
            </p-table>
        </p-dialog>
    `
})
export class PortefeuilleRisqueComponent implements OnInit {
    private readonly userService = inject(UserService);
    private readonly messageService = inject(MessageService);
    private readonly destroyRef = inject(DestroyRef);

    agences = signal<AgenceSaf[]>([]);
    mode = signal<Mode>('ps');
    modeOptions = [
        { label: 'Tout mon périmètre', value: 'perimetre' },
        { label: 'Un point de service', value: 'ps' }
    ];
    vueProduit = signal<VueProduit>('type');
    vueProduitOptions = [
        { label: 'Par type', value: 'type' },
        { label: 'Par famille', value: 'famille' }
    ];

    // Un point de service (lot 1)
    agence = signal<AgenceSaf | null>(null);
    data = signal<PortefeuilleRisque | null>(null);
    loading = signal(false);
    filtreProduit = signal<LigneRisque | null>(null);
    filtreAgent = signal<LigneRisque | null>(null);

    // Un périmètre (lot 2)
    reseau = signal<RisqueReseau | null>(null);
    loadingReseau = signal(false);
    niveau = signal<string>('auto');
    niveauOptions = signal<{ label: string; value: string }[]>([]);
    filtreAgence = signal<{ id: number; libelle: string } | null>(null);
    filtreDelegation = signal<{ id: number; libelle: string } | null>(null);

    exportEnCours = signal(false);
    peutParametrer = computed(() => !!(this.data()?.peutParametrer || this.reseau()?.peutParametrer));

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
        { label: '60 j et plus', value: '60' },
        { label: '90 j et plus', value: '90' },
        { label: '120 j et plus', value: '120' }
    ];

    // Dialogue des familles et seuils
    showFamilles = false;
    familles = signal<FamilleProduit[]>([]);
    loadingFamilles = signal(false);
    enregistrementEnCours = signal(false);
    famillesProposees = FAMILLES_PROPOSEES;
    seuilsEdit: { seuilPar30: number | null; seuilPar90: number | null } = { seuilPar30: null, seuilPar90: null };

    /** Tableau des produits d'un point de service : celui du PS, ou la part de l'agent choisi. */
    lignesProduit = computed<LigneRisque[]>(() => {
        const d = this.data();
        if (!d) return [];
        const agent = this.filtreAgent();
        if (!agent) return this.vueProduit() === 'famille' ? d.parFamille : d.parProduit;
        const produits = new Map(d.parProduit.map((p) => [this.cleProduit(p.tipCredito), p]));
        return d.croisement
            .filter((x) => this.cleAgent(x) === agent.cle)
            .map((x) => {
                const p = produits.get(this.cleProduit(x.tipCredito));
                return { ...x, libelle: p?.libelle || x.produit || x.libelle, famille: p?.famille, libelleCourt: p?.libelleCourt, seuilPar30: p?.seuilPar30, seuilPar90: p?.seuilPar90 };
            });
    });

    /** Tableau des agents d'un point de service : celui du PS, ou la part de chacun dans le produit choisi. */
    lignesAgent = computed<LigneRisque[]>(() => {
        const d = this.data();
        if (!d) return [];
        const produit = this.filtreProduit();
        if (!produit) return d.parAgent;
        const agents = new Map(d.parAgent.map((a) => [a.cle, a]));
        const memeProduit = (x: LigneRisque) =>
            produit.cle.startsWith('F|') ? (x.tipCredito != null ? d.parProduit.find((p) => p.tipCredito === x.tipCredito)?.famille : 'Autres') === produit.famille : this.cleProduit(x.tipCredito) === produit.cle;
        const regroupe = new Map<string, LigneRisque>();
        for (const x of d.croisement.filter(memeProduit)) {
            const cle = this.cleAgent(x);
            const a = agents.get(cle);
            const existant = regroupe.get(cle);
            if (existant) {
                this.additionner(existant, x);
            } else {
                regroupe.set(cle, { ...x, cle, libelle: a?.libelle || (x.nonAffecte ? 'Non affecté' : x.libelle), disponible: a?.disponible ?? x.disponible });
            }
        }
        const lignes = [...regroupe.values()];
        lignes.forEach((l) => this.figerTaux(l));
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
                        this.mode.set('ps');
                        this.charger();
                    } else if (agences.length > 1) {
                        // DA, DR, direction : la vue d'ensemble d'abord, le détail d'un point de service au clic.
                        this.mode.set('perimetre');
                        this.chargerReseau();
                    }
                },
                error: (err) => this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Chargement des points de service impossible', life: 6000 })
            });
    }

    recharger(): void {
        if (this.mode() === 'perimetre') this.chargerReseau();
        else this.charger();
    }

    changerMode(m: Mode): void {
        this.mode.set(m);
        if (m === 'perimetre' && !this.reseau()) this.chargerReseau();
        if (m === 'ps' && this.agence() && !this.data()) this.charger();
    }

    // ------------------------------------------------------------------ un point de service

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

    // ------------------------------------------------------------------ un périmètre

    chargerReseau(): void {
        this.loadingReseau.set(true);
        this.userService
            .getPortefeuilleRisqueReseau$(this.niveau(), this.filtreAgence()?.id ?? null, this.filtreDelegation()?.id ?? null)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    const d = ((r.data as any)?.risque as RisqueReseau) || null;
                    this.reseau.set(d);
                    if (d) {
                        this.niveau.set(d.niveau);
                        this.niveauOptions.set((d.niveaux || []).map((n) => ({ label: this.libelleNiveau(n), value: n })));
                    }
                    this.loadingReseau.set(false);
                },
                error: (err) => {
                    this.loadingReseau.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Portefeuille à risque', detail: err || 'Lecture SAF impossible (clôture en cours ?)', life: 7000 });
                }
            });
    }

    changerNiveau(n: string): void {
        this.niveau.set(n);
        this.chargerReseau();
    }

    /** Descente d'un niveau, jusqu'au détail d'un point de service (mode « un point de service »). */
    descendre(l: LigneRisque): void {
        if (l.niveau === 'PS') {
            const a = this.agences().find((x) => x.codAgencia === l.code);
            if (!a) {
                this.messageService.add({ severity: 'info', summary: 'Point de service', detail: 'Ce point de service est hors de votre périmètre direct.', life: 5000 });
                return;
            }
            this.mode.set('ps');
            this.choisirAgence(a);
            return;
        }
        if (l.id === null || l.id === undefined) {
            this.messageService.add({ severity: 'info', summary: 'Non rattaché', detail: 'Ces points de service ne sont pas rattachés dans la plateforme : passez au niveau point de service pour les voir.', life: 5000 });
            return;
        }
        if (l.niveau === 'DELEGATION') {
            this.filtreDelegation.set({ id: l.id, libelle: l.libelle });
            this.filtreAgence.set(null);
            this.niveau.set('agence');
        } else if (l.niveau === 'AGENCE') {
            this.filtreAgence.set({ id: l.id, libelle: l.libelle });
            this.niveau.set('ps');
        }
        this.chargerReseau();
    }

    remonter(jusqua: 'delegation' | null): void {
        if (jusqua === 'delegation') {
            this.filtreAgence.set(null);
            this.niveau.set('agence');
        } else {
            this.filtreAgence.set(null);
            this.filtreDelegation.set(null);
            this.niveau.set('auto');
        }
        this.mode.set('perimetre');
        this.chargerReseau();
    }

    photographier(): void {
        if (this.reseau()?.photoEnCours) return;
        this.userService
            .lancerPhotoRisque$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.messageService.add({ severity: 'success', summary: 'Photo', detail: (r.data as any)?.message || r.message || 'Photo lancée', life: 7000 });
                    this.reseau.update((d) => (d ? { ...d, photoEnCours: true } : d));
                    // La photo dure quelques minutes : on relit à intervalle tant qu'elle tourne.
                    const relire = () => {
                        if (this.mode() !== 'perimetre') return;
                        this.chargerReseau();
                        if (this.reseau()?.photoEnCours) setTimeout(relire, 20000);
                    };
                    setTimeout(relire, 20000);
                },
                error: (err) => this.messageService.add({ severity: 'warn', summary: 'Photo', detail: err || 'Photo impossible', life: 7000 })
            });
    }

    // ------------------------------------------------------------------ crédits derrière un chiffre

    voirCredits(l: LigneRisque, tranche: TrancheRisque): void {
        if (l.cle.startsWith('F|')) {
            this.messageService.add({ severity: 'info', summary: 'Famille', detail: 'La liste des crédits se lit par type : passez en « Par type » puis cliquez le type voulu.', life: 6000 });
            return;
        }
        const estLigneAgent = l.agentUserId != null || l.nonAffecte;
        const tipCredito = l.tipCredito ?? (estLigneAgent ? (this.filtreProduit()?.tipCredito ?? null) : null);
        const agent = estLigneAgent ? this.cleAgent(l) : this.filtreAgent() ? this.cleAgent(this.filtreAgent()!) : null;
        this.contexte = { tipCredito, agent };
        this.creditsTitre.set(`Crédits — ${l.libelleCourt || l.libelle}` + (this.filtreProduit() && estLigneAgent ? ` · ${this.filtreProduit()!.libelle}` : '') + (this.filtreAgent() && !estLigneAgent ? ` · ${this.filtreAgent()!.libelle}` : ''));
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

    // ------------------------------------------------------------------ familles et seuils

    ouvrirFamilles(): void {
        const source = this.reseau() || this.data();
        this.seuilsEdit = { seuilPar30: source?.seuilPar30 ?? 5, seuilPar90: source?.seuilPar90 ?? 3 };
        this.showFamilles = true;
        this.loadingFamilles.set(true);
        this.userService
            .getFamillesRisque$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.familles.set(((r.data as any)?.familles as FamilleProduit[]) || []);
                    this.loadingFamilles.set(false);
                },
                error: (err) => {
                    this.loadingFamilles.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Familles', detail: err || 'Lecture impossible', life: 6000 });
                }
            });
    }

    enregistrerFamille(f: FamilleProduit): void {
        this.enregistrementEnCours.set(true);
        this.userService
            .enregistrerFamilleRisque$({ tipCredito: f.tipCredito, libelleSaf: f.libelleSaf, famille: f.famille, libelleCourt: f.libelleCourt, seuilPar30: f.seuilPar30 ?? null, seuilPar90: f.seuilPar90 ?? null })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.enregistrementEnCours.set(false);
                    this.messageService.add({ severity: 'success', summary: 'Famille', detail: r.message || 'Enregistré', life: 4000 });
                    this.recharger();
                },
                error: (err) => {
                    this.enregistrementEnCours.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Famille', detail: err || 'Enregistrement impossible', life: 6000 });
                }
            });
    }

    enregistrerSeuils(): void {
        const s30 = this.seuilsEdit.seuilPar30, s90 = this.seuilsEdit.seuilPar90;
        if (s30 === null || s90 === null) {
            this.messageService.add({ severity: 'warn', summary: 'Seuils', detail: 'Les deux seuils sont obligatoires.', life: 4000 });
            return;
        }
        this.enregistrementEnCours.set(true);
        this.userService
            .enregistrerSeuilsRisque$({ seuilPar30: s30, seuilPar90: s90 })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.enregistrementEnCours.set(false);
                    this.messageService.add({ severity: 'success', summary: 'Seuils', detail: r.message || 'Enregistré', life: 4000 });
                    this.recharger();
                },
                error: (err) => {
                    this.enregistrementEnCours.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Seuils', detail: err || 'Enregistrement impossible', life: 6000 });
                }
            });
    }

    // ------------------------------------------------------------------ export

    exporter(): void {
        if (this.mode() === 'perimetre') {
            this.telecharger(this.userService.exportPortefeuilleRisqueReseau$(this.niveau(), this.filtreAgence()?.id ?? null, this.filtreDelegation()?.id ?? null), 'portefeuille_risque_perimetre.xlsx');
            return;
        }
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

    // ------------------------------------------------------------------ utilitaires

    libelleNiveau(n: string): string {
        return n === 'delegation' ? 'Par délégation' : n === 'agence' ? 'Par agence' : 'Par point de service';
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

    private additionner(cible: LigneRisque, autre: LigneRisque): void {
        cible.nbCredits += autre.nbCredits;
        cible.encours += autre.encours;
        cible.nbEnRetard += autre.nbEnRetard;
        cible.impaye += autre.impaye;
        cible.encoursPar30 += autre.encoursPar30;
        cible.nbPar30 += autre.nbPar30;
        cible.encoursPar60 += autre.encoursPar60;
        cible.nbPar60 += autre.nbPar60;
        cible.encoursPar90 += autre.encoursPar90;
        cible.nbPar90 += autre.nbPar90;
        cible.encoursPar120 += autre.encoursPar120;
        cible.nbPar120 += autre.nbPar120;
        cible.nbContentieuxDeclares += autre.nbContentieuxDeclares;
    }

    private figerTaux(l: LigneRisque): void {
        l.tauxPar30 = l.encours ? Math.round((l.encoursPar30 / l.encours) * 10000) / 100 : 0;
        l.tauxPar60 = l.encours ? Math.round((l.encoursPar60 / l.encours) * 10000) / 100 : 0;
        l.tauxPar90 = l.encours ? Math.round((l.encoursPar90 / l.encours) * 10000) / 100 : 0;
        l.tauxPar120 = l.encours ? Math.round((l.encoursPar120 / l.encours) * 10000) / 100 : 0;
    }
}
