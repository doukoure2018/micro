import { PersonnePhysique } from '@/interface/personnePhysique';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-correction-rejet-pp',
    imports: [CommonModule, TableModule, ButtonModule, InputTextModule, ProgressSpinnerModule, TagModule, TooltipModule, CalendarModule, FormsModule, IconFieldModule, InputIconModule, CardModule, ToastModule],
    templateUrl: './correction-rejet-pp.component.html',
    styleUrl: './correction-rejet-pp.component.scss',
    providers: [MessageService]
})
export class CorrectionRejetPpComponent {
    @Input() user?: IUser;

    state = signal({
        listRejet: [] as PersonnePhysique[],
        loading: false,
        message: undefined as string | undefined,
        error: undefined as string | undefined,
        statusOptions: [
            { label: 'En attente', value: 'EN_ATTENTE' },
            { label: 'Suspendu', value: 'SUSPENDU' },
            { label: 'Validé', value: 'VALIDE' },
            { label: 'Rejeté', value: 'REJETE' }
        ],
        dateKeys: ['fecVencim', 'fechNacimiento', 'dateAttente', 'createdAt', 'updatedAt'],
        selectedPP: null as PersonnePhysique | null,
        searchValue: ''
    });

    private userService = inject(UserService);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private messageService = inject(MessageService);

    ngOnInit(): void {
        this.loadListePPRejet();
    }

    loadListePPRejet(): void {
        this.state.update((s) => ({ ...s, loading: true, error: undefined }));

        this.userService
            .getListPPRejet$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    if (response.code === 200 && response.data?.listRejet) {
                        const liste = Array.isArray(response.data.listRejet) ? response.data.listRejet : [response.data.listRejet];
                        const processedList = this.processDateArrays(liste);

                        this.state.update((s) => ({
                            ...s,
                            listRejet: processedList,
                            loading: false,
                            message: response.message
                        }));

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: `${processedList.length} correction(s) rejetée(s) chargée(s)`,
                            life: 3000
                        });
                    } else {
                        this.state.update((s) => ({
                            ...s,
                            listRejet: [],
                            loading: false,
                            error: response.message || 'Aucune donnée trouvée'
                        }));

                        this.messageService.add({
                            severity: 'info',
                            summary: 'Information',
                            detail: 'Aucune correction rejetée trouvée',
                            life: 3000
                        });
                    }
                },
                error: (error) => {
                    this.state.update((s) => ({
                        ...s,
                        loading: false,
                        error: error.message || 'Erreur lors du chargement des données'
                    }));

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Erreur lors du chargement des données',
                        life: 5000
                    });

                    console.error('Erreur lors du chargement:', error);
                }
            });
    }

    /**
     * Convertit les tableaux de dates en objets Date
     */
    processDateArrays(list: any[]): PersonnePhysique[] {
        return list.map((item) => {
            const processed = { ...item };

            // Convertir les tableaux de dates en chaînes formatées
            if (item.fecVencim && Array.isArray(item.fecVencim)) {
                processed.fecVencim = this.arrayToDateString(item.fecVencim);
            }

            if (item.fechNacimiento && Array.isArray(item.fechNacimiento)) {
                processed.fechNacimiento = this.arrayToDateString(item.fechNacimiento);
            }

            if (item.createdAt && Array.isArray(item.createdAt)) {
                processed.createdAt = this.arrayToDateTimeString(item.createdAt);
            }

            if (item.updatedAt && Array.isArray(item.updatedAt)) {
                processed.updatedAt = this.arrayToDateTimeString(item.updatedAt);
            }

            return processed;
        });
    }

    /**
     * Convertit un tableau de date [année, mois, jour] en chaîne
     */
    arrayToDateString(dateArray: number[]): string {
        if (!dateArray || dateArray.length < 3) return '';
        const [year, month, day] = dateArray;
        return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
    }

    /**
     * Convertit un tableau de date-heure en chaîne
     */
    arrayToDateTimeString(dateArray: number[]): string {
        if (!dateArray || dateArray.length < 6) return '';
        const [year, month, day, hour, minute, second] = dateArray;
        return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }

    /**
     * Obtenir la couleur du badge selon le statut
     */
    getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
        switch (status) {
            case 'EN_ATTENTE':
                return 'info';
            case 'VALIDE':
                return 'success';
            case 'REJETE':
                return 'danger';
            case 'SUSPENDU':
                return 'warn';
            default:
                return 'secondary';
        }
    }

    /**
     * Obtenir le label du statut
     */
    getStatusLabel(status: string): string {
        switch (status) {
            case 'EN_ATTENTE':
                return 'En attente';
            case 'VALIDE':
                return 'Validé';
            case 'REJETE':
                return 'Rejeté';
            case 'SUSPENDU':
                return 'Suspendu';
            default:
                return status;
        }
    }

    /**
     * Obtenir le label du sexe
     */
    getSexeLabel(sexe: string): string {
        return sexe === 'M' ? 'Masculin' : sexe === 'F' ? 'Féminin' : sexe;
    }

    /**
     * Obtenir le label de l'état civil
     */
    getEtatCivilLabel(etatCivil: string): string {
        switch (etatCivil) {
            case 'S':
                return 'Célibataire';
            case 'M':
                return 'Marié(e)';
            case 'D':
                return 'Divorcé(e)';
            case 'V':
                return 'Veuf/Veuve';
            case 'C':
                return 'Concubinage';
            default:
                return etatCivil;
        }
    }

    /**
     * Filtrer la liste selon la recherche
     */
    filteredList(): PersonnePhysique[] {
        const searchValue = this.state().searchValue.toLowerCase();

        if (!searchValue) {
            return this.state().listRejet;
        }

        return this.state().listRejet.filter(
            (pp) =>
                pp.nomCliente?.toLowerCase().includes(searchValue) ||
                pp.codCliente?.toLowerCase().includes(searchValue) ||
                pp.numId?.toLowerCase().includes(searchValue) ||
                pp.telPrincipal?.includes(searchValue) ||
                pp.codeAgence?.toLowerCase().includes(searchValue)
        );
    }

    /**
     * Rafraîchir la liste
     */
    refresh(): void {
        this.state.update((s) => ({ ...s, searchValue: '' }));
        this.loadListePPRejet();
    }

    /**
     * Voir les détails d'une personne physique
     */
    viewDetails(pp: PersonnePhysique): void {
        this.state.update((s) => ({ ...s, selectedPP: pp }));

        // Navigation vers la page de détails ou ouverture d'un dialog
        // Vous pouvez ajuster selon vos besoins
        console.log('Détails de:', pp);

        // Exemple de navigation avec l'ID
        // this.router.navigate(['/corrections/details', pp.id]);

        this.messageService.add({
            severity: 'info',
            summary: 'Détails',
            detail: `Consultation des détails de ${pp.nomCliente}`,
            life: 2000
        });
    }

    /**
     * Traiter une correction rejetée
     */
    processRejectedCorrection(pp: PersonnePhysique): void {
        // correction-en-attente/detail/:codCliente
        // Logique pour traiter une correction rejetée
        console.log('Traitement de la correction rejetée:', pp);
        this.router.navigate(['dashboards/update-correction-rejet/', pp.codCliente]);
    }

    /**
     * Exporter les données
     */
    exportData(): void {
        // Logique d'export (CSV, Excel, etc.)
        const dataToExport = this.filteredList();

        if (dataToExport.length === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Export',
                detail: 'Aucune donnée à exporter',
                life: 3000
            });
            return;
        }

        // Implémentation de l'export
        console.log('Export des données:', dataToExport);

        this.messageService.add({
            severity: 'success',
            summary: 'Export',
            detail: `${dataToExport.length} enregistrement(s) exporté(s)`,
            life: 3000
        });
    }

    // Getters pour les statistiques
    get totalRejet(): number {
        return this.state().listRejet.length;
    }

    get rejetCount(): number {
        return this.filteredList().filter((p) => p.correctionStatut === 'REJETE').length;
    }

    get filteredCount(): number {
        return this.filteredList().length;
    }
}
