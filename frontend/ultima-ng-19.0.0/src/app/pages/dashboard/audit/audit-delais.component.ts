import { DelaisDerogations } from '@/interface/audit';
import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

/**
 * Délais et dérogations (Audit, lot 3).
 *
 * Quatre questions que personne ne pouvait poser à la plateforme :
 * un dossier a-t-il été validé par un niveau qui n'en avait pas le pouvoir (l'échelle est
 * DA 25 M, DR 50 M, DE 100 M, DG au-delà) ; combien de temps les dossiers attendent avant
 * chaque étape et dans quelle agence ; lesquels dorment encore dans le circuit sans que plus
 * rien ne bouge ; lesquels ont fait plusieurs allers-retours en correction.
 *
 * Tout est calculé à la lecture, sur le journal du circuit : aucun chiffre n'est stocké, donc
 * aucun ne peut devenir faux.
 */
@Component({
    selector: 'app-audit-delais',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, TableModule, TabsModule, TagModule, ToastModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>
        <div class="card">
            <div class="flex flex-wrap justify-between items-center gap-3 mb-2">
                <h2 class="text-xl font-bold m-0">Délais et dérogations</h2>
                <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-500">Dossier dormant au-delà de</span>
                    <input pInputText type="number" [(ngModel)]="seuilJours" class="w-20" min="1" max="365" (keyup.enter)="charger()" />
                    <span class="text-sm text-gray-500">jours</span>
                    <button pButton icon="pi pi-refresh" class="p-button-text" (click)="charger()" [loading]="loading()"></button>
                    <button pButton icon="pi pi-file-excel" label="Exporter" class="p-button-success p-button-outlined" [loading]="exportEnCours()" (click)="exporter()"></button>
                </div>
            </div>
            <p class="text-sm text-gray-500 mb-3">
                Lecture seule, tout est recalculé à l'affichage depuis le journal du circuit. L'échelle de délégation en vigueur : le DA valide
                jusqu'à 25 M, le DR jusqu'à 50 M, le DE jusqu'à 100 M, le DG au-delà.
            </p>

            @if (d(); as x) {
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div class="border rounded p-3" [class.border-red-300]="x.nbDerogations > 0">
                    <div class="text-xs text-gray-500 uppercase">Au-dessus du plafond</div>
                    <div class="text-xl font-bold" [class.text-red-600]="x.nbDerogations > 0">{{ x.nbDerogations | number }}</div>
                    <div class="text-xs text-gray-500">{{ x.montantDerogations | number: '1.0-0' }} GNF</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Dossiers dormants</div>
                    <div class="text-xl font-bold">{{ x.nbDormants | number }}</div>
                    <div class="text-xs text-gray-500">plus de {{ x.seuilDormantJours }} jours sans mouvement</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Allers-retours</div>
                    <div class="text-xl font-bold">{{ x.nbResoumis | number }}</div>
                    <div class="text-xs text-gray-500">renvoyés plus d'une fois</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Étape la plus lente</div>
                    <div class="text-xl font-bold">{{ duree(x.parEtape[0]?.moyenneHeures) }}</div>
                    <div class="text-xs text-gray-500">{{ x.parEtape[0]?.etape || '—' }}</div>
                </div>
            </div>

            <p-tabs value="0">
                <p-tablist>
                    <p-tab value="0">Dérogations ({{ x.nbDerogations }})</p-tab>
                    <p-tab value="1">Par étape</p-tab>
                    <p-tab value="2">Par agence</p-tab>
                    <p-tab value="3">Dormants ({{ x.nbDormants }})</p-tab>
                    <p-tab value="4">Allers-retours ({{ x.nbResoumis }})</p-tab>
                </p-tablist>
                <p-tabpanels>
                    <p-tabpanel value="0">
                        <p class="text-sm text-gray-500 mb-2">
                            Dossiers dont la validation finale porte la signature d'un niveau dont le plafond est inférieur au montant. Une
                            dérogation peut être justifiée — elle doit seulement se voir.
                        </p>
                        <p-table [value]="x.derogations" styleClass="p-datatable-sm" [paginator]="x.derogations.length > 25" [rows]="25" responsiveLayout="scroll">
                            <ng-template pTemplate="header">
                                <tr>
                                    <th>Dossier</th>
                                    <th>Client</th>
                                    <th class="text-right">Montant</th>
                                    <th>Validé par</th>
                                    <th>Niveau</th>
                                    <th class="text-right">Plafond</th>
                                    <th class="text-right">Dépassement</th>
                                    <th>Date</th>
                                    <th>Point de service</th>
                                    <th>Agence</th>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-l>
                                <tr>
                                    <td>{{ l.demandeId }}</td>
                                    <td>{{ l.client || '—' }}</td>
                                    <td class="text-right font-semibold">{{ l.montant | number: '1.0-0' }}</td>
                                    <td>{{ l.valideur || '—' }}</td>
                                    <td><p-tag [value]="l.niveau" severity="warn"></p-tag></td>
                                    <td class="text-right text-gray-500">{{ l.plafond | number: '1.0-0' }}</td>
                                    <td class="text-right text-red-600 font-semibold">{{ l.depassement | number: '1.0-0' }}</td>
                                    <td class="whitespace-nowrap">{{ l.dateValidation | date: 'dd/MM/yyyy' }}</td>
                                    <td>{{ l.pointVente || '—' }}</td>
                                    <td>{{ l.agence || '—' }}</td>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="emptymessage">
                                <tr>
                                    <td colspan="10" class="text-center text-gray-500 py-4">Aucun dossier validé au-dessus du plafond de son niveau.</td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </p-tabpanel>

                    <p-tabpanel value="1">
                        <p class="text-sm text-gray-500 mb-2">Temps écoulé depuis l'évènement précédent du même dossier, moyenne et pire cas.</p>
                        <p-table [value]="x.parEtape" styleClass="p-datatable-sm">
                            <ng-template pTemplate="header">
                                <tr>
                                    <th>Étape</th>
                                    <th class="text-right">Passages</th>
                                    <th class="text-right">Attente moyenne</th>
                                    <th class="text-right">Pire attente</th>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-l>
                                <tr>
                                    <td>{{ l.etape }}</td>
                                    <td class="text-right">{{ l.passages | number }}</td>
                                    <td class="text-right font-semibold" [class.text-red-600]="l.moyenneHeures >= 720">{{ duree(l.moyenneHeures) }}</td>
                                    <td class="text-right text-gray-500">{{ duree(l.maxHeures) }}</td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </p-tabpanel>

                    <p-tabpanel value="2">
                        <p class="text-sm text-gray-500 mb-2">Agences totalisant au moins vingt évènements, de la plus lente à la plus rapide.</p>
                        <p-table [value]="x.parAgence" styleClass="p-datatable-sm" [paginator]="x.parAgence.length > 25" [rows]="25">
                            <ng-template pTemplate="header">
                                <tr>
                                    <th>Agence</th>
                                    <th>Délégation</th>
                                    <th class="text-right">Évènements</th>
                                    <th class="text-right">Attente moyenne</th>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-l>
                                <tr>
                                    <td>{{ l.agence }}</td>
                                    <td>{{ l.delegation || '—' }}</td>
                                    <td class="text-right">{{ l.evenements | number }}</td>
                                    <td class="text-right font-semibold" [class.text-red-600]="l.moyenneHeures >= 168">{{ duree(l.moyenneHeures) }}</td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </p-tabpanel>

                    <p-tabpanel value="3">
                        <p class="text-sm text-gray-500 mb-2">
                            Dossiers encore dans le circuit dont plus rien n'a bougé depuis le seuil choisi. Ni validés, ni annulés, ni rejetés :
                            simplement arrêtés.
                        </p>
                        <p-table [value]="x.dormants" styleClass="p-datatable-sm" [paginator]="x.dormants.length > 25" [rows]="25" responsiveLayout="scroll">
                            <ng-template pTemplate="header">
                                <tr>
                                    <th>Dossier</th>
                                    <th>Client</th>
                                    <th class="text-right">Montant</th>
                                    <th>Étape</th>
                                    <th>Dernier mouvement</th>
                                    <th class="text-right">Jours</th>
                                    <th>Point de service</th>
                                    <th>Agence</th>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-l>
                                <tr>
                                    <td>{{ l.demandeId }}</td>
                                    <td>{{ l.client || '—' }}</td>
                                    <td class="text-right">{{ l.montant | number: '1.0-0' }}</td>
                                    <td>{{ l.etat || '—' }}</td>
                                    <td class="whitespace-nowrap">{{ l.dernierEvenement | date: 'dd/MM/yyyy' }}</td>
                                    <td class="text-right font-semibold" [class.text-red-600]="l.joursSansMouvement >= 60">{{ l.joursSansMouvement }}</td>
                                    <td>{{ l.pointVente || '—' }}</td>
                                    <td>{{ l.agence || '—' }}</td>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="emptymessage">
                                <tr>
                                    <td colspan="8" class="text-center text-gray-500 py-4">Aucun dossier dormant pour ce seuil.</td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </p-tabpanel>

                    <p-tabpanel value="4">
                        <p class="text-sm text-gray-500 mb-2">Dossiers renvoyés plus d'une fois en correction : le circuit a tourné en rond.</p>
                        <p-table [value]="x.resoumissions" styleClass="p-datatable-sm" [paginator]="x.resoumissions.length > 25" [rows]="25" responsiveLayout="scroll">
                            <ng-template pTemplate="header">
                                <tr>
                                    <th>Dossier</th>
                                    <th>Client</th>
                                    <th class="text-right">Montant</th>
                                    <th class="text-right">Renvois</th>
                                    <th>Étapes de renvoi</th>
                                    <th>Étape actuelle</th>
                                    <th>Dernier renvoi</th>
                                    <th>Agence</th>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-l>
                                <tr>
                                    <td>{{ l.demandeId }}</td>
                                    <td>{{ l.client || '—' }}</td>
                                    <td class="text-right">{{ l.montant | number: '1.0-0' }}</td>
                                    <td class="text-right font-semibold" [class.text-red-600]="l.nbCorrections >= 4">{{ l.nbCorrections }}</td>
                                    <td class="text-sm">{{ l.etats || '—' }}</td>
                                    <td>{{ l.etatActuel || '—' }}</td>
                                    <td class="whitespace-nowrap">{{ l.derniereCorrection | date: 'dd/MM/yyyy' }}</td>
                                    <td>{{ l.agence || '—' }}</td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </p-tabpanel>
                </p-tabpanels>
            </p-tabs>
            }
        </div>
    `
})
export class AuditDelaisComponent implements OnInit {
    private readonly userService = inject(UserService);
    private readonly messageService = inject(MessageService);
    private readonly destroyRef = inject(DestroyRef);

    readonly d = signal<DelaisDerogations | null>(null);
    readonly loading = signal(false);
    readonly exportEnCours = signal(false);

    seuilJours = 30;

    ngOnInit(): void {
        this.charger();
    }

    charger(): void {
        this.loading.set(true);
        this.userService
            .getAuditDelais$(this.seuilJours)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.d.set(((r.data as any)?.delais as DelaisDerogations) || null);
                    this.loading.set(false);
                },
                error: (err) => {
                    this.loading.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Délais et dérogations', detail: err || 'Lecture impossible', life: 6000 });
                }
            });
    }

    exporter(): void {
        this.exportEnCours.set(true);
        this.userService
            .exportAuditDelais$(this.seuilJours)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (reponse: HttpResponse<Blob>) => {
                    this.exportEnCours.set(false);
                    const disposition = reponse.headers.get('Content-Disposition') || '';
                    const nom = /filename="?([^";]+)"?/.exec(disposition)?.[1] || 'Audit_delais_derogations.xlsx';
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

    /** Un délai se lit en heures, en jours, ou en mois : jamais en 17 544 heures. */
    duree(heures: number | null | undefined): string {
        if (heures === null || heures === undefined) return '—';
        if (heures < 24) return `${heures} h`;
        const jours = Math.round(heures / 24);
        if (jours < 60) return `${jours} j`;
        return `${Math.round(jours / 30)} mois`;
    }
}
