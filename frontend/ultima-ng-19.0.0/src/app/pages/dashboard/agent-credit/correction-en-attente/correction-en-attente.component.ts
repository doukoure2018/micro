import { PersonnePhysique } from '@/interface/personnePhysique';
import { UserService } from '@/service/user.service';
import { Component, DestroyRef, inject, signal, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';

interface StateType {
    listePPAttente: PersonnePhysique[];
    loading: boolean;
    message: string | undefined;
    error: string | any;
    statusOptions: { label: string; value: string }[];
    dateKeys: string[];
    selectedPP: PersonnePhysique | null;
    searchValue: string;
}

@Component({
    selector: 'app-correction-en-attente',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, InputTextModule, ProgressSpinnerModule, TagModule, TooltipModule, CalendarModule, FormsModule, IconFieldModule, InputIconModule, CardModule, ToastModule],
    templateUrl: './correction-en-attente.component.html',
    styleUrl: './correction-en-attente.component.scss',
    providers: [MessageService]
})
export class CorrectionEnAttenteComponent implements OnInit {
    state = signal<StateType>({
        listePPAttente: [],
        loading: false,
        message: undefined,
        error: undefined,
        statusOptions: [
            { label: 'En attente', value: 'A' },
            { label: 'Suspendu', value: 'S' },
            { label: 'Validé', value: 'V' },
            { label: 'Rejeté', value: 'R' }
        ],
        dateKeys: ['fecVencim', 'fechNacimiento', 'dateAttente', 'createdAt', 'updatedAt'],
        selectedPP: null,
        searchValue: ''
    });

    // Computed pour le filtrage
    filteredList = computed(() => {
        const searchValue = this.state().searchValue.toLowerCase();
        if (!searchValue) {
            return this.state().listePPAttente;
        }

        return this.state().listePPAttente.filter(
            (pp) => pp.nomCliente?.toLowerCase().includes(searchValue) || pp.codCliente?.toLowerCase().includes(searchValue) || pp.numId?.toLowerCase().includes(searchValue) || pp.telPrincipal?.toLowerCase().includes(searchValue)
        );
    });

    private userService = inject(UserService);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private messageService = inject(MessageService);

    ngOnInit(): void {
        this.loadListePPAttente();
    }

    loadListePPAttente(): void {
        this.state.update((s) => ({ ...s, loading: true, error: undefined }));

        this.userService
            .getListPPAttente$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    if (response.code === 200 && response.data?.listePPAttente) {
                        const liste = Array.isArray(response.data.listePPAttente) ? response.data.listePPAttente : [response.data.listePPAttente];
                        const processedList = this.processDateArrays(liste);
                        this.state.update((s) => ({
                            ...s,
                            listePPAttente: processedList,
                            loading: false,
                            message: response.message
                        }));

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: `${processedList.length} personne(s) physique(s) en attente chargée(s)`
                        });
                    } else {
                        this.state.update((s) => ({
                            ...s,
                            loading: false,
                            error: response.message || 'Aucune donnée trouvée'
                        }));

                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Attention',
                            detail: response.message || 'Aucune donnée trouvée'
                        });
                    }
                },
                error: (error) => {
                    this.state.update((s) => ({
                        ...s,
                        loading: false,
                        error: error
                    }));

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Erreur lors du chargement des données'
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
     * Navigation vers les détails
     */
    viewDetails(pp: PersonnePhysique): void {
        this.router.navigate(['dashboards/correction-en-attente/detail', pp.codCliente]);
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
            default:
                return 'secondary';
        }
    }

    /**
     * Obtenir le label du statut
     */
    getStatusLabel(status: string): string {
        const option = this.state().statusOptions.find((opt) => opt.value === status);
        return option ? option.label : status;
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
     * Rafraîchir la liste
     */
    refresh(): void {
        this.state.update((s) => ({ ...s, searchValue: '' }));
        this.loadListePPAttente();
    }

    /**
     * Mettre à jour la recherche
     */
    onSearchChange(value: string): void {
        this.state.update((s) => ({ ...s, searchValue: value }));
    }

    // Add this getter to your component class
    get enAttenteCount(): number {
        return this.filteredList().filter((p) => p.correctionStatut === 'EN_ATTENTE').length;
    }
}
