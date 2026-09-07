import { Component, Input, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { PrevisionConge, PeriodePrevision } from '@/service/drh.service';
import { STATUT_PREVISION_LABELS } from '../ma-prevision/ma-prevision.component';

const MOIS_COURTS = ['Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
const MOIS_NOMS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

interface SegmentMois {
    label: string;
    classe: string;
}

interface JourAnnuel {
    iso: string;
    num: number;
    dimanche: boolean;
}

/**
 * Vues consolidées des prévisions de congés, partagées entre l'écran DRH
 * (toutes directions) et l'écran responsable (sa direction) :
 * - 'calendrier' : tableau agents x 12 mois façon fichier Excel
 * - 'annuel'     : calendrier 12 mois, points colorés par agent en congé chaque jour
 * Couleurs d'étape : orange = enregistrée/soumise, jaune = acceptée/réajustée
 * responsable, vert = validée DRH.
 */
@Component({
    selector: 'app-apercu-previsions',
    standalone: true,
    imports: [CommonModule, TooltipModule],
    template: `
        <div class="legende mb-2">
            <span><i class="pastille st-orange"></i> Enregistrée / soumise</span>
            <span><i class="pastille st-jaune"></i> Acceptée / réajustée (responsable)</span>
            <span><i class="pastille st-verte"></i> Validée DRH</span>
            <span *ngIf="vue === 'annuel'" class="text-color-secondary">Survolez un jour pour voir les agents</span>
        </div>

        <!-- ===== Tableau agents x mois ===== -->
        <div class="cal-wrap" *ngIf="vue === 'calendrier'">
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
                    <tr *ngFor="let p of previsions">
                        <td class="col-agent">
                            {{ p.nomComplet }}
                            <div class="text-xs text-color-secondary" *ngIf="p.matricule">Mat. {{ p.matricule }}</div>
                        </td>
                        <td>{{ p.departementCode }}</td>
                        <td class="font-medium">{{ p.totalJours }} j</td>
                        <td *ngFor="let m of indicesMois" class="cellule-mois">
                            <span *ngFor="let seg of segmentsMois(p, m)" class="segment" [ngClass]="seg.classe"
                                  [pTooltip]="libelleStatut(p.statut)" tooltipPosition="top">
                                {{ seg.label }}
                            </span>
                        </td>
                    </tr>
                    <tr *ngIf="previsions.length === 0">
                        <td [attr.colspan]="15" class="text-center text-color-secondary p-3">
                            Aucune prévision pour {{ exercice }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- ===== Calendrier annuel ===== -->
        <div class="annee-grille" *ngIf="vue === 'annuel'">
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
                              [pTooltip]="tooltipJour(jour.iso)" tooltipPosition="top">
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
    `,
    styles: [`
        .legende { display: flex; gap: 1rem; font-size: 0.82rem; color: var(--text-color-secondary); align-items: center; flex-wrap: wrap; }
        .legende span { display: flex; align-items: center; gap: 0.35rem; }
        .pastille { width: 0.9rem; height: 0.9rem; border-radius: 4px; display: inline-block; }
        .pastille.st-orange { background: #f97316; }
        .pastille.st-jaune { background: #eab308; }
        .pastille.st-verte { background: #16a34a; }
        /* Tableau agents x mois */
        .cal-wrap { overflow-x: auto; border: 1px solid var(--surface-border); border-radius: 8px; }
        .cal-table { border-collapse: collapse; width: 100%; min-width: 1200px; font-size: 0.85rem; }
        .cal-table th, .cal-table td { border: 1px solid var(--surface-border); padding: 0.4rem 0.45rem; text-align: center; vertical-align: middle; }
        .cal-table thead th { background: var(--surface-100); font-weight: 700; position: sticky; top: 0; }
        .col-agent { text-align: left !important; min-width: 180px; position: sticky; left: 0; background: var(--surface-card); z-index: 1; }
        .cal-table thead .col-agent { background: var(--surface-100); z-index: 2; }
        .cellule-mois { min-width: 64px; }
        .segment { display: block; border-radius: 6px; padding: 0.1rem 0.3rem; margin: 0.1rem 0; font-weight: 600; white-space: nowrap; font-size: 0.8rem; }
        .segment.st-orange { background: #f97316; color: #fff; }
        .segment.st-jaune { background: #eab308; color: #422006; }
        .segment.st-verte { background: #16a34a; color: #fff; }
        /* Calendrier annuel */
        .annee-grille { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 0.9rem; }
        .mois-carte { background: var(--surface-card); border: 1px solid var(--surface-border); border-radius: 10px; padding: 0.65rem; }
        .mois-titre { font-weight: 700; text-align: center; margin-bottom: 0.4rem; color: var(--primary-color, #4f46e5); }
        .jours-entete { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-size: 0.7rem;
            font-weight: 600; color: var(--text-color-secondary); margin-bottom: 0.2rem; }
        .jours-entete .we { opacity: 0.5; }
        .semaine { display: grid; grid-template-columns: repeat(7, 1fr); }
        .jour-a { aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
            gap: 1px; font-size: 0.78rem; border-radius: 8px; }
        .jour-a.dimanche { color: var(--text-color-secondary); background: var(--surface-100); opacity: 0.6; border-radius: 0; }
        .jour-a.occupe { background: var(--surface-100); font-weight: 600; }
        .jour-a .num { line-height: 1; }
        .jour-a .pts { display: flex; align-items: center; gap: 2px; }
        .jour-a .pt { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
        .jour-a .pt.st-orange { background: #f97316; }
        .jour-a .pt.st-jaune { background: #eab308; }
        .jour-a .pt.st-verte { background: #16a34a; }
        .jour-a .pts b { font-size: 0.62rem; color: var(--text-color-secondary); }
        @media (max-width: 640px) {
            .annee-grille { grid-template-columns: 1fr; }
        }
    `]
})
export class ApercuPrevisionsComponent implements OnChanges {
    @Input({ required: true }) previsions: PrevisionConge[] = [];
    @Input({ required: true }) exercice!: number;
    @Input({ required: true }) vue: 'calendrier' | 'annuel' = 'calendrier';

    moisCourts = MOIS_COURTS;
    indicesMois = Array.from({ length: 12 }, (_, i) => i);
    joursSemaine = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
    moisAnnuel = signal<{ nom: string; semaines: (JourAnnuel | null)[][] }[]>([]);

    private occupation = new Map<string, { classe: string; nom: string; statut: string }[]>();

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['exercice']) {
            this.construireMois();
        }
        if (changes['previsions'] || changes['exercice']) {
            this.construireOccupation();
        }
    }

    libelleStatut(statut: string): string {
        return (STATUT_PREVISION_LABELS[statut] || { label: statut }).label;
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

    private construireMois(): void {
        const annee = this.exercice;
        const mois = [];
        for (let m = 0; m < 12; m++) {
            const decalage = (new Date(annee, m, 1).getDay() + 6) % 7;
            const nbJours = new Date(annee, m + 1, 0).getDate();
            const semaines: (JourAnnuel | null)[][] = [];
            let semaine: (JourAnnuel | null)[] = new Array(decalage).fill(null);
            for (let j = 1; j <= nbJours; j++) {
                const d = new Date(annee, m, j);
                const iso = `${annee}-${String(m + 1).padStart(2, '0')}-${String(j).padStart(2, '0')}`;
                semaine.push({ iso, num: j, dimanche: d.getDay() === 0 });
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
        this.moisAnnuel.set(mois);
    }

    private construireOccupation(): void {
        const map = new Map<string, { classe: string; nom: string; statut: string }[]>();
        for (const p of this.previsions || []) {
            const classe = this.classeStatut(p.statut);
            const statut = this.libelleStatut(p.statut);
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

    tooltipJour(iso: string): string {
        const list = this.occupation.get(iso) || [];
        if (list.length === 0) return '';
        return list.map((o) => `${o.nom} — ${o.statut}`).join('\n');
    }
}
