import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CorrectionPointVenteStats } from '@/interface/correction-pointvente-stats';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-societariat-by-ps',
    imports: [CommonModule, TableModule, RouterModule, ButtonModule],
  templateUrl: './societariat-by-ps.component.html',
  styleUrl: './societariat-by-ps.component.scss'
})
export class SocietariatByPsComponent {
    @Input() agenceLibele?: string;
    @Input() stats: CorrectionPointVenteStats[] = [];
    @Input() loading = false;
    @Input() error?: string;
}
