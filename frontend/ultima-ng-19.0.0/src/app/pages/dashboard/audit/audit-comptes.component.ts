import { CompteAudit, ComptesAudit } from '@/interface/audit';
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
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

type Vue = 'COMPTES' | 'BLOCAGES' | 'HABILITATIONS' | 'MATRICE';

/**
 * Comptes et habilitations (Audit, lot 2).
 *
 * Quatre lectures en un écran : qui a un compte et dans quel état, qui a bloqué ou réactivé qui
 * et pourquoi, qui a ouvert ou fermé quel écran à quel département, et l'état de la matrice.
 * Les deux journaux existaient depuis fin octobre sans qu'aucun écran ne les affiche.
 */
@Component({
    selector: 'app-audit-comptes',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, SelectButtonModule, TableModule, TagModule, ToastModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>
        <div class="card">
            <div class="flex flex-wrap justify-between items-center gap-3 mb-2">
                <h2 class="text-xl font-bold m-0">Comptes et habilitations</h2>
                <button pButton icon="pi pi-refresh" class="p-button-text" (click)="charger()" [loading]="loading()"></button>
            </div>

            @if (data(); as d) {
            <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Comptes</div>
                    <div class="text-xl font-bold">{{ d.nbComptes | number }}</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Actifs</div>
                    <div class="text-xl font-bold text-green-700">{{ d.nbActifs | number }}</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Bloqués</div>
                    <div class="text-xl font-bold" [class.text-red-600]="d.nbBloques > 0">{{ d.nbBloques | number }}</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Jamais connectés</div>
                    <div class="text-xl font-bold" [class.text-orange-600]="d.nbJamaisConnectes > 0">{{ d.nbJamaisConnectes | number }}</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Inactifs 90 jours</div>
                    <div class="text-xl font-bold" [class.text-orange-600]="d.nbSansConnexionDepuis90Jours > 0">{{ d.nbSansConnexionDepuis90Jours | number }}</div>
                </div>
            </div>

            <div class="flex flex-wrap gap-3 items-center mb-3">
                <p-selectButton [options]="vueOptions" [ngModel]="vue()" (ngModelChange)="vue.set($event)" optionLabel="label" optionValue="value" [allowEmpty]="false"></p-selectButton>
                <input *ngIf="vue() === 'COMPTES'" pInputText type="text" [(ngModel)]="recherche" placeholder="Nom, courriel, service…" class="w-72" />
                <button pButton icon="pi pi-file-excel" label="Exporter Excel" class="p-button-success p-button-outlined ml-auto" [loading]="exportEnCours()" (click)="exporter()" pTooltip="Quatre feuilles : comptes, blocages, habilitations, matrice"></button>
            </div>

            @if (vue() === 'COMPTES') {
            <p-table [value]="comptesFiltres()" styleClass="p-datatable-sm" [paginator]="comptesFiltres().length > 50" [rows]="50" responsiveLayout="scroll">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Nom</th><th>Rôle</th><th>Service</th><th>Département</th><th>Rattachement</th>
                        <th>État</th><th>Dernière connexion</th><th>Contacts</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-c>
                    <tr [class.bg-gray-50]="!c.actif">
                        <td>{{ c.nom }}<div class="text-xs text-gray-500">{{ c.email }}<span *ngIf="c.telephone"> · {{ c.telephone }}</span></div></td>
                        <td class="text-xs">{{ c.role }}</td>
                        <td class="text-xs">{{ c.service }}</td>
                        <td class="text-xs">{{ c.departement || '—' }}</td>
                        <td class="text-xs">{{ c.pointVente || c.agence || c.delegation || '—' }}<div class="text-gray-500" *ngIf="c.pointVente && c.agence">{{ c.agence }}</div></td>
                        <td><p-tag [value]="c.actif ? 'actif' : 'bloqué'" [severity]="c.actif ? 'success' : 'danger'"></p-tag></td>
                        <td class="text-xs">
                            <span *ngIf="c.derniereConnexion">{{ c.derniereConnexion | date: 'dd/MM/yyyy' }}</span>
                            <span *ngIf="!c.derniereConnexion" class="text-orange-600">jamais</span>
                            <div class="text-gray-500" *ngIf="c.joursSansConnexion !== null && c.joursSansConnexion >= 90">{{ c.joursSansConnexion }} jours</div>
                        </td>
                        <td class="text-xs">
                            <p-tag *ngIf="c.contactsACorriger" value="correction imposée" severity="warn"></p-tag>
                            <span *ngIf="!c.contactsACorriger">
                                <span [class.text-green-700]="c.emailVerifie" [class.text-gray-400]="!c.emailVerifie">courriel</span> ·
                                <span [class.text-green-700]="c.telephoneVerifie" [class.text-gray-400]="!c.telephoneVerifie">tél.</span>
                            </span>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage"><tr><td colspan="8" class="text-center text-gray-500 py-4">Aucun compte pour cette recherche.</td></tr></ng-template>
            </p-table>
            }

            @if (vue() === 'BLOCAGES') {
            <p class="text-sm text-gray-500 mb-3">Qui a bloqué, débloqué, activé ou désactivé quel compte, quand et pourquoi. La trace commence le 26 octobre 2026.</p>
            <p-table [value]="d.journalComptes" styleClass="p-datatable-sm" [paginator]="d.journalComptes.length > 25" [rows]="25">
                <ng-template pTemplate="header"><tr><th>Date</th><th>Compte</th><th>Action</th><th>Motif</th><th>Par</th></tr></ng-template>
                <ng-template pTemplate="body" let-t>
                    <tr>
                        <td class="text-xs whitespace-nowrap">{{ t.dateAction | date: 'dd/MM/yyyy HH:mm' }}</td>
                        <td>{{ t.compte }}</td>
                        <td><p-tag [value]="t.action" [severity]="t.action === 'BLOQUER' || t.action === 'DESACTIVER' ? 'danger' : 'success'"></p-tag></td>
                        <td class="text-xs">{{ t.motif }}</td>
                        <td class="text-xs">{{ t.parNom }}</td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage"><tr><td colspan="5" class="text-center text-gray-500 py-4">Aucun blocage enregistré.</td></tr></ng-template>
            </p-table>
            }

            @if (vue() === 'HABILITATIONS') {
            <p class="text-sm text-gray-500 mb-3">Qui a ouvert ou fermé quel écran à quel département, et les bascules de réglage. La trace commence le 25 octobre 2026.</p>
            <p-table [value]="d.journalHabilitations" styleClass="p-datatable-sm" [paginator]="d.journalHabilitations.length > 25" [rows]="25">
                <ng-template pTemplate="header"><tr><th>Date</th><th>Action</th><th>Service</th><th>Département</th><th>Rubrique</th><th>Avant</th><th>Après</th><th>Par</th></tr></ng-template>
                <ng-template pTemplate="body" let-t>
                    <tr>
                        <td class="text-xs whitespace-nowrap">{{ t.dateAction | date: 'dd/MM/yyyy HH:mm' }}</td>
                        <td><p-tag [value]="t.action" [severity]="t.action === 'ACCORDER' ? 'success' : t.action === 'RETIRER' ? 'danger' : 'info'"></p-tag></td>
                        <td class="text-xs">{{ t.service }}</td>
                        <td class="text-xs">{{ t.departement }}</td>
                        <td class="text-xs">{{ t.rubriqueLibelle || t.rubriqueCode }}</td>
                        <td class="text-xs text-gray-500">{{ t.valeurAvant }}</td>
                        <td class="text-xs">{{ t.valeurApres }}</td>
                        <td class="text-xs">{{ t.parNom }}</td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage"><tr><td colspan="8" class="text-center text-gray-500 py-4">Aucun réglage enregistré.</td></tr></ng-template>
            </p-table>
            }

            @if (vue() === 'MATRICE') {
            <p class="text-sm mb-3" [class.text-orange-700]="!d.parDepartementActif">
                Réglage par département <b>{{ d.parDepartementActif ? 'actif' : 'encore fermé' }}</b>.
                <span *ngIf="!d.parDepartementActif"> Tant qu'il est fermé, un responsable de service garde toutes les rubriques de son service, quelles que soient les cases.</span>
            </p>
            <p-table [value]="d.matrice" styleClass="p-datatable-sm" [rowGroupMode]="'subheader'" groupRowsBy="service">
                <ng-template pTemplate="header"><tr><th>Département</th><th>Code</th><th class="text-right">Comptes</th><th>Voit tout</th><th>Rubriques accordées</th></tr></ng-template>
                <ng-template pTemplate="groupheader" let-m><tr><td colspan="5" class="font-bold bg-gray-50">{{ m.service }}</td></tr></ng-template>
                <ng-template pTemplate="body" let-m>
                    <tr>
                        <td>{{ m.libelle }}</td>
                        <td class="text-xs font-mono">{{ m.code }}</td>
                        <td class="text-right">{{ m.nbComptes }}</td>
                        <td><p-tag *ngIf="m.toutVoir" value="oui" severity="info"></p-tag></td>
                        <td class="text-xs">{{ m.rubriques.length ? m.rubriques.join(', ') : (m.toutVoir ? 'toutes, par « voit tout »' : '—') }}</td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage"><tr><td colspan="5" class="text-center text-gray-500 py-4">Aucun département.</td></tr></ng-template>
            </p-table>
            }
            } @else if (!loading()) {
            <p class="text-gray-500">Aucune donnée.</p>
            }
        </div>
    `
})
export class AuditComptesComponent implements OnInit {
    private readonly userService = inject(UserService);
    private readonly messageService = inject(MessageService);
    private readonly destroyRef = inject(DestroyRef);

    data = signal<ComptesAudit | null>(null);
    loading = signal(false);
    exportEnCours = signal(false);
    vue = signal<Vue>('COMPTES');
    recherche = '';
    vueOptions = [
        { label: 'Comptes', value: 'COMPTES' },
        { label: 'Blocages', value: 'BLOCAGES' },
        { label: 'Habilitations', value: 'HABILITATIONS' },
        { label: 'Matrice', value: 'MATRICE' }
    ];

    comptesFiltres(): CompteAudit[] {
        const d = this.data();
        if (!d) return [];
        const q = this.recherche.trim().toLowerCase();
        if (!q) return d.comptes;
        return d.comptes.filter((c) =>
            [c.nom, c.email, c.service, c.role, c.pointVente, c.agence, c.departement]
                .some((v) => (v || '').toLowerCase().includes(q))
        );
    }

    ngOnInit(): void {
        this.charger();
    }

    charger(): void {
        this.loading.set(true);
        this.userService
            .getAuditComptes$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.data.set(((r.data as any)?.comptes as ComptesAudit) || null);
                    this.loading.set(false);
                },
                error: (err) => {
                    this.loading.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Comptes et habilitations', detail: err || 'Lecture impossible', life: 6000 });
                }
            });
    }

    exporter(): void {
        this.exportEnCours.set(true);
        this.userService
            .exportAuditComptes$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (reponse: HttpResponse<Blob>) => {
                    this.exportEnCours.set(false);
                    const disposition = reponse.headers.get('Content-Disposition') || '';
                    const nom = /filename="?([^";]+)"?/.exec(disposition)?.[1] || 'Audit_comptes_habilitations.xlsx';
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
}
