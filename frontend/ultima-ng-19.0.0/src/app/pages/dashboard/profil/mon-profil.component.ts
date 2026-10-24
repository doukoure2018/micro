import { CanalVerification, ProfilContact } from '@/interface/profil-contact';
import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

/**
 * Page « Mon profil » : l'agent corrige lui-même son adresse et son numéro, un code de
 * vérification à l'appui (V172, lot 1 du chantier contacts vérifiés).
 *
 * Le code prouve deux choses à la fois : la boîte (ou la ligne) existe, et c'est bien
 * l'agent qui la tient. L'adresse étant l'identifiant de connexion, l'ancienne reste
 * acceptée trente jours après la correction.
 */
@Component({
    selector: 'app-mon-profil',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, DialogModule, InputTextModule, TagModule, ToastModule, TooltipModule],
    template: `
        <p-toast></p-toast>

        <div class="card">
            <div class="flex items-start gap-3 mb-4">
                <div>
                    <h5 class="m-0">Mon profil</h5>
                    <div class="text-sm text-gray-600 mt-1">
                        Votre nom, votre rôle et votre point de service sont ceux de votre fiche : seule la DSIG les modifie.
                        Votre adresse et votre numéro, eux, sont à vous de les tenir à jour.
                    </div>
                </div>
                <button pButton icon="pi pi-refresh" class="p-button-text ml-auto" (click)="charger()" [loading]="loading()" pTooltip="Recharger"></button>
            </div>

            <div *ngIf="erreur()" class="p-3 mb-3 border-round surface-100 text-red-600">{{ erreur() }}</div>

            <ng-container *ngIf="profil() as p">
                <!-- Ce qu'il faut corriger -->
                <div *ngIf="p.acorriger" class="p-3 mb-4 border-left-3 border-orange-500 surface-50">
                    <div class="font-semibold text-orange-700 mb-1"><i class="pi pi-exclamation-triangle mr-2"></i>Vos alertes ne vous parviennent pas</div>
                    <div class="text-sm" *ngIf="p.emailEnEchec">Votre adresse e-mail est en échec : les messages envoyés à cette adresse reviennent. Corrigez-la ci-dessous.</div>
                    <div class="text-sm" *ngIf="!p.telephone">Aucun numéro de téléphone n'est enregistré : ajoutez-le pour recevoir les alertes par SMS.</div>
                </div>

                <!-- Identité, en lecture seule -->
                <div class="grid formgrid mb-4">
                    <div class="col-12 md:col-6 mb-3">
                        <label class="block text-sm text-gray-500 mb-1">Nom</label>
                        <div class="font-semibold">{{ p.nom }}</div>
                    </div>
                    <div class="col-12 md:col-6 mb-3">
                        <label class="block text-sm text-gray-500 mb-1">Rôle et point de service</label>
                        <div class="font-semibold">
                            {{ p.role || '—' }}<span *ngIf="p.service"> · {{ p.service }}</span>
                            <span *ngIf="p.pointVente"> · {{ p.pointVente }}</span>
                        </div>
                        <div class="text-xs text-gray-500" *ngIf="p.agence">{{ p.agence }}<span *ngIf="p.delegation"> · {{ p.delegation }}</span></div>
                    </div>
                </div>

                <!-- Adresse e-mail -->
                <div class="p-3 mb-3 border-1 surface-border border-round">
                    <div class="flex align-items-start gap-3 flex-wrap">
                        <div class="flex-1">
                            <label class="block text-sm text-gray-500 mb-1">Adresse e-mail <span class="text-xs">(votre identifiant de connexion)</span></label>
                            <div class="font-semibold" [class.text-red-600]="p.emailEnEchec">{{ p.email }}</div>
                            <div class="text-xs mt-1">
                                <p-tag *ngIf="p.emailVerifieAt" severity="success" value="vérifiée" styleClass="text-xs"></p-tag>
                                <p-tag *ngIf="!p.emailVerifieAt && !p.emailEnEchec" severity="warn" value="jamais vérifiée" styleClass="text-xs"></p-tag>
                                <p-tag *ngIf="p.emailEnEchec" severity="danger" value="en échec" styleClass="text-xs"></p-tag>
                            </div>
                            <div class="text-xs text-gray-500 mt-2" *ngIf="p.ancienEmail">
                                Votre ancienne adresse {{ p.ancienEmail }} ouvre encore votre session jusqu'au {{ p.ancienEmailExpireAt | date: 'dd/MM/yyyy' }}.
                            </div>
                            <div class="text-xs text-orange-600 mt-2" *ngIf="p.demandeEmail">
                                Un code a été envoyé à {{ p.demandeEmail.destinationMasquee }}, valable jusqu'à {{ p.demandeEmail.expireAt | date: 'HH:mm' }}.
                            </div>
                        </div>
                        <button pButton label="Modifier" icon="pi pi-pencil" class="p-button-outlined p-button-sm" (click)="ouvrir('EMAIL')"></button>
                    </div>
                </div>

                <!-- Téléphone -->
                <div class="p-3 border-1 surface-border border-round">
                    <div class="flex align-items-start gap-3 flex-wrap">
                        <div class="flex-1">
                            <label class="block text-sm text-gray-500 mb-1">Téléphone</label>
                            <div class="font-semibold" [class.text-gray-400]="!p.telephone">{{ p.telephone || 'non renseigné' }}</div>
                            <div class="text-xs mt-1">
                                <p-tag *ngIf="p.telephoneVerifieAt" severity="success" value="vérifié" styleClass="text-xs"></p-tag>
                                <p-tag *ngIf="p.telephone && !p.telephoneVerifieAt" severity="warn" value="jamais vérifié" styleClass="text-xs"></p-tag>
                            </div>
                            <div class="text-xs text-orange-600 mt-2" *ngIf="p.demandeTelephone">
                                Un code a été envoyé par SMS au {{ p.demandeTelephone.destinationMasquee }}, valable jusqu'à {{ p.demandeTelephone.expireAt | date: 'HH:mm' }}.
                            </div>
                        </div>
                        <button pButton [label]="p.telephone ? 'Modifier' : 'Ajouter'" icon="pi pi-pencil" class="p-button-outlined p-button-sm" (click)="ouvrir('SMS')"></button>
                    </div>
                </div>
            </ng-container>
        </div>

        <!-- Dialogue : saisir la nouvelle valeur, puis le code reçu -->
        <p-dialog [header]="canal() === 'EMAIL' ? 'Changer mon adresse e-mail' : 'Changer mon numéro'" [visible]="showDialog()" (visibleChange)="!$event && fermer()" [modal]="true" [style]="{ width: '520px' }">
            <ng-container *ngIf="etape() === 'saisie'">
                <p class="text-sm mt-0" *ngIf="canal() === 'EMAIL'">
                    Indiquez votre adresse e-mail réelle. Un code à six chiffres y sera envoyé ; tant que vous ne l'aurez pas saisi, rien ne change.
                </p>
                <p class="text-sm mt-0" *ngIf="canal() === 'SMS'">Indiquez votre numéro, neuf chiffres commençant par 6. Un code à six chiffres y sera envoyé par SMS.</p>
                <input pInputText class="w-full" [(ngModel)]="destination" [placeholder]="canal() === 'EMAIL' ? 'prenom.nom@exemple.com' : '6XX XX XX XX'" (keyup.enter)="demanderCode()" />
                <p class="text-xs text-gray-500 mt-3" *ngIf="canal() === 'EMAIL'">
                    Votre adresse est votre identifiant de connexion. Une fois confirmée, c'est avec elle que vous vous connecterez ; l'ancienne restera acceptée trente jours.
                </p>
            </ng-container>

            <ng-container *ngIf="etape() === 'code'">
                <p class="text-sm mt-0">{{ messageEnvoi() }}</p>
                <label class="block text-sm font-medium mb-1">Code à six chiffres</label>
                <input pInputText class="w-full text-center" style="letter-spacing: 8px; font-size: 20px" maxlength="6" inputmode="numeric" [(ngModel)]="code" (keyup.enter)="confirmer()" />
                <div class="text-xs text-gray-500 mt-3">
                    Vous ne l'avez pas reçu ? <a class="text-primary cursor-pointer" (click)="etape.set('saisie')">revenir en arrière</a> pour corriger
                    {{ canal() === 'EMAIL' ? "l'adresse" : 'le numéro' }} et redemander un code.
                </div>
            </ng-container>

            <ng-template pTemplate="footer">
                <button pButton label="Annuler" class="p-button-text" (click)="fermer()"></button>
                <button *ngIf="etape() === 'saisie'" pButton label="Envoyer le code" icon="pi pi-send" [loading]="envoi()" [disabled]="!destination.trim()" (click)="demanderCode()"></button>
                <button *ngIf="etape() === 'code'" pButton label="Confirmer" icon="pi pi-check" [loading]="envoi()" [disabled]="code.trim().length !== 6" (click)="confirmer()"></button>
            </ng-template>
        </p-dialog>
    `
})
export class MonProfilComponent implements OnInit {
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

    profil = signal<ProfilContact | null>(null);
    loading = signal(false);
    erreur = signal<string | null>(null);

    showDialog = signal(false);
    canal = signal<CanalVerification>('EMAIL');
    etape = signal<'saisie' | 'code'>('saisie');
    messageEnvoi = signal('');
    envoi = signal(false);
    destination = '';
    code = '';

    ngOnInit(): void {
        this.charger();
    }

    charger(): void {
        this.loading.set(true);
        this.erreur.set(null);
        this.userService
            .profilContacts$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.profil.set((r.data?.profil as ProfilContact) || null);
                    this.loading.set(false);
                },
                error: (err) => {
                    this.loading.set(false);
                    this.erreur.set(err || 'Profil indisponible');
                }
            });
    }

    ouvrir(canal: CanalVerification): void {
        this.canal.set(canal);
        this.etape.set('saisie');
        this.destination = '';
        this.code = '';
        this.showDialog.set(true);
    }

    fermer(): void {
        this.showDialog.set(false);
        this.envoi.set(false);
    }

    demanderCode(): void {
        if (!this.destination.trim()) return;
        this.envoi.set(true);
        this.userService
            .demanderCodeContact$(this.canal(), this.destination.trim())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.envoi.set(false);
                    this.messageEnvoi.set(r.data?.demande?.message || 'Un code vient de vous être envoyé.');
                    this.code = '';
                    this.etape.set('code');
                },
                error: (err) => {
                    this.envoi.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Envoi impossible', detail: err, life: 7000 });
                }
            });
    }

    confirmer(): void {
        if (this.code.trim().length !== 6) return;
        this.envoi.set(true);
        this.userService
            .confirmerCodeContact$(this.canal(), this.code.trim())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.envoi.set(false);
                    const confirmation = r.data?.confirmation;
                    if (confirmation?.profil) this.profil.set(confirmation.profil);
                    this.fermer();
                    this.messageService.add({
                        severity: 'success',
                        summary: confirmation?.identifiantChange ? 'Adresse confirmée' : 'Contact confirmé',
                        detail: confirmation?.message || 'Votre contact est à jour.',
                        life: 10000
                    });
                    this.charger();
                },
                error: (err) => {
                    this.envoi.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Code refusé', detail: err, life: 7000 });
                }
            });
    }
}
