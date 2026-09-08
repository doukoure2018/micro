import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DrhService } from '@/service/drh.service';

/**
 * Gestion des mouvements (DRH) : import du journal de la porte (export access-log)
 * et journal consultable — personnel identifié, visiteurs, non identifiés, anomalies badge.
 */
@Component({
    selector: 'app-mouvements',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, CalendarModule, InputTextModule, SelectButtonModule, TableModule, TagModule, ToastModule, TooltipModule],
    providers: [MessageService],
    template: `
        <p-toast />
        <div class="card">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h4 class="m-0">Gestion des mouvements</h4>
                    <span class="text-sm text-color-secondary">
                        Import du journal de la porte (export « access-log » CSV) : chaque entrée et sortie de la journée,
                        avec identification automatique du personnel par badge ou par nom.
                    </span>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <input type="file" #fichier accept=".csv,text/csv" style="display:none" (change)="importer($event)" />
                    <button pButton icon="pi pi-upload" label="Importer un journal access-log"
                            [loading]="importEnCours()" (click)="fichier.click()"></button>
                    <p-calendar [(ngModel)]="du" dateFormat="dd/mm/yy" [showIcon]="true" placeholder="Du" (onSelect)="charger()" />
                    <p-calendar [(ngModel)]="au" dateFormat="dd/mm/yy" [showIcon]="true" placeholder="Au" (onSelect)="charger()" />
                </div>
            </div>

            <div class="p-3 border-round mb-4 text-sm" style="background:var(--surface-100)" *ngIf="dernierImport() as r">
                <b><i class="pi pi-check-circle text-green-600 mr-1"></i> Import terminé :</b>
                {{ r.lignesLues }} lignes lues — {{ r.personnelsIdentifies }} mouvements du personnel,
                {{ r.visiteurs }} visiteurs, {{ r.nonIdentifies }} non identifiés, {{ r.anomalies }} anomalies badge,
                {{ r.doublonsIgnores }} doublons ignorés (déjà importés).
                <span *ngIf="r.badgesAppris > 0">{{ r.badgesAppris }} badge(s) appris (correspondance badge → matricule).</span>
                <span *ngIf="r.premierJour">Période {{ r.premierJour | date: 'dd/MM' }} au {{ r.dernierJour | date: 'dd/MM/yyyy' }}.</span>
                <div class="text-orange-600" *ngFor="let a of r.avertissements">{{ a }}</div>
            </div>

            <div class="p-3 border-round mb-4 text-sm" style="background:var(--surface-50);border:1px dashed var(--surface-300)">
                <b>Format attendu :</b> export « access-log » de la badgeuse, CSV séparé par des virgules avec en-tête
                <code>Time,Event,Event Message,Actor User,…,Entry/Exit,Credential,Result</code>
                (dates du type <code>"Sep 7, 2026, 20:27:16"</code>). Les réimports du même fichier ne créent pas de doublons.
            </div>

            <div class="flex flex-wrap items-center gap-3 mb-3">
                <p-selectButton [options]="vues" [ngModel]="vue()" (ngModelChange)="changerVue($event)"
                                optionLabel="label" optionValue="value" />
                <span class="p-input-icon-left">
                    <i class="pi pi-search"></i>
                    <input pInputText type="text" [ngModel]="recherche()" (ngModelChange)="recherche.set($event)"
                           placeholder="Rechercher par nom, matricule ou badge…" [style]="{ width: '300px' }" />
                </span>
                <span class="text-sm text-color-secondary" *ngIf="mouvements().length > 0">
                    {{ mouvementsFiltres().length }} mouvement(s) — {{ nbEntrees() }} entrée(s) / {{ nbSorties() }} sortie(s)
                </span>
            </div>

            <p-table [value]="mouvementsFiltres()" responsiveLayout="scroll" [paginator]="true" [rows]="25"
                     [rowHover]="true" [loading]="chargement()">
                <ng-template pTemplate="header">
                    <tr><th>Jour</th><th>Heure</th><th>Sens</th><th>Nom</th><th>Mat.</th><th>Badge</th><th>Résultat</th></tr>
                </ng-template>
                <ng-template pTemplate="body" let-m>
                    <tr>
                        <td>{{ m.jour | date: 'EEE dd/MM/yyyy' }}</td>
                        <td class="font-medium">{{ m.heure?.substring(0, 5) }}</td>
                        <td>
                            <p-tag [value]="m.sens === 'ENTRY' ? 'Entrée' : 'Sortie'"
                                   [severity]="m.sens === 'ENTRY' ? 'success' : 'warn'" />
                        </td>
                        <td>
                            {{ m.nomPersonnel || m.nomBrut }}
                            <div class="text-xs text-color-secondary" *ngIf="m.nomPersonnel && m.nomPersonnel !== m.nomBrut">
                                badgeuse : {{ m.nomBrut }}
                            </div>
                            <p-tag *ngIf="m.visiteur" value="Visiteur" severity="info" styleClass="ml-1" />
                        </td>
                        <td>{{ m.matricule || '—' }}</td>
                        <td class="text-sm">{{ m.badgeNo || '—' }}</td>
                        <td>
                            <p-tag *ngIf="m.resultat !== 'ACCESS'" [value]="m.resultat" severity="danger" />
                            <span *ngIf="m.resultat === 'ACCESS'" class="text-green-600 text-sm">OK</span>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr><td colspan="7" class="text-center text-color-secondary">
                        Aucun mouvement sur la période — importez un journal access-log
                    </td></tr>
                </ng-template>
            </p-table>
        </div>
    `
})
export class MouvementsComponent implements OnInit {
    private drhService = inject(DrhService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

    mouvements = signal<any[]>([]);
    dernierImport = signal<any | null>(null);
    importEnCours = signal(false);
    chargement = signal(false);
    recherche = signal('');
    vue = signal<string>('');

    vues = [
        { label: 'Tous', value: '' },
        { label: 'Personnel', value: 'PERSONNEL' },
        { label: 'Visiteurs', value: 'VISITEUR' },
        { label: 'Non identifiés', value: 'NON_IDENTIFIE' },
        { label: 'Anomalies badge', value: 'ANOMALIE' }
    ];

    du: Date = (() => { const d = new Date(); d.setDate(d.getDate() - 7); return d; })();
    au: Date = new Date();

    mouvementsFiltres = computed(() => {
        const q = this.recherche().trim().toLowerCase();
        if (!q) return this.mouvements();
        return this.mouvements().filter((m: any) =>
            (m.nomBrut || '').toLowerCase().includes(q) ||
            (m.nomPersonnel || '').toLowerCase().includes(q) ||
            String(m.matricule || '').includes(q) ||
            String(m.badgeNo || '').includes(q));
    });

    nbEntrees = computed(() => this.mouvementsFiltres().filter((m: any) => m.sens === 'ENTRY').length);
    nbSorties = computed(() => this.mouvementsFiltres().filter((m: any) => m.sens === 'EXIT').length);

    ngOnInit(): void {
        this.charger();
    }

    changerVue(v: string): void {
        this.vue.set(v);
        this.charger();
    }

    private toIso(d: Date): string {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    charger(): void {
        if (!this.du || !this.au) return;
        this.chargement.set(true);
        this.drhService.mouvements$(this.toIso(this.du), this.toIso(this.au), this.vue() || undefined)
            .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                next: (r) => {
                    this.chargement.set(false);
                    this.mouvements.set((r.data as any)?.mouvements || []);
                },
                error: (e) => {
                    this.chargement.set(false);
                    this.erreur(e);
                }
            });
    }

    importer(event: Event): void {
        const input = event.target as HTMLInputElement;
        const fichier = input.files?.[0];
        input.value = '';
        if (!fichier) return;
        this.importEnCours.set(true);
        this.drhService.importerMouvements$(fichier).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => {
                this.importEnCours.set(false);
                const resultat = (r.data as any)?.resultat;
                this.dernierImport.set(resultat);
                this.messageService.add({ severity: 'success', summary: 'Importé', detail: 'Journal des mouvements importé' });
                if (resultat?.premierJour) {
                    this.du = new Date(resultat.premierJour + 'T00:00:00');
                    this.au = new Date(resultat.dernierJour + 'T00:00:00');
                }
                this.charger();
            },
            error: (e) => {
                this.importEnCours.set(false);
                this.erreur(e);
            }
        });
    }

    private erreur(e: any): void {
        this.messageService.add({
            severity: 'error', summary: 'Erreur',
            detail: e.error?.data?.error || e.error?.message || 'Opération impossible'
        });
    }
}
