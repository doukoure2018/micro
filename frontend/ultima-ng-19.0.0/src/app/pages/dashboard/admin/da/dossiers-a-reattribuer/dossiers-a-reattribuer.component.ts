import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

/**
 * Dossiers à réattribuer (rotation, lot 3) : dossiers en cours portés par un agent qui a quitté le
 * point de service ou dont le compte est désactivé. Le DA les réattribue un par un à un agent de
 * crédit du point de service ; le DR et la Direction de l'Exploitation consultent.
 */
@Component({
    selector: 'app-dossiers-a-reattribuer',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, TableModule, ButtonModule, DialogModule, SelectModule, InputTextModule, TagModule, ToastModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>
        <div class="card">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                    <h2 class="text-xl font-semibold m-0">Dossiers à réattribuer</h2>
                    <div class="text-sm text-gray-500">Dossiers en cours dont l'agent a quitté le point de service (rotation) ou dont le compte est désactivé. Ils n'avancent plus tant qu'un agent présent ne les reprend pas.</div>
                </div>
                <div class="flex gap-2 items-center">
                    <input pInputText type="text" [ngModel]="recherche()" (ngModelChange)="recherche.set($event)" placeholder="Client, membre, agent…" class="w-64" />
                    <button pButton icon="pi pi-refresh" class="p-button-text" (click)="charger()" [loading]="loading()" pTooltip="Recharger"></button>
                </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div class="border rounded p-3"><div class="text-xs text-gray-500 uppercase">À réattribuer</div><div class="text-xl font-bold">{{ dossiers().length }}</div></div>
                <div class="border rounded p-3"><div class="text-xs text-gray-500 uppercase">Bloqués (correction accueil)</div><div class="text-xl font-bold text-red-600">{{ nbBloques() }}</div></div>
                <div class="border rounded p-3"><div class="text-xs text-gray-500 uppercase">Agent muté</div><div class="text-xl font-bold">{{ nbMutes() }}</div></div>
                <div class="border rounded p-3"><div class="text-xs text-gray-500 uppercase">Compte désactivé</div><div class="text-xl font-bold">{{ nbDesactives() }}</div></div>
            </div>

            <p-table [value]="filtres()" [loading]="loading()" styleClass="p-datatable-sm" [paginator]="filtres().length > 25" [rows]="25" responsiveLayout="scroll" sortMode="single">
                <ng-template pTemplate="header">
                    <tr>
                        <th>N°</th><th>Client</th><th>Membre</th><th class="text-right">Montant</th><th>Étape</th><th>Point de service</th>
                        <th>Agent porteur</th><th>Pourquoi</th><th>Depuis</th><th></th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-d>
                    <tr [class.bg-red-50]="d.etat === 'CORRECTION_ACCUEIL'">
                        <td><a [routerLink]="['/dashboards/credit/individuel/attente/detail', d.id]" class="text-blue-600 font-medium">{{ d.id }}</a></td>
                        <td>{{ d.prenom }} {{ d.nom }}</td>
                        <td>{{ d.numero_membre }}</td>
                        <td class="text-right tabular">{{ d.montant_demande | number: '1.0-0' }}</td>
                        <td><p-tag [value]="d.etat" [severity]="d.etat === 'CORRECTION_ACCUEIL' ? 'danger' : 'info'"></p-tag></td>
                        <td>{{ d.point_vente }}<span *ngIf="!peutReattribuer()" class="text-xs text-gray-400 block">{{ d.agence_libelle }}</span></td>
                        <td>
                            <div>{{ d.agent || '—' }}<span *ngIf="d.agent_point_vente" class="text-xs text-gray-400"> · {{ d.agent_point_vente }}</span></div>
                            <div *ngIf="d.etat === 'CORRECTION_ACCUEIL' && d.accueil" class="text-xs text-gray-500">accueil : {{ d.accueil }}<span *ngIf="d.accueil_point_vente"> · {{ d.accueil_point_vente }}</span></div>
                        </td>
                        <td class="text-sm text-orange-700">{{ d.raison }}</td>
                        <td class="text-sm text-gray-500">{{ d.createdat | date: 'dd/MM/yyyy' }}</td>
                        <td class="text-right">
                            <button *ngIf="peutReattribuer()" pButton icon="pi pi-user-edit" label="Réattribuer" class="p-button-sm p-button-outlined" (click)="ouvrir(d)"></button>
                            <button *ngIf="peutReattribuer() && d.agent_credit_affecte" pButton icon="pi pi-users" label="Toute sa charge" class="p-button-sm p-button-text ml-1" pTooltip="Remettre d'un coup tout ce que cet agent porte encore, y compris les dossiers qu'une réattribution dossier par dossier ne peut pas déplacer" (click)="ouvrirCharge(d)"></button>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage"><tr><td colspan="10" class="text-gray-500 p-4">Aucun dossier orphelin : tous les dossiers en cours sont portés par un agent présent à son point de service.</td></tr></ng-template>
            </p-table>
        </div>

        <p-dialog header="Remettre toute la charge de l'agent" [(visible)]="showCharge" [modal]="true" [style]="{ width: '38rem' }">
            <ng-container *ngIf="agentCharge() as a">
                <div class="mb-3 p-3 bg-indigo-50 rounded text-sm">
                    <div class="font-semibold">{{ a.agent }} — charge restée à {{ psCharge() || a.point_vente }}</div>
                    <div class="text-gray-600 mt-1">
                        Tout ce que cet agent porte encore passe d'un coup au destinataire choisi : dossiers de crédit en cours, saisies d'accueil,
                        crédits SAF affectés et désignations de rapport. C'est la seule façon de déplacer un dossier déjà validé, qu'une réattribution
                        dossier par dossier laisse en place. Vous pourrez ensuite affiner dossier par dossier.
                    </div>
                </div>
                <label class="block text-sm font-semibold mb-1">Remettre à</label>
                <p-select [options]="candidatsCharge()" [ngModel]="versCharge()" (ngModelChange)="versCharge.set($event)" optionLabel="label" optionValue="value" placeholder="-- Choisir --" [filter]="true" filterBy="label" styleClass="w-full mb-2" appendTo="body"></p-select>
                <small *ngIf="!candidatsCharge().length" class="text-orange-600 block mb-2"><i class="pi pi-exclamation-triangle mr-1"></i>Aucun agent de crédit disponible : affectez d'abord un agent à ce point de service ou à son agence.</small>
                <label class="block text-sm font-semibold mb-1 mt-2">Motif</label>
                <input pInputText type="text" [ngModel]="motifCharge()" (ngModelChange)="motifCharge.set($event)" class="w-full" maxlength="500" placeholder="Ex : agent muté à Kindia le 03/11" />
            </ng-container>
            <ng-template pTemplate="footer">
                <button pButton label="Annuler" class="p-button-text" (click)="showCharge = false"></button>
                <button pButton label="Remettre la charge" icon="pi pi-users" [disabled]="!versCharge() || motifCharge().trim().length < 5" [loading]="enCoursCharge()" (click)="confirmerCharge()"></button>
            </ng-template>
        </p-dialog>

        <p-dialog [header]="'Réattribuer le dossier ' + (dossier()?.id || '')" [(visible)]="showDialog" [modal]="true" [style]="{ width: '34rem' }">
            <ng-container *ngIf="dossier() as d">
                <div class="mb-3 p-3 bg-indigo-50 rounded text-sm">
                    <div class="font-semibold">{{ d.prenom }} {{ d.nom }} — {{ d.montant_demande | number: '1.0-0' }} GNF</div>
                    <div>Étape {{ d.etat }} · {{ d.point_vente }} · {{ d.raison }}</div>
                    <div class="text-gray-600 mt-1">Le dossier reste à la même étape ; seul l'agent responsable change. En correction accueil, la saisie passe aussi au nouvel agent.</div>
                </div>
                <label class="block text-sm font-semibold mb-1">Nouvel agent de crédit ({{ d.point_vente }})</label>
                <p-select [options]="candidats()" [ngModel]="versAgent()" (ngModelChange)="versAgent.set($event)" optionLabel="label" optionValue="value" placeholder="-- Choisir --" [filter]="true" filterBy="label" styleClass="w-full mb-2" appendTo="body"></p-select>
                <small *ngIf="!candidats().length" class="text-orange-600 block mb-2"><i class="pi pi-exclamation-triangle mr-1"></i>Aucun autre agent de crédit actif sur ce point de service.</small>
                <label class="block text-sm font-semibold mb-1 mt-2">Motif</label>
                <input pInputText type="text" [ngModel]="motif()" (ngModelChange)="motif.set($event)" class="w-full" maxlength="500" placeholder="Ex : agent muté à Matoto le 20/10" />
            </ng-container>
            <ng-template pTemplate="footer">
                <button pButton label="Annuler" class="p-button-text" (click)="showDialog = false"></button>
                <button pButton label="Réattribuer" icon="pi pi-user-edit" [disabled]="!versAgent() || motif().trim().length < 5" [loading]="enCours()" (click)="confirmer()"></button>
            </ng-template>
        </p-dialog>
    `,
    styles: [`.tabular { font-variant-numeric: tabular-nums; }`]
})
export class DossiersAReattribuerComponent implements OnInit {
    private readonly userService = inject(UserService);
    private readonly messageService = inject(MessageService);
    private readonly destroyRef = inject(DestroyRef);

    dossiers = signal<any[]>([]);
    loading = signal(false);
    peutReattribuer = signal(false);
    recherche = signal('');
    agents = signal<any[]>([]);
    dossier = signal<any | null>(null);
    versAgent = signal<number | null>(null);
    motif = signal('');
    enCours = signal(false);
    showDialog = false;

    // Remise de charge (03/11/2026) : le seul mecanisme qui deplace un dossier deja valide.
    agentCharge = signal<any | null>(null);
    candidatsCharge = signal<{ label: string; value: number }[]>([]);
    psCharge = signal<string | null>(null);
    versCharge = signal<number | null>(null);
    motifCharge = signal('');
    enCoursCharge = signal(false);
    showCharge = false;

    filtres = computed(() => {
        const q = this.recherche().trim().toLowerCase();
        if (!q) return this.dossiers();
        return this.dossiers().filter((d) => [d.nom, d.prenom, d.numero_membre, d.agent, d.accueil, d.point_vente, String(d.id)].some((v) => (v || '').toString().toLowerCase().includes(q)));
    });
    nbBloques = computed(() => this.dossiers().filter((d) => d.etat === 'CORRECTION_ACCUEIL').length);
    nbMutes = computed(() => this.dossiers().filter((d) => (d.raison || '').includes('mute')).length);
    nbDesactives = computed(() => this.dossiers().filter((d) => (d.raison || '').includes('desactive')).length);
    candidats = computed(() => {
        const d = this.dossier();
        if (!d) return [];
        return this.agents()
            .filter((a) => a.role === 'AGENT_CREDIT' && a.compteActif !== false && a.pointventeId === d.pos && a.userId !== d.agent_credit_affecte)
            .map((a) => ({ label: `${a.firstName} ${a.lastName}`, value: a.userId }));
    });

    ngOnInit(): void {
        this.charger();
    }

    charger(): void {
        this.loading.set(true);
        this.userService
            .getDossiersAReattribuer$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.dossiers.set(r.data?.dossiers || []);
                    this.peutReattribuer.set(!!r.data?.peutReattribuer);
                    this.loading.set(false);
                    if (this.peutReattribuer() && !this.agents().length) this.chargerAgents();
                },
                error: (err) => {
                    this.loading.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Liste indisponible', detail: typeof err === 'string' ? err : (err as any)?.message || '', life: 6000 });
                }
            });
    }

    private chargerAgents(): void {
        this.userService
            .getAgentsCreditEligibles$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({ next: (r: IResponse) => this.agents.set((r.data as any)?.agents || []), error: () => {} });
    }

    ouvrir(d: any): void {
        this.dossier.set(d);
        this.versAgent.set(null);
        this.motif.set(d.raison || '');
        this.showDialog = true;
    }

    /** Ouvre la remise de charge pour l'agent qui porte ce dossier. */
    ouvrirCharge(d: any): void {
        this.agentCharge.set(d);
        this.versCharge.set(null);
        this.motifCharge.set(d.raison || '');
        this.candidatsCharge.set([]);
        this.psCharge.set(null);
        this.showCharge = true;
        this.userService
            .getCandidatsRepriseCharge$(d.agent_credit_affecte)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    const reprise: any = r.data?.reprise;
                    this.psCharge.set(reprise?.pointVente || null);
                    const horsPs = (reprise?.candidats || []).length > 0 && !reprise?.memePs;
                    this.candidatsCharge.set(
                        (reprise?.candidats || []).map((c: any) => ({
                            label: `${c.nom} — ${c.point_vente || ''}${horsPs ? '  [autre point de service]' : ''}`,
                            value: c.user_id
                        }))
                    );
                },
                error: (err) =>
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Destinataires indisponibles',
                        detail: typeof err === 'string' ? err : (err as any)?.message || '',
                        life: 6000
                    })
            });
    }

    confirmerCharge(): void {
        const a = this.agentCharge();
        const vers = this.versCharge();
        if (!a || !vers) return;
        this.enCoursCharge.set(true);
        this.userService
            .transfererChargeAgent$(a.agent_credit_affecte, vers, this.motifCharge().trim(), null)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.enCoursCharge.set(false);
                    this.showCharge = false;
                    this.messageService.add({ severity: 'success', summary: 'Charge remise', detail: r.message || '', life: 7000 });
                    this.charger();
                },
                error: (err) => {
                    this.enCoursCharge.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Remise refusée', detail: typeof err === 'string' ? err : (err as any)?.message || '', life: 8000 });
                }
            });
    }

    confirmer(): void {
        const d = this.dossier();
        const vers = this.versAgent();
        if (!d || !vers) return;
        this.enCours.set(true);
        this.userService
            .reattribuerDossier$(d.id, vers, this.motif().trim())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.enCours.set(false);
                    this.showDialog = false;
                    this.dossiers.update((l) => l.filter((x) => x.id !== d.id));
                    this.messageService.add({ severity: 'success', summary: 'Dossier réattribué', detail: r.message || '', life: 5000 });
                },
                error: (err) => {
                    this.enCours.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Réattribution refusée', detail: typeof err === 'string' ? err : (err as any)?.message || '', life: 8000 });
                }
            });
    }
}
