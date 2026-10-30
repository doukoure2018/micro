import { Decision, DecisionsSynthese, PageAudit } from '@/interface/audit';
import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

/**
 * Journal des décisions (Audit, lot 2).
 *
 * La plateforme enregistre chaque changement d'état d'un dossier depuis la mise en place du
 * déclencheur : qui a fait avancer, renvoyé ou rejeté, et quand. Aucun écran ne le lisait.
 * Le délai affiché est le temps écoulé depuis l'évènement précédent du MÊME dossier : c'est lui
 * qui montre où un dossier a attendu, et il est calculé avant tout filtre pour rester juste.
 */
@Component({
    selector: 'app-audit-decisions',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, SelectModule, TableModule, TagModule, ToastModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>
        <div class="card">
            <div class="flex flex-wrap justify-between items-center gap-3 mb-2">
                <h2 class="text-xl font-bold m-0">Journal des décisions</h2>
                <button pButton icon="pi pi-refresh" class="p-button-text" (click)="charger(0)" [loading]="loading()"></button>
            </div>
            <p class="text-sm text-gray-500 mb-3">
                Chaque changement d'état d'un dossier, avec son auteur et le temps écoulé depuis l'évènement précédent du même dossier.
                Lecture seule. Le journal commence à la mise en place du déclencheur : ce qui précède n'est pas enregistré.
            </p>

            @if (synthese(); as s) {
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Évènements</div>
                    <div class="text-xl font-bold">{{ s.total | number }}</div>
                    <div class="text-xs text-gray-500" *ngIf="s.premier">depuis le {{ s.premier | date: 'dd/MM/yyyy' }}</div>
                </div>
                <div class="border rounded p-3" *ngFor="let e of s.parEvenement.slice(0, 3)">
                    <div class="text-xs text-gray-500 uppercase">{{ libelleEvenement(e.cle) }}</div>
                    <div class="text-xl font-bold">{{ e.nombre | number }}</div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div class="border rounded p-3">
                    <div class="font-semibold mb-2">Les étapes où les dossiers attendent le plus</div>
                    <p-table [value]="s.plusLents" styleClass="p-datatable-sm">
                        <ng-template pTemplate="header"><tr><th>État d'arrivée</th><th class="text-right">Passages</th><th class="text-right">Attente moyenne</th></tr></ng-template>
                        <ng-template pTemplate="body" let-l>
                            <tr class="cursor-pointer" (click)="filtrerEtat(l.cle)">
                                <td>{{ l.cle }}</td>
                                <td class="text-right">{{ l.nombre | number }}</td>
                                <td class="text-right font-semibold" [class.text-red-600]="l.moyenneHeures >= 720">{{ duree(l.moyenneHeures) }}</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
                <div class="border rounded p-3">
                    <div class="font-semibold mb-2">Les vingt acteurs les plus actifs</div>
                    <p-table [value]="s.parActeur" styleClass="p-datatable-sm" [scrollable]="true" scrollHeight="220px">
                        <ng-template pTemplate="header"><tr><th>Acteur</th><th class="text-right">Évènements</th></tr></ng-template>
                        <ng-template pTemplate="body" let-l>
                            <tr class="cursor-pointer" (click)="filtrerActeur(l.cle)">
                                <td>{{ l.cle }}</td>
                                <td class="text-right">{{ l.nombre | number }}</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>
            }

            <div class="flex flex-wrap gap-3 items-center mb-3">
                <input pInputText type="number" [(ngModel)]="dossier" placeholder="N° dossier" class="w-36" (keyup.enter)="charger(0)" />
                <input pInputText type="text" [(ngModel)]="acteur" placeholder="Acteur" class="w-48" (keyup.enter)="charger(0)" />
                <p-select [options]="evenementOptions" [(ngModel)]="evenement" optionLabel="label" optionValue="value" placeholder="Tous les évènements" [showClear]="true" styleClass="w-56" appendTo="body" (onChange)="charger(0)"></p-select>
                <input pInputText type="text" [(ngModel)]="etat" placeholder="État d'arrivée" class="w-44" (keyup.enter)="charger(0)" />
                <input pInputText type="date" [(ngModel)]="du" class="w-40" />
                <span class="text-gray-500">au</span>
                <input pInputText type="date" [(ngModel)]="au" class="w-40" />
                <button pButton icon="pi pi-search" class="p-button-outlined" (click)="charger(0)"></button>
                <button pButton icon="pi pi-times" label="Effacer" class="p-button-text" (click)="effacer()"></button>
                <button pButton icon="pi pi-file-excel" label="Exporter Excel" class="p-button-success p-button-outlined ml-auto" [loading]="exportEnCours()" (click)="exporter()"></button>
            </div>

            <p-table
                [value]="page()?.contenu || []"
                [loading]="loading()"
                styleClass="p-datatable-sm"
                [lazy]="true"
                [paginator]="true"
                [rows]="taille"
                [totalRecords]="page()?.total || 0"
                [first]="(page()?.page || 0) * taille"
                (onLazyLoad)="surPage($event)"
                [rowsPerPageOptions]="[25, 50, 100, 200]"
                responsiveLayout="scroll"
                currentPageReportTemplate="{first} à {last} sur {totalRecords} évènements"
                [showCurrentPageReport]="true"
            >
                <ng-template pTemplate="header">
                    <tr>
                        <th>Date</th>
                        <th>Dossier</th>
                        <th>Client</th>
                        <th class="text-right">Montant</th>
                        <th>Évènement</th>
                        <th>De</th>
                        <th>Vers</th>
                        <th>Acteur</th>
                        <th class="text-right">Délai</th>
                        <th>Point de service</th>
                        <th>Motif</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-d>
                    <tr>
                        <td class="text-xs whitespace-nowrap">{{ d.dateEvenement | date: 'dd/MM/yyyy HH:mm' }}</td>
                        <td class="font-mono">{{ d.demandeId }}</td>
                        <td>{{ d.client }}<div class="text-xs text-gray-500" *ngIf="d.numeroMembre">{{ d.numeroMembre }}</div></td>
                        <td class="text-right">{{ d.montant | number: '1.0-0' }}</td>
                        <td><p-tag [value]="libelleEvenement(d.evenement)" [severity]="severiteEvenement(d.evenement)"></p-tag></td>
                        <td class="text-xs">{{ d.ancienEtat || '—' }}</td>
                        <td class="text-xs font-semibold">{{ d.nouvelEtat || '—' }}</td>
                        <td class="text-xs">{{ d.acteur || '—' }}</td>
                        <td class="text-right text-xs" [class.text-red-600]="d.delaiHeures >= 720" [pTooltip]="d.delaiHeures !== null ? 'Depuis l\\'évènement précédent du même dossier' : ''">{{ duree(d.delaiHeures) }}</td>
                        <td class="text-xs">{{ d.pointVente }}<div class="text-gray-500" *ngIf="d.agence">{{ d.agence }}</div></td>
                        <td class="text-xs">{{ d.motif }}</td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage"><tr><td colspan="11" class="text-center text-gray-500 py-4">Aucun évènement pour ces filtres.</td></tr></ng-template>
            </p-table>
        </div>
    `
})
export class AuditDecisionsComponent implements OnInit {
    private readonly userService = inject(UserService);
    private readonly messageService = inject(MessageService);
    private readonly destroyRef = inject(DestroyRef);

    page = signal<PageAudit<Decision> | null>(null);
    synthese = signal<DecisionsSynthese | null>(null);
    loading = signal(false);
    exportEnCours = signal(false);

    dossier: number | null = null;
    acteur: string | null = null;
    evenement: string | null = null;
    etat: string | null = null;
    du: string | null = null;
    au: string | null = null;
    taille = 50;

    evenementOptions = [
        { label: 'Changement d’état', value: 'ETAT' },
        { label: 'Création', value: 'CREATION' },
        { label: 'Affectation', value: 'AFFECTATION' },
        { label: 'Réattribution', value: 'REATTRIBUTION' }
    ];

    ngOnInit(): void {
        this.chargerSynthese();
        this.charger(0);
    }

    private chargerSynthese(): void {
        this.userService
            .getAuditDecisionsSynthese$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => this.synthese.set(((r.data as any)?.synthese as DecisionsSynthese) || null),
                error: () => {}
            });
    }

    charger(page: number): void {
        this.loading.set(true);
        this.userService
            .getAuditDecisions$(this.filtres(), page, this.taille)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.page.set(((r.data as any)?.decisions as PageAudit<Decision>) || null);
                    this.loading.set(false);
                },
                error: (err) => {
                    this.loading.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Journal des décisions', detail: err || 'Lecture impossible', life: 6000 });
                }
            });
    }

    surPage(e: any): void {
        const nouvelleTaille = e?.rows || this.taille;
        const page = Math.floor((e?.first || 0) / nouvelleTaille);
        this.taille = nouvelleTaille;
        this.charger(page);
    }

    filtrerEtat(etat: string): void {
        this.etat = etat;
        this.charger(0);
    }

    filtrerActeur(acteur: string): void {
        this.acteur = acteur;
        this.charger(0);
    }

    effacer(): void {
        this.dossier = null;
        this.acteur = null;
        this.evenement = null;
        this.etat = null;
        this.du = null;
        this.au = null;
        this.charger(0);
    }

    exporter(): void {
        this.exportEnCours.set(true);
        this.userService
            .exportAuditDecisions$(this.filtres())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (reponse: HttpResponse<Blob>) => {
                    this.exportEnCours.set(false);
                    const disposition = reponse.headers.get('Content-Disposition') || '';
                    const nom = /filename="?([^";]+)"?/.exec(disposition)?.[1] || 'Audit_journal_decisions.xlsx';
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

    private filtres() {
        return { dossier: this.dossier, acteur: this.acteur, evenement: this.evenement, etat: this.etat, du: this.du, au: this.au };
    }

    libelleEvenement(e: string): string {
        return e === 'ETAT' ? 'Changement d’état' : e === 'CREATION' ? 'Création' : e === 'AFFECTATION' ? 'Affectation' : e === 'REATTRIBUTION' ? 'Réattribution' : e;
    }

    severiteEvenement(e: string): 'info' | 'success' | 'warn' | 'secondary' {
        return e === 'CREATION' ? 'success' : e === 'REATTRIBUTION' ? 'warn' : e === 'AFFECTATION' ? 'info' : 'secondary';
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
