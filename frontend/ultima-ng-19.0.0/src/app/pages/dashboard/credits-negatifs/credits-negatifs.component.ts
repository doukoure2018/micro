import { LigneCreditNegatif, SituationCreditsNegatifs } from '@/interface/credit-negatif';
import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

/**
 * Crédits à solde négatif dans SAF (V177, lot 2). Réservé au service DSIG.
 *
 * La page montre TOUS les états, l'état écrit en clair plutôt qu'en code SAF : masquer les
 * apurés ferait disparaître de l'écran le stock que personne ne traite parce que personne ne
 * le voit. L'alerte par courriel, elle, ne porte que sur les crédits en cours.
 *
 * digi lit SAF, il n'y écrit pas : la correction se fait dans SAF, la page suit qui s'en occupe.
 */
@Component({
    selector: 'app-credits-negatifs',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, DialogModule, InputTextModule, SelectButtonModule, TableModule, TagModule, TextareaModule, ToastModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>
        <div class="card">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                    <h2 class="text-xl font-semibold m-0">Crédits négatifs</h2>
                    <div class="text-sm text-gray-500">
                        Crédits dont le solde SAF est inférieur à zéro, relevés dans la base de production.
                        <span *ngIf="data()?.dernierPassage as d">Dernière détection le {{ d | date: 'dd/MM/yyyy à HH:mm' }}.</span>
                    </div>
                </div>
                <div class="flex flex-wrap gap-2 items-center">
                    <button pButton icon="pi pi-refresh" class="p-button-text" (click)="charger()" [loading]="loading()" pTooltip="Recharger"></button>
                    <button pButton icon="pi pi-file-excel" label="Exporter Excel" class="p-button-success p-button-outlined" [loading]="exportEnCours()" [disabled]="!data()" (click)="exporter()"></button>
                </div>
            </div>

            <ng-container *ngIf="data() as d">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div class="border rounded p-3">
                        <div class="text-xs text-gray-500 uppercase">Crédits négatifs ouverts</div>
                        <div class="text-2xl font-bold text-red-600">{{ d.nbOuverts }}</div>
                        <div class="text-xs text-gray-500">{{ d.montantOuvert | number: '1.0-0' }} GNF</div>
                    </div>
                    <div class="border rounded p-3">
                        <div class="text-xs text-gray-500 uppercase">Sans prise en charge</div>
                        <div class="text-2xl font-bold" [class.text-red-600]="d.nbNonTraites > 0">{{ d.nbNonTraites }}</div>
                        <div class="text-xs text-gray-500">personne ne s'en occupe encore</div>
                    </div>
                    <div class="border rounded p-3">
                        <div class="text-xs text-gray-500 uppercase">Détectés aujourd'hui</div>
                        <div class="text-2xl font-bold">{{ d.nbDetectesAujourdhui }}</div>
                    </div>
                    <div class="border rounded p-3">
                        <div class="text-xs text-gray-500 uppercase">Corrigés ce mois</div>
                        <div class="text-2xl font-bold text-green-700">{{ d.nbCorrigesCeMois }}</div>
                    </div>
                </div>

                <div class="flex flex-wrap items-center gap-3 mb-3">
                    <p-selectButton [options]="filtresEtat()" [ngModel]="filtreEtat()" (ngModelChange)="filtreEtat.set($event)" optionLabel="label" optionValue="value" styleClass="text-sm"></p-selectButton>
                    <p-selectButton [options]="filtresSuivi" [ngModel]="filtreSuivi()" (ngModelChange)="filtreSuivi.set($event)" optionLabel="label" optionValue="value" styleClass="text-sm"></p-selectButton>
                    <div class="flex items-center gap-2 text-sm">
                        <input type="checkbox" id="corriges" [checked]="inclureCorriges()" (change)="basculerCorriges()" />
                        <label for="corriges">Afficher aussi les crédits corrigés</label>
                    </div>
                    <input pInputText type="text" [ngModel]="recherche()" (ngModelChange)="recherche.set($event)" placeholder="Client, crédit, point de service" class="w-72" />
                </div>

                <div class="text-sm text-gray-500 mb-2" *ngIf="d.message">{{ d.message }}</div>

                <p-table [value]="lignesFiltrees()" styleClass="p-datatable-sm" [paginator]="lignesFiltrees().length > 25" [rows]="25" [scrollable]="true">
                    <ng-template pTemplate="header">
                        <tr>
                            <th>Point de service</th>
                            <th>Crédit</th>
                            <th>Client</th>
                            <th class="text-right">Octroyé</th>
                            <th class="text-right">Solde</th>
                            <th>Ouvert le</th>
                            <th>État</th>
                            <th>Agent SAF</th>
                            <th>Suivi</th>
                            <th></th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-c>
                        <tr [class.opacity-60]="c.corrigeAt">
                            <td>{{ c.desAgencia }} <span class="text-xs text-gray-400">({{ c.codAgencia }})</span></td>
                            <td class="font-mono">{{ c.numCredito }}</td>
                            <td>{{ c.nomCliente }} <span class="text-xs text-gray-400">({{ c.codCliente }})</span></td>
                            <td class="text-right">{{ c.monCredito | number: '1.0-0' }}</td>
                            <td class="text-right font-medium text-red-600">{{ c.monSaldo | number: '1.0-0' }}</td>
                            <td>{{ c.fecApertura | date: 'dd/MM/yyyy' }}</td>
                            <td><p-tag [value]="c.etat" [severity]="severiteEtat(c)"></p-tag></td>
                            <td class="text-xs">{{ c.codEjecutivo }}</td>
                            <td>
                                <span *ngIf="c.corrigeAt" class="text-green-700 text-xs">Corrigé le {{ c.corrigeAt | date: 'dd/MM' }}</span>
                                <span *ngIf="!c.corrigeAt && c.traiteAt" class="text-xs">{{ c.traitePar }} · {{ c.traiteAt | date: 'dd/MM' }}</span>
                                <span *ngIf="!c.corrigeAt && !c.traiteAt" class="text-xs text-gray-400">à traiter</span>
                                <div class="text-xs text-gray-500" *ngIf="c.commentaire">{{ c.commentaire }}</div>
                            </td>
                            <td>
                                <button *ngIf="!c.corrigeAt && !c.traiteAt" pButton icon="pi pi-user-plus" class="p-button-text p-button-sm" (click)="ouvrirSuivi(c)" pTooltip="Je m'en occupe"></button>
                                <button *ngIf="!c.corrigeAt && c.traiteAt" pButton icon="pi pi-times" class="p-button-text p-button-sm" (click)="retirerSuivi(c)" pTooltip="Retirer la prise en charge"></button>
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr><td colspan="10" class="text-center text-gray-500 py-4">Aucun crédit négatif pour ce filtre.</td></tr>
                    </ng-template>
                </p-table>

                <div class="text-sm text-gray-500 mt-3" *ngIf="d.parEtat.length">
                    Répartition des crédits ouverts :
                    <span *ngFor="let e of d.parEtat; let i = index">
                        {{ i > 0 ? ' · ' : '' }}{{ e.libelle }} {{ e.nb }} ({{ e.montant | number: '1.0-0' }} GNF)
                    </span>
                </div>
                <div class="text-xs text-gray-500 mt-2">
                    digi lit SAF, il n'y écrit pas : la correction se fait dans SAF. La prise en charge notée ici
                    sert seulement à éviter que deux personnes travaillent le même crédit.
                </div>
            </ng-container>

            <div *ngIf="!data() && !loading()" class="text-gray-500">Aucune donnée.</div>
        </div>

        <p-dialog header="Prise en charge" [visible]="showSuivi()" (visibleChange)="!$event && showSuivi.set(false)" [modal]="true" [style]="{ width: '520px' }">
            <p class="text-sm m-0 mb-2" *ngIf="ligneSuivi() as c">
                Crédit <strong>{{ c.numCredito }}</strong> — {{ c.nomCliente }}, solde {{ c.monSaldo | number: '1.0-0' }} GNF.
            </p>
            <textarea pTextarea [ngModel]="commentaire()" (ngModelChange)="commentaire.set($event)" rows="3" class="w-full" placeholder="Ce qui a été constaté, ce qui reste à faire dans SAF (facultatif)"></textarea>
            <ng-template pTemplate="footer">
                <button pButton label="Annuler" class="p-button-text" (click)="showSuivi.set(false)"></button>
                <button pButton label="Je m'en occupe" icon="pi pi-check" (click)="confirmerSuivi()" [loading]="enregistrement()"></button>
            </ng-template>
        </p-dialog>
    `
})
export class CreditsNegatifsComponent implements OnInit {
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

    data = signal<SituationCreditsNegatifs | null>(null);
    loading = signal(false);
    exportEnCours = signal(false);
    enregistrement = signal(false);
    inclureCorriges = signal(false);

    filtreEtat = signal<string>('TOUS');
    filtreSuivi = signal<string>('TOUS');
    recherche = signal('');

    showSuivi = signal(false);
    ligneSuivi = signal<LigneCreditNegatif | null>(null);
    commentaire = signal('');

    filtresSuivi = [
        { label: 'Tous', value: 'TOUS' },
        { label: 'À traiter', value: 'A_TRAITER' },
        { label: 'Pris en charge', value: 'PRIS' }
    ];

    filtresEtat = computed(() => {
        const etats = this.data()?.parEtat ?? [];
        return [{ label: 'Tous les états', value: 'TOUS' }, ...etats.map((e) => ({ label: `${e.libelle} (${e.nb})`, value: e.libelle }))];
    });

    lignesFiltrees = computed(() => {
        const d = this.data();
        if (!d) return [];
        const etat = this.filtreEtat();
        const suivi = this.filtreSuivi();
        const q = this.recherche().trim().toLowerCase();
        return d.lignes.filter((l) => {
            if (etat !== 'TOUS' && l.etat !== etat) return false;
            if (suivi === 'A_TRAITER' && (l.traiteAt || l.corrigeAt)) return false;
            if (suivi === 'PRIS' && !l.traiteAt) return false;
            if (!q) return true;
            return [l.nomCliente, l.codCliente, l.desAgencia, l.codAgencia, String(l.numCredito), l.codEjecutivo]
                .some((v) => (v || '').toLowerCase().includes(q));
        });
    });

    ngOnInit(): void {
        this.charger();
    }

    charger(): void {
        this.loading.set(true);
        this.userService
            .getCreditsNegatifs$(this.inclureCorriges())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res: IResponse) => {
                    this.data.set((res.data as any)?.situation ?? null);
                    this.loading.set(false);
                },
                error: (err: any) => {
                    this.loading.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Chargement', detail: err?.message || err || 'Lecture impossible', life: 6000 });
                }
            });
    }

    basculerCorriges(): void {
        this.inclureCorriges.set(!this.inclureCorriges());
        this.charger();
    }

    severiteEtat(c: LigneCreditNegatif): 'danger' | 'warn' | 'info' | 'secondary' {
        if (c.indEstado === 'I') return 'secondary';
        if (c.indEstado === 'J') return 'warn';
        return 'danger';
    }

    ouvrirSuivi(c: LigneCreditNegatif): void {
        this.ligneSuivi.set(c);
        this.commentaire.set('');
        this.showSuivi.set(true);
    }

    confirmerSuivi(): void {
        const c = this.ligneSuivi();
        if (!c) return;
        this.enregistrement.set(true);
        this.userService
            .suiviCreditNegatif$(c.id, this.commentaire() || null, true)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res: IResponse) => {
                    this.enregistrement.set(false);
                    this.showSuivi.set(false);
                    this.messageService.add({ severity: 'success', summary: 'Suivi', detail: res.message || 'Enregistré' });
                    this.charger();
                },
                error: (err: any) => {
                    this.enregistrement.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Suivi', detail: err?.message || err || 'Enregistrement impossible', life: 6000 });
                }
            });
    }

    retirerSuivi(c: LigneCreditNegatif): void {
        this.userService
            .suiviCreditNegatif$(c.id, null, false)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.messageService.add({ severity: 'info', summary: 'Suivi', detail: 'Prise en charge retirée' });
                    this.charger();
                },
                error: (err: any) => this.messageService.add({ severity: 'error', summary: 'Suivi', detail: err?.message || err || 'Action impossible', life: 6000 })
            });
    }

    exporter(): void {
        this.exportEnCours.set(true);
        this.userService
            .exportCreditsNegatifs$(this.inclureCorriges())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res: HttpResponse<Blob>) => {
                    this.exportEnCours.set(false);
                    const blob = res.body;
                    if (!blob) return;
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `Credits_negatifs_${new Date().toISOString().slice(0, 10)}.xlsx`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                },
                error: () => {
                    this.exportEnCours.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Export', detail: 'Export impossible' });
                }
            });
    }
}
