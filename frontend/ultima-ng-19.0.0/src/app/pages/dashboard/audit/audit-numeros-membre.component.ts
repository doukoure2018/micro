import { CorrectionNumero } from '@/interface/audit';
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
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

/**
 * Corrections de numéro de membre (Audit, lot 2).
 *
 * Le numéro de membre identifie le client d'un crédit. Depuis le 28 octobre, l'agent qui porte
 * le dossier et son directeur d'agence peuvent le corriger, après confrontation du nouveau
 * numéro à SAF, et chaque correction laisse une trace nominative. Cet écran lit cette trace.
 */
@Component({
    selector: 'app-audit-numeros-membre',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, TableModule, TagModule, ToastModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>
        <div class="card">
            <div class="flex flex-wrap justify-between items-center gap-3 mb-2">
                <h2 class="text-xl font-bold m-0">Corrections de numéro de membre</h2>
                <button pButton icon="pi pi-refresh" class="p-button-text" (click)="charger()" [loading]="loading()"></button>
            </div>
            <p class="text-sm text-gray-500 mb-3">
                Le numéro de membre identifie le client d'un crédit : le changer doit pouvoir s'expliquer plus tard.
                Chaque ligne porte l'ancien numéro, le nouveau, le nom que SAF a renvoyé au moment de la correction, son auteur et son motif.
                La trace commence le 28 octobre 2026, date d'ouverture de la correction.
            </p>

            <div class="flex flex-wrap gap-3 items-center mb-3">
                <input pInputText type="text" [(ngModel)]="recherche" placeholder="Client, numéro, auteur…" class="w-72" />
                <span class="text-sm text-gray-500">{{ filtrees().length }} correction(s)</span>
                <button pButton icon="pi pi-file-excel" label="Exporter Excel" class="p-button-success p-button-outlined ml-auto" [loading]="exportEnCours()" [disabled]="!lignes().length" (click)="exporter()"></button>
            </div>

            <p-table [value]="filtrees()" [loading]="loading()" styleClass="p-datatable-sm" [paginator]="filtrees().length > 25" [rows]="25" responsiveLayout="scroll">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Date</th>
                        <th>Dossier</th>
                        <th>Client</th>
                        <th>Ancien numéro</th>
                        <th>Nouveau numéro</th>
                        <th>Nom rendu par SAF</th>
                        <th>Agence SAF</th>
                        <th>Motif</th>
                        <th>Corrigé par</th>
                        <th>Point de service</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-c>
                    <tr>
                        <td class="text-xs whitespace-nowrap">{{ c.dateCorrection | date: 'dd/MM/yyyy HH:mm' }}</td>
                        <td class="font-mono">{{ c.demandeId }}</td>
                        <td>{{ c.client }}</td>
                        <td class="font-mono text-xs text-red-600">{{ c.ancienNumero || '—' }}</td>
                        <td class="font-mono text-xs font-semibold text-green-700">{{ c.nouveauNumero }}</td>
                        <td class="text-xs">{{ c.nomSaf }}</td>
                        <td class="text-xs">{{ c.agenceSaf }}</td>
                        <td class="text-xs">{{ c.motif }}</td>
                        <td class="text-xs">{{ c.parNom }}<div class="text-gray-500" *ngIf="c.parRole">{{ c.parRole }}</div></td>
                        <td class="text-xs">{{ c.pointVente }}<div class="text-gray-500" *ngIf="c.agence">{{ c.agence }}</div></td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr>
                        <td colspan="10" class="text-center text-gray-500 py-6">
                            <span *ngIf="!lignes().length">Aucune correction enregistrée. La fonction est ouverte depuis le 28 octobre 2026 : cet écran restera vide jusqu'à la première correction.</span>
                            <span *ngIf="lignes().length">Aucune correction ne correspond à cette recherche.</span>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
export class AuditNumerosMembreComponent implements OnInit {
    private readonly userService = inject(UserService);
    private readonly messageService = inject(MessageService);
    private readonly destroyRef = inject(DestroyRef);

    lignes = signal<CorrectionNumero[]>([]);
    loading = signal(false);
    exportEnCours = signal(false);
    recherche = '';

    filtrees(): CorrectionNumero[] {
        const q = this.recherche.trim().toLowerCase();
        if (!q) return this.lignes();
        return this.lignes().filter((c) =>
            [c.client, c.ancienNumero, c.nouveauNumero, c.nomSaf, c.parNom, c.motif, c.pointVente]
                .some((v) => (v || '').toLowerCase().includes(q))
        );
    }

    ngOnInit(): void {
        this.charger();
    }

    charger(): void {
        this.loading.set(true);
        this.userService
            .getAuditNumerosMembre$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.lignes.set(((r.data as any)?.corrections as CorrectionNumero[]) || []);
                    this.loading.set(false);
                },
                error: (err) => {
                    this.loading.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Corrections de numéro', detail: err || 'Lecture impossible', life: 6000 });
                }
            });
    }

    exporter(): void {
        this.exportEnCours.set(true);
        this.userService
            .exportAuditNumerosMembre$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (reponse: HttpResponse<Blob>) => {
                    this.exportEnCours.set(false);
                    const disposition = reponse.headers.get('Content-Disposition') || '';
                    const nom = /filename="?([^";]+)"?/.exec(disposition)?.[1] || 'Audit_corrections_numero.xlsx';
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
