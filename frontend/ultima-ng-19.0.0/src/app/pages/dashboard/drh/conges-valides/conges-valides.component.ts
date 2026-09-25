import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as XLSX from 'xlsx';
import { DrhService, DemandeConge, PermissionSociale, DepartementDrh } from '@/service/drh.service';
import { statutConge, imprimerDemandeConge, imprimerPermission, imprimerListe, libelleMotif, libelleLienParente } from '../conge-utils';

type EtatConge = 'TOUS' | 'EN_COURS' | 'A_VENIR' | 'TERMINE' | 'INTERROMPU';

/**
 * V153 — vue DRH « Congés et permissions validés » : tous les congés accordés (validés ou
 * interrompus) et toutes les permissions accordées, filtres exercice / mois / direction / salarié /
 * état, fiche imprimable, état de liste imprimable et export Excel.
 */
@Component({
    selector: 'app-conges-valides',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, DropdownModule, SelectButtonModule, TableModule, TagModule, ToastModule, TooltipModule, InputTextModule],
    providers: [MessageService],
    template: `
        <p-toast />
        <div class="card">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h4 class="m-0">Congés et permissions validés</h4>
                    <span class="text-sm text-color-secondary">Tous les congés et permissions accordés par la DRH, pour consultation, impression et export.</span>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <p-selectButton [options]="types" [(ngModel)]="typeActif" optionLabel="label" optionValue="value" />
                    <button pButton icon="pi pi-print" label="Imprimer la liste" class="p-button-outlined p-button-sm"
                            [disabled]="lignesVisibles() === 0" (click)="imprimerListeCourante()"></button>
                    <button pButton icon="pi pi-file-excel" label="Excel" class="p-button-outlined p-button-sm" severity="success"
                            [disabled]="lignesVisibles() === 0" (click)="exporterExcel()"></button>
                </div>
            </div>

            <div class="flex flex-wrap items-end gap-3 mb-3">
                <div><label class="block text-sm mb-1">Exercice</label>
                    <p-dropdown [options]="exercices" [(ngModel)]="exercice" (onChange)="charger()" /></div>
                <div><label class="block text-sm mb-1">Mois</label>
                    <p-dropdown [options]="moisOptions" [(ngModel)]="mois" optionLabel="label" optionValue="value" (onChange)="charger()" [style]="{ minWidth: '160px' }" /></div>
                <div><label class="block text-sm mb-1">Direction</label>
                    <p-dropdown [options]="departementsOptions()" [(ngModel)]="departementId" optionLabel="label" optionValue="value" (onChange)="charger()" [style]="{ minWidth: '260px' }" /></div>
                <div *ngIf="typeActif === 'conges'"><label class="block text-sm mb-1">État</label>
                    <p-dropdown [options]="etats" [(ngModel)]="etat" optionLabel="label" optionValue="value" /></div>
                <div><label class="block text-sm mb-1">Salarié</label>
                    <input pInputText [(ngModel)]="recherche" placeholder="Nom ou matricule" /></div>
            </div>

            <p-table *ngIf="typeActif === 'conges'" [value]="congesFiltres()" responsiveLayout="scroll" [rowHover]="true" [paginator]="true" [rows]="20" [loading]="chargement()">
                <ng-template pTemplate="header">
                    <tr><th>Salarié</th><th>Direction</th><th>Du</th><th>Au</th><th>Jours</th><th>Solde après</th><th>État</th><th>Validé par</th><th>Actions</th></tr>
                </ng-template>
                <ng-template pTemplate="body" let-d>
                    <tr>
                        <td>{{ d.nomComplet }}<div class="text-xs text-color-secondary" *ngIf="d.matricule">Mat. {{ d.matricule }}</div></td>
                        <td>{{ d.departementCode }}</td>
                        <td>{{ d.dateDebut | date: 'dd/MM/yyyy' }}</td>
                        <td>{{ d.dateFin | date: 'dd/MM/yyyy' }}</td>
                        <td class="font-medium">{{ d.nbJours }} j</td>
                        <td>{{ d.soldeApres }} j</td>
                        <td>
                            <p-tag [value]="etatLibelle(d)" [severity]="etatSeverite(d)" />
                            <div class="text-xs" *ngIf="d.statut === 'INTERROMPUE'">Reprise le {{ d.dateReprise | date: 'dd/MM/yyyy' }} — {{ d.joursRecredites }} j recrédités</div>
                        </td>
                        <td class="text-sm">{{ d.valideeDrhNom }}<br>{{ d.valideeDrhLe | date: 'dd/MM/yyyy' }}</td>
                        <td><button pButton icon="pi pi-print" class="p-button-text p-button-sm" pTooltip="Imprimer la fiche" (click)="imprimerConge(d)"></button></td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr><td colspan="9" class="text-center text-color-secondary">Aucun congé accordé pour ces critères</td></tr>
                </ng-template>
            </p-table>

            <p-table *ngIf="typeActif === 'permissions'" [value]="permissionsFiltrees()" responsiveLayout="scroll" [rowHover]="true" [paginator]="true" [rows]="20" [loading]="chargement()">
                <ng-template pTemplate="header">
                    <tr><th>Salarié</th><th>Direction</th><th>Motif</th><th>Du</th><th>Au</th><th>Jours</th><th>Validé par</th><th>Actions</th></tr>
                </ng-template>
                <ng-template pTemplate="body" let-p>
                    <tr>
                        <td>{{ p.nomComplet }}<div class="text-xs text-color-secondary" *ngIf="p.matricule">Mat. {{ p.matricule }}</div></td>
                        <td>{{ p.departementCode }}</td>
                        <td>{{ motifLabel(p.motif) }}
                            <div class="text-xs text-color-secondary" *ngIf="p.lienParente">{{ lienLabel(p.lienParente) }}</div>
                            <div class="text-xs text-color-secondary" *ngIf="p.precisionMotif">{{ p.precisionMotif }}</div></td>
                        <td>{{ p.dateDebut | date: 'dd/MM/yyyy' }}</td>
                        <td>{{ p.dateFin | date: 'dd/MM/yyyy' }}</td>
                        <td class="font-medium">{{ p.nbJours }} j</td>
                        <td class="text-sm">{{ p.valideeDrhNom }}<br>{{ p.valideeDrhLe | date: 'dd/MM/yyyy' }}</td>
                        <td><button pButton icon="pi pi-print" class="p-button-text p-button-sm" pTooltip="Imprimer la fiche" (click)="imprimerPerm(p)"></button></td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr><td colspan="8" class="text-center text-color-secondary">Aucune permission accordée pour ces critères</td></tr>
                </ng-template>
            </p-table>
        </div>
    `
})
export class CongesValidesComponent implements OnInit {
    private drhService = inject(DrhService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

    conges = signal<DemandeConge[]>([]);
    permissions = signal<PermissionSociale[]>([]);
    departements = signal<DepartementDrh[]>([]);
    chargement = signal(false);

    typeActif: 'conges' | 'permissions' = 'conges';
    types = [
        { label: 'Congés', value: 'conges' },
        { label: 'Permissions sociales', value: 'permissions' }
    ];
    exercice = new Date().getFullYear();
    exercices = [new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1];
    mois: number | null = null;
    moisOptions = [
        { label: 'Toute l’année', value: null },
        ...['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'].map((l, i) => ({ label: l, value: i + 1 }))
    ];
    departementId: number | null = null;
    etat: EtatConge = 'TOUS';
    etats: { label: string; value: EtatConge }[] = [
        { label: 'Tous', value: 'TOUS' },
        { label: 'En cours', value: 'EN_COURS' },
        { label: 'À venir', value: 'A_VENIR' },
        { label: 'Terminés', value: 'TERMINE' },
        { label: 'Interrompus', value: 'INTERROMPU' }
    ];
    recherche = '';
    motifLabel = libelleMotif;
    lienLabel = libelleLienParente;
    statut = statutConge;

    /** Options du filtre direction (tableau stable, jamais recréé dans le template). */
    departementsOptions = computed(() => [
        { label: 'Toutes les directions', value: null as number | null },
        ...this.departements().map((d) => ({ label: `${d.code} — ${d.libelle}`, value: d.departementId as number | null }))
    ]);

    congesFiltres = computed(() => {
        const q = this.recherche.trim().toLowerCase();
        return this.conges().filter((d) => (this.etat === 'TOUS' || this.etatDe(d) === this.etat)
            && (!q || (d.nomComplet || '').toLowerCase().includes(q) || (d.matricule || '').toLowerCase().includes(q)));
    });
    permissionsFiltrees = computed(() => {
        const q = this.recherche.trim().toLowerCase();
        return this.permissions().filter((p) => !q || (p.nomComplet || '').toLowerCase().includes(q) || (p.matricule || '').toLowerCase().includes(q));
    });

    lignesVisibles(): number {
        return this.typeActif === 'conges' ? this.congesFiltres().length : this.permissionsFiltrees().length;
    }

    ngOnInit(): void {
        this.drhService.departements$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.departements.set((r.data as any)?.departements || []),
            error: () => {}
        });
        this.charger();
    }

    charger(): void {
        this.chargement.set(true);
        this.drhService.congesValidees$(this.exercice, this.departementId, this.mois).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => { this.conges.set((r.data as any)?.demandes || []); this.chargement.set(false); },
            error: (e) => { this.chargement.set(false); this.erreur(e); }
        });
        this.drhService.permissionsValidees$(this.exercice, this.departementId, this.mois).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r) => this.permissions.set((r.data as any)?.permissions || []),
            error: () => {}
        });
    }

    /** État calculé par rapport à aujourd'hui (l'interrompu s'arrête à la veille de la reprise). */
    etatDe(d: DemandeConge): EtatConge {
        if (d.statut === 'INTERROMPUE') return 'INTERROMPU';
        const auj = new Date().toISOString().slice(0, 10);
        if (d.dateFin < auj) return 'TERMINE';
        if (d.dateDebut > auj) return 'A_VENIR';
        return 'EN_COURS';
    }

    etatLibelle(d: DemandeConge): string {
        return this.etats.find((e) => e.value === this.etatDe(d))?.label || '';
    }

    etatSeverite(d: DemandeConge): 'success' | 'info' | 'secondary' | 'contrast' {
        switch (this.etatDe(d)) {
            case 'EN_COURS': return 'success';
            case 'A_VENIR': return 'info';
            case 'INTERROMPU': return 'contrast';
            default: return 'secondary';
        }
    }

    imprimerConge(d: DemandeConge): void {
        imprimerDemandeConge(d, 30);
    }

    imprimerPerm(p: PermissionSociale): void {
        imprimerPermission(p);
    }

    private sousTitre(): string {
        const m = this.moisOptions.find((o) => o.value === this.mois)?.label;
        const dep = this.departementsOptions().find((o) => o.value === this.departementId)?.label;
        return `Exercice ${this.exercice} · ${m || 'Toute l’année'} · ${dep || 'Toutes les directions'}`;
    }

    private fmt(iso?: string): string {
        if (!iso) return '';
        const [a, m, j] = iso.slice(0, 10).split('-');
        return `${j}/${m}/${a}`;
    }

    imprimerListeCourante(): void {
        if (this.typeActif === 'conges') {
            imprimerListe('ÉTAT DES CONGÉS ACCORDÉS', this.sousTitre(),
                ['Salarié', 'Matricule', 'Direction', 'Du', 'Au', 'Jours', 'Solde après', 'État', 'Validé par'],
                this.congesFiltres().map((d) => [d.nomComplet, d.matricule || '', d.departementCode, this.fmt(d.dateDebut), this.fmt(d.dateFin), d.nbJours, d.soldeApres, this.etatLibelle(d), d.valideeDrhNom || '']));
        } else {
            imprimerListe('ÉTAT DES PERMISSIONS SOCIALES ACCORDÉES', this.sousTitre(),
                ['Salarié', 'Matricule', 'Direction', 'Motif', 'Du', 'Au', 'Jours', 'Validé par'],
                this.permissionsFiltrees().map((p) => [p.nomComplet, p.matricule || '', p.departementCode, libelleMotif(p.motif) + (p.lienParente ? ' — ' + libelleLienParente(p.lienParente) : ''), this.fmt(p.dateDebut), this.fmt(p.dateFin), p.nbJours, p.valideeDrhNom || '']));
        }
    }

    exporterExcel(): void {
        const classeur = XLSX.utils.book_new();
        if (this.typeActif === 'conges') {
            const lignes = this.congesFiltres().map((d) => ({
                'Salarié': d.nomComplet, 'Matricule': d.matricule || '', 'Direction': d.departementCode,
                'Du': this.fmt(d.dateDebut), 'Au': this.fmt(d.dateFin), 'Jours': d.nbJours, 'Déjà pris': d.dejaPris, 'Solde après': d.soldeApres,
                'État': this.etatLibelle(d), 'Reprise (interruption)': this.fmt(d.dateReprise), 'Jours recrédités': d.joursRecredites || '',
                'Validé par': d.valideeDrhNom || '', 'Validé le': this.fmt(d.valideeDrhLe)
            }));
            XLSX.utils.book_append_sheet(classeur, XLSX.utils.json_to_sheet(lignes), 'Congés accordés');
            XLSX.writeFile(classeur, `conges_accordes_${this.exercice}${this.mois ? '_' + this.mois : ''}.xlsx`);
        } else {
            const lignes = this.permissionsFiltrees().map((p) => ({
                'Salarié': p.nomComplet, 'Matricule': p.matricule || '', 'Direction': p.departementCode,
                'Motif': libelleMotif(p.motif), 'Lien de parenté': libelleLienParente(p.lienParente), 'Précision': p.precisionMotif || '',
                'Du': this.fmt(p.dateDebut), 'Au': this.fmt(p.dateFin), 'Jours': p.nbJours,
                'Validé par': p.valideeDrhNom || '', 'Validé le': this.fmt(p.valideeDrhLe)
            }));
            XLSX.utils.book_append_sheet(classeur, XLSX.utils.json_to_sheet(lignes), 'Permissions accordées');
            XLSX.writeFile(classeur, `permissions_accordees_${this.exercice}${this.mois ? '_' + this.mois : ''}.xlsx`);
        }
    }

    private erreur(e: any): void {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: e.error?.data?.error || e.error?.message || 'Chargement impossible' });
    }
}
