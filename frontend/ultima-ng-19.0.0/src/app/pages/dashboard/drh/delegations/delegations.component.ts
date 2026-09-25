import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DrhService, DelegationDrh, CandidatDelegation, FONCTIONS_DRH, libelleFonctionDrh } from '@/service/drh.service';

/**
 * V154 — « Délégations de fonctions » : l'administrateur DRH désigne des salariés de son département
 * pour une fonction (plusieurs par fonction), et un DGA unique (VALIDATION_FINALE). Révocable à tout moment.
 */
@Component({
    selector: 'app-delegations-drh',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, DialogModule, DropdownModule, TableModule, TagModule, ToastModule, TooltipModule, InputTextModule],
    providers: [MessageService],
    template: `
        <p-toast />
        <div class="card">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h4 class="m-0">Délégations de fonctions DRH</h4>
                    <span class="text-sm text-color-secondary">Passez la main à un salarié de la DRH pour une fonction. Le DGA (validation finale) est unique et peut être hors DRH.</span>
                </div>
                <div class="flex items-center gap-2">
                    <button pButton icon="pi pi-history" [label]="historique ? 'Actives seulement' : 'Voir l’historique'" class="p-button-text p-button-sm" (click)="historique = !historique; charger()"></button>
                    <button pButton icon="pi pi-user-plus" label="Nouvelle délégation" (click)="ouvrir()"></button>
                </div>
            </div>

            <p-table [value]="delegations()" responsiveLayout="scroll" [rowHover]="true" [loading]="chargement()">
                <ng-template pTemplate="header">
                    <tr><th>Fonction</th><th>Salarié délégué</th><th>Département</th><th>Depuis</th><th>Jusqu’au</th><th>Attribuée par</th><th>État</th><th>Actions</th></tr>
                </ng-template>
                <ng-template pTemplate="body" let-d>
                    <tr>
                        <td><span class="font-medium">{{ libelle(d.fonction) }}</span>
                            <p-tag *ngIf="d.fonction === 'VALIDATION_FINALE'" value="DGA" severity="contrast" class="ml-2" /></td>
                        <td>{{ d.delegueNom }}<div class="text-xs text-color-secondary" *ngIf="d.delegueUsername">{{ d.delegueUsername }}</div></td>
                        <td>{{ d.departementCode || '—' }}</td>
                        <td>{{ d.dateDebut | date: 'dd/MM/yyyy' }}</td>
                        <td>{{ d.dateFin ? (d.dateFin | date: 'dd/MM/yyyy') : 'sans limite' }}</td>
                        <td class="text-sm">{{ d.attribueeParNom }}</td>
                        <td>
                            <p-tag [value]="d.actif ? 'Active' : 'Révoquée'" [severity]="d.actif ? 'success' : 'secondary'" />
                            <div class="text-xs text-color-secondary" *ngIf="!d.actif && d.revoqueeLe">{{ d.revoqueeLe | date: 'dd/MM/yyyy' }} — {{ d.revoqueeParNom }}</div>
                            <div class="text-xs text-color-secondary" *ngIf="d.commentaire">{{ d.commentaire }}</div>
                        </td>
                        <td>
                            <button *ngIf="d.actif" pButton icon="pi pi-times" class="p-button-sm p-button-outlined" severity="danger"
                                    pTooltip="Révoquer" (click)="revoquer(d)"></button>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr><td colspan="8" class="text-center text-color-secondary">Aucune délégation {{ historique ? '' : 'active' }}</td></tr>
                </ng-template>
            </p-table>
        </div>

        <p-dialog header="Nouvelle délégation" [(visible)]="dialogVisible" [modal]="true" [style]="{ width: '560px' }">
            <div class="flex flex-col gap-3">
                <div>
                    <label class="block text-sm font-medium mb-1">Fonction *</label>
                    <p-dropdown [options]="fonctions" [(ngModel)]="fonction" optionLabel="label" optionValue="value" styleClass="w-full"
                                (onChange)="chargerCandidats()" placeholder="Choisir une fonction" appendTo="body" />
                    <small class="text-color-secondary" *ngIf="descriptionFonction()">{{ descriptionFonction() }}</small>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Salarié *</label>
                    <p-dropdown [options]="candidats()" [(ngModel)]="delegueUserId" optionLabel="nomComplet" optionValue="userId" styleClass="w-full"
                                [filter]="true" filterBy="nomComplet,username" [disabled]="!fonction" appendTo="body"
                                [placeholder]="fonction === 'VALIDATION_FINALE' ? 'Tout salarié' : 'Salarié du département DRH'" />
                    <small class="text-color-secondary" *ngIf="fonction && fonction !== 'VALIDATION_FINALE' && candidats().length === 0">
                        Aucun salarié affecté au département DRH : affectez-le d’abord dans « Organisation ».</small>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Jusqu’au (optionnel)</label>
                    <input pInputText type="date" [(ngModel)]="dateFin" class="w-full" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Commentaire (optionnel)</label>
                    <input pInputText [(ngModel)]="commentaire" class="w-full" maxlength="255" />
                </div>
            </div>
            <ng-template pTemplate="footer">
                <button pButton label="Annuler" class="p-button-text" (click)="dialogVisible = false"></button>
                <button pButton label="Attribuer" icon="pi pi-check" [disabled]="!fonction || !delegueUserId || enregistrement()" [loading]="enregistrement()" (click)="creer()"></button>
            </ng-template>
        </p-dialog>
    `
})
export class DelegationsComponent implements OnInit {
    private drhService = inject(DrhService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

    delegations = signal<DelegationDrh[]>([]);
    candidats = signal<CandidatDelegation[]>([]);
    chargement = signal(false);
    enregistrement = signal(false);
    historique = false;
    fonctions = FONCTIONS_DRH;
    libelle = libelleFonctionDrh;

    dialogVisible = false;
    fonction: string | null = null;
    delegueUserId: number | null = null;
    dateFin = '';
    commentaire = '';

    ngOnInit(): void {
        this.charger();
    }

    charger(): void {
        this.chargement.set(true);
        this.drhService.delegations$(this.historique).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => { this.delegations.set((r.data as any)?.delegations || []); this.chargement.set(false); },
            error: (e) => { this.chargement.set(false); this.erreur(e); }
        });
    }

    descriptionFonction(): string {
        return FONCTIONS_DRH.find((f) => f.value === this.fonction)?.description || '';
    }

    ouvrir(): void {
        this.fonction = null;
        this.delegueUserId = null;
        this.dateFin = '';
        this.commentaire = '';
        this.candidats.set([]);
        this.dialogVisible = true;
    }

    chargerCandidats(): void {
        this.delegueUserId = null;
        if (!this.fonction) return;
        this.drhService.candidatsDelegation$(this.fonction).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.candidats.set((r.data as any)?.candidats || []),
            error: (e) => this.erreur(e)
        });
    }

    creer(): void {
        if (!this.fonction || !this.delegueUserId) return;
        this.enregistrement.set(true);
        this.drhService.creerDelegation$({ delegueUserId: this.delegueUserId, fonction: this.fonction, dateFin: this.dateFin || null, commentaire: this.commentaire || undefined })
            .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                next: () => { this.enregistrement.set(false); this.dialogVisible = false; this.ok('Délégation attribuée — le salarié est notifié par SMS'); },
                error: (e) => { this.enregistrement.set(false); this.erreur(e); }
            });
    }

    revoquer(d: DelegationDrh): void {
        this.drhService.revoquerDelegation$(d.delegationId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => this.ok(`Délégation « ${this.libelle(d.fonction)} » retirée à ${d.delegueNom}`),
            error: (e) => this.erreur(e)
        });
    }

    private ok(detail: string): void {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail });
        this.charger();
    }

    private erreur(e: any): void {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: e.error?.data?.error || e.error?.message || 'Opération impossible' });
    }
}
