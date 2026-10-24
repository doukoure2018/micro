import { CanalVerification, EquipeContact, EquipeContacts } from '@/interface/profil-contact';
import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
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
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

/**
 * Suivi des contacts de l'équipe (V173, lot 2 du chantier contacts vérifiés).
 *
 * Le directeur d'agence voit qui n'a pas de contact utilisable et relance de vive voix.
 * Pour un agent qui n'y arrive pas, il saisit lui-même l'adresse ou le numéro : la valeur
 * est enregistrée mais reste « à confirmer » tant que l'agent ne l'a pas prouvée par un code.
 */
@Component({
    selector: 'app-contacts-equipe',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, DialogModule, InputTextModule, SelectButtonModule, TableModule, TagModule, ToastModule, TooltipModule],
    template: `
        <p-toast></p-toast>

        <div class="card">
            <div class="flex items-start gap-3 mb-3 flex-wrap">
                <div>
                    <h5 class="m-0">Contacts des agents</h5>
                    <div class="text-sm text-gray-600 mt-1">
                        Une alerte n'arrive que si l'adresse existe et si le numéro répond. Ici, ce qui reste à corriger dans
                        {{ data()?.niveau === 'AGENCE' ? 'votre agence' : data()?.niveau === 'DELEGATION' ? 'votre délégation' : 'le réseau' }}.
                    </div>
                </div>
                <button pButton icon="pi pi-refresh" class="p-button-text ml-auto" (click)="charger()" [loading]="loading()" pTooltip="Recharger"></button>
            </div>

            <div *ngIf="erreur()" class="p-3 mb-3 border-round surface-100 text-red-600">{{ erreur() }}</div>

            <ng-container *ngIf="data() as d">
                <!-- Décompte -->
                <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                    <div class="p-3 border-1 surface-border border-round">
                        <div class="text-xs text-gray-500 uppercase">Agents</div>
                        <div class="text-2xl font-semibold">{{ d.indicateurs.nbAgents }}</div>
                    </div>
                    <div class="p-3 border-1 surface-border border-round">
                        <div class="text-xs text-gray-500 uppercase">Adresse en échec</div>
                        <div class="text-2xl font-semibold" [class.text-red-600]="d.indicateurs.nbEmailEnEchec > 0">{{ d.indicateurs.nbEmailEnEchec }}</div>
                    </div>
                    <div class="p-3 border-1 surface-border border-round">
                        <div class="text-xs text-gray-500 uppercase">Sans téléphone</div>
                        <div class="text-2xl font-semibold" [class.text-orange-600]="d.indicateurs.nbSansTelephone > 0">{{ d.indicateurs.nbSansTelephone }}</div>
                    </div>
                    <div class="p-3 border-1 surface-border border-round">
                        <div class="text-xs text-gray-500 uppercase">À confirmer</div>
                        <div class="text-2xl font-semibold" [class.text-orange-600]="d.indicateurs.nbAconfirmer > 0">{{ d.indicateurs.nbAconfirmer }}</div>
                    </div>
                    <div class="p-3 border-1 surface-border border-round">
                        <div class="text-xs text-gray-500 uppercase">Tout vérifié</div>
                        <div class="text-2xl font-semibold text-green-700">{{ d.indicateurs.nbContactsVerifies }}</div>
                    </div>
                </div>

                <!-- Synthèse par délégation, au niveau réseau -->
                <p-table *ngIf="d.synthese.length" [value]="d.synthese" styleClass="mb-4" responsiveLayout="scroll">
                    <ng-template pTemplate="header">
                        <tr>
                            <th>Délégation</th>
                            <th class="text-right">Agents</th>
                            <th class="text-right">Adresse en échec</th>
                            <th class="text-right">Sans téléphone</th>
                            <th class="text-right">À confirmer</th>
                            <th class="text-right">Tout vérifié</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-s>
                        <tr>
                            <td class="font-semibold">{{ s.libelle }}</td>
                            <td class="text-right">{{ s.nbAgents }}</td>
                            <td class="text-right" [class.text-red-600]="s.nbEmailEnEchec > 0">{{ s.nbEmailEnEchec }}</td>
                            <td class="text-right" [class.text-orange-600]="s.nbSansTelephone > 0">{{ s.nbSansTelephone }}</td>
                            <td class="text-right">{{ s.nbAconfirmer }}</td>
                            <td class="text-right text-green-700">{{ s.nbContactsVerifies }}</td>
                        </tr>
                    </ng-template>
                </p-table>

                <!-- Filtre et recherche -->
                <div class="flex gap-3 mb-3 flex-wrap align-items-center">
                    <p-selectButton [options]="filtres" [ngModel]="filtre()" (ngModelChange)="filtre.set($event)" optionLabel="label" optionValue="value"></p-selectButton>
                    <input pInputText type="text" [ngModel]="recherche()" (ngModelChange)="recherche.set($event)" placeholder="Nom, adresse, point de service…" class="w-64" />
                    <span class="text-sm text-gray-500 ml-auto">{{ lignes().length }} ligne(s)</span>
                </div>

                <p-table [value]="lignes()" [paginator]="lignes().length > 25" [rows]="25" responsiveLayout="scroll">
                    <ng-template pTemplate="header">
                        <tr>
                            <th>Agent</th>
                            <th>Point de service</th>
                            <th>Adresse e-mail</th>
                            <th>Téléphone</th>
                            <th>Dernière connexion</th>
                            <th *ngIf="d.peutSaisir"></th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-l>
                        <tr [class.bg-red-50]="l.emailEnEchec">
                            <td>
                                <div class="font-semibold">{{ l.nom }}</div>
                                <div class="text-xs text-gray-500">{{ l.role }}</div>
                            </td>
                            <td class="text-sm">
                                {{ l.pointVente || '—' }}
                                <div class="text-xs text-gray-500">{{ l.agence }}</div>
                            </td>
                            <td class="text-sm">
                                <div [class.text-red-600]="l.emailEnEchec">{{ l.email }}</div>
                                <div class="text-xs mt-1">
                                    <p-tag *ngIf="l.emailEnEchec" severity="danger" value="en échec" styleClass="text-xs"></p-tag>
                                    <p-tag *ngIf="!l.emailEnEchec && l.emailVerifie" severity="success" value="vérifiée" styleClass="text-xs"></p-tag>
                                    <p-tag *ngIf="!l.emailEnEchec && !l.emailVerifie && l.emailSaisiPar" severity="warn" [value]="'à confirmer · saisie par ' + l.emailSaisiPar" styleClass="text-xs"></p-tag>
                                </div>
                            </td>
                            <td class="text-sm">
                                <div [class.text-gray-400]="!l.telephone">{{ l.telephone || 'non renseigné' }}</div>
                                <div class="text-xs mt-1">
                                    <p-tag *ngIf="l.telephoneVerifie" severity="success" value="vérifié" styleClass="text-xs"></p-tag>
                                    <p-tag *ngIf="!l.telephoneVerifie && l.telephoneSaisiPar" severity="warn" [value]="'à confirmer · saisi par ' + l.telephoneSaisiPar" styleClass="text-xs"></p-tag>
                                </div>
                            </td>
                            <td class="text-sm">{{ l.derniereConnexion || '—' }}</td>
                            <td *ngIf="d.peutSaisir" class="whitespace-nowrap">
                                <button pButton icon="pi pi-envelope" class="p-button-text p-button-sm" pTooltip="Saisir l'adresse de cet agent" (click)="ouvrir(l, 'EMAIL')"></button>
                                <button pButton icon="pi pi-phone" class="p-button-text p-button-sm" pTooltip="Saisir le numéro de cet agent" (click)="ouvrir(l, 'SMS')"></button>
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td [attr.colspan]="d.peutSaisir ? 6 : 5" class="text-center text-gray-500 py-6">Aucun agent ne correspond à ce filtre.</td>
                        </tr>
                    </ng-template>
                </p-table>
            </ng-container>
        </div>

        <!-- Saisie à la place d'un agent -->
        <p-dialog [header]="canal() === 'EMAIL' ? 'Saisir une adresse e-mail' : 'Saisir un numéro'" [visible]="showDialog()" (visibleChange)="!$event && showDialog.set(false)" [modal]="true" [style]="{ width: '520px' }">
            <div *ngIf="cible() as c">
                <p class="m-0 mb-3 text-sm">
                    <strong>{{ c.nom }}</strong><span *ngIf="c.pointVente"> — {{ c.pointVente }}</span>
                </p>
                <label class="block text-sm font-medium mb-1">{{ canal() === 'EMAIL' ? 'Adresse e-mail' : 'Numéro de téléphone' }}</label>
                <input pInputText class="w-full" [(ngModel)]="valeur" [placeholder]="canal() === 'EMAIL' ? 'prenom.nom@exemple.com' : '6XX XX XX XX'" (keyup.enter)="enregistrer()" />
                <p class="text-xs text-gray-500 mt-3">
                    Ce contact sera enregistré comme « à confirmer » : il faudra que l'agent le prouve par un code depuis sa page « Mon profil ».
                    <ng-container *ngIf="canal() === 'EMAIL'">
                        L'adresse étant l'identifiant de connexion, prévenez l'agent : il se connectera désormais avec elle, l'ancienne restant acceptée trente jours.
                    </ng-container>
                </p>
            </div>
            <ng-template pTemplate="footer">
                <button pButton label="Annuler" class="p-button-text" (click)="showDialog.set(false)"></button>
                <button pButton label="Enregistrer" icon="pi pi-check" [loading]="envoi()" [disabled]="!valeur.trim()" (click)="enregistrer()"></button>
            </ng-template>
        </p-dialog>
    `
})
export class ContactsEquipeComponent implements OnInit {
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

    data = signal<EquipeContacts | null>(null);
    loading = signal(false);
    erreur = signal<string | null>(null);

    filtre = signal<'atraiter' | 'tous'>('atraiter');
    recherche = signal('');
    filtres = [
        { label: 'À traiter', value: 'atraiter' },
        { label: 'Tous', value: 'tous' }
    ];

    showDialog = signal(false);
    cible = signal<EquipeContact | null>(null);
    canal = signal<CanalVerification>('EMAIL');
    envoi = signal(false);
    valeur = '';

    lignes = computed(() => {
        const toutes = this.data()?.lignes || [];
        const q = this.recherche().trim().toLowerCase();
        return toutes
            .filter((l) => (this.filtre() === 'tous' ? true : l.atraiter))
            .filter((l) => (q ? `${l.nom} ${l.email} ${l.pointVente || ''} ${l.telephone || ''}`.toLowerCase().includes(q) : true));
    });

    ngOnInit(): void {
        this.charger();
    }

    charger(): void {
        this.loading.set(true);
        this.erreur.set(null);
        this.userService
            .contactsEquipe$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.data.set((r.data?.equipe as EquipeContacts) || null);
                    this.loading.set(false);
                },
                error: (err) => {
                    this.loading.set(false);
                    this.erreur.set(err || 'Liste indisponible');
                }
            });
    }

    ouvrir(ligne: EquipeContact, canal: CanalVerification): void {
        this.cible.set(ligne);
        this.canal.set(canal);
        this.valeur = canal === 'EMAIL' ? '' : ligne.telephone || '';
        this.showDialog.set(true);
    }

    enregistrer(): void {
        const cible = this.cible();
        if (!cible || !this.valeur.trim()) return;
        this.envoi.set(true);
        this.userService
            .saisirContactAgent$(cible.userId, this.canal(), this.valeur.trim())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.envoi.set(false);
                    this.showDialog.set(false);
                    this.data.set((r.data?.equipe as EquipeContacts) || this.data());
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Contact enregistré',
                        detail: `${cible.nom} devra le confirmer par un code depuis sa page « Mon profil ».`,
                        life: 8000
                    });
                },
                error: (err) => {
                    this.envoi.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Enregistrement refusé', detail: err, life: 7000 });
                }
            });
    }
}
