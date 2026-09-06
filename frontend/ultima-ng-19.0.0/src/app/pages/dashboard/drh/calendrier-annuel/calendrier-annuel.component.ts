import { Component, DestroyRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DrhService, PeriodePrevision } from '@/service/drh.service';

interface JourCase {
    iso: string;
    num: number;
    dimanche: boolean;
}

interface MoisCalendrier {
    nom: string;
    semaines: (JourCase | null)[][];
}

const MOIS_NOMS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

/**
 * Calendrier annuel de sélection des tranches de congé (12 mois, grand format,
 * sélection en deux clics, dimanches et fériés exclus du comptage).
 * Réutilisable : « Ma prévision » côté agent, réajustement côté responsable.
 * Le parent fournit [periodes] et reçoit (periodesChange) ; les contrôles
 * (chevauchement, plafond du droit annuel, tranche vide) sont faits ici.
 */
@Component({
    selector: 'app-calendrier-annuel',
    standalone: true,
    imports: [CommonModule, ButtonModule, TooltipModule, ConfirmDialogModule],
    template: `
        <p-confirmDialog key="calendrierAnnuel" />
        <div class="flex flex-wrap items-center justify-between gap-3 mb-3" *ngIf="modifiable">
            <div class="selection-info" [class.active]="debutSelection()">
                <i class="pi" [ngClass]="debutSelection() ? 'pi-arrows-h' : 'pi-hand-pointer'"></i>
                <span *ngIf="!debutSelection()">Cliquez sur le <strong>premier jour</strong> d'une tranche</span>
                <span *ngIf="debutSelection()">Début : <strong>{{ debutSelection() | date: 'dd MMMM' }}</strong> —
                    cliquez sur le <strong>dernier jour</strong></span>
                <button *ngIf="debutSelection()" pButton label="Annuler" class="p-button-text p-button-sm"
                        (click)="annulerSelection()"></button>
            </div>
            <div class="legende">
                <span><i class="pastille prevue"></i> Tranche</span>
                <span><i class="pastille dimanche"></i> Dimanche</span>
                <span><i class="pastille ferie"></i> Férié</span>
            </div>
        </div>
        <div class="annee-grille" [class.lecture]="!modifiable">
            <div class="mois-carte" *ngFor="let mois of moisCalendrier()">
                <div class="mois-titre">{{ mois.nom }} {{ exercice }}</div>
                <div class="jours-entete">
                    <span *ngFor="let j of joursSemaine; let idx = index" [class.we]="idx === 6">{{ j }}</span>
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
    `,
    styles: [`
        .annee-grille {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 0.9rem;
        }
        .mois-carte {
            background: var(--surface-card);
            border: 1px solid var(--surface-border);
            border-radius: 10px;
            padding: 0.65rem;
        }
        .mois-titre { font-weight: 700; text-align: center; margin-bottom: 0.4rem; color: var(--primary-color, #4f46e5); }
        .jours-entete {
            display: grid; grid-template-columns: repeat(7, 1fr); text-align: center;
            font-size: 0.7rem; font-weight: 600; color: var(--text-color-secondary); margin-bottom: 0.2rem;
        }
        .jours-entete .we { opacity: 0.5; }
        .semaine { display: grid; grid-template-columns: repeat(7, 1fr); }
        .jour {
            aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
            font-size: 0.85rem; border-radius: 8px; cursor: pointer; user-select: none;
            transition: background 0.1s, color 0.1s, transform 0.05s;
        }
        .jour.vide { cursor: default; }
        .lecture .jour { cursor: default; }
        .jour:not(.vide):hover { background: var(--surface-200); transform: scale(1.06); }
        .lecture .jour:hover { background: transparent; transform: none; }
        .jour.dimanche { color: var(--text-color-secondary); background: var(--surface-100); opacity: 0.65; border-radius: 0; }
        .jour.prevue { background: #4f46e5; color: #fff; border-radius: 0; }
        .jour.prevue.debut { border-radius: 8px 0 0 8px; }
        .jour.prevue.fin { border-radius: 0 8px 8px 0; }
        .jour.prevue.debut.fin { border-radius: 8px; }
        .jour.prevue.dimanche { background: #a5b4fc; color: #312e81; opacity: 1; }
        .jour.ferie { background: #fef3c7; color: #b45309; font-weight: 700; border-radius: 8px; }
        .jour.ferie.prevue { background: #a5b4fc; color: #312e81; }
        .jour.apercu { background: #c7d2fe; color: #312e81; border-radius: 0; }
        .jour.ferie.apercu { background: #fde68a; color: #92400e; }
        .jour.ancre { background: #4f46e5; color: #fff; border-radius: 8px; box-shadow: 0 0 0 3px #c7d2fe; }
        .selection-info {
            display: flex; align-items: center; gap: 0.5rem; padding: 0.45rem 0.85rem;
            border-radius: 8px; background: var(--surface-100); font-size: 0.92rem;
        }
        .selection-info.active { background: #eef2ff; border: 1px solid #c7d2fe; }
        .legende { display: flex; gap: 0.9rem; font-size: 0.8rem; color: var(--text-color-secondary); align-items: center; }
        .legende span { display: flex; align-items: center; gap: 0.3rem; }
        .pastille { width: 0.85rem; height: 0.85rem; border-radius: 4px; display: inline-block; }
        .pastille.prevue { background: #4f46e5; }
        .pastille.dimanche { background: var(--surface-200); }
        .pastille.ferie { background: #fef3c7; border: 1px solid #f59e0b; }
        @media (max-width: 640px) {
            .annee-grille { grid-template-columns: 1fr; }
            .jour { font-size: 1rem; }
        }
    `]
})
export class CalendrierAnnuelComponent implements OnInit, OnChanges {
    @Input({ required: true }) exercice!: number;
    @Input() periodes: PeriodePrevision[] = [];
    @Input() modifiable = true;
    @Input() droit = 30;
    @Output() periodesChange = new EventEmitter<PeriodePrevision[]>();

    private drhService = inject(DrhService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private destroyRef = inject(DestroyRef);

    joursSemaine = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
    moisCalendrier = signal<MoisCalendrier[]>([]);
    debutSelection = signal<string | null>(null);
    survol = signal<string | null>(null);
    feries = signal<Map<string, string>>(new Map());

    ngOnInit(): void {
        this.construire();
        this.chargerFeries();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['exercice'] && !changes['exercice'].firstChange) {
            this.construire();
            this.chargerFeries();
            this.annulerSelection();
        }
    }

    private chargerFeries(): void {
        this.drhService.joursFeries$(this.exercice).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => {
                const map = new Map<string, string>();
                ((r.data as any)?.joursFeries || []).forEach((f: any) => map.set(String(f.jour), String(f.libelle)));
                this.feries.set(map);
            },
            error: () => this.feries.set(new Map())
        });
    }

    private construire(): void {
        const annee = this.exercice;
        const mois: MoisCalendrier[] = [];
        for (let m = 0; m < 12; m++) {
            const premier = new Date(annee, m, 1);
            const nbJours = new Date(annee, m + 1, 0).getDate();
            const decalage = (premier.getDay() + 6) % 7;
            const semaines: (JourCase | null)[][] = [];
            let semaine: (JourCase | null)[] = new Array(decalage).fill(null);
            for (let j = 1; j <= nbJours; j++) {
                const d = new Date(annee, m, j);
                semaine.push({ iso: this.toIso(d), num: j, dimanche: d.getDay() === 0 });
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

    clicJour(jour: JourCase): void {
        if (!this.modifiable) return;
        const debut = this.debutSelection();
        if (!debut) {
            const index = this.periodes.findIndex((p) => jour.iso >= p.dateDebut && jour.iso <= p.dateFin);
            if (index >= 0) {
                this.confirmerRetrait(index);
                return;
            }
            this.debutSelection.set(jour.iso);
            this.survol.set(jour.iso);
            return;
        }
        let a = debut, b = jour.iso;
        if (b < a) [a, b] = [b, a];
        if (this.periodes.some((p) => !(b < p.dateDebut || a > p.dateFin))) {
            this.messageService.add({ severity: 'warn', summary: 'Chevauchement', detail: 'Cette tranche chevauche une tranche existante' });
            return;
        }
        const nbJours = this.joursOuvrables(a, b);
        if (nbJours === 0) {
            this.messageService.add({ severity: 'warn', summary: 'Aucun jour ouvrable', detail: 'Cette tranche ne contient que des dimanches ou fériés' });
            this.annulerSelection();
            return;
        }
        const total = this.periodes.reduce((s, p) => s + (p.nbJours || 0), 0);
        if (total + nbJours > this.droit) {
            this.messageService.add({
                severity: 'error', summary: 'Droit annuel dépassé',
                detail: `Cette tranche de ${nbJours} j porterait le total à ${total + nbJours} j — maximum ${this.droit} jours ouvrables (reste ${this.droit - total} j)`
            });
            this.annulerSelection();
            return;
        }
        const maj = [...this.periodes, { dateDebut: a, dateFin: b, nbJours }]
            .sort((x, y) => x.dateDebut.localeCompare(y.dateDebut));
        this.periodes = maj;
        this.periodesChange.emit(maj);
        this.annulerSelection();
    }

    private confirmerRetrait(index: number): void {
        const periode = this.periodes[index];
        const fmt = (iso: string) => {
            const [a, m, j] = iso.split('-');
            return j + '/' + m + '/' + a;
        };
        this.confirmationService.confirm({
            key: 'calendrierAnnuel',
            header: 'Retirer la tranche',
            message: 'Êtes-vous sûr de vouloir retirer la tranche du ' + fmt(periode.dateDebut)
                + ' au ' + fmt(periode.dateFin) + ' (' + periode.nbJours + ' jours ouvrables) ?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui, retirer',
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                const maj = this.periodes.filter((_, i) => i !== index);
                this.periodes = maj;
                this.periodesChange.emit(maj);
            }
        });
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

    classesJour(jour: JourCase): { [k: string]: boolean } {
        const debut = this.debutSelection();
        const survol = this.survol();
        let apercu = false;
        if (debut && survol) {
            const [a, b] = debut <= survol ? [debut, survol] : [survol, debut];
            apercu = jour.iso >= a && jour.iso <= b;
        }
        const periode = this.periodes.find((p) => jour.iso >= p.dateDebut && jour.iso <= p.dateFin);
        return {
            dimanche: jour.dimanche,
            ferie: this.feries().has(jour.iso),
            prevue: !!periode,
            debut: !!periode && jour.iso === periode.dateDebut,
            fin: !!periode && jour.iso === periode.dateFin,
            apercu: apercu && !periode,
            ancre: jour.iso === debut
        };
    }

    tooltipJour(jour: JourCase): string {
        const ferie = this.feries().get(jour.iso);
        const dansPeriode = this.periodes.some((p) => jour.iso >= p.dateDebut && jour.iso <= p.dateFin);
        if (dansPeriode) {
            const base = this.modifiable ? 'Tranche — cliquer pour la retirer' : 'Tranche';
            return ferie ? base + ' (' + ferie + ')' : base;
        }
        return ferie || '';
    }

    /** Jours ouvrables = lundi à samedi, hors dimanches et fériés. */
    private joursOuvrables(debutIso: string, finIso: string): number {
        let n = 0;
        const d = new Date(debutIso + 'T00:00:00');
        const fin = new Date(finIso + 'T00:00:00');
        while (d <= fin) {
            const iso = this.toIso(d);
            if (d.getDay() !== 0 && !this.feries().has(iso)) n++;
            d.setDate(d.getDate() + 1);
        }
        return n;
    }

    private toIso(d: Date): string {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
}
