import { DemandeIndividuel } from '@/interface/demande-individuel.interface';
import { NewCredit } from '@/interface/newCredit';
import { PointVente } from '@/interface/point.vente';
import { IResponse } from '@/interface/response';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-agent-credit',
    standalone: true,
    imports: [CommonModule, ButtonModule, RippleModule, MessageModule, RouterLink, TableModule, IconFieldModule, InputIconModule, InputTextModule, TagModule, ToastModule, BadgeModule, ChipModule, ProgressSpinnerModule],
    templateUrl: './agent-credit.component.html',
    providers: [MessageService]
})
export class AgentCreditComponent implements OnInit {
    // ⭐ SUPPRIMÉ @Input() user - on charge directement

    state = signal<{
        user?: IUser;
        pointVente?: PointVente;
        demandeAttentes?: DemandeIndividuel[];
        filteredDemandeAttentes?: DemandeIndividuel[];
        creditDtos?: NewCredit[];
        nombreDemandeInd?: number;
        workflowEnCorrection: any[];
        workflowCorrectionDR: any[];
        workflowSuiviValidation: any[];
        loading: boolean;
        message: string | undefined;
        error: string | any;
        isAgentActive?: boolean;
        checkingStatus: boolean;
    }>({
        user: undefined,
        loading: false,
        message: undefined,
        error: undefined,
        filteredDemandeAttentes: [],
        workflowEnCorrection: [],
        workflowCorrectionDR: [],
        workflowSuiviValidation: [],
        isAgentActive: undefined,
        checkingStatus: false
    });

    private userService = inject(UserService);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private messageService = inject(MessageService);

    ngOnInit(): void {
        console.log('🔧 AgentCredit ngOnInit - Loading user...');
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

                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: 'Impossible de charger vos informations',
                            life: 5000
                        });
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
    private checkAgentStatus(user: IUser): void {
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
                            detail: "Vous n'êtes pas activé dans ce point de service. Veuillez contacter votre responsable.",
                            life: 10000
                        });
                    } else {
                        console.log('✅ Agent is ACTIVE - Loading demandes...');
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Accès Autorisé',
                            detail: 'Chargement des données...',
                            life: 3000
                        });
                        this.laodDemandeAttenteByPointVente();
                        this.loadWorkflowEnCorrection();
                        this.loadWorkflowCorrectionDR();
                        this.loadSuiviValidation();
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
                        detail: "Impossible de vérifier votre statut d'activation. Veuillez réessayer.",
                        life: 5000
                    });
                }
            });
    }

    /**
     * Charger les demandes en attente
     */
    private laodDemandeAttenteByPointVente(): void {
        console.log('📋 laodDemandeAttenteByPointVente called');

        const user = this.state().user;
        if (!user?.pointventeId) {
            console.warn('⚠️ No pointventeId available');
            return;
        }

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

        console.log('🔄 Loading demandes attente...');
        this.state.update((state) => ({ ...state, loading: true, error: undefined }));

        this.userService
            .getAllDemandeAttente$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    console.log('📥 Demandes attente response:', response);

                    const allDemandes = response.data?.demandeAttentes || [];
                    const filteredDemandes = allDemandes.filter((demande) => demande.validationState === 'VALIDATION');

                    console.log('✅ Loaded demandes:', {
                        total: allDemandes.length,
                        filtered: filteredDemandes.length
                    });

                    this.state.update((state) => ({
                        ...state,
                        demandeAttentes: allDemandes,
                        filteredDemandeAttentes: filteredDemandes,
                        pointVente: response.data?.pointVente,
                        creditDtos: response.data?.creditDtos || [],
                        nombreDemandeInd: response.data?.nombreDemandeInd || 0,
                        loading: false
                    }));

                    if (allDemandes.length > 0) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: `${allDemandes.length} demande(s) chargée(s)`,
                            life: 3000
                        });
                    }
                },
                error: (error) => {
                    console.error('❌ Error loading demandes:', error);
                    this.state.update((state) => ({
                        ...state,
                        error: 'Erreur lors du chargement des demandes',
                        loading: false
                    }));

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger les demandes en attente',
                        life: 5000
                    });
                }
            });
    }

    /**
     * Rafraîchir les données
     */
    public refresh(): void {
        console.log('🔄 Refresh clicked');
        if (this.state().isAgentActive) {
            this.laodDemandeAttenteByPointVente();
            this.loadWorkflowEnCorrection();
            this.loadWorkflowCorrectionDR();
            this.loadSuiviValidation();
        } else {
            this.loadUserAndCheckStatus();
        }
    }

    /**
     * Recharger la page complète
     */
    public reloadPage(): void {
        window.location.reload();
    }

    // === Méthodes utilitaires ===

    getStatusLabel(statutDemande: string, validationState: string): string {
        if (statutDemande === 'EN_ATTENTE' && validationState === 'NOUVEAU') {
            return 'NOUVELLE DEMANDE';
        } else if (statutDemande === 'EN_ATTENTE' && validationState === 'SELECTION') {
            return 'SELECTION';
        }
        return statutDemande;
    }

    getStateValidation(statutDemande: string, validationState: string): string {
        if (statutDemande === 'EN_ATTENTE' && validationState === 'NOUVEAU') {
            return 'EN ATTENTE POUR LA SELECTION';
        } else if (statutDemande === 'EN_ATTENTE' && validationState === 'SELECTION') {
            return 'EN ATTENTE POUR LA VALIDATION';
        } else if (statutDemande === 'EN_ATTENTE' && validationState === 'APPROVED') {
            return "DEMANDE APPROVEE PAR L'AGENT";
        }
        return validationState;
    }

    onGlobalFilter(table: any, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    getStatusSeverity(statutDemande: string, validationState: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
        if (statutDemande === 'APPROVED') return 'success';
        if (statutDemande === 'EN_ATTENTE') return 'info';
        if (statutDemande === 'REJECTED') return 'danger';
        return undefined;
    }

    miseEnPlaceCredit(numeroMembre: string): void {
        if (!this.state().isAgentActive) {
            this.messageService.add({
                severity: 'error',
                summary: 'Accès Refusé',
                detail: 'Vous devez être activé dans ce point de service pour effectuer cette action',
                life: 5000
            });
            return;
        }
        this.router.navigate(['/dashboards/agent-credit/verification/', numeroMembre]);
    }

    viewCreditDetails(referenceCredit: string, numeroMembre: string): void {
        if (!this.state().isAgentActive) {
            this.messageService.add({
                severity: 'error',
                summary: 'Accès Refusé',
                detail: 'Vous devez être activé dans ce point de service pour effectuer cette action',
                life: 5000
            });
            return;
        }
        this.router.navigate(['/dashboards/agent-credit/detail-credit-ind/', referenceCredit, numeroMembre]);
    }

    // ==================== WORKFLOW HIERARCHIQUE ====================

    private loadWorkflowEnCorrection(): void {
        this.userService.getEnCorrectionAC$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.state.update(s => ({
                        ...s,
                        workflowEnCorrection: response.data?.workflowDemandes || []
                    }));
                },
                error: () => {}
            });
    }

    private loadWorkflowCorrectionDR(): void {
        this.userService.getEnCorrectionDRForAC$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.state.update(s => ({
                        ...s,
                        workflowCorrectionDR: response.data?.workflowDemandes || []
                    }));
                },
                error: () => {}
            });
    }

    private loadSuiviValidation(): void {
        this.userService.getSuiviValidationAC$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.state.update(s => ({
                        ...s,
                        workflowSuiviValidation: response.data?.workflowDemandes || []
                    }));
                },
                error: () => {}
            });
    }

    hasWorkflowEnCorrection(): boolean {
        return this.state().workflowEnCorrection.length > 0;
    }

    hasWorkflowCorrectionDR(): boolean {
        return this.state().workflowCorrectionDR.length > 0;
    }

    hasSuiviValidation(): boolean {
        return this.state().workflowSuiviValidation.length > 0;
    }

    getValidationStateLabel(validationState: string): string {
        const labels: Record<string, string> = {
            APPROVED: 'En attente DA',
            VALIDATED_DA: 'En attente DR',
            VALIDATED_DR: 'En attente DE',
            VALIDATED_FINAL: 'Valide'
        };
        return labels[validationState] || validationState;
    }

    getValidationStateSeverity(validationState: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
        const severities: Record<string, any> = {
            APPROVED: 'info',
            VALIDATED_DA: 'warn',
            VALIDATED_DR: 'secondary',
            VALIDATED_FINAL: 'success'
        };
        return severities[validationState] || 'info';
    }

    formatMontantGNF(montant: number): string {
        if (!montant || montant === 0) return '0 GNF';
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'GNF', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(montant);
    }

    viewDemandeDetail(demandeId: number): void {
        this.router.navigate(['/dashboards/credit/individuel/attente/detail', demandeId]);
    }

    hasDemandeCorrectionSection(demande: any): boolean {
        const sections = demande.sectionsARevoirDa || '';
        return sections.includes('GARANTIE') || sections.includes('DEMANDE_COMPLETE');
    }

    navigateCorrectionDemande(demandeId: number): void {
        this.router.navigate(['/dashboards/agent-credit/correction-demande', demandeId]);
    }
}
