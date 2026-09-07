import { Component, DestroyRef, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DrhService, PermissionSociale, QuotaPermission } from '@/service/drh.service';
import { statutConge, imprimerPermission, MOTIFS_PERMISSION, LIENS_PARENTE, libelleMotif, libelleLienParente } from '../conge-utils';

/**
 * « Mes permissions sociales » : quota, dépôt (préavis J-2 sauf décès),
 * suivi du circuit et impression. Le formulaire se masque tant qu'une
 * demande est en instance (soumise ou acceptée).
 */
@Component({
    selector: 'app-mes-permissions',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, CalendarModule, ConfirmDialogModule, DropdownModule, InputTextModule, TableModule, TagModule, ToastModule, TooltipModule],
    providers: [MessageService, ConfirmationService],
    template: `
        <p-toast />
        <p-confirmDialog />
        <div class="grid">
            <div class="col-12 lg:col-4">
                <div class="card" *ngIf="quota() as q">
                    <h5 class="m-0 mb-3">Mon quota {{ exercice }}</h5>
                    <div class="flex justify-between mb-2"><span>Quota annuel</span><b>{{ q.quota }} j</b></div>
                    <div class="flex justify-between mb-2"><span>Déjà pris</span><b>{{ q.pris }} j</b></div>
                    <div class="flex justify-between text-lg"><span>Restant</span>
                        <b [class.text-red-500]="q.restant === 0" [class.text-green-600]="q.restant > 0">{{ q.restant }} j</b></div>
                    <div class="mt-3 text-sm text-color-secondary">
                        Demande à déposer au moins {{ q.delaiPreavisJours }} jours avant le départ (sauf décès).
                        La permission sociale ne touche pas au droit de congé de 30 jours.
                    </div>
                </div>

                <!-- Demande en instance : le formulaire est masqué -->
                <div class="card" *ngIf="enInstance() as p">
                    <h5 class="m-0 mb-3"><i class="pi pi-hourglass mr-1"></i> Demande en instance</h5>
                    <div class="flex flex-col gap-2">
                        <p-tag [value]="statut(p.statut).label" [severity]="statut(p.statut).severity" />
                        <div><b>Motif :</b> {{ motifLabel(p.motif) }}
                            <span *ngIf="p.lienParente">— {{ lienLabel(p.lienParente) }}</span>
                            <span *ngIf="p.precisionMotif">({{ p.precisionMotif }})</span></div>
                        <div><b>Du :</b> {{ p.dateDebut | date: 'dd/MM/yyyy' }} <b>au</b> {{ p.dateFin | date: 'dd/MM/yyyy' }} inclus</div>
                        <div><b>Durée :</b> {{ p.nbJours }} jours ouvrables</div>
                        <div class="text-sm text-color-secondary" *ngIf="p.traiteeRespNom">
                            Acceptée par {{ p.traiteeRespNom }} le {{ p.traiteeRespLe | date: 'dd/MM/yyyy HH:mm' }}
                        </div>
                        <button pButton label="Annuler ma demande" icon="pi pi-times" severity="danger"
                                class="p-button-outlined mt-2" *ngIf="p.statut === 'SOUMISE'"
                                (click)="annuler(p)"></button>
                    </div>
                </div>

                <!-- Formulaire : visible uniquement sans demande en instance -->
                <div class="card" *ngIf="!enInstance()">
                    <h5 class="m-0 mb-3">Nouvelle permission sociale</h5>
                    <div class="flex flex-col gap-3">
                        <div><label class="block mb-1 font-medium">Motif *</label>
                            <p-dropdown [options]="motifs" optionLabel="label" optionValue="value"
                                        [(ngModel)]="motif" placeholder="Choisir un motif" class="w-full" appendTo="body" /></div>
                        <div *ngIf="motif && motif !== 'AUTRE' && motif !== 'MARIAGE'">
                            <label class="block mb-1">Lien de parenté</label>
                            <p-dropdown [options]="liens" optionLabel="label" optionValue="value"
                                        [(ngModel)]="lienParente" [showClear]="true"
                                        placeholder="Concerne…" class="w-full" appendTo="body" /></div>
                        <div *ngIf="motif === 'AUTRE'">
                            <label class="block mb-1 font-medium">Précision du motif *</label>
                            <input pInputText [(ngModel)]="precisionMotif" class="w-full" maxlength="300" /></div>
                        <div class="grid">
                            <div class="col-6"><label class="block mb-1">Du *</label>
                                <p-calendar [(ngModel)]="dateDebut" dateFormat="dd/mm/yy" [showIcon]="true" appendTo="body"
                                            (onSelect)="calculerJours()" /></div>
                            <div class="col-6"><label class="block mb-1">Au *</label>
                                <p-calendar [(ngModel)]="dateFin" dateFormat="dd/mm/yy" [showIcon]="true" appendTo="body"
                                            (onSelect)="calculerJours()" /></div>
                        </div>
                        <div class="font-medium" *ngIf="nbJours() > 0">{{ nbJours() }} jours ouvrables</div>
                        <button pButton label="Soumettre à mon responsable" icon="pi pi-send" severity="success"
                                [loading]="saving()" [disabled]="!motif || !dateDebut || !dateFin"
                                (click)="soumettre()"></button>
                    </div>
                </div>
            </div>

            <div class="col-12 lg:col-8">
                <div class="card">
                    <div class="flex items-center justify-between mb-3">
                        <h5 class="m-0">Mes permissions sociales</h5>
                        <p-dropdown [options]="exercices" [(ngModel)]="exercice" (onChange)="charger()" />
                    </div>
                    <p-table [value]="permissions()" responsiveLayout="scroll" [rowHover]="true">
                        <ng-template pTemplate="header">
                            <tr><th>Motif</th><th>Du</th><th>Au</th><th>Jours</th><th>Statut</th><th></th></tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-p>
                            <tr>
                                <td>{{ motifLabel(p.motif) }}
                                    <div class="text-xs text-color-secondary" *ngIf="p.lienParente">{{ lienLabel(p.lienParente) }}</div>
                                    <div class="text-xs text-color-secondary" *ngIf="p.precisionMotif">{{ p.precisionMotif }}</div></td>
                                <td>{{ p.dateDebut | date: 'dd/MM/yyyy' }}</td>
                                <td>{{ p.dateFin | date: 'dd/MM/yyyy' }}</td>
                                <td class="font-medium">{{ p.nbJours }} j</td>
                                <td>
                                    <p-tag [value]="statut(p.statut).label" [severity]="statut(p.statut).severity" />
                                    <div class="text-xs text-red-500" *ngIf="p.motifRejet">{{ p.motifRejet }}</div>
                                </td>
                                <td>
                                    <button pButton icon="pi pi-print" class="p-button-text p-button-sm"
                                            *ngIf="p.statut === 'VALIDEE_DRH'" pTooltip="Imprimer le formulaire"
                                            (click)="imprimer(p)"></button>
                                </td>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="emptymessage">
                            <tr><td colspan="6" class="text-center text-color-secondary">Aucune permission pour {{ exercice }}</td></tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>
        </div>
    `
})
export class MesPermissionsComponent implements OnInit {
    private drhService = inject(DrhService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private destroyRef = inject(DestroyRef);

    quota = signal<QuotaPermission | null>(null);
    permissions = signal<PermissionSociale[]>([]);
    saving = signal(false);

    exercice = new Date().getFullYear();
    exercices = [new Date().getFullYear(), new Date().getFullYear() + 1];

    motifs = MOTIFS_PERMISSION;
    liens = LIENS_PARENTE;
    motif: string | null = null;
    lienParente: string | null = null;
    precisionMotif = '';
    dateDebut: Date | null = null;
    dateFin: Date | null = null;
    nbJours = signal(0);

    statut = statutConge;
    motifLabel = libelleMotif;
    lienLabel = libelleLienParente;

    /** Demande en instance (soumise ou acceptée) : masque le formulaire. */
    enInstance = computed(() =>
        this.permissions().find((p) => p.statut === 'SOUMISE' || p.statut === 'ACCEPTEE_RESP') || null
    );

    ngOnInit(): void {
        this.charger();
    }

    charger(): void {
        this.drhService.quotaPermission$(this.exercice).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.quota.set((r.data as any)?.quota || null)
        });
        this.drhService.mesPermissions$(this.exercice).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.permissions.set((r.data as any)?.permissions || [])
        });
    }

    calculerJours(): void {
        if (!this.dateDebut || !this.dateFin || this.dateFin < this.dateDebut) {
            this.nbJours.set(0);
            return;
        }
        let n = 0;
        const d = new Date(this.dateDebut);
        while (d <= this.dateFin) {
            if (d.getDay() !== 0) n++;
            d.setDate(d.getDate() + 1);
        }
        this.nbJours.set(n);
    }

    private toIso(d: Date): string {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    soumettre(): void {
        if (!this.motif || !this.dateDebut || !this.dateFin) return;
        this.saving.set(true);
        this.drhService.creerPermission$({
            motif: this.motif,
            lienParente: this.lienParente || undefined,
            precisionMotif: this.precisionMotif || undefined,
            dateDebut: this.toIso(this.dateDebut),
            dateFin: this.toIso(this.dateFin)
        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => {
                this.saving.set(false);
                this.motif = this.lienParente = null;
                this.precisionMotif = '';
                this.dateDebut = this.dateFin = null;
                this.nbJours.set(0);
                this.messageService.add({ severity: 'success', summary: 'Soumise', detail: 'Permission soumise à votre responsable' });
                this.charger();
            },
            error: (e) => {
                this.saving.set(false);
                this.erreur(e);
            }
        });
    }

    annuler(p: PermissionSociale): void {
        this.confirmationService.confirm({
            header: 'Annuler ma demande',
            message: 'Êtes-vous sûr de vouloir annuler cette demande de permission ?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui, annuler',
            rejectLabel: 'Non',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.drhService.annulerPermission$(p.permissionId, 'Annulée par l’agent avant traitement')
                    .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                        next: () => {
                            this.messageService.add({ severity: 'success', summary: 'Annulée', detail: 'Demande annulée' });
                            this.charger();
                        },
                        error: (e) => this.erreur(e)
                    });
            }
        });
    }

    imprimer(p: PermissionSociale): void {
        imprimerPermission(p);
    }

    private erreur(e: any): void {
        this.messageService.add({
            severity: 'error', summary: 'Erreur',
            detail: e.error?.data?.error || e.error?.message || 'Opération impossible'
        });
    }
}
