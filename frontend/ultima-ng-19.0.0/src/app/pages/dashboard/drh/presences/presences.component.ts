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
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import * as XLSX from 'xlsx';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DrhService } from '@/service/drh.service';

interface StatutPresence {
    label: string;
    severity: 'success' | 'warn' | 'danger' | 'info' | 'secondary' | 'contrast';
}

const STATUTS_PRESENCE: { [k: string]: StatutPresence } = {
    PRESENT: { label: 'Présent', severity: 'success' },
    PRESENT_DECLARE: { label: 'Présent (déclaré DRH)', severity: 'success' },
    RETARD: { label: "Retard à l'arrivée", severity: 'warn' },
    DEPART_ANTICIPE: { label: "Départ avant l'heure", severity: 'warn' },
    RETARD_ET_DEPART: { label: 'Retard + départ anticipé', severity: 'danger' },
    ABSENT_JUSTIFIE: { label: 'Absent justifié', severity: 'info' },
    ABSENT_NON_JUSTIFIE: { label: 'Absent NON justifié', severity: 'danger' }
};

/**
 * Présences badgeuse (DRH) : import du CSV de la porte, synthèse quotidienne
 * type feuille « GESTION PORTE », détail par salarié et pointages non rapprochés.
 */
@Component({
    selector: 'app-presences',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, CalendarModule, ConfirmDialogModule, DropdownModule, InputTextModule, SelectButtonModule, TableModule, TagModule, ToastModule, TooltipModule],
    providers: [MessageService, ConfirmationService],
    template: `
        <p-toast />
        <p-confirmDialog />
        <div class="card">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h4 class="m-0">Gestion des présences</h4>
                    <span class="text-sm text-color-secondary">
                        Import du fichier badgeuse (export « access-attendance » CSV, séparateur virgule ou point-virgule) et rapprochement
                        automatique avec le personnel, les congés et permissions validés.
                    </span>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <input type="file" #fichier accept=".csv,text/csv" style="display:none"
                           (change)="importer($event)" />
                    <button pButton icon="pi pi-upload" label="Importer un fichier badgeuse"
                            [loading]="importEnCours()" (click)="fichier.click()"></button>
                    <button pButton icon="pi pi-refresh" label="Recalculer la période" class="p-button-outlined"
                            pTooltip="Repasse le rapprochement sur la période affichée (personnel badgé uniquement)"
                            [loading]="recalculEnCours()" (click)="recalculer()"></button>
                    <button pButton icon="pi pi-file-excel" label="Exporter Excel" class="p-button-outlined p-button-success"
                            pTooltip="Synthèse par jour, par semaine et détail par salarié de la période affichée"
                            [loading]="exportEnCours()" (click)="exporterExcel()"></button>
                    <p-calendar [(ngModel)]="du" dateFormat="dd/mm/yy" [showIcon]="true" placeholder="Du" (onSelect)="charger()" />
                    <p-calendar [(ngModel)]="au" dateFormat="dd/mm/yy" [showIcon]="true" placeholder="Au" (onSelect)="charger()" />
                </div>
            </div>

            <div class="p-3 border-round mb-4 text-sm" style="background:var(--surface-100)" *ngIf="dernierImport() as r">
                <b><i class="pi pi-check-circle text-green-600 mr-1"></i> Import terminé :</b>
                {{ r.lignesLues }} lignes lues — {{ r.pointagesRapproches }} pointages rapprochés,
                {{ r.pointagesNonRapproches }} non rapprochés (visiteurs / matricules inconnus),
                {{ r.lignesIgnorees }} ignorées.
                Période {{ r.premierJour | date: 'dd/MM' }} au {{ r.dernierJour | date: 'dd/MM/yyyy' }} —
                {{ r.joursRapproches }} jour(s) ouvré(s) recalculé(s).
                <div class="text-orange-600" *ngFor="let a of r.avertissements">{{ a }}</div>
            </div>

            <p-selectButton [options]="vues" [(ngModel)]="vue" optionLabel="label" optionValue="value" class="mb-3 block" />

            <!-- ===== Synthèse par jour ===== -->
            <p-table *ngIf="vue === 'synthese'" [value]="synthese()" responsiveLayout="scroll">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Jour</th>
                        <th pTooltip="Personnes effectivement venues : présents + retards + départs avant l'heure (chacune comptée une fois)">Total présents</th>
                        <th pTooltip="Présents à l'heure (dont présents déclarés par la DRH : oubli de badge)">Présents à l'heure</th>
                        <th>Retards à l'arrivée</th><th>Départs avant l'heure</th>
                        <th>Absents justifiés</th><th>Absents NON justifiés</th><th>Effectif contrôlé</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-s>
                    <tr>
                        <td class="font-medium">
                            {{ s.jour | date: 'EEEE dd/MM/yyyy' }}
                            <p-tag *ngIf="s.enCours" value="Journée en cours" severity="info" class="ml-2"
                                   pTooltip="Chiffres provisoires : recalculés toutes les heures jusqu'à l'heure de sortie réglementaire" />
                        </td>
                        <td class="text-green-700 font-bold">{{ s.presentsTotal }}</td>
                        <td class="text-green-600">{{ s.presents }}</td>
                        <td [class.text-orange-500]="s.retards > 0">{{ s.retards }}</td>
                        <td [class.text-orange-500]="s.departsAnticipes > 0">{{ s.departsAnticipes }}</td>
                        <td>{{ s.absentsJustifies }}</td>
                        <td [class.text-red-500]="s.absentsNonJustifies > 0" class="font-medium">{{ s.absentsNonJustifies }}</td>
                        <td>{{ s.total }}</td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr><td colspan="8" class="text-center text-color-secondary">
                        Aucune donnée sur la période — importez un fichier badgeuse
                    </td></tr>
                </ng-template>
            </p-table>

            <!-- ===== Synthèse par semaine (V150) : moyennes par jour ouvré ===== -->
            <p-table *ngIf="vue === 'semaine'" [value]="semaines()" responsiveLayout="scroll">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Semaine</th><th>Jours ouvrés</th>
                        <th pTooltip="Moyenne par jour des personnes effectivement venues">Total présents / jour</th>
                        <th>Retards / jour</th><th>Départs avant l'heure / jour</th>
                        <th>Absents justifiés / jour</th><th>Absents NON justifiés / jour</th>
                        <th>Effectif contrôlé / jour</th>
                        <th pTooltip="Somme des présents sur la semaine / somme des effectifs contrôlés">Taux de présence</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-w>
                    <tr>
                        <td class="font-medium">{{ w.semaine }}
                            <p-tag *ngIf="w.enCours" value="En cours" severity="info" class="ml-2" pTooltip="Semaine non terminée : moyennes provisoires" />
                        </td>
                        <td>{{ w.joursOuvres }}</td>
                        <td class="text-green-700 font-bold">{{ w.presentsTotalMoyen | number: '1.0-1' }}</td>
                        <td [class.text-orange-500]="w.retardsMoyen > 0">{{ w.retardsMoyen | number: '1.0-1' }}</td>
                        <td [class.text-orange-500]="w.departsAnticipesMoyen > 0">{{ w.departsAnticipesMoyen | number: '1.0-1' }}</td>
                        <td>{{ w.absentsJustifiesMoyen | number: '1.0-1' }}</td>
                        <td [class.text-red-500]="w.absentsNonJustifiesMoyen > 0">{{ w.absentsNonJustifiesMoyen | number: '1.0-1' }}</td>
                        <td>{{ w.effectifMoyen | number: '1.0-1' }}</td>
                        <td class="font-medium" [class.text-green-700]="w.tauxPresence >= 80" [class.text-orange-500]="w.tauxPresence < 80">{{ w.tauxPresence | number: '1.0-1' }} %</td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr><td colspan="9" class="text-center text-color-secondary">Aucune semaine contrôlée sur la période</td></tr>
                </ng-template>
            </p-table>

            <!-- ===== Déclarations DRH (V150) : oubli de badge, mission, formation, maladie ===== -->
            <div *ngIf="vue === 'declarations'">
                <div class="p-2 border-round mb-2 text-sm" style="background:var(--surface-100)">
                    Déclarations saisies par la DRH depuis <b>Gestion du personnel</b> (action « Déclarer une absence / un oubli de badge »).
                    Un oubli de badge donne le statut « Présent (déclaré DRH) » ; les autres motifs justifient l'absence.
                    Retirer une déclaration recalcule les jours concernés.
                </div>
                <p-table [value]="declarations()" responsiveLayout="scroll" [paginator]="true" [rows]="25">
                    <ng-template pTemplate="header">
                        <tr><th>Salarié</th><th>Mat.</th><th>Du</th><th>Au</th><th>Motif</th><th>Commentaire</th><th>Déclarée par</th><th></th></tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-d>
                        <tr>
                            <td>{{ d.nom || '—' }}</td>
                            <td>{{ d.matricule }}</td>
                            <td>{{ d.jourDebut | date: 'dd/MM/yyyy' }}</td>
                            <td>{{ d.jourFin | date: 'dd/MM/yyyy' }}</td>
                            <td><p-tag [value]="libelleMotif(d.motif)" [severity]="d.motif === 'OUBLI_BADGE' ? 'success' : 'info'" /></td>
                            <td>{{ d.commentaire || '—' }}</td>
                            <td class="text-sm text-color-secondary">{{ d.declareParNom }} · {{ d.createdAt | date: 'dd/MM HH:mm' }}</td>
                            <td><button pButton icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm"
                                        pTooltip="Retirer la déclaration" (click)="supprimerDeclaration(d)"></button></td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr><td colspan="8" class="text-center text-color-secondary">Aucune déclaration sur la période</td></tr>
                    </ng-template>
                </p-table>
            </div>

            <!-- ===== Détail par salarié ===== -->
            <div *ngIf="vue === 'detail'">
                <div class="mb-2 flex flex-wrap gap-2 items-center">
                    <p-dropdown [options]="statutsOptions" optionLabel="label" optionValue="value"
                                [(ngModel)]="statutFiltre" [showClear]="true"
                                placeholder="Tous les statuts" (onChange)="charger()" />
                    <span class="p-input-icon-left">
                        <i class="pi pi-search"></i>
                        <input pInputText type="text" [ngModel]="recherche()" (ngModelChange)="recherche.set($event)"
                               placeholder="Rechercher par nom ou matricule…" [style]="{ width: '280px' }" />
                    </span>
                </div>
                <p-table [value]="presencesFiltrees()" responsiveLayout="scroll" [paginator]="true" [rows]="25" [rowHover]="true">
                    <ng-template pTemplate="header">
                        <tr><th>Jour</th><th>Salarié</th><th>Mat.</th><th>Dir.</th><th>Entrée</th><th>Sortie</th>
                            <th pTooltip="Sorties en heures de travail reconstruites depuis le journal des mouvements (pause 13h-14h30 déduite)">Hors bureau</th>
                            <th pTooltip="Minutes au-delà de la pause d'une heure (fenêtre 13h00-14h30)">Dépass. pause</th>
                            <th>Statut</th>
                            <th pTooltip="Déclaration de la DRH : oubli de badge, mission, formation, maladie…">Observation</th></tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-p>
                        <tr>
                            <td>{{ p.jour | date: 'dd/MM/yyyy' }}</td>
                            <td>{{ p.nom }}</td>
                            <td>{{ p.matricule }}</td>
                            <td>{{ p.departementCode || '—' }}</td>
                            <td>{{ p.premiereEntree || '—' }}</td>
                            <td>{{ p.derniereSortie || '—' }}</td>
                            <td [class.text-orange-500]="p.minutesHorsBureau > 0">
                                {{ p.minutesHorsBureau > 0 ? duree(p.minutesHorsBureau) + ' (' + p.nbSortiesTravail + ' sortie' + (p.nbSortiesTravail > 1 ? 's' : '') + ')' : '—' }}
                            </td>
                            <td [class.text-red-500]="p.minutesDepassementPause > 0">
                                {{ p.minutesDepassementPause > 0 ? '+' + p.minutesDepassementPause + ' min' : '—' }}
                            </td>
                            <td>
                                <p-tag [value]="statut(p.statut).label" [severity]="statut(p.statut).severity" />
                                <div class="text-xs text-blue-500 mt-1" *ngIf="p.enCours"
                                     pTooltip="Statut provisoire : la journée n'est pas terminée">
                                    <i class="pi pi-clock mr-1"></i>Journée en cours
                                </div>
                                <div class="text-xs text-color-secondary" *ngIf="p.minutesRetard > 0">+{{ p.minutesRetard }} min de retard</div>
                                <div class="text-xs text-color-secondary" *ngIf="p.minutesDepart > 0 && !p.enCours">parti {{ p.minutesDepart }} min trop tôt</div>
                                <div class="text-xs" *ngIf="p.justification">{{ libelleJustification(p.justification) }}</div>
                            </td>
                            <td class="text-sm" [class.text-color-secondary]="!p.observation">{{ p.observation || '—' }}</td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr><td colspan="10" class="text-center text-color-secondary">Aucune présence sur la période</td></tr>
                    </ng-template>
                </p-table>
            </div>

            <!-- ===== Pointages non rapprochés ===== -->
            <div *ngIf="vue === 'non-rapproches'">
                <div class="p-2 border-round mb-2 text-sm" style="background:var(--yellow-50);border:1px solid var(--yellow-300)">
                    Badges sans matricule reconnu (visiteurs, libellés texte type « CHAUFFEUR », matricules absents du
                    fichier du personnel). Régularisez les matricules dans le fichier du personnel puis réimportez.
                </div>
                <div class="mb-2">
                    <span class="p-input-icon-left">
                        <i class="pi pi-search"></i>
                        <input pInputText type="text" [ngModel]="recherche()" (ngModelChange)="recherche.set($event)"
                               placeholder="Rechercher par libellé…" [style]="{ width: '280px' }" />
                    </span>
                </div>
                <p-table [value]="nonRapprochesFiltres()" responsiveLayout="scroll" [paginator]="true" [rows]="25">
                    <ng-template pTemplate="header">
                        <tr><th>Jour</th><th>Libellé badge</th><th>Entrée</th><th>Sortie</th></tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-p>
                        <tr>
                            <td>{{ p.jour | date: 'dd/MM/yyyy' }}</td>
                            <td>{{ p.nomBrut }}</td>
                            <td>{{ p.premiereEntree }}</td>
                            <td>{{ p.derniereSortie }}</td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr><td colspan="4" class="text-center text-color-secondary">Aucun pointage non rapproché</td></tr>
                    </ng-template>
                </p-table>
            </div>
        </div>
    `
})
export class PresencesComponent implements OnInit {
    private drhService = inject(DrhService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private destroyRef = inject(DestroyRef);

    synthese = signal<any[]>([]);
    semaines = signal<any[]>([]);
    declarations = signal<any[]>([]);
    exportEnCours = signal(false);
    presences = signal<any[]>([]);
    nonRapproches = signal<any[]>([]);
    dernierImport = signal<any | null>(null);
    importEnCours = signal(false);
    recalculEnCours = signal(false);

    recalculer(): void {
        if (!this.du || !this.au) return;
        this.recalculEnCours.set(true);
        this.drhService.recalculerPresences$(this.toIso(this.du), this.toIso(this.au))
            .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                next: (r) => {
                    this.recalculEnCours.set(false);
                    this.messageService.add({ severity: 'success', summary: 'Recalculé', detail: r.message || 'Rapprochement recalculé' });
                    this.charger();
                },
                error: (e) => {
                    this.recalculEnCours.set(false);
                    this.erreur(e);
                }
            });
    }

    vue: 'synthese' | 'semaine' | 'detail' | 'declarations' | 'non-rapproches' = 'synthese';
    vues = [
        { label: 'Synthèse par jour', value: 'synthese' },
        { label: 'Synthèse par semaine', value: 'semaine' },
        { label: 'Détail par salarié', value: 'detail' },
        { label: 'Déclarations DRH', value: 'declarations' },
        { label: 'Non rapprochés', value: 'non-rapproches' }
    ];

    readonly MOTIFS: { [k: string]: string } = {
        OUBLI_BADGE: 'Oubli de badge', MISSION: 'Mission', FORMATION: 'Formation', MALADIE: 'Maladie', AUTRE: 'Autre',
        CONGE: 'En congé validé', PERMISSION: 'Permission sociale validée'
    };

    libelleMotif(m: string): string {
        return this.MOTIFS[m] || m;
    }

    libelleJustification(j: string): string {
        return this.MOTIFS[j] || j;
    }

    statutFiltre: string | null = null;
    /** Recherche libre par nom ou matricule (détail + non rapprochés). */
    recherche = signal('');

    presencesFiltrees = computed(() => {
        const q = this.recherche().trim().toLowerCase();
        if (!q) return this.presences();
        return this.presences().filter((p: any) =>
            (p.nom || '').toLowerCase().includes(q) || String(p.matricule || '').includes(q));
    });

    nonRapprochesFiltres = computed(() => {
        const q = this.recherche().trim().toLowerCase();
        if (!q) return this.nonRapproches();
        return this.nonRapproches().filter((p: any) => (p.nomBrut || '').toLowerCase().includes(q));
    });
    statutsOptions = Object.keys(STATUTS_PRESENCE).map((k) => ({ label: STATUTS_PRESENCE[k].label, value: k }));

    du: Date = (() => { const d = new Date(); d.setDate(d.getDate() - 7); return d; })();
    au: Date = new Date();

    statut(s: string): StatutPresence {
        return STATUTS_PRESENCE[s] || { label: s, severity: 'secondary' };
    }

    duree(minutes: number): string {
        const h = Math.floor(minutes / 60), m = minutes % 60;
        return h > 0 ? `${h} h ${String(m).padStart(2, '0')}` : `${m} min`;
    }

    ngOnInit(): void {
        this.charger();
    }

    private toIso(d: Date): string {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    charger(): void {
        if (!this.du || !this.au) return;
        const du = this.toIso(this.du), au = this.toIso(this.au);
        this.drhService.synthesePresences$(du, au).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.synthese.set((r.data as any)?.synthese || []),
            error: (e) => this.erreur(e)
        });
        this.drhService.presences$(du, au, this.statutFiltre || undefined).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.presences.set((r.data as any)?.presences || [])
        });
        this.drhService.pointagesNonRapproches$(du, au).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.nonRapproches.set((r.data as any)?.pointages || [])
        });
        this.drhService.syntheseSemainePresences$(du, au).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.semaines.set((r.data as any)?.semaines || [])
        });
        this.drhService.declarationsPresence$(du, au).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.declarations.set((r.data as any)?.declarations || [])
        });
    }

    supprimerDeclaration(d: any): void {
        this.confirmationService.confirm({
            header: 'Retirer la déclaration',
            message: `Retirer la déclaration « ${this.libelleMotif(d.motif)} » de ${d.nom || d.matricule} du ${d.jourDebut} au ${d.jourFin} ? Les présences de ces jours seront recalculées.`,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui, retirer', rejectLabel: 'Annuler', acceptButtonStyleClass: 'p-button-danger',
            accept: () => this.drhService.supprimerDeclarationPresence$(d.declarationId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Retirée', detail: 'Déclaration retirée, présences recalculées' });
                    this.charger();
                },
                error: (e) => this.erreur(e)
            })
        });
    }

    /** Export Excel (V150) : synthèse par jour, par semaine et détail par salarié sur la période affichée. */
    exporterExcel(): void {
        if (!this.du || !this.au) return;
        const du = this.toIso(this.du), au = this.toIso(this.au);
        this.exportEnCours.set(true);
        // Le détail exporté ignore le filtre statut de l'écran : on recharge la période complète
        this.drhService.presences$(du, au).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => {
                this.exportEnCours.set(false);
                const details = ((r.data as any)?.presences || []) as any[];
                const feuilleJour = this.synthese().map((s: any) => ({
                    'Jour': s.jour, 'Total présents': s.presentsTotal, "Présents à l'heure": s.presents,
                    'Retards': s.retards, "Départs avant l'heure": s.departsAnticipes,
                    'Absents justifiés': s.absentsJustifies, 'Absents non justifiés': s.absentsNonJustifies,
                    'Effectif contrôlé': s.total
                }));
                const feuilleSemaine = this.semaines().map((w: any) => ({
                    'Semaine': w.semaine, 'Jours ouvrés': w.joursOuvres, 'Total présents / jour': w.presentsTotalMoyen,
                    'Retards / jour': w.retardsMoyen, "Départs avant l'heure / jour": w.departsAnticipesMoyen,
                    'Absents justifiés / jour': w.absentsJustifiesMoyen, 'Absents non justifiés / jour': w.absentsNonJustifiesMoyen,
                    'Effectif contrôlé / jour': w.effectifMoyen, 'Taux de présence (%)': w.tauxPresence
                }));
                const feuilleDetail = details.map((p: any) => ({
                    'Jour': p.jour, 'Salarié': p.nom, 'Matricule': p.matricule, 'Direction': p.departementCode || '',
                    'Entrée': p.premiereEntree || '', 'Sortie': p.derniereSortie || '',
                    'Statut': this.statut(p.statut).label, 'Retard (min)': p.minutesRetard || 0,
                    'Départ anticipé (min)': p.minutesDepart || 0, 'Hors bureau (min)': p.minutesHorsBureau || 0,
                    'Dépassement pause (min)': p.minutesDepassementPause || 0,
                    'Justification': p.justification ? this.libelleJustification(p.justification) : '',
                    'Observation': p.observation || ''
                }));
                const classeur = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(classeur, XLSX.utils.json_to_sheet(feuilleJour), 'Synthèse par jour');
                XLSX.utils.book_append_sheet(classeur, XLSX.utils.json_to_sheet(feuilleSemaine), 'Synthèse par semaine');
                XLSX.utils.book_append_sheet(classeur, XLSX.utils.json_to_sheet(feuilleDetail), 'Détail par salarié');
                XLSX.writeFile(classeur, `presences_${du}_${au}.xlsx`);
            },
            error: (e) => {
                this.exportEnCours.set(false);
                this.erreur(e);
            }
        });
    }

    importer(event: Event): void {
        const input = event.target as HTMLInputElement;
        const fichier = input.files?.[0];
        input.value = '';
        if (!fichier) return;
        this.importEnCours.set(true);
        this.drhService.importerPresences$(fichier).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => {
                this.importEnCours.set(false);
                const resultat = (r.data as any)?.resultat;
                this.dernierImport.set(resultat);
                this.messageService.add({ severity: 'success', summary: 'Importé', detail: 'Fichier badgeuse importé et rapproché' });
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
