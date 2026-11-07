import { DonneesSafComponent } from '../../portefeuille/donnees-saf.component';
import { IResponse } from '@/interface/response';
import { FiltresCreditsOctroyes, UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

/** Une ligne de synthese : une delegation, une agence ou un point de service. */
interface LigneSynthese {
    niveau: string;
    id: number;
    libelle: string;
    codeSaf?: string | null;
    nombre: number;
    montantDemande: number;
    nombre30Jours: number;
    premierOctroi?: string | null;
    dernierOctroi?: string | null;
    parNature: { [nature: string]: number };
    /**
     * Les natures mises a plat a l'arrivee des donnees, et non calculees dans le gabarit : une
     * methode qui construit un tableau dans un binding fait re-rendre la page en boucle, ce qui
     * a deja fige un ecran de cette plateforme.
     */
    natures?: { nom: string; nombre: number }[];
}

interface CreditOctroye {
    demandeIndividuelId: number;
    nom: string;
    prenom: string;
    telephone?: string;
    numeroMembre?: string;
    natureClient?: string;
    montantDemande: number;
    delegation?: string;
    agence?: string;
    pointVente?: string;
    codeSaf?: string;
    validePar?: string;
    dateOctroi?: string;
    joursDepuisOctroi: number;
}

interface CreditSaf {
    codAgencia: string;
    desAgencia?: string;
    numCredito: number;
    desTipCredito?: string;
    indEstado?: string;
    monCredito: number;
    monSaldo: number;
    fecApertura?: string;
    datPremImp?: string | null;
    joursRetard: number;
    situation: string;
    enRetard: boolean;
}

interface SituationDossier {
    dossier: CreditOctroye;
    etatCode: string;
    etatLibelle: string;
    credit?: CreditSaf | null;
    situationSaf?: string | null;
}

interface Totaux {
    nombreDossiers: number;
    nombreEnPlace: number;
    nombrePasDeCredit: number;
    nombreSansNumero: number;
    montantDemande: number;
    montantOctroye: number;
    encours: number;
    nombreEnRetard: number;
    montantEnRetard: number;
    creditsHorsDigi: number;
    parSituationSaf: { [situation: string]: number };
    /** Idem : mis a plat a l'arrivee, jamais dans le gabarit. */
    situations?: { nom: string; nombre: number }[];
}

/**
 * Les crédits déjà octroyés du réseau : synthèse par délégation, agence et point de service,
 * puis descente jusqu'au dossier, puis sa situation dans SAF.
 *
 * <p>Deux sources, jamais mélangées à l'écran : ce que digi a fait valider (nombre, montant
 * demandé — instantané, Postgres) et ce que SAF a mis en place (montant octroyé, encours,
 * retard — lecture de la sauvegarde de la veille, à la demande). Les présenter côte à côte sans
 * le dire ferait passer une demande pour un octroi.</p>
 */
@Component({
    selector: 'app-credits-octroyes',
    standalone: true,
    imports: [CommonModule, DonneesSafComponent, FormsModule, ButtonModule, DatePickerModule, DialogModule, InputTextModule, SelectButtonModule, TableModule, TagModule, ToastModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>

        <div class="card">
            <div class="flex flex-wrap justify-between items-center gap-3 mb-2">
                <h2 class="text-xl font-bold m-0">Crédits octroyés</h2>
                <app-donnees-saf></app-donnees-saf>
                <button pButton icon="pi pi-refresh" class="p-button-text" (click)="charger()" [loading]="state().loading"></button>
            </div>

            <p class="text-sm text-gray-500 mb-4">
                Les dossiers montés dans digi et <strong>validés au dernier niveau</strong> (DE ou DG selon le montant), toutes natures de crédit confondues. Le nombre et le montant demandé viennent de digi ; le
                montant réellement mis en place, l'encours et le retard viennent de SAF et ne s'affichent qu'après rapprochement.
            </p>

            <!-- Filtres -->
            <div class="flex flex-wrap items-end gap-3 mb-4">
                <div class="flex flex-col">
                    <label class="text-xs text-gray-500 mb-1">Octroyés du</label>
                    <p-datepicker [(ngModel)]="du" dateFormat="dd/mm/yy" [showClear]="true" [maxDate]="aujourdhui" placeholder="toutes dates"></p-datepicker>
                </div>
                <div class="flex flex-col">
                    <label class="text-xs text-gray-500 mb-1">au</label>
                    <p-datepicker [(ngModel)]="au" dateFormat="dd/mm/yy" [showClear]="true" [maxDate]="aujourdhui" placeholder="aujourd'hui"></p-datepicker>
                </div>
                <div class="flex flex-col">
                    <label class="text-xs text-gray-500 mb-1">Nom, prénom, membre ou téléphone</label>
                    <input pInputText [(ngModel)]="recherche" (keyup.enter)="charger()" placeholder="rechercher" />
                </div>
                <button pButton label="Appliquer" icon="pi pi-search" (click)="charger()" [loading]="state().loading"></button>
                <button pButton label="Effacer" icon="pi pi-times" class="p-button-outlined" (click)="effacer()" *ngIf="filtresActifs()"></button>
            </div>

            <!-- Fil d'Ariane de la descente -->
            <div class="flex flex-wrap items-center gap-2 mb-3 text-sm" *ngIf="filtreDelegation() || filtreAgence() || filtrePs()">
                <a class="cursor-pointer text-primary hover:underline" (click)="remonter(null)">Réseau</a>
                <ng-container *ngIf="filtreDelegation()">
                    <i class="pi pi-angle-right text-xs"></i>
                    <a class="cursor-pointer text-primary hover:underline" (click)="remonter('delegation')">{{ filtreDelegation()!.libelle }}</a>
                </ng-container>
                <ng-container *ngIf="filtreAgence()">
                    <i class="pi pi-angle-right text-xs"></i>
                    <a class="cursor-pointer text-primary hover:underline" (click)="remonter('agence')">{{ filtreAgence()!.libelle }}</a>
                </ng-container>
                <ng-container *ngIf="filtrePs()">
                    <i class="pi pi-angle-right text-xs"></i>
                    <span class="font-semibold">{{ filtrePs()!.libelle }}</span>
                </ng-container>
            </div>

            <!-- Total du périmètre affiché -->
            <div class="flex flex-wrap gap-4 mb-4">
                <div class="px-4 py-3 rounded border bg-blue-50 border-blue-200">
                    <div class="text-xs text-blue-700">Crédits octroyés</div>
                    <div class="text-2xl font-bold text-blue-800">{{ state().nombreTotal | number: '1.0-0' }}</div>
                </div>
                <div class="px-4 py-3 rounded border bg-gray-50 border-gray-200">
                    <div class="text-xs text-gray-600">Montant demandé dans digi</div>
                    <div class="text-2xl font-bold text-gray-800">{{ state().montantTotal | number: '1.0-0' }} <span class="text-sm font-normal">GNF</span></div>
                </div>
            </div>

            <!-- Synthèse du niveau courant -->
            <p-table [value]="state().lignes" [loading]="state().loading" styleClass="p-datatable-sm" [paginator]="state().lignes.length > 20" [rows]="20">
                <ng-template pTemplate="caption">
                    <span class="font-semibold">{{ titreNiveau() }}</span>
                </ng-template>
                <ng-template pTemplate="header">
                    <tr>
                        <th>{{ libelleColonneNiveau() }}</th>
                        <th class="text-right">Crédits</th>
                        <th class="text-right">Montant demandé</th>
                        <th class="text-right">30 derniers jours</th>
                        <th>Natures</th>
                        <th>Dernier octroi</th>
                        <th style="width: 7rem"></th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-l>
                    <tr>
                        <td>
                            <strong>{{ l.libelle || '—' }}</strong>
                            <div class="text-xs text-gray-500" *ngIf="l.codeSaf">code SAF {{ l.codeSaf }}</div>
                        </td>
                        <td class="text-right font-semibold">{{ l.nombre | number: '1.0-0' }}</td>
                        <td class="text-right">{{ l.montantDemande | number: '1.0-0' }}</td>
                        <td class="text-right">
                            <p-tag *ngIf="l.nombre30Jours > 0" [value]="l.nombre30Jours" severity="success"></p-tag>
                            <span *ngIf="!l.nombre30Jours" class="text-gray-400">—</span>
                        </td>
                        <td>
                            <span *ngFor="let n of l.natures" class="inline-block mr-1 mb-1 px-2 py-1 text-xs rounded bg-gray-100" [pTooltip]="n.nom">
                                {{ natureCourte(n.nom) }} : {{ n.nombre }}
                            </span>
                        </td>
                        <td>{{ l.dernierOctroi | date: 'dd/MM/yyyy' }}</td>
                        <td>
                            <button pButton icon="pi pi-angle-right" class="p-button-text p-button-sm" (click)="descendre(l)" [disabled]="!peutDescendre()" pTooltip="Descendre d'un niveau"></button>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr>
                        <td colspan="7" class="text-center text-gray-500 py-4">Aucun crédit octroyé pour ces critères.</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <!-- Situation dans SAF -->
        <div class="card">
            <div class="flex flex-wrap justify-between items-center gap-3 mb-3">
                <h3 class="text-lg font-bold m-0">Situation dans SAF</h3>
                <button pButton label="Rapprocher avec SAF" icon="pi pi-sync" (click)="rapprocher()" [loading]="situation().loading"></button>
            </div>

            <p class="text-sm text-gray-500 mb-3" *ngIf="!situation().totaux">
                Le rapprochement cherche, pour chaque dossier validé, le crédit que l'agence a mis en place dans SAF. Il lit la sauvegarde de la veille et n'est pas lancé automatiquement : au-delà de 3 000 dossiers
                il est refusé plutôt que de renvoyer un encours partiel — resserrez alors sur une agence ou une période.
            </p>

            <ng-container *ngIf="situation().totaux as t">
                <div class="flex flex-wrap gap-3 mb-4">
                    <div class="px-4 py-3 rounded border bg-teal-50 border-teal-200">
                        <div class="text-xs text-teal-700">Mis en place</div>
                        <div class="text-2xl font-bold text-teal-800">{{ t.nombreEnPlace | number: '1.0-0' }}</div>
                        <div class="text-xs text-teal-700">sur {{ t.nombreDossiers | number: '1.0-0' }}</div>
                    </div>
                    <div class="px-4 py-3 rounded border bg-orange-50 border-orange-200" [class.opacity-50]="!t.nombrePasDeCredit">
                        <div class="text-xs text-orange-700">Pas de crédit dans SAF</div>
                        <div class="text-2xl font-bold text-orange-800">{{ t.nombrePasDeCredit | number: '1.0-0' }}</div>
                        <div class="text-xs text-orange-700">octroi non suivi</div>
                    </div>
                    <div class="px-4 py-3 rounded border bg-red-50 border-red-200" [class.opacity-50]="!t.nombreSansNumero">
                        <div class="text-xs text-red-700">Sans numéro de membre</div>
                        <div class="text-2xl font-bold text-red-800">{{ t.nombreSansNumero | number: '1.0-0' }}</div>
                        <div class="text-xs text-red-700">rien à rapprocher</div>
                    </div>
                    <div class="px-4 py-3 rounded border bg-gray-50 border-gray-200">
                        <div class="text-xs text-gray-600">Montant octroyé dans SAF</div>
                        <div class="text-2xl font-bold text-gray-800">{{ t.montantOctroye | number: '1.0-0' }}</div>
                        <div class="text-xs text-gray-600">demandé : {{ t.montantDemande | number: '1.0-0' }}</div>
                    </div>
                    <div class="px-4 py-3 rounded border bg-blue-50 border-blue-200">
                        <div class="text-xs text-blue-700">Encours</div>
                        <div class="text-2xl font-bold text-blue-800">{{ t.encours | number: '1.0-0' }}</div>
                        <div class="text-xs text-blue-700">crédits vivants</div>
                    </div>
                    <div class="px-4 py-3 rounded border bg-yellow-50 border-yellow-200" [class.opacity-50]="!t.nombreEnRetard">
                        <div class="text-xs text-yellow-800">En retard</div>
                        <div class="text-2xl font-bold text-yellow-900">{{ t.nombreEnRetard | number: '1.0-0' }}</div>
                        <div class="text-xs text-yellow-800">{{ t.montantEnRetard | number: '1.0-0' }} GNF impayés</div>
                    </div>
                </div>

                <div class="flex flex-wrap items-center gap-3 mb-3 text-sm">
                    <span *ngFor="let s of t.situations" class="px-2 py-1 rounded bg-gray-100">{{ s.nom }} : <strong>{{ s.nombre }}</strong></span>
                    <span *ngIf="t.creditsHorsDigi > 0" class="text-gray-500" pTooltip="Crédits SAF des mêmes membres qu'aucun dossier digi n'explique : anciens crédits, ou dossiers montés hors plateforme. Comptés à part.">
                        <i class="pi pi-info-circle"></i> {{ t.creditsHorsDigi }} autre(s) crédit(s) de ces membres, hors digi
                    </span>
                </div>

                <p-selectButton [options]="vueSituationOptions" [ngModel]="vueSituation()" (ngModelChange)="vueSituation.set($event)" optionLabel="label" optionValue="value" class="block mb-3"></p-selectButton>

                <p-table [value]="dossiersAffiches()" styleClass="p-datatable-sm" [paginator]="dossiersAffiches().length > 25" [rows]="25" [globalFilterFields]="['dossier.nom', 'dossier.prenom', 'dossier.numeroMembre']">
                    <ng-template pTemplate="header">
                        <tr>
                            <th>Client</th>
                            <th>Nature</th>
                            <th class="text-right">Demandé</th>
                            <th>Octroi</th>
                            <th>Point de service</th>
                            <th>Dans SAF</th>
                            <th class="text-right">Octroyé</th>
                            <th class="text-right">Encours</th>
                            <th class="text-right">Retard</th>
                            <th style="width: 3rem"></th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-s>
                        <tr>
                            <td>
                                <strong>{{ s.dossier.nom }} {{ s.dossier.prenom }}</strong>
                                <div class="text-xs text-gray-500">{{ s.dossier.numeroMembre || 'sans numéro' }}</div>
                            </td>
                            <td class="text-xs">{{ natureCourte(s.dossier.natureClient) }}</td>
                            <td class="text-right">{{ s.dossier.montantDemande | number: '1.0-0' }}</td>
                            <td>
                                {{ s.dossier.dateOctroi | date: 'dd/MM/yyyy' }}
                                <div class="text-xs text-gray-500">il y a {{ s.dossier.joursDepuisOctroi }} j</div>
                            </td>
                            <td class="text-xs">{{ s.dossier.pointVente }}</td>
                            <td>
                                <p-tag [value]="s.credit ? s.credit.situation : s.etatLibelle" [severity]="severiteEtat(s)"></p-tag>
                                <div class="text-xs text-gray-500" *ngIf="s.credit">crédit {{ s.credit.numCredito }}</div>
                            </td>
                            <td class="text-right">{{ s.credit ? (s.credit.monCredito | number: '1.0-0') : '—' }}</td>
                            <td class="text-right">{{ s.credit ? (s.credit.monSaldo | number: '1.0-0') : '—' }}</td>
                            <td class="text-right">
                                <span *ngIf="s.credit?.enRetard" class="text-red-600 font-semibold">{{ s.credit.joursRetard }} j</span>
                                <span *ngIf="!s.credit?.enRetard" class="text-gray-400">—</span>
                            </td>
                            <td>
                                <button pButton icon="pi pi-wallet" class="p-button-text p-button-sm" (click)="ouvrirSituationFinanciere(s.dossier)" pTooltip="Comptes et derniers mouvements du membre"></button>
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="10" class="text-center text-gray-500 py-4">
                                {{ vueSituation() === 'exceptions' ? 'Tous les octrois de ce périmètre sont en place dans SAF.' : 'Aucun dossier.' }}
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </ng-container>
        </div>

        <!-- Situation financière du membre -->
        <p-dialog [(visible)]="ficheVisible" [modal]="true" [style]="{ width: '56rem' }" [header]="ficheTitre()">
            <div *ngIf="fiche().loading" class="text-center py-6"><i class="pi pi-spin pi-spinner text-2xl"></i></div>
            <div *ngIf="!fiche().loading">
                <p class="text-sm text-gray-500">
                    Comptes du membre dans SAF et leurs soldes. Chaque consultation de mouvements est enregistrée dans le journal des consultations.
                </p>
                <p-table [value]="fiche().comptes" styleClass="p-datatable-sm" dataKey="numCuenta">
                    <ng-template pTemplate="header">
                        <tr>
                            <th style="width: 3rem"></th>
                            <th>Compte</th>
                            <th>Type</th>
                            <th>État</th>
                            <th class="text-right">Solde</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-c let-expanded="expanded">
                        <tr>
                            <td>
                                <button pButton [icon]="expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'" class="p-button-text p-button-sm" [pRowToggler]="c" (click)="chargerMouvements(c)"></button>
                            </td>
                            <td class="font-mono text-sm">{{ c.numCuenta }}</td>
                            <td class="text-xs">{{ c.desProducto || c.tipoCuenta || '—' }}</td>
                            <td><p-tag [value]="c.indEstado || '?'" [severity]="c.indEstado === 'A' ? 'success' : 'warn'"></p-tag></td>
                            <td class="text-right font-semibold">{{ c.saldo | number: '1.0-0' }}</td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="expandedrow" let-c>
                        <tr>
                            <td colspan="5" class="bg-gray-50">
                                <div *ngIf="mouvements()[c.numCuenta] as m; else chargement">
                                    <div class="text-xs font-semibold mb-2">Derniers mouvements</div>
                                    <table class="w-full text-sm" *ngIf="m.length">
                                        <tr *ngFor="let t of m">
                                            <td class="py-1">{{ t.fecMovimiento | date: 'dd/MM/yyyy' }}</td>
                                            <td class="py-1">{{ t.desMovimiento || t.libelle }}</td>
                                            <td class="py-1 text-right">{{ t.monMovimiento | number: '1.0-0' }}</td>
                                        </tr>
                                    </table>
                                    <div *ngIf="!m.length" class="text-gray-500 text-sm">Aucun mouvement sur ce compte.</div>
                                </div>
                                <ng-template #chargement><i class="pi pi-spin pi-spinner"></i></ng-template>
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="5" class="text-center text-gray-500 py-3">Aucun compte lu dans SAF pour ce membre.</td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </p-dialog>
    `
})
export class CreditsOctroyesComponent implements OnInit {
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

    readonly aujourdhui = new Date();

    du: Date | null = null;
    au: Date | null = null;
    recherche = '';

    niveau = signal<string>('auto');
    niveaux = signal<string[]>([]);
    filtreDelegation = signal<{ id: number; libelle: string } | null>(null);
    filtreAgence = signal<{ id: number; libelle: string } | null>(null);
    filtrePs = signal<{ id: number; libelle: string } | null>(null);

    state = signal<{ loading: boolean; lignes: LigneSynthese[]; nombreTotal: number; montantTotal: number }>({
        loading: false,
        lignes: [],
        nombreTotal: 0,
        montantTotal: 0
    });

    situation = signal<{ loading: boolean; dossiers: SituationDossier[]; totaux: Totaux | null }>({
        loading: false,
        dossiers: [],
        totaux: null
    });

    /**
     * Signal, et non simple champ : « dossiersAffiches » est un computed, et un computed ne
     * suit que des signaux. En champ ordinaire, basculer « Tous les dossiers » n'aurait rien
     * rafraichi — le tableau serait reste sur les exceptions sans rien dire.
     */
    vueSituation = signal<'exceptions' | 'tous'>('exceptions');
    readonly vueSituationOptions = [
        { label: 'Ce qui cloche', value: 'exceptions' },
        { label: 'Tous les dossiers', value: 'tous' }
    ];

    ficheVisible = false;
    fiche = signal<{ loading: boolean; dossier: CreditOctroye | null; comptes: any[] }>({ loading: false, dossier: null, comptes: [] });
    mouvements = signal<{ [compte: string]: any[] }>({});

    ngOnInit(): void {
        this.charger();
    }

    // ==================== synthèse ====================

    charger(): void {
        this.state.update((s) => ({ ...s, loading: true }));
        this.userService
            .getCreditsOctroyesSynthese$(this.filtres())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    const s = r.data?.['syntheseOctrois'];
                    this.niveau.set(s?.niveau ?? 'auto');
                    this.niveaux.set(s?.niveaux ?? []);
                    this.state.set({
                        loading: false,
                        lignes: this.aplatirNatures(s?.lignes ?? []),
                        nombreTotal: s?.nombreTotal ?? 0,
                        montantTotal: s?.montantTotal ?? 0
                    });
                },
                error: (e) => {
                    this.state.update((st) => ({ ...st, loading: false }));
                    this.erreur(e);
                }
            });
    }

    private aplatirNatures(lignes: LigneSynthese[]): LigneSynthese[] {
        return lignes.map((l) => ({ ...l, natures: this.enTableau(l.parNature) }));
    }

    private aplatirSituations(t: Totaux | null): Totaux | null {
        return t ? { ...t, situations: this.enTableau(t.parSituationSaf) } : null;
    }

    private enTableau(objet?: { [cle: string]: number }): { nom: string; nombre: number }[] {
        return Object.entries(objet ?? {}).map(([nom, nombre]) => ({ nom, nombre }));
    }

    /** Le rapprochement précédent ne vaut plus rien dès que le périmètre change. */
    private oublierSituation(): void {
        this.situation.set({ loading: false, dossiers: [], totaux: null });
    }

    descendre(ligne: LigneSynthese): void {
        if (!this.peutDescendre()) return;
        const cible = { id: ligne.id, libelle: ligne.libelle };
        if (this.niveau() === 'delegation') {
            this.filtreDelegation.set(cible);
            this.filtreAgence.set(null);
            this.filtrePs.set(null);
            this.niveau.set('agence');
        } else if (this.niveau() === 'agence') {
            this.filtreAgence.set(cible);
            this.filtrePs.set(null);
            this.niveau.set('ps');
        } else {
            this.filtrePs.set(cible);
        }
        this.oublierSituation();
        this.charger();
    }

    remonter(jusqua: 'delegation' | 'agence' | null): void {
        if (jusqua === null) {
            this.filtreDelegation.set(null);
            this.filtreAgence.set(null);
            this.filtrePs.set(null);
            this.niveau.set(this.niveaux()[0] ?? 'auto');
        } else if (jusqua === 'delegation') {
            this.filtreAgence.set(null);
            this.filtrePs.set(null);
            this.niveau.set('agence');
        } else {
            this.filtrePs.set(null);
            this.niveau.set('ps');
        }
        this.oublierSituation();
        this.charger();
    }

    /** Vrai tant qu'il reste un niveau plus fin que celui affiché. */
    peutDescendre(): boolean {
        return this.niveau() !== 'ps' || !this.filtrePs();
    }

    titreNiveau(): string {
        return this.niveau() === 'delegation' ? 'Par délégation' : this.niveau() === 'agence' ? 'Par agence' : 'Par point de service';
    }

    libelleColonneNiveau(): string {
        return this.niveau() === 'delegation' ? 'Délégation' : this.niveau() === 'agence' ? 'Agence' : 'Point de service';
    }

    // ==================== situation SAF ====================

    rapprocher(): void {
        this.situation.update((s) => ({ ...s, loading: true }));
        this.userService
            .getCreditsOctroyesSituation$(this.filtres())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.situation.set({
                        loading: false,
                        dossiers: r.data?.['dossiers'] ?? [],
                        totaux: this.aplatirSituations(r.data?.['totaux'] ?? null)
                    });
                },
                error: (e) => {
                    this.situation.set({ loading: false, dossiers: [], totaux: null });
                    this.erreur(e);
                }
            });
    }

    /**
     * Par défaut, seuls les dossiers qui ne sont PAS en place : une liste de 3 000 lignes
     * « mis en place » ne se lit pas, alors que les douze octrois sans crédit dans SAF sont
     * exactement ce sur quoi on agit.
     */
    dossiersAffiches = computed(() => {
        const tous = this.situation().dossiers;
        return this.vueSituation() === 'tous' ? tous : tous.filter((d) => d.etatCode !== 'EN_PLACE' || d.credit?.enRetard);
    });

    severiteEtat(s: SituationDossier): 'success' | 'warn' | 'danger' | 'info' | 'secondary' {
        if (s.etatCode === 'SANS_NUMERO_MEMBRE') return 'danger';
        if (s.etatCode === 'PAS_DE_CREDIT') return 'warn';
        switch (s.credit?.situation) {
            case 'Contentieux':
                return 'danger';
            case 'Apure':
                return 'warn';
            case 'Solde':
                return 'secondary';
            case 'Annule':
            case 'Transfere':
                return 'info';
            default:
                return s.credit?.enRetard ? 'warn' : 'success';
        }
    }

    // ==================== situation financière ====================

    ouvrirSituationFinanciere(dossier: CreditOctroye): void {
        this.ficheVisible = true;
        this.mouvements.set({});
        this.fiche.set({ loading: true, dossier, comptes: [] });
        this.userService
            .getCreditOctroyeSituationFinanciere$(dossier.demandeIndividuelId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.fiche.set({ loading: false, dossier, comptes: this.extraireComptes(r) });
                },
                error: (e) => {
                    this.fiche.set({ loading: false, dossier, comptes: [] });
                    this.erreur(e);
                }
            });
    }

    /**
     * ebanking rend la fiche signalétique telle quelle, d'où cette extraction défensive : la
     * forme a déjà changé une fois, et un écran qui plante sur une clé absente est pire qu'un
     * écran qui n'affiche rien.
     */
    private extraireComptes(r: IResponse): any[] {
        const fiche = r.data?.['fiche'];
        const donnees = fiche?.data ?? fiche;
        const comptes = donnees?.comptes ?? donnees?.cuentas ?? [];
        return Array.isArray(comptes) ? comptes : [];
    }

    ficheTitre(): string {
        const d = this.fiche().dossier;
        return d ? `Situation financière — ${d.nom} ${d.prenom} (${d.numeroMembre})` : 'Situation financière';
    }

    chargerMouvements(compte: any): void {
        const numero = compte?.numCuenta;
        const dossier = this.fiche().dossier;
        if (!numero || !dossier || this.mouvements()[numero]) return;
        this.userService
            .getCreditOctroyeMouvements$(dossier.demandeIndividuelId, numero, 5)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    const t = r.data?.['transactions'];
                    const liste = t?.production ?? t?.mouvements ?? [];
                    this.mouvements.update((m) => ({ ...m, [numero]: Array.isArray(liste) ? liste : [] }));
                },
                error: (e) => {
                    this.mouvements.update((m) => ({ ...m, [numero]: [] }));
                    this.erreur(e);
                }
            });
    }

    // ==================== divers ====================

    private filtres(): FiltresCreditsOctroyes {
        return {
            niveau: this.niveau(),
            delegationId: this.filtreDelegation()?.id ?? null,
            agenceId: this.filtreAgence()?.id ?? null,
            posId: this.filtrePs()?.id ?? null,
            du: this.jour(this.du),
            au: this.jour(this.au),
            recherche: this.recherche?.trim() || null
        };
    }

    private jour(d: Date | null): string | null {
        if (!d) return null;
        const mois = `${d.getMonth() + 1}`.padStart(2, '0');
        const jour = `${d.getDate()}`.padStart(2, '0');
        return `${d.getFullYear()}-${mois}-${jour}`;
    }

    filtresActifs(): boolean {
        return !!this.du || !!this.au || !!this.recherche?.trim();
    }

    effacer(): void {
        this.du = null;
        this.au = null;
        this.recherche = '';
        this.oublierSituation();
        this.charger();
    }

    /** « Demande de credit Pour Groupe Solidaire » tient mal dans une colonne. */
    natureCourte(nature?: string | null): string {
        if (!nature) return '—';
        const n = nature.toLowerCase();
        if (n.includes('groupe')) return 'Groupe solidaire';
        if (n.includes('fonctionnaire')) return 'Fonctionnaire';
        if (n.includes('pme') || n.includes('pmi')) return 'PME/PMI';
        if (n.includes('particulier') || n.includes('individuel')) return 'Particulier';
        if (n.includes('agricole')) return 'Agricole';
        return nature;
    }

    private erreur(e: any): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: e?.message || "Impossible de lire les crédits octroyés",
            life: 6000
        });
    }
}
