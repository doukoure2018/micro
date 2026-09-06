import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DrhService, PrevisionConge, PeriodePrevision, ContexteDrh } from '@/service/drh.service';
import { STATUT_PREVISION_LABELS, StatutTag } from '../ma-prevision/ma-prevision.component';

/**
 * Vue du responsable de département : prévisions de ses agents,
 * acceptation / rejet motivé / réajustement des dates après entretien.
 */
@Component({
    selector: 'app-departement-previsions',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, CalendarModule, DialogModule, DropdownModule, TableModule, TagModule, ToastModule, TextareaModule],
    providers: [MessageService],
    template: `
        <p-toast />
        <div class="card">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h4 class="m-0">Prévisions de congés — {{ contexte()?.departementLibelle }}</h4>
                    <span class="text-sm text-color-secondary">Acceptez, rejetez (avec motif) ou réajustez les dates après entretien.</span>
                </div>
                <div class="flex items-center gap-2">
                    <label class="font-medium">Exercice</label>
                    <p-dropdown [options]="exercices" [(ngModel)]="exercice" (onChange)="charger()" />
                </div>
            </div>

            <p-table [value]="previsions()" responsiveLayout="scroll" [rowHover]="true">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Agent</th><th>Fonction</th><th>Périodes</th><th>Total</th><th>Statut</th><th>Actions</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-p>
                    <tr>
                        <td>{{ p.nomComplet }}<div class="text-xs text-color-secondary" *ngIf="p.matricule">Mat. {{ p.matricule }}</div></td>
                        <td>{{ p.fonction || '-' }}</td>
                        <td>
                            <div *ngFor="let per of p.periodes" class="text-sm">
                                {{ per.dateDebut | date: 'dd/MM' }} au {{ per.dateFin | date: 'dd/MM/yyyy' }} ({{ per.nbJours }} j)
                            </div>
                        </td>
                        <td class="font-medium">{{ p.totalJours }} j</td>
                        <td><p-tag [value]="statutLabel(p.statut).label" [severity]="statutLabel(p.statut).severity" /></td>
                        <td>
                            <div class="flex gap-1" *ngIf="p.statut === 'SOUMISE'">
                                <button pButton icon="pi pi-check" class="p-button-sm" severity="success"
                                        pTooltip="Accepter" (click)="accepter(p)"></button>
                                <button pButton icon="pi pi-times" class="p-button-sm" severity="danger"
                                        pTooltip="Rejeter" (click)="ouvrirRejet(p)"></button>
                                <button pButton icon="pi pi-calendar" class="p-button-sm p-button-outlined"
                                        pTooltip="Réajuster les dates" (click)="ouvrirReajustement(p)"></button>
                            </div>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr><td colspan="6" class="text-center text-color-secondary">Aucune prévision pour {{ exercice }}</td></tr>
                </ng-template>
            </p-table>
        </div>

        <p-dialog header="Rejeter la prévision" [(visible)]="rejetVisible" [modal]="true" [style]="{ width: '480px' }">
            <p class="mb-2">Motif du rejet (transmis à l'agent pour réadaptation des dates) :</p>
            <textarea pTextarea [(ngModel)]="motifRejet" rows="3" class="w-full"></textarea>
            <ng-template pTemplate="footer">
                <button pButton label="Annuler" class="p-button-text" (click)="rejetVisible = false"></button>
                <button pButton label="Rejeter" severity="danger" [disabled]="!motifRejet.trim()" (click)="rejeter()"></button>
            </ng-template>
        </p-dialog>

        <p-dialog header="Réajuster la prévision" [(visible)]="reajustVisible" [modal]="true" [style]="{ width: '640px' }">
            <p class="text-sm text-color-secondary mb-3">
                Après entretien avec l'agent, modifiez ses périodes : la prévision réajustée partira directement en validation DRH.
            </p>
            <div class="flex flex-wrap gap-3">
                <div>
                    <p-calendar [(ngModel)]="plage" selectionMode="range" [inline]="true"
                                [minDate]="minDate" [maxDate]="maxDate" dateFormat="dd/mm/yy" />
                    <button pButton class="mt-2" icon="pi pi-plus" label="Ajouter"
                            [disabled]="!plage || !plage[0] || !plage[1]" (click)="ajouterPeriode()"></button>
                </div>
                <div class="flex-1" style="min-width:220px">
                    <div *ngFor="let per of periodesEdit; let i = index" class="flex items-center gap-2 mb-1">
                        <span class="text-sm">{{ per.dateDebut | date: 'dd/MM' }} au {{ per.dateFin | date: 'dd/MM/yyyy' }} ({{ per.nbJours }} j)</span>
                        <button pButton icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm"
                                (click)="periodesEdit.splice(i, 1)"></button>
                    </div>
                    <div class="text-color-secondary text-sm" *ngIf="periodesEdit.length === 0">Aucune période</div>
                </div>
            </div>
            <ng-template pTemplate="footer">
                <button pButton label="Annuler" class="p-button-text" (click)="reajustVisible = false"></button>
                <button pButton label="Réajuster et transmettre à la DRH" severity="success"
                        [disabled]="periodesEdit.length === 0" (click)="reajuster()"></button>
            </ng-template>
        </p-dialog>
    `
})
export class DepartementPrevisionsComponent implements OnInit {
    private drhService = inject(DrhService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

    contexte = signal<ContexteDrh | null>(null);
    previsions = signal<PrevisionConge[]>([]);
    exercice = new Date().getFullYear();
    exercices = [new Date().getFullYear(), new Date().getFullYear() + 1];

    rejetVisible = false;
    reajustVisible = false;
    motifRejet = '';
    cible: PrevisionConge | null = null;
    plage: Date[] | null = null;
    periodesEdit: PeriodePrevision[] = [];

    get minDate(): Date { return new Date(this.exercice, 0, 1); }
    get maxDate(): Date { return new Date(this.exercice, 11, 31); }

    ngOnInit(): void {
        this.drhService.contexte$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.contexte.set((r.data as any)?.contexte || null)
        });
        this.charger();
    }

    charger(): void {
        this.drhService.previsionsDepartement$(this.exercice).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.previsions.set((r.data as any)?.previsions || []),
            error: (e) => this.erreur(e)
        });
    }

    statutLabel(statut: string): StatutTag {
        return STATUT_PREVISION_LABELS[statut] || { label: statut, severity: 'secondary' };
    }

    accepter(p: PrevisionConge): void {
        this.drhService.accepterPrevision$(p.previsionId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => { this.ok('Prévision acceptée — transmise à la DRH'); },
            error: (e) => this.erreur(e)
        });
    }

    ouvrirRejet(p: PrevisionConge): void {
        this.cible = p;
        this.motifRejet = '';
        this.rejetVisible = true;
    }

    rejeter(): void {
        if (!this.cible) return;
        this.drhService.rejeterPrevision$(this.cible.previsionId, this.motifRejet.trim())
            .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                next: () => { this.rejetVisible = false; this.ok("Prévision rejetée — motif transmis à l'agent"); },
                error: (e) => this.erreur(e)
            });
    }

    ouvrirReajustement(p: PrevisionConge): void {
        this.cible = p;
        this.plage = null;
        this.periodesEdit = p.periodes.map((x) => ({ ...x }));
        this.reajustVisible = true;
    }

    private toIso(d: Date): string {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    ajouterPeriode(): void {
        if (!this.plage || !this.plage[0] || !this.plage[1]) return;
        const [debut, fin] = this.plage;
        let n = 0;
        const d = new Date(debut);
        while (d <= fin) {
            if (d.getDay() !== 0 && d.getDay() !== 6) n++;
            d.setDate(d.getDate() + 1);
        }
        this.periodesEdit = [...this.periodesEdit, { dateDebut: this.toIso(debut), dateFin: this.toIso(fin), nbJours: n }]
            .sort((a, b) => a.dateDebut.localeCompare(b.dateDebut));
        this.plage = null;
    }

    reajuster(): void {
        if (!this.cible) return;
        this.drhService.reajusterPrevision$(this.cible.previsionId, {
            exercice: this.exercice,
            periodes: this.periodesEdit.map((p) => ({ dateDebut: p.dateDebut, dateFin: p.dateFin }))
        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => { this.reajustVisible = false; this.ok('Prévision réajustée — transmise à la DRH'); },
            error: (e) => this.erreur(e)
        });
    }

    private ok(detail: string): void {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail });
        this.charger();
    }

    private erreur(e: any): void {
        this.messageService.add({
            severity: 'error', summary: 'Erreur',
            detail: e.error?.data?.error || e.error?.message || 'Opération impossible'
        });
    }
}
