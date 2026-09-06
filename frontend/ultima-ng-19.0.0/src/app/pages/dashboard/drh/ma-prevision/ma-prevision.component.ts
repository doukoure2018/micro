import { Component, DestroyRef, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';
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

@Component({
    selector: 'app-ma-prevision',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, CalendarModule, DropdownModule, TableModule, TagModule, ToastModule, TextareaModule],
    providers: [MessageService],
    template: `
        <p-toast />
        <div class="card">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h4 class="m-0">Ma prévision de congés</h4>
                    <span class="text-sm text-color-secondary" *ngIf="contexte()">
                        {{ contexte()?.departementLibelle || 'Aucun département' }} — droit annuel :
                        {{ contexte()?.droitAnnuelJours }} jours ouvrables (samedi non ouvrable)
                    </span>
                </div>
                <div class="flex items-center gap-2">
                    <label class="font-medium">Exercice</label>
                    <p-dropdown [options]="exercices" [(ngModel)]="exercice" (onChange)="charger()" />
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

            <div class="grid" *ngIf="modifiable()">
                <div class="col-12 lg:col-6">
                    <h6>Sélectionnez une période dans le calendrier</h6>
                    <p-calendar [(ngModel)]="plage" selectionMode="range" [inline]="true" [numberOfMonths]="2"
                                [minDate]="minDate" [maxDate]="maxDate" dateFormat="dd/mm/yy" />
                    <button pButton class="mt-2" icon="pi pi-plus" label="Ajouter cette période"
                            [disabled]="!plage || !plage[0] || !plage[1]" (click)="ajouterPeriode()"></button>
                </div>
                <div class="col-12 lg:col-6">
                    <h6>Périodes prévues</h6>
                    <p-table [value]="periodes()" responsiveLayout="scroll">
                        <ng-template pTemplate="header">
                            <tr><th>Du</th><th>Au</th><th>Jours ouvrables</th><th></th></tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-per let-i="rowIndex">
                            <tr>
                                <td>{{ per.dateDebut | date: 'dd/MM/yyyy' }}</td>
                                <td>{{ per.dateFin | date: 'dd/MM/yyyy' }}</td>
                                <td>{{ per.nbJours }}</td>
                                <td><button pButton icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm"
                                            (click)="retirerPeriode(i)"></button></td>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="emptymessage">
                            <tr><td colspan="4" class="text-center text-color-secondary">Aucune période — sélectionnez des dates dans le calendrier</td></tr>
                        </ng-template>
                    </p-table>
                    <div class="mt-3 font-medium" [class.text-red-500]="totalJours() > (contexte()?.droitAnnuelJours || 30)">
                        Total : {{ totalJours() }} / {{ contexte()?.droitAnnuelJours || 30 }} jours ouvrables
                    </div>
                    <div class="mt-3">
                        <label class="block mb-1">Commentaire (facultatif)</label>
                        <textarea pTextarea [(ngModel)]="commentaire" rows="2" class="w-full"></textarea>
                    </div>
                    <div class="flex gap-2 mt-3">
                        <button pButton label="Enregistrer" icon="pi pi-save" [loading]="saving()"
                                [disabled]="periodes().length === 0" (click)="enregistrer(false)"></button>
                        <button pButton label="Enregistrer et soumettre" icon="pi pi-send" severity="success"
                                [loading]="saving()" [disabled]="periodes().length === 0" (click)="enregistrer(true)"></button>
                    </div>
                </div>
            </div>

            <div *ngIf="!modifiable() && prevision() as p">
                <h6>Périodes {{ p.statut === 'VALIDEE_DRH' ? 'validées' : 'soumises' }}</h6>
                <p-table [value]="p.periodes" responsiveLayout="scroll">
                    <ng-template pTemplate="header">
                        <tr><th>Du</th><th>Au</th><th>Jours ouvrables</th></tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-per>
                        <tr>
                            <td>{{ per.dateDebut | date: 'dd/MM/yyyy' }}</td>
                            <td>{{ per.dateFin | date: 'dd/MM/yyyy' }}</td>
                            <td>{{ per.nbJours }}</td>
                        </tr>
                    </ng-template>
                </p-table>
                <div class="mt-2 font-medium">Total : {{ p.totalJours }} jours ouvrables</div>
            </div>
        </div>
    `
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
    plage: Date[] | null = null;
    commentaire = '';

    get minDate(): Date { return new Date(this.exercice, 0, 1); }
    get maxDate(): Date { return new Date(this.exercice, 11, 31); }

    totalJours = computed(() => this.periodes().reduce((s, p) => s + (p.nbJours || 0), 0));

    modifiable = computed(() => {
        const p = this.prevision();
        return !!this.contexte()?.estMembre &&
            (!p || ['BROUILLON', 'REJETEE_RESP', 'REJETEE_DRH'].includes(p.statut));
    });

    ngOnInit(): void {
        this.drhService.contexte$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.contexte.set((r.data as any)?.contexte || null)
        });
        this.charger();
    }

    charger(): void {
        this.plage = null;
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

    /** Jours ouvrables approchés côté client (lundi-vendredi) ; le serveur fait foi (fériés inclus). */
    private joursOuvrables(debut: Date, fin: Date): number {
        let n = 0;
        const d = new Date(debut);
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

    ajouterPeriode(): void {
        if (!this.plage || !this.plage[0] || !this.plage[1]) return;
        const [debut, fin] = this.plage;
        const chevauche = this.periodes().some((p) =>
            !(this.toIso(fin) < p.dateDebut || this.toIso(debut) > p.dateFin));
        if (chevauche) {
            this.messageService.add({ severity: 'warn', summary: 'Chevauchement', detail: 'Cette période chevauche une période déjà ajoutée' });
            return;
        }
        this.periodes.update((list) => [...list, {
            dateDebut: this.toIso(debut),
            dateFin: this.toIso(fin),
            nbJours: this.joursOuvrables(debut, fin)
        }].sort((a, b) => a.dateDebut.localeCompare(b.dateDebut)));
        this.plage = null;
    }

    retirerPeriode(index: number): void {
        this.periodes.update((list) => list.filter((_, i) => i !== index));
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
