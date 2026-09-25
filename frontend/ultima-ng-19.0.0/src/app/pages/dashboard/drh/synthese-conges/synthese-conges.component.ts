import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as XLSX from 'xlsx';
import { DrhService, SyntheseConges, DepartementDrh } from '@/service/drh.service';
import { imprimerListe, libelleMotif } from '../conge-utils';

const MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

/** V155 — « Synthèse des congés » : consultation mensuelle ou trimestrielle (DRH). */
@Component({
    selector: 'app-synthese-conges',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, DropdownModule, SelectButtonModule, TableModule, TagModule, ToastModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast />
        <div class="card">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h4 class="m-0">Synthèse des congés</h4>
                    <span class="text-sm text-color-secondary">Congés et permissions accordés sur la période, par direction, par motif et jour par jour.</span>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <button pButton icon="pi pi-print" label="Imprimer" class="p-button-outlined p-button-sm" [disabled]="!synthese()" (click)="imprimer()"></button>
                    <button pButton icon="pi pi-file-excel" label="Excel" class="p-button-outlined p-button-sm" severity="success" [disabled]="!synthese()" (click)="exporter()"></button>
                </div>
            </div>

            <div class="flex flex-wrap items-end gap-3 mb-4">
                <div><label class="block text-sm mb-1">Période</label>
                    <p-selectButton [options]="periodes" [(ngModel)]="periode" optionLabel="label" optionValue="value" (onChange)="valeur = 1; charger()" /></div>
                <div><label class="block text-sm mb-1">{{ periode === 'M' ? 'Mois' : 'Trimestre' }}</label>
                    <p-dropdown [options]="periode === 'M' ? moisOptions : trimestreOptions" [(ngModel)]="valeur" optionLabel="label" optionValue="value" (onChange)="charger()" [style]="{ minWidth: '170px' }" /></div>
                <div><label class="block text-sm mb-1">Exercice</label>
                    <p-dropdown [options]="exercices" [(ngModel)]="exercice" (onChange)="charger()" /></div>
                <div><label class="block text-sm mb-1">Direction</label>
                    <p-dropdown [options]="departementsOptions()" [(ngModel)]="departementId" optionLabel="label" optionValue="value" (onChange)="charger()" [style]="{ minWidth: '260px' }" /></div>
            </div>

            @if (synthese(); as s) {
            <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 mb-4">
                <div class="tuile"><div class="k">Jours ouvrables</div><div class="v">{{ s.joursOuvrables }}</div></div>
                <div class="tuile"><div class="k">Effectif</div><div class="v">{{ s.effectif }}</div></div>
                <div class="tuile"><div class="k">Congés accordés</div><div class="v">{{ s.congesAccordes }}</div></div>
                <div class="tuile"><div class="k">Jours de congé</div><div class="v">{{ s.joursConges }}</div></div>
                <div class="tuile"><div class="k">Salariés en congé</div><div class="v">{{ s.salariesEnConge }}</div></div>
                <div class="tuile"><div class="k">Permissions</div><div class="v">{{ s.permissionsAccordees }} <small>{{ s.joursPermissions }} j</small></div></div>
                <div class="tuile"><div class="k">Interruptions</div><div class="v">{{ s.interruptions }}</div></div>
                <div class="tuile"><div class="k">Taux d'absence</div><div class="v">{{ s.tauxAbsence }} %</div></div>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div class="xl:col-span-2">
                    <h5 class="mt-0 mb-2">Par direction</h5>
                    <p-table [value]="s.parDirection" responsiveLayout="scroll">
                        <ng-template pTemplate="header">
                            <tr><th>Direction</th><th>Effectif</th><th>Congés</th><th>Jours congé</th><th>Permissions</th><th>Jours perm.</th><th>Taux d'absence</th></tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-l>
                            <tr>
                                <td><span class="font-medium">{{ l.code }}</span><div class="text-xs text-color-secondary">{{ l.libelle }}</div></td>
                                <td>{{ l.effectif }}</td><td>{{ l.conges }}</td><td>{{ l.joursConges }}</td><td>{{ l.permissions }}</td><td>{{ l.joursPermissions }}</td>
                                <td><p-tag [value]="l.tauxAbsence + ' %'" [severity]="l.tauxAbsence >= 15 ? 'danger' : l.tauxAbsence >= 8 ? 'warn' : 'success'" /></td>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="emptymessage"><tr><td colspan="7" class="text-center text-color-secondary">Aucune direction</td></tr></ng-template>
                    </p-table>
                </div>
                <div>
                    <h5 class="mt-0 mb-2">Permissions par motif</h5>
                    <p-table [value]="s.parMotif" responsiveLayout="scroll">
                        <ng-template pTemplate="header"><tr><th>Motif</th><th>Nombre</th><th>Jours</th></tr></ng-template>
                        <ng-template pTemplate="body" let-m><tr><td>{{ motifLabel(m.motif) }}</td><td>{{ m.nombre }}</td><td>{{ m.jours }}</td></tr></ng-template>
                        <ng-template pTemplate="emptymessage"><tr><td colspan="3" class="text-center text-color-secondary">Aucune permission</td></tr></ng-template>
                    </p-table>
                </div>
            </div>

            <h5 class="mb-2 mt-4">Absents jour par jour</h5>
            <div class="jours">
                <div *ngFor="let j of s.parJour" class="jour" [class.ferme]="!j.ouvrable" [class.charge]="j.conges + j.permissions >= 3"
                     [pTooltip]="j.noms.length ? j.noms.join(', ') : 'Personne'" tooltipPosition="top">
                    <div class="d">{{ j.jour | date: 'EEE dd/MM' }}</div>
                    <div class="n" *ngIf="j.ouvrable">{{ j.conges + j.permissions }}</div>
                    <div class="n ferme" *ngIf="!j.ouvrable">—</div>
                </div>
            </div>

            <h5 class="mb-2 mt-4">Congés de la période</h5>
            <p-table [value]="s.conges" responsiveLayout="scroll" [paginator]="s.conges.length > 15" [rows]="15">
                <ng-template pTemplate="header"><tr><th>Salarié</th><th>Direction</th><th>Du</th><th>Au</th><th>Jours</th><th>Statut</th></tr></ng-template>
                <ng-template pTemplate="body" let-d>
                    <tr><td>{{ d.nomComplet }}</td><td>{{ d.departementCode }}</td><td>{{ d.dateDebut | date: 'dd/MM/yyyy' }}</td><td>{{ d.dateFin | date: 'dd/MM/yyyy' }}</td><td>{{ d.nbJours }}</td>
                        <td>{{ d.statut === 'INTERROMPUE' ? 'Interrompu (reprise ' + (d.dateReprise | date: 'dd/MM/yyyy') + ')' : 'Validé' }}</td></tr>
                </ng-template>
                <ng-template pTemplate="emptymessage"><tr><td colspan="6" class="text-center text-color-secondary">Aucun congé sur la période</td></tr></ng-template>
            </p-table>
            } @else if (chargement()) {
            <div class="text-color-secondary">Chargement…</div>
            }
        </div>
    `,
    styles: [`
        .tuile { padding: .6rem .8rem; border-radius: 8px; background: var(--surface-100); }
        .tuile .k { font-size: .75rem; color: var(--text-color-secondary); }
        .tuile .v { font-size: 1.4rem; font-weight: 700; line-height: 1.2; }
        .tuile .v small { font-size: .8rem; font-weight: 400; color: var(--text-color-secondary); }
        .jours { display: grid; grid-template-columns: repeat(auto-fill, minmax(72px, 1fr)); gap: 4px; }
        .jour { border: 1px solid var(--surface-border); border-radius: 6px; padding: 4px; text-align: center; background: var(--surface-card); }
        .jour.ferme { background: var(--surface-100); color: var(--text-color-secondary); }
        .jour.charge { border-color: #f97316; background: #fff7ed; }
        .jour .d { font-size: .7rem; color: var(--text-color-secondary); }
        .jour .n { font-size: 1.05rem; font-weight: 700; }
    `]
})
export class SyntheseCongesComponent implements OnInit {
    private drhService = inject(DrhService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

    synthese = signal<SyntheseConges | null>(null);
    departements = signal<DepartementDrh[]>([]);
    chargement = signal(false);
    periode: 'M' | 'T' = 'M';
    periodes = [{ label: 'Mensuelle', value: 'M' }, { label: 'Trimestrielle', value: 'T' }];
    valeur = new Date().getMonth() + 1;
    exercice = new Date().getFullYear();
    exercices = [new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1];
    departementId: number | null = null;
    moisOptions = MOIS.map((l, i) => ({ label: l, value: i + 1 }));
    trimestreOptions = [1, 2, 3, 4].map((t) => ({ label: `${t}er trimestre`.replace('1er', '1er').replace('2er', '2e').replace('3er', '3e').replace('4er', '4e'), value: t }));
    motifLabel = libelleMotif;

    departementsOptions = computed(() => [
        { label: 'Toutes les directions', value: null as number | null },
        ...this.departements().map((d) => ({ label: `${d.code} — ${d.libelle}`, value: d.departementId as number | null }))
    ]);

    ngOnInit(): void {
        this.drhService.departements$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.departements.set((r.data as any)?.departements || []),
            error: () => {}
        });
        this.charger();
    }

    charger(): void {
        this.chargement.set(true);
        this.drhService.syntheseConges$(this.exercice, this.periode, this.valeur, this.departementId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => { this.synthese.set((r.data as any)?.synthese || null); this.chargement.set(false); },
            error: (e) => { this.chargement.set(false); this.messageService.add({ severity: 'error', summary: 'Erreur', detail: e.error?.data?.error || e.error?.message || 'Chargement impossible' }); }
        });
    }

    private titrePeriode(): string {
        const s = this.synthese();
        if (!s) return '';
        return this.periode === 'M' ? `${MOIS[this.valeur - 1]} ${this.exercice}` : `${this.trimestreOptions[this.valeur - 1].label} ${this.exercice}`;
    }

    imprimer(): void {
        const s = this.synthese();
        if (!s) return;
        const dep = this.departementsOptions().find((o) => o.value === this.departementId)?.label || 'Toutes les directions';
        imprimerListe('SYNTHÈSE DES CONGÉS — ' + this.titrePeriode().toUpperCase(),
            `${dep} · ${s.joursOuvrables} jours ouvrables · effectif ${s.effectif} · ${s.joursConges} j de congé, ${s.joursPermissions} j de permission · taux d'absence ${s.tauxAbsence} %`,
            ['Direction', 'Effectif', 'Congés', 'Jours congé', 'Permissions', 'Jours perm.', 'Taux d’absence %'],
            s.parDirection.map((l) => [l.code + ' — ' + (l.libelle || ''), l.effectif, l.conges, l.joursConges, l.permissions, l.joursPermissions, l.tauxAbsence]));
    }

    exporter(): void {
        const s = this.synthese();
        if (!s) return;
        const classeur = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(classeur, XLSX.utils.json_to_sheet(s.parDirection.map((l) => ({
            'Direction': l.code, 'Libellé': l.libelle, 'Effectif': l.effectif, 'Congés': l.conges, 'Jours congé': l.joursConges,
            'Permissions': l.permissions, 'Jours permission': l.joursPermissions, 'Taux absence %': l.tauxAbsence
        }))), 'Par direction');
        XLSX.utils.book_append_sheet(classeur, XLSX.utils.json_to_sheet(s.parMotif.map((m) => ({ 'Motif': libelleMotif(m.motif), 'Nombre': m.nombre, 'Jours': m.jours }))), 'Par motif');
        XLSX.utils.book_append_sheet(classeur, XLSX.utils.json_to_sheet(s.parJour.map((j) => ({ 'Jour': j.jour, 'Ouvrable': j.ouvrable ? 'oui' : 'non', 'Congés': j.conges, 'Permissions': j.permissions, 'Absents': j.noms.join(', ') }))), 'Par jour');
        XLSX.utils.book_append_sheet(classeur, XLSX.utils.json_to_sheet(s.conges.map((d) => ({ 'Salarié': d.nomComplet, 'Direction': d.departementCode, 'Du': d.dateDebut, 'Au': d.dateFin, 'Jours': d.nbJours, 'Statut': d.statut }))), 'Congés');
        XLSX.writeFile(classeur, `synthese_conges_${this.exercice}_${this.periode}${this.valeur}.xlsx`);
    }
}
