import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CorrectionAgenceStats } from '@/interface/correction-agence-stats';

@Component({
    selector: 'app-societariat-by-agence',
    imports: [CommonModule, TableModule],
    templateUrl: './societariat-by-agence.component.html',
    styleUrl: './societariat-by-agence.component.scss'
})
export class SocietariatByAgenceComponent {
    @Input() delegationLibele?: string;
    @Input() stats: CorrectionAgenceStats[] = [];
    @Input() loading = false;
    @Input() error?: string;
    @Output() agenceSelected = new EventEmitter<CorrectionAgenceStats>();

    onSelect(row: CorrectionAgenceStats): void {
        this.agenceSelected.emit(row);
    }
}
