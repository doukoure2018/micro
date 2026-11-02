import { DelegationSynthese, SemaineSynthese, Synthese } from '@/interface/synthese-direction';
import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

/**
 * Page « Synthèse de direction » (V198, lot 3).
 *
 * Elle sert à trois choses : relire la synthèse telle qu'elle partira lundi, consulter celles
 * déjà envoyées — ce qui a été annoncé à la direction un lundi donné, et non ce que les données
 * diraient aujourd'hui — et déclencher un envoi, d'essai ou réel.
 *
 * Un chiffre non mesurable est affiché comme tel et jamais remplacé par zéro, exactement comme
 * dans le courriel : c'est ce qui rend la synthèse croyable.
 */
@Component({
    selector: 'app-synthese-direction',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, ConfirmDialogModule, TableModule, TabsModule, TagModule, ToastModule, TooltipModule],
    providers: [MessageService, ConfirmationService],
    template: `
        <p-toast></p-toast>
        <p-confirmDialog></p-confirmDialog>
        <div class="card">
            <div class="flex flex-wrap justify-between items-center gap-3 mb-2">
                <h2 class="text-xl font-bold m-0">Synthèse hebdomadaire de direction</h2>
                <div class="flex items-center gap-2">
                    <button pButton icon="pi pi-refresh" class="p-button-text" (click)="charger()" [loading]="loading()"></button>
                    <button pButton icon="pi pi-envelope" label="Envoyer un essai" class="p-button-outlined" [loading]="envoi()" (click)="essai()" pTooltip="À vous seul"></button>
                    <button pButton icon="pi pi-send" label="Envoyer à la direction" class="p-button-danger p-button-outlined" [loading]="envoi()" (click)="envoyer()"></button>
                </div>
            </div>
            <p class="text-sm text-gray-500 mb-3">
                Le courriel part seul le lundi à 08 h 50 GMT, aux porteurs de la rubrique — le Directeur Général, la Direction de l'Exploitation, le
                responsable de la DSIG et l'équipe opérationnelle. Tout est calculé sur les données de la plateforme : rien ne dépend de SAF à l'heure de
                l'envoi, hormis les octrois de la semaine.
            </p>

            @if (s(); as x) {
            <div class="border rounded p-3 mb-4 bg-gray-50">
                <span class="font-semibold">Semaine du {{ x.semaineDu | date: 'dd/MM/yyyy' }} au {{ x.semaineAu | date: 'dd/MM/yyyy' }}</span>
                <span class="text-sm text-gray-500" *ngIf="x.pfDatePhoto"> · portefeuille au {{ x.pfDatePhoto | date: 'dd/MM/yyyy' }}</span>
                <span class="text-sm text-gray-500" *ngIf="!precedente()"> · première synthèse : les variations apparaîtront la semaine prochaine</span>
                <span class="text-sm text-gray-500" *ngIf="x.envoyeAt"> · envoyée le {{ x.envoyeAt | date: 'dd/MM/yyyy à HH:mm' }} à {{ x.nbDestinataires }} destinataire(s)</span>
            </div>

            <p-tabs value="0">
                <p-tablist>
                    <p-tab value="0">La semaine</p-tab>
                    <p-tab value="1">Par délégation</p-tab>
                    <p-tab value="2">Semaines envoyées</p-tab>
                </p-tablist>
                <p-tabpanels>
                    <p-tabpanel value="0">
                        <p-table [value]="blocs()" styleClass="p-datatable-sm" [tableStyle]="{ 'min-width': '32rem' }">
                            <ng-template pTemplate="header">
                                <tr>
                                    <th>Indicateur</th>
                                    <th class="text-right">Cette semaine</th>
                                    <th class="text-right">Semaine précédente</th>
                                    <th class="text-right">Variation</th>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-l>
                                <tr [class.bg-gray-50]="l.titre">
                                    <td [class.font-bold]="l.titre" [class.text-green-800]="l.titre">{{ l.libelle }}</td>
                                    <td class="text-right font-semibold" *ngIf="!l.titre">{{ l.valeur }}</td>
                                    <td class="text-right text-gray-500" *ngIf="!l.titre">{{ l.precedent }}</td>
                                    <td class="text-right" *ngIf="!l.titre" [class.text-red-600]="l.mauvais" [class.text-green-700]="l.bon">{{ l.variation }}</td>
                                    <td colspan="3" *ngIf="l.titre"></td>
                                </tr>
                            </ng-template>
                        </p-table>
                        <p class="text-xs text-gray-500 mt-2">
                            Le flux hebdomadaire des refus n'est pas mesurable : les sorties de dossiers empruntent une voie que la plateforme ne
                            journalise pas. L'assainissement est daté par la dernière modification de la fiche, faute de date de changement de statut.
                        </p>
                    </p-tabpanel>

                    <p-tabpanel value="1">
                        <p class="text-sm text-gray-500 mb-2">
                            Une synthèse nationale dit qu'un indicateur se dégrade ; ce détail dit où. La somme des délégations retombe exactement sur le
                            national.
                        </p>
                        <p-table [value]="delegations()" styleClass="p-datatable-sm" responsiveLayout="scroll">
                            <ng-template pTemplate="header">
                                <tr>
                                    <th>Délégation</th>
                                    <th class="text-right">En instruction</th>
                                    <th class="text-right">Accordés</th>
                                    <th class="text-right">Crédits</th>
                                    <th class="text-right">Encours</th>
                                    <th class="text-right">PAR 30 j</th>
                                    <th class="text-right">PAR 90 j</th>
                                    <th class="text-right">Fiches en attente</th>
                                    <th class="text-right">Arrêtés en retard</th>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-d>
                                <tr>
                                    <td>{{ d.delegation }}</td>
                                    <td class="text-right">{{ nb(d.demInstruction) }}</td>
                                    <td class="text-right">{{ nb(d.demAccordesSemaine) }}</td>
                                    <td class="text-right">{{ nb(d.pfCredits) }}</td>
                                    <td class="text-right">{{ md(d.pfEncours) }}</td>
                                    <td class="text-right" [class.text-red-600]="taux(d.par30Encours, d.pfEncours) > 5">{{ pct(d.par30Encours, d.pfEncours) }}</td>
                                    <td class="text-right" [class.text-red-600]="taux(d.par90Encours, d.pfEncours) > 3">{{ pct(d.par90Encours, d.pfEncours) }}</td>
                                    <td class="text-right">{{ nb(d.assEnAttente) }}</td>
                                    <td class="text-right" [class.text-red-600]="(d.arrEnRetard || 0) > 0">{{ nb(d.arrEnRetard) }}</td>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="emptymessage">
                                <tr>
                                    <td colspan="9" class="text-center text-gray-500 py-4">Aucun détail par délégation pour cette semaine.</td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </p-tabpanel>

                    <p-tabpanel value="2">
                        <p class="text-sm text-gray-500 mb-2">
                            Ce qui a été annoncé à la direction chaque lundi, tel qu'il est parti — et non ce que les données diraient aujourd'hui.
                        </p>
                        <p-table [value]="historique()" styleClass="p-datatable-sm" responsiveLayout="scroll">
                            <ng-template pTemplate="header">
                                <tr>
                                    <th>Semaine</th>
                                    <th class="text-right">Accordés</th>
                                    <th class="text-right">Encours</th>
                                    <th class="text-right">PAR 30 j</th>
                                    <th class="text-right">Fiches validées</th>
                                    <th class="text-right">Arrêtés en retard</th>
                                    <th>Envoyée</th>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-h>
                                <tr>
                                    <td>du {{ h.semaineDu | date: 'dd/MM' }} au {{ h.semaineAu | date: 'dd/MM/yyyy' }}</td>
                                    <td class="text-right">{{ nb(h.demAccordesSemaine) }}</td>
                                    <td class="text-right">{{ md(h.pfEncours) }}</td>
                                    <td class="text-right">{{ pct(h.par30Encours, h.pfEncours) }}</td>
                                    <td class="text-right">{{ nb(h.assValideSemaine) }}</td>
                                    <td class="text-right">{{ nb(h.arrEnRetard) }}</td>
                                    <td class="text-sm text-gray-500">
                                        {{ h.envoyeAt | date: 'dd/MM à HH:mm' }}
                                        <span *ngIf="h.nbDestinataires"> · {{ h.nbDestinataires }} destinataire(s)</span>
                                    </td>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="emptymessage">
                                <tr>
                                    <td colspan="7" class="text-center text-gray-500 py-4">Aucune synthèse envoyée pour l'instant.</td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </p-tabpanel>
                </p-tabpanels>
            </p-tabs>
            }
        </div>
    `
})
export class SyntheseDirectionComponent implements OnInit {
    private readonly userService = inject(UserService);
    private readonly messageService = inject(MessageService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly destroyRef = inject(DestroyRef);

    readonly s = signal<SemaineSynthese | null>(null);
    readonly precedente = signal<SemaineSynthese | null>(null);
    readonly delegations = signal<DelegationSynthese[]>([]);
    readonly historique = signal<SemaineSynthese[]>([]);
    readonly loading = signal(false);
    readonly envoi = signal(false);

    /** Les cinq blocs du courriel, mis a plat pour le tableau. */
    readonly blocs = computed(() => {
        const x = this.s();
        const p = this.precedente();
        if (!x) return [];
        const lignes: any[] = [];
        const titre = (libelle: string) => lignes.push({ titre: true, libelle });
        const l = (libelle: string, v: number | null, pv: number | null, hausseBonne: boolean | null, montant = false) => {
            const valeur = v === null ? 'non disponible' : montant ? this.md(v) : this.nb(v);
            const precedent = pv === null ? '—' : montant ? this.md(pv) : this.nb(pv);
            let variation = '—';
            let bon = false;
            let mauvais = false;
            if (v !== null && pv !== null) {
                const ecart = v - pv;
                if (ecart === 0) variation = 'inchangé';
                else {
                    variation = (ecart > 0 ? '+' : '') + (montant ? this.md(ecart) : this.nb(ecart));
                    if (hausseBonne !== null) {
                        bon = hausseBonne ? ecart > 0 : ecart < 0;
                        mauvais = !bon;
                    }
                }
            }
            lignes.push({ libelle, valeur, precedent, variation, bon, mauvais });
        };

        titre('1. Situation des crédits');
        l('Dossiers reçus', x.demRecu, p?.demRecu ?? null, null);
        l('Dossiers en instruction', x.demInstruction, p?.demInstruction ?? null, null);
        l('Nouveaux dossiers de la semaine', x.demNouveauxSemaine, p?.demNouveauxSemaine ?? null, true);
        l('Dossiers accordés dans la semaine', x.demAccordesSemaine, p?.demAccordesSemaine ?? null, true);
        l('Dossiers annulés dans la semaine', x.demAnnulesSemaine, p?.demAnnulesSemaine ?? null, false);
        l('Dossiers refusés (stock)', x.demRefuse, p?.demRefuse ?? null, false);
        if (!x.octIndisponible) {
            l('Crédits octroyés dans SAF', x.octNb, p?.octNb ?? null, true);
            l('Montant octroyé dans SAF', x.octMontant, p?.octMontant ?? null, true, true);
        } else {
            lignes.push({ libelle: 'Octrois SAF de la semaine', valeur: x.octIndisponible, precedent: '—', variation: '—' });
        }

        titre('2. Niveau du portefeuille du réseau');
        l('Crédits vivants', x.pfCredits, p?.pfCredits ?? null, null);
        l('Encours', x.pfEncours, p?.pfEncours ?? null, true, true);
        l('Crédits en retard', x.pfNbRetard, p?.pfNbRetard ?? null, false);
        l('Montant impayé', x.pfImpaye, p?.pfImpaye ?? null, false, true);
        l('Contentieux déclarés', x.pfContentieux, p?.pfContentieux ?? null, false);

        titre('3. Portefeuille à risque par tranche');
        l('PAR 30 jours', x.par30Encours, p?.par30Encours ?? null, false, true);
        l('PAR 60 jours', x.par60Encours, p?.par60Encours ?? null, false, true);
        l('PAR 90 jours', x.par90Encours, p?.par90Encours ?? null, false, true);
        l('PAR 120 jours', x.par120Encours, p?.par120Encours ?? null, false, true);

        titre("4. Évolution de l'assainissement");
        l('Fiches validées dans la semaine', x.assValideSemaine, p?.assValideSemaine ?? null, true);
        l('Fiches rejetées dans la semaine', x.assRejeteSemaine, p?.assRejeteSemaine ?? null, null);
        l('Fiches en attente (stock)', x.assEnAttente, p?.assEnAttente ?? null, false);

        titre('5. Évolution du suivi des arrêtés de caisse');
        l('Points de service à jour', x.arrAJour, p?.arrAJour ?? null, true);
        l('En attente de validation', x.arrAValider, p?.arrAValider ?? null, false);
        l('En retard', x.arrEnRetard, p?.arrEnRetard ?? null, false);
        l("N'ayant jamais remonté d'arrêté", x.arrJamaisRemonte, p?.arrJamaisRemonte ?? null, false);
        return lignes;
    });

    ngOnInit(): void {
        this.charger();
    }

    charger(): void {
        this.loading.set(true);
        this.userService
            .getSyntheseDirection$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    const synthese = (r.data as any)?.synthese as Synthese;
                    this.s.set(synthese?.courante ?? null);
                    this.precedente.set(synthese?.precedente ?? null);
                    this.delegations.set(synthese?.delegations ?? []);
                    this.loading.set(false);
                },
                error: (err) => {
                    this.loading.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Synthèse', detail: err || 'Lecture impossible', life: 6000 });
                }
            });
        this.userService
            .getSyntheseDirectionHistorique$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => this.historique.set(((r.data as any)?.semaines as SemaineSynthese[]) || []),
                error: () => {}
            });
    }

    essai(): void {
        this.envoi.set(true);
        this.userService
            .essaiSyntheseDirection$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.envoi.set(false);
                    this.messageService.add({ severity: 'success', summary: 'Essai', detail: r.message || 'Synthèse envoyée', life: 5000 });
                },
                error: (err) => {
                    this.envoi.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Essai', detail: err || 'Envoi impossible', life: 6000 });
                }
            });
    }

    envoyer(): void {
        this.confirmationService.confirm({
            header: 'Envoyer à la direction',
            message:
                "La synthèse va partir à tous les destinataires, dont le Directeur Général. Le courriel du lundi part déjà seul : n'utilisez ceci que si cet envoi a échoué, ou si la direction la redemande.",
            acceptLabel: 'Envoyer',
            rejectLabel: 'Annuler',
            accept: () => {
                this.envoi.set(true);
                this.userService
                    .envoyerSyntheseDirection$()
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe({
                        next: (r: IResponse) => {
                            this.envoi.set(false);
                            this.messageService.add({ severity: 'success', summary: 'Envoyée', detail: r.message || 'Synthèse envoyée', life: 5000 });
                            this.charger();
                        },
                        error: (err) => {
                            this.envoi.set(false);
                            this.messageService.add({ severity: 'error', summary: 'Envoi', detail: err || 'Envoi impossible', life: 6000 });
                        }
                    });
            }
        });
    }

    nb(v: number | null | undefined): string {
        return v === null || v === undefined ? '—' : new Intl.NumberFormat('fr-FR').format(v);
    }

    /** Un encours se lit en milliards : un directeur compare des ordres de grandeur. */
    md(v: number | null | undefined): string {
        if (v === null || v === undefined) return '—';
        return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v / 1_000_000_000) + ' Md';
    }

    taux(tranche: number | null, encours: number | null): number {
        if (!tranche || !encours) return 0;
        return (tranche * 100) / encours;
    }

    pct(tranche: number | null, encours: number | null): string {
        if (tranche === null || !encours) return '—';
        return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.taux(tranche, encours)) + ' %';
    }
}
