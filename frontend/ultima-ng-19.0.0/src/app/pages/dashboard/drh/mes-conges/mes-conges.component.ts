import { Component, DestroyRef, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DrhService, DemandeConge, SoldeConge, PeriodePrevision } from '@/service/drh.service';
import { statutConge, imprimerDemandeConge } from '../conge-utils';
import { SoldesAgentComponent } from '../soldes-agent/soldes-agent.component';

/**
 * « Mes demandes de congé » : solde, dépôt d'une demande adossée à une
 * tranche de la prévision validée, suivi du circuit et impression du formulaire.
 */
@Component({
    selector: 'app-mes-conges',
    standalone: true,
    imports: [CommonModule, FormsModule, SoldesAgentComponent, ButtonModule, CalendarModule, ConfirmDialogModule, DialogModule, DropdownModule, TableModule, TagModule, ToastModule, TextareaModule, TooltipModule],
    providers: [MessageService, ConfirmationService],
    template: `
        <p-toast />
        <p-confirmDialog />
        <app-soldes-agent [exercice]="exercice" />
        <div class="grid">
            <div class="col-12 lg:col-4">
                <div class="card" *ngIf="solde() as s">
                    <h5 class="m-0 mb-3">Mon solde {{ exercice }}</h5>
                    <div class="flex justify-between mb-2"><span>Droit annuel</span><b>{{ s.droit }} j</b></div>
                    <div class="flex justify-between mb-2"><span>Déjà pris</span><b>{{ s.pris }} j</b></div>
                    <div class="flex justify-between text-lg"><span>Solde restant</span>
                        <b [class.text-red-500]="s.restant === 0" [class.text-green-600]="s.restant > 0">{{ s.restant }} j</b></div>
                    <div class="mt-3 p-2 border-round text-sm" style="background:var(--surface-100)"
                         *ngIf="!s.previsionValidee">
                        <i class="pi pi-info-circle mr-1"></i>
                        Votre prévision {{ exercice }} n'est pas encore validée par la DRH — la demande de congé
                        s'appuie sur la prévision.
                    </div>
                </div>

                <!-- Demande en instance : le formulaire est masqué jusqu'à son traitement -->
                <div class="card" *ngIf="enInstance() as inst">
                    <h5 class="m-0 mb-3"><i class="pi pi-hourglass mr-1"></i> Demande en instance</h5>
                    <div class="flex flex-col gap-2">
                        <p-tag [value]="statut(inst.statut).label" [severity]="statut(inst.statut).severity" />
                        <div><b>Du :</b> {{ inst.dateDebut | date: 'dd/MM/yyyy' }} <b>au</b> {{ inst.dateFin | date: 'dd/MM/yyyy' }} inclus</div>
                        <div><b>Durée :</b> {{ inst.nbJours }} jours ouvrables — solde après : {{ inst.soldeApres }} j</div>
                        <div class="text-sm text-color-secondary" *ngIf="inst.traiteeRespNom">
                            Acceptée par {{ inst.traiteeRespNom }} le {{ inst.traiteeRespLe | date: 'dd/MM/yyyy HH:mm' }}
                        </div>
                        <div class="text-sm text-color-secondary">
                            Le formulaire sera de nouveau disponible une fois cette demande traitée.
                        </div>
                        <button pButton label="Annuler ma demande" icon="pi pi-times" severity="danger"
                                class="p-button-outlined mt-2" *ngIf="inst.statut === 'SOUMISE'"
                                (click)="annuler(inst)"></button>
                    </div>
                </div>

                <div class="card" *ngIf="solde()?.previsionValidee && !enInstance()">
                    <h5 class="m-0 mb-3">Nouvelle demande de congé</h5>
                    <div class="flex flex-col gap-3">
                        <div>
                            <label class="block mb-1 font-medium">Tranche prévue *</label>
                            <p-dropdown [options]="tranchesOptions()" optionLabel="label" [(ngModel)]="trancheChoisie"
                                        placeholder="Choisir une tranche validée" class="w-full" appendTo="body"
                                        (onChange)="preRemplir()" />
                            <small class="text-color-secondary" *ngIf="tranchesOptions().length === 0">
                                Toutes vos tranches prévues ont déjà une demande en cours.
                            </small>
                        </div>
                        <div class="grid">
                            <div class="col-6"><label class="block mb-1">Du *</label>
                                <p-calendar [(ngModel)]="dateDebut" dateFormat="dd/mm/yy" [showIcon]="true" appendTo="body"
                                            (onSelect)="calculerJours()" /></div>
                            <div class="col-6"><label class="block mb-1">Au *</label>
                                <p-calendar [(ngModel)]="dateFin" dateFormat="dd/mm/yy" [showIcon]="true" appendTo="body"
                                            (onSelect)="calculerJours()" /></div>
                        </div>
                        <div class="font-medium" *ngIf="nbJours() > 0">
                            {{ nbJours() }} jours ouvrables (samedi compris, dimanches exclus)
                        </div>
                        <div><label class="block mb-1">Commentaire</label>
                            <textarea pTextarea [(ngModel)]="commentaire" rows="2" class="w-full"></textarea></div>
                        <button pButton label="Soumettre à mon responsable" icon="pi pi-send" severity="success"
                                [loading]="saving()" [disabled]="!trancheChoisie || !dateDebut || !dateFin"
                                (click)="soumettre()"></button>
                    </div>
                </div>
            </div>

            <div class="col-12 lg:col-8">
                <div class="card">
                    <div class="flex items-center justify-between mb-3">
                        <h5 class="m-0">Mes demandes de congé</h5>
                        <p-dropdown [options]="exercices" [(ngModel)]="exercice" (onChange)="charger()" />
                    </div>
                    <p-table [value]="demandes()" responsiveLayout="scroll" [rowHover]="true">
                        <ng-template pTemplate="header">
                            <tr><th>Du</th><th>Au</th><th>Jours</th><th>Solde après</th><th>Statut</th><th></th></tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-d>
                            <tr>
                                <td>{{ d.dateDebut | date: 'dd/MM/yyyy' }}</td>
                                <td>{{ d.dateFin | date: 'dd/MM/yyyy' }}</td>
                                <td class="font-medium">{{ d.nbJours }} j</td>
                                <td>{{ d.soldeApres }} j</td>
                                <td>
                                    <p-tag [value]="statut(d.statut).label" [severity]="statut(d.statut).severity" />
                                    <div class="text-xs text-red-500" *ngIf="d.motifRejet">{{ d.motifRejet }}</div>
                                    <div class="text-xs" *ngIf="d.statut === 'INTERROMPUE'">
                                        Reprise le {{ d.dateReprise | date: 'dd/MM/yyyy' }} — {{ d.joursRecredites }} j recrédités
                                    </div>
                                </td>
                                <td>
                                    <div class="flex gap-1">
                                        <button pButton icon="pi pi-print" class="p-button-text p-button-sm"
                                                *ngIf="d.statut === 'VALIDEE_DRH'" pTooltip="Imprimer le formulaire"
                                                (click)="imprimer(d)"></button>
                                        <button pButton icon="pi pi-times" class="p-button-text p-button-danger p-button-sm"
                                                *ngIf="d.statut === 'SOUMISE'" pTooltip="Annuler ma demande"
                                                (click)="annuler(d)"></button>
                                    </div>
                                </td>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="emptymessage">
                            <tr><td colspan="6" class="text-center text-color-secondary">Aucune demande pour {{ exercice }}</td></tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>
        </div>
    `
})
export class MesCongesComponent implements OnInit {
    private drhService = inject(DrhService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private destroyRef = inject(DestroyRef);

    solde = signal<SoldeConge | null>(null);
    demandes = signal<DemandeConge[]>([]);
    saving = signal(false);

    exercice = new Date().getFullYear();
    exercices = [new Date().getFullYear(), new Date().getFullYear() + 1];

    trancheChoisie: { label: string; periode: PeriodePrevision } | null = null;
    dateDebut: Date | null = null;
    dateFin: Date | null = null;
    commentaire = '';
    nbJours = signal(0);

    /** Demande en instance (soumise ou acceptée) : masque le formulaire de saisie. */
    enInstance = computed(() =>
        this.demandes().find((d) => d.statut === 'SOUMISE' || d.statut === 'ACCEPTEE_RESP') || null
    );

    tranchesOptions = computed(() =>
        (this.solde()?.tranchesDisponibles || []).map((p) => ({
            label: `${this.fr(p.dateDebut)} au ${this.fr(p.dateFin)} (${p.nbJours} j)`,
            periode: p
        }))
    );

    ngOnInit(): void {
        this.charger();
    }

    charger(): void {
        this.drhService.soldeConge$(this.exercice).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.solde.set((r.data as any)?.solde || null)
        });
        this.drhService.mesConges$(this.exercice).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.demandes.set((r.data as any)?.demandes || [])
        });
    }

    statut = statutConge;

    private fr(iso: string): string {
        const [a, m, j] = iso.split('-');
        return `${j}/${m}/${a}`;
    }

    preRemplir(): void {
        if (!this.trancheChoisie) return;
        this.dateDebut = new Date(this.trancheChoisie.periode.dateDebut + 'T00:00:00');
        this.dateFin = new Date(this.trancheChoisie.periode.dateFin + 'T00:00:00');
        this.calculerJours();
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
        this.nbJours.set(n); // approximation client (fériés déduits par le serveur)
    }

    private toIso(d: Date): string {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    soumettre(): void {
        if (!this.trancheChoisie || !this.dateDebut || !this.dateFin) return;
        this.saving.set(true);
        this.drhService.creerConge$({
            periodeId: this.trancheChoisie.periode.periodeId!,
            dateDebut: this.toIso(this.dateDebut),
            dateFin: this.toIso(this.dateFin),
            commentaire: this.commentaire || undefined
        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => {
                this.saving.set(false);
                this.trancheChoisie = null;
                this.dateDebut = this.dateFin = null;
                this.commentaire = '';
                this.nbJours.set(0);
                this.messageService.add({ severity: 'success', summary: 'Soumise', detail: 'Demande de congé soumise à votre responsable' });
                this.charger();
            },
            error: (e) => {
                this.saving.set(false);
                this.erreur(e);
            }
        });
    }

    imprimer(d: DemandeConge): void {
        imprimerDemandeConge(d, this.solde()?.droit || 30);
    }

    annuler(d: DemandeConge): void {
        this.confirmationService.confirm({
            header: 'Annuler ma demande',
            message: `Annuler la demande de congé du ${this.fr(d.dateDebut)} au ${this.fr(d.dateFin)} ?`,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui, annuler',
            rejectLabel: 'Non',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.drhService.annulerConge$(d.demandeId, 'Annulée par l’agent avant traitement')
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

    private erreur(e: any): void {
        this.messageService.add({
            severity: 'error', summary: 'Erreur',
            detail: e.error?.data?.error || e.error?.message || 'Opération impossible'
        });
    }
}
