import { DonneesSafComponent } from './donnees-saf.component';
import { AgentPortefeuille, ContentieuxLigne, ContentieuxListe } from '@/interface/portefeuille-affectation';
import { IResponse } from '@/interface/response';
import { CapacitesSignalement, MOTIFS_SIGNALEMENT, MotifSignalementTelephone, SignalementTelephone, libelleMotifSignalement, libelleStatutSignalement, severiteStatutSignalement } from '@/interface/signalement-telephone';
import { SignalementTelephoneService } from '@/service/signalement-telephone.service';
import { Router } from '@angular/router';
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
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

/**
 * Les dossiers au contentieux du périmètre (V166) : ceux que SAF a passés au judiciaire et
 * ceux que l'agence a déclarés dans digi. Le DA y confie les dossiers à ses agents de
 * recouvrement et lève le contentieux ; le DR consulte sa délégation.
 */
@Component({
    selector: 'app-portefeuille-contentieux',
    standalone: true,
    imports: [CommonModule, DonneesSafComponent, FormsModule, TableModule, ButtonModule, SelectModule, InputTextModule, TagModule, DialogModule, TextareaModule, ToastModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>
        <div class="card">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div>
                    <h2 class="text-xl font-semibold m-0">Dossiers au contentieux</h2> <app-donnees-saf></app-donnees-saf>
                    <div class="text-sm text-gray-500">
                        Crédits passés au judiciaire par la banque et crédits passés au contentieux par l'agence dans digi.
                        Le crédit reste dans le portefeuille de son agent de crédit : la perte reste la sienne.
                    </div>
                </div>
                <button
                    pButton
                    icon="pi pi-flag"
                    [label]="nbSignalementsOuverts() ? 'Signalements (' + nbSignalementsOuverts() + ')' : 'Signalements'"
                    class="p-button-outlined"
                    [class.p-button-warning]="nbSignalementsOuverts() > 0"
                    pTooltip="Numéros signalés au point de service et leur suivi"
                    (click)="ouvrirListeSignalements()"
                ></button>
                <button pButton icon="pi pi-refresh" class="p-button-text" (click)="charger()" [loading]="loading()" pTooltip="Recharger"></button>
            </div>

        <!-- Dialog : signaler un numéro (DA, DR, DE) — même circuit que l'état TT1 (V156) -->
        <p-dialog header="Signaler le numéro de téléphone" [visible]="showSignalement()" (visibleChange)="!$event && fermerSignalement()" [modal]="true" [style]="{ width: '560px' }">
            <div *ngIf="ligneSignalee as e">
                <p class="m-0 mb-3 text-sm">
                    <strong>{{ e.nomCliente }}</strong> ({{ e.codCliente }})<span *ngIf="e.numCredito"> — crédit {{ e.numCredito }}</span><span *ngIf="e.desAgencia || e.pointVente"> — {{ e.desAgencia || e.pointVente }}</span>
                </p>
                <div class="border rounded p-2 mb-3 text-sm" style="font-variant-numeric: tabular-nums">
                    <div class="text-xs text-gray-500 uppercase mb-1">Numéros constatés dans SAF</div>
                    <div [class.text-gray-400]="!e.telPrincipal">Principal : {{ e.telPrincipal || '—' }}</div>
                    <div [class.text-gray-400]="!e.telSecundario">Secondaire : {{ e.telSecundario || '—' }}</div>
                    <div [class.text-gray-400]="!e.telOtro">Autre : {{ e.telOtro || '—' }}</div>
                </div>
                <label class="block text-sm font-medium mb-1">Motif <span class="text-red-500">*</span></label>
                <p-select [options]="motifsSignalement" [(ngModel)]="motifSignalement" optionLabel="label" optionValue="value" styleClass="w-full mb-3" appendTo="body" placeholder="Choisir un motif"></p-select>
                <label class="block text-sm font-medium mb-1">Commentaire</label>
                <textarea pTextarea [(ngModel)]="commentaireSignalement" rows="3" class="w-full" maxlength="2000" placeholder="Ce que le client ou l'agent vous a indiqué"></textarea>
                <p class="text-xs text-gray-500 mt-2">
                    Le point de service reçoit une notification et un courriel. C'est l'agent de crédit qui saisira le nouveau numéro et suivra le circuit habituel de validation par le directeur d'agence.
                </p>
            </div>
            <ng-template pTemplate="footer">
                <button pButton label="Annuler" class="p-button-text" (click)="fermerSignalement()"></button>
                <button pButton label="Envoyer le signalement" icon="pi pi-send" [loading]="envoiSignalement()" [disabled]="!motifSignalement" (click)="envoyerSignalement()"></button>
            </ng-template>
        </p-dialog>

        <!-- Dialog : suivi des signalements du périmètre -->
        <p-dialog header="Signalements de numéros" [visible]="showListeSignalements()" (visibleChange)="!$event && showListeSignalements.set(false)" [modal]="true" [style]="{ width: '900px' }">
            <p-table [value]="listeSignalements()" [loading]="loadingSignalements()" responsiveLayout="scroll">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Signalé le</th>
                        <th>Client</th>
                        <th>Point de service</th>
                        <th>Motif</th>
                        <th>Statut</th>
                        <th>Suivi</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-sig>
                    <tr>
                        <td class="whitespace-nowrap">{{ sig.signaleAt | date: 'dd/MM/yyyy HH:mm' }}<div class="text-xs text-gray-500">{{ sig.signalePar }} ({{ sig.signaleParRole }})</div></td>
                        <td><span class="font-medium">{{ sig.nomClient || sig.codCliente }}</span><div class="text-xs text-gray-500">{{ sig.codCliente }}<span *ngIf="sig.numCredito"> · crédit {{ sig.numCredito }}</span></div></td>
                        <td>{{ sig.pointVente || sig.codAgencia }}</td>
                        <td>{{ libelleMotifSig(sig.motif) }}<div class="text-xs text-gray-500" *ngIf="sig.commentaire">{{ sig.commentaire }}</div></td>
                        <td><p-tag [value]="libelleStatutSig(sig.statut)" [severity]="severiteStatutSig(sig.statut)"></p-tag></td>
                        <td class="text-sm">
                            <div *ngIf="sig.prisPar">Pris par {{ sig.prisPar }} le {{ sig.prisAt | date: 'dd/MM/yyyy' }}</div>
                            <div *ngIf="sig.demandeId">Demande {{ sig.demandeId }} — {{ sig.demandeStatut }}</div>
                            <div *ngIf="sig.motifClassement" class="text-gray-500">Classé : {{ sig.motifClassement }}</div>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr><td colspan="6" class="text-center text-gray-500 py-6">Aucun signalement sur votre périmètre.</td></tr>
                </ng-template>
            </p-table>
        </p-dialog>


            <div *ngIf="erreur()" class="border border-orange-400 bg-orange-50 text-orange-800 rounded p-3 mb-4">
                <i class="pi pi-exclamation-triangle mr-2"></i>{{ erreur() }}
            </div>

            <!-- Indicateurs -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Dossiers</div>
                    <div class="text-xl font-bold">{{ lignes().length }}</div>
                    <div class="text-xs text-gray-500">{{ nbSaf() }} judiciaire(s) · {{ nbAgence() }} déclaré(s) par l'agence</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Encours (GNF)</div>
                    <div class="text-xl font-bold">{{ encoursTotal() | number: '1.0-0' }}</div>
                    <div class="text-xs text-gray-500">capital restant dû</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Montant en retard</div>
                    <div class="text-xl font-bold text-red-600">{{ retardTotal() | number: '1.0-0' }}</div>
                    <div class="text-xs text-gray-500">capital et intérêts impayés</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Sans agent de recouvrement</div>
                    <div class="text-xl font-bold" [class.text-red-600]="nbSansAgent() > 0">{{ nbSansAgent() }}</div>
                    <div class="text-xs text-gray-500">{{ agents().length }} agent(s) de recouvrement dans l'agence</div>
                </div>
            </div>

            <!-- Filtres et action -->
            <div class="flex flex-wrap gap-3 items-center mb-3">
                <p-select *ngIf="pointsService().length > 1" [options]="pointsService()" [ngModel]="psFiltre()" (ngModelChange)="psFiltre.set($event)" optionLabel="label" optionValue="value" placeholder="Point de service" [showClear]="true" styleClass="w-64" appendTo="body"></p-select>
                <p-select [options]="origineOptions" [ngModel]="origineFiltre()" (ngModelChange)="origineFiltre.set($event)" optionLabel="label" optionValue="value" placeholder="Origine" [showClear]="true" styleClass="w-56" appendTo="body"></p-select>
                <input pInputText type="text" [ngModel]="recherche()" (ngModelChange)="recherche.set($event)" placeholder="Client, n° crédit, agent…" class="w-64" />
                <span class="text-sm text-gray-500">{{ lignesFiltrees().length }} dossier(s)</span>
                <button *ngIf="peutAffecter()" pButton icon="pi pi-gavel" label="Confier au recouvrement" class="ml-auto" [disabled]="!selection.length || !agents().length" (click)="ouvrirAffectation(selection)"></button>
            </div>

            <p-table
                [value]="lignesFiltrees()"
                [loading]="loading()"
                styleClass="p-datatable-sm"
                [rowHover]="true"
                [(selection)]="selection"
                dataKey="numCredito"
                [paginator]="lignesFiltrees().length > 30"
                [rows]="30"
                sortMode="single"
                responsiveLayout="scroll"
            >
                <ng-template pTemplate="header">
                    <tr>
                        <th style="width: 3rem" *ngIf="peutAffecter()"><p-tableHeaderCheckbox></p-tableHeaderCheckbox></th>
                        <th pSortableColumn="codAgencia">Point de service <p-sortIcon field="codAgencia"></p-sortIcon></th>
                        <th>N° crédit</th>
                        <th>Client</th>
                        <th>Téléphones</th>
                        <th>Type</th>
                        <th class="text-right" pSortableColumn="encours">Encours (GNF) <p-sortIcon field="encours"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="joursRetard">Retard <p-sortIcon field="joursRetard"></p-sortIcon></th>
                        <th class="text-right" pSortableColumn="montantRetard">Montant en retard <p-sortIcon field="montantRetard"></p-sortIcon></th>
                        <th>Origine</th>
                        <th>Agent de recouvrement</th>
                        <th>Agent de crédit</th>
                        <th></th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-l>
                    <tr>
                        <td *ngIf="peutAffecter()"><p-tableCheckbox [value]="l"></p-tableCheckbox></td>
                        <td>
                            {{ l.codAgencia }} {{ l.pointVente }}
                            <div class="text-xs text-gray-500">{{ l.agence }}</div>
                        </td>
                        <td class="font-mono text-sm">{{ l.numCredito }}</td>
                        <td>
                            <div class="font-semibold">{{ l.nomCliente }}</div>
                            <div class="text-xs text-gray-500">{{ l.codCliente }}</div>
                        </td>
                        <td class="whitespace-nowrap text-sm" style="font-variant-numeric: tabular-nums">
                            <div [class.text-gray-400]="!l.telPrincipal">
                                {{ l.telPrincipal || '—' }}
                                <i class="pi pi-exclamation-triangle text-orange-500 text-xs ml-1" *ngIf="formatDouteux(l.telPrincipal)" title="Ce numéro n'a pas 9 chiffres"></i>
                            </div>
                            <div [class.text-gray-400]="!l.telSecundario">{{ l.telSecundario || '—' }}</div>
                            <div [class.text-gray-400]="!l.telOtro">{{ l.telOtro || '—' }}</div>
                            <div class="mt-1" *ngIf="signalementDe(l.codCliente) as sig">
                                <p-tag [value]="libelleStatutSig(sig.statut)" [severity]="severiteStatutSig(sig.statut)" styleClass="text-xs"></p-tag>
                            </div>
                            <a class="text-xs text-primary cursor-pointer hover:underline" *ngIf="!signalementDe(l.codCliente) && capacites().estAgent" (click)="modifierNumero(l)">
                                <i class="pi pi-pencil text-xs mr-1"></i>Modifier le numéro
                            </a>
                            <a class="text-xs text-orange-600 cursor-pointer hover:underline" *ngIf="!signalementDe(l.codCliente) && capacites().peutSignaler" (click)="ouvrirSignalement(l)">
                                <i class="pi pi-flag text-xs mr-1"></i>Signaler le numéro
                            </a>
                        </td>
                        <td class="text-sm">{{ l.typeCredit }}</td>
                        <td class="text-right">{{ l.encours | number: '1.0-0' }}</td>
                        <td class="text-right" [class.text-red-600]="(l.joursRetard || 0) > 30">{{ l.joursRetard || 0 }} j</td>
                        <td class="text-right" [class.text-red-600]="l.montantRetard > 0">{{ l.montantRetard | number: '1.0-0' }}</td>
                        <td>
                            <p-tag *ngIf="l.origine === 'SAF'" severity="danger" value="judiciaire (SAF)"></p-tag>
                            <ng-container *ngIf="l.origine === 'AGENCE'">
                                <p-tag severity="warn" value="déclaré par l'agence"></p-tag>
                                <div class="text-xs text-gray-500">
                                    {{ l.dateDeclaration | date: 'dd/MM/yyyy' }}<span *ngIf="l.declareParNom"> · {{ l.declareParNom }}</span>
                                </div>
                                <div class="text-xs text-gray-500 italic" *ngIf="l.motif">« {{ l.motif }} »</div>
                            </ng-container>
                        </td>
                        <td>
                            <span *ngIf="l.agentRecouvrementNom; else sansAgent" class="font-semibold">{{ l.agentRecouvrementNom }}</span>
                            <ng-template #sansAgent><p-tag severity="danger" value="non confié"></p-tag></ng-template>
                        </td>
                        <td class="text-sm">{{ l.agentCreditNom || '—' }}</td>
                        <td class="whitespace-nowrap">
                            <button *ngIf="peutAffecter()" pButton icon="pi pi-gavel" class="p-button-text p-button-sm" pTooltip="Confier ce dossier au recouvrement" (click)="ouvrirAffectation([l])"></button>
                            <button *ngIf="peutAffecter() && l.origine === 'AGENCE'" pButton icon="pi pi-undo" class="p-button-text p-button-sm p-button-warning" pTooltip="Lever le contentieux" (click)="lever(l)"></button>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr>
                        <td [attr.colspan]="peutAffecter() ? 13 : 12" class="text-center text-gray-500 py-6">
                            Aucun dossier au contentieux sur ce périmètre. Les dossiers apparaissent dès que la banque passe un crédit au judiciaire,
                            ou que l'agence le passe au contentieux depuis « Affectation du portefeuille ».
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <!-- Confier au recouvrement -->
        <p-dialog header="Confier au recouvrement" [visible]="showAffectation()" (visibleChange)="!$event && showAffectation.set(false)" [modal]="true" [style]="{ width: '520px' }">
            <p class="mb-3">
                <strong>{{ cibles.length }}</strong> dossier(s), <strong>{{ encoursCibles() | number: '1.0-0' }}</strong> GNF d'encours.
            </p>
            <div class="mb-3">
                <label class="block text-sm font-semibold mb-1">Agent de recouvrement</label>
                <p-select [options]="agents()" [(ngModel)]="agentChoisi" optionLabel="nom" optionValue="userId" placeholder="Choisir un agent" styleClass="w-full" appendTo="body"></p-select>
                <small class="text-gray-500" *ngIf="!agents().length">Aucun agent de votre agence ne porte la fonction contentieux : activez-la dans « Gestion des agents ».</small>
            </div>
            <div class="mb-2">
                <label class="block text-sm font-semibold mb-1">Motif (facultatif)</label>
                <textarea pTextarea [(ngModel)]="motif" rows="2" class="w-full" placeholder="Ex. : mise en demeure envoyée"></textarea>
            </div>
            <ng-template pTemplate="footer">
                <button pButton label="Annuler" class="p-button-text" (click)="showAffectation.set(false)"></button>
                <button pButton label="Confirmer" icon="pi pi-check" [loading]="envoi()" [disabled]="!agentChoisi" (click)="confirmer()"></button>
            </ng-template>
        </p-dialog>
    `
})
export class PortefeuilleContentieuxComponent implements OnInit {
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);
    private signalementService = inject(SignalementTelephoneService);
    private router = inject(Router);

    // ── Téléphones clients et signalement : même circuit que l'état TT1 (V156) ──
    capacites = signal<CapacitesSignalement>({ peutSignaler: false, estAgent: false, niveau: 'PS', ouverts: {} });
    motifsSignalement = MOTIFS_SIGNALEMENT;
    motifSignalement: MotifSignalementTelephone | null = null;
    commentaireSignalement = '';
    ligneSignalee: any | null = null;
    showSignalement = signal(false);
    envoiSignalement = signal(false);
    showListeSignalements = signal(false);
    listeSignalements = signal<SignalementTelephone[]>([]);
    loadingSignalements = signal(false);
    libelleMotifSig = libelleMotifSignalement;
    libelleStatutSig = libelleStatutSignalement;
    severiteStatutSig = severiteStatutSignalement;

    lignes = signal<ContentieuxLigne[]>([]);
    agents = signal<AgentPortefeuille[]>([]);
    peutAffecter = signal(false);
    loading = signal(false);
    envoi = signal(false);
    erreur = signal<string | null>(null);

    psFiltre = signal<string | null>(null);
    origineFiltre = signal<'SAF' | 'AGENCE' | null>(null);
    recherche = signal('');

    selection: ContentieuxLigne[] = [];
    cibles: ContentieuxLigne[] = [];
    agentChoisi: number | null = null;
    motif = '';
    showAffectation = signal(false);

    origineOptions = [
        { label: 'Passé au judiciaire (SAF)', value: 'SAF' },
        { label: "Déclaré par l'agence", value: 'AGENCE' }
    ];

    pointsService = computed(() => {
        const m = new Map<string, string>();
        for (const l of this.lignes()) if (!m.has(l.codAgencia)) m.set(l.codAgencia, `${l.codAgencia} ${l.pointVente || ''}`.trim());
        return [...m.entries()].map(([value, label]) => ({ label, value })).sort((a, b) => a.label.localeCompare(b.label));
    });

    lignesFiltrees = computed(() => {
        const q = this.recherche().trim().toLowerCase();
        return this.lignes().filter(
            (l) =>
                (this.psFiltre() == null || l.codAgencia === this.psFiltre()) &&
                (this.origineFiltre() == null || l.origine === this.origineFiltre()) &&
                (!q ||
                    `${l.nomCliente || ''} ${l.codCliente} ${l.numCredito} ${l.agentRecouvrementNom || ''} ${l.agentCreditNom || ''}`
                        .toLowerCase()
                        .includes(q))
        );
    });

    nbSaf = computed(() => this.lignes().filter((l) => l.origine === 'SAF').length);
    nbAgence = computed(() => this.lignes().filter((l) => l.origine === 'AGENCE').length);
    nbSansAgent = computed(() => this.lignes().filter((l) => !l.agentRecouvrementId).length);
    encoursTotal = computed(() => this.lignes().reduce((t, l) => t + (l.encours || 0), 0));
    retardTotal = computed(() => this.lignes().reduce((t, l) => t + (l.montantRetard || 0), 0));
    encoursCibles = () => this.cibles.reduce((t, l) => t + (l.encours || 0), 0);

    ngOnInit(): void {
        this.chargerCapacites();
        this.charger();
    }

    // ── Téléphones clients et signalement (identique à l'état TT1) ──

    nbSignalementsOuverts(): number {
        return Object.keys(this.capacites().ouverts || {}).length;
    }

    /** Signalement ouvert pour ce client, s'il y en a un (étiquette sur la ligne). */
    signalementDe(codCliente: string): SignalementTelephone | null {
        return this.capacites().ouverts?.[codCliente] || null;
    }

    /** Un numéro guinéen a neuf chiffres : au-delà ou en deçà, on le signale à l'œil. */
    formatDouteux(numero?: string | null): boolean {
        if (!numero) return false;
        return numero.replace(/\D/g, '').length !== 9;
    }

    private chargerCapacites(): void {
        this.signalementService
            .capacitesEtOuverts()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    const d: any = r.data || {};
                    this.capacites.set({
                        peutSignaler: !!d.peutSignaler,
                        estAgent: !!d.estAgent,
                        niveau: d.niveau || 'PS',
                        ouverts: d.ouverts || {}
                    });
                },
                error: () => {}
            });
    }

    /** Agent de crédit : le formulaire de changement de numéro s'ouvre pré-rempli. */
    modifierNumero(ligne: any): void {
        this.router.navigate(['/dashboards/changement-telephone/agent'], { queryParams: { codCliente: ligne.codCliente } });
    }

    ouvrirSignalement(ligne: any): void {
        this.ligneSignalee = ligne;
        this.motifSignalement = ligne.telPrincipal ? null : 'ABSENT';
        this.commentaireSignalement = '';
        this.showSignalement.set(true);
    }

    fermerSignalement(): void {
        this.showSignalement.set(false);
        this.ligneSignalee = null;
    }

    envoyerSignalement(): void {
        const e = this.ligneSignalee;
        if (!e || !this.motifSignalement) return;
        this.envoiSignalement.set(true);
        this.signalementService
            .signaler({
                codCliente: e.codCliente,
                nomClient: e.nomCliente,
                numCredito: e.numCredito,
                codAgencia: e.codAgencia,
                motif: this.motifSignalement,
                commentaire: this.commentaireSignalement.trim() || undefined
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.envoiSignalement.set(false);
                    this.fermerSignalement();
                    this.messageService.add({ severity: 'success', summary: 'Signalement transmis', detail: 'Le point de service a été notifié', life: 5000 });
                    this.chargerCapacites();
                },
                error: (err) => {
                    this.envoiSignalement.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || "Le signalement n'a pas pu être enregistré", life: 6000 });
                }
            });
    }

    ouvrirListeSignalements(): void {
        this.showListeSignalements.set(true);
        this.loadingSignalements.set(true);
        this.signalementService
            .listPerimetre()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.listeSignalements.set((r.data as any)?.signalements || []);
                    this.loadingSignalements.set(false);
                },
                error: (err) => {
                    this.loadingSignalements.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Liste indisponible', life: 6000 });
                }
            });
    }

    charger(): void {
        this.loading.set(true);
        this.erreur.set(null);
        this.selection = [];
        this.userService
            .getContentieux$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    const data = (r.data?.contentieux || null) as ContentieuxListe | null;
                    this.lignes.set(data?.lignes || []);
                    this.agents.set(data?.agents || []);
                    this.peutAffecter.set(!!data?.peutAffecter);
                    this.loading.set(false);
                },
                error: (err) => {
                    this.loading.set(false);
                    this.lignes.set([]);
                    this.erreur.set(typeof err === 'string' ? err : (err as any)?.message || 'Liste indisponible');
                }
            });
    }

    ouvrirAffectation(lignes: ContentieuxLigne[]): void {
        if (!lignes.length) return;
        const points = new Set(lignes.map((l) => l.codAgencia));
        if (points.size > 1) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Un point de service à la fois',
                detail: 'Les dossiers se confient point de service par point de service : filtrez-en un.'
            });
            return;
        }
        this.cibles = lignes;
        this.agentChoisi = null;
        this.motif = '';
        this.showAffectation.set(true);
    }

    confirmer(): void {
        if (!this.cibles.length || !this.agentChoisi) return;
        this.envoi.set(true);
        this.userService
            .affecterCredits$({
                codAgencia: this.cibles[0].codAgencia,
                numCreditos: this.cibles.map((l) => l.numCredito),
                agentUserId: this.agentChoisi,
                motif: this.motif.trim() || undefined,
                typeAffectation: 'CONTENTIEUX'
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.envoi.set(false);
                    this.showAffectation.set(false);
                    this.messageService.add({ severity: 'success', summary: 'Recouvrement', detail: r.message });
                    this.charger();
                },
                error: (err) => {
                    this.envoi.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Affectation refusée', detail: typeof err === 'string' ? err : (err as any)?.message });
                }
            });
    }

    lever(l: ContentieuxLigne): void {
        this.userService
            .leverContentieux$({ codAgencia: l.codAgencia, numCreditos: [l.numCredito] })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.messageService.add({ severity: 'success', summary: 'Contentieux levé', detail: r.message });
                    this.charger();
                },
                error: (err) => this.messageService.add({ severity: 'error', summary: 'Levée refusée', detail: typeof err === 'string' ? err : (err as any)?.message })
            });
    }
}
