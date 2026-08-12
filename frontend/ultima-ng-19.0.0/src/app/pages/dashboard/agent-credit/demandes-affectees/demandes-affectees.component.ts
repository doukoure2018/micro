import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

/**
 * AC — Demandes que le DA m'a affectées (réceptionnées par l'accueil).
 * La prise en charge passe la demande en SELECTION : elle rejoint ensuite
 * le circuit d'instruction habituel (analyse bilan, trésorerie, approbation).
 */
@Component({
    selector: 'app-demandes-affectees',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, ConfirmDialogModule, TagModule, ToastModule, TooltipModule],
    providers: [MessageService, ConfirmationService],
    template: `
        <p-toast></p-toast>
        <p-confirmDialog [style]="{ width: '430px' }"></p-confirmDialog>
        <div class="card">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold m-0">Demandes affectées par mon DA</h2>
                <button pButton icon="pi pi-refresh" class="p-button-text" (click)="load()" [loading]="state().loading"></button>
            </div>
            <p class="text-sm text-gray-500">Demandes réceptionnées à l'accueil et que votre Directeur d'Agence vous a affectées pour analyse. Prenez-les en charge pour démarrer l'instruction.</p>

            <div *ngIf="state().fonctionAccueil" class="p-3 mb-3 rounded border border-blue-300 bg-blue-50 text-blue-800 text-sm flex items-center gap-2">
                <i class="pi pi-info-circle"></i>
                Votre fonction <strong>Accueil</strong> est active en plus de la fonction Crédit : vous saisissez les demandes <strong>et</strong> analysez celles que votre DA vous affecte.
            </div>

            <p-table [value]="state().demandes" [loading]="state().loading" [paginator]="state().demandes.length > 10" [rows]="10" responsiveLayout="scroll">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Membre</th>
                        <th>Téléphone</th>
                        <th>Montant</th>
                        <th>Objet</th>
                        <th>Saisie par (accueil)</th>
                        <th>Affectée par</th>
                        <th>Date d'affectation</th>
                        <th>Action</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-d>
                    <tr>
                        <td>{{ d.prenom }} {{ d.nom }}<br /><span class="text-xs text-gray-500">{{ d.numeroMembre }}</span></td>
                        <td>{{ d.telephone }}</td>
                        <td>{{ d.montantDemande | currency: 'GNF ' : 'symbol' : '1.0-0' }}</td>
                        <td>{{ d.objectCredit }}</td>
                        <td>{{ d.codUsuarios }}</td>
                        <td>{{ d.affecteParDa }}</td>
                        <td>{{ d.dateAffectationAc | date: 'dd/MM/yyyy HH:mm' }}</td>
                        <td>
                            <button
                                pButton
                                label="Prendre en charge"
                                icon="pi pi-play"
                                class="p-button-sm"
                                (click)="prendreEnCharge(d)"
                            ></button>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr>
                        <td colspan="8" class="text-center py-6 text-gray-500">Aucune demande affectée en attente.</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
export class DemandesAffecteesComponent implements OnInit {
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private destroyRef = inject(DestroyRef);
    private router = inject(Router);

    state = signal<{ demandes: any[]; loading: boolean; fonctionAccueil: boolean }>({ demandes: [], loading: false, fonctionAccueil: false });

    ngOnInit(): void {
        this.load();
        // Cumul accueil + crédit autorisé : la fonction Accueil est simplement signalée (bandeau info)
        this.userService
            .getMesFonctions$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    const fonctions = response.data?.fonctions || [];
                    this.state.update((s) => ({ ...s, fonctionAccueil: fonctions.includes('ACCUEIL') }));
                },
                error: () => {}
            });
    }

    load(): void {
        this.state.update((s) => ({ ...s, loading: true }));
        this.userService
            .getMesAffectationsAC$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => this.state.update((s) => ({ ...s, demandes: response.data?.workflowDemandes || [], loading: false })),
                error: (err) => {
                    this.state.update((s) => ({ ...s, loading: false }));
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Chargement impossible', life: 5000 });
                }
            });
    }

    prendreEnCharge(d: any): void {
        this.confirmationService.confirm({
            header: 'Confirmation de prise en charge',
            message: `Êtes-vous sûr de vouloir prendre en charge la demande de ${d.prenom} ${d.nom} (${d.montantDemande?.toLocaleString('fr-FR') || '?'} GNF) ? Elle passera en sélection et vous en deviendrez responsable pour l'instruction.`,
            icon: 'pi pi-question-circle',
            acceptLabel: 'Oui, prendre en charge',
            rejectLabel: 'Annuler',
            acceptIcon: 'pi pi-check',
            rejectIcon: 'pi pi-times',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => this.confirmerPriseEnCharge(d)
        });
    }

    private confirmerPriseEnCharge(d: any): void {
        this.userService
            .prendreEnChargeAC$(d.demandeIndividuelId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Prise en charge', detail: "La demande est en sélection : poursuivez l'instruction", life: 4000 });
                    this.router.navigate(['/dashboards/credit/individuel/attente/detail', d.demandeIndividuelId]);
                },
                error: (err) => this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Échec de la prise en charge', life: 5000 })
            });
    }
}
