import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IResponse } from '@/interface/response';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { RhComponent } from '../../admin/rh/rh.component';

/**
 * V154 — accès à la validation des avances sur salaire depuis le menu Administration DRH
 * (profil DRH complet ou délégation AVANCES). Réutilise l'écran RH du tableau de bord ;
 * la logique de validation et la confirmation DF sont inchangées.
 */
@Component({
    selector: 'app-validation-avances',
    standalone: true,
    imports: [CommonModule, ProgressSpinnerModule, RhComponent],
    template: `
        @if (state().loading) {
        <div class="flex justify-center p-6"><p-progressSpinner /></div>
        } @else {
        <app-rh [user]="state().user"></app-rh>
        }
    `
})
export class ValidationAvancesComponent implements OnInit {
    state = signal<{ user?: IUser; loading: boolean }>({ loading: true });
    private userService = inject(UserService);
    private destroyRef = inject(DestroyRef);

    ngOnInit(): void {
        this.userService.getInstanceUser$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (r: IResponse) => this.state.update((s) => ({ ...s, user: (r.data as any)?.user, loading: false })),
            error: () => this.state.update((s) => ({ ...s, loading: false }))
        });
    }
}
