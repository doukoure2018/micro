import { CompteurAnomalie, LigneCompteMalAdosse, SituationComptesMalAdosses } from '@/interface/compte-mal-adosse';
import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';

/**
 * Page « Comptes mal adossés » (V196, lot 2).
 *
 * Le compte de remboursement d'un crédit SAF est celui dont SAF prélève l'échéance. Il doit être
 * un compte courant (014) ou d'épargne (011) du client lui-même, et actif. Quand il ne l'est pas,
 * le prélèvement ne peut pas aboutir et le crédit entre dans le PAR pour une raison qui n'a rien
 * à voir avec la capacité du client à payer.
 *
 * La liste montre par défaut les seuls cas à traiter — crédit vivant et compte à rattacher —
 * parce que le stock complet dépasse quatorze mille lignes. Les tuiles, elles, portent toujours
 * sur la totalité : masquer l'existence du stock tromperait le lecteur.
 */
@Component({
    selector: 'app-comptes-mal-adosses',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        ConfirmDialogModule,
        DialogModule,
        InputTextModule,
        SelectModule,
        TableModule,
        TabsModule,
        TagModule,
        TextareaModule,
        ToastModule,
        ToggleSwitchModule,
        TooltipModule
    ],
    providers: [MessageService, ConfirmationService],
    template: `
        <p-toast></p-toast>
        <p-confirmDialog></p-confirmDialog>
        <div class="card">
            <div class="flex flex-wrap justify-between items-center gap-3 mb-2">
                <h2 class="text-xl font-bold m-0">Comptes de remboursement mal adossés</h2>
                <div class="flex items-center gap-2">
                    <button pButton icon="pi pi-refresh" class="p-button-text" (click)="charger()" [loading]="loading()"></button>
                    <button pButton icon="pi pi-file-excel" label="Exporter" class="p-button-success p-button-outlined" [loading]="exportEnCours()" (click)="exporter()"></button>
                </div>
            </div>
            <p class="text-sm text-gray-500 mb-3">
                Le compte de remboursement est celui dont SAF prélève l'échéance : il doit être un compte courant (014) ou d'épargne (011) du client
                lui-même, et actif. La correction se fait dans SAF — digi lit la base, il n'y écrit pas, et constate la correction au passage suivant.
                <span *ngIf="d()?.dernierPassage">Dernière lecture le {{ d()!.dernierPassage | date: 'dd/MM/yyyy à HH:mm' }}.</span>
            </p>

            @if (d(); as x) {
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div class="border rounded p-3 border-red-300">
                    <div class="text-xs text-gray-500 uppercase">À traiter</div>
                    <div class="text-xl font-bold text-red-600">{{ x.nbATraiter | number }}</div>
                    <div class="text-xs text-gray-500">crédit vivant, compte à rattacher</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Stock complet</div>
                    <div class="text-xl font-bold">{{ x.nbOuvertes | number }}</div>
                    <div class="text-xs text-gray-500">{{ x.encoursOuvert | number: '1.0-0' }} GNF</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Sur crédits vivants</div>
                    <div class="text-xl font-bold">{{ x.nbVivantes | number }}</div>
                    <div class="text-xs text-gray-500">le reste est apuré ou clos</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Prises en charge</div>
                    <div class="text-xl font-bold">{{ x.nbPrisesEnCharge | number }}</div>
                    <div class="text-xs" [class.text-red-600]="x.nbPrisesEnChargeAnciennes > 0">
                        {{ x.nbPrisesEnChargeAnciennes }} depuis plus de 7 jours
                    </div>
                </div>
            </div>

            <p-tabs value="0">
                <p-tablist>
                    <p-tab value="0">Par nature</p-tab>
                    <p-tab value="1">Par point de service</p-tab>
                    <p-tab value="2">Par usager de saisie</p-tab>
                </p-tablist>
                <p-tabpanels>
                    <p-tabpanel value="0">
                        <p class="text-sm text-gray-500 mb-2">
                            Seules les quatre premières natures déclenchent un courriel : un type de compte non autorisé peut relever d'un choix de
                            gestion. Cliquez une ligne pour filtrer la liste.
                        </p>
                        <ng-container [ngTemplateOutlet]="synthese" [ngTemplateOutletContext]="{ lignes: x.parFamille, colonne: 'Nature', mode: 'famille' }"></ng-container>
                    </p-tabpanel>
                    <p-tabpanel value="1">
                        <ng-container [ngTemplateOutlet]="synthese" [ngTemplateOutletContext]="{ lignes: x.parAgence, colonne: 'Point de service', mode: 'agence' }"></ng-container>
                    </p-tabpanel>
                    <p-tabpanel value="2">
                        <p class="text-sm text-gray-500 mb-2">L'usager qui a saisi le crédit dans SAF. C'est ici que se voit une habitude de saisie.</p>
                        <ng-container [ngTemplateOutlet]="synthese" [ngTemplateOutletContext]="{ lignes: x.parUsager, colonne: 'Usager SAF', mode: 'saisiPar' }"></ng-container>
                    </p-tabpanel>
                </p-tabpanels>
            </p-tabs>

            <ng-template #synthese let-lignes="lignes" let-colonne="colonne" let-mode="mode">
                <p-table [value]="lignes" styleClass="p-datatable-sm" [paginator]="lignes.length > 15" [rows]="15" responsiveLayout="scroll">
                    <ng-template pTemplate="header">
                        <tr>
                            <th>{{ colonne }}</th>
                            <th class="text-right">Anomalies</th>
                            <th class="text-right">Sur crédits vivants</th>
                            <th class="text-right">À traiter</th>
                            <th class="text-right">Encours (GNF)</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-l>
                        <tr class="cursor-pointer" (click)="filtrerPar(mode, l)">
                            <td>{{ l.libelle }}</td>
                            <td class="text-right">{{ l.nb | number }}</td>
                            <td class="text-right">{{ l.nbVivants | number }}</td>
                            <td class="text-right font-semibold" [class.text-red-600]="l.nbATraiter > 0">{{ l.nbATraiter | number }}</td>
                            <td class="text-right">{{ l.encours | number: '1.0-0' }}</td>
                        </tr>
                    </ng-template>
                </p-table>
            </ng-template>

            <div class="flex flex-wrap gap-3 items-center mt-4 mb-2">
                <p-select [options]="familleOptions" [(ngModel)]="famille" optionLabel="label" optionValue="value" placeholder="Toutes les natures" [showClear]="true" styleClass="w-64" appendTo="body" (onChange)="charger()"></p-select>
                <input pInputText type="text" [(ngModel)]="agence" placeholder="Code PS" class="w-28" (keyup.enter)="charger()" />
                <input pInputText type="text" [(ngModel)]="saisiPar" placeholder="Saisi par" class="w-40" (keyup.enter)="charger()" />
                <input pInputText type="text" [(ngModel)]="recherche" placeholder="Crédit, client ou compte" class="w-56" (keyup.enter)="charger()" />
                <button pButton icon="pi pi-search" class="p-button-outlined" (click)="charger()"></button>
                <button pButton icon="pi pi-times" label="Effacer" class="p-button-text" (click)="effacer()"></button>
                <div class="flex items-center gap-2 ml-auto">
                    <p-toggleswitch [(ngModel)]="tout" (onChange)="charger()"></p-toggleswitch>
                    <span class="text-sm" pTooltip="Y compris les crédits apurés et les types de compte non autorisés">Tout le stock</span>
                </div>
            </div>

            <p class="text-sm mb-2" [class.text-red-600]="x.tronquee">{{ x.message }}</p>

            <p-table
                [value]="x.lignes"
                [loading]="loading()"
                styleClass="p-datatable-sm"
                [paginator]="x.lignes.length > 25"
                [rows]="25"
                [rowsPerPageOptions]="[25, 50, 100]"
                responsiveLayout="scroll"
                currentPageReportTemplate="{first} à {last} sur {totalRecords}"
                [showCurrentPageReport]="true"
            >
                <ng-template pTemplate="header">
                    <tr>
                        <th>Point de service</th>
                        <th>Crédit</th>
                        <th>Client</th>
                        <th>Compte saisi</th>
                        <th>Nature</th>
                        <th class="text-right">Solde (GNF)</th>
                        <th>État</th>
                        <th>Saisi par</th>
                        <th>Suivi</th>
                        <th style="width:7rem"></th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-l>
                    <tr [class.bg-red-50]="l.aTraiter && !l.traiteAt">
                        <td>{{ l.desAgencia || l.codAgencia }}</td>
                        <td>{{ l.numCredito }}</td>
                        <td>{{ l.nomCliente || '—' }}<br /><span class="text-xs text-gray-500">{{ l.codCliente }}</span></td>
                        <td>
                            <span class="font-mono text-sm">{{ l.idCuenta || '(aucun)' }}</span>
                            <br />
                            <span class="text-xs text-gray-500">{{ detailCompte(l) }}</span>
                        </td>
                        <td><p-tag [value]="l.familleLibelle" [severity]="severite(l.famille)"></p-tag></td>
                        <td class="text-right">{{ l.monSaldo | number: '1.0-0' }}</td>
                        <td>{{ l.etat }}</td>
                        <td>{{ l.saisiPar || '—' }}</td>
                        <td class="text-sm">
                            <span *ngIf="l.traiteAt">
                                {{ l.traitePar }}
                                <br />
                                <span class="text-xs" [class.text-red-600]="(l.joursDepuisPriseEnCharge || 0) >= 7">depuis {{ l.joursDepuisPriseEnCharge }} j</span>
                            </span>
                            <span *ngIf="!l.traiteAt" class="text-gray-400">—</span>
                        </td>
                        <td>
                            <button *ngIf="!l.traiteAt" pButton icon="pi pi-user-plus" class="p-button-text p-button-sm" pTooltip="Prendre en charge" (click)="ouvrirSuivi(l)"></button>
                            <button *ngIf="l.traiteAt" pButton icon="pi pi-undo" class="p-button-text p-button-sm" pTooltip="Rendre à traiter" (click)="rendreATraiter(l)"></button>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr>
                        <td colspan="10" class="text-center text-gray-500 py-4">Aucune anomalie pour ces critères.</td>
                    </tr>
                </ng-template>
            </p-table>
            }
        </div>

        <p-dialog header="Prendre en charge" [(visible)]="dialogue" [modal]="true" [style]="{ width: '34rem' }">
            <p class="text-sm text-gray-500 mb-3" *ngIf="choisie()">
                Crédit {{ choisie()!.numCredito }} — {{ choisie()!.nomCliente }}. Digi ne corrige pas SAF : cette marque indique seulement que vous vous
                en occupez, pour éviter que deux personnes travaillent la même anomalie.
            </p>
            <textarea pTextarea [(ngModel)]="commentaire" rows="3" class="w-full" placeholder="Commentaire (facultatif)" maxlength="500"></textarea>
            <ng-template pTemplate="footer">
                <button pButton label="Annuler" class="p-button-text" (click)="dialogue = false"></button>
                <button pButton label="Prendre en charge" icon="pi pi-check" [loading]="envoiSuivi()" (click)="confirmerSuivi()"></button>
            </ng-template>
        </p-dialog>
    `
})
export class ComptesMalAdossesComponent implements OnInit {
    private readonly userService = inject(UserService);
    private readonly messageService = inject(MessageService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly destroyRef = inject(DestroyRef);

    readonly d = signal<SituationComptesMalAdosses | null>(null);
    readonly loading = signal(false);
    readonly exportEnCours = signal(false);
    readonly envoiSuivi = signal(false);
    readonly choisie = signal<LigneCompteMalAdosse | null>(null);

    famille: string | null = null;
    agence: string | null = null;
    saisiPar: string | null = null;
    recherche: string | null = null;
    tout = false;
    dialogue = false;
    commentaire: string | null = null;

    familleOptions = [
        { label: "Pas de compte de remboursement", value: 'PAS_DE_COMPTE' },
        { label: 'Compte inexistant', value: 'COMPTE_INEXISTANT' },
        { label: "Compte d'un autre client", value: 'COMPTE_AUTRE_CLIENT' },
        { label: 'Compte non actif', value: 'COMPTE_NON_ACTIF' },
        { label: 'Type de compte non autorisé', value: 'TYPE_NON_AUTORISE' }
    ];

    ngOnInit(): void {
        this.charger();
    }

    charger(): void {
        this.loading.set(true);
        this.userService
            .getComptesMalAdosses$(this.filtres())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.d.set(((r.data as any)?.situation as SituationComptesMalAdosses) || null);
                    this.loading.set(false);
                },
                error: (err) => {
                    this.loading.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Comptes mal adossés', detail: err || 'Lecture impossible', life: 6000 });
                }
            });
    }

    filtrerPar(mode: string, ligne: CompteurAnomalie): void {
        if (mode === 'famille') {
            this.famille = this.famille === ligne.cle ? null : ligne.cle;
            if (this.famille === 'TYPE_NON_AUTORISE') this.tout = true;
        } else if (mode === 'agence') {
            this.agence = this.agence === ligne.cle ? null : ligne.cle;
        } else {
            this.saisiPar = this.saisiPar === ligne.cle ? null : ligne.cle;
        }
        this.charger();
    }

    effacer(): void {
        this.famille = null;
        this.agence = null;
        this.saisiPar = null;
        this.recherche = null;
        this.tout = false;
        this.charger();
    }

    ouvrirSuivi(ligne: LigneCompteMalAdosse): void {
        this.choisie.set(ligne);
        this.commentaire = null;
        this.dialogue = true;
    }

    confirmerSuivi(): void {
        const ligne = this.choisie();
        if (!ligne) return;
        this.envoiSuivi.set(true);
        this.userService
            .suiviCompteMalAdosse$(ligne.id, true, this.commentaire)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.envoiSuivi.set(false);
                    this.dialogue = false;
                    this.messageService.add({ severity: 'success', summary: 'Suivi', detail: r.message || 'Anomalie prise en charge', life: 4000 });
                    this.charger();
                },
                error: (err) => {
                    this.envoiSuivi.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Suivi', detail: err || 'Enregistrement impossible', life: 6000 });
                }
            });
    }

    rendreATraiter(ligne: LigneCompteMalAdosse): void {
        this.confirmationService.confirm({
            header: 'Rendre à traiter',
            message: `Retirer la prise en charge du crédit ${ligne.numCredito} ?`,
            accept: () => {
                this.userService
                    .suiviCompteMalAdosse$(ligne.id, false, null)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe({
                        next: (r: IResponse) => {
                            this.messageService.add({ severity: 'success', summary: 'Suivi', detail: r.message || 'Prise en charge annulée', life: 4000 });
                            this.charger();
                        },
                        error: (err) => this.messageService.add({ severity: 'error', summary: 'Suivi', detail: err || 'Opération impossible', life: 6000 })
                    });
            }
        });
    }

    exporter(): void {
        this.exportEnCours.set(true);
        this.userService
            .exportComptesMalAdosses$(this.filtres())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (reponse: HttpResponse<Blob>) => {
                    this.exportEnCours.set(false);
                    const disposition = reponse.headers.get('Content-Disposition') || '';
                    const nom = /filename="?([^";]+)"?/.exec(disposition)?.[1] || 'Comptes_mal_adosses.xlsx';
                    const url = URL.createObjectURL(reponse.body as Blob);
                    const lien = document.createElement('a');
                    lien.href = url;
                    lien.download = nom;
                    lien.click();
                    URL.revokeObjectURL(url);
                },
                error: () => {
                    this.exportEnCours.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Export', detail: "Échec de l'export", life: 6000 });
                }
            });
    }

    private filtres() {
        return {
            famille: this.famille,
            etat: null,
            agence: this.agence,
            saisiPar: this.saisiPar,
            recherche: this.recherche,
            inclureCorriges: false,
            tout: this.tout
        };
    }

    /** Ce que le compte saisi est réellement : propriétaire, état, ou nature du compte. */
    detailCompte(l: LigneCompteMalAdosse): string {
        if (l.famille === 'COMPTE_AUTRE_CLIENT' && l.compteClient) return 'appartient à ' + l.compteClient;
        if (l.famille === 'COMPTE_NON_ACTIF' && l.compteEtat) return 'état ' + l.compteEtat;
        if (l.famille === 'COMPTE_INEXISTANT') return 'aucun compte à ce numéro';
        return l.typeCompte ? 'type ' + l.typeCompte : '';
    }

    severite(famille: string): 'danger' | 'warn' | 'info' | 'secondary' {
        if (famille === 'COMPTE_AUTRE_CLIENT') return 'danger';
        if (famille === 'COMPTE_INEXISTANT' || famille === 'PAS_DE_COMPTE') return 'warn';
        if (famille === 'COMPTE_NON_ACTIF') return 'info';
        return 'secondary';
    }
}
