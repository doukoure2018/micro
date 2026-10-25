import { IUser } from '@/interface/user';
import { HabilitationService } from '@/service/habilitation.service';
import { UserService } from '@/service/user.service';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AdminComponent } from '../admin/admin.component';
import { AgentCreditComponent } from '../agent-credit/agent-credit.component';
import { RespAgentComponent } from '../resp-agent/resp-agent.component';
import { ListStockComponent } from '../agent-credit/list-stock/list-stock.component';
import { RapprochementCaisseComponent } from '../agent-credit/rapprochement-caisse/rapprochement-caisse.component';
import { DigitalVerificationComponent } from '../agent-credit/digital-verification/digital-verification.component';
import { CorrectionRejetPpComponent } from '../agent-credit/correction-rejet-pp/correction-rejet-pp.component';
import { RotationAgentComponent } from '../agent-credit/rotation-agent/rotation-agent.component';
import { LogistiqueComponent } from '../agent-credit/logistique/logistique.component';
import { DeComponent } from '../admin/de/de.component';
import { SocietariatComponent } from '../agent-credit/societariat/societariat.component';
import { DemandeAvanceSalaireComponent } from '../admin/demande-avance-salaire/demande-avance-salaire.component';
import { RhComponent } from '../admin/rh/rh.component';
import { DfComponent } from '../admin/df/df.component';
import { SuiviArreteCaisseComponent } from '../admin/de/suivi-arrete-caisse/suivi-arrete-caisse.component';
import { CreditsAValiderDgComponent } from '../admin/dg/credits-a-valider-dg/credits-a-valider-dg.component';

@Component({
    selector: 'app-home',
    imports: [
        AdminComponent,
        AgentCreditComponent,
        RespAgentComponent,
        ListStockComponent,
        RapprochementCaisseComponent,
        DigitalVerificationComponent,
        CorrectionRejetPpComponent,
        RotationAgentComponent,
        LogistiqueComponent,
        DeComponent,
        SocietariatComponent,
        DemandeAvanceSalaireComponent,
        RhComponent,
        DfComponent,
        SuiviArreteCaisseComponent,
        CreditsAValiderDgComponent
    ],
    templateUrl: './home.component.html'
})
export class HomeComponent {
    state = signal<{ user?: IUser; loading: boolean; message: string | undefined; error: string | any }>({
        loading: false,
        message: undefined,
        error: undefined
    });
    private destroyRef = inject(DestroyRef);
    private userService = inject(UserService);
    private habilitations = inject(HabilitationService);
    private router = inject(Router);

    ngOnInit(): void {
        this.ouvrirSurLEcranDuDepartement();
        this.loadUserProfile();
    }

    /**
     * Accueil par departement (V178, lot 3). Un compte MANAGER de la DSIG n'avait aucun accueil
     * declare et tombait sur le cas par defaut, c'est-a-dire la verification des documents,
     * alors que les six autres directions ont chacune le leur. L'ecran d'accueil est desormais
     * une donnee du departement, et non une branche de ce gabarit.
     *
     * <p>L'accueil est declare par departement et non par service : sans cela, le centre de
     * validation atterrirait sur un ecran que la matrice ne lui accorde pas.</p>
     */
    private ouvrirSurLEcranDuDepartement(): void {
        this.habilitations
            .charger$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (h) => {
                    const accueil = h.accueil;
                    if (accueil && this.router.url.replace(/\/$/, '') === '/dashboards') {
                        this.router.navigateByUrl(accueil);
                    }
                },
                error: () => {}
            });
    }

    // this load user informations
    private loadUserProfile(): void {
        console.log('Loading user profile...');
        this.state.update((state) => ({ ...state, loading: true, message: undefined, error: undefined }));
        this.userService
            .getInstanceUser$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.state.update((state) => ({ ...state, loading: false, user: response.data.user, message: undefined, error: undefined }));
                },
                error: (error) => {
                    this.state.update((state) => ({ ...state, loading: false, user: undefined, message: undefined, error }));
                },
                complete: () => {}
            });
    }
}
