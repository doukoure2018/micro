import { UserService } from '@/service/user.service';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { EMPTY, switchMap } from 'rxjs';

@Component({
    selector: 'app-mise-en-place-credit',
    imports: [],
    templateUrl: './mise-en-place-credit.component.html'
})
export class MiseEnPlaceCreditComponent {
    state = signal<{
        numeroMembre?: string;
        loading: boolean;
        message: string | undefined;
        error: string | any;
    }>({
        loading: false,
        message: undefined,
        error: undefined
    });

    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private activatedRouter = inject(ActivatedRoute);
    private userService = inject(UserService);

    ngOnInit(): void {
        this.redirectCredit();
    }

    private redirectCredit(): void {
        this.activatedRouter.paramMap
            .pipe(
                switchMap((params: ParamMap) => {
                    const numeroMembre = params.get('numeroMembre');
                    const userId = params.get('userId');
                    console.log('processus de verification de numeroMembre');
                    console.log('userId', userId);
                    console.log('numeroMembre', numeroMembre);
                    if (numeroMembre) {
                        const existMembre = this.userService.existNumeroMembre$(+numeroMembre);
                        this.state.set({ numeroMembre: numeroMembre, loading: true, message: undefined, error: undefined });
                        if (existMembre) {
                            return this.router.navigate(['/dashboards/start-credit/', numeroMembre, userId]);
                            //return this.router.navigate(['/dashboards/fiche-signaletique/', numeroMembre]);
                        } else {
                            return this.router.navigate(['/dashboards/start-credit/', numeroMembre, userId]);
                        }
                    } else {
                        this.state.set({ ...this.state(), loading: false, message: undefined, error: 'Invalide Code AgenceId or not exist' });
                        return EMPTY;
                    }
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }
}
