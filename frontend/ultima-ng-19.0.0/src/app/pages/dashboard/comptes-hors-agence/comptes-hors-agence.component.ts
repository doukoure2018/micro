import { CompteurHorsAgence, DossierCompteHorsAgence, LigneCompteHorsAgence, SituationComptesHorsAgence, VerificationHorsAgence } from '@/interface/compte-hors-agence';
import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
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
 * Page « Comptes hors agence » (V214, lot 2).
 *
 * Dans SAF, les trois premiers chiffres du numéro de membre donnent l'agence du client. Un compte
 * ouvert dans une autre agence a été ouvert ailleurs, et l'usager qui l'a ouvert est connu. Seul
 * un compte actif reste à corriger : un compte fermé ou transféré vit dans l'historique.
 *
 * La liste montre par défaut les comptes actifs ; les tuiles portent toujours sur la totalité
 * du stock. Jumelle de la page des comptes mal adossés : mêmes gestes, mêmes destinataires.
 */
@Component({
    selector: 'app-comptes-hors-agence',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CheckboxModule,
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
                <h2 class="text-xl font-bold m-0">Comptes ouverts hors de l'agence du client</h2>
                <div class="flex items-center gap-2">
                    <button pButton icon="pi pi-refresh" class="p-button-text" (click)="charger()" [loading]="loading()"></button>
                    <button pButton icon="pi pi-refresh" label="Vérifier les prises en charge" class="p-button-outlined" [loading]="verifieToutEnCours()"
                        pTooltip="Confronte à la base de production tous les comptes pris en charge : ceux qui ont été régularisés dans SAF quittent la liste"
                        (click)="verifierPrisesEnCharge()"></button>
                    <button pButton icon="pi pi-file-excel" label="Exporter" class="p-button-success p-button-outlined" [loading]="exportEnCours()" (click)="exporter()"></button>
                </div>
            </div>
            <p class="text-sm text-gray-500 mb-3">
                Un compte doit être ouvert dans l'agence du client, celle des trois premiers chiffres de son numéro de membre. L'usager qui a ouvert chaque
                compte est nommé. La régularisation se fait dans SAF — digi lit la base, il n'y écrit pas, et constate la correction au passage suivant.
                <span *ngIf="d()?.dernierPassage">Dernière lecture le {{ d()!.dernierPassage | date: 'dd/MM/yyyy à HH:mm' }}.</span>
            </p>

            @if (d(); as x) {
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div class="border rounded p-3 border-red-300">
                    <div class="text-xs text-gray-500 uppercase">À traiter</div>
                    <div class="text-xl font-bold text-red-600">{{ x.nbATraiter | number }}</div>
                    <div class="text-xs text-gray-500">comptes actifs hors agence</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Comptes hors agence ouverts</div>
                    <div class="text-xl font-bold">{{ x.nbOuverts | number }}</div>
                    <div class="text-xs text-gray-500">{{ x.soldeOuvert | number: '1.0-0' }} GNF · {{ x.nbDetectesAujourdhui }} détecté(s) aujourd'hui</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Pris en charge</div>
                    <div class="text-xl font-bold">{{ x.nbPrisesEnCharge | number }}</div>
                    <div class="text-xs" [class.text-red-600]="x.nbPrisesEnChargeAnciennes > 0">
                        {{ x.nbPrisesEnChargeAnciennes }} depuis plus de 7 jours
                    </div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Régularisés ce mois</div>
                    <div class="text-xl font-bold">{{ x.nbCorrigesCeMois | number }}</div>
                    <div class="text-xs text-gray-500">disparus de la liste SAF ou transférés</div>
                </div>
            </div>

            <p-tabs value="0">
                <p-tablist>
                    <p-tab value="0">Par situation</p-tab>
                    <p-tab value="1">Par agence de l'agent</p-tab>
                    <p-tab value="2">Par usager</p-tab>
                </p-tablist>
                <p-tabpanels>
                    <p-tabpanel value="0">
                        <p class="text-sm text-gray-500 mb-2">
                            La situation compare l'agence de l'agent, celle du compte et celle du client. Cliquez une ligne pour filtrer la liste.
                        </p>
                        <ng-container [ngTemplateOutlet]="synthese" [ngTemplateOutletContext]="{ lignes: x.parSituation, colonne: 'Situation', mode: 'situation' }"></ng-container>
                    </p-tabpanel>
                    <p-tabpanel value="1">
                        <p class="text-sm text-gray-500 mb-2">L'agence de l'usager qui a ouvert le compte, lue dans les trois derniers caractères de son code. « ? » = inconnue.</p>
                        <ng-container [ngTemplateOutlet]="synthese" [ngTemplateOutletContext]="{ lignes: x.parAgenceAgent, colonne: 'Agence de l’agent', mode: 'agenceAgent' }"></ng-container>
                    </p-tabpanel>
                    <p-tabpanel value="2">
                        <p class="text-sm text-gray-500 mb-2">L'usager SAF qui a ouvert le compte. C'est ici que se voit une habitude.</p>
                        <ng-container [ngTemplateOutlet]="synthese" [ngTemplateOutletContext]="{ lignes: x.parUsager, colonne: 'Usager SAF', mode: 'creePar' }"></ng-container>
                    </p-tabpanel>
                </p-tabpanels>
            </p-tabs>

            <ng-template #synthese let-lignes="lignes" let-colonne="colonne" let-mode="mode">
                <p-table [value]="lignes" styleClass="p-datatable-sm" [paginator]="lignes.length > 15" [rows]="15" responsiveLayout="scroll">
                    <ng-template pTemplate="header">
                        <tr>
                            <th>{{ colonne }}</th>
                            <th class="text-right">Comptes</th>
                            <th class="text-right">Actifs</th>
                            <th class="text-right">À traiter</th>
                            <th class="text-right">Solde (GNF)</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-l>
                        <tr class="cursor-pointer" (click)="filtrerPar(mode, l)">
                            <td>
                                {{ l.libelle }}
                                <span *ngIf="mode !== 'situation' && l.cle && l.cle !== l.libelle" class="block text-xs text-gray-500">{{ l.cle }}</span>
                            </td>
                            <td class="text-right">{{ l.nb | number }}</td>
                            <td class="text-right">{{ l.nbActifs | number }}</td>
                            <td class="text-right font-semibold" [class.text-red-600]="l.nbATraiter > 0">{{ l.nbATraiter | number }}</td>
                            <td class="text-right">{{ l.solde | number: '1.0-0' }}</td>
                        </tr>
                    </ng-template>
                </p-table>
            </ng-template>

            <div class="flex flex-wrap gap-3 items-center mt-4 mb-2">
                <p-select [options]="situationOptions" [(ngModel)]="situation" optionLabel="label" optionValue="value" placeholder="Toutes les situations" [showClear]="true" styleClass="w-80" appendTo="body" (onChange)="charger()"></p-select>
                <p-select [options]="etatOptions" [(ngModel)]="etat" optionLabel="label" optionValue="value" placeholder="Tous les états" [showClear]="true" styleClass="w-40" appendTo="body" (onChange)="charger()"></p-select>
                <input pInputText type="text" [(ngModel)]="agence" placeholder="Agence du compte" class="w-36" (keyup.enter)="charger()" />
                <input pInputText type="text" [(ngModel)]="agenceAgent" placeholder="Agence de l'agent" class="w-36" (keyup.enter)="charger()" />
                <input pInputText type="text" [(ngModel)]="creePar" placeholder="Usager" class="w-36" (keyup.enter)="charger()" />
                <input pInputText type="text" [(ngModel)]="recherche" placeholder="Compte, client, intitulé ou usager" class="w-64" (keyup.enter)="charger()" />
                <button pButton icon="pi pi-search" class="p-button-outlined" (click)="charger()"></button>
                <button pButton icon="pi pi-times" label="Effacer" class="p-button-text" (click)="effacer()"></button>
                <div class="flex items-center gap-4 ml-auto">
                    <div class="flex items-center gap-2">
                        <p-checkbox [(ngModel)]="inclureCorriges" [binary]="true" inputId="inclureCorriges" (onChange)="charger()"></p-checkbox>
                        <label for="inclureCorriges" class="text-sm" pTooltip="Les comptes régularisés ou transférés, sortis de la liste SAF">Inclure les régularisés</label>
                    </div>
                    <div class="flex items-center gap-2">
                        <p-toggleswitch [(ngModel)]="tout" (onChange)="charger()"></p-toggleswitch>
                        <span class="text-sm" pTooltip="Y compris les comptes fermés, bloqués ou transférés, qui n'ont plus rien à corriger">Tout le stock</span>
                    </div>
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
                        <th>Compte</th>
                        <th>Intitulé</th>
                        <th>Client</th>
                        <th>Agence du compte</th>
                        <th>Ouvert par</th>
                        <th>Situation</th>
                        <th>Ouvert le</th>
                        <th>État</th>
                        <th class="text-right">Solde (GNF)</th>
                        <th>Suivi</th>
                        <th style="width:7rem"></th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-l>
                    <tr [class.bg-red-50]="l.aTraiter && !l.traiteAt" [class.text-gray-500]="l.corrigeAt">
                        <td>
                            <span class="font-mono text-sm">{{ l.numCuenta }}</span>
                            <span *ngIf="l.typeCompte" class="block text-xs text-gray-500">type {{ l.typeCompte }}</span>
                            <span *ngIf="l.corrigeAt" class="block text-xs text-green-700">{{ libelleFermeture(l.fermetureMotif) }} le {{ l.corrigeAt | date: 'dd/MM/yyyy' }}</span>
                        </td>
                        <td>{{ l.intitule || '—' }}</td>
                        <td>
                            {{ l.nomCliente || '—' }}<br /><span class="text-xs text-gray-500">{{ l.codCliente }} · agence {{ l.agenceClient }}</span>
                            <span *ngIf="l.agenceClientFiche && l.agenceClientFiche !== l.agenceClient" class="block text-xs text-orange-600">fiche client : agence {{ l.agenceClientFiche }}</span>
                        </td>
                        <td>{{ l.desAgenceCompte || l.agenceCompte }}<span *ngIf="l.desAgenceCompte" class="block text-xs text-gray-500">{{ l.agenceCompte }}</span></td>
                        <td>
                            {{ l.nomCreePar || '—' }}
                            <span *ngIf="l.creePar" class="block text-xs text-gray-500">{{ l.creePar }} · agence {{ l.agenceAgent || '?' }}</span>
                        </td>
                        <td><p-tag [value]="l.situationLibelle || l.situation" [severity]="severite(l.situation)"></p-tag></td>
                        <td>{{ l.dateOuverture | date: 'dd/MM/yyyy' }}</td>
                        <td>
                            {{ l.etat || l.etatCompte }}
                            <span *ngIf="l.etatCompte" class="block text-xs text-gray-500">{{ l.etatCompte }}</span>
                        </td>
                        <td class="text-right">{{ l.solde | number: '1.0-0' }}</td>
                        <td class="text-sm">
                            <span *ngIf="l.traiteAt">
                                {{ l.traitePar }}
                                <br />
                                <span class="text-xs" [class.text-red-600]="(l.joursDepuisPriseEnCharge || 0) >= 7">depuis {{ l.joursDepuisPriseEnCharge }} j</span>
                            </span>
                            <span *ngIf="!l.traiteAt" class="text-gray-400">—</span>
                            <div *ngIf="l.verifieSafAt" class="text-xs mt-1"
                                 [class.text-green-700]="l.verificationConclusion === 'CORRIGE' || l.verificationConclusion === 'TRANSFERT'"
                                 [class.text-gray-500]="l.verificationConclusion === 'TOUJOURS_HORS_AGENCE'">
                                {{ l.verificationLibelle }} · vérifié le {{ l.verifieSafAt | date: 'dd/MM HH:mm' }}
                            </div>
                        </td>
                        <td>
                            <button pButton icon="pi pi-search" class="p-button-text p-button-sm" pTooltip="Ce que SAF dit maintenant" (click)="ouvrirDossier(l)"></button>
                            <button *ngIf="!l.corrigeAt" pButton icon="pi pi-refresh" class="p-button-text p-button-sm" pTooltip="Vérifier dans la base de production : si le compte a été régularisé, la ligne quitte la liste" [loading]="verifieEnCours() === l.id" (click)="verifier(l)"></button>
                            <button *ngIf="!l.corrigeAt && !l.traiteAt" pButton icon="pi pi-user-plus" class="p-button-text p-button-sm" pTooltip="Prendre en charge" (click)="ouvrirSuivi(l)"></button>
                            <button *ngIf="!l.corrigeAt && l.traiteAt" pButton icon="pi pi-undo" class="p-button-text p-button-sm" pTooltip="Rendre à traiter" (click)="rendreATraiter(l)"></button>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr>
                        <td colspan="11" class="text-center text-gray-500 py-4">Aucun compte pour ces critères.</td>
                    </tr>
                </ng-template>
            </p-table>
            }
        </div>

        <p-dialog header="Ce que SAF dit maintenant" [(visible)]="dialogueDossier" [modal]="true" [style]="{ width: '52rem' }">
            <div *ngIf="chargementDossier()" class="text-center py-4"><i class="pi pi-spin pi-spinner text-2xl"></i></div>
            @if (dossier(); as d) {
            <div class="mb-3">
                <div class="font-semibold">
                    Compte <span class="font-mono">{{ d.ligne.numCuenta }}</span> — {{ d.ligne.intitule || d.ligne.nomCliente || '(sans intitulé)' }}
                </div>
                <div class="text-sm text-gray-500">
                    Membre {{ d.ligne.codCliente }} ({{ d.ligne.nomCliente || '—' }}) · agence du client {{ d.ligne.agenceClient }}
                    · ouvert par {{ d.ligne.nomCreePar || d.ligne.creePar || '—' }}<span *ngIf="d.ligne.nomCreePar && d.ligne.creePar" class="text-gray-400"> ({{ d.ligne.creePar }})</span>
                    · agence de l'agent {{ d.ligne.agenceAgent || '?' }}
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase mb-1">Tel que digi le connaît</div>
                    <div class="text-sm">Agence du compte : <b>{{ d.ligne.desAgenceCompte || d.ligne.agenceCompte }}</b></div>
                    <div class="text-sm">Fiche client : agence {{ d.ligne.agenceClientFiche || '—' }}</div>
                    <div class="text-sm">Situation : {{ d.ligne.situationLibelle || d.ligne.situation }}</div>
                    <div class="text-sm">État {{ d.ligne.etatCompte || '—' }} · solde {{ d.ligne.solde | number: '1.0-0' }} GNF</div>
                    <div class="text-xs text-gray-500 mt-1">
                        Détecté le {{ d.ligne.detecteAt | date: 'dd/MM/yyyy HH:mm' }} · vu le {{ d.ligne.dernierVuAt | date: 'dd/MM/yyyy HH:mm' }}
                    </div>
                </div>
                <div class="border rounded p-3" [class.border-red-300]="d.conclusion === 'TOUJOURS_HORS_AGENCE'" [class.border-green-400]="d.conclusion === 'CORRIGE' || d.conclusion === 'TRANSFERT'">
                    <div class="text-xs text-gray-500 uppercase mb-1">Tel que SAF le porte à l'instant</div>
                    <div *ngIf="!d.existeEncore" class="text-red-600 font-semibold">Ce compte n'existe plus dans SAF.</div>
                    <div *ngIf="d.existeEncore && d.actuel as a">
                        <div class="text-sm">Agence du compte : <b>{{ a.desAgenceCompte || a.agenceCompte }}</b></div>
                        <div class="text-sm">Fiche client : agence {{ a.agenceClientFiche || '—' }} <span class="text-gray-500">(numéro : agence {{ a.agenceClient }})</span></div>
                        <div class="text-sm">Ouvert par {{ a.nomCreePar || a.creePar || '—' }} · agence {{ a.agenceAgent || '?' }}</div>
                        <div class="text-sm" [class.text-red-600]="a.etatCompte === 'A'">État {{ a.etatCompte || '—' }}</div>
                        <div class="text-sm text-gray-500">Solde {{ a.solde | number: '1.0-0' }} GNF · ouvert le {{ a.dateOuverture | date: 'dd/MM/yyyy' }}</div>
                    </div>
                </div>
            </div>

            <div class="p-3 rounded" [class.bg-green-50]="d.conclusion === 'CORRIGE' || d.conclusion === 'TRANSFERT'" [class.bg-red-50]="d.conclusion === 'TOUJOURS_HORS_AGENCE'">
                <div class="font-semibold">{{ libelleConclusion(d.conclusion) }}</div>
                <div class="text-sm">{{ d.explication }}</div>
            </div>

            <p class="text-xs text-gray-500 mt-3">
                Lecture directe de la base de production SAF, à l'instant. La régularisation se fait dans SAF : digi lit la base, il n'y écrit pas.
            </p>
            }
        </p-dialog>

        <p-dialog header="Prendre en charge" [(visible)]="dialogue" [modal]="true" [style]="{ width: '34rem' }">
            <p class="text-sm text-gray-500 mb-3" *ngIf="choisie()">
                Compte {{ choisie()!.numCuenta }} — {{ choisie()!.nomCliente || choisie()!.intitule }}. Digi ne corrige pas SAF : cette marque indique
                seulement que vous vous en occupez, pour éviter que deux personnes travaillent le même compte.
            </p>
            <textarea pTextarea [(ngModel)]="commentaire" rows="3" class="w-full" placeholder="Commentaire (facultatif)" maxlength="500"></textarea>
            <ng-template pTemplate="footer">
                <button pButton label="Annuler" class="p-button-text" (click)="dialogue = false"></button>
                <button pButton label="Prendre en charge" icon="pi pi-check" [loading]="envoiSuivi()" (click)="confirmerSuivi()"></button>
            </ng-template>
        </p-dialog>
    `
})
export class ComptesHorsAgenceComponent implements OnInit {
    private readonly userService = inject(UserService);
    private readonly messageService = inject(MessageService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly destroyRef = inject(DestroyRef);

    readonly d = signal<SituationComptesHorsAgence | null>(null);
    readonly loading = signal(false);
    readonly exportEnCours = signal(false);
    /** L'identifiant de la ligne en cours de vérification, pour n'animer que son bouton. */
    readonly verifieEnCours = signal<number | null>(null);
    readonly verifieToutEnCours = signal(false);
    readonly envoiSuivi = signal(false);
    readonly choisie = signal<LigneCompteHorsAgence | null>(null);

    situation: string | null = null;
    etat: string | null = null;
    agence: string | null = null;
    agenceAgent: string | null = null;
    creePar: string | null = null;
    recherche: string | null = null;
    tout = false;
    inclureCorriges = false;
    dialogue = false;
    dialogueDossier = false;
    commentaire: string | null = null;
    readonly dossier = signal<DossierCompteHorsAgence | null>(null);
    readonly chargementDossier = signal(false);

    situationOptions = [
        { label: "Agent dans son agence, client d'une autre agence", value: 'AGENT_CHEZ_LUI' },
        { label: "Agent de l'agence du client, compte ouvert ailleurs", value: 'AGENT_DU_CLIENT' },
        { label: 'Agent, compte et client dans trois agences', value: 'TROIS_AGENCES' },
        { label: "Agence de l'agent inconnue (administrateur, siège)", value: 'AGENT_SANS_AGENCE' }
    ];

    etatOptions = [
        { label: 'Actifs', value: 'A' },
        { label: 'Autres (fermés, bloqués, transférés)', value: 'AUTRES' }
    ];

    ngOnInit(): void {
        this.charger();
    }

    charger(): void {
        this.loading.set(true);
        this.userService
            .getComptesHorsAgence$(this.filtres())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.d.set(((r.data as any)?.situation as SituationComptesHorsAgence) || null);
                    this.loading.set(false);
                },
                error: (err) => {
                    this.loading.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Comptes hors agence', detail: err || 'Lecture impossible', life: 6000 });
                }
            });
    }

    filtrerPar(mode: string, ligne: CompteurHorsAgence): void {
        if (mode === 'situation') {
            this.situation = this.situation === ligne.cle ? null : ligne.cle;
        } else if (mode === 'agenceAgent') {
            this.agenceAgent = this.agenceAgent === ligne.cle ? null : ligne.cle;
        } else {
            this.creePar = this.creePar === ligne.cle ? null : ligne.cle;
        }
        this.charger();
    }

    effacer(): void {
        this.situation = null;
        this.etat = null;
        this.agence = null;
        this.agenceAgent = null;
        this.creePar = null;
        this.recherche = null;
        this.tout = false;
        this.inclureCorriges = false;
        this.charger();
    }

    /**
     * Confronte un compte à la base de production. S'il a été régularisé ou si le client a été
     * transféré, la ligne se referme et quitte la liste ; sinon l'écran dit ce que SAF répond.
     */
    verifier(l: LigneCompteHorsAgence): void {
        this.verifieEnCours.set(l.id);
        this.userService
            .verifierCompteHorsAgence$(l.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.verifieEnCours.set(null);
                    const v = (r.data as any)?.verification as VerificationHorsAgence | undefined;
                    this.messageService.add({
                        severity: v?.ferme ? 'success' : 'warn',
                        summary: v?.ferme ? 'Ligne refermée' : 'Compte toujours hors agence',
                        detail: v?.explication || r.message || '',
                        life: 8000
                    });
                    this.charger();
                },
                error: (err) => {
                    this.verifieEnCours.set(null);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Vérification impossible',
                        detail: typeof err === 'string' ? err : (err as any)?.message || '',
                        life: 8000
                    });
                }
            });
    }

    /** Les comptes pris en charge et encore ouverts, confrontés d'un coup. */
    verifierPrisesEnCharge(): void {
        this.verifieToutEnCours.set(true);
        this.userService
            .verifierPrisesEnChargeHorsAgence$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.verifieToutEnCours.set(false);
                    const liste = ((r.data as any)?.verifications || []) as VerificationHorsAgence[];
                    const fermees = liste.filter((v) => v.ferme).length;
                    this.messageService.add({
                        severity: liste.length === 0 ? 'info' : fermees ? 'success' : 'warn',
                        summary: 'Vérification terminée',
                        detail: r.message || '',
                        life: 9000
                    });
                    this.charger();
                },
                error: (err) => {
                    this.verifieToutEnCours.set(false);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Vérification impossible',
                        detail: typeof err === 'string' ? err : (err as any)?.message || '',
                        life: 8000
                    });
                }
            });
    }

    ouvrirDossier(ligne: LigneCompteHorsAgence): void {
        this.dossier.set(null);
        this.dialogueDossier = true;
        this.chargementDossier.set(true);
        this.userService
            .getDossierCompteHorsAgence$(ligne.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.dossier.set(((r.data as any)?.dossier as DossierCompteHorsAgence) || null);
                    this.chargementDossier.set(false);
                },
                error: (err) => {
                    this.chargementDossier.set(false);
                    this.dialogueDossier = false;
                    this.messageService.add({ severity: 'error', summary: 'Dossier SAF', detail: err || "SAF n'a pas répondu", life: 6000 });
                }
            });
    }

    ouvrirSuivi(ligne: LigneCompteHorsAgence): void {
        this.choisie.set(ligne);
        this.commentaire = null;
        this.dialogue = true;
    }

    confirmerSuivi(): void {
        const ligne = this.choisie();
        if (!ligne) return;
        this.envoiSuivi.set(true);
        this.userService
            .suiviCompteHorsAgence$(ligne.id, true, this.commentaire)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.envoiSuivi.set(false);
                    this.dialogue = false;
                    this.messageService.add({ severity: 'success', summary: 'Suivi', detail: r.message || 'Compte pris en charge', life: 4000 });
                    this.charger();
                },
                error: (err) => {
                    this.envoiSuivi.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Suivi', detail: err || 'Enregistrement impossible', life: 6000 });
                }
            });
    }

    rendreATraiter(ligne: LigneCompteHorsAgence): void {
        this.confirmationService.confirm({
            header: 'Rendre à traiter',
            message: `Retirer la prise en charge du compte ${ligne.numCuenta} ?`,
            accept: () => {
                this.userService
                    .suiviCompteHorsAgence$(ligne.id, false, null)
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
            .exportComptesHorsAgence$(this.filtres())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (reponse: HttpResponse<Blob>) => {
                    this.exportEnCours.set(false);
                    const disposition = reponse.headers.get('Content-Disposition') || '';
                    const nom = /filename="?([^";]+)"?/.exec(disposition)?.[1] || 'Comptes_hors_agence.xlsx';
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
            situation: this.situation,
            etat: this.etat,
            agence: this.agence,
            agenceAgent: this.agenceAgent,
            creePar: this.creePar,
            recherche: this.recherche,
            inclureCorriges: this.inclureCorriges,
            tout: this.tout
        };
    }

    severite(situation: string): 'danger' | 'warn' | 'info' | 'secondary' {
        if (situation === 'TROIS_AGENCES') return 'danger';
        if (situation === 'AGENT_CHEZ_LUI') return 'warn';
        if (situation === 'AGENT_DU_CLIENT') return 'info';
        return 'secondary';
    }

    libelleFermeture(motif: string | null): string {
        if (motif === 'TRANSFERT') return 'Client transféré';
        if (motif === 'CORRIGE') return 'Régularisé';
        return 'Refermé';
    }

    libelleConclusion(conclusion: string | null): string {
        if (conclusion === 'CORRIGE') return "Régularisé : le compte n'est plus hors agence";
        if (conclusion === 'TRANSFERT') return "Transfert : la fiche client porte désormais l'agence du compte";
        if (conclusion === 'TOUJOURS_HORS_AGENCE') return 'Toujours hors agence';
        return conclusion || '';
    }
}
