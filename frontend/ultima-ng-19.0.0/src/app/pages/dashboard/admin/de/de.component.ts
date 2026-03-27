import { IUser } from '@/interface/user';
import { Component, Input } from '@angular/core';
import { CreditParDelegationComponent } from './credit-par-delegation/credit-par-delegation.component';
import { SuiviGlobalCreditsComponent } from './suivi-global-credits/suivi-global-credits.component';

@Component({
    selector: 'app-de',
    standalone: true,
    imports: [CreditParDelegationComponent, SuiviGlobalCreditsComponent],
    templateUrl: './de.component.html',
    styleUrl: './de.component.scss'
})
export class DeComponent {
    @Input() user?: IUser;
}
