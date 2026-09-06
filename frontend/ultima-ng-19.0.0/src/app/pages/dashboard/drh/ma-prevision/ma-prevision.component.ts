import { Component, DestroyRef, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DrhService, PrevisionConge, PeriodePrevision, ContexteDrh } from '@/service/drh.service';

export interface StatutTag {
    label: string;
    severity: 'secondary' | 'info' | 'success' | 'warn' | 'danger' | 'contrast';
}

export const STATUT_PREVISION_LABELS: { [k: string]: StatutTag } = {
    BROUILLON: { label: 'Brouillon', severity: 'secondary' },
    SOUMISE: { label: 'Soumise au responsable', severity: 'info' },
    ACCEPTEE_RESP: { label: 'Acceptée — en attente DRH', severity: 'warn' },
    REJETEE_RESP: { label: 'Rejetée par le responsable', severity: 'danger' },
    REAJUSTEE_RESP: { label: 'Réajustée — en attente DRH', severity: 'warn' },
    VALIDEE_DRH: { label: 'Validée par la DRH', severity: 'success' },
    REJETEE_DRH: { label: 'Renvoyée par la DRH', severity: 'danger' }
};

interface JourCase {
    iso: string;
    num: number;
    weekend: boolean;
}

interface MoisCalendrier {
    nom: string;
    semaines: (JourCase | null)[][];
}

const MOIS_NOMS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

/**
 * Prévision annuelle de congés : calendrier des 12 mois de l'exercice en grand format.
 * Sélection d'une tranche en deux clics (début puis fin), aperçu au survol,
 * périodes prévues colorées, week-ends non ouvrables grisés.
 */
@Component({
    selector: 'app-ma-prevision',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, DropdownModule, TableModule, TagModule, ToastModule, TextareaModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast />
        <div class="card">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h4 class="m-0">Ma prévision de congés</h4>
                    <span class="text-sm text-color-secondary" *ngIf="contexte()">
                        {{ contexte()?.departementLibelle || 'Aucun département' }} — droit annuel :
                        {{ contexte()?.droitAnnuelJours }} jours ouvrables (samedi et dimanche non ouvrables)
                    </span>
                </div>
                <div class="flex items-center gap-2">
                    <label class="font-medium">Exercice</label>
                    <p-dropdown [options]="exercices" [(ngModel)]="exercice" (onChange)="changerExercice()" />
                </div>
            </div>

            <div *ngIf="!contexte()?.estMembre" class="p-3 border-round mb-4"
                 style="background:var(--yellow-50);border:1px solid var(--yellow-300)">
                Vous n'êtes affecté à aucun département : contactez la DRH pour votre affectation avant de saisir une prévision.
            </div>

            <div *ngIf="prevision() as p" class="mb-4 p-3 border-round flex flex-wrap items-center gap-3"
                 style="background:var(--surface-100)">
                <p-tag [value]="statutLabel(p.statut).label" [severity]="statutLabel(p.statut).severity" />
                <span *ngIf="p.motifRejet" class="text-red-500">Motif : {{ p.motifRejet }}</span>
                <span *ngIf="p.traiteeRespNom" class="text-sm text-color-secondary">
                    Responsable : {{ p.traiteeRespNom }} le {{ p.traiteeRespLe | date: 'dd/MM/yyyy HH:mm' }}
                </span>
                <span *ngIf="p.valideeDrhNom" class="text-sm text-color-secondary">
                    DRH : {{ p.valideeDrhNom }} le {{ p.valideeDrhLe | date: 'dd/MM/yyyy HH:mm' }}
                </span>
            </div>

            <!-- Barre d'état de la sélection + légende -->
            <div class="flex flex-wrap items-center justify-between gap-3 mb-3" *ngIf="modifiable()">
                <div class="selection-info" [class.active]="debutSelection()">
                    <i class="pi" [ngClass]="debutSelection() ? 'pi-arrows-h' : 'pi-hand-pointer'"></i>
                    <span *ngIf="!debutSelection()">Cliquez sur le <strong>premier jour</strong> d'une tranche de congé</span>
                    <span *ngIf="debutSelection()">Début : <strong>{{ debutSelection() | date: 'dd MMMM' }}</strong> —
                        cliquez sur le <strong>dernier jour</strong></span>
                    <button *ngIf="debutSelection()" pButton label="Annuler" class="p-button-text p-button-sm"
                            (click)="annulerSelection()"></button>
                </div>
                <div class="legende">
                    <span><i class="pastille prevue"></i> Période prévue</span>
                    <span><i class="pastille apercu"></i> Sélection en cours</span>
                    <span><i class="pastille weekend"></i> Week-end</span>
                </div>
            </div>

            <!-- Calendrier annuel : 12 mois -->
            <div class="annee-grille" [class.lecture]="!modifiable()">
                <div class="mois-carte" *ngFor="let mois of moisCalendrier()">
                    <div class="mois-titre">{{ mois.nom }} {{ exercice }}</div>
                    <div class="jours-entete">
                        <span *ngFor="let j of joursSemaine; let idx = index" [class.we]="idx >= 5">{{ j }}</span>
                    </div>
                    <div class="semaine" *ngFor="let semaine of mois.semaines">
                        <ng-container *ngFor="let jour of semaine">
                            <span *ngIf="!jour" class="jour vide"></span>
                            <span *ngIf="jour" class="jour" [ngClass]="classesJour(jour)"
                                  [pTooltip]="tooltipJour(jour)" tooltipPosition="top"
                                  (click)="clicJour(jour)" (mouseenter)="survolJour(jour)">
                                {{ jour.num }}
                            </span>
                        </ng-container>
                    </div>
                </div>
            </div>

            <!-- Périodes + actions -->
            <div class="grid mt-4">
                <div class="col-12 lg:col-7">
                    <h6>Tranches prévues</h6>
                    <p-table [value]="periodes()" responsiveLayout="scroll">
                        <ng-template pTemplate="header">
                            <tr><th>Du</th><th>Au</th><th>Jours ouvrables</th><th *ngIf="modifiable()"></th></tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-per let-i="rowIndex">
                            <tr>
                                <td>{{ per.dateDebut | date: 'dd MMMM yyyy' }}</td>
                                <td>{{ per.dateFin | date: 'dd MMMM yyyy' }}</td>
                                <td>{{ per.nbJours }}</td>
                                <td *ngIf="modifiable()">
                                    <button pButton icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm"
                                            (click)="retirerPeriode(i)"></button>
                                </td>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="emptymessage">
                            <tr><td colspan="4" class="text-center text-color-secondary">
                                Aucune tranche — sélectionnez des dates dans le calendrier ci-dessus
                            </td></tr>
                        </ng-template>
                    </p-table>
                    <div class="mt-3 font-medium text-lg"
                         [class.text-red-500]="totalJours() > (contexte()?.droitAnnuelJours || 30)">
                        Total : {{ totalJours() }} / {{ contexte()?.droitAnnuelJours || 30 }} jours ouvrables
                    </div>
                </div>
                <div class="col-12 lg:col-5" *ngIf="modifiable()">
                    <h6>Commentaire (facultatif)</h6>
                    <textarea pTextarea [(ngModel)]="commentaire" rows="3" class="w-full"></textarea>
                    <div class="flex flex-col gap-2 mt-3">
                        <button pButton label="Enregistrer" icon="pi pi-save" class="w-full" [loading]="saving()"
                                [disabled]="periodes().length === 0" (click)="enregistrer(false)"></button>
                        <button pButton label="Enregistrer et soumettre à mon responsable" icon="pi pi-send"
                                severity="success" class="w-full" [loading]="saving()"
                                [disabled]="periodes().length === 0" (click)="enregistrer(true)"></button>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .annee-grille {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1rem;
        }
        .mois-carte {
            background: var(--surface-card);
            border: 1px solid var(--surface-border);
            border-radius: 10px;
            padding: 0.75rem;
        }
        .mois-titre {
            font-weight: 700;
            text-align: center;
            margin-bottom: 0.5rem;
            color: var(--primary-color, #4f46e5);
        }
        .jours-entete {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            text-align: center;
            font-size: 0.72rem;
            font-weight: 600;
            color: var(--text-color-secondary);
            margin-bottom: 0.25rem;
        }
        .jours-entete .we { opacity: 0.5; }
        .semaine {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
        }
        .jour {
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.88rem;
            border-radius: 8px;
            cursor: pointer;
            user-select: none;
            transition: background 0.1s, color 0.1s, transform 0.05s;
        }
        .jour.vide { cursor: default; }
        .lecture .jour { cursor: default; }
        .jour:not(.vide):hover { background: var(--surface-200); transform: scale(1.06); }
        .lecture .jour:hover { background: transparent; transform: none; }
        .jour.weekend { color: var(--text-color-secondary); background: var(--surface-100); opacity: 0.65; border-radius: 0; }
        .jour.prevue { background: #4f46e5; color: #fff; border-radius: 0; }
        .jour.prevue.debut { border-radius: 8px 0 0 8px; }
        .jour.prevue.fin { border-radius: 0 8px 8px 0; }
        .jour.prevue.debut.fin { border-radius: 8px; }
        .jour.prevue.weekend { background: #a5b4fc; color: #312e81; opacity: 1; }
        .jour.apercu { background: #c7d2fe; color: #312e81; border-radius: 0; }
        .jour.ancre { background: #4f46e5; color: #fff; border-radius: 8px; box-shadow: 0 0 0 3px #c7d2fe; }
        .jour.aujourdhui { outline: 2px dashed var(--primary-color, #4f46e5); outline-offset: -2px; }
        .selection-info {
            display: flex; align-items: center; gap: 0.5rem;
            padding: 0.5rem 0.9rem; border-radius: 8px;
            background: var(--surface-100); font-size: 0.95rem;
        }
        .selection-info.active { background: #eef2ff; border: 1px solid #c7d2fe; }
        .legende { display: flex; gap: 1rem; font-size: 0.82rem; color: var(--text-color-secondary); align-items: center; }
        .legende span { display: flex; align-items: center; gap: 0.35rem; }
        .pastille { width: 0.9rem; height: 0.9rem; border-radius: 4px; display: inline-block; }
        .pastille.prevue { background: #4f46e5; }
        .pastille.apercu { background: #c7d2fe; }
        .pastille.weekend { background: var(--surface-200); }
        @media (max-width: 640px) {
            .annee-grille { grid-template-columns: 1fr; }
            .jour { font-size: 1rem; }
        }
    `]
})
export class MaPrevisionComponent implements OnInit {
    private drhService = inject(DrhService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

    contexte = signal<ContexteDrh | null>(null);
    prevision = signal<PrevisionConge | null>(null);
    periodes = signal<PeriodePrevision[]>([]);
    saving = signal(false);

    exercice = new Date().getFullYear();
    exercices = [new Date().getFullYear(), new Date().getFullYear() + 1];
    commentaire = '';

    joursSemaine = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
    moisCalendrier = signal<MoisCalendrier[]>([]);

    /** Premier clic de la sélection en cours (iso), survol pour l'aperçu. */
    debutSelection = signal<string | null>(null);
    survol = signal<string | null>(null);

    private aujourdhui = this.toIso(new Date());

    totalJours = computed(() => this.periodes().reduce((s, p) => s + (p.nbJours || 0), 0));

    modifiable = computed(() => {
        const p = this.prevision();
        return !!this.contexte()?.estMembre &&
            (!p || ['BROUILLON', 'REJETEE_RESP', 'REJETEE_DRH'].includes(p.statut));
    });

    ngOnInit(): void {
        this.construireCalendrier();
        this.drhService.contexte$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.contexte.set((r.data as any)?.contexte || null)
        });
        this.charger();
    }

    changerExercice(): void {
        this.construireCalendrier();
        this.annulerSelection();
        this.charger();
    }

    charger(): void {
        this.drhService.maPrevision$(this.exercice).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => {
                const p: PrevisionConge | null = (r.data as any)?.prevision || null;
                this.prevision.set(p);
                this.periodes.set(p ? [...p.periodes] : []);
                this.commentaire = p?.commentaire || '';
            }
        });
    }

    statutLabel(statut: string): StatutTag {
        return STATUT_PREVISION_LABELS[statut] || { label: statut, severity: 'secondary' };
    }

    // ==================== Construction du calendrier annuel ====================

    private construireCalendrier(): void {
        const annee = this.exercice;
        const mois: MoisCalendrier[] = [];
        for (let m = 0; m < 12; m++) {
            const premier = new Date(annee, m, 1);
            const nbJours = new Date(annee, m + 1, 0).getDate();
            // Lundi = 0 ... Dimanche = 6
            const decalage = (premier.getDay() + 6) % 7;
            const semaines: (JourCase | null)[][] = [];
            let semaine: (JourCase | null)[] = new Array(decalage).fill(null);
            for (let j = 1; j <= nbJours; j++) {
                const d = new Date(annee, m, j);
                const dow = d.getDay();
                semaine.push({ iso: this.toIso(d), num: j, weekend: dow === 0 || dow === 6 });
                if (semaine.length === 7) {
                    semaines.push(semaine);
                    semaine = [];
                }
            }
            if (semaine.length > 0) {
                while (semaine.length < 7) semaine.push(null);
                semaines.push(semaine);
            }
            mois.push({ nom: MOIS_NOMS[m], semaines });
        }
        this.moisCalendrier.set(mois);
    }

    // ==================== Sélection ====================

    clicJour(jour: JourCase): void {
        if (!this.modifiable()) return;
        const debut = this.debutSelection();
        if (!debut) {
            // Cliquer sur une tranche existante la retire
            const index = this.periodes().findIndex((p) => jour.iso >= p.dateDebut && jour.iso <= p.dateFin);
            if (index >= 0) {
                this.retirerPeriode(index);
                return;
            }
            this.debutSelection.set(jour.iso);
            this.survol.set(jour.iso);
            return;
        }
        let a = debut, b = jour.iso;
        if (b < a) [a, b] = [b, a];
        const chevauche = this.periodes().some((p) => !(b < p.dateDebut || a > p.dateFin));
        if (chevauche) {
            this.messageService.add({ severity: 'warn', summary: 'Chevauchement', detail: 'Cette tranche chevauche une tranche déjà prévue' });
            return;
        }
        const nbJours = this.joursOuvrables(a, b);
        if (nbJours === 0) {
            this.messageService.add({ severity: 'warn', summary: 'Aucun jour ouvrable', detail: 'Cette tranche ne contient que des week-ends' });
            this.annulerSelection();
            return;
        }
        this.periodes.update((list) => [...list, { dateDebut: a, dateFin: b, nbJours }]
            .sort((x, y) => x.dateDebut.localeCompare(y.dateDebut)));
        this.annulerSelection();
    }

    survolJour(jour: JourCase): void {
        if (this.debutSelection()) {
            this.survol.set(jour.iso);
        }
    }

    annulerSelection(): void {
        this.debutSelection.set(null);
        this.survol.set(null);
    }

    retirerPeriode(index: number): void {
        this.periodes.update((list) => list.filter((_, i) => i !== index));
    }

    // ==================== Rendu des cases ====================

    classesJour(jour: JourCase): { [k: string]: boolean } {
        const debut = this.debutSelection();
        const survol = this.survol();
        let apercu = false;
        if (debut && survol) {
            const [a, b] = debut <= survol ? [debut, survol] : [survol, debut];
            apercu = jour.iso >= a && jour.iso <= b;
        }
        const periode = this.periodes().find((p) => jour.iso >= p.dateDebut && jour.iso <= p.dateFin);
        return {
            weekend: jour.weekend,
            prevue: !!periode,
            debut: !!periode && jour.iso === periode.dateDebut,
            fin: !!periode && jour.iso === periode.dateFin,
            apercu: apercu && !periode,
            ancre: jour.iso === debut,
            aujourdhui: jour.iso === this.aujourdhui
        };
    }

    tooltipJour(jour: JourCase): string {
        const periode = this.periodes().find((p) => jour.iso >= p.dateDebut && jour.iso <= p.dateFin);
        if (periode) {
            return this.modifiable() ? 'Tranche prévue — cliquer pour la retirer' : 'Tranche prévue';
        }
        return '';
    }

    // ==================== Outils ====================

    /** Jours ouvrables approchés côté client (lundi-vendredi) ; le serveur fait foi (fériés inclus). */
    private joursOuvrables(debutIso: string, finIso: string): number {
        let n = 0;
        const d = new Date(debutIso + 'T00:00:00');
        const fin = new Date(finIso + 'T00:00:00');
        while (d <= fin) {
            const dow = d.getDay();
            if (dow !== 0 && dow !== 6) n++;
            d.setDate(d.getDate() + 1);
        }
        return n;
    }

    private toIso(d: Date): string {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    enregistrer(puisSoumettre: boolean): void {
        this.saving.set(true);
        this.drhService.enregistrerPrevision$({
            exercice: this.exercice,
            commentaire: this.commentaire,
            periodes: this.periodes().map((p) => ({ dateDebut: p.dateDebut, dateFin: p.dateFin }))
        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => {
                if (puisSoumettre) {
                    this.drhService.soumettrePrevision$(this.exercice).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                        next: () => {
                            this.saving.set(false);
                            this.messageService.add({ severity: 'success', summary: 'Soumise', detail: 'Prévision soumise à votre responsable' });
                            this.charger();
                        },
                        error: (e) => this.erreur(e)
                    });
                } else {
                    this.saving.set(false);
                    this.messageService.add({ severity: 'success', summary: 'Enregistrée', detail: 'Prévision enregistrée (brouillon)' });
                    this.charger();
                }
            },
            error: (e) => this.erreur(e)
        });
    }

    private erreur(e: any): void {
        this.saving.set(false);
        this.messageService.add({
            severity: 'error', summary: 'Erreur',
            detail: e.error?.data?.error || e.error?.message || 'Opération impossible'
        });
    }
}
