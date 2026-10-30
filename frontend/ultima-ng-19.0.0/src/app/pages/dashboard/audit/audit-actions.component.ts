import { ActionSensible, CompteurAudit, PageAudit } from '@/interface/audit';
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
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

/**
 * Journal des actions sensibles (Audit, lot 3).
 *
 * La plateforme tenait huit journaux séparés, chacun lisible dans un écran différent ou dans
 * aucun : les décisions du circuit, les corrections de numéro de membre, les blocages de
 * comptes, les réglages d'habilitations, les affectations de portefeuille, les signalements de
 * téléphone, les crédits négatifs pris en charge, et depuis ce lot les consultations de l'Audit
 * lui-même. Un auditeur qui veut savoir ce qui s'est passé un jour donné, ou ce qu'un compte a
 * fait, les lit ici d'un seul coup. La colonne « Origine » nomme la table d'où vient la ligne :
 * personne n'a à deviner, et chaque ligne reste vérifiable à la source.
 */
@Component({
    selector: 'app-audit-actions',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, SelectModule, TableModule, TagModule, ToastModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>
        <div class="card">
            <div class="flex flex-wrap justify-between items-center gap-3 mb-2">
                <h2 class="text-xl font-bold m-0">Actions sensibles</h2>
                <button pButton icon="pi pi-refresh" class="p-button-text" (click)="tout()" [loading]="loading()"></button>
            </div>
            <p class="text-sm text-gray-500 mb-3">
                Huit journaux réunis en une seule liste, du plus récent au plus ancien. Lecture seule. Chaque ligne garde le vocabulaire de son
                journal d'origine, nommé dans la dernière colonne, pour rester vérifiable à la source.
            </p>

            @if (parType().length) {
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div class="border rounded p-3 cursor-pointer hover:bg-gray-50" *ngFor="let t of parType()" (click)="filtrerType(t.cle)">
                    <div class="text-xs text-gray-500 uppercase">{{ libelleType(t.cle) }}</div>
                    <div class="text-xl font-bold">{{ t.nombre | number }}</div>
                </div>
            </div>
            }

            <div class="flex flex-wrap gap-3 items-center mb-3">
                <p-select
                    [options]="typeOptions"
                    [(ngModel)]="type"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Tous les types"
                    [showClear]="true"
                    styleClass="w-64"
                    appendTo="body"
                    (onChange)="charger(0)"
                ></p-select>
                <input pInputText type="text" [(ngModel)]="compte" placeholder="Auteur" class="w-48" (keyup.enter)="charger(0)" />
                <input pInputText type="text" [(ngModel)]="recherche" placeholder="Objet ou détail" class="w-56" (keyup.enter)="charger(0)" />
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
                currentPageReportTemplate="{first} à {last} sur {totalRecords} actions"
                [showCurrentPageReport]="true"
            >
                <ng-template pTemplate="header">
                    <tr>
                        <th style="width:11rem">Date et heure</th>
                        <th style="width:11rem">Type</th>
                        <th>Auteur</th>
                        <th>Objet</th>
                        <th>Ce qui a changé</th>
                        <th style="width:14rem">Origine</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-a>
                    <tr>
                        <td class="whitespace-nowrap">{{ a.quand | date: 'dd/MM/yyyy HH:mm' }}</td>
                        <td><p-tag [value]="libelleType(a.type)" [severity]="severite(a.type)"></p-tag></td>
                        <td>{{ a.compte || '—' }}</td>
                        <td>{{ a.objet || '—' }}</td>
                        <td class="text-sm">{{ a.detail || '—' }}</td>
                        <td class="text-xs text-gray-500">{{ a.origine }}</td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr>
                        <td colspan="6" class="text-center text-gray-500 py-4">Aucune action pour ces critères.</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
export class AuditActionsComponent implements OnInit {
    private readonly userService = inject(UserService);
    private readonly messageService = inject(MessageService);
    private readonly destroyRef = inject(DestroyRef);

    readonly page = signal<PageAudit<ActionSensible> | null>(null);
    readonly parType = signal<CompteurAudit[]>([]);
    readonly loading = signal(false);
    readonly exportEnCours = signal(false);

    type: string | null = null;
    compte: string | null = null;
    recherche: string | null = null;
    du: string | null = null;
    au: string | null = null;
    taille = 50;

    typeOptions = [
        { label: 'Décisions de crédit', value: 'DECISION' },
        { label: 'Affectations de portefeuille', value: 'AFFECTATION' },
        { label: 'Corrections de numéro', value: 'CORRECTION_NUMERO' },
        { label: 'Comptes', value: 'COMPTE' },
        { label: 'Habilitations', value: 'HABILITATION' },
        { label: 'Signalements de téléphone', value: 'SIGNALEMENT' },
        { label: 'Crédits négatifs', value: 'CREDIT_NEGATIF' },
        { label: 'Consultations de l’Audit', value: 'CONSULTATION' }
    ];

    ngOnInit(): void {
        this.tout();
    }

    tout(): void {
        this.chargerSynthese();
        this.charger(0);
    }

    private chargerSynthese(): void {
        this.userService
            .getAuditActionsSynthese$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => this.parType.set(((r.data as any)?.parType as CompteurAudit[]) || []),
                error: () => {}
            });
    }

    charger(page: number): void {
        this.loading.set(true);
        this.userService
            .getAuditActions$(this.filtres(), page, this.taille)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.page.set(((r.data as any)?.actions as PageAudit<ActionSensible>) || null);
                    this.loading.set(false);
                },
                error: (err) => {
                    this.loading.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Actions sensibles', detail: err || 'Lecture impossible', life: 6000 });
                }
            });
    }

    surPage(e: any): void {
        const nouvelleTaille = e?.rows || this.taille;
        const page = Math.floor((e?.first || 0) / nouvelleTaille);
        this.taille = nouvelleTaille;
        this.charger(page);
    }

    filtrerType(type: string): void {
        this.type = this.type === type ? null : type;
        this.charger(0);
    }

    effacer(): void {
        this.type = null;
        this.compte = null;
        this.recherche = null;
        this.du = null;
        this.au = null;
        this.charger(0);
    }

    exporter(): void {
        this.exportEnCours.set(true);
        this.userService
            .exportAuditActions$(this.filtres())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (reponse: HttpResponse<Blob>) => {
                    this.exportEnCours.set(false);
                    const disposition = reponse.headers.get('Content-Disposition') || '';
                    const nom = /filename="?([^";]+)"?/.exec(disposition)?.[1] || 'Audit_actions_sensibles.xlsx';
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
        return { type: this.type, compte: this.compte, recherche: this.recherche, du: this.du, au: this.au };
    }

    libelleType(t: string): string {
        return this.typeOptions.find((o) => o.value === t)?.label || t;
    }

    severite(t: string): 'info' | 'success' | 'warn' | 'danger' | 'secondary' {
        if (t === 'COMPTE' || t === 'HABILITATION') return 'danger';
        if (t === 'CORRECTION_NUMERO' || t === 'CREDIT_NEGATIF') return 'warn';
        if (t === 'DECISION') return 'info';
        if (t === 'CONSULTATION') return 'secondary';
        return 'success';
    }
}
