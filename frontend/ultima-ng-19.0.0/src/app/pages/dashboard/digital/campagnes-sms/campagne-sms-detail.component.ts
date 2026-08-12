import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

/**
 * DSIG — Détail d'une campagne SMS : import des numéros (brouillon), lancement,
 * suivi TEMPS RÉEL (polling toutes les 3 s tant que la campagne est EN_COURS),
 * statistiques succès/échecs et liste des destinataires filtrable par statut.
 */
@Component({
    selector: 'app-campagne-sms-detail',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, TagModule, ToastModule, TooltipModule, ProgressBarModule, DropdownModule, ConfirmDialogModule],
    providers: [MessageService, ConfirmationService],
    template: `
        <p-toast></p-toast>
        <p-confirmDialog [style]="{ width: '430px' }"></p-confirmDialog>

        @if (state().campagne; as c) {
        <div class="card">
            <div class="flex justify-between items-start flex-wrap gap-3 mb-2">
                <div>
                    <div class="flex items-center gap-3">
                        <button pButton icon="pi pi-arrow-left" class="p-button-text p-button-rounded" (click)="retour()"></button>
                        <h2 class="text-xl font-bold m-0">{{ c.nom }}</h2>
                        <p-tag [value]="labelStatut(c.statut)" [severity]="severiteStatut(c.statut)"></p-tag>
                    </div>
                    <p class="text-sm text-gray-500 mt-2 mb-0 ml-1">{{ c.message }}</p>
                </div>
                <div class="flex gap-2">
                    @if (c.statut === 'BROUILLON') {
                    <button pButton label="Lancer la campagne" icon="pi pi-send" severity="success" [disabled]="!c.totalDestinataires" (click)="lancer()"></button>
                    } @if (c.statut === 'EN_COURS') {
                    <button pButton label="Pause" icon="pi pi-pause" severity="warn" (click)="pause()"></button>
                    } @if (c.statut === 'EN_PAUSE') {
                    <button pButton label="Reprendre" icon="pi pi-play" severity="success" (click)="reprendre()"></button>
                    } @if (c.statut === 'BROUILLON' || c.statut === 'EN_COURS' || c.statut === 'EN_PAUSE') {
                    <button pButton label="Annuler" icon="pi pi-times" severity="danger" class="p-button-outlined" (click)="annuler()"></button>
                    }
                </div>
            </div>

            <!-- Source des destinataires : répertoire pré-chargé (brouillon uniquement) -->
            @if (c.statut === 'BROUILLON') {
            <div class="border border-dashed border-gray-300 rounded-lg p-4 my-4">
                <div class="font-semibold mb-2"><i class="pi pi-database text-blue-600"></i> Source des destinataires : répertoire pré-chargé</div>
                <p class="text-sm text-gray-500 mt-0">
                    Sélectionnez le répertoire (chargé en amont par le responsable digital) : la campagne prend un <strong>instantané</strong> de ses numéros. Un rechargement ultérieur du répertoire ne modifiera pas cette
                    campagne.
                </p>
                <div class="flex gap-2 items-center flex-wrap">
                    <p-dropdown
                        [options]="optionsRepertoires()"
                        [(ngModel)]="repertoireSelectionne"
                        optionLabel="label"
                        placeholder="Choisir un répertoire (produit — segment)"
                        [style]="{ minWidth: '340px' }"
                        appendTo="body"
                    ></p-dropdown>
                    <button pButton label="Charger ce répertoire" icon="pi pi-download" [disabled]="!repertoireSelectionne" (click)="chargerRepertoire()"></button>
                </div>
                @if (c.sourceRepertoireLibelle) {
                <div class="mt-3 text-sm text-green-700"><i class="pi pi-check-circle"></i> Source actuelle : <strong>{{ c.sourceRepertoireLibelle }}</strong> — {{ c.totalDestinataires }} numéro(s) chargé(s)</div>
                }
            </div>
            } @else if (c.sourceRepertoireLibelle) {
            <div class="text-sm text-gray-500 my-2"><i class="pi pi-database"></i> Source : {{ c.sourceRepertoireLibelle }}</div>
            }

            <!-- Progression + stats temps réel -->
            <div class="my-4">
                <div class="flex justify-between text-sm mb-1">
                    <span class="font-semibold">Progression : {{ nbTraites() }} / {{ c.totalDestinataires }}</span>
                    <span class="text-gray-500">
                        {{ progression() }}%
                        @if (c.statut === 'EN_COURS') {
                        <i class="pi pi-spin pi-spinner ml-1"></i> mise à jour automatique
                        }
                    </span>
                </div>
                <p-progressBar [value]="progression()" [showValue]="false" [style]="{ height: '14px' }"></p-progressBar>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
                <div class="border rounded-lg p-3 text-center bg-gray-50">
                    <div class="text-2xl font-bold">{{ c.nbEnAttente }}</div>
                    <div class="text-xs text-gray-500 uppercase">En attente</div>
                </div>
                <div class="border rounded-lg p-3 text-center bg-blue-50">
                    <div class="text-2xl font-bold text-blue-600">{{ c.nbEncours }}</div>
                    <div class="text-xs text-gray-500 uppercase">En cours</div>
                </div>
                <div class="border rounded-lg p-3 text-center bg-green-50">
                    <div class="text-2xl font-bold text-green-600">{{ c.nbSucces }}</div>
                    <div class="text-xs text-gray-500 uppercase">Succès</div>
                </div>
                <div class="border rounded-lg p-3 text-center bg-red-50">
                    <div class="text-2xl font-bold text-red-600">{{ c.nbEchecs }}</div>
                    <div class="text-xs text-gray-500 uppercase">Échecs</div>
                </div>
            </div>

            <!-- Destinataires -->
            <div class="flex justify-between items-center mt-6 mb-2">
                <h3 class="font-semibold m-0">Destinataires</h3>
                <div class="flex gap-2 items-center">
                    <p-dropdown [options]="filtresStatut" [(ngModel)]="filtreStatut" optionLabel="label" optionValue="value" placeholder="Tous les statuts" [showClear]="true" (onChange)="loadDestinataires()"></p-dropdown>
                    <button pButton icon="pi pi-refresh" class="p-button-text" (click)="refresh()"></button>
                </div>
            </div>
            <p-table [value]="state().destinataires" [loading]="state().loadingDest" responsiveLayout="scroll">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Téléphone</th>
                        <th>Statut</th>
                        <th>Tentatives</th>
                        <th>Motif d'échec</th>
                        <th>Date d'envoi</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-d>
                    <tr>
                        <td class="font-mono">{{ d.telephone }}</td>
                        <td><p-tag [value]="labelStatutDest(d.statut)" [severity]="severiteStatutDest(d.statut)" size="small"></p-tag></td>
                        <td>{{ d.tentatives }}</td>
                        <td class="text-sm text-red-600">{{ d.motifEchec }}</td>
                        <td>{{ d.dateEnvoi | date: 'dd/MM/yyyy HH:mm:ss' }}</td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr>
                        <td colspan="5" class="text-center py-6 text-gray-500">Aucun destinataire{{ filtreStatut ? ' pour ce statut' : '' }}.</td>
                    </tr>
                </ng-template>
            </p-table>
            <div class="flex justify-center gap-2 mt-3" *ngIf="state().destinataires.length === pageSize || pageDest > 0">
                <button pButton icon="pi pi-chevron-left" class="p-button-text p-button-sm" [disabled]="pageDest === 0" (click)="pagePrecedente()"></button>
                <span class="text-sm self-center">Page {{ pageDest + 1 }}</span>
                <button pButton icon="pi pi-chevron-right" class="p-button-text p-button-sm" [disabled]="state().destinataires.length < pageSize" (click)="pageSuivante()"></button>
            </div>
        </div>
        }
    `
})
export class CampagneSmsDetailComponent implements OnInit {
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private destroyRef = inject(DestroyRef);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    campagneId!: number;
    filtreStatut: string | null = null;
    pageDest = 0;
    pageSize = 50;

    filtresStatut = [
        { label: 'En attente', value: 'EN_ATTENTE' },
        { label: 'En cours', value: 'ENCOURS' },
        { label: 'Succès', value: 'SUCCESS' },
        { label: 'Échecs', value: 'FAILED' }
    ];

    state = signal<{ campagne: any | null; destinataires: any[]; repertoires: any[]; loadingDest: boolean }>({
        campagne: null,
        destinataires: [],
        repertoires: [],
        loadingDest: false
    });

    repertoireSelectionne: { label: string; value: number } | null = null;

    private pollTimer: any = null;

    ngOnInit(): void {
        this.campagneId = +this.route.snapshot.params['campagneId'];
        this.refresh();
        this.loadRepertoires();
        // Polling temps réel : tant que la campagne est EN_COURS, rafraîchit stats + liste toutes les 3 s
        this.pollTimer = setInterval(() => {
            if (this.state().campagne?.statut === 'EN_COURS') {
                this.loadStats();
                this.loadDestinataires(true);
            }
        }, 3000);
        this.destroyRef.onDestroy(() => clearInterval(this.pollTimer));
    }

    refresh(): void {
        this.loadStats();
        this.loadDestinataires();
    }

    loadStats(): void {
        this.userService
            .getCampagneSmsStats$(this.campagneId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => this.state.update((s) => ({ ...s, campagne: response.data?.campagne || null })),
                error: () => {}
            });
    }

    loadDestinataires(silencieux = false): void {
        if (!silencieux) this.state.update((s) => ({ ...s, loadingDest: true }));
        this.userService
            .getDestinatairesSms$(this.campagneId, this.filtreStatut || undefined, this.pageDest, this.pageSize)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => this.state.update((s) => ({ ...s, destinataires: response.data?.destinataires || [], loadingDest: false })),
                error: () => this.state.update((s) => ({ ...s, loadingDest: false }))
            });
    }

    loadRepertoires(): void {
        this.userService
            .getRepertoiresSms$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => this.state.update((s) => ({ ...s, repertoires: response.data?.repertoires || [] })),
                error: () => {}
            });
    }

    /** Répertoires proposés : uniquement ceux qui contiennent des numéros. */
    optionsRepertoires(): { label: string; value: number }[] {
        return this.state()
            .repertoires.filter((r) => r.nbNumeros > 0)
            .map((r) => ({ label: `${r.libelle} — ${r.nbNumeros} numéros`, value: r.repertoireId }));
    }

    chargerRepertoire(): void {
        if (!this.repertoireSelectionne) return;
        const dejaCharge = (this.state().campagne?.totalDestinataires || 0) > 0;
        const executer = () => {
            this.userService
                .chargerRepertoireCampagne$(this.campagneId, this.repertoireSelectionne!.value)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (response: IResponse) => {
                        this.state.update((s) => ({ ...s, campagne: response.data?.campagne || s.campagne }));
                        this.messageService.add({ severity: 'success', summary: 'Répertoire chargé', detail: `${response.data?.campagne?.totalDestinataires || 0} destinataire(s)`, life: 4000 });
                        this.loadDestinataires();
                    },
                    error: (err) => this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Échec du chargement', life: 6000 })
                });
        };
        if (dejaCharge) {
            this.confirmationService.confirm({
                message: 'Les destinataires actuels de la campagne seront remplacés par ceux du répertoire sélectionné. Continuer ?',
                header: 'Remplacer la source',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Oui, remplacer',
                rejectLabel: 'Annuler',
                accept: executer
            });
        } else {
            executer();
        }
    }

    lancer(): void {
        const total = this.state().campagne?.totalDestinataires || 0;
        this.confirmationService.confirm({
            message: `Lancer l'envoi de ${total} SMS ? Les envois démarrent immédiatement.`,
            header: 'Confirmation',
            icon: 'pi pi-send',
            acceptLabel: 'Lancer',
            rejectLabel: 'Annuler',
            accept: () => this.action(this.userService.lancerCampagneSms$(this.campagneId), 'Campagne lancée')
        });
    }

    pause(): void {
        this.action(this.userService.pauseCampagneSms$(this.campagneId), 'Campagne en pause');
    }

    reprendre(): void {
        this.action(this.userService.reprendreCampagneSms$(this.campagneId), 'Campagne reprise');
    }

    annuler(): void {
        this.confirmationService.confirm({
            message: 'Annuler définitivement cette campagne ? Les SMS non envoyés ne partiront pas.',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui, annuler',
            rejectLabel: 'Non',
            accept: () => this.action(this.userService.annulerCampagneSms$(this.campagneId), 'Campagne annulée')
        });
    }

    private action(obs: any, succes: string): void {
        obs.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: succes, life: 3000 });
                this.refresh();
            },
            error: (err: any) => this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Action impossible', life: 5000 })
        });
    }

    nbTraites(): number {
        const c = this.state().campagne;
        return c ? (c.nbSucces || 0) + (c.nbEchecs || 0) : 0;
    }

    progression(): number {
        const c = this.state().campagne;
        if (!c || !c.totalDestinataires) return 0;
        return Math.round((this.nbTraites() / c.totalDestinataires) * 100);
    }

    pagePrecedente(): void {
        if (this.pageDest > 0) {
            this.pageDest--;
            this.loadDestinataires();
        }
    }

    pageSuivante(): void {
        this.pageDest++;
        this.loadDestinataires();
    }

    retour(): void {
        this.router.navigate(['/dashboards/campagnes-sms']);
    }

    labelStatut(statut: string): string {
        switch (statut) {
            case 'BROUILLON':
                return 'Brouillon';
            case 'EN_COURS':
                return 'En cours';
            case 'EN_PAUSE':
                return 'En pause';
            case 'TERMINEE':
                return 'Terminée';
            case 'ANNULEE':
                return 'Annulée';
            default:
                return statut;
        }
    }

    severiteStatut(statut: string): 'info' | 'warn' | 'success' | 'danger' | 'secondary' {
        switch (statut) {
            case 'EN_COURS':
                return 'info';
            case 'EN_PAUSE':
                return 'warn';
            case 'TERMINEE':
                return 'success';
            case 'ANNULEE':
                return 'danger';
            default:
                return 'secondary';
        }
    }

    labelStatutDest(statut: string): string {
        switch (statut) {
            case 'EN_ATTENTE':
                return 'En attente';
            case 'ENCOURS':
                return 'En cours';
            case 'SUCCESS':
                return 'Succès';
            case 'FAILED':
                return 'Échec';
            default:
                return statut;
        }
    }

    severiteStatutDest(statut: string): 'info' | 'warn' | 'success' | 'danger' | 'secondary' {
        switch (statut) {
            case 'ENCOURS':
                return 'info';
            case 'SUCCESS':
                return 'success';
            case 'FAILED':
                return 'danger';
            default:
                return 'secondary';
        }
    }
}
