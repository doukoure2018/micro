import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DrhService } from '@/service/drh.service';
import { UserService } from '@/service/user.service';

/**
 * Gestion des mouvements (DRH) : import du journal de la porte (export access-log),
 * journal brut, synthèse par agent (sorties travail / dépassements de pause 13h-14h30,
 * pause ignorée le vendredi), détail par personne et correspondances badge -> matricule.
 */
@Component({
    selector: 'app-mouvements',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, CalendarModule, DropdownModule, InputTextModule, SelectButtonModule, TableModule, TagModule, ToastModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast />
        <div class="card">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h4 class="m-0">Gestion des mouvements</h4>
                    <span class="text-sm text-color-secondary">
                        Journal des entrées/sorties de la porte : pause déjeuner 13h00–14h30 non comptée
                        (ignorée le vendredi), sorties en heures de travail et dépassements mesurés.
                    </span>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <input type="file" #fichier accept=".csv,text/csv" style="display:none" (change)="importer($event)" />
                    <button pButton icon="pi pi-upload" label="Importer un journal access-log"
                            [loading]="importEnCours()" (click)="fichier.click()"></button>
                    <p-calendar [(ngModel)]="du" dateFormat="dd/mm/yy" [showIcon]="true" placeholder="Du" (onSelect)="charger()" />
                    <p-calendar [(ngModel)]="au" dateFormat="dd/mm/yy" [showIcon]="true" placeholder="Au" (onSelect)="charger()" />
                </div>
            </div>

            <div class="p-3 border-round mb-4 text-sm" style="background:var(--surface-100)" *ngIf="dernierImport() as r">
                <b><i class="pi pi-check-circle text-green-600 mr-1"></i> Import terminé :</b>
                {{ r.lignesLues }} lignes lues — {{ r.personnelsIdentifies }} mouvements du personnel,
                {{ r.visiteurs }} visiteurs, {{ r.nonIdentifies }} non identifiés, {{ r.anomalies }} anomalies badge,
                {{ r.doublonsIgnores }} doublons ignorés (déjà importés).
                <span *ngIf="r.badgesAppris > 0">{{ r.badgesAppris }} badge(s) appris (correspondance badge → matricule).</span>
                <span *ngIf="r.premierJour">Période {{ r.premierJour | date: 'dd/MM' }} au {{ r.dernierJour | date: 'dd/MM/yyyy' }}.</span>
                <div class="text-orange-600" *ngFor="let a of r.avertissements">{{ a }}</div>
            </div>

            <p-selectButton [options]="vuesPrincipales" [ngModel]="vuePrincipale()"
                            (ngModelChange)="changerVuePrincipale($event)"
                            optionLabel="label" optionValue="value" class="mb-3 block" />

            <!-- ===== Journal ===== -->
            <div *ngIf="vuePrincipale() === 'journal'">
                <div class="flex flex-wrap items-center gap-3 mb-3">
                    <p-selectButton [options]="typesJournal" [ngModel]="typeJournal()" (ngModelChange)="changerTypeJournal($event)"
                                    optionLabel="label" optionValue="value" />
                    <span class="p-input-icon-left">
                        <i class="pi pi-search"></i>
                        <input pInputText type="text" [ngModel]="recherche()" (ngModelChange)="recherche.set($event)"
                               placeholder="Rechercher par nom, matricule ou badge…" [style]="{ width: '300px' }" />
                    </span>
                    <span class="text-sm text-color-secondary" *ngIf="mouvements().length > 0">
                        {{ mouvementsFiltres().length }} mouvement(s) — {{ nbEntrees() }} entrée(s) / {{ nbSorties() }} sortie(s)
                    </span>
                </div>
                <p-table [value]="mouvementsFiltres()" responsiveLayout="scroll" [paginator]="true" [rows]="25"
                         [rowHover]="true" [loading]="chargement()">
                    <ng-template pTemplate="header">
                        <tr><th>Jour</th><th>Heure</th><th>Sens</th><th>Nom</th><th>Mat.</th><th>Badge</th><th>Résultat</th></tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-m>
                        <tr>
                            <td>{{ m.jour | date: 'EEE dd/MM/yyyy' }}</td>
                            <td class="font-medium">{{ m.heure?.substring(0, 5) }}</td>
                            <td>
                                <p-tag [value]="m.sens === 'ENTRY' ? 'Entrée' : 'Sortie'"
                                       [severity]="m.sens === 'ENTRY' ? 'success' : 'warn'" />
                            </td>
                            <td>
                                {{ m.nomPersonnel || m.nomBrut }}
                                <div class="text-xs text-color-secondary" *ngIf="m.nomPersonnel && m.nomPersonnel !== m.nomBrut">
                                    badgeuse : {{ m.nomBrut }}
                                </div>
                                <p-tag *ngIf="m.visiteur" value="Visiteur" severity="info" styleClass="ml-1" />
                            </td>
                            <td>{{ m.matricule || '—' }}</td>
                            <td class="text-sm">{{ m.badgeNo || '—' }}</td>
                            <td>
                                <p-tag *ngIf="m.resultat !== 'ACCESS'" [value]="m.resultat" severity="danger" />
                                <span *ngIf="m.resultat === 'ACCESS'" class="text-green-600 text-sm">OK</span>
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr><td colspan="7" class="text-center text-color-secondary">
                            Aucun mouvement sur la période — importez un journal access-log
                        </td></tr>
                    </ng-template>
                </p-table>
            </div>

            <!-- ===== Synthèse par agent ===== -->
            <div *ngIf="vuePrincipale() === 'synthese'">
                <div class="flex flex-wrap items-center gap-3 mb-3">
                    <span class="p-input-icon-left">
                        <i class="pi pi-search"></i>
                        <input pInputText type="text" [ngModel]="recherche()" (ngModelChange)="recherche.set($event)"
                               placeholder="Rechercher par nom ou matricule…" [style]="{ width: '300px' }" />
                    </span>
                    <span class="text-sm text-color-secondary">
                        Tri : les plus grosses sorties (travail + dépassement de pause) en premier.
                        Cliquez sur une ligne pour le détail jour par jour.
                    </span>
                </div>
                <p-table [value]="syntheseFiltree()" responsiveLayout="scroll" [paginator]="true" [rows]="25"
                         [rowHover]="true" [loading]="chargement()">
                    <ng-template pTemplate="header">
                        <tr>
                            <th>Agent</th><th>Mat.</th><th>Jours</th><th>Pauses</th>
                            <th>Sorties travail</th><th>Hors bureau</th><th>Dépassement pause</th><th>Retours non badgés</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-s>
                        <tr class="cursor-pointer" (click)="ouvrirPersonne(s.matricule)">
                            <td class="font-medium">{{ s.nom }}</td>
                            <td>{{ s.matricule }}</td>
                            <td>{{ s.joursActifs }}</td>
                            <td>{{ s.nbPauses }}</td>
                            <td [class.text-orange-500]="s.nbSortiesTravail > 0">{{ s.nbSortiesTravail }}</td>
                            <td [class.text-orange-500]="s.minutesHorsBureau > 0" class="font-medium">{{ duree(s.minutesHorsBureau) }}</td>
                            <td [class.text-red-500]="s.minutesDepassementPause > 0" class="font-medium">{{ duree(s.minutesDepassementPause) }}</td>
                            <td [class.text-color-secondary]="s.nonCloturees === 0">{{ s.nonCloturees }}</td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr><td colspan="8" class="text-center text-color-secondary">Aucun mouvement identifié sur la période</td></tr>
                    </ng-template>
                </p-table>
            </div>

            <!-- ===== Détail par personne ===== -->
            <div *ngIf="vuePrincipale() === 'personne'">
                <div class="flex flex-wrap items-center gap-2 mb-3">
                    <p-dropdown [options]="optionsAgents()" optionLabel="label" optionValue="value"
                                [ngModel]="matriculeChoisi()" (ngModelChange)="choisirAgent($event)"
                                [filter]="true" filterBy="label" placeholder="Choisir un agent…" [style]="{ minWidth: '320px' }" />
                    <span class="text-sm text-color-secondary" *ngIf="agent() as a">
                        {{ a.jours.length || 0 }} jour(s) avec mouvements sur la période
                    </span>
                </div>
                <p-table [value]="agent()?.jours || []" responsiveLayout="scroll" [loading]="chargement()">
                    <ng-template pTemplate="header">
                        <tr>
                            <th>Jour</th><th>Arrivée</th><th>Départ</th><th>Sorties de la journée</th>
                            <th>Hors bureau</th><th>Dépassement pause</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-j>
                        <tr>
                            <td class="font-medium">{{ j.jour | date: 'EEEE dd/MM/yyyy' }}</td>
                            <td>{{ j.premiereEntree || '—' }}</td>
                            <td>{{ j.derniereSortie || '—' }}</td>
                            <td>
                                <span *ngIf="j.sorties.length === 0" class="text-color-secondary text-sm">Aucune sortie intermédiaire</span>
                                <div class="flex flex-wrap gap-1">
                                    <p-tag *ngFor="let s of j.sorties"
                                           [value]="libelleSortie(s)" [severity]="severiteSortie(s.classement)"
                                           [pTooltip]="tooltipSortie(s)" />
                                </div>
                            </td>
                            <td [class.text-orange-500]="j.minutesHorsBureau > 0" class="font-medium">{{ duree(j.minutesHorsBureau) }}</td>
                            <td [class.text-red-500]="j.minutesDepassementPause > 0" class="font-medium">{{ duree(j.minutesDepassementPause) }}</td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr><td colspan="6" class="text-center text-color-secondary">
                            Choisissez un agent pour voir ses mouvements jour par jour
                        </td></tr>
                    </ng-template>
                </p-table>
                <div class="text-xs text-color-secondary mt-2">
                    <p-tag value="Pause" severity="info" /> dans la plage 13h00–14h30 (non comptée) —
                    <p-tag value="Pause +X min" severity="warn" /> pause dépassée (minutes hors plage) —
                    <p-tag value="Sortie" severity="danger" /> sortie en heures de travail —
                    <p-tag value="Retour non badgé" severity="secondary" /> sortie sans retour badgé.
                    Le vendredi, la pause n'est pas appliquée (sortie à 14h00).
                </div>
            </div>

            <!-- ===== Badges ===== -->
            <div *ngIf="vuePrincipale() === 'badges'">
                <div class="grid">
                    <div class="col-12 lg:col-6">
                        <h5>Badges non rattachés</h5>
                        <div class="p-2 border-round mb-2 text-sm" style="background:var(--yellow-50);border:1px solid var(--yellow-300)">
                            Badges vus à la porte sans matricule reconnu (homonymes, orthographes différentes).
                            Associez-les une fois : les mouvements passés et futurs seront identifiés.
                        </div>
                        <p-table [value]="badgesInconnus()" responsiveLayout="scroll" [paginator]="true" [rows]="10">
                            <ng-template pTemplate="header">
                                <tr><th>Nom badgeuse</th><th>Badge</th><th>Mvts</th><th>Associer à</th><th></th></tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-b>
                                <tr>
                                    <td class="font-medium">{{ b.nomBrut }}</td>
                                    <td class="text-sm">{{ b.badgeNo }}</td>
                                    <td>{{ b.nbMouvements }}</td>
                                    <td>
                                        <p-dropdown [options]="optionsPersonnel()" optionLabel="label" optionValue="value"
                                                    [(ngModel)]="associations[b.badgeNo]" [filter]="true" filterBy="label"
                                                    placeholder="Personnel…" [style]="{ minWidth: '220px' }" appendTo="body" />
                                    </td>
                                    <td>
                                        <button pButton icon="pi pi-link" class="p-button-sm" label="Associer"
                                                [disabled]="!associations[b.badgeNo]"
                                                (click)="associer(b.badgeNo)"></button>
                                    </td>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="emptymessage">
                                <tr><td colspan="5" class="text-center text-color-secondary">Tous les badges vus sont rattachés</td></tr>
                            </ng-template>
                        </p-table>
                    </div>
                    <div class="col-12 lg:col-6">
                        <h5>Correspondances badge → matricule</h5>
                        <div class="mb-2">
                            <span class="p-input-icon-left">
                                <i class="pi pi-search"></i>
                                <input pInputText type="text" [ngModel]="recherche()" (ngModelChange)="recherche.set($event)"
                                       placeholder="Rechercher…" [style]="{ width: '240px' }" />
                            </span>
                        </div>
                        <p-table [value]="correspondancesFiltrees()" responsiveLayout="scroll" [paginator]="true" [rows]="10">
                            <ng-template pTemplate="header">
                                <tr><th>Agent</th><th>Mat.</th><th>Badge</th><th>Source</th></tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-c>
                                <tr>
                                    <td>{{ c.nomPersonnel || '—' }}</td>
                                    <td>{{ c.matricule }}</td>
                                    <td class="text-sm">{{ c.badgeNo }}</td>
                                    <td>
                                        <p-tag [value]="c.source === 'MANUEL' ? 'Manuel' : 'Auto'"
                                               [severity]="c.source === 'MANUEL' ? 'info' : 'secondary'" />
                                    </td>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="emptymessage">
                                <tr><td colspan="4" class="text-center text-color-secondary">Aucune correspondance apprise</td></tr>
                            </ng-template>
                        </p-table>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class MouvementsComponent implements OnInit {
    private drhService = inject(DrhService);
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

    mouvements = signal<any[]>([]);
    synthese = signal<any[]>([]);
    agent = signal<any | null>(null);
    matriculeChoisi = signal<string | null>(null);
    correspondances = signal<any[]>([]);
    badgesInconnus = signal<any[]>([]);
    personnel = signal<any[]>([]);
    dernierImport = signal<any | null>(null);
    importEnCours = signal(false);
    chargement = signal(false);
    recherche = signal('');
    vuePrincipale = signal<string>('journal');
    typeJournal = signal<string>('');
    /** badge_no -> matricule choisi dans le dropdown d'association. */
    associations: { [badgeNo: string]: string } = {};

    vuesPrincipales = [
        { label: 'Journal', value: 'journal' },
        { label: 'Synthèse par agent', value: 'synthese' },
        { label: 'Détail par personne', value: 'personne' },
        { label: 'Badges', value: 'badges' }
    ];
    typesJournal = [
        { label: 'Tous', value: '' },
        { label: 'Personnel', value: 'PERSONNEL' },
        { label: 'Visiteurs', value: 'VISITEUR' },
        { label: 'Non identifiés', value: 'NON_IDENTIFIE' },
        { label: 'Anomalies badge', value: 'ANOMALIE' }
    ];

    du: Date = (() => { const d = new Date(); d.setDate(d.getDate() - 7); return d; })();
    au: Date = new Date();

    mouvementsFiltres = computed(() => {
        const q = this.recherche().trim().toLowerCase();
        if (!q) return this.mouvements();
        return this.mouvements().filter((m: any) =>
            (m.nomBrut || '').toLowerCase().includes(q) ||
            (m.nomPersonnel || '').toLowerCase().includes(q) ||
            String(m.matricule || '').includes(q) ||
            String(m.badgeNo || '').includes(q));
    });
    nbEntrees = computed(() => this.mouvementsFiltres().filter((m: any) => m.sens === 'ENTRY').length);
    nbSorties = computed(() => this.mouvementsFiltres().filter((m: any) => m.sens === 'EXIT').length);

    syntheseFiltree = computed(() => {
        const q = this.recherche().trim().toLowerCase();
        if (!q) return this.synthese();
        return this.synthese().filter((s: any) =>
            (s.nom || '').toLowerCase().includes(q) || String(s.matricule || '').includes(q));
    });

    correspondancesFiltrees = computed(() => {
        const q = this.recherche().trim().toLowerCase();
        if (!q) return this.correspondances();
        return this.correspondances().filter((c: any) =>
            (c.nomPersonnel || '').toLowerCase().includes(q) ||
            String(c.matricule || '').includes(q) || String(c.badgeNo || '').includes(q));
    });

    optionsAgents = computed(() =>
        this.synthese().map((s: any) => ({ label: `${s.nom} (${s.matricule})`, value: s.matricule })));

    optionsPersonnel = computed(() =>
        this.personnel().map((p: any) => ({ label: `${p.prenom} ${p.nom} (${p.matricule})`, value: p.matricule })));

    ngOnInit(): void {
        this.charger();
    }

    private toIso(d: Date): string {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    duree(minutes: number): string {
        if (!minutes) return '—';
        const h = Math.floor(minutes / 60), m = minutes % 60;
        return h > 0 ? `${h} h ${String(m).padStart(2, '0')}` : `${m} min`;
    }

    libelleSortie(s: any): string {
        switch (s.classement) {
            case 'PAUSE': return `Pause ${s.heureSortie}→${s.heureRetour}`;
            case 'PAUSE_DEPASSEE': return `Pause +${s.minutesComptees} min`;
            case 'SORTIE_TRAVAIL': return `Sortie ${s.heureSortie}→${s.heureRetour} (${s.dureeMinutes} min)`;
            default: return `${s.heureSortie} retour non badgé`;
        }
    }

    severiteSortie(classement: string): 'info' | 'warn' | 'danger' | 'secondary' {
        switch (classement) {
            case 'PAUSE': return 'info';
            case 'PAUSE_DEPASSEE': return 'warn';
            case 'SORTIE_TRAVAIL': return 'danger';
            default: return 'secondary';
        }
    }

    tooltipSortie(s: any): string {
        switch (s.classement) {
            case 'PAUSE': return 'Pause déjeuner dans la plage 13h00–14h30 : non comptée';
            case 'PAUSE_DEPASSEE': return `Sortie ${s.heureSortie}→${s.heureRetour} : ${s.minutesComptees} min hors plage de pause`;
            case 'SORTIE_TRAVAIL': return 'Sortie en heures de travail : durée comptée hors bureau';
            default: return 'Sortie suivie d’une autre sortie : le retour n’a pas été badgé';
        }
    }

    changerVuePrincipale(v: string): void {
        this.vuePrincipale.set(v);
        this.recherche.set('');
        this.charger();
    }

    changerTypeJournal(v: string): void {
        this.typeJournal.set(v);
        this.charger();
    }

    ouvrirPersonne(matricule: string): void {
        this.vuePrincipale.set('personne');
        this.choisirAgent(matricule);
    }

    choisirAgent(matricule: string): void {
        this.matriculeChoisi.set(matricule);
        if (!matricule || !this.du || !this.au) return;
        this.chargement.set(true);
        this.drhService.mouvementsPersonne$(matricule, this.toIso(this.du), this.toIso(this.au))
            .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                next: (r) => {
                    this.chargement.set(false);
                    this.agent.set((r.data as any)?.agent || null);
                },
                error: (e) => {
                    this.chargement.set(false);
                    this.erreur(e);
                }
            });
    }

    charger(): void {
        if (!this.du || !this.au) return;
        const du = this.toIso(this.du), au = this.toIso(this.au);
        const vue = this.vuePrincipale();
        if (vue === 'journal') {
            this.chargement.set(true);
            this.drhService.mouvements$(du, au, this.typeJournal() || undefined)
                .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                    next: (r) => {
                        this.chargement.set(false);
                        this.mouvements.set((r.data as any)?.mouvements || []);
                    },
                    error: (e) => {
                        this.chargement.set(false);
                        this.erreur(e);
                    }
                });
        } else if (vue === 'synthese' || vue === 'personne') {
            this.chargement.set(true);
            this.drhService.syntheseMouvements$(du, au).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                next: (r) => {
                    this.chargement.set(false);
                    this.synthese.set((r.data as any)?.synthese || []);
                    if (vue === 'personne' && this.matriculeChoisi()) this.choisirAgent(this.matriculeChoisi()!);
                },
                error: (e) => {
                    this.chargement.set(false);
                    this.erreur(e);
                }
            });
        } else if (vue === 'badges') {
            this.drhService.badgesMouvements$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                next: (r) => {
                    this.correspondances.set((r.data as any)?.correspondances || []);
                    this.badgesInconnus.set((r.data as any)?.inconnus || []);
                },
                error: (e) => this.erreur(e)
            });
            if (this.personnel().length === 0) {
                this.userService.getActiveInfoPersonnel().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                    next: (r) => this.personnel.set((r.data as any)?.personnels || [])
                });
            }
        }
    }

    associer(badgeNo: string): void {
        const matricule = this.associations[badgeNo];
        if (!matricule) return;
        this.drhService.associerBadgeMouvement$(badgeNo, matricule).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => {
                this.messageService.add({ severity: 'success', summary: 'Badge associé', detail: r.message || 'Correspondance enregistrée' });
                delete this.associations[badgeNo];
                this.charger();
            },
            error: (e) => this.erreur(e)
        });
    }

    importer(event: Event): void {
        const input = event.target as HTMLInputElement;
        const fichier = input.files?.[0];
        input.value = '';
        if (!fichier) return;
        this.importEnCours.set(true);
        this.drhService.importerMouvements$(fichier).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => {
                this.importEnCours.set(false);
                const resultat = (r.data as any)?.resultat;
                this.dernierImport.set(resultat);
                this.messageService.add({ severity: 'success', summary: 'Importé', detail: 'Journal des mouvements importé' });
                if (resultat?.premierJour) {
                    this.du = new Date(resultat.premierJour + 'T00:00:00');
                    this.au = new Date(resultat.dernierJour + 'T00:00:00');
                }
                this.charger();
            },
            error: (e) => {
                this.importEnCours.set(false);
                this.erreur(e);
            }
        });
    }

    private erreur(e: any): void {
        this.messageService.add({
            severity: 'error', summary: 'Erreur',
            detail: e.error?.data?.error || e.error?.message || 'Opération impossible'
        });
    }
}
