import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DrhService } from '@/service/drh.service';

interface StatutPresence {
    label: string;
    severity: 'success' | 'warn' | 'danger' | 'info' | 'secondary' | 'contrast';
}

const STATUTS_PRESENCE: { [k: string]: StatutPresence } = {
    PRESENT: { label: 'Présent', severity: 'success' },
    RETARD: { label: "Retard à l'arrivée", severity: 'warn' },
    DEPART_ANTICIPE: { label: "Départ avant l'heure", severity: 'warn' },
    RETARD_ET_DEPART: { label: 'Retard + départ anticipé', severity: 'danger' },
    ABSENT_JUSTIFIE: { label: 'Absent justifié', severity: 'info' },
    ABSENT_NON_JUSTIFIE: { label: 'Absent NON justifié', severity: 'danger' }
};

/**
 * Présences badgeuse (DRH) : import du CSV de la porte, synthèse quotidienne
 * type feuille « GESTION PORTE », détail par agent et pointages non rapprochés.
 */
@Component({
    selector: 'app-presences',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, CalendarModule, DropdownModule, SelectButtonModule, TableModule, TagModule, ToastModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast />
        <div class="card">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h4 class="m-0">Gestion des présences</h4>
                    <span class="text-sm text-color-secondary">
                        Import du fichier badgeuse (CSV « Date;User;Employee ID;… ») et rapprochement
                        automatique avec le personnel, les congés et permissions validés.
                    </span>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <input type="file" #fichier accept=".csv,text/csv" style="display:none"
                           (change)="importer($event)" />
                    <button pButton icon="pi pi-upload" label="Importer un fichier badgeuse"
                            [loading]="importEnCours()" (click)="fichier.click()"></button>
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
                        <th>Jour</th><th>Présents</th><th>Retards à l'arrivée</th><th>Départs avant l'heure</th>
                        <th>Absents justifiés</th><th>Absents NON justifiés</th><th>Effectif contrôlé</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-s>
                    <tr>
                        <td class="font-medium">{{ s.jour | date: 'EEEE dd/MM/yyyy' }}</td>
                        <td class="text-green-600 font-medium">{{ s.presents }}</td>
                        <td [class.text-orange-500]="s.retards > 0">{{ s.retards }}</td>
                        <td [class.text-orange-500]="s.departsAnticipes > 0">{{ s.departsAnticipes }}</td>
                        <td>{{ s.absentsJustifies }}</td>
                        <td [class.text-red-500]="s.absentsNonJustifies > 0" class="font-medium">{{ s.absentsNonJustifies }}</td>
                        <td>{{ s.total }}</td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr><td colspan="7" class="text-center text-color-secondary">
                        Aucune donnée sur la période — importez un fichier badgeuse
                    </td></tr>
                </ng-template>
            </p-table>

            <!-- ===== Détail par agent ===== -->
            <div *ngIf="vue === 'detail'">
                <div class="mb-2">
                    <p-dropdown [options]="statutsOptions" optionLabel="label" optionValue="value"
                                [(ngModel)]="statutFiltre" [showClear]="true"
                                placeholder="Tous les statuts" (onChange)="charger()" />
                </div>
                <p-table [value]="presences()" responsiveLayout="scroll" [paginator]="true" [rows]="25" [rowHover]="true">
                    <ng-template pTemplate="header">
                        <tr><th>Jour</th><th>Agent</th><th>Mat.</th><th>Dir.</th><th>Entrée</th><th>Sortie</th><th>Statut</th></tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-p>
                        <tr>
                            <td>{{ p.jour | date: 'dd/MM/yyyy' }}</td>
                            <td>{{ p.nom }}</td>
                            <td>{{ p.matricule }}</td>
                            <td>{{ p.departementCode || '—' }}</td>
                            <td>{{ p.premiereEntree || '—' }}</td>
                            <td>{{ p.derniereSortie || '—' }}</td>
                            <td>
                                <p-tag [value]="statut(p.statut).label" [severity]="statut(p.statut).severity" />
                                <div class="text-xs text-color-secondary" *ngIf="p.minutesRetard > 0">+{{ p.minutesRetard }} min de retard</div>
                                <div class="text-xs text-color-secondary" *ngIf="p.minutesDepart > 0">parti {{ p.minutesDepart }} min trop tôt</div>
                                <div class="text-xs" *ngIf="p.justification">{{ p.justification === 'CONGE' ? 'En congé validé' : 'Permission sociale validée' }}</div>
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr><td colspan="7" class="text-center text-color-secondary">Aucune présence sur la période</td></tr>
                    </ng-template>
                </p-table>
            </div>

            <!-- ===== Pointages non rapprochés ===== -->
            <div *ngIf="vue === 'non-rapproches'">
                <div class="p-2 border-round mb-2 text-sm" style="background:var(--yellow-50);border:1px solid var(--yellow-300)">
                    Badges sans matricule reconnu (visiteurs, libellés texte type « CHAUFFEUR », matricules absents du
                    fichier du personnel). Régularisez les matricules dans le fichier du personnel puis réimportez.
                </div>
                <p-table [value]="nonRapproches()" responsiveLayout="scroll" [paginator]="true" [rows]="25">
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
    private destroyRef = inject(DestroyRef);

    synthese = signal<any[]>([]);
    presences = signal<any[]>([]);
    nonRapproches = signal<any[]>([]);
    dernierImport = signal<any | null>(null);
    importEnCours = signal(false);

    vue: 'synthese' | 'detail' | 'non-rapproches' = 'synthese';
    vues = [
        { label: 'Synthèse', value: 'synthese' },
        { label: 'Détail par agent', value: 'detail' },
        { label: 'Non rapprochés', value: 'non-rapproches' }
    ];

    statutFiltre: string | null = null;
    statutsOptions = Object.keys(STATUTS_PRESENCE).map((k) => ({ label: STATUTS_PRESENCE[k].label, value: k }));

    du: Date = (() => { const d = new Date(); d.setDate(d.getDate() - 7); return d; })();
    au: Date = new Date();

    statut(s: string): StatutPresence {
        return STATUTS_PRESENCE[s] || { label: s, severity: 'secondary' };
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
