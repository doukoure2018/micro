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
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DrhService, DemandeConge } from '@/service/drh.service';
import { statutConge, imprimerDemandeConge } from '../conge-utils';

/** Validation DRH des demandes de congé acceptées par les responsables. */
@Component({
    selector: 'app-validation-conges',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, DialogModule, DropdownModule, TableModule, TagModule, ToastModule, TextareaModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast />
        <div class="card">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h4 class="m-0">Validation DRH des congés</h4>
                    <span class="text-sm text-color-secondary">Demandes acceptées par les responsables, en attente de validation finale.</span>
                </div>
                <div class="flex items-center gap-2">
                    <label class="font-medium">Exercice</label>
                    <p-dropdown [options]="exercices" [(ngModel)]="exercice" (onChange)="charger()" />
                </div>
            </div>

            <p-table [value]="demandes()" responsiveLayout="scroll" [rowHover]="true">
                <ng-template pTemplate="header">
                    <tr><th>Agent</th><th>Direction</th><th>Du</th><th>Au</th><th>Jours</th><th>Déjà pris</th><th>Solde après</th><th>Responsable</th><th>Actions</th></tr>
                </ng-template>
                <ng-template pTemplate="body" let-d>
                    <tr>
                        <td>{{ d.nomComplet }}<div class="text-xs text-color-secondary" *ngIf="d.matricule">Mat. {{ d.matricule }}</div></td>
                        <td>{{ d.departementCode }}</td>
                        <td>{{ d.dateDebut | date: 'dd/MM/yyyy' }}</td>
                        <td>{{ d.dateFin | date: 'dd/MM/yyyy' }}</td>
                        <td class="font-medium">{{ d.nbJours }} j</td>
                        <td>{{ d.dejaPris }} j</td>
                        <td>{{ d.soldeApres }} j</td>
                        <td class="text-sm">{{ d.traiteeRespNom }}<br>{{ d.traiteeRespLe | date: 'dd/MM/yyyy' }}</td>
                        <td>
                            <div class="flex gap-1">
                                <button pButton icon="pi pi-check" class="p-button-sm" severity="success"
                                        pTooltip="Valider le congé" (click)="valider(d)"></button>
                                <button pButton icon="pi pi-undo" class="p-button-sm" severity="danger"
                                        pTooltip="Renvoyer" (click)="ouvrirRenvoi(d)"></button>
                                <button pButton icon="pi pi-print" class="p-button-text p-button-sm"
                                        pTooltip="Imprimer le formulaire" (click)="imprimer(d)"></button>
                            </div>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr><td colspan="9" class="text-center text-color-secondary">Aucune demande en attente pour {{ exercice }}</td></tr>
                </ng-template>
            </p-table>
        </div>

        <p-dialog header="Renvoyer la demande" [(visible)]="renvoiVisible" [modal]="true" [style]="{ width: '480px' }">
            <p class="mb-2">Motif du renvoi (transmis à l'agent) :</p>
            <textarea pTextarea [(ngModel)]="motif" rows="3" class="w-full"></textarea>
            <ng-template pTemplate="footer">
                <button pButton label="Annuler" class="p-button-text" (click)="renvoiVisible = false"></button>
                <button pButton label="Renvoyer" severity="danger" [disabled]="!motif.trim()" (click)="renvoyer()"></button>
            </ng-template>
        </p-dialog>
    `
})
export class ValidationCongesComponent implements OnInit {
    private drhService = inject(DrhService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

    demandes = signal<DemandeConge[]>([]);
    exercice = new Date().getFullYear();
    exercices = [new Date().getFullYear(), new Date().getFullYear() + 1];

    renvoiVisible = false;
    motif = '';
    cible: DemandeConge | null = null;

    statut = statutConge;

    ngOnInit(): void {
        this.charger();
    }

    charger(): void {
        this.drhService.congesAValider$(this.exercice).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.demandes.set((r.data as any)?.demandes || []),
            error: (e) => this.erreur(e)
        });
    }

    valider(d: DemandeConge): void {
        this.drhService.validerConge$(d.demandeId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => this.ok("Congé validé — l'agent est notifié"),
            error: (e) => this.erreur(e)
        });
    }

    ouvrirRenvoi(d: DemandeConge): void {
        this.cible = d;
        this.motif = '';
        this.renvoiVisible = true;
    }

    renvoyer(): void {
        if (!this.cible) return;
        this.drhService.renvoyerConge$(this.cible.demandeId, this.motif.trim())
            .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                next: () => {
                    this.renvoiVisible = false;
                    this.ok('Demande renvoyée');
                },
                error: (e) => this.erreur(e)
            });
    }

    imprimer(d: DemandeConge): void {
        imprimerDemandeConge(d, 30);
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
