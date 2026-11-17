import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

/**
 * Désinscription SMS : les numéros à qui on n'écrit plus.
 *
 * Jusqu'au lot 1, rien dans la plateforme ne permettait d'enregistrer la demande d'un client
 * qui voulait qu'on arrête de lui écrire — et comme un répertoire se recharge depuis un
 * fichier, il y revenait au chargement suivant. Une exclusion se pose ici, et se lève
 * difficilement : seul l'administrateur peut réinscrire, avec un motif.
 */
@Component({
    selector: 'app-desinscriptions-sms',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, TagModule, ToastModule, TooltipModule, TableModule, InputTextModule, DialogModule, MessageModule, SelectModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>

        <div class="card">
            <div class="flex justify-between items-start flex-wrap gap-3 mb-4">
                <div>
                    <h2 class="text-xl font-bold m-0">Désinscriptions SMS</h2>
                    <p class="text-sm text-gray-500 mt-2 mb-0" style="max-width: 46rem">
                        Les numéros retirés des campagnes. Le filtre s'applique <strong>deux fois</strong> : quand une
                        campagne tire ses destinataires, et juste avant chaque envoi — un client désinscrit entre les
                        deux ne recevra rien. Une exclusion se pose en un geste ; seule l'administration peut la lever.
                    </p>
                </div>
                <div class="text-right">
                    <div class="text-3xl font-bold text-red-600">{{ state().total | number }}</div>
                    <div class="text-xs text-gray-500 uppercase">numéros exclus</div>
                </div>
            </div>

            @if (objetParOrigine().length) {
            <div class="flex flex-wrap gap-2 mb-4">
                @for (o of objetParOrigine(); track o.nom) {
                <p-tag [value]="libelleOrigine(o.nom) + ' : ' + o.nb" severity="secondary"></p-tag>
                }
            </div>
            }

            <!-- Rechercher un numéro -->
            <div class="flex flex-wrap gap-2 items-end mb-4">
                <div class="flex flex-col gap-2">
                    <label for="rech" class="text-sm text-gray-600">Chercher un numéro</label>
                    <input pInputText id="rech" placeholder="622000001 ou +224 622…" [ngModel]="state().recherche" (ngModelChange)="majRecherche($event)" (keyup.enter)="chercher()" />
                </div>
                <button pButton label="Chercher" icon="pi pi-search" (click)="chercher()" [loading]="state().chargement"></button>
                <button pButton label="Retirer un numéro des campagnes" icon="pi pi-ban" severity="danger" [outlined]="true" (click)="ouvrirExclusion()"></button>
            </div>

            @if (fiche(); as f) {
            <div class="p-3 border rounded mb-4" [class.bg-red-50]="f.exclu" [class.border-red-200]="f.exclu" [class.bg-green-50]="!f.exclu" [class.border-green-200]="!f.exclu">
                <div class="flex justify-between items-center flex-wrap gap-2">
                    <div>
                        <span class="font-mono font-bold text-lg">{{ f.telephone }}</span>
                        <p-tag class="ml-2" [severity]="f.exclu ? 'danger' : 'success'" [value]="f.exclu ? 'Exclu des campagnes' : 'Joignable'"></p-tag>
                    </div>
                    @if (f.exclu) {
                    <button pButton label="Réinscrire" icon="pi pi-undo" class="p-button-sm p-button-text" (click)="ouvrirLevee(f.telephone)"></button>
                    }
                </div>
                @if (f.etat) {
                <div class="text-sm text-gray-700 mt-2">
                    {{ libelleOrigine(f.etat.origine) }} — {{ f.etat.motif }}
                    <span class="text-gray-500">· posée le {{ f.etat.dateExclusion | date: 'dd/MM/yyyy HH:mm' }} par {{ f.etat.excluPar }}</span>
                </div>
                }
                @if (f.journal?.length) {
                <div class="text-xs text-gray-600 mt-3">
                    <div class="font-semibold mb-1">Historique</div>
                    @for (j of f.journal; track j.dateAction) {
                    <div>{{ j.dateAction | date: 'dd/MM/yyyy HH:mm' }} — {{ j.action === 'EXCLUSION' ? 'exclusion' : 'levée' }} par {{ j.parUser }} @if (j.motif) { ({{ j.motif }}) }</div>
                    }
                </div>
                }
            </div>
            }

            <!-- Liste des exclusions -->
            <p-table [value]="state().exclusions" styleClass="p-datatable-sm" [paginator]="state().exclusions.length > 25" [rows]="25">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Numéro</th>
                        <th>Origine</th>
                        <th>Motif</th>
                        <th>Posée le</th>
                        <th>Par</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-e>
                    <tr>
                        <td class="font-mono">{{ e.telephone }}</td>
                        <td><p-tag [value]="libelleOrigine(e.origine)" severity="secondary"></p-tag></td>
                        <td class="text-sm">{{ e.motif }}</td>
                        <td class="text-sm">{{ e.dateExclusion | date: 'dd/MM/yyyy HH:mm' }}</td>
                        <td class="text-sm">{{ e.excluPar }}</td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr><td colspan="5" class="text-center text-gray-500 py-4">Aucune désinscription enregistrée.</td></tr>
                </ng-template>
            </p-table>
        </div>

        <!-- Poser une exclusion -->
        <p-dialog [(visible)]="exclusion().ouvert" [modal]="true" [style]="{ width: '480px' }" header="Retirer un numéro des campagnes">
            <div class="flex flex-col gap-3">
                <div class="flex flex-col gap-2">
                    <label for="tel" class="text-sm text-gray-600">Numéro</label>
                    <input pInputText id="tel" placeholder="622000001" [ngModel]="exclusion().telephone" (ngModelChange)="majExclusion('telephone', $event)" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="org" class="text-sm text-gray-600">Origine de la demande</label>
                    <p-select inputId="org" [options]="origines" optionLabel="libelle" optionValue="code" [ngModel]="exclusion().origine" (ngModelChange)="majExclusion('origine', $event)" styleClass="w-full"></p-select>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="mot" class="text-sm text-gray-600">Motif (obligatoire)</label>
                    <input pInputText id="mot" placeholder="Demande du client au guichet de Matam" [ngModel]="exclusion().motif" (ngModelChange)="majExclusion('motif', $event)" />
                </div>
                <p-message severity="info" text="Le numéro cessera de recevoir des campagnes dès cet enregistrement, y compris pour les campagnes déjà créées."></p-message>
            </div>
            <ng-template pTemplate="footer">
                <button pButton label="Annuler" class="p-button-text" (click)="fermerExclusion()"></button>
                <button pButton label="Retirer des campagnes" icon="pi pi-ban" severity="danger" [loading]="exclusion().envoi" (click)="exclure()"></button>
            </ng-template>
        </p-dialog>

        <!-- Lever une exclusion -->
        <p-dialog [(visible)]="levee().ouvert" [modal]="true" [style]="{ width: '480px' }" header="Réinscrire un numéro">
            <div class="flex flex-col gap-3">
                <p-message severity="warn" text="La réinscription est réservée à l'administration et doit reposer sur une demande du client. Indiquez-la."></p-message>
                <div class="font-mono font-bold">{{ levee().telephone }}</div>
                <div class="flex flex-col gap-2">
                    <label for="motlev" class="text-sm text-gray-600">Motif (obligatoire)</label>
                    <input pInputText id="motlev" placeholder="Le client demande à recevoir à nouveau les informations" [ngModel]="levee().motif" (ngModelChange)="majLevee($event)" />
                </div>
            </div>
            <ng-template pTemplate="footer">
                <button pButton label="Annuler" class="p-button-text" (click)="fermerLevee()"></button>
                <button pButton label="Réinscrire" icon="pi pi-undo" [loading]="levee().envoi" (click)="lever()"></button>
            </ng-template>
        </p-dialog>
    `
})
export class DesinscriptionsSmsComponent implements OnInit {
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

    readonly origines = [
        { code: 'GUICHET', libelle: 'Demande du client (guichet, appel)' },
        { code: 'STOP_HUB', libelle: 'Réponse STOP remontée par l’opérateur' },
        { code: 'ECHEC_PERMANENT', libelle: 'Numéro définitivement injoignable' },
        { code: 'IMPORT', libelle: 'Reprise d’une liste existante' }
    ];

    state = signal<{ exclusions: any[]; total: number; parOrigine: Record<string, number>; recherche: string; chargement: boolean }>({
        exclusions: [],
        total: 0,
        parOrigine: {},
        recherche: '',
        chargement: false
    });

    fiche = signal<any | null>(null);
    exclusion = signal<{ ouvert: boolean; telephone: string; origine: string; motif: string; envoi: boolean }>({ ouvert: false, telephone: '', origine: 'GUICHET', motif: '', envoi: false });
    levee = signal<{ ouvert: boolean; telephone: string; motif: string; envoi: boolean }>({ ouvert: false, telephone: '', motif: '', envoi: false });

    ngOnInit(): void {
        this.charger();
    }

    charger(): void {
        this.state.update((s) => ({ ...s, chargement: true }));
        this.userService
            .getOptoutSms$(this.state().recherche)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) =>
                    this.state.update((s) => ({
                        ...s,
                        exclusions: response.data?.exclusions ?? [],
                        total: response.data?.syntheseOptout?.total ?? 0,
                        parOrigine: response.data?.syntheseOptout?.parOrigine ?? {},
                        chargement: false
                    })),
                error: (err) => {
                    this.state.update((s) => ({ ...s, chargement: false }));
                    this.messageService.add({ severity: 'error', summary: 'Lecture impossible', detail: err, life: 5000 });
                }
            });
    }

    majRecherche(valeur: string): void {
        this.state.update((s) => ({ ...s, recherche: valeur }));
    }

    /** Cherche l'état d'un numéro précis, et filtre la liste au passage. */
    chercher(): void {
        const numero = this.state().recherche?.trim();
        this.charger();
        if (!numero) {
            this.fiche.set(null);
            return;
        }
        this.userService
            .rechercherOptoutSms$(numero)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => this.fiche.set(response.data?.optout ?? null),
                error: (err) => {
                    this.fiche.set(null);
                    this.messageService.add({ severity: 'warn', summary: 'Numéro non lisible', detail: err, life: 5000 });
                }
            });
    }

    // ---------------------------------------------------------------- poser

    ouvrirExclusion(): void {
        this.exclusion.set({ ouvert: true, telephone: this.state().recherche ?? '', origine: 'GUICHET', motif: '', envoi: false });
    }

    fermerExclusion(): void {
        this.exclusion.update((e) => ({ ...e, ouvert: false }));
    }

    majExclusion(champ: 'telephone' | 'origine' | 'motif', valeur: string): void {
        this.exclusion.update((e) => ({ ...e, [champ]: valeur }));
    }

    exclure(): void {
        const e = this.exclusion();
        if (!e.telephone?.trim() || !e.motif?.trim()) {
            this.messageService.add({ severity: 'warn', summary: 'Champs manquants', detail: 'Le numéro et le motif sont obligatoires', life: 4000 });
            return;
        }
        this.exclusion.update((x) => ({ ...x, envoi: true }));
        this.userService
            .exclureSms$(e.telephone.trim(), e.origine, e.motif.trim())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.exclusion.set({ ouvert: false, telephone: '', origine: 'GUICHET', motif: '', envoi: false });
                    this.messageService.add({ severity: 'success', summary: 'Numéro retiré des campagnes', detail: 'Il ne recevra plus de SMS, y compris sur les campagnes déjà créées', life: 5000 });
                    this.charger();
                },
                error: (err) => {
                    this.exclusion.update((x) => ({ ...x, envoi: false }));
                    this.messageService.add({ severity: 'error', summary: 'Exclusion refusée', detail: err, life: 6000 });
                }
            });
    }

    // ---------------------------------------------------------------- lever

    ouvrirLevee(telephone: string): void {
        this.levee.set({ ouvert: true, telephone, motif: '', envoi: false });
    }

    fermerLevee(): void {
        this.levee.update((l) => ({ ...l, ouvert: false }));
    }

    majLevee(valeur: string): void {
        this.levee.update((l) => ({ ...l, motif: valeur }));
    }

    lever(): void {
        const l = this.levee();
        if (!l.motif?.trim()) {
            this.messageService.add({ severity: 'warn', summary: 'Motif obligatoire', detail: 'Indiquez la demande du client', life: 4000 });
            return;
        }
        this.levee.update((x) => ({ ...x, envoi: true }));
        this.userService
            .leverOptoutSms$(l.telephone, l.motif.trim())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.levee.set({ ouvert: false, telephone: '', motif: '', envoi: false });
                    this.messageService.add({ severity: 'success', summary: 'Numéro réinscrit', detail: 'Il pourra de nouveau recevoir des campagnes', life: 5000 });
                    this.fiche.set(null);
                    this.charger();
                },
                error: (err) => {
                    this.levee.update((x) => ({ ...x, envoi: false }));
                    this.messageService.add({ severity: 'error', summary: 'Réinscription refusée', detail: err, life: 6000 });
                }
            });
    }

    // ---------------------------------------------------------------- affichage

    objetParOrigine(): { nom: string; nb: number }[] {
        const p = this.state().parOrigine ?? {};
        return Object.entries(p)
            .map(([nom, nb]) => ({ nom, nb: Number(nb) }))
            .sort((a, b) => b.nb - a.nb);
    }

    libelleOrigine(origine: string): string {
        switch (origine) {
            case 'GUICHET':
                return 'Demande du client';
            case 'STOP_HUB':
                return 'Réponse STOP';
            case 'ECHEC_PERMANENT':
                return 'Injoignable';
            case 'IMPORT':
                return 'Liste reprise';
            default:
                return origine;
        }
    }
}
