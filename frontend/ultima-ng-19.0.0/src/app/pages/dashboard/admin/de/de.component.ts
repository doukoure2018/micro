// de.component.ts
import { IUser } from '@/interface/user';
import { Component, Input } from '@angular/core';
import { CreditParDelegationComponent } from './credit-par-delegation/credit-par-delegation.component';

@Component({
    selector: 'app-de',
    standalone: true,
    imports: [CreditParDelegationComponent],
    templateUrl: './de.component.html',
    styleUrl: './de.component.scss'
})
export class DeComponent {
    @Input() user?: IUser;
    protected CreditParDelegationComponent = CreditParDelegationComponent;
}
