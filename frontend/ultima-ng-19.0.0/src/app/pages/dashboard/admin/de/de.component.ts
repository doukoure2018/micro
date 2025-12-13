import { IUser } from '@/interface/user';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-de',
    imports: [],
    templateUrl: './de.component.html',
    styleUrl: './de.component.scss'
})
export class DeComponent {
    @Input() user?: IUser;
}
