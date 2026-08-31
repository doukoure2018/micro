import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

/**
 * DA — File de réception : demandes saisies par l'accueil (EN_ATTENTE_DA)
 * à affecter à un agent de crédit, ou à annuler avec motif (retour accueil).
 * Les demandes déjà AFFECTEE restent visibles et peuvent être réaffectées.
 */
@Component({
    selector: 'app-receptions-a-affecter',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, TagModule, ToastModule, TooltipModule, DialogModule, DropdownModule, InputTextModule, TextareaModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>
        <div class="card">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold m-0">Affectations & réorientation</h2>
                <button pButton icon="pi pi-refresh" class="p-button-text" (click)="load()" [loading]="state().loading"></button>
            </div>
            <p class="text-sm text-gray-500">
                Les demandes réceptionnées par l'agent d'accueil arrivent ici en <strong>attente d'affectation</strong> : choisissez l'agent de crédit qui sera l'unique responsable du dossier. Vous pouvez aussi
                <strong>réorienter un dossier vers un autre agent</strong> lorsque son responsable n'est plus disponible (l'état d'instruction est conservé), ou annuler une demande fraîchement réceptionnée (retour à
                l'accueil avec motif). Cliquez sur une ligne pour voir le détail de la demande.
            </p>

            <!-- Barre de filtres (filtrage immediat cote client) -->
            <div class="flex flex-wrap gap-3 items-center mb-4">
                <input
                    pInputText
                    type="text"
                    [(ngModel)]="filtreRecherche"
                    placeholder="Rechercher (nom, n° membre, téléphone, objet…)"
                    class="w-72"
                />
                <p-dropdown
                    [options]="statutOptions()"
                    [(ngModel)]="filtreStatut"
                    placeholder="Statut"
                    [showClear]="true"
                    styleClass="w-48"
                    appendTo="body"
                ></p-dropdown>
                <p-dropdown
                    [options]="posOptions()"
                    [(ngModel)]="filtrePos"
                    placeholder="Point de vente"
                    [showClear]="true"
                    [filter]="posOptions().length > 8"
                    styleClass="w-52"
                    appendTo="body"
                ></p-dropdown>
                <p-dropdown
                    [options]="natureOptions()"
                    [(ngModel)]="filtreNature"
                    placeholder="Nature"
                    [showClear]="true"
                    styleClass="w-44"
                    appendTo="body"
                ></p-dropdown>
                <button
                    *ngIf="filtresActifs()"
                    pButton
                    icon="pi pi-filter-slash"
                    label="Réinitialiser"
                    class="p-button-text p-button-sm"
                    (click)="reinitialiserFiltres()"
                ></button>
                <span class="text-sm text-gray-500 ml-auto">{{ demandesFiltrees().length }} / {{ state().demandes.length }} demande(s)</span>
            </div>

            <p-table [value]="demandesFiltrees()" [loading]="state().loading" [paginator]="demandesFiltrees().length > 10" [rows]="10" responsiveLayout="scroll" [rowHover]="true">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Membre</th>
                        <th>Point de vente</th>
                        <th>Nature</th>
                        <th>Montant</th>
                        <th>Objet</th>
                        <th>Saisie par</th>
                        <th>Statut</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-d>
                    <!-- Ligne cliquable : ouvre le detail de la demande -->
                    <tr class="cursor-pointer" (click)="voirDetail(d)">
                        <td>{{ d.prenom }} {{ d.nom }}<br /><span class="text-xs text-gray-500">{{ d.numeroMembre }}</span></td>
                        <td>{{ d.pointventeLibele || d.pos }}</td>
                        <td><p-tag [value]="labelNature(d.natureClient)" [severity]="severiteNature(d.natureClient)"></p-tag></td>
                        <td>{{ d.montantDemande | currency: 'GNF ' : 'symbol' : '1.0-0' }}</td>
                        <td>{{ d.objectCredit }}</td>
                        <td>{{ d.codUsuarios }}</td>
                        <td>
                            <p-tag [value]="labelEtat(d.validationState)" [severity]="severiteEtat(d.validationState)"></p-tag>
                            <div *ngIf="d.agentAffecteNom" class="text-xs text-gray-500 mt-1"><i class="pi pi-user"></i> {{ d.agentAffecteNom }}</div>
                        </td>
                        <td>{{ d.createdAt | date: 'dd/MM/yyyy HH:mm' }}</td>
                        <td>
                            <div class="flex gap-2">
                                <button
                                    pButton
                                    icon="pi pi-eye"
                                    class="p-button-sm p-button-text"
                                    pTooltip="Voir le détail"
                                    (click)="$event.stopPropagation(); voirDetail(d)"
                                ></button>
                                <button
                                    *ngIf="d.validationState !== 'CORRECTION_ACCUEIL'"
                                    pButton
                                    [icon]="d.agentCreditAffecte ? 'pi pi-sync' : 'pi pi-user-plus'"
                                    class="p-button-sm"
                                    [pTooltip]="d.agentCreditAffecte ? 'Réorienter vers un autre agent' : 'Affecter à un agent de crédit'"
                                    (click)="$event.stopPropagation(); ouvrirAffectation(d)"
                                ></button>
                                <button
                                    *ngIf="d.validationState === 'EN_ATTENTE_DA' || d.validationState === 'AFFECTEE'"
                                    pButton
                                    icon="pi pi-times"
                                    class="p-button-sm p-button-danger p-button-outlined"
                                    pTooltip="Annuler (retour accueil)"
                                    (click)="$event.stopPropagation(); ouvrirAnnulation(d)"
                                ></button>
                            </div>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr>
                        <td colspan="9" class="text-center py-6 text-gray-500">
                            {{ filtresActifs() && state().demandes.length > 0 ? 'Aucune demande ne correspond aux filtres.' : "Aucune demande en attente d'affectation." }}
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <!-- Dialog affectation / réorientation -->
        <p-dialog header="Réorienter la demande vers un agent de crédit" [visible]="state().showAffecter" [modal]="true" [style]="{ width: '480px' }" (onHide)="fermerDialogs()" [closable]="true">
            <div class="flex flex-col gap-3" *ngIf="state().selected as d">
                <p class="m-0">
                    <strong>{{ d.prenom }} {{ d.nom }}</strong> — {{ d.montantDemande | currency: 'GNF ' : 'symbol' : '1.0-0' }}
                </p>
                <label class="text-sm font-semibold">Agent de crédit <span class="text-red-500">*</span></label>
                <p-dropdown
                    [options]="agentsCredit()"
                    [(ngModel)]="agentSelectionne"
                    optionLabel="label"
                    placeholder="Sélectionner un agent"
                    [filter]="true"
                    filterBy="label"
                    styleClass="w-full"
                    appendTo="body"
                ></p-dropdown>
                <div *ngIf="autoAffectation()" class="p-2 border-round border-1 border-orange-200 bg-orange-50 text-orange-700 text-sm">
                    <i class="pi pi-exclamation-triangle mr-1"></i>
                    Cet agent a <strong>saisi cette demande lui-même</strong> (cumul accueil + crédit). Confirmez l'affectation en connaissance de cause.
                </div>
            </div>
            <ng-template pTemplate="footer">
                <button pButton label="Annuler" icon="pi pi-times" class="p-button-text" (click)="fermerDialogs()"></button>
                <button pButton label="Affecter" icon="pi pi-check" [disabled]="!agentSelectionne" (click)="confirmerAffectation()"></button>
            </ng-template>
        </p-dialog>

        <!-- Dialog annulation -->
        <p-dialog header="Annuler la demande (retour accueil)" [visible]="state().showAnnuler" [modal]="true" [style]="{ width: '480px' }" (onHide)="fermerDialogs()" [closable]="true">
            <div class="flex flex-col gap-3" *ngIf="state().selected as d">
                <p class="m-0 text-sm text-gray-600">La demande retournera à l'agent d'accueil qui l'a saisie, avec votre motif, pour correction puis rediligence.</p>
                <label class="text-sm font-semibold">Motif de l'annulation <span class="text-red-500">*</span></label>
                <textarea pTextarea [(ngModel)]="motifAnnulation" rows="3" class="w-full" placeholder="Ex. informations du membre incomplètes"></textarea>
            </div>
            <ng-template pTemplate="footer">
                <button pButton label="Fermer" icon="pi pi-times" class="p-button-text" (click)="fermerDialogs()"></button>
                <button pButton label="Confirmer l'annulation" icon="pi pi-check" severity="danger" [disabled]="!motifAnnulation.trim()" (click)="confirmerAnnulation()"></button>
            </ng-template>
        </p-dialog>
    `
})
export class ReceptionsAAffecterComponent implements OnInit {
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);
    private router = inject(Router);

    state = signal<{
        demandes: any[];
        agents: any[];
        loading: boolean;
        showAffecter: boolean;
        showAnnuler: boolean;
        selected: any | null;
    }>({ demandes: [], agents: [], loading: false, showAffecter: false, showAnnuler: false, selected: null });

    agentSelectionne: { label: string; value: number } | null = null;
    motifAnnulation = '';

    // Filtres de la liste (cote client, appliques a chaque rendu)
    filtreRecherche = '';
    filtreStatut: { label: string; value: string } | null = null;
    filtrePos: { label: string; value: string } | null = null;
    filtreNature: { label: string; value: string } | null = null;

    demandesFiltrees(): any[] {
        const recherche = this.filtreRecherche.trim().toLowerCase();
        return this.state().demandes.filter((d) => {
            if (this.filtreStatut && d.validationState !== this.filtreStatut.value) return false;
            if (this.filtrePos && String(d.pointventeLibele || d.pos || '') !== this.filtrePos.value) return false;
            if (this.filtreNature && this.labelNature(d.natureClient) !== this.filtreNature.value) return false;
            if (!recherche) return true;
            const texte = [d.prenom, d.nom, d.numeroMembre, d.telephone, d.objectCredit, d.codUsuarios, d.agentAffecteNom]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            return texte.includes(recherche);
        });
    }

    statutOptions(): { label: string; value: string }[] {
        return [...new Set(this.state().demandes.map((d) => d.validationState).filter(Boolean))].map((s) => ({ label: this.labelEtat(s), value: s }));
    }

    posOptions(): { label: string; value: string }[] {
        return [...new Set(this.state().demandes.map((d) => String(d.pointventeLibele || d.pos || '')).filter(Boolean))].sort().map((p) => ({ label: p, value: p }));
    }

    natureOptions(): { label: string; value: string }[] {
        return [...new Set(this.state().demandes.map((d) => this.labelNature(d.natureClient)))].sort().map((n) => ({ label: n, value: n }));
    }

    filtresActifs(): boolean {
        return !!(this.filtreRecherche.trim() || this.filtreStatut || this.filtrePos || this.filtreNature);
    }

    reinitialiserFiltres(): void {
        this.filtreRecherche = '';
        this.filtreStatut = null;
        this.filtrePos = null;
        this.filtreNature = null;
    }

    ngOnInit(): void {
        this.load();
        this.loadAgents();
    }

    load(): void {
        this.state.update((s) => ({ ...s, loading: true }));
        this.userService
            .getAAffecterDA$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => this.state.update((s) => ({ ...s, demandes: response.data?.workflowDemandes || [], loading: false })),
                error: (err) => {
                    this.state.update((s) => ({ ...s, loading: false }));
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Chargement impossible', life: 5000 });
                }
            });
    }

    loadAgents(): void {
        this.userService
            .getAgentsAgence$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => this.state.update((s) => ({ ...s, agents: response.data?.agents || [] })),
                error: () => {}
            });
    }

    /**
     * Agents éligibles à l'analyse : rôle AGENT_CREDIT. Le cumul accueil + crédit
     * est autorisé (points de service mono-agent) : ces agents sont signalés
     * « accueil + crédit » dans la liste, et une alerte s'affiche si le DA affecte
     * une demande à l'agent qui l'a lui-même saisie.
     */
    agentsCredit(): { label: string; value: number }[] {
        return this.state()
            .agents.filter((a) => a.role === 'AGENT_CREDIT')
            .map((a) => ({
                label: `${a.firstName} ${a.lastName}${a.pointventeLibele ? ' — ' + a.pointventeLibele : ''}${a.fonctionAccueil ? ' (accueil + crédit)' : ''}`,
                value: a.userId
            }));
    }

    /** L'agent choisi est celui qui a saisi la demande (cumul accueil + crédit). */
    autoAffectation(): boolean {
        const d = this.state().selected;
        return !!d?.saisiePar && !!this.agentSelectionne && Number(d.saisiePar) === Number(this.agentSelectionne.value);
    }

    voirDetail(d: any): void {
        this.router.navigate(['/dashboards/credit/individuel/attente/detail', d.demandeIndividuelId]);
    }

    ouvrirAffectation(d: any): void {
        this.agentSelectionne = null;
        this.state.update((s) => ({ ...s, selected: d, showAffecter: true, showAnnuler: false }));
    }

    ouvrirAnnulation(d: any): void {
        this.motifAnnulation = '';
        this.state.update((s) => ({ ...s, selected: d, showAnnuler: true, showAffecter: false }));
    }

    fermerDialogs(): void {
        this.state.update((s) => ({ ...s, showAffecter: false, showAnnuler: false, selected: null }));
    }

    labelEtat(etat: string): string {
        switch (etat) {
            case 'EN_ATTENTE_DA':
                return 'À affecter';
            case 'AFFECTEE':
                return 'Affectée';
            case 'SELECTION':
                return 'En instruction';
            case 'CORRECTION':
                return 'En correction';
            case 'CORRECTION_ACCUEIL':
                return 'Retour accueil';
            case 'CORRECTION_DR':
                return 'Correction DR';
            case 'CORRECTION_DE':
                return 'Correction DE';
            default:
                return etat;
        }
    }

    severiteEtat(etat: string): 'info' | 'warn' | 'success' | 'danger' | 'secondary' {
        switch (etat) {
            case 'EN_ATTENTE_DA':
                return 'warn';
            case 'AFFECTEE':
                return 'success';
            case 'SELECTION':
                return 'info';
            case 'CORRECTION':
            case 'CORRECTION_ACCUEIL':
            case 'CORRECTION_DR':
            case 'CORRECTION_DE':
                return 'danger';
            default:
                return 'secondary';
        }
    }

    labelNature(natureClient?: string): string {
        if (!natureClient) return 'Particulier';
        if (natureClient.includes('PME')) return 'PME/PMI';
        if (natureClient.includes('Professionnel')) return 'Professionnel';
        if (natureClient.includes('Fonctionnaire')) return 'Fonctionnaire';
        if (natureClient.includes('Groupe')) return 'Groupe Solidaire';
        return 'Particulier';
    }

    severiteNature(natureClient?: string): 'info' | 'warn' | 'success' | 'secondary' {
        if (natureClient?.includes('Groupe')) return 'success';
        if (natureClient?.includes('Fonctionnaire')) return 'warn';
        if (natureClient?.includes('PME')) return 'info';
        if (natureClient?.includes('Professionnel')) return 'success';
        return 'secondary';
    }

    confirmerAffectation(): void {
        const d = this.state().selected;
        if (!d || !this.agentSelectionne) return;
        this.userService
            .affecterAC$(d.demandeIndividuelId, this.agentSelectionne.value)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Affectée', detail: "Demande affectée à l'agent de crédit", life: 4000 });
                    this.fermerDialogs();
                    this.load();
                },
                error: (err) => this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || "Échec de l'affectation", life: 5000 })
            });
    }

    confirmerAnnulation(): void {
        const d = this.state().selected;
        if (!d || !this.motifAnnulation.trim()) return;
        this.userService
            .annulerAccueil$(d.demandeIndividuelId, this.motifAnnulation.trim())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.messageService.add({ severity: 'info', summary: 'Annulée', detail: "Demande renvoyée à l'agent d'accueil", life: 4000 });
                    this.fermerDialogs();
                    this.load();
                },
                error: (err) => this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || "Échec de l'annulation", life: 5000 })
            });
    }
}
