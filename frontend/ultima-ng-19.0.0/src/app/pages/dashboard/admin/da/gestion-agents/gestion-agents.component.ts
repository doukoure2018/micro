import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

/**
 * DA — Gestion des agents de l'agence : activation/désactivation des fonctions
 * ACCUEIL et CREDIT pour chaque AGENT_CREDIT / AGENT_ACCUEIL.
 * Un AGENT_CREDIT avec la fonction ACCUEIL active cumule les deux environnements.
 */
@Component({
    selector: 'app-gestion-agents',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, TagModule, ToastModule, TooltipModule, InputSwitchModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>
        <div class="card">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold m-0">Gestion des agents de mon agence</h2>
                <button pButton icon="pi pi-refresh" class="p-button-text" (click)="load()" [loading]="state().loading"></button>
            </div>
            <p class="text-sm text-gray-500">
                Activez ou désactivez les fonctions <strong>Accueil</strong> (réception des demandes) et <strong>Crédit</strong> (analyse) de vos agents. <strong>Les deux fonctions sont exclusives</strong> : tant que la
                fonction Accueil d'un agent de crédit est active, il saisit les demandes mais ne peut plus recevoir d'affectations ni analyser. Chaque changement est horodaté et nominatif.
            </p>

            <p-table [value]="state().agents" [loading]="state().loading" responsiveLayout="scroll">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Agent</th>
                        <th>Rôle de connexion</th>
                        <th>Point de vente</th>
                        <th class="text-center">Fonction Accueil</th>
                        <th class="text-center">Fonction Crédit</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-a>
                    <tr>
                        <td>
                            {{ a.firstName }} {{ a.lastName }}<br />
                            <span class="text-xs text-gray-500">{{ a.email }}</span>
                        </td>
                        <td>
                            <p-tag [value]="a.role === 'AGENT_ACCUEIL' ? 'Agent d\\'accueil' : 'Agent de crédit'" [severity]="a.role === 'AGENT_ACCUEIL' ? 'info' : 'success'"></p-tag>
                        </td>
                        <td>{{ a.pointventeLibele || '—' }}</td>
                        <td class="text-center">
                            <p-inputSwitch [ngModel]="estAccueil(a)" [disabled]="a.role === 'AGENT_ACCUEIL'" (onChange)="toggle(a, 'ACCUEIL', $event.checked)" pTooltip="Réception des demandes"></p-inputSwitch>
                        </td>
                        <td class="text-center">
                            <p-inputSwitch [ngModel]="estCredit(a)" [disabled]="a.role === 'AGENT_CREDIT'" (onChange)="toggle(a, 'CREDIT', $event.checked)" pTooltip="Analyse des demandes"></p-inputSwitch>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr>
                        <td colspan="5" class="text-center py-6 text-gray-500">Aucun agent dans votre agence.</td>
                    </tr>
                </ng-template>
            </p-table>

            <p class="text-xs text-gray-400 mt-3">
                Le rôle de connexion (posé à la création du compte) inclut d'office sa fonction de base : elle n'est pas désactivable ici. Seule la fonction complémentaire se gère (ex. Accueil pour un agent de crédit).
            </p>
        </div>
    `
})
export class GestionAgentsComponent implements OnInit {
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

    state = signal<{ agents: any[]; loading: boolean }>({ agents: [], loading: false });

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.state.update((s) => ({ ...s, loading: true }));
        this.userService
            .getAgentsAgence$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => this.state.set({ agents: response.data?.agents || [], loading: false }),
                error: (err) => {
                    this.state.update((s) => ({ ...s, loading: false }));
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Chargement impossible', life: 5000 });
                }
            });
    }

    /** Le rôle de base emporte sa fonction ; sinon on lit la fonction activée par le DA. */
    estAccueil(a: any): boolean {
        return a.role === 'AGENT_ACCUEIL' || !!a.fonctionAccueil;
    }

    estCredit(a: any): boolean {
        return a.role === 'AGENT_CREDIT' || !!a.fonctionCredit;
    }

    toggle(a: any, fonction: 'ACCUEIL' | 'CREDIT', actif: boolean): void {
        this.userService
            .setAgentFonction$(a.userId, fonction, actif)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Fonction mise à jour',
                        detail: `${fonction === 'ACCUEIL' ? 'Accueil' : 'Crédit'} ${actif ? 'activée' : 'désactivée'} pour ${a.firstName} ${a.lastName}`,
                        life: 4000
                    });
                    this.load();
                },
                error: (err) => {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Échec de la mise à jour', life: 5000 });
                    this.load();
                }
            });
    }
}
