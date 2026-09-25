import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as XLSX from 'xlsx';
import { DrhService, ReportConge } from '@/service/drh.service';

/** V155 — reports de congés : reliquats de l'exercice N reportés sur N+1 (clôture DRH ou automatique au 1er janvier). */
@Component({
    selector: 'app-reports-conges',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, DialogModule, DropdownModule, TableModule, TagModule, ToastModule],
    providers: [MessageService],
    template: `
        <p-toast />
        <div class="card">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h4 class="m-0">Reports de congés</h4>
                    <span class="text-sm text-color-secondary">Reliquats de l'exercice précédent reportés sur l'exercice affiché, imputés en priorité et perdus après la date limite.</span>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <label class="font-medium">Exercice cible</label>
                    <p-dropdown [options]="exercices" [(ngModel)]="exercice" (onChange)="charger()" />
                    <button pButton icon="pi pi-file-excel" label="Excel" class="p-button-outlined p-button-sm" severity="success" [disabled]="!reports().length" (click)="exporter()"></button>
                    <button pButton icon="pi pi-lock" [label]="'Clôturer l’exercice ' + (exercice - 1)" severity="warn" [disabled]="cloture()" (click)="confirmationVisible = true"></button>
                </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div class="p-3 border-round surface-100"><div class="text-sm text-color-secondary">Salariés avec report</div><div class="text-2xl font-bold">{{ reports().length }}</div></div>
                <div class="p-3 border-round surface-100"><div class="text-sm text-color-secondary">Jours reportés</div><div class="text-2xl font-bold">{{ total('joursReportes') }}</div></div>
                <div class="p-3 border-round surface-100"><div class="text-sm text-color-secondary">Jours consommés</div><div class="text-2xl font-bold">{{ total('joursConsommes') }}</div></div>
                <div class="p-3 border-round surface-100"><div class="text-sm text-color-secondary">Jours restants</div><div class="text-2xl font-bold">{{ total('joursReportes') - total('joursConsommes') }}</div></div>
            </div>
            <p-table [value]="reports()" responsiveLayout="scroll" [rowHover]="true" [paginator]="true" [rows]="25" [loading]="chargement()">
                <ng-template pTemplate="header">
                    <tr><th>Salarié</th><th>Direction</th><th>Origine</th><th>Reportés</th><th>Consommés</th><th>Restants</th><th>À prendre avant le</th><th>État</th></tr>
                </ng-template>
                <ng-template pTemplate="body" let-r>
                    <tr>
                        <td>{{ r.nomComplet }}<div class="text-xs text-color-secondary" *ngIf="r.matricule">Mat. {{ r.matricule }}</div></td>
                        <td>{{ r.departementCode || '—' }}</td>
                        <td>{{ r.exerciceOrigine }}</td>
                        <td class="font-medium">{{ r.joursReportes }} j</td>
                        <td>{{ r.joursConsommes }} j</td>
                        <td class="font-medium">{{ r.joursReportes - r.joursConsommes }} j</td>
                        <td>{{ r.dateLimite | date: 'dd/MM/yyyy' }}</td>
                        <td><p-tag [value]="etat(r)" [severity]="severite(r)" /></td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr><td colspan="8" class="text-center text-color-secondary">Aucun report sur {{ exercice }} — clôturez l'exercice {{ exercice - 1 }} pour inscrire les reliquats.</td></tr>
                </ng-template>
            </p-table>
        </div>

        <p-dialog [header]="'Clôturer l’exercice ' + (exercice - 1)" [(visible)]="confirmationVisible" [modal]="true" [style]="{ width: '520px' }">
            <p>Pour chaque salarié affecté à un département, le reliquat de congés {{ exercice - 1 }} (droit annuel moins jours pris) sera inscrit
                en report sur {{ exercice }}, utilisable jusqu'à la date limite paramétrée puis perdu. Un salarié déjà reporté n'est pas recalculé.</p>
            <p class="text-sm text-color-secondary">Cette opération s'exécute aussi automatiquement le 1er janvier.</p>
            <ng-template pTemplate="footer">
                <button pButton label="Annuler" class="p-button-text" (click)="confirmationVisible = false"></button>
                <button pButton label="Clôturer" icon="pi pi-lock" severity="warn" [loading]="cloture()" (click)="cloturer()"></button>
            </ng-template>
        </p-dialog>
    `
})
export class ReportsCongesComponent implements OnInit {
    private drhService = inject(DrhService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

    reports = signal<ReportConge[]>([]);
    chargement = signal(false);
    cloture = signal(false);
    confirmationVisible = false;
    exercice = new Date().getFullYear();
    exercices = [new Date().getFullYear(), new Date().getFullYear() + 1];

    ngOnInit(): void {
        this.charger();
    }

    charger(): void {
        this.chargement.set(true);
        this.drhService.reportsConges$(this.exercice).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => { this.reports.set((r.data as any)?.reports || []); this.chargement.set(false); },
            error: (e) => { this.chargement.set(false); this.erreur(e); }
        });
    }

    total(champ: 'joursReportes' | 'joursConsommes'): number {
        return this.reports().reduce((t, r) => t + (r[champ] || 0), 0);
    }

    etat(r: ReportConge): string {
        const auj = new Date().toISOString().slice(0, 10);
        if (r.joursConsommes >= r.joursReportes) return 'Épuisé';
        return r.dateLimite < auj ? 'Expiré' : 'Utilisable';
    }

    severite(r: ReportConge): 'success' | 'secondary' | 'danger' {
        const e = this.etat(r);
        return e === 'Utilisable' ? 'success' : e === 'Expiré' ? 'danger' : 'secondary';
    }

    cloturer(): void {
        this.cloture.set(true);
        this.drhService.cloturerExerciceConges$(this.exercice - 1).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => {
                this.cloture.set(false);
                this.confirmationVisible = false;
                const c = (r.data as any)?.cloture;
                this.messageService.add({ severity: 'success', summary: 'Exercice clôturé', detail: c ? `${c.reportsCrees} report(s) créé(s) pour ${c.joursReportes} jour(s), à prendre avant le ${c.dateLimite}` : 'Reliquats reportés', life: 8000 });
                this.charger();
            },
            error: (e) => { this.cloture.set(false); this.erreur(e); }
        });
    }

    exporter(): void {
        const lignes = this.reports().map((r) => ({
            'Salarié': r.nomComplet, 'Matricule': r.matricule || '', 'Direction': r.departementCode || '', 'Exercice origine': r.exerciceOrigine,
            'Jours reportés': r.joursReportes, 'Jours consommés': r.joursConsommes, 'Jours restants': r.joursReportes - r.joursConsommes,
            'Date limite': r.dateLimite, 'État': this.etat(r)
        }));
        const classeur = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(classeur, XLSX.utils.json_to_sheet(lignes), `Reports ${this.exercice}`);
        XLSX.writeFile(classeur, `reports_conges_${this.exercice}.xlsx`);
    }

    private erreur(e: any): void {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: e.error?.data?.error || e.error?.message || 'Opération impossible' });
    }
}
