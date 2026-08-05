import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';

/**
 * DSIG — Campagnes SMS : liste des campagnes + création (nom, message, import des numéros).
 * L'envoi est asynchrone côté backend ; le suivi temps réel se fait sur l'écran de détail.
 */
@Component({
    selector: 'app-campagnes-sms',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, TagModule, ToastModule, TooltipModule, DialogModule, TextareaModule, InputTextModule, RouterLink],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>
        <div class="card">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold m-0">Campagnes SMS</h2>
                <div class="flex gap-2">
                    <button pButton icon="pi pi-refresh" class="p-button-text" (click)="load()" [loading]="state().loading"></button>
                    <button pButton label="Nouvelle campagne" icon="pi pi-plus" (click)="ouvrirCreation()"></button>
                </div>
            </div>
            <p class="text-sm text-gray-500">Envoi de SMS en masse via le hub Sayele : importez un fichier de numéros, lancez la campagne, suivez les envois en temps réel.</p>

            <p-table [value]="state().campagnes" [loading]="state().loading" [paginator]="state().campagnes.length > 10" [rows]="10" responsiveLayout="scroll">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Campagne</th>
                        <th>Message</th>
                        <th class="text-center">Destinataires</th>
                        <th class="text-center">Succès</th>
                        <th class="text-center">Échecs</th>
                        <th>Statut</th>
                        <th>Créée le</th>
                        <th></th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-c>
                    <tr>
                        <td>
                            {{ c.nom }}<br />
                            <span class="text-xs text-gray-500">{{ c.creePar }}</span>
                        </td>
                        <td class="max-w-96"><span class="text-sm">{{ c.message | slice: 0 : 80 }}{{ c.message?.length > 80 ? '…' : '' }}</span></td>
                        <td class="text-center font-bold">{{ c.totalDestinataires }}</td>
                        <td class="text-center text-green-600 font-bold">{{ c.nbSucces }}</td>
                        <td class="text-center text-red-600 font-bold">{{ c.nbEchecs }}</td>
                        <td><p-tag [value]="labelStatut(c.statut)" [severity]="severiteStatut(c.statut)"></p-tag></td>
                        <td>{{ c.dateCreation | date: 'dd/MM/yyyy HH:mm' }}</td>
                        <td>
                            <button pButton icon="pi pi-chart-bar" class="p-button-sm p-button-outlined" pTooltip="Suivi de la campagne" [routerLink]="['/dashboards/campagnes-sms', c.campagneId]"></button>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr>
                        <td colspan="8" class="text-center py-6 text-gray-500">Aucune campagne. Créez la première !</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <!-- Dialog création -->
        <p-dialog header="Nouvelle campagne SMS" [visible]="showCreation" [modal]="true" [style]="{ width: '560px', maxWidth: '95vw' }" [closable]="true" (onHide)="showCreation = false">
            <div class="flex flex-col gap-3">
                <label class="text-sm font-semibold">Nom de la campagne <span class="text-red-500">*</span></label>
                <input pInputText [(ngModel)]="nouvelleCampagne.nom" placeholder="Ex. Vœux Tabaski 2026" class="w-full" />

                <label class="text-sm font-semibold">Message <span class="text-red-500">*</span></label>
                <textarea pTextarea [(ngModel)]="nouvelleCampagne.message" rows="4" class="w-full" placeholder="Texte envoyé à tous les destinataires"></textarea>
                <div class="text-xs" [class.text-orange-600]="nbSegments() > 1" [class.text-gray-500]="nbSegments() <= 1">
                    {{ nouvelleCampagne.message.length }} caractères — {{ nbSegments() }} segment(s) SMS par destinataire
                    <span *ngIf="nbSegments() > 1">(au-delà de 160 caractères, chaque destinataire consomme {{ nbSegments() }} SMS)</span>
                </div>
            </div>
            <ng-template pTemplate="footer">
                <button pButton label="Annuler" icon="pi pi-times" class="p-button-text" (click)="showCreation = false"></button>
                <button pButton label="Créer et importer les numéros" icon="pi pi-arrow-right" [disabled]="!nouvelleCampagne.nom.trim() || !nouvelleCampagne.message.trim()" [loading]="creation" (click)="creer()"></button>
            </ng-template>
        </p-dialog>
    `
})
export class CampagnesSmsComponent implements OnInit {
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);
    private router = inject(Router);

    state = signal<{ campagnes: any[]; loading: boolean }>({ campagnes: [], loading: false });

    showCreation = false;
    creation = false;
    nouvelleCampagne = { nom: '', message: '' };

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.state.update((s) => ({ ...s, loading: true }));
        this.userService
            .getCampagnesSms$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => this.state.set({ campagnes: response.data?.campagnes || [], loading: false }),
                error: (err) => {
                    this.state.update((s) => ({ ...s, loading: false }));
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Chargement impossible', life: 5000 });
                }
            });
    }

    ouvrirCreation(): void {
        this.nouvelleCampagne = { nom: '', message: '' };
        this.showCreation = true;
    }

    /** Segments SMS : 160 caractères pour 1 SMS, puis 153 par segment supplémentaire (norme GSM). */
    nbSegments(): number {
        const len = this.nouvelleCampagne.message.length;
        if (len === 0) return 0;
        return len <= 160 ? 1 : Math.ceil(len / 153);
    }

    creer(): void {
        this.creation = true;
        this.userService
            .creerCampagneSms$(this.nouvelleCampagne.nom.trim(), this.nouvelleCampagne.message.trim())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.creation = false;
                    this.showCreation = false;
                    const id = response.data?.campagne?.campagneId;
                    this.messageService.add({ severity: 'success', summary: 'Campagne créée', detail: 'Importez maintenant les numéros', life: 4000 });
                    if (id) this.router.navigate(['/dashboards/campagnes-sms', id]);
                },
                error: (err) => {
                    this.creation = false;
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Échec de la création', life: 5000 });
                }
            });
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
            case 'BROUILLON':
                return 'secondary';
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
}
