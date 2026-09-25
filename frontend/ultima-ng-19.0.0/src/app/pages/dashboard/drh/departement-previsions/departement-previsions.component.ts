import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendrierAnnuelComponent } from '../calendrier-annuel/calendrier-annuel.component';
import { ApercuPrevisionsComponent } from '../apercu-previsions/apercu-previsions.component';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmationService, MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DrhService, PrevisionConge, PeriodePrevision, ContexteDrh, ResultatLot } from '@/service/drh.service';
import { resumeLot } from '../conge-utils';
import { STATUT_PREVISION_LABELS, StatutTag } from '../ma-prevision/ma-prevision.component';

/**
 * Vue du responsable de département : prévisions de ses salariés,
 * acceptation / rejet motivé / réajustement des dates après entretien.
 */
@Component({
    selector: 'app-departement-previsions',
    standalone: true,
    imports: [CommonModule, FormsModule, ApercuPrevisionsComponent, ButtonModule, CalendrierAnnuelComponent, DialogModule, DropdownModule, SelectButtonModule, TableModule, TagModule, ToastModule, TextareaModule],
    providers: [MessageService, ConfirmationService],
    template: `
        <p-toast />
        <div class="card">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h4 class="m-0">Prévisions de congés — {{ contexte()?.departementLibelle || (contexte()?.estDga ? 'demandes des responsables (DGA)' : '') }}</h4>
                    <span class="text-sm text-color-secondary">Acceptez, rejetez (avec motif) ou réajustez les dates après entretien.</span>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <p-selectButton [options]="vuesOptions" [(ngModel)]="vueActive" optionLabel="label" optionValue="value" />
                    <label class="font-medium ml-2">Exercice</label>
                    <p-dropdown [options]="exercices" [(ngModel)]="exercice" (onChange)="charger()" />
                    <button *ngIf="vueActive === 'demandes'" pButton icon="pi pi-check-square" class="p-button-sm ml-2" severity="success"
                            [label]="'Accepter la sélection (' + selection.length + ')'" [disabled]="selection.length === 0 || lotEnCours()"
                            [loading]="lotEnCours()" (click)="accepterSelection()"></button>
                </div>
            </div>

            <app-apercu-previsions *ngIf="vueActive !== 'demandes'" [previsions]="previsions()"
                                   [exercice]="exercice" [vue]="vueActive === 'annuel' ? 'annuel' : 'calendrier'" />

            <p-table *ngIf="vueActive === 'demandes'" [value]="previsions()" responsiveLayout="scroll" [rowHover]="true"
                     [(selection)]="selection" dataKey="previsionId" [rowSelectable]="selectionnable">
                <ng-template pTemplate="header">
                    <tr>
                        <th style="width:3rem"><p-tableHeaderCheckbox /></th><th>Salarié</th><th>Fonction</th><th>Périodes</th><th>Total</th><th>Statut</th><th>Actions</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-p>
                    <tr>
                        <td><p-tableCheckbox [value]="p" [disabled]="p.statut !== 'SOUMISE'" /></td>
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
                    <tr><td colspan="7" class="text-center text-color-secondary">Aucune prévision pour {{ exercice }}</td></tr>
                </ng-template>
            </p-table>
        </div>

        <!-- V154 : résultats d'un traitement groupé -->
        <p-dialog header="Résultat du traitement groupé" [(visible)]="lotVisible" [modal]="true" [style]="{ width: '640px' }">
            <p class="mb-2">{{ resumeLotTexte() }}</p>
            <p-table [value]="resultatsLot()" responsiveLayout="scroll">
                <ng-template pTemplate="header"><tr><th style="width:6rem">Résultat</th><th>Détail</th></tr></ng-template>
                <ng-template pTemplate="body" let-r>
                    <tr><td><p-tag [value]="r.succes ? 'OK' : 'Refusé'" [severity]="r.succes ? 'success' : 'danger'" /></td><td>{{ r.message }}</td></tr>
                </ng-template>
            </p-table>
            <ng-template pTemplate="footer">
                <button pButton label="Fermer" class="p-button-text" (click)="lotVisible = false"></button>
            </ng-template>
        </p-dialog>

        <p-dialog header="Rejeter la prévision" [(visible)]="rejetVisible" [modal]="true" [style]="{ width: '480px' }">
            <p class="mb-2">Motif du rejet (transmis au salarié pour réadaptation des dates) :</p>
            <textarea pTextarea [(ngModel)]="motifRejet" rows="3" class="w-full"></textarea>
            <ng-template pTemplate="footer">
                <button pButton label="Annuler" class="p-button-text" (click)="rejetVisible = false"></button>
                <button pButton label="Rejeter" severity="danger" [disabled]="!motifRejet.trim()" (click)="rejeter()"></button>
            </ng-template>
        </p-dialog>

        <p-dialog [header]="'Réajuster la prévision — ' + (cible?.nomComplet || '')" [(visible)]="reajustVisible"
                  [modal]="true" [maximizable]="true"
                  [style]="{ width: '95vw', maxWidth: '1500px' }" [contentStyle]="{ overflow: 'auto' }">
            <p class="text-sm text-color-secondary mb-3">
                Après entretien avec le salarié, modifiez ses tranches directement dans le calendrier
                (cliquez sur le premier puis le dernier jour ; cliquez sur une tranche pour la retirer).
                La prévision réajustée partira directement en validation DRH.
            </p>
            <app-calendrier-annuel *ngIf="reajustVisible" [exercice]="exercice" [periodes]="periodesEdit"
                                   (periodesChange)="periodesEdit = $event"
                                   [droit]="contexte()?.droitAnnuelJours || 30" />
            <div class="flex flex-wrap items-center gap-3 mt-3">
                <span *ngFor="let per of periodesEdit" class="text-sm px-2 py-1 border-round"
                      style="background:var(--surface-100)">
                    {{ per.dateDebut | date: 'dd/MM' }} au {{ per.dateFin | date: 'dd/MM/yyyy' }} ({{ per.nbJours }} j)
                </span>
                <span class="font-medium">Total : {{ totalEdit() }} / {{ contexte()?.droitAnnuelJours || 30 }} j</span>
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
    selection: PrevisionConge[] = [];
    selectionnable = (event: { data: { statut: string } }) => event.data?.statut === 'SOUMISE';

    // ===== V154 : traitement groupé =====
    resultatsLot = signal<ResultatLot[]>([]);
    lotVisible = false;
    lotEnCours = signal(false);

    resumeLotTexte(): string {
        return resumeLot(this.resultatsLot()).detail;
    }

    private terminerLot(r: any): void {
        const resultats: ResultatLot[] = (r.data as any)?.resultats || [];
        this.resultatsLot.set(resultats);
        this.lotEnCours.set(false);
        const res = resumeLot(resultats);
        this.messageService.add({ severity: res.ko ? 'warn' : 'success', summary: 'Traitement groupé', detail: res.detail });
        this.lotVisible = res.ko > 0;
        this.viderSelection();
        this.recharger();
    }

    private viderSelection(): void {
        this.selection = [];
    }

    private recharger(): void {
        this.charger();
    }

    accepterSelection(): void {
        this.lotEnCours.set(true);
        this.drhService.accepterPrevisionsLot$(this.selection.map((p) => p.previsionId)).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.terminerLot(r),
            error: (e) => this.erreur(e)
        });
    }

    exercice = new Date().getFullYear();
    exercices = [new Date().getFullYear(), new Date().getFullYear() + 1];

    vueActive: 'demandes' | 'calendrier' | 'annuel' = 'demandes';
    vuesOptions = [
        { label: 'Demandes', value: 'demandes' },
        { label: 'Calendrier du personnel', value: 'calendrier' },
        { label: 'Vue annuelle', value: 'annuel' }
    ];

    rejetVisible = false;
    reajustVisible = false;
    motifRejet = '';
    cible: PrevisionConge | null = null;
    periodesEdit: PeriodePrevision[] = [];

    totalEdit(): number {
        return this.periodesEdit.reduce((s, p) => s + (p.nbJours || 0), 0);
    }

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
                next: () => { this.rejetVisible = false; this.ok("Prévision rejetée — motif transmis au salarié"); },
                error: (e) => this.erreur(e)
            });
    }

    ouvrirReajustement(p: PrevisionConge): void {
        this.cible = p;
        this.periodesEdit = p.periodes.map((x) => ({ ...x }));
        this.reajustVisible = true;
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
