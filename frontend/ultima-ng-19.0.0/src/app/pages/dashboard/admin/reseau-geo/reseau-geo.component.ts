import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

interface ReseauPoint {
    id?: number;
    delegation: string;
    agence: string;
    pointVente?: string;
    nom: string;
    contact?: string;
    type: string;
    latitude?: number;
    longitude?: number;
}

interface ImportReport {
    totalLignes: number;
    importes: number;
    ignorees: number;
    erreurs: string[];
}

@Component({
    selector: 'app-reseau-geo',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        CardModule,
        FileUploadModule,
        ButtonModule,
        TableModule,
        TagModule,
        DropdownModule,
        MessageModule,
        ProgressSpinnerModule,
        ToastModule
    ],
    templateUrl: './reseau-geo.component.html',
    providers: [MessageService]
})
export class ReseauGeoComponent implements OnInit {
    readonly TYPES = ['ABT', 'PS', 'KIOSQUE', 'GUICHET', 'PART'];
    readonly DELEGATIONS = ['CONAKRY', 'BASSE GUINEE', 'MOYENNE GUINEE', 'HAUTE GUINEE', 'GUINEE FORESTIERE'];

    typeOptions = [{ label: 'Tous les types', value: null }, ...this.TYPES.map((t) => ({ label: t, value: t }))];
    delegationOptions = [{ label: 'Toutes les délégations', value: null }, ...this.DELEGATIONS.map((d) => ({ label: d, value: d }))];

    // Filtres (liés au ngModel des dropdowns) — hors signal car two-way binding.
    filterDelegation: string | null = null;
    filterType: string | null = null;

    state = signal<{
        points: ReseauPoint[];
        soumissions: any[];
        report: ImportReport | null;
        selectedFile: File | null;
        loading: boolean;
        importing: boolean;
        exporting: boolean;
    }>({
        points: [],
        soumissions: [],
        report: null,
        selectedFile: null,
        loading: false,
        importing: false,
        exporting: false
    });

    get publicUrl(): string {
        return `${window.location.origin}/ajout-point`;
    }

    private userService = inject(UserService);
    private destroyRef = inject(DestroyRef);
    private messageService = inject(MessageService);

    ngOnInit(): void {
        this.loadPoints();
        this.loadSoumissions();
    }

    loadSoumissions(): void {
        this.userService
            .getSoumissions$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => this.state.update((s) => ({ ...s, soumissions: (r.data as any)?.soumissions || [] })),
                error: () => this.state.update((s) => ({ ...s, soumissions: [] }))
            });
    }

    validerSoumission(soum: any): void {
        this.userService
            .validerSoumission$(soum.id, { delegation: soum.delegation, agence: soum.agence, pointVente: soum.pointVente })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Validé', detail: `${soum.nom} publié sur la carte` });
                    this.loadSoumissions();
                    this.loadPoints();
                },
                error: (e) => this.messageService.add({ severity: 'error', summary: 'Erreur', detail: e?.message || 'Échec' })
            });
    }

    rejeterSoumission(soum: any): void {
        this.userService
            .rejeterSoumission$(soum.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.messageService.add({ severity: 'warn', summary: 'Rejeté', detail: `${soum.nom} rejeté` });
                    this.loadSoumissions();
                },
                error: (e) => this.messageService.add({ severity: 'error', summary: 'Erreur', detail: e?.message || 'Échec' })
            });
    }

    copierLienPublic(): void {
        navigator.clipboard?.writeText(this.publicUrl).then(
            () => this.messageService.add({ severity: 'info', summary: 'Lien copié', detail: 'Collez-le dans WhatsApp' }),
            () => {}
        );
    }

    mapsUrl(soum: any): string {
        return `https://www.google.com/maps?q=${soum.latitude},${soum.longitude}`;
    }

    loadPoints(): void {
        this.state.update((s) => ({ ...s, loading: true }));
        this.userService
            .getReseauPoints$(this.filterDelegation || undefined, this.filterType || undefined)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.state.update((s) => ({ ...s, points: (response.data as any)?.points || [], loading: false }));
                },
                error: () => this.state.update((s) => ({ ...s, points: [], loading: false }))
            });
    }

    onFilterChange(): void {
        this.loadPoints();
    }

    onFileSelect(event: any): void {
        const file: File = event.files?.[0];
        this.state.update((s) => ({ ...s, selectedFile: file || null, report: null }));
    }

    onFileClear(): void {
        this.state.update((s) => ({ ...s, selectedFile: null }));
    }

    importer(): void {
        const file = this.state().selectedFile;
        if (!file) {
            this.messageService.add({ severity: 'warn', summary: 'Fichier requis', detail: 'Choisissez un fichier .xlsx' });
            return;
        }
        this.state.update((s) => ({ ...s, importing: true, report: null }));
        this.userService
            .importReseau$(file)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    const report: ImportReport = (response.data as any)?.rapport;
                    this.state.update((s) => ({ ...s, importing: false, report }));
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Import terminé',
                        detail: `${report?.importes ?? 0} point(s) importé(s), ${report?.ignorees ?? 0} ignoré(s)`
                    });
                    this.loadPoints();
                },
                error: (error) => {
                    this.state.update((s) => ({ ...s, importing: false }));
                    this.messageService.add({ severity: 'error', summary: 'Échec de l\'import', detail: error?.message || 'Erreur' });
                }
            });
    }

    exporter(): void {
        this.state.update((s) => ({ ...s, exporting: true }));
        this.userService
            .exportReseau$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (blob: Blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'reseau_points_vente.xlsx';
                    a.click();
                    window.URL.revokeObjectURL(url);
                    this.state.update((s) => ({ ...s, exporting: false }));
                },
                error: () => {
                    this.state.update((s) => ({ ...s, exporting: false }));
                    this.messageService.add({ severity: 'error', summary: 'Échec de l\'export', detail: 'Impossible de générer le fichier' });
                }
            });
    }

    typeSeverity(type: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        switch (type) {
            case 'PS': return 'success';
            case 'KIOSQUE': return 'info';
            case 'ABT': return 'warn';
            case 'GUICHET': return 'danger';
            case 'PART': return 'contrast';
            default: return 'secondary';
        }
    }
}
