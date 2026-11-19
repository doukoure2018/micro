import { IResponse } from '@/interface/response';
import { libelleMotifAnnulation } from '@/interface/etat-dossier';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';

/**
 * File « Annulations à décider » (V216) : les demandes d'annulation dont le connecté est le
 * tenant — le DA pour son agence, le DR pour sa délégation, la DE et la DG pour le réseau.
 * Le serveur choisit la file d'après le compte connecté ; le composant ne fait que l'afficher,
 * avec les deux décisions possibles. Posé tel quel dans les pages DR, DE et DG.
 */
@Component({
    selector: 'app-annulations-a-decider',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, TableModule, ButtonModule, DialogModule, TagModule, BadgeModule, TextareaModule, TooltipModule],
    template: `
        <div *ngIf="demandes().length" class="card mb-4 border-l-4 border-red-500">
            <div class="p-4">
                <div class="flex flex-wrap gap-3 align-items-center justify-content-between mb-4">
                    <h3 class="text-xl font-semibold m-0 text-900">
                        <i class="pi pi-ban mr-2 text-red-600"></i>
                        Annulations de dossier &agrave; d&eacute;cider
                        <p-badge [value]="demandes().length.toString()" severity="danger" class="ml-2"></p-badge>
                    </h3>
                    <span class="text-600 text-sm">{{ sousTitre }}</span>
                </div>
                <p-table [value]="demandes()" [paginator]="demandes().length > 10" [rows]="10" responsiveLayout="scroll" styleClass="p-datatable-sm">
                    <ng-template pTemplate="header">
                        <tr>
                            <th>Client</th>
                            <th>Point de service</th>
                            <th class="text-right">Montant</th>
                            <th>&Eacute;tape atteinte</th>
                            <th>Motif</th>
                            <th>Demand&eacute;e par</th>
                            <th>Le</th>
                            <th></th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-d>
                        <tr>
                            <td>
                                <a [routerLink]="['/dashboards/credit/individuel/attente/detail', d.demandeIndividuelId]" class="font-semibold text-primary">{{ d.prenom }} {{ d.nom }}</a>
                                <div class="text-xs text-500">{{ d.numeroMembre }}</div>
                            </td>
                            <td class="text-sm">{{ d.pointventeLibele || d.agenceLibele || '—' }}<div class="text-xs text-500" *ngIf="d.delegationLibele">{{ d.delegationLibele }}</div></td>
                            <td class="text-right font-semibold">{{ d.montantDemande | currency: 'GNF ' : 'symbol' : '1.0-0' }}</td>
                            <td><p-tag [value]="d.etatAvantAnnulation || '—'" severity="secondary"></p-tag></td>
                            <td>
                                <div class="font-medium">{{ libelleMotif(d.annulationMotifCode) }}</div>
                                <div class="text-xs text-600">{{ d.annulationMotif }}</div>
                            </td>
                            <td class="text-sm">{{ d.annulationDemandeePar }}</td>
                            <td class="text-sm">{{ d.dateDemandeAnnulation | date: 'dd/MM/yyyy' }}</td>
                            <td class="whitespace-nowrap">
                                <button pButton type="button" icon="pi pi-check" label="Valider" class="p-button-sm p-button-danger mr-2"
                                    pTooltip="Le dossier sort d&eacute;finitivement du circuit" (click)="ouvrirValidation(d)"></button>
                                <button pButton type="button" icon="pi pi-undo" label="Refuser" class="p-button-sm p-button-outlined"
                                    pTooltip="Le dossier reprend son cours" (click)="ouvrirRefus(d)"></button>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </div>

        <p-dialog header="Valider l'annulation du dossier" [(visible)]="afficherValidation" [modal]="true" [style]="{ width: '520px' }">
            <div class="mb-3 p-3 bg-red-50 border-round" *ngIf="choisie">
                <p class="font-semibold m-0">{{ choisie.prenom }} {{ choisie.nom }}</p>
                <p class="text-600 m-0">{{ choisie.montantDemande | currency: 'GNF ' : 'symbol' : '1.0-0' }}</p>
                <p class="text-600 m-0 mt-2 text-sm">Motif invoqu&eacute; : <strong>{{ libelleMotif(choisie.annulationMotifCode) }}</strong> &mdash; {{ choisie.annulationMotif }}</p>
            </div>
            <p class="m-0 text-sm">Le dossier sortira d&eacute;finitivement du circuit et rejoindra les dossiers cl&ocirc;tur&eacute;s. Le membre pourra d&eacute;poser une nouvelle demande.</p>
            <ng-template #footer>
                <div class="flex justify-end gap-3">
                    <button pButton type="button" label="Retour" class="p-button-secondary p-button-outlined" (click)="afficherValidation = false"></button>
                    <button pButton type="button" label="Confirmer l'annulation" icon="pi pi-ban" class="p-button-danger" [disabled]="enCours" (click)="valider()"></button>
                </div>
            </ng-template>
        </p-dialog>

        <p-dialog header="Refuser l'annulation" [(visible)]="afficherRefus" [modal]="true" [style]="{ width: '520px' }">
            <div class="mb-3 p-3 bg-orange-50 border-round" *ngIf="choisie">
                <p class="font-semibold m-0">{{ choisie.prenom }} {{ choisie.nom }}</p>
                <p class="text-600 m-0 text-sm">Le dossier reprendra son cours &agrave; l'&eacute;tape {{ choisie.etatAvantAnnulation }}.</p>
            </div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Motif du refus <span class="text-red-500">*</span></label>
            <textarea pTextarea [(ngModel)]="motifRefus" rows="3" class="w-full" [autoResize]="true"
                placeholder="Ex : le client a confirm&eacute; par t&eacute;l&eacute;phone qu'il maintient sa demande"></textarea>
            <small class="text-500">Minimum 10 caract&egrave;res.</small>
            <ng-template #footer>
                <div class="flex justify-end gap-3">
                    <button pButton type="button" label="Retour" class="p-button-secondary p-button-outlined" (click)="afficherRefus = false"></button>
                    <button pButton type="button" label="Refuser l'annulation" icon="pi pi-undo" class="p-button-warning" [disabled]="enCours || motifRefus.trim().length < 10" (click)="refuser()"></button>
                </div>
            </ng-template>
        </p-dialog>
    `
})
export class AnnulationsADeciderComponent {
    /** Phrase sous le titre, adaptée à la page qui accueille le composant. */
    @Input() sousTitre = "Votre décision sort le dossier du circuit, ou le remet en instruction là où il était.";

    private readonly userService = inject(UserService);
    private readonly messageService = inject(MessageService);
    private readonly destroyRef = inject(DestroyRef);

    readonly demandes = signal<any[]>([]);
    choisie: any = null;
    afficherValidation = false;
    afficherRefus = false;
    motifRefus = '';
    enCours = false;

    constructor() {
        this.charger();
    }

    libelleMotif(code: string): string {
        return libelleMotifAnnulation(code);
    }

    charger(): void {
        this.userService
            .getAnnulationsADecider$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (reponse: IResponse) => this.demandes.set(reponse.data?.workflowDemandes || []),
                error: () => this.demandes.set([])
            });
    }

    ouvrirValidation(d: any): void {
        this.choisie = d;
        this.afficherValidation = true;
    }

    ouvrirRefus(d: any): void {
        this.choisie = d;
        this.motifRefus = '';
        this.afficherRefus = true;
    }

    valider(): void {
        if (!this.choisie) return;
        this.enCours = true;
        this.userService
            .validerAnnulationDossier$(this.choisie.demandeIndividuelId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.enCours = false;
                    this.afficherValidation = false;
                    this.messageService.add({ severity: 'success', summary: 'Dossier annulé', detail: 'Le dossier sort du circuit et rejoint les dossiers clôturés', life: 5000 });
                    this.charger();
                },
                error: (err: any) => {
                    this.enCours = false;
                    this.messageService.add({ severity: 'error', summary: 'Annulation refusée par le serveur', detail: err || '', life: 7000 });
                }
            });
    }

    refuser(): void {
        if (!this.choisie || this.motifRefus.trim().length < 10) return;
        this.enCours = true;
        this.userService
            .refuserAnnulationDossier$(this.choisie.demandeIndividuelId, this.motifRefus.trim())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.enCours = false;
                    this.afficherRefus = false;
                    this.messageService.add({ severity: 'info', summary: 'Annulation refusée', detail: "Le dossier reprend son cours à l'étape où il était", life: 5000 });
                    this.charger();
                },
                error: (err: any) => {
                    this.enCours = false;
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Erreur lors du refus', life: 7000 });
                }
            });
    }
}
