import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-guide-circuit-credit',
    standalone: true,
    imports: [CommonModule, ButtonModule, TagModule],
    templateUrl: './guide-circuit-credit.component.html',
    styleUrl: './guide-circuit-credit.component.scss'
})
export class GuideCircuitCreditComponent {
    imprimer(): void {
        window.print();
    }
}
