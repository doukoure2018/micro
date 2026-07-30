import { IResponse } from '@/interface/response';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SuiviGlobalCreditsComponent } from '../../de/suivi-global-credits/suivi-global-credits.component';

/**
 * Suivi des crédits du réseau pour les DA et DR, en LECTURE SEULE :
 * un DA voit tous les dossiers de son agence, un DR ceux de sa délégation
 * (en cours de circuit + en attente/rejet DG + validés DE/DG).
 * Le périmètre est imposé côté serveur depuis le compte connecté.
 */
@Component({
    selector: 'app-suivi-credits-reseau',
    standalone: true,
    imports: [CommonModule, ProgressSpinnerModule, SuiviGlobalCreditsComponent],
    templateUrl: './suivi-credits-reseau.component.html'
})
export class SuiviCreditsReseauComponent implements OnInit {
    state = signal<{ user?: IUser; loading: boolean }>({ loading: true });

    private userService = inject(UserService);
    private destroyRef = inject(DestroyRef);

    ngOnInit(): void {
        this.userService
            .getInstanceUser$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => this.state.update((s) => ({ ...s, user: (r.data as any)?.user, loading: false })),
                error: () => this.state.update((s) => ({ ...s, loading: false }))
            });
    }

    get perimetreLabel(): string {
        const user = this.state().user;
        return user?.role === 'DR' ? 'ma délégation' : 'mon agence';
    }
}
