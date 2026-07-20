import { IResponse } from '@/interface/response';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DeComponent } from '../../de/de.component';

/**
 * Vue DG de l'environnement Direction Exploitation : le DG voit exactement le
 * tableau de bord du DE (Suivi Global des crédits en cours + demandes en attente
 * de validation DE), en LECTURE SEULE (les actions Valider/Rejeter sont masquées
 * pour le rôle DG dans credit-par-delegation).
 */
@Component({
    selector: 'app-dg-vue-de',
    standalone: true,
    imports: [CommonModule, ProgressSpinnerModule, DeComponent],
    templateUrl: './vue-de.component.html'
})
export class DgVueDeComponent implements OnInit {
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
}
