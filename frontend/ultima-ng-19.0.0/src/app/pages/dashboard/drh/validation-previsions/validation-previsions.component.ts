import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DrhService, PrevisionConge, PeriodePrevision, DepartementDrh } from '@/service/drh.service';
import { STATUT_PREVISION_LABELS, StatutTag } from '../ma-prevision/ma-prevision.component';

const MOIS_COURTS = ['Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];

interface SegmentMois {
    label: string;
    classe: string;
}

/**
 * Écran DRH : validation finale des prévisions + calendrier consolidé
 * de tout le personnel (agents en lignes, 12 mois en colonnes — comme
 * le fichier Excel de planification, avec la couleur de l'étape du circuit).
 */
@Component({
    selector: 'app-validation-previsions',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, DialogModule, DropdownModule, SelectButtonModule, TableModule, TagModule, ToastModule, TextareaModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast />
        <div class="card">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h4 class="m-0">Prévisions de congés — DRH</h4>
                    <span class="text-sm text-color-secondary">Validation finale et calendrier consolidé du personnel.</span>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <p-selectButton [options]="vues" [(ngModel)]="vue" optionLabel="label" optionValue="value"
                                    (onChange)="chargerVue()" />
                    <label class="font-medium ml-2">Exercice</label>
                    <p-dropdown [options]="exercices" [(ngModel)]="exercice" (onChange)="chargerVue()" />
                    <p-dropdown *ngIf="vue !== 'validation'" [options]="optionsDepartements()" optionLabel="libelle"
                                optionValue="departementId" [(ngModel)]="departementFiltre" [showClear]="true"
                                placeholder="Toutes les directions" (onChange)="chargerCalendrier()" />
                </div>
            </div>

            <!-- ===== Vue validation ===== -->
            <p-table *ngIf="vue === 'validation'" [value]="previsions()" responsiveLayout="scroll" [rowHover]="true">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Agent</th><th>Département</th><th>Périodes</th><th>Total</th><th>Responsable</th><th>Statut</th><th>Actions</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-p>
                    <tr>
                        <td>{{ p.nomComplet }}<div class="text-xs text-color-secondary" *ngIf="p.matricule">Mat. {{ p.matricule }}</div></td>
                        <td>{{ p.departementCode }}</td>
                        <td>
                            <div *ngFor="let per of p.periodes" class="text-sm">
                                {{ per.dateDebut | date: 'dd/MM' }} au {{ per.dateFin | date: 'dd/MM/yyyy' }} ({{ per.nbJours }} j)
                            </div>
                        </td>
                        <td class="font-medium">{{ p.totalJours }} j</td>
                        <td class="text-sm">{{ p.traiteeRespNom }}<br>{{ p.traiteeRespLe | date: 'dd/MM/yyyy' }}</td>
                        <td><p-tag [value]="statutLabel(p.statut).label" [severity]="statutLabel(p.statut).severity" /></td>
                        <td>
                            <div class="flex gap-1">
                                <button pButton icon="pi pi-check" class="p-button-sm" severity="success"
                                        pTooltip="Valider" (click)="valider(p)"></button>
                                <button pButton icon="pi pi-undo" class="p-button-sm" severity="danger"
                                        pTooltip="Renvoyer" (click)="ouvrirRenvoi(p)"></button>
                            </div>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr><td colspan="7" class="text-center text-color-secondary">Aucune prévision en attente pour {{ exercice }}</td></tr>
                </ng-template>
            </p-table>

            <!-- ===== Vue calendrier du personnel ===== -->
            <div *ngIf="vue === 'calendrier'">
                <div class="legende mb-2">
                    <span><i class="pastille st-orange"></i> Enregistrée / soumise</span>
                    <span><i class="pastille st-jaune"></i> Acceptée responsable</span>
                    <span><i class="pastille st-verte"></i> Validée DRH</span>
                </div>
                <div class="cal-wrap">
                    <table class="cal-table">
                        <thead>
                            <tr>
                                <th class="col-agent">Agent</th>
                                <th>Dir.</th>
                                <th>Total</th>
                                <th *ngFor="let m of moisCourts">{{ m }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="let p of toutes()">
                                <td class="col-agent">
                                    {{ p.nomComplet }}
                                    <div class="text-xs text-color-secondary" *ngIf="p.matricule">Mat. {{ p.matricule }}</div>
                                </td>
                                <td>{{ p.departementCode }}</td>
                                <td class="font-medium">{{ p.totalJours }} j</td>
                                <td *ngFor="let m of indicesMois" class="cellule-mois">
                                    <span *ngFor="let seg of segmentsMois(p, m)" class="segment" [ngClass]="seg.classe"
                                          [pTooltip]="statutLabel(p.statut).label" tooltipPosition="top">
                                        {{ seg.label }}
                                    </span>
                                </td>
                            </tr>
                            <tr *ngIf="toutes().length === 0">
                                <td [attr.colspan]="15" class="text-center text-color-secondary p-3">
                                    Aucune prévision pour {{ exercice }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- ===== Vue annuelle : tous les agents sur le calendrier 12 mois ===== -->
            <div *ngIf="vue === 'annuel'">
                <div class="legende mb-2">
                    <span><i class="pastille st-orange"></i> En cours / soumise</span>
                    <span><i class="pastille st-jaune"></i> Acceptée / réajustée (responsable)</span>
                    <span><i class="pastille st-verte"></i> Validée DRH</span>
                    <span class="text-color-secondary">Survolez un jour pour voir les agents</span>
                </div>
                <div class="annee-grille">
                    <div class="mois-carte" *ngFor="let mois of moisAnnuel()">
                        <div class="mois-titre">{{ mois.nom }} {{ exercice }}</div>
                        <div class="jours-entete">
                            <span *ngFor="let j of joursSemaine; let idx = index" [class.we]="idx === 6">{{ j }}</span>
                        </div>
                        <div class="semaine" *ngFor="let semaine of mois.semaines">
                            <ng-container *ngFor="let jour of semaine">
                                <span *ngIf="!jour" class="jour-a vide"></span>
                                <span *ngIf="jour" class="jour-a" [class.dimanche]="jour.dimanche"
                                      [class.occupe]="dotsJour(jour.iso).length > 0"
                                      [pTooltip]="tooltipJourEquipe(jour.iso)" tooltipPosition="top">
                                    <span class="num">{{ jour.num }}</span>
                                    <span class="pts" *ngIf="dotsJour(jour.iso).length > 0">
                                        <i *ngFor="let c of dotsJour(jour.iso)" class="pt" [ngClass]="c"></i>
                                        <b *ngIf="surplusJour(jour.iso) > 0">+{{ surplusJour(jour.iso) }}</b>
                                    </span>
                                </span>
                            </ng-container>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <p-dialog header="Renvoyer la prévision" [(visible)]="renvoiVisible" [modal]="true" [style]="{ width: '480px' }">
            <p class="mb-2">Motif du renvoi (transmis à l'agent et à son responsable) :</p>
            <textarea pTextarea [(ngModel)]="motif" rows="3" class="w-full"></textarea>
            <ng-template pTemplate="footer">
                <button pButton label="Annuler" class="p-button-text" (click)="renvoiVisible = false"></button>
                <button pButton label="Renvoyer" severity="danger" [disabled]="!motif.trim()" (click)="renvoyer()"></button>
            </ng-template>
        </p-dialog>
    `,
    styles: [`
        .legende { display: flex; gap: 1rem; font-size: 0.82rem; color: var(--text-color-secondary); align-items: center; flex-wrap: wrap; }
        .legende span { display: flex; align-items: center; gap: 0.35rem; }
        .pastille { width: 0.9rem; height: 0.9rem; border-radius: 4px; display: inline-block; }
        .pastille.st-orange { background: #f97316; }
        .pastille.st-jaune { background: #eab308; }
        .pastille.st-verte { background: #16a34a; }
        .cal-wrap { overflow-x: auto; border: 1px solid var(--surface-border); border-radius: 8px; }
        .cal-table { border-collapse: collapse; width: 100%; min-width: 1200px; font-size: 0.85rem; }
        .cal-table th, .cal-table td { border: 1px solid var(--surface-border); padding: 0.4rem 0.45rem; text-align: center; vertical-align: middle; }
        .cal-table thead th { background: var(--surface-100); font-weight: 700; position: sticky; top: 0; }
        .col-agent { text-align: left !important; min-width: 180px; position: sticky; left: 0; background: var(--surface-card); z-index: 1; }
        .cal-table thead .col-agent { background: var(--surface-100); z-index: 2; }
        .cellule-mois { min-width: 64px; }
        .segment {
            display: block; border-radius: 6px; padding: 0.1rem 0.3rem; margin: 0.1rem 0;
            font-weight: 600; white-space: nowrap; font-size: 0.8rem;
        }
        .segment.st-orange { background: #f97316; color: #fff; }
        .segment.st-jaune { background: #eab308; color: #422006; }
        .segment.st-verte { background: #16a34a; color: #fff; }
    `]
})
export class ValidationPrevisionsComponent implements OnInit {
    private drhService = inject(DrhService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

    previsions = signal<PrevisionConge[]>([]);
    toutes = signal<PrevisionConge[]>([]);
    optionsDepartements = signal<DepartementDrh[]>([]);

    vue: 'validation' | 'calendrier' | 'annuel' = 'validation';
    vues = [
        { label: 'À valider', value: 'validation' },
        { label: 'Calendrier du personnel', value: 'calendrier' },
        { label: 'Vue annuelle', value: 'annuel' }
    ];

    exercice = new Date().getFullYear();
    exercices = [new Date().getFullYear(), new Date().getFullYear() + 1];
    departementFiltre: number | null = null;

    moisCourts = MOIS_COURTS;
    indicesMois = Array.from({ length: 12 }, (_, i) => i);
    joursSemaine = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
    moisAnnuel = signal<{ nom: string; semaines: ({ iso: string; num: number; dimanche: boolean } | null)[][] }[]>([]);
    /** iso -> agents en congé ce jour-là : classe d'étape + libellé. */
    private occupation = new Map<string, { classe: string; nom: string; statut: string }[]>();

    renvoiVisible = false;
    motif = '';
    cible: PrevisionConge | null = null;

    ngOnInit(): void {
        this.construireMois();
        this.chargerVue();
        this.drhService.departements$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.optionsDepartements.set((r.data as any)?.departements || [])
        });
    }

    chargerVue(): void {
        if (this.vue === 'validation') {
            this.chargerValidation();
        } else {
            this.construireMois();
            this.chargerCalendrier();
        }
    }

    chargerValidation(): void {
        this.drhService.previsionsAValider$(this.exercice).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.previsions.set((r.data as any)?.previsions || []),
            error: (e) => this.erreur(e)
        });
    }

    chargerCalendrier(): void {
        this.drhService.previsionsToutes$(this.exercice, this.departementFiltre || undefined)
            .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                next: (r) => {
                    this.toutes.set((r.data as any)?.previsions || []);
                    this.construireOccupation();
                },
                error: (e) => this.erreur(e)
            });
    }

    private construireMois(): void {
        const NOMS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        const annee = this.exercice;
        const mois = [];
        for (let m = 0; m < 12; m++) {
            const decalage = (new Date(annee, m, 1).getDay() + 6) % 7;
            const nbJours = new Date(annee, m + 1, 0).getDate();
            const semaines: ({ iso: string; num: number; dimanche: boolean } | null)[][] = [];
            let semaine: ({ iso: string; num: number; dimanche: boolean } | null)[] = new Array(decalage).fill(null);
            for (let j = 1; j <= nbJours; j++) {
                const d = new Date(annee, m, j);
                const iso = `${annee}-${String(m + 1).padStart(2, '0')}-${String(j).padStart(2, '0')}`;
                semaine.push({ iso, num: j, dimanche: d.getDay() === 0 });
                if (semaine.length === 7) { semaines.push(semaine); semaine = []; }
            }
            if (semaine.length > 0) {
                while (semaine.length < 7) semaine.push(null);
                semaines.push(semaine);
            }
            mois.push({ nom: NOMS[m], semaines });
        }
        this.moisAnnuel.set(mois);
    }

    /** Agrège toutes les prévisions par jour pour la vue annuelle. */
    private construireOccupation(): void {
        const map = new Map<string, { classe: string; nom: string; statut: string }[]>();
        for (const p of this.toutes()) {
            const classe = this.classeStatut(p.statut);
            const statut = this.statutLabel(p.statut).label;
            for (const per of p.periodes || []) {
                const d = new Date(per.dateDebut + 'T00:00:00');
                const fin = new Date(per.dateFin + 'T00:00:00');
                while (d <= fin) {
                    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                    if (!map.has(iso)) map.set(iso, []);
                    map.get(iso)!.push({ classe, nom: p.nomComplet, statut });
                    d.setDate(d.getDate() + 1);
                }
            }
        }
        // Tri : validées d'abord pour des points stables
        map.forEach((list) => list.sort((a, b) => a.classe.localeCompare(b.classe)));
        this.occupation = map;
    }

    dotsJour(iso: string): string[] {
        return (this.occupation.get(iso) || []).slice(0, 4).map((o) => o.classe);
    }

    surplusJour(iso: string): number {
        const n = (this.occupation.get(iso) || []).length;
        return n > 4 ? n - 4 : 0;
    }

    tooltipJourEquipe(iso: string): string {
        const list = this.occupation.get(iso) || [];
        if (list.length === 0) return '';
        return list.map((o) => `${o.nom} — ${o.statut}`).join('\n');
    }

    statutLabel(statut: string): StatutTag {
        return STATUT_PREVISION_LABELS[statut] || { label: statut, severity: 'secondary' };
    }

    /** Segments d'une prévision recoupant le mois m (0-11) : « 02 au 17 », coloré par étape. */
    segmentsMois(p: PrevisionConge, m: number): SegmentMois[] {
        const debutMois = `${this.exercice}-${String(m + 1).padStart(2, '0')}-01`;
        const dernierJour = new Date(this.exercice, m + 1, 0).getDate();
        const finMois = `${this.exercice}-${String(m + 1).padStart(2, '0')}-${String(dernierJour).padStart(2, '0')}`;
        const classe = this.classeStatut(p.statut);
        return (p.periodes || [])
            .filter((per: PeriodePrevision) => !(per.dateFin < debutMois || per.dateDebut > finMois))
            .map((per: PeriodePrevision) => {
                const debut = per.dateDebut > debutMois ? per.dateDebut : debutMois;
                const fin = per.dateFin < finMois ? per.dateFin : finMois;
                return { label: `${debut.slice(8)} au ${fin.slice(8)}`, classe };
            });
    }

    private classeStatut(statut: string): string {
        if (statut === 'VALIDEE_DRH') return 'st-verte';
        if (statut === 'ACCEPTEE_RESP' || statut === 'REAJUSTEE_RESP') return 'st-jaune';
        return 'st-orange';
    }

    valider(p: PrevisionConge): void {
        this.drhService.validerPrevision$(p.previsionId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => { this.ok('Prévision validée — inscrite au calendrier officiel'); },
            error: (e) => this.erreur(e)
        });
    }

    ouvrirRenvoi(p: PrevisionConge): void {
        this.cible = p;
        this.motif = '';
        this.renvoiVisible = true;
    }

    renvoyer(): void {
        if (!this.cible) return;
        this.drhService.renvoyerPrevision$(this.cible.previsionId, this.motif.trim())
            .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                next: () => { this.renvoiVisible = false; this.ok('Prévision renvoyée'); },
                error: (e) => this.erreur(e)
            });
    }

    private ok(detail: string): void {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail });
        this.chargerValidation();
    }

    private erreur(e: any): void {
        this.messageService.add({
            severity: 'error', summary: 'Erreur',
            detail: e.error?.data?.error || e.error?.message || 'Opération impossible'
        });
    }
}
