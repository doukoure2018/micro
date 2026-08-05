import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

/**
 * DSIG — Répertoires SMS : les bases de diffusion (produit × segment) chargées
 * en amont par le responsable digital. Recharger = vider puis réimporter
 * (transactionnel : un fichier invalide conserve l'ancien contenu).
 */
@Component({
    selector: 'app-repertoires-sms',
    standalone: true,
    imports: [CommonModule, ButtonModule, TagModule, ToastModule, TooltipModule, FileUploadModule, ConfirmDialogModule],
    providers: [MessageService, ConfirmationService],
    template: `
        <p-toast></p-toast>
        <p-confirmDialog [style]="{ width: '460px' }"></p-confirmDialog>

        <div class="card">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold m-0">Répertoires SMS</h2>
                <button pButton icon="pi pi-refresh" class="p-button-text" (click)="load()" [loading]="state().loading"></button>
            </div>
            <p class="text-sm text-gray-500">
                Bases de diffusion utilisées comme source des campagnes SMS. Le rechargement <strong>vide puis réimporte</strong> le répertoire à partir du fichier (Excel/CSV, numéros en première colonne). Une campagne
                déjà lancée n'est jamais affectée par un rechargement.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                @for (r of state().repertoires; track r.repertoireId) {
                <div class="border rounded-lg p-4 flex flex-col gap-3" [class.border-orange-300]="!r.nbNumeros" [class.bg-orange-50]="!r.nbNumeros">
                    <div class="flex justify-between items-start">
                        <div>
                            <div class="font-bold">{{ r.libelle }}</div>
                            <div class="text-xs text-gray-500 mt-1">
                                <p-tag [value]="labelProduit(r.produit)" severity="info" size="small"></p-tag>
                                <p-tag [value]="r.segment === 'TOUS' ? 'Tous' : 'Actifs'" [severity]="r.segment === 'TOUS' ? 'secondary' : 'success'" size="small" class="ml-1"></p-tag>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-2xl font-bold" [class.text-orange-500]="!r.nbNumeros">{{ r.nbNumeros | number }}</div>
                            <div class="text-xs text-gray-500 uppercase">numéros</div>
                        </div>
                    </div>
                    <div class="text-xs text-gray-500">
                        @if (r.dateChargement) { Dernier chargement : {{ r.dateChargement | date: 'dd/MM/yyyy HH:mm' }} par {{ r.chargePar }} } @else {
                        <span class="text-orange-600">Jamais chargé</span>
                        }
                    </div>
                    <p-fileUpload
                        mode="basic"
                        [chooseLabel]="r.nbNumeros ? 'Recharger (vider + réimporter)' : 'Charger'"
                        chooseIcon="pi pi-upload"
                        accept=".xlsx,.xls,.csv,.txt"
                        [auto]="true"
                        [customUpload]="true"
                        (uploadHandler)="confirmerRechargement(r, $event)"
                        styleClass="p-button-sm p-button-outlined w-full"
                    ></p-fileUpload>
                    @if (state().rapports[r.repertoireId]; as rapport) {
                    <div class="text-xs p-2 rounded bg-blue-50 border border-blue-200">
                        {{ rapport.importes }} importé(s), {{ rapport.doublons }} doublon(s), {{ rapport.invalides }} invalide(s)
                        @if (rapport.numerosInvalides?.length) {
                        <div class="text-red-600 mt-1">Invalides : {{ rapport.numerosInvalides.slice(0, 10).join(', ') }}{{ rapport.numerosInvalides.length > 10 ? '…' : '' }}</div>
                        }
                    </div>
                    }
                </div>
                }
            </div>
        </div>
    `
})
export class RepertoiresSmsComponent implements OnInit {
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private destroyRef = inject(DestroyRef);

    state = signal<{ repertoires: any[]; rapports: Record<number, any>; loading: boolean }>({ repertoires: [], rapports: {}, loading: false });

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.state.update((s) => ({ ...s, loading: true }));
        this.userService
            .getRepertoiresSms$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => this.state.update((s) => ({ ...s, repertoires: response.data?.repertoires || [], loading: false })),
                error: (err) => {
                    this.state.update((s) => ({ ...s, loading: false }));
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Chargement impossible', life: 5000 });
                }
            });
    }

    confirmerRechargement(repertoire: any, event: { files: File[] }): void {
        const fichier = event.files?.[0];
        if (!fichier) return;

        if (!repertoire.nbNumeros) {
            this.recharger(repertoire, fichier);
            return;
        }
        this.confirmationService.confirm({
            message: `Le répertoire « ${repertoire.libelle} » contient ${repertoire.nbNumeros} numéros. Ils seront REMPLACÉS par le contenu du fichier « ${fichier.name} ». Continuer ?`,
            header: 'Vider puis recharger',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui, remplacer',
            rejectLabel: 'Annuler',
            accept: () => this.recharger(repertoire, fichier)
        });
    }

    private recharger(repertoire: any, fichier: File): void {
        this.userService
            .rechargerRepertoireSms$(repertoire.repertoireId, fichier)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    const rapport = response.data?.rapport;
                    this.state.update((s) => ({ ...s, rapports: { ...s.rapports, [repertoire.repertoireId]: rapport } }));
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Répertoire rechargé',
                        detail: `${repertoire.libelle} : ${rapport?.importes || 0} numéro(s)`,
                        life: 4000
                    });
                    this.load();
                },
                error: (err) => this.messageService.add({ severity: 'error', summary: 'Rechargement refusé', detail: err || "Échec de l'import — ancien contenu conservé", life: 6000 })
            });
    }

    labelProduit(produit: string): string {
        switch (produit) {
            case 'CREDIT_MOBILE':
                return 'Crédit Mobile';
            case 'CREDIT_MONEY':
                return 'Credit Money';
            case 'SAF':
                return 'Saf';
            default:
                return produit;
        }
    }
}
