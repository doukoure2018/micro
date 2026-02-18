import { PersonnePhysique } from '@/interface/personnePhysique';
import { IResponse } from '@/interface/response';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal, OnInit, computed, Input, OnChanges, SimpleChanges } from '@angular/core';
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

interface StateType {
    listePPAttente: PersonnePhysique[];
    loading: boolean;
    message: string | undefined;
    error: string | any;
    statusOptions: { label: string; value: string }[];
    dateKeys: string[];
    selectedPP: PersonnePhysique | null;
    searchValue: string;
    isAgentActive?: boolean;
    checkingStatus: boolean;
}

interface StateType {
    user?: IUser;
    listePPAttente: PersonnePhysique[];
    loading: boolean;
    message: string | undefined;
    error: string | any;
    statusOptions: { label: string; value: string }[];
    dateKeys: string[];
    selectedPP: PersonnePhysique | null;
    searchValue: string;
    isAgentActive?: boolean;
    checkingStatus: boolean;
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
        user: undefined,
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
        searchValue: '',
        isAgentActive: undefined,
        checkingStatus: false
    });

    selectedStatut = signal<string>('EN_ATTENTE');

    filteredList = computed(() => {
        const searchValue = this.state().searchValue.toLowerCase();
        const statut = this.selectedStatut();
        let list = this.state().listePPAttente;

        // Filtrer par statut
        if (statut !== 'TOUS') {
            list = list.filter((pp) => pp.correctionStatut === statut);
        }

        // Filtrer par recherche
        if (searchValue) {
            list = list.filter((pp) => pp.nomCliente?.toLowerCase().includes(searchValue) || pp.codCliente?.toLowerCase().includes(searchValue) || pp.numId?.toLowerCase().includes(searchValue) || pp.telPrincipal?.toLowerCase().includes(searchValue));
        }

        return list;
    });

    enAttenteTotal = computed(() => this.state().listePPAttente.filter((p) => p.correctionStatut === 'EN_ATTENTE').length);
    valideTotal = computed(() => this.state().listePPAttente.filter((p) => p.correctionStatut === 'VALIDE').length);

    private userService = inject(UserService);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private messageService = inject(MessageService);

    ngOnInit(): void {
        console.log('🔧 ngOnInit - Chargement du user...');
        this.loadUserAndCheckStatus();
    }

    /**
     * Charger l'utilisateur connecté et vérifier son statut
     */
    private loadUserAndCheckStatus(): void {
        console.log('👤 Loading user from API...');

        this.state.update((s) => ({ ...s, checkingStatus: true }));

        this.userService
            .getInstanceUser$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    console.log('📥 User API response:', response);

                    const user = response.data?.user;

                    if (!user) {
                        console.error('❌ No user in response');
                        this.state.update((s) => ({
                            ...s,
                            checkingStatus: false,
                            error: 'Impossible de charger les informations utilisateur'
                        }));
                        return;
                    }

                    console.log('✅ User loaded:', {
                        userId: user.userId,
                        pointventeId: user.pointventeId,
                        role: user.role,
                        firstName: user.firstName,
                        lastName: user.lastName
                    });

                    this.state.update((s) => ({ ...s, user }));

                    // Vérifier le statut d'activation
                    if (user.userId && user.pointventeId) {
                        this.checkAgentStatus(user);
                    } else {
                        console.error('❌ User missing userId or pointventeId');
                        this.state.update((s) => ({
                            ...s,
                            checkingStatus: false,
                            isAgentActive: false,
                            error: 'Point de vente non assigné'
                        }));

                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Attention',
                            detail: 'Aucun point de vente assigné à votre compte',
                            life: 5000
                        });
                    }
                },
                error: (error) => {
                    console.error('❌ Error loading user:', error);
                    this.state.update((s) => ({
                        ...s,
                        checkingStatus: false,
                        error: 'Erreur lors du chargement des informations utilisateur'
                    }));

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger vos informations',
                        life: 5000
                    });
                }
            });
    }

    /**
     * Vérifier si l'agent est actif dans son point de vente
     */
    public checkAgentStatus(user: IUser): void {
        console.log('🔍 checkAgentStatus called for:', {
            userId: user.userId,
            pointventeId: user.pointventeId
        });

        this.userService
            .checkAgentDisponibility$(user.userId, user.pointventeId!)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    console.log('📥 Status check response:', response);

                    const disponibility = response.data?.disponibilityAgent;
                    const isActive = disponibility?.isActive || false;

                    console.log('✅ Agent status:', {
                        isActive,
                        message: disponibility?.message,
                        currentPs: disponibility?.currentPs
                    });

                    this.state.update((state) => ({
                        ...state,
                        isAgentActive: isActive,
                        checkingStatus: false
                    }));

                    if (!isActive) {
                        console.warn('⚠️ Agent is NOT active');
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Accès Restreint',
                            detail: "Vous n'êtes pas activé dans ce point de service.",
                            life: 10000
                        });
                    } else {
                        console.log('✅ Agent is ACTIVE - Loading data...');
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Accès Autorisé',
                            detail: 'Chargement des données...',
                            life: 3000
                        });
                        this.loadListePPAttente();
                    }
                },
                error: (error) => {
                    console.error('❌ Error checking agent status:', error);
                    this.state.update((state) => ({
                        ...state,
                        isAgentActive: false,
                        checkingStatus: false,
                        error: 'Impossible de vérifier votre statut'
                    }));

                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Erreur',
                        detail: "Impossible de vérifier votre statut d'activation.",
                        life: 5000
                    });
                }
            });
    }

    /**
     * Charger la liste des personnes physiques en attente
     */
    /**
     * Charger la liste des personnes physiques en attente
     */
    loadListePPAttente(): void {
        console.log('📋 loadListePPAttente called');

        if (this.state().isAgentActive === false) {
            console.warn('⚠️ Cannot load data - Agent not active');
            this.messageService.add({
                severity: 'warn',
                summary: 'Accès Refusé',
                detail: 'Vous devez être activé pour accéder aux données',
                life: 3000
            });
            return;
        }

        console.log('🔄 Loading PP Attente list...');
        this.state.update((s) => ({ ...s, loading: true, error: undefined }));

        this.userService
            .getListPPAttente$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    console.log('📥 PP Attente response:', response);

                    if (response.code === 200 && response.data?.listePPAttente) {
                        const liste = Array.isArray(response.data.listePPAttente) ? response.data.listePPAttente : [response.data.listePPAttente];
                        const processedList = this.processDateArrays(liste);

                        console.log('✅ Loaded PP Attente:', processedList.length);

                        this.state.update((s) => ({
                            ...s,
                            listePPAttente: processedList,
                            loading: false,
                            message: response.message
                        }));

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: `${processedList.length} personne(s) chargée(s)`,
                            life: 3000
                        });
                    } else {
                        console.warn('⚠️ No data in response');
                        this.state.update((s) => ({
                            ...s,
                            listePPAttente: [],
                            loading: false,
                            error: 'Aucune donnée trouvée'
                        }));

                        this.messageService.add({
                            severity: 'info',
                            summary: 'Information',
                            detail: 'Aucune personne physique en attente',
                            life: 3000
                        });
                    }
                },
                error: (error) => {
                    console.error('❌ Error loading PP Attente:', error);
                    this.state.update((s) => ({
                        ...s,
                        loading: false,
                        error: 'Erreur lors du chargement'
                    }));

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Erreur lors du chargement des données',
                        life: 5000
                    });
                }
            });
    }

    processDateArrays(list: any[]): PersonnePhysique[] {
        return list.map((item) => {
            const processed = { ...item };
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

    arrayToDateString(dateArray: number[]): string {
        if (!dateArray || dateArray.length < 3) return '';
        const [year, month, day] = dateArray;
        return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
    }

    arrayToDateTimeString(dateArray: number[]): string {
        if (!dateArray || dateArray.length < 6) return '';
        const [year, month, day, hour, minute, second] = dateArray;
        return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }

    viewDetails(pp: PersonnePhysique): void {
        if (this.state().isAgentActive === false) {
            this.messageService.add({
                severity: 'error',
                summary: 'Accès Refusé',
                detail: 'Vous devez être activé',
                life: 5000
            });
            return;
        }
        this.router.navigate(['dashboards/correction-en-attente/detail', pp.codCliente]);
    }

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

    getStatusLabel(status: string): string {
        const option = this.state().statusOptions.find((opt) => opt.value === status);
        return option ? option.label : status;
    }

    getSexeLabel(sexe: string): string {
        return sexe === 'M' ? 'Masculin' : sexe === 'F' ? 'Féminin' : sexe;
    }

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

    public refresh(): void {
        console.log('🔄 Refresh clicked');
        if (this.state().isAgentActive) {
            this.state.update((s) => ({ ...s, searchValue: '' }));
            this.loadListePPAttente();
        } else {
            this.loadUserAndCheckStatus();
        }
    }

    onSearchChange(value: string): void {
        this.state.update((s) => ({ ...s, searchValue: value }));
    }

    onStatutChange(statut: string): void {
        this.selectedStatut.set(statut);
    }

    public reloadPage(): void {
        window.location.reload();
    }

    // ⭐ Mise à jour du getter pour utiliser state().user
    get enAttenteCount(): number {
        return this.filteredList().filter((p) => p.correctionStatut === 'EN_ATTENTE').length;
    }
}
