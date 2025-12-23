import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
        SocietariatComponent
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

    ngOnInit(): void {
        this.loadUserProfile();
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
