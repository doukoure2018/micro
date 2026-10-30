import { Annulations, SortieDossier } from '@/interface/audit';
import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

type Vue = 'SANS_MOTIF' | 'ANNULEES' | 'EN_ATTENTE';

/**
 * Annulations et sorties de dossiers (Audit, lot 2).
 *
 * Deux façons de sortir un dossier du circuit coexistent. L'annulation en règle, demandée par
 * l'agent et validée par son directeur d'agence, porte un motif, un demandeur et un décideur.
 * Et une voie technique non gardée, qui a fait sortir définitivement des dossiers sans motif ni
 * auteur. L'écran ouvre sur cette seconde liste, parce que c'est elle qui demande une décision.
 */
@Component({
    selector: 'app-audit-annulations',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, SelectButtonModule, TableModule, TagModule, ToastModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>
        <div class="card">
            <div class="flex flex-wrap justify-between items-center gap-3 mb-2">
                <h2 class="text-xl font-bold m-0">Annulations et sorties de dossiers</h2>
                <button pButton icon="pi pi-refresh" class="p-button-text" (click)="charger()" [loading]="loading()"></button>
            </div>

            @if (data(); as d) {
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div class="border rounded p-3" [class.border-red-300]="d.nbSansMotif > 0" [class.bg-red-50]="d.nbSansMotif > 0">
                    <div class="text-xs text-gray-500 uppercase">Sorties sans motif ni auteur</div>
                    <div class="text-xl font-bold" [class.text-red-600]="d.nbSansMotif > 0">{{ d.nbSansMotif | number }}</div>
                    <div class="text-xs text-gray-500">{{ d.montantSansMotif | number: '1.0-0' }} GNF demandés</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Annulations en règle</div>
                    <div class="text-xl font-bold">{{ d.nbAnnulees | number }}</div>
                    <div class="text-xs text-gray-500">motif et décideur enregistrés</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Demandes en attente</div>
                    <div class="text-xl font-bold" [class.text-orange-600]="d.nbEnAttente > 0">{{ d.nbEnAttente | number }}</div>
                    <div class="text-xs text-gray-500">chez le directeur d'agence</div>
                </div>
            </div>

            <div class="flex flex-wrap gap-3 items-center mb-3">
                <p-selectButton [options]="vueOptions" [ngModel]="vue()" (ngModelChange)="vue.set($event)" optionLabel="label" optionValue="value" [allowEmpty]="false"></p-selectButton>
                <button pButton icon="pi pi-file-excel" label="Exporter Excel" class="p-button-success p-button-outlined ml-auto" [loading]="exportEnCours()" (click)="exporter()"></button>
            </div>

            @if (vue() === 'SANS_MOTIF') {
            <p class="text-sm mb-3 p-3 rounded bg-red-50 border border-red-200">
                <i class="pi pi-exclamation-triangle mr-2"></i>
                Ces dossiers sont sortis définitivement du circuit par un point d'entrée technique sans contrôle : <b>ni motif, ni auteur, ni date de décision</b>.
                On ne sait donc ni qui les a sortis ni pourquoi. La voie qui les a produits reste ouverte tant qu'elle n'est pas fermée côté serveur.
            </p>
            }
            @if (vue() === 'ANNULEES') {
            <p class="text-sm text-gray-500 mb-3">Annulations demandées par l'agent de crédit après désistement du client, et validées par son directeur d'agence. Le dossier garde l'étape où il s'est arrêté.</p>
            }
            @if (vue() === 'EN_ATTENTE') {
            <p class="text-sm text-gray-500 mb-3">Demandes d'annulation que le directeur d'agence n'a pas encore tranchées. Le dossier est gelé en attendant.</p>
            }

            <p-table [value]="lignes()" styleClass="p-datatable-sm" [paginator]="lignes().length > 25" [rows]="25" responsiveLayout="scroll">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Dossier</th>
                        <th>Client</th>
                        <th class="text-right">Montant</th>
                        <th>Point de service</th>
                        <th>Étape</th>
                        <th *ngIf="vue() !== 'SANS_MOTIF'">Motif</th>
                        <th *ngIf="vue() !== 'SANS_MOTIF'">Demandée par</th>
                        <th *ngIf="vue() === 'ANNULEES'">Décidée par</th>
                        <th *ngIf="vue() === 'ANNULEES'">Le</th>
                        <th *ngIf="vue() === 'EN_ATTENTE'">Demandée le</th>
                        <th *ngIf="vue() === 'SANS_MOTIF'">Créé le</th>
                        <th>Traçabilité</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-s>
                    <tr>
                        <td class="font-mono">{{ s.demandeId }}</td>
                        <td>{{ s.client }}<div class="text-xs text-gray-500" *ngIf="s.numeroMembre">{{ s.numeroMembre }}</div></td>
                        <td class="text-right">{{ s.montant | number: '1.0-0' }}</td>
                        <td class="text-xs">{{ s.pointVente }}<div class="text-gray-500" *ngIf="s.agence">{{ s.agence }}</div></td>
                        <td class="text-xs">{{ s.etatAvantAnnulation || s.validationState || '—' }}</td>
                        <td *ngIf="vue() !== 'SANS_MOTIF'" class="text-xs">
                            <div *ngIf="s.motifCode" class="font-semibold">{{ s.motifCode }}</div>
                            {{ s.motif }}
                        </td>
                        <td *ngIf="vue() !== 'SANS_MOTIF'" class="text-xs">{{ s.demandeePar || '—' }}</td>
                        <td *ngIf="vue() === 'ANNULEES'" class="text-xs">{{ s.decideePar || '—' }}</td>
                        <td *ngIf="vue() === 'ANNULEES'" class="text-xs">{{ s.dateDecision | date: 'dd/MM/yyyy HH:mm' }}</td>
                        <td *ngIf="vue() === 'EN_ATTENTE'" class="text-xs">{{ s.dateDemande | date: 'dd/MM/yyyy HH:mm' }}</td>
                        <td *ngIf="vue() === 'SANS_MOTIF'" class="text-xs">{{ s.dateCreation | date: 'dd/MM/yyyy' }}</td>
                        <td>
                            <p-tag *ngIf="s.tracee" value="tracée" severity="success"></p-tag>
                            <p-tag *ngIf="!s.tracee" value="sans trace" severity="danger" pTooltip="Ni motif ni auteur enregistrés"></p-tag>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage"><tr><td colspan="11" class="text-center text-gray-500 py-4">Aucun dossier dans cette liste.</td></tr></ng-template>
            </p-table>
            } @else if (!loading()) {
            <p class="text-gray-500">Aucune donnée.</p>
            }
        </div>
    `
})
export class AuditAnnulationsComponent implements OnInit {
    private readonly userService = inject(UserService);
    private readonly messageService = inject(MessageService);
    private readonly destroyRef = inject(DestroyRef);

    data = signal<Annulations | null>(null);
    loading = signal(false);
    exportEnCours = signal(false);
    // La liste sans trace ouvre l'écran : c'est celle qui demande une décision.
    vue = signal<Vue>('SANS_MOTIF');
    vueOptions = [
        { label: 'Sorties sans motif', value: 'SANS_MOTIF' },
        { label: 'Annulations en règle', value: 'ANNULEES' },
        { label: 'En attente', value: 'EN_ATTENTE' }
    ];

    lignes = computed<SortieDossier[]>(() => {
        const d = this.data();
        if (!d) return [];
        return this.vue() === 'SANS_MOTIF' ? d.sansMotif : this.vue() === 'ANNULEES' ? d.annulees : d.enAttente;
    });

    ngOnInit(): void {
        this.charger();
    }

    charger(): void {
        this.loading.set(true);
        this.userService
            .getAuditAnnulations$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.data.set(((r.data as any)?.annulations as Annulations) || null);
                    this.loading.set(false);
                },
                error: (err) => {
                    this.loading.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Sorties de dossiers', detail: err || 'Lecture impossible', life: 6000 });
                }
            });
    }

    exporter(): void {
        this.exportEnCours.set(true);
        this.userService
            .exportAuditAnnulations$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (reponse: HttpResponse<Blob>) => {
                    this.exportEnCours.set(false);
                    const disposition = reponse.headers.get('Content-Disposition') || '';
                    const nom = /filename="?([^";]+)"?/.exec(disposition)?.[1] || 'Audit_sorties_dossiers.xlsx';
                    const url = URL.createObjectURL(reponse.body as Blob);
                    const lien = document.createElement('a');
                    lien.href = url;
                    lien.download = nom;
                    lien.click();
                    URL.revokeObjectURL(url);
                },
                error: () => {
                    this.exportEnCours.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Export', detail: "Échec de l'export", life: 6000 });
                }
            });
    }
}
