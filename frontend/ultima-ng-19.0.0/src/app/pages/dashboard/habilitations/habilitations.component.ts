import { LigneDepartement, MatriceHabilitation, RubriqueHabilitation } from '@/interface/habilitation';
import { HabilitationService } from '@/service/habilitation.service';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

/**
 * Reglage des habilitations par departement (V178/V179, lot 2).
 *
 * <p>Ecran du responsable de service, et de l'administrateur. Une case cochee accorde un ecran
 * a un departement ; la bascule decide si la matrice s'applique ou si chacun garde, pour le
 * temps du placement, toutes les rubriques de son service.</p>
 *
 * <p>Le rattachement d'un agent ne se fait pas ici mais sur la fiche du compte, par
 * l'administrateur : cet ecran l'affiche en lecture seule pour qu'on sache qui est concerne.</p>
 */
@Component({
    selector: 'app-habilitations',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, TableModule, TagModule, ToastModule, TooltipModule, ConfirmDialogModule],
    providers: [MessageService, ConfirmationService],
    template: `
        <p-toast></p-toast>
        <p-confirmDialog></p-confirmDialog>

        <div class="card">
            <div class="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                    <h2 class="text-xl font-semibold m-0">Habilitations par département</h2>
                    <div class="text-sm text-gray-500 max-w-3xl">
                        Une case cochée donne l'écran au département. Le responsable du service voit tout, ses cases ne se décochent pas.
                        Le rattachement d'un agent se fait sur la fiche de son compte, par l'administrateur.
                    </div>
                </div>
                <button pButton icon="pi pi-refresh" class="p-button-text" (click)="charger()" [loading]="loading()" pTooltip="Recharger"></button>
            </div>

            <!-- Etat de la bascule -->
            <ng-container *ngIf="matrice() as m">
                <div class="rounded p-3 mb-4 flex flex-wrap items-center justify-between gap-3"
                     [ngClass]="m.parDepartementActif ? 'border border-green-400 bg-green-50 text-green-900' : 'border border-orange-400 bg-orange-50 text-orange-900'">
                    <div>
                        <div class="font-semibold">
                            {{ m.parDepartementActif ? 'La matrice est appliquée' : 'La matrice n’est pas encore appliquée' }}
                        </div>
                        <div class="text-sm">
                            <ng-container *ngIf="!m.parDepartementActif">
                                Chaque compte garde pour l'instant toutes les rubriques de son service. Placez les agents, puis appliquez.
                            </ng-container>
                            <ng-container *ngIf="m.parDepartementActif">
                                Chaque compte ne voit que les rubriques de son département.
                            </ng-container>
                        </div>
                    </div>
                    <button pButton [label]="m.parDepartementActif ? 'Suspendre l’application' : 'Appliquer la matrice'"
                            [icon]="m.parDepartementActif ? 'pi pi-pause' : 'pi pi-check'"
                            [class]="m.parDepartementActif ? 'p-button-outlined p-button-secondary' : 'p-button-success'"
                            [loading]="bascule()" (click)="demanderBascule(!m.parDepartementActif)"></button>
                </div>

                <!-- Comptes non places -->
                <div *ngIf="m.nonPlaces.length" class="border border-orange-400 bg-orange-50 text-orange-900 rounded p-3 mb-4">
                    <div class="font-semibold mb-1">{{ m.nonPlaces.length }} compte(s) sans département</div>
                    <div class="text-sm">
                        Tant que la matrice n'est pas appliquée, ces comptes gardent tous les écrans de leur service.
                        Une fois appliquée, ils ne verraient plus que le socle commun.
                    </div>
                    <div class="text-sm mt-2">{{ m.nonPlaces.join(' · ') }}</div>
                </div>

                <!-- La matrice -->
                <div class="overflow-x-auto">
                    <table class="w-full text-sm border-collapse">
                        <thead>
                            <tr>
                                <th class="text-left p-2 border-b-2 border-gray-300 min-w-64">Département</th>
                                <th *ngFor="let r of m.rubriques" class="p-2 border-b-2 border-gray-300 text-center align-bottom"
                                    [pTooltip]="r.famille" style="min-width: 7.5rem">
                                    <div class="text-xs font-semibold leading-tight">{{ r.libelle }}</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="let d of m.departements" class="border-b border-gray-200">
                                <td class="p-2 align-top">
                                    <div class="font-semibold">
                                        {{ d.libelle }}
                                        <p-tag *ngIf="d.toutVoir" value="voit tout" severity="success" styleClass="ml-2"></p-tag>
                                    </div>
                                    <div class="text-xs text-gray-500">
                                        {{ d.comptesActifs }} compte(s) actif(s)<ng-container *ngIf="d.comptes > d.comptesActifs"> sur {{ d.comptes }}</ng-container>
                                    </div>
                                    <div class="text-xs text-gray-500" *ngIf="d.noms.length">{{ d.noms.join(' · ') }}</div>
                                    <div class="text-xs text-gray-400" *ngIf="!d.noms.length">Personne n'y est rattaché</div>
                                </td>
                                <td *ngFor="let r of m.rubriques" class="p-2 text-center align-middle">
                                    <button type="button" class="p-link"
                                            [disabled]="d.toutVoir || enCours() === d.id + ':' + r.code"
                                            (click)="basculerCase(d, r)"
                                            [pTooltip]="d.toutVoir ? 'Le responsable du service voit tout' : (aLaRubrique(d, r.code) ? 'Retirer' : 'Accorder')">
                                        <i class="pi"
                                           [ngClass]="aLaRubrique(d, r.code) ? 'pi-check-circle text-green-600 text-xl' : 'pi-circle text-gray-300 text-xl'"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Journal -->
                <h3 class="text-lg font-semibold mt-6 mb-2">Derniers réglages</h3>
                <p-table [value]="m.journal" styleClass="p-datatable-sm" *ngIf="m.journal.length">
                    <ng-template pTemplate="header">
                        <tr>
                            <th>Quand</th>
                            <th>Action</th>
                            <th>Département</th>
                            <th>Rubrique</th>
                            <th>Par</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-t>
                        <tr>
                            <td>{{ t.dateAction | date: 'dd/MM/yyyy HH:mm' }}</td>
                            <td>{{ libelleAction(t.action) }}</td>
                            <td>{{ t.departement || '—' }}</td>
                            <td>{{ t.rubriqueCode || '—' }}</td>
                            <td>{{ t.parNom || '—' }}</td>
                        </tr>
                    </ng-template>
                </p-table>
                <div class="text-sm text-gray-500" *ngIf="!m.journal.length">Aucun réglage enregistré pour l'instant.</div>
            </ng-container>

            <div class="text-sm text-gray-500" *ngIf="!matrice() && !loading()">{{ erreur() || 'Rien à afficher.' }}</div>
        </div>
    `
})
export class HabilitationsComponent implements OnInit {
    private userService = inject(UserService);
    private habilitationService = inject(HabilitationService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private destroyRef = inject(DestroyRef);

    matrice = signal<MatriceHabilitation | null>(null);
    loading = signal(false);
    bascule = signal(false);
    /** Clé « departementId:rubrique » de la case en cours d'écriture. */
    enCours = signal<string | null>(null);
    erreur = signal<string | null>(null);

    ngOnInit(): void {
        this.charger();
    }

    charger(): void {
        this.loading.set(true);
        this.erreur.set(null);
        this.userService
            .getMatriceHabilitations$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.matrice.set(((response.data as any)?.matrice ?? null) as MatriceHabilitation | null);
                    this.loading.set(false);
                },
                error: (err) => {
                    this.loading.set(false);
                    this.erreur.set(err?.message || 'Impossible de lire la matrice');
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: this.erreur()!, life: 5000 });
                }
            });
    }

    aLaRubrique(d: LigneDepartement, code: string): boolean {
        return d.toutVoir || d.rubriques.includes(code);
    }

    basculerCase(d: LigneDepartement, r: RubriqueHabilitation): void {
        if (d.toutVoir) {
            return;
        }
        const accorde = !d.rubriques.includes(r.code);
        const cle = d.id + ':' + r.code;
        this.enCours.set(cle);
        this.userService
            .reglerHabilitation$(d.id, r.code, accorde)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.enCours.set(null);
                    // On met la ligne à jour sans tout recharger, puis on relit pour le journal.
                    d.rubriques = accorde ? [...d.rubriques, r.code] : d.rubriques.filter((c) => c !== r.code);
                    this.messageService.add({ severity: 'success', summary: 'Enregistré', detail: response.message, life: 2500 });
                    this.habilitationService.oublier();
                    this.charger();
                },
                error: (err) => {
                    this.enCours.set(null);
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err?.message || 'Échec du réglage', life: 5000 });
                }
            });
    }

    demanderBascule(actif: boolean): void {
        const nonPlaces = this.matrice()?.nonPlaces.length ?? 0;
        const message = actif
            ? nonPlaces > 0
                ? `${nonPlaces} compte(s) n'ont pas encore de département. En appliquant la matrice maintenant, ces comptes ne verront plus que le socle commun. Continuer ?`
                : 'Chaque compte ne verra plus que les rubriques de son département. Continuer ?'
            : 'Chaque compte retrouvera toutes les rubriques de son service, le temps du placement. Continuer ?';
        this.confirmationService.confirm({
            header: actif ? 'Appliquer la matrice' : 'Suspendre l’application',
            message,
            acceptLabel: 'Oui',
            rejectLabel: 'Annuler',
            accept: () => this.basculer(actif)
        });
    }

    private basculer(actif: boolean): void {
        this.bascule.set(true);
        this.userService
            .basculerHabilitations$(actif)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.bascule.set(false);
                    this.messageService.add({ severity: 'success', summary: 'Enregistré', detail: response.message, life: 4000 });
                    this.habilitationService.oublier();
                    this.charger();
                },
                error: (err) => {
                    this.bascule.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err?.message || 'Échec de la bascule', life: 5000 });
                }
            });
    }

    libelleAction(action: string): string {
        switch (action) {
            case 'ACCORDER':
                return 'Rubrique accordée';
            case 'RETIRER':
                return 'Rubrique retirée';
            case 'BASCULE':
                return 'Application de la matrice';
            case 'RATTACHEMENT':
                return 'Rattachement d’un compte';
            case 'ACCUEIL':
                return 'Écran d’accueil';
            default:
                return action;
        }
    }
}
