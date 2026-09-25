import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DrhService, DemandeConge, PermissionSociale, ResultatLot, InterruptionConge } from '@/service/drh.service';
import { statutConge, imprimerDemandeConge, imprimerPermission, libelleMotif, libelleLienParente, resumeLot } from '../conge-utils';

/** Validation DRH des demandes de congé acceptées par les responsables. */
@Component({
    selector: 'app-validation-conges',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, DialogModule, DropdownModule, SelectButtonModule, TableModule, TagModule, ToastModule, TextareaModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast />
        <div class="card">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h4 class="m-0">Validation DRH des congés</h4>
                    <span class="text-sm text-color-secondary">Demandes acceptées par les responsables, en attente de validation finale.</span>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <p-selectButton [options]="types" [(ngModel)]="typeActif" optionLabel="label" optionValue="value"
                                    (onChange)="charger()" />
                    <label class="font-medium ml-2">Exercice</label>
                    <p-dropdown [options]="exercices" [(ngModel)]="exercice" (onChange)="charger()" />
                    <button *ngIf="typeActif !== 'interruptions'" pButton icon="pi pi-check-square" class="p-button-sm ml-2" severity="success"
                            [label]="'Valider la sélection (' + nbSelection() + ')'" [disabled]="nbSelection() === 0 || lotEnCours()"
                            [loading]="lotEnCours()" (click)="validerSelection()"></button>
                </div>
            </div>

            <p-table *ngIf="typeActif === 'permissions'" [value]="permissions()" responsiveLayout="scroll" [rowHover]="true"
                     [(selection)]="selectionPermissions" dataKey="permissionId">
                <ng-template pTemplate="header">
                    <tr><th style="width:3rem"><p-tableHeaderCheckbox /></th><th>Salarié</th><th>Direction</th><th>Motif</th><th>Du</th><th>Au</th><th>Jours</th><th>Responsable</th><th>Actions</th></tr>
                </ng-template>
                <ng-template pTemplate="body" let-p>
                    <tr>
                        <td><p-tableCheckbox [value]="p" /></td>
                        <td>{{ p.nomComplet }}<div class="text-xs text-color-secondary" *ngIf="p.matricule">Mat. {{ p.matricule }}</div></td>
                        <td>{{ p.departementCode }}</td>
                        <td>{{ motifLabel(p.motif) }}
                            <div class="text-xs text-color-secondary" *ngIf="p.lienParente">{{ lienLabel(p.lienParente) }}</div>
                            <div class="text-xs text-color-secondary" *ngIf="p.precisionMotif">{{ p.precisionMotif }}</div></td>
                        <td>{{ p.dateDebut | date: 'dd/MM/yyyy' }}</td>
                        <td>{{ p.dateFin | date: 'dd/MM/yyyy' }}</td>
                        <td class="font-medium">{{ p.nbJours }} j</td>
                        <td class="text-sm">{{ p.traiteeRespNom }}<br>{{ p.traiteeRespLe | date: 'dd/MM/yyyy' }}</td>
                        <td>
                            <div class="flex gap-1">
                                <button pButton icon="pi pi-check" class="p-button-sm" severity="success"
                                        pTooltip="Valider" (click)="validerPermission(p)"></button>
                                <button pButton icon="pi pi-undo" class="p-button-sm" severity="danger"
                                        pTooltip="Renvoyer" (click)="ouvrirRenvoiPermission(p)"></button>
                                <button pButton icon="pi pi-print" class="p-button-text p-button-sm"
                                        pTooltip="Imprimer" (click)="imprimerPerm(p)"></button>
                            </div>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr><td colspan="9" class="text-center text-color-secondary">Aucune permission en attente pour {{ exercice }}</td></tr>
                </ng-template>
            </p-table>

            <p-table *ngIf="typeActif === 'conges'" [value]="demandes()" responsiveLayout="scroll" [rowHover]="true"
                     [(selection)]="selectionConges" dataKey="demandeId">
                <ng-template pTemplate="header">
                    <tr><th style="width:3rem"><p-tableHeaderCheckbox /></th><th>Salarié</th><th>Direction</th><th>Du</th><th>Au</th><th>Jours</th><th>Déjà pris</th><th>Solde après</th><th>Responsable</th><th>Actions</th></tr>
                </ng-template>
                <ng-template pTemplate="body" let-d>
                    <tr>
                        <td><p-tableCheckbox [value]="d" /></td>
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
                    <tr><td colspan="10" class="text-center text-color-secondary">Aucune demande en attente pour {{ exercice }}</td></tr>
                </ng-template>
            </p-table>

            <!-- V155 : interruptions déclarées par les responsables -->
            <p-table *ngIf="typeActif === 'interruptions'" [value]="interruptions()" responsiveLayout="scroll" [rowHover]="true">
                <ng-template pTemplate="header">
                    <tr><th>Salarié</th><th>Direction</th><th>Congé</th><th>Reprise souhaitée</th><th>Motif</th><th>Déclarée par</th><th>Actions</th></tr>
                </ng-template>
                <ng-template pTemplate="body" let-i>
                    <tr>
                        <td>{{ i.nomComplet }}<div class="text-xs text-color-secondary" *ngIf="i.matricule">Mat. {{ i.matricule }}</div></td>
                        <td>{{ i.departementCode }}</td>
                        <td>{{ i.dateDebut | date: 'dd/MM/yyyy' }} → {{ i.dateFin | date: 'dd/MM/yyyy' }} ({{ i.nbJours }} j)</td>
                        <td class="font-medium">{{ i.dateRepriseSouhaitee | date: 'dd/MM/yyyy' }}</td>
                        <td>{{ i.motif }}</td>
                        <td class="text-sm">{{ i.declareeParNom }}<br>{{ i.declareeLe | date: 'dd/MM/yyyy HH:mm' }}</td>
                        <td>
                            <div class="flex gap-1">
                                <button pButton icon="pi pi-check" class="p-button-sm" severity="success" pTooltip="Valider (ajuster la date si besoin)" (click)="ouvrirValidationInterruption(i)"></button>
                                <button pButton icon="pi pi-times" class="p-button-sm" severity="danger" pTooltip="Refuser" (click)="ouvrirRefusInterruption(i)"></button>
                            </div>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr><td colspan="7" class="text-center text-color-secondary">Aucune interruption à traiter pour {{ exercice }}</td></tr>
                </ng-template>
            </p-table>
        </div>


        <p-dialog header="Valider l'interruption" [(visible)]="interruptionVisible" [modal]="true" [style]="{ width: '520px' }">
            <p class="text-sm text-color-secondary mb-3" *ngIf="interruptionCible as i">
                Congé de {{ i.nomComplet }} du {{ i.dateDebut | date: 'dd/MM/yyyy' }} au {{ i.dateFin | date: 'dd/MM/yyyy' }} ({{ i.nbJours }} j).
                Motif du responsable : {{ i.motif }}. Les jours ouvrables non consommés à compter de la reprise seront recrédités.
            </p>
            <label class="block mb-1 font-medium">Date de reprise retenue *</label>
            <input type="date" class="p-inputtext w-full" [(ngModel)]="dateRepriseRetenue" />
            <ng-template pTemplate="footer">
                <button pButton label="Fermer" class="p-button-text" (click)="interruptionVisible = false"></button>
                <button pButton label="Valider l'interruption" severity="warn" icon="pi pi-check" [disabled]="!dateRepriseRetenue" (click)="validerInterruption()"></button>
            </ng-template>
        </p-dialog>

        <p-dialog header="Refuser l'interruption" [(visible)]="refusVisible" [modal]="true" [style]="{ width: '480px' }">
            <p class="mb-2">Motif du refus (transmis au responsable) :</p>
            <textarea pTextarea [(ngModel)]="motifRefus" rows="3" class="w-full"></textarea>
            <ng-template pTemplate="footer">
                <button pButton label="Annuler" class="p-button-text" (click)="refusVisible = false"></button>
                <button pButton label="Refuser" severity="danger" [disabled]="!motifRefus.trim()" (click)="refuserInterruption()"></button>
            </ng-template>
        </p-dialog>
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

        <p-dialog header="Renvoyer la demande" [(visible)]="renvoiVisible" [modal]="true" [style]="{ width: '480px' }">
            <p class="mb-2">Motif du renvoi (transmis au salarié) :</p>
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
    permissions = signal<PermissionSociale[]>([]);
    typeActif: 'conges' | 'permissions' | 'interruptions' = 'conges';
    types = [
        { label: 'Congés', value: 'conges' },
        { label: 'Permissions sociales', value: 'permissions' },
        { label: 'Interruptions', value: 'interruptions' }
    ];
    // V155 : déclarations d'interruption à traiter
    interruptions = signal<InterruptionConge[]>([]);
    interruptionCible: InterruptionConge | null = null;
    interruptionVisible = false;
    refusVisible = false;
    dateRepriseRetenue = '';
    motifRefus = '';

    ouvrirValidationInterruption(i: InterruptionConge): void {
        this.interruptionCible = i;
        this.dateRepriseRetenue = i.dateRepriseSouhaitee;
        this.interruptionVisible = true;
    }

    validerInterruption(): void {
        if (!this.interruptionCible) return;
        this.drhService.validerInterruption$(this.interruptionCible.interruptionId, { dateReprise: this.dateRepriseRetenue || null })
            .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                next: () => { this.interruptionVisible = false; this.ok('Interruption validée — congé interrompu, jours recrédités, salarié et responsable notifiés'); },
                error: (e) => this.erreur(e)
            });
    }

    ouvrirRefusInterruption(i: InterruptionConge): void {
        this.interruptionCible = i;
        this.motifRefus = '';
        this.refusVisible = true;
    }

    refuserInterruption(): void {
        if (!this.interruptionCible || !this.motifRefus.trim()) return;
        this.drhService.refuserInterruption$(this.interruptionCible.interruptionId, this.motifRefus.trim())
            .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                next: () => { this.refusVisible = false; this.ok('Interruption refusée — le responsable est notifié, le congé se poursuit'); },
                error: (e) => this.erreur(e)
            });
    }
    motifLabel = libelleMotif;
    lienLabel = libelleLienParente;
    exercice = new Date().getFullYear();
    exercices = [new Date().getFullYear(), new Date().getFullYear() + 1];

    renvoiVisible = false;
    motif = '';
    cible: DemandeConge | null = null;
    ciblePermission: PermissionSociale | null = null;

    statut = statutConge;
    selectionConges: DemandeConge[] = [];
    selectionPermissions: PermissionSociale[] = [];

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

    nbSelection(): number {
        return this.typeActif === 'conges' ? this.selectionConges.length : this.selectionPermissions.length;
    }

    private viderSelection(): void {
        this.selectionConges = [];
        this.selectionPermissions = [];
    }

    private recharger(): void {
        this.charger();
    }

    validerSelection(): void {
        const obs = this.typeActif === 'conges'
            ? this.drhService.validerCongesLot$(this.selectionConges.map((d) => d.demandeId))
            : this.drhService.validerPermissionsLot$(this.selectionPermissions.map((p) => p.permissionId));
        this.lotEnCours.set(true);
        obs.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.terminerLot(r),
            error: (e) => { this.lotEnCours.set(false); this.erreur(e); }
        });
    }

    ngOnInit(): void {
        this.charger();
    }

    charger(): void {
        this.drhService.congesAValider$(this.exercice).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.demandes.set((r.data as any)?.demandes || []),
            error: (e) => this.erreur(e)
        });
        this.drhService.permissionsAValider$(this.exercice).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.permissions.set((r.data as any)?.permissions || []),
            error: () => {}
        });
        this.drhService.interruptionsATraiter$(this.exercice).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.interruptions.set((r.data as any)?.interruptions || []),
            error: () => {}
        });
    }

    validerPermission(p: PermissionSociale): void {
        this.drhService.validerPermission$(p.permissionId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => this.ok('Permission validée — le salarié est notifié'),
            error: (e) => this.erreur(e)
        });
    }

    ouvrirRenvoiPermission(p: PermissionSociale): void {
        this.ciblePermission = p;
        this.cible = null;
        this.motif = '';
        this.renvoiVisible = true;
    }

    imprimerPerm(p: PermissionSociale): void {
        imprimerPermission(p);
    }

    valider(d: DemandeConge): void {
        this.drhService.validerConge$(d.demandeId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => this.ok("Congé validé — le salarié est notifié"),
            error: (e) => this.erreur(e)
        });
    }

    ouvrirRenvoi(d: DemandeConge): void {
        this.cible = d;
        this.ciblePermission = null;
        this.motif = '';
        this.renvoiVisible = true;
    }

    renvoyer(): void {
        const obs = this.cible
            ? this.drhService.renvoyerConge$(this.cible.demandeId, this.motif.trim())
            : this.ciblePermission
              ? this.drhService.renvoyerPermission$(this.ciblePermission.permissionId, this.motif.trim())
              : null;
        if (!obs) return;
        obs.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
