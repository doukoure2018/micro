import { CategorieReclamation, FileReclamations, LIBELLES_STATUT, ReclamationVue, SEVERITES_STATUT, StatutReclamation } from '@/interface/reclamation';
import { IResponse } from '@/interface/response';
import { ReclamationService } from '@/service/reclamation.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

/**
 * Les réclamations du terrain (V211).
 *
 * Un agent de crédit signale depuis son téléphone : un guichet fermé, un membre introuvable
 * dans SAF, une pièce qui bloque un dossier. La réclamation part aussitôt par courriel aux six
 * directions porteuses de la rubrique, et se traite ici.
 *
 * Deux choses à savoir en lisant cet écran. **« Je m'en occupe » n'est pas une formalité** :
 * six directions destinataires, c'est six raisons de croire qu'un autre s'en charge, et le
 * nom qui s'affiche après le clic est ce qui évite qu'une réclamation attende tout le monde.
 * Et **une réclamation non acheminée se voit** : la colonne le signale, car elle est alors en
 * base sans que personne n'ait été prévenu.
 */
@Component({
    selector: 'app-reclamations',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, DialogModule, InputTextModule, SelectModule, TableModule, TagModule, TextareaModule, ToastModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>

        <div class="card">
            <div class="flex flex-wrap justify-between items-center gap-3 mb-2">
                <h2 class="text-xl font-bold m-0">Réclamations du terrain</h2>
                <button pButton icon="pi pi-refresh" class="p-button-text" (click)="charger()" [loading]="loading()"></button>
            </div>
            <p class="text-sm text-gray-500 mb-4">
                Signalements envoyés par les agents depuis l'application mobile. Chacun est parti par courriel
                aux directions porteuses de la rubrique. La réponse saisie ici revient à l'agent sur son téléphone.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div class="border border-surface rounded-lg p-3 cursor-pointer" [class.border-red-400]="statut === 'OUVERTE'" (click)="filtrerStatut('OUVERTE')">
                    <div class="text-2xl font-bold text-red-600">{{ file()?.ouvertes ?? 0 }}</div>
                    <div class="text-sm text-gray-500">Ouvertes — personne ne s'en occupe</div>
                </div>
                <div class="border border-surface rounded-lg p-3 cursor-pointer" [class.border-orange-400]="statut === 'EN_COURS'" (click)="filtrerStatut('EN_COURS')">
                    <div class="text-2xl font-bold text-orange-500">{{ file()?.enCours ?? 0 }}</div>
                    <div class="text-sm text-gray-500">Prises en charge</div>
                </div>
                <div class="border border-surface rounded-lg p-3 cursor-pointer" [class.border-green-400]="statut === 'TRAITEE'" (click)="filtrerStatut('TRAITEE')">
                    <div class="text-2xl font-bold text-green-600">{{ file()?.traitees ?? 0 }}</div>
                    <div class="text-sm text-gray-500">Traitées</div>
                </div>
            </div>

            <div class="flex flex-wrap gap-3 items-center mb-3">
                <p-select [options]="optionsCategorie()" [(ngModel)]="categorie" optionLabel="libelle" optionValue="code" placeholder="Toutes les catégories" [showClear]="true" (onChange)="charger()" styleClass="w-64"></p-select>
                <input pInputText type="text" [(ngModel)]="recherche" placeholder="Objet, agent, membre…" class="w-72" />
                <span class="text-sm text-gray-500">{{ filtrees().length }} réclamation(s) affichée(s)</span>
                <button *ngIf="statut || categorie" pButton label="Tout voir" icon="pi pi-filter-slash" class="p-button-text ml-auto" (click)="toutVoir()"></button>
            </div>

            <p-table [value]="filtrees()" [loading]="loading()" styleClass="p-datatable-sm" [paginator]="filtrees().length > 20" [rows]="20" responsiveLayout="scroll">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Reçue</th>
                        <th>Catégorie</th>
                        <th>Objet</th>
                        <th>Agent</th>
                        <th>Dossier</th>
                        <th>État</th>
                        <th>Prise par</th>
                        <th class="text-right">Action</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-r>
                    <tr>
                        <td class="text-xs whitespace-nowrap">
                            {{ r.recueAt | date: 'dd/MM/yyyy HH:mm' }}
                            <div *ngIf="!r.notifiee" class="text-red-600" pTooltip="La réclamation est en base mais aucun courriel n'est parti : à signaler à la DSIG.">
                                <i class="pi pi-exclamation-triangle"></i> non acheminée
                            </div>
                        </td>
                        <td class="text-xs">{{ r.categorieLibelle }}</td>
                        <td>
                            <span class="font-semibold">{{ r.objet }}</span>
                            <div class="text-xs text-gray-500 line-clamp-2">{{ r.message }}</div>
                        </td>
                        <td class="text-xs">
                            {{ r.auteur }}
                            <div class="text-gray-500">{{ r.auteurPointVente }}</div>
                        </td>
                        <td class="text-xs font-mono">
                            <span *ngIf="r.numCredito">{{ r.codAgencia }}/{{ r.numCredito }}</span>
                            <div *ngIf="r.codCliente" class="text-gray-500">{{ r.codCliente }}</div>
                            <span *ngIf="!r.numCredito && !r.codCliente" class="text-gray-400">—</span>
                        </td>
                        <td><p-tag [value]="libelleStatut(r.statut)" [severity]="severiteStatut(r.statut)"></p-tag></td>
                        <td class="text-xs">
                            {{ r.priseEnChargePar || '—' }}
                            <div *ngIf="r.priseEnChargeAt" class="text-gray-500">{{ r.priseEnChargeAt | date: 'dd/MM HH:mm' }}</div>
                        </td>
                        <td class="text-right whitespace-nowrap">
                            <button pButton label="Je m'en occupe" icon="pi pi-hand-paper" class="p-button-sm p-button-outlined mr-2" *ngIf="r.statut === 'OUVERTE'" [loading]="enAction() === r.id" (click)="prendreEnCharge(r)"></button>
                            <button pButton [label]="r.statut === 'TRAITEE' ? 'Voir' : 'Répondre'" [icon]="r.statut === 'TRAITEE' ? 'pi pi-eye' : 'pi pi-reply'" class="p-button-sm" (click)="ouvrir(r)"></button>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr>
                        <td colspan="8" class="text-center text-gray-500 py-6">
                            <span *ngIf="!file()?.reclamations?.length">Aucune réclamation. Les agents signalent depuis l'application mobile.</span>
                            <span *ngIf="file()?.reclamations?.length">Aucune réclamation ne correspond à ce filtre.</span>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <p-dialog [(visible)]="dialogue" [header]="choisie()?.objet || 'Réclamation'" [modal]="true" [style]="{ width: '46rem' }" [draggable]="false">
            <div *ngIf="choisie() as r" class="flex flex-col gap-3">
                <div class="text-sm text-gray-500">
                    {{ r.categorieLibelle }} · signalée par {{ r.auteur }}
                    <span *ngIf="r.auteurPointVente"> ({{ r.auteurPointVente }})</span>
                    le {{ r.saisieAt | date: 'dd/MM/yyyy à HH:mm' }}
                </div>

                <div class="p-3 border border-surface rounded-lg whitespace-pre-wrap">{{ r.message }}</div>

                <div *ngIf="r.numCredito || r.codCliente" class="text-sm">
                    <span *ngIf="r.numCredito" class="font-mono">Crédit {{ r.codAgencia }}/{{ r.numCredito }}</span>
                    <span *ngIf="r.codCliente" class="font-mono ml-3">Membre {{ r.codCliente }}</span>
                </div>

                <div *ngIf="r.statut === 'TRAITEE'" class="p-3 bg-green-50 rounded-lg">
                    <div class="text-sm font-semibold text-green-700">
                        Réponse de {{ r.reponduPar }} le {{ r.reponduAt | date: 'dd/MM/yyyy à HH:mm' }}
                    </div>
                    <div class="whitespace-pre-wrap mt-1">{{ r.reponse }}</div>
                </div>

                <div *ngIf="r.statut !== 'TRAITEE'" class="flex flex-col gap-2">
                    <label for="reponse" class="text-sm font-semibold">Votre réponse</label>
                    <textarea pTextarea id="reponse" rows="5" [(ngModel)]="reponse" placeholder="Ce qui a été fait, ou ce que l'agent doit faire."></textarea>
                    <small class="text-gray-500">Elle clôt la réclamation et s'affiche sur le téléphone de l'agent.</small>
                </div>
            </div>
            <ng-template pTemplate="footer">
                <button pButton label="Fermer" class="p-button-text" (click)="dialogue = false"></button>
                <button pButton label="Répondre et clôturer" icon="pi pi-check" *ngIf="choisie()?.statut !== 'TRAITEE'" [loading]="enAction() === choisie()?.id" [disabled]="reponse.trim().length < 2" (click)="repondre()"></button>
            </ng-template>
        </p-dialog>
    `
})
export class ReclamationsComponent implements OnInit {
    private readonly service = inject(ReclamationService);
    private readonly messageService = inject(MessageService);
    private readonly destroyRef = inject(DestroyRef);

    file = signal<FileReclamations | null>(null);
    categories = signal<CategorieReclamation[]>([]);
    loading = signal(false);
    enAction = signal<number | null>(null);
    choisie = signal<ReclamationVue | null>(null);

    statut: StatutReclamation | null = null;
    categorie: string | null = null;
    recherche = '';
    reponse = '';
    dialogue = false;

    ngOnInit(): void {
        this.chargerCategories();
        this.charger();
    }

    libelleStatut(s: StatutReclamation): string {
        return LIBELLES_STATUT[s] ?? s;
    }

    severiteStatut(s: StatutReclamation): 'danger' | 'warn' | 'success' {
        return SEVERITES_STATUT[s] ?? 'warn';
    }

    optionsCategorie(): CategorieReclamation[] {
        return this.categories();
    }

    filtrees(): ReclamationVue[] {
        const lignes = this.file()?.reclamations ?? [];
        const q = this.recherche.trim().toLowerCase();
        if (!q) return lignes;
        return lignes.filter((r) => [r.objet, r.message, r.auteur, r.auteurPointVente, r.codCliente, r.categorieLibelle].some((v) => (v || '').toLowerCase().includes(q)));
    }

    /** Un deuxième clic sur la même carte enlève le filtre : c'est ce qu'on attend d'une bascule. */
    filtrerStatut(s: StatutReclamation): void {
        this.statut = this.statut === s ? null : s;
        this.charger();
    }

    toutVoir(): void {
        this.statut = null;
        this.categorie = null;
        this.charger();
    }

    charger(): void {
        this.loading.set(true);
        this.service
            .file(this.statut, this.categorie)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.file.set(((r.data as any)?.file as FileReclamations) ?? null);
                    this.loading.set(false);
                },
                error: (err) => {
                    this.loading.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Réclamations', detail: err || 'Lecture impossible', life: 6000 });
                }
            });
    }

    private chargerCategories(): void {
        this.service
            .categories()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => this.categories.set(((r.data as any)?.categories as CategorieReclamation[]) ?? []),
                error: () => this.categories.set([])
            });
    }

    ouvrir(r: ReclamationVue): void {
        this.choisie.set(r);
        this.reponse = '';
        this.dialogue = true;
    }

    prendreEnCharge(r: ReclamationVue): void {
        this.enAction.set(r.id);
        this.service
            .prendreEnCharge(r.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.enAction.set(null);
                    this.messageService.add({ severity: 'success', summary: 'Prise en charge', detail: 'Votre nom est désormais sur cette réclamation.', life: 4000 });
                    this.charger();
                },
                error: (err) => {
                    this.enAction.set(null);
                    // Le cas courant : quelqu'un d'autre l'a prise entre-temps. Le serveur le dit.
                    this.messageService.add({ severity: 'warn', summary: 'Prise en charge', detail: err || 'Impossible', life: 7000 });
                    this.charger();
                }
            });
    }

    repondre(): void {
        const r = this.choisie();
        if (!r || this.reponse.trim().length < 2) return;
        this.enAction.set(r.id);
        this.service
            .repondre(r.id, this.reponse.trim())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.enAction.set(null);
                    this.dialogue = false;
                    this.reponse = '';
                    this.messageService.add({ severity: 'success', summary: 'Réponse enregistrée', detail: "Elle s'affichera sur le téléphone de l'agent.", life: 5000 });
                    this.charger();
                },
                error: (err) => {
                    this.enAction.set(null);
                    this.messageService.add({ severity: 'error', summary: 'Réponse', detail: err || 'Enregistrement impossible', life: 7000 });
                }
            });
    }
}
