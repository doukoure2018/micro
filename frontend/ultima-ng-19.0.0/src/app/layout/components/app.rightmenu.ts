import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { LayoutService } from '@/layout/service/layout.service';
import { UserService } from '@/service/user.service';
import { IResponse } from '@/interface/response';

/**
 * Le volet latéral : ce qui attend l'utilisateur, l'état des données, et ses agents.
 *
 * Il remplace le contenu de démonstration d'Ultima — ventes de t-shirts, avatars inventés,
 * réunions fictives. Trois règles le gouvernent :
 *
 *   - aucun montant : le volet s'ouvre par-dessus n'importe quel écran, souvent devant un
 *     client ou un collègue ;
 *   - aucune ligne à zéro : un volet qui énumère des zéros ne se lit plus ;
 *   - rien n'est chargé tant qu'il reste fermé, et il se recharge à chaque ouverture.
 */
@Component({
    selector: '[app-right-menu]',
    standalone: true,
    imports: [CommonModule, DrawerModule, FormsModule, RouterLink],
    template: `<p-drawer [(visible)]="rightMenuActive" position="right">
        <ng-template #headless>
            <div class="p-7">
                <!-- 1. Ce qui vous attend -->
                <div class="flex flex-col mb-8">
                    <span class="pb-2 mb-2 border-b border-surface font-semibold">CE QUI VOUS ATTEND</span>

                    @if (chargement()) {
                    <span class="text-sm text-gray-500 pt-2"><i class="pi pi-spin pi-spinner mr-2"></i>Lecture…</span>
                    } @else if (erreur()) {
                    <span class="text-sm text-orange-600 pt-2">{{ erreur() }}</span>
                    } @else if (!lignes().length) {
                    <span class="text-sm text-gray-500 pt-2"><i class="pi pi-check-circle text-green-600 mr-2"></i>Rien en attente de votre part.</span>
                    } @else {
                    <a *ngFor="let l of lignes()" [routerLink]="l.lien" (click)="rightMenuActive = false"
                        class="flex items-center justify-between py-2 px-2 rounded-md hover:bg-emphasis cursor-pointer no-underline text-color">
                        <span class="flex items-center">
                            <i class="pi mr-3" [ngClass]="icone(l.severite)" [class.text-red-600]="l.severite === 'urgent'"
                                [class.text-orange-500]="l.severite === 'attention'" [class.text-gray-500]="l.severite === 'info'"></i>
                            <span class="leading-normal">{{ l.libelle }}</span>
                        </span>
                        <span class="font-bold ml-3" [class.text-red-600]="l.severite === 'urgent'"
                            [class.text-orange-500]="l.severite === 'attention'">{{ l.nombre }}</span>
                    </a>
                    }
                </div>

                <!-- 2. L'état des données -->
                <div class="flex flex-col mb-8">
                    <span class="pb-2 mb-2 border-b border-surface font-semibold">L'ÉTAT DES DONNÉES</span>
                    @if (saf(); as s) {
                    <div class="flex items-center pt-2">
                        <i class="pi mr-3" [ngClass]="s.joignable ? 'pi-check-circle text-green-600' : 'pi-times-circle text-red-600'"></i>
                        <span class="text-sm">{{ s.joignable ? 'SAF répond' : 'SAF ne répond pas' }}</span>
                    </div>
                    <div class="flex items-start pt-2">
                        <i class="pi pi-database mr-3 mt-1" [class.text-orange-500]="s.sauvegardeActive" [class.text-green-600]="!s.sauvegardeActive"></i>
                        <span class="text-sm leading-normal">{{ s.mention || (s.sauvegardeActive ? 'Sauvegarde de la veille' : 'Base de production') }}</span>
                    </div>
                    <div *ngIf="s.dateDonnees" class="flex items-center pt-2">
                        <i class="pi pi-calendar mr-3 text-gray-500"></i>
                        <span class="text-sm">{{ s.dateDonnees }}</span>
                    </div>
                    <div *ngIf="s.enRestauration" class="text-sm text-orange-600 pt-2 leading-normal">
                        Restauration en cours : les chiffres SAF sont momentanément indisponibles.
                    </div>
                    } @else if (!chargement()) {
                    <span class="text-sm text-gray-500 pt-2">État des données non lu.</span>
                    }
                </div>

                <!-- 3. Mes agents -->
                @if (montreMesAgents()) {
                <div class="flex flex-col">
                    <span class="pb-2 mb-2 border-b border-surface font-semibold">MES AGENTS AUJOURD'HUI</span>
                    @if (!mesAgents().length) {
                    <span class="text-sm text-gray-500 pt-2">Aucun agent de crédit dans votre périmètre.</span>
                    } @else {
                    <div *ngFor="let a of mesAgents()" class="flex items-center justify-between py-2">
                        <span class="flex items-center">
                            <i class="pi pi-user mr-3" [class.text-green-600]="a.derniereConnexion" [class.text-gray-400]="!a.derniereConnexion"></i>
                            <span class="flex flex-col">
                                <span class="text-sm">{{ a.nom }}</span>
                                <small class="text-gray-500">{{ a.pointVente }}</small>
                            </span>
                        </span>
                        <small [class.text-green-700]="a.derniereConnexion" [class.text-gray-400]="!a.derniereConnexion">
                            {{ a.derniereConnexion ? (a.derniereConnexion | date: 'HH:mm') : 'pas connecté' }}
                        </small>
                    </div>
                    <small class="text-gray-500 mt-3 leading-normal">Dernière ouverture de digi aujourd'hui, pour les agents de votre périmètre.</small>
                    }
                </div>
                }
            </div>
        </ng-template>
    </p-drawer>`
})
export class AppRightMenu {
    private readonly layoutService = inject(LayoutService);
    private readonly userService = inject(UserService);
    private readonly destroyRef = inject(DestroyRef);

    readonly chargement = signal(false);
    readonly erreur = signal<string | null>(null);
    readonly lignes = signal<{ code: string; libelle: string; nombre: number; lien: string; severite: string }[]>([]);
    readonly saf = signal<{ joignable: boolean; enRestauration: boolean; sauvegardeActive: boolean; mention: string; dateDonnees: string } | null>(null);
    readonly mesAgents = signal<{ nom: string; pointVente: string; derniereConnexion: string | null }[]>([]);
    readonly montreMesAgents = signal(false);

    constructor() {
        // Rien n'est lu tant que le volet reste fermé, et tout est relu à chaque ouverture :
        // les compteurs n'ont d'intérêt que s'ils sont ceux de l'instant.
        effect(() => {
            if (this.layoutService.layoutState().rightMenuActive) {
                this.charger();
            }
        });
    }

    get rightMenuActive(): boolean {
        return this.layoutService.layoutState().rightMenuActive;
    }

    set rightMenuActive(_val: boolean) {
        this.layoutService.layoutState.update((prev) => ({ ...prev, rightMenuActive: _val }));
    }

    icone(severite: string): string {
        return severite === 'urgent' ? 'pi-exclamation-circle' : severite === 'attention' ? 'pi-flag' : 'pi-inbox';
    }

    private charger(): void {
        this.chargement.set(true);
        this.erreur.set(null);
        this.userService
            .getMonTableau$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    this.chargement.set(false);
                    const t = r.data?.tableau;
                    this.lignes.set(t?.lignes || []);
                    this.saf.set(t?.saf || null);
                    this.mesAgents.set(t?.mesAgents || []);
                    this.montreMesAgents.set(!!t?.montreMesAgents);
                },
                error: () => {
                    this.chargement.set(false);
                    // Un volet d'information ne doit pas crier : il dit qu'il n'a pas pu lire,
                    // et l'écran principal continue de fonctionner.
                    this.erreur.set("Impossible de lire votre tableau pour l'instant.");
                }
            });
    }
}
