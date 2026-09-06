import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DrhService, PrevisionConge } from '@/service/drh.service';
import { STATUT_PREVISION_LABELS } from '../ma-prevision/ma-prevision.component';

/** Validation finale DRH : inscription des prévisions acceptées au calendrier officiel. */
@Component({
    selector: 'app-validation-previsions',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, DialogModule, DropdownModule, TableModule, TagModule, ToastModule, TextareaModule],
    providers: [MessageService],
    template: `
        <p-toast />
        <div class="card">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h4 class="m-0">Validation DRH des prévisions de congés</h4>
                    <span class="text-sm text-color-secondary">Prévisions acceptées ou réajustées par les responsables, en attente de validation finale.</span>
                </div>
                <div class="flex items-center gap-2">
                    <label class="font-medium">Exercice</label>
                    <p-dropdown [options]="exercices" [(ngModel)]="exercice" (onChange)="charger()" />
                </div>
            </div>

            <p-table [value]="previsions()" responsiveLayout="scroll" [rowHover]="true">
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
        </div>

        <p-dialog header="Renvoyer la prévision" [(visible)]="renvoiVisible" [modal]="true" [style]="{ width: '480px' }">
            <p class="mb-2">Motif du renvoi (transmis à l'agent et à son responsable) :</p>
            <textarea pTextarea [(ngModel)]="motif" rows="3" class="w-full"></textarea>
            <ng-template pTemplate="footer">
                <button pButton label="Annuler" class="p-button-text" (click)="renvoiVisible = false"></button>
                <button pButton label="Renvoyer" severity="danger" [disabled]="!motif.trim()" (click)="renvoyer()"></button>
            </ng-template>
        </p-dialog>
    `
})
export class ValidationPrevisionsComponent implements OnInit {
    private drhService = inject(DrhService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

    previsions = signal<PrevisionConge[]>([]);
    exercice = new Date().getFullYear();
    exercices = [new Date().getFullYear(), new Date().getFullYear() + 1];
    renvoiVisible = false;
    motif = '';
    cible: PrevisionConge | null = null;

    ngOnInit(): void {
        this.charger();
    }

    charger(): void {
        this.drhService.previsionsAValider$(this.exercice).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.previsions.set((r.data as any)?.previsions || []),
            error: (e) => this.erreur(e)
        });
    }

    statutLabel(statut: string) {
        return STATUT_PREVISION_LABELS[statut] || { label: statut, severity: 'secondary' };
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
        this.charger();
    }

    private erreur(e: any): void {
        this.messageService.add({
            severity: 'error', summary: 'Erreur',
            detail: e.error?.data?.error || e.error?.message || 'Opération impossible'
        });
    }
}
