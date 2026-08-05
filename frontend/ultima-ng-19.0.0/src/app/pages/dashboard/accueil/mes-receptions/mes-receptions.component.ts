import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-mes-receptions',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, TagModule, ToastModule, TooltipModule, DialogModule, RouterLink],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>
        <div class="card">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold m-0">Mes demandes réceptionnées</h2>
                <button pButton icon="pi pi-refresh" class="p-button-text" (click)="load()" [loading]="state().loading"></button>
            </div>
            <p class="text-sm text-gray-500">
                Suivi des demandes que vous avez saisies et affectées directement à un agent de crédit. En cas d'annulation par le DA (motif affiché), corrigez puis rediligentez : la demande retourne à l'agent affecté.
            </p>

            <p-table [value]="state().demandes" [loading]="state().loading" [paginator]="state().demandes.length > 10" [rows]="10" responsiveLayout="scroll">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Membre</th>
                        <th>Téléphone</th>
                        <th>Montant</th>
                        <th>Objet</th>
                        <th>Statut</th>
                        <th>Motif / Affectation</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-d>
                    <tr>
                        <td>{{ d.prenom }} {{ d.nom }}<br /><span class="text-xs text-gray-500">{{ d.numeroMembre }}</span></td>
                        <td>{{ d.telephone }}</td>
                        <td>{{ d.montantDemande | currency: 'GNF ' : 'symbol' : '1.0-0' }}</td>
                        <td>{{ d.objectCredit }}</td>
                        <td><p-tag [value]="labelEtat(d.validationState)" [severity]="severiteEtat(d.validationState)"></p-tag></td>
                        <td class="max-w-80">
                            <span *ngIf="d.validationState === 'CORRECTION_ACCUEIL'" class="text-red-600 text-sm">{{ d.motifAnnulationDa }}</span>
                            <span *ngIf="d.validationState === 'AFFECTEE'" class="text-sm">Affectée à {{ d.agentAffecteNom }}</span>
                        </td>
                        <td>{{ d.createdAt | date: 'dd/MM/yyyy HH:mm' }}</td>
                        <td>
                            <div class="flex gap-2">
                                <button
                                    *ngIf="d.validationState === 'CORRECTION_ACCUEIL'"
                                    pButton
                                    icon="pi pi-pencil"
                                    class="p-button-sm p-button-outlined"
                                    pTooltip="Corriger la demande"
                                    [routerLink]="['/dashboards/agent-credit/correction-demande', d.demandeIndividuelId]"
                                ></button>
                                <button
                                    *ngIf="d.validationState === 'CORRECTION_ACCUEIL'"
                                    pButton
                                    icon="pi pi-send"
                                    class="p-button-sm"
                                    severity="warn"
                                    pTooltip="Rediligenter (retour à l'agent de crédit affecté)"
                                    (click)="rediligenter(d)"
                                ></button>
                            </div>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr>
                        <td colspan="8" class="text-center py-6 text-gray-500">Aucune demande réceptionnée en cours.</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
export class MesReceptionsComponent implements OnInit {
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

    state = signal<{ demandes: any[]; loading: boolean }>({ demandes: [], loading: false });

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.state.update((s) => ({ ...s, loading: true }));
        this.userService
            .getMesReceptions$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => this.state.set({ demandes: response.data?.workflowDemandes || [], loading: false }),
                error: (err) => {
                    this.state.update((s) => ({ ...s, loading: false }));
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Chargement impossible', life: 5000 });
                }
            });
    }

    rediligenter(d: any): void {
        this.userService
            .rediligenterAccueil$(d.demandeIndividuelId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Envoyée', detail: "Demande renvoyée au Directeur d'Agence", life: 4000 });
                    this.load();
                },
                error: (err) => this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Échec de la rediligence', life: 5000 })
            });
    }

    labelEtat(etat: string): string {
        switch (etat) {
            case 'EN_ATTENTE_DA':
                return 'En attente DA';
            case 'CORRECTION_ACCUEIL':
                return 'À corriger';
            case 'AFFECTEE':
                return 'Affectée';
            default:
                return etat;
        }
    }

    severiteEtat(etat: string): 'info' | 'danger' | 'success' | 'secondary' {
        switch (etat) {
            case 'EN_ATTENTE_DA':
                return 'info';
            case 'CORRECTION_ACCUEIL':
                return 'danger';
            case 'AFFECTEE':
                return 'success';
            default:
                return 'secondary';
        }
    }
}
