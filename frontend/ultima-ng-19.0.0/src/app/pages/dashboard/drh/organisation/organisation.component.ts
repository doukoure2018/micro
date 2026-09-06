import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DrhService, DepartementDrh, MembreDepartement } from '@/service/drh.service';

/** Écran DRH « Organisation » : départements, affectation des agents, responsables. */
@Component({
    selector: 'app-drh-organisation',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, CheckboxModule, DialogModule, DropdownModule, InputTextModule, TableModule, TagModule, ToastModule],
    providers: [MessageService],
    template: `
        <p-toast />
        <div class="grid">
            <div class="col-12 lg:col-5">
                <div class="card">
                    <div class="flex items-center justify-between mb-3">
                        <h5 class="m-0">Départements</h5>
                        <button pButton icon="pi pi-plus" label="Nouveau" class="p-button-sm" (click)="ouvrirDepartement()"></button>
                    </div>
                    <p-table [value]="departements()" selectionMode="single" [(selection)]="selection"
                             (onRowSelect)="chargerMembres()" responsiveLayout="scroll" [rowHover]="true" dataKey="departementId">
                        <ng-template pTemplate="header">
                            <tr><th>Code</th><th>Libellé</th><th>Membres</th><th>Responsable(s)</th><th></th></tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-d>
                            <tr [pSelectableRow]="d">
                                <td class="font-medium">{{ d.code }}</td>
                                <td>{{ d.libelle }}</td>
                                <td>{{ d.nbMembres }}</td>
                                <td class="text-sm">{{ d.responsables || '—' }}</td>
                                <td><button pButton icon="pi pi-pencil" class="p-button-text p-button-sm"
                                            (click)="ouvrirDepartement(d); $event.stopPropagation()"></button></td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>
            <div class="col-12 lg:col-7">
                <div class="card" *ngIf="selection; else choisir">
                    <div class="flex items-center justify-between mb-3">
                        <h5 class="m-0">Membres — {{ selection.code }}</h5>
                        <button pButton icon="pi pi-user-plus" label="Affecter un agent" class="p-button-sm" (click)="ouvrirAffectation()"></button>
                    </div>
                    <p-table [value]="membres()" responsiveLayout="scroll">
                        <ng-template pTemplate="header">
                            <tr><th>Agent</th><th>Matricule</th><th>Fonction</th><th>Rôle</th><th></th></tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-m>
                            <tr>
                                <td>{{ m.nomComplet }}<div class="text-xs text-color-secondary">{{ m.username }}</div></td>
                                <td>{{ m.matricule || '—' }}</td>
                                <td>{{ m.fonction || '—' }}</td>
                                <td><p-tag *ngIf="m.estResponsable" value="Responsable" severity="success" />
                                    <span *ngIf="!m.estResponsable" class="text-color-secondary text-sm">Membre</span></td>
                                <td><button pButton icon="pi pi-user-minus" class="p-button-text p-button-danger p-button-sm"
                                            pTooltip="Retirer du département" (click)="retirer(m)"></button></td>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="emptymessage">
                            <tr><td colspan="5" class="text-center text-color-secondary">Aucun membre affecté</td></tr>
                        </ng-template>
                    </p-table>
                </div>
                <ng-template #choisir>
                    <div class="card text-color-secondary">Sélectionnez un département pour gérer ses membres.</div>
                </ng-template>
            </div>
        </div>

        <p-dialog [header]="departementEdit.departementId ? 'Modifier le département' : 'Nouveau département'"
                  [(visible)]="departementVisible" [modal]="true" [style]="{ width: '440px' }">
            <div class="flex flex-col gap-3">
                <div><label class="block mb-1">Code *</label>
                    <input pInputText [(ngModel)]="departementEdit.code" class="w-full" maxlength="20" /></div>
                <div><label class="block mb-1">Libellé *</label>
                    <input pInputText [(ngModel)]="departementEdit.libelle" class="w-full" maxlength="150" /></div>
                <div><label class="block mb-1">Type</label>
                    <p-dropdown [options]="types" [(ngModel)]="departementEdit.type" class="w-full" /></div>
            </div>
            <ng-template pTemplate="footer">
                <button pButton label="Annuler" class="p-button-text" (click)="departementVisible = false"></button>
                <button pButton label="Enregistrer" [disabled]="!departementEdit.code || !departementEdit.libelle"
                        (click)="enregistrerDepartement()"></button>
            </ng-template>
        </p-dialog>

        <p-dialog header="Affecter un agent" [(visible)]="affectationVisible" [modal]="true" [style]="{ width: '480px' }">
            <div class="flex flex-col gap-3">
                <div><label class="block mb-1">Agent *</label>
                    <p-dropdown [options]="usersNonAffectes()" optionLabel="nom_complet" [(ngModel)]="userChoisi"
                                [filter]="true" filterBy="nom_complet,username" placeholder="Choisir un agent"
                                class="w-full" appendTo="body" /></div>
                <div><label class="block mb-1">Matricule (référence badgeuse / personnel)</label>
                    <input pInputText [(ngModel)]="affectation.matricule" class="w-full" maxlength="50" /></div>
                <div><label class="block mb-1">Fonction</label>
                    <input pInputText [(ngModel)]="affectation.fonction" class="w-full" maxlength="100" /></div>
                <div class="flex items-center gap-2">
                    <p-checkbox [(ngModel)]="affectation.estResponsable" [binary]="true" inputId="estResp" />
                    <label for="estResp">Responsable du département (traite les prévisions)</label>
                </div>
            </div>
            <ng-template pTemplate="footer">
                <button pButton label="Annuler" class="p-button-text" (click)="affectationVisible = false"></button>
                <button pButton label="Affecter" [disabled]="!userChoisi" (click)="affecter()"></button>
            </ng-template>
        </p-dialog>
    `
})
export class OrganisationComponent implements OnInit {
    private drhService = inject(DrhService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

    departements = signal<DepartementDrh[]>([]);
    membres = signal<MembreDepartement[]>([]);
    usersNonAffectes = signal<any[]>([]);
    selection: DepartementDrh | null = null;

    types = ['SIEGE', 'DELEGATION'];
    departementVisible = false;
    departementEdit: DepartementDrh = { code: '', libelle: '', type: 'SIEGE' };
    affectationVisible = false;
    affectation = { matricule: '', fonction: '', estResponsable: false };
    userChoisi: any = null;

    ngOnInit(): void {
        this.chargerDepartements();
    }

    chargerDepartements(): void {
        this.drhService.departements$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.departements.set((r.data as any)?.departements || []),
            error: (e) => this.erreur(e)
        });
    }

    chargerMembres(): void {
        if (!this.selection?.departementId) return;
        this.drhService.membres$(this.selection.departementId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.membres.set((r.data as any)?.membres || []),
            error: (e) => this.erreur(e)
        });
    }

    ouvrirDepartement(d?: DepartementDrh): void {
        this.departementEdit = d ? { ...d } : { code: '', libelle: '', type: 'SIEGE' };
        this.departementVisible = true;
    }

    enregistrerDepartement(): void {
        const obs = this.departementEdit.departementId
            ? this.drhService.modifierDepartement$(this.departementEdit.departementId, this.departementEdit)
            : this.drhService.creerDepartement$(this.departementEdit);
        obs.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => {
                this.departementVisible = false;
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Département enregistré' });
                this.chargerDepartements();
            },
            error: (e) => this.erreur(e)
        });
    }

    ouvrirAffectation(): void {
        this.userChoisi = null;
        this.affectation = { matricule: '', fonction: '', estResponsable: false };
        this.drhService.usersNonAffectes$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => {
                this.usersNonAffectes.set((r.data as any)?.users || []);
                this.affectationVisible = true;
            },
            error: (e) => this.erreur(e)
        });
    }

    affecter(): void {
        if (!this.userChoisi || !this.selection?.departementId) return;
        this.drhService.affecterMembre$({
            departementId: this.selection.departementId,
            userId: this.userChoisi.user_id,
            matricule: this.affectation.matricule || this.userChoisi.matricule || undefined,
            fonction: this.affectation.fonction || undefined,
            estResponsable: this.affectation.estResponsable
        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => {
                this.affectationVisible = false;
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Agent affecté au département' });
                this.chargerDepartements();
                this.chargerMembres();
            },
            error: (e) => this.erreur(e)
        });
    }

    retirer(m: MembreDepartement): void {
        this.drhService.retirerMembre$(m.membreId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Agent retiré du département' });
                this.chargerDepartements();
                this.chargerMembres();
            },
            error: (e) => this.erreur(e)
        });
    }

    private erreur(e: any): void {
        this.messageService.add({
            severity: 'error', summary: 'Erreur',
            detail: e.error?.data?.error || e.error?.message || 'Opération impossible'
        });
    }
}
