import { DossierInconnu, MembresInconnus, VerificationMembre } from '@/interface/membre-saf';
import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

/**
 * Membres et SAF (lot 3 du 26/10/2026). Deux usages sur une page :
 * verifier un numero de membre dans SAF production sans ouvrir une demande, et voir les
 * dossiers en cours de son perimetre dont SAF a confirme que le numero n'existe pas.
 * Le perimetre est decide par le serveur : agence pour le DA, delegation pour le DR, ses
 * propres dossiers pour l'agent, le reseau pour la direction.
 */
@Component({
    selector: 'app-membres-saf',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, ButtonModule, InputTextModule, TableModule, TagModule, ToastModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>

        <div class="card">
            <h2 class="text-xl font-semibold m-0">Vérifier un membre dans SAF</h2>
            <div class="text-sm text-gray-500 mb-3">Lecture dans la base de production : un client créé ce matin est reconnu tout de suite.</div>
            <form (ngSubmit)="verifier()" class="flex flex-wrap items-end gap-2">
                <div>
                    <label class="block text-xs text-gray-500 uppercase mb-1" for="numeroMembre">Numéro de membre (11 chiffres)</label>
                    <input pInputText id="numeroMembre" name="numeroMembre" [(ngModel)]="numero" inputmode="numeric" maxlength="11"
                           class="w-64" placeholder="Ex. 32300214937" (ngModelChange)="resultat.set(null)" />
                </div>
                <button pButton type="submit" label="Vérifier" icon="pi pi-search" [loading]="enCours()" [disabled]="!numero"></button>
            </form>

            <div *ngIf="resultat() as r" class="mt-4 rounded p-3 border"
                 [ngClass]="{
                    'border-green-400 bg-green-50 text-green-900': r.etat === 'TROUVE',
                    'border-red-400 bg-red-50 text-red-900': r.etat === 'INCONNU' || r.etat === 'FORME_INVALIDE',
                    'border-orange-400 bg-orange-50 text-orange-900': r.etat === 'SAF_INDISPONIBLE'
                 }">
                <ng-container *ngIf="r.etat === 'TROUVE'">
                    <div class="text-lg font-semibold"><i class="pi pi-check-circle mr-2"></i>{{ r.nomClient }}</div>
                    <div class="text-sm mt-1">
                        N° {{ r.numero }}
                        <span *ngIf="r.agence"> · {{ r.agence }} ({{ r.codAgencia }})</span>
                        <span *ngIf="r.dateAdhesion"> · membre depuis le {{ r.dateAdhesion | date: 'dd/MM/yyyy' }}</span>
                        <span *ngIf="r.typePersonne"> · {{ r.typePersonne === 'J' ? 'personne morale' : 'personne physique' }}</span>
                        <span *ngIf="r.telephone"> · {{ r.telephone }}</span>
                    </div>
                </ng-container>
                <ng-container *ngIf="r.etat !== 'TROUVE'">
                    <div class="font-semibold"><i class="pi mr-2" [ngClass]="r.etat === 'SAF_INDISPONIBLE' ? 'pi-exclamation-triangle' : 'pi-times-circle'"></i>{{ r.message }}</div>
                </ng-container>
            </div>
        </div>

        <div class="card" *ngIf="liste() as l">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                    <h2 class="text-xl font-semibold m-0">Dossiers dont le numéro de membre est inconnu de SAF</h2>
                    <div class="text-sm text-gray-500">{{ l.perimetre }}, dossiers en cours seulement. La même liste que le courriel, à jour en permanence.</div>
                </div>
                <button pButton icon="pi pi-refresh" class="p-button-text" (click)="chargerListe()" [loading]="chargementListe()" pTooltip="Recharger"></button>
            </div>

            <div class="grid grid-cols-3 gap-3 mb-4">
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Vérifiés et trouvés</div>
                    <div class="text-2xl font-bold text-green-700">{{ l.trouves }}</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Inconnus de SAF</div>
                    <div class="text-2xl font-bold" [ngClass]="l.inconnus ? 'text-red-700' : ''">{{ l.inconnus }}</div>
                </div>
                <div class="border rounded p-3">
                    <div class="text-xs text-gray-500 uppercase">Encore à vérifier</div>
                    <div class="text-2xl font-bold text-gray-600">{{ l.aVerifier }}</div>
                    <div class="text-xs text-gray-500">repris chaque heure</div>
                </div>
            </div>

            <p-table [value]="l.dossiers" styleClass="p-datatable-sm" [paginator]="l.dossiers.length > 25" [rows]="25" *ngIf="l.dossiers.length">
                <ng-template pTemplate="header">
                    <tr>
                        <th>N° dossier</th>
                        <th>Numéro saisi</th>
                        <th>Client saisi</th>
                        <th *ngIf="l.perimetre !== 'Votre agence'">Agence</th>
                        <th>Point de service</th>
                        <th>État</th>
                        <th class="text-right">Montant</th>
                        <th>Agent</th>
                        <th>Créé le</th>
                        <th>Signalé</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-d>
                    <tr>
                        <td><a [routerLink]="['/dashboards/credit/individuel/attente/detail', d.id]" class="text-primary font-semibold">{{ d.id }}</a></td>
                        <td class="font-mono text-red-700 font-semibold">{{ d.numeroMembre }}</td>
                        <td>{{ d.client }}</td>
                        <td *ngIf="l.perimetre !== 'Votre agence'">{{ d.agence || '—' }}</td>
                        <td>{{ d.pointVente || '—' }}</td>
                        <td><p-tag [value]="d.etat" severity="secondary"></p-tag></td>
                        <td class="text-right">{{ d.montant | number: '1.0-0' }}</td>
                        <td>{{ d.agent || '—' }}</td>
                        <td>{{ d.creeLe | date: 'dd/MM/yyyy' }}</td>
                        <td class="text-sm text-gray-500">{{ d.signaleLe ? (d.signaleLe | date: 'dd/MM HH:mm') : 'pas encore' }}</td>
                    </tr>
                </ng-template>
            </p-table>
            <div class="text-sm text-gray-500" *ngIf="!l.dossiers.length">Aucun dossier en cours avec un numéro inconnu de SAF dans ce périmètre.</div>
        </div>
    `
})
export class MembresSafComponent implements OnInit {
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

    numero = '';
    enCours = signal(false);
    resultat = signal<VerificationMembre | null>(null);

    liste = signal<MembresInconnus | null>(null);
    chargementListe = signal(false);

    ngOnInit(): void {
        this.chargerListe();
    }

    verifier(): void {
        const n = (this.numero || '').trim();
        if (!n) return;
        this.enCours.set(true);
        this.userService
            .verifierMembreSaf$(n)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res: IResponse) => {
                    this.enCours.set(false);
                    this.resultat.set(((res.data as any)?.verification ?? null) as VerificationMembre | null);
                },
                error: (err) => {
                    this.enCours.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err?.message || 'Vérification impossible', life: 5000 });
                }
            });
    }

    /** La liste n'est pas ouverte à tous les profils : un refus laisse simplement la section absente. */
    chargerListe(): void {
        this.chargementListe.set(true);
        this.userService
            .getMembresInconnus$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res: IResponse) => {
                    this.chargementListe.set(false);
                    this.liste.set(((res.data as any)?.inconnus ?? null) as MembresInconnus | null);
                },
                error: () => {
                    this.chargementListe.set(false);
                    this.liste.set(null);
                }
            });
    }
}
