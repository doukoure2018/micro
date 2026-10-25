import { EtatDuJour, TravailDuJour } from '@/interface/etat-du-jour';
import { IResponse } from '@/interface/response';
import { ExecutionAlerte, ResumeSemaine, UsageSemaine } from '@/interface/usage-plateforme';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

/**
 * Baromètre d'usage de digi (V175, lot 1). Sept familles d'indicateurs comptées par la
 * plateforme elle-même sur une semaine : adoption, couverture, activité crédit, fluidité du
 * circuit, suivi du portefeuille, alertes du portefeuille, qualité des données.
 *
 * DG, DE, DSIG et SUPER_ADMIN voient le réseau ; le DR voit sa délégation, sans les montants.
 */
@Component({
    selector: 'app-usage-plateforme',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, ChartModule, TableModule, TagModule, ToastModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>

        <!-- Etat du jour (lot 3) : « est-ce que ca tourne ? », avant le barometre de la semaine -->
        <div class="card" *ngIf="etat() as e">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                    <h2 class="text-xl font-semibold m-0">État du jour</h2>
                    <div class="text-sm text-gray-500">
                        {{ e.jour | date: 'EEEE d MMMM y' }}, relevé à {{ e.heure }} GMT.
                        <span *ngIf="e.saf.mention"> — {{ e.saf.mention }}.</span>
                    </div>
                </div>
                <button pButton icon="pi pi-refresh" class="p-button-text" (click)="chargerEtat()" [loading]="chargementEtat()" pTooltip="Recharger l'état du jour"></button>
            </div>

            <!-- Ce qui ne va pas, en premier -->
            <div *ngIf="e.travauxManquants || e.travauxEnEchec || e.envoisDoublons || !e.saf.joignable"
                 class="border border-red-400 bg-red-50 text-red-900 rounded p-3 mb-3">
                <div class="font-semibold mb-1">À regarder</div>
                <ul class="m-0 pl-5 text-sm">
                    <li *ngIf="e.travauxEnEchec">{{ e.travauxEnEchec }} traitement(s) en échec aujourd'hui.</li>
                    <li *ngIf="e.travauxManquants">{{ e.travauxManquants }} traitement(s) attendu(s) n'ont pas tourné.</li>
                    <li *ngIf="e.envoisDoublons">{{ e.envoisDoublons }} courriel(s) partis deux fois vers la même adresse.</li>
                    <li *ngIf="!e.saf.joignable">SAF n'est pas joignable<ng-container *ngIf="e.saf.enRestauration"> : restauration en cours</ng-container>.</li>
                </ul>
            </div>
            <div *ngIf="!e.travauxManquants && !e.travauxEnEchec && !e.envoisDoublons && e.saf.joignable"
                 class="border border-green-400 bg-green-50 text-green-900 rounded p-3 mb-3 text-sm">
                Tous les traitements attendus ont tourné, aucun courriel n'est parti deux fois, SAF répond.
            </div>

            <!-- Les travaux -->
            <h3 class="text-base font-semibold mb-2">Traitements</h3>
            <p-table [value]="e.travaux" styleClass="p-datatable-sm mb-4">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Traitement</th>
                        <th>Attendu</th>
                        <th>État</th>
                        <th>Dernier passage</th>
                        <th>Détail</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-t>
                    <tr>
                        <td>{{ t.libelle }}</td>
                        <td class="text-sm text-gray-500">{{ t.attendu }}</td>
                        <td>
                            <p-tag [value]="libelleEtatTravail(t)" [severity]="severiteTravail(t.etat)"></p-tag>
                        </td>
                        <td class="text-sm">
                            <ng-container *ngIf="t.quand">{{ t.quand | date: 'HH:mm' }}
                                <span class="text-gray-500" *ngIf="t.dureeMs"> ({{ t.dureeMs }} ms)</span>
                            </ng-container>
                            <ng-container *ngIf="!t.quand">
                                <span class="text-gray-500" *ngIf="t.dernierConnu">le {{ t.dernierConnu | date: 'dd/MM à HH:mm' }}</span>
                                <span class="text-gray-400" *ngIf="!t.dernierConnu">jamais</span>
                            </ng-container>
                        </td>
                        <td class="text-sm text-gray-600">{{ t.message || '—' }}</td>
                    </tr>
                </ng-template>
            </p-table>

            <!-- Les envois -->
            <h3 class="text-base font-semibold mb-2">Courriels partis aujourd'hui</h3>
            <p-table [value]="e.envois" styleClass="p-datatable-sm mb-4" *ngIf="e.envois.length">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Type</th>
                        <th class="text-right">Envois</th>
                        <th class="text-right">Destinataires</th>
                        <th class="text-right">Objets</th>
                        <th class="text-right">Doublons</th>
                        <th>Plage</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-v>
                    <tr [ngClass]="{ 'bg-red-50': v.anormal }">
                        <td>{{ v.libelle }}</td>
                        <td class="text-right">{{ v.envois }}</td>
                        <td class="text-right">{{ v.destinataires }}</td>
                        <td class="text-right">{{ v.sujets }}</td>
                        <td class="text-right" [ngClass]="{ 'text-red-700 font-bold': v.anormal }">{{ v.doublons }}</td>
                        <td class="text-sm text-gray-500">{{ v.premier | date: 'HH:mm' }} → {{ v.dernier | date: 'HH:mm' }}</td>
                    </tr>
                </ng-template>
            </p-table>
            <div class="text-sm text-gray-500 mb-4" *ngIf="!e.envois.length">Aucun courriel n'est parti aujourd'hui.</div>

            <!-- Anomalies et flux -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Crédits négatifs ouverts</div>
                    <div class="text-2xl font-bold">{{ e.anomalies.creditsNegatifsOuverts }}</div>
                    <div class="text-xs text-gray-500">{{ e.anomalies.creditsNegatifsDuJour }} relevé(s) aujourd'hui</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Adresses en échec</div>
                    <div class="text-2xl font-bold">{{ e.anomalies.contactsEnEchec }}</div>
                    <div class="text-xs text-gray-500">comptes à corriger</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Corrections en attente</div>
                    <div class="text-2xl font-bold">{{ e.anomalies.correctionsEnAttente | number: '1.0-0' }}</div>
                    <div class="text-xs text-gray-500">fiches personne physique</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Dossiers sans titulaire</div>
                    <div class="text-2xl font-bold">{{ e.anomalies.dossiersSansTitulaire }}</div>
                    <div class="text-xs text-gray-500">agent désactivé</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Dossiers en cours</div>
                    <div class="text-2xl font-bold">{{ e.credit.enCours | number: '1.0-0' }}</div>
                    <div class="text-xs text-gray-500">{{ e.credit.enAttenteDa }} chez le DA, {{ e.credit.enCorrection }} en correction</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Créés aujourd'hui</div>
                    <div class="text-2xl font-bold">{{ e.credit.creesAujourdhui }}</div>
                    <div class="text-xs text-gray-500">{{ e.credit.validesAujourdhui }} validés en dernière instance</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Connexions du jour</div>
                    <div class="text-2xl font-bold">{{ e.connexions }}</div>
                    <div class="text-xs text-gray-500">comptes connectés</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Annulations demandées</div>
                    <div class="text-2xl font-bold">{{ e.credit.annulationsDemandees }}</div>
                    <div class="text-xs text-gray-500">en attente du DA</div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                    <h2 class="text-xl font-semibold m-0">Usage de la plateforme</h2>
                    <div class="text-sm text-gray-500">
                        Ces chiffres sont comptés par la plateforme elle-même, au fil du travail de chaque jour.
                        Personne n'a rien à saisir en plus, et rien n'est déclaré à la main.
                        <span *ngIf="data() as d"> — {{ d.libellePeriode }}, {{ d.perimetre }}.</span>
                    </div>
                </div>
                <div class="flex flex-wrap gap-2 items-center">
                    <button pButton icon="pi pi-angle-left" class="p-button-text" (click)="decaler(-7)" pTooltip="Semaine précédente"></button>
                    <span class="text-sm font-medium" *ngIf="data() as d">{{ d.debut | date: 'dd/MM' }} → {{ d.fin | date: 'dd/MM/yyyy' }}</span>
                    <button pButton icon="pi pi-angle-right" class="p-button-text" (click)="decaler(7)" [disabled]="estSemaineCourante()" pTooltip="Semaine suivante"></button>
                    <button pButton icon="pi pi-refresh" class="p-button-text" (click)="charger()" [loading]="loading()" pTooltip="Recharger"></button>
                    <button pButton icon="pi pi-file-excel" label="Exporter Excel" class="p-button-success p-button-outlined" [loading]="exportEnCours()" [disabled]="!data()" (click)="exporter()"></button>
                </div>
            </div>

            <div *ngIf="data()?.avertissement as av" class="border border-orange-400 bg-orange-50 text-orange-800 rounded p-3 mb-3 flex items-start gap-2">
                <i class="pi pi-info-circle mt-1"></i><div>{{ av }}</div>
            </div>

            <ng-container *ngIf="data() as d">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div class="border rounded p-3">
                        <div class="text-xs text-gray-500 uppercase">Connexions</div>
                        <div class="text-2xl font-bold">{{ d.connexions | number: '1.0-0' }}</div>
                        <div class="text-xs text-gray-500">{{ d.utilisateursActifs }} utilisateurs distincts {{ evolution(d.connexions, d.precedente?.connexions) }}</div>
                    </div>
                    <div class="border rounded p-3">
                        <div class="text-xs text-gray-500 uppercase">Agents de crédit actifs</div>
                        <div class="text-2xl font-bold">{{ d.agentsActifs }} / {{ d.agentsComptes }}</div>
                        <div class="text-xs text-gray-500">{{ part(d.agentsActifs, d.agentsComptes) }} % des agents du périmètre</div>
                    </div>
                    <div class="border rounded p-3">
                        <div class="text-xs text-gray-500 uppercase">Dossiers créés</div>
                        <div class="text-2xl font-bold">{{ d.dossiersCrees | number: '1.0-0' }}</div>
                        <div class="text-xs text-gray-500">{{ d.dossiersValides }} validés en dernière instance {{ evolution(d.dossiersCrees, d.precedente?.dossiersCrees) }}</div>
                    </div>
                    <div class="border rounded p-3">
                        <div class="text-xs text-gray-500 uppercase">Points de service producteurs</div>
                        <div class="text-2xl font-bold">{{ d.psProducteurs }} / {{ d.psTotal }}</div>
                        <div class="text-xs text-gray-500">ont créé au moins un dossier</div>
                    </div>
                </div>

                <h3 class="text-base font-semibold mt-4 mb-2">Adoption</h3>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-2">
                    <div class="border rounded p-3">
                        <div class="text-sm font-medium mb-1">Connexions et utilisateurs par jour</div>
                        <p-chart type="bar" [data]="graphJours()" [options]="optionsDeuxAxes" height="230px"></p-chart>
                    </div>
                    <div class="border rounded p-3">
                        <div class="text-sm font-medium mb-1">Comptes actifs dans la semaine, par rôle</div>
                        <p-chart type="bar" [data]="graphRoles()" [options]="optionsHorizontal" height="230px"></p-chart>
                    </div>
                </div>
                <div class="text-sm text-gray-500 mb-4" *ngIf="d.jamaisConnectes">
                    {{ d.jamaisConnectes }} compte(s) actif(s) n'ont jamais ouvert de session.
                </div>

                <h3 class="text-base font-semibold mt-4 mb-2">Par délégation</h3>
                <p-table [value]="d.delegations" styleClass="p-datatable-sm" [scrollable]="true">
                    <ng-template pTemplate="header">
                        <tr>
                            <th>Délégation</th>
                            <th class="text-right">Comptes</th>
                            <th class="text-right">Actifs</th>
                            <th class="text-right">Part</th>
                            <th class="text-right">Connexions</th>
                            <th class="text-right">Dossiers créés</th>
                            <th class="text-right">Validés</th>
                            <th class="text-right">PS producteurs</th>
                            <th class="text-right">Affectations</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-g>
                        <tr>
                            <td class="font-medium">{{ g.libelle }}</td>
                            <td class="text-right">{{ g.comptes }}</td>
                            <td class="text-right">{{ g.actifs }}</td>
                            <td class="text-right" [class.text-red-600]="g.partActifs < 65" [class.text-green-700]="g.partActifs >= 80">{{ g.partActifs }} %</td>
                            <td class="text-right">{{ g.connexions | number: '1.0-0' }}</td>
                            <td class="text-right">{{ g.dossiersCrees | number: '1.0-0' }}</td>
                            <td class="text-right">{{ g.dossiersValides | number: '1.0-0' }}</td>
                            <td class="text-right" [class.text-red-600]="g.psTotal > 0 && g.psProducteurs * 2 < g.psTotal">{{ g.psProducteurs }} / {{ g.psTotal }}</td>
                            <td class="text-right">{{ g.affectations | number: '1.0-0' }}</td>
                        </tr>
                    </ng-template>
                </p-table>

                <h3 class="text-base font-semibold mt-5 mb-2">Activité crédit et circuit</h3>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div class="border rounded p-3">
                        <div class="text-sm font-medium mb-1">Dossiers créés par jour, par nature</div>
                        <p-chart type="bar" [data]="graphDossiers()" [options]="optionsEmpile" height="230px"></p-chart>
                    </div>
                    <div class="border rounded p-3">
                        <table class="w-full text-sm">
                            <tr class="border-b"><td class="py-1 text-gray-500">Dossiers créés</td><td class="py-1 text-right font-medium">{{ d.dossiersCrees | number: '1.0-0' }}</td></tr>
                            <tr class="border-b"><td class="py-1 text-gray-500">dont crédits de groupe</td><td class="py-1 text-right">{{ d.dossiersGroupe }}</td></tr>
                            <tr class="border-b"><td class="py-1 text-gray-500">dont crédits fonctionnaire</td><td class="py-1 text-right">{{ d.dossiersFonctionnaire }}</td></tr>
                            <tr class="border-b"><td class="py-1 text-gray-500">Validés en dernière instance</td><td class="py-1 text-right font-medium">{{ d.dossiersValides | number: '1.0-0' }}</td></tr>
                            <tr class="border-b" *ngIf="d.montantValide !== null"><td class="py-1 text-gray-500">Montant validé</td><td class="py-1 text-right font-medium">{{ d.montantValide | number: '1.0-0' }} GNF</td></tr>
                            <tr class="border-b"><td class="py-1 text-gray-500">Délai médian création → validation</td><td class="py-1 text-right">{{ d.delaiMedianJours ?? '—' }} j</td></tr>
                            <tr class="border-b"><td class="py-1 text-gray-500">Événements du circuit</td><td class="py-1 text-right">{{ d.evenements | number: '1.0-0' }} par {{ d.acteurs }} acteurs</td></tr>
                            <tr><td class="py-1 text-gray-500">Rejets · annulations · réattributions</td><td class="py-1 text-right">{{ d.rejets }} · {{ d.annulations }} · {{ d.reattributions }}</td></tr>
                        </table>
                    </div>
                </div>

                <h3 class="text-base font-semibold mt-5 mb-2">Suivi du portefeuille</h3>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div class="border rounded p-3">
                        <div class="text-sm font-medium mb-1">Agents notés par le calcul nocturne</div>
                        <p-chart type="line" [data]="graphScores()" [options]="optionsSimple" height="220px"></p-chart>
                    </div>
                    <div class="border rounded p-3">
                        <table class="w-full text-sm">
                            <tr class="border-b"><td class="py-1 text-gray-500">Affectations faites dans la semaine</td><td class="py-1 text-right font-medium">{{ d.affectations | number: '1.0-0' }}</td></tr>
                            <tr class="border-b"><td class="py-1 text-gray-500">Directeurs d'agence ayant affecté</td><td class="py-1 text-right">{{ d.daAyantAffecte }}</td></tr>
                            <tr class="border-b"><td class="py-1 text-gray-500">Affectations closes</td><td class="py-1 text-right">{{ d.affectationsCloses }}</td></tr>
                            <tr class="border-b"><td class="py-1 text-gray-500">Crédits affectés au terme de la semaine</td><td class="py-1 text-right font-medium">{{ d.affectationsActives | number: '1.0-0' }}</td></tr>
                            <tr class="border-b"><td class="py-1 text-gray-500">Agents porteurs d'un portefeuille</td><td class="py-1 text-right">{{ d.agentsPorteurs }}</td></tr>
                            <tr><td class="py-1 text-gray-500">Agents notés</td><td class="py-1 text-right">{{ d.agentsNotes }}</td></tr>
                        </table>
                    </div>
                </div>

                <h3 class="text-base font-semibold mt-5 mb-2">Alertes du portefeuille</h3>
                <div class="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
                    <div class="border rounded p-2"><div class="text-xs text-gray-500 uppercase">Digests aux agents</div><div class="text-xl font-bold">{{ d.alertesAgents }}</div></div>
                    <div class="border rounded p-2"><div class="text-xs text-gray-500 uppercase">Synthèses aux DA</div><div class="text-xl font-bold">{{ d.alertesDa }}</div></div>
                    <div class="border rounded p-2"><div class="text-xs text-gray-500 uppercase">Synthèses aux DR</div><div class="text-xl font-bold">{{ d.alertesDr }}</div></div>
                    <div class="border rounded p-2"><div class="text-xs text-gray-500 uppercase">Alertes techniques</div><div class="text-xl font-bold">{{ d.alertesTechniques }}</div></div>
                    <div class="border rounded p-2"><div class="text-xs text-gray-500 uppercase">Jours avec digest</div><div class="text-xl font-bold" [class.text-red-600]="d.joursAvecDigest === 0">{{ d.joursAvecDigest }}</div></div>
                </div>
                <p-table [value]="d.executions" styleClass="p-datatable-sm" *ngIf="d.executions.length">
                    <ng-template pTemplate="header">
                        <tr>
                            <th>Jour</th><th>Heure</th><th>Tâche</th><th>Résultat</th>
                            <th class="text-right">Échéances</th><th class="text-right">Impayés</th>
                            <th class="text-right">Agents</th><th class="text-right">DA</th><th class="text-right">DR</th>
                            <th>Précision</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-e>
                        <tr>
                            <td>{{ e.jour | date: 'EEE dd/MM' }}</td>
                            <td>{{ e.heure }}</td>
                            <td>{{ libelleJob(e) }}</td>
                            <td><p-tag [value]="e.statut === 'SUCCES' ? 'Envoyé' : 'Échec'" [severity]="e.statut === 'SUCCES' ? 'success' : 'danger'"></p-tag></td>
                            <td class="text-right">{{ e.nbEcheances ?? '—' }}</td>
                            <td class="text-right">{{ e.nbImpayes ?? '—' }}</td>
                            <td class="text-right">{{ e.nbAgents ?? '—' }}</td>
                            <td class="text-right">{{ e.nbDa ?? '—' }}</td>
                            <td class="text-right">{{ e.nbDr ?? '—' }}</td>
                            <td class="text-xs text-gray-500">{{ e.message || '' }}</td>
                        </tr>
                    </ng-template>
                </p-table>
                <div class="text-sm text-gray-500" *ngIf="!d.executions.length">
                    Aucun passage du planificateur enregistré sur cette semaine.
                </div>

                <h3 class="text-base font-semibold mt-5 mb-2">Qualité des données</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div class="border rounded p-2"><div class="text-xs text-gray-500 uppercase">Fiches corrigées</div><div class="text-xl font-bold">{{ d.fichesCorrigees | number: '1.0-0' }}</div></div>
                    <div class="border rounded p-2"><div class="text-xs text-gray-500 uppercase">Corrections annulées</div><div class="text-xl font-bold">{{ d.correctionsAnnulees }}</div></div>
                    <div class="border rounded p-2"><div class="text-xs text-gray-500 uppercase">Changements de téléphone</div><div class="text-xl font-bold">{{ d.telephonesDemandes }}</div></div>
                    <div class="border rounded p-2"><div class="text-xs text-gray-500 uppercase">Signalements de numéro</div><div class="text-xl font-bold">{{ d.signalements }}</div></div>
                </div>

                <h3 class="text-base font-semibold mt-5 mb-2">Tendance des dernières semaines</h3>
                <div class="border rounded p-3" *ngIf="tendance().length > 1; else pasDeTendance">
                    <p-chart type="bar" [data]="graphTendance()" [options]="optionsDeuxAxes" height="240px"></p-chart>
                    <div class="text-xs text-gray-500 mt-2">
                        Chaque semaine est figée dans la nuit du dimanche au lundi : les chiffres du passé ne bougent plus,
                        même si une fiche est corrigée ou un dossier annulé après coup.
                    </div>
                </div>
                <ng-template #pasDeTendance>
                    <div class="text-sm text-gray-500">La tendance apparaîtra dès que deux semaines auront été figées.</div>
                </ng-template>

                <div class="text-sm text-gray-500 mt-5" *ngIf="d.precedente as pr">
                    Semaine précédente ({{ pr.debut | date: 'dd/MM' }} → {{ pr.fin | date: 'dd/MM' }}) :
                    {{ pr.connexions | number: '1.0-0' }} connexions, {{ pr.agentsActifs }} agents actifs,
                    {{ pr.dossiersCrees | number: '1.0-0' }} dossiers créés, {{ pr.dossiersValides | number: '1.0-0' }} validés,
                    {{ pr.psProducteurs }} points de service producteurs.
                </div>
            </ng-container>

            <div *ngIf="!data() && !loading()" class="text-gray-500">Aucune donnée pour cette semaine.</div>
        </div>
    `
})
export class UsagePlateformeComponent implements OnInit {
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

    data = signal<UsageSemaine | null>(null);
    tendance = signal<ResumeSemaine[]>([]);
    /** Lot 3 : l'etat du jour, affiche au-dessus du barometre. */
    etat = signal<EtatDuJour | null>(null);
    chargementEtat = signal(false);
    loading = signal(false);
    exportEnCours = signal(false);
    jour = signal<string | undefined>(undefined);

    private readonly VERT = '#1E6B4F';
    private readonly VERT_CLAIR = '#8FC4AC';
    private readonly BLEU = '#2F5D8A';
    private readonly OR = '#8A6D20';

    optionsSimple: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
    };
    optionsEmpile: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 10 } } },
        scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, beginAtZero: true } }
    };
    optionsHorizontal: any = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 10 } } },
        scales: { x: { beginAtZero: true, grid: { display: false } }, y: { grid: { display: false } } }
    };
    optionsDeuxAxes: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 10 } } },
        scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true, position: 'left' },
            y2: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false } }
        }
    };

    ngOnInit(): void {
        this.chargerEtat();
        this.charger();
        this.chargerTendance();
    }

    /**
     * L'etat du jour. En cas d'echec, le bandeau reste absent sans message : le barometre
     * en dessous doit rester lisible meme si la supervision n'est pas accessible au compte.
     */
    chargerEtat(): void {
        this.chargementEtat.set(true);
        this.userService
            .getEtatDuJour$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res: IResponse) => {
                    this.etat.set(((res.data as any)?.etat ?? null) as EtatDuJour | null);
                    this.chargementEtat.set(false);
                },
                error: () => {
                    this.etat.set(null);
                    this.chargementEtat.set(false);
                }
            });
    }

    libelleEtatTravail(t: TravailDuJour): string {
        switch (t.etat) {
            case 'FAIT':
                return t.executions > 1 ? t.executions + ' passages' : 'Fait';
            case 'INCOMPLET':
                return (t.passagesFaits ?? 0) + ' sur ' + (t.passagesAttendus ?? 0);
            case 'ECHEC':
                return 'En échec';
            case 'MANQUANT':
                return "N'a pas tourné";
            case 'A_VENIR':
                return 'À venir';
            case 'PAS_ATTENDU':
                return 'Pas attendu aujourd’hui';
            default:
                return t.etat;
        }
    }

    severiteTravail(etat: string): 'success' | 'warn' | 'danger' | 'info' | 'secondary' {
        switch (etat) {
            case 'FAIT':
                return 'success';
            case 'INCOMPLET':
                return 'warn';
            case 'ECHEC':
            case 'MANQUANT':
                return 'danger';
            case 'A_VENIR':
                return 'info';
            default:
                return 'secondary';
        }
    }

    chargerTendance(): void {
        this.userService
            .getTendanceUsage$(12)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res: IResponse) => this.tendance.set((res.data as any)?.tendance ?? []),
                error: () => this.tendance.set([])
            });
    }

    charger(): void {
        this.loading.set(true);
        this.userService
            .getUsagePlateforme$(this.jour())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res: IResponse) => {
                    this.data.set((res.data as any)?.usage ?? null);
                    this.loading.set(false);
                },
                error: (err: any) => {
                    this.loading.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Chargement', detail: err?.message || 'Lecture impossible' });
                }
            });
    }

    decaler(jours: number): void {
        const d = this.data();
        const base = d ? new Date(d.debut) : new Date();
        base.setDate(base.getDate() + jours);
        this.jour.set(base.toISOString().slice(0, 10));
        this.charger();
    }

    estSemaineCourante(): boolean {
        const d = this.data();
        if (!d) return true;
        const fin = new Date(d.fin);
        const aujourdhui = new Date();
        return fin >= new Date(aujourdhui.getFullYear(), aujourdhui.getMonth(), aujourdhui.getDate());
    }

    exporter(): void {
        this.exportEnCours.set(true);
        this.userService
            .exportUsagePlateforme$(this.jour())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res: HttpResponse<Blob>) => {
                    this.exportEnCours.set(false);
                    const blob = res.body;
                    if (!blob) return;
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `Usage_digi_${this.data()?.debut ?? ''}.xlsx`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                },
                error: () => {
                    this.exportEnCours.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Export', detail: 'Export impossible' });
                }
            });
    }

    graphJours(): any {
        const d = this.data();
        if (!d) return { labels: [], datasets: [] };
        return {
            labels: d.jours.map((j) => j.libelle),
            datasets: [
                { type: 'bar', label: 'Connexions', data: d.jours.map((j) => j.connexions), backgroundColor: this.VERT_CLAIR, yAxisID: 'y' },
                { type: 'line', label: 'Utilisateurs', data: d.jours.map((j) => j.utilisateurs), borderColor: this.VERT, backgroundColor: this.VERT, tension: 0.25, yAxisID: 'y2' }
            ]
        };
    }

    graphRoles(): any {
        const d = this.data();
        if (!d) return { labels: [], datasets: [] };
        const roles = d.roles.filter((r) => r.comptes > 0).slice(0, 7);
        return {
            labels: roles.map((r) => r.libelle || r.role),
            datasets: [
                { label: 'Actifs', data: roles.map((r) => r.actifs), backgroundColor: this.VERT },
                { label: 'Comptes', data: roles.map((r) => r.comptes), backgroundColor: '#DCE3DC' }
            ]
        };
    }

    graphDossiers(): any {
        const d = this.data();
        if (!d) return { labels: [], datasets: [] };
        return {
            labels: d.jours.map((j) => j.libelle),
            datasets: [
                { label: 'Individuels', data: d.jours.map((j) => j.dossiersIndividuels), backgroundColor: this.VERT_CLAIR },
                { label: 'Fonctionnaires', data: d.jours.map((j) => j.dossiersFonctionnaire), backgroundColor: this.BLEU },
                { label: 'Groupes', data: d.jours.map((j) => j.dossiersGroupe), backgroundColor: this.OR }
            ]
        };
    }

    graphTendance(): any {
        const t = this.tendance();
        const etiquette = (r: ResumeSemaine) => {
            const d = new Date(r.debut);
            return `${d.getDate()}/${d.getMonth() + 1}`;
        };
        return {
            labels: t.map(etiquette),
            datasets: [
                { type: 'bar', label: 'Dossiers créés', data: t.map((r) => r.dossiersCrees), backgroundColor: this.VERT_CLAIR, yAxisID: 'y' },
                { type: 'bar', label: 'Validés', data: t.map((r) => r.dossiersValides), backgroundColor: this.VERT, yAxisID: 'y' },
                { type: 'line', label: 'Agents actifs', data: t.map((r) => r.agentsActifs), borderColor: this.OR, backgroundColor: this.OR, tension: 0.25, yAxisID: 'y2' }
            ]
        };
    }

    graphScores(): any {
        const d = this.data();
        if (!d) return { labels: [], datasets: [] };
        return {
            labels: d.jours.map((j) => j.libelle),
            datasets: [{ label: 'Agents notés', data: d.jours.map((j) => j.agentsNotes), borderColor: this.VERT, backgroundColor: this.VERT, tension: 0.25, fill: false }]
        };
    }

    part(n: number, total: number): number {
        return total ? Math.round((100 * n) / total) : 0;
    }

    evolution(valeur: number, precedente?: number | null): string {
        if (precedente === undefined || precedente === null || precedente === 0) return '';
        const ecart = Math.round((100 * (valeur - precedente)) / precedente);
        if (ecart === 0) return '(stable)';
        return ecart > 0 ? `(+${ecart} % sur la semaine précédente)` : `(${ecart} % sur la semaine précédente)`;
    }

    libelleJob(e: ExecutionAlerte): string {
        switch (e.job) {
            case 'DIGEST_QUOTIDIEN':
                return 'Digest du matin' + (e.tentative > 1 ? ` (reprise ${e.tentative})` : '');
            case 'SYNTHESE_HEBDO':
                return 'Synthèse hebdomadaire';
            case 'SAF_SANTE':
                return 'Surveillance SAF';
            default:
                return e.job;
        }
    }
}
