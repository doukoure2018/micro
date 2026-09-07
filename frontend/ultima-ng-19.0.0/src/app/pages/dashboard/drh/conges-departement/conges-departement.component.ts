import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
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
import { DrhService, DemandeConge, PermissionSociale, PrevisionConge, ContexteDrh } from '@/service/drh.service';
import { statutConge, libelleMotif, libelleLienParente } from '../conge-utils';
import { ApercuPrevisionsComponent } from '../apercu-previsions/apercu-previsions.component';

/**
 * Congés du département (responsable) : traiter les demandes (accepter/rejeter),
 * interrompre ou annuler un congé validé avec recrédit des jours non consommés.
 */
@Component({
    selector: 'app-conges-departement',
    standalone: true,
    imports: [CommonModule, FormsModule, ApercuPrevisionsComponent, ButtonModule, CalendarModule, DialogModule, DropdownModule, SelectButtonModule, TableModule, TagModule, ToastModule, TextareaModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast />
        <div class="card">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h4 class="m-0">Congés — {{ contexte()?.departementLibelle }}</h4>
                    <span class="text-sm text-color-secondary">Demandes de congé de vos agents : accepter, rejeter, interrompre ou annuler.</span>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <p-selectButton [options]="vuesOptions" [(ngModel)]="vueActive" optionLabel="label" optionValue="value" />
                    <label class="font-medium ml-2">Exercice</label>
                    <p-dropdown [options]="exercices" [(ngModel)]="exercice" (onChange)="charger()" />
                </div>
            </div>

            <!-- Vues calendrier des congés du département (mêmes couleurs d'étape) -->
            <app-apercu-previsions *ngIf="vueActive === 'calendrier' || vueActive === 'annuel'"
                                   [previsions]="congesPourApercu()" [exercice]="exercice"
                                   [vue]="vueActive === 'annuel' ? 'annuel' : 'calendrier'" />

            <!-- Permissions sociales du département -->
            <p-table *ngIf="vueActive === 'permissions'" [value]="permissions()" responsiveLayout="scroll" [rowHover]="true">
                <ng-template pTemplate="header">
                    <tr><th>Agent</th><th>Motif</th><th>Du</th><th>Au</th><th>Jours</th><th>Statut</th><th>Actions</th></tr>
                </ng-template>
                <ng-template pTemplate="body" let-p>
                    <tr>
                        <td>{{ p.nomComplet }}<div class="text-xs text-color-secondary" *ngIf="p.matricule">Mat. {{ p.matricule }}</div></td>
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
                            <div class="flex gap-1" *ngIf="p.statut === 'SOUMISE'">
                                <button pButton icon="pi pi-check" class="p-button-sm" severity="success"
                                        pTooltip="Accepter" (click)="accepterPermission(p)"></button>
                                <button pButton icon="pi pi-times" class="p-button-sm" severity="danger"
                                        pTooltip="Rejeter" (click)="ouvrirMotifPermission(p)"></button>
                            </div>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr><td colspan="7" class="text-center text-color-secondary">Aucune permission pour {{ exercice }}</td></tr>
                </ng-template>
            </p-table>

            <p-table *ngIf="vueActive === 'demandes'" [value]="demandes()" responsiveLayout="scroll" [rowHover]="true">
                <ng-template pTemplate="header">
                    <tr><th>Agent</th><th>Du</th><th>Au</th><th>Jours</th><th>Solde après</th><th>Statut</th><th>Actions</th></tr>
                </ng-template>
                <ng-template pTemplate="body" let-d>
                    <tr>
                        <td>{{ d.nomComplet }}<div class="text-xs text-color-secondary" *ngIf="d.matricule">Mat. {{ d.matricule }}</div></td>
                        <td>{{ d.dateDebut | date: 'dd/MM/yyyy' }}</td>
                        <td>{{ d.dateFin | date: 'dd/MM/yyyy' }}</td>
                        <td class="font-medium">{{ d.nbJours }} j</td>
                        <td>{{ d.soldeApres }} j</td>
                        <td>
                            <p-tag [value]="statut(d.statut).label" [severity]="statut(d.statut).severity" />
                            <div class="text-xs" *ngIf="d.statut === 'INTERROMPUE'">
                                Reprise le {{ d.dateReprise | date: 'dd/MM/yyyy' }} — {{ d.joursRecredites }} j recrédités
                            </div>
                        </td>
                        <td>
                            <div class="flex gap-1">
                                <ng-container *ngIf="d.statut === 'SOUMISE'">
                                    <button pButton icon="pi pi-check" class="p-button-sm" severity="success"
                                            pTooltip="Accepter" (click)="accepter(d)"></button>
                                    <button pButton icon="pi pi-times" class="p-button-sm" severity="danger"
                                            pTooltip="Rejeter" (click)="ouvrirMotif(d, 'rejet')"></button>
                                </ng-container>
                                <ng-container *ngIf="d.statut === 'VALIDEE_DRH'">
                                    <button pButton icon="pi pi-pause" class="p-button-sm p-button-outlined" severity="warn"
                                            pTooltip="Interrompre le congé" (click)="ouvrirInterruption(d)"></button>
                                    <button pButton icon="pi pi-ban" class="p-button-sm p-button-outlined" severity="danger"
                                            pTooltip="Annuler le congé" (click)="ouvrirMotif(d, 'annulation')"></button>
                                </ng-container>
                            </div>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr><td colspan="7" class="text-center text-color-secondary">Aucune demande de congé pour {{ exercice }}</td></tr>
                </ng-template>
            </p-table>
        </div>

        <p-dialog [header]="modeMotif === 'rejet' ? 'Rejeter la demande' : 'Annuler le congé'"
                  [(visible)]="motifVisible" [modal]="true" [style]="{ width: '480px' }">
            <p class="mb-2">Motif (transmis à l'agent{{ modeMotif === 'annulation' ? ', jours recrédités automatiquement' : '' }}) :</p>
            <textarea pTextarea [(ngModel)]="motif" rows="3" class="w-full"></textarea>
            <ng-template pTemplate="footer">
                <button pButton label="Fermer" class="p-button-text" (click)="motifVisible = false"></button>
                <button pButton [label]="modeMotif === 'rejet' ? 'Rejeter' : 'Annuler le congé'" severity="danger"
                        [disabled]="!motif.trim()" (click)="confirmerMotif()"></button>
            </ng-template>
        </p-dialog>

        <p-dialog header="Interrompre le congé" [(visible)]="interruptionVisible" [modal]="true" [style]="{ width: '520px' }">
            <p class="text-sm text-color-secondary mb-3" *ngIf="cible">
                Congé de {{ cible.nomComplet }} du {{ cible.dateDebut | date: 'dd/MM/yyyy' }} au
                {{ cible.dateFin | date: 'dd/MM/yyyy' }} ({{ cible.nbJours }} j).
                Les jours ouvrables non consommés seront recrédités et le calendrier recalculé.
            </p>
            <div class="flex flex-col gap-3">
                <div><label class="block mb-1 font-medium">Date de reprise du travail *</label>
                    <p-calendar [(ngModel)]="dateReprise" dateFormat="dd/mm/yy" [showIcon]="true" appendTo="body" /></div>
                <div><label class="block mb-1 font-medium">Motif *</label>
                    <textarea pTextarea [(ngModel)]="motif" rows="2" class="w-full"></textarea></div>
            </div>
            <ng-template pTemplate="footer">
                <button pButton label="Fermer" class="p-button-text" (click)="interruptionVisible = false"></button>
                <button pButton label="Interrompre" severity="warn"
                        [disabled]="!dateReprise || !motif.trim()" (click)="interrompre()"></button>
            </ng-template>
        </p-dialog>
    `
})
export class CongesDepartementComponent implements OnInit {
    private drhService = inject(DrhService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

    contexte = signal<ContexteDrh | null>(null);
    demandes = signal<DemandeConge[]>([]);
    permissions = signal<PermissionSociale[]>([]);
    vueActive: 'demandes' | 'permissions' | 'calendrier' | 'annuel' = 'demandes';
    vuesOptions = [
        { label: 'Demandes', value: 'demandes' },
        { label: 'Permissions sociales', value: 'permissions' },
        { label: 'Calendrier du personnel', value: 'calendrier' },
        { label: 'Vue annuelle', value: 'annuel' }
    ];
    motifLabel = libelleMotif;
    lienLabel = libelleLienParente;
    exercice = new Date().getFullYear();
    exercices = [new Date().getFullYear(), new Date().getFullYear() + 1];

    motifVisible = false;
    interruptionVisible = false;
    modeMotif: 'rejet' | 'annulation' = 'rejet';
    motif = '';
    dateReprise: Date | null = null;
    cible: DemandeConge | null = null;
    ciblePermission: PermissionSociale | null = null;

    statut = statutConge;

    ngOnInit(): void {
        this.drhService.contexte$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.contexte.set((r.data as any)?.contexte || null)
        });
        this.charger();
    }

    charger(): void {
        this.drhService.congesDepartement$(this.exercice).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.demandes.set((r.data as any)?.demandes || []),
            error: (e) => this.erreur(e)
        });
        this.drhService.permissionsDepartement$(this.exercice).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.permissions.set((r.data as any)?.permissions || []),
            error: () => {}
        });
    }

    /**
     * Congés du département projetés au format des vues consolidées : une ligne
     * par agent, ses congés actifs en tranches (l'interrompu est tronqué à la
     * veille de la reprise). Couleurs : orange = soumis, jaune = accepté resp,
     * vert = validé DRH.
     */
    congesPourApercu(): PrevisionConge[] {
        const parAgent = new Map<number, PrevisionConge>();
        const rangStatut: { [k: string]: number } = { SOUMISE: 0, ACCEPTEE_RESP: 1, VALIDEE_DRH: 2, INTERROMPUE: 2 };
        for (const d of this.demandes()) {
            if (!(d.statut in rangStatut)) continue;
            let fin = d.dateFin;
            if (d.statut === 'INTERROMPUE') {
                if (!d.dateReprise || d.dateReprise <= d.dateDebut) continue;
                const veille = new Date(d.dateReprise + 'T00:00:00');
                veille.setDate(veille.getDate() - 1);
                fin = `${veille.getFullYear()}-${String(veille.getMonth() + 1).padStart(2, '0')}-${String(veille.getDate()).padStart(2, '0')}`;
            }
            let ligne = parAgent.get(d.userId);
            if (!ligne) {
                ligne = {
                    previsionId: d.userId, userId: d.userId, nomComplet: d.nomComplet,
                    matricule: d.matricule, departementId: d.departementId,
                    departementCode: d.departementCode, exercice: d.exercice,
                    statut: d.statut === 'INTERROMPUE' ? 'VALIDEE_DRH' : d.statut,
                    totalJours: 0, periodes: []
                } as PrevisionConge;
                parAgent.set(d.userId, ligne);
            }
            // La couleur de la ligne suit le statut le plus avancé de l'agent
            const statutLigne = ligne.statut in rangStatut ? ligne.statut : 'SOUMISE';
            const statutDemande = d.statut === 'INTERROMPUE' ? 'VALIDEE_DRH' : d.statut;
            if (rangStatut[statutDemande] > rangStatut[statutLigne]) {
                ligne.statut = statutDemande;
            }
            ligne.periodes.push({ dateDebut: d.dateDebut, dateFin: fin, nbJours: d.nbJours });
            ligne.totalJours += d.statut === 'INTERROMPUE' ? d.nbJours - (d.joursRecredites || 0) : d.nbJours;
        }
        return Array.from(parAgent.values());
    }

    accepterPermission(p: PermissionSociale): void {
        this.drhService.accepterPermission$(p.permissionId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => this.ok('Permission acceptée — transmise à la DRH'),
            error: (e) => this.erreur(e)
        });
    }

    ouvrirMotifPermission(p: PermissionSociale): void {
        this.ciblePermission = p;
        this.cible = null;
        this.modeMotif = 'rejet';
        this.motif = '';
        this.motifVisible = true;
    }

    accepter(d: DemandeConge): void {
        this.drhService.accepterConge$(d.demandeId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => this.ok('Demande acceptée — transmise à la DRH'),
            error: (e) => this.erreur(e)
        });
    }

    ouvrirMotif(d: DemandeConge, mode: 'rejet' | 'annulation'): void {
        this.cible = d;
        this.ciblePermission = null;
        this.modeMotif = mode;
        this.motif = '';
        this.motifVisible = true;
    }

    confirmerMotif(): void {
        if (!this.cible && !this.ciblePermission) return;
        const obs = this.ciblePermission
            ? this.drhService.rejeterPermission$(this.ciblePermission.permissionId, this.motif.trim())
            : this.modeMotif === 'rejet'
              ? this.drhService.rejeterConge$(this.cible!.demandeId, this.motif.trim())
              : this.drhService.annulerConge$(this.cible!.demandeId, this.motif.trim());
        obs.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => {
                this.motifVisible = false;
                this.ok(this.modeMotif === 'rejet' ? 'Demande rejetée' : 'Congé annulé — jours recrédités');
            },
            error: (e) => this.erreur(e)
        });
    }

    ouvrirInterruption(d: DemandeConge): void {
        this.cible = d;
        this.motif = '';
        this.dateReprise = null;
        this.interruptionVisible = true;
    }

    interrompre(): void {
        if (!this.cible || !this.dateReprise) return;
        const iso = `${this.dateReprise.getFullYear()}-${String(this.dateReprise.getMonth() + 1).padStart(2, '0')}-${String(this.dateReprise.getDate()).padStart(2, '0')}`;
        this.drhService.interrompreConge$(this.cible.demandeId, { dateReprise: iso, motif: this.motif.trim() })
            .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                next: () => {
                    this.interruptionVisible = false;
                    this.ok('Congé interrompu — jours non consommés recrédités');
                },
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
